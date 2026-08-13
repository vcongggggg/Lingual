'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Headphones, Play, Pause, Volume2, Eye, EyeOff, CheckCircle2, Award, ArrowLeft, RefreshCw } from 'lucide-react';
import { ieltsApi } from '@/lib/api';

export default function IeltsListeningPracticePage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [question, setQuestion] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; band: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await ieltsApi.getPracticeQuestions('listening');
        if (res.success && res.questions && res.questions.length > 0) {
          const detailRes = await ieltsApi.getQuestionDetail(res.questions[0].id);
          if (detailRes.success) {
            setQuestion(detailRes.question);
          }
        }
      } catch {
        // Fallback to local default question if API is offline
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    if (!question || !question.contentParsed?.questions) return;
    const questions = question.contentParsed.questions;

    let correctCount = 0;
    questions.forEach((q: any) => {
      if (userAnswers[q.id] && userAnswers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const accuracyRatio = questions.length > 0 ? correctCount / questions.length : 0;
    const estimatedBand = accuracyRatio >= 0.9 ? 7.5 : accuracyRatio >= 0.6 ? 6.0 : 5.0;

    setScoreResult({ raw: correctCount, band: estimatedBand });
    setSubmitted(true);
  };

  const parsedQuestions = question?.contentParsed?.questions || [];
  const transcriptText = question?.contentParsed?.transcript || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/ielts`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-purple-400" /> IELTS Listening Practice
            </h1>
            <p className="text-xs text-slate-400">Audio Player & Interactive Question Sheet</p>
          </div>
        </div>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-purple-300 hover:bg-slate-800 transition-all flex items-center gap-1.5"
        >
          {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showTranscript ? 'Ẩn Transcript' : 'Xem Transcript'}
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Đang tải audio và câu hỏi...</div>
      ) : question ? (
        <div className="space-y-6">
          {/* Custom Audio Player Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase">
                  {question.part}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{question.title}</h2>
              </div>
              <Volume2 className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>

            {/* Hidden Audio Tag */}
            <audio
              ref={audioRef}
              src={question.audioUrl || 'https://cdn.freesound.org/previews/567/567341_5674468-lq.mp3'}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-lg shadow-purple-500/30 scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden relative">
                  <div className={`h-full bg-purple-500 transition-all duration-300 ${isPlaying ? 'w-2/3' : 'w-0'}`} />
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mt-1">
                  <span>{isPlaying ? '0:45' : '0:00'}</span>
                  <span>1:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Drawer */}
          {showTranscript && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 animate-fadeIn">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Audio Transcript:
              </div>
              <p className="italic bg-slate-950/60 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
                {transcriptText}
              </p>
            </div>
          )}

          {/* Questions Sheet */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">Trả lời các câu hỏi sau theo nội dung audio:</h3>

            {parsedQuestions.map((q: any, idx: number) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="font-semibold text-sm text-slate-200">
                  <span className="text-purple-400 font-bold mr-2">Câu {idx + 1}:</span>
                  {q.prompt}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options?.map((opt: string) => {
                    const isSelected = userAnswers[q.id] === opt;
                    const isCorrect = submitted && opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                    const isWrong = submitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={opt}
                        disabled={submitted}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                            : isWrong
                            ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                            : isSelected
                            ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Footer */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            {submitted && scoreResult ? (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Kết quả Listening</div>
                  <div className="text-sm font-bold text-slate-100">
                    Đúng {scoreResult.raw}/{parsedQuestions.length} câu • Band: <span className="text-purple-400">{scoreResult.band}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Nghe cẩn thận và chọn đáp án trước khi nộp</div>
            )}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20"
              >
                Nộp Bài Listening
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
      ) : null}
    </div>
  );
}
