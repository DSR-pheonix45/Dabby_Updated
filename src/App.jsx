import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ActionCards from './components/ActionCards'
import ChatInput from './components/ChatInput'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './components/OnboardingPage'
import WorkbenchesPage from './pages/WorkbenchesPage'
import DashboardPage from './pages/DashboardPage'
import ToolsPage from './pages/ToolsPage'
import COASetup from './components/COASetup'
import COAManagement from './components/COAManagement'
import WorkbenchSettings from './components/WorkbenchSettings'
import DocVault from './components/DocVault'
import OpsView from './components/OpsView'
import InvestorView from './components/InvestorView'
import InventoryPage from './pages/InventoryPage'
import PricingPage from './pages/PricingPage'
import { useAuth } from './context/auth-context'
import { dbService } from './services/dbService'
import { getTemplateByIndustry } from './data/coaData'
import { fetchZohoCOA } from './services/zohoService'
import { ChevronDown, MoreHorizontal } from 'lucide-react'

import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'

function App() {
  const { user, profile, loading, signOut, refreshProfile, loginAsDemo } = useAuth();
  console.log('App Rendering - loading:', loading, 'user:', user);
  const navigate = useNavigate();
  const location = useLocation();

  const initialWorkbench = {
    id: 'innovate-labs-1',
    name: 'Innovate Labs',
    location: 'India',
    currency: 'INR',
    fyStart: 'April',
    lastActive: 'Just now',
    status: 'ACTIVE',
    coa: [],
    coaMethod: 'manual',
    docs: [],
    members: [
      { id: 1, name: 'Medhansh K', email: 'medhansh@example.com', role: 'Owner' }
    ],
    compliance: { pan: 'ABCDE1234F', tan: 'CHEP01234G', gstin: '27ABCDE1234F1Z5', cin: 'L12345MH2023PTC123456' },
    logs: [],
    ops: {
      summary: { totalBudgeted: 2000000, actualSpend: 2025000, netVariance: 25000, efficiency: 99 },
      costCenters: [
        { id: 'marketing', name: 'Marketing', allocated: 2500000, spent: 455000, color: '#10b981' },
        { id: 'salaries', name: 'Salaries', allocated: 21200000, spent: 1250000, color: '#ef4444' },
        { id: 'operations', name: 'Operations', allocated: 2300000, spent: 290000, color: '#10b981' }
      ],
      varianceItems: [
        { id: 1, category: 'Digital Ads', budgeted: 200000, actual: 215000, variance: 8, status: 'BALANCED' },
        { id: 2, category: 'Cloud Infra', budgeted: 80000, actual: 72000, variance: -10, status: 'BALANCED' },
        { id: 3, category: 'Events', budgeted: 150000, actual: 140000, variance: -7, status: 'BALANCED' },
        { id: 4, category: 'SaaS Tools', budgeted: 45000, actual: 2480000, variance: 957, status: 'CRITICAL' }
      ],
      compliance: {
        gstPayable: 142800,
        tdsLiability: 42000,
        calendar: [
          { id: 1, title: 'GST R1 Filing', date: 'Apr 11, 2026', status: 'UPCOMING', type: 'GST', daysLeft: 20 },
          { id: 2, title: 'TDS Payment (March)', date: 'Apr 07, 2026', status: 'URGENT', type: 'TDS', daysLeft: 16 }
        ],
        vault: []
      },
      entities: [],
      ap: {
        totalPayables: 2842000, dueShort: 450000, overdue: 320000, vendorsCount: 12,
        planning: { due7: 450000, due15: 820000, due30: 1250000 },
        bills: [],
        vendors: []
      },
      ar: {
        summary: { totalReceivables: 4235000, overdueAmount: 845000, collectionsMonth: 1250000, dso: 42, collectionRatio: 78 },
        aging: [],
        invoices: [],
        topDefaulters: []
      }
    }
  };

  const [workbenches, setWorkbenches] = useState([initialWorkbench]);
  const [activeWorkbenchId, setActiveWorkbenchId] = useState('innovate-labs-1');
  const [activeCOA, setActiveCOA] = useState([]);
  const [activeInventory, setActiveInventory] = useState([]);
  const [coaSetupWorkbench, setCoaSetupWorkbench] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Accounts for Active Workbench
  useEffect(() => {
    if (activeWorkbenchId && activeWorkbenchId !== 'innovate-labs-1' && user) {
      const loadCOA = async () => {
        try {
          const accounts = await dbService.getWorkbenchCOA(activeWorkbenchId);
          setActiveCOA(accounts);
        } catch (err) {
          console.error('Error loading COA:', err);
        }
      };
      loadCOA();
    } else if (activeWorkbenchId === 'innovate-labs-1') {
      setActiveCOA([]); // Default empty for demo
    }
  }, [activeWorkbenchId, user]);

  // Fetch Inventory for Active Workbench
  useEffect(() => {
    if (activeWorkbenchId && activeWorkbenchId !== 'innovate-labs-1' && user) {
      const loadInventory = async () => {
        try {
          const items = await dbService.getInventory(activeWorkbenchId);
          setActiveInventory(items);
        } catch (err) {
          console.error('Error loading inventory:', err);
        }
      };
      loadInventory();
    } else if (activeWorkbenchId === 'innovate-labs-1') {
      setActiveInventory([
        { id: 'item-1', name: 'Macbook Pro M3', sku: 'DBY-LAP-001', type: 'Goods', current_stock: 12, reorder_point: 5, sales_rate: 185000, purchase_rate: 160000, unit: 'Pcs', hsn_code: '84713010', usage: 'Trading' },
        { id: 'item-2', name: 'Cloud Server (Monthly)', sku: 'DBY-SVR-002', type: 'Service', current_stock: 1, reorder_point: 0, sales_rate: 12000, purchase_rate: 8000, unit: 'Nos', hsn_code: '998311', usage: 'Trading' },
      ]);
    }
  }, [activeWorkbenchId, user]);

  useEffect(() => {
    if (loading) return;

    // Check for Zoho OAuth callback
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state === 'zoho_auth') {
      setTimeout(() => {
        setWorkbenches(prev => prev.map(wb =>
          wb.id === activeWorkbenchId ? { ...wb, zohoConnected: true, lastSynced: 'Just now' } : wb
        ));
        navigate('/workbench-settings');
      }, 3000);
      return;
    }

    if (!user) {
      const publicPaths = ['/', '/auth'];
      if (!publicPaths.includes(location.pathname)) {
        console.log('App: Unauthenticated redirect to /');
        navigate('/');
      }
    } else {
      // Authenticated User
      const isProfileComplete = profile && profile.name;
      console.log('App: User Authenticated - Profile Complete:', isProfileComplete, 'Path:', location.pathname);

      if (user.id === 'demo-user') {
        if (location.pathname === '/' || location.pathname === '/auth') {
          navigate('/dashboard');
        }
        return;
      }

      if (!isProfileComplete) {
        if (location.pathname !== '/onboarding') {
          console.log('App: Incomplete profile, redirecting to /onboarding');
          navigate('/onboarding');
        }
      } else {
        // Profile is complete
        if (location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/onboarding') {
          console.log('App: Profile complete, redirecting to /dashboard');
          navigate('/dashboard');
        }
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);

  // Fetch Workbenches on Load
  useEffect(() => {
    if (user && user.id !== 'demo-user') {
      const loadWorkbenches = async () => {
        try {
          const data = await dbService.getWorkbenches(user.id);
          if (data && data.length > 0) {
            setWorkbenches(data);
            setActiveWorkbenchId(data[0].id);
          }
        } catch (err) {
          console.error('Error loading workbenches:', err);
        }
      };
      loadWorkbenches();
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    refreshProfile();
    navigate('/dashboard');
  };

  const handleCreateWorkbench = async (data) => {
    if (!user || user.id === 'demo-user') {
      alert("Please login with a real account to save workbenches.");
      return;
    }

    setIsModalOpen('loading');

    try {
      // 1. Create Workbench Meta Only
      const newWorkbench = await dbService.createWorkbench({
        owner_id: user.id,
        name: data.name,
        industry: data.industry,
        sector: data.sector,
        business_type: data.business_type,
        location: data.country,
        currency: data.base_currency,
        fy_start: data.fiscal_year_start,
        books_start_date: data.books_start_date,
        coa_mode: data.coa_mode,
        status: 'PENDING_COA'
      });

      // 2. Clear loading and move to COA Setup flow
      setWorkbenches(prev => [newWorkbench, ...prev]);
      setActiveWorkbenchId(newWorkbench.id);
      setIsModalOpen(false);
      setCoaSetupWorkbench(newWorkbench);
      navigate('/coa-setup');

    } catch (err) {
      console.error('Failed to create workbench:', err);
      alert('Error creating workbench: ' + err.message);
      setIsModalOpen(true);
    }
  };

  const handleCOAComplete = (method, coaData) => {
    setWorkbenches(prev => prev.map(wb =>
      wb.id === coaSetupWorkbench.id ? { ...wb, coa: coaData, coaMethod: method } : wb
    ));
    setActiveCOA(coaData);
    setCoaSetupWorkbench(null);
    navigate('/coa-management');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleUpdateWorkbench = (updatedWb) => {
    setWorkbenches(prev => prev.map(wb => wb.id === updatedWb.id ? updatedWb : wb));
  };

  const handleNavigate = (page, params = {}) => {
    const path = page === 'landing' ? '/' : `/${page.replace('_', '-')}`;
    navigate(path);
    if (params.workbenchId) {
      setActiveWorkbenchId(params.workbenchId);
    }
  };

  const handleAddInventoryItem = async (itemData) => {
    if (user && user.id !== 'demo-user') {
      try {
        const newItem = await dbService.createInventoryItem({
          ...itemData,
          workbench_id: activeWorkbenchId
        });
        setActiveInventory(prev => [newItem, ...prev]);
      } catch (err) {
        console.error('Failed to save inventory item:', err);
        alert('Error saving inventory item.');
      }
    } else {
      // Demo mode
      const newItem = { ...itemData, id: 'demo-' + Date.now() };
      setActiveInventory(prev => [newItem, ...prev]);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <style>{`
          .loading-screen { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background-color: #05070a; }
          .spinner { width: 40px; height: 40px; border: 3px solid rgba(0, 255, 194, 0.1); border-top-color: #00ffc2; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const activeWorkbench = workbenches.find(wb => wb.id === activeWorkbenchId) || initialWorkbench;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage onGetStarted={() => navigate('/auth')} onDemoLogin={() => { loginAsDemo(); navigate('/dashboard'); }} />} />
      <Route path="/auth" element={<AuthPage onLogin={() => navigate('/dashboard')} onNavigate={handleNavigate} />} />
      <Route path="/onboarding" element={<OnboardingPage onComplete={handleOnboardingComplete} />} />
      <Route path="/coa-setup" element={<COASetup workbench={coaSetupWorkbench} onComplete={handleCOAComplete} />} />

      {/* Authenticated Layout */}
      <Route path="/*" element={
        <div className="layout">
          <Sidebar
            user={{ ...profile, email: user?.email }}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            currentPage={location.pathname.substring(1).replace('-', '_') || 'dashboard'}
            workbenches={workbenches}
            activeWorkbenchId={activeWorkbenchId}
          />

          <main className="main-content">
            <header className="main-header">
              <div className="header-left">
                <div className="logo-container">
                  <div className="logo-icon">
                    <svg viewBox="0 0 100 80" width="32" height="32">
                      <path d="M50 0C25 0 0 20 0 45C0 70 20 80 50 80C80 80 100 70 100 45C100 20 75 0 50 0Z" fill="#00ffc2" />
                      <ellipse cx="35" cy="45" rx="6" ry="10" fill="#05070a" />
                      <ellipse cx="65" cy="45" rx="6" ry="10" fill="#05070a" />
                    </svg>
                  </div>
                  <h1 className="logo-text">Dabby</h1>
                </div>
              </div>

              <div className="header-right">
                <button className="consultant-btn">
                  <span className="dot"></span>
                  <span>Dabby Consultant</span>
                  <ChevronDown size={14} />
                </button>
                <button className="more-btn">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </header>

            <Routes>
              <Route path="/dashboard" element={<DashboardPage profile={profile} user={user} />} />
              <Route path="/workbenches" element={
                <WorkbenchesPage
                  workbenches={workbenches}
                  onCreateWorkbench={handleCreateWorkbench}
                  onNavigate={handleNavigate}
                />
              } />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/coa-management" element={
                <COAManagement
                  workbench={activeWorkbench}
                  accounts={activeCOA}
                  onUpdateCOA={(newCOA) => setActiveCOA(Array.isArray(newCOA) ? newCOA : activeCOA)}
                  onSetSetupWorkbench={setCoaSetupWorkbench}
                />
              } />
              <Route path="/workbench-settings" element={
                <WorkbenchSettings
                  workbench={activeWorkbench}
                  onUpdateWorkbench={handleUpdateWorkbench}
                />
              } />
              <Route path="/doc-vault" element={<DocVault workbench={activeWorkbench} />} />
              <Route path="/ops" element={<OpsView workbench={activeWorkbench} />} />
              <Route path="/investor-view" element={<InvestorView workbench={activeWorkbench} />} />
              <Route path="/inventory" element={
                <InventoryPage
                  workbench={activeWorkbench}
                  inventory={activeInventory}
                  onAddItem={handleAddInventoryItem}
                  onUpdateStock={(itemId, change) => {
                    // Quick feedback
                    setActiveInventory(prev => prev.map(it =>
                      it.id === itemId ? { ...it, current_stock: it.current_stock + change } : it
                    ));
                    if (user && user.id !== 'demo-user') dbService.updateStock(itemId, change);
                  }}
                />
              } />

              <Route path="/zoho-callback" element={
                <div className="callback-view">
                  <h2>Connecting Zoho...</h2>
                  <div className="spinner"></div>
                  <style>{`
                    .callback-view { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 2rem; }
                  `}</style>
                </div>
              } />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          <style jsx="true">{`
            .layout { display: flex; height: 100%; width: 100%; overflow: hidden; position: fixed; top: 0; left: 0; right: 0; bottom: 0; }
            .main-content { flex: 1; display: flex; flex-direction: column; position: relative; background-color: hsl(var(--background)); overflow: hidden; height: 100%; }
            .main-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2rem; position: relative; z-index: 10; border-bottom: 1px solid hsl(var(--border) / 0.3); background-color: hsl(var(--background) / 0.8); backdrop-filter: blur(8px); flex-shrink: 0; }
            .logo-container { display: flex; align-items: center; gap: 0.875rem; }
            .logo-text { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
            .header-right { display: flex; align-items: center; gap: 1.25rem; }
            .consultant-btn { display: flex; align-items: center; gap: 0.6rem; padding: 0.5rem 1rem; background-color: hsl(var(--card)); border: 1px solid hsl(var(--border) / 0.8); border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600; color: white; transition: all 0.2s ease; }
            .consultant-btn:hover { background-color: hsl(var(--accent)); border-color: hsl(var(--primary) / 0.5); transform: translateY(-1px); }
            .dot { width: 8px; height: 8px; background-color: hsl(var(--primary)); border-radius: 50%; box-shadow: 0 0 10px hsl(var(--primary) / 0.4); }
            .more-btn { display: flex; align-items: center; justify-content: center; padding: 0.6rem; color: hsl(var(--muted-foreground)); transition: all 0.2s ease; border-radius: 0.75rem; }
            .more-btn:hover { color: white; background-color: hsl(var(--accent)); }
          `}</style>
        </div>
      } />
    </Routes>
  )
}

export default App;
