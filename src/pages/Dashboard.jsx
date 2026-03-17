import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, PieChart, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';
import TransactionList from '../components/TransactionList';

const Dashboard = () => {
  const { jars, getBalanceSummary } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Xin chào,</h1>
          <p className="text-secondary">Chào mừng bạn quay lại với kế hoạch tài chính của mình.</p>
        </div>
        <div className="total-balance-card glass-card">
          <div className="balance-info">
            <span className="text-secondary">Tổng số dư</span>
            <h2 className="amount">{getBalanceSummary().toLocaleString()} VNĐ</h2>
          </div>
          <div className="balance-icon">
            <Wallet size={32} color="var(--accent-cyan)" />
          </div>
        </div>
      </header>

      <section className="jars-grid">
        {jars.map(jar => (
          <div key={jar.id} className="jar-card glass-card" style={{ '--jar-color': jar.color }}>
            <div className="jar-header">
              <span className="jar-badge" style={{ backgroundColor: jar.color }}>{jar.percentage}%</span>
              <PieChart size={20} className="text-secondary" />
            </div>
            <h3 className="jar-name">{jar.name}</h3>
            <div className="jar-balance">
              <span className="amount">{jar.balance.toLocaleString()}</span>
              <span className="currency">VNĐ</span>
            </div>
            <div className="jar-progress-bg">
              <div className="jar-progress-fill" style={{ width: '100%', backgroundColor: jar.color }}></div>
            </div>
          </div>
        ))}
      </section>

      <section className="quick-actions">
        <button className="action-btn income-btn" onClick={() => openModal('income')}>
          <ArrowUpRight size={20} />
          <span>Thêm Thu nhập</span>
        </button>
        <button className="action-btn expense-btn" onClick={() => openModal('expense')}>
          <ArrowDownLeft size={20} />
          <span>Thêm Chi tiêu</span>
        </button>
      </section>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        type={modalType} 
        onClose={() => setIsModalOpen(false)} 
      />

      <TransactionList />

      <style jsx>{`
        .dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .total-balance-card {
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          min-width: 300px;
        }

        .amount {
          font-size: 1.8rem;
          font-weight: 600;
          display: block;
        }

        .jars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .jar-card {
          padding: 1.5rem;
          transition: transform var(--transition-fast);
        }

        .jar-card:hover {
          transform: translateY(-5px);
          border-color: var(--jar-color);
        }

        .jar-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .jar-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #000;
        }

        .jar-name {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }

        .jar-balance {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }

        .jar-balance .amount {
          font-size: 1.5rem;
        }

        .jar-progress-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
        }

        .jar-progress-fill {
          height: 100%;
          border-radius: 10px;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
        }

        .income-btn {
          background: var(--accent-success);
          color: #000;
        }

        .expense-btn {
          background: var(--accent-danger);
          color: #fff;
        }

        .text-secondary { color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default Dashboard;
