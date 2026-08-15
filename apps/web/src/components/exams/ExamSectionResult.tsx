'use client';

import React from 'react';
import { ExamSectionResult as IExamSectionResult } from '@linguaflow/domain';
import { ProgressBar } from '@linguaflow/ui';

interface ExamSectionResultProps {
  sectionResults: IExamSectionResult[];
  className?: string;
}

export default function ExamSectionResult({
  sectionResults,
  className = '',
}: ExamSectionResultProps) {
  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 ${className}`}>
      <h3 className="font-display font-bold text-lg text-white">
        Kết Quả Chi Tiết Từng Phần Thi
      </h3>

      <div className="space-y-4">
        {sectionResults.map((sec) => (
          <div
            key={sec.sectionId}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-extrabold text-sm text-white">
                {sec.title}
              </span>
              <span className="font-mono text-xs font-bold text-teal-400">
                {sec.correctAnswers}/{sec.totalQuestions} ({sec.accuracy}%)
              </span>
            </div>

            <ProgressBar
              value={sec.accuracy}
              max={100}
              color={sec.accuracy >= 80 ? 'teal' : sec.accuracy >= 60 ? 'amber' : 'coral'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
