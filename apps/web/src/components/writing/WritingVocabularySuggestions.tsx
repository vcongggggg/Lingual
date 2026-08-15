'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, Check, Plus, BookMarked } from 'lucide-react';
import { WritingVocabularySuggestion } from '@linguaflow/domain';
import { addWritingVocabularyToSRS } from '@/lib/writing/writingSrsAdapter';
import { Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface WritingVocabularySuggestionsProps {
  suggestions: WritingVocabularySuggestion[];
  className?: string;
}

export default function WritingVocabularySuggestions({
  suggestions,
  className = '',
}: WritingVocabularySuggestionsProps) {
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const handleSaveToSRS = async (sug: WritingVocabularySuggestion) => {
    if (savedMap[sug.word] || loadingMap[sug.word]) return;

    setLoadingMap((prev) => ({ ...prev, [sug.word]: true }));
    sfx.playCorrect();

    const success = await addWritingVocabularyToSRS(sug);
    if (success) {
      setSavedMap((prev) => ({ ...prev, [sug.word]: true }));
    }
    setLoadingMap((prev) => ({ ...prev, [sug.word]: false }));
  };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Gợi ý nâng cấp từ vựng & Thêm vào thẻ SRS ({suggestions.length})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((sug, idx) => {
          const isSaved = savedMap[sug.word];
          const isLoading = loadingMap[sug.word];

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-teal-500/30 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-lg text-white">
                      {sug.word}
                    </span>
                    <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
                      {sug.difficulty}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs font-semibold text-amber-300">
                  {sug.meaning}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 {sug.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveToSRS(sug)}
                  disabled={isSaved || isLoading}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-slate-800 hover:bg-teal-500/20 hover:text-teal-300 border border-slate-700 text-slate-300'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                      <span>Đã lưu vào SRS</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-3.5 h-3.5 text-teal-400" />
                      <span>Lưu vào SRS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
