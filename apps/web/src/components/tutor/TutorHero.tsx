'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Bot, Brain, Trophy, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import LingLingMascot from '@/components/LingLingMascot';
import { Button, Badge } from '@linguaflow/ui';

interface TutorHeroProps {
  cefrEstimate?: string;
  overallScore?: number;
  currentStreak?: number;
  srsDueCount?: number;
  locale?: string;
  className?: string;
}

export default function TutorHero({
  cefrEstimate = 'B2',
  overallScore = 78,
  currentStreak = 5,
  srsDueCount = 14,
  locale = 'vi',
  className = '',
}: TutorHeroProps) {
  const isVi = locale === 'vi';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-950 border border-teal-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl ${className}`}
    >
      {/* Background glowing orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <Badge variant="teal" className="text-xs font-mono font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              <span>{isVi ? 'Gia Sư Trí Tuệ Nhân Tạo' : 'Personal AI Tutor'}</span>
            </Badge>

            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>{isVi ? 'Bảo mật riêng tư 100%' : 'Privacy-First'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
            {isVi ? 'Học Tiếng Anh Thông Minh Cùng LingLing' : 'Master English With Adaptive Guidance'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans leading-relaxed">
            {isVi
              ? 'Phân tích điểm mạnh, điểm yếu từ bài làm của bạn để giải thích ngữ pháp, gợi ý lộ trình và sinh bài luyện tập thích ứng theo thời gian thực.'
              : 'Analyzes your strengths & weaknesses across all skills to explain errors, craft adaptive plans, and deliver tailored micro-drills.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <Link href={`/${locale}/tutor/plan`}>
              <Button variant="primary" size="sm" icon={<Brain className="w-3.5 h-3.5" />}>
                {isVi ? 'Lộ Trình Học Hôm Nay' : "Today's Plan"}
              </Button>
            </Link>

            <Link href={`/${locale}/tutor/dashboard`}>
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                {isVi ? 'Bảng Điều Khiển Năng Lực' : 'Tutor Dashboard'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mascot & Quick Metrics */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <LingLingMascot state="thinking" size={105} />

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{isVi ? 'Trình độ' : 'Level'}</span>
              <span className="font-bold text-teal-300">{cefrEstimate}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{isVi ? 'Điểm TB' : 'Score'}</span>
              <span className="font-bold text-white">{overallScore}%</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{isVi ? 'SRS cần ôn' : 'SRS Due'}</span>
              <span className="font-bold text-amber-400">{srsDueCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
