import React from 'react';
import { Cloud } from 'lucide-react';

const LoadingScreen = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-logo">
          <Cloud size={60} color="var(--accent-cyan)" />
          <div className="logo-pulse"></div>
        </div>
        <h2 className="loading-title">QLTC</h2>
        <p className="loading-message">{message}</p>
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0a0a0c;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
        }

        .loading-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .loading-logo {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-pulse {
          position: absolute;
          width: 80px;
          height: 80px;
          background: var(--accent-cyan);
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(20px);
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }

        .loading-title {
          font-size: 2.5rem;
          letter-spacing: 4px;
          margin: 0;
          background: linear-gradient(to bottom, #fff, rgba(255,255,255,0.4));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .loading-message {
          font-size: 0.9rem;
          color: var(--text-secondary);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .loading-bar-container {
          width: 200px;
          height: 2px;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          border-radius: 2px;
        }

        .loading-bar-fill {
          width: 100%;
          height: 100%;
          background: var(--accent-cyan);
          transform: translateX(-100%);
          animation: progress 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
