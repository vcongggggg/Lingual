'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Trophy, Sparkles } from 'lucide-react';
import { analyticsApi } from '@/lib/analytics/analyticsApi';

interface SkillTrendChartProps {
  locale?: string;
  className?: string;
}

export default function SkillTrendChart({
  locale = 'vi',
  className = '',
}: SkillTrendChartProps) {
  const isVi = locale === 'vi';
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [points, setPoints] = useState<{ date: string; minutes: number; xp: number; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyticsApi
      .getTrends(period)
      .then((res: any) => {
        if (res?.points) {
          setPoints(res.points);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const maxMinutes = Math.max(...points.map((p) => p.minutes), 50);
  const width = 500;
  const height = 160;

  // Build SVG path
  const svgPoints = points.map((p, index) => {
    const x = (index / (points.length - 1 || 1)) * (width - 40) + 20;
    const y = height - (p.minutes / maxMinutes) * (height - 40) - 20;
    return { x, y, ...p };
  });

  const pathD = svgPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = svgPoints.length > 0 ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height} L ${svgPoints[0].x} ${height} Z` : '';

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
              {isVi ? 'Xu Hướng Tiến Bộ Học Tập' : 'Learning Trends & Progress'}
            </h3>
            <span className="text-xs text-slate-400">
              {isVi ? 'Thời gian học tập tích lũy theo ngày' : 'Daily study minutes accumulation'}
            </span>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-850 self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                period === p
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === '7d' ? (isVi ? '7 ngày' : '7 Days') : p === '30d' ? (isVi ? '30 ngày' : '30 Days') : (isVi ? '90 ngày' : '90 Days')}
            </button>
          ))}
        </div>
      </div>

      {/* Line Chart Visual */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="20" x2={width - 20} y2="20" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3,3" />
          <line x1="20" y1={height / 2} x2={width - 20} y2={height / 2} stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3,3" />
          <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="rgba(148, 163, 184, 0.1)" />

          {/* Fill Area */}
          {areaD && <path d={areaD} fill="url(#trendGradient)" />}

          {/* Trend Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots */}
          {svgPoints.map((p, i) => (
            <circle
              key={p.date}
              cx={p.x}
              cy={p.y}
              r={period === '7d' ? 4.5 : 2.5}
              fill="#2dd4bf"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-850">
        <span>{svgPoints[0]?.date || ''}</span>
        <span className="font-mono text-teal-300 font-bold">
          {isVi ? 'Đỉnh điểm:' : 'Peak:'} {maxMinutes} {isVi ? 'phút/ngày' : 'mins/day'}
        </span>
        <span>{svgPoints[svgPoints.length - 1]?.date || ''}</span>
      </div>
    </div>
  );
}
