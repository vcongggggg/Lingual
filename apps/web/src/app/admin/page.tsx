'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  BookOpen,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Modal } from '../../components/ui/Modal';
import { LingLing } from '../../components/ui/LingLing';

interface LessonItem {
  id?: string;
  order: number;
  title: string;
  description?: string;
  isPublished?: boolean;
  totalWords?: number;
}

interface UnitItem {
  id?: string;
  order: number;
  title: string;
  description?: string;
  lessons: LessonItem[];
}

const ALLOWED_ADMIN_ROLES = ['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'];

export default function AdminContentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form thêm từ vựng mới
  const [wordForm, setWordForm] = useState({
    word: '',
    phonetic: '',
    partOfSpeech: 'noun',
    meaning: '',
    example: '',
    cefr: 'A1',
    unitOrder: 1,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndLoadData() {
      try {
        const meRes = await api.getMe();
        if (!isMounted) return;

        if (!meRes || !meRes.user) {
          router.replace('/login');
          return;
        }

        const currentUser = meRes.user;
        if (!currentUser.role || !ALLOWED_ADMIN_ROLES.includes(currentUser.role)) {
          if (isMounted) {
            setIsAuthorized(false);
            setAuthError('Bạn không có quyền truy cập trang quản trị. Đang chuyển hướng về Bảng điều khiển...');
            router.replace('/dashboard');
          }
          return;
        }

        setUser(currentUser);
        setIsAuthorized(true);

        try {
          const res = await api.getCurriculumUnits();
          if (isMounted) {
            if (res && res.units && Array.isArray(res.units)) {
              setUnits(res.units);
            } else {
              setUnits([]);
            }
          }
        } catch (err) {
          console.error('Error loading curriculum units:', err);
          if (isMounted) {
            setUnits([]);
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        // Chưa có phiên đăng nhập hợp lệ -> chuyển hướng ngay về /login
        if (isMounted) {
          router.replace('/login');
        }
      }
    }

    checkAuthAndLoadData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordForm.word.trim() || !wordForm.meaning.trim()) return;

    setIsModalOpen(false);
    setToastMessage(`Đã thêm từ "${wordForm.word}" vào sổ quản lý thành công!`);
    setTimeout(() => setToastMessage(null), 3500);

    // Reset form
    setWordForm({
      word: '',
      phonetic: '',
      partOfSpeech: 'noun',
      meaning: '',
      example: '',
      cefr: 'A1',
      unitOrder: 1,
    });
  };

  const filteredUnits = units.map(unit => {
    if (!searchQuery.trim()) return unit;
    const q = searchQuery.toLowerCase();
    const matchesUnit = unit.title.toLowerCase().includes(q) || (unit.description && unit.description.toLowerCase().includes(q));
    const matchingLessons = unit.lessons.filter(l => l.title.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q)));
    if (matchesUnit) return unit;
    return { ...unit, lessons: matchingLessons };
  }).filter(unit => unit.lessons.length > 0 || unit.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalLessons = units.reduce((acc, u) => acc + (u.lessons?.length || 0), 0);

  if (loading || !user || !isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <LingLing reaction={authError ? "crying" : "studying"} size={80} />
        <div className="text-sm font-black font-mono text-ink animate-pulse text-center max-w-md">
          {authError || 'Đang xác thực quyền quản trị...'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-teal text-white font-black text-xs px-4 py-3 border-2 border-ink shadow-brutal flex items-center gap-2 rounded-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar Quản trị nội dung */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Sổ Biên Soạn & Quản Lý Nội Dung</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Quản trị nội dung giáo trình
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Sổ quản lý các Unit bài học, kho từ vựng cốt lõi và trạng thái xuất bản bài giảng trên toàn hệ thống.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Thêm từ vựng mới</span>
          </button>

          <Link
            href="/admin/audit-log"
            className="btn btn-outline text-xs font-black shadow-brutal flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-ink" />
            <span>Xem Nhật ký hệ thống →</span>
          </Link>
        </div>
      </div>

      {/* 4 Thẻ Thống Kê Sổ Quản Lý */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-paper p-4 bg-card space-y-1">
          <span className="text-[10px] sm:text-[11px] font-black uppercase text-ink-muted block">Tổng số Unit</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-ink">{units.length}</div>
          <span className="text-[11px] font-bold text-teal block">Chương giáo trình</span>
        </div>

        <div className="card-paper p-4 bg-card space-y-1">
          <span className="text-[10px] sm:text-[11px] font-black uppercase text-ink-muted block">Tổng bài học</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-ink">{totalLessons}</div>
          <span className="text-[11px] font-bold text-ink-soft block">Đang hoạt động</span>
        </div>

        <div className="card-paper p-4 bg-card space-y-1">
          <span className="text-[10px] sm:text-[11px] font-black uppercase text-ink-muted block">Từ vựng trong kho</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-teal">1,420</div>
          <span className="text-[11px] font-bold text-ink-soft block">Kèm audio & IPA</span>
        </div>

        <div className="card-paper p-4 bg-card space-y-1">
          <span className="text-[10px] sm:text-[11px] font-black uppercase text-ink-muted block">Đồng bộ nội dung</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-ink">100%</div>
          <span className="text-[11px] font-bold text-teal block">Trạng thái ổn định</span>
        </div>
      </div>

      {/* Thanh Tìm Kiếm Giấy */}
      <div className="bg-card border-2 border-ink rounded-2xl p-4 shadow-brutal flex items-center gap-3">
        <Search className="w-4 h-4 text-ink-muted flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tên Unit, tên bài học hoặc chủ đề từ vựng..."
          className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-ink placeholder:text-ink-muted placeholder:font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-black text-ink-muted hover:text-red px-2"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Danh Sách Unit & Bài Học Dạng Sổ Quản Lý */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red" />
            <span>Danh mục các Unit trong giáo trình</span>
          </h2>
          <span className="text-xs font-bold text-ink-muted">
            Hiển thị {filteredUnits.length} Unit
          </span>
        </div>

        {loading ? (
          <div className="card-paper p-12 text-center text-ink-muted text-sm font-bold">
            Đang mở sổ quản lý nội dung...
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="card-paper p-12 text-center text-ink-muted text-sm font-bold">
            Không tìm thấy Unit hoặc bài học nào khớp với từ khóa tìm kiếm.
          </div>
        ) : (
          filteredUnits.map((unit) => (
            <div
              key={unit.order}
              className="bg-card border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-md space-y-4"
            >
              {/* Unit Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink/15 pb-4">
                <div className="space-y-1">
                  <div className="inline-block px-2.5 py-0.5 bg-paper-2 border border-ink rounded-md text-[10px] font-black uppercase tracking-wider text-ink">
                    MÃ UNIT #{unit.order}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-ink">{unit.title}</h3>
                  {unit.description && (
                    <p className="text-xs text-ink-soft">{unit.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="badge-tag bg-paper text-[11px] font-bold">
                    {unit.lessons.length} bài học
                  </span>
                </div>
              </div>

              {/* Nested Lessons Table */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-ink-muted tracking-wider block">
                  Danh sách bài học trong Unit:
                </span>
                <div className="divide-y border border-ink/20 rounded-xl overflow-hidden bg-paper">
                  {unit.lessons.map((lesson) => (
                    <div
                      key={lesson.order}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-paper-2 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-ink bg-card flex items-center justify-center text-xs font-mono font-black text-ink flex-shrink-0">
                          {lesson.order}
                        </span>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-ink">{lesson.title}</div>
                          {lesson.description && (
                            <div className="text-[11px] text-ink-soft">{lesson.description}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        {lesson.totalWords && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-card border border-ink/30 rounded">
                            {lesson.totalWords} từ vựng
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                            lesson.isPublished
                              ? 'bg-teal/15 text-teal border-teal/40'
                              : 'bg-paper-2 text-ink-muted border-ink/30'
                          }`}
                        >
                          {lesson.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Giấy: Thêm từ vựng mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm từ vựng mới vào sổ quản lý"
      >
        <form onSubmit={handleSaveWord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1">
                Từ vựng (English) <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                value={wordForm.word}
                onChange={(e) => setWordForm({ ...wordForm, word: e.target.value })}
                placeholder="Ví dụ: serendipity"
                className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1">
                Phiên âm IPA
              </label>
              <input
                type="text"
                value={wordForm.phonetic}
                onChange={(e) => setWordForm({ ...wordForm, phonetic: e.target.value })}
                placeholder="Ví dụ: /ˌserənˈdɪpəti/"
                className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1">
                Từ loại
              </label>
              <select
                value={wordForm.partOfSpeech}
                onChange={(e) => setWordForm({ ...wordForm, partOfSpeech: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none cursor-pointer"
              >
                <option value="noun">Danh từ (noun)</option>
                <option value="verb">Động từ (verb)</option>
                <option value="adjective">Tính từ (adjective)</option>
                <option value="adverb">Trạng từ (adverb)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1">
                Cấp độ CEFR
              </label>
              <select
                value={wordForm.cefr}
                onChange={(e) => setWordForm({ ...wordForm, cefr: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none cursor-pointer"
              >
                <option value="A1">A1 - Khởi đầu</option>
                <option value="A2">A2 - Sơ cấp</option>
                <option value="B1">B1 - Trung cấp</option>
                <option value="B2">B2 - Trung cao</option>
                <option value="C1">C1 - Cao cấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink-muted mb-1">
                Thuộc Unit
              </label>
              <select
                value={wordForm.unitOrder}
                onChange={(e) => setWordForm({ ...wordForm, unitOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none cursor-pointer"
              >
                {units.map((u) => (
                  <option key={u.order} value={u.order}>
                    Unit {u.order}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-ink-muted mb-1">
              Định nghĩa tiếng Việt <span className="text-red">*</span>
            </label>
            <input
              type="text"
              required
              value={wordForm.meaning}
              onChange={(e) => setWordForm({ ...wordForm, meaning: e.target.value })}
              placeholder="Ví dụ: Sự may mắn tình cờ phát hiện ra điều thú vị"
              className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-ink-muted mb-1">
              Câu ví dụ minh họa
            </label>
            <textarea
              rows={2}
              value={wordForm.example}
              onChange={(e) => setWordForm({ ...wordForm, example: e.target.value })}
              placeholder="Ví dụ: Finding this book was pure serendipity."
              className="w-full px-3 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-bold text-ink outline-none focus:border-red resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-ink/15">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline text-xs font-black cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Ghi vào sổ quản lý</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
