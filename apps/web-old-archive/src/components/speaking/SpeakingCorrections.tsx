'use client';

import React from 'react';
import { SpeakingCorrection } from '@linguaflow/domain';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SpeakingCorrectionsProps {
  corrections: SpeakingCorrection[];
  locale?: string;
  className?: string;
}

export default function SpeakingCorrections({
  corrections,
  locale = 'vi',
  className = '',
}: SpeakingCorrectionsProps) {
  const isVi = locale === 'vi';

  if (!corrections || corrections.length === 0) {
    return (
      <div className={`p-4 rounded-2xl bg-slate-950/60 border border-slate-850 text-xs text-teal-400 flex items-center gap-2 ${className}`}>
        <CheckCircle2 className="w-4 h-4 text-teal-400" />
        <span>{isVi ? 'Không phát hiện lỗi ngữ pháp cơ bản trong bài nói!' : 'No major grammatical inaccuracies detected!'}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {isVi ? 'Góp ý ngữ pháp & cấu trúc câu:' : 'Grammar & Structure Corrections:'}
      </h4>

      <div className="space-y-2.5">
        {corrections.map((c, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="line-through">{c.original}</span>
              <span>→</span>
              <span className="font-bold text-teal-300">{c.corrected}</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-5 font-sans">
              {c.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
