'use client';

import React from 'react';
import { Target, ArrowUpRight, CheckCircle } from 'lucide-react';
import { ExamWeakness } from '@linguaflow/domain';

interface ExamWeaknessCardProps {
  weaknesses: ExamWeakness[];
  className?: string;
}

export default function ExamWeaknessCard({
  weaknesses,
  className = '',
}: ExamWeaknessCardProps) {
  if (!weaknesses || weaknesses.length === 0) {
    return (
      <div className={`p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex items-center gap-3 ${className}`}>
        <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <h4 className="font-display font-bold text-sm text-white">Xuất sắc! Không phát hiện điểm yếu rõ rệt.</h4>
          <p className="text-xs text-slate-400">Bạn đã hoàn thành chính xác hầu hết các dạng câu hỏi trong bài thi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-amber-400" />
        <h3 className="font-display font-bold text-lg text-white">
          Phân Tích Điểm Cần Cải Thiện ({weaknesses.length})
        </h3>
      </div>

      <div className="space-y-3">
        {weaknesses.map((w, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-sm text-amber-300">
                Dạng bài: {w.category}
              </span>
              <span className="text-xs text-rose-400 font-mono font-bold">
                Sai {w.errorCount}/{w.totalCount} câu ({w.accuracy}% đúng)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{w.recommendation}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
