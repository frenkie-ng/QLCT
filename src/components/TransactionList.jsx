import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const TransactionList = () => {
  const { transactions, jars } = useFinance();

  const getJarName = (id) => jars.find(j => j.id === id)?.name || 'N/A';
  const getJarColor = (id) => jars.find(j => j.id === id)?.color || 'var(--text-tertiary)';

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <div className="title-group">
          <Clock size={20} className="text-secondary" />
          <h3>Giao dịch gần đây</h3>
        </div>
      </div>

      <div className="transactions">
        {transactions.length === 0 ? (
          <p className="empty-msg">Chưa có giao dịch nào.</p>
        ) : (
          transactions.slice(0, 10).map(t => (
            <div key={t.id} className="transaction-item glass-card">
              <div className="t-icon" style={{ backgroundColor: t.type === 'in' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                {t.type === 'in' ? <ArrowUpRight size={18} color="#000" /> : <ArrowDownLeft size={18} color="#fff" />}
              </div>
              <div className="t-info">
                <span className="t-note">{t.note}</span>
                <span className="t-jar" style={{ color: getJarColor(t.jar_id || t.jarId) }}>
                  {t.type === 'in' ? (
                    <>
                      <span className="cat-tag">{t.category || 'Thu nhập'}</span>
                      <span className="allocation-note">Phân bổ 6 hũ {(t.debt_amount || t.debtAmount) > 0 && <span style={{ color: 'var(--accent-warning)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>(-{(t.debt_amount || t.debtAmount).toLocaleString()}đ nợ)</span>}</span>
                    </>
                  ) : (
                    <>
                      <span className="cat-tag expense">{t.category || 'Chi tiêu'}</span>
                      {getJarName(t.jar_id || t.jarId)}
                    </>
                  )}
                </span>
              </div>
              <div className="t-amount-group">
                <span className={`t-amount ${t.type}`}>
                  {t.type === 'in' ? '+' : '-'}{t.amount.toLocaleString()}đ
                </span>
                <span className="t-date">{new Date(t.date).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .transaction-list-container {
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .list-header {
          margin-bottom: 1.5rem;
        }

        .title-group {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .transactions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 450px;
          overflow-y: auto;
          padding: 1rem;
          margin: -1rem; /* Bù lại padding để không thu hẹp danh sách */
          scrollbar-width: none; /* Firefox */
        }

        .transactions::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }

        .transaction-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .transaction-item {
            padding: 0.8rem 1rem;
            gap: 1rem;
          }
        }

        .t-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .t-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .t-note {
          font-weight: 500;
          font-size: 1rem;
        }

        .t-jar {
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.2rem;
        }

        .cat-tag {
          background: rgba(0, 209, 255, 0.1);
          color: var(--accent-cyan);
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .cat-tag.expense {
          background: rgba(255, 61, 0, 0.1);
          color: var(--accent-danger);
        }

        .allocation-note {
          color: var(--text-tertiary);
          font-weight: 400;
        }

        @media (max-width: 480px) {
          .allocation-note {
            display: none;
          }
        }

        .t-amount-group {
          text-align: right;
        }

        .t-amount {
          display: block;
          font-weight: 700;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .t-amount {
            font-size: 0.95rem;
          }
        }

        .t-amount.in { color: var(--accent-success); }
        .t-amount.out { color: var(--accent-danger); }

        .t-date {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .empty-msg {
          text-align: center;
          padding: 3rem;
          color: var(--text-tertiary);
          border: 1px dashed var(--glass-border);
          border-radius: var(--radius-md);
        }
      `}</style>
    </div>
  );
};

export default TransactionList;
