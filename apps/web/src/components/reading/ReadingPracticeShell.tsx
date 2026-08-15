'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Send, Sparkles } from 'lucide-react';
import { ReadingArticle, ReadingFeedback } from '@linguaflow/domain';
import ReadingQuestion from './ReadingQuestion';
import ReadingResult from './ReadingResult';
import { readingApi } from '@/lib/api';
import { Button, ProgressBar } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface ReadingPracticeShellProps {
  article: ReadingArticle;
  mode?: string;
  elapsedSeconds?: number;
  locale: string;
}

export default function ReadingPracticeShell({
  article,
  mode = 'standard',
  elapsedSeconds = 60,
  locale,
}: ReadingPracticeShellProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [resultFeedback, setResultFeedback] = useState<ReadingFeedback | null>(null);

  const questions = article.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
    sfx.playClick();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    sfx.playClick();

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      const res = await readingApi.submitAttempt({
        articleId: article.id,
        mode,
        answers: formattedAnswers,
        elapsedSeconds,
      });

      if (res?.feedback) {
        setResultFeedback(res.feedback);
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (resultFeedback) {
    return (
      <ReadingResult
        article={article}
        feedback={resultFeedback}
        onRetry={() => {
          setResultFeedback(null);
          setAnswers({});
          setCurrentIndex(0);
        }}
        locale={locale}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Chưa có câu hỏi đọc hiểu cho bài này.</h3>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressVal = Math.round((answeredCount / questions.length) * 100);
  const isCurrentAnswered = Boolean(answers[currentQuestion?.id]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>
            Tiến độ trả lời: <strong className="text-teal-400 font-mono">{answeredCount}</strong> / {questions.length} câu
          </span>
          <span className="font-mono text-teal-400">{progressVal}%</span>
        </div>
        <ProgressBar value={progressVal} max={100} color={progressVal >= 100 ? 'teal' : 'amber'} />
      </div>

      {/* Question Card */}
      <ReadingQuestion
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedOption={answers[currentQuestion.id] || ''}
        onSelectOption={handleSelectOption}
        disabled={submitting}
      />

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0 || submitting}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Câu trước
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            variant="primary"
            size="lg"
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount === 0 || submitting}
            icon={<Send className="w-4 h-4" />}
          >
            {submitting ? 'Đang chấm điểm...' : 'Nộp bài & Nhận kết quả'}
          </Button>
        ) : (
          <Button
            variant="primary"
            type="button"
            onClick={handleNext}
            disabled={!isCurrentAnswered || submitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Câu tiếp theo
          </Button>
        )}
      </div>
    </div>
  );
}
