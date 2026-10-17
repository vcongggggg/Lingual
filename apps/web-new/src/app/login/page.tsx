'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LingLing } from '../../components/ui/LingLing';
import { api, setAuthToken } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      setAuthToken(res.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-card border-2 border-ink rounded-3xl shadow-brutal-2xl p-8 sm:p-10 text-left">
        {/* LingLing thò đầu ra ở góc trên */}
        <div className="absolute -top-12 -right-4 w-24">
          <LingLing reaction="greet" size={90} animate={true} />
        </div>

        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-red block mb-1">
            Chào mừng trở lại
          </span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Đăng Nhập Sổ Tay</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 leading-relaxed">
            Mỗi ngày một trang mới. Tiếp tục thắp sáng chuỗi streak của bạn nhé!
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red/10 border-2 border-red rounded-xl text-xs font-bold text-red leading-relaxed shadow-brutal-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Địa chỉ Email"
            type="email"
            required
            placeholder="vd: hocvien@lingual.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mật khẩu"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="red"
            size="lg"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Đang mở sổ tay...' : 'Vào Học Ngay →'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t-2 border-ink/15 text-center text-xs font-bold text-ink-soft">
          Chưa có tài khoản Lingual?{' '}
          <Link href="/register" className="text-red hover:underline font-black">
            Đăng ký miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
}
