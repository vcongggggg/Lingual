import { MASTER_SPEAKING_PROMPTS } from '../apps/api/src/routes/speakingData.js';

console.log('Total Speaking Prompts:', MASTER_SPEAKING_PROMPTS.length);
const byMode: Record<string, number> = {};
const byCefr: Record<string, number> = {};
for (const p of MASTER_SPEAKING_PROMPTS) {
  byMode[p.mode] = (byMode[p.mode] || 0) + 1;
  byCefr[p.cefr] = (byCefr[p.cefr] || 0) + 1;
}
console.log('By Mode:', byMode);
console.log('By CEFR:', byCefr);
