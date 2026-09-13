import { prisma, isDatabaseConnected } from '../lib/prisma.js';

export interface GameSessionEntity {
  id: string;
  attemptId: string;
  userId: string;
  gameType: string;
  score: number;
  accuracy: number;
  xpEarned: number;
  durationSeconds: number;
  comboMax?: number;
  metadataJson?: string | null;
  createdAt: string;
}

export interface UserGameStatEntity {
  userId: string;
  gameType: string;
  highScore: number;
  totalGamesPlayed: number;
  totalWins: number;
  totalXpEarned: number;
  avgAccuracy: number;
  lastPlayedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId?: string;
  displayName: string;
  xp: number;
  score?: number;
  accuracy: number;
  streak: number;
  avatar: string;
  gameType?: string;
}

// In-Memory Fallback Cache
const MEM_GAME_SESSIONS: GameSessionEntity[] = [];
const MEM_USER_GAME_STATS: Record<string, UserGameStatEntity> = {};

const DEFAULT_HALL_OF_FAME: LeaderboardEntry[] = [
  { rank: 1, displayName: 'Thắng Trí Việt', xp: 2450, score: 980, accuracy: 98, streak: 15, avatar: '👑' },
  { rank: 2, displayName: 'Học Viên Lingual', xp: 1890, score: 850, accuracy: 94, streak: 10, avatar: '🥇' },
  { rank: 3, displayName: 'Minh Anh IELTS', xp: 1650, score: 790, accuracy: 91, streak: 8, avatar: '🥈' },
  { rank: 4, displayName: 'Hoàng Long Code', xp: 1420, score: 720, accuracy: 88, streak: 6, avatar: '🥉' },
  { rank: 5, displayName: 'Khánh Linh', xp: 1200, score: 650, accuracy: 85, streak: 5, avatar: '⭐' },
];

export class GameRepository {
  private static instance: GameRepository;

  public static getInstance(): GameRepository {
    if (!GameRepository.instance) {
      GameRepository.instance = new GameRepository();
    }
    return GameRepository.instance;
  }

