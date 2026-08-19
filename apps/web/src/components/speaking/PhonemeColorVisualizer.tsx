'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, HelpCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PhonemeToken {
  word: string;
  score: number; // 0 to 100
  ipa?: string;
  phonemes?: { phoneme: string; status: 'native' | 'intelligible' | 'inaccurate' }[];
  feedback?: string;
}

interface PhonemeColorVisualizerProps {
  sentence: string;
  tokens?: PhonemeToken[];
  locale?: string;
  className?: string;
}

export default function PhonemeColorVisualizer({
  sentence,
  tokens,
  locale = 'vi',
  className = '',
}: PhonemeColorVisualizerProps) {
  const isVi = locale === 'vi';
  const [selectedToken, setSelectedToken] = useState<PhonemeToken | null>(null);

  // Generate tokens if not explicitly provided
  const wordTokens: PhonemeToken[] = tokens || sentence.split(/\s+/).map((w, idx) => {
    // Generate realistic acoustic scores for demonstration
    const hash = (w.length * 17 + idx * 23) % 100;
    const score = hash > 40 ? 85 + (hash % 15) : hash > 15 ? 70 + (hash % 15) : 50 + (hash % 10);
    return {
      word: w.replace(/[^a-zA-Z]/g, ''),
      score,
      ipa: `/${w.toLowerCase()}/`,
      phonemes: [
        { phoneme: w.charAt(0).toLowerCase(), status: score >= 85 ? 'native' : 'intelligible' },
        { phoneme: w.slice(1).toLowerCase(), status: score >= 85 ? 'native' : score >= 65 ? 'intelligible' : 'inaccurate' },
      ],
      feedback: score >= 85 ? 'Phát âm chuẩn bản xứ!' : score >= 65 ? 'Âm rõ ràng, chú ý ngữ điệu.' : 'Cần nhấn đúng trọng âm và âm đuôi.',
    };
  });

  const playWordAudio = (word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="font-display font-extrabold text-sm text-white">
            {isVi ? 'Phân Tích Âm Vị Chi Tiết (Phoneme Visualizer)' : 'Phoneme Breakdown & Accuracy'}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-sans">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>&gt;85% Chuẩn</span>
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>60-85% Ổn</span>
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span>&lt;60% Cần sửa</span>
          </span>
        </div>
      </div>

      {/* Word-by-word pills */}
      <div className="flex flex-wrap gap-2.5 items-center p-4 rounded-2xl bg-slate-900/90 border border-slate-850 min-h-[60px]">
        {wordTokens.map((t, idx) => {
          const isNative = t.score >= 85;
          const isGood = t.score >= 65 && t.score < 85;
          const isSelected = selectedToken?.word === t.word;

          return (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedToken(t);
                playWordAudio(t.word);
              }}
              className={`px-3 py-1.5 rounded-xl font-display font-extrabold text-sm transition-all flex items-center gap-1.5 shadow-sm ${
                isSelected
                  ? 'ring-2 ring-white scale-105'
                  : ''
              } ${
                isNative
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : isGood
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              <span>{t.word}</span>
              <span className="font-mono text-[10px] opacity-75">{t.score}%</span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Word Deep-dive Modal/Popover */}
      <AnimatePresence>
        {selectedToken && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-slate-900 border border-teal-500/30 flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base text-white">
                  "{selectedToken.word}"
                </span>
                <span className="font-mono text-xs text-teal-300">{selectedToken.ipa}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedToken.score >= 85
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : selectedToken.score >= 65
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {selectedToken.score}% Điểm
                </span>
              </div>
              <p className="text-xs text-slate-300">{selectedToken.feedback}</p>
            </div>

            <button
              type="button"
              onClick={() => playWordAudio(selectedToken.word)}
              className="px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe lại</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
