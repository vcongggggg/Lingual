'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MASTER_READING_ARTICLES } from '@/lib/reading/sampleData';
import { evaluateReadingAttempt } from '@linguaflow/domain';
import ReadingResult from '@/components/reading/ReadingResult';

export default function ReadingResultStandalonePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const articleId = params?.articleId as string;

  const article = MASTER_READING_ARTICLES.find((a) => a.id === articleId) || MASTER_READING_ARTICLES[0];

  // Default demonstration feedback if accessed directly
  const feedback = evaluateReadingAttempt(
    article,
    article.questions.map((q) => ({ questionId: q.id, selectedOption: q.correctAnswer })),
    article.estimatedMinutes * 60,
    'standard'
  );

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <ReadingResult
        article={article}
        feedback={feedback}
        locale={locale}
      />
    </main>
  );
}
