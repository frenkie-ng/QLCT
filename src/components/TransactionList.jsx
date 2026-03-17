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
          transactions.map(t => (
            <div key={t.id} className="transaction-item glass-card">
              <div className="t-icon" style={{ backgroundColor: t.type === 'in' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                {t.type === 'in' ? <ArrowUpRight size={18} color="#000" /> : <ArrowDownLeft size={18} color="#fff" />}
              </div>
              <div className="t-info">
                <span className="t-note">{t.note}</span>
                <span className="t-jar" style={{ color: getJarColor(t.jarId) }}>
                  {t.type === 'in' ? (
                    <>
                      Phân bổ 6 hũ {t.debtAmount > 0 && <span style={{ color: 'var(--accent-warning)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>(-{t.debtAmount.toLocaleString()}đ nợ)</span>}
                    </>
                  ) : getJarName(t.jarId)}
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
        }

        .transaction-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          gap: 1.5rem;
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
        }

        .t-amount-group {
          text-align: right;
        }

        .t-amount {
          display: block;
          font-weight: 700;
          font-size: 1.1rem;
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
