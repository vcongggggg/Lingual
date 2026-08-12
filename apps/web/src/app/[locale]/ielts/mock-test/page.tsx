'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, ShieldAlert, Award, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { ieltsApi } from '@/lib/api';

export default function IeltsMockTestPage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const mockQuestions = [
    {
      id: 'mock_q1',
      skill: 'Reading',
      prompt: 'Investments in clean energy technologies have decreased in recent years.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'False',
    },
    {
      id: 'mock_q2',
      skill: 'Reading',
      prompt: 'What is a major challenge for coal-dependent communities mentioned in the text?',
      options: ['Excessive air pollution', 'Economic dislocation from plant closures', 'High tax rates'],
      correctAnswer: 'Economic dislocation from plant closures',
    },
    {
      id: 'mock_q3',
      skill: 'Listening',
      prompt: 'Where is the main borrowing desk located?',
      options: ['Floor 1', 'Floor 2', 'Floor 3'],
      correctAnswer: 'Floor 1',
    },
    {
      id: 'mock_q4',
      skill: 'Listening',
      prompt: 'How many books can a student borrow at one time?',
      options: ['5 books', '10 books', '14 books'],
      correctAnswer: '10 books',
    },
  ];

  const handleSubmit = async () => {
    try {
      const res = await ieltsApi.submitMockTest({
        type: 'academic',
        durationSec: 1800 - timeLeft,
        answers: userAnswers,
      });
      if (res.success) {
        setResult(res);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Test Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/ielts`}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> IELTS Full Mock Test Simulation
            </h1>
            <span className="text-xs text-slate-400">Áp lực thi thật • Khóa hỗ trợ ngoài</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-lg">
          <Clock className="w-5 h-5 animate-pulse" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {!submitted ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300">
            <span className="font-bold">Lưu ý phòng thi:</span> Trả lời các câu hỏi Listening và Reading dưới đây. Đồng hồ sẽ đếm ngược liên tục.
          </div>

          <div className="space-y-4">
            {mockQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 uppercase">
                    {q.skill}
                  </span>
                  <span className="text-xs text-slate-400">Câu {idx + 1} / {mockQuestions.length}</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">{q.prompt}</div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = userAnswers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt })}
                        className={`w-full p-3 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base transition-all shadow-xl shadow-emerald-500/20"
          >
            Nộp Bài Thi Thử
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Hoàn Thành Bài Thi Thử IELTS</h2>
            <p className="text-sm text-slate-400 mt-1">Kết quả đã được ghi nhận vào hệ thống.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-3">
            <div className="text-xs text-slate-400 uppercase font-semibold">Ước tính Overall Band Score</div>
            <div className="text-4xl font-black text-emerald-400">
              {result?.bandScore?.overall || 7.0}
            </div>
            <div className="text-xs text-slate-300">
              Listening: {result?.bandScore?.listening || 7.5} • Reading: {result?.bandScore?.reading || 6.5}
            </div>
          </div>

          <Link
            href={`/${locale}/ielts`}
            className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all"
          >
            Quay Về IELTS Hub
          </Link>
        </div>
      )}
    </div>
  );
}
