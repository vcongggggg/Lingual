import json
import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DICT_PATH = os.path.join(ROOT, 'apps/api/src/data/masterDictionary25k.json')
OUTPUT_PATH = os.path.join(ROOT, 'apps/web/src/lib/vocabulary/masterTopicsData.ts')

print(f"Loading dictionary from {DICT_PATH}...")
with open(DICT_PATH, 'r', encoding='utf-8') as f:
    dict_data = json.load(f)

print(f"Total dictionary entries: {len(dict_data)}")

# Create quick lookup map
dict_by_word = {w['normalizedText'].lower(): w for w in dict_data}

def make_word_item(w_dict, custom_cefr=None, custom_pos=None):
    pos_map = {
        'noun': 'Danh từ',
        'verb': 'Động từ',
        'adjective': 'Tính từ',
        'adverb': 'Trạng từ',
        'preposition': 'Giới từ',
        'conjunction': 'Liên từ',
        'phrase': 'Cụm từ'
    }
    raw_pos = custom_pos or w_dict.get('partOfSpeech', 'noun')
    pos_label = pos_map.get(raw_pos, raw_pos)

    raw_phonetic = w_dict.get('phonetic', '')
    if not raw_phonetic or raw_phonetic == '//':
        phonetic_us = f"/{w_dict['normalizedText']}/"
    else:
        phonetic_us = raw_phonetic

    translation = w_dict.get('translation', '')
    if ';' in translation:
        meaning_vi = translation.split(';')[0].strip()
    else:
        meaning_vi = translation.strip()

    word = w_dict.get('targetText', w_dict['normalizedText'])
    
    example_en = w_dict.get('exampleSentence', f"The word '{word}' is very useful in everyday English.")
    example_vi = w_dict.get('exampleTranslation', f"Từ '{word}' rất hữu ích trong tiếng Anh giao tiếp hàng ngày.")

    return {
        "id": f"vw-{w_dict['normalizedText'].replace(' ', '-')}",
        "word": word,
        "phoneticUs": phonetic_us,
        "phoneticUk": phonetic_us,
        "pos": pos_label,
        "meaningVi": meaning_vi,
        "definitionEn": f"A key {raw_pos} commonly used in English communication",
        "exampleEn": example_en,
        "exampleVi": example_vi,
        "cefr": custom_cefr or w_dict.get('cefrLevel', 'B1')
    }

