'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  FileText, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface StepData {
  stepNum: number;
  stepName: string;
  headline: string;
  vietnameseHeadline: string;
  minWords: number;
  stickyHint: string;
  sampleConnectors: string[];
}

const STEPS: StepData[] = [
  {
    stepNum: 1,
    stepName: 'Bước 1/3 · Mở bài',
    headline: 'Introduce the Topic: Should Students Have Part-time Jobs?',
    vietnameseHeadline: 'Đề tài: Học sinh, sinh viên có nên làm thêm công việc bán thời gian không?',
    minWords: 20,
    stickyHint: 'Mở đầu bằng việc khẳng định làm thêm là một chủ đề phổ biến. Dùng cấu trúc: "Nowadays, an increasing number of students choose to take part-time jobs..." và nêu quan điểm của bạn.',
    sampleConnectors: ['Nowadays', 'It is widely believed that', 'In my opinion', 'From my perspective'],
  },
  {
    stepNum: 2,
    stepName: 'Bước 2/3 · Thân bài',
    headline: 'Provide 2 Key Arguments with Examples',
    vietnameseHeadline: 'Đưa ra 2 luận điểm chính kèm ví dụ thực tế (kỹ năng mềm & quản lý tài chính)',
    minWords: 40,
    stickyHint: 'Trình bày lý do thứ nhất: "Firstly, working part-time equips young people with essential soft skills like teamwork and communication." Sau đó bổ sung lý do thứ hai bằng: "Furthermore, it helps them appreciate the value of money."',
    sampleConnectors: ['Firstly', 'Furthermore', 'For instance', 'In addition', 'Consequently'],
  },
  {
    stepNum: 3,
    stepName: 'Bước 3/3 · Kết bài',
    headline: 'Summarize Your Thesis & Future Advice',
    vietnameseHeadline: 'Tóm tắt lại quan điểm và đưa ra lời khuyên cân bằng giữa học và làm',
    minWords: 20,
    stickyHint: 'Dùng cụm kết bài kinh điển: "In conclusion, although part-time jobs offer valuable real-world experience, students must prioritize their academic studies to avoid burnout."',
    sampleConnectors: ['In conclusion', 'To sum up', 'Overall', 'Ultimately'],
  },
];

