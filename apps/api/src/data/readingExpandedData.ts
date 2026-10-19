import { ReadingArticle } from '../../../../packages/domain/src/index.js';

export const EXPANDED_READING_ARTICLES: ReadingArticle[] = [
  {
    id: 'a1-my-cozy-cat',
    title: "Milo: The Friendly Orange Cat",
    subtitle: "A sweet story about a playful pet and daily companionship",
    level: 'A1',
    topic: "Daily Life",
    author: "Elena Rostova",
    estimatedMinutes: 3,
    wordCount: 140,
    coverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-my-cozy-cat-p1',
        order: 1,
        english: "Milo is a friendly orange cat. He lives in a small apartment with my family. Every morning, Milo sits on the sofa and watches birds through the window.",
        vietnamese: "Milo l\u00e0 m\u1ed9t ch\u00fa m\u00e8o m\u00e0u cam th\u00e2n thi\u1ec7n. Ch\u00fa s\u1ed1ng trong m\u1ed9t c\u0103n h\u1ed9 nh\u1ecf c\u00f9ng gia \u0111\u00ecnh t\u00f4i. M\u1ed7i bu\u1ed5i s\u00e1ng, Milo ng\u1ed3i tr\u00ean gh\u1ebf sofa v\u00e0 ng\u1eafm nh\u1eefng ch\u00fa chim qua c\u1eeda s\u1ed5.",
      },
      {
        id: 'a1-my-cozy-cat-p2',
        order: 2,
        english: "In the afternoon, he loves to play with a green ball. When he is hungry, he meows softly near his bowl. At night, Milo sleeps at the foot of my bed.",
        vietnamese: "V\u00e0o bu\u1ed5i chi\u1ec1u, ch\u00fa th\u00edch ch\u01a1i v\u1edbi m\u1ed9t qu\u1ea3 b\u00f3ng m\u00e0u xanh l\u00e1. Khi \u0111\u00f3i, ch\u00fa k\u00eau meo meo nh\u1eb9 nh\u00e0ng c\u1ea1nh b\u00e1t \u0103n. Ban \u0111\u00eam, Milo ng\u1ee7 \u1edf d\u01b0\u1edbi ch\u00e2n gi\u01b0\u1eddng c\u1ee7a t\u00f4i.",
      },
    ],
    questions: [
      {
        id: 'a1-my-cozy-cat-q1',
        type: 'multiple-choice',
        question: "Where does Milo sit every morning?",
        options: ["On the sofa", "On the table", "In the kitchen", "Under the bed"],
        correctAnswer: "On the sofa",
        explanation: "Paragraph 1 states Milo sits on the sofa.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-my-cozy-cat-q2',
        type: 'multiple-choice',
        question: "What color is Milo's favorite ball?",
        options: ["Green", "Red", "Blue", "Yellow"],
        correctAnswer: "Green",
        explanation: "Paragraph 2 states he plays with a green ball.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-farmers-market',
    title: "A Sunny Morning at the Farmers Market",
    subtitle: "Exploring fresh fruits, vegetables, and flowers on Saturday",
    level: 'A1',
    topic: "Food & Nutrition",
    author: "Lucas Garcia",
    estimatedMinutes: 3,
    wordCount: 150,
    coverImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-farmers-market-p1',
        order: 1,
        english: "On Saturday mornings, the central square becomes a lively farmers market. Local farmers bring fresh red apples, yellow bananas, and sweet strawberries.",
        vietnamese: "V\u00e0o c\u00e1c bu\u1ed5i s\u00e1ng th\u1ee9 B\u1ea3y, qu\u1ea3ng tr\u01b0\u1eddng trung t\u00e2m tr\u1edf th\u00e0nh m\u1ed9t khu ch\u1ee3 n\u00f4ng s\u1ea3n s\u00f4i \u0111\u1ed9ng. Nh\u1eefng ng\u01b0\u1eddi n\u00f4ng d\u00e2n mang \u0111\u1ebfn t\u00e1o \u0111\u1ecf t\u01b0\u01a1i, chu\u1ed1i v\u00e0ng v\u00e0 d\u00e2u t\u00e2y ng\u1ecdt ng\u00e0o.",
      },
      {
        id: 'a1-farmers-market-p2',
        order: 2,
        english: "Many families walk through the market with canvas bags. They buy organic vegetables, warm bread, and colorful flowers.",
        vietnamese: "Nhi\u1ec1u gia \u0111\u00ecnh \u0111i d\u1ea1o qua ch\u1ee3 v\u1edbi nh\u1eefng chi\u1ebfc t\u00fai v\u1ea3i. H\u1ecd mua rau h\u1eefu c\u01a1, b\u00e1nh m\u00ec n\u00f3ng v\u00e0 nh\u1eefng b\u00f4ng hoa r\u1ef1c r\u1ee1 s\u1eafc m\u00e0u.",
      },
    ],
    questions: [
      {
        id: 'a1-farmers-market-q1',
        type: 'multiple-choice',
        question: "When does the farmers market take place?",
        options: ["Saturday mornings", "Sunday evenings", "Monday afternoons", "Friday nights"],
        correctAnswer: "Saturday mornings",
        explanation: "Paragraph 1 mentions Saturday mornings.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-farmers-market-q2',
        type: 'multiple-choice',
        question: "What do families carry when buying produce?",
        options: ["Canvas bags", "Wooden boxes", "Plastic buckets", "Metal carts"],
        correctAnswer: "Canvas bags",
        explanation: "Paragraph 2 states they walk with canvas bags.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-first-bicycle',
    title: "Learning to Ride My First Bicycle",
    subtitle: "Overcoming fear with the help of a caring brother",
    level: 'A1',
    topic: "Daily Life",
    author: "Hannah Nguyen",
    estimatedMinutes: 3,
    wordCount: 145,
    coverImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-first-bicycle-p1',
        order: 1,
        english: "When I was seven years old, my father gave me a bright blue bicycle. At first, I was afraid of falling down and hurting my knees.",
        vietnamese: "N\u0103m t\u00f4i b\u1ea3y tu\u1ed5i, b\u1ed1 \u0111\u00e3 t\u1eb7ng t\u00f4i m\u1ed9t chi\u1ebfc xe \u0111\u1ea1p m\u00e0u xanh da tr\u1eddi r\u1ef1c r\u1ee1. Ban \u0111\u1ea7u, t\u00f4i s\u1ee3 b\u1ecb ng\u00e3 v\u00e0 \u0111au \u0111\u1ea7u g\u1ed1i.",
      },
      {
        id: 'a1-first-bicycle-p2',
        order: 2,
        english: "My older brother held the back of my seat and ran behind me in the park. Soon, I learned how to balance. Riding my bike felt like flying.",
        vietnamese: "Anh trai t\u00f4i \u0111\u00e3 gi\u1eef ph\u00eda sau y\u00ean xe v\u00e0 ch\u1ea1y theo sau t\u00f4i trong c\u00f4ng vi\u00ean. Ch\u1eb3ng m\u1ea5y ch\u1ed1c, t\u00f4i \u0111\u00e3 h\u1ecdc \u0111\u01b0\u1ee3c c\u00e1ch gi\u1eef th\u0103ng b\u1eb1ng. \u0110i xe \u0111\u1ea1p mang l\u1ea1i c\u1ea3m gi\u00e1c nh\u01b0 \u0111ang bay.",
      },
    ],
    questions: [
      {
        id: 'a1-first-bicycle-q1',
        type: 'multiple-choice',
        question: "Who gave the author the blue bicycle?",
        options: ["Her father", "Her brother", "Her teacher", "Her mother"],
        correctAnswer: "Her father",
        explanation: "Paragraph 1 mentions her father gave it to her.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-first-bicycle-q2',
        type: 'multiple-choice',
        question: "Where did they practice riding?",
        options: ["In the park", "On the beach", "At school", "In the bedroom"],
        correctAnswer: "In the park",
        explanation: "Paragraph 2 notes they practiced in the park.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-rainy-sunday',
    title: "Fun Activities on a Rainy Sunday",
    subtitle: "How a family stays cheerful when it rains outside",
    level: 'A1',
    topic: "Daily Life",
    author: "David Clark",
    estimatedMinutes: 3,
    wordCount: 140,
    coverImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-rainy-sunday-p1',
        order: 1,
        english: "Heavy rain falls against the window pane on Sunday afternoon. Instead of going to the playground, my family decides to play board games in the living room.",
        vietnamese: "M\u01b0a l\u1edbn r\u01a1i l\u1ed9p \u0111\u1ed9p v\u00e0o \u00f4 c\u1eeda s\u1ed5 v\u00e0o chi\u1ec1u Ch\u1ee7 nh\u1eadt. Thay v\u00ec ra s\u00e2n ch\u01a1i, gia \u0111\u00ecnh t\u00f4i quy\u1ebft \u0111\u1ecbnh ch\u01a1i c\u1edd trong ph\u00f2ng kh\u00e1ch.",
      },
      {
        id: 'a1-rainy-sunday-p2',
        order: 2,
        english: "Mom makes hot cocoa with tiny marshmallows for everyone. We listen to soft acoustic music and laugh together. Rainy days can be cozy and warm.",
        vietnamese: "M\u1eb9 pha ca cao n\u00f3ng v\u1edbi k\u1eb9o d\u1ebbo nh\u1ecf cho m\u1ecdi ng\u01b0\u1eddi. Ch\u00fang t\u00f4i nghe nh\u1ea1c m\u1ed9c \u00eam d\u1ecbu v\u00e0 c\u01b0\u1eddi \u0111\u00f9a c\u00f9ng nhau. Nh\u1eefng ng\u00e0y m\u01b0a c\u00f3 th\u1ec3 th\u1eadt \u1ea5m \u00e1p v\u00e0 d\u1ec5 ch\u1ecbu.",
      },
    ],
    questions: [
      {
        id: 'a1-rainy-sunday-q1',
        type: 'multiple-choice',
        question: "What game do they play inside?",
        options: ["Board games", "Video games", "Football", "Hide and seek"],
        correctAnswer: "Board games",
        explanation: "Paragraph 1 states they play board games.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-rainy-sunday-q2',
        type: 'multiple-choice',
        question: "What drink does Mom prepare?",
        options: ["Hot cocoa with marshmallows", "Iced coffee", "Orange juice", "Green tea"],
        correctAnswer: "Hot cocoa with marshmallows",
        explanation: "Paragraph 2 mentions hot cocoa.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-city-zoo',
    title: "An Exciting Trip to the City Zoo",
    subtitle: "Meeting tall giraffes, playful monkeys, and sleepy pandas",
    level: 'A1',
    topic: "Environment & Nature",
    author: "Sarah Jenkins",
    estimatedMinutes: 3,
    wordCount: 150,
    coverImage: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-city-zoo-p1',
        order: 1,
        english: "Yesterday, our school class visited the city zoo. The weather was sunny and mild. We walked along leafy pathways to see animals from around the globe.",
        vietnamese: "H\u00f4m qua, l\u1edbp h\u1ecdc c\u1ee7a ch\u00fang t\u00f4i \u0111\u00e3 \u0111\u1ebfn th\u0103m s\u1edf th\u00fa th\u00e0nh ph\u1ed1. Th\u1eddi ti\u1ebft n\u1eafng r\u00e1o v\u00e0 d\u1ec5 ch\u1ecbu. Ch\u00fang t\u00f4i \u0111i d\u1ecdc theo nh\u1eefng con \u0111\u01b0\u1eddng r\u1ee3p b\u00f3ng c\u00e2y \u0111\u1ec3 ng\u1eafm nh\u00ecn \u0111\u1ed9ng v\u1eadt.",
      },
      {
        id: 'a1-city-zoo-p2',
        order: 2,
        english: "The tall giraffes reached high tree branches to eat green leaves. Nearby, funny brown monkeys swung from ropes, making everyone laugh.",
        vietnamese: "Nh\u1eefng ch\u00fa h\u01b0\u01a1u cao c\u1ed5 v\u01b0\u01a1n t\u1edbi c\u00e1c c\u00e0nh c\u00e2y cao \u0111\u1ec3 \u0103n l\u00e1 xanh. G\u1ea7n \u0111\u00f3, nh\u1eefng ch\u00fa kh\u1ec9 m\u00e0u n\u00e2u tinh ngh\u1ecbch \u0111u \u0111\u01b0a tr\u00ean d\u00e2y th\u1eebng, khi\u1ebfn ai n\u1ea5y \u0111\u1ec1u c\u01b0\u1eddi vui.",
      },
    ],
    questions: [
      {
        id: 'a1-city-zoo-q1',
        type: 'multiple-choice',
        question: "What were the giraffes eating?",
        options: ["Green leaves from branches", "Apples and pears", "Meat and fish", "Dry grass on the ground"],
        correctAnswer: "Green leaves from branches",
        explanation: "Paragraph 2 states giraffes ate green leaves.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
      {
        id: 'a1-city-zoo-q2',
        type: 'multiple-choice',
        question: "What did the monkeys do?",
        options: ["Swung from ropes", "Slept in boxes", "Swam in water", "Flew in the air"],
        correctAnswer: "Swung from ropes",
        explanation: "Paragraph 2 mentions monkeys swung from ropes.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-first-flight',
    title: "Flying High: My First Airplane Journey",
    subtitle: "Looking down at tiny clouds and silver rivers from the sky",
    level: 'A1',
    topic: "Travel & Culture",
    author: "Kenji Sato",
    estimatedMinutes: 3,
    wordCount: 145,
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-first-flight-p1',
        order: 1,
        english: "I walked onto the big airplane with my parents. I found my seat next to the small oval window. When the plane took off, I felt butterflies in my stomach.",
        vietnamese: "T\u00f4i b\u01b0\u1edbc l\u00ean chi\u1ebfc m\u00e1y bay l\u1edbn c\u00f9ng b\u1ed1 m\u1eb9. T\u00f4i t\u00ecm th\u1ea5y ch\u1ed7 ng\u1ed3i c\u1ea1nh \u00f4 c\u1eeda s\u1ed5 nh\u1ecf. Khi m\u00e1y bay c\u1ea5t c\u00e1nh, t\u00f4i c\u1ea3m th\u1ea5y r\u1ed9n r\u00e0ng trong b\u1ee5ng.",
      },
      {
        id: 'a1-first-flight-p2',
        order: 2,
        english: "Outside the window, white clouds looked like giant fluffy pillows. Roads and houses looked as tiny as miniature toy models. Flying is truly magical.",
        vietnamese: "B\u00ean ngo\u00e0i c\u1eeda s\u1ed5, nh\u1eefng \u0111\u00e1m m\u00e2y tr\u1eafng tr\u00f4ng nh\u01b0 nh\u1eefng chi\u1ebfc g\u1ed1i b\u00f4ng kh\u1ed5ng l\u1ed3. \u0110\u01b0\u1eddng s\u00e1 v\u00e0 nh\u00e0 c\u1eeda tr\u00f4ng b\u00e9 x\u00edu nh\u01b0 nh\u1eefng m\u00f4 h\u00ecnh \u0111\u1ed3 ch\u01a1i thu nh\u1ecf.",
      },
    ],
    questions: [
      {
        id: 'a1-first-flight-q1',
        type: 'multiple-choice',
        question: "Where was the author's seat?",
        options: ["Next to the oval window", "In the cockpit", "Near the bathroom", "In the center aisle"],
        correctAnswer: "Next to the oval window",
        explanation: "Paragraph 1 states seat is next to the window.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-first-flight-q2',
        type: 'multiple-choice',
        question: "What did houses look like from above?",
        options: ["Miniature toy models", "Tall towers", "Giant trees", "Dark oceans"],
        correctAnswer: "Miniature toy models",
        explanation: "Paragraph 2 states houses looked like miniature toy models.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-baking-cookies',
    title: "Baking Warm Cookies with Grandma",
    subtitle: "Flour, butter, chocolate chips, and sweet family laughter",
    level: 'A1',
    topic: "Food & Nutrition",
    author: "Emily Watson",
    estimatedMinutes: 3,
    wordCount: 140,
    coverImage: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-baking-cookies-p1',
        order: 1,
        english: "Every autumn, Grandma invites me to her kitchen to bake chocolate chip cookies. We mix white flour, sweet sugar, butter, and dark chocolate chips in a large bowl.",
        vietnamese: "M\u1ed7i \u0111\u1ed9 thu v\u1ec1, b\u00e0 l\u1ea1i m\u1eddi t\u00f4i v\u00e0o b\u1ebfp \u0111\u1ec3 c\u00f9ng n\u01b0\u1edbng b\u00e1nh quy socola chip. Ch\u00fang t\u00f4i tr\u1ed9n b\u1ed9t m\u00ec tr\u1eafng, \u0111\u01b0\u1eddng ng\u1ecdt, b\u01a1 v\u00e0 nh\u1eefng vi\u00ean socola \u0111en v\u00e0o m\u1ed9t \u00e2u l\u1edbn.",
      },
      {
        id: 'a1-baking-cookies-p2',
        order: 2,
        english: "The oven turns warm and fills the house with a mouthwatering aroma. When the cookies turn golden brown, we take them out and enjoy them with cold fresh milk.",
        vietnamese: "L\u00f2 n\u01b0\u1edbng t\u1ecfa nhi\u1ec7t \u1ea5m \u00e1p v\u00e0 lan t\u1ecfa m\u00f9i th\u01a1m n\u1ee9c kh\u1eafp ng\u00f4i nh\u00e0. Khi b\u00e1nh chuy\u1ec3n sang m\u00e0u v\u00e0ng n\u00e2u, ch\u00fang t\u00f4i l\u1ea5y b\u00e1nh ra v\u00e0 th\u01b0\u1edfng th\u1ee9c c\u00f9ng s\u1eefa t\u01b0\u01a1i m\u00e1t l\u1ea1nh.",
      },
    ],
    questions: [
      {
        id: 'a1-baking-cookies-q1',
        type: 'multiple-choice',
        question: "What kind of cookies do they bake?",
        options: ["Chocolate chip cookies", "Peanut butter cookies", "Lemon biscuits", "Gingerbread men"],
        correctAnswer: "Chocolate chip cookies",
        explanation: "Paragraph 1 mentions chocolate chip cookies.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-baking-cookies-q2',
        type: 'multiple-choice',
        question: "What beverage do they drink with cookies?",
        options: ["Cold fresh milk", "Hot black tea", "Iced soda", "Lemon juice"],
        correctAnswer: "Cold fresh milk",
        explanation: "Paragraph 2 mentions cold fresh milk.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-public-library',
    title: "A Quiet Afternoon at the Public Library",
    subtitle: "Discovering fairy tales and colorful picture books",
    level: 'A1',
    topic: "Daily Life",
    author: "Michael Zhang",
    estimatedMinutes: 3,
    wordCount: 145,
    coverImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-public-library-p1',
        order: 1,
        english: "The public library is located near the city park. It is a quiet place with tall wooden shelves filled with thousands of exciting books.",
        vietnamese: "Th\u01b0 vi\u1ec7n c\u00f4ng c\u1ed9ng n\u1eb1m g\u1ea7n c\u00f4ng vi\u00ean th\u00e0nh ph\u1ed1. \u0110\u00f3 l\u00e0 m\u1ed9t n\u01a1i y\u00ean t\u0129nh v\u1edbi nh\u1eefng k\u1ec7 g\u1ed7 cao ch\u1ee9a h\u00e0ng ng\u00e0n cu\u1ed1n s\u00e1ch h\u1ea5p d\u1eabn.",
      },
      {
        id: 'a1-public-library-p2',
        order: 2,
        english: "People sit at long tables and read quietly under soft lamps. Children love the corner with cozy cushions where they can read illustrated storybooks.",
        vietnamese: "M\u1ecdi ng\u01b0\u1eddi ng\u1ed3i t\u1ea1i nh\u1eefng chi\u1ebfc b\u00e0n d\u00e0i v\u00e0 \u0111\u1ecdc s\u00e1ch y\u00ean t\u0129nh d\u01b0\u1edbi \u00e1nh \u0111\u00e8n \u00eam d\u1ecbu. Tr\u1ebb em r\u1ea5t th\u00edch g\u00f3c \u0111\u1ecdc s\u00e1ch c\u00f3 \u0111\u1ec7m \u00eam, n\u01a1i c\u00e1c em \u0111\u1ecdc truy\u1ec7n tranh minh h\u1ecda.",
      },
    ],
    questions: [
      {
        id: 'a1-public-library-q1',
        type: 'multiple-choice',
        question: "Where is the library located?",
        options: ["Near the city park", "Inside the airport", "Near the beach", "Behind the cinema"],
        correctAnswer: "Near the city park",
        explanation: "Paragraph 1 states it is located near the city park.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-public-library-q2',
        type: 'multiple-choice',
        question: "What can children do in the cozy corner?",
        options: ["Read illustrated storybooks", "Play loud drums", "Eat lunch", "Sleep overnight"],
        correctAnswer: "Read illustrated storybooks",
        explanation: "Paragraph 2 notes children read illustrated storybooks.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-hoan-kiem-morning',
    title: "Morning Along the Shore of Hoan Kiem Lake",
    subtitle: "Tai chi, gentle morning breeze, and warm bowls of Pho",
    level: 'A1',
    topic: "Travel & Culture",
    author: "Nguyen Thi Mai",
    estimatedMinutes: 3,
    wordCount: 150,
    coverImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-hoan-kiem-morning-p1',
        order: 1,
        english: "At sunrise, Hoan Kiem Lake in Hanoi awakens with gentle energy. Elderly people practice tai chi under green willow trees, while runners circle the peaceful water.",
        vietnamese: "Khi b\u00ecnh minh l\u00ean, H\u1ed3 Ho\u00e0n Ki\u1ebfm t\u1ea1i H\u00e0 N\u1ed9i th\u1ee9c gi\u1ea5c v\u1edbi ngu\u1ed3n n\u0103ng l\u01b0\u1ee3ng nh\u1eb9 nh\u00e0ng. C\u00e1c c\u1ee5 gi\u00e0 t\u1eadp d\u01b0\u1ee1ng sinh d\u01b0\u1edbi b\u00f3ng r\u00e2m r\u1ee7 c\u1ee7a c\u00e2y li\u1ec5u, ng\u01b0\u1eddi ch\u1ea1y b\u1ed9 v\u00f2ng quanh h\u1ed3.",
      },
      {
        id: 'a1-hoan-kiem-morning-p2',
        order: 2,
        english: "Street vendors set up small plastic stools on the pavement. People gather to eat steaming bowls of beef pho and drink iced tea before work begins.",
        vietnamese: "Nh\u1eefng ng\u01b0\u1eddi b\u00e1n h\u00e0ng rong k\u00ea nh\u1eefng chi\u1ebfc gh\u1ebf nh\u1ef1a nh\u1ecf tr\u00ean v\u1ec9a h\u00e8. M\u1ecdi ng\u01b0\u1eddi qu\u00e2y qu\u1ea7n th\u01b0\u1edfng th\u1ee9c nh\u1eefng b\u00e1t ph\u1edf b\u00f2 n\u00f3ng h\u1ed5i v\u00e0 u\u1ed1ng tr\u00e0 \u0111\u00e1 tr\u01b0\u1edbc gi\u1edd l\u00e0m vi\u1ec7c.",
      },
    ],
    questions: [
      {
        id: 'a1-hoan-kiem-morning-q1',
        type: 'multiple-choice',
        question: "What do people practice under willow trees?",
        options: ["Tai chi", "Basketball", "Swimming", "Guitar playing"],
        correctAnswer: "Tai chi",
        explanation: "Paragraph 1 mentions practicing tai chi.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-hoan-kiem-morning-q2',
        type: 'multiple-choice',
        question: "What breakfast is popular around the lake?",
        options: ["Beef pho", "Pancakes", "Croissant", "Sandwich"],
        correctAnswer: "Beef pho",
        explanation: "Paragraph 2 mentions steaming bowls of beef pho.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a1-science-fair',
    title: "Our Exciting Primary School Science Fair",
    subtitle: "Miniature volcanoes, lemon batteries, and starry planet models",
    level: 'A1',
    topic: "Science & Innovation",
    author: "Robert Miller",
    estimatedMinutes: 3,
    wordCount: 150,
    coverImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a1-science-fair-p1',
        order: 1,
        english: "Every spring, our elementary school hosts an exciting science fair in the gymnasium. Students work in small teams to build creative science projects.",
        vietnamese: "M\u1ed7i m\u00f9a xu\u00e2n, tr\u01b0\u1eddng ti\u1ec3u h\u1ecdc c\u1ee7a ch\u00fang t\u00f4i t\u1ed5 ch\u1ee9c m\u1ed9t h\u1ed9i ch\u1ee3 khoa h\u1ecdc s\u00f4i n\u1ed5i trong nh\u00e0 thi \u0111\u1ea5u th\u1ec3 thao. H\u1ecdc sinh l\u00e0m vi\u1ec7c theo nh\u00f3m nh\u1ecf \u0111\u1ec3 t\u1ea1o n\u00ean d\u1ef1 \u00e1n khoa h\u1ecdc.",
      },
      {
        id: 'a1-science-fair-p2',
        order: 2,
        english: "One group built a cardboard volcano that erupted with red bubbles. Another group lit a tiny bulb using two sour lemons. Parents clapped and cheered for all young inventors.",
        vietnamese: "M\u1ed9t nh\u00f3m \u0111\u00e3 l\u00e0m m\u1ed9t m\u00f4 h\u00ecnh n\u00fai l\u1eeda b\u1eb1ng b\u00eca c\u1ee9ng phun tr\u00e0o b\u1ecdt m\u00e0u \u0111\u1ecf. M\u1ed9t nh\u00f3m kh\u00e1c th\u1eafp s\u00e1ng b\u00f3ng \u0111\u00e8n nh\u1ecf ch\u1ec9 b\u1eb1ng hai qu\u1ea3 chanh. Ph\u1ee5 huynh v\u1ed7 tay c\u1ed5 v\u0169 nhi\u1ec7t t\u00ecnh.",
      },
    ],
    questions: [
      {
        id: 'a1-science-fair-q1',
        type: 'multiple-choice',
        question: "Where is the science fair hosted?",
        options: ["In the school gymnasium", "In the science lab", "On the football field", "At home"],
        correctAnswer: "In the school gymnasium",
        explanation: "Paragraph 1 notes it is hosted in the gymnasium.",
        difficulty: 'A1',
        relatedParagraph: 1,
      },
      {
        id: 'a1-science-fair-q2',
        type: 'multiple-choice',
        question: "How did one group light a tiny bulb?",
        options: ["Using two sour lemons", "Using solar panels", "Using wall electricity", "Using wind turbines"],
        correctAnswer: "Using two sour lemons",
        explanation: "Paragraph 2 states they lit a bulb using two sour lemons.",
        difficulty: 'A1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-camping-dalat',
    title: "A Starlit Camping Adventure in Da Lat",
    subtitle: "Crisp pine air, roasted marshmallows, and acoustic melodies",
    level: 'A2',
    topic: "Travel & Culture",
    author: "Tran Bao Long",
    estimatedMinutes: 3,
    wordCount: 175,
    coverImage: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-camping-dalat-p1',
        order: 1,
        english: "Nestled on a misty highland plateau, Da Lat is renowned for its tranquil pine forests and chilly evenings. Last November, our university trekking club pitched tents beside Tuyen Lam Lake.",
        vietnamese: "N\u1eb1m \u1ea9n m\u00ecnh tr\u00ean cao nguy\u00ean m\u1edd s\u01b0\u01a1ng, \u0110\u00e0 L\u1ea1t n\u1ed5i ti\u1ebfng v\u1edbi nh\u1eefng r\u1eebng th\u00f4ng y\u00ean b\u00ecnh v\u00e0 nh\u1eefng bu\u1ed5i t\u1ed1i se l\u1ea1nh. Th\u00e1ng 11 v\u1eeba qua, c\u00e2u l\u1ea1c b\u1ed9 trekking tr\u01b0\u1eddng ch\u00fang t\u00f4i \u0111\u00e3 c\u1eafm tr\u1ea1i b\u00ean b\u1edd h\u1ed3 Tuy\u1ec1n L\u00e2m.",
      },
      {
        id: 'a2-camping-dalat-p2',
        order: 2,
        english: "As the twilight faded into deep indigo, we gathered around a crackling campfire. Someone strummed an acoustic guitar, and the aroma of roasted sweet potatoes and corn filled the mountain breeze.",
        vietnamese: "Khi ho\u00e0ng h\u00f4n d\u1ea7n chuy\u1ec3n sang m\u00e0u ch\u00e0m \u0111\u1eadm, ch\u00fang t\u00f4i qu\u00e2y qu\u1ea7n b\u00ean \u0111\u1ed1m l\u1eeda b\u1eadp b\u00f9ng. Ai \u0111\u00f3 c\u1ea5t l\u00ean ti\u1ebfng \u0111\u00e0n guitar m\u1ed9c m\u1ea1c, v\u00e0 m\u00f9i khoai lang c\u00f9ng b\u1eafp n\u01b0\u1edbng th\u01a1m l\u1eebng bay theo l\u00e0n gi\u00f3 n\u00fai.",
      },
    ],
    questions: [
      {
        id: 'a2-camping-dalat-q1',
        type: 'multiple-choice',
        question: "Where did the trekking club pitch their tents?",
        options: ["Beside Tuyen Lam Lake", "On top of Lang Biang mountain", "In the central city square", "Next to Xuan Huong lake"],
        correctAnswer: "Beside Tuyen Lam Lake",
        explanation: "Paragraph 1 mentions pitching tents beside Tuyen Lam Lake.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-camping-dalat-q2',
        type: 'multiple-choice',
        question: "What foods were roasted over the campfire?",
        options: ["Sweet potatoes and corn", "Fish and rice", "Pizza and sausages", "Burgers and chips"],
        correctAnswer: "Sweet potatoes and corn",
        explanation: "Paragraph 2 mentions roasted sweet potatoes and corn.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-penang-street-food',
    title: "Savoring Street Food Heritage in George Town",
    subtitle: "Char kway teow, assam laksa, and centuries of culinary fusion",
    level: 'A2',
    topic: "Food & Nutrition",
    author: "Melissa Tan",
    estimatedMinutes: 3,
    wordCount: 180,
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-penang-street-food-p1',
        order: 1,
        english: "George Town, the historic capital of Penang, is celebrated as one of Asia's premier street food paradises. Colorful shophouses line narrow cobblestone streets filled with sizzling hawker carts.",
        vietnamese: "George Town, th\u1ee7 ph\u1ee7 l\u1ecbch s\u1eed c\u1ee7a Penang, \u0111\u01b0\u1ee3c vinh danh l\u00e0 m\u1ed9t trong nh\u1eefng thi\u00ean \u0111\u01b0\u1eddng \u1ea9m th\u1ef1c \u0111\u01b0\u1eddng ph\u1ed1 h\u00e0ng \u0111\u1ea7u ch\u00e2u \u00c1. Nh\u1eefng d\u00e3y nh\u00e0 c\u1ed5 r\u1ef1c r\u1ee1 s\u1eafc m\u00e0u n\u1eb1m d\u1ecdc c\u00e1c con ph\u1ed1 l\u00e1t \u0111\u00e1 ng\u1eadp tr\u00e0n ti\u1ebfng x\u00e8o x\u00e8o t\u1eeb c\u00e1c xe h\u00e0ng rong.",
      },
      {
        id: 'a2-penang-street-food-p2',
        order: 2,
        english: "Wok hei\u2014the smoky breath of an intensely heated iron wok\u2014defines the famous Char Kway Teow noodles. Street chefs masterfully toss flat rice noodles with fresh prawns, bean sprouts, and dark soy sauce.",
        vietnamese: "Wok hei\u2014h\u01a1i th\u1edf kh\u00f3i b\u1ed1c l\u00ean t\u1eeb ch\u1ea3o gang \u0111\u1ecf l\u1eeda\u2014t\u1ea1o n\u00ean n\u00e9t \u0111\u1eb7c tr\u01b0ng cho m\u00f3n m\u00ec x\u00e0o h\u1ee7 ti\u1ebfu Char Kway Teow tr\u1ee9 danh. C\u00e1c \u0111\u1ea7u b\u1ebfp \u0111\u01b0\u1eddng ph\u1ed1 \u0111\u1ea3o \u0111i\u00eau luy\u1ec7n s\u1ee3i b\u00e1nh h\u1ee7 ti\u1ebfu v\u1edbi t\u00f4m t\u01b0\u01a1i, gi\u00e1 \u0111\u1ed7 v\u00e0 x\u00ec d\u1ea7u \u0111en.",
      },
    ],
    questions: [
      {
        id: 'a2-penang-street-food-q1',
        type: 'multiple-choice',
        question: "What is Penang widely celebrated for?",
        options: ["Street food paradise", "Modern skyscrapers", "Ski resorts", "Desert safari"],
        correctAnswer: "Street food paradise",
        explanation: "Paragraph 1 introduces George Town as an Asian street food paradise.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-penang-street-food-q2',
        type: 'multiple-choice',
        question: "What does 'wok hei' refer to in Chinese culinary tradition?",
        options: ["The smoky breath of an intensely heated wok", "A secret blend of chili peppers", "The wooden handle of a frying pan", "Cold spring water used for boiling"],
        correctAnswer: "The smoky breath of an intensely heated wok",
        explanation: "Paragraph 2 defines wok hei as the smoky breath of a hot wok.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-smart-home-tech',
    title: "How Smart Home Technology Simplifies Daily Life",
    subtitle: "Voice assistants, automatic thermostats, and wireless lighting",
    level: 'A2',
    topic: "Technology",
    author: "Daniel Cooper",
    estimatedMinutes: 3,
    wordCount: 170,
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-smart-home-tech-p1',
        order: 1,
        english: "A decade ago, automated homes seemed like distant science fiction. Today, intelligent sensors and Wi-Fi-enabled appliances allow homeowners to manage their living spaces effortlessly through smartphones.",
        vietnamese: "M\u1ed9t th\u1eadp k\u1ef7 tr\u01b0\u1edbc, nh\u1eefng ng\u00f4i nh\u00e0 t\u1ef1 \u0111\u1ed9ng h\u00f3a d\u01b0\u1eddng nh\u01b0 ch\u1ec9 c\u00f3 trong phim vi\u1ec5n t\u01b0\u1edfng xa x\u00f4i. Ng\u00e0y nay, c\u00e1c c\u1ea3m bi\u1ebfn th\u00f4ng minh v\u00e0 thi\u1ebft b\u1ecb k\u1ebft n\u1ed1i Wi-Fi cho ph\u00e9p gia ch\u1ee7 qu\u1ea3n l\u00fd kh\u00f4ng gian s\u1ed1ng d\u1ec5 d\u00e0ng qua \u0111i\u1ec7n tho\u1ea1i.",
      },
      {
        id: 'a2-smart-home-tech-p2',
        order: 2,
        english: "Smart thermostats learn your routine to save electrical energy by cooling rooms only when you arrive home. Voice assistants can play news briefings, set cooking timers, and dim the lights before bedtime.",
        vietnamese: "B\u1ed9 \u0111i\u1ec1u nhi\u1ec7t th\u00f4ng minh h\u1ecdc th\u00f3i quen c\u1ee7a b\u1ea1n \u0111\u1ec3 ti\u1ebft ki\u1ec7m \u0111i\u1ec7n n\u0103ng b\u1eb1ng c\u00e1ch ch\u1ec9 l\u00e0m m\u00e1t ph\u00f2ng khi b\u1ea1n v\u1ec1 nh\u00e0. Tr\u1ee3 l\u00fd gi\u1ecdng n\u00f3i c\u00f3 th\u1ec3 ph\u00e1t tin t\u1ee9c, h\u1eb9n gi\u1edd n\u1ea5u \u0103n v\u00e0 l\u00e0m m\u1edd \u0111\u00e8n tr\u01b0\u1edbc khi \u0111i ng\u1ee7.",
      },
    ],
    questions: [
      {
        id: 'a2-smart-home-tech-q1',
        type: 'multiple-choice',
        question: "How do smart thermostats help save electrical energy?",
        options: ["By cooling rooms only when someone arrives home", "By turning off the refrigerator at night", "By converting heat into sound", "By blocking sunlight mechanically"],
        correctAnswer: "By cooling rooms only when someone arrives home",
        explanation: "Paragraph 2 explains it cools rooms only when you arrive home.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
      {
        id: 'a2-smart-home-tech-q2',
        type: 'multiple-choice',
        question: "How do users interact with smart home devices today?",
        options: ["Through smartphones and voice commands", "Only through landline telephones", "By sending postal letters", "By using coin tokens"],
        correctAnswer: "Through smartphones and voice commands",
        explanation: "Paragraph 1 and 2 mention smartphones and voice assistants.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
    ],
  },
  {
    id: 'a2-honeybee-communication',
    title: "The Waggle Dance: How Honeybees Communicate",
    subtitle: "Navigational geometry and floral coordinates inside the hive",
    level: 'A2',
    topic: "Environment & Nature",
    author: "Dr. Claire Laurent",
    estimatedMinutes: 3,
    wordCount: 185,
    coverImage: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-honeybee-communication-p1',
        order: 1,
        english: "Honeybees possess one of the most sophisticated communication systems in the animal kingdom. When a foraging bee discovers a rich patch of nectar-filled wildflowers, she returns to the hive to share directions.",
        vietnamese: "Ong m\u1eadt s\u1edf h\u1eefu m\u1ed9t trong nh\u1eefng h\u1ec7 th\u1ed1ng giao ti\u1ebfp tinh vi nh\u1ea5t trong th\u1ebf gi\u1edbi \u0111\u1ed9ng v\u1eadt. Khi m\u1ed9t ch\u00fa ong th\u1ee3 ph\u00e1t hi\u1ec7n m\u1ed9t v\u1ea1t hoa d\u1ea1i d\u1ed3i d\u00e0o m\u1eadt, n\u00f3 s\u1ebd quay tr\u1edf l\u1ea1i t\u1ed5 \u0111\u1ec3 truy\u1ec1n t\u1ea3i ch\u1ec9 d\u1eabn ph\u01b0\u01a1ng h\u01b0\u1edbng.",
      },
      {
        id: 'a2-honeybee-communication-p2',
        order: 2,
        english: "Inside the dark hive, she performs a rhythmic ritual called the 'waggle dance'. The angle of her figure-eight movement relative to gravity indicates the direction of the flowers relative to the sun.",
        vietnamese: "B\u00ean trong t\u1ed5 ong t\u1ed1i, n\u00f3 th\u1ef1c hi\u1ec7n m\u1ed9t \u0111i\u1ec7u nh\u1ea3y nghi th\u1ee9c nh\u1ecbp nh\u00e0ng g\u1ecdi l\u00e0 '\u0111i\u1ec7u nh\u1ea3y l\u1eafc l\u01b0' (waggle dance). G\u00f3c nghi\u00eang c\u1ee7a chuy\u1ec3n \u0111\u1ed9ng h\u00ecnh s\u1ed1 t\u00e1m so v\u1edbi tr\u1ecdng l\u1ef1c bi\u1ec3u th\u1ecb ph\u01b0\u01a1ng h\u01b0\u1edbng c\u1ee7a b\u00e3i hoa so v\u1edbi m\u1eb7t tr\u1eddi.",
      },
    ],
    questions: [
      {
        id: 'a2-honeybee-communication-q1',
        type: 'multiple-choice',
        question: "What is the dance performed by bees called?",
        options: ["The waggle dance", "The flight of the bumblebee", "The honey spiral", "The pollen hop"],
        correctAnswer: "The waggle dance",
        explanation: "Paragraph 2 identifies the ritual as the 'waggle dance'.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
      {
        id: 'a2-honeybee-communication-q2',
        type: 'multiple-choice',
        question: "What does the angle of the dance tell other bees?",
        options: ["The direction of the flowers relative to the sun", "The temperature inside the hive", "The age of the queen bee", "The coming of heavy rainfall"],
        correctAnswer: "The direction of the flowers relative to the sun",
        explanation: "Paragraph 2 explains the angle indicates direction relative to the sun.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-history-postage-stamp',
    title: "The Penny Black: How the Postage Stamp Was Born",
    subtitle: "A revolutionary postal reform in Victorian Britain",
    level: 'A2',
    topic: "Travel & Culture",
    author: "Arthur Pendelton",
    estimatedMinutes: 3,
    wordCount: 175,
    coverImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-history-postage-stamp-p1',
        order: 1,
        english: "Before the mid-nineteenth century, sending letters across Great Britain was an expensive and convoluted ordeal. Recipients\u2014not senders\u2014had to pay for delivery based on distance and sheet count.",
        vietnamese: "Tr\u01b0\u1edbc gi\u1eefa th\u1ebf k\u1ef7 XIX, g\u1eedi th\u01b0 t\u1ea1i V\u01b0\u01a1ng qu\u1ed1c Anh l\u00e0 m\u1ed9t tr\u1ea3i nghi\u1ec7m \u0111\u1eaft \u0111\u1ecf v\u00e0 ph\u1ee9c t\u1ea1p. Ng\u01b0\u1eddi nh\u1eadn\u2014ch\u1ee9 kh\u00f4ng ph\u1ea3i ng\u01b0\u1eddi g\u1eedi\u2014ph\u1ea3i tr\u1ea3 ph\u00ed chuy\u1ec3n ph\u00e1t d\u1ef1a tr\u00ean kho\u1ea3ng c\u00e1ch v\u00e0 s\u1ed1 l\u01b0\u1ee3ng trang gi\u1ea5y.",
      },
      {
        id: 'a2-history-postage-stamp-p2',
        order: 2,
        english: "In 1840, Rowland Hill introduced the Penny Black, the world's very first adhesive postage stamp. Featuring a profile portrait of young Queen Victoria, it allowed anyone to send a letter anywhere for just one penny.",
        vietnamese: "N\u0103m 1840, Rowland Hill \u0111\u00e3 gi\u1edbi thi\u1ec7u Penny Black, con tem b\u01b0u ch\u00ednh d\u00e1n d\u00ednh \u0111\u1ea7u ti\u00ean tr\u00ean th\u1ebf gi\u1edbi. V\u1edbi h\u00ecnh ch\u00e2n dung N\u1eef ho\u00e0ng Victoria th\u1eddi tr\u1ebb, n\u00f3 cho ph\u00e9p b\u1ea5t k\u1ef3 ai g\u1eedi th\u01b0 \u0111i b\u1ea5t c\u1ee9 \u0111\u00e2u ch\u1ec9 v\u1edbi gi\u00e1 m\u1ed9t xu.",
      },
    ],
    questions: [
      {
        id: 'a2-history-postage-stamp-q1',
        type: 'multiple-choice',
        question: "Who paid for mail delivery before the introduction of stamps?",
        options: ["The recipient of the letter", "The British Parliament", "The sender at the counter", "The local village mayor"],
        correctAnswer: "The recipient of the letter",
        explanation: "Paragraph 1 explains recipients had to pay for delivery.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-history-postage-stamp-q2',
        type: 'multiple-choice',
        question: "Who is depicted on the Penny Black stamp?",
        options: ["Queen Victoria", "King George", "Rowland Hill", "William Shakespeare"],
        correctAnswer: "Queen Victoria",
        explanation: "Paragraph 2 mentions Queen Victoria's profile portrait.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-importance-teen-sleep',
    title: "Why Sleep is Vital for Adolescent Brain Development",
    subtitle: "Memory consolidation, emotional regulation, and academic performance",
    level: 'A2',
    topic: "Health & Wellness",
    author: "Dr. Marcus Vance",
    estimatedMinutes: 3,
    wordCount: 180,
    coverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-importance-teen-sleep-p1',
        order: 1,
        english: "During adolescence, the human brain undergoes immense synaptic remodeling. Neurologists emphasize that teenagers require eight to ten hours of quality slumber each night to support this rapid transformation.",
        vietnamese: "Trong giai \u0111o\u1ea1n v\u1ecb th\u00e0nh ni\u00ean, n\u00e3o b\u1ed9 con ng\u01b0\u1eddi tr\u1ea3i qua s\u1ef1 t\u00e1i c\u1ea5u tr\u00fac synap th\u1ea7n kinh m\u1ea1nh m\u1ebd. C\u00e1c nh\u00e0 th\u1ea7n kinh h\u1ecdc nh\u1ea5n m\u1ea1nh r\u1eb1ng thanh thi\u1ebfu ni\u00ean c\u1ea7n t\u1eeb 8 \u0111\u1ebfn 10 gi\u1edd ng\u1ee7 ngon m\u1ed7i \u0111\u00eam \u0111\u1ec3 h\u1ed7 tr\u1ee3 s\u1ef1 bi\u1ebfn \u0111\u1ed5i n\u00e0y.",
      },
      {
        id: 'a2-importance-teen-sleep-p2',
        order: 2,
        english: "While teens sleep, the brain activates memory replay circuits, converting fragile daytime impressions into durable long-term knowledge. Chronic sleep deprivation weakens focus and increases mood swings.",
        vietnamese: "Trong khi thanh thi\u1ebfu ni\u00ean ng\u1ee7, n\u00e3o b\u1ed9 k\u00edch ho\u1ea1t c\u00e1c m\u1ea1ng n\u01a1-ron ph\u00e1t l\u1ea1i tr\u00ed nh\u1edb, chuy\u1ec3n \u0111\u1ed5i nh\u1eefng ki\u1ebfn th\u1ee9c ban ng\u00e0y th\u00e0nh tr\u00ed nh\u1edb d\u00e0i h\u1ea1n. Thi\u1ebfu ng\u1ee7 k\u00e9o d\u00e0i l\u00e0m suy y\u1ebfu kh\u1ea3 n\u0103ng t\u1eadp trung v\u00e0 gia t\u0103ng c\u00e1u g\u1eaft.",
      },
    ],
    questions: [
      {
        id: 'a2-importance-teen-sleep-q1',
        type: 'multiple-choice',
        question: "How many hours of sleep do teenagers require each night?",
        options: ["8 to 10 hours", "4 to 5 hours", "12 to 14 hours", "6 to 7 hours"],
        correctAnswer: "8 to 10 hours",
        explanation: "Paragraph 1 specifies eight to ten hours of quality slumber.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-importance-teen-sleep-q2',
        type: 'multiple-choice',
        question: "What does the brain do during sleep according to neurologists?",
        options: ["Consolidates fragile impressions into long-term knowledge", "Completely stops all cellular activity", "Burns body fat through shivering", "Erases all childhood memories"],
        correctAnswer: "Consolidates fragile impressions into long-term knowledge",
        explanation: "Paragraph 2 explains it converts daytime impressions into durable knowledge.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-marine-aquarium',
    title: "A Journey Beneath the Waves at the Oceanarium",
    subtitle: "Glass tunnels, graceful stingrays, and coral reef conservation",
    level: 'A2',
    topic: "Environment & Nature",
    author: "Liam O'Connor",
    estimatedMinutes: 3,
    wordCount: 170,
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-marine-aquarium-p1',
        order: 1,
        english: "Walking into the grand oceanarium feels like descending into the abyss of the Pacific Ocean. Visitors step onto a moving walkway beneath a transparent acrylic tunnel surrounded by marine life.",
        vietnamese: "B\u01b0\u1edbc v\u00e0o th\u1ee7y cung kh\u1ed5ng l\u1ed3 mang l\u1ea1i c\u1ea3m gi\u00e1c nh\u01b0 \u0111ang l\u1eb7n s\u00e2u xu\u1ed1ng l\u00f2ng Th\u00e1i B\u00ecnh D\u01b0\u01a1ng. Kh\u00e1ch tham quan b\u01b0\u1edbc l\u00ean \u0111\u01b0\u1eddng b\u0103ng chuy\u1ec1n d\u01b0\u1edbi \u0111\u01b0\u1eddng h\u1ea7m k\u00ednh trong su\u1ed1t \u0111\u01b0\u1ee3c bao quanh b\u1edfi c\u00e1c sinh v\u1eadt bi\u1ec3n.",
      },
      {
        id: 'a2-marine-aquarium-p2',
        order: 2,
        english: "Giant manta rays glide effortlessly overhead like aquatic eagles, while schools of silver mackerel dart in synchronized formations. Information plaques educate visitors on combating ocean acidification.",
        vietnamese: "Nh\u1eefng con c\u00e1 \u0111u\u1ed1i kh\u1ed5ng l\u1ed3 l\u01b0\u1edbt nh\u1eb9 nh\u00e0ng ph\u00eda tr\u00ean \u0111\u1ea7u nh\u01b0 nh\u1eefng ch\u00fa \u0111\u1ea1i b\u00e0ng bi\u1ec3n, trong khi \u0111\u00e0n c\u00e1 thu b\u1ea1c b\u01a1i theo \u0111\u1ed9i h\u00ecnh nh\u1ecbp nh\u00e0ng. C\u00e1c b\u1ea3ng th\u00f4ng tin gi\u00e1o d\u1ee5c du kh\u00e1ch v\u1ec1 vi\u1ec7c ch\u1ed1ng axit h\u00f3a \u0111\u1ea1i d\u01b0\u01a1ng.",
      },
    ],
    questions: [
      {
        id: 'a2-marine-aquarium-q1',
        type: 'multiple-choice',
        question: "How do visitors move through the underwater tunnel?",
        options: ["On a moving walkway", "In small yellow submarines", "By swimming with flippers", "By climbing rope ladders"],
        correctAnswer: "On a moving walkway",
        explanation: "Paragraph 1 mentions a moving walkway beneath the tunnel.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-marine-aquarium-q2',
        type: 'multiple-choice',
        question: "What educational topic is presented on information plaques?",
        options: ["Combating ocean acidification", "How to hunt wild whales", "Deep-sea oil drilling", "Building bigger cargo ships"],
        correctAnswer: "Combating ocean acidification",
        explanation: "Paragraph 2 highlights combating ocean acidification.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-origami-art',
    title: "The Delicate Japanese Craft of Origami",
    subtitle: "Transforming flat square sheets into poetic three-dimensional sculptures",
    level: 'A2',
    topic: "Travel & Culture",
    author: "Yuki Takahashi",
    estimatedMinutes: 3,
    wordCount: 165,
    coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-origami-art-p1',
        order: 1,
        english: "Origami, derived from the Japanese words 'ori' (folding) and 'kami' (paper), is an art form that began over a millennium ago. Master crafters fold a single square sheet without using scissors or glue.",
        vietnamese: "Origami, b\u1eaft ngu\u1ed3n t\u1eeb c\u00e1c t\u1eeb ti\u1ebfng Nh\u1eadt 'ori' (g\u1ea5p) v\u00e0 'kami' (gi\u1ea5y), l\u00e0 m\u1ed9t m\u00f4n ngh\u1ec7 thu\u1eadt kh\u1edfi ngu\u1ed3n h\u01a1n m\u1ed9t thi\u00ean ni\u00ean k\u1ef7 tr\u01b0\u1edbc. Nh\u1eefng b\u1eadc th\u1ea7y g\u1ea5p gi\u1ea5y c\u00f3 th\u1ec3 u\u1ed1n m\u1ed9t t\u1edd gi\u1ea5y vu\u00f4ng duy nh\u1ea5t m\u00e0 kh\u00f4ng d\u00f9ng k\u00e9o hay keo.",
      },
      {
        id: 'a2-origami-art-p2',
        order: 2,
        english: "The most iconic design is the origami crane (orizuru), considered a cultural symbol of peace and longevity. Ancient legend promises that anyone who folds one thousand paper cranes will be granted a sacred wish.",
        vietnamese: "M\u1eabu thi\u1ebft k\u1ebf mang t\u00ednh bi\u1ec3u t\u01b0\u1ee3ng nh\u1ea5t l\u00e0 c\u00e1nh h\u1ea1c gi\u1ea5y (orizuru), \u0111\u01b0\u1ee3c coi l\u00e0 bi\u1ec3u t\u01b0\u1ee3ng v\u0103n h\u00f3a c\u1ee7a h\u00f2a b\u00ecnh v\u00e0 tr\u01b0\u1eddng th\u1ecd. Truy\u1ec1n thuy\u1ebft x\u01b0a tin r\u1eb1ng ai g\u1ea5p \u0111\u1ee7 1.000 con h\u1ea1c gi\u1ea5y s\u1ebd \u0111\u01b0\u1ee3c to\u1ea1i nguy\u1ec7n m\u1ed9t \u0111i\u1ec1u \u01b0\u1edbc thi\u00eang li\u00eang.",
      },
    ],
    questions: [
      {
        id: 'a2-origami-art-q1',
        type: 'multiple-choice',
        question: "What does the Japanese word 'ori' mean?",
        options: ["Folding", "Cutting", "Painting", "Drawing"],
        correctAnswer: "Folding",
        explanation: "Paragraph 1 explains 'ori' means folding.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-origami-art-q2',
        type: 'multiple-choice',
        question: "What does the origami crane symbolize in Japanese culture?",
        options: ["Peace and longevity", "Wealth and greed", "Speed and agility", "Anger and war"],
        correctAnswer: "Peace and longevity",
        explanation: "Paragraph 2 identifies the crane as a symbol of peace and longevity.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-volunteer-youth',
    title: "Building Community Through Youth Volunteering",
    subtitle: "High school students cultivating community gardens and food banks",
    level: 'A2',
    topic: "Daily Life",
    author: "Chloe Bennett",
    estimatedMinutes: 3,
    wordCount: 175,
    coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-volunteer-youth-p1',
        order: 1,
        english: "Every Saturday, dozens of high school volunteers donate their morning hours to the neighborhood community kitchen. They slice fresh vegetables, pack nutrition boxes, and serve warm lunches.",
        vietnamese: "M\u1ed7i th\u1ee9 B\u1ea3y, h\u00e0ng ch\u1ee5c h\u1ecdc sinh trung h\u1ecdc t\u00ecnh nguy\u1ec7n d\u00e0nh bu\u1ed5i s\u00e1ng c\u1ee7a m\u00ecnh cho b\u1ebfp \u0103n c\u1ed9ng \u0111\u1ed3ng trong khu d\u00e2n c\u01b0. C\u00e1c b\u1ea1n th\u00e1i rau t\u01b0\u01a1i, \u0111\u00f3ng g\u00f3i c\u00e1c h\u1ed9p dinh d\u01b0\u1ee1ng v\u00e0 ph\u1ee5c v\u1ee5 b\u1eefa tr\u01b0a n\u00f3ng h\u1ed5i.",
      },
      {
        id: 'a2-volunteer-youth-p2',
        order: 2,
        english: "Volunteering teaches teenagers practical interpersonal skills and deep empathy for vulnerable citizens. Participating students report feeling greater self-esteem and a deeper sense of civic belonging.",
        vietnamese: "Ho\u1ea1t \u0111\u1ed9ng t\u00ecnh nguy\u1ec7n r\u00e8n luy\u1ec7n cho thanh thi\u1ebfu ni\u00ean k\u1ef9 n\u0103ng giao ti\u1ebfp th\u1ef1c t\u1ebf v\u00e0 s\u1ef1 \u0111\u1ed3ng c\u1ea3m s\u00e2u s\u1eafc v\u1edbi nh\u1eefng ho\u00e0n c\u1ea3nh kh\u00f3 kh\u0103n. C\u00e1c h\u1ecdc sinh tham gia c\u1ea3m th\u1ea5y t\u1ef1 tin h\u01a1n v\u00e0 g\u1eafn k\u1ebft tr\u00e1ch nhi\u1ec7m c\u1ed9ng \u0111\u1ed3ng s\u00e2u s\u1eafc h\u01a1n.",
      },
    ],
    questions: [
      {
        id: 'a2-volunteer-youth-q1',
        type: 'multiple-choice',
        question: "What tasks do volunteers perform at the community kitchen?",
        options: ["Slice vegetables and pack nutrition boxes", "Sell commercial snacks for profit", "Design video games", "Fix computer hardware"],
        correctAnswer: "Slice vegetables and pack nutrition boxes",
        explanation: "Paragraph 1 mentions slicing vegetables and packing nutrition boxes.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-volunteer-youth-q2',
        type: 'multiple-choice',
        question: "What positive outcome do participating students report?",
        options: ["Greater self-esteem and civic belonging", "Exhaustion and discouragement", "Higher financial earnings", "Desire to leave the city"],
        correctAnswer: "Greater self-esteem and civic belonging",
        explanation: "Paragraph 2 states students report greater self-esteem.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'a2-ancient-castles',
    title: "Whispers of the Past in Edinburgh Castle",
    subtitle: "Volcanic crags, medieval crowns, and centuries of Scottish history",
    level: 'A2',
    topic: "Travel & Culture",
    author: "Hamish MacLeod",
    estimatedMinutes: 3,
    wordCount: 185,
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'a2-ancient-castles-p1',
        order: 1,
        english: "Perched atop an extinct volcanic plug named Castle Rock, Edinburgh Castle dominates the skyline of Scotland's capital city. Archaeological excavations reveal human habitation on this site dating back to the Iron Age.",
        vietnamese: "T\u1ecda l\u1ea1c tr\u00ean \u0111\u1ec9nh m\u1ed9t kh\u1ed1i \u0111\u00e1 n\u00fai l\u1eeda \u0111\u00e3 t\u1eaft mang t\u00ean Castle Rock, L\u00e2u \u0111\u00e0i Edinburgh s\u1eebng s\u1eefng tr\u00ean n\u1ec1n tr\u1eddi th\u1ee7 \u0111\u00f4 Scotland. C\u00e1c cu\u1ed9c khai qu\u1eadt kh\u1ea3o c\u1ed5 cho th\u1ea5y con ng\u01b0\u1eddi \u0111\u00e3 sinh s\u1ed1ng \u1edf \u0111\u00e2y t\u1eeb Th\u1eddi k\u1ef3 \u0110\u1ed3 s\u1eaft.",
      },
      {
        id: 'a2-ancient-castles-p2',
        order: 2,
        english: "Visitors traverse cobblestone drawbridges to admire the Honors of Scotland\u2014the oldest surviving crown jewels in the British Isles. At precisely one o'clock every day, an artillery cannon fires over the firth.",
        vietnamese: "Du kh\u00e1ch \u0111i qua nh\u1eefng c\u00e2y c\u1ea7u k\u00e9o l\u00e1t \u0111\u00e1 \u0111\u1ec3 chi\u00eam ng\u01b0\u1ee1ng B\u1ed9 b\u00e1u v\u1eadt Ho\u00e0ng gia Scotland\u2014v\u01b0\u01a1ng mi\u1ec7n c\u1ed5 nh\u1ea5t c\u00f2n l\u01b0u gi\u1eef t\u1ea1i Qu\u1ea7n \u0111\u1ea3o Anh. \u0110\u00fang m\u1ed9t gi\u1edd chi\u1ec1u m\u1ed7i ng\u00e0y, m\u1ed9t ph\u00e1t \u0111\u1ea1i b\u00e1c l\u1ea1i r\u1ec1n vang h\u01b0\u1edbng ra v\u1ecbnh.",
      },
    ],
    questions: [
      {
        id: 'a2-ancient-castles-q1',
        type: 'multiple-choice',
        question: "Where is Edinburgh Castle built?",
        options: ["On an extinct volcanic rock", "On an artificial island in the lake", "Under a limestone cave", "In a dense pine valley"],
        correctAnswer: "On an extinct volcanic rock",
        explanation: "Paragraph 1 states it is perched atop Castle Rock, an extinct volcanic plug.",
        difficulty: 'A2',
        relatedParagraph: 1,
      },
      {
        id: 'a2-ancient-castles-q2',
        type: 'multiple-choice',
        question: "What event occurs every day at one o'clock?",
        options: ["An artillery cannon fires a blank salute", "The castle gates are permanently locked", "The crown jewels are moved into storage", "Church bells ring for three hours"],
        correctAnswer: "An artillery cannon fires a blank salute",
        explanation: "Paragraph 2 notes that at one o'clock, an artillery cannon fires.",
        difficulty: 'A2',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-solar-microgrids',
    title: "The Rise of Community Solar Microgrids",
    subtitle: "Decentralized clean energy empowers remote rural settlements",
    level: 'B1',
    topic: "Environment & Nature",
    author: "Siddharth Rao",
    estimatedMinutes: 3,
    wordCount: 210,
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-solar-microgrids-p1',
        order: 1,
        english: "Across developing agrarian regions, conventional national power grids often fail to reach isolated mountainous villages due to astronomical transmission infrastructure costs.",
        vietnamese: "T\u1ea1i c\u00e1c v\u00f9ng n\u00f4ng nghi\u1ec7p \u0111ang ph\u00e1t tri\u1ec3n, l\u01b0\u1edbi \u0111i\u1ec7n qu\u1ed1c gia truy\u1ec1n th\u1ed1ng th\u01b0\u1eddng kh\u00f3 v\u01b0\u01a1n t\u1edbi c\u00e1c ng\u00f4i l\u00e0ng mi\u1ec1n n\u00fai c\u00f4 l\u1eadp do chi ph\u00ed h\u1ea1 t\u1ea7ng truy\u1ec1n t\u1ea3i qu\u00e1 \u0111\u1eaft \u0111\u1ecf.",
      },
      {
        id: 'b1-solar-microgrids-p2',
        order: 2,
        english: "Community solar microgrids have emerged as an egalitarian solution. By pairing rooftop photovoltaic arrays with modular lithium iron phosphate battery banks, local cooperatives generate and distribute their own clean electricity independently.",
        vietnamese: "C\u00e1c l\u01b0\u1edbi \u0111i\u1ec7n m\u1eb7t tr\u1eddi vi m\u00f4 c\u1ed9ng \u0111\u1ed3ng \u0111\u00e3 n\u1ed5i l\u00ean nh\u01b0 m\u1ed9t gi\u1ea3i ph\u00e1p b\u00ecnh \u0111\u1eb3ng. B\u1eb1ng c\u00e1ch k\u1ebft h\u1ee3p c\u00e1c m\u1ea3ng pin quang \u0111i\u1ec7n tr\u00ean m\u00e1i nh\u00e0 v\u1edbi h\u1ec7 th\u1ed1ng pin l\u01b0u tr\u1eef lithium s\u1eaft phosphate, c\u00e1c h\u1ee3p t\u00e1c x\u00e3 \u0111\u1ecba ph\u01b0\u01a1ng t\u1ef1 t\u1ea1o v\u00e0 ph\u00e2n ph\u1ed1i ngu\u1ed3n \u0111i\u1ec7n s\u1ea1ch \u0111\u1ed9c l\u1eadp.",
      },
    ],
    questions: [
      {
        id: 'b1-solar-microgrids-q1',
        type: 'multiple-choice',
        question: "Why do traditional national power grids often fail to serve remote villages?",
        options: ["Due to astronomical transmission infrastructure costs", "Because villagers reject electric light", "Because solar panels are mandatory by law", "Due to an international ban on coal"],
        correctAnswer: "Due to astronomical transmission infrastructure costs",
        explanation: "Paragraph 1 mentions astronomical transmission infrastructure costs.",
        difficulty: 'B1',
        relatedParagraph: 1,
      },
      {
        id: 'b1-solar-microgrids-q2',
        type: 'multiple-choice',
        question: "How do local cooperatives store renewable energy in microgrids?",
        options: ["Using modular lithium iron phosphate battery banks", "In underground water tanks", "By burning coal reserves at night", "Through wooden flywheel devices"],
        correctAnswer: "Using modular lithium iron phosphate battery banks",
        explanation: "Paragraph 2 specifies battery banks.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-coffee-economics',
    title: "From Crop to Cup: The Global Economics of Coffee",
    subtitle: "Commodity futures, specialty roasting, and fair trade ethics",
    level: 'B1',
    topic: "Business & Career",
    author: "Camila Ortiz",
    estimatedMinutes: 3,
    wordCount: 220,
    coverImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-coffee-economics-p1',
        order: 1,
        english: "Coffee is the second most traded legal commodity on Earth, trailing only crude petroleum in overall market liquidity. Over twenty-five million smallholder farmers cultivate Arabica and Robusta varieties across the global Bean Belt.",
        vietnamese: "C\u00e0 ph\u00ea l\u00e0 m\u1eb7t h\u00e0ng h\u1ee3p ph\u00e1p \u0111\u01b0\u1ee3c giao d\u1ecbch nhi\u1ec1u th\u1ee9 hai tr\u00ean Tr\u00e1i \u0110\u1ea5t, ch\u1ec9 \u0111\u1ee9ng sau d\u1ea7u m\u1ecf th\u00f4 v\u1ec1 t\u00ednh thanh kho\u1ea3n to\u00e0n th\u1ecb tr\u01b0\u1eddng. H\u01a1n hai m\u01b0\u01a1i l\u0103m tri\u1ec7u h\u1ed9 n\u00f4ng d\u00e2n nh\u1ecf canh t\u00e1c c\u00e1c gi\u1ed1ng Arabica v\u00e0 Robusta tr\u00ean kh\u1eafp V\u00e0nh \u0111ai C\u00e0 ph\u00ea.",
      },
      {
        id: 'b1-coffee-economics-p2',
        order: 2,
        english: "While consumers in metropolitan cafes routinely pay five dollars for a flat white, farmers historically received less than ten percent of the retail value. The contemporary direct-trade movement seeks to bypass predatory middlemen.",
        vietnamese: "Trong khi ng\u01b0\u1eddi ti\u00eau d\u00f9ng t\u1ea1i c\u00e1c qu\u00e1n c\u00e0 ph\u00ea \u0111\u00f4 th\u1ecb th\u01b0\u1eddng tr\u1ea3 5 \u0111\u00f4 la cho m\u1ed9t t\u00e1ch c\u00e0 ph\u00ea s\u1eefa, ng\u01b0\u1eddi n\u00f4ng d\u00e2n tr\u01b0\u1edbc \u0111\u00e2y ch\u1ec9 nh\u1eadn \u0111\u01b0\u1ee3c ch\u01b0a \u0111\u1ea7y 10% gi\u00e1 tr\u1ecb b\u00e1n l\u1ebb. Phong tr\u00e0o th\u01b0\u01a1ng m\u1ea1i tr\u1ef1c ti\u1ebfp hi\u1ec7n nay t\u00ecm c\u00e1ch v\u01b0\u1ee3t qua c\u00e1c kh\u00e2u trung gian ch\u00e8n \u00e9p gi\u00e1.",
      },
    ],
    questions: [
      {
        id: 'b1-coffee-economics-q1',
        type: 'multiple-choice',
        question: "Where does coffee rank in global legal commodity trading volume?",
        options: ["Second, trailing only crude petroleum", "First, ahead of all energy resources", "Tenth, behind wheat and corn", "Fiftieth, behind luxury textiles"],
        correctAnswer: "Second, trailing only crude petroleum",
        explanation: "Paragraph 1 states it is second only to crude petroleum.",
        difficulty: 'B1',
        relatedParagraph: 1,
      },
      {
        id: 'b1-coffee-economics-q2',
        type: 'multiple-choice',
        question: "What is the primary goal of the modern direct-trade movement?",
        options: ["To bypass predatory middlemen and ensure fair compensation", "To increase chemical pesticide usage", "To eliminate organic Arabica varieties", "To replace coffee beans with artificial flavor"],
        correctAnswer: "To bypass predatory middlemen and ensure fair compensation",
        explanation: "Paragraph 2 notes it seeks to bypass predatory middlemen.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-digital-nomadism',
    title: "The Digital Nomad Phenomenon: Rethinking Work and Travel",
    subtitle: "Asynchronous collaboration, digital nomad visas, and local economies",
    level: 'B1',
    topic: "Business & Career",
    author: "Julian Vance",
    estimatedMinutes: 3,
    wordCount: 215,
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-digital-nomadism-p1',
        order: 1,
        english: "The widespread deployment of cloud computing and asynchronous team communication platforms has decoupled white-collar labor from fixed corporate cubicles.",
        vietnamese: "S\u1ef1 ph\u1ed5 bi\u1ebfn c\u1ee7a \u0111i\u1ec7n to\u00e1n \u0111\u00e1m m\u00e2y v\u00e0 c\u00e1c n\u1ec1n t\u1ea3ng giao ti\u1ebfp nh\u00f3m b\u1ea5t \u0111\u1ed3ng b\u1ed9 \u0111\u00e3 t\u00e1ch r\u1eddi lao \u0111\u1ed9ng tr\u00ed th\u1ee9c kh\u1ecfi nh\u1eefng \u00f4 v\u0103n ph\u00f2ng c\u1ed1 \u0111\u1ecbnh.",
      },
      {
        id: 'b1-digital-nomadism-p2',
        order: 2,
        english: "Millions of knowledge professionals now live as digital nomads, residing temporarily in hotspots like Bali, Lisbon, and Da Nang. While nomads inject disposable income into local service economies, surging rental prices can exacerbate housing insecurity for native residents.",
        vietnamese: "H\u00e0ng tri\u1ec7u chuy\u00ean gia tri th\u1ee9c gi\u1edd \u0111\u00e2y s\u1ed1ng nh\u01b0 nh\u1eefng du m\u1ee5c k\u1ef9 thu\u1eadt s\u1ed1, c\u01b0 tr\u00fa t\u1ea1m th\u1eddi t\u1ea1i c\u00e1c \u0111i\u1ec3m n\u00f3ng nh\u01b0 Bali, Lisbon v\u00e0 \u0110\u00e0 N\u1eb5ng. D\u00f9 h\u1ecd b\u01a1m ngu\u1ed3n thu nh\u1eadp chi ti\u00eau v\u00e0o d\u1ecbch v\u1ee5 \u0111\u1ecba ph\u01b0\u01a1ng, gi\u00e1 thu\u00ea nh\u00e0 t\u0103ng v\u1ecdt c\u0169ng c\u00f3 th\u1ec3 l\u00e0m tr\u1ea7m tr\u1ecdng th\u00eam \u00e1p l\u1ef1c nh\u00e0 \u1edf cho c\u01b0 d\u00e2n b\u1ea3n \u0111\u1ecba.",
      },
    ],
    questions: [
      {
        id: 'b1-digital-nomadism-q1',
        type: 'multiple-choice',
        question: "What technological shifts enabled the rise of digital nomadism?",
        options: ["Cloud computing and asynchronous collaboration tools", "Faster supersonic passenger jets", "The invention of landline fax machines", "Mandatory corporate relocation laws"],
        correctAnswer: "Cloud computing and asynchronous collaboration tools",
        explanation: "Paragraph 1 mentions cloud computing and asynchronous platforms.",
        difficulty: 'B1',
        relatedParagraph: 1,
      },
      {
        id: 'b1-digital-nomadism-q2',
        type: 'multiple-choice',
        question: "What socio-economic challenge can influxes of digital nomads create?",
        options: ["Surging rental prices causing housing insecurity for locals", "Depletion of regional drinking water reserves", "Immediate closure of local restaurants", "A collapse in telecommunications networks"],
        correctAnswer: "Surging rental prices causing housing insecurity for locals",
        explanation: "Paragraph 2 mentions surging rental prices exacerbating housing insecurity.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-color-psychology-ads',
    title: "The Subconscious Power of Color in Brand Marketing",
    subtitle: "Chromatic psychology, consumer appetites, and corporate trust",
    level: 'B1',
    topic: "Science & Innovation",
    author: "Alicia Moreau",
    estimatedMinutes: 3,
    wordCount: 225,
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-color-psychology-ads-p1',
        order: 1,
        english: "Marketing strategists have long recognized that visual aesthetics trigger instant visceral judgments in consumer psychology before analytical cognition engages.",
        vietnamese: "C\u00e1c chi\u1ebfn l\u01b0\u1ee3c gia ti\u1ebfp th\u1ecb t\u1eeb l\u00e2u \u0111\u00e3 nh\u1eadn ra r\u1eb1ng t\u00ednh th\u1ea9m m\u1ef9 th\u1ecb gi\u00e1c kh\u01a1i g\u1ee3i nh\u1eefng \u0111\u00e1nh gi\u00e1 c\u1ea3m x\u00fac t\u1ee9c th\u00ec trong t\u00e2m l\u00fd ng\u01b0\u1eddi ti\u00eau d\u00f9ng tr\u01b0\u1edbc khi nh\u1eadn th\u1ee9c ph\u00e2n t\u00edch k\u1ecbp ho\u1ea1t \u0111\u1ed9ng.",
      },
      {
        id: 'b1-color-psychology-ads-p2',
        order: 2,
        english: "Fast-food conglomerates predominantly deploy energetic reds and bright yellows because warmer wavelengths stimulate biological appetite and urgency. In contrast, banking institutions and tech giants choose deep cobalt blues to evoke integrity and stability.",
        vietnamese: "C\u00e1c t\u1eadp \u0111o\u00e0n th\u1ee9c \u0103n nhanh ch\u1ee7 y\u1ebfu s\u1eed d\u1ee5ng s\u1eafc \u0111\u1ecf tr\u00e0n \u0111\u1ea7y n\u0103ng l\u01b0\u1ee3ng v\u00e0 m\u00e0u v\u00e0ng t\u01b0\u01a1i v\u00ec c\u00e1c b\u01b0\u1edbc s\u00f3ng \u1ea5m h\u01a1n k\u00edch th\u00edch c\u1ea3m gi\u00e1c th\u00e8m \u0103n v\u00e0 s\u1ef1 h\u1ed1i h\u1ea3. Ng\u01b0\u1ee3c l\u1ea1i, c\u00e1c ng\u00e2n h\u00e0ng v\u00e0 t\u1eadp \u0111o\u00e0n c\u00f4ng ngh\u1ec7 ch\u1ecdn s\u1eafc xanh coban \u0111\u1eadm \u0111\u1ec3 g\u1ee3i l\u00ean s\u1ef1 ch\u00ednh tr\u1ef1c v\u00e0 \u1ed5n \u0111\u1ecbnh.",
      },
    ],
    questions: [
      {
        id: 'b1-color-psychology-ads-q1',
        type: 'multiple-choice',
        question: "Why do fast-food chains favor warm reds and yellows?",
        options: ["They stimulate biological appetite and urgency", "They represent icy winter refreshments", "They are the cheapest pigments to print", "They discourage customers from staying long"],
        correctAnswer: "They stimulate biological appetite and urgency",
        explanation: "Paragraph 2 explains warmer wavelengths stimulate appetite and urgency.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
      {
        id: 'b1-color-psychology-ads-q2',
        type: 'multiple-choice',
        question: "What emotional attributes does deep cobalt blue evoke in corporate branding?",
        options: ["Integrity, security, and stability", "Danger and reckless excitement", "Playful humor and sarcasm", "Extreme hunger and thirst"],
        correctAnswer: "Integrity, security, and stability",
        explanation: "Paragraph 2 mentions deep cobalt blue evokes integrity and stability.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-ocean-cleanup-tech',
    title: "Engineering Clean Oceans: Autonomous Barrier Systems",
    subtitle: "Intercepting microplastics in river deltas before reaching pelagic gyres",
    level: 'B1',
    topic: "Environment & Nature",
    author: "Boyan Vlasic",
    estimatedMinutes: 3,
    wordCount: 230,
    coverImage: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-ocean-cleanup-tech-p1',
        order: 1,
        english: "Over eight million metric tons of non-biodegradable polymeric waste enter planetary oceans annually, disintegrating into perilous microplastics through solar photolysis.",
        vietnamese: "H\u01a1n t\u00e1m tri\u1ec7u t\u1ea5n r\u00e1c th\u1ea3i polymer kh\u00f3 ph\u00e2n h\u1ee7y tr\u00f4i v\u00e0o c\u00e1c \u0111\u1ea1i d\u01b0\u01a1ng h\u00e0ng n\u0103m, v\u1ee1 v\u1ee5n th\u00e0nh c\u00e1c h\u1ea1t vi nh\u1ef1a nguy hi\u1ec3m d\u01b0\u1edbi t\u00e1c \u0111\u1ed9ng quang h\u00f3a c\u1ee7a \u00e1nh n\u1eafng m\u1eb7t tr\u1eddi.",
      },
      {
        id: 'b1-ocean-cleanup-tech-p2',
        order: 2,
        english: "Modern marine engineers have shifted their strategic focus upstream toward river mouths. Solar-powered autonomous catamaran interceptors collect floating debris before tidal currents disperse synthetic toxins across open pelagic ecosystems.",
        vietnamese: "C\u00e1c k\u1ef9 s\u01b0 h\u00e0ng h\u1ea3i hi\u1ec7n nay \u0111\u00e3 chuy\u1ec3n h\u01b0\u1edbng chi\u1ebfn l\u01b0\u1ee3c l\u00ean v\u00f9ng th\u01b0\u1ee3ng l\u01b0u t\u1ea1i c\u00e1c c\u1eeda s\u00f4ng. Nh\u1eefng t\u00e0u gom r\u00e1c hai th\u00e2n t\u1ef1 h\u00e0nh ch\u1ea1y b\u1eb1ng n\u0103ng l\u01b0\u1ee3ng m\u1eb7t tr\u1eddi thu gom r\u00e1c tr\u00f4i n\u1ed5i tr\u01b0\u1edbc khi th\u1ee7y tri\u1ec1u ph\u00e1t t\u00e1n \u0111\u1ed9c ch\u1ea5t ra ngo\u00e0i kh\u01a1i xa.",
      },
    ],
    questions: [
      {
        id: 'b1-ocean-cleanup-tech-q1',
        type: 'multiple-choice',
        question: "Why have ocean engineers focused cleanup efforts on river mouths?",
        options: ["To intercept waste before tides disperse it into open ocean gyres", "Because open oceans have no plastic waste", "Because rivers flow backwards in winter", "Due to strict bans on open-sea navigation"],
        correctAnswer: "To intercept waste before tides disperse it into open ocean gyres",
        explanation: "Paragraph 2 explains it captures debris before currents disperse it.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
      {
        id: 'b1-ocean-cleanup-tech-q2',
        type: 'multiple-choice',
        question: "How are modern river interceptor vessels powered?",
        options: ["Using solar photovoltaic energy", "By burning heavy diesel bunker oil", "Through manual rowing by volunteers", "By atomic fission reactors"],
        correctAnswer: "Using solar photovoltaic energy",
        explanation: "Paragraph 2 specifies solar-powered autonomous catamaran interceptors.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-ev-battery-breakthrough',
    title: "Next-Gen Batteries: Accelerating the EV Revolution",
    subtitle: "Lithium iron phosphate and solid-state electrolyte advancements",
    level: 'B1',
    topic: "Technology",
    author: "Dr. Gregory Thorne",
    estimatedMinutes: 3,
    wordCount: 215,
    coverImage: "https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-ev-battery-breakthrough-p1',
        order: 1,
        english: "The automotive sector is undergoing its most profound paradigm shift since Henry Ford introduced the moving assembly line. Electric vehicles (EVs) are transitioning from luxury novelties to mainstream transit.",
        vietnamese: "Ng\u00e0nh c\u00f4ng nghi\u1ec7p \u00f4 t\u00f4 \u0111ang tr\u1ea3i qua b\u01b0\u1edbc chuy\u1ec3n d\u1ecbch s\u00e2u s\u1eafc nh\u1ea5t k\u1ec3 t\u1eeb khi Henry Ford gi\u1edbi thi\u1ec7u d\u00e2y chuy\u1ec1n l\u1eafp r\u00e1p di \u0111\u1ed9ng. Xe \u0111i\u1ec7n (EV) \u0111ang chuy\u1ec3n m\u00ecnh t\u1eeb m\u00f3n \u0111\u1ed3 xa x\u1ec9 sang ph\u01b0\u01a1ng ti\u1ec7n giao th\u00f4ng ph\u1ed5 th\u00f4ng.",
      },
      {
        id: 'b1-ev-battery-breakthrough-p2',
        order: 2,
        english: "The historic impediment to mass adoption\u2014range anxiety\u2014is dissolving with breakthroughs in solid-state electrolytes and cobalt-free lithium iron phosphate chemistry, reducing charging times to under fifteen minutes.",
        vietnamese: "R\u00e0o c\u1ea3n l\u1ecbch s\u1eed \u0111\u1ed1i v\u1edbi vi\u1ec7c ph\u1ed5 c\u1eadp \u0111\u1ea1i ch\u00fang\u2014n\u1ed7i lo h\u1ebft pin d\u1ecdc \u0111\u01b0\u1eddng\u2014\u0111ang d\u1ea7n tan bi\u1ebfn nh\u1edd nh\u1eefng \u0111\u1ed9t ph\u00e1 v\u1ec1 ch\u1ea5t \u0111i\u1ec7n ph\u00e2n th\u1ec3 r\u1eafn v\u00e0 pin lithium s\u1eaft phosphate kh\u00f4ng ch\u1ee9a cobalt, gi\u00fap r\u00fat ng\u1eafn th\u1eddi gian s\u1ea1c xu\u1ed1ng d\u01b0\u1edbi 15 ph\u00fat.",
      },
    ],
    questions: [
      {
        id: 'b1-ev-battery-breakthrough-q1',
        type: 'multiple-choice',
        question: "What historic consumer anxiety is being resolved by battery advancements?",
        options: ["Range anxiety regarding running out of charge", "Fear of automated steering wheels", "Dislike of silent car engines", "Worry about vehicle paint color fading"],
        correctAnswer: "Range anxiety regarding running out of charge",
        explanation: "Paragraph 2 mentions range anxiety is dissolving.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
      {
        id: 'b1-ev-battery-breakthrough-q2',
        type: 'multiple-choice',
        question: "How fast can next-generation EV battery chemistries be recharged?",
        options: ["Under fifteen minutes", "Over forty-eight hours", "Exactly seven days", "Instantaneously in zero seconds"],
        correctAnswer: "Under fifteen minutes",
        explanation: "Paragraph 2 states charging times are reduced to under fifteen minutes.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-japanese-dining-etiquette',
    title: "Harmony at the Table: Japanese Culinary Etiquette",
    subtitle: "The cultural reverence of itadakimasu, chopsticks, and omotenashi",
    level: 'B1',
    topic: "Travel & Culture",
    author: "Kenjiro Watanabe",
    estimatedMinutes: 3,
    wordCount: 220,
    coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-japanese-dining-etiquette-p1',
        order: 1,
        english: "In Japan, dining is elevated beyond caloric sustenance into an intricate choreography of mutual respect between patron, chef, and nature. Meals commence with the phrase 'Itadakimasu', expressing gratitude for the sacrifice of living organisms.",
        vietnamese: "T\u1ea1i Nh\u1eadt B\u1ea3n, vi\u1ec7c d\u00f9ng b\u1eefa \u0111\u01b0\u1ee3c n\u00e2ng t\u1ea7m v\u01b0\u1ee3t ra ngo\u00e0i vi\u1ec7c n\u1ea1p n\u0103ng l\u01b0\u1ee3ng calo th\u00e0nh m\u1ed9t v\u0169 \u0111i\u1ec7u t\u00f4n tr\u1ecdng l\u1eabn nhau gi\u1eefa th\u1ef1c kh\u00e1ch, \u0111\u1ea7u b\u1ebfp v\u00e0 t\u1ef1 nhi\u00ean. B\u1eefa \u0103n b\u1eaft \u0111\u1ea7u b\u1eb1ng c\u00e2u 'Itadakimasu', b\u00e0y t\u1ecf l\u00f2ng bi\u1ebft \u01a1n s\u00e2u s\u1eafc \u0111\u1ebfn s\u1ef1 hy sinh c\u1ee7a c\u00e1c sinh v\u1eadt s\u1ed1ng.",
      },
      {
        id: 'b1-japanese-dining-etiquette-p2',
        order: 2,
        english: "Chopstick etiquette involves strict social taboos: passing food directly chopstick-to-chopstick (hashi-watashi) is strictly prohibited because it mimics Buddhist mortuary rituals. Slurping soba or ramen noodles, however, is praised as a sign of culinary appreciation.",
        vietnamese: "Ph\u00e9p t\u1eafc d\u00f9ng \u0111\u0169a c\u00f3 nh\u1eefng \u0111i\u1ec1u ki\u00eang k\u1ef5 nghi\u00eam ng\u1eb7t: g\u1eafp th\u1ee9c \u0103n tr\u1ef1c ti\u1ebfp \u0111\u0169a-sang-\u0111\u0169a b\u1ecb c\u1ea5m v\u00ec gi\u1ed1ng nghi th\u1ee9c tang l\u1ec5 Ph\u1eadt gi\u00e1o. Tuy nhi\u00ean, vi\u1ec7c h\u00fap x\u00ec x\u1ee5p m\u00ec soba ho\u1eb7c ramen l\u1ea1i \u0111\u01b0\u1ee3c khen ng\u1ee3i nh\u01b0 m\u1ed9t l\u1eddi t\u00e1n d\u01b0\u01a1ng \u0111\u1ed9 ngon c\u1ee7a m\u00f3n \u0103n.",
      },
    ],
    questions: [
      {
        id: 'b1-japanese-dining-etiquette-q1',
        type: 'multiple-choice',
        question: "What does the introductory phrase 'Itadakimasu' express?",
        options: ["Gratitude for the living organisms that provided the food", "An apology for arriving late to the meal", "A request for a discount on the bill", "A blessing for good financial fortune"],
        correctAnswer: "Gratitude for the living organisms that provided the food",
        explanation: "Paragraph 1 explains it expresses gratitude for the sacrifice of organisms.",
        difficulty: 'B1',
        relatedParagraph: 1,
      },
      {
        id: 'b1-japanese-dining-etiquette-q2',
        type: 'multiple-choice',
        question: "Why is passing food chopstick-to-chopstick taboo in Japan?",
        options: ["It mimics Buddhist mortuary rituals", "It is considered physically painful", "It violates health sanitation laws", "It damages the wooden chopsticks"],
        correctAnswer: "It mimics Buddhist mortuary rituals",
        explanation: "Paragraph 2 explains it mimics mortuary rituals.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-mediterranean-diet',
    title: "The Mediterranean Diet: An Epidemiological Blueprint for Longevity",
    subtitle: "Polyphenols, monounsaturated fats, and cardiovascular protection",
    level: 'B1',
    topic: "Health & Wellness",
    author: "Dr. Sofia Rossi",
    estimatedMinutes: 3,
    wordCount: 225,
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-mediterranean-diet-p1',
        order: 1,
        english: "Epidemiological studies tracking demographic cohorts across Greece and Southern Italy have long documented exceptionally low incidences of ischemic heart disease and extended lifespans.",
        vietnamese: "C\u00e1c nghi\u00ean c\u1ee9u d\u1ecbch t\u1ec5 h\u1ecdc theo d\u00f5i c\u00e1c nh\u00f3m d\u00e2n c\u01b0 t\u1ea1i Hy L\u1ea1p v\u00e0 Nam \u00dd t\u1eeb l\u00e2u \u0111\u00e3 ghi nh\u1eadn t\u1ef7 l\u1ec7 m\u1eafc b\u1ec7nh tim thi\u1ebfu m\u00e1u c\u1ee5c b\u1ed9 \u0111\u1eb7c bi\u1ec7t th\u1ea5p c\u00f9ng tu\u1ed5i th\u1ecd k\u00e9o d\u00e0i.",
      },
      {
        id: 'b1-mediterranean-diet-p2',
        order: 2,
        english: "The cornerstone of this protective dietary matrix is extra virgin olive oil, brimming with oleic acid and anti-inflammatory polyphenols. Combined with daily legumes, vibrant vegetables, and wild fish, it preserves vascular endothelium integrity.",
        vietnamese: "N\u1ec1n t\u1ea3ng c\u1ee7a ch\u1ebf \u0111\u1ed9 \u0103n b\u1ea3o v\u1ec7 s\u1ee9c kh\u1ecfe n\u00e0y l\u00e0 d\u1ea7u \u00f4 liu nguy\u00ean ch\u1ea5t, d\u1ed3i d\u00e0o axit oleic v\u00e0 c\u00e1c polyphenol kh\u00e1ng vi\u00eam. K\u1ebft h\u1ee3p v\u1edbi c\u00e1c lo\u1ea1i \u0111\u1eadu h\u00e0ng ng\u00e0y, rau c\u1ee7 r\u1ef1c r\u1ee1 v\u00e0 c\u00e1 bi\u1ec3n, n\u00f3 gi\u00fap b\u1ea3o t\u1ed3n s\u1ef1 to\u00e0n v\u1eb9n c\u1ee7a l\u1edbp n\u1ed9i m\u00f4 m\u1ea1ch m\u00e1u.",
      },
    ],
    questions: [
      {
        id: 'b1-mediterranean-diet-q1',
        type: 'multiple-choice',
        question: "What region's populations inspired the Mediterranean longevity studies?",
        options: ["Southern Italy and Greece", "Northern Scandinavia", "Central Alaska", "Equatorial Africa"],
        correctAnswer: "Southern Italy and Greece",
        explanation: "Paragraph 1 specifies Greece and Southern Italy.",
        difficulty: 'B1',
        relatedParagraph: 1,
      },
      {
        id: 'b1-mediterranean-diet-q2',
        type: 'multiple-choice',
        question: "What key nutritional component in extra virgin olive oil offers anti-inflammatory protection?",
        options: ["Oleic acid and polyphenols", "Saturated animal tallow", "Refined sucrose crystals", "Artificial trans-fats"],
        correctAnswer: "Oleic acid and polyphenols",
        explanation: "Paragraph 2 highlights oleic acid and anti-inflammatory polyphenols.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-vertical-farming',
    title: "Skyward Agriculture: The Science of Vertical Farming",
    subtitle: "Closed-loop hydroponics and LED photon spectrums in cities",
    level: 'B1',
    topic: "Science & Innovation",
    author: "Ingrid Lindholm",
    estimatedMinutes: 3,
    wordCount: 220,
    coverImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-vertical-farming-p1',
        order: 1,
        english: "As global population approaches ten billion by mid-century, conventional agriculture faces profound ecological crises: arable soil degradation, fertilizer runoff, and vulnerable supply chains.",
        vietnamese: "Khi d\u00e2n s\u1ed1 to\u00e0n c\u1ea7u ti\u1ebfn g\u1ea7n m\u1ed1c m\u01b0\u1eddi t\u1ef7 ng\u01b0\u1eddi v\u00e0o gi\u1eefa th\u1ebf k\u1ef7 n\u00e0y, n\u00f4ng nghi\u1ec7p truy\u1ec1n th\u1ed1ng \u0111\u1ed1i m\u1eb7t v\u1edbi nh\u1eefng cu\u1ed9c kh\u1ee7ng ho\u1ea3ng sinh th\u00e1i tr\u1ea7m tr\u1ecdng: tho\u00e1i h\u00f3a \u0111\u1ea5t canh t\u00e1c, r\u1eeda tr\u00f4i ph\u00e2n b\u00f3n v\u00e0 chu\u1ed7i cung \u1ee9ng d\u1ec5 t\u1ed5n th\u01b0\u01a1ng.",
      },
      {
        id: 'b1-vertical-farming-p2',
        order: 2,
        english: "Vertical indoor farms stack hydroponic cultivation trays inside temperature-regulated urban facilities. By tuning photosynthetic LED spectrums and recycling moisture, these facilities consume ninety-five percent less freshwater than open-field farms.",
        vietnamese: "C\u00e1c trang tr\u1ea1i th\u1eb3ng \u0111\u1ee9ng trong nh\u00e0 x\u1ebfp ch\u1ed3ng c\u00e1c khay th\u1ee7y canh b\u00ean trong c\u00e1c c\u01a1 s\u1edf \u0111\u00f4 th\u1ecb \u0111\u01b0\u1ee3c ki\u1ec3m so\u00e1t nhi\u1ec7t \u0111\u1ed9. B\u1eb1ng c\u00e1ch tinh ch\u1ec9nh d\u1ea3i quang ph\u1ed5 LED quang h\u1ee3p v\u00e0 t\u00e1i ch\u1ebf \u0111\u1ed9 \u1ea9m, c\u00e1c c\u01a1 s\u1edf n\u00e0y ti\u1ebft ki\u1ec7m t\u1edbi 95% l\u01b0\u1ee3ng n\u01b0\u1edbc ng\u1ecdt so v\u1edbi tr\u1ed3ng tr\u1ecdt ngo\u00e0i \u0111\u1ed3ng.",
      },
    ],
    questions: [
      {
        id: 'b1-vertical-farming-q1',
        type: 'multiple-choice',
        question: "How much freshwater can vertical farming conserve compared to open-field farming?",
        options: ["Up to ninety-five percent", "Approximately five percent", "Zero percent", "Around fifty percent"],
        correctAnswer: "Up to ninety-five percent",
        explanation: "Paragraph 2 states it consumes ninety-five percent less freshwater.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
      {
        id: 'b1-vertical-farming-q2',
        type: 'multiple-choice',
        question: "How are crops illuminated in vertical urban greenhouses?",
        options: ["Through precisely tuned photosynthetic LED spectrums", "Exclusively with natural moonlight", "Using open kerosene lanterns", "With incandescent heat lamps"],
        correctAnswer: "Through precisely tuned photosynthetic LED spectrums",
        explanation: "Paragraph 2 mentions tuning photosynthetic LED spectrums.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
    id: 'b1-indigenous-folktales',
    title: "Digital Preservation of Indigenous Oral Traditions",
    subtitle: "Recording endangered dialects and ancestral ecological wisdom",
    level: 'B1',
    topic: "Travel & Culture",
    author: "Kaelen Thorne",
    estimatedMinutes: 3,
    wordCount: 215,
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&auto=format&fit=crop&q=80",
    vocabularyIds: [],
    paragraphs: [
      {
        id: 'b1-indigenous-folktales-p1',
        order: 1,
        english: "Linguists calculate that of the world's seven thousand living tongues, roughly half risk extinction within the century as younger generations assimilate into dominant languages.",
        vietnamese: "C\u00e1c nh\u00e0 ng\u00f4n ng\u1eef h\u1ecdc t\u00ednh to\u00e1n r\u1eb1ng trong s\u1ed1 b\u1ea3y ngh\u00ecn ng\u00f4n ng\u1eef s\u1ed1ng c\u1ee7a th\u1ebf gi\u1edbi, kho\u1ea3ng m\u1ed9t n\u1eeda c\u00f3 nguy c\u01a1 tuy\u1ec7t ch\u1ee7ng trong th\u1ebf k\u1ef7 n\u00e0y khi c\u00e1c th\u1ebf h\u1ec7 tr\u1ebb h\u00f2a nh\u1eadp v\u00e0o c\u00e1c ng\u00f4n ng\u1eef ph\u1ed5 bi\u1ebfn h\u01a1n.",
      },
      {
        id: 'b1-indigenous-folktales-p2',
        order: 2,
        english: "Grassroots anthropologic initiatives are deploying cloud audio archives to record indigenous elders reciting ancestral fables. These digital repositories preserve invaluable ecological knowledge and metaphysical worldview philosophies.",
        vietnamese: "C\u00e1c s\u00e1ng ki\u1ebfn nh\u00e2n ch\u1ee7ng h\u1ecdc c\u01a1 s\u1edf \u0111ang tri\u1ec3n khai kho l\u01b0u tr\u1eef \u00e2m thanh \u0111\u00e1m m\u00e2y \u0111\u1ec3 ghi l\u1ea1i gi\u1ecdng k\u1ec3 c\u1ee7a c\u00e1c gi\u00e0 l\u00e0ng b\u1ea3n \u0111\u1ecba. Nh\u1eefng kho l\u01b0u tr\u1eef s\u1ed1 n\u00e0y b\u1ea3o t\u1ed3n tri th\u1ee9c sinh th\u00e1i v\u00f4 gi\u00e1 c\u00f9ng th\u1ebf gi\u1edbi quan tri\u1ebft h\u1ecdc c\u1ee7a t\u1ed5 ti\u00ean.",
      },
    ],
    questions: [
      {
        id: 'b1-indigenous-folktales-q1',
        type: 'multiple-choice',
        question: "What fraction of human languages is currently at risk of extinction this century?",
        options: ["Roughly half", "Nearly one hundred percent", "Less than two percent", "Only five languages"],
        correctAnswer: "Roughly half",
        explanation: "Paragraph 1 states roughly half risk extinction within the century.",
        difficulty: 'B1',
        relatedParagraph: 1,
      },
      {
        id: 'b1-indigenous-folktales-q2',
        type: 'multiple-choice',
        question: "What valuable wisdom is preserved within ancestral indigenous fables?",
        options: ["Ecological knowledge and cultural worldviews", "Stock market investment strategies", "Modern computer programming scripts", "Automotive manufacturing blueprints"],
        correctAnswer: "Ecological knowledge and cultural worldviews",
        explanation: "Paragraph 2 highlights ecological knowledge and worldview philosophies.",
        difficulty: 'B1',
        relatedParagraph: 2,
      },
    ],
  },
  {
  "id": "b2-ai-workplace-automation",
  "title": "Workplace Automation: Symbiosis Over Displacement",
  "subtitle": "How generative agents augment professional workflows without eradicating human agency",
  "level": "B2",
  "topic": "Technology",
  "author": "Dr. Aris Vance",
  "estimatedMinutes": 4,
  "wordCount": 245,
  "coverImage": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-ai-workplace-automation-p1",
      "order": 1,
      "english": "Pessimistic predictions regarding artificial intelligence frequently forecast catastrophic white-collar unemployment. However, empirical industrial observations suggest an alternative paradigm: algorithmic augmentation rather than outright human replacement.",
      "vietnamese": "Những dự báo bi quan về trí tuệ nhân tạo thường tiên đoán tình trạng thất nghiệp diện rộng của giới văn phòng. Tuy nhiên, các quan sát thực nghiệm trong ngành cho thấy một mô hình thay thế: sự gia tăng năng lực nhờ thuật toán thay vì thay thế hoàn toàn con người."
    },
    {
      "id": "b2-ai-workplace-automation-p2",
      "order": 2,
      "english": "Routine cognitive tasks such as rudimentary data extraction and boilerplate drafting are rapidly delegated to autonomous agents. Consequently, knowledge workers pivot toward high-order problem formulation, ethical adjudication, and empathetic cross-functional synthesis.",
      "vietnamese": "Các tác vụ nhận thức lặp lại như trích xuất dữ liệu cơ bản và soạn thảo bản nháp mẫu được nhanh chóng ủy thác cho các tác nhân tự hành. Nhờ đó, người lao động tri thức chuyển trọng tâm sang việc định hình vấn đề bậc cao, phán đoán đạo đức và tổng hợp liên chức năng giàu tính đồng cảm."
    }
  ],
  "questions": [
    {
      "id": "b2-ai-workplace-automation-q1",
      "type": "main-idea",
      "question": "What is the primary conclusion regarding AI's impact on knowledge work?",
      "options": [
        "AI augments human professionals rather than merely eliminating jobs",
        "All white-collar positions will disappear within five years",
        "Humans will only perform manual mechanical tasks",
        "Companies should ban all algorithmic software"
      ],
      "correctAnswer": "AI augments human professionals rather than merely eliminating jobs",
      "explanation": "Paragraph 1 highlights algorithmic augmentation rather than outright replacement.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-ai-workplace-automation-q2",
      "type": "multiple-choice",
      "question": "Which capabilities become more valuable for human employees as routine tasks automate?",
      "options": [
        "High-order problem formulation and ethical judgment",
        "Rote arithmetic memorization",
        "Manual typewriter transcription",
        "Physical postal mail sorting"
      ],
      "correctAnswer": "High-order problem formulation and ethical judgment",
      "explanation": "Paragraph 2 explicitly lists high-order problem formulation, ethical adjudication, and empathetic synthesis.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-renewable-energy-grids",
  "title": "Decentralized Smart Grids and Intermittent Clean Energy",
  "subtitle": "Overcoming grid instability with utility-scale battery storage and dynamic load balancing",
  "level": "B2",
  "topic": "Environment & Energy",
  "author": "Dr. Henrik Lindqvist",
  "estimatedMinutes": 4,
  "wordCount": 260,
  "coverImage": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-renewable-energy-grids-p1",
      "order": 1,
      "english": "The proliferation of photovoltaic panels and offshore wind turbines presents a fundamental grid stability paradox. Solar and aerodynamic energy yields fluctuate drastically based on diurnal cycles and meteorological anomalies, jeopardizing transmission equilibria.",
      "vietnamese": "Sự phổ biến của các tấm pin quang điện và tuabin gió ngoài khơi tạo ra một nghịch lý cơ bản về độ ổn định lưới điện. Sản lượng năng lượng mặt trời và gió biến động mạnh theo chu kỳ ngày đêm và dị thường thời tiết, đe dọa sự cân bằng truyền tải."
    },
    {
      "id": "b2-renewable-energy-grids-p2",
      "order": 2,
      "english": "To rectify this intermittency, modern municipal utilities deploy utility-scale lithium-iron-phosphate batteries alongside predictive machine-learning load balancers. These intelligent grids automatically absorb surge generation during midday peaks and disburse power during residential twilight demand.",
      "vietnamese": "Để khắc phục tính chập chờn này, các công ty tiện ích đô thị hiện đại triển khai hệ thống pin lithium-sắt-phốt phát quy mô lớn cùng các thuật toán cân bằng tải dự đoán học máy. Những lưới điện thông minh này tự động tích trữ nguồn phát dư thừa trong giờ cao điểm ban ngày và phân phối điện trong giờ dùng cao điểm lúc chập tối."
    }
  ],
  "questions": [
    {
      "id": "b2-renewable-energy-grids-q1",
      "type": "multiple-choice",
      "question": "What is the primary technical obstacle facing solar and wind power generation?",
      "options": [
        "Intermittent yield dependent on weather and day-night cycles",
        "Excessive greenhouse emissions during operation",
        "Complete inability to conduct electricity through copper lines",
        "High nuclear radiation levels"
      ],
      "correctAnswer": "Intermittent yield dependent on weather and day-night cycles",
      "explanation": "Paragraph 1 describes yields fluctuating drastically based on diurnal cycles and meteorological anomalies.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-renewable-energy-grids-q2",
      "type": "inference",
      "question": "How do intelligent grids stabilize supply during twilight residential peaks?",
      "options": [
        "By disbursing surplus energy previously stored in utility batteries",
        "By shutting down electrical substations throughout the city",
        "By burning coal exclusively at dusk",
        "By disconnecting solar panels permanently"
      ],
      "correctAnswer": "By disbursing surplus energy previously stored in utility batteries",
      "explanation": "Paragraph 2 states they absorb surge generation during midday peaks and disburse power during twilight demand.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-cognitive-behavioral-therapy",
  "title": "Neuroplasticity and Cognitive Behavioral Reframing",
  "subtitle": "Reprogramming maladaptive neural pathways through evidence-based psychotherapy",
  "level": "B2",
  "topic": "Psychology & Health",
  "author": "Dr. Maya Lin",
  "estimatedMinutes": 4,
  "wordCount": 250,
  "coverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-cognitive-behavioral-therapy-p1",
      "order": 1,
      "english": "Historically, conventional psychiatry regarded the adult cerebral architecture as rigid and unalterable. Contemporary neuroimaging, however, conclusively demonstrates neuroplasticity: the brain's lifelong capacity to reorganize synaptic wiring in response to systematic behavioral stimuli.",
      "vietnamese": "Trước đây, tâm thần học cổ điển từng coi cấu trúc não bộ người trưởng thành là cố định và không thể biến đổi. Tuy nhiên, chẩn đoán hình ảnh thần kinh hiện đại đã chứng minh tính dẻo não bộ: khả năng suốt đời của bộ não trong việc tổ chức lại các liên kết synap nhằm đáp ứng các kích thích hành vi có hệ thống."
    },
    {
      "id": "b2-cognitive-behavioral-therapy-p2",
      "order": 2,
      "english": "Cognitive Behavioral Therapy (CBT) leverages this plasticity by training individuals to consciously intercept cognitive distortions such as catastrophizing and black-and-white thinking. Through deliberate cognitive restructuring, patients weaken chronic anxiety circuits and establish robust rational responses.",
      "vietnamese": "Liệu pháp Nhận thức - Hành vi (CBT) tận dụng tính dẻo này bằng cách huấn luyện các cá nhân chủ động ngăn chặn các sai lệch nhận thức như thảm họa hóa hay tư duy đen trắng. Qua việc tái cấu trúc nhận thức có chủ đích, người bệnh làm suy yếu các mạch lo âu mãn tính và hình thành phản ứng duy lý vững vàng."
    }
  ],
  "questions": [
    {
      "id": "b2-cognitive-behavioral-therapy-q1",
      "type": "multiple-choice",
      "question": "What groundbreaking scientific concept superseded the old belief that adult brains are fixed?",
      "options": [
        "Neuroplasticity",
        "Phrenology",
        "Trepanation",
        "Sensory deprivation"
      ],
      "correctAnswer": "Neuroplasticity",
      "explanation": "Paragraph 1 explains that contemporary neuroimaging demonstrates neuroplasticity.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-cognitive-behavioral-therapy-q2",
      "type": "vocabulary-context",
      "question": "In this context, what does 'catastrophizing' mean?",
      "options": [
        "Irrational mental habits anticipating worst-case disasters",
        "Studying geology after volcanic eruptions",
        "Building disaster shelters in mountains",
        "Fixing broken electrical equipment"
      ],
      "correctAnswer": "Irrational mental habits anticipating worst-case disasters",
      "explanation": "Catastrophizing is cited as a cognitive distortion where individuals anticipate extreme negative outcomes.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-urban-vertical-farming",
  "title": "Aeroponics and the Ascent of Vertical Farming",
  "subtitle": "Cultivating pesticide-free crops within urban skyscraper ecosystems",
  "level": "B2",
  "topic": "Agriculture & Science",
  "author": "Marcus Sterling",
  "estimatedMinutes": 4,
  "wordCount": 240,
  "coverImage": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-urban-vertical-farming-p1",
      "order": 1,
      "english": "As arable agricultural acreage declines under climate stress and urban sprawl, controlled-environment agriculture offers a revolutionary spatial solution. By stacking crop cultivation tiers inside decommissioned industrial warehouses, vertical farms achieve staggering land productivity multiples.",
      "vietnamese": "Khi diện tích đất nông nghiệp canh tác suy giảm dưới tác động biến đổi khí hậu và đô thị hóa tràn lan, mô hình nông nghiệp môi trường có kiểm soát đem lại giải pháp không gian mang tính cách mạng. Bằng cách xếp tầng các giàn cây trồng bên trong nhà kho công nghiệp cũ, nông trại thẳng đứng đạt năng suất đất gấp nhiều lần."
    },
    {
      "id": "b2-urban-vertical-farming-p2",
      "order": 2,
      "english": "Advanced facilities implement closed-loop aeroponic misting systems that mist root structures directly with nutrient-infused water droplets. This methodology consumes ninety-five percent less water than conventional soil farming while eliminating synthetic chemical runoff entirely.",
      "vietnamese": "Các cơ sở tiên tiến ứng dụng hệ thống phun khí canh tuần hoàn khép kín, phun sương trực tiếp các giọt nước giàu dinh dưỡng vào cấu trúc rễ. Phương pháp này tiêu thụ ít hơn 95% lượng nước so với canh tác đất truyền thống và loại bỏ hoàn toàn dư lượng hóa chất tổng hợp rửa trôi."
    }
  ],
  "questions": [
    {
      "id": "b2-urban-vertical-farming-q1",
      "type": "multiple-choice",
      "question": "How much less water does aeroponic cultivation utilize compared to conventional farming?",
      "options": [
        "Ninety-five percent less",
        "Ten percent less",
        "The exact same amount",
        "Fifty percent more water"
      ],
      "correctAnswer": "Ninety-five percent less",
      "explanation": "Paragraph 2 states this methodology consumes ninety-five percent less water.",
      "difficulty": "B2",
      "relatedParagraph": 2
    },
    {
      "id": "b2-urban-vertical-farming-q2",
      "type": "main-idea",
      "question": "What is the key advantage of vertical farming discussed in paragraph 1?",
      "options": [
        "Multiplying land yield efficiency through indoor vertical stacking",
        "Replacing all tractors with diesel trucks",
        "Importing tropical fruits from overseas",
        "Growing timber for construction companies"
      ],
      "correctAnswer": "Multiplying land yield efficiency through indoor vertical stacking",
      "explanation": "Paragraph 1 highlights stacking crop tiers inside indoor warehouses to achieve high land productivity.",
      "difficulty": "B2",
      "relatedParagraph": 1
    }
  ]
},
  {
  "id": "b2-circular-economy-textiles",
  "title": "Closing the Loop: Circular Textiles and Synthetic Recycling",
  "subtitle": "Engineering enzyme cascades to break down blended polyester and cotton fabrics",
  "level": "B2",
  "topic": "Environment & Fashion",
  "author": "Chloe Dupond",
  "estimatedMinutes": 4,
  "wordCount": 255,
  "coverImage": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-circular-economy-textiles-p1",
      "order": 1,
      "english": "The global apparel industry churns out approximately one hundred billion garments annually, of which more than eighty percent end up incinerated or entombed in municipal landfills. The primary hurdle in textile recycling stems from ubiquitous poly-cotton fiber blends, which defy mechanical separation.",
      "vietnamese": "Ngành may mặc toàn cầu sản xuất khoảng 100 tỷ sản phẩm dệt may mỗi năm, trong đó hơn 80% kết thúc bằng việc bị thiêu hủy hoặc chôn lấp tại các bãi rác đô thị. Trở ngại hàng đầu trong tái chế dệt may bắt nguồn từ các sợi pha polyester-cotton phổ biến, vốn không thể tách cơ học."
    },
    {
      "id": "b2-circular-economy-textiles-p2",
      "order": 2,
      "english": "Biochemical engineers have engineered specialized bacterial enzymes that selectively depolymerize synthetic polyethylene terephthalate into virgin-quality monomers while leaving natural cellulose intact. This enzymatic cascade enables true fiber-to-fiber recycling without physical quality degradation.",
      "vietnamese": "Các kỹ sư sinh hóa đã chế tạo các enzyme vi khuẩn chuyên biệt có khả năng khử polyme hóa có chọn lọc polyester nhân tạo thành các đơn phân monomer có chất lượng như mới mà vẫn giữ nguyên cellulose tự nhiên. Chuỗi phản ứng enzyme này mở đường cho quy trình tái chế sợi-sang-sợi thực thụ mà không suy giảm chất lượng vật lý."
    }
  ],
  "questions": [
    {
      "id": "b2-circular-economy-textiles-q1",
      "type": "multiple-choice",
      "question": "Why have traditional recycling methods struggled with modern fashion garments?",
      "options": [
        "Mixed poly-cotton fiber blends resist mechanical separation",
        "Garments are too heavy for industrial shredders",
        "Synthetic fabrics dissolve instantly in clean water",
        "No one buys recycled polyester threads"
      ],
      "correctAnswer": "Mixed poly-cotton fiber blends resist mechanical separation",
      "explanation": "Paragraph 1 states the primary hurdle stems from ubiquitous poly-cotton fiber blends which defy mechanical separation.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-circular-economy-textiles-q2",
      "type": "inference",
      "question": "What is the key technological breakthrough enabling circular textile recycling?",
      "options": [
        "Bacterial enzymes that selectively break down synthetic monomers",
        "Burning blended fabrics at extremely high temperatures",
        "Shipping discarded clothing to deep oceanic trenches",
        "Spraying garments with heavy toxic lacquers"
      ],
      "correctAnswer": "Bacterial enzymes that selectively break down synthetic monomers",
      "explanation": "Paragraph 2 highlights engineered bacterial enzymes that selectively depolymerize synthetic materials.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-microbiome-gut-brain-axis",
  "title": "The Gut-Brain Axis: Microbial Influences on Cognition",
  "subtitle": "How enteric bacteria synthesis of neurotransmitters regulates mood and neuroinflammation",
  "level": "B2",
  "topic": "Biology & Health",
  "author": "Dr. Julian Thorne",
  "estimatedMinutes": 4,
  "wordCount": 260,
  "coverImage": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-microbiome-gut-brain-axis-p1",
      "order": 1,
      "english": "The gastrointestinal tract harbors over thirty trillion commensal microbes, constituting a multifaceted metabolic ecosystem. Recent biomedical investigations reveal that this intestinal microbiota interacts bidirectionally with the central nervous system via the vagus nerve and neuroendocrine signaling pathways.",
      "vietnamese": "Đường tiêu hóa chứa hơn ba mươi nghìn tỷ vi sinh vật hội sinh, tạo thành một hệ sinh thái chuyển hóa đa diện. Các nghiên cứu y sinh gần đây tiết lộ rằng hệ vi sinh đường ruột này tương tác hai chiều với hệ thần kinh trung ương thông qua dây thần kinh phế vị và các đường truyền tín hiệu thần kinh thể dịch."
    },
    {
      "id": "b2-microbiome-gut-brain-axis-p2",
      "order": 2,
      "english": "Remarkably, gut microbes produce over ninety percent of peripheral serotonin and substantial amounts of gamma-aminobutyric acid (GABA). Dysbiosis—an imbalance in gut microbial ecology—is now directly implicated in systemic neuroinflammation and depressive affective states.",
      "vietnamese": "Đáng chú ý, các vi sinh vật đường ruột sản xuất hơn 90% serotonin ngoại vi và lượng lớn axit gamma-aminobutyric (GABA). Tình trạng loạn khuẩn—sự mất cân bằng hệ sinh thái vi sinh vật đường ruột—hiện nay được liên hệ trực tiếp đến chứng viêm thần kinh toàn thân và các trạng thái trầm cảm u uất."
    }
  ],
  "questions": [
    {
      "id": "b2-microbiome-gut-brain-axis-q1",
      "type": "multiple-choice",
      "question": "Which major conduit mediates bidirectional communication between the gut microbiota and the central nervous system?",
      "options": [
        "The vagus nerve and neuroendocrine pathways",
        "The femoral artery exclusively",
        "The cochlear optic canal",
        "Lymphatic thoracic ducts alone"
      ],
      "correctAnswer": "The vagus nerve and neuroendocrine pathways",
      "explanation": "Paragraph 1 identifies the vagus nerve and neuroendocrine signaling pathways as the bidirectional communication route.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-microbiome-gut-brain-axis-q2",
      "type": "vocabulary-context",
      "question": "What does the term 'dysbiosis' describe in medical microbiology?",
      "options": [
        "An unhealthy imbalance in microbial ecology",
        "A sudden acceleration in bone mineral growth",
        "A rapid increase in red blood cell count",
        "The complete absence of water in tissues"
      ],
      "correctAnswer": "An unhealthy imbalance in microbial ecology",
      "explanation": "Paragraph 2 defines dysbiosis as an imbalance in gut microbial ecology.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-fintech-financial-inclusion",
  "title": "Mobile FinTech and Global Financial Democratization",
  "subtitle": "Bypassing brick-and-mortar banking infrastructure with algorithmic micro-lending",
  "level": "B2",
  "topic": "Finance & Economics",
  "author": "Amina Al-Mansoor",
  "estimatedMinutes": 4,
  "wordCount": 250,
  "coverImage": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-fintech-financial-inclusion-p1",
      "order": 1,
      "english": "Over one billion adults worldwide lack access to formal banking institutions, historically excluding them from capital loans, insured savings, and commercial credit history. Traditional retail banks avoided rural and impoverished enclaves due to prohibitive branch maintenance expenditures.",
      "vietnamese": "Hơn một tỷ người trưởng thành trên toàn cầu thiếu quyền tiếp cận các tổ chức ngân hàng chính thức, khiến họ trong lịch sử bị loại khỏi các khoản vay vốn, tiết kiệm có bảo hiểm và hồ sơ tín dụng thương mại. Các ngân hàng bán lẻ truyền thống thường né tránh các vùng nông thôn nghèo do chi phí vận hành chi nhánh quá cao."
    },
    {
      "id": "b2-fintech-financial-inclusion-p2",
      "order": 2,
      "english": "Mobile money protocols and algorithmic credit-scoring platforms have disrupted this status quo. By analyzing cellular telecommunication data and utility payment histories, FinTech apps extend micro-capital to informal entrepreneurs, fueling grassroots microeconomic development.",
      "vietnamese": "Các giao thức tiền tệ di động và nền tảng chấm điểm tín dụng thuật toán đã phá vỡ thế độc quyền này. Bằng cách phân tích dữ liệu viễn thông di động và lịch sử thanh toán tiền điện nước, các ứng dụng FinTech cấp nguồn vốn siêu nhỏ cho các tiểu thương phi chính thức, thúc đẩy phát triển kinh tế cơ sở."
    }
  ],
  "questions": [
    {
      "id": "b2-fintech-financial-inclusion-q1",
      "type": "multiple-choice",
      "question": "Why did legacy commercial banks historically shun remote rural populations?",
      "options": [
        "Prohibitive expenditures required to build and staff physical branches",
        "Lack of interest in earning interest on loans",
        "Strict national bans prohibiting financial services outside cities",
        "Cellular networks were already owned by central banks"
      ],
      "correctAnswer": "Prohibitive expenditures required to build and staff physical branches",
      "explanation": "Paragraph 1 notes retail banks avoided rural enclaves due to prohibitive branch maintenance expenditures.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-fintech-financial-inclusion-q2",
      "type": "inference",
      "question": "How do FinTech applications assess creditworthiness without formal tax returns?",
      "options": [
        "By evaluating cellular phone usage records and utility bill payments",
        "By requiring customers to deposit physical gold coins",
        "By interviewing immediate neighbors in person",
        "By selecting borrowers purely at random"
      ],
      "correctAnswer": "By evaluating cellular phone usage records and utility bill payments",
      "explanation": "Paragraph 2 states they analyze cellular telecommunication data and utility payment histories.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-hyperloop-high-speed-transit",
  "title": "Pneumatic Evacuated Tubes: The Physics of Near-Vacuum Transit",
  "subtitle": "Eliminating air resistance and friction to achieve near-sonic surface travel",
  "level": "B2",
  "topic": "Engineering & Transport",
  "author": "Dieter Weiss",
  "estimatedMinutes": 4,
  "wordCount": 250,
  "coverImage": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-hyperloop-high-speed-transit-p1",
      "order": 1,
      "english": "Conventional high-speed railway networks confront an inescapable thermodynamic ceiling: aerodynamic drag increases proportionally with the cube of velocity. As trains exceed three hundred kilometers per hour, electricity consumption escalates exponentially to pierce atmospheric pressure.",
      "vietnamese": "Các mạng lưới đường sắt cao tốc truyền thống đối mặt với một giới hạn nhiệt động lực học không thể tránh khỏi: lực cản khí động học tăng theo tỷ lệ bậc ba của vận tốc. Khi tàu hỏa vượt quá 300 km/h, lượng điện tiêu thụ tăng vọt theo cấp số nhân nhằm xuyên thủng áp suất khí quyển."
    },
    {
      "id": "b2-hyperloop-high-speed-transit-p2",
      "order": 2,
      "english": "Vactrain and hyperloop architectures bypass this barrier by encapsulating maglev passenger capsules inside depressurized steel conduits maintained at near-vacuum states. Without friction or atmospheric resistance, capsules can theoretically coast at transonic velocities exceeding one thousand kilometers per hour with minimal continuous propulsion.",
      "vietnamese": "Các mô hình tàu chân không và hyperloop vượt qua rào cản này bằng cách đóng kín các toa xe đệm từ chở khách bên trong các đường ống thép giảm áp được duy trì ở trạng thái gần chân không. Khi không còn ma sát hay lực cản khí quyển, các toa tàu về mặt lý thuyết có thể lướt ở vận tốc cận âm vượt quá 1000 km/h với lực đẩy liên tục tối thiểu."
    }
  ],
  "questions": [
    {
      "id": "b2-hyperloop-high-speed-transit-q1",
      "type": "multiple-choice",
      "question": "What aerodynamic phenomenon severely limits conventional high-speed train velocities?",
      "options": [
        "Aerodynamic drag escalating with the cube of velocity",
        "Excessive engine oil freezing in warm weather",
        "Failure of steel rails to conduct electricity",
        "Atmospheric oxygen catching fire at high speeds"
      ],
      "correctAnswer": "Aerodynamic drag escalating with the cube of velocity",
      "explanation": "Paragraph 1 states that aerodynamic drag increases proportionally with the cube of velocity.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-hyperloop-high-speed-transit-q2",
      "type": "inference",
      "question": "Why can hyperloop capsules travel at near-sonic speeds with minimal energy?",
      "options": [
        "The near-vacuum environment eliminates air resistance and maglev eliminates mechanical friction",
        "They burn jet fuel inside open passenger cars",
        "They utilize nuclear fission reactors inside each cabin",
        "They are propelled by giant downward gravitational catapults"
      ],
      "correctAnswer": "The near-vacuum environment eliminates air resistance and maglev eliminates mechanical friction",
      "explanation": "Paragraph 2 explains that near-vacuum conditions and magnetic levitation eliminate friction and atmospheric resistance.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-deep-sea-mining-ethics",
  "title": "Abyssal Extraction: The Ecological Dilemma of Seabed Mining",
  "subtitle": "Weighing clean-tech battery mineral demands against fragile benthic biodiversity",
  "level": "B2",
  "topic": "Environment & Policy",
  "author": "Dr. Sarah O'Connor",
  "estimatedMinutes": 4,
  "wordCount": 260,
  "coverImage": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-deep-sea-mining-ethics-p1",
      "order": 1,
      "english": "The global energy transition hinges on unprecedented quantities of cobalt, nickel, and rare earth elements for electric vehicle traction batteries. Because terrestrial mineral reserves are fraught with geopolitical vulnerability and severe human rights violations, mining consortia are looking downward to the abyssal Clarion-Clipperton Zone.",
      "vietnamese": "Quá trình chuyển dịch năng lượng toàn cầu phụ thuộc vào khối lượng chưa từng có coban, niken và các nguyên tố đất hiếm cho pin xe điện. Vì các trữ lượng khoáng sản trên cạn luôn đối mặt với tính bấp bênh địa chính trị và vi phạm nhân quyền nghiêm trọng, các tập đoàn khai khoáng đang hướng xuống vùng biển sâu Clarion-Clipperton."
    },
    {
      "id": "b2-deep-sea-mining-ethics-p2",
      "order": 2,
      "english": "Resting four thousand meters beneath sea level, polymetallic nodules take millions of years to precipitate around microscopic bone fragments. Marine biologists warn that dragging heavy dredging tractors across the seafloor will pulverize endemic glass sponge habitats and generate suspended sediment plumes that disrupt pelagic food webs across oceans.",
      "vietnamese": "Nằm ở độ sâu 4.000 mét dưới mực nước biển, các kết hạch đa kim mất hàng triệu năm để kết tủa quanh các mảnh vụn xương hiển vi. Các nhà sinh vật biển cảnh báo rằng việc kéo các máy hút nạo vét nặng nề qua đáy biển sẽ nghiền nát môi trường sống của loài bọt biển thủy tinh đặc hữu và tạo ra các đám mây trầm tích lơ lửng làm gián đoạn chuỗi thức ăn đại dương trên quy mô toàn cầu."
    }
  ],
  "questions": [
    {
      "id": "b2-deep-sea-mining-ethics-q1",
      "type": "multiple-choice",
      "question": "What primary economic motivation drives corporations to explore abyssal seabed mining?",
      "options": [
        "Securing cobalt and nickel essential for electric vehicle batteries",
        "Hunting for sunken Spanish gold treasure fleets",
        "Extracting fresh drinking water for coastal desert cities",
        "Discovering oil deposits for steam locomotives"
      ],
      "correctAnswer": "Securing cobalt and nickel essential for electric vehicle batteries",
      "explanation": "Paragraph 1 explains demand hinges on unprecedented quantities of cobalt and nickel for EV batteries.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-deep-sea-mining-ethics-q2",
      "type": "multiple-choice",
      "question": "What severe environmental consequence do marine biologists fear most from benthic dredging?",
      "options": [
        "Destruction of endemic benthic fauna and extensive sediment plumes",
        "Boiling of equatorial surface ocean water",
        "Depletion of atmospheric carbon dioxide",
        "Sudden freezing of global sea currents"
      ],
      "correctAnswer": "Destruction of endemic benthic fauna and extensive sediment plumes",
      "explanation": "Paragraph 2 warns dredging tractors will pulverize glass sponge habitats and generate sediment plumes.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "b2-augmented-reality-surgery",
  "title": "Holographic Precision: Augmented Reality in Modern Neurosurgery",
  "subtitle": "Superimposing intraoperative 3D vascular reconstructions over surgical microscopes",
  "level": "B2",
  "topic": "Medicine & Technology",
  "author": "Dr. Kenji Sato",
  "estimatedMinutes": 4,
  "wordCount": 265,
  "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "b2-augmented-reality-surgery-p1",
      "order": 1,
      "english": "Intracranial neurosurgery requires sub-millimeter anatomical accuracy; misjudging the trajectory of an arterial aneurysm clip by a single millimeter can result in catastrophic ischemia or irreversible motor paralysis. Traditionally, neurosurgeons toggled their gaze back and forth between two-dimensional MRI scans and surgical cavities.",
      "vietnamese": "Phẫu thuật thần kinh trong sọ đòi hỏi độ chính xác giải phẫu đến từng phần mười milimet; phán đoán sai quỹ đạo của kẹp túi phình động mạch dù chỉ một milimet cũng có thể gây thiếu máu cục bộ nghiêm trọng hoặc liệt vận động vĩnh viễn. Theo cách truyền thống, các phẫu thuật viên phải liên tục đảo mắt qua lại giữa phim MRI 2D và hốc mổ."
    },
    {
      "id": "b2-augmented-reality-surgery-p2",
      "order": 2,
      "english": "Modern operating suites integrate augmented reality headsets that render real-time, holographic 3D vascular reconstructions directly onto the surgeon's retinas. By fusing pre-operative volumetric angiography with optical tracking, surgeons navigate complex cerebral parenchyma with radiographic transparency, substantially mitigating iatrogenic morbidity.",
      "vietnamese": "Các phòng mổ hiện đại ngày nay tích hợp kính thực tế tăng cường AR chiếu hình ảnh tái tạo mạch máu 3D ba chiều thời gian thực trực tiếp lên võng mạc của phẫu thuật viên. Bằng cách hợp nhất hình ảnh chụp mạch thể tích trước mổ với công nghệ theo dõi quang học, bác sĩ điều hướng qua mô não phức tạp với độ trong suốt như chụp X-quang, giảm thiểu đáng kể tai biến do phẫu thuật."
    }
  ],
  "questions": [
    {
      "id": "b2-augmented-reality-surgery-q1",
      "type": "multiple-choice",
      "question": "What major inconvenience characterized traditional neurosurgical operations?",
      "options": [
        "Constantly shifting vision between 2D monitor scans and the microscopic surgical field",
        "Operating without sterile surgical gowns or gloves",
        "Performing surgery entirely without anesthesia",
        "Inability to turn on lighting inside the operating theatre"
      ],
      "correctAnswer": "Constantly shifting vision between 2D monitor scans and the microscopic surgical field",
      "explanation": "Paragraph 1 mentions neurosurgeons toggled their gaze back and forth between 2D MRI scans and surgical cavities.",
      "difficulty": "B2",
      "relatedParagraph": 1
    },
    {
      "id": "b2-augmented-reality-surgery-q2",
      "type": "inference",
      "question": "How does AR headset technology improve patient outcomes during complex neurosurgery?",
      "options": [
        "It overlays real-time 3D vascular maps directly onto the tissue to guide precision incisions",
        "It replaces the neurosurgeon with an automated robotic arm entirely",
        "It reduces surgery duration to under two minutes",
        "It eliminates the need to sterilize hospital tools"
      ],
      "correctAnswer": "It overlays real-time 3D vascular maps directly onto the tissue to guide precision incisions",
      "explanation": "Paragraph 2 explains it renders real-time holographic 3D vascular reconstructions directly onto retinas to guide navigation.",
      "difficulty": "B2",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-quantum-cryptography-post-rsa",
  "title": "Post-Quantum Cryptography and the Lattice-Based Paradigm",
  "subtitle": "Safeguarding sovereign communication infrastructures against Shor's algorithmic decimation",
  "level": "C1",
  "topic": "Computer Science & Cryptography",
  "author": "Dr. Evelyn Montgomery",
  "estimatedMinutes": 5,
  "wordCount": 310,
  "coverImage": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-quantum-cryptography-post-rsa-p1",
      "order": 1,
      "english": "The foundational security architecture of global telecommunications rests upon asymmetric public-key cryptosystems, notably RSA and elliptic-curve cryptography. The mathematical intractability of these ciphers depends on the computational hardness of integer factorization and discrete logarithms on classical Von Neumann processors.",
      "vietnamese": "Kiến trúc an ninh nền tảng của viễn thông toàn cầu dựa trên các hệ mật mã khóa công khai bất đối xứng, tiêu biểu là RSA và mật mã đường cong elliptic. Tính bất khả kháng toán học của các thuật mã này phụ thuộc vào độ phức tạp tính toán của phép phân tích thừa số nguyên và logarit rời rạc trên các bộ xử lý Von Neumann cổ điển."
    },
    {
      "id": "c1-quantum-cryptography-post-rsa-p2",
      "order": 2,
      "english": "However, the realization of fault-tolerant quantum computers utilizing Shor's quantum algorithm will render these mathematical primitives obsolete within polynomial time. Cryptographic agencies are consequently orchestrating a systemic migration toward post-quantum standards, prominently lattice-based schemes like CRYSTALS-Kyber, whose shortest vector problems are believed to remain intractable even for quantum superpositions.",
      "vietnamese": "Tuy nhiên, sự hiện thực hóa của các máy tính lượng tử có khả năng chịu lỗi vận dụng thuật toán Shor sẽ biến các tiên đề toán học này thành lỗi thời trong thời gian đa thức. Các cơ quan mật mã học do đó đang tổ chức một cuộc chuyển đổi mang tính hệ thống sang các chuẩn hậu lượng tử, nổi bật là các phương án dựa trên mạng tinh thể (lattice) như CRYSTALS-Kyber, mà bài toán vectơ ngắn nhất của chúng được tin là vẫn bất khả giải ngay cả trước các trạng thái chồng chập lượng tử."
    }
  ],
  "questions": [
    {
      "id": "c1-quantum-cryptography-post-rsa-q1",
      "type": "multiple-choice",
      "question": "What mathematical vulnerability enables quantum computers to demolish traditional RSA encryption?",
      "options": [
        "Shor's algorithm can solve prime integer factorization in polynomial time",
        "Quantum computers have unlimited hard drive disk storage capacity",
        "Lattice structures dissolve when exposed to high temperatures",
        "Elliptic curves cannot be drawn on digital displays"
      ],
      "correctAnswer": "Shor's algorithm can solve prime integer factorization in polynomial time",
      "explanation": "Paragraph 2 notes that Shor's algorithm renders integer factorization primitives obsolete within polynomial time.",
      "difficulty": "C1",
      "relatedParagraph": 2
    },
    {
      "id": "c1-quantum-cryptography-post-rsa-q2",
      "type": "inference",
      "question": "Why are lattice-based cryptographic algorithms considered resilient against quantum adversaries?",
      "options": [
        "Their shortest vector mathematical problems resist quantum algorithmic speedup",
        "They do not use mathematical calculations of any kind",
        "They operate strictly on analog copper telephone lines",
        "They require quantum computers to be turned off completely"
      ],
      "correctAnswer": "Their shortest vector mathematical problems resist quantum algorithmic speedup",
      "explanation": "Paragraph 2 highlights that shortest vector problems in lattice schemes remain intractable for quantum superpositions.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-crispr-gene-drive-bioethics",
  "title": "CRISPR Gene Drives and Irreversible Ecological Editing",
  "subtitle": "Assessing the biocentric ethics of driving vector species to extinction",
  "level": "C1",
  "topic": "Bioethics & Genetics",
  "author": "Prof. Jean-Luc Moreau",
  "estimatedMinutes": 5,
  "wordCount": 320,
  "coverImage": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-crispr-gene-drive-bioethics-p1",
      "order": 1,
      "english": "Synthetic gene drives engineered through CRISPR-Cas endonuclease cassettes circumvent classical Mendelian inheritance, perpetuating engineered genetic mutations to nearly one hundred percent of offspring. When applied to hematophagous vector populations like Anopheles gambiae, this mutagenic mechanism can intentionally propagate population collapse, effectively eradicating malaria transmissions.",
      "vietnamese": "Các ổ dẫn gen tổng hợp được thiết kế thông qua các đoạn nuclease CRISPR-Cas đã phá vỡ quy luật di truyền Men-đen cổ điển, truyền các đột biến di truyền nhân tạo cho gần 100% thế hệ con cái. Khi được áp dụng cho các quần thể muỗi hút máu truyền bệnh như Anopheles gambiae, cơ chế gây đột biến này có thể chủ động gây suy giảm quần thể, tiến tới xóa sổ sự lây truyền bệnh sốt rét."
    },
    {
      "id": "c1-crispr-gene-drive-bioethics-p2",
      "order": 2,
      "english": "Nevertheless, releasing self-propagating genetic alterations into uncontained wilderness environments introduces unprecedented ontological hazards. Ecological bioethicists underscore that purging a native taxon may destabilize trophic cascades, spur unforeseen niche occupancy by alternative pathogen vectors, and permanently infringe upon the evolutionary autonomy of wild biospheres.",
      "vietnamese": "Tuy nhiên, việc thả các biến đổi di truyền tự nhân bản vào môi trường tự nhiên mở đưa lại những hiểm họa bản thể học chưa từng có tiền lệ. Các nhà đạo đức sinh thái nhấn mạnh rằng việc xóa sổ một đơn vị phân loại bản địa có thể làm mất ổn định các mắt xích dinh dưỡng, tạo điều kiện cho các vector mang mầm bệnh khác chiếm lĩnh hốc sinh thái, và xâm phạm vĩnh viễn quyền tự chủ tiến hóa của sinh quyển hoang dã."
    }
  ],
  "questions": [
    {
      "id": "c1-crispr-gene-drive-bioethics-q1",
      "type": "multiple-choice",
      "question": "How do CRISPR synthetic gene drives deviate from standard Mendelian genetics?",
      "options": [
        "They pass target traits to nearly 100% of offspring instead of classical 50% ratios",
        "They only alter phenotype colors without changing DNA strands",
        "They require nuclear radiation to pass to subsequent generations",
        "They can only be passed from paternal grandparents"
      ],
      "correctAnswer": "They pass target traits to nearly 100% of offspring instead of classical 50% ratios",
      "explanation": "Paragraph 1 states gene drives circumvent Mendelian inheritance, perpetuating mutations to nearly 100% of offspring.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-crispr-gene-drive-bioethics-q2",
      "type": "main-idea",
      "question": "What is the primary bioethical peril of deploying irreversible gene drives in nature?",
      "options": [
        "Unpredictable trophic collapse and evolutionary disruption across open ecosystems",
        "The high financial cost of manufacturing glass pipettes",
        "The difficulty of breeding mosquitoes in clean laboratories",
        "The risk of mosquitoes acquiring human language capabilities"
      ],
      "correctAnswer": "Unpredictable trophic collapse and evolutionary disruption across open ecosystems",
      "explanation": "Paragraph 2 emphasizes destabilized trophic cascades, niche occupancy by alternative vectors, and loss of evolutionary autonomy.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-algorithmic-governance-democracy",
  "title": "Algorithmic Governance and the Erosion of Epistemic Common Ground",
  "subtitle": "How hyper-personalized engagement loops polarize deliberation in civil society",
  "level": "C1",
  "topic": "Philosophy & Political Science",
  "author": "Dr. Tarik Sen",
  "estimatedMinutes": 5,
  "wordCount": 315,
  "coverImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-algorithmic-governance-democracy-p1",
      "order": 1,
      "english": "Deliberative democratic legitimacy presumes a shared epistemic commons—a verifiable substratum of factual reality from which divergent political constituencies can negotiate consensus. The hegemony of engagement-maximizing recommendation systems has irrevocably fragmented this consensus by prioritizing affective outrage over factual veracity.",
      "vietnamese": "Tính chính danh của nền dân chủ thảo luận tiền giả định một không gian nhận thức chung—một tầng thực tại xác minh được làm điểm tựa để các cộng đồng chính trị khác nhau có thể thương lượng sự đồng thuận. Sự thống trị của các hệ thống khuyến nghị tối đa hóa tương tác đã làm phân mảnh không thể cứu vãn sự đồng thuận này bằng cách ưu tiên sự phẫn nộ cảm tính hơn tính chân thực của dữ kiện."
    },
    {
      "id": "c1-algorithmic-governance-democracy-p2",
      "order": 2,
      "english": "By algorithmically sealing individuals inside self-reinforcing confirmation bubbles, platforms incentivize epistemic closure. Political opponents are no longer perceived as fellow interlocutors holding different priorities, but rather as ontologically malignant adversaries, degrading democratic statecraft into zero-sum tribal warfare.",
      "vietnamese": "Bằng cách cô lập các cá nhân về mặt thuật toán bên trong những 'bong bóng' thiên kiến tự củng cố, các nền tảng thúc đẩy sự khép kín nhận thức. Những người bất đồng chính kiến không còn được coi là những người đối thoại cùng chí hướng với các ưu tiên khác nhau, mà biến thành những kẻ thù ác ý về mặt bản thể học, khiến nghệ thuật lãnh đạo dân chủ thoái hóa thành cuộc chiến bộ lạc mang tính triệt tiêu."
    }
  ],
  "questions": [
    {
      "id": "c1-algorithmic-governance-democracy-q1",
      "type": "multiple-choice",
      "question": "What fundamental prerequisite of deliberative democracy is eroded by recommendation feeds?",
      "options": [
        "A shared epistemic commons of agreed-upon factual reality",
        "The capability to print newspapers on paper",
        "The existence of televised political debates",
        "The requirement of physical polling booths"
      ],
      "correctAnswer": "A shared epistemic commons of agreed-upon factual reality",
      "explanation": "Paragraph 1 notes that deliberative democracy presumes a shared epistemic commons, which engagement algorithms fragment.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-algorithmic-governance-democracy-q2",
      "type": "vocabulary-context",
      "question": "What does the author imply by 'epistemic closure'?",
      "options": [
        "A state where closed minds reject all exterior verifiable evidence",
        "The closing of public libraries on weekends",
        "The graduation ceremony of university students",
        "A computer network undergoing a firewall shutdown"
      ],
      "correctAnswer": "A state where closed minds reject all exterior verifiable evidence",
      "explanation": "Epistemic closure describes individuals sealed inside echo chambers who treat conflicting perspectives as hostile.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-astrobiology-europa-biosignatures",
  "title": "Cryovolcanism and Chemosynthetic Biosignatures on Europa",
  "subtitle": "Hydrothermal vent plumes and subglacial habitability in Jovian outer-moon oceans",
  "level": "C1",
  "topic": "Astrophysics & Astrobiology",
  "author": "Dr. Cassandra Vance",
  "estimatedMinutes": 5,
  "wordCount": 330,
  "coverImage": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-astrobiology-europa-biosignatures-p1",
      "order": 1,
      "english": "Planetary scientists examining Jupiter's icy moon Europa have long recognized that tidal flexing driven by Jovian gravitational resonance sustains a liquid ocean beneath its twenty-kilometer ice shell. Containing more liquid brine than all of Earth's oceans combined, Europa's seafloor likely interfaces directly with a silicate mantle rich in serpentinizing hydrothermal vents.",
      "vietnamese": "Các nhà khoa học hành tinh nghiên cứu mặt trăng băng Europa của sao Mộc từ lâu đã nhận ra rằng lực uốn thủy triều do cộng hưởng hấp dẫn từ sao Mộc duy trì một đại dương lỏng dưới lớp vỏ băng dày 20 km. Chứa lượng nước mặn lỏng nhiều hơn tất cả các đại dương trên Trái đất cộng lại, đáy biển của Europa có thể tiếp xúc trực tiếp với lớp manti silicat giàu các miệng phun thủy nhiệt serpentin hóa."
    },
    {
      "id": "c1-astrobiology-europa-biosignatures-p2",
      "order": 2,
      "english": "Without sunlight for photosynthesis, any putative extraterrestrial biosphere must rely exclusively on chemosynthesis driven by abiotic radiolytic oxidants and hydrothermal electron donors like molecular hydrogen and methane. Detecting chiral amino acid enantiomer excesses within ejected cryovolcanic plumes would constitute smoking-gun evidence of extraterrestrial biochemical activity.",
      "vietnamese": "Không có ánh sáng mặt trời cho quang hợp, bất kỳ sinh quyển ngoài Trái đất giả định nào cũng phải phụ thuộc hoàn toàn vào hóa tổng hợp nhờ các chất oxy hóa phân rã phóng xạ phi sinh học và các chất cho electron thủy nhiệt như hydro phân tử và metan. Việc phát hiện sự vượt trội của các đối phân axit amin bất đối xứng bên trong các luồng phun núi lửa băng được phóng ra sẽ cấu thành bằng chứng đanh thép về hoạt động hóa sinh ngoài hành tinh."
    }
  ],
  "questions": [
    {
      "id": "c1-astrobiology-europa-biosignatures-q1",
      "type": "multiple-choice",
      "question": "What primary geophysical mechanism maintains Europa's vast subsurface liquid ocean?",
      "options": [
        "Tidal flexing driven by Jovian gravitational resonance",
        "Extreme solar radiation warming the outer crust",
        "Active volcanic burning of petroleum fuels",
        "Artificial heaters deployed by space probes"
      ],
      "correctAnswer": "Tidal flexing driven by Jovian gravitational resonance",
      "explanation": "Paragraph 1 explains tidal flexing driven by Jovian gravitational resonance sustains a liquid ocean.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-astrobiology-europa-biosignatures-q2",
      "type": "inference",
      "question": "Why would an excess of chiral amino acid enantiomers in ice plumes indicate alien life?",
      "options": [
        "Biochemical organisms selectively produce single-handed chiral molecules unlike abiotic synthesis",
        "Non-living rocks always produce perfect mirror symmetries in space",
        "Plumes only erupt when ignited by organic metabolic heat",
        "Chirality is a property exclusively found in liquid water"
      ],
      "correctAnswer": "Biochemical organisms selectively produce single-handed chiral molecules unlike abiotic synthesis",
      "explanation": "Chiral amino acid enantiomer excesses indicate biological selectivity over random racemic abiotic chemical mixtures.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-cognitive-linguistics-embodiment",
  "title": "Embodied Cognition and the Spatialization of Metaphor",
  "subtitle": "How sensorimotor physical interactions govern abstract human conceptualization",
  "level": "C1",
  "topic": "Cognitive Linguistics",
  "author": "Prof. Arthur Pendelton",
  "estimatedMinutes": 5,
  "wordCount": 320,
  "coverImage": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-cognitive-linguistics-embodiment-p1",
      "order": 1,
      "english": "Cartesian rationalism posited a dualistic paradigm wherein cognitive intellect operated in a disembodied, symbolic realm detached from corporeal biology. Conversely, pioneering cognitive linguists demonstrated that human conceptual reasoning is fundamentally grounded in embodied sensorimotor schemata derived from physical locomotion and environmental orientation.",
      "vietnamese": "Thuyết duy lý Descartes từng đưa ra mô hình nhị nguyên trong đó trí tuệ hoạt động trong một địa hạt biểu tượng phi thể xác, tách rời khỏi sinh học thể chất. Ngược lại, các nhà ngôn ngữ học nhận thức tiên phong đã chứng minh rằng tư duy khái niệm của con người về bản chất được bắt rễ từ các lược đồ cảm giác-vận động thể nhập, bắt nguồn từ sự vận động thể chất và định hướng môi trường."
    },
    {
      "id": "c1-cognitive-linguistics-embodiment-p2",
      "order": 2,
      "english": "Abstract domains such as temporality, morality, and social hierarchy are systematically conceptualized through primary orientational metaphors: time is experienced as a forward spatial trajectory, virtue as vertical height, and social influence as physical weight. Consequently, abstract semantics are not arbitrary syntax, but biological projections of bodily experience.",
      "vietnamese": "Các miền trừu tượng như thời gian, đạo đức và thứ bậc xã hội được khái niệm hóa một cách có hệ thống thông qua các ẩn dụ định hướng nguyên cấp: thời gian được trải nghiệm như quỹ đạo không gian phía trước, phẩm hạnh như chiều cao thẳng đứng, và sức ảnh hưởng xã hội như trọng lượng vật lý. Do đó, ngữ nghĩa trừu tượng không phải là cú pháp ngẫu nhiên, mà là sự phản chiếu sinh học của trải nghiệm thể xác."
    }
  ],
  "questions": [
    {
      "id": "c1-cognitive-linguistics-embodiment-q1",
      "type": "multiple-choice",
      "question": "Which intellectual doctrine did embodied cognition fundamentally challenge?",
      "options": [
        "Cartesian mind-body dualism",
        "Darwinian natural selection",
        "Einsteinian relativistic physics",
        "Freudian psychoanalysis"
      ],
      "correctAnswer": "Cartesian mind-body dualism",
      "explanation": "Paragraph 1 contrasts embodied cognition with Cartesian rationalism's disembodied, symbolic realm.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-cognitive-linguistics-embodiment-q2",
      "type": "inference",
      "question": "According to conceptual metaphor theory, why do humans visualize time moving 'forward'?",
      "options": [
        "Because bipedal forward locomotion forms the baseline experiential schema for progress",
        "Because clocks always rotate in a clockwise direction",
        "Because the Earth rotates toward the sun on its axis",
        "Because writing systems in all cultures move strictly left to right"
      ],
      "correctAnswer": "Because bipedal forward locomotion forms the baseline experiential schema for progress",
      "explanation": "Paragraph 2 explains abstract semantics are biological projections of physical bodily experience and locomotion.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-macroeconomic-degrowth-paradigm",
  "title": "Steady-State Economics and the Degrowth Imperative",
  "subtitle": "Decoupling societal flourishing from infinite compound GDP expansion",
  "level": "C1",
  "topic": "Macroeconomics",
  "author": "Dr. Beatrice Dubois",
  "estimatedMinutes": 5,
  "wordCount": 315,
  "coverImage": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-macroeconomic-degrowth-paradigm-p1",
      "order": 1,
      "english": "Neoclassical macroeconomics treats continuous gross domestic product growth as an inviolable proxy for human societal welfare. Yet compounding geometric growth on a thermodynamically closed biosphere inevitably transgresses planetary boundaries, driving acute biodiversity collapse and biogeochemical destabilization.",
      "vietnamese": "Kinh tế học vĩ mô tân cổ điển coi sự tăng trưởng tổng sản phẩm quốc nội liên tục là thước đo bất khả xâm phạm cho phúc lợi xã hội của loài người. Tuy nhiên, sự tăng trưởng hình học lũy tiến trên một sinh quyển đóng kín về mặt nhiệt động lực học chắc chắn sẽ vượt qua các ranh giới hành tinh, dẫn đến sự sụp đổ nghiêm trọng về đa dạng sinh học và mất ổn định chu trình sinh địa hóa."
    },
    {
      "id": "c1-macroeconomic-degrowth-paradigm-p2",
      "order": 2,
      "english": "The degrowth paradigm calls for an equitable, planned downscaling of energy and throughput in over-consuming nations. Rather than equating degrowth with recessionary austerity, proponents advocate universal public services, work-time reduction, and steady-state resource budgets that prioritize genuine human longevity and ecological homeostasis.",
      "vietnamese": "Mô hình phi tăng trưởng (degrowth) kêu gọi sự thu hẹp có kế hoạch và công bằng đối với năng lượng và lưu lượng vật chất ở các quốc gia tiêu thụ quá mức. Thay vì đánh đồng phi tăng trưởng với sự thắt lưng buộc bụng trong suy thoái, những người ủng hộ chủ trương phổ cập dịch vụ công, cắt giảm giờ làm và thiết lập ngân sách tài nguyên trạng thái tĩnh nhằm ưu tiên tuổi thọ con người đích thực cùng sự cân bằng sinh thái."
    }
  ],
  "questions": [
    {
      "id": "c1-macroeconomic-degrowth-paradigm-q1",
      "type": "multiple-choice",
      "question": "What fatal thermodynamic flaw does degrowth identify in perpetual GDP expansion?",
      "options": [
        "Infinite compound expansion cannot continue within a physically finite planetary biosphere",
        "Economic growth creates too much paper currency that weighs down bank vaults",
        "Workers eventually lose interest in spending their wages on leisure",
        "Machines will stop manufacturing goods when temperatures drop"
      ],
      "correctAnswer": "Infinite compound expansion cannot continue within a physically finite planetary biosphere",
      "explanation": "Paragraph 1 notes compounding geometric growth on a thermodynamically closed biosphere inevitably transgresses planetary boundaries.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-macroeconomic-degrowth-paradigm-q2",
      "type": "vocabulary-context",
      "question": "How do degrowth advocates distinguish their proposals from involuntary economic recessions?",
      "options": [
        "Degrowth is a planned, equitable realignment providing universal services, not chaotic austerity",
        "Recessions only occur during wartime while degrowth occurs in peace",
        "Degrowth completely abolishes money and banking systems immediately",
        "Recessions increase carbon emissions while degrowth burns coal"
      ],
      "correctAnswer": "Degrowth is a planned, equitable realignment providing universal services, not chaotic austerity",
      "explanation": "Paragraph 2 emphasizes degrowth is a planned downscaling that provides universal services and work-time reduction rather than recessionary austerity.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-geoengineering-solar-radiation",
  "title": "Stratospheric Aerosol Injection: The Geoengineering Paradox",
  "subtitle": "Evaluating solar radiation management risks, monsoon disruption, and termination shock",
  "level": "C1",
  "topic": "Climate Science & Governance",
  "author": "Dr. Nathaniel Thorne",
  "estimatedMinutes": 5,
  "wordCount": 325,
  "coverImage": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-geoengineering-solar-radiation-p1",
      "order": 1,
      "english": "As anthropogenic greenhouse emissions continue to breach critical temperature tipping points, solar radiation management (SRM) has shifted from theoretical fringe to urgent geopolitical debate. Stratospheric aerosol injection simulates the cooling dynamics of massive plinian volcanic eruptions by dispersing sulfur dioxide into the upper atmosphere to deflect incident solar irradiance.",
      "vietnamese": "Khi lượng phát thải khí nhà kính do con người tiếp tục vượt qua các điểm bùng phát nhiệt độ tới hạn, quản lý bức xạ mặt trời (SRM) đã chuyển dịch từ lý thuyết ngoại vi sang chủ đề tranh luận địa chính trị cấp bách. Việc phun son khí vào tầng bình lưu mô phỏng cơ chế làm mát của các vụ phun trào núi lửa dạng Pliny khổng lồ bằng cách phân tán sulfur dioxide vào tầng khí quyển trên để làm chệch hướng bức xạ mặt trời chiếu tới."
    },
    {
      "id": "c1-geoengineering-solar-radiation-p2",
      "order": 2,
      "english": "While technically cost-effective, SRM presents catastrophic systemic hazards. Albedo manipulation threatens to disrupt equatorial monsoons, endangering food security for billions, while failing to address ocean acidification. Most perilously, the prospect of 'termination shock'—an abrupt cessation of aerosol delivery—would trigger rapid, catastrophic rebound warming rates unprecedented in geologic history.",
      "vietnamese": "Mặc dù hiệu quả về mặt chi phí kỹ thuật, SRM đưa lại những mối hiểm họa mang tính hệ thống khôn lường. Sự can thiệp suất phản chiếu có nguy cơ làm rối loạn các đợt gió mùa xích đạo, đe dọa an ninh lương thực của hàng tỷ người, đồng thời hoàn toàn bất lực trước nạn axit hóa đại dương. Nguy hiểm nhất là viễn cảnh 'cú sốc chấm dứt'—sự gián đoạn đột ngột của việc cung cấp son khí—sẽ châm ngòi cho tốc độ ấm lên bùng nổ thảm khốc chưa từng có trong lịch sử địa chất."
    }
  ],
  "questions": [
    {
      "id": "c1-geoengineering-solar-radiation-q1",
      "type": "multiple-choice",
      "question": "What natural phenomenon does stratospheric aerosol injection deliberately emulate?",
      "options": [
        "Plinian volcanic eruptions ejecting sulfur dioxide",
        "Tidal tsunamis flooding coastal regions",
        "Meteorite impacts creating desert craters",
        "Forest fires generating carbon soot"
      ],
      "correctAnswer": "Plinian volcanic eruptions ejecting sulfur dioxide",
      "explanation": "Paragraph 1 states it simulates the cooling dynamics of massive plinian volcanic eruptions by dispersing sulfur dioxide.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-geoengineering-solar-radiation-q2",
      "type": "vocabulary-context",
      "question": "What is meant by the concept of 'termination shock' in geoengineering discourse?",
      "options": [
        "Sudden, rapid rebound global warming if aerosol deployment is abruptly halted",
        "A massive electromagnetic pulse knocking out satellite communications",
        "The sudden freezing of polar ice caps into solid glaciers",
        "A legal shockwave when international treaties are signed"
      ],
      "correctAnswer": "Sudden, rapid rebound global warming if aerosol deployment is abruptly halted",
      "explanation": "Paragraph 2 defines termination shock as abrupt cessation of aerosol delivery triggering rapid, catastrophic rebound warming.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-structural-connectomics-brain",
  "title": "High-Resolution Diffusion Tractography and Brain Connectomics",
  "subtitle": "Mapping the macro-scale structural wiring of the human cerebral connectome",
  "level": "C1",
  "topic": "Neuroscience",
  "author": "Dr. Viviane Mercier",
  "estimatedMinutes": 5,
  "wordCount": 320,
  "coverImage": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-structural-connectomics-brain-p1",
      "order": 1,
      "english": "The human brain encompasses nearly eighty-six billion neurons interconnected by over one hundred trillion synaptic junctions. Deciphering this labyrinthine communicative infrastructure requires structural connectomics, which utilizes diffusion spectrum magnetic resonance imaging to track the Brownian motion of water molecules along myelinated axonal tracts.",
      "vietnamese": "Bộ não người chứa gần tám mươi sáu tỷ tế bào thần kinh được liên kết chằng chịt bởi hơn một trăm nghìn tỷ mối nối synap. Việc giải mã hạ tầng giao tiếp phức tạp như mê cung này đòi hỏi ngành kết nối học cấu trúc, bộ môn sử dụng chụp cộng hưởng từ phổ khuếch tán để theo dõi chuyển động Brown của các phân tử nước dọc theo các bó sợi trục có bao myelin."
    },
    {
      "id": "c1-structural-connectomics-brain-p2",
      "order": 2,
      "english": "Graph-theoretic mathematical analysis reveals that the cerebral connectome exhibits a 'rich-club' organization: a densely interconnected core of hub regions that facilitates rapid cross-modal cognitive integration. Disruption of these pivotal topological hubs correlates tightly with schizophrenia, Alzheimer's dementia, and intractable neurological disorders.",
      "vietnamese": "Phân tích toán học lý thuyết đồ thị tiết lộ rằng mạng lưới kết nối não bộ thể hiện một tổ chức 'câu lạc bộ giàu có' (rich-club): một vùng lõi gồm các trung tâm kết nối dày đặc giúp tạo điều kiện tích hợp nhận thức liên phương thức nhanh chóng. Sự gián đoạn của các trung tâm topo mang tính cốt lõi này tương quan chặt chẽ với bệnh tâm thần phân liệt, sa sút trí tuệ Alzheimer và các rối loạn thần kinh nan giải."
    }
  ],
  "questions": [
    {
      "id": "c1-structural-connectomics-brain-q1",
      "type": "multiple-choice",
      "question": "What physical principle does diffusion MRI tractography exploit to reconstruct axonal pathways?",
      "options": [
        "The anisotropic Brownian motion of water molecules along myelinated fibers",
        "The magnetic polarity of iron atoms inside red blood cells",
        "The emission of radioactive positrons from glucose tracers",
        "The reflective properties of acoustic ultrasound waves"
      ],
      "correctAnswer": "The anisotropic Brownian motion of water molecules along myelinated fibers",
      "explanation": "Paragraph 1 explains it tracks the Brownian motion of water molecules along myelinated axonal tracts.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-structural-connectomics-brain-q2",
      "type": "inference",
      "question": "What functional advantage does a 'rich-club' network architecture provide the human mind?",
      "options": [
        "Enables rapid cross-modal information integration across diverse cerebral regions",
        "Prevents electrical signals from traveling across hemispheres",
        "Isolates memory retrieval completely from visual perception",
        "Allows the brain to shut down ninety percent of neurons during daytime"
      ],
      "correctAnswer": "Enables rapid cross-modal information integration across diverse cerebral regions",
      "explanation": "Paragraph 2 states the rich-club core facilitates rapid cross-modal cognitive integration.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-post-humanism-cybernetic-ontology",
  "title": "Cybernetic Ontology and the Disruption of Anthropocentrism",
  "subtitle": "Deconstructing humanist sovereignty in the era of hybrid techno-biological assemblages",
  "level": "C1",
  "topic": "Critical Theory & Philosophy",
  "author": "Prof. Sean Calloway",
  "estimatedMinutes": 5,
  "wordCount": 315,
  "coverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-post-humanism-cybernetic-ontology-p1",
      "order": 1,
      "english": "Enlightenment humanism codified the human subject as an autonomous, self-contained locus of rational sovereignty, demarcated sharply from inanimate technology and non-human organisms. Post-humanist philosophy demolishes this anthropocentric boundary, positing instead that subjectivity is an emergent property of hybrid cybernetic assemblages.",
      "vietnamese": "Chủ nghĩa nhân văn Khai sáng từng định hình chủ thể con người như một tâm điểm tự chủ, khép kín của chủ quyền duy lý, được phân định rạch ròi khỏi công nghệ vô tri và các sinh vật phi nhân bản. Triết học hậu nhân văn đã phá bỏ ranh giới vị nhân sinh này, khẳng định rằng tính chủ thể chỉ là một thuộc tính mới xuất hiện từ các tổ hợp mạng điều khiển lai tạo."
    },
    {
      "id": "c1-post-humanism-cybernetic-ontology-p2",
      "order": 2,
      "english": "From neuroprosthetic neural interfaces to algorithmic decision frameworks, agency is distributed across symbiotic feedback loops rather than residing in an isolated biological ego. Acknowledging this distributed ontology demands radical legal and ethical revisions regarding culpability, personhood, and biological stewardship.",
      "vietnamese": "Từ các giao diện thần kinh nhân tạo đến các khuôn khổ thuật toán ra quyết định, quyền năng chủ động được phân phối qua các vòng lặp phản hồi cộng sinh thay vì chỉ cư ngụ trong một cái tôi sinh học cô lập. Việc thừa nhận bản thể học phân tán này đòi hỏi những cuộc duyệt xét pháp lý và đạo đức căn bản về tính trách nhiệm, tư cách nhân thân và quyền quản trị sinh học."
    }
  ],
  "questions": [
    {
      "id": "c1-post-humanism-cybernetic-ontology-q1",
      "type": "multiple-choice",
      "question": "What central Enlightenment presumption does post-humanist theory critique?",
      "options": [
        "The view of the human being as an isolated, sovereign center of agency",
        "The idea that stars produce heat through nuclear fusion",
        "The invention of democratic constitutional voting systems",
        "The practice of medical immunization against infectious viruses"
      ],
      "correctAnswer": "The view of the human being as an isolated, sovereign center of agency",
      "explanation": "Paragraph 1 contrasts post-humanism with Enlightenment humanism's autonomous, self-contained locus of rational sovereignty.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-post-humanism-cybernetic-ontology-q2",
      "type": "inference",
      "question": "Where does agency reside according to modern cybernetic philosophy?",
      "options": [
        "Distributed across symbiotic feedback loops between humans and technologies",
        "Exclusively inside the human prefrontal cortex",
        "Inside silicon microprocessor chips without human involvement",
        "In divine supernatural decrees outside space and time"
      ],
      "correctAnswer": "Distributed across symbiotic feedback loops between humans and technologies",
      "explanation": "Paragraph 2 states agency is distributed across symbiotic feedback loops rather than an isolated biological ego.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
  {
  "id": "c1-anthropocene-stratigraphy",
  "title": "Technofossils and the Stratigraphic Golden Spike of the Anthropocene",
  "subtitle": "Reading humanity's enduring geochemical and radionuclide signatures in deep geological time",
  "level": "C1",
  "topic": "Geology & Earth Sciences",
  "author": "Dr. Helena Rostova",
  "estimatedMinutes": 5,
  "wordCount": 330,
  "coverImage": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=700&auto=format&fit=crop&q=80",
  "vocabularyIds": [],
  "paragraphs": [
    {
      "id": "c1-anthropocene-stratigraphy-p1",
      "order": 1,
      "english": "Geological epochs are formally demarcated by Global Boundary Stratotype Sections and Points (GSSPs)—commonly termed 'golden spikes'—identifying distinct, globally synchronous geochemical markers within sedimentary strata. Stratigraphers assessing whether humanity has inaugurated a distinct Anthropocene epoch examine clear perturbations in Earth's lithospheric record.",
      "vietnamese": "Các kỷ nguyên địa chất được phân định chính thức bởi các Điểm và Mặt cắt Tầng ranh giới Chuẩn Toàn cầu (GSSP)—thường được gọi là 'những chiếc đinh vàng'—nhận diện các dấu ấn địa hóa học đồng bộ trên toàn cầu bên trong các địa tầng trầm tích. Các nhà địa tầng học khi đánh giá xem liệu nhân loại đã mở ra một kỷ nguyên Nhân sinh (Anthropocene) riêng biệt hay chưa đang xem xét các biến động rõ nét trong hồ sơ thạch quyển Trái đất."
    },
    {
      "id": "c1-anthropocene-stratigraphy-p2",
      "order": 2,
      "english": "Compelling physical candidates include artificial radionuclide fallout from thermonuclear weapons tests beginning in 1952, ubiquitous technofossils composed of un-biodegradable plastics and elemental aluminum alloys, and drastic perturbations in carbon isotope ratios. These indelible lithic markers will remain clearly decipherable to extraterrestrial geologists hundreds of millions of years into the planet's future.",
      "vietnamese": "Những ứng viên vật lý thuyết phục bao gồm bụi phóng xạ hạt nhân nhân tạo từ các vụ thử vũ khí nhiệt hạch bắt đầu từ năm 1952, các hóa thạch kỹ thuật (technofossils) phổ biến tạo bởi nhựa không thể phân hủy sinh học và hợp kim nhôm nguyên tố, cùng sự biến động mạnh mẽ của tỷ lệ đồng vị carbon. Những dấu ấn thạch học không thể xóa nhòa này sẽ vẫn có thể được giải mã rõ ràng bởi các nhà địa chất ngoài hành tinh hàng trăm triệu năm nữa trong tương lai của hành tinh."
    }
  ],
  "questions": [
    {
      "id": "c1-anthropocene-stratigraphy-q1",
      "type": "multiple-choice",
      "question": "What is a 'golden spike' (GSSP) in official geological stratigraphy?",
      "options": [
        "A globally synchronous geochemical boundary marking the onset of a new geologic epoch",
        "A precious gold artifact buried by ancient Egyptian pharaohs",
        "A physical railway spike used to unite continental railway lines",
        "A measurement tool used to record volcanic earthquake tremors"
      ],
      "correctAnswer": "A globally synchronous geochemical boundary marking the onset of a new geologic epoch",
      "explanation": "Paragraph 1 defines a golden spike (GSSP) as identifying distinct, globally synchronous geochemical markers within sedimentary strata.",
      "difficulty": "C1",
      "relatedParagraph": 1
    },
    {
      "id": "c1-anthropocene-stratigraphy-q2",
      "type": "inference",
      "question": "Which enduring material footprint qualifies as a 'technofossil' in humanity's stratigraphic record?",
      "options": [
        "Non-biodegradable plastics and elemental aluminum alloys",
        "Fossilized dinosaur footprints in limestone",
        "Volcanic basalt lava flows from prehistoric fissures",
        "Organic wooden tree leaves compressed into coal"
      ],
      "correctAnswer": "Non-biodegradable plastics and elemental aluminum alloys",
      "explanation": "Paragraph 2 explicitly mentions ubiquitous technofossils composed of un-biodegradable plastics and aluminum alloys.",
      "difficulty": "C1",
      "relatedParagraph": 2
    }
  ]
},
];
