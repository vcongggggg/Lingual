/**
 * Sample Curated Dataset for LinguaFlow Listening Lab
 * Covers CEFR A1, A2, B1 with deterministic vocabulary, transcripts, and translations.
 */

import { ListeningExercise } from '@linguaflow/domain';

export const SAMPLE_LISTENING_EXERCISES: ListeningExercise[] = [
  // ==========================================================================
  // LEVEL A1: BEGINNER ESSENTIALS
  // ==========================================================================
  {
    id: 'listen-a1-01',
    title: 'Warm Greetings',
    difficulty: 'A1',
    category: 'Daily Life',
    transcript: 'Hello, how are you today?',
    translation: 'Xin chào, hôm nay bạn thế nào?',
    durationSeconds: 3,
    modes: ['dictation', 'shadowing'],
    tags: ['greetings', 'basics'],
    vocabulary: [
      { targetText: 'hello', translation: 'xin chào', phonetic: '/həˈləʊ/' },
      { targetText: 'today', translation: 'hôm nay', phonetic: '/təˈdeɪ/' },
    ],
  },
  {
    id: 'listen-a1-02',
    title: 'Language Journey',
    difficulty: 'A1',
    category: 'Education',
    transcript: 'I am learning English with LinguaFlow.',
    translation: 'Tôi đang học tiếng Anh với LinguaFlow.',
    durationSeconds: 4,
    modes: ['dictation', 'shadowing'],
    tags: ['learning', 'study'],
    vocabulary: [
      { targetText: 'learning', translation: 'đang học', phonetic: '/ˈlɜː.nɪŋ/' },
      { targetText: 'English', translation: 'tiếng Anh', phonetic: '/ˈɪŋ.ɡlɪʃ/' },
    ],
  },
  {
    id: 'listen-a1-03',
    title: 'Meeting Schedule',
    difficulty: 'A1',
    category: 'Workplace',
    transcript: 'What time is the morning meeting?',
    translation: 'Cuộc họp buổi sáng lúc mấy giờ?',
    durationSeconds: 4,
    modes: ['dictation', 'shadowing'],
    tags: ['time', 'schedule'],
    vocabulary: [
      { targetText: 'time', translation: 'thời gian / giờ', phonetic: '/taɪm/' },
      { targetText: 'meeting', translation: 'cuộc họp', phonetic: '/ˈmiː.tɪŋ/' },
    ],
  },
  {
    id: 'listen-a1-04',
    title: 'Medical Profession',
    difficulty: 'A1',
    category: 'Careers',
    transcript: 'She works as a dedicated nurse at the city hospital.',
    translation: 'Cô ấy làm y tá tận tâm tại bệnh viện thành phố.',
    durationSeconds: 5,
    modes: ['dictation', 'shadowing'],
    tags: ['hospital', 'career'],
    vocabulary: [
      { targetText: 'hospital', translation: 'bệnh viện', phonetic: '/ˈhɒs.pɪ.təl/' },
      { targetText: 'nurse', translation: 'y tá', phonetic: '/nɜːs/' },
    ],
  },

  // ==========================================================================
  // LEVEL A2: ELEMENTARY CONVERSATION
  // ==========================================================================
  {
    id: 'listen-a2-01',
    title: 'Daily Commute',
    difficulty: 'A2',
    category: 'Transportation',
    transcript: 'I usually go to work by bus to avoid heavy traffic.',
    translation: 'Tôi thường đi làm bằng xe buýt để tránh kẹt xe đông đúc.',
    durationSeconds: 5,
    modes: ['dictation', 'shadowing'],
    tags: ['commute', 'traffic'],
    vocabulary: [
      { targetText: 'usually', translation: 'thường xuyên', phonetic: '/ˈjuː.ʒu.ə.li/' },
      { targetText: 'traffic', translation: 'giao thông', phonetic: '/ˈtræf.ɪk/' },
    ],
  },
  {
    id: 'listen-a2-02',
    title: 'Weekend Escape',
    difficulty: 'A2',
    category: 'Travel & Leisure',
    transcript: 'We are planning a relaxing trip to the mountains next weekend.',
    translation: 'Chúng tôi đang lên kế hoạch cho một chuyến đi thư giãn đến vùng núi vào cuối tuần tới.',
    durationSeconds: 6,
    modes: ['dictation', 'shadowing'],
    tags: ['travel', 'vacation'],
    vocabulary: [
      { targetText: 'planning', translation: 'lên kế hoạch', phonetic: '/ˈplæn.ɪŋ/' },
      { targetText: 'mountains', translation: 'vùng núi', phonetic: '/ˈmaʊn.tɪnz/' },
    ],
  },
  {
    id: 'listen-a2-03',
    title: 'Coffee Break Routine',
    difficulty: 'A2',
    category: 'Daily Routine',
    transcript: 'Could I have a cup of black coffee with a splash of milk?',
    translation: 'Cho tôi một tách cà phê đen với một chút sữa được không?',
    durationSeconds: 5,
    modes: ['dictation', 'shadowing'],
    tags: ['cafe', 'ordering'],
    vocabulary: [
      { targetText: 'coffee', translation: 'cà phê', phonetic: '/ˈkɒf.i/' },
      { targetText: 'splash', translation: 'một lượng nhỏ', phonetic: '/splæʃ/' },
    ],
  },

  // ==========================================================================
  // LEVEL B1: INTERMEDIATE FLUENCY
  // ==========================================================================
  {
    id: 'listen-b1-01',
    title: 'Environmental Responsibility',
    difficulty: 'B1',
    category: 'Environment',
    transcript: 'Reducing plastic consumption is essential for preserving our marine ecosystem.',
    translation: 'Giảm thiểu việc tiêu thụ đồ nhựa là điều cần thiết để bảo tồn hệ sinh thái biển của chúng ta.',
    durationSeconds: 7,
    modes: ['dictation', 'shadowing'],
    tags: ['environment', 'sustainability'],
    vocabulary: [
      { targetText: 'consumption', translation: 'sự tiêu thụ', phonetic: '/kənˈsʌmp.ʃən/' },
      { targetText: 'ecosystem', translation: 'hệ sinh thái', phonetic: '/ˈiː.kəʊˌsɪs.təm/' },
      { targetText: 'preserving', translation: 'bảo tồn', phonetic: '/prɪˈzɜː.vɪŋ/' },
    ],
  },
  {
    id: 'listen-b1-02',
    title: 'Technological Innovation',
    difficulty: 'B1',
    category: 'Technology',
    transcript: 'Artificial intelligence is transforming how people communicate and collaborate across global teams.',
    translation: 'Trí tuệ nhân tạo đang thay đổi cách mọi người giao tiếp và cộng tác trong các đội ngũ toàn cầu.',
    durationSeconds: 8,
    modes: ['dictation', 'shadowing'],
    tags: ['ai', 'collaboration'],
    vocabulary: [
      { targetText: 'artificial', translation: 'nhân tạo', phonetic: '/ˌɑː.tɪˈfɪʃ.əl/' },
      { targetText: 'collaborate', translation: 'cộng tác', phonetic: '/kəˈlæb.ə.reɪt/' },
      { targetText: 'transforming', translation: 'chuyển đổi', phonetic: '/trænsˈfɔː.mɪŋ/' },
    ],
  },
];
