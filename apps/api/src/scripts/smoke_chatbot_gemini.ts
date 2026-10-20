import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

import { geminiChatService } from '../services/geminiChatService.js';
import { prisma } from '../lib/prisma.js';

async function runSmokeTests() {
  console.log('====================================================');
  console.log('🚀 BẮT ĐẦU SMOKE TEST CHATBOT LINGLING R2.0 (GEMINI)');
  console.log('====================================================\n');

  const userId = 'test-user-1792223131291';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('FAIL: GEMINI_API_KEY không tìm thấy trong file cấu hình .env');
  }

  // TEST 1: Kiểm tra Grounding Data thật từ DB
  console.log('--- TEST 1: Nạp Grounding Data thực tế từ DB ---');
  const grounding = await geminiChatService.getUserGroundingData(userId);
  console.log('Grounding Data:', {
    currentStreak: grounding.currentStreak,
    goldenHour: grounding.goldenHour,
    weakestSkill: grounding.weakestSkill,
    weakestSkillScore: grounding.weakestSkillScore,
    srsDueCount: grounding.srsDueCount,
    forgottenWordsCount: grounding.forgottenWords.length,
  });

  // TEST 2: Gửi câu hỏi thật đến Gemini LLM
  console.log('\n--- TEST 2: Gửi message thật đến Gemini LLM qua geminiChatService ---');
  const startTime = Date.now();
  const testMessage = 'Điểm yếu của tớ hiện tại là kỹ năng gì và chuỗi streak của tớ ra sao? Bò LingLing có lời khuyên gì không?';
  
  const result = await geminiChatService.chat(userId, testMessage, []);
  const totalElapsed = Date.now() - startTime;

  console.log(`⏱️ Thời gian phản hồi: ${result.responseTimeMs}ms (toàn bộ: ${totalElapsed}ms)`);
  console.log(`🤖 Provider: ${result.provider}`);
  console.log(`🧠 Model: ${result.model}`);
  console.log(`🐮 Mascot Mood Tag: ${result.mood}`);
  console.log(`🎯 AI Connected: ${result.aiConnected}`);
  console.log(`💬 Phản hồi từ Bò LingLing (Gemini):\n"${result.reply}"\n`);

  // Verify Provider
  if (result.provider !== 'gemini') {
    throw new Error(`FAIL: Provider không phải 'gemini', thực tế là: ${result.provider}`);
  }

  // Verify grounding references trong reply
  const replyLower = result.reply.toLowerCase();
  const mentionedWeakSkill = replyLower.includes(grounding.weakestSkill.toLowerCase()) || 
                             replyLower.includes('nghe') || 
                             replyLower.includes('nói') || 
                             replyLower.includes('listening') ||
                             replyLower.includes('speaking');
  const mentionedStreak = replyLower.includes('streak') || 
                          replyLower.includes('chuỗi') || 
                          replyLower.includes(String(grounding.currentStreak));

  console.log('Grounding Verification:');
  console.log(`- Nhắc đến điểm yếu kỹ năng (${grounding.weakestSkill}): ${mentionedWeakSkill ? '✅ CÓ' : '⚠️ KHÔNG RÕ'}`);
  console.log(`- Nhắc đến chuỗi streak (${grounding.currentStreak} ngày): ${mentionedStreak ? '✅ CÓ' : '⚠️ KHÔNG RÕ'}`);

  // TEST 3: Kiểm tra trường hợp KHÔNG có key -> Báo rõ 'chưa kết nối AI'
  console.log('\n--- TEST 3: Kiểm tra khi KHÔNG có GEMINI_API_KEY ---');
  const originalKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    await geminiChatService.chat(userId, 'Xin chào Bò', []);
    throw new Error('FAIL: Lẽ ra phải ném lỗi khi thiếu GEMINI_API_KEY nhưng hàm lại chạy thành công!');
  } catch (err: any) {
    if (err.message.includes('Chưa kết nối AI')) {
      console.log(`✅ SUCCESS: Hệ thống đã chặn và báo rõ lỗi chính xác: "${err.message}"`);
    } else {
      throw new Error(`FAIL: Lỗi trả về không đúng chuẩn 'Chưa kết nối AI': ${err.message}`);
    }
  } finally {
    process.env.GEMINI_API_KEY = originalKey;
  }

  console.log('\n====================================================');
  console.log('🎉 TOÀN BỘ SMOKE TEST CHATBOT GEMINI ĐÃ PASS 100%!');
  console.log('====================================================');
}

runSmokeTests()
  .catch((err) => {
    console.error('❌ SMOKE TEST FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
