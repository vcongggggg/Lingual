'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Shuffle,
  Bookmark,
  Smile,
  ChevronRight,
  Check
} from 'lucide-react';
import { LingLing } from '../ui/LingLing';
import { MascotPose } from '../mascot';
import { StampSlam } from '../ui/StampSlam';
import { api } from '../../lib/api';

export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: string;
}

const FALLBACK_VOCAB: VocabWord[] = [
  { id: 'v1', word: 'perseverance', translation: 'sự kiên trì bền bỉ', phonetic: '/ˌpɜː.sɪˈvɪə.rəns/', partOfSpeech: 'Danh từ' },
  { id: 'v2', word: 'sustainable', translation: 'bền vững lâu dài', phonetic: '/səˈsteɪ.nə.bəl/', partOfSpeech: 'Tính từ' },
  { id: 'v3', word: 'fascinating', translation: 'lôi cuốn, thú vị', phonetic: '/ˈfæs.ɪ.neɪ.tɪŋ/', partOfSpeech: 'Tính từ' },
  { id: 'v4', word: 'resilience', translation: 'sức bật, sự kiên cường', phonetic: '/rɪˈzɪl.jəns/', partOfSpeech: 'Danh từ' },
  { id: 'v5', word: 'collaborate', translation: 'hợp tác, chung sức', phonetic: '/kəˈlæb.ə.reɪt/', partOfSpeech: 'Động từ' },
  { id: 'v6', word: 'diligent', translation: 'chăm chỉ, siêng năng', phonetic: '/ˈdɪl.ɪ.dʒənt/', partOfSpeech: 'Tính từ' },
  { id: 'v7', word: 'cherish', translation: 'trân trọng, yêu quý', phonetic: '/ˈtʃer.ɪʃ/', partOfSpeech: 'Động từ' },
  { id: 'v8', word: 'endeavor', translation: 'sự nỗ lực cống hiến', phonetic: '/enˈdev.ər/', partOfSpeech: 'Danh từ' },
  { id: 'v9', word: 'curiosity', translation: 'tính hiếu kỳ, tò mò', phonetic: '/ˌkjʊə.riˈɒs.ə.ti/', partOfSpeech: 'Danh từ' },
  { id: 'v10', word: 'enthusiasm', translation: 'sự nhiệt huyết, hào hứng', phonetic: '/ɪnˈθjuː.zi.æz.əm/', partOfSpeech: 'Danh từ' },
  { id: 'v11', word: 'masterpiece', translation: 'kiệt tác nghệ thuật', phonetic: '/ˈmɑː.stə.piːs/', partOfSpeech: 'Danh từ' },
  { id: 'v12', word: 'generosity', translation: 'sự hào phóng, rộng lượng', phonetic: '/ˌdʒen.əˈrɒs.ə.ti/', partOfSpeech: 'Danh từ' },
];

interface StoryTemplate {
  id: string;
  title: string;
  mascotReaction: MascotPose;
  paragraphs: (words: VocabWord[]) => string[];
  quizQuestions: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  }[];
}

