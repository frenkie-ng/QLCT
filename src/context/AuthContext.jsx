import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const handleSession = async (session) => {
      const currentUser = session?.user ?? null;
      
      // Artificial delay only for the literal first load of the app
      const needsDelay = isFirstLoad.current;
      const minWait = needsDelay ? new Promise(resolve => setTimeout(resolve, 1000)) : Promise.resolve();
      
      setUser(currentUser);
      
      const setup = (async () => {
        if (currentUser) {
          const { user_metadata } = currentUser;
          await supabase.from('profiles').upsert({
            id: currentUser.id,
            updated_at: new Date().toISOString(),
            full_name: user_metadata?.full_name || currentUser.email.split('@')[0],
            avatar_url: user_metadata?.avatar_url || null
          }, { onConflict: 'id' });
        }
      })();

      await Promise.all([setup, minWait]);
      setLoading(false);
      isFirstLoad.current = false;
    };

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({ 
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signInWithGoogle, 
      signOut 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
