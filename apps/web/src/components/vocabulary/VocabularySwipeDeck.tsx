'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCw, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Brain } from 'lucide-react';
import { VocabularyWord } from '@linguaflow/domain';
import { Button, Badge } from '@linguaflow/ui';
import { arcadeAudio } from '@/lib/arcadeAudio';

interface VocabularySwipeDeckProps {
  words: VocabularyWord[];
  locale?: string;
  onComplete?: () => void;
}

export default function VocabularySwipeDeck({
  words,
  locale = 'vi',
  onComplete,
}: VocabularySwipeDeckProps) {
  const isVi = locale === 'vi';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentWord = words[currentIndex];

  const playAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = (rating: 'again' | 'good' | 'easy') => {
    if (rating === 'again') arcadeAudio.playBuzzer();
    else if (rating === 'good') arcadeAudio.playLaser();
    else arcadeAudio.playCoin();

    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);

    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      arcadeAudio.playVictoryFanfare();
      onComplete?.();
    }
  };

  if (!currentWord) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <Sparkles className="w-12 h-12 text-teal-400 mx-auto animate-bounce" />
        <h3 className="text-xl font-display font-extrabold text-white">
          {isVi ? 'Đã Ôn Hết Thẻ Từ Vựng!' : 'All Cards Reviewed!'}
        </h3>
        <Button variant="accent" onClick={() => setCurrentIndex(0)}>
          {isVi ? 'Luyện Lại Từ Đầu' : 'Review Again'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Progress & Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
        <span className="flex items-center gap-1.5 font-bold text-teal-300">
          <Brain className="w-4 h-4" />
          <span>{isVi ? 'Chế độ 3D Flashcard Vuốt Nhanh' : '3D Swipe Deck Mode'}</span>
        </span>
        <span className="font-mono font-bold">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      {/* 3D Flip Card */}
      <div
        className="relative w-full h-[360px] perspective-1000 cursor-pointer select-none"
        onClick={() => {
          arcadeAudio.playLaser();
          setIsFlipped(!isFlipped);
        }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full h-full transform-style-3d relative"
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/30 shadow-2xl flex flex-col justify-between items-center text-center">
            <div className="flex items-center justify-between w-full">
              <Badge variant="teal" className="font-mono font-extrabold uppercase">
                {currentWord.cefrLevel}
              </Badge>
              <span className="text-xs font-semibold text-slate-400 capitalize px-2.5 py-0.5 bg-slate-950 rounded-full border border-slate-800">
                {currentWord.partOfSpeech}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                {currentWord.targetText}
              </h2>
              {currentWord.phoneticUs && (
                <p className="text-sm font-mono text-teal-300/90">{currentWord.phoneticUs}</p>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentWord.targetText);
                }}
                className="p-3 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 transition-colors mx-auto inline-flex items-center gap-1.5 text-xs font-bold"
                aria-label="Phát âm từ vựng"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe phát âm</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isVi ? 'Chạm để lật xem nghĩa' : 'Tap to reveal definition'}</span>
            </div>
          </div>

          {/* BACK SIDE (180deg) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/40 shadow-2xl flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {isVi ? 'Ý Nghĩa & Ngữ Cảnh' : 'Definition & Context'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{currentWord.targetText}</span>
              </div>

              <h3 className="text-2xl font-display font-extrabold text-amber-300">
                {currentWord.translation}
              </h3>

              {currentWord.examples && currentWord.examples.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <p className="font-bold text-slate-400 mb-1">Ví dụ:</p>
                  <p>"{currentWord.examples[0].sentence}"</p>
                  {currentWord.examples[0].translation && (
                    <p className="text-slate-400 text-[11px] mt-1">{currentWord.examples[0].translation}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <RotateCw className="w-3.5 h-3.5 text-teal-400" />
              <span>{isVi ? 'Chạm để lật lại mặt trước' : 'Tap to flip back'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RATING BUTTONS */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => handleNext('again')}
          className="p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold text-center transition-all active:scale-95 shadow-md"
        >
          {isVi ? '🔴 Quên rồi' : '🔴 Again'}
        </button>

        <button
          type="button"
          onClick={() => handleNext('good')}
          className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold text-center transition-all active:scale-95 shadow-md"
        >
          {isVi ? '🟡 Tạm ổn' : '🟡 Hard'}
        </button>

        <button
          type="button"
          onClick={() => handleNext('easy')}
          className="p-3.5 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold text-center transition-all active:scale-95 shadow-md"
        >
          {isVi ? '🟢 Đã nhớ' : '🟢 Easy'}
        </button>
      </div>
    </div>
  );
}
