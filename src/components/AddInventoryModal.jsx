import React, { useState } from 'react';
import {
  X,
  Package,
  Tag,
  BarChart,
  Layers,
  Info,
  DollarSign,
  Box,
  CheckCircle2,
  AlertCircle,
  Wand2
} from 'lucide-react';
import InventoryDecisionTree from './InventoryDecisionTree';

const AddInventoryModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    type: 'Goods',
    category: '',
    hsn_code: '',
    unit: 'Pcs',
    opening_stock: 0,
    reorder_point: 0,
    purchase_rate: 0,
    sales_rate: 0,
    tax_rate: 18,
    usage: 'Trading' // 'Internal' or 'Trading'
  });

  const [errors, setErrors] = useState({});
  const [showDecisionTree, setShowDecisionTree] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Item name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (formData.hsn_code && !/^\d{4,8}$/.test(formData.hsn_code)) {
      newErrors.hsn_code = 'HSN must be 4-8 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAdd({
        ...formData,
        current_stock: parseFloat(formData.opening_stock) || 0,
        opening_stock: parseFloat(formData.opening_stock) || 0,
        reorder_point: parseFloat(formData.reorder_point) || 0,
        purchase_rate: parseFloat(formData.purchase_rate) || 0,
        sales_rate: parseFloat(formData.sales_rate) || 0,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDecisionComplete = (selections) => {
    setFormData(prev => ({
      ...prev,
      type: selections.type,
      usage: selections.usage,
      category: selections.category,
      tax_rate: selections.tax_rate,
      hsn_code: selections.hsn_suggestion
    }));
    setShowDecisionTree(false);
  };

  return (
    <div className="inventory-modal-overlay">
      <div className="inventory-modal dark-glass">
        <header className="modal-header">
          <div className="header-title">
            <div className="icon-box">
              <Package size={20} />
            </div>
            <div>
              <h3>Add New Inventory</h3>
              <p>Configure stock details and tax compliance</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section">
            <h4 className="section-title"><Info size={14} /> Basic Information</h4>
            <div className="grid-row">
              <div className="form-group full">
                <label>Item Name <span className="req">*</span></label>
                <div className="input-wrapper">
                  <Tag className="input-icon" size={16} />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Macbook Pro M3"
                    className={errors.name ? 'error' : ''}
                  />
                </div>
                {errors.name && <span className="error-text"><AlertCircle size={10} /> {errors.name}</span>}
              </div>
            </div>

            <div className="grid-row two-cols">
              <div className="form-group">
                <label>SKU / Barcode <span className="req">*</span></label>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="DBY-ITEM-001"
                  className={errors.sku ? 'error' : ''}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Details for invoices and internal tracking..."
                rows={2}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header-row">
              <h4 className="section-title"><Layers size={14} /> Classification & Tax</h4>
              <button
                type="button"
                className="magic-btn"
                onClick={() => setShowDecisionTree(true)}
              >
                <Wand2 size={12} />
                <span>Magic Categorization</span>
              </button>
            </div>
            <div className="grid-row three-cols">
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Goods">Goods</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div className="form-group">
                <label>Usage / Classification</label>
                <select name="usage" value={formData.usage} onChange={handleChange}>
                  <option value="Internal">Office Supplies & Utilities</option>
                  <option value="Trading">Business Product / Service</option>
                </select>
              </div>
              <div className="form-group">
                <label>HSN Code</label>
                <input
                  name="hsn_code"
                  value={formData.hsn_code}
                  onChange={handleChange}
                  placeholder="84713010"
                  className={errors.hsn_code ? 'error' : ''}
                />
                {errors.hsn_code && <span className="error-text"><AlertCircle size={10} /> {errors.hsn_code}</span>}
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="Pcs">Pcs</option>
                  <option value="Kg">Kg</option>
                  <option value="Ltr">Ltr</option>
                  <option value="Box">Box</option>
                  <option value="Nos">Nos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title"><BarChart size={14} /> Stock & Pricing</h4>
            <div className="grid-row four-cols">
              <div className="form-group">
                <label>Opening Stock</label>
                <input
                  type="number"
                  name="opening_stock"
                  value={formData.opening_stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Reorder Point</label>
                <input
                  type="number"
                  name="reorder_point"
                  value={formData.reorder_point}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Purchase Rate</label>
                <div className="currency-box">₹</div>
                <input
                  type="number"
                  name="purchase_rate"
                  value={formData.purchase_rate}
                  onChange={handleChange}
                  className="with-currency"
                />
              </div>
              <div className="form-group">
                <label>Sales Rate</label>
                <div className="currency-box">₹</div>
                <input
                  type="number"
                  name="sales_rate"
                  value={formData.sales_rate}
                  onChange={handleChange}
                  className="with-currency"
                />
              </div>
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">
              <CheckCircle2 size={16} /> Save Product
            </button>
          </footer>
        </form>

        {showDecisionTree && (
          <InventoryDecisionTree
            onComplete={handleDecisionComplete}
            onCancel={() => setShowDecisionTree(false)}
          />
        )}
      </div>

      <style jsx>{`
        .inventory-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }

        .inventory-modal {
          width: 100%;
          max-width: 700px;
          background: #0d1117;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: modalSlide 0.3s ease-out;
        }

        @keyframes modalSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          padding: 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-box {
          width: 44px;
          height: 44px;
          background: rgba(0, 255, 194, 0.1);
          color: #00ffc2;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 194, 0.2);
        }

        .header-title h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.1rem;
        }

        .header-title p {
          font-size: 0.875rem;
          color: #8b949e;
        }

        .close-btn {
          color: #8b949e;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .modal-body {
          padding: 2rem;
          max-height: 80vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #00ffc2;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .magic-btn {
          background: rgba(0, 255, 194, 0.1);
          color: #00ffc2;
          border: 1px solid rgba(0, 255, 194, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .magic-btn:hover {
          background: #00ffc2;
          color: #05070a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 255, 194, 0.2);
        }

        .grid-row {
          display: grid;
          gap: 1.25rem;
        }

        .grid-row.two-cols { grid-template-columns: 1fr 1fr; }
        .grid-row.three-cols { grid-template-columns: 1fr 1fr 1fr; }
        .grid-row.four-cols { grid-template-columns: 1fr 1fr 1fr 1fr; }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }

        .form-group label {
          font-size: 0.813rem;
          font-weight: 600;
          color: #c9d1d9;
        }

        .req { color: #ff7b72; margin-left: 2px; }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #484f58;
        }

        input, select, textarea {
          width: 100%;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.938rem;
          transition: all 0.2s;
        }

        .input-wrapper input { padding-left: 2.75rem; }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #00ffc2;
          background: #1c2128;
          box-shadow: 0 0 0 3px rgba(0, 255, 194, 0.1);
        }

        input.error { border-color: #ff7b72; }

        .error-text {
          font-size: 0.75rem;
          color: #ff7b72;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .currency-box {
          position: absolute;
          left: 0.75rem;
          bottom: 0.75rem;
          color: #8b949e;
          font-size: 0.9rem;
          pointer-events: none;
          z-index: 1;
        }

        .with-currency { padding-left: 1.75rem; }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.25rem;
          margin-top: 1rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cancel-btn {
          font-weight: 600;
          color: #8b949e;
          transition: color 0.2s;
        }

        .cancel-btn:hover { color: #fff; }

        .submit-btn {
          background: #00ffc2;
          color: #05070a;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 255, 194, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AddInventoryModal;
