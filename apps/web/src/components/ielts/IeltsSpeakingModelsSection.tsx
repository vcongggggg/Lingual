'use client';

import React, { useState, useEffect } from 'react';
import {
  Mic,
  Search,
  BookOpen,
  Award,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  Volume2,
  Ear,
  Bookmark,
  Share2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Modal } from '../ui/Modal';
import { StampSlam } from '../ui/StampSlam';

interface SpeakingPart3Item {
  question: string;
  answer: string;
}

interface SpeakingVocabItem {
  phrase?: string;
  word?: string;
  meaning_vi?: string;
  translation?: string;
}

export interface SpeakingModel {
  id: string;
  topic: string;
  cueCard: string;
  modelAnswerPart2: string;
  part3Json: string;
  part3?: SpeakingPart3Item[];
  part3Questions?: SpeakingPart3Item[];
  keyVocabJson: string;
  keyVocab?: SpeakingVocabItem[];
  notesVi?: string | null;
  bandEstimate: number;
  source?: string;
}

export function IeltsSpeakingModelsSection() {
  const [models, setModels] = useState<SpeakingModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<SpeakingModel | null>(null);
  const [activeTab, setActiveTab] = useState<'part2' | 'part3' | 'vocab'>('part2');
  const [copiedPart2, setCopiedPart2] = useState<boolean>(false);

  useEffect(() => {
    async function loadModels() {
      setLoading(true);
      try {
        const res = await api.getIeltsSpeakingModels();
        if (res.success && res.models) {
          setModels(res.models);
        }
      } catch (err) {
        console.error('Failed to load IELTS speaking models:', err);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  const filteredModels = models.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.topic.toLowerCase().includes(query) ||
      m.cueCard.toLowerCase().includes(query) ||
      (m.notesVi && m.notesVi.toLowerCase().includes(query))
    );
  });

  const handleCopyPart2 = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPart2(true);
    setTimeout(() => setCopiedPart2(false), 2000);
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="space-y-6 pt-4 text-left">
      {/* 1. Header Banner */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-soft border border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            <span>Thư Viện Đề & Bài Mẫu Speaking Band 8.0</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Tuyển Tập 60 Bộ Đề IELTS Speaking Chuẩn Band 8.0
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            Trọn bộ 60 chủ đề Speaking gồm Cue Card Part 2, bài nói mẫu 2 phút tự nhiên, 4 câu hỏi đào sâu thảo luận Part 3, danh mục thành ngữ ăn điểm và lời khuyên chiến thuật từ giám khảo bằng tiếng Việt.
          </p>
        </div>
      </div>

      {/* 2. Thanh Tìm Kiếm & Đếm Số Lượng */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-teal/15 text-teal border border-teal">
            60 Bộ đề hoàn chỉnh
          </span>
          <span className="text-xs font-bold text-ink-muted">
            Part 2 Cue Card + 4 Câu hỏi Part 3
          </span>
        </div>

        <div className="relative min-w-[260px] sm:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chủ đề, từ khóa đề thi..."
            className="w-full pl-10 pr-4 py-2 bg-card border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm placeholder:text-ink-muted focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Grid Danh Sách 60 Bộ Đề */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-yellow border-t-ink rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-ink-muted">Đang tải tuyển tập 60 bộ đề Speaking Band 8.0...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="py-12 bg-card border-2 border-ink rounded-3xl text-center space-y-2 p-6 shadow-brutal">
          <p className="text-sm font-black text-ink">Không tìm thấy bộ đề Speaking nào phù hợp.</p>
          <p className="text-xs text-ink-muted">Hãy thử thay đổi từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((item) => {
            const part3Count = item.part3?.length || 4;
            const vocabCount = item.keyVocab?.length || 0;

            return (
              <div
                key={item.id}
                className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all"
              >
                <div className="space-y-3">
                  {/* Badges row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-ink bg-teal/15 text-teal">
                      Part 2 & 3
                    </span>

                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-soft border border-ink text-ink flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Band {item.bandEstimate.toFixed(1)}</span>
                    </span>
                  </div>

                  {/* Title & Cue Card Preview */}
                  <div>
                    <h3 className="text-sm font-black text-ink line-clamp-1 font-sans">
                      {item.topic}
                    </h3>
                    <p className="text-xs text-ink-soft line-clamp-3 mt-1.5 leading-relaxed font-sans">
                      {item.cueCard}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-ink/15 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Part 2 + {part3Count} Q&A Part 3</span>
                    {vocabCount > 0 && <span>{vocabCount} cụm từ</span>}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedModel(item);
                      setActiveTab('part2');
                    }}
                    className="w-full btn btn-outline text-xs font-black py-2 shadow-brutal-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-paper-2"
                  >
                    <Mic className="w-3.5 h-3.5 text-red" />
                    <span>Xem bộ đề & bài mẫu →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal Chi Tiết Bộ Đề Speaking */}
      {selectedModel && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedModel(null)}
          title={`Bộ đề IELTS Speaking: ${selectedModel.topic}`}
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/15">
              <div>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-ink bg-teal/15 text-teal block mb-1.5 w-fit">
                  IELTS Speaking Part 2 & Part 3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-ink font-sans">
                  {selectedModel.topic}
                </h2>
              </div>

              <div className="px-3 py-1.5 bg-amber-soft border-2 border-ink rounded-xl shadow-brutal-sm flex items-center gap-1.5 text-xs font-black text-ink flex-shrink-0">
                <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Band {selectedModel.bandEstimate.toFixed(1)} Chuẩn</span>
              </div>
            </div>

            {/* Subtabs: Part 2 (Cue Card & Bài mẫu), Part 3 (4 Q&A), Từ vựng */}
            <div className="flex items-center gap-1.5 p-1 bg-paper-2 border-2 border-ink rounded-xl">
              <button
                onClick={() => setActiveTab('part2')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'part2'
                    ? 'bg-ink text-white shadow-brutal-sm'
                    : 'text-ink hover:bg-paper'
                }`}
              >
                Part 2: Cue Card & Bài Nói 2 Phút
              </button>
              <button
                onClick={() => setActiveTab('part3')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'part3'
                    ? 'bg-ink text-white shadow-brutal-sm'
                    : 'text-ink hover:bg-paper'
                }`}
              >
                Part 3: 4 Câu Thảo Luận Chuyên Sâu
              </button>
              <button
                onClick={() => setActiveTab('vocab')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'vocab'
                    ? 'bg-ink text-white shadow-brutal-sm'
                    : 'text-ink hover:bg-paper'
                }`}
              >
                Từ Vựng & Lời Bình ({selectedModel.keyVocab?.length || 0})
              </button>
            </div>

            {/* TAB 1: Part 2 Cue Card & Bài mẫu */}
            {activeTab === 'part2' && (
              <div className="space-y-5">
                {/* Cue card */}
                <div className="bg-paper-2 border-2 border-ink rounded-2xl p-5 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted block">
                    Đề Bài Part 2 (Candidate Task Card)
                  </span>
                  <div className="text-xs sm:text-sm text-ink font-semibold leading-relaxed whitespace-pre-line font-sans">
                    {selectedModel.cueCard}
                  </div>
                </div>

                {/* Model Answer Part 2 */}
                <div className="bg-card border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-red" />
                      <span className="text-xs font-black uppercase text-ink font-mono">
                        Bài Nói Mẫu 2 Phút ({getWordCount(selectedModel.modelAnswerPart2)} từ)
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyPart2(selectedModel.modelAnswerPart2)}
                      className="px-2.5 py-1 text-xs font-bold border border-ink rounded-lg bg-paper-2 hover:bg-paper flex items-center gap-1 text-ink transition-colors cursor-pointer"
                    >
                      {copiedPart2 ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal" />
                          <span className="text-teal font-black">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-ink leading-relaxed space-y-3 font-serif">
                    {selectedModel.modelAnswerPart2.split('\n\n').map((para, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Part 3 (4 Q&A) */}
            {activeTab === 'part3' && (
              <div className="space-y-4">
                <div className="p-3 bg-paper-2 border border-ink rounded-xl text-xs font-bold text-ink-muted">
                  Part 3 yêu cầu phát triển câu trả lời đa chiều, sử dụng lập luận mở rộng và góc nhìn xã hội khách quan.
                </div>

                {selectedModel.part3 && selectedModel.part3.length > 0 ? (
                  selectedModel.part3.map((qItem, qIdx) => (
                    <div
                      key={qIdx}
                      className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal-sm space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-red text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-ink font-sans leading-snug">
                          {qItem.question}
                        </h4>
                      </div>

                      <div className="pl-8 pt-2 border-t border-dashed border-ink/20 text-xs sm:text-sm text-ink-soft leading-relaxed font-serif">
                        {qItem.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink-muted italic">Đang cập nhật câu hỏi Part 3...</p>
                )}
              </div>
            )}

            {/* TAB 3: Từ Vựng & Lời Bình Giám Khảo */}
            {activeTab === 'vocab' && (
              <div className="space-y-5">
                {/* Key Vocab */}
                {selectedModel.keyVocab && selectedModel.keyVocab.length > 0 && (
                  <div className="bg-paper-2 border-2 border-ink rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-ink">
                        Cụm Từ Thành Ngữ & Collocations ({selectedModel.keyVocab.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedModel.keyVocab.map((v, vIdx) => {
                        const phrase = v.phrase || v.word || '';
                        const meaning = v.meaning_vi || v.translation || '';
                        return (
                          <div
                            key={vIdx}
                            className="bg-card border border-ink/30 rounded-xl p-3 shadow-brutal-sm space-y-1"
                          >
                            <div className="text-xs font-black text-teal font-sans">{phrase}</div>
                            {meaning && (
                              <div className="text-[11px] text-ink-soft leading-relaxed">{meaning}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Examiner's notes tiếng Việt */}
                {selectedModel.notesVi && (
                  <div className="bg-[#FEFCE8] border-2 border-ink rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-ink">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Chiến Thuật & Lời Khuyên Giám Khảo (Tiếng Việt)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line font-sans">
                      {selectedModel.notesVi}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 flex justify-end border-t border-ink/15">
              <button
                onClick={() => setSelectedModel(null)}
                className="btn btn-outline text-xs font-black shadow-brutal py-2.5 px-6 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
