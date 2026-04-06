import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  Building2, 
  Globe, 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft,
  Loader2,
  Landmark,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  UserPlus,
  Shield,
  Lock,
  Clock,
  PiggyBank,
  TrendingUp,
  ArrowDownCircle,
  DollarSign,
  Calculator,
  Workflow
} from 'lucide-react';
import { getHierarchicalTemplate } from '../data/coaData';
import { fetchZohoCOA } from '../services/zohoService';
import { dbService } from '../services/dbService';
import { useNavigate } from 'react-router-dom';

const COASetup = ({ workbench, onComplete }) => {
  const [step, setStep] = useState(1); 
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coaTree, setCoaTree] = useState(null);
  const [activePillar, setActivePillar] = useState('assets');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'Accountant' });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const methods = [
    {
      id: 'template',
      title: 'Industry Templates',
      description: 'Start with a selection of accounts curated for your industry (Technology, Mfg, etc.)',
      icon: <FileText className="method-icon" />,
      tag: 'Recommended'
    },
    {
      id: 'zoho',
      title: 'Import from Zoho',
      description: 'Connect your Zoho Books account and pull your existing business model structure',
      icon: <Upload className="method-icon" />,
    },
    {
      id: 'invite',
      title: 'Invite Advisor',
      description: 'Let your Accountant or Financial Advisor set up your engine for you.',
      icon: <Landmark className="method-icon" />,
    }
  ];

  const handleSelectMethod = async (methodId) => {
    if (methodId === 'invite') {
      setShowInviteModal(true);
      return;
    }

    setSelectedMethod(methodId);
    if (methodId === 'template') {
      const templateTree = getHierarchicalTemplate(workbench?.industry || 'others');
      setCoaTree(templateTree);
      setStep(3);
    } else if (methodId === 'zoho') {
      setIsProcessing(true);
      try {
        const zohoOrgId = localStorage.getItem('dabby_zoho_org_id');
        if (zohoOrgId) {
          const zohoAccounts = await fetchZohoCOA(zohoOrgId);
          const templateTree = getHierarchicalTemplate('others');
          setCoaTree(templateTree);
          setStep(3);
        } else {
          alert('Please connect Zoho first in the Tools section.');
        }
      } catch (err) {
        console.error('Zoho Fetch Error:', err);
        alert('Failed to pull Zoho accounts.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const toggleAccount = (pillarKey, subCatKey, accountName) => {
    setCoaTree(prev => {
      const newTree = { ...prev };
      const pillar = { ...newTree[pillarKey] };
      const subcategories = { ...pillar.subcategories };
      const subCat = { ...subcategories[subCatKey] };
      
      subCat.accounts = subCat.accounts.map(acc => 
        acc.name === accountName ? { ...acc, selected: !acc.selected } : acc
      );

      subcategories[subCatKey] = subCat;
      pillar.subcategories = subcategories;
      newTree[pillarKey] = pillar;
      
      return newTree;
    });
  };

  const getPillarIcon = (key, size = 20) => {
    switch (key) {
      case 'assets': return <Building2 size={size} />;
      case 'liabilities': return <Clock size={size} />;
      case 'equity': return <Calculator size={size} />;
      case 'revenue': return <TrendingUp size={size} />;
      case 'expense': return <ArrowDownCircle size={size} />;
      case 'cash': return <DollarSign size={size} />;
      default: return <Database size={size} />;
    }
  };

  const getPillarCount = (pillar) => {
    if (!pillar || !pillar.subcategories) return 0;
    return Object.values(pillar.subcategories).reduce((count, sub) => {
      return count + sub.accounts.filter(acc => acc.selected).length;
    }, 0);
  };

  const getSelectedAccounts = () => {
    if (!coaTree) return [];
    const selected = [];
    Object.values(coaTree).forEach(pillar => {
      Object.values(pillar.subcategories).forEach(sub => {
        selected.push(...sub.accounts.filter(acc => acc.selected));
      });
    });
    return selected;
  };

  const addCustomAccount = (pillarKey, subCatKey) => {
    const name = prompt('Enter Account Name:');
    if (name) {
      setCoaTree(prev => {
        const newTree = { ...prev };
        const pillar = { ...newTree[pillarKey] };
        const subcategories = { ...pillar.subcategories };
        const subCat = { ...subcategories[subCatKey] };
        
        subCat.accounts = [...subCat.accounts, {
          name,
          type: pillar.name,
          balance: 0,
          balanceType: pillarKey === 'expense' || pillarKey === 'assets' || pillarKey === 'cash' ? 'Dr' : 'Cr',
          selected: true,
          custom: true
        }];

        subcategories[subCatKey] = subCat;
        pillar.subcategories = subcategories;
        newTree[pillarKey] = pillar;
        return newTree;
      });
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteData.email) return;

    setIsProcessing(true);
    try {
      const newMember = {
        id: Date.now(),
        name: inviteData.email.split('@')[0],
        email: inviteData.email,
        role: inviteData.role,
        status: 'PENDING'
      };

      const updatedMembers = [...(workbench?.members || []), newMember];
      await dbService.updateWorkbenchMembers(workbench.id, updatedMembers);
      
      setShowInviteModal(false);
      alert(`Invitation sent to ${inviteData.email} as ${inviteData.role}.`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to send invitation: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalize = async () => {
    if (!workbench?.id || !coaTree) return;
    setIsProcessing(true);
    try {
      const finalAccounts = [];
      Object.values(coaTree).forEach(pillar => {
        Object.values(pillar.subcategories).forEach(sub => {
          finalAccounts.push(...sub.accounts.filter(acc => acc.selected));
        });
      });

      await dbService.saveCOA(workbench.id, finalAccounts);
      
      if (onComplete) {
        onComplete('manual', finalAccounts); 
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Finalize Error:', err);
      alert('Error saving COA: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="coa-setup">
      <div className="coa-container">
        
        <div className="coa-stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-bead">1</div>
            <span>Method</span>
          </div>
          <div className={`step-line ${step > 1 ? 'filled' : ''}`}></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-bead">2</div>
            <span>Build Engine</span>
          </div>
        </div>

        <header className="coa-header">
          <div className="wb-badge">
            <Workflow size={14} />
            <span>{workbench?.name || 'New Workbench'} • {workbench?.industry || 'Standard'}</span>
          </div>
          <h1>{step === 1 ? 'Select Setup Method' : 'Build your Business Model'}</h1>
          <p className="subtitle">
            {step === 1 
              ? 'Choose how you want to start building your Chart of Accounts.' 
              : 'Select the accounts you want to track. Uncheck those that aren\'t relevant.'}
          </p>
        </header>

        {step === 1 && (
          <div className="methods-grid">
            {methods.map((method) => (
              <div 
                key={method.id} 
                className="method-card"
                onClick={() => handleSelectMethod(method.id)}
              >
                <div className="method-icon-wrapper">{method.icon}</div>
                <div className="method-info">
                  <h3>{method.title}</h3>
                  <p>{method.description}</p>
                </div>
                <ChevronRight size={20} />
              </div>
            ))}
          </div>
        )}

        {step === 3 && coaTree && (
          <div className="workspace-view animate-fade-in">
            <aside className="workspace-sidebar">
              <div className="sidebar-header">
                <Database size={16} />
                <span>Pillars</span>
              </div>
              <div className="pillar-nav">
                {Object.entries(coaTree).map(([key, pillar]) => (
                  <button 
                    key={key} 
                    className={`pillar-nav-item ${activePillar === key ? 'active' : ''}`}
                    onClick={() => setActivePillar(key)}
                  >
                    <div className="icon-badge">
                      {getPillarIcon(key, 18)}
                    </div>
                    <span className="label">{pillar.name}</span>
                    <span className="count-dot">
                      {getPillarCount(pillar)}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <main className="workspace-main">
              <div className="workspace-toolbar">
                <div className="active-info">
                  <div className={`pillar-indicator ${activePillar}`}>
                    {getPillarIcon(activePillar, 14)}
                  </div>
                  <h3>{coaTree[activePillar].name}</h3>
                </div>
                <div className="search-wrap">
                  <Search size={14} />
                  <input 
                    type="text" 
                    placeholder={`Filter ${coaTree[activePillar].name}...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="workspace-content">
                {Object.entries(coaTree[activePillar].subcategories).map(([subKey, sub]) => {
                  const filteredAccounts = sub.accounts.filter(acc => 
                    acc.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  
                  if (searchQuery && filteredAccounts.length === 0) return null;

                  return (
                    <div key={subKey} className="subcategory-group">
                      <div className="subcat-header">
                        <h4>{sub.name}</h4>
                        <button className="add-btn-minimal" onClick={() => addCustomAccount(activePillar, subKey)}>
                          <Plus size={12} /> Add Ledger
                        </button>
                      </div>
                      <div className="accounts-grid">
                        {filteredAccounts.map((acc, i) => (
                          <div 
                            key={i} 
                            className={`modern-account-card ${acc.selected ? 'selected' : ''}`}
                            onClick={() => toggleAccount(activePillar, subKey, acc.name)}
                          >
                            <div className="card-top">
                              <div className="checkbox-circle">
                                {acc.selected && <Plus size={10} className="check-icon" />}
                              </div>
                            </div>
                            <div className="card-info">
                              <span className="name">{acc.name}</span>
                              <span className="meta">{acc.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>

            <aside className="workspace-summary">
              <div className="summary-header">
                <h3>Summary</h3>
                <span className="badge-count">{getSelectedAccounts().length} Accounts</span>
              </div>
              <div className="summary-list">
                {getSelectedAccounts().length === 0 ? (
                  <div className="empty-summary">
                    <Database size={32} />
                    <p>No accounts selected yet</p>
                  </div>
                ) : (
                  getSelectedAccounts().map((acc, i) => (
                    <div key={i} className="summary-item animate-in">
                      <div className="item-dot"></div>
                      <div className="item-info">
                        <span className="name">{acc.name}</span>
                        <span className="type">{acc.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="workspace-footer">
                <button className="back-btn-ghost" onClick={() => setStep(1)}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button 
                  className="final-button-premium" 
                  onClick={handleFinalize}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="spinning" size={16} /> : (
                    <>
                      <span>Finalize Model</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </aside>
          </div>
        )}

        {showInviteModal && (
          <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
            <div className="invite-modal animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Invite Your Advisor</h2>
                <button className="close-btn" onClick={() => setShowInviteModal(false)}><X size={20} /></button>
              </div>
              <form className="invite-form" onSubmit={handleSendInvite}>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" required placeholder="accountant@company.com" value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Assign Role</label>
                  <select value={inviteData.role} onChange={e => setInviteData({...inviteData, role: e.target.value})}>
                    <option value="Accountant">Accountant</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Investor">Investor</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="final-button-premium" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="spinning" size={18} /> : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isProcessing && step === 1 && (
          <div className="processing-overlay">
            <Loader2 className="spinning" size={48} />
            <p>Processing...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .coa-setup { height: 100vh; background: radial-gradient(circle at top left, #0a0c10, #030507); display: flex; align-items: center; justify-content: center; color: white; padding: 2rem; overflow: hidden; }
        .coa-container { width: 100%; max-width: 1440px; display: flex; flex-direction: column; gap: 1rem; height: 100%; max-height: 95vh; overflow: hidden; }
        
        .coa-stepper { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 0.5rem; flex-shrink: 0; }
        .step-item { display: flex; align-items: center; gap: 0.5rem; opacity: 0.3; }
        .step-item.active { opacity: 1; }
        .step-bead { width: 20px; height: 20px; border-radius: 50%; border: 1px solid #333; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; }
        .active .step-bead { background: #00ffc2; color: #000; border-color: #00ffc2; }
        .step-item span { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
        .step-line { width: 40px; height: 1px; background: #222; }

        .coa-header { text-align: center; margin-bottom: 1rem; flex-shrink: 0; }
        .coa-header h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
        .subtitle { color: #475569; font-size: 0.875rem; }
        .wb-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(0, 255, 194, 0.05); color: #00ffc2; padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.65rem; font-weight: 800; margin-bottom: 0.5rem; border: 1px solid rgba(0, 255, 194, 0.1); }

        .methods-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1000px; margin: 2rem auto; width: 100%; }
        .method-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1.5rem; padding: 2rem; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .method-card:hover { border-color: #00ffc2; background: rgba(0, 255, 194, 0.02); transform: translateY(-4px); }
        .method-icon-wrapper { width: 48px; height: 48px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #00ffc2; }
        .method-info h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; }
        .method-info p { font-size: 0.813rem; color: #475569; line-height: 1.5; }

        .workspace-view { display: grid; grid-template-columns: 260px 1fr 340px; background: rgba(10, 12, 16, 0.4); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 2rem; overflow: hidden; flex: 1; min-height: 0; }

        .workspace-sidebar { background: rgba(0, 0, 0, 0.2); border-right: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; height: 100%; min-height: 0; }
        .sidebar-header { padding: 1.5rem; display: flex; align-items: center; gap: 0.75rem; color: #475569; border-bottom: 1px solid rgba(255, 255, 255, 0.05); flex-shrink: 0; }
        .sidebar-header span { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .pillar-nav { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; overflow-y: auto; scrollbar-gutter: stable; }
        .pillar-nav-item { width: 100%; padding: 0.875rem 1rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s; position: relative; flex-shrink: 0; background: transparent; border: none; color: inherit; cursor: pointer; }
        .pillar-nav-item:hover { background: rgba(255, 255, 255, 0.03); }
        .pillar-nav-item.active { background: rgba(0, 255, 194, 0.08); color: #00ffc2; }
        .icon-badge { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); color: #475569; }
        .active .icon-badge { border-color: #00ffc2; color: #00ffc2; }
        .pillar-nav-item .label { font-size: 0.938rem; font-weight: 700; flex: 1; text-align: left; }
        .count-dot { font-size: 0.65rem; font-weight: 800; padding: 2px 8px; background: #1a1e24; border-radius: 10px; color: #475569; }
        .active .count-dot { background: #00ffc2; color: #000; }

        .workspace-main { display: flex; flex-direction: column; background: rgba(255, 255, 255, 0.01); height: 100%; min-height: 0; overflow: hidden; }
        .workspace-toolbar { padding: 1.25rem 2.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.1); flex-shrink: 0; }
        .active-info { display: flex; align-items: center; gap: 1rem; }
        .pillar-indicator { width: 32px; height: 32px; background: #00ffc2; color: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .active-info h3 { font-size: 1.5rem; font-weight: 800; }
        .search-wrap { display: flex; align-items: center; gap: 0.75rem; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.6rem 1.25rem; border-radius: 1rem; width: 280px; }
        .search-wrap input { background: transparent; border: none; color: #fff; outline: none; font-size: 0.875rem; width: 100%; }

        .workspace-content { flex: 1; overflow-y: auto; padding: 2.5rem; display: flex; flex-direction: column; gap: 3rem; min-height: 0; scrollbar-gutter: stable; }
        .subcategory-group { display: flex; flex-direction: column; gap: 1.5rem; }
        .subcat-header { display: flex; justify-content: space-between; align-items: center; border-left: 3px solid #00ffc2; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .subcat-header h4 { font-size: 0.813rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
        .add-btn-minimal { font-size: 0.75rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); cursor: pointer; transition: all 0.2s; }
        .add-btn-minimal:hover { color: #00ffc2; border-color: #00ffc2; background: rgba(0, 255, 194, 0.05); }

        .accounts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .modern-account-card { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 1.25rem; padding: 1.25rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 1rem; min-height: 90px; }
        .modern-account-card:hover { border-color: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
        .modern-account-card.selected { border-color: #00ffc2; background: rgba(0, 255, 194, 0.03); }
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .checkbox-circle { width: 18px; height: 18px; border-radius: 50%; border: 1px solid #333; display: flex; align-items: center; justify-content: center; }
        .selected .checkbox-circle { background: #00ffc2; border-color: #00ffc2; color: #000; }
        .lock-icon { color: #475569; }
        .card-info .name { font-size: 0.875rem; font-weight: 700; color: #fff; display: block; margin-bottom: 2px; }
        .card-info .meta { font-size: 0.65rem; color: #475569; font-weight: 800; text-transform: uppercase; }

        .workspace-summary { background: rgba(0, 0, 0, 0.3); border-left: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; width: 340px; height: 100%; min-height: 0; }
        .summary-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); flex-shrink: 0; }
        .summary-header h3 { font-size: 1rem; font-weight: 800; }
        .badge-count { font-size: 0.7rem; font-weight: 800; background: rgba(0, 255, 194, 0.1); color: #00ffc2; padding: 4px 10px; border-radius: 8px; }
        .summary-list { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; min-height: 0; scrollbar-gutter: stable; }
        .summary-item { padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 0.875rem; display: flex; align-items: center; gap: 1rem; }
        .item-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ffc2; flex-shrink: 0; }
        .summary-item .name { font-size: 0.813rem; font-weight: 700; color: #eee; }
        .summary-item .type { font-size: 0.6rem; color: #475569; font-weight: 800; text-transform: uppercase; display: block; }
        .empty-summary { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.3; gap: 1rem; }

        .workspace-footer { padding: 1.5rem; background: rgba(0, 0, 0, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.05); flex-shrink: 0; display: flex; flex-direction: column; gap: 1rem; }
        .final-button-premium { width: 100%; background: #00ffc2; color: #000; padding: 1.125rem; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; border: none; transition: all 0.2s; }
        .final-button-premium:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 255, 194, 0.3); }
        .back-btn-ghost { background: transparent; border: none; color: #475569; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; font-weight: 700; font-size: 0.813rem; }
        .back-btn-ghost:hover { color: #fff; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .invite-modal { background: #0a0c10; border: 1px solid #333; width: 440px; border-radius: 1.5rem; padding: 2rem; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .close-btn { background: transparent; border: none; color: #475569; cursor: pointer; }
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .input-group label { font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; }
        .input-group input, .input-group select { background: #111; border: 1px solid #222; padding: 1rem; border-radius: 0.75rem; color: #fff; outline: none; }
        .input-group input:focus { border-color: #00ffc2; }

        .processing-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; z-index: 2000; }

        @keyframes spinning { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spinning 1s linear infinite; }
        
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Premium Scrollbars */
        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        *::-webkit-scrollbar-thumb:hover { background: #00ffc2; border: 2px solid transparent; background-clip: content-box; }
      `}</style>
    </div>
  );
};

export default COASetup;
