'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Filter } from 'lucide-react';
import { ExamQuestionResult } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';

interface ExamQuestionReviewProps {
  questionResults: ExamQuestionResult[];
  className?: string;
}

export default function ExamQuestionReview({
  questionResults,
  className = '',
}: ExamQuestionReviewProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong' | 'correct'>('all');

  const filtered = questionResults.filter((q) => {
    if (filterMode === 'wrong') return !q.isCorrect;
    if (filterMode === 'correct') return q.isCorrect;
    return true;
  });

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-display font-bold text-lg text-white">
          Xem Lại Chi Tiết Từng Câu Hỏi ({questionResults.length})
        </h3>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({questionResults.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('wrong')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'wrong' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Câu sai ({questionResults.filter((q) => !q.isCorrect).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('correct')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'correct' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Câu đúng ({questionResults.filter((q) => q.isCorrect).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div
            key={q.questionId}
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              q.isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {q.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className="font-display font-extrabold text-sm text-white">
                  Câu hỏi: {q.prompt}
                </span>
              </div>
              <Badge variant={q.isCorrect ? 'emerald' : 'coral'} className="text-[10px] font-bold">
                {q.isCorrect ? 'Đúng (+1đ)' : 'Sai (0đ)'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-slate-400 block text-[11px]">Đáp án của bạn:</span>
                <strong className={q.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                  {q.isUnanswered ? 'Chưa trả lời' : q.selectedOption}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
                <span className="text-slate-400 block text-[11px]">Đáp án chính xác:</span>
                <strong className="text-emerald-300">{q.correctAnswer}</strong>
              </div>
            </div>

            {q.explanation && (
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                💡 <strong className="text-slate-200">Giải thích:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
