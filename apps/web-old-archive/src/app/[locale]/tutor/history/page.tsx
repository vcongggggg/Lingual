'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, History, Trophy, Clock, Bot, MessageSquare } from 'lucide-react';
import { tutorApi } from '@/lib/tutor/tutorApi';
import { TutorConversation } from '@linguaflow/domain';
import { Badge } from '@linguaflow/ui';

export default function TutorHistoryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [conversation, setConversation] = useState<TutorConversation | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    tutorApi
      .getHistory('u-demo-1')
      .then((res) => {
        if (res?.conversation) setConversation(res.conversation);
        if (res?.sessions) setSessions(res.sessions);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 pointer-events-auto">
      <Link
        href={`/${locale}/tutor`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isVi ? 'Quay lại AI Tutor Chat' : 'Back to AI Tutor Chat'}</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white flex items-center gap-2.5">
          <History className="w-6 h-6 text-teal-400" />
          <span>{isVi ? 'Lịch Sử Tương Tác & Luyện Tập' : 'Tutor Interaction History'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          {isVi
            ? 'Theo dõi các phiên hỏi đáp với AI Tutor và các bài luyện tập thích ứng đã hoàn thành.'
            : 'Review your past dialogues with the AI Tutor and completed adaptive practice sessions.'}
        </p>
      </div>

      {/* Completed Sessions List */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="font-display font-extrabold text-base text-white">
          {isVi ? 'Các Bài Luyện Đã Hoàn Thành' : 'Completed Practice Sessions'}
        </h3>

        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            {isVi ? 'Chưa có bài luyện nào được hoàn thành.' : 'No practice sessions completed yet.'}
          </p>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((s, idx) => (
              <div
                key={s.id || idx}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-white text-sm">{s.sessionId || 'Mini Practice Drill'}</span>
                  <span className="text-[11px] text-slate-400 block font-sans">
                    Thời lượng: {s.durationMinutes || 10} phút • Độ chính xác: {s.accuracy || 80}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    +{s.xpAwarded || 25} XP
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(s.completedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation History */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <span>{isVi ? 'Hội Thoại Gần Đây' : 'Recent Conversation Logs'}</span>
        </h3>

        {!conversation || conversation.messages.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            {isVi ? 'Chưa có đoạn hội thoại nào.' : 'No conversation history logged.'}
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {conversation.messages.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl text-xs ${
                  m.role === 'user'
                    ? 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 ml-8'
                    : 'bg-slate-950/80 border border-slate-850 text-slate-300 mr-8'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono">
                  <span className="font-bold uppercase">{m.role}</span>
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
