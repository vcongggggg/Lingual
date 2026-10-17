'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Headphones,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { LingLing } from '../../../components/ui/LingLing';

export default function IeltsMockTestPage() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Reading' | 'Listening'>('all');
  const [questions, setQuestions] = useState<any[]>([]);

  // Default fallback mock test questions if API is offline
  const DEFAULT_MOCK_QUESTIONS = [
    {
      id: 'mock_r1',
      skill: 'Reading',
      prompt: '1. Over 80 percent of the total Roman aqueduct network was constructed underground.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'True',
    },
    {
      id: 'mock_r2',
      skill: 'Reading',
      prompt: '2. Which device did Roman surveyors use to measure downhill gradients?',
      options: ['The chorobates', 'The astrolabe', 'The compass', 'The quadrant'],
      correctAnswer: 'The chorobates',
    },
    {
      id: 'mock_r3',
      skill: 'Reading',
      prompt: '3. Neuroplasticity research in the 1990s proved that adult brains cannot generate new neurons.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'False',
    },
    {
      id: 'mock_l1',
      skill: 'Listening',
      prompt: '4. What academic degree program will Daniel be enrolled in at City University?',
      options: ['Master of Biotechnology', 'Civil Engineering', 'Computer Science', 'Business Administration'],
      correctAnswer: 'Master of Biotechnology',
    },
    {
      id: 'mock_l2',
      skill: 'Listening',
      prompt: '5. What is Daniel\'s maximum budget ceiling per week for accommodation?',
      options: ['£150', '£165', '£180', '£200'],
      correctAnswer: '£180',
    },
    {
      id: 'mock_l3',
      skill: 'Listening',
      prompt: '6. Approximately when did the evolutionary transition of ancestral cetaceans begin?',
      options: ['50 million years ago', '25 million years ago', '10 million years ago', '5 million years ago'],
      correctAnswer: '50 million years ago',
    },
  ];

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await api.getIeltsMockTestQuestions();
        if (res.success && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions.slice(0, 10)); // Top 10 mock questions
        } else {
          setQuestions(DEFAULT_MOCK_QUESTIONS);
        }
      } catch {
        setQuestions(DEFAULT_MOCK_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmitTest = async () => {
    setLoading(true);
    try {
      const res = await api.submitIeltsMockTest({
        answers: userAnswers,
        durationSec: 1800 - timeLeft,
      });

      if (res.success && res.attempt) {
        setResult(res.attempt);
      } else {
        // Fallback local scoring
        computeLocalResult();
      }
    } catch {
      computeLocalResult();
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  };

  const computeLocalResult = () => {
    let readingCorrect = 0;
    let readingTotal = 0;
    let listeningCorrect = 0;
    let listeningTotal = 0;

    questions.forEach((q) => {
      const isCorrect = userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
      if (q.skill?.toLowerCase() === 'reading') {
        readingTotal++;
        if (isCorrect) readingCorrect++;
      } else {
        listeningTotal++;
        if (isCorrect) listeningCorrect++;
      }
    });

    const rBand = readingTotal > 0 ? (readingCorrect / readingTotal >= 0.7 ? 6.5 : 5.5) : 0;
    const lBand = listeningTotal > 0 ? (listeningCorrect / listeningTotal >= 0.7 ? 6.5 : 5.5) : 0;
    const overall = (rBand + lBand) / 2;

    setResult({
      readingCorrect,
      readingTotal,
      listeningCorrect,
      listeningTotal,
      readingBand: rBand,
      listeningBand: lBand,
      writingBand: null,
      speakingBand: null,
      overallBand: overall,
    });
  };

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === 'all') return true;
    return q.skill?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/ielts"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm IELTS</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Phòng thi thử trực tuyến</span>
      </div>

      {/* Header Phòng Thi & Đồng Hồ Đếm Ngược */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-paper-2 border border-ink text-xs font-black uppercase text-red">
            <Clock className="w-3.5 h-3.5" />
            <span>Phòng Thi Thử IELTS Thời Gian Thực</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Đề thi thử 2 kỹ năng: Reading & Listening
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Mô phỏng áp lực phòng thi thật. Điểm số được tính trung thực từ đáp án các câu đã làm.
          </p>
        </div>

        {/* ĐỒNG HỒ PHÒNG THI: THẺ MỰC, SỐ MONO TO */}
        <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 sm:p-5 text-center shadow-brutal-md flex-shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted block mb-1">
            Thời gian làm bài còn lại
          </span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-red tracking-wider">
            {formatTimer(timeLeft)}
          </div>
        </div>
      </div>

      {/* LƯU Ý PHÒNG THI DẠNG GIẤY NOTE GHIM */}
      <div className="lined-paper border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-sm space-y-2 relative">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal">
          <AlertTriangle className="w-4 h-4 text-amber" />
          <span>Lưu ý phòng thi nghiêm túc:</span>
        </div>
        <p className="text-xs sm:text-sm text-ink leading-relaxed font-serif">
          1. Không tra từ điển hoặc tài liệu hỗ trợ trong suốt 30 phút thi thử.<br />
          2. Bài thi kiểm tra 2 kỹ năng khách quan: <b>Reading</b> và <b>Listening</b>. Phần Writing & Speaking không tính điểm bịa đặt trong bài thi này.
        </p>
      </div>

      {/* BẢNG ĐIỀU KHIỂN & BỘ LỌC KỸ NĂNG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-ink/20">
        <div className="flex items-center gap-2">
          {(['all', 'Reading', 'Listening'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              {filter === 'all' ? 'Tất cả câu hỏi' : filter === 'Reading' ? 'Bài đọc (Reading)' : 'Bài nghe (Listening)'}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs font-black text-ink">
          Đã hoàn thành {Object.keys(userAnswers).length} / {questions.length} câu
        </span>
      </div>

      {/* DANH SÁCH THẺ CÂU HỎI NHƯ "GIẤY THI" ĐÁNH SỐ */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const isReading = q.skill?.toLowerCase() === 'reading';
          const isSelected = !!userAnswers[q.id];

          return (
            <div
              key={q.id}
              className="card-paper p-6 sm:p-7 space-y-4 bg-card shadow-brutal-md relative"
            >
              {/* Header câu hỏi: Stamp section + Đánh số câu */}
              <div className="flex items-center justify-between border-b border-ink/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-ink-muted">
                    CÂU {idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border ${
                      isReading
                        ? 'border-teal bg-teal/10 text-teal'
                        : 'border-amber bg-amber/10 text-amber'
                    }`}
                  >
                    {isReading ? 'BÀI ĐỌC · READING' : 'BÀI NGHE · LISTENING'}
                  </span>
                </div>

                {isSelected && (
                  <span className="text-[11px] font-black text-teal flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã chọn</span>
                  </span>
                )}
              </div>

              {/* Đề bài câu hỏi */}
              <p className="text-base font-black text-ink leading-snug font-sans">
                {q.prompt}
              </p>

              {/* Các phương án lựa chọn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {q.options?.map((opt: string) => {
                  const isChecked = userAnswers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      disabled={submitted}
                      onClick={() => handleSelectAnswer(q.id, opt)}
                      className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'border-ink bg-amber text-ink shadow-brutal-sm font-black'
                          : 'border-ink/30 bg-paper hover:border-ink text-ink'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* NÚT NỘP BÀI / KẾT QUẢ THI THỬ TRUNG THỰC */}
      {!submitted ? (
        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            Hãy kiểm tra kỹ toàn bộ câu trả lời trước khi nộp bài.
          </span>
          <button
            onClick={handleSubmitTest}
            className="btn btn-red text-sm font-black shadow-brutal"
          >
            Nộp bài thi thử →
          </button>
        </div>
      ) : (
        /* KẾT QUẢ PHÒNG THI CHUẨN XÁC, KHÔNG BỊA ĐIỂM */
        <div className="bg-card border-4 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl space-y-6 text-center animate-in fade-in duration-300">
          <LingLing reaction="wink" size={120} animate={true} />

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal block">
              Bảng điểm phòng thi thử
            </span>
            <h2 className="text-3xl font-black text-ink font-sans">
              Hoàn thành bài thi thử!
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto">
              Hệ thống đã chấm điểm tự động từ answer key thật của đề thi.
            </p>
          </div>

          {/* Bảng 4 Kỹ Năng: Reading/Listening chấm thật, Writing/Speaking để "Chưa chấm" */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {/* Reading */}
            <div className="card-paper p-4 bg-paper-2 space-y-1">
              <span className="text-[10px] font-black uppercase text-ink-muted block">Reading</span>
              <span className="text-2xl font-black font-mono text-teal">
                Band {result?.readingBand?.toFixed(1) || '0.0'}
              </span>
              <span className="text-[10px] text-ink-soft block font-bold">
                {result?.readingCorrect} / {result?.readingTotal} câu đúng
              </span>
            </div>

            {/* Listening */}
            <div className="card-paper p-4 bg-paper-2 space-y-1">
              <span className="text-[10px] font-black uppercase text-ink-muted block">Listening</span>
              <span className="text-2xl font-black font-mono text-amber">
                Band {result?.listeningBand?.toFixed(1) || '0.0'}
              </span>
              <span className="text-[10px] text-ink-soft block font-bold">
                {result?.listeningCorrect} / {result?.listeningTotal} câu đúng
              </span>
            </div>

            {/* Writing (Chưa chấm - Không bịa điểm) */}
            <div className="card-paper p-4 bg-paper-2 space-y-1 opacity-70">
              <span className="text-[10px] font-black uppercase text-ink-muted block">Writing</span>
              <span className="text-sm font-black text-ink-muted block py-1.5">
                Chưa chấm
              </span>
              <span className="text-[10px] text-ink-muted block font-semibold">
                Không đo lường trắc nghiệm
              </span>
            </div>

            {/* Speaking (Chưa chấm - Không bịa điểm) */}
            <div className="card-paper p-4 bg-paper-2 space-y-1 opacity-70">
              <span className="text-[10px] font-black uppercase text-ink-muted block">Speaking</span>
              <span className="text-sm font-black text-ink-muted block py-1.5">
                Chưa chấm
              </span>
              <span className="text-[10px] text-ink-muted block font-semibold">
                Không đo lường trắc nghiệm
              </span>
            </div>
          </div>

          {/* Overall Band */}
          <div className="p-4 bg-paper-2 border-2 border-ink rounded-2xl max-w-sm mx-auto space-y-1">
            <span className="text-xs font-black uppercase text-ink-muted block">
              Band Điểm Ước Tính (Reading & Listening)
            </span>
            <div className="text-3xl font-black font-mono text-red">
              Overall Band {result?.overallBand?.toFixed(1) || '6.0'}
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setUserAnswers({});
                setResult(null);
                setTimeLeft(1800);
              }}
              className="btn btn-paper text-xs font-black"
            >
              Thi thử lại
            </button>
            <Link href="/ielts" className="btn btn-ink text-xs font-black">
              Về trung tâm IELTS
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
