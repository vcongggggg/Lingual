'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { TiltCard } from '@/components/common/TiltCard';

interface WritingLabCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badgeText: string;
  badgeVariant?: 'teal' | 'amber' | 'coral' | 'emerald' | 'slate';
  glowColor?: 'none' | 'teal' | 'amber' | 'coral';
  bannerImage?: string;
  mascotSticker?: string;
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
  bannerImage = '/images/dashboard/unit_study_desk.jpg',
  mascotSticker = '/mascot/raw/mascot_sticker_clean_14.png',
  className = '',
}: WritingLabCardProps) {
  const glowMap = {
    none: 'rgba(34, 211, 238, 0.1)',
    teal: 'rgba(20, 184, 166, 0.22)',
    amber: 'rgba(245, 158, 11, 0.22)',
    coral: 'rgba(244, 63, 94, 0.22)',
  };

  const badgeStyles = {
    teal: 'bg-teal-500/20 border-teal-400/40 text-teal-300',
    amber: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
    coral: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
    emerald: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
    slate: 'bg-slate-800 border-slate-700 text-slate-300',
  };

  return (
    <Link href={href} className="block group h-full">
      <TiltCard
        maxTilt={7}
        spotlightColor={glowMap[glowColor] || glowMap.teal}
        className="h-full"
      >
        <div className={`flex flex-col justify-between h-full rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-400/50 hover:bg-slate-900 transition-all duration-300 shadow-2xl overflow-hidden group ${className}`}>
          {/* Top 16:9 Visual Banner with Mascot Accent */}
          <div className="relative h-44 w-full overflow-hidden bg-slate-950">
            <Image
              src={bannerImage}
              alt={title}
              fill
              className="object-cover object-center brightness-105 contrast-105 group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
            />
            {/* Smooth Vignette Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-transparent" />

            {/* Top Row: Icon Container & Badge */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
              <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-white/10 shadow-lg backdrop-blur-md group-hover:scale-105 transition-transform">
                {icon}
              </div>

              <span className={`px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider backdrop-blur-md border shadow-md ${badgeStyles[badgeVariant] || badgeStyles.teal}`}>
                {badgeText}
              </span>
            </div>

            {/* Floating Cute Cow Sticker Accent */}
            <div className="absolute -bottom-1 right-3 z-10 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 filter drop-shadow-xl">
              <Image
                src={mascotSticker}
                alt="LingLing Writing"
                width={68}
                height={68}
                className="object-contain"
              />
            </div>
          </div>

          {/* Card Body Info */}
          <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg text-white group-hover:text-teal-300 transition-colors">
                  {title}
                </h3>
              </div>
              <p className="text-xs font-semibold text-amber-300/90">{subtitle}</p>
              <p className="text-xs text-slate-300/90 leading-relaxed pt-1 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Card CTA Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
              <span>Bắt đầu luyện viết</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}

