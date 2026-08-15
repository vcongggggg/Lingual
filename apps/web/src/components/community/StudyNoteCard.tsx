'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, BookOpen, MessageSquare, Tag, ThumbsUp } from 'lucide-react';
import { StudyNote } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';
import { communityApi } from '@/lib/community/api';
import { sfx } from '@/lib/soundEffects';

interface StudyNoteCardProps {
  note: StudyNote;
  locale?: string;
  className?: string;
}

export default function StudyNoteCard({
  note,
  locale = 'vi',
  className = '',
}: StudyNoteCardProps) {
  const isVi = locale === 'vi';
  const [reactions, setReactions] = useState(note.reactions || { helpful: 0, inspiring: 0, useful: 0 });
  const [reactionCount, setReactionCount] = useState(note.reactionCount || 0);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  const handleToggleReaction = async (type: string) => {
    sfx.playClick();
    try {
      const res = await communityApi.toggleReaction(note.id, { reactionType: type });
      if (res?.reactions) {
        setReactions(res.reactions);
        setReactionCount(res.reactionCount);
        setActiveReaction(res.activeReaction);
      }
    } catch {}
  };

  return (
    <div className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-all space-y-4 ${className}`}>
      {/* Author & Visibility */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/${locale}/community/profile/${note.userId}`}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-full ring-2 ring-purple-500/30 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 relative">
            {note.authorAvatar ? (
              <Image src={note.authorAvatar} alt={note.authorName} fill className="object-cover" unoptimized />
            ) : (
              <span className="font-bold text-xs text-white">{note.authorName.charAt(0)}</span>
            )}
          </div>
          <div>
            <span className="font-display font-extrabold text-xs text-white group-hover:text-teal-300 transition-colors block">
              {note.authorName}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {new Date(note.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </Link>

        <Badge variant={note.visibility === 'public' ? 'teal' : 'amber'} className="text-[10px] font-bold">
          {note.visibility}
        </Badge>
      </div>

      {/* Note Title & Content Snippet */}
      <div className="space-y-1.5">
        <Link href={`/${locale}/community/notes/${note.id}`} className="block group">
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
            {note.title}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-3 whitespace-pre-line">
          {note.content}
        </p>
      </div>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {note.tags.map((t) => (
            <Link
              key={t}
              href={`/${locale}/community/notes?tag=${t}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-teal-400 hover:border-teal-500/40 transition-colors"
            >
              <Tag className="w-2.5 h-2.5" />
              <span>#{t}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Reaction Bar & Comments Link */}
      <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Helpful Reaction */}
          <button
            type="button"
            onClick={() => handleToggleReaction('helpful')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              activeReaction === 'helpful'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-850'
            }`}
            title="Hữu ích"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{reactions.helpful || 0}</span>
          </button>

          {/* Inspiring Reaction */}
          <button
            type="button"
            onClick={() => handleToggleReaction('inspiring')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              activeReaction === 'inspiring'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-850'
            }`}
            title="Truyền cảm hứng"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{reactions.inspiring || 0}</span>
          </button>

          {/* Useful Reaction */}
          <button
            type="button"
            onClick={() => handleToggleReaction('useful')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              activeReaction === 'useful'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-850'
            }`}
            title="Giá trị"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{reactions.useful || 0}</span>
          </button>
        </div>

        {/* Comments Link */}
        <Link
          href={`/${locale}/community/notes/${note.id}`}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{note.commentCount || 0} {isVi ? 'bình luận' : 'comments'}</span>
        </Link>
      </div>
    </div>
  );
}
