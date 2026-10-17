'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Award, Sparkles, ArrowRight, History } from 'lucide-react';
import { ReadingAttempt } from '@linguaflow/domain';
import { Card, Badge } from '@linguaflow/ui';

interface ReadingHistoryProps {
  history: ReadingAttempt[];
  locale: string;
}

export default function ReadingHistory({ history, locale }: ReadingHistoryProps) {
  const [filterMode, setFilterMode] = useState<string>('all');

  const filtered = history.filter((item) =>
    filterMode === 'all' ? true : item.mode === filterMode
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            Lịch Sử Luyện Đọc ({history.length})
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          {['all', 'standard', 'challenge', 'guided'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                filterMode === mode
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'all' ? 'Tất cả' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Chưa có bài đọc nào trong lịch sử.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((attempt) => (
            <div
              key={attempt.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
                    {attempt.mode}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(attempt.completedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h4 className="font-display font-bold text-base text-white">
                  Mã bài: {attempt.articleId}
                </h4>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <span className="text-emerald-400 font-bold">Điểm: {attempt.score}%</span>
                  <span>•</span>
                  <span>Tốc độ: {attempt.wpm} WPM</span>
                  <span>•</span>
                  <span className="text-amber-400 font-mono font-bold">+{attempt.xpAwarded} XP</span>
                </div>
              </div>

              <Link
                href={`/${locale}/reading/${attempt.articleId}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Đọc lại</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
