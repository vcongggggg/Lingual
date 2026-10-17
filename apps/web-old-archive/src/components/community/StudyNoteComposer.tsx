'use client';

import React, { useState } from 'react';
import { Sparkles, X, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { communityApi } from '@/lib/community/api';
import { validateStudyNoteContent } from '@linguaflow/domain';
import { sfx } from '@/lib/soundEffects';

interface StudyNoteComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: (note: any) => void;
  locale?: string;
}

export default function StudyNoteComposer({
  isOpen,
  onClose,
  onNoteCreated,
  locale = 'vi',
}: StudyNoteComposerProps) {
  const isVi = locale === 'vi';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const validation = validateStudyNoteContent(title, content, tags);
    if (!validation.valid) {
      setError(validation.error || 'Dữ liệu không hợp lệ.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await communityApi.createNote({
        title,
        content,
        tags,
        visibility,
      });

      if (res?.note) {
        sfx.playVictory();
        onNoteCreated(res.note);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo ghi chú.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-extrabold text-lg text-white">
              {isVi ? 'Tạo Ghi Chú Học Tập Mới' : 'Create Study Note'}
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
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              {isVi ? 'Tiêu đề ghi chú' : 'Note Title'} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isVi ? 'Ví dụ: Mẹo nhớ collocations Writing Task 2...' : 'e.g. Tips for memorizing vocabulary...'}
              maxLength={120}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              required
            />
            <span className="text-[10px] text-slate-500 block text-right">
              {title.length}/120
            </span>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              {isVi ? 'Nội dung kiến thức' : 'Content'} *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder={isVi ? 'Chia sẻ công thức, cách nhớ, từ vựng hoặc ví dụ thực tế...' : 'Share grammar rules, collocations, tips...'}
              maxLength={5000}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 resize-none font-sans leading-relaxed"
              required
            />
            <span className="text-[10px] text-slate-500 block text-right">
              {content.length}/5000
            </span>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              {isVi ? 'Thẻ gắn (cách nhau bởi dấu phẩy)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="grammar, ielts, vocabulary, tips"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              {isVi ? 'Chế độ hiển thị' : 'Visibility'}
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              <option value="public">{isVi ? 'Công khai toàn cộng đồng' : 'Public to Community'}</option>
              <option value="friends">{isVi ? 'Chỉ bạn bè' : 'Friends Only'}</option>
              <option value="private">{isVi ? 'Riêng tư (Chỉ mình tôi)' : 'Private (Only Me)'}</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              {isVi ? 'Hủy bỏ' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              disabled={submitting}
              className="bg-gradient-to-r from-purple-500 to-teal-500 text-white"
            >
              {submitting ? (isVi ? 'Đang đăng...' : 'Publishing...') : (isVi ? 'Đăng ghi chú (+15 XP)' : 'Publish Note (+15 XP)')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
