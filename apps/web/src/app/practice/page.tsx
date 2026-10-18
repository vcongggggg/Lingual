'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Check,
  RotateCcw,
  Sparkles,
  Pin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  Puzzle,
  Compass,
  Bookmark,
  Share2,
  Calendar,
  Mail,
  Mic,
  Ear
} from 'lucide-react';
import { LingLing } from '../../components/ui/LingLing';
import { StampSlam } from '../../components/ui/StampSlam';
import { MASCOT_REGISTRY } from '../../components/mascot';
import { DailyChallenge } from '../../components/practice/DailyChallenge';
import { LettersFromLingLing } from '../../components/practice/LettersFromLingLing';
import { ShadowingLab } from '../../components/practice/ShadowingLab';
import { CowsTale } from '../../components/practice/CowsTale';
import { CowEavesdrop } from '../../components/practice/CowEavesdrop';


/* =========================================================================
   DỮ LIỆU THỰC: 2 ĐOẠN VĂN CỤM TỪ (DÁN CỤM LÊN BẢNG)
   ========================================================================= */
interface CollocationItem {
  id: string;
  phrase: string;
  phonetic: string;
  translation: string;
  partBreakdown: string;
  hintSentence: string;
}

interface PassageBoard {
  id: string;
  title: string;
  topic: string;
  level: string;
  collocations: CollocationItem[];
  fullParagraphTemplate: string; // [c1], [c2], etc.
  translationParagraph: string;
}

const PASSAGE_BOARDS: PassageBoard[] = [
  {
    id: 'pb-1',
    title: 'Phát triển Đô thị Bền vững & Môi trường',
    topic: 'IELTS Writing & Reading Task 2',
    level: 'B2 – C1',
    collocations: [
      {
        id: 'c1',
        phrase: 'mitigate climate change',
        phonetic: '/ˈmɪt.ɪ.ɡeɪt ˈklaɪ.mət tʃeɪndʒ/',
        translation: 'giảm thiểu biến đổi khí hậu',
        partBreakdown: 'Động từ (mitigate) + Cụm danh từ (climate change)',
        hintSentence: 'Biện pháp nhằm giảm nhẹ những tác động tiêu cực của biến đổi khí hậu toàn cầu.',
      },
      {
        id: 'c2',
        phrase: 'sustainable urban development',
        phonetic: '/səˈsteɪ.nə.bəl ˈɜː.bən dɪˈvel.əp.mənt/',
        translation: 'phát triển đô thị bền vững',
        partBreakdown: 'Tính từ (sustainable) + Tính từ (urban) + Danh từ (development)',
        hintSentence: 'Quy hoạch đô thị vừa đáp ứng nhu cầu hiện tại vừa không làm tổn hại tương lai.',
      },
      {
        id: 'c3',
        phrase: 'play a pivotal role',
        phonetic: '/pleɪ ə ˈpɪv.ə.təl rəʊl/',
        translation: 'đóng một vai trò nòng cốt',
        partBreakdown: 'Động từ (play) + Mạo từ (a) + Tính từ (pivotal) + Danh từ (role)',
        hintSentence: 'Giữ vai trò mấu chốt, mang tính chất quyết định đối với cả hệ thống.',
      },
      {
        id: 'c4',
        phrase: 'preserve natural habitats',
        phonetic: '/prɪˈzɜːv ˈnætʃ.ər.əl ˈhæb.ɪ.tæts/',
        translation: 'bảo tồn môi trường sống tự nhiên',
        partBreakdown: 'Động từ (preserve) + Tính từ (natural) + Danh từ số nhiều (habitats)',
        hintSentence: 'Bảo vệ nơi sinh sống tự nhiên của các loài động thực vật hoang dã.',
      },
    ],
    fullParagraphTemplate:
      'In order to [c1], city planners must prioritize [c2]. Green corridors and rooftop gardens [c3] in modern cities, ensuring that communities actively [c4] for urban wildlife.',
    translationParagraph:
      'Để giảm thiểu biến đổi khí hậu, các nhà quy hoạch phải ưu tiên phát triển đô thị bền vững. Các hành lang xanh và vườn trên mái đóng một vai trò nòng cốt tại các thành phố hiện đại, đảm bảo cộng đồng tích cực bảo tồn môi trường sống tự nhiên cho động vật hoang dã.',
  },
  {
    id: 'pb-2',
    title: 'Công nghệ Số & Phương pháp Học Tập',
    topic: 'Giáo trình Học thuật LinguaFlow',
    level: 'B1 – B2',
    collocations: [
      {
        id: 'c1',
        phrase: 'acquire new knowledge',
        phonetic: '/əˈkwaɪər njuː ˈnɒl.ɪdʒ/',
        translation: 'tiếp thu kiến thức mới',
        partBreakdown: 'Động từ (acquire) + Tính từ (new) + Danh từ không đếm được (knowledge)',
        hintSentence: 'Học hỏi và thu nhận thêm tri thức mới trong quá trình nghiên cứu.',
      },
      {
        id: 'c2',
        phrase: 'foster critical thinking',
        phonetic: '/ˈfɒs.tər ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/',
        translation: 'nuôi dưỡng tư duy phản biện',
        partBreakdown: 'Động từ (foster) + Tính từ (critical) + Danh từ (thinking)',
        hintSentence: 'Kích thích và phát triển khả năng suy xét độc lập, khách quan.',
      },
      {
        id: 'c3',
        phrase: 'overcome language barriers',
        phonetic: '/ˌəʊ.vəˈkʌm ˈlæŋ.ɡwɪdʒ ˈbær.i.əz/',
        translation: 'vượt qua rào cản ngôn ngữ',
        partBreakdown: 'Động từ (overcome) + Danh từ (language) + Danh từ số nhiều (barriers)',
        hintSentence: 'Vượt qua những khó khăn về trở ngại giao tiếp giữa các quốc gia.',
      },
      {
        id: 'c4',
        phrase: 'broaden academic horizons',
        phonetic: '/ˈbrɔː.dən ˌæk.əˈdem.ɪk həˈraɪ.zənz/',
        translation: 'mở rộng chân trời học thuật',
        partBreakdown: 'Động từ (broaden) + Tính từ (academic) + Danh từ số nhiều (horizons)',
        hintSentence: 'Mở rộng tầm hiểu biết và triển vọng nghiên cứu khoa học chuyên sâu.',
      },
    ],
    fullParagraphTemplate:
      'Online educational tools empower students to [c1] independently, while interactive seminars [c2]. By leveraging smart AI guidance, learners can effortlessly [c3] and [c4] across international boundaries.',
    translationParagraph:
      'Các công cụ giáo dục trực tuyến giúp sinh viên tiếp thu kiến thức mới một cách độc lập, trong khi các hội thảo tương tác nuôi dưỡng tư duy phản biện. Bằng việc tận dụng trợ giảng AI thông minh, người học có thể dễ dàng vượt qua rào cản ngôn ngữ và mở rộng chân trời học thuật xuyên biên giới.',
  },
];

/* =========================================================================
   DỮ LIỆU THỰC: 5 CÂU BÀI KIỂM TRA (KHOANH LỖI SAI)
   ========================================================================= */
interface ErrorQuestion {
  id: string;
  sourceExam: string;
  prompt: string;
  segments: {
    id: string;
    text: string;
    isError: boolean;
  }[];
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  teacherAdvice: string;
  memoryTip: string;
}

