'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  PenTool,
  TrendingUp,
  BarChart2,
  Layers,
  Filter,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Modal } from '../ui/Modal';
import { StampSlam } from '../ui/StampSlam';

interface KeyVocabItem {
  phrase?: string;
  word?: string;
  type?: string;
  translation?: string;
  meaningVi?: string;
  collocation?: string;
  example?: string;
}

export interface WritingModel {
  id: string;
  task: number;
  topic: string;
  chartType?: string | null;
  chartDescription?: string | null;
  prompt: string;
  modelAnswer: string;
  keyVocabJson: string;
  keyVocab?: KeyVocabItem[];
  examinerNotesVi?: string | null;
  bandEstimate: number;
  source?: string;
}

interface Props {
  onSelectForPractice?: (prompt: string, taskType: string) => void;
}

export function IeltsWritingModelsSection({ onSelectForPractice }: Props) {
  const [models, setModels] = useState<WritingModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [taskFilter, setTaskFilter] = useState<number>(0); // 0: All, 1: Task 1, 2: Task 2
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<WritingModel | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadModels() {
      setLoading(true);
      try {
        const res = await api.getIeltsWritingModels(taskFilter > 0 ? taskFilter : undefined);
        if (res.success && res.models) {
          setModels(res.models);
        }
      } catch (err) {
        console.error('Failed to load IELTS writing models:', err);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, [taskFilter]);

  const filteredModels = models.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.topic.toLowerCase().includes(query) ||
      m.prompt.toLowerCase().includes(query) ||
      (m.chartType && m.chartType.toLowerCase().includes(query)) ||
      (m.examinerNotesVi && m.examinerNotesVi.toLowerCase().includes(query))
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <span>Thư Viện Bài Mẫu Band 8.0</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Tuyển Tập 60 Bài Mẫu IELTS Writing Chuẩn Band 8.0
          </h2>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
            Trọn bộ 20 bài báo cáo biểu đồ Task 1 và 40 bài luận nghị luận Task 2 mẫu mực. Mỗi bài đều có bài giải hoàn chỉnh, phân tích từ vựng đắt giá và lời nhận xét chi tiết của giám khảo bằng tiếng Việt.
          </p>
        </div>
      </div>

      {/* 2. Bộ Lọc Task & Thanh Tìm Kiếm */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Task Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-paper-2 border-2 border-ink rounded-2xl shadow-brutal-sm overflow-x-auto">
          <button
            onClick={() => setTaskFilter(0)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              taskFilter === 0
                ? 'bg-ink text-white shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            Tất cả bài mẫu (60)
          </button>
          <button
            onClick={() => setTaskFilter(1)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              taskFilter === 1
                ? 'bg-teal text-white shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Task 1: Biểu đồ & Bản đồ (20)</span>
          </button>
          <button
            onClick={() => setTaskFilter(2)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              taskFilter === 2
                ? 'bg-red text-white shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Task 2: Bài luận Nghị luận (40)</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px] md:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chủ đề, dạng bài..."
            className="w-full pl-10 pr-4 py-2 bg-card border-2 border-ink rounded-xl text-xs font-black text-ink shadow-brutal-sm placeholder:text-ink-muted focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Danh Sách Bài Mẫu (Grid) */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-yellow border-t-ink rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-ink-muted">Đang tải tuyển tập 60 bài mẫu Band 8.0...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="py-12 bg-card border-2 border-ink rounded-3xl text-center space-y-2 p-6 shadow-brutal">
          <p className="text-sm font-black text-ink">Không tìm thấy bài mẫu nào phù hợp.</p>
          <p className="text-xs text-ink-muted">Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((item) => {
            const isTask1 = item.task === 1;
            const wordCount = getWordCount(item.modelAnswer);
            const vocabCount = item.keyVocab?.length || 0;

            return (
              <div
                key={item.id}
                className="bg-card border-2 border-ink rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all"
              >
                <div className="space-y-3">
                  {/* Badges row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-ink ${
                          isTask1 ? 'bg-teal/15 text-teal' : 'bg-red/15 text-red'
                        }`}
                      >
                        {isTask1 ? 'IELTS Task 1' : 'IELTS Task 2'}
                      </span>
                      {item.chartType && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-paper-2 border border-ink/40 text-ink">
                          {item.chartType}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-soft border border-ink text-ink flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Band {item.bandEstimate.toFixed(1)}</span>
                    </span>
                  </div>

                  {/* Title & Prompt Preview */}
                  <div>
                    <h3 className="text-sm font-black text-ink line-clamp-1 font-sans">
                      {item.topic}
                    </h3>
                    <p className="text-xs text-ink-soft line-clamp-3 mt-1.5 leading-relaxed font-sans">
                      {item.prompt}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-ink/15 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>{wordCount} từ</span>
                    {vocabCount > 0 && <span>{vocabCount} cụm từ then chốt</span>}
                  </div>

                  <button
                    onClick={() => setSelectedModel(item)}
                    className="w-full btn btn-outline text-xs font-black py-2 shadow-brutal-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-paper-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal" />
                    <span>Xem bài mẫu Band 8.0 →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal Chi Tiết Bài Mẫu */}
      {selectedModel && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedModel(null)}
          title={`Bài mẫu IELTS Writing Task ${selectedModel.task}`}
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/15">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-ink ${
                      selectedModel.task === 1 ? 'bg-teal/15 text-teal' : 'bg-red/15 text-red'
                    }`}
                  >
                    IELTS Task {selectedModel.task}
                  </span>
                  {selectedModel.chartType && (
                    <span className="text-xs font-mono font-bold text-ink-muted">
                      Dạng bài: {selectedModel.chartType}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-ink font-sans">
                  {selectedModel.topic}
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="px-3 py-1.5 bg-amber-soft border-2 border-ink rounded-xl shadow-brutal-sm flex items-center gap-1.5 text-xs font-black text-ink">
                  <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Band {selectedModel.bandEstimate.toFixed(1)} Chuẩn</span>
                </div>
              </div>
            </div>

            {/* 1. Đề bài (Prompt) */}
            <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 sm:p-5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted block">
                Đề Bài Đầy Đủ (Prompt)
              </span>
              <p className="text-xs sm:text-sm text-ink font-semibold leading-relaxed whitespace-pre-line font-sans">
                {selectedModel.prompt}
              </p>
              {selectedModel.chartDescription && (
                <div className="mt-2 pt-2 border-t border-ink/15 text-xs text-ink-soft italic">
                  <strong>Mô tả số liệu biểu đồ:</strong> {selectedModel.chartDescription}
                </div>
              )}
            </div>

            {/* 2. Bài Mẫu Band 8.0 (Model Answer) */}
            <div className="bg-card border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal" />
                  <span className="text-xs font-black uppercase text-ink font-mono">
                    Bài Viết Mẫu Hoàn Chỉnh ({getWordCount(selectedModel.modelAnswer)} từ)
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(selectedModel.modelAnswer)}
                  className="px-2.5 py-1 text-xs font-bold border border-ink rounded-lg bg-paper-2 hover:bg-paper flex items-center gap-1 text-ink transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal" />
                      <span className="text-teal font-black">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép bài</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-ink leading-relaxed space-y-3 font-serif">
                {selectedModel.modelAnswer.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>

            {/* 3. Phân Tích Từ Vựng Cốt Lõi (Key Vocab) */}
            {selectedModel.keyVocab && selectedModel.keyVocab.length > 0 && (
              <div className="bg-paper-2 border-2 border-ink rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-ink">
                    Cụm Từ & Thuật Ngữ Đắt Giá ({selectedModel.keyVocab.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedModel.keyVocab.map((v, vIdx) => {
                    const phrase = v.phrase || v.word || '';
                    const meaning = v.translation || v.meaningVi || '';
                    return (
                      <div
                        key={vIdx}
                        className="bg-card border border-ink/30 rounded-xl p-2.5 shadow-brutal-sm space-y-1"
                      >
                        <div className="text-xs font-black text-teal font-sans">{phrase}</div>
                        {meaning && <div className="text-[11px] text-ink-soft">{meaning}</div>}
                        {v.example && (
                          <div className="text-[10px] text-ink-muted italic font-serif">
                            "{v.example}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Nhận Xét & Lời Bình Giám Khảo (Examiner's Notes tiếng Việt) */}
            {selectedModel.examinerNotesVi && (
              <div className="bg-[#FEFCE8] border-2 border-ink rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-ink">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Nhận Xét Của Giám Khảo (Tiếng Việt)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line font-sans">
                  {selectedModel.examinerNotesVi}
                </p>
              </div>
            )}

            {/* Actions Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-ink/15">
              {onSelectForPractice && (
                <button
                  onClick={() => {
                    onSelectForPractice(
                      selectedModel.prompt,
                      selectedModel.task === 1 ? 'task_1' : 'task_2'
                    );
                    setSelectedModel(null);
                  }}
                  className="w-full sm:w-auto btn btn-red text-xs font-black shadow-brutal py-2.5 px-5 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Thử viết lại đề thi này</span>
                </button>
              )}

              <button
                onClick={() => setSelectedModel(null)}
                className="w-full sm:w-auto btn btn-outline text-xs font-black shadow-brutal py-2.5 px-5 cursor-pointer"
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
