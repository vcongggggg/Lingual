'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  FolderPlus,
  Zap,
  Brain,
  Filter,
  Bookmark,
  Sparkles,
  Gamepad2,
  Folder,
  X,
  Volume2,
} from 'lucide-react';
import { VocabularyWord, VocabularyFolder } from '@linguaflow/domain';
import { vocabularyApi, srsApi } from '@/lib/api';
import { MASTER_VOCABULARY_LIST } from '@/lib/vocabulary/sampleData';
import { searchVocabulary } from '@/lib/vocabulary/searchVocabulary';
import VocabularyStats from '@/components/vocabulary/VocabularyStats';
import VocabularyList from '@/components/vocabulary/VocabularyList';
import FolderList from '@/components/vocabulary/FolderList';
import CreateFolderDialog from '@/components/vocabulary/CreateFolderDialog';
import LingLingMascot from '@/components/LingLingMascot';
import { Button, Card, Badge } from '@linguaflow/ui';

export default function SmartVocabularyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  // Navigation & filter states
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'folders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Data states
  const [words, setWords] = useState<VocabularyWord[]>(MASTER_VOCABULARY_LIST);
  const [folders, setFolders] = useState<VocabularyFolder[]>([]);
  const [savedWords, setSavedWords] = useState<any[]>([]);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [folderMap, setFolderMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<VocabularyFolder | null>(null);

  // SRS Stats
  const [dueCount, setDueCount] = useState(3);
  const [learningCount, setLearningCount] = useState(8);
  const [masteredCount, setMasteredCount] = useState(12);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [searchRes, foldersRes, savedRes, srsQueueRes] = await Promise.allSettled([
        vocabularyApi.search({ limit: 100 }),
        vocabularyApi.getFolders(),
        vocabularyApi.getSavedWords(),
        srsApi.getQueue(),
      ]);

      if (searchRes.status === 'fulfilled' && searchRes.value?.words) {
        setWords(searchRes.value.words);
      }
      if (foldersRes.status === 'fulfilled' && foldersRes.value?.folders) {
        setFolders(foldersRes.value.folders);
      }
      if (savedRes.status === 'fulfilled' && savedRes.value?.savedWords) {
        setSavedWords(savedRes.value.savedWords);
        const map: Record<string, boolean> = {};
        const fMap: Record<string, string[]> = {};
        savedRes.value.savedWords.forEach((item: any) => {
          map[item.wordId] = true;
          fMap[item.wordId] = item.folderIds || [];
        });
        setSavedMap(map);
        setFolderMap(fMap);
      }
      if (srsQueueRes.status === 'fulfilled' && srsQueueRes.value?.stats) {
        setDueCount(srsQueueRes.value.stats.dueToday || 0);
        setLearningCount(srsQueueRes.value.stats.learning || 0);
        setMasteredCount(srsQueueRes.value.stats.mastered || 0);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // Filtered master words
  const filteredWords = searchVocabulary(words, searchQuery, {
    cefrLevel: selectedCefr,
    category: selectedCategory,
  });

  const displayedSavedWords = filteredWords.filter((w) => savedMap[w.id]);

  const handleSaveToggle = (wordId: string, saved: boolean) => {
    setSavedMap((prev) => ({ ...prev, [wordId]: saved }));
  };

  const handleCreateFolder = async (data: { name: string; description?: string }) => {
    try {
      if (folderToEdit) {
        await vocabularyApi.updateFolder(folderToEdit.id, data);
      } else {
        await vocabularyApi.createFolder(data);
      }
      const refreshed = await vocabularyApi.getFolders();
      if (refreshed?.folders) setFolders(refreshed.folders);
    } catch {}
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await vocabularyApi.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch {}
  };

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Hero Banner with LingLing Guide */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Vocabulary Lab • Kho Từ Vựng Thông Minh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Làm Chủ Từ Vựng. <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                Ghi Nhớ Suốt Đời với SRS.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Khám phá từ vựng theo cấp độ CEFR, tổ chức theo thư mục riêng và luyện tập đa phương thức kết hợp thuật toán lặp lại ngắt quãng (SM-2).
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <LingLingMascot state="thinking" size={120} />
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <VocabularyStats
        savedCount={Object.values(savedMap).filter(Boolean).length}
        dueTodayCount={dueCount}
        masteredCount={masteredCount}
        learningCount={learningCount}
        locale={locale}
      />

      {/* Main Feature Tabs & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả từ vựng ({words.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Từ đã lưu ({Object.values(savedMap).filter(Boolean).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('folders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'folders'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Thư mục ({folders.length})</span>
          </button>
        </div>

        {/* Practice & Quick Test Buttons */}
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/vocabulary/test`}>
            <Button
              variant="secondary"
              icon={<Zap className="w-4 h-4 text-amber-400" />}
            >
              Kiểm tra nhanh
            </Button>
          </Link>

          <Link href={`/${locale}/vocabulary/practice`}>
            <Button
              variant="primary"
              icon={<Gamepad2 className="w-4 h-4" />}
            >
              Luyện tập ngay
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar (Shown in 'all' and 'saved' tabs) */}
      {activeTab !== 'folders' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm từ tiếng Anh, nghĩa tiếng Việt, câu ví dụ, tag..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* CEFR Level Filters */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
              {['all', 'A1', 'A2', 'B1', 'B2'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedCefr(level)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCefr === level
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {level === 'all' ? 'Tất cả' : level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Content Display */}
      {activeTab === 'all' && (
        <VocabularyList
          words={filteredWords}
          savedMap={savedMap}
          folderMap={folderMap}
          locale={locale}
          onSaveToggle={handleSaveToggle}
          loading={loading}
        />
      )}

      {activeTab === 'saved' && (
        <VocabularyList
          words={displayedSavedWords}
          savedMap={savedMap}
          folderMap={folderMap}
          locale={locale}
          onSaveToggle={handleSaveToggle}
          loading={loading}
          emptyTitle="Chưa có từ vựng nào được lưu"
          emptyDescription="Chạm vào biểu tượng bookmark trên bất kỳ thẻ từ vựng nào để lưu vào sổ cá nhân."
        />
      )}

      {activeTab === 'folders' && (
        <FolderList
          folders={folders}
          locale={locale}
          onCreateClick={() => {
            setFolderToEdit(null);
            setCreateFolderOpen(true);
          }}
          onEditFolder={(folder) => {
            setFolderToEdit(folder);
            setCreateFolderOpen(true);
          }}
          onDeleteFolder={handleDeleteFolder}
        />
      )}

      {/* Create / Edit Folder Dialog */}
      <CreateFolderDialog
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onSubmit={handleCreateFolder}
        folderToEdit={folderToEdit}
      />
    </main>
  );
}
