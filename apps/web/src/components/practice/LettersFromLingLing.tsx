'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Feather,
  Stamp,
  Award,
  HelpCircle,
  Shuffle
} from 'lucide-react';
import { LingLing } from '../ui/LingLing';
import { StampSlam } from '../ui/StampSlam';
import { api } from '../../lib/api';
import { getFormattedDateInTimezone } from '@linguaflow/domain';

export interface SrsWordItem {
  id: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: string;
}

const FALLBACK_WORDS: SrsWordItem[] = [
  { id: 'fallback-1', targetText: 'perseverance', translation: 'sự kiên trì, bền bỉ', phonetic: '/ˌpɜː.sɪˈvɪə.rəns/' },
  { id: 'fallback-2', targetText: 'fascinating', translation: 'lôi cuốn, hấp dẫn', phonetic: '/ˈfæs.ɪ.neɪ.tɪŋ/' },
  { id: 'fallback-3', targetText: 'resilience', translation: 'sự kiên cường phục hồi', phonetic: '/rɪˈzɪl.jəns/' },
  { id: 'fallback-4', targetText: 'cherish', translation: 'trân trọng, yêu quý', phonetic: '/ˈtʃer.ɪʃ/' },
  { id: 'fallback-5', targetText: 'sustainable', translation: 'bền vững lâu dài', phonetic: '/səˈsteɪ.nə.bəl/' },
  { id: 'fallback-6', targetText: 'diligent', translation: 'chăm chỉ, cần cù', phonetic: '/ˈdɪl.ɪ.dʒənt/' },
  { id: 'fallback-7', targetText: 'endeavor', translation: 'sự nỗ lực cống hiến', phonetic: '/enˈdev.ər/' },
  { id: 'fallback-8', targetText: 'enthusiasm', translation: 'lòng nhiệt huyết', phonetic: '/ɪnˈθjuː.zi.æz.əm/' },
];

interface LetterTemplate {
  id: string;
  title: string;
  envelopeTitle: string;
  dateLocation: string;
  greeting: string;
  paragraphs: {
    textBefore: string;
    slotIndex: number;
    textAfter: string;
  }[];
  concludingText: string;
  signoff: string;
  postmarkCity: string;
}

