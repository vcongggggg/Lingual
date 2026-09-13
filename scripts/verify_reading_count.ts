import { MASTER_READING_ARTICLES } from '../apps/api/src/data/reading.js';

console.log('Total Reading Articles:', MASTER_READING_ARTICLES.length);
const byLevel: Record<string, number> = {};
for (const a of MASTER_READING_ARTICLES) {
  byLevel[a.level] = (byLevel[a.level] || 0) + 1;
}
console.log('Articles by Level:', byLevel);
