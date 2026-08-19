'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartContainerProps {
  lives: number;
  maxLives?: number;
  className?: string;
}

export default function HeartContainer({ lives, maxLives = 3, className = '' }: HeartContainerProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md ${className}`}>
      {Array.from({ length: maxLives }).map((_, idx) => {
        const isAlive = idx < lives;
        return (
          <AnimatePresence key={idx} mode="wait">
            <motion.div
              initial={{ scale: 1 }}
              animate={
                isAlive
                  ? { scale: [1, 1.15, 1] }
                  : { scale: [1.3, 0.8, 1], filter: 'grayscale(100%)' }
              }
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                  isAlive
                    ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
