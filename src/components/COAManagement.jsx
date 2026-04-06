import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Settings,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Terminal,
  FileText,
  Lock,
  Paperclip,
  Edit2,
  X,
  Upload,
  ChevronRight,
  File,
  Layout,
  Database,
  CloudDownload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COAManagement = ({ workbench, accounts = [], onUpdateCOA, onSetSetupWorkbench }) => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    balance: 0,
    file: null
  });

  const [newAccountData, setNewAccountData] = useState({
    name: '',
    type: 'Assets',
    description: '',
    balance: 0,
    balanceType: 'Dr'
  });

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = () => setIsAddDropdownOpen(false);
    if (isAddDropdownOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isAddDropdownOpen]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  const accountsArray = Array.isArray(accounts) ? accounts : [];

  const filteredAccounts = accountsArray.filter(acc => {
    const matchesSearch = acc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || acc.type?.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const accountTypes = ['All', 'Assets', 'Liabilities', 'Equity', 'Revenue', 'Expense', 'Cash'];

  return (
    <div className="coa-management">
      <div className="coa-main-layout">
        <aside className="coa-sidebar">
          <header className="sidebar-header">
            <div className="filter-dropdown">
              <span>Active Accounts</span>
              <ChevronDown size={14} />
            </div>
            <div className="header-actions">
              <div className="add-container" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="add-btn"
                  onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                >
                  <Plus size={16} />
                </button>
                
                {isAddDropdownOpen && (
                  <div className="add-dropdown dark-glass">
                    <button className="dropdown-item" onClick={() => { setIsCreateModalOpen(true); setIsAddDropdownOpen(false); }}>
                      <Plus size={14} /> Create Account
                    </button>
                    <button className="dropdown-item" onClick={() => { onSetSetupWorkbench(workbench); navigate('/coa-setup'); }}>
                      <Layout size={14} /> Import from Setup
                    </button>
                    <button className="dropdown-item disabled">
                      <CloudDownload size={14} /> Import from Zoho
                    </button>
                  </div>
                )}
              </div>
              <button className="more-btn"><MoreHorizontal size={16} /></button>
            </div>
          </header>

          <div className="search-bar">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="accounts-list">
            {filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                className={`account-item ${selectedAccount?.id === acc.id ? 'active' : ''}`}
                onClick={() => setSelectedAccount(acc)}
              >
                <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                <div className="acc-info">
                  <div className="acc-name">
                    {acc.locked && <Lock size={10} className="lock-icon" />}
                    <span>{acc.name}</span>
                  </div>
                  <span className="acc-type">{acc.type}</span>
                </div>
                {acc.id % 4 === 0 && <Settings size={14} className="settings-icon" />}
              </div>
            ))}
          </div>
        </aside>

        <main className="coa-content">
          {selectedAccount ? (
            <div className="account-detail">
              <header className="detail-header">
                <div className="detail-title-group">
                  <span className="detail-type">{selectedAccount.type}</span>
                  <h2>{selectedAccount.name}</h2>
                </div>
                <div className="detail-actions">
                  <button className="icon-btn"><Paperclip size={18} /></button>
                  <button className="icon-btn" onClick={() => setSelectedAccount(null)}><X size={18} /></button>
                </div>
              </header>

              <div className="detail-toolbar">
                <button
                  className="toolbar-btn primary"
                  onClick={() => {
                    setEditData({
                      name: selectedAccount.name,
                      description: selectedAccount.description || '',
                      balance: selectedAccount.balance,
                      file: null
                    });
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <div className="separator"></div>
                <button className="toolbar-btn"><MoreHorizontal size={14} /></button>
              </div>

              <div className="balance-card">
                <div className="balance-item">
                  <span className="label">CLOSING BALANCE</span>
                  <div className="value">
                    ₹{selectedAccount.balance.toFixed(2)}
                    <span className="balance-type">({selectedAccount.balanceType})</span>
                  </div>
                </div>
                {selectedAccount.description && (
                  <div className="description-item">
                    <span className="label">Description :</span>
                    <p>{selectedAccount.description || '--'}</p>
                  </div>
                )}
              </div>

              <div className="transactions-placeholder">
                <div className="placeholder-icon">
                  <FileText size={64} />
                </div>
                <p>There are no transactions available</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h3>Select an account to view details</h3>
              <p>Your chart of accounts structure is displayed on the left.</p>
            </div>
          )}
        </main>
      </div>

      {/* Create Account Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal dark-glass">
            <div className="modal-header">
              <h3>Create New Account</h3>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={newAccountData.name}
                    onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
                    placeholder="e.g. Sales Revenue"
                  />
                </div>

                <div className="form-group">
                  <label>Account Pillar</label>
                  <select 
                    value={newAccountData.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const balanceType = (type === 'Assets' || type === 'Expense' || type === 'Cash') ? 'Dr' : 'Cr';
                      setNewAccountData({...newAccountData, type, balanceType});
                    }}
                  >
                    {['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expense', 'Cash'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Closing Balance</label>
                  <div className="balance-input-wrap">
                    <input
                      type="number"
                      value={newAccountData.balance}
                      onChange={(e) => setNewAccountData({ ...newAccountData, balance: parseFloat(e.target.value) || 0 })}
                    />
                    <span className="bal-type-indicator">{newAccountData.balanceType}</span>
                  </div>
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea
                    value={newAccountData.description}
                    onChange={(e) => setNewAccountData({ ...newAccountData, description: e.target.value })}
                    placeholder="Describe this account's purpose..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
              <button
                className="save-btn"
                disabled={!newAccountData.name}
                onClick={() => {
                  const newAcc = {
                    id: Date.now(),
                    ...newAccountData
                  };
                  onUpdateCOA([...accounts, newAcc], workbench.id);
                  setIsCreateModalOpen(false);
                  setNewAccountData({ name: '', type: 'Asset', description: '', balance: 0, balanceType: 'Dr' });
                  setSelectedAccount(newAcc);
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal dark-glass">
            <div className="modal-header">
              <h3>Edit Account: {selectedAccount.name}</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="e.g. Prepaid Expenses"
                  />
                </div>

                <div className="form-group">
                  <label>Closing Balance (₹)</label>
                  <input
                    type="number"
                    value={editData.balance}
                    onChange={(e) => setEditData({ ...editData, balance: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Balance Type</label>
                  <div className="read-only-box">{selectedAccount.balanceType}</div>
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Describe the purpose of this account..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Source Document (Proof)</label>
                <div className="upload-container">
                  <div className="file-upload-zone">
                    <Upload size={24} />
                    <div className="upload-text">
                      <span className="main-text">Click or drag to upload source document</span>
                      <span className="sub-text">PDF, JPG, PNG (Max 5MB)</span>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setEditData({ ...editData, file: e.target.files[0] })}
                    />
                  </div>
                  {editData.file && (
                    <div className="file-preview-card">
                      <div className="file-info">
                        <File size={16} className="file-icon" />
                        <span className="file-name">{editData.file.name}</span>
                        <span className="file-size">{(editData.file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button className="remove-file" onClick={() => setEditData({ ...editData, file: null })}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button
                className="save-btn"
                onClick={() => {
                  const updatedAccount = {
                    ...selectedAccount,
                    name: editData.name,
                    description: editData.description,
                    balance: editData.balance
                  };
                  const updatedCOA = accounts.map(acc =>
                    acc.id === selectedAccount.id ? updatedAccount : acc
                  );
                  onUpdateCOA(updatedCOA, workbench.id);
                  setIsEditModalOpen(false);
                  setSelectedAccount(updatedAccount);
                }}
              >
                Update Account
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .coa-management {
          height: calc(100vh - 64px);
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .add-container { position: relative; }
        .add-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 8px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: dropdownSlide 0.2s ease-out;
        }

        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          font-size: 0.813rem;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
          border-radius: 8px;
          transition: all 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
        }

        .dropdown-item:hover:not(.disabled) {
          background: hsla(var(--primary), 0.1);
          color: hsl(var(--primary));
        }

        .dropdown-item.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .balance-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding-right: 12px;
        }

        .balance-input-wrap input {
          border: none !important;
          background: transparent !important;
        }

        .bal-type-indicator {
          font-size: 0.65rem;
          font-weight: 800;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
        }

        /* Form Select Styling */
        select {
          width: 100%;
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .edit-modal {
          width: 100%;
          max-width: 500px;
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: modalAppear 0.3s ease-out;
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-group.full {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .form-group input, 
        .form-group textarea {
          width: 100%;
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: hsl(var(--primary));
          background-color: hsla(var(--primary), 0.02);
        }

        .read-only-box {
          padding: 0.75rem 1rem;
          background-color: hsla(var(--muted-foreground), 0.1);
          border-radius: 0.75rem;
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
          font-weight: 600;
        }

        .upload-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .file-upload-zone {
          border: 2px dashed hsl(var(--border));
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          position: relative;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
        }

        .file-upload-zone:hover {
          border-color: hsl(var(--primary));
          background-color: hsla(var(--primary), 0.05);
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .upload-text .main-text {
          font-weight: 600;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
        }

        .upload-text .sub-text {
          font-size: 0.75rem;
        }

        .file-upload-zone input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-preview-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background-color: hsla(var(--primary), 0.1);
          border-radius: 0.75rem;
          border: 1px solid hsla(var(--primary), 0.2);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .file-icon {
          color: hsl(var(--primary));
        }

        .file-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: hsl(var(--foreground));
        }

        .file-size {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }

        .remove-file {
          color: hsl(var(--muted-foreground));
          transition: color 0.2s;
        }

        .remove-file:hover {
          color: hsl(var(--destructive, 0 100% 50%));
        }

        .modal-footer {
          display: flex;
          gap: 1.25rem;
          justify-content: flex-end;
        }

        .cancel-button {
          padding: 0.75rem 1.5rem;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          font-size: 0.9rem;
        }

        .save-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .save-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsla(var(--primary), 0.3);
        }

        .coa-main-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .coa-sidebar {
          width: 320px;
          border-right: 1px solid hsl(var(--border));
          display: flex;
          flex-direction: column;
          background-color: hsl(var(--sidebar));
        }

        .sidebar-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid hsl(var(--border));
        }

        .filter-dropdown {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          cursor: pointer;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .add-btn, .more-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--secondary));
          color: hsl(var(--foreground));
        }

        .add-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
        }

        .search-bar {
          padding: 0.75rem 1rem;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--muted-foreground));
        }

        .search-bar input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.25rem;
          border-radius: 4px;
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--secondary));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
        }

        .accounts-list {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--border)) transparent;
        }

        .account-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          gap: 1rem;
          cursor: pointer;
          border-bottom: 1px solid hsla(var(--border), 0.5);
          transition: background-color 0.2s;
        }

        .account-item:hover {
          background-color: hsla(var(--foreground), 0.05);
        }

        .account-item.active {
          background-color: hsla(var(--primary), 0.1);
          border-left: 3px solid hsl(var(--primary));
        }

        .acc-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .acc-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: hsl(var(--foreground));
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .lock-icon {
          color: hsl(var(--muted-foreground));
        }

        .acc-type {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }

        .coa-content {
          flex: 1;
          background-color: hsl(var(--background));
          overflow-y: auto;
        }

        .account-detail {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .detail-header {
          padding: 1.5rem 2rem;
          background: hsl(var(--card));
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid hsl(var(--border));
        }

        .detail-type {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .detail-title-group h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-top: 0.25rem;
        }

        .detail-actions {
          display: flex;
          gap: 1rem;
        }

        .icon-btn {
          color: hsl(var(--muted-foreground));
          transition: color 0.2s;
        }

        .icon-btn:hover {
          color: hsl(var(--foreground));
        }

        .detail-toolbar {
          padding: 0.75rem 2rem;
          background: hsl(var(--card));
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid hsl(var(--border));
        }

        .toolbar-btn {
          font-size: 0.875rem;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--secondary));
        }

        .toolbar-btn:hover {
          color: hsl(var(--foreground));
          border-color: hsl(var(--muted-foreground));
        }

        .separator {
          width: 1px;
          height: 20px;
          background-color: hsl(var(--border));
        }

        .balance-card {
          margin: 2rem;
          padding: 2.5rem;
          background: hsl(var(--card));
          border-radius: 1rem;
          border: 1px solid hsl(var(--border));
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .balance-item .label {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .balance-item .value {
          font-size: 2.5rem;
          font-weight: 700;
          color: hsl(var(--primary));
          margin-top: 0.5rem;
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .balance-type {
          font-size: 1.25rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }

        .description-item .label {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          display: block;
          margin-bottom: 0.5rem;
        }

        .description-item p {
          color: hsl(var(--muted-foreground));
          line-height: 1.6;
        }

        .transactions-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: hsl(var(--muted-foreground));
          padding-top: 2rem;
          opacity: 0.5;
        }

        .placeholder-icon {
          margin-bottom: 1.5rem;
          color: hsla(var(--muted-foreground), 0.2);
        }

        .empty-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

export default COAManagement;
