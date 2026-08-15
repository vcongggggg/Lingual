'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Clock, Type, Check, AlertCircle, RotateCcw } from 'lucide-react';

interface WritingEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  minWords?: number;
  maxWords?: number;
  targetWords?: string[];
  disabled?: boolean;
  showTimer?: boolean;
  showWordCount?: boolean;
  onTimerTick?: (seconds: number) => void;
  className?: string;
  rows?: number;
}

export default function WritingEditor({
  value,
  onChange,
  placeholder = 'Bắt đầu viết câu trả lời bằng tiếng Anh...',
  minWords = 10,
  maxWords,
  targetWords = [],
  disabled = false,
  showTimer = false,
  showWordCount = true,
  onTimerTick,
  className = '',
  rows = 5,
}: WritingEditorProps) {
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Timer effect
  useEffect(() => {
    if (!showTimer || !isTimerRunning || disabled) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onTimerTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer, isTimerRunning, disabled, onTimerTick]);

  const words = value.trim().length > 0 ? value.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = value.length;

  const isMinMet = wordCount >= minWords;
  const isMaxExceeded = maxWords ? wordCount > maxWords : false;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Check which target words are already used in current text
  const lowerText = value.toLowerCase();
  const targetUsage = targetWords.map((tw) => ({
    word: tw,
    used: lowerText.includes(tw.toLowerCase()),
  }));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Editor Header Toolbar (Word count, Target keywords, Timer) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Target Words Pills */}
        {targetWords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-semibold">Từ khóa gợi ý:</span>
            {targetUsage.map((item, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                  item.used
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
              >
                {item.used ? '✓ ' : ''}
                {item.word}
              </span>
            ))}
          </div>
        )}

        {/* Timer Bar */}
        {showTimer && (
          <div className="flex items-center gap-2 ml-auto font-mono text-xs font-bold text-teal-400 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(seconds)}</span>
          </div>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          aria-label="Khu vực nhập bài viết tiếng Anh"
          className={`w-full p-4 sm:p-5 rounded-2xl bg-slate-950/90 border text-white text-base leading-relaxed placeholder:text-slate-600 focus:outline-none transition-all shadow-inner resize-y min-h-[140px] font-sans ${
            isMaxExceeded
              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20'
              : 'border-slate-800 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20'
          }`}
        />
      </div>

      {/* Bottom Status Bar (Word counter, Characters, Guidance) */}
      {showWordCount && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold font-mono transition-colors ${
                isMaxExceeded
                  ? 'text-rose-400'
                  : isMinMet
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {wordCount} từ {minWords ? `(Mục tiêu: ${minWords}${maxWords ? ` - ${maxWords}` : ''} từ)` : ''}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 font-mono">{charCount} ký tự</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            {isMinMet && !isMaxExceeded ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã đủ độ dài
              </span>
            ) : isMaxExceeded ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Vượt quá số từ tối đa
              </span>
            ) : (
              <span className="text-slate-500">Viết thêm {minWords - wordCount} từ nữa</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
