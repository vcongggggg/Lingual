'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card } from '@linguaflow/ui';
import { useAuth } from '../../../contexts/AuthContext';
import { Sparkles, Mail, Lock, LogIn, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('demo@linguaflow.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@linguaflow.com');
    setPassword('123456');
    setLoading(true);
    try {
      await login('demo@linguaflow.com', '123456');
      router.push(`/${locale}/dashboard`);
    } catch {
      router.push(`/${locale}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-coral-500 via-amber-500 to-teal-400 p-0.5 shadow-xl shadow-coral-500/20 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Đăng Nhập LinguaFlow
          </h1>
          <p className="text-xs text-slate-400">
            Chinh phục tiếng Anh theo cách gamified cá nhân hóa
          </p>
        </div>

        {/* Login Form Card */}
        <Card glow="teal" className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhap-email@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
              icon={<LogIn className="w-4 h-4" />}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </form>

          {/* Quick Demo Login Divider */}
          <div className="relative border-t border-slate-800 pt-4 text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold bg-slate-900 px-3 absolute -top-2.5 left-1/2 -translate-x-1/2">
              Hoặc trải nghiệm nhanh
            </span>
            <Button
              variant="secondary"
              size="md"
              className="w-full mt-2"
              onClick={handleDemoLogin}
              icon={<UserCheck className="w-4 h-4 text-teal-400" />}
            >
              Đăng Nhập Tài Khoản Demo
            </Button>
          </div>

          <div className="text-center text-xs text-slate-400">
            Chưa có tài khoản?{' '}
            <Link href={`/${locale}/register`} className="text-teal-400 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
