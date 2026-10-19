'use client';

import React from 'react';
import { Activity, Flame, Clock, Trophy, Sparkles } from 'lucide-react';
import LingLingMascot from '@/components/LingLingMascot';
import { Badge } from '@linguaflow/ui';

interface LearningAnalyticsHeroProps {
  overallScore: number;
  estimatedCEFR: string;
  totalStudyMinutes: number;
  totalXP: number;
  currentStreak: number;
  weeklyMinutes: number;
  locale?: string;
}

export default function LearningAnalyticsHero({
  overallScore,
  estimatedCEFR,
  totalStudyMinutes,
  totalXP,
  currentStreak,
  weeklyMinutes,
  locale = 'vi',
}: LearningAnalyticsHeroProps) {
  const isVi = locale === 'vi';

  // Mascot reaction state based on score
  const mascotState = overallScore >= 75 ? 'celebrating' : overallScore >= 55 ? 'thinking' : 'apologetic';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/20 p-6 sm:p-10 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Learning Intelligence & Analytics Lab</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Trung Tâm Phân Tích <br />
            <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Năng Lực & Trí Tuệ Học Tập
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isVi
              ? 'Hệ thống phân tích thông minh dựa trên dữ liệu học tập thực tế, giúp bạn hiểu rõ điểm mạnh, khắc phục điểm yếu và bứt phá mục tiêu ngôn ngữ.'
              : 'Intelligent learning analytics based on your real performance, identifying strengths, addressing weaknesses, and unlocking fluency.'}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <Badge variant="teal" className="text-xs font-mono font-extrabold px-3 py-1">
              Trình độ ước tính: {estimatedCEFR} (Estimated Level)
            </Badge>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <LingLingMascot state={mascotState} size={120} />
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Chuỗi học tập' : 'Learning Streak'}</span>
          <p className="text-xl font-display font-extrabold text-teal-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            {currentStreak} {isVi ? 'ngày' : 'days'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Thời gian tuần này' : 'Weekly Study'}</span>
          <p className="text-xl font-display font-extrabold text-indigo-300 flex items-center gap-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            {weeklyMinutes} {isVi ? 'phút' : 'mins'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Tổng thời gian học' : 'Total Study Time'}</span>
          <p className="text-xl font-display font-extrabold text-white">
            {totalStudyMinutes.toLocaleString()} {isVi ? 'phút' : 'mins'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
          <span className="text-[11px] text-slate-400 font-semibold">{isVi ? 'Tổng điểm tích lũy' : 'Total XP Earned'}</span>
          <p className="text-xl font-display font-extrabold text-amber-400 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            {totalXP.toLocaleString()} XP
          </p>
        </div>
      </div>
    </div>
  );
}
