import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Building2, Terminal, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WalkthroughModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: "Welcome to Dabby AI",
      category: "INTRODUCTION",
      description: "Dabby is your powerful, AI-driven financial co-pilot. We specialize in automating accounting, analyzing runway, and providing the business intelligence you need to grow with confidence.",
      icon: <CheckCircle2 size={32} className="step-main-icon pulse" />,
      value: "Actionable business intelligence without the headache."
    },
    {
      id: 2,
      title: "Workbenches & Tools",
      category: "INFRASTRUCTURE",
      description: "A Workbench is your dedicated mission control. Create different workspaces for your internal operations or external services, and integrate them directly with Zoho, Tally, or Excel for live, synchronized data.",
      icon: <Building2 size={32} className="step-main-icon" />,
      value: "Centralized, real-time control over your financial ecosystem."
    },
    {
      id: 3,
      title: "Dabby AI Insights",
      category: "NATIVE ANALYTICS",
      description: "Ask Dabby anything. We transform raw data into clear, natural language answers. Get insights on your burn rate, customer segment profitability, or future revenue forecasts in seconds.",
      icon: <Terminal size={32} className="step-main-icon" />,
      value: "Direct answers to your most complex business questions."
    },
    {
      id: 4,
      title: "Premium Dabby Consultant",
      category: "STRATEGIC SUPPORT",
      description: "Your strategic edge. Dabby Consultant provides priority support, sophisticated planning tools, and expert-level financial strategy tailored precisely to your workbench's specific data profile.",
      icon: <ShieldCheck size={32} className="step-main-icon" />,
      value: "Expert-level financial strategy at your fingertips."
    }
  ];

  const currentStep = steps[step - 1];

  const handleFinish = () => {
    localStorage.setItem('dabby_walkthrough_seen', 'true');
    onClose();
  };

  return (
    <div className="walkthrough-overlay">
      <div className="walkthrough-modal glass">
        <button className="walkthrough-close" onClick={onClose}><X size={20} /></button>
        
        <div className="walkthrough-content">
          <div className="walkthrough-visual">
            <div className="visual-icon-container">
              {currentStep.icon}
            </div>
            <div className="visual-glow"></div>
          </div>

          <div className="walkthrough-text">
            <span className="step-category">{currentStep.category}</span>
            <h2>{currentStep.title}</h2>
            <p className="step-description">{currentStep.description}</p>
            
            <div className="value-proposition">
              <MessageSquare size={16} />
              <span>{currentStep.value}</span>
            </div>
          </div>
        </div>

        <div className="walkthrough-footer">
          <div className="step-dots">
            {steps.map((_, i) => (
              <div key={i} className={`step-dot ${i + 1 === step ? 'active' : ''}`}></div>
            ))}
          </div>
          
          <div className="walkthrough-actions">
            {step > 1 && (
              <button className="walkthrough-back" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={18} />
              </button>
            )}
            
            <button className="walkthrough-skip" onClick={onClose}>Skip</button>
            
            {step < steps.length ? (
              <button className="walkthrough-next" onClick={() => setStep(step + 1)}>
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button className="walkthrough-finish" onClick={handleFinish}>
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .walkthrough-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .walkthrough-modal {
          width: 100%;
          max-width: 600px;
          border-radius: 2rem;
          background-color: hsl(var(--card) / 0.8);
          border: 1px solid hsl(var(--border) / 0.5);
          position: relative;
          overflow: hidden;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
          animation: modalFocus 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalFocus {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .walkthrough-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
          opacity: 0.5;
        }

        .walkthrough-close:hover {
          color: white;
          opacity: 1;
        }

        .walkthrough-content {
          padding: 3.5rem 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          text-align: center;
        }

        .visual-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1));
          border: 1px solid hsl(var(--primary) / 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--primary));
          position: relative;
          z-index: 1;
        }

        .visual-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          background-color: hsl(var(--primary));
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.2;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .step-category {
          font-size: 0.7rem;
          font-weight: 800;
          color: hsl(var(--primary));
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
          display: block;
        }

        .walkthrough-text h2 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
          background: linear-gradient(to bottom, white, #aaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .step-description {
          font-size: 1rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .value-proposition {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background-color: hsl(var(--accent) / 0.3);
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
          border: 1px solid hsl(var(--border) / 0.5);
        }

        .walkthrough-footer {
          padding: 2rem 3rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid hsl(var(--border) / 0.3);
        }

        .step-dots {
          display: flex;
          gap: 0.5rem;
        }

        .step-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: hsl(var(--border));
          transition: all 0.3s;
        }

        .step-dot.active {
          width: 20px;
          border-radius: 10px;
          background-color: hsl(var(--primary));
        }

        .walkthrough-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .walkthrough-skip {
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
        }

        .walkthrough-skip:hover {
          color: white;
        }

        .walkthrough-next, .walkthrough-finish {
          padding: 0.75rem 1.75rem;
          background-color: hsl(var(--primary));
          color: black;
          font-weight: 700;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .walkthrough-next:hover, .walkthrough-finish:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px -5px hsl(var(--primary) / 0.5);
        }

        .walkthrough-back {
          color: hsl(var(--muted-foreground));
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border) / 0.5);
        }

        .walkthrough-back:hover {
          color: white;
          background-color: hsl(var(--accent));
        }

        .pulse {
          animation: pulseIcon 2s infinite;
        }

        @keyframes pulseIcon {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default WalkthroughModal;
