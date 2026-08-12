'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, ProgressBar, XPBadge, StreakBadge } from '@linguaflow/ui';
import { curriculumApi, userApi } from '../../../lib/api';
import { BookOpen, CheckCircle2, Lock, Play, Star, Flame, Trophy, Sparkles, Brain, ArrowRight } from 'lucide-react';
import ThemeIllustration from '@/components/ThemeIllustration';
import MascotPopup from '@/components/MascotPopup';
import Image from 'next/image';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';


export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [units, setUnits] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userXP, setUserXP] = useState(150);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [dailyProgress, setDailyProgress] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [unitsData, progressData] = await Promise.allSettled([
          curriculumApi.getUnits(),
          userApi.getProgress().catch(() => null),
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
      } catch {
        // Fallback: units will load from API even without progress data
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [popupState, setPopupState] = useState<{ show: boolean; key: MascotReactionKey; title?: string; msg?: string }>({
    show: false,
    key: 'relax_done',
  });

  useEffect(() => {
    if (!loading) {
      if (dailyProgress >= dailyGoal) {
        setPopupState({
          show: true,
          key: 'relax_done',
          title: 'Mục tiêu hôm nay hoàn thành! 🎉',
          msg: 'Bò LingLing đang nằm thư giãn cùng bạn nè!',
        });
      } else {
        const timer = setTimeout(() => {
          setPopupState({
            show: true,
            key: 'streak_urgent',
            title: 'Cảnh báo Streak! ⚠️',
            msg: 'Streak sắp hết hạn! Hoàn thành 1 bài học ngay nào!',
          });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, dailyProgress, dailyGoal]);

  if (loading && units.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">Đang tải lộ trình học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* MAIN ROADMAP PATH (8 COLUMNS) */}
      <div className="lg:col-span-8 space-y-12">
        {/* Header Title with Peeking Cow Mascot */}
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
          <div className="absolute -top-7 right-8 w-16 h-16 pointer-events-none hidden sm:block">
            <img
              src={mascotReactions.greet}
              alt="Peeking Dashboard Mascot"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
              Lộ Trình Học Cá Nhân Hóa (A1 → B1)
            </span>
            <h1 className="text-3xl font-display font-extrabold text-white mt-1">
              Hành Trình Chinh Phục Tiếng Anh
            </h1>
          </div>
          <Link href={`/${locale}/srs`}>
            <Button variant="accent" icon={<Brain className="w-4 h-4" />}>
              Ôn Từ Vựng SRS
            </Button>
          </Link>
        </div>

        {/* UNIT & LESSON NODE-PATH ROADMAP */}
        <div className="space-y-16">
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
              <div key={unit.order} className="relative space-y-8">
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
                    <h2 className="text-2xl font-display font-bold text-white">{unit.title}</h2>
                    <p className="text-xs text-slate-400">{unit.description}</p>
                  </div>
                </div>

                {/* Node-Path Timeline Curve */}
                <div className="relative py-4 flex flex-col items-center gap-10">
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
                        whileHover={{ scale: isLocked ? 1 : 1.06 }}
                        whileTap={{ scale: isLocked ? 1 : 0.95 }}
                        className="relative z-10 flex flex-col items-center group"
                      >
                        <Link
                          href={isLocked ? '#' : `/${locale}/learn/${lesson.order}`}
                          className={`relative w-20 h-20 rounded-3xl flex items-center justify-center font-display font-bold text-lg shadow-2xl transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20 border-2 border-emerald-300'
                              : isCurrent
                              ? 'bg-gradient-to-tr from-coral-500 via-amber-500 to-orange-400 text-slate-950 shadow-amber-500/30 border-2 border-amber-300 animate-pulse'
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

                          {isCurrent && (
                            <span className="absolute -inset-2 rounded-[32px] bg-amber-400/20 animate-ping pointer-events-none" />
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
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDEBAR STATS & GOAL WIDGET (4 COLUMNS) */}
      <div className="lg:col-span-4 space-y-6 sticky top-24">
        <Card glow="amber" className="space-y-4 relative overflow-visible">
          {/* Peeking Mascot Sitting on Goal Card */}
          <div className="absolute -top-8 -right-2 w-14 h-14 pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
            <img
              src={mascotReactions.relax_done}
              alt="Peeking Goal Mascot"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Mục Tiêu Hôm Nay
            </span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-slate-300">Thời lượng học:</span>
              <span className="font-extrabold text-white">{dailyProgress} / {dailyGoal} phút</span>
            </div>
            <ProgressBar value={dailyProgress} max={dailyGoal} color="amber" />
          </div>
          <p className="text-xs text-slate-400">Hoàn thành 1 bài học để duy trì chuỗi Streak!</p>
        </Card>

        {/* Quick Stats */}
        <Card glow="teal" className="space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
            Thống kê nhanh
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-2xl font-extrabold text-white">{units.length}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Chủ đề</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-2xl font-extrabold text-teal-400">{completedLessons.length}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Bài hoàn thành</span>
            </div>
          </div>
        </Card>

        <Card glow="teal" className="space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
              Game Center
            </span>
            <Trophy className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-display font-bold text-white">Thử Thách Nâng Cao</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chơi Word Match, Sentence Scramble & Typing Race để nhân đôi điểm XP.
              </p>
            </div>
            <ThemeIllustration type="dashboard" size={70} className="shrink-0 hidden sm:block" />
          </div>
          <Link href={`/${locale}/games`} className="block">
            <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
              Vào Game Center
            </Button>
          </Link>
        </Card>
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
    </div>
  );
}

