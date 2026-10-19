import { MASTER_WRITING_PROMPTS } from '../apps/api/src/data/writingExpandedData.js';

console.log('Total Writing Prompts:', MASTER_WRITING_PROMPTS.length);
const byMode: Record<string, number> = {};
const byDiff: Record<string, number> = {};
for (const p of MASTER_WRITING_PROMPTS) {
  byMode[p.mode] = (byMode[p.mode] || 0) + 1;
  byDiff[p.difficulty] = (byDiff[p.difficulty] || 0) + 1;
}
console.log('By Mode:', byMode);
console.log('By Difficulty:', byDiff);
