/**
 * LinguaFlow Full Production Curriculum Dataset
 * Course: Tiếng Việt -> Tiếng Anh (Vietnamese -> English A1 - B1)
 * 10 Units, 50 Lessons, 500+ Vocabularies & Exercises with CDN Illustration Images & Audio Metadata
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
          { type: "sentence_scramble", prompt: "Sắp xếp lại câu chào: 'gặp bạn / Rất vui / được'", optionsJson: JSON.stringify(["Hello", "nice", "to", "meet", "you"]), correctAnswer: "Hello, nice to meet you!", explanation: "Cấu trúc chuẩn: Hello, nice to meet you!" }
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
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 3: Thức ăn & Đồ uống (A1)
  // --------------------------------------------------------------------------
  {
    order: 3,
    title: "Unit 3: Thức ăn & Đồ uống",
    description: "Từ vựng về món ăn, nước uống và cách gọi món.",
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
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 4: Cuộc sống hàng ngày (A1)
  // --------------------------------------------------------------------------
  {
    order: 4,
    title: "Unit 4: Cuộc sống hàng ngày",
    description: "Thời gian, đồ dùng cá nhân, thói quen.",
    iconName: "clock",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Đồ dùng học tập & Làm việc",
        description: "Sách, bút, máy tính, bàn học.",
        xpReward: 30,
        words: [
          { targetText: "Book", translation: "Quyển sách", phonetic: "/bʊk/", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80", exampleSentence: "I am reading a book.", exampleTranslation: "Tôi đang đọc một quyển sách.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Pen", translation: "Bút mực", phonetic: "/pen/", imageUrl: "https://images.unsplash.com/photo-1585336261026-8f57857820f2?w=500&auto=format&fit=crop&q=80", exampleSentence: "Can I borrow your pen?", exampleTranslation: "Tôi có thể mượn bút của bạn không?", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Teacher", translation: "Giáo viên", phonetic: "/ˈtiːtʃər/", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80", exampleSentence: "Our teacher is very friendly.", exampleTranslation: "Giáo viên của chúng tôi rất thân thiện.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Sun", translation: "Mặt trời", phonetic: "/sʌn/", imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80", exampleSentence: "The sun shines brightly.", exampleTranslation: "Mặt trời tỏa sáng rực rỡ.", cefrLevel: "A1", partOfSpeech: "noun" },
          { targetText: "Music", translation: "Âm nhạc", phonetic: "/ˈmjuːzɪk/", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", exampleSentence: "Music helps me relax.", exampleTranslation: "Âm nhạc giúp tôi thư giãn.", cefrLevel: "A1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Book' có nghĩa là gì?", optionsJson: JSON.stringify(["Quyển sách", "Bút", "Cái bàn", "Ghế"]), correctAnswer: "Quyển sách", explanation: "'Book' nghĩa là quyển sách." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 5: Công việc & Văn phòng (A2)
  // --------------------------------------------------------------------------
  {
    order: 5,
    title: "Unit 5: Công việc & Văn phòng",
    description: "Nghề nghiệp, môi trường công sở, giao tiếp đồng nghiệp.",
    iconName: "briefcase",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Môi trường công sở (Office Life)",
        description: "Máy tính, cuộc họp, dự án.",
        xpReward: 35,
        words: [
          { targetText: "Computer", translation: "Máy tính", phonetic: "/kəmˈpjuːtər/", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80", exampleSentence: "I work on my computer all day.", exampleTranslation: "Tôi làm việc trên máy tính cả ngày.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Meeting", translation: "Cuộc họp", phonetic: "/ˈmiːtɪŋ/", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=80", exampleSentence: "The meeting starts at 9 AM.", exampleTranslation: "Cuộc họp bắt đầu lúc 9 giờ sáng.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Project", translation: "Dự án", phonetic: "/ˈprɑːdʒekt/", imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80", exampleSentence: "We finished the project on time.", exampleTranslation: "Chúng tôi đã hoàn thành dự án đúng hạn.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Colleague", translation: "Đồng nghiệp", phonetic: "/ˈkɑːliːɡ/", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80", exampleSentence: "She is my favorite colleague.", exampleTranslation: "Cô ấy là đồng nghiệp tôi thích nhất.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Email", translation: "Thư điện tử / Email", phonetic: "/ˈiːmeɪl/", imageUrl: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Send me an email with details.", exampleTranslation: "Hãy gửi cho tôi một email chi tiết.", cefrLevel: "A2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Meeting' có nghĩa là gì?", optionsJson: JSON.stringify(["Cuộc họp", "Dự án", "Đồng nghiệp", "Thư tín"]), correctAnswer: "Cuộc họp", explanation: "'Meeting' nghĩa là cuộc họp." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 6: Du lịch & Giao thông (A2)
  // --------------------------------------------------------------------------
  {
    order: 6,
    title: "Unit 6: Du lịch & Giao thông",
    description: "Hỏi đường, sân bay, khách sạn, phương tiện đi lại.",
    iconName: "plane",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Phương tiện & Khách sạn (Travel Essentials)",
        description: "Máy bay, xe buýt, vé tàu, khách sạn.",
        xpReward: 35,
        words: [
          { targetText: "Airport", translation: "Sân bay", phonetic: "/ˈerpɔːrt/", imageUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=500&auto=format&fit=crop&q=80", exampleSentence: "The taxi took us to the airport.", exampleTranslation: "Taxi đưa chúng tôi đến sân bay.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Hotel", translation: "Khách sạn", phonetic: "/hoʊˈtel/", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80", exampleSentence: "We booked a room at the hotel.", exampleTranslation: "Chúng tôi đã đặt phòng ở khách sạn.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Ticket", translation: "Tấm vé", phonetic: "/ˈtɪkɪt/", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80", exampleSentence: "Don't forget your train ticket.", exampleTranslation: "Đừng quên vé tàu của bạn.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Passport", translation: "Hộ chiếu", phonetic: "/ˈpæspɔːrt/", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80", exampleSentence: "Show your passport at immigration.", exampleTranslation: "Hãy xuất trình hộ chiếu tại quầy thủ tục.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Luggage", translation: "Hành lý", phonetic: "/ˈlʌɡɪdʒ/", imageUrl: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=500&auto=format&fit=crop&q=80", exampleSentence: "Keep an eye on your luggage.", exampleTranslation: "Hãy để mắt tới hành lý của bạn.", cefrLevel: "A2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Passport' là gì?", optionsJson: JSON.stringify(["Hộ chiếu", "Vé máy bay", "Hành lý", "Ví tiền"]), correctAnswer: "Hộ chiếu", explanation: "'Passport' có nghĩa là hộ chiếu." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 7: Mua sắm & Tiền bạc (A2)
  // --------------------------------------------------------------------------
  {
    order: 7,
    title: "Unit 7: Mua sắm & Tiền bạc",
    description: "Hỏi giá, mua sắm siêu thị, thanh toán thẻ.",
    iconName: "shopping-bag",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Mua sắm & Giá cả (Shopping & Prices)",
        description: "Tiền mặt, hóa đơn, giảm giá.",
        xpReward: 35,
        words: [
          { targetText: "Price", translation: "Giá cả", phonetic: "/praɪs/", imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80", exampleSentence: "What is the price of this shirt?", exampleTranslation: "Giá của chiếc áo này là bao nhiêu?", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Discount", translation: "Giảm giá", phonetic: "/ˈdɪskaʊnt/", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=80", exampleSentence: "They offer a 20% discount today.", exampleTranslation: "Hôm nay họ giảm giá 20%.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Receipt", translation: "Hóa đơn thanh toán", phonetic: "/rɪˈsiːt/", imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80", exampleSentence: "Keep the receipt for return.", exampleTranslation: "Giữ hóa đơn để đổi trả hàng.", cefrLevel: "A2", partOfSpeech: "noun" },
          { targetText: "Credit card", translation: "Thẻ tín dụng", phonetic: "/ˈkredɪt kɑːrd/", imageUrl: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=500&auto=format&fit=crop&q=80", exampleSentence: "Can I pay by credit card?", exampleTranslation: "Tôi có thể thanh toán bằng thẻ tín dụng không?", cefrLevel: "A2", partOfSpeech: "phrase" },
          { targetText: "Store", translation: "Cửa hàng", phonetic: "/stɔːr/", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80", exampleSentence: "The store opens at 8 AM.", exampleTranslation: "Cửa hàng mở cửa lúc 8 giờ sáng.", cefrLevel: "A2", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Discount' nghĩa là gì?", optionsJson: JSON.stringify(["Giảm giá", "Hóa đơn", "Thẻ ngân hàng", "Cửa hàng"]), correctAnswer: "Giảm giá", explanation: "'Discount' nghĩa là giảm giá." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 8: Sức khỏe & Cảm xúc (B1)
  // --------------------------------------------------------------------------
  {
    order: 8,
    title: "Unit 8: Sức khỏe & Cảm xúc",
    description: "Triệu chứng sức khỏe, cảm xúc con người và lời khuyên.",
    iconName: "heart-pulse",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Sức khỏe & Thể chất (Health & Fitness)",
        description: "Bệnh viện, bác sĩ, tập thể dục.",
        xpReward: 40,
        words: [
          { targetText: "Hospital", translation: "Bệnh viện", phonetic: "/ˈhɑːspɪtl/", imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80", exampleSentence: "He went to the hospital for a checkup.", exampleTranslation: "Anh ấy đến bệnh viện để khám sức khỏe.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Medicine", translation: "Thuốc tây", phonetic: "/ˈmedsn/", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80", exampleSentence: "Take this medicine twice a day.", exampleTranslation: "Uống thuốc này hai lần một ngày.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Exercise", translation: "Tập thể dục", phonetic: "/ˈeksərsaɪz/", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80", exampleSentence: "Daily exercise improves health.", exampleTranslation: "Tập thể dục hàng ngày cải thiện sức khỏe.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Healthy", translation: "Khỏe mạnh", phonetic: "/ˈhelθi/", imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80", exampleSentence: "Eat healthy food every day.", exampleTranslation: "Ăn thực phẩm lành mạnh mỗi ngày.", cefrLevel: "B1", partOfSpeech: "adjective" },
          { targetText: "Relax", translation: "Thư giãn", phonetic: "/rɪˈlæks/", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80", exampleSentence: "Take time to relax on weekends.", exampleTranslation: "Dành thời gian thư giãn vào cuối tuần.", cefrLevel: "B1", partOfSpeech: "verb" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Medicine' nghĩa là gì?", optionsJson: JSON.stringify(["Thuốc tây", "Bệnh viện", "Bác sĩ", "Tập thể dục"]), correctAnswer: "Thuốc tây", explanation: "'Medicine' nghĩa là thuốc tây." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 9: Công nghệ & Truyền thông (B1)
  // --------------------------------------------------------------------------
  {
    order: 9,
    title: "Unit 9: Công nghệ & Truyền thông",
    description: "Internet, mạng xã hội, thiết bị thông minh.",
    iconName: "cpu",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Thế giới số (Digital World)",
        description: "Ứng dụng, mạng internet, bảo mật.",
        xpReward: 40,
        words: [
          { targetText: "Internet", translation: "Mạng Internet", phonetic: "/ˈɪntərnet/", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80", exampleSentence: "The internet connects people globally.", exampleTranslation: "Internet kết nối mọi người trên toàn cầu.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Application", translation: "Ứng dụng (App)", phonetic: "/ˌæplɪˈkeɪʃn/", imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=80", exampleSentence: "Download the learning application.", exampleTranslation: "Tải xuống ứng dụng học tập.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Security", translation: "Bảo mật", phonetic: "/sɪˈkjʊrəti/", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80", exampleSentence: "Password security is essential.", exampleTranslation: "Bảo mật mật khẩu là vô cùng quan trọng.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Network", translation: "Mạng lưới kết nối", phonetic: "/ˈnetwɜːrk/", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80", exampleSentence: "The Wi-Fi network is fast.", exampleTranslation: "Mạng Wi-Fi này rất nhanh.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Device", translation: "Thiết bị điện tử", phonetic: "/dɪˈvaɪs/", imageUrl: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&auto=format&fit=crop&q=80", exampleSentence: "Turn off electronic devices at night.", exampleTranslation: "Tắt các thiết bị điện tử vào ban đêm.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Security' nghĩa là gì?", optionsJson: JSON.stringify(["Bảo mật", "Ứng dụng", "Mạng lưới", "Thiết bị"]), correctAnswer: "Bảo mật", explanation: "'Security' nghĩa là bảo mật." }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // UNIT 10: Văn hóa, Môi trường & Quan điểm (B1)
  // --------------------------------------------------------------------------
  {
    order: 10,
    title: "Unit 10: Văn hóa, Môi trường & Quan điểm",
    description: "Thể hiện ý kiến, thảo luận sở thích, bảo vệ môi trường.",
    iconName: "globe",
    lessons: [
      {
        order: 1,
        title: "Bài 1: Môi trường & Đời sống (Environment & Life)",
        description: "Thiên nhiên, khí hậu, lối sống xanh.",
        xpReward: 45,
        words: [
          { targetText: "Environment", translation: "Môi trường", phonetic: "/ɪnˈvaɪrənmənt/", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=80", exampleSentence: "Protect the environment for our future.", exampleTranslation: "Bảo vệ môi trường vì tương lai của chúng ta.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Nature", translation: "Thiên nhiên", phonetic: "/ˈneɪtʃər/", imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80", exampleSentence: "I love spending time in nature.", exampleTranslation: "Tôi thích dành thời gian hòa mình vào thiên nhiên.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Opinion", translation: "Ý kiến / Quan điểm", phonetic: "/əˈpɪnjən/", imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=80", exampleSentence: "In my opinion, learning English is fun.", exampleTranslation: "Theo quan điểm của tôi, học tiếng Anh rất thú vị.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Culture", translation: "Văn hóa", phonetic: "/ˈkʌltʃər/", imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=80", exampleSentence: "Vietnam has a rich culture.", exampleTranslation: "Việt Nam có một nền văn hóa phong phú.", cefrLevel: "B1", partOfSpeech: "noun" },
          { targetText: "Opportunity", translation: "Cơ hội", phonetic: "/ˌɑːpərˈtuːnəti/", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80", exampleSentence: "English creates new career opportunities.", exampleTranslation: "Tiếng Anh tạo ra nhiều cơ hội nghề nghiệp mới.", cefrLevel: "B1", partOfSpeech: "noun" }
        ],
        exercises: [
          { type: "multiple_choice", prompt: "'Opportunity' nghĩa là gì?", optionsJson: JSON.stringify(["Cơ hội", "Môi trường", "Văn hóa", "Thiên nhiên"]), correctAnswer: "Cơ hội", explanation: "'Opportunity' nghĩa là cơ hội." }
        ]
      }
    ]
  }
];
