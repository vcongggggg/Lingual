import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { userRepository } from '../src/repositories/user.repository.js';
import {
  getFormattedDateInTimezone,
  getFormattedWeekInTimezone,
  getYesterdayDateString,
  getDayDifference,
  updateStreakWithTimezone,
} from '../../../packages/domain/src/index.js';

describe('B1: Server-side Leave Pass & Streak Protection Engine', () => {
  const vnTimezone = 'Asia/Ho_Chi_Minh';

  it('1. Cấp phiếu lười (lazy-grant) phía server khi sang tuần mới (Asia/Ho_Chi_Minh)', async () => {
    const testUserId = `test-lazy-user-${Date.now()}`;
    const pastWeek = '2026-W01';

    // Tạo user với tuần cũ
    const user = await userRepository.createUser({
      id: testUserId,
      email: `${testUserId}@lingual.local`,
      displayName: 'Lazy Grant Learner',
    });

    // Ép về tuần cũ và 0 phiếu
    user.lastLeavePassGrantWeek = pastWeek;
    user.leavePasses = 0;
    user.leave_passes = 0;

    // Đọc lại user -> trigger lazy grant
    const evaluated = await userRepository.ensureLeavePassesGranted(user, new Date());
    const currentVnWeek = getFormattedWeekInTimezone(new Date(), vnTimezone);

    assert.equal(evaluated.leavePasses, 1, 'Lazy grant phải cấp đúng 1 phiếu');
    assert.equal(evaluated.leave_passes, 1, 'Snake_case leave_passes phải bằng 1');
    assert.equal(evaluated.lastLeavePassGrantWeek, currentVnWeek, 'Tuần cấp phải khớp tuần hiện tại tại Asia/Ho_Chi_Minh');
  });

  it('2. DoD B1.1: User miss 1 ngày + còn 1 phiếu -> streak giữ nguyên, phiếu còn 0, leavePassUsed=true', async () => {
    const testUserId = `test-miss-with-pass-${Date.now()}`;
    const user = await userRepository.createUser({
      id: testUserId,
      email: `${testUserId}@lingual.local`,
      displayName: 'Protected Learner',
    });

    // Giả lập trạng thái: streak = 5, hoạt động gần nhất là 2 ngày trước (miss hôm qua)
    const todayStr = getFormattedDateInTimezone(new Date(), vnTimezone);
    const yesterdayStr = getYesterdayDateString(todayStr);
    const twoDaysAgoStr = getYesterdayDateString(yesterdayStr);

    user.currentStreak = 5;
    user.leavePasses = 1;
    user.leave_passes = 1;
    user.lastActiveDate = twoDaysAgoStr;
    user.lastLeavePassUsedDate = null;
    await userRepository.persistUser(user);

    // Server tính toán streak
    const res = await userRepository.evaluateStreakAndLeavePasses(user.id);

    assert.equal(res.streakMaintained, true, 'Streak phải được giữ nguyên');
    assert.equal(res.currentStreak, 5, 'Số ngày streak phải giữ nguyên mức 5');
    assert.equal(res.leavePasses, 0, 'Phiếu nghỉ phép phải bị trừ còn 0');
    assert.equal(res.leavePassUsed, true, 'Flag leavePassUsed phải là true');
  });

  it('3. DoD B1.2: User miss 1 ngày + 0 phiếu -> streak reset về 0', async () => {
    const testUserId = `test-miss-zero-pass-${Date.now()}`;
    const user = await userRepository.createUser({
      id: testUserId,
      email: `${testUserId}@lingual.local`,
      displayName: 'Unprotected Learner',
    });

    const todayStr = getFormattedDateInTimezone(new Date(), vnTimezone);
    const yesterdayStr = getYesterdayDateString(todayStr);
    const twoDaysAgoStr = getYesterdayDateString(yesterdayStr);
    const currentWeek = getFormattedWeekInTimezone(new Date(), vnTimezone);

    user.currentStreak = 12;
    user.leavePasses = 0;
    user.leave_passes = 0;
    user.lastLeavePassGrantWeek = currentWeek; // Đã grant trong tuần rồi nên không được lazy-grant thêm
    user.lastActiveDate = twoDaysAgoStr;
    await userRepository.persistUser(user);

    // Server tính toán streak
    const res = await userRepository.evaluateStreakAndLeavePasses(user.id);

    assert.equal(res.streakBroken, true, 'Streak phải bị đánh dấu là đứt');
    assert.equal(res.currentStreak, 0, 'Streak phải reset về 0');
    assert.equal(res.leavePasses, 0, 'Số phiếu vẫn là 0');
    assert.equal(res.leavePassUsed, false, 'Không dùng được phiếu');
  });

  it('4. DoD B1.3: Đổi timezone máy client không ảnh hưởng kết quả server (server dùng Asia/Ho_Chi_Minh)', async () => {
    // Giả lập 2 thời điểm khác nhau ở các múi giờ khác nhau trên thế giới
    // Server luôn quy đổi về Asia/Ho_Chi_Minh
    const utcDate = new Date('2026-10-18T18:00:00.000Z'); // 18:00 UTC = 01:00 AM ngày 19/10 tại Hà Nội (GMT+7)
    const vnDateStr = getFormattedDateInTimezone(utcDate, 'Asia/Ho_Chi_Minh');
    const usDateStr = getFormattedDateInTimezone(utcDate, 'America/Los_Angeles');

    // Chứng minh ngày tại VN khác ngày tại Los Angeles
    assert.equal(vnDateStr, '2026-10-19', 'Tại Việt Nam đã là ngày 19/10');
    assert.equal(usDateStr, '2026-10-18', 'Tại US mới là ngày 18/10');

    // Khi client gửi request dù client ở bất kỳ đâu, server luôn dùng Asia/Ho_Chi_Minh
    const streakResult = updateStreakWithTimezone(
      {
        currentStreak: 5,
        streakFreezes: 0,
        leavePasses: 1,
        lastActiveDate: '2026-10-17',
      },
      utcDate,
      'Asia/Ho_Chi_Minh'
    );

    // Tại VN: 2026-10-19 so với 2026-10-17 là diff 2 ngày -> tiêu 1 leave pass để cứu streak!
    assert.equal(streakResult.leavePassUsed, true);
    assert.equal(streakResult.leavePasses, 0);
    assert.equal(streakResult.currentStreak, 6);
  });
});
