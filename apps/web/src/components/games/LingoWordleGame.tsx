'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, HelpCircle, RotateCcw, Sparkles, Check, Lightbulb } from 'lucide-react';
import { arcadeAudio } from '@/lib/arcadeAudio';
import { WordleTarget } from '@/lib/data/universalMasterData';

interface LingoWordleProps {
  target: WordleTarget;
  onWin: (score: number, guesses: number) => void;
  onLose: () => void;
  onRestart: () => void;
  isVi?: boolean;
}

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export default function LingoWordleGame({
  target,
  onWin,
  onLose,
  onRestart,
  isVi = true,
}: LingoWordleProps) {
  const maxGuesses = 6;
  const wordLength = 5;
  const targetWord = target.word.toUpperCase();

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [shakeRow, setShakeRow] = useState<boolean>(false);

  // Keyboard letter color map
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({});

  // Audio pronunciation
  const playWordAudio = useCallback(() => {
    arcadeAudio.playLaser();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [targetWord]);

  // Compute status for row
  const getRowStatuses = (guess: string): LetterStatus[] => {
    const statuses: LetterStatus[] = Array(wordLength).fill('absent');
    const targetArr = targetWord.split('');
    const guessArr = guess.split('');

    // First pass: find exact matches
    guessArr.forEach((char, idx) => {
      if (char === targetArr[idx]) {
        statuses[idx] = 'correct';
        targetArr[idx] = '#'; // Mark consumed
      }
    });

    // Second pass: find partial matches
    guessArr.forEach((char, idx) => {
      if (statuses[idx] !== 'correct') {
        const foundIdx = targetArr.indexOf(char);
        if (foundIdx !== -1) {
          statuses[idx] = 'present';
          targetArr[foundIdx] = '#';
        }
      }
    });

    return statuses;
  };

  // Submit guess
  const handleSubmitGuess = () => {
    if (currentGuess.length !== wordLength || isGameOver) {
      setShakeRow(true);
      arcadeAudio.playBuzzer();
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Update keyboard statuses
    const newStatuses = { ...letterStatuses };
    const rowStatus = getRowStatuses(currentGuess);
    currentGuess.split('').forEach((char, idx) => {
      const existing = newStatuses[char];
      const current = rowStatus[idx];
      if (current === 'correct') {
        newStatuses[char] = 'correct';
      } else if (current === 'present' && existing !== 'correct') {
        newStatuses[char] = 'present';
      } else if (!existing) {
        newStatuses[char] = 'absent';
      }
    });
    setLetterStatuses(newStatuses);

    // Win condition
    if (currentGuess === targetWord) {
      setHasWon(true);
      setIsGameOver(true);
      arcadeAudio.playVictoryFanfare();
      playWordAudio();
      const earnedScore = Math.max(100, 350 - (newGuesses.length - 1) * 40);
      setTimeout(() => onWin(earnedScore, newGuesses.length), 1200);
    } else if (newGuesses.length >= maxGuesses) {
      // Lose condition
      setIsGameOver(true);
      arcadeAudio.playGameOver();
      setTimeout(() => onLose(), 1500);
    } else {
      arcadeAudio.playTick(false);
      setCurrentGuess('');
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      if (e.key === 'Enter') {
        handleSubmitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
        arcadeAudio.playLaser();
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + e.key.toUpperCase());
        arcadeAudio.playLaser();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, isGameOver, guesses]);

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto select-none">
      {/* Target Clue & Action Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showHint
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{isVi ? 'Gợi Ý' : 'Hint'}</span>
          </button>

          <button
            onClick={playWordAudio}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-cyan-400 hover:text-cyan-300 border border-slate-800 flex items-center gap-1.5 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{target.phoneticUs}</span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {isVi ? 'Lượt thử' : 'Attempts'}
          </span>
          <span className="font-mono font-extrabold text-sm text-amber-300">
            {guesses.length} / {maxGuesses}
          </span>
        </div>
      </div>

      {/* Clue Panel (Collapsible) */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-1 overflow-hidden"
          >
            <p className="font-bold">💡 Gợi ý nghĩa: {target.meaningVi}</p>
            <p className="text-amber-300/80 text-xs italic">{target.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5x6 Wordle Board Grid */}
      <div className="flex flex-col items-center gap-2.5">
        {Array.from({ length: maxGuesses }).map((_, rowIdx) => {
          const isCurrentRow = rowIdx === guesses.length;
          const guess = guesses[rowIdx] || (isCurrentRow ? currentGuess : '');
          const rowStatuses = guesses[rowIdx] ? getRowStatuses(guesses[rowIdx]) : [];

          return (
            <div
              key={rowIdx}
              className={`flex gap-2.5 ${isCurrentRow && shakeRow ? 'animate-bounce' : ''}`}
            >
              {Array.from({ length: wordLength }).map((_, colIdx) => {
                const char = guess[colIdx] || '';
                const status = rowStatuses[colIdx];

                let bgClass = 'bg-slate-950/80 border-slate-800 text-white';
                if (status === 'correct') bgClass = 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/50';
                else if (status === 'present') bgClass = 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-950/50';
                else if (status === 'absent') bgClass = 'bg-slate-800/80 border-slate-700 text-slate-400';
                else if (char) bgClass = 'bg-slate-900 border-cyan-500/60 text-white scale-105';

                return (
                  <motion.div
                    key={colIdx}
                    animate={char ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.15 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center font-display font-black text-xl sm:text-2xl transition-all ${bgClass}`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Virtual On-Screen Keyboard */}
      <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const status = letterStatuses[key];
              let keyBg = 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800';
              if (status === 'correct') keyBg = 'bg-emerald-600 text-white border-emerald-500';
              else if (status === 'present') keyBg = 'bg-amber-600 text-white border-amber-500';
              else if (status === 'absent') keyBg = 'bg-slate-800 text-slate-500 border-slate-800 opacity-60';

              const isAction = key === 'ENTER' || key === '⌫';

              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isGameOver) return;
                    if (key === 'ENTER') handleSubmitGuess();
                    else if (key === '⌫') {
                      setCurrentGuess((prev) => prev.slice(0, -1));
                      arcadeAudio.playLaser();
                    } else if (currentGuess.length < wordLength) {
                      setCurrentGuess((prev) => prev + key);
                      arcadeAudio.playLaser();
                    }
                  }}
                  className={`h-11 sm:h-12 rounded-xl font-bold border transition-all active:scale-90 flex items-center justify-center ${
                    isAction ? 'px-2.5 sm:px-3 text-xs bg-slate-850 hover:bg-slate-800 text-white' : 'w-8 sm:w-10 text-sm'
                  } ${keyBg}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Target Word Revealed when Game Over */}
      {isGameOver && !hasWon && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
          <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">
            {isVi ? 'Từ bí mật là:' : 'The secret word was:'}
          </p>
          <p className="text-2xl font-black text-white">{targetWord}</p>
          <p className="text-xs text-slate-300">
            ({target.meaningVi} • {target.phoneticUs})
          </p>
        </div>
      )}
    </div>
  );
}
