'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { arcadeAudio } from '@/lib/arcadeAudio';

export interface ScrambleQuestion {
  id: string;
  sentence: string;
  fullSentence: string;
  tokens: string[];
  translation: string;
}

interface SentenceScrambleGameProps {
  sentences: ScrambleQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  combo: number;
  onCorrect: (scoreDelta: number, e?: React.MouseEvent) => void;
  onWrong: (e?: React.MouseEvent) => void;
  onFinish: (score: number) => void;
  isVi?: boolean;
}

export default function SentenceScrambleGame({
  sentences,
  difficulty,
  combo,
  onCorrect,
  onWrong,
  onFinish,
  isVi = true,
}: SentenceScrambleGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<{ id: number; text: string }[]>([]);
  const [availableTokens, setAvailableTokens] = useState<{ id: number; text: string }[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const currentQ = sentences[currentIdx];

  // Initialize available tokens when sentence changes
  useEffect(() => {
    if (!currentQ) return;
    setSelectedTokens([]);
    const tokensWithId = currentQ.tokens.map((text, idx) => ({ id: idx, text }));
    setAvailableTokens(tokensWithId);
  }, [currentIdx, currentQ]);

  // Audio pronunciation
  const speakText = useCallback((text: string) => {
    arcadeAudio.playLaser();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleTokenClick = (tokenObj: { id: number; text: string }, e?: React.MouseEvent) => {
    arcadeAudio.playLaser();
    if (!currentQ) return;

    const newSelected = [...selectedTokens, tokenObj];
    setSelectedTokens(newSelected);
    setAvailableTokens((prev) => prev.filter((t) => t.id !== tokenObj.id));

    if (newSelected.length === currentQ.tokens.length) {
      const userSentence = newSelected.map((t) => t.text).join(' ').trim().toLowerCase();
      const targetSentence = currentQ.fullSentence.trim().toLowerCase();
      const diffMultiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;

      if (userSentence === targetSentence) {
        const scoreDelta = Math.round(150 * combo * diffMultiplier);
        setTotalScore((prev) => prev + scoreDelta);
        onCorrect(scoreDelta, e);
        speakText(currentQ.fullSentence);

        if (currentIdx + 1 < sentences.length) {
          setTimeout(() => {
            setCurrentIdx((prev) => prev + 1);
          }, 800);
        } else {
          setTimeout(() => {
            onFinish(totalScore + scoreDelta);
          }, 800);
        }
      } else {
        onWrong(e);
        setTimeout(() => {
          setSelectedTokens([]);
          setAvailableTokens(currentQ.tokens.map((text, idx) => ({ id: idx, text })));
        }, 800);
      }
    }
  };

  const handleRemoveToken = (tokenObj: { id: number; text: string }) => {
    arcadeAudio.playLaser();
    setSelectedTokens((prev) => prev.filter((t) => t.id !== tokenObj.id));
    setAvailableTokens((prev) => [...prev, tokenObj]);
  };

  const handleReset = () => {
    if (!currentQ) return;
    arcadeAudio.playLaser();
    setSelectedTokens([]);
    setAvailableTokens(currentQ.tokens.map((text, idx) => ({ id: idx, text })));
  };

  if (!currentQ) return null;

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">
          {isVi ? `Câu ${currentIdx + 1} / ${sentences.length}` : `Question ${currentIdx + 1} / ${sentences.length}`}
        </span>
        <button
          onClick={() => speakText(currentQ.fullSentence)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-cyan-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isVi ? 'Phát âm mẫu' : 'Listen'}</span>
        </button>
      </div>

      <p className="text-base sm:text-lg font-bold text-amber-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-850 shadow-inner">
        "{currentQ.translation}"
      </p>

      {/* Selected tokens slot */}
      <div className="min-h-16 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 items-center justify-center">
        {selectedTokens.length === 0 ? (
          <span className="text-xs text-slate-600 font-mono italic">
            {isVi ? 'Nhấp các từ bên dưới để ghép câu...' : 'Click tokens below to build the sentence...'}
          </span>
        ) : (
          selectedTokens.map((tok) => (
            <button
              key={tok.id}
              onClick={() => handleRemoveToken(tok)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-rose-500/20 border border-amber-500/40 hover:border-rose-500/50 text-amber-300 hover:text-rose-200 font-bold text-sm shadow-sm flex items-center gap-1.5 cursor-pointer group transition-all active:scale-95"
              title={isVi ? 'Bấm để trả lại từ này' : 'Click to return word'}
            >
              <span>{tok.text}</span>
              <span className="text-xs text-amber-400/60 group-hover:text-rose-300 font-bold">✕</span>
            </button>
          ))
        )}
      </div>

      {/* Available token bank */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        {availableTokens.map((tokenObj) => (
          <button
            key={tokenObj.id}
            onClick={(e) => handleTokenClick(tokenObj, e)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-sm text-white transition-all active:scale-95 shadow-md cursor-pointer hover:border-cyan-400/50"
          >
            {tokenObj.text}
          </button>
        ))}
      </div>

      {selectedTokens.length > 0 && (
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer pt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isVi ? 'Xếp lại câu này' : 'Reset words'}</span>
        </button>
      )}
    </div>
  );
}
