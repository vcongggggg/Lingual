import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle2, Flame, Zap, Award, Sparkles, RotateCw, Lightbulb, Image as ImageIcon, Bookmark, PlusCircle, Check } from 'lucide-react';

import { springPresets, transitionPresets, useMotionAccessibility } from './motion/index';
export * from './motion/index';

// ============================================================================
// WEB SPEECH AUDIO SYNTHESIS HELPER
// ============================================================================

export function speakText(text: string, lang: string = 'en-US') {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

export const AudioButton: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakText(text);
      }}
      className={`p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 transition-all active:scale-90 select-none ${className}`}
      title="Nghe phát âm tiếng Anh"
    >
      <Volume2 className="w-4 h-4" />
    </button>
  );
};

// ============================================================================
// WORD-TO-IMAGE DICTIONARY RESOLVER
// ============================================================================

export const WORD_IMAGE_MAP: Record<string, string> = {
  hello: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80',
  'good morning': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=500&auto=format&fit=crop&q=80',
  goodbye: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&auto=format&fit=crop&q=80',
  'thank you': 'https://images.unsplash.com/photo-1499744632587-7798360ba20f?w=500&auto=format&fit=crop&q=80',
  please: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&auto=format&fit=crop&q=80',
  name: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
  country: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
  vietnamese: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&auto=format&fit=crop&q=80',
  england: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&auto=format&fit=crop&q=80',
  father: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
  mother: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  brother: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  sister: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
  rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80',
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
  pen: 'https://images.unsplash.com/photo-1585336261026-8f57857820f2?w=500&auto=format&fit=crop&q=80',
  teacher: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80',
  student: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
  sun: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
  rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=500&auto=format&fit=crop&q=80',
  music: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  computer: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80',
  airport: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=500&auto=format&fit=crop&q=80',
  price: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80',
  hospital: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80',
  internet: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
  environment: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=80',
};

export function getWordImage(targetText: string, providedUrl?: string): string {
  if (providedUrl && providedUrl.startsWith('http')) return providedUrl;
  const key = targetText.toLowerCase().trim();
  if (WORD_IMAGE_MAP[key]) return WORD_IMAGE_MAP[key];
  return `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=80`;
}

// ============================================================================
// 1. BUTTON COMPONENT
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const { shouldReduceMotion } = useMotionAccessibility();

  const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 border border-teal-400/30',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700 backdrop-blur-md',
    accent:
      'bg-gradient-to-r from-coral-500 via-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-extrabold shadow-lg shadow-amber-500/25 border border-amber-400/30',
    outline:
      'border border-teal-500/40 hover:bg-teal-500/10 text-teal-300 backdrop-blur-sm',
    ghost: 'hover:bg-slate-800/50 text-slate-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const hoverAnimation = disabled || shouldReduceMotion
    ? undefined
    : { scale: 1.015, y: -1, transition: springPresets.smooth };

  const pressAnimation = disabled || shouldReduceMotion
    ? undefined
    : { scale: 0.97, transition: springPresets.snappy };

  return (
    <motion.button
      disabled={disabled}
      whileHover={hoverAnimation}
      whileTap={pressAnimation}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as any)}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};

export const XPBadge: React.FC<{ xp: number }> = ({ xp }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
      <span>{xp} XP</span>
    </div>
  );
};

export const StreakBadge: React.FC<{ streak: number }> = ({ streak }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold shadow-sm">
      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
      <span>{streak} Ngày</span>
    </div>
  );
};

