import React, { useState } from 'react';
import { 
  Search, 
  Shield, 
  FileText, 
  Clock, 
  Download, 
  Eye, 
  MoreVertical,
  Filter,
  ArrowUpDown
} from 'lucide-react';

const DocVault = ({ workbench }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Proof of Source', 'Invoices', 'Compliance', 'Legal'];

  // Mock initial documents since workbench.docs might be empty
  const initialDocs = [
    { id: 1, name: 'PAN Card Copy.pdf', type: 'Compliance', account: 'N/A', date: '2026-03-20', size: '1.2 MB', creator: 'Medhansh K' },
    { id: 2, name: 'GST Certificate.pdf', type: 'Compliance', account: 'N/A', date: '2026-03-21', size: '2.4 MB', creator: 'Medhansh K' },
    { id: 3, name: 'TDS Payment Reciept.jpg', type: 'Proof of Source', account: 'TDS Payable', date: '2026-03-25', size: '850 KB', creator: 'Sarah J' },
  ];

  const docs = [...(workbench?.docs || []), ...initialDocs];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="doc-vault">
      <header className="vault-header">
        <div className="header-top">
          <div className="title-group">
            <div className="icon-bg">
              <Shield size={24} />
            </div>
            <div>
              <h1>Document Vault</h1>
              <p>Secure storage for organization proofs and compliance docs</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input 
                placeholder="Search documents or accounts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="upload-btn">Upload Doc</button>
          </div>
        </div>

        <nav className="category-tabs">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      <div className="vault-content">
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Name <ArrowUpDown size={12} /></th>
                <th>Type</th>
                <th>Related Account</th>
                <th>Date Added <ArrowUpDown size={12} /></th>
                <th>Size</th>
                <th>Creator</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id}>
                  <td><input type="checkbox" /></td>
                  <td className="doc-name-cell">
                    <FileText size={18} className="doc-icon" />
                    <span>{doc.name}</span>
                  </td>
                  <td><span className="type-badge">{doc.type}</span></td>
                  <td className="account-cell">{doc.account}</td>
                  <td><span className="date-cell">{doc.date}</span></td>
                  <td><span className="size-cell">{doc.size}</span></td>
                  <td><span className="creator-cell">{doc.creator}</span></td>
                  <td className="actions-cell">
                    <button className="action-btn"><Eye size={16} /></button>
                    <button className="action-btn"><Download size={16} /></button>
                    <button className="action-btn"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx="true">{`
        .doc-vault {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: hsl(var(--background));
        }

        .vault-header {
          margin-bottom: 2rem;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .title-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-bg {
          width: 48px;
          height: 48px;
          background-color: hsla(var(--primary), 0.1);
          color: hsl(var(--primary));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-group h1 {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .title-group p {
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          color: hsl(var(--muted-foreground));
        }

        .search-box input {
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          padding: 0.6rem 1rem 0.6rem 3rem;
          border-radius: 0.75rem;
          width: 300px;
          color: hsl(var(--foreground));
        }

        .upload-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.6rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 600;
        }

        .category-tabs {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid hsl(var(--border));
          padding-bottom: 1rem;
        }

        .cat-btn {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
        }

        .cat-btn:hover {
          color: hsl(var(--foreground));
        }

        .cat-btn.active {
          background-color: hsla(var(--primary), 0.1);
          color: hsl(var(--primary));
        }

        .vault-content {
          flex: 1;
          overflow: hidden;
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.5rem;
        }

        .docs-table-container {
          height: 100%;
          overflow-y: auto;
        }

        .docs-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .docs-table th {
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid hsl(var(--border));
          letter-spacing: 0.05em;
        }

        .docs-table th svg {
          display: inline;
          vertical-align: middle;
          margin-left: 0.25rem;
          opacity: 0.5;
        }

        .docs-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid hsla(var(--border), 0.5);
          font-size: 0.9rem;
        }

        .docs-table tr:hover {
          background-color: hsla(var(--foreground), 0.02);
        }

        .doc-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .doc-icon {
          color: hsl(var(--muted-foreground));
        }

        .type-badge {
          font-size: 0.7rem;
          background-color: hsl(var(--secondary));
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          color: hsl(var(--muted-foreground));
        }

        .account-cell {
          color: hsl(var(--primary));
          font-weight: 500;
        }

        .date-cell, .size-cell, .creator-cell {
          color: hsl(var(--muted-foreground));
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          opacity: 0.6;
        }

        .action-btn:hover {
          color: hsl(var(--primary));
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default DocVault;
