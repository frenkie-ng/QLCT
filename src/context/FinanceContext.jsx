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
  { id: 'nec', name: 'Thiết yếu', percentage: 55, balance: 0, color: '#00d1ff', description: 'Chi trả các chi phí bắt buộc để duy trì cuộc sống hàng ngày.' },
  { id: 'ffa', name: 'Tự do Tài chính', percentage: 10, balance: 0, color: '#7000ff', description: 'Dùng để đầu tư tạo ra tiền. Tuyệt đối không tiêu vào việc khác.' },
  { id: 'lts', name: 'Tiết kiệm dài hạn', percentage: 10, balance: 0, color: '#00ff94', description: 'Cho các mục tiêu lớn (xe, nhà) hoặc quỹ dự phòng khẩn cấp.' },
  { id: 'edu', name: 'Giáo dục', percentage: 10, balance: 0, color: '#ffb800', description: 'Đầu tư vào tri thức, sách vở, khóa học để tăng giá trị bản thân.' },
  { id: 'play', name: 'Hưởng thụ', percentage: 10, balance: 0, color: '#ff00c8', description: 'Phải tiêu hết mỗi tháng để nuôi dưỡng tâm hồn và giảm áp lực.' },
  { id: 'give', name: 'Cho đi', percentage: 5, balance: 0, color: '#ff3d00', description: 'Giúp đỡ người khác, làm từ thiện, tạo năng lượng tích cực.' },
];

export const FinanceProvider = ({ children }) => {
  const [jars, setJars] = useState(() => {
    const saved = localStorage.getItem('qltc_jars');
    if (saved) {
      const savedJars = JSON.parse(saved);
      // Kết hợp dữ liệu đã lưu (số dư) với metadata mới (mô tả, màu sắc) từ INITIAL_JARS
      return INITIAL_JARS.map(initJar => {
        const savedJar = savedJars.find(sj => sj.id === initJar.id);
        return savedJar ? { 
          ...initJar, 
          balance: savedJar.balance,
          targetAmount: savedJar.targetAmount || 0,
          goalStartDate: savedJar.goalStartDate || null
        } : initJar;
      });
    }
    return INITIAL_JARS;
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
  const addIncome = (amount, debtAmount = 0, note = 'Thu nhập mới') => {
    const remainingAmount = amount - debtAmount;
    
    const newJars = jars.map(jar => ({
      ...jar,
      balance: jar.balance + (remainingAmount * jar.percentage) / 100
    }));
    
    const transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'in',
      amount,
      debtAmount,
      remainingAmount,
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

  const updateJarGoal = (jarId, targetAmount) => {
    setJars(jars.map(jar => 
      jar.id === jarId 
        ? { ...jar, targetAmount, goalStartDate: targetAmount > 0 ? new Date().toISOString() : null } 
        : jar
    ));
  };

  return (
    <FinanceContext.Provider value={{ 
      jars, 
      transactions, 
      addIncome, 
      addExpense, 
      getBalanceSummary,
      updateJarGoal
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
