'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Ear,
  Search,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Headphones,
  Check,
  ChevronRight,
  Shuffle
} from 'lucide-react';
import { LingLing } from '../ui/LingLing';
import { StampSlam } from '../ui/StampSlam';
import { api } from '../../lib/api';

interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: string;
  avatarText: string;
  gender: 'male' | 'female';
  textEn: string;
  textVi: string;
}

interface EavesdropQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  evidenceLineId: string;
  transcriptQuote: string;
  explanation: string;
}

interface DialogueScenario {
  id: string;
  title: string;
  location: string;
  characters: string;
  contextDesc: string;
  lines: DialogueLine[];
  questions: EavesdropQuestion[];
}

const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: 'cafe-interview',
    title: 'Cuộc Hẹn Phỏng Vấn Bí Mật Tại Quán Cà Phê',
    location: 'Góc khuất quán cà phê phố cổ, 10 giờ sáng',
    characters: 'David (Giám đốc dự án) & Sarah (Ứng viên cao cấp)',
    contextDesc: 'Bò LingLing đang nấp sau chậu cây cảnh, dỏng tai nghe lén cuộc phỏng vấn cơ hội việc làm bảo mật cao...',
    lines: [
      {
        id: 'line-1',
        speaker: 'David',
        speakerRole: 'Giám đốc dự án',
        avatarText: 'D',
        gender: 'male',
        textEn: 'Good morning, Sarah. Thanks for meeting me at this quiet cafe. We were truly impressed by your portfolio, especially your project on sustainable urban transport.',
        textVi: 'Chào buổi sáng, Sarah. Cảm ơn em đã hẹn gặp ở quán cà phê yên tĩnh này. Phía công ty rất ấn tượng với hồ sơ của em, đặc biệt là dự án giao thông đô thị bền vững.',
      },
      {
        id: 'line-2',
        speaker: 'Sarah',
        speakerRole: 'Ứng viên',
        avatarText: 'S',
        gender: 'female',
        textEn: 'Thank you, David. I firmly believe reducing traffic congestion requires collaborative efforts between public authorities and green startups.',
        textVi: 'Cảm ơn anh David. Em luôn tin rằng việc giảm thiểu ùn tắc giao thông đòi hỏi nỗ lực chung tay giữa chính quyền và các doanh nghiệp khởi nghiệp xanh.',
      },
      {
        id: 'line-3',
        speaker: 'David',
        speakerRole: 'Giám đốc dự án',
        avatarText: 'D',
        gender: 'male',
        textEn: 'Exactly. Our core team is expanding rapidly, and we need someone who can lead this initiative starting next month. The probation period is three months with full health benefits.',
        textVi: 'Chính xác. Đội ngũ nòng cốt đang mở rộng nhanh chóng và chúng tôi cần một người dẫn dắt dự án bắt đầu từ tháng sau. Thời gian thử việc là ba tháng với đầy đủ bảo hiểm.',
      },
      {
        id: 'line-4',
        speaker: 'Sarah',
        speakerRole: 'Ứng viên',
        avatarText: 'S',
        gender: 'female',
        textEn: 'That timeline aligns perfectly with my current availability. I would be thrilled to contribute my experience to the organization.',
        textVi: 'Tiến độ đó hoàn toàn khớp với kế hoạch của em. Em rất hào hứng được đóng góp kinh nghiệm của mình cho tổ chức.',
      },
    ],
    questions: [
      {
        id: 1,
        question: 'David ấn tượng nhất với phần nào trong hồ sơ của Sarah?',
        options: [
          { id: 'a', text: 'Dự án về giao thông đô thị bền vững (sustainable urban transport)', isCorrect: true },
          { id: 'b', text: 'Chứng chỉ ngoại ngữ IELTS 8.5', isCorrect: false },
          { id: 'c', text: 'Kinh nghiệm làm việc tại tập đoàn nước ngoài trong 10 năm', isCorrect: false },
        ],
        evidenceLineId: 'line-1',
        transcriptQuote: 'David: "...especially your project on sustainable urban transport."',
        explanation: 'David khen ngợi trực tiếp dự án giao thông đô thị bền vững của Sarah.',
      },
      {
        id: 2,
        question: 'Theo lời David, dự án mới dự kiến sẽ bắt đầu vào khi nào?',
        options: [
          { id: 'a', text: 'Ngay vào thứ Hai tuần tới', isCorrect: false },
          { id: 'b', text: 'Bắt đầu từ tháng sau (starting next month)', isCorrect: true },
          { id: 'c', text: 'Đầu năm sau sau kỳ nghỉ lễ', isCorrect: false },
        ],
        evidenceLineId: 'line-3',
        transcriptQuote: 'David: "...and we need someone who can lead this initiative starting next month."',
        explanation: 'David khẳng định dự án cần người dẫn dắt bắt đầu từ tháng sau.',
      },
      {
        id: 3,
        question: 'Thời gian thử việc (probation period) được đưa ra là bao lâu?',
        options: [
          { id: 'a', text: '1 tháng thử việc không lương', isCorrect: false },
          { id: 'b', text: '6 tháng đánh giá năng lực định kỳ', isCorrect: false },
          { id: 'c', text: '3 tháng với đầy đủ quyền lợi bảo hiểm (three months with full benefits)', isCorrect: true },
        ],
        evidenceLineId: 'line-3',
        transcriptQuote: 'David: "The probation period is three months with full health benefits."',
        explanation: 'Thời gian thử việc được David thông báo rõ ràng là 3 tháng.',
      },
      {
        id: 4,
        question: 'Thái độ của Sarah đối với mốc thời gian và công việc như thế nào?',
        options: [
          { id: 'a', text: 'Rất hào hứng và thấy hoàn toàn phù hợp với lịch trình (thrilled & perfectly aligns)', isCorrect: true },
          { id: 'b', text: 'Ngập ngừng vì muốn lùi lịch lại thêm hai tháng', isCorrect: false },
          { id: 'c', text: 'Từ chối vì muốn tìm việc làm từ xa toàn thời gian', isCorrect: false },
        ],
        evidenceLineId: 'line-4',
        transcriptQuote: 'Sarah: "That timeline aligns perfectly with my current availability. I would be thrilled..."',
        explanation: 'Sarah đồng ý ngay vì thời gian rất phù hợp và cô rất hào hứng cống hiến.',
      },
    ],
  },
  {
    id: 'farewell-party',
    title: 'Kế Hoạch Bữa Tiệc Tri Ân Bất Ngờ',
    location: 'Hành lang sau thư viện trường học, 4 giờ chiều',
    characters: 'Tom (Lớp trưởng) & Emma (Phó ban sự kiện)',
    contextDesc: 'Bò LingLing đang nấp sau cánh cửa ngách, nghe lỏm kế hoạch tổ chức tiệc bí mật cho thầy giáo...',
    lines: [
      {
        id: 'f-line-1',
        speaker: 'Tom',
        speakerRole: 'Lớp trưởng',
        avatarText: 'T',
        gender: 'male',
        textEn: 'Emma, keep your voice down! Mr. Henderson is grading exam papers in the teachers lounge right next door. Did you secure the auditorium for Friday?',
        textVi: 'Emma, nói nhỏ thôi! Thầy Henderson đang chấm bài thi trong phòng giáo viên ngay cạnh đấy. Cậu đã đặt được hội trường cho thứ Sáu chưa?',
      },
      {
        id: 'f-line-2',
        speaker: 'Emma',
        speakerRole: 'Ban sự kiện',
        avatarText: 'E',
        gender: 'female',
        textEn: 'Yes, I reserved the secondary auditorium from five to eight PM. The student committee also approved our decoration budget this morning.',
        textVi: 'Rồi, tớ đã giữ hội trường phụ từ 5 giờ đến 8 giờ tối. Ban đại diện học sinh cũng vừa duyệt kinh phí trang trí sáng nay.',
      },
      {
        id: 'f-line-3',
        speaker: 'Tom',
        speakerRole: 'Lớp trưởng',
        avatarText: 'T',
        gender: 'male',
        textEn: 'Wonderful. What about the farewell gift? Did we order the vintage fountain pen engraved with his name?',
        textVi: 'Tuyệt quá. Còn món quà tri ân thì sao? Chúng mình đã đặt chiếc bút máy cổ điển khắc tên thầy chưa?',
      },
      {
        id: 'f-line-4',
        speaker: 'Emma',
        speakerRole: 'Ban sự kiện',
        avatarText: 'E',
        gender: 'female',
        textEn: 'It will arrive on Thursday morning. All thirty classmates have secretly signed their wishes on the handcrafted card.',
        textVi: 'Bút sẽ được giao vào sáng thứ Năm. Tất cả ba mươi bạn trong lớp đều đã bí mật viết lời chúc lên tấm thiệp thủ công rồi.',
      },
    ],
    questions: [
      {
        id: 1,
        question: 'Thầy Henderson đang làm gì trong phòng giáo viên cạnh đó?',
        options: [
          { id: 'a', text: 'Đang chấm bài thi (grading exam papers)', isCorrect: true },
          { id: 'b', text: 'Đang họp hội đồng nhà trường', isCorrect: false },
          { id: 'c', text: 'Đang chuẩn bị đề thi học kỳ', isCorrect: false },
        ],
        evidenceLineId: 'f-line-1',
        transcriptQuote: 'Tom: "Mr. Henderson is grading exam papers in the teachers lounge..."',
        explanation: 'Tom nhắc Emma nói khẽ vì thầy đang chấm bài ngay sát phòng bên.',
      },
      {
        id: 2,
        question: 'Hội trường được đặt cho bữa tiệc vào khung giờ nào?',
        options: [
          { id: 'a', text: 'Từ 5 giờ chiều đến 8 giờ tối thứ Sáu (5 PM to 8 PM)', isCorrect: true },
          { id: 'b', text: 'Cả ngày thứ Bảy cuối tuần', isCorrect: false },
          { id: 'c', text: 'Buổi trưa thứ Năm sau giờ tan trường', isCorrect: false },
        ],
        evidenceLineId: 'f-line-2',
        transcriptQuote: 'Emma: "I reserved the secondary auditorium from five to eight PM."',
        explanation: 'Emma xác nhận đã đặt hội trường phụ từ 5h đến 8h tối thứ Sáu.',
      },
      {
        id: 3,
        question: 'Món quà tri ân đặc biệt mà lớp dành tặng thầy là gì?',
        options: [
          { id: 'a', text: 'Chiếc bút máy cổ điển khắc tên thầy (vintage fountain pen engraved with his name)', isCorrect: true },
          { id: 'b', text: 'Một bó hoa hồng và chiếc đồng hồ đeo tay', isCorrect: false },
          { id: 'c', text: 'Một bộ tài liệu giảng dạy điện tử', isCorrect: false },
        ],
        evidenceLineId: 'f-line-3',
        transcriptQuote: 'Tom: "Did we order the vintage fountain pen engraved with his name?"',
        explanation: 'Món quà ý nghĩa là chiếc bút máy có khắc tên thầy giáo.',
      },
      {
        id: 4,
        question: 'Có bao nhiêu bạn học đã bí mật ký tên vào tấm thiệp thủ công?',
        options: [
          { id: 'a', text: 'Tất cả 30 bạn trong lớp (All thirty classmates)', isCorrect: true },
          { id: 'b', text: 'Chỉ có Tom và Emma', isCorrect: false },
          { id: 'c', text: 'Khoảng 15 bạn trong ban cán sự', isCorrect: false },
        ],
        evidenceLineId: 'f-line-4',
        transcriptQuote: 'Emma: "All thirty classmates have secretly signed their wishes..."',
        explanation: 'Cả 30 thành viên trong lớp đều đã bí mật viết lời chúc tri ân.',
      },
    ],
  },
];

