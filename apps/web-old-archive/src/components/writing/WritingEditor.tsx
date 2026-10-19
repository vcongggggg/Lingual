'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Clock, Type, Check, AlertCircle, RotateCcw, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { ProgressBar } from '@linguaflow/ui';

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
  locale?: string;
}

export default function WritingEditor({
  value,
  onChange,
  placeholder = 'Bắt đầu viết câu trả lời bằng tiếng Anh...',
  minWords = 10,
  maxWords = 250,
  targetWords = [],
  disabled = false,
  showTimer = false,
  showWordCount = true,
  onTimerTick,
  className = '',
  rows = 6,
  locale = 'vi',
}: WritingEditorProps) {
  const isVi = locale === 'vi';
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

  // Calculate unique vocabulary richness ratio
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
  const richnessPercent = wordCount > 0 ? Math.round((uniqueWords / wordCount) * 100) : 0;

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
    <div className={`space-y-4 ${className}`}>
      {/* Editor Header Toolbar (Word count, Target keywords, Timer) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Target Words Pills */}
        {targetWords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold">{isVi ? 'Từ khóa mục tiêu:' : 'Keywords:'}</span>
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

      {/* Main Textarea Creative Canvas */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          aria-label="Khu vực nhập bài viết tiếng Anh"
          className={`w-full p-4 sm:p-5 rounded-2xl bg-slate-950/90 border text-white text-base leading-relaxed placeholder:text-slate-600 focus:outline-none transition-all shadow-inner resize-y min-h-[160px] font-sans ${
            isMaxExceeded
              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20'
              : 'border-slate-800 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20'
          }`}
        />

        {/* Floating Quick Count Badge in corner */}
        <div className="absolute bottom-3.5 right-3.5 pointer-events-none text-[11px] font-mono font-bold bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400">
          {charCount} {isVi ? 'ký tự' : 'chars'}
        </div>
      </div>

      {/* Real-Time Writing Studio Metrics (Goal Meter & Vocabulary Richness) */}
      {showWordCount && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-850 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-teal-400" />
                <span>{isVi ? 'Tiến độ số từ' : 'Word Count Goal'}</span>
              </span>
              <span className={`font-mono font-bold ${isMinMet ? 'text-teal-300' : 'text-amber-400'}`}>
                {wordCount} / {minWords} {isVi ? 'từ tối thiểu' : 'min words'}
              </span>
            </div>
            <ProgressBar value={wordCount} max={minWords} color={isMinMet ? 'teal' : 'amber'} />
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-850 pt-2 sm:pt-0 sm:pl-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{isVi ? 'Độ phong phú từ vựng' : 'Lexical Diversity'}</span>
              </span>
              <span className="font-mono font-bold text-purple-300">
                {richnessPercent}% ({uniqueWords} {isVi ? 'từ đơn nhất' : 'unique'})
              </span>
            </div>
            <ProgressBar value={richnessPercent} max={100} color="teal" />
          </div>
        </div>
      )}
    </div>
  );
}
