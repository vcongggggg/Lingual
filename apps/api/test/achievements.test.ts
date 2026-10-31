import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/lib/prisma.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { achievementService, CATALOG_ACHIEVEMENTS } from '../src/services/achievementService.js';
import { achievementsRouter } from '../src/routes/achievements.js';
import { JWT_SECRET } from '../src/middleware/rbac.js';
import { NotificationType } from '@prisma/client';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/achievements', achievementsRouter);
  return app;
}

describe('Achievement System Backend Test Suite (lingual-achievement-001)', () => {
  const testUserId = `test-user-ach-${Date.now()}`;
  let token: string;
  let server: any;
  let baseUrl: string;

  before(async () => {
    // 1. Khởi tạo test user
    await userRepository.createUser({
      id: testUserId,
      email: `${testUserId}@lingual.local`,
      displayName: 'Achievement Tester',
    });

    // 2. Tạo JWT token
    token = jwt.sign({ userId: testUserId, role: 'STUDENT' }, JWT_SECRET);

    // 3. Khởi chạy HTTP server cho API test
    const app = createTestApp();
    server = app.listen(0);
    const port = (server.address() as any).port;
    baseUrl = `http://localhost:${port}/api/v1/achievements`;
  });

  after(async () => {
    if (server) {
      server.close();
    }
    // Cleanup dữ liệu test
    try {
      await prisma.notification.deleteMany({ where: { userId: testUserId } });
      await prisma.userAchievement.deleteMany({ where: { userId: testUserId } });
      await prisma.userWordState.deleteMany({ where: { userId: testUserId } });
      await prisma.userGameStat.deleteMany({ where: { userId: testUserId } });
      await prisma.srsReviewLog.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
    } catch (e) {
      // Ignore cleanup error
    }
  });

  it('1. Catalog Consistency: Database chứa đủ 16 huy hiệu chuẩn theo spec', async () => {
    const dbAchievements = await prisma.achievement.findMany({
      where: {
        code: { in: CATALOG_ACHIEVEMENTS.map((a) => a.code) },
      },
    });

    assert.equal(dbAchievements.length, 16, 'DB phải chứa đủ 16 huy hiệu chuẩn');

    const expectedCodes = CATALOG_ACHIEVEMENTS.map((a) => a.code);
    for (const code of expectedCodes) {
      const match = dbAchievements.find((a) => a.code === code);
      assert.ok(match, `Huy hiệu mã ${code} phải tồn tại trong DB`);
    }
  });

  it('2. Scenario Test: Đạt ngưỡng huy hiệu -> Mở khóa đúng 1 UserAchievement và cộng đúng XP', async () => {
    // Ban đầu user chưa có từ vựng nào -> first_word chưa mở
    const initialUser = await prisma.user.findUnique({ where: { id: testUserId } });
    const initialXp = initialUser?.totalXP || 0;

    // Lấy hoặc tạo từ vựng hợp lệ để đảm bảo FK constraint
    let sampleVocab = await prisma.vocabulary.findFirst();
    if (!sampleVocab) {
      sampleVocab = await prisma.vocabulary.create({
        data: {
          word: 'hello',
          meaningVi: 'xin chào',
        },
      });
    }

    // Giả lập user học 1 từ vựng (tạo 1 record UserWordState)
    await prisma.userWordState.create({
      data: {
        userId: testUserId,
        wordId: sampleVocab.id,
        state: 'LEARNING',
      },
    });

    // Gọi evaluate
    const newlyUnlocked = await achievementService.evaluate(testUserId);
    assert.ok(newlyUnlocked.some((a) => a.code === 'first_word'), 'first_word phải nằm trong newlyUnlocked');

    // Kiểm tra DB có đúng 1 record UserAchievement cho first_word
    const firstWordAch = await prisma.achievement.findUnique({ where: { code: 'first_word' } });
    const userAch = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: testUserId,
          achievementId: firstWordAch!.id,
        },
      },
    });
    assert.ok(userAch, 'Bản ghi UserAchievement cho first_word phải tồn tại trong DB');

    // Kiểm tra XP đã được cộng đúng xpBonus (10 XP)
    const updatedUser = await prisma.user.findUnique({ where: { id: testUserId } });
    assert.equal(updatedUser?.totalXP, initialXp + firstWordAch!.xpBonus, 'User totalXP phải tăng đúng 10 XP');
  });

  it('3. Idempotency Test: Gọi evaluate lại nhiều lần -> Không tạo thêm record, XP không bị cộng trùng', async () => {
    const userBefore = await prisma.user.findUnique({ where: { id: testUserId } });
    const countBefore = await prisma.userAchievement.count({ where: { userId: testUserId } });

    // Gọi evaluate lại 3 lần liên tiếp
    const res1 = await achievementService.evaluate(testUserId);
    const res2 = await achievementService.evaluate(testUserId);
    const res3 = await achievementService.evaluate(testUserId);

    assert.equal(res1.length, 0, 'Lần 1 gọi lại không mở thêm huy hiệu nào mới');
    assert.equal(res2.length, 0, 'Lần 2 gọi lại không mở thêm huy hiệu nào mới');
    assert.equal(res3.length, 0, 'Lần 3 gọi lại không mở thêm huy hiệu nào mới');

    const countAfter = await prisma.userAchievement.count({ where: { userId: testUserId } });
    const userAfter = await prisma.user.findUnique({ where: { id: testUserId } });

    assert.equal(countAfter, countBefore, 'Số lượng UserAchievement không đổi');
    assert.equal(userAfter?.totalXP, userBefore?.totalXP, 'totalXP tuyệt đối không bị cộng đúp');
  });

  it('4. Notification Test: Thông báo được tạo với type ACHIEVEMENT và deepLink /achievements', async () => {
    const notifs = await prisma.notification.findMany({
      where: {
        userId: testUserId,
        type: NotificationType.ACHIEVEMENT,
      },
    });

    assert.ok(notifs.length >= 1, 'Phải có ít nhất 1 thông báo ACHIEVEMENT trong bảng notifications');
    const firstNotif = notifs[0];
    assert.equal(firstNotif.type, 'ACHIEVEMENT');
    assert.equal(firstNotif.deepLink, '/achievements');
    assert.ok(firstNotif.title.includes('first_word') || firstNotif.title.includes('Từ vựng đầu tiên') || firstNotif.title.includes('🌱'));
  });

  it('5. Progress Tracking Test: progress.current khớp hoàn toàn với đếm SQL trong DB', async () => {
    // Giả lập thêm dữ liệu: 3 games played và 2 game wins
    await prisma.userGameStat.create({
      data: {
        userId: testUserId,
        gameType: 'word_match',
        totalGamesPlayed: 3,
        totalWins: 2,
      },
    });

    const items = await achievementService.getUserAchievements(testUserId);

    // Kiểm tra first_game: target = 1, current phải = 3 (khớp số game đã chơi)
    const firstGameItem = items.find((i) => i.code === 'first_game');
    assert.ok(firstGameItem, 'first_game item phải có trong danh sách');
    assert.equal(firstGameItem.progress.current, 3, 'current của first_game phải = 3');
    assert.equal(firstGameItem.progress.target, 1);
    assert.equal(firstGameItem.unlocked, true);

    // Kiểm tra game_win_10: target = 10, current phải = 2
    const gameWin10Item = items.find((i) => i.code === 'game_win_10');
    assert.ok(gameWin10Item, 'game_win_10 item phải có trong danh sách');
    assert.equal(gameWin10Item.progress.current, 2, 'current của game_win_10 phải = 2');
    assert.equal(gameWin10Item.progress.target, 10);
    assert.equal(gameWin10Item.unlocked, false);
  });

  it('6. API Test: GET /api/v1/achievements trả đúng danh sách 16 huy hiệu kèm progress', async () => {
    const res = await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assert.equal(res.status, 200);
    const body = (await res.json()) as any;
    assert.ok(Array.isArray(body.achievements), 'Response body phải có field achievements là Array');
    assert.equal(body.achievements.length, 16, 'Danh sách trả về phải có đúng 16 huy hiệu');

    const first = body.achievements[0];
    assert.ok(first.id, 'Phải có id');
    assert.ok(first.code, 'Phải có code');
    assert.ok(first.nameKey, 'Phải có nameKey');
    assert.ok(first.icon, 'Phải có icon');
    assert.ok(typeof first.xpBonus === 'number', 'xpBonus phải là số');
    assert.ok(typeof first.unlocked === 'boolean', 'unlocked phải là boolean');
    assert.ok(first.progress, 'Phải có object progress');
    assert.ok(typeof first.progress.current === 'number', 'progress.current phải là số');
    assert.ok(typeof first.progress.target === 'number', 'progress.target phải là số');
    assert.ok(typeof first.progress.percent === 'number', 'progress.percent phải là số');
  });

  it('7. API Test: GET /api/v1/achievements/summary trả { unlockedCount, totalCount, bonusXpEarned }', async () => {
    const res = await fetch(`${baseUrl}/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assert.equal(res.status, 200);
    const body = (await res.json()) as any;
    assert.ok(typeof body.unlockedCount === 'number', 'unlockedCount phải là số');
    assert.ok(typeof body.totalCount === 'number', 'totalCount phải là số');
    assert.ok(typeof body.bonusXpEarned === 'number', 'bonusXpEarned phải là số');
    assert.equal(body.totalCount, 16, 'totalCount phải bằng 16');
    assert.ok(body.unlockedCount >= 1, 'unlockedCount phải >= 1');
    assert.ok(body.bonusXpEarned >= 10, 'bonusXpEarned phải >= 10');
  });

  it('8. Security Test: Truy cập không có Token bị từ chối 401', async () => {
    const resList = await fetch(baseUrl);
    assert.equal(resList.status, 401, 'GET / không token phải trả 401');

    const resSummary = await fetch(`${baseUrl}/summary`);
    assert.equal(resSummary.status, 401, 'GET /summary không token phải trả 401');
  });
});
