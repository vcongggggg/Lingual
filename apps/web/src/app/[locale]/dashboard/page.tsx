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
      icon: <Headphones className="w-5 h-5 text-amber-400" />,
      href: `/${locale}/listening`,
      borderColor: 'hover:border-amber-500/50',
      bgGlow: 'from-amber-500/10 to-slate-900/90',
    },
    {
      title: isVi ? 'Kho Từ Vựng' : 'Vocabulary',
      sub: isVi ? '3000+ từ cốt lõi' : 'Core Flashcards',
      icon: <BookOpen className="w-5 h-5 text-teal-400" />,
      href: `/${locale}/vocabulary`,
      borderColor: 'hover:border-teal-500/50',
      bgGlow: 'from-teal-500/10 to-slate-900/90',
    },
    {
      title: isVi ? 'Luyện Phát Âm' : 'Pronunciation',
      sub: isVi ? 'Chuẩn ngữ điệu IPA' : 'Phoneme & Tone',
      icon: <Mic className="w-5 h-5 text-emerald-400" />,
      href: `/${locale}/speaking/pronunciation`,
      borderColor: 'hover:border-emerald-500/50',
      bgGlow: 'from-emerald-500/10 to-slate-900/90',
    },
    {
      title: isVi ? 'Luyện Thi' : 'Exam Prep',
      sub: isVi ? 'TOEIC & IELTS Band' : 'Mock Tests',
      icon: <Trophy className="w-5 h-5 text-coral-400" />,
      href: `/${locale}/exam-practice`,
      borderColor: 'hover:border-coral-500/50',
      bgGlow: 'from-coral-500/10 to-slate-900/90',
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

        {/* 1. BENTO QUICK ACCESS BAR */}
        <motion.div variants={itemVariants} className="space-y-3 relative z-10">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>{isVi ? 'Truy Cập Nhanh' : 'Quick Access'}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAccessItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`p-4 rounded-3xl bg-gradient-to-b ${item.bgGlow} border border-slate-800/80 ${item.borderColor} transition-all duration-200 group shadow-lg flex flex-col justify-between h-28`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-white group-hover:text-teal-300 transition-colors block">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    {item.sub}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 2. BENTO MAIN GRID ROW (8 cols main + 4 cols sidebar) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: MISSION HERO & ROADMAP */}
          <motion.div variants={itemVariants} className="relative z-10 lg:col-span-8 space-y-8">
            {/* HERO COMMAND MISSION CARD */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isVi ? 'Nhiệm Vụ Trọng Tâm Hôm Nay' : "Today's Core Mission"}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {nextLesson ? `${nextLesson.unit.title} • ${nextLesson.lesson.title}` : (isVi ? 'Tiếp tục lộ trình chinh phục tiếng Anh' : 'Continue Your English Mastery')}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {isVi
                      ? `Hoàn thành bài học tiếp theo để nhận +${nextLesson?.lesson.xpReward || 50} XP và củng cố thói quen học tập liên tục!`
                      : `Complete the next lesson to earn +${nextLesson?.lesson.xpReward || 50} XP and maintain your daily study momentum!`}
                  </p>
                </div>

                {nextLesson && (
                  <Link href={`/${locale}/learn/${nextLesson.lesson.order}`} className="shrink-0 w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto shadow-xl shadow-teal-500/20"
                      icon={<Play className="w-5 h-5 fill-slate-950" />}
                    >
                      {isVi ? 'Bắt Đầu Học Ngay' : 'Resume Learning'}
                    </Button>
                  </Link>
                )}
              </div>

              {/* 3 PRIORITIZED DAILY ACTION TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                <Link
                  href={nextLesson ? `/${locale}/learn/${nextLesson.lesson.order}` : '#'}
                  className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">1. Bài Học Mới</span>
                    <span className="text-xs font-extrabold text-white group-hover:text-teal-300 transition-colors truncate block max-w-[130px]">
                      {nextLesson ? nextLesson.lesson.title : 'Hoàn thành bài'}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-teal-400 shrink-0" />
                </Link>

                <Link
                  href={`/${locale}/srs`}
                  className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">2. Thẻ Nhớ Thông Minh</span>
                    <span className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      {dueSrsCount} từ đến hạn ôn
                    </span>
                  </div>
                  <Brain className="w-4 h-4 text-amber-400 shrink-0" />
                </Link>

                <Link
                  href={`/${locale}/games`}
                  className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-400/40 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">3. Thử Thách Game</span>
                    <span className="text-xs font-extrabold text-white group-hover:text-purple-300 transition-colors">
                      Word Sprint x2 XP
                    </span>
                  </div>
                  <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
                </Link>
              </div>
            </div>

            {/* UNIT & LESSON NODE-PATH ROADMAP */}
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 block">
                    {isVi ? 'Lộ Trình Từng Bước (A1 → B2)' : 'Curriculum Roadmap (A1 → B2)'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
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
                    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${cefrColors[unitCefrLevel] || cefrColors.A1} border backdrop-blur-2xl p-6 flex items-center justify-between shadow-xl`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${cefrBadgeColors[unitCefrLevel] || cefrBadgeColors.A1} border text-xs font-bold`}>
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Unit {unit.order}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${cefrBadgeColors[unitCefrLevel] || cefrBadgeColors.A1} border`}>
                            {unitCefrLevel}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">{unit.title}</h3>
                        <p className="text-xs text-slate-400">{unit.description}</p>
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
            <MotionCard glow="amber" tilt spotlight className="space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
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
            <Card glow="teal" className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Bảng Vàng Tuần' : 'Weekly Leaderboard'}</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                  Top 5
                </span>
              </div>

              <div className="space-y-2">
                {leaderboard.map((user, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      user.isCurrent
                        ? 'bg-teal-500/15 border-teal-500/40 text-teal-200'
                        : 'bg-slate-950/60 border-slate-850 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black w-5 text-center">{user.medal}</span>
                      <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-[11px] text-teal-300">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold block truncate max-w-[110px]">{user.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{user.words}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-400 font-mono">
                      {user.xp} XP
                    </span>
                  </div>
                ))}
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
