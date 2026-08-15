'use client';

import React, { useState } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { VocabularyPracticeQuestion } from '@linguaflow/domain';

interface RecognitionPracticeProps {
  question: VocabularyPracticeQuestion;
  onAnswer: (userAnswer: string) => void;
  disabled?: boolean;
}

export default function RecognitionPractice({
  question,
  onAnswer,
  disabled = false,
}: RecognitionPracticeProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (disabled || selectedOption) return;
    setSelectedOption(opt);
    onAnswer(opt);
  };

  return (
    <div className="space-y-6">
      {/* Recognition Prompt Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/20 text-center space-y-3 shadow-inner">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
          Chọn từ tiếng Anh tương ứng
        </span>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-amber-300 tracking-tight">
          "{question.prompt.replace(/^.*?"(.*?)"\s*là:?$/, '$1') || question.prompt}"
        </h2>
      </div>

      {/* 4 English Word Options */}
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
                <span className="font-display font-extrabold text-base sm:text-lg">{opt}</span>
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
