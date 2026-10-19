'use client';

import React, { useState } from 'react';
import { Volume2, BookOpen, Bookmark, Check, Plus, Layers, Sparkles, Pin } from 'lucide-react';

export interface CollocationItem {
  phrase: string;
  translation: string;
  example?: string;
}

export interface SynonymItem {
  word: string;
  translation: string;
  nuance: string;
}

export interface LibraryWordData {
  id: string;
  targetText: string;
  phonetic?: string;
  partOfSpeech?: string;
  cefrLevel?: string;
  translation: string;
  callNumber?: string;
  catalogDate?: string;
  collocations?: CollocationItem[];
  synonyms?: SynonymItem[];
  exampleSentence?: string;
  exampleTranslation?: string;
  learnedSource?: {
    lessonTitle: string;
    unitTitle: string;
    stage?: string;
  };
  audioUsUrl?: string;
  audioUkUrl?: string;
}

export interface LibraryCatalogCardProps {
  word: LibraryWordData;
  onAddToDeck?: (word: LibraryWordData) => void;
  isAdded?: boolean;
  className?: string;
}

export function LibraryCatalogCard({
  word,
  onAddToDeck,
  isAdded = false,
  className = '',
}: LibraryCatalogCardProps) {
  const [activeTab, setActiveTab] = useState<'definition' | 'collocations' | 'synonyms' | 'examples'>('definition');

  const playAudio = (text: string, accent: 'US' | 'UK') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const callNumber = word.callNumber || `LIB-820.1/${(word.targetText || 'VOC').toUpperCase().slice(0, 6)}`;
  const catalogDate = word.catalogDate || '18/10/2026';

  // Fallback enriched data if not present
  const collocations: CollocationItem[] = word.collocations && word.collocations.length > 0
    ? word.collocations
    : [
        {
          phrase: `demonstrate ${word.targetText.toLowerCase()}`,
          translation: `thể hiện sự ${word.translation.toLowerCase().split(',')[0]}`,
          example: `They demonstrated outstanding ${word.targetText.toLowerCase()} under severe pressure.`,
        },
        {
          phrase: `remarkable ${word.targetText.toLowerCase()}`,
          translation: `sự ${word.translation.toLowerCase().split(',')[0]} đáng kinh ngạc`,
          example: `Her remarkable ${word.targetText.toLowerCase()} inspired the whole class.`,
        },
      ];

  const synonyms: SynonymItem[] = word.synonyms && word.synonyms.length > 0
    ? word.synonyms
    : [
        {
          word: 'Grit',
          translation: 'Sự kiên cường, bền bỉ đến cùng',
          nuance: 'Dùng nhiều trong tâm lý học và nói về tính cách vượt khó lâu dài.',
        },
        {
          word: 'Tenacity',
          translation: 'Sự ngoan cường, bám đuổi mục tiêu',
          nuance: 'Mang sắc thái quyết không buông bỏ mục tiêu dù có cản trở.',
        },
      ];

  const learnedSource = word.learnedSource || {
    lessonTitle: 'Bài 1: Chào hỏi & Giới thiệu bản thân',
    unitTitle: 'Unit 1: Khởi đầu Giao tiếp',
    stage: 'Chặng 1',
  };

  return (
    <div
      className={`relative bg-[#FAF5EB] border-2 border-ink rounded-2xl shadow-brutal-lg overflow-hidden flex flex-col justify-between select-none ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle, #211A13 0.6px, transparent 0.6px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Thẻ phụ thư viện: Header Thư Viện Cổ Điển */}
      <div className="bg-[#F0E6D2] border-b-2 border-ink px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red border border-ink" />
          <span className="text-[11px] font-mono font-black text-ink tracking-wider uppercase">
            PHIẾU MỤC LỤC THƯ VIỆN
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-ink/40 bg-paper text-ink-muted">
            {callNumber}
          </span>
        </div>

        {/* Nút Audio US / UK dùng chung toàn phiếu */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-ink-soft hidden sm:inline-block">
            Âm chuẩn toàn phiếu:
          </span>
          <button
            onClick={() => playAudio(word.targetText, 'US')}
            className="px-2.5 py-1 rounded-lg border-2 border-ink bg-card hover:bg-amber text-[11px] font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 transition-transform active:translate-y-0.5 cursor-pointer"
            title="Phát âm tiếng Anh - Mỹ (US)"
          >
            <Volume2 className="w-3.5 h-3.5 text-red" />
            <span>US</span>
          </button>
          <button
            onClick={() => playAudio(word.targetText, 'UK')}
            className="px-2.5 py-1 rounded-lg border-2 border-ink bg-card hover:bg-teal/20 text-[11px] font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 transition-transform active:translate-y-0.5 cursor-pointer"
            title="Phát âm tiếng Anh - Anh (UK)"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal" />
            <span>UK</span>
          </button>
        </div>
      </div>

      {/* Thông tin chính của mục từ */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b-2 border-ink/15 pb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-3xl font-black text-ink font-serif tracking-tight">
                {word.targetText}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded border border-ink bg-paper text-ink">
                  {word.partOfSpeech || 'noun'}
                </span>
                {word.cefrLevel && (
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded border border-teal bg-teal/10 text-teal">
                    Bậc {word.cefrLevel}
                  </span>
                )}
              </div>
            </div>
            {word.phonetic && (
              <span className="text-sm font-mono font-bold text-red block mt-1">
                {word.phonetic}
              </span>
            )}
          </div>

          {/* Huy hiệu kho thẻ thư viện */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-mono px-2 py-1 rounded border border-ink/30 bg-paper-2 text-ink-soft">
              Ngày lập: {catalogDate}
            </span>
          </div>
        </div>

        {/* Hệ thống 4 Tab Sổ Tay Phiếu Thư Viện */}
        <div className="flex items-center gap-1.5 border-b-2 border-ink pt-1 overflow-x-auto pb-0">
          {[
            { id: 'definition', label: '1. Định nghĩa', icon: BookOpen },
            { id: 'collocations', label: '2. Cụm từ đi kèm', icon: Layers },
            { id: 'synonyms', label: '3. Từ đồng nghĩa', icon: Sparkles },
            { id: 'examples', label: '4. Ví dụ bài học', icon: Pin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-black font-sans transition-all flex items-center gap-1.5 rounded-t-lg border-t-2 border-l-2 border-r-2 border-ink -mb-[2px] cursor-pointer ${
                  isActive
                    ? 'bg-paper text-red shadow-[0_-2px_0_#211A13]'
                    : 'bg-[#EFE5D0] text-ink-muted hover:text-ink hover:bg-paper/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Nội dung Tab */}
        <div className="min-h-[140px] p-4 bg-paper border-2 border-ink rounded-b-xl rounded-tr-xl shadow-brutal-sm space-y-3">
          {/* TAB 1: ĐỊNH NGHĨA */}
          {activeTab === 'definition' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted">
                  Giải nghĩa chuẩn xác:
                </span>
                <span className="text-[10px] font-mono text-teal font-bold">
                  Bản dịch chuẩn ngữ nghĩa
                </span>
              </div>
              <p className="text-base font-bold text-ink leading-relaxed font-sans">
                {word.translation}
              </p>
              <div className="p-2.5 rounded-lg bg-paper-2 border border-ink/20 text-xs text-ink-soft space-y-1">
                <span className="font-black text-ink block">Lưu ý sử dụng từ:</span>
                <p>
                  Thường đóng vai trò trọng tâm trong bài thi nói (Speaking) và viết học thuật (Writing) để diễn đạt tính bền vững, chiều sâu tư duy hoặc quyết tâm cá nhân.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CỤM TỪ ĐI KÈM (COLLOCATIONS) */}
          {activeTab === 'collocations' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted">
                  Các cụm cố định & kết hợp tự nhiên (Collocations):
                </span>
                <span className="text-[11px] font-mono text-teal font-black">
                  {collocations.length} cụm tiêu biểu
                </span>
              </div>

              <div className="space-y-2">
                {collocations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-ink/30 bg-paper-2 flex items-start justify-between gap-3 hover:border-ink transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-red">
                          {idx + 1}.
                        </span>
                        <span className="text-sm font-black text-ink font-serif">
                          {item.phrase}
                        </span>
                      </div>
                      <p className="text-xs text-teal font-bold pl-4">
                        → {item.translation}
                      </p>
                      {item.example && (
                        <p className="text-[11px] text-ink-muted italic pl-4 font-serif">
                          &ldquo;{item.example}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TỪ ĐỒNG NGHĨA (SYNONYMS) */}
          {activeTab === 'synonyms' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted">
                  Từ đồng nghĩa & Phân biệt sắc thái (Nuances):
                </span>
                <span className="text-[11px] font-mono text-ink-soft">
                  So sánh ngữ cảnh
                </span>
              </div>

              <div className="space-y-2">
                {synonyms.map((syn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-ink/30 bg-paper-2 space-y-1 hover:border-ink transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-red font-serif">
                          {syn.word}
                        </span>
                        <span className="text-xs font-bold text-ink">
                          ({syn.translation})
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-ink-soft font-sans">
                      <strong className="text-ink">Sắc thái:</strong> {syn.nuance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VÍ DỤ BÀI HỌC (EXAMPLES FROM USER'S LEARNED LESSONS) */}
          {activeTab === 'examples' && (
            <div className="space-y-3">
              {/* Nhãn ghi nhớ bài học người dùng đã hoàn thành */}
              <div className="p-3 rounded-xl bg-amber/20 border-2 border-ink space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-ink">
                  <Pin className="w-3.5 h-3.5 text-red" />
                  <span>Bạn đã gặp từ này trong bài học:</span>
                </div>
                <div className="text-sm font-bold text-ink pl-5 font-serif">
                  &ldquo;{learnedSource.lessonTitle}&rdquo;
                </div>
                <div className="text-[11px] text-ink-muted pl-5 font-mono">
                  Thuộc {learnedSource.unitTitle} ({learnedSource.stage || 'Giai đoạn 1'})
                </div>
              </div>

              {/* Câu ví dụ ngữ cảnh chuẩn */}
              <div className="lined-paper p-3.5 rounded-xl border border-ink/30 space-y-2">
                <div>
                  <p className="text-sm font-serif italic text-ink leading-relaxed">
                    &ldquo;{word.exampleSentence || `We must cultivate ${word.targetText.toLowerCase()} to conquer complex obstacles.`}&rdquo;
                  </p>
                </div>

                <p className="text-xs font-bold text-teal pl-1">
                  → {word.exampleTranslation || `Chúng ta phải rèn luyện sự ${word.translation.toLowerCase().split(',')[0]} để vượt qua những chướng ngại vật phức tạp.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Đáy Phiếu Thư Viện: Lỗ Dập Tròn & Nút Thêm Vào Thẻ Ghi Nhớ */}
      <div className="bg-[#F0E6D2] border-t-2 border-ink px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Lỗ xỏ que tủ thư viện cổ điển */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full border-2 border-ink bg-[#FAF5EB] shadow-inner"
            title="Lỗ dập xỏ que mục lục catalog"
          />
          <span className="text-[10px] font-mono font-bold text-ink-soft hidden sm:inline-block">
            MÃ TRA CỨU: {word.id.toUpperCase()}
          </span>
        </div>

        {onAddToDeck && (
          <button
            onClick={() => onAddToDeck(word)}
            disabled={isAdded}
            className={`btn ${
              isAdded ? 'btn-paper opacity-80' : 'btn-red'
            } text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal" />
                <span>Đã lưu vào thẻ</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm vào thẻ ghi nhớ</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
