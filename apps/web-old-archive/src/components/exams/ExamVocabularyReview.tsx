'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, Check } from 'lucide-react';
import { getExamVocabularyCandidate, saveExamVocabularyToSRS } from '@/lib/exams/examSrsAdapter';
import { Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface ExamVocabularyReviewProps {
  vocabularyIds: string[];
  className?: string;
}

export default function ExamVocabularyReview({
  vocabularyIds,
  className = '',
}: ExamVocabularyReviewProps) {
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [savingAll, setSavingAll] = useState(false);

  if (!vocabularyIds || vocabularyIds.length === 0) return null;

  const candidates = vocabularyIds.map((id) => getExamVocabularyCandidate(id));

  const handleSaveWord = async (vid: string) => {
    if (savedMap[vid]) return;
    sfx.playCorrect();
    const success = await saveExamVocabularyToSRS(vid);
    if (success) {
      setSavedMap((prev) => ({ ...prev, [vid]: true }));
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    sfx.playVictory();
    for (const item of candidates) {
      await saveExamVocabularyToSRS(item.wordId);
      setSavedMap((prev) => ({ ...prev, [item.wordId]: true }));
    }
    setSavingAll(false);
  };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-purple-500/20 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="font-display font-bold text-lg text-white">
            Từ Vựng Quan Trọng Cần Ôn Lại ({candidates.length})
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
        {candidates.map((item) => {
          const isSaved = savedMap[item.wordId];

          return (
            <div
              key={item.wordId}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-base text-white">
                    {item.word}
                  </span>
                  <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
                    {item.cefrLevel}
                  </Badge>
                </div>
                {item.phonetic && (
                  <span className="text-[11px] font-mono text-purple-300 block">
                    {item.phonetic}
                  </span>
                )}
                <p className="text-xs text-slate-300">{item.meaning}</p>
              </div>

              <div className="pt-2 border-t border-slate-850 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveWord(item.wordId)}
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
