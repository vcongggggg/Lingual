/**
 * LINGUAFLOW UNIVERSAL MASTER DATASET
 * 16 Thematic Categories • CEFR A1 -> C1 • 60+ Scramble Sentences • Wordle Dictionary • Smart Distractors
 */

export interface MasterWord {
  id: string;
  word: string;
  meaningVi: string;
  phoneticUs: string;
  phoneticUk?: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  category: string;
  definitionEn: string;
  exampleEn: string;
  exampleVi: string;
  imageUrl?: string;
}

export interface ScrambleSentence {
  id: string;
  sentence: string;
  fullSentence: string;
  tokens: string[];
  translation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  category: string;
}

export interface WordleTarget {
  word: string;
  meaningVi: string;
  phoneticUs: string;
  hint: string;
  category: string;
}

// ============================================================================
// 1. MASTER VOCABULARY BANK (16 RICH THEMATIC CATEGORIES)
// ============================================================================
export const UNIVERSAL_VOCABULARY: MasterWord[] = [
  // --- 1. DAILY LIFE & HABITS ---
  { id: 'v-daily-1', word: 'morning', meaningVi: 'buổi sáng', phoneticUs: '/ˈmɔːrnɪŋ/', pos: 'noun', cefr: 'A1', category: 'Daily Life', definitionEn: 'the early part of the day from sunrise to noon', exampleEn: 'I wake up at six in the morning.', exampleVi: 'Tôi thức dậy lúc sáu giờ sáng.' },
  { id: 'v-daily-2', word: 'routine', meaningVi: 'thói quen hàng ngày', phoneticUs: '/ruːˈtiːn/', pos: 'noun', cefr: 'A2', category: 'Daily Life', definitionEn: 'a sequence of actions regularly followed', exampleEn: 'A healthy morning routine boosts energy.', exampleVi: 'Một thói quen buổi sáng lành mạnh giúp tăng cường năng lượng.' },
  { id: 'v-daily-3', word: 'breakfast', meaningVi: 'bữa ăn sáng', phoneticUs: '/ˈbrekfəst/', pos: 'noun', cefr: 'A1', category: 'Daily Life', definitionEn: 'the first meal of the day', exampleEn: 'Never skip breakfast before work.', exampleVi: 'Đừng bao giờ bỏ bữa sáng trước khi đi làm.' },
  { id: 'v-daily-4', word: 'habit', meaningVi: 'thói quen', phoneticUs: '/ˈhæbɪt/', pos: 'noun', cefr: 'A2', category: 'Daily Life', definitionEn: 'a settled or regular tendency or practice', exampleEn: 'Reading books is a rewarding habit.', exampleVi: 'Đọc sách là một thói quen rất bổ ích.' },
  { id: 'v-daily-5', word: 'alarm', meaningVi: 'chuông báo thức', phoneticUs: '/əˈlɑːrm/', pos: 'noun', cefr: 'A1', category: 'Daily Life', definitionEn: 'an apparatus that sounds a warning or signal to wake up', exampleEn: 'My alarm goes off at 6:30 AM.', exampleVi: 'Chuông báo thức của tôi reo lúc 6 giờ 30 sáng.' },
  { id: 'v-daily-6', word: 'exercise', meaningVi: 'tập thể dục', phoneticUs: '/ˈeksərsaɪz/', pos: 'verb', cefr: 'A1', category: 'Daily Life', definitionEn: 'activity requiring physical effort carried out to sustain health', exampleEn: 'They exercise in the park every dawn.', exampleVi: 'Họ tập thể dục trong công viên vào mỗi sáng sớm.' },
  { id: 'v-daily-7', word: 'commute', meaningVi: 'đi làm / đi lại hàng ngày', phoneticUs: '/kəˈmjuːt/', pos: 'verb', cefr: 'B1', category: 'Daily Life', definitionEn: 'travel some distance between one’s home and place of work on a regular basis', exampleEn: 'She commutes to downtown by electric metro.', exampleVi: 'Cô ấy đi làm vào trung tâm thành phố bằng tàu điện ngầm.' },
  { id: 'v-daily-8', word: 'relax', meaningVi: 'thư giãn, nghỉ ngơi', phoneticUs: '/rɪˈlæks/', pos: 'verb', cefr: 'A1', category: 'Daily Life', definitionEn: 'make or become less tense or anxious', exampleEn: 'I like to relax with soft music after dinner.', exampleVi: 'Tôi thích thư giãn với âm nhạc êm dịu sau bữa tối.' },

  // --- 2. TRAVEL & AVIATION ---
  { id: 'v-travel-1', word: 'airport', meaningVi: 'sân bay', phoneticUs: '/ˈerpɔːrt/', pos: 'noun', cefr: 'A1', category: 'Travel', definitionEn: 'a complex of runways and buildings for the takeoff, landing, and maintenance of civil aircraft', exampleEn: 'We arrived at the international airport two hours early.', exampleVi: 'Chúng tôi đến sân bay quốc tế trước hai tiếng.' },
  { id: 'v-travel-2', word: 'passport', meaningVi: 'hộ chiếu', phoneticUs: '/ˈpæspɔːrt/', pos: 'noun', cefr: 'A1', category: 'Travel', definitionEn: 'an official document certifying identity and citizenship for international travel', exampleEn: 'Please present your passport at immigration.', exampleVi: 'Vui lòng xuất trình hộ chiếu tại quầy xuất nhập cảnh.' },
  { id: 'v-travel-3', word: 'boarding', meaningVi: 'sự lên máy bay', phoneticUs: '/ˈbɔːrdɪŋ/', pos: 'noun', cefr: 'A2', category: 'Travel', definitionEn: 'the action of getting on or into a ship, aircraft, or other vehicle', exampleEn: 'Boarding begins thirty minutes prior to departure.', exampleVi: 'Việc lên máy bay bắt đầu ba mươi phút trước giờ cất cánh.' },
  { id: 'v-travel-4', word: 'luggage', meaningVi: 'hành lý', phoneticUs: '/ˈlʌɡɪdʒ/', pos: 'noun', cefr: 'A2', category: 'Travel', definitionEn: 'suitcases or other bags in which to pack personal belongings for traveling', exampleEn: 'Collect your checked luggage at carousel number four.', exampleVi: 'Nhận hành lý ký gửi của bạn tại băng chuyền số 4.' },
  { id: 'v-travel-5', word: 'destination', meaningVi: 'điểm đến, đích đến', phoneticUs: '/ˌdestɪˈneɪʃn/', pos: 'noun', cefr: 'B1', category: 'Travel', definitionEn: 'the place to which someone or something is going or being sent', exampleEn: 'Da Nang is a world-famous tourist destination.', exampleVi: 'Đà Nẵng là một điểm đến du lịch nổi tiếng thế giới.' },
  { id: 'v-travel-6', word: 'itinerary', meaningVi: 'lịch trình chuyến đi', phoneticUs: '/aɪˈtɪnəreri/', pos: 'noun', cefr: 'B2', category: 'Travel', definitionEn: 'a planned route or journey', exampleEn: 'Our travel itinerary includes Tokyo, Kyoto, and Osaka.', exampleVi: 'Lịch trình du lịch của chúng tôi gồm Tokyo, Kyoto và Osaka.' },
  { id: 'v-travel-7', word: 'departure', meaningVi: 'giờ khởi hành / sự khởi hành', phoneticUs: '/dɪˈpɑːrtʃər/', pos: 'noun', cefr: 'A2', category: 'Travel', definitionEn: 'the action of leaving, especially to start a journey', exampleEn: 'Flight departure has been rescheduled to 8:15 PM.', exampleVi: 'Giờ khởi hành chuyến bay đã được đổi sang 8:15 tối.' },
  { id: 'v-travel-8', word: 'souvenir', meaningVi: 'quà lưu niệm', phoneticUs: '/ˌsuːvəˈnɪr/', pos: 'noun', cefr: 'A2', category: 'Travel', definitionEn: 'a thing that is kept as a reminder of a person, place, or event', exampleEn: 'I bought traditional coffee as a souvenir.', exampleVi: 'Tôi đã mua cà phê truyền thống làm quà lưu niệm.' },

  // --- 3. BUSINESS & WORKPLACE ---
  { id: 'v-biz-1', word: 'colleague', meaningVi: 'đồng nghiệp', phoneticUs: '/ˈkɑːliːɡ/', pos: 'noun', cefr: 'A2', category: 'Business', definitionEn: 'a person with whom one works in a profession or business', exampleEn: 'She gets along well with all her colleagues.', exampleVi: 'Cô ấy hòa đồng rất tốt với tất cả đồng nghiệp của mình.' },
  { id: 'v-biz-2', word: 'meeting', meaningVi: 'cuộc họp', phoneticUs: '/ˈmiːtɪŋ/', pos: 'noun', cefr: 'A1', category: 'Business', definitionEn: 'an assembly of people for a particular purpose, especially for formal discussion', exampleEn: 'The weekly strategy meeting starts at 9:00 AM sharp.', exampleVi: 'Cuộc họp chiến lược hàng tuần bắt đầu đúng 9:00 sáng.' },
  { id: 'v-biz-3', word: 'deadline', meaningVi: 'hạn chót', phoneticUs: '/ˈdedlaɪn/', pos: 'noun', cefr: 'B1', category: 'Business', definitionEn: 'the latest time or date by which something should be completed', exampleEn: 'We must submit the proposal before the strict deadline.', exampleVi: 'Chúng ta phải nộp bản đề xuất trước hạn chót nghiêm ngặt.' },
  { id: 'v-biz-4', word: 'collaborate', meaningVi: 'hợp tác, cộng tác', phoneticUs: '/kəˈlæbəreɪt/', pos: 'verb', cefr: 'B2', category: 'Business', definitionEn: 'work jointly on an activity or project to produce or create something', exampleEn: 'Designers and developers collaborate closely.', exampleVi: 'Các nhà thiết kế và lập trình viên hợp tác chặt chẽ với nhau.' },
  { id: 'v-biz-5', word: 'negotiate', meaningVi: 'thương lượng, đàm phán', phoneticUs: '/nɪˈɡoʊʃieɪt/', pos: 'verb', cefr: 'B2', category: 'Business', definitionEn: 'obtain or bring about by discussion with another party', exampleEn: 'The team successfully negotiated favorable contract terms.', exampleVi: 'Đội ngũ đã đàm phán thành công các điều khoản hợp đồng thuận lợi.' },
  { id: 'v-biz-6', word: 'productivity', meaningVi: 'năng suất làm việc', phoneticUs: '/ˌproʊdʌkˈtɪvəti/', pos: 'noun', cefr: 'B2', category: 'Business', definitionEn: 'the effectiveness of productive effort, especially in industry', exampleEn: 'Ergonomic workspaces significantly enhance team productivity.', exampleVi: 'Không gian làm việc công thái học cải thiện đáng kể năng suất của nhóm.' },
  { id: 'v-biz-7', word: 'presentation', meaningVi: 'bài thuyết trình', phoneticUs: '/ˌpriːzenˈteɪʃn/', pos: 'noun', cefr: 'B1', category: 'Business', definitionEn: 'a speech or talk in which a new product, idea, or piece of work is shown and explained', exampleEn: 'His keynote presentation impressed the foreign investors.', exampleVi: 'Bài thuyết trình chủ đạo của anh ấy gây ấn tượng mạnh với các nhà đầu tư nước ngoài.' },
  { id: 'v-biz-8', word: 'strategy', meaningVi: 'chiến lược', phoneticUs: '/ˈstrætədʒi/', pos: 'noun', cefr: 'B1', category: 'Business', definitionEn: 'a plan of action designed to achieve a long-term or overall aim', exampleEn: 'The company launched an aggressive digital marketing strategy.', exampleVi: 'Công ty đã triển khai một chiến lược tiếp thị số quyết liệt.' },

  // --- 4. TECHNOLOGY & AI ---
  { id: 'v-tech-1', word: 'algorithm', meaningVi: 'thuật toán', phoneticUs: '/ˈælɡərɪðəm/', pos: 'noun', cefr: 'B2', category: 'Technology', definitionEn: 'a process or set of rules to be followed in calculations or problem-solving operations', exampleEn: 'Machine learning algorithms detect patterns in large datasets.', exampleVi: 'Thuật toán học máy phát hiện các quy luật trong các tập dữ liệu lớn.' },
  { id: 'v-tech-2', word: 'database', meaningVi: 'cơ sở dữ liệu', phoneticUs: '/ˈdeɪtəbeɪs/', pos: 'noun', cefr: 'B1', category: 'Technology', definitionEn: 'a structured set of data held in a computer, especially one accessible in various ways', exampleEn: 'PostgreSQL provides robust relational database management.', exampleVi: 'PostgreSQL cung cấp khả năng quản lý cơ sở dữ liệu quan hệ mạnh mẽ.' },
  { id: 'v-tech-3', word: 'security', meaningVi: 'bảo mật, an toàn', phoneticUs: '/sɪˈkjʊrəti/', pos: 'noun', cefr: 'B1', category: 'Technology', definitionEn: 'the state of being free from danger or threat', exampleEn: 'Multi-factor authentication guarantees account security.', exampleVi: 'Xác thực đa yếu tố đảm bảo an toàn cho tài khoản.' },
  { id: 'v-tech-4', word: 'interface', meaningVi: 'giao diện người dùng', phoneticUs: '/ˈɪntərfeɪs/', pos: 'noun', cefr: 'B2', category: 'Technology', definitionEn: 'a point where two systems, subjects, organizations, etc. meet and interact', exampleEn: 'Clean visual interfaces improve user retention.', exampleVi: 'Giao diện trực quan sạch đẹp cải thiện tỷ lệ giữ chân người dùng.' },
  { id: 'v-tech-5', word: 'automation', meaningVi: 'tự động hóa', phoneticUs: '/ˌɔːtəˈmeɪʃn/', pos: 'noun', cefr: 'B2', category: 'Technology', definitionEn: 'the use of largely automatic equipment in a system of manufacturing or other production process', exampleEn: 'Workflow automation saves hours of repetitive labor.', exampleVi: 'Tự động hóa quy trình làm việc tiết kiệm hàng giờ lao động lặp đi lặp lại.' },
  { id: 'v-tech-6', word: 'network', meaningVi: 'mạng lưới kết nối', phoneticUs: '/ˈnetwɜːrk/', pos: 'noun', cefr: 'A2', category: 'Technology', definitionEn: 'an arrangement of intersecting horizontal and vertical lines or interconnected computers', exampleEn: 'High-speed wireless networks power smart cities.', exampleVi: 'Mạng không dây tốc độ cao vận hành các thành phố thông minh.' },
  { id: 'v-tech-7', word: 'bandwidth', meaningVi: 'băng thông', phoneticUs: '/ˈbændwɪdθ/', pos: 'noun', cefr: 'B2', category: 'Technology', definitionEn: 'the range of frequencies within a given band, in particular that used for transmitting a signal', exampleEn: 'Video streaming platforms require substantial server bandwidth.', exampleVi: 'Các nền tảng phát video trực tuyến đòi hỏi băng thông máy chủ rất lớn.' },
  { id: 'v-tech-8', word: 'encryption', meaningVi: 'mã hóa dữ liệu', phoneticUs: '/ɪnˈkrɪpʃn/', pos: 'noun', cefr: 'C1', category: 'Technology', definitionEn: 'the process of converting information or data into a code, especially to prevent unauthorized access', exampleEn: 'End-to-end encryption protects private chat messages.', exampleVi: 'Mã hóa đầu cuối bảo vệ các tin nhắn trò chuyện riêng tư.' },

  // --- 5. FOOD, DINING & COOKING ---
  { id: 'v-food-1', word: 'delicious', meaningVi: 'thơm ngon', phoneticUs: '/dɪˈlɪʃəs/', pos: 'adjective', cefr: 'A1', category: 'Food', definitionEn: 'highly pleasant to the taste', exampleEn: 'Vietnamese beef noodle soup is universally delicious.', exampleVi: 'Phở bò Việt Nam thơm ngon nức tiếng khắp thế giới.' },
  { id: 'v-food-2', word: 'recipe', meaningVi: 'công thức nấu ăn', phoneticUs: '/ˈresəpi/', pos: 'noun', cefr: 'A2', category: 'Food', definitionEn: 'a set of instructions for preparing a particular dish, including a list of the ingredients required', exampleEn: 'Follow this authentic recipe to bake homemade bread.', exampleVi: 'Hãy làm theo công thức chuẩn này để nướng bánh mì tại nhà.' },
  { id: 'v-food-3', word: 'ingredient', meaningVi: 'nguyên liệu thực phẩm', phoneticUs: '/ɪnˈɡriːdiənt/', pos: 'noun', cefr: 'B1', category: 'Food', definitionEn: 'any of the foods or substances that are combined to make a particular dish', exampleEn: 'Fresh local herbs are the secret ingredients of the soup.', exampleVi: 'Rau thơm tươi bản địa là những nguyên liệu bí mật của món canh.' },
  { id: 'v-food-4', word: 'flavor', meaningVi: 'hương vị', phoneticUs: '/ˈfleɪvər/', pos: 'noun', cefr: 'A2', category: 'Food', definitionEn: 'the distinctive taste of a food or drink', exampleEn: 'Chili peppers impart an intense spicy flavor.', exampleVi: 'Ớt mang lại một hương vị cay nồng đậm đà.' },
  { id: 'v-food-5', word: 'nutrition', meaningVi: 'dinh dưỡng', phoneticUs: '/nuːˈtrɪʃn/', pos: 'noun', cefr: 'B2', category: 'Food', definitionEn: 'the process of providing or obtaining the food necessary for health and growth', exampleEn: 'A balanced diet ensures optimal daily nutrition.', exampleVi: 'Một chế độ ăn cân đối đảm bảo dinh dưỡng tối ưu mỗi ngày.' },
  { id: 'v-food-6', word: 'beverage', meaningVi: 'đồ uống', phoneticUs: '/ˈbevərɪdʒ/', pos: 'noun', cefr: 'B1', category: 'Food', definitionEn: 'a drink, especially one other than water', exampleEn: 'The café serves refreshing iced beverages during hot summer days.', exampleVi: 'Quán cà phê phục vụ đồ uống đá sảng khoái vào những ngày hè nóng nực.' },
  { id: 'v-food-7', word: 'appetizer', meaningVi: 'món khai vị', phoneticUs: '/ˈæpɪtaɪzər/', pos: 'noun', cefr: 'B1', category: 'Food', definitionEn: 'a small dish of food or a drink taken before a meal or the main course of a meal to stimulate one’s appetite', exampleEn: 'Crispy spring rolls were served as the first appetizer.', exampleVi: 'Nem rán giòn rụm được phục vụ như món khai vị đầu tiên.' },
  { id: 'v-food-8', word: 'gourmet', meaningVi: 'ẩm thực cao cấp, sành điệu', phoneticUs: '/ɡʊrˈmeɪ/', pos: 'adjective', cefr: 'B2', category: 'Food', definitionEn: 'relating to or characteristic of the highest culinary quality', exampleEn: 'The five-star hotel features a gourmet seafood bistro.', exampleVi: 'Khách sạn 5 sao sở hữu một nhà hàng hải sản cao cấp sành điệu.' },

  // --- 6. HEALTH & MEDICINE ---
  { id: 'v-health-1', word: 'hospital', meaningVi: 'bệnh viện', phoneticUs: '/ˈhɑːspɪtl/', pos: 'noun', cefr: 'A1', category: 'Health', definitionEn: 'an institution providing medical and surgical treatment and nursing care for sick or injured people', exampleEn: 'He works as an emergency doctor at the central hospital.', exampleVi: 'Anh ấy làm bác sĩ cấp cứu tại bệnh viện trung ương.' },
  { id: 'v-health-2', word: 'medicine', meaningVi: 'thuốc chữa bệnh', phoneticUs: '/ˈmedsn/', pos: 'noun', cefr: 'A1', category: 'Health', definitionEn: 'a compound or preparation used for the treatment or prevention of disease', exampleEn: 'Take this prescribed medicine twice daily after meals.', exampleVi: 'Uống loại thuốc được kê đơn này hai lần mỗi ngày sau bữa ăn.' },
  { id: 'v-health-3', word: 'symptom', meaningVi: 'triệu chứng', phoneticUs: '/ˈsɪmptəm/', pos: 'noun', cefr: 'B1', category: 'Health', definitionEn: 'a physical or mental feature which is regarded as indicating a condition of disease', exampleEn: 'A persistent cough is a common symptom of the flu.', exampleVi: 'Ho dai dẳng là một triệu chứng phổ biến của bệnh cúm.' },
  { id: 'v-health-4', word: 'recovery', meaningVi: 'sự hồi phục sức khỏe', phoneticUs: '/rɪˈkʌvəri/', pos: 'noun', cefr: 'B1', category: 'Health', definitionEn: 'a return to a normal state of health, mind, or strength', exampleEn: 'Adequate sleep accelerates physical recovery after injury.', exampleVi: 'Ngủ đủ giấc giúp đẩy nhanh quá trình hồi phục thể chất sau chấn thương.' },
  { id: 'v-health-5', word: 'treatment', meaningVi: 'phương pháp điều trị', phoneticUs: '/ˈtriːtmənt/', pos: 'noun', cefr: 'B1', category: 'Health', definitionEn: 'medical care given to a patient for an illness or injury', exampleEn: 'Early diagnosis leads to more effective treatment.', exampleVi: 'Chẩn đoán sớm giúp việc điều trị đạt hiệu quả cao hơn.' },
  { id: 'v-health-6', word: 'vaccine', meaningVi: 'vắc-xin phòng bệnh', phoneticUs: '/vækˈsiːn/', pos: 'noun', cefr: 'B1', category: 'Health', definitionEn: 'a substance used to stimulate the production of antibodies and provide immunity against diseases', exampleEn: 'Vaccines safeguard public health against contagious viruses.', exampleVi: 'Vắc-xin bảo vệ sức khỏe cộng đồng trước các virus truyền nhiễm.' },
  { id: 'v-health-7', word: 'prescription', meaningVi: 'đơn thuốc, toa thuốc', phoneticUs: '/prɪˈskrɪpʃn/', pos: 'noun', cefr: 'B2', category: 'Health', definitionEn: 'an instruction written by a medical practitioner authorizing medicine', exampleEn: 'You need a doctor’s prescription to purchase these antibiotics.', exampleVi: 'Bạn cần đơn thuốc của bác sĩ để mua loại kháng sinh này.' },
  { id: 'v-health-8', word: 'resilience', meaningVi: 'khả năng phục hồi, sức bật dẻo dai', phoneticUs: '/rɪˈzɪliəns/', pos: 'noun', cefr: 'C1', category: 'Health', definitionEn: 'the capacity to recover quickly from difficulties; toughness', exampleEn: 'Athletes develop both mental and physical resilience.', exampleVi: 'Vận động viên phát triển cả sự dẻo dai về tinh thần lẫn thể chất.' },

  // --- 7. ENVIRONMENT & NATURE ---
  { id: 'v-env-1', word: 'ecosystem', meaningVi: 'hệ sinh thái', phoneticUs: '/ˈiːkoʊsɪstəm/', pos: 'noun', cefr: 'B1', category: 'Environment', definitionEn: 'a biological community of interacting organisms and their physical environment', exampleEn: 'Coral reefs host the most biodiverse marine ecosystems.', exampleVi: 'Rạn san hô là nơi có các hệ sinh thái biển đa dạng sinh học nhất.' },
  { id: 'v-env-2', word: 'sustainable', meaningVi: 'bền vững, thân thiện môi trường', phoneticUs: '/səˈsteɪnəbl/', pos: 'adjective', cefr: 'B2', category: 'Environment', definitionEn: 'able to be maintained at a certain rate without depleting natural resources', exampleEn: 'Solar panels offer sustainable clean energy.', exampleVi: 'Tấm pin năng lượng mặt trời cung cấp năng lượng sạch bền vững.' },
  { id: 'v-env-3', word: 'conservation', meaningVi: 'sự bảo tồn thiên nhiên', phoneticUs: '/ˌkɑːnsərˈveɪʃn/', pos: 'noun', cefr: 'B2', category: 'Environment', definitionEn: 'the protection of animals, plants, and natural resources', exampleEn: 'Wildlife conservation protects endangered snow leopards.', exampleVi: 'Bảo tồn động vật hoang dã bảo vệ loài báo tuyết đang có nguy cơ tuyệt chủng.' },
  { id: 'v-env-4', word: 'pollution', meaningVi: 'sự ô nhiễm', phoneticUs: '/pəˈluːʃn/', pos: 'noun', cefr: 'A2', category: 'Environment', definitionEn: 'the presence in or introduction into the environment of a substance or thing that has harmful or poisonous effects', exampleEn: 'Reducing vehicle exhaust cuts urban air pollution.', exampleVi: 'Giảm khí thải phương tiện giúp cắt giảm ô nhiễm không khí đô thị.' },
  { id: 'v-env-5', word: 'renewable', meaningVi: 'có thể tái tạo', phoneticUs: '/rɪˈnuːəbl/', pos: 'adjective', cefr: 'B1', category: 'Environment', definitionEn: 'not depleted by use, such as water, wind, or solar power', exampleEn: 'Wind and hydro are leading renewable resources.', exampleVi: 'Gió và thủy điện là những nguồn tài nguyên tái tạo hàng đầu.' },
  { id: 'v-env-6', word: 'biodiversity', meaningVi: 'đa dạng sinh học', phoneticUs: '/ˌbaɪoʊdaɪˈvɜːrsəti/', pos: 'noun', cefr: 'C1', category: 'Environment', definitionEn: 'the variety of plant and animal life in the world or in a particular habitat', exampleEn: 'Tropical rainforests harbor immense terrestrial biodiversity.', exampleVi: 'Rừng mưa nhiệt đới lưu giữ sự đa dạng sinh học trên cạn vô cùng phong phú.' },
  { id: 'v-env-7', word: 'atmosphere', meaningVi: 'khí quyển, bầu không khí', phoneticUs: '/ˈætməsfɪr/', pos: 'noun', cefr: 'B1', category: 'Environment', definitionEn: 'the envelope of gases surrounding the earth or another planet', exampleEn: 'Greenhouse gases trap thermal radiation in the atmosphere.', exampleVi: 'Khí nhà kính giữ lại bức xạ nhiệt trong bầu khí quyển.' },
  { id: 'v-env-8', word: 'deforestation', meaningVi: 'nạn phá rừng', phoneticUs: '/ˌdiːˌfɔːrɪˈsteɪʃn/', pos: 'noun', cefr: 'B2', category: 'Environment', definitionEn: 'the action of clearing a wide area of trees', exampleEn: 'Deforestation causes severe habitat fragmentation for wild species.', exampleVi: 'Nạn phá rừng gây chia cắt nghiêm trọng môi trường sống của các loài hoang dã.' },

  // --- 8. ACADEMIC & IELTS HIGH-BAND (6.5 - 8.5) ---
  { id: 'v-ielts-1', word: 'ubiquitous', meaningVi: 'phổ biến khắp nơi, có mặt ở mọi nơi', phoneticUs: '/juːˈbɪkwɪtəs/', pos: 'adjective', cefr: 'C1', category: 'Academic IELTS', definitionEn: 'present, appearing, or found everywhere', exampleEn: 'Smartphones have become ubiquitous in modern society.', exampleVi: 'Điện thoại thông minh đã trở nên hiện diện ở khắp mọi nơi trong xã hội hiện đại.' },
  { id: 'v-ielts-2', word: 'scrutinize', meaningVi: 'xem xét kỹ lưỡng, soi xét', phoneticUs: '/ˈskruːtənaɪz/', pos: 'verb', cefr: 'C1', category: 'Academic IELTS', definitionEn: 'examine or inspect closely and thoroughly', exampleEn: 'Researchers carefully scrutinize the experimental data.', exampleVi: 'Các nhà nghiên cứu xem xét cực kỳ kỹ lưỡng dữ liệu thử nghiệm.' },
  { id: 'v-ielts-3', word: 'substantiate', meaningVi: 'chứng minh, xác thực bằng chứng cứ', phoneticUs: '/səbˈstænʃieɪt/', pos: 'verb', cefr: 'C1', category: 'Academic IELTS', definitionEn: 'provide evidence to support or prove the truth of', exampleEn: 'The scientist offered empirical figures to substantiate her hypothesis.', exampleVi: 'Nhà khoa học đưa ra các số liệu thực nghiệm để chứng minh giả thuyết của mình.' },
  { id: 'v-ielts-4', word: 'mitigate', meaningVi: 'giảm nhẹ, xoa dịu', phoneticUs: '/ˈmɪtɪɡeɪt/', pos: 'verb', cefr: 'B2', category: 'Academic IELTS', definitionEn: 'make less severe, serious, or painful', exampleEn: 'Planting coastal mangroves mitigates tidal erosion.', exampleVi: 'Trồng rừng ngập mặn ven biển giúp giảm nhẹ xói lở do thủy triều.' },
  { id: 'v-ielts-5', word: 'paramount', meaningVi: 'tối quan trọng, tối thượng', phoneticUs: '/ˈpærəmaʊnt/', pos: 'adjective', cefr: 'C1', category: 'Academic IELTS', definitionEn: 'more important than anything else; supreme', exampleEn: 'Ensuring passenger safety is of paramount importance.', exampleVi: 'Đảm bảo an toàn cho hành khách là điều có tầm quan trọng tối thượng.' },
  { id: 'v-ielts-6', word: 'plausible', meaningVi: 'hợp lý, đáng tin cậy', phoneticUs: '/ˈplɔːzəbl/', pos: 'adjective', cefr: 'B2', category: 'Academic IELTS', definitionEn: 'seeming reasonable or probable', exampleEn: 'He provided a plausible explanation for the discrepancy.', exampleVi: 'Anh ấy đã đưa ra một lời giải thích hợp lý cho sự chênh lệch đó.' },
  { id: 'v-ielts-7', word: 'paradigm', meaningVi: 'mô hình, hệ chuẩn mực', phoneticUs: '/ˈpærədaɪm/', pos: 'noun', cefr: 'C1', category: 'Academic IELTS', definitionEn: 'a typical example or pattern of something; a model', exampleEn: 'Artificial intelligence drives a fundamental paradigm shift in medicine.', exampleVi: 'Trí tuệ nhân tạo thúc đẩy một bước chuyển dịch hệ mô hình căn bản trong y học.' },
  { id: 'v-ielts-8', word: 'exacerbate', meaningVi: 'làm trầm trọng thêm', phoneticUs: '/ɪɡˈzæsərbeɪt/', pos: 'verb', cefr: 'C1', category: 'Academic IELTS', definitionEn: 'make a problem, bad situation, or negative feeling worse', exampleEn: 'Drought conditions exacerbate ongoing water shortages.', exampleVi: 'Tình trạng hạn hán làm trầm trọng thêm tình trạng thiếu nước đang diễn ra.' },

  // --- 9. SHOPPING & FINANCE ---
  { id: 'v-shop-1', word: 'discount', meaningVi: 'giảm giá, chiết khấu', phoneticUs: '/ˈdɪskaʊnt/', pos: 'noun', cefr: 'A2', category: 'Finance', definitionEn: 'a deduction from the usual cost of something', exampleEn: 'Students receive a 20% discount on public transportation.', exampleVi: 'Sinh viên được giảm giá 20% khi đi phương tiện công cộng.' },
  { id: 'v-shop-2', word: 'receipt', meaningVi: 'hóa đơn, biên lai', phoneticUs: '/rɪˈsiːt/', pos: 'noun', cefr: 'A2', category: 'Finance', definitionEn: 'a written acknowledgment that a specified article or sum of money has been received', exampleEn: 'Keep your purchase receipt for warranty claims.', exampleVi: 'Hãy giữ hóa đơn mua hàng của bạn để yêu cầu bảo hành.' },
  { id: 'v-shop-3', word: 'investment', meaningVi: 'khoản đầu tư', phoneticUs: '/ɪnˈvestmənt/', pos: 'noun', cefr: 'B1', category: 'Finance', definitionEn: 'the action or process of investing money for profit or material result', exampleEn: 'Real estate and index funds are popular long-term investments.', exampleVi: 'Bất động sản và quỹ chỉ số là những khoản đầu tư dài hạn phổ biến.' },
  { id: 'v-shop-4', word: 'currency', meaningVi: 'tiền tệ', phoneticUs: '/ˈkɜːrənsi/', pos: 'noun', cefr: 'B1', category: 'Finance', definitionEn: 'a system of money in common use in a particular country', exampleEn: 'The US dollar is a dominant global reserve currency.', exampleVi: 'Đồng đô la Mỹ là đồng tiền dự trữ chiếm ưu thế trên toàn cầu.' },
  { id: 'v-shop-5', word: 'bargain', meaningVi: 'món hời, giá rẻ bất ngờ', phoneticUs: '/ˈbɑːrɡən/', pos: 'noun', cefr: 'B1', category: 'Finance', definitionEn: 'a thing bought or offered for sale more cheaply than is usual or expected', exampleEn: 'I snagged a stylish winter jacket at a real bargain.', exampleVi: 'Tôi đã săn được một chiếc áo khoác mùa đông sành điệu với giá cực hời.' },
  { id: 'v-shop-6', word: 'transaction', meaningVi: 'giao dịch thanh toán', phoneticUs: '/trænˈzækʃn/', pos: 'noun', cefr: 'B2', category: 'Finance', definitionEn: 'an instance of buying or selling something; a business deal', exampleEn: 'Online transactions are confirmed within milliseconds.', exampleVi: 'Các giao dịch trực tuyến được xác nhận trong vòng vài phần nghìn giây.' },

  // --- 10. EDUCATION & LEARNING ---
  { id: 'v-edu-1', word: 'curriculum', meaningVi: 'chương trình giảng dạy', phoneticUs: '/kəˈrɪkjələm/', pos: 'noun', cefr: 'B2', category: 'Education', definitionEn: 'the subjects comprising a course of study in a school or college', exampleEn: 'The university updated its computer science curriculum.', exampleVi: 'Trường đại học đã cập nhật chương trình giảng dạy khoa học máy tính.' },
  { id: 'v-edu-2', word: 'scholarship', meaningVi: 'học bổng', phoneticUs: '/ˈskɑːlərʃɪp/', pos: 'noun', cefr: 'B1', category: 'Education', definitionEn: 'a grant or payment made to support a student’s education, awarded on the basis of academic achievement', exampleEn: 'She earned a full academic scholarship to study abroad in Melbourne.', exampleVi: 'Cô ấy đã giành được học bổng toàn phần để đi du học tại Melbourne.' },
  { id: 'v-edu-3', word: 'commencement', meaningVi: 'lễ tốt nghiệp đại học', phoneticUs: '/kəˈmensmənt/', pos: 'noun', cefr: 'C1', category: 'Education', definitionEn: 'a ceremony in which degrees or diplomas are conferred on graduating students', exampleEn: 'Graduates tossed their caps during the commencement ceremony.', exampleVi: 'Các tân cử nhân đã tung mũ trong buổi lễ tốt nghiệp đại học.' },
  { id: 'v-edu-4', word: 'assignment', meaningVi: 'bài tập được giao', phoneticUs: '/əˈsaɪnmənt/', pos: 'noun', cefr: 'A2', category: 'Education', definitionEn: 'a task or piece of work assigned to someone as part of a job or course of study', exampleEn: 'Submit your group essay assignment before midnight Friday.', exampleVi: 'Hãy nộp bài tập luận nhóm của bạn trước nửa đêm thứ Sáu.' },
  { id: 'v-edu-5', word: 'pedagogy', meaningVi: 'phương pháp sư phạm', phoneticUs: '/ˈpedəɡɑːdʒi/', pos: 'noun', cefr: 'C1', category: 'Education', definitionEn: 'the method and practice of teaching, especially as an academic subject or theoretical concept', exampleEn: 'Interactive gamified pedagogy boosts student engagement.', exampleVi: 'Phương pháp sư phạm trò chơi hóa tương tác thúc đẩy sự hào hứng của học sinh.' },

  // --- 11. PHRASAL VERBS & COLLOCATIONS ---
  { id: 'v-pv-1', word: 'figure out', meaningVi: 'tìm ra cách giải quyết, hiểu ra', phoneticUs: '/ˈfɪɡjər aʊt/', pos: 'phrase', cefr: 'B1', category: 'Phrasal Verbs', definitionEn: 'discover or understand something by thinking', exampleEn: 'They finally figured out how to fix the server error.', exampleVi: 'Họ cuối cùng đã tìm ra cách sửa lỗi máy chủ.' },
  { id: 'v-pv-2', word: 'look forward to', meaningVi: 'háo hức mong đợi', phoneticUs: '/lʊk ˈfɔːrwərd tuː/', pos: 'phrase', cefr: 'A2', category: 'Phrasal Verbs', definitionEn: 'await an event with eager anticipation', exampleEn: 'I look forward to meeting you in person soon.', exampleVi: 'Tôi rất háo hức mong đợi sớm được gặp bạn trực tiếp.' },
  { id: 'v-pv-3', word: 'turn down', meaningVi: 'từ chối (lời mời/đề nghị)', phoneticUs: '/tɜːrn daʊn/', pos: 'phrase', cefr: 'B1', category: 'Phrasal Verbs', definitionEn: 'reject an offer, invitation, or application', exampleEn: 'He reluctantly turned down the lucrative job offer.', exampleVi: 'Anh ấy miễn cưỡng từ chối lời mời làm việc béo bở đó.' },
  { id: 'v-pv-4', word: 'carry out', meaningVi: 'tiến hành, thực hiện', phoneticUs: '/ˈkæri aʊt/', pos: 'phrase', cefr: 'B2', category: 'Phrasal Verbs', definitionEn: 'perform a task, research study, or planned instruction', exampleEn: 'Scientists carry out extensive clinical trials on new drugs.', exampleVi: 'Các nhà khoa học tiến hành các thử nghiệm lâm sàng chuyên sâu về thuốc mới.' },
  { id: 'v-pv-5', word: 'catch up with', meaningVi: 'đuổi kịp, theo kịp tiến độ', phoneticUs: '/kætʃ ʌp wɪð/', pos: 'phrase', cefr: 'B1', category: 'Phrasal Verbs', definitionEn: 'succeed in reaching a person or standard that is ahead of one', exampleEn: 'Study every day to catch up with advanced classmates.', exampleVi: 'Hãy học mỗi ngày để đuổi kịp những bạn cùng lớp giỏi hơn.' },

  // --- 12. IDIOMS & PROVERBS ---
  { id: 'v-idm-1', word: 'piece of cake', meaningVi: 'dễ như ăn cháo, cực kỳ dễ dàng', phoneticUs: '/piːs əv keɪk/', pos: 'phrase', cefr: 'B1', category: 'Idioms', definitionEn: 'something that is very easy to accomplish', exampleEn: 'Passing the basic driving test was a piece of cake.', exampleVi: 'Vượt qua bài thi lái xe cơ bản dễ như ăn cháo.' },
  { id: 'v-idm-2', word: 'once in a blue moon', meaningVi: 'hiếm khi xảy ra, nghìn năm có một', phoneticUs: '/wʌns ɪn ə bluː muːn/', pos: 'phrase', cefr: 'B2', category: 'Idioms', definitionEn: 'very rarely or almost never', exampleEn: 'He only attends family reunions once in a blue moon.', exampleVi: 'Anh ấy chỉ hiếm hoi lắm mới về dự họp mặt gia đình.' },
  { id: 'v-idm-3', word: 'break the ice', meaningVi: 'phá vỡ bầu không khí ngại ngùng ban đầu', phoneticUs: '/breɪk ði aɪs/', pos: 'phrase', cefr: 'B2', category: 'Idioms', definitionEn: 'do or say something to relieve tension or get conversation going', exampleEn: 'A warm funny joke helped break the ice at the workshop.', exampleVi: 'Một câu nói đùa hóm hỉnh đã giúp phá tan bầu không khí ngại ngùng tại buổi hội thảo.' },
  { id: 'v-idm-4', word: 'burn the midnight oil', meaningVi: 'thức khuya học tập / làm việc chăm chỉ', phoneticUs: '/bɜːrn ðə ˈmɪdnaɪt ɔɪl/', pos: 'phrase', cefr: 'B2', category: 'Idioms', definitionEn: 'study or work late into the night', exampleEn: 'Students burn the midnight oil before final exams.', exampleVi: 'Các sinh viên thức khuya đèn sách trước kỳ thi tốt nghiệp.' },

  // --- 13. EMOTIONS & PERSONALITIES ---
  { id: 'v-emo-1', word: 'diligent', meaningVi: 'chăm chỉ, cần cù', phoneticUs: '/ˈdɪlɪdʒənt/', pos: 'adjective', cefr: 'B1', category: 'Personality', definitionEn: 'having or showing care and conscientiousness in one’s work or duties', exampleEn: 'Diligent students steadily achieve high academic results.', exampleVi: 'Những học sinh chăm chỉ sẽ vững bước đạt kết quả học tập cao.' },
  { id: 'v-emo-2', word: 'optimistic', meaningVi: 'lạc quan, yêu đời', phoneticUs: '/ˌɑːptɪˈmɪstɪk/', pos: 'adjective', cefr: 'B1', category: 'Personality', definitionEn: 'hopeful and confident about the future', exampleEn: 'She remains genuinely optimistic despite facing unforeseen challenges.', exampleVi: 'Cô ấy vẫn luôn lạc quan một cách chân thành dù gặp phải những thử thách bất ngờ.' },
  { id: 'v-emo-3', word: 'empathy', meaningVi: 'sự đồng cảm, thấu cảm', phoneticUs: '/ˈempəθi/', pos: 'noun', cefr: 'B2', category: 'Personality', definitionEn: 'the ability to understand and share the feelings of another', exampleEn: 'Great leaders demonstrate deep empathy towards their team.', exampleVi: 'Những nhà lãnh đạo xuất chúng luôn thể hiện sự thấu cảm sâu sắc với đội ngũ của mình.' },
  { id: 'v-emo-4', word: 'serendipity', meaningVi: 'duyên may bất ngờ, sự tình cờ may mắn', phoneticUs: '/ˌserənˈdɪpəti/', pos: 'noun', cefr: 'C1', category: 'Personality', definitionEn: 'the occurrence and development of events by chance in a happy or beneficial way', exampleEn: 'Meeting my best mentor was pure serendipity.', exampleVi: 'Gặp gỡ người thầy khai sáng tốt nhất đời tôi quả là một duyên may kỳ diệu.' },
];

