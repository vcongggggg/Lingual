import { Exam } from '../../../../packages/domain/src/index.js';

export const MASTER_EXAMS: Exam[] = [
  // ==========================================================================
  // 1. TOEIC Full-Format Mini Simulation (Listening Part 1, 2 + Reading Part 5, 6, 7)
  // ==========================================================================
  {
    id: 'exam-toeic-01',
    title: 'TOEIC Official Format Mock Test 01',
    subtitle: 'Listening (Part 1, 2) & Reading (Part 5, 6, 7) Complete Simulation',
    type: 'toeic',
    difficulty: 'B1',
    durationMinutes: 45,
    totalQuestions: 10,
    maxScore: 990,
    tags: ['toeic', 'ets', 'listening', 'reading', 'business-english'],
    isOfficialMock: true,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-toeic-l1',
        title: 'Section 1: Listening Comprehension (Part 1 & 2)',
        type: 'listening',
        durationMinutes: 15,
        audioUrl: 'https://cdn.linguaflow.com/audio/toeic_part1_sample.mp3',
        questions: [
          {
            id: 't-l1-q1',
            sectionId: 'sec-toeic-l1',
            type: 'listening-comprehension',
            prompt: 'Look at the photo and choose the statement that best describes what you see.',
            audioText: 'A man is adjusting his necktie in front of a mirror in a clothing store.',
            options: [
              'A man is adjusting his necktie.',
              'A customer is trying on a pair of leather shoes.',
              'The workers are unpacking boxes.',
              'The shop is completely closed for renovation.',
            ],
            correctAnswer: 'A man is adjusting his necktie.',
            explanation: 'The photo depicts a man adjusting his tie in front of a store mirror.',
            difficulty: 'A2',
            tags: ['part1', 'photographs'],
            vocabularyIds: ['vocab-adjust', 'vocab-necktie'],
          },
          {
            id: 't-l1-q2',
            sectionId: 'sec-toeic-l1',
            type: 'listening-comprehension',
            prompt: 'Where did you leave the keys to the conference room?',
            audioText: 'Where did you leave the keys to the conference room?',
            options: [
              'On Ms. Lee’s reception desk.',
              'No, at three o’clock.',
              'Yes, the presentation was great.',
            ],
            correctAnswer: 'On Ms. Lee’s reception desk.',
            explanation: '"Where" asks for a location, making "On Ms. Lee’s reception desk" the correct answer.',
            difficulty: 'B1',
            tags: ['part2', 'question-response'],
            vocabularyIds: ['vocab-conference', 'vocab-reception'],
          },
        ],
      },
      {
        id: 'sec-toeic-r1',
        title: 'Section 2: Reading Part 5 (Incomplete Sentences)',
        type: 'reading',
        durationMinutes: 15,
        questions: [
          {
            id: 't-r1-q1',
            sectionId: 'sec-toeic-r1',
            type: 'fill-blank',
            prompt: 'The human resources department announced that all employee evaluations must be submitted _______ next Friday.',
            options: ['prior to', 'under', 'during', 'between'],
            correctAnswer: 'prior to',
            explanation: '"Prior to" means "before" and correctly precedes a specific deadline timestamp.',
            difficulty: 'B1',
            tags: ['part5', 'prepositions'],
            vocabularyIds: ['vocab-evaluation', 'vocab-deadline'],
          },
          {
            id: 't-r1-q2',
            sectionId: 'sec-toeic-r1',
            type: 'multiple-choice',
            prompt: 'Our regional marketing campaign was _______ successful in boosting brand awareness among young adults.',
            options: ['remarkably', 'remark', 'remarkable', 'remarking'],
            correctAnswer: 'remarkably',
            explanation: 'The adverb "remarkably" modifies the adjective "successful".',
            difficulty: 'B1',
            tags: ['part5', 'word-form'],
            vocabularyIds: ['vocab-campaign', 'vocab-awareness'],
          },
          {
            id: 't-r1-q3',
            sectionId: 'sec-toeic-r1',
            type: 'fill-blank',
            prompt: 'The warranty covers free equipment replacement _______ the damage was caused by deliberate negligence.',
            options: ['unless', 'because', 'although', 'despite'],
            correctAnswer: 'unless',
            explanation: '"Unless" means "except if", indicating the negative condition for warranty coverage.',
            difficulty: 'B2',
            tags: ['part5', 'conjunctions'],
            vocabularyIds: ['vocab-warranty', 'vocab-negligence'],
          },
        ],
      },
      {
        id: 'sec-toeic-r2',
        title: 'Section 3: Reading Part 6 & 7 (Text Completion & Reading Comprehension)',
        type: 'reading',
        durationMinutes: 15,
        passage: 'Memo from Global Logistics Inc.\nTo: All Distribution Center Staff\nFrom: Operations Director\nDate: October 14\nSubject: Implementation of Automated Inventory Tracking System\n\nStarting next Monday, our facility will transition to the new barcode scanning protocol. This automated tracking system is designed to minimize warehouse fulfillment delays and reduce clerical errors. All warehouse operatives are required to attend a 30-minute orientation session in Conference Room B before their scheduled shifts. Refreshments will be provided.',
        questions: [
          {
            id: 't-r2-q1',
            sectionId: 'sec-toeic-r2',
            type: 'reading-comprehension',
            prompt: 'What is the primary purpose of the memorandum?',
            options: [
              'To announce the rollout of a new inventory tracking system',
              'To notify employees of a temporary factory shutdown',
              'To advertise open warehouse job vacancies',
              'To celebrate record-high quarterly revenue',
            ],
            correctAnswer: 'To announce the rollout of a new inventory tracking system',
            explanation: 'The memo explicitly announces transitioning to an automated barcode scanning protocol.',
            difficulty: 'B1',
            tags: ['part7', 'main-idea'],
            vocabularyIds: ['vocab-inventory', 'vocab-protocol'],
          },
          {
            id: 't-r2-q2',
            sectionId: 'sec-toeic-r2',
            type: 'multiple-choice',
            prompt: 'What must warehouse workers do before their shifts?',
            options: [
              'Attend a 30-minute orientation session',
              'Purchase new barcode scanning equipment',
              'Submit a written resignation letter',
              'Contact the shipping clients directly',
            ],
            correctAnswer: 'Attend a 30-minute orientation session',
            explanation: 'The text states all warehouse operatives must attend a 30-minute orientation session in Room B.',
            difficulty: 'A2',
            tags: ['part7', 'detail'],
            vocabularyIds: ['vocab-orientation', 'vocab-operative'],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 2. IELTS Academic Reading & Listening Mini Simulation
  // ==========================================================================
  {
    id: 'exam-ielts-01',
    title: 'IELTS Academic Reading & Listening Practice 01',
    subtitle: 'Standard IELTS Simulation (Academic Passages & Audio Sections)',
    type: 'ielts',
    difficulty: 'B2',
    durationMinutes: 40,
    totalQuestions: 6,
    maxScore: 9.0,
    tags: ['ielts', 'academic', 'band-score', 'reading', 'listening'],
    isOfficialMock: true,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-ielts-r1',
        title: 'Academic Reading: The Ecology of Urban Pollinators',
        type: 'reading',
        durationMinutes: 25,
        passage: 'Urbanization poses severe ecological pressures on wild pollinator populations, yet recent bio-surveys reveal that urban flower meadows and botanical gardens frequently support higher species diversity than chemically intensive rural monocultures. By diversifying floral nectar sources and avoiding synthetic pesticides, metropolitan parks act as critical biological reservoirs for threatened bumblebee species.',
        questions: [
          {
            id: 'ielts-q1',
            sectionId: 'sec-ielts-r1',
            type: 'true-false',
            prompt: 'Do urban flower meadows sometimes foster higher pollinator diversity than intensive rural monocultures?',
            options: ['True', 'False', 'Not Given'],
            correctAnswer: 'True',
            explanation: 'Paragraph 1 states urban meadows frequently support higher species diversity than rural monocultures.',
            difficulty: 'B2',
            tags: ['ielts-reading', 'true-false-not-given'],
            vocabularyIds: ['vocab-pollinator', 'vocab-monoculture'],
          },
          {
            id: 'ielts-q2',
            sectionId: 'sec-ielts-r1',
            type: 'multiple-choice',
            prompt: 'According to the passage, what key factors make city parks effective biological sanctuaries?',
            options: [
              'Diverse floral nectar sources and the absence of synthetic pesticides',
              'High density of high-rise concrete skyscrapers',
              'Continuous artificial street lighting at night',
              'The eradication of all native flowering plants',
            ],
            correctAnswer: 'Diverse floral nectar sources and the absence of synthetic pesticides',
            explanation: 'The passage highlights diversifying nectar sources and avoiding pesticides as the key factors.',
            difficulty: 'B2',
            tags: ['ielts-reading', 'detail'],
            vocabularyIds: ['vocab-pesticide', 'vocab-reservoir'],
          },
        ],
      },
      {
        id: 'sec-ielts-l1',
        title: 'Academic Listening: University Research Project Consultation',
        type: 'listening',
        durationMinutes: 15,
        audioText: 'Professor: For your environmental biology paper, make sure to survey at least three distinct wetland microhabitats. Student: Should we submit our preliminary statistical dataset by Thursday noon? Professor: Yes, before twelve o’clock precisely.',
        questions: [
          {
            id: 'ielts-l-q1',
            sectionId: 'sec-ielts-l1',
            type: 'listening-comprehension',
            prompt: 'How many distinct wetland microhabitats must the student survey for the assignment?',
            options: ['At least three', 'Exactly one', 'Five or more', 'None'],
            correctAnswer: 'At least three',
            explanation: 'The professor specifies surveying at least three distinct wetland microhabitats.',
            difficulty: 'B1',
            tags: ['ielts-listening', 'detail'],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 3. VSTEP B1-B2-C1 Standard Examination
  // ==========================================================================
  {
    id: 'exam-vstep-01',
    title: 'VSTEP Standard Assessment Test 01',
    subtitle: 'Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam (B1–C1)',
    type: 'vstep',
    difficulty: 'B1',
    durationMinutes: 35,
    totalQuestions: 5,
    maxScore: 10.0,
    tags: ['vstep', 'moet', 'b1', 'b2', 'reading', 'listening'],
    isOfficialMock: true,
    coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-vstep-r1',
        title: 'VSTEP Reading Comprehension',
        type: 'reading',
        durationMinutes: 20,
        passage: 'Community-based ecotourism in the Mekong Delta offers sustainable livelihoods for local villagers while protecting delicate mangrove forests. Visitors experience traditional floating markets, sample organic tropical fruits, and participate in mangrove tree planting campaigns.',
        questions: [
          {
            id: 'vstep-q1',
            sectionId: 'sec-vstep-r1',
            type: 'reading-comprehension',
            prompt: 'What dual benefit does community ecotourism bring to the Mekong Delta?',
            options: [
              'Providing sustainable local livelihoods while preserving mangrove habitats',
              'Building massive industrial chemical factories',
              'Demolishing all traditional floating markets',
              'Promoting heavy deforestation',
            ],
            correctAnswer: 'Providing sustainable local livelihoods while preserving mangrove habitats',
            explanation: 'The text highlights sustainable livelihoods and protecting mangrove forests.',
            difficulty: 'B1',
            tags: ['vstep', 'main-idea'],
            vocabularyIds: ['vocab-ecotourism', 'vocab-mangrove'],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 4. HSK Standard Chinese Mock Test
  // ==========================================================================
  {
    id: 'exam-hsk-01',
    title: 'HSK Level 3 Standard Mock Exam',
    subtitle: 'Hanyu Shuiping Kaoshi (汉语水平考试) Reading & Comprehension',
    type: 'hsk',
    difficulty: 'A2',
    durationMinutes: 30,
    totalQuestions: 4,
    tags: ['hsk', 'chinese', 'hanban', 'vocabulary'],
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-hsk-r1',
        title: 'HSK Reading Section',
        type: 'reading',
        durationMinutes: 30,
        questions: [
          {
            id: 'hsk-q1',
            sectionId: 'sec-hsk-r1',
            type: 'multiple-choice',
            prompt: 'Please choose the correct pinyin & meaning for "学习" (xué xí):',
            options: [
              'To study / To learn (Học tập)',
              'To eat breakfast (Ăn sáng)',
              'To travel by train (Đi du lịch)',
              'To sleep at night (Đi ngủ)',
            ],
            correctAnswer: 'To study / To learn (Học tập)',
            explanation: '学习 (xuéxí) means to study or learn.',
            difficulty: 'A2',
            tags: ['hsk', 'vocabulary'],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 5. JLPT Japanese Language Proficiency Test
  // ==========================================================================
  {
    id: 'exam-jlpt-01',
    title: 'JLPT N4 Language Knowledge & Reading',
    subtitle: 'Japanese-Language Proficiency Test (日本語能力試験)',
    type: 'jlpt',
    difficulty: 'A2',
    durationMinutes: 30,
    totalQuestions: 4,
    tags: ['jlpt', 'japanese', 'kanji', 'grammar'],
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-jlpt-r1',
        title: 'JLPT Vocabulary & Grammar',
        type: 'language',
        durationMinutes: 30,
        questions: [
          {
            id: 'jlpt-q1',
            sectionId: 'sec-jlpt-r1',
            type: 'multiple-choice',
            prompt: 'Select the correct reading for the kanji: 「先生」 (Teacher)',
            options: ['せんせい (Sensei)', 'がくせい (Gakusei)', 'ともだち (Tomodachi)', 'ほん (Hon)'],
            correctAnswer: 'せんせい (Sensei)',
            explanation: '先生 is pronounced せんせい (sensei) meaning teacher or master.',
            difficulty: 'A2',
            tags: ['jlpt', 'kanji'],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 6. TOPIK Korean Proficiency Test
  // ==========================================================================
  {
    id: 'exam-topik-01',
    title: 'TOPIK I Standard Assessment Exam',
    subtitle: 'Test of Proficiency in Korean (한국어능력시험)',
    type: 'topik',
    difficulty: 'A2',
    durationMinutes: 30,
    totalQuestions: 4,
    tags: ['topik', 'korean', 'reading', 'hangul'],
    coverImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-topik-r1',
        title: 'TOPIK Reading Comprehension',
        type: 'reading',
        durationMinutes: 30,
        questions: [
          {
            id: 'topik-q1',
            sectionId: 'sec-topik-r1',
            type: 'multiple-choice',
            prompt: 'What does "도서관에서 책을 읽습니다" mean?',
            options: [
              'I read books in the library (Tôi đọc sách ở thư viện)',
              'I eat food in the restaurant (Tôi ăn ở nhà hàng)',
              'I play soccer in the park (Tôi đá bóng ở công viên)',
              'I sleep at home (Tôi ngủ ở nhà)',
            ],
            correctAnswer: 'I read books in the library (Tôi đọc sách ở thư viện)',
            explanation: '도서관 = library, 책 = book, 읽습니다 = read.',
            difficulty: 'A2',
            tags: ['topik', 'reading'],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 7. Digital SAT (DSAT) Reading & Math Simulation
  // ==========================================================================
  {
    id: 'exam-dsat-01',
    title: 'Digital SAT (DSAT) Diagnostic Test 01',
    subtitle: 'College Board Standard Format (Reading/Writing & Math)',
    type: 'dsat',
    difficulty: 'C1',
    durationMinutes: 45,
    totalQuestions: 5,
    maxScore: 1600,
    tags: ['dsat', 'collegeboard', 'sat', 'math', 'critical-reading'],
    isOfficialMock: true,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80',
    sections: [
      {
        id: 'sec-dsat-rw1',
        title: 'Module 1: Reading & Writing',
        type: 'reading',
        durationMinutes: 25,
        passage: 'In literary analysis, unreliable narrators possess subjective biases that intentionally obscure objective realities. Readers must actively cross-reference textual inconsistencies to reconstruct historical veracity.',
        questions: [
          {
            id: 'dsat-q1',
            sectionId: 'sec-dsat-rw1',
            type: 'multiple-choice',
            prompt: 'As used in the text, what does the word "veracity" most nearly mean?',
            options: ['Truthfulness and accuracy', 'Emotional excitement', 'Lengthy descriptions', 'Fictional invention'],
            correctAnswer: 'Truthfulness and accuracy',
            explanation: '"Veracity" denotes factual conformity with truth or accuracy.',
            difficulty: 'C1',
            tags: ['dsat-reading', 'vocabulary-in-context'],
            vocabularyIds: ['vocab-veracity', 'vocab-inconsistency'],
          },
        ],
      },
      {
        id: 'sec-dsat-m1',
        title: 'Module 2: Mathematics',
        type: 'math',
        durationMinutes: 20,
        questions: [
          {
            id: 'dsat-m-q1',
            sectionId: 'sec-dsat-m1',
            type: 'multiple-choice',
            prompt: 'If 3x + 7 = 22, what is the value of 6x + 2?',
            options: ['32', '30', '28', '35'],
            correctAnswer: '32',
            explanation: '3x = 15 => x = 5. Therefore, 6(5) + 2 = 30 + 2 = 32.',
            difficulty: 'B1',
            tags: ['dsat-math', 'algebra'],
          },
        ],
      },
    ],
  },
];
