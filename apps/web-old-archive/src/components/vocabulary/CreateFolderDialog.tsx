'use client';

import React, { useState, useEffect } from 'react';
import { Folder, Sparkles } from 'lucide-react';
import { VocabularyFolder } from '@linguaflow/domain';
import { Modal, Button } from '@linguaflow/ui';

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  folderToEdit?: VocabularyFolder | null;
}

export default function CreateFolderDialog({
  isOpen,
  onClose,
  onSubmit,
  folderToEdit,
}: CreateFolderDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setDescription(folderToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [folderToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={folderToEdit ? 'Chỉnh sửa Thư mục' : 'Tạo Thư mục Từ vựng Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Tên thư mục <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Từ vựng Du lịch, IELTS Speaking Part 1..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-teal-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Mô tả ghi chú (Tùy chọn)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ghi chú mục tiêu hoặc chủ đề của thư mục này..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-teal-400 resize-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <Button variant="ghost" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={!name.trim()}>
            {folderToEdit ? 'Lưu thay đổi' : 'Tạo thư mục'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