export default function WritingPracticePage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<number, string>>({
    0: 'Nowadays, taking a part-time job has become a popular choice among university students. In my perspective, this experience brings more benefits than drawbacks.',
    1: '',
    2: '',
  });
  const [evaluation, setEvaluation] = useState<{
    grammarPassed: boolean;
    feedback: string;
    lexicalScore: number;
  } | null>(null);

  const step = STEPS[currentStepIdx];
  const currentText = inputs[currentStepIdx] || '';
  const currentWordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

  const wordProgress = Math.min(100, Math.round((currentWordCount / step.minWords) * 100));

  // Tính độ phong phú từ vựng (Lexical Diversity)
  const uniqueWords = new Set(
    currentText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
  );
  const lexicalDiversity =
    currentWordCount > 0 ? Math.min(100, Math.round((uniqueWords.size / currentWordCount) * 100)) : 0;

  const handleTextChange = (val: string) => {
    setInputs((prev) => ({ ...prev, [currentStepIdx]: val }));
    setEvaluation(null);
  };

  const handleNextStep = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      setEvaluation(null);
    } else {
      // Hoàn thành cả 3 bước -> chấm điểm toàn bài
      setEvaluation({
        grammarPassed: true,
        feedback: 'Bài viết có bố cục 3 phần rất mạch lạc! Cấu trúc câu tự nhiên, vốn từ học thuật phong phú và sử dụng từ nối nhuần nhuyễn.',
        lexicalScore: 92,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      setEvaluation(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 text-left pb-28 sm:pb-20">
      {/* Breadcrumb mực */}
      <div className="flex items-center justify-between">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Phòng Luyện Viết</span>
        </Link>

        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-red uppercase tracking-wider">
          Viết theo hướng dẫn · Guided Essay
        </span>
      </div>

      {/* "Bước 1/3" Dạng Tab Số Trang Sổ Tay */}
      <div className="flex items-center gap-2 border-b-2 border-ink pb-2 overflow-x-auto">
        {STEPS.map((s, idx) => (
          <button
            key={s.stepNum}
            onClick={() => setCurrentStepIdx(idx)}
            className={`px-4 py-2 rounded-t-xl border-2 border-b-0 border-ink font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              idx === currentStepIdx
                ? 'bg-card text-ink shadow-brutal-sm -translate-y-1'
                : 'bg-paper-2 text-ink-muted hover:bg-paper'
            }`}
          >
            {s.stepName}
          </button>
        ))}
      </div>

      {/* Khối Đề Bài & Headline Mực */}
      <div className="card-paper p-6 sm:p-8 space-y-3 shadow-brutal-lg relative bg-card">
        <span className="text-[11px] font-black uppercase tracking-wider text-teal block">
          Nhiệm vụ phần viết:
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-ink font-serif tracking-tight">
          {step.headline}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-ink-soft italic">
          {step.vietnameseHeadline}
        </p>

        {/* Từ nối gợi ý dạng Chip */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-ink-muted mr-1">Từ nối khuyên dùng:</span>
          {step.sampleConnectors.map((c) => (
            <button
              key={c}
              onClick={() => handleTextChange(currentText ? `${currentText} ${c}` : c)}
              className="px-2 py-0.5 bg-paper-2 hover:bg-amber-soft border border-ink rounded text-[11px] font-bold text-ink transition-colors cursor-pointer"
            >
              +{c}
            </button>
          ))}
        </div>
      </div>

      {/* Gợi Ý Dạng Giấy Note Vàng Dán (Sticky Note Yellow) */}
      <div className="sticky-note-yellow p-5 sm:p-6 text-left space-y-2 mt-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-ink fill-ink" />
          <h4 className="text-sm font-black uppercase tracking-wider text-ink">
            Gợi ý dàn ý sổ tay:
          </h4>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed">
          {step.stickyHint}
        </p>
      </div>

      {/* Ô Viết Bài Là Giấy Kẻ Dòng (Lined Paper) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-ink block">
            Phần bài viết của bạn:
          </label>
          {/* Word count ghi ở lề */}
          <span className="px-2.5 py-1 bg-paper-2 border border-ink rounded-lg font-mono text-xs font-black text-ink shadow-brutal-sm">
            {currentWordCount} / {step.minWords} từ
          </span>
        </div>

        <textarea
          rows={6}
          value={currentText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Đặt bút viết câu tiếng Anh của bạn tại đây..."
          className="w-full lined-paper border-2 border-ink rounded-2xl p-5 text-base sm:text-lg font-bold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal resize-none"
        />

        {/* 2 Thanh Chỉ Số Mực: Tiến độ số từ & Độ phong phú từ vựng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Thanh Tiến độ số từ */}
          <div className="bg-card border-2 border-ink rounded-xl p-3 shadow-brutal-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-ink">
              <span>Tiến độ số từ</span>
              <span className={wordProgress >= 100 ? 'text-teal font-extrabold' : 'text-red'}>
                {wordProgress}% (Tối thiểu {step.minWords} từ)
              </span>
            </div>
            <div className="ink-progress-track">
              <div
                className={`ink-progress-fill ${wordProgress >= 100 ? 'bg-teal' : 'bg-red'}`}
                style={{ width: `${wordProgress}%` }}
              />
            </div>
          </div>

          {/* Thanh Độ phong phú từ vựng */}
          <div className="bg-card border-2 border-ink rounded-xl p-3 shadow-brutal-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-ink">
              <span>Độ phong phú từ vựng</span>
              <span className="text-ink font-extrabold">{lexicalDiversity}%</span>
            </div>
            <div className="ink-progress-track">
              <div
                className="ink-progress-fill bg-amber"
                style={{ width: `${lexicalDiversity}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nút Điều Hướng "Bước trước" / "Bước tiếp theo" Dạng Nút Giấy */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="paper"
          size="md"
          onClick={handlePrevStep}
          disabled={currentStepIdx === 0}
          className="shadow-brutal"
        >
          ← Bước trước
        </Button>

        <Button
          variant="red"
          size="lg"
          onClick={handleNextStep}
          disabled={currentWordCount < 5}
          className="shadow-brutal"
        >
          {currentStepIdx === STEPS.length - 1 ? 'Hoàn thành bài viết ✓' : 'Bước tiếp theo →'}
        </Button>
      </div>

      {/* Đánh Giá Toàn Bài Khi Hoàn Thành */}
      {evaluation && (
        <div className="card-paper p-6 sm:p-8 space-y-4 shadow-brutal-xl border-teal bg-amber/15 text-left animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <LingLing reaction="greet" size={80} />
            <div>
              <h3 className="text-xl font-black text-ink">
                Chúc mừng bạn đã hoàn thành bài luận!
              </h3>
              <p className="text-xs font-bold text-ink-soft">
                Điểm phong phú từ vựng & cấu trúc: <b className="text-red text-sm">{evaluation.lexicalScore}/100</b>
              </p>
            </div>
          </div>

          <div className="p-4 bg-card border-2 border-ink rounded-xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal block">
              Nhận xét của trợ lý biên tập:
            </span>
            <p className="text-sm font-bold text-ink leading-relaxed">
              {evaluation.feedback}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <Link href="/writing" className="btn btn-ink text-xs font-black py-2 px-4">
              Về phòng luyện viết →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
