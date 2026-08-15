'use client';

import React from 'react';
import { Search, Sparkles, BookOpen } from 'lucide-react';
import { VocabularyWord } from '@linguaflow/domain';
import VocabularyCard from './VocabularyCard';
import { EmptyState, Button } from '@linguaflow/ui';

interface VocabularyListProps {
  words: VocabularyWord[];
  savedMap?: Record<string, boolean>;
  folderMap?: Record<string, string[]>;
  locale: string;
  onSaveToggle?: (wordId: string, saved: boolean) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export default function VocabularyList({
  words,
  savedMap = {},
  folderMap = {},
  locale,
  onSaveToggle,
  loading = false,
  emptyTitle = 'Không tìm thấy từ vựng',
  emptyDescription = 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc cấp độ.',
  className = '',
}: VocabularyListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="w-16 h-6 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-slate-800 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="w-32 h-7 bg-slate-800 rounded-xl" />
              <div className="w-24 h-4 bg-slate-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Search className="w-8 h-8" />}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {words.map((word) => (
        <VocabularyCard
          key={word.id}
          word={word}
          isSaved={savedMap[word.id] ?? false}
          folderIds={folderMap[word.id] ?? []}
          locale={locale}
          onSaveToggle={(saved) => onSaveToggle?.(word.id, saved)}
        />
      ))}
    </div>
  );
}
