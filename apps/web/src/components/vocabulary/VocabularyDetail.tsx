'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Sparkles, FolderPlus, Gamepad2, Check } from 'lucide-react';
import { VocabularyWord } from '@linguaflow/domain';
import WordHeader from './WordHeader';
import WordDefinition from './WordDefinition';
import WordExamples from './WordExamples';
import VocabularyFolderSelector from './VocabularyFolderSelector';
import LingLingMascot from '../LingLingMascot';
import { addWordToSrsDeck } from '@/lib/vocabulary/vocabularySrsAdapter';
import { Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface VocabularyDetailProps {
  word: VocabularyWord;
  isSaved?: boolean;
  folderIds?: string[];
  inSrs?: boolean;
  locale: string;
}

export default function VocabularyDetail({
  word,
  isSaved = false,
  folderIds = [],
  inSrs = false,
  locale,
}: VocabularyDetailProps) {
  const [savedState, setSavedState] = useState(isSaved);
  const [activeFolderIds, setActiveFolderIds] = useState<string[]>(folderIds);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [inSrsDeck, setInSrsDeck] = useState(inSrs);
  const [addingSrs, setAddingSrs] = useState(false);

  const handleAddToSrs = async () => {
    if (inSrsDeck || addingSrs) return;
    setAddingSrs(true);
    sfx.playCorrect();

    const success = await addWordToSrsDeck({
      targetText: word.targetText,
      translation: word.translation,
      phonetic: word.phoneticUs,
      exampleSentence: word.examples[0]?.sentence,
      cefrLevel: word.cefrLevel,
    });

    if (success) {
      setInSrsDeck(true);
    }
    setAddingSrs(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/vocabulary`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về Kho từ vựng</span>
        </Link>

        {/* Action Buttons (Folders + SRS) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFolderModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4 text-teal-400" />
            <span>Thư mục ({activeFolderIds.length})</span>
          </button>

          <button
            type="button"
            onClick={handleAddToSrs}
            disabled={inSrsDeck || addingSrs}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              inSrsDeck
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-teal-500/20 font-extrabold'
            }`}
          >
            {inSrsDeck ? (
              <>
                <Check className="w-4 h-4 text-teal-400" />
                <span>Đã trong thẻ SRS</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Thêm vào thẻ SRS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Word Header */}
      <WordHeader
        word={word}
        isSaved={savedState}
        onSaveToggle={(saved) => setSavedState(saved)}
      />

      {/* Grid of Definition, Examples, and Practice CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WordDefinition word={word} />
          <WordExamples examples={word.examples} targetWord={word.targetText} />
        </div>

        {/* Sidebar Actions & LingLing Mascot Guide */}
        <div className="space-y-6">
          {/* Quick Practice Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-teal-950/30 border border-teal-500/20 shadow-xl space-y-4 text-center">
            <div className="flex justify-center">
              <LingLingMascot state="speaking" size={88} />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-base text-white">
                Luyện tập từ vựng này
              </h3>
              <p className="text-xs text-slate-400">
                Làm bài trắc nghiệm nghĩa, điền từ vào chỗ trống và nghe chính tả.
              </p>
            </div>

            <Link href={`/${locale}/vocabulary/practice?word=${word.targetText}`}>
              <Button
                variant="primary"
                className="w-full"
                icon={<Gamepad2 className="w-4 h-4" />}
              >
                Bắt đầu luyện tập
              </Button>
            </Link>
          </div>

          {/* Quick Links Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Gợi ý tiếp theo
            </span>
            <div className="space-y-2">
              <Link
                href={`/${locale}/srs`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 text-xs font-bold text-slate-300 hover:text-teal-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <span>Bộ thẻ nhớ SRS</span>
                </span>
                <span>→</span>
              </Link>
              <Link
                href={`/${locale}/listening`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Luyện nghe trong Listening Lab</span>
                </span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Folder Assignment Modal */}
      <VocabularyFolderSelector
        wordId={word.id}
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        currentFolderIds={activeFolderIds}
        onFoldersUpdated={(updated) => setActiveFolderIds(updated)}
      />
    </div>
  );
}
