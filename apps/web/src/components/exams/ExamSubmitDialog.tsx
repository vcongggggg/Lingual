'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Flag, Send, X } from 'lucide-react';
import { Button } from '@linguaflow/ui';

interface ExamSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  submitting?: boolean;
}

export default function ExamSubmitDialog({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answeredCount,
  flaggedCount,
  submitting = false,
}: ExamSubmitDialogProps) {
  if (!isOpen) return null;

  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-slate-900 border border-teal-500/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl text-white">
              Xác Nhận Nộp Bài Thi
            </h3>
            <p className="text-xs text-slate-400">
              Kiểm tra kỹ các câu hỏi trước khi hoàn tất nộp bài.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[11px] text-slate-400">Đã trả lời</span>
            <p className="text-lg font-mono font-extrabold text-teal-400">
              {answeredCount}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[11px] text-slate-400">Chưa làm</span>
            <p className={`text-lg font-mono font-extrabold ${unansweredCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {unansweredCount}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[11px] text-slate-400">Đánh dấu</span>
            <p className="text-lg font-mono font-extrabold text-amber-400">
              {flaggedCount}
            </p>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Bạn vẫn còn <strong>{unansweredCount} câu chưa chọn đáp án</strong>. Các câu chưa làm sẽ được tính 0 điểm.
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Tiếp tục làm bài
          </Button>

          <Button
            variant="primary"
            onClick={onConfirmSubmit}
            disabled={submitting}
            icon={<Send className="w-4 h-4" />}
          >
            {submitting ? 'Đang chấm điểm...' : 'Nộp bài ngay'}
          </Button>
        </div>
      </div>
    </div>
  );
}
