'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, CheckCircle2, ChevronRight, HelpCircle, RefreshCw, Award, ArrowLeft } from 'lucide-react';
import { ieltsApi } from '@/lib/api';

export default function IeltsReadingPracticePage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; band: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await ieltsApi.getPracticeQuestions('reading');
        if (res.success && res.questions && res.questions.length > 0) {
          setQuestionsList(res.questions);
          // Fetch details of first question
          const detailRes = await ieltsApi.getQuestionDetail(res.questions[0].id);
          if (detailRes.success) {
            setSelectedQuestion(detailRes.question);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectQuestion = async (qId: string) => {
    setLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    setScoreResult(null);
    try {
      const res = await ieltsApi.getQuestionDetail(qId);
      if (res.success) {
        setSelectedQuestion(res.question);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    if (!selectedQuestion || !selectedQuestion.contentParsed?.questions) return;
    const questions = selectedQuestion.contentParsed.questions;

    let correctCount = 0;
    questions.forEach((q: any) => {
      if (userAnswers[q.id] && userAnswers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const accuracyRatio = questions.length > 0 ? correctCount / questions.length : 0;
    const estimatedBand = accuracyRatio >= 0.9 ? 7.5 : accuracyRatio >= 0.6 ? 6.5 : 5.5;

    setScoreResult({ raw: correctCount, band: estimatedBand });
    setSubmitted(true);
  };

  const parsedQuestions = selectedQuestion?.contentParsed?.questions || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 px-4 sm:px-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/ielts`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-sm text-slate-200">IELTS Reading 2-Column Practice</span>
        </div>

        {/* Question Selector Pill */}
        <div className="flex items-center gap-2">
          {questionsList.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedQuestion?.id === q.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Passage {idx + 1}
            </button>
          ))}
        </div>
      </header>

      {/* 2-Column Split Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Reading Passage Text */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-800 bg-slate-950/90 text-slate-200 leading-relaxed font-serif text-base sm:text-lg">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Đang tải bài đọc...
            </div>
          ) : selectedQuestion ? (
            <div className="space-y-4 max-w-xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-sans font-extrabold text-blue-300">
                {selectedQuestion.title}
              </h2>
              <div className="text-xs font-sans text-slate-400 flex items-center gap-2 pb-3 border-b border-slate-800">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                  {selectedQuestion.part}
                </span>
                <span>Band mục tiêu: {selectedQuestion.targetBand}</span>
              </div>
              <div className="whitespace-pre-line text-slate-300 font-sans text-sm sm:text-base leading-relaxed space-y-4">
                {selectedQuestion.passageText}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column: Questions & Answer Inputs */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-slate-900/40 flex flex-col justify-between space-y-6">
          <div className="space-y-6 max-w-xl mx-auto w-full">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-blue-400" /> Câu Hỏi & Đáp Án
            </h3>

            {parsedQuestions.map((q: any, idx: number) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
              >
                <div className="font-semibold text-sm text-slate-200">
                  <span className="text-blue-400 font-bold mr-2">Câu {idx + 1}:</span>
                  {q.prompt}
                </div>

                {/* Multiple choice or TFNG options */}
                <div className="space-y-2 pt-1">
                  {q.options?.map((opt: string) => {
                    const isSelected = userAnswers[q.id] === opt;
                    const isCorrect = submitted && opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    const isWrong = submitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={opt}
                        disabled={submitted}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`w-full p-3 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                            : isWrong
                            ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                            : isSelected
                            ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && q.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300">
                    <span className="font-bold">Giải thích:</span> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between max-w-xl mx-auto w-full">
            {submitted && scoreResult ? (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Kết quả bài làm</div>
                  <div className="text-sm font-bold text-slate-100">
                    Đúng {scoreResult.raw}/{parsedQuestions.length} câu • Band ước tính: <span className="text-emerald-400">{scoreResult.band}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Hoàn thành các câu hỏi ở cột phải</div>
            )}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                Nộp Bài Làm
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setUserAnswers({});
                  setScoreResult(null);
                }}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Làm lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
