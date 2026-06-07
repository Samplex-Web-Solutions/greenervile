import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../../SuperBase/superbaseClient';
import { authService } from '../../Services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId || isFetching) return;
    
    setIsFetching(true); 
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn("[AuthContext] Request aborted due to lock steal - retrying silently...");
      } else {
        console.error("[AuthContext] Profile Fetch Error:", error.message);
      }
    } finally {
      setIsFetching(false);
      setLoading(false); 
    }
  }, [isFetching]);

  useEffect(() => {
  let isMounted = true;

  const getSession = async () => {
    // 1. Get the session first
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && isMounted) {
      setUser(session.user);
      // 2. Only fetch profile if we have a session
      await fetchProfile(session.user.id);
    }
    setLoading(false);
  };

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (isMounted) {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }
  });

  getSession();

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);


  const signUp = async (email, password, firstName, lastName, username) => {
    return await authService.register(email, password, firstName, lastName, username);
  };

  const contextValue = useMemo(() => ({
    user,
    profile,
    loading,
    signUp, 
    signIn: authService.login,
    signOut: authService.logout,
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};