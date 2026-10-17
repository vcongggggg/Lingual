/**
 * Deterministic Writing Analyzer Engine
 * Provides local pedagogical evaluation and feedback for student writing.
 */

import {
  evaluateWritingSubmission,
  WritingSubmission,
  WritingPrompt,
  WritingResult,
} from '@linguaflow/domain';

export interface WritingAnalysisOptions {
  submission: WritingSubmission;
  prompt?: WritingPrompt;
}

export class WritingAnalysisEngine {
  /**
   * Deterministically analyzes writing submission and returns comprehensive feedback
   */
  public static analyze(options: WritingAnalysisOptions): WritingResult {
    return evaluateWritingSubmission(options.submission, options.prompt);
  }
}
