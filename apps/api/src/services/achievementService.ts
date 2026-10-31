import { prisma } from '../lib/prisma.js';
import { NotificationType } from '@prisma/client';

export interface AchievementDefinition {
  code: string;
  nameKey: string;
  icon: string;
  xpBonus: number;
  target: number;
  nameVi: string;
  descriptionVi: string;
}

export const CATALOG_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    code: 'first_word',
    nameKey: 'achievement.first_word',
    icon: '🌱',
    xpBonus: 10,
    target: 1,
    nameVi: 'Từ vựng đầu tiên',
    descriptionVi: 'Học từ vựng đầu tiên trong hệ thống',
  },
  {
    code: 'first_game',
    nameKey: 'achievement.first_game',
    icon: '🎮',
    xpBonus: 10,
    target: 1,
    nameVi: 'Trò chơi đầu tiên',
    descriptionVi: 'Hoàn thành mini-game đầu tiên',
  },
  {
    code: 'first_lesson',
    nameKey: 'achievement.first_lesson',
    icon: '✨',
    xpBonus: 10,
    target: 1,
    nameVi: 'Bài học đầu tiên',
    descriptionVi: 'Hoàn thành bài học đầu tiên trong lộ trình',
  },
  {
    code: 'words_100',
    nameKey: 'achievement.words_100',
    icon: '📖',
    xpBonus: 50,
    target: 100,
    nameVi: 'Vốn từ 100',
    descriptionVi: 'Tích lũy 100 từ vựng vào kho từ của bạn',
  },
  {
    code: 'words_500',
    nameKey: 'achievement.words_500',
    icon: '📚',
    xpBonus: 100,
    target: 500,
    nameVi: 'Vốn từ 500',
    descriptionVi: 'Tích lũy 500 từ vựng phong phú',
  },
  {
    code: 'words_1000',
    nameKey: 'achievement.words_1000',
    icon: '🎓',
    xpBonus: 200,
    target: 1000,
    nameVi: 'Bậc thầy từ vựng 1000',
    descriptionVi: 'Chinh phục cột mốc 1000 từ vựng',
  },
  {
    code: 'srs_500',
    nameKey: 'achievement.srs_500',
    icon: '🧠',
    xpBonus: 100,
    target: 500,
    nameVi: 'Chiến binh ghi nhớ 500',
    descriptionVi: 'Hoàn thành 500 lượt ôn tập lặp lại ngắt quãng (SRS)',
  },
  {
    code: 'streak_3',
    nameKey: 'achievement.streak_3',
    icon: '🔥',
    xpBonus: 30,
    target: 3,
    nameVi: 'Ngọn lửa 3 ngày',
    descriptionVi: 'Duy trì chuỗi học tập liên tục 3 ngày',
  },
  {
    code: 'streak_7',
    nameKey: 'achievement.streak_7',
    icon: '⚡',
    xpBonus: 70,
    target: 7,
    nameVi: 'Ý chí 7 ngày',
    descriptionVi: 'Duy trì chuỗi học tập liên tục 1 tuần trọn vẹn',
  },
  {
    code: 'streak_30',
    nameKey: 'achievement.streak_30',
    icon: '🌟',
    xpBonus: 300,
    target: 30,
    nameVi: 'Thói quen vàng 30 ngày',
    descriptionVi: 'Duy trì chuỗi học tập kiên định 30 ngày',
  },
  {
    code: 'game_win_10',
    nameKey: 'achievement.game_win_10',
    icon: '🏆',
    xpBonus: 50,
    target: 10,
    nameVi: 'Thần đồng trò chơi',
    descriptionVi: 'Giành chiến thắng trong 10 mini-game',
  },
  {
    code: 'game_master',
    nameKey: 'achievement.game_master',
    icon: '👑',
    xpBonus: 100,
    target: 6,
    nameVi: 'Bậc thầy mọi trò chơi',
    descriptionVi: 'Trải nghiệm đủ cả 6 thể loại mini-game trong LinguaFlow',
  },
  {
    code: 'daily_goal_7',
    nameKey: 'achievement.daily_goal_7',
    icon: '🎯',
    xpBonus: 70,
    target: 7,
    nameVi: 'Mục tiêu kiên định',
    descriptionVi: 'Ghi nhận hoạt động học tập trong 7 ngày',
  },
  {
    code: 'xp_1000',
    nameKey: 'achievement.xp_1000',
    icon: '💎',
    xpBonus: 100,
    target: 1000,
    nameVi: 'Cột mốc 1000 XP',
    descriptionVi: 'Tích lũy đạt mốc 1000 kinh nghiệm',
  },
  {
    code: 'ielts_first',
    nameKey: 'achievement.ielts_first',
    icon: '📝',
    xpBonus: 50,
    target: 1,
    nameVi: 'Thử sức kỳ thi',
    descriptionVi: 'Hoàn thành bài thi thử IELTS hoặc bài kiểm tra đầu tiên',
  },
  {
    code: 'ielts_band7',
    nameKey: 'achievement.ielts_band7',
    icon: '🎖️',
    xpBonus: 150,
    target: 7,
    nameVi: 'Chiến binh Band 7.0+',
    descriptionVi: 'Đạt điểm thi IELTS từ 7.0 trở lên',
  },
];

