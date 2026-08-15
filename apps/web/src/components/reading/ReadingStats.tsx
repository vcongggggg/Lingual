'use client';

import React from 'react';
import { BookOpen, Clock, Award, Sparkles, Flame } from 'lucide-react';
import { ReadingStats as IReadingStats } from '@linguaflow/domain';

interface ReadingStatsProps {
  stats: IReadingStats;
}

export default function ReadingStats({ stats }: ReadingStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-teal-500/20 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Chuỗi đọc bài</span>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
          {stats.readingStreakDays} ngày
        </p>
        <span className="text-[11px] text-slate-500">Duy trì phản xạ đọc mỗi ngày</span>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Bài đọc hoàn thành</span>
          <BookOpen className="w-4 h-4 text-teal-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          {stats.articlesCompleted} bài
        </p>
        <span className="text-[11px] text-slate-500">Đã đọc & luyện đọc hiểu</span>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Độ chính xác đọc hiểu</span>
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
          {stats.avgComprehension}%
        </p>
        <span className="text-[11px] text-slate-500">Trung bình các bài trắc nghiệm</span>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Từ vựng đã học</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-purple-300">
          {stats.wordsLearned} từ
        </p>
        <span className="text-[11px] text-slate-500">Đã lưu & chuyển vào thẻ SRS</span>
      </div>
    </div>
  );
}