// ============================================================================
// 2. SENTENCE SCRAMBLE MASTER BANK (60+ DIVERSE SENTENCES ACROSS CEFR LEVELS)
// ============================================================================
export const UNIVERSAL_SCRAMBLE_BANK: ScrambleSentence[] = [
  // A1 Level
  {
    id: 'sc-a1-1',
    sentence: 'Nice to meet you in Vietnam',
    fullSentence: 'Nice to meet you in Vietnam',
    tokens: ['to', 'Nice', 'Vietnam', 'in', 'you', 'meet'],
    translation: 'Rất vui được gặp bạn ở Việt Nam',
    level: 'A1',
    category: 'Greetings',
  },
  {
    id: 'sc-a1-2',
    sentence: 'I drink hot coffee every morning',
    fullSentence: 'I drink hot coffee every morning',
    tokens: ['drink', 'hot', 'every', 'I', 'morning', 'coffee'],
    translation: 'Tôi uống cà phê nóng vào mỗi buổi sáng',
    level: 'A1',
    category: 'Daily Life',
  },
  {
    id: 'sc-a1-3',
    sentence: 'She is reading an interesting book',
    fullSentence: 'She is reading an interesting book',
    tokens: ['an', 'book', 'reading', 'is', 'She', 'interesting'],
    translation: 'Cô ấy đang đọc một cuốn sách thú vị',
    level: 'A1',
    category: 'Education',
  },
  {
    id: 'sc-a1-4',
    sentence: 'Where is the nearest bus station',
    fullSentence: 'Where is the nearest bus station',
    tokens: ['bus', 'station', 'the', 'is', 'Where', 'nearest'],
    translation: 'Trạm xe buýt gần nhất ở đâu vậy?',
    level: 'A1',
    category: 'Travel',
  },
  {
    id: 'sc-a1-5',
    sentence: 'We love eating fresh Vietnamese food',
    fullSentence: 'We love eating fresh Vietnamese food',
    tokens: ['Vietnamese', 'love', 'fresh', 'food', 'We', 'eating'],
    translation: 'Chúng tôi rất thích ăn đồ ăn Việt Nam tươi ngon',
    level: 'A1',
    category: 'Food',
  },

  // A2 Level
  {
    id: 'sc-a2-1',
    sentence: 'Please remember to bring your passport today',
    fullSentence: 'Please remember to bring your passport today',
    tokens: ['bring', 'to', 'your', 'passport', 'Please', 'remember', 'today'],
    translation: 'Xin nhớ mang theo hộ chiếu của bạn hôm nay',
    level: 'A2',
    category: 'Travel',
  },
  {
    id: 'sc-a2-2',
    sentence: 'The team will finish the project tomorrow',
    fullSentence: 'The team will finish the project tomorrow',
    tokens: ['project', 'finish', 'will', 'tomorrow', 'The', 'team', 'the'],
    translation: 'Đội ngũ sẽ hoàn thành dự án vào ngày mai',
    level: 'A2',
    category: 'Business',
  },
  {
    id: 'sc-a2-3',
    sentence: 'Can I pay for this shirt by credit card',
    fullSentence: 'Can I pay for this shirt by credit card',
    tokens: ['pay', 'this', 'for', 'shirt', 'credit', 'card', 'by', 'Can', 'I'],
    translation: 'Tôi có thể thanh toán chiếc áo này bằng thẻ tín dụng không?',
    level: 'A2',
    category: 'Finance',
  },
  {
    id: 'sc-a2-4',
    sentence: 'Regular physical exercise keeps your body healthy',
    fullSentence: 'Regular physical exercise keeps your body healthy',
    tokens: ['keeps', 'Regular', 'healthy', 'exercise', 'physical', 'body', 'your'],
    translation: 'Tập thể dục đều đặn giúp cơ thể bạn luôn khỏe mạnh',
    level: 'A2',
    category: 'Health',
  },
  {
    id: 'sc-a2-5',
    sentence: 'She booked a double room at the hotel',
    fullSentence: 'She booked a double room at the hotel',
    tokens: ['room', 'hotel', 'at', 'the', 'She', 'booked', 'double', 'a'],
    translation: 'Cô ấy đã đặt một phòng đôi tại khách sạn',
    level: 'A2',
    category: 'Travel',
  },

  // B1 Level
  {
    id: 'sc-b1-1',
    sentence: 'Renewable energy sources reduce harmful carbon emissions',
    fullSentence: 'Renewable energy sources reduce harmful carbon emissions',
    tokens: ['reduce', 'energy', 'carbon', 'Renewable', 'sources', 'emissions', 'harmful'],
    translation: 'Các nguồn năng lượng tái tạo giúp giảm lượng khí thải carbon độc hại',
    level: 'B1',
    category: 'Environment',
  },
  {
    id: 'sc-b1-2',
    sentence: 'Artificial intelligence is transforming the healthcare industry',
    fullSentence: 'Artificial intelligence is transforming the healthcare industry',
    tokens: ['transforming', 'Artificial', 'healthcare', 'intelligence', 'industry', 'the', 'is'],
    translation: 'Trí tuệ nhân tạo đang làm thay đổi ngành chăm sóc sức khỏe',
    level: 'B1',
    category: 'Technology',
  },
  {
    id: 'sc-b1-3',
    sentence: 'Effective communication is essential for career success',
    fullSentence: 'Effective communication is essential for career success',
    tokens: ['for', 'communication', 'essential', 'Effective', 'career', 'success', 'is'],
    translation: 'Giao tiếp hiệu quả là điều cốt yếu để thành công trong sự nghiệp',
    level: 'B1',
    category: 'Business',
  },
  {
    id: 'sc-b1-4',
    sentence: 'She decided to study abroad to broaden her horizons',
    fullSentence: 'She decided to study abroad to broaden her horizons',
    tokens: ['to', 'study', 'her', 'horizons', 'She', 'abroad', 'decided', 'broaden'],
    translation: 'Cô ấy quyết định đi du học để mở rộng tầm nhìn của mình',
    level: 'B1',
    category: 'Education',
  },
  {
    id: 'sc-b1-5',
    sentence: 'The doctor advised him to adopt a balanced diet',
    fullSentence: 'The doctor advised him to adopt a balanced diet',
    tokens: ['adopt', 'balanced', 'advised', 'The', 'him', 'to', 'doctor', 'diet', 'a'],
    translation: 'Bác sĩ khuyên anh ấy nên áp dụng một chế độ ăn uống cân bằng',
    level: 'B1',
    category: 'Health',
  },

  // B2 Level
  {
    id: 'sc-b2-1',
    sentence: 'Scientists must gather empirical evidence to substantiate theories',
    fullSentence: 'Scientists must gather empirical evidence to substantiate theories',
    tokens: ['empirical', 'gather', 'substantiate', 'evidence', 'must', 'theories', 'Scientists', 'to'],
    translation: 'Các nhà khoa học phải thu thập bằng chứng thực nghiệm để chứng minh các lý thuyết',
    level: 'B2',
    category: 'Academic IELTS',
  },
  {
    id: 'sc-b2-2',
    sentence: 'Protecting fragile marine ecosystems requires urgent international cooperation',
    fullSentence: 'Protecting fragile marine ecosystems requires urgent international cooperation',
    tokens: ['ecosystems', 'marine', 'Protecting', 'requires', 'cooperation', 'international', 'urgent', 'fragile'],
    translation: 'Bảo vệ các hệ sinh thái biển mỏng manh đòi hỏi sự hợp tác quốc tế cấp bách',
    level: 'B2',
    category: 'Environment',
  },
  {
    id: 'sc-b2-3',
    sentence: 'Technological innovations have fundamentally reshaped modern workplace dynamics',
    fullSentence: 'Technological innovations have fundamentally reshaped modern workplace dynamics',
    tokens: ['reshaped', 'innovations', 'workplace', 'dynamics', 'Technological', 'modern', 'have', 'fundamentally'],
    translation: 'Những đổi mới công nghệ đã tái định hình căn bản động lực tại nơi làm việc hiện đại',
    level: 'B2',
    category: 'Technology',
  },
  {
    id: 'sc-b2-4',
    sentence: 'High inflation rates pose significant challenges to economic growth',
    fullSentence: 'High inflation rates pose significant challenges to economic growth',
    tokens: ['inflation', 'economic', 'pose', 'High', 'challenges', 'growth', 'significant', 'rates', 'to'],
    translation: 'Tỷ lệ lạm phát cao đặt ra những thách thức đáng kể đối với sự tăng trưởng kinh tế',
    level: 'B2',
    category: 'Finance',
  },
  {
    id: 'sc-b2-5',
    sentence: 'Critical thinking enables learners to evaluate complex arguments objectively',
    fullSentence: 'Critical thinking enables learners to evaluate complex arguments objectively',
    tokens: ['enables', 'arguments', 'evaluate', 'thinking', 'learners', 'Critical', 'objectively', 'complex', 'to'],
    translation: 'Tư duy phản biện giúp người học đánh giá các luận điểm phức tạp một cách khách quan',
    level: 'B2',
    category: 'Education',
  },
];

