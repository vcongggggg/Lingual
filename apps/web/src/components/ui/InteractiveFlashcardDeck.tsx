'use client';

import React, { useState, useRef } from 'react';
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

export const InteractiveFlashcardDeck: React.FC = () => {
  const [deck, setDeck] = useState<Flashcard[]>(INITIAL_DECK);
  const [isFlipped, setIsFlipped] = useState(false);
  const [throwDir, setThrowDir] = useState<'left' | 'right' | null>(null);
  const [isEmerged, setIsEmerged] = useState(false);

  const [isFlipping, setIsFlipping] = useState(false);

  // Direct DOM refs for 60fps drag without re-renders
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const leftHintRef = useRef<HTMLDivElement>(null);
  const rightHintRef = useRef<HTMLDivElement>(null);

  // Pointer drag tracking
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const currentDxRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleThrow = (direction: 'left' | 'right') => {
    if (throwDir !== null || isFlipping || deck.length === 0) return;
    setThrowDir(direction);
    setIsFlipped(false);

    setTimeout(() => {
      setDeck((prev) => prev.slice(1));
      setThrowDir(null);
      setIsEmerged(true);
      setTimeout(() => setIsEmerged(false), 380);
    }, 300);
  };

  const handleReset = () => {
    const shuffled = [...INITIAL_DECK].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIsFlipped(false);
    setThrowDir(null);
    setIsEmerged(true);
    setTimeout(() => setIsEmerged(false), 380);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (throwDir !== null || isFlipping || deck.length === 0) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    currentDxRef.current = 0;
    isDraggingRef.current = true;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    if (cardWrapperRef.current) {
      cardWrapperRef.current.style.transition = 'none';
      cardWrapperRef.current.style.cursor = 'grabbing';
    }
    if (leftHintRef.current) leftHintRef.current.style.transition = 'none';
    if (rightHintRef.current) rightHintRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;

    const dx = e.clientX - startXRef.current;
    currentDxRef.current = dx;

    // Direct DOM update: translateX(dx) + rotate(dx * 0.06deg)
    if (cardWrapperRef.current) {
      const rotZ = dx * 0.06;
      cardWrapperRef.current.style.transform = `translateX(${dx}px) rotate(${rotZ}deg)`;
    }

    // Hint opacity based on |dx|
    if (dx > 10) {
      const op = Math.min(1, Math.max(0, (dx - 10) / 90));
      if (rightHintRef.current) rightHintRef.current.style.opacity = String(op);
      if (leftHintRef.current) leftHintRef.current.style.opacity = '0';
    } else if (dx < -10) {
      const op = Math.min(1, Math.max(0, (-dx - 10) / 90));
      if (leftHintRef.current) leftHintRef.current.style.opacity = String(op);
      if (rightHintRef.current) rightHintRef.current.style.opacity = '0';
    } else {
      if (rightHintRef.current) rightHintRef.current.style.opacity = '0';
      if (leftHintRef.current) leftHintRef.current.style.opacity = '0';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
    isDraggingRef.current = false;
    pointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (cardWrapperRef.current) {
      cardWrapperRef.current.style.cursor = 'grab';
    }

    const dx = currentDxRef.current;
    const absDx = Math.abs(dx);

    // 1. Phân biệt tap vs kéo: di chuyển < 16px khi thả = tap -> lật thẻ 3D
    if (absDx < 16) {
      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.transform = '';
        cardWrapperRef.current.style.transition = '';
      }
      if (leftHintRef.current) leftHintRef.current.style.opacity = '0';
      if (rightHintRef.current) rightHintRef.current.style.opacity = '0';

      if (!isFlipping && throwDir === null) {
        setIsFlipping(true);
        setIsFlipped((prev) => !prev);
        setTimeout(() => {
          setIsFlipping(false);
        }, 520);
      }
      return;
    }

    // 2. Khi thả: nếu |dx| > 100px -> thẻ bay tiếp ra hướng đó (tái dùng keyframe card-fly)
    if (absDx > 100) {
      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.transform = '';
        cardWrapperRef.current.style.transition = '';
      }
      if (leftHintRef.current) leftHintRef.current.style.opacity = '0';
      if (rightHintRef.current) rightHintRef.current.style.opacity = '0';
      handleThrow(dx > 0 ? 'right' : 'left');
      return;
    }

    // 3. Nếu không (|dx| trong khoảng [16, 100]) -> nảy về vị trí cũ (transition 250ms với easing paper)
    if (cardWrapperRef.current) {
      cardWrapperRef.current.style.transition = 'transform 250ms var(--ease-paper)';
      cardWrapperRef.current.style.transform = 'translateX(0px) rotate(0deg)';
    }
    if (leftHintRef.current) {
      leftHintRef.current.style.transition = 'opacity 200ms ease';
      leftHintRef.current.style.opacity = '0';
    }
    if (rightHintRef.current) {
      rightHintRef.current.style.transition = 'opacity 200ms ease';
      rightHintRef.current.style.opacity = '0';
    }

    resetTimerRef.current = setTimeout(() => {
      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.transition = '';
        cardWrapperRef.current.style.transform = '';
      }
      if (leftHintRef.current) {
        leftHintRef.current.style.transition = '';
      }
      if (rightHintRef.current) {
        rightHintRef.current.style.transition = '';
      }
    }, 250);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  if (deck.length === 0) {
    return (
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] min-h-[360px] bg-card border-2 border-ink rounded-2xl shadow-brutal p-6 flex flex-col items-center justify-center text-center animate-card-emerge select-none">
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

      {/* Navigation Arrows ‹ › floating on left & right */}
      <button
        onClick={() => handleThrow('left')}
        disabled={throwDir !== null || isFlipping}
        aria-label="Chưa thuộc (ném trái)"
        title="Chưa thuộc (‹)"
        className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-paper-2 border-2 border-ink text-ink font-black text-lg flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹
      </button>

      <button
        onClick={() => handleThrow('right')}
        disabled={throwDir !== null || isFlipping}
        aria-label="Thuộc rồi (ném phải)"
        title="Thuộc rồi (›)"
        className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-paper-2 border-2 border-ink text-ink font-black text-lg flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ›
      </button>

      {/* 3D Stack Container */}
      <div className="relative w-[280px] sm:w-[320px] h-[240px] sm:h-[260px] perspective-1000">
        {/* Layer 3 (deepest card) - Lồi cạnh trái 16px, hạ xuống 14px, xoay -5.5deg */}
        {next2 && (
          <div
            className="absolute inset-0 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal p-4 pointer-events-none"
            style={{
              transform: 'translate(-16px, 14px) rotate(-5.5deg) scale(0.90)',
              transition: 'transform 380ms var(--ease-paper, cubic-bezier(0.2, 0.8, 0.2, 1)), opacity 380ms ease',
              zIndex: 10,
              opacity: 0.8,
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-ink/60">
              {next2.tag}
            </span>
            <div className="text-xl font-black text-ink/60 mt-3">{next2.word}</div>
          </div>
        )}

        {/* Layer 2 (middle card) - Lồi cạnh phải 16px, hạ xuống 10px, xoay 4deg */}
        {next1 && (
          <div
            className="absolute inset-0 bg-card border-2 border-ink rounded-2xl shadow-brutal p-5 pointer-events-none"
            style={{
              transform: 'translate(16px, 10px) rotate(4deg) scale(0.95)',
              transition: 'transform 380ms var(--ease-paper, cubic-bezier(0.2, 0.8, 0.2, 1)), opacity 380ms ease',
              zIndex: 20,
              opacity: 1,
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-wider bg-paper-2 border border-ink/40 rounded-full px-2 py-0.5 text-ink/80">
              {next1.tag}
            </span>
            <div className="text-2xl font-black text-ink/80 mt-2">{next1.word}</div>
            <div className="text-xs text-ink-soft">{next1.ipa}</div>
          </div>
        )}

        {/* Top Active Card with Pointer Events drag & 3D Flip */}
        <div
          ref={cardWrapperRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            touchAction: 'none',
            perspective: '1000px',
            WebkitPerspective: '1000px',
          }}
          className={`absolute inset-0 z-30 select-none cursor-grab active:cursor-grabbing perspective-1000 ${
            throwDir === 'right'
              ? 'animate-card-fly-right pointer-events-none'
              : throwDir === 'left'
              ? 'animate-card-fly-left pointer-events-none'
              : isEmerged
              ? 'animate-card-emerge'
              : ''
          }`}
        >
          {/* Hint Overlay: Kéo phải -> Viền xanh "THUỘC RỒI" */}
          <div
            ref={rightHintRef}
            className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-teal bg-teal/15 flex items-center justify-end pr-5 z-40 opacity-0 transition-opacity duration-75 shadow-brutal-sm"
          >
            <div className="border-2 border-teal bg-paper text-teal font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-brutal-sm uppercase tracking-wider rotate-6 flex items-center gap-1.5">
              <span>✓</span>
              <span>THUỘC RỒI</span>
            </div>
          </div>

          {/* Hint Overlay: Kéo trái -> Viền đỏ "CHƯA THUỘC" */}
          <div
            ref={leftHintRef}
            className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-red bg-red/15 flex items-center justify-start pl-5 z-40 opacity-0 transition-opacity duration-75 shadow-brutal-sm"
          >
            <div className="border-2 border-red bg-paper text-red font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-brutal-sm uppercase tracking-wider -rotate-6 flex items-center gap-1.5">
              <span>✕</span>
              <span>CHƯA THUỘC</span>
            </div>
          </div>

          {/* 3D Flipper Container */}
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
                  <span className="text-[10px] font-bold text-ink-muted">
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
        </div>
      </div>

      {/* Bottom Action Buttons: Chưa thuộc vs Thuộc rồi */}
      <div className="flex items-center justify-center gap-3 mt-4 w-full px-2">
        <button
          onClick={() => handleThrow('left')}
          disabled={throwDir !== null || isFlipping}
          className="flex-1 py-2 px-3 bg-paper border-2 border-red text-red rounded-xl font-black text-xs uppercase tracking-wider shadow-brutal-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>✕</span>
          <span>Chưa thuộc</span>
        </button>

        <button
          onClick={() => handleThrow('right')}
          disabled={throwDir !== null || isFlipping}
          className="flex-1 py-2 px-3 bg-teal text-white border-2 border-ink rounded-xl font-black text-xs uppercase tracking-wider shadow-brutal-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
