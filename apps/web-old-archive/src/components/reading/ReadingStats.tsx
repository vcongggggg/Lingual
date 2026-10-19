'use client';

import React from 'react';
import { BookOpen, Clock, Award, Sparkles, Flame } from 'lucide-react';
import { ReadingStats as IReadingStats } from '@linguaflow/domain';

interface ReadingStatsProps {
  stats: IReadingStats;
}

export default function ReadingStats({ stats }: ReadingStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/85 border border-amber-500/30 hover:border-amber-400/60 backdrop-blur-xl shadow-xl space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Chuỗi đọc bài</span>
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-black text-amber-400">
          {stats.readingStreakDays} ngày
        </p>
        <span className="text-[11px] text-slate-400 font-medium">Duy trì phản xạ đọc mỗi ngày</span>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/85 border border-teal-500/30 hover:border-teal-400/60 backdrop-blur-xl shadow-xl space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Bài đọc hoàn thành</span>
          <BookOpen className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-black text-white">
          {stats.articlesCompleted} bài
        </p>
        <span className="text-[11px] text-slate-400 font-medium">Đã đọc & luyện đọc hiểu</span>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/85 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-xl shadow-xl space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Độ chính xác đọc hiểu</span>
          <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
          {stats.avgComprehension}%
        </p>
        <span className="text-[11px] text-slate-400 font-medium">Trung bình các bài trắc nghiệm</span>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/85 border border-purple-500/30 hover:border-purple-400/60 backdrop-blur-xl shadow-xl space-y-1.5 transition-all duration-300 hover:-translate-y-0.5 group">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
          <span>Từ vựng đã học</span>
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-2xl sm:text-3xl font-display font-black text-purple-300">
          {stats.wordsLearned} từ
        </p>
        <span className="text-[11px] text-slate-400 font-medium">Đã lưu & chuyển vào thẻ SRS</span>
      </div>
    </div>
  );
}
