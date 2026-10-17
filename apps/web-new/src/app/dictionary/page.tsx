'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Volume2,
  Plus,
  Check,
  Bookmark,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';

interface WordItem {
  id: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  cefrLevel: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  isBookmarked?: boolean;
}

const CEFR_LEVELS = ['Tất cả', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const PARTS_OF_SPEECH = [
  { value: 'all', label: 'Tất cả từ loại' },
  { value: 'noun', label: 'Danh từ (Noun)' },
  { value: 'verb', label: 'Động từ (Verb)' },
  { value: 'adjective', label: 'Tính từ (Adj)' },
  { value: 'adverb', label: 'Phó từ (Adv)' },
];

const DEFAULT_FEATURED_WORD: WordItem = {
  id: 'word-serendipity',
  targetText: 'Serendipity',
  phonetic: '/ˌser.ənˈdɪp.ə.ti/',
  cefrLevel: 'C1',
  partOfSpeech: 'noun',
  translation: 'Sự may mắn bất ngờ, khả năng tình cờ tìm thấy những điều tươi đẹp.',
  exampleSentence: 'Finding this peaceful bookstore was pure serendipity on a rainy afternoon.',
  exampleTranslation: 'Tình cờ tìm thấy hiệu sách yên bình này vào một chiều mưa thật là một sự may mắn kỳ diệu.',
};

const SAMPLE_WORDS: WordItem[] = [
  {
    id: 'w-1',
    targetText: 'Perseverance',
    phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
    cefrLevel: 'B2',
    partOfSpeech: 'noun',
    translation: 'Sự kiên trì, lòng bền bỉ, quyết tâm vượt qua mọi khó khăn thử thách.',
    exampleSentence: 'Success in language learning requires patience and perseverance.',
    exampleTranslation: 'Thành công trong việc học ngoại ngữ đòi hỏi sự kiên nhẫn và lòng kiên trì bền bỉ.',
  },
  {
    id: 'w-2',
    targetText: 'Substantial',
    phonetic: '/səbˈstæn.ʃəl/',
    cefrLevel: 'B2',
    partOfSpeech: 'adjective',
    translation: 'Đáng kể, quan trọng, có số lượng lớn hoặc có giá trị thật sự.',
    exampleSentence: 'We have made substantial progress in our daily vocabulary retention.',
    exampleTranslation: 'Chúng ta đã đạt được tiến bộ đáng kể trong việc ghi nhớ từ vựng mỗi ngày.',
  },
  {
    id: 'w-3',
    targetText: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    cefrLevel: 'C1',
    partOfSpeech: 'adjective',
    translation: 'Hùng biện, lưu loát, có tài ăn nói thuyết phục và truyền cảm.',
    exampleSentence: 'Her eloquent explanation helped the students grasp the grammar rule quickly.',
    exampleTranslation: 'Lời giải thích lưu loát của cô ấy đã giúp học sinh nắm bắt quy tắc ngữ pháp một cách nhanh chóng.',
  },
  {
    id: 'w-4',
    targetText: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    cefrLevel: 'B2',
    partOfSpeech: 'adjective',
    translation: 'Kiên cường, có khả năng phục hồi nhanh chóng sau khó khăn.',
    exampleSentence: 'He remained resilient despite facing numerous academic setbacks.',
    exampleTranslation: 'Anh ấy vẫn luôn kiên cường dù phải đối mặt với nhiều trở ngại học tập.',
  },
  {
    id: 'w-5',
    targetText: 'Cognitive',
    phonetic: '/ˈkɒɡ.nə.tɪv/',
    cefrLevel: 'B2',
    partOfSpeech: 'adjective',
    translation: 'Thuộc về nhận thức, khả năng tư duy và xử lý thông tin của não bộ.',
    exampleSentence: 'Bilingualism has been shown to boost cognitive flexibility in adults.',
    exampleTranslation: 'Việc biết hai ngôn ngữ đã được chứng minh là giúp nâng cao sự linh hoạt trong nhận thức ở người trưởng thành.',
  },
  {
    id: 'w-6',
    targetText: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    cefrLevel: 'C1',
    partOfSpeech: 'adjective',
    translation: 'Thực dụng, mang tính thực tiễn, giải quyết vấn đề dựa trên thực tế.',
    exampleSentence: 'We need a pragmatic approach to improve speaking fluency without fear of errors.',
    exampleTranslation: 'Chúng ta cần một hướng tiếp cận thực tiễn để nâng cao độ trôi chảy khi nói mà không sợ mắc lỗi.',
  },
];

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState('Tất cả');
  const [selectedPos, setSelectedPos] = useState('all');
  const [words, setWords] = useState<WordItem[]>(SAMPLE_WORDS);
  const [featuredWord, setFeaturedWord] = useState<WordItem>(DEFAULT_FEATURED_WORD);
  const [loading, setLoading] = useState(false);
  const [addedWords, setAddedWords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadDictionary() {
      if (!searchQuery.trim() && selectedCefr === 'Tất cả' && selectedPos === 'all') {
        setWords(SAMPLE_WORDS);
        return;
      }

      setLoading(true);
      try {
        const res = await api.searchDictionary({
          q: searchQuery,
          cefr: selectedCefr === 'Tất cả' ? undefined : selectedCefr,
          partOfSpeech: selectedPos === 'all' ? undefined : selectedPos,
          limit: 30,
        });

        if (res.words && res.words.length > 0) {
          setWords(res.words);
        } else {
          setWords([]);
        }
      } catch {
        // Filter locally on error
        let filtered = SAMPLE_WORDS;
        if (searchQuery.trim()) {
          filtered = filtered.filter(
            (w) =>
              w.targetText.toLowerCase().includes(searchQuery.toLowerCase()) ||
              w.translation.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedCefr !== 'Tất cả') {
          filtered = filtered.filter((w) => w.cefrLevel === selectedCefr);
        }
        if (selectedPos !== 'all') {
          filtered = filtered.filter((w) => w.partOfSpeech === selectedPos);
        }
        setWords(filtered);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadDictionary, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCefr, selectedPos]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddToDeck = async (word: WordItem) => {
    setAddedWords((prev) => ({ ...prev, [word.id]: true }));
    try {
      await api.addSrsWord({
        targetText: word.targetText,
        translation: word.translation,
        phonetic: word.phonetic,
        exampleSentence: word.exampleSentence,
        cefrLevel: word.cefrLevel,
      });
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left">
      {/* Header Từ Điển */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Từ Điển Toàn Diện · Dictionary</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-sans">
              Tra cứu chuẩn xác, mở rộng vốn từ mỗi ngày
            </h1>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed font-sans">
              Tra cứu hơn 25.000 mục từ vựng học thuật kèm phiên âm chuẩn quốc tế, ví dụ song ngữ ngữ cảnh và dễ dàng lưu vào thẻ ghi nhớ.
            </p>
          </div>

          <div className="flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Hôm nay cùng tớ học từ mới nhé!
            </div>
            <LingLing reaction="greet" size={125} />
          </div>
        </div>
      </div>

      {/* "TỪ VỰNG TIÊU BIỂU TRONG NGÀY" DẠNG CARD GIẤY */}
      <div className="card-paper p-6 sm:p-8 space-y-4 bg-paper-2 border-2 border-ink shadow-brutal-lg relative">
        <div className="flex items-center justify-between border-b-2 border-ink/20 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-red">
            Mục từ tiêu biểu trong ngày (Word of the Day)
          </span>
          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded border border-ink bg-card text-teal">
            Bậc {featuredWord.cefrLevel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-black text-ink font-serif tracking-tight">
                {featuredWord.targetText}
              </h2>
              <span className="text-sm font-mono font-bold text-teal">
                {featuredWord.phonetic}
              </span>
              <button
                onClick={() => handleSpeak(featuredWord.targetText)}
                className="w-8 h-8 rounded-full border border-ink bg-card hover:bg-amber flex items-center justify-center text-ink shadow-brutal-sm cursor-pointer transition-all"
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs font-bold text-ink-muted italic block">
              {featuredWord.partOfSpeech === 'noun' ? 'Danh từ' : 'Tính từ'}
            </span>
          </div>

          <button
            onClick={() => handleAddToDeck(featuredWord)}
            disabled={addedWords[featuredWord.id]}
            className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            {addedWords[featuredWord.id] ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã lưu vào thẻ</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm vào thẻ ghi nhớ</span>
              </>
            )}
          </button>
        </div>

        <p className="text-base font-bold text-ink leading-relaxed font-sans">
          {featuredWord.translation}
        </p>

        {featuredWord.exampleSentence && (
          <div className="lined-paper border border-ink/25 rounded-xl p-3.5 space-y-1 shadow-brutal-sm">
            <p className="text-xs sm:text-sm font-bold text-ink italic font-serif">
              &ldquo;{featuredWord.exampleSentence}&rdquo;
            </p>
            <p className="text-xs text-teal font-semibold">
              {featuredWord.exampleTranslation}
            </p>
          </div>
        )}
      </div>

      {/* THANH TÌM KIẾM GIẤY + BỘ LỌC CHIP GIẤY */}
      <div className="space-y-4">
        {/* Ô Tìm Kiếm Giấy */}
        <div className="relative">
          <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tra cứu từ vựng tiếng Anh hoặc nghĩa tiếng Việt..."
            className="w-full bg-card border-2 border-ink rounded-2xl pl-12 pr-4 py-3 text-base font-bold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-teal shadow-brutal-md"
          />
        </div>

        {/* Hàng Chip Bậc CEFR & Dropdown Từ Loại */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Chip Bậc CEFR */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-black uppercase text-ink-muted mr-1 whitespace-nowrap flex-shrink-0">
              Bậc:
            </span>
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedCefr(lvl)}
                className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedCefr === lvl
                    ? 'bg-ink text-paper shadow-brutal-sm'
                    : 'bg-card text-ink hover:bg-paper-2'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Dropdown Từ Loại Giấy */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter className="w-4 h-4 text-ink-muted" />
            <select
              value={selectedPos}
              onChange={(e) => setSelectedPos(e.target.value)}
              className="bg-card border-2 border-ink rounded-xl px-3 py-1.5 text-xs font-black text-ink shadow-brutal-sm focus:outline-none cursor-pointer"
            >
              {PARTS_OF_SPEECH.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KẾT QUẢ TRA CỨU VẼ NHƯ "TRANG TỪ ĐIỂN" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-ink font-sans">
            Mục từ tìm kiếm
          </h2>
          <span className="text-xs font-mono font-bold text-ink-muted">
            {words.length} kết quả
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm font-black text-ink">
            Đang lật trang từ điển...
          </div>
        ) : words.length === 0 ? (
          <div className="card-paper p-10 text-center space-y-2 bg-paper-2">
            <span className="text-base font-black text-ink block">
              Không tìm thấy mục từ phù hợp
            </span>
            <p className="text-xs text-ink-soft">
              Hãy thử tìm kiếm với từ khóa khác hoặc bỏ các bộ lọc đang chọn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {words.map((w, idx) => {
              const isAdded = addedWords[w.id];

              return (
                <div
                  key={w.id}
                  className="card-paper p-6 space-y-3 bg-card hover:-translate-y-1 transition-all flex flex-col justify-between shadow-brutal-md border-2 border-ink"
                >
                  <div className="space-y-2.5">
                    {/* Header mục từ: Tiêu đề + Phiên âm + Stamp từ loại */}
                    <div className="flex items-start justify-between gap-2 border-b border-ink/15 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-black text-ink font-serif tracking-tight">
                            {w.targetText}
                          </h3>
                          <button
                            onClick={() => handleSpeak(w.targetText)}
                            className="w-7 h-7 rounded-full border border-ink bg-paper-2 hover:bg-amber flex items-center justify-center text-ink shadow-brutal-sm cursor-pointer"
                            title="Phát âm"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {w.phonetic && (
                          <span className="text-xs font-mono font-bold text-teal block mt-0.5">
                            {w.phonetic}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-ink/40 bg-paper-2 text-ink">
                          {w.partOfSpeech || 'noun'}
                        </span>
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded border border-ink bg-teal/10 text-teal">
                          {w.cefrLevel}
                        </span>
                      </div>
                    </div>

                    {/* Định nghĩa đánh số */}
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase tracking-wider text-ink-muted block">
                        1. Định nghĩa:
                      </span>
                      <p className="text-sm font-bold text-ink leading-relaxed font-sans">
                        {w.translation}
                      </p>
                    </div>

                    {/* Ví dụ in nghiêng */}
                    {w.exampleSentence && (
                      <div className="lined-paper p-3 rounded-lg border border-ink/20 space-y-1">
                        <p className="text-xs font-serif italic text-ink">
                          &ldquo;{w.exampleSentence}&rdquo;
                        </p>
                        {w.exampleTranslation && (
                          <p className="text-[11px] text-teal font-semibold">
                            {w.exampleTranslation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nút Đỏ "Thêm vào thẻ ghi nhớ" */}
                  <div className="pt-2 border-t border-ink/15 flex items-center justify-end">
                    <button
                      onClick={() => handleAddToDeck(w)}
                      disabled={isAdded}
                      className={`btn ${
                        isAdded ? 'btn-paper opacity-75' : 'btn-red'
                      } text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã lưu vào thẻ</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm vào thẻ ghi nhớ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
