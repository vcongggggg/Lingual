import json

with open("apps/api/src/data/writingExpandedData.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's see if EXPANDED_WRITING_PROMPTS is in text
initial_prompts = [
  {
    "id": "see-write-a1-morning",
    "mode": "see-write",
    "difficulty": "A1",
    "title": "Morning Routine",
    "instruction": "Hãy quan sát bức tranh và viết ít nhất 1-2 câu mô tả hoạt động buổi sáng của bạn.",
    "imageHint": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80",
    "scenario": "Một tách cà phê nóng và bữa sáng thơm ngon trên bàn ăn vào buổi sáng sớm.",
    "targetWords": ["coffee", "morning", "breakfast", "drink"],
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
    "targetWords": ["travel", "vacation", "beach", "relax", "beautiful"],
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
    "targetWords": ["collaborate", "team", "project", "technology", "creative"],
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
      { "stepNumber": 1, "question": "Where is your study room located?", "hint": "In my house / in my apartment", "samplePhrase": "My study room is on the second floor." },
      { "stepNumber": 2, "question": "What is on your study desk?", "hint": "A laptop, books, a lamp", "samplePhrase": "There is a laptop and several English books on my desk." },
      { "stepNumber": 3, "question": "How do you feel when studying there?", "hint": "Comfortable / quiet / peaceful", "samplePhrase": "I feel very comfortable and focused when studying here." }
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
    "targetWords": ["city", "culture", "explore", "atmosphere", "memorable"],
    "sampleAnswer": "Da Nang is my favorite city in Vietnam because of its breathtaking beaches and friendly people. The vibrant night market and delicious street food always leave a lasting impression.",
    "guidedSteps": []
  }
]

# Find start of EXPANDED_WRITING_PROMPTS
pos = text.find("export const EXPANDED_WRITING_PROMPTS")
if pos == -1:
    print("Could not find EXPANDED_WRITING_PROMPTS")
    exit(1)

# Reconstruct file
header = """import { WritingPrompt } from '../../../../packages/domain/src/index.js';

export const INITIAL_WRITING_PROMPTS: WritingPrompt[] = """ + json.dumps(initial_prompts, indent=2, ensure_ascii=False) + """;

"""

rest = text[pos:]
footer = """
export const MASTER_WRITING_PROMPTS: WritingPrompt[] = [
  ...INITIAL_WRITING_PROMPTS,
  ...EXPANDED_WRITING_PROMPTS,
];
"""

final_code = header + rest + footer

with open("apps/api/src/data/writingExpandedData.ts", "w", encoding="utf-8") as f:
    f.write(final_code)

print("Updated apps/api/src/data/writingExpandedData.ts with INITIAL and MASTER exports.")
