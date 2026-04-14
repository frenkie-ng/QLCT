import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowLeft, Plus, Trash2, Tag, PieChart, TrendingUp, Wallet, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import JarSettings from '../components/JarSettings';

const CategoryManager = () => {
  const { categories, addCategory, deleteCategory, isLoading } = useFinance();
  const [activeTab, setActiveTab] = useState('income');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#00d1ff');
  const [isAdding, setIsAdding] = useState(false);

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await addCategory(newName, activeTab, newColor);
      setNewName('');
      setIsAdding(false);
    } catch (err) {
      alert('Không thể thêm danh mục: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá danh mục này? Các giao dịch cũ vẫn sẽ giữ tên danh mục này nhưng bạn sẽ không thể chọn nó cho giao dịch mới.')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        alert('Không thể xoá danh mục: ' + err.message);
      }
    }
  };

  if (isLoading) return <div className="loading-screen">Đang tải danh mục...</div>;

  return (
    <div className="category-manager">
      <div className="container">
        <header className="page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Quay lại Dashboard
          </Link>
          <div className="header-content">
            <div className="title-group">
              <Tag size={32} color="var(--accent-cyan)" />
              <div>
                <h1>Quản lý Cấu hình</h1>
                <p className="text-secondary">Tùy chỉnh danh mục và tỷ lệ phân bổ các hũ</p>
              </div>
            </div>
            {activeTab !== 'jars' && (
              <button className="add-btn-primary" onClick={() => setIsAdding(true)}>
                <Plus size={20} /> <span>Thêm danh mục</span>
              </button>
            )}
          </div>
        </header>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            <TrendingUp size={18} /> Thu nhập
          </button>
          <button 
            className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            <Wallet size={18} /> Chi tiêu
          </button>
          <button 
            className={`tab-btn ${activeTab === 'jars' ? 'active' : ''}`}
            onClick={() => setActiveTab('jars')}
          >
            <Settings2 size={18} /> Cấu hình Hũ
          </button>
        </div>

        {activeTab === 'jars' ? (
          <JarSettings />
        ) : (
          <div className="categories-grid">
            {filteredCategories.length === 0 ? (
              <div className="empty-state glass-card">
                <p>Chưa có danh mục nào cho {activeTab === 'income' ? 'Thu nhập' : 'Chi tiêu'}.</p>
                <button className="text-btn" onClick={() => setIsAdding(true)}>Tạo ngay danh mục đầu tiên</button>
              </div>
            ) : (
              filteredCategories.map(category => (
                <div key={category.id} className="category-item glass-card" style={{ borderColor: category.color + '44' }}>
                  <div className="item-main">
                    <div className="color-dot" style={{ backgroundColor: category.color }}></div>
                    <span className="cat-name">{category.name}</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(category.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {isAdding && (
          <div className="modal-overlay" onClick={() => setIsAdding(false)}>
            <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <h2>Thêm danh mục {activeTab === 'income' ? 'Thu nhập' : 'Chi tiêu'}</h2>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label>Tên danh mục</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="VD: Freelance, Ăn uống..." 
                    autoFocus
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Màu sắc đại diện</label>
                  <div className="color-picker">
                    <input 
                      type="color" 
                      value={newColor} 
                      onChange={(e) => setNewColor(e.target.value)} 
                    />
                    <span className="color-code">{newColor.toUpperCase()}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Hủy</button>
                  <button type="submit" className="btn-primary">Lưu danh mục</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .category-manager {
          padding: 2rem;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .category-manager {
            padding: 1rem;
          }
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .page-header {
          margin-bottom: 3rem;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .title-group {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .header-content h1 {
          margin: 0;
          font-size: 2rem;
        }
        @media (max-width: 768px) {
          .header-content h1 {
            font-size: 1.5rem;
          }
          .add-btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
        .add-btn-primary {
          background: var(--accent-cyan);
          color: #000;
          padding: 0.8rem 1.5rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
        }
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
        }
        .tab-btn {
          background: none;
          color: var(--text-secondary);
          padding: 0.6rem 1.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        @media (max-width: 480px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
        .category-item {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-left: 4px solid;
        }
        .item-main {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .cat-name {
          font-weight: 500;
          font-size: 1.1rem;
        }
        .delete-btn {
          background: none;
          color: var(--text-tertiary);
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .delete-btn:hover {
          color: var(--accent-danger);
          background: rgba(255, 255, 255, 0.05);
        }
        .empty-state {
          grid-column: 1 / -1;
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
        }
        .text-btn {
          background: none;
          color: var(--accent-cyan);
          text-decoration: underline;
          margin-top: 1rem;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        .modal-content {
          width: 90%;
          max-width: 400px;
          padding: 2rem;
        }
        .form-group {
          margin-top: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .form-group input[type="text"] {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: #fff;
        }
        .color-picker {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .color-picker input[type="color"] {
          width: 50px;
          height: 40px;
          border: none;
          background: none;
          cursor: pointer;
        }
        .modal-actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        .btn-secondary {
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
        }
        .btn-primary {
          padding: 0.8rem 2rem;
          border-radius: 8px;
          background: var(--accent-cyan);
          color: #000;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CategoryManager;