const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'letter-1',
    title: 'Bức thư từ nông trại cỏ mây',
    envelopeTitle: 'THƯ BƯU CHÍNH HỎA TỐC · GỬI TỪ NÔNG TRẠI',
    dateLocation: 'Nông trại Mây Trắng, sớm tinh mơ',
    greeting: 'Gửi người bạn học mến thương của LingLing,',
    paragraphs: [
      {
        textBefore: 'Sáng nay tại nông trại, sương sớm vừa tan trên những ngọn cỏ non xanh mát. LingLing ngồi bên dòng suối nhỏ, nhớ lại hành trình học tập mà chúng ta đã cùng nhau trải qua. Bò nhận ra rằng để làm chủ bất kỳ ngoại ngữ nào, đức tính ',
        slotIndex: 0,
        textAfter: ' chính là chìa khóa then chốt nhất giúp ta vượt qua những trang sách khó.',
      },
      {
        textBefore: 'Đừng quá sốt ruột nếu có lúc ta chưa nhớ hết từ mới ngay lập tức bạn nhé. Hãy tận hưởng từng bước tiến nhỏ, bởi vì thế giới tri thức này thực sự vô cùng ',
        slotIndex: 1,
        textAfter: ' và mở ra cho ta bao nhiêu chân trời mới lạ.',
      },
    ],
    concludingText: 'Hãy hít thở thật sâu, uống một ngụm trà ấm và tiếp tục rèn luyện cùng Bò nhé!',
    signoff: 'Người bạn bốn chân luôn đồng hành cùng bạn,\nBò LingLing (Ký tên bằng nét mực tím)',
    postmarkCity: 'HÀ NỘI · BƯU CỤC TRUNG TÂM',
  },
  {
    id: 'letter-2',
    title: 'Lá thư tìm thấy trong thư viện cổ',
    envelopeTitle: 'THƯ LƯU NIỆM · TỪ GÓC ĐỌC CỔ KÍNH',
    dateLocation: 'Thư viện cổ thành phố, chiều nắng nhẹ',
    greeting: 'Chào người bạn đồng hành của Bò,',
    paragraphs: [
      {
        textBefore: 'Chiều nay Bò ghé qua một gian sách cũ thơm mùi giấy mộc. Lật tìm những trang từ điển bìa da cổ xưa, Bò cảm phục trước tinh thần ',
        slotIndex: 0,
        textAfter: ' bền bỉ của những học giả đi trước, những người không bao giờ nản lòng trước thất bại.',
      },
      {
        textBefore: 'Mỗi từ vựng bạn học hôm nay đều là một hạt mầm quý báu. Bò hy vọng bạn sẽ luôn biết ',
        slotIndex: 1,
        textAfter: ' từng phút giây được cầm bút viết trên trang giấy này.',
      },
    ],
    concludingText: 'Cuốn sổ tay này sẽ chứng kiến từng ngày bạn trưởng thành hơn trong ngôn ngữ.',
    signoff: 'Thân ái gửi từ phòng đọc,\nBò LingLing',
    postmarkCity: 'TP. HỒ CHÍ MINH · BƯU CỤC 01',
  },
  {
    id: 'letter-3',
    title: 'Tâm sự đêm muộn dưới ánh đèn dầu',
    envelopeTitle: 'THƯ TAY ĐÊM KHUYA · BÒ CHĂM CHỈ',
    dateLocation: 'Bàn học gỗ lim, đêm tĩnh lặng',
    greeting: 'Bạn thân mến,',
    paragraphs: [
      {
        textBefore: 'Đêm đã về khuya, ngoài cửa sổ chỉ còn tiếng gió khẽ lay cành lá. Bò ngồi bên ngọn đèn dầu ấm áp, viết vài dòng nhắn nhủ: chỉ cần bạn duy trì thói quen học tập ',
        slotIndex: 0,
        textAfter: ' mỗi ngày, não bộ sẽ tự động kết nối và ghi nhớ sâu sắc.',
      },
      {
        textBefore: 'Đừng quên rằng thái độ học tập ',
        slotIndex: 1,
        textAfter: ' và kiên định sẽ mang lại kết quả ngọt ngào hơn bất kỳ sự thông minh chốc lát nào.',
      },
    ],
    concludingText: 'Học xong nhớ nghỉ ngơi thật ngon để ngày mai lại tràn đầy năng lượng bạn nhé!',
    signoff: 'Bò LingLing bướng bỉnh nhưng rất tự hào về bạn',
    postmarkCity: 'ĐÀ NẴNG · BƯU CỤC BỜ SÔNG',
  },
];

