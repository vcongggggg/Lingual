'use client';

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import { PenTool, CheckCircle2, Sparkles } from 'lucide-react';

const WRITING_TOPICS = [
  {
    id: 1,
    title: 'Miêu tả một người bạn thân mà bạn ngưỡng mộ',
    level: 'A2 - B1',
    minWords: 30,
    guidance: 'Hãy dùng các tính từ miêu tả tính cách (caring, dependable, ambitious) và nêu lý do tại sao bạn quý mến họ.',
    suggestedVocab: ['dependable', 'sense of humor', 'supportive', 'admire'],
  },
  {
    id: 2,
    title: 'Lợi ích của việc dậy sớm và lập kế hoạch',
    level: 'B1 - B2',
    minWords: 50,
    guidance: 'Trình bày 2 lợi ích cụ thể của thói quen dậy sớm và tác động tới năng suất làm việc.',
    suggestedVocab: ['productivity', 'clear mindset', 'proactive', 'routine'],
  },
];

export default function WritingPage() {
  const [topicIdx, setTopicIdx] = useState(0);
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<any>(null);

  const currentTopic = WRITING_TOPICS[topicIdx];
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleEvaluate = () => {
    // Đánh giá dựa trên độ dài, từ vựng gợi ý đã dùng
    const usedVocab = currentTopic.suggestedVocab.filter((v) =>
      text.toLowerCase().includes(v.toLowerCase())
    );

    const lengthPassed = wordCount >= currentTopic.minWords;
    const score = Math.min(100, Math.round((wordCount / currentTopic.minWords) * 60 + usedVocab.length * 15));

    setFeedback({
      evaluated: true,
      wordCount,
      lengthPassed,
      usedVocab,
      score,
      comments: lengthPassed
        ? `Bài viết đáp ứng tốt yêu cầu độ dài tối thiểu (${wordCount}/${currentTopic.minWords} từ). Bạn đã áp dụng thành công ${usedVocab.length} cụm từ gợi ý!`
        : `Bài viết hiện có ${wordCount} từ, hãy viết thêm tối thiểu ${currentTopic.minWords - wordCount} từ nữa để hoàn thiện ý nhé!`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-2 border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-ink block mb-1">
            Phân hệ 05 · Luyện viết đoạn văn
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Xưởng Luyện Viết Sổ Tay ✍️
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Rèn luyện kỹ năng diễn đạt ý tưởng mạch lạc, vận dụng từ vựng theo chủ đề cụ thể.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {WRITING_TOPICS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setTopicIdx(idx);
                setText('');
                setFeedback(null);
              }}
              className={`w-9 h-9 rounded-xl border-2 border-ink font-black text-xs cursor-pointer transition-all ${
                idx === topicIdx
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Đề Bài Sổ Tay */}
      <div className="bg-card border-2 border-ink rounded-3xl shadow-brutal-xl p-8 sm:p-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge variant="amber">{currentTopic.level}</Badge>
          <span className="text-xs font-bold text-ink-soft">Yêu cầu tối thiểu: {currentTopic.minWords} từ</span>
        </div>

        <h3 className="text-2xl font-black text-ink">{currentTopic.title}</h3>
        <p className="text-sm text-ink-soft leading-relaxed">{currentTopic.guidance}</p>

        {/* Từ vựng gợi ý */}
        <div className="p-4 bg-paper-2 border border-ink/20 rounded-xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-ink block">
            Từ vựng nên vận dụng:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentTopic.suggestedVocab.map((v) => {
              const isUsed = text.toLowerCase().includes(v.toLowerCase());
              return (
                <span
                  key={v}
                  className={`text-xs font-black px-2.5 py-1 rounded-lg border border-ink transition-colors ${
                    isUsed ? 'bg-teal text-white border-teal' : 'bg-card text-ink'
                  }`}
                >
                  {isUsed && '✓ '}
                  {v}
                </span>
              );
            })}
          </div>
        </div>

        {/* Khung Soạn Thảo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
            <span>Trang viết của bạn:</span>
            <span className={wordCount >= currentTopic.minWords ? 'text-teal font-black' : ''}>
              {wordCount} / {currentTopic.minWords} từ
            </span>
          </div>

          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bắt đầu viết đoạn văn tiếng Anh của bạn tại đây..."
            className="w-full bg-paper border-2 border-ink rounded-2xl p-5 text-base font-medium text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="paper" size="sm" onClick={() => setText('')}>
            Xóa bài viết
          </Button>

          <Button variant="red" size="md" onClick={handleEvaluate} disabled={!text.trim()}>
            Chấm Bài Viết →
          </Button>
        </div>

        {/* Kết Quả Chấm Điểm */}
        {feedback && (
          <div className="p-6 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-md text-left space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-ink-soft block">
                  Đánh giá tổng quan:
                </span>
                <div className="text-2xl font-black text-ink">{feedback.score} / 100 điểm</div>
              </div>
              <Badge variant={feedback.lengthPassed ? 'teal' : 'red'}>
                {feedback.lengthPassed ? 'Đạt độ dài' : 'Chưa đủ từ'}
              </Badge>
            </div>

            <p className="text-sm font-semibold text-ink leading-relaxed">{feedback.comments}</p>
          </div>
        )}
      </div>
    </div>
  );
}
