'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, Sparkles, Send, Award, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { ieltsApi } from '@/lib/api';

export default function IeltsWritingPracticePage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const [question, setQuestion] = useState<any>(null);
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await ieltsApi.getPracticeQuestions('writing');
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

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minWords = question?.part === 'task_1' ? 150 : 250;

  const handleEvaluate = async () => {
    if (!essayText.trim() || !question) return;
    setEvaluating(true);
    try {
      const res = await ieltsApi.evaluateWriting({
        taskType: question.part,
        prompt: question.prompt,
        essayText,
      });
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error('Failed to evaluate writing', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
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
              <FileText className="w-5 h-5 text-amber-400" /> IELTS Writing Evaluator
            </h1>
            <p className="text-xs text-slate-400">AI Chấm Điểm Theo 4 Tiêu Chí Band Descriptor</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
            {question?.part || 'Task 2'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Đang tải đề bài Writing...</div>
      ) : question ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Prompt & Essay Editor */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Đề Bài (Prompt)</span>
                <h2 className="text-base font-semibold text-slate-100 leading-relaxed">{question.prompt}</h2>
              </div>

              {/* Real-time Essay Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                  <span>Bài viết của bạn</span>
                  <span className={wordCount < minWords ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {wordCount} / {minWords} từ tối thiểu
                  </span>
                </div>

                <textarea
                  rows={14}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Nhập bài essay của bạn tại đây (bằng Tiếng Anh)..."
                  className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all font-sans text-sm leading-relaxed resize-none shadow-inner"
                />
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={evaluating || wordCount < 20}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {evaluating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-slate-950" /> AI Đang Chấm Bài & Phân Tích...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Nộp Bài & Nhận Đánh Giá AI
                </>
              )}
            </button>
          </div>

          {/* Right Column: AI Feedback Panel */}
          <div className="space-y-4">
            {result ? (
              <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-6 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">Báo Cáo Nhận Xét AI</span>
                    <h3 className="text-xl font-bold text-white">Kết Quả Đánh Giá Bài Viết</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-center min-w-24">
                    <div className="text-xs uppercase font-semibold">Band Tổng</div>
                    <div className="text-2xl font-black">{result.overallBand}</div>
                  </div>
                </div>

                {/* 4 Criteria Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400">Trả lời đúng đề bài</div>
                    <div className="text-lg font-bold text-amber-400">{result.scores.taskAchievement}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400">Mạch lạc & Kết nối</div>
                    <div className="text-lg font-bold text-amber-400">{result.scores.coherenceAndCohesion}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400">Vốn từ vựng</div>
                    <div className="text-lg font-bold text-amber-400">{result.scores.lexicalResource}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs text-slate-400">Độ chuẩn ngữ pháp</div>
                    <div className="text-lg font-bold text-amber-400">{result.scores.grammaticalRange}</div>
                  </div>
                </div>

                {/* Detailed Comments */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300">Trả lời đúng đề bài:</span>
                    <p>{result.feedback.taskAchievement}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300">Mạch lạc & Kết nối:</span>
                    <p>{result.feedback.coherenceAndCohesion}</p>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Gợi Ý Cải Thiện Cho Lần Viết Sau:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {result.feedback.suggestions?.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                <FileText className="w-12 h-12 text-slate-600" />
                <h4 className="text-base font-bold text-slate-200">Chưa Có Kết Quả Đánh Giá</h4>
                <p className="text-xs max-w-xs leading-relaxed">
                  Soạn essay của bạn ở cột bên trái và nhấn nút "Nộp Bài & Nhận Đánh Giá AI" để xem kết quả phân tích 4 tiêu chí.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
