'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PenTool } from 'lucide-react';
import WritingResult from '@/components/writing/WritingResult';

export default function WritingResultDirectPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  // Fallback demo result if navigated directly without an active attempt in memory
  const demoResult = {
    promptId: 'see-write-a1-morning',
    mode: 'see-write' as const,
    content: 'Every morning I wake up early, drink hot coffee and eat delicious breakfast.',
    wordCount: 13,
    score: 92,
    xpAwarded: 25,
    feedback: {
      overallScore: 92,
      grammarScore: 94,
      vocabularyScore: 88,
      naturalnessScore: 92,
      relevanceScore: 95,
      completenessScore: 100,
      grade: 'Excellent' as const,
      corrections: [],
      strengths: [
        'Cấu trúc câu rõ ràng, ngữ pháp chuẩn mực.',
        'Sử dụng vốn từ vựng phong phú, ít lặp từ.',
      ],
      suggestions: ['Bài viết rất tốt! Tiếp tục phát huy.'],
      vocabularySuggestions: [
        {
          word: 'beneficial',
          meaning: 'Có lợi, mang lại giá trị',
          reason: 'Nâng cao tính học thuật thay cho từ thông dụng "good".',
          difficulty: 'B1' as const,
          vocabularyId: 'vocab-beneficial',
        },
      ],
    },
    corrections: [],
    vocabularySuggestions: [
      {
        word: 'beneficial',
        meaning: 'Có lợi, mang lại giá trị',
        reason: 'Nâng cao tính học thuật thay cho từ thông dụng "good".',
        difficulty: 'B1' as const,
        vocabularyId: 'vocab-beneficial',
      },
    ],
  };

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pointer-events-auto">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/writing`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về Writing Lab</span>
        </Link>
      </div>

      <WritingResult result={demoResult} locale={locale} />
    </main>
  );
}
