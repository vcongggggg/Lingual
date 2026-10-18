'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import { TeacherExplanationPanel } from '../../../../components/ui/TeacherExplanationPanel';

export default function IeltsReadingPracticePage() {
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ raw: number; total: number; band: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback demo passage if offline
  const FALLBACK_READING = {
    id: 'fallback-ielts-r1',
    title: 'The Engineering Marvel of Roman Aqueducts',
    part: 'passage_1',
    targetBand: 6.5,
    passageText: `Paragraph A
The Aqua Appia, constructed in 312 BC by censor Appius Claudius Caecus, marked the beginning of Rome's monumental hydraulic engineering legacy. While popular imagination envisions aqueducts primarily as majestic arched stone bridges striding across valleys, over 80 percent of the total 800-kilometer empire-wide network was buried subterranean conduits.

Paragraph B
Roman engineers (aquarii) utilized specialized levelling instruments, most notably the chorobates—a wooden bench-like device 20 feet long with plumb lines and water channels—to calculate infinitesimal downhill gradients, often less than 1 in 1,000. This gravity-fed design ensured steady water velocity without hydraulic erosion or stagnant siltation.

Paragraph C
Water from aqueducts fed three critical destinations: public fountains (lacus) for common domestic consumption, opulent thermal baths (thermae) that served as centers of civic socialization, and private villas of patrician families who paid a specialized water tax (vectigal). The distribution was strictly regulated by the curator aquarum to maintain equilibrium during seasonal droughts.`,
    contentParsed: {
      questions: [
        {
          id: 'r_q1',
          type: 'multiple_choice',
          prompt: '1. What percentage of the Roman aqueduct network was constructed as underground conduits?',
          options: ['Less than 20 percent', 'Approximately 50 percent', 'Over 80 percent', '100 percent'],
          correctAnswer: 'Over 80 percent',
          explanation: 'Paragraph A states: "over 80 percent of the total 800-kilometer empire-wide network was buried subterranean conduits."',
          step1QuestionIntent: 'Tìm tỷ lệ phần trăm (percentage) hệ thống cống dẫn nước La Mã được xây dựng ngầm dưới lòng đất.',
          step2Paraphrases: [
            { questionKeyword: 'constructed as underground conduits', passageKeyword: 'buried subterranean conduits' },
          ],
          step3EvidenceSnippet: 'Paragraph A: "...over 80 percent of the total 800-kilometer empire-wide network was buried subterranean conduits."',
          step3EvidenceAudioText: 'Over 80 percent of the total 800-kilometer empire-wide network was buried subterranean conduits.',
          step4AnswerReasoning: 'Cụm từ "buried subterranean conduits" đồng nghĩa với "underground conduits", với tỷ lệ rõ ràng là "over 80 percent".',
        },
        {
          id: 'r_q2',
          type: 'multiple_choice',
          prompt: '2. Which instrument was used by Roman engineers to calculate precise gradients?',
          options: ['The astrolabe', 'The chorobates', 'The sextant', 'The magnetic compass'],
          correctAnswer: 'The chorobates',
          explanation: 'Paragraph B notes: "specialized levelling instruments, most notably the chorobates—a wooden bench-like device 20 feet long."',
          step1QuestionIntent: 'Xác định tên thiết bị (instrument) được các kỹ sư La Mã dùng để đo độ dốc chính xác của đường ống nước.',
          step2Paraphrases: [
            { questionKeyword: 'instrument to calculate precise gradients', passageKeyword: 'specialized levelling instruments, most notably the chorobates' },
          ],
          step3EvidenceSnippet: 'Paragraph B: "...specialized levelling instruments, most notably the chorobates—a wooden bench-like device 20 feet long."',
          step3EvidenceAudioText: 'Specialized levelling instruments, most notably the chorobates, a wooden bench-like device 20 feet long.',
          step4AnswerReasoning: 'Tác giả nêu đích danh "chorobates" là công cụ đo độ thăng bằng và độ dốc tiêu chuẩn của các kỹ sư La Mã.',
        },
        {
          id: 'r_q3',
          type: 'multiple_choice',
          prompt: '3. What did wealthy patrician families pay for private water access?',
          options: ['A tithe of grain', 'A specialized water tax (vectigal)', 'No payment was required', 'A annual civic labor duty'],
          correctAnswer: 'A specialized water tax (vectigal)',
          explanation: 'Paragraph C explains: "private villas of patrician families who paid a specialized water tax (vectigal)."',
          step1QuestionIntent: 'Tìm khoản chi phí hoặc hình thức thanh toán mà các gia đình quý tộc (patrician) phải trả để được cấp nước riêng vào biệt thự.',
          step2Paraphrases: [
            { questionKeyword: 'pay for private water access', passageKeyword: 'paid a specialized water tax (vectigal)' },
          ],
          step3EvidenceSnippet: 'Paragraph C: "...private villas of patrician families who paid a specialized water tax (vectigal)."',
          step3EvidenceAudioText: 'Private villas of patrician families who paid a specialized water tax, known as vectigal.',
          step4AnswerReasoning: 'Thuật ngữ chính xác được bài đọc nhắc đến là "a specialized water tax (vectigal)".',
        },
      ],
    },
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getIeltsPracticeQuestions('reading');
        if (res.success && res.questions && res.questions.length > 0) {
          setQuestionsList(res.questions);
          const detailRes = await api.getIeltsQuestionDetail(res.questions[0].id);
          if (detailRes.success && detailRes.question) {
            setSelectedQuestion(detailRes.question);
          } else {
            setSelectedQuestion(FALLBACK_READING);
          }
        } else {
          setQuestionsList([FALLBACK_READING]);
          setSelectedQuestion(FALLBACK_READING);
        }
      } catch {
        setQuestionsList([FALLBACK_READING]);
        setSelectedQuestion(FALLBACK_READING);
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
      const res = await api.getIeltsQuestionDetail(qId);
      if (res.success && res.question) {
        setSelectedQuestion(res.question);
      }
    } catch {
      setSelectedQuestion(FALLBACK_READING);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (qId: string, value: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: value }));
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 pb-28 sm:pb-20 text-left">
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
        <span className="text-ink">Luyện đọc 2 cột</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/20">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal block mb-1">
            Bài đọc 2 cột chuẩn thi thật
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            {selectedQuestion?.title || 'IELTS Reading 2-Column Practice'}
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
              Đoạn {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* BỐ CỤC 2 CỘT: TRÁI BÀI ĐỌC KIỂU "TỜ BÁO", PHẢI CÂU HỎI CARD GIẤY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: BÀI ĐỌC KIỂU TỜ BÁO IN (7 CỘT) */}
        <div className="lg:col-span-7 card-paper p-6 sm:p-8 space-y-6 bg-paper shadow-brutal-lg">
          {/* Header Tờ Báo: Stamp CEFR + Ngày xuất bản */}
          <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted">
              IELTS ACADEMIC READING PASSAGE
            </span>
            <span className="px-2.5 py-0.5 rounded border border-ink bg-paper-2 font-mono text-xs font-black text-teal">
              Mục tiêu Band {selectedQuestion?.targetBand || '6.5'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-serif leading-tight">
            {selectedQuestion?.title}
          </h2>

          <div className="h-0.5 w-16 bg-red" />

          {/* Nội dung bài đọc format kiểu báo in */}
          <div className="text-base sm:text-lg text-ink leading-relaxed space-y-5 font-serif font-normal">
            {(selectedQuestion?.passageText || FALLBACK_READING.passageText)
              .split('\n\n')
              .map((para: string, pIdx: number) => (
                <p key={pIdx} className="first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                  {para}
                </p>
              ))}
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG CÂU HỎI DẠNG CARD GIẤY (5 CỘT) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-paper p-6 sm:p-7 space-y-6 bg-card shadow-brutal-lg">
            <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                  Bảng câu hỏi
                </span>
                <h3 className="text-lg font-black text-ink font-sans">
                  Chọn đáp án đúng
                </h3>
              </div>
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full border border-ink bg-paper-2 text-ink">
                {Object.keys(userAnswers).length} / {questions.length} câu
              </span>
            </div>

            {/* Danh sách câu hỏi */}
            <div className="space-y-5">
              {questions.map((q: any, qIdx: number) => {
                const isCorrect = submitted && userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                const isWrong = submitted && !isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      submitted
                        ? isCorrect
                          ? 'border-teal bg-teal/5'
                          : 'border-red bg-red/5'
                        : 'border-ink bg-paper-2'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <p className="text-sm font-black text-ink leading-snug font-sans">
                        {q.prompt}
                      </p>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options?.map((opt: string) => {
                          const isSelected = userAnswers[q.id] === opt;
                          const isOptCorrect = submitted && opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                          return (
                            <button
                              key={opt}
                              disabled={submitted}
                              onClick={() => handleAnswerSelect(q.id, opt)}
                              className={`w-full p-2.5 rounded-lg border text-left text-xs font-bold transition-all cursor-pointer ${
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

                      {/* Explanation: Lời cô giáo chữa bài 4 bước */}
                      {submitted && (
                        <div className="pt-3">
                          <TeacherExplanationPanel
                            data={{
                              step1QuestionIntent:
                                q.step1QuestionIntent ||
                                `Xác định thông tin trả lời cho câu hỏi: "${q.prompt.replace(/^\d+\.\s*/, '')}"`,
                              step2Paraphrases: q.step2Paraphrases || [
                                { questionKeyword: 'Từ khóa trong câu hỏi', passageKeyword: q.correctAnswer },
                              ],
                              step3EvidenceSnippet:
                                q.step3EvidenceSnippet ||
                                q.explanation ||
                                'Đoạn văn trích dẫn chứa bằng chứng cho câu trả lời.',
                              step3EvidenceAudioText: q.step3EvidenceAudioText || q.step3EvidenceSnippet || q.explanation,
                              step4AnswerReasoning:
                                q.step4AnswerReasoning ||
                                `Phương án chính xác là "${q.correctAnswer}". Đã được đối chiếu khớp với văn bản.`,
                              correctAnswer: q.correctAnswer,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nút nộp bài / kết quả */}
            {!submitted ? (
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="w-full btn btn-red text-sm font-black shadow-brutal disabled:opacity-50"
                >
                  Nộp bài chấm điểm →
                </button>
              </div>
            ) : (
              <div className="p-5 bg-paper-2 border-2 border-ink rounded-xl space-y-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal/10 border border-teal text-teal text-xs font-black">
                  <Award className="w-4 h-4" />
                  <span>Kết Quả Đọc Hiểu</span>
                </div>

                <div className="flex items-center justify-around">
                  <div>
                    <span className="text-[11px] font-black uppercase text-ink-muted block">Số câu đúng</span>
                    <span className="text-2xl font-black font-mono text-ink">
                      {scoreResult?.raw} / {scoreResult?.total}
                    </span>
                  </div>
                  <div className="h-8 w-0.5 bg-ink/20" />
                  <div>
                    <span className="text-[11px] font-black uppercase text-ink-muted block">Band ước tính</span>
                    <span className="text-2xl font-black font-mono text-red">
                      Band {scoreResult?.band.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswers({});
                      setScoreResult(null);
                    }}
                    className="btn btn-paper text-xs font-black"
                  >
                    Làm lại
                  </button>
                  <Link href="/ielts" className="btn btn-ink text-xs font-black">
                    Về trung tâm
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
