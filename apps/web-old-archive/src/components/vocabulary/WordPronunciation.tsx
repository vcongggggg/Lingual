'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { playWordPronunciation, PronunciationAccent } from '@/lib/vocabulary/pronunciation';

interface WordPronunciationProps {
  targetText: string;
  phoneticUs?: string;
  phoneticUk?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WordPronunciation({
  targetText,
  phoneticUs,
  phoneticUk,
  className = '',
  size = 'md',
}: WordPronunciationProps) {
  const [playingAccent, setPlayingAccent] = useState<PronunciationAccent | null>(null);

  const handlePlay = (accent: PronunciationAccent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingAccent(accent);
    playWordPronunciation(targetText, accent, () => {
      setPlayingAccent(null);
    });
  };

  const buttonSizeClasses =
    size === 'sm'
      ? 'px-2 py-1 text-[11px] gap-1'
      : size === 'lg'
      ? 'px-4 py-2.5 text-sm gap-2'
      : 'px-3 py-1.5 text-xs gap-1.5';

  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      {/* US Accent Button */}
      <button
        type="button"
        onClick={(e) => handlePlay('US', e)}
        aria-label={`Nghe phát âm giọng Mỹ của từ ${targetText}`}
        className={`rounded-xl font-bold font-mono transition-all flex items-center select-none active:scale-90 ${buttonSizeClasses} ${
          playingAccent === 'US'
            ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/30 ring-2 ring-teal-400/40'
            : 'bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span className="font-extrabold uppercase text-[10px] bg-teal-950/80 px-1 rounded text-teal-300">
          US
        </span>
        {phoneticUs && <span className="font-normal">{phoneticUs}</span>}
      </button>

      {/* UK Accent Button */}
      <button
        type="button"
        onClick={(e) => handlePlay('UK', e)}
        aria-label={`Nghe phát âm giọng Anh của từ ${targetText}`}
        className={`rounded-xl font-bold font-mono transition-all flex items-center select-none active:scale-90 ${buttonSizeClasses} ${
          playingAccent === 'UK'
            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40'
            : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-extrabold uppercase text-[10px] bg-amber-950/80 px-1 rounded text-amber-300">
          UK
        </span>
        {phoneticUk && <span className="font-normal">{phoneticUk}</span>}
      </button>
    </div>
  );
}
