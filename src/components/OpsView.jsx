import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  LayoutDashboard,
  Wallet,
  Landmark,
  FileBadge,
  Users,
  PieChart,
  RefreshCcw,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  ChevronRight,
  Download,
  Info,
  MoreVertical,
  Plus,
  Zap,
  Activity,
  Send,
  CalendarCheck,
  UserPlus
} from 'lucide-react';

const OpsView = ({ workbench }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const opsData = workbench?.ops || {};

  const subTabs = [
    { id: 'dashboard', label: 'Budgeting', icon: <LayoutDashboard size={18} /> },
    { id: 'ar', label: 'Accounts Receivable', icon: <ArrowDownRight size={18} /> },
    { id: 'ap', label: 'Accounts Payable', icon: <ArrowUpRight size={18} /> },
    { id: 'compliance', label: 'Compliance & Tax', icon: <FileBadge size={18} /> },
    { id: 'entities', label: 'Parties & Entities', icon: <Users size={18} /> },
    { id: 'budgeting', label: 'Strategic Planning', icon: <Target size={18} /> },
  ];

  const renderAR = () => (
    <div className="ar-content">
        <div className="metrics-grid">
            <div className="metric-card dark-glass">
                <span className="m-label">TOTAL RECEIVABLES</span>
                <div className="m-val">₹{opsData.ar?.summary?.totalReceivables?.toLocaleString()}</div>
                <div className="m-sub-hint"><Info size={12} /> ACROSS {opsData.ar?.invoices?.length} CUSTOMERS</div>
            </div>
            <div className="metric-card dark-glass border-red">
                <div className="between">
                    <span className="m-label">OVERDUE AMOUNT</span>
                    <AlertTriangle size={18} className="text-red" />
                </div>
                <div className="m-val text-red">₹{opsData.ar?.summary?.overdueAmount?.toLocaleString()}</div>
                <div className="m-sub-hint text-red"><Clock size={12} /> {((opsData.ar?.summary?.overdueAmount / opsData.ar?.summary?.totalReceivables)*100).toFixed(1)}% OF TOTAL</div>
            </div>
            <div className="metric-card dark-glass">
                <span className="m-label">COLLECTIONS THIS MONTH</span>
                <div className="m-val">₹{opsData.ar?.summary?.collectionsMonth?.toLocaleString()}</div>
                <div className="m-sub-hint text-green"><ArrowUpRight size={12} /> +12% VS LAST MONTH</div>
            </div>
            <div className="metric-card dark-glass">
                <div className="between">
                    <span className="m-label">DSO (DAYS SALES OUTSTANDING)</span>
                    <Activity size={18} className="text-primary" />
                </div>
                <div className="m-val">{opsData.ar?.summary?.dso} <span className="m-sub">DAYS</span></div>
                <div className="m-sub-hint"><Target size={12} /> INDUSTRY AVG: 45 DAYS</div>
            </div>
        </div>

        <div className="ops-main-grid">
            <div className="left-column">
                <section className="aging-section dark-glass">
                    <div className="section-head">
                        <h3>AGING ANALYSIS (RECEIVABLES AT RISK)</h3>
                        <div className="collection-ratio">
                            <span className="mini muted">Collection Ratio:</span>
                            <span className="text-primary font-bold ml-2">{opsData.ar?.summary?.collectionRatio}%</span>
                        </div>
                    </div>
                    <div className="aging-chart-v">
                        {opsData.ar?.aging?.map(bucket => (
                            <div key={bucket.label} className="aging-row">
                                <div className="aging-label">{bucket.label}</div>
                                <div className="aging-bar-container">
                                    <div className="aging-bar" style={{ width: `${bucket.percent}%`, backgroundColor: bucket.color }}></div>
                                    <span className="aging-val">₹{(bucket.amount/100000).toFixed(1)}L</span>
                                </div>
                                <div className="aging-pct">{bucket.percent}%</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="invoices-section dark-glass">
                    <div className="between section-head">
                        <h3>PENDING INVOICES</h3>
                        <div className="search-box">
                            <Search size={14} />
                            <input placeholder="Filter by customer.." />
                        </div>
                    </div>
                    <table className="ops-table mini">
                        <thead>
                            <tr>
                                <th>INVOICE #</th>
                                <th>CUSTOMER</th>
                                <th>DUE DATE</th>
                                <th>BALANCE</th>
                                <th>RISK</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opsData.ar?.invoices?.map(inv => (
                                <tr key={inv.id}>
                                    <td className="font-mono mini">{inv.id}</td>
                                    <td className="font-bold">{inv.customer}</td>
                                    <td className="muted">{inv.dueDate}</td>
                                    <td className="font-bold">₹{inv.balance?.toLocaleString()}</td>
                                    <td><span className={`status-pill ${inv.risk.toLowerCase()}`}>{inv.risk}</span></td>
                                    <td>
                                        <button className="action-icon-btn" title="Send Reminder">
                                            <Send size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            <div className="right-column">
                <section className="defaulters-panel dark-glass">
                    <div className="section-head">
                        <h3>TOP AT-RISK ACCOUNTS</h3>
                    </div>
                    <div className="defaulters-list">
                        {opsData.ar?.topDefaulters?.map(d => (
                            <div key={d.name} className="defaulter-card">
                                <div className="between mb-2">
                                    <span className="d-name">{d.name}</span>
                                    <span className="text-red font-bold">₹{(d.overdue/1000).toFixed(0)}k</span>
                                </div>
                                <div className="between mini muted mb-2">
                                    <span>Trend: {d.trend}</span>
                                    <span>Limit: {d.limitUsed}% Used</span>
                                </div>
                                <div className="mini-progress">
                                    <div className="mini-fill red" style={{ width: `${d.limitUsed}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="forecast-panel dark-glass">
                    <div className="section-head">
                        <h3>EXPECTED INFLOW</h3>
                    </div>
                    <div className="inflow-stats">
                        <div className="inflow-item">
                            <div className="dot green"></div>
                            <div className="inflow-info">
                                <span>NEXT 7 DAYS</span>
                                <h5>₹12,45,000</h5>
                            </div>
                        </div>
                        <div className="inflow-item">
                            <div className="dot yellow"></div>
                            <div className="inflow-info">
                                <span>8 - 15 DAYS</span>
                                <h5>₹8,12,000</h5>
                            </div>
                        </div>
                    </div>
                    <button className="full-forecast-btn mt-4">VIEW FULL CASH FORECAST</button>
                </section>
            </div>
        </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="metrics-grid">
        <div className="metric-card dark-glass">
            <span className="m-label">TOTAL BUDGETED</span>
            <div className="m-val">₹{opsData.summary?.totalBudgeted?.toLocaleString()}</div>
        </div>
        <div className="metric-card dark-glass">
            <span className="m-label">ACTUAL SPEND</span>
            <div className="m-val">₹{opsData.summary?.actualSpend?.toLocaleString()}</div>
        </div>
        <div className="metric-card dark-glass">
            <span className="m-label">NET VARIANCE</span>
            <div className="m-val highlight">₹{opsData.summary?.netVariance?.toLocaleString()} <span className="m-sub">OVER</span></div>
        </div>
        <div className="metric-card dark-glass">
            <span className="m-label">EFFICIENCY INDEX</span>
            <div className="m-val">{opsData.summary?.efficiency}%</div>
        </div>
      </div>

      <div className="ops-main-grid">
        <div className="left-column">
          <section className="cost-center-section dark-glass">
            <div className="section-head">
                <h3>COST CENTER ALLOCATION</h3>
                <button className="add-btn"><Plus size={14} /> ADD DEPARTMENT</button>
            </div>
            <div className="cc-grid">
                {opsData.costCenters?.map(cc => (
                    <div key={cc.id} className="cc-card">
                        <div className="cc-icon-box">
                            {cc.id === 'marketing' ? <BarChart3 size={18} /> : cc.id === 'salaries' ? <Users size={18} /> : <Landmark size={18} />}
                            <div className={`status-dot ${cc.spent > 1000000 ? 'red' : 'green'}`}></div>
                        </div>
                        <div className="cc-info">
                            <h4>{cc.name}</h4>
                            <span className="cc-tag">ALLOCATION SPENT</span>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${(cc.spent/cc.allocated)*100}%`, backgroundColor: cc.color }}></div>
                            </div>
                            <div className="cc-stats">
                                <span>₹{cc.spent?.toLocaleString()}</span>
                                <span className="muted">/ ₹{cc.allocated?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          <section className="variance-section dark-glass">
            <div className="section-head">
                <h3>DEEP VARIANCE ANALYSIS</h3>
                <Info size={16} className="muted" />
            </div>
            <table className="ops-table">
                <thead>
                    <tr>
                        <th>EXPENSE CATEGORY</th>
                        <th>BUDGETED</th>
                        <th>ACTUAL SPEND</th>
                        <th>VARIANCE %</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {opsData.varianceItems?.map(item => (
                        <tr key={item.id}>
                            <td>{item.category}</td>
                            <td>₹{item.budgeted?.toLocaleString()}</td>
                            <td>₹{item.actual?.toLocaleString()}</td>
                            <td className={item.variance > 0 ? 'text-red' : 'text-green'}>{item.variance > 0 ? `+${item.variance}%` : `${item.variance}%`}</td>
                            <td><span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </section>
        </div>

        <div className="right-column">
            <section className="re-forecast dark-glass">
                <div className="section-head">
                    <h3><RefreshCcw size={16} /> QUICK RE-FORECASTING</h3>
                </div>
                <div className="rf-body">
                    <div className="between">
                        <span className="rf-label">MONTHLY BUFFER %</span>
                        <span className="rf-val">15%</span>
                    </div>
                    <input type="range" className="rf-slider" min="0" max="30" defaultValue="15" />
                    <div className="between muted mini">
                        <span>0%</span>
                        <span>Safety Margin: 15%</span>
                        <span>30%</span>
                    </div>
                    <div className="rf-info-box">
                        <p>"Adjusting the buffer will automatically update the Revised budget version across all departments."</p>
                    </div>
                    <button className="publish-btn">PUBLISH NEW REVISED VERSION</button>
                </div>
            </section>

            <section className="burn-insights dark-glass">
                <div className="section-head">
                    <h3><BarChart3 size={16} /> BURN INSIGHTS</h3>
                </div>
                <div className="burn-body">
                    <div className="between">
                        <span className="burn-label">Fixed vs Variable</span>
                        <span className="burn-val">65% / 35%</span>
                    </div>
                    <div className="burn-chart">
                        <div className="burn-fill fixed" style={{ width: '65%' }}></div>
                        <div className="burn-fill variable" style={{ width: '35%' }}></div>
                    </div>
                    <p className="burn-note">Your variable burn (Marketing) is 12% higher than the Original Budget this month.</p>
                </div>
            </section>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="compliance-content">
        <div className="metrics-grid">
            <div className="metric-card dark-glass">
                <div className="between">
                    <span className="m-label">GST PAYABLE (NET)</span>
                    <ShieldCheck size={20} className="muted" />
                </div>
                <div className="m-val">₹{opsData.compliance?.gstPayable?.toLocaleString()}</div>
                <div className="m-sub-hint"><RefreshCcw size={12} /> AFTER INPUT TAX CREDIT</div>
            </div>
            <div className="metric-card dark-glass">
                <div className="between">
                    <span className="m-label">TDS LIABILITY</span>
                    <Clock size={20} className="m-icon yellow" />
                </div>
                <div className="m-val">₹{opsData.compliance?.tdsLiability?.toLocaleString()}</div>
                <div className="m-sub-hint yellow"><AlertTriangle size={12} /> DUE ON 07 APR</div>
            </div>
            <div className="metric-card dark-glass">
                <div className="between">
                    <span className="m-label">DRAFT RETURNS</span>
                    <PieChart size={20} className="text-primary" />
                </div>
                <div className="m-val">{opsData.compliance?.draftReturns} <span className="m-sub">PENDING REVIEW</span></div>
                <div className="m-sub-hint"><ArrowUpRight size={12} /> LAST SYNC: 10M AGO</div>
            </div>
        </div>

        <div className="ops-main-grid">
            <div className="left-column">
                <section className="calendar-section dark-glass">
                    <div className="section-tabs">
                        <button className="active">COMPLIANCE CALENDAR</button>
                        <button>FILING HISTORY</button>
                    </div>
                    <div className="calendar-grid">
                        {opsData.compliance?.calendar?.map(item => (
                            <div key={item.id} className="calendar-card">
                                <div className="between">
                                    <span className={`tag ${item.status.toLowerCase()}`}>{item.status}</span>
                                    <span className="type-tag">{item.type}</span>
                                </div>
                                <h4>{item.title}</h4>
                                <p>{item.date}</p>
                                <div className="card-foot">
                                    <span>{item.daysLeft} DAYS TO PREPARE</span>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <div className="right-column">
                <section className="vault-sidebar dark-glass">
                    <div className="between section-head">
                        <h3>DOCUMENT VAULT</h3>
                        <span className="text-primary mini">TAX READINESS</span>
                    </div>
                    <div className="vault-list">
                        {opsData.compliance?.vault?.map(doc => (
                            <div key={doc.id} className="vault-item">
                                <FileText size={20} className="muted" />
                                <div className="v-info">
                                    <h5>{doc.name}</h5>
                                    <span>{doc.size} • {doc.date}</span>
                                </div>
                                <span className="type-badge">{doc.type}</span>
                            </div>
                        ))}
                    </div>
                    <div className="role-security">
                        <ShieldCheck size={16} className="text-primary" />
                        <div>
                            <h6>ROLE ACCESS ACTIVE</h6>
                            <p>"Your CA has exclusive access to the Vault for audit preparation. Shared visibility is enabled for internal admins."</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );

  const renderEntities = () => (
    <div className="entities-content dark-glass">
        <div className="between section-head">
            <div className="head-text">
                <h3>Parties & Entities</h3>
                <p>360° MANAGEMENT OF CUSTOMERS & VENDORS</p>
            </div>
            <div className="head-actions">
                <div className="search-box">
                    <Search size={16} />
                    <input placeholder="Search by name or GST.." />
                </div>
                <div className="filter-pills">
                    <button className="active">ALL</button>
                    <button>CUSTOMER</button>
                    <button>VENDOR</button>
                </div>
            </div>
        </div>
        <table className="ops-table entities">
            <thead>
                <tr>
                    <th>ENTITY NAME</th>
                    <th>TYPE</th>
                    <th>TAX IDENTIFIERS</th>
                    <th>STATUS</th>
                    <th className="text-right">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {opsData.entities?.map(entity => (
                    <tr key={entity.id}>
                        <td className="entity-cell">
                            <div className={`avatar-box ${entity.type.toLowerCase()}`}>
                                {entity.type === 'CUSTOMER' ? <LayoutDashboard size={18} /> : <Landmark size={18} />}
                            </div>
                            <div>
                                <h4>{entity.name}</h4>
                                <span>ONBOARDED {entity.onboarding}</span>
                            </div>
                        </td>
                        <td><span className={`type-shield ${entity.type.toLowerCase()}`}>{entity.type}</span></td>
                        <td className="muted">{entity.identifiers}</td>
                        <td>
                            <div className="status-indicator">
                                <div className="dot"></div>
                                {entity.status}
                            </div>
                        </td>
                        <td className="text-right"><ChevronRight size={18} className="muted" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderAP = () => (
    <div className="ap-content">
        <div className="metrics-grid">
            <div className="metric-card dark-glass">
                <span className="m-label">TOTAL PAYABLES</span>
                <div className="m-val">₹{opsData.ap?.totalPayables?.toLocaleString()}</div>
                <div className="m-sub-hint"><Info size={12} /> ACROSS {opsData.ap?.vendorsCount} VENDORS</div>
            </div>
            <div className="metric-card dark-glass border-red">
                <div className="between">
                    <span className="m-label">OVERDUE BILLS</span>
                    <AlertTriangle size={18} className="text-red" />
                </div>
                <div className="m-val text-red">₹{opsData.ap?.overdue?.toLocaleString()}</div>
                <div className="m-sub-hint text-red"><Clock size={12} /> ACTION REQUIRED IMMEDIATELY</div>
            </div>
            <div className="metric-card dark-glass">
                <span className="m-label">DUE IN 7 DAYS</span>
                <div className="m-val highlight-yellow">₹{opsData.ap?.dueShort?.toLocaleString()}</div>
                <div className="m-sub-hint"><CalendarCheck size={12} /> {opsData.ap?.bills?.filter(b => b.urgency === 'SOON').length} PRIORITY PAYMENTS</div>
            </div>
            <div className="metric-card dark-glass">
                <span className="m-label">EXPENSE PLANNING (30D)</span>
                <div className="m-val">₹{opsData.ap?.planning?.due30?.toLocaleString()}</div>
                <div className="m-sub-hint"><Target size={12} /> WITHIN ALLOCATED BUDGET</div>
            </div>
        </div>

        <div className="planning-timeline dark-glass mb-4">
            <div className="section-head">
                <h3>EXPENSE PLANNING & FORECAST (PAYABLE CLUSTERS)</h3>
            </div>
            <div className="timeline-clusters">
                <div className="cluster-item">
                    <span className="c-label">7 DAY PLAN</span>
                    <div className="c-bar-wrap">
                        <div className="c-fill green" style={{ width: '35%' }}></div>
                    </div>
                    <span className="c-val">₹{opsData.ap?.planning?.due7?.toLocaleString()}</span>
                </div>
                <div className="cluster-item">
                    <span className="c-label">15 DAY PLAN</span>
                    <div className="c-bar-wrap">
                        <div className="c-fill yellow" style={{ width: '65%' }}></div>
                    </div>
                    <span className="c-val">₹{opsData.ap?.planning?.due15?.toLocaleString()}</span>
                </div>
                <div className="cluster-item">
                    <span className="c-label">30 DAY PLAN</span>
                    <div className="c-bar-wrap">
                        <div className="c-fill primary" style={{ width: '90%' }}></div>
                    </div>
                    <span className="c-val">₹{opsData.ap?.planning?.due30?.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div className="ops-main-grid">
            <div className="left-column">
                <section className="bills-section dark-glass">
                    <div className="between section-head">
                        <h3>ACCOUNTS PAYABLE COMMAND</h3>
                        <div className="search-box">
                            <Search size={14} />
                            <input placeholder="Search bills or vendors.." />
                        </div>
                    </div>
                    <table className="ops-table mini">
                        <thead>
                            <tr>
                                <th>BILL #</th>
                                <th>VENDOR</th>
                                <th>DUE DATE</th>
                                <th>AMOUNT</th>
                                <th>DELEGATED TO</th>
                                <th>URGENCY</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opsData.ap?.bills?.map(bill => (
                                <tr key={bill.id}>
                                    <td className="muted font-mono">{bill.id}</td>
                                    <td className="font-bold">{bill.vendor}</td>
                                    <td>{bill.dueDate}</td>
                                    <td className="font-bold">₹{bill.amount?.toLocaleString()}</td>
                                    <td>
                                        <div className="delegation-pill">
                                            <span className="mini">{bill.delegatedTo}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${bill.urgency.toLowerCase()}`}>
                                            {bill.urgency}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-icon-btn pay" title="Pay Now">
                                            <Landmark size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
            <div className="right-column">
                <section className="vendor-closure-panel dark-glass">
                    <div className="section-head">
                        <h3>VENDOR CLOSURE TRACKING</h3>
                    </div>
                    <div className="vendor-list">
                        {opsData.ap?.vendors?.map(v => (
                            <div key={v.name} className="v-card-mini">
                                <div className="between mb-2">
                                    <span className="v-name">{v.name}</span>
                                    <span className={v.risk === 'HIGH' ? 'text-red font-bold' : 'muted font-bold'}>₹{v.balance?.toLocaleString()}</span>
                                </div>
                                <div className="between mini muted mb-2">
                                    <span>Status: {v.status.replace('_', ' ')}</span>
                                    <span className={`risk-tag ${v.risk.toLowerCase()}`}>{v.risk} RISK</span>
                                </div>
                                <div className="mini-progress">
                                    <div className={`mini-fill ${v.risk === 'HIGH' ? 'red' : 'primary'}`} style={{ width: v.risk === 'HIGH' ? '85%' : '30%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ap-actions dark-glass mt-4">
                    <button className="full-action-btn primary mb-2">
                        <Plus size={16} /> ADD NEW BILL
                    </button>
                    <button className="full-action-btn border">
                        <UserPlus size={16} /> DELEGATE BULK PAYMENTS
                    </button>
                </section>
            </div>
        </div>
    </div>
  );

  return (
    <div className="ops-view">
      <header className="ops-header">
        <div className="header-info">
            <div className="header-top-row">
                <div className="back-btn"><ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /></div>
                <div className="title-area">
                    <h1>{workbench.name}</h1>
                    <span>FINANCIAL WORKBENCH</span>
                </div>
            </div>
        </div>
        <div className="header-action-row">
            <div className="search-global">
                <Search size={16} />
                <input placeholder="Search transactions.." />
            </div>
            <div className="header-btns">
                <button className="gen-btn"><Zap size={16} /> Generate Report</button>
                <button className="mini-btn"><Landmark size={16} /></button>
            </div>
        </div>
      </header>

      <div className="ops-navigation">
        {subTabs.map(tab => (
          <button 
            key={tab.id}
            className={`ops-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <main className="ops-container">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'ar' && renderAR()}
        {activeTab === 'compliance' && renderCompliance()}
        {activeTab === 'entities' && renderEntities()}
        {activeTab === 'ap' && renderAP()}
        
        {activeTab === 'budgeting' ? (
          <div className="placeholder-full dark-glass">
            <Clock size={48} className="muted" />
            <h3>Module Integration Pending</h3>
            <p>The {activeTab.toUpperCase()} dashboard is being synced with your Chart of Accounts.</p>
          </div>
        ) : null}
      </main>

      <style jsx="true">{`
        .ops-view {
          padding: 1.5rem 2.5rem;
          height: 100%;
          overflow-y: auto;
          background-color: #0c0d0e;
          color: #ffffff;
        }

        .ops-header {
          margin-bottom: 2rem;
        }

        .header-top-row {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .back-btn {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            cursor: pointer;
        }

        .title-area h1 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
            line-height:1;
        }

        .title-area span {
            font-size: 0.65rem;
            font-weight: 700;
            color: rgba(255,255,255,0.3);
            letter-spacing: 0.1em;
        }

        .header-action-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .search-global {
            position: relative;
            display: flex;
            align-items: center;
            width: 300px;
        }

        .search-global svg {
            position: absolute;
            left: 0.75rem;
            color: rgba(255,255,255,0.3);
        }

        .search-global input {
            width: 100%;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 0.6rem 1rem 0.6rem 2.5rem;
            border-radius: 8px;
            font-size: 0.85rem;
            color: #ffffff;
        }

        .header-btns {
            display: flex;
            gap: 0.75rem;
        }

        .doc-btn, .gen-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
        }

        .doc-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #10b981;
        }

        .gen-btn {
            background: #00faac;
            color: #000000;
        }

        .mini-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: rgba(255,255,255,0.5);
        }

        /* Sub Navigation */
        .ops-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background-color: rgba(255,255,255,0.03);
          padding: 0.4rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .ops-tab {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          transition: all 0.2s;
        }

        .ops-tab.active {
          background-color: #2a2c2e;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* Metrics Grid */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .metric-card {
            background: #141617;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 1.5rem;
        }

        .m-label {
            font-size: 0.6rem;
            font-weight: 700;
            color: rgba(255,255,255,0.4);
            letter-spacing: 0.1em;
            display: block;
            margin-bottom: 0.75rem;
        }

        .m-val {
            font-size: 1.5rem;
            font-weight: 800;
        }

        .m-sub { font-size: 0.65rem; color: rgba(255,255,255,0.3); }
        .highlight { color: #fe6b6b; }
        .m-sub-hint { font-size: 0.75rem; color: rgba(255,255,255,0.3); margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; }

        /* Columns Layer */
        .ops-main-grid {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 1.5rem;
        }

        .dark-glass {
            background: #141617;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 1.5rem;
        }

        .section-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .section-head h3 {
            font-size: 0.85rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 0.05em;
        }

        .add-btn {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: #00faac;
            font-size: 0.7rem;
            font-weight: 800;
        }

        /* Cost Center Allocation */
        .cc-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .cc-card {
            padding: 1rem;
            background: #1b1d1e;
            border-radius: 12px;
            display: flex;
            gap: 1rem;
        }

        .cc-icon-box {
            width: 44px;
            height: 44px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            color: rgba(255,255,255,0.5);
        }

        .status-dot {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 2px solid #1b1d1e;
        }
        .status-dot.green { background: #00faac; }
        .status-dot.red { background: #fe6b6b; }

        .cc-info h4 {
            font-size: 0.9rem;
            font-weight: 700;
            margin-bottom: 0.2rem;
        }

        .cc-tag { font-size: 0.55rem; font-weight: 700; color: rgba(255,255,255,0.4); display: block; margin-bottom: 1rem; }

        .progress-container {
            height: 4px;
            background: rgba(255,255,255,0.05);
            border-radius: 2px;
            margin-bottom: 0.75rem;
        }

        .progress-bar { height: 100%; border-radius: 2px; }

        .cc-stats { font-size: 0.75rem; font-weight: 700; }
        .muted { color: rgba(255,255,255,0.3); }
        .mini { font-size: 0.7rem; }

        /* Tables */
        .ops-table {
            width: 100%;
            border-collapse: collapse;
        }

        .ops-table th {
            text-align: left;
            padding: 0.75rem 1rem;
            font-size: 0.65rem;
            font-weight: 700;
            color: rgba(255,255,255,0.4);
            letter-spacing: 0.05em;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .ops-table td {
            padding: 1rem;
            font-size: 0.85rem;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .status-pill {
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-size: 0.6rem;
            font-weight: 800;
        }

        .status-pill.balanced { background: rgba(0,250,172,0.1); color: #00faac; }
        .status-pill.critical { background: rgba(254,107,107,0.1); color: #fe6b6b; }
        .status-pill.manual { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.1); }

        .text-red { color: #fe6b6b; }
        .text-green { color: #00faac; }

        /* Right Sidebar Cards */
        .re-forecast { margin-bottom: 1.5rem; }
        .rf-label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); }
        .rf-val { font-size: 0.9rem; font-weight: 800; }

        .rf-slider {
            width: 100%;
            margin: 1.5rem 0 0.5rem 0;
            accent-color: #00faac;
        }

        .rf-info-box {
            background: rgba(0,250,172,0.05);
            border: 1px solid rgba(0,250,172,0.1);
            border-radius: 8px;
            padding: 0.75rem;
            margin: 1.5rem 0;
            color: #00faac;
            font-size: 0.75rem;
            font-style: italic;
            line-height: 1.5;
        }

        .publish-btn {
            width: 100%;
            background: #ffffff;
            color: #000000;
            padding: 0.75rem;
            border-radius: 8px;
            font-weight: 800;
            font-size: 0.75rem;
        }

        .burn-chart {
            height: 8px;
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
            display: flex;
            margin: 1rem 0;
            overflow: hidden;
        }

        .burn-fill.fixed { background: #6b7ffe; }
        .burn-fill.variable { background: #feae6b; }
        .burn-note { font-size: 0.65rem; color: rgba(255,255,255,0.3); }

        /* AR Module Styles */
        .ar-content .metrics-grid { margin-bottom: 1.5rem; }
        .border-red { border: 1px solid rgba(254,107,107,0.2) !important; }
        
        .aging-chart-v { display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; }
        .aging-row { display: flex; align-items: center; gap: 1rem; }
        .aging-label { width: 80px; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); }
        .aging-bar-container { flex: 1; height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; position: relative; display: flex; align-items: center; }
        .aging-bar { height: 100%; border-radius: 6px; }
        .aging-val { position: absolute; right: -50px; font-size: 0.7rem; font-weight: 800; }
        .aging-pct { width: 40px; text-align: right; font-size: 0.75rem; color: #00faac; font-weight: 700; margin-left: 3rem; }

        .action-icon-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(0,250,172,0.1); color: #00faac; border-radius: 6px; transition: all 0.2s; }
        .action-icon-btn:hover { background: #00faac; color: #000000; }

        .defaulters-list { display: flex; flex-direction: column; gap: 1rem; }
        .defaulter-card { background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .d-name { font-size: 0.8rem; font-weight: 700; }
        .mini-progress { height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; }
        .mini-fill { height: 100%; border-radius: 2px; }
        .mini-fill.red { background: #fe6b6b; }
        
        .inflow-stats { display: flex; flex-direction: column; gap: 1rem; }
        .inflow-item { display: flex; align-items: center; gap: 1rem; }
        .inflow-item .dot { width: 8px; height: 8px; border-radius: 50%; }
        .inflow-item .dot.green { background: #00faac; }
        .inflow-item .dot.yellow { background: #f59e0b; }
        .inflow-info span { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }
        .inflow-info h5 { font-size: 0.95rem; margin: 0; }
        .full-forecast-btn { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.6); }

        /* AP Module Styles */
        .highlight-yellow { color: #f59e0b; }
        .timeline-clusters { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; }
        .cluster-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .c-label { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }
        .c-bar-wrap { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
        .c-fill { height: 100%; border-radius: 3px; }
        .c-fill.green { background: #10b981; }
        .c-fill.yellow { background: #f59e0b; }
        .c-fill.primary { background: #00faac; }
        .c-val { font-size: 1rem; font-weight: 800; margin-top: 0.25rem; }

        .delegation-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; display: inline-block; }
        .action-icon-btn.pay { background: rgba(0,250,172,0.1); color: #00faac; }
        .action-icon-btn.pay:hover { background: #00faac; color: #000000; }

        .v-card-mini { background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 0.75rem; }
        .v-name { font-size: 0.8rem; font-weight: 700; }
        .risk-tag { font-size: 0.6rem; padding: 0.2rem 0.4rem; border-radius: 4px; border: 1px solid currentColor; }
        .risk-tag.high { color: #fe6b6b; }
        .risk-tag.medium { color: #f59e0b; }
        .risk-tag.low { color: #10b981; }

        .full-action-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.8rem; border-radius: 12px; font-size: 0.8rem; font-weight: 700; transition: all 0.2s; }
        .full-action-btn.primary { background: #00faac; color: #000000; border: none; }
        .full-action-btn.border { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #ffffff; }
        .full-action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }

        /* Compliance Specifics */
        .calendar-section { padding: 0.5rem; }
        .section-tabs { display: flex; gap: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; padding: 0 1rem; }
        .section-tabs button { padding: 1rem 0; font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.4); position: relative; }
        .section-tabs button.active { color: #ffffff; }
        .section-tabs button.active::after { content:''; position: absolute; bottom:-1px; left:0; width:30px; height:2px; background:#00faac; }

        .calendar-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .calendar-card { background: #1b1d1e; border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.02); }
        .tag { font-size: 0.5rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px; }
        .tag.upcoming { background: rgba(0,250,172,0.1); color: #00faac; }
        .tag.urgent { background: rgba(254,107,107,0.1); color: #fe6b6b; }
        .tag.tracked { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
        .type-tag { font-size: 0.6rem; color: rgba(255,255,255,0.3); font-weight: 700; }
        .calendar-card h4 { margin: 0.75rem 0 0.25rem 0; font-size: 0.95rem; }
        .calendar-card p { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
        .card-foot { display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; color: rgba(255,255,255,0.4); font-weight: 700; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; }

        .vault-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .vault-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .v-info h5 { font-size: 0.8rem; margin: 0; }
        .v-info span { font-size: 0.65rem; color: rgba(255,255,255,0.3); }
        .type-badge { margin-left: auto; font-size: 0.55rem; color: rgba(255,255,255,0.3); font-weight: 800; padding: 0.2rem 0.4rem; background: rgba(255,255,255,0.05); border-radius: 4px; }
        .role-security { background: rgba(0,250,172,0.03); border: 1px solid rgba(0,250,172,0.05); border-radius: 12px; padding: 1.25rem; display: flex; gap: 1rem; }
        .role-security h6 { margin: 0 0 0.25rem 0; font-size: 0.7rem; color: #00faac; font-weight: 800; }
        .role-security p { font-size: 0.65rem; line-height: 1.6; color: rgba(255,255,255,0.4); margin: 0; font-style: italic; }

        /* Entities & Parties */
        .entities-content { padding: 2.5rem; }
        .head-text h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .head-text p { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; }
        .filter-pills { display: flex; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.3rem; border-radius: 8px; }
        .filter-pills button { padding: 0.4rem 0.75rem; font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.3); border-radius: 6px; }
        .filter-pills button.active { background: #2a2c2e; color: #ffffff; }

        .entity-cell { display: flex; align-items: center; gap: 1rem; }
        .avatar-box { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); }
        .avatar-box.vendor { color: #feae6b; background: rgba(254,174,107,0.1); }
        .avatar-box.customer { color: #00faac; background: rgba(0,250,172,0.1); }
        .entity-cell h4 { font-size: 0.85rem; margin: 0; }
        .entity-cell span { font-size: 0.6rem; color: rgba(255,255,255,0.3); font-weight: 700; }
        .type-shield { font-size: 0.6rem; font-weight: 800; color: #feae6b; }
        .type-shield.customer { color: #00faac; }
        .status-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 800; }
        .status-indicator .dot { width: 6px; height: 6px; border-radius: 50%; background: #00faac; }

        /* AP / AR Specifics */
        .v-ledger-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px; margin-top: 1rem; }
        .l-avatar { width: 32px; height: 32px; border-radius: 6px; background: rgba(255,255,255,0.05); color: #ffffff; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .l-avatar.grey { background: rgba(255,255,255,0.1); }
        .l-info h5 { font-size: 0.75rem; margin: 0; }
        .l-val { margin-left: auto; font-weight: 800; font-size: 0.85rem; }
        .card-gap { margin-bottom: 1.5rem; }

        .placeholder-full { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 400px; gap: 1rem; }
        .placeholder-full h3 { font-size: 1.5rem; }
      `}</style>
    </div>
  );
};

export default OpsView;
