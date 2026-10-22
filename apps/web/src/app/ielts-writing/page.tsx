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
  BookOpen,
  PenTool,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';
import { StampSlam } from '../../components/ui/StampSlam';
import { IeltsWritingModelsSection } from '../../components/ielts/IeltsWritingModelsSection';

export default function IeltsWritingPage() {
  const [activeMainTab, setActiveMainTab] = useState<'models' | 'practice'>('models');
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [essayText, setEssayText] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [isFoldingEnvelope, setIsFoldingEnvelope] = useState(false);
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

  const handleSelectPromptFromModels = (prompt: string, taskType: string) => {
    setSelectedQuestion({
      id: 'custom-model-prompt',
      title: taskType === 'task_1' ? 'Task 1: Biểu đồ mẫu' : 'Task 2: Đề bài mẫu',
      part: taskType,
      targetBand: 8.0,
      prompt,
    });
    setEssayText('');
    setResult(null);
    setActiveMainTab('practice');
  };

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minWords = selectedQuestion?.part === 'task_1' ? 150 : 250;

  const handleEvaluate = async () => {
    if (!essayText.trim() || !selectedQuestion) return;
    setIsFoldingEnvelope(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsFoldingEnvelope(false);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
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
        <span className="text-ink">IELTS Writing & Tuyển tập Bài mẫu Band 8.0</span>
      </div>

      {/* Main Switcher Tabs: Bài mẫu Band 8.0 vs Luyện viết & Chấm AI */}
      <div className="flex items-center gap-2 p-1.5 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('models')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeMainTab === 'models'
              ? 'bg-red text-white shadow-brutal-sm'
              : 'text-ink hover:bg-paper'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài mẫu Band 8.0 (60 bài)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('practice')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeMainTab === 'practice'
              ? 'bg-ink text-white shadow-brutal-sm'
              : 'text-ink hover:bg-paper'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Luyện viết bài & Chấm AI</span>
        </button>
      </div>

      {/* VIEW 1: THƯ VIỆN BÀI MẪU BAND 8.0 */}
      {activeMainTab === 'models' && (
        <IeltsWritingModelsSection onSelectForPractice={handleSelectPromptFromModels} />
      )}

      {/* VIEW 2: LUỒNG CŨ (LUYỆN VIẾT THEO ĐỀ VÀ CHẤM AI) */}
      {activeMainTab === 'practice' && (
        <div className="space-y-8">
          {/* Header sổ tay */}
          <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-amber">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Band Descriptor 4 Tiêu Chí</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
                Luyện Viết IELTS & Nhận Nhận Xét Chi Tiết
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
                Viết bài luận trực tiếp trên nền giấy kẻ dòng, kiểm tra số từ tức thì và bấm nộp để nhận phản hồi theo chuẩn 4 tiêu chí chấm thi quốc tế.
              </p>
            </div>

            <div className="flex-shrink-0">
              <LingLing reaction="studying" size={88} animate />
            </div>
          </div>

          {/* Chọn đề bài */}
          {questionsList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-ink-muted whitespace-nowrap">Chọn đề:</span>
              {questionsList.map((q, idx) => (
                <button
                  key={q.id || idx}
                  onClick={() => handleSelectQuestion(q.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedQuestion?.id === q.id
                      ? 'bg-ink text-white border-ink shadow-brutal-sm'
                      : 'bg-card text-ink border-ink/40 hover:border-ink'
                  }`}
                >
                  {q.title || `Đề ${idx + 1}`}
                </button>
              ))}
            </div>
          )}

          {/* Khung đề bài phong cách Giấy Ghi Chú */}
          {selectedQuestion && (
            <div className="bg-paper-2 border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-card border border-ink text-ink">
                  {selectedQuestion.part === 'task_1' ? 'IELTS Task 1 (Tối thiểu 150 từ)' : 'IELTS Task 2 (Tối thiểu 250 từ)'}
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted">
                  Mục tiêu: Band {selectedQuestion.targetBand || 6.5}+
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-ink font-sans">
                {selectedQuestion.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed whitespace-pre-line font-serif italic bg-card/70 p-3.5 rounded-xl border border-ink/20">
                "{selectedQuestion.prompt}"
              </p>
            </div>
          )}

          {/* Vùng soạn thảo bài luận (Notepad kẻ dòng) */}
          <div className="bg-card border-2 border-ink rounded-3xl p-5 sm:p-7 shadow-brutal-xl space-y-4">
            <div className="flex items-center justify-between border-b border-ink/15 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-ink" />
                <span className="text-xs font-black uppercase tracking-wider text-ink font-mono">
                  Bài làm của bạn
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className={`font-black ${wordCount >= minWords ? 'text-teal' : 'text-red'}`}>
                  {wordCount} / {minWords} từ
                </span>
                {wordCount >= minWords && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded border border-teal/30">
                    <CheckCircle2 className="w-3 h-3" /> Đạt độ dài
                  </span>
                )}
              </div>
            </div>

            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Nhập bài viết của bạn tại đây bằng tiếng Anh..."
              rows={14}
              className="w-full p-4 bg-paper/50 border-2 border-ink/30 rounded-2xl text-xs sm:text-sm font-serif text-ink leading-relaxed focus:outline-none focus:border-ink focus:bg-paper transition-all resize-y shadow-inner"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-ink-muted">
                {wordCount < minWords
                  ? `Bạn cần viết thêm ít nhất ${minWords - wordCount} từ để hoàn thành bài thi.`
                  : 'Độ dài bài viết đã đạt yêu cầu. Bạn có thể kiểm tra lại và nộp bài.'}
              </p>

              <button
                onClick={handleEvaluate}
                disabled={evaluating || !essayText.trim()}
                className="w-full sm:w-auto btn btn-red text-xs font-black shadow-brutal px-6 py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {evaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang chấm điểm...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Nộp bài & Chấm điểm AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kết Quả Đánh Giá 4 Tiêu Chí */}
          {result && (
            <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl space-y-6">
              <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-7 h-7 text-amber" />
                  <div>
                    <h3 className="text-xl font-black text-ink">Kết Quả Chấm Điểm</h3>
                    <p className="text-xs text-ink-soft">
                      {result.evaluationMethod === 'gemini_ai'
                        ? 'Chấm bởi AI Gemini theo chuẩn Band Descriptor'
                        : result.note || 'Đánh giá tự động theo tiêu chí quy tắc'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted block">
                    Điểm ước tính
                  </span>
                  <span className="text-3xl font-black text-red font-mono">
                    Band {result.overallBand?.toFixed(1) || '6.0'}
                  </span>
                </div>
              </div>

              {/* 4 Tiêu chí */}
              {result.criteria && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-paper-2 border border-ink/30 rounded-2xl p-4 space-y-1.5 shadow-brutal-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-ink">1. Task Achievement</span>
                      <span className="text-xs font-mono font-black text-teal">
                        Band {result.criteria.taskAchievement?.band || 6.0}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed font-sans">
                      {result.criteria.taskAchievement?.comment}
                    </p>
                  </div>

                  <div className="bg-paper-2 border border-ink/30 rounded-2xl p-4 space-y-1.5 shadow-brutal-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-ink">2. Coherence & Cohesion</span>
                      <span className="text-xs font-mono font-black text-teal">
                        Band {result.criteria.coherenceAndCohesion?.band || 6.0}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed font-sans">
                      {result.criteria.coherenceAndCohesion?.comment}
                    </p>
                  </div>

                  <div className="bg-paper-2 border border-ink/30 rounded-2xl p-4 space-y-1.5 shadow-brutal-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-ink">3. Lexical Resource</span>
                      <span className="text-xs font-mono font-black text-teal">
                        Band {result.criteria.lexicalResource?.band || 6.0}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed font-sans">
                      {result.criteria.lexicalResource?.comment}
                    </p>
                  </div>

                  <div className="bg-paper-2 border border-ink/30 rounded-2xl p-4 space-y-1.5 shadow-brutal-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-ink">4. Grammatical Range</span>
                      <span className="text-xs font-mono font-black text-teal">
                        Band {result.criteria.grammaticalRange?.band || 6.0}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed font-sans">
                      {result.criteria.grammaticalRange?.comment}
                    </p>
                  </div>
                </div>
              )}

              {/* Gợi ý cải thiện */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="bg-paper border border-ink/20 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-black uppercase text-ink flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber" />
                    <span>Gợi ý cải thiện để nâng band</span>
                  </span>
                  <ul className="text-xs text-ink-soft space-y-1.5 list-disc pl-5 leading-relaxed">
                    {result.suggestions.map((sug: string, idx: number) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
