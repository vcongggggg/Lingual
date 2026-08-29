'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Bug,
} from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { arcadeAudio } from '@/lib/arcadeAudio';
import { pronunciationService } from '@/lib/audio/pronunciationService';

import {
  CRAWLED_MAJOR_TOPICS,
  WordItem,
  SubTopic,
  MajorTopic,
} from '@/lib/vocabulary/masterTopicsData';

const MAJOR_TOPICS_DATABASE: MajorTopic[] = CRAWLED_MAJOR_TOPICS;

export default function SmartVocabularyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  // Navigation hierarchy: 1 = Major Topics, 2 = Sub-topics, 3 = Word List, 4 = Flashcard Studio
  const [selectedMajorTopic, setSelectedMajorTopic] = useState<MajorTopic | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [isFlashcardStudioOpen, setIsFlashcardStudioOpen] = useState(false);

  // Flashcard Practice Studio States
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchWordQuery, setSearchWordQuery] = useState('');

  // User Memory Retention Progress (Real-time tracking)
  const [learnedMap, setLearnedMap] = useState<Record<string, 'again' | 'good' | 'easy'>>({});

  // Dynamic Word Calculations (100% Authentic Computed)
  const grandTotalWords = useMemo(() => {
    return MAJOR_TOPICS_DATABASE.reduce(
      (sum, m) => sum + m.subTopics.reduce((s2, sub) => s2 + sub.words.length, 0),
      0
    );
  }, []);

  const totalLearnedWords = useMemo(() => {
    return Object.keys(learnedMap).length;
  }, [learnedMap]);

  const getMajorTopicWordCount = (topic: MajorTopic) => {
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

  // Audio Playback
  const playAudio = (text: string, accent: 'en-US' | 'en-GB' = 'en-US') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentWordsList = useMemo(() => {
    if (selectedSubTopic && selectedSubTopic.words.length > 0) {
      return selectedSubTopic.words;
    }
    return MAJOR_TOPICS_DATABASE[0].subTopics[0].words;
  }, [selectedSubTopic]);

  const currentPracticeWord = currentWordsList[activeWordIdx % currentWordsList.length];

  const handleSRSResponse = (rating: 'again' | 'good' | 'easy') => {
    if (rating === 'again') arcadeAudio.playBuzzer();
    else if (rating === 'good') arcadeAudio.playLaser();
    else arcadeAudio.playCoin();

    if (currentPracticeWord) {
      setLearnedMap((prev) => ({ ...prev, [currentPracticeWord.id]: rating }));
    }

    setIsFlipped(false);
    if (activeWordIdx + 1 < currentWordsList.length) {
      setActiveWordIdx((prev) => prev + 1);
    } else {
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
        setIsFlipped((prev) => !prev);
        arcadeAudio.playLaser();
      } else if (e.key === '1') {
        handleSRSResponse('again');
      } else if (e.key === '2') {
        handleSRSResponse('good');
      } else if (e.key === '3') {
        handleSRSResponse('easy');
      } else if (e.key === 'Escape') {
        setIsFlashcardStudioOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlashcardStudioOpen, activeWordIdx, currentWordsList, currentPracticeWord]);

  return (
    <main className="min-h-screen pb-24 pt-4 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pointer-events-auto text-slate-100 font-sans">
      {/* ===================================================================== */}
      {/* LEVEL 1: TOPIC CATALOG (DANH SÁCH BỘ TỪ VỰNG THEO CHỦ ĐỀ) */}
      {/* ===================================================================== */}
      {!selectedMajorTopic && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display font-black text-white">Từ vựng theo chủ đề</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {totalLearnedWords}/{grandTotalWords} từ đã học
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">• Tổng {MAJOR_TOPICS_DATABASE.length} chủ đề chính</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedMajorTopic(MAJOR_TOPICS_DATABASE[0]);
                setSelectedSubTopic(MAJOR_TOPICS_DATABASE[0].subTopics[0]);
                setIsFlashcardStudioOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Luyện Tập Ngay ({grandTotalWords} từ)</span>
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <span>Danh sách bộ từ vựng</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-bold">Từ vựng theo chủ đề ({grandTotalWords} từ)</span>
          </div>

          {/* Grid of Major Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MAJOR_TOPICS_DATABASE.map((topic) => {
              const wordCount = getMajorTopicWordCount(topic);
              const learnedCount = getMajorTopicLearnedCount(topic);

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    arcadeAudio.playLaser();
                    setSelectedMajorTopic(topic);
                  }}
                  className="group cursor-pointer p-4 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:-translate-y-1 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <img src={topic.coverImage} alt={topic.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-cyan-400 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{learnedCount}/{wordCount} từ</span>
                        </span>
                        <span>• {topic.subTopics.length} nhóm</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 rounded-xl text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LEVEL 2: SUB-TOPICS VIEW (VÍ DỤ: ANIMALS -> LARGE MAMMALS, CANINES...) */}
      {/* ===================================================================== */}
      {selectedMajorTopic && !selectedSubTopic && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedMajorTopic(null)}
                className="p-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                <img src={selectedMajorTopic.coverImage} alt={selectedMajorTopic.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display font-black text-white">{selectedMajorTopic.title}</h1>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold">
                    {getMajorTopicLearnedCount(selectedMajorTopic)}/{getMajorTopicWordCount(selectedMajorTopic)} từ đã học
                  </span>
                  <span className="text-slate-400">• {selectedMajorTopic.subTopics.length} chủ đề con</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedMajorTopic.subTopics.length > 0) {
                  setSelectedSubTopic(selectedMajorTopic.subTopics[0]);
                  setIsFlashcardStudioOpen(true);
                }
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Luyện Tập Ngay</span>
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <button onClick={() => setSelectedMajorTopic(null)} className="hover:text-white">
              Danh sách bộ từ vựng
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button onClick={() => setSelectedMajorTopic(null)} className="hover:text-white">
              Từ vựng theo chủ đề
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-bold">{selectedMajorTopic.title}</span>
          </div>

          {/* Grid of Sub-topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedMajorTopic.subTopics.map((sub) => {
              const subLearned = getSubTopicLearnedCount(sub);

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    arcadeAudio.playLaser();
                    setSelectedSubTopic(sub);
                  }}
                  className="group cursor-pointer p-4 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:-translate-y-1 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <img src={sub.coverImage} alt={sub.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {sub.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-cyan-400 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{subLearned}/{sub.words.length} từ</span>
                        </span>
                        <span>• Thực tế</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 rounded-xl text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LEVEL 3: WORDS LIST (VÍ DỤ: LARGE MAMMALS - DANH SÁCH TỪ THỰC TẾ) */}
      {/* ===================================================================== */}
      {selectedMajorTopic && selectedSubTopic && !isFlashcardStudioOpen && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSubTopic(null)}
                className="p-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                <img src={selectedSubTopic.coverImage} alt={selectedSubTopic.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display font-black text-white">{selectedSubTopic.title}</h1>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold">
                    {getSubTopicLearnedCount(selectedSubTopic)}/{selectedSubTopic.words.length} từ đã học
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFlashcardStudioOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 fill-slate-950" />
                <span>Luyện Tập Thẻ ({selectedSubTopic.words.length} từ)</span>
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2 flex-wrap">
            <button onClick={() => { setSelectedMajorTopic(null); setSelectedSubTopic(null); }} className="hover:text-white">
              Danh sách bộ từ vựng
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button onClick={() => setSelectedSubTopic(null)} className="hover:text-white">
              {selectedMajorTopic.title}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-bold">{selectedSubTopic.title} ({selectedSubTopic.words.length} từ)</span>
          </div>

          {/* Search inside Sub-topic */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              placeholder="Tìm kiếm từ vựng trong chủ đề..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Grid of Words */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedSubTopic.words
              .filter((w) => w.word.toLowerCase().includes(searchWordQuery.toLowerCase()) || w.meaningVi.toLowerCase().includes(searchWordQuery.toLowerCase()))
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
      {/* LEVEL 4: FLASHCARD PRACTICE STUDIO (MÀN HÌNH LUYỆN THẺ TOÀN DIỆN) */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isFlashcardStudioOpen && currentPracticeWord && (
          <div className="fixed inset-0 z-[999999] bg-slate-950 flex flex-col overflow-hidden text-slate-100 font-sans select-none">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Top Navigation Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFlashcardStudioOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
                  title="Thoát phòng luyện tập"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Phím tắt: Space (Lật thẻ) • 1, 2, 3 (Chọn mức độ)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-3 py-1 rounded-xl border border-cyan-500/20">
                  {activeWordIdx + 1} / {currentWordsList.length}
                </span>
                <span className="text-xs font-bold text-slate-400 truncate max-w-[150px]">
                  {selectedSubTopic ? selectedSubTopic.title : 'Từ vựng'}
                </span>
              </div>
            </header>

            {/* Main Stage: Flashcard Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="w-full max-w-lg space-y-6">
                {/* 3D Flashcard */}
                <div
                  className="relative w-full h-[400px] cursor-pointer select-none"
                  onClick={() => {
                    arcadeAudio.playLaser();
                    setIsFlipped(!isFlipped);
                  }}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* CARD FRONT (Hình ảnh + Từ vựng + Nút phát âm US/UK) */}
                    <div
                      className="absolute inset-0 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/40 border border-cyan-500/40 shadow-2xl flex flex-col justify-between items-center text-center backdrop-blur-xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between w-full">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                          {currentPracticeWord.cefr}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 px-2.5 py-0.5 bg-slate-950 rounded-full border border-slate-800">
                          {currentPracticeWord.pos}
                        </span>
                      </div>

                      {/* Middle: Word Illustration & Target Word */}
                      <div className="space-y-4 flex flex-col items-center">
                        {currentPracticeWord.imageUrl && (
                          <div className="w-36 h-24 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                            <img
                              src={currentPracticeWord.imageUrl}
                              alt={currentPracticeWord.word}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
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
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 italic">
                        <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Chạm vào thẻ hoặc bấm Space để lật xem nghĩa</span>
                      </div>
                    </div>

                    {/* CARD BACK (Nghĩa tiếng Việt + Định nghĩa tiếng Anh + Câu ví dụ) */}
                    <div
                      className="absolute inset-0 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-2xl flex flex-col justify-between text-left backdrop-blur-xl"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-purple-400 font-mono tracking-wider">
                            {currentPracticeWord.pos}
                          </span>
                          <span className="text-xs font-mono text-cyan-400">{currentPracticeWord.phoneticUs}</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
                          {currentPracticeWord.meaningVi}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentPracticeWord.definitionEn}
                        </p>
                      </div>

                      {/* Example Box */}
                      {currentPracticeWord.exampleEn && (
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase text-cyan-400 block tracking-wider">Câu ví dụ</span>
                          <p className="text-xs font-semibold text-white">"{currentPracticeWord.exampleEn}"</p>
                          <p className="text-xs text-slate-400">"{currentPracticeWord.exampleVi}"</p>
                        </div>
                      )}

                      <div className="text-xs text-slate-500 text-center italic">
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
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-slate-950 flex items-center justify-center font-mono text-[10px] font-black">1</span>
                    <span>Chưa biết</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse('good')}
                    className="py-3.5 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs hover:bg-teal-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-mono text-[10px] font-black">2</span>
                    <span>Nhớ tạm</span>
                  </button>

                  <button
                    onClick={() => handleSRSResponse('easy')}
                    className="py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs hover:bg-emerald-500/30 transition-colors shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-mono text-[10px] font-black">3</span>
                    <span>Thông thạo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
