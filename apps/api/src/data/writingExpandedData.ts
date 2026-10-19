import { WritingPrompt } from '../../../../packages/domain/src/index.js';

export const INITIAL_WRITING_PROMPTS: WritingPrompt[] = [
  {
    "id": "see-write-a1-morning",
    "mode": "see-write",
    "difficulty": "A1",
    "title": "Morning Routine",
    "instruction": "Hãy quan sát bức tranh và viết ít nhất 1-2 câu mô tả hoạt động buổi sáng của bạn.",
    "imageHint": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80",
    "scenario": "Một tách cà phê nóng và bữa sáng thơm ngon trên bàn ăn vào buổi sáng sớm.",
    "targetWords": [
      "coffee",
      "morning",
      "breakfast",
      "drink"
    ],
    "targetGrammar": "Present Simple: I drink / I eat",
    "sampleAnswer": "Every morning I wake up early, drink hot coffee, and eat delicious breakfast.",
    "category": "Daily Life",
    "minWords": 8,
    "maxWords": 40,
    "guidedSteps": []
  },
  {
    "id": "see-write-a2-travel",
    "mode": "see-write",
    "difficulty": "A2",
    "title": "Weekend Vacation Trip",
    "instruction": "Mô tả chuyến đi du lịch cuối tuần hoặc kỳ nghỉ bên bãi biển trong bức ảnh.",
    "imageHint": "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=700&auto=format&fit=crop&q=80",
    "scenario": "Một vali du lịch, kính râm và phong cảnh bờ biển nhiệt đới ngập tràn ánh nắng.",
    "targetWords": [
      "travel",
      "vacation",
      "beach",
      "relax",
      "beautiful"
    ],
    "targetGrammar": "Past Simple / Present Continuous",
    "sampleAnswer": "Last weekend my family travelled to the beach. We relaxed under the sun and enjoyed fresh seafood.",
    "category": "Travel & Leisure",
    "minWords": 15,
    "maxWords": 60,
    "guidedSteps": []
  },
  {
    "id": "see-write-b1-tech",
    "mode": "see-write",
    "difficulty": "B1",
    "title": "Modern Workplace Collaboration",
    "instruction": "Mô tả cảnh các kỹ sư và đồng nghiệp đang làm việc nhóm và cộng tác xây dựng phần mềm.",
    "imageHint": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&auto=format&fit=crop&q=80",
    "scenario": "Nhóm làm việc đa quốc gia đang thảo luận ý tưởng trước màn hình máy tính hiện đại.",
    "targetWords": [
      "collaborate",
      "team",
      "project",
      "technology",
      "creative"
    ],
    "targetGrammar": "Present Perfect / Modals of ability",
    "sampleAnswer": "Our engineering team collaborates closely to develop innovative software that solves real-world challenges.",
    "category": "Technology",
    "minWords": 20,
    "maxWords": 80,
    "guidedSteps": []
  },
  {
    "id": "guided-a1-room",
    "mode": "guided",
    "difficulty": "A1",
    "title": "My Study Room",
    "instruction": "Trả lời từng câu hỏi gợi ý để tạo thành một đoạn văn hoàn chỉnh về góc học tập của bạn.",
    "category": "Daily Life",
    "minWords": 15,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Where is your study room located?",
        "hint": "In my house / in my apartment",
        "samplePhrase": "My study room is on the second floor."
      },
      {
        "stepNumber": 2,
        "question": "What is on your study desk?",
        "hint": "A laptop, books, a lamp",
        "samplePhrase": "There is a laptop and several English books on my desk."
      },
      {
        "stepNumber": 3,
        "question": "How do you feel when studying there?",
        "hint": "Comfortable / quiet / peaceful",
        "samplePhrase": "I feel very comfortable and focused when studying here."
      }
    ],
    "sampleAnswer": "My study room is on the second floor. There is a laptop and several English books on my desk. I feel very comfortable and focused when studying here."
  },
  {
    "id": "free-b1-favorite-city",
    "mode": "free",
    "difficulty": "B1",
    "title": "Your Favorite City in the World",
    "instruction": "Viết tự do về một thành phố bạn yêu thích hoặc mơ ước được đặt chân đến. Đặt mục tiêu từ 40 - 100 từ.",
    "category": "Travel & Leisure",
    "minWords": 40,
    "maxWords": 150,
    "targetWords": [
      "city",
      "culture",
      "explore",
      "atmosphere",
      "memorable"
    ],
    "sampleAnswer": "Da Nang is my favorite city in Vietnam because of its breathtaking beaches and friendly people. The vibrant night market and delicious street food always leave a lasting impression.",
    "guidedSteps": []
  }
];

