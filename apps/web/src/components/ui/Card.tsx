'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'paper' | 'teal' | 'ink';
  hasTape?: boolean;
  tilt?: 'none' | 'left' | 'right';
  className?: string;
}

export function Card({
  children,
  variant = 'white',
  hasTape = false,
  tilt = 'none',
  className = '',
  ...props
}: CardProps) {
  const variantClasses = {
    white: 'bg-card text-ink',
    paper: 'bg-paper-2 text-ink',
    teal: 'bg-teal text-white',
    ink: 'bg-ink text-paper',
  }[variant];

  const tiltClasses = {
    none: '',
    left: '-rotate-1 hover:rotate-0 transition-transform duration-150',
    right: 'rotate-1 hover:rotate-0 transition-transform duration-150',
  }[tilt];

  return (
    <div
      className={`relative border-2 border-ink rounded-2xl shadow-brutal-lg p-6 ${variantClasses} ${tiltClasses} ${className}`}
      {...props}
    >
      {hasTape && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F2A93B]/70 border-l-2 border-r-2 border-dashed border-ink/40 -rotate-2 pointer-events-none z-10"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
