'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { arcadeAudio } from '@/lib/arcadeAudio';

export type MascotReaction = 'idle' | 'combo' | 'wrong' | 'urgent' | 'victory';

interface LiveMascotCompanionProps {
  reaction: MascotReaction;
  combo: number;
  lives: number;
  isVi?: boolean;
}

const MASCOT_IMAGES: Record<MascotReaction, string> = {
  idle: '/mascot/cow_salute.png',
  combo: '/mascot/cow_greet_heart.png',
  wrong: '/mascot/cow_cry_soft.png',
  urgent: '/mascot/cow_jump_angry.png',
  victory: '/mascot/cow_wink_kiss.png',
};

export default function LiveMascotCompanion({
  reaction,
  combo,
  lives,
  isVi = true,
}: LiveMascotCompanionProps) {
  const [speechText, setSpeechText] = useState<string>('');
  const [pokeCount, setPokeCount] = useState(0);

  useEffect(() => {
    if (reaction === 'combo') {
      const msgsVi = [
        `Combo x${combo}! Xuất sắc! 🔥`,
        `Tuyệt đỉnh! Tiếp tục nào! ⚡`,
        `Thần tốc quá bạn ơi! 🎯`,
      ];
      const msgsEn = [
        `Combo x${combo}! Outstanding! 🔥`,
        `Amazing streak! Keep it up! ⚡`,
        `Speed demon! 🎯`,
      ];
      const list = isVi ? msgsVi : msgsEn;
      setSpeechText(list[Math.floor(Math.random() * list.length)]);
    } else if (reaction === 'wrong') {
      const msgsVi = [
        lives <= 1 ? 'Coi chừng mất tim cuối nhé! 🥺' : 'Không sao, thử lại câu sau! 💪',
        'Bình tĩnh nhìn kỹ đáp án nha! ❤️',
      ];
      setSpeechText(msgsVi[Math.floor(Math.random() * msgsVi.length)]);
    } else if (reaction === 'urgent') {
      setSpeechText(isVi ? 'Sắp hết giờ rồi! Nhanh tay nào! ⏰' : 'Time running out! Hurry! ⏰');
    } else if (reaction === 'victory') {
      setSpeechText(isVi ? 'Chiến thắng vang dội! Quá đỉnh! 🏆' : 'Epic Victory! Unstoppable! 🏆');
    } else {
      setSpeechText(isVi ? 'LingLing đang cổ vũ bạn!' : 'LingLing is cheering for you!');
    }
  }, [reaction, combo, lives, isVi]);

  const handlePoke = () => {
    arcadeAudio.playTing();
    setPokeCount((p) => p + 1);
    setSpeechText(isVi ? 'Mooc! Chúc bạn đạt điểm kỷ lục nhé! ✨' : 'Moo! Break the high score! ✨');
  };

  const imageSrc = MASCOT_IMAGES[reaction] || MASCOT_IMAGES.idle;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 pointer-events-auto flex items-end gap-2.5 select-none">
      {/* Dynamic Speech Bubble */}
      <AnimatePresence mode="wait">
        {speechText && (
          <motion.div
            key={speechText}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="mb-14 hidden sm:block max-w-[200px] p-3 rounded-2xl bg-slate-900/95 border-2 border-cyan-500/40 text-xs font-bold text-white shadow-2xl backdrop-blur-md relative"
          >
            <span className="leading-snug">{speechText}</span>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-cyan-500/40 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Container */}
      <motion.div
        onClick={handlePoke}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={
          reaction === 'combo'
            ? { y: [0, -14, 0, -8, 0], rotate: [0, -4, 4, 0] }
            : reaction === 'wrong'
            ? { x: [-4, 4, -3, 3, 0] }
            : reaction === 'urgent'
            ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 0.6 } }
            : { y: [0, -4, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }
        }
        className="relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer group filter drop-shadow-2xl"
        title={isVi ? 'Bò LingLing (Chạm để tương tác)' : 'LingLing Mascot (Click to poke)'}
      >
        <Image
          src={imageSrc}
          alt="LingLing Mascot"
          fill
          className="object-contain"
          unoptimized
        />

        {/* Ambient Ring on Combo */}
        {reaction === 'combo' && (
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse -z-10" />
        )}
      </motion.div>
    </div>
  );
}
