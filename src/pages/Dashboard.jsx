import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Target, Calendar, User, LogOut, Cloud, CloudOff, Target as TargetIcon, BarChart2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddTransactionModal from '../components/AddTransactionModal';
import SetGoalModal from '../components/SetGoalModal';
import TransactionList from '../components/TransactionList';
import AuthModal from '../components/AuthModal';
import LoadingScreen from '../components/LoadingScreen';
import ReminderBanner from '../components/ReminderBanner';

const Dashboard = () => {
  const { jars, transactions, getBalanceSummary, updateJarGoal, isLoading, syncLocalDataToCloud } = useFinance();
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [goalModalJar, setGoalModalJar] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const calculateETA = (jar) => {
    if (!jar.targetAmount || jar.targetAmount <= jar.balance) return null;

    const incomeTransactions = transactions.filter(t => t.type === 'in');
    if (incomeTransactions.length === 0) return 'Chưa đủ dữ liệu thu nhập';

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.remaining_amount || t.remainingAmount || t.amount), 0);
    const avgMonthlyIncome = totalIncome / Math.max(1, incomeTransactions.length);
    const monthlyJarContribution = (avgMonthlyIncome * jar.percentage) / 100;

    if (monthlyJarContribution <= 0) return 'Tốc độ tích lũy quá thấp';

    const monthsRemaining = (jar.targetAmount - jar.balance) / monthlyJarContribution;
    return Math.ceil(monthsRemaining);
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải dữ liệu tài chính..." />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-profile">
          <div className="avatar-btn" onClick={() => !user && setIsAuthModalOpen(true)}>
            {user ? <img src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} alt="avatar" /> : <User size={24} />}
          </div>
          <div>
            <h1>Xin chào{user ? `, ${user.email.split('@')[0]}` : ''},</h1>
            <p className="text-secondary flex-center gap-1">
              {user ? (
                <>
                  <Cloud size={14} color="var(--accent-success)" />
                  <span>Đã đồng bộ</span>
                  <button onClick={signOut} className="logout-link"><LogOut size={12} /> Đăng xuất</button>
                </>
              ) : (
                <>
                  <CloudOff size={14} color="var(--text-tertiary)" />
                  <span>Dữ liệu cục bộ. <button onClick={() => setIsAuthModalOpen(true)} className="auth-link">Đăng nhập để lưu trữ bảo mật</button></span>
                </>
              )}
            </p>
          </div>
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

      <ReminderBanner />

      <section className="quick-actions-top">
        <Link to="/planner" className="action-btn-compact planner-btn">
          <BarChart2 size={16} />
          <span>Kế hoạch</span>
        </Link>
        <Link to="/categories" className="action-btn-compact settings-btn">
          <Settings size={16} />
          <span>Danh mục</span>
        </Link>
        <button className="action-btn-compact income-btn" onClick={() => openModal('income')}>
          <ArrowUpRight size={16} />
          <span>Thu nhập</span>
        </button>
        <button className="action-btn-compact expense-btn" onClick={() => openModal('expense')}>
          <ArrowDownLeft size={16} />
          <span>Chi tiêu</span>
        </button>
      </section>

      <section className="jars-grid">
        {jars.map(jar => (
          <div key={jar.id} className="jar-card glass-card" style={{ '--jar-color': jar.color }}>
            <div className="jar-header">
              <span className="jar-badge" style={{ backgroundColor: jar.color }}>{jar.percentage}%</span>
              <button
                className="goal-trigger-btn"
                onClick={(e) => { e.stopPropagation(); setGoalModalJar(jar); }}
                title="Thiết lập mục tiêu"
              >
                <Target size={18} color={jar.targetAmount > 0 ? jar.color : 'var(--text-tertiary)'} />
              </button>
            </div>
            <h3 className="jar-name">{jar.name}</h3>
            <div className="jar-balance">
              <span className="amount">{jar.balance.toLocaleString()}</span>
              <span className="currency">VNĐ</span>
            </div>

            {jar.targetAmount > 0 ? (
              <div className="goal-status">
                <div className="goal-info">
                  <span className="goal-label">Mục tiêu: {jar.targetAmount.toLocaleString()}đ</span>
                  <span className="goal-percent">{Math.min(100, Math.round((jar.balance / jar.targetAmount) * 100))}%</span>
                </div>
                <div className="jar-progress-bg">
                  <div
                    className="jar-progress-fill"
                    style={{
                      width: `${Math.min(100, (jar.balance / jar.targetAmount) * 100)}%`,
                      backgroundColor: jar.color
                    }}
                  ></div>
                </div>
                <div className="eta-info">
                  <Calendar size={12} />
                  <span>Dự kiến: {calculateETA(jar)} tháng nữa</span>
                </div>
              </div>
            ) : (
              <div className="jar-progress-bg">
                <div className="jar-progress-fill placeholder" style={{ width: '100%', backgroundColor: jar.color, opacity: 0.2 }}></div>
              </div>
            )}

            <div className="jar-description-overlay">
              <p>{jar.description}</p>
            </div>
          </div>
        ))}
      </section>

      <AddTransactionModal
        isOpen={isModalOpen}
        type={modalType}
        onClose={() => setIsModalOpen(false)}
      />

      <SetGoalModal
        jar={goalModalJar}
        isOpen={!!goalModalJar}
        onClose={() => setGoalModalJar(null)}
        onSave={updateJarGoal}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
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

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .avatar-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.2s;
        }

        .avatar-btn:hover {
          transform: scale(1.05);
          border-color: var(--accent-cyan);
        }

        .avatar-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .flex-center { display: flex; align-items: center; }
        .gap-1 { gap: 0.5rem; }

        .auth-link, .logout-link {
          background: none;
          color: var(--accent-cyan);
          text-decoration: underline;
          padding: 0;
          font-size: 0.85rem;
          margin-left: 0.5rem;
          cursor: pointer;
        }

        .logout-link {
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
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
          position: relative;
          overflow: hidden;
        }

        .jar-card:hover {
          transform: translateY(-5px);
          border-color: var(--jar-color);
        }

        .jar-description-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          opacity: 0;
          transition: opacity var(--transition-normal);
          pointer-events: none;
          z-index: 2;
        }

        .jar-card:hover .jar-description-overlay {
          opacity: 1;
        }

        .jar-description-overlay p {
          font-size: 0.95rem;
          color: white;
          line-height: 1.6;
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
          transition: width 0.5s ease-out;
        }

        .goal-trigger-btn {
          background: none;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .goal-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .goal-status {
          margin-top: -0.5rem;
        }

        .goal-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 0.4rem;
          color: var(--text-tertiary);
        }

        .goal-percent {
          font-weight: 700;
          color: var(--jar-color);
        }

        .eta-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.6rem;
          font-size: 0.75rem;
          color: var(--accent-cyan);
          opacity: 0.8;
        }

        .quick-actions-top {
          display: flex;
          justify-content: flex-end;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .action-btn-compact {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 30px; /* Nhìn như thẻ tag (pill shape) */
          font-weight: 500;
          font-size: 0.9rem;
          transition: transform 0.2s, background 0.2s;
          cursor: pointer;
          border: none;
        }

        .action-btn-compact:hover {
          transform: translateY(-2px);
        }

        .income-btn {
          background: var(--accent-success);
          color: #000;
        }

        .expense-btn {
          background: var(--accent-danger);
          color: #fff;
        }

        .planner-btn {
          background: rgba(255, 255, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none;
        }

        .planner-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .planner-btn {
          background: rgba(255, 255, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none;
        }
        .planner-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .settings-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          text-decoration: none;
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .text-secondary { color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default Dashboard;