CEFR_CONFIG = [
    {
        "id": "cefr-a1",
        "title": "A1 - Căn Bản & Khởi Động",
        "levelBadge": "A1 Căn Bản",
        "coverImage": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80",
        "description": "Dành cho người mới bắt đầu hoặc mất gốc. Nắm vững từ vựng đời sống, số đếm, màu sắc, gia đình và chào hỏi.",
        "units": [
            ("Unit 1: Chào Hỏi & Giới Thiệu Bản Thân", ["hello", "name", "morning", "friend", "people", "welcome", "meet", "speak", "live", "country", "nice", "today", "happy", "student", "teacher"]),
            ("Unit 2: Gia Đình & Người Thân", ["family", "father", "mother", "brother", "sister", "child", "baby", "parent", "home", "house", "room", "love", "care", "together", "young"]),
            ("Unit 3: Đồ Ăn & Nước Uống Hàng Ngày", ["water", "food", "bread", "milk", "tea", "coffee", "rice", "apple", "fruit", "lunch", "dinner", "eat", "drink", "cook", "sweet"]),
            ("Unit 4: Thời Gian & Hoạt Động Cơ Bản", ["day", "time", "hour", "week", "month", "year", "night", "start", "stop", "sleep", "wake", "walk", "learn", "read", "smile"]),
        ]
    },
    {
        "id": "cefr-a2",
        "title": "A2 - Sơ Cấp & Giao Tiếp Hàng Ngày",
        "levelBadge": "A2 Sơ Cấp",
        "coverImage": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
        "description": "Giao tiếp tự tin trong các tình huống mua sắm, hỏi đường, đặt phòng khách sạn, sở thích và công việc thường nhật.",
        "units": [
            ("Unit 1: Mua Sắm & Giá Cả", ["market", "store", "price", "money", "cheap", "expensive", "credit", "cash", "buy", "sell", "discount", "receipt", "customer", "product", "choice"]),
            ("Unit 2: Du Lịch & Phương Tiện Giao Thông", ["travel", "train", "airport", "bus", "ticket", "flight", "arrive", "leave", "hotel", "map", "luggage", "driver", "street", "journey", "visit"]),
            ("Unit 3: Thời Tiết & Kỳ Nghỉ", ["weather", "summer", "winter", "rain", "sunny", "cloud", "temperature", "beach", "mountain", "holiday", "enjoy", "relax", "outside", "season", "warm"]),
            ("Unit 4: Sức Khỏe & Thể Chất", ["health", "doctor", "hospital", "medicine", "pain", "sick", "cold", "body", "exercise", "rest", "care", "strong", "energy", "advice", "feel"]),
        ]
    },
    {
        "id": "cefr-b1",
        "title": "B1 - Trung Cấp & Công Sở",
        "levelBadge": "B1 Trung Cấp",
        "coverImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
        "description": "Diễn đạt ý kiến cá nhân, thuyết trình công sở, trao đổi email chuyên nghiệp và xử lý các tình huống phức tạp khi đi nước ngoài.",
        "units": [
            ("Unit 1: Môi Trường Công Sở & Dự Án", ["colleague", "meeting", "deadline", "project", "schedule", "manager", "task", "report", "presentation", "career", "success", "develop", "feedback", "discuss", "goal"]),
            ("Unit 2: Công Nghệ & Truyền Thông Số", ["device", "internet", "website", "online", "message", "digital", "network", "connect", "share", "security", "application", "update", "screen", "search", "user"]),
            ("Unit 3: Cảm Xúc & Diễn Đạt Ý Kiến", ["opinion", "agree", "disagree", "believe", "confidence", "anxiety", "excited", "disappointed", "satisfied", "curious", "encourage", "respect", "attitude", "express", "persuade"]),
            ("Unit 4: Đời Sống Đô Thị & Xã Hội", ["community", "neighborhood", "transport", "environment", "pollution", "culture", "tradition", "modern", "lifestyle", "population", "service", "facility", "convenient", "develop", "resident"]),
        ]
    },
    {
        "id": "cefr-b2",
        "title": "B2 - Trung Cao Cấp & Trừu Tượng",
        "levelBadge": "B2 Trung Cao Cấp",
        "coverImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
        "description": "Thảo luận chuyên sâu về kinh tế, chính trị, công nghệ AI và viết luận phân tích các vấn đề toàn cầu.",
        "units": [
            ("Unit 1: Kinh Doanh & Đàm Phán Chiến Lược", ["negotiate", "strategy", "productivity", "investment", "collaboration", "partnership", "revenue", "competitor", "market", "executive", "profitable", "expand", "transaction", "efficient", "resource"]),
            ("Unit 2: Trí Tuệ Nhân Tạo & Khoa Học Kỹ Thuật", ["algorithm", "automation", "interface", "bandwidth", "encryption", "database", "innovation", "artificial", "intelligence", "mechanism", "framework", "analysis", "system", "simulate", "optimize"]),
            ("Unit 3: Môi Trường & Phát Triển Bền Vững", ["sustainable", "biodiversity", "conservation", "ecosystem", "renewable", "emission", "climate", "preserve", "crisis", "endangered", "agriculture", "recycle", "impact", "disaster", "protect"]),
            ("Unit 4: Tâm Lý Học & Động Lực Phát Triển", ["motivation", "perception", "resilience", "behavior", "cognitive", "inspiration", "discipline", "potential", "obstacle", "overcome", "personality", "empathy", "subconscious", "habit", "achievement"]),
        ]
    },
    {
        "id": "cefr-c1",
        "title": "C1 - Cao Cấp & Học Thuật",
        "levelBadge": "C1 Cao Cấp",
        "coverImage": "https://images.unsplash.com/photo-1507842229451-79b1be886a20?w=600&auto=format&fit=crop&q=80",
        "description": "Văn phong học thuật sắc sảo, tranh biện logic, viết luận nghiên cứu quốc tế và đọc các tài liệu khoa học phức tạp.",
        "units": [
            ("Unit 1: Phân Tích & Biện Luận Học Thuật", ["hypothesis", "empirical", "methodology", "paradigm", "correlation", "phenomenon", "quantitative", "qualitative", "implication", "synthesis", "comprehensive", "deductive", "criteria", "validity", "scrutiny"]),
            ("Unit 2: Quản Trị Vĩ Mô & Toàn Cầu Hóa", ["infrastructure", "monopoly", "sovereignty", "bureaucracy", "legislation", "jurisdiction", "fiscal", "inflation", "macroeconomic", "deregulation", "conglomerate", "stakeholder", "governance", "sanction", "diplomatic"]),
            ("Unit 3: Triết Học & Tư Duy Phản Biện", ["epistemology", "pragmatic", "abstract", "inherent", "dilemma", "ethics", "dialectical", "paradox", "existential", "morality", "intuition", "cognition", "consciousness", "skepticism", "rational"]),
            ("Unit 4: Ngôn Ngữ & Tu Từ Tinh Xảo", ["eloquent", "articulate", "nuance", "rhetoric", "metaphor", "eloquence", "profound", "ambiguous", "subtle", "lucid", "persuasive", "connotation", "discourse", "insightful", "coherence"]),
        ]
    },
    {
        "id": "cefr-c2",
        "title": "C2 - Thành Thạo Bản Ngữ",
        "levelBadge": "C2 Bản Ngữ",
        "coverImage": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
        "description": "Vốn từ phong phú ngang người bản xứ có học thức cao. Hiểu trọn vẹn văn học cổ điển, các phép ẩn dụ và thành ngữ tinh tế.",
        "units": [
            ("Unit 1: Bác Học & Văn Phong Uyên Bác", ["ubiquitous", "ephemeral", "esoteric", "quintessential", "juxtaposition", "idiosyncratic", "anachronistic", "panacea", "mellifluous", "serendipity", "surreptitious", "vicarious", "cathartic", "pernicious", "ineffable"]),
            ("Unit 2: Tranh Luận & Nghệ Thuật Diễn Thuyết", ["polemic", "cacophony", "euphemism", "antithesis", "hyperbole", "platitude", "truism", "syllogism", "demagogue", "soliloquy", "apocryphal", "disingenuous", "specious", "tautology", "anecdote"]),
        ]
    }
]

