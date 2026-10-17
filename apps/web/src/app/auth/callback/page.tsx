'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink p-4">
      <div className="card-paper p-8 text-center space-y-3">
        <h2 className="text-lg font-black font-sans">Đang hoàn tất đăng nhập...</h2>
        <p className="text-xs text-ink-soft">Vui lòng chờ trong giây lát để trở về sổ tay học tập.</p>
      </div>
    </div>
  );
}
