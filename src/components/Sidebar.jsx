import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, Layout, History, User, Settings, Shield, FileText, BarChart3, PieChart, Activity, Box, Lock, Crown, Monitor } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { useChat } from '../context/ChatContext';
import WalkthroughModal from './WalkthroughModal';

const Sidebar = ({ user, onNavigate, onLogout, workbenches = [], activeWorkbenchId }) => {
  const { profile } = useAuth();
  const { clearChat } = useChat();
  const navigate = useNavigate();
  const isFreePlan = profile?.plan === 'free';
  const [walkthrough, setWalkthrough] = useState({ isOpen: false, type: 'PLATFORM_TOUR' });

  const handleGatedClick = (e, feature) => {
    if (isFreePlan) {
      e.preventDefault();
      const type = feature === 'workbenches' ? 'WORKBENCH_UPGRADE' : 'TOOLS_UPGRADE';
      setWalkthrough({ isOpen: true, type });
    }
  };

  const handleTryNow = () => {
    setWalkthrough({ ...walkthrough, isOpen: false });
    navigate('/pricing');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button 
          onClick={() => { clearChat(); navigate('/dashboard'); }} 
          className="new-chat-btn"
        >
          <span>New Chat</span>
          <span className="shortcut">Ctrl+K</span>
        </button>

        <div className="sidebar-group">
          <NavLink 
            to="/workbenches" 
            className={`sidebar-item ${isFreePlan ? 'gated' : ''}`}
            onClick={(e) => handleGatedClick(e, 'workbenches')}
          >
            <div className="item-with-lock">
              <Monitor size={18} />
              {isFreePlan && <Lock size={12} className="lock-icon" />}
            </div>
            <span>Workbenches</span>
          </NavLink>

          <NavLink 
            to="/tools" 
            className={`sidebar-item ${isFreePlan ? 'gated' : ''}`}
            onClick={(e) => handleGatedClick(e, 'tools')}
          >
            <div className="item-with-lock">
              <Layout size={18} />
              {isFreePlan && <Lock size={12} className="lock-icon" />}
            </div>
            <span>Tools</span>
          </NavLink>
        </div>

        <div className="sidebar-group">
          <div className="sidebar-label-row">
            <div className="label-with-lock">
              <p className="sidebar-label">Active Workbenches</p>
              {isFreePlan && <Lock size={12} className="lock-icon-small" />}
            </div>
            <span className="count-badge">{workbenches.length}</span>
          </div>
          <div className="workbench-list">
            {workbenches.map(wb => (
              <div key={wb.id} className="workbench-nav-group">
                <NavLink
                  to={`/coa-management`}
                  className={`sidebar-subitem ${isFreePlan ? 'gated' : ''}`}
                  onClick={(e) => {
                    handleGatedClick(e, 'workbenches');
                    if (!isFreePlan) onNavigate('coa_management', { workbenchId: wb.id });
                  }}
                >
                  <span className="wb-dot"></span>
                  {wb.name}
                </NavLink>

                {activeWorkbenchId === wb.id && !isFreePlan && (
                  <div className="wb-sub-links">
                    <NavLink to="/coa-management" className="sub-link">
                      <FileText size={14} />
                      <span>Chart of Accounts</span>
                    </NavLink>
                    <NavLink to="/doc-vault" className="sub-link">
                      <Shield size={14} />
                      <span>Doc Vault</span>
                    </NavLink>
                    <NavLink to="/ops" className="sub-link">
                      <BarChart3 size={14} />
                      <span>Ops</span>
                    </NavLink>
                    <NavLink to="/investor-view" className="sub-link">
                      <PieChart size={14} />
                      <span>Investor View</span>
                    </NavLink>
                    <NavLink to="/inventory" className="sub-link">
                      <Box size={14} />
                      <span>Inventory & Stock</span>
                    </NavLink>
                    <NavLink to="/workbench-settings" className="sub-link">
                      <Settings size={14} />
                      <span>Settings</span>
                    </NavLink>
                  </div>
                )}
              </div>
            ))}
            {!isFreePlan && workbenches.length > 0 && (
              <NavLink to="/workbenches" className="view-all-btn">
                View all →
              </NavLink>
            )}
          </div>
        </div>

        <div className="sidebar-group">
          <NavLink to="/history" className="sidebar-item">
            <History size={18} />
            <span>History</span>
            <span className="count-badge ml-auto">10</span>
          </NavLink>
        </div>

        {isFreePlan && (
          <div className="upgrade-card-sidebar" onClick={() => navigate('/pricing')}>
            <div className="upgrade-icon">
              <Crown size={20} />
            </div>
            <div className="upgrade-text">
              <p className="title">Upgrade to Go</p>
              <p className="desc">Unlock all features</p>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar-container">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className={`plan-badge ${profile?.plan || 'free'}`}>
              {(profile?.plan || 'free').toUpperCase()}
            </div>
          </div>
          <div className="user-info">
            <p className="user-name">{profile?.name || user?.name || 'User'}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-action-btn" onClick={onLogout} title="Log Out">
            <Activity size={16} />
          </button>
        </div>
      </div>

      <WalkthroughModal 
        isOpen={walkthrough.isOpen}
        onClose={() => setWalkthrough({ ...walkthrough, isOpen: false })}
        onTryNow={handleTryNow}
        type={walkthrough.type}
      />

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100%;
          background-color: hsl(var(--sidebar));
          border-right: 1px solid hsl(var(--border) / 0.5);
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          overflow-y: auto;
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          flex: 1;
        }
        
        .new-chat-btn {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05));
          border: 1px solid hsl(var(--primary) / 0.2);
          border-radius: 0.75rem;
          color: hsl(var(--primary));
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(4px);
        }

        .new-chat-btn:hover {
          border-color: hsl(var(--primary) / 0.5);
          background: hsl(var(--primary) / 0.2);
          transform: translateY(-1px);
        }

        .sidebar-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.5rem;
          margin-bottom: 0.5rem;
        }

        .sidebar-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 0.875rem;
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.2s ease;
        }

        .sidebar-item:hover, .sidebar-item.active {
          color: white;
          background-color: hsl(var(--accent) / 0.5);
        }

        .sidebar-item.active {
          background-color: hsl(var(--accent));
          color: hsl(var(--primary));
        }

        .workbench-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }

        .sidebar-subitem {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          padding: 0.6rem 0.875rem;
          border-radius: 0.6rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .wb-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar-subitem:hover, .sidebar-subitem.active {
          color: white;
          background-color: hsl(var(--accent) / 0.3);
        }

        .sidebar-subitem.active .wb-dot {
          background-color: hsl(var(--primary));
          box-shadow: 0 0 8px hsl(var(--primary) / 0.5);
        }

        .wb-sub-links {
          margin-left: 1.25rem;
          margin-top: 0.25rem;
          padding-left: 1rem;
          border-left: 1px solid hsl(var(--border) / 0.3);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .sub-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .sub-link:hover {
          color: white;
          background-color: hsl(var(--accent) / 0.3);
        }

        .sub-link.active {
          color: hsl(var(--primary));
          background-color: hsl(var(--primary) / 0.05);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid hsl(var(--border) / 0.3);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.5rem;
        }

        .user-avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: hsl(var(--accent));
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid hsl(var(--border) / 0.5);
        }

        .plan-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .plan-badge.free { background-color: #333; color: #999; }
        .plan-badge.go { background-color: hsl(var(--primary)); color: black; }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-action-btn {
          color: hsl(var(--muted-foreground));
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .logout-action-btn:hover {
          color: #ff4444;
          background-color: rgba(255, 68, 68, 0.1);
        }

        .gated { opacity: 0.5; cursor: not-allowed; }
        .shortcut { font-size: 0.7rem; font-weight: 600; opacity: 0.5; padding: 0.1rem 0.3rem; border: 1px solid currentColor; border-radius: 4px; }
        
        .upgrade-card-sidebar {
          margin-top: 2rem;
          background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.05));
          border: 1px solid hsl(var(--primary) / 0.2);
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upgrade-card-sidebar:hover {
          border-color: hsl(var(--primary));
          transform: translateY(-2px);
        }

        .upgrade-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .upgrade-text .title {
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.1rem;
        }

        .upgrade-text .desc {
          font-size: 0.65rem;
          color: hsl(var(--muted-foreground));
        }
        
        .count-badge {
          font-size: 0.7rem;
          background-color: hsl(var(--accent));
          color: hsl(var(--muted-foreground));
          padding: 0.1rem 0.4rem;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
