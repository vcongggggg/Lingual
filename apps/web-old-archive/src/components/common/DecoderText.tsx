'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface DecoderTextProps {
  text: string;
  className?: string;
  durationMs?: number;
  characters?: string;
}

const DEFAULT_CHARS = '!@#$%^&*<>[]{}10XYZ_~';

export function DecoderText({
  text,
  className = '',
  durationMs = 400,
  characters = DEFAULT_CHARS,
}: DecoderTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    const startTime = performance.now();
    const length = text.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Number of characters already resolved
      const resolvedIndex = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
        } else if (i < resolvedIndex) {
          scrambled += text[i];
        } else {
          scrambled += characters[Math.floor(Math.random() * characters.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [text, durationMs, characters]);

  return <span className={`font-mono tracking-wide ${className}`}>{displayText}</span>;
}
