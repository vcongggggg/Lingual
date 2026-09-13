import { PrismaClient } from '@prisma/client';
import { MASTER_READING_ARTICLES } from '../apps/api/src/data/reading.js';
import { MASTER_SPEAKING_PROMPTS } from '../apps/api/src/routes/speakingData.js';
import { MASTER_EXAMS } from '../apps/api/src/routes/examData.js';
import { MASTER_WRITING_PROMPTS } from '../apps/api/src/data/writingExpandedData.js';

const prisma = new PrismaClient();

const SEED_WRITING_PROMPTS = MASTER_WRITING_PROMPTS;

// Major Topics & Sub Topics Tree
const SEED_MAJOR_TOPICS = [
  {
    id: 'topic-cefr-a1',
    title: 'CEFR A1: Mới Bắt Đầu',
    levelBadge: 'A1 Beginner',
    categoryGroup: 'cefr',
    description: 'Nền tảng phát âm, chào hỏi, gia đình, sở thích và từ vựng thông dụng cơ bản nhất.',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    order: 1,
    subTopics: [
      { id: 'sub-a1-greetings', title: 'Chào hỏi & Giới thiệu', coverImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80', order: 1 },
      { id: 'sub-a1-family', title: 'Gia đình & Bạn bè', coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&auto=format&fit=crop&q=80', order: 2 },
      { id: 'sub-a1-daily', title: 'Hoạt động thường ngày', coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80', order: 3 },
    ],
  },
  {
    id: 'topic-cefr-a2',
    title: 'CEFR A2: Sơ Cấp',
    levelBadge: 'A2 Elementary',
    categoryGroup: 'cefr',
    description: 'Giao tiếp du lịch, mua sắm, ẩm thực, phương hướng và miêu tả trải nghiệm.',
    coverImage: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&auto=format&fit=crop&q=80',
    order: 2,
    subTopics: [
      { id: 'sub-a2-travel', title: 'Du lịch & Khám phá', coverImage: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=500&auto=format&fit=crop&q=80', order: 1 },
      { id: 'sub-a2-food', title: 'Ẩm thực & Nhà hàng', coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80', order: 2 },
      { id: 'sub-a2-shopping', title: 'Mua sắm & Dịch vụ', coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=80', order: 3 },
    ],
  },
  {
    id: 'topic-cefr-b1',
    title: 'CEFR B1: Trung Cấp',
    levelBadge: 'B1 Intermediate',
    categoryGroup: 'cefr',
    description: 'Công việc, công nghệ, bảo vệ môi trường, tranh luận ý kiến và viết thư thương mại.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    order: 3,
    subTopics: [
      { id: 'sub-b1-workplace', title: 'Môi trường Công sở', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80', order: 1 },
      { id: 'sub-b1-tech', title: 'Công nghệ & Đổi mới', coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80', order: 2 },
      { id: 'sub-b1-ecology', title: 'Môi trường & Sinh thái', coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=80', order: 3 },
    ],
  },
  {
    id: 'topic-toeic-focus',
    title: 'TOEIC Mastery 800+',
    levelBadge: 'TOEIC Exam',
    categoryGroup: 'exam',
    description: 'Từ vựng cốt lõi Part 1-7: Kinh doanh quốc tế, hợp đồng, hội nghị, nhân sự, tài chính.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    order: 4,
    subTopics: [
      { id: 'sub-toeic-office', title: 'Office Operations', coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop&q=80', order: 1 },
      { id: 'sub-toeic-finance', title: 'Finance & Banking', coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80', order: 2 },
      { id: 'sub-toeic-travel', title: 'Business Travel & Logistics', coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=80', order: 3 },
    ],
  },
  {
    id: 'topic-ielts-academic',
    title: 'IELTS Academic Band 7.0+',
    levelBadge: 'IELTS Academic',
    categoryGroup: 'exam',
    description: 'Học thuật chuyên sâu: Khoa học dữ liệu, biến đổi khí hậu, tâm lý học, toàn cầu hóa.',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    order: 5,
    subTopics: [
      { id: 'sub-ielts-science', title: 'Science & Innovation', coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=80', order: 1 },
      { id: 'sub-ielts-society', title: 'Urbanization & Society', coverImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&auto=format&fit=crop&q=80', order: 2 },
      { id: 'sub-ielts-education', title: 'Education & Future Skills', coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80', order: 3 },
    ],
  },
];

// Daily Quests
const SEED_DAILY_QUESTS = [
  { id: 'dq-vocab-15', date: 'default', questType: 'vocabulary', title: 'Ôn tập 15 từ vựng với Spaced Repetition', targetCount: 15, xpReward: 30 },
  { id: 'dq-read-1', date: 'default', questType: 'reading', title: 'Đọc và hoàn thành 1 bài đọc hiểu', targetCount: 1, xpReward: 35 },
  { id: 'dq-write-1', date: 'default', questType: 'writing', title: 'Hoàn thành 1 bài viết ở Writing Lab', targetCount: 1, xpReward: 40 },
  { id: 'dq-speak-2', date: 'default', questType: 'speaking', title: 'Luyện phát âm chuẩn 2 câu trong Speaking Lab', targetCount: 2, xpReward: 40 },
  { id: 'dq-exam-1', date: 'default', questType: 'exam', title: 'Làm 1 bài luyện thi trắc nghiệm TOEIC / VSTEP', targetCount: 1, xpReward: 50 },
  { id: 'dq-xp-100', date: 'default', questType: 'xp', title: 'Tích lũy 100 XP trong ngày', targetCount: 100, xpReward: 45 },
];

export async function seedComprehensive() {
  console.log('🚀 Starting Comprehensive LinguaFlow Database Seeding...');

  // 1. Seed Major Topics & Sub Topics
  console.log('📦 Seeding Major Topics and Sub Topics...');
  for (const topic of SEED_MAJOR_TOPICS) {
    const major = await prisma.majorTopic.upsert({
      where: { id: topic.id },
      update: {
        title: topic.title,
        levelBadge: topic.levelBadge,
        categoryGroup: topic.categoryGroup,
        description: topic.description,
        coverImage: topic.coverImage,
        order: topic.order,
      },
      create: {
        id: topic.id,
        title: topic.title,
        levelBadge: topic.levelBadge,
        categoryGroup: topic.categoryGroup,
        description: topic.description,
        coverImage: topic.coverImage,
        order: topic.order,
      },
    });

    for (const sub of topic.subTopics) {
      await prisma.subTopic.upsert({
        where: { id: sub.id },
        update: {
          title: sub.title,
          coverImage: sub.coverImage,
          order: sub.order,
          majorTopicId: major.id,
        },
        create: {
          id: sub.id,
          majorTopicId: major.id,
          title: sub.title,
          coverImage: sub.coverImage,
          order: sub.order,
        },
      });
    }
  }
  console.log(`✅ Seeded ${SEED_MAJOR_TOPICS.length} Major Topics with SubTopics`);

  // 2. Seed Reading Lab (Articles, Paragraphs, Questions)
  console.log(`📖 Seeding Reading Lab Articles (${MASTER_READING_ARTICLES.length} articles)...`);
  for (const art of MASTER_READING_ARTICLES) {
    const article = await prisma.readingArticle.upsert({
      where: { id: art.id },
      update: {
        title: art.title,
        subtitle: art.subtitle,
        level: art.level,
        topic: art.topic,
        author: art.author || 'LinguaFlow Editorial',
        estimatedMinutes: art.estimatedMinutes || 3,
        wordCount: art.wordCount || 150,
        coverImage: art.coverImage,
        status: 'published',
      },
      create: {
        id: art.id,
        title: art.title,
        subtitle: art.subtitle,
        level: art.level,
        topic: art.topic,
        author: art.author || 'LinguaFlow Editorial',
        estimatedMinutes: art.estimatedMinutes || 3,
        wordCount: art.wordCount || 150,
        coverImage: art.coverImage,
        status: 'published',
      },
    });

    // Paragraphs
    if (art.paragraphs && art.paragraphs.length > 0) {
      for (const p of art.paragraphs) {
        const pId = `${art.id}-p-${p.order}`;
        await prisma.readingParagraph.upsert({
          where: { id: pId },
          update: {
            order: p.order,
            english: p.english,
            vietnamese: p.vietnamese,
            audioUrl: (p as any).audioUrl || null,
          },
          create: {
            id: pId,
            articleId: article.id,
            order: p.order,
            english: p.english,
            vietnamese: p.vietnamese,
            audioUrl: (p as any).audioUrl || null,
          },
        });
      }
    }

    // Questions
    if (art.questions && art.questions.length > 0) {
      for (let i = 0; i < art.questions.length; i++) {
        const q = art.questions[i];
        const qId = q.id || `${art.id}-q-${i + 1}`;
        await prisma.readingQuestion.upsert({
          where: { id: qId },
          update: {
            order: i + 1,
            type: q.type,
            question: q.question,
            optionsJson: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            difficulty: q.difficulty || art.level,
            relatedParagraph: q.relatedParagraph || null,
          },
          create: {
            id: qId,
            articleId: article.id,
            order: i + 1,
            type: q.type,
            question: q.question,
            optionsJson: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            difficulty: q.difficulty || art.level,
            relatedParagraph: q.relatedParagraph || null,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${MASTER_READING_ARTICLES.length} Reading Articles with Paragraphs & Questions`);

  // 3. Seed Writing Lab (Prompts & Guided Steps)
  console.log(`✍️ Seeding Writing Lab Prompts (${SEED_WRITING_PROMPTS.length} prompts)...`);
  for (const prompt of SEED_WRITING_PROMPTS) {
    const wp = await prisma.writingPrompt.upsert({
      where: { id: prompt.id },
      update: {
        mode: prompt.mode,
        difficulty: prompt.difficulty,
        title: prompt.title,
        instruction: prompt.instruction,
        imageHint: prompt.imageHint || null,
        scenario: prompt.scenario || null,
        targetWords: JSON.stringify(prompt.targetWords || []),
        targetGrammar: prompt.targetGrammar || null,
        sampleAnswer: prompt.sampleAnswer || null,
        category: prompt.category || 'General',
        minWords: prompt.minWords || 10,
        maxWords: prompt.maxWords || 100,
        status: 'published',
      },
      create: {
        id: prompt.id,
        mode: prompt.mode,
        difficulty: prompt.difficulty,
        title: prompt.title,
        instruction: prompt.instruction,
        imageHint: prompt.imageHint || null,
        scenario: prompt.scenario || null,
        targetWords: JSON.stringify(prompt.targetWords || []),
        targetGrammar: prompt.targetGrammar || null,
        sampleAnswer: prompt.sampleAnswer || null,
        category: prompt.category || 'General',
        minWords: prompt.minWords || 10,
        maxWords: prompt.maxWords || 100,
        status: 'published',
      },
    });

    const steps = (prompt as any).guidedSteps || (prompt as any).steps || [];
    if (steps && steps.length > 0) {
      for (const step of steps) {
        const stepId = `${prompt.id}-step-${step.stepNumber}`;
        await prisma.guidedWritingStep.upsert({
          where: { id: stepId },
          update: {
            stepNumber: step.stepNumber,
            question: step.question,
            hint: step.hint || null,
            samplePhrase: step.samplePhrase || null,
          },
          create: {
            id: stepId,
            promptId: wp.id,
            stepNumber: step.stepNumber,
            question: step.question,
            hint: step.hint || null,
            samplePhrase: step.samplePhrase || null,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${SEED_WRITING_PROMPTS.length} Writing Prompts with Guided Steps`);

  // 4. Seed Speaking Lab Prompts
  console.log(`🎙️ Seeding Speaking Lab Prompts (${MASTER_SPEAKING_PROMPTS.length} prompts)...`);
  for (const spk of MASTER_SPEAKING_PROMPTS) {
    await prisma.speakingPrompt.upsert({
      where: { id: spk.id },
      update: {
        title: spk.title,
        description: spk.description,
        mode: spk.mode,
        difficulty: spk.difficulty,
        cefr: spk.cefr || 'A1',
        topic: spk.topic || 'Daily Life',
        targetWords: JSON.stringify(spk.targetWords || []),
        targetPhrases: JSON.stringify(spk.targetPhrases || []),
        sampleAnswer: spk.sampleAnswer || null,
        audioSampleUrl: (spk as any).audioSampleUrl || null,
        durationSeconds: spk.durationSeconds || 30,
        minWords: spk.minWords || 3,
        maxWords: spk.maxWords || 50,
        tags: JSON.stringify(spk.tags || []),
        imagePrompt: spk.imagePrompt || null,
        scenario: spk.scenario || null,
        stepsJson: (spk as any).steps ? JSON.stringify((spk as any).steps) : null,
        status: 'published',
      },
      create: {
        id: spk.id,
        title: spk.title,
        description: spk.description,
        mode: spk.mode,
        difficulty: spk.difficulty,
        cefr: spk.cefr || 'A1',
        topic: spk.topic || 'Daily Life',
        targetWords: JSON.stringify(spk.targetWords || []),
        targetPhrases: JSON.stringify(spk.targetPhrases || []),
        sampleAnswer: spk.sampleAnswer || null,
        audioSampleUrl: (spk as any).audioSampleUrl || null,
        durationSeconds: spk.durationSeconds || 30,
        minWords: spk.minWords || 3,
        maxWords: spk.maxWords || 50,
        tags: JSON.stringify(spk.tags || []),
        imagePrompt: spk.imagePrompt || null,
        scenario: spk.scenario || null,
        stepsJson: (spk as any).steps ? JSON.stringify((spk as any).steps) : null,
        status: 'published',
      },
    });
  }
  console.log(`✅ Seeded ${MASTER_SPEAKING_PROMPTS.length} Speaking Prompts`);

  // 5. Seed Standardized Exams, Sections & Questions
  console.log(`📋 Seeding Standardized Exams (${MASTER_EXAMS.length} exams)...`);
  for (const exam of MASTER_EXAMS) {
    const stdExam = await prisma.standardizedExam.upsert({
      where: { id: exam.id },
      update: {
        code: exam.id,
        title: exam.title,
        type: exam.type,
        difficulty: exam.difficulty,
        durationMinutes: exam.durationMinutes,
        totalQuestions: exam.totalQuestions,
        passingScore: exam.maxScore ? Math.round(exam.maxScore * 0.6) : 600,
        instructions: (exam as any).instructions || exam.subtitle || null,
        status: 'published',
      },
      create: {
        id: exam.id,
        code: exam.id,
        title: exam.title,
        type: exam.type,
        difficulty: exam.difficulty,
        durationMinutes: exam.durationMinutes,
        totalQuestions: exam.totalQuestions,
        passingScore: exam.maxScore ? Math.round(exam.maxScore * 0.6) : 600,
        instructions: (exam as any).instructions || exam.subtitle || null,
        status: 'published',
      },
    });

    if (exam.sections && exam.sections.length > 0) {
      for (let sIdx = 0; sIdx < exam.sections.length; sIdx++) {
        const sec = exam.sections[sIdx];
        const secId = sec.id || `${exam.id}-sec-${sIdx + 1}`;
        const examSec = await prisma.examSection.upsert({
          where: { id: secId },
          update: {
            order: sIdx + 1,
            partNumber: sIdx + 1,
            title: sec.title,
            sectionType: sec.type,
            instructions: (sec as any).instructions || null,
            audioUrl: (sec as any).audioUrl || null,
            passageText: (sec as any).passageText || sec.passage || null,
            totalQuestions: sec.questions ? sec.questions.length : 0,
          },
          create: {
            id: secId,
            examId: stdExam.id,
            order: sIdx + 1,
            partNumber: sIdx + 1,
            title: sec.title,
            sectionType: sec.type,
            instructions: (sec as any).instructions || null,
            audioUrl: (sec as any).audioUrl || sec.audioUrl || null,
            passageText: (sec as any).passageText || sec.passage || null,
            totalQuestions: sec.questions ? sec.questions.length : 0,
          },
        });

        if (sec.questions && sec.questions.length > 0) {
          for (let qIdx = 0; qIdx < sec.questions.length; qIdx++) {
            const q = sec.questions[qIdx];
            const qId = q.id || `${secId}-q-${qIdx + 1}`;
            await prisma.examQuestion.upsert({
              where: { id: qId },
              update: {
                order: qIdx + 1,
                questionNumber: qIdx + 1,
                questionText: q.prompt,
                passageText: (q as any).passageText || q.passage || null,
                audioUrl: (q as any).audioUrl || q.audioUrl || null,
                imageUrl: (q as any).imageUrl || null,
                optionsJson: JSON.stringify(q.options),
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || null,
                points: 5,
              },
              create: {
                id: qId,
                sectionId: examSec.id,
                order: qIdx + 1,
                questionNumber: qIdx + 1,
                questionText: q.prompt,
                passageText: (q as any).passageText || q.passage || null,
                audioUrl: (q as any).audioUrl || q.audioUrl || null,
                imageUrl: (q as any).imageUrl || null,
                optionsJson: JSON.stringify(q.options),
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || null,
                points: 5,
              },
            });
          }
        }
      }
    }
  }
  console.log(`✅ Seeded ${MASTER_EXAMS.length} Standardized Exams with Sections & Questions`);

  // 6. Seed Daily Quests
  console.log(`🎯 Seeding Daily Quests (${SEED_DAILY_QUESTS.length} quests)...`);
  for (const quest of SEED_DAILY_QUESTS) {
    await prisma.dailyQuest.upsert({
      where: { id: quest.id },
      update: {
        date: quest.date,
        questType: quest.questType,
        title: quest.title,
        targetCount: quest.targetCount,
        xpReward: quest.xpReward,
      },
      create: {
        id: quest.id,
        date: quest.date,
        questType: quest.questType,
        title: quest.title,
        targetCount: quest.targetCount,
        xpReward: quest.xpReward,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_DAILY_QUESTS.length} Daily Quests`);

  console.log('🎉 Comprehensive LinguaFlow Database Seeding Completed Successfully!');
}

if (process.argv[1]?.endsWith('seed-comprehensive.ts') || process.argv[1]?.endsWith('seed-comprehensive.js')) {
  seedComprehensive()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
