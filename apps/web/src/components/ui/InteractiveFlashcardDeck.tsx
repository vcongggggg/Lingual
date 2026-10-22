'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { LingLing } from './LingLing';

interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  tag: string;
  meaning: string;
  example: string;
  exampleVi: string;
}

const INITIAL_DECK: Flashcard[] = [
  {
    id: '1',
    word: 'Substantial',
    ipa: '/səbˈstænʃl/',
    tag: 'Tính từ · B2',
    meaning: 'Đáng kể, quan trọng',
    example: 'There has been substantial progress this week.',
    exampleVi: 'Đã có tiến bộ đáng kể trong tuần này.',
  },
  {
    id: '2',
    word: 'Achieve',
    ipa: '/əˈtʃiːv/',
    tag: 'Động từ · A2',
    meaning: 'Đạt được, hoàn thành',
    example: 'She worked hard to achieve her goal.',
    exampleVi: 'Cô ấy đã nỗ lực để đạt được mục tiêu.',
  },
  {
    id: '3',
    word: 'Environment',
    ipa: '/ɪnˈvaɪrənmənt/',
    tag: 'Danh từ · B1',
    meaning: 'Môi trường sống',
    example: 'We must protect our natural environment.',
    exampleVi: 'Chúng ta phải bảo vệ môi trường tự nhiên.',
  },
  {
    id: '4',
    word: 'Perseverance',
    ipa: '/ˌpɜːsɪˈvɪərəns/',
    tag: 'Danh từ · C1',
    meaning: 'Sự kiên trì, bền bỉ',
    example: 'Success comes from patience and perseverance.',
    exampleVi: 'Thành công đến từ sự nhẫn nại và bền bỉ.',
  },
  {
    id: '5',
    word: 'Brutalism',
    ipa: '/ˈbruːtəlɪzəm/',
    tag: 'Thuật ngữ · Nghệ thuật',
    meaning: 'Thô mộc, góc cạnh tối giản',
    example: 'Paper brutalism celebrates raw textures and ink.',
    exampleVi: 'Phong cách sổ tay tôn vinh nét thô mộc và mực in.',
  },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
};

const topCardVariants = {
  initial: {
    x: 16,
    y: 10,
    rotate: 4,
    scale: 0.95,
    opacity: 0.85,
  },
  idle: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: springTransition,
  },
  exit: (dir: 'left' | 'right') => ({
    x: dir === 'right' ? 520 : -520,
    rotate: dir === 'right' ? 22 : -22,
    opacity: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 26,
    },
  }),
};

