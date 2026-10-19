'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Clock, CheckCircle2, Brain, Sparkles, Gamepad2 } from 'lucide-react';
import { Button } from '@linguaflow/ui';

interface VocabularyStatsProps {
  savedCount: number;
  dueTodayCount: number;
  masteredCount: number;
  learningCount: number;
  locale: string;
  className?: string;
}

export default function VocabularyStats({
  savedCount,
  dueTodayCount,
  masteredCount,
  learningCount,
  locale,
  className = '',
}: VocabularyStatsProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}>
      {/* Saved Words Metric */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Từ đã lưu</span>
          <Bookmark className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          {savedCount}
        </p>
        <span className="text-[11px] text-slate-500">Trong sổ từ vựng cá nhân</span>
      </div>

      {/* Due Today Metric */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-teal-500/20 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Cần ôn hôm nay</span>
          <Clock className="w-4 h-4 text-teal-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-teal-400">
          {dueTodayCount}
        </p>
        <span className="text-[11px] text-slate-500">Đến hạn Spaced Repetition</span>
      </div>

      {/* Mastered Metric */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Đã thành thục</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
          {masteredCount}
        </p>
        <span className="text-[11px] text-slate-500">Thuộc trên 3 chu kỳ lặp</span>
      </div>

      {/* Learning Metric */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Đang rèn luyện</span>
          <Brain className="w-4 h-4 text-purple-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-purple-300">
          {learningCount}
        </p>
        <span className="text-[11px] text-slate-500">Đang trong tiến trình học</span>
      </div>
    </div>
  );
}
