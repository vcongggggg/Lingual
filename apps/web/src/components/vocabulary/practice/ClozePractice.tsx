'use client';

import React, { useState } from 'react';
import { Check, X, BookOpen } from 'lucide-react';
import { VocabularyPracticeQuestion } from '@linguaflow/domain';

interface ClozePracticeProps {
  question: VocabularyPracticeQuestion;
  onAnswer: (userAnswer: string) => void;
  disabled?: boolean;
}

export default function ClozePractice({
  question,
  onAnswer,
  disabled = false,
}: ClozePracticeProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (disabled || selectedOption) return;
    setSelectedOption(opt);
    onAnswer(opt);
  };

  return (
    <div className="space-y-6">
      {/* Cloze Sentence Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/20 text-center space-y-3 shadow-inner">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Điền từ thích hợp vào chỗ trống trong câu</span>
        </span>

        <p className="text-xl sm:text-2xl font-display font-semibold text-white leading-relaxed tracking-wide">
          "{question.clozeSentence || `I need to _____ this.`}"
        </p>
      </div>

      {/* 4 Word Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options?.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

          let btnStyles = 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-200';
          if (selectedOption) {
            if (isCorrect) {
              btnStyles = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/20';
            } else if (isSelected) {
              btnStyles = 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/20';
            } else {
              btnStyles = 'bg-slate-950/40 border-slate-850 text-slate-600 opacity-50';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || Boolean(selectedOption)}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-2xl border text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between gap-3 active:scale-98 ${btnStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>

              {selectedOption && isCorrect && (
                <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              )}
              {selectedOption && isSelected && !isCorrect && (
                <X className="w-5 h-5 text-rose-400 stroke-[3]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
