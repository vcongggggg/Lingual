'use client';

import React from 'react';
import { Mic, ShieldCheck, AlertCircle } from 'lucide-react';

interface MicrophonePermissionProps {
  isSupported?: boolean;
  permissionDenied?: boolean;
  locale?: string;
  className?: string;
}

export default function MicrophonePermission({
  isSupported = true,
  permissionDenied = false,
  locale = 'vi',
  className = '',
}: MicrophonePermissionProps) {
  const isVi = locale === 'vi';

  if (!isSupported) {
    return (
      <div className={`p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3 ${className}`}>
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {isVi ? 'Trình duyệt chưa hỗ trợ Web Speech Recognition' : 'Browser Web Speech API Unavailable'}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {isVi
              ? 'Trình duyệt này chưa hỗ trợ nhận diện giọng nói tự động. Bạn vẫn có thể luyện nghe mẫu, shadowing và tự ghi âm nghe lại.'
              : 'Your browser does not support automatic speech recognition. You can still listen to samples, practice shadowing, and record yourself.'}
          </p>
        </div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className={`p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3 ${className}`}>
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {isVi ? 'Quyền truy cập Microphone bị từ chối' : 'Microphone Access Denied'}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {isVi
              ? 'Vui lòng nhấn vào biểu tượng ổ khóa trên thanh địa chỉ của trình duyệt để cấp quyền microphone cho LinguaFlow.'
              : 'Please allow microphone permissions in your browser address bar settings to record your voice.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 text-[11px] text-slate-400 flex items-center gap-2.5 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
      <span>
        {isVi
          ? 'Quyền riêng tư tối đa: Giọng nói của bạn được xử lý trực tiếp tại máy và không tải lên máy chủ.'
          : 'Privacy-first: Speech is processed locally in your browser and never uploaded to any server.'}
      </span>
    </div>
  );
}
