'use client';

import React from 'react';
import { ReadingQuestion as IReadingQuestion } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';

interface ReadingQuestionProps {
  question: IReadingQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string;
  onSelectOption: (option: string) => void;
  disabled?: boolean;
}

export default function ReadingQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  disabled = false,
}: ReadingQuestionProps) {
  const typeLabels: Record<string, string> = {
    'multiple-choice': 'Trắc nghiệm lựa chọn',
    'true-false': 'Đúng / Sai (True/False)',
    'main-idea': 'Ý chính bài đọc',
    detail: 'Chi tiết bài đọc',
    'vocabulary-context': 'Từ vựng theo ngữ cảnh',
    inference: 'Suy luận logic',
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/20 backdrop-blur-2xl shadow-2xl space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
            Câu {questionNumber} / {totalQuestions}
          </Badge>
          <span className="text-xs font-semibold text-slate-400">
            • {typeLabels[question.type] || 'Đọc hiểu'}
          </span>
        </div>

        {question.relatedParagraph && (
          <span className="text-[11px] font-bold text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            Đoạn {question.relatedParagraph}
          </span>
        )}
      </div>

      {/* Question Text */}
      <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-snug">
        {question.question}
      </h2>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(option)}
              disabled={disabled}
              className={`w-full p-4 sm:p-5 rounded-2xl text-left font-sans text-sm sm:text-base font-semibold transition-all flex items-center justify-between border ${
                isSelected
                  ? 'bg-teal-500/20 text-teal-200 border-teal-400 shadow-md ring-1 ring-teal-400/30'
                  : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-900 text-slate-400 border-slate-750'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
