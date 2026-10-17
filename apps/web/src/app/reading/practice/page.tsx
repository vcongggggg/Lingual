'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Type, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

interface Paragraph {
  en: string;
  vi: string;
}

const ARTICLE_DATA = {
  title: 'The Art of the Morning Coffee: How a Simple Habit Ignites Focus',
  vietnameseTitle: 'Nghệ thuật thưởng thức cà phê sáng: Thói quen kích hoạt sự tập trung',
  level: 'A2',
  date: '17 Tháng 10, 2026',
  author: 'Lingual Journal · Chuyên mục Đời Sống',
  readTime: '2 phút đọc',
  wordCount: 165,
  paragraphs: [
    {
      en: 'For millions of people around the world, the scent of freshly ground coffee beans is much more than a daily beverage; it is a mindful transition into the quiet challenges of the morning.',
      vi: 'Đối với hàng triệu người trên thế giới, mùi hương của hạt cà phê mới xay không chỉ là một thức uống hàng ngày; đó là một bước chuyển tĩnh lặng bước vào những thử thách của buổi sáng.',
    },
    {
      en: 'Scientists have long documented the physiological benefits of caffeine, noting how it blocks adenosine receptors in the central nervous system to enhance alertness and cognitive endurance.',
      vi: 'Các nhà khoa học từ lâu đã ghi nhận những lợi ích sinh lý của caffeine, chỉ ra cách nó ngăn chặn các thụ thể adenosine trong hệ thần kinh trung ương để nâng cao sự tỉnh táo và sức bền nhận thức.',
    },
    {
      en: 'However, psychologists suggest that the ritual itself — grinding the beans, watching the hot water drip, and savoring the steam — creates an indispensable psychological anchor before the noise of the day begins.',
      vi: 'Tuy nhiên, các nhà tâm lý học cho rằng chính nghi thức này — xay hạt, ngắm nhìn giọt nước nóng nhỏ giọt và tận hưởng làn hơi ấm — tạo nên một điểm tựa tâm lý không thể thiếu trước khi sự ồn ào của ngày mới bắt đầu.',
    },
  ],
  questions: [
    {
      id: 1,
      question: 'What do psychologists believe is the key benefit of the coffee ritual?',
      options: [
        'A. It completely replaces the need for sleep.',
        'B. It creates an indispensable psychological anchor before daily noise begins.',
        'C. It speeds up digestion immediately.',
        'D. It cools down body temperature.',
      ],
      correctAnswer: 1,
      explanation: 'Đoạn 3 chỉ rõ: "psychologists suggest that the ritual itself ... creates an indispensable psychological anchor before the noise of the day begins."',
    },
    {
      id: 2,
      question: 'How does caffeine enhance alertness according to the article?',
      options: [
        'A. By blocking adenosine receptors in the central nervous system.',
        'B. By increasing sweet cravings.',
        'C. By lowering heart rate rapidly.',
        'D. By causing instant deep sleep.',
      ],
      correctAnswer: 0,
      explanation: 'Đoạn 2 ghi rõ: "it blocks adenosine receptors in the central nervous system to enhance alertness."',
    },
  ],
};

