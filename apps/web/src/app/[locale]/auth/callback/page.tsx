'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { setSessionUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        setSessionUser(parsedUser, token);
        localStorage.setItem('lingual_token', token);
        localStorage.setItem('lingual_user', JSON.stringify(parsedUser));
        localStorage.setItem('lingual_auth_timestamp', Date.now().toString());
        window.dispatchEvent(new CustomEvent('lingual_auth_change', { detail: { user: parsedUser } }));
      } catch (err) {
        console.error(err);
      }
    } else if (token) {
      localStorage.setItem('lingual_token', token);
      localStorage.setItem('lingual_auth_timestamp', Date.now().toString());
    }

    try {
      if (window.opener && window.opener !== window) {
        window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
      }
    } catch {}

    try {
      window.close();
    } catch {}

    // Fallback if window.close() is blocked
    const timeout = setTimeout(() => {
      try {
        window.close();
      } catch {}
      window.location.href = `/${locale}/dashboard`;
    }, 150);

    return () => clearTimeout(timeout);
  }, [searchParams, locale, setSessionUser]);

  return (
    <div className="text-center p-4">
      <div className="w-8 h-8 mx-auto border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-2" />
      <p className="text-xs font-bold text-teal-400">Đang hoàn tất đăng nhập...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
