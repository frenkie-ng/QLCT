import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { PlannerProvider } from './context/PlannerContext';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import IncomePlanner from './pages/IncomePlanner';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';
import './styles/planner.css';

import LoadingScreen from './components/LoadingScreen';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Đang khởi tạo ứng dụng..." />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/planner" element={<IncomePlanner />} />
      <Route path="/planner/:id" element={<ProjectDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <PlannerProvider>
          <Router>
            <div className="app-container">
              <AppContent />
            </div>
          </Router>
        </PlannerProvider>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
