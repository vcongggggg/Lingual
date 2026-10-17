'use client';

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { Mic, Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

const SPEAKING_PROMPTS = [
  {
    id: 1,
    prompt: 'I want to speak English fluently and confidently every day.',
    phonetic: '/aɪ wɒnt tuː spiːk ˈɪŋɡlɪʃ ˈfluːəntli ænd ˈkɒnfɪdəntli ˈevri deɪ/',
    vietnamese: 'Tôi muốn nói tiếng Anh lưu loát và tự tin mỗi ngày.',
    level: 'A2',
    focusWord: 'confidently',
  },
  {
    id: 2,
    prompt: 'Practice makes perfect when learning any foreign language.',
    phonetic: '/ˈpræktɪs meɪks ˈpɜːfɪkt wen ˈlɜːnɪŋ ˈeni ˈfɒrən ˈlæŋɡwɪdʒ/',
    vietnamese: 'Luyện tập tạo nên sự hoàn hảo khi học bất kỳ ngoại ngữ nào.',
    level: 'B1',
    focusWord: 'foreign language',
  },
  {
    id: 3,
    prompt: 'Technological innovation plays a substantial role in modern education.',
    phonetic: '/ˌteknəˈlɒdʒɪkl ˌɪnəˈveɪʃn pleɪz ə səbˈstænʃl rəʊl ɪn ˈmɒdn ˌedʒuˈkeɪʃn/',
    vietnamese: 'Đổi mới công nghệ đóng vai trò đáng kể trong nền giáo dục hiện đại.',
    level: 'B2',
    focusWord: 'substantial',
  },
];

export default function SpeakingPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [score, setScore] = useState<number | null>(null);

  const currentItem = SPEAKING_PROMPTS[currentIdx];

  const handlePlaySample = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.prompt);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Vui lòng sử dụng Chrome/Edge để trải nghiệm tính năng thu âm.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    setRecordedText('Đang lắng nghe giọng bạn nói...');
    setScore(null);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRecordedText(transcript);
      setIsRecording(false);

      // Chấm điểm đơn giản
      const cleanTarget = currentItem.prompt.toLowerCase().replace(/[.,!?'"]/g, '').split(/\s+/);
      const cleanUser = transcript.toLowerCase().replace(/[.,!?'"]/g, '').split(/\s+/);

      let matched = 0;
      cleanUser.forEach((w: string) => {
        if (cleanTarget.includes(w)) matched++;
      });

      const calculatedScore = Math.min(100, Math.round((matched / cleanTarget.length) * 100));
      setScore(calculatedScore);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setRecordedText('Không nhận diện được giọng nói. Vui lòng bấm mic và thử lại.');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-2 border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red block mb-1">
            Phân hệ 03 · Luyện phát âm & Phản xạ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Phòng Luyện Phát Âm 🎙️
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Nghe mẫu phát âm chuẩn IPA và nói trực tiếp qua micro để nhận feedback tức thời.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {SPEAKING_PROMPTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentIdx(idx);
                setRecordedText('');
                setScore(null);
              }}
              className={`w-9 h-9 rounded-xl border-2 border-ink font-black text-xs cursor-pointer transition-all ${
                idx === currentIdx
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Thẻ Luyện Nói */}
      <div className="bg-card border-2 border-ink rounded-3xl shadow-brutal-xl p-8 sm:p-12 space-y-8 text-center">
        <div className="flex items-center justify-between">
          <Badge variant="red">Cấp độ {currentItem.level}</Badge>
          <button
            onClick={handlePlaySample}
            className="inline-flex items-center gap-2 px-4 py-2 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-red" /> Nghe người bản xứ đọc mẫu
          </button>
        </div>

        {/* Khối Văn Bản Cần Nói */}
        <div className="py-4 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink leading-tight">
            "{currentItem.prompt}"
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft font-mono">{currentItem.phonetic}</p>
          <p className="text-sm font-bold text-teal italic">Nghĩa: {currentItem.vietnamese}</p>
        </div>

        {/* Nút Micro Ghi Âm Lớn */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={startSpeechRecognition}
            disabled={isRecording}
            className={`w-20 h-20 rounded-full border-2 border-ink flex items-center justify-center transition-all cursor-pointer shadow-brutal hover:shadow-brutal-lg ${
              isRecording
                ? 'bg-red text-white animate-pulse'
                : 'bg-red text-white hover:scale-105 active:scale-95'
            }`}
          >
            <Mic className="w-9 h-9" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-ink">
            {isRecording ? 'Đang lắng nghe... Hãy nói to rõ ràng!' : 'Bấm vào micro để đọc câu trên'}
          </span>
        </div>

        {/* Hiển thị Văn Bản Thu Âm & Điểm Số */}
        {recordedText && (
          <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm text-left space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-ink-soft block">
              Bạn vừa nói:
            </span>
            <p className="text-base font-bold text-ink italic">"{recordedText}"</p>

            {score !== null && (
              <div className="pt-4 border-t border-ink/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-ink-soft block">Điểm chuẩn xác phát âm:</span>
                  <div className={`text-2xl font-black ${score >= 80 ? 'text-teal' : 'text-amber'}`}>
                    {score}% — {score >= 80 ? 'Phát âm rất rõ ràng! 🎉' : 'Cần chú ý thêm trọng âm'}
                  </div>
                </div>

                <Button
                  variant="ink"
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => (prev + 1) % SPEAKING_PROMPTS.length)}
                >
                  Câu tiếp theo →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
