'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Volume2, PlusCircle, CheckCircle2, RotateCw, Play, Pause, Compass, Activity } from 'lucide-react';
import { srsApi } from '@/lib/api';

interface OrbitCard {
  id: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  cefrLevel: string;
  exampleSentence?: string;
  baseAngle: number;
}

const DEFAULT_ORBIT_WORDS: OrbitCard[] = [
  {
    id: 'h1',
    targetText: 'Environment',
    translation: 'Môi trường sống',
    phonetic: '/ɪnˈvaɪrənmənt/',
    cefrLevel: 'B1',
    exampleSentence: 'We must protect our environment.',
    baseAngle: 0,
  },
  {
    id: 'h2',
    targetText: 'Substantial',
    translation: 'Đáng kể / Cực lớn',
    phonetic: '/səbˈstænʃl/',
    cefrLevel: 'B2',
    exampleSentence: 'A substantial amount of investment went into solar energy.',
    baseAngle: 72,
  },
  {
    id: 'h3',
    targetText: 'Achieve',
    translation: 'Đạt được / Gặt hái',
    phonetic: '/əˈtʃiːv/',
    cefrLevel: 'A2',
    exampleSentence: 'She worked hard to achieve her IELTS target band 7.5.',
    baseAngle: 144,
  },
  {
    id: 'h4',
    targetText: 'Innovation',
    translation: 'Sáng kiến / Đổi mới',
    phonetic: '/ˌɪnəˈveɪʃn/',
    cefrLevel: 'C1',
    exampleSentence: 'Technological innovation drives modern economic growth.',
    baseAngle: 216,
  },
  {
    id: 'h5',
    targetText: 'Perseverance',
    translation: 'Sự kiên trì nhẫn nại',
    phonetic: '/ˌpɜːrsəˈvɪrəns/',
    cefrLevel: 'C1',
    exampleSentence: 'Perseverance is key to mastering any new language.',
    baseAngle: 288,
  },
];

