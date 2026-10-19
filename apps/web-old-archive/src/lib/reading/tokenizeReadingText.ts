/**
 * Web Reading Text Tokenization Utility
 */

import { tokenizeReadingText as domainTokenize } from '@linguaflow/domain';

export function tokenizeReadingText(text: string): string[] {
  return domainTokenize(text);
}
