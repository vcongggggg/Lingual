/**
 * Dictation Text Evaluation Utility for LinguaFlow Listening Lab
 * Pure deterministic token diff without external AI / LLM dependencies.
 */

import {
  evaluateDictation as domainEvaluateDictation,
  normalizeListeningText,
  DictationResult,
  WordComparisonToken,
  WordDiffStatus,
} from '@linguaflow/domain';

export type { DictationResult, WordComparisonToken, WordDiffStatus };
export { normalizeListeningText };

export function compareDictation(expectedText: string, submittedText: string): DictationResult {
  return domainEvaluateDictation(expectedText, submittedText);
}
