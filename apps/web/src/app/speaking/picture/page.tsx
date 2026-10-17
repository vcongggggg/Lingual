'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LingLing } from '../../../components/ui/LingLing';
import { 
  ArrowLeft, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  Square,
  Image as ImageIcon,
  Sparkles 
} from 'lucide-react';

export default function SpeakingPicturePage() {
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
          Miêu tả tranh
        </span>
      </div>

      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink">Miêu tả tranh trong 45 giây</h1>
          <p className="text-xs text-ink-soft">Quan sát chi tiết bức tranh minh họa và nói ít nhất 3-5 câu miêu tả ngữ cảnh.</p>
        </div>
        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          TRANH #01
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl space-y-6">
        {/* Khung Bức Tranh Giấy */}
        <div className="w-full h-64 sm:h-80 bg-paper border-2 border-ink rounded-2xl shadow-brutal-sm flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
          <div className="w-20 h-20 rounded-full border-2 border-ink bg-card flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-teal" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-ink">Quang cảnh quán cà phê buổi sáng (Coffee Shop Scene)</h3>
            <p className="text-xs text-ink-soft max-w-md">
              Một nhân viên pha chế đang mỉm cười phục vụ khách hàng bên quầy gỗ, phía sau là kệ đựng các loại hạt cà phê và máy pha espresso.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-paper-2 border border-ink/30 text-ink">
              Gợi ý từ: Barista
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-paper-2 border border-ink/30 text-ink">
              Wooden counter
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-paper-2 border border-ink/30 text-ink">
              Espresso machine
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-paper-2 border border-ink/30 text-ink">
              Ordering coffee
            </span>
          </div>
        </div>

        {/* Nút Thu Âm */}
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
                <span>Dừng bài nói (45s)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Bắt đầu miêu tả tranh</span>
              </>
            )}
          </Button>
        </div>

        {hasRecorded && (
          <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Đã ghi nhận bài nói miêu tả tranh!</span>
                <span className="text-[11px] text-ink-soft">Thời lượng nói: 38 giây · Phát âm rõ ràng, đủ ý chính.</span>
              </div>
            </div>

            <Link
              href="/speaking"
              className="btn btn-outline text-xs font-black shadow-brutal"
            >
              Hoàn thành bài tập
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
