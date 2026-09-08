'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles, Timer, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { arcadeAudio } from '@/lib/arcadeAudio';

export interface SoundQuestion {
  id: string;
  audioWord: string;
  phonetic?: string;
  translation: string;
  correct: string;
  options: string[];
}

interface SoundReflexProps {
  questions: SoundQuestion[];
  onCorrect: (e?: React.MouseEvent) => void;
  onWrong: (e?: React.MouseEvent) => void;
  onFinish: () => void;
  combo: number;
  isVi?: boolean;
}

export default function SoundReflexGame({
  questions,
  onCorrect,
  onWrong,
  onFinish,
  combo,
  isVi = true,
}: SoundReflexProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentIdx];

  // Play audio pronunciation with native SpeechSynthesis
  const playAudio = useCallback(() => {
    if (!currentQ) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.audioWord);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentQ]);

  // Auto-play audio when question changes
  useEffect(() => {
    if (currentQ) {
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(5);
      setTimeout(() => playAudio(), 200);
    }
  }, [currentIdx, currentQ, playAudio]);

  // 5-second countdown ticker
  useEffect(() => {
    if (isAnswered || !currentQ) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 2 && prev > 0) {
          arcadeAudio.playTick(true);
        }
        if (prev <= 1) {
          // Time expired -> count as wrong answer
          handleOptionClick('__TIMEOUT__');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isAnswered, currentQ]);

  const handleOptionClick = (opt: string, e?: React.MouseEvent) => {
    if (isAnswered || !currentQ) return;
    setIsAnswered(true);
    setSelectedOption(opt);

    if (opt === currentQ.correct) {
      onCorrect(e);
    } else {
      onWrong(e);
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        onFinish();
      }
    }, 800);
  };

  if (!currentQ) return null;

  return (
    <div className="space-y-6 max-w-xl mx-auto select-none">
      {/* Top Question Progress & Timer */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
        <span className="text-xs font-mono font-bold text-slate-400">
          {isVi ? 'Câu hỏi' : 'Question'} {currentIdx + 1} / {questions.length}
        </span>

        {/* 5-second Bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft <= 2 ? 'bg-rose-500' : 'bg-cyan-400'}`}
              animate={{ width: `${(timeLeft / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={`text-xs font-mono font-extrabold ${timeLeft <= 2 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Sound Play Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-950/90 border border-cyan-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            {isVi ? 'Lắng nghe phát âm chuẩn:' : 'Listen carefully:'}
          </span>
          <p className="text-xs text-slate-400">
            {currentQ.phonetic || '/.../'}
          </p>
        </div>

        {/* Big Pulse Audio Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={playAudio}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_55px_rgba(6,182,212,0.7)] transition-all cursor-pointer"
          >
            <Volume2 className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {isVi ? 'Nghe Lại' : 'Replay'}
            </span>
          </motion.button>
        </div>

        <p className="text-xs text-slate-400 italic">
          {isVi ? 'Bấm nút trên để nghe lại âm thanh hoặc chọn đáp án bên dưới' : 'Tap to replay or choose matching word below'}
        </p>
      </div>

      {/* 4 Interactive Answer Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentQ.correct;

          let btnClass = 'bg-slate-950/90 border-slate-800 text-white hover:border-cyan-500/60 hover:bg-slate-900';
          if (isAnswered) {
            if (isCorrect) {
              btnClass = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/50 scale-102';
            } else if (isSelected) {
              btnClass = 'bg-rose-600 border-rose-400 text-white animate-shake';
            } else {
              btnClass = 'bg-slate-950/60 border-slate-850 text-slate-500 opacity-60';
            }
          }

          return (
            <motion.button
              key={idx}
              disabled={isAnswered}
              onClick={(e) => handleOptionClick(opt, e)}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              className={`p-4 rounded-2xl border-2 font-display font-bold text-base transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{opt}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-200" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