const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'story-kitchen-heist',
    title: 'Vụ Đột Kích Tủ Lạnh Lúc Nửa Đêm Của Bò LingLing',
    mascotReaction: 'storyteller',
    paragraphs: (words) => [
      `Đúng 2 giờ sáng, khi cả nông trại đã chìm vào giấc ngủ sâu, Bò LingLing bắt đầu kế hoạch vĩ đại: đột nhập vào nhà bếp để tìm hũ bánh quy bơ. Bò tin rằng một kế hoạch táo bạo như thế này đòi hỏi sự [0:${words[0].word}] tột bậc và khả năng tính toán chuẩn xác từng bước chân.`,
      `Nhón gót đi qua sàn gỗ kẽo kẹt, LingLing trượt chân ngã uỵch vào một bao bột mì mở sẵn. Cả người Bò phủ kín một lớp bột trắng xóa trông vô cùng [1:${words[1].word}]. Không hề nản lòng, với tinh thần [2:${words[2].word}] phi thường của một chú bò kiên định, LingLing phủi bụi và quyết định [3:${words[3].word}] với chú mèo Miu Miu đang ngồi canh góc bếp bằng một đĩa phô mai béo ngậy.`,
      `Cả hai phối hợp nhịp nhàng cạy tung ổ khóa tủ lạnh, tạo nên một [4:${words[4].word}] ẩm thực lúc rạng đông với bánh quy, dưa hấu và sữa tươi. Bác nông dân thức dậy chỉ biết lắc đầu bật cười trước sự lém lỉnh của Bò LingLing!`,
    ],
    quizQuestions: [
      {
        question: 'Bò LingLing đã gặp sự cố hài hước nào khi lẻn vào nhà bếp?',
        options: [
          { text: 'Trượt chân ngã vào bao bột mì làm người trắng xóa', isCorrect: true },
          { text: 'Bị chú mèo Miu Miu cào vào đuôi', isCorrect: false },
          { text: 'Làm rơi chiếc nồi đồng đánh thức bác nông dân', isCorrect: false },
        ],
        explanation: 'Trong đoạn 2, LingLing trượt chân ngã vào bao bột mì mở sẵn và biến thành chú bò bột trắng xóa.',
      },
      {
        question: 'LingLing đã làm gì để chú mèo Miu Miu không tố giác mình?',
        options: [
          { text: 'Hợp tác (collaborate) và chia sẻ đĩa phô mai béo ngậy', isCorrect: true },
          { text: 'Dọa đuổi mèo ra ngoài sân cỏ', isCorrect: false },
          { text: 'Giấu mèo vào trong tủ đựng chén đĩa', isCorrect: false },
        ],
        explanation: 'LingLing đã rủ chú mèo cùng hợp tác bằng một đĩa phô mai ngon lành để cạy tủ lạnh.',
      },
    ],
  },
  {
    id: 'story-lecture-hall',
    title: 'Buổi Thuyết Trình Bất Đắc Dĩ Của Giáo Sư Bò',
    mascotReaction: 'cheersSoda',
    paragraphs: (words) => [
      `Một buổi chiều nọ, LingLing vô tình đi lạc vào giảng đường lớn của trường đại học quốc tế. Nhìn thấy chiếc micro không dây trên bục giảng, bản tính [0:${words[0].word}] trỗi dậy khiến Bò ta lập tức nhảy lên bục và hắng giọng phát biểu trước hàng trăm sinh viên đang ngơ ngác.`,
      `Bằng một chất giọng nghiêm nghị nhưng biểu cảm lại cực kỳ [1:${words[1].word}], LingLing bắt đầu thuyết giảng về chiến lược sống: ngủ đủ 10 tiếng mỗi ngày, ăn cỏ tươi và luôn duy trì nguồn năng lượng [2:${words[2].word}] cho mọi hoạt động thể chất lẫn trí não.`,
      `Cả giảng đường vỗ tay rào rào khi Bò khuyên sinh viên hãy luôn biết [3:${words[3].word}] từng ngày học tập và không ngừng [4:${words[4].word}] để biến ước mơ thành hiện thực. Buổi học hôm ấy được bình chọn là tiết học truyền cảm hứng nhất năm!`,
    ],
    quizQuestions: [
      {
        question: 'LingLing đã chia sẻ triết lý sống hài hước nào trước sinh viên?',
        options: [
          { text: 'Ngủ đủ 10 tiếng mỗi ngày, ăn cỏ tươi và duy trì năng lượng bền vững', isCorrect: true },
          { text: 'Thức trắng đêm để giải hết đề thi IELTS', isCorrect: false },
          { text: 'Nghỉ học để đi du lịch vòng quanh thế giới', isCorrect: false },
        ],
        explanation: 'Đoạn 2 nêu rõ Bò thuyết giảng về việc ngủ 10 tiếng, ăn cỏ tươi và duy trì nguồn năng lượng tích cực.',
      },
      {
        question: 'Phản ứng của sinh viên trong giảng đường như thế nào?',
        options: [
          { text: 'Vỗ tay rào rào và bình chọn đây là tiết học truyền cảm hứng nhất năm', isCorrect: true },
          { text: 'Gọi bảo vệ đuổi Bò ra khỏi cổng trường', isCorrect: false },
          { text: 'Bỏ về giữa chừng vì tưởng nhầm lớp học', isCorrect: false },
        ],
        explanation: 'Sinh viên vỗ tay hoan hô nhiệt liệt và vô cùng thích thú với bài giảng của Bò.',
      },
    ],
  },
  {
    id: 'story-marathon-race',
    title: 'Giải Chạy Marathon Kỳ Quặc Ở Thung Lũng Cỏ',
    mascotReaction: 'party',
    paragraphs: (words) => [
      `Nhân ngày hội thể thao mùa thu, LingLing tuyên bố thách đấu tất cả muôn thú chạy việt dã 10 cây số. Đeo dải băng đỏ trên trán, Bò xuất phát với tinh thần [0:${words[0].word}] hừng hực khiến ai nấy đều trầm trồ thán phục.`,
      `Thế nhưng mới chạy được 500 mét, LingLing bắt gặp một vạt hoa dại thơm ngát. Bò quyết định dừng lại mở một bữa tiệc trà nhỏ vì cho rằng đây là phương pháp [1:${words[1].word}] cần thiết để nạp năng lượng sinh học. Khán giả xung quanh vừa buồn cười vừa thấy Bò thật [2:${words[2].word}].`,
      `Dù về đích cuối cùng, Bò vẫn hiên ngang giơ cao cúp lưu niệm vì đã [3:${words[3].word}] cùng các bạn nhỏ dọn sạch rác trên đường chạy, tạo nên một [4:${words[4].word}] về tinh thần thể thao công bằng và yêu đời!`,
    ],
    quizQuestions: [
      {
        question: 'Vì sao LingLing dừng lại giữa đường chạy marathon?',
        options: [
          { text: 'Dừng lại bên vạt hoa dại để thưởng thức và nạp năng lượng', isCorrect: true },
          { text: 'Bị trật khớp chân không thể chạy tiếp', isCorrect: false },
          { text: 'Bị lạc đường trong rừng sâu', isCorrect: false },
        ],
        explanation: 'Đoạn 2 kể LingLing gặp vạt hoa dại thơm ngát nên dừng lại nghỉ ngơi nạp năng lượng.',
      },
      {
        question: 'Dù về đích cuối cùng, vì sao Bò vẫn được trao cúp lưu niệm?',
        options: [
          { text: 'Vì đã cùng các bạn dọn sạch rác và lan tỏa tinh thần yêu đời', isCorrect: true },
          { text: 'Vì là người chạy nhanh nhất ở 500 mét đầu', isCorrect: false },
          { text: 'Vì tự ý lấy cúp của ban tổ chức', isCorrect: false },
        ],
        explanation: 'LingLing được trao cúp vì hành động đẹp cùng dọn rác và tinh thần thể thao đáng yêu.',
      },
    ],
  },
  {
    id: 'story-master-chef',
    title: 'Đầu Bếp Trứ Danh LingLing Và Chiếc Bánh Cháy Khét',
    mascotReaction: 'laughTease',
    paragraphs: (words) => [
      `Với lòng [0:${words[0].word}] dành cho nghệ thuật làm bánh phương Tây, LingLing quyết định tự tay làm một chiếc bánh gato kỷ niệm sinh nhật. Bò từ chối xem sách hướng dẫn vì tin rằng trực giác mới là [1:${words[1].word}] chân thực nhất của một nghệ sĩ ẩm thực.`,
      `LingLing trộn bột mì, mật ong, hạt dẻ cùng một nắm cỏ linh lăng tươi non để tạo ra hỗn hợp [2:${words[2].word}] độc nhất vô nhị. Khi đưa vào lò nướng, do chỉnh nhầm nhiệt độ tối đa, khói đen bắt đầu bốc lên nghi ngút khắp gian bếp.`,
      `Không hề bối rối, Bò chứng minh sự [3:${words[3].word}] đỉnh cao bằng cách phủ một lớp kem vani trắng muốt lên trên và tuyên bố đây là một [4:${words[4].word}] mang phong cách dung nham núi lửa. Mọi người nếm thử và ngạc nhiên vì vị bánh lại ngon lạ thường!`,
    ],
    quizQuestions: [
      {
        question: 'Nguyên liệu đặc biệt mà LingLing thêm vào chiếc bánh gato là gì?',
        options: [
          { text: 'Cỏ linh lăng tươi non kết hợp mật ong và hạt dẻ', isCorrect: true },
          { text: 'Ớt chuông đỏ và nước mắm', isCorrect: false },
          { text: 'Socola đen nguyên chất 100%', isCorrect: false },
        ],
        explanation: 'Đoạn 2 kể Bò trộn hạt dẻ, mật ong và một nắm cỏ linh lăng tươi non đặc trưng.',
      },
      {
        question: 'Khi chiếc bánh bị cháy, Bò LingLing đã xử lý như thế nào?',
        options: [
          { text: 'Phủ kem vani lên và giới thiệu là phong cách dung nham núi lửa', isCorrect: true },
          { text: 'Đem vứt vào thùng rác và khóc nhè', isCorrect: false },
          { text: 'Đổ lỗi cho lò nướng bị hỏng', isCorrect: false },
        ],
        explanation: 'LingLing lém lỉnh phủ kem vani lên lớp bánh cháy và biến thành món tráng miệng dung nham núi lửa.',
      },
    ],
  },
];

