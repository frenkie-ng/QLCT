import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SetGoalModal = ({ jar, isOpen, onClose, onSave }) => {
  const [target, setTarget] = useState('');

  useEffect(() => {
    if (jar) {
      setTarget(jar.targetAmount > 0 ? jar.targetAmount.toString() : '');
    }
  }, [jar, isOpen]);

  if (!isOpen || !jar) return null;

  const formatNumber = (val) => {
    if (!val) return '';
    return val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numTarget = parseFloat(target.replace(/\D/g, '')) || 0;
    onSave(jar.id, numTarget);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h2>Mục tiêu hũ: {jar.name}</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Thiết lập số tiền bạn muốn đạt được cho hũ này. Hệ thống sẽ tính toán thời gian dự kiến.
          </p>

          <div className="form-group">
            <label>Số tiền mục tiêu (VNĐ)</label>
            <input 
              type="text" 
              value={formatNumber(target)} 
              onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))} 
              placeholder="VD: 100.000.000"
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Lưu mục tiêu</button>
            {jar.targetAmount > 0 && (
              <button 
                type="button" 
                className="clear-btn"
                onClick={() => { onSave(jar.id, 0); onClose(); }}
              >
                Xóa mục tiêu
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          width: 90%;
          max-width: 400px;
          padding: 2rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .close-btn { background: none; color: var(--text-secondary); }
        .form-group { margin-bottom: 2rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); }
        input {
          width: 100%;
          padding: 0.8rem;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          color: #fff;
          font-size: 1.1rem;
        }
        .modal-actions { display: flex; flex-direction: column; gap: 0.8rem; }
        .save-btn {
          background: var(--accent-success);
          color: #000;
          padding: 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .clear-btn {
          background: none;
          color: var(--accent-danger);
          padding: 0.8rem;
          font-weight: 500;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default SetGoalModal;
