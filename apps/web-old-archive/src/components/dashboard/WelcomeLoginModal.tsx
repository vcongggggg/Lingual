'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Play, BookOpen, Brain } from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { mascotReactions } from '@linguaflow/config';
import { arcadeAudio } from '@/lib/arcadeAudio';

interface WelcomeLoginModalProps {
  userName?: string;
  locale?: string;
  nextLessonHref?: string;
  nextLessonTitle?: string;
  dueSrsCount?: number;
  dailyGoal?: number;
}

export const WelcomeLoginModal: React.FC<WelcomeLoginModalProps> = ({
  userName = 'Học Viên',
  locale = 'vi',
  nextLessonHref,
  nextLessonTitle = 'Bài 1: Chào hỏi thường ngày',
  dueSrsCount = 5,
  dailyGoal = 15,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show once per session
    const hasShown = sessionStorage.getItem('lingual_welcome_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('lingual_welcome_shown', 'true');
        arcadeAudio.playCoin();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const isVi = locale === 'vi';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-md bg-slate-900/95 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-500/10 backdrop-blur-2xl text-center space-y-6 z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascot Avatar Hero */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 via-emerald-400 to-amber-300 rounded-3xl blur-lg opacity-40 animate-pulse" />
              <div className="relative w-full h-full rounded-3xl bg-slate-950 border border-teal-500/40 p-2 flex items-center justify-center shadow-xl">
                <Image
                  src={mascotReactions.greet}
                  alt="LingLing Mascot"
                  width={76}
                  height={76}
                  unoptimized
                  className="object-contain filter drop-shadow-md hover:scale-110 transition-transform"
                />
              </div>
            </div>

            {/* Greetings Title */}
            <div className="space-y-1.5">
              <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">
                {isVi ? `Chào mừng ${userName}!` : `Welcome, ${userName}!`}
              </h3>
              <p className="text-xs sm:text-sm text-teal-300 font-semibold">
                {isVi ? 'Bạn đã sẵn sàng để tiếp tục học hôm nay chưa?' : 'Ready to crush your English goals today?'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
                {isVi
                  ? 'Khám phá bài học mới và ôn tập để nâng cao phản xạ tiếng Anh mỗi ngày!'
                  : 'Explore new lessons and review flashcards to boost your fluency!'}
              </p>
            </div>

            {/* Today Highlights Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Mục tiêu học:</span>
                </span>
                <span className="font-bold text-amber-300">{dailyGoal} phút / ngày</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-850 pt-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <span>Thẻ từ cần ôn:</span>
                </span>
                <span className="font-bold text-teal-300">{dueSrsCount} từ đến hạn</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <Link href={nextLessonHref || `/${locale}/learn/1`} onClick={handleClose} className="block w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-teal-500/20 font-extrabold"
                  icon={<Play className="w-4 h-4 fill-slate-950" />}
                >
                  {isVi ? 'Bắt Đầu Bài Học Ngay' : 'Start Today’s Lesson'}
                </Button>
              </Link>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
              >
                {isVi ? 'Để sau' : 'Maybe later'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default WelcomeLoginModal;
