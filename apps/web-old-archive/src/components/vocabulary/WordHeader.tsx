'use client';

import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { VocabularyWord } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';
import WordPronunciation from './WordPronunciation';
import SaveVocabularyButton from './SaveVocabularyButton';

interface WordHeaderProps {
  word: VocabularyWord;
  isSaved?: boolean;
  onSaveToggle?: (saved: boolean) => void;
  className?: string;
}

export default function WordHeader({
  word,
  isSaved = false,
  onSaveToggle,
  className = '',
}: WordHeaderProps) {
  const diffColor =
    word.cefrLevel === 'A1'
      ? 'emerald'
      : word.cefrLevel === 'A2'
      ? 'teal'
      : word.cefrLevel === 'B1'
      ? 'amber'
      : 'coral';

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant={diffColor} className="font-extrabold uppercase tracking-wider">
              {word.cefrLevel}
            </Badge>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 capitalize">
              {word.partOfSpeech}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              • {word.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {word.targetText}
          </h1>
        </div>

        <SaveVocabularyButton
          wordId={word.id}
          targetText={word.targetText}
          translation={word.translation}
          phonetic={word.phoneticUs}
          cefrLevel={word.cefrLevel}
          isSaved={isSaved}
          onToggle={onSaveToggle}
          size="lg"
        />
      </div>

      {/* Pronunciation audio triggers (US & UK) */}
      <WordPronunciation
        targetText={word.targetText}
        phoneticUs={word.phoneticUs}
        phoneticUk={word.phoneticUk}
        size="lg"
      />
    </div>
  );
}
