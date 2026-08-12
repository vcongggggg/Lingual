'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  useEffect(() => {
    console.error('LinguaFlow Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
      {/* Error Icon */}
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/10">
        <AlertTriangle className="w-10 h-10 text-rose-400" />
      </div>

      {/* Error Message */}
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-2xl font-display font-extrabold text-white">
          Oops! Có lỗi xảy ra
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Đã có lỗi không mong muốn trong quá trình tải trang. Hãy thử tải lại hoặc quay về trang chủ.
        </p>
        {error.message && (
          <p className="text-xs text-slate-500 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800 break-words">
            {error.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 hover:brightness-110 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Thử Lại
        </button>
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
