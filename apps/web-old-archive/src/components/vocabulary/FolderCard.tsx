'use client';

import React from 'react';
import Link from 'next/link';
import { Folder, ArrowRight, Play, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { VocabularyFolder } from '@linguaflow/domain';
import { Card } from '@linguaflow/ui';

interface FolderCardProps {
  folder: VocabularyFolder;
  locale: string;
  onEdit?: (folder: VocabularyFolder) => void;
  onDelete?: (folderId: string) => void;
  className?: string;
}

export default function FolderCard({
  folder,
  locale,
  onEdit,
  onDelete,
  className = '',
}: FolderCardProps) {
  return (
    <Card
      glow="amber"
      className={`flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all group ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
          <Folder className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(folder);
              }}
              title="Chỉnh sửa thư mục"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && folder.id !== 'folder-my-words' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder.id);
              }}
              title="Xóa thư mục"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <Link href={`/${locale}/vocabulary/folders/${folder.id}`} className="space-y-1 block group-hover:text-amber-300">
        <h3 className="font-display font-extrabold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1">
          {folder.name}
        </h3>
        {folder.description && (
          <p className="text-xs text-slate-400 line-clamp-1">{folder.description}</p>
        )}
      </Link>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs font-mono text-teal-400 font-bold">
          {folder.wordCount} từ vựng
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/vocabulary/practice?folderId=${folder.id}`}
            title="Luyện tập thư mục này"
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-amber-300" />
            <span>Luyện tập</span>
          </Link>

          <Link
            href={`/${locale}/vocabulary/folders/${folder.id}`}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-amber-500/20 transition-all group-hover:translate-x-1"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
