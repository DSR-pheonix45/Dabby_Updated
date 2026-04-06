import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Link as LinkIcon, 
  Copy, 
  CheckCircle2, 
  Shield, 
  MoreHorizontal,
  Search,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

const MembersPage = ({ workbench, onUpdateWorkbench }) => {
  const [activeInviteTab, setActiveInviteTab] = useState('email');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Analyst');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const members = workbench?.members || [];

  const handleInviteEmail = (e) => {
    e.preventDefault();
    if (!email) return;
    
    const newMember = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      role: role,
      status: 'PENDING'
    };

    onUpdateWorkbench({
      ...workbench,
      members: [...members, newMember]
    });
    setEmail('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://dabby.ai/invite/${workbench.id}/abc-123`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="members-page">
      <header className="members-header">
        <div className="header-info">
          <div className="title-row">
            <Users size={28} className="title-icon" />
            <h1>Member Management</h1>
          </div>
          <p>Invite and manage access for {workbench.name} workspace</p>
        </div>
      </header>

      <div className="members-layout">
        <section className="invite-section dark-glass">
          <div className="section-header">
            <h3>Invite New Members</h3>
            <p>Email an invitation or share a secret link</p>
          </div>

          <div className="invite-tabs">
            <button 
              className={`invite-tab ${activeInviteTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveInviteTab('email')}
            >
              <Mail size={16} />
              <span>Email Invite</span>
            </button>
            <button 
              className={`invite-tab ${activeInviteTab === 'link' ? 'active' : ''}`}
              onClick={() => setActiveInviteTab('link')}
            >
              <LinkIcon size={16} />
              <span>Invite Link</span>
            </button>
          </div>

          <div className="invite-content">
            {activeInviteTab === 'email' ? (
              <form className="email-form" onSubmit={handleInviteEmail}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="teammate@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Assign Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option>Analyst</option>
                    <option>Accountant</option>
                    <option>Investor</option>
                    <option>Founder</option>
                  </select>
                </div>
                <button type="submit" className="invite-btn primary">
                  Send Invitation <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="link-invite-view">
                <div className="link-info-box">
                  <ShieldAlert size={20} className="warning-icon" />
                  <p>Anyone with this link can join as an <strong>Editor</strong>. Be careful who you share it with.</p>
                </div>
                <div className="copy-link-container">
                  <div className="link-display">
                    dabby.ai/invite/{workbench.id}/abc-123
                  </div>
                  <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
                <button className="regenerate-btn">Regenerate Link</button>
              </div>
            )}
          </div>
        </section>

        <section className="list-section">
          <div className="list-controls">
            <div className="search-box">
              <Search size={18} />
              <input 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="member-stats">
              <span>{members.length} Members Total</span>
            </div>
          </div>

          <div className="members-grid">
            {filteredMembers.map(member => (
              <div key={member.id} className="member-card dark-glass">
                <div className="card-top">
                  <div className="user-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                  </div>
                  <button className="more-btn"><MoreHorizontal size={18} /></button>
                </div>
                <div className="card-footer">
                  <div className={`status-badge ${member.status?.toLowerCase() || 'active'}`}>
                    {member.status || 'Active'}
                  </div>
                  <div className="role-selector">
                    <Shield size={14} />
                    <span>{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx="true">{`
        .members-page {
          padding: 2.5rem;
          height: 100%;
          overflow-y: auto;
          background-color: hsl(var(--background));
        }

        .members-header {
          margin-bottom: 2.5rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .title-icon {
          color: hsl(var(--primary));
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 800;
        }

        .header-info p {
          color: hsl(var(--muted-foreground));
        }

        .members-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2.5rem;
          align-items: flex-start;
        }

        .invite-section {
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.5rem;
          padding: 2rem;
        }

        .section-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .section-header p {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 1.5rem;
        }

        .invite-tabs {
          display: flex;
          gap: 0.5rem;
          background-color: hsl(var(--secondary));
          padding: 0.25rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .invite-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
        }

        .invite-tab.active {
          background-color: hsl(var(--card));
          color: hsl(var(--primary));
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .email-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.05em;
        }

        .form-group input, .form-group select {
          padding: 0.75rem;
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          color: hsl(var(--foreground));
        }

        .invite-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.85rem;
          border-radius: 0.75rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }

        .invite-btn.primary {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }

        .link-invite-view {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .link-info-box {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background-color: hsla(var(--primary), 0.05);
          border: 1px solid hsla(var(--primary), 0.1);
          border-radius: 0.75rem;
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }

        .warning-icon {
          color: hsl(var(--primary));
        }

        .copy-link-container {
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          padding: 0.25rem;
        }

        .link-display {
          flex: 1;
          padding-left: 0.75rem;
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.75rem;
          background-color: hsl(var(--background));
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .copy-btn.copied {
          background-color: #10b981;
          color: white;
        }

        .regenerate-btn {
          font-size: 0.8rem;
          color: hsl(var(--primary));
          font-weight: 600;
        }

        /* List Section */
        .list-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 300px;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          color: hsl(var(--muted-foreground));
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          color: hsl(var(--foreground));
        }

        .member-stats {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .member-card {
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.25rem;
          padding: 1.25rem;
          transition: transform 0.2s;
        }

        .member-card:hover {
          transform: translateY(-4px);
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          background-color: hsla(var(--primary), 0.1);
          color: hsl(var(--primary));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .user-details h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }

        .user-details p {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }

        .more-btn {
          margin-left: auto;
          color: hsl(var(--muted-foreground));
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid hsla(var(--border), 0.5);
        }

        .status-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          text-transform: uppercase;
          background-color: hsla(168, 100%, 48%, 0.1);
          color: #10b981;
        }

        .status-badge.pending {
          background-color: hsla(37, 98%, 53%, 0.1);
          color: #f59e0b;
        }

        .role-selector {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
};

export default MembersPage;
