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
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; displayName: string }) => Promise<void>;
  logout: () => void;
  updateUserXP: (newXP: number, streak?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'demo-user-id-001',
    email: 'demo@linguaflow.com',
    displayName: 'Học Viên LinguaFlow',
    role: 'LEARNER',
    interfaceLocale: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dailyGoalMinutes: 15,
    totalXP: 150,
    currentStreak: 3,
    streakFreezes: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await userApi.getMe();
        if (res?.user) {
          setUser(res.user);
        }
      } catch {
        // Keep default demo user for seamless offline/demo usage
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await userApi.login(email, password);
    if (res?.accessToken && res?.user) {
      setAuthToken(res.accessToken);
      setUser(res.user);
    }
  };

  const register = async (data: { email: string; password: string; displayName: string }) => {
    const res = await userApi.register(data);
    if (res?.accessToken && res?.user) {
      setAuthToken(res.accessToken);
      setUser(res.user);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const updateUserXP = (newXP: number, streak?: number) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            totalXP: newXP,
            currentStreak: streak !== undefined ? streak : prev.currentStreak,
          }
        : null
    );
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserXP }}>
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
