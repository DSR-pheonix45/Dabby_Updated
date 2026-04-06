import React from 'react';
import { BarChart3, Search, Calendar, Activity, Users } from 'lucide-react';

const ActionCards = () => {
  const cards = [
    { icon: <BarChart3 size={20} />, title: 'Revenue Analysis', subtitle: 'What are our top revenue streams?', category: 'FINANCE' },
    { icon: <Search size={20} />, title: 'Market Research', subtitle: 'Analyze our market position', category: 'STRATEGY' },
    { icon: <Calendar size={20} />, title: 'Financial Planning', subtitle: 'Create a financial forecast', category: 'PLANNING' },
    { icon: <Activity size={20} />, title: 'Performance Analytics', subtitle: 'Compare quarterly performance', category: 'ANALYTICS' },
    { icon: <Users size={20} />, title: 'Customer Analysis', subtitle: 'Break down our customer segments', category: 'INSIGHTS' },
  ];

  return (
    <div className="cards-grid">
      {cards.map((card, index) => (
        <div key={index} className="premium-card action-card">
          <div className="card-header">
            <div className="card-icon">{card.icon}</div>
            <span className="card-category">{card.category}</span>
          </div>
          <h3 className="card-title">{card.title}</h3>
          <p className="card-subtitle">{card.subtitle}</p>
        </div>
      ))}

      <style jsx="true">{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          width: 100%;
          padding: 0;
        }

        @media (max-width: 1024px) {
          .cards-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .cards-grid { grid-template-columns: 1fr; }
        }

        .action-card {
          cursor: pointer;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem !important;
          background: linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)));
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .card-icon {
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-icon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .card-category {
          font-size: 0.65rem;
          font-weight: 800;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.15em;
          opacity: 0.5;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        .card-subtitle {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default ActionCards;
