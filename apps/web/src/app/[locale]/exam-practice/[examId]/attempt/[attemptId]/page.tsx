'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Flag, Send, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { MASTER_EXAMS } from '@/lib/exams/sampleData';
import { examsApi } from '@/lib/exams/api';
import { Exam, ExamQuestion } from '@linguaflow/domain';
import ExamTimer from '@/components/exams/ExamTimer';
import ExamQuestionCard from '@/components/exams/ExamQuestionCard';
import ExamQuestionNavigator from '@/components/exams/ExamQuestionNavigator';
import ExamSubmitDialog from '@/components/exams/ExamSubmitDialog';
import { Button, ProgressBar, Badge } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

export default function ExamSimulationPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'vi';
  const examId = params?.examId as string;
  const attemptId = params?.attemptId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMobileNavigator, setShowMobileNavigator] = useState(false);

  useEffect(() => {
    const found = MASTER_EXAMS.find((e) => e.id === examId) || MASTER_EXAMS[0];
    setExam(found);

    examsApi
      .getAttempt(attemptId)
      .then((res: any) => {
        if (res?.attempt?.answers) {
          const loadedAnswers: Record<string, string> = {};
          const loadedFlags: Record<string, boolean> = {};
          res.attempt.answers.forEach((a: any) => {
            if (a.questionId) {
              loadedAnswers[a.questionId] = a.selectedOption || '';
              if (a.flagged) loadedFlags[a.questionId] = true;
            }
          });
          setAnswers(loadedAnswers);
          setFlags(loadedFlags);
        }
      })
      .catch(() => {});

    // Track elapsed exam seconds
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examId, attemptId]);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <p>Đang chuẩn bị đề thi...</p>
      </div>
    );
  }

  // Flatten all questions across sections
  const allQuestions: ExamQuestion[] = exam.sections.flatMap((s) => s.questions);
  const currentQuestion = allQuestions[currentIndex] || allQuestions[0];
  const currentSection = exam.sections.find((s) => s.questions.some((q) => q.id === currentQuestion?.id)) || exam.sections[0];

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
    sfx.playClick();

    // Persist answer asynchronously
    examsApi.submitAnswer(attemptId, {
      questionId: currentQuestion.id,
      selectedOption: option,
      flagged: flags[currentQuestion.id],
    }).catch(() => {});
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    const nextFlag = !flags[currentQuestion.id];
    setFlags((prev) => ({
      ...prev,
      [currentQuestion.id]: nextFlag,
    }));
    sfx.playClick();

    examsApi.submitAnswer(attemptId, {
      questionId: currentQuestion.id,
      selectedOption: answers[currentQuestion.id] || '',
      flagged: nextFlag,
    }).catch(() => {});
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      await examsApi.submitExam(attemptId, {
        elapsedSeconds: Math.max(10, elapsedSeconds),
        answers: formattedAnswers,
      });

      router.push(`/${locale}/exam-practice/result/${attemptId}`);
    } catch {
      router.push(`/${locale}/exam-practice/result/${attemptId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k].trim() !== '').length;
  const flaggedCount = Object.keys(flags).filter((k) => flags[k]).length;
  const progressVal = Math.round((answeredCount / allQuestions.length) * 100);

  return (
    <main className="min-h-screen pb-24 pt-4 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pointer-events-auto">
      {/* Sticky Top Status Bar */}
      <div className="sticky top-20 z-30 p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <h2 className="font-display font-extrabold text-sm sm:text-base text-white line-clamp-1">
              {exam.title}
            </h2>
            <span className="text-xs text-teal-400 font-semibold block line-clamp-1">
              {currentSection.title}
            </span>
          </div>
        </div>

        {/* Center Timer & Submit Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ExamTimer
            initialSeconds={exam.durationMinutes * 60}
            onTimeExpired={handleFinalSubmit}
          />

          <button
            type="button"
            onClick={() => setShowMobileNavigator((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
            title="Mở danh sách câu hỏi"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            icon={<Send className="w-4 h-4" />}
          >
            Nộp bài thi
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full pt-1">
          <ProgressBar value={progressVal} max={100} color={progressVal >= 100 ? 'teal' : 'amber'} />
        </div>
      </div>

      {/* Main Two-Column Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Question Card */}
        <div className="md:col-span-8 space-y-6">
          {currentQuestion && (
            <ExamQuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={allQuestions.length}
              selectedOption={answers[currentQuestion.id]}
              isFlagged={flags[currentQuestion.id]}
              onSelectOption={handleSelectOption}
              onToggleFlag={handleToggleFlag}
            />
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Câu trước
            </Button>

            <span className="text-xs font-mono font-bold text-slate-400">
              {currentIndex + 1} / {allQuestions.length}
            </span>

            {currentIndex === allQuestions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setShowSubmitModal(true)}
                icon={<Send className="w-4 h-4" />}
              >
                Nộp bài thi
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentIndex((prev) => Math.min(allQuestions.length - 1, prev + 1))}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Câu tiếp theo
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator */}
        <div className={`md:col-span-4 ${showMobileNavigator ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-44 space-y-4">
            <ExamQuestionNavigator
              questions={allQuestions}
              currentIndex={currentIndex}
              answers={answers}
              flags={flags}
              onSelectQuestion={(idx) => {
                setCurrentIndex(idx);
                setShowMobileNavigator(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Submit Dialog */}
      <ExamSubmitDialog
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleFinalSubmit}
        totalQuestions={allQuestions.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        submitting={submitting}
      />
    </main>
  );
}
