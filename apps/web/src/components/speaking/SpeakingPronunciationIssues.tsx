'use client';

import React from 'react';
import { SpeakingPronunciationIssue } from '@linguaflow/domain';
import { Volume2, AlertCircle } from 'lucide-react';
import { Badge } from '@linguaflow/ui';

interface SpeakingPronunciationIssuesProps {
  issues: SpeakingPronunciationIssue[];
  locale?: string;
  className?: string;
}

export default function SpeakingPronunciationIssues({
  issues,
  locale = 'vi',
  className = '',
}: SpeakingPronunciationIssuesProps) {
  const isVi = locale === 'vi';

  if (!issues || issues.length === 0) return null;

  const playWord = (word: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {isVi ? 'Từ vựng cần phát âm rõ ràng hơn:' : 'Words Needing Pronunciation Focus:'}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {issues.map((issue, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono">{issue.word}</span>
                <Badge variant="amber" className="text-[10px]">
                  {issue.category}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">{issue.suggestion}</p>
            </div>

            <button
              type="button"
              onClick={() => playWord(issue.word)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 hover:text-white transition-colors shrink-0"
              title="Nghe phát âm chuẩn"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
