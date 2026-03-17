import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

const AddTransactionModal = ({ type, isOpen, onClose }) => {
  const { jars, addIncome, addExpense } = useFinance();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [jarId, setJarId] = useState(jars[0]?.id || 'nec');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return alert('Vui lòng nhập số tiền hợp lệ');

    if (type === 'income') {
      addIncome(numAmount, note);
    } else {
      addExpense(numAmount, jarId, note, 'General');
    }
    
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h2>{type === 'income' ? 'Thêm Thu nhập' : 'Thêm Chi tiêu'}</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số tiền (VNĐ)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="VD: 1000000"
              autoFocus
            />
          </div>

          {type === 'expense' && (
            <div className="form-group">
              <label>Chọn hũ để trừ tiền</label>
              <select value={jarId} onChange={(e) => setJarId(e.target.value)}>
                {jars.map(jar => (
                  <option key={jar.id} value={jar.id}>{jar.name} ({jar.balance.toLocaleString()}đ)</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Ghi chú</label>
            <input 
              type="text" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="VD: Lương tháng 3 / Ăn sáng..."
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className={`submit-btn ${type}`}>Xác nhận</button>
          </div>
        </form>
      </div>

      <style jsx>{`
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
          backdrop-filter: blur(4px);
        }

        .modal-content {
          width: 90%;
          max-width: 450px;
          padding: 2rem;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .close-btn { background: none; color: var(--text-secondary); }

        .form-group { margin-bottom: 1.5rem; }
        
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); }

        input, select {
          width: 100%;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          color: #fff;
          font-size: 1rem;
        }

        input:focus { border-color: var(--accent-cyan); outline: none; }

        .modal-actions { margin-top: 2rem; }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
        }

        .income { background: var(--accent-success); color: #000; }
        .expense { background: var(--accent-danger); color: #fff; }
      `}</style>
    </div>
  );
};

export default AddTransactionModal;
