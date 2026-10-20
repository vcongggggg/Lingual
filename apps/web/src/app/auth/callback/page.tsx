'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthToken } from '../../../lib/api';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token) {
      setAuthToken(token);
    }

    // Small delay to ensure cookie and storage sync
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 100);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="card-paper p-8 text-center space-y-3 bg-card border-2 border-ink shadow-brutal-xl rounded-3xl max-w-sm">
      <div className="w-10 h-10 border-2 border-ink rounded-full border-t-red animate-spin mx-auto" />
      <h2 className="text-lg font-black font-sans text-ink">Đang hoàn tất đăng nhập Google...</h2>
      <p className="text-xs text-ink-soft">Vui lòng chờ trong giây lát để trở về sổ tay học tập.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink p-4">
      <Suspense
        fallback={
          <div className="card-paper p-8 text-center space-y-3 bg-card border-2 border-ink rounded-3xl">
            <h2 className="text-lg font-black font-sans">Đang xử lý...</h2>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
