'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, Badge } from '@linguaflow/ui';

interface WritingLabCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badgeText: string;
  badgeVariant?: 'teal' | 'amber' | 'coral' | 'emerald' | 'slate';
  glowColor?: 'none' | 'teal' | 'amber' | 'coral';
  className?: string;
}

export default function WritingLabCard({
  title,
  subtitle,
  description,
  icon,
  href,
  badgeText,
  badgeVariant = 'teal',
  glowColor = 'teal',
  className = '',
}: WritingLabCardProps) {
  return (
    <Link href={href} className="block group h-full">
      <Card
        glow={glowColor}
        className={`flex flex-col justify-between h-full p-6 sm:p-7 space-y-6 hover:border-teal-400/40 transition-all ${className}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 group-hover:scale-105 transition-transform">
              {icon}
            </div>

            <Badge variant={badgeVariant} className="font-extrabold uppercase text-[10px] tracking-wider">
              {badgeText}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-teal-300 transition-colors">
              {title}
            </h3>
            <p className="text-xs font-semibold text-amber-300/90">{subtitle}</p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
          <span>Bắt đầu luyện viết</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}
