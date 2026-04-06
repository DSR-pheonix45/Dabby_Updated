import React, { useState, useEffect } from 'react';
import { Layout, Puzzle, Link2, Check, ExternalLink, ShieldCheck, Box, Zap, Copy, X, ArrowRight, Info, Activity, RefreshCw, Search } from 'lucide-react';
import { verifyZohoAccess } from '../services/zohoService';
import { useAuth } from '../context/auth-context';

const ToolsPage = () => {
  const { user } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [zohoOrgId, setZohoOrgId] = useState('');
  const [discoveredOrg, setDiscoveredOrg] = useState(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [status, setStatus] = useState(() => localStorage.getItem('dabby_zoho_status') || 'available');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connect') === 'zoho') {
      setShowInviteModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (showInviteModal && status === 'available' && user?.email) {
      handleAutoDiscover();
    }
  }, [showInviteModal]);

  const handleAutoDiscover = async () => {
    setIsDiscovering(true);
    try {
      const result = await verifyZohoAccess(null, user.email);
      if (result.success) {
        setDiscoveredOrg(result);
        setZohoOrgId(result.organizationId);
      }
    } catch (err) {
      console.error('Auto-discovery failed:', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  const integrations = [
    {
      id: 'zoho-books',
      name: 'Zoho Books',
      description: 'Sync your Chart of Accounts, Invoices, and Bills automatically.',
      icon: <Puzzle size={24} />,
      status: status, // Dynamic status
      category: 'Accounting'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Connect your QuickBooks Online account for real-time syncing.',
      icon: <Zap size={24} />,
      status: 'available',
      category: 'Accounting'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Import your revenue and subscription data directly.',
      icon: <Link2 size={24} />,
      status: 'available',
      category: 'Payments'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get financial alerts and reports delivered to your channels.',
      icon: <Box size={24} />,
      status: 'available',
      category: 'Communication'
    }
  ];

  const copyEmail = () => {
    navigator.clipboard.writeText('opportunities@datalis.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectZoho = async () => {
    if (!zohoOrgId) return;

    try {
      console.log('Connect: Initiating Zoho connection for Org ID:', zohoOrgId);
      const result = await verifyZohoAccess(zohoOrgId, user?.email);

      if (result.success) {
        setStatus('connected');
        localStorage.setItem('dabby_zoho_status', 'connected');
        localStorage.setItem('dabby_zoho_org_id', result.organizationId);
        if (result.orgName) localStorage.setItem('dabby_zoho_org_name', result.orgName);
        setShowInviteModal(false);
        alert(`Successfully connected to ${result.orgName}!`);
      } else {
        alert("Verification failed: We couldn't find this Organization in our accessible list. Please ensure the invite to opportunities@datalis.in was accepted.");
        setStatus('pending');
        localStorage.setItem('dabby_zoho_status', 'pending');
        localStorage.setItem('dabby_zoho_org_id', zohoOrgId);
        setShowInviteModal(false);
      }
    } catch (err) {
      console.error('Connection process failed:', err);
      alert(`Connection failed: ${err.message}. Please check your console (F12) for details.`);
      setStatus('pending');
      localStorage.setItem('dabby_zoho_status', 'pending');
      localStorage.setItem('dabby_zoho_org_id', zohoOrgId);
      setShowInviteModal(false);
    }
  };

  const handleVerifyConnection = async () => {
    const orgId = localStorage.getItem('dabby_zoho_org_id');
    if (!orgId) return;

    try {
      console.log('Verify: Manually checking connection for Org ID:', orgId);
      const result = await verifyZohoAccess(orgId, user?.email);
      if (result.success) {
        setStatus('connected');
        localStorage.setItem('dabby_zoho_status', 'connected');
        if (result.orgName) localStorage.setItem('dabby_zoho_org_name', result.orgName);
        alert(`Success! We now have access to ${result.orgName}.`);
      } else {
        alert("We still don't have access to this Organization ID. \n\nChecklist:\n1. Did you invite opportunities@datalis.in?\n2. Did you use the 'Invite Accountant' role?\n3. Is your Zoho account on zoho.in?");
      }
    } catch (err) {
      alert(`Verification failed: ${err.message}. See console for details.`);
    }
  };

  return (
    <div className="tools-page">
      <header className="page-header">
        <div className="header-info">
          <h1>Tools & Integrations</h1>
          <p>Connect your financial stack to power Dabby's intelligence.</p>
        </div>
        <div className="security-badge glass">
          <ShieldCheck size={16} />
          <span>Enterprise Encryption</span>
        </div>
      </header>

      <div className="tools-grid">
        {integrations.map((tool) => (
          <div key={tool.id} className="tool-card glass">
            <div className="tool-top">
              <div className={`tool-icon-bg ${tool.status}`}>
                {tool.icon}
              </div>
              <div className="tool-status">
                {tool.status === 'connected' ? (
                  <span className="status-pill connected">
                    <Check size={12} /> Connected
                  </span>
                ) : tool.status === 'pending' ? (
                  <div className="pending-actions">
                    <span className="status-pill pending">
                      <Activity size={12} className="spinning" /> Pending
                    </span>
                    <button className="verify-small-btn" onClick={handleVerifyConnection}>
                      <RefreshCw size={12} /> Verify
                    </button>
                  </div>
                ) : (
                  <button
                    className="connect-btn"
                    onClick={() => tool.id === 'zoho-books' ? setShowInviteModal(true) : null}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            <div className="tool-info">
              <span className="tool-category">{tool.category}</span>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>

            <div className="tool-footer">
              <button className="footer-action">
                View Details <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}

        <div className="request-tool-card">
          <div className="plus-icon">+</div>
          <h3>Request Integration</h3>
          <p>Need a specific tool? Let us know.</p>
        </div>
      </div>

      {showInviteModal && (
        <div className="modal-overlay">
          <div className="invite-modal glass">
            <div className="modal-header">
              <div className="header-title">
                <Puzzle size={24} className="text-primary" />
                <h2>Connect Zoho Books</h2>
              </div>
              <button className="close-btn" onClick={() => setShowInviteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="step-guide">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-text">
                    <p>Copy our service email.</p>
                    <div className="email-copy-box">
                      <code>opportunities@datalis.in</code>
                      <button onClick={copyEmail} className="copy-btn">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-text">
                    <p>Go to <strong>Zoho Books Settings</strong> &gt; <strong>Users</strong>.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-text">
                    <p>Click <strong>"Invite Accountant"</strong>. Use name <strong>"Dabby consultant"</strong> and the copied email.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-text">
                    <p>Wait for us to confirm. Once accepted, enter your <strong>Zoho Organization ID</strong> below:</p>

                    {isDiscovering ? (
                      <div className="discovery-loader">
                        <Activity size={16} className="spinning" />
                        <span>Searching for matches for {user?.email}...</span>
                      </div>
                    ) : discoveredOrg ? (
                      <div className="discovered-box success animate-fade-in">
                        <div className="discovered-info">
                          <Check size={16} className="text-success" />
                          <div>
                            <strong>Match Found: {discoveredOrg.orgName}</strong>
                            <span>Org ID: {discoveredOrg.organizationId}</span>
                          </div>
                        </div>
                        <button
                          className="confirm-btn"
                          onClick={handleConnectZoho}
                        >
                          Confirm & Link
                        </button>
                      </div>
                    ) : (
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="e.g. 812345678"
                          value={zohoOrgId}
                          onChange={(e) => setZohoOrgId(e.target.value)}
                          className="org-id-input"
                        />
                        <button
                          className={`submit-link-btn ${zohoOrgId ? 'active' : ''}`}
                          disabled={!zohoOrgId}
                          onClick={handleConnectZoho}
                        >
                          Link Account <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-box">
                <Info size={16} />
                <p>We'll manually confirm the invitation within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .tools-page { flex: 1; padding: 4rem; overflow-y: auto; background-color: #05070a; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; }
        .header-info h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .header-info p { color: hsl(var(--muted-foreground)); font-size: 1.1rem; }
        .security-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 600; color: #10b981; border: 1px solid hsla(168, 100%, 48%, 0.2); }
        .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .tool-card { padding: 2rem; border-radius: 1.5rem; border: 1px solid hsl(var(--border)); display: flex; flex-direction: column; gap: 1.5rem; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .tool-card:hover { transform: translateY(-5px); border-color: hsl(var(--primary)); box-shadow: 0 10px 30px hsla(var(--primary), 0.1); }
        .tool-top { display: flex; justify-content: space-between; align-items: center; }
        .tool-icon-bg { width: 56px; height: 56px; border-radius: 14px; background-color: hsl(var(--secondary)); display: flex; align-items: center; justify-content: center; color: hsl(var(--muted-foreground)); }
        .tool-icon-bg.connected { background-color: hsla(168, 100%, 48%, 0.1); color: #00ffc2; }
        .tool-icon-bg.pending { background-color: hsla(45, 100%, 50%, 0.1); color: #f59e0b; }
        .status-pill { font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.4rem; }
        .status-pill.connected { background-color: hsla(168, 100%, 48%, 0.1); color: #10b981; }
        .status-pill.pending { background-color: hsla(45, 100%, 50%, 0.1); color: #f59e0b; }
        .connect-btn { font-size: 0.875rem; font-weight: 700; color: #00ffc2; padding: 0.4rem 1rem; border-radius: 0.5rem; border: 1px solid hsla(168, 100%, 48%, 0.3); }
        .connect-btn:hover { background-color: hsla(168, 100%, 48%, 0.05); }
        .tool-category { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: hsl(var(--muted-foreground)); opacity: 0.8; }
        .tool-info h3 { font-size: 1.25rem; font-weight: 700; margin: 0.25rem 0 0.5rem 0; }
        .tool-info p { color: hsl(var(--muted-foreground)); font-size: 0.9rem; line-height: 1.5; }
        .tool-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid hsla(var(--border), 0.5); }
        .footer-action { font-size: 0.875rem; font-weight: 600; color: hsl(var(--muted-foreground)); display: flex; align-items: center; gap: 0.5rem; }
        .footer-action:hover { color: hsl(var(--foreground)); }
        .request-tool-card { border: 2px dashed hsl(var(--border)); border-radius: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; gap: 1rem; cursor: pointer; }
        .request-tool-card:hover { border-color: hsl(var(--primary)); background-color: hsla(var(--primary), 0.02); }
        .plus-icon { font-size: 2rem; color: hsl(var(--muted-foreground)); opacity: 0.5; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
        .invite-modal { width: 100%; max-width: 500px; padding: 2rem; border-radius: 2rem; border: 1px solid hsl(var(--border)); display: flex; flex-direction: column; gap: 2rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; }
        .header-title { display: flex; align-items: center; gap: 1rem; }
        .header-title h2 { font-size: 1.5rem; font-weight: 700; }
        .close-btn { color: hsl(var(--muted-foreground)); opacity: 0.6; transition: 0.2s; }
        .close-btn:hover { opacity: 1; transform: rotate(90deg); }
        .step-guide { display: flex; flex-direction: column; gap: 2rem; }
        .step { display: flex; gap: 1.5rem; }
        .step-number { width: 32px; height: 32px; border-radius: 50%; background: hsla(168, 100%, 48%, 0.1); color: #00ffc2; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .step-text p { font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 0.75rem; }
        .email-copy-box { background: #0f172a; padding: 0.75rem 1rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: space-between; border: 1px solid #1e293b; }
        .email-copy-box code { font-family: monospace; color: #e2e8f0; font-size: 0.9rem; }
        .copy-btn { color: #00ffc2; opacity: 0.8; transition: 0.2s; }
        .copy-btn:hover { opacity: 1; transform: scale(1.1); }
        .input-group { display: flex; flex-direction: column; gap: 1rem; }
        .org-id-input { background: #0f172a; border: 1px solid #1e293b; border-radius: 0.75rem; padding: 0.8rem 1rem; color: white; width: 100%; outline: none; transition: 0.2s; }
        .org-id-input:focus { border-color: #00ffc2; box-shadow: 0 0 0 2px hsla(168, 100%, 48%, 0.1); }
        .submit-link-btn { background: #1e293b; color: #94a3b8; padding: 0.8rem; border-radius: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: 0.3s; }
        .submit-link-btn.active { background: #00ffc2; color: #05070a; }
        .pending-actions { display: flex; align-items: center; gap: 0.75rem; }
        .verify-small-btn { font-size: 0.75rem; font-weight: 700; color: #f59e0b; padding: 0.35rem 0.75rem; border-radius: 2rem; border: 1px solid hsla(45, 100%, 50%, 0.3); display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s; background: transparent; }
        .verify-small-btn:hover { background-color: hsla(45, 100%, 50%, 0.1); transform: translateY(-1px); border-color: #f59e0b; }
        
        .discovery-loader { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: hsla(var(--primary), 0.05); border-radius: 1rem; border: 1px solid hsla(var(--primary), 0.1); color: hsl(var(--muted-foreground)); font-size: 0.9rem; }
        
        .discovered-box { padding: 1.5rem; background: hsla(168, 100%, 48%, 0.05); border-radius: 1.25rem; border: 1px solid hsla(168, 100%, 48%, 0.2); display: flex; flex-direction: column; gap: 1.5rem; margin-top: 0.5rem; }
        .discovered-info { display: flex; gap: 1rem; }
        .discovered-info strong { display: block; color: white; margin-bottom: 0.25rem; }
        .discovered-info span { font-size: 0.8rem; color: #64748b; }
        .text-success { color: #10b981; }
        
        .confirm-btn { background: #00ffc2; color: #05070a; padding: 0.8rem; border-radius: 0.75rem; font-weight: 700; transition: transform 0.2s; box-shadow: 0 4px 15px hsla(168, 100%, 48%, 0.2); }
        .confirm-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px hsla(168, 100%, 48%, 0.3); }
        
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .info-box { display: flex; gap: 0.75rem; padding: 1rem; background: hsla(217, 91%, 60%, 0.05); border-radius: 1rem; color: #60a5fa; border: 1px solid hsla(217, 91%, 60%, 0.1); }
        .info-box p { font-size: 0.85rem; line-height: 1.5; }
        .spinning { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ToolsPage;
