import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

const INITIAL_JARS = [
  { id: 'nec', name: 'Thiết yếu', percentage: 55, balance: 0, color: '#00d1ff' },
  { id: 'ffa', name: 'Tự do Tài chính', percentage: 10, balance: 0, color: '#7000ff' },
  { id: 'lts', name: 'Tiết kiệm dài hạn', percentage: 10, balance: 0, color: '#00ff94' },
  { id: 'edu', name: 'Giáo dục', percentage: 10, balance: 0, color: '#ffb800' },
  { id: 'play', name: 'Hưởng thụ', percentage: 10, balance: 0, color: '#ff00c8' },
  { id: 'give', name: 'Cho đi', percentage: 5, balance: 0, color: '#ff3d00' },
];

export const FinanceProvider = ({ children }) => {
  const [jars, setJars] = useState(() => {
    const saved = localStorage.getItem('qltc_jars');
    return saved ? JSON.parse(saved) : INITIAL_JARS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('qltc_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('qltc_jars', JSON.stringify(jars));
    localStorage.setItem('qltc_transactions', JSON.stringify(transactions));
  }, [jars, transactions]);

  // Logic thêm thu nhập (Phân bổ vào các hũ)
  const addIncome = (amount, note = 'Thu nhập mới') => {
    const newJars = jars.map(jar => ({
      ...jar,
      balance: jar.balance + (amount * jar.percentage) / 100
    }));
    
    const transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'in',
      amount,
      note,
      isAllocation: true
    };

    setJars(newJars);
    setTransactions([transaction, ...transactions]);
  };

  // Logic thêm chi tiêu
  const addExpense = (amount, jarId, note, category) => {
    const jar = jars.find(j => j.id === jarId);
    if (!jar) return { success: false, message: 'Hũ không tồn tại' };

    const newJars = jars.map(j => {
      if (j.id === jarId) {
        return { ...j, balance: j.balance - amount };
      }
      return j;
    });

    const transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'out',
      amount,
      jarId,
      note,
      category
    };

    setJars(newJars);
    setTransactions([transaction, ...transactions]);
    return { success: true };
  };

  const getBalanceSummary = () => {
    return jars.reduce((total, jar) => total + jar.balance, 0);
  };

  return (
    <FinanceContext.Provider value={{ 
      jars, 
      transactions, 
      addIncome, 
      addExpense, 
      getBalanceSummary 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
