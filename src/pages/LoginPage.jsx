import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, UserPlus, Cloud } from 'lucide-react';

const LoginPage = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await signIn(email, password) 
        : await signUp(email, password);

      if (authError) throw authError;
      // Success will be handled by App.jsx state change
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-card">
        <div className="login-header">
          <div className="logo-icon">
            <Cloud size={40} color="var(--accent-cyan)" />
          </div>
          <h1>QLTC</h1>
          <p className="text-secondary">
            {isLogin ? 'Chào mừng bạn quay lại với kế hoạch tài chính.' : 'Bắt đầu hành trình tự do tài chính của bạn.'}
          </p>
        </div>

        <button className="google-btn" onClick={signInWithGoogle}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.2-4.53z"/>
          </svg>
          <span>Đăng nhập với Google</span>
        </button>

        <div className="separator">
          <span>hoặc</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email của bạn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>

        <div className="guest-mode">
          <p className="text-tertiary">Hoặc tiếp tục với <button className="guest-btn">Chế độ Khách (Offline)</button></p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          background: radial-gradient(circle at top right, rgba(0, 209, 255, 0.1), transparent),
                      radial-gradient(circle at bottom left, rgba(112, 0, 255, 0.1), transparent);
        }

        .login-container {
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          text-align: center;
        }

        .logo-icon {
          margin-bottom: 1rem;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        h1 { font-size: 2rem; margin-bottom: 0.2rem; letter-spacing: 1px; }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 0.9rem;
          background: white;
          color: #333;
          border-radius: var(--radius-md);
          font-weight: 600;
          margin: 1.2rem 0 1rem;
          transition: all 0.2s;
        }

        .google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .separator {
          text-align: center;
          margin-bottom: 1rem;
          position: relative;
        }

        .separator::before, .separator::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .separator::before { left: 0; }
        .separator::after { right: 0; }

        .separator span {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          padding: 0 10px;
        }

        .input-group {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          padding: 0.9rem 1.2rem;
          gap: 1rem;
          margin-bottom: 1rem;
          transition: border-color 0.2s;
        }

        .input-group:focus-within {
          border-color: var(--accent-cyan);
        }

        .input-group input {
          background: none;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 1rem;
        }

        .submit-btn {
          width: 100%;
          padding: 1.1rem;
          background: var(--accent-cyan);
          color: black;
          font-weight: 700;
          border-radius: var(--radius-md);
          margin-top: 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #00b0d6;
        }

        .error-message {
          color: var(--accent-danger);
          font-size: 0.85rem;
          margin-bottom: 1rem;
          text-align: left;
        }

        .login-footer {
          margin-top: 1.5rem;
        }

        .login-footer button {
          background: none;
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-decoration: underline;
        }

        .guest-mode {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .guest-btn {
          background: none;
          color: var(--accent-cyan);
          text-decoration: none;
          padding: 0;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
