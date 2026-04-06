import React, { useState } from 'react';
import { Building2, Plus, Globe, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import CreateWorkbenchModal from '../components/CreateWorkbenchModal';

const WorkbenchesPage = ({ workbenches, onCreateWorkbench, onNavigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreate = (data) => {
        onCreateWorkbench(data);
    };

    return (
        <div className="workbenches-page">
            <header className="page-header">
                <h1>Workbenches</h1>
                <p>Your collaborative financial workbenches</p>
            </header>

            <div className="workbenches-grid">
                {workbenches.map((wb) => (
                    <div
                        key={wb.id}
                        className="premium-card workbench-card"
                        onClick={() => onNavigate('coa_management', { workbenchId: wb.id })}
                    >
                        <div className="wb-header">
                            <div className="wb-icon-bg">
                                <Building2 size={24} />
                            </div>
                            <ChevronRight size={16} className="arrow-icon" />
                        </div>
                        <h3 className="wb-name">{wb.name}</h3>
                        <div className="wb-details">
                            <div className="detail-item">
                                <Globe size={14} />
                                <span>{wb.location}</span>
                            </div>
                            <div className="detail-item">
                                <DollarSign size={14} />
                                <span>{wb.currency}</span>
                            </div>
                            <div className="detail-item">
                                <Calendar size={14} />
                                <span>FY starts {wb.fyStart}</span>
                            </div>
                        </div>
                        <div className="wb-footer">
                            <span className="status-badge">{wb.status}</span>
                            <span className="time-ago">{wb.lastActive}</span>
                        </div>
                    </div>
                ))}

                <div className="premium-card create-wb-card" onClick={() => setIsModalOpen(true)}>
                    <div className="plus-icon-bg">
                        <Plus size={32} />
                    </div>
                    <h3>Create Workbench</h3>
                    <p>Set up a new financial workspace</p>
                </div>
            </div>

            <CreateWorkbenchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />

            <footer className="page-description">
                <p>
                    Dabby is a collaborative financial workbench where documents become transactions,
                    transactions power intelligence, and every stakeholder works on the same financial truth.
                </p>
            </footer>

            <style jsx="true">{`
        .workbenches-page {
          flex: 1;
          overflow-y: auto;
          padding: 4rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: hsl(var(--muted-foreground));
          font-size: 1.1rem;
        }

        .workbenches-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .workbench-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          cursor: pointer;
          position: relative;
        }

        .wb-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .wb-icon-bg {
          width: 48px;
          height: 48px;
          background-color: hsl(var(--foreground) / 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--muted-foreground));
        }

        .arrow-icon {
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }

        .wb-name {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .wb-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
        }

        .wb-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid hsl(var(--border) / 0.5);
        }

        .status-badge {
          background-color: hsla(168, 100%, 48%, 0.1);
          color: hsl(var(--primary));
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .time-ago {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }

        .create-wb-card {
          border: 2px dashed hsl(var(--border));
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
          min-height: 300px;
        }

        .create-wb-card:hover {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.02);
        }

        .plus-icon-bg {
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }

        .create-wb-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .create-wb-card p {
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
        }

        .page-description {
          margin-top: 4rem;
          max-width: 800px;
          text-align: center;
          margin-left: auto;
          margin-right: auto;
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
          line-height: 1.6;
          opacity: 0.7;
        }
      `}</style>
        </div>
    );
};

export default WorkbenchesPage;
