'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VocabularyWord } from '@linguaflow/domain';
import { vocabularyApi } from '@/lib/api';
import { MASTER_VOCABULARY_LIST } from '@/lib/vocabulary/sampleData';
import VocabularyDetail from '@/components/vocabulary/VocabularyDetail';

export default function WordDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const wordId = params?.wordId as string;

  const [word, setWord] = useState<VocabularyWord | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [folderIds, setFolderIds] = useState<string[]>([]);
  const [inSrs, setInSrs] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWordData();
  }, [wordId]);

  const loadWordData = async () => {
    try {
      setLoading(true);
      const res = await vocabularyApi.getWord(wordId);
      if (res?.word) {
        setWord(res.word);
        setIsSaved(res.word.isSaved);
        setFolderIds(res.word.folderIds || []);
        setInSrs(res.word.inSrs);
      } else {
        // Fallback from master dataset
        const local = MASTER_VOCABULARY_LIST.find(
          (w) => w.id === wordId || w.normalizedText === wordId.toLowerCase()
        );
        if (local) {
          setWord(local);
        }
      }
    } catch {
      const local = MASTER_VOCABULARY_LIST.find(
        (w) => w.id === wordId || w.normalizedText === wordId.toLowerCase()
      );
      if (local) setWord(local);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!word) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Không tìm thấy từ vựng</h2>
        <p className="text-xs text-slate-400">Từ vựng này không tồn tại trong hệ thống.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto pointer-events-auto">
      <VocabularyDetail
        word={word}
        isSaved={isSaved}
        folderIds={folderIds}
        inSrs={inSrs}
        locale={locale}
      />
    </main>
  );
}
