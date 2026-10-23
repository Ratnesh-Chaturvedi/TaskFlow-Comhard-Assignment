import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Sync / verify user session with backend on load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('taskflow_user', JSON.stringify(res.data));
          } else {
            throw new Error('No user returned');
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const authenticatedUser = res.data.user;
      const authToken = res.data.token;

      setUser(authenticatedUser);
      setToken(authToken);
      localStorage.setItem('taskflow_token', authToken);
      localStorage.setItem('taskflow_user', JSON.stringify(authenticatedUser));
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      const authenticatedUser = res.data.user;
      const authToken = res.data.token;

      setUser(authenticatedUser);
      setToken(authToken);
      localStorage.setItem('taskflow_token', authToken);
      localStorage.setItem('taskflow_user', JSON.stringify(authenticatedUser));
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
    }
  };

  const updateUser = (updated) => {
    setUser((prev) => {
      if (!prev) return prev;
      const neu = { ...prev, ...updated };
      localStorage.setItem('taskflow_user', JSON.stringify(neu));
      return neu;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
