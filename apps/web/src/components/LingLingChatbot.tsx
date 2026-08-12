'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  Trash2,
  Cpu,
  Database,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { chatbotApi, srsApi } from '@/lib/api';
import LingLingMascot from '@/components/LingLingMascot';

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'celebrating' | 'apologetic';

export interface RagRef {
  type: 'vocab' | 'ielts' | 'lesson';
  id: string;
  title: string;
  subtitle?: string;
  data: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  usedOllama?: boolean;
  ragApplied?: boolean;
  ragRefs?: RagRef[];
  sourceType?: 'llm' | 'rag' | 'fallback';
}

export default function LingLingChatbot() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Chat Drawer State
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');

  // Idle Timer for >60s on Exam Pages
  const [idleOnExam, setIdleOnExam] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio / Speech Recognition State
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Hover Tooltip for RAG refs
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Added SRS feedback notification animation
  const [addedSrsId, setAddedSrsId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Initial Load & Cloud Sync
  useEffect(() => {
    async function initChatHistory() {
      try {
        const saved = localStorage.getItem('lingual_chat_history');
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages([
            {
              id: 'welcome_msg',
              sender: 'bot',
              text: 'Xin chào! Tôi là **LingLing** 🤖 - Trợ lý AI của **Lingual**.\n\nTôi sẵn sàng giải đáp từ vựng, bài học và luyện thi IELTS cho bạn dựa trên dữ liệu thực tế. Bạn cần LingLing hỗ trợ gì hôm nay?',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } catch {}
    }
    initChatHistory();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('lingual_chat_history', JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Auto Scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, avatarState]);

  // 2. Idle Timer on Exam Pages (>60s)
  useEffect(() => {
    if (pathname.includes('/ielts') || pathname.includes('/srs')) {
      idleTimerRef.current = setTimeout(() => {
        setIdleOnExam(true);
      }, 60000); // 60s
    } else {
      setIdleOnExam(false);
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [pathname]);

  // 3. Handle Send Message with SSE Streaming & Avatar State Machine
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || avatarState === 'thinking' || avatarState === 'speaking') return;

    setIdleOnExam(false);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMsg: ChatMessage = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    if (!textToSend) setInputMessage('');
    setAvatarState('thinking');

    let currentText = '';
    let isOllama = false;
    let isRag = false;

    await chatbotApi.streamMessage(
      {
        message: query.trim(),
        history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        contextPage: pathname,
      },
      {
        onMetadata: (meta) => {
          isOllama = Boolean(meta.usedOllama);
          isRag = Boolean(meta.ragApplied);
          setAvatarState(isOllama ? 'speaking' : isRag ? 'celebrating' : 'apologetic');

          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    usedOllama: meta.usedOllama,
                    ragApplied: meta.ragApplied,
                    ragRefs: meta.ragRefs,
                    sourceType: meta.usedOllama ? 'llm' : meta.ragApplied ? 'rag' : 'fallback',
                  }
                : m
            )
          );
        },
        onToken: (token) => {
          setAvatarState('speaking');
          currentText += token;
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsgId ? { ...m, text: currentText } : m))
          );
        },
        onDone: () => {
          setAvatarState(isOllama || isRag ? 'idle' : 'apologetic');
          setTimeout(() => setAvatarState('idle'), 2500);
        },
        onError: () => {
          setAvatarState('apologetic');
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text: 'Xin lỗi bạn, LingLing vừa gặp gián đoạn kết nối. Bạn hãy thử đặt lại câu hỏi nhé!',
                    sourceType: 'fallback',
                  }
                : m
            )
          );
          setTimeout(() => setAvatarState('idle'), 3000);
        },
      }
    );
  };

  // 4. TTS Handler (Web Speech API)
  const handleTTS = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ phát âm thanh Web Speech API.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    // Detect language: if mostly English words, set en-US, else vi-VN
    const hasEnglish = /[a-zA-Z]{4,}/.test(text);
    utterance.lang = hasEnglish ? 'en-US' : 'vi-VN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // 5. Speech Recognition Handler (Mic Input)
  const toggleRecording = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Trình duyệt (như Safari) chưa hỗ trợ thu âm SpeechRecognition.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        setSpeechError('Không thể thu âm giọng nói. Bạn hãy kiểm tra quyền micro.');
        setTimeout(() => setSpeechError(null), 4000);
      };
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // 6. Action: Add Vocab to SRS
  const handleAddToSrs = async (vocabData: any) => {
    try {
      await srsApi.addWord({
        targetText: vocabData.targetText || vocabData.title,
        translation: vocabData.translation || vocabData.subtitle || 'Đã thêm từ LingLing',
        phonetic: vocabData.phonetic,
        exampleSentence: vocabData.exampleSentence,
        cefrLevel: vocabData.cefrLevel || 'B2',
      });
      setAddedSrsId(vocabData.id || vocabData.targetText);
      setAvatarState('celebrating');
      setTimeout(() => {
        setAddedSrsId(null);
        setAvatarState('idle');
      }, 2000);
    } catch (err) {
      alert('Không thể thêm từ vào SRS. Bạn hãy đăng nhập tài khoản.');
    }
  };

  // Quick Prompts
  const quickPrompts = [
    'Giải thích từ "substantial" giúp tôi',
    'Tiêu chí chấm IELTS Writing là gì?',
    'Hôm nay tôi nên học từ vựng nào?',
  ];

  // Clear History
  const clearHistory = () => {
    const welcome: ChatMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: 'Đã làm mới cuộc trò chuyện. Tôi là LingLing 🤖, bạn cần hỗ trợ điều gì?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
    try {
      localStorage.removeItem('lingual_chat_history');
    } catch {}
  };

  // Render Mascot Visual according to AvatarState
  const renderAvatarVisual = () => {
    return <LingLingMascot state={avatarState} size={40} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-4 w-[92vw] sm:w-[420px] h-[540px] rounded-3xl bg-slate-950/95 border border-amber-500/30 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500/20 via-slate-900 to-teal-500/20 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderAvatarVisual()}
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    LingLing AI <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-teal-300 font-medium">
                    {avatarState === 'thinking'
                      ? 'Đang tra cứu dữ liệu...'
                      : avatarState === 'speaking'
                      ? 'Đang giải đáp...'
                      : avatarState === 'apologetic'
                      ? 'LingLing Fallback Mode'
                      : 'Ollama Stream + Lingual RAG'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearHistory}
                  title="Xóa lịch sử chat"
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Speech Alert */}
            {speechError && (
              <div className="px-4 py-2 bg-amber-500/20 border-b border-amber-500/30 text-amber-300 text-[11px]">
                ⚠️ {speechError}
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] whitespace-pre-line shadow-md relative group ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text || (m.sender === 'bot' && <span className="animate-pulse">LingLing đang gõ...</span>)}

                    {/* TTS Button on Bot Messages */}
                    {m.sender === 'bot' && m.text && (
                      <button
                        onClick={() => handleTTS(m.id, m.text)}
                        title="Nghe giọng đọc AI"
                        className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 transition-colors"
                      >
                        {speakingMsgId === m.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-amber-400" />
                            <span className="animate-pulse">Dừng</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                            <span>Đọc</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* ACTIONABLE WIDGETS IN BUBBLE */}
                    {m.sender === 'bot' && m.ragRefs && m.ragRefs.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Thẻ tương tác từ DB Lingual:
                        </p>

                        {m.ragRefs.map((ref, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-white truncate">{ref.title}</h4>
                              {ref.subtitle && <p className="text-[10px] text-slate-400 truncate">{ref.subtitle}</p>}
                            </div>

                            {ref.type === 'vocab' && (
                              <button
                                onClick={() => handleAddToSrs(ref.data)}
                                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[11px] font-bold border border-teal-500/40 flex items-center gap-1 transition-colors shrink-0"
                              >
                                {addedSrsId === (ref.data.id || ref.data.targetText) ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã thêm!
                                  </>
                                ) : (
                                  <>
                                    <PlusCircle className="w-3 h-3" /> + SRS
                                  </>
                                )}
                              </button>
                            )}

                            {ref.type === 'ielts' && (
                              <button
                                onClick={() => router.push(`/vi/ielts`)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 flex items-center gap-1 transition-colors shrink-0"
                              >
                                Mở thi thử <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Badges with Tooltips */}
                  <div className="flex items-center gap-2 text-[9px] text-slate-400 px-1 relative">
                    <span>{m.timestamp}</span>

                    {m.sender === 'bot' && m.sourceType === 'llm' && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30 animate-fadeIn">
                        <Cpu className="w-2.5 h-2.5 animate-pulse text-purple-400" /> Ollama Qwen2.5
                      </span>
                    )}

                    {m.sender === 'bot' && m.sourceType === 'rag' && (
                      <div className="relative inline-block">
                        <button
                          onMouseEnter={() => setActiveTooltipId(m.id)}
                          onMouseLeave={() => setActiveTooltipId(null)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30 animate-fadeIn cursor-pointer"
                        >
                          <BookOpen className="w-2.5 h-2.5 text-teal-400" /> Lingual RAG DB
                        </button>

                        {/* RAG Tooltip Hover */}
                        {activeTooltipId === m.id && m.ragRefs && (
                          <div className="absolute bottom-full left-0 mb-1.5 w-56 p-2 rounded-xl bg-slate-900 border border-teal-500/40 shadow-xl text-[10px] text-slate-200 z-30 pointer-events-none animate-fadeIn">
                            <p className="font-bold text-teal-400 border-b border-slate-800 pb-1 mb-1">
                              Bản ghi DB thực tế đã tra:
                            </p>
                            {m.ragRefs.map((r, i) => (
                              <div key={i} className="truncate">
                                • <span className="font-semibold text-white">{r.title}</span> ({r.subtitle})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {m.sender === 'bot' && m.sourceType === 'fallback' && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 animate-fadeIn">
                        <Zap className="w-2.5 h-2.5 text-amber-400" /> Amber Fallback Mode
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {avatarState === 'thinking' && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 w-fit">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>LingLing đang suy nghĩ & tra cứu RAG...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors border border-slate-700 shrink-0"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Footer with Mic & Send */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={toggleRecording}
                title={isRecording ? 'Đang thu âm...' : 'Bấm để nói bằng Micro'}
                className={`p-2.5 rounded-xl border transition-all ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Hỏi LingLing từ vựng, bài học, IELTS..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || avatarState === 'thinking' || avatarState === 'speaking'}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button with Idle Pulse Dot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 p-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-teal-400 text-slate-950 font-bold shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 relative"
      >
        <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center shadow-inner overflow-hidden">
          <LingLingMascot state={avatarState} size={26} />
        </div>
        <span className="text-xs font-extrabold pr-1 hidden sm:inline text-slate-950">Chat với LingLing</span>
        <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />

        {/* Subtle Idle Dot Pulse if idle >60s on exam page */}
        {idleOnExam && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-slate-950" />
          </span>
        )}
      </button>
    </div>
  );
}
