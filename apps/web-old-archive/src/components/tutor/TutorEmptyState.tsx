'use client';

import React from 'react';
import { Bot, RefreshCcw } from 'lucide-react';
import { Button } from '@linguaflow/ui';

interface TutorEmptyStateProps {
  onRetry?: () => void;
  locale?: string;
  className?: string;
}

export default function TutorEmptyState({
  onRetry,
  locale = 'vi',
  className = '',
}: TutorEmptyStateProps) {
  const isVi = locale === 'vi';

  return (
    <div
      className={`p-8 rounded-3xl bg-slate-900/90 border border-slate-850 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center">
        <Bot className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="font-display font-extrabold text-base text-white">
          {isVi ? 'Bắt Đầu Trò Chuyện Với AI Tutor' : 'Start Your First Tutor Session'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {isVi
            ? 'Hãy chọn một câu hỏi nhanh bên dưới hoặc nhập thắc mắc của bạn để nhận giải thích chi tiết.'
            : 'Select a quick prompt below or type any question to receive targeted pedagogical feedback.'}
        </p>
      </div>

      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} icon={<RefreshCcw className="w-3.5 h-3.5" />}>
          {isVi ? 'Tải lại' : 'Reload'}
        </Button>
      )}
    </div>
  );
}
