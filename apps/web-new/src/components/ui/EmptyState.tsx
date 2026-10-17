'use client';

import React from 'react';
import { LingLing } from './LingLing';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-card border-2 border-dashed border-ink/40 rounded-2xl shadow-brutal-sm ${className}`}>
      <LingLing reaction="cry" size={90} animate={true} className="mb-4" />
      <h4 className="text-lg font-black text-ink mb-1.5">{title}</h4>
      <p className="text-sm text-ink-soft max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && (
        <Button variant="red" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
