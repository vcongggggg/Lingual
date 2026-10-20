'use client';

import React, { useEffect, useState } from 'react';
import { X, Volume2, BookOpen, Bookmark, Check, Plus, Sparkles, Layers } from 'lucide-react';
import { api } from '../../lib/api';
import { LibraryWordData } from './LibraryCatalogCard';

export interface WordLookupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  word: string | LibraryWordData | null;
}

// Fallback lookup dictionary for instant zero-latency responses
const BUILTIN_VOCAB: Record<string, Partial<LibraryWordData>> = {
  apple: {
    targetText: 'apple',
    phonetic: "/'æpl/",
    partOfSpeech: 'noun',
    cefrLevel: 'A1',
    translation: 'quả táo, cây táo',
    exampleSentence: 'She ate a crisp red apple for breakfast.',
    exampleTranslation: 'Cô ấy đã ăn một quả táo đỏ giòn cho bữa sáng.',
  },
  morning: {
    targetText: 'morning',
    phonetic: "/'mɔ:niŋ/",
    partOfSpeech: 'noun',
    cefrLevel: 'A1',
    translation: 'buổi sáng, ban mai',
    exampleSentence: 'Good morning! Have a wonderful day ahead.',
    exampleTranslation: 'Chào buổi sáng! Chúc bạn một ngày mới tuyệt vời.',
  },
  water: {
    targetText: 'water',
    phonetic: "/'wɔ:tər/",
    partOfSpeech: 'noun',
    cefrLevel: 'A1',
    translation: 'nước, dòng nước',
    exampleSentence: 'Drink plenty of fresh water every day.',
    exampleTranslation: 'Hãy uống nhiều nước lọc mỗi ngày.',
  },
  family: {
    targetText: 'family',
    phonetic: "/'fæmɪli/",
    partOfSpeech: 'noun',
    cefrLevel: 'A1',
    translation: 'gia đình, tổ ấm',
    exampleSentence: 'Family is the most important thing in life.',
    exampleTranslation: 'Gia đình là điều quan trọng nhất trong cuộc đời.',
  },
  happy: {
    targetText: 'happy',
    phonetic: "/'hæpi/",
    partOfSpeech: 'adjective',
    cefrLevel: 'A1',
    translation: 'hạnh phúc, vui sướng',
    exampleSentence: 'They were very happy to see their old teacher.',
    exampleTranslation: 'Họ rất vui khi được gặp lại người thầy giáo cũ.',
  },
  journey: {
    targetText: 'journey',
    phonetic: "/'dʒɜ:ni/",
    partOfSpeech: 'noun',
    cefrLevel: 'A2',
    translation: 'hành trình, chuyến đi',
    exampleSentence: 'A journey of a thousand miles begins with a single step.',
    exampleTranslation: 'Hành trình vạn dặm bắt đầu từ một bước chân.',
  },
  weather: {
    targetText: 'weather',
    phonetic: "/'weðər/",
    partOfSpeech: 'noun',
    cefrLevel: 'A2',
    translation: 'thời tiết, khí hậu',
    exampleSentence: 'The weather in Da Nang is sunny and pleasant today.',
    exampleTranslation: 'Thời tiết ở Đà Nẵng hôm nay có nắng và rất dễ chịu.',
  },
  recipe: {
    targetText: 'recipe',
    phonetic: "/'resəpi/",
    partOfSpeech: 'noun',
    cefrLevel: 'A2',
    translation: 'công thức nấu ăn, bí quyết',
    exampleSentence: 'This traditional pho recipe has been passed down for generations.',
    exampleTranslation: 'Công thức nấu phở truyền thống này được truyền qua nhiều thế hệ.',
  },
  schedule: {
    targetText: 'schedule',
    phonetic: "/'ʃedju:l/",
    partOfSpeech: 'noun',
    cefrLevel: 'A2',
    translation: 'lịch trình, thời gian biểu',
    exampleSentence: 'We strictly follow the study schedule every evening.',
    exampleTranslation: 'Chúng tôi nghiêm túc tuân thủ lịch học mỗi buổi tối.',
  },
  luggage: {
    targetText: 'luggage',
    phonetic: "/'lʌɡɪdʒ/",
    partOfSpeech: 'noun',
    cefrLevel: 'A2',
    translation: 'hành lý (khi đi du lịch)',
    exampleSentence: 'Please do not leave your luggage unattended.',
    exampleTranslation: 'Xin vui lòng không để hành lý của bạn mà không trông coi.',
  },
  perseverance: {
    targetText: 'perseverance',
    phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    translation: 'sự kiên trì, lòng bền bỉ, quyết tâm vượt khó',
    exampleSentence: 'Perseverance is key to mastering any foreign language.',
    exampleTranslation: 'Kiên trì là chìa khóa để làm chủ bất kỳ ngoại ngữ nào.',
  },
  attitude: {
    targetText: 'attitude',
    phonetic: "/'ætɪtju:d/",
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    translation: 'thái độ, quan điểm sống',
    exampleSentence: 'A positive attitude makes learning much easier.',
    exampleTranslation: 'Một thái độ tích cực giúp việc học trở nên dễ dàng hơn nhiều.',
  },
  challenge: {
    targetText: 'challenge',
    phonetic: "/'tʃælɪndʒ/",
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    translation: 'thử thách, điều khó khăn',
    exampleSentence: 'Treat every mistake as an exciting learning challenge.',
    exampleTranslation: 'Hãy xem mỗi lỗi sai như một thử thách học hỏi thú vị.',
  },
  solution: {
    targetText: 'solution',
    phonetic: "/sə'lu:ʃn/",
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    translation: 'giải pháp, cách giải quyết',
    exampleSentence: 'They found an innovative solution to the traffic problem.',
    exampleTranslation: 'Họ đã tìm ra một giải pháp sáng tạo cho vấn đề giao thông.',
  },
  community: {
    targetText: 'community',
    phonetic: "/kə'mju:nəti/",
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    translation: 'cộng đồng, tập thể',
    exampleSentence: 'Joining an active English community boosts confidence.',
    exampleTranslation: 'Tham gia một cộng đồng tiếng Anh năng động giúp tăng sự tự tin.',
  },
  inevitable: {
    targetText: 'inevitable',
    phonetic: "/ɪn'evɪtəbl/",
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    translation: 'không thể tránh khỏi, tất yếu',
    exampleSentence: 'Change is inevitable in the era of artificial intelligence.',
    exampleTranslation: 'Sự thay đổi là điều tất yếu trong kỷ nguyên trí tuệ nhân tạo.',
  },
  significant: {
    targetText: 'significant',
    phonetic: "/sɪɡ'nɪfɪkənt/",
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    translation: 'đáng kể, có ý nghĩa quan trọng',
    exampleSentence: 'There was a significant improvement in her IELTS band score.',
    exampleTranslation: 'Đã có sự tiến bộ đáng kể trong điểm số thi IELTS của cô ấy.',
  },
  subsequent: {
    targetText: 'subsequent',
    phonetic: "/'sʌbsɪkwənt/",
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    translation: 'xảy ra sau đó, tiếp theo',
    exampleSentence: 'Subsequent experiments confirmed the original theory.',
    exampleTranslation: 'Các thí nghiệm tiếp theo đã xác nhận lý thuyết ban đầu.',
  },
  hypothesis: {
    targetText: 'hypothesis',
    phonetic: "/haɪ'pɒθəsɪs/",
    partOfSpeech: 'noun',
    cefrLevel: 'B2',
    translation: 'giả thuyết khoa học',
    exampleSentence: 'The scientists formulated a clear hypothesis before testing.',
    exampleTranslation: 'Các nhà khoa học đã xây dựng một giả thuyết rõ ràng trước khi thử nghiệm.',
  },
  collaborate: {
    targetText: 'collaborate',
    phonetic: "/kə'læbəreɪt/",
    partOfSpeech: 'verb',
    cefrLevel: 'B2',
    translation: 'hợp tác, phối hợp làm việc',
    exampleSentence: 'Students collaborate on group presentations every week.',
    exampleTranslation: 'Học sinh hợp tác làm bài thuyết trình nhóm mỗi tuần.',
  },
  ubiquitous: {
    targetText: 'ubiquitous',
    phonetic: "/ju:'bɪkwɪtəs/",
    partOfSpeech: 'adjective',
    cefrLevel: 'C1',
    translation: 'có mặt ở khắp nơi, phổ biến rộng rãi',
    exampleSentence: 'Smartphones have become ubiquitous in modern daily life.',
    exampleTranslation: 'Điện thoại thông minh đã trở nên hiện diện ở khắp mọi nơi trong đời sống hiện đại.',
  },
  resilience: {
    targetText: 'resilience',
    phonetic: "/rɪ'zɪliəns/",
    partOfSpeech: 'noun',
    cefrLevel: 'C1',
    translation: 'khả năng phục hồi, tính kiên cường',
    exampleSentence: 'Her extraordinary resilience inspired the entire community.',
    exampleTranslation: 'Sự kiên cường phi thường của cô ấy đã truyền cảm hứng cho cả cộng đồng.',
  },
  paradigm: {
    targetText: 'paradigm',
    phonetic: "/'pærədaɪm/",
    partOfSpeech: 'noun',
    cefrLevel: 'C1',
    translation: 'mô thức, hệ hình tư duy mẫu mực',
    exampleSentence: 'This research represents a fundamental shift in educational paradigm.',
    exampleTranslation: 'Nghiên cứu này đại diện cho một bước chuyển dịch căn bản trong hệ hình giáo dục.',
  },
  ephemeral: {
    targetText: 'ephemeral',
    phonetic: "/ɪ'femərəl/",
    partOfSpeech: 'adjective',
    cefrLevel: 'C1',
    translation: 'phù du, chóng tàn, ngắn ngủi',
    exampleSentence: 'Fame on social media is often ephemeral and unpredictable.',
    exampleTranslation: 'Danh vọng trên mạng xã hội thường chóng vánh và khó đoán.',
  },
  eloquent: {
    targetText: 'eloquent',
    phonetic: "/'eləkwənt/",
    partOfSpeech: 'adjective',
    cefrLevel: 'C1',
    translation: 'hùng biện, lưu loát, truyền cảm',
    exampleSentence: 'The advocate delivered an eloquent speech defending human rights.',
    exampleTranslation: 'Luật sư đã có một bài phát biểu hùng hồn bảo vệ nhân quyền.',
  },
  serendipity: {
    targetText: 'serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    partOfSpeech: 'noun',
    cefrLevel: 'C1',
    translation: 'sự may mắn bất ngờ, cơ duyên tình cờ tìm thấy điều tốt đẹp',
    exampleSentence: 'Finding this peaceful bookstore was pure serendipity on a rainy afternoon.',
    exampleTranslation: 'Tình cờ tìm thấy hiệu sách yên bình này vào một chiều mưa thật là một cơ duyên may mắn.',
  },
  fluctuation: {
    targetText: 'fluctuation',
    phonetic: '/ˌflʌk.tʃuˈeɪ.ʃən/',
    partOfSpeech: 'noun',
    cefrLevel: 'B2',
    translation: 'sự dao động, biến động thất thường',
    exampleSentence: 'The chart illustrates the sharp fluctuation in currency exchange rates.',
    exampleTranslation: 'Biểu đồ minh họa sự biến động mạnh mẽ của tỷ giá ngoại hối.',
  },
  deteriorate: {
    targetText: 'deteriorate',
    phonetic: '/dɪˈtɪə.ri.ə.reɪt/',
    partOfSpeech: 'verb',
    cefrLevel: 'B2',
    translation: 'xấu đi, suy giảm chất lượng, tồi tệ hơn',
    exampleSentence: 'Air quality in the industrial district continued to deteriorate.',
    exampleTranslation: 'Chất lượng không khí ở khu công nghiệp tiếp tục xấu đi.',
  },
  substantial: {
    targetText: 'substantial',
    phonetic: '/səbˈstæn.ʃəl/',
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    translation: 'đáng kể, có giá trị hoặc số lượng lớn',
    exampleSentence: 'We have made substantial progress in our daily vocabulary retention.',
    exampleTranslation: 'Chúng tôi đã có những tiến bộ đáng kể trong việc ghi nhớ từ vựng hằng ngày.',
  },
};

