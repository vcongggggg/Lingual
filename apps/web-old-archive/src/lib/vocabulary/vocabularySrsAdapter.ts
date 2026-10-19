/**
 * SRS Adapter for Smart Vocabulary Practice
 * Pure integration bridge translating practice results into existing SM-2 Spaced Repetition contracts.
 */

import { mapPracticeQualityToSM2, EvaluatedQuestionResult } from '@linguaflow/domain';
import { srsApi } from '@/lib/api';

export async function syncVocabularyPracticeWithSRS(
  evaluatedQuestions: EvaluatedQuestionResult[]
): Promise<{ syncedCount: number; errors: any[] }> {
  let syncedCount = 0;
  const errors: any[] = [];

  for (const eq of evaluatedQuestions) {
    try {
      const quality = eq.sm2Quality || mapPracticeQualityToSM2(eq.isCorrect);
      await srsApi.submitReview(eq.wordId, quality);
      syncedCount++;
    } catch (err) {
      errors.push({ wordId: eq.wordId, error: err });
    }
  }

  return { syncedCount, errors };
}

export async function addWordToSrsDeck(word: {
  targetText: string;
  translation?: string;
  phonetic?: string;
  exampleSentence?: string;
  cefrLevel?: string;
}): Promise<boolean> {
  try {
    await srsApi.addWord(word);
    return true;
  } catch {
    return false;
  }
}