export function CowsTale() {
  const [vocabPool, setVocabPool] = useState<VocabWord[]>(FALLBACK_VOCAB);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [isStoryGenerated, setIsStoryGenerated] = useState<boolean>(false);
  const [templateIdx, setTemplateIdx] = useState<number>(0);
  const [hoveredWord, setHoveredWord] = useState<VocabWord | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Trạng thái 2 câu hỏi cuối truyện
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [hasCheckedQuiz, setHasCheckedQuiz] = useState<boolean>(false);
  const [hasFinishedReading, setHasFinishedReading] = useState<boolean>(false);

  // 1. Tải danh sách từ vựng từ API thật
  useEffect(() => {
    const loadVocab = async () => {
      try {
        const [srsRes, vocabRes] = await Promise.allSettled([
          api.getSrsQueue(),
          api.getVocabularies(40),
        ]);

        const pool: VocabWord[] = [];
        if (srsRes.status === 'fulfilled' && srsRes.value?.queue) {
          srsRes.value.queue.forEach((item: any) => {
            const w = item.targetText || item.word?.targetText;
            const t = item.translation || item.word?.translation;
            if (w && t && !pool.some((p) => p.word.toLowerCase() === w.toLowerCase())) {
              pool.push({
                id: item.wordId || item.id || `srs-${Math.random()}`,
                word: w.toLowerCase().trim(),
                translation: t,
                phonetic: item.phonetic || item.word?.phoneticUs,
                partOfSpeech: item.partOfSpeech || 'Từ vựng',
              });
            }
          });
        }

        if (vocabRes.status === 'fulfilled' && vocabRes.value?.vocabularies) {
          vocabRes.value.vocabularies.forEach((item: any) => {
            const w = item.targetText || item.word;
            const t = item.translation || item.meaning;
            if (w && t && !pool.some((p) => p.word.toLowerCase() === w.toLowerCase())) {
              pool.push({
                id: item.id || `v-${Math.random()}`,
                word: w.toLowerCase().trim(),
                translation: t,
                phonetic: item.phoneticUs || item.phonetic,
                partOfSpeech: item.partOfSpeech || 'Từ vựng',
              });
            }
          });
        }

        if (pool.length >= 5) {
          setVocabPool(pool);
        }
      } catch (e) {
        // Use fallback pool
      }
    };

    loadVocab();
  }, []);

  // Chọn hoặc bỏ chọn từ vựng
  const handleToggleWord = (wordId: string) => {
    if (selectedWordIds.includes(wordId)) {
      setSelectedWordIds((prev) => prev.filter((id) => id !== wordId));
    } else {
      if (selectedWordIds.length < 5) {
        setSelectedWordIds((prev) => [...prev, wordId]);
      }
    }
  };

  // Chọn ngẫu nhiên 5 từ
  const handleRandomPick = () => {
    const shuffled = [...vocabPool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 5).map((w) => w.id);
    setSelectedWordIds(picked);
  };

  // Tạo truyện (Mad-libs)
  const handleGenerateStory = () => {
    if (selectedWordIds.length !== 5) return;
    setIsStoryGenerated(true);
    setQuizAnswers({});
    setHasCheckedQuiz(false);
    setHasFinishedReading(false);
  };

  // Chọn mẫu truyện khác
  const handleSwitchStoryTemplate = () => {
    setTemplateIdx((prev) => (prev + 1) % STORY_TEMPLATES.length);
    setQuizAnswers({});
    setHasCheckedQuiz(false);
    setHasFinishedReading(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  // Quay lại chọn từ mới
  const handleResetToWordSelection = () => {
    setIsStoryGenerated(false);
    setSelectedWordIds([]);
    setQuizAnswers({});
    setHasCheckedQuiz(false);
    setHasFinishedReading(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  // Lấy 5 từ người dùng đã chọn
  const chosenWords = selectedWordIds
    .map((id) => vocabPool.find((w) => w.id === id)!)
    .filter(Boolean);

  const currentStory = STORY_TEMPLATES[templateIdx];
  const storyParagraphs = isStoryGenerated ? currentStory.paragraphs(chosenWords) : [];

  // Phát âm toàn bộ truyện bằng Web Speech Synthesis
  const handlePlayStoryAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Ghép văn bản sạch
    const fullText = storyParagraphs
      .map((p) => p.replace(/\[\d+:([^\]]+)\]/g, '$1'))
      .join(' ');

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(fullText);
    u.lang = 'vi-VN'; // Truyện tiếng Việt có chèn từ tiếng Anh
    u.rate = 0.92;
    u.onstart = () => setIsPlayingAudio(true);
    u.onend = () => setIsPlayingAudio(false);
    u.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(u);
  };

  // Xử lý nộp quiz 2 câu
  const handleCheckQuiz = () => {
    setHasCheckedQuiz(true);
    setHasFinishedReading(true);
  };

  const isAllQuizAnswered = Boolean(
    quizAnswers[0] !== undefined && quizAnswers[1] !== undefined
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left select-none pb-20">
      {/* 1. HEADER CHUYỆN BÒ KỂ */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase text-amber-700 tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber" />
            <span>Chuyện Bò Kể · Dệt Truyện Từ Vựng Mad-Libs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink font-serif">
            Trang Sách Truyện Của Bò LingLing
          </h2>
          <p className="text-xs text-ink-soft">
            Chọn 5 từ vựng bạn đã học — Bò LingLing sẽ tự mình làm nhân vật chính trong một mẩu truyện quậy tưng bừng!
          </p>
        </div>

        {isStoryGenerated && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleSwitchStoryTemplate}
              className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
              title="Đổi cốt truyện khác"
            >
              <Shuffle className="w-3.5 h-3.5 text-red" />
              <span>Đổi truyện khác</span>
            </button>
            <button
              onClick={handleResetToWordSelection}
              className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chọn lại từ</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. MÀN HÌNH CHỌN 5 TỪ VỰNG (NẾU CHƯA SINH TRUYỆN) */}
      {!isStoryGenerated && (
        <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-red font-mono">BƯỚC 1 TRÊN 2:</span>
              <h3 className="text-lg sm:text-xl font-black text-ink font-serif">
                Chọn Đúng 5 Từ Vựng Để Bò Dệt Truyện
              </h3>
              <p className="text-xs text-ink-soft">
                Chạm vào các thẻ từ đã học bên dưới để đưa vào mẩu truyện ngắn hôm nay.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl border-2 border-ink font-mono text-xs font-black shadow-brutal-sm ${
                selectedWordIds.length === 5 ? 'bg-teal text-white' : 'bg-paper text-ink'
              }`}>
                ĐÃ CHỌN: {selectedWordIds.length} / 5
              </span>

              <button
                onClick={handleRandomPick}
                className="btn btn-paper text-xs font-black shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                title="Chọn ngẫu nhiên 5 từ bất kỳ"
              >
                <Shuffle className="w-3.5 h-3.5 text-red" />
                <span>Ngẫu nhiên 5 từ</span>
              </button>
            </div>
          </div>

          {/* Lưới các thẻ từ vựng selectable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {vocabPool.map((v) => {
              const isSelected = selectedWordIds.includes(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => handleToggleWord(v.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between gap-2 shadow-brutal-sm ${
                    isSelected
                      ? 'bg-amber/30 border-ink ring-2 ring-red -translate-y-0.5'
                      : 'bg-paper hover:bg-paper-2 border-ink text-ink'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-ink">{v.word}</span>
                      {v.partOfSpeech && (
                        <span className="text-[10px] text-ink-muted italic">({v.partOfSpeech})</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-teal line-clamp-1">{v.translation}</p>
                    {v.phonetic && (
                      <span className="text-[10px] font-mono text-ink-muted block">{v.phonetic}</span>
                    )}
                  </div>

                  <div className={`w-5 h-5 rounded-full border border-ink flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-red text-white' : 'bg-card'
                  }`}>
                    {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nút bắt đầu sinh truyện */}
          <div className="pt-4 border-t-2 border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LingLing reaction="storyteller" size={48} />
              <span className="text-xs font-bold text-ink-muted">
                {selectedWordIds.length === 5
                  ? 'Tuyệt vời! Bấm nút bên cạnh để Bò LingLing bắt đầu kể chuyện.'
                  : `Vui lòng chọn thêm ${5 - selectedWordIds.length} từ nữa để đủ bộ 5 từ.`}
              </span>
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={selectedWordIds.length !== 5}
              className="btn btn-red px-8 py-3 text-sm font-black shadow-brutal hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bò Dệt Truyện Ngay ({selectedWordIds.length}/5) →</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MÀN HÌNH ĐỌC TRANG SÁCH TRUYỆN GIẤY (BOOK READER) */}
      {isStoryGenerated && (
        <div className="relative bg-[#FFFDF7] border-4 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl space-y-8 overflow-hidden">
          {/* Ruy băng đánh dấu trang (Bookmark ribbon) */}
          <div className="absolute top-0 right-10 w-8 h-12 bg-red border-x-2 border-b-2 border-ink shadow-brutal-sm flex items-end justify-center pb-1 pointer-events-none">
            <Bookmark className="w-4 h-4 text-white fill-white" />
          </div>

          {/* Header Trang Sách */}
          <div className="border-b-2 border-dashed border-ink/30 pb-6 pr-14 space-y-2">
            <span className="text-[11px] font-mono font-black uppercase text-teal tracking-widest block">
              CHƯƠNG ĐẶC BIỆT · NHẬT KÝ BÒ LINGLING
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-ink font-serif leading-tight">
              {currentStory.title}
            </h3>
            <p className="text-xs text-ink-muted italic">
              Minh họa: Bò LingLing bướng bỉnh · Chạm vào các từ tô màu để xem nghĩa nhanh
            </p>
          </div>

          {/* Minh họa Linh vật Bò + Nút Nghe TTS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-paper rounded-2xl border-2 border-ink">
            <div className="flex items-center gap-3">
              <LingLing reaction={currentStory.mascotReaction} size={72} />
              <div className="space-y-0.5">
                <span className="text-xs font-black text-ink block font-serif">
                  Nhân vật chính: Bò LingLing
                </span>
                <span className="text-[11px] text-ink-muted">
                  Tính cách: Thông minh, lém lỉnh, bướng bỉnh và thích ăn ngon!
                </span>
              </div>
            </div>

            <button
              onClick={handlePlayStoryAudio}
              className={`btn btn-paper text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer ${
                isPlayingAudio ? 'bg-amber' : ''
              }`}
            >
              <Volume2 className={`w-4 h-4 text-red ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Đang đọc truyện...' : '🔊 Nghe Bò đọc truyện'}</span>
            </button>
          </div>

          {/* Thân mẩu truyện trang sách giấy */}
          <div className="space-y-5 lined-paper p-6 sm:p-8 rounded-2xl border border-ink/20 bg-paper/40 font-serif text-lg leading-loose text-ink">
            {storyParagraphs.map((paragraph, pIdx) => {
              // Parse các slot [index:word]
              const parts = paragraph.split(/(\[\d+:[^\]]+\])/g);

              return (
                <p key={pIdx} className="indent-6 sm:indent-8 text-base sm:text-lg leading-relaxed">
                  {parts.map((part, partIdx) => {
                    const match = part.match(/\[(\d+):([^\]]+)\]/);
                    if (match) {
                      const wordIndex = parseInt(match[1], 10);
                      const targetVocab = chosenWords[wordIndex];
                      if (!targetVocab) return part;

                      return (
                        <span
                          key={partIdx}
                          onClick={() => setHoveredWord(targetVocab)}
                          className="inline-block mx-1 px-2 py-0.5 rounded-lg bg-amber/30 hover:bg-amber border border-ink/40 text-ink font-mono font-black shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
                          title="Chạm để tra cứu nghĩa nhanh"
                        >
                          ✨ {targetVocab.word}
                        </span>
                      );
                    }
                    return <span key={partIdx}>{part}</span>;
                  })}
                </p>
              );
            })}
          </div>

          {/* POPUP TRA NGHĨA NHANH KHI CHẠM VÀO TỪ HIGHLIGHT */}
          {hoveredWord && (
            <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal animate-in fade-in flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black uppercase text-red">
                    📖 Tra nghĩa từ vựng:
                  </span>
                  <span className="text-base font-black font-mono text-ink">
                    {hoveredWord.word}
                  </span>
                  {hoveredWord.phonetic && (
                    <span className="text-xs font-mono text-ink-muted">{hoveredWord.phonetic}</span>
                  )}
                  {hoveredWord.partOfSpeech && (
                    <span className="text-xs font-serif italic text-ink-soft">({hoveredWord.partOfSpeech})</span>
                  )}
                </div>
                <p className="text-sm font-bold text-teal">
                  ↳ Nghĩa: {hoveredWord.translation}
                </p>
              </div>

              <button
                onClick={() => setHoveredWord(null)}
                className="px-2.5 py-1 text-xs font-black border border-ink rounded-lg bg-paper hover:bg-paper-2"
              >
                Đóng ✕
              </button>
            </div>
          )}

          {/* 4. CUỐI TRUYỆN: 2 CÂU HỎI NHẸ TRẮC NGHIỆM VỀ NỘI DUNG */}
          <div className="p-6 bg-paper rounded-2xl border-2 border-ink space-y-6">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-red" />
                <span className="text-xs font-black uppercase text-ink">
                  Thử thách hiểu truyện (2 câu hỏi trắc nghiệm nhẹ nhàng):
                </span>
              </div>
              <span className="text-[11px] text-ink-muted">Hoàn tất để đóng dấu ĐÃ ĐỌC</span>
            </div>

            <div className="space-y-6">
              {currentStory.quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <h4 className="text-sm font-black text-ink font-serif">
                    Câu {qIdx + 1}: {q.question}
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      let btnStyle = 'bg-card hover:bg-paper-2 border-ink text-ink';

                      if (hasCheckedQuiz) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-teal/15 border-teal text-teal font-black shadow-brutal-sm';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-red/15 border-red text-red line-through';
                        } else {
                          btnStyle = 'opacity-50 border-ink/40 text-ink-muted';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber/30 border-ink shadow-brutal-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (!hasCheckedQuiz) {
                              setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                            }
                          }}
                          disabled={hasCheckedQuiz}
                          className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {hasCheckedQuiz && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" />
                          )}
                          {hasCheckedQuiz && isSelected && !opt.isCorrect && (
                            <XCircle className="w-4 h-4 text-red flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {hasCheckedQuiz && (
                    <p className="text-[11px] text-ink-muted italic pl-1">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Nút chấm câu hỏi */}
            {!hasCheckedQuiz ? (
              <div className="pt-2 text-right">
                <button
                  onClick={handleCheckQuiz}
                  disabled={!isAllQuizAnswered}
                  className="btn btn-red text-xs font-black shadow-brutal cursor-pointer disabled:opacity-40"
                >
                  <span>Chấm câu hỏi & Đóng dấu đọc truyện →</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* 5. CON DẤU 'ĐÃ ĐỌC' STAMPSLAM */}
          {hasFinishedReading && (
            <div className="pt-4 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95">
              <StampSlam
                variant="circle"
                color="red"
                size="lg"
                text="ĐÃ ĐỌC"
                subtext="CHUYỆN BÒ KỂ"
                className="transform -rotate-6"
              />

              <div className="p-4 bg-card border-2 border-ink rounded-2xl max-w-md text-center space-y-1 shadow-brutal-sm">
                <div className="flex items-center justify-center gap-2 text-xs font-black text-teal">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xuất sắc! Bạn đã hoàn thành mẩu truyện hôm nay.</span>
                </div>
                <p className="text-xs text-ink-soft">
                  Cả 5 từ vựng đã được kết nối trong ngữ cảnh sinh động. Hãy tiếp tục kể những mẩu chuyện mới cùng Bò LingLing nhé!
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSwitchStoryTemplate}
                  className="btn btn-teal text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Kể câu chuyện khác →</span>
                </button>
                <button
                  onClick={handleResetToWordSelection}
                  className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chọn 5 từ vựng mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
