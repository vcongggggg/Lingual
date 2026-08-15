'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, Sparkles, Trophy } from 'lucide-react';
import { communityApi } from '@/lib/community/api';
import AchievementCard from '@/components/community/AchievementCard';
import { SAMPLE_ACHIEVEMENTS } from '@/lib/community/sampleData';

export default function AchievementsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [achievements, setAchievements] = useState<any[]>(SAMPLE_ACHIEVEMENTS);

  useEffect(() => {
    communityApi
      .getAchievements()
      .then((res: any) => {
        if (res?.achievements) {
          setAchievements(res.achievements);
        }
      })
      .catch(() => {});
  }, []);

  const unlockedCount = (achievements || []).filter((a) => a.isUnlocked).length;

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Cộng Đồng' : 'Back to Community'}</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {isVi ? 'Huy Hiệu & Thành Tích Học Tập' : 'Social Learning Achievements'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isVi ? 'Chinh phục các cột mốc học tập và nhận thưởng điểm XP vinh danh' : 'Unlock badges and earn XP rewards'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center self-start sm:self-auto">
          <span className="text-[11px] text-amber-300 font-bold block">{isVi ? 'Đã mở khóa' : 'Unlocked'}</span>
          <p className="text-xl font-display font-extrabold text-white font-mono">
            {unlockedCount}/{achievements.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} locale={locale} />
        ))}
      </div>
    </main>
  );
}
