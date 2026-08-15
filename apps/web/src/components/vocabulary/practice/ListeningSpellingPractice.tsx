'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Send, Check, X, RotateCcw } from 'lucide-react';
import { VocabularyPracticeQuestion } from '@linguaflow/domain';
import { playWordPronunciation } from '@/lib/vocabulary/pronunciation';
import { Button } from '@linguaflow/ui';

interface ListeningSpellingPracticeProps {
  question: VocabularyPracticeQuestion;
  onAnswer: (userAnswer: string) => void;
  disabled?: boolean;
}

export default function ListeningSpellingPractice({
  question,
  onAnswer,
  disabled = false,
}: ListeningSpellingPracticeProps) {
  const [inputVal, setInputVal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputVal('');
    setSubmitted(false);
    playAudio();

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, [question.id]);

  const playAudio = () => {
    playWordPronunciation(question.targetWord, 'US');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || submitted || disabled) return;

    setSubmitted(true);
    onAnswer(inputVal.trim());
  };

  const isCorrect = submitted && inputVal.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

  return (
    <div className="space-y-6">
      {/* Audio Playback Hero Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/20 text-center space-y-4 shadow-inner">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
          Nghe phát âm và gõ lại từ tiếng Anh chính xác
        </span>

        <div className="flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={playAudio}
            aria-label="Phát âm từ vựng"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/30 active:scale-95 transition-all"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <span className="text-xs text-slate-400">Chạm để nghe lại phát âm</span>
        </div>

        {question.subPrompt && (
          <p className="text-xs font-medium text-amber-300/80 bg-slate-900/80 px-3 py-1.5 rounded-xl inline-block border border-slate-800">
            {question.subPrompt}
          </p>
        )}
      </div>

      {/* Input Arena */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={submitted || disabled}
            placeholder="Nhập từ bạn nghe được..."
            className={`w-full px-5 py-4 rounded-2xl bg-slate-900/90 border font-display font-extrabold text-xl text-center tracking-wider transition-all placeholder:text-slate-600 focus:outline-none ${
              submitted
                ? isCorrect
                  ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/20'
                  : 'border-rose-500/50 text-rose-300 bg-rose-950/20'
                : 'border-slate-800 text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20'
            }`}
          />

          {submitted && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
              ) : (
                <X className="w-6 h-6 text-rose-400 stroke-[3]" />
              )}
            </div>
          )}
        </div>

        {!submitted && (
          <Button
            variant="primary"
            type="submit"
            className="w-full py-3.5"
            disabled={!inputVal.trim()}
            icon={<Send className="w-4 h-4" />}
          >
            Kiểm tra đáp án
          </Button>
        )}
      </form>
    </div>
  );
}
