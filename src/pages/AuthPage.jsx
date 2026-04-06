import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, ChevronRight, AlertCircle, Play } from 'lucide-react';
import { useAuth } from '../context/auth-context';

const AuthPage = ({ onLogin, onNavigate }) => {
    const { loginAsDemo } = useAuth();

    const handleDemoLogin = () => {
        loginAsDemo();
        if (onLogin) onLogin();
    };
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailSent, setEmailSent] = useState(false);
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignup) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                setEmailSent(true);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            }
        } catch (err) {
            console.error('Auth error full object:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });
            if (error) throw error;
            alert('Confirmation email resent!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="auth-page">
                <div className="auth-card glass success-card">
                    <div className="auth-header">
                        <div className="success-icon">
                            <Mail size={48} />
                        </div>
                        <h2>Check your email</h2>
                        <p>We've sent a verification link to <strong>{email}</strong>. Please confirm your email to continue.</p>
                    </div>

                    <div className="success-actions">
                        <button className="resend-btn primary-btn" onClick={handleResendConfirmation} disabled={loading}>
                            {loading ? 'Sending...' : 'Resend Email'}
                        </button>
                        <button className="back-btn" onClick={() => setEmailSent(false)}>
                            Back to Login
                        </button>
                    </div>
                </div>
                <style jsx="true">{`
          .success-card { text-align: center; }
          .success-icon { margin-bottom: 2rem; color: hsl(var(--primary)); }
          .success-actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
          .primary-btn { 
            background-color: hsl(var(--primary)); 
            color: hsl(var(--primary-foreground)); 
            padding: 1rem; 
            border-radius: 0.75rem; 
            font-weight: 700; 
          }
          .back-btn { 
            color: hsl(var(--muted-foreground)); 
            font-weight: 600; 
            text-decoration: underline; 
            background: none; 
            border: none; 
            cursor: pointer; 
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card glass">
                <div className="auth-header">
                    <div className="logo-badge">
                        <svg viewBox="0 0 100 80" width="64" height="64">
                            <path d="M50 0C25 0 0 20 0 45C0 70 20 80 50 80C80 80 100 70 100 45C100 20 75 0 50 0Z" fill="hsl(var(--primary))" />
                            <ellipse cx="35" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
                            <ellipse cx="65" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
                        </svg>
                    </div>
                    <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
                    <p>{isSignup ? "Start your journey with Dabby AI" : "Enter your credentials to access your dashboard"}</p>
                </div>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleAuth}>
                    <div className="form-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <Loader2 className="spin" size={20} /> : isSignup ? 'Get Started' : 'Sign In'}
                        {!loading && <ChevronRight size={20} />}
                    </button>
                </form>

                <div className="demo-divider">
                    <span>OR</span>
                </div>

                <button className="demo-btn" onClick={handleDemoLogin}>
                    <Play size={18} fill="currentColor" />
                    Quick Demo Mode
                </button>

                <div className="auth-footer">
                    <p>
                        {isSignup ? "Already have an account?" : "Don't have an account?"}
                        <button onClick={() => setIsSignup(!isSignup)} className="toggle-btn">
                            {isSignup ? "Sign In" : "Create one"}
                        </button>
                    </p>
                </div>
            </div>

            <style jsx="true">{`
        .auth-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: hsl(var(--background));
          background-image: radial-gradient(circle at 50% 50%, hsla(var(--primary), 0.05) 0%, transparent 60%);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem;
          border-radius: 2rem;
          border: 1px solid hsl(var(--border));
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .auth-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .auth-header h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 1rem;
          letter-spacing: -0.02em;
        }

        .auth-header p {
          color: hsl(var(--muted-foreground));
          font-size: 0.95rem;
          max-width: 280px;
        }

        .error-banner {
          background-color: hsla(0, 100%, 50%, 0.1);
          border: 1px solid hsla(0, 100%, 50%, 0.2);
          color: #ff4444;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          animation: shake 0.4s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .auth-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 1rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px hsla(var(--primary), 0.3);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          text-align: center;
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
        }

        .toggle-btn {
          color: hsl(var(--primary));
          font-weight: 700;
          margin-left: 0.5rem;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .toggle-btn:hover {
          text-decoration: underline;
        }

        .demo-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          font-weight: 700;
          opacity: 0.5;
        }

        .demo-divider::before,
        .demo-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background-color: hsl(var(--border));
        }

        .demo-btn {
          background-color: transparent;
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
          padding: 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }

        .demo-btn:hover {
          background-color: hsl(var(--secondary));
          border-color: hsl(var(--primary));
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

export default AuthPage;
