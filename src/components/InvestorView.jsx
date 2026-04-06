import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldAlert,
  Zap,
  DollarSign
} from 'lucide-react';

const InvestorView = ({ workbench }) => {
  return (
    <div className="investor-view">
      <header className="view-header">
        <div className="header-info">
          <div className="title-row">
            <PieChart size={28} className="title-icon" />
            <h1>Investor Relations</h1>
          </div>
          <p>Consolidated summary for {workbench.name} stakeholders</p>
        </div>
        <div className="header-actions">
          <button className="export-btn">Download Quarterly Report</button>
        </div>
      </header>

      <div className="kpi-stripe">
        <div className="kpi-card">
          <TrendingUp size={20} className="kpi-icon" />
          <div className="kpi-data">
            <span className="label">Monthly Revenue</span>
            <div className="val">₹12.4L <ArrowUpRight size={16} className="trend-pos" /></div>
          </div>
        </div>
        <div className="kpi-card">
          <DollarSign size={20} className="kpi-icon green" />
          <div className="kpi-data">
            <span className="label">Cash in Bank</span>
            <div className="val">₹84.2L</div>
          </div>
        </div>
        <div className="kpi-card">
          <Zap size={20} className="kpi-icon yellow" />
          <div className="kpi-data">
            <span className="label">Runway</span>
            <div className="val">18 Months</div>
          </div>
        </div>
        <div className="kpi-card">
          <ShieldAlert size={20} className="kpi-icon red" />
          <div className="kpi-data">
            <span className="label">Critical Risks</span>
            <div className="val">2 Active</div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <section className="summary-section dark-glass">
          <h3>Executive Summary</h3>
          <p>
            {workbench.name} has maintained a strong current ratio of 2.4x this quarter. 
            Revenue has grown by 15% WoW due to increased platform adoption. 
            Burn rate is optimized at ₹3.2L/mo, significantly lower than the ₹4.5L projected.
          </p>
          
          <div className="highlights">
            <div className="highlight-item">
              <div className="dot pos"></div>
              <span>Completed Audit for FY 2025-26</span>
            </div>
            <div className="highlight-item">
              <div className="dot pos"></div>
              <span>Secured R&D tax credits (₹8L)</span>
            </div>
            <div className="highlight-item">
              <div className="dot neg"></div>
              <span>AP backlog increased by 12%</span>
            </div>
          </div>
        </section>

        <section className="risk-heatmap dark-glass">
          <h3>Risk Assessment</h3>
          <div className="heatmap">
            <div className="risk-row high">
              <span className="risk-label">Regulatory Change (GST)</span>
              <div className="risk-bar"><div className="fill" style={{width: '90%'}}></div></div>
            </div>
            <div className="risk-row med">
              <span className="risk-label">Vendor Lock-in</span>
              <div className="risk-bar"><div className="fill" style={{width: '45%'}}></div></div>
            </div>
            <div className="risk-row low">
              <span className="risk-label">Data Privacy</span>
              <div className="risk-bar"><div className="fill" style={{width: '20%'}}></div></div>
            </div>
          </div>
          <p className="risk-note">* High impact risks require immediate mitigation planning.</p>
        </section>
      </div>

      <style jsx="true">{`
        .investor-view {
          padding: 2.5rem;
          height: 100%;
          overflow-y: auto;
          background-color: hsl(var(--background));
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .title-icon {
          color: hsl(var(--primary));
        }

        .header-info h1 {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .header-info p {
          color: hsl(var(--muted-foreground));
        }

        .export-btn {
          background-color: hsla(var(--primary), 0.1);
          color: hsl(var(--primary));
          border: 1px solid hsla(var(--primary), 0.2);
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .kpi-stripe {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .kpi-card {
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.25rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .kpi-icon { color: hsl(var(--primary)); }
        .kpi-icon.green { color: #10b981; }
        .kpi-icon.yellow { color: #f59e0b; }
        .kpi-icon.red { color: #ef4444; }

        .kpi-data .label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          display: block;
          margin-bottom: 0.25rem;
        }

        .kpi-data .val {
          font-size: 1.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .trend-pos { color: #10b981; }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .summary-section, .risk-heatmap {
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1.5rem;
          padding: 2.5rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .summary-section p {
          line-height: 1.6;
          color: hsl(var(--foreground));
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .highlights {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background-color: hsl(var(--secondary));
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.pos { background-color: #10b981; }
        .dot.neg { background-color: #f59e0b; }

        .heatmap {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .risk-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .risk-label {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .risk-bar {
          height: 12px;
          background-color: hsl(var(--secondary));
          border-radius: 6px;
          overflow: hidden;
        }

        .fill { height: 100%; border-radius: 6px; }
        .high .fill { background-color: #ef4444; }
        .med .fill { background-color: #f59e0b; }
        .low .fill { background-color: #3b82f6; }

        .risk-note {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default InvestorView;
