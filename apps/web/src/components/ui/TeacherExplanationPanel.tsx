'use client';

import React, { useState } from 'react';
import { Volume2, CheckCircle2, ArrowRight, BookOpen, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export interface ParaphrasePair {
  questionKeyword: string;
  passageKeyword: string;
}

export interface TeacherExplanationData {
  step1QuestionIntent: string; // ① Hiểu câu hỏi
  step2Paraphrases: ParaphrasePair[]; // ② Từ khóa paraphrase
  step3EvidenceSnippet: string; // ③ Đối chiếu bằng chứng (trích transcript)
  step3EvidenceAudioText?: string;
  step4AnswerReasoning: string; // ④ Đáp án & giải thích
  correctAnswer: string;
}

interface TeacherExplanationPanelProps {
  data: TeacherExplanationData;
  className?: string;
  defaultExpanded?: boolean;
}

// Kiểu chữ viết tay như bút tích mực đỏ của cô giáo
const handwritingStyle: React.CSSProperties = {
  fontFamily: "'Caveat', 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive",
  fontSize: '15px',
  lineHeight: '1.6',
};

export const TeacherExplanationPanel: React.FC<TeacherExplanationPanelProps> = ({
  data,
  className = '',
  defaultExpanded = false,
}) => {
  // THU GỌN MẶC ĐỊNH (BẤM "Xem cô chữa" MỚI MỞ)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayEvidence = () => {
    const textToPlay = data.step3EvidenceAudioText || data.step3EvidenceSnippet;
    if (!textToPlay) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToPlay);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trạng thái thu gọn mặc định
  if (!isExpanded) {
    return (
      <div className={`text-left ${className}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full p-3.5 bg-paper hover:bg-card border-2 border-dashed border-red rounded-2xl text-left flex items-center justify-between gap-3 shadow-brutal-sm cursor-pointer transition-all group active:translate-y-0.5"
          title="Bấm để mở lời cô giáo chữa bài 4 bước"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-red/10 border border-red text-red flex items-center justify-center text-sm font-black flex-shrink-0">
              ✍️
            </span>
            <div>
              <span className="text-xs font-black text-red uppercase tracking-wider block font-serif">
                Xem cô chữa (4 bước lề vở mực đỏ) ✍️
              </span>
              <span className="text-[11px] text-ink-soft font-medium block">
                Bấm mở: Hiểu đề bài · Từ khóa Paraphrase · Bằng chứng transcript · Phân tích chọn đáp án
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-black text-red group-hover:translate-x-1 transition-transform flex items-center gap-1 flex-shrink-0 bg-paper-2 px-2.5 py-1 rounded border border-ink/20">
            <span>Xem cô chữa</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border-l-4 border-red bg-paper p-5 sm:p-6 rounded-r-2xl border-2 border-l-0 border-ink shadow-brutal-sm relative space-y-4 text-left animate-in fade-in ${className}`}
    >
      {/* Tape strip decor with teacher header & collapse button */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-red font-black text-sm">✍️</span>
          <span className="text-xs font-black uppercase tracking-wider text-red font-serif italic">
            Lời cô giáo chữa bài (Bút tích mực đỏ)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-ink-muted uppercase bg-paper-2 border border-ink/30 px-2 py-0.5 rounded">
            4 Bước giải đề
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-[11px] font-mono font-black text-red hover:text-ink flex items-center gap-1 cursor-pointer bg-card border border-ink/30 px-2 py-0.5 rounded shadow-sm"
            title="Thu gọn lời cô giáo"
          >
            <span>Thu gọn lời cô</span>
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4 Bước Chữa Bài Tuần Tự (Font Viết Tay Cho Bước Giải) */}
      <div className="space-y-4">
        {/* Bước ①: Hiểu câu hỏi */}
        <div
          style={{ animationDelay: '0ms' }}
          className="animate-message-slide space-y-1 bg-card/90 p-3.5 rounded-xl border border-ink/15"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink">
            <span className="w-5 h-5 rounded-full bg-red text-white flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0">
              ①
            </span>
            <span>Hiểu câu hỏi:</span>
          </div>
          <p
            style={handwritingStyle}
            className="text-ink font-semibold pl-7 leading-relaxed"
          >
            {data.step1QuestionIntent}
          </p>
        </div>

        {/* Bước ②: Từ khóa paraphrase */}
        <div
          style={{ animationDelay: '150ms' }}
          className="animate-message-slide space-y-2 bg-card/90 p-3.5 rounded-xl border border-ink/15"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink">
            <span className="w-5 h-5 rounded-full bg-red text-white flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0">
              ②
            </span>
            <span>Từ khóa tương đương (Paraphrase):</span>
          </div>
          <div className="pl-7 space-y-1.5">
            {data.step2Paraphrases.map((pair, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono font-black text-ink-soft bg-paper-2/70 px-2.5 py-1 rounded border border-ink/20 flex-wrap"
              >
                <span className="text-ink underline decoration-dashed">{pair.questionKeyword}</span>
                <span className="text-red font-sans">➔</span>
                <span className="text-teal underline font-black">{pair.passageKeyword}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bước ③: Bằng chứng văn bản */}
        <div
          style={{ animationDelay: '300ms' }}
          className="animate-message-slide space-y-2 bg-card/90 p-3.5 rounded-xl border border-ink/15"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink">
              <span className="w-5 h-5 rounded-full bg-red text-white flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0">
                ③
              </span>
              <span>Đối chiếu bằng chứng (Trích dẫn văn bản):</span>
            </div>

            {/* Nút nghe lại đoạn audio chứng cứ */}
            <button
              onClick={handlePlayEvidence}
              className={`px-2.5 py-1 rounded-lg border border-ink text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                isPlayingAudio
                  ? 'bg-red text-white animate-pulse'
                  : 'bg-card text-ink hover:bg-paper active:scale-95'
              }`}
              title="Bấm để nghe đoạn chứng cứ bản xứ"
            >
              <Volume2 className="w-3.5 h-3.5 text-current" />
              <span>{isPlayingAudio ? 'Đang phát chứng cứ...' : 'Nghe lại đoạn chứng cứ 🔊'}</span>
            </button>
          </div>

          <div className="pl-7">
            <blockquote
              style={handwritingStyle}
              className="border-l-2 border-red pl-3 text-red font-bold leading-relaxed bg-paper/60 p-2 rounded-r"
            >
              &ldquo;{data.step3EvidenceSnippet}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Bước ④: Đáp án */}
        <div
          style={{ animationDelay: '450ms' }}
          className="animate-message-slide space-y-1.5 bg-teal/10 p-3.5 rounded-xl border border-teal/40"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal">
              <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0">
                ④
              </span>
              <span>Đáp án chính xác & phân tích:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-teal text-white font-mono font-black text-xs shadow-brutal-sm">
              {data.correctAnswer}
            </span>
          </div>
          <p
            style={handwritingStyle}
            className="text-ink font-semibold pl-7 leading-relaxed"
          >
            {data.step4AnswerReasoning}
          </p>
        </div>
      </div>
    </div>
  );
};
