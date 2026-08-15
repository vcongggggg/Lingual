'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Headphones, PenTool, Mic, Trophy, Sparkles } from 'lucide-react';
import { TutorAction } from '@linguaflow/domain';
import { Button } from '@linguaflow/ui';

interface TutorActionCardProps {
  action: TutorAction;
  onExecute?: (action: TutorAction) => void;
  locale?: string;
  className?: string;
}

export default function TutorActionCard({
  action,
  onExecute,
  locale = 'vi',
  className = '',
}: TutorActionCardProps) {
  const getIcon = () => {
    switch (action.type) {
      case 'start_srs':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'open_vocabulary':
        return <BookOpen className="w-4 h-4 text-teal-400" />;
      case 'start_listening':
        return <Headphones className="w-4 h-4 text-cyan-400" />;
      case 'start_writing':
        return <PenTool className="w-4 h-4 text-amber-400" />;
      case 'start_speaking':
        return <Mic className="w-4 h-4 text-rose-400" />;
      case 'start_exam':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div
      className={`p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs transition-all hover:border-teal-500/40 ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-850 shrink-0">
          {getIcon()}
        </div>
        <span className="font-bold text-white truncate">{action.label}</span>
      </div>

      <Link href={action.route}>
        <Button
          variant={action.priority === 'critical' || action.priority === 'high' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onExecute && onExecute(action)}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {locale === 'vi' ? 'Luyện ngay' : 'Start'}
        </Button>
      </Link>
    </div>
  );
}
