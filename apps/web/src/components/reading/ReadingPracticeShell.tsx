'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Send, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { ReadingArticle, ReadingFeedback } from '@linguaflow/domain';
import ReadingQuestion from './ReadingQuestion';
import ReadingResult from './ReadingResult';
import { readingApi } from '@/lib/api';
import { Button, ProgressBar, Badge } from '@linguaflow/ui';
import { arcadeAudio } from '@/lib/arcadeAudio';

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
  const isVi = locale === 'vi';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [resultFeedback, setResultFeedback] = useState<ReadingFeedback | null>(null);
  const [mobileTab, setMobileTab] = useState<'passage' | 'questions'>('questions');

  const questions = article.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    arcadeAudio.playLaser();
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    arcadeAudio.playLaser();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    arcadeAudio.playLaser();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    arcadeAudio.playCoin();

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
        <h3 className="text-xl font-bold text-white">
          {isVi ? 'Chưa có câu hỏi đọc hiểu cho bài này.' : 'No comprehension questions available for this article.'}
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MOBILE TAB TOGGLE (375-640px) */}
      <div className="flex sm:hidden items-center justify-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          type="button"
          onClick={() => setMobileTab('passage')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mobileTab === 'passage'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              : 'text-slate-400'
          }`}
        >
          {isVi ? '📖 Xem Bài Đọc' : '📖 Passage'}
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('questions')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mobileTab === 'questions'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              : 'text-slate-400'
          }`}
        >
          {isVi ? `✍️ Câu Hỏi (${currentIndex + 1}/${questions.length})` : `✍️ Questions (${currentIndex + 1}/${questions.length})`}
        </button>
      </div>

      {/* DUAL SPLIT-PANE DESK */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: AUTHENTIC READING PASSAGE (Sticky Independent Scroll) */}
        <div
          className={`sm:col-span-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 max-h-[75vh] overflow-y-auto shadow-xl ${
            mobileTab === 'questions' ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isVi ? 'Nội Dung Bài Đọc Gốc' : 'Reading Passage'}</span>
            </span>
            <Badge variant="teal" className="text-[10px] font-mono uppercase">
              {article.level}
            </Badge>
          </div>

          <div className="space-y-4 text-sm text-slate-300 font-sans leading-relaxed">
            {article.paragraphs?.map((p, idx) => (
              <p key={idx} className="relative pl-6">
                <span className="absolute left-0 top-0 text-[10px] font-mono text-slate-500 font-bold">
                  [{idx + 1}]
                </span>
                {p.english}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT PANE: QUESTION MATRIX & OPTIONS */}
        <div
          className={`sm:col-span-6 space-y-5 ${
            mobileTab === 'passage' ? 'hidden sm:block' : 'block'
          }`}
        >
          {/* Question Progress Header */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">
                {isVi ? 'Tiến độ câu hỏi:' : 'Question Progress:'}
              </span>
              <span className="text-teal-300 font-bold">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <ProgressBar value={currentIndex + 1} max={questions.length} color="teal" />
          </div>

          {/* Current Question View */}
          {currentQuestion && (
            <ReadingQuestion
              question={currentQuestion}
              selectedOption={answers[currentQuestion.id]}
              onSelectOption={handleSelectOption}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
            />
          )}

          {/* Navigation & Submit Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              {isVi ? 'Câu trước' : 'Previous'}
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={!answers[currentQuestion?.id]}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isVi ? 'Câu tiếp theo' : 'Next'}
              </Button>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                icon={<Send className="w-4 h-4" />}
              >
                {submitting ? (isVi ? 'Đang chấm...' : 'Grading...') : (isVi ? 'Nộp bài đọc' : 'Submit Quiz')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
