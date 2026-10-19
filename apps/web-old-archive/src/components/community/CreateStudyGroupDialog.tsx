'use client';

import React, { useState } from 'react';
import { Users, X, AlertCircle } from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

interface CreateStudyGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (group: any) => void;
  locale?: string;
}

export default function CreateStudyGroupDialog({
  isOpen,
  onClose,
  onGroupCreated,
  locale = 'vi',
}: CreateStudyGroupDialogProps) {
  const isVi = locale === 'vi';
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('IELTS Academic');
  const [level, setLevel] = useState('B2');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(30);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isVi ? 'Vui lòng nhập tên nhóm.' : 'Please enter group name.');
      return;
    }

    sfx.playVictory();
    const newGroup = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      topic,
      level,
      description: description.trim(),
      memberCount: 1,
      maxMembers,
      visibility: 'public',
      totalGroupXP: 100,
      createdAt: new Date().toISOString(),
    };

    onGroupCreated(newGroup);
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
            <Users className="w-5 h-5 text-teal-400" />
            <h3 className="font-display font-extrabold text-lg text-white">
              {isVi ? 'Tạo Nhóm Học Tập Mới' : 'Create Study Group'}
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
            <label className="font-bold text-slate-300 block">{isVi ? 'Tên nhóm' : 'Group Name'} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isVi ? 'Ví dụ: Luyện đề TOEIC 900+...' : 'e.g. Daily IELTS Task 2 Writers...'}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 block">{isVi ? 'Chủ đề' : 'Topic'}</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-teal-400"
              >
                <option value="IELTS Academic">IELTS Academic</option>
                <option value="TOEIC Prep">TOEIC Prep</option>
                <option value="VSTEP Prep">VSTEP Prep</option>
                <option value="General English">General English</option>
                <option value="Japanese JLPT">Japanese JLPT</option>
                <option value="Chinese HSK">Chinese HSK</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 block">{isVi ? 'Trình độ' : 'Level'}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-teal-400"
              >
                <option value="A2">A2 (Cơ bản)</option>
                <option value="B1">B1 (Trung cấp)</option>
                <option value="B2">B2 (Khá)</option>
                <option value="C1">C1 (Cao cấp)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 block">{isVi ? 'Mô tả mục tiêu nhóm' : 'Description'}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={isVi ? 'Giới thiệu về lịch học, quy tắc thảo luận...' : 'Introduce the group goals and rules...'}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              {isVi ? 'Hủy bỏ' : 'Cancel'}
            </Button>
            <Button variant="primary">
              {isVi ? 'Tạo nhóm ngay' : 'Create Group'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
