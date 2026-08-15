'use client';

import React, { useState } from 'react';
import { SpeakingPrompt } from '@linguaflow/domain';
import { Volume2, Eye, EyeOff, BookOpen, Tag, Compass, Sparkles } from 'lucide-react';
import { Badge, Button } from '@linguaflow/ui';

interface SpeakingPromptCardProps {
  prompt: SpeakingPrompt;
  locale?: string;
  className?: string;
}

export default function SpeakingPromptCard({
  prompt,
  locale = 'vi',
  className = '',
}: SpeakingPromptCardProps) {
  const isVi = locale === 'vi';
  const [showSample, setShowSample] = useState(false);

  const playSampleAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="teal" className="text-[10px] font-mono font-bold uppercase">
            {prompt.mode}
          </Badge>
          <Badge variant="amber" className="text-[10px] font-mono font-bold">
            {prompt.difficulty} • {prompt.cefr}
          </Badge>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Thời lượng: ~{prompt.durationSeconds}s
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-snug">
          {prompt.title}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {prompt.description}
        </p>
      </div>

      {/* Scenario / Image Prompt / Steps */}
      {prompt.scenario && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1 text-xs">
          <span className="font-bold text-amber-300 block">{isVi ? 'Bối cảnh tình huống:' : 'Scenario:'}</span>
          <p className="text-slate-200 leading-relaxed italic">{prompt.scenario}</p>
        </div>
      )}

      {prompt.imagePrompt && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1 text-xs">
          <span className="font-bold text-teal-300 block">{isVi ? 'Gợi ý quan sát hình ảnh:' : 'Visual Scene:'}</span>
          <p className="text-slate-200 leading-relaxed">{prompt.imagePrompt}</p>
        </div>
      )}

      {prompt.steps && prompt.steps.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2 text-xs">
          <span className="font-bold text-indigo-300 block">{isVi ? 'Các câu hỏi định hướng trả lời:' : 'Guiding Questions:'}</span>
          <ul className="space-y-1.5 pl-2">
            {prompt.steps.map((st, i) => (
              <li key={i} className="text-slate-300 flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                  {i + 1}
                </span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Target Vocabulary */}
      {prompt.targetWords && prompt.targetWords.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold text-slate-400 block">{isVi ? 'Từ vựng trọng tâm cần dùng:' : 'Target Vocabulary:'}</span>
          <div className="flex flex-wrap gap-2">
            {prompt.targetWords.map((word) => (
              <span
                key={word}
                className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-teal-300"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sample Answer Toggle */}
      {prompt.sampleAnswer && (
        <div className="pt-2 border-t border-slate-850 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSample(!showSample)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              {showSample ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSample ? (isVi ? 'Ẩn câu trả lời mẫu' : 'Hide Sample') : (isVi ? 'Xem câu trả lời mẫu' : 'View Sample Answer')}</span>
            </button>

            {showSample && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => playSampleAudio(prompt.sampleAnswer!)}
                icon={<Volume2 className="w-3.5 h-3.5 text-teal-400" />}
              >
                {isVi ? 'Nghe mẫu' : 'Listen'}
              </Button>
            )}
          </div>

          {showSample && (
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-xs text-slate-200 leading-relaxed font-sans">
              "{prompt.sampleAnswer}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
