'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LingLing } from '../../components/ui/LingLing';
import {
  Headphones,
  Search,
  Plus,
  Play,
  Pause,
  Clock,
  Layers,
  Volume2,
  Sparkles,
  Filter,
  CheckCircle2,
  Radio,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Antenna,
  Volume1,
  Mic,
  FileText
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  englishTitle: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topic: string;
  duration: string;
  segmentsCount: number;
  thumbnailColor: string;
  plays: number;
  sampleTranscript?: string;
}

const LISTENING_LESSONS: Lesson[] = [
  {
    id: 'coffee-morning',
    title: 'Thói quen buổi sáng và tách cà phê ấm',
    englishTitle: 'Morning Coffee & Productivity Routine',
    level: 'A2',
    topic: 'Giao tiếp hằng ngày',
    duration: '02:45',
    segmentsCount: 6,
    thumbnailColor: 'from-amber/30 to-amber-soft',
    plays: 1240,
    sampleTranscript: 'Every morning, I drink a cup of warm water and plan my work for the day. A quiet morning helps me stay focused and energetic.',
  },
  {
    id: 'eco-living',
    title: 'Hành động nhỏ bảo vệ môi trường xanh',
    englishTitle: 'Small Daily Actions for the Planet',
    level: 'B1',
    topic: 'Khoa học đời sống',
    duration: '03:15',
    segmentsCount: 8,
    thumbnailColor: 'from-teal/20 to-teal/5',
    plays: 890,
    sampleTranscript: 'Sustainable living begins with small daily choices. Reducing plastic consumption and conserving clean water can make a tangible difference.',
  },
  {
    id: 'job-interview',
    title: 'Phỏng vấn xin việc bằng tiếng Anh tự tin',
    englishTitle: 'Mastering the Job Interview Dialogue',
    level: 'B2',
    topic: 'Phỏng vấn & Nghề nghiệp',
    duration: '04:10',
    segmentsCount: 9,
    thumbnailColor: 'from-red/20 to-amber/20',
    plays: 2150,
    sampleTranscript: 'When answering behavioral interview questions, highlight both your technical skills and collaborative problem-solving capabilities.',
  },
  {
    id: 'london-travel',
    title: 'Chuyến tàu ngầm khám phá thành phố London',
    englishTitle: 'Navigating the London Underground',
    level: 'A1',
    topic: 'Du lịch & Khám phá',
    duration: '01:50',
    segmentsCount: 4,
    thumbnailColor: 'from-teal/20 to-paper-2',
    plays: 1670,
    sampleTranscript: 'Mind the gap between the train and the platform. Take the Piccadilly line towards central London for the historic museums.',
  },
  {
    id: 'tech-revolution',
    title: 'Trí tuệ nhân tạo thay đổi cách chúng ta học',
    englishTitle: 'How Artificial Intelligence Shapes Learning',
    level: 'C1',
    topic: 'Tin tức thời sự',
    duration: '05:30',
    segmentsCount: 12,
    thumbnailColor: 'from-ink/10 to-card',
    plays: 740,
    sampleTranscript: 'The rapid evolution of artificial intelligence is redefining interactive education, personalizing language acquisition like never before.',
  },
  {
    id: 'airport-checkin',
    title: 'Thủ tục làm thủ tục tại sân bay quốc tế',
    englishTitle: 'Checking In at an International Airport',
    level: 'A2',
    topic: 'Du lịch & Khám phá',
    duration: '02:20',
    segmentsCount: 5,
    thumbnailColor: 'from-amber/20 to-paper-2',
    plays: 1420,
    sampleTranscript: 'Please have your passport and boarding pass ready at the gate. Place your carry-on luggage into the overhead compartment.',
  },
];

interface RadioStation {
  id: string;
  name: string;
  callsign: string;
  frequency: number; // in MHz
  needlePositionPercent: number; // 0% to 100% on the scale
  knobAngle: number; // in degrees
  categoryMatch: string[];
  description: string;
  badgeColor: string;
}

