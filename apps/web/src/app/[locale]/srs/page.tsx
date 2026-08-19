'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, XPBadge, StreakBadge, Badge, ProgressBar } from '@linguaflow/ui';
import { srsApi } from '../../../lib/api';
import { arcadeAudio } from '@/lib/arcadeAudio';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  Volume2,
  Award,
  BarChart3,
  Clock,
  GraduationCap,
  Layers,
  ArrowRight,
} from 'lucide-react';
import MascotPopup from '@/components/MascotPopup';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';

export default function SRSPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ dueToday: 0, learning: 0, mastered: 0 });

  useEffect(() => {
    const loadSRS = async () => {
      try {
        const data = await srsApi.getQueue();
        if (data?.queue && data.queue.length > 0) {
          setQueue(data.queue);
          setStats({
            dueToday: data.queue.length,
            learning: data.stats?.learning || Math.floor(data.queue.length * 0.6),
            mastered: data.stats?.mastered || Math.floor(data.queue.length * 0.2),
          });
        } else {
          loadFallbackQueue();
        }
      } catch {
        loadFallbackQueue();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbackQueue = () => {
      const fallback = [
        { id: '1', targetText: 'Perseverance', translation: 'Sự kiên trì, bền bỉ', phonetic: '/ˌpɜːrsəˈvɪrəns/', cefrLevel: 'B2', exampleSentence: 'Her perseverance led to great academic success.', exampleTranslation: 'Sự kiên trì của cô ấy đã dẫn tới thành công lớn trong học tập.' },
        { id: '2', targetText: 'Eloquent', translation: 'Hùng biện, lưu loát', phonetic: '/ˈeləkwənt/', cefrLevel: 'C1', exampleSentence: 'He made an eloquent speech at the conference.', exampleTranslation: 'Anh ấy đã có một bài phát biểu hùng biện tại hội nghị.' },
        { id: '3', targetText: 'Resilience', translation: 'Khả năng phục hồi, kiên cường', phonetic: '/rɪˈzɪliəns/', cefrLevel: 'B2', exampleSentence: 'Courage and resilience help us overcome hardship.', exampleTranslation: 'Lòng dũng cảm và sự kiên cường giúp chúng ta vượt qua gian khó.' },
        { id: '4', targetText: 'Ubiquitous', translation: 'Phổ biến, ở đâu cũng có', phonetic: '/juːˈbɪkwɪtəs/', cefrLevel: 'C1', exampleSentence: 'Smartphones have become ubiquitous in daily life.', exampleTranslation: 'Điện thoại thông minh đã trở nên phổ biến khắp mọi nơi trong đời sống.' },
      ];
      setQueue(fallback);
      setStats({ dueToday: fallback.length, learning: 3, mastered: 1 });
    };

    loadSRS();
  }, []);

  const handlePlayAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRating = useCallback(
    async (quality: number) => {
      const currentWord = queue[currentIndex];
      if (!currentWord) return;

      const xpGain = quality >= 3 ? 15 : 5;
      setTotalXPEarned((prev) => prev + xpGain);

      if (quality >= 5) {
        arcadeAudio.playCoin();
      } else if (quality >= 3) {
        arcadeAudio.playLaser();
      } else {
        arcadeAudio.playBuzzer();
      }

      setIsFlipped(false);

      try {
        await srsApi.submitReview(currentWord.id, quality);
      } catch {}

      if (currentIndex + 1 < queue.length) {
        setCurrentIndex((prev) => prev + 1);
        setCompletedCount((prev) => prev + 1);
      } else {
        arcadeAudio.playVictoryFanfare();
        setIsFinished(true);
        setCompletedCount(queue.length);
      }
    },
    [queue, currentIndex]
  );

  // Global Keyboard Shortcuts (Space to flip, 1-3 to rate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || loading || queue.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        arcadeAudio.playLaser();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1') {
        e.preventDefault();
        handleRating(1);
      } else if (e.key === '2') {
        e.preventDefault();
        handleRating(3);
      } else if (e.key === '3') {
        e.preventDefault();
        handleRating(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, loading, queue.length, handleRating]);

  const currentWord = queue[currentIndex];
  const progressPercent = queue.length > 0 ? Math.round(((currentIndex) / queue.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">{isVi ? 'Đang chuẩn bị thẻ ôn tập SRS...' : 'Preparing SRS Flashcard Deck...'}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-teal-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {isVi ? 'Hoàn Thành Buổi Ôn Tập! 🎉' : 'Session Complete! 🎉'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isVi ? `Bạn đã ôn tập thành công ${completedCount} thẻ từ vựng và nhận +${totalXPEarned} XP.` : `You successfully reviewed ${completedCount} flashcards and earned +${totalXPEarned} XP.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xl font-extrabold text-teal-400">+{totalXPEarned}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Kinh nghiệm</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xl font-extrabold text-amber-400">{completedCount}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Thẻ đã thuộc</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              variant="primary"
              className="w-full"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                setCurrentIndex(0);
                setIsFinished(false);
                setIsFlipped(false);
              }}
            >
              {isVi ? 'Ôn Lại Lần Nữa' : 'Review Again'}
            </Button>

            <Link href={`/${locale}/dashboard`}>
              <Button variant="outline" className="w-full">
                {isVi ? 'Về Dashboard' : 'Back to Dashboard'}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[85vh] flex flex-col justify-between max-w-xl mx-auto py-6 px-4 space-y-6">
      {/* HEADER NAVIGATION & PROGRESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Về Lộ Trình' : 'Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-2 font-mono font-bold text-teal-300">
            <Brain className="w-4 h-4" />
            <span>
              {currentIndex + 1} / {queue.length}
            </span>
          </div>
        </div>

        <ProgressBar value={currentIndex + 1} max={queue.length} color="teal" />
      </div>

      {/* CENTERED 3D FLASHCARD STAGE */}
      <div
        className="relative w-full h-[380px] perspective-1000 cursor-pointer select-none"
        onClick={() => {
          arcadeAudio.playLaser();
          setIsFlipped(!isFlipped);
        }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full h-full transform-style-3d relative"
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/30 shadow-2xl flex flex-col justify-between items-center text-center">
            <div className="flex items-center justify-between w-full">
              <Badge variant="teal" className="font-mono font-extrabold uppercase">
                {currentWord?.cefrLevel || 'B2'}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">SM-2 Spaced Recall</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                {currentWord?.targetText}
              </h2>
              {currentWord?.phonetic && (
                <p className="text-sm font-mono text-teal-300/90">{currentWord?.phonetic}</p>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio(currentWord?.targetText);
                }}
                className="p-3 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 transition-colors mx-auto inline-flex items-center gap-1.5 text-xs font-bold"
                aria-label="Phát âm từ vựng"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isVi ? 'Nghe phát âm' : 'Play Audio'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-sans">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isVi ? 'Chạm (hoặc bấm Space) để lật xem nghĩa' : 'Tap (or press Space) to reveal definition'}</span>
            </div>
          </div>

          {/* BACK SIDE (180deg) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/40 shadow-2xl flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {isVi ? 'Ý Nghĩa & Ngữ Cảnh' : 'Definition & Context'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{currentWord?.targetText}</span>
              </div>

              <h3 className="text-2xl font-display font-extrabold text-amber-300">
                {currentWord?.translation}
              </h3>

              {currentWord?.exampleSentence && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <p className="font-bold text-slate-400 mb-1">{isVi ? 'Ví dụ:' : 'Example:'}</p>
                  <p>"{currentWord?.exampleSentence}"</p>
                  {currentWord?.exampleTranslation && (
                    <p className="text-slate-400 text-[11px] mt-1">{currentWord?.exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span>{isVi ? 'Chạm để lật lại mặt trước' : 'Tap to flip back'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RATING BUTTONS & KEYBOARD SHORTCUTS (1, 2, 3) */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleRating(1)}
            className="p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center transition-all active:scale-95 shadow-md flex flex-col items-center gap-1"
          >
            <span>{isVi ? '🔴 Quên rồi' : '🔴 Again'}</span>
            <span className="font-mono text-[10px] text-rose-400/80 bg-slate-950 px-2 py-0.5 rounded border border-rose-500/20">Phím 1</span>
          </button>

          <button
            type="button"
            onClick={() => handleRating(3)}
            className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold text-center transition-all active:scale-95 shadow-md flex flex-col items-center gap-1"
          >
            <span>{isVi ? '🟡 Tạm ổn' : '🟡 Hard'}</span>
            <span className="font-mono text-[10px] text-amber-400/80 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/20">Phím 2</span>
          </button>

          <button
            type="button"
            onClick={() => handleRating(5)}
            className="p-3.5 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold text-center transition-all active:scale-95 shadow-md flex flex-col items-center gap-1"
          >
            <span>{isVi ? '🟢 Đã nhớ' : '🟢 Easy'}</span>
            <span className="font-mono text-[10px] text-teal-400/80 bg-slate-950 px-2 py-0.5 rounded border border-teal-500/20">Phím 3</span>
          </button>
        </div>
      </div>
    </main>
  );
}
