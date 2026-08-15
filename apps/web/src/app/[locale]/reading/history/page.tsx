'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { readingApi } from '@/lib/api';
import ReadingHistory from '@/components/reading/ReadingHistory';
import { ReadingAttempt } from '@linguaflow/domain';

const DEFAULT_HISTORY: ReadingAttempt[] = [
  {
    id: 'att-r-1',
    userId: 'demo-user-id-001',
    articleId: 'a1-morning-coffee',
    mode: 'standard',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86340000).toISOString(),
    elapsedSeconds: 60,
    answers: [
      { questionId: 'q1-1', selectedOption: 'Different morning habits worldwide', isCorrect: true },
      { questionId: 'q1-2', selectedOption: 'False', isCorrect: true },
    ],
    score: 96,
    wpm: 165,
    xpAwarded: 35,
    vocabularyLearned: ['vocab-coffee', 'vocab-morning'],
    accuracy: 100,
  },
  {
    id: 'att-r-2',
    userId: 'demo-user-id-001',
    articleId: 'b1-remote-work',
    mode: 'challenge',
    startedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 172680000).toISOString(),
    elapsedSeconds: 120,
    answers: [
      { questionId: 'q7-1', selectedOption: 'The advantages and challenges of modern remote work', isCorrect: true },
      { questionId: 'q7-2', selectedOption: 'They are at risk of experiencing burnout', isCorrect: true },
    ],
    score: 90,
    wpm: 155,
    xpAwarded: 50,
    vocabularyLearned: ['vocab-productivity', 'vocab-collaboration'],
    accuracy: 100,
  },
];

export default function ReadingHistoryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const [history, setHistory] = useState<ReadingAttempt[]>(DEFAULT_HISTORY);

  useEffect(() => {
    readingApi
      .getHistory()
      .then((res) => {
        if (res?.history && res.history.length > 0) {
          setHistory(res.history);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/reading`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Reading Lab</span>
      </Link>

      <ReadingHistory history={history} locale={locale} />
    </main>
  );
}
