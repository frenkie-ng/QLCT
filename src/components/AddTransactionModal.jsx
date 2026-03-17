import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

const AddTransactionModal = ({ type, isOpen, onClose }) => {
  const { jars, addIncome, addExpense } = useFinance();
  const [amount, setAmount] = useState('');
  const [debt, setDebt] = useState('');
  const [note, setNote] = useState('');
  const [jarId, setJarId] = useState(jars[0]?.id || 'nec');

  if (!isOpen) return null;

  const formatNumber = (val) => {
    if (!val) return '';
    return val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(rawValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Làm sạch chuỗi: chỉ giữ lại các chữ số trước khi chuyển thành số
    const cleanAmount = amount.toString().replace(/\D/g, '');
    const cleanDebt = debt.toString().replace(/\D/g, '');
    
    const numAmount = parseFloat(cleanAmount) || 0;
    const numDebt = parseFloat(cleanDebt) || 0;
    
    if (type === 'income') {
      if (numAmount <= 0 && numDebt <= 0) {
        return alert('Vui lòng nhập Tổng thu nhập hoặc Số tiền nợ cần trừ');
      }
    } else {
      if (numAmount <= 0) return alert('Vui lòng nhập số tiền chi tiêu hợp lệ');
    }

    if (numDebt > numAmount && numAmount > 0) {
      if (!window.confirm('Số tiền nợ lớn hơn thu nhập này, bạn có chắc chắn muốn khấu trừ âm vào các hũ không?')) return;
    }

    if (type === 'income') {
      addIncome(numAmount, numDebt, note);
    } else {
      addExpense(numAmount, jarId, note, 'General');
    }
    
    setAmount('');
    setDebt('');
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
            <label>{type === 'income' ? 'Tổng Thu nhập nhận được (VNĐ)' : 'Số tiền (VNĐ)'}</label>
            <input 
              type="text" 
              value={formatNumber(amount)} 
              onChange={handleAmountChange} 
              placeholder={type === 'income' ? "VD: 10.000.000" : "VD: 500.000"}
              autoFocus
            />
          </div>

          {type === 'income' && (
            <div className="form-group">
              <label>Số tiền trích ra trả nợ (Điện thoại, Gym...) - Nếu có</label>
              <input 
                type="text" 
                value={formatNumber(debt)} 
                onChange={(e) => setDebt(e.target.value.replace(/\D/g, ''))} 
                placeholder="VD: 2.000.000"
                style={{ borderColor: debt > 0 ? 'var(--accent-warning)' : '' }}
              />
              {debt > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-warning)', marginTop: '0.4rem' }}>
                  {amount > 0 
                    ? `Hệ thống sẽ trừ khoản nợ này ra trước, sau đó mới chia số còn lại vào 6 hũ.` 
                    : `Bạn đang trừ nợ độc lập. Số tiền này sẽ được khấu trừ từ tất cả các hũ theo tỷ lệ % tương ứng.`}
                </p>
              )}
            </div>
          )}

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
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          color: #fff;
          font-size: 1rem;
          appearance: none;
        }

        option {
          background: var(--bg-secondary);
          color: #fff;
        }

        input:focus, select:focus { border-color: var(--accent-cyan); outline: none; }

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
