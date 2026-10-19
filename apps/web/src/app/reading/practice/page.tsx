'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LingLing } from '../../../components/ui/LingLing';
import { StampSlam } from '../../../components/ui/StampSlam';
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
  Share2,
  Columns,
  X,
  Sparkles
} from 'lucide-react';

interface Paragraph {
  id: number;
  en: string;
  vi: string;
}

interface InlineWordLookup {
  word: string;
  cleanWord: string;
  phonetic: string;
  pos: string;
  meaning: string;
  x?: number;
  y?: number;
}

const INLINE_DICTIONARY: Record<string, { phonetic: string; pos: string; meaning: string }> = {
  millions: { phonetic: '/ˈmɪl.jənz/', pos: 'noun', meaning: 'Hàng triệu' },
  scent: { phonetic: '/sent/', pos: 'noun', meaning: 'Mùi hương, hương thơm thoang thoảng' },
  ground: { phonetic: '/ɡraʊnd/', pos: 'adj', meaning: 'Đã được xay nhuyễn' },
  beverage: { phonetic: '/ˈbev.ər.ɪdʒ/', pos: 'noun', meaning: 'Đồ uống, thức uống' },
  mindful: { phonetic: '/ˈmaɪnd.fəl/', pos: 'adj', meaning: 'Chánh niệm, tỉnh thức, đầy chú tâm' },
  transition: { phonetic: '/trænˈzɪʃ.ən/', pos: 'noun', meaning: 'Bước chuyển giao, sự chuyển đổi' },
  challenges: { phonetic: '/ˈtʃæl.ɪn.dʒɪz/', pos: 'noun', meaning: 'Những thử thách, chông gai' },
  physiological: { phonetic: '/ˌfɪz.i.əˈlɒdʒ.ɪ.kəl/', pos: 'adj', meaning: 'Thuộc về sinh lý học cơ thể' },
  benefits: { phonetic: '/ˈben.ɪ.fɪts/', pos: 'noun', meaning: 'Các lợi ích, tác dụng tích cực' },
  caffeine: { phonetic: '/ˈkæf.iːn/', pos: 'noun', meaning: 'Chất kích thích tự nhiên caffeine' },
  blocks: { phonetic: '/blɒks/', pos: 'verb', meaning: 'Ngăn chặn, phong tỏa' },
  receptors: { phonetic: '/rɪˈsep.tərz/', pos: 'noun', meaning: 'Các thụ thể thần kinh tiếp nhận' },
  alertness: { phonetic: '/əˈlɜːt.nəs/', pos: 'noun', meaning: 'Sự tỉnh táo, cảnh giác, tập trung cao' },
  cognitive: { phonetic: '/ˈkɒɡ.nə.tɪv/', pos: 'adj', meaning: 'Thuộc về nhận thức và tư duy' },
  endurance: { phonetic: '/ɪnˈdʒʊə.rəns/', pos: 'noun', meaning: 'Sức bền bỉ, khả năng chịu đựng dẻo dai' },
  psychologists: { phonetic: '/saɪˈkɒl.ə.dʒɪsts/', pos: 'noun', meaning: 'Các nhà tâm lý học' },
  ritual: { phonetic: '/ˈrɪtʃ.u.əl/', pos: 'noun', meaning: 'Nghi thức, thói quen mang ý nghĩa tinh thần' },
  grinding: { phonetic: '/ˈɡraɪn.dɪŋ/', pos: 'noun / V-ing', meaning: 'Việc xay nhỏ các hạt cà phê' },
  savoring: { phonetic: '/ˈseɪ.vər.ɪŋ/', pos: 'noun / V-ing', meaning: 'Việc nhâm nhi, thưởng thức trọn vẹn' },
  indispensable: { phonetic: '/ˌɪn.dɪˈspen.sə.bəl/', pos: 'adj', meaning: 'Không thể thiếu, vô cùng thiết yếu' },
  anchor: { phonetic: '/ˈæŋ.kər/', pos: 'noun', meaning: 'Điểm tựa, mỏ neo giữ vững tâm trí' },
  habits: { phonetic: '/ˈhæb.ɪts/', pos: 'noun', meaning: 'Các thói quen sinh hoạt' },
  focus: { phonetic: '/ˈfəʊ.kəs/', pos: 'noun / verb', meaning: 'Sự tập trung cao độ' },
};

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
      id: 1,
      en: 'For millions of people around the world, the scent of freshly ground coffee beans is much more than a daily beverage; it is a mindful transition into the quiet challenges of the morning.',
      vi: 'Đối với hàng triệu người trên thế giới, mùi hương của hạt cà phê mới xay không chỉ là một thức uống hàng ngày; đó là một bước chuyển tĩnh lặng bước vào những thử thách của buổi sáng.',
    },
    {
      id: 2,
      en: 'Scientists have long documented the physiological benefits of caffeine, noting how it blocks adenosine receptors in the central nervous system to enhance alertness and cognitive endurance.',
      vi: 'Các nhà khoa học từ lâu đã ghi nhận những lợi ích sinh lý của caffeine, chỉ ra cách nó ngăn chặn các thụ thể adenosine trong hệ thần kinh trung ương để nâng cao sự tỉnh táo và sức bền nhận thức.',
    },
    {
      id: 3,
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
    {
      id: 3,
      question: 'Which word in the text means "essential, absolutely necessary"?',
      options: [
        'A. Indispensable',
        'B. Physiological',
        'C. Mindful',
        'D. Receptors',
      ],
      correctAnswer: 0,
      explanation: 'Từ "indispensable" trong đoạn 3 có nghĩa là không thể thiếu, tuyệt đối cần thiết.',
    },
  ],
};

