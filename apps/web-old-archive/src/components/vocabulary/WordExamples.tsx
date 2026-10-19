'use client';

import React from 'react';
import { BookOpen, Volume2 } from 'lucide-react';
import { VocabularyExample } from '@linguaflow/domain';
import { playWordPronunciation } from '@/lib/vocabulary/pronunciation';

interface WordExamplesProps {
  examples: VocabularyExample[];
  targetWord: string;
  className?: string;
}

export default function WordExamples({ examples, targetWord, className = '' }: WordExamplesProps) {
  const handlePlaySentence = (sentence: string) => {
    playWordPronunciation(sentence, 'US');
  };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
        <BookOpen className="w-4 h-4" />
        <span>Câu ví dụ thực tế trong ngữ cảnh</span>
      </div>

      <div className="space-y-3">
        {examples.map((example, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-teal-500/30 transition-colors space-y-2 group"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-semibold text-white leading-relaxed">
                🇬🇧 "{example.sentence}"
              </p>

              <button
                type="button"
                onClick={() => handlePlaySentence(example.sentence)}
                aria-label={`Nghe câu ví dụ: ${example.sentence}`}
                className="p-2 rounded-xl bg-slate-900 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-teal-300 transition-colors shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-medium text-teal-300/90 leading-relaxed">
              🇻🇳 {example.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