const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'station-news',
    name: 'Đài Tin Tức & Thời Sự',
    callsign: 'LINGUA NEWS · 88.5 FM',
    frequency: 88.5,
    needlePositionPercent: 18,
    knobAngle: -45,
    categoryMatch: ['Tin tức thời sự', 'Khoa học đời sống'],
    description: 'Bản tin xu hướng công nghệ, môi trường & thời sự quốc tế',
    badgeColor: 'bg-red text-white',
  },
  {
    id: 'station-stories',
    name: 'Đài Truyện Kể & Khám Phá',
    callsign: 'LINGUA STORY · 96.3 FM',
    frequency: 96.3,
    needlePositionPercent: 52,
    knobAngle: 0,
    categoryMatch: ['Du lịch & Khám phá'],
    description: 'Những chuyến du ký, văn hóa bốn phương và truyện kể truyền cảm hứng',
    badgeColor: 'bg-teal text-white',
  },
  {
    id: 'station-dialogue',
    name: 'Đài Hội Thoại & Giao Tiếp',
    callsign: 'LINGUA TALK · 104.2 FM',
    frequency: 104.2,
    needlePositionPercent: 86,
    knobAngle: 45,
    categoryMatch: ['Giao tiếp hằng ngày', 'Phỏng vấn & Nghề nghiệp'],
    description: 'Hội thoại đời thường, phỏng vấn xin việc & giao tiếp công sở',
    badgeColor: 'bg-amber text-ink',
  },
];

const LEVELS = ['Tất cả', 'A1', 'A2', 'B1', 'B2', 'C1'];
const TOPICS = ['Tất cả', 'Giao tiếp hằng ngày', 'Tin tức thời sự', 'Phỏng vấn & Nghề nghiệp', 'Du lịch & Khám phá', 'Khoa học đời sống'];

