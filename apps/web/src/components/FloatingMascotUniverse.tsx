'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Zap } from 'lucide-react';
import { mascotReactions } from '@linguaflow/config';

interface MascotItem {
  id: string;
  src: string;
  size: 'sm' | 'md' | 'lg';
  x: number; // percentage 5-90
  y: number; // percentage 5-90
  depth: 'far' | 'mid' | 'front';
  floatDuration: number;
  floatDistance: number;
  dialogue: string;
  rotateDeg: number;
}

const MASCOT_POOL: MascotItem[] = [
  {
    id: 'm1',
    src: mascotReactions.greet,
    size: 'lg',
    x: 6,
    y: 18,
    depth: 'front',
    floatDuration: 7,
    floatDistance: 18,
    dialogue: 'Moo! Chào bạn! 💖',
    rotateDeg: -6,
  },
  {
    id: 'm2',
    src: mascotReactions.focus_mode,
    size: 'md',
    x: 88,
    y: 22,
    depth: 'mid',
    floatDuration: 9,
    floatDistance: 22,
    dialogue: 'Tập trung học bài! 🎯',
    rotateDeg: 8,
  },
  {
    id: 'm3',
    src: mascotReactions.celebrate_big,
    size: 'lg',
    x: 92,
    y: 65,
    depth: 'front',
    floatDuration: 6,
    floatDistance: 20,
    dialogue: 'Học vui nhận XP! 🚀',
    rotateDeg: -8,
  },
  {
    id: 'm4',
    src: mascotReactions.confirm,
    size: 'sm',
    x: 12,
    y: 75,
    depth: 'far',
    floatDuration: 11,
    floatDistance: 14,
    dialogue: 'High Five nào! ✋',
    rotateDeg: 12,
  },
  {
    id: 'm5',
    src: mascotReactions.challenge,
    size: 'md',
    x: 82,
    y: 84,
    depth: 'mid',
    floatDuration: 8,
    floatDistance: 16,
    dialogue: 'Thách thức 60s! 🔥',
    rotateDeg: -10,
  },
  {
    id: 'm6',
    src: mascotReactions.relax_done,
    size: 'sm',
    x: 48,
    y: 12,
    depth: 'far',
    floatDuration: 12,
    floatDistance: 12,
    dialogue: 'Thư giãn chút nào~ 🍃',
    rotateDeg: 4,
  },
  {
    id: 'm7',
    src: mascotReactions.loading,
    size: 'md',
    x: 4,
    y: 48,
    depth: 'mid',
    floatDuration: 7.5,
    floatDistance: 24,
    dialogue: 'Đua tốc độ gõ phím! ⚡',
    rotateDeg: 15,
  },
  {
    id: 'm8',
    src: mascotReactions.idle_empty,
    size: 'sm',
    x: 52,
    y: 88,
    depth: 'far',
    floatDuration: 10,
    floatDistance: 15,
    dialogue: 'Ôn tập SRS thông minh! 🧠',
    rotateDeg: -5,
  },
];

interface XPPop {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function FloatingMascotUniverse() {
  const [enabled, setEnabled] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeMascotId, setActiveMascotId] = useState<string | null>(null);
  const [xpPops, setXpPops] = useState<XPPop[]>([]);

  // Track mouse coordinates for interactive parallax
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 2, // -1 to 1
        y: (e.clientY / innerHeight - 0.5) * 2, // -1 to 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  // Mascot Click Interaction (+15 XP Floating Toast)
  const handleMascotClick = (e: React.MouseEvent, mascot: MascotItem) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();

    const newPop: XPPop = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text: '+15 XP ✨',
    };

    setXpPops((prev) => [...prev, newPop]);

    setTimeout(() => {
      setXpPops((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 1500);
  };

  if (!enabled) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setEnabled(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 text-xs font-bold shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Bật Bò LingLing Vũ Trụ"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vũ Trụ LingLing (OFF)</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* GLOBAL COSMIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Glowing Cosmic Nebula Spheres */}
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 blur-[110px]" />

        {/* Floating Twinkling Stars Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />

        {/* FLOATING MASCOT ENTITIES */}
        {MASCOT_POOL.map((m) => {
          // Compute parallax factor based on depth
          const depthMultiplier = m.depth === 'front' ? 25 : m.depth === 'mid' ? 14 : 6;
          const parallaxX = mousePos.x * depthMultiplier;
          const parallaxY = mousePos.y * depthMultiplier;

          // Dimension mapping
          const sizePx = m.size === 'lg' ? 96 : m.size === 'md' ? 64 : 36;
          const blurClass = m.depth === 'far' ? 'blur-[1.5px] opacity-40' : m.depth === 'mid' ? 'opacity-70' : 'opacity-95';

          return (
            <motion.div
              key={m.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
              }}
              animate={{
                x: [parallaxX, parallaxX + (m.floatDistance * (m.id === 'm1' ? 1 : -1)), parallaxX],
                y: [parallaxY, parallaxY - m.floatDistance, parallaxY],
                rotate: [m.rotateDeg, m.rotateDeg + 8, m.rotateDeg - 6, m.rotateDeg],
              }}
              transition={{
                duration: m.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.3, rotate: 0, zIndex: 30 }}
              whileTap={{ scale: 0.9, rotate: 180 }}
              onHoverStart={() => setActiveMascotId(m.id)}
              onHoverEnd={() => setActiveMascotId(null)}
              onClick={(e) => handleMascotClick(e, m)}
            >
              <div className="relative group">
                {/* Speech Bubble Popup on Hover */}
                <AnimatePresence>
                  {activeMascotId === m.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.8 }}
                      animate={{ opacity: 1, y: -12, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.8 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-50 pointer-events-none"
                    >
                      <div className="px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                        <span>{m.dialogue}</span>
                      </div>
                      <div className="w-2 h-2 bg-slate-900 border-b border-r border-amber-500/50 transform rotate-45 mx-auto -mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mascot Image Element */}
                <div
                  className={`relative transition-all duration-300 ${blurClass} group-hover:opacity-100 group-hover:blur-none`}
                  style={{ width: sizePx, height: sizePx }}
                >
                  {/* Glowing Aura Ring on Hover */}
                  <div className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-amber-400/20 blur-md transition-colors" />

                  <img
                    src={m.src}
                    alt="Floating Cosmic LingLing"
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FLOATING XP POPUP ANIMATIONS */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {xpPops.map((pop) => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 1, y: pop.y, x: pop.x - 30, scale: 0.8 }}
            animate={{ opacity: 0, y: pop.y - 60, scale: 1.2 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute font-display font-black text-amber-400 text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] bg-slate-900/90 border border-amber-500/40 px-2.5 py-1 rounded-full flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{pop.text}</span>
          </motion.div>
        ))}
      </div>

      {/* TOGGLE CONTROL BUTTON (BOTTOM LEFT) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setEnabled(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium shadow-lg backdrop-blur-md transition-all active:scale-95 group"
          title="Tắt hiệu ứng Bò LingLing trôi nổi"
        >
          <EyeOff className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
          <span>Vũ Trụ LingLing (ON)</span>
        </button>
      </div>
    </>
  );
}
