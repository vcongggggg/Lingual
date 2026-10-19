'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdaptiveLearningPlanItem } from '@linguaflow/domain';
import { Badge, Button } from '@linguaflow/ui';

interface TutorPlanPreviewProps {
  items: AdaptiveLearningPlanItem[];
  locale?: string;
  className?: string;
}

export default function TutorPlanPreview({
  items,
  locale = 'vi',
  className = '',
}: TutorPlanPreviewProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>{isVi ? 'Lộ Trình Hôm Nay' : "Today's Agenda"}</span>
        </h3>

        <Link href={`/${locale}/tutor/plan`} className="text-[11px] text-teal-400 hover:underline font-bold flex items-center gap-1">
          <span>{isVi ? 'Xem tất cả' : 'View full'}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {items.slice(0, 3).map((it) => (
          <div
            key={it.id}
            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-white line-clamp-1">{it.activity}</span>
              <Badge variant="teal" className="text-[9px] font-mono shrink-0">
                {it.estimatedMinutes}m
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">{it.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