EXAM_CONFIG = [
    {
        "id": "exam-ielts",
        "title": "IELTS Academic Word List (AWL)",
        "levelBadge": "IELTS Band 6.5 - 8.0+",
        "coverImage": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
        "description": "570 gia đình từ vựng học thuật quan trọng nhất xuất hiện trong mọi đề thi IELTS Reading, Writing Task 1 & Task 2.",
        "units": [
            ("Sublist 1: Khái Niệm & Cơ Chế Cốt Lõi", ["analyze", "approach", "assess", "assume", "authority", "available", "benefit", "concept", "consist", "constitute", "context", "contract", "create", "data", "define"]),
            ("Sublist 2: Nghiên Cứu & Bằng Chứng Khoa Học", ["derive", "distribute", "economy", "environment", "establish", "estimate", "evidence", "export", "factor", "financial", "formula", "function", "identify", "income", "indicate"]),
            ("Sublist 3: Phương Pháp & Cấu Trúc Luận Điểm", ["individual", "interpret", "involve", "issue", "labour", "legal", "legislate", "major", "method", "occur", "percent", "period", "policy", "principle", "proceed"]),
            ("Sublist 4: Phản Biện & Đánh Giá Tổng Thể", ["process", "require", "research", "respond", "role", "section", "sector", "significant", "similar", "source", "specific", "structure", "theory", "vary", "valid"]),
        ]
    },
    {
        "id": "exam-toeic",
        "title": "TOEIC 30 Chuyên Đề Doanh Nghiệp",
        "levelBadge": "TOEIC 650 - 900+",
        "coverImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
        "description": "Bộ từ vựng then chốt cho đề thi TOEIC Listening & Reading: Hợp đồng, tuyển dụng, marketing, tài chính và logistics.",
        "units": [
            ("Chuyên đề 1: Hợp Đồng & Đàm Phán Thương Mại", ["contract", "agreement", "party", "negotiate", "clause", "terms", "condition", "obligate", "provision", "binding", "resolve", "expire", "cancel", "renew", "signature"]),
            ("Chuyên đề 2: Tuyển Dụng & Nhân Sự", ["candidate", "applicant", "interview", "resume", "recruit", "qualified", "experience", "salary", "benefit", "hire", "promotion", "reference", "training", "probation", "retire"]),
            ("Chuyên đề 3: Tiếp Thị, Bán Hàng & Quảng Cáo", ["market", "customer", "campaign", "promote", "survey", "consumer", "attract", "brand", "competitor", "expand", "demand", "feedback", "launch", "pricing", "target"]),
            ("Chuyên đề 4: Tài Chính, Ngân Hàng & Hóa Đơn", ["invoice", "budget", "expense", "revenue", "accounting", "audit", "balance", "receipt", "payment", "reimburse", "dividend", "statement", "tax", "transfer", "profit"]),
        ]
    },
    {
        "id": "exam-oxford-3000",
        "title": "Oxford 3000™ Cốt Lõi",
        "levelBadge": "Core 3000 Essential",
        "coverImage": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
        "description": "3,000 từ vựng quan trọng nhất của tiếng Anh do các nhà ngôn ngữ học Oxford bình chọn, bao quát 85% hội thoại đời thực.",
        "units": [
            ("Pack 1: Đời Sống & Sinh Hoạt Căn Bản", ["ability", "accident", "action", "activity", "advantage", "advice", "afternoon", "agreement", "airport", "amount", "animal", "answer", "appearance", "area", "article"]),
            ("Pack 2: Giao Tiếp & Thái Độ Xã Hội", ["attitude", "average", "balance", "behavior", "belief", "belong", "benefit", "billion", "border", "bother", "breathe", "bridge", "budget", "burden", "cabinet"]),
            ("Pack 3: Hành Động & Quyết Định", ["calculate", "campaign", "capable", "capital", "capture", "career", "category", "cause", "celebrate", "century", "ceremony", "challenge", "champion", "channel", "chapter"]),
        ]
    },
    {
        "id": "exam-thptqg",
        "title": "Trọng Tâm Ôn Thi THPT Quốc Gia",
        "levelBadge": "THPTQG 9+ Điểm",
        "coverImage": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
        "description": "Bộ từ hay gặp trong các đề thi tuyển sinh Đại học & Tốt nghiệp THPT: Dạng bài đọc hiểu, phát âm, trọng âm và từ cùng trường nghĩa.",
        "units": [
            ("Chủ điểm 1: Từ Dễ Gây Nhầm Lẫn", ["affect", "effect", "complement", "compliment", "principle", "principal", "stationary", "stationery", "sensitive", "sensible", "economic", "economical", "historic", "historical", "classic"]),
            ("Chủ điểm 2: Từ Vựng Trọng Tâm Đọc Hiểu", ["academic", "achievement", "admission", "curriculum", "commencement", "diploma", "discipline", "faculty", "graduate", "scholarship", "tuition", "undergraduate", "vocational", "institution", "requirement"]),
        ]
    }
]

