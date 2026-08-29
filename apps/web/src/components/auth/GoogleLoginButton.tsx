'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { userApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, X, Mail, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

interface GoogleLoginButtonProps {
  mode?: 'login' | 'register';
  className?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  mode = 'login',
  className = '',
}) => {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { loginWithGoogle, setSessionUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const mockGoogleAccounts = [
    {
      name: 'Nguyễn Văn Anh',
      email: 'nguyen.van.anh@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=van-anh',
      badge: 'IELTS Student',
    },
    {
      name: 'Trần Thị Mai',
      email: 'tran.mai.lingua@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tran-mai',
      badge: 'TOEIC Learner',
    },
  ];

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      const authInfo = await userApi.getGoogleAuthUrl(locale).catch(() => null);
      
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '';
      const callbackUrl = 'http://localhost:4000/api/auth/google/callback';

      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const options = {
        redirect_uri: callbackUrl,
        client_id: clientId,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'select_account',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'openid',
        ].join(' '),
        state: JSON.stringify({ locale }),
      };

      const qs = new URLSearchParams(options);
      const googleAuthUrl = authInfo?.url || `${rootUrl}?${qs.toString()}`;

      // Absolute screen center calculation
      const width = 500;
      const height = 620;
      const left = Math.max(0, Math.round(window.screen.width / 2 - width / 2));
      const top = Math.max(0, Math.round(window.screen.height / 2 - height / 2));

      const popup = window.open(
        googleAuthUrl,
        'google_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // If popup is blocked by browser, fallback to standard redirect
        window.location.href = googleAuthUrl;
        return;
      }

      const clickTime = Date.now();

      // Check popup close / storage synchronization in parent window
      const checkPopupInterval = setInterval(() => {
        const currentToken = localStorage.getItem('lingual_token');
        const authTimestamp = localStorage.getItem('lingual_auth_timestamp');
        const isCompleted = (authTimestamp && Number(authTimestamp) >= clickTime) || (!popup || popup.closed);

        if (currentToken && isCompleted) {
          clearInterval(checkPopupInterval);
          if (popup && !popup.closed) {
            try {
              popup.close();
            } catch {}
          }
          window.location.href = `/${locale}/dashboard`;
        }
      }, 150);

      // Listen for storage events across windows
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'lingual_token' || e.key === 'lingual_auth_timestamp') {
          clearInterval(checkPopupInterval);
          window.removeEventListener('storage', handleStorageChange);
          window.removeEventListener('message', handleAuthMessage);
          if (popup && !popup.closed) {
            try {
              popup.close();
            } catch {}
          }
          window.location.href = `/${locale}/dashboard`;
        }
      };
      window.addEventListener('storage', handleStorageChange);

      // Listen for postMessage from popup callback
      const handleAuthMessage = (event: MessageEvent) => {
        if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkPopupInterval);
          window.removeEventListener('storage', handleStorageChange);
          window.removeEventListener('message', handleAuthMessage);
          if (popup && !popup.closed) {
            try {
              popup.close();
            } catch {}
          }
          if (event.data.user && event.data.token) {
            setSessionUser(event.data.user, event.data.token);
          }
          window.location.href = `/${locale}/dashboard`;
        }
      };

      window.addEventListener('message', handleAuthMessage);
    } catch {
      // Fallback to simulator only if completely offline
      setShowSimulator(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMockAccount = async (account: { name: string; email: string; avatar: string }) => {
    setLoading(true);
    try {
      await loginWithGoogle({
        email: account.email,
        name: account.name,
        avatarUrl: account.avatar,
      });
      setShowSimulator(false);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setLoading(true);
    try {
      await loginWithGoogle({
        email: customEmail,
        name: customName || customEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customEmail)}`,
      });
      setShowSimulator(false);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-white font-bold text-sm transition-all shadow-md hover:shadow-teal-500/5 group disabled:opacity-50 ${className}`}
      >
        {/* Official Google SVG Logo */}
        <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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

        <span>
          {loading
            ? 'Đang kết nối Google...'
            : mode === 'register'
            ? 'Đăng ký nhanh bằng Google'
            : 'Tiếp tục với Google'}
        </span>
      </button>

      {/* Google Account Simulator Modal */}
      <AnimatePresence>
        {showSimulator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSimulator(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
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
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Chọn tài khoản Google</h3>
                    <p className="text-[10px] text-teal-400 font-mono">Google OAuth 2.0 Simulator</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSimulator(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                  aria-label="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block px-1">
                  Tài khoản mẫu có sẵn
                </span>
                {mockGoogleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelectMockAccount(acc)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700" />
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-teal-300 block">
                          {acc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">{acc.email}</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30">
                      {acc.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative border-t border-slate-800 pt-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold bg-slate-900 px-3 absolute -top-2.5 left-1/2 -translate-x-1/2">
                  Hoặc nhập Gmail của bạn
                </span>
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 mt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">Họ và tên</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="VD: Nguyễn Hoàng Nam"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-teal-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">Địa chỉ Gmail</label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="your.name@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-teal-400 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Đăng Nhập Với Gmail Này</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
