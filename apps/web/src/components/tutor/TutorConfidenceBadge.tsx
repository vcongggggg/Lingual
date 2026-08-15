'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface TutorConfidenceBadgeProps {
  confidence: number;
  locale?: string;
  className?: string;
}

export default function TutorConfidenceBadge({
  confidence,
  locale = 'vi',
  className = '',
}: TutorConfidenceBadgeProps) {
  const isVi = locale === 'vi';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] font-mono font-bold text-teal-300 ${className}`}
      title={isVi ? `Độ tin cậy dựa trên dữ liệu học tập: ${confidence}%` : `Confidence score based on learning data: ${confidence}%`}
    >
      <ShieldCheck className="w-3 h-3 text-teal-400" />
      <span>{confidence}% {isVi ? 'độ tin cậy' : 'confidence'}</span>
    </span>
  );
}
