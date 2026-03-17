import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <FinanceProvider>
      <div className="app-container">
        <Dashboard />
      </div>
    </FinanceProvider>
  );
}

export default App;
