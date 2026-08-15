'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Folder, ArrowLeft, Gamepad2, Sparkles, Plus } from 'lucide-react';
import { VocabularyFolder, VocabularyWord } from '@linguaflow/domain';
import { vocabularyApi } from '@/lib/api';
import VocabularyList from '@/components/vocabulary/VocabularyList';
import { Button } from '@linguaflow/ui';

export default function FolderDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const folderId = params?.folderId as string;

  const [folder, setFolder] = useState<VocabularyFolder | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolderData();
  }, [folderId]);

  const loadFolderData = async () => {
    try {
      setLoading(true);
      const [foldersRes, savedRes] = await Promise.allSettled([
        vocabularyApi.getFolders(),
        vocabularyApi.getSavedWords(folderId),
      ]);

      if (foldersRes.status === 'fulfilled' && foldersRes.value?.folders) {
        const found = foldersRes.value.folders.find((f: any) => f.id === folderId);
        if (found) setFolder(found);
      }

      if (savedRes.status === 'fulfilled' && savedRes.value?.savedWords) {
        setWords(savedRes.value.savedWords.map((item: any) => item.word));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pointer-events-auto">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/vocabulary`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tất cả thư mục</span>
        </Link>

        {words.length > 0 && (
          <Link href={`/${locale}/vocabulary/practice?folderId=${folderId}`}>
            <Button
              variant="primary"
              icon={<Gamepad2 className="w-4 h-4" />}
            >
              Luyện tập thư mục này ({words.length} từ)
            </Button>
          </Link>
        )}
      </div>

      {/* Folder Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {folder?.name || 'Thư mục từ vựng'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {folder?.description || 'Bộ sưu tập từ vựng cá nhân'} •{' '}
              <strong className="text-teal-400 font-mono">{words.length} từ đã lưu</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Words in Folder */}
      <VocabularyList
        words={words}
        locale={locale}
        loading={loading}
        emptyTitle="Thư mục này chưa có từ vựng nào"
        emptyDescription="Hãy vào mục 'Tất cả từ vựng' và chọn biểu tượng thư mục trên các từ bạn muốn thêm vào đây."
      />
    </main>
  );
}