export default function ReadingPracticePage() {
  const [layoutMode, setLayoutMode] = useState<'two-column' | 'single-column'>('two-column');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [playingParaId, setPlayingParaId] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [lookupPopup, setLookupPopup] = useState<InlineWordLookup | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Tự động đóng popup tra từ khi chạm hoặc bấm ra ngoài vùng popup
  useEffect(() => {
    if (!lookupPopup) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setLookupPopup(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [lookupPopup]);

  // Phát âm toàn bài hoặc đoạn
  const speakParagraph = (text: string, paraId?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (paraId !== undefined && playingParaId === paraId) {
      setPlayingParaId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setPlayingParaId(null);
    utterance.onerror = () => setPlayingParaId(null);
    if (paraId !== undefined) setPlayingParaId(paraId);
    window.speechSynthesis.speak(utterance);
  };

  // Tra nhanh từ khi chạm vào từ bất kỳ
  const handleWordClick = (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return;

    const entry = INLINE_DICTIONARY[clean] || {
      phonetic: `/${clean}/`,
      pos: 'từ vựng',
      meaning: `Mục từ ngữ cảnh: "${rawWord}". Bấm nút loa để nghe phát âm chuẩn.`,
    };

    setLookupPopup({
      word: rawWord,
      cleanWord: clean,
      phonetic: entry.phonetic,
      pos: entry.pos,
      meaning: entry.meaning,
    });
  };

  const playWordAudio = (wordText: string, accent: 'en-US' | 'en-GB' = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(wordText);
    u.lang = accent;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
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
      ? 'text-base sm:text-lg leading-[1.95]'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-[2.1]'
      : 'text-xl sm:text-2xl leading-[2.2]';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 pb-28 sm:pb-20 text-left select-none">
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
        <span className="stamp-badge w-12 h-12 text-[11px] font-black border-2 border-red text-red bg-card shadow-brutal-sm">
          Bậc {ARTICLE_DATA.level}
        </span>
      </div>

      {/* THANH CÔNG CỤ BÁO TƯỜNG (Newspaper Paper Controls Bar) */}
      <div className="bg-card border-2 border-ink rounded-2xl p-3 sm:p-4 shadow-brutal-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút chuyển đổi Báo Tường 2 Cột Song Song */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'two-column' ? 'single-column' : 'two-column')}
            className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              layoutMode === 'two-column'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'bg-paper text-ink hover:bg-paper-2'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-red" />
            <span>{layoutMode === 'two-column' ? 'Báo tường 2 cột song song (EN-VI)' : 'Chỉ xem Tiếng Anh'}</span>
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

        {/* Nút Nghe toàn bài */}
        <button
          onClick={() => speakParagraph(ARTICLE_DATA.paragraphs.map((p) => p.en).join(' '))}
          className="btn btn-paper text-xs sm:text-sm font-black py-2 px-4 shadow-brutal-sm flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-red" />
          <span>Nghe toàn bộ bài báo</span>
        </button>
      </div>

      {/* POPUP TRA TỪ NHANH INLINE (KHI CHẠM VÀO TỪ BẤT KỲ) - TỰ ĐÓNG KHI TAP RA NGOÀI */}
      {lookupPopup && (
        <div ref={popupRef} className="p-4 bg-[#FAF5EB] border-2 border-ink rounded-2xl shadow-brutal-lg space-y-2 relative animate-scale-up">
          <div className="flex items-start justify-between gap-3 border-b border-ink/20 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-ink font-serif">
                  {lookupPopup.word.replace(/[.,!?;:—"']/g, '')}
                </span>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-ink/40 bg-paper">
                  {lookupPopup.pos}
                </span>
                <span className="text-xs font-mono font-bold text-red">
                  {lookupPopup.phonetic}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => playWordAudio(lookupPopup.cleanWord, 'en-US')}
                className="px-2 py-1 rounded border border-ink bg-paper hover:bg-amber text-[11px] font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                title="Phát âm US"
              >
                <Volume2 className="w-3.5 h-3.5 text-red" />
                <span>US</span>
              </button>
              <button
                onClick={() => playWordAudio(lookupPopup.cleanWord, 'en-GB')}
                className="px-2 py-1 rounded border border-ink bg-paper hover:bg-teal/20 text-[11px] font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                title="Phát âm UK"
              >
                <Volume2 className="w-3.5 h-3.5 text-teal" />
                <span>UK</span>
              </button>
              <button
                onClick={() => setLookupPopup(null)}
                className="w-7 h-7 rounded-full border border-ink bg-paper hover:bg-paper-2 flex items-center justify-center text-ink text-xs font-black cursor-pointer ml-1"
                title="Đóng bảng tra từ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm font-bold text-ink leading-relaxed font-sans">
            <span className="text-teal font-black">Nghĩa: </span>
            {lookupPopup.meaning}
          </p>
          <span className="text-[10px] text-ink-muted italic block">
            💡 Mẹo: Chạm vào bất kỳ từ nào trên bài báo để xem phiên âm và nghe phát âm tức thì mà không cần chuyển trang.
          </span>
        </div>
      )}

      {/* TỜ BÁO IN (NEWSPAPER PAPER LAYOUT — 2 CỘT SONG SONG EN - VI) */}
      <article className="card-paper p-6 sm:p-10 space-y-8 shadow-brutal-xl relative overflow-hidden bg-card border-2 border-ink">
        {/* Header tờ báo cổ điển */}
        <div className="border-b-2 border-ink pb-6 space-y-3 text-center">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-muted flex items-center justify-center gap-2">
            <span>{ARTICLE_DATA.author}</span>
            <span>·</span>
            <span>{ARTICLE_DATA.date}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-ink leading-tight tracking-tight">
            {ARTICLE_DATA.title}
          </h1>

          <p className="text-base sm:text-lg font-serif italic text-teal max-w-2xl mx-auto">
            &ldquo;{ARTICLE_DATA.vietnameseTitle}&rdquo;
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

        {/* NỘI DUNG 2 CỘT SONG SONG TỪNG ĐOẠN (EN - VI) */}
        <div className="space-y-8">
          {ARTICLE_DATA.paragraphs.map((para, idx) => {
            const isPlayingThis = playingParaId === para.id;

            return (
              <div
                key={para.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                  isPlayingThis
                    ? 'border-red bg-amber/10 shadow-brutal-sm'
                    : 'border-ink/20 hover:border-ink/60 bg-paper/60'
                }`}
              >
                {/* Thanh điều khiển trên từng đoạn: Đoạn số X + Loa riêng */}
                <div className="flex items-center justify-between border-b border-ink/15 pb-2 mb-3">
                  <span className="text-[11px] font-mono font-black text-red uppercase tracking-wider">
                    Đoạn {idx + 1}
                  </span>

                  <button
                    onClick={() => speakParagraph(para.en, para.id)}
                    className={`px-2.5 py-1 rounded-lg border border-ink text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-red text-white shadow-brutal-sm'
                        : 'bg-paper text-ink hover:bg-amber'
                    }`}
                    title="Nghe riêng đoạn này"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingThis ? 'Đang đọc đoạn này...' : 'Nghe đoạn này'}</span>
                  </button>
                </div>

                {layoutMode === 'two-column' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* CỘT TRÁI: TIẾNG ANH (CÓ TỪ CHẠM ĐƯỢC ĐỂ TRA inline) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-ink-muted tracking-wider block">
                        Bản ngữ Tiếng Anh (Chạm từ để tra nhanh):
                      </span>
                      <p className={`${fontClass} text-ink font-serif font-normal`}>
                        {idx === 0 && (
                          <span className="float-left text-4xl sm:text-5xl font-black font-serif leading-none pr-3 pt-1 text-ink">
                            {para.en.charAt(0)}
                          </span>
                        )}
                        {/* Tách từng từ để người dùng chạm vào tra cứu inline */}
                        {(idx === 0 ? para.en.slice(1) : para.en)
                          .split(/(\s+)/)
                          .map((token, tIdx) => {
                            if (/^\s+$/.test(token)) {
                              return <span key={tIdx}>{token}</span>;
                            }
                            return (
                              <span
                                key={tIdx}
                                onClick={() => handleWordClick(token)}
                                className="cursor-pointer hover:bg-amber/40 hover:text-red rounded px-0.5 transition-colors underline decoration-dotted decoration-ink/30"
                                title="Chạm để tra nhanh từ này"
                              >
                                {token}
                              </span>
                            );
                          })}
                      </p>
                    </div>

                    {/* CỘT PHẢI: BẢN DỊCH TIẾNG VIỆT SONG SONG */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l-2 border-ink/20 pt-3 md:pt-0 md:pl-6">
                      <span className="text-[10px] font-black uppercase text-teal tracking-wider block font-sans">
                        Bản dịch Tiếng Việt song song:
                      </span>
                      <p className={`${fontClass} text-ink font-sans font-medium text-ink-soft leading-relaxed`}>
                        {para.vi}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* CHẾ ĐỘ CHỈ TIẾNG ANH */
                  <div className="space-y-2">
                    <p className={`${fontClass} text-ink font-serif font-normal`}>
                      {idx === 0 && (
                        <span className="float-left text-4xl sm:text-5xl font-black font-serif leading-none pr-3 pt-1 text-ink">
                          {para.en.charAt(0)}
                        </span>
                      )}
                      {(idx === 0 ? para.en.slice(1) : para.en)
                        .split(/(\s+)/)
                        .map((token, tIdx) => {
                          if (/^\s+$/.test(token)) return <span key={tIdx}>{token}</span>;
                          return (
                            <span
                              key={tIdx}
                              onClick={() => handleWordClick(token)}
                              className="cursor-pointer hover:bg-amber/40 hover:text-red rounded px-0.5 transition-colors underline decoration-dotted decoration-ink/30"
                              title="Chạm để tra nhanh từ này"
                            >
                              {token}
                            </span>
                          );
                        })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Kết bài báo có con dấu biên tập */}
        <div className="border-t-2 border-ink/20 pt-4 flex items-center justify-between text-xs font-bold text-ink-muted">
          <span>Biên tập: Ban Biên tập Báo tường Lingual Journal</span>
          <span>Hết bài báo</span>
        </div>
      </article>

      {/* CÂU HỎI ĐỌC HIỂU (QUIZ 3 CÂU TRẮC NGHIỆM + ĐÓNG DẤU ĐIỂM) */}
      <div className="card-paper p-6 sm:p-8 space-y-6 shadow-brutal-lg text-left bg-card border-2 border-ink rounded-3xl">
        <div className="border-b-2 border-ink/20 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-ink font-serif">
              Bài tập đọc hiểu bài báo
            </h3>
            <p className="text-xs text-ink-soft">Chọn đáp án đúng nhất dựa trên nội dung bài viết vừa đọc.</p>
          </div>
          <span className="px-3 py-1 bg-paper-2 border border-ink rounded-lg text-xs font-black text-teal font-mono">
            3 câu hỏi
          </span>
        </div>

        {ARTICLE_DATA.questions.map((q, qIndex) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div key={q.id} className="space-y-3 pb-5 border-b border-ink/15 last:border-b-0">
              <h4 className="text-base font-black text-ink font-sans">
                Câu {qIndex + 1}: {q.question}
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, optIndex) => {
                  let btnStyle = 'bg-card border-2 border-ink text-ink hover:bg-paper-2';
                  if (userAns === optIndex) {
                    btnStyle = 'bg-ink text-paper border-2 border-ink shadow-brutal-sm font-black';
                  }

                  if (quizSubmitted) {
                    if (optIndex === q.correctAnswer) {
                      btnStyle = 'bg-teal/20 border-2 border-teal text-teal font-black shadow-brutal-sm';
                    } else if (userAns === optIndex && !isCorrect) {
                      btnStyle = 'bg-red/15 border-2 border-red text-red line-through';
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
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

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          {quizSubmitted ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <LingLing
                  reaction={correctCount === 3 ? 'thumbsup' : 'thinking'}
                  size={58}
                  bubbleText={correctCount === 3 ? 'Đọc hiểu xuất sắc!' : 'Hãy đọc kỹ lại nhé!'}
                />

                <StampSlam
                  text="KẾT QUẢ"
                  subtext={`${correctCount} / 3 Điểm Đọc Hiểu`}
                  variant="badge"
                  color={correctCount === 3 ? 'teal' : 'red'}
                  size="md"
                />
              </div>

              <div className="flex items-center gap-2">
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
                <Link href="/reading" className="btn btn-ink text-xs font-black shadow-brutal">
                  Khám phá bài khác →
                </Link>
              </div>
            </div>
          ) : (
            <Button
              variant="red"
              size="md"
              onClick={handleSubmitQuiz}
              disabled={!isAllAnswered}
              className="shadow-brutal w-full sm:w-auto"
            >
              Kiểm tra đáp án & Đóng dấu điểm →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