const ERROR_QUESTIONS: ErrorQuestion[] = [
  {
    id: 'err-1',
    sourceExam: 'Đề thi THPTQG & Tốt nghiệp Chuẩn B2',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'Despite of', isError: true },
      { id: 's2', text: 'the heavy torrential rain,', isError: false },
      { id: 's3', text: 'all students arrived', isError: false },
      { id: 's4', text: 'on time for the examination.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'Despite', isCorrect: true },
      { id: 'opt-b', text: 'Although of', isCorrect: false },
      { id: 'opt-c', text: 'In spite', isCorrect: false },
    ],
    teacherAdvice:
      'Quy tắc ngữ pháp: "Despite" bản thân nó đã là một giới từ, theo sau là Danh từ hoặc V-ing (KHÔNG bao giờ có "of"). Chỉ có cụm "In spite of" mới đi với "of".',
    memoryTip: 'Mẹo nhớ nhanh: "Despite" đứng một mình — "In spite" phải có "of" đi cùng!',
  },
  {
    id: 'err-2',
    sourceExam: 'TOEIC Part 5 Grammar Master',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'The number of', isError: false },
      { id: 's2', text: 'international applicants', isError: false },
      { id: 's3', text: 'have increased', isError: true },
      { id: 's4', text: 'drastically this semester.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'has increased', isCorrect: true },
      { id: 'opt-b', text: 'had been increased', isCorrect: false },
      { id: 'opt-c', text: 'are increasing', isCorrect: false },
    ],
    teacherAdvice:
      'Hòa hợp chủ vị: Khi chủ ngữ là "The number of + Danh từ số nhiều", động từ PHẢI chia ở ngôi thứ 3 số ít ("has increased"). Ngược lại, "A number of + N số nhiều" mới chia động từ số nhiều.',
    memoryTip: 'Mẹo nhớ nhanh: "The number" là số lượng duy nhất (chia SỐ ÍT) — "A number" là nhiều người (chia SỐ NHIỀU).',
  },
  {
    id: 'err-3',
    sourceExam: 'IELTS Academic Writing & Speaking Foundation',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'We are truly looking forward', isError: false },
      { id: 's2', text: 'to meet', isError: true },
      { id: 's3', text: 'the visiting professor', isError: false },
      { id: 's4', text: 'at the university colloquium.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'to meeting', isCorrect: true },
      { id: 'opt-b', text: 'for meet', isCorrect: false },
      { id: 'opt-c', text: 'to be meet', isCorrect: false },
    ],
    teacherAdvice:
      'Cấu trúc cố định: "Look forward to + V-ING / Noun". Từ "to" ở đây là GIỚI TỪ, không phải to-infinitive, nên động từ theo sau bắt buộc phải thêm đuôi -ing.',
    memoryTip: 'Mẹo nhớ nhanh: Sau cụm "look forward to" luôn là V-ING háo hức mong chờ!',
  },
  {
    id: 'err-4',
    sourceExam: 'Đề thi Học sinh giỏi & Chuyên Anh',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'Hardly had the scientist', isError: false },
      { id: 's2', text: 'completed the experiment', isError: false },
      { id: 's3', text: 'than', isError: true },
      { id: 's4', text: 'the power went out completely.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'when', isCorrect: true },
      { id: 'opt-b', text: 'then', isCorrect: false },
      { id: 'opt-c', text: 'as', isCorrect: false },
    ],
    teacherAdvice:
      'Cấu trúc đảo ngữ chỉ thời gian: "Hardly / Scarcely + had + S + V3/ed + WHEN + S + V2/ed" (Vừa mới... thì...). Cặp liên từ đi với "than" chỉ dùng cho "No sooner... than".',
    memoryTip: 'Mẹo nhớ nhanh: "Hardly" đi với "WHEN" — "No sooner" mới đi với "THAN"!',
  },
  {
    id: 'err-5',
    sourceExam: 'IELTS Academic Reading & Writing Grammar Check',
    prompt: 'Chạm vào 1 chỗ sai trong câu kiểm tra bên dưới, sau đó chọn mẩu giấy sửa đúng nhất:',
    segments: [
      { id: 's1', text: 'Modern economic expansion', isError: false },
      { id: 's2', text: 'must be coordinated with', isError: false },
      { id: 's3', text: 'environment protection', isError: true },
      { id: 's4', text: 'for our future generations.', isError: false },
    ],
    options: [
      { id: 'opt-a', text: 'environmental protection', isCorrect: true },
      { id: 'opt-b', text: 'environmentally protect', isCorrect: false },
      { id: 'opt-c', text: 'protective environment', isCorrect: false },
    ],
    teacherAdvice:
      'Trật tự từ loại: Trước danh từ "protection" (sự bảo vệ), ta cần một TÍNH TỪ "environmental" để bổ nghĩa thành cụm danh từ chuẩn xác: "environmental protection" (bảo vệ môi trường).',
    memoryTip: 'Mẹo nhớ nhanh: Bổ nghĩa cho danh từ, hãy dùng Tính từ (adj + noun)!',
  },
];

/* =========================================================================
   DỮ LIỆU THỰC: TRUYỆN SONG NGỮ 8 TRANG + 4 CÂU QUIZ (FEATURE 2)
   ========================================================================= */
interface StoryPage {
  pageNumber: number;
  titleEn: string;
  titleVi: string;
  paragraphEn: string;
  paragraphVi: string;
  mascotReaction: 'studying' | 'magnify' | 'meditate' | 'proud' | 'shocked' | 'thumbsup' | 'flex' | 'party';
  moralNote: string;
}

const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    titleEn: 'The Antique Compass',
    titleVi: 'Chiếc La Bàn Cổ',
    paragraphEn: "At dawn, young Linh discovered an antique brass compass tucked carefully inside her grandfather's study desk. An engraved inscription on its rosewood casing read: 'The true needle points not merely north, but toward unyielding curiosity.' With an empty sketchbook in her hand, she stepped out into the misty village path.",
    paragraphVi: 'Vào lúc bình minh, cô bé Linh tìm thấy một chiếc la bàn bằng đồng cổ được cất giữ cẩn thận trong ngăn bàn làm việc của ông nội. Dòng chữ khắc trên vỏ gỗ cẩm lai viết: "Kim la bàn đích thực không chỉ chỉ về hướng bắc, mà hướng về lòng hiếu kỳ không bao giờ khuất phục." Với cuốn sổ phác thảo trên tay, cô bước ra con đường làng phủ sương.',
    mascotReaction: 'studying',
    moralNote: 'Mỗi hành trình học hỏi vĩ đại đều bắt đầu từ một bước chân tò mò.',
  },
  {
    pageNumber: 2,
    titleEn: 'The Forest Crossroads',
    titleVi: 'Ngã Rẽ Bìa Rừng',
    paragraphEn: 'The cobblestone path split into two trails at the edge of the ancient bamboo grove. The left path was wide and paved, while the right path climbed steeply through damp fern leaves and wild lavender. The brass needle trembled and spun gently toward the uphill trail.',
    paragraphVi: 'Con đường đá cuội chia làm hai lối ở bìa rừng trúc cổ. Lối bên trái bằng phẳng và rộng rãi, trong khi lối bên phải leo dốc đứng xuyên qua những tán dương xỉ đẫm sương và hoa oải hương dại. Chiếc kim đồng khẽ rung lên rồi xoay tròn nhắm về phía con dốc gập ghềnh.',
    mascotReaction: 'magnify',
    moralNote: 'Con đường khó khăn thường dẫn đến những phong cảnh ngoạn mục nhất.',
  },
  {
    pageNumber: 3,
    titleEn: 'Beside the Weeping Willow',
    titleVi: 'Bên Cây Liễu Rủ',
    paragraphEn: "Beside a gentle emerald brook stood an immense weeping willow, its silken branches swaying in the mountain breeze. An old artisan sat quietly on a wooden trunk, carving exquisite patterns onto tea pottery. 'A traveler without patience often measures distance only by steps, not by heart,' he spoke softly without looking up.",
    paragraphVi: 'Bên dòng suối xanh ngọc êm đềm là một cây liễu rủ khổng lồ, cành lá mềm mại đung đưa trong gió núi. Một người nghệ nhân già ngồi lặng lẽ trên khúc gỗ, tỉ mỉ khắc từng hoa văn tinh tế lên đồ gốm uống trà. "Người lữ khách thiếu kiên nhẫn thường chỉ đo quãng đường bằng bước chân, chứ không bằng tấm lòng," ông cất lời nhỏ nhẹ mà không ngẩng đầu lên.',
    mascotReaction: 'meditate',
    moralNote: 'Sự kiên nhẫn và tĩnh lặng nuôi dưỡng chiều sâu cho tư duy.',
  },
  {
    pageNumber: 4,
    titleEn: 'The Lesson of Clay',
    titleVi: 'Bài Học Về Đất Sét',
    paragraphEn: "The artisan dipped his fingertips into the stream water to smooth a clay bowl. 'To master words, or pottery, or life itself, one must embrace imperfections. The fire does not destroy the clay; it tempers it into enduring porcelain.' Linh opened her notebook and transcribed his quiet wisdom in black ink.",
    paragraphVi: 'Người thợ gốm nhúng đầu ngón tay vào làn nước suối để làm nhẵn chiếc bát đất sét. "Để làm chủ ngôn từ, hay gốm sứ, hay chính cuộc đời, ta phải học cách chấp nhận những điều chưa hoàn hảo. Ngọn lửa không phá hủy đất sét; nó tôi luyện đất sét thành sứ bền vững." Linh mở cuốn sổ tay và ghi lại lời thông thái giản dị ấy bằng nét mực.',
    mascotReaction: 'proud',
    moralNote: 'Mắc lỗi trong khi học chính là cách tư duy được tôi luyện vững vàng.',
  },
  {
    pageNumber: 5,
    titleEn: 'The Summer Downpour',
    titleVi: 'Cơn Mưa Rào Mùa Hạ',
    paragraphEn: 'Dark clouds gathered swiftly above the forest canopy. Heavy raindrops drummed like rhythmic timpani upon the willow leaves. Instead of retreating in panic, Linh immediately helped the artisan shelter his fragile clay pieces beneath a thick woven bamboo tarp.',
    paragraphVi: 'Những đám mây đen kéo đến nhanh chóng trên vòm lá rừng. Những giọt mưa nặng hạt gõ nhịp rộn rã như tiếng trống trên những tán lá liễu. Thay vì hoảng loạn bỏ chạy, Linh đã nhanh chóng cùng người thợ gốm che chắn những mẩu đất sét mỏng manh dưới tấm bạt tre đan dày.',
    mascotReaction: 'shocked',
    moralNote: 'Hành động nhanh trí và lòng trắc ẩn luôn quý giá trong mọi nghịch cảnh.',
  },
  {
    pageNumber: 6,
    titleEn: 'The Crystal Brook',
    titleVi: 'Dòng Suối Pha Lê',
    paragraphEn: 'When the tempest passed, the air smelled intensely of fresh pine and blooming wild jasmine. A radiant rainbow bridged across the twin hills. The stream now sparkled with crystalline clarity, revealing smooth multi-colored pebbles polished over centuries of moving water.',
    paragraphVi: 'Khi cơn mưa giông đi qua, không khí ngập tràn mùi thông tươi và hoa lài dại chớm nở. Một dải cầu vồng rực rỡ bắc ngang qua hai ngọn đồi. Dòng suối lúc này lấp lánh trong vắt như pha lê, để lộ những viên sỏi nhiều màu mịn màng được mài giũa qua hàng thế kỷ của dòng nước chảy.',
    mascotReaction: 'thumbsup',
    moralNote: 'Sau cơn mưa, vẻ đẹp của sự nỗ lực bền bỉ sẽ tỏa sáng rõ nét nhất.',
  },
  {
    pageNumber: 7,
    titleEn: 'The Paper Lantern',
    titleVi: 'Ngọn Đèn Lồng Giấy',
    paragraphEn: "Before parting ways, the artisan presented Linh with a handcrafted paper lantern painted with a soaring golden crane. 'Keep this light burning when the trail grows dim,' he smiled warmly. 'Knowledge is the only lamp that never runs out of oil when shared.'",
    paragraphVi: 'Trước khi chia tay, người nghệ nhân trao tặng Linh một chiếc đèn lồng giấy thủ công vẽ hình chim hạc vàng tung cánh. "Hãy giữ ngọn đèn này luôn sáng khi con đường phía trước mờ mịt," ông mỉm cười ấm áp. "Tri thức là ngọn đèn duy nhất không bao giờ cạn dầu khi được sẻ chia cùng mọi người."',
    mascotReaction: 'flex',
    moralNote: 'Tri thức càng trao đi càng nhân lên gấp bội phần.',
  },
  {
    pageNumber: 8,
    titleEn: 'A New Horizon',
    titleVi: 'Chân Trời Mới',
    paragraphEn: 'Returning home under the twilight sky, Linh placed the compass and the lantern upon her desk beside her grammar books. She understood that learning a language was never about reaching an arbitrary destination, but about transforming every encounter into an enduring story.',
    paragraphVi: 'Trở về nhà dưới bầu trời hoàng hôn, Linh đặt chiếc la bàn và ngọn đèn lồng lên bàn học cạnh những trang sách ngữ pháp. Cô thấu hiểu rằng học ngoại ngữ chưa bao giờ là đến một đích đến cứng nhắc, mà là biến mỗi cuộc gặp gỡ trong đời thành một câu chuyện sống mãi.',
    mascotReaction: 'party',
    moralNote: 'Ngôn ngữ là cây cầu kết nối tâm hồn và mở ra những chân trời vô tận.',
  },
];

