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
