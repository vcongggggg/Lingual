'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, Check, Volume2 } from 'lucide-react';
import { ReadingWordDefinition } from '@/lib/reading/extractReadingVocabulary';
import { addReadingWordToSRS } from '@/lib/reading/readingSrsAdapter';
import { Badge, Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface ReadingVocabularyPanelProps {
  vocabulary: ReadingWordDefinition[];
  className?: string;
}

export default function ReadingVocabularyPanel({
  vocabulary,
  className = '',
}: ReadingVocabularyPanelProps) {
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [savingAll, setSavingAll] = useState(false);

  if (!vocabulary || vocabulary.length === 0) return null;

  const handleSaveWord = async (wordDef: ReadingWordDefinition) => {
    if (savedMap[wordDef.word]) return;
    sfx.playCorrect();
    const success = await addReadingWordToSRS(wordDef);
    if (success) {
      setSavedMap((prev) => ({ ...prev, [wordDef.word]: true }));
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    sfx.playVictory();

    for (const item of vocabulary) {
      await addReadingWordToSRS(item);
      setSavedMap((prev) => ({ ...prev, [item.word]: true }));
    }

    setSavingAll(false);
  };

  return (
    <div className={`p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-display font-bold text-lg text-white">
            Từ Vựng Trọng Tâm Trong Bài ({vocabulary.length})
          </h3>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={savingAll}
          className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-xs font-bold text-purple-300 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{savingAll ? 'Đang lưu...' : 'Lưu tất cả vào SRS'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vocabulary.map((def) => {
          const isSaved = savedMap[def.word];

          return (
            <div
              key={def.word}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between hover:border-purple-500/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-base text-white">
                    {def.word}
                  </span>
                  <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
                    {def.cefrLevel}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-purple-300 block font-semibold">
                  {def.phonetic}
                </span>
                <p className="text-xs text-slate-300 font-sans">
                  {def.meaning}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-850 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveWord(def)}
                  disabled={isSaved}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    isSaved
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-800 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3 h-3 text-teal-300" />
                      <span>Đã lưu</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-3 h-3 text-purple-400" />
                      <span>Lưu SRS</span>
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
