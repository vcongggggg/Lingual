'use client';

import React from 'react';
import { Bot } from 'lucide-react';

export default function TutorTypingIndicator({ locale = 'vi' }: { locale?: string }) {
  const isVi = locale === 'vi';

  return (
    <div className="flex items-start gap-3.5 animate-in fade-in duration-200">
      <div className="w-9 h-9 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4" />
      </div>

      <div className="p-4 rounded-3xl rounded-tl-none bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <span>{isVi ? 'LingLing đang phân tích dữ liệu học tập...' : 'LingLing is analyzing your profile...'}</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
