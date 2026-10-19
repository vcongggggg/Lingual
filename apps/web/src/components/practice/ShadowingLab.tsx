'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Keyboard,
  Disc
} from 'lucide-react';
import { LingLing } from '../ui/LingLing';
import { StampSlam } from '../ui/StampSlam';
import { api } from '../../lib/api';

export interface ShadowingPrompt {
  id: number | string;
  sentence: string;
  vietnamese: string;
  phoneticsNote: string;
  level: string;
}

const SHADOWING_PROMPTS: ShadowingPrompt[] = [
  {
    id: 1,
    sentence: "Every morning, I drink a cup of warm water and plan my work for the day.",
    vietnamese: "Mỗi buổi sáng, tôi uống một cốc nước ấm và lên kế hoạch làm việc trong ngày.",
    phoneticsNote: "Hạ giọng ở cuối câu, nối âm nhẹ ở cụm 'and plan my'.",
    level: "A2",
  },
  {
    id: 2,
    sentence: "Consistency and perseverance are more crucial than natural talent when mastering a new skill.",
    vietnamese: "Sự đều đặn và kiên trì quan trọng hơn năng khiếu bẩm sinh khi làm chủ một kỹ năng mới.",
    phoneticsNote: "Nhấn mạnh trọng âm ở 4 từ khóa: Consistency, perseverance, crucial, talent.",
    level: "B2",
  },
  {
    id: 3,
    sentence: "Sustainable development requires collaborative efforts between individuals and local governments.",
    vietnamese: "Phát triển bền vững đòi hỏi nỗ lực chung tay giữa các cá nhân và chính quyền địa phương.",
    phoneticsNote: "Ngắt hơi sau 'requires', phát âm chuẩn âm cuối /ts/ ở 'efforts'.",
    level: "B2",
  },
  {
    id: 4,
    sentence: "Reading classic literature helps broaden your vocabulary and sharpens your analytical thinking.",
    vietnamese: "Đọc văn học kinh điển giúp mở rộng vốn từ và mài giũa tư duy phân tích của bạn.",
    phoneticsNote: "Nối âm 'broaden your', phát âm rõ âm /p/ trong 'sharpens'.",
    level: "C1",
  },
];

interface WordEvaluation {
  originalWord: string;
  cleanWord: string;
  isMatched: boolean;
}

