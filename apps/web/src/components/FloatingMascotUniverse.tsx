'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Zap, Plus, RotateCcw } from 'lucide-react';
import { mascotReactions } from '@linguaflow/config';

interface MascotItem {
  id: string;
  src: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  x: number; // percentage 3-95
  y: number; // percentage 4-92
  depth: 'far' | 'mid' | 'front';
  floatDuration: number;
  floatDistance: number;
  dialogue: string;
  dragDialogue: string;
  rotateDeg: number;
}

const INITIAL_MASCOTS: MascotItem[] = [
  {
    id: 'm1',
    src: mascotReactions.greet,
    size: 'lg',
    x: 5,
    y: 16,
    depth: 'front',
    floatDuration: 6.5,
    floatDistance: 20,
    dialogue: 'Moo! Chào bạn! 💖',
    dragDialogue: 'Woah! Đang kéo tớ đi đâu thế?! 🐮',
    rotateDeg: -6,
  },
  {
    id: 'm2',
    src: mascotReactions.focus_mode,
    size: 'md',
    x: 87,
    y: 18,
    depth: 'mid',
    floatDuration: 8.5,
    floatDistance: 22,
    dialogue: 'Tập trung ôn IELTS! 🎯',
    dragDialogue: 'Kéo tớ thẳng đến Band 8.0! 🏆',
    rotateDeg: 8,
  },
  {
    id: 'm3',
    src: mascotReactions.celebrate_big,
    size: 'lg',
    x: 91,
    y: 62,
    depth: 'front',
    floatDuration: 5.8,
    floatDistance: 24,
    dialogue: 'Học vui nhận XP! 🚀',
    dragDialogue: 'Wheee! Bay trôi tự do! ✨',
    rotateDeg: -8,
  },
  {
    id: 'm4',
    src: mascotReactions.confirm,
    size: 'sm',
    x: 10,
    y: 72,
    depth: 'far',
    floatDuration: 11,
    floatDistance: 14,
    dialogue: 'High Five nào! ✋',
    dragDialogue: 'Yeahhh! Thả tớ ra tớ bay nè! 🎈',
    rotateDeg: 12,
  },
  {
    id: 'm5',
    src: mascotReactions.challenge,
    size: 'md',
    x: 80,
    y: 84,
    depth: 'mid',
    floatDuration: 7.8,
    floatDistance: 18,
    dialogue: 'Thách thức 60s! 🔥',
    dragDialogue: 'Siêu phẩm gõ phím Super Combo! ⚡',
    rotateDeg: -10,
  },
  {
    id: 'm6',
    src: mascotReactions.relax_done,
    size: 'sm',
    x: 46,
    y: 10,
    depth: 'far',
    floatDuration: 12,
    floatDistance: 12,
    dialogue: 'Thư giãn chút nào~ 🍃',
    dragDialogue: 'Ôi tớ đang chill trôi bồng bềnh~ ☁️',
    rotateDeg: 4,
  },
  {
    id: 'm7',
    src: mascotReactions.loading,
    size: 'md',
    x: 3,
    y: 46,
    depth: 'mid',
    floatDuration: 7.2,
    floatDistance: 26,
    dialogue: 'Đua tốc độ gõ phím! ⚡',
    dragDialogue: 'Gõ phím thần tốc 120 WPM! 🏎️',
    rotateDeg: 15,
  },
  {
    id: 'm8',
    src: mascotReactions.idle_empty,
    size: 'sm',
    x: 50,
    y: 88,
    depth: 'far',
    floatDuration: 10,
    floatDistance: 15,
    dialogue: 'Ôn tập SRS thông minh! 🧠',
    dragDialogue: 'Thuật toán lặp lại ngắt quãng SM-2! 📚',
    rotateDeg: -5,
  },
  {
    id: 'm9',
    src: '/mascot/cow_jump_angry.png',
    size: 'lg',
    x: 22,
    y: 28,
    depth: 'front',
    floatDuration: 6.2,
    floatDistance: 22,
    dialogue: 'Bứt phá Streak ngay! 🔥',
    dragDialogue: 'Cháy hết mình cùng Lingual! 💥',
    rotateDeg: -12,
  },
  {
    id: 'm10',
    src: '/mascot/cow_cry_soft.png',
    size: 'xs',
    x: 35,
    y: 80,
    depth: 'far',
    floatDuration: 13,
    floatDistance: 10,
    dialogue: 'Đừng quên học hôm nay nhé~ 🥺',
    dragDialogue: 'Bắt tớ rồi thì đi làm bài ngay nha! 📖',
    rotateDeg: 6,
  },
  {
    id: 'm11',
    src: '/mascot/cow_back_view.png',
    size: 'sm',
    x: 68,
    y: 20,
    depth: 'far',
    floatDuration: 11.5,
    floatDistance: 16,
    dialogue: 'Bí mật đằng sau vũ trụ... 🌌',
    dragDialogue: 'Xoay tớ lại đi mà! 🔄',
    rotateDeg: -14,
  },
  {
    id: 'm12',
    src: '/mascot/raw/mascot_sticker_clean_01.png',
    size: 'md',
    x: 75,
    y: 42,
    depth: 'mid',
    floatDuration: 8.2,
    floatDistance: 20,
    dialogue: 'Từ vựng cốt lõi Oxford 3000! 💡',
    dragDialogue: 'Nhớ 10 từ mới mỗi ngày nào! 🌟',
    rotateDeg: 9,
  },
  {
    id: 'm13',
    src: '/mascot/raw/mascot_sticker_clean_03.png',
    size: 'xs',
    x: 18,
    y: 88,
    depth: 'far',
    floatDuration: 14,
    floatDistance: 12,
    dialogue: 'Tiếng Anh là siêu năng lực! ✨',
    dragDialogue: 'Kéo thả tớ vui phết! 🎮',
    rotateDeg: -7,
  },
  {
    id: 'm14',
    src: '/mascot/raw/mascot_sticker_clean_05.png',
    size: 'lg',
    x: 28,
    y: 68,
    depth: 'front',
    floatDuration: 6.8,
    floatDistance: 25,
    dialogue: 'Lật thẻ 3D ghép từ siêu tốc! 🧩',
    dragDialogue: 'Ném tớ lên đỉnh Bảng Xếp Hạng! 🥇',
    rotateDeg: 10,
  },
  {
    id: 'm15',
    src: '/mascot/raw/mascot_sticker_clean_08.png',
    size: 'sm',
    x: 62,
    y: 76,
    depth: 'mid',
    floatDuration: 9.5,
    floatDistance: 16,
    dialogue: 'Học mọi lúc mọi nơi! 📱',
    dragDialogue: 'Vừa chơi vừa thuộc bài! 🎯',
    rotateDeg: -11,
  },
  {
    id: 'm16',
    src: '/mascot/raw/mascot_sticker_clean_12.png',
    size: 'xs',
    x: 82,
    y: 4,
    depth: 'far',
    floatDuration: 15,
    floatDistance: 8,
    dialogue: 'Sao băng Bò LingLing 🌠',
    dragDialogue: 'Ước nguyện đạt IELTS 9.0! 🌠',
    rotateDeg: 15,
  },
  {
    id: 'm17',
    src: '/mascot/raw/mascot_sticker_clean_15.png',
    size: 'md',
    x: 14,
    y: 38,
    depth: 'mid',
    floatDuration: 8.8,
    floatDistance: 21,
    dialogue: 'Writing Task 2 Band 7.5+! ✍️',
    dragDialogue: 'AI Chấm điểm bài viết tức thì! 🤖',
    rotateDeg: -9,
  },
  {
    id: 'm18',
    src: '/mascot/raw/mascot_sticker_clean_20.png',
    size: 'sm',
    x: 40,
    y: 45,
    depth: 'far',
    floatDuration: 10.5,
    floatDistance: 14,
    dialogue: 'Listening Section 4 no problem! 🎧',
    dragDialogue: 'Luyện nghe phản xạ chuẩn bản x xứ! 🗣️',
    rotateDeg: 5,
  },
  {
    id: 'm19',
    src: '/mascot/raw/mascot_sticker_clean_25.png',
    size: 'lg',
    x: 60,
    y: 35,
    depth: 'front',
    floatDuration: 7.0,
    floatDistance: 24,
    dialogue: 'Chiến thuật Reading 2 cột! 📖',
    dragDialogue: 'True / False / Not Given cân hết! ⚡',
    rotateDeg: -6,
  },
  {
    id: 'm20',
    src: '/mascot/raw/mascot_sticker_clean_30.png',
    size: 'xs',
    x: 94,
    y: 42,
    depth: 'far',
    floatDuration: 12.8,
    floatDistance: 10,
    dialogue: 'Vũ trụ từ vựng vô tận! 🌌',
    dragDialogue: 'Trôi dạt đến dải ngân hà! 🚀',
    rotateDeg: 12,
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
  const [mascots, setMascots] = useState<MascotItem[]>(INITIAL_MASCOTS);
  const [activeMascotId, setActiveMascotId] = useState<string | null>(null);
  const [draggingMascotId, setDraggingMascotId] = useState<string | null>(null);
  const [xpPops, setXpPops] = useState<XPPop[]>([]);

  // Framer Motion values for lag-free, non-re-rendering mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Mouse Parallax Track (updates MotionValues directly, avoiding React state updates)
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xVal = (e.clientX / innerWidth - 0.5) * 2;
      const yVal = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(xVal);
      mouseY.set(yVal);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, mouseX, mouseY]);

  // Mascot Click & Drag Release XP Particle Burst
  const triggerXPBurst = (clientX: number, clientY: number, amount = '+15 XP ✨') => {
    const newPop: XPPop = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY - 15,
      text: amount,
    };

    setXpPops((prev) => [...prev, newPop]);

    setTimeout(() => {
      setXpPops((prev) => prev.filter((p) => p.id !== newPop.id));
    }, 1500);
  };

  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerXPBurst(e.clientX, e.clientY, '+20 XP 🌟');
  };

  // Add Dynamic Extra Mascots (+5)
  const handleAddMoreMascots = () => {
    const extraStickies = [
      mascotReactions.greet,
      mascotReactions.celebrate_big,
      mascotReactions.focus_mode,
      mascotReactions.challenge,
      '/mascot/raw/mascot_sticker_clean_04.png',
      '/mascot/raw/mascot_sticker_clean_07.png',
      '/mascot/raw/mascot_sticker_clean_10.png',
    ];

    const newMascots: MascotItem[] = Array.from({ length: 5 }).map((_, idx) => ({
      id: `extra_${Date.now()}_${idx}`,
      src: extraStickies[Math.floor(Math.random() * extraStickies.length)],
      size: (['sm', 'md', 'lg'] as const)[Math.floor(Math.random() * 3)],
      x: Math.floor(Math.random() * 85) + 5,
      y: Math.floor(Math.random() * 85) + 5,
      depth: (['far', 'mid', 'front'] as const)[Math.floor(Math.random() * 3)],
      floatDuration: Math.random() * 6 + 6,
      floatDistance: Math.floor(Math.random() * 15) + 15,
      dialogue: 'Tớ vừa gia nhập vũ trụ nè! 🐮✨',
      dragDialogue: 'Woah! Siêu bò trôi tự do! 🚀',
      rotateDeg: Math.floor(Math.random() * 30) - 15,
    }));

    setMascots((prev) => [...prev, ...newMascots]);
  };

  // Reset Mascot Positions
  const handleResetPositions = () => {
    setMascots(INITIAL_MASCOTS);
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
      <div className="fixed inset-0 pointer-events-none z-0 bg-slate-950 overflow-hidden select-none">
        {/* Glowing Cosmic Nebula Spheres */}
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 blur-[110px]" />

        {/* Floating Twinkling Stars Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      {/* INTERACTIVE FLOATING MASCOTS LAYER (Z-20 ABOVE PAGE BODY, BELOW BUTTONS) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none">

        {/* FLOATING & DRAGGABLE MASCOT ENTITIES */}
        {mascots.map((m) => {
          const depthMultiplier = m.depth === 'front' ? 28 : m.depth === 'mid' ? 16 : 7;

          const sizePx = m.size === 'lg' ? 96 : m.size === 'md' ? 64 : m.size === 'sm' ? 40 : 26;
          const initialOpacity = m.depth === 'far' ? 0.45 : m.depth === 'mid' ? 0.75 : 1.0;
          const initialBlur = m.depth === 'far' ? 1.5 : 0;

          const isHovered = activeMascotId === m.id;
          const isDragging = draggingMascotId === m.id;

          return (
            <motion.div
              key={m.id}
              className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                opacity: initialOpacity,
              }}
              // Interactive Drag & Drop Physics
              drag
              dragSnapToOrigin={true}
              dragElastic={0.15}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 18 }}
              onDragStart={() => setDraggingMascotId(m.id)}
              onDragEnd={(e: any) => {
                setDraggingMascotId(null);
                if (e?.clientX && e?.clientY) {
                  triggerXPBurst(e.clientX, e.clientY, '+25 XP 🚀');
                }
              }}
              whileHover={{ scale: 1.35, zIndex: 40 }}
              whileDrag={{ scale: 1.45, zIndex: 50 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setActiveMascotId(m.id)}
              onHoverEnd={() => setActiveMascotId(null)}
              onClick={handleMascotClick}
            >
              {/* CSS Parallax Wrapper Container (Performs calculation at 120fps+ directly in DOM) */}
              <div
                style={{
                  transform: (isHovered || isDragging)
                    ? 'translate3d(0px, 0px, 0px)'
                    : `translate3d(calc(var(--mouse-x) * ${depthMultiplier}px), calc(var(--mouse-y) * ${depthMultiplier}px), 0px)`,
                  transition: 'transform 0.25s cubic-bezier(0.1, 0.8, 0.15, 1)', // Smooth lag
                }}
              >
                <motion.div
                  className="relative group"
                  animate={
                    (isHovered || isDragging)
                      ? { x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }
                      : {
                          x: [0, (m.floatDistance * (m.id.charCodeAt(0) % 2 === 0 ? 1 : -1)) * 0.5, 0],
                          y: [0, -m.floatDistance * 0.5, 0],
                          rotate: [m.rotateDeg, m.rotateDeg + 5, m.rotateDeg - 4, m.rotateDeg],
                          filter: `blur(${initialBlur}px)`,
                        }
                  }
                  transition={
                    (isHovered || isDragging)
                      ? { type: 'spring', stiffness: 200, damping: 25 }
                      : {
                          duration: m.floatDuration,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                  }
                >
                  {/* Dialogue Speech Bubble (On Hover or Drag) */}
                  <AnimatePresence>
                    {(isHovered || isDragging) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.8 }}
                        animate={{ opacity: 1, y: -16, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.8 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-50 pointer-events-none"
                      >
                        <div
                          className={`px-3 py-1.5 rounded-2xl border text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5 ${
                            isDragging
                              ? 'bg-amber-500/95 border-amber-300 text-slate-950 font-black scale-110 shadow-amber-500/50'
                              : 'bg-slate-900/95 border-amber-500/50 text-amber-300'
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isDragging ? 'text-slate-950 animate-bounce' : 'text-amber-400 animate-spin'}`} />
                          <span>{isDragging ? m.dragDialogue : m.dialogue}</span>
                        </div>
                        <div
                          className={`w-2 h-2 border-b border-r transform rotate-45 mx-auto -mt-1 ${
                            isDragging ? 'bg-amber-500 border-amber-300' : 'bg-slate-900 border-amber-500/50'
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mascot Image Display */}
                  <div
                    className="relative"
                    style={{ width: sizePx, height: sizePx }}
                  >
                    {/* Glowing Aura Ring on Drag/Hover */}
                    <div
                      className={`absolute inset-0 rounded-full transition-[background-color,transform,filter] duration-300 ${
                        isDragging
                          ? 'bg-amber-400/40 blur-xl scale-150 animate-pulse'
                          : 'bg-amber-400/0 group-hover:bg-amber-400/25 blur-md'
                      }`}
                    />

                    <img
                      src={m.src}
                      alt="Floating Draggable Cosmic LingLing"
                      draggable={false}
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.7)]"
                    />
                  </div>
                </motion.div>
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
            animate={{ opacity: 0, y: pop.y - 70, scale: 1.3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute font-display font-black text-amber-300 text-sm drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] bg-slate-900/95 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xl backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{pop.text}</span>
          </motion.div>
        ))}
      </div>

      {/* FLOATING CONTROLS WIDGET (BOTTOM LEFT) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setEnabled(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-medium shadow-lg backdrop-blur-md transition-all active:scale-95 group"
          title="Tắt hiệu ứng Bò LingLing trôi nổi"
        >
          <EyeOff className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
          <span>Vũ Trụ ({mascots.length} Bò)</span>
        </button>

        <button
          onClick={handleAddMoreMascots}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Thêm 5 Bò LingLing trôi nổi"
        >
          <Plus className="w-3 h-3" />
          <span>+5 Bò</span>
        </button>

        <button
          onClick={handleResetPositions}
          className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="Đặt lại vị trí mặc định"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </>
  );
}
