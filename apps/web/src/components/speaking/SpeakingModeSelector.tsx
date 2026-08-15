'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mic,
  Repeat,
  Headphones,
  Compass,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@linguaflow/ui';

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
      href: `/${locale}/speaking/pronunciation`,
      badge: 'A1 - B1',
      color: 'border-teal-500/30 hover:border-teal-400',
    },
    {
      id: 'repetition',
      title: isVi ? 'Lặp Lại Câu (Sentence Repetition)' : 'Sentence Repetition',
      description: isVi
        ? 'Nghe câu mẫu từ người bản xứ và lặp lại chính xác ngữ điệu, trọng âm và liên từ.'
        : 'Listen to native audio samples and repeat with natural pitch, stress, and linking.',
      icon: <Repeat className="w-5 h-5 text-indigo-400" />,
      href: `/${locale}/speaking/repetition`,
      badge: 'A1 - B2',
      color: 'border-indigo-500/30 hover:border-indigo-400',
    },
    {
      id: 'shadowing',
      title: isVi ? 'Nói Đuổi (Shadowing Nâng Cao)' : 'Advanced Shadowing',
      description: isVi
        ? 'Nói đồng thời theo tốc độ bản ngữ để rèn luyện phản xạ phát âm và nhịp thở.'
        : 'Speak concurrently alongside native audio to build instinctive rhythm and cadence.',
      icon: <Headphones className="w-5 h-5 text-purple-400" />,
      href: `/${locale}/speaking/shadowing`,
      badge: 'A2 - C1',
      color: 'border-purple-500/30 hover:border-purple-400',
    },
    {
      id: 'guided',
      title: isVi ? 'Hỏi Đáp Định Hướng (Guided Speaking)' : 'Guided Speaking',
      description: isVi
        ? 'Trả lời chuỗi câu hỏi có gợi ý cấu trúc để tạo thành bài nói mạch lạc hoàn chỉnh.'
        : 'Answer step-by-step scaffolding prompts to construct cohesive, well-rounded responses.',
      icon: <Compass className="w-5 h-5 text-teal-300" />,
      href: `/${locale}/speaking/guided`,
      badge: 'A2 - B2',
      color: 'border-teal-500/30 hover:border-teal-400',
    },
    {
      id: 'picture',
      title: isVi ? 'Miêu Tả Tranh (Picture Speaking)' : 'Picture Description',
      description: isVi
        ? 'Quan sát tranh minh họa sinh động và miêu tả hành động, bối cảnh, con người.'
        : 'Observe detailed illustrations and articulate scene descriptions, actions, and atmosphere.',
      icon: <ImageIcon className="w-5 h-5 text-amber-400" />,
      href: `/${locale}/speaking/picture`,
      badge: 'B1 - B2',
      color: 'border-amber-500/30 hover:border-amber-400',
    },
    {
      id: 'situation',
      title: isVi ? 'Tình Huống Thực Tế (Situation Roleplay)' : 'Situational Roleplay',
      description: isVi
        ? 'Nhập vai xử lý tình huống du lịch, công sở, phỏng vấn xin việc và đời sống.'
        : 'Roleplay real-life scenarios: hotel check-in, job interviews, customer service, and meetings.',
      icon: <MessageSquare className="w-5 h-5 text-coral" />,
      href: `/${locale}/speaking/situation`,
      badge: 'B1 - C1',
      color: 'border-rose-500/30 hover:border-rose-400',
    },
    {
      id: 'free',
      title: isVi ? 'Nói Tự Do Theo Chủ Đề (Free Speaking)' : 'Free Speaking',
      description: isVi
        ? 'Trình bày quan điểm cá nhân có tính giờ (30s, 60s, 90s, 120s) về các chủ đề học thuật.'
        : 'Deliver timed presentations on academic, social, and technological topics.',
      icon: <Sparkles className="w-5 h-5 text-amber-300" />,
      href: `/${locale}/speaking/free`,
      badge: 'B2 - C1',
      color: 'border-amber-500/30 hover:border-amber-400',
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modes.map((m) => (
          <Link
            key={m.id}
            href={m.href}
            className={`p-6 rounded-3xl bg-slate-900/90 border ${m.color} backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shrink-0">
                  {m.icon}
                </div>
                <Badge variant="teal" className="text-[10px] font-mono font-bold">
                  {m.badge}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-base text-white group-hover:text-teal-300 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-400 font-bold">
              <span>{isVi ? 'Bắt đầu luyện' : 'Start Mode'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