export function ShadowingLab() {
  const [prompts, setPrompts] = useState<ShadowingPrompt[]>(SHADOWING_PROMPTS);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlayingModel, setIsPlayingModel] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [evalResult, setEvalResult] = useState<{
    scorePercent: number;
    wordEvaluations: WordEvaluation[];
    hasEvaluated: boolean;
  } | null>(null);

  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(true);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);
  const [manualInputText, setManualInputText] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const prompt = prompts[currentIdx] || prompts[0] || SHADOWING_PROMPTS[0];

  // 1. Tải câu luyện nói từ database thật
  useEffect(() => {
    let isMounted = true;
    api.getShadowingSentences({ limit: 20, random: true })
      .then((res) => {
        if (!isMounted || !res?.items || res.items.length === 0) return;
        const mapped: ShadowingPrompt[] = res.items.map((item: any, idx: number) => ({
          id: item.id || `shdw-${idx}`,
          sentence: item.textEn || item.sentence,
          vietnamese: item.textVi || item.vietnamese || '',
          phoneticsNote: item.phonetic || `Trình độ ${item.cefrLevel || 'B1'} · Phát âm chuẩn từng từ`,
          level: item.cefrLevel || 'B1',
        })).filter((p) => Boolean(p.sentence));

        if (mapped.length > 0) {
          setPrompts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to load shadowing sentences from API, using fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Kiểm tra hỗ trợ Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeechRec = Boolean(
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      );
      setSpeechRecognitionSupported(hasSpeechRec);
    }
  }, []);

  // 2. Phát âm câu mẫu bằng Web Speech Synthesis
  const handlePlayModelAudio = (rate = 0.9) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(prompt.sentence);
    u.lang = 'en-US';
    u.rate = rate;
    u.onstart = () => setIsPlayingModel(true);
    u.onend = () => setIsPlayingModel(false);
    u.onerror = () => setIsPlayingModel(false);
    window.speechSynthesis.speak(u);
  };

  // 3. Logic Chấm bài kiểu "Cô giáo chấm bài"
  const evaluateTranscript = (spoken: string) => {
    const originalTokens = prompt.sentence.split(/\s+/);
    const spokenTokens = spoken
      .toLowerCase()
      .replace(/[.,!?;:\"\'()]/g, '')
      .split(/\s+/)
      .filter(Boolean);

    let matchCount = 0;
    const wordEvaluations: WordEvaluation[] = originalTokens.map((rawWord) => {
      const clean = rawWord.toLowerCase().replace(/[.,!?;:\"\'()]/g, '');
      const isMatched = spokenTokens.includes(clean);
      if (isMatched) matchCount++;
      return {
        originalWord: rawWord,
        cleanWord: clean,
        isMatched,
      };
    });

    const scorePercent = Math.min(
      100,
      Math.max(0, Math.round((matchCount / originalTokens.length) * 100))
    );

    setEvalResult({
      scorePercent,
      wordEvaluations,
      hasEvaluated: true,
    });
  };

  // 4. Bật / Dừng Thu Âm Nhại Giọng (webkitSpeechRecognition)
  const handleStartRecording = () => {
    setMicErrorMessage(null);
    setSpokenTranscript('');
    setEvalResult(null);

    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechRecognitionSupported(false);
      setMicErrorMessage(
        'Trình duyệt của bạn hiện chưa hỗ trợ Web SpeechRecognition. Bạn có thể sử dụng chế độ gõ tay đối chiếu bên dưới!'
      );
      setManualInputMode(true);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSpokenTranscript(text);
        setIsRecording(false);
        evaluateTranscript(text);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicErrorMessage(
            'Quyền Micro bị từ chối. Vui lòng cấp quyền micro trên thanh địa chỉ trình duyệt, hoặc chuyển sang chế độ gõ câu bên dưới.'
          );
        } else if (event.error === 'no-speech') {
          setMicErrorMessage('Chưa nghe thấy giọng nói. Hãy bấm mic và nói to, rõ ràng hơn nhé!');
        } else {
          setMicErrorMessage(
            `Không thể ghi âm (${event.error}). Bạn có thể dùng ô gõ kiểm tra bên dưới.`
          );
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setMicErrorMessage('Không thể khởi động micro. Bạn có thể dùng ô gõ kiểm tra bên dưới.');
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsRecording(false);
  };

  const handleManualEvaluate = () => {
    if (!manualInputText.trim()) return;
    setSpokenTranscript(manualInputText.trim());
    evaluateTranscript(manualInputText.trim());
  };

  const handleNextPrompt = () => {
    const next = (currentIdx + 1) % prompts.length;
    setCurrentIdx(next);
    setSpokenTranscript('');
    setEvalResult(null);
    setManualInputText('');
    setMicErrorMessage(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleReset = () => {
    setSpokenTranscript('');
    setEvalResult(null);
    setManualInputText('');
    setMicErrorMessage(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Phản ứng của Bò theo điểm
  const getMascotReaction = () => {
    if (!evalResult) return 'mic';
    if (evalResult.scorePercent >= 80) return 'proud';
    if (evalResult.scorePercent < 50) return 'laughTease';
    return 'studying';
  };

  const getMascotBubble = () => {
    if (!evalResult) return 'Bò phát âm mẫu xong rồi, tới lượt bạn nhại giọng lại xem nào!';
    if (evalResult.scorePercent >= 80) {
      return 'Bò bái phục! Ngữ điệu và phát âm chuẩn chỉnh như người bản xứ rồi bạn ơi! 🎉';
    }
    if (evalResult.scorePercent < 50) {
      return 'Hihi, lưỡi líu vào nhau rồi kìa! Nhại lại một lần nữa xem có thắng Bò không nào! 😜';
    }
    return 'Khá lắm! Chỉ cần thêm chút dứt khoát ở các phụ âm cuối là đạt điểm tuyệt đối nha! ✨';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left select-none pb-20">
      {/* 1. HEADER CHẾ ĐỘ BÒ NHẠI TIẾNG */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase text-red tracking-wider">
            <Mic className="w-3.5 h-3.5" />
            <span>Phòng Luyện Phát Âm · Bò Nhại Tiếng (Shadowing)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink font-serif">
            Bò Nhại Tiếng · Chấm Bài Kiểu Cô Giáo
          </h2>
          <p className="text-xs text-ink-soft">
            Lắng nghe câu mẫu của Bò LingLing, bấm micro nhại lại ngay lập tức và xem cô giáo chấm từng từ bằng bút đỏ!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-paper rounded-xl border border-ink text-xs font-mono font-black text-ink shadow-brutal-sm">
            CÂU {currentIdx + 1} / {prompts.length}
          </span>
          <span className="stamp-badge border border-teal text-teal text-xs font-black px-2 py-1">
            {prompt.level}
          </span>
        </div>
      </div>

      {/* 2. KHUNG PHÁT ÂM CỦA BÒ LINGLING VỚI BONG BÓNG THOẠI VẼ TAY */}
      <div className="bg-[#FFFDF8] border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl space-y-6 relative overflow-hidden">
        {/* Linh vật LingLing & Bong bóng thoại vẽ tay */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b-2 border-ink/20">
          <div className="flex-shrink-0">
            <LingLing
              reaction={getMascotReaction() as any}
              size={110}
              animate={true}
            />
          </div>

          {/* Bong bóng thoại vẽ tay (Hand-drawn speech bubble) */}
          <div className="flex-1 bg-paper border-2 border-ink rounded-2xl p-4 sm:p-5 relative shadow-brutal-sm">
            {/* Mũi nhọn tam giác bong bóng thoại */}
            <div className="hidden sm:block absolute -left-2.5 top-8 w-5 h-5 bg-paper border-l-2 border-b-2 border-ink transform rotate-45" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-ink">
                <span className="text-red flex items-center gap-1 font-mono uppercase tracking-wide">
                  <Volume2 className="w-4 h-4" /> Bò LingLing nói:
                </span>
                <span className="text-[11px] text-ink-muted italic">{getMascotBubble()}</span>
              </div>

              {/* Câu tiếng Anh bản xứ */}
              <p className="text-lg sm:text-2xl font-serif font-black text-ink leading-snug">
                &ldquo;{prompt.sentence}&rdquo;
              </p>

              {/* Nghĩa tiếng Việt */}
              <p className="text-xs sm:text-sm font-sans font-bold text-teal">
                ↳ {prompt.vietnamese}
              </p>

              {/* Lời nhắc ngữ điệu */}
              <div className="text-[11px] text-ink-muted italic border-t border-ink/10 pt-1.5 flex items-center gap-1">
                <span>💡 Ngữ điệu & phát âm:</span>
                <span className="font-semibold text-ink-soft">{prompt.phoneticsNote}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nút bấm nghe câu mẫu */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => handlePlayModelAudio(0.88)}
            className={`btn btn-paper text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer ${
              isPlayingModel ? 'bg-amber' : ''
            }`}
          >
            <Play className={`w-4 h-4 text-red ${isPlayingModel ? 'animate-spin' : ''}`} />
            <span>{isPlayingModel ? 'Đang phát âm mẫu...' : '1. Nghe Bò nói mẫu (Tốc độ chuẩn)'}</span>
          </button>

          <button
            onClick={() => handlePlayModelAudio(0.72)}
            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer text-ink-soft"
            title="Nghe chậm để bắt rõ từng âm tiết"
          >
            <span>Nghe chậm (0.75x)</span>
          </button>
        </div>

        {/* 3. KHU VỰC THU ÂM NHẠI GIỌNG CỦA HỌC VIÊN */}
        <div className="p-6 bg-paper rounded-2xl border-2 border-ink text-center space-y-4 shadow-brutal-sm">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-ink">
              2. Bấm micro và nhại lại câu vừa nghe (Web Speech Recognition en-US):
            </span>
            <p className="text-[11px] text-ink-muted">
              Nói to, rõ ràng bằng tiếng Anh. Hệ thống sẽ lắng nghe và tự động chấm điểm khi bạn dứt câu.
            </p>
          </div>

          {/* Nút Bật Micro Nhại Giọng */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="btn btn-red px-8 py-3.5 text-sm font-black shadow-brutal hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                <span>BẬT MICRO & NHẠI GIỌNG NGAY</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="btn bg-red text-white border-2 border-ink px-8 py-3.5 text-sm font-black shadow-brutal animate-pulse cursor-pointer flex items-center gap-2"
              >
                <Square className="w-5 h-5 fill-white" />
                <span>Đang nghe bạn nói... (Bấm để kết thúc)</span>
              </button>
            )}

            <button
              onClick={() => setManualInputMode((prev) => !prev)}
              className="btn btn-paper text-xs font-bold text-ink-soft flex items-center gap-1.5 cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{manualInputMode ? 'Ẩn ô gõ tay' : 'Chế độ gõ phím đối chiếu'}</span>
            </button>
          </div>

          {/* Cảnh báo lỗi Micro hoặc trình duyệt không hỗ trợ (Fallback mượt mà) */}
          {micErrorMessage && (
            <div className="p-3 bg-red/10 border border-red rounded-xl text-left text-xs text-red font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{micErrorMessage}</span>
                <p className="text-[11px] text-ink-muted font-normal">
                  Bạn có thể dùng ô nhập bàn phím bên dưới để đối chiếu kết quả mà không cần micro.
                </p>
              </div>
            </div>
          )}

          {/* Ô nhập bàn phím thủ công (Fallback mượt mà không crash, không đứng hình) */}
          {manualInputMode && (
            <div className="p-4 bg-card border-2 border-ink rounded-xl text-left space-y-3 animate-in fade-in">
              <span className="text-xs font-black uppercase text-ink flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-teal" />
                <span>Gõ lại câu tiếng Anh bạn vừa nói/nghe:</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInputText}
                  onChange={(e) => setManualInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualEvaluate()}
                  placeholder="Gõ lại câu tiếng Anh tại đây để cô giáo chấm bài..."
                  className="flex-1 px-4 py-2 border-2 border-ink rounded-xl font-mono text-xs font-bold bg-paper focus:bg-white outline-none"
                />
                <button
                  onClick={handleManualEvaluate}
                  disabled={!manualInputText.trim()}
                  className="btn btn-teal text-xs font-black shadow-brutal cursor-pointer disabled:opacity-40"
                >
                  Chấm bài
                </button>
              </div>
            </div>
          )}

          {/* Văn bản ghi nhận được */}
          {spokenTranscript && (
            <div className="p-3 bg-card border border-ink rounded-xl text-left text-xs space-y-1">
              <span className="text-[10px] font-mono font-black uppercase text-ink-muted">
                Giọng nói nhận diện được:
              </span>
              <p className="font-mono text-sm font-bold text-ink italic">
                &ldquo;{spokenTranscript}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* 4. GIAO DIỆN "CÔ GIÁO CHẤM BÀI" (TỪ ĐÚNG TÔ XANH + KHOANH MỰC ĐỎ, TỪ SAI GẠCH CHÉO ĐỎ) */}
        {evalResult && (
          <div className="p-6 bg-[#FAF5EB] border-2 border-ink rounded-2xl space-y-6 shadow-brutal animate-in fade-in">
            {/* Header chấm điểm & Con dấu điểm */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-ink pb-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-black font-mono uppercase text-red flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>KẾT QUẢ CÔ GIÁO CHẤM BÀI:</span>
                </span>
                <p className="text-xs text-ink-soft">
                  Từ đúng được tô xanh và khoanh tròn mực đỏ · Từ phát âm chưa khớp bị gạch chéo đỏ.
                </p>
              </div>

              {/* CON DẤU ĐIỂM SỐ STAMPSLAM */}
              <div className="flex items-center gap-3 self-center sm:self-auto">
                <StampSlam
                  variant="circle"
                  color={evalResult.scorePercent >= 80 ? 'red' : evalResult.scorePercent >= 50 ? 'teal' : 'red'}
                  size="md"
                  text={`${evalResult.scorePercent}%`}
                  subtext={evalResult.scorePercent >= 80 ? 'XUẤT SẮC' : evalResult.scorePercent >= 50 ? 'KHÁ LẮM' : 'CỐ LÊN NHÉ'}
                  className="transform -rotate-6"
                />
              </div>
            </div>

            {/* DÒNG CHỮ VĂN BẢN VỚI MỰC ĐỎ CÔ GIÁO KHOANH TRÒN */}
            <div className="p-6 bg-paper rounded-2xl border-2 border-ink lined-paper space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-ink-muted block">
                Bảng đối chiếu từng từ:
              </span>

              <div className="flex flex-wrap gap-x-2 gap-y-3 items-center text-lg sm:text-xl font-serif font-black leading-relaxed">
                {evalResult.wordEvaluations.map((w, idx) => {
                  if (w.isMatched) {
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full border-2 border-red bg-teal/15 text-ink shadow-brutal-sm"
                        title="Phát âm chuẩn xác!"
                      >
                        <span className="text-teal mr-1 text-xs">✓</span>
                        <span>{w.originalWord}</span>
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={idx}
                        className="inline-block px-1.5 py-0.5 line-through decoration-red text-red-600 decoration-2 italic"
                        title="Từ này bị phát âm lướt hoặc chưa nhận diện đúng"
                      >
                        {w.originalWord}
                      </span>
                    );
                  }
                })}
              </div>

              <div className="pt-3 border-t border-ink/20 flex flex-wrap items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-teal">
                  <span className="w-3 h-3 rounded-full border border-red bg-teal/20 inline-block" />
                  Đúng: {evalResult.wordEvaluations.filter((w) => w.isMatched).length} từ
                </span>
                <span className="flex items-center gap-1.5 text-red">
                  <span className="w-3 h-3 border border-red bg-red/20 inline-block line-through" />
                  Cần cải thiện: {evalResult.wordEvaluations.filter((w) => !w.isMatched).length} từ
                </span>
              </div>
            </div>

            {/* Hàng nút chuyển câu / làm lại */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nhại lại câu này</span>
              </button>

              <button
                onClick={handleNextPrompt}
                className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
              >
                <span>Qua câu tiếp theo →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
