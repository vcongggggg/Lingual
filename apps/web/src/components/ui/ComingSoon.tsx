'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { LingLing } from './LingLing';

import { MascotPose } from '../mascot';

interface ComingSoonProps {
  title: string;
  category?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  reaction?: MascotPose;
}

export function ComingSoon({
  title,
  category = 'Tính Năng Đang Phát Triển',
  description = 'Tính năng đang được đội ngũ biên soạn và hoàn thiện tỉ mỉ trên nền sổ tay giấy. Hãy quay lại sau nhé!',
  backHref = '/dashboard',
  backLabel = 'Quay lại Trang chủ',
  reaction = 'shyApologetic',
}: ComingSoonProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center space-y-8">
      {/* Breadcrumb */}
      {backHref && (
        <div className="flex items-center justify-start gap-2 text-xs font-bold text-ink-muted">
          <Link
            href={backHref}
            className="hover:text-red transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </Link>
          <span>/</span>
          <span className="text-ink">{title}</span>
        </div>
      )}

      {/* Card Giấy Thông Báo */}
      <div className="card-paper p-8 sm:p-12 bg-card border-2 border-ink rounded-3xl shadow-brutal-xl relative overflow-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-amber">
          <Clock className="w-3.5 h-3.5" />
          <span>{category}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight font-sans">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-ink-soft max-w-lg mx-auto leading-relaxed">
          {description}
        </p>

        {/* Mascot LingLing with speech bubble */}
        <div className="pt-4 flex flex-col items-center">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Tính năng đang được phát triển, quay lại sau nhé!
          </div>
          <LingLing reaction={reaction} size={120} />
        </div>

        <div className="pt-4">
          <Link
            href={backHref}
            className="btn btn-red text-xs font-black shadow-brutal inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>{backLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
