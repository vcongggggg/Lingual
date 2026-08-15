'use client';

import React from 'react';
import { Mic, Activity } from 'lucide-react';

interface LiveTranscriptProps {
  transcript: string;
  interimTranscript?: string;
  isRecording?: boolean;
  locale?: string;
  className?: string;
}

export default function LiveTranscript({
  transcript,
  interimTranscript = '',
  isRecording = false,
  locale = 'vi',
  className = '',
}: LiveTranscriptProps) {
  const isVi = locale === 'vi';
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className={`w-4 h-4 ${isRecording ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-bold text-slate-300">
            {isVi ? 'Văn Bản Nhận Diện Giọng Nói' : 'Speech-to-Text Live Transcript'}
          </span>
        </div>

        <span className="text-xs font-mono text-slate-400 font-bold">
          {wordCount} {isVi ? 'từ' : 'words'}
        </span>
      </div>

      <div className="min-h-[100px] max-h-[220px] overflow-y-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-850 font-sans text-sm leading-relaxed">
        {transcript ? (
          <p className="text-white">
            {transcript}{' '}
            {interimTranscript && (
              <span className="text-slate-500 italic">{interimTranscript}</span>
            )}
          </p>
        ) : isRecording ? (
          <div className="flex items-center gap-2 text-teal-300 text-xs italic animate-pulse">
            <Activity className="w-4 h-4" />
            <span>{isVi ? 'Đang lắng nghe giọng nói của bạn...' : 'Listening to your voice...'}</span>
          </div>
        ) : (
          <p className="text-slate-500 text-xs italic">
            {isVi
              ? 'Nhấn nút "Bắt đầu nói" và đọc to câu trả lời của bạn vào microphone...'
              : 'Press "Start Speaking" and speak clearly into your microphone...'}
          </p>
        )}
      </div>

      <span className="text-[10px] text-slate-500 block font-mono">
        * Đánh giá dựa trên Transcript Match của Web Speech API.
      </span>
    </div>
  );
}
