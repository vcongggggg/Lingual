'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, Tag, Heart, ThumbsUp, BookOpen } from 'lucide-react';
import { SAMPLE_STUDY_NOTES } from '@/lib/community/sampleData';
import { communityApi } from '@/lib/community/api';
import { StudyNote, StudyNoteComment } from '@linguaflow/domain';
import { Badge, Button } from '@linguaflow/ui';
import { sfx } from '@/lib/soundEffects';

export default function StudyNoteDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const noteId = params?.noteId as string;
  const isVi = locale === 'vi';

  const [note, setNote] = useState<StudyNote | null>(null);
  const [comments, setComments] = useState<StudyNoteComment[]>([
    {
      id: 'c-001',
      noteId,
      userId: 'demo-user-id-001',
      authorName: 'Minh Trần',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      content: 'Cảm ơn bạn! Mẹo nhớ này rất dễ hiểu.',
      createdAt: '2026-02-12T11:00:00.000Z',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const found = SAMPLE_STUDY_NOTES.find((n) => n.id === noteId) || SAMPLE_STUDY_NOTES[0];
    setNote(found);

    communityApi
      .getNote(noteId)
      .then((res: any) => {
        if (res?.note) {
          setNote(res.note);
          if (res?.comments) setComments(res.comments);
        }
      })
      .catch(() => {});
  }, [noteId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    sfx.playClick();

    try {
      const res = await communityApi.addComment(noteId, { content: newComment });
      if (res?.comment) {
        setComments((prev) => [...prev, res.comment]);
        setNewComment('');
      }
    } catch {} finally {
      setSubmittingComment(false);
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <p>{isVi ? 'Đang tải ghi chú...' : 'Loading note...'}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-auto">
      <Link
        href={`/${locale}/community/notes`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại danh sách ghi chú' : 'Back to Notes'}</span>
      </Link>

      {/* Main Note Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/${locale}/community/profile/${note.userId}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full ring-2 ring-purple-500/40 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
              {note.authorAvatar ? (
                <img src={note.authorAvatar} alt={note.authorName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-white">{note.authorName.charAt(0)}</span>
              )}
            </div>
            <div>
              <span className="font-display font-extrabold text-sm text-white group-hover:text-teal-300 transition-colors block">
                {note.authorName}
              </span>
              <span className="text-xs text-slate-500 block">
                {new Date(note.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </Link>

          <Badge variant="teal" className="text-xs font-bold uppercase">
            {note.visibility}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight">
          {note.title}
        </h1>

        {/* Formatted Content */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-850 text-sm sm:text-base text-slate-200 font-sans leading-relaxed whitespace-pre-line space-y-2">
          {note.content}
        </div>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {note.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-teal-400"
              >
                <Tag className="w-3 h-3" />
                <span>#{t}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Discussion & Comments */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
        <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-400" />
          <span>{isVi ? 'Thảo Luận & Bình Luận' : 'Discussion & Comments'} ({comments.length})</span>
        </h3>

        {/* Comment Composer */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isVi ? 'Viết bình luận hoặc câu hỏi của bạn...' : 'Write a comment or question...'}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
          />
          <Button
            variant="primary"
            disabled={submittingComment || !newComment.trim()}
            icon={<Send className="w-4 h-4" />}
          >
            {isVi ? 'Gửi' : 'Post'}
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-3 pt-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs text-white">
                  {c.authorName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
