import React, { useState, useEffect } from 'react';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import ActionCards from '../components/ActionCards';
import WalkthroughModal from '../components/WalkthroughModal';
import TrialStatusHeader from '../components/TrialStatusHeader';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ profile, user }) => {
    const { messages } = useChat();
    const navigate = useNavigate();
    const [showWalkthrough, setShowWalkthrough] = useState(false);
    
    // Hide UI after message sent (messages[0] is always the welcome message)
    const hasSentMessage = messages.length > 1;

    useEffect(() => {
        const hasSeenWalkthrough = localStorage.getItem('dabby_walkthrough_seen');
        if (!hasSeenWalkthrough) {
            const timer = setTimeout(() => {
                setShowWalkthrough(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleWalkthroughClose = () => {
        localStorage.setItem('dabby_walkthrough_seen', 'true');
        setShowWalkthrough(false);
    };

    return (
        <div className="dashboard-page">
            <TrialStatusHeader />
            
            {!hasSentMessage && (
                <section className="welcome-banner">
                    <div className="hero-logo">
                        <svg viewBox="0 0 100 80" width="80" height="60">
                            <path d="M50 0C25 0 0 20 0 45C0 70 20 80 50 80C80 80 100 70 100 45C100 20 75 0 50 0Z" fill="hsl(var(--primary))" />
                            <ellipse cx="35" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
                            <ellipse cx="65" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
                        </svg>
                    </div>
                    <div className="welcome-text">
                        <h3>Welcome back, {profile?.name || user?.email?.split('@')[0]}</h3>
                        <p>Your AI-powered business intelligence assistant</p>
                    </div>
                </section>
            )}

            {!hasSentMessage && (
                <section className="quick-stats">
                    <ActionCards />
                </section>
            )}

            <section className={`chat-container ${hasSentMessage ? 'expanded' : ''}`}>
                {!hasSentMessage && <div className="ask-label">ASK DABBY</div>}
                <div className="chat-viewport">
                    <ChatHistory />
                </div>
                <ChatInput />
            </section>

            <WalkthroughModal 
                isOpen={showWalkthrough} 
                onClose={handleWalkthroughClose}
                type="PLATFORM_TOUR"
            />

            <style jsx="true">{`
        .dashboard-page {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background-color: hsl(var(--background));
          padding: 0 2rem;
        }

        .welcome-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          margin-top: 3rem;
          margin-bottom: 2rem;
          text-align: center;
          width: 100%;
        }

        .hero-logo svg {
          width: 70px;
          height: 56px;
          filter: drop-shadow(0 0 15px hsl(var(--primary) / 0.15));
        }

        .welcome-text h3 {
          font-size: 1.85rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          background: linear-gradient(to bottom, white, #999);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .welcome-text p {
          color: hsl(var(--muted-foreground));
          font-size: 0.95rem;
          max-width: 500px;
          margin: 0 auto;
          opacity: 0.8;
        }

        .quick-stats {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto 3rem auto;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-container.expanded {
          max-width: 900px;
          padding-top: 1.5rem;
        }

        .chat-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 6rem;
        }

        .ask-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: hsl(var(--primary));
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 1.25rem;
          opacity: 0.4;
          text-align: center;
        }
      `}</style>
        </div>
    );
};

export default DashboardPage;
