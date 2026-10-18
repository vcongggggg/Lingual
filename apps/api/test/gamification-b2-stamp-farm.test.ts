import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { stampRepository, StampRepository } from '../src/repositories/stamp.repository.js';
import { getFormattedDateInTimezone } from '../../../packages/domain/src/index.js';

describe('B2: Anti-Farm Stamp Ledger & Persistent Free Writing Engine', () => {
  const vnTimezone = 'Asia/Ho_Chi_Minh';
  const todayStr = getFormattedDateInTimezone(new Date(), vnTimezone);

  it('1. DoD B2.1: Gọi award với DAILY_GOAL 3 lần cùng ngày -> chỉ lần 1 thành công, lần 2 và 3 bị từ chối', async () => {
    const testUserId = `test-antifarm-user-${Date.now()}`;

    // Lần 1: Thành công
    const call1 = await stampRepository.awardStamps(testUserId, 'DAILY_GOAL', 1);
    assert.equal(call1.success, true, 'Lần gọi 1 phải thành công');
    assert.equal(call1.deltaAwarded, 1, 'Lần gọi 1 được cộng +1 tem');

    // Lần 2: Thất bại do trùng ngày
    const call2 = await stampRepository.awardStamps(testUserId, 'DAILY_GOAL', 1);
    assert.equal(call2.success, false, 'Lần gọi 2 phải bị từ chối');
    assert.equal(call2.deltaAwarded, 0, 'Lần gọi 2 không được cộng thêm tem');
    assert.ok(call2.message.includes('Mỗi ngày chỉ được nhận 1 lần'));

    // Lần 3: Thất bại do trùng ngày
    const call3 = await stampRepository.awardStamps(testUserId, 'DAILY_GOAL', 1);
    assert.equal(call3.success, false, 'Lần gọi 3 phải bị từ chối');
    assert.equal(call3.deltaAwarded, 0, 'Lần gọi 3 không được cộng thêm tem');
  });

  it('2. DoD B2.2: Balance không vượt quá cap 10 dù cộng nhiều lần với các lý do khác nhau', async () => {
    const testUserId = `test-cap10-user-${Date.now()}`;

    // Giả lập cộng dồn cho đến mức 9
    for (let i = 0; i < 9; i++) {
      await stampRepository.awardStamps(testUserId, `SPECIAL_MISSION_${i}`, 1);
    }

    const currentBal = await stampRepository.getBalance(testUserId);
    assert.equal(currentBal, 9, 'Số dư hiện tại là 9');

    // Thử cộng thêm 5 tem -> chỉ được cộng tối đa 1 để đạt cap 10
    const overCall = await stampRepository.awardStamps(testUserId, 'OVER_CAP_TASK', 5);
    assert.equal(overCall.success, true);
    assert.equal(overCall.deltaAwarded, 1, 'Chỉ nhận 1 tem để chạm cap 10');
    assert.equal(overCall.newBalance, 10, 'Số dư mới là 10');

    // Thử cộng tiếp khi đã đầy 10 tem -> bị từ chối hoàn toàn
    const fullCall = await stampRepository.awardStamps(testUserId, 'ANOTHER_TASK', 1);
    assert.equal(fullCall.success, false, 'Phải từ chối vì sổ đã đầy');
    assert.equal(fullCall.newBalance, 10, 'Số dư vẫn là 10');
    assert.ok(fullCall.message.includes('Sổ tem đã đầy (tối đa 10 tem)'));
  });

  it('3. DoD B2.3: Restart server không reset lượt free writing (được lưu bền vững trên đĩa)', async () => {
    const testUserId = `test-persist-writing-${Date.now()}`;

    // Đổi lượt chấm: Lần đầu tiên phải là free
    const redeem1 = await stampRepository.redeemWritingEvaluation(testUserId, todayStr);
    assert.equal(redeem1.success, true);
    assert.equal(redeem1.isFree, true, 'Lần 1 trong ngày phải là free');
    assert.equal(redeem1.stampDeducted, 0);

    // Giả lập Restart Server bằng cách khởi tạo một instance StampRepository hoàn toàn mới
    const freshRepositoryInstance = new StampRepository();
    freshRepositoryInstance.load();

    // Kiểm tra xem instance mới có nhớ user đã dùng lượt free hôm nay không
    const usedAfterRestart = await freshRepositoryInstance.hasUsedFreeWritingToday(testUserId, todayStr);
    assert.equal(usedAfterRestart, true, 'Sau khi restart server, lượt free hôm nay vẫn đã được dùng');

    // User không còn tem mà gọi tiếp -> báo "Hết tem, mai quay lại"
    const redeem2 = await freshRepositoryInstance.redeemWritingEvaluation(testUserId, todayStr);
    assert.equal(redeem2.success, false);
    assert.equal(redeem2.message, 'Hết tem, mai quay lại');
  });

  it('4. DoD B2.4: Grep kiểm tra không còn stamp-init- trong toàn bộ mã nguồn', () => {
    const srcDir = fs.existsSync(path.resolve(process.cwd(), 'src'))
      ? path.resolve(process.cwd(), 'src')
      : path.resolve(process.cwd(), 'apps/api/src');
    const walkSync = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(walkSync(fullPath));
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
          results.push(fullPath);
        }
      });
      return results;
    };

    const allFiles = walkSync(srcDir);
    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.equal(
        content.includes('stamp-init-'),
        false,
        `File ${filePath} không được chứa stamp-init-`
      );
    }
  });
});
