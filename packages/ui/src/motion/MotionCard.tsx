import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMotionAccessibility } from './reducedMotion';
import { springPresets } from './presets';

export interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'teal' | 'coral' | 'amber';
  onClick?: () => void;
  tilt?: boolean;
  spotlight?: boolean;
}

/**
 * Lingual Motion System — MotionCard Component with Selective 3D Pointer Tilt & Glass Spotlight
 * Animates GPU-accelerated transforms via MotionValues without React state updates.
 */
export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick,
  tilt = false,
  spotlight = false,
}) => {
  const { shouldReduceMotion } = useMotionAccessibility();
  const cardRef = useRef<HTMLDivElement>(null);

  // 60fps MotionValues for pointer tracking without triggering React state re-renders
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), springPresets.smooth);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), springPresets.smooth);

  const isInteractive = Boolean(onClick);
  const enableTilt = tilt && isInteractive && !shouldReduceMotion;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !enableTilt) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const glowStyles = {
    none: '',
    teal: 'shadow-lg shadow-teal-500/10 border-teal-500/30 hover:border-teal-400/50',
    coral: 'shadow-lg shadow-coral-500/10 border-coral-500/30 hover:border-coral-400/50',
    amber: 'shadow-lg shadow-amber-500/10 border-amber-500/30 hover:border-amber-400/50',
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        enableTilt
          ? {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }
          : undefined
      }
      whileHover={
        isInteractive && !shouldReduceMotion
          ? { scale: 1.015, y: -2, transition: springPresets.smooth }
          : undefined
      }
      whileTap={
        isInteractive && !shouldReduceMotion
          ? { scale: 0.98, transition: springPresets.snappy }
          : undefined
      }
      className={`group relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl p-6 transition-colors duration-300 ${glowStyles[glow]} ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
