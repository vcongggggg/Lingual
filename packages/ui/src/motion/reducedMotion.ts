import { useReducedMotion } from 'framer-motion';

/**
 * Lingual Motion System — Reduced Motion Helper
 * Wraps Framer Motion's useReducedMotion hook to ensure accessible motion for users with prefers-reduced-motion active.
 */
export function useMotionAccessibility() {
  const shouldReduceMotion = useReducedMotion();

  return {
    shouldReduceMotion: Boolean(shouldReduceMotion),

    /**
     * Safe transform helper: Suppresses large pixel translations and scaling when reduced motion is preferred,
     * while retaining subtle opacity transitions so UI feedback remains readable.
     */
    getSafeAnimation<T extends Record<string, any>>(normalAnimation: T, reducedFallback?: Partial<T>): T {
      if (!shouldReduceMotion) return normalAnimation;

      const fallback = reducedFallback || {};
      const safe: Record<string, any> = { ...normalAnimation, ...fallback };

      // Strip large translation / scale properties if no explicit fallback is provided
      if (!reducedFallback) {
        if ('y' in safe) safe.y = 0;
        if ('x' in safe) safe.x = 0;
        if ('scale' in safe) safe.scale = 1;
        if ('rotate' in safe) safe.rotate = 0;
        if ('rotateY' in safe) safe.rotateY = 0;
      }

      return safe as T;
    },
  };
}
