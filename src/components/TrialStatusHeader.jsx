import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { Clock, AlertTriangle, Info, Zap, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrialStatusHeader = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  if (!profile?.trial_until || !show) return null;

  const trialUntil = new Date(profile.trial_until);
  const now = new Date();
  const diffTime = trialUntil - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const isExpired = diffTime < 0;

  // Alert Logic
  let alertConfig = null;

  if (!isExpired) {
    if (diffDays <= 2 && diffDays > 1) {
      // Day 5 logic (2 days remaining)
      alertConfig = {
        type: 'promo',
        icon: <Zap size={18} />,
        title: 'Limited Offer: 15% OFF!',
        desc: "Your trial ends in 48 hours. Upgrade now to keep your data and get 15% off your first year.",
        btn: "Claim 15% Discount"
      };
    } else if (diffDays <= 1) {
      // Day 6 logic (1 day remaining)
      alertConfig = {
        type: 'warning',
        icon: <AlertTriangle size={18} />,
        title: 'Urgent: Trial Ending Tomorrow',
        desc: "Upgrade now for 10% off. After 24 hours, your data will be locked and potentially lost.",
        btn: "Save My Data (10% OFF)"
      };
    } else {
      // Generic active trial
      alertConfig = {
        type: 'info',
        icon: <Zap size={18} />,
        title: 'Trial Active',
        desc: `You have ${diffDays} days of the Go plan remaining. Enjoy the premium features!`,
        btn: null
      };
    }
  } else {
    // Expired Logic
    const expiredDays = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    if (expiredDays >= 3) { // Day 10 (which is 3 or more days after Day 7)
      alertConfig = {
        type: 'critical',
        icon: <ShieldAlert size={18} />,
        title: 'Recover Your Workbenches',
        desc: "Your setup is still available for recovery. Subscribe today at original pricing to restore access before permanent deletion.",
        btn: "Restore My System"
      };
    }
  }

  if (!alertConfig) return null;

  return (
    <div className={`trial-header ${alertConfig.type}`}>
      <div className="header-content">
        <div className="alert-main">
          <div className="icon-badge">{alertConfig.icon}</div>
          <div className="text-content">
            <strong>{alertConfig.title}</strong>
            <span>{alertConfig.desc}</span>
          </div>
        </div>
        
        <div className="header-actions">
          {alertConfig.btn && (
            <button className="action-btn" onClick={() => navigate('/pricing')}>
              {alertConfig.btn}
              <ArrowRight size={14} />
            </button>
          )}
          <button className="close-btn" onClick={() => setShow(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .trial-header {
          width: 100%;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: center;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
          transition: all 0.3s ease;
        }

        .trial-header.info { background: hsla(168, 100%, 48%, 0.1); color: hsl(var(--primary)); }
        .trial-header.promo { background: linear-gradient(to right, #1e1b4b, #312e81); color: #818cf8; border-bottom: 1px solid #4338ca; }
        .trial-header.warning { background: linear-gradient(to right, #451a03, #78350f); color: #fbbf24; border-bottom: 1px solid #92400e; }
        .trial-header.critical { background: linear-gradient(to right, #450a0a, #7f1d1d); color: #f87171; border-bottom: 1px solid #991b1b; }

        .header-content {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .alert-main {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
        }

        .text-content {
          display: flex;
          flex-direction: column;
        }

        .text-content strong {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .text-content span {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .action-btn {
          background: white;
          color: black;
          padding: 0.4rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: 0.2s;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        }

        .promo .action-btn { background: #818cf8; color: white; }
        .warning .action-btn { background: #fbbf24; color: black; }
        .critical .action-btn { background: #f87171; color: white; }

        .close-btn {
          opacity: 0.5;
          transition: 0.2s;
        }

        .close-btn:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .text-content span { display: none; }
          .trial-header { padding: 0.5rem 1rem; }
        }
      `}</style>
    </div>
  );
};

export default TrialStatusHeader;
