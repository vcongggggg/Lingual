'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TutorMessage as ITutorMessage, TutorContext } from '@linguaflow/domain';
import { tutorApi } from '@/lib/tutor/tutorApi';
import TutorMessage from './TutorMessage';
import TutorInput from './TutorInput';
import TutorTypingIndicator from './TutorTypingIndicator';
import TutorQuickPrompts from './TutorQuickPrompts';

interface TutorChatProps {
  initialContext?: TutorContext;
  locale?: string;
  className?: string;
}

export default function TutorChat({
  initialContext,
  locale = 'vi',
  className = '',
}: TutorChatProps) {
  const isVi = locale === 'vi';
  const [messages, setMessages] = useState<ITutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial welcome message
    const welcomeMsg: ITutorMessage = {
      id: 'welcome-msg',
      role: 'tutor',
      content: isVi
        ? `Xin chào! Tôi là **AI Tutor Cá Nhân** của bạn tại LinguaFlow.\n\nTôi đã tổng hợp dữ liệu học tập của bạn qua 18 phân hệ (Từ vựng, Nghe, Nói, Đọc, Viết, Thi thử). Bạn muốn giải thích ngữ pháp, kiểm tra bài làm hay lập kế hoạch học tập hôm nay?`
        : `Hello! I am your **Personal AI Tutor** on LinguaFlow.\n\nI have reviewed your learning profile across all 18 labs (Vocabulary, Listening, Speaking, Reading, Writing, Exams). Would you like to review grammar, ask about mistakes, or build today's study plan?`,
      timestamp: new Date().toISOString(),
      actions: [
        { type: 'start_srs', label: isVi ? 'Ôn Thẻ SRS Đến Hạn' : 'Review Due SRS Cards', route: `/${locale}/srs`, priority: 'critical' },
        { type: 'start_speaking', label: isVi ? 'Luyện Nói & Phản Xạ' : 'Practice Speaking', route: `/${locale}/speaking`, priority: 'high' },
      ],
    };
    setMessages([welcomeMsg]);
  }, [isVi, locale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ITutorMessage = {
      id: `user-msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await tutorApi.chat({
        message: text,
        locale,
      });

      if (res?.response) {
        const tutorMsg: ITutorMessage = {
          id: res.response.messageId,
          role: 'tutor',
          content: res.response.content,
          timestamp: new Date().toISOString(),
          intent: res.response.intent,
          actions: res.response.actions,
          citations: res.response.citations,
          recommendations: res.response.recommendations,
          explanation: res.response.explanation,
        };
        setMessages((prev) => [...prev, tutorMsg]);
      }
    } catch {
      // Fallback local response if network error
      const fallbackMsg: ITutorMessage = {
        id: `fallback-${Date.now()}`,
        role: 'tutor',
        content: isVi
          ? 'Tôi đã nhận được câu hỏi của bạn. Hãy tiếp tục duy trì việc ôn luyện từ vựng và làm bài tập định kỳ nhé!'
          : 'I received your query. Keep reviewing your daily vocabulary and practicing consistency!',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[650px] rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <TutorMessage key={msg.id} message={msg} locale={locale} />
        ))}

        {loading && <TutorTypingIndicator locale={locale} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts & Input Strip */}
      <div className="p-4 border-t border-slate-850 space-y-3 bg-slate-900/60 backdrop-blur-md">
        <TutorQuickPrompts onSelectPrompt={handleSendMessage} locale={locale} />
        <TutorInput onSend={handleSendMessage} disabled={loading} locale={locale} />
      </div>
    </div>
  );
}
