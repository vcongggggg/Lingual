'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  MotionCard,
  ProgressBar,
  XPBadge,
  StreakBadge,
  springPresets,
  useMotionAccessibility,
  RewardOverlay,
  RewardEventPayload,
  canPlayFeedbackAudio,
  Badge,
} from '@linguaflow/ui';
import { curriculumApi, userApi, srsApi } from '../../../lib/api';
import { sfx } from '@/lib/soundEffects';
import { arcadeAudio } from '@/lib/arcadeAudio';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Star,
  Flame,
  Trophy,
  Sparkles,
  Brain,
  ArrowRight,
  Target,
  Zap,
  Clock,
  Compass,
  Calendar,
  Headphones,
  Mic,
  PenTool,
  Award,
  Users,
} from 'lucide-react';
import MascotPopup from '@/components/MascotPopup';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';
import { WelcomeLoginModal } from '@/components/dashboard/WelcomeLoginModal';
import { soundFx } from '@/lib/soundFx';
import { TiltCard } from '@/components/common/TiltCard';

export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';
  const { shouldReduceMotion } = useMotionAccessibility();

  const [units, setUnits] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userXP, setUserXP] = useState(150);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [dailyProgress, setDailyProgress] = useState(10);
  const [dueSrsCount, setDueSrsCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('Học Viên');

  const [dailyQuests, setDailyQuests] = useState([
    {
      id: 'q1',
      title: isVi ? 'Học 15 từ vựng mới' : 'Learn 15 new words',
      icon: '📚',
      current: 12,
      target: 15,
      xpReward: 30,
      coinReward: 5,
    },
    {
      id: 'q2',
      title: isVi ? 'Luyện nghe hoặc phát âm' : 'Complete 1 audio session',
      icon: '🎧',
      current: 1,
      target: 1,
      xpReward: 40,
      coinReward: 10,
    },
    {
      id: 'q3',
      title: isVi ? 'Đạt mục tiêu 15 phút học' : 'Reach 15 mins goal',
      icon: '🔥',
      current: 10,
      target: 15,
      xpReward: 25,
      coinReward: 5,
    },
  ]);

  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('lingual_user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.displayName || parsed.name) {
          setUserName(parsed.displayName || parsed.name);
        }
      }
    } catch {}

    const loadData = async () => {
      try {
        const [unitsData, progressData, srsQueueData] = await Promise.allSettled([
          curriculumApi.getUnits(),
          userApi.getProgress().catch(() => null),
          srsApi.getQueue().catch(() => null),
        ]);

        if (unitsData.status === 'fulfilled' && unitsData.value?.units) {
          setUnits(unitsData.value.units);
        }

        if (progressData.status === 'fulfilled' && progressData.value) {
          const progress = progressData.value;
          if (progress.completedLessons) {
            setCompletedLessons(progress.completedLessons.map((p: any) => p.lessonId));
          }
          if (progress.totalXP) setUserXP(progress.totalXP);
        }

        if (srsQueueData.status === 'fulfilled' && srsQueueData.value?.stats) {
          setDueSrsCount(srsQueueData.value.stats.dueToday || 0);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [activeReward, setActiveReward] = useState<RewardEventPayload | null>(null);
  const [popupState, setPopupState] = useState<{ show: boolean; key: MascotReactionKey; title?: string; msg?: string }>({
    show: false,
    key: 'relax_done',
  });

  useEffect(() => {
    if (!loading) {
      if (dailyProgress >= dailyGoal) {
        if (canPlayFeedbackAudio()) {
          sfx.playVictory();
        }
        setActiveReward({
          type: 'daily_goal_complete',
          intensity: 'MAJOR',
          title: isVi ? 'Mục Tiêu Hôm Nay Hoàn Thành! 🎉' : 'Daily Goal Achieved! 🎉',
          subtitle: isVi ? 'Bò LingLing rất tự hào về sự kiên trì của bạn!' : 'LingLing is proud of your consistency!',
          xpAmount: 100,
          icon: '🔥',
        });
      } else {
        const timer = setTimeout(() => {
          setPopupState({
            show: true,
            key: 'streak_urgent',
            title: isVi ? 'Cảnh báo Streak! ⚠️' : 'Streak Alert! ⚠️',
            msg: isVi ? 'Streak sắp hết hạn! Hoàn thành 1 bài học ngay nào!' : 'Keep your streak alive by completing a lesson today!',
          });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, dailyProgress, dailyGoal, isVi]);

  // Next active lesson calculation
  const nextLesson = (() => {
    for (const u of units) {
      for (const l of u.lessons || []) {
        if (!completedLessons.includes(l.order.toString())) {
          return { unit: u, lesson: l };
        }
      }
    }
    return units[0]?.lessons?.[0] ? { unit: units[0], lesson: units[0].lessons[0] } : null;
  })();

  const dashboardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: springPresets.smooth,
    },
  };

  // Bento Quick Access Items
  const quickAccessItems = [
    {
      title: isVi ? 'Luyện Nghe' : 'Listening',
      sub: isVi ? 'Nghe chép & Nhại giọng' : 'Dictation & Shadowing',
      tag: isVi ? 'Phản Xạ Âm' : 'Audio Lab',
      icon: <Headphones className="w-5 h-5 text-cyan-400" />,
      image: '/images/dashboard/quick_listening.jpg',
      href: `/${locale}/listening`,
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      title: isVi ? 'Kho Từ Vựng' : 'Vocabulary',
      sub: isVi ? '26,500+ từ vựng' : '26,500+ Lexicon',
      tag: isVi ? 'Flashcard 3D' : 'Smart SRS',
      icon: <BookOpen className="w-5 h-5 text-teal-400" />,
      image: '/images/dashboard/quick_vocabulary.jpg',
      href: `/${locale}/vocabulary`,
      borderColor: 'border-teal-500/30 hover:border-teal-400',
      glowColor: 'rgba(20, 184, 166, 0.4)',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    },
    {
      title: isVi ? 'Luyện Phát Âm' : 'Pronunciation',
      sub: isVi ? 'Chuẩn ngữ điệu IPA' : 'Phoneme & Tone',
      tag: isVi ? 'AI Voice Check' : 'IPA Lab',
      icon: <Mic className="w-5 h-5 text-emerald-400" />,
      image: '/images/dashboard/quick_pronunciation.jpg',
      href: `/${locale}/speaking/pronunciation`,
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      title: isVi ? 'Luyện Thi' : 'Exam Prep',
      sub: isVi ? 'TOEIC & IELTS band' : 'Mock Tests',
      tag: isVi ? 'Format Cambridge' : 'Band 8.5',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      image: '/images/dashboard/quick_exam.jpg',
      href: `/${locale}/exam-practice`,
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
  ];

  // Leaderboard Mock Top Learners
  const leaderboard = [
    { rank: 1, name: 'Duy Vỹ', words: '1,561 từ', xp: 1850, medal: '🥇', isTop: true },
    { rank: 2, name: 'Trần Thị Thu Giang', words: '1,412 từ', xp: 1620, medal: '🥈', isTop: true },
    { rank: 3, name: 'Bản Lưu Thị', words: '810 từ', xp: 950, medal: '🥉', isTop: true },
    { rank: 4, name: 'Nhân Nguyễn', words: '795 từ', xp: 820, medal: '4', isTop: false },
    { rank: 5, name: `${userName} (Bạn)`, words: '420 từ', xp: userXP, medal: '5', isCurrent: true },
  ];

  if (loading && units.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">{isVi ? 'Đang khởi tạo không gian học tập...' : 'Loading Learning Dashboard...'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Login Modal */}
      <WelcomeLoginModal
        userName={userName}
        locale={locale}
        nextLessonHref={nextLesson ? `/${locale}/learn/${nextLesson.lesson.order}` : undefined}
        nextLessonTitle={nextLesson ? `${nextLesson.unit.title} • ${nextLesson.lesson.title}` : undefined}
        dueSrsCount={dueSrsCount}
        dailyGoal={dailyGoal}
      />

      <motion.div
        variants={dashboardContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-8 pb-20 max-w-7xl mx-auto"
      >
        {/* AMBIENT DEEP SPACE GLOW */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        {/* 1. QUICK ACCESS 4-PILLAR COMMAND STRIP */}
        <motion.div variants={itemVariants} className="space-y-3 relative z-10">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
              <span>{isVi ? 'Truy Cập Nhanh' : 'Quick Access'}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {quickAccessItems.map((item, idx) => (
              <TiltCard
                key={idx}
                maxTilt={8}
                spotlightColor={item.glowColor}
                spotlightRadius={380}
                className="h-full rounded-2xl sm:rounded-3xl"
              >
                <Link
                  href={item.href}
                  onClick={() => soundFx.playClick()}
                  className={`group relative flex flex-col justify-between h-36 sm:h-44 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${item.borderColor} overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-xl block bg-slate-950/90`}
                >
                  {/* FULL BACKGROUND 3D ARTWORK WITH MULTI-STOP VIGNETTE */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115 opacity-85 group-hover:opacity-100 filter brightness-110 contrast-105 group-hover:brightness-125"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* Subtle multi-directional gradient overlays so neon art shines bright while text remains crystal-clear */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  </div>

                  {/* TOP ROW: FLOATING GLASS ICON (LEFT) + ACTION ARROW (RIGHT) */}
                  <div className="flex items-center justify-between relative z-10 w-full" style={{ transform: 'translateZ(25px)' }}>
                    <div className="p-2.5 rounded-2xl bg-slate-950/85 border border-white/15 backdrop-blur-md shadow-lg group-hover:scale-110 group-hover:border-white/30 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-950/70 border border-white/15 backdrop-blur-sm flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-teal-500 group-hover:border-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* BOTTOM ROW: CATEGORY BADGE + BOLD TITLE + SUBTITLE */}
                  <div className="space-y-1 relative z-10" style={{ transform: 'translateZ(30px)' }}>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider mb-0.5 backdrop-blur-md ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <h3 className="text-sm sm:text-base font-display font-extrabold text-white group-hover:text-cyan-200 transition-colors block truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-200 font-medium truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      {item.sub}
                    </p>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </motion.div>

        {/* 2. BENTO MAIN GRID ROW (8 cols main + 4 cols sidebar) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: MISSION HERO & ROADMAP */}
          <motion.div variants={itemVariants} className="relative z-10 lg:col-span-8 space-y-8">
            {/* HERO COMMAND MISSION CARD WITH FULL-BLEED 3D MASCOT & LANDSCAPE BACKGROUND */}
            <div className="group relative overflow-hidden rounded-3xl border border-teal-500/40 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 bg-slate-950">
              
              {/* 1. FULL-BLEED 3D STUDY SCENE BACKGROUND */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  src="/images/dashboard/hero_study_mascot.jpg"
                  alt="Mascot Studying English"
                  fill
                  priority
                  className="object-cover object-right sm:object-right transition-transform duration-1000 group-hover:scale-105 filter brightness-105 contrast-105"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
                {/* Directional glass gradient from left to right: Dark glass on left for readability, clear on right to showcase mascot */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/20" />
              </div>

              {/* 2. FOREGROUND CONTENT: TEXT + CTA ON LEFT */}
              <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                <div className="space-y-4 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                      <Target className="w-3.5 h-3.5 text-teal-300" />
                      <span>{isVi ? 'Nhiệm Vụ Trọng Tâm Hôm Nay' : "Today's Core Mission"}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-orange-500/25 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/20 backdrop-blur-md">
                      <span className="text-sm flame-flutter inline-block">🔥</span>
                      <span>5 {isVi ? 'Ngày Chuỗi' : 'Days Streak'}</span>
                    </div>
                  </div>

                  {nextLesson ? (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-teal-300 tracking-wider uppercase block drop-shadow-sm">
                        {nextLesson.unit.title}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                        {nextLesson.lesson.title}
                      </h1>
                    </div>
                  ) : (
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                      {isVi ? 'Tiếp tục lộ trình chinh phục tiếng Anh' : 'Continue Your English Mastery'}
                    </h1>
                  )}

                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow max-w-lg">
                    {isVi
                      ? `Hoàn thành bài học tiếp theo để nhận +${nextLesson?.lesson.xpReward || 50} XP và củng cố thói quen học tập liên tục!`
                      : `Complete the next lesson to earn +${nextLesson?.lesson.xpReward || 50} XP and maintain your daily study momentum!`}
                  </p>

                  {nextLesson && (
                    <div className="pt-2">
                      <Link
                        href={`/${locale}/learn/${nextLesson.lesson.order}`}
                        onClick={() => soundFx.playWoosh()}
                        className="inline-block"
                      >
                        <button
                          type="button"
                          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/30 hover:shadow-teal-400/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <Play className="w-5 h-5 fill-slate-950" />
                          <span>{isVi ? 'Bắt Đầu Học Ngay' : 'Resume Learning'}</span>
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right spacer for desktop so mascot scene shines unblocked */}
                <div className="hidden md:block w-72 lg:w-96 shrink-0 h-48 pointer-events-none" />
              </div>

              {/* 3. 3 PRIORITIZED DAILY ACTION TILES (GLASSMORPHIC) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 relative z-10">
                <Link
                  href={nextLesson ? `/${locale}/learn/${nextLesson.lesson.order}` : '#'}
                  onClick={() => soundFx.playClick()}
                  className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900/90 border border-white/10 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/10 backdrop-blur-md transition-all duration-200 flex items-center justify-between group min-w-0"
                >
                  <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">1. {isVi ? 'Bài Học Mới' : 'New Lesson'}</span>
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors truncate block">
                      {nextLesson ? nextLesson.lesson.title : 'Hoàn thành bài'}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                </Link>

                <Link
                  href={`/${locale}/srs`}
                  onClick={() => soundFx.playClick()}
                  className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900/90 border border-white/10 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10 backdrop-blur-md transition-all duration-200 flex items-center justify-between group min-w-0"
                >
                  <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">2. {isVi ? 'Thẻ Nhớ Thông Minh' : 'SRS Flashcards'}</span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate block">
                      {dueSrsCount} {isVi ? 'từ đến hạn ôn' : 'cards due'}
                    </span>
                  </div>
                  <Brain className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                </Link>

                <Link
                  href={`/${locale}/games`}
                  onClick={() => soundFx.playClick()}
                  className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900/90 border border-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-md transition-all duration-200 flex items-center justify-between group min-w-0"
                >
                  <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">3. {isVi ? 'Thử Thách Game' : 'Game Sprint'}</span>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate block">
                      Word Sprint x2 XP
                    </span>
                  </div>
                  <Trophy className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>

            {/* UNIT & LESSON NODE-PATH ROADMAP */}
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block">
                    {isVi ? 'Lộ Trình Từng Bước (A1 → B2)' : 'Curriculum Roadmap (A1 → B2)'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                    {isVi ? 'Các Chủ Điểm Bài Học' : 'Curriculum Units'}
                  </h2>
                </div>
                <Link href={`/${locale}/vocabulary`}>
                  <Button variant="outline" size="sm" icon={<BookOpen className="w-4 h-4" />}>
                    {isVi ? 'Kho Từ Vựng' : 'Vocabulary Lab'}
                  </Button>
                </Link>
              </div>

              {units.map((unit, unitIdx) => {
                const unitCefrLevel = unit.lessons?.[0]?.words?.[0]?.cefrLevel || 'A1';
                const cefrColors: Record<string, string> = {
                  A1: 'from-teal-900/40 via-slate-900 to-emerald-950/30 border-teal-500/30',
                  A2: 'from-amber-900/30 via-slate-900 to-orange-950/20 border-amber-500/30',
                  B1: 'from-violet-900/30 via-slate-900 to-purple-950/20 border-violet-500/30',
                };
                const cefrBadgeColors: Record<string, string> = {
                  A1: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
                  A2: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
                  B1: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
                };

                return (
                  <motion.div key={unit.order} variants={itemVariants} className="relative space-y-6">
                    {/* Unit Header Banner */}
                    <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-r ${cefrColors[unitCefrLevel] || cefrColors.A1} border backdrop-blur-2xl p-5 sm:p-6 flex items-center justify-between shadow-xl gap-4`}>
                      {/* Atmospheric 3D Study Scene Background for Unit 1 */}
                      {unitIdx === 0 && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <Image
                            src="/images/dashboard/unit_study_desk.jpg"
                            alt="Study Desk"
                            fill
                            className="object-cover object-right opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 filter brightness-105 contrast-105"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent/20" />
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1 pr-2 min-w-0 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${cefrBadgeColors[unitCefrLevel] || cefrBadgeColors.A1} border text-xs font-bold`}>
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Unit {unit.order}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${cefrBadgeColors[unitCefrLevel] || cefrBadgeColors.A1} border`}>
                            {unitCefrLevel}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                          <span>{unit.title}</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 shrink-0 inline-block group-hover:translate-x-1.5 transition-transform duration-300" />
                        </h3>
                        <p className="text-xs text-slate-300 truncate max-w-xl">{unit.description}</p>
                      </div>
                    </div>

                    {/* Node-Path Timeline Curve */}
                    <div className="relative py-4 flex flex-col items-center gap-8">
                      {/* Connecting Path Line */}
                      <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-teal-500/40 via-amber-500/30 to-slate-800 rounded-full z-0" />

                      {unit.lessons.map((lesson: any, lessonIdx: number) => {
                        const isCompleted = completedLessons.includes(lesson.order.toString());
                        const isCurrent = !isCompleted && (
                          (unitIdx === 0 && lessonIdx === 0 && completedLessons.length === 0) ||
                          completedLessons.includes((lesson.order - 1).toString())
                        );
                        const isLocked = !isCompleted && !isCurrent;

                        // Wiggle zigzag offset for visual rhythm
                        const xOffset = lessonIdx % 2 === 0 ? '-translate-x-12 sm:-translate-x-24' : 'translate-x-12 sm:translate-x-24';

                        return (
                          <div key={lesson.order} className={`relative z-10 flex flex-col items-center transition-transform ${xOffset}`}>
                            <Link
                              href={isLocked ? '#' : `/${locale}/learn/${lesson.order}`}
                              className={`group relative flex flex-col items-center select-none ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            >
                              {/* Node Circle Button */}
                              <div
                                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-300 ${
                                  isCompleted
                                    ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/30 group-hover:scale-105'
                                    : isCurrent
                                    ? 'bg-gradient-to-tr from-teal-400 to-emerald-400 border-white text-slate-950 ring-4 ring-teal-500/40 shadow-teal-500/50 animate-pulse group-hover:scale-110'
                                    : 'bg-slate-900 border-slate-800 text-slate-500'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                                ) : isCurrent ? (
                                  <Play className="w-8 h-8 fill-slate-950 ml-1" />
                                ) : (
                                  <Lock className="w-7 h-7" />
                                )}
                              </div>

                              {/* Lesson Title Badge */}
                              <div className="mt-2 text-center max-w-[180px]">
                                <span className={`text-xs font-extrabold block truncate ${isCurrent ? 'text-teal-300' : 'text-slate-300'}`}>
                                  {lesson.title}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {lesson.words?.length || 5} từ • +{lesson.xpReward || 20} XP
                                </span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT 4 COLUMNS: BENTO STATS & LEADERBOARD */}
          <motion.div variants={itemVariants} className="relative z-10 lg:col-span-4 space-y-6 sticky top-24">
            {/* Daily Momentum Progress Card */}
            <MotionCard glow="amber" tilt spotlight className="space-y-4 relative overflow-visible">
              {/* Mascot Peeking Sticker with x2 XP Badge */}
              <div className="absolute -top-7 -right-2 z-20 flex items-center select-none pointer-events-none">
                <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full shadow-lg -mr-2 z-10 border border-amber-300 animate-pulse">
                  x2 XP
                </span>
                <div className="relative w-14 h-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                  <Image
                    src="/mascot/cow_salute.png"
                    alt="Mascot Mascot"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pr-16">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{isVi ? 'Tiến Độ Hôm Nay' : 'Daily Momentum'}</span>
                </span>
                <span className="font-mono text-xs font-extrabold text-amber-300">
                  {dailyProgress} / {dailyGoal}m
                </span>
              </div>

              <ProgressBar value={dailyProgress} max={dailyGoal} color="amber" />
              <p className="text-xs text-slate-400 font-sans">
                {isVi ? 'Duy trì học 15 phút mỗi ngày để mở khóa x2 XP chuỗi Streak!' : 'Maintain 15 mins daily to unlock 2x XP streak multiplier!'}
              </p>
            </MotionCard>

            {/* Leaderboard Bento Card (Top Người Học) */}
            <Card glow="teal" className="space-y-3.5 border-teal-500/30 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isVi ? 'Bảng Vàng Tuần' : 'Weekly Leaderboard'}</span>
                </span>
                <Link
                  href={`/${locale}/community/leaderboard`}
                  onClick={() => soundFx.playClick()}
                  className="text-[10px] font-extrabold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-0.5 rounded-lg border border-teal-500/20 transition-all flex items-center gap-1"
                >
                  <span>{isVi ? 'Xem tất cả' : 'View all'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {leaderboard.map((user, i) => {
                  const medalRankStyles = [
                    'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-slate-950/80 border-amber-400/50 shadow-md shadow-amber-500/10',
                    'bg-gradient-to-r from-slate-400/20 via-slate-300/10 to-slate-950/80 border-slate-300/40 shadow-sm',
                    'bg-gradient-to-r from-amber-800/25 via-orange-800/10 to-slate-950/80 border-amber-700/40 shadow-sm',
                  ];
                  const rankStyle = i < 3 ? medalRankStyles[i] : 'bg-slate-950/60 border-slate-800 text-slate-300';

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        user.isCurrent
                          ? 'bg-teal-500/20 border-teal-400/60 text-teal-200 ring-1 ring-teal-400/30'
                          : rankStyle
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-black w-6 text-center">{user.medal}</span>
                        <div className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black text-[11px] ${
                          i === 0 ? 'bg-amber-500/20 border-amber-400 text-amber-300' :
                          i === 1 ? 'bg-slate-500/20 border-slate-300 text-slate-200' :
                          i === 2 ? 'bg-amber-800/30 border-amber-600 text-amber-400' :
                          'bg-slate-800 border-slate-700 text-teal-300'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold block truncate max-w-[130px] text-white">{user.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{user.words}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {user.xp} XP
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Cheerful Mascot Sticker near bottom right of Leaderboard */}
              <div className="absolute -bottom-6 -right-5 z-20 pointer-events-none select-none">
                <div className="relative w-14 h-14 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/mascot/cow_greet_heart.png"
                    alt="LingLing Cheering"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Card>

            {/* Daily Quests Bento Card (Nhiệm Vụ Hàng Ngày) */}
            <Card glow="teal" className="space-y-4 border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>{isVi ? 'Nhiệm Vụ Hàng Ngày' : 'Daily Quests'}</span>
                </span>
                <span className="text-[10px] font-mono font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  {dailyQuests.filter((q) => q.current >= q.target).length}/{dailyQuests.length} {isVi ? 'Hoàn thành' : 'Done'}
                </span>
              </div>

              <div className="space-y-2.5">
                {dailyQuests.map((quest) => {
                  const isDone = quest.current >= quest.target;
                  return (
                    <div
                      key={quest.id}
                      className={`p-3 rounded-2xl border transition-all space-y-2 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{quest.icon}</span>
                          <span className="truncate max-w-[160px]">{quest.title}</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                          +{quest.xpReward} XP
                        </span>
                      </div>

                      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-400'
                          }`}
                          style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>
                          {quest.current}/{quest.target}
                        </span>
                        {isDone ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> {isVi ? 'Đã nhận quà' : 'Claimed'}
                          </span>
                        ) : (
                          <span className="text-purple-300 font-semibold">{isVi ? 'Đang làm' : 'In progress'}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Weekly Habit Rhythm */}
            <Card glow="teal" className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Nhịp Học Tuần Này' : 'Weekly Rhythm'}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">7 ngày gần nhất</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block">{d}</span>
                    <div
                      className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center font-bold text-xs ${
                        i < 4
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                          : i === 4
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-1 ring-amber-400'
                          : 'bg-slate-950/60 text-slate-600 border border-slate-850'
                      }`}
                    >
                      {i < 4 ? '✓' : i === 4 ? '🔥' : '·'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Practice Launcher */}
            <Card glow="teal" className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 block">
                {isVi ? 'Phòng Thực Hành Nhanh' : 'Quick Practice Labs'}
              </span>
              <div className="space-y-2">
                <Link
                  href={`/${locale}/speaking/pronunciation`}
                  className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 flex items-center justify-between text-xs transition-all group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-teal-300">🎙️ Luyện Phát Âm & Ngữ Điệu</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400" />
                </Link>

                <Link
                  href={`/${locale}/listening/dictation`}
                  className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 flex items-center justify-between text-xs transition-all group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-amber-300">🎧 Luyện Nghe Chép Chính Tả</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </Link>

                <Link
                  href={`/${locale}/writing/free`}
                  className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 flex items-center justify-between text-xs transition-all group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-purple-300">✍️ Luyện Viết & Sửa Lỗi AI</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Mascot Corner Reaction Popup */}
        <MascotPopup
          isVisible={popupState.show}
          reactionKey={popupState.key}
          title={popupState.title}
          message={popupState.msg}
          autoDismissMs={3500}
          onClose={() => setPopupState((prev) => ({ ...prev, show: false }))}
        />

        {/* Cinematic Reward Overlay */}
        <RewardOverlay event={activeReward} onDismiss={() => setActiveReward(null)} />
      </motion.div>
    </>
  );
}
