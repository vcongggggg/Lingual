import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

import { prisma } from '../lib/prisma.js';
import { geminiInsightsService } from '../services/geminiInsightsService.js';

async function main() {
  const userId = 'test-user-1792223131291';
  console.log(`[TEST ROUND-TRIP] Bắt đầu test round-trip cho user: ${userId}`);

  // 1. Test Weekly Report
  console.log('[1/4] Đang generate Weekly Cow Report...');
  const reportCreated = await geminiInsightsService.generateWeeklyReport(userId, true);
  console.log(`[1/4] Đã tạo report thành công: ID = ${reportCreated.id}, Tuần = ${reportCreated.weekNumber}`);

  console.log('[2/4] Đang đọc lại Weekly Report từ DB qua getLatestWeeklyReport...');
  const reportFetched = await geminiInsightsService.getLatestWeeklyReport(userId);
  if (!reportFetched) {
    throw new Error('FAIL: Không đọc được report từ DB!');
  }
  if (reportFetched.id !== reportCreated.id) {
    throw new Error(`FAIL: ID không khớp! Created: ${reportCreated.id}, Fetched: ${reportFetched.id}`);
  }
  console.log(`[2/4] SUCCESS: Round-trip Weekly Report KHỚP 100%! Title = "${reportFetched.title}"`);

  // 2. Test Study Plan
  console.log('[3/4] Đang generate 7-Day Study Plan...');
  const planCreated = await geminiInsightsService.generateStudyPlan(userId, 'ielts', true);
  console.log(`[3/4] Đã tạo Study Plan thành công: Goal = ${planCreated.goalLabel}, Days = ${planCreated.days.length}`);

  console.log('[4/4] Đang đọc lại Study Plan từ DB qua getStudyPlan...');
  const planFetched = await geminiInsightsService.getStudyPlan(userId);
  if (!planFetched) {
    throw new Error('FAIL: Không đọc được study plan từ DB!');
  }
  if (planFetched.days.length !== planCreated.days.length) {
    throw new Error(`FAIL: Số ngày không khớp! Created: ${planCreated.days.length}, Fetched: ${planFetched.days.length}`);
  }
  console.log(`[4/4] SUCCESS: Round-trip Study Plan KHỚP 100%! Goal = "${planFetched.goalLabel}"`);

  console.log('\n=============================================');
  console.log('✅ ALL ROUND-TRIP TESTS PASSED THÀNH CÔNG RỰC RỠ!');
  console.log('=============================================');
}

main()
  .catch((err) => {
    console.error('❌ ROUND-TRIP TEST FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
