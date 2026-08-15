'use client';

import React from 'react';
import { Volume2, VolumeX, Globe, Type, Bookmark, Play, Pause } from 'lucide-react';
import { ProgressBar } from '@linguaflow/ui';

interface ReadingToolbarProps {
  fontSize: 'normal' | 'large' | 'xlarge';
  onFontSizeChange: (size: 'normal' | 'large' | 'xlarge') => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  isPlayingAudio: boolean;
  audioSpeed: number;
  onTogglePlayAudio: () => void;
  onChangeAudioSpeed: (speed: number) => void;
  progressPercentage: number;
  className?: string;
}

export default function ReadingToolbar({
  fontSize,
  onFontSizeChange,
  showTranslation,
  onToggleTranslation,
  isPlayingAudio,
  audioSpeed,
  onTogglePlayAudio,
  onChangeAudioSpeed,
  progressPercentage,
  className = '',
}: ReadingToolbarProps) {
  const speeds = [0.75, 1.0, 1.25];

  return (
    <div className={`sticky top-20 z-20 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-3 ${className}`}>
      {/* Left controls: Translation & Font size */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Bilingual Toggle */}
        <button
          type="button"
          onClick={onToggleTranslation}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            showTranslation
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
              : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{showTranslation ? 'Song ngữ EN + VI' : 'Chỉ tiếng Anh (EN)'}</span>
        </button>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onFontSizeChange('normal')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              fontSize === 'normal' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Cỡ chữ tiêu chuẩn"
          >
            Aa
          </button>
          <button
            type="button"
            onClick={() => onFontSizeChange('large')}
            className={`px-2 py-1 rounded-lg font-bold text-sm transition-all ${
              fontSize === 'large' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Cỡ chữ lớn"
          >
            Aa+
          </button>
        </div>
      </div>

      {/* Right controls: Audio Narration & Speed */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlayAudio}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            isPlayingAudio
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-950/80 text-slate-300 hover:text-white border-slate-800'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>Nghe bài đọc</span>
            </>
          )}
        </button>

        {/* Speed toggle */}
        {isPlayingAudio && (
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-xs">
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeAudioSpeed(s)}
                className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold ${
                  audioSpeed === s ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Progress Bar */}
      <div className="w-full pt-1">
        <ProgressBar value={progressPercentage} max={100} color="teal" />
      </div>
    </div>
  );
}
