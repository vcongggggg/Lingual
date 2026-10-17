'use client';

import React from 'react';
import Image from 'next/image';
import { BookOpen, Sparkles, Zap, Gauge, BookMarked } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface ReadingHeroProps {
  locale?: string;
}

export default function ReadingHero({ locale = 'vi' }: ReadingHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-teal-500/30 p-6 sm:p-10 shadow-2xl min-h-[300px] flex items-center">
      {/* Full-Bleed 3D Mascot Artwork Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ielts/mascot_ielts_reading.jpg"
          alt="LingLing Reading Lab"
          fill
          priority
          className="object-cover object-right md:object-[75%_center] brightness-105 contrast-105"
        />
        {/* Directional Glass Gradients: Deep dark on text side, crystal clear on mascot side */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-teal-300" />
              <span>Editorial Reading Lab • The Economist Style</span>
            </div>

            {/* Live WPM Speedometer */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-400/30 text-xs font-mono font-bold text-amber-300 shadow-sm backdrop-blur-md">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>Tốc độ đọc mục tiêu: <strong className="text-amber-300">220 WPM</strong></span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight drop-shadow-md">
            Read. Comprehend. <br />
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              Think In English.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-xl drop-shadow-sm">
            Kho bài đọc song ngữ phân tầng theo 6 cấp độ CEFR (A1–C1), tích hợp tra cứu 1-chạm Magic Peek, lưu thẻ nhớ Spaced Repetition và hệ thống câu hỏi đọc hiểu chuyên sâu kèm dẫn chứng dòng.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/70 border border-teal-500/30 text-xs text-teal-300 font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dịch song ngữ tức thì</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/70 border border-amber-500/30 text-xs text-amber-300 font-bold backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Đo lường WPM thời gian thực</span>
            </div>
          </div>
        </div>

        {/* Floating Mascot Badge in Top Right of Card */}
        <div className="hidden lg:flex flex-col items-center gap-2 self-end p-4 rounded-3xl bg-slate-950/70 border border-teal-500/30 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">LingLing Reading Club</span>
          </div>
          <span className="text-[11px] text-teal-300 font-mono">Đồng hành đọc hiểu 24/7</span>
        </div>
      </div>
    </div>
  );
}

