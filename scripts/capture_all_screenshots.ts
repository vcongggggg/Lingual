import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = 'C:\\Study\\HocKy6\\LinguaFlow';
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'screenshot');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const ROUTES = [
  // 1. Landing & Core App
  { name: '01_landing_page_vi', path: '/vi', title: 'Landing Page (Vietnamese)' },
  { name: '02_landing_page_en', path: '/en', title: 'Landing Page (English)' },
  { name: '03_dashboard_roadmap', path: '/vi/dashboard', title: 'Main Learning Roadmap Dashboard' },
  { name: '04_login_page', path: '/vi/login', title: 'Login Page' },
  { name: '05_register_page', path: '/vi/register', title: 'Registration Page' },
  { name: '06_user_profile', path: '/vi/profile', title: 'User Profile & Settings' },
  { name: '07_interactive_lesson', path: '/vi/learn/unit-1-lesson-1', title: 'Interactive Core Lesson' },
  { name: '08_srs_flashcards', path: '/vi/srs', title: 'SM-2 SRS Flashcards Review' },
  { name: '09_dictionary_lookup', path: '/vi/dictionary', title: 'Bilingual Smart Dictionary' },
  { name: '10_arcade_games', path: '/vi/games', title: 'Gamified Arcade Practice' },

  // 2. Listening Lab (Phase 11)
  { name: '11_listening_lab_hub', path: '/vi/listening', title: 'Listening Lab Hub' },
  { name: '12_listening_dictation', path: '/vi/listening/dictation', title: 'Listening Dictation Practice' },
  { name: '13_listening_shadowing', path: '/vi/listening/shadowing', title: 'Listening Shadowing Practice' },

  // 3. Smart Vocabulary Lab (Phase 12)
  { name: '14_vocabulary_lab_hub', path: '/vi/vocabulary', title: 'Smart Vocabulary Lab Hub' },
  { name: '15_vocabulary_practice', path: '/vi/vocabulary/practice', title: 'Vocabulary Multi-mode Practice' },
  { name: '16_vocabulary_test', path: '/vi/vocabulary/test', title: 'Vocabulary Diagnostic Test' },
  { name: '17_vocabulary_word_detail', path: '/vi/vocabulary/word-001', title: 'Smart Word Deep-dive' },
  { name: '18_vocabulary_folder_detail', path: '/vi/vocabulary/folders/folder-001', title: 'Custom Vocabulary Folder' },

  // 4. Writing Lab (Phase 13)
  { name: '19_writing_lab_hub', path: '/vi/writing', title: 'Writing Lab Hub' },
  { name: '20_writing_see_write', path: '/vi/writing/see-write', title: 'See & Write Visual Exercise' },
  { name: '21_writing_guided_essay', path: '/vi/writing/guided', title: 'Guided Essay Writing' },
  { name: '22_writing_free_journal', path: '/vi/writing/free', title: 'Free Expression Journal' },

  // 5. Reading Lab (Phase 14)
  { name: '23_reading_lab_hub', path: '/vi/reading', title: 'Reading Lab Hub' },
  { name: '24_reading_article_view', path: '/vi/reading/a1-morning-coffee', title: 'Graded Reading Article Reader' },
  { name: '25_reading_comprehension_quiz', path: '/vi/reading/a1-morning-coffee/practice', title: 'Reading Comprehension Quiz' },
  { name: '26_reading_history_analytics', path: '/vi/reading/history', title: 'Reading History & Metrics' },

  // 6. Speaking Lab (Phase 18)
  { name: '27_speaking_lab_hub', path: '/vi/speaking', title: 'Speaking Lab Hub' },
  { name: '28_speaking_repetition', path: '/vi/speaking/repetition', title: 'Sentence Repetition Practice' },
  { name: '29_speaking_pronunciation', path: '/vi/speaking/pronunciation', title: 'Minimal Pairs & Phoneme Trainer' },
  { name: '30_speaking_shadowing', path: '/vi/speaking/shadowing', title: 'Audio Shadowing & Speech Sync' },
  { name: '31_speaking_picture_describe', path: '/vi/speaking/picture', title: 'Picture Description' },
  { name: '32_speaking_situation_dialogue', path: '/vi/speaking/situation', title: 'Real-world Roleplay Dialogue' },
  { name: '33_speaking_free_speech', path: '/vi/speaking/free', title: 'Free Spoken Presentation' },
  { name: '34_speaking_history_analytics', path: '/vi/speaking/history', title: 'Speaking Performance History' },

  // 7. Exam Practice Lab (Phase 15)
  { name: '35_exam_practice_hub', path: '/vi/exam-practice', title: 'Exam Practice Lab Hub' },
  { name: '36_exam_toeic_simulation', path: '/vi/exam-practice/toeic-full-01', title: 'Full TOEIC Exam Simulation' },
  { name: '37_exam_history', path: '/vi/exam-practice/history', title: 'Exam Attempt History' },
  { name: '38_exam_score_stats', path: '/vi/exam-practice/stats', title: 'Exam Score & Scaled Analytics' },

  // 8. IELTS Preparation Hub
  { name: '39_ielts_hub', path: '/vi/ielts', title: 'IELTS Master Hub' },
  { name: '40_ielts_band_roadmap', path: '/vi/ielts/roadmap', title: 'IELTS Band Score Roadmap' },
  { name: '41_ielts_practice_listening', path: '/vi/ielts/practice/listening', title: 'IELTS Listening Section Practice' },
  { name: '42_ielts_practice_reading', path: '/vi/ielts/practice/reading', title: 'IELTS Reading Section Practice' },
  { name: '43_ielts_practice_writing', path: '/vi/ielts/practice/writing', title: 'IELTS Academic Writing Task' },
  { name: '44_ielts_full_mock_test', path: '/vi/ielts/mock-test', title: 'IELTS Full Simulated Mock Test' },

  // 9. Community & Social Learning (Phase 16)
  { name: '45_community_feed_hub', path: '/vi/community', title: 'Community Social Feed Hub' },
  { name: '46_community_leaderboard', path: '/vi/community/leaderboard', title: 'Global & Weekly Leaderboard' },
  { name: '47_community_study_notes', path: '/vi/community/notes', title: 'Shared Study Notes Feed' },
  { name: '48_community_study_groups', path: '/vi/community/groups', title: 'Study Groups Directory' },
  { name: '49_community_friends_network', path: '/vi/community/friends', title: 'Friends & Followers Network' },
  { name: '50_community_achievements_wall', path: '/vi/community/achievements', title: 'Trophy Room & Badges' },

  // 10. Learning Analytics & Personal Intelligence (Phase 17)
  { name: '51_analytics_intelligence_dashboard', path: '/vi/analytics', title: 'Learning Intelligence Radar & Overview' },
  { name: '52_analytics_reading_skill', path: '/vi/analytics/reading', title: 'Skill Deep-dive: Reading' },
  { name: '53_analytics_writing_skill', path: '/vi/analytics/writing', title: 'Skill Deep-dive: Writing' },
  { name: '54_analytics_listening_skill', path: '/vi/analytics/listening', title: 'Skill Deep-dive: Listening' },
  { name: '55_analytics_speaking_skill', path: '/vi/analytics/speaking', title: 'Skill Deep-dive: Speaking' },
  { name: '56_analytics_vocabulary_skill', path: '/vi/analytics/vocabulary', title: 'Skill Deep-dive: Vocabulary' },

  // 11. Personalized AI Tutor & Adaptive Learning Lab (Phase 19)
  { name: '57_ai_tutor_chat_workspace', path: '/vi/tutor', title: 'Personalized AI Tutor Interactive Chat' },
  { name: '58_ai_tutor_dashboard_analytics', path: '/vi/tutor/dashboard', title: 'AI Tutor Performance Dashboard' },
  { name: '59_ai_tutor_adaptive_plan', path: '/vi/tutor/plan', title: '7-Day Personalized Adaptive Study Plan' },
  { name: '60_ai_tutor_conversation_history', path: '/vi/tutor/history', title: 'AI Tutor History & Review Records' },

  // 12. Security & Administrative Portal
  { name: '61_admin_dashboard', path: '/vi/admin', title: 'Administrative Control Center' },
  { name: '62_admin_security_audit_log', path: '/vi/admin/audit-log', title: 'Security & User Audit Trail' },
];

