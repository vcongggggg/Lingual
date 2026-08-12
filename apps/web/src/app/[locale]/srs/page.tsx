'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, SRSFlashcard, XPBadge, StreakBadge } from '@linguaflow/ui';
import { srsApi } from '../../../lib/api';
import { Brain, Sparkles, CheckCircle2, RotateCcw, ArrowLeft, Volume2, Award, BarChart3, Clock, GraduationCap } from 'lucide-react';
import MascotPopup from '@/components/MascotPopup';
import Image from 'next/image';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';


export default function SRSPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [loading, setLoading] = useState(true);
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
        { id: '1', targetText: 'Hello', translation: 'Xin chào', phonetic: '/həˈloʊ/', imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80', exampleSentence: 'Hello, nice to meet you!', exampleTranslation: 'Xin chào, rất vui được gặp bạn!' },
        { id: '2', targetText: 'Good morning', translation: 'Chào buổi sáng', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=500&auto=format&fit=crop&q=80', exampleSentence: 'Good morning, teacher!', exampleTranslation: 'Chào buổi sáng, thầy giáo!' },
        { id: '3', targetText: 'Thank you', translation: 'Cảm ơn', phonetic: '/θæŋk juː/', imageUrl: 'https://images.unsplash.com/photo-1499744632587-7798360ba20f?w=500&auto=format&fit=crop&q=80', exampleSentence: 'Thank you very much!', exampleTranslation: 'Cảm ơn bạn rất nhiều!' },
        { id: '4', targetText: 'Goodbye', translation: 'Tạm biệt', phonetic: '/ɡʊdˈbaɪ/', imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&auto=format&fit=crop&q=80', exampleSentence: 'Goodbye, see you tomorrow!', exampleTranslation: 'Tạm biệt, hẹn gặp lại ngày mai!' },
      ];
      setQueue(fallback);
      setStats({ dueToday: fallback.length, learning: 3, mastered: 1 });
    };

    loadSRS();
  }, []);

  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const [popupState, setPopupState] = useState<{ show: boolean; key: MascotReactionKey; title?: string; msg?: string }>({
    show: false,
    key: 'confirm',
  });

  const handleRating = async (quality: number) => {
    const currentWord = queue[currentIndex];
    const xpGain = quality >= 3 ? 10 : 2;
    setTotalXPEarned((prev) => prev + xpGain);

    if (quality >= 5) {
      setPopupState({
        show: true,
        key: 'celebrate_big',
        title: 'Xuất sắc! 🎉',
        msg: 'Bò LingLing nháy mắt khen bạn ghi nhớ siêu đỉnh!',
      });
    } else if (quality >= 3) {
      setPopupState({
        show: true,
        key: 'confirm',
        title: 'Đã ghi nhận! 🫡',
        msg: 'Bò LingLing chào quân đội chúc mừng bạn!',
      });
    }

    try {
      await srsApi.submitReview(currentWord.id, quality);
    } catch {}

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);
    } else {
      setIsFinished(true);
      window.dispatchEvent(
        new CustomEvent('linguaflow_xp_update', {
          detail: { totalXP: 150 + totalXPEarned + xpGain },
        })
      );
    }
  };

  const currentItem = queue[currentIndex];
  const progressPercent = queue.length > 0 ? Math.round(((currentIndex) / queue.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">Đang tải thẻ ôn tập SRS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto py-6 space-y-8">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Lộ Trình
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-teal-400" />
          <span className="font-display font-bold text-lg text-white">Ôn Tập SRS SM-2</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {currentIndex + 1} / {queue.length}
        </span>
      </div>

      {/* SRS Stats Dashboard */}
      <div className="w-full grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 uppercase">Hôm nay</span>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.dueToday}</span>
          <span className="text-[10px] text-slate-400 block">từ cần ôn</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/20 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span className="text-[10px] font-bold text-teal-400 uppercase">Đang học</span>
          </div>
          <span className="text-2xl font-extrabold text-teal-300">{stats.learning}</span>
          <span className="text-[10px] text-slate-400 block">từ vựng</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Thành thạo</span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-300">{stats.mastered}</span>
          <span className="text-[10px] text-slate-400 block">từ vựng</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Tiến trình ôn tập</span>
          <span className="font-mono text-teal-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-800 border border-slate-700/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {!isFinished && currentItem ? (
        <div className="w-full flex flex-col items-center space-y-8">
          {/* 3D FLIP CARD */}
          <SRSFlashcard
            targetText={currentItem.targetText}
            phonetic={currentItem.phonetic}
            translation={currentItem.translation}
            imageUrl={currentItem.imageUrl}
            exampleSentence={currentItem.exampleSentence}
            exampleTranslation={currentItem.exampleTranslation}
            cefrLevel={currentItem.cefrLevel || 'A1'}
            onPlayAudio={() => handlePlayAudio(currentItem.targetText)}
          />

          {/* SM-2 QUALITY RATING BUTTONS */}
          <div className="w-full max-w-md space-y-3">
            <span className="text-xs text-center block text-slate-400 font-medium">
              Đánh giá mức độ ghi nhớ từ này để SM-2 lên lịch ôn:
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRating(0)}
                className="py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all active:scale-95"
              >
                Quên
                <span className="block text-[10px] opacity-75">1 ngày</span>
              </button>
              <button
                onClick={() => handleRating(2)}
                className="py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs transition-all active:scale-95"
              >
                Khó
                <span className="block text-[10px] opacity-75">3 ngày</span>
              </button>
              <button
                onClick={() => handleRating(3)}
                className="py-3 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs transition-all active:scale-95"
              >
                Tốt
                <span className="block text-[10px] opacity-75">6 ngày</span>
              </button>
              <button
                onClick={() => handleRating(5)}
                className="py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all active:scale-95"
              >
                Dễ
                <span className="block text-[10px] opacity-75">12 ngày</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* FINISHED / EMPTY SRS STATE */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/40 p-8 text-center space-y-6 shadow-2xl shadow-teal-500/20"
        >
          <div className="relative w-28 h-28 mx-auto">
            <Image
              src={mascotReactions.idle_empty}
              alt="Mascot Empty SRS State"
              width={112}
              height={112}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">Chưa Có Từ Nào Cần Ôn!</h2>
          <p className="text-sm text-slate-300">
            Bò LingLing đang nằm cuộn tròn nghỉ ngơi. Bạn đã hoàn thành xuất sắc các từ vựng cần ôn hôm nay!
          </p>
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 inline-flex items-center gap-2 text-teal-300 font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>+{totalXPEarned} XP Đã Nhận</span>
          </div>
          <Link href={`/${locale}/dashboard`} className="block">
            <Button variant="accent" size="lg" className="w-full">
              Quay Về Lộ Trình Học
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Mascot Reaction Popup */}
      <MascotPopup
        isVisible={popupState.show}
        reactionKey={popupState.key}
        title={popupState.title}
        message={popupState.msg}
        autoDismissMs={3500}
        onClose={() => setPopupState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}

