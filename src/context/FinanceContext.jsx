import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [jars, setJars] = useState(INITIAL_JARS);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (user) {
        try {
          // Fetch from Supabase
          const { data: jarsData, error: jarsError } = await supabase
            .from('jars')
            .select('*')
            .eq('user_id', user.id);
          
          if (jarsError) throw jarsError;

          const { data: transData } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

          if (jarsData && jarsData.length > 0) {
            // Case 1: Database has data, use it
            setJars(INITIAL_JARS.map(initJar => {
              const savedJar = jarsData.find(sj => sj.jar_id === initJar.id);
              return savedJar ? { 
                ...initJar, 
                balance: Number(savedJar.balance),
                targetAmount: Number(savedJar.target_amount) || 0,
                goalStartDate: savedJar.goal_start_date || null
              } : initJar;
            }));
            if (transData) setTransactions(transData);
          } else {
            // Case 2: Database is empty, check localStorage for migration
            const savedJars = localStorage.getItem('qltc_jars');
            const savedTrans = localStorage.getItem('qltc_transactions');
            
            if (savedJars) {
              const parsedJars = JSON.parse(savedJars);
              const parsedTrans = savedTrans ? JSON.parse(savedTrans) : [];
              
              // Migrate Local to Cloud
              const jarUpdates = parsedJars.map(jar => ({
                user_id: user.id,
                jar_id: jar.id || jar.jar_id,
                balance: jar.balance,
                target_amount: jar.targetAmount || jar.target_amount || 0,
                goal_start_date: jar.goalStartDate || jar.goal_start_date
              }));
              
              await supabase.from('jars').upsert(jarUpdates, { onConflict: 'user_id,jar_id' });
              
              if (parsedTrans.length > 0) {
                const transUpdates = parsedTrans.map(t => ({
                  id: t.id,
                  user_id: user.id,
                  date: t.date,
                  type: t.type,
                  amount: t.amount,
                  jar_id: t.jarId || t.jar_id,
                  note: t.note,
                  category: t.category,
                  debt_amount: t.debtAmount || t.debt_amount,
                  remaining_amount: t.remainingAmount || t.remaining_amount,
                  is_allocation: t.isAllocation || t.is_allocation
                }));
                await supabase.from('transactions').upsert(transUpdates, { onConflict: 'id' });
              }
              
              setJars(INITIAL_JARS.map(initJar => {
                const savedJar = parsedJars.find(sj => (sj.id || sj.jar_id) === initJar.id);
                return savedJar ? { 
                  ...initJar, 
                  balance: savedJar.balance,
                  targetAmount: savedJar.targetAmount || savedJar.target_amount || 0,
                  goalStartDate: savedJar.goalStartDate || savedJar.goal_start_date || null
                } : initJar;
              }));
              setTransactions(parsedTrans);
              console.log('Migration to Supabase completed.');
            } else {
              // Case 3: Brand new user, seed INITIAL_JARS to Cloud
              const jarUpdates = INITIAL_JARS.map(jar => ({
                user_id: user.id,
                jar_id: jar.id,
                balance: 0,
                target_amount: 0,
                goal_start_date: null
              }));
              await supabase.from('jars').upsert(jarUpdates, { onConflict: 'user_id,jar_id' });
            }
          }
        } catch (err) {
          console.error('Error loading Supabase data:', err);
          // Fallback to local on error (e.g. table not created)
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
      setIsLoading(false);
    };

    const loadLocalData = () => {
      const savedJars = localStorage.getItem('qltc_jars');
      const savedTrans = localStorage.getItem('qltc_transactions');
      
      if (savedJars) {
        const parsedJars = JSON.parse(savedJars);
        setJars(INITIAL_JARS.map(initJar => {
          const savedJar = parsedJars.find(sj => sj.id === initJar.id);
          return savedJar ? { 
            ...initJar, 
            balance: savedJar.balance,
            targetAmount: savedJar.targetAmount || 0,
            goalStartDate: savedJar.goalStartDate || null
          } : initJar;
        }));
      }
      
      if (savedTrans) {
        setTransactions(JSON.parse(savedTrans));
      }
    };

    loadData();
  }, [user]);

  // Sync to Cloud/Local
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // We handle syncing per-action (addIncome, addExpense) to avoid heavy operations
        // But we still update localStorage as a backup
        localStorage.setItem('qltc_jars', JSON.stringify(jars));
        localStorage.setItem('qltc_transactions', JSON.stringify(transactions));
      } else {
        localStorage.setItem('qltc_jars', JSON.stringify(jars));
        localStorage.setItem('qltc_transactions', JSON.stringify(transactions));
      }
    }
  }, [jars, transactions, user, isLoading]);

  const addIncome = async (amount, debtAmount = 0, note = 'Thu nhập mới') => {
    const remainingAmount = amount - debtAmount;
    const newJars = jars.map(jar => ({
      ...jar,
      balance: jar.balance + (remainingAmount * jar.percentage) / 100
    }));
    
    const transaction = {
      id: crypto.randomUUID(),
      user_id: user?.id,
      date: new Date().toISOString(),
      type: 'in',
      amount,
      debt_amount: debtAmount,
      remaining_amount: remainingAmount,
      note,
      is_allocation: true
    };

    setJars(newJars);
    setTransactions([transaction, ...transactions]);

    if (user) {
      // Sync to Supabase
      const jarUpdates = newJars.map(jar => ({
        user_id: user.id,
        jar_id: jar.id,
        balance: jar.balance,
        target_amount: jar.targetAmount || 0,
        goal_start_date: jar.goalStartDate
      }));

      await supabase.from('jars').upsert(jarUpdates, { onConflict: 'user_id,jar_id' });
      await supabase.from('transactions').insert(transaction);
    }
  };

  const addExpense = async (amount, jarId, note, category) => {
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
      user_id: user?.id,
      date: new Date().toISOString(),
      type: 'out',
      amount,
      jar_id: jarId,
      note,
      category
    };

    setJars(newJars);
    setTransactions([transaction, ...transactions]);

    if (user) {
      // Sync to Supabase
      await supabase.from('jars').upsert({
        user_id: user.id,
        jar_id: jarId,
        balance: jar.balance - amount,
        target_amount: jar.targetAmount || 0,
        goal_start_date: jar.goalStartDate
      }, { onConflict: 'user_id,jar_id' });
      
      await supabase.from('transactions').insert(transaction);
    }

    return { success: true };
  };

  const getBalanceSummary = () => {
    return jars.reduce((total, jar) => total + jar.balance, 0);
  };

  const updateJarGoal = async (jarId, targetAmount) => {
    const goalStartDate = targetAmount > 0 ? new Date().toISOString() : null;
    const newJars = jars.map(jar => 
      jar.id === jarId 
        ? { ...jar, targetAmount, goalStartDate } 
        : jar
    );

    setJars(newJars);

    if (user) {
      const jar = newJars.find(j => j.id === jarId);
      await supabase.from('jars').upsert({
        user_id: user.id,
        jar_id: jarId,
        balance: jar.balance,
        target_amount: targetAmount,
        goal_start_date: goalStartDate
      }, { onConflict: 'user_id,jar_id' });
    }
  };

  const syncLocalDataToCloud = async () => {
    if (!user) return { success: false, message: 'Vui lòng đăng nhập' };
    
    // Logic to push all local data to Supabase
    const jarUpdates = jars.map(jar => ({
      user_id: user.id,
      jar_id: jar.id,
      balance: jar.balance,
      target_amount: jar.targetAmount || 0,
      goal_start_date: jar.goalStartDate
    }));

    const transUpdates = transactions.map(t => ({
      ...t,
      user_id: user.id,
      jar_id: t.jarId || t.jar_id // handle various keys
    }));

    await supabase.from('jars').upsert(jarUpdates, { onConflict: 'user_id,jar_id' });
    if (transUpdates.length > 0) {
      await supabase.from('transactions').upsert(transUpdates);
    }
    
    return { success: true };
  };

  return (
    <FinanceContext.Provider value={{ 
      jars, 
      transactions, 
      isLoading,
      addIncome, 
      addExpense, 
      getBalanceSummary,
      updateJarGoal,
      syncLocalDataToCloud
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
