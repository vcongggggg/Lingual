'use client';

import React, { useState } from 'react';
import { Bookmark, Check, Sparkles } from 'lucide-react';
import { vocabularyApi } from '@/lib/api';
import { sfx } from '@/lib/soundEffects';

interface SaveVocabularyButtonProps {
  wordId: string;
  targetText?: string;
  translation?: string;
  phonetic?: string;
  cefrLevel?: string;
  isSaved?: boolean;
  onToggle?: (saved: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SaveVocabularyButton({
  wordId,
  targetText,
  translation,
  phonetic,
  cefrLevel,
  isSaved = false,
  onToggle,
  className = '',
  size = 'md',
}: SaveVocabularyButtonProps) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      if (nextSaved) {
        sfx.playCorrect();
      }
      await vocabularyApi.saveWord({
        wordId,
        targetText,
        translation,
        phonetic,
        cefrLevel,
      });
      onToggle?.(nextSaved);
    } catch {
      // Revert if API fails
      setSaved(saved);
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 sm:px-3 sm:py-2 text-xs gap-1.5',
    lg: 'px-4 py-2.5 text-sm gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={saved ? 'Bỏ lưu từ vựng' : 'Lưu từ vựng vào danh sách cá nhân'}
      className={`rounded-xl font-bold transition-all flex items-center justify-center select-none active:scale-90 ${sizes[size]} ${
        saved
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
          : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-white'
      } ${className}`}
    >
      <Bookmark
        className={`w-4 h-4 transition-transform ${
          saved ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-400'
        }`}
      />
      {size !== 'sm' && (
        <span className="hidden sm:inline">
          {saved ? 'Đã lưu' : 'Lưu từ'}
        </span>
      )}
    </button>
  );
}
