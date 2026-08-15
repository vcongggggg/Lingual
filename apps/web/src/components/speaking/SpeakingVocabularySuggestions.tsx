'use client';

import React from 'react';
import { SpeakingVocabularySuggestion } from '@linguaflow/domain';
import { Sparkles, BookmarkPlus, Check } from 'lucide-react';
import { Badge, Button } from '@linguaflow/ui';

interface SpeakingVocabularySuggestionsProps {
  suggestions: SpeakingVocabularySuggestion[];
  onSaveToSRS?: (word: string) => void;
  savedWords?: string[];
  locale?: string;
  className?: string;
}

export default function SpeakingVocabularySuggestions({
  suggestions,
  onSaveToSRS,
  savedWords = [],
  locale = 'vi',
  className = '',
}: SpeakingVocabularySuggestionsProps) {
  const isVi = locale === 'vi';

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{isVi ? 'Gợi ý nâng cấp từ vựng học thuật:' : 'Vocabulary Upgrades:'}</span>
        </h4>
        <span className="text-[11px] text-slate-500">Lưu vào thẻ SRS</span>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, idx) => {
          const isSaved = savedWords.includes(s.word);

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-sm text-white font-mono">{s.word}</span>
                  <Badge variant="teal" className="text-[10px] font-bold">
                    {s.level}
                  </Badge>
                  <span className="text-slate-400 italic">"{s.meaning}"</span>
                </div>

                {onSaveToSRS && (
                  <Button
                    variant={isSaved ? 'ghost' : 'secondary'}
                    size="sm"
                    onClick={() => !isSaved && onSaveToSRS(s.word)}
                    icon={isSaved ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    disabled={isSaved}
                  >
                    {isSaved ? (isVi ? 'Đã lưu' : 'Saved') : (isVi ? 'Lưu SRS' : 'Save')}
                  </Button>
                )}
              </div>

              <p className="text-slate-300 font-sans leading-relaxed">
                <strong className="text-teal-300">Lý do:</strong> {s.reason}
              </p>

              <p className="text-slate-400 font-sans italic bg-slate-900/60 p-2.5 rounded-xl">
                Example: "{s.example}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