async function run() {
  console.log('🚀 Starting LinguaFlow Full UI Screenshot Capture Automation...');
  console.log(`📁 Saving screenshots to: ${SCREENSHOT_DIR}`);

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  // Seed authentication token
  try {
    await page.goto('http://localhost:3000/vi', { waitUntil: 'commit', timeout: 10000 });
    await page.evaluate(() => {
      localStorage.setItem('lingual_token', 'demo-jwt-token-production-verified');
      localStorage.setItem(
        'lingual_user',
        JSON.stringify({
          id: 'demo-user-id-001',
          email: 'lingflow.student@example.com',
          displayName: 'Trần Minh Anh',
          role: 'SUPER_ADMIN',
          totalXP: 1450,
          currentStreak: 12,
          streakFreezes: 2,
          timezone: 'Asia/Ho_Chi_Minh',
        })
      );
    });
  } catch (e: any) {
    console.warn('Initial session seeding note:', e.message);
  }

  let captured = 0;
  for (const route of ROUTES) {
    const targetUrl = `http://localhost:3000${route.path}`;
    const screenshotPath = path.join(SCREENSHOT_DIR, `${route.name}.png`);

    try {
      console.log(`📸 [${captured + 1}/${ROUTES.length}] Capturing: ${route.title} (${route.path})...`);
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(600); // Allow motion animations and icons to settle

      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
      });
      captured++;
    } catch (err: any) {
      console.error(`⚠️ Failed to capture ${route.path}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n🎉 SUCCESS: Captured ${captured}/${ROUTES.length} interface screenshots in folder '${SCREENSHOT_DIR}'!`);
}

run().catch((err) => {
  console.error('Fatal screenshot runner error:', err);
  process.exit(1);
});
