'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, History, Trophy, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { examsApi } from '@/lib/exams/api';
import { Badge, Button } from '@linguaflow/ui';

export default function ExamHistoryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const [history, setHistory] = useState<any[]>([
    {
      attemptId: 'att-demo-toeic-01',
      examId: 'exam-toeic-01',
      examTitle: 'TOEIC Official Format Mock Test 01',
      examType: 'toeic',
      difficulty: 'B1',
      score: 7,
      maxScore: 7,
      scaledScoreLabel: '990 / 990',
      accuracy: 100,
      grade: 'Excellent',
      elapsedSeconds: 1200,
      xpAwarded: 85,
      submittedAt: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    examsApi
      .getExamHistory()
      .then((res: any) => {
        if (res?.history && res.history.length > 0) {
          setHistory(res.history);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/exam-practice`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Exam Practice Lab</span>
      </Link>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-teal-400" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Lịch Sử Luyện Thi ({history.length})
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Xem lại các bài thi thử bạn đã hoàn thành và theo dõi tiến độ cải thiện điểm số
        </p>
      </div>

      <div className="space-y-3.5">
        {history.map((item) => (
          <div
            key={item.attemptId}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="teal" className="text-[10px] font-extrabold uppercase">
                  {item.examType} • {item.difficulty}
                </Badge>
                <span className="text-xs text-slate-400">
                  {new Date(item.submittedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <h4 className="font-display font-bold text-base text-white">
                {item.examTitle}
              </h4>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="text-teal-400 font-bold font-mono">
                  {item.scaledScoreLabel || `${item.score}/${item.maxScore}`}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Độ chính xác: {item.accuracy}%</span>
                <span>•</span>
                <span className="text-amber-400 font-mono font-bold">+{item.xpAwarded} XP</span>
              </div>
            </div>

            <Link href={`/${locale}/exam-practice/result/${item.attemptId}`}>
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Xem chi tiết
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
