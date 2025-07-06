// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user || null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user || null)
    );

    return () => listener?.unsubscribe();
  }, []);

  const value = {
    user,
    signUp: async (email, password) => {
      const { user, error } = await supabase.auth.signUp({ email, password });
      return { user, error };
    },
    signIn: async (email, password) => {
      const { user, error } = await supabase.auth.signIn({ email, password });
      return { user, error };
    },
    signOut: async () => await supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);