export const EXPANDED_WRITING_PROMPTS: WritingPrompt[] = [
  {
    "id": "see-write-a1-park",
    "mode": "see-write",
    "difficulty": "A1",
    "title": "Children Playing in the City Park",
    "instruction": "Quan sát bức tranh và viết 2-3 câu đơn giản miêu tả hoạt động của trẻ em và thời tiết trong công viên.",
    "imageHint": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&auto=format&fit=crop&q=80",
    "scenario": "Trẻ em đang vui đùa trên bãi cỏ xanh mát dưới ánh nắng ấm áp buổi chiều.",
    "targetWords": [
      "children",
      "play",
      "park",
      "sunny",
      "grass"
    ],
    "targetGrammar": "Present Continuous: The children are playing / The sun is shining",
    "sampleAnswer": "The children are playing happily in the park. The weather is sunny and bright. They run on the green grass.",
    "category": "Daily Life",
    "minWords": 10,
    "maxWords": 50
  },
  {
    "id": "see-write-a1-kitchen",
    "mode": "see-write",
    "difficulty": "A1",
    "title": "Cooking Dinner with Family",
    "instruction": "Miêu tả một gia đình đang cùng nhau chuẩn bị bữa tối trong căn bếp ấm cúng.",
    "imageHint": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=700&auto=format&fit=crop&q=80",
    "scenario": "Bố mẹ và con gái cùng cắt rau củ và nấu súp trong gian bếp.",
    "targetWords": [
      "cook",
      "kitchen",
      "vegetables",
      "dinner",
      "family"
    ],
    "targetGrammar": "Present Simple: We cook / She cuts",
    "sampleAnswer": "My family cooks dinner together in the kitchen. My mother cuts fresh vegetables and my father makes hot soup.",
    "category": "Home & Family",
    "minWords": 12,
    "maxWords": 50
  },
  {
    "id": "see-write-a1-market",
    "mode": "see-write",
    "difficulty": "A1",
    "title": "Buying Fresh Fruits at the Market",
    "instruction": "Hãy viết 2-3 câu về việc mua trái cây tươi tại chợ địa phương.",
    "imageHint": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&auto=format&fit=crop&q=80",
    "scenario": "Quầy hoa quả đầy màu sắc với táo, cam, chuối tươi ngon.",
    "targetWords": [
      "buy",
      "fruit",
      "apples",
      "fresh",
      "market"
    ],
    "targetGrammar": "There is / There are & I want to buy",
    "sampleAnswer": "There are many fresh fruits at the market. I want to buy red apples and sweet bananas for my brother.",
    "category": "Shopping",
    "minWords": 10,
    "maxWords": 45
  },
  {
    "id": "see-write-a2-library",
    "mode": "see-write",
    "difficulty": "A2",
    "title": "Quiet Study Afternoon in the Library",
    "instruction": "Mô tả không gian yên tĩnh và thói quen học tập của sinh viên trong thư viện trường.",
    "imageHint": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&auto=format&fit=crop&q=80",
    "scenario": "Các bạn sinh viên chăm chú đọc sách và gõ máy tính bên những giá sách cao ngút ngàn.",
    "targetWords": [
      "library",
      "students",
      "quiet",
      "research",
      "concentrate"
    ],
    "targetGrammar": "Modal verbs: must / should keep quiet",
    "sampleAnswer": "The university library is very quiet and peaceful today. Students are sitting at wooden desks to study and do research. Everyone must turn off their phone ringtones.",
    "category": "Education",
    "minWords": 18,
    "maxWords": 65
  },
  {
    "id": "see-write-a2-airport",
    "mode": "see-write",
    "difficulty": "A2",
    "title": "Waiting at the Departure Gate",
    "instruction": "Quan sát hành khách chờ lên máy bay tại sân bay quốc tế và miêu tả cảm xúc chuyến đi.",
    "imageHint": "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=700&auto=format&fit=crop&q=80",
    "scenario": "Hành khách mang hành lý xách tay đang nhìn ra đường băng ngắm máy bay cất cánh.",
    "targetWords": [
      "airport",
      "flight",
      "luggage",
      "passenger",
      "excited"
    ],
    "targetGrammar": "Be going to / Present continuous for future plans",
    "sampleAnswer": "Many passengers are waiting at gate number seven. They are checking their passports and boarding passes. Everyone is excited because they are going to fly to Da Nang.",
    "category": "Travel",
    "minWords": 20,
    "maxWords": 70
  },
  {
    "id": "see-write-a2-cycling",
    "mode": "see-write",
    "difficulty": "A2",
    "title": "Eco-Friendly Morning Commute by Bicycle",
    "instruction": "Mô tả người dân đạp xe đi làm qua cây cầu thơ mộng vào buổi sớm.",
    "imageHint": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&auto=format&fit=crop&q=80",
    "scenario": "Người đi xe đạp tận hưởng làn gió mát và không khí trong lành ven sông.",
    "targetWords": [
      "bicycle",
      "commute",
      "bridge",
      "healthy",
      "environment"
    ],
    "targetGrammar": "Adverbs of frequency: usually, often & Gerunds: cycling is good for health",
    "sampleAnswer": "Many city dwellers ride their bicycles across the bridge every morning. Cycling to work helps protect the environment and keeps people healthy and energetic.",
    "category": "Environment & Health",
    "minWords": 20,
    "maxWords": 70
  },
  {
    "id": "see-write-b1-coding",
    "mode": "see-write",
    "difficulty": "B1",
    "title": "Software Engineers Debugging Code",
    "instruction": "Miêu tả hai lập trình viên đang thảo luận cách sửa lỗi hệ thống trước màn hình hiển thị code.",
    "imageHint": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop&q=80",
    "scenario": "Cặp đôi lập trình viên phân tích log lỗi và kiểm thử luồng API mới.",
    "targetWords": [
      "developer",
      "algorithm",
      "troubleshoot",
      "collaboration",
      "efficient"
    ],
    "targetGrammar": "First Conditional / Relative clauses: who / which",
    "sampleAnswer": "Two software developers are collaborating closely to troubleshoot a critical database performance issue. By analyzing server logs together, they can optimize algorithm execution and deploy a stable build.",
    "category": "Technology",
    "minWords": 25,
    "maxWords": 85
  },
  {
    "id": "see-write-b1-presentation",
    "mode": "see-write",
    "difficulty": "B1",
    "title": "Pitching a Startup Idea to Investors",
    "instruction": "Mô tả một nhà sáng lập đang thuyết trình kế hoạch kinh doanh trước hội đồng ban giám khảo.",
    "imageHint": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&auto=format&fit=crop&q=80",
    "scenario": "Diễn giả tự tin giải thích biểu đồ tăng trưởng doanh thu và tiềm năng thị trường.",
    "targetWords": [
      "pitch",
      "investor",
      "revenue",
      "strategy",
      "convincing"
    ],
    "targetGrammar": "Passive voice: The strategy is presented / Funds were raised",
    "sampleAnswer": "The startup founder delivers a convincing presentation to international investors. Projected quarterly revenues and customer retention metrics are highlighted clearly on the main screen to secure seed funding.",
    "category": "Business",
    "minWords": 25,
    "maxWords": 85
  },
  {
    "id": "see-write-b1-organic-farm",
    "mode": "see-write",
    "difficulty": "B1",
    "title": "Harvesting Organic Vegetables in a Greenhouse",
    "instruction": "Mô tả người nông dân thu hoạch nông sản hữu cơ trong nhà kính hiện đại không dùng hóa chất.",
    "imageHint": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=700&auto=format&fit=crop&q=80",
    "scenario": "Cà chua bi và rau xà lách tươi xanh được thu hoạch cẩn thận xếp vào sọt gỗ.",
    "targetWords": [
      "harvest",
      "organic",
      "greenhouse",
      "sustainable",
      "nutritious"
    ],
    "targetGrammar": "Present Perfect: Farmers have cultivated / Quality has improved",
    "sampleAnswer": "Modern farmers have adopted organic techniques to cultivate vegetables inside temperature-controlled greenhouses. By eliminating synthetic pesticides, they produce nutritious crops that support ecological sustainability.",
    "category": "Agriculture",
    "minWords": 25,
    "maxWords": 85
  },
  {
    "id": "see-write-b2-robotics",
    "mode": "see-write",
    "difficulty": "B2",
    "title": "Automated Assembly Line with Industrial Robotics",
    "instruction": "Phân tích và mô tả tác động của cánh tay robot tự động hóa trong quy trình sản xuất xe hơi thông minh.",
    "imageHint": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&auto=format&fit=crop&q=80",
    "scenario": "Cánh tay robot hàn và lắp ráp linh kiện xe điện với độ chuẩn xác micromet.",
    "targetWords": [
      "automation",
      "precision",
      "manufacture",
      "efficiency",
      "integration"
    ],
    "targetGrammar": "Complex sentences with subordinating conjunctions (whereas, while, in order to)",
    "sampleAnswer": "Robotic manipulators operate on the automated assembly line with sub-millimeter precision in order to manufacture next-generation electric vehicles. While this technological integration dramatically accelerates throughput, it demands ongoing technician upskilling.",
    "category": "Technology & Industry",
    "minWords": 30,
    "maxWords": 100
  },
  {
    "id": "see-write-b2-renewable-field",
    "mode": "see-write",
    "difficulty": "B2",
    "title": "Wind Farm Against the Sunset Sky",
    "instruction": "Viết đoạn văn ngắn đánh giá vai trò của điện gió trong chiến lược cắt giảm phát thải nhà kính quốc gia.",
    "imageHint": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&auto=format&fit=crop&q=80",
    "scenario": "Dãy tuabin gió sừng sững trên đỉnh đồi quay đều dưới ánh hoàng hôn tráng lệ.",
    "targetWords": [
      "turbine",
      "renewable",
      "decarbonization",
      "capacity",
      "infrastructure"
    ],
    "targetGrammar": "Inversion or Participle clauses: Harnessing aerodynamic currents...",
    "sampleAnswer": "Harnessing aerodynamic kinetic energy across coastal highlands, wind turbine arrays constitute an indispensable pillar of modern grid decarbonization. Expanding installed capacity enables municipalities to phase out fossil fuel reliance sustainably.",
    "category": "Environment",
    "minWords": 30,
    "maxWords": 100
  },
  {
    "id": "see-write-b2-urban-transit",
    "mode": "see-write",
    "difficulty": "B2",
    "title": "Metropolitan Rail Network at Peak Hour",
    "instruction": "Mô tả và bình luận về hiệu quả điều tiết giao thông của hệ thống tàu điện ngầm đô thị vào giờ cao điểm.",
    "imageHint": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=700&auto=format&fit=crop&q=80",
    "scenario": "Đoàn tàu hiện đại tấp nập đón trả hàng nghìn hành khách tại ga trung tâm.",
    "targetWords": [
      "metropolitan",
      "commute",
      "congestion",
      "transit",
      "decentralize"
    ],
    "targetGrammar": "Noun clauses: It is evident that / What makes mass transit essential is...",
    "sampleAnswer": "It is evident that high-frequency metropolitan transit systems relieve severe surface street congestion during morning rush hours. What makes electrified mass transit indispensable is its unparalleled capacity to ferry millions swiftly and punctually.",
    "category": "Urban Planning",
    "minWords": 30,
    "maxWords": 100
  },
  {
    "id": "guided-a1-my-pet",
    "mode": "guided",
    "difficulty": "A1",
    "title": "My Beloved Pet",
    "instruction": "Viết một đoạn văn ngắn giới thiệu về thú cưng yêu thích theo 4 gợi ý bên dưới.",
    "scenario": "Chia sẻ về người bạn bốn chân gắn bó trong ngôi nhà của bạn.",
    "targetWords": [
      "pet",
      "friendly",
      "fur",
      "play",
      "love"
    ],
    "targetGrammar": "Have/Has got & Adjectives of appearance",
    "sampleAnswer": "I have a cute dog named Max. He has brown fur and big ears. Every afternoon, we play with a ball in the garden. I love him because he is very friendly.",
    "category": "Pets & Animals",
    "minWords": 25,
    "maxWords": 60,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "What kind of pet do you have, and what is its name?",
        "hint": "I have a ... named ...",
        "samplePhrase": "I have a playful puppy named Lucky."
      },
      {
        "stepNumber": 2,
        "question": "What does your pet look like?",
        "hint": "Describe color, fur, eyes",
        "samplePhrase": "He has soft white fur and bright black eyes."
      },
      {
        "stepNumber": 3,
        "question": "What do you two usually do together?",
        "hint": "Walk, play fetch, cuddle",
        "samplePhrase": "We usually go for a walk in the park after school."
      },
      {
        "stepNumber": 4,
        "question": "Why do you love your pet so much?",
        "hint": "Because it makes me happy / loyal",
        "samplePhrase": "I love him because he always welcomes me at the door."
      }
    ]
  },
  {
    "id": "guided-a2-vacation-letter",
    "mode": "guided",
    "difficulty": "A2",
    "title": "A Postcard from Your Summer Vacation",
    "instruction": "Viết một bức thư bưu thiếp ngắn gửi cho bạn thân kể về kỳ nghỉ hè của bạn.",
    "scenario": "Gửi lời chào và cập nhật từ một bãi biển tuyệt đẹp bạn vừa tới thăm.",
    "targetWords": [
      "postcard",
      "vacation",
      "seafood",
      "sunbathe",
      "souvenir"
    ],
    "targetGrammar": "Past Simple tense (visited, ate, stayed)",
    "sampleAnswer": "Dear Lan, Greetings from Nha Trang! I arrived here three days ago with my cousins. Yesterday, we swam in the turquoise sea and ate delicious grilled seafood. Tomorrow, we will visit Vinpearl Land. Wish you were here! Best, Minh.",
    "category": "Travel & Letters",
    "minWords": 35,
    "maxWords": 80,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Where are you spending your vacation and who are you with?",
        "hint": "Mention destination and companions",
        "samplePhrase": "I am currently vacationing in Da Lat with my best friends."
      },
      {
        "stepNumber": 2,
        "question": "What did you do yesterday?",
        "hint": "Use Past Simple verbs",
        "samplePhrase": "Yesterday, we rented motorbikes and visited a beautiful flower garden."
      },
      {
        "stepNumber": 3,
        "question": "What is the food and local weather like?",
        "hint": "Cool, chilly, spicy, savory",
        "samplePhrase": "The weather is cool and breezy, and the street food is amazing."
      },
      {
        "stepNumber": 4,
        "question": "What are your plans for tomorrow before returning home?",
        "hint": "Use will or be going to",
        "samplePhrase": "Tomorrow we are going to buy local artichoke tea as souvenirs."
      }
    ]
  },
  {
    "id": "guided-a2-new-hobby",
    "mode": "guided",
    "difficulty": "A2",
    "title": "Starting a New Creative Hobby",
    "instruction": "Chia sẻ về một sở thích mới bạn vừa bắt đầu (nấu ăn, vẽ tranh, chơi nhạc cụ...).",
    "scenario": "Giải thích lý do bạn chọn sở thích này và cảm giác mỗi khi luyện tập.",
    "targetWords": [
      "hobby",
      "practice",
      "creative",
      "relaxing",
      "improve"
    ],
    "targetGrammar": "Enjoy / like + V-ing & Time expressions",
    "sampleAnswer": "Two months ago, I decided to learn acoustic guitar. At first, my fingertips hurt, but I practiced twenty minutes every evening. Playing music helps me relax after stressful exams. I hope to play my favorite pop song next month.",
    "category": "Personal Interests",
    "minWords": 35,
    "maxWords": 80,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "What new hobby did you pick up recently?",
        "hint": "I took up / started ...",
        "samplePhrase": "I started learning oil painting last month."
      },
      {
        "stepNumber": 2,
        "question": "How often and where do you practice it?",
        "hint": "Twice a week at home...",
        "samplePhrase": "I spend every Saturday morning painting in my sunlit bedroom."
      },
      {
        "stepNumber": 3,
        "question": "What difficulties did you encounter initially?",
        "hint": "Mixing colors, sore hands...",
        "samplePhrase": "Mixing complementary colors was quite challenging in the beginning."
      },
      {
        "stepNumber": 4,
        "question": "How does this hobby benefit your mental health?",
        "hint": "Relieves tension, inspires creativity...",
        "samplePhrase": "It completely clears my mind and inspires my creative imagination."
      }
    ]
  },
  {
    "id": "guided-b1-environmental-initiative",
    "mode": "guided",
    "difficulty": "B1",
    "title": "Campus Single-Use Plastic Reduction Proposal",
    "instruction": "Soạn một đề xuất ngắn gửi ban giám hiệu về chiến dịch giảm rác thải nhựa trong trường học.",
    "scenario": "Kiến nghị lắp đặt trạm nước miễn phí và cấm cốc nhựa dùng một lần tại căng tin.",
    "targetWords": [
      "initiative",
      "single-use",
      "refill",
      "sustainable",
      "awareness"
    ],
    "targetGrammar": "Modal suggestions: ought to, recommend that, propose",
    "sampleAnswer": "I am writing to propose a comprehensive single-use plastic reduction initiative on our campus. Our student council recommends installing automated water refilling stations in every academic building. Furthermore, the cafeteria ought to offer discounts to students bringing reusable tumblers. This policy will foster environmental responsibility.",
    "category": "Environment & Campus",
    "minWords": 45,
    "maxWords": 100,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "State the current environmental issue on campus.",
        "hint": "Excessive disposable cups and plastic bottles...",
        "samplePhrase": "Our university generates thousands of disposable beverage cups every week."
      },
      {
        "stepNumber": 2,
        "question": "Propose two concrete measures to mitigate the waste.",
        "hint": "Water stations, cafeteria incentives...",
        "samplePhrase": "We propose installing touchless water refill stations and offering discounts for reusable mugs."
      },
      {
        "stepNumber": 3,
        "question": "Explain how students will be encouraged to participate.",
        "hint": "Awareness workshops, social media challenges...",
        "samplePhrase": "A campus-wide green ambassador campaign will actively engage freshmen."
      },
      {
        "stepNumber": 4,
        "question": "Conclude with the expected long-term institutional benefit.",
        "hint": "Cut carbon emissions, build eco-friendly reputation...",
        "samplePhrase": "This policy will solidify our institution's reputation as a pioneer in sustainable education."
      }
    ]
  },
  {
    "id": "guided-b1-job-application-cover",
    "mode": "guided",
    "difficulty": "B1",
    "title": "Cover Letter for a Summer Internship",
    "instruction": "Viết một bức thư xin việc (cover letter) ứng tuyển vị trí thực tập sinh truyền thông số.",
    "scenario": "Trình bày trình độ học vấn, kỹ năng thiết kế và lý do muốn đóng góp cho công ty.",
    "targetWords": [
      "applicant",
      "internship",
      "qualified",
      "enthusiastic",
      "contribution"
    ],
    "targetGrammar": "Formal business letter structure & Present Perfect for experience",
    "sampleAnswer": "Dear Hiring Manager, I am writing to express my enthusiastic interest in the Digital Media Internship at your firm. As a third-year communications undergraduate, I have managed social media campaigns that boosted student club engagement by forty percent. I look forward to discussing how my graphic design skills can contribute to your team.",
    "category": "Career & Professional",
    "minWords": 45,
    "maxWords": 110,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Identify the target role and explain where you discovered the opening.",
        "hint": "I am writing to apply for the position of...",
        "samplePhrase": "I am writing to submit my application for the Junior Frontend Developer role."
      },
      {
        "stepNumber": 2,
        "question": "Highlight your key academic qualifications and hands-on projects.",
        "hint": "I have completed courses in... and developed...",
        "samplePhrase": "During my computer science degree, I built three full-stack web applications using React and TypeScript."
      },
      {
        "stepNumber": 3,
        "question": "Showcase soft skills and ability to thrive in a fast-paced environment.",
        "hint": "Teamwork, problem-solving, adaptability...",
        "samplePhrase": "I thrive in collaborative agile sprints and possess strong diagnostic debugging skills."
      },
      {
        "stepNumber": 4,
        "question": "Provide a polite closing call to action.",
        "hint": "Thank you for considering my application...",
        "samplePhrase": "Thank you for your time and consideration; I welcome the opportunity for an interview."
      }
    ]
  },
  {
    "id": "guided-b2-product-review",
    "mode": "guided",
    "difficulty": "B2",
    "title": "In-Depth Technological Product Review",
    "instruction": "Viết bài đánh giá khách quan về một thiết bị điện tử (tai nghe chống ồn, laptop, smartwatch) sau 1 tháng sử dụng.",
    "scenario": "Phân tích ưu điểm về pin và chất âm nhưng chỉ ra nhược điểm về giá thành và phần mềm.",
    "targetWords": [
      "ergonomic",
      "performance",
      "drawback",
      "benchmark",
      "recommendation"
    ],
    "targetGrammar": "Comparative structures & Concession clauses (despite, nevertheless)",
    "sampleAnswer": "Having tested the Apex Wireless Noise-Cancelling Headphones for thirty days, I find their acoustic performance and active cancellation truly remarkable. The battery comfortably survives thirty hours on a single charge. Nevertheless, the accompanying mobile app suffers from occasional sync latency. Despite its steep premium price, it remains a worthwhile investment for frequent travelers.",
    "category": "Technology & Consumer",
    "minWords": 50,
    "maxWords": 120,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Introduce the gadget and specify the testing period.",
        "hint": "Having used ... for over a month...",
        "samplePhrase": "Having utilized the Ultrabook Pro 14 for intensive programming over the past month..."
      },
      {
        "stepNumber": 2,
        "question": "Analyze its standout build quality and core performance merits.",
        "hint": "Exceptional battery endurance, vibrant display...",
        "samplePhrase": "Its aluminum chassis feels exceptionally rigid, while the M-series silicon handles heavy compilation effortlessly."
      },
      {
        "stepNumber": 3,
        "question": "Articulate critical flaws or areas needing firmware improvements.",
        "hint": "Thermal throttling, limited port selection...",
        "samplePhrase": "On the downside, thermal throttling emerges under prolonged multi-core rendering workloads."
      },
      {
        "stepNumber": 4,
        "question": "Deliver a nuanced final verdict and identify the ideal demographic.",
        "hint": "I would highly recommend this device to...",
        "samplePhrase": "Ultimately, I recommend this machine to mobile software engineers seeking uncompromising port travel convenience."
      }
    ]
  },
  {
    "id": "guided-c1-policy-brief",
    "mode": "guided",
    "difficulty": "C1",
    "title": "Executive Policy Brief on AI Algorithmic Accountability",
    "instruction": "Soạn một bản tóm tắt chính sách (policy memo) đề xuất khuôn khổ kiểm toán độc lập cho các mô hình AI trong y tế.",
    "scenario": "Tư vấn cho cơ quan quản lý y tế quốc gia về việc ngăn ngừa sai lệch chẩn đoán tự động.",
    "targetWords": [
      "accountability",
      "algorithmic",
      "transparency",
      "oversight",
      "mitigate"
    ],
    "targetGrammar": "Advanced formal syntax: Inverted conditionals (Should regulators fail to...), Nominalization",
    "sampleAnswer": "This policy memo delineates a rigorous oversight framework for clinical diagnostic artificial intelligence. To mitigate algorithmic demographic bias, healthcare providers must mandate third-party algorithmic audits prior to deployment. Should oversight committees fail to enforce algorithmic transparency, diagnostic disparities will disproportionately harm historically underserved demographics.",
    "category": "Governance & Technology",
    "minWords": 60,
    "maxWords": 140,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Frame the systemic challenge of opaque black-box machine learning in high-stakes clinical settings.",
        "hint": "Opaque deep-learning algorithms risk propagating diagnostic errors...",
        "samplePhrase": "The proliferation of uninterpretable deep neural networks in triage environments introduces grave liability and diagnostic hazards."
      },
      {
        "stepNumber": 2,
        "question": "Outline the statutory auditing mechanisms required before public health clearance.",
        "hint": "Mandatory demographic parity stress testing...",
        "samplePhrase": "Regulatory bodies must institute mandatory pre-deployment algorithmic stress testing across diverse demographic cohorts."
      },
      {
        "stepNumber": 3,
        "question": "Address industry pushback regarding proprietary trade secrets.",
        "hint": "Balancing intellectual property with public safety...",
        "samplePhrase": "While developers cite proprietary confidentiality, public health safety necessitates independent confidential code inspection."
      },
      {
        "stepNumber": 4,
        "question": "Synthesize the moral imperative of accountable algorithmic governance.",
        "hint": "Ensuring technology upholds the Hippocratic oath...",
        "samplePhrase": "Enforcing algorithmic traceability ensures that digital health innovation unequivocally reinforces equitable patient care."
      }
    ]
  },
  {
    "id": "free-a2-favorite-season",
    "mode": "free",
    "difficulty": "A2",
    "title": "My Favorite Season of the Year",
    "instruction": "Hãy viết một đoạn văn ngắn (50-80 từ) miêu tả mùa bạn yêu thích nhất trong năm và giải thích lý do.",
    "scenario": "Mùa thu lá vàng, mùa xuân hoa nở hay mùa hè sôi động mang lại cho bạn những cảm xúc gì?",
    "targetWords": [
      "season",
      "autumn",
      "weather",
      "leaves",
      "breeze"
    ],
    "targetGrammar": "Comparative adjectives (cooler, more pleasant) & Conjunctions (because, so)",
    "sampleAnswer": "Autumn is definitely my favorite season of the year. The weather becomes cooler and more pleasant after hot summer months. Golden leaves fall gracefully on the sidewalks, creating a romantic atmosphere. I love walking around West Lake in Hanoi with hot coffee and listening to acoustic songs.",
    "category": "Nature & Seasons",
    "minWords": 40,
    "maxWords": 90
  },
  {
    "id": "free-b1-remote-work-pros-cons",
    "mode": "free",
    "difficulty": "B1",
    "title": "The Dual Nature of Remote Working",
    "instruction": "Viết bài luận ngắn (80-120 từ) cân nhắc giữa lợi ích tự do thời gian và thử thách cô lập khi làm việc tại nhà.",
    "scenario": "Trình bày cả hai mặt của xu hướng làm việc từ xa (telecommuting) hiện nay.",
    "targetWords": [
      "telecommuting",
      "flexibility",
      "isolation",
      "distraction",
      "balance"
    ],
    "targetGrammar": "Transitions of contrast: On the one hand, However, On the other hand",
    "sampleAnswer": "Remote working has transformed modern employment patterns across the globe. On the one hand, employees enjoy unprecedented scheduling flexibility and eliminate grueling daily commutes, which substantially boosts work-life balance. On the other hand, prolonged telecommuting can trigger profound feelings of professional isolation and blurred boundaries between home and office duties. In conclusion, adopting a hybrid arrangement allows professionals to reap the autonomy of home work while preserving vital team cohesion.",
    "category": "Career & Society",
    "minWords": 70,
    "maxWords": 130
  },
  {
    "id": "free-b1-smartphones-in-class",
    "mode": "free",
    "difficulty": "B1",
    "title": "Should Smartphones Be Banned in Classrooms?",
    "instruction": "Nêu quan điểm của bạn về việc các trường phổ thông có nên cấm hoàn toàn điện thoại di động trong giờ học hay không.",
    "scenario": "Cân nhắc giữa nguy cơ mất tập trung chơi game và tiện ích tra cứu từ điển, tài liệu số.",
    "targetWords": [
      "distraction",
      "restriction",
      "digital literacy",
      "prohibit",
      "concentration"
    ],
    "targetGrammar": "Expressing opinions: In my perspective, It is argued that, Therefore",
    "sampleAnswer": "The debate over whether to prohibit smartphones in secondary school classrooms has intensified recently. Proponents argue that mobile devices cause acute attention deficit during lectures and facilitate academic dishonesty. However, completely banning handheld technology deprives students of learning essential digital literacy and utilizing rapid online lexical lookup tools. Therefore, rather than imposing blanket bans, schools should establish clear device etiquette guidelines, restricting smartphone usage exclusively to designated instructional exercises.",
    "category": "Education & Technology",
    "minWords": 70,
    "maxWords": 130
  },
  {
    "id": "free-b2-ielts-task2-urbanization",
    "mode": "free",
    "difficulty": "B2",
    "title": "IELTS Task 2: Urban Migration and Rural Depopulation",
    "instruction": "Write an academic response (100-150 words) analyzing the causes of youth rural exodus and proposing governmental solutions.",
    "scenario": "Young individuals increasingly abandon pastoral regions to settle in congested metropolises.",
    "targetWords": [
      "urbanization",
      "depopulation",
      "infrastructure",
      "subsidize",
      "disparity"
    ],
    "targetGrammar": "Complex cause-and-effect structures: Consequently, Due to, By investing in...",
    "sampleAnswer": "In recent decades, rural depopulation has accelerated as ambitious youth migrate en masse toward sprawling metropolitan clusters. This exodus is primarily driven by stark regional socio-economic disparities, particularly the concentration of tertiary universities and lucrative corporate careers in capital cities. Consequently, pastoral communities suffer severe agrarian labor shortages. To stem this demographic hemorrhage, national administrations must decentralize infrastructure funding, subsidizing high-speed fiber internet and regional technology incubators so that rural entrepreneurship flourishes.",
    "category": "IELTS Academic Writing",
    "minWords": 90,
    "maxWords": 160
  },
  {
    "id": "free-b2-ielts-task2-tourism",
    "mode": "free",
    "difficulty": "B2",
    "title": "IELTS Task 2: Cultural Commercialization vs Authentic Heritage",
    "instruction": "Discuss whether international tourism preserves or distorts native traditions and cultural heritage (100-150 words).",
    "scenario": "Evaluate the commercial exploitation of sacred festivals and ancient architecture.",
    "targetWords": [
      "authenticity",
      "commodification",
      "preservation",
      "revenue",
      "indigenous"
    ],
    "targetGrammar": "Subjunctive and modal conditionals: Were governments to regulate...",
    "sampleAnswer": "Global tourism acts as a double-edged sword for indigenous heritage preservation. On one hand, tourist influx generates substantial fiscal revenue that municipalities channel into restoring crumbling historical landmarks and reviving dormant craft traditions. Conversely, mass tourism frequently leads to cultural commodification, reducing sacred ancestral rituals to superficial commercial spectacles designed for quick snapshots. To mitigate this dilution, sustainable eco-tourism regulations must empower local communities to curate educational visitor experiences without compromising spiritual integrity.",
    "category": "IELTS Academic Writing",
    "minWords": 90,
    "maxWords": 160
  },
  {
    "id": "free-b2-tourism-space",
    "mode": "free",
    "difficulty": "B2",
    "title": "Commercial Space Tourism: Triumph or Vanity?",
    "instruction": "Share your viewpoint on ultra-wealthy private space travel in the face of pressing terrestrial crises (100-150 words).",
    "scenario": "Weigh reusable rocketry innovation against carbon emissions and social inequality.",
    "targetWords": [
      "suborbital",
      "expenditure",
      "astronomical",
      "inequality",
      "breakthrough"
    ],
    "targetGrammar": "Discourse markers: Given that, Not only... but also, Nevertheless",
    "sampleAnswer": "The emergence of suborbital space tourism for billionaire patrons has triggered ferocious ethical debate. Critics contend that spending astronomical fortunes on ten-minute microgravity joyrides is offensive given catastrophic planetary climate change and poverty. Nevertheless, the commercial rocketry competition underpinning space tourism has dramatically compressed launch costs and stimulated vital reusable propulsion engineering. If technological spin-offs enhance solar capture or satellite monitoring, commercial space investments may ultimately benefit terrestrial ecology.",
    "category": "Science & Society",
    "minWords": 90,
    "maxWords": 160
  },
  {
    "id": "free-c1-ielts-task2-automation-ethics",
    "mode": "free",
    "difficulty": "C1",
    "title": "C1 Essay: Algorithmic Adjudication and Judicial Fairness",
    "instruction": "Critically analyze the proposition that predictive machine learning algorithms should determine criminal sentencing (120-180 words).",
    "scenario": "Evaluate algorithmic bias, constitutional due process, and human empathy in jurisprudence.",
    "targetWords": [
      "jurisprudence",
      "recidivism",
      "discriminatory",
      "impartiality",
      "adjudication"
    ],
    "targetGrammar": "Advanced rhetorical syntax, cleft sentences (What is at stake is...), passive nominalizations",
    "sampleAnswer": "The proposition to automate judicial sentencing via predictive recidivism algorithms represents an existential peril to constitutional jurisprudence. While proponents champion algorithmic mathematical impartiality as an antidote to human cognitive bias, empirical analyses demonstrate that risk-assessment algorithms merely codify and obscure historical socio-economic discrimination within black-box mathematical architectures. Sentencing is not an arithmetic optimization exercise; it fundamentally demands individualized moral culpability assessments and empathetic discretion that software cannot replicate. What is at stake is the very foundation of natural justice.",
    "category": "Ethics & Law",
    "minWords": 110,
    "maxWords": 200
  },
  {
    "id": "free-c1-biodiversity-financialization",
    "mode": "free",
    "difficulty": "C1",
    "title": "C1 Essay: Financialization of Natural Ecosystem Services",
    "instruction": "Evaluate the moral and economic implications of pricing biodiversity and carbon offsets in financial markets (120-180 words).",
    "scenario": "Discuss whether assigning monetary prices to natural biospheres prevents or accelerates ecological destruction.",
    "targetWords": [
      "financialization",
      "monetize",
      "ecosystem",
      "incommensurable",
      "commodification"
    ],
    "targetGrammar": "Fronting / Inversion: Under no circumstances should..., Subjunctive constructions",
    "sampleAnswer": "Attempting to arrest planetary ecological collapse through biodiversity offset credits represents a profound category error. By translating delicate, irreplaceable trophic networks into fungible monetary instruments, market conservation frameworks subordinate ecological survival to speculative financial trading. Under no circumstances can the intrinsic, millions-of-years evolutionary value of ancient primary rainforests be rendered commensurable with corporate carbon debt. When biospheres become balance-sheet assets, ecological stewardship is compromised for quarterly liquidity, exacerbating the very extractivism it purported to rectify.",
    "category": "Economics & Ecology",
    "minWords": 110,
    "maxWords": 200
  },
  {
    "id": "see-write-a1-breakfast",
    "mode": "see-write",
    "difficulty": "A1",
    "title": "Healthy Morning Breakfast Table",
    "instruction": "Hãy viết 2-3 câu mô tả đĩa đồ ăn sáng và ly nước cam trên bàn ăn.",
    "imageHint": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&auto=format&fit=crop&q=80",
    "scenario": "Bánh mì nướng giòn, trứng ốp la và ly nước cam tươi mát trên bàn gỗ.",
    "targetWords": [
      "toast",
      "orange juice",
      "egg",
      "breakfast",
      "tasty"
    ],
    "targetGrammar": "I like to eat / There is a glass of...",
    "sampleAnswer": "There is a plate of hot toast and eggs on the table. I drink a fresh glass of orange juice. This breakfast is very tasty and healthy.",
    "category": "Food & Drink",
    "minWords": 10,
    "maxWords": 45
  },
  {
    "id": "see-write-a2-rainy-city",
    "mode": "see-write",
    "difficulty": "A2",
    "title": "Walking in the Rain with Umbrellas",
    "instruction": "Mô tả dòng người cầm ô đủ màu sắc đi bộ dưới cơn mưa rào thành phố.",
    "imageHint": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=700&auto=format&fit=crop&q=80",
    "scenario": "Ánh đèn đường phản chiếu lung linh trên mặt đường ướt sũng.",
    "targetWords": [
      "rain",
      "umbrella",
      "street",
      "reflection",
      "puddle"
    ],
    "targetGrammar": "While / As clauses: While it is raining, people carry umbrellas...",
    "sampleAnswer": "Heavy rain is falling across the downtown avenue. People are holding colorful umbrellas to stay dry while walking past coffee shops. Streetlights reflect beautifully in large water puddles.",
    "category": "Weather & City",
    "minWords": 18,
    "maxWords": 65
  },
  {
    "id": "see-write-a2-beach-volleyball",
    "mode": "see-write",
    "difficulty": "A2",
    "title": "Exciting Beach Volleyball Match",
    "instruction": "Mô tả nhóm thanh niên đang chơi bóng chuyền bãi biển vào kỳ nghỉ cuối tuần.",
    "imageHint": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=700&auto=format&fit=crop&q=80",
    "scenario": "Những cú nhảy đập bóng ngoạn mục trên bãi cát vàng chan hòa nắng gió.",
    "targetWords": [
      "volleyball",
      "beach",
      "jump",
      "team",
      "energy"
    ],
    "targetGrammar": "Action verbs & Adverbs: jumping high, cheering loudly",
    "sampleAnswer": "A group of athletic friends is playing volleyball on the sandy beach. One player jumps high to spike the white ball across the net. Everyone is cheering loudly under the bright afternoon sun.",
    "category": "Sports & Leisure",
    "minWords": 18,
    "maxWords": 65
  },
  {
    "id": "see-write-b1-doctor-consultation",
    "mode": "see-write",
    "difficulty": "B1",
    "title": "Pediatric Doctor Examining a Patient",
    "instruction": "Mô tả bác sĩ đang ân cần kiểm tra sức khỏe và dặn dò bệnh nhân nhỏ tuổi tại phòng khám.",
    "imageHint": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&auto=format&fit=crop&q=80",
    "scenario": "Bác sĩ dùng ống nghe kiểm tra nhịp tim và trao nụ cười khích lệ cậu bé.",
    "targetWords": [
      "physician",
      "stethoscope",
      "consultation",
      "reassure",
      "examination"
    ],
    "targetGrammar": "Modal verbs of advice: should rest, ought to take medicine",
    "sampleAnswer": "The physician uses a stethoscope to examine the young patient's heartbeat in a well-equipped clinic. She smiles warmly to reassure the child while explaining that he should rest and drink plenty of warm fluids to recover quickly.",
    "category": "Healthcare",
    "minWords": 25,
    "maxWords": 80
  },
  {
    "id": "see-write-b1-construction-architecture",
    "mode": "see-write",
    "difficulty": "B1",
    "title": "Architect Reviewing Blueprints on Site",
    "instruction": "Mô tả kỹ sư trưởng đội mũ bảo hộ đang đối chiếu bản vẽ kỹ thuật với tòa nhà đang thi công.",
    "imageHint": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&auto=format&fit=crop&q=80",
    "scenario": "Công trường xây dựng hiện đại với cần cẩu tháp và kết cấu thép đồ sộ.",
    "targetWords": [
      "blueprint",
      "architect",
      "construction",
      "scaffolding",
      "structural"
    ],
    "targetGrammar": "Present Perfect Continuous: have been constructing / have been checking",
    "sampleAnswer": "Wearing a protective yellow helmet, the structural architect examines architectural blueprints directly at the construction site. Engineers have been working meticulously to ensure that the steel scaffolding conforms strictly to rigorous seismic safety standards.",
    "category": "Architecture & Engineering",
    "minWords": 25,
    "maxWords": 85
  },
  {
    "id": "see-write-b2-art-gallery",
    "mode": "see-write",
    "difficulty": "B2",
    "title": "Visitors Contemplating Contemporary Art",
    "instruction": "Bình luận về không gian trưng bày tranh trừu tượng và sự tương tác cảm xúc của khách tham quan triển lãm.",
    "imageHint": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=700&auto=format&fit=crop&q=80",
    "scenario": "Khách tham quan đứng tĩnh lặng trước bức tranh khổ lớn mang gam màu tương phản mạnh mẽ.",
    "targetWords": [
      "contemplate",
      "contemporary",
      "abstract",
      "provocative",
      "aesthetic"
    ],
    "targetGrammar": "Participle phrases: Standing silently before the canvas, visitors reflect on...",
    "sampleAnswer": "Standing silently before an expansive minimalist canvas, gallery visitors contemplate the provocative emotional tension evoked by conflicting color fields. The serene museum lighting accentuates nuanced textural brushstrokes, inviting spectators to construct deeply subjective aesthetic interpretations.",
    "category": "Arts & Culture",
    "minWords": 30,
    "maxWords": 95
  },
  {
    "id": "see-write-b2-satellite-launch",
    "mode": "see-write",
    "difficulty": "B2",
    "title": "Orbital Rocket Ignition at Cape Canaveral",
    "instruction": "Mô tả khoảnh khắc tên lửa vũ trụ kích hoạt động cơ đẩy bùng cháy và bay vút vào bầu khí quyển.",
    "imageHint": "https://images.unsplash.com/photo-1517976487515-5606d507b9a5?w=700&auto=format&fit=crop&q=80",
    "scenario": "Cột khói lửa khổng lồ nâng tên lửa vượt qua tầng đối lưu hướng vào quỹ đạo Trái Đất.",
    "targetWords": [
      "propulsion",
      "trajectory",
      "ignition",
      "orbital",
      "aerodynamic"
    ],
    "targetGrammar": "Inversion with negative adverbs: Scarcely had the engines ignited when...",
    "sampleAnswer": "Upon ignition, multi-stage cryogenic rocket thrusters unleash immense kinetic propulsion, illuminating the coastal launch pad with searing plasma flames. As the vehicle ascents along its precalculated parabolic trajectory, onboard telemetry systems continuously relay guidance parameters to ground mission control.",
    "category": "Space Exploration",
    "minWords": 30,
    "maxWords": 100
  },
  {
    "id": "see-write-b2-3d-prosthetics",
    "mode": "see-write",
    "difficulty": "B2",
    "title": "3D-Printed Bionic Arm Calibration",
    "instruction": "Mô tả một kỹ sư y sinh đang tinh chỉnh cánh tay giả sinh học thông minh điều khiển bằng tín hiệu cơ điện.",
    "imageHint": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&auto=format&fit=crop&q=80",
    "scenario": "Cánh tay giả bằng titan và carbon kết nối với máy tính để hiệu chuẩn cảm biến thần kinh.",
    "targetWords": [
      "prosthetic",
      "bionic",
      "calibrate",
      "myoelectric",
      "biomechanical"
    ],
    "targetGrammar": "Conditional type 3 or mixed conditionals: Had additive manufacturing not evolved...",
    "sampleAnswer": "A biomedical engineer meticulously calibrates myoelectric sensor electrodes embedded inside a lightweight 3D-printed bionic limb. By mapping subtle muscle twitches to robotic finger articulations, this biomechanical advancement empowers amputees to regain natural dexterity and tactile independence.",
    "category": "Biomedical Engineering",
    "minWords": 30,
    "maxWords": 100
  },
  {
    "id": "guided-a1-daily-schedule",
    "mode": "guided",
    "difficulty": "A1",
    "title": "My Typical Weekday Schedule",
    "instruction": "Viết đoạn văn ngắn miêu tả thời gian biểu một ngày bình thường của bạn từ sáng đến tối.",
    "scenario": "Chia sẻ về giờ giấc thức dậy, đi học/đi làm và giải trí buổi tối.",
    "targetWords": [
      "wake up",
      "school",
      "lunch",
      "homework",
      "sleep"
    ],
    "targetGrammar": "Prepositions of time: at 7:00 AM, in the morning, on weekdays",
    "sampleAnswer": "On weekdays, I wake up at six thirty in the morning and wash my face. I take the bus to school at seven fifteen. In the afternoon, I study English and play badminton with friends. After doing homework, I go to bed at ten thirty.",
    "category": "Daily Routine",
    "minWords": 25,
    "maxWords": 60,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "What time do you usually wake up on weekdays?",
        "hint": "I usually wake up at ...",
        "samplePhrase": "I wake up at six o'clock every morning."
      },
      {
        "stepNumber": 2,
        "question": "How do you commute to school or work?",
        "hint": "I go by bike / bus / walk...",
        "samplePhrase": "I ride my bicycle to school after eating a quick breakfast."
      },
      {
        "stepNumber": 3,
        "question": "What is your main afternoon activity?",
        "hint": "Classes, gym, work...",
        "samplePhrase": "In the afternoon, I attend computer science lectures and study in the library."
      },
      {
        "stepNumber": 4,
        "question": "How do you unwind before going to sleep?",
        "hint": "Listen to music, read a book...",
        "samplePhrase": "I listen to soothing acoustic music before falling asleep at eleven."
      }
    ]
  },
  {
    "id": "guided-a2-favorite-movie",
    "mode": "guided",
    "difficulty": "A2",
    "title": "Review of a Film You Loved",
    "instruction": "Kể về một bộ phim đáng nhớ mà bạn từng xem tại rạp hoặc trên mạng theo các bước hướng dẫn.",
    "scenario": "Tên phim, thể loại, nhân vật ấn tượng và bài học rút ra.",
    "targetWords": [
      "movie",
      "character",
      "actor",
      "plot",
      "emotional"
    ],
    "targetGrammar": "Relative clauses: which is directed by / who is played by",
    "sampleAnswer": "Last weekend I watched 'Interstellar', which is a famous science-fiction film directed by Christopher Nolan. The main character is Cooper, an astronaut who travels through a wormhole to find a new home for humanity. The special effects were breathtaking and the soundtrack made me emotional. I recommend this masterpiece to everyone.",
    "category": "Entertainment",
    "minWords": 35,
    "maxWords": 85,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "What is the movie title and what genre does it belong to?",
        "hint": "It is a comedy / sci-fi / animation...",
        "samplePhrase": "My all-time favorite movie is 'Coco', an animated fantasy film produced by Pixar."
      },
      {
        "stepNumber": 2,
        "question": "Who is the central character and what is their quest?",
        "hint": "The protagonist is a boy who dreams of...",
        "samplePhrase": "The story follows Miguel, a young Mexican boy who dreams of becoming a musician."
      },
      {
        "stepNumber": 3,
        "question": "Which visual or musical elements impressed you the most?",
        "hint": "Vibrant colors, memorable soundtrack...",
        "samplePhrase": "The Land of the Dead was portrayed with stunning glowing bridges and catchy acoustic songs."
      },
      {
        "stepNumber": 4,
        "question": "What meaningful life lesson did you learn from the film?",
        "hint": "Family bonds, remembering ancestors...",
        "samplePhrase": "It taught me that family love transcends physical boundaries as long as we remember them."
      }
    ]
  },
  {
    "id": "guided-b1-reschedule-email",
    "mode": "guided",
    "difficulty": "B1",
    "title": "Professional Appointment Rescheduling Email",
    "instruction": "Viết email trang trọng gửi đối tác để xin hoãn cuộc họp do phát sinh sự cố khẩn cấp.",
    "scenario": "Xin lỗi vì sự bất tiện và đề xuất 2 khung giờ thay thế trong tuần sau.",
    "targetWords": [
      "reschedule",
      "unforeseen",
      "inconvenience",
      "availability",
      "confirm"
    ],
    "targetGrammar": "Polite modals: Would it be possible to..., I apologize for any inconvenience caused",
    "sampleAnswer": "Dear Mr. Davies, I am writing to respectfully request rescheduling our project status meeting originally slated for this Thursday at 2:00 PM. Due to an unforeseen urgent client escalation, I must travel offsite. Would it be possible to convene next Tuesday at 10:00 AM or Wednesday at 3:00 PM instead? I sincerely apologize for any inconvenience caused and await your confirmation. Sincerely, Hoang Nam.",
    "category": "Business Communication",
    "minWords": 45,
    "maxWords": 105,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "State the purpose of the email and reference the original meeting time.",
        "hint": "I am writing to inquire about rescheduling our appointment on...",
        "samplePhrase": "I am writing to request a postponement of our consultation scheduled for Friday morning."
      },
      {
        "stepNumber": 2,
        "question": "Provide a professional, concise reason without oversharing personal details.",
        "hint": "Due to unforeseen circumstances / conflicting schedule...",
        "samplePhrase": "Owing to an unexpected family emergency, I will be unavailable to attend our session in person."
      },
      {
        "stepNumber": 3,
        "question": "Propose two specific alternative time slots.",
        "hint": "Could we reschedule to either Monday at 9 AM or Thursday at 2 PM?",
        "samplePhrase": "Would either Monday afternoon at 3:00 PM or Thursday morning at 10:00 AM suit your schedule?"
      },
      {
        "stepNumber": 4,
        "question": "Offer a sincere apology for disruptions caused to their calendar.",
        "hint": "Please accept my apologies for the inconvenience...",
        "samplePhrase": "I deeply regret any disruption this adjustment may cause and look forward to your reply."
      }
    ]
  },
  {
    "id": "guided-b2-green-building-proposal",
    "mode": "guided",
    "difficulty": "B2",
    "title": "Biophilic Architecture and Rooftop Garden Proposal",
    "instruction": "Soạn thảo đề xuất cải tạo tòa nhà công sở thành không gian xanh tích hợp vườn trên mái.",
    "scenario": "Giải thích tác dụng giảm nhiệt bức xạ mặt trời và cải thiện tinh thần nhân viên.",
    "targetWords": [
      "biophilic",
      "insulation",
      "wellbeing",
      "retrofitting",
      "thermal"
    ],
    "targetGrammar": "Cleft sentences & Subordinating contrast (not only does it insulate, but it also...)",
    "sampleAnswer": "This memorandum proposes retrofitting our corporate headquarters with a biophilic rooftop garden and modular vertical green walls. Incorporating extensive vegetation not only delivers superior thermal insulation that reduces air conditioning power draw by twenty percent, but it also elevates employee mental wellbeing. What makes this environmental capital expenditure worthwhile is the rapid four-year payback period achieved through municipal energy rebates.",
    "category": "Architecture & Sustainability",
    "minWords": 50,
    "maxWords": 125,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Propose the specific architectural green retrofit.",
        "hint": "We propose retrofitting the facility with...",
        "samplePhrase": "We propose installing an extensive modular green roof and rainwater harvesting cistern on the main tower."
      },
      {
        "stepNumber": 2,
        "question": "Detail the thermodynamic and energy conservation dividends.",
        "hint": "Thermal insulation, reducing urban heat island effect...",
        "samplePhrase": "Soil vegetation absorbs intense solar irradiance, drastically lowering cooling expenditures during summer heatwaves."
      },
      {
        "stepNumber": 3,
        "question": "Address employee cognitive performance and stress alleviation.",
        "hint": "Exposure to natural foliage enhances concentration...",
        "samplePhrase": "Access to lush outdoor greenery provides restorative breaks that demonstrably combat corporate burnout."
      },
      {
        "stepNumber": 4,
        "question": "Provide financial justification through long-term utility savings.",
        "hint": "Lowering HVAC operating expenses and obtaining tax credits...",
        "samplePhrase": "The capital investment will be recouped within five years via diminished utility bills and government green certifications."
      }
    ]
  },
  {
    "id": "guided-c1-bci-ethics",
    "mode": "guided",
    "difficulty": "C1",
    "title": "Bioethics Advisory on Brain-Computer Neural Interfaces",
    "instruction": "Soạn bản khuyến nghị chính sách về quyền riêng tư thần kinh học (neurorights) trước sự bùng nổ của chip cấy não.",
    "scenario": "Cảnh báo nguy cơ dữ liệu sóng não bị doanh nghiệp khai thác thương mại và thao túng tâm lý.",
    "targetWords": [
      "neurorights",
      "subconscious",
      "commercialize",
      "cognitive liberty",
      "inviolable"
    ],
    "targetGrammar": "Advanced subjunctive and conditional structures (Were mental privacy not guaranteed...)",
    "sampleAnswer": "This bioethics advisory urges the codification of explicit 'neurorights' to shield subconscious cognitive privacy against commercial exploitation. As high-bandwidth invasive neural implants transition from neurological prosthetics into consumer gadgets, tech conglomerates risk acquiring unrestricted telemetry over individuals' raw affective states. Were cognitive liberty not enshrined as an inviolable human right, neuromarketing algorithms could manipulate human autonomy at the subconscious neurochemical level.",
    "category": "Neuroethics & Policy",
    "minWords": 60,
    "maxWords": 140,
    "guidedSteps": [
      {
        "stepNumber": 1,
        "question": "Identify the emergence of commercial neural implants beyond therapeutic medicine.",
        "hint": "The transition of neural interfaces into consumer lifestyle gadgets...",
        "samplePhrase": "The rapid commercialization of consumer-facing neural telemetry gadgets introduces unprecedented privacy frontiers."
      },
      {
        "stepNumber": 2,
        "question": "Expose the vulnerability of subconscious thought patterns to corporate harvesting.",
        "hint": "Neural readouts reveal political preferences, emotional states...",
        "samplePhrase": "Continuous electroencephalographic data streams allow algorithmic tracking of subconscious biometric intent and latent desires."
      },
      {
        "stepNumber": 3,
        "question": "Define and advocate for the universal right to 'cognitive liberty'.",
        "hint": "The fundamental right of individuals to retain sovereignty over their minds...",
        "samplePhrase": "International human rights charters must recognize cognitive liberty as an inviolable prerequisite for free will."
      },
      {
        "stepNumber": 4,
        "question": "Prescribe strict statutory penalties for unconsented neural data monetization.",
        "hint": "Banning commercial profiling on intracranial telemetry...",
        "samplePhrase": "Legislatures must outlaw the unauthorized monetization of intracranial brain data to safeguard mental sanctuary."
      }
    ]
  },
  {
    "id": "free-a2-letter-penpal",
    "mode": "free",
    "difficulty": "A2",
    "title": "A Friendly Letter to a New Penpal",
    "instruction": "Viết một bức thư ngắn (50-80 từ) gửi cho bạn qua thư người nước ngoài để giới thiệu về đất nước và đồ ăn Việt Nam.",
    "scenario": "Giới thiệu món phở bò, nón lá và mời bạn đến thăm vào dịp Tết.",
    "targetWords": [
      "penpal",
      "delicious",
      "traditional",
      "pho",
      "welcome"
    ],
    "targetGrammar": "Greetings & Invitations: I would like to invite you / You can try...",
    "sampleAnswer": "Dear Lucas, I am very glad to be your penpal! I live in Hanoi, the historic capital of Vietnam. Our country is famous for hospitable people and delicious street food like Pho and fresh spring rolls. In spring, we celebrate the Lunar New Year with colorful flowers. I would love to show you around if you visit Vietnam one day! Warm regards, Linh.",
    "category": "Culture & Letters",
    "minWords": 40,
    "maxWords": 90
  },
  {
    "id": "free-b1-fast-fashion-impact",
    "mode": "free",
    "difficulty": "B1",
    "title": "The Hidden Costs of Fast Fashion",
    "instruction": "Trình bày suy nghĩ của bạn (75-120 từ) về tác hại của việc mua sắm quần áo giá rẻ dùng một lần rồi vứt bỏ.",
    "scenario": "Liên hệ giữa xu hướng thời trang nhanh với ô nhiễm nguồn nước và rác thải bãi chôn lấp.",
    "targetWords": [
      "garment",
      "consumption",
      "synthetic",
      "landfill",
      "conscious"
    ],
    "targetGrammar": "Cause and consequence: Lead to, result in, encourage people to...",
    "sampleAnswer": "Fast fashion brands release new apparel collections weekly at extraordinarily cheap prices, enticing consumers to treat garments as disposable goods. However, this hyper-consumption creates severe environmental catastrophe. Synthetic fibers like polyester do not decompose, generating millions of tons of landfill waste and shedding microplastics into marine waters. Furthermore, toxic dyes poison rivers in developing nations. To counter this crisis, consumers must become conscious shoppers, choosing durable thrifted clothes and supporting ethical fashion brands.",
    "category": "Environment & Lifestyle",
    "minWords": 70,
    "maxWords": 130
  },
  {
    "id": "free-b2-cultivated-meat-future",
    "mode": "free",
    "difficulty": "B2",
    "title": "Cellular Agriculture: Can Lab-Grown Meat Save the Planet?",
    "instruction": "Evaluate the viability and consumer acceptance of bioreactor-cultivated clean meat (90-150 words).",
    "scenario": "Balance greenhouse gas emission reduction against production costs and consumer skepticism.",
    "targetWords": [
      "bioreactor",
      "cultivated",
      "slaughterhouse",
      "methane",
      "skepticism"
    ],
    "targetGrammar": "Passive infinitives & Evaluative adjectives (imperative, indispensable, fraught with)",
    "sampleAnswer": "Conventional industrial livestock farming accounts for staggering greenhouse emissions, massive deforestation, and severe animal welfare concerns. Cellular agriculture presents a revolutionary technological alternative: brewing authentic muscle tissue inside sterile bioreactors without slaughterhouses. Cultivating meat cell cultures dramatically curtails methane output and spares vast tracts of agrarian land. Nevertheless, scaling production requires overcoming formidable economic hurdles, notably the high cost of nutrient growth media. Additionally, widespread public skepticism toward 'laboratory food' must be addressed through rigorous food safety transparency. If cost parity is achieved, cultivated protein could fundamentally redefine global nutrition sustainably.",
    "category": "Food Science & Ethics",
    "minWords": 90,
    "maxWords": 160
  },
  {
    "id": "free-c1-ubi-post-work",
    "mode": "free",
    "difficulty": "C1",
    "title": "Universal Basic Income in the Post-Work Economy",
    "instruction": "Examine whether an unconditional Universal Basic Income (UBI) is necessary in an era of deep automation (120-180 words).",
    "scenario": "Analyze the decoupling of human survival from wage labor versus risks of hyperinflation and civic disengagement.",
    "targetWords": [
      "emancipation",
      "disincentivize",
      "unconditional",
      "redistribution",
      "sovereignty"
    ],
    "targetGrammar": "Substantive philosophical framing, balancing antinomies, subjunctive constructions",
    "sampleAnswer": "As artificial intelligence systems automate complex cognitive and manual labor, the classical social contract anchoring subsistence to wage labor becomes untenable. Proponents champion Universal Basic Income as a vital redistributive mechanism that ensures basic economic sovereignty, liberating citizens from precarious survival to pursue creative, educational, and caretaking endeavors. Critics caution that an unconditional dividend may disincentivize productivity, trigger fiscal strain, and dissolve community cohesion centered on vocational pride. However, when algorithmic productivity concentrates immense capital yields into monopolistic tech conglomerates, UBI ceases to be a utopian indulgence; it becomes an essential macroeconomic stabilizer to prevent systemic aggregate demand collapse.",
    "category": "Economics & Social Philosophy",
    "minWords": 110,
    "maxWords": 200
  },
  {
    "id": "free-c1-geoengineering-dilemma",
    "mode": "free",
    "difficulty": "C1",
    "title": "Solar Radiation Management vs Radical Carbon Abatement",
    "instruction": "Argue whether research into solar geoengineering creates a dangerous moral hazard for emissions abatement (120-180 words).",
    "scenario": "Weigh the ethical peril of relying on technological techno-fixes versus climate tipping point emergencies.",
    "targetWords": [
      "geoengineering",
      "moral hazard",
      "mitigation",
      "temperatures",
      "indispensable"
    ],
    "targetGrammar": "Advanced concessive structures: While it may be argued that..., the underlying risk remains...",
    "sampleAnswer": "The debate over solar radiation management (SRM) embodies the quintessential dilemma of contemporary climate governance. Detractors persuasively argue that legitimizing aerosol geoengineering introduces an intolerable moral hazard, gifting fossil fuel conglomerates an excuse to delay radical industrial decarbonization under the illusion of a technological safety net. Yet, given that biosphere heating is already approaching irrecoverable tipping points, dogmatic refusal to investigate palliative planetary cooling tools is equally irresponsible. SRM cannot substitute for systemic emissions abatement, as it leaves ocean acidification entirely unchecked. Nonetheless, empirical research into stratospheric dynamics must proceed under rigorous multilateral treaties, ensuring humanity understands the mechanism should emergency climate stabilization become tragically necessary.",
    "category": "Climate Policy & Ethics",
    "minWords": 110,
    "maxWords": 200
  }
];

export const MASTER_WRITING_PROMPTS: WritingPrompt[] = [
  ...INITIAL_WRITING_PROMPTS,
  ...EXPANDED_WRITING_PROMPTS,
];
