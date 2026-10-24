import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

import { PrismaClient, NotificationType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import http from 'http';

const prisma = new PrismaClient();
// Server currently running with JWT_SECRET from apps/api/.env
const JWT_SECRET = 'linguaflow_super_secret_jwt_key_2026_production';

async function main() {
  console.log('=== [SEED NOTIFICATIONS FOR TOUR TEST] ===');

  // 1. Tìm tài khoản test@linguaflow.com
  const user = await prisma.user.findUnique({
    where: { email: 'test@linguaflow.com' },
  });

  if (!user) {
    throw new Error('Không tìm thấy tài khoản test@linguaflow.com trong database!');
  }

  console.log(`[1] Tìm thấy User: ID = ${user.id}, Email = ${user.email}, Name = ${user.displayName}`);

  // 2. Đảm bảo cấu hình Preferences mở thông báo
  const pref = await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      enabled: true,
      srsDue: true,
      streakRisk: true,
      goldenHour: true,
      weakSkill: true,
      forgetfulWords: true,
      weekly: true,
      achievement: true,
      quietStart: '23:00',
      quietEnd: '06:00',
    },
    update: {
      enabled: true,
      srsDue: true,
      streakRisk: true,
      goldenHour: true,
      weakSkill: true,
      forgetfulWords: true,
      weekly: true,
      achievement: true,
    },
  });
  console.log('[2] Notification Preferences đã sẵn sàng (enabled = true).');

  // 3. Xóa các notification cũ để tạo dữ liệu chuẩn UTF-8
  const deleted = await prisma.notification.deleteMany({
    where: { userId: user.id },
  });
  console.log(`[3] Đã xóa ${deleted.count} thông báo cũ để reset chuẩn xác.`);

  // 4. Tạo các notification mẫu đa dạng cho Tour test
  const notificationsToCreate = [
    {
      userId: user.id,
      type: NotificationType.STREAK_AT_RISK,
      title: '🔥 Chuỗi ngày học sắp kết thúc!',
      body: 'Đừng quên hoàn thành ít nhất 1 bài học hôm nay để bảo toàn streak cùng Bò LingLing nhé!',
      deepLink: '/practice',
      isRead: false,
      dedupeKey: 'tour-streak-001',
      metadata: { streakCount: 7, hoursLeft: 3 },
    },
    {
      userId: user.id,
      type: NotificationType.SRS_DUE,
      title: '📚 15 từ vựng cần ôn tập ngay',
      body: 'Thuật toán SRS phát hiện 15 từ vựng đến hạn ôn tập để tránh rơi vào đường cong quên lãng.',
      deepLink: '/practice',
      isRead: false,
      dedupeKey: 'tour-srs-001',
      metadata: { dueWordCount: 15 },
    },
    {
      userId: user.id,
      type: NotificationType.WEEKLY_REPORT,
      title: '📊 Báo cáo học tập tuần đã sẵn sàng',
      body: 'Xem ngay tiến độ phân tích điểm yếu và nhận xét cá nhân hóa từ AI Cow LingLing.',
      deepLink: '/analytics',
      isRead: false,
      dedupeKey: 'tour-weekly-001',
      metadata: { week: 43 },
    },
    {
      userId: user.id,
      type: NotificationType.ACHIEVEMENT,
      title: '🏆 Mở khóa danh hiệu mới!',
      body: 'Chúc mừng bạn vừa đạt huy hiệu "Chiến Binh Kiên Trì" sau chuỗi ngày học tập tích cực.',
      deepLink: '/profile',
      isRead: true,
      readAt: new Date(),
      dedupeKey: 'tour-achieve-001',
      metadata: { badgeId: 'consistent-warrior' },
    },
  ];

  for (const notif of notificationsToCreate) {
    const created = await prisma.notification.create({
      data: notif,
    });
    console.log(`[4] Đã tạo notification: [${created.type}] ${created.title} (isRead: ${created.isRead})`);
  }

  // 5. Kiểm tra trực tiếp qua API endpoint GET /api/v1/notifications
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('[5] Kiểm tra trực tiếp qua HTTP API GET /api/v1/notifications...');

  const apiResult = await new Promise<{ status: number; data: any }>((resolve, reject) => {
    const req = http.request(
      'http://localhost:4000/api/v1/notifications',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode || 0, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });

  console.log(`[5] API Status: ${apiResult.status}`);
  console.log(`[5] API Total: ${apiResult.data?.total}`);
  console.log('[5] API Notifications:');
  apiResult.data?.notifications?.forEach((n: any) => {
    console.log(`   - [${n.type}] ${n.title} (DeepLink: ${n.deepLink}, Read: ${n.isRead})`);
  });

  // 6. Kiểm tra unread count
  const countResult = await new Promise<{ status: number; data: any }>((resolve, reject) => {
    const req = http.request(
      'http://localhost:4000/api/v1/notifications/unread-count',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 0, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode || 0, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });

  console.log(`[6] Unread Count Status: ${countResult.status}, Count: ${countResult.data?.count}`);

  if (apiResult.data?.total >= 1) {
    console.log('\n>>> [DEFINITION OF DONE: SUCCESS] GET /api/v1/notifications trả về total >= 1!');
  } else {
    throw new Error('FAIL: GET /api/v1/notifications trả về total < 1');
  }
}

main()
  .catch((err) => {
    console.error('[ERROR]', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