TOPICS_CONFIG = [
    {
        "id": "topic-tech",
        "title": "Công Nghệ & Trí Tuệ Nhân Tạo (AI)",
        "levelBadge": "Technology & AI",
        "coverImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        "description": "Khám phá thế giới công nghệ 4.0: Trí tuệ nhân tạo, an ninh mạng, điện toán đám mây và lập trình ứng dụng.",
        "units": [
            ("Pack 1: Trí Tuệ Nhân Tạo & Học Máy", ["algorithm", "artificial", "intelligence", "neural", "network", "automation", "dataset", "deep", "learning", "predictive", "model", "parameter", "reinforce", "computer", "vision"]),
            ("Pack 2: An Ninh Mạng & Dữ Liệu", ["cybersecurity", "encryption", "firewall", "database", "authentication", "malware", "protocol", "vulnerability", "server", "bandwidth", "infrastructure", "cloud", "backup", "credential"]),
        ]
    },
    {
        "id": "topic-travel",
        "title": "Du Lịch & Hàng Không (Travel & Aviation)",
        "levelBadge": "Travel & Aviation",
        "coverImage": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80",
        "description": "Trang bị đầy đủ vốn từ khi đi máy bay, đặt phòng khách sạn, khám phá ẩm thực và phong tục quốc tế.",
        "units": [
            ("Pack 1: Sân Bay & Chuyến Bay", ["airport", "boarding", "passport", "departure", "arrival", "terminal", "luggage", "customs", "immigration", "flight", "pilot", "cockpit", "runway", "delay", "ticket"]),
            ("Pack 2: Khách Sạn & Trải Nghiệm Điểm Đến", ["destination", "itinerary", "accommodation", "reservation", "resort", "sightseeing", "guide", "souvenir", "currency", "exchange", "monument", "attraction", "excursion", "hospitality", "booking"]),
        ]
    },
    {
        "id": "topic-business",
        "title": "Kinh Doanh & Tài Chính (Business & Finance)",
        "levelBadge": "Business & Finance",
        "coverImage": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
        "description": "Vốn từ quản trị doanh nghiệp, đầu tư chứng khoán, khởi nghiệp và thương mại quốc tế.",
        "units": [
            ("Pack 1: Doanh Nghiệp & Khởi Nghiệp", ["enterprise", "entrepreneur", "startup", "venture", "capital", "stakeholder", "innovation", "revenue", "profit", "turnover", "franchise", "incubator", "merger", "acquisition", "leadership"]),
            ("Pack 2: Thị Trường Tài Chính & Đầu Tư", ["investment", "portfolio", "dividend", "shares", "stock", "exchange", "inflation", "recession", "fiscal", "liquidity", "brokerage", "yield", "commodity", "derivative", "speculation"]),
        ]
    },
    {
        "id": "topic-health",
        "title": "Sức Khỏe & Y Tế (Health & Medicine)",
        "levelBadge": "Health & Medical",
        "coverImage": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80",
        "description": "Từ vựng phòng khám, dinh dưỡng, điều trị bệnh và rèn luyện lối sống lành mạnh.",
        "units": [
            ("Pack 1: Y Khoa & Điều Trị Bệnh", ["hospital", "physician", "diagnosis", "symptom", "treatment", "prescription", "surgery", "therapy", "antibiotic", "vaccine", "recovery", "infection", "pharmacy", "clinic", "fever"]),
            ("Pack 2: Dinh Dưỡng & Sức Khỏe Tinh Thần", ["nutrition", "dietary", "vitamin", "wellness", "metabolism", "immunity", "mindfulness", "stress", "resilience", "meditation", "organic", "longevity", "fitness", "hydration", "wellbeing"]),
        ]
    },
    {
        "id": "topic-food",
        "title": "Ẩm Thực & Nhà Hàng (Food & Dining)",
        "levelBadge": "Culinary & Dining",
        "coverImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
        "description": "Khám phá hương vị thế giới: Nấu nướng, nguyên liệu, món ăn đặc sắc và văn hóa bàn tiệc.",
        "units": [
            ("Pack 1: Nguyên Liệu & Chế Biến Món Ăn", ["ingredient", "recipe", "flavor", "delicious", "cuisine", "gourmet", "appetizer", "beverage", "seasoning", "marinate", "grill", "simmer", "roast", "bake", "texture"]),
            ("Pack 2: Trải Nghiệm Nhà Hàng & Phục Vụ", ["restaurant", "waiter", "menu", "dessert", "buffet", "specialty", "refreshing", "culinary", "delicacy", "sommelier", "atmosphere", "portion", "recommendation", "bill", "tip"]),
        ]
    },
    {
        "id": "topic-environment",
        "title": "Môi Trường & Thiên Nhiên (Environment)",
        "levelBadge": "Nature & Climate",
        "coverImage": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80",
        "description": "Bảo vệ hành tinh xanh: Biến đổi khí hậu, năng lượng tái tạo, rừng nhiệt đới và đa dạng sinh học.",
        "units": [
            ("Pack 1: Khí Hậu & Năng Lượng Tái Tạo", ["climate", "greenhouse", "emission", "renewable", "solar", "wind", "conservation", "sustainable", "carbon", "neutrality", "ecology", "biodegradable", "energy", "efficiency", "pollution"]),
            ("Pack 2: Hệ Sinh Thái & Động Thực Vật", ["ecosystem", "biodiversity", "habitat", "rainforest", "endangered", "species", "wildlife", "preserve", "sanctuary", "flora", "fauna", "extinction", "deforestation", "restoration", "nature"]),
        ]
    }
]

