'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardEventPayload, REWARD_INTENSITY_MAP } from './rewardTypes';
import { useMotionAccessibility } from './reducedMotion';
import { springPresets } from './presets';
import { transitionPresets } from './transitions';

export interface RewardOverlayProps {
  event: RewardEventPayload | null;
  onDismiss?: () => void;
}

const semanticColors = ['#f59e0b', '#14b8a6', '#f43f5e', '#8b5cf6', '#10b981'];

export const RewardOverlay: React.FC<RewardOverlayProps> = ({ event, onDismiss }) => {
  const { shouldReduceMotion } = useMotionAccessibility();
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  const intensity = event ? event.intensity || REWARD_INTENSITY_MAP[event.type] || 'NORMAL' : 'NORMAL';

  useEffect(() => {
    if (!event || shouldReduceMotion) {
      setParticles([]);
      return;
    }

    // Generate lightweight, non-blocking DOM particles for MAJOR and EPIC rewards
    if (intensity === 'MAJOR' || intensity === 'EPIC') {
      const count = intensity === 'EPIC' ? 18 : 10;
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.6) * 160,
        color: semanticColors[i % semanticColors.length],
        size: Math.random() * 6 + 6,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }

    const autoDismissTimer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, intensity === 'EPIC' ? 1400 : intensity === 'MAJOR' ? 1000 : 700);

    return () => clearTimeout(autoDismissTimer);
  }, [event, intensity, shouldReduceMotion, onDismiss]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onDismiss) {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  if (!event) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onDismiss}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
      >
        {/* Celebration Card Dialog */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={shouldReduceMotion ? transitionPresets.micro : springPresets.bouncy}
          className="relative max-w-sm w-full p-6 pt-7 rounded-3xl bg-slate-900/95 border border-amber-500/40 shadow-2xl backdrop-blur-2xl text-center cursor-default overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer z-20 border border-slate-700/60"
            aria-label="Đóng popup thông báo"
          >
            ✕
          </button>

          {/* Particle Burst Layer */}
          {!shouldReduceMotion &&
            particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size,
                }}
                className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
              />
            ))}

          {/* Achievement Icon / Emoji */}
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.7, rotate: shouldReduceMotion ? 0 : -4 }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 4, 0] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-coral-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30"
          >
            {event.icon || '🏆'}
          </motion.div>

          {/* Reward Titles & XP */}
          <h3 className="text-xl font-display font-extrabold text-white drop-shadow-md">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{event.subtitle}</p>
          )}

          {event.xpAmount && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
              <span>+{event.xpAmount} XP Đã Nhận</span>
            </div>
          )}

          {/* Explicit Dismiss / Continue Action */}
          <div className="mt-5 pt-1">
            <button
              onClick={onDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-display font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
            >
              Tiếp Tục
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
