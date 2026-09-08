'use client';

import React from 'react';
import { BookOpen, Sparkles, Compass, Zap, Gauge, Flame } from 'lucide-react';
import LingLingMascot from '../LingLingMascot';
import { Badge } from '@linguaflow/ui';
import { soundFx } from '@/lib/soundFx';

interface ReadingHeroProps {
  locale?: string;
}

export default function ReadingHero({ locale = 'vi' }: ReadingHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-teal-950/50 border border-teal-500/30 p-6 sm:p-10 shadow-2xl space-y-6 before:absolute before:inset-0 before:bg-gradient-to-r before:from-teal-500/10 before:via-emerald-500/10 before:to-indigo-500/10 before:animate-pulse before:pointer-events-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Editorial Reading Lab • The Economist Style</span>
            </div>

            {/* Live WPM Speedometer */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-amber-300 shadow-sm">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>Tốc độ đọc mục tiêu: <strong>220 WPM</strong></span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Read. Comprehend. <br />
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              Think In English.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Kho bài đọc song ngữ phân tầng theo 6 cấp độ CEFR (A1–C1), tích hợp tra cứu 1-chạm Magic Peek, lưu thẻ nhớ Spaced Repetition và hệ thống câu hỏi đọc hiểu chuyên sâu kèm dẫn chứng dòng.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-teal-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dịch song ngữ tức thì</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Đo lường WPM thời gian thực</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center relative">
          <div className="absolute w-44 h-44 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 p-3 rounded-full bg-slate-950/80 border border-teal-500/30 shadow-2xl">
            <LingLingMascot state="thinking" size={120} />
          </div>
          <span className="mt-2 text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
            LingLing Reading Club
          </span>
        </div>
      </div>
    </div>
  );
}
