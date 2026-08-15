/**
 * Writing Feedback Provider Abstraction
 * Allows pluggable analysis engines (Local Heuristic Engine vs Future Remote AI / LLM).
 */

import {
  WritingSubmission,
  WritingPrompt,
  WritingResult,
  WritingCorrection,
  WritingVocabularySuggestion,
} from '@linguaflow/domain';
import { WritingAnalysisEngine } from './analyzeWriting';

export interface WritingFeedbackProvider {
  analyzeSubmission(submission: WritingSubmission, prompt?: WritingPrompt): Promise<WritingResult>;
  generateCorrections(submission: WritingSubmission, prompt?: WritingPrompt): Promise<WritingCorrection[]>;
  generateVocabularySuggestions(
    submission: WritingSubmission,
    prompt?: WritingPrompt
  ): Promise<WritingVocabularySuggestion[]>;
}

export class LocalWritingFeedbackProvider implements WritingFeedbackProvider {
  public async analyzeSubmission(
    submission: WritingSubmission,
    prompt?: WritingPrompt
  ): Promise<WritingResult> {
    return WritingAnalysisEngine.analyze({ submission, prompt });
  }

  public async generateCorrections(
    submission: WritingSubmission,
    prompt?: WritingPrompt
  ): Promise<WritingCorrection[]> {
    const result = WritingAnalysisEngine.analyze({ submission, prompt });
    return result.corrections;
  }

  public async generateVocabularySuggestions(
    submission: WritingSubmission,
    prompt?: WritingPrompt
  ): Promise<WritingVocabularySuggestion[]> {
    const result = WritingAnalysisEngine.analyze({ submission, prompt });
    return result.vocabularySuggestions;
  }
}

// Export default singleton instance
export const writingFeedbackProvider: WritingFeedbackProvider = new LocalWritingFeedbackProvider();
