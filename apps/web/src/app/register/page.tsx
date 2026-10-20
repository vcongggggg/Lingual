'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LingLing } from '../../components/ui/LingLing';
import { api, setAuthToken } from '../../lib/api';
import { GoogleLoginButton } from '../../components/auth/GoogleLoginButton';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.register({
        email,
        password,
        displayName,
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
      });
      setAuthToken(res.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng ký. Vui lòng kiểm tra lại mật khẩu (cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 w-full max-w-full">
      <div className="relative w-full max-w-sm sm:max-w-md bg-card border-2 border-ink rounded-3xl shadow-brutal-2xl p-6 sm:p-10 text-left">
        {/* LingLing salute ở góc trên */}
        <div className="absolute -top-11 -right-3 sm:-top-12 sm:-right-4 w-20 sm:w-24">
          <LingLing reaction="salute" size={85} animate={true} />
        </div>

        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-red block mb-1">
            Khởi đầu hành trình
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Tạo Sổ Tay Mới</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 leading-relaxed break-words">
            Học tiếng Anh mỗi ngày, nhớ lâu thật sự. Miễn phí trọn đời cho người học.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red/10 border-2 border-red rounded-xl text-xs font-bold text-red leading-relaxed shadow-brutal-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên của bạn"
            type="text"
            required
            placeholder="vd: Minh Anh"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

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
            placeholder="Tối thiểu 8 ký tự"
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
            {loading ? 'Đang khởi tạo...' : 'Tạo Tài Khoản & Bắt Đầu →'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-ink/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-[11px] font-black text-ink-muted">
              hoặc
            </span>
          </div>
        </div>

        {/* Google OAuth Register Button */}
        <GoogleLoginButton mode="register" />

        <div className="mt-6 pt-5 border-t-2 border-ink/15 text-center text-xs font-bold text-ink-soft">
          Đã có tài khoản rồi?{' '}
          <Link href="/login" className="text-red hover:underline font-black">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
