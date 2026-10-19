'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus, Search, Tag, Sparkles } from 'lucide-react';
import { SAMPLE_STUDY_NOTES } from '@/lib/community/sampleData';
import { communityApi } from '@/lib/community/api';
import StudyNoteCard from '@/components/community/StudyNoteCard';
import StudyNoteComposer from '@/components/community/StudyNoteComposer';
import { Button, Badge } from '@linguaflow/ui';

export default function StudyNotesHubPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'vi';
  const tagParam = searchParams.get('tag') || '';
  const isVi = locale === 'vi';

  const [notes, setNotes] = useState<any[]>(SAMPLE_STUDY_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(tagParam);
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    communityApi
      .getNotes({ tag: activeTag || undefined, q: searchQuery || undefined })
      .then((res: any) => {
        if (res?.notes) {
          setNotes(res.notes);
        }
      })
      .catch(() => {});
  }, [activeTag, searchQuery]);

  const allTags = Array.from(new Set(SAMPLE_STUDY_NOTES.flatMap((n) => n.tags)));

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại Cộng Đồng' : 'Back to Community'}</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {isVi ? 'Kho Ghi Chú Học Tập' : 'Study Notes Hub'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {isVi ? 'Tổng hợp kinh nghiệm, mẹo phát âm, từ vựng và ngữ pháp chia sẻ từ cộng đồng' : 'Explore tips, collocations, and grammar rules shared by the community'}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setComposerOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="bg-gradient-to-r from-purple-500 to-teal-500 text-white font-bold"
        >
          {isVi ? 'Đăng ghi chú mới' : 'New Study Note'}
        </Button>
      </div>

      {/* Search Bar & Tag Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isVi ? 'Tìm kiếm theo tiêu đề, nội dung hoặc từ khóa...' : 'Search by title, content or keyword...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTag('')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
              activeTag === ''
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {isVi ? 'Tất cả thẻ' : 'All tags'}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                activeTag === tag
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              <span>#{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <StudyNoteCard key={note.id} note={note} locale={locale} />
        ))}
      </div>

      <StudyNoteComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onNoteCreated={(n) => setNotes((prev) => [n, ...prev])}
        locale={locale}
      />
    </main>
  );
}
