'use client';

import React, { useState } from 'react';
import { Mic, Square, RotateCcw, Volume2, Send, Play, Sparkles } from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface SpeakingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onReset: () => void;
  onSubmit: () => void;
  sampleText?: string;
  hasTranscript?: boolean;
  isSubmitting?: boolean;
  locale?: string;
  className?: string;
}

export default function SpeakingControls({
  isRecording,
  onStartRecording,
  onStopRecording,
  onReset,
  onSubmit,
  sampleText,
  hasTranscript = false,
  isSubmitting = false,
  locale = 'vi',
  className = '',
}: SpeakingControlsProps) {
  const isVi = locale === 'vi';
  const [playbackRate, setPlaybackRate] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');

  const playAudio = () => {
    if (!sampleText || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    sfx.playClick();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.lang = accent;
    utterance.rate = playbackRate;
    window.speechSynthesis.speak(utterance);
  };

  const handleRecordToggle = () => {
    sfx.playClick();
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Audio Sample Controls if provided */}
      {sampleText && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={playAudio}
              icon={<Volume2 className="w-4 h-4 text-teal-400" />}
            >
              {isVi ? 'Phát âm mẫu' : 'Play Audio'}
            </Button>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              {([0.75, 1.0, 1.25] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setPlaybackRate(r)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    playbackRate === r ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>

            {/* Accent Selector */}
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value as any)}
              className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-2 py-1 text-[11px] font-bold focus:outline-none"
            >
              <option value="en-US">US (Mỹ)</option>
              <option value="en-GB">UK (Anh)</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-400 font-sans italic">
            Lắng nghe và bắt chước ngữ điệu trước khi nói
          </span>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Button
            variant={isRecording ? 'accent' : 'primary'}
            onClick={handleRecordToggle}
            icon={isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            className={`font-bold transition-all ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-lg shadow-rose-600/30'
                : 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20'
            }`}
          >
            {isRecording
              ? isVi ? 'Dừng nói (Stop)' : 'Stop Recording'
              : isVi ? 'Bắt đầu nói (Start)' : 'Start Speaking'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={isRecording}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {isVi ? 'Làm lại' : 'Reset'}
          </Button>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            sfx.playVictory();
            onSubmit();
          }}
          disabled={isRecording || !hasTranscript || isSubmitting}
          icon={<Send className="w-4 h-4" />}
          className="bg-gradient-to-r from-teal-400 to-amber-400 text-slate-950 font-extrabold shadow-lg disabled:opacity-40"
        >
          {isSubmitting
            ? isVi ? 'Đang chấm điểm...' : 'Grading...'
            : isVi ? 'Nộp bài & Nhận kết quả' : 'Submit & Analyze'}
        </Button>
      </div>
    </div>
  );
}
