import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Bell, X, AlertCircle } from 'lucide-react';

const ReminderBanner = () => {
  const { hasTransactionToday } = useFinance();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed for today
    const dismissedDate = localStorage.getItem('reminder_dismissed_date');
    const today = new Date().toISOString().split('T')[0];
    
    if (dismissedDate === today) {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    const checkReminder = () => {
      const hasAdded = hasTransactionToday();
      const currentHour = new Date().getHours();
      
      // Show if no transactions AND it's late (e.g., after 6 PM)
      // Or just show it if they haven't added anything and they opened the app
      if (!hasAdded) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkReminder();
    // Re-check periodically if needed, but usually just on load/transaction change
  }, [hasTransactionToday, isDismissed]);

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('reminder_dismissed_date', today);
    setIsDismissed(true);
    setIsVisible(false);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ thông báo.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      alert('Tuyệt vời! Thông báo đã được kích hoạt.');
      new Notification('Đã bật thông báo!', {
        body: 'Chúng tôi sẽ nhắc bạn cập nhật chi tiêu hàng ngày.',
        icon: '/favicon.svg'
      });
    } else if (permission === 'denied') {
      alert('Bạn đã chặn thông báo. Vui lòng mở cài đặt trình duyệt (nút ổ khóa trên thanh địa chỉ) để cho phép lại.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="reminder-banner glass-card">
      <div className="reminder-content">
        <div className="reminder-icon">
          <AlertCircle size={20} color="var(--accent-warning)" />
        </div>
        <div className="reminder-text">
          <strong>Hôm nay bạn chưa cập nhật chi tiêu!</strong>
          <p>Đừng quên ghi lại các khoản thu chi để quản lý tài chính tốt hơn nhé.</p>
        </div>
      </div>
      <div className="reminder-actions">
        <button className="notify-enable-btn" onClick={requestNotificationPermission}>
          <Bell size={14} /> Bật thông báo đẩy
        </button>
        <button className="dismiss-btn" onClick={handleDismiss}>
          <X size={18} />
        </button>
      </div>

      <style jsx>{`
        .reminder-banner {
          margin-bottom: 2rem;
          padding: 1.2rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-left: 4px solid var(--accent-warning);
          animation: slideDown 0.5s ease-out;
          background: rgba(255, 184, 0, 0.05);
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .reminder-content {
          display: flex;
          gap: 1.2rem;
          align-items: center;
        }

        .reminder-text strong {
          display: block;
          color: var(--accent-warning);
          margin-bottom: 0.2rem;
        }

        .reminder-text p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .reminder-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notify-enable-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .notify-enable-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--accent-cyan);
        }

        .dismiss-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .reminder-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .reminder-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default ReminderBanner;
