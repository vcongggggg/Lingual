/**
 * Exam SRS Adapter
 * Bridges exam performance and missed vocabulary with SM-2 Spaced Repetition.
 */

import { mapExamPerformanceToSRSQuality } from '@linguaflow/domain';
import { srsApi, vocabularyApi } from '@/lib/api';

export interface ExamVocabularyCandidate {
  wordId: string;
  word: string;
  meaning: string;
  phonetic?: string;
  cefrLevel?: string;
  exampleSentence?: string;
}

// Built-in lookup map for sample exam vocabularies
const EXAM_VOCAB_DB: Record<string, ExamVocabularyCandidate> = {
  'vocab-adjust': {
    wordId: 'vocab-adjust',
    word: 'Adjust',
    phonetic: '/əˈdʒʌst/',
    meaning: 'Điều chỉnh, căn chỉnh cho phù hợp',
    cefrLevel: 'B1',
    exampleSentence: 'He adjusted his necktie in front of the mirror.',
  },
  'vocab-necktie': {
    wordId: 'vocab-necktie',
    word: 'Necktie',
    phonetic: '/ˈnek.taɪ/',
    meaning: 'Cà vạt',
    cefrLevel: 'A2',
    exampleSentence: 'A customer is choosing a silk necktie.',
  },
  'vocab-evaluation': {
    wordId: 'vocab-evaluation',
    word: 'Evaluation',
    phonetic: '/ɪˌvæl.juˈeɪ.ʃən/',
    meaning: 'Sự đánh giá, bản nhận xét hiệu suất làm việc',
    cefrLevel: 'B2',
    exampleSentence: 'Employee evaluations are due by Friday afternoon.',
  },
  'vocab-deadline': {
    wordId: 'vocab-deadline',
    word: 'Deadline',
    phonetic: '/ˈded.laɪn/',
    meaning: 'Hạn chót hoàn thành công việc',
    cefrLevel: 'B1',
    exampleSentence: 'The submission deadline is strictly enforced.',
  },
  'vocab-productivity': {
    wordId: 'vocab-productivity',
    word: 'Productivity',
    phonetic: '/ˌprɒd.ʌkˈtɪv.ə.ti/',
    meaning: 'Năng suất, hiệu suất lao động',
    cefrLevel: 'B1',
    exampleSentence: 'Automation greatly increased warehouse productivity.',
  },
  'vocab-warranty': {
    wordId: 'vocab-warranty',
    word: 'Warranty',
    phonetic: '/ˈwɒr.ən.ti/',
    meaning: 'Chính sách bảo hành sản phẩm',
    cefrLevel: 'B2',
    exampleSentence: 'The two-year warranty covers all electronic defects.',
  },
  'vocab-negligence': {
    wordId: 'vocab-negligence',
    word: 'Negligence',
    phonetic: '/ˈneɡ.lɪ.dʒəns/',
    meaning: 'Sự bất cẩn, sự tắc trách gây thiệt hại',
    cefrLevel: 'C1',
    exampleSentence: 'Damage caused by deliberate negligence is excluded.',
  },
  'vocab-pollinator': {
    wordId: 'vocab-pollinator',
    word: 'Pollinator',
    phonetic: '/ˈpɒl.ə.neɪ.tər/',
    meaning: 'Động vật thụ phấn (ong, bướm)',
    cefrLevel: 'B2',
    exampleSentence: 'Wild pollinators are essential for agricultural crops.',
  },
  'vocab-pesticide': {
    wordId: 'vocab-pesticide',
    word: 'Pesticide',
    phonetic: '/ˈpes.tɪ.saɪd/',
    meaning: 'Thuốc trừ sâu, hóa chất bảo vệ thực vật',
    cefrLevel: 'B2',
    exampleSentence: 'Organic gardens avoid using synthetic pesticides.',
  },
  'vocab-veracity': {
    wordId: 'vocab-veracity',
    word: 'Veracity',
    phonetic: '/vəˈræs.ə.ti/',
    meaning: 'Tính xác thực, sự chân thực của thông tin',
    cefrLevel: 'C1',
    exampleSentence: 'Historical researchers verified the veracity of the claims.',
  },
};

export function getExamVocabularyCandidate(vocabId: string): ExamVocabularyCandidate {
  if (EXAM_VOCAB_DB[vocabId]) {
    return EXAM_VOCAB_DB[vocabId];
  }

  const clean = vocabId.replace('vocab-', '');
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    wordId: vocabId,
    word: capitalized,
    meaning: `Từ vựng từ bài thi: ${capitalized}`,
    cefrLevel: 'B1',
  };
}

export async function saveExamVocabularyToSRS(vocabId: string): Promise<boolean> {
  const candidate = getExamVocabularyCandidate(vocabId);
  try {
    // 1. Add to active SM-2 SRS queue
    await srsApi.addWord({
      targetText: candidate.word,
      translation: candidate.meaning,
      phonetic: candidate.phonetic,
      cefrLevel: candidate.cefrLevel || 'B1',
      exampleSentence: candidate.exampleSentence,
    });

    // 2. Save into personal vocabulary collection
    await vocabularyApi.saveWord({
      wordId: candidate.wordId,
      targetText: candidate.word,
      translation: candidate.meaning,
      phonetic: candidate.phonetic,
      cefrLevel: candidate.cefrLevel || 'B1',
    });

    return true;
  } catch {
    return false;
  }
}
