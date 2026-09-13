'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';
import { arcadeAudio } from '@/lib/arcadeAudio';

export interface WordMatchPair {
  id: string;
  targetText: string;
  translation: string;
  category?: string;
  cefr?: string;
}

interface MatchCard {
  id: string;
  pairId: string;
  type: 'target' | 'translation';
  text: string;
}

interface WordMatchGameProps {
  pairs: WordMatchPair[];
  difficulty: 'easy' | 'medium' | 'hard';
  combo: number;
  onCorrect: (scoreDelta: number, e?: React.MouseEvent) => void;
  onWrong: (e?: React.MouseEvent) => void;
  onFinish: (score: number) => void;
  isVi?: boolean;
}

export default function WordMatchGame({
  pairs,
  difficulty,
  combo,
  onCorrect,
  onWrong,
  onFinish,
  isVi = true,
}: WordMatchGameProps) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [firstCard, setFirstCard] = useState<MatchCard | null>(null);
  const [secondCard, setSecondCard] = useState<MatchCard | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [isPreviewingCards, setIsPreviewingCards] = useState(false);
  const [peeksLeft, setPeeksLeft] = useState(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 2 : 1);
  const [totalScore, setTotalScore] = useState(0);

  // Initialize and shuffle deck scaled by difficulty
  useEffect(() => {
    if (!pairs || pairs.length === 0) return;

    // easy: 6 pairs (12 cards), medium: 8 pairs (16 cards), hard: 10 pairs (20 cards)
    const pairCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
    const selectedPairs = pairs.slice(0, Math.min(pairs.length, pairCount));

    const deck: MatchCard[] = [];
    selectedPairs.forEach((p, idx) => {
      deck.push({
        id: `t-${idx}-${p.id}`,
        pairId: p.id,
        type: 'target',
        text: p.targetText,
      });
      deck.push({
        id: `m-${idx}-${p.id}`,
        pairId: p.id,
        type: 'translation',
        text: p.translation,
      });
    });

    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setMatchedIds([]);
    setFirstCard(null);
    setSecondCard(null);
    setTotalScore(0);
    setPeeksLeft(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 2 : 1);

    // Initial brief 1.2s flash preview to help players orient
    setIsPreviewingCards(true);
    const timer = setTimeout(() => setIsPreviewingCards(false), 1200);
    return () => clearTimeout(timer);
  }, [pairs, difficulty]);

  const handlePeek = () => {
    if (peeksLeft <= 0 || isPreviewingCards) return;
    arcadeAudio.playLaser();
    setPeeksLeft((p) => p - 1);
    setIsPreviewingCards(true);
    const peekDuration = difficulty === 'easy' ? 2500 : 2000;
    setTimeout(() => setIsPreviewingCards(false), peekDuration);
  };

  const handleCardClick = (card: MatchCard, e?: React.MouseEvent) => {
    if (isCheckingMatch || isPreviewingCards || matchedIds.includes(card.pairId) || firstCard?.id === card.id) return;
    arcadeAudio.playWhoosh();

    if (!firstCard) {
      setFirstCard(card);
      return;
    }

    setSecondCard(card);
    setIsCheckingMatch(true);

    const diffMultiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;

    if (firstCard.pairId === card.pairId) {
      const scoreDelta = Math.round(100 * combo * diffMultiplier);
      setTotalScore((prev) => prev + scoreDelta);
      setMatchedIds((prev) => [...prev, card.pairId]);
      onCorrect(scoreDelta, e);

      setFirstCard(null);
      setSecondCard(null);
      setIsCheckingMatch(false);

      if (matchedIds.length + 1 >= cards.length / 2) {
        setTimeout(() => onFinish(totalScore + scoreDelta), 600);
      }
    } else {
      onWrong(e);
      setTimeout(() => {
        setFirstCard(null);
        setSecondCard(null);
        setIsCheckingMatch(false);
      }, 900);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Peek Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-slate-300">
            {isVi
              ? `Lật tìm ${cards.length / 2} cặp từ ↔ nghĩa tương ứng`
              : `Flip to match ${cards.length / 2} word pairs`}
          </span>
          <button
            onClick={handlePeek}
            disabled={peeksLeft <= 0 || isPreviewingCards}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 disabled:opacity-30 disabled:pointer-events-none text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {isVi
                ? `Xem trước 2s (${peeksLeft} lượt)`
                : `Peek 2s (${peeksLeft} left)`}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            {cards.length} ô lật ({cards.length / 2} cặp)
          </span>
          <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
            {matchedIds.length} / {cards.length / 2} {isVi ? 'Cặp Xong' : 'Done'}
          </span>
        </div>
      </div>

      {/* Helpful Hint Banner */}
      <div className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>💡 {isVi ? 'Ghi nhớ vị trí các thẻ khi lật. Nối combo đúng 3 lần liên tiếp để hồi +1 tim ❤️!' : 'Memorize card positions. Reach 3x combo to recover +1 heart ❤️!'}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const isMatched = matchedIds.includes(card.pairId);
          const isSelected = firstCard?.id === card.id || secondCard?.id === card.id;
          const isFlipped = isMatched || isSelected || isPreviewingCards;

          return (
            <div key={card.id} className="perspective-1000 h-28 sm:h-32">
              <motion.div
                onClick={(e) => handleCardClick(card, e)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`w-full h-full relative cursor-pointer select-none ${
                  isMatched ? 'pointer-events-none' : ''
                }`}
              >
                {/* 1. MẶT ÚP (MYSTERY FACE DOWN) - Holographic Foil Cyber Card */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                  className="absolute inset-0 rounded-2xl"
                >
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/25 flex flex-col items-center justify-between p-3 relative overflow-hidden group transition-all">
                    {/* Holographic Rainbow Foil Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-fuchsia-500/15 to-amber-400/0 group-hover:via-fuchsia-500/35 transition-all duration-500 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-25 group-hover:opacity-40 pointer-events-none" />
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl group-hover:scale-150 transition-all" />

                    {/* Corner Circuit Accents */}
                    <div className="flex justify-between w-full px-0.5 text-[9px] font-mono font-black text-cyan-400/60 group-hover:text-cyan-300">
                      <span>✦ 3D</span>
                      <span>#ARCADE</span>
                    </div>

                    <div className="relative w-11 h-11 rounded-2xl bg-slate-950/90 border border-slate-700/80 group-hover:border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                      <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 group-hover:text-cyan-300 transition-colors">
                        LinguaFlow
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. MẶT NGỬA (REVEALED CONTENT FACE UP) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 rounded-2xl"
                >
                  <div
                    className={`w-full h-full rounded-2xl p-3 flex flex-col items-center justify-between text-center border-2 transition-all duration-300 shadow-xl overflow-hidden ${
                      isMatched
                        ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border-emerald-400 text-emerald-100 shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                        : isSelected
                        ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 text-slate-950 border-amber-300 shadow-amber-500/40 ring-2 ring-amber-400/40'
                        : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full px-1">
                      <span
                        className={`text-[9px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-slate-950/30 text-slate-950'
                            : isMatched
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-950/60 text-slate-400'
                        }`}
                      >
                        {card.type === 'target' ? '🇬🇧 EN' : '🇻🇳 VI'}
                      </span>

                      {isMatched && (
                        <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-sm">
                          ✓
                        </span>
                      )}
                    </div>

                    <span
                      className={`font-display font-extrabold leading-snug line-clamp-3 px-1 my-auto ${
                        isSelected
                          ? 'text-slate-950 text-sm sm:text-base font-black drop-shadow-sm'
                          : isMatched
                          ? 'text-emerald-100 text-sm sm:text-base drop-shadow-md'
                          : 'text-white text-sm sm:text-base'
                      }`}
                    >
                      {card.text}
                    </span>

                    <div className="w-full h-1" />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
