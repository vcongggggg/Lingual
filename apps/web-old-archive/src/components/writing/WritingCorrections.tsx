'use client';

import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { WritingCorrection } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';

interface WritingCorrectionsProps {
  corrections: WritingCorrection[];
  className?: string;
}

export default function WritingCorrections({ corrections, className = '' }: WritingCorrectionsProps) {
  if (!corrections || corrections.length === 0) {
    return (
      <div className={`p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 ${className}`}>
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="font-display font-extrabold text-base text-white">Không phát hiện lỗi ngữ pháp hay chính tả nào!</h4>
        <p className="text-xs text-emerald-300/80">Bài viết của bạn rất chính xác và tự nhiên.</p>
      </div>
    );
  }

  const categoryBadges: Record<string, { label: string; variant: 'teal' | 'coral' | 'amber' | 'emerald' }> = {
    grammar: { label: 'Ngữ pháp', variant: 'coral' },
    spelling: { label: 'Chính tả', variant: 'amber' },
    punctuation: { label: 'Dấu câu', variant: 'teal' },
    vocabulary: { label: 'Từ vựng', variant: 'teal' },
    naturalness: { label: 'Tính tự nhiên', variant: 'emerald' },
  };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
          <XCircle className="w-4 h-4" />
          <span>Chi tiết sửa lỗi ngữ pháp & chính tả ({corrections.length})</span>
        </div>
      </div>

      <div className="space-y-3">
        {corrections.map((corr, idx) => {
          const cat = categoryBadges[corr.category] || { label: 'Ngữ pháp', variant: 'coral' };

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 hover:border-rose-500/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant={cat.variant} className="text-[10px] font-extrabold uppercase">
                  {cat.label}
                </Badge>
              </div>

              {/* Diff View */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm font-semibold">
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 line-through">
                  "{corr.original}"
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />

                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  "{corr.corrected}"
                </div>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                💡 <strong className="text-slate-300">Giải thích:</strong> {corr.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
