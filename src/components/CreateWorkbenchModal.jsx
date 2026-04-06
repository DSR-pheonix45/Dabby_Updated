import React, { useState } from 'react';
import { X, Building2, MapPin, ShieldCheck, CreditCard, ChevronRight, ChevronLeft, Globe, DollarSign, Clock, Check, ArrowRight, RefreshCw } from 'lucide-react';

const CreateWorkbenchModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Org Details
    name: '',
    legal_name: '',
    type: 'startup',
    industry: 'services', // Added
    sector: 'technology', // Added
    business_type: 'pvt_ltd', // Added
    country: 'India',
    base_currency: 'INR',
    timezone: '',
    // Address
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'registered',
    // Compliance
    pan: '',
    gstin: '',
    tan: '',
    cin: '',
    // Financials
    fiscal_year_start: '',
    books_start_date: '',
    coa_mode: 'create', // Added (create or import)
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStepValid = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;
    const cinRegex = /^([L|U]{1})([0-9]{5})([A-Z]{2})([0-9]{4})([A-Z]{3})([0-9]{6})$/;

    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.type !== '' && formData.country !== '';
      case 2:
        return formData.address_line1.trim() !== '' && formData.city.trim() !== '' && formData.pincode.trim() !== '';
      case 3:
        // Make validation more lenient for onboarding (optional vs strict)
        const vPan = formData.pan.trim().toUpperCase();
        const vGstin = formData.gstin.trim().toUpperCase();
        
        // At least check PAN and GSTIN if provided, otherwise allow next if they are 10/15 chars
        return (vPan.length >= 10 && vGstin.length >= 15);
      case 4:
        return formData.fiscal_year_start !== '' && formData.books_start_date !== '';
      default:
        return true;
    }
  };

  const isFormValid = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return (
      formData.name.trim() !== '' &&
      formData.address_line1.trim() !== '' &&
      panRegex.test(formData.pan.toUpperCase()) &&
      formData.fiscal_year_start !== ''
    );
  };

  const handleNext = () => {
    if (isStepValid()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid() && step === 4) {
      onCreate(formData);
      onClose();
    }
  };

  const steps = [
    { title: 'Organization', icon: <Building2 size={18} /> },
    { title: 'Address', icon: <MapPin size={18} /> },
    { title: 'Compliance', icon: <ShieldCheck size={18} /> },
    { title: 'Financials', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <h2>Create New Workbench</h2>
          <div className="step-progress">
            {steps.map((s, i) => (
              <div key={i} className={`step-item ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
                <div className="step-icon">{s.icon}</div>
                <span className="step-title">{s.title}</span>
                {i < steps.length - 1 && <div className="step-line"></div>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {step === 1 && (
            <div className="form-step">
              <div className="form-grid">
                <div className="form-group">
                  <label>Workbench Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Dabby AI" required />
                </div>
                <div className="form-group">
                  <label>Legal Name</label>
                  <input type="text" name="legal_name" value={formData.legal_name} onChange={handleChange} placeholder="Full legal entity name" />
                </div>
                <div className="form-group">
                  <label>Business Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleChange}>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Services</option>
                    <option value="trading">Trading</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sector</label>
                  <select name="sector" value={formData.sector} onChange={handleChange}>
                    <option value="construction">Construction</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Business Type</label>
                  <select name="business_type" value={formData.business_type} onChange={handleChange}>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt_ltd">Private Limited (Pvt Ltd)</option>
                    <option value="llp">LLP</option>
                    <option value="public_ltd">Public Limited</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Globe size={14} /> Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label><DollarSign size={14} /> Base Currency</label>
                  <input type="text" name="base_currency" value={formData.base_currency} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label><Clock size={14} /> Timezone</label>
                  <input type="text" name="timezone" value={formData.timezone} onChange={handleChange} placeholder="e.g. Asia/Kolkata" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Address Line 1</label>
                  <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} />
                </div>
                <div className="form-group span-2">
                  <label>Address Line 2</label>
                  <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Address Type</label>
                  <select name="address_type" value={formData.address_type} onChange={handleChange}>
                    <option value="registered">Registered</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <div className="form-grid">
                <div className="form-group">
                  <label>PAN</label>
                  <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder="ABCDE1234F" />
                </div>
                <div className="form-group">
                  <label>GSTIN</label>
                  <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
                </div>
                <div className="form-group">
                  <label>TAN</label>
                  <input type="text" name="tan" value={formData.tan} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CIN</label>
                  <input type="text" name="cin" value={formData.cin} onChange={handleChange} placeholder="U12345KA2023PTC123456" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step">
              <div className="form-grid">
                <div className="form-group">
                  <label>Fiscal Year Start</label>
                  <input type="date" name="fiscal_year_start" value={formData.fiscal_year_start} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Books Start Date</label>
                  <input type="date" name="books_start_date" value={formData.books_start_date} onChange={handleChange} />
                </div>

                <div className="form-group span-2">
                  <label style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Chart of Accounts Setup</label>
                  <div className="coa-type-selector">
                    <div
                      className={`coa-option ${formData.coa_mode === 'create' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, coa_mode: 'create' })}
                    >
                      <div className="option-icon"><CreditCard size={20} /></div>
                      <div className="option-info">
                        <strong>Standard Setup</strong>
                        <span>Initialize with default Indian COA</span>
                      </div>
                    </div>
                    <div
                      className={`coa-option ${formData.coa_mode === 'import' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, coa_mode: 'import' })}
                    >
                      <div className="option-icon"><Globe size={20} /></div>
                      <div className="option-info">
                        <strong>Import from ERP</strong>
                        <span>Connect Zoho, Tally, or Excel</span>
                      </div>
                    </div>
                  </div>

                  {formData.coa_mode === 'import' && (
                    <div className="zoho-connect-notice glass">
                      <div className="notice-content">
                        <div className="zoho-status">
                          {localStorage.getItem('dabby_zoho_status') === 'connected' ? (
                            <span className="status-badge connected"><Check size={14} /> Zoho Connected</span>
                          ) : (
                            <span className="status-badge disconnected"><X size={14} /> Zoho Not Connected</span>
                          )}
                        </div>
                        <p>To import your Chart of Accounts, you need to connect your Zoho Books account first.</p>
                        <button
                          type="button"
                          className="coa-connect-btn"
                          onClick={() => {
                            window.location.href = '/tools?connect=zoho';
                          }}
                        >
                          Connect Zoho Accountant <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer">
            {step > 1 && (
              <button type="button" className="back-btn" onClick={handleBack}>
                <ChevronLeft size={18} /> Back
              </button>
            )}
            <div className="spacer"></div>
            {step < 4 ? (
              <button
                type="button"
                className={`next-btn ${!isStepValid() ? 'disabled' : ''}`}
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                className={`submit-btn ${!isStepValid() || isOpen === 'loading' ? 'disabled' : ''}`}
                onClick={handleSubmit}
                disabled={!isStepValid() || isOpen === 'loading'}
              >
                {isOpen === 'loading' ? (
                  <>
                    <RefreshCw size={18} className="spinning" /> Creating...
                  </>
                ) : 'Create Workbench'}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          width: 100%;
          max-width: 700px;
          border-radius: 1.5rem;
          background-color: #0a0a0a;
          border: 1px solid #1a1a1a;
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
          color: white;
        }

        .close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: #666;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: white;
        }

        .modal-header {
          padding: 2.5rem 2.5rem 1.5rem;
          border-bottom: 1px solid #1a1a1a;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: white;
        }

        .step-progress {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          flex: 1;
          z-index: 1;
        }

        .step-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          border: 1px solid #2a2a2a;
          transition: all 0.3s;
        }

        .step-item.active .step-icon {
          background-color: hsl(var(--primary));
          color: #000;
          border-color: hsl(var(--primary));
        }

        .step-item.completed .step-icon {
          background-color: hsla(var(--primary), 0.2);
          color: hsl(var(--primary));
          border-color: hsl(var(--primary));
        }

        .step-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
        }

        .step-item.active .step-title {
          color: white;
        }

        .step-line {
          position: absolute;
          top: 18px;
          left: 50%;
          width: 100%;
          height: 1px;
          background-color: #2a2a2a;
          z-index: -1;
        }

        .step-item.completed .step-line {
          background-color: hsl(var(--primary));
        }

        .modal-body {
          padding: 2.5rem;
          overflow-y: auto;
          background-color: #0a0a0a;
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

        .form-group.span-2 {
          grid-column: span 2;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #efefef;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .form-group input, .form-group select {
          background-color: #121212;
          border: 1px solid #2a2a2a;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: white;
          transition: all 0.2s;
        }

        .form-group input:focus, .form-group select:focus {
          border-color: hsl(var(--primary));
          outline: none;
          background-color: #161616;
        }

        .form-group input::placeholder {
          color: #444;
        }

        .modal-footer {
          padding: 1.5rem 2.5rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-top: 1px solid #1a1a1a;
          background-color: #0a0a0a;
        }

        .spacer {
          flex: 1;
        }

        .next-btn, .submit-btn {
          background-color: hsl(var(--primary));
          color: #000;
          padding: 0.75rem 1.8rem;
          border-radius: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s;
        }

        .next-btn.disabled, .submit-btn.disabled {
          background-color: #333;
          color: #666;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .next-btn.disabled:hover, .submit-btn.disabled:hover {
          transform: none;
          opacity: 0.5;
        }

        .back-btn {
          color: #888;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }

        .coa-type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .coa-option {
          padding: 1.25rem;
          background-color: #121212;
          border: 1px solid #2a2a2a;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .coa-option:hover {
          border-color: #444;
          background-color: #161616;
        }

        .coa-option.active {
          border-color: hsl(var(--primary));
          background-color: hsla(var(--primary), 0.05);
          box-shadow: 0 0 15px hsla(var(--primary), 0.1);
        }

        .option-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
        }

        .coa-option.active .option-icon {
          background-color: hsla(var(--primary), 0.2);
          color: hsl(var(--primary));
        }

        .option-info {
          display: flex;
          flex-direction: column;
        }

        .option-info strong {
          font-size: 0.9rem;
          color: white;
        }

        .option-info span {
          font-size: 0.75rem;
          color: #666;
        }
        .zoho-connect-notice {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid hsla(var(--primary), 0.2);
          background: hsla(var(--primary), 0.02);
        }

        .notice-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .zoho-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .status-badge.connected {
          background-color: hsla(168, 100%, 48%, 0.1);
          color: #10b981;
        }

        .status-badge.disconnected {
          background-color: hsla(0, 100%, 50%, 0.1);
          color: #ef4444;
        }

        .zoho-connect-notice p {
          font-size: 0.85rem;
          color: #aaa;
          line-height: 1.6;
        }

        .coa-connect-btn {
          background-color: #00ffc2;
          color: #05070a;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: transform 0.2s;
        }

        .coa-connect-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px hsla(168, 100%, 48%, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CreateWorkbenchModal;
