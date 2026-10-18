import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.vocabulary.count();
  const byCefr = await prisma.vocabulary.groupBy({
    by: ['cefrLevel'],
    _count: { id: true },
  });

  const withAudio = await prisma.vocabulary.count({
    where: { audioUrl: { not: null } },
  });

  const withExample = await prisma.vocabulary.count({
    where: { exampleSentence: { not: null } },
  });

  console.log('====================================');
  console.log(`TOTAL VOCABULARIES IN DB: ${total}`);
  console.log(`VOCABULARIES WITH AUDIO: ${withAudio}`);
  console.log(`VOCABULARIES WITH EXAMPLES: ${withExample}`);
  console.log('CEFR BREAKDOWN:');
  const cefrOrder: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  byCefr
    .sort((a, b) => (cefrOrder[a.cefrLevel] || 99) - (cefrOrder[b.cefrLevel] || 99))
    .forEach((c) => {
      console.log(`  ${c.cefrLevel}: ${c._count.id}`);
    });
  console.log('====================================');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
