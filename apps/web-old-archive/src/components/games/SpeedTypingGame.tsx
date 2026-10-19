'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Zap } from 'lucide-react';
import { DecoderText } from '@/components/common/DecoderText';
import { arcadeAudio } from '@/lib/arcadeAudio';

export interface TypingQuestion {
  id: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  category?: string;
  exampleSentence?: string;
  word?: string;
  meaningVi?: string;
  phoneticUs?: string;
}

interface SpeedTypingGameProps {
  words: TypingQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  combo: number;
  onCorrect: (scoreDelta: number, e?: React.MouseEvent) => void;
  onWrong: (e?: React.MouseEvent) => void;
  onFinish: (score: number) => void;
  isVi?: boolean;
}

export default function SpeedTypingGame({
  words,
  difficulty,
  combo,
  onCorrect,
  onWrong,
  onFinish,
  isVi = true,
}: SpeedTypingGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [typingInput, setTypingInput] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [startTime] = useState<number>(() => Date.now());
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentW = words[currentIdx];
  const targetWord = currentW?.targetText || currentW?.word || '';
  const translation = currentW?.translation || currentW?.meaningVi || '';
  const phonetic = currentW?.phonetic || currentW?.phoneticUs || '';

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
    setTypingInput('');
  }, [currentIdx]);

  // Update live WPM
  useEffect(() => {
    const elapsedMinutes = Math.max(0.1, (Date.now() - startTime) / 60000);
    const calculatedWpm = Math.round(currentIdx / elapsedMinutes);
    setWpm(calculatedWpm);
  }, [currentIdx, startTime]);

  const speakText = useCallback((text: string) => {
    arcadeAudio.playLaser();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleInputChange = (val: string) => {
    setTypingInput(val);

    if (targetWord && val.trim().toLowerCase() === targetWord.trim().toLowerCase()) {
      arcadeAudio.playComboThunder();
      const diffMultiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;
      const scoreDelta = Math.round(120 * combo * diffMultiplier);

      setTotalScore((prev) => prev + scoreDelta);
      speakText(targetWord);
      setTypingInput('');
      onCorrect(scoreDelta);

      if (currentIdx + 1 < words.length) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        setTimeout(() => onFinish(totalScore + scoreDelta), 500);
      }
    }
  };

  if (!currentW) return null;

  const targetChars = targetWord.split('');
  const inputChars = typingInput.split('');

  return (
    <div className="space-y-6 text-center">
      {/* Top Status: Word counter, WPM speed, Combo */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
        <span>
          {isVi ? `Từ ${currentIdx + 1} / ${words.length}` : `Word ${currentIdx + 1} / ${words.length}`}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-cyan-300 font-bold flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/30">
            ⚡ {wpm} WPM
          </span>
          <span className="text-rose-400 font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/30">
            <Zap className="w-3.5 h-3.5 fill-rose-500" />
            <span>x{combo}</span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span>⚡ Đua Tốc Độ Gõ Phím</span>
        </span>

        {/* Target Word with Interactive Letter Highlights */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <h2 className="text-4xl sm:text-5xl font-mono font-black tracking-wider flex items-center justify-center">
            {targetChars.map((ch, idx) => {
              const isTyped = idx < inputChars.length;
              const isCorrect = isTyped && inputChars[idx]?.toLowerCase() === ch.toLowerCase();

              return (
                <span
                  key={idx}
                  className={`transition-colors duration-150 ${
                    isCorrect
                      ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : isTyped
                      ? 'text-rose-400'
                      : 'text-slate-200'
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </h2>
          <button
            onClick={() => speakText(targetWord)}
            className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 hover:border-cyan-400 text-cyan-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md ml-1"
            aria-label="Phát âm từ"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          <strong className="text-amber-300 font-normal">"{translation}"</strong> {phonetic ? `• ${phonetic}` : ''}
        </p>
      </div>

      <div className="relative max-w-lg mx-auto">
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={typingInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={isVi ? 'Gõ từ tiếng Anh tại đây...' : 'Type word here...'}
          className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-rose-500/50 text-center font-display font-black text-2xl text-white outline-none focus:border-rose-400 shadow-xl tracking-wider placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(244,63,94,0.25)] transition-all"
        />
      </div>
    </div>
  );
}
