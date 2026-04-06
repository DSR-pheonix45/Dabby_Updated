import React, { useState } from 'react';
import {
  Building2,
  Users,
  FileText,
  Globe,
  DollarSign,
  Calendar,
  ShieldCheck,
  Clock,
  History,
  ArrowRight,
  Database,
  CloudUpload
} from 'lucide-react';

const WorkbenchSettings = ({ workbench, onUpdateWorkbench }) => {
  const [activeTab, setActiveTab] = useState('organization');
  const [formData, setFormData] = useState({ ...workbench });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleComplianceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      compliance: { ...prev.compliance, [name]: value }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateWorkbench(formData);
      setIsSaving(false);
    }, 1000);
  };

  if (!workbench) return <div className="settings-loading">Loading settings...</div>;

  return (
    <div className="settings-view">
      <header className="settings-header">
        <div className="header-info">
          <h1>Workbench Settings</h1>
          <p>Manage your organization, members and financial parameters</p>
        </div>
        <button
          className={`save-btn ${isSaving ? 'saving' : ''}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </header>

      <div className="settings-container">
        <nav className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            <Building2 size={18} />
            <span>Organization</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'coa' ? 'active' : ''}`}
            onClick={() => setActiveTab('coa')}
          >
            <FileText size={18} />
            <span>COA Setup</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <History size={18} />
            <span>Records & Logs</span>
          </button>
        </nav>

        <main className="settings-content">
          {activeTab === 'organization' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Organization Details</h3>
                <p>Company information and regional settings</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country / Region</label>
                  <div className="input-with-icon">
                    <Globe size={16} />
                    <input name="location" value={formData.location} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Base Currency</label>
                  <div className="input-with-icon">
                    <DollarSign size={16} />
                    <input name="currency" value={formData.currency} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Fiscal Year Start</label>
                  <div className="input-with-icon">
                    <Calendar size={16} />
                    <input name="fyStart" value={formData.fyStart} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="section-separator"></div>

              <div className="section-header">
                <h3>Compliance & Tax IDs</h3>
                <p>Mandatory corporate identification for local regulations</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>PAN (Permanent Account Number)</label>
                  <input
                    name="pan"
                    value={formData.compliance?.pan || ''}
                    onChange={handleComplianceChange}
                    placeholder="ABCDE1234F"
                  />
                </div>
                <div className="form-group">
                  <label>TAN (Tax Deduction Account Number)</label>
                  <input
                    name="tan"
                    value={formData.compliance?.tan || ''}
                    onChange={handleComplianceChange}
                    placeholder="CHEP01234G"
                  />
                </div>
                <div className="form-group">
                  <label>GSTIN</label>
                  <input
                    name="gstin"
                    value={formData.compliance?.gstin || ''}
                    onChange={handleComplianceChange}
                    placeholder="27ABCDE1234F1Z5"
                  />
                </div>
                <div className="form-group">
                  <label>CIN (Corporate Identity Number)</label>
                  <input
                    name="cin"
                    value={formData.compliance?.cin || ''}
                    onChange={handleComplianceChange}
                    placeholder="L12345MH2023PTC123456"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coa' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>Chart of Accounts Setup</h3>
                <p>Manage how your financial accounts are initialized and synced</p>
              </div>

              <div className="coa-status-banner">
                <div className="status-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="status-info">
                  <h4>Current Mode: {formData.coaMethod === 'manual' ? 'Standard Indian COA' : 'External Sync'}</h4>
                  <p>Initialized with 24 standard ledger accounts. Last updated Just now.</p>
                </div>
                <button className="re-init-btn">Reset & Re-initialize</button>
              </div>

              <div className="import-options">
                <h4>Import from ERP</h4>
                <div className="erp-grid">
                  <div
                    className={`erp-card ${formData.zohoConnected ? 'active connected' : ''}`}
                    onClick={() => {
                      if (!formData.zohoConnected) {
                        // Simulate Zoho OAuth Redirect
                        const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoBooks.fullaccess.all&client_id=MOCK_ID&state=zoho_auth&response_type=code&redirect_uri=${window.location.origin}`;
                        console.log('Redirecting to Zoho:', authUrl);
                        // For demo purposes, we'll just simulate the callback by appending the params
                        window.location.href = window.location.origin + '?code=mock_code_123&state=zoho_auth';
                      }
                    }}
                  >
                    <div className="erp-logo">
                      <span>Zoho</span>
                      {formData.zohoConnected && <span className="connected-badge">Connected</span>}
                    </div>
                    <p>{formData.zohoConnected ? 'Synced ' + (formData.lastSynced || 'just now') : 'Sync with Zoho Books'}</p>
                    {formData.zohoConnected ? <ShieldCheck size={16} className="text-primary" /> : <ArrowRight size={16} />}
                  </div>
                  <div className="erp-card">
                    <div className="erp-logo">Tally</div>
                    <p>Import Tally XML/Excel</p>
                    <ArrowRight size={16} />
                  </div>
                  <div className="erp-card">
                    <div className="erp-logo">Excel</div>
                    <p>Custom CSV Template</p>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

              <div className="coa-params">
                <h4>Automation Parameters</h4>
                <div className="param-item">
                  <div className="param-info">
                    <h5>Automatic GST Mapping</h5>
                    <p>Automatically map GST accounts based on transaction origin</p>
                  </div>
                  <div className="toggle">
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
                <div className="param-item">
                  <div className="param-info">
                    <h5>Dual-Entry Validation</h5>
                    <p>Strict validation for all manual journal entries</p>
                  </div>
                  <div className="toggle">
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>System Records & Activity Logs</h3>
                <p>Comprehensive audit trail of all organizational data changes</p>
              </div>

              <div className="logs-list">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(workbench.logs || []).map(log => (
                      <tr key={log.id}>
                        <td className="action-cell">
                          <Activity size={14} className="log-icon" />
                          {log.action}
                        </td>
                        <td>{log.user}</td>
                        <td>{log.date}</td>
                        <td className="details-cell">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="access-info">
                <div className="info-card">
                  <Database size={20} />
                  <p>Audit logs are preserved for 7 years for regulatory compliance.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx="true">{`
        .settings-view {
          padding: 2.5rem;
          height: 100%;
          overflow-y: auto;
          background-color: hsl(var(--background));
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .header-info p {
          color: hsl(var(--muted-foreground));
        }

        .save-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          font-weight: 600;
        }

        .save-btn.saving {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .settings-container {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
        }

        .settings-tabs {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          transition: all 0.2s;
          background: transparent;
        }

        .tab-btn:hover {
          background-color: hsla(var(--foreground), 0.1);
          color: hsl(var(--foreground));
        }

        .tab-btn.active {
          background-color: hsla(var(--primary), 0.15);
          color: hsl(var(--primary));
        }

        .settings-content {
          flex: 1;
          max-width: 800px;
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.5rem;
          padding: 2.5rem;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .section-header p {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
        }

        .form-group input {
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: hsl(var(--foreground));
          font-size: 0.95rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg {
          position: absolute;
          left: 0.75rem;
          color: hsl(var(--muted-foreground));
        }

        .input-with-icon input {
          width: 100%;
          padding-left: 2.5rem;
        }

        .section-separator {
          height: 1px;
          background-color: hsl(var(--border));
          margin: 2.5rem 0;
        }

        /* COA Tab */
        .coa-status-banner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background-color: hsla(var(--primary), 0.1);
          border: 1px solid hsla(var(--primary), 0.2);
          border-radius: 1rem;
          margin-bottom: 2.5rem;
        }

        .status-icon {
          color: hsl(var(--primary));
        }

        .status-info h4 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .status-info p {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
        }

        .re-init-btn {
          margin-left: auto;
          background-color: hsla(var(--foreground), 0.05);
          border: 1px solid hsla(var(--foreground), 0.1);
          color: hsl(var(--foreground));
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .re-init-btn:hover {
          background-color: hsla(var(--foreground), 0.1);
          border-color: hsla(var(--foreground), 0.2);
        }

        .import-options {
          margin-bottom: 2.5rem;
        }

        .import-options h4, .coa-params h4 {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
        }

        .erp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .erp-card {
          padding: 1.25rem;
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .erp-card:hover {
          border-color: hsl(var(--primary));
          background-color: hsla(var(--primary), 0.02);
        }

        .erp-card.active {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 15px hsla(var(--primary), 0.1);
          background-color: hsla(var(--primary), 0.05);
        }

        .erp-card.connected {
          border-style: solid;
        }

        .connected-badge {
          font-size: 0.65rem;
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 800;
        }

        .text-primary {
          color: hsl(var(--primary));
        }

        .erp-logo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .erp-card p {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }

        .param-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid hsl(var(--border));
        }

        .param-info h5 {
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }

        .param-info p {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }

        /* Removed Members Tab Styles */

        /* Logs Tab */
        .logs-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }

        .logs-table th {
          text-align: left;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          padding: 1rem;
          border-bottom: 1px solid hsl(var(--border));
        }

        .logs-table td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid hsla(var(--border), 0.5);
        }

        .action-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: hsl(var(--primary));
        }

        .details-cell {
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }

        .log-icon {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default WorkbenchSettings;
