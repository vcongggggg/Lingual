'use client';

import React, { useState } from 'react';
import { Target, X, AlertCircle } from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface LearningGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: (goal: any) => void;
  locale?: string;
}

export default function LearningGoalDialog({
  isOpen,
  onClose,
  onGoalCreated,
  locale = 'vi',
}: LearningGoalDialogProps) {
  const isVi = locale === 'vi';
  const [type, setType] = useState('weekly_minutes');
  const [target, setTarget] = useState('300');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = Number(target);
    if (!numTarget || numTarget <= 0) {
      setError(isVi ? 'Mục tiêu phải là số dương lớn hơn 0.' : 'Target must be greater than 0.');
      return;
    }

    sfx.playVictory();
    onGoalCreated({
      type,
      target: numTarget,
      endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-slate-900 border border-teal-500/30 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-400" />
            <h3 className="font-display font-extrabold text-lg text-white">
              {isVi ? 'Thiết Lập Mục Tiêu Mới' : 'Set New Learning Goal'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 block">{isVi ? 'Loại mục tiêu' : 'Goal Type'}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-400"
            >
              <option value="daily_minutes">{isVi ? 'Phút học mỗi ngày (Daily Minutes)' : 'Daily Study Minutes'}</option>
              <option value="weekly_minutes">{isVi ? 'Phút học mỗi tuần (Weekly Minutes)' : 'Weekly Study Minutes'}</option>
              <option value="weekly_xp">{isVi ? 'XP mỗi tuần (Weekly XP)' : 'Weekly XP'}</option>
              <option value="vocabulary">{isVi ? 'Số từ vựng cần học (Vocabulary Words)' : 'Vocabulary Words'}</option>
              <option value="reading">{isVi ? 'Số bài đọc cần đọc (Articles Read)' : 'Articles Read'}</option>
              <option value="writing">{isVi ? 'Số bài viết cần nộp (Writing Submissions)' : 'Writing Submissions'}</option>
              <option value="listening">{isVi ? 'Số bài nghe cần hoàn thành (Listening Sessions)' : 'Listening Sessions'}</option>
              <option value="exam">{isVi ? 'Số đề thi thử (Mock Exams)' : 'Mock Exams'}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 block">{isVi ? 'Chỉ tiêu cần đạt' : 'Target Value'} *</label>
            <input
              type="number"
              min="1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              {isVi ? 'Hủy bỏ' : 'Cancel'}
            </Button>
            <Button variant="primary">
              {isVi ? 'Lưu mục tiêu' : 'Save Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
