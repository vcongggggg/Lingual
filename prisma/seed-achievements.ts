import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CATALOG_ACHIEVEMENTS = [
  { code: 'first_word', nameKey: 'achievement.first_word', icon: '🌱', xpBonus: 10 },
  { code: 'first_game', nameKey: 'achievement.first_game', icon: '🎮', xpBonus: 10 },
  { code: 'first_lesson', nameKey: 'achievement.first_lesson', icon: '✨', xpBonus: 10 },
  { code: 'words_100', nameKey: 'achievement.words_100', icon: '📖', xpBonus: 50 },
  { code: 'words_500', nameKey: 'achievement.words_500', icon: '📚', xpBonus: 100 },
  { code: 'words_1000', nameKey: 'achievement.words_1000', icon: '🎓', xpBonus: 200 },
  { code: 'srs_500', nameKey: 'achievement.srs_500', icon: '🧠', xpBonus: 100 },
  { code: 'streak_3', nameKey: 'achievement.streak_3', icon: '🔥', xpBonus: 30 },
  { code: 'streak_7', nameKey: 'achievement.streak_7', icon: '⚡', xpBonus: 70 },
  { code: 'streak_30', nameKey: 'achievement.streak_30', icon: '🌟', xpBonus: 300 },
  { code: 'game_win_10', nameKey: 'achievement.game_win_10', icon: '🏆', xpBonus: 50 },
  { code: 'game_master', nameKey: 'achievement.game_master', icon: '👑', xpBonus: 100 },
  { code: 'daily_goal_7', nameKey: 'achievement.daily_goal_7', icon: '🎯', xpBonus: 70 },
  { code: 'xp_1000', nameKey: 'achievement.xp_1000', icon: '💎', xpBonus: 100 },
  { code: 'ielts_first', nameKey: 'achievement.ielts_first', icon: '📝', xpBonus: 50 },
  { code: 'ielts_band7', nameKey: 'achievement.ielts_band7', icon: '🎖️', xpBonus: 150 },
];

export async function seedAchievements() {
  console.log(`Seeding ${CATALOG_ACHIEVEMENTS.length} official achievements into database...`);
  for (const ach of CATALOG_ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: {
        nameKey: ach.nameKey,
        icon: ach.icon,
        xpBonus: ach.xpBonus,
      },
      create: {
        code: ach.code,
        nameKey: ach.nameKey,
        icon: ach.icon,
        xpBonus: ach.xpBonus,
      },
    });
  }
  console.log(`Successfully seeded ${CATALOG_ACHIEVEMENTS.length} achievements.`);
}

if (process.argv[1]?.includes('seed-achievements')) {
  seedAchievements()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
