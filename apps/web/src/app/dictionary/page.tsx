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
import { EmptyState } from '../../components/ui/EmptyState';
import {
  LibraryCatalogCard,
  LibraryWordData,
} from '../../components/ui/LibraryCatalogCard';

const CEFR_LEVELS = ['Tất cả', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const PARTS_OF_SPEECH = [
  { value: 'all', label: 'Tất cả từ loại' },
  { value: 'noun', label: 'Danh từ (Noun)' },
  { value: 'verb', label: 'Động từ (Verb)' },
  { value: 'adjective', label: 'Tính từ (Adj)' },
  { value: 'adverb', label: 'Phó từ (Adv)' },
];

const DEFAULT_FEATURED_WORD: LibraryWordData = {
  id: 'word-serendipity',
  targetText: 'Serendipity',
  phonetic: '/ˌser.ənˈdɪp.ə.ti/',
  cefrLevel: 'C1',
  partOfSpeech: 'noun',
  translation: 'Sự may mắn bất ngờ, khả năng tình cờ tìm thấy những điều tươi đẹp.',
  callNumber: 'LIB-820.1/VOC-SEREN',
  catalogDate: '18/10/2026',
  collocations: [
    {
      phrase: 'pure serendipity',
      translation: 'sự may mắn hoàn toàn tình cờ',
      example: 'Finding this peaceful bookstore was pure serendipity on a rainy afternoon.',
    },
    {
      phrase: 'stroke of serendipity',
      translation: 'một dịp may mắn ngẫu nhiên',
      example: 'By a stroke of serendipity, they met the leading researcher at the airport.',
    },
    {
      phrase: 'serendipity and fate',
      translation: 'cơ duyên và định mệnh',
      example: 'Their breakthrough was a blend of hard work, serendipity and fate.',
    },
  ],
  synonyms: [
    {
      word: 'Fluke',
      translation: 'May mắn bất ngờ (văn nói)',
      nuance: 'Mang tính ngẫu nhiên nhiều hơn, ít chất thơ và triết lý hơn serendipity.',
    },
    {
      word: 'Fortuity',
      translation: 'Sự tình cờ may mắn (trang trọng)',
      nuance: 'Thường dùng trong văn bản học thuật hoặc luật pháp diễn tả biến cố ngẫu nhiên có lợi.',
    },
  ],
  exampleSentence: 'Finding this peaceful bookstore was pure serendipity on a rainy afternoon.',
  exampleTranslation: 'Tình cờ tìm thấy hiệu sách yên bình này vào một chiều mưa thật là một sự may mắn kỳ diệu.',
  learnedSource: {
    lessonTitle: 'Bài 3: Trải nghiệm & Cảm xúc cá nhân',
    unitTitle: 'Unit 5: Đời sống Thường nhật',
    stage: 'Chặng 2',
  },
};

const SAMPLE_WORDS: LibraryWordData[] = [
  {
    id: 'w-1',
    targetText: 'Perseverance',
    phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
    cefrLevel: 'B2',
    partOfSpeech: 'noun',
    translation: 'Sự kiên trì, lòng bền bỉ, quyết tâm vượt qua mọi khó khăn thử thách.',
    callNumber: 'LIB-820.1/VOC-PERSEV',
    catalogDate: '18/10/2026',
    collocations: [
      {
        phrase: 'show immense perseverance',
        translation: 'thể hiện lòng kiên trì to lớn',
        example: 'He showed immense perseverance throughout his intensive IELTS preparation.',
      },
      {
        phrase: 'perseverance pays off',
        translation: 'sự kiên trì sẽ được đền đáp',
        example: 'Ultimately, her unwavering perseverance paid off with a band 8.0 score.',
      },
      {
        phrase: 'sheer perseverance',
        translation: 'sự kiên trì thuần túy',
        example: 'They conquered the summit through sheer perseverance and teamwork.',
      },
    ],
    synonyms: [
      {
        word: 'Persistence',
        translation: 'Sự bền bỉ, kiên định',
        nuance: 'Nhấn mạnh vào hành động tiếp tục làm việc gì đó dù bị phản đối hay trở ngại.',
      },
      {
        word: 'Tenacity',
        translation: 'Sự ngoan cường, bám đuổi mục tiêu',
        nuance: 'Nhấn mạnh ý chí kiên quyết không buông bỏ mục tiêu dù có bất lợi.',
      },
    ],
    exampleSentence: 'Success in language learning requires patience and perseverance.',
    exampleTranslation: 'Thành công trong việc học ngoại ngữ đòi hỏi sự kiên nhẫn và lòng kiên trì bền bỉ.',
    learnedSource: {
      lessonTitle: 'Bài 2: Tên & Quốc tịch (Name & Nationality)',
      unitTitle: 'Unit 1: Chào hỏi & Giới thiệu bản thân',
      stage: 'Chặng 1',
    },
  },
  {
    id: 'w-2',
    targetText: 'Substantial',
    phonetic: '/səbˈstæn.ʃəl/',
    cefrLevel: 'B2',
    partOfSpeech: 'adjective',
    translation: 'Đáng kể, quan trọng, có số lượng lớn hoặc có giá trị thật sự.',
    callNumber: 'LIB-820.1/VOC-SUBST',
    catalogDate: '18/10/2026',
    collocations: [
      {
        phrase: 'substantial progress',
        translation: 'tiến bộ đáng kể',
        example: 'We have made substantial progress in our daily vocabulary retention.',
      },
      {
        phrase: 'substantial amount of water',
        translation: 'khối lượng nước đáng kể',
        example: 'The ancient aqueducts transported a substantial amount of fresh water daily.',
      },
      {
        phrase: 'substantial evidence',
        translation: 'bằng chứng xác thực có sức nặng',
        example: 'Researchers found substantial evidence supporting climate adaptation.',
      },
    ],
    synonyms: [
      {
        word: 'Significant',
        translation: 'Đáng kể, có ý nghĩa',
        nuance: 'Dùng rất phổ biến trong bài luận học thuật khi phân tích số liệu và xu hướng.',
      },
      {
        word: 'Considerable',
        translation: 'Lớn lao, đáng chú ý',
        nuance: 'Nhấn mạnh độ lớn về kích cỡ, số lượng hoặc tầm quan trọng xã hội.',
      },
    ],
    exampleSentence: 'The aqueduct network carried a substantial volume of fresh water to Rome daily.',
    exampleTranslation: 'Mạng lưới cống dẫn nước đã vận chuyển một khối lượng nước ngọt đáng kể về La Mã mỗi ngày.',
    learnedSource: {
      lessonTitle: 'The Engineering Marvel of Roman Aqueducts',
      unitTitle: 'IELTS Reading Passage 1',
      stage: 'Chặng 3',
    },
  },
  {
    id: 'w-3',
    targetText: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    cefrLevel: 'C1',
    partOfSpeech: 'adjective',
    translation: 'Hùng biện, lưu loát, có tài ăn nói thuyết phục và truyền cảm.',
    callNumber: 'LIB-820.1/VOC-ELOQU',
    catalogDate: '18/10/2026',
    collocations: [
      {
        phrase: 'eloquent speaker',
        translation: 'diễn giả hùng biện truyền cảm',
        example: 'The keynote presenter was an eloquent speaker who captivated the hall.',
      },
      {
        phrase: 'eloquent testimony',
        translation: 'lời khai hoặc bằng chứng đầy sức thuyết phục',
        example: 'The clean streets are an eloquent testimony to the citizens civic pride.',
      },
    ],
    synonyms: [
      {
        word: 'Articulate',
        translation: 'Diễn đạt khúc chiết, mạch lạc',
        nuance: 'Tập trung vào sự rõ ràng, rành mạch từng luận điểm.',
      },
      {
        word: 'Persuasive',
        translation: 'Có sức thuyết phục cao',
        nuance: 'Nhấn mạnh khả năng khiến người nghe tin và thay đổi quan điểm.',
      },
    ],
    exampleSentence: 'Her eloquent explanation helped the students grasp the grammar rule quickly.',
    exampleTranslation: 'Lời giải thích lưu loát của cô ấy đã giúp học sinh nắm bắt quy tắc ngữ pháp một cách nhanh chóng.',
    learnedSource: {
      lessonTitle: 'Bài 1: Thành viên gia đình (Family Members)',
      unitTitle: 'Unit 2: Gia đình & Bạn bè',
      stage: 'Chặng 1',
    },
  },
  {
    id: 'w-4',
    targetText: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    cefrLevel: 'B2',
    partOfSpeech: 'adjective',
    translation: 'Kiên cường, có khả năng phục hồi nhanh chóng sau khó khăn hoặc nghịch cảnh.',
    callNumber: 'LIB-820.1/VOC-RESIL',
    catalogDate: '18/10/2026',
    collocations: [
      {
        phrase: 'resilient urban infrastructure',
        translation: 'hạ tầng đô thị có khả năng chống chịu',
        example: 'Engineers designed resilient urban infrastructure to withstand floods.',
      },
      {
        phrase: 'remain resilient',
        translation: 'duy trì sự kiên cường',
        example: 'He remained resilient despite facing numerous academic setbacks.',
      },
      {
        phrase: 'resilient economy',
        translation: 'nền kinh tế phục hồi linh hoạt',
        example: 'Tourism helped foster a more resilient economy for local communities.',
      },
    ],
    synonyms: [
      {
        word: 'Hardy',
        translation: 'Dẻo dai, chịu đựng tốt',
        nuance: 'Thường dùng cho sinh vật sống có thể sinh tồn trong điều kiện khắc nghiệt.',
      },
      {
        word: 'Tough',
        translation: 'Bền bỉ, cứng cỏi',
        nuance: 'Văn phong thông thường mô tả tính cách không ngại khó khăn.',
      },
    ],
    exampleSentence: 'Urban ecosystems must remain resilient against the accelerating impacts of climate change.',
    exampleTranslation: 'Hệ sinh thái đô thị phải duy trì khả năng chống chịu bền bỉ trước những tác động ngày càng tăng của biến đổi khí hậu.',
    learnedSource: {
      lessonTitle: 'Phát triển Đô thị Bền vững & Môi trường',
      unitTitle: 'Chuyên đề IELTS Writing Task 2',
      stage: 'Chặng 2',
    },
  },
  {
    id: 'w-5',
    targetText: 'Cognitive',
    phonetic: '/ˈkɒɡ.nə.tɪv/',
    cefrLevel: 'B2',
    partOfSpeech: 'adjective',
    translation: 'Thuộc về nhận thức, khả năng tư duy và xử lý thông tin của não bộ.',
    callNumber: 'LIB-820.1/VOC-COGNI',
    catalogDate: '18/10/2026',
    collocations: [
      {
        phrase: 'cognitive flexibility',
        translation: 'sự linh hoạt trong nhận thức',
        example: 'Bilingualism has been shown to boost cognitive flexibility in adults.',
      },
      {
        phrase: 'cognitive development',
        translation: 'sự phát triển tư duy nhận thức',
        example: 'Reading varied materials stimulates healthy cognitive development.',
      },
      {
        phrase: 'cognitive load',
        translation: 'tải trọng nhận thức của trí não',
        example: 'Good user interfaces reduce cognitive load for language students.',
      },
    ],
    synonyms: [
      {
        word: 'Intellectual',
        translation: 'Thuộc về trí tuệ, lý trí',
        nuance: 'Tập trung vào năng lực trí tuệ, học vấn và các vấn đề tư tưởng.',
      },
      {
        word: 'Mental',
        translation: 'Thuộc về tâm trí',
        nuance: 'Bao quát tất cả trạng thái và hoạt động trong não bộ cũng như tâm lý.',
      },
    ],
    exampleSentence: 'Bilingualism has been shown to boost cognitive flexibility in adults.',
    exampleTranslation: 'Việc biết hai ngôn ngữ đã được chứng minh là giúp nâng cao sự linh hoạt trong nhận thức ở người trưởng thành.',
    learnedSource: {
      lessonTitle: 'Bài 3: Hỏi thăm sức khỏe & Tạm biệt',
      unitTitle: 'Unit 1: Chào hỏi & Giới thiệu bản thân',
      stage: 'Chặng 1',
    },
  },
  {
    id: 'w-6',
    targetText: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    cefrLevel: 'C1',
    partOfSpeech: 'adjective',
    translation: 'Thực dụng, mang tính thực tiễn, giải quyết vấn đề dựa trên thực tế.',
    callNumber: 'LIB-820.1/VOC-PRAGM',
    catalogDate: '18/10/2026',
    collocations: [
      {
        phrase: 'pragmatic approach',
        translation: 'hướng tiếp cận thực tiễn',
        example: 'We need a pragmatic approach to improve speaking fluency without fear of errors.',
      },
      {
        phrase: 'pragmatic solution',
        translation: 'giải pháp thực tế khả thi',
        example: 'City planners selected a pragmatic solution to ease traffic congestion.',
      },
    ],
    synonyms: [
      {
        word: 'Practical',
        translation: 'Thực tế, có thể làm được',
        nuance: 'Từ thông dụng nhất chỉ những gì dễ áp dụng trong đời sống.',
      },
      {
        word: 'Realistic',
        translation: 'Hiện thực, không viển vông',
        nuance: 'Nhìn nhận mục tiêu sát với khả năng và tài nguyên thực tế.',
      },
    ],
    exampleSentence: 'We need a pragmatic approach to improve speaking fluency without fear of errors.',
    exampleTranslation: 'Chúng ta cần một hướng tiếp cận thực tiễn để nâng cao độ trôi chảy khi nói mà không sợ mắc lỗi.',
    learnedSource: {
      lessonTitle: 'Campus Orientation & Library Tour',
      unitTitle: 'IELTS Listening Section 1',
      stage: 'Chặng 2',
    },
  },
];

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState('Tất cả');
  const [selectedPos, setSelectedPos] = useState('all');
  const [words, setWords] = useState<LibraryWordData[]>(SAMPLE_WORDS);
  const [featuredWord, setFeaturedWord] = useState<LibraryWordData>(DEFAULT_FEATURED_WORD);
  const [loading, setLoading] = useState(false);
  const [addedWords, setAddedWords] = useState<Record<string, boolean>>({});
  const [drawerPulled, setDrawerPulled] = useState(true);
  const [activeDrawerSection, setActiveDrawerSection] = useState<'ALL' | 'AF' | 'GL' | 'MR' | 'SZ'>('ALL');
  const [isPulling, setIsPulling] = useState(false);

  const handlePullDrawer = (section: 'ALL' | 'AF' | 'GL' | 'MR' | 'SZ') => {
    setActiveDrawerSection(section);
    setIsPulling(true);
    setDrawerPulled(true);
    setTimeout(() => setIsPulling(false), 300);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchQuery(q);
    }
  }, []);

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
          const enrichedWords: LibraryWordData[] = res.words.map((w: any) => ({
            id: w.id,
            targetText: w.targetText,
            translation: w.translation,
            phonetic: w.phonetic,
            cefrLevel: w.cefrLevel || 'B1',
            partOfSpeech: w.partOfSpeech || 'noun',
            callNumber: `LIB-820.1/VOC-${(w.targetText || 'VOC').toUpperCase().slice(0, 5)}`,
            catalogDate: '18/10/2026',
            exampleSentence: w.exampleSentence,
            exampleTranslation: w.exampleTranslation,
            learnedSource: {
              lessonTitle: w.lessonTitle || 'Bài 1: Chào hỏi thường ngày (Greetings)',
              unitTitle: w.unitTitle || 'Unit 1: Chào hỏi & Giới thiệu bản thân',
              stage: 'Chặng 1',
            },
          }));
          setWords(enrichedWords);
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

  const handleAddToDeck = async (word: LibraryWordData) => {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 pb-28 sm:pb-20 text-left select-none">
      {/* Header Từ Điển */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Phiếu Thư Viện Mục Lục Tra Cứu</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-serif">
              Từ Điển Phiếu Thư Viện Cổ Điển
            </h1>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed font-sans">
              Mỗi mục từ là một <strong>Phiếu thư viện</strong> 4 tab đầy đủ: Định nghĩa, Cụm từ đi kèm, Từ đồng nghĩa và Ví dụ ngữ cảnh trích dẫn trực tiếp từ các bài học bạn đã hoàn thành.
            </p>
          </div>

          <div className="flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Mỗi từ là một tấm phiếu thư viện cổ!
            </div>
            <LingLing reaction="studying" size={125} />
          </div>
        </div>
      </div>

      {/* "PHIẾU THƯ VIỆN TIÊU BIỂU TRONG NGÀY" (FEATURE 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red border-2 border-ink" />
            <h2 className="text-xl sm:text-2xl font-black text-ink font-serif tracking-tight">
              Phiếu Thư Viện Tiêu Biểu Trong Ngày
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-teal px-2.5 py-0.5 rounded border border-teal bg-teal/10">
            Học sâu 4 Tab
          </span>
        </div>

        <LibraryCatalogCard
          word={featuredWord}
          onAddToDeck={handleAddToDeck}
          isAdded={addedWords[featuredWord.id]}
        />
      </div>

      {/* THANH TÌM KIẾM GIẤY + BỘ LỌC CHIP GIẤY */}
      <div className="space-y-4">
        {/* Ô Tìm Kiếm Giấy */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tra cứu từ vựng tiếng Anh hoặc nghĩa tiếng Việt trên phiếu..."
              className="w-full bg-card border-2 border-ink rounded-2xl pl-12 pr-4 py-3 text-base font-bold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-teal shadow-brutal-md font-sans"
            />
          </div>
          <div className="hidden sm:flex items-center flex-shrink-0" title="LingLing tra cứu kính lúp">
            <LingLing reaction="magnify" size={54} />
          </div>
        </div>

        {/* Hàng Chip Bậc CEFR & Dropdown Từ Loại */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Chip Bậc CEFR */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-black uppercase text-ink-muted mr-1 whitespace-nowrap flex-shrink-0">
              Bậc CEFR:
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

      {/* NGĂN TỦ CATALOG THƯ VIỆN & CÁC PHIẾU THƯ VIỆN */}
      <div className="space-y-5">
        {/* Ngăn kéo Catalog — click để kéo trượt ra (translateY) */}
        <div
          onClick={() => handlePullDrawer(activeDrawerSection)}
          className={`p-4 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-all duration-200 ${
            isPulling ? 'translate-y-1.5 shadow-brutal-sm' : 'hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border-2 border-ink bg-amber/30 flex items-center justify-center text-ink font-mono font-black text-sm shadow-brutal-sm">
              🗄️
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-ink flex items-center gap-2">
                <span>Ngăn tủ Mục lục Phiếu Thư Viện</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-card border border-ink text-teal">
                  {isPulling ? 'Đang trượt ngăn kéo...' : 'Nhấn để đổi ngăn'}
                </span>
              </div>
              <span className="text-[11px] text-ink-soft">
                Phiếu mục lục sắp xếp theo vần chữ cái, chuẩn bị sẵn 4 tab kèm audio US/UK
              </span>
            </div>
          </div>

          {/* Các ngăn phân loại chữ cái */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'AF', label: 'A – F' },
              { id: 'GL', label: 'G – L' },
              { id: 'MR', label: 'M – R' },
              { id: 'SZ', label: 'S – Z' },
            ].map((section) => (
              <button
                key={section.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePullDrawer(section.id as any);
                }}
                className={`px-2.5 py-1 rounded-lg border border-ink text-xs font-mono font-black transition-all cursor-pointer ${
                  activeDrawerSection === section.id
                    ? 'bg-ink text-paper shadow-brutal-sm'
                    : 'bg-card text-ink hover:bg-paper'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {(() => {
          const displayedWords = words.filter((w) => {
            if (activeDrawerSection === 'ALL') return true;
            const ch = (w.targetText || '').trim().toUpperCase().charAt(0);
            if (activeDrawerSection === 'AF') return ch >= 'A' && ch <= 'F';
            if (activeDrawerSection === 'GL') return ch >= 'G' && ch <= 'L';
            if (activeDrawerSection === 'MR') return ch >= 'M' && ch <= 'R';
            if (activeDrawerSection === 'SZ') return ch >= 'S' && ch <= 'Z';
            return true;
          });

          return (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-ink font-serif">
                  Danh Mục Phiếu Trong Ngăn ({activeDrawerSection})
                </h2>
                <span className="text-xs font-mono font-bold text-ink-muted">
                  {displayedWords.length} phiếu thư viện
                </span>
              </div>

              {loading ? (
                <div className="text-center py-12 text-sm font-black text-ink font-mono">
                  Đang kéo ngăn tủ phiếu thư viện...
                </div>
              ) : displayedWords.length === 0 ? (
                <EmptyState
                  title="Không tìm thấy phiếu thư viện phù hợp"
                  description="Hãy thử tìm kiếm với từ khóa khác hoặc chọn ngăn chữ cái khác."
                  reaction="shrug"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedWords.map((w) => (
                    <LibraryCatalogCard
                      key={w.id}
                      word={w}
                      onAddToDeck={handleAddToDeck}
                      isAdded={addedWords[w.id]}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