export function WordLookupDrawer({ isOpen, onClose, word }: WordLookupDrawerProps) {
  const [data, setData] = useState<Partial<LibraryWordData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [playingAccent, setPlayingAccent] = useState<'US' | 'UK' | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load word details
  useEffect(() => {
    if (!isOpen || !word) {
      setData(null);
      setAdded(false);
      return;
    }

    if (typeof word === 'object') {
      setData(word);
      return;
    }

    const wordStr = word.trim();
    const lowerKey = wordStr.toLowerCase();

    // 1. Check instant built-in dictionary
    if (BUILTIN_VOCAB[lowerKey]) {
      setData(BUILTIN_VOCAB[lowerKey]);
    } else {
      setData({
        targetText: wordStr,
        translation: 'Đang tải giải nghĩa chi tiết...',
        phonetic: `/${wordStr.toLowerCase()}/`,
        cefrLevel: 'B1',
        partOfSpeech: 'word',
      });
    }

    // 2. Fetch live data from backend dictionary API
    setLoading(true);
    api
      .searchDictionary({ q: wordStr, limit: 1 })
      .then((res) => {
        if (res.words && res.words.length > 0) {
          const matched = res.words[0];
          setData((prev) => ({
            ...prev,
            id: matched.id,
            targetText: matched.targetText || wordStr,
            translation: matched.translation || prev?.translation || 'Từ vựng tiếng Anh',
            phonetic: matched.phonetic || prev?.phonetic,
            cefrLevel: matched.cefrLevel || prev?.cefrLevel || 'B1',
            partOfSpeech: matched.partOfSpeech || prev?.partOfSpeech || 'noun',
            exampleSentence: matched.exampleSentence || prev?.exampleSentence,
            exampleTranslation: matched.exampleTranslation || prev?.exampleTranslation,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, word]);

  const playAudio = (text: string, accent: 'US' | 'UK') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setPlayingAccent(accent);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
    utterance.rate = 0.88;
    utterance.onend = () => setPlayingAccent(null);
    utterance.onerror = () => setPlayingAccent(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleAddToSrs = async () => {
    if (!data?.targetText) return;
    setAdded(true);
    try {
      await api.addSrsWord({
        targetText: data.targetText,
        translation: data.translation || data.targetText,
        phonetic: data.phonetic,
        exampleSentence: data.exampleSentence,
        cefrLevel: data.cefrLevel,
      });
    } catch {}
  };

  if (!isOpen || !word) return null;

  const targetText = data?.targetText || (typeof word === 'string' ? word : word.targetText);
  const phonetic = data?.phonetic || `/${targetText.toLowerCase()}/`;
  const translation = data?.translation || 'Từ vựng tiếng Anh thông dụng';
  const cefr = data?.cefrLevel || 'B1';
  const pos = data?.partOfSpeech || 'noun';
  const example = data?.exampleSentence;
  const exampleVi = data?.exampleTranslation;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ngăn kéo từ điển: ${targetText}`}
      data-testid="word-lookup-drawer"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-[2px] animate-in fade-in duration-150 cursor-pointer"
    >
      {/* Backdrop overlay (click to close) */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        data-testid="drawer-backdrop"
        aria-hidden="true"
      />

      {/* Drawer / Popup container (slight slide up, brutalist paper notebook styling) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full sm:max-w-xl bg-[#FAF5EB] border-t-2 sm:border-2 border-ink rounded-t-3xl sm:rounded-3xl shadow-brutal-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto text-left animate-in slide-in-from-bottom-6 duration-200 select-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #211A13 0.6px, transparent 0.6px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Header Ngăn Kéo Thư Viện */}
        <div className="bg-[#F0E6D2] border-b-2 border-ink px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red border border-ink animate-pulse" />
            <span className="text-xs font-mono font-black text-ink uppercase tracking-wider flex items-center gap-1.5">
              <span>🗄️ Ngăn Kéo Từ Điển</span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded border border-ink/40 bg-paper text-teal">
                MỤC LỤC TRA NHANH
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-testid="close-drawer-btn"
            className="w-8 h-8 rounded-full border-2 border-ink bg-paper flex items-center justify-center shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-ink hover:text-red cursor-pointer"
            aria-label="Đóng ngăn kéo tra từ"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Nội dung chi tiết tra từ */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Mục từ Hero */}
          <div className="border-b-2 border-ink/15 pb-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-3xl sm:text-4xl font-black text-ink font-serif tracking-tight">
                {targetText}
              </h2>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded border border-ink bg-paper text-ink">
                  {pos}
                </span>
                <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded border border-teal bg-teal/10 text-teal">
                  Bậc {cefr}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base sm:text-lg font-mono font-bold text-red tracking-wide">
                {phonetic}
              </span>
              {loading && (
                <span className="text-[10px] font-mono text-ink-muted animate-pulse">
                  (Đang đồng bộ DB...)
                </span>
              )}
            </div>
          </div>

          {/* Hàng nút phát âm US / UK chuẩn */}
          <div className="bg-[#F4ECE1] border-2 border-ink rounded-2xl p-4 shadow-brutal-sm space-y-2">
            <div className="text-[11px] font-mono font-black uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-teal" />
              <span>Phát âm mẫu bản xứ:</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => playAudio(targetText, 'US')}
                data-testid="audio-us-btn"
                className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-ink bg-card text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer hover:bg-amber/30 ${
                  playingAccent === 'US' ? 'ring-2 ring-red bg-amber' : ''
                }`}
                title="Phát âm giọng Mỹ (US)"
              >
                <Volume2 className="w-4 h-4 text-red" />
                <span>Phát âm US (Mỹ)</span>
              </button>

              <button
                type="button"
                onClick={() => playAudio(targetText, 'UK')}
                data-testid="audio-uk-btn"
                className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-ink bg-card text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer hover:bg-teal/20 ${
                  playingAccent === 'UK' ? 'ring-2 ring-teal bg-teal/20' : ''
                }`}
                title="Phát âm giọng Anh (UK)"
              >
                <Volume2 className="w-4 h-4 text-teal" />
                <span>Phát âm UK (Anh)</span>
              </button>
            </div>
          </div>

          {/* Nghĩa tiếng Việt */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-red" />
              <span>Định nghĩa & Nghĩa tiếng Việt:</span>
            </div>

            <div className="bg-card border-2 border-ink rounded-2xl p-4 shadow-brutal-sm">
              <p className="text-base sm:text-lg font-bold text-ink leading-relaxed font-sans">
                {translation}
              </p>
            </div>
          </div>

          {/* Ví dụ ngữ cảnh nếu có */}
          {example && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber" />
                <span>Ví dụ ngữ cảnh thực tế:</span>
              </div>

              <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 shadow-brutal-sm space-y-1.5">
                <p className="text-sm font-semibold text-ink italic font-serif">
                  "{example}"
                </p>
                {exampleVi && (
                  <p className="text-xs text-ink-soft font-sans font-medium">
                    → {exampleVi}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Các nút hành động */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleAddToSrs}
              disabled={added}
              className={`w-full sm:flex-1 py-3 px-4 rounded-xl border-2 border-ink font-black text-sm shadow-brutal transition-all flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? 'bg-teal/20 text-teal border-teal cursor-default'
                  : 'bg-red text-paper hover:bg-red-dark active:translate-y-0.5'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Đã lưu vào Sổ từ SRS</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Lưu vào Thẻ Ôn Tập SRS (+15 XP)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl border-2 border-ink bg-card text-ink font-black text-sm shadow-brutal hover:bg-paper-2 active:translate-y-0.5 transition-all cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
