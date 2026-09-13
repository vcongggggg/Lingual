/**
 * LinguaFlow Full Production Curriculum Dataset
 * Course: Tiếng Việt -> Tiếng Anh (Vietnamese -> English A1 - B1)
 * 10 Units, 30 Lessons, 150+ Vocabularies & Exercises with Illustration Images & Audio Metadata
 */

export const SEED_ACHIEVEMENTS = [
  { code: 'FIRST_LESSON', nameKey: 'achievement.first_lesson', icon: 'sparkles', xpBonus: 50 },
  { code: 'STREAK_3_DAYS', nameKey: 'achievement.streak_3_days', icon: 'flame', xpBonus: 100 },
  { code: 'SRS_MASTER_10', nameKey: 'achievement.srs_master_10', icon: 'brain', xpBonus: 150 },
  { code: 'GAME_CHAMPION', nameKey: 'achievement.game_champion', icon: 'trophy', xpBonus: 200 },
  { code: 'VOCAB_100', nameKey: 'achievement.vocab_100', icon: 'book-open', xpBonus: 300 },
  { code: 'DICT_EXPLORER', nameKey: 'achievement.dict_explorer', icon: 'search', xpBonus: 150 },
  { code: 'STREAK_7_DAYS', nameKey: 'achievement.streak_7_days', icon: 'zap', xpBonus: 250 },
];

