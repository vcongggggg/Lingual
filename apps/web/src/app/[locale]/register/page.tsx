'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card } from '@linguaflow/ui';
import { useAuth } from '../../../contexts/AuthContext';
import { Sparkles, Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const router = useRouter();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({ displayName, email, password });
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đăng ký tài khoản');
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
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-amber-400 p-0.5 shadow-xl shadow-teal-500/20 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-teal-400" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-xs text-slate-400">
            Bắt đầu hành trình chinh phục tiếng Anh hoàn toàn miễn phí
          </p>
        </div>

        {/* Register Form Card */}
        <Card glow="teal" className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Tên hiển thị</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

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
              <label className="text-xs font-bold text-slate-300 block">Mật khẩu (ít nhất 6 ký tự)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản & Học Ngay'}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Đã có tài khoản?{' '}
            <Link href={`/${locale}/login`} className="text-teal-400 font-bold hover:underline">
              Đăng nhập
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
