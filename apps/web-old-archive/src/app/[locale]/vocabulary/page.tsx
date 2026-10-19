'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import {
  BookOpen,
  Search,
  Plus,
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  FolderPlus,
  Folder,
  ChevronRight,
  ChevronLeft,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  MoreHorizontal,
  Compass,
  X,
  Volume2,
  RotateCw,
  Brain,
  ListOrdered,
  Bookmark,
  ArrowLeft,
  Keyboard,
  Settings,
  HelpCircle,
  Eye,
  Check,
  Filter,
  ArrowUpDown,
  Trophy,
  Target,
  Play,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { arcadeAudio } from '@/lib/arcadeAudio';
import { soundFx } from '@/lib/soundFx';
import { pronunciationService } from '@/lib/audio/pronunciationService';
import { TiltCard } from '@/components/common/TiltCard';

import {
  CRAWLED_MAJOR_TOPICS,
  WordItem,
  SubTopic,
  MajorTopic,
} from '@/lib/vocabulary/masterTopicsData';
import { dictionaryApi, DictionaryWord } from '@/lib/api';

const MAJOR_TOPICS_DATABASE: MajorTopic[] = CRAWLED_MAJOR_TOPICS;

// Visual Theme & Mascot stickers for CEFR Level Cards
const CEFR_THEMES: Record<string, {
  cover: string;
  mascot: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  spotlight: string;
  glowBorder: string;
  label: string;
}> = {
  'cefr-a1': {
    cover: '/images/dashboard/hero_study_mascot.jpg',
    mascot: '/mascot/raw/mascot_sticker_clean_01.png',
    badgeBg: 'bg-cyan-500/20',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-300',
    spotlight: 'rgba(6, 182, 212, 0.22)',
    glowBorder: 'hover:border-cyan-400/70',
    label: 'Khởi Động',
  },
  'cefr-a2': {
    cover: '/images/dashboard/quick_vocabulary.jpg',
    mascot: '/mascot/raw/mascot_sticker_clean_03.png',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-400/40',
    badgeText: 'text-emerald-300',
    spotlight: 'rgba(16, 185, 129, 0.22)',
    glowBorder: 'hover:border-emerald-400/70',
    label: 'Giao Tiếp',
  },
  'cefr-b1': {
    cover: '/images/ielts/mascot_ielts_reading.jpg',
    mascot: '/mascot/raw/mascot_sticker_clean_08.png',
    badgeBg: 'bg-blue-500/20',
    badgeBorder: 'border-blue-400/40',
    badgeText: 'text-blue-300',
    spotlight: 'rgba(59, 130, 246, 0.22)',
    glowBorder: 'hover:border-blue-400/70',
    label: 'Công Sở',
  },
  'cefr-b2': {
    cover: '/images/ielts/mascot_ielts_listening.jpg',
    mascot: '/mascot/raw/mascot_sticker_clean_09.png',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-400/40',
    badgeText: 'text-purple-300',
    spotlight: 'rgba(168, 85, 247, 0.22)',
    glowBorder: 'hover:border-purple-400/70',
    label: 'Trừu Tượng',
  },
  'cefr-c1': {
    cover: '/images/dashboard/unit_study_desk.jpg',
    mascot: '/mascot/cow_salute.png',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-400/40',
    badgeText: 'text-amber-300',
    spotlight: 'rgba(245, 158, 11, 0.22)',
    glowBorder: 'hover:border-amber-400/70',
    label: 'Học Thuật',
  },
  'cefr-c2': {
    cover: '/images/dashboard/quick_exam.jpg',
    mascot: '/mascot/cow_wink_kiss.png',
    badgeBg: 'bg-rose-500/20',
    badgeBorder: 'border-rose-400/40',
    badgeText: 'text-rose-300',
    spotlight: 'rgba(244, 63, 94, 0.22)',
    glowBorder: 'hover:border-rose-400/70',
    label: 'Bản Ngữ',
  },
};

// Real 26,500+ Word Master Database Statistics per CEFR Level
const CEFR_DATABASE_STATS: Record<string, { totalWords: number; focusUnits: number; levelCode: string }> = {
  'cefr-a1': { totalWords: 1143, focusUnits: 4, levelCode: 'A1' },
  'cefr-a2': { totalWords: 1515, focusUnits: 4, levelCode: 'A2' },
  'cefr-b1': { totalWords: 2715, focusUnits: 4, levelCode: 'B1' },
  'cefr-b2': { totalWords: 4100, focusUnits: 4, levelCode: 'B2' },
  'cefr-c1': { totalWords: 8360, focusUnits: 4, levelCode: 'C1' },
  'cefr-c2': { totalWords: 8842, focusUnits: 2, levelCode: 'C2' },
};

const MASTER_DICTIONARY_TOTAL = 26675;

