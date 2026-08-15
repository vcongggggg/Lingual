'use client';

import React from 'react';
import { Flag, Bookmark, BookOpen, Volume2 } from 'lucide-react';
import { ExamQuestion } from '@linguaflow/domain';
import ExamAudioPlayer from './ExamAudioPlayer';
import { Badge } from '@linguaflow/ui';

interface ExamQuestionCardProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: string;
  isFlagged?: boolean;
  onSelectOption: (option: string) => void;
  onToggleFlag: () => void;
  className?: string;
}

export default function ExamQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption = '',
  isFlagged = false,
  onSelectOption,
  onToggleFlag,
  className = '',
}: ExamQuestionCardProps) {
  const isListening = question.type.includes('listening') || Boolean(question.audioUrl || question.audioText);
  const hasPassage = Boolean(question.passage);

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6 ${className}`}>
      {/* Question Header & Flag Action */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="teal" className="text-xs font-extrabold uppercase px-3 py-1">
            Câu {questionNumber} / {totalQuestions}
          </Badge>
          <span className="text-xs font-semibold text-slate-400">
            • {question.type}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            isFlagged
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
              : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-800'
          }`}
          title="Đánh dấu xem lại sau"
        >
          <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{isFlagged ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
        </button>
      </div>

      {/* Reading Passage if attached */}
      {hasPassage && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Đoạn văn bài đọc:</span>
          </div>
          <p className="text-sm text-slate-300 font-serif leading-relaxed whitespace-pre-line">
            {question.passage}
          </p>
        </div>
      )}

      {/* Listening Audio if attached */}
      {isListening && (
        <ExamAudioPlayer
          audioText={question.audioText}
          audioUrl={question.audioUrl}
          title={`Audio câu hỏi ${questionNumber}`}
        />
      )}

      {/* Question Prompt */}
      <h3 className="text-lg sm:text-xl font-display font-extrabold text-white leading-relaxed">
        {question.prompt}
      </h3>

      {/* Options Selection */}
      <div className="space-y-3 pt-1">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const letter = String.fromCharCode(65 + idx);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(opt)}
              className={`w-full p-4 sm:p-5 rounded-2xl text-left font-sans text-sm sm:text-base font-semibold transition-all flex items-center justify-between border ${
                isSelected
                  ? 'bg-teal-500/20 text-teal-200 border-teal-400 shadow-md ring-1 ring-teal-400/40'
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
                  {letter}
                </span>
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
