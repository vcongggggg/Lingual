'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Headphones, ArrowLeft } from 'lucide-react';
import { SAMPLE_LISTENING_EXERCISES } from '@/lib/listening/sampleData';
import { DictationResult } from '@linguaflow/domain';
import DictationExercise from '@/components/listening/DictationExercise';
import ListeningProgress from '@/components/listening/ListeningProgress';
import ListeningResult from '@/components/listening/ListeningResult';

export default function DictationPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const exercises = SAMPLE_LISTENING_EXERCISES.filter((ex) => ex.modes.includes('dictation'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [accuracyList, setAccuracyList] = useState<number[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  const currentExercise = exercises[currentIndex] || exercises[0];

  const handleComplete = (res: DictationResult) => {
    setAccuracyList((prev) => [...prev, res.accuracy]);
    setSessionXP((prev) => prev + res.xpEarned);
    if (res.completed) {
      setCompletedCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setSessionXP(0);
    setAccuracyList([]);
    setCompletedCount(0);
  };

  const averageAccuracy = accuracyList.length > 0
    ? Math.round(accuracyList.reduce((a, b) => a + b, 0) / accuracyList.length)
    : 0;

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/listening`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Listening Lab</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400">
          <Headphones className="w-4 h-4" />
          <span>Chép chính tả (Dictation)</span>
        </div>
      </div>

      {isFinished ? (
        <ListeningResult
          mode="dictation"
          totalExercises={exercises.length}
          completedExercises={completedCount}
          averageAccuracy={averageAccuracy}
          totalXPEarned={sessionXP}
          onRetry={handleRetry}
          locale={locale}
        />
      ) : (
        <div className="space-y-6">
          <ListeningProgress
            currentIndex={currentIndex}
            totalExercises={exercises.length}
            difficulty={currentExercise.difficulty}
            category={currentExercise.category}
            sessionXP={sessionXP}
          />

          <DictationExercise
            key={currentExercise.id}
            exercise={currentExercise}
            onComplete={handleComplete}
            onNext={handleNext}
            hasNext={currentIndex < exercises.length - 1}
          />
        </div>
      )}
    </main>
  );
}
