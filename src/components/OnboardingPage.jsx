import React, { useState } from 'react';
import { User, Briefcase, Phone, Calendar, ChevronRight, ChevronLeft, Check, UserCircle, Settings, Search, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';

const OnboardingPage = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: ''
  });

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    console.log('Onboarding: Saving profile for user:', user.id);

    try {
      const profileData = {
        id: user.id,
        email: user.email,
        name: formData.full_name,
        phone: formData.phone_number,
        dob: formData.date_of_birth,
        gender: formData.gender,
        updated_at: new Date().toISOString()
      };

      console.log('Onboarding: Attempting upsert...', profileData);

      const { data, error, status } = await supabase
        .from('users')
        .upsert(profileData)
        .select();

      if (error) {
        console.error('Onboarding: Supabase persistence error:', error);
        alert(`Failed to save profile [${error.code}]: ${error.message}`);
        return;
      }
      
      console.log('Onboarding: Save verified success (Status ' + status + ')', data);
      onComplete();
    } catch (err) {
      console.error('Onboarding: Unexpected exception during save:', err);
      alert('An unexpected error occurred while saving. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStep1Valid = formData.full_name && formData.phone_number;
  const isStep2Valid = formData.gender && formData.date_of_birth;

  return (
    // ... (Keep existing UI structure but add loading state to Complete button)
    <div className="onboarding-page">
      <div className="onboarding-card glass">
        <div className="onboarding-header">
          <div className="logo-badge">
            <svg viewBox="0 0 100 80" width="48" height="48">
              <path d="M50 0C25 0 0 20 0 45C0 70 20 80 50 80C80 80 100 70 100 45C100 20 75 0 50 0Z" fill="hsl(var(--primary))" />
              <ellipse cx="35" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
              <ellipse cx="65" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
            </svg>
          </div>
          <h2>
            {step === 1 ? "Contact Details" : "Identity"}
          </h2>
          <p className="step-indicator">Step {step} of 2</p>

          <div className="step-dots">
            {[1, 2].map(i => (
              <div key={i} className={`dot ${step >= i ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        <div className="onboarding-content">
          {step === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label><User size={16} /> Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="e.g. Medhansh K"
                  value={formData.full_name}
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label><Phone size={16} /> Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="form-group">
                <label>Gender</label>
                <div className="gender-options">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`gender-btn ${formData.gender === g.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, gender: g.toLowerCase() })}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label><Calendar size={16} /> Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          {step > 1 ? (
            <button className="back-btn" onClick={handleBack} disabled={loading}>
              <ChevronLeft size={20} /> Back
            </button>
          ) : <div />}

          <button
            className="next-btn"
            onClick={handleNext}
            disabled={
              loading ||
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid)
            }
          >
            {loading ? 'Saving...' : step === 2 ? 'Complete Setup' : 'Continue'}
            {!loading && <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .onboarding-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: hsl(var(--background));
          padding: 2rem;
        }

        .onboarding-card {
          width: 100%;
          max-width: 480px;
          padding: 3rem;
          border-radius: 1.5rem;
          border: 1px solid hsl(var(--border));
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }

        .onboarding-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .onboarding-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1rem;
          letter-spacing: -0.02em;
        }

        .step-indicator {
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
          font-weight: 500;
        }

        .step-dots {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .step-dots .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: hsl(var(--border));
          transition: all 0.3s ease;
        }

        .step-dots .dot.active {
          background-color: hsl(var(--primary));
          transform: scale(1.2);
          box-shadow: 0 0 8px hsla(var(--primary), 0.5);
        }

        .onboarding-content {
          min-height: 220px;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .label-text {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          text-align: center;
          margin-bottom: -0.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input {
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          padding: 1rem;
          border-radius: 0.75rem;
          color: hsl(var(--foreground));
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: hsl(var(--primary));
          background-color: hsla(var(--primary), 0.02);
        }

        .gender-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .gender-btn {
          padding: 0.75rem;
          border-radius: 0.75rem;
          background-color: hsl(var(--secondary));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }

        .gender-btn.active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }

        .role-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .onboarding-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .next-btn {
          flex: 1;
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 1rem;
          border-radius: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .next-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .next-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px hsla(var(--primary), 0.3);
        }

        .back-btn {
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-btn:hover {
          background-color: hsl(var(--accent));
        }

        .back-btn:hover {
          background-color: hsl(var(--accent));
        }
      `}</style>
    </div>
  );
};

export default OnboardingPage;
