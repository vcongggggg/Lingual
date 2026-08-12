import type { Variants } from 'framer-motion';
import { transitionPresets } from './transitions';

/**
 * Lingual Motion System — Reusable Framer Motion Animation Variants
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionPresets.normal,
  },
  exit: {
    opacity: 0,
    transition: transitionPresets.micro,
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionPresets.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitionPresets.micro,
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPresets.normal,
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: transitionPresets.micro,
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPresets.normal,
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: transitionPresets.micro,
  },
};

export const pressVariants: Variants = {
  rest: { scale: 1 },
  pressed: { scale: 0.95 },
};

export const subtleHoverVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: transitionPresets.normal },
};

/**
 * LingLing Mascot Character Motion Variants
 */
export const mascotStateVariants: Variants = {
  idle: {
    y: [0, -2, 0],
    rotate: [-1, 1, -1],
    scale: [1, 1.01, 1],
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: 'easeInOut',
    },
  },
  thinking: {
    rotate: [-2, 2, -2],
    scale: [0.99, 1.01, 0.99],
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 2.2,
      ease: 'easeInOut',
    },
  },
  speaking: {
    scale: [1, 1.03, 1],
    y: [0, -1.5, 0],
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
  celebrating: {
    scale: [1, 1.08, 0.98, 1],
    y: [0, -12, 2, 0],
    rotate: [0, -4, 4, 0],
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  apologetic: {
    y: [0, 3, 0],
    rotate: [0, -3, 0],
    scale: [1, 0.98, 1],
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

/**
 * Peeking Mascot Edge Emergence Variants
 */
export const peekingVariants: Variants = {
  hidden: { y: 12, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    y: 12,
    opacity: 0,
    scale: 0.9,
    transition: transitionPresets.micro,
  },
};
