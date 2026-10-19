'use client';

import React from 'react';
import { tokenizeReadingText } from '@/lib/reading/tokenizeReadingText';
import { ReadingParagraph as IReadingParagraph } from '@linguaflow/domain';

interface ReadingParagraphProps {
  paragraph: IReadingParagraph;
  showTranslation: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  onWordClick: (word: string, rect: DOMRect) => void;
  className?: string;
}

export default function ReadingParagraph({
  paragraph,
  showTranslation,
  fontSize,
  onWordClick,
  className = '',
}: ReadingParagraphProps) {
  const tokens = tokenizeReadingText(paragraph.english);

  const fontSizeClasses = {
    normal: 'text-base sm:text-lg leading-relaxed sm:leading-loose',
    large: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    xlarge: 'text-xl sm:text-2xl leading-relaxed sm:leading-loose',
  };

  const handleTokenClick = (e: React.MouseEvent<HTMLSpanElement>, token: string) => {
    // Only trigger lookup if token contains alphabetical characters (not standalone punctuation)
    if (/[\p{L}\p{N}]/u.test(token)) {
      const rect = e.currentTarget.getBoundingClientRect();
      onWordClick(token, rect);
    }
  };

  return (
    <div className={`p-5 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-3.5 hover:border-slate-700/80 transition-colors ${className}`}>
      {/* English Text with Interactive Clickable Word Tokens */}
      <div className={`font-serif text-slate-100 ${fontSizeClasses[fontSize]}`}>
        {tokens.map((token, idx) => {
          const isWord = /[\p{L}\p{N}]/u.test(token);

          if (!isWord) {
            return <span key={idx} className="text-slate-400 select-none">{token} </span>;
          }

          return (
            <span
              key={idx}
              onClick={(e) => handleTokenClick(e, token)}
              className="cursor-pointer hover:text-teal-300 hover:bg-teal-500/20 hover:rounded px-0.5 transition-colors underline-offset-4 hover:underline decoration-teal-400/60 inline-block"
              title={`Nhấn để tra từ: "${token}"`}
            >
              {token}{' '}
            </span>
          );
        })}
      </div>

      {/* Synchronized Vietnamese Translation */}
      {showTranslation && (
        <div className="pt-2 border-t border-slate-800/60 text-xs sm:text-sm text-teal-300/90 leading-relaxed font-sans bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850 animate-in fade-in duration-150">
          <span className="font-bold text-teal-400 mr-1.5 font-mono text-xs">🇻🇳 Dịch nghĩa:</span>
          {paragraph.vietnamese}
        </div>
      )}
    </div>
  );
}
