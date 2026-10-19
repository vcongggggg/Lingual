'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MASTER_EXAMS } from '@/lib/exams/sampleData';
import { examsApi } from '@/lib/exams/api';
import { evaluateExamAttempt, ExamResult, createExamAttempt } from '@linguaflow/domain';
import ExamResultView from '@/components/exams/ExamResult';

export default function ExamResultPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const attemptId = params?.attemptId as string;

  const defaultExam = MASTER_EXAMS[0];
  const [result, setResult] = useState<ExamResult | null>(null);
  const [examTitle, setExamTitle] = useState(defaultExam.title);

  useEffect(() => {
    examsApi
      .getExamResult(attemptId)
      .then((res: any) => {
        if (res?.result) {
          setResult(res.result);
          if (res?.exam?.title) setExamTitle(res.exam.title);
        }
      })
      .catch(() => {
        // Fallback default sample result
        const sampleAttempt = createExamAttempt(defaultExam.id, 'demo-user', defaultExam.durationMinutes);
        sampleAttempt.answers = defaultExam.sections
          .flatMap((s) => s.questions)
          .map((q) => ({ questionId: q.id, selectedOption: q.correctAnswer }));
        const sampleRes = evaluateExamAttempt(defaultExam, sampleAttempt, 1200);
        setResult(sampleRes);
      });
  }, [attemptId]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <p>Đang tổng hợp kết quả bài thi...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <ExamResultView
        result={result}
        examTitle={examTitle}
        locale={locale}
      />
    </main>
  );
}
