import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'word';
}

async function main() {
  const wordsWithoutAudio = await prisma.vocabulary.findMany({
    where: { audioUrl: null },
    select: { id: true, targetText: true },
  });

  console.log(`Found ${wordsWithoutAudio.length} words in DB without audioUrl. Updating...`);
  for (const item of wordsWithoutAudio) {
    const slug = slugify(item.targetText);
    await prisma.vocabulary.update({
      where: { id: item.id },
      data: { audioUrl: `/audio/vocab/${slug}.mp3` },
    });
  }

  console.log('Updated all words without audioUrl!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
