'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { Card } from '@linguaflow/ui';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { setSessionUser } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setErrorMessage(
        errorParam === 'GoogleAuthFailed'
          ? 'Không nhận được mã xác thực từ Google.'
          : errorParam === 'TokenExchangeFailed'
          ? 'Lỗi trao đổi token với Google OAuth.'
          : 'Đăng nhập Google không thành công. Vui lòng thử lại.'
      );
      return;
    }

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        setSessionUser(parsedUser, token);
        setStatus('success');
        const timeout = setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 1200);
        return () => clearTimeout(timeout);
      } catch (err) {
        setStatus('error');
        setErrorMessage('Dữ liệu người dùng trả về không hợp lệ.');
      }
    } else if (token) {
      localStorage.setItem('lingual_token', token);
      setStatus('success');
      const timeout = setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 1200);
      return () => clearTimeout(timeout);
    } else {
      setStatus('error');
      setErrorMessage('Không tìm thấy thông tin đăng nhập.');
    }
  }, [searchParams, router, locale, setSessionUser]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card glow={status === 'error' ? 'coral' : 'teal'} className="p-8 text-center space-y-6">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-amber-300 p-0.5 animate-pulse shadow-xl shadow-teal-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-display font-bold text-white">
                  Đang đồng bộ tài khoản Google...
                </h2>
                <p className="text-xs text-slate-400">
                  Hệ thống đang thiết lập môi trường học tập cá nhân hóa của bạn.
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-display font-bold text-white">
                  Đăng nhập thành công!
                </h2>
                <p className="text-xs text-emerald-300 font-semibold">
                  Đang chuyển hướng vào Lộ trình học tập...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-display font-bold text-white">Đăng nhập thất bại</h2>
                <p className="text-xs text-rose-300 font-semibold">{errorMessage}</p>
              </div>
              <button
                onClick={() => router.push(`/${locale}/login`)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700 mt-4"
              >
                Quay lại trang Đăng nhập
              </button>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-sm font-bold text-slate-400 animate-pulse">
            Đang tải dữ liệu xác thực...
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
