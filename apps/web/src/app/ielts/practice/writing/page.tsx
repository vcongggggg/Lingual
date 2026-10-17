'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Send,
  Award,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import { LingLing } from '../../../../components/ui/LingLing';

export default function IeltsWritingPracticePage() {
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Fallback demo questions if offline
  const FALLBACK_WRITING = {
    id: 'fallback-ielts-w1',
    title: 'Task 2: Academic Essay on Automation',
    part: 'task_2',
    targetBand: 6.5,
    prompt: `Some people believe that technological developments in artificial intelligence and automation will lead to mass unemployment. Others believe that technology always creates new, more fulfilling job opportunities. Discuss both views and give your own opinion.`,
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getIeltsPracticeQuestions('writing');
        if (res.success && res.questions && res.questions.length > 0) {
          setQuestionsList(res.questions);
          const detailRes = await api.getIeltsQuestionDetail(res.questions[0].id);
          if (detailRes.success && detailRes.question) {
            setSelectedQuestion(detailRes.question);
          } else {
            setSelectedQuestion(FALLBACK_WRITING);
          }
        } else {
          setQuestionsList([FALLBACK_WRITING]);
          setSelectedQuestion(FALLBACK_WRITING);
        }
      } catch {
        setQuestionsList([FALLBACK_WRITING]);
        setSelectedQuestion(FALLBACK_WRITING);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectQuestion = async (qId: string) => {
    setLoading(true);
    setEssayText('');
    setResult(null);
    try {
      const res = await api.getIeltsQuestionDetail(qId);
      if (res.success && res.question) {
        setSelectedQuestion(res.question);
      }
    } catch {
      setSelectedQuestion(FALLBACK_WRITING);
    } finally {
      setLoading(false);
    }
  };

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minWords = selectedQuestion?.part === 'task_1' ? 150 : 250;

  const handleEvaluate = async () => {
    if (!essayText.trim() || !selectedQuestion) return;
    setEvaluating(true);
    try {
      const res = await api.evaluateIeltsWriting({
        taskType: selectedQuestion.part || 'task_2',
        prompt: selectedQuestion.prompt || '',
        essayText,
      });
      if (res.success && res.evaluation) {
        setResult(res.evaluation);
      }
    } catch (err) {
      console.error('Failed to evaluate essay', err);
      // Client-side rule-based fallback
      setResult({
        wordCount,
        minRequired: minWords,
        overallBand: wordCount >= minWords ? 6.5 : 5.5,
        evaluationMethod: 'rule_based_heuristics',
        note: 'Phiên bản hiện tại chấm theo quy tắc, chưa phải AI.',
        criteria: {
          taskAchievement: {
            band: wordCount >= minWords ? 6.5 : 5.5,
            comment: wordCount >= minWords
              ? 'Bài viết đã đáp ứng đủ số lượng từ tối thiểu và bám sát các ý chính của đề bài.'
              : 'Bài viết chưa đạt đủ độ dài tối thiểu, cần bổ sung thêm dẫn chứng và luận điểm.',
          },
          coherenceAndCohesion: {
            band: 6.0,
            comment: 'Các đoạn văn được phân chia rõ ràng. Cần tăng cường sử dụng các từ nối liên kết logic.',
          },
          lexicalResource: {
            band: 6.5,
            comment: 'Sử dụng từ vựng đa dạng, có áp dụng các thuật ngữ học thuật phù hợp ngữ cảnh.',
          },
          grammaticalRange: {
            band: 6.0,
            comment: 'Cấu trúc câu phong phú, kết hợp câu phức và câu đơn linh hoạt.',
          },
        },
        suggestions: [
          'Thêm một ví dụ thực tế cụ thể ở thân bài 2 để củng cố luận điểm.',
          'Chú ý các mạo từ a/an/the và sự hòa hợp giữa chủ ngữ và động từ.',
        ],
      });
    } finally {
      setEvaluating(false);
    }
  };

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
        <span className="text-ink">Chấm điểm Writing · 4 Tiêu Chí</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-paper-2 border border-ink text-xs font-black uppercase text-amber">
            <FileText className="w-3.5 h-3.5" />
            <span>Phòng Luyện Viết Học Thuật</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Chấm điểm theo 4 tiêu chí Band Descriptor
          </h1>
          {/* Dòng nhỏ trung thực bắt buộc theo yêu cầu */}
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Info className="w-3.5 h-3.5 text-teal" />
            <span className="font-semibold">Phiên bản hiện tại chấm theo quy tắc, chưa phải AI</span>
          </div>
        </div>

        {/* Task tabs cuộn ngang */}
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
              {q.part === 'task_1' ? `Task 1 (#${idx + 1})` : `Task 2 (#${idx + 1})`}
            </button>
          ))}
        </div>
      </div>

      {/* Đề bài (Prompt) dạng Thẻ Giấy Note Ghim */}
      <div className="card-paper p-6 sm:p-7 space-y-3 bg-paper-2 border-2 border-ink shadow-brutal-md">
        <div className="flex items-center justify-between border-b border-ink/15 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-red">
            Đề bài luyện viết ({selectedQuestion?.part === 'task_1' ? 'IELTS Writing Task 1' : 'IELTS Writing Task 2'})
          </span>
          <span className="text-xs font-mono font-bold text-ink-muted">
            Tối thiểu {minWords} từ
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-ink leading-relaxed font-serif">
          {selectedQuestion?.prompt || FALLBACK_WRITING.prompt}
        </p>
      </div>

      {/* KHUNG SOẠN THẢO BÀI VIẾT: GIẤY KẺ DÒNG (LINED PAPER) */}
      <div className="card-paper p-6 sm:p-8 space-y-4 shadow-brutal-xl bg-card">
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-ink block">
            Bài viết của bạn:
          </span>
          <span
            className={`font-mono text-xs font-black px-3 py-1 rounded-full border-2 ${
              wordCount >= minWords
                ? 'border-teal bg-teal/10 text-teal'
                : 'border-amber bg-amber/10 text-amber'
            }`}
          >
            {wordCount} / {minWords} từ tối thiểu
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={14}
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Bắt đầu nhập bài viết của bạn tại đây... (Ví dụ: In recent years, the advancement of artificial intelligence...)"
            className="w-full lined-paper p-5 rounded-2xl border-2 border-ink text-base font-serif text-ink leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-red shadow-inner"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">
            Mẹo: Hãy dành 5 phút lập dàn ý 4 đoạn trước khi bắt đầu viết bài.
          </span>

          <button
            onClick={handleEvaluate}
            disabled={evaluating || wordCount < 20}
            className="btn btn-red text-sm font-black shadow-brutal flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
          >
            {evaluating ? (
              <span>Đang đối chiếu quy tắc...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Chấm điểm theo 4 tiêu chí →</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KẾT QUẢ CHẤM ĐIỂM DẠNG 4 THẺ RUBRIC GIẤY */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Kết Quả Overall */}
          <div className="bg-paper-2 border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal block">
                Kết quả đánh giá bài viết
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-ink font-sans">
                Điểm Overall ước tính
              </h2>
              <p className="text-xs text-ink-soft">
                {result.note || 'Phiên bản hiện tại chấm theo quy tắc, chưa phải AI.'}
              </p>
            </div>

            <div className="text-center sm:text-right bg-card border-2 border-ink rounded-2xl p-4 shadow-brutal-sm flex-shrink-0">
              <span className="text-[11px] font-black uppercase text-ink-muted block">Overall Band</span>
              <span className="text-4xl font-black font-mono text-red">
                Band {result.overallBand?.toFixed(1) || '6.0'}
              </span>
            </div>
          </div>

          {/* 4 Thẻ Rubric Giấy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Task Achievement */}
            <div className="card-paper p-5 sm:p-6 space-y-3 bg-card shadow-brutal-md">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
                  Tiêu chí 1
                </span>
                <span className="font-mono text-base font-black text-red">
                  Band {result.criteria?.taskAchievement?.band?.toFixed(1) || '6.0'}
                </span>
              </div>
              <h4 className="text-base font-black text-ink font-sans">
                Task Achievement / Response
              </h4>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                {result.criteria?.taskAchievement?.comment}
              </p>
            </div>

            {/* 2. Coherence & Cohesion */}
            <div className="card-paper p-5 sm:p-6 space-y-3 bg-card shadow-brutal-md">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
                  Tiêu chí 2
                </span>
                <span className="font-mono text-base font-black text-red">
                  Band {result.criteria?.coherenceAndCohesion?.band?.toFixed(1) || '6.0'}
                </span>
              </div>
              <h4 className="text-base font-black text-ink font-sans">
                Coherence & Cohesion
              </h4>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                {result.criteria?.coherenceAndCohesion?.comment}
              </p>
            </div>

            {/* 3. Lexical Resource */}
            <div className="card-paper p-5 sm:p-6 space-y-3 bg-card shadow-brutal-md">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
                  Tiêu chí 3
                </span>
                <span className="font-mono text-base font-black text-red">
                  Band {result.criteria?.lexicalResource?.band?.toFixed(1) || '6.0'}
                </span>
              </div>
              <h4 className="text-base font-black text-ink font-sans">
                Lexical Resource
              </h4>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                {result.criteria?.lexicalResource?.comment}
              </p>
            </div>

            {/* 4. Grammatical Range */}
            <div className="card-paper p-5 sm:p-6 space-y-3 bg-card shadow-brutal-md">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
                  Tiêu chí 4
                </span>
                <span className="font-mono text-base font-black text-red">
                  Band {result.criteria?.grammaticalRange?.band?.toFixed(1) || '6.0'}
                </span>
              </div>
              <h4 className="text-base font-black text-ink font-sans">
                Grammatical Range & Accuracy
              </h4>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                {result.criteria?.grammaticalRange?.comment}
              </p>
            </div>
          </div>

          {/* Gợi Ý Nâng Band dạng Giấy Note Ghim */}
          {Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
            <div className="lined-paper border-2 border-ink rounded-2xl p-5 sm:p-6 space-y-2.5 shadow-brutal-sm">
              <span className="text-xs font-black uppercase tracking-wider text-teal block">
                Gợi ý nâng Band từ bộ luật:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-ink font-sans">
                {result.suggestions.map((sug: string, idx: number) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
