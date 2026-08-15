'use client';

import React, { useState, useEffect } from 'react';
import { FolderPlus, Check, Folder, Plus, X } from 'lucide-react';
import { VocabularyFolder } from '@linguaflow/domain';
import { vocabularyApi } from '@/lib/api';
import { Modal } from '@linguaflow/ui';

interface VocabularyFolderSelectorProps {
  wordId: string;
  isOpen: boolean;
  onClose: () => void;
  currentFolderIds?: string[];
  onFoldersUpdated?: (folderIds: string[]) => void;
}

export default function VocabularyFolderSelector({
  wordId,
  isOpen,
  onClose,
  currentFolderIds = [],
  onFoldersUpdated,
}: VocabularyFolderSelectorProps) {
  const [folders, setFolders] = useState<VocabularyFolder[]>([]);
  const [activeFolderIds, setActiveFolderIds] = useState<string[]>(currentFolderIds);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveFolderIds(currentFolderIds);
      loadFolders();
    }
  }, [isOpen, currentFolderIds]);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const data = await vocabularyApi.getFolders();
      if (data?.folders) {
        setFolders(data.folders);
      }
    } catch {
      // fallback folders
      setFolders([
        { id: 'folder-my-words', userId: 'demo-user-id-001', name: 'Từ vựng của tôi', wordCount: 4, createdAt: '', updatedAt: '' },
        { id: 'folder-travel', userId: 'demo-user-id-001', name: 'Du lịch & Giao tiếp', wordCount: 3, createdAt: '', updatedAt: '' },
        { id: 'folder-ielts', userId: 'demo-user-id-001', name: 'IELTS Academic & Speaking', wordCount: 2, createdAt: '', updatedAt: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFolder = async (folderId: string) => {
    const isInside = activeFolderIds.includes(folderId);
    let nextFolderIds: string[];

    if (isInside) {
      nextFolderIds = activeFolderIds.filter((id) => id !== folderId);
      try {
        await vocabularyApi.removeWordFromFolder(folderId, wordId);
      } catch {}
    } else {
      nextFolderIds = [...activeFolderIds, folderId];
      try {
        await vocabularyApi.addWordToFolder(folderId, wordId);
      } catch {}
    }

    setActiveFolderIds(nextFolderIds);
    onFoldersUpdated?.(nextFolderIds);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || creating) return;

    setCreating(true);
    try {
      const res = await vocabularyApi.createFolder({ name: newFolderName.trim() });
      if (res?.folder) {
        setFolders((prev) => [...prev, res.folder]);
        handleToggleFolder(res.folder.id);
        setNewFolderName('');
      }
    } catch {
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm vào Thư mục Từ vựng">
      <div className="space-y-5">
        <p className="text-xs text-slate-400">
          Chọn một hoặc nhiều thư mục để phân loại và ôn tập từ vựng này theo chủ đề:
        </p>

        {/* Folder List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {folders.map((folder) => {
            const isSelected = activeFolderIds.includes(folder.id);

            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => handleToggleFolder(folder.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 shadow-sm shadow-teal-500/10'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">{folder.name}</span>
                    <span className="text-[11px] text-slate-500">{folder.wordCount} từ đã lưu</span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                  isSelected ? 'bg-teal-500 text-slate-950 border-teal-400' : 'border-slate-700 bg-slate-900'
                }`}>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Create Folder Input */}
        <form onSubmit={handleCreateFolder} className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Tạo thư mục mới (ví dụ: TOEIC 600+)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            disabled={!newFolderName.trim() || creating}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-teal-500/20 hover:text-teal-300 border border-slate-700 text-slate-300 font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo</span>
          </button>
        </form>
      </div>
    </Modal>
  );
}
