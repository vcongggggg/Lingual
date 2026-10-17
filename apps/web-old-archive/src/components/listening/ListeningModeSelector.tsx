'use client';

import React from 'react';
import { Headphones, Mic } from 'lucide-react';
import { ListeningMode } from '@linguaflow/domain';
import { useMotionAccessibility, springPresets } from '@linguaflow/ui';
import { motion } from 'framer-motion';

interface ListeningModeSelectorProps {
  activeMode: ListeningMode;
  onSelectMode: (mode: ListeningMode) => void;
  className?: string;
}

export default function ListeningModeSelector({
  activeMode,
  onSelectMode,
  className = '',
}: ListeningModeSelectorProps) {
  const { shouldReduceMotion } = useMotionAccessibility();

  const modes = [
    {
      id: 'dictation' as ListeningMode,
      label: 'Chép chính tả',
      sublabel: 'Dictation',
      icon: Headphones,
      color: 'teal',
      description: 'Nghe từng câu và gõ lại chính xác',
    },
    {
      id: 'shadowing' as ListeningMode,
      label: 'Nhại giọng bản xứ',
      sublabel: 'Shadowing',
      icon: Mic,
      color: 'amber',
      description: 'Nghe & thu âm nhại lại theo ngữ điệu',
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Chế độ Luyện Nghe Nói"
      className={`grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl ${className}`}
    >
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        const Icon = mode.icon;

        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`listening-panel-${mode.id}`}
            id={`listening-tab-${mode.id}`}
            onClick={() => onSelectMode(mode.id)}
            className={`relative flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all select-none ${
              isActive
                ? mode.color === 'teal'
                  ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isActive
                  ? mode.color === 'teal'
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-amber-500/20 text-amber-300'
                  : 'bg-slate-800/60 text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-sm sm:text-base leading-tight">
                {mode.label}
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {mode.sublabel}
              </span>
            </div>

            {isActive && !shouldReduceMotion && (
              <motion.div
                layoutId="activeModeIndicator"
                className={`absolute inset-0 rounded-xl border-2 pointer-events-none ${
                  mode.color === 'teal' ? 'border-teal-400/40' : 'border-amber-400/40'
                }`}
                transition={springPresets.smooth}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