export default function Hero3DVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [selectedCard, setSelectedCard] = useState<OrbitCard | null>(null);
  const [addedSrs, setAddedSrs] = useState(false);

  // 3D ORBIT ROTATION & SWIPE PHYSICS STATE
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // PHYSICS REFS TO ENSURE CONTINUOUS UNINTERRUPTED 60FPS ORBIT LOOP
  const rotationAngleRef = useRef(0);
  const rotationSpeedRef = useRef(0.8); // Base auto-rotation speed (0.8 deg per frame)
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const selectedCardRef = useRef<OrbitCard | null>(null);
  const lastMouseXRef = useRef(0);
  const swipeVelocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    console.log('[Hero3DVisual] Mounted, starting 3D Orbit engine...');
  }, []);

  // Sync state to refs for high performance animation loop
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    selectedCardRef.current = selectedCard;
  }, [selectedCard]);

  // 1. Mouse Tilt Parallax Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 14;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 14;
    setMouseOffset({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    if (isDraggingRef.current) {
      handleDragEnd();
    }
  };

  // 2. Interactive Drag / Swipe Handler
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    lastMouseXRef.current = clientX;
    swipeVelocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - lastMouseXRef.current;
    lastMouseXRef.current = clientX;

    const speedMultiplier = 0.55;
    const addedAngle = deltaX * speedMultiplier;
    rotationAngleRef.current = (rotationAngleRef.current + addedAngle) % 360;
    setRotationAngle(rotationAngleRef.current);
    swipeVelocityRef.current = addedAngle;
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;

    // Transfer drag swipe velocity to rotation momentum
    if (Math.abs(swipeVelocityRef.current) > 0.1) {
      rotationSpeedRef.current = swipeVelocityRef.current * 1.3;
    }
  };

  // Mouse & Touch Events
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMouseMove(e);
    if (isDraggingRef.current) {
      handleDragMove(e.clientX);
    }
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current && e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse Wheel Scroll Speed Acceleration
  const handleWheel = (e: React.WheelEvent) => {
    const dir = e.deltaY > 0 ? -1 : 1;
    const newSpeed = Math.max(-6, Math.min(6, rotationSpeedRef.current + dir * 0.6));
    rotationSpeedRef.current = newSpeed;
  };

  // 3. UNINTERRUPTED CONTINUOUS 60FPS AUTO-ORBIT LOOP
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 16.6, 2.0);
      lastTime = currentTime;

      if (!isDraggingRef.current && !isPausedRef.current && !selectedCardRef.current) {
        let currentSpeed = rotationSpeedRef.current;
        const targetBase = currentSpeed >= 0 ? 0.8 : -0.8;

        // Inertia friction decay back to smooth base auto-orbit speed
        if (Math.abs(currentSpeed) > Math.abs(targetBase)) {
          currentSpeed *= 0.96;
          if (Math.abs(currentSpeed) < Math.abs(targetBase)) {
            currentSpeed = targetBase;
          }
          rotationSpeedRef.current = currentSpeed;
        } else if (Math.abs(currentSpeed) < 0.2) {
          rotationSpeedRef.current = targetBase;
        }

        rotationAngleRef.current = (rotationAngleRef.current + rotationSpeedRef.current * dt) % 360;
        setRotationAngle(rotationAngleRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Audio Pronunciation
  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add to SRS
  const handleAddToSrs = async (card: OrbitCard) => {
    try {
      await srsApi.addWord({
        targetText: card.targetText,
        translation: card.translation,
        phonetic: card.phonetic,
        exampleSentence: card.exampleSentence,
        cefrLevel: card.cefrLevel,
      });
      setAddedSrs(true);
      setTimeout(() => setAddedSrs(false), 2000);
    } catch {}
  };

  if (!mounted) {
    return <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] mx-auto flex items-center justify-center" />;
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={handleWheel}
      className={`relative w-full max-w-4xl h-[440px] sm:h-[500px] mx-auto flex items-center justify-center overflow-visible perspective-[1200px] select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-coral-500/10 via-amber-500/10 to-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 3D TILT CONTAINER */}
      <motion.div
        animate={{
          rotateX: mouseOffset.x,
          rotateY: mouseOffset.y,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* CENTRAL GLOWING 3D LOGO BADGE ⭐ */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [0.96, 1.04, 0.96],
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 25, ease: 'linear' },
            scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          }}
          className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-coral-500 via-amber-400 to-teal-400 p-1 shadow-[0_0_60px_rgba(245,158,11,0.4)] flex items-center justify-center z-10"
        >
          <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center p-4 border border-amber-400/40 backdrop-blur-xl">
            <Sparkles className="w-12 h-12 text-amber-400 animate-pulse mb-1" />
            <span className="font-display font-extrabold text-xs tracking-widest text-white uppercase">
              Lingual
            </span>
            <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider">
              Ôn Tập Thông Minh
            </span>
          </div>
        </motion.div>

        {/* ORBITING 3D VOCABULARY CARDS WITH CONTINUOUS AUTO-ORBIT & INTERACTIVE SWIPE */}
        {DEFAULT_ORBIT_WORDS.map((card) => {
          const currentAngle = (card.baseAngle + rotationAngle) % 360;
          const normalizedAngle = currentAngle < 0 ? currentAngle + 360 : currentAngle;
          const rad = (normalizedAngle * Math.PI) / 180;

          const radiusX = typeof window !== 'undefined' && window.innerWidth < 640 ? 135 : 220;
          const radiusY = typeof window !== 'undefined' && window.innerWidth < 640 ? 85 : 130;

          const posX = Math.cos(rad) * radiusX;
          const posY = Math.sin(rad) * radiusY;

          // 3D Depth Scale, Z-Index, and Blur/Opacity
          const scale = 0.75 + (Math.sin(rad) + 1) * 0.2; // 0.75 to 1.15
          const zIndex = Math.round((Math.sin(rad) + 1) * 20);
          const depthFactor = (Math.sin(rad) + 1) / 2; // 0 (back) to 1 (front)
          const opacity = 0.35 + depthFactor * 0.65; // 0.35 to 1.0
          const blurAmount = (1 - depthFactor) * 2.5; // up to 2.5px blur when behind
          const filter = blurAmount > 0.3 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';

          // Auto Flip card face when orbiting in front vs back
          const isFlipped = normalizedAngle > 90 && normalizedAngle < 270;

          return (
            <div
              key={card.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCard(card);
              }}
              style={{
                transform: `translate3d(${posX}px, ${posY}px, ${zIndex * 2}px) scale(${scale})`,
                zIndex,
                opacity,
                filter,
              }}
              className="absolute cursor-pointer select-none"
            >
              {/* Card Body */}
              <div className="w-32 sm:w-44 h-20 sm:h-26 rounded-2xl bg-slate-900/95 border border-teal-500/40 p-3 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-amber-400 hover:scale-108 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] font-extrabold border border-teal-500/30">
                    {card.cefrLevel}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>

                <div className="text-center">
                  {isFlipped ? (
                    <span className="font-semibold text-xs sm:text-sm text-teal-300 block truncate">
                      {card.translation}
                    </span>
                  ) : (
                    <span className="font-extrabold text-xs sm:text-sm text-white block truncate group-hover:text-amber-400">
                      {card.targetText}
                    </span>
                  )}
                  {card.phonetic && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {card.phonetic}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* SWIPE & ROTATION CONTROL TOOLBAR (BOTTOM BAR) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-md text-xs font-bold">
        <button
          onClick={() => {
            rotationSpeedRef.current = -rotationSpeedRef.current;
          }}
          className="p-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors flex items-center gap-1"
          title="Đổi chiều xoay 3D"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">Đổi Chiều</span>
        </button>

        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
          title={isPaused ? 'Tiếp tục xoay' : 'Tạm dừng xoay'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-teal-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
          <span className="text-[10px] hidden sm:inline">{isPaused ? 'Chạy' : 'Tạm Dừng'}</span>
        </button>

        <div className="h-3 w-[1px] bg-slate-800" />

        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-mono text-[10px] text-amber-300">
            {rotationAngle.toFixed(0)}° ({rotationSpeedRef.current > 0 ? '+' : ''}{rotationSpeedRef.current.toFixed(1)}°/f)
          </span>
        </div>
      </div>

      {/* FOCUS MODAL WHEN CLICKING AN ORBITING CARD */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -90 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl space-y-5"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                  CEFR {selectedCard.cefrLevel}
                </span>
                <span className="text-xs text-slate-400">Thẻ Từ Vựng 3D</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-extrabold text-white">{selectedCard.targetText}</h3>
                  <button
                    onClick={() => handlePlayAudio(selectedCard.targetText)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                {selectedCard.phonetic && (
                  <p className="text-sm font-mono text-slate-400">{selectedCard.phonetic}</p>
                )}
                <p className="text-lg font-bold text-teal-400">{selectedCard.translation}</p>
              </div>

              {selectedCard.exampleSentence && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 text-slate-300">
                  <span className="font-bold text-amber-400 block">Ví dụ mẫu:</span>
                  <p>"{selectedCard.exampleSentence}"</p>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleAddToSrs(selectedCard)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
                >
                  {addedSrs ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Đã Thêm Vào SRS!
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" /> Thêm Vào Thẻ SRS
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
