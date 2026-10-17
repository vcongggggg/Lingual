'use client';

import React from 'react';
import { Sparkles, Brain, PenTool, Mic, Trophy, HelpCircle } from 'lucide-react';
import { sfx } from '@/lib/soundEffects';

interface TutorQuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  locale?: string;
  className?: string;
}

export default function TutorQuickPrompts({
  onSelectPrompt,
  locale = 'vi',
  className = '',
}: TutorQuickPromptsProps) {
  const isVi = locale === 'vi';

  const prompts = isVi
    ? [
        { icon: <Brain className="w-3.5 h-3.5 text-purple-400" />, text: 'Hôm nay tôi nên học gì?' },
        { icon: <HelpCircle className="w-3.5 h-3.5 text-teal-400" />, text: 'Tại sao lại dùng "went" thay vì "go"?' },
        { icon: <Mic className="w-3.5 h-3.5 text-rose-400" />, text: 'Cho tôi một bài luyện nói ngắn' },
        { icon: <PenTool className="w-3.5 h-3.5 text-amber-400" />, text: 'Sửa lỗi ngữ pháp bài viết' },
        { icon: <Trophy className="w-3.5 h-3.5 text-indigo-400" />, text: 'Lập kế hoạch học tập 7 ngày' },
        { icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />, text: 'Kiểm tra từ vựng SRS cần ôn' },
      ]
    : [
        { icon: <Brain className="w-3.5 h-3.5 text-purple-400" />, text: 'What should I study today?' },
        { icon: <HelpCircle className="w-3.5 h-3.5 text-teal-400" />, text: 'Explain past simple with go/went' },
        { icon: <Mic className="w-3.5 h-3.5 text-rose-400" />, text: 'Give me a quick speaking drill' },
        { icon: <PenTool className="w-3.5 h-3.5 text-amber-400" />, text: 'Help improve my essay writing' },
        { icon: <Trophy className="w-3.5 h-3.5 text-indigo-400" />, text: 'Build a 7-day adaptive plan' },
        { icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />, text: 'Review due SRS flashcards' },
      ];

  const handleClick = (text: string) => {
    sfx.playClick();
    onSelectPrompt(text);
  };

  return (
    <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full ${className}`}>
      {prompts.map((p, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => handleClick(p.text)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] font-sans font-medium text-slate-300 hover:text-white hover:border-teal-500/40 hover:bg-slate-800/80 transition-all shadow-sm shrink-0 whitespace-nowrap"
        >
          {p.icon}
          <span>{p.text}</span>
        </button>
      ))}
    </div>
  );
}
