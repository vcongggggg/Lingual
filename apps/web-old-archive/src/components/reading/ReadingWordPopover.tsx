'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, X, Brain, Check, Sparkles, BookMarked } from 'lucide-react';
import { ReadingWordDefinition } from '@/lib/reading/extractReadingVocabulary';
import { addReadingWordToSRS } from '@/lib/reading/readingSrsAdapter';
import { Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface ReadingWordPopoverProps {
  definition: ReadingWordDefinition | null;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function ReadingWordPopover({
  definition,
  onClose,
  position,
}: ReadingWordPopoverProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSaved(false);
    setIsSaving(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [definition, onClose]);

  if (!definition) return null;

  const handleSpeak = (accent: 'US' | 'UK') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(definition.word);
      utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveToSRS = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    sfx.playCorrect();

    const success = await addReadingWordToSRS(definition);
    if (success) {
      setIsSaved(true);
    }
    setIsSaving(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Tra cứu từ vựng"
      className="fixed inset-x-4 bottom-4 sm:inset-auto sm:fixed z-50 sm:max-w-md w-full sm:w-80 p-5 rounded-3xl bg-slate-900/95 border border-teal-500/40 backdrop-blur-2xl shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150"
      style={
        position && typeof window !== 'undefined' && window.innerWidth >= 640
          ? {
              top: Math.min(position.top + 25, window.innerHeight - 280),
              left: Math.min(position.left - 40, window.innerWidth - 340),
            }
          : {}
      }
    >
      {/* Header (Word, Phonetic, Close) */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-xl text-white">
              {definition.word}
            </span>
            <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
              {definition.cefrLevel}
            </Badge>
          </div>
          <span className="text-xs font-mono text-teal-400 block font-semibold">
            {definition.phonetic} • <span className="text-slate-400 font-sans italic">{definition.partOfSpeech}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Đóng bảng tra từ"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Meaning & Example */}
      <div className="space-y-1.5 pt-1">
        <p className="text-xs font-semibold text-amber-300 leading-relaxed">
          {definition.meaning}
        </p>

        {definition.example && (
          <p className="text-[11px] text-slate-300 italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-850 leading-relaxed">
            "{definition.example}"
          </p>
        )}
      </div>

      {/* Action Buttons: Audio Pronunciation + Add to SRS */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSpeak('US')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
            title="Phát âm tiếng Anh - Mỹ"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            <span>US</span>
          </button>
          <button
            type="button"
            onClick={() => handleSpeak('UK')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
            title="Phát âm tiếng Anh - Anh"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>UK</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSaveToSRS}
          disabled={isSaved || isSaving}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isSaved
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-teal-300" />
              <span>Đã lưu SRS</span>
            </>
          ) : (
            <>
              <Brain className="w-3.5 h-3.5" />
              <span>Lưu vào SRS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