const STORY_QUIZ_QUESTIONS = [
  {
    id: 'sq-1',
    question: '1. What was the inscription written on the compass case?',
    options: [
      'A. Always walk the easiest paved path.',
      'B. The true needle points toward unyielding curiosity.',
      'C. Never venture into the ancient forest.',
      'D. Gold is more valuable than porcelain.',
    ],
    correctAnswer: 1,
    explanation: 'Trang 1 ghi rõ: "The true needle points not merely north, but toward unyielding curiosity."',
  },
  {
    id: 'sq-2',
    question: '2. According to the artisan, what does fire do to clay?',
    options: [
      'A. It destroys it beyond repair.',
      'B. It turns it into water.',
      'C. It tempers it into enduring porcelain.',
      'D. It dissolves all fine patterns.',
    ],
    correctAnswer: 2,
    explanation: 'Trang 4 khẳng định: "The fire does not destroy the clay; it tempers it into enduring porcelain."',
  },
  {
    id: 'sq-3',
    question: '3. What gift did the artisan give to Linh before she left?',
    options: [
      'A. A bag of silver coins.',
      'B. A handcrafted paper lantern with a golden crane.',
      'C. A large clay tea bowl.',
      'D. An umbrella for the rain.',
    ],
    correctAnswer: 1,
    explanation: 'Trang 7 ghi nhận: "The artisan presented Linh with a handcrafted paper lantern painted with a soaring golden crane."',
  },
  {
    id: 'sq-4',
    question: '4. What is knowledge compared to in the story?',
    options: [
      'A. A heavy stone in a backpack.',
      'B. A swift mountain river.',
      'C. The only lamp that never runs out of oil when shared.',
      'D. A clock ticking continuously.',
    ],
    correctAnswer: 2,
    explanation: 'Trang 7 trích dẫn: "Knowledge is the only lamp that never runs out of oil when shared."',
  },
];

/* =========================================================================
   DỮ LIỆU THỰC: XẾP CÂU — MẨU GIẤY TỪ TRÊN DÒNG KẺ (FEATURE 3)
   ========================================================================= */
interface ScrambleItem {
  id: string;
  sourceText: string;
  vietnameseMeaning: string;
  words: string[]; // target order
  grammarTip: string;
}

const SCRAMBLE_ITEMS: ScrambleItem[] = [
  {
    id: 'scr-1',
    sourceText: 'Consistency and perseverance are more crucial than natural talent .',
    vietnameseMeaning: 'Sự đều đặn và lòng kiên trì quan trọng hơn năng khiếu bẩm sinh.',
    words: ['Consistency', 'and', 'perseverance', 'are', 'more', 'crucial', 'than', 'natural', 'talent', '.'],
    grammarTip: 'Cấu trúc so sánh hơn với tính từ dài: S + to be + more + adj + than + N.',
  },
  {
    id: 'scr-2',
    sourceText: 'City planners must prioritize sustainable urban development to mitigate climate change .',
    vietnameseMeaning: 'Các nhà quy hoạch đô thị phải ưu tiên phát triển bền vững để giảm thiểu biến đổi khí hậu.',
    words: ['City', 'planners', 'must', 'prioritize', 'sustainable', 'urban', 'development', 'to', 'mitigate', 'climate', 'change', '.'],
    grammarTip: 'Động từ khuyết thiếu "must" đi với động từ nguyên thể không "to" (must prioritize).',
  },
  {
    id: 'scr-3',
    sourceText: 'Bilingualism has been shown to boost cognitive flexibility in adults .',
    vietnameseMeaning: 'Việc biết hai thứ tiếng đã được chứng minh là nâng cao tính linh hoạt trong nhận thức ở người trưởng thành.',
    words: ['Bilingualism', 'has', 'been', 'shown', 'to', 'boost', 'cognitive', 'flexibility', 'in', 'adults', '.'],
    grammarTip: 'Thể bị động của hiện tại hoàn thành: has/have been + V3/ed + to V.',
  },
  {
    id: 'scr-4',
    sourceText: 'Despite the torrential rain , all students arrived on time for the exam .',
    vietnameseMeaning: 'Dù trời mưa như trút nước, tất cả học sinh vẫn đến đúng giờ cho bài thi.',
    words: ['Despite', 'the', 'torrential', 'rain', ',', 'all', 'students', 'arrived', 'on', 'time', 'for', 'the', 'exam', '.'],
    grammarTip: '"Despite + Cụm danh từ" diễn tả sự tương phản mà không dùng "of".',
  },
  {
    id: 'scr-5',
    sourceText: 'We are truly looking forward to meeting the visiting professor at the colloquium .',
    vietnameseMeaning: 'Chúng tôi thật sự rất mong đợi được gặp giáo sư thỉnh giảng tại buổi tọa đàm.',
    words: ['We', 'are', 'truly', 'looking', 'forward', 'to', 'meeting', 'the', 'visiting', 'professor', 'at', 'the', 'colloquium', '.'],
    grammarTip: 'Cấu trúc quen thuộc: look forward to + V-ING (to là giới từ).',
  },
];

export type PracticeMode =
  | 'collocation'
  | 'error_hunt'
  | 'bilingual_story'
  | 'sentence_scramble'
  | 'daily_challenge'
  | 'letters_from_cow'
  | 'shadowing_lab'
  | 'cow_tale'
  | 'cow_eavesdrop';

