'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SpeakingResult from '@/components/speaking/SpeakingResult';
import { SpeakingResult as ISpeakingResult } from '@linguaflow/domain';

export default function SpeakingResultPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const defaultResult: ISpeakingResult = {
    submissionId: 'demo-result-1',
    feedback: {
      pronunciationScore: 88,
      fluencyScore: 84,
      grammarScore: 90,
      vocabularyScore: 85,
      coherenceScore: 80,
      overallScore: 86,
      grade: 'Very Good',
      corrections: [],
      pronunciationIssues: [],
      vocabularySuggestions: [
        {
          word: 'beneficial',
          level: 'B2',
          meaning: 'Có lợi, mang lại kết quả tốt',
          reason: 'Nâng cấp từ "good" để tăng tính học thuật khi nói.',
          example: 'Regular exercise is highly beneficial for health.',
        },
      ],
      advice: 'Phản xạ nói rất tốt! Hãy tiếp tục duy trì nhịp điệu tự nhiên.',
    },
    xpAwarded: 28,
    streakUpdated: true,
    srsSuggestions: ['beneficial'],
    duration: 35,
    wordCount: 52,
  };

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/speaking`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Phòng Luyện Nói' : 'Back to Speaking Lab'}</span>
      </Link>

      <SpeakingResult
        result={defaultResult}
        onRetry={() => {
          if (typeof window !== 'undefined') window.history.back();
        }}
        locale={locale}
      />
    </main>
  );
}
