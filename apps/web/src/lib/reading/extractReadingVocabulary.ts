/**
 * Deterministic Reading Vocabulary Extractor and Dictionary Lookup
 */

import { ReadingArticle } from '@linguaflow/domain';

export interface ReadingWordDefinition {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  cefrLevel: string;
  ukAudioUrl?: string;
  usAudioUrl?: string;
}

// Built-in pedagogical dictionary database for interactive popovers
const READING_DICTIONARY_DB: Record<string, ReadingWordDefinition> = {
  coffee: {
    word: 'Coffee',
    phonetic: '/ˈkɒf.i/',
    partOfSpeech: 'Noun',
    meaning: 'Cà phê — thức uống pha từ hạt cà phê rang xay',
    example: 'Every morning I drink hot coffee to stay energized.',
    cefrLevel: 'A1',
  },
  routine: {
    word: 'Routine',
    phonetic: '/ruːˈtiːn/',
    partOfSpeech: 'Noun',
    meaning: 'Thói quen / Quy trình sinh hoạt hàng ngày',
    example: 'A healthy morning routine helps maintain focus.',
    cefrLevel: 'A2',
  },
  energy: {
    word: 'Energy',
    phonetic: '/ˈen.ə.dʒi/',
    partOfSpeech: 'Noun',
    meaning: 'Năng lượng, sức lực và tinh thần hoạt động',
    example: 'Exercise gives your body natural energy.',
    cefrLevel: 'A1',
  },
  library: {
    word: 'Library',
    phonetic: '/ˈlaɪ.brər.i/',
    partOfSpeech: 'Noun',
    meaning: 'Thư viện — nơi lưu giữ và mượn sách',
    example: 'The city library provides quiet study areas.',
    cefrLevel: 'A1',
  },
  sustainable: {
    word: 'Sustainable',
    phonetic: '/səˈsteɪ.nə.bəl/',
    partOfSpeech: 'Adjective',
    meaning: 'Bền vững, bảo vệ môi trường lâu dài',
    example: 'We must adopt sustainable energy solutions.',
    cefrLevel: 'B1',
  },
  ecosystem: {
    word: 'Ecosystem',
    phonetic: '/ˈiː.kəʊˌsɪs.təm/',
    partOfSpeech: 'Noun',
    meaning: 'Hệ sinh thái — quần xã sinh vật và môi trường sống',
    example: 'Marine ecosystems suffer from plastic pollution.',
    cefrLevel: 'B1',
  },
  productivity: {
    word: 'Productivity',
    phonetic: '/ˌprɒd.ʌkˈtɪv.ə.ti/',
    partOfSpeech: 'Noun',
    meaning: 'Năng suất, hiệu quả làm việc',
    example: 'Remote work can boost individual productivity.',
    cefrLevel: 'B1',
  },
  collaboration: {
    word: 'Collaboration',
    phonetic: '/kəˌlæb.əˈreɪ.ʃən/',
    partOfSpeech: 'Noun',
    meaning: 'Sự cộng tác, làm việc nhóm',
    example: 'Team collaboration is vital for modern software.',
    cefrLevel: 'B1',
  },
  neuroplasticity: {
    word: 'Neuroplasticity',
    phonetic: '/ˌnjʊə.rəʊ.plæsˈtɪs.ə.ti/',
    partOfSpeech: 'Noun',
    meaning: 'Tính khả biến thần kinh — khả năng não bộ tái cấu trúc khớp thần kinh',
    example: 'Neuroplasticity allows the adult brain to adapt continually.',
    cefrLevel: 'C1',
  },
  cognitive: {
    word: 'Cognitive',
    phonetic: '/ˈkɒɡ.nə.tɪv/',
    partOfSpeech: 'Adjective',
    meaning: 'Thuộc về nhận thức, tư duy trí tuệ',
    example: 'Language learning strengthens cognitive functions.',
    cefrLevel: 'B2',
  },
};

/**
 * Looks up definition and phonetics for any clicked word token
 */
export function lookupReadingWord(rawWord: string): ReadingWordDefinition {
  const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (READING_DICTIONARY_DB[cleanWord]) {
    return READING_DICTIONARY_DB[cleanWord];
  }

  // Fallback dynamic generator for common words
  const capitalized = rawWord.charAt(0).toUpperCase() + rawWord.slice(1).toLowerCase().replace(/[^a-z0-9]/g, '');
  return {
    word: capitalized || rawWord,
    phonetic: `/${cleanWord}/`,
    partOfSpeech: 'Word',
    meaning: `Từ vựng trong bài đọc: "${capitalized}"`,
    example: `Key reading vocabulary: ${capitalized}`,
    cefrLevel: 'B1',
  };
}

/**
 * Extracts list of useful key vocabulary from an article
 */
export function extractReadingVocabulary(article: ReadingArticle): ReadingWordDefinition[] {
  return (article.vocabularyIds || []).map((vid) => {
    const rawWord = vid.replace('vocab-', '');
    return lookupReadingWord(rawWord);
  });
}
