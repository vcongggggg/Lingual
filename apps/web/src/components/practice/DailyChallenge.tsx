'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Flame,
  Mail,
  MailOpen
} from 'lucide-react';
import { LingLing } from '../ui/LingLing';
import { StampSlam } from '../ui/StampSlam';
import { api } from '../../lib/api';
import { getFormattedDateInTimezone } from '@linguaflow/domain';

export interface DailyQuestion {
  id: number;
  type: 'vocab_mcq' | 'listening_vocab' | 'grammar';
  typeLabel: string;
  question: string;
  subPrompt?: string;
  targetWord?: string;
  audioText?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  teacherNote: string;
}

const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    id: 1,
    type: 'vocab_mcq',
    typeLabel: '1. Từ vựng ngữ cảnh',
    question: 'Chọn nghĩa chính xác nhất của từ vựng sau trong ngữ cảnh học thuật:',
    subPrompt: 'Perseverance /ˌpɜː.sɪˈvɪə.rəns/ (danh từ)',
    targetWord: 'Perseverance',
    options: [
      { id: 'a', text: 'Sự kiên trì, bền bỉ vượt khó để đạt được mục tiêu lâu dài', isCorrect: true },
      { id: 'b', text: 'Sự ngập ngừng và thiếu tự tin khi ra quyết định', isCorrect: false },
      { id: 'c', text: 'May mắn ngẫu nhiên gặp được trong hành trình học tập', isCorrect: false },
      { id: 'd', text: 'Sự chuẩn bị tạm bợ cho các bài kiểm tra ngắn hạn', isCorrect: false },
    ],
    explanation: 'Perseverance là phẩm chất kiên trì bền bỉ, tiếp tục nỗ lực bất chấp khó khăn thử thách.',
    teacherNote: '💡 Cô giáo ghi chú: Cụm từ hay gặp: "Through sheer perseverance, she mastered fluent English."',
  },
  {
    id: 2,
    type: 'vocab_mcq',
    typeLabel: '2. Từ vựng mở rộng',
    question: 'Trong chủ đề Môi trường & Đô thị, từ "Sustainable" mang ý nghĩa gì?',
    subPrompt: 'Sustainable /səˈsteɪ.nə.bəl/ (tính từ)',
    targetWord: 'Sustainable',
    options: [
      { id: 'a', text: 'Tạm thời, có thể thay đổi bất cứ lúc nào', isCorrect: false },
      { id: 'b', text: 'Phát triển bền vững, duy trì lâu dài không làm tổn hại tương lai', isCorrect: true },
      { id: 'c', text: 'Tốn kém chi phí và chỉ áp dụng cho doanh nghiệp lớn', isCorrect: false },
      { id: 'd', text: 'Nhanh chóng và có hiệu quả tức thì trong ngắn hạn', isCorrect: false },
    ],
    explanation: 'Sustainable nghĩa là bền vững, có thể tiếp tục mà không làm cạn kiệt tài nguyên thiên nhiên.',
    teacherNote: '💡 Cô giáo ghi chú: Kết hợp quen thuộc: "sustainable development" (phát triển bền vững).',
  },
  {
    id: 3,
    type: 'listening_vocab',
    typeLabel: '3. Nghe nhận diện từ vựng',
    question: 'Bấm nút nghe bên dưới và chọn đúng từ tiếng Anh cùng nghĩa tiếng Việt:',
    audioText: 'Resilience',
    subPrompt: 'Nghe phát âm chuẩn bản xứ và chọn cặp từ phù hợp:',
    options: [
      { id: 'a', text: 'Resilience — Khả năng phục hồi, kiên cường vượt nghịch cảnh', isCorrect: true },
      { id: 'b', text: 'Reluctance — Sự miễn cưỡng, không sẵn lòng', isCorrect: false },
      { id: 'c', text: 'Redundancy — Sự dôi dư, sa thải nhân sự thừa', isCorrect: false },
      { id: 'd', text: 'Repentance — Sự ăn năn hối hận về lỗi lầm', isCorrect: false },
    ],
    explanation: 'Từ phát âm là /rɪˈzɪl.jəns/ mang nghĩa khả năng phục hồi, sức bật tinh thần.',
    teacherNote: '💡 Lời nhắc thính giác: Trọng âm rơi vào âm tiết thứ hai: re-SIL-ience.',
  },
  {
    id: 4,
    type: 'listening_vocab',
    typeLabel: '4. Nghe nhận diện từ vựng',
    question: 'Bấm nút nghe và xác định từ vựng được nhắc đến:',
    audioText: 'Collaborate',
    subPrompt: 'Lắng nghe phát âm của Bò LingLing và chọn đáp án chính xác:',
    options: [
      { id: 'a', text: 'Corroborate — Đưa thêm bằng chứng củng cố', isCorrect: false },
      { id: 'b', text: 'Collaborate — Hợp tác, cùng làm việc để đạt kết quả chung', isCorrect: true },
      { id: 'c', text: 'Elaborate — Giải thích chi tiết cặn kẽ', isCorrect: false },
      { id: 'd', text: 'Commemorate — Tưởng niệm sự kiện quan trọng', isCorrect: false },
    ],
    explanation: 'Collaborate /kəˈlæb.ə.reɪt/ là động từ chỉ sự cộng tác, cùng chung sức.',
    teacherNote: '💡 Lời nhắc thính giác: Âm đầu lướt nhẹ /kə/, nhấn mạnh vào /læb/.',
  },
  {
    id: 5,
    type: 'grammar',
    typeLabel: '5. Ngữ pháp trọng điểm',
    question: 'Điền dạng đúng của động từ vào chỗ trống trong câu điều kiện sau:',
    subPrompt: '“If she _______ harder during the training course, she would have passed the evaluation test.”',
    options: [
      { id: 'a', text: 'had studied (Câu điều kiện loại 3 - Giả định trái ngược quá khứ)', isCorrect: true },
      { id: 'b', text: 'studied (Quá khứ đơn - Thường dùng cho điều kiện loại 2)', isCorrect: false },
      { id: 'c', text: 'has studied (Hiện tại hoàn thành)', isCorrect: false },
      { id: 'd', text: 'studies (Hiện tại đơn)', isCorrect: false },
    ],
    explanation: 'Mệnh đề chính dùng "would have passed" (vế sau điều kiện loại 3), do đó mệnh đề IF phải chia thì Quá khứ hoàn thành (had + V3/ed).',
    teacherNote: '💡 Công thức vàng: If + S + had + PII, S + would + have + PII.',
  },
];