export function CowEavesdrop() {
  const [scenarios, setScenarios] = useState<DialogueScenario[]>(DIALOGUE_SCENARIOS);
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [isPlayingFull, setIsPlayingFull] = useState<boolean>(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [playingEvidenceId, setPlayingEvidenceId] = useState<string | null>(null);

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDialogues() {
      try {
        const res = await api.getDialogues({ limit: 10, random: true });
        if (isMounted && res?.items && res.items.length > 0) {
          const mapped: DialogueScenario[] = res.items
            .map((item: any, idx: number) => ({
              id: item.id || `dlg-${idx}`,
              title: item.title || 'Đoạn đối thoại',
              location: item.location || 'Cuộc trò chuyện thường nhật',
              characters: typeof item.characters === 'string'
                ? item.characters
                : (Array.isArray(item.characters) ? item.characters.join(', ') : 'Nhân vật A & B'),
              contextDesc: item.contextDesc || item.topicVi || item.topic || 'Lắng nghe kỹ để trả lời câu hỏi.',
              lines: Array.isArray(item.lines) ? item.lines : [],
              questions: Array.isArray(item.questions) ? item.questions : [],
            }))
            .filter((s) => s.lines.length > 0 && s.questions.length > 0);

          if (mapped.length > 0) {
            setScenarios(mapped);
          }
        }
      } catch (err) {
        console.warn('Fallback to local dialogue scenarios:', err);
      }
    }
    loadDialogues();
    return () => {
      isMounted = false;
    };
  }, []);

  const scenario = scenarios[scenarioIdx] || scenarios[0];

  // Phát âm một dòng đơn bằng Web Speech Synthesis
  const speakLine = (line: DialogueLine, onComplete?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(line.textEn);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.pitch = line.gender === 'female' ? 1.15 : 0.85;
    u.onend = () => onComplete?.();
    u.onerror = () => onComplete?.();
    window.speechSynthesis.speak(u);
  };

  // Phát toàn bộ cuộc hội thoại lần lượt
  const handlePlayFullDialogue = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingFull) {
      window.speechSynthesis.cancel();
      setIsPlayingFull(false);
      setActiveLineId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingFull(true);

    let lineIndex = 0;
    const playNext = () => {
      if (lineIndex < scenario.lines.length) {
        const line = scenario.lines[lineIndex];
        setActiveLineId(line.id);
        lineIndex++;
        speakLine(line, () => {
          setTimeout(playNext, 400); // Khoảng nghỉ tự nhiên giữa 2 lượt nói
        });
      } else {
        setIsPlayingFull(false);
        setActiveLineId(null);
      }
    };

    playNext();
  };

  // NÚT "NGHE LẠI ĐOẠN CHỨNG CỨ" của từng câu hỏi
  const handlePlayEvidence = (lineId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlayingFull(false);
    setPlayingEvidenceId(lineId);
    setActiveLineId(lineId);

    const targetLine = scenario.lines.find((l) => l.id === lineId);
    if (targetLine) {
      speakLine(targetLine, () => {
        setPlayingEvidenceId(null);
      });
    }
  };

  const handleSelectAnswer = (qId: number, optId: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSwitchScenario = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingFull(false);
    setActiveLineId(null);
    setPlayingEvidenceId(null);
    setUserAnswers({});
    setHasSubmittedQuiz(false);
    setShowTranscript(false);
    setScenarioIdx((prev) => (prev + 1) % scenarios.length);
  };

  // Tính điểm
  const correctCount = (scenario?.questions || []).filter(
    (q) => userAnswers[q.id] && q.options.find((o) => o.id === userAnswers[q.id])?.isCorrect
  ).length;

  const totalQuestions = scenario?.questions?.length || 1;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isAllAnswered = (scenario?.questions || []).every((q) => userAnswers[q.id]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left select-none pb-20">
      {/* 1. HEADER CHẾ ĐỘ BÒ ĐỌC TRỘM */}
      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red/15 border border-red rounded-full text-xs font-black uppercase text-red tracking-wider">
            <Ear className="w-3.5 h-3.5" />
            <span>Phòng Nghe Lén · Bò Đọc Trộm</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink font-serif">
            Bò Nghe Lén · Thám Tử Hóng Hớt
          </h2>
          <p className="text-xs text-ink-soft">
            Shhh... Bò LingLing nghe lén được một đoạn đối thoại bí mật giữa 2 người. Hãy cùng Bò giải mã nội dung nhé!
          </p>
        </div>

        <button
          onClick={handleSwitchScenario}
          className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-red" />
          <span>Đổi đoạn đối thoại khác ({scenarioIdx + 1}/{scenarios.length})</span>
        </button>
      </div>

      {/* 2. KHU VỰC KHÔNG KHÍ "HÓNG HỚT" & MÁY PHÁT HỘI THOẠI 2 NGƯỜI */}
      <div className="bg-[#FFFDF7] border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl space-y-6 relative overflow-hidden">
        {/* Nhãn dán bí mật 'Shhh...' góc trên */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-dashed border-ink/30 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber border-2 border-ink flex items-center justify-center shadow-brutal-sm text-ink font-black text-lg">
              🤫
            </div>
            <div>
              <span className="text-xs font-mono font-black text-red uppercase tracking-wider block">
                TẬP TIN MẬT: {scenario.title}
              </span>
              <p className="text-xs font-bold text-ink-muted italic">
                📍 {scenario.location} · Nhân vật: {scenario.characters}
              </p>
            </div>
          </div>

          <span className="stamp-badge border border-ink text-ink text-[11px] font-black px-2.5 py-1">
            SHHH... ĐANG HÓNG HỚT
          </span>
        </div>

        {/* Khối Linh vật Bò nghe lén & Lời dẫn dắt */}
        <div className="p-4 bg-paper rounded-2xl border-2 border-ink flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <LingLing reaction="sneaky" size={76} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-red">
              <span>Bò Thám Tử LingLing thì thầm:</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-ink leading-relaxed">
              &ldquo;{scenario.contextDesc} Bấm nút phát âm bên dưới để nghe trọn vẹn cuộc trò chuyện của họ nào!&rdquo;
            </p>
          </div>
        </div>

        {/* BỘ NÚT ĐIỀU KHIỂN PHÁT HỘI THOẠI 2 GIỌNG */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePlayFullDialogue}
            className="btn btn-red px-6 py-3 text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            {isPlayingFull ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Đang nghe lén... (Bấm để tạm dừng)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>1. Phát trọn vẹn đoạn hội thoại (2 giọng nói)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className="btn btn-paper text-xs font-bold text-ink-soft flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showTranscript ? 'Ẩn bản gỡ băng' : 'Xem bản gỡ băng (Lời thoại)'}</span>
          </button>
        </div>

        {/* KHUNG HIỂN THỊ LỜI THOẠI BONG BÓNG (NẾU MỞ HOẶC KHI ĐANG PHÁT) */}
        {(showTranscript || isPlayingFull || playingEvidenceId) && (
          <div className="space-y-3 p-4 bg-paper rounded-2xl border-2 border-ink animate-in fade-in">
            <span className="text-[11px] font-mono font-black text-ink-muted uppercase block">
              Ghi chép nghe lén của Bò LingLing:
            </span>

            {scenario.lines.map((line) => {
              const isActive = activeLineId === line.id;
              const isEvidence = playingEvidenceId === line.id;

              return (
                <div
                  key={line.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                    isActive || isEvidence
                      ? 'bg-amber/30 border-red ring-2 ring-red -translate-y-0.5 shadow-brutal-sm'
                      : 'bg-card border-ink/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center font-mono font-black text-xs flex-shrink-0 shadow-sm ${
                    line.gender === 'female' ? 'bg-red/20 text-red' : 'bg-teal/20 text-teal'
                  }`}>
                    {line.avatarText}
                  </div>

                  <div className="space-y-1 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-ink">
                        {line.speaker} <span className="text-[10px] text-ink-muted font-normal">({line.speakerRole})</span>
                      </span>
                      {(isActive || isEvidence) && (
                        <span className="text-[10px] font-mono font-black text-red flex items-center gap-1">
                          <Volume2 className="w-3 h-3 animate-bounce" /> Đang nói...
                        </span>
                      )}
                    </div>
                    <p className="font-serif font-black text-sm text-ink leading-relaxed">
                      &ldquo;{line.textEn}&rdquo;
                    </p>
                    {showTranscript && (
                      <p className="text-teal font-semibold pt-0.5">
                        ↳ {line.textVi}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. BỘ 3-4 CÂU HỎI TRẮC NGHIỆM VỚI NÚT 'NGHE LẠI ĐOẠN CHỨNG CỨ' */}
        <div className="p-6 bg-[#FAF5EC] border-2 border-ink rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-red" />
              <span className="text-xs font-black uppercase text-ink">
                2. Thử tài suy luận thám tử ({scenario.questions.length} câu hỏi):
              </span>
            </div>
            <span className="text-[11px] text-ink-muted">Chấm bài ngay kèm trích dẫn chứng cứ</span>
          </div>

          <div className="space-y-6">
            {scenario.questions.map((q, idx) => {
              const chosenOptId = userAnswers[q.id];
              const chosenOpt = q.options.find((o) => o.id === chosenOptId);
              const isEvidencePlaying = playingEvidenceId === q.evidenceLineId;

              return (
                <div key={q.id} className="p-4 bg-paper rounded-2xl border-2 border-ink space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-black text-ink font-serif">
                      Câu {idx + 1}: {q.question}
                    </h4>

                    {/* NÚT 'NGHE LẠI ĐOẠN CHỨNG CỨ' */}
                    <button
                      onClick={() => handlePlayEvidence(q.evidenceLineId)}
                      className={`btn btn-paper text-[11px] font-black shadow-brutal-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer ${
                        isEvidencePlaying ? 'bg-amber text-ink' : ''
                      }`}
                      title="Chỉ phát lại riêng câu thoại làm bằng chứng cho câu hỏi này"
                    >
                      <Headphones className={`w-3.5 h-3.5 text-red ${isEvidencePlaying ? 'animate-bounce' : ''}`} />
                      <span>{isEvidencePlaying ? 'Đang phát chứng cứ...' : '🎧 Nghe lại đoạn chứng cứ'}</span>
                    </button>
                  </div>

                  {/* Lựa chọn đáp án */}
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = chosenOptId === opt.id;
                      let btnStyle = 'bg-card hover:bg-paper-2 border-ink text-ink';

                      if (chosenOptId) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-teal/15 border-teal text-teal font-black shadow-brutal-sm';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-red/15 border-red text-red line-through';
                        } else {
                          btnStyle = 'opacity-50 border-ink/40 text-ink-muted';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-ink flex items-center justify-center font-mono font-black text-[10px] bg-paper">
                              {opt.id.toUpperCase()}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {chosenOptId && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" />
                          )}
                          {chosenOptId && isSelected && !opt.isCorrect && (
                            <XCircle className="w-4 h-4 text-red flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* GIẢI THÍCH 1 DÒNG TRÍCH TRANSCRIPT CHỨNG CỨ CỤ THỂ */}
                  {chosenOptId && (
                    <div className="p-3 bg-card border border-ink/30 rounded-xl text-xs space-y-1 animate-in fade-in">
                      <div className="flex items-center gap-2 text-teal font-bold font-mono text-[11px]">
                        <span>📜 Trích transcript chứng cứ:</span>
                        <span className="font-serif italic text-ink">{q.transcriptQuote}</span>
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        💡 {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4. CON DẤU ĐIỂM SỐ & CHÚC MỪNG HOÀN THÀNH */}
          {isAllAnswered && (
            <div className="pt-4 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 border-t-2 border-ink/20">
              <StampSlam
                variant="circle"
                color={scorePercent >= 75 ? 'red' : 'teal'}
                size="lg"
                text={scorePercent >= 75 ? 'XUẤT SẮC' : 'KHÁ LẮM'}
                subtext={`${scorePercent}% · HÓNG HỚT`}
                className="transform rotate-3"
              />

              <div className="p-4 bg-card border-2 border-ink rounded-2xl max-w-md text-center space-y-1 shadow-brutal-sm">
                <div className="flex items-center justify-center gap-2 text-xs font-black text-teal">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn tất điều tra! Đúng {correctCount} / {scenario.questions.length} câu.</span>
                </div>
                <p className="text-xs text-ink-soft">
                  Khả năng bắt từ khóa và liên kết ngữ cảnh của bạn quá đỉnh! Bò LingLing trao tặng bạn huy hiệu Thám Tử Lắng Nghe.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSwitchScenario}
                  className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Nghe lén hội thoại tiếp theo →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
