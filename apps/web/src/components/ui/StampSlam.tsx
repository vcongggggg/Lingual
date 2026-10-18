'use client';

import React, { useEffect, useState } from 'react';

export interface StampSlamProps {
  text: string;
  subtext?: string;
  color?: 'red' | 'teal' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  delayMs?: number;
  className?: string;
  variant?: 'badge' | 'circle' | 'rect';
  onSlam?: () => void;
}

export const StampSlam: React.FC<StampSlamProps> = ({
  text,
  subtext,
  color = 'red',
  size = 'md',
  delayMs = 0,
  className = '',
  variant = 'badge',
  onSlam,
}) => {
  const [visible, setVisible] = useState(delayMs === 0);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    let showTimer: any;
    let shakeTimer: any;

    if (delayMs > 0) {
      showTimer = setTimeout(() => {
        setVisible(true);
        setShaking(true);
        onSlam?.();
        shakeTimer = setTimeout(() => setShaking(false), 250);
      }, delayMs);
    } else {
      setShaking(true);
      onSlam?.();
      shakeTimer = setTimeout(() => setShaking(false), 250);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(shakeTimer);
    };
  }, [delayMs, onSlam]);

  if (!visible) return null;

  const colorStyles = {
    red: {
      border: 'border-red text-red bg-paper/95',
      inner: 'border-red/40',
    },
    teal: {
      border: 'border-teal text-teal bg-paper/95',
      inner: 'border-teal/40',
    },
    ink: {
      border: 'border-ink text-ink bg-paper/95',
      inner: 'border-ink/40',
    },
  }[color];

  const sizeStyles = {
    sm: {
      badge: 'px-2 py-0.5 text-[10px] border-2',
      circle: 'w-12 h-12 text-[9px] border-2',
      rect: 'px-2 py-1 text-[10px] border-2',
    },
    md: {
      badge: 'px-3 py-1 text-xs border-[2.5px]',
      circle: 'w-20 h-20 text-xs border-[3px]',
      rect: 'px-3.5 py-1.5 text-xs border-[2.5px]',
    },
    lg: {
      badge: 'px-4 py-1.5 text-sm border-[3px]',
      circle: 'w-24 h-24 text-sm border-[3.5px]',
      rect: 'px-5 py-2 text-sm border-[3px]',
    },
  }[size];

  if (variant === 'circle') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center rounded-full font-black uppercase tracking-widest text-center select-none shadow-brutal-sm animate-stamp-slam ${shaking ? 'animate-stamp-shake' : ''} ${colorStyles.border} ${sizeStyles.circle} ${className}`}
        style={{ transformOrigin: 'center center' }}
      >
        <span className="leading-tight">{text}</span>
        {subtext && <span className="text-[8px] font-bold opacity-80 mt-0.5">{subtext}</span>}
      </div>
    );
  }

  if (variant === 'rect') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center font-mono font-black uppercase tracking-wider text-center select-none rounded shadow-brutal-sm animate-stamp-slam ${shaking ? 'animate-stamp-shake' : ''} ${colorStyles.border} ${sizeStyles.rect} ${className}`}
        style={{ transformOrigin: 'center center' }}
      >
        <span className="leading-tight">{text}</span>
        {subtext && <span className="text-[9px] font-bold opacity-80 mt-0.5">{subtext}</span>}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-wider select-none shadow-brutal-sm animate-stamp-slam ${shaking ? 'animate-stamp-shake' : ''} ${colorStyles.border} ${sizeStyles.badge} ${className}`}
      style={{ transformOrigin: 'center center' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{text}</span>
      {subtext && <span className="text-[9px] font-normal opacity-85">({subtext})</span>}
    </div>
  );
};
