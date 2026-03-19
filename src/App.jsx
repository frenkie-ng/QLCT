import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import './App.css';

import LoadingScreen from './components/LoadingScreen';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Đang khởi tạo ứng dụng..." />;
  }

  return user ? <Dashboard /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <div className="app-container">
          <AppContent />
        </div>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
