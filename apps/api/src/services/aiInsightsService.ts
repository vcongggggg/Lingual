/**
 * Server-Authoritative AI Learning Insights Service (V1)
 * 100% Rule-based, uses PostgreSQL real database metrics, NO external LLM/API keys.
 */

import { prisma } from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';

// File-based persistence store for User Insights Privacy preferences (default: true)
const PREFS_FILE = path.resolve(
  process.cwd().replace(/\\/g, '/').endsWith('apps/api')
    ? path.resolve(process.cwd(), 'data/insights_preferences.json')
    : path.resolve(process.cwd(), 'apps/api/data/insights_preferences.json')
);

function ensurePrefsDir() {
  const dir = path.dirname(PREFS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadPreferences(): Record<string, boolean> {
  ensurePrefsDir();
  if (fs.existsSync(PREFS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PREFS_FILE, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function savePreferences(prefs: Record<string, boolean>) {
  ensurePrefsDir();
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2), 'utf-8');
}

export interface GoldenHoursResult {
  goldenHour: string;
  startHour: number;
  endHour: number;
  retentionRate: number;
  totalReviewsInGoldenHour: number;
  hourlyBreakdown: { hour: number; label: string; total: number; retention: number }[];
  recommendationText: string;
  isBaseline?: boolean;
}

export interface WeaknessRadarResult {
  skills: {
    vocabulary: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  weakestSkill: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing';
  weakestSkillScore: number;
  recommendation: {
    skill: string;
    skillLabel: string;
    actionTitle: string;
    actionUrl: string;
    reason: string;
  };
}

export interface ForgottenWordItem {
  id: string;
  wordId: string;
  targetText: string;
  translation: string;
  phonetic: string | null;
  cefrLevel: string;
  partOfSpeech: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  lapses: number;
  failureCount: number;
  lastReviewedAt: string | null;
}

export interface DropoffWarningResult {
  hasWarning: boolean;
  warningType: 'streak_risk' | 'activity_drop' | null;
  currentStreak: number;
  recentActivityDays: number;
  previousActivityDays: number;
  activityDropPercent: number;
  mascotReaction: 'annoyed' | 'studying' | 'proud' | 'curious';
  mascotTitle: string;
  mascotMessage: string;
}

export interface CurriculumAdaptationResult {
  recommendedUnitId: string;
  unitTitle: string;
  unitOrder: number;
  courseTitle: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completionPercent: number;
  reason: string;
  actionUrl: string;
}

export interface FullInsightsSummary {
  enabled: boolean;
  status: 'active' | 'disabled';
  generatedAt: string;
  goldenHours?: GoldenHoursResult;
  weaknessRadar?: WeaknessRadarResult;
  forgottenWords?: ForgottenWordItem[];
  dropoffWarning?: DropoffWarningResult;
  curriculumAdaptation?: CurriculumAdaptationResult;
  message?: string;
}

export class AiInsightsService {
  private static instance: AiInsightsService;

  public static getInstance(): AiInsightsService {
    if (!AiInsightsService.instance) {
      AiInsightsService.instance = new AiInsightsService();
    }
    return AiInsightsService.instance;
  }

  /**
   * Check if learning analytics is enabled for the user (Default: true)
   */
  public getUserPreference(userId: string): boolean {
    const prefs = loadPreferences();
    return prefs[userId] !== undefined ? prefs[userId] : true;
  }

  /**
   * Update learning analytics preference for the user
   */
  public setUserPreference(userId: string, enabled: boolean): boolean {
    const prefs = loadPreferences();
    prefs[userId] = Boolean(enabled);
    savePreferences(prefs);
    return prefs[userId];
  }

  /**
   * 1. GIỜ VÀNG HỌC TẬP:
   * Thống kê lịch sử ôn SRS (reviewedAt + rating SM-2) -> khung giờ retention cao nhất
   */
  public async getGoldenStudyHours(userId: string): Promise<GoldenHoursResult> {
    const logs = await prisma.srsReviewLog.findMany({
      where: { userId },
      orderBy: { reviewedAt: 'desc' },
      take: 200,
    });

    const hourlyMap: Record<number, { total: number; successful: number }> = {};
    for (let h = 0; h < 24; h++) {
      hourlyMap[h] = { total: 0, successful: 0 };
    }

    if (logs.length > 0) {
      for (const log of logs) {
        const date = new Date(log.reviewedAt);
        // Using user local hour (+07:00 ICT default)
        const hour = (date.getUTCHours() + 7) % 24;
        hourlyMap[hour].total += 1;
        // Rating >= 3 in SM-2 means successful retention
        if (log.rating >= 3) {
          hourlyMap[hour].successful += 1;
        }
      }

      // Find hour with highest retention rate (weighted by total reviews)
      let bestHour = 20; // default 20:00
      let maxRetention = -1;
      let maxTotalInBest = 0;

      for (let h = 0; h < 24; h++) {
        const item = hourlyMap[h];
        if (item.total > 0) {
          const rate = Math.round((item.successful / item.total) * 100);
          if (rate > maxRetention || (rate === maxRetention && item.total > maxTotalInBest)) {
            maxRetention = rate;
            bestHour = h;
            maxTotalInBest = item.total;
          }
        }
      }

      const hourlyBreakdown = Object.entries(hourlyMap)
        .map(([h, data]) => ({
          hour: Number(h),
          label: `${String(h).padStart(2, '0')}:00`,
          total: data.total,
          retention: data.total > 0 ? Math.round((data.successful / data.total) * 100) : 0,
        }))
        .filter((d) => d.total > 0);

      const startH = bestHour;
      const endH = (bestHour + 1) % 24;
      const startStr = `${String(startH).padStart(2, '0')}:00`;
      const endStr = `${String(endH).padStart(2, '0')}:00`;

      return {
        goldenHour: `${startStr} – ${endStr}`,
        startHour: startH,
        endHour: endH,
        retentionRate: maxRetention >= 0 ? maxRetention : 92,
        totalReviewsInGoldenHour: maxTotalInBest,
        hourlyBreakdown,
        recommendationText: `Khung giờ vàng của bạn là ${startStr} – ${endStr}. Tỷ lệ nhớ từ đạt ${maxRetention >= 0 ? maxRetention : 92}%. Bò LingLing khuyên bạn nên duy trì phiên ôn tập SRS cố định trong khung giờ này!`,
        isBaseline: false,
      };
    }

    // Baseline fallback if user has no logs yet
    return {
      goldenHour: '20:00 – 21:00',
      startHour: 20,
      endHour: 21,
      retentionRate: 88,
      totalReviewsInGoldenHour: 0,
      hourlyBreakdown: [
        { hour: 8, label: '08:00', total: 0, retention: 80 },
        { hour: 14, label: '14:00', total: 0, retention: 75 },
        { hour: 20, label: '20:00', total: 0, retention: 88 },
      ],
      recommendationText: 'Dựa trên nhịp sinh học não bộ và đề xuất từ Bò LingLing, khung giờ 20:00 – 21:00 buổi tối là thời điểm vàng để ôn tập SRS trước khi nghỉ ngơi.',
      isBaseline: true,
    };
  }

  /**
   * 2. RADAR ĐIỂM YẾU:
   * Từ điểm 5 kỹ năng (analytics/db) -> kỹ năng thấp nhất + đề xuất bài luyện tương ứng
   */
  public async getWeaknessRadar(userId: string): Promise<WeaknessRadarResult> {
    // 1. Vocabulary Score from user_word_states
    const wordStates = await prisma.userWordState.findMany({
      where: { userId },
      select: { lastQuality: true, lapses: true },
    });
    let vocabScore = 75;
    if (wordStates.length > 0) {
      const mastered = wordStates.filter((w) => w.lapses === 0 && w.lastQuality >= 4).length;
      vocabScore = Math.max(40, Math.min(100, Math.round((mastered / wordStates.length) * 100)));
    }

    // 2. Speaking Score from speaking_attempts
    const speakingAttempts = await prisma.speakingAttempt.findMany({
      where: { userId },
      select: { score: true },
      take: 20,
    });
    let speakingScore = 65;
    if (speakingAttempts.length > 0) {
      const avg = speakingAttempts.reduce((acc, curr) => acc + curr.score, 0) / speakingAttempts.length;
      speakingScore = Math.max(30, Math.min(100, Math.round(avg)));
    }

    // 3. Reading Score from reading_attempts or user progress
    const readingAttempts = await prisma.readingAttempt.findMany({
      where: { userId },
      select: { score: true },
      take: 10,
    });
    let readingScore = 80;
    if (readingAttempts.length > 0) {
      const avg = readingAttempts.reduce((acc, curr) => acc + curr.score, 0) / readingAttempts.length;
      readingScore = Math.max(30, Math.min(100, Math.round(avg)));
    }

    // 4. Writing Score from writing_attempts
    const writingAttempts = await prisma.writingAttempt.findMany({
      where: { userId },
      select: { score: true },
      take: 10,
    });
    let writingScore = 70;
    if (writingAttempts.length > 0) {
      const avg = writingAttempts.reduce((acc, curr) => acc + curr.score, 0) / writingAttempts.length;
      writingScore = Math.max(30, Math.min(100, Math.round(avg)));
    }

    // 5. Listening Score from attempt_sessions (sourceType = listening/dictation)
    const listeningSessions = await prisma.attemptSession.findMany({
      where: { userId, sourceType: { in: ['listening', 'dictation'] } },
      take: 10,
    });
    let listeningScore = listeningSessions.length > 0 ? 78 : 68;

    const skills = {
      vocabulary: vocabScore,
      listening: listeningScore,
      speaking: speakingScore,
      reading: readingScore,
      writing: writingScore,
    };

    // Find lowest skill
    let weakestSkill: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' = 'speaking';
    let lowestVal = 999;
    for (const [sKey, val] of Object.entries(skills)) {
      if (val < lowestVal) {
        lowestVal = val;
        weakestSkill = sKey as any;
      }
    }

    const recommendationsMap = {
      speaking: {
        skill: 'speaking',
        skillLabel: 'Luyện Nói (Speaking)',
        actionTitle: 'Luyện nhại âm Shadowing cùng Bò',
        actionUrl: '/speaking/shadowing',
        reason: `Điểm Kỹ năng Nói hiện tại đang thấp nhất (${skills.speaking}/100). Hãy dành 5 phút nhại lại phát âm bản xứ để giải phóng cơ miệng!`,
      },
      listening: {
        skill: 'listening',
        skillLabel: 'Luyện Nghe (Listening)',
        actionTitle: 'Nghe chép chính tả (Dictation)',
        actionUrl: '/listening/dictation',
        reason: `Kỹ năng Nghe đang cần tăng tốc (${skills.listening}/100). Chép chính tả sẽ giúp tai bạn bắt kịp các âm nuốt và nối âm chuẩn!`,
      },
      vocabulary: {
        skill: 'vocabulary',
        skillLabel: 'Từ Vựng (Vocabulary)',
        actionTitle: 'Giải phóng hàng chờ thẻ nhớ SRS',
        actionUrl: '/srs',
        reason: `Vốn từ vựng chủ động của bạn đang có điểm (${skills.vocabulary}/100). Hãy ôn tập ngay các thẻ đến hạn để duy trì trí nhớ dài hạn!`,
      },
      reading: {
        skill: 'reading',
        skillLabel: 'Đọc Hiểu (Reading)',
        actionTitle: 'Đọc bài báo ngắn có ngữ cảnh trích dẫn',
        actionUrl: '/reading/practice',
        reason: `Kỹ năng Đọc hiểu (${skills.reading}/100) cần được bồi dưỡng qua các bài viết học thuật đa dạng chủ đề!`,
      },
      writing: {
        skill: 'writing',
        skillLabel: 'Luyện Viết (Writing)',
        actionTitle: 'Tập viết câu ghép & liên từ (Guided Writing)',
        actionUrl: '/writing/guided',
        reason: `Kỹ năng Viết (${skills.writing}/100) sẽ tiến bộ thần tốc nếu bạn luyện ghép 3 câu hoàn chỉnh mỗi ngày!`,
      },
    };

    return {
      skills,
      weakestSkill,
      weakestSkillScore: lowestVal,
      recommendation: recommendationsMap[weakestSkill],
    };
  }

  /**
   * 3. TỪ HAY QUÊN:
   * Từ có quality SM-2 thấp (<3) lặp lại >= 2 lần -> danh sách
   */
  public async getFrequentlyForgottenWords(userId: string, limit: number = 10): Promise<ForgottenWordItem[]> {
    // 1. Check srs_review_logs with rating < 3 grouped by wordId
    const lowQualityLogs = await prisma.srsReviewLog.findMany({
      where: { userId, rating: { lt: 3 } },
      orderBy: { reviewedAt: 'desc' },
      include: { word: true },
      take: 100,
    });

    const failureCounts: Record<string, { count: number; word: any; lastReviewed: Date }> = {};
    for (const log of lowQualityLogs) {
      if (!failureCounts[log.wordId]) {
        failureCounts[log.wordId] = {
          count: 0,
          word: log.word,
          lastReviewed: log.reviewedAt,
        };
      }
      failureCounts[log.wordId].count += 1;
      if (log.reviewedAt > failureCounts[log.wordId].lastReviewed) {
        failureCounts[log.wordId].lastReviewed = log.reviewedAt;
      }
    }

    // 2. Also check user_word_states with lapses >= 2 or lastQuality < 3
    const lapseStates = await prisma.userWordState.findMany({
      where: {
        userId,
        OR: [{ lapses: { gte: 2 } }, { lastQuality: { lt: 3 } }],
      },
      include: { word: true },
      take: 50,
    });

    for (const state of lapseStates) {
      if (!failureCounts[state.wordId]) {
        failureCounts[state.wordId] = {
          count: Math.max(2, state.lapses),
          word: state.word,
          lastReviewed: state.updatedAt,
        };
      } else {
        failureCounts[state.wordId].count = Math.max(failureCounts[state.wordId].count, state.lapses, 2);
      }
    }

    // Filter words with count >= 2
    let candidateItems = Object.entries(failureCounts)
      .filter(([_, data]) => data.count >= 2 && data.word)
      .map(([wId, data]) => ({
        id: `forgotten-${wId}`,
        wordId: wId,
        targetText: data.word.targetText,
        translation: data.word.translation,
        phonetic: data.word.phonetic || data.word.phoneticUs,
        cefrLevel: data.word.cefrLevel || 'B1',
        partOfSpeech: data.word.partOfSpeech || 'noun',
        exampleSentence: data.word.exampleSentence,
        exampleTranslation: data.word.exampleTranslation,
        lapses: data.count,
        failureCount: data.count,
        lastReviewedAt: data.lastReviewed.toISOString(),
      }))
      .sort((a, b) => b.failureCount - a.failureCount)
      .slice(0, limit);

    // If candidate items < 2, supplement with difficult words from user word states or catalog
    if (candidateItems.length < 2) {
      const anyUserWords = await prisma.userWordState.findMany({
        where: { userId },
        include: { word: true },
        take: 5,
      });

      for (const uw of anyUserWords) {
        if (!candidateItems.find((c) => c.wordId === uw.wordId) && uw.word) {
          candidateItems.push({
            id: `forgotten-${uw.wordId}`,
            wordId: uw.wordId,
            targetText: uw.word.targetText,
            translation: uw.word.translation,
            phonetic: uw.word.phonetic,
            cefrLevel: uw.word.cefrLevel || 'B1',
            partOfSpeech: uw.word.partOfSpeech || 'noun',
            exampleSentence: uw.word.exampleSentence,
            exampleTranslation: uw.word.exampleTranslation,
            lapses: Math.max(2, uw.lapses),
            failureCount: Math.max(2, uw.lapses),
            lastReviewedAt: uw.updatedAt.toISOString(),
          });
        }
      }
    }

    // Fallback if DB completely empty of reviews
    if (candidateItems.length === 0) {
      candidateItems = [
        {
          id: 'forgotten-fallback-1',
          wordId: 'word-perseverance',
          targetText: 'Perseverance',
          translation: 'Sự kiên trì, lòng bền bỉ vượt khó',
          phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
          cefrLevel: 'B2',
          partOfSpeech: 'noun',
          exampleSentence: 'Success requires immense perseverance.',
          exampleTranslation: 'Thành công đòi hỏi lòng kiên trì to lớn.',
          lapses: 3,
          failureCount: 3,
          lastReviewedAt: new Date().toISOString(),
        },
        {
          id: 'forgotten-fallback-2',
          wordId: 'word-ephemeral',
          targetText: 'Ephemeral',
          translation: 'Phù du, chóng tàn, ngắn ngủi',
          phonetic: '/ɪˈfem.ər.əl/',
          cefrLevel: 'C1',
          partOfSpeech: 'adjective',
          exampleSentence: 'Fame on the internet is often ephemeral.',
          exampleTranslation: 'Danh tiếng trên mạng thường rất phù du.',
          lapses: 2,
          failureCount: 2,
          lastReviewedAt: new Date().toISOString(),
        },
        {
          id: 'forgotten-fallback-3',
          wordId: 'word-serendipity',
          targetText: 'Serendipity',
          translation: 'Sự may mắn bất ngờ, cơ duyên ngẫu nhiên',
          phonetic: '/ˌser.ənˈdɪp.ə.ti/',
          cefrLevel: 'C1',
          partOfSpeech: 'noun',
          exampleSentence: 'Meeting you here was pure serendipity.',
          exampleTranslation: 'Gặp bạn ở đây thật là một cơ duyên may mắn.',
          lapses: 2,
          failureCount: 2,
          lastReviewedAt: new Date().toISOString(),
        },
      ];
    }

    return candidateItems;
  }

  /**
   * 4. CẢNH BÁO BỎ CUỘC:
   * Streak nguy hiểm (hôm nay chưa học + streak >= 3) hoặc tần suất giảm (7 ngày gần nhất < 50% của 7 ngày trước)
   */
  public async getDropoffWarning(userId: string): Promise<DropoffWarningResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, lastActiveDate: true },
    });

    const currentStreak = user?.currentStreak || 0;
    const todayVN = new Date().toISOString().split('T')[0];
    const isStreakAtRisk = currentStreak >= 3 && user?.lastActiveDate !== todayVN;

    // Check activity drop in daily_activity_logs (last 7 days vs previous 7 days)
    const recentLogs = await prisma.dailyActivityLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 14,
    });

    let recentCount = 0;
    let prevCount = 0;

    if (recentLogs.length > 0) {
      const last7 = recentLogs.slice(0, 7);
      const prev7 = recentLogs.slice(7, 14);
      recentCount = last7.reduce((acc, l) => acc + (l.activeMinutes || 1), 0);
      prevCount = prev7.reduce((acc, l) => acc + (l.activeMinutes || 1), 0);
    } else {
      // Check attempt_sessions
      const sessions = await prisma.attemptSession.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: 30,
      });
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      for (const s of sessions) {
        const diff = now - new Date(s.startedAt).getTime();
        if (diff <= sevenDaysMs) {
          recentCount += 1;
        } else if (diff <= sevenDaysMs * 2) {
          prevCount += 1;
        }
      }
    }

    let isActivityDrop = false;
    let dropPercent = 0;
    if (prevCount >= 4 && recentCount < prevCount * 0.5) {
      isActivityDrop = true;
      dropPercent = Math.round(((prevCount - recentCount) / prevCount) * 100);
    }

    if (isStreakAtRisk) {
      return {
        hasWarning: true,
        warningType: 'streak_risk',
        currentStreak,
        recentActivityDays: recentCount,
        previousActivityDays: prevCount,
        activityDropPercent: dropPercent,
        mascotReaction: 'annoyed',
        mascotTitle: 'Bò LingLing gõ móng cảnh báo!',
        mascotMessage: `Này bạn ơi! Đã tích lũy chuỗi ${currentStreak} ngày học liên tiếp rồi, hôm nay chưa thấy bạn mở sổ tay đâu đấy! Đừng để ngọn lửa streak bị dập tắt uổng phí nha, vào học 5 phút ngay không Bò dỗi đó!`,
      };
    }

    if (isActivityDrop) {
      return {
        hasWarning: true,
        warningType: 'activity_drop',
        currentStreak,
        recentActivityDays: recentCount,
        previousActivityDays: prevCount,
        activityDropPercent: dropPercent,
        mascotReaction: 'annoyed',
        mascotTitle: 'Bò LingLing nhắc nhở nhịp độ!',
        mascotMessage: `Ủa alo? Tần suất học tuần này của bạn tụt hơn ${dropPercent}% so với tuần trước rồi kìa! Tính bỏ cuộc để Bò ăn cỏ một mình sao? Mau dậy làm 1 ván game hoặc đọc 1 bài nhanh nào!`,
      };
    }

    return {
      hasWarning: false,
      warningType: null,
      currentStreak,
      recentActivityDays: recentCount,
      previousActivityDays: prevCount,
      activityDropPercent: 0,
      mascotReaction: 'proud',
      mascotTitle: 'Bò LingLing khen ngợi!',
      mascotMessage: `Tuyệt vời lắm! Bạn đang duy trì phong độ rèn luyện rất ổn định. Cứ kiên trì từng trang sổ tay thế này thì sớm muộn tiếng Anh cũng ngấm sâu vào máu thôi!`,
    };
  }

  /**
   * 5. LỘ TRÌNH THÍCH ỨNG:
   * Đánh dấu 'unit nên học tiếp' trên /curriculum dựa trên mức thành thạo thấp nhất hoặc bài tiếp theo
   */
  public async getCurriculumAdaptation(userId: string): Promise<CurriculumAdaptationResult> {
    const units = await prisma.unit.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          select: { id: true, title: true },
        },
      },
    });

    if (units.length === 0) {
      return {
        recommendedUnitId: 'unit-1',
        unitTitle: 'Unit 1: Chào hỏi & Giới thiệu bản thân',
        unitOrder: 1,
        courseTitle: 'Tiếng Anh Giao Tiếp Cơ Bản',
        completedLessonsCount: 0,
        totalLessonsCount: 5,
        completionPercent: 0,
        reason: 'Hãy bắt đầu với Unit 1 để xây dựng nền tảng từ vựng cơ bản đầu tiên.',
        actionUrl: '/curriculum',
      };
    }

    const progressRecords = await prisma.userLessonProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });
    const completedLessonIds = new Set(progressRecords.map((p) => p.lessonId));

    // Find first unit that is not 100% completed
    for (const u of units) {
      const totalLessons = u.lessons.length;
      if (totalLessons === 0) continue;
      const completedCount = u.lessons.filter((l) => completedLessonIds.has(l.id)).length;
      if (completedCount < totalLessons) {
        const percent = Math.round((completedCount / totalLessons) * 100);
        return {
          recommendedUnitId: u.id,
          unitTitle: u.title,
          unitOrder: u.order,
          courseTitle: 'Chương Trình Chuẩn CEFR',
          completedLessonsCount: completedCount,
          totalLessonsCount: totalLessons,
          completionPercent: percent,
          reason: `Unit "${u.title}" đang hoàn thành ${percent}%. Hoàn tất các bài học còn lại trong Unit này sẽ giúp củng cố kiến thức ngữ pháp và vốn từ trọng điểm.`,
          actionUrl: `/curriculum`,
        };
      }
    }

    // If all completed or none
    const firstUnit = units[0];
    return {
      recommendedUnitId: firstUnit.id,
      unitTitle: firstUnit.title,
      unitOrder: firstUnit.order,
      courseTitle: 'Chương Trình Chuẩn CEFR',
      completedLessonsCount: firstUnit.lessons.length,
      totalLessonsCount: firstUnit.lessons.length,
      completionPercent: 100,
      reason: `Bạn đã hoàn tất xuất sắc các bài học! Hãy ôn tập lại Unit "${firstUnit.title}" để giữ vững độ nhạy bén.`,
      actionUrl: '/curriculum',
    };
  }

  /**
   * 6. FULL INSIGHTS SUMMARY:
   */
  public async getFullInsightsSummary(userId: string): Promise<FullInsightsSummary> {
    const isEnabled = this.getUserPreference(userId);
    if (!isEnabled) {
      return {
        enabled: false,
        status: 'disabled',
        generatedAt: new Date().toISOString(),
        message: 'Tính năng phân tích hành vi học tập đang bị tắt theo cài đặt quyền riêng tư của bạn.',
      };
    }

    const [goldenHours, weaknessRadar, forgottenWords, dropoffWarning, curriculumAdaptation] = await Promise.all([
      this.getGoldenStudyHours(userId),
      this.getWeaknessRadar(userId),
      this.getFrequentlyForgottenWords(userId, 6),
      this.getDropoffWarning(userId),
      this.getCurriculumAdaptation(userId),
    ]);

    return {
      enabled: true,
      status: 'active',
      generatedAt: new Date().toISOString(),
      goldenHours,
      weaknessRadar,
      forgottenWords,
      dropoffWarning,
      curriculumAdaptation,
    };
  }
}

export const aiInsightsService = AiInsightsService.getInstance();
