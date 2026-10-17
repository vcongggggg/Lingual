'use client';

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { Volume2, RotateCcw, Play, CheckCircle2, AlertCircle, Headphones } from 'lucide-react';

const LISTENING_LESSONS = [
  {
    id: 1,
    title: 'Thói quen buổi sáng năng suất',
    level: 'A2',
    audioText: 'Every morning, I drink a cup of warm water and plan my work for the day.',
    vietnamese: 'Mỗi buổi sáng, tôi uống một cốc nước ấm và lên kế hoạch làm việc trong ngày.',
    tips: 'Chú ý nối âm giữa "drink a" và "plan my".',
  },
  {
    id: 2,
    title: 'Bảo vệ môi trường sống',
    level: 'B1',
    audioText: 'Protecting the environment requires small actions from everyone in the community.',
    vietnamese: 'Bảo vệ môi trường đòi hỏi những hành động nhỏ từ mọi người trong cộng đồng.',
    tips: 'Phát âm rõ âm đuôi /s/ trong "requires" và "actions".',
  },
  {
    id: 3,
    title: 'Sự kiên trì trong học ngôn ngữ',
    level: 'B2',
    audioText: 'Consistency and perseverance are more crucial than natural talent when mastering a new skill.',
    vietnamese: 'Sự đều đặn và kiên trì quan trọng hơn năng khiếu bẩm sinh khi làm chủ một kỹ năng mới.',
    tips: 'Chú ý trọng âm của từ "Consistency" và "perseverance".',
  },
];

export default function ListeningPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<{ checked: boolean; isCorrect: boolean; accuracy: number } | null>(null);

  const currentLesson = LISTENING_LESSONS[currentIdx];

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentLesson.audioText);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCheck = () => {
    const cleanUser = userInput.trim().toLowerCase().replace(/[.,!?'"]/g, '');
    const cleanTarget = currentLesson.audioText.trim().toLowerCase().replace(/[.,!?'"]/g, '');

    const targetWords = cleanTarget.split(/\s+/);
    const userWords = cleanUser.split(/\s+/);

    let matchCount = 0;
    userWords.forEach((w) => {
      if (targetWords.includes(w)) matchCount++;
    });

    const accuracy = Math.round((matchCount / Math.max(targetWords.length, 1)) * 100);
    const isCorrect = cleanUser === cleanTarget || accuracy >= 90;

    setResult({
      checked: true,
      isCorrect,
      accuracy,
    });
  };

  const handleNext = () => {
    setUserInput('');
    setResult(null);
    setCurrentIdx((prev) => (prev + 1) % LISTENING_LESSONS.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-2 border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal block mb-1">
            Phân hệ 02 · Luyện nghe chuyên sâu
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Phòng Nghe Chép Chính Tả 🎧
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Nghe người bản xứ phát âm, gõ lại từng từ để rèn luyện thính giác ngôn ngữ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {LISTENING_LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => {
                setCurrentIdx(idx);
                setUserInput('');
                setResult(null);
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

      {/* Máy Nghe Băng Cát-sét Sổ Tay */}
      <div className="bg-card border-2 border-ink rounded-3xl shadow-brutal-xl p-8 sm:p-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="teal">Cấp độ {currentLesson.level}</Badge>
            <span className="text-xs font-bold text-ink-soft">Bài {currentIdx + 1} / {LISTENING_LESSONS.length}</span>
          </div>

          {/* Chọn Tốc Độ Đọc */}
          <div className="flex items-center gap-1.5 bg-paper-2 border-2 border-ink rounded-xl p-1 shadow-brutal-sm">
            {[0.75, 1, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  speed === s ? 'bg-ink text-paper' : 'text-ink hover:text-red'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-black text-ink">{currentLesson.title}</h3>

        {/* Nút bấm nghe âm thanh lớn */}
        <div className="flex items-center justify-center py-6">
          <button
            onClick={handlePlayAudio}
            className="group flex flex-col items-center gap-3 p-6 bg-paper-2 hover:bg-[#EAE0CB] border-2 border-ink rounded-2xl shadow-brutal hover:shadow-brutal-lg transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-teal text-white border-2 border-ink flex items-center justify-center shadow-brutal-sm group-hover:scale-105 transition-transform">
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-ink">Bấm để phát audio</span>
          </button>
        </div>

        {/* Khung Gõ Chép Chính Tả */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-ink block">
            Bạn đã nghe được gì? Gõ vào đây:
          </label>
          <textarea
            rows={3}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Gõ lại toàn bộ câu tiếng Anh bạn vừa nghe..."
            className="w-full bg-paper border-2 border-ink rounded-xl p-4 text-base font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-teal shadow-brutal-sm"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="paper" size="sm" onClick={() => setUserInput('')}>
            Xóa gõ lại
          </Button>

          <Button variant="teal" size="md" onClick={handleCheck} disabled={!userInput.trim()}>
            Kiểm Tra Đáp Án →
          </Button>
        </div>

        {/* Khối Kết Quả & Feedback */}
        {result && (
          <div
            className={`p-6 border-2 border-ink rounded-2xl shadow-brutal-md text-left space-y-4 animate-in fade-in duration-100 ${
              result.isCorrect ? 'bg-amber/15 border-teal' : 'bg-red/10 border-red'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-teal" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red" />
              )}
              <div>
                <h4 className="text-lg font-black text-ink">
                  {result.isCorrect ? 'Chính xác xuất sắc! 🎉' : 'Gần đúng rồi, cố lên nhé!'}
                </h4>
                <p className="text-xs text-ink-soft">Độ chuẩn xác: {result.accuracy}%</p>
              </div>
            </div>

            <div className="p-4 bg-card border border-ink/20 rounded-xl space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-ink-soft block">Câu gốc:</span>
              <p className="text-base font-black text-ink">{currentLesson.audioText}</p>
              <p className="text-xs font-semibold text-teal italic">Nghĩa: {currentLesson.vietnamese}</p>
            </div>

            <div className="text-xs font-bold text-ink-soft">
              💡 <b>Mẹo phát âm: </b>{currentLesson.tips}
            </div>

            <Button variant="ink" size="sm" onClick={handleNext}>
              Bài tiếp theo →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
