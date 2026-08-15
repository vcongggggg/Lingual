'use client';

import React from 'react';
import { Flag, Check } from 'lucide-react';
import { ExamQuestion } from '@linguaflow/domain';

interface ExamQuestionNavigatorProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  flags: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  className?: string;
}

export default function ExamQuestionNavigator({
  questions,
  currentIndex,
  answers,
  flags,
  onSelectQuestion,
  className = '',
}: ExamQuestionNavigatorProps) {
  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k].trim() !== '').length;
  const flaggedCount = Object.keys(flags).filter((k) => flags[k]).length;

  return (
    <div className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      {/* Header Stats */}
      <div className="space-y-1">
        <h4 className="font-display font-bold text-sm text-white">Danh sách câu hỏi</h4>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>
            Đã làm: <strong className="text-teal-400 font-mono">{answeredCount}</strong>/{questions.length}
          </span>
          {flaggedCount > 0 && (
            <span>
              • Đánh dấu: <strong className="text-amber-400 font-mono">{flaggedCount}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Question Palette Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = Boolean(answers[q.id] && answers[q.id].trim() !== '');
          const isFlagged = Boolean(flags[q.id]);

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center border ${
                isCurrent
                  ? 'bg-teal-500 text-slate-950 border-teal-400 ring-2 ring-teal-400/40 shadow-md font-extrabold'
                  : isAnswered
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-850'
              }`}
              title={`Câu ${idx + 1} ${isAnswered ? '(Đã trả lời)' : '(Chưa làm)'}`}
            >
              <span>{idx + 1}</span>

              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-850 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-teal-500/30 border border-teal-500/50" />
          <span>Đã làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-slate-950 border border-slate-800" />
          <span>Chưa làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-amber-400" />
          <span>Đã đánh dấu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-teal-500" />
          <span>Đang chọn</span>
        </div>
      </div>
    </div>
  );
}
