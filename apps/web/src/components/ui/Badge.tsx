'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'paper' | 'red' | 'amber' | 'teal' | 'ink';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'paper',
  size = 'md',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border',
    md: 'px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border-2',
  }[size];

  const variantClasses = {
    paper: 'bg-paper-2 text-ink border-ink',
    red: 'bg-red/10 text-red border-red',
    amber: 'bg-amber/20 text-ink border-ink',
    teal: 'bg-teal/10 text-teal border-teal',
    ink: 'bg-ink text-paper border-ink',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