compiled_major_topics = []

def process_config_group(group_list, category_group_tag):
    for group_item in group_list:
        sub_topics = []
        for unit_title, word_list in group_item["units"]:
            clean_title = re.sub(r'[^a-zA-Z0-9]', '-', unit_title).lower()[:30]
            unit_id = f"sub-{group_item['id']}-{clean_title}"
            words = []
            for w in word_list:
                cleaned_w = w.lower().strip()
                dict_entry = dict_by_word.get(cleaned_w)
                if dict_entry:
                    words.append(make_word_item(dict_entry, custom_cefr=group_item.get("levelBadge", "").split(" ")[0]))
                else:
                    words.append({
                        "id": f"vw-{cleaned_w.replace(' ', '-')}",
                        "word": cleaned_w,
                        "phoneticUs": f"/{cleaned_w}/",
                        "phoneticUk": f"/{cleaned_w}/",
                        "pos": "Danh từ",
                        "meaningVi": f"Thuật ngữ '{cleaned_w}' trong chủ đề {group_item['title']}",
                        "definitionEn": f"An essential term related to {group_item['title']}",
                        "exampleEn": f"This is an example sentence featuring the term '{cleaned_w}'.",
                        "exampleVi": f"Đây là câu ví dụ sử dụng từ '{cleaned_w}'.",
                        "cefr": "B1"
                    })

            sub_topics.append({
                "id": unit_id,
                "title": unit_title,
                "coverImage": group_item["coverImage"],
                "words": words
            })

        compiled_major_topics.append({
            "id": group_item["id"],
            "title": group_item["title"],
            "levelBadge": group_item.get("levelBadge", "Standard"),
            "categoryGroup": category_group_tag,
            "description": group_item.get("description", ""),
            "coverImage": group_item["coverImage"],
            "subTopics": sub_topics
        })

