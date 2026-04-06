import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Edit2,
  Trash2,
  RefreshCcw,
  LayoutGrid,
  List,
  Globe,
  ShoppingCart,
  Briefcase
} from 'lucide-react';
import AddInventoryModal from '../components/AddInventoryModal';

const InventoryPage = ({ workbench, inventory = [], onAddItem, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('All');
  const [filterUsage, setFilterUsage] = useState('All');

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((acc, item) => acc + (item.current_stock * item.purchase_rate), 0),
    lowStock: inventory.filter(item => item.current_stock <= item.reorder_point && item.current_stock > 0).length,
    outOfStock: inventory.filter(item => item.current_stock <= 0).length
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || item.type === filterType;
    const matchesUsage = filterUsage === 'All' || item.usage === filterUsage;
    return matchesSearch && matchesFilter && matchesUsage;
  });

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="header-info">
          <h1>Inventory & Stock</h1>
          <p>Track warehouse levels, purchase pricing, and tax compliance</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Items</span>
            <span className="stat-value">{stats.totalItems}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Stock Value</span>
            <span className="stat-value">₹{stats.totalValue.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <Layers size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Low Stock</span>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Out of Stock</span>
            <span className="stat-value">{stats.outOfStock}</span>
          </div>
        </div>
      </div>

      <div className="inventory-toolbar">
        <div className="toolbar-left">
          <div className="filter-segment">
            <button
              className={`segment-btn ${filterType === 'All' ? 'active' : ''}`}
              onClick={() => setFilterType('All')}
            >
              <span>All Items</span>
            </button>
            <button
              className={`segment-btn ${filterType === 'Goods' ? 'active' : ''}`}
              onClick={() => setFilterType('Goods')}
            >
              <Package size={14} />
              <span>Goods</span>
            </button>
            <button
              className={`segment-btn ${filterType === 'Service' ? 'active' : ''}`}
              onClick={() => setFilterType('Service')}
            >
              <Globe size={14} />
              <span>Services</span>
            </button>
          </div>

          <div className="filter-segment">
            <button
              className={`segment-btn ${filterUsage === 'All' ? 'active' : ''}`}
              onClick={() => setFilterUsage('All')}
            >
              <span>All Usage</span>
            </button>
            <button
              className={`segment-btn ${filterUsage === 'Trading' ? 'active' : ''}`}
              onClick={() => setFilterUsage('Trading')}
            >
              <ShoppingCart size={14} />
              <span>Trading</span>
            </button>
            <button
              className={`segment-btn ${filterUsage === 'Internal' ? 'active' : ''}`}
              onClick={() => setFilterUsage('Internal')}
            >
              <Briefcase size={14} />
              <span>Internal</span>
            </button>
          </div>
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
          <button className="refresh-btn">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className={`inventory-display ${viewMode}`}>
        {filteredInventory.length > 0 ? (
          filteredInventory.map(item => (
            <div key={item.id} className="inventory-card">
              <div className="card-header">
                <div className="badges-group">
                  <div className={`badge ${item.type.toLowerCase()}`}>{item.type}</div>
                  <div className={`badge usage ${item.usage?.toLowerCase() || 'trading'}`}>
                    {item.usage === 'Internal' ? 'OFFICE' : 'TRADING'}
                  </div>
                </div>
                <button className="more-btn"><MoreHorizontal size={14} /></button>
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <span className="sku">{item.sku}</span>
              </div>
              <div className="stock-level">
                <div className="level-bar-bg">
                  <div
                    className={`level-bar ${item.current_stock <= item.reorder_point ? 'low' : ''}`}
                    style={{ width: `${Math.min((item.current_stock / (item.reorder_point * 2)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="stock-tags">
                  <span className="count">{item.current_stock} {item.unit}</span>
                  <span className={`status ${item.current_stock <= 0 ? 'out' : item.current_stock <= item.reorder_point ? 'low' : 'in'}`}>
                    {item.current_stock <= 0 ? 'Out of Stock' : item.current_stock <= item.reorder_point ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <div className="price">₹{item.sales_rate.toLocaleString()} <small>/ {item.unit}</small></div>
                <button className="action-link">Manage <ChevronRight size={14} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-inventory">
            <div className="empty-icon">
              <Package size={48} />
            </div>
            <h3>No Items Found</h3>
            <p>Start tracking your stock by adding your first product or service.</p>
            <button className="add-btn-large" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Add New Item
            </button>
          </div>
        )}
      </div>

      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(data) => {
          onAddItem(data);
          setIsModalOpen(false);
        }}
      />

      <style jsx>{`
        .inventory-page {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #8b949e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-info p {
          color: #8b949e;
          font-size: 0.938rem;
          opacity: 0.8;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          color: #484f58;
        }

        .search-box input {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          width: 320px;
          color: #fff;
          transition: all 0.2s;
        }

        .search-box input:focus {
          border-color: #00ffc2;
          width: 400px;
          background: #161b22;
        }

        .add-btn {
          background: #00ffc2;
          color: #05070a;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 255, 194, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 1.25rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.2s;
        }

        .stat-card:hover { transform: translateY(-3px); border-color: #484f58; }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue { background: rgba(56, 139, 253, 0.1); color: #58a6ff; }
        .stat-icon.green { background: rgba(35, 134, 54, 0.1); color: #3fb950; }
        .stat-icon.yellow { background: rgba(210, 153, 34, 0.1); color: #d29922; }
        .stat-icon.red { background: rgba(248, 81, 73, 0.1); color: #f85149; }

        .stat-label { font-size: 0.813rem; color: #8b949e; display: block; margin-bottom: 0.25rem; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: #fff; }

        .inventory-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          border-bottom: 2px solid #161b22;
        }

        .toolbar-left {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .filter-segment {
          display: flex;
          background: #161b22;
          padding: 3px;
          border-radius: 12px;
          border: 1px solid #30363d;
        }

        .segment-btn {
          padding: 0.5rem 1rem;
          font-size: 0.813rem;
          font-weight: 700;
          color: #8b949e;
          border-radius: 10px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid transparent;
        }

        .segment-btn:hover { color: #fff; }

        .segment-btn.active { 
          background: #0d1117; 
          color: #00ffc2; 
          border-color: rgba(0, 255, 194, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .toolbar-right { display: flex; gap: 1rem; align-items: center; }

        .view-toggle {
          display: flex;
          background: #0d1117;
          border: 1px solid #30363d;
          padding: 3px;
          border-radius: 8px;
        }

        .view-btn {
          padding: 0.4rem;
          border-radius: 6px;
          color: #484f58;
          transition: all 0.2s;
        }

        .view-btn.active { background: #161b22; color: #00ffc2; }

        .refresh-btn { color: #8b949e; padding: 0.5rem; transition: color 0.2s; }
        .refresh-btn:hover { color: #fff; }

        .inventory-display.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .inventory-card {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 1.5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .inventory-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: #00ffc2;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .inventory-card:hover { border-color: #00ffc2; transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4); }
        .inventory-card:hover::after { opacity: 1; }

        .card-header { display: flex; justify-content: space-between; align-items: center; }

        .badges-group { display: flex; gap: 0.5rem; }

        .badge {
          font-size: 0.625rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge.goods { background: rgba(0, 255, 194, 0.1); color: #00ffc2; }
        .badge.service { background: rgba(56, 139, 253, 0.1); color: #58a6ff; }
        
        .badge.usage {
          background: rgba(255, 255, 255, 0.05);
          color: #8b949e;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .badge.usage.internal {
          background: rgba(210, 153, 34, 0.1);
          color: #d29922;
          border-color: rgba(210, 153, 34, 0.2);
        }

        .badge.usage.trading {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.2);
        }

        .item-info h3 { font-size: 1.125rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
        .sku { font-size: 0.75rem; font-weight: 600; color: #484f58; font-family: monospace; }

        .stock-level { display: flex; flex-direction: column; gap: 0.75rem; }

        .level-bar-bg { height: 6px; background: #161b22; border-radius: 3px; overflow: hidden; }
        .level-bar { height: 100%; background: #3fb950; border-radius: 3px; transition: width 0.5s; }
        .level-bar.low { background: #d29922; }

        .stock-tags { display: flex; justify-content: space-between; align-items: center; }
        .count { font-size: 0.875rem; font-weight: 700; color: #fff; }

        .status { font-size: 0.75rem; font-weight: 600; }
        .status.in { color: #3fb950; }
        .status.low { color: #d29922; }
        .status.out { color: #f85149; }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1.25rem;
          border-top: 1px solid #161b22;
        }

        .price { font-size: 1.25rem; font-weight: 700; color: #fff; }
        .price small { font-size: 0.75rem; color: #8b949e; font-weight: 400; }

        .action-link { font-size: 0.813rem; font-weight: 600; color: #00ffc2; display: flex; align-items: center; gap: 0.25rem; }

        .empty-inventory {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8rem 0;
          color: #8b949e;
          text-align: center;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          background: #0d1117;
          border: 2px dashed #30363d;
          border-radius: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          color: #161b22;
        }

        .empty-inventory h3 { font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem; }
        .empty-inventory p { margin-bottom: 2rem; max-width: 300px; }

        .add-btn-large {
          background: #161b22;
          border: 1px solid #30363d;
          color: #fff;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }

        .add-btn-large:hover { background: #00ffc2; color: #05070a; border-color: #00ffc2; }
      `}</style>
    </div>
  );
};

export default InventoryPage;
