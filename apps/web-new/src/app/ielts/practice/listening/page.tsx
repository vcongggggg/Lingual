'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Headphones,
  Play,
  Pause,
  RotateCw,
  Eye,
  EyeOff,
  CheckCircle2,
  Award,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import { LingLing } from '../../../../components/ui/LingLing';

export default function IeltsListeningPracticePage() {
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; total: number; band: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback demo questions if offline
  const FALLBACK_LISTENING = {
    id: 'fallback-ielts-l1',
    title: 'Section 1: Student Accommodation & Campus Facility Inquiry',
    part: 'section_1',
    targetBand: 6.5,
    contentParsed: {
      transcript: `Admissions Officer: Good morning, City University housing office. How can I help you today?\nDaniel: Hello, I'm an incoming postgraduate student and I'd like to ask about on-campus accommodation options for the upcoming autumn semester.\nAdmissions Officer: Certainly. Could I first have your full name and student ID number, please?\nDaniel: Yes, it's Daniel Miller, and my student ID is ST-88421.\nAdmissions Officer: Thank you Daniel. What program will you be studying?\nDaniel: I will be enrolled in the Master of Biotechnology program.\nAdmissions Officer: Great. We have two primary halls available: Greenfield Court and Riverside Lodge. What is your weekly budget ceiling?\nDaniel: My absolute maximum ceiling is 180 pounds per week, preferably with utilities included.\nAdmissions Officer: Greenfield Court is 165 pounds per week with high-speed internet and all heating included. Would you prefer a private en-suite or a shared kitchen flat?\nDaniel: A shared kitchen flat is perfectly fine, as long as the study desk is quiet.`,
      questions: [
        {
          id: 'l_q1',
          type: 'multiple_choice',
          prompt: '1. What academic subject is Daniel going to study at the university?',
          options: ['Biotechnology', 'Civil Engineering', 'Computer Science', 'Business Administration'],
          correctAnswer: 'Biotechnology',
          explanation: 'The transcript states: "I will be enrolled in the Master of Biotechnology program."',
        },
        {
          id: 'l_q2',
          type: 'multiple_choice',
          prompt: '2. What is Daniel\'s maximum weekly budget ceiling for accommodation?',
          options: ['£150', '£165', '£180', '£200'],
          correctAnswer: '£180',
          explanation: 'Daniel mentions: "My absolute maximum ceiling is 180 pounds per week."',
        },
        {
          id: 'l_q3',
          type: 'multiple_choice',
          prompt: '3. Which accommodation hall was quoted at £165 per week with utilities included?',
          options: ['Riverside Lodge', 'Greenfield Court', 'Victoria Residence', 'Oakwood Hall'],
          correctAnswer: 'Greenfield Court',
          explanation: 'The officer confirms: "Greenfield Court is 165 pounds per week with high-speed internet and all heating included."',
        },
      ],
    },
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getIeltsPracticeQuestions('listening');
        if (res.success && res.questions && res.questions.length > 0) {
          setQuestionsList(res.questions);
          const detailRes = await api.getIeltsQuestionDetail(res.questions[0].id);
          if (detailRes.success && detailRes.question) {
            setSelectedQuestion(detailRes.question);
          } else {
            setSelectedQuestion(FALLBACK_LISTENING);
          }
        } else {
          setQuestionsList([FALLBACK_LISTENING]);
          setSelectedQuestion(FALLBACK_LISTENING);
        }
      } catch {
        setQuestionsList([FALLBACK_LISTENING]);
        setSelectedQuestion(FALLBACK_LISTENING);
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
    setIsPlaying(false);
    try {
      const res = await api.getIeltsQuestionDetail(qId);
      if (res.success && res.question) {
        setSelectedQuestion(res.question);
      }
    } catch {
      setSelectedQuestion(FALLBACK_LISTENING);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (qId: string, value: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = () => {
    const qList = selectedQuestion?.contentParsed?.questions || [];
    if (qList.length === 0) return;

    let correctCount = 0;
    qList.forEach((q: any) => {
      const ans = userAnswers[q.id];
      if (ans && ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const ratio = correctCount / qList.length;
    let band = 5.0;
    if (ratio >= 0.9) band = 8.0;
    else if (ratio >= 0.75) band = 7.0;
    else if (ratio >= 0.6) band = 6.0;
    else if (ratio >= 0.4) band = 5.5;

    setScoreResult({ raw: correctCount, total: qList.length, band });
    setSubmitted(true);
  };

  const questions = selectedQuestion?.contentParsed?.questions || [];
  const transcript = selectedQuestion?.contentParsed?.transcript || '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/ielts"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm IELTS</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Luyện nghe IELTS</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/20">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal block mb-1">
            Máy nghe cassette & Phiếu câu hỏi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            {selectedQuestion?.title || 'IELTS Listening Practice'}
          </h1>
        </div>

        {/* Section Tabs cuộn ngang trên mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {questionsList.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q.id)}
              className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                selectedQuestion?.id === q.id
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              Phần {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* MÁY NGHE CASSETTE CỔ ĐIỂN TRÊN GIẤY */}
      <div className="card-paper p-6 sm:p-8 space-y-6 shadow-brutal-xl relative overflow-hidden bg-paper-2">
        {/* Header Đầu Băng Cassette */}
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-ink">
              STEREO CASSETTE · BĂNG 01
            </span>
          </div>

          <span className="font-mono text-xs font-black text-teal bg-card border border-ink px-2.5 py-0.5 rounded-md">
            Mục tiêu Band {selectedQuestion?.targetBand || '6.5'}
          </span>
        </div>

        {/* Khung Băng Cassette với 2 Bánh Răng Quay */}
        <div className="bg-card border-2 border-ink rounded-2xl p-6 sm:p-8 shadow-inner flex flex-col items-center justify-center space-y-5">
          <div className="w-full max-w-sm flex items-center justify-around py-3 bg-paper-2 border-2 border-ink rounded-xl shadow-brutal-sm">
            {/* Bánh răng trái */}
            <div
              className={`w-14 h-14 rounded-full border-4 border-ink bg-card flex items-center justify-center transition-all ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <div className="w-4 h-4 rounded-full bg-ink" />
            </div>

            {/* Dải phim băng cassette */}
            <div className="flex-1 px-4 space-y-1">
              <div className="h-2 bg-ink/20 rounded-full overflow-hidden border border-ink/40">
                <div
                  className="h-full bg-red transition-all duration-300"
                  style={{ width: isPlaying ? '60%' : '15%' }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-ink-muted text-center block">
                {isPlaying ? '01:45 / 03:20' : '00:00 / 03:20'}
              </span>
            </div>

            {/* Bánh răng phải */}
            <div
              className={`w-14 h-14 rounded-full border-4 border-ink bg-card flex items-center justify-center transition-all ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <div className="w-4 h-4 rounded-full bg-ink" />
            </div>
          </div>

          {/* Cụm Điều Khiển Phát / Dừng */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className="btn btn-red w-14 h-14 rounded-full flex items-center justify-center shadow-brutal cursor-pointer p-0"
              title={isPlaying ? 'Tạm dừng' : 'Bấm để nghe'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white text-white" />
              ) : (
                <Play className="w-6 h-6 fill-white text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="btn btn-paper text-xs font-black flex items-center gap-2 cursor-pointer"
            >
              {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranscript ? 'Ẩn bản ghi lời' : 'Xem bản ghi lời (Transcript)'}</span>
            </button>
          </div>
        </div>

        {/* Khung Bản Ghi Lời (Transcript) dạng Giấy Note Ghim */}
        {showTranscript && (
          <div className="lined-paper border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-sm space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-ink/15 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal">
                Bản ghi lời bài nghe (Audio Transcript)
              </span>
              <span className="text-[10px] font-mono font-bold text-ink-muted">Đối chiếu ngữ cảnh</span>
            </div>
            <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line font-serif">
              {transcript}
            </p>
          </div>
        )}
      </div>

      {/* PHIẾU TRẢ LỜI CÂU HỎI (QUESTION ANSWER SHEET) */}
      <div className="card-paper p-6 sm:p-8 space-y-6 shadow-brutal-lg bg-card">
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
              Phiếu làm bài thi
            </span>
            <h2 className="text-xl font-black text-ink font-sans">
              Danh sách câu hỏi trắc nghiệm
            </h2>
          </div>
          <span className="font-mono text-xs font-black px-3 py-1 rounded-full border border-ink bg-paper-2 text-ink">
            {Object.keys(userAnswers).length} / {questions.length} câu đã chọn
          </span>
        </div>

        {/* Danh Sách Câu Hỏi Đánh Số */}
        <div className="space-y-6">
          {questions.map((q: any, qIdx: number) => {
            const isCorrect = submitted && userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            const isWrong = submitted && !isCorrect;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-teal bg-teal/5'
                      : 'border-red bg-red/5'
                    : 'border-ink bg-paper-2'
                }`}
              >
                <div className="space-y-3">
                  <h3 className="text-base font-black text-ink leading-snug font-sans">
                    {q.prompt}
                  </h3>

                  {/* Lựa chọn đáp án */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options?.map((opt: string) => {
                      const isSelected = userAnswers[q.id] === opt;
                      const isOptCorrect = submitted && opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                      return (
                        <button
                          key={opt}
                          disabled={submitted}
                          onClick={() => handleAnswerSelect(q.id, opt)}
                          className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all cursor-pointer ${
                            isOptCorrect
                              ? 'border-teal bg-teal text-white shadow-brutal-sm font-black'
                              : isSelected
                              ? isWrong
                                ? 'border-red bg-red text-white font-black'
                                : 'border-ink bg-amber text-ink shadow-brutal-sm font-black'
                              : 'border-ink/30 bg-card text-ink hover:border-ink'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Giải thích khi đã nộp bài */}
                  {submitted && (
                    <div className="pt-2 text-xs font-semibold text-ink-soft border-t border-ink/15 space-y-1">
                      <span className="font-black text-ink block">
                        Đáp án đúng: <b className="text-teal">{q.correctAnswer}</b>
                      </span>
                      {q.explanation && <p className="italic text-ink-muted">{q.explanation}</p>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nút Nộp Bài / Kết quả */}
        {!submitted ? (
          <div className="pt-4 flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length === 0}
              className="btn btn-red text-sm font-black shadow-brutal disabled:opacity-50"
            >
              Nộp bài chấm điểm →
            </button>
          </div>
        ) : (
          <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal text-teal text-xs font-black">
              <Award className="w-4 h-4" />
              <span>Kết Quả Luyện Nghe</span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div>
                <span className="text-xs font-black uppercase text-ink-muted block">Số câu đúng</span>
                <span className="text-3xl font-black font-mono text-ink">
                  {scoreResult?.raw} / {scoreResult?.total}
                </span>
              </div>
              <div className="h-10 w-0.5 bg-ink/20" />
              <div>
                <span className="text-xs font-black uppercase text-ink-muted block">Band ước tính</span>
                <span className="text-3xl font-black font-mono text-red">
                  Band {scoreResult?.band.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setUserAnswers({});
                  setScoreResult(null);
                }}
                className="btn btn-paper text-xs font-black"
              >
                Làm lại bài này
              </button>
              <Link href="/ielts" className="btn btn-ink text-xs font-black">
                Về trung tâm IELTS
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
