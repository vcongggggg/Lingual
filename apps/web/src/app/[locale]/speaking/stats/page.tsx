'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';
import { speakingApi } from '@/lib/speaking/api';
import SpeakingStatsCard from '@/components/speaking/SpeakingStatsCard';

export default function SpeakingStatsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [stats, setStats] = useState<any>({
    totalAttempts: 12,
    totalMinutes: 125,
    totalXP: 540,
    averageScore: 78,
    averagePronunciation: 82,
    averageFluency: 75,
    topGrade: 'Good',
  });

  useEffect(() => {
    speakingApi
      .getStats()
      .then((res: any) => {
        if (res?.stats) setStats(res.stats);
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

      <SpeakingStatsCard stats={stats} locale={locale} />
    </main>
  );
}