export function DailyChallenge() {
  const [questions, setQuestions] = useState<DailyQuestion[]>(DAILY_QUESTIONS);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [todayVN, setTodayVN] = useState<string>('');
  const [formattedDateVN, setFormattedDateVN] = useState<string>('');
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasCheckedCurrent, setHasCheckedCurrent] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(false);
  const [completionRecord, setCompletionRecord] = useState<{
    score: number;
    total: number;
    completedAt: string;
  } | null>(null);
  const [awardingStamp, setAwardingStamp] = useState<boolean>(false);
  const [showStampSlam, setShowStampSlam] = useState<boolean>(false);
  const [timeLeftToMidnight, setTimeLeftToMidnight] = useState<string>('');

  // 0. Tải 5 câu hỏi ngẫu nhiên từ API /api/v1/content/grammar-questions
  useEffect(() => {
    let isMounted = true;
    api.getGrammarQuestions({ random: true, limit: 5 })
      .then((res) => {
        if (!isMounted || !res?.items || res.items.length === 0) return;
        const mapped: DailyQuestion[] = res.items.map((item: any, idx: number) => {
          let opts: string[] = [];
          try {
            opts = typeof item.optionsJson === 'string' ? JSON.parse(item.optionsJson) : (item.optionsJson || []);
          } catch {
            opts = [item.correctAnswer || 'A', 'B', 'C', 'D'];
          }
          return {
            id: idx + 1,
            type: 'grammar' as const,
            typeLabel: `${idx + 1}. Thử thách Ngữ pháp (${item.cefrLevel || 'B1-B2'})`,
            question: item.question,
            subPrompt: item.topic ? `Chủ đề: ${item.topic}` : undefined,
            targetWord: undefined,
            options: opts.map((opt: string, optIdx: number) => {
              const optLetter = String.fromCharCode(97 + optIdx);
              return {
                id: optLetter,
                text: opt,
                isCorrect: opt.trim().toLowerCase() === String(item.correctAnswer || '').trim().toLowerCase(),
              };
            }),
            explanation: item.explanation || 'Hãy lưu ý cấu trúc câu và sự hòa hợp thì/ngữ cảnh.',
            teacherNote: item.hint ? `💡 Gợi ý: ${item.hint}` : '💡 Hãy chú ý ngữ cảnh và cấu trúc câu tương ứng.',
          };
        });
        setQuestions(mapped);
      })
      .catch((err) => {
        console.warn('Fallback to hardcoded daily questions due to API error:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingQuestions(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Khởi tạo ngày theo chuẩn Asia/Ho_Chi_Minh
  useEffect(() => {
    try {
      const now = new Date();
      const vnDateStr = getFormattedDateInTimezone(now, 'Asia/Ho_Chi_Minh');
      setTodayVN(vnDateStr);

      // Định dạng ngày đẹp tiếng Việt: Thứ..., ngày... tháng... năm...
      const vnDateObj = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
      const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][vnDateObj.getDay()];
      setFormattedDateVN(`${dayOfWeek}, ngày ${vnDateObj.getDate()} tháng ${vnDateObj.getMonth() + 1} năm ${vnDateObj.getFullYear()}`);

      // Kiểm tra trạng thái đã hoàn thành hôm nay chưa
      if (typeof window !== 'undefined') {
        const key = `linguaflow_daily_challenge_${vnDateStr}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setIsCompletedToday(true);
            setCompletionRecord(parsed);
            setIsOpened(true);
          } catch {
            // Ignore parse error
          }
        }
      }
    } catch (e) {
      const fallbackStr = new Date().toISOString().split('T')[0];
      setTodayVN(fallbackStr);
    }
  }, []);

  // 2. Bộ đếm ngược thời gian đến 00:00:00 ngày hôm sau tại Asia/Ho_Chi_Minh
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Lấy thời gian hiện tại tại múi giờ VN
      const vnNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
      const midnight = new Date(vnNow);
      midnight.setHours(24, 0, 0, 0);

      const diffMs = midnight.getTime() - vnNow.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeftToMidnight(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setTimeLeftToMidnight('00:00:00');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Phát âm Web Speech Synthesis
  const handlePlayAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.88;
    u.onstart = () => setIsPlayingAudio(true);
    u.onend = () => setIsPlayingAudio(false);
    u.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(u);
  };

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (optId: string) => {
    if (hasCheckedCurrent || isCompletedToday) return;
    setSelectedOptionId(optId);
  };

  const handleCheckCurrent = () => {
    if (!selectedOptionId || hasCheckedCurrent) return;
    setHasCheckedCurrent(true);
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOptionId }));
  };

  const handleNextOrFinish = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasCheckedCurrent(false);
    } else {
      // Hoàn thành cả 5 câu!
      const finalAnswers = { ...userAnswers, [currentQ.id]: selectedOptionId || '' };
      let correctCount = 0;
      questions.forEach((q) => {
        const chosenId = finalAnswers[q.id];
        const opt = q.options.find((o) => o.id === chosenId);
        if (opt?.isCorrect) correctCount++;
      });

      const record = {
        score: correctCount,
        total: questions.length,
        completedAt: new Date().toISOString(),
      };

      // Đóng dấu vào localStorage (theo ngày Asia/Ho_Chi_Minh)
      if (typeof window !== 'undefined' && todayVN) {
        localStorage.setItem(`linguaflow_daily_challenge_${todayVN}`, JSON.stringify(record));
      }

      setIsCompletedToday(true);
      setCompletionRecord(record);
      setShowStampSlam(true);

      // Trao thưởng 1 tem vào sổ tem qua API POST /api/v1/stamps/award
      try {
        setAwardingStamp(true);
        await api.awardStamp('DAILY_GOAL', 1);
      } catch (e) {
        console.warn('Daily goal stamp awarded or offline mode handled:', e);
      } finally {
        setAwardingStamp(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left select-none">
      {/* 1. HEADER: TỜ LỊCH XÉ TAY VINTAGE */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-red/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase text-red tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thử Thách Mỗi Ngày · Lịch Bóc Tay</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-ink font-serif">
              {formattedDateVN || 'Thử thách ngày hôm nay'}
            </h2>
            <p className="text-xs text-ink-soft">
              1 lượt thử thách tổng hợp mỗi ngày — Rèn luyện đều đặn, tích luỹ tem danh giá vào sổ tem.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-xl border-2 border-ink text-xs font-mono font-bold text-ink shadow-brutal-sm">
              <Clock className="w-3.5 h-3.5 text-teal" />
              <span>Đổi ngày sau:</span>
              <span className="text-red font-black">{timeLeftToMidnight || '--:--:--'}</span>
            </div>
            <span className="text-[10px] text-ink-muted">Múi giờ: Asia/Ho_Chi_Minh</span>
          </div>
        </div>
      </div>

      {/* 2. GIAO DIỆN PHONG BÌ THƯ (KHI CHƯA MỞ) */}
      {!isOpened && !isCompletedToday && (
        <div className="bg-[#FAF3E0] border-2 border-ink rounded-3xl p-8 sm:p-12 shadow-brutal-xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-paper border-2 border-ink flex items-center justify-center shadow-brutal">
              <Mail className="w-10 h-10 text-red" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-ink font-serif">
                Phong Bì Thử Thách Hôm Nay Đang Chờ Bạn
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Bên trong gồm <b>5 câu hỏi tổng hợp</b> (2 từ vựng + 2 nghe nhận diện + 1 ngữ pháp). Hoàn thành để nhận ngay <b>+1 Tem Mục Tiêu</b> vào Sổ tem!
              </p>
            </div>

            <div className="p-4 bg-paper rounded-2xl border-2 border-dashed border-ink/40 inline-flex items-center gap-3 text-left">
              <LingLing reaction="pointYou" size={60} />
              <div className="text-xs font-bold text-ink">
                <span className="text-red font-black">Bò LingLing: </span>
                &ldquo;Mỗi ngày chỉ cần 3 phút bóc thư làm bài, phản xạ tiếng Anh sẽ tiến bộ vùn vụt!&rdquo;
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsOpened(true)}
                className="btn btn-red px-8 py-3.5 text-sm font-black shadow-brutal hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
              >
                <MailOpen className="w-4 h-4" />
                <span>Bóc Mở Phong Bì Làm Bài Ngay →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NỘI DUNG 5 CÂU HỎI THỬ THÁCH (KHI ĐANG LÀM) */}
      {isOpened && !isCompletedToday && (
        <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl space-y-6">
          {/* Thanh Tiến Độ 5 Câu */}
          <div className="flex items-center justify-between border-b-2 border-ink pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red text-white text-xs font-black rounded-lg border border-ink shadow-brutal-sm">
                CÂU {currentIdx + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold text-teal hidden sm:inline">
                {currentQ.typeLabel}
              </span>
            </div>

            {/* Vạch tiến độ */}
            <div className="flex items-center gap-1.5">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`w-6 sm:w-8 h-2.5 rounded-full border border-ink transition-all ${
                    idx < currentIdx
                      ? 'bg-teal'
                      : idx === currentIdx
                      ? 'bg-red'
                      : 'bg-paper-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Khung Câu Hỏi */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-ink-muted uppercase">
                Yêu cầu câu hỏi:
              </span>
              <h3 className="text-lg sm:text-xl font-black text-ink font-serif leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Đoạn gợi ý phụ hoặc Từ mục tiêu */}
            {currentQ.subPrompt && (
              <div className="p-4 bg-paper rounded-2xl border-2 border-ink space-y-2">
                <p className="text-base sm:text-lg font-serif font-black text-ink">
                  {currentQ.subPrompt}
                </p>

                {/* Nếu là câu nghe nhận diện: Nút Bấm Nghe */}
                {currentQ.audioText && (
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      onClick={() => handlePlayAudio(currentQ.audioText!)}
                      className={`btn btn-paper text-xs font-black shadow-brutal-sm flex items-center gap-2 cursor-pointer ${
                        isPlayingAudio ? 'bg-amber' : ''
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 text-red ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                      <span>{isPlayingAudio ? 'Đang phát âm...' : 'Bấm nghe lại câu mẫu'}</span>
                    </button>
                    <span className="text-[11px] text-ink-muted italic">
                      (Web Speech Synthesis bản xứ)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Danh sách lựa chọn trả lời */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optStyle = 'bg-paper hover:bg-paper-2 border-ink text-ink';

                if (hasCheckedCurrent) {
                  if (opt.isCorrect) {
                    optStyle = 'bg-teal/15 border-teal text-teal font-black shadow-brutal-sm';
                  } else if (isSelected && !opt.isCorrect) {
                    optStyle = 'bg-red/15 border-red text-red line-through';
                  } else {
                    optStyle = 'opacity-50 border-ink/40 text-ink-muted';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-amber/30 border-ink shadow-brutal-sm';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={hasCheckedCurrent}
                    className={`p-4 rounded-2xl border-2 text-left font-sans text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${optStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-ink flex items-center justify-center text-xs font-mono font-black flex-shrink-0 bg-card">
                        {opt.id.toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {hasCheckedCurrent && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-teal flex-shrink-0" />
                    )}
                    {hasCheckedCurrent && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-red flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Lời giải & Lời cô giáo dặn sau khi bấm kiểm tra */}
            {hasCheckedCurrent && (
              <div className="p-4 bg-paper-2 border-2 border-ink rounded-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="stamp-badge border border-red text-red text-[11px] font-black px-2 py-0.5">
                    GIẢI THÍCH CHI TIẾT
                  </span>
                  <span className="text-xs font-bold text-ink">{currentQ.explanation}</span>
                </div>
                <p className="text-xs font-semibold text-ink-soft border-t border-ink/10 pt-2">
                  {currentQ.teacherNote}
                </p>
              </div>
            )}

            {/* Hàng nút hành động: Kiểm tra / Câu tiếp */}
            <div className="pt-4 flex items-center justify-between border-t border-ink/20">
              <div className="flex items-center gap-2">
                <LingLing reaction={hasCheckedCurrent ? 'proud' : 'studying'} size={48} />
                <span className="text-xs font-semibold text-ink-muted hidden sm:inline">
                  {hasCheckedCurrent
                    ? 'Xuất sắc! Bấm tiếp tục để qua câu mới.'
                    : 'Hãy chọn 1 đáp án và bấm nút kiểm tra.'}
                </span>
              </div>

              {!hasCheckedCurrent ? (
                <button
                  onClick={handleCheckCurrent}
                  disabled={!selectedOptionId}
                  className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <span>Kiểm tra đáp án</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextOrFinish}
                  className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIdx < DAILY_QUESTIONS.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả & Nhận tem →'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TRẠNG THÁI ĐÃ HOÀN THÀNH HÔM NAY (ĐÓNG DẤU & CHẶN CHƠI LẦN 2) */}
      {isCompletedToday && (
        <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl space-y-8 text-center relative overflow-hidden">
          {/* Con Dấu Thưởng StampSlam */}
          {showStampSlam && (
            <div className="flex justify-center">
              <StampSlam
                variant="circle"
                color="red"
                size="lg"
                text="HOÀN THÀNH"
                subtext="+1 TEM MỤC TIÊU"
                className="transform -rotate-6"
              />
            </div>
          )}

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/15 border-2 border-teal rounded-full text-xs font-black text-teal uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>ĐÃ HOÀN THÀNH THỬ THÁCH NGÀY</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-ink font-serif">
              Bạn Đã Thu Hoạch Trọn Vẹn Thử Thách Hôm Nay!
            </h3>

            <p className="text-sm text-ink-soft leading-relaxed">
              Điểm số: <b className="text-red font-mono text-base">{completionRecord?.score ?? 5} / {completionRecord?.total ?? 5}</b> câu chính xác.
              Tem thưởng <b>DAILY_GOAL</b> đã được cộng trực tiếp vào Sổ Tem của bạn!
            </p>
          </div>

          {/* Khối Thông Báo Đếm Ngược Giữ Kỷ Luật 1 Lượt/Ngày */}
          <div className="max-w-md mx-auto p-5 bg-paper rounded-2xl border-2 border-ink shadow-brutal-sm space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red flex-shrink-0" />
              <div>
                <h4 className="text-xs font-black uppercase text-ink">Quy tắc học tập bền vững:</h4>
                <p className="text-xs text-ink-soft">
                  Mỗi ngày chỉ cần 1 lượt để giữ lửa phản xạ. Thử thách mới sẽ tự động mở sau:
                </p>
              </div>
            </div>

            <div className="text-center py-2 bg-paper-2 border border-ink rounded-xl font-mono text-xl font-black text-red">
              ⏳ {timeLeftToMidnight || 'Đang tính...'}
            </div>
            <p className="text-[11px] text-ink-muted text-center italic">
              (Đặt lại vào 00:00:00 theo giờ Việt Nam Asia/Ho_Chi_Minh)
            </p>
          </div>

          {/* Các nút điều hướng tiếp */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/practice" className="btn btn-paper text-xs font-black shadow-brutal">
              ← Về Góc Luyện Tập Giấy
            </Link>
            <Link href="/letters" className="btn btn-red text-xs font-black shadow-brutal">
              Đọc Lá Thư Từ Bò (Ôn SRS) →
            </Link>
            <Link href="/profile" className="btn btn-teal text-xs font-black shadow-brutal">
              Xem Sổ Tem Của Tôi 🏷️
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
