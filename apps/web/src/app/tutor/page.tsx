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
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../lib/api';
import { LingLing } from '../../components/ui/LingLing';
import { MASCOT_REGISTRY, MascotPose } from '../../components/mascot';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  mood?: MascotPose;
  provider?: string;
  responseTimeMs?: number;
  grounding?: {
    currentStreak: number;
    goldenHour: string;
    retentionRate: number;
    weakestSkill: string;
    weakestSkillScore: number;
    srsDueCount: number;
    forgottenWords: string[];
  };
  suggestedActions?: { title: string; url: string }[];
}

const QUICK_SUGGESTIONS = [
  'Điểm yếu của tớ hiện tại là gì và Bò có kế hoạch gì không?',
  'Hôm nay tớ có từ vựng nào trong SRS cần ôn tập không?',
  'Giải thích cách dùng thì Hiện tại hoàn thành',
  'Gợi ý 3 từ vựng học thuật chủ đề Môi trường',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greet-1',
  sender: 'assistant',
  mood: 'studying',
  text: `Chào bạn! Tớ là **Bò LingLing** (R2.0) 🐮 — trợ lý học tập tiếng Anh cá nhân của bạn trên LinguaFlow.
  
Tớ đã nắm rõ chuỗi ngày học (Streak), khung giờ vàng và radar 5 kỹ năng của bạn. Bạn muốn tớ giải đáp thắc mắc gì hôm nay?`,
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

        const escaped = escapeHtml(line);
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
  const [aiStatus, setAiStatus] = useState<{ aiConnected: boolean; model: string; message: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Kiểm tra kết nối AI khi mở trang
  useEffect(() => {
    api.getTutorStatus()
      .then(setAiStatus)
      .catch(() => setAiStatus({ aiConnected: false, model: 'none', message: 'Không thể kết nối API' }));
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    // Kiểm tra key trước khi gửi
    if (aiStatus && !aiStatus.aiConnected) {
      const blockedMsg: ChatMessage = {
        id: `blocked-${Date.now()}`,
        sender: 'assistant',
        mood: 'shyApologetic',
        text: `⚠️ **Chưa kết nối AI**: Máy chủ chưa cấu hình \`GEMINI_API_KEY\`. Hệ thống không giả lập câu trả lời AI để đảm bảo tính xác thực.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, blockedMsg]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    // Chuẩn bị lịch sử hội thoại gần nhất
    const history = messages
      .filter((m) => m.id !== 'greet-1')
      .map((m) => ({
        role: (m.sender === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        text: m.text,
      }));

    try {
      const res = await api.sendTutorMessage(text, history);

      if (!res.aiConnected && res.error) {
        const errorMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'assistant',
          mood: 'shyApologetic',
          text: `⚠️ **Chưa kết nối AI**: ${res.error}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const replyText = res.reply || 'Cảm ơn bạn đã hỏi. Hãy cùng tớ tìm hiểu thêm nhé!';

      // Xác thực mood có tồn tại trong MASCOT_REGISTRY không
      let validMood: MascotPose = 'speaking';
      if (res.mood && res.mood in MASCOT_REGISTRY) {
        validMood = res.mood as MascotPose;
      } else {
        const lower = replyText.toLowerCase();
        if (lower.includes('chúc mừng') || lower.includes('tuyệt vời') || lower.includes('chính xác')) {
          validMood = 'party';
        } else if (lower.includes('xin lỗi') || lower.includes('tiếc')) {
          validMood = 'shyApologetic';
        } else if (lower.includes('quên') || lower.includes('nhầm lẫn') || lower.includes('lười')) {
          validMood = 'pointYou';
        } else {
          validMood = 'speaking';
        }
      }

      const assistantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        mood: validMood,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        provider: res.provider || 'gemini',
        responseTimeMs: res.responseTimeMs,
        grounding: res.grounding,
        suggestedActions: res.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const fallbackReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        mood: 'shyApologetic',
        text: `⚠️ **Lỗi kết nối**: Không thể gửi câu hỏi đến AI lúc này. Vui lòng thử lại sau ít phút. (${err.message})`,
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
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Trợ Lý LingLing R2.0</span>
            </div>

            {/* Trạng thái kết nối AI thật */}
            {aiStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                  aiStatus.aiConnected
                    ? 'bg-green-500/15 text-green-700 border-green-500/30'
                    : 'bg-red/15 text-red border-red/30'
                }`}
              >
                {aiStatus.aiConnected ? (
                  <>
                    <Sparkles className="w-3 h-3 text-green-600" />
                    <span>Gemini AI (Live)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-red" />
                    <span>Chưa kết nối AI</span>
                  </>
                )}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Người Bạn Đồng Hành Giải Đáp & Hướng Dẫn Học Tập
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Info className="w-3.5 h-3.5 text-teal" />
            <span className="font-semibold">
              Trò chuyện trực tiếp cùng Bò LingLing, đối chiếu điểm yếu, chuỗi streak và từ hay quên thật
            </span>
          </div>
        </div>

        {/* Nút Chuyển Trang Hồ Sơ & Thời Khóa Biểu */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/analytics#bao-cao-bo"
            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5"
          >
            <span>Báo cáo Bò 🐮</span>
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

      {/* Cảnh báo nếu chưa có Key */}
      {aiStatus && !aiStatus.aiConnected && (
        <div className="p-4 bg-red/10 border-2 border-red rounded-2xl flex items-center gap-3 text-xs font-bold text-red shadow-brutal-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>
            Hệ thống hiện tại chưa kết nối AI do thiếu <code>GEMINI_API_KEY</code> trong cấu hình máy chủ. Giao diện từ chối trả lời giả lập AI theo quy chuẩn minh bạch.
          </span>
        </div>
      )}

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
                  className={`max-w-xl p-5 rounded-2xl border-2 transition-all shadow-brutal-sm space-y-2 ${
                    isAssistant
                      ? 'lined-paper border-ink bg-card text-ink font-serif'
                      : 'border-ink bg-ink text-paper font-sans'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-2 text-[10px] font-black uppercase tracking-wider">
                    <span className={isAssistant ? 'text-teal flex items-center gap-1.5' : 'text-paper-2'}>
                      <span>{isAssistant ? 'Trợ lý Bò LingLing 🐮' : 'Bạn'}</span>
                      {isAssistant && msg.provider === 'gemini' && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-green-500/15 text-green-700 border border-green-500/30 font-sans tracking-normal lowercase">
                          gemini{msg.responseTimeMs ? ` (${msg.responseTimeMs}ms)` : ''}
                        </span>
                      )}
                    </span>
                    <span className={isAssistant ? 'text-ink-muted' : 'text-paper-2/70'}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="text-sm font-medium">
                    {renderSimpleMarkdown(msg.text)}
                  </div>

                  {/* Grounding Info Chip nếu có */}
                  {isAssistant && msg.grounding && (
                    <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center gap-2 text-[11px] font-sans font-bold text-ink-muted">
                      <span className="px-2 py-0.5 rounded bg-yellow/20 text-ink border border-yellow/40 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red inline" />
                        <span>{msg.grounding.currentStreak} ngày streak</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue/15 text-blue border border-blue/30">
                        Điểm yếu: {msg.grounding.weakestSkill} ({msg.grounding.weakestSkillScore}đ)
                      </span>
                      {msg.grounding.srsDueCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-green-500/15 text-green-700 border border-green-500/30">
                          {msg.grounding.srsDueCount} từ SRS đến hạn
                        </span>
                      )}
                    </div>
                  )}

                  {/* Suggested Action Buttons */}
                  {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <Link
                          key={aIdx}
                          href={act.url}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-paper-2 hover:bg-[#EAE0CB] border border-ink text-[11px] font-black text-ink shadow-brutal-sm transition-all"
                        >
                          <span>{act.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
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
                <span>LingLing đang lật sổ tra cứu dữ liệu...</span>
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
            Gợi ý chủ đề hỏi Bò LingLing:
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
              placeholder="Nhập câu hỏi của bạn gửi cho Bò LingLing..."
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
