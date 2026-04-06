/**
 * Zoho Service Account (Platform-wide) Integration Service
 * This service handles data synchronization using the Dabby Service Account: opportunities@datalis.in
 */

const ZOHO_CLIENT_ID = import.meta.env.VITE_ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = import.meta.env.VITE_ZOHO_CLIENT_SECRET;

// In a real production app, the MASTER_REFRESH_TOKEN for opportunities@datalis.in 
// would be stored securely in a backend vault or Supabase 'platform_settings' table.
let MASTER_REFRESH_TOKEN = import.meta.env.VITE_ZOHO_PLATFORM_REFRESH_TOKEN;

/**
 * Get a valid access token for the Dabby Service Account.
 */
export const getPlatformAccessToken = async () => {
    try {
        if (!MASTER_REFRESH_TOKEN) {
            throw new Error('Platform Zoho Master Token not configured');
        }

        const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token'; // Defaulting to .in as requested
        const params = new URLSearchParams();
        params.append('refresh_token', MASTER_REFRESH_TOKEN);
        params.append('client_id', ZOHO_CLIENT_ID);
        params.append('client_secret', ZOHO_CLIENT_SECRET);
        params.append('grant_type', 'refresh_token');

        const response = await fetch(tokenUrl, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await response.json();
        if (data.error) throw new Error(`Zoho Refresh Failed: ${data.error}`);

        return data.access_token;
    } catch (err) {
        console.error('Error in getPlatformAccessToken:', err);
        throw err;
    }
};

/**
 * Fetch Chart of Accounts from Zoho Books for a specific Organization
 * @param {string} organizationId - The Zoho Organization ID provided by the user
 */
/**
 * Verify or Discover if the Dabby Service Account has access to a specific Zoho Organization
 * @param {string} organizationId - Optional: specific Org ID to verify
 * @param {string} userEmail - Required: User's email to match against Zoho organizations
 */
export const verifyZohoAccess = async (organizationId, userEmail) => {
    try {
        const accessToken = await getPlatformAccessToken();
        console.log('Zoho Auth: Token acquired (Starts with:', accessToken.substring(0, 5) + '...)');

        // Fetch all organizations accessible by the Master Token
        const apiUrl = `https://books.zoho.in/api/v3/organizations`;
        console.log('Zoho API: Fetching organizations from', apiUrl);

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });

        console.log('Zoho API: Response status:', response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error('Zoho API Error Body:', errText);
            throw new Error(`Zoho API Verification Failed (${response.status})`);
        }

        const data = await response.json();
        console.log('Zoho API: Organizations found:', data.organizations?.length || 0);
        const organizations = data.organizations || [];

        let matchedOrg = null;

        if (organizationId) {
            console.log('Zoho Lookup: Searching for Org ID:', organizationId);
            matchedOrg = organizations.find(org => org.organization_id === organizationId.trim());
        } else if (userEmail) {
            console.log('Zoho Lookup: Searching for Email:', userEmail);
            matchedOrg = organizations.find(org => org.email.toLowerCase() === userEmail.toLowerCase());
        }

        if (matchedOrg) {
            console.log('Zoho Lookup: Match successful!', matchedOrg.name);
            return {
                success: true,
                organizationId: matchedOrg.organization_id,
                orgName: matchedOrg.name,
                email: matchedOrg.email
            };
        }

        console.warn('Zoho Lookup: No matching organization found in the list.');
        return { success: false };
    } catch (err) {
        console.error('Detailed Zoho Verification Error:', err);
        throw err;
    }
};

export const fetchZohoCOA = async (organizationId) => {
    try {
        if (!organizationId) throw new Error('Organization ID is required');

        // 1. Get the Platform Master Access Token
        const accessToken = await getPlatformAccessToken();

        // 2. Fetch accounts for the specific organization
        const response = await fetch(`https://www.zohoapis.in/books/v3/chartofaccounts?organization_id=${organizationId}`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to fetch Zoho Accounts');
        }

        const data = await response.json();
        return mapZohoAccountsToDabbyCOA(data.chartofaccounts);
    } catch (err) {
        console.error('Error in fetchZohoCOA:', err);
        throw err;
    }
};

/**
 * Map Zoho Accounts to Dabby structure
 */
const mapZohoAccountsToDabbyCOA = (zohoAccounts) => {
    return zohoAccounts.map(account => ({
        id: account.account_id,
        name: account.account_name,
        type: mapZohoTypeToDabbyType(account.account_type),
        balance: account.current_balance,
        balanceType: account.account_type.includes('asset') || account.account_type.includes('expense') ? 'Dr' : 'Cr',
        locked: account.is_system_account
    }));
};

const mapZohoTypeToDabbyType = (zohoType) => {
    const mapping = {
        'other_current_asset': 'Other Current Asset',
        'fixed_asset': 'Fixed Asset',
        'accounts_receivable': 'Accounts Receivable',
        'equity': 'Equity',
        'other_current_liability': 'Other Current Liability',
        'accounts_payable': 'Accounts Payable',
        'expense': 'Expense',
        'cost_of_goods_sold': 'Cost Of Goods Sold',
        'income': 'Income'
    };
    return mapping[zohoType] || zohoType;
};