// ============================================================================
// 2. CARD COMPONENT WITH GLASSMORPHISM
// ============================================================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'teal' | 'coral' | 'amber';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glow = 'none', onClick }) => {
  const { shouldReduceMotion } = useMotionAccessibility();

  const glowStyles = {
    none: '',
    teal: 'shadow-lg shadow-teal-500/10 border-teal-500/30 hover:border-teal-400/50',
    coral: 'shadow-lg shadow-coral-500/10 border-coral-500/30 hover:border-coral-400/50',
    amber: 'shadow-lg shadow-amber-500/10 border-amber-500/30 hover:border-amber-400/50',
  };

  const isInteractive = Boolean(onClick);

  const hoverAnimation = isInteractive && !shouldReduceMotion
    ? { scale: 1.01, y: -2, transition: springPresets.smooth }
    : undefined;

  const pressAnimation = isInteractive && !shouldReduceMotion
    ? { scale: 0.98, transition: springPresets.snappy }
    : undefined;

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverAnimation}
      whileTap={pressAnimation}
      className={`rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl p-6 transition-colors duration-300 ${glowStyles[glow]} ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// 3. PROGRESS BAR COMPONENT
// ============================================================================

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  color?: 'teal' | 'coral' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'teal',
}) => {
  const { shouldReduceMotion } = useMotionAccessibility();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const isComplete = percentage >= 100;

  const colors = {
    teal: 'from-teal-400 to-emerald-400',
    coral: 'from-coral-400 to-rose-400',
    amber: 'from-amber-400 to-orange-400',
  };

  const completeGlow = {
    teal: 'shadow-md shadow-teal-400/40',
    coral: 'shadow-md shadow-coral-400/40',
    amber: 'shadow-md shadow-amber-400/40',
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex justify-between text-xs font-semibold text-slate-300">
          <span>{label}</span>
          <span className="font-mono text-teal-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full h-3 rounded-full bg-slate-800 border border-slate-700/50 overflow-hidden p-0.5 transition-shadow duration-300 ${isComplete ? completeGlow[color] : ''}`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
          initial={{ width: 0 }}
          animate={{
            width: `${percentage}%`,
            scale: isComplete && !shouldReduceMotion ? [1, 1.02, 1] : 1,
          }}
          transition={{
            width: transitionPresets.normal,
            scale: isComplete ? { duration: 0.3, times: [0, 0.5, 1] } : undefined,
          }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// 4. INTERACTIVE 3D SRS FLASHCARD COMPONENT
// ============================================================================

export interface SRSFlashcardProps {
  targetText: string;
  translation: string;
  phonetic?: string;
  imageUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  cefrLevel?: string;
  partOfSpeech?: string;
  onPlayAudio?: () => void;
}

export const SRSFlashcard: React.FC<SRSFlashcardProps> = ({
  targetText,
  translation,
  phonetic,
  imageUrl,
  exampleSentence,
  exampleTranslation,
  cefrLevel = 'A1',
  partOfSpeech = 'noun',
  onPlayAudio,
}) => {
  const { shouldReduceMotion } = useMotionAccessibility();
  const [isFlipped, setIsFlipped] = useState(false);
  const resolvedImage = getWordImage(targetText, imageUrl);

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayAudio) {
      onPlayAudio();
    } else {
      speakText(targetText);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-[4/5] perspective-1000 cursor-pointer select-none">
      <motion.div
        onClick={handleCardClick}
        animate={{
          rotateY: shouldReduceMotion ? 0 : isFlipped ? 180 : 0,
          opacity: shouldReduceMotion ? (isFlipped ? 0.95 : 1) : 1,
          scale: shouldReduceMotion ? 1 : [1, 1.015, 1],
        }}
        transition={{
          rotateY: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.2 },
          scale: { duration: 0.3 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-3xl"
      >
        {/* FRONT SIDE */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 border-2 border-teal-500/30 p-6 flex flex-col justify-between items-center text-center shadow-2xl shadow-teal-500/10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="w-full flex justify-between items-center z-10">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              {cefrLevel} • {partOfSpeech}
            </span>
            <button
              type="button"
              onClick={handleAudioPlay}
              className="p-2.5 rounded-2xl bg-teal-500/15 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 transition-all active:scale-90"
              title="Phát âm"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Illustration Image */}
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-teal-500/20 shadow-inner bg-slate-950 my-2 z-10 group">
            <img src={resolvedImage} alt={targetText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Main Word */}
          <div className="space-y-1.5 z-10">
            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-md">
              {targetText}
            </h2>
            {phonetic && (
              <p className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-lg inline-block border border-teal-500/20">
                {phonetic}
              </p>
            )}
          </div>

          {/* Flip Hint */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-4 py-1.5 rounded-full border border-slate-700/50 z-10">
            <RotateCw className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Chạm thẻ để lật xem nghĩa & ví dụ</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 p-6 flex flex-col justify-between items-center text-center rotate-y-180 shadow-2xl shadow-amber-500/10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="w-full flex justify-between items-center z-10">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              NGHĨA VIỆT & VÍ DỤ
            </span>
            <button
              type="button"
              onClick={handleAudioPlay}
              className="p-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-all active:scale-90"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Translation & Example */}
          <div className="space-y-4 my-auto w-full z-10">
            <h3 className="text-3xl font-display font-extrabold text-amber-300 drop-shadow-md">
              {translation}
            </h3>
            {exampleSentence && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/20 text-xs space-y-1.5 text-left shadow-lg">
                <p className="text-slate-100 font-semibold leading-relaxed">
                  🇬🇧 "{exampleSentence}"
                </p>
                {exampleTranslation && (
                  <p className="text-amber-400 font-medium leading-relaxed">
                    🇻🇳 ({exampleTranslation})
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Flip Back Hint */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-4 py-1.5 rounded-full border border-slate-700/50 z-10">
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Chạm thẻ để lật lại mặt trước</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 5. MODAL COMPONENT
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { shouldReduceMotion } = useMotionAccessibility();

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitionPresets.normal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: shouldReduceMotion ? 1 : 0.98, opacity: 0 }}
            transition={springPresets.smooth}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-teal-500/30 p-6 space-y-5 shadow-2xl shadow-teal-500/20 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xl font-display font-bold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 6. SKELETON COMPONENT
// ============================================================================

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-800/80 rounded-2xl ${className}`} />
  );
};

// ============================================================================
// 7. BADGE COMPONENT
// ============================================================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'amber' | 'coral' | 'slate' | 'emerald';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'teal', className = '' }) => {
  const styles = {
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    coral: 'bg-coral-500/10 border-coral-500/20 text-coral-300',
    slate: 'bg-slate-800 border-slate-700 text-slate-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ============================================================================
// 8. AVATAR COMPONENT
// ============================================================================

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'LF';

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-teal-500/30`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-extrabold flex items-center justify-center shadow-md select-none`}
    >
      {initials}
    </div>
  );
};

// ============================================================================
// 9. EMPTY STATE COMPONENT
// ============================================================================

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-teal-400">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-sm">
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