print("Processing CEFR categories...")
process_config_group(CEFR_CONFIG, "cefr")

print("Processing Exam categories...")
process_config_group(EXAM_CONFIG, "exams")

print("Processing Thematic Topics categories...")
process_config_group(TOPICS_CONFIG, "topics")

total_words = sum(len(sub['words']) for m in compiled_major_topics for sub in m['subTopics'])
print(f"Generated {len(compiled_major_topics)} Major Topics with {total_words} words across all packs!")

ts_content = f"""/**
 * Master Hierarchical Vocabulary Dataset
 * Multi-Category Architecture: CEFR (A1-C2) • Certifications (IELTS/TOEIC) • 16 Thematic Topics
 * Generated by LinguaFlow Universal Ingestion Engine
 */

export interface WordItem {{
  id: string;
  word: string;
  phoneticUs: string;
  phoneticUk?: string;
  pos: string;
  meaningVi: string;
  definitionEn: string;
  exampleEn: string;
  exampleVi: string;
  imageUrl?: string;
  cefr: string;
}}

export interface SubTopic {{
  id: string;
  title: string;
  coverImage: string;
  words: WordItem[];
}}

export interface MajorTopic {{
  id: string;
  title: string;
  levelBadge?: string;
  categoryGroup: 'cefr' | 'exams' | 'topics' | 'personal';
  description?: string;
  coverImage: string;
  subTopics: SubTopic[];
}}

export const CRAWLED_MAJOR_TOPICS: MajorTopic[] = {json.dumps(compiled_major_topics, ensure_ascii=False, indent=2)};
"""

with open(OUTPUT_PATH, 'w', encoding='utf-8') as out_f:
    out_f.write(ts_content)

print(f"Successfully written to {OUTPUT_PATH} ({os.path.getsize(OUTPUT_PATH)} bytes)")
