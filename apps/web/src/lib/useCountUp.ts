'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to count up from a starting value (default 0) to endVal over a given duration.
 * Respects `prefers-reduced-motion` by jumping directly to endVal.
 */
export function useCountUp(endVal: number, durationMs: number = 700, startVal: number = 0): number {
  const [count, setCount] = useState<number>(startVal);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(endVal);
      return;
    }

    if (endVal === startVal) {
      setCount(endVal);
      return;
    }

    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easeProgress);
      setCount(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [endVal, durationMs, startVal]);

  return count;
}
