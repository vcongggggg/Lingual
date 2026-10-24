'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Search,
  Compass,
} from 'lucide-react';
import { api } from '../../lib/api';

interface ExampleItem {
  en: string;
  vi: string;
}

interface CommonMistakeItem {
  wrong: string;
  correct: string;
  explainVi: string;
}

interface GrammarExplanationItem {
  id: string;
  topic: string;
  topicVi: string | null;
  cefrLevel: string;
  ruleVi: string;
  ruleEn: string | null;
  examples: ExampleItem[];
  commonMistakes: CommonMistakeItem[];
}

function GrammarContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';

  const [topics, setTopics] = useState<GrammarExplanationItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<GrammarExplanationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExplanations() {
      setLoading(true);
      try {
        const res = await api.getGrammarExplanations({ limit: 100 });
        if (res && res.items) {
          setTopics(res.items);
          if (initialTopic) {
            const match = res.items.find(
              (item) => item.topic.toLowerCase() === initialTopic.toLowerCase()
            );
            if (match) {
              setSelectedTopic(match);
            } else if (res.items.length > 0) {
              setSelectedTopic(res.items[0]);
            }
          } else if (res.items.length > 0) {
            setSelectedTopic(res.items[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load grammar explanations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExplanations();
  }, [initialTopic]);

  const filteredTopics = topics.filter(
    (t) =>
      t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.topicVi && t.topicVi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Header */}
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
                backgroundColor: '#D97706',
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
                Thư Viện Lý Thuyết Ngữ Pháp
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '2px 0 0' }}>
                50 Chủ Điểm Ngữ Pháp Tiêu Chuẩn CEFR • Sổ tay bổ trợ sau Placement Test
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/placement"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: '#475569',
                textDecoration: 'none',
                padding: '6px 12px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <ArrowLeft size={16} />
              Về Placement
            </Link>
            <Link
              href="/roadmap"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: '#1E293B',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '6px 12px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Compass size={16} />
              Lộ trình
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            Đang tải dữ liệu lý thuyết ngữ pháp...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            {/* Sidebar: 50 Topics List */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E2DED6',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '3px 3px 0px #E2DED6',
                height: 'fit-content',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredTopics.map((item) => {
                  const isSelected = selectedTopic?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedTopic(item)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: isSelected ? '1.5px solid #D97706' : '1px solid transparent',
                        backgroundColor: isSelected ? '#FEF3C7' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#92400E' : '#1E293B' }}>
                          {item.topic}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? '#FDE68A' : '#E2E8F0',
                            color: isSelected ? '#78350F' : '#475569',
                          }}
                        >
                          {item.cefrLevel}
                        </span>
                      </div>
                      {item.topicVi && (
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                          {item.topicVi}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content: Explanation Details */}
            {selectedTopic && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E2DED6',
                  borderRadius: '12px',
                  padding: '32px',
                  boxShadow: '3px 3px 0px #E2DED6',
                }}
              >
                {/* Topic Header */}
                <div style={{ borderBottom: '1px solid #E2DED6', paddingBottom: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        border: '1px solid #FDE68A',
                      }}
                    >
                      CEFR {selectedTopic.cefrLevel}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      Mã chủ đề: {selectedTopic.id}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                    {selectedTopic.topic}
                  </h2>
                  {selectedTopic.topicVi && (
                    <div style={{ fontSize: '1.05rem', color: '#475569', fontWeight: 600 }}>
                      {selectedTopic.topicVi}
                    </div>
                  )}
                </div>

                {/* Rule Section */}
                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1.5px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '18px 20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>
                    <Lightbulb size={20} />
                    Quy tắc ngữ pháp cốt lõi:
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#78350F' }}>
                    {selectedTopic.ruleVi}
                  </p>
                </div>

                {/* Examples Section */}
                {selectedTopic.examples && selectedTopic.examples.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={18} color="#059669" />
                      Ví dụ minh họa song ngữ:
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedTopic.examples.map((ex, idx) => (
                        <div
                          key={`ex-${idx}`}
                          style={{
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.95rem' }}>
                            {ex.en}
                          </div>
                          <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '2px' }}>
                            {ex.vi}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Mistakes Section */}
                {selectedTopic.commonMistakes && selectedTopic.commonMistakes.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991B1B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={18} color="#DC2626" />
                      Lỗi sai thường gặp & cách khắc phục:
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedTopic.commonMistakes.map((m, idx) => (
                        <div
                          key={`m-${idx}`}
                          style={{
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            borderRadius: '8px',
                            padding: '14px 16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: 600, fontSize: '0.9rem' }}>
                            <XCircle size={16} /> Sai: <del>{m.wrong}</del>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                            <CheckCircle2 size={16} /> Đúng: {m.correct}
                          </div>
                          {m.explainVi && (
                            <div style={{ fontSize: '0.825rem', color: '#7F1D1D', marginTop: '6px', fontStyle: 'italic' }}>
                              💡 Giải thích: {m.explainVi}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Navigation */}
                <div style={{ borderTop: '1px solid #E2DED6', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    href="/placement"
                    style={{
                      color: '#475569',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    ← Trở lại bảng kết quả Placement
                  </Link>

                  <Link
                    href="/roadmap"
                    style={{
                      backgroundColor: '#1E293B',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Tiếp tục lộ trình cá nhân hóa
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GrammarPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Đang tải thư viện lý thuyết ngữ pháp...</div>}>
      <GrammarContent />
    </Suspense>
  );
}
