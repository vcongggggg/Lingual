'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Headphones,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Tv,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button } from '@linguaflow/ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DictationVideo,
  SAMPLE_DICTATION_VIDEOS,
} from '@/lib/listening/videoDictationData';
import { VideoModeSelectModal, VideoPlayerMode } from '@/components/listening/VideoModeSelectModal';
import { VideoDictationStudio } from '@/components/listening/VideoDictationStudio';

export default function ListeningLabPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';
  const isVi = locale === 'vi';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

  // Video Studio Modal state
  const [selectedVideo, setSelectedVideo] = useState<DictationVideo | null>(null);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [activeStudioMode, setActiveStudioMode] = useState<VideoPlayerMode | null>(null);
  const [activeStudioVideo, setActiveStudioVideo] = useState<DictationVideo | null>(null);

  // Custom YouTube URL dialog
  const [customUrl, setCustomUrl] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Tags list
  const tags = [
    { key: 'ALL', label: isVi ? 'Tất cả' : 'All' },
    { key: 'YouTube', label: '# Youtube video' },
    { key: 'TED', label: '# TED' },
    { key: 'BBC learning english', label: '# BBC learning english' },
    { key: 'Short Movie', label: '# Short Movie' },
    { key: 'Music', label: '# Music' },
    { key: 'Animals and wildlife', label: '# Animals and wildlife' },
    { key: 'IELTS Listening', label: '# IELTS Listening' },
  ];

  // Channels list
  const channels = [
    { name: 'TED-Ed', logo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=60', color: 'border-rose-500' },
    { name: 'BBC Learning English', logo: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&auto=format&fit=crop&q=60', color: 'border-teal-500' },
    { name: 'Stanford University', logo: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=100&auto=format&fit=crop&q=60', color: 'border-amber-500' },
    { name: 'Boyce Avenue', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60', color: 'border-purple-500' },
    { name: 'Rick Astley Official', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=60', color: 'border-blue-500' },
    { name: 'Universal Pictures', logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&auto=format&fit=crop&q=60', color: 'border-emerald-500' },
  ];

  // Filtered video items for search or level filter
  const isFiltering = searchQuery.trim() !== '' || selectedLevel !== 'ALL' || selectedTag !== 'ALL' || selectedChannel !== 'ALL';

  const filteredVideos = useMemo(() => {
    return SAMPLE_DICTATION_VIDEOS.filter((v) => {
      const matchSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel = selectedLevel === 'ALL' || v.level === selectedLevel;
      const matchTag = selectedTag === 'ALL' || v.category.toLowerCase() === selectedTag.toLowerCase();
      const matchChannel = selectedChannel === 'ALL' || v.channel === selectedChannel;
      return matchSearch && matchLevel && matchTag && matchChannel;
    });
  }, [searchQuery, selectedLevel, selectedTag, selectedChannel]);

  // Grouped Categories for Multi-Row Display
  const featuredVideos = useMemo(() => SAMPLE_DICTATION_VIDEOS.filter((v) => v.isFeatured), []);
  const tedVideos = useMemo(() => SAMPLE_DICTATION_VIDEOS.filter((v) => v.category === 'TED'), []);
  const bbcVideos = useMemo(() => SAMPLE_DICTATION_VIDEOS.filter((v) => v.category.includes('BBC')), []);
  const generalVideos = useMemo(
    () => SAMPLE_DICTATION_VIDEOS.filter((v) => v.category === 'Music' || v.category === 'Short Movie' || v.category === 'Animals and wildlife'),
    []
  );

  // Click on a video card
  const handleOpenVideo = (video: DictationVideo) => {
    setSelectedVideo(video);
    setIsModeModalOpen(true);
  };

  // Select Mode from Modal
  const handleSelectMode = (video: DictationVideo, mode: VideoPlayerMode) => {
    setActiveStudioVideo(video);
    setActiveStudioMode(mode);
  };

  // Level Badge Color Resolver
  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-emerald-500 text-slate-950 font-black';
      case 'A2':
        return 'bg-teal-400 text-slate-950 font-black';
      case 'B1':
        return 'bg-blue-500 text-white font-black';
      case 'B2':
        return 'bg-purple-500 text-white font-black';
      case 'C1':
        return 'bg-rose-500 text-white font-black';
      case 'C2':
        return 'bg-amber-500 text-slate-950 font-black';
      default:
        return 'bg-cyan-500 text-slate-950 font-black';
    }
  };

  // Video Card Component
  const renderVideoCard = (video: DictationVideo) => (
    <div
      key={video.id}
      onClick={() => handleOpenVideo(video)}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 flex flex-col justify-between shrink-0 w-72 sm:w-80"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-xl text-[10px] uppercase tracking-wider shadow-md ${getLevelBadgeClass(video.level)}`}>
            {video.level}
          </span>
        </div>

        {/* Duration & Views Stats Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1 border border-slate-800">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{video.duration}</span>
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1 border border-cyan-500/20 font-bold">
            <Headphones className="w-3 h-3 text-cyan-400" />
            <span>{video.segments.length} đoạn</span>
          </span>
        </div>

        {/* Play Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Video Info Content */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
          <span className="truncate max-w-[150px] font-semibold">{video.channel}</span>
          <span className="font-mono text-cyan-400 font-extrabold">{video.segments.length} đoạn</span>
        </div>
      </div>
    </div>
  );

  // Horizontal Section Row Component
  const renderHorizontalSection = (title: string, count: number, videoList: DictationVideo[]) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">{title}</h2>
          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono font-bold">
            {count}
          </span>
        </div>
        <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          Xem tất cả
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-stretch gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {videoList.map((video) => renderVideoCard(video))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pointer-events-auto text-slate-100 font-sans">
      {/* 1. TOP HEADER & SEARCH / FILTER BAR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input Box */}
          <div className="relative w-full md:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm video, phim, bài phát biểu TED, BBC English..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Level Filter Dropdown (A1 -> C2) */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer shadow-sm"
              >
                <option value="ALL">Tất cả cấp độ</option>
                <option value="A1">A1 (Cơ bản)</option>
                <option value="A2">A2 (Sơ cấp)</option>
                <option value="B1">B1 (Trung cấp)</option>
                <option value="B2">B2 (Khá giỏi)</option>
                <option value="C1">C1 (Nâng cao)</option>
                <option value="C2">C2 (Thành thạo)</option>
              </select>
            </div>

            {/* Add Custom Video Button */}
            <Button
              variant="accent"
              size="md"
              onClick={() => setIsAddDialogOpen(true)}
              className="shadow-lg shadow-cyan-500/20 whitespace-nowrap bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              + Thêm video
            </Button>
          </div>
        </div>

        {/* Horizontal Hashtag Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedTag(t.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedTag === t.key
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CHANNELS CAROUSEL (KHÁM PHÁ THEO KÊNH) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
            <Tv className="w-4 h-4 text-cyan-400" />
            <span>Khám phá theo kênh</span>
          </h2>
          {selectedChannel !== 'ALL' && (
            <button
              onClick={() => setSelectedChannel('ALL')}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Xem tất cả kênh
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {channels.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedChannel(selectedChannel === ch.name ? 'ALL' : ch.name)}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-3xl bg-slate-900/60 border transition-all shrink-0 w-28 sm:w-32 group ${
                selectedChannel === ch.name
                  ? 'border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${ch.color} group-hover:scale-105 transition-transform shadow-md`}>
                <img src={ch.logo} alt={ch.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-300 group-hover:text-white truncate w-full text-center">
                {ch.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MULTI-ROW CATEGORIES / FILTERED SEARCH RESULTS */}
      {isFiltering ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span>Kết quả lọc & tìm kiếm</span>
              <span className="text-xs text-slate-500 font-mono">({filteredVideos.length})</span>
            </h2>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('ALL');
                setSelectedTag('ALL');
                setSelectedChannel('ALL');
              }}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Đặt lại bộ lọc
            </button>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
              <Headphones className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-300">Không tìm thấy video phù hợp</p>
              <p className="text-xs text-slate-500">Hãy thử đổi cấp độ hoặc từ khóa tìm kiếm khác nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredVideos.map((video) => renderVideoCard(video))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Row 1: Bài học nổi bật */}
          {renderHorizontalSection('Bài học nổi bật', featuredVideos.length, featuredVideos)}

          {/* Row 2: TED & TED-Ed */}
          {renderHorizontalSection('TED & TED-Ed', tedVideos.length, tedVideos)}

          {/* Row 3: BBC Learning English */}
          {renderHorizontalSection('BBC Learning English', bbcVideos.length, bbcVideos)}

          {/* Row 4: YouTube & Phim ngắn */}
          {renderHorizontalSection('YouTube video & Giải trí', generalVideos.length, generalVideos)}
        </div>
      )}

      {/* 4. MODAL CHỌN CHẾ ĐỘ LUYỆN TẬP */}
      <VideoModeSelectModal
        video={selectedVideo}
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        onSelectMode={handleSelectMode}
        locale={locale}
      />

      {/* 5. FULL-SCREEN 4-IN-1 VIDEO DICTATION STUDIO */}
      {activeStudioVideo && activeStudioMode && (
        <VideoDictationStudio
          video={activeStudioVideo}
          initialMode={activeStudioMode}
          onClose={() => {
            setActiveStudioVideo(null);
            setActiveStudioMode(null);
          }}
          locale={locale}
        />
      )}

      {/* 6. ADD CUSTOM YOUTUBE DIALOG */}
      <AnimatePresence>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddDialogOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-xl font-display font-extrabold text-white">Thêm Video YouTube Mới</h3>
              <p className="text-xs text-slate-400">
                Dán đường link YouTube bất kỳ để hệ thống tự động bẻ câu và tạo bài tập chép chính tả cho bạn.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customUrl) return;
                  const match = customUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                  const ytId = match ? match[1] : 'dQw4w9WgXcQ';

                  const newVideo: DictationVideo = {
                    id: `custom-${Date.now()}`,
                    youtubeId: ytId,
                    title: `Bài Luyện Nghe Tùy Chỉnh (${ytId})`,
                    channel: 'YouTube Custom Import',
                    category: 'YouTube',
                    level: 'B1',
                    duration: '3:30',
                    views: '1 view',
                    thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                    segments: [
                      {
                        id: 1,
                        start: 0.0,
                        end: 6.0,
                        text: 'Listen carefully to the audio clip and type what you hear.',
                        vietnamese: 'Lắng nghe kỹ đoạn âm thanh và gõ lại những gì bạn nghe được.',
                        words: ['Listen', 'carefully', 'to', 'the', 'audio', 'clip', 'and', 'type', 'what', 'you', 'hear.'],
                      },
                    ],
                  };

                  setSelectedVideo(newVideo);
                  setIsModeModalOpen(true);
                  setIsAddDialogOpen(false);
                  setCustomUrl('');
                }}
                className="space-y-4"
              >
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button variant="accent" size="sm" type="submit" className="bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black">
                    Bắt đầu học
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