export default function ReadingPracticePage() {
  const [showBilingual, setShowBilingual] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleToggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const fullText = ARTICLE_DATA.paragraphs.map((p) => p.en).join(' ');
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (!quizSubmitted) {
      setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    }
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const isAllAnswered = ARTICLE_DATA.questions.every((q) => selectedAnswers[q.id] !== undefined);
  const correctCount = ARTICLE_DATA.questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length;

  const fontClass =
    fontSize === 'normal'
      ? 'text-base sm:text-lg leading-[2]'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-[2.1]'
      : 'text-xl sm:text-2xl leading-[2.2]';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 pb-28 sm:pb-20">
      {/* Breadcrumb mực */}
      <div className="flex items-center justify-between">
        <Link
          href="/reading"
          className="inline-flex items-center gap-2 text-sm font-black text-ink hover:text-red transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Thư viện bài đọc</span>
        </Link>

        {/* Stamp CEFR */}
        <span className="stamp-badge w-12 h-12 text-[11px] font-black border-2 border-red text-red bg-card">
          {ARTICLE_DATA.level}
        </span>
      </div>

      {/* Thanh công cụ giấy phía trên (Paper Controls Bar) */}
      <div className="bg-card border-2 border-ink rounded-2xl p-3 sm:p-4 shadow-brutal-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Nút bật/tắt song ngữ */}
          <button
            onClick={() => setShowBilingual(!showBilingual)}
            className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              showBilingual ? 'bg-teal text-white shadow-brutal-sm' : 'bg-paper text-ink hover:bg-paper-2'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showBilingual ? 'Đang hiện song ngữ' : 'Chỉ tiếng Anh'}</span>
          </button>

          {/* Nút cỡ chữ Aa */}
          <div className="flex items-center gap-1 bg-paper-2 border-2 border-ink rounded-xl p-0.5 shadow-brutal-sm">
            {(['normal', 'large', 'xlarge'] as const).map((s, idx) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  fontSize === s ? 'bg-ink text-paper' : 'text-ink hover:text-red'
                }`}
                title="Thay đổi cỡ chữ"
              >
                {idx === 0 ? 'Aa' : idx === 1 ? 'Aa+' : 'Aa++'}
              </button>
            ))}
          </div>
        </div>

        {/* Nút Nghe bài đọc */}
        <button
          onClick={handleToggleAudio}
          className={`btn text-xs sm:text-sm font-black py-2 px-4 shadow-brutal-sm ${
            isPlayingAudio ? 'btn-red' : 'btn-paper'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Dừng đọc audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-red" />
              <span>Nghe bài đọc</span>
            </>
          )}
        </button>
      </div>

      {/* Thanh tiến độ đọc dạng vạch mực mỏng */}
      <div className="w-full bg-paper-2 border border-ink/30 h-1.5 rounded-full overflow-hidden">
        <div className="bg-teal h-full w-2/3 transition-all" />
      </div>

      {/* TỜ GIẤY BÁO IN (Newspaper Paper Layout) */}
      <article className="card-paper p-6 sm:p-12 space-y-6 shadow-brutal-xl relative overflow-hidden bg-card">
        {/* Header tờ báo */}
        <div className="border-b-2 border-ink pb-6 space-y-3 text-center">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">
            {ARTICLE_DATA.author} · {ARTICLE_DATA.date}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-ink leading-tight">
            {ARTICLE_DATA.title}
          </h1>

          <p className="text-sm sm:text-base font-bold text-teal italic max-w-2xl mx-auto">
            {ARTICLE_DATA.vietnameseTitle}
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-bold text-ink-soft pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal" />
              {ARTICLE_DATA.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-ink-muted" />
              {ARTICLE_DATA.wordCount} từ vựng
            </span>
          </div>
        </div>

        {/* Nội dung bài báo font Serif giãn dòng rộng */}
        <div className="space-y-6 text-left font-serif text-ink">
          {ARTICLE_DATA.paragraphs.map((para, idx) => (
            <div key={idx} className="space-y-2">
              <p className={`${fontClass} text-ink tracking-normal font-normal`}>
                {idx === 0 && (
                  <span className="float-left text-5xl font-black font-serif leading-none pr-3 pt-1 text-ink">
                    {para.en.charAt(0)}
                  </span>
                )}
                {idx === 0 ? para.en.slice(1) : para.en}
              </p>

              {/* Lời dịch song ngữ nếu được bật */}
              {showBilingual && (
                <p className="text-sm font-sans font-semibold text-ink-soft italic bg-paper-2 border-l-3 border-teal pl-3 py-1 rounded-r-md">
                  {para.vi}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Kết bài báo có con dấu biên tập */}
        <div className="border-t-2 border-ink/20 pt-4 flex items-center justify-between text-xs font-bold text-ink-muted">
          <span>Biên tập: Lingual Language Editorial Team</span>
          <span>Hết bài đọc</span>
        </div>
      </article>

      {/* Câu Hỏi Đọc Hiểu (Quiz dạng Card Giấy với Options) */}
      <div className="card-paper p-6 sm:p-8 space-y-6 shadow-brutal-lg text-left">
        <div className="border-b-2 border-ink/20 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-ink">
              Bài tập đọc hiểu bài báo
            </h3>
            <p className="text-xs text-ink-soft">Chọn đáp án đúng nhất dựa trên nội dung bài viết vừa đọc.</p>
          </div>
          <span className="px-3 py-1 bg-paper-2 border border-ink rounded-lg text-xs font-black text-teal">
            2 câu hỏi
          </span>
        </div>

        {ARTICLE_DATA.questions.map((q, qIndex) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div key={q.id} className="space-y-3 pb-4 border-b border-ink/10 last:border-b-0">
              <h4 className="text-base font-black text-ink">
                Câu {qIndex + 1}: {q.question}
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, optIndex) => {
                  let btnStyle = 'bg-card border-2 border-ink text-ink hover:bg-paper-2';
                  if (userAns === optIndex) {
                    btnStyle = 'bg-ink text-paper border-2 border-ink shadow-brutal-sm';
                  }

                  if (quizSubmitted) {
                    if (optIndex === q.correctAnswer) {
                      btnStyle = 'bg-amber/20 border-2 border-teal text-teal font-black';
                    } else if (userAns === optIndex && !isCorrect) {
                      btnStyle = 'bg-red/15 border-2 border-red text-red line-through';
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className={`p-3 rounded-xl text-xs font-bold border ${isCorrect ? 'bg-teal/10 border-teal text-teal' : 'bg-red/10 border-red text-red'}`}>
                  {isCorrect ? '✓ Chính xác! ' : '✗ Chưa chính xác. '}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
          {quizSubmitted ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-ink">
                Kết quả: <b className="text-red">{correctCount} / {ARTICLE_DATA.questions.length}</b> câu đúng
              </span>
              <Button
                variant="paper"
                size="sm"
                onClick={() => {
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
              >
                Làm lại quiz
              </Button>
            </div>
          ) : (
            <Button
              variant="red"
              size="md"
              onClick={handleSubmitQuiz}
              disabled={!isAllAnswered}
              className="shadow-brutal"
            >
              Kiểm tra đáp án →
            </Button>
          )}

          <Link href="/reading" className="text-xs font-black text-red hover:underline">
            ← Đọc thêm bài báo khác
          </Link>
        </div>
      </div>
    </div>
  );
}
