import { prisma } from '../apps/api/src/lib/prisma.js';
import { SEED_UNITS } from '../prisma/seed.js';
import { SEED_IELTS_QUESTIONS } from '../prisma/seed-ielts.js';

async function main() {
  const unitsCount = await prisma.unit.count();
  const lessonsCount = await prisma.lesson.count();
  const ieltsQuestionsCount = await prisma.ieltsQuestion.count();
  const usersCount = await prisma.user.count();

  const seedUnits = SEED_UNITS.length;
  const seedLessons = SEED_UNITS.flatMap((u) => u.lessons).length;
  const seedWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words));
  const distinctSeedWords = new Set(seedWords.map((w) => w.targetText.toLowerCase()));

  console.log('REAL COUNTS:');
  console.log(JSON.stringify({
    dbUnits: unitsCount,
    dbLessons: lessonsCount,
    dbIeltsQuestions: ieltsQuestionsCount,
    dbUsers: usersCount,
    seedUnits,
    seedLessons,
    seedWordsTotal: seedWords.length,
    seedWordsDistinct: distinctSeedWords.size,
    seedIeltsQuestions: SEED_IELTS_QUESTIONS.length,
  }, null, 2));

  process.exit(0);
}

main().catch(console.error);
