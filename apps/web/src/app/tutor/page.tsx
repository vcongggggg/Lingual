'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Send,
  MessageSquare,
  History,
  Calendar,
  Sparkles,
  ArrowRight,
  User,
  Info,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';
import { MascotPose } from '../../components/mascot';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  references?: any[];
  mood?: MascotPose;
}

const QUICK_SUGGESTIONS = [
  'Giải thích cách dùng thì Hiện tại hoàn thành',
  'Phân biệt giữa "Affect" và "Effect"',
  'Gợi ý 3 từ vựng học thuật chủ đề Môi trường',
  'Cách trả lời câu hỏi IELTS Speaking Part 1',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greet-1',
  sender: 'assistant',
  mood: 'studying',
  text: `Chào bạn! Tớ là **LingLing**, người bạn đồng hành cùng bạn học tiếng Anh mỗi ngày.

Tớ có thể giúp bạn giải đáp thắc mắc ngữ pháp, phân tích nghĩa từ vựng trong ngữ cảnh và gợi ý chiến thuật làm bài thực tế.

Bạn đang muốn tìm hiểu điều gì hôm nay?`,
  timestamp: 'Vừa xong',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Simple Markdown Formatter to prevent raw **text** from showing and protect against XSS
function renderSimpleMarkdown(content: string) {
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Escape HTML entities FIRST to prevent XSS
        const escaped = escapeHtml(line);

        // Format **bold**
        const formatted = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        if (line.startsWith('* ') || line.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ink mt-2 flex-shrink-0" />
              <span
                dangerouslySetInnerHTML={{
                  __html: formatted.replace(/^[\*\-]\s+/, ''),
                }}
              />
            </div>
          );
        }

        return (
          <p
            key={idx}
            dangerouslySetInnerHTML={{ __html: formatted }}
            className="leading-relaxed"
          />
        );
      })}
    </div>
  );
}

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await api.sendTutorMessage(text);
      const replyText = res.reply || 'Cảm ơn bạn đã hỏi. Hãy cùng tớ tìm hiểu thêm nhé!';
      let mood: MascotPose = 'studying';
      const lower = replyText.toLowerCase();
      if (lower.includes('chúc mừng') || lower.includes('tuyệt vời') || lower.includes('chính xác') || lower.includes('hoàn hảo')) {
        mood = 'cheersSoda';
      } else if (lower.includes('xin lỗi') || lower.includes('tiếc')) {
        mood = 'shyApologetic';
      } else if (lower.includes('sai rồi') || lower.includes('nhầm lẫn') || lower.includes('chưa đúng')) {
        mood = 'facepalm';
      }

      const assistantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        mood,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        references: res.refs || [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline fallback reply
      const fallbackReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        mood: 'shyApologetic',
        text: `Tớ đã ghi nhận câu hỏi của bạn về: **${text}**.

Trong tiếng Anh, việc áp dụng từ vựng vào câu ví dụ cụ thể và luyện tập ngắt quãng sẽ giúp bạn ghi nhớ sâu hơn rất nhiều!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Header bar Trợ Lý LingLing */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Trợ Lý LingLing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Người bạn đồng hành giải đáp & hướng dẫn học tập
          </h1>

          {/* Dòng nhỏ trung thực bắt buộc theo art direction */}
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Info className="w-3.5 h-3.5 text-teal" />
            <span className="font-semibold">
              Hỗ trợ giải đáp ngữ pháp, từ vựng và tư vấn kế hoạch rèn luyện cá nhân
            </span>
          </div>
        </div>

        {/* Nút Chuyển Trang Hồ Sơ & Thời Khóa Biểu */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/tutor/history"
            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-teal" />
            <span>Hồ sơ trò chuyện</span>
          </Link>

          <Link
            href="/tutor/plan"
            className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber" />
            <span>Thời khóa biểu</span>
          </Link>
        </div>
      </div>

      {/* KHUNG HỘI THOẠI VẼ NHƯ "THƯ TỪ" TRÊN GIẤY */}
      <div className="card-paper p-6 sm:p-8 space-y-6 bg-paper shadow-brutal-xl min-h-[500px] flex flex-col justify-between">
        {/* Danh Sách Tin Nhắn */}
        <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start animate-message-slide ${
                  isAssistant ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Avatar Bò LingLing cho tin nhắn trợ lý với crossfade transition */}
                {isAssistant && (
                  <div className="w-10 h-10 rounded-full border-2 border-ink bg-card flex items-center justify-center flex-shrink-0 shadow-brutal-sm overflow-hidden p-1 transition-opacity duration-300 ease-in-out">
                    <LingLing reaction={msg.mood || 'studying'} size={40} />
                  </div>
                )}

                {/* Bong bóng tin nhắn */}
                <div
                  className={`max-w-xl p-5 rounded-2xl border-2 transition-all shadow-brutal-sm ${
                    isAssistant
                      ? 'lined-paper border-ink bg-card text-ink font-serif'
                      : 'border-ink bg-ink text-paper font-sans'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-2 mb-2 text-[10px] font-black uppercase tracking-wider">
                    <span className={isAssistant ? 'text-teal' : 'text-paper-2'}>
                      {isAssistant ? 'Trợ lý LingLing' : 'Bạn'}
                    </span>
                    <span className={isAssistant ? 'text-ink-muted' : 'text-paper-2/70'}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="text-sm font-medium">
                    {renderSimpleMarkdown(msg.text)}
                  </div>
                </div>

                {/* Avatar Người dùng cho tin nhắn user */}
                {!isAssistant && (
                  <div className="w-10 h-10 rounded-full border-2 border-ink bg-amber flex items-center justify-center flex-shrink-0 shadow-brutal-sm text-ink font-black text-xs">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator: 3 chấm mực nhấp nháy + Bò thinking crossfade */}
          {isSending && (
            <div className="flex items-center gap-3 animate-message-slide">
              <div className="w-10 h-10 rounded-full border-2 border-ink bg-card flex items-center justify-center p-1 shadow-brutal-sm transition-opacity duration-300">
                <LingLing reaction="thinking" size={40} />
              </div>
              <div className="lined-paper py-3 px-4 rounded-2xl border-2 border-ink flex items-center gap-2.5 text-xs font-bold text-ink italic shadow-brutal-sm">
                <span>LingLing đang chấm bút mực viết thư</span>
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-2 h-2 rounded-full bg-ink inline-block animate-ink-dot-1" />
                  <span className="w-2 h-2 rounded-full bg-red inline-block animate-ink-dot-2" />
                  <span className="w-2 h-2 rounded-full bg-ink inline-block animate-ink-dot-3" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Cụm Gợi Ý Nhanh Dạng Tag Giấy */}
        <div className="space-y-3 pt-4 border-t-2 border-ink/15">
          <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted block">
            Gợi ý nhanh chủ đề hỏi:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="px-3 py-1.5 rounded-xl border border-ink/40 bg-card hover:border-ink hover:bg-paper-2 text-xs font-bold text-ink transition-all cursor-pointer whitespace-nowrap flex-shrink-0 shadow-brutal-sm"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Ô Nhập Thanh Giấy + Nút Gửi Đỏ */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Nhập câu hỏi của bạn gửi cho LingLing..."
              className="flex-1 bg-card border-2 border-ink rounded-2xl px-5 py-3 text-sm font-bold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isSending || !inputText.trim()}
              className="btn btn-red px-5 py-3 text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Gửi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
