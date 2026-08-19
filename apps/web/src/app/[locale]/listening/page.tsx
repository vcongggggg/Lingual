'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Headphones, Mic, Sparkles, Trophy, Play, CheckCircle2, Flame, Filter, Volume2, BookOpen } from 'lucide-react';
import { ListeningDifficulty, ListeningMode, ListeningExercise, DictationResult, ShadowingResult } from '@linguaflow/domain';
import { SAMPLE_LISTENING_EXERCISES } from '@/lib/listening/sampleData';
import ListeningModeSelector from '@/components/listening/ListeningModeSelector';
import ListeningProgress from '@/components/listening/ListeningProgress';
import DictationExercise from '@/components/listening/DictationExercise';
import ShadowingExercise from '@/components/listening/ShadowingExercise';
import ListeningResult from '@/components/listening/ListeningResult';
import KaraokeAudioStudio from '@/components/listening/KaraokeAudioStudio';
import LingLingMascot from '@/components/LingLingMascot';
import { Badge, Card, useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListeningLabPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const { shouldReduceMotion } = useMotionAccessibility();

  const [activeMode, setActiveMode] = useState<ListeningMode>('dictation');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ListeningDifficulty | 'ALL'>('ALL');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [isPlayingSession, setIsPlayingSession] = useState<boolean>(false);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  // Session stats tracking
  const [sessionXP, setSessionXP] = useState<number>(0);
  const [accuracyList, setAccuracyList] = useState<number[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return SAMPLE_LISTENING_EXERCISES.filter((ex) => {
      const modeMatch = ex.modes.includes(activeMode);
      const diffMatch = selectedDifficulty === 'ALL' || ex.difficulty === selectedDifficulty;
      return modeMatch && diffMatch;
    });
  }, [activeMode, selectedDifficulty]);

  const currentExercise = filteredExercises[activeExerciseIndex] || filteredExercises[0];

  const handleStartExercise = (index: number) => {
    setActiveExerciseIndex(index);
    setIsPlayingSession(true);
    setIsSessionFinished(false);
  };

  const handleDictationComplete = (res: DictationResult) => {
    setAccuracyList((prev) => [...prev, res.accuracy]);
    setSessionXP((prev) => prev + res.xpEarned);
    if (res.completed) {
      setCompletedCount((prev) => prev + 1);
    }
  };

  const handleShadowingComplete = (res: ShadowingResult) => {
    setAccuracyList((prev) => [...prev, res.similarity]);
    setSessionXP((prev) => prev + res.xpEarned);
    if (res.completed) {
      setCompletedCount((prev) => prev + 1);
    }
  };

  const handleNextExercise = () => {
    if (activeExerciseIndex < filteredExercises.length - 1) {
      setActiveExerciseIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handleResetSession = () => {
    setActiveExerciseIndex(0);
    setIsSessionFinished(false);
    setIsPlayingSession(true);
    setSessionXP(0);
    setAccuracyList([]);
    setCompletedCount(0);
  };

  const averageAccuracy = accuracyList.length > 0
    ? Math.round(accuracyList.reduce((a, b) => a + b, 0) / accuracyList.length)
    : 0;

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto">
      {/* Header Banner with LingLing Mascot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-teal-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-teal-400" />
              <span>Phòng Luyện Nghe Nói Chuyên Sâu • Listening Lab</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Luyện Tai Chuẩn Xác. <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                Phản Xạ Phát Âm Bản Xứ.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Rèn luyện đôi tai bằng phương pháp <strong>Chép chính tả (Dictation)</strong> và làm chủ ngữ điệu với <strong>Nhại giọng (Shadowing)</strong>.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <LingLingMascot state={isPlayingSession ? 'speaking' : 'idle'} size={120} />
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <ListeningModeSelector
        activeMode={activeMode}
        onSelectMode={(mode) => {
          setActiveMode(mode);
          setActiveExerciseIndex(0);
          setIsPlayingSession(false);
          setIsSessionFinished(false);
        }}
      />

      {/* Main Practice Area */}
      {isSessionFinished ? (
        <ListeningResult
          mode={activeMode}
          totalExercises={filteredExercises.length}
          completedExercises={completedCount}
          averageAccuracy={averageAccuracy}
          totalXPEarned={sessionXP}
          onRetry={handleResetSession}
          locale={locale}
        />
      ) : isPlayingSession && currentExercise ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsPlayingSession(false)}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              ← Trở về danh sách bài nghe
            </button>

            <span className="text-xs font-mono text-teal-400 font-bold">
              Chế độ: {activeMode === 'dictation' ? '🎧 Dictation' : '🎙️ Shadowing'}
            </span>
          </div>

          <ListeningProgress
            currentIndex={activeExerciseIndex}
            totalExercises={filteredExercises.length}
            difficulty={currentExercise.difficulty}
            category={currentExercise.category}
            sessionXP={sessionXP}
          />

          {/* Studio Audio Karaoke Player */}
          <KaraokeAudioStudio
            text={currentExercise.transcript || currentExercise.title}
            audioUrl={currentExercise.audioUrl}
            translation={currentExercise.translation}
            title={currentExercise.title}
            locale={locale}
          />

          {activeMode === 'dictation' ? (
            <DictationExercise
              key={`dictation-${currentExercise.id}`}
              exercise={currentExercise}
              onComplete={handleDictationComplete}
              onNext={handleNextExercise}
              hasNext={activeExerciseIndex < filteredExercises.length - 1}
            />
          ) : (
            <ShadowingExercise
              key={`shadowing-${currentExercise.id}`}
              exercise={currentExercise}
              onComplete={handleShadowingComplete}
              onNext={handleNextExercise}
              hasNext={activeExerciseIndex < filteredExercises.length - 1}
            />
          )}
        </div>
      ) : (
        /* Exercise Selection Grid */
        <div className="space-y-6">
          {/* Difficulty Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
              {(['ALL', 'A1', 'A2', 'B1'] as const).map((diff) => {
                const isActive = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setActiveExerciseIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {diff === 'ALL' ? 'Tất cả cấp độ' : `Cấp độ ${diff}`}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Hiển thị {filteredExercises.length} bài nghe chất lượng cao
            </div>
          </div>

          {/* Grid of Audio Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise, idx) => {
              const diffColor =
                exercise.difficulty === 'A1'
                  ? 'emerald'
                  : exercise.difficulty === 'A2'
                  ? 'teal'
                  : 'amber';

              return (
                <Card
                  key={exercise.id}
                  glow="teal"
                  onClick={() => handleStartExercise(idx)}
                  className="flex flex-col justify-between space-y-4 hover:border-teal-400/50 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={diffColor}>
                        {exercise.difficulty} • {exercise.category}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                        ~{exercise.durationSeconds}s
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-extrabold text-lg text-white group-hover:text-teal-300 transition-colors">
                        {exercise.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {exercise.translation}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {exercise.tags?.slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/60 text-[10px] text-slate-400 font-mono uppercase"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
                      <span>Bắt đầu</span>
                      <Play className="w-3.5 h-3.5 fill-teal-400" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