// ============================================================================
// 3. WORDLE 5-LETTER CURATED TARGET BANK (FOR LINGO WORDLE GAME)
// ============================================================================
export const WORDLE_WORDS_BANK: WordleTarget[] = [
  { word: 'SMART', meaningVi: 'Thông minh, khéo léo', phoneticUs: '/smɑːrt/', hint: 'Tính từ chỉ người có trí tuệ nhạy bén hoặc thiết bị hiện đại', category: 'Personality' },
  { word: 'TRAIN', meaningVi: 'Tàu hỏa / Rèn luyện', phoneticUs: '/treɪn/', hint: 'Phương tiện chạy trên đường ray hoặc hành động rèn luyện kỹ năng', category: 'Travel' },
  { word: 'CLEAN', meaningVi: 'Sạch sẽ, trong lành', phoneticUs: '/kliːn/', hint: 'Trạng thái không có bụi bẩn, bảo vệ môi trường', category: 'Daily Life' },
  { word: 'BRAIN', meaningVi: 'Bộ não, trí tuệ', phoneticUs: '/breɪn/', hint: 'Cơ quan chỉ huy suy nghĩ và cảm xúc trong cơ thể', category: 'Health' },
  { word: 'LIGHT', meaningVi: 'Ánh sáng / Nhẹ nhàng', phoneticUs: '/laɪt/', hint: 'Năng lượng giúp mắt ta nhìn thấy mọi vật', category: 'Nature' },
  { word: 'PLANT', meaningVi: 'Cây cối / Trồng cây', phoneticUs: '/plænt/', hint: 'Sinh vật quang hợp tạo oxy cho Trái Đất', category: 'Environment' },
  { word: 'EARTH', meaningVi: 'Trái Đất, hành tinh xanh', phoneticUs: '/ɜːrθ/', hint: 'Hành tinh thứ ba tính từ Mặt Trời, ngôi nhà của nhân loại', category: 'Environment' },
  { word: 'DREAM', meaningVi: 'Ước mơ, giấc mơ', phoneticUs: '/driːm/', hint: 'Những điều kỳ diệu xuất hiện trong giấc ngủ hoặc mục tiêu cuộc đời', category: 'Emotions' },
  { word: 'FOCUS', meaningVi: 'Tập trung, trọng tâm', phoneticUs: '/ˈfoʊkəs/', hint: 'Dồn toàn bộ sự chú ý vào một công việc cụ thể', category: 'Education' },
  { word: 'HABIT', meaningVi: 'Thói quen thường nhật', phoneticUs: '/ˈhæbɪt/', hint: 'Hành động được lặp đi lặp lại một cách tự nhiên hàng ngày', category: 'Daily Life' },
  { word: 'CLOUD', meaningVi: 'Đám mây / Điện toán đám mây', phoneticUs: '/klaʊd/', hint: 'Hơi nước ngưng tụ trên bầu trời hoặc hạ tầng lưu trữ dữ liệu', category: 'Technology' },
  { word: 'WATER', meaningVi: 'Nước uống, nguồn sống', phoneticUs: '/ˈwɔːtər/', hint: 'Chất lỏng trong suốt chiếm hơn 70% cơ thể người', category: 'Food' },
  { word: 'HEART', meaningVi: 'Trái tim, tâm hồn', phoneticUs: '/hɑːrt/', hint: 'Cơ quan bơm máu nuôi dưỡng toàn bộ cơ thể', category: 'Health' },
  { word: 'VOICE', meaningVi: 'Giọng nói, tiếng nói', phoneticUs: '/vɔɪs/', hint: 'Âm thanh phát ra từ thanh quản khi chúng ta giao tiếp', category: 'Speaking' },
  { word: 'POWER', meaningVi: 'Sức mạnh, năng lượng', phoneticUs: '/ˈpaʊər/', hint: 'Khả năng tác động hoặc nguồn điện năng vận hành máy móc', category: 'Technology' },
  { word: 'OCEAN', meaningVi: 'Đại dương bao la', phoneticUs: '/ˈoʊʃn/', hint: 'Vùng nước mặn khổng lồ bao phủ phần lớn địa cầu', category: 'Environment' },
  { word: 'SOLAR', meaningVi: 'Năng lượng mặt trời', phoneticUs: '/ˈsoʊlər/', hint: 'Nguồn năng lượng sạch vô tận đến từ vầng thái dương', category: 'Environment' },
  { word: 'PEACE', meaningVi: 'Hòa bình, sự thanh thản', phoneticUs: '/piːs/', hint: 'Trạng thái yên bình, không có chiến tranh hay xung đột', category: 'Society' },
  { word: 'GUIDE', meaningVi: 'Hướng dẫn, người dẫn đường', phoneticUs: '/ɡaɪd/', hint: 'Người hoặc tài liệu chỉ dẫn đường đi nước bước', category: 'Travel' },
  { word: 'SWEET', meaningVi: 'Ngọt ngào, dễ thương', phoneticUs: '/swiːt/', hint: 'Vị của đường hoặc tính từ khen ngợi sự dễ thương', category: 'Food' },
];

