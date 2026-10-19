'use client';

import React from 'react';
import { Award, CheckCircle2, Lightbulb, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { WritingFeedback as IWritingFeedback } from '@linguaflow/domain';
import { Badge, ProgressBar } from '@linguaflow/ui';

interface WritingFeedbackProps {
  feedback: IWritingFeedback;
  className?: string;
}

export default function WritingFeedback({ feedback, className = '' }: WritingFeedbackProps) {
  const gradeColors: Record<string, 'emerald' | 'teal' | 'amber' | 'coral'> = {
    Excellent: 'emerald',
    'Very Good': 'teal',
    Good: 'teal',
    'Needs Practice': 'amber',
    'Keep Practicing': 'coral',
  };

  const categories: Array<{ label: string; score: number; color: 'teal' | 'amber' | 'coral' }> = [
    { label: 'Ngữ pháp (30%)', score: feedback.grammarScore, color: 'teal' },
    { label: 'Từ vựng (25%)', score: feedback.vocabularyScore, color: 'amber' },
    { label: 'Tính tự nhiên (20%)', score: feedback.naturalnessScore, color: 'teal' },
    { label: 'Độ bám sát đề (15%)', score: feedback.relevanceScore, color: 'amber' },
    { label: 'Độ hoàn thiện (10%)', score: feedback.completenessScore, color: 'teal' },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6 ${className}`}>
      {/* Overall Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-500/15 via-slate-950 to-amber-500/10 border border-teal-500/30 shadow-inner">
        <div className="space-y-1">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
            Điểm tổng quan bài viết
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-display font-extrabold text-white">
              {feedback.overallScore}
            </span>
            <span className="text-sm font-bold text-slate-400">/ 100 Điểm</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={gradeColors[feedback.grade] || 'teal'}
            className="text-sm font-extrabold uppercase px-3.5 py-1.5 shadow-md tracking-wider"
          >
            {feedback.grade}
          </Badge>
        </div>
      </div>

      {/* 5-Criteria Metric Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">{cat.label}</span>
              <span className="font-mono text-teal-400">{cat.score}/100</span>
            </div>
            <ProgressBar value={cat.score} max={100} color={cat.color} />
          </div>
        ))}
      </div>

      {/* Strengths & Pedagogical Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Strengths */}
        {feedback.strengths?.length > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Điểm nổi bật</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {feedback.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {feedback.suggestions?.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Gợi ý cải thiện</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {feedback.suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
