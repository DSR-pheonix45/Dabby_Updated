import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { Check, Zap, Crown, Shield, ArrowRight, Star, Gift, Sparkles } from 'lucide-react';

const PricingPage = () => {
    const navigate = useNavigate();
    const { profile, updateTrialStatus } = useAuth();
    const [coupon, setCoupon] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [message, setMessage] = useState('');

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            desc: 'Essential AI chat for basic financial queries.',
            features: ['50 AI Messages / mo', 'Standard Chat Support', 'Basic Financial Insights'],
            color: 'hsl(var(--muted))',
            btn: 'Current Plan',
            current: profile?.plan === 'free' && !profile?.is_trial
        },
        {
            name: 'Go',
            price: '₹4,000',
            period: '/ month',
            desc: 'Perfect for growing startups and small businesses.',
            features: ['Unlimited AI Messages', '1 Automated Workbench', 'Chart of Accounts Sync', 'Basic Inventory', 'Zoho Books Integration'],
            color: 'hsl(var(--primary))',
            btn: 'Upgrade to Go',
            popular: true,
            current: profile?.plan === 'go' || profile?.is_trial
        },
        {
            name: 'Pro',
            price: '₹10,000',
            period: '/ month',
            desc: 'Advanced tools for mid-sized business operations.',
            features: ['Everything in Go', '5 Automated Workbenches', 'Advanced Inventory (GST)', 'Multi-user Team Access', 'Priority AI Processing', 'Slack & Stripe Integration'],
            color: '#3b82f6',
            btn: 'Go Pro'
        },
        {
            name: 'Enterprise',
            price: '₹25,000',
            period: '/ base',
            desc: 'Custom solutions for complex financial stacks.',
            features: ['Unlimited Workbenches', 'Custom API Integrations', 'Dedicated Account Manager', 'On-premise Deployment', 'Custom Security Hardening', '24/7 Priority Concierge'],
            color: '#8b5cf6',
            btn: 'Contact Sales'
        }
    ];

    const handleApplyCoupon = async () => {
        if (coupon.toUpperCase() === 'DABBY7TRIAL') {
            setIsApplying(true);
            try {
                await updateTrialStatus('DABBY7TRIAL');
                setMessage('Success! Your 7-day Go trial has been activated.');
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (err) {
                setMessage('Error applying coupon. Please try again.');
            } finally {
                setIsApplying(false);
            }
        } else {
            setMessage('Invalid coupon code.');
        }
    };

    return (
        <div className="pricing-page">
            <header className="pricing-header">
                <div className="surprise-bonus animate-bounce-subtle">
                   <Gift size={20} />
                   <span>Special Offer: Get 7 Days of "Go" Plan for FREE!</span>
                </div>
                <h1>Choose your plan</h1>
                <p>Simple, transparent pricing for every stage of your business.</p>
            </header>

            <div className="plans-grid">
                {plans.map((plan) => (
                    <div key={plan.name} className={`plan-card glass ${plan.popular ? 'popular' : ''}`}>
                        {plan.popular && <div className="popular-badge">Most Popular</div>}
                        <div className="plan-top">
                            <span className="plan-name" style={{ color: plan.color }}>{plan.name}</span>
                            <div className="plan-price">
                                <span className="amount">{plan.price}</span>
                                <span className="period">{plan.period}</span>
                            </div>
                            <p className="plan-desc">{plan.desc}</p>
                        </div>

                        <div className="plan-features">
                            {plan.features.map((f, i) => (
                                <div key={i} className="feature-item">
                                    <Check size={16} className="text-primary" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            className={`plan-btn ${plan.popular ? 'primary' : 'secondary'} ${plan.current ? 'disabled' : ''}`}
                            disabled={plan.current}
                        >
                            {plan.current ? 'Active Plan' : plan.btn}
                        </button>
                    </div>
                ))}
            </div>

            <section className="coupon-section glass">
                <div className="coupon-info">
                   <Sparkles className="text-yellow-400" />
                   <div>
                       <h3>Have a Trial Coupon?</h3>
                       <p>Enter your 7-day trial code to unlock premium features instantly.</p>
                   </div>
                </div>
                <div className="coupon-input-group">
                    <input 
                        type="text" 
                        placeholder="Enter code (Try DABBY7TRIAL)" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button 
                        onClick={handleApplyCoupon}
                        disabled={!coupon || isApplying}
                    >
                        {isApplying ? 'Applying...' : 'Apply Code'}
                    </button>
                </div>
                {message && <p className={`coupon-msg ${message.includes('Success') ? 'success' : 'error'}`}>{message}</p>}
            </section>

            <style jsx="true">{`
                .pricing-page {
                    flex: 1;
                    overflow-y: auto;
                    padding: 4rem 2rem;
                    background-color: hsl(var(--background));
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4rem;
                }

                .pricing-header {
                    text-align: center;
                    max-width: 600px;
                }

                .surprise-bonus {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1.25rem;
                    background: linear-gradient(to right, hsla(168, 100%, 48%, 0.1), hsla(168, 100%, 48%, 0.05));
                    border: 1px solid hsla(168, 100%, 48%, 0.2);
                    border-radius: 2rem;
                    color: hsl(var(--primary));
                    font-size: 0.85rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                }

                .pricing-header h1 {
                    font-size: 3.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                }

                .pricing-header p {
                    color: hsl(var(--muted-foreground));
                    font-size: 1.25rem;
                }

                .plans-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                    width: 100%;
                    max-width: 1200px;
                }

                .plan-card {
                    padding: 2.5rem;
                    border-radius: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    position: relative;
                    transition: all 0.3s ease;
                    border: 1px solid hsla(var(--border), 0.5);
                }

                .plan-card:hover {
                    border-color: hsla(var(--primary), 0.3);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px hsla(0, 0%, 0%, 0.4);
                }

                .plan-card.popular {
                    background: linear-gradient(to bottom, hsla(var(--primary), 0.05), hsla(var(--background), 0.5));
                    border-color: hsla(var(--primary), 0.4);
                }

                .popular-badge {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: hsl(var(--primary));
                    color: black;
                    padding: 0.25rem 0.75rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .plan-name {
                    font-size: 1.25rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    gap: 0.25rem;
                    margin: 1rem 0;
                }

                .amount {
                    font-size: 3rem;
                    font-weight: 800;
                }

                .period {
                    color: hsl(var(--muted-foreground));
                    font-size: 1rem;
                }

                .plan-desc {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.95rem;
                    line-height: 1.6;
                }

                .plan-features {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.9rem;
                    color: hsl(var(--foreground));
                    opacity: 0.9;
                }

                .feature-item svg {
                    color: hsl(var(--primary));
                    flex-shrink: 0;
                }

                .plan-btn {
                    padding: 1rem;
                    border-radius: 1rem;
                    font-weight: 700;
                    transition: 0.2s;
                }

                .plan-btn.primary {
                    background-color: hsl(var(--primary));
                    color: black;
                }

                .plan-btn.secondary {
                    background-color: hsla(var(--foreground), 0.05);
                    border: 1px solid hsla(var(--border), 0.5);
                    color: white;
                }

                .plan-btn:hover:not(.disabled) {
                    transform: scale(1.02);
                    opacity: 0.9;
                }

                .plan-btn.disabled {
                    opacity: 0.5;
                    cursor: default;
                }

                .coupon-section {
                    width: 100%;
                    max-width: 800px;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                    border: 1px solid hsla(var(--border), 0.5);
                    background: hsla(var(--card), 0.4);
                }

                .coupon-info {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }

                .coupon-info h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
                .coupon-info p { color: hsl(var(--muted-foreground)); font-size: 0.9rem; }

                .coupon-input-group {
                    display: flex;
                    gap: 0.75rem;
                }

                .coupon-input-group input {
                    background: #000;
                    border: 1px solid #333;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    color: white;
                    width: 200px;
                }

                .coupon-input-group button {
                    background: hsl(var(--primary));
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    color: black;
                }

                .coupon-msg { font-size: 0.85rem; margin-top: 0.5rem; }
                .coupon-msg.success { color: #10b981; }
                .coupon-msg.error { color: #ef4444; }

                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                .animate-bounce-subtle { animation: bounce 2s infinite; }

                @media (max-width: 768px) {
                    .coupon-section { flex-direction: column; text-align: center; }
                    .coupon-info { flex-direction: column; }
                    .coupon-input-group { width: 100%; }
                    .coupon-input-group input { flex: 1; }
                }
            `}</style>
        </div>
    );
};

export default PricingPage;
