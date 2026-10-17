'use client';

import React, { useState } from 'react';
import { Zap, HelpCircle } from 'lucide-react';
import { arcadeAudio } from '@/lib/arcadeAudio';

export interface BlitzQuestion {
  id: string;
  q: string;
  targetText: string;
  correct: string;
  options: string[];
  phonetic?: string;
  category?: string;
}

interface FillBlitzGameProps {
  questions: BlitzQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  combo: number;
  onCorrect: (scoreDelta: number, e?: React.MouseEvent) => void;
  onWrong: (e?: React.MouseEvent) => void;
  onFinish: (score: number) => void;
  isVi?: boolean;
}

export default function FillBlitzGame({
  questions,
  difficulty,
  combo,
  onCorrect,
  onWrong,
  onFinish,
  isVi = true,
}: FillBlitzGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt: string, e?: React.MouseEvent) => {
    if (!currentQ || selectedOption !== null) return;
    arcadeAudio.playLaser();
    setSelectedOption(opt);

    const diffMultiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;

    if (opt === currentQ.correct) {
      const scoreDelta = Math.round(100 * combo * diffMultiplier);
      setTotalScore((prev) => prev + scoreDelta);
      onCorrect(scoreDelta, e);
    } else {
      onWrong(e);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        const finalCalculated = opt === currentQ.correct ? totalScore + Math.round(100 * combo * diffMultiplier) : totalScore;
        onFinish(finalCalculated);
      }
    }, 450);
  };

  if (!currentQ) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>
          {isVi ? `Câu ${currentIdx + 1} / ${questions.length}` : `Question ${currentIdx + 1} / ${questions.length}`}
        </span>
        <span className="text-amber-400 font-bold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Combo x{combo}</span>
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-display font-bold text-white text-center py-2 leading-relaxed">
        {currentQ.q}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentQ.options.map((opt: string, idx: number) => {
          const isChosen = selectedOption === opt;
          const isCorrectAnswer = opt === currentQ.correct;

          let btnStyle = 'bg-slate-950 border-slate-800 hover:border-amber-400 text-white';
          if (selectedOption !== null) {
            if (isCorrectAnswer) {
              btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-emerald-500/20';
            } else if (isChosen) {
              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={(e) => handleSelectOption(opt, e)}
              className={`p-4 rounded-2xl border font-bold text-sm transition-all active:scale-95 shadow-md text-left flex items-center justify-between cursor-pointer disabled:pointer-events-none ${btnStyle}`}
            >
              <span>{opt}</span>
              <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
