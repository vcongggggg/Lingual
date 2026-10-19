'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { ProgressBar } from '@linguaflow/ui';

interface ExamAudioPlayerProps {
  audioText?: string;
  audioUrl?: string;
  title?: string;
  className?: string;
}

export default function ExamAudioPlayer({
  audioText,
  audioUrl,
  title = 'Bài nghe câu hỏi',
  className = '',
}: ExamAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayToggle = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = audioText || title;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'en-US';
      utterance.rate = playbackRate;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setTimeout(handlePlayToggle, 100);
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 backdrop-blur-xl shadow-md space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-slate-200">{title}</span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px]">
          {[0.75, 1.0, 1.25].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => {
                setPlaybackRate(rate);
                if (isPlaying) handlePlayToggle();
              }}
              className={`px-1.5 py-0.5 rounded-lg font-bold transition-colors ${
                playbackRate === rate ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePlayToggle}
          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Nghe audio</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleRestart}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="Nghe lại từ đầu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