// ============================================================================
// 4. SMART UTILITY FUNCTIONS (SMART DISTRACTOR & FILTER GENERATORS)
// ============================================================================

/**
 * Returns a random selection of words based on topic or CEFR filter
 */
export function getFilteredVocabulary(params?: { category?: string; cefr?: string; count?: number }): MasterWord[] {
  let list = [...UNIVERSAL_VOCABULARY];

  if (params?.category && params.category !== 'all') {
    list = list.filter((w) => w.category.toLowerCase().includes(params.category!.toLowerCase()));
  }

  if (params?.cefr && params.cefr !== 'all') {
    list = list.filter((w) => w.cefr.toUpperCase() === params.cefr!.toUpperCase());
  }

  // Shuffle
  list.sort(() => Math.random() - 0.5);

  if (params?.count && params.count > 0) {
    return list.slice(0, params.count);
  }

  return list;
}

/**
 * Generates 3 intelligent distractors from the master database with similar traits
 * (NEVER hardcodes "Xin chào, Cảm ơn, Tạm biệt")
 */
export function generateSmartDistractors(targetWord: MasterWord, totalOptions: number = 4): string[] {
  // Try to find words in the same category and part of speech first
  const pool = UNIVERSAL_VOCABULARY.filter(
    (w) => w.id !== targetWord.id && w.meaningVi.toLowerCase() !== targetWord.meaningVi.toLowerCase()
  );

  // Score candidates by similarity (same pos > same category > same cefr)
  const scored = pool.map((w) => {
    let score = 0;
    if (w.pos === targetWord.pos) score += 3;
    if (w.category === targetWord.category) score += 2;
    if (w.cefr === targetWord.cefr) score += 1;
    return { item: w, score: score + Math.random() };
  });

  scored.sort((a, b) => b.score - a.score);

  const selectedDistractors = scored.slice(0, totalOptions - 1).map((s) => s.item.meaningVi);

  const allOptions = [targetWord.meaningVi, ...selectedDistractors];
  return allOptions.sort(() => Math.random() - 0.5);
}

/**
 * Fetch a random Wordle target word
 */
export function getRandomWordleTarget(): WordleTarget {
  const idx = Math.floor(Math.random() * WORDLE_WORDS_BANK.length);
  return WORDLE_WORDS_BANK[idx];
}

/**
 * Fetch sentence scramble questions with optional level filter
 */
export function getScrambleQuestions(level?: string, count: number = 5): ScrambleSentence[] {
  let list = [...UNIVERSAL_SCRAMBLE_BANK];
  if (level && level !== 'all') {
    list = list.filter((s) => s.level.toLowerCase() === level.toLowerCase());
  }
  list.sort(() => Math.random() - 0.5);
  return list.slice(0, count);
}
