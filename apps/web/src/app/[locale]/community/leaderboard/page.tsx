'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LeaderboardView from '@/components/community/Leaderboard';

export default function CommunityLeaderboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Cộng Đồng' : 'Back to Community'}</span>
      </Link>

      <LeaderboardView locale={locale} />
    </main>
  );
}