export default function SmartVocabularyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  // Mount tracking for React Portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Top Category Tabs: 'cefr' (Bậc CEFR) | 'exams' (Chứng Chỉ) | 'topics' (Chủ Đề) | 'srs' (Sổ Từ) | 'dictionary' (Toàn Diện 26,500+)
  const [activeCategoryTab, setActiveCategoryTab] = useState<'cefr' | 'exams' | 'topics' | 'srs' | 'dictionary'>('cefr');
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');

  // Live Dictionary Search States across 26,500+ words
  const [liveSearchResults, setLiveSearchResults] = useState<DictionaryWord[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  // Full Dictionary Explorer Tab States (Page & Filters)
  const [dictPage, setDictPage] = useState(1);
  const [dictCefrFilter, setDictCefrFilter] = useState('all');
  const [dictPosFilter, setDictPosFilter] = useState('all');
  const [dictSearchQuery, setDictSearchQuery] = useState('');
  const [dictWords, setDictWords] = useState<DictionaryWord[]>([]);
  const [dictTotalWords, setDictTotalWords] = useState(MASTER_DICTIONARY_TOTAL);
  const [dictTotalPages, setDictTotalPages] = useState(1112);
  const [isLoadingDict, setIsLoadingDict] = useState(false);
  const [srsSuccessId, setSrsSuccessId] = useState<string | null>(null);

  // Custom Practice Words for 3D Flashcard from Live Search or CEFR Full Deck
  const [customPracticeWords, setCustomPracticeWords] = useState<WordItem[] | null>(null);

  // Navigation hierarchy: 1 = Major Topics, 2 = Sub-topics (Packs), 3 = Word List, 4 = Flashcard Studio
  const [selectedMajorTopic, setSelectedMajorTopic] = useState<MajorTopic | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [isFlashcardStudioOpen, setIsFlashcardStudioOpen] = useState(false);

  // Flashcard Practice Studio States
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchWordQuery, setSearchWordQuery] = useState('');

  // Parallax 3D Tilt & Mouse-following Spotlight Glow
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [cardGlow, setCardGlow] = useState({ x: 50, y: 50 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -16;
    const tiltY = (x - 0.5) * 16;
    setCardTilt({ x: tiltX, y: tiltY });
    setCardGlow({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  // User Memory Retention Progress (Real-time tracking)
  const [learnedMap, setLearnedMap] = useState<Record<string, 'again' | 'good' | 'easy'>>({});

  // Dynamic Word Calculations - Full 26,675+ Word Ecosystem
  const grandTotalWords = MASTER_DICTIONARY_TOTAL;

  const totalLearnedWords = useMemo(() => {
    return Object.keys(learnedMap).length;
  }, [learnedMap]);

  const getMajorTopicWordCount = (topic: MajorTopic) => {
    if (CEFR_DATABASE_STATS[topic.id]) {
      return CEFR_DATABASE_STATS[topic.id].totalWords;
    }
    return topic.subTopics.reduce((acc, sub) => acc + sub.words.length, 0);
  };

  const getMajorTopicLearnedCount = (topic: MajorTopic) => {
    let count = 0;
    topic.subTopics.forEach((sub) => {
      sub.words.forEach((w) => {
        if (learnedMap[w.id]) count++;
      });
    });
    return count;
  };

  const getSubTopicLearnedCount = (sub: SubTopic) => {
    return sub.words.filter((w) => learnedMap[w.id]).length;
  };

  // Live search debounce over 26,500+ words
  useEffect(() => {
    const q = searchCatalogQuery.trim();
    if (q.length < 2) {
      setLiveSearchResults([]);
      return;
    }
    setIsSearchingLive(true);
    const timer = setTimeout(async () => {
      try {
        const res = await dictionaryApi.search({ q, limit: 10 });
        setLiveSearchResults(res.words || []);
      } catch {
        setLiveSearchResults([]);
      } finally {
        setIsSearchingLive(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchCatalogQuery]);

  // Full Dictionary tab data fetching
  useEffect(() => {
    if (activeCategoryTab !== 'dictionary') return;
    setIsLoadingDict(true);
    const timer = setTimeout(async () => {
      try {
        const res = await dictionaryApi.search({
          q: dictSearchQuery.trim(),
          cefr: dictCefrFilter,
          partOfSpeech: dictPosFilter,
          page: dictPage,
          limit: 24,
        });
        setDictWords(res.words || []);
        setDictTotalWords(res.pagination.total || MASTER_DICTIONARY_TOTAL);
        setDictTotalPages(res.pagination.totalPages || 1);
      } catch (e) {
        console.error('Error fetching full dictionary:', e);
      } finally {
        setIsLoadingDict(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [activeCategoryTab, dictSearchQuery, dictCefrFilter, dictPosFilter, dictPage]);

  // Helper: Open single DictionaryWord in 3D Flashcard Studio
  const launchWordInFlashcard = (dw: DictionaryWord) => {
    arcadeAudio.playLaser();
    const item: WordItem = {
      id: dw.id,
      word: dw.targetText,
      phoneticUs: dw.phonetic || '',
      phoneticUk: dw.phonetic || '',
      pos: dw.partOfSpeech || 'Từ vựng',
      meaningVi: dw.translation,
      definitionEn: dw.category ? `Chủ đề: ${dw.category}` : `Bậc CEFR ${dw.cefrLevel}`,
      exampleEn: dw.exampleSentence || `Example sentence with "${dw.targetText}".`,
      exampleVi: dw.exampleTranslation || `Câu ví dụ với từ "${dw.targetText}".`,
      imageUrl: dw.imageUrl,
      cefr: dw.cefrLevel,
    };
    setCustomPracticeWords([item]);
    setSelectedSubTopic(null);
    setActiveWordIdx(0);
    setIsFlashcardStudioOpen(true);
  };

  // Helper: Open full CEFR Level batch in 3D Flashcard Studio
  const launchCefrLevelInFlashcard = async (cefrLevel: string) => {
    arcadeAudio.playLaser();
    try {
      const res = await dictionaryApi.search({ cefr: cefrLevel, limit: 30 });
      if (res.words && res.words.length > 0) {
        const items: WordItem[] = res.words.map((dw) => ({
          id: dw.id,
          word: dw.targetText,
          phoneticUs: dw.phonetic || '',
          phoneticUk: dw.phonetic || '',
          pos: dw.partOfSpeech || 'Từ vựng',
          meaningVi: dw.translation,
          definitionEn: dw.category ? `Chủ đề: ${dw.category}` : `Bậc CEFR ${dw.cefrLevel}`,
          exampleEn: dw.exampleSentence || `Example sentence with "${dw.targetText}".`,
          exampleVi: dw.exampleTranslation || `Câu ví dụ với từ "${dw.targetText}".`,
          imageUrl: dw.imageUrl,
          cefr: dw.cefrLevel,
        }));
        setCustomPracticeWords(items);
        setSelectedSubTopic(null);
        setActiveWordIdx(0);
        setIsFlashcardStudioOpen(true);
      }
    } catch (err) {
      console.error('Error launching CEFR words:', err);
    }
  };

  // Helper: Add Word to SRS Spaced Repetition deck
  const handleAddToSrsDeck = async (wordId: string) => {
    try {
      await dictionaryApi.addToSrs(wordId);
      soundFx.playSuccess();
      arcadeAudio.playCoin();
      setSrsSuccessId(wordId);
      setTimeout(() => setSrsSuccessId(null), 2500);
    } catch {
      soundFx.playClick();
    }
  };

  // Filtered Major Topics based on active category tab & search query
  const filteredMajorTopics = useMemo(() => {
    return MAJOR_TOPICS_DATABASE.filter((topic) => {
      const matchesCategory = activeCategoryTab === 'srs' ? true : topic.categoryGroup === activeCategoryTab;
      const matchesSearch =
        topic.title.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
        (topic.description && topic.description.toLowerCase().includes(searchCatalogQuery.toLowerCase())) ||
        (topic.levelBadge && topic.levelBadge.toLowerCase().includes(searchCatalogQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryTab, searchCatalogQuery]);

  const currentWordsList = useMemo(() => {
    if (customPracticeWords && customPracticeWords.length > 0) {
      return customPracticeWords;
    }
    if (selectedSubTopic && selectedSubTopic.words.length > 0) {
      return selectedSubTopic.words;
    }
    return MAJOR_TOPICS_DATABASE[0].subTopics[0].words;
  }, [customPracticeWords, selectedSubTopic]);

  const currentPracticeWord = currentWordsList[activeWordIdx % currentWordsList.length];

  const handleSRSResponse = (rating: 'again' | 'good' | 'easy') => {
    if (rating === 'again') {
      soundFx.playError();
      arcadeAudio.playBuzzer();
    } else if (rating === 'good') {
      soundFx.playClick();
      arcadeAudio.playLaser();
    } else {
      soundFx.playSuccess();
      arcadeAudio.playCoin();
    }

    if (currentPracticeWord) {
      setLearnedMap((prev) => ({ ...prev, [currentPracticeWord.id]: rating }));
    }

    setIsFlipped(false);
    if (activeWordIdx + 1 < currentWordsList.length) {
      setActiveWordIdx((prev) => prev + 1);
    } else {
      soundFx.playFanfare();
      arcadeAudio.playVictoryFanfare();
      setActiveWordIdx(0);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFlashcardStudioOpen) return;
      if (e.code === 'Space') {
        e.preventDefault();
        soundFx.playWoosh();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1') {
        handleSRSResponse('again');
      } else if (e.key === '2') {
        handleSRSResponse('good');
      } else if (e.key === '3') {
        handleSRSResponse('easy');
      } else if (e.key === 'Escape') {
        soundFx.playClick();
        setIsFlashcardStudioOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlashcardStudioOpen, activeWordIdx, currentWordsList, currentPracticeWord]);

  return (
    <div className="min-h-screen pb-24 pt-2 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* ===================================================================== */}
      {/* LEVEL 1: TOPIC CATALOG (DANH SÁCH BỘ TỪ VỰNG THEO CHỦ ĐỀ & BẬC CEFR) */}
      {/* ===================================================================== */}
      {!selectedMajorTopic && (
        <div className="space-y-6">
          {/* Header Hero Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20 shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-white">Kho Từ Vựng Toàn Diện</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {totalLearnedWords.toLocaleString()}/26,675+ từ vựng sẵn sàng
                  </span>
                  <span className="text-xs text-slate-400">• Chuẩn CEFR A1-C2 & Đề thi IELTS/TOEIC</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategoryTab('dictionary');
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs cursor-pointer flex items-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Tra Cứu 26,500+ Từ</span>
              </button>

              <button
                onClick={() => {
                  arcadeAudio.playLaser();
                  setSelectedMajorTopic(MAJOR_TOPICS_DATABASE[0]);
                  setSelectedSubTopic(MAJOR_TOPICS_DATABASE[0].subTopics[0]);
                  setActiveWordIdx(0);
                  setIsFlashcardStudioOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2 shrink-0 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Luyện Thẻ Nhanh</span>
              </button>
            </div>
          </div>

          {/* 5 Interactive Multi-Tier Category Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategoryTab('cefr');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategoryTab === 'cefr'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Theo Bậc CEFR (A1 - C2)</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategoryTab('exams');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategoryTab === 'exams'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-purple-300" />
                <span>Chứng Chỉ (IELTS / TOEIC)</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategoryTab('topics');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategoryTab === 'topics'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-teal-300" />
                <span>Chủ Đề Đời Sống Thực Tế</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategoryTab('srs');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategoryTab === 'srs'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-rose-300" />
                <span>Sổ Từ & Ôn Chống Quên</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategoryTab('dictionary');
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCategoryTab === 'dictionary'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-teal-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tra Cứu 26,500+ Từ Điển</span>
              </button>
            </div>

            {/* Quick Live Search Bar */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchCatalogQuery}
                onChange={(e) => setSearchCatalogQuery(e.target.value)}
                placeholder="Tìm trong kho 26,500+ từ vựng..."
                className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchCatalogQuery && (
                <button
                  onClick={() => setSearchCatalogQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* LIVE SEARCH RESULTS (OVER ALL 26,500+ WORDS) */}
          {searchCatalogQuery.trim().length >= 2 && (
            <div className="space-y-4 p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    Kết Quả Tra Cứu Từ Điển 26,500+ ({liveSearchResults.length} từ khớp)
                  </span>
                </div>
                {isSearchingLive && (
                  <span className="text-xs text-slate-400 animate-pulse">Đang tìm kiếm...</span>
                )}
              </div>

              {liveSearchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {liveSearchResults.map((word) => (
                    <div
                      key={word.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                              {word.targetText}
                            </span>
                            {word.phonetic && (
                              <span className="text-xs font-mono text-cyan-400/80">{word.phonetic}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {word.cefrLevel}
                            </span>
                            {word.partOfSpeech && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                                {word.partOfSpeech}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 font-medium mt-1.5 line-clamp-2">
                          {word.translation}
                        </p>

                        {word.exampleSentence && (
                          <p className="text-[11px] text-slate-400 italic mt-2 line-clamp-1 border-l-2 border-slate-800 pl-2">
                            "{word.exampleSentence}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                        <button
                          onClick={() => pronunciationService.speak(word.targetText)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddToSrsDeck(word.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            {srsSuccessId === word.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Plus className="w-3 h-3 text-cyan-400" />
                            )}
                            <span>{srsSuccessId === word.id ? 'Đã thêm' : 'Lưu SRS'}</span>
                          </button>

                          <button
                            onClick={() => launchWordInFlashcard(word)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all shadow-sm"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Luyện 3D</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isSearchingLive && (
                  <p className="text-xs text-slate-500 py-3">Không tìm thấy từ vựng khớp chính xác trong kho từ điển.</p>
                )
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: FULL DICTIONARY EXPLORER (26,500+ MASTER VOCABULARY ENGINE) */}
          {/* ================================================================= */}
          {activeCategoryTab === 'dictionary' && (
            <div className="space-y-6">
              {/* Dictionary Controls Bar */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-black text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                      <span>Từ Điển Toàn Diện 26,500+ Mục Từ</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tìm thấy <strong className="text-emerald-400 font-mono">{dictTotalWords.toLocaleString()}</strong> từ vựng theo bộ lọc hiện tại
                    </p>
                  </div>

                  {dictWords.length > 0 && (
                    <button
                      onClick={() => {
                        const items: WordItem[] = dictWords.map((dw) => ({
                          id: dw.id,
                          word: dw.targetText,
                          phoneticUs: dw.phonetic || '',
                          phoneticUk: dw.phonetic || '',
                          pos: dw.partOfSpeech || 'Từ vựng',
                          meaningVi: dw.translation,
                          definitionEn: dw.category ? `Chủ đề: ${dw.category}` : `Bậc CEFR ${dw.cefrLevel}`,
                          exampleEn: dw.exampleSentence || `Example sentence with "${dw.targetText}".`,
                          exampleVi: dw.exampleTranslation || `Câu ví dụ với từ "${dw.targetText}".`,
                          imageUrl: dw.imageUrl,
                          cefr: dw.cefrLevel,
                        }));
                        setCustomPracticeWords(items);
                        setSelectedSubTopic(null);
                        setActiveWordIdx(0);
                        setIsFlashcardStudioOpen(true);
                      }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2 transition-all shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Luyện Thẻ 3D Toàn Bộ Trang Này ({dictWords.length} Từ)</span>
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-400 mr-1">Bậc CEFR:</span>
                  {[
                    { id: 'all', label: 'Tất cả (26.6k)' },
                    { id: 'A1', label: 'A1 (1,143)' },
                    { id: 'A2', label: 'A2 (1,515)' },
                    { id: 'B1', label: 'B1 (2,715)' },
                    { id: 'B2', label: 'B2 (4,100)' },
                    { id: 'C1', label: 'C1 (8,360)' },
                    { id: 'C2', label: 'C2 (8,842)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        soundFx.playClick();
                        setDictCefrFilter(lvl.id);
                        setDictPage(1);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        dictCefrFilter === lvl.id
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Dictionary Words */}
              {isLoadingDict ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono font-bold text-slate-400">Đang tra cứu từ điển 26,500+ từ...</p>
                </div>
              ) : dictWords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dictWords.map((word) => (
                    <div
                      key={word.id}
                      className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 shadow-lg group hover:-translate-y-0.5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                              {word.targetText}
                            </h3>
                            {word.phonetic && (
                              <span className="text-xs font-mono text-emerald-400/90">{word.phonetic}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              {word.cefrLevel}
                            </span>
                            {word.partOfSpeech && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                                {word.partOfSpeech}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-200 font-medium leading-relaxed">
                          {word.translation}
                        </p>

                        {word.exampleSentence && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-1">
                            <p className="text-[11px] text-slate-300 italic">
                              "{word.exampleSentence}"
                            </p>
                            {word.exampleTranslation && (
                              <p className="text-[10px] text-slate-500">
                                {word.exampleTranslation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-xs">
                        <button
                          onClick={() => pronunciationService.speak(word.targetText)}
                          className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddToSrsDeck(word.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {srsSuccessId === word.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Plus className="w-3 h-3 text-emerald-400" />
                            )}
                            <span>{srsSuccessId === word.id ? 'Đã lưu' : 'Lưu SRS'}</span>
                          </button>

                          <button
                            onClick={() => launchWordInFlashcard(word)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Luyện 3D</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                  <p className="text-sm font-bold text-slate-300">Không tìm thấy từ vựng phù hợp</p>
                </div>
              )}

              {/* Pagination Controls */}
              {dictTotalPages > 1 && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">
                    Trang <strong className="text-white">{dictPage}</strong> / {dictTotalPages.toLocaleString()} ({dictTotalWords.toLocaleString()} từ)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={dictPage <= 1}
                      onClick={() => {
                        soundFx.playClick();
                        setDictPage((p) => Math.max(1, p - 1));
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold cursor-pointer transition-colors"
                    >
                      Trang trước
                    </button>
                    <button
                      disabled={dictPage >= dictTotalPages}
                      onClick={() => {
                        soundFx.playClick();
                        setDictPage((p) => p + 1);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold cursor-pointer transition-colors"
                    >
                      Trang sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid of Major Topics in Active Category (CEFR / Exams / Topics / SRS) */}
          {activeCategoryTab !== 'dictionary' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMajorTopics.map((topic) => {
                const wordCount = getMajorTopicWordCount(topic);
                const isCefrTopic = topic.categoryGroup === 'cefr' && CEFR_DATABASE_STATS[topic.id];
                const cefrTheme = isCefrTopic ? CEFR_THEMES[topic.id] : null;
                const coverSrc = cefrTheme ? cefrTheme.cover : (topic.coverImage || '/images/dashboard/quick_vocabulary.jpg');
                const mascotSrc = cefrTheme ? cefrTheme.mascot : '/mascot/raw/mascot_sticker_clean_01.png';

                return (
                  <TiltCard
                    key={topic.id}
                    maxTilt={7}
                    spotlightColor={cefrTheme ? cefrTheme.spotlight : 'rgba(34, 211, 238, 0.15)'}
                    className="h-full"
                  >
                    <div
                      onClick={() => {
                        arcadeAudio.playLaser();
                        setSelectedMajorTopic(topic);
                      }}
                      className={`group cursor-pointer rounded-3xl bg-slate-900/90 border border-slate-800/90 ${
                        cefrTheme ? cefrTheme.glowBorder : 'hover:border-cyan-500/50'
                      } hover:bg-slate-900/95 transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden h-full`}
                    >
                      {/* 16:9 Cinematic Visual Banner with Mascot Accent */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                        <Image
                          src={coverSrc}
                          alt={topic.title}
                          fill
                          className="object-cover object-center brightness-105 contrast-105 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                        />
                        {/* Smooth Glass & Vignette Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-transparent" />

                        {/* Top Pills: CEFR Level & Word Count Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider backdrop-blur-md border shadow-lg ${
                              cefrTheme
                                ? `${cefrTheme.badgeBg} ${cefrTheme.badgeBorder} ${cefrTheme.badgeText}`
                                : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                            }`}
                          >
                            {isCefrTopic
                              ? `${CEFR_DATABASE_STATS[topic.id].levelCode} • ${CEFR_DATABASE_STATS[topic.id].totalWords.toLocaleString()} Từ`
                              : (topic.levelBadge || 'Standard')}
                          </span>

                          <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-200 bg-slate-950/70 border border-white/10 backdrop-blur-md shadow-md">
                            {topic.subTopics.length} bài học
                          </span>
                        </div>

                        {/* Floating Cute Mascot Sticker in Banner Corner */}
                        <div className="absolute -bottom-1 right-3 z-10 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 filter drop-shadow-2xl">
                          <Image
                            src={mascotSrc}
                            alt="LingLing"
                            width={72}
                            height={72}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Card Body Information */}
                      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {topic.title}
                            </h3>
                          </div>

                          {topic.description && (
                            <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>
                          )}
                        </div>

                        {/* Card Bottom Progress & Action Footer */}
                        <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-mono text-slate-400">
                            <span className="text-cyan-400 font-bold">{wordCount.toLocaleString()} từ</span>
                            <span>• Chuẩn CEFR</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-cyan-400 font-black group-hover:translate-x-1 transition-transform">
                            <span>Vào học ngay</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          )}

          {activeCategoryTab !== 'dictionary' && filteredMajorTopics.length === 0 && (
            <div className="text-center py-16 space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Không tìm thấy danh mục phù hợp</p>
              <p className="text-xs text-slate-500">Hãy thử nhập từ khóa tìm kiếm khác hoặc chuyển danh mục ở trên.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* LEVEL 2: SUB-TOPICS / PACKS LIST (DANH SÁCH BÀI HỌC CỦA CHỦ ĐỀ) */}
      {/* ===================================================================== */}
      {selectedMajorTopic && !selectedSubTopic && (() => {
        const cefrTheme = CEFR_THEMES[selectedMajorTopic.id];
        const coverSrc = cefrTheme?.cover || selectedMajorTopic.coverImage || '/images/dashboard/unit_study_desk.jpg';
        const mascotSrc = cefrTheme?.mascot || '/mascot/cow_salute.png';
        const totalMajorWords = getMajorTopicWordCount(selectedMajorTopic);
        const totalMajorLearned = selectedMajorTopic.subTopics.reduce((acc, st) => acc + getSubTopicLearnedCount(st), 0);
        const majorProgressPercent = totalMajorWords > 0 ? Math.round((totalMajorLearned / totalMajorWords) * 100) : 0;

        return (
          <div className="space-y-6">
            {/* Breadcrumb Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <button
                onClick={() => setSelectedMajorTopic(null)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Trở về Kho danh mục</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
                  {selectedMajorTopic.subTopics.length} Units học phần
                </span>
                <span className="text-[11px] font-mono text-cyan-300 font-bold bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                  {totalMajorWords.toLocaleString()} từ vựng
                </span>
              </div>
            </div>

            {/* Cinematic Hero Command Center for Major Topic */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-950">
              {/* Ambient Background Cover with Blur & Gradient */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={coverSrc}
                  alt={selectedMajorTopic.title}
                  fill
                  className="object-cover object-center opacity-25 filter blur-[2px] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-5">
                  {/* LingLing Mascot Hero Avatar */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-400/40 shrink-0 shadow-2xl flex items-center justify-center p-2 group">
                    <Image
                      src={mascotSrc}
                      alt="Mascot LingLing"
                      width={84}
                      height={84}
                      className="object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md">
                      ✓
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-0.5 rounded-full text-[11px] font-mono font-black uppercase tracking-wider border shadow-md ${
                        cefrTheme
                          ? `${cefrTheme.badgeBg} ${cefrTheme.badgeBorder} ${cefrTheme.badgeText}`
                          : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                      }`}>
                        {selectedMajorTopic.levelBadge || 'Standard'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                        Chuẩn Khung Châu Âu CEFR
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                      {selectedMajorTopic.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed">
                      {selectedMajorTopic.description}
                    </p>

                    {/* Meta Quick Pills */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <strong className="text-white font-mono">{selectedMajorTopic.subTopics.length}</strong> bài học trọng điểm
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <strong className="text-white font-mono">{totalMajorWords.toLocaleString()}</strong> từ vựng cốt lõi
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                        Tiến độ: <strong className="text-emerald-400 font-mono">{majorProgressPercent}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-row lg:flex-col items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      arcadeAudio.playLaser();
                      setSelectedSubTopic(selectedMajorTopic.subTopics[0]);
                      setActiveWordIdx(0);
                      setIsFlashcardStudioOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Học Từ Đầu (Unit 1)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      if (selectedMajorTopic.subTopics[0]) {
                        setSelectedSubTopic(selectedMajorTopic.subTopics[0]);
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Nội Dung Unit 1</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Extended Database Banner for CEFR Levels (Command Center) */}
            {selectedMajorTopic.categoryGroup === 'cefr' && CEFR_DATABASE_STATS[selectedMajorTopic.id] && (
              <div className="relative rounded-3xl p-6 bg-gradient-to-r from-emerald-950/50 via-slate-900/90 to-cyan-950/50 border-2 border-emerald-500/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 overflow-hidden">
                <div className="space-y-1.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-black text-emerald-300 uppercase tracking-widest">
                      Cơ Sở Dữ Liệu {selectedMajorTopic.levelBadge} Đồng Bộ
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-display font-extrabold text-white">
                    Kho dữ liệu chứa trọn vẹn <span className="text-emerald-400 font-mono text-xl">{CEFR_DATABASE_STATS[selectedMajorTopic.id].totalWords.toLocaleString()}</span> từ vựng chuẩn {selectedMajorTopic.title}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Bên cạnh các Unit trọng tâm dưới đây, bạn có thể lập tức tra cứu ngữ nghĩa, nghe phát âm US/UK chuẩn bản ngữ và luyện flashcard 3D ngẫu nhiên cho toàn bộ {CEFR_DATABASE_STATS[selectedMajorTopic.id].totalWords.toLocaleString()} từ.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
                  <button
                    onClick={() => launchCefrLevelInFlashcard(CEFR_DATABASE_STATS[selectedMajorTopic.id].levelCode)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 transition-all"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Luyện Thẻ 3D 30 Từ Bậc Này</span>
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedMajorTopic(null);
                      setSelectedSubTopic(null);
                      setActiveCategoryTab('dictionary');
                      setDictCefrFilter(CEFR_DATABASE_STATS[selectedMajorTopic.id].levelCode);
                      setDictPage(1);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold text-xs cursor-pointer flex items-center gap-2 transition-all shadow-md"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Duyệt Toàn Bộ {CEFR_DATABASE_STATS[selectedMajorTopic.id].totalWords.toLocaleString()} Từ Điển</span>
                  </button>
                </div>
              </div>
            )}

            {/* Section Heading with Counter */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 rounded-full bg-cyan-400" />
                <h3 className="text-lg sm:text-xl font-display font-black text-white">
                  Danh Sách Bài Học ({selectedMajorTopic.subTopics.length} Units)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Chọn bài học để bắt đầu luyện thẻ 3D
              </span>
            </div>

            {/* Grid of SubTopics / Units with 3D TiltCards & Preview Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedMajorTopic.subTopics.map((subTopic, idx) => {
                const learnedInSub = getSubTopicLearnedCount(subTopic);
                const totalInSub = subTopic.words.length;
                const percent = totalInSub > 0 ? Math.round((learnedInSub / totalInSub) * 100) : 0;
                const sampleWords = subTopic.words.slice(0, 4);
                const remainingCount = Math.max(0, totalInSub - sampleWords.length);

                return (
                  <TiltCard
                    key={subTopic.id}
                    maxTilt={8}
                    spotlightColor="rgba(6, 182, 212, 0.2)"
                    className="rounded-3xl"
                  >
                    <div className="h-full rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group">
                      {/* Top Accent Gradient Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="space-y-3">
                        {/* Header Badge: Part/Unit + Count */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            Phần {idx + 1}
                          </span>
                          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                            learnedInSub > 0
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-950/80 border-slate-800 text-slate-400'
                          }`}>
                            {learnedInSub}/{totalInSub} từ
                          </span>
                        </div>

                        {/* Unit Title */}
                        <h4 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {subTopic.title}
                        </h4>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
                            <div
                              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>Tiến độ</span>
                            <span className="text-cyan-400 font-bold">{percent}%</span>
                          </div>
                        </div>

                        {/* Vocabulary Preview Chips */}
                        <div className="pt-2 border-t border-slate-800/60">
                          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                            Từ vựng tiêu biểu:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {sampleWords.map((w, wIdx) => (
                              <span
                                key={wIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 group-hover:border-slate-700 transition-colors"
                                title={`${w.word}: ${w.meaningVi}`}
                              >
                                <span className="text-cyan-400 font-semibold">{w.word}</span>
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 font-bold">
                                +{remainingCount} từ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => {
                            arcadeAudio.playLaser();
                            setSelectedSubTopic(subTopic);
                            setActiveWordIdx(0);
                            setIsFlashcardStudioOpen(true);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Luyện Thẻ 3D</span>
                        </button>

                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedSubTopic(subTopic);
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Xem toàn bộ danh sách từ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ===================================================================== */}
      {/* LEVEL 3: WORD LIST VIEW (DANH SÁCH TỪ CHI TIẾT TRONG SUBTOPIC) */}
      {/* ===================================================================== */}
      {selectedMajorTopic && selectedSubTopic && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <button onClick={() => setSelectedMajorTopic(null)} className="hover:text-white transition-colors cursor-pointer">
                Kho từ vựng
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button onClick={() => setSelectedSubTopic(null)} className="hover:text-white transition-colors cursor-pointer">
                {selectedMajorTopic.title}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 font-bold">{selectedSubTopic.title} ({selectedSubTopic.words.length} từ)</span>
            </div>

            <button
              onClick={() => {
                arcadeAudio.playLaser();
                setActiveWordIdx(0);
                setIsFlashcardStudioOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:from-teal-300 hover:to-cyan-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Luyện Cả Bài ({selectedSubTopic.words.length} từ)</span>
            </button>
          </div>

          {/* Search inside Sub-topic */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              placeholder="Tìm kiếm từ vựng trong bài học này..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Grid of Words */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedSubTopic.words
              .filter(
                (w) =>
                  w.word.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
                  w.meaningVi.toLowerCase().includes(searchWordQuery.toLowerCase())
              )
              .map((word) => (
                <div
                  key={word.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors shadow-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-white">{word.word}</h4>
                        <button
                          type="button"
                          onClick={() => pronunciationService.speak(word.word, 'us')}
                          className="p-1.5 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                          title="Phát âm từ vựng"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                        {word.cefr}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-cyan-400/90">{word.phoneticUs}</p>
                    <p className="text-xs font-black text-emerald-400">{word.meaningVi}</p>
                    <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
                      ({word.pos}) {word.definitionEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {learnedMap[word.id] ? `Đã ôn (${learnedMap[word.id]})` : 'Chưa thuộc'}
                    </span>
                    <button
                      onClick={() => {
                        const idx = selectedSubTopic.words.findIndex((x) => x.id === word.id);
                        setActiveWordIdx(idx >= 0 ? idx : 0);
                        setIsFlashcardStudioOpen(true);
                      }}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Luyện từ này</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LEVEL 4: FLASHCARD PRACTICE STUDIO (RENDERED VIA PORTAL TO BODY)     */}
      {/* ===================================================================== */}
      {mounted &&
        isFlashcardStudioOpen &&
        currentPracticeWord &&
        createPortal(
          <div className="fixed inset-0 z-[999999] bg-[#070b14] flex flex-col overflow-hidden text-slate-100 font-sans select-none">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Top Navigation Header - PROMINENT EXIT & CONTROLS */}
            <header className="h-16 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsFlashcardStudioOpen(false);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-200 hover:text-rose-300 font-extrabold text-xs transition-all shadow-md cursor-pointer group"
                  title="Thoát phòng luyện tập (Esc)"
                >
                  <ArrowLeft className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Thoát Luyện Tập</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                    Esc
                  </kbd>
                </button>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
                  <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Space: Lật thẻ • 1, 2, 3: Mức độ ghi nhớ</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {activeWordIdx + 1} / {currentWordsList.length}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-300 truncate max-w-[180px] hidden sm:inline">
                  {selectedSubTopic ? selectedSubTopic.title : 'Từ vựng'}
                </span>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsFlashcardStudioOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Đóng phòng luyện thẻ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Main Stage: Flashcard Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="w-full max-w-lg space-y-6">
                {/* 3D Flashcard with Parallax Tilt & Cursor Spotlight */}
                <div
                  className="relative w-full h-[380px] cursor-pointer select-none"
                  style={{ perspective: 1200 }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => {
                    arcadeAudio.playLaser();
                    setIsFlipped(!isFlipped);
                  }}
                >
                  <motion.div
                    animate={{
                      rotateX: cardTilt.x,
                      rotateY: (isFlipped ? 180 : 0) + (isFlipped ? -cardTilt.y : cardTilt.y),
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* CARD FRONT (Từ vựng + Phát âm US/UK + Gợi ý) */}
                    <div
                      className="absolute inset-0 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/40 border border-cyan-500/40 shadow-2xl flex flex-col justify-between items-center text-center backdrop-blur-xl overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Dynamic Cursor Spotlight Glow */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(20, 184, 166, 0.25), transparent 70%)`,
                        }}
                      />

                      {/* Top Badges */}
                      <div
                        className="flex items-center justify-between w-full relative z-10"
                        style={{ transform: 'translateZ(25px)' }}
                      >
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                          {currentPracticeWord.cefr}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 px-2.5 py-0.5 bg-slate-950 rounded-full border border-slate-800">
                          {currentPracticeWord.pos}
                        </span>
                      </div>

                      {/* Middle: Word Illustration & Target Word */}
                      <div
                        className="space-y-4 flex flex-col items-center relative z-10"
                        style={{ transform: 'translateZ(45px)' }}
                      >
                        {currentPracticeWord.imageUrl && (
                          <div className="w-36 h-24 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                            <img
                              src={currentPracticeWord.imageUrl}
                              alt={currentPracticeWord.word}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight drop-shadow-md">
                          {currentPracticeWord.word}
                        </h2>

                        {/* Dual Voice Audio Pills (US / UK) */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pronunciationService.speak(currentPracticeWord.word, 'us');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>US {currentPracticeWord.phoneticUs}</span>
                          </button>

                          {currentPracticeWord.phoneticUk && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                pronunciationService.speak(currentPracticeWord.word, 'uk');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>UK {currentPracticeWord.phoneticUk}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bottom Hint */}
                      <div
                        className="text-xs text-slate-400 flex items-center gap-1.5 italic relative z-10"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Chạm vào thẻ hoặc bấm Space để lật xem nghĩa</span>
                      </div>
                    </div>

                    {/* CARD BACK (Nghĩa tiếng Việt + Định nghĩa tiếng Anh + Câu ví dụ) */}
                    <div
                      className="absolute inset-0 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-2xl flex flex-col justify-between text-left backdrop-blur-xl overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Dynamic Cursor Spotlight Glow Back */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(168, 85, 247, 0.25), transparent 70%)`,
                        }}
                      />

                      <div
                        className="space-y-3 relative z-10"
                        style={{ transform: 'translateZ(35px)' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-purple-400 font-mono tracking-wider">
                            {currentPracticeWord.pos}
                          </span>
                          <span className="text-xs font-mono text-cyan-400">{currentPracticeWord.phoneticUs}</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-400 drop-shadow-md">
                          {currentPracticeWord.meaningVi}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentPracticeWord.definitionEn}
                        </p>
                      </div>

                      {/* Example Box */}
                      {currentPracticeWord.exampleEn && (
                        <div
                          className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 relative z-10"
                          style={{ transform: 'translateZ(25px)' }}
                        >
                          <span className="text-[10px] font-bold uppercase text-cyan-400 block tracking-wider">Câu ví dụ</span>
                          <p className="text-xs font-semibold text-white">"{currentPracticeWord.exampleEn}"</p>
                          <p className="text-xs text-slate-400">"{currentPracticeWord.exampleVi}"</p>
                        </div>
                      )}

                      <div
                        className="text-xs text-slate-500 text-center italic relative z-10"
                        style={{ transform: 'translateZ(15px)' }}
                      >
                        Chọn mức độ ghi nhớ bên dưới để chuyển từ tiếp theo
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 3 SRS Response Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSRSResponse('again')}
                    className="py-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold text-xs hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-slate-950 flex items-center justify-center font-mono text-[10px] font-black">
                      1
                    </span>
                    <span>Chưa biết</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse('good')}
                    className="py-3.5 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs hover:bg-teal-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-mono text-[10px] font-black">
                      2
                    </span>
                    <span>Nhớ tạm</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse('easy')}
                    className="py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs hover:bg-emerald-500/30 transition-colors shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-mono text-[10px] font-black">
                      3
                    </span>
                    <span>Thông thạo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
