'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Zap, Heart } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

interface AmbientMascot {
  id: string;
  src: string;
  name: string;
  positionClass: string;
  size: number;
  dialogue: string;
  floatDuration: number;
  floatY: number;
}

// Curated 4 Ambient Companions placed in the peripheral margins (outside 1280px content container)
const AMBIENT_MASCOTS: AmbientMascot[] = [
  {
    id: 'chill_bottom_left',
    src: '/mascot/cow_lying_relaxed.png',
    name: 'LingLing Chill',
    positionClass: 'bottom-16 left-6 hidden lg:block',
    size: 72,
    dialogue: 'Thư thái học 15 phút mỗi ngày cùng tớ nhé~ 🍃',
    floatDuration: 6.5,
    floatY: 8,
  },
  {
    id: 'cheer_right_margin',
    src: '/mascot/cow_greet_heart.png',
    name: 'LingLing Cheerful',
    positionClass: 'top-1/3 right-6 hidden xl:block',
    size: 76,
    dialogue: 'Bạn đang tiến bộ từng ngày! Cố lên nhé! 💖',
    floatDuration: 7.2,
    floatY: 10,
  },
  {
    id: 'salute_top_right',
    src: '/mascot/cow_salute.png',
    name: 'LingLing Captain',
    positionClass: 'top-24 right-10 hidden 2xl:block',
    size: 64,
    dialogue: 'Sẵn sàng bứt phá mục tiêu IELTS hôm nay! 🫡',
    floatDuration: 8.0,
    floatY: 9,
  },
  {
    id: 'scholar_left_margin',
    src: '/mascot/cow_hands_on_hips.png',
    name: 'LingLing Scholar',
    positionClass: 'top-1/2 left-6 hidden xl:block',
    size: 68,
    dialogue: 'Mỗi từ vựng mới là một chìa khóa mở ra tương lai! 💡',
    floatDuration: 7.0,
    floatY: 11,
  },
];

interface XPPop {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function FloatingMascotUniverse() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeMascotId, setActiveMascotId] = useState<string | null>(null);
  const [xpPops, setXpPops] = useState<XPPop[]>([]);

  // Load user preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('linguaflow_ambient_mascot');
        if (stored === 'focus') {
          setIsFocusMode(true);
        }
      } catch {}
    }
  }, []);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => {
      const nextVal = !prev;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('linguaflow_ambient_mascot', nextVal ? 'focus' : 'ambient');
        } catch {}
      }
      soundFx.playClick();
      return nextVal;
    });
  }, []);

  const handleMascotClick = (mascot: AmbientMascot, e: React.MouseEvent) => {
    soundFx.playSuccess();
    setActiveMascotId(mascot.id);

    // Spawn XP Pop
    const newPop: XPPop = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY - 20,
      text: '+15 XP LingLing ✨',
    };

    setXpPops((prev) => [...prev, newPop]);
    setTimeout(() => {
      setXpPops((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 1200);

    // Auto dismiss active dialogue after 3.5s
    setTimeout(() => {
      setActiveMascotId((curr) => (curr === mascot.id ? null : curr));
    }, 3500);
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. HIGH PERFORMANCE PURE CSS COSMIC STAR UNIVERSE (Strict z-0)       */}
      {/* ===================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Layer 1: Dense Crisp White Micro Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

        {/* Layer 2: Medium Sparkling Cyan Constellation Stars with Twinkle Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#67e8f9_1.5px,transparent_1.5px)] [background-size:72px_72px] opacity-35 animate-twinkle" />

        {/* Layer 3: Warm Golden Star Dust */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fde047_1.5px,transparent_1.5px)] [background-size:120px_120px] opacity-30 animate-twinkle"
          style={{ animationDelay: '-2s' }}
        />

        {/* Smooth Hardware-Accelerated Ambient Cosmic Nebula Spheres */}
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[150px] animate-aurora" />
        <div
          className="absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-teal-500/12 blur-[140px] animate-aurora"
          style={{ animationDelay: '-5s' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] rounded-full bg-amber-600/12 blur-[160px] animate-aurora"
          style={{ animationDelay: '-2s' }}
        />
        <div
          className="absolute top-2/3 left-10 w-[500px] h-[500px] rounded-full bg-purple-600/12 blur-[140px] animate-aurora"
          style={{ animationDelay: '-7s' }}
        />
      </div>

      {/* ===================================================================== */}
      {/* 2. SMART AMBIENT MASCOTS (Peripheral Out-of-Content Placement)         */}
      {/* ===================================================================== */}
      {!isFocusMode && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {AMBIENT_MASCOTS.map((mascot) => {
            const isDialogueActive = activeMascotId === mascot.id;

            return (
              <div
                key={mascot.id}
                className={`fixed ${mascot.positionClass} z-0 pointer-events-auto select-none`}
              >
                <motion.div
                  className="relative group cursor-pointer"
                  animate={{
                    y: [0, -mascot.floatY, 0],
                    scale: [1, 1.04, 1],
                    rotate: [-1.8, 1.8, -1.8],
                  }}
                  transition={{
                    duration: mascot.floatDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleMascotClick(mascot, e)}
                  title={`Nhấp vào ${mascot.name} để trò chuyện!`}
                >
                  {/* Subtle Glowing Aura Ring on Hover */}
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Mascot Sticker */}
                  <div
                    className="relative filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                    style={{ width: mascot.size, height: mascot.size }}
                  >
                    <Image
                      src={mascot.src}
                      alt={mascot.name}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-contain"
                    />
                  </div>

                  {/* Speech Bubble (Appears on Hover or Click) */}
                  <AnimatePresence>
                    {(isDialogueActive || activeMascotId === null) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{
                          opacity: isDialogueActive ? 1 : 0,
                          y: isDialogueActive ? -12 : 0,
                          scale: isDialogueActive ? 1 : 0.9,
                        }}
                        exit={{ opacity: 0, y: 6, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="group-hover:!opacity-100 group-hover:!scale-100 group-hover:!-translate-y-2 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-30 pointer-events-none transition-all duration-200"
                      >
                        <div className="px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-amber-500/60 text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5 shadow-black/80">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{mascot.dialogue}</span>
                        </div>
                        <div className="w-2 h-2 border-b border-r border-amber-500/60 bg-slate-900 transform rotate-45 mx-auto -mt-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. XP POPUP BURSTS ON MASCOT CLICK                                    */}
      {/* ===================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {xpPops.map((pop) => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 1, y: pop.y, x: pop.x - 30, scale: 0.8 }}
            animate={{ opacity: 0, y: pop.y - 65, scale: 1.25 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute font-display font-black text-amber-300 text-sm drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] bg-slate-900/95 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xl backdrop-blur-md pointer-events-none"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{pop.text}</span>
          </motion.div>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 4. SLEEK AMBIENT CONTROL WIDGET (Bottom-Left Corner)                 */}
      {/* ===================================================================== */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 select-none">
        <button
          onClick={toggleFocusMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xl backdrop-blur-xl transition-all duration-200 active:scale-95 cursor-pointer ${
            isFocusMode
              ? 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white hover:border-amber-400/80'
              : 'bg-slate-900/80 border-amber-500/40 text-amber-300 hover:bg-slate-900 hover:border-amber-400'
          }`}
          title={isFocusMode ? 'Đang ở Chế độ Tập Trung. Bấm để bật Mascot vui nhộn!' : 'Đang bật Mascot. Bấm để chuyển sang Chế độ Tập Trung!'}
        >
          {isFocusMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Tập Trung (Focus)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>LingLing Chill</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
