'use client';

import React from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { VocabularyFolder } from '@linguaflow/domain';
import FolderCard from './FolderCard';

interface FolderListProps {
  folders: VocabularyFolder[];
  locale: string;
  onCreateClick: () => void;
  onEditFolder?: (folder: VocabularyFolder) => void;
  onDeleteFolder?: (folderId: string) => void;
  className?: string;
}

export default function FolderList({
  folders,
  locale,
  onCreateClick,
  onEditFolder,
  onDeleteFolder,
  className = '',
}: FolderListProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {/* Create New Folder Card Action */}
      <button
        type="button"
        onClick={onCreateClick}
        className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900/80 border-2 border-dashed border-slate-800 hover:border-teal-500/40 transition-all text-center space-y-3 min-h-[170px] group"
      >
        <div className="p-3 rounded-2xl bg-slate-800 group-hover:bg-teal-500/20 text-slate-400 group-hover:text-teal-300 transition-colors">
          <Plus className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <span className="font-display font-bold text-sm text-white group-hover:text-teal-300 transition-colors block">
            Tạo thư mục mới
          </span>
          <span className="text-xs text-slate-500">Phân loại từ vựng theo chủ đề</span>
        </div>
      </button>

      {/* Existing Folders */}
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          locale={locale}
          onEdit={onEditFolder}
          onDelete={onDeleteFolder}
        />
      ))}
    </div>
  );
}
