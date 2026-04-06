import React, { useState } from 'react';
import {
    Package,
    Settings,
    ShoppingCart,
    Briefcase,
    Cpu,
    Monitor,
    Truck,
    PenTool,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Info,
    Server,
    MousePointer2,
    Zap,
    Globe
} from 'lucide-react';

const InventoryDecisionTree = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({
        type: '',
        usage: '',
        category: '',
        tax_rate: 18,
        hsn_suggestion: ''
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSelect = (field, value, next = true) => {
        setSelections(prev => ({ ...prev, [field]: value }));
        if (next) nextStep();
    };

    const renderStep1 = () => (
        <div className="step-container">
            <h3>Is this a physical product or a service?</h3>
            <p className="step-subtitle">This determines if we use HSN (Goods) or SAC (Services) codes.</p>

            <div className="options-grid">
                <button
                    className={`option-card ${selections.type === 'Goods' ? 'selected' : ''}`}
                    onClick={() => handleSelect('type', 'Goods')}
                >
                    <div className="option-icon"><Package size={24} /></div>
                    <div className="option-info">
                        <h4>Physical Goods</h4>
                        <p>Tangible products, electronics, hardware, etc.</p>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                </button>

                <button
                    className={`option-card ${selections.type === 'Service' ? 'selected' : ''}`}
                    onClick={() => handleSelect('type', 'Service')}
                >
                    <div className="option-icon"><Globe size={24} /></div>
                    <div className="option-info">
                        <h4>Professional Services</h4>
                        <p>Software, consulting, subscriptions, etc.</p>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="step-container">
            <h3>How will your business use this?</h3>
            <p className="step-subtitle">Classification helps in accurate P&L and Balance Sheet reporting.</p>

            <div className="options-grid">
                <button
                    className={`option-card ${selections.usage === 'Trading' ? 'selected' : ''}`}
                    onClick={() => handleSelect('usage', 'Trading')}
                >
                    <div className="option-icon"><ShoppingCart size={24} /></div>
                    <div className="option-info">
                        <h4>Business Product / Service</h4>
                        <p>To be sold to customers for revenue (Trading).</p>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                </button>

                <button
                    className={`option-card ${selections.usage === 'Internal' ? 'selected' : ''}`}
                    onClick={() => handleSelect('usage', 'Internal')}
                >
                    <div className="option-icon"><Briefcase size={24} /></div>
                    <div className="option-info">
                        <h4>Internal Operations</h4>
                        <p>For office use, utilities, or business running costs.</p>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                </button>
            </div>
            <button className="back-link" onClick={prevStep}><ChevronLeft size={16} /> Back</button>
        </div>
    );

    const categories = selections.type === 'Goods'
        ? [
            { id: 'Electronics', name: 'Electronics', icon: <Monitor size={20} />, hsn: '8471' },
            { id: 'Hardware', name: 'Hardware', icon: <Cpu size={20} />, hsn: '8517' },
            { id: 'Furniture', name: 'Furniture', icon: <Settings size={20} />, hsn: '9403' },
            { id: 'Office Supplies', name: 'Office Supplies', icon: <PenTool size={20} />, hsn: '4817' }
        ]
        : [
            { id: 'Software', name: 'Software/SaaS', icon: <Server size={20} />, sac: '9973' },
            { id: 'Professional Services', name: 'Consulting', icon: <Briefcase size={20} />, sac: '9983' },
            { id: 'Utilities', name: 'Utilities', icon: <Zap size={20} />, sac: '9986' },
            { id: 'Digital Services', name: 'Cloud/Digital', icon: <MousePointer2 size={20} />, sac: '9984' }
        ];

    const renderStep3 = () => (
        <div className="step-container">
            <h3>Refine the category</h3>
            <p className="step-subtitle">Selecting a sub-category pre-fills tax and HSN details.</p>

            <div className="categories-list">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`cat-item ${selections.category === cat.id ? 'selected' : ''}`}
                        onClick={() => {
                            setSelections(prev => ({
                                ...prev,
                                category: cat.id,
                                hsn_suggestion: cat.hsn || cat.sac || '',
                                tax_rate: cat.id === 'Software' ? 18 : 12
                            }));
                            nextStep();
                        }}
                    >
                        <div className="cat-icon">{cat.icon}</div>
                        <div className="cat-name">{cat.name}</div>
                        <div className="cat-code">{cat.hsn ? `HSN: ${cat.hsn}` : `SAC: ${cat.sac}`}</div>
                    </button>
                ))}
            </div>
            <button className="back-link" onClick={prevStep}><ChevronLeft size={16} /> Back</button>
        </div>
    );

    const renderSummary = () => (
        <div className="step-container summary">
            <div className="success-icon"><CheckCircle2 size={48} /></div>
            <h3>Categorization Complete</h3>
            <p className="step-subtitle">We've determined the best settings for your item.</p>

            <div className="summary-card">
                <div className="summary-row">
                    <span>Type</span>
                    <strong>{selections.type}</strong>
                </div>
                <div className="summary-row">
                    <span>Usage</span>
                    <strong>{selections.usage === 'Trading' ? 'Business Revenue' : 'Internal Ops'}</strong>
                </div>
                <div className="summary-row">
                    <span>Category</span>
                    <strong>{selections.category}</strong>
                </div>
                <div className="summary-row">
                    <span>Suggested Tax</span>
                    <strong>{selections.tax_rate}% GST</strong>
                </div>
            </div>

            <div className="summary-actions">
                <button className="apply-btn" onClick={() => onComplete(selections)}>
                    Apply Recommendations
                </button>
                <button className="restart-btn" onClick={() => setStep(1)}>
                    Start Over
                </button>
            </div>
        </div>
    );

    return (
        <div className="decision-tree-overlay">
            <div className="decision-tree-modal dark-glass">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderSummary()}

                <div className="dt-footer">
                    <button className="cancel-dt" onClick={onCancel}>Exit Wizard</button>
                    <div className="step-indicator">Step {step} of 4</div>
                </div>
            </div>

            <style jsx="true">{`
        .decision-tree-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: 1rem;
        }

        .decision-tree-modal {
          width: 100%;
          max-width: 540px;
          background: #0d1117;
          border: 1px solid rgba(0, 255, 194, 0.2);
          border-radius: 2rem;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 255, 194, 0.1);
          animation: dtPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes dtPop {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          width: 100%;
        }

        .progress-fill {
          height: 100%;
          background: #00ffc2;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 255, 194, 0.5);
        }

        .step-container {
          padding: 2.5rem;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .step-container h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .step-subtitle {
          color: #8b949e;
          font-size: 0.938rem;
          margin-bottom: 2rem;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.25rem;
          text-align: left;
          transition: all 0.2s;
          position: relative;
        }

        .option-card:hover {
          background: rgba(0, 255, 194, 0.05);
          border-color: rgba(0, 255, 194, 0.3);
          transform: translateX(5px);
        }

        .option-card.selected {
          background: rgba(0, 255, 194, 0.1);
          border-color: #00ffc2;
        }

        .option-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00ffc2;
        }

        .option-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .option-info p {
          font-size: 0.813rem;
          color: #8b949e;
        }

        .arrow {
          margin-left: auto;
          color: #484f58;
        }

        .categories-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .cat-item {
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }

        .cat-item:hover {
          background: rgba(0, 255, 194, 0.05);
          border-color: rgba(0, 255, 194, 0.3);
        }

        .cat-icon { color: #00ffc2; }
        .cat-name { font-weight: 700; color: #fff; font-size: 0.9rem; }
        .cat-code { font-size: 0.7rem; color: #484f58; font-weight: 600; font-family: monospace; }

        .back-link {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #8b949e;
          font-weight: 600;
          font-size: 0.875rem;
          background: none;
          width: fit-content;
        }

        .back-link:hover { color: #fff; }

        .summary {
          align-items: center;
          text-align: center;
        }

        .success-icon {
          color: #00ffc2;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 10px rgba(0, 255, 194, 0.3));
        }

        .summary-card {
          width: 100%;
          background: #161b22;
          border-radius: 1.25rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-row:last-child { border: none; padding: 0; }
        .summary-row span { color: #8b949e; font-size: 0.875rem; }
        .summary-row strong { color: #fff; }

        .summary-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .apply-btn {
          width: 100%;
          background: #00ffc2;
          color: #05070a;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
        }

        .restart-btn {
          color: #8b949e;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .dt-footer {
          padding: 1.5rem 2.5rem;
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cancel-dt { color: #ff7b72; font-weight: 600; font-size: 0.875rem; }
        .step-indicator { color: #484f58; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
        </div>
    );
};

export default InventoryDecisionTree;
