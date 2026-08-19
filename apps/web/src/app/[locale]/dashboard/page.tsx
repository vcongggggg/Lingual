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
} from 'lucide-react';
import MascotPopup from '@/components/MascotPopup';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';

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

  useEffect(() => {
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

  if (loading && units.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">{isVi ? 'Đang khởi tạo Cockpit học tập...' : 'Loading Learning Cockpit...'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={dashboardContainerVariants}
      initial="hidden"
      animate="visible"
      className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20"
    >
      {/* AMBIENT DEEP SPACE GLOW */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* MAIN COCKPIT & ROADMAP (8 COLUMNS) */}
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
                <span className="text-xs font-extrabold text-white group-hover:text-teal-300 transition-colors">
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
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">2. Ôn Thẻ SRS</span>
                <span className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {dueSrsCount} từ đến hạn
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

                    return (
                      <motion.div
                        key={lesson.order}
                        whileHover={isLocked || shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
                        whileTap={isLocked || shouldReduceMotion ? undefined : { scale: 0.96 }}
                        transition={springPresets.smooth}
                        className="relative z-10 flex flex-col items-center group"
                      >
                        <Link
                          href={isLocked ? '#' : `/${locale}/learn/${lesson.order}`}
                          className={`relative w-20 h-20 rounded-3xl flex items-center justify-center font-display font-bold text-lg shadow-2xl transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20 border-2 border-emerald-300'
                              : isCurrent
                              ? 'bg-gradient-to-tr from-coral-500 via-amber-500 to-orange-400 text-slate-950 shadow-amber-500/30 border-2 border-amber-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8 text-slate-950" />
                          ) : isCurrent ? (
                            <Play className="w-8 h-8 text-slate-950 ml-1 fill-slate-950" />
                          ) : (
                            <Lock className="w-6 h-6 text-slate-600" />
                          )}

                          {isCurrent && !shouldReduceMotion && (
                            <span className="absolute -inset-2 rounded-[32px] bg-amber-400/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
                          )}
                        </Link>

                        <div className="mt-3 px-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-center max-w-xs shadow-lg">
                          <span className="text-xs font-bold text-slate-200 block">{lesson.title}</span>
                          <span className="text-[10px] text-teal-400 font-semibold">+{lesson.xpReward} XP</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* RIGHT SIDEBAR VITAL STATS RAIL (4 COLUMNS) */}
      <motion.div variants={itemVariants} className="relative z-10 lg:col-span-4 space-y-6 sticky top-24">
        {/* Daily Goal & Streak Card */}
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

        {/* Quick Diagnostics Lab Launcher */}
        <Card glow="teal" className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 block">
            {isVi ? 'Phòng Thực Hành Nhanh' : 'Quick Practice Labs'}
          </span>
          <div className="space-y-2">
            <Link
              href={`/${locale}/speaking/pronunciation`}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 flex items-center justify-between text-xs transition-all group"
            >
              <span className="font-bold text-slate-300 group-hover:text-teal-300">🎙️ Luyện Phát Âm Phoneme</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400" />
            </Link>

            <Link
              href={`/${locale}/listening/dictation`}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 flex items-center justify-between text-xs transition-all group"
            >
              <span className="font-bold text-slate-300 group-hover:text-amber-300">🎧 Chép Chính Tả Dictation</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
            </Link>

            <Link
              href={`/${locale}/writing/free`}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-850 flex items-center justify-between text-xs transition-all group"
            >
              <span className="font-bold text-slate-300 group-hover:text-purple-300">✍️ Studio Viết Tự Do</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
            </Link>
          </div>
        </Card>
      </motion.div>

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
  );
}
