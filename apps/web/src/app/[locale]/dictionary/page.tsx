'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, Button, AudioButton, getWordImage, Modal } from '@linguaflow/ui';
import { dictionaryApi } from '../../../lib/api';
import { Search, Filter, Bookmark, PlusCircle, Check, BookOpen, Sparkles, Volume2, Lightbulb, ExternalLink } from 'lucide-react';

export interface WordItem {
  id: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  imageUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  cefrLevel: string;
  partOfSpeech: string;
  unitTitle?: string;
  isBookmarked?: boolean;
  inSrsDeck?: boolean;
}

export default function DictionaryPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState('all');
  const [selectedPos, setSelectedPos] = useState('all');
  const [displayCount, setDisplayCount] = useState(18);
  const [addedSrsMap, setAddedSrsMap] = useState<Record<string, boolean>>({});
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});
  const [selectedWordModal, setSelectedWordModal] = useState<WordItem | null>(null);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const data = await dictionaryApi.search({
        q: searchQuery,
        cefr: selectedCefr,
        partOfSpeech: selectedPos,
        limit: 100,
      });
      setWords(data.words || []);
    } catch (err) {
      console.error('Lỗi kết nối từ điển API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWords();
      setDisplayCount(18);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCefr, selectedPos]);

  const handleToggleBookmark = async (wordId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkMap((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
    try {
      await dictionaryApi.bookmark(wordId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToSrs = async (wordId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAddedSrsMap((prev) => ({ ...prev, [wordId]: true }));
    try {
      await dictionaryApi.addToSrs(wordId);
    } catch (e) {
      console.error(e);
    }
  };

  // Word of the Day (random pick from words or default)
  const wordOfTheDay = words.length > 0 ? words[0] : {
    id: 'wotd-1',
    targetText: 'Environment',
    translation: 'Môi trường sống',
    phonetic: '/ɪnˈvaɪrənmənt/',
    cefrLevel: 'B1',
    partOfSpeech: 'noun',
    exampleSentence: 'We must protect our environment.',
    exampleTranslation: 'Chúng ta phải bảo vệ môi trường sống của mình.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=80',
  };

  const visibleWords = words.slice(0, displayCount);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-300">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span>Tra Cứu & Khám Phá 500+ Từ Vựng Tiếng Anh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Từ Điển Thông Minh Lingual
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Tra cứu từ vựng theo cấp độ chuẩn CEFR (A1-B1), nghe phát âm native chuẩn, xem ví dụ song ngữ và thêm trực tiếp vào bộ thẻ ôn tập SRS.
        </p>
      </div>

      {/* WORD OF THE DAY FEATURED BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-teal-950/40 border border-amber-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 bg-slate-950 shadow-lg relative">
            <Image
              src={getWordImage(wordOfTheDay.targetText, wordOfTheDay.imageUrl)}
              alt={wordOfTheDay.targetText}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 tracking-widest uppercase">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              TỪ VỰNG TIÊU BIỂU TRONG NGÀY
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-display font-extrabold text-white">
                {wordOfTheDay.targetText}
              </h3>
              <AudioButton text={wordOfTheDay.targetText} />
            </div>
            <p className="text-xs font-mono text-teal-400">{wordOfTheDay.phonetic}</p>
            <p className="text-base font-bold text-amber-300">{wordOfTheDay.translation}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedWordModal(wordOfTheDay)}
          className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 shrink-0"
          icon={<ExternalLink className="w-4 h-4" />}
        >
          Xem chi tiết từ này
        </Button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <Card glow="teal" className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập từ tiếng Anh hoặc nghĩa tiếng Việt cần tìm..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm font-medium"
            />
          </div>

          {/* CEFR Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-400 shrink-0" />
            <select
              value={selectedCefr}
              onChange={(e) => setSelectedCefr(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-teal-300 text-xs font-bold focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="all">Tất cả cấp độ CEFR</option>
              <option value="A1">Cấp độ A1 (Sơ cấp)</option>
              <option value="A2">Cấp độ A2 (Sơ trung cấp)</option>
              <option value="B1">Cấp độ B1 (Trung cấp)</option>
            </select>
          </div>

          {/* Part of Speech Filter */}
          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">Tất cả từ loại</option>
            <option value="noun">Danh từ (Noun)</option>
            <option value="verb">Động từ (Verb)</option>
            <option value="adjective">Tính từ (Adjective)</option>
            <option value="phrase">Cụm từ (Phrase)</option>
          </select>
        </div>
      </Card>

      {/* VOCABULARY CARDS GRID */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Đang tìm kiếm dữ liệu từ điển...</p>
        </div>
      ) : words.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <p className="text-lg font-bold text-slate-300">Không tìm thấy từ vựng phù hợp</p>
          <p className="text-xs text-slate-400">Thử thay đổi từ khóa hoặc bộ lọc cấp độ CEFR.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleWords.map((w) => {
              const isBookmarked = bookmarkMap[w.id] ?? w.isBookmarked;
              const inSrs = addedSrsMap[w.id] || w.inSrsDeck;
              const img = getWordImage(w.targetText, w.imageUrl);

              return (
                <Card
                  key={w.id}
                  glow="teal"
                  onClick={() => setSelectedWordModal(w)}
                  className="p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/50 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  {/* Top Bar: Word Header & Actions */}
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950 relative">
                      <Image
                        src={img}
                        alt={w.targetText}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="text-xl font-display font-extrabold text-white truncate">
                          {w.targetText}
                        </h3>
                        <AudioButton text={w.targetText} className="p-1.5" />
                      </div>
                      {w.phonetic && (
                        <p className="text-xs font-mono text-teal-400 mt-0.5">{w.phonetic}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-[10px] font-extrabold text-teal-300 uppercase">
                          {w.cefrLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-400">
                          {w.partOfSpeech}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Translation & Example */}
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <p className="text-lg font-bold text-amber-300">{w.translation}</p>
                    {w.exampleSentence && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <p className="text-slate-100 font-semibold line-clamp-1">🇬🇧 "{w.exampleSentence}"</p>
                        {w.exampleTranslation && (
                          <p className="text-slate-400 line-clamp-1">🇻🇳 {w.exampleTranslation}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => handleToggleBookmark(w.id, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{isBookmarked ? 'Đã lưu' : 'Lưu từ'}</span>
                    </button>

                    <button
                      onClick={(e) => handleAddToSrs(w.id, e)}
                      disabled={inSrs}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inSrs
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 active:scale-95'
                      }`}
                    >
                      {inSrs ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã có trong SRS</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                          <span>Thêm vào thẻ SRS</span>
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {displayCount < words.length && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setDisplayCount((prev) => prev + 18)}
              >
                Tải Thêm Từ Vựng ({words.length - displayCount} từ còn lại)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* WORD DETAIL MODAL */}
      <Modal
        isOpen={!!selectedWordModal}
        onClose={() => setSelectedWordModal(null)}
        title="Chi Tiết Từ Vựng"
      >
        {selectedWordModal && (
          <div className="space-y-6 text-center">
            {/* Image */}
            <div className="relative w-48 h-48 rounded-3xl overflow-hidden border-2 border-teal-500/30 mx-auto bg-slate-950 shadow-xl">
              <Image
                src={getWordImage(selectedWordModal.targetText, selectedWordModal.imageUrl)}
                alt={selectedWordModal.targetText}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Word Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl font-display font-extrabold text-white">
                  {selectedWordModal.targetText}
                </h2>
                <AudioButton text={selectedWordModal.targetText} className="p-2.5" />
              </div>

              {selectedWordModal.phonetic && (
                <p className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-lg inline-block border border-teal-500/20">
                  {selectedWordModal.phonetic}
                </p>
              )}

              <p className="text-2xl font-bold text-amber-300">{selectedWordModal.translation}</p>

              <div className="flex justify-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs font-extrabold text-teal-300 uppercase">
                  Cấp độ CEFR: {selectedWordModal.cefrLevel || 'A1'}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 capitalize">
                  Từ loại: {selectedWordModal.partOfSpeech}
                </span>
              </div>
            </div>

            {/* Bilingual Example */}
            {selectedWordModal.exampleSentence && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase block">Ví dụ câu thực tế:</span>
                <p className="text-slate-100 font-semibold leading-relaxed">
                  🇬🇧 "{selectedWordModal.exampleSentence}"
                </p>
                {selectedWordModal.exampleTranslation && (
                  <p className="text-slate-400 leading-relaxed">
                    🇻🇳 ({selectedWordModal.exampleTranslation})
                  </p>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="accent"
                size="md"
                className="w-full"
                onClick={() => {
                  handleAddToSrs(selectedWordModal.id);
                  setSelectedWordModal(null);
                }}
              >
                Thêm Vào Thẻ Ôn Tập SRS
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
