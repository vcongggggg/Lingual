'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface GoogleLoginButtonProps {
  mode?: 'login' | 'register';
  className?: string;
}

export function GoogleLoginButton({ mode = 'login', className = '' }: GoogleLoginButtonProps) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Check client-side env variable first
    const clientEnvId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Verify configuration with backend API
    api.getGoogleAuthStatus()
      .then((res) => {
        if (!isMounted) return;
        const isServerConfigured = Boolean(res && (res.configured || res.isConfigured));
        // Available if either NEXT_PUBLIC_GOOGLE_CLIENT_ID is present or server has full credentials
        const isAvail = Boolean(clientEnvId || isServerConfigured);
        setConfigured(isAvail);
      })
      .catch(() => {
        if (!isMounted) return;
        // Fallback to client env check if API fails
        setConfigured(Boolean(clientEnvId));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClick = async () => {
    if (!configured) return;
    setLoading(true);

    try {
      const res = await api.getGoogleAuthUrl();
      if (res && res.url) {
        window.location.href = res.url;
      } else {
        // Fallback to direct backend initiation endpoint
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        window.location.href = `${apiBase}/auth/google`;
      }
    } catch (err: any) {
      console.warn('Google login redirect failed, falling back to direct endpoint:', err);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      window.location.href = `${apiBase}/auth/google`;
    }
  };

  // Nếu chưa cấu hình Google OAuth -> disable/ẩn nút gọn gàng
  if (configured === false) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <button
          type="button"
          disabled
          className="w-full py-2.5 px-4 bg-paper-2 border-2 border-ink/40 text-ink-muted rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-3 cursor-not-allowed opacity-75 shadow-none"
          title="Google OAuth chưa được cấu hình Client ID trên hệ thống."
        >
          <GoogleIcon className="w-4 h-4 grayscale opacity-60" />
          <span>{mode === 'register' ? 'Đăng ký bằng Google' : 'Đăng nhập bằng Google'}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-ink/30 bg-card text-ink-muted">
            Chưa cấu hình
          </span>
        </button>
        <p className="text-[11px] text-center text-ink-muted italic">
          (Cần cung cấp GOOGLE_CLIENT_ID để kích hoạt đăng nhập Google thật)
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={loading || configured === null}
        onClick={handleClick}
        className="w-full py-3 px-4 bg-card hover:bg-[#FFF9F0] border-2 border-ink rounded-2xl text-xs sm:text-sm font-black text-ink shadow-brutal-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer select-none active:translate-y-0 active:shadow-none"
      >
        <GoogleIcon className="w-4 h-4 flex-shrink-0" />
        <span>
          {loading
            ? 'Đang chuyển hướng sang Google...'
            : mode === 'register'
            ? 'Đăng ký nhanh bằng Google'
            : 'Đăng nhập bằng Google'}
        </span>
      </button>
    </div>
  );
}

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