export const InteractiveFlashcardDeck: React.FC = () => {
  const [deck, setDeck] = useState<Flashcard[]>(INITIAL_DECK);
  const [isFlipped, setIsFlipped] = useState(false);
  const [throwDir, setThrowDir] = useState<'left' | 'right'>('right');
  const [isThrowing, setIsThrowing] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Motion values for smooth 60fps drag & hint reactivity without component re-renders
  const x = useMotionValue(0);
  const cardRotate = useTransform(x, [-200, 200], [-12, 12]);
  const rightHintOpacity = useTransform(x, [10, 100], [0, 1]);
  const leftHintOpacity = useTransform(x, [-10, -100], [0, 1]);

  const handleThrow = (direction: 'left' | 'right') => {
    if (isThrowing || isFlipping || deck.length === 0) return;
    setIsThrowing(true);
    setThrowDir(direction);
    setIsFlipped(false);
    x.set(0);

    setDeck((prev) => prev.slice(1));
    setTimeout(() => {
      setIsThrowing(false);
    }, 450);
  };

  const handleReset = () => {
    const shuffled = [...INITIAL_DECK].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIsFlipped(false);
    setIsThrowing(false);
    setThrowDir('right');
    x.set(0);
  };

  const handleCardTap = () => {
    if (isFlipping || isThrowing) return;
    setIsFlipping(true);
    setIsFlipped((prev) => !prev);
    setTimeout(() => {
      setIsFlipping(false);
    }, 520);
  };

  const handleDragEnd = (_e: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    if (dx > 100 || vx > 500) {
      handleThrow('right');
    } else if (dx < -100 || vx < -500) {
      handleThrow('left');
    } else if (Math.abs(dx) < 16) {
      handleCardTap();
    }
  };

  if (deck.length === 0) {
    return (
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] min-h-[360px] bg-card border-2 border-ink rounded-2xl shadow-brutal p-6 flex flex-col items-center justify-center text-center select-none">
        <div className="w-28 h-28 mb-3">
          <LingLing reaction="sleeping" size={112} />
        </div>
        <div className="text-xl font-black text-ink mb-1">Xong xấp thẻ hôm nay!</div>
        <p className="text-xs text-ink-soft mb-5 max-w-[220px]">
          LingLing đang ngủ say sưa. Bạn có muốn xáo lại để luyện thêm một lượt nữa?
        </p>
        <button
          onClick={handleReset}
          className="btn btn-red text-sm px-5 py-2.5 shadow-brutal-sm flex items-center gap-2 cursor-pointer"
        >
          <span>↺</span>
          <span>Xáo lại xấp thẻ</span>
        </button>
      </div>
    );
  }

  const current = deck[0];
  const next1 = deck[1];
  const next2 = deck[2];

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center select-none">
      {/* Tape strip decor top */}
      <div className="tape-strip" />

      {/* Navigation Arrows ‹ › floating on left & right (Touch target 44px) */}
      <button
        onClick={() => handleThrow('left')}
        disabled={isThrowing || isFlipping}
        aria-label="Chưa thuộc (ném trái)"
        title="Chưa thuộc (‹)"
        className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-50 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-paper-2 border-2 border-ink text-ink font-black text-xl flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹
      </button>

      <button
        onClick={() => handleThrow('right')}
        disabled={isThrowing || isFlipping}
        aria-label="Thuộc rồi (ném phải)"
        title="Thuộc rồi (›)"
        className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-50 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-paper-2 border-2 border-ink text-ink font-black text-xl flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ›
      </button>

      {/* 3D Stack Container */}
      <div className="relative w-[280px] sm:w-[320px] h-[240px] sm:h-[260px] perspective-1000">
        {/* Layer 3 (deepest card) - Lồi cạnh trái 16px, hạ xuống 14px, xoay -5.5deg */}
        {next2 && (
          <motion.div
            key={next2.id}
            initial={{ x: 0, y: 20, scale: 0.85, opacity: 0 }}
            animate={{ x: -16, y: 14, rotate: -5.5, scale: 0.90, opacity: 0.8 }}
            transition={springTransition}
            className="absolute inset-0 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal p-4 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-ink/60">
              {next2.tag}
            </span>
            <div className="text-xl font-black text-ink/60 mt-3">{next2.word}</div>
          </motion.div>
        )}

        {/* Layer 2 (middle card) - Lồi cạnh phải 16px, hạ xuống 10px, xoay 4deg */}
        {next1 && (
          <motion.div
            key={next1.id}
            initial={{ x: -16, y: 14, rotate: -5.5, scale: 0.90, opacity: 0.8 }}
            animate={{ x: 16, y: 10, rotate: 4, scale: 0.95, opacity: 1 }}
            transition={springTransition}
            className="absolute inset-0 bg-card border-2 border-ink rounded-2xl shadow-brutal p-5 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            <span className="text-[10px] font-black uppercase tracking-wider bg-paper-2 border border-ink/40 rounded-full px-2 py-0.5 text-ink/80">
              {next1.tag}
            </span>
            <div className="text-2xl font-black text-ink/80 mt-2">{next1.word}</div>
            <div className="text-xs text-ink-soft">{next1.ipa}</div>
          </motion.div>
        )}

        {/* Top Active Card with Framer Motion drag & 3D Flip */}
        <AnimatePresence mode="popLayout" custom={throwDir}>
          <motion.div
            key={current.id}
            custom={throwDir}
            variants={topCardVariants}
            initial="initial"
            animate="idle"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.65}
            onDragEnd={handleDragEnd}
            onTap={handleCardTap}
            style={{
              x,
              rotate: cardRotate,
              touchAction: 'none',
              perspective: '1000px',
              WebkitPerspective: '1000px',
              zIndex: 30,
            }}
            className="absolute inset-0 select-none cursor-grab active:cursor-grabbing perspective-1000"
          >
            {/* Hint Overlay: Kéo phải -> Viền xanh "THUỘC RỒI" */}
            <motion.div
              style={{ opacity: rightHintOpacity }}
              className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-teal bg-teal/15 flex items-center justify-end pr-5 z-40 shadow-brutal-sm"
            >
              <div className="border-2 border-teal bg-paper text-teal font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-brutal-sm uppercase tracking-wider rotate-6 flex items-center gap-1.5">
                <span>✓</span>
                <span>THUỘC RỒI</span>
              </div>
            </motion.div>

            {/* Hint Overlay: Kéo trái -> Viền đỏ "CHƯA THUỘC" */}
            <motion.div
              style={{ opacity: leftHintOpacity }}
              className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-red bg-red/15 flex items-center justify-start pl-5 z-40 shadow-brutal-sm"
            >
              <div className="border-2 border-red bg-paper text-red font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-brutal-sm uppercase tracking-wider -rotate-6 flex items-center gap-1.5">
                <span>✕</span>
                <span>CHƯA THUỘC</span>
              </div>
            </motion.div>

            {/* 3D Flipper Container - GIỮ NGUYÊN 100% CƠ CHẾ CSS 3D */}
            <div
              className={`w-full h-full flashcard-preserve-3d ${
                isFlipped ? 'flashcard-flipped' : ''
              }`}
              style={{ transformOrigin: 'center center', willChange: 'transform' }}
            >
              {/* Card Front */}
              <div className="flashcard-face absolute inset-0 bg-card border-2 border-ink rounded-2xl shadow-brutal-lg p-5 sm:p-6 text-center flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-paper-2 border border-ink rounded-full px-2.5 py-0.5">
                      {current.tag}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-black text-ink bg-paper-2 border-2 border-ink rounded-full px-2.5 py-0.5 shadow-brutal-sm z-30">
                      {deck.length} thẻ còn
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-1">
                    {current.word}
                  </div>
                  <div className="text-xs sm:text-sm text-ink-soft font-mono mb-2">
                    {current.ipa}
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/20 pt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50/60 rounded py-1">
                  <span>↻</span>
                  <span>Chạm thẻ để lật 3D xem nghĩa</span>
                </div>
              </div>

              {/* Card Back (Flipped) */}
              <div className="flashcard-face flashcard-face-back absolute inset-0 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-lg p-5 sm:p-6 text-center flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-teal mb-1">
                    Ý NGHĨA & VÍ DỤ
                  </div>
                  <div className="text-lg sm:text-xl font-black text-teal mb-2">
                    {current.meaning}
                  </div>
                  <div className="text-left bg-card/90 border border-ink/20 rounded-lg p-2.5 text-xs text-ink space-y-1">
                    <div className="font-semibold italic text-ink">{current.example}</div>
                    <div className="text-ink-soft text-[11px]">{current.exampleVi}</div>
                  </div>
                </div>

                <div className="border-t border-dashed border-ink/20 pt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-ink-muted">
                  <span>↺</span>
                  <span>Chạm để lật lại mặt trước</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Buttons: Chưa thuộc vs Thuộc rồi (Touch target 44px) */}
      <div className="flex items-center justify-center gap-3 mt-4 w-full px-2">
        <button
          onClick={() => handleThrow('left')}
          disabled={isThrowing || isFlipping}
          className="flex-1 min-h-[44px] py-2.5 px-3 bg-paper border-2 border-red text-red rounded-xl font-black text-xs uppercase tracking-wider shadow-brutal-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>✕</span>
          <span>Chưa thuộc</span>
        </button>

        <button
          onClick={() => handleThrow('right')}
          disabled={isThrowing || isFlipping}
          className="flex-1 min-h-[44px] py-2.5 px-3 bg-teal text-white border-2 border-ink rounded-xl font-black text-xs uppercase tracking-wider shadow-brutal-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>✓</span>
          <span>Thuộc rồi</span>
        </button>
      </div>

      <div className="text-[10px] text-ink-muted font-semibold mt-2 text-center">
        Mẹo: Kéo thẻ sang trái/phải hoặc chạm để lật 3D (Hỗ trợ chuột & cảm ứng)
      </div>
    </div>
  );
};
