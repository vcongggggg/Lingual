'use client';

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: 'The Power of Habit: Building Consistency in Language Learning',
    topic: 'Thói quen & Tâm lý học',
    level: 'B1',
    readTime: '3 phút đọc',
    paragraphs: [
      'Learning a language is not a sprint; it is an enduring marathon. Most learners believe that studying for five hours over the weekend yields the best results. However, cognitive psychology suggests that small, daily encounters with the target language are profoundly more effective.',
      'When you review vocabulary every morning for just fifteen minutes, your brain strengthens neural pathways through spaced repetition. This gentle routine eliminates burnout and embeds words into your long-term memory permanently.',
      'In conclusion, do not wait for ideal conditions or prolonged free time. Make consistent daily practice your non-negotiable habit.',
    ],
    vocabNotes: [
      { word: 'enduring marathon', mean: 'cuộc chạy đua bền bỉ' },
      { word: 'cognitive psychology', mean: 'tâm lý học nhận thức' },
      { word: 'neural pathways', mean: 'các đường dẫn thần kinh' },
      { word: 'burnout', mean: 'sự kiệt sức, nản lòng' },
    ],
    questions: [
      {
        q: 'What is the most effective way to learn a language according to the text?',
        options: [
          'Studying 5 hours on weekends',
          'Small, daily consistent practice',
          'Waiting for prolonged free time',
          'Memorizing grammar books only',
        ],
        correct: 1,
        explanation: 'Đoạn 1 nêu rõ: cognitive psychology suggests that small, daily encounters are profoundly more effective.',
      },
    ],
  },
];

export default function ReadingPage() {
  const [selectedArticle] = useState(ARTICLES[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-2 border-ink/20">
        <span className="text-xs font-black uppercase tracking-wider text-ink block mb-1">
          Phân hệ 04 · Đọc hiểu sổ tay
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
          Góc Đọc Báo & Bài Luận 📰
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Đọc các bài viết thực tế, tra từ vựng nổi bật và trả lời câu hỏi trắc nghiệm kiểm tra khả năng tiếp thu.
        </p>
      </div>

      {/* Bài Đọc Sổ Tay (Editorial Layout) */}
      <article className="bg-card border-2 border-ink rounded-3xl shadow-brutal-xl p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="amber">{selectedArticle.topic}</Badge>
          <Badge variant="paper">{selectedArticle.level}</Badge>
          <span className="text-xs font-bold text-ink-soft">• {selectedArticle.readTime}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-ink leading-tight">
          {selectedArticle.title}
        </h2>

        {/* Các đoạn văn có dòng kẻ mờ */}
        <div className="space-y-4 text-base sm:text-lg text-ink font-medium leading-relaxed pt-2">
          {selectedArticle.paragraphs.map((p, idx) => (
            <p key={idx} className="border-b border-ink/10 pb-3">
              {p}
            </p>
          ))}
        </div>

        {/* Bảng Chú Giải Từ Vựng Nổi Bật (Glossary) */}
        <div className="mt-8 p-6 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-ink">
            📌 Chú Giải Cụm Từ Nổi Bật Trong Bài:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {selectedArticle.vocabNotes.map((note) => (
              <div key={note.word} className="p-2.5 bg-card rounded-xl border border-ink/20">
                <b className="text-red">{note.word}: </b>
                <span className="text-ink-soft font-semibold">{note.mean}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Câu Hỏi Đọc Hiểu */}
        <div className="mt-10 pt-8 border-t-2 border-ink/20 space-y-6">
          <h3 className="text-xl font-black text-ink flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-red" /> Câu Hỏi Đọc Hiểu
          </h3>

          {selectedArticle.questions.map((qItem, qIdx) => {
            const chosen = selectedAnswers[qIdx];
            const isAnswered = chosen !== undefined;

            return (
              <div key={qIdx} className="space-y-3">
                <p className="text-sm font-bold text-ink">
                  {qIdx + 1}. {qItem.q}
                </p>

                <div className="space-y-2">
                  {qItem.options.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx;
                    const isCorrect = optIdx === qItem.correct;

                    let btnClass = 'bg-paper text-ink border-ink';
                    if (submitted) {
                      if (isCorrect) btnClass = 'bg-teal text-white border-ink font-black';
                      else if (isSelected && !isCorrect) btnClass = 'bg-red text-white border-ink';
                    } else if (isSelected) {
                      btnClass = 'bg-ink text-paper border-ink font-black shadow-brutal-sm';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left px-4 py-3 border-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3 bg-paper-2 rounded-xl border border-ink/20 text-xs font-semibold text-ink-soft">
                    💡 <b>Giải thích: </b>{qItem.explanation}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2">
            {!submitted ? (
              <Button
                variant="red"
                size="md"
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
              >
                Chấm Điểm Đọc Hiểu →
              </Button>
            ) : (
              <Button
                variant="ink"
                size="md"
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAnswers({});
                }}
              >
                Làm lại bài này
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
