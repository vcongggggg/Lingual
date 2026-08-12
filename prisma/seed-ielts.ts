import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const SEED_IELTS_TRACKS = [
  {
    targetBand: 5.5,
    type: 'academic',
    description: 'Chặng 1: Nền tảng IELTS Band 4.5 - 5.5 (Củng cố từ vựng lõi Academic & kỹ năng làm bài cơ bản)',
  },
  {
    targetBand: 6.5,
    type: 'academic',
    description: 'Chặng 2: Bứt phá IELTS Band 6.0 - 6.5 (Tập trung chiến thuật làm bài Reading 2 cột & Listening)',
  },
  {
    targetBand: 7.5,
    type: 'academic',
    description: 'Chặng 3: Làm chủ IELTS Band 7.0+ (Luyện đề Mock Test thời gian thực & AI Writing Task 1/2 Evaluator)',
  },
];

export const SEED_IELTS_QUESTIONS = [
  // --------------------------------------------------------------------------
  // READING PASSAGES & QUESTIONS
  // --------------------------------------------------------------------------
  {
    title: 'The Impact of Renewable Energy on Global Economics',
    skill: 'reading',
    type: 'academic',
    part: 'passage_1',
    targetBand: 6.5,
    passageText: `Renewable energy sources such as solar, wind, and hydroelectric power have experienced unprecedented growth over the past decade. As governments worldwide strive to meet net-zero carbon emission targets, investments in clean energy technologies have soared. Consequently, traditional fossil fuel industries are facing significant structural shifts, altering trade balances and labor market dynamics globally.\n\nOne of the most notable economic outcomes of the green transition is job creation. According to the International Renewable Energy Agency (IRENA), the renewable energy sector employed over 12 million people worldwide in recent estimates. Solar photovoltaic technology represents the largest share, providing jobs in manufacturing, installation, and maintenance. However, this transition is not without challenges. Coal-dependent communities often experience economic dislocation as power plants close down, requiring targeted government retraining programs.`,
    content: JSON.stringify({
      questions: [
        {
          id: 'r1_q1',
          type: 'tfng',
          prompt: 'Investments in clean energy technologies have decreased in recent years.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Passage states "investments in clean energy technologies have soared".',
        },
        {
          id: 'r1_q2',
          type: 'tfng',
          prompt: 'Solar photovoltaic technology employs the largest proportion of workers in the renewable sector.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'True',
          explanation: 'Passage explicitly states "Solar photovoltaic technology represents the largest share".',
        },
        {
          id: 'r1_q3',
          type: 'multiple_choice',
          prompt: 'What is a major challenge for coal-dependent communities mentioned in the text?',
          options: [
            'Excessive air pollution',
            'Economic dislocation from plant closures',
            'Lack of solar energy availability',
            'High tax rates on green energy',
          ],
          correctAnswer: 'Economic dislocation from plant closures',
          explanation: 'The text mentions coal-dependent communities experience economic dislocation as power plants close down.',
        },
      ],
    }),
  },
  {
    title: 'Artificial Intelligence in Modern Healthcare',
    skill: 'reading',
    type: 'academic',
    part: 'passage_2',
    targetBand: 7.0,
    passageText: `Artificial intelligence (AI) algorithms are rapidly transforming diagnostic procedures in medical radiology and pathology. Machine learning models trained on millions of anonymized medical images can now detect malignant tumors and retinal abnormalities with accuracy rivaling expert clinicians. By accelerating early diagnosis, AI tools enable timely interventions that can significantly improve patient survival rates.\n\nDespite these advancements, ethical and regulatory concerns remain paramount. Issues regarding patient data privacy, algorithmic bias, and accountability in cases of misdiagnosis pose complex legal questions. Medical professionals emphasize that AI should serve as an assistive tool rather than a complete replacement for clinical judgment.`,
    content: JSON.stringify({
      questions: [
        {
          id: 'r2_q1',
          type: 'tfng',
          prompt: 'AI tools are intended to completely replace human doctors in radiology.',
          options: ['True', 'False', 'Not Given'],
          correctAnswer: 'False',
          explanation: 'Text emphasizes AI should serve as an assistive tool rather than a complete replacement.',
        },
        {
          id: 'r2_q2',
          type: 'multiple_choice',
          prompt: 'Which of the following is cited as a primary benefit of AI in healthcare?',
          options: [
            'Reducing medical school tuition fees',
            'Accelerating early diagnosis for timely intervention',
            'Replacing all nurses in emergency rooms',
            'Eliminating the need for patient privacy laws',
          ],
          correctAnswer: 'Accelerating early diagnosis for timely intervention',
          explanation: 'Text states "By accelerating early diagnosis, AI tools enable timely interventions".',
        },
      ],
    }),
  },

  // --------------------------------------------------------------------------
  // LISTENING SECTIONS & QUESTIONS
  // --------------------------------------------------------------------------
  {
    title: 'University Campus Library Orientation Tour',
    skill: 'listening',
    type: 'academic',
    part: 'section_1',
    targetBand: 5.5,
    audioUrl: 'https://cdn.freesound.org/previews/567/567341_5674468-lq.mp3',
    content: JSON.stringify({
      transcript: `Welcome to the central university library orientation! My name is Sarah, and I am the head librarian. Today, I'll briefly explain our key services. The main borrowing desk is located on Floor 1, right next to the entrance. You can borrow up to 10 books at a time for a period of 14 days. Computer labs are situated on Floor 2 and Floor 3, and quiet study pods can be booked online via the student portal.`,
      questions: [
        {
          id: 'l1_q1',
          type: 'multiple_choice',
          prompt: 'Where is the main borrowing desk located?',
          options: ['Floor 1', 'Floor 2', 'Floor 3', 'Basement'],
          correctAnswer: 'Floor 1',
          explanation: 'Sarah states "The main borrowing desk is located on Floor 1, right next to the entrance".',
        },
        {
          id: 'l1_q2',
          type: 'multiple_choice',
          prompt: 'How many books can a student borrow at one time?',
          options: ['5 books', '10 books', '14 books', 'Unlimited'],
          correctAnswer: '10 books',
          explanation: 'Sarah mentions "You can borrow up to 10 books at a time".',
        },
        {
          id: 'l1_q3',
          type: 'multiple_choice',
          prompt: 'What is the maximum borrowing period for books?',
          options: ['7 days', '10 days', '14 days', '30 days'],
          correctAnswer: '14 days',
          explanation: 'Sarah specifies borrowing is for "a period of 14 days".',
        },
      ],
    }),
  },

  // --------------------------------------------------------------------------
  // WRITING TASKS (TASK 1 & TASK 2)
  // --------------------------------------------------------------------------
  {
    title: 'IELTS Writing Task 2: Technology & Social Interaction',
    skill: 'writing',
    type: 'academic',
    part: 'task_2',
    targetBand: 6.5,
    prompt: `Some people believe that modern technology has made people more socially isolated, while others argue that it has connected humanity more than ever before. Discuss both views and give your opinion.\n\nWrite at least 250 words.`,
    content: JSON.stringify({
      suggestedStructure: [
        'Introduction: Paraphrase prompt + State your clear thesis statement.',
        'Body Paragraph 1: Discuss how technology causes isolation (screen addiction, superficial online relationships).',
        'Body Paragraph 2: Discuss how technology connects people (instant global communication, bridging geographical distances).',
        'Conclusion: Summarize main arguments + Reiterate your opinion.',
      ],
    }),
  },
  {
    title: 'IELTS Writing Task 1: Bar Chart on Energy Consumption',
    skill: 'writing',
    type: 'academic',
    part: 'task_1',
    targetBand: 6.0,
    prompt: `The chart below shows energy consumption by fuel type in a European nation from 2000 to 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
    content: JSON.stringify({
      suggestedStructure: [
        'Introduction: Paraphrase the title/prompt.',
        'Overview: Mention overall trends (e.g. increase in renewables, decrease in coal).',
        'Body Paragraph 1: Details of fossil fuel consumption.',
        'Body Paragraph 2: Details of green energy sources.',
      ],
    }),
  },
];

export const SEED_IELTS_VOCAB = [
  { targetText: "Analyze", translation: "Phân tích", phonetic: "/ˈænəlaɪz/", cefrLevel: "B2", category: "academic", exampleSentence: "Researchers analyze data to find trends.", exampleTranslation: "Các nhà nghiên cứu phân tích dữ liệu để tìm ra xu hướng." },
  { targetText: "Substantial", translation: "Đáng kể / Cực lớn", phonetic: "/səbˈstænʃl/", cefrLevel: "B2", category: "academic", exampleSentence: "A substantial amount of investment went into solar energy.", exampleTranslation: "Một lượng đầu tư đáng kể đã vào năng lượng mặt trời." },
  { targetText: "Implement", translation: "Thực thi / Triển khai", phonetic: "/ˈɪmplɪment/", cefrLevel: "B2", category: "academic", exampleSentence: "Governments implement new environmental policies.", exampleTranslation: "Các chính phủ triển khai các chính sách môi trường mới." },
  { targetText: "Fluctuate", translation: "Biến động / Dao động", phonetic: "/ˈflʌktʃueɪt/", cefrLevel: "C1", category: "academic", exampleSentence: "Oil prices fluctuate due to global supply.", exampleTranslation: "Giá dầu biến động do nguồn cung toàn cầu." },
  { targetText: "Prevalent", translation: "Phổ biến / Thịnh hành", phonetic: "/ˈprevələnt/", cefrLevel: "C1", category: "academic", exampleSentence: "Remote work is becoming increasingly prevalent.", exampleTranslation: "Làm việc từ xa ngày càng trở nên phổ biến." }
];

export async function seedIeltsData() {
  console.log('🌱 Seeding IELTS Exam Prep Data...');

  // 1. Seed Tracks
  for (const track of SEED_IELTS_TRACKS) {
    const existing = await prisma.ieltsTrack.findFirst({
      where: { targetBand: track.targetBand, type: track.type },
    });
    if (!existing) {
      await prisma.ieltsTrack.create({ data: track });
    }
  }

  // 2. Seed Questions
  for (const q of SEED_IELTS_QUESTIONS) {
    const existing = await prisma.ieltsQuestion.findFirst({
      where: { title: q.title },
    });
    if (!existing) {
      await prisma.ieltsQuestion.create({ data: q });
    }
  }

  // 3. Seed Vocab into main Vocabulary table with 'academic' category
  for (const v of SEED_IELTS_VOCAB) {
    const existing = await prisma.vocabulary.findFirst({
      where: { targetText: v.targetText },
    });
    if (!existing) {
      await prisma.vocabulary.create({ data: v });
    }
  }

  console.log('✅ IELTS Exam Prep Data Seeded Successfully!');
}

if (require.main === module) {
  seedIeltsData()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
