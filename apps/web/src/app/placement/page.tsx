'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../lib/api';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Award,
  Layers,
  Home,
} from 'lucide-react';

interface QuestionItem {
  id: string;
  section: 'grammar' | 'vocab' | 'reading';
  cefrLevel: string;
  question: string;
  options: string[];
  passage?: string;
  passageTitle?: string;
  topic?: string;
}

interface PlacementResult {
  attemptId: string;
  level: string;
  bandEstimate: string;
  sectionScores: {
    grammar: { correct: number; total: number };
    vocab: { correct: number; total: number };
    reading: { correct: number; total: number };
    total: { correct: number; total: number; percentage: number };
  };
  weakTopics: string[];
  disclaimer: string;
}

type TestState = 'welcome' | 'testing' | 'submitting' | 'result';

export default function PlacementPage() {
  const [state, setState] = useState<TestState>('welcome');
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch previous attempt on load
  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await api.getPlacementLatest();
        if (res && res.attempt) {
          setLatestAttempt(res.attempt);
        }
      } catch (err) {
        // Unauthenticated or first time
      }
    }
    loadLatest();
  }, []);

  // Start test
  const handleStartTest = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getPlacementQuestions();
      if (res && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setCurrentIndex(0);
        setAnswers({});
        setSelectedOption(null);
        setState('testing');
      } else {
        setErrorMsg('Không thể tải bộ câu hỏi. Vui lòng thử lại sau.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lỗi kết nối máy chủ khi tạo đề thi.');
    } finally {
      setLoading(false);
    }
  };

  // Select an option and advance
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = async () => {
    if (!selectedOption) return;

    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Last question completed -> submit test
      await handleSubmitTest(newAnswers);
    }
  };

  const handleSubmitTest = async (finalAnswers: Record<string, string>) => {
    setState('submitting');
    try {
      const qIds = questions.map((q) => q.id);
      const res = await api.submitPlacementTest({
        answers: finalAnswers,
        questionIds: qIds,
      });
      setResult(res);
      setState('result');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lỗi khi nộp bài. Vui lòng kiểm tra lại kết nối.');
      setState('testing');
    }
  };

  const currentQ = questions[currentIndex];

  // Helper labels
  const getSectionLabel = (sec: string) => {
    switch (sec) {
      case 'grammar':
        return 'Ngữ pháp';
      case 'vocab':
        return 'Từ vựng & Cụm từ';
      case 'reading':
        return 'Đọc hiểu';
      default:
        return 'Tổng hợp';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif",
        color: '#2D3748',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Top Header / Notebook Spine */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #E2DED6',
            paddingBottom: '16px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #CBD5E1',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1E293B' }}>
                Sổ Tay Đánh Giá Trình Độ (Placement Test)
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '2px 0 0' }}>
                LinguaFlow Diagnostic • Phiên bản P0
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: '#475569',
              textDecoration: 'none',
              padding: '6px 12px',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Home size={16} />
            Về bàn học
          </Link>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
            }}
          >
            <AlertCircle size={18} />
            {errorMsg}
          </div>
        )}

        {/* ---------------- STATE 1: WELCOME SCREEN ---------------- */}
        {state === 'welcome' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2DED6',
              borderRadius: '12px',
              padding: '36px 32px',
              boxShadow: '3px 3px 0px #E2DED6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 340px' }}>
                <span
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid #BFDBFE',
                  }}
                >
                  Kiểm tra đầu vào tự động
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '14px 0 10px', color: '#0F172A' }}>
                  Xác định trình độ tiếng Anh chuẩn CEFR & Ước tính IELTS
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                  Bài kiểm tra được thiết kế theo thang bậc từ dễ đến khó (A1 → B2), rút ngẫu nhiên từ kho dữ liệu
                  chính thức để phản ánh chính xác điểm mạnh và chủ điểm ngữ pháp cần rèn luyện.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  <div
                    style={{
                      border: '1px solid #E2DED6',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#FDFBF7',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3B82F6' }}>
                      <Layers size={18} />
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>25 câu</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                      12 Ngữ pháp • 8 Từ vựng • 5 Đọc
                    </div>
                  </div>

                  <div
                    style={{
                      border: '1px solid #E2DED6',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#FDFBF7',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
                      <Clock size={18} />
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>~15 phút</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                      Không bấm giờ từng câu
                    </div>
                  </div>

                  <div
                    style={{
                      border: '1px solid #E2DED6',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#FDFBF7',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                      <Award size={18} />
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>A1 → B2</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                      Kèm Band IELTS tương đương
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.825rem',
                    color: '#92400E',
                    marginBottom: '24px',
                    lineHeight: 1.5,
                  }}
                >
                  <b>Lưu ý khi làm bài:</b> Bạn sẽ làm 1 câu/màn hình và không được quay lại sửa câu đã chọn. Hãy chọn đáp án theo trực giác tự nhiên nhất!
                </div>

                <button
                  id="btn-start-placement"
                  onClick={handleStartTest}
                  disabled={loading}
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    border: '2px solid #0F172A',
                    borderRadius: '8px',
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '3px 3px 0px #94A3B8',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {loading ? 'Đang soạn đề thi...' : 'Bắt đầu làm bài'}
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Mascot Widget */}
              <div
                style={{
                  flex: '0 0 160px',
                  textAlign: 'center',
                  padding: '16px',
                  border: '2px dashed #E2DED6',
                  borderRadius: '12px',
                  backgroundColor: '#FAF8F5',
                }}
              >
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                  <Image
                    src="/mascot/raw/mascot_sticker_clean_01.png"
                    alt="LingLing Mascot"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginTop: '8px' }}>
                  LingLing
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Cùng bạn thử sức nhé!
                </div>
              </div>
            </div>

            {/* Previous attempt indicator if exists */}
            {latestAttempt && (
              <div
                style={{
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px dashed #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Kết quả làm bài gần nhất ({new Date(latestAttempt.takenAt).toLocaleDateString('vi-VN')}):
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                      }}
                    >
                      {latestAttempt.level}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>
                      Band ước lượng: {latestAttempt.bandEstimate}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- STATE 2: TESTING SESSION (1 Question / Screen) ---------------- */}
        {state === 'testing' && currentQ && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2DED6',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '3px 3px 0px #E2DED6',
            }}
          >
            {/* Header: Progress & Section badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #E2DED6',
                paddingBottom: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#334155',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    border: '1px solid #CBD5E1',
                  }}
                >
                  Câu {currentIndex + 1} / {questions.length}
                </span>
                <span
                  style={{
                    backgroundColor:
                      currentQ.section === 'grammar'
                        ? '#EFF6FF'
                        : currentQ.section === 'vocab'
                        ? '#FEF3C7'
                        : '#ECFDF5',
                    color:
                      currentQ.section === 'grammar'
                        ? '#1D4ED8'
                        : currentQ.section === 'vocab'
                        ? '#92400E'
                        : '#065F46',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Phần: {getSectionLabel(currentQ.section)}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '140px', backgroundColor: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    backgroundColor: '#3B82F6',
                    height: '100%',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* Mini Reading Passage (if applicable) */}
            {currentQ.section === 'reading' && currentQ.passage && (
              <div
                style={{
                  backgroundColor: '#FDFCF7',
                  border: '1px solid #E2DED6',
                  borderLeft: '4px solid #10B981',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '20px',
                  fontSize: '0.925rem',
                  lineHeight: 1.65,
                  color: '#334155',
                }}
              >
                {currentQ.passageTitle && (
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px', fontSize: '0.95rem' }}>
                    📖 {currentQ.passageTitle}
                  </div>
                )}
                {currentQ.passage}
              </div>
            )}

            {/* Question Stem */}
            <div style={{ margin: '16px 0 24px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.5 }}>
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '28px' }}>
              {currentQ.options.map((opt, idx) => {
                const optLetter = String.fromCharCode(65 + idx);
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={`${currentQ.id}-opt-${idx}`}
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      textAlign: 'left',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      color: isSelected ? '#1E3A8A' : '#1E293B',
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '2px 2px 0px #BFDBFE' : '1px 1px 0px #E2E8F0',
                    }}
                  >
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#2563EB' : '#E2E8F0',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      {optLetter}
                    </span>
                    <span style={{ flexGrow: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #E2DED6',
                paddingTop: '16px',
              }}
            >
              <div style={{ fontSize: '0.825rem', color: '#64748B' }}>
                * Câu hỏi không cho phép quay lại sửa sau khi xác nhận.
              </div>
              <button
                id="btn-next-question"
                onClick={handleNextQuestion}
                disabled={!selectedOption}
                style={{
                  backgroundColor: selectedOption ? '#1E293B' : '#CBD5E1',
                  color: '#FFFFFF',
                  border: '1.5px solid #0F172A',
                  borderRadius: '6px',
                  padding: '10px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: selectedOption ? 'pointer' : 'not-allowed',
                  boxShadow: selectedOption ? '2px 2px 0px #94A3B8' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {currentIndex + 1 === questions.length ? 'Nộp bài kiểm tra' : 'Tiếp theo'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STATE 3: SUBMITTING / GRADING ---------------- */}
        {state === 'submitting' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2DED6',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center',
              boxShadow: '3px 3px 0px #E2DED6',
            }}
          >
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
              <Image
                src="/mascot/raw/mascot_sticker_clean_05.png"
                alt="LingLing Grading"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Hệ thống đang chấm điểm bài làm của bạn...
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
              Đang phân tích độ chính xác theo nấc thang CEFR và tổng hợp chủ điểm ngữ pháp cần củng cố.
            </p>
          </div>
        )}

        {/* ---------------- STATE 4: RESULT SCREEN (P0 Scope) ---------------- */}
        {state === 'result' && result && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2DED6',
              borderRadius: '12px',
              padding: '36px 32px',
              boxShadow: '3px 3px 0px #E2DED6',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: '1px solid #A7F3D0',
                  marginBottom: '12px',
                }}
              >
                <CheckCircle2 size={16} />
                Hoàn thành bài kiểm tra đầu vào
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Kết Quả Đánh Giá Năng Lực
              </h2>
            </div>

            {/* Score Badges Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  border: '2px solid #3B82F6',
                  borderRadius: '10px',
                  padding: '18px',
                  backgroundColor: '#EFF6FF',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase' }}>
                  Trình độ CEFR xác định
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1E3A8A', margin: '6px 0' }}>
                  {result.level}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Đạt chuẩn ngưỡng năng lực hệ thống
                </div>
              </div>

              <div
                style={{
                  border: '2px solid #D97706',
                  borderRadius: '10px',
                  padding: '18px',
                  backgroundColor: '#FFFBEB',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                  IELTS Band ước tính
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#92400E', margin: '8px 0' }}>
                  Band {result.bandEstimate}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350F' }}>
                  Dựa trên tương quan thang chuẩn
                </div>
              </div>

              <div
                style={{
                  border: '2px solid #10B981',
                  borderRadius: '10px',
                  padding: '18px',
                  backgroundColor: '#ECFDF5',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                  Tổng câu trả lời đúng
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#065F46', margin: '8px 0' }}>
                  {result.sectionScores.total.correct} / {result.sectionScores.total.total}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#064E3B' }}>
                  Độ chính xác: {result.sectionScores.total.percentage}%
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px 20px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
                Chi tiết điểm từng kỹ năng:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Ngữ pháp</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                    {result.sectionScores.grammar.correct} / {result.sectionScores.grammar.total}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Từ vựng & Cụm</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                    {result.sectionScores.vocab.correct} / {result.sectionScores.vocab.total}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Đọc hiểu</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                    {result.sectionScores.reading.correct} / {result.sectionScores.reading.total}
                  </div>
                </div>
              </div>
            </div>

            {/* Weak Topics to Focus On */}
            {result.weakTopics && result.weakTopics.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFF7ED',
                  border: '1px solid #FED7AA',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#C2410C', marginBottom: '8px' }}>
                  🎯 3 Chủ điểm ngữ pháp khuyên học bổ trợ:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#9A3412', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {result.weakTopics.map((top, idx) => (
                    <li key={`weak-${idx}`}>
                      <b>{top}</b>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* MANDATORY DISCLAIMER 1 DÒNG NGUYÊN VĂN THEO SPEC */}
            <div
              style={{
                borderTop: '1px solid #E2DED6',
                paddingTop: '16px',
                marginBottom: '28px',
                textAlign: 'center',
              }}
            >
              <p
                id="placement-disclaimer"
                style={{
                  fontSize: '0.825rem',
                  color: '#64748B',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {result.disclaimer}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleStartTest}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RotateCcw size={16} />
                Làm lại bài kiểm tra
              </button>
              <Link
                href="/roadmap"
                style={{
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  border: '1.5px solid #0F172A',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '2px 2px 0px #94A3B8',
                }}
              >
                Xem lộ trình cá nhân hóa
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
