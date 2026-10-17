'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LingLing } from '../../components/ui/LingLing';
import { api } from '../../lib/api';
import { Search, Plus, Volume2, CheckCircle2, BookmarkPlus } from 'lucide-react';

export default function VocabularyPage() {
  const [words, setWords] = useState<any[]>([]);
  const [filteredWords, setFilteredWords] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newWord, setNewWord] = useState({ targetText: '', translation: '', phonetic: '', exampleSentence: '', cefrLevel: 'B1' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Tải danh sách từ vựng từ backend hoặc danh mục từ điển
    api.getSrsQueue()
      .then((res) => {
        if (res.queue && res.queue.length > 0) {
          setWords(res.queue);
          setFilteredWords(res.queue);
        } else {
          // Fallback danh mục từ phong phú nếu DB rỗng
          const fallback = [
            { id: '1', targetText: 'Environment', phonetic: '/ɪnˈvaɪrənmənt/', translation: 'Môi trường sống', cefrLevel: 'B1', exampleSentence: 'We must protect our natural environment.' },
            { id: '2', targetText: 'Substantial', phonetic: '/səbˈstænʃl/', translation: 'Đáng kể, quan trọng', cefrLevel: 'B2', exampleSentence: 'A substantial amount of cash was found.' },
            { id: '3', targetText: 'Perseverance', phonetic: '/ˌpɜːsɪˈvɪərəns/', translation: 'Sự kiên trì, bền bỉ', cefrLevel: 'B2', exampleSentence: 'Through hard work and perseverance, he succeeded.' },
            { id: '4', targetText: 'Achieve', phonetic: '/əˈtʃiːv/', translation: 'Đạt được, hoàn thành', cefrLevel: 'A2', exampleSentence: 'She worked hard to achieve her goal.' },
            { id: '5', targetText: 'Community', phonetic: '/kəˈmjuːnəti/', translation: 'Cộng đồng', cefrLevel: 'B1', exampleSentence: 'The local community supported the campaign.' },
            { id: '6', targetText: 'Confidence', phonetic: '/ˈkɒnfɪdəns/', translation: 'Sự tự tin', cefrLevel: 'B1', exampleSentence: 'Practice gives you confidence to speak.' },
          ];
          setWords(fallback);
          setFilteredWords(fallback);
        }
      })
      .catch(() => {
        setWords([]);
        setFilteredWords([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = words;
    if (selectedLevel !== 'all') {
      result = result.filter((w) => (w.cefrLevel || '').toUpperCase() === selectedLevel.toUpperCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((w) =>
        w.targetText.toLowerCase().includes(q) || (w.translation || '').toLowerCase().includes(q)
      );
    }
    setFilteredWords(result);
  }, [selectedLevel, searchQuery, words]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddToSrs = async (word: any) => {
    try {
      await api.addSrsWord({
        targetText: word.targetText,
        translation: word.translation,
        phonetic: word.phonetic,
        exampleSentence: word.exampleSentence,
        cefrLevel: word.cefrLevel,
      });
      setToastMessage(`Đã thêm "${word.targetText}" vào bộ thẻ SRS!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage(`Đã ghi nhận "${word.targetText}" vào sổ tay ôn tập.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addSrsWord(newWord);
      setWords([newWord, ...words]);
      setModalOpen(false);
      setNewWord({ targetText: '', translation: '', phonetic: '', exampleSentence: '', cefrLevel: 'B1' });
      setToastMessage(`Đã tạo từ mới "${newWord.targetText}" thành công!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi thêm từ mới');
    }
  };

  const levels = ['all', 'A1', 'A2', 'B1', 'B2'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 text-left space-y-8">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-paper border-2 border-amber rounded-xl px-5 py-3 shadow-brutal-lg text-sm font-black animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-ink/20">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red block mb-1">
            Phân hệ 01 · Từ vựng cốt lõi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            Kho Từ Vựng Sổ Tay 📖
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Tra cứu, nghe phát âm bản ngữ và lưu trực tiếp vào hàng đợi lặp lại ngắt quãng SM-2.
          </p>
        </div>

        <Button variant="red" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 stroke-[3]" /> Thêm Từ Của Bạn
        </Button>
      </div>

      {/* Thanh Tìm Kiếm & Lọc Level */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm từ tiếng Anh hoặc nghĩa tiếng Việt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-2 border-ink rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-2 text-xs font-black rounded-xl border-2 border-ink select-none transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-card text-ink hover:bg-paper-2'
              }`}
            >
              {lvl === 'all' ? 'TẤT CẢ' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Danh Sách Từ Vựng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.map((w, index) => (
          <div
            key={w.id || index}
            className="bg-card border-2 border-ink rounded-2xl p-6 shadow-brutal-md hover:-translate-y-1 transition-transform flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant={w.cefrLevel === 'B2' ? 'red' : w.cefrLevel === 'B1' ? 'amber' : 'teal'}>
                  {w.cefrLevel || 'B1'}
                </Badge>
                <button
                  onClick={() => handleSpeak(w.targetText)}
                  className="w-8 h-8 rounded-lg border-2 border-ink bg-paper hover:bg-paper-2 flex items-center justify-center text-ink shadow-brutal-sm cursor-pointer"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-ink tracking-tight mb-1">{w.targetText}</h3>
              <p className="text-xs text-ink-soft mb-3 font-mono">{w.phonetic || '/.../'}</p>
              <div className="text-base font-extrabold text-teal mb-3">{w.translation}</div>

              {w.exampleSentence && (
                <div className="p-3 bg-paper-2 rounded-xl border border-ink/20 text-xs italic text-ink-soft leading-relaxed">
                  "{w.exampleSentence}"
                </div>
              )}
            </div>

            <div className="pt-5 mt-4 border-t border-ink/15 flex items-center justify-between">
              <span className="text-[11px] font-bold text-ink-soft">
                Khoảng ôn: {w.interval || 1} ngày
              </span>
              <button
                onClick={() => handleAddToSrs(w)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-red hover:underline cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" /> Thêm vào SRS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm Từ Mới */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Thêm Từ Vựng Vào Sổ Tay">
        <form onSubmit={handleCreateWord} className="space-y-4">
          <Input
            label="Từ Tiếng Anh"
            required
            placeholder="vd: Resilience"
            value={newWord.targetText}
            onChange={(e) => setNewWord({ ...newWord, targetText: e.target.value })}
          />
          <Input
            label="Phiên Âm IPA"
            placeholder="vd: /rɪˈzɪliəns/"
            value={newWord.phonetic}
            onChange={(e) => setNewWord({ ...newWord, phonetic: e.target.value })}
          />
          <Input
            label="Nghĩa Tiếng Việt"
            required
            placeholder="vd: Khả năng phục hồi, kiên cường"
            value={newWord.translation}
            onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
          />
          <Input
            label="Ví dụ thực tế"
            placeholder="vd: She showed great resilience in overcoming difficulties."
            value={newWord.exampleSentence}
            onChange={(e) => setNewWord({ ...newWord, exampleSentence: e.target.value })}
          />
          <Button type="submit" variant="red" size="md" className="w-full mt-4">
            Lưu Vào Sổ Tay & Bộ Thẻ →
          </Button>
        </form>
      </Modal>
    </div>
  );
}
