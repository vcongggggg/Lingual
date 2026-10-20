/**
 * Push Notification Service (Phase 3)
 * Handles Web Push with VAPID authentication, subscription persistence, and payload dispatch.
 */

import webpush from 'web-push';
import { prisma } from '../lib/prisma.js';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  deepLink?: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private isConfigured: boolean = false;

  private constructor() {
    this.initVapid();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private initVapid(): void {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:support@lingual.internal';

    if (publicKey && privateKey) {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.isConfigured = true;
      console.log('✅ Web Push VAPID credentials configured successfully.');
    } else {
      console.warn('⚠️ Web Push VAPID keys not configured in environment variables.');
    }
  }

  public getPublicKey(): string | null {
    return process.env.VAPID_PUBLIC_KEY || null;
  }

  /**
   * Lưu hoặc cập nhật subscription cho user
   */
  public async subscribe(userId: string, data: PushSubscriptionData) {
    const { endpoint, keys, userAgent } = data;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      throw new Error('Dữ liệu subscription không hợp lệ (thiếu endpoint hoặc keys).');
    }

    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
      create: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
    });

    return sub;
  }

  /**
   * Hủy subscription của user
   */
  public async unsubscribe(userId: string, endpoint: string) {
    if (!endpoint) {
      throw new Error('Thiếu endpoint cần hủy.');
    }

    const deleted = await prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId,
      },
    });

    return { success: true, count: deleted.count };
  }

  /**
   * Lấy danh sách subscriptions của user
   */
  public async getUserSubscriptions(userId: string) {
    return prisma.pushSubscription.findMany({
      where: { userId },
    });
  }

  /**
   * Gửi thông báo đẩy đến tất cả subscriptions của user
   */
  public async sendPushToUser(userId: string, payload: PushPayload) {
    if (!this.isConfigured) {
      return { sent: 0, failed: 0, reason: 'VAPID_NOT_CONFIGURED' };
    }

    const subscriptions = await this.getUserSubscriptions(userId);
    if (!subscriptions.length) {
      return { sent: 0, failed: 0, reason: 'NO_SUBSCRIPTIONS' };
    }

    const jsonPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      deepLink: payload.deepLink || '/',
      icon: payload.icon || '/assets/cow-scholar.png',
      badge: payload.badge || '/favicon.ico',
      tag: payload.tag,
    });

    let sent = 0;
    let failed = 0;
    const expiredEndpoints: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, jsonPayload);
          sent++;
        } catch (err: any) {
          failed++;
          // Prune expired or invalid subscriptions (HTTP 410 Gone / 404 Not Found)
          if (err.statusCode === 410 || err.statusCode === 404) {
            expiredEndpoints.push(sub.endpoint);
          } else {
            console.warn(`[WebPush] Không thể gửi tới endpoint: ${sub.endpoint.slice(0, 30)}...`, err.message);
          }
        }
      })
    );

    // Xóa subscription hết hạn
    if (expiredEndpoints.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: { in: expiredEndpoints } },
      });
    }

    return { sent, failed, total: subscriptions.length };
  }

  /**
   * Gửi thông báo đẩy thử nghiệm (DEV only)
   */
  public async sendTestPush(userId: string) {
    return this.sendPushToUser(userId, {
      title: 'Bò LingLing: Web Push Thử Nghiệm!',
      body: 'Xin chào! Hệ thống thông báo đẩy Web Push của bạn đã hoạt động hoàn hảo 🚀',
      deepLink: '/settings',
      tag: `test-push-${Date.now()}`,
    });
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
