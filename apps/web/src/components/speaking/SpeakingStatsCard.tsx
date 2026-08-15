'use client';

import React from 'react';
import { Trophy, Clock, Mic, Activity } from 'lucide-react';

interface SpeakingStatsCardProps {
  stats: {
    totalAttempts: number;
    totalMinutes: number;
    totalXP: number;
    averageScore: number;
    averagePronunciation: number;
    averageFluency: number;
    topGrade: string;
  };
  locale?: string;
  className?: string;
}

export default function SpeakingStatsCard({
  stats,
  locale = 'vi',
  className = '',
}: SpeakingStatsCardProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <span>{isVi ? 'Thống Kê Luyện Nói' : 'Speaking Performance Stats'}</span>
        </h3>
        <span className="text-xs font-mono text-teal-300 font-bold">
          {stats.topGrade}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Độ khớp phát âm TB' : 'Avg Pronunciation'}</span>
          <p className="text-xl font-display font-extrabold text-teal-300 font-mono">
            {stats.averagePronunciation}%
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Độ trôi chảy TB' : 'Avg Fluency'}</span>
          <p className="text-xl font-display font-extrabold text-indigo-300 font-mono">
            {stats.averageFluency}%
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-0.5">
          <span className="text-[10px] text-slate-400 block">{isVi ? 'Tổng điểm tích lũy' : 'Total XP'}</span>
          <p className="text-xl font-display font-extrabold text-amber-400 font-mono flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            {stats.totalXP} XP
          </p>
        </div>
      </div>
    </div>
  );
}
