'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  ArrowLeft,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  FileText,
  Clock,
  Shuffle,
  HelpCircle,
  X,
  ExternalLink,
  Tag,
  ListOrdered,
  Settings2,
} from 'lucide-react';
import { api, StudyTemplateItem } from '../../lib/api';

// Categorize 30 templates into intuitive study domains
const CATEGORIES: { id: string; label: string; types: string[] }[] = [
  { id: 'all', label: 'Tất Cả 30 Mẫu', types: [] },
  {
    id: 'vocab',
    label: 'Từ Vựng & Trí Nhớ',
    types: ['flashcard', 'multiple_choice', 'fill_blank', 'matching', 'word_family', 'collocation', 'memory_match', 'timed_recall', 'leitner_review'],
  },
  {
    id: 'sentence',
    label: 'Ngữ Pháp & Cấu Trúc',
    types: ['sentence_build', 'cloze_paragraph', 'synonym_ladder', 'antonym_pair', 'error_correction', 'dialogue_use', 'essay_use'],
  },
  {
    id: 'audio',
    label: 'Nghe & Phát Âm',
    types: ['dictation', 'pronunciation_drill', 'listening_choice', 'shadowing'],
  },
  {
    id: 'interactive',
    label: 'Trò Chơi & Tương Tác',
    types: ['odd_one_out', 'categorize', 'timed_sprint', 'crossword', 'hangman', 'word_snake', 'picture_word', 'peer_quiz', 'translation_drill'],
  },
];

