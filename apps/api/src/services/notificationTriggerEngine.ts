/**
 * Notification Trigger Engine (Phase 2)
 * In-process cron scheduling (node-cron, timezone: Asia/Ho_Chi_Minh)
 * Real data integration: SRS due, Streak risk, Golden Hour, Weakness Radar, Weekly Report, Achievements.
 */

import cron, { ScheduledTask } from 'node-cron';
import { prisma } from '../lib/prisma.js';
import { NotificationType } from '@prisma/client';
import { NotificationService } from './notificationService.js';
import { aiInsightsService } from './aiInsightsService.js';

export class NotificationTriggerEngine {
  private static instance: NotificationTriggerEngine;
  private cronTasks: ScheduledTask[] = [];
  private notificationService: NotificationService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): NotificationTriggerEngine {
    if (!NotificationTriggerEngine.instance) {
      NotificationTriggerEngine.instance = new NotificationTriggerEngine();
    }
    return NotificationTriggerEngine.instance;
  }

  /**
   * Helper lấy chuỗi ngày hiện tại chuẩn giờ Việt Nam YYYY-MM-DD
   */
  public getTodayVNDateString(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  /**
   * Helper lấy giờ hiện tại tại Việt Nam (0 - 23)
   */
  public getCurrentVNHour(): number {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: 'numeric',
      hour12: false,
    });
    return parseInt(formatter.format(new Date()), 10);
  }

  /**
   * 1. TRIGGER SRS_DUE (07:30 Hàng ngày)
   * Kiểm tra số từ SRS đến hạn hôm nay (dueDate <= now). Nếu count > 0 -> gửi thông báo deepLink /srs
   */
  public async triggerSrsDue(targetUserId?: string, options: { force?: boolean } = {}) {
    const today = this.getTodayVNDateString();
    const now = new Date();

    const users = targetUserId
      ? await prisma.user.findMany({ where: { id: targetUserId }, select: { id: true, displayName: true } })
      : await prisma.user.findMany({ select: { id: true, displayName: true } });

    const createdNotifications: any[] = [];
    let processed = 0;

    for (const user of users) {
      processed++;
      // Đếm số từ vựng SRS đang đến hạn
      const dueCount = await prisma.userWordState.count({
        where: {
          userId: user.id,
          dueDate: { lte: now },
        },
      });

      if (dueCount > 0) {
        const notif = await this.notificationService.create({
          userId: user.id,
          type: NotificationType.SRS_DUE,
          title: `Hôm nay có ${dueCount} từ cần ôn tập!`,
          body: `Bò LingLing đang chờ bạn vào giải cứu ${dueCount} từ vựng sắp quên đấy. Ôn ngay kẻo rụng kiến thức nhé!`,
          deepLink: '/srs',
          dedupeKey: `srs-due-${today}`,
          metadata: { dueCount, triggeredAt: now.toISOString() },
          force: options.force,
        });

        if (notif) {
          createdNotifications.push(notif);
        }
      }
    }

    return {
      trigger: 'SRS_DUE',
      today,
      processed,
      created: createdNotifications.length,
      notifications: createdNotifications,
    };
  }

  /**
   * 2. TRIGGER STREAK_AT_RISK (20:30 Hàng ngày)
   * Hôm nay chưa học + streak >= 3 -> gửi cảnh báo giữ lửa chuỗi ngày deepLink /daily
   */
  public async triggerStreakAtRisk(targetUserId?: string, options: { force?: boolean } = {}) {
    const today = this.getTodayVNDateString();
    const startOfTodayVN = new Date(`${today}T00:00:00+07:00`);

    const users = targetUserId
      ? await prisma.user.findMany({
          where: { id: targetUserId },
          select: { id: true, displayName: true, currentStreak: true, lastActiveDate: true },
        })
      : await prisma.user.findMany({
          where: { currentStreak: { gte: 3 } },
          select: { id: true, displayName: true, currentStreak: true, lastActiveDate: true },
        });

    const createdNotifications: any[] = [];
    let processed = 0;

    for (const user of users) {
      processed++;
      const streak = user.currentStreak || 0;
      if (streak < 3) continue;

      // Kiểm tra xem hôm nay user đã học chưa
      let hasStudiedToday = user.lastActiveDate === today;

      if (!hasStudiedToday) {
        const todayReviews = await prisma.srsReviewLog.count({
          where: { userId: user.id, reviewedAt: { gte: startOfTodayVN } },
        });
        const todaySessions = await prisma.attemptSession.count({
          where: { userId: user.id, startedAt: { gte: startOfTodayVN } },
        });
        if (todayReviews > 0 || todaySessions > 0) {
          hasStudiedToday = true;
        }
      }

      if (!hasStudiedToday) {
        const notif = await this.notificationService.create({
          userId: user.id,
          type: NotificationType.STREAK_AT_RISK,
          title: `Bảo vệ chuỗi ${streak} ngày của bạn!`,
          body: `Chỉ còn vài tiếng nữa là hết ngày rồi! Vào học nhanh 1 bài để Bò LingLing giữ lửa streak ${streak} ngày cho bạn nhé.`,
          deepLink: '/daily',
          dedupeKey: `streak-risk-${today}`,
          metadata: { streak, date: today },
          force: options.force,
        });

        if (notif) {
          createdNotifications.push(notif);
        }
      }
    }

    return {
      trigger: 'STREAK_AT_RISK',
      today,
      processed,
      created: createdNotifications.length,
      notifications: createdNotifications,
    };
  }

  /**
   * 3. TRIGGER GOLDEN_HOUR (Trước giờ vàng 15 phút)
   * Đọc goldenHour từ Insights Service thật. Khi sắp tới giờ vàng -> deepLink /daily
   */
  public async triggerGoldenHour(
    targetUserId?: string,
    options: { force?: boolean; ignoreHourCheck?: boolean } = {}
  ) {
    const today = this.getTodayVNDateString();
    const currentVNHour = this.getCurrentVNHour();
    // Giờ vàng mục tiêu là giờ tiếp theo nếu chạy lúc XX:45
    const nextHour = (currentVNHour + 1) % 24;

    const users = targetUserId
      ? await prisma.user.findMany({ where: { id: targetUserId }, select: { id: true, displayName: true } })
      : await prisma.user.findMany({ select: { id: true, displayName: true } });

    const createdNotifications: any[] = [];
    let processed = 0;

    for (const user of users) {
      processed++;
      // Đọc tính toán Giờ Vàng từ AI Insights Service
      const golden = await aiInsightsService.getGoldenStudyHours(user.id);

      // Nếu không bỏ qua kiểm tra giờ, chỉ bắn cho user có startHour trùng giờ sắp tới
      if (!options.ignoreHourCheck && golden.startHour !== nextHour) {
        continue;
      }

      const notif = await this.notificationService.create({
        userId: user.id,
        type: NotificationType.GOLDEN_HOUR,
        title: `Sắp tới Giờ Vàng (${golden.startHour}:00)!`,
        body: `15 phút nữa là khung giờ vàng não bộ tập trung nhất của bạn (${golden.goldenHour}, tỷ lệ nhớ ${golden.retentionRate}%). Bò LingLing hẹn bạn vào luyện tập ngay!`,
        deepLink: '/daily',
        dedupeKey: `golden-hour-${today}`,
        metadata: {
          startHour: golden.startHour,
          endHour: golden.endHour,
          retentionRate: golden.retentionRate,
        },
        force: options.force,
      });

      if (notif) {
        createdNotifications.push(notif);
      }
    }

    return {
      trigger: 'GOLDEN_HOUR',
      today,
      processed,
      created: createdNotifications.length,
      notifications: createdNotifications,
    };
  }

  /**
   * 4. TRIGGER WEAK_SKILL (Thứ 2 lúc 08:00)
   * Đọc radar điểm yếu từ Insights Service -> gửi gợi ý bứt phá kỹ năng deepLink /analytics
   */
  public async triggerWeakSkill(targetUserId?: string, options: { force?: boolean } = {}) {
    const today = this.getTodayVNDateString();

    const users = targetUserId
      ? await prisma.user.findMany({ where: { id: targetUserId }, select: { id: true, displayName: true } })
      : await prisma.user.findMany({ select: { id: true, displayName: true } });

    const skillLabels: Record<string, string> = {
      vocabulary: 'Từ Vựng',
      listening: 'Luyện Nghe',
      speaking: 'Kỹ Năng Nói',
      reading: 'Đọc Hiểu',
      writing: 'Luyện Viết',
    };

    const createdNotifications: any[] = [];
    let processed = 0;

    for (const user of users) {
      processed++;
      const radar = await aiInsightsService.getWeaknessRadar(user.id);
      const skillName = skillLabels[radar.weakestSkill] || radar.weakestSkill;
      const score = radar.weakestSkillScore;

      const notif = await this.notificationService.create({
        userId: user.id,
        type: NotificationType.WEAK_SKILL,
        title: `Kế hoạch tuần mới: Cải thiện kỹ năng ${skillName}!`,
        body: `Bò LingLing thấy kỹ năng ${skillName} (${score}/100) cần thêm tình yêu thương trong tuần này. Cùng luyện tập để bứt phá nhé!`,
        deepLink: '/analytics',
        dedupeKey: `weak-skill-${today}`,
        metadata: {
          skill: radar.weakestSkill,
          score,
          recommendation: radar.recommendation,
        },
        force: options.force,
      });

      if (notif) {
        createdNotifications.push(notif);
      }
    }

    return {
      trigger: 'WEAK_SKILL',
      today,
      processed,
      created: createdNotifications.length,
      notifications: createdNotifications,
    };
  }

  /**
   * 5. TRIGGER WEEKLY_REPORT (Khi V2 sinh xong báo cáo tuần)
   * Thông báo báo cáo tuần đã sẵn sàng -> deepLink /analytics#bao-cao-bo
   */
  public async triggerWeeklyReport(
    userId: string,
    options: { force?: boolean; weekNumber?: number; title?: string } = {}
  ) {
    const today = this.getTodayVNDateString();

    const notif = await this.notificationService.create({
      userId,
      type: NotificationType.WEEKLY_REPORT,
      title: options.title || 'Báo cáo học tập tuần của Bò LingLing đã sẵn sàng!',
      body: 'Bò đã tổng hợp xong phân tích tuần qua cho bạn. Xem ngay để biết bạn đã tiến bộ thế nào nhé!',
      deepLink: '/analytics#bao-cao-bo',
      dedupeKey: `weekly-report-${today}`,
      metadata: { weekNumber: options.weekNumber, date: today },
      force: options.force,
    });

    return notif;
  }

  /**
   * 6. TRIGGER ACHIEVEMENT (Realtime - Event mở thành tựu)
   * Thông báo khi user mở khóa danh hiệu/huy hiệu mới -> deepLink /profile
   */
  public async triggerAchievement(
    userId: string,
    achievement: { id: string; name: string; description?: string },
    options: { force?: boolean } = {}
  ) {
    const notif = await this.notificationService.create({
      userId,
      type: NotificationType.ACHIEVEMENT,
      title: `Chúc mừng! Bạn đã mở khóa: ${achievement.name}!`,
      body: `Bò LingLing bắn pháo hoa ăn mừng cho bạn! Hãy vào trang cá nhân chiêm ngưỡng huy hiệu mới nhé.`,
      deepLink: '/profile',
      dedupeKey: `achievement-${achievement.id}`,
      metadata: { achievementId: achievement.id, name: achievement.name },
      force: options.force,
    });

    return notif;
  }

  /**
   * Khởi động các in-process cron jobs (timezone: 'Asia/Ho_Chi_Minh')
   */
  public initNotificationCronJobs(): void {
    this.stopNotificationCronJobs();

    console.log('[NotificationTriggerEngine] Đang kích hoạt In-Process Cron Schedulers (Asia/Ho_Chi_Minh)...');

    // 1. SRS_DUE: 07:30 mỗi ngày
    const srsTask = cron.schedule(
      '30 7 * * *',
      async () => {
        try {
          console.log('[Cron] Chạy Trigger SRS_DUE 07:30...');
          await this.triggerSrsDue();
        } catch (err) {
          console.error('[Cron] Lỗi chạy Trigger SRS_DUE:', err);
        }
      },
      { timezone: 'Asia/Ho_Chi_Minh' }
    );
    this.cronTasks.push(srsTask);

    // 2. STREAK_AT_RISK: 20:30 mỗi ngày
    const streakTask = cron.schedule(
      '30 20 * * *',
      async () => {
        try {
          console.log('[Cron] Chạy Trigger STREAK_AT_RISK 20:30...');
          await this.triggerStreakAtRisk();
        } catch (err) {
          console.error('[Cron] Lỗi chạy Trigger STREAK_AT_RISK:', err);
        }
      },
      { timezone: 'Asia/Ho_Chi_Minh' }
    );
    this.cronTasks.push(streakTask);

    // 3. GOLDEN_HOUR: Chạy phút 45 mỗi giờ (báo trước 15p cho giờ tiếp theo)
    const goldenTask = cron.schedule(
      '45 * * * *',
      async () => {
        try {
          console.log('[Cron] Chạy Trigger GOLDEN_HOUR (phút 45)...');
          await this.triggerGoldenHour();
        } catch (err) {
          console.error('[Cron] Lỗi chạy Trigger GOLDEN_HOUR:', err);
        }
      },
      { timezone: 'Asia/Ho_Chi_Minh' }
    );
    this.cronTasks.push(goldenTask);

    // 4. WEAK_SKILL: 08:00 sáng Thứ Hai hàng tuần
    const weakSkillTask = cron.schedule(
      '0 8 * * 1',
      async () => {
        try {
          console.log('[Cron] Chạy Trigger WEAK_SKILL (Thứ 2 08:00)...');
          await this.triggerWeakSkill();
        } catch (err) {
          console.error('[Cron] Lỗi chạy Trigger WEAK_SKILL:', err);
        }
      },
      { timezone: 'Asia/Ho_Chi_Minh' }
    );
    this.cronTasks.push(weakSkillTask);

    console.log('[NotificationTriggerEngine] 4 Cron Jobs đã được lập lịch thành công.');
  }

  /**
   * Dừng tất cả cron tasks khi server shutdown hoặc reload
   */
  public stopNotificationCronJobs(): void {
    for (const task of this.cronTasks) {
      task.stop();
    }
    this.cronTasks = [];
  }
}

export const notificationTriggerEngine = NotificationTriggerEngine.getInstance();