const VALID_GAME_TYPES = [
  'word_match',
  'sentence_scramble',
  'typing_race',
  'fill_blitz',
  'lingo_wordle',
  'sound_reflex',
];

export interface UserMetrics {
  wordCount: number;
  totalGamesPlayed: number;
  totalWins: number;
  distinctGameTypesCount: number;
  lessonsCompleted: number;
  srsReviewCount: number;
  currentStreak: number;
  dailyGoalCount: number;
  totalXP: number;
  ieltsAttemptCount: number;
  maxIeltsBand: number;
}

export interface AchievementProgressItem {
  id: string;
  code: string;
  nameKey: string;
  icon: string;
  xpBonus: number;
  nameVi: string;
  descriptionVi: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: {
    current: number;
    target: number;
    percent: number;
  };
}

export class AchievementService {
  private static instance: AchievementService;

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  /**
   * Tính toán metrics từ dữ liệu thật trong DB (không lưu counter riêng)
   */
  public async getUserMetrics(userId: string): Promise<UserMetrics> {
    const [
      user,
      wordCount,
      gameStats,
      gameSessionsCount,
      lessonProgressCount,
      attemptSessionsCount,
      srsReviewCount,
      dailyGoalCount,
      ieltsAttempts,
      examAttempts,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { totalXP: true, currentStreak: true },
      }),
      prisma.userWordState.count({
        where: { userId },
      }),
      prisma.userGameStat.findMany({
        where: { userId },
      }),
      prisma.gameSession.count({
        where: { userId },
      }),
      prisma.userLessonProgress.count({
        where: { userId, completed: true },
      }),
      prisma.attemptSession.count({
        where: { userId, completedAt: { not: null } },
      }),
      prisma.srsReviewLog.count({
        where: { userId },
      }),
      prisma.dailyActivityLog.count({
        where: { userId },
      }),
      prisma.ieltsMockAttempt.findMany({
        where: { userId },
        select: { bandScoreJson: true },
      }),
      prisma.examAttempt.findMany({
        where: { userId, status: 'completed' },
        select: { resultJson: true },
      }),
    ]);

    // Game stats aggregation
    let totalGamesPlayed = gameStats.reduce((sum, s) => sum + s.totalGamesPlayed, 0);
    if (totalGamesPlayed < gameSessionsCount) {
      totalGamesPlayed = gameSessionsCount;
    }
    const totalWins = gameStats.reduce((sum, s) => sum + s.totalWins, 0);

    const playedGameTypes = new Set(
      gameStats.filter((s) => s.totalGamesPlayed > 0 && VALID_GAME_TYPES.includes(s.gameType)).map((s) => s.gameType)
    );
    const distinctGameTypesCount = playedGameTypes.size;

    // Lessons completed
    const lessonsCompleted = Math.max(lessonProgressCount, attemptSessionsCount);

    // IELTS & Exams
    const ieltsAttemptCount = ieltsAttempts.length + examAttempts.length;

    let maxIeltsBand = 0;
    for (const attempt of ieltsAttempts) {
      try {
        if (attempt.bandScoreJson) {
          const parsed = JSON.parse(attempt.bandScoreJson);
          if (typeof parsed === 'object' && parsed !== null) {
            const overall = Number(parsed.overall);
            if (!isNaN(overall) && overall > maxIeltsBand) {
              maxIeltsBand = overall;
            }
            // Check individual skills if overall not present
            for (const key of ['listening', 'reading', 'writing', 'speaking']) {
              const val = Number(parsed[key]);
              if (!isNaN(val) && val > maxIeltsBand) {
                maxIeltsBand = val;
              }
            }
          }
        }
      } catch {
        // Ignore json parse error
      }
    }

    for (const attempt of examAttempts) {
      try {
        if (attempt.resultJson) {
          const parsed = JSON.parse(attempt.resultJson);
          if (typeof parsed === 'object' && parsed !== null) {
            const band = Number(parsed.band || parsed.score || parsed.overallBand);
            if (!isNaN(band) && band > maxIeltsBand) {
              maxIeltsBand = band;
            }
          }
        }
      } catch {
        // Ignore json parse error
      }
    }

    return {
      wordCount,
      totalGamesPlayed,
      totalWins,
      distinctGameTypesCount,
      lessonsCompleted,
      srsReviewCount,
      currentStreak: user?.currentStreak || 0,
      dailyGoalCount,
      totalXP: user?.totalXP || 0,
      ieltsAttemptCount,
      maxIeltsBand,
    };
  }

  /**
   * Tính giá trị current cho 1 mã huy hiệu cụ thể dựa trên metrics
   */
  public getCurrentValue(code: string, metrics: UserMetrics): number {
    switch (code) {
      case 'first_word':
      case 'words_100':
      case 'words_500':
      case 'words_1000':
        return metrics.wordCount;
      case 'first_game':
        return metrics.totalGamesPlayed;
      case 'game_win_10':
        return metrics.totalWins;
      case 'game_master':
        return metrics.distinctGameTypesCount;
      case 'first_lesson':
        return metrics.lessonsCompleted;
      case 'srs_500':
        return metrics.srsReviewCount;
      case 'streak_3':
      case 'streak_7':
      case 'streak_30':
        return metrics.currentStreak;
      case 'daily_goal_7':
        return metrics.dailyGoalCount;
      case 'xp_1000':
        return metrics.totalXP;
      case 'ielts_first':
        return metrics.ieltsAttemptCount;
      case 'ielts_band7':
        return metrics.maxIeltsBand;
      default:
        return 0;
    }
  }

  /**
   * Đánh giá và mở khóa huy hiệu cho người dùng
   * Đảm bảo Idempotent 100%: bắt lỗi Prisma P2002, không tạo trùng và không cộng dồn XP lặp
   */
  public async evaluate(userId: string, options?: { skipNotification?: boolean }): Promise<AchievementDefinition[]> {
    const [dbAchievements, userAchievements, metrics] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true },
      }),
      this.getUserMetrics(userId),
    ]);

    const unlockedAchievementIds = new Set(userAchievements.map((ua) => ua.achievementId));
    const newlyUnlocked: AchievementDefinition[] = [];

    for (const def of CATALOG_ACHIEVEMENTS) {
      const dbAch = dbAchievements.find((a) => a.code === def.code);
      if (!dbAch) continue;

      if (unlockedAchievementIds.has(dbAch.id)) {
        continue;
      }

      const current = this.getCurrentValue(def.code, metrics);
      if (current >= def.target) {
        try {
          // Idempotent Transaction: Tạo UserAchievement & tăng XP
          await prisma.$transaction(async (tx) => {
            await tx.userAchievement.create({
              data: {
                userId,
                achievementId: dbAch.id,
              },
            });

            await tx.user.update({
              where: { id: userId },
              data: {
                totalXP: { increment: dbAch.xpBonus },
              },
            });
          });

          newlyUnlocked.push(def);
          unlockedAchievementIds.add(dbAch.id);
        } catch (err: any) {
          // P2002: Unique constraint violation (đã mở ở tiến trình khác) -> Idempotent bỏ qua an toàn
          if (err.code === 'P2002') {
            continue;
          }
          console.error(`[AchievementService] Error unlocking ${def.code} for user ${userId}:`, err);
        }
      }
    }

    // Gửi thông báo (Notification) nếu có huy hiệu mới mở khóa
    if (!options?.skipNotification && newlyUnlocked.length > 0) {
      try {
        if (newlyUnlocked.length === 1) {
          const ach = newlyUnlocked[0];
          await prisma.notification.create({
            data: {
              userId,
              type: NotificationType.ACHIEVEMENT,
              title: `Mở khóa huy hiệu: ${ach.icon} ${ach.nameVi}`,
              body: `Chúc mừng bạn đã đạt huy hiệu "${ach.nameVi}" và nhận +${ach.xpBonus} XP!`,
              deepLink: '/achievements',
              dedupeKey: `ach_${userId}_${ach.code}`,
              metadata: { code: ach.code, xpBonus: ach.xpBonus },
            },
          });
        } else {
          // Spec: Backfill gom tối đa 1 notification nếu mở nhiều huy hiệu cùng lúc
          const totalBonus = newlyUnlocked.reduce((sum, a) => sum + a.xpBonus, 0);
          const iconSummary = newlyUnlocked.map((a) => a.icon).join(' ');
          await prisma.notification.create({
            data: {
              userId,
              type: NotificationType.ACHIEVEMENT,
              title: `Mở khóa ${newlyUnlocked.length} huy hiệu mới 🎉`,
              body: `Chúc mừng bạn đã mở khóa ${newlyUnlocked.length} huy hiệu (${iconSummary}) và nhận thưởng +${totalBonus} XP!`,
              deepLink: '/achievements',
              dedupeKey: `ach_batch_${userId}_${Date.now()}`,
              metadata: {
                codes: newlyUnlocked.map((a) => a.code),
                totalBonus,
              },
            },
          });
        }
      } catch (notifErr: any) {
        // Không để lỗi tạo notification làm đứt flow chính
        console.warn('[AchievementService] Failed to create achievement notification:', notifErr?.message);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Lấy danh sách đầy đủ tất cả huy hiệu kèm tiến độ hiện tại của người dùng
   */
  public async getUserAchievements(userId: string): Promise<AchievementProgressItem[]> {
    // Lazy evaluate để backfill hoặc cập nhật trạng thái mới nhất
    await this.evaluate(userId);

    const [dbAchievements, userAchievements, metrics] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({
        where: { userId },
      }),
      this.getUserMetrics(userId),
    ]);

    const unlockMap = new Map<string, Date>();
    for (const ua of userAchievements) {
      unlockMap.set(ua.achievementId, ua.unlockedAt);
    }

    const items: AchievementProgressItem[] = [];

    for (const def of CATALOG_ACHIEVEMENTS) {
      const dbAch = dbAchievements.find((a) => a.code === def.code);
      const isUnlocked = dbAch ? unlockMap.has(dbAch.id) : false;
      const unlockedAt = dbAch && unlockMap.has(dbAch.id) ? unlockMap.get(dbAch.id)!.toISOString() : null;

      const current = this.getCurrentValue(def.code, metrics);
      const target = def.target;
      const percent = Math.min(100, Math.round((current / target) * 100));

      items.push({
        id: dbAch?.id || def.code,
        code: def.code,
        nameKey: def.nameKey,
        icon: def.icon,
        xpBonus: dbAch?.xpBonus ?? def.xpBonus,
        nameVi: def.nameVi,
        descriptionVi: def.descriptionVi,
        unlocked: isUnlocked,
        unlockedAt,
        progress: {
          current,
          target,
          percent,
        },
      });
    }

    return items;
  }

  /**
   * Lấy tóm tắt huy hiệu người dùng: unlockedCount, totalCount, bonusXpEarned
   */
  public async getSummary(userId: string): Promise<{
    unlockedCount: number;
    totalCount: number;
    bonusXpEarned: number;
  }> {
    const list = await this.getUserAchievements(userId);
    const unlocked = list.filter((item) => item.unlocked);
    const bonusXpEarned = unlocked.reduce((sum, item) => sum + item.xpBonus, 0);

    return {
      unlockedCount: unlocked.length,
      totalCount: list.length,
      bonusXpEarned,
    };
  }
}

export const achievementService = AchievementService.getInstance();
