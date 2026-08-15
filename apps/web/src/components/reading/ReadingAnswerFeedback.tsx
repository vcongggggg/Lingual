'use client';

import React from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { ReadingAnswerFeedback as IReadingAnswerFeedback } from '@linguaflow/domain';

interface ReadingAnswerFeedbackProps {
  feedback: IReadingAnswerFeedback;
  className?: string;
}

export default function ReadingAnswerFeedback({
  feedback,
  className = '',
}: ReadingAnswerFeedbackProps) {
  return (
    <div
      className={`p-5 rounded-3xl border transition-all space-y-2.5 ${
        feedback.isCorrect
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-rose-500/10 border-rose-500/30'
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {feedback.isCorrect ? (
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Chính xác! (+Score)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-400 uppercase tracking-wider">
            <XCircle className="w-4 h-4" />
            <span>Chưa chính xác</span>
          </div>
        )}
      </div>

      {!feedback.isCorrect && (
        <p className="text-xs text-slate-300">
          <strong className="text-emerald-400 font-bold">Đáp án đúng:</strong> "{feedback.correctAnswer}"
        </p>
      )}

      <p className="text-xs text-slate-300 leading-relaxed pt-1">
        💡 <strong className="text-slate-200">Giải thích:</strong> {feedback.explanation}
      </p>

      {feedback.relatedParagraph && (
        <span className="text-[11px] text-teal-400 block font-semibold">
          📌 Tham chiếu: Đoạn văn số {feedback.relatedParagraph} trong bài đọc.
        </span>
      )}
    </div>
  );
}