export default function ListeningHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedTopic, setSelectedTopic] = useState('Tất cả');

  // State cho Đài Phát Thanh Bò (Retro Paper Radio)
  const [stationIdx, setStationIdx] = useState<number>(0);
  const [isPlayingRadio, setIsPlayingRadio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1 | 1.25>(1);
  const [isKnobDragging, setIsKnobDragging] = useState<boolean>(false);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);

  const currentStation = RADIO_STATIONS[stationIdx];

  // Lọc bài học cho đài phát thanh theo thể loại của Kênh đang mở
  const stationPlaylist = LISTENING_LESSONS.filter((l) =>
    currentStation.categoryMatch.includes(l.topic)
  );
  const currentRadioLesson = stationPlaylist[activeLessonIdx % stationPlaylist.length] || LISTENING_LESSONS[0];

  // Xoay núm vặn: Click để chuyển kênh vòng tròn
  const handleRotateKnob = () => {
    const nextIdx = (stationIdx + 1) % RADIO_STATIONS.length;
    setStationIdx(nextIdx);
    setActiveLessonIdx(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingRadio(false);
  };

  // Kéo núm vặn (Pointer drag)
  const knobRef = useRef<HTMLDivElement>(null);
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsKnobDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isKnobDragging) {
      setIsKnobDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isKnobDragging || !knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const clientX = e.clientX;

    // Phân chia 3 vùng theo vị trí kéo ngang
    if (clientX < centerX - 25) {
      if (stationIdx !== 0) {
        setStationIdx(0);
        setActiveLessonIdx(0);
      }
    } else if (clientX > centerX + 25) {
      if (stationIdx !== 2) {
        setStationIdx(2);
        setActiveLessonIdx(0);
      }
    } else {
      if (stationIdx !== 1) {
        setStationIdx(1);
        setActiveLessonIdx(0);
      }
    }
  };

  // Phát âm bài học đang phát trên đài radio
  const handleToggleRadioPlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingRadio) {
      window.speechSynthesis.cancel();
      setIsPlayingRadio(false);
      return;
    }

    const textToRead = currentRadioLesson.sampleTranscript || currentRadioLesson.englishTitle;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(textToRead);
    u.lang = 'en-US';
    u.rate = playbackSpeed;
    u.onstart = () => setIsPlayingRadio(true);
    u.onend = () => setIsPlayingRadio(false);
    u.onerror = () => setIsPlayingRadio(false);
    window.speechSynthesis.speak(u);
  };

  const handleNextTrack = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingRadio(false);
    setActiveLessonIdx((prev) => (prev + 1) % stationPlaylist.length);
  };

  const handlePrevTrack = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingRadio(false);
    setActiveLessonIdx((prev) => (prev - 1 + stationPlaylist.length) % stationPlaylist.length);
  };

  // Danh sách bài học cho khu vực bên dưới (Search & Filter)
  const filteredLessons = LISTENING_LESSONS.filter((lesson) => {
    const matchSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.englishTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = selectedLevel === 'Tất cả' || lesson.level === selectedLevel;
    const matchTopic = selectedTopic === 'Tất cả' || lesson.topic === selectedTopic;
    return matchSearch && matchLevel && matchTopic;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-10 pb-28 sm:pb-20 text-left select-none">
      {/* 1. HEADER: PHÒNG LUYỆN NGHE GIẤY */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
              <Headphones className="w-3.5 h-3.5" />
              <span>Phòng Luyện Nghe · Sổ Tay Giấy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-serif">
              ĐÀI PHÁT THANH BÒ & PHÒNG LUYỆN NGHE
            </h1>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
              Vặn núm radio bắt sóng 3 kênh phát thanh tiếng Anh độc quyền. Rèn luyện phản xạ đôi tai với <b>Chép chính tả (Dictation)</b> và <b>Bò nhại tiếng (Shadowing)</b>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/listening/shadowing" className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-1.5">
                <Mic className="w-4 h-4" />
                <span>Bò Nhại Tiếng (Shadowing Lab) →</span>
              </Link>
              <Link href="/listening/practice" className="btn btn-paper text-xs font-bold text-ink shadow-brutal flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red" />
                <span>Chép chính tả hôm nay</span>
              </Link>
            </div>
          </div>

          {/* Linh vật LingLing đeo tai nghe */}
          <div className="hidden lg:flex flex-col items-center relative flex-shrink-0">
            <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
              Bật radio nghe <span className="text-red">15 phút</span> mỗi ngày nhé!
            </div>
            <LingLing reaction="headphones" size={120} />
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. FEATURE 4: 'ĐÀI PHÁT THANH BÒ' (RETRO PAPER RADIO CASING)
          =================================================================== */}
      <div className="bg-[#EFE6D2] border-4 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden">
        {/* Họa tiết ốc vít 4 góc phong cách radio cổ */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full border border-ink bg-ink/20 flex items-center justify-center text-[8px] font-mono text-ink">✕</div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full border border-ink bg-ink/20 flex items-center justify-center text-[8px] font-mono text-ink">✕</div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full border border-ink bg-ink/20 flex items-center justify-center text-[8px] font-mono text-ink">✕</div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full border border-ink bg-ink/20 flex items-center justify-center text-[8px] font-mono text-ink">✕</div>

        {/* Thanh tiêu đề máy Radio */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red" />
            <span className="text-xs font-black font-mono uppercase tracking-widest text-ink">
              MÁY THU THANH CỔ ĐIỂN · MODEL BF-1984
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-teal">
            <Antenna className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Tín hiệu bắt sóng tốt (5/5)</span>
          </div>
        </div>

        {/* Khối chính: Bảng điều khiển Radio và Màn hình Tần số */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Màng Loa Lưới Giấy (Speaker Mesh Grille) */}
          <div className="lg:col-span-3 bg-[#E4D9C0] border-2 border-ink rounded-2xl p-4 flex flex-col items-center justify-center min-h-[180px] shadow-inner relative overflow-hidden">
            {/* Lưới chấm màng loa */}
            <div className="w-28 h-28 rounded-full border-2 border-ink flex items-center justify-center bg-paper/60 shadow-inner p-2 relative">
              <div className="w-full h-full rounded-full border border-dashed border-ink/40 flex items-center justify-center">
                <LingLing reaction="headphones" size={72} />
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-ink-muted uppercase mt-2 tracking-wider">
              LOA TOÀN DẢI MONO
            </span>
          </div>

          {/* Màn hình Tần số Analog & Kim Chỉ Sóng */}
          <div className="lg:col-span-6 space-y-4">
            {/* Hộp kính hiển thị tần số (Tuning Scale) */}
            <div className="bg-[#2B231A] border-3 border-ink rounded-2xl p-4 text-[#FDF8EB] shadow-brutal space-y-3 relative overflow-hidden">
              {/* Đèn nền màn hình radio */}
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red animate-ping" />
                  <span className="text-xs font-mono font-black text-amber uppercase tracking-wider">
                    {currentStation.callsign}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-white/80">
                  FM STEREO · {currentStation.frequency} MHz
                </span>
              </div>

              {/* Thước đo tần số với vạch kẻ và Kim chỉ màu đỏ */}
              <div className="py-2 relative">
                {/* Vạch chia tần số 88 - 96 - 104 - 108 */}
                <div className="flex justify-between text-[10px] font-mono font-bold text-white/60 px-2 pb-1">
                  <span>88</span>
                  <span>92</span>
                  <span>96</span>
                  <span>100</span>
                  <span>104</span>
                  <span>108 MHz</span>
                </div>

                {/* Vạch thước ngang */}
                <div className="h-3 bg-black/60 rounded border border-white/30 relative flex items-center px-1">
                  <div className="w-full flex justify-between px-1 pointer-events-none">
                    {[...Array(21)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-0.5 ${i % 5 === 0 ? 'h-2 bg-white/70' : 'h-1 bg-white/30'}`}
                      />
                    ))}
                  </div>

                  {/* KIM CHỈ TẦN SỐ MÀU ĐỎ (DI CHUYỂN THEO KÊNH) */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-red shadow-[0_0_8px_#D64027] transition-all duration-500 ease-out z-10"
                    style={{ left: `${currentStation.needlePositionPercent}%` }}
                  >
                    <div className="w-2.5 h-2.5 bg-red border border-white rounded-full -ml-[3px] -mt-1 shadow" />
                  </div>
                </div>
              </div>

              {/* Thông tin chương trình đang phát */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <div className="space-y-0.5 max-w-[280px] sm:max-w-none">
                  <span className="text-amber font-serif font-black line-clamp-1">
                    {currentRadioLesson.title}
                  </span>
                  <span className="text-[11px] text-white/70 italic line-clamp-1">
                    {currentRadioLesson.englishTitle}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] font-mono font-bold text-white">
                  {currentRadioLesson.duration}
                </span>
              </div>
            </div>

            {/* 3 Nút Chuyển Kênh Nhanh dạng bấm radio */}
            <div className="grid grid-cols-3 gap-2">
              {RADIO_STATIONS.map((station, idx) => (
                <button
                  key={station.id}
                  onClick={() => {
                    setStationIdx(idx);
                    setActiveLessonIdx(0);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsPlayingRadio(false);
                  }}
                  className={`p-2 rounded-xl border-2 border-ink text-left transition-all cursor-pointer shadow-brutal-sm ${
                    stationIdx === idx
                      ? 'bg-ink text-paper shadow-brutal -translate-y-0.5'
                      : 'bg-card text-ink hover:bg-paper-2'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black">CH {idx + 1}</span>
                    <span className="text-[10px] font-mono text-red font-bold">{station.frequency}</span>
                  </div>
                  <span className="text-xs font-black line-clamp-1 block mt-0.5">
                    {station.name.replace('Đài ', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* NÚM VẶN XOAY ROTARY DIAL THẬT (INTERACTIVE ROTARY KNOB) */}
          <div className="lg:col-span-3 bg-card border-2 border-ink rounded-2xl p-5 text-center space-y-3 shadow-brutal flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono font-black uppercase text-ink">
              NÚM XOAY CHUYỂN KÊNH
            </span>

            {/* Núm Vặn Xoay Thật: Nhấp hoặc Kéo để đổi kênh */}
            <div
              ref={knobRef}
              onClick={handleRotateKnob}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              className="w-24 h-24 rounded-full bg-[#3D3124] border-4 border-ink shadow-brutal cursor-grab active:cursor-grabbing flex items-center justify-center relative transition-transform duration-300 select-none group"
              style={{
                transform: `rotate(${currentStation.knobAngle}deg)`,
                touchAction: 'none',
              }}
              title="Nhấp hoặc kéo để xoay núm vặn đổi kênh phát thanh"
            >
              {/* Rãnh khía núm vặn retro */}
              <div className="w-16 h-16 rounded-full bg-[#271E14] border-2 border-dashed border-white/20 flex items-center justify-center">
                {/* Vạch chỉ đỏ (Indicator notch) */}
                <div className="absolute top-2 w-1.5 h-6 bg-red rounded-full shadow-[0_0_6px_#D64027]" />
                <div className="w-6 h-6 rounded-full bg-ink border border-white/40 flex items-center justify-center text-[9px] font-mono text-white">
                  ⟳
                </div>
              </div>
            </div>

            <p className="text-[10px] text-ink-muted italic">
              (Chạm hoặc xoay núm để đổi kênh)
            </p>

            <span className="stamp-badge border border-red text-red text-[11px] font-mono font-black px-2 py-0.5">
              {currentStation.frequency} MHz
            </span>
          </div>
        </div>

        {/* Thanh Điều Khiển Phát Nhạc & Luyện Tập */}
        <div className="mt-6 pt-5 border-t-2 border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Bộ nút Play / Pause / Next / Prev */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevTrack}
              className="w-10 h-10 rounded-xl bg-card border-2 border-ink flex items-center justify-center shadow-brutal-sm hover:bg-paper cursor-pointer"
              title="Bài trước"
            >
              <SkipBack className="w-4 h-4 text-ink" />
            </button>

            <button
              onClick={handleToggleRadioPlay}
              className="px-6 py-2.5 rounded-xl bg-red text-white border-2 border-ink font-black text-xs shadow-brutal hover:bg-red-dark active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPlayingRadio ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Dừng radio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Phát âm đài tiếng</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextTrack}
              className="w-10 h-10 rounded-xl bg-card border-2 border-ink flex items-center justify-center shadow-brutal-sm hover:bg-paper cursor-pointer"
              title="Bài sau"
            >
              <SkipForward className="w-4 h-4 text-ink" />
            </button>

            {/* Tốc độ phát âm */}
            <div className="flex items-center gap-1 ml-2">
              {[0.75, 1, 1.25].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s as any)}
                  className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    playbackSpeed === s
                      ? 'bg-ink text-paper border-ink font-black shadow-brutal-sm'
                      : 'bg-card text-ink border-ink/30 hover:border-ink'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Các nút luyện tập trực tiếp từ bài đang phát */}
          <div className="flex items-center gap-3">
            <Link
              href="/listening/practice"
              className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-teal" />
              <span>Chép chính tả bài này →</span>
            </Link>

            <Link
              href="/listening/shadowing"
              className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-red" />
              <span>Bò nhại tiếng câu này →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. DANH SÁCH BÀI HỌC VỚI BỘ LỌC VÀ TÌM KIẾM CÓ SẴN
          =================================================================== */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-ink font-serif">
            Kho Bài Luyện Nghe Toàn Diện
          </h2>
          <span className="text-xs font-bold text-ink-muted">
            {filteredLessons.length} bài học thực tế
          </span>
        </div>

        {/* Search & Cấp độ Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Ô tìm kiếm giấy */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm bài học, chủ đề, tựa đề tiếng Anh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-2 border-ink rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red shadow-brutal-sm"
            />
          </div>

          {/* Lọc cấp độ CEFR */}
          <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-xs font-black uppercase text-ink-soft mr-1 whitespace-nowrap flex-shrink-0">Cấp độ:</span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-black transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedLevel === lvl
                    ? 'bg-ink text-paper shadow-brutal-sm'
                    : 'bg-card text-ink hover:bg-paper-2'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Tag chips chủ đề */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-ink-muted whitespace-nowrap flex-shrink-0">Chủ đề:</span>
          {TOPICS.map((tpc) => (
            <button
              key={tpc}
              onClick={() => setSelectedTopic(tpc)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                selectedTopic === tpc
                  ? 'border-ink bg-teal text-white shadow-brutal-sm'
                  : 'border-ink/30 bg-card text-ink-soft hover:border-ink hover:text-ink'
              }`}
            >
              {tpc}
            </button>
          ))}
        </div>
      </div>

      {/* Lưới Danh Sách Bài Học */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Header có hiệu ứng giấy viền */}
              <div className={`h-40 bg-gradient-to-br ${lesson.thumbnailColor} border-b-2 border-ink p-4 flex flex-col justify-between relative`}>
                <div className="flex items-center justify-between">
                  {/* Con dấu CEFR mực đỏ */}
                  <span className="stamp-badge w-10 h-10 text-xs font-black border-2 border-red text-red bg-card">
                    {lesson.level}
                  </span>

                  {/* Tag thời lượng giấy */}
                  <div className="flex items-center gap-1.5 bg-card/90 border border-ink px-2.5 py-1 rounded-lg text-xs font-black text-ink shadow-brutal-sm">
                    <Clock className="w-3.5 h-3.5 text-teal" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>

                {/* Nút Play trung tâm */}
                <div className="self-center">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-ink flex items-center justify-center shadow-brutal group-hover:scale-110 group-hover:bg-red group-hover:text-white transition-all text-ink">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black text-ink-soft">
                  <span>{lesson.topic}</span>
                  <span>{lesson.plays.toLocaleString()} lượt học</span>
                </div>
              </div>

              {/* Nội dung bài học */}
              <div className="p-5 space-y-2 text-left">
                <h3 className="font-black text-lg text-ink line-clamp-1 group-hover:text-red transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs font-semibold text-ink-muted italic line-clamp-1">
                  {lesson.englishTitle}
                </p>
              </div>
            </div>

            {/* Footer thẻ bài học */}
            <div className="p-5 pt-0 border-t border-ink/10 flex items-center justify-between mt-3">
              <span className="px-2.5 py-1 bg-paper-2 border border-ink rounded-lg font-bold text-xs text-ink flex items-center gap-1">
                <Layers className="w-3 h-3 text-ink-muted" />
                {lesson.segmentsCount} đoạn nghe
              </span>

              <Link
                href="/listening/practice"
                className="text-xs font-black text-red hover:underline flex items-center gap-1"
              >
                Chép chính tả →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="bg-card border-2 border-ink rounded-2xl p-12 text-center shadow-brutal space-y-4">
          <LingLing reaction="shrug" size={96} />
          <h4 className="text-lg font-black text-ink">Không tìm thấy bài nghe phù hợp</h4>
          <p className="text-sm text-ink-soft">Thử chọn cấp độ khác hoặc xóa từ khóa tìm kiếm bạn nhé!</p>
          <Button variant="paper" size="sm" onClick={() => { setSearchQuery(''); setSelectedLevel('Tất cả'); setSelectedTopic('Tất cả'); }}>
            Đặt lại bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