export function LettersFromLingLing() {
  const [templateIdx, setTemplateIdx] = useState<number>(0);
  const [queueWords, setQueueWords] = useState<SrsWordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [slotInputs, setSlotInputs] = useState<Record<number, string>>({});
  const [checkedResults, setCheckedResults] = useState<Record<number, boolean> | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [showStamp, setShowStamp] = useState<boolean>(false);
  const [isFromForgottenWords, setIsFromForgottenWords] = useState<boolean>(false);
  const [todayVN, setTodayVN] = useState<string>('');

  // 1. Tải từ vựng: ƯU TIÊN lấy từ danh sách từ hay quên của AI Insights trước!
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const vnDate = getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh');
        setTodayVN(vnDate);

        // 1. ƯU TIÊN: Lấy danh sách từ hay quên từ AI Insights
        let prioritized: SrsWordItem[] = [];
        try {
          const fwRes = await api.getForgottenWords(6);
          if (fwRes && fwRes.enabled && Array.isArray(fwRes.items) && fwRes.items.length > 0) {
            prioritized = fwRes.items
              .map((fw: any) => ({
                id: fw.wordId || fw.id,
                targetText: (fw.targetText || '').toLowerCase().trim(),
                translation: fw.translation || 'Nghĩa từ vựng',
                phonetic: fw.phonetic,
                partOfSpeech: fw.partOfSpeech,
              }))
              .filter((w: SrsWordItem) => w.targetText.length > 0);
          }
        } catch {
          // Bỏ qua nếu insights tắt
        }

        if (prioritized.length >= 2) {
          setQueueWords(prioritized);
          setIsFromForgottenWords(true);
          return;
        }

        // 2. Nếu không đủ từ hay quên: Lấy từ SRS Queue thông thường
        const res = await api.getSrsQueue();
        if (res && res.queue && Array.isArray(res.queue) && res.queue.length > 0) {
          const mapped: SrsWordItem[] = res.queue
            .map((item: any) => ({
              id: item.wordId || item.id || `srs-${Math.random()}`,
              targetText: (item.targetText || item.word?.targetText || item.frontText || '').toLowerCase().trim(),
              translation: item.translation || item.word?.translation || item.backText || 'Nghĩa từ vựng',
              phonetic: item.phonetic || item.word?.phoneticUs,
            }))
            .filter((w) => w.targetText.length > 0);

          if (mapped.length >= 2) {
            setQueueWords(prioritized.length > 0 ? [...prioritized, ...mapped] : mapped);
            if (prioritized.length > 0) setIsFromForgottenWords(true);
            return;
          }
        }

        // 3. Fallback tự nhiên nếu queue rỗng
        setQueueWords(prioritized.length > 0 ? [...prioritized, ...FALLBACK_WORDS] : FALLBACK_WORDS);
        if (prioritized.length > 0) setIsFromForgottenWords(true);
      } catch (e) {
        setQueueWords(FALLBACK_WORDS);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const template = LETTER_TEMPLATES[templateIdx];

  // Ghép 2 từ vào 2 slot của lá thư
  const activeWords: [SrsWordItem, SrsWordItem] = [
    queueWords[templateIdx % queueWords.length] || FALLBACK_WORDS[0],
    queueWords[(templateIdx + 1) % queueWords.length] || FALLBACK_WORDS[1],
  ];

  const handleSelectWordChip = (slotIdx: number, word: string) => {
    if (isCompleted) return;
    setSlotInputs((prev) => ({ ...prev, [slotIdx]: word }));
    if (checkedResults) {
      setCheckedResults(null);
    }
  };

  const handleCheckLetter = () => {
    const results: Record<number, boolean> = {};
    [0, 1].forEach((idx) => {
      const input = (slotInputs[idx] || '').trim().toLowerCase();
      const target = activeWords[idx].targetText.toLowerCase().trim();
      results[idx] = input === target;
    });
    setCheckedResults(results);
  };

  const handleFinishLetterSession = async () => {
    if (isCompleted) return;
    try {
      setSubmittingReview(true);
      // Ghi nhận hoàn thành phiên ôn SRS cho các từ trong thư
      for (const w of activeWords) {
        if (w.id && !w.id.startsWith('fallback-')) {
          await api.reviewSrsWord(w.id, 5); // Quality 5: Perfect recall
        }
      }
    } catch (e) {
      console.warn('SRS review completed or fallback logged:', e);
    } finally {
      setSubmittingReview(false);
      setIsCompleted(true);
      setShowStamp(true);
    }
  };

  const handleSwitchTemplate = () => {
    const next = (templateIdx + 1) % LETTER_TEMPLATES.length;
    setTemplateIdx(next);
    setSlotInputs({});
    setCheckedResults(null);
    setIsCompleted(false);
    setShowStamp(false);
  };

  const allSlotsFilled = Boolean(slotInputs[0] && slotInputs[1]);
  const isAllCorrect = checkedResults && checkedResults[0] && checkedResults[1];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left select-none pb-20">
      {/* 1. THANH TIÊU ĐỀ BƯU ĐIỆN BÒ LINGLING */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase text-teal tracking-wider">
            <Feather className="w-3.5 h-3.5" />
            <span>Lá Thư Từ Bò · Ôn Tập SRS Dạng Thư Tay</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink font-serif">
            Hộp Thư Tay Bò LingLing
          </h2>
          <p className="text-xs text-ink-soft">
            Các từ vựng đến hạn ôn tập (SRS Queue) được dệt tự nhiên vào lá thư tay — Điền đúng để hoàn tất phiên ôn tập.
          </p>
        </div>

        <button
          onClick={handleSwitchTemplate}
          className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          title="Đổi mẫu thư khác"
        >
          <Shuffle className="w-3.5 h-3.5 text-red" />
          <span>Mẫu thư khác ({templateIdx + 1}/{LETTER_TEMPLATES.length})</span>
        </button>
      </div>

      {/* 2. KHỐI LÁ THƯ TAY (VINTAGE AIRMAIL ENVELOPE & PARCHMENT PAPER) */}
      <div className="relative bg-[#FFFDF7] border-4 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl overflow-hidden">
        {/* Viền sọc bưu chính hàng không Airmail cổ điển (Xanh - Đỏ) */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-repeating-linear-gradient flex">
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#D64027,#D64027_15px,#FAF5EA_15px,#FAF5EA_30px,#0F766E_30px,#0F766E_45px,#FAF5EA_45px,#FAF5EA_60px)]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-repeating-linear-gradient flex">
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#D64027,#D64027_15px,#FAF5EA_15px,#FAF5EA_30px,#0F766E_30px,#0F766E_45px,#FAF5EA_45px,#FAF5EA_60px)]" />
        </div>

        {/* Header thư: Con dấu bưu chính + Dấu sáp niêm phong */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-dashed border-ink/30 pb-6 pt-2 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-black uppercase text-red tracking-widest block">
              {template.envelopeTitle}
            </span>
            <span className="text-xs font-bold text-ink-muted italic">
              📍 {template.dateLocation} · {todayVN || 'Ngày hôm nay'}
            </span>
          </div>

          {/* DẤU BƯU ĐIỆN VINTAGE (CON DẤU TRÒN MỰC ĐỎ/ĐEN) */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Con dấu bưu phẩm tròn */}
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-red flex flex-col items-center justify-center p-1 text-center transform rotate-6 select-none shadow-brutal-sm bg-paper/60">
              <span className="text-[8px] font-black uppercase text-red leading-none">BƯU CHÍNH</span>
              <span className="text-[9px] font-black text-ink font-mono">{todayVN || 'VIETNAM'}</span>
              <span className="text-[7px] font-bold text-red tracking-tighter">LINGUAL SRS</span>
            </div>

            {/* Dấu sáp đỏ (Wax Seal) */}
            <div className="w-14 h-14 rounded-full bg-[#B22222] border-2 border-[#660000] flex items-center justify-center shadow-brutal text-white text-center transform -rotate-12">
              <span className="text-[10px] font-black font-serif leading-none">LING<br/>LING</span>
            </div>
          </div>
        </div>

        {/* Thân bức thư phong cách giấy kẻ tay */}
        <div className="py-6 space-y-6 lined-paper rounded-xl p-4 sm:p-6 my-4 border border-ink/20 bg-paper/50 font-serif leading-relaxed text-ink">
          {/* Lời chào */}
          <p className="text-lg sm:text-xl font-bold italic text-ink">
            {template.greeting}
          </p>

          {/* Các đoạn văn có chèn Cloze gaps */}
          {template.paragraphs.map((p, idx) => {
            const targetWord = activeWords[p.slotIndex];
            const currentVal = slotInputs[p.slotIndex] || '';
            const isCorrect = checkedResults ? checkedResults[p.slotIndex] : null;

            return (
              <p key={idx} className="text-base sm:text-lg leading-loose text-ink">
                {p.textBefore}

                {/* Ô điền từ khuyết (Cloze Blank) */}
                <span className="inline-block mx-1.5 align-middle">
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => {
                      if (!isCompleted) {
                        setSlotInputs((prev) => ({ ...prev, [p.slotIndex]: e.target.value }));
                        setCheckedResults(null);
                      }
                    }}
                    placeholder={`[Điền: ${targetWord.translation}]`}
                    disabled={isCompleted}
                    className={`px-3 py-1 font-mono font-black text-sm rounded-lg border-2 text-center transition-all outline-none min-w-[160px] sm:min-w-[200px] shadow-brutal-sm ${
                      isCorrect === true
                        ? 'border-teal bg-teal/15 text-teal ring-2 ring-teal/30'
                        : isCorrect === false
                        ? 'border-red bg-red/15 text-red line-through'
                        : 'border-ink bg-card text-ink focus:border-red focus:bg-amber-soft'
                    }`}
                  />
                  {/* Nhãn chấm mực đỏ khoanh tròn nếu đúng */}
                  {isCorrect === true && (
                    <span className="ml-1.5 text-xs text-red font-black border border-red rounded-full px-1.5 py-0.2 bg-card">
                      ✓ Chuẩn
                    </span>
                  )}
                  {/* Gạch chéo và hiện từ đúng nếu sai */}
                  {isCorrect === false && (
                    <span className="ml-1.5 text-xs text-red font-mono font-bold block sm:inline">
                      ↳ Đúng: <b>{targetWord.targetText}</b>
                    </span>
                  )}
                </span>

                {p.textAfter}
              </p>
            );
          })}

          <p className="text-base sm:text-lg font-medium text-ink-soft">
            {template.concludingText}
          </p>

          {/* Lời kết & Ký tên */}
          <div className="pt-4 border-t border-ink/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="whitespace-pre-line text-sm font-bold italic text-ink leading-relaxed">
              {template.signoff}
            </div>

            <div className="flex items-center gap-2">
              <LingLing reaction={isCompleted ? 'proud' : isAllCorrect ? 'thumbsup' : 'studying'} size={68} />
            </div>
          </div>
        </div>

        {/* 3. KHAY TỪ GỢI Ý (WORD BANK CHIPS) CHO NGƯỜI HỌC DỄ CHỌN TRÊN ĐIỆN THOẠI */}
        {!isCompleted && (
          <div className="p-4 bg-paper rounded-2xl border-2 border-ink space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-ink flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-red" />
                <span>Khay mẩu từ gợi ý (Chạm để tự động điền vào chỗ trống):</span>
              </span>
              <span className="text-[11px] text-ink-muted">2 từ vựng từ hàng đợi SRS</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {activeWords.map((w, wIdx) => {
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      // Điền vào slot trống đầu tiên
                      if (!slotInputs[0]) handleSelectWordChip(0, w.targetText);
                      else if (!slotInputs[1]) handleSelectWordChip(1, w.targetText);
                      else handleSelectWordChip(0, w.targetText);
                    }}
                    className="px-3 py-1.5 bg-card hover:bg-amber-soft border-2 border-ink rounded-xl text-xs font-mono font-black text-ink shadow-brutal-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-red font-sans">✎</span>
                    <span>{w.targetText}</span>
                    <span className="text-[10px] text-ink-muted font-sans font-normal">({w.translation})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. HÀNG NÚT CHẤM BÀI & HOÀN TẤT PHIÊN ÔN SRS */}
        <div className="pt-6 border-t-2 border-ink/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSlotInputs({});
                setCheckedResults(null);
                setIsCompleted(false);
                setShowStamp(false);
              }}
              disabled={isCompleted}
              className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tẩy mực làm lại</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!isAllCorrect ? (
              <button
                onClick={handleCheckLetter}
                disabled={!allSlotsFilled}
                className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Feather className="w-4 h-4" />
                <span>Chấm mực thư tay →</span>
              </button>
            ) : !isCompleted ? (
              <button
                onClick={handleFinishLetterSession}
                disabled={submittingReview}
                className="btn btn-teal text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer animate-pulse"
              >
                <Send className="w-4 h-4" />
                <span>{submittingReview ? 'Đang gửi...' : 'Đóng Dấu Bưu Chính & Hoàn Tất Ôn SRS →'}</span>
              </button>
            ) : (
              <span className="text-xs font-black text-teal flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 rounded-xl border border-teal">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã ghi nhận hoàn tất phiên ôn tập SRS!</span>
              </span>
            )}
          </div>
        </div>

        {/* 5. CON DẤU STAMPSLAM HOÀN TẤT THƯ TAY */}
        {showStamp && (
          <div className="mt-6 flex justify-center animate-in zoom-in-95">
            <StampSlam
              variant="circle"
              color="teal"
              size="lg"
              text="ĐÃ ĐỌC THƯ"
              subtext="HOÀN THÀNH PHIÊN SRS"
              className="transform rotate-3"
            />
          </div>
        )}
      </div>
    </div>
  );
}
