'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, setAuthToken, clearAuthToken } from '../lib/api';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  interfaceLocale: string;
  timezone: string;
  dailyGoalMinutes: number;
  totalXP: number;
  currentStreak: number;
  streakFreezes: number;
  avatarUrl?: string | null;
  authProvider?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (mockData?: { email: string; name?: string; avatarUrl?: string }) => Promise<void>;
  setSessionUser: (user: UserProfile, token: string) => void;
  register: (data: { email: string; password: string; displayName: string }) => Promise<void>;
  logout: () => void;
  updateUserXP: (newXP: number, streak?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem('lingual_token') || localStorage.getItem('linguaflow_token');
      const savedUserStr = localStorage.getItem('lingual_user');
      if (token && savedUserStr) {
        return JSON.parse(savedUserStr);
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('lingual_token') || localStorage.getItem('linguaflow_token');
        const savedUserStr = localStorage.getItem('lingual_user');
        if (token && savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          const res = await userApi.getMe().catch(() => null);
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('lingual_user', JSON.stringify(res.user));
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      const token = localStorage.getItem('lingual_token') || localStorage.getItem('linguaflow_token');
      const savedUserStr = localStorage.getItem('lingual_user');
      if (token && savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('lingual_auth_change', handleAuthChange);
    return () => window.removeEventListener('lingual_auth_change', handleAuthChange);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await userApi.login(email, password);
    if (res?.accessToken && res?.user) {
      setAuthToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem('lingual_user', JSON.stringify(res.user));
      localStorage.setItem('lingual_token', res.accessToken);
      window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: res.user } }));
    }
  };

  const loginWithGoogle = async (mockData?: { email: string; name?: string; avatarUrl?: string }) => {
    const res = await userApi.mockGoogleLogin(
      mockData || {
        email: 'google.student@linguaflow.io',
        name: 'Học Viên Google',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=google-student',
      }
    );
    if (res?.accessToken && res?.user) {
      setAuthToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem('lingual_user', JSON.stringify(res.user));
      localStorage.setItem('lingual_token', res.accessToken);
      window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: res.user } }));
    }
  };

  const setSessionUser = (sessionUser: UserProfile, token: string) => {
    setAuthToken(token);
    setUser(sessionUser);
    localStorage.setItem('lingual_user', JSON.stringify(sessionUser));
    localStorage.setItem('lingual_token', token);
    window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: sessionUser } }));
  };

  const register = async (data: { email: string; password: string; displayName: string }) => {
    const res = await userApi.register(data);
    if (res?.accessToken && res?.user) {
      setAuthToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem('lingual_user', JSON.stringify(res.user));
      localStorage.setItem('lingual_token', res.accessToken);
      window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: res.user } }));
    }
  };

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem('lingual_user');
    localStorage.removeItem('lingual_token');
    localStorage.removeItem('linguaflow_token');
    setUser(null);
    window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: null } }));
  };

  const updateUserXP = (newXP: number, streak?: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        totalXP: newXP,
        currentStreak: streak !== undefined ? streak : prev.currentStreak,
      };
      localStorage.setItem('lingual_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        setSessionUser,
        register,
        logout,
        updateUserXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
