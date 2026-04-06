/**
 * Tree-structured Chart of Accounts
 * 6 Pillars: Assets, Liabilities, Equity, Revenue, Expense, Cash
 * Normalized: 'type' is ALWAYS one of the 6 pillars. Specific names are in 'category'.
 */
export const HIERARCHICAL_COA = {
  assets: {
    name: 'Assets',
    description: 'Current and Fixed business assets',
    subcategories: {
      current_assets: {
        name: 'Current Assets',
        accounts: [
          { name: 'Accounts Receivable', type: 'Assets', category: 'Accounts Receivable', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'TDS Receivable', type: 'Assets', category: 'Other Current Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Employee Advance', type: 'Assets', category: 'Other Current Asset', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'Prepaid Expenses', type: 'Assets', category: 'Other Current Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Inventory Asset', type: 'Assets', category: 'Stock', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'Security Deposits', type: 'Assets', category: 'Other Current Asset', balance: 0, balanceType: 'Dr' }
        ]
      },
      fixed_assets: {
        name: 'Fixed Assets',
        accounts: [
          { name: 'Furniture and Equipment', type: 'Assets', category: 'Fixed Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Office Equipment', type: 'Assets', category: 'Fixed Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Computers & Laptops', type: 'Assets', category: 'Fixed Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Vehicles', type: 'Assets', category: 'Fixed Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Leasehold Improvements', type: 'Assets', category: 'Fixed Asset', balance: 0, balanceType: 'Dr' }
        ]
      },
      intangible_assets: {
        name: 'Intangible Assets',
        accounts: [
          { name: 'Goodwill', type: 'Assets', category: 'Other Asset', balance: 0, balanceType: 'Dr' },
          { name: 'Patents & Trademarks', type: 'Assets', category: 'Other Asset', balance: 0, balanceType: 'Dr' }
        ]
      }
    }
  },
  liabilities: {
    name: 'Liabilities',
    description: 'Short and long term financial obligations',
    subcategories: {
      current_liabilities: {
        name: 'Current Liabilities',
        accounts: [
          { name: 'Accounts Payable', type: 'Liabilities', category: 'Accounts Payable', balance: 0, balanceType: 'Cr', selected: true },
          { name: 'TDS Payable', type: 'Liabilities', category: 'Other Current Liability', balance: 0, balanceType: 'Cr' },
          { name: 'GST Payable', type: 'Liabilities', category: 'Other Current Liability', balance: 0, balanceType: 'Cr', selected: true },
          { name: 'Employee Reimbursements', type: 'Liabilities', category: 'Other Current Liability', balance: 0, balanceType: 'Cr', selected: true },
          { name: 'Unearned Revenue', type: 'Liabilities', category: 'Other Current Liability', balance: 0, balanceType: 'Cr', selected: true },
          { name: 'Accrued Expenses', type: 'Liabilities', category: 'Other Current Liability', balance: 0, balanceType: 'Cr' }
        ]
      },
      long_term_liabilities: {
        name: 'Long Term Liabilities',
        accounts: [
          { name: 'Bank Loans', type: 'Liabilities', category: 'Non Current Liability', balance: 0, balanceType: 'Cr' },
          { name: 'Mortgages', type: 'Liabilities', category: 'Non Current Liability', balance: 0, balanceType: 'Cr' },
          { name: 'Director Loans', type: 'Liabilities', category: 'Non Current Liability', balance: 0, balanceType: 'Cr' }
        ]
      }
    }
  },
  equity: {
    name: 'Equity',
    description: 'Owner investments and retained earnings',
    subcategories: {
      shareholders_equity: {
        name: 'Shareholders Equity',
        accounts: [
          { name: "Owner's Equity", type: 'Equity', category: 'Equity', balance: 0, balanceType: 'Cr', selected: true },
          { name: 'Common Stock', type: 'Equity', category: 'Equity', balance: 0, balanceType: 'Cr' },
          { name: 'Preference Shares', type: 'Equity', category: 'Equity', balance: 0, balanceType: 'Cr' },
          { name: 'Retained Earnings', type: 'Equity', category: 'Equity', balance: 0, balanceType: 'Cr', selected: true }
        ]
      }
    }
  },
  revenue: {
    name: 'Revenue',
    description: 'Income from sales and services',
    subcategories: {
      operating_income: {
        name: 'Operating Income',
        accounts: [
          { name: 'Sales Revenue', type: 'Revenue', category: 'Income', balance: 0, balanceType: 'Cr', selected: true },
          { name: 'Service Income', type: 'Revenue', category: 'Income', balance: 0, balanceType: 'Cr' },
          { name: 'Product Revenue', type: 'Revenue', category: 'Income', balance: 0, balanceType: 'Cr' },
          { name: 'Shipping & Handling Income', type: 'Revenue', category: 'Income', balance: 0, balanceType: 'Cr' }
        ]
      },
      other_income: {
        name: 'Other Income',
        accounts: [
          { name: 'Interest Income', type: 'Revenue', category: 'Other Income', balance: 0, balanceType: 'Cr' },
          { name: 'Late Fee Income', type: 'Revenue', category: 'Other Income', balance: 0, balanceType: 'Cr' },
          { name: 'Discount Received', type: 'Revenue', category: 'Other Income', balance: 0, balanceType: 'Cr' }
        ]
      }
    }
  },
  expense: {
    name: 'Expense',
    description: 'Operating costs and business spending',
    subcategories: {
      operating_expenses: {
        name: 'Operating Expenses',
        accounts: [
          { name: 'Salaries and Wages', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Rent Expense', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Professional Fees', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Marketing & Ads', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'SaaS & Subscriptions', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Travel & Entertainment', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Utilities', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Repairs & Maintenance', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Printing & Stationery', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Insurance Expense', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' }
        ]
      },
      cogs: {
        name: 'Cost of Goods Sold',
        accounts: [
          { name: 'Cost of Goods Sold', type: 'Expense', category: 'Cost Of Goods Sold', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'Direct Labor', type: 'Expense', category: 'Cost Of Goods Sold', balance: 0, balanceType: 'Dr' },
          { name: 'Raw Materials', type: 'Expense', category: 'Cost Of Goods Sold', balance: 0, balanceType: 'Dr' },
          { name: 'Freight Charges', type: 'Expense', category: 'Cost Of Goods Sold', balance: 0, balanceType: 'Dr' }
        ]
      },
      taxes: {
        name: 'Taxes & Licenses',
        accounts: [
          { name: 'Income Tax Expense', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Property Tax', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
          { name: 'Business Licenses', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' }
        ]
      }
    }
  },
  cash: {
    name: 'Cash',
    description: 'Liquid funds and bank accounts',
    subcategories: {
      bank_accounts: {
        name: 'Bank & Cash',
        accounts: [
          { name: 'Main Bank Account', type: 'Cash', category: 'Cash', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'Petty Cash', type: 'Cash', category: 'Cash', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'Undeposited Funds', type: 'Cash', category: 'Cash', balance: 0, balanceType: 'Dr', selected: true },
          { name: 'Corporate Credit Card', type: 'Cash', category: 'Cash', balance: 0, balanceType: 'Dr' }
        ]
      }
    }
  }
};

export const INDUSTRY_SPECIFIC_ADDITIONS = {
  technology: {
    expense: [
      { name: 'Cloud Infrastructure (AWS/Azure)', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
      { name: 'R&D Development Costs', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' }
    ],
    assets: [
      { name: 'Software Licenses', type: 'Assets', category: 'Other Current Asset', balance: 0, balanceType: 'Dr' }
    ]
  },
  manufacturing: {
    assets: [
      { name: 'Raw Materials Inventory', type: 'Assets', category: 'Stock', balance: 0, balanceType: 'Dr' },
      { name: 'Work-in-Progress Inventory', type: 'Assets', category: 'Stock', balance: 0, balanceType: 'Dr' }
    ],
    expense: [
      { name: 'Factory Overhead', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' },
      { name: 'Plant Repairs & Maintenance', type: 'Expense', category: 'Expense', balance: 0, balanceType: 'Dr' }
    ]
  },
  services: {
    revenue: [
      { name: 'Professional Services Revenue', type: 'Revenue', category: 'Income', balance: 0, balanceType: 'Cr' }
    ],
    expense: [
      { name: 'Subcontractor Costs', type: 'Expense', category: 'Cost Of Goods Sold', balance: 0, balanceType: 'Dr' }
    ]
  }
};

export const getHierarchicalTemplate = (industry) => {
  const base = JSON.parse(JSON.stringify(HIERARCHICAL_COA)); // deep clone
  const additions = INDUSTRY_SPECIFIC_ADDITIONS[industry?.toLowerCase()];

  if (additions) {
    Object.keys(additions).forEach(pillar => {
      if (base[pillar]) {
        // Add to the first subcategory for simplicity in templates
        const subCatKey = Object.keys(base[pillar].subcategories)[0];
        base[pillar].subcategories[subCatKey].accounts.push(...additions[pillar]);
      }
    });
  }

  return base;
};

// For backward compatibility during migration
export const getTemplateByIndustry = (industry) => {
  const tree = getHierarchicalTemplate(industry);
  const flat = [];
  Object.values(tree).forEach(pillar => {
    Object.values(pillar.subcategories).forEach(sub => {
      flat.push(...sub.accounts);
    });
  });
  return flat;
};
