'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  Mic, 
  CheckCircle2, 
  Square,
  Sparkles,
  Clock 
} from 'lucide-react';

export default function SpeakingFreePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      <div className="flex items-center justify-between">
        <Link
          href="/speaking"
          className="text-xs font-bold text-ink-muted hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Phòng Luyện Nói</span>
        </Link>

        <span className="px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black text-red uppercase tracking-wider">
          Nói tự do
        </span>
      </div>

      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink">Nói tự do theo chủ đề (Free Talk)</h1>
          <p className="text-xs text-ink-soft">Trình bày suy nghĩ mạch lạc trong 60 giây mà không bị giới hạn bởi câu mẫu gò bó.</p>
        </div>
        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          CHỦ ĐỀ HÔM NAY
        </div>
      </div>

      <Card className="p-6 sm:p-10 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl space-y-6">
        <div className="lined-paper p-6 sm:p-8 rounded-2xl border-2 border-ink space-y-3">
          <span className="text-xs font-black uppercase text-teal block">Chủ đề thảo luận:</span>
          <h2 className="text-lg sm:text-2xl font-serif font-black text-ink">
            &ldquo;Describe your favorite way to relax after a stressful day.&rdquo;
          </h2>
          <p className="text-xs text-ink-soft">
            Miêu tả cách bạn thường thư giãn sau một ngày làm việc hoặc học tập căng thẳng.
          </p>
        </div>

        <div className="flex items-center justify-center pt-2">
          <Button
            onClick={() => {
              setIsRecording(!isRecording);
              if (isRecording) setHasRecorded(true);
            }}
            className={`px-8 py-3.5 text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer ${
              isRecording ? 'bg-red text-white animate-pulse' : 'btn-red'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Dừng bài nói tự do</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Bật mic bắt đầu nói (60s)</span>
              </>
            )}
          </Button>
        </div>

        {hasRecorded && (
          <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Đã hoàn thành bài nói tự do!</span>
                <span className="text-[11px] text-ink-soft">Thời lượng 52 giây · Ngữ điệu tự tin, từ vựng diễn đạt phong phú.</span>
              </div>
            </div>

            <Link
              href="/speaking"
              className="btn btn-outline text-xs font-black shadow-brutal"
            >
              Hoàn thành
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
