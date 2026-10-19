'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, Sparkles, FolderPlus, ArrowRight, Brain } from 'lucide-react';
import { VocabularyWord } from '@linguaflow/domain';
import { Badge, Card, useMotionAccessibility } from '@linguaflow/ui';
import WordPronunciation from './WordPronunciation';
import SaveVocabularyButton from './SaveVocabularyButton';
import VocabularyFolderSelector from './VocabularyFolderSelector';

interface VocabularyCardProps {
  word: VocabularyWord;
  isSaved?: boolean;
  folderIds?: string[];
  inSrs?: boolean;
  locale: string;
  onSaveToggle?: (saved: boolean) => void;
  className?: string;
}

export default function VocabularyCard({
  word,
  isSaved = false,
  folderIds = [],
  inSrs = false,
  locale,
  onSaveToggle,
  className = '',
}: VocabularyCardProps) {
  const { shouldReduceMotion } = useMotionAccessibility();
  const [folderSelectorOpen, setFolderSelectorOpen] = useState(false);
  const [activeFolderIds, setActiveFolderIds] = useState<string[]>(folderIds);

  const diffColor =
    word.cefrLevel === 'A1'
      ? 'emerald'
      : word.cefrLevel === 'A2'
      ? 'teal'
      : word.cefrLevel === 'B1'
      ? 'amber'
      : 'coral';

  return (
    <>
      <Card
        glow="teal"
        className={`flex flex-col justify-between space-y-4 hover:border-teal-400/40 transition-all group ${className}`}
      >
        {/* Header (CEFR, Part of Speech, Save Button) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={diffColor} className="font-extrabold uppercase">
              {word.cefrLevel}
            </Badge>
            <span className="text-[11px] font-semibold text-slate-400 capitalize px-2 py-0.5 bg-slate-800 rounded-md">
              {word.partOfSpeech}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFolderSelectorOpen(true);
              }}
              title="Phân loại vào thư mục"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-teal-300 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            <SaveVocabularyButton
              wordId={word.id}
              targetText={word.targetText}
              translation={word.translation}
              phonetic={word.phoneticUs}
              cefrLevel={word.cefrLevel}
              isSaved={isSaved}
              onToggle={onSaveToggle}
              size="sm"
            />
          </div>
        </div>

        {/* Word Title & Meaning */}
        <Link href={`/${locale}/vocabulary/${word.id}`} className="space-y-1 block group-hover:text-teal-300">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight group-hover:text-teal-300 transition-colors">
            {word.targetText}
          </h3>
          <p className="text-sm font-semibold text-amber-300/90 line-clamp-1">
            {word.translation}
          </p>
        </Link>

        {/* Audio triggers (US & UK) */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <WordPronunciation
            targetText={word.targetText}
            phoneticUs={word.phoneticUs}
            phoneticUk={word.phoneticUk}
            size="sm"
          />

          <Link
            href={`/${locale}/vocabulary/${word.id}`}
            aria-label={`Xem chi tiết từ ${word.targetText}`}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-teal-500/20 transition-all group-hover:translate-x-1"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      {/* Folder Assignment Modal */}
      <VocabularyFolderSelector
        wordId={word.id}
        isOpen={folderSelectorOpen}
        onClose={() => setFolderSelectorOpen(false)}
        currentFolderIds={activeFolderIds}
        onFoldersUpdated={(updated) => setActiveFolderIds(updated)}
      />
    </>
  );
}