export default function PracticeHubPage() {
  const [activeMode, setActiveMode] = useState<PracticeMode>('collocation');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const m = urlParams.get('mode');
      if (m === 'daily') setActiveMode('daily_challenge');
      else if (m === 'letters') setActiveMode('letters_from_cow');
      else if (m === 'shadowing') setActiveMode('shadowing_lab');
      else if (m === 'story') setActiveMode('cow_tale');
      else if (m === 'eavesdrop') setActiveMode('cow_eavesdrop');
    }
  }, []);

  /* -------------------------------------------------------------
     STATE CHO MODE 1: DÁN CỤM LÊN BẢNG
     ------------------------------------------------------------- */
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const currentBoard = PASSAGE_BOARDS[currentBoardIndex];
  const [activeCollocIndex, setActiveCollocIndex] = useState(0);
  const activeColloc = currentBoard.collocations[activeCollocIndex];

  const [collocStep, setCollocStep] = useState<1 | 2 | 3>(1);
  const [typedInput, setTypedInput] = useState('');
  const [pinnedCollocIds, setPinnedCollocIds] = useState<string[]>([]);
  const [isBoardCompleted, setIsBoardCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Phát âm TTS
  const speakText = (text: string, lang: 'en-US' | 'en-GB' = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const handleSwitchBoard = (index: number) => {
    setCurrentBoardIndex(index);
    setActiveCollocIndex(0);
    setCollocStep(1);
    setTypedInput('');
    setPinnedCollocIds([]);
    setIsBoardCompleted(false);
  };

  useEffect(() => {
    if (collocStep === 2) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [collocStep, activeCollocIndex]);

  const targetWords = activeColloc ? activeColloc.phrase.toLowerCase().trim().split(/\s+/) : [];
  const typedWords = typedInput.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const isExactMatch =
    typedInput.toLowerCase().trim().replace(/[.,!?;:]/g, '') ===
    activeColloc?.phrase.toLowerCase().trim();

  const handlePinCollocation = () => {
    if (!pinnedCollocIds.includes(activeColloc.id)) {
      const nextPinned = [...pinnedCollocIds, activeColloc.id];
      setPinnedCollocIds(nextPinned);

      if (nextPinned.length === currentBoard.collocations.length) {
        setIsBoardCompleted(true);
      } else {
        const nextIdx = activeCollocIndex + 1;
        setActiveCollocIndex(nextIdx);
        setCollocStep(1);
        setTypedInput('');
      }
    }
  };

  /* -------------------------------------------------------------
     STATE CHO MODE 2: KHOANH LỖI SAI
     ------------------------------------------------------------- */
  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = ERROR_QUESTIONS[questionIdx];
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<{
    isSuccess: boolean;
    hasChecked: boolean;
  } | null>(null);

  const handleTouchSegment = (segId: string) => {
    if (submittedAnswer?.hasChecked) return;
    if (selectedSegmentId === segId) {
      setSelectedSegmentId(null);
      setSelectedOptionId(null);
    } else {
      setSelectedSegmentId(segId);
      setSelectedOptionId(null);
    }
  };

  const handleSelectOption = (optId: string) => {
    if (submittedAnswer?.hasChecked) return;
    setSelectedOptionId(optId);

    const chosenSeg = currentQuestion.segments.find((s) => s.id === selectedSegmentId);
    const chosenOpt = currentQuestion.options.find((o) => o.id === optId);

    const isSuccess = Boolean(chosenSeg?.isError && chosenOpt?.isCorrect);

    setSubmittedAnswer({
      isSuccess,
      hasChecked: true,
    });
  };

  const handleNextErrorQuestion = () => {
    const next = (questionIdx + 1) % ERROR_QUESTIONS.length;
    setQuestionIdx(next);
    setSelectedSegmentId(null);
    setSelectedOptionId(null);
    setSubmittedAnswer(null);
  };

  const handleRetryErrorQuestion = () => {
    setSelectedSegmentId(null);
    setSelectedOptionId(null);
    setSubmittedAnswer(null);
  };

  /* -------------------------------------------------------------
     STATE CHO MODE 3: TRUYỆN SONG NGỮ (FEATURE 2)
     ------------------------------------------------------------- */
  const [storyPageIdx, setStoryPageIdx] = useState(0);
  const [showViTranslation, setShowViTranslation] = useState(false);
  const [isPlayingStoryAudio, setIsPlayingStoryAudio] = useState(false);
  const [storyQuizAnswers, setStoryQuizAnswers] = useState<Record<string, number>>({});
  const [storyQuizSubmitted, setStoryQuizSubmitted] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Tải và lưu tiến độ truyện vào localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('linguaflow_story_progress');
      if (savedPage) {
        const p = parseInt(savedPage, 10);
        if (p >= 0 && p <= STORY_PAGES.length) {
          setStoryPageIdx(p);
        }
      }
    }
  }, []);

  const handleSetStoryPage = (idx: number) => {
    const clamped = Math.max(0, Math.min(STORY_PAGES.length, idx));
    setStoryPageIdx(clamped);
    setShowViTranslation(false);
    setIsPlayingStoryAudio(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('linguaflow_story_progress', String(clamped));
    }
  };

  const handlePlayStoryAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isPlayingStoryAudio) {
      setIsPlayingStoryAudio(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.88;
    u.onend = () => setIsPlayingStoryAudio(false);
    u.onerror = () => setIsPlayingStoryAudio(false);
    setIsPlayingStoryAudio(true);
    window.speechSynthesis.speak(u);
  };

  // Vuốt chạm cảm ứng chuyển trang
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleSetStoryPage(storyPageIdx + 1); // Vuốt sang trái -> trang sau
    } else if (diff < -50) {
      handleSetStoryPage(storyPageIdx - 1); // Vuốt sang phải -> trang trước
    }
    touchStartXRef.current = null;
  };

  const storyScore = STORY_QUIZ_QUESTIONS.filter(
    (q) => storyQuizAnswers[q.id] === q.correctAnswer
  ).length;

  // PRELOAD TRƯỚC 1 TRANG KẾ BÊN (ASSETS + MASCOT + TEXT)
  useEffect(() => {
    if (activeMode !== 'bilingual_story') return;
    const nextIdx = storyPageIdx + 1;
    if (nextIdx < STORY_PAGES.length) {
      const nextPage = STORY_PAGES[nextIdx];
      const nextMascot = MASCOT_REGISTRY[nextPage.mascotReaction as keyof typeof MASCOT_REGISTRY];
      if (nextMascot && typeof window !== 'undefined') {
        const img = new Image();
        img.src = nextMascot;
      }
    }
    const prevIdx = storyPageIdx - 1;
    if (prevIdx >= 0) {
      const prevPage = STORY_PAGES[prevIdx];
      const prevMascot = MASCOT_REGISTRY[prevPage.mascotReaction as keyof typeof MASCOT_REGISTRY];
      if (prevMascot && typeof window !== 'undefined') {
        const img = new Image();
        img.src = prevMascot;
      }
    }
  }, [storyPageIdx, activeMode]);

  /* -------------------------------------------------------------
     STATE CHO MODE 4: XẾP CÂU (FEATURE 3)
     ------------------------------------------------------------- */
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const currentScramble = SCRAMBLE_ITEMS[scrambleIdx];
  const [placedWords, setPlacedWords] = useState<{ id: string; text: string }[]>([]);
  const [unplacedWords, setUnplacedWords] = useState<{ id: string; text: string }[]>([]);
  const [scrambleHintsLeft, setScrambleHintsLeft] = useState(2);
  const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Khởi tạo khay từ bị xáo trộn khi đổi câu
  useEffect(() => {
    const original = currentScramble.words.map((w, idx) => ({ id: `w-${idx}-${w}`, text: w }));
    // Xáo trộn ngẫu nhiên
    const shuffled = [...original].sort(() => Math.random() - 0.5);
    setUnplacedWords(shuffled);
    setPlacedWords([]);
    setScrambleStatus('idle');
  }, [scrambleIdx]);

  // Chạm mẩu từ ở khay -> bay vào dòng kẻ
  const handlePlaceWord = (wordObj: { id: string; text: string }) => {
    if (scrambleStatus === 'correct') return;
    setUnplacedWords((prev) => prev.filter((item) => item.id !== wordObj.id));
    setPlacedWords((prev) => [...prev, wordObj]);
    setScrambleStatus('idle');
  };

  // Chạm mẩu từ trên dòng kẻ -> trả về khay
  const handleReturnWord = (wordObj: { id: string; text: string }) => {
    if (scrambleStatus === 'correct') return;
    setPlacedWords((prev) => prev.filter((item) => item.id !== wordObj.id));
    setUnplacedWords((prev) => [...prev, wordObj]);
    setScrambleStatus('idle');
  };

  // Nút Gợi ý (tối đa 2 lượt/bài)
  const handleUseHint = () => {
    if (scrambleHintsLeft <= 0 || scrambleStatus === 'correct') return;
    const nextTargetWord = currentScramble.words[placedWords.length];
    if (!nextTargetWord) return;

    // Tìm từ tiếp theo trong khay unplacedWords
    const foundIdx = unplacedWords.findIndex((item) => item.text === nextTargetWord);
    if (foundIdx !== -1) {
      const hintWord = unplacedWords[foundIdx];
      setUnplacedWords((prev) => prev.filter((_, idx) => idx !== foundIdx));
      setPlacedWords((prev) => [...prev, hintWord]);
      setScrambleHintsLeft((prev) => prev - 1);
      setScrambleStatus('idle');
    }
  };

  // Kiểm tra thứ tự xếp câu
  const handleCheckScramble = () => {
    const currentConstructed = placedWords.map((w) => w.text).join(' ');
    const targetString = currentScramble.words.join(' ');

    if (currentConstructed === targetString) {
      setScrambleStatus('correct');
    } else {
      setScrambleStatus('wrong');
    }
  };

  const handleNextScramble = () => {
    const next = (scrambleIdx + 1) % SCRAMBLE_ITEMS.length;
    setScrambleIdx(next);
    setScrambleHintsLeft(2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 pb-28 text-left select-none">
      {/* HEADER & THANH CHUYỂN 4 MODE GIẤY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-ink pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
            <Link
              href="/dashboard"
              className="hover:text-red transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bàn Học</span>
            </Link>
            <span>/</span>
            <span className="text-ink">Góc Luyện Tập Giấy</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink font-serif tracking-tight">
            GÓC LUYỆN TẬP ĐẶC BIỆT
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Chữ mực trên nền giấy — 4 Phương pháp học tập trực quan không áp đặt
          </p>
        </div>

        {/* 4 Tab Mode Luyện Tập */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border-2 border-ink bg-paper-2 shadow-brutal-sm overflow-x-auto scrollbar-none flex-wrap">
          <button
            onClick={() => setActiveMode('collocation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'collocation'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-red" />
            <span>1. Dán cụm</span>
          </button>

          <button
            onClick={() => setActiveMode('error_hunt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'error_hunt'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-red text-red flex items-center justify-center text-[10px] font-black">
              ⭕
            </span>
            <span>2. Khoanh lỗi sai</span>
          </button>

          <button
            onClick={() => setActiveMode('bilingual_story')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'bilingual_story'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal" />
            <span>3. Truyện song ngữ</span>
          </button>

          <button
            onClick={() => setActiveMode('sentence_scramble')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'sentence_scramble'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5 text-amber" />
            <span>4. Xếp câu</span>
          </button>

          <button
            onClick={() => setActiveMode('daily_challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'daily_challenge'
                ? 'bg-red text-white shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>5. Thử thách ngày</span>
          </button>

          <button
            onClick={() => setActiveMode('letters_from_cow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'letters_from_cow'
                ? 'bg-teal text-white shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>6. Lá thư từ Bò</span>
          </button>

          <button
            onClick={() => setActiveMode('shadowing_lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'shadowing_lab'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-red" />
            <span>7. Bò nhại tiếng</span>
          </button>

          <button
            onClick={() => setActiveMode('cow_tale')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'cow_tale'
                ? 'bg-amber text-ink shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>8. Chuyện Bò kể</span>
          </button>

          <button
            onClick={() => setActiveMode('cow_eavesdrop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeMode === 'cow_eavesdrop'
                ? 'bg-red text-white shadow-brutal-sm'
                : 'text-ink hover:bg-paper'
            }`}
          >
            <Ear className="w-3.5 h-3.5 text-white" />
            <span>9. Bò đọc trộm</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          MODE 1: DÁN CỤM LÊN BẢNG (COLLOCATION MEMO NOTICE BOARD)
          =================================================================== */}
      {activeMode === 'collocation' && (
        <div className="space-y-6 animate-message-slide">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-ink-muted">Bài văn mẫu:</span>
              {PASSAGE_BOARDS.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => handleSwitchBoard(idx)}
                  className={`px-3 py-1 rounded-lg border-2 border-ink text-xs font-black transition-all cursor-pointer ${
                    currentBoardIndex === idx
                      ? 'bg-red text-white shadow-brutal-sm'
                      : 'bg-paper text-ink hover:bg-paper-2'
                  }`}
                >
                  Đoạn {idx + 1}: {b.title.split('&')[0]}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-teal bg-teal/10 text-teal">
              Đã ghim: {pinnedCollocIds.length} / {currentBoard.collocations.length} cụm
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI: MẨU GIẤY NOTE CỤM ĐANG HỌC (3 BƯỚC) */}
            <div className="lg:col-span-5 space-y-4">
              {!isBoardCompleted ? (
                <div className="relative bg-[#FAF5EB] border-2 border-ink rounded-2xl p-5 sm:p-6 shadow-brutal-md space-y-4">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber/40 border border-ink/40 rotate-[-1deg] shadow-sm pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-ink/20 pb-2.5 pt-1">
                    <span className="text-xs font-mono font-black text-red uppercase">
                      MẨU NOTE #{activeCollocIndex + 1}: {activeColloc.id.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-bold text-ink-muted">
                      Bước {collocStep}/3
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black uppercase">
                    <div
                      className={`p-1 rounded border border-ink ${
                        collocStep === 1 ? 'bg-amber text-ink' : 'bg-paper text-ink-muted'
                      }`}
                    >
                      1. Đọc & Nghe
                    </div>
                    <div
                      className={`p-1 rounded border border-ink ${
                        collocStep === 2 ? 'bg-amber text-ink' : 'bg-paper text-ink-muted'
                      }`}
                    >
                      2. Viết lại
                    </div>
                    <div
                      className={`p-1 rounded border border-ink ${
                        collocStep === 3 ? 'bg-amber text-ink' : 'bg-paper text-ink-muted'
                      }`}
                    >
                      3. Dán bảng
                    </div>
                  </div>

                  {collocStep === 1 && (
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-serif font-black text-ink">
                            {activeColloc.phrase}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => speakText(activeColloc.phrase, 'en-US')}
                              className="px-2 py-1 rounded border border-ink bg-paper hover:bg-amber text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                              title="Nghe giọng Mỹ"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-red" />
                              <span>US</span>
                            </button>
                            <button
                              onClick={() => speakText(activeColloc.phrase, 'en-GB')}
                              className="px-2 py-1 rounded border border-ink bg-paper hover:bg-teal/20 text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                              title="Nghe giọng Anh"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-teal" />
                              <span>UK</span>
                            </button>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal block">
                          {activeColloc.phonetic}
                        </span>
                      </div>

                      <div className="p-3 bg-paper rounded-xl border border-ink/20 space-y-1">
                        <span className="text-[10px] font-black uppercase text-ink-muted block">
                          Nghĩa tiếng Việt:
                        </span>
                        <p className="text-sm font-black text-red font-sans">
                          {activeColloc.translation}
                        </p>
                      </div>

                      <div className="p-2.5 bg-paper-2 rounded-lg border border-ink/15 text-xs text-ink-soft space-y-1">
                        <span className="font-bold text-ink block">Cấu tạo ngữ pháp:</span>
                        <p>{activeColloc.partBreakdown}</p>
                      </div>

                      <button
                        onClick={() => setCollocStep(2)}
                        className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer pt-2"
                      >
                        <span>Sẵn sàng viết lại cụm →</span>
                      </button>
                    </div>
                  )}

                  {collocStep === 2 && (
                    <div className="space-y-4 pt-1">
                      <div className="p-3 bg-amber/20 border border-ink rounded-xl space-y-1">
                        <span className="text-[10px] font-black uppercase text-ink-muted block">
                          Gợi ý nghĩa tiếng Việt:
                        </span>
                        <p className="text-sm font-black text-ink font-sans">
                          &ldquo;{activeColloc.translation}&rdquo;
                        </p>
                        <p className="text-[11px] text-ink-soft italic">
                          ({activeColloc.hintSentence})
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-ink block">
                          Gõ lại cụm tiếng Anh:
                        </label>
                        <input
                          ref={inputRef}
                          type="text"
                          value={typedInput}
                          onChange={(e) => setTypedInput(e.target.value)}
                          placeholder="Gõ chính xác từng từ của cụm..."
                          className="w-full lined-paper p-3 text-base font-bold text-ink border-2 border-ink rounded-xl focus:outline-none focus:border-red shadow-inner font-sans"
                        />
                      </div>

                      <div className="space-y-1.5 p-3 bg-paper rounded-xl border border-ink/30">
                        <span className="text-[10px] font-black uppercase text-ink-muted block">
                          So khớp từng từ:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {targetWords.map((word, wIdx) => {
                            const userWord = typedWords[wIdx];
                            const isMatch = userWord === word;
                            const isMismatch = userWord && userWord !== word;

                            return (
                              <div
                                key={wIdx}
                                className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold transition-all ${
                                  isMatch
                                    ? 'border-teal bg-teal/15 text-teal'
                                    : isMismatch
                                    ? 'border-red bg-red/10 text-red line-through'
                                    : 'border-ink/30 bg-paper-2 text-ink-muted'
                                }`}
                              >
                                {isMatch ? `✓ ${word}` : isMismatch ? `✗ ${userWord}` : word}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2">
                        {isExactMatch ? (
                          <button
                            onClick={() => setCollocStep(3)}
                            className="w-full btn btn-ink text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer animate-bounce"
                          >
                            <Sparkles className="w-4 h-4 text-amber" />
                            <span>Chính xác! Chuẩn bị dán lên bảng →</span>
                          </button>
                        ) : (
                          <div className="text-center text-xs font-bold text-ink-muted">
                            Hãy gõ đúng hoàn toàn {targetWords.length} từ để mở khóa dán bảng
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {collocStep === 3 && (
                    <div className="space-y-4 pt-1 text-center">
                      <div className="p-4 bg-teal/15 border-2 border-teal rounded-xl space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal text-white text-xs font-black">
                          <Check className="w-3.5 h-3.5" />
                          <span>Thuộc lòng cụm từ!</span>
                        </div>
                        <h4 className="text-xl font-serif font-black text-ink">
                          {activeColloc.phrase}
                        </h4>
                        <p className="text-xs text-teal font-bold font-sans">
                          {activeColloc.translation}
                        </p>
                      </div>

                      <button
                        onClick={handlePinCollocation}
                        className="w-full btn btn-red text-xs font-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Pin className="w-4 h-4" />
                        <span>Dán mẩu note này lên Bảng tổng hợp 📌</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FAF5EB] border-2 border-ink rounded-2xl p-6 shadow-brutal-md space-y-4 text-center">
                  <div className="flex justify-center">
                    <LingLing
                      reaction="flex"
                      size={100}
                      bubbleText="Bạn đã dán thành công tất cả cụm vào đoạn văn!"
                    />
                  </div>
                  <h3 className="text-xl font-black text-ink font-serif">
                    HOÀN THÀNH ĐOẠN VĂN!
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Tất cả các mẩu note đã được ghim trọn vẹn vào văn bản học thuật trên bảng.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleSwitchBoard((currentBoardIndex + 1) % PASSAGE_BOARDS.length)}
                      className="btn btn-red text-xs font-black shadow-brutal cursor-pointer"
                    >
                      Học đoạn tiếp theo →
                    </button>
                    <button
                      onClick={() => handleSwitchBoard(currentBoardIndex)}
                      className="btn btn-paper text-xs font-black shadow-brutal cursor-pointer"
                    >
                      Làm lại đoạn này
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 bg-paper-2 rounded-xl border border-ink/20 flex items-center gap-3">
                <LingLing reaction="studying" size={44} animate={false} />
                <p className="text-xs text-ink-soft font-medium leading-relaxed">
                  <strong className="text-ink">Mẹo học cụm:</strong> Đừng học từng từ đơn lẻ. Khi
                  dán từng cụm vào một đoạn văn hoàn chỉnh, não bộ sẽ ghi nhớ cả ngữ cảnh tự nhiên.
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG TỔNG HỢP (NOTICE BOARD) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative bg-[#EBDDBF] border-4 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl overflow-hidden min-h-[460px] flex flex-col justify-between">
                <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />
                <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />
                <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-red border-2 border-ink shadow-brutal-sm" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b-2 border-ink/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Pin className="w-5 h-5 text-red" />
                      <span className="text-sm font-black uppercase tracking-wider text-ink font-mono">
                        BẢNG TỔNG HỢP CỤM TỪ (NOTICE BOARD)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-ink-muted">
                      {currentBoard.topic}
                    </span>
                  </div>

                  <div className="relative bg-paper border-2 border-ink rounded-xl p-5 sm:p-6 shadow-brutal-md space-y-4">
                    <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                      <span className="text-xs font-black uppercase text-red font-mono">
                        Đoạn văn hoàn chỉnh:
                      </span>
                      <button
                        onClick={() =>
                          speakText(
                            currentBoard.fullParagraphTemplate.replace(/\[c\d\]/g, (match) => {
                              const cid = match.replace(/[\[\]]/g, '');
                              const c = currentBoard.collocations.find((item) => item.id === cid);
                              return c ? c.phrase : '';
                            }),
                            'en-US'
                          )
                        }
                        className="px-2 py-0.5 rounded border border-ink/40 bg-paper-2 hover:bg-amber text-[10px] font-mono font-black text-ink flex items-center gap-1 cursor-pointer"
                        title="Nghe toàn bộ đoạn văn"
                      >
                        <Volume2 className="w-3 h-3 text-red" />
                        <span>Nghe cả đoạn</span>
                      </button>
                    </div>

                    <p className="text-base sm:text-lg font-serif text-ink leading-relaxed font-normal">
                      {(() => {
                        const parts = currentBoard.fullParagraphTemplate.split(/(\[c\d\])/g);
                        return parts.map((part, pIdx) => {
                          const match = part.match(/^\[(c\d)\]$/);
                          if (match) {
                            const cid = match[1];
                            const cItem = currentBoard.collocations.find((c) => c.id === cid);
                            const isPinned = pinnedCollocIds.includes(cid);

                            if (isPinned && cItem) {
                              return (
                                <span
                                  key={pIdx}
                                  className="inline-block px-2 py-0.5 mx-1 rounded bg-teal/20 border-b-2 border-teal text-teal font-black animate-scale-up"
                                  title={`Đã ghim: ${cItem.translation}`}
                                >
                                  {cItem.phrase}
                                </span>
                              );
                            } else if (cItem) {
                              return (
                                <span
                                  key={pIdx}
                                  className="inline-block px-2 py-0.5 mx-1 rounded bg-paper-2 border-b-2 border-dashed border-ink/40 text-ink-muted font-bold"
                                  title="Chờ hoàn thành để ghim"
                                >
                                  [ ... ? ... ]
                                </span>
                              );
                            }
                          }
                          return <span key={pIdx}>{part}</span>;
                        });
                      })()}
                    </p>

                    <div className="pt-3 border-t border-ink/15 text-xs text-ink-soft italic font-sans leading-relaxed">
                      <strong className="text-ink not-italic">Dịch nghĩa học thuật: </strong>
                      {currentBoard.translationParagraph}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-black uppercase text-ink-muted block">
                      Các mẩu note đã ghim ({pinnedCollocIds.length}/{currentBoard.collocations.length}):
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentBoard.collocations.map((c, idx) => {
                        const isPinned = pinnedCollocIds.includes(c.id);
                        const rotationClass =
                          idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1.5deg]';

                        return (
                          <div
                            key={c.id}
                            className={`p-2.5 rounded-lg border-2 border-ink transition-all ${rotationClass} ${
                              isPinned
                                ? 'bg-paper shadow-brutal-sm opacity-100'
                                : 'bg-paper-2 border-dashed border-ink/30 opacity-40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-black text-red">
                                #{idx + 1}
                              </span>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isPinned ? 'bg-teal' : 'bg-ink/20'
                                }`}
                              />
                            </div>
                            <div className="text-xs font-serif font-black text-ink truncate mt-0.5">
                              {c.phrase}
                            </div>
                            <div className="text-[10px] text-teal font-bold truncate">
                              {c.translation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {isBoardCompleted && (
                  <div className="absolute inset-0 bg-ink/10 flex items-center justify-center pointer-events-none z-30">
                    <StampSlam
                      text="HOÀN THÀNH"
                      subtext="Đoạn văn đã được dán trọn vẹn"
                      variant="circle"
                      color="red"
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 2: KHOANH LỖI SAI (TOUCH TO CIRCLE ERROR EXAM PAPER)
          =================================================================== */}
      {activeMode === 'error_hunt' && (
        <div className="space-y-6 animate-message-slide">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div>
              <span className="text-xs font-mono font-black text-red uppercase block">
                BÀI KIỂM TRA NGỮ PHÁP & DỤNG TỪ — CÂU {questionIdx + 1}/{ERROR_QUESTIONS.length}
              </span>
              <span className="text-xs font-bold text-ink-muted">
                Nguồn: {currentQuestion.sourceExam}
              </span>
            </div>

            <span className="text-xs font-mono font-black px-2.5 py-1 rounded border border-ink bg-paper-2 text-ink">
              Mã đề: #ERR-80{questionIdx + 1}
            </span>
          </div>

          <div className="relative bg-[#FAF6ED] border-2 border-ink rounded-2xl shadow-brutal-lg overflow-hidden">
            <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-0.5 bg-red/40 pointer-events-none" />

            <div className="p-6 sm:p-8 pl-12 sm:pl-16 space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-ink-muted tracking-wider block">
                  Hướng dẫn bài thi:
                </span>
                <p className="text-xs sm:text-sm font-bold text-ink">
                  {currentQuestion.prompt}
                </p>
              </div>

              <div className="lined-paper p-5 sm:p-6 rounded-xl border-2 border-ink space-y-3 bg-paper">
                <span className="text-[10px] font-mono font-black text-ink-muted block uppercase">
                  Câu hỏi #{questionIdx + 1}:
                </span>

                <div className="text-lg sm:text-xl font-serif text-ink leading-loose flex items-center flex-wrap gap-2">
                  {currentQuestion.segments.map((seg) => {
                    const isCircled = selectedSegmentId === seg.id;

                    return (
                      <button
                        key={seg.id}
                        onClick={() => handleTouchSegment(seg.id)}
                        className={`relative cursor-pointer transition-all duration-150 inline-block px-2 py-1 rounded-lg ${
                          isCircled
                            ? 'border-2 border-red rounded-full text-red font-black shadow-[0_0_0_2px_rgba(214,64,39,0.2)] scale-105'
                            : 'hover:bg-paper-2 border border-transparent'
                        }`}
                        title="Chạm để khoanh tròn vị trí này"
                      >
                        {seg.text}
                        {isCircled && (
                          <span className="absolute -top-3 -right-2 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full bg-red text-white">
                            Khoanh
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSegmentId && !submittedAnswer?.hasChecked && (
                <div className="space-y-3 animate-message-slide">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-ink">
                      Chọn cách sửa trong 3 mẩu giấy đáp án dưới đây:
                    </span>
                    <span className="text-[11px] font-mono text-red font-bold">
                      (Bấm 1 mẩu giấy để nộp bài)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentQuestion.options.map((opt, oIdx) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className="p-4 bg-paper hover:bg-paper-2 border-2 border-ink rounded-xl shadow-brutal-sm hover:-translate-y-1 transition-all text-left space-y-1.5 cursor-pointer"
                        style={{
                          transform: `rotate(${oIdx === 0 ? '-1deg' : oIdx === 1 ? '0.5deg' : '-0.5deg'})`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-black text-red uppercase">
                            MẨU GIẤY #{String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-xs">✂️</span>
                        </div>
                        <p className="text-base font-black text-ink font-serif">
                          {opt.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {submittedAnswer?.hasChecked && (
                <div className="space-y-4 animate-message-slide">
                  {submittedAnswer.isSuccess ? (
                    <div className="p-5 bg-teal/10 border-2 border-teal rounded-xl space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-teal flex-shrink-0" />
                          <div>
                            <h4 className="text-base font-black text-ink font-serif">
                              Chính xác! Bạn đã khoanh đúng vị trí và chọn đúng cách sửa.
                            </h4>
                            <p className="text-xs text-teal font-bold font-sans">
                              {currentQuestion.teacherAdvice}
                            </p>
                          </div>
                        </div>

                        <StampSlam
                          text="BẮT ĐƯỢC LỖI"
                          variant="badge"
                          color="teal"
                          size="md"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-teal/30">
                        <LingLing
                          reaction="proud"
                          size={54}
                          bubbleText="Bắt lỗi quá chuẩn! Giữ vững phong độ nhé."
                        />
                        <button
                          onClick={handleNextErrorQuestion}
                          className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Câu tiếp theo →</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-paper-2 border-2 border-red rounded-xl space-y-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="text-base font-black text-red font-serif">
                            Chưa chính xác! Xem lời cô giáo dặn ở lề vở:
                          </h4>

                          <div className="p-3 bg-paper rounded-lg border border-ink/20 space-y-1">
                            <span className="text-[11px] font-black uppercase text-red font-mono block">
                              ① Lời cô giáo dặn:
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-ink leading-relaxed">
                              {currentQuestion.teacherAdvice}
                            </p>
                          </div>

                          <div className="p-3 bg-amber/20 rounded-lg border border-ink/30 space-y-1">
                            <span className="text-[11px] font-black uppercase text-ink font-mono block">
                              ② Mẹo ghi nhớ bỏ túi:
                            </span>
                            <p className="text-xs sm:text-sm font-black text-red font-serif">
                              {currentQuestion.memoryTip}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-ink/20">
                        <LingLing
                          reaction="thinking"
                          size={54}
                          bubbleText="Đừng buồn nhé, đọc kỹ mẹo ghi nhớ để không lặp lại lỗi!"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleRetryErrorQuestion}
                            className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Thử lại câu này</span>
                          </button>
                          <button
                            onClick={handleNextErrorQuestion}
                            className="btn btn-ink text-xs font-black shadow-brutal flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Bỏ qua & Qua câu sau →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 3: TRUYỆN SONG NGỮ 8 TRANG + 3D FLIP BOOK + QUIZ (FEATURE 2)
          =================================================================== */}
      {activeMode === 'bilingual_story' && (
        <div className="space-y-6 animate-message-slide">
          {/* Thanh chỉ dẫn sách */}
          <div className="flex items-center justify-between border-b-2 border-ink pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal border border-ink" />
              <span className="text-xs font-mono font-black uppercase tracking-wider text-ink">
                CUỐN SÁCH CỔ: CHIẾC LA BÀN BẰNG ĐỒNG & CÂY LIỄU THÌ THẦM
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal px-2 py-0.5 rounded border border-teal bg-teal/10">
                {storyPageIdx < STORY_PAGES.length ? `Trang 0${storyPageIdx + 1} / 08` : 'Bài tập cuối truyện'}
              </span>
              <span className="text-[11px] text-ink-muted italic hidden sm:inline-block">
                (Có lưu tiến độ tự động & preload mượt)
              </span>
            </div>
          </div>

          {/* PRELOAD KHÔNG GIAN BỘ NHỚ CHO TRANG TIẾP THEO */}
          {storyPageIdx + 1 < STORY_PAGES.length && (
            <div className="hidden" aria-hidden="true">
              <LingLing
                reaction={STORY_PAGES[storyPageIdx + 1].mascotReaction}
                size={1}
                animate={false}
              />
            </div>
          )}

          {storyPageIdx < STORY_PAGES.length ? (
            /* TRANG SÁCH LẬT 3D NHƯ SÁCH THẬT */
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ perspective: '1400px' }}
              className="relative"
            >
              <div
                className="relative bg-[#FAF5EB] border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundImage: 'radial-gradient(circle, #211A13 0.5px, transparent 0.5px)',
                  backgroundSize: '24px 24px',
                  boxShadow: '-8px 0 24px rgba(33,26,19,0.12), 8px 12px 0 #211A13',
                }}
              >
                {/* Góc gập trang sách (Folded Corner) */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#EAD8B8] border-b-2 border-l-2 border-ink shadow-sm pointer-events-none rounded-bl-xl" />

                {/* Đường gáy sách giả lập ở cạnh trái */}
                <div className="absolute top-0 bottom-0 left-3 w-1 bg-ink/15 pointer-events-none hidden sm:block" />

                {/* Header trang sách: Tên chương + Nút loa đọc audio trang */}
                <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4 mb-6">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black text-red uppercase tracking-widest block">
                      CHƯƠNG {STORY_PAGES[storyPageIdx].pageNumber} · {STORY_PAGES[storyPageIdx].titleVi.toUpperCase()}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-ink">
                      {STORY_PAGES[storyPageIdx].titleEn}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handlePlayStoryAudio(STORY_PAGES[storyPageIdx].paragraphEn)}
                      className={`btn text-xs font-mono font-black py-1.5 px-3 shadow-brutal-sm flex items-center gap-1.5 cursor-pointer ${
                        isPlayingStoryAudio ? 'btn-red' : 'btn-paper'
                      }`}
                      title="Nghe giọng đọc trang này"
                    >
                      <Volume2 className="w-4 h-4 text-red" />
                      <span>{isPlayingStoryAudio ? 'Đang đọc...' : 'Đọc trang này'}</span>
                    </button>
                  </div>
                </div>

                {/* Thân trang: Tranh minh họa nghệ thuật + Đoạn văn tiếng Anh */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Tranh minh họa sách / Mascot LingLing theo ngữ cảnh */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-[#F2E5CE] border-2 border-ink rounded-2xl shadow-brutal-sm text-center space-y-2">
                    <LingLing
                      reaction={STORY_PAGES[storyPageIdx].mascotReaction}
                      size={110}
                    />
                    <span className="text-[11px] font-serif italic text-ink-muted">
                      &ldquo;{STORY_PAGES[storyPageIdx].moralNote}&rdquo;
                    </span>
                  </div>

                  {/* Đoạn văn tiếng Anh (EN) */}
                  <div className="md:col-span-8 space-y-4">
                    <p className="text-lg sm:text-xl font-serif text-ink leading-relaxed font-normal">
                      <span className="float-left text-5xl font-black font-serif leading-none pr-3 pt-1 text-red">
                        {STORY_PAGES[storyPageIdx].paragraphEn.charAt(0)}
                      </span>
                      {STORY_PAGES[storyPageIdx].paragraphEn.slice(1)}
                    </p>

                    {/* Bản dịch tiếng Việt thu gọn (bấm mới mở) */}
                    <div className="pt-2">
                      <button
                        onClick={() => setShowViTranslation(!showViTranslation)}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-teal hover:text-ink cursor-pointer bg-teal/10 hover:bg-teal/20 px-3 py-1.5 rounded-lg border border-teal transition-colors"
                      >
                        {showViTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showViTranslation ? 'Thu gọn bản dịch tiếng Việt ▲' : 'Xem bản dịch tiếng Việt ▾'}</span>
                      </button>

                      {showViTranslation && (
                        <div className="mt-3 p-4 bg-paper rounded-xl border-2 border-ink space-y-1 animate-scale-up text-sm font-sans font-medium text-ink-soft leading-relaxed shadow-brutal-sm">
                          <strong className="text-ink font-bold block text-xs uppercase tracking-wider">
                            Bản dịch nghĩa Tiếng Việt:
                          </strong>
                          <p>{STORY_PAGES[storyPageIdx].paragraphVi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chân trang sách: Thanh điều hướng lật trang ‹ › & Vạch trang */}
                <div className="mt-8 pt-4 border-t-2 border-ink/20 flex items-center justify-between">
                  <button
                    onClick={() => handleSetStoryPage(storyPageIdx - 1)}
                    disabled={storyPageIdx === 0}
                    className="btn btn-paper text-xs font-black py-2 px-4 shadow-brutal-sm flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Trang trước</span>
                  </button>

                  {/* Vạch tiến trình các chấm trang sách */}
                  <div className="flex items-center gap-1.5">
                    {STORY_PAGES.map((_, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSetStoryPage(pIdx)}
                        className={`w-3 h-3 rounded-full border border-ink transition-all ${
                          storyPageIdx === pIdx
                            ? 'bg-red scale-125'
                            : 'bg-paper-2 hover:bg-amber'
                        }`}
                        title={`Đến trang ${pIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleSetStoryPage(storyPageIdx + 1)}
                    className="btn btn-ink text-xs font-black py-2 px-4 shadow-brutal-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>{storyPageIdx === STORY_PAGES.length - 1 ? 'Bài tập cuối truyện →' : 'Trang tiếp'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TRANG CUỐI CÙNG: QUIZ 4 CÂU ĐỌC HIỂU CỐT TRUYỆN */
            <div className="bg-[#FAF5EB] border-2 border-ink rounded-3xl p-6 sm:p-10 shadow-brutal-xl space-y-6">
              <div className="border-b-2 border-ink/20 pb-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-mono font-black text-red uppercase tracking-wider block">
                    HOÀN THÀNH CUỐN TRUYỆN
                  </span>
                  <h3 className="text-2xl font-serif font-black text-ink">
                    Bài tập đọc hiểu cốt truyện (4 câu)
                  </h3>
                </div>

                <button
                  onClick={() => handleSetStoryPage(0)}
                  className="btn btn-paper text-xs font-black py-1 px-3 shadow-brutal-sm flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đọc lại từ đầu</span>
                </button>
              </div>

              {/* 4 Câu trắc nghiệm */}
              <div className="space-y-5">
                {STORY_QUIZ_QUESTIONS.map((q, qIdx) => {
                  const userChoice = storyQuizAnswers[q.id];
                  const isCorrect = userChoice === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-4 bg-paper rounded-2xl border-2 border-ink space-y-3">
                      <h4 className="text-base font-black text-ink font-serif">
                        {q.question}
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt, oIdx) => {
                          let optStyle = 'bg-card border border-ink/40 text-ink hover:bg-paper-2';
                          if (userChoice === oIdx) {
                            optStyle = 'bg-ink text-paper border-2 border-ink font-black shadow-brutal-sm';
                          }
                          if (storyQuizSubmitted) {
                            if (oIdx === q.correctAnswer) {
                              optStyle = 'bg-teal/20 border-2 border-teal text-teal font-black';
                            } else if (userChoice === oIdx && !isCorrect) {
                              optStyle = 'bg-red/15 border-2 border-red text-red line-through';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={storyQuizSubmitted}
                              onClick={() =>
                                setStoryQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                              }
                              className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {storyQuizSubmitted && (
                        <div
                          className={`p-2.5 rounded-lg text-xs font-bold border ${
                            isCorrect ? 'bg-teal/10 border-teal text-teal' : 'bg-red/10 border-red text-red'
                          }`}
                        >
                          {isCorrect ? '✓ Hoàn toàn chính xác! ' : '✗ Chưa đúng. '}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chấm điểm & Đóng dấu */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                {storyQuizSubmitted ? (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <LingLing
                        reaction="party"
                        size={80}
                        bubbleText="Chúc mừng bạn đã chinh phục trọn vẹn cuốn truyện!"
                      />
                      <StampSlam
                        text="XUẤT SẮC"
                        subtext={`${storyScore} / 4 Câu Đúng`}
                        variant="circle"
                        color="red"
                        size="lg"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setStoryQuizSubmitted(false);
                        setStoryQuizAnswers({});
                        handleSetStoryPage(0);
                      }}
                      className="btn btn-red text-xs font-black shadow-brutal cursor-pointer"
                    >
                      Đọc lại cuốn sách từ trang 1 →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setStoryQuizSubmitted(true)}
                    disabled={Object.keys(storyQuizAnswers).length < STORY_QUIZ_QUESTIONS.length}
                    className="w-full sm:w-auto btn btn-red text-sm font-black shadow-brutal py-3 px-6 cursor-pointer disabled:opacity-50"
                  >
                    Nộp bài đọc hiểu & Nhận mộc son →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          MODE 4: XẾP CÂU (SENTENCE SCRAMBLE ON LINED PAPER) (FEATURE 3)
          =================================================================== */}
      {activeMode === 'sentence_scramble' && (
        <div className="space-y-6 animate-message-slide">
          {/* Header Xếp câu */}
          <div className="flex items-center justify-between border-b-2 border-ink pb-3 flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono font-black text-red uppercase block">
                BÀI TẬP XẾP CÂU DÒNG KẺ — CÂU {scrambleIdx + 1}/{SCRAMBLE_ITEMS.length}
              </span>
              <span className="text-xs font-bold text-ink-muted">
                Nghĩa câu: &ldquo;{currentScramble.vietnameseMeaning}&rdquo;
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(currentScramble.sourceText, 'en-US')}
                className="px-2.5 py-1 rounded-lg border-2 border-ink bg-paper hover:bg-amber text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1.5 cursor-pointer"
                title="Nghe câu mẫu"
              >
                <Volume2 className="w-3.5 h-3.5 text-red" />
                <span>Nghe câu mẫu</span>
              </button>

              <button
                onClick={handleUseHint}
                disabled={scrambleHintsLeft <= 0 || scrambleStatus === 'correct'}
                className="px-2.5 py-1 rounded-lg border-2 border-ink bg-amber/30 hover:bg-amber text-xs font-mono font-black text-ink shadow-brutal-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                title="Gợi ý từ tiếp theo"
              >
                <Lightbulb className="w-3.5 h-3.5 text-red" />
                <span>Gợi ý ({scrambleHintsLeft} lượt)</span>
              </button>
            </div>
          </div>

          {/* DÒNG KẺ VỞ: VÙNG ĐẶT CÁC MẨU GIẤY TỪ ĐÃ XẾP */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all space-y-4 ${
              scrambleStatus === 'correct'
                ? 'bg-teal/10 border-teal shadow-brutal-md'
                : scrambleStatus === 'wrong'
                ? 'bg-red/10 border-red animate-shake shadow-brutal-sm'
                : 'bg-card border-2 border-ink shadow-brutal-lg'
            }`}
          >
            <div className="flex items-center justify-between border-b border-ink/20 pb-2">
              <span className="text-xs font-black uppercase text-ink-muted">
                Dòng kẻ vở ghép câu (Chạm mẩu từ bên dưới để đặt vào; chạm mẩu đã xếp để trả về):
              </span>
              <span className="text-xs font-mono font-bold text-ink-soft">
                {placedWords.length} / {currentScramble.words.length} từ
              </span>
            </div>

            {/* Vùng khe dòng kẻ */}
            <div className="lined-paper min-h-[90px] p-4 rounded-2xl border-2 border-ink bg-paper flex flex-wrap gap-2.5 items-center">
              {placedWords.length === 0 ? (
                <span className="text-sm font-serif italic text-ink-muted select-none">
                  (Dòng kẻ đang trống. Hãy chạm vào các mẩu giấy từ bên dưới theo đúng thứ tự câu...)
                </span>
              ) : (
                placedWords.map((w, idx) => (
                  <button
                    key={`${w.id}-${idx}`}
                    onClick={() => handleReturnWord(w)}
                    className="px-3.5 py-2 rounded-xl border-2 border-ink bg-paper hover:bg-amber text-ink font-serif font-black text-base shadow-brutal-sm hover:scale-105 active:scale-95 transition-all cursor-pointer animate-scale-up"
                    title="Chạm để trả mẩu này về khay"
                  >
                    {w.text}
                  </button>
                ))
              )}
            </div>

            {/* Mẹo ngữ pháp */}
            <div className="text-xs text-ink-soft bg-paper-2 border border-ink/20 p-2.5 rounded-xl font-medium">
              💡 <strong>Quy tắc ngữ pháp:</strong> {currentScramble.grammarTip}
            </div>

            {/* ĐÓNG DẤU CHÍNH XÁC KHI ĐÚNG */}
            {scrambleStatus === 'correct' && (
              <div className="p-4 bg-teal/15 border-2 border-teal rounded-2xl flex items-center justify-between flex-wrap gap-3 animate-message-slide">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal flex-shrink-0" />
                  <div>
                    <h4 className="text-base font-black text-ink font-serif">
                      Ghép câu chính xác hoàn hảo!
                    </h4>
                    <p className="text-xs text-teal font-bold">
                      Các từ đã khớp trọn vẹn vào cấu trúc ngữ pháp chuẩn.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StampSlam
                    text="CHÍNH XÁC"
                    variant="badge"
                    color="teal"
                    size="md"
                  />
                  <button
                    onClick={handleNextScramble}
                    className="btn btn-ink text-xs font-black shadow-brutal cursor-pointer"
                  >
                    Câu tiếp theo →
                  </button>
                </div>
              </div>
            )}

            {/* THÔNG BÁO KHI XẾP SAI */}
            {scrambleStatus === 'wrong' && (
              <div className="p-3 bg-red/10 border border-red rounded-xl flex items-center justify-between gap-3 text-xs text-red font-bold">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Thứ tự các mẩu từ chưa chuẩn xác. Hãy chạm vào các từ xếp nhầm để trả về và thử lại!</span>
                </div>
                <button
                  onClick={() => setScrambleStatus('idle')}
                  className="underline hover:text-ink cursor-pointer flex-shrink-0"
                >
                  Đã hiểu
                </button>
              </div>
            )}
          </div>

          {/* KHAY MẨU GIẤY TỪ CHƯA CHỌN (UNPLACED WORD TILES) */}
          <div className="p-6 bg-paper-2 border-2 border-ink rounded-3xl shadow-brutal-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-ink tracking-wider">
                Khay các mẩu giấy từ xáo trộn (Chạm để mẩu từ bay vào dòng kẻ):
              </span>
              <span className="text-xs font-mono font-bold text-ink-muted">
                Còn lại {unplacedWords.length} mẩu
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 min-h-[60px] p-4 bg-paper rounded-2xl border-2 border-dashed border-ink/40 items-center">
              {unplacedWords.length === 0 ? (
                <span className="text-xs font-bold text-teal italic">
                  Đã xếp hết tất cả các mẩu từ lên dòng kẻ! Bấm nút kiểm tra bên dưới.
                </span>
              ) : (
                unplacedWords.map((w, idx) => (
                  <button
                    key={`${w.id}-${idx}`}
                    onClick={() => handlePlaceWord(w)}
                    className="px-3.5 py-2 rounded-xl border-2 border-ink bg-card hover:bg-amber hover:-translate-y-1 text-ink font-serif font-black text-base shadow-brutal-sm active:translate-y-0.5 transition-all cursor-pointer"
                    title="Chạm để đưa vào câu"
                  >
                    {w.text}
                  </button>
                ))
              )}
            </div>

            {/* Hàng nút hành động: Kiểm tra & Làm lại */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => {
                  const original = currentScramble.words.map((w, idx) => ({ id: `w-${idx}-${w}`, text: w }));
                  setUnplacedWords([...original].sort(() => Math.random() - 0.5));
                  setPlacedWords([]);
                  setScrambleStatus('idle');
                }}
                className="btn btn-paper text-xs font-black shadow-brutal flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xáo trộn & Xếp lại từ đầu</span>
              </button>

              <button
                onClick={handleCheckScramble}
                disabled={placedWords.length === 0 || scrambleStatus === 'correct'}
                className="btn btn-red text-xs font-black shadow-brutal flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Kiểm tra thứ tự câu →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODE 5: THỬ THÁCH MỖI NGÀY (DAILY CHALLENGE)
          =================================================================== */}
      {activeMode === 'daily_challenge' && (
        <div className="space-y-6 animate-message-slide">
          <DailyChallenge />
        </div>
      )}

      {/* ===================================================================
          MODE 6: LÁ THƯ TỪ BÒ (LETTERS FROM LINGLING - SRS LETTERS)
          =================================================================== */}
      {activeMode === 'letters_from_cow' && (
        <div className="space-y-6 animate-message-slide">
          <LettersFromLingLing />
        </div>
      )}

      {/* ===================================================================
          MODE 7: BÒ NHẠI TIẾNG (SHADOWING LAB)
          =================================================================== */}
      {activeMode === 'shadowing_lab' && (
        <div className="space-y-6 animate-message-slide">
          <ShadowingLab />
        </div>
      )}

      {/* ===================================================================
          MODE 8: CHUYỆN BÒ KỂ (MAD-LIBS STORY GENERATOR)
          =================================================================== */}
      {activeMode === 'cow_tale' && (
        <div className="space-y-6 animate-message-slide">
          <CowsTale />
        </div>
      )}

      {/* ===================================================================
          MODE 9: BÒ ĐỌC TRỘM (EAVESDROPPING COW LISTENING QUIZ)
          =================================================================== */}
      {activeMode === 'cow_eavesdrop' && (
        <div className="space-y-6 animate-message-slide">
          <CowEavesdrop />
        </div>
      )}
    </div>
  );
}