  /**
   * Save a game session and update user aggregate game statistics
   */
  public async saveSession(session: {
    attemptId: string;
    userId: string;
    gameType: string;
    score: number;
    accuracy: number;
    xpEarned: number;
    durationSeconds: number;
    comboMax?: number;
    metadataJson?: string;
  }): Promise<GameSessionEntity> {
    const sessionEntity: GameSessionEntity = {
      id: `gs-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      attemptId: session.attemptId,
      userId: session.userId,
      gameType: session.gameType,
      score: session.score,
      accuracy: session.accuracy,
      xpEarned: session.xpEarned,
      durationSeconds: session.durationSeconds,
      comboMax: session.comboMax || 1,
      metadataJson: session.metadataJson || null,
      createdAt: new Date().toISOString(),
    };

    // Always update memory cache
    MEM_GAME_SESSIONS.unshift(sessionEntity);
    this.updateMemoryStats(sessionEntity);

    if (isDatabaseConnected()) {
      try {
        // 1. Save session to DB
        await prisma.gameSession.create({
          data: {
            id: sessionEntity.id,
            attemptId: sessionEntity.attemptId,
            userId: sessionEntity.userId,
            gameType: sessionEntity.gameType,
            score: sessionEntity.score,
            accuracy: sessionEntity.accuracy,
            xpEarned: sessionEntity.xpEarned,
            durationSeconds: sessionEntity.durationSeconds,
            comboMax: sessionEntity.comboMax || 1,
            metadataJson: sessionEntity.metadataJson,
          },
        });

        // 2. Upsert UserGameStat in DB
        const existingStat = await prisma.userGameStat.findUnique({
          where: {
            userId_gameType: {
              userId: session.userId,
              gameType: session.gameType,
            },
          },
        });

        if (existingStat) {
          const newTotal = existingStat.totalGamesPlayed + 1;
          const newAvgAccuracy = Math.round(
            (existingStat.avgAccuracy * existingStat.totalGamesPlayed + session.accuracy) / newTotal
          );
          await prisma.userGameStat.update({
            where: { id: existingStat.id },
            data: {
              highScore: Math.max(existingStat.highScore, session.score),
              totalGamesPlayed: newTotal,
              totalWins: session.accuracy >= 70 ? existingStat.totalWins + 1 : existingStat.totalWins,
              totalXpEarned: existingStat.totalXpEarned + session.xpEarned,
              avgAccuracy: newAvgAccuracy,
              lastPlayedAt: new Date(),
            },
          });
        } else {
          await prisma.userGameStat.create({
            data: {
              userId: session.userId,
              gameType: session.gameType,
              highScore: session.score,
              totalGamesPlayed: 1,
              totalWins: session.accuracy >= 70 ? 1 : 0,
              totalXpEarned: session.xpEarned,
              avgAccuracy: session.accuracy,
              lastPlayedAt: new Date(),
            },
          });
        }

        // 3. Increment User total XP
        await prisma.user.update({
          where: { id: session.userId },
          data: {
            totalXP: {
              increment: session.xpEarned,
            },
          },
        }).catch(() => {
          // Ignore if user id is mock
        });
      } catch (err) {
        console.warn('[GameRepository] DB error while saving game session, retained in memory:', err);
      }
    }

    return sessionEntity;
  }

  private updateMemoryStats(session: GameSessionEntity): void {
    const key = `${session.userId}:${session.gameType}`;
    const existing = MEM_USER_GAME_STATS[key];
    if (existing) {
      const newTotal = existing.totalGamesPlayed + 1;
      existing.highScore = Math.max(existing.highScore, session.score);
      existing.totalWins += session.accuracy >= 70 ? 1 : 0;
      existing.totalXpEarned += session.xpEarned;
      existing.avgAccuracy = Math.round((existing.avgAccuracy * existing.totalGamesPlayed + session.accuracy) / newTotal);
      existing.totalGamesPlayed = newTotal;
      existing.lastPlayedAt = session.createdAt;
    } else {
      MEM_USER_GAME_STATS[key] = {
        userId: session.userId,
        gameType: session.gameType,
        highScore: session.score,
        totalGamesPlayed: 1,
        totalWins: session.accuracy >= 70 ? 1 : 0,
        totalXpEarned: session.xpEarned,
        avgAccuracy: session.accuracy,
        lastPlayedAt: session.createdAt,
      };
    }
  }

  /**
   * Get user stats across all arcade games
   */
  public async getUserStats(userId: string): Promise<UserGameStatEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const stats = await prisma.userGameStat.findMany({
          where: { userId },
        });
        if (stats && stats.length > 0) {
          return stats.map((s) => ({
            userId: s.userId,
            gameType: s.gameType,
            highScore: s.highScore,
            totalGamesPlayed: s.totalGamesPlayed,
            totalWins: s.totalWins,
            totalXpEarned: s.totalXpEarned,
            avgAccuracy: s.avgAccuracy,
            lastPlayedAt: s.lastPlayedAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('[GameRepository] Error fetching user stats from DB:', err);
      }
    }

    // Memory fallback
    return Object.values(MEM_USER_GAME_STATS).filter((s) => s.userId === userId);
  }

  /**
   * Get dynamic leaderboard combining real player sessions and hall of fame
   */
  public async getLeaderboard(gameType?: string, currentUserId?: string): Promise<LeaderboardEntry[]> {
    if (isDatabaseConnected()) {
      try {
        // Query top sessions
        const whereClause = gameType && gameType !== 'all' ? { gameType } : {};
        const sessions = await prisma.gameSession.findMany({
          where: whereClause,
          orderBy: { score: 'desc' },
          take: 20,
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                currentStreak: true,
                totalXP: true,
              },
            },
          },
        });

        if (sessions && sessions.length > 0) {
          const userBestMap = new Map<string, LeaderboardEntry>();

          for (const s of sessions) {
            if (!userBestMap.has(s.userId)) {
              userBestMap.set(s.userId, {
                rank: 0,
                userId: s.userId,
                displayName: s.user?.displayName || 'Người Học Lingual',
                xp: s.user?.totalXP || s.xpEarned,
                score: s.score,
                accuracy: Math.round(s.accuracy),
                streak: s.user?.currentStreak || 1,
                avatar: s.user?.avatarUrl || '⚡',
                gameType: s.gameType,
              });
            }
          }

          const ranked = Array.from(userBestMap.values())
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 10)
            .map((entry, idx) => ({
              ...entry,
              rank: idx + 1,
              avatar: idx === 0 ? '👑' : idx === 1 ? '🥇' : idx === 2 ? '🥈' : idx === 3 ? '🥉' : '⭐',
            }));

          return ranked;
        }
      } catch (err) {
        console.warn('[GameRepository] Error querying DB leaderboard, using fallback:', err);
      }
    }

    // Memory aggregation fallback
    const sessions = gameType && gameType !== 'all'
      ? MEM_GAME_SESSIONS.filter((s) => s.gameType === gameType)
      : MEM_GAME_SESSIONS;

    if (sessions.length > 0) {
      const topMem = sessions.slice(0, 5).map((s, idx) => ({
        rank: idx + 1,
        userId: s.userId,
        displayName: s.userId === currentUserId ? 'Bạn (Hiện tại)' : `Người Học #${s.userId.slice(-4)}`,
        xp: s.xpEarned * 10,
        score: s.score,
        accuracy: Math.round(s.accuracy),
        streak: 3,
        avatar: idx === 0 ? '👑' : '⭐',
        gameType: s.gameType,
      }));

      // Combine with hall of fame to always look populated
      const combined: LeaderboardEntry[] = [...topMem];
      for (const hof of DEFAULT_HALL_OF_FAME) {
        if (!combined.some((c) => c.displayName === hof.displayName)) {
          combined.push({
            ...hof,
            rank: combined.length + 1,
          });
        }
      }
      return combined.slice(0, 10);
    }

    return DEFAULT_HALL_OF_FAME;
  }
}
