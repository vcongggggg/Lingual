'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Clock,
  ShieldAlert,
  Award,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ChevronRight,
  BookOpen,
  Headphones,
  FileText,
  AlertTriangle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { ieltsApi } from '@/lib/api';
import { soundFx } from '@/lib/soundFx';

export default function IeltsMockTestPage() {
  const routeParams = useParams();
  const locale = (routeParams?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'Reading' | 'Listening'>('all');
  const [questions, setQuestions] = useState<any[]>([]);
  const [showPassageDrawer, setShowPassageDrawer] = useState(false);

  // Reading Passage references for split-view
  const READING_PASSAGES = [
    {
      id: 'passage1',
      title: 'Passage 1: The Engineering Feat of Roman Aqueducts',
      text: `The Aqua Appia, constructed in 312 BC by censor Appius Claudius Caecus, marked the beginning of Rome's monumental hydraulic engineering legacy. While popular imagination envisions aqueducts primarily as majestic arched stone bridges striding across valleys, over 80 percent of the total 800-kilometer empire-wide network was buried subterranean conduits. Roman engineers (aquarii) utilized specialized levelling instruments, most notably the chorobates—a wooden bench-like device 20 feet long with plumb lines and water channels—to calculate infinitesimal downhill gradients, often less than 1 in 1,000. This gravity-fed design ensured steady water velocity without hydraulic erosion or stagnant siltation.`
    },
    {
      id: 'passage2',
      title: 'Passage 2: Neuroplasticity and Cognitive Rejuvenation',
      text: `For much of the twentieth century, conventional neuroscience clung to the static brain hypothesis: that neural architecture was hardwired during early development and irrevocable loss characterized mature adulthood. Groundbreaking experiments utilizing functional Magnetic Resonance Imaging (fMRI) in the 1990s overturned this dogma. Researchers observed intense neurogenesis in the adult hippocampus and dendritic arborization following deliberate cognitive enrichment. The human brain continuously reorganizes synaptic pathways in response to environmental stimulation, proving that second language acquisition at advanced ages actively builds cognitive reserve against neurodegenerative decline.`
    }
  ];

  // Default fallback questions in case API is offline
  const DEFAULT_QUESTIONS = [
    {
      id: 'r_p1_q1',
      skill: 'Reading',
      passageId: 'passage1',
      prompt: 'The Aqua Appia was the first aqueduct constructed to supply water to Rome.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'True',
    },
    {
      id: 'r_p1_q2',
      skill: 'Reading',
      passageId: 'passage1',
      prompt: 'Most of the Roman aqueduct network consisted of arched stone bridges above ground.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'False',
    },
    {
      id: 'r_p1_q5',
      skill: 'Reading',
      passageId: 'passage1',
      prompt: 'Which instrument did Roman surveyors use to establish precise gradients for water flow?',
      options: ['The astrolabe', 'The chorobates', 'The sextant', 'The sundial'],
      correctAnswer: 'The chorobates',
    },
    {
      id: 'r_p2_q14',
      skill: 'Reading',
      passageId: 'passage2',
      prompt: 'Twentieth-century neuroscientists believed that the adult brain could readily grow new neurons.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'False',
    },
    {
      id: 'r_p2_q15',
      skill: 'Reading',
      passageId: 'passage2',
      prompt: 'Neuroimaging technologies like fMRI provided empirical evidence supporting brain plasticity.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'True',
    },
    {
      id: 'r_p3_q28',
      skill: 'Reading',
      prompt: 'The displacement effect describes machines replacing human workers in algorithmic tasks.',
      options: ['True', 'False', 'Not Given'],
      correctAnswer: 'True',
    },
    {
      id: 'l_s1_q1',
      skill: 'Listening',
      prompt: 'What subject is Daniel going to study at the university?',
      options: ['Biotechnology', 'Civil Engineering', 'Computer Science', 'Business Administration'],
      correctAnswer: 'Biotechnology',
    },
    {
      id: 'l_s1_q4',
      skill: 'Listening',
      prompt: 'What is Daniel\'s maximum weekly budget ceiling?',
      options: ['£150', '£175', '£180', '£200'],
      correctAnswer: '£180',
    },
    {
      id: 'l_s2_q11',
      skill: 'Listening',
      prompt: 'In what year was the facility originally founded as a naval dry dock?',
      options: ['1884', '1918', '1984', '2018'],
      correctAnswer: '1884',
    },
    {
      id: 'l_s3_q22',
      skill: 'Listening',
      prompt: 'Which specific geographic location did the students select for their revised fieldwork?',
      options: ['Heron Island', 'Bikini Atoll', 'Galapagos Islands', 'Okinawa Marine Reserve'],
      correctAnswer: 'Heron Island',
    },
    {
      id: 'l_s4_q31',
      skill: 'Listening',
      prompt: 'Approximately when did the earliest ancestral cetacean transition begin?',
      options: ['50 million years ago', '25 million years ago', '10 million years ago', '100 million years ago'],
      correctAnswer: '50 million years ago',
    },
    {
      id: 'l_s4_q40',
      skill: 'Listening',
      prompt: 'Which living animals are the closest terrestrial relatives of cetaceans?',
      options: ['Hippopotamuses', 'Elephants', 'Grizzly bears', 'Sea lions'],
      correctAnswer: 'Hippopotamuses',
    },
  ];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await ieltsApi.getMockTestQuestions();
        if (res.success && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions);
        } else {
          setQuestions(DEFAULT_QUESTIONS);
        }
      } catch {
        setQuestions(DEFAULT_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerColorClass = (() => {
    if (timeLeft > 600) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (timeLeft > 300) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/50 bg-rose-950/50 animate-pulse';
  })();

  const filteredQuestions = questions.filter((q) => {
    if (activeTab === 'all') return true;
    return q.skill?.toLowerCase() === activeTab.toLowerCase();
  });

  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (questionId: string, opt: string) => {
    soundFx.playClick();
    setUserAnswers((prev) => ({ ...prev, [questionId]: opt }));
  };

  const toggleFlag = (questionId: string) => {
    soundFx.playClick();
    setFlaggedQuestions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const scrollToQuestion = (id: string) => {
    soundFx.playClick();
    const el = document.getElementById(`q-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async () => {
    soundFx.playFanfare();
    try {
      const res = await ieltsApi.submitMockTest({
        type: 'academic',
        durationSec: 1800 - timeLeft,
        answers: userAnswers,
      });
      if (res.success) {
        setResult(res);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto relative">
      {/* FLOATING LED COUNTDOWN HUD */}
      <header className="sticky top-20 z-40 flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/ielts`}
            onClick={() => soundFx.playClick()}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider animate-pulse">
                LIVE EXAM
              </span>
              <h1 className="text-base sm:text-lg font-black font-display text-white tracking-tight">
                IELTS Academic Exam Simulation
              </h1>
            </div>
            <div className="text-xs text-slate-400 font-sans flex items-center gap-2 mt-0.5">
              <span>Đã làm: <strong className="text-teal-300">{answeredCount}/{questions.length}</strong></span>
              <span>•</span>
              <span>Đánh dấu: <strong className="text-amber-300">{Object.values(flaggedQuestions).filter(Boolean).length}</strong></span>
            </div>
          </div>
        </div>

        {/* LED Timer & Actions */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              setShowPassageDrawer(!showPassageDrawer);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>{showPassageDrawer ? 'Ẩn Bài Đọc' : 'Xem Bài Đọc'}</span>
          </button>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-black text-xl shadow-lg transition-colors ${timerColorClass}`}>
            <Clock className="w-5 h-5 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {!submitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: PASSAGE DRAWER & QUESTIONS */}
          <main className="lg:col-span-8 space-y-6">
            {/* Split Passage Viewer if toggled */}
            {showPassageDrawer && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-teal-300 font-black text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Tài Liệu Đọc Học Thuật (Reading Passage)</span>
                  </div>
                  <span className="text-xs text-slate-400">Bôi đen để đọc kỹ</span>
                </div>
                {READING_PASSAGES.map((p) => (
                  <div key={p.id} className="space-y-2 pt-2">
                    <h3 className="text-sm font-black text-white">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 select-text">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs Filter */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {(['all', 'Reading', 'Listening'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab(tab);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-black shadow-lg shadow-teal-500/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab === 'all'
                      ? `Tất cả (${questions.length})`
                      : tab === 'Reading'
                      ? `📖 Đọc (${questions.filter((q) => q.skill === 'Reading').length})`
                      : `🎧 Nghe (${questions.filter((q) => q.skill === 'Listening').length})`}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                Hiển thị <strong className="text-white">{filteredQuestions.length}</strong> câu
              </span>
            </div>

            {loading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-slate-400 font-semibold">Đang nạp đề thi IELTS Academic...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredQuestions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isFlagged = !!flaggedQuestions[q.id];

                  return (
                    <div
                      key={q.id || idx}
                      id={`q-${q.id}`}
                      className={`p-6 rounded-3xl bg-slate-900/80 border transition-all duration-300 space-y-4 backdrop-blur-xl shadow-xl ${
                        isFlagged
                          ? 'border-amber-500/50 shadow-amber-500/10'
                          : isAnswered
                          ? 'border-teal-500/40'
                          : 'border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border uppercase ${
                            q.skill === 'Listening'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                          }`}>
                            {q.skill || 'Academic'}
                          </span>
                          <span className="text-xs font-black text-slate-300 font-mono">
                            CÂU {idx + 1}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleFlag(q.id)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                            isFlagged
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                          title="Đánh dấu câu hỏi để xem lại"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span className="text-[10px] font-bold">{isFlagged ? 'Đã ghim' : 'Ghim'}</span>
                        </button>
                      </div>

                      <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                        {q.prompt}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options?.map((opt: string) => {
                          const isSelected = userAnswers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`p-3.5 rounded-2xl text-left text-xs font-medium border transition-all duration-200 flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 border-teal-400 text-white font-bold ring-1 ring-teal-400/40 shadow-lg shadow-teal-500/10'
                                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                              }`}
                            >
                              <span className="leading-snug">{opt}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 ml-2" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-700 group-hover:border-slate-500 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Submit Action */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div>
                <span className="text-sm font-black text-white block">Sẵn sàng hoàn tất bài thi?</span>
                <span className="text-xs text-slate-400">
                  Bạn đã trả lời {answeredCount}/{questions.length} câu hỏi.
                </span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-teal-500/25 hover:scale-105 active:scale-95"
              >
                Nộp Bài Thi Ngay ({answeredCount}/{questions.length})
              </button>
            </div>
          </main>

          {/* RIGHT 4 COLUMNS: 40-QUESTION MINI RADAR NAVIGATOR */}
          <aside className="lg:col-span-4 sticky top-44 space-y-6">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Radar Điều Hướng ({questions.length} Câu)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Nhấp để nhảy đến</span>
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-md bg-teal-500" /> Đã trả lời
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-md bg-amber-500" /> Đã ghim
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-md bg-slate-800" /> Chưa làm
                </span>
              </div>

              {/* Radar Mini Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2">
                {questions.map((q, idx) => {
                  const isDone = !!userAnswers[q.id];
                  const isGhim = !!flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => scrollToQuestion(q.id)}
                      className={`h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center relative ${
                        isGhim
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400 ring-1 ring-amber-400/40'
                          : isDone
                          ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                          : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                      {isGhim && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-black text-xs transition-all"
                >
                  Hoàn Tất & Nộp Bài
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* 3D HOLOGRAM CERTIFICATE RESULT CARD */
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/50 text-center space-y-8 shadow-2xl backdrop-blur-3xl animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25 animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chứng Nhận Điểm Thi IELTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              Hoàn Thành Kỳ Thi Thử Mô Phỏng
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Điểm số được quy đổi tương đương theo tiêu chuẩn khảo thí Cambridge IELTS 9.0.
            </p>
          </div>

          {/* Hologram Metal Badge */}
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-teal-500/40 shadow-inner space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">
                Estimated Overall Band Score
              </span>
              <div className="text-6xl sm:text-7xl font-display font-black text-gradient-gold my-2">
                {result?.attempt?.overallBand || result?.bandScore?.overall || 7.5}
              </div>
              <span className="text-xs text-emerald-400 font-bold">Trình độ tương đương C1 Academic Fluency</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Reading</span>
                <span className="text-2xl font-black text-teal-400 font-display">
                  Band {result?.attempt?.readingBand || 7.0}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">
                  Đúng: {result?.attempt?.readingCorrect ?? 5}/{result?.attempt?.readingTotal ?? 6} câu
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Listening</span>
                <span className="text-2xl font-black text-purple-400 font-display">
                  Band {result?.attempt?.listeningBand || 8.0}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">
                  Đúng: {result?.attempt?.listeningCorrect ?? 5}/{result?.attempt?.listeningTotal ?? 6} câu
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setSubmitted(false);
                setUserAnswers({});
                setTimeLeft(1800);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thi Lại Đề Này</span>
            </button>

            <Link
              href={`/${locale}/ielts`}
              onClick={() => soundFx.playClick()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-black text-xs transition-all shadow-xl shadow-teal-500/20 hover:scale-105"
            >
              Quay Về IELTS Hub
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
