/**
 * LINGUAFLOW BACKEND UNIVERSAL VOCABULARY & GAME BANK
 */

export interface BackendWord {
  id: string;
  targetText: string;
  translation: string;
  phonetic: string;
  pos: string;
  cefrLevel: string;
  category: string;
  definitionEn: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export const BACKEND_MASTER_WORDS: BackendWord[] = [
  // 1. Daily Life
  { id: 'bw-1', targetText: 'Morning', translation: 'Buổi sáng', phonetic: '/ˈmɔːrnɪŋ/', pos: 'noun', cefrLevel: 'A1', category: 'Daily Life', definitionEn: 'the early part of the day from sunrise to noon', exampleSentence: 'I wake up early in the morning.', exampleTranslation: 'Tôi thức dậy sớm vào buổi sáng.' },
  { id: 'bw-2', targetText: 'Routine', translation: 'Thói quen thường nhật', phonetic: '/ruːˈtiːn/', pos: 'noun', cefrLevel: 'A2', category: 'Daily Life', definitionEn: 'a regular sequence of actions', exampleSentence: 'Exercise is part of my morning routine.', exampleTranslation: 'Tập thể dục là một phần trong thói quen buổi sáng của tôi.' },
  { id: 'bw-3', targetText: 'Breakfast', translation: 'Bữa ăn sáng', phonetic: '/ˈbrekfəst/', pos: 'noun', cefrLevel: 'A1', category: 'Daily Life', definitionEn: 'the first meal of the day', exampleSentence: 'We eat breakfast together.', exampleTranslation: 'Chúng tôi ăn sáng cùng nhau.' },
  { id: 'bw-4', targetText: 'Exercise', translation: 'Tập thể dục', phonetic: '/ˈeksərsaɪz/', pos: 'verb', cefrLevel: 'A1', category: 'Daily Life', definitionEn: 'physical activity to sustain health', exampleSentence: 'She exercises regularly.', exampleTranslation: 'Cô ấy tập thể dục đều đặn.' },
  { id: 'bw-5', targetText: 'Commute', translation: 'Đi làm hàng ngày', phonetic: '/kəˈmjuːt/', pos: 'verb', cefrLevel: 'B1', category: 'Daily Life', definitionEn: 'travel between home and work', exampleSentence: 'Many workers commute by train.', exampleTranslation: 'Nhiều nhân viên đi làm bằng tàu hỏa.' },

  // 2. Travel
  { id: 'bw-6', targetText: 'Airport', translation: 'Sân bay', phonetic: '/ˈerpɔːrt/', pos: 'noun', cefrLevel: 'A1', category: 'Travel', definitionEn: 'complex for aircraft takeoff and landing', exampleSentence: 'The flight lands at the international airport.', exampleTranslation: 'Chuyến bay hạ cánh tại sân bay quốc tế.' },
  { id: 'bw-7', targetText: 'Passport', translation: 'Hộ chiếu', phonetic: '/ˈpæspɔːrt/', pos: 'noun', cefrLevel: 'A1', category: 'Travel', definitionEn: 'official travel identification document', exampleSentence: 'Keep your passport in a secure pocket.', exampleTranslation: 'Hãy giữ hộ chiếu trong túi an toàn.' },
  { id: 'bw-8', targetText: 'Boarding pass', translation: 'Thẻ lên máy bay', phonetic: '/ˈbɔːrdɪŋ pæs/', pos: 'noun', cefrLevel: 'A2', category: 'Travel', definitionEn: 'document giving permission to board an aircraft', exampleSentence: 'Show your boarding pass at gate seven.', exampleTranslation: 'Xuất trình thẻ lên máy bay tại cửa số 7.' },
  { id: 'bw-9', targetText: 'Destination', translation: 'Điểm đến du lịch', phonetic: '/ˌdestɪˈneɪʃn/', pos: 'noun', cefrLevel: 'B1', category: 'Travel', definitionEn: 'the place to which someone is journeying', exampleSentence: 'Da Nang is a captivating destination.', exampleTranslation: 'Đà Nẵng là một điểm đến đầy lôi cuốn.' },
  { id: 'bw-10', targetText: 'Itinerary', translation: 'Lịch trình chuyến đi', phonetic: '/aɪˈtɪnəreri/', pos: 'noun', cefrLevel: 'B2', category: 'Travel', definitionEn: 'a detailed plan of a journey', exampleSentence: 'Review the travel itinerary carefully.', exampleTranslation: 'Hãy xem lại lịch trình chuyến đi một cách cẩn thận.' },

  // 3. Business
  { id: 'bw-11', targetText: 'Colleague', translation: 'Đồng nghiệp', phonetic: '/ˈkɑːliːɡ/', pos: 'noun', cefrLevel: 'A2', category: 'Business', definitionEn: 'person with whom one works', exampleSentence: 'He consults his colleagues before deciding.', exampleTranslation: 'Anh ấy tham khảo ý kiến đồng nghiệp trước khi quyết định.' },
  { id: 'bw-12', targetText: 'Meeting', translation: 'Cuộc họp', phonetic: '/ˈmiːtɪŋ/', pos: 'noun', cefrLevel: 'A1', category: 'Business', definitionEn: 'formal gathering for discussion', exampleSentence: 'The conference meeting starts at nine.', exampleTranslation: 'Cuộc họp hội nghị bắt đầu lúc chín giờ.' },
  { id: 'bw-13', targetText: 'Deadline', translation: 'Hạn chót', phonetic: '/ˈdedlaɪn/', pos: 'noun', cefrLevel: 'B1', category: 'Business', definitionEn: 'the latest time for completion', exampleSentence: 'We met the client deadline easily.', exampleTranslation: 'Chúng tôi đã hoàn thành kịp hạn chót của khách hàng dễ dàng.' },
  { id: 'bw-14', targetText: 'Negotiate', translation: 'Đàm phán, thương lượng', phonetic: '/nɪˈɡoʊʃieɪt/', pos: 'verb', cefrLevel: 'B2', category: 'Business', definitionEn: 'reach an agreement through discussion', exampleSentence: 'They negotiate a mutually beneficial partnership.', exampleTranslation: 'Họ đàm phán một quan hệ đối tác cùng có lợi.' },
  { id: 'bw-15', targetText: 'Productivity', translation: 'Năng suất làm việc', phonetic: '/ˌproʊdʌkˈtɪvəti/', pos: 'noun', cefrLevel: 'B2', category: 'Business', definitionEn: 'the effectiveness of work effort', exampleSentence: 'Automation greatly enhances workplace productivity.', exampleTranslation: 'Tự động hóa nâng cao đáng kể năng suất nơi làm việc.' },

  // 4. Technology
  { id: 'bw-16', targetText: 'Algorithm', translation: 'Thuật toán', phonetic: '/ˈælɡərɪðəm/', pos: 'noun', cefrLevel: 'B2', category: 'Technology', definitionEn: 'computational procedure for solving problems', exampleSentence: 'Sorting algorithms organize data rapidly.', exampleTranslation: 'Các thuật toán sắp xếp tổ chức dữ liệu một cách nhanh chóng.' },
  { id: 'bw-17', targetText: 'Database', translation: 'Cơ sở dữ liệu', phonetic: '/ˈdeɪtəbeɪs/', pos: 'noun', cefrLevel: 'B1', category: 'Technology', definitionEn: 'structured electronic repository of information', exampleSentence: 'Data is stored securely in the cloud database.', exampleTranslation: 'Dữ liệu được lưu trữ an toàn trong cơ sở dữ liệu đám mây.' },
  { id: 'bw-18', targetText: 'Encryption', translation: 'Mã hóa thông tin', phonetic: '/ɪnˈkrɪpʃn/', pos: 'noun', cefrLevel: 'C1', category: 'Technology', definitionEn: 'conversion of data into protective code', exampleSentence: 'Modern banking relies on strong encryption.', exampleVi: 'Ngân hàng hiện đại dựa vào mã hóa mạnh mẽ.' } as any,
  { id: 'bw-19', targetText: 'Interface', translation: 'Giao diện người dùng', phonetic: '/ˈɪntərfeɪs/', pos: 'noun', cefrLevel: 'B2', category: 'Technology', definitionEn: 'user interaction point with a system', exampleSentence: 'The mobile app interface is highly intuitive.', exampleTranslation: 'Giao diện ứng dụng di động rất trực quan.' },

  // 5. Environment & Academic
  { id: 'bw-20', targetText: 'Ecosystem', translation: 'Hệ sinh thái', phonetic: '/ˈiːkoʊsɪstəm/', pos: 'noun', cefrLevel: 'B1', category: 'Environment', definitionEn: 'interacting community of organisms and habitat', exampleSentence: 'Protecting rainforest ecosystems is vital.', exampleTranslation: 'Bảo vệ các hệ sinh thái rừng nhiệt đới là điều sống còn.' },
  { id: 'bw-21', targetText: 'Sustainable', translation: 'Bền vững, thân thiện môi trường', phonetic: '/səˈsteɪnəbl/', pos: 'adjective', cefrLevel: 'B2', category: 'Environment', definitionEn: 'able to be maintained without depleting resources', exampleSentence: 'Solar energy provides sustainable electric power.', exampleTranslation: 'Năng lượng mặt trời cung cấp điện năng bền vững.' },
  { id: 'bw-22', targetText: 'Ubiquitous', translation: 'Có mặt ở khắp nơi', phonetic: '/juːˈbɪkwɪtəs/', pos: 'adjective', cefrLevel: 'C1', category: 'Academic IELTS', definitionEn: 'present or found everywhere', exampleSentence: 'Digital connectivity is ubiquitous nowadays.', exampleTranslation: 'Kết nối kỹ thuật số ngày nay hiện diện ở khắp mọi nơi.' },
  { id: 'bw-23', targetText: 'Resilience', translation: 'Khả năng phục hồi, sức bật', phonetic: '/rɪˈzɪliəns/', pos: 'noun', cefrLevel: 'C1', category: 'Academic IELTS', definitionEn: 'capacity to recover rapidly from adversity', exampleSentence: 'The community showed remarkable economic resilience.', exampleTranslation: 'Cộng đồng đã thể hiện sức phục hồi kinh tế đáng kinh ngạc.' },
  { id: 'bw-24', targetText: 'Mitigate', translation: 'Giảm nhẹ, xoa dịu', phonetic: '/ˈmɪtɪɡeɪt/', pos: 'verb', cefrLevel: 'B2', category: 'Academic IELTS', definitionEn: 'make something less severe', exampleSentence: 'Afforestation projects help mitigate global warming.', exampleTranslation: 'Các dự án trồng rừng giúp giảm nhẹ sự nóng lên toàn cầu.' },
  { id: 'bw-25', targetText: 'Paramount', translation: 'Tối quan trọng, hàng đầu', phonetic: '/ˈpærəmaʊnt/', pos: 'adjective', cefrLevel: 'C1', category: 'Academic IELTS', definitionEn: 'more important than anything else', exampleSentence: 'Safety protocols are of paramount significance.', exampleTranslation: 'Các quy trình an toàn mang ý nghĩa tối quan trọng.' },
];

export const BACKEND_SCRAMBLES = [
  { id: 'bsc-1', sentence: 'Nice to meet you in Vietnam', fullSentence: 'Nice to meet you in Vietnam', tokens: ['to', 'Nice', 'Vietnam', 'in', 'you', 'meet'], translation: 'Rất vui được gặp bạn ở Việt Nam' },
  { id: 'bsc-2', sentence: 'I drink hot coffee every morning', fullSentence: 'I drink hot coffee every morning', tokens: ['drink', 'hot', 'every', 'I', 'morning', 'coffee'], translation: 'Tôi uống cà phê nóng vào mỗi buổi sáng' },
  { id: 'bsc-3', sentence: 'She booked a double room at the hotel', fullSentence: 'She booked a double room at the hotel', tokens: ['room', 'hotel', 'at', 'the', 'She', 'booked', 'double', 'a'], translation: 'Cô ấy đã đặt một phòng đôi tại khách sạn' },
  { id: 'bsc-4', sentence: 'Renewable energy sources reduce carbon emissions', fullSentence: 'Renewable energy sources reduce carbon emissions', tokens: ['reduce', 'energy', 'carbon', 'Renewable', 'sources', 'emissions'], translation: 'Các nguồn năng lượng tái tạo giúp giảm lượng khí thải carbon' },
  { id: 'bsc-5', sentence: 'Artificial intelligence is transforming global healthcare', fullSentence: 'Artificial intelligence is transforming global healthcare', tokens: ['transforming', 'Artificial', 'healthcare', 'intelligence', 'global', 'is'], translation: 'Trí tuệ nhân tạo đang biến đổi ngành y tế toàn cầu' },
  { id: 'bsc-6', sentence: 'Regular exercise keeps your mind and body healthy', fullSentence: 'Regular exercise keeps your mind and body healthy', tokens: ['keeps', 'Regular', 'healthy', 'exercise', 'mind', 'and', 'body', 'your'], translation: 'Tập thể dục đều đặn giúp tâm trí và cơ thể bạn luôn khỏe mạnh' },
  { id: 'bsc-7', sentence: 'Scientists must gather empirical evidence to substantiate theories', fullSentence: 'Scientists must gather empirical evidence to substantiate theories', tokens: ['empirical', 'gather', 'substantiate', 'evidence', 'must', 'theories', 'Scientists', 'to'], translation: 'Các nhà khoa học phải thu thập bằng chứng thực nghiệm để chứng minh các lý thuyết' },
  { id: 'bsc-8', sentence: 'Effective communication is essential for career success', fullSentence: 'Effective communication is essential for career success', tokens: ['for', 'communication', 'essential', 'Effective', 'career', 'success', 'is'], translation: 'Giao tiếp hiệu quả là điều cốt yếu để thành công trong sự nghiệp' },
  { id: 'bsc-9', sentence: 'He bought a round trip ticket to Da Nang', fullSentence: 'He bought a round trip ticket to Da Nang', tokens: ['ticket', 'round', 'trip', 'bought', 'He', 'to', 'a', 'Da Nang'], translation: 'Anh ấy đã mua vé khứ hồi đi Đà Nẵng' },
  { id: 'bsc-10', sentence: 'Please turn off the lights before leaving the office', fullSentence: 'Please turn off the lights before leaving the office', tokens: ['leaving', 'lights', 'Please', 'turn', 'the', 'off', 'before', 'the', 'office'], translation: 'Vui lòng tắt đèn trước khi rời khỏi văn phòng' },
  { id: 'bsc-11', sentence: 'The software engineer optimized database performance significantly', fullSentence: 'The software engineer optimized database performance significantly', tokens: ['performance', 'database', 'software', 'The', 'engineer', 'optimized', 'significantly'], translation: 'Kỹ sư phần mềm đã tối ưu hóa hiệu năng cơ sở dữ liệu đáng kể' },
  { id: 'bsc-12', sentence: 'Eating fresh vegetables provides essential vitamins and minerals', fullSentence: 'Eating fresh vegetables provides essential vitamins and minerals', tokens: ['essential', 'Eating', 'provides', 'fresh', 'vegetables', 'and', 'minerals', 'vitamins'], translation: 'Ăn rau tươi cung cấp các vitamin và khoáng chất thiết yếu' },
  { id: 'bsc-13', sentence: 'They signed an international trade agreement yesterday afternoon', fullSentence: 'They signed an international trade agreement yesterday afternoon', tokens: ['trade', 'signed', 'They', 'afternoon', 'agreement', 'an', 'international', 'yesterday'], translation: 'Họ đã ký một hiệp định thương mại quốc tế vào chiều hôm qua' },
  { id: 'bsc-14', sentence: 'Online learning platforms offer flexible schedules for working adults', fullSentence: 'Online learning platforms offer flexible schedules for working adults', tokens: ['flexible', 'schedules', 'learning', 'Online', 'offer', 'platforms', 'for', 'working', 'adults'], translation: 'Các nền tảng học trực tuyến cung cấp lịch trình linh hoạt cho người đi làm' },
  { id: 'bsc-15', sentence: 'The international flight was delayed due to heavy thunderstorm', fullSentence: 'The international flight was delayed due to heavy thunderstorm', tokens: ['due', 'international', 'flight', 'The', 'delayed', 'was', 'to', 'thunderstorm', 'heavy'], translation: 'Chuyến bay quốc tế đã bị hoãn do dông bão lớn' },
  { id: 'bsc-16', sentence: 'Cybersecurity measures protect sensitive financial data from hackers', fullSentence: 'Cybersecurity measures protect sensitive financial data from hackers', tokens: ['sensitive', 'protect', 'measures', 'Cybersecurity', 'data', 'from', 'financial', 'hackers'], translation: 'Các biện pháp an ninh mạng bảo vệ dữ liệu tài chính nhạy cảm khỏi tin tặc' },
  { id: 'bsc-17', sentence: 'Consistent vocabulary review improves language retention dramatically', fullSentence: 'Consistent vocabulary review improves language retention dramatically', tokens: ['review', 'Consistent', 'retention', 'improves', 'vocabulary', 'language', 'dramatically'], translation: 'Ôn tập từ vựng đều đặn cải thiện khả năng ghi nhớ ngôn ngữ một cách rõ rệt' },
  { id: 'bsc-18', sentence: 'The doctor advised the patient to rest for three days', fullSentence: 'The doctor advised the patient to rest for three days', tokens: ['advised', 'doctor', 'The', 'to', 'patient', 'the', 'rest', 'three', 'days', 'for'], translation: 'Bác sĩ khuyên bệnh nhân nên nghỉ ngơi trong ba ngày' },
  { id: 'bsc-19', sentence: 'Modern technology allows people to work remotely from anywhere', fullSentence: 'Modern technology allows people to work remotely from anywhere', tokens: ['remotely', 'allows', 'technology', 'Modern', 'people', 'to', 'from', 'work', 'anywhere'], translation: 'Công nghệ hiện đại cho phép mọi người làm việc từ xa ở bất cứ đâu' },
  { id: 'bsc-20', sentence: 'The research team presented their findings at the annual conference', fullSentence: 'The research team presented their findings at the annual conference', tokens: ['presented', 'team', 'research', 'The', 'findings', 'their', 'the', 'at', 'conference', 'annual'], translation: 'Nhóm nghiên cứu đã trình bày kết quả của họ tại hội nghị thường niên' },
];

export const BACKEND_WORDLE_LIST = [
  { word: 'SMART', meaningVi: 'Thông minh, khéo léo', phoneticUs: '/smɑːrt/', hint: 'Tính từ chỉ người có trí tuệ nhạy bén hoặc thiết bị hiện đại', category: 'Personality' },
  { word: 'TRAIN', meaningVi: 'Tàu hỏa / Rèn luyện', phoneticUs: '/treɪn/', hint: 'Phương tiện chạy trên đường ray hoặc hành động rèn luyện kỹ năng', category: 'Travel' },
  { word: 'CLEAN', meaningVi: 'Sạch sẽ, trong lành', phoneticUs: '/kliːn/', hint: 'Trạng thái không có bụi bẩn, bảo vệ môi trường', category: 'Daily Life' },
  { word: 'BRAIN', meaningVi: 'Bộ não, trí tuệ', phoneticUs: '/breɪn/', hint: 'Cơ quan chỉ huy suy nghĩ và cảm xúc trong cơ thể', category: 'Health' },
  { word: 'LIGHT', meaningVi: 'Ánh sáng / Nhẹ nhàng', phoneticUs: '/laɪt/', hint: 'Năng lượng giúp mắt ta nhìn thấy mọi vật', category: 'Nature' },
  { word: 'EARTH', meaningVi: 'Trái Đất, hành tinh xanh', phoneticUs: '/ɜːrθ/', hint: 'Hành tinh thứ ba tính từ Mặt Trời, ngôi nhà của nhân loại', category: 'Environment' },
  { word: 'FOCUS', meaningVi: 'Tập trung, trọng tâm', phoneticUs: '/ˈfoʊkəs/', hint: 'Dồn toàn bộ sự chú ý vào một công việc cụ thể', category: 'Education' },
  { word: 'CLOUD', meaningVi: 'Đám mây / Điện toán đám mây', phoneticUs: '/klaʊd/', hint: 'Hơi nước ngưng tụ trên bầu trời hoặc hạ tầng lưu trữ dữ liệu', category: 'Technology' },
  { word: 'WATER', meaningVi: 'Nước uống, nguồn sống', phoneticUs: '/ˈwɔːtər/', hint: 'Chất lỏng trong suốt chiếm hơn 70% cơ thể người', category: 'Food' },
  { word: 'HEART', meaningVi: 'Trái tim, tâm hồn', phoneticUs: '/hɑːrt/', hint: 'Cơ quan bơm máu nuôi dưỡng toàn bộ cơ thể', category: 'Health' },
];
