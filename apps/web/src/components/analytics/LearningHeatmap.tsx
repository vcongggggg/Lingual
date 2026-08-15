'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Flame, Sparkles } from 'lucide-react';
import { LearningHeatmapEntry } from '@linguaflow/domain';
import { analyticsApi } from '@/lib/analytics/analyticsApi';

interface LearningHeatmapProps {
  locale?: string;
  className?: string;
}

export default function LearningHeatmap({
  locale = 'vi',
  className = '',
}: LearningHeatmapProps) {
  const isVi = locale === 'vi';
  const [heatmap, setHeatmap] = useState<LearningHeatmapEntry[]>([]);
  const [hovered, setHovered] = useState<LearningHeatmapEntry | null>(null);

  useEffect(() => {
    analyticsApi
      .getHeatmap()
      .then((res: any) => {
        if (res?.heatmap) setHeatmap(res.heatmap);
      })
      .catch(() => {});
  }, []);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-teal-400 hover:ring-2 hover:ring-teal-300';
      case 3:
        return 'bg-teal-600 hover:ring-2 hover:ring-teal-400';
      case 2:
        return 'bg-teal-800/80 hover:ring-2 hover:ring-teal-500';
      case 1:
        return 'bg-teal-950 border border-teal-800/40 hover:ring-2 hover:ring-teal-600';
      case 0:
      default:
        return 'bg-slate-950/80 border border-slate-850 hover:border-slate-700';
    }
  };

  // Group 365 days into 52/53 columns of 7 days
  const columns: LearningHeatmapEntry[][] = [];
  let currentCol: LearningHeatmapEntry[] = [];

  heatmap.forEach((entry, i) => {
    currentCol.push(entry);
    if (currentCol.length === 7 || i === heatmap.length - 1) {
      columns.push(currentCol);
      currentCol = [];
    }
  });

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Nhật Ký Học Tập 365 Ngày' : '365-Day Activity Heatmap'}
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>{isVi ? 'Ít' : 'Less'}</span>
          <div className="w-3 h-3 rounded bg-slate-950 border border-slate-850" />
          <div className="w-3 h-3 rounded bg-teal-950 border border-teal-800/40" />
          <div className="w-3 h-3 rounded bg-teal-800" />
          <div className="w-3 h-3 rounded bg-teal-600" />
          <div className="w-3 h-3 rounded bg-teal-400" />
          <span>{isVi ? 'Nhiều' : 'More'}</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1.5 min-w-[700px]">
          {columns.map((col, cIndex) => (
            <div key={cIndex} className="flex flex-col gap-1.5">
              {col.map((entry) => (
                <button
                  key={entry.date}
                  type="button"
                  onMouseEnter={() => setHovered(entry)}
                  onClick={() => setHovered(entry)}
                  aria-label={`${entry.date}: ${entry.minutes} phút`}
                  className={`w-3.5 h-3.5 rounded-sm transition-all cursor-pointer ${getIntensityColor(
                    entry.intensity
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Info Tooltip Banner */}
      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between text-xs">
        {hovered ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-white font-mono">{hovered.date}</span>
            <span>•</span>
            <span className="text-teal-300 font-mono font-bold">{hovered.minutes} {isVi ? 'phút học' : 'mins study'}</span>
            <span>•</span>
            <span className="text-amber-400 font-mono font-bold">+{hovered.xp} XP</span>
            <span>•</span>
            <span className="text-slate-400">{hovered.activityCount} {isVi ? 'hoạt động' : 'activities'}</span>
          </div>
        ) : (
          <span className="text-slate-400">
            {isVi ? 'Rê chuột vào từng ô để xem chi tiết buổi học trong năm.' : 'Hover over any square to inspect daily learning records.'}
          </span>
        )}
      </div>
    </div>
  );
}
