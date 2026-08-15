'use client';

import React from 'react';
import { User, Bot, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TutorMessage as ITutorMessage } from '@linguaflow/domain';
import TutorActionCard from './TutorActionCard';
import TutorConfidenceBadge from './TutorConfidenceBadge';

interface TutorMessageProps {
  message: ITutorMessage;
  locale?: string;
  className?: string;
}

export default function TutorMessage({
  message,
  locale = 'vi',
  className = '',
}: TutorMessageProps) {
  const isVi = locale === 'vi';
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
          isUser
            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20'
            : 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-lg shadow-teal-500/20'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div className={`space-y-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm font-sans leading-relaxed shadow-xl ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
              : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none backdrop-blur-xl'
          }`}
        >
          {/* Message Text formatted with line breaks */}
          <div className="whitespace-pre-line space-y-2">
            {message.content}
          </div>

          {/* Grammar / Explanation Block if attached */}
          {message.explanation && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-2 text-xs font-sans">
              <span className="font-bold text-amber-300 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isVi ? 'Phân Tích Ngữ Pháp & Quy Tắc:' : 'Grammar Breakdown & Rules:'}</span>
              </span>

              {message.explanation.original && (
                <div className="flex items-center gap-2 text-rose-300">
                  <span className="line-through">{message.explanation.original}</span>
                  <span>→</span>
                  <span className="font-bold text-teal-300">{message.explanation.corrected}</span>
                </div>
              )}

              <p className="text-slate-200 leading-relaxed">
                <strong className="text-teal-300">{isVi ? 'Quy tắc:' : 'Rule:'}</strong> {message.explanation.rule}
              </p>

              {message.explanation.example && (
                <p className="text-slate-400 italic bg-slate-900/60 p-2 rounded-xl">
                  Example: "{message.explanation.example}"
                </p>
              )}
            </div>
          )}

          {/* Timestamp & Confidence footer for tutor */}
          {!isUser && (
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-400">
              <TutorConfidenceBadge confidence={85} locale={locale} />
              <span className="font-mono">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="space-y-2 w-full pt-1">
            {message.actions.map((act, i) => (
              <TutorActionCard key={i} action={act} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
