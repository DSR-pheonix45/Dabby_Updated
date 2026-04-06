import React from 'react';

const LandingPage = ({ onGetStarted, onDemoLogin }) => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo-container">
          <svg viewBox="0 0 100 80" width="32" height="32">
            <path d="M50 0C25 0 0 20 0 45C0 70 20 80 50 80C80 80 100 70 100 45C100 20 75 0 50 0Z" fill="hsl(var(--primary))" />
            <ellipse cx="35" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
            <ellipse cx="65" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
          </svg>
          <span className="logo-text">Dabby</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <button className="login-link" onClick={onGetStarted}>Log in</button>
          <button className="get-started-btn" onClick={onGetStarted}>Get Started</button>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            The Future of <span className="gradient-text">Business Intelligence</span> is Here.
          </h1>
          <p className="hero-description">
            Experience the power of Dabby, your AI-powered companion for real-time financial insights and strategic planning.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onGetStarted}>Start Your Journey</button>
            <button className="secondary-btn" onClick={onDemoLogin}>Demo Mode</button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-card glass">
            <div className="visual-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="visual-body">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-grid">
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx="true">{`
        .landing-page {
          min-height: 100vh;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          overflow-x: hidden;
        }

        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 4rem;
          position: sticky;
          top: 0;
          z-index: 100;
          background: hsla(var(--background), 0.8);
          backdrop-filter: blur(10px);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links a {
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: hsl(var(--primary));
        }

        .get-started-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }

        .landing-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
          gap: 4rem;
        }

        .hero-content {
          flex: 1;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(90deg, hsl(var(--primary)), #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 1.25rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .primary-btn {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .secondary-btn {
          background-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
          border: 1px solid hsl(var(--border));
        }

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .visual-card {
          width: 100%;
          max-width: 500px;
          height: 350px;
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 50px hsla(0, 0%, 0%, 0.5);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .visual-header {
          background: hsl(var(--secondary));
          padding: 0.75rem;
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .red { background: #ef4444; }
        .yellow { background: #f59e0b; }
        .green { background: #10b981; }

        .visual-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .skeleton-line {
          height: 12px;
          background: hsl(var(--secondary));
          border-radius: 6px;
        }

        .skeleton-line.long { width: 80%; }
        .skeleton-line.medium { width: 60%; }

        .skeleton-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .skeleton-box {
          height: 100px;
          background: hsl(var(--secondary));
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
