'use client';

import React from 'react';
import { BookOpen, Sparkles, Compass } from 'lucide-react';
import LingLingMascot from '../LingLingMascot';
import { Badge } from '@linguaflow/ui';

interface ReadingHeroProps {
  locale?: string;
}

export default function ReadingHero({ locale = 'vi' }: ReadingHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/20 p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Reading Lab • Phòng Luyện Đọc Tiếng Anh</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Read. Understand. <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              Think In English.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Khám phá kho bài đọc song ngữ phân tầng theo chuẩn CEFR (A1–C1), tra cứu từ vựng tức thì 1-chạm, lưu thẻ nhớ Spaced Repetition và làm bài tập trắc nghiệm đọc hiểu chuyên sâu.
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <LingLingMascot state="thinking" size={120} />
        </div>
      </div>
    </div>
  );
}
