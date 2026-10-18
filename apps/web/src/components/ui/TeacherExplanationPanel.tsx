'use client';

import React, { useState } from 'react';
import { Volume2, CheckCircle2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

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
}

export const TeacherExplanationPanel: React.FC<TeacherExplanationPanelProps> = ({
  data,
  className = '',
}) => {
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

  return (
    <div
      className={`border-l-4 border-red bg-paper p-5 sm:p-6 rounded-r-2xl border-2 border-l-0 border-ink shadow-brutal-sm relative space-y-4 text-left ${className}`}
    >
      {/* Tape strip decor with teacher header */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-red font-black text-sm">✍️</span>
          <span className="text-xs font-black uppercase tracking-wider text-red font-serif italic">
            Lời cô giáo chữa bài (Bút tích mực đỏ)
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-ink-muted uppercase bg-paper-2 border border-ink/30 px-2 py-0.5 rounded">
          4 Bước giải đề
        </span>
      </div>

      {/* 4 Bước Chữa Bài Tuần Tự (Stagger 150ms) */}
      <div className="space-y-4">
        {/* Bước ①: Hiểu câu hỏi */}
        <div
          style={{ animationDelay: '0ms' }}
          className="animate-message-slide space-y-1 bg-card/80 p-3.5 rounded-xl border border-ink/15"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink">
            <span className="w-5 h-5 rounded-full bg-red text-white flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0">
              ①
            </span>
            <span>Hiểu câu hỏi:</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-ink leading-relaxed pl-7 font-sans">
            {data.step1QuestionIntent}
          </p>
        </div>

        {/* Bước ②: Từ khóa paraphrase */}
        <div
          style={{ animationDelay: '150ms' }}
          className="animate-message-slide space-y-2 bg-card/80 p-3.5 rounded-xl border border-ink/15"
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

        {/* Bước ③: Đối chiếu bằng chứng (Trích transcript) */}
        <div
          style={{ animationDelay: '300ms' }}
          className="animate-message-slide space-y-2 bg-amber-soft/80 p-3.5 rounded-xl border border-ink/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-ink">
              <span className="w-5 h-5 rounded-full bg-red text-white flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0">
                ③
              </span>
              <span>Đối chiếu bằng chứng (Trích văn bản gốc):</span>
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
            <blockquote className="border-l-2 border-red pl-3 text-xs sm:text-sm font-serif italic text-red font-bold leading-relaxed bg-paper/60 p-2 rounded-r">
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
              <span>Đáp án chính xác:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-teal text-white font-mono font-black text-xs shadow-brutal-sm">
              {data.correctAnswer}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed pl-7 font-sans">
            {data.step4AnswerReasoning}
          </p>
        </div>
      </div>
    </div>
  );
};