export default function StudyTemplatesPage() {
  const [templates, setTemplates] = useState<StudyTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<StudyTemplateItem | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getStudyTemplates({ limit: 50 });
        if (res.success && Array.isArray(res.data)) {
          setTemplates(res.data);
          if (res.data.length > 0) {
            setActiveTemplate((curr) => curr ?? res.data[0]);
          }
        } else {
          setError('Không thể tải danh sách khung mẫu từ máy chủ.');
        }
      } catch (err: any) {
        console.error('Failed to load study templates:', err);
        setError(err.message || 'Lỗi kết nối khi tải khung mẫu học tập.');
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Category match
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find((c) => c.id === selectedCategory);
        if (cat && !cat.types.includes(tpl.type)) {
          return false;
        }
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitleVi = tpl.titleVi.toLowerCase().includes(q);
        const inTitleEn = tpl.titleEn.toLowerCase().includes(q);
        const inDesc = tpl.descriptionVi.toLowerCase().includes(q);
        const inType = tpl.type.toLowerCase().includes(q);
        return inTitleVi || inTitleEn || inDesc || inType;
      }
      return true;
    });
  }, [templates, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-red/20 selection:text-ink">
      {/* Top Paper Header Strip */}
      <header className="border-b-2 border-ink bg-card shadow-brutal-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-paper border-2 border-ink rounded hover:bg-paper-2 transition-all shadow-brutal-sm"
            >
              <ArrowLeft className="w-4 h-4 text-ink" />
              <span>Bàn Học</span>
            </Link>
            <div className="h-5 w-[2px] bg-ink/20" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>SỔ TAY KHUNG MẪU HỌC TẬP</span>
                <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 bg-red text-white rounded-full border border-ink">
                  30 Khung Mẫu Chuẩn
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-soft text-ink border-2 border-ink rounded hover:bg-amber transition-all shadow-brutal-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-red" />
              <span>Luyện Tập Ngay</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Notebook Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Notebook Cover Banner */}
        <div className="relative mb-8 bg-card border-2 border-ink rounded-lg p-6 sm:p-8 shadow-brutal overflow-hidden">
          {/* Subtle notebook binder line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red via-ink to-red" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase bg-paper border border-ink rounded text-red">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kho Nguyên Mẫu Hoạt Động Ngôn Ngữ • Wave 3</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-2">
                Hệ Thống 30 Khung Mẫu Sư Phạm (Study Templates)
              </h2>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                Được chuẩn hóa với cấu trúc trường chặt chẽ (<span className="text-red font-semibold">fields</span>), 
                quy trình sư phạm từng bước (<span className="text-red font-semibold">steps</span>) và thiết lập tham số linh hoạt (<span className="text-red font-semibold">config</span>).
              </p>
            </div>

            {/* Exactly 1 Mascot on the page */}
            <div className="flex items-center gap-4 bg-paper/80 border-2 border-ink/80 rounded-lg p-3 shadow-brutal-sm shrink-0">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <Image
                  src="/mascot/cow_gen_studying.png"
                  alt="LinguaFlow Mascot Chăm Học"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-xs">
                <div className="font-black text-ink uppercase tracking-wider">LingLing Scholar</div>
                <div className="text-ink-muted mt-0.5">Sổ tay phương pháp</div>
                <div className="inline-block mt-1 px-1.5 py-0.5 bg-teal/10 text-teal-dark font-bold rounded text-[11px] border border-teal/30">
                  30/30 Đã Xác Thực
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Strip */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-bold tracking-wide rounded border-2 transition-all shrink-0 ${
                    active
                      ? 'bg-red text-white border-ink shadow-brutal-sm'
                      : 'bg-card text-ink border-ink hover:bg-paper-2 shadow-brutal-sm'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Tìm theo tên mẫu, loại, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs font-medium bg-card border-2 border-ink rounded shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-red"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Layout: Template Grid + Detailed Drawer */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-card border-2 border-ink/30 rounded-lg p-5 shadow-brutal-sm animate-pulse space-y-3">
                <div className="h-4 bg-paper-2 rounded w-1/3" />
                <div className="h-6 bg-paper-2 rounded w-3/4" />
                <div className="h-12 bg-paper-2 rounded w-full" />
                <div className="h-8 bg-paper-2 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-card border-2 border-red rounded-lg p-8 text-center shadow-brutal">
            <div className="w-12 h-12 rounded-full bg-red/10 border-2 border-red text-red flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              !
            </div>
            <h3 className="text-lg font-bold text-ink mb-1">Không thể tải khung mẫu</h3>
            <p className="text-sm text-ink-soft mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red text-white font-bold text-xs uppercase tracking-wider rounded border-2 border-ink shadow-brutal-sm hover:bg-red-dark transition-all"
            >
              Thử Lại
            </button>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-card border-2 border-ink rounded-lg p-8 text-center shadow-brutal">
            <p className="text-sm font-bold text-ink mb-2">Không tìm thấy khung mẫu nào phù hợp với bộ lọc.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 text-xs font-bold bg-paper border border-ink rounded hover:bg-paper-2"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Template Cards Grid */}
            <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTemplates.map((tpl, index) => {
                const isSelected = activeTemplate?.id === tpl.id;
                const fieldsCount = Array.isArray(tpl.structure?.fields) ? tpl.structure.fields.length : 0;
                const stepsCount = Array.isArray(tpl.structure?.steps) ? tpl.structure.steps.length : 0;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setActiveTemplate(tpl)}
                    className={`cursor-pointer bg-card border-2 rounded-lg p-4 transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-red shadow-brutal-lg ring-2 ring-red/30 -translate-y-0.5'
                        : 'border-ink hover:border-ink/80 hover:bg-card/90 shadow-brutal'
                    }`}
                  >
                    {/* Top Row: Template ID & Type Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-paper border border-ink/40 rounded text-ink-soft">
                          {tpl.id}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-soft text-ink border border-ink rounded">
                          {tpl.type}
                        </span>
                      </div>

                      {/* Titles */}
                      <h3 className="text-base font-black text-ink tracking-tight mb-0.5 flex items-center justify-between">
                        <span>{tpl.titleVi}</span>
                        {isSelected && <span className="text-xs text-red font-bold">● Đang xem</span>}
                      </h3>
                      <h4 className="text-xs font-semibold text-ink-muted italic mb-2">
                        {tpl.titleEn}
                      </h4>

                      {/* Description Snippet */}
                      <p className="text-xs text-ink-soft leading-relaxed line-clamp-2 mb-3">
                        {tpl.descriptionVi}
                      </p>
                    </div>

                    {/* Bottom Metadata Badges */}
                    <div className="pt-2.5 border-t border-ink/10 flex items-center justify-between text-[11px] text-ink-muted font-medium">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-red" />
                          <span>{fieldsCount} trường</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <ListOrdered className="w-3 h-3 text-teal" />
                          <span>{stepsCount} bước</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-red hover:underline">
                        Chi tiết →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Notebook Page View */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
              {activeTemplate ? (
                <div className="bg-card border-2 border-ink rounded-lg shadow-brutal p-5 sm:p-6 relative">
                  {/* Stamp mark on top-right */}
                  <div className="absolute top-4 right-4 rotate-12 pointer-events-none opacity-85">
                    <div className="border-2 border-dashed border-red text-red text-[10px] font-black px-2 py-0.5 uppercase tracking-widest rounded">
                      LINGUAFLOW • {activeTemplate.id}
                    </div>
                  </div>

                  {/* Header of Detail */}
                  <div className="mb-4 pr-16">
                    <div className="text-[11px] font-bold text-red uppercase tracking-wider mb-1">
                      Chi Tiết Mẫu Sổ Tay
                    </div>
                    <h3 className="text-xl font-black text-ink tracking-tight">
                      {activeTemplate.titleVi}
                    </h3>
                    <div className="text-xs text-ink-soft italic font-medium">
                      {activeTemplate.titleEn} • <span className="font-mono text-ink">{activeTemplate.type}</span>
                    </div>
                  </div>

                  {/* Pedagogical Description */}
                  <div className="bg-paper border border-ink/30 rounded p-3 text-xs text-ink leading-relaxed mb-4">
                    <div className="font-bold text-ink mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-red" />
                      <span>Ý Nghĩa & Mục Tiêu Sư Phạm:</span>
                    </div>
                    {activeTemplate.descriptionVi}
                  </div>

                  {/* 1. Fields Structure */}
                  <div className="mb-4">
                    <h4 className="text-xs font-black text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-red" />
                      <span>1. Cấu Trúc Trường Dữ Liệu ({activeTemplate.structure?.fields?.length || 0})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(activeTemplate.structure?.fields) && activeTemplate.structure.fields.length > 0 ? (
                        activeTemplate.structure.fields.map((field: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold bg-paper-2 border border-ink/40 rounded text-ink"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red" />
                            {field}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-ink-muted italic">Không có trường khai báo</span>
                      )}
                    </div>
                  </div>

                  {/* 2. Step-by-step Flow */}
                  <div className="mb-4">
                    <h4 className="text-xs font-black text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ListOrdered className="w-3.5 h-3.5 text-teal" />
                      <span>2. Quy Trình Thực Hành ({activeTemplate.structure?.steps?.length || 0} Bước)</span>
                    </h4>
                    <div className="space-y-1.5">
                      {Array.isArray(activeTemplate.structure?.steps) && activeTemplate.structure.steps.length > 0 ? (
                        activeTemplate.structure.steps.map((step: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs bg-paper/60 border border-ink/20 rounded p-2 text-ink"
                          >
                            <span className="w-4 h-4 rounded-full bg-ink text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{step}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-ink-muted italic">Không có bước quy trình</span>
                      )}
                    </div>
                  </div>

                  {/* 3. Config Parameters */}
                  {activeTemplate.structure?.config && Object.keys(activeTemplate.structure.config).length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-black text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-ink" />
                        <span>3. Tham Số Cấu Hình (Config)</span>
                      </h4>
                      <div className="bg-paper-2/60 border border-ink/30 rounded p-2.5 space-y-1.5 text-xs">
                        {Object.entries(activeTemplate.structure.config).map(([cfgKey, cfgVal], idx) => (
                          <div key={idx} className="flex items-center justify-between font-mono">
                            <span className="text-ink-soft">{cfgKey}:</span>
                            <span className="font-bold text-ink px-1.5 py-0.5 bg-paper rounded border border-ink/20">
                              {typeof cfgVal === 'boolean' ? (cfgVal ? 'TRUE' : 'FALSE') : String(cfgVal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Source and Timestamp footer */}
                  <div className="pt-3 border-t border-ink/10 flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Nguồn: <strong className="text-ink font-semibold">{activeTemplate.source}</strong></span>
                    <span>Cập nhật: {new Date(activeTemplate.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-card border-2 border-dashed border-ink/40 rounded-lg p-8 text-center text-ink-muted text-xs">
                  Chọn một khung mẫu bên trái để xem trang sổ tay chi tiết.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
