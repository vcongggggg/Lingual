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
  MessageCircle,
  Sparkles 
} from 'lucide-react';

export default function SpeakingSituationPage() {
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
          Hội thoại tình huống
        </span>
      </div>

      <div className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink">Hội thoại thực tế theo tình huống (Situation Dialogue)</h1>
          <p className="text-xs text-ink-soft">Đóng vai theo kịch bản thường ngày và phản xạ nói câu trả lời thích hợp.</p>
        </div>
        <div className="text-xs font-mono font-black text-ink-muted px-3 py-1 bg-paper border border-ink rounded-lg self-start sm:self-auto">
          TÌNH HUỐNG #01
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-[#FAF6EC] border-2 border-ink shadow-brutal-xl space-y-6">
        <div className="lined-paper p-6 rounded-2xl border-2 border-ink space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-teal">
            <MessageCircle className="w-4 h-4" />
            <span>Kịch bản: Đặt phòng tại khách sạn (Hotel Check-in)</span>
          </div>

          <div className="p-4 bg-card rounded-xl border border-ink/20 space-y-2">
            <span className="text-[11px] font-black uppercase text-ink-muted block">Nhân viên lễ tân (LingLing):</span>
            <p className="text-base font-serif font-black text-ink">
              &ldquo;Welcome to Grand Palace Hotel! How may I assist you with your reservation today?&rdquo;
            </p>
          </div>

          <div className="p-4 bg-paper rounded-xl border-2 border-dashed border-ink/40 space-y-2">
            <span className="text-[11px] font-black uppercase text-red block">Lượt nói của bạn (Khách thuê phòng):</span>
            <p className="text-sm font-sans font-bold text-ink">
              Hãy nói: &ldquo;Hello, I have a reservation under the name Vu Cong for two nights.&rdquo;
            </p>
          </div>
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
                <span>Dừng câu trả lời</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Bật mic trả lời lễ tân</span>
              </>
            )}
          </Button>
        </div>

        {hasRecorded && (
          <div className="p-4 bg-card border-2 border-ink rounded-2xl shadow-brutal flex items-center justify-between gap-4 text-left animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal" />
              <div>
                <span className="text-xs font-black text-ink block">Phản hồi tình huống xuất sắc!</span>
                <span className="text-[11px] text-ink-soft">Câu trả lời tự nhiên, lịch sự và đúng trọng tâm hội thoại.</span>
              </div>
            </div>

            <Link
              href="/speaking"
              className="btn btn-outline text-xs font-black shadow-brutal"
            >
              Hoàn thành tình huống
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
