/**
 * Notification Service (Phase 1)
 * Core business logic: Preference checking, Quiet Hours, Deduplication, CRUD
 */

import { prisma } from '../lib/prisma.js';
import { NotificationType } from '@prisma/client';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: string;
  dedupeKey?: string;
  metadata?: any;
  force?: boolean; // Bỏ qua quiet hours & toggle (dành cho DEV trigger hoặc khẩn cấp)
}

export class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Lấy hoặc khởi tạo cấu hình thông báo mặc định của người dùng
   */
  public async getOrCreatePreferences(userId: string) {
    let pref = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await prisma.notificationPreference.create({
        data: {
          userId,
          enabled: true,
          srsDue: true,
          streakRisk: true,
          goldenHour: true,
          weakSkill: true,
          forgetfulWords: true,
          weekly: true,
          achievement: true,
          quietStart: '22:00',
          quietEnd: '07:00',
        },
      });
    }

    return pref;
  }

  /**
   * Cập nhật cấu hình thông báo
   */
  public async updatePreferences(userId: string, data: any) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        userId,
        enabled: data.enabled ?? true,
        srsDue: data.srsDue ?? true,
        streakRisk: data.streakRisk ?? true,
        goldenHour: data.goldenHour ?? true,
        weakSkill: data.weakSkill ?? true,
        forgetfulWords: data.forgetfulWords ?? true,
        weekly: data.weekly ?? true,
        achievement: data.achievement ?? true,
        quietStart: data.quietStart ?? '22:00',
        quietEnd: data.quietEnd ?? '07:00',
      },
    });
  }

  /**
   * Kiểm tra thời điểm hiện tại có rơi vào Quiet Hours (Giờ yên lặng) hay không
   * Mặc định tính theo giờ Việt Nam (UTC+7)
   */
  public isQuietHours(quietStart: string, quietEnd: string, now: Date = new Date()): boolean {
    if (!quietStart || !quietEnd) return false;

    // Giờ VN (UTC+7)
    const vnTime = new Date(now.getTime() + 7 * 3600 * 1000);
    const hours = vnTime.getUTCHours();
    const minutes = vnTime.getUTCMinutes();
    const currentMins = hours * 60 + minutes;

    const [startH, startM] = quietStart.split(':').map(Number);
    const [endH, endM] = quietEnd.split(':').map(Number);
    const startMins = startH * 60 + (startM || 0);
    const endMins = endH * 60 + (endM || 0);

    // TH1: start < end (vd: 01:00 đến 06:00)
    if (startMins < endMins) {
      return currentMins >= startMins && currentMins < endMins;
    }

    // TH2: start >= end (vd: 22:00 hôm trước đến 07:00 hôm sau)
    return currentMins >= startMins || currentMins < endMins;
  }

  /**
   * Kiểm tra toggle từng loại thông báo
   */
  private isTypeEnabled(pref: any, type: NotificationType): boolean {
    switch (type) {
      case 'SRS_DUE':
        return Boolean(pref.srsDue);
      case 'STREAK_AT_RISK':
        return Boolean(pref.streakRisk);
      case 'GOLDEN_HOUR':
        return Boolean(pref.goldenHour);
      case 'WEAK_SKILL':
        return Boolean(pref.weakSkill);
      case 'FORGETFUL_WORDS':
        return Boolean(pref.forgetfulWords ?? pref.weakSkill);
      case 'WEEKLY_REPORT':
        return Boolean(pref.weekly);
      case 'ACHIEVEMENT':
        return Boolean(pref.achievement);
      case 'SYSTEM':
        return true;
      default:
        return true;
    }
  }

  /**
   * Tạo thông báo mới: Kiểm tra kill switch, toggle loại và quiet hours
   */
  public async create(params: CreateNotificationParams) {
    const { userId, type, title, body, deepLink, dedupeKey, metadata, force } = params;

    const pref = await this.getOrCreatePreferences(userId);

    // 1. Kill Switch Check
    if (!pref.enabled && !force) {
      return null;
    }

    // 2. Toggle Type Check
    if (!force && !this.isTypeEnabled(pref, type)) {
      return null;
    }

    // 3. Quiet Hours Check
    if (!force && this.isQuietHours(pref.quietStart, pref.quietEnd)) {
      return null;
    }

    // 4. Insert DB với unique constraint chống trùng (userId, type, dedupeKey)
    try {
      const created = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          body,
          deepLink,
          dedupeKey: dedupeKey || null,
          metadata: metadata || null,
          isRead: false,
        },
      });

      // Phase 3: Gửi Web Push nếu ngoài Quiet Hours và user có thiết bị đăng ký
      if (!this.isQuietHours(pref.quietStart, pref.quietEnd)) {
        import('./pushNotificationService.js')
          .then(({ pushNotificationService }) => {
            pushNotificationService
              .sendPushToUser(userId, {
                title,
                body,
                deepLink: deepLink || undefined,
                tag: dedupeKey || undefined,
              })
              .catch((err) => {
                console.warn('[PushNotification] Lỗi gửi push background:', err?.message || err);
              });
          })
          .catch(() => {});
      }

      return created;
    } catch (err: any) {
      // Bắt lỗi trùng unique key (Prisma P2002) -> Chống spam trùng lặp
      if (err.code === 'P2002') {
        return null;
      }
      throw err;
    }
  }

  /**
   * Lấy danh sách thông báo phân trang của user
   */
  public async list(userId: string, options: { unreadOnly?: boolean; limit?: number; cursor?: string }) {
    const limit = Math.min(50, Math.max(1, options.limit || 20));
    const where: any = { userId };

    if (options.unreadOnly) {
      where.isRead = false;
    }

    const items = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: options.cursor ? { id: options.cursor } : undefined,
      skip: options.cursor ? 1 : 0,
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id || null;
    }

    const total = await prisma.notification.count({ where });

    return {
      notifications: items,
      nextCursor,
      total,
    };
  }

  /**
   * Đếm số lượng thông báo chưa đọc (nếu kill switch tắt -> trả về 0)
   */
  public async getUnreadCount(userId: string): Promise<number> {
    const pref = await this.getOrCreatePreferences(userId);
    if (!pref.enabled) {
      return 0;
    }

    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Đánh dấu 1 thông báo đã đọc
   */
  public async markAsRead(userId: string, notificationId: string) {
    const notif = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notif) {
      throw new Error('Không tìm thấy thông báo hoặc bạn không có quyền truy cập.');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Đánh dấu tất cả thông báo của user là đã đọc
   */
  public async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { count: result.count };
  }

  /**
   * Xóa 1 thông báo
   */
  public async delete(userId: string, notificationId: string) {
    const notif = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notif) {
      throw new Error('Không tìm thấy thông báo để xóa.');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  }
}

export const notificationService = NotificationService.getInstance();
