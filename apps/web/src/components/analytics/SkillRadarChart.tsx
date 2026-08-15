'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { SkillPerformance } from '@linguaflow/domain';
import { formatSkillName } from '@/lib/analytics/analyticsFormatters';

interface SkillRadarChartProps {
  skills: SkillPerformance[];
  locale?: string;
  className?: string;
}

export default function SkillRadarChart({
  skills,
  locale = 'vi',
  className = '',
}: SkillRadarChartProps) {
  const isVi = locale === 'vi';

  // Fixed 6-axis skills layout
  const orderedSkills: ('listening' | 'speaking' | 'vocabulary' | 'writing' | 'reading' | 'exam')[] = [
    'listening',
    'speaking',
    'vocabulary',
    'writing',
    'reading',
    'exam',
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const angleStep = (Math.PI * 2) / orderedSkills.length;

  // Calculate polygon points based on normalized scores
  const points = orderedSkills.map((sKey, index) => {
    const matched = skills.find((s) => s.skill === sKey);
    const score = matched ? matched.score : 60;
    const currentRadius = (radius * Math.min(100, Math.max(10, score))) / 100;
    const angle = index * angleStep - Math.PI / 2;
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    return { x, y, score, skill: sKey, angle };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            {isVi ? 'Biểu Đồ Radar Năng Lực' : 'Skill Radar Distribution'}
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">6 Kỹ năng cốt lõi</span>
      </div>

      <div className="relative w-full flex items-center justify-center py-2">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] h-auto overflow-visible">
          {/* Radar Background Webs (25%, 50%, 75%, 100%) */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => {
            const webPoints = orderedSkills
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = center + radius * level * Math.cos(angle);
                const y = center + radius * level * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={level}
                points={webPoints}
                fill="none"
                stroke="rgba(148, 163, 184, 0.15)"
                strokeWidth="1"
                strokeDasharray={level === 1 ? 'none' : '2,2'}
              />
            );
          })}

          {/* Radial Spokes */}
          {orderedSkills.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={polygonPath}
            fill="rgba(168, 85, 247, 0.25)"
            stroke="#a855f7"
            strokeWidth="2.5"
            className="transition-all duration-700"
          />

          {/* Data Points and Outer Labels */}
          {points.map((p, i) => {
            const labelRadius = radius + 26;
            const lx = center + labelRadius * Math.cos(p.angle);
            const ly = center + labelRadius * Math.sin(p.angle);
            const name = formatSkillName(p.skill, locale);

            return (
              <g key={p.skill}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#2dd4bf" stroke="#0f172a" strokeWidth="2" />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-display font-extrabold fill-slate-300 select-none"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        {isVi
          ? 'Độ cân bằng diện tích radar thể hiện mức độ phát triển đồng đều các kỹ năng.'
          : 'The polygon balance illustrates your comprehensive multi-skill proficiency.'}
      </p>
    </div>
  );
}
