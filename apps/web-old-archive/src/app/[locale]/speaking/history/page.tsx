'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, History } from 'lucide-react';
import { speakingApi } from '@/lib/speaking/api';
import SpeakingHistory from '@/components/speaking/SpeakingHistory';

export default function SpeakingHistoryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    speakingApi
      .getHistory()
      .then((res: any) => {
        if (res?.attempts) setHistory(res.attempts);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/speaking`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Phòng Luyện Nói' : 'Back to Speaking Lab'}</span>
      </Link>

      <SpeakingHistory attempts={history} locale={locale} />
    </main>
  );
}