export const SEED_UNITS = [
  // --------------------------------------------------------------------------
  // UNIT 1: Chào hỏi & Giới thiệu bản thân (A1)
  // --------------------------------------------------------------------------
  {
    order: 1,
    title: "Unit 1: Chào hỏi & Giới thiệu bản thân",
    description: "Học các câu chào hỏi, giới thiệu tên, tuổi, quốc tịch và câu giao tiếp cơ bản.",
    iconName: "hand-wave",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Chào hỏi thường ngày (Greetings)",
        description: "Các mẫu câu chào hỏi thông dụng.",
        xpReward: 20,
        words: [
          { targetText: "Hello", translation: "Xin chào", phonetic: "/həˈloʊ/", imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80", exampleSentence: "Hello, nice to meet you!", exampleTranslation: "Xin chào, rất vui được gặp bạn!", cefrLevel: "A1", partOfSpeech: "interjection" },
          { targetText: "Good morning", translation: "Chào buổi sáng", phonetic: "/ɡʊd ˈmɔːrnɪŋ/", imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=500&auto=format&fit=crop&q=80", exampleSentence: "Good morning, teacher!", exampleTranslation: "Chào buổi sáng, thầy giáo!", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Goodbye", translation: "Tạm biệt", phonetic: "/ɡʊdˈbaɪ/", imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&auto=format&fit=crop&q=80", exampleSentence: "Goodbye, see you tomorrow!", exampleTranslation: "Tạm biệt, hẹn gặp lại bạn ngày mai!", cefrLevel: "A1", partOfSpeech: "interjection" },
          { targetText: "Thank you", translation: "Cảm ơn bạn", phonetic: "/θæŋk juː/", imageUrl: "https://images.unsplash.com/photo-1499744632587-7798360ba20f?w=500&auto=format&fit=crop&q=80", exampleSentence: "Thank you for your help.", exampleTranslation: "Cảm ơn sự giúp đỡ của bạn.", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Please", translation: "Làm ơn / Vui lòng", phonetic: "/pliːz/", imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&auto=format&fit=crop&q=80", exampleSentence: "Please open the window.", exampleTranslation: "Vui lòng mở cửa sổ ra.", cefrLevel: "A1", partOfSpeech: "adverb" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Good morning' nghĩa là gì?", optionsJson: JSON.stringify(["Chào buổi sáng", "Chào buổi chiều", "Tạm biệt", "Cảm ơn"]), correctAnswer: "Chào buổi sáng", explanation: "'Good morning' là câu chào buổi sáng." },
          { type: "sentence_scramble", prompt: "Ghép các từ tiếng Anh bên dưới thành câu chào: 'Xin chào, rất vui được gặp bạn!'", optionsJson: JSON.stringify(["nice", "Hello,", "you!", "to", "meet"]), correctAnswer: "Hello, nice to meet you!", explanation: "Cấu trúc chuẩn: Hello, nice to meet you!" }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Tên & Quốc tịch (Name & Nationality)",
        description: "Hỏi và trả lời về tên tuổi, đất nước.",
        xpReward: 25,
        words: [
          { targetText: "Name", translation: "Tên", phonetic: "/neɪm/", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80", exampleSentence: "My name is Lan.", exampleTranslation: "Tên tôi là Lan.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Country", translation: "Quốc gia / Đất nước", phonetic: "/ˈkʌntri/", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80", exampleSentence: "Vietnam is a beautiful country.", exampleTranslation: "Việt Nam là một đất nước đẹp.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Vietnamese", translation: "Người Việt / Tiếng Việt", phonetic: "/ˌvjetnəˈmiːz/", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=500&auto=format&fit=crop&q=80", exampleSentence: "I am Vietnamese.", exampleTranslation: "Tôi là người Việt Nam.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "England", translation: "Nước Anh", phonetic: "/ˈɪŋɡlənd/", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&auto=format&fit=crop&q=80", exampleSentence: "He lives in England.", exampleTranslation: "Anh ấy sống ở nước Anh.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Student", translation: "Học sinh / Sinh viên", phonetic: "/ˈstuːdnt/", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80", exampleSentence: "She is a good student.", exampleTranslation: "Cô ấy là một học sinh giỏi.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Country' nghĩa là gì?", optionsJson: JSON.stringify(["Đất nước", "Thành phố", "Tên", "Tuổi"]), correctAnswer: "Đất nước", explanation: "'Country' có nghĩa là quốc gia hoặc đất nước." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Hỏi thăm sức khỏe & Tạm biệt",
        description: "Hỏi thăm 'How are you?' và các cách đáp lại lịch sự.",
        xpReward: 25,
        words: [
          { targetText: "Fine", translation: "Khỏe / Tốt", phonetic: "/faɪn/", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", exampleSentence: "I am fine, thank you.", exampleTranslation: "Tôi khỏe, cảm ơn bạn.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Tired", translation: "Mệt mỏi", phonetic: "/ˈtaɪərd/", imageUrl: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=500&auto=format&fit=crop&q=80", exampleSentence: "He looks a bit tired today.", exampleTranslation: "Hôm nay anh ấy trông hơi mệt.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Great", translation: "Tuyệt vời", phonetic: "/ɡreɪt/", imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Everything is going great!", exampleTranslation: "Mọi thứ đang diễn ra rất tuyệt vời!", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "See you later", translation: "Hẹn gặp lại sau", phonetic: "/siː juː ˈleɪtər/", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", exampleSentence: "Have a nice afternoon, see you later!", exampleTranslation: "Chúc buổi chiều vui vẻ, hẹn gặp lại sau!", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Welcome", translation: "Chào đón / Không có chi", phonetic: "/ˈwelkəm/", imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=80", exampleSentence: "You are always welcome here.", exampleTranslation: "Bạn luôn được chào đón ở đây.", cefrLevel: "A1", partOfSpeech: "interjection" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "Đáp lại câu hỏi 'How are you?' như thế nào?", optionsJson: JSON.stringify(["I am fine, thank you.", "My name is Tom.", "I am from Vietnam.", "Yes, please."]), correctAnswer: "I am fine, thank you.", explanation: "Khi hỏi thăm sức khỏe, câu trả lời chuẩn là 'I am fine, thank you.'" }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 2: Gia đình & Bạn bè (A1)
  // --------------------------------------------------------------------------
  {
    order: 2,
    title: "Unit 2: Gia đình & Bạn bè",
    description: "Từ vựng về các thành viên gia đình, các mối quan hệ xã hội.",
    iconName: "users",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Thành viên gia đình (Family Members)",
        description: "Bố, mẹ, anh chị em và ông bà.",
        xpReward: 25,
        words: [
          { targetText: "Father", translation: "Bố / Cha", phonetic: "/ˈfɑːðər/", imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80", exampleSentence: "My father is a doctor.", exampleTranslation: "Bố tôi là bác sĩ.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Mother", translation: "Mẹ", phonetic: "/ˈmʌðər/", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80", exampleSentence: "My mother cooks well.", exampleTranslation: "Mẹ tôi nấu ăn rất ngon.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Brother", translation: "Anh / Em trai", phonetic: "/ˈbrʌðər/", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80", exampleSentence: "I have one brother.", exampleTranslation: "Tôi có một người anh trai.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Sister", translation: "Chị / Em gái", phonetic: "/ˈsɪstər/", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", exampleSentence: "My sister loves music.", exampleTranslation: "Chị gái tôi rất thích âm nhạc.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Family", translation: "Gia đình", phonetic: "/ˈfæməli/", imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&auto=format&fit=crop&q=80", exampleSentence: "I love my family.", exampleTranslation: "Tôi yêu gia đình của tôi.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Mother' nghĩa là gì?", optionsJson: JSON.stringify(["Mẹ", "Bố", "Chị gái", "Bà"]), correctAnswer: "Mẹ", explanation: "'Mother' nghĩa là Mẹ." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Tính cách & Ngoại hình",
        description: "Miêu tả cao, thấp, thông minh, tốt bụng.",
        xpReward: 30,
        words: [
          { targetText: "Kind", translation: "Tốt bụng", phonetic: "/kaɪnd/", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80", exampleSentence: "She has a very kind heart.", exampleTranslation: "Cô ấy có một trái tim rất tốt bụng.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Smart", translation: "Thông minh", phonetic: "/smɑːrt/", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80", exampleSentence: "He is a smart student.", exampleTranslation: "Cậu ấy là một học sinh thông minh.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Tall", translation: "Cao ráo", phonetic: "/tɔːl/", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80", exampleSentence: "My older brother is tall.", exampleTranslation: "Anh trai tôi dáng người cao ráo.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Friendly", translation: "Thân thiện", phonetic: "/ˈfrendli/", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80", exampleSentence: "Our neighbors are very friendly.", exampleTranslation: "Hàng xóm của chúng tôi rất thân thiện.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Young", translation: "Trẻ tuổi", phonetic: "/jʌŋ/", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=80", exampleSentence: "They are energetic and young.", exampleTranslation: "Họ tràn đầy năng lượng và còn trẻ.", cefrLevel: "A1", partOfSpeech: "adjective" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Friendly' có nghĩa là gì?", optionsJson: JSON.stringify(["Thân thiện", "Xấu hổ", "Nghiêm khắc", "Buồn bã"]), correctAnswer: "Thân thiện", explanation: "'Friendly' nghĩa là thân thiện." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Tình bạn & Bạn thân (Friendship)",
        description: "Chia sẻ sở thích cùng bạn bè.",
        xpReward: 30,
        words: [
          { targetText: "Best friend", translation: "Bạn thân nhất", phonetic: "/best frend/", imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80", exampleSentence: "She has been my best friend since childhood.", exampleTranslation: "Cô ấy là bạn thân nhất của tôi từ thuở nhỏ.", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Share", translation: "Chia sẻ", phonetic: "/ʃer/", imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&auto=format&fit=crop&q=80", exampleSentence: "Good friends share their joy and sadness.", exampleTranslation: "Bạn tốt luôn chia sẻ niềm vui và nỗi buồn.", cefrLevel: "A1", partOfSpeech: "verb" },
          { targetText: "Helpful", translation: "Hay giúp đỡ / Bổ ích", phonetic: "/ˈhelpfl/", imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&auto=format&fit=crop&q=80", exampleSentence: "He is always helpful to everyone.", exampleTranslation: "Anh ấy luôn nhiệt tình giúp đỡ mọi người.", cefrLevel: "A2", partOfSpeech: "adjective" },
          { targetText: "Trust", translation: "Tin tưởng", phonetic: "/trʌst/", imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop&q=80", exampleSentence: "True friendship is built on mutual trust.", exampleTranslation: "Tình bạn chân thành được xây dựng trên sự tin tưởng lẫn nhau.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Together", translation: "Cùng nhau", phonetic: "/təˈɡeðər/", imageUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500&auto=format&fit=crop&q=80", exampleSentence: "We study English together every evening.", exampleTranslation: "Chúng tôi học tiếng Anh cùng nhau mỗi tối.", cefrLevel: "A1", partOfSpeech: "adverb" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Best friend' nghĩa là gì?", optionsJson: JSON.stringify(["Bạn thân nhất", "Đồng nghiệp", "Hàng xóm", "Người quen"]), correctAnswer: "Bạn thân nhất", explanation: "'Best friend' là bạn thân nhất." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 3: Thức ăn & Đồ uống (A1 - A2)
  // --------------------------------------------------------------------------
  {
    order: 3,
    title: "Unit 3: Thức ăn & Đồ uống",
    description: "Từ vựng về món ăn, nước uống, nhà hàng và cách gọi món.",
    iconName: "utensils",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Món ăn hàng ngày (Daily Food)",
        description: "Cơm, phở, bánh mì, trái cây.",
        xpReward: 30,
        words: [
          { targetText: "Water", translation: "Nước uống", phonetic: "/ˈwɔːtər/", imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Drink more water every day.", exampleTranslation: "Hãy uống nhiều nước hơn mỗi ngày.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Rice", translation: "Cơm / Gạo", phonetic: "/raɪs/", imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80", exampleSentence: "We eat rice for dinner.", exampleTranslation: "Chúng tôi ăn cơm vào buổi tối.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Coffee", translation: "Cà phê", phonetic: "/ˈkɔːfi/", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80", exampleSentence: "Hot coffee in the morning.", exampleTranslation: "Cà phê nóng vào buổi sáng.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Apple", translation: "Quả táo", phonetic: "/ˈæpl/", imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80", exampleSentence: "An apple a day keeps the doctor away.", exampleTranslation: "Mỗi ngày một quả táo giúp cơ thể khỏe mạnh.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Bread", translation: "Bánh mì", phonetic: "/bred/", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80", exampleSentence: "Fresh bread is delicious.", exampleTranslation: "Bánh mì tươi rất ngon.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Coffee' nghĩa là gì?", optionsJson: JSON.stringify(["Cà phê", "Trà", "Nước ép", "Sữa"]), correctAnswer: "Cà phê", explanation: "'Coffee' nghĩa là cà phê." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Gọi món tại Nhà hàng (Ordering Food)",
        description: "Xem thực đơn, gọi món và tính tiền.",
        xpReward: 35,
        words: [
          { targetText: "Menu", translation: "Thực đơn", phonetic: "/ˈmenjuː/", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80", exampleSentence: "Can I see the menu, please?", exampleTranslation: "Cho tôi xem thực đơn được không?", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Order", translation: "Gọi món / Đặt hàng", phonetic: "/ˈɔːrdər/", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80", exampleSentence: "Are you ready to order?", exampleTranslation: "Quý khách đã sẵn sàng gọi món chưa?", cefrLevel: "A1", partOfSpeech: "verb" },
          { targetText: "Delicious", translation: "Thơm ngon", phonetic: "/dɪˈlɪʃəs/", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80", exampleSentence: "The grilled chicken is delicious.", exampleTranslation: "Món gà nướng này rất thơm ngon.", cefrLevel: "A2", partOfSpeech: "adjective" },
          { targetText: "Bill", translation: "Hóa đơn thanh toán", phonetic: "/bɪl/", imageUrl: "https://images.unsplash.com/photo-1554415707-9e49017a5815?w=500&auto=format&fit=crop&q=80", exampleSentence: "Could we have the bill, please?", exampleTranslation: "Làm ơn cho chúng tôi xin hóa đơn.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Waiter", translation: "Người phục vụ bàn", phonetic: "/ˈweɪtər/", imageUrl: "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=500&auto=format&fit=crop&q=80", exampleSentence: "The waiter brought our drinks quickly.", exampleTranslation: "Người phục vụ mang đồ uống ra rất nhanh.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "Muốn xin tính tiền ở nhà hàng thì nói câu nào?", optionsJson: JSON.stringify(["Could we have the bill, please?", "Where is the airport?", "I am fine, thank you.", "What is your name?"]), correctAnswer: "Could we have the bill, please?", explanation: "'Could we have the bill, please?' là câu xin hóa đơn thanh toán chuẩn." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Nấu ăn & Bữa cơm gia đình",
        description: "Gia vị, nguyên liệu tươi ngon và phong cách nấu ăn.",
        xpReward: 35,
        words: [
          { targetText: "Cook", translation: "Nấu ăn / Đầu bếp", phonetic: "/kʊk/", imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=80", exampleSentence: "I love to cook Italian pasta.", exampleTranslation: "Tôi rất thích nấu mì Ý.", cefrLevel: "A1", partOfSpeech: "verb" },
          { targetText: "Vegetable", translation: "Rau củ", phonetic: "/ˈvedʒtəbl/", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80", exampleSentence: "Eat fresh vegetables every meal.", exampleTranslation: "Ăn rau củ tươi trong mỗi bữa ăn.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Spice", translation: "Gia vị", phonetic: "/spaɪs/", imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80", exampleSentence: "Traditional spices make the soup aromatic.", exampleTranslation: "Gia vị truyền thống làm cho món súp đậm đà hương vị.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Taste", translation: "Hương vị / Nếm thử", phonetic: "/teɪst/", imageUrl: "https://images.unsplash.com/photo-1505253758473-96b3015f27eb?w=500&auto=format&fit=crop&q=80", exampleSentence: "This soup has a rich taste.", exampleTranslation: "Món súp này có hương vị rất đậm đà.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Fresh", translation: "Tươi mới / Trong lành", phonetic: "/freʃ/", imageUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80", exampleSentence: "Buy fresh fruits at the local market.", exampleTranslation: "Mua hoa quả tươi ở chợ địa phương.", cefrLevel: "A1", partOfSpeech: "adjective" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Vegetable' nghĩa là gì?", optionsJson: JSON.stringify(["Rau củ", "Trái cây", "Thịt bò", "Bánh ngọt"]), correctAnswer: "Rau củ", explanation: "'Vegetable' nghĩa là rau củ." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 4: Cuộc sống & Thói quen hàng ngày (A2)
  // --------------------------------------------------------------------------
  {
    order: 4,
    title: "Unit 4: Cuộc sống & Thói quen hàng ngày",
    description: "Thói quen buổi sáng, giờ giấc sinh hoạt và ngày cuối tuần.",
    iconName: "clock",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Buổi sáng & Đồng hồ sinh học",
        description: "Thức dậy, vệ sinh cá nhân, ăn sáng.",
        xpReward: 30,
        words: [
          { targetText: "Wake up", translation: "Thức dậy", phonetic: "/weɪk ʌp/", imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=80", exampleSentence: "I wake up at 6 AM every day.", exampleTranslation: "Tôi thức dậy lúc 6 giờ sáng mỗi ngày.", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Breakfast", translation: "Bữa ăn sáng", phonetic: "/ˈbrekfəst/", imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=80", exampleSentence: "Never skip breakfast.", exampleTranslation: "Đừng bao giờ bỏ bữa sáng.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Shower", translation: "Tắm vòi sen", phonetic: "/ˈʃaʊər/", imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80", exampleSentence: "A morning shower refreshes the body.", exampleTranslation: "Tắm buổi sáng giúp cơ thể sảng khoái.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Routine", translation: "Thói quen định kỳ", phonetic: "/ruːˈtiːn/", imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Maintain a productive daily routine.", exampleTranslation: "Duy trì một thói quen hàng ngày hiệu quả.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Early", translation: "Sớm", phonetic: "/ˈɜːrli/", imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=500&auto=format&fit=crop&q=80", exampleSentence: "The early bird catches the worm.", exampleTranslation: "Dậy sớm gặt hái thành công.", cefrLevel: "A1", partOfSpeech: "adverb" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Wake up' nghĩa là gì?", optionsJson: JSON.stringify(["Thức dậy", "Đi ngủ", "Tập thể dục", "Ăn tối"]), correctAnswer: "Thức dậy", explanation: "'Wake up' là thức dậy." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Làm việc & Đi lại (Work & Commute)",
        description: "Đi làm, kẹt xe, phương tiện công cộng.",
        xpReward: 35,
        words: [
          { targetText: "Commute", translation: "Đi lại làm việc", phonetic: "/kəˈmjuːt/", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80", exampleSentence: "She commutes by electric bus.", exampleTranslation: "Cô ấy đi làm bằng xe buýt điện.", cefrLevel: "B1", partOfSpeech: "verb" },
          { targetText: "Traffic", translation: "Giao thông", phonetic: "/ˈtræfɪk/", imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&auto=format&fit=crop&q=80", exampleSentence: "Heavy traffic during rush hour.", exampleTranslation: "Giao thông đông đúc vào giờ cao điểm.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Office", translation: "Văn phòng", phonetic: "/ˈɔːfɪs/", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80", exampleSentence: "Our office is in the city center.", exampleTranslation: "Văn phòng chúng tôi nằm ở trung tâm thành phố.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Busy", translation: "Bận rộn", phonetic: "/ˈbɪzi/", imageUrl: "https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=500&auto=format&fit=crop&q=80", exampleSentence: "A busy working Monday.", exampleTranslation: "Một ngày thứ Hai làm việc bận rộn.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Schedule", translation: "Lịch trình / Thời gian biểu", phonetic: "/ˈskedʒuːl/", imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=80", exampleSentence: "Check your weekly schedule.", exampleTranslation: "Kiểm tra lịch trình hàng tuần của bạn.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Office' nghĩa là gì?", optionsJson: JSON.stringify(["Văn phòng", "Công viên", "Sân bay", "Nhà hàng"]), correctAnswer: "Văn phòng", explanation: "'Office' là văn phòng làm việc." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Buổi tối & Ngày cuối tuần (Weekend Leisure)",
        description: "Thư giãn, xem phim, tụ tập bạn bè.",
        xpReward: 35,
        words: [
          { targetText: "Relax", translation: "Nghỉ ngơi / Thư giãn", phonetic: "/rɪˈlæks/", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80", exampleSentence: "Listen to music to relax.", exampleTranslation: "Nghe nhạc để thư giãn đầu óc.", cefrLevel: "A1", partOfSpeech: "verb" },
          { targetText: "Movie", translation: "Bộ phim", phonetic: "/ˈmuːvi/", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80", exampleSentence: "We watched an exciting movie.", exampleTranslation: "Chúng tôi đã xem một bộ phim rất kịch tính.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Weekend", translation: "Cuối tuần", phonetic: "/ˈwiːkend/", imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80", exampleSentence: "Have a wonderful weekend!", exampleTranslation: "Chúc bạn một cuối tuần thật tuyệt vời!", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Hobby", translation: "Sở thích", phonetic: "/ˈhɑːbi/", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80", exampleSentence: "Photography is my favorite hobby.", exampleTranslation: "Nhiếp ảnh là sở thích yêu thích nhất của tôi.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Sleep", translation: "Giấc ngủ / Ngủ", phonetic: "/sliːp/", imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80", exampleSentence: "Get eight hours of sleep each night.", exampleTranslation: "Ngủ đủ tám tiếng mỗi đêm.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Weekend' nghĩa là gì?", optionsJson: JSON.stringify(["Cuối tuần", "Đầu tuần", "Hôm nay", "Ngày mai"]), correctAnswer: "Cuối tuần", explanation: "'Weekend' nghĩa là ngày cuối tuần." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 5: Du lịch & Khách sạn (A2)
  // --------------------------------------------------------------------------
  {
    order: 5,
    title: "Unit 5: Du lịch & Khách sạn",
    description: "Sân bay, vé máy bay, đặt phòng khách sạn và hỏi đường.",
    iconName: "plane",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Sân bay & Chuyến bay (Aviation)",
        description: "Hộ chiếu, hành lý, cổng lên máy bay.",
        xpReward: 35,
        words: [
          { targetText: "Airport", translation: "Sân bay", phonetic: "/ˈerpɔːrt/", imageUrl: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=500&auto=format&fit=crop&q=80", exampleSentence: "Arrive at the airport 2 hours before.", exampleTranslation: "Đến sân bay trước 2 tiếng.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Passport", translation: "Hộ chiếu", phonetic: "/ˈpæspɔːrt/", imageUrl: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500&auto=format&fit=crop&q=80", exampleSentence: "Show your passport at security.", exampleTranslation: "Xuất trình hộ chiếu tại cửa an ninh.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Flight", translation: "Chuyến bay", phonetic: "/flaɪt/", imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=80", exampleSentence: "Our flight departs on time.", exampleTranslation: "Chuyến bay của chúng tôi khởi hành đúng giờ.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Luggage", translation: "Hành lý", phonetic: "/ˈlʌɡɪdʒ/", imageUrl: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=500&auto=format&fit=crop&q=80", exampleSentence: "Claim your luggage at carousel 3.", exampleTranslation: "Nhận hành lý tại băng chuyền số 3.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Ticket", translation: "Vé máy bay / Vé", phonetic: "/ˈtɪkɪt/", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80", exampleSentence: "Book the ticket online.", exampleTranslation: "Đặt vé trực tuyến.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Passport' nghĩa là gì?", optionsJson: JSON.stringify(["Hộ chiếu", "Vé tàu", "Hành lý", "Khách sạn"]), correctAnswer: "Hộ chiếu", explanation: "'Passport' là hộ chiếu đi lại quốc tế." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Thủ tục Khách sạn (Hotel Check-in)",
        description: "Đặt phòng, nhận phòng, dịch vụ phòng.",
        xpReward: 35,
        words: [
          { targetText: "Hotel", translation: "Khách sạn", phonetic: "/hoʊˈtel/", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80", exampleSentence: "A luxury hotel by the beach.", exampleTranslation: "Một khách sạn sang trọng bên bờ biển.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Reservation", translation: "Đặt chỗ trước", phonetic: "/ˌrezərˈveɪʃn/", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=80", exampleSentence: "I have a room reservation.", exampleTranslation: "Tôi có một phòng đã đặt trước.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Keycard", translation: "Thẻ từ mở phòng", phonetic: "/ˈkiːkɑːrd/", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=80", exampleSentence: "Here is your room keycard.", exampleTranslation: "Đây là thẻ từ mở phòng của bạn.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Reception", translation: "Quầy lễ tân", phonetic: "/rɪˈsepʃn/", imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=80", exampleSentence: "Ask the reception for assistance.", exampleTranslation: "Hỏi quầy lễ tân để được hỗ trợ.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Clean", translation: "Sạch sẽ / Dọn dẹp", phonetic: "/kliːn/", imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80", exampleSentence: "The room is very clean.", exampleTranslation: "Căn phòng rất sạch sẽ.", cefrLevel: "A1", partOfSpeech: "adjective" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Reservation' có nghĩa là gì?", optionsJson: JSON.stringify(["Đặt chỗ trước", "Hủy phòng", "Trả phòng", "Mua sắm"]), correctAnswer: "Đặt chỗ trước", explanation: "'Reservation' nghĩa là việc đặt phòng/chỗ trước." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Hỏi đường & Đi lại (Directions)",
        description: "Rẽ trái, rẽ phải, đi thẳng, khoảng cách.",
        xpReward: 35,
        words: [
          { targetText: "Straight", translation: "Đi thẳng", phonetic: "/streɪt/", imageUrl: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=500&auto=format&fit=crop&q=80", exampleSentence: "Go straight for 200 meters.", exampleTranslation: "Đi thẳng khoảng 200 mét.", cefrLevel: "A1", partOfSpeech: "adverb" },
          { targetText: "Turn left", translation: "Rẽ trái", phonetic: "/tɜːrn left/", imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Turn left at the traffic light.", exampleTranslation: "Rẽ trái ở cột đèn giao thông.", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Turn right", translation: "Rẽ phải", phonetic: "/tɜːrn raɪt/", imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=80", exampleSentence: "Turn right after the supermarket.", exampleTranslation: "Rẽ phải sau siêu thị.", cefrLevel: "A1", partOfSpeech: "phrase" },
          { targetText: "Map", translation: "Bản đồ", phonetic: "/mæp/", imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Check Google Maps for directions.", exampleTranslation: "Tra cứu Google Maps để xem đường đi.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Near", translation: "Gần đây", phonetic: "/nɪr/", imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&auto=format&fit=crop&q=80", exampleSentence: "The station is near the museum.", exampleTranslation: "Nhà ga nằm gần bảo tàng.", cefrLevel: "A1", partOfSpeech: "preposition" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Go straight' có nghĩa là gì?", optionsJson: JSON.stringify(["Đi thẳng", "Rẽ trái", "Rẽ phải", "Quay đầu"]), correctAnswer: "Đi thẳng", explanation: "'Go straight' là đi thẳng về phía trước." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 6: Mua sắm & Chi tiêu (A2)
  // --------------------------------------------------------------------------
  {
    order: 6,
    title: "Unit 6: Mua sắm & Chi tiêu",
    description: "Quần áo, kích cỡ, giảm giá, thanh toán thẻ.",
    iconName: "shopping-bag",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Thời trang & Trang phục (Clothing)",
        description: "Áo sơ mi, quần jean, giày dép, kích cỡ.",
        xpReward: 35,
        words: [
          { targetText: "Shirt", translation: "Áo sơ mi", phonetic: "/ʃɜːrt/", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80", exampleSentence: "He bought a white cotton shirt.", exampleTranslation: "Anh ấy đã mua một chiếc áo sơ mi cotton trắng.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Shoes", translation: "Đôi giày", phonetic: "/ʃuːz/", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80", exampleSentence: "Comfortable running shoes.", exampleTranslation: "Đôi giày chạy bộ rất êm ái.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Size", translation: "Kích cỡ", phonetic: "/saɪz/", imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80", exampleSentence: "Do you have this in size M?", exampleTranslation: "Bạn có áo này size M không?", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Try on", translation: "Mặc thử", phonetic: "/traɪ ɑːn/", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80", exampleSentence: "Can I try this jacket on?", exampleTranslation: "Tôi có thể mặc thử chiếc áo khoác này không?", cefrLevel: "A2", partOfSpeech: "phrase" },
          { targetText: "Color", translation: "Màu sắc", phonetic: "/ˈkʌlər/", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Blue is my favorite color.", exampleTranslation: "Xanh dương là màu sắc yêu thích của tôi.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "Hỏi 'Bạn có áo này size M không?' trong tiếng Anh:", optionsJson: JSON.stringify(["Do you have this in size M?", "Can you cook dinner?", "Where is your brother?", "What time does the train leave?"]), correctAnswer: "Do you have this in size M?", explanation: "Câu chuẩn khi hỏi kích cỡ quần áo là 'Do you have this in size...?'" }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Giảm giá & Trả giá (Discounts & Bargains)",
        description: "Ưu đãi, khuyến mãi, thẻ khách hàng thân thiết.",
        xpReward: 35,
        words: [
          { targetText: "Discount", translation: "Chiết khấu / Giảm giá", phonetic: "/ˈdɪskaʊnt/", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=80", exampleSentence: "A 20 percent discount on all items.", exampleTranslation: "Giảm giá 20% cho toàn bộ mặt hàng.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Cheap", translation: "Rẻ tiền / Giá hợp lý", phonetic: "/tʃiːp/", imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Street food in Vietnam is very cheap.", exampleTranslation: "Ẩm thực đường phố ở Việt Nam rất rẻ.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Expensive", translation: "Đắt đỏ", phonetic: "/ɪkˈspensɪv/", imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80", exampleSentence: "Designer bags are quite expensive.", exampleTranslation: "Túi hàng hiệu khá đắt đỏ.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Special offer", translation: "Khuyến mãi đặc biệt", phonetic: "/ˈspeʃl ˈɔːfər/", imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=80", exampleSentence: "Check out today's special offer.", exampleTranslation: "Xem qua ưu đãi đặc biệt hôm nay.", cefrLevel: "A2", partOfSpeech: "phrase" },
          { targetText: "Receipt", translation: "Biên lai mua hàng", phonetic: "/rɪˈsiːt/", imageUrl: "https://images.unsplash.com/photo-1554415707-9e49017a5815?w=500&auto=format&fit=crop&q=80", exampleSentence: "Keep your receipt for returns.", exampleTranslation: "Giữ biên lai của bạn để đổi trả hàng.", cefrLevel: "A2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Discount' nghĩa là gì?", optionsJson: JSON.stringify(["Giảm giá", "Hóa đơn", "Đắt tiền", "Tiền mặt"]), correctAnswer: "Giảm giá", explanation: "'Discount' có nghĩa là giảm giá hoặc chiết khấu." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Phương thức Thanh toán (Payments)",
        description: "Tiền mặt, thẻ tín dụng, quét mã QR.",
        xpReward: 35,
        words: [
          { targetText: "Cash", translation: "Tiền mặt", phonetic: "/kæʃ/", imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=500&auto=format&fit=crop&q=80", exampleSentence: "Do you accept cash payments?", exampleTranslation: "Cửa hàng có chấp nhận thanh toán tiền mặt không?", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Credit card", translation: "Thẻ tín dụng", phonetic: "/ˈkredɪt kɑːrd/", imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80", exampleSentence: "Pay securely with a credit card.", exampleTranslation: "Thanh toán an toàn bằng thẻ tín dụng.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Transfer", translation: "Chuyển khoản", phonetic: "/trænsˈfɜːr/", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80", exampleSentence: "Bank transfer is convenient.", exampleTranslation: "Chuyển khoản ngân hàng rất tiện lợi.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Price", translation: "Mức giá", phonetic: "/praɪs/", imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80", exampleSentence: "What is the price of this jacket?", exampleTranslation: "Chiếc áo khoác này giá bao nhiêu?", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Change", translation: "Tiền thối lại", phonetic: "/tʃeɪndʒ/", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80", exampleSentence: "Here is your change and receipt.", exampleTranslation: "Đây là tiền thừa và biên lai của bạn.", cefrLevel: "A2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Credit card' nghĩa là gì?", optionsJson: JSON.stringify(["Thẻ tín dụng", "Tiền mặt", "Hóa đơn", "Ví tiền"]), correctAnswer: "Thẻ tín dụng", explanation: "'Credit card' là thẻ tín dụng." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 7: Công việc & Sự nghiệp (B1)
  // --------------------------------------------------------------------------
  {
    order: 7,
    title: "Unit 7: Công việc & Sự nghiệp",
    description: "Nghề nghiệp, môi trường văn phòng, kỹ năng đàm phán và phỏng vấn.",
    iconName: "briefcase",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Các ngành nghề phổ biến (Professions)",
        description: "Kỹ sư, bác sĩ, lập trình viên, giáo viên.",
        xpReward: 40,
        words: [
          { targetText: "Engineer", translation: "Kỹ sư", phonetic: "/ˌendʒɪˈnɪr/", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80", exampleSentence: "Software engineers build great products.", exampleTranslation: "Các kỹ sư phần mềm xây dựng những sản phẩm tuyệt vời.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Doctor", translation: "Bác sĩ", phonetic: "/ˈdɑːktər/", imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80", exampleSentence: "The doctor examined the patient carefully.", exampleTranslation: "Bác sĩ thăm khám bệnh nhân rất cẩn thận.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Teacher", translation: "Giáo viên", phonetic: "/ˈtiːtʃər/", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80", exampleSentence: "A passionate English teacher.", exampleTranslation: "Một giáo viên tiếng Anh đầy nhiệt huyết.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Manager", translation: "Người quản lý / Trưởng phòng", phonetic: "/ˈmænɪdʒər/", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80", exampleSentence: "Talk to the project manager.", exampleTranslation: "Trao đổi với người quản lý dự án.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Career", translation: "Sự nghiệp", phonetic: "/kəˈrɪr/", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80", exampleSentence: "Advance your international career.", exampleTranslation: "Thăng tiến sự nghiệp quốc tế của bạn.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Engineer' nghĩa là gì?", optionsJson: JSON.stringify(["Kỹ sư", "Bác sĩ", "Quản lý", "Giáo viên"]), correctAnswer: "Kỹ sư", explanation: "'Engineer' nghĩa là kỹ sư." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Văn phòng & Hội họp (Meetings & Teamwork)",
        description: "Làm việc nhóm, thảo luận dự án, báo cáo tiến độ.",
        xpReward: 40,
        words: [
          { targetText: "Meeting", translation: "Cuộc họp", phonetic: "/ˈmiːtɪŋ/", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80", exampleSentence: "The quarterly review meeting starts at 9.", exampleTranslation: "Cuộc họp đánh giá quý bắt đầu lúc 9 giờ.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Teamwork", translation: "Làm việc nhóm", phonetic: "/ˈtiːmwɜːrk/", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80", exampleSentence: "Effective teamwork achieves higher results.", exampleTranslation: "Làm việc nhóm hiệu quả mang lại kết quả cao hơn.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Project", translation: "Dự án", phonetic: "/ˈprɑːdʒekt/", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80", exampleSentence: "Deliver the project ahead of deadline.", exampleTranslation: "Bàn giao dự án trước thời hạn chót.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Colleague", translation: "Đồng nghiệp", phonetic: "/ˈkɑːliːɡ/", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=80", exampleSentence: "Collaborate with talented colleagues.", exampleTranslation: "Cộng tác cùng các đồng nghiệp tài năng.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Deadline", translation: "Hạn chót hoàn thành", phonetic: "/ˈdedlaɪn/", imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=80", exampleSentence: "Meet the strict submission deadline.", exampleTranslation: "Hoàn thành kịp hạn nộp bài nghiêm ngặt.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Colleague' nghĩa là gì?", optionsJson: JSON.stringify(["Đồng nghiệp", "Sếp", "Khách hàng", "Học sinh"]), correctAnswer: "Đồng nghiệp", explanation: "'Colleague' là đồng nghiệp cùng làm việc." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Phỏng vấn & Thăng tiến (Job Interview)",
        description: "Kinh nghiệm làm việc, mức lương, kỹ năng giao tiếp.",
        xpReward: 45,
        words: [
          { targetText: "Interview", translation: "Buổi phỏng vấn", phonetic: "/ˈɪntərvjuː/", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80", exampleSentence: "Prepare thoroughly for the interview.", exampleTranslation: "Chuẩn bị kỹ lưỡng cho buổi phỏng vấn.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Salary", translation: "Mức lương", phonetic: "/ˈsæləri/", imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80", exampleSentence: "A competitive starting salary.", exampleTranslation: "Mức lương khởi điểm cạnh tranh.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Experience", translation: "Kinh nghiệm làm việc", phonetic: "/ɪkˈspɪriəns/", imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Three years of practical experience.", exampleTranslation: "Ba năm kinh nghiệm thực tế.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Skill", translation: "Kỹ năng chuyên môn", phonetic: "/skɪl/", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80", exampleSentence: "Communication is a crucial skill.", exampleTranslation: "Giao tiếp là một kỹ năng vô cùng quan trọng.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Promotion", translation: "Thăng chức / Đề bạt", phonetic: "/prəˈmoʊʃn/", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80", exampleSentence: "Earned a promotion after one year.", exampleTranslation: "Được thăng chức sau một năm làm việc chăm chỉ.", cefrLevel: "B2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Promotion' trong công việc nghĩa là gì?", optionsJson: JSON.stringify(["Thăng chức", "Nghỉ việc", "Hạ lương", "Đi muộn"]), correctAnswer: "Thăng chức", explanation: "'Promotion' là thăng tiến hoặc được đề bạt chức vụ cao hơn." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 8: Sức khỏe & Lối sống (B1)
  // --------------------------------------------------------------------------
  {
    order: 8,
    title: "Unit 8: Sức khỏe & Lối sống",
    description: "Cơ thể con người, bệnh tật, dinh dưỡng và lối sống lành mạnh.",
    iconName: "activity",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Triệu chứng & Thăm khám (Symptoms)",
        description: "Đau đầu, cảm cúm, sốt, đi khám bác sĩ.",
        xpReward: 40,
        words: [
          { targetText: "Headache", translation: "Đau đầu", phonetic: "/ˈhedeɪk/", imageUrl: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=500&auto=format&fit=crop&q=80", exampleSentence: "I took medicine for my headache.", exampleTranslation: "Tôi đã uống thuốc giảm đau đầu.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Fever", translation: "Cơn sốt", phonetic: "/ˈfiːvər/", imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80", exampleSentence: "Measure the body temperature when having a fever.", exampleTranslation: "Đo nhiệt độ cơ thể khi bị sốt.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Hospital", translation: "Bệnh viện", phonetic: "/ˈhɑːspɪtl/", imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80", exampleSentence: "Go to the hospital for a check-up.", exampleTranslation: "Đến bệnh viện để kiểm tra tổng quát.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Medicine", translation: "Thuốc uống", phonetic: "/ˈmedɪsn/", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80", exampleSentence: "Take the prescribed medicine after meals.", exampleTranslation: "Uống thuốc theo đơn sau bữa ăn.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Rest", translation: "Nghỉ ngơi tĩnh dưỡng", phonetic: "/rest/", imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=500&auto=format&fit=crop&q=80", exampleSentence: "You need plenty of bed rest.", exampleTranslation: "Bạn cần nghỉ ngơi tĩnh dưỡng nhiều hơn.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Medicine' nghĩa là gì?", optionsJson: JSON.stringify(["Thuốc uống", "Bác sĩ", "Bệnh viện", "Phòng tập"]), correctAnswer: "Thuốc uống", explanation: "'Medicine' nghĩa là thuốc chữa bệnh." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Dinh dưỡng & Ăn uống lành mạnh",
        description: "Chế độ ăn cân đối, vitamin, nước uống đủ lượng.",
        xpReward: 40,
        words: [
          { targetText: "Nutrition", translation: "Dinh dưỡng", phonetic: "/nuːˈtrɪʃn/", imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80", exampleSentence: "Good nutrition improves mental focus.", exampleTranslation: "Dinh dưỡng tốt giúp tăng cường sự tập trung trí não.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Healthy", translation: "Khỏe mạnh / Lành mạnh", phonetic: "/ˈhelθi/", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80", exampleSentence: "Maintain a healthy lifestyle.", exampleTranslation: "Duy trì một lối sống lành mạnh.", cefrLevel: "A1", partOfSpeech: "adjective" },
          { targetText: "Energy", translation: "Năng lượng", phonetic: "/ˈenərdʒi/", imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=80", exampleSentence: "Fruits provide natural energy.", exampleTranslation: "Trái cây cung cấp nguồn năng lượng tự nhiên.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Hydration", translation: "Sự đủ nước cơ thể", phonetic: "/haɪˈdreɪʃn/", imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Stay hydrated during exercise.", exampleTranslation: "Giữ cơ thể đủ nước trong khi vận động.", cefrLevel: "B2", partOfSpeech: "noun" },
          { targetText: "Habit", translation: "Thói quen", phonetic: "/ˈhæbɪt/", imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Drinking green tea is a great habit.", exampleTranslation: "Uống trà xanh là một thói quen rất tốt.", cefrLevel: "A2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Healthy' nghĩa là gì?", optionsJson: JSON.stringify(["Khỏe mạnh", "Mệt mỏi", "Đau ốm", "Bận rộn"]), correctAnswer: "Khỏe mạnh", explanation: "'Healthy' là khỏe mạnh hoặc có lợi cho sức khỏe." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Thể thao & Tập luyện (Fitness & Exercise)",
        description: "Chạy bộ, gym, yoga, tinh thần sảng khoái.",
        xpReward: 45,
        words: [
          { targetText: "Exercise", translation: "Tập thể dục", phonetic: "/ˈeksərsaɪz/", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80", exampleSentence: "Daily exercise strengthens muscles.", exampleTranslation: "Tập thể dục hàng ngày giúp tăng cường cơ bắp.", cefrLevel: "A1", partOfSpeech: "verb" },
          { targetText: "Workout", translation: "Buổi tập luyện", phonetic: "/ˈwɜːrkaʊt/", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80", exampleSentence: "An intense 45-minute gym workout.", exampleTranslation: "Một buổi tập gym 45 phút cường độ cao.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Strength", translation: "Sức mạnh / Thể lực", phonetic: "/streŋkθ/", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Build endurance and physical strength.", exampleTranslation: "Xây dựng sự bền bỉ và thể lực.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Flexibility", translation: "Sự dẻo dai linh hoạt", phonetic: "/ˌfleksəˈbɪləti/", imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=80", exampleSentence: "Yoga improves body flexibility.", exampleTranslation: "Yoga giúp cải thiện sự dẻo dai của cơ thể.", cefrLevel: "B2", partOfSpeech: "noun" },
          { targetText: "Breathe", translation: "Hít thở", phonetic: "/briːð/", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80", exampleSentence: "Breathe in deeply and slowly.", exampleTranslation: "Hít thở sâu và chậm rãi.", cefrLevel: "A2", partOfSpeech: "verb" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Workout' nghĩa là gì?", optionsJson: JSON.stringify(["Buổi tập luyện", "Bữa ăn trưa", "Lịch họp", "Hạn nộp bài"]), correctAnswer: "Buổi tập luyện", explanation: "'Workout' là buổi tập luyện thể chất." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 9: Công nghệ & Truyền thông số (B1)
  // --------------------------------------------------------------------------
  {
    order: 9,
    title: "Unit 9: Công nghệ & Truyền thông số",
    description: "Thiết bị số, mạng internet, trí tuệ nhân tạo và bảo mật.",
    iconName: "cpu",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Thế giới số & Ứng dụng (Apps & Devices)",
        description: "Điện thoại thông minh, ứng dụng, màn hình.",
        xpReward: 40,
        words: [
          { targetText: "Application", translation: "Ứng dụng phần mềm", phonetic: "/ˌæplɪˈkeɪʃn/", imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80", exampleSentence: "Install this language application.", exampleTranslation: "Cài đặt ứng dụng ngôn ngữ này.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Device", translation: "Thiết bị điện tử", phonetic: "/dɪˈvaɪs/", imageUrl: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&auto=format&fit=crop&q=80", exampleSentence: "Sync across all your smart devices.", exampleTranslation: "Đồng bộ trên toàn bộ các thiết bị thông minh của bạn.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Screen", translation: "Màn hình hiển thị", phonetic: "/skriːn/", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80", exampleSentence: "Reduce screen time before going to bed.", exampleTranslation: "Giảm thời gian nhìn màn hình trước khi đi ngủ.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Update", translation: "Cập nhật phiên bản", phonetic: "/ˌʌpˈdeɪt/", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80", exampleSentence: "Update the app to the newest version.", exampleTranslation: "Cập nhật ứng dụng lên phiên bản mới nhất.", cefrLevel: "A2", partOfSpeech: "verb" },
          { targetText: "Digital", translation: "Kỹ thuật số", phonetic: "/ˈdɪdʒɪtl/", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80", exampleSentence: "We live in a modern digital era.", exampleTranslation: "Chúng ta đang sống trong kỷ nguyên số hiện đại.", cefrLevel: "B1", partOfSpeech: "adjective" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Device' nghĩa là gì?", optionsJson: JSON.stringify(["Thiết bị điện tử", "Phần mềm", "Mạng dây", "Màn hình"]), correctAnswer: "Thiết bị điện tử", explanation: "'Device' nghĩa là thiết bị." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Internet & Bảo mật thông tin (Cybersecurity)",
        description: "Mật khẩu, bảo mật mạng, kết nối đám mây.",
        xpReward: 45,
        words: [
          { targetText: "Internet", translation: "Mạng toàn cầu Internet", phonetic: "/ˈɪntərnet/", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80", exampleSentence: "High-speed internet connection.", exampleTranslation: "Kết nối Internet tốc độ cao.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Security", translation: "An ninh / Bảo mật", phonetic: "/sɪˈkjʊrəti/", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80", exampleSentence: "Enhance account security with two-factor auth.", exampleTranslation: "Tăng cường bảo mật tài khoản bằng xác thực 2 lớp.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Password", translation: "Mật khẩu", phonetic: "/ˈpæswɜːrd/", imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80", exampleSentence: "Use a strong and unique password.", exampleTranslation: "Sử dụng một mật khẩu mạnh và duy nhất.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Network", translation: "Mạng lưới kết nối", phonetic: "/ˈnetwɜːrk/", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80", exampleSentence: "Connect to the encrypted office network.", exampleTranslation: "Kết nối vào mạng văn phòng được mã hóa.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Cloud", translation: "Điện toán đám mây", phonetic: "/klaʊd/", imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=500&auto=format&fit=crop&q=80", exampleSentence: "Store your photos safely in the cloud.", exampleTranslation: "Lưu trữ ảnh của bạn an toàn trên đám mây.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Password' nghĩa là gì?", optionsJson: JSON.stringify(["Mật khẩu", "Tài khoản", "Tên người dùng", "Địa chỉ email"]), correctAnswer: "Mật khẩu", explanation: "'Password' là mật khẩu bảo mật." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Trí tuệ Nhân tạo & Tương lai (AI & Future Tech)",
        description: "Mô hình ngôn ngữ, tự động hóa, robot thông minh.",
        xpReward: 50,
        words: [
          { targetText: "Artificial intelligence", translation: "Trí tuệ nhân tạo (AI)", phonetic: "/ˌɑːrtɪfɪʃl ɪnˈtelɪdʒəns/", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&auto=format&fit=crop&q=80", exampleSentence: "Artificial intelligence is changing education.", exampleTranslation: "Trí tuệ nhân tạo đang làm thay đổi nền giáo dục.", cefrLevel: "B2", partOfSpeech: "noun" },
          { targetText: "Automation", translation: "Tự động hóa", phonetic: "/ˌɔːtəˈmeɪʃn/", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80", exampleSentence: "Automation streamlines complex workflows.", exampleTranslation: "Tự động hóa tinh gọn các quy trình công việc phức tạp.", cefrLevel: "B2", partOfSpeech: "noun" },
          { targetText: "Innovation", translation: "Sự đổi mới sáng tạo", phonetic: "/ˌɪnəˈveɪʃn/", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80", exampleSentence: "Technological innovation drives progress.", exampleTranslation: "Sự đổi mới công nghệ thúc đẩy sự tiến bộ xã hội.", cefrLevel: "B2", partOfSpeech: "noun" },
          { targetText: "Algorithm", translation: "Thuật toán", phonetic: "/ˈælɡərɪðəm/", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80", exampleSentence: "Recommendation algorithms suggest helpful lessons.", exampleTranslation: "Thuật toán gợi ý các bài học bổ ích.", cefrLevel: "B2", partOfSpeech: "noun" },
          { targetText: "Smart", translation: "Thông minh / Tự động", phonetic: "/smɑːrt/", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80", exampleSentence: "Smart cities reduce energy waste.", exampleTranslation: "Các thành phố thông minh giúp giảm lãng phí năng lượng.", cefrLevel: "A2", partOfSpeech: "adjective" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Innovation' nghĩa là gì?", optionsJson: JSON.stringify(["Sự đổi mới sáng tạo", "Kế hoạch cũ", "Sự bảo thủ", "Lỗi kỹ thuật"]), correctAnswer: "Sự đổi mới sáng tạo", explanation: "'Innovation' nghĩa là sự đổi mới, sáng tạo." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 10: Văn hóa, Môi trường & Toàn cầu (B1 - B2)
  // --------------------------------------------------------------------------
  {
    order: 10,
    title: "Unit 10: Văn hóa, Môi trường & Toàn cầu",
    description: "Sinh thái tự nhiên, bảo vệ hành tinh, hội nhập văn hóa quốc tế.",
    iconName: "globe",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Thiên nhiên & Sinh thái (Ecology)",
        description: "Rừng, đại dương, động vật hoang dã.",
        xpReward: 45,
        words: [
          { targetText: "Environment", translation: "Môi trường tự nhiên", phonetic: "/ɪnˈvaɪrənmənt/", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Protect the global environment.", exampleTranslation: "Bảo vệ môi trường toàn cầu.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Nature", translation: "Thiên nhiên", phonetic: "/ˈneɪtʃər/", imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80", exampleSentence: "The beauty of untamed nature.", exampleTranslation: "Vẻ đẹp hoang sơ của thiên nhiên.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Forest", translation: "Rừng rậm", phonetic: "/ˈfɔːrɪst/", imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Tropical rainforests absorb carbon dioxide.", exampleTranslation: "Rừng nhiệt đới hấp thụ khí cacbonic.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Ocean", translation: "Đại dương", phonetic: "/ˈoʊʃn/", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Oceans cover over seventy percent of Earth.", exampleTranslation: "Đại dương bao phủ hơn bảy mươi phần trăm bề mặt Trái Đất.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Wildlife", translation: "Động vật hoang dã", phonetic: "/ˈwaɪldlaɪf/", imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&auto=format&fit=crop&q=80", exampleSentence: "Protect endangered wildlife species.", exampleTranslation: "Bảo vệ các loài động vật hoang dã có nguy cơ tuyệt chủng.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Environment' nghĩa là gì?", optionsJson: JSON.stringify(["Môi trường", "Thành phố", "Đất nước", "Vũ trụ"]), correctAnswer: "Môi trường", explanation: "'Environment' có nghĩa là môi trường." }
        ]
      },
      {
        order: 2,
        title: "Bài 2: Năng lượng xanh & Biến đổi khí hậu",
        description: "Năng lượng mặt trời, gió, giảm khí thải carbon.",
        xpReward: 50,
        words: [
          { targetText: "Climate change", translation: "Biến đổi khí hậu", phonetic: "/ˈklaɪmət tʃeɪndʒ/", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Urgent global action against climate change.", exampleTranslation: "Hành động toàn cầu cấp bách chống lại biến đổi khí hậu.", cefrLevel: "B2", partOfSpeech: "phrase" },
          { targetText: "Renewable energy", translation: "Năng lượng tái tạo", phonetic: "/rɪˈnuːəbl ˈenərdʒi/", imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&auto=format&fit=crop&q=80", exampleSentence: "Solar and wind are key renewable energies.", exampleTranslation: "Mặt trời và gió là các dạng năng lượng tái tạo chủ chốt.", cefrLevel: "B2", partOfSpeech: "phrase" },
          { targetText: "Sustainable", translation: "Bền vững / Thân thiện môi trường", phonetic: "/səˈsteɪnəbl/", imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80", exampleSentence: "Adopt sustainable lifestyle practices.", exampleTranslation: "Áp dụng những thói quen sống bền vững.", cefrLevel: "B2", partOfSpeech: "adjective" },
          { targetText: "Recycle", translation: "Tái chế rác thải", phonetic: "/ˌriːˈsaɪkl/", imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=80", exampleSentence: "Recycle plastic bottles and paper.", exampleTranslation: "Tái chế chai nhựa và giấy đã qua sử dụng.", cefrLevel: "A2", partOfSpeech: "verb" },
          { targetText: "Conservation", translation: "Sự bảo tồn", phonetic: "/ˌkɑːnsərˈveɪʃn/", imageUrl: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=500&auto=format&fit=crop&q=80", exampleSentence: "Forest conservation saves endangered species.", exampleTranslation: "Bảo tồn rừng giúp cứu các loài động vật có nguy cơ tuyệt chủng.", cefrLevel: "B2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Sustainable' nghĩa là gì?", optionsJson: JSON.stringify(["Bền vững", "Đắt đỏ", "Tạm thời", "Nguy hiểm"]), correctAnswer: "Bền vững", explanation: "'Sustainable' là bền vững, có thể duy trì lâu dài mà không hủy hoại tài nguyên." }
        ]
      },
      {
        order: 3,
        title: "Bài 3: Văn hóa & Công dân Toàn cầu (Global Culture)",
        description: "Phong tục tập quán, lễ hội truyền thống, giao lưu đa văn hóa.",
        xpReward: 50,
        words: [
          { targetText: "Culture", translation: "Nền văn hóa", phonetic: "/ˈkʌltʃər/", imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=80", exampleSentence: "Respect diverse global cultures.", exampleTranslation: "Tôn trọng các nền văn hóa đa dạng trên thế giới.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Festival", translation: "Lễ hội truyền thống", phonetic: "/ˈfestɪvl/", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", exampleSentence: "The lantern festival is colorful and vibrant.", exampleTranslation: "Lễ hội đèn lồng rực rỡ sắc màu và sôi động.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Tradition", translation: "Truyền thống", phonetic: "/trəˈdɪʃn/", imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=500&auto=format&fit=crop&q=80", exampleSentence: "Pass down beautiful cultural traditions.", exampleTranslation: "Lưu truyền những nét đẹp truyền thống văn hóa.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Opportunity", translation: "Cơ hội phát triển", phonetic: "/ˌɑːpərˈtuːnəti/", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80", exampleSentence: "English provides global career opportunities.", exampleTranslation: "Tiếng Anh mang lại nhiều cơ hội nghề nghiệp quốc tế.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Community", translation: "Cộng đồng", phonetic: "/kəˈmjuːnəti/", imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop&q=80", exampleSentence: "A supportive learning community.", exampleTranslation: "Một cộng đồng học tập luôn đồng hành và hỗ trợ nhau.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Festival' nghĩa là gì?", optionsJson: JSON.stringify(["Lễ hội", "Văn phòng", "Cuộc họp", "Khách sạn"]), correctAnswer: "Lễ hội", explanation: "'Festival' là ngày hội hoặc lễ hội văn hóa." }
        ]
      }
    ]
  }
];
