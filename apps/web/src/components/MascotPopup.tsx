'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mascotReactions, MascotReactionKey } from '@linguaflow/config';

export interface MascotPopupProps {
  isVisible: boolean;
  reactionKey: MascotReactionKey;
  title?: string;
  message?: string;
  autoDismissMs?: number;
  onClose?: () => void;
}

export default function MascotPopup({
  isVisible,
  reactionKey,
  title,
  message,
  autoDismissMs = 3500,
  onClose,
}: MascotPopupProps) {
  useEffect(() => {
    if (!isVisible || !autoDismissMs || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoDismissMs);
    return () => clearTimeout(timer);
  }, [isVisible, autoDismissMs, onClose]);

  const stickerSrc = mascotReactions[reactionKey] || mascotReactions.greet;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8, rotate: -4 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 max-w-sm p-3.5 pr-5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-slate-100 pointer-events-auto"
        >
          <div className="relative w-16 h-16 shrink-0 -ml-1">
            <img
              src={stickerSrc}
              alt="Mascot Reaction"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div className="flex-1 min-w-0">
            {title && <h4 className="text-sm font-bold text-amber-400 leading-tight">{title}</h4>}
            {message && <p className="text-xs text-slate-300 font-medium leading-normal mt-0.5">{message}</p>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
