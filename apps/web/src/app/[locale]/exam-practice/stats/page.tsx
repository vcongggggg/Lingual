'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Trophy, Target, Clock, Award, Sparkles, TrendingUp } from 'lucide-react';
import { examsApi } from '@/lib/exams/api';
import { Badge, ProgressBar } from '@linguaflow/ui';

export default function ExamStatsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [stats, setStats] = useState({
    totalAttempts: 1,
    avgScore: 7,
    bestScore: 7,
    avgAccuracy: 100,
    totalStudyMinutes: 20,
    strongestSection: 'Reading Comprehension (Part 5 & 7)',
    weakestSection: 'Listening Comprehension (Part 1 & 2)',
    scoreHistory: [
      { date: '2026-08-15', score: 7, examTitle: 'TOEIC Official Format Mock Test 01' },
    ],
  });

  useEffect(() => {
    examsApi
      .getExamStats()
      .then((res: any) => {
        if (res?.stats) setStats(res.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/exam-practice`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Exam Practice Lab</span>
      </Link>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-400" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Phân Tích Năng Lực Thi Thử
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Tổng hợp hiệu suất làm bài và phân tích kỹ năng mạnh/yếu
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-teal-500/20 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Tổng lượt thi</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {stats.totalAttempts}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Độ chính xác TB</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
            {stats.avgAccuracy}%
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Thời gian làm bài</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-teal-400">
            {stats.totalStudyMinutes} phút
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-1">
          <span className="text-slate-400 text-xs font-semibold">Điểm cao nhất</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
            {stats.bestScore}
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Kỹ Năng Mạnh Nhất
          </span>
          <h3 className="font-display font-bold text-base text-white">
            {stats.strongestSection}
          </h3>
          <p className="text-xs text-slate-300">
            Bạn duy trì tỷ lệ chính xác cao trên các câu hỏi phần này.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Kỹ Năng Cần Cải Thiện
          </span>
          <h3 className="font-display font-bold text-base text-white">
            {stats.weakestSection}
          </h3>
          <p className="text-xs text-slate-300">
            Nên luyện thêm nghe kết hợp dictation để bứt phá band điểm.
          </p>
        </div>
      </div>
    </main>
  );
}
