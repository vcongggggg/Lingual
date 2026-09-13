'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Bot, Brain, Trophy, Flame, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
      className={`relative overflow-hidden rounded-3xl bg-slate-950 border border-teal-500/30 p-6 sm:p-10 shadow-2xl min-h-[300px] flex items-center ${className}`}
    >
      {/* Full-Bleed 3D Mascot Artwork Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dashboard/hero_study_mascot.jpg"
          alt="LingLing AI Tutor"
          fill
          priority
          className="object-cover object-right md:object-[78%_center] brightness-105 contrast-105"
        />
        {/* Directional Glass Gradients: Dark on left text side, clear on right mascot side */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
        <div className="space-y-3.5 text-center md:text-left max-w-2xl">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md">
              <Bot className="w-3.5 h-3.5 text-teal-300" />
              <span>{isVi ? 'Gia Sư Trí Tuệ Nhân Tạo' : 'Personal AI Tutor'}</span>
            </div>

            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 font-mono flex items-center gap-1 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>{isVi ? 'Bảo mật riêng tư 100%' : 'Privacy-First'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight leading-tight drop-shadow-md">
            {isVi ? 'Học Tiếng Anh Thông Minh Cùng LingLing' : 'Master English With Adaptive Guidance'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-sans leading-relaxed drop-shadow-sm">
            {isVi
              ? 'Phân tích điểm mạnh, điểm yếu từ bài làm của bạn để giải thích ngữ pháp, gợi ý lộ trình và sinh bài luyện tập thích ứng theo thời gian thực.'
              : 'Analyzes your strengths & weaknesses across all skills to explain errors, craft adaptive plans, and deliver tailored micro-drills.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <Link href={`/${locale}/tutor/plan`}>
              <button className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-400/25 transition-all hover:scale-[1.02] cursor-pointer">
                <Brain className="w-4 h-4 text-slate-950" />
                <span>{isVi ? 'Lộ Trình Học Hôm Nay' : "Today's Plan"}</span>
              </button>
            </Link>

            <Link href={`/${locale}/tutor/dashboard`}>
              <button className="px-4 py-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900/90 border border-white/10 hover:border-teal-400/40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer">
                <span>{isVi ? 'Bảng Điều Khiển Năng Lực' : 'Tutor Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </button>
            </Link>
          </div>
        </div>

        {/* Floating Frosted Glass Quick Metrics */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono p-3 rounded-3xl bg-slate-950/75 border border-teal-500/30 backdrop-blur-md shadow-2xl">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-teal-500/20">
              <span className="text-[10px] text-slate-400 block font-sans">{isVi ? 'Trình độ' : 'Level'}</span>
              <span className="text-base font-black text-teal-300">{cefrEstimate}</span>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-sans">{isVi ? 'Điểm TB' : 'Score'}</span>
              <span className="text-base font-black text-white">{overallScore}%</span>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block font-sans">{isVi ? 'Từ cần ôn' : 'Due Cards'}</span>
              <span className="text-base font-black text-amber-400">{srsDueCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

