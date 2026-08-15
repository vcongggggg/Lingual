/**
 * Sample Writing Prompts for LinguaFlow Writing Lab
 * Structured across CEFR levels (A1 - C1) and Writing Modes (See & Write, Guided, Free).
 */

import { WritingPrompt } from '@linguaflow/domain';

export const MASTER_WRITING_PROMPTS: WritingPrompt[] = [
  // ==========================================================================
  // 1. SEE & WRITE PROMPTS
  // ==========================================================================
  {
    id: 'see-write-a1-morning',
    mode: 'see-write',
    difficulty: 'A1',
    title: 'Morning Routine',
    instruction: 'Hãy quan sát bức tranh và viết ít nhất 1-2 câu mô tả hoạt động buổi sáng của bạn.',
    imageHint: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80',
    scenario: 'Một tách cà phê nóng và bữa sáng thơm ngon trên bàn ăn vào buổi sáng sớm.',
    targetWords: ['coffee', 'morning', 'breakfast', 'drink'],
    targetGrammar: 'Present Simple: I drink / I eat',
    sampleAnswer: 'Every morning I wake up early, drink hot coffee, and eat delicious breakfast.',
    category: 'Daily Life',
    minWords: 8,
    maxWords: 40,
  },
  {
    id: 'see-write-a2-travel',
    mode: 'see-write',
    difficulty: 'A2',
    title: 'Weekend Vacation Trip',
    instruction: 'Mô tả chuyến đi du lịch cuối tuần hoặc kỳ nghỉ bên bãi biển trong bức ảnh.',
    imageHint: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=700&auto=format&fit=crop&q=80',
    scenario: 'Một vali du lịch, kính râm và phong cảnh bờ biển nhiệt đới ngập tràn ánh nắng.',
    targetWords: ['travel', 'vacation', 'beach', 'relax', 'beautiful'],
    targetGrammar: 'Past Simple / Present Continuous',
    sampleAnswer: 'Last weekend my family travelled to the beach. We relaxed under the sun and enjoyed fresh seafood.',
    category: 'Travel & Leisure',
    minWords: 15,
    maxWords: 60,
  },
  {
    id: 'see-write-b1-tech',
    mode: 'see-write',
    difficulty: 'B1',
    title: 'Modern Workplace Collaboration',
    instruction: 'Mô tả cảnh các kỹ sư và đồng nghiệp đang làm việc nhóm và cộng tác xây dựng phần mềm.',
    imageHint: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&auto=format&fit=crop&q=80',
    scenario: 'Nhóm làm việc đa quốc gia đang thảo luận ý tưởng trước màn hình máy tính hiện đại.',
    targetWords: ['collaborate', 'team', 'project', 'technology', 'creative'],
    targetGrammar: 'Present Perfect / Modals of ability',
    sampleAnswer: 'Our engineering team collaborates closely to develop innovative software that solves real-world challenges.',
    category: 'Technology',
    minWords: 20,
    maxWords: 80,
  },
  {
    id: 'see-write-b2-nature',
    mode: 'see-write',
    difficulty: 'B2',
    title: 'Marine Ecosystem & Sustainability',
    instruction: 'Quan sát hệ sinh thái biển và viết đoạn văn ngắn về việc bảo tồn môi trường biển bền vững.',
    imageHint: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&auto=format&fit=crop&q=80',
    scenario: 'Rạn san hô tự nhiên với hàng ngàn sinh vật biển đa dạng cần được bảo vệ trước rác thải nhựa.',
    targetWords: ['ecosystem', 'sustainable', 'conservation', 'environment', 'protect'],
    targetGrammar: 'Passive Voice / Conditional Sentences',
    sampleAnswer: 'Preserving marine ecosystems requires sustainable practices and immediate reduction of plastic pollution worldwide.',
    category: 'Environment',
    minWords: 25,
    maxWords: 100,
  },
  {
    id: 'see-write-c1-ai',
    mode: 'see-write',
    difficulty: 'C1',
    title: 'Artificial Intelligence & Human Communication',
    instruction: 'Thảo luận về tác động sâu rộng của trí tuệ nhân tạo đối với sự tương tác và giáo dục hiện đại.',
    imageHint: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=80',
    scenario: 'Giao thoa giữa tư duy con người và mạng nơ-ron số hóa.',
    targetWords: ['transform', 'articulate', 'paradigm', 'intelligence', 'cognitive'],
    targetGrammar: 'Complex Subordinate Clauses / Inversion',
    sampleAnswer: 'Artificial intelligence is fundamentally transforming education, enabling learners to articulate concepts with unprecedented precision.',
    category: 'Technology',
    minWords: 35,
    maxWords: 120,
  },

  // ==========================================================================
  // 2. GUIDED WRITING PROMPTS
  // ==========================================================================
  {
    id: 'guided-a1-room',
    mode: 'guided',
    difficulty: 'A1',
    title: 'My Study Room',
    instruction: 'Trả lời từng câu hỏi gợi ý để tạo thành một đoạn văn hoàn chỉnh về góc học tập của bạn.',
    category: 'Daily Life',
    minWords: 15,
    guidedSteps: [
      { stepNumber: 1, question: 'Where is your study room located?', hint: 'In my house / in my apartment', samplePhrase: 'My study room is on the second floor.' },
      { stepNumber: 2, question: 'What is on your study desk?', hint: 'A laptop, books, a lamp', samplePhrase: 'There is a laptop and several English books on my desk.' },
      { stepNumber: 3, question: 'How do you feel when studying there?', hint: 'Comfortable / quiet / peaceful', samplePhrase: 'I feel very comfortable and focused when studying here.' },
    ],
    sampleAnswer: 'My study room is on the second floor. There is a laptop and several English books on my desk. I feel very comfortable and focused when studying here.',
  },
  {
    id: 'guided-a2-weekend',
    mode: 'guided',
    difficulty: 'A2',
    title: 'My Memorable Weekend',
    instruction: 'Viết đoạn văn kể về chuyến đi chơi cuối tuần vừa qua qua 5 bước hướng dẫn.',
    category: 'Travel & Leisure',
    minWords: 25,
    guidedSteps: [
      { stepNumber: 1, question: 'When did you go?', hint: 'Last Saturday / Last weekend', samplePhrase: 'Last Sunday morning...' },
      { stepNumber: 2, question: 'Where did you go?', hint: 'To the city park / to the coffee shop', samplePhrase: 'I went to a cozy cafe in the city center.' },
      { stepNumber: 3, question: 'Who were you with?', hint: 'With my best friends / with my family', samplePhrase: 'I spent time with two close friends.' },
      { stepNumber: 4, question: 'What did you do there?', hint: 'Drank coffee, chatted, took photos', samplePhrase: 'We enjoyed milk coffee and shared stories.' },
      { stepNumber: 5, question: 'How did you feel afterwards?', hint: 'Happy / relaxed / refreshed', samplePhrase: 'It was a delightful and relaxing weekend.' },
    ],
    sampleAnswer: 'Last Sunday morning, I went to a cozy cafe in the city center. I spent time with two close friends. We enjoyed milk coffee and shared stories. It was a delightful and relaxing weekend.',
  },
  {
    id: 'guided-b1-lifestyle',
    mode: 'guided',
    difficulty: 'B1',
    title: 'Building a Healthy Lifestyle',
    instruction: 'Xây dựng đoạn văn giải thích các thói quen lành mạnh để nâng cao thể chất và tinh thần.',
    category: 'Health & Wellness',
    minWords: 30,
    guidedSteps: [
      { stepNumber: 1, question: 'What is the most important daily habit for health?', hint: 'Eating balanced diet / regular exercise', samplePhrase: 'Maintaining a balanced diet and regular exercise is vital.' },
      { stepNumber: 2, question: 'How often do you exercise and what do you do?', hint: '3 times a week / jogging / yoga', samplePhrase: 'I jog for thirty minutes three times a week.' },
      { stepNumber: 3, question: 'What advice would you give to maintain mental health?', hint: 'Sleep 8 hours / take digital breaks', samplePhrase: 'Getting sufficient sleep is crucial for mental clarity.' },
    ],
    sampleAnswer: 'Maintaining a balanced diet and regular exercise is vital for long-term health. I jog for thirty minutes three times a week. Furthermore, getting sufficient sleep is crucial for mental clarity.',
  },

  // ==========================================================================
  // 3. FREE WRITING PROMPTS
  // ==========================================================================
  {
    id: 'free-b1-favorite-city',
    mode: 'free',
    difficulty: 'B1',
    title: 'Your Favorite City in the World',
    instruction: 'Viết tự do về một thành phố bạn yêu thích hoặc mơ ước được đặt chân đến. Đặt mục tiêu từ 40 - 100 từ.',
    category: 'Travel & Leisure',
    minWords: 40,
    maxWords: 150,
    targetWords: ['city', 'culture', 'explore', 'atmosphere', 'memorable'],
    sampleAnswer: 'Da Nang is my favorite city in Vietnam because of its breathtaking beaches and friendly people. The vibrant night market and delicious street food always leave a lasting impression.',
  },
  {
    id: 'free-b2-remote-work',
    mode: 'free',
    difficulty: 'B2',
    title: 'The Pros and Cons of Remote Work',
    instruction: 'Trình bày quan điểm của bạn về làm việc từ xa (Remote Work) trong thời đại công nghệ số.',
    category: 'Workplace',
    minWords: 50,
    maxWords: 200,
    targetWords: ['flexibility', 'productivity', 'collaborate', 'communication', 'balance'],
    sampleAnswer: 'Remote work offers remarkable flexibility and saves valuable commuting time. However, it requires self-discipline and strong communication to collaborate effectively across distributed teams.',
  },
];
