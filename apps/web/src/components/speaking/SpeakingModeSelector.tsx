'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mic,
  Repeat,
  Headphones,
  Compass,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { TiltCard } from '@/components/common/TiltCard';

interface SpeakingModeSelectorProps {
  locale?: string;
  className?: string;
}

export default function SpeakingModeSelector({
  locale = 'vi',
  className = '',
}: SpeakingModeSelectorProps) {
  const isVi = locale === 'vi';

  const modes = [
    {
      id: 'pronunciation',
      title: isVi ? 'Luyện Phát Âm Âm Vị' : 'Pronunciation Practice',
      description: isVi
        ? 'Luyện phát âm từ vựng, cặp âm tối thiểu (minimal pairs) và cụm phụ âm chuẩn xác.'
        : 'Master minimal pairs, vowel length, and consonant clusters with audio references.',
      icon: <Mic className="w-5 h-5 text-teal-400" />,
      mascot: '/mascot/raw/mascot_sticker_clean_05.png',
      href: `/${locale}/speaking/pronunciation`,
      badge: 'A1 - B1',
      badgeClass: 'bg-teal-500/20 border-teal-400/40 text-teal-300',
      borderHover: 'hover:border-teal-400/70',
      glowColor: 'rgba(20, 184, 166, 0.25)',
      cardBg: 'from-slate-900/95 to-teal-950/30',
    },
    {
      id: 'repetition',
      title: isVi ? 'Lặp Lại Câu (Repetition)' : 'Sentence Repetition',
      description: isVi
        ? 'Nghe câu mẫu từ người bản xứ và lặp lại chính xác ngữ điệu, trọng âm và liên từ.'
        : 'Listen to native audio samples and repeat with natural pitch, stress, and linking.',
      icon: <Repeat className="w-5 h-5 text-indigo-400" />,
      mascot: '/mascot/raw/mascot_sticker_clean_02.png',
      href: `/${locale}/speaking/repetition`,
      badge: 'A1 - B2',
      badgeClass: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300',
      borderHover: 'hover:border-indigo-400/70',
      glowColor: 'rgba(99, 102, 241, 0.25)',
      cardBg: 'from-slate-900/95 to-indigo-950/30',
    },
    {
      id: 'shadowing',
      title: isVi ? 'Nói Đuổi (Shadowing Nâng Cao)' : 'Advanced Shadowing',
      description: isVi
        ? 'Nói đồng thời theo tốc độ bản ngữ để rèn luyện phản xạ phát âm và nhịp thở.'
        : 'Speak concurrently alongside native audio to build instinctive rhythm and cadence.',
      icon: <Headphones className="w-5 h-5 text-purple-400" />,
      mascot: '/mascot/raw/mascot_sticker_clean_09.png',
      href: `/${locale}/speaking/shadowing`,
      badge: 'A2 - C1',
      badgeClass: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
      borderHover: 'hover:border-purple-400/70',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      cardBg: 'from-slate-900/95 to-purple-950/30',
    },
    {
      id: 'guided',
      title: isVi ? 'Hỏi Đáp Định Hướng (Guided)' : 'Guided Speaking',
      description: isVi
        ? 'Trả lời chuỗi câu hỏi có gợi ý cấu trúc để tạo thành bài nói mạch lạc hoàn chỉnh.'
        : 'Answer step-by-step scaffolding prompts to construct cohesive, well-rounded responses.',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      mascot: '/mascot/cow_greet_heart.png',
      href: `/${locale}/speaking/guided`,
      badge: 'A2 - B2',
      badgeClass: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
      borderHover: 'hover:border-emerald-400/70',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      cardBg: 'from-slate-900/95 to-emerald-950/30',
    },
    {
      id: 'picture',
      title: isVi ? 'Miêu Tả Tranh (Picture)' : 'Picture Description',
      description: isVi
        ? 'Quan sát tranh minh họa sinh động và miêu tả hành động, bối cảnh, con người.'
        : 'Observe detailed illustrations and articulate scene descriptions, actions, and atmosphere.',
      icon: <ImageIcon className="w-5 h-5 text-amber-400" />,
      mascot: '/mascot/raw/mascot_sticker_clean_12.png',
      href: `/${locale}/speaking/picture`,
      badge: 'B1 - B2',
      badgeClass: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
      borderHover: 'hover:border-amber-400/70',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      cardBg: 'from-slate-900/95 to-amber-950/30',
    },
    {
      id: 'situation',
      title: isVi ? 'Tình Huống Thực Tế (Roleplay)' : 'Situational Roleplay',
      description: isVi
        ? 'Nhập vai xử lý tình huống du lịch, công sở, phỏng vấn xin việc và đời sống.'
        : 'Roleplay real-life scenarios: hotel check-in, job interviews, customer service, and meetings.',
      icon: <MessageSquare className="w-5 h-5 text-rose-400" />,
      mascot: '/mascot/cow_salute.png',
      href: `/${locale}/speaking/situation`,
      badge: 'B1 - C1',
      badgeClass: 'bg-rose-500/20 border-rose-400/40 text-rose-300',
      borderHover: 'hover:border-rose-400/70',
      glowColor: 'rgba(244, 63, 94, 0.25)',
      cardBg: 'from-slate-900/95 to-rose-950/30',
    },
    {
      id: 'free',
      title: isVi ? 'Nói Tự Do Theo Chủ Đề' : 'Free Speaking',
      description: isVi
        ? 'Trình bày quan điểm cá nhân có tính giờ (30s, 60s, 90s, 120s) về các chủ đề học thuật.'
        : 'Deliver timed presentations on academic, social, and technological topics.',
      icon: <Sparkles className="w-5 h-5 text-amber-300" />,
      mascot: '/mascot/cow_wink_kiss.png',
      href: `/${locale}/speaking/free`,
      badge: 'B2 - C1',
      badgeClass: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
      borderHover: 'hover:border-yellow-400/70',
      glowColor: 'rgba(234, 179, 8, 0.25)',
      cardBg: 'from-slate-900/95 to-yellow-950/30',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-teal-400" />
          <span>{isVi ? '7 Chế Độ Luyện Nói Chuyên Sâu' : '7 Speaking Practice Modes'}</span>
        </h3>
        <span className="text-xs text-slate-400">
          {isVi ? 'Chọn chế độ phù hợp với mục tiêu hôm nay' : 'Select a mode to begin practice'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modes.map((m) => (
          <TiltCard
            key={m.id}
            maxTilt={8}
            spotlightColor={m.glowColor}
            className="h-full"
          >
            <Link
              href={m.href}
              className={`p-6 rounded-3xl bg-gradient-to-br ${m.cardBg} border border-slate-800/90 ${m.borderHover} backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group h-full relative overflow-hidden`}
            >
              {/* Floating Mascot Accent in Bottom-Right Corner */}
              <div className="absolute -bottom-1 -right-1 opacity-25 group-hover:opacity-85 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none filter drop-shadow-xl z-0">
                <Image
                  src={m.mascot}
                  alt={m.title}
                  width={68}
                  height={68}
                  className="object-contain"
                />
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    {m.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-md border shadow-sm ${m.badgeClass}`}>
                    {m.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-base text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-300/90 font-sans leading-relaxed line-clamp-2">
                    {m.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-400 font-bold relative z-10">
                <span>{isVi ? 'Bắt đầu luyện' : 'Start Mode'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}

