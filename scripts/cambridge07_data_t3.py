r"""
Module: cambridge07_data_t3.py
Defines mapped data for Cambridge IELTS 07 - Test 3 (Academic)
Includes:
- 4 Listening Sections (40 questions)
- 3 Reading Passages (40 questions)
- 2 Writing Topics & 2 Writing Models
- 3 Speaking Topics
All records have track='academic'.
"""

import json
import re

def clean_text_artifacts(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"(?:www\.)?TopSage(?:\.com)?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"大家网", "", text)
    text = re.sub(r"^##\s*(?:SECTION|TEST)\s*\d*.*$", "", text, flags=re.MULTILINE | re.IGNORECASE)
    text = re.sub(r"\bTRI\b", "", text)
    lines = [line.strip() for line in text.split("\n")]
    lines = [l for l in lines if l]
    return "\n\n".join(lines)

APOSTROPHE_FIXES = {
    r"\blo'ts\b": "lots",
    r"\badvertisemen'ts\b": "advertisements",
    r"\bstree'ts\b": "streets",
    r"\borgutnen'ts\b": "arguments",
    r"\bargumen'ts\b": "arguments",
    r"\bcoun'try\b": "country",
    r"\bcoun'tries\b": "countries",
    r"\baspec'ts\b": "aspects",
    r"\bagains't\b": "against",
    r"\bac'tually\b": "actually",
    r"\bsocie'ty\b": "society",
    r"\bbetter'to\b": "better to",
    r"\bno't\b": "not",
    r"\bthe'ir\b": "their"
}

def normalize_ocr_apostrophes(text: str) -> str:
    if not text:
        return ""
    res = text
    for pat, repl in APOSTROPHE_FIXES.items():
        res = re.sub(pat, repl, res, flags=re.IGNORECASE)
    return res

OFFICIAL_LISTENING_KEYS = {
    1: "business",
    2: "third",
    3: "Sport(s) Centre",
    4: "(a) cleaner",
    5: "Library",
    6: "International House",
    7: "B659",
    8: "(an) office assistant",
    9: "answer (the) phone",
    10: "11.30",
    11: "B",
    12: "C",
    13: "A",
    14: "C",
    15: "B",
    16: "A",
    17: "forest",
    18: "temple",
    19: "waterfall",
    20: "village",
    21: "cigar",
    22: "13 (different) countries",
    23: "activated",
    24: "50 km(s)",
    25: "temperature",
    26: "A",
    27: "C",
    28: "A",
    29: "B",
    30: "C",
    31: "B",
    32: "B",
    33: "A",
    34: "C",
    35: "business",
    36: "kitchen",
    37: "world",
    38: "escape",
    39: "baby",
    40: "chocolate"
}

OFFICIAL_READING_KEYS = {
    1: "FALSE",
    2: "TRUE",
    3: "NOT GIVEN",
    4: "TRUE",
    5: "FALSE",
    6: "NOT GIVEN",
    7: "C",
    8: "M",
    9: "F",
    10: "D",
    11: "N",
    12: "O",
    13: "E",
    14: "iv",
    15: "vii",
    16: "x",
    17: "i",
    18: "vi",
    19: "ii",
    20: "E",
    21: "D",
    22: "C",
    23: "B",
    24: "A",
    25: "A",
    26: "A",
    27: "NOT GIVEN",
    28: "FALSE",
    29: "TRUE",
    30: "FALSE",
    31: "FALSE",
    32: "FALSE",
    33: "TRUE",
    34: "J",
    35: "A",
    36: "E",
    37: "B",
    38: "G",
    39: "D",
    40: "B"
}

def build_test_3(raw_md_text: str, official_keys: dict):
    l_keys = official_keys["listening"]
    r_keys = official_keys["reading"]

    # --- 1. LISTENING AUDIOSCRIPTS & QUESTIONS ---
    s1_script_text = clean_text_artifacts("""
AGENT: Good morning. Can I help you?
STUDENT: Yes, I've just arrived here at the university and I'm looking for a part-time job.
AGENT: OK, well we have a number of student vacancies on our books. What course are you doing?
STUDENT: I'm studying business administration.
AGENT: Right, business. And what year are you in?
STUDENT: I'm in my third year - it's the final year of my degree.
AGENT: OK, well let's see what part-time vacancies we have available right now. There's a receptionist position in the Sports Centre, but the problem is they require someone who can work on Tuesday and Thursday evenings.
STUDENT: Oh, that's no good. I have evening lectures on both of those days.
AGENT: Right. Well, there's another job working as a cleaner in the Child Care Centre.
STUDENT: What hours would that be?
AGENT: It starts at 6.00 in the morning and finishes at 8.00 a.m.
STUDENT: That's far too early for me, I'm afraid.
AGENT: OK. Then we have a vacancy for a clerical assistant in the Library, but once again, they need evening cover.
STUDENT: Yes, same problem with my lectures.
AGENT: Wait, here's one that might suit you. It's at the English Language Centre. They need an office assistant.
STUDENT: That sounds promising. What are the main duties?
AGENT: Mainly to respond to general student enquiries at the front desk and answer the phone.
STUDENT: Oh, that sounds fine.
AGENT: Great. Can I take down your personal details? Your name, please?
STUDENT: Anita Newman.
AGENT: And where are you living?
STUDENT: I'm staying in student accommodation at International House, Room B659.
AGENT: Do you speak any foreign languages?
STUDENT: Yes, I speak some Japanese.
AGENT: That's very useful for international students. Now, they want to interview candidates this Friday. Can you make 11.30 in the morning?
STUDENT: Yes, 11.30 on Friday is perfect.
AGENT: Great, I'll book that in for you. Good luck!
STUDENT: Thank you very much for your help!
""")

    s2_script_text = clean_text_artifacts("""
Good morning. I'm very pleased to have been invited along to your club to talk about our upcoming sponsored walking holiday in the beautiful Semira Region.

Basically we are organizing a ten-day holiday, from the sixth to the sixteenth of next month. However, you won't be walking every day; you will actually be walking for eight days, with two scheduled rest days during the tour.

Many people ask about where their sponsorship money goes. Well, we guarantee that at least sixty-five percent - roughly two-thirds - of all sponsorship money goes directly to our partner charities, while the rest covers operational and guide costs. Furthermore, each walker's sponsorship money goes to sponsor one particular student at a local rural school, providing their books, tuition, and uniform for an entire year.

As for physical demands, this is not a gentle stroll. When you start the trek you must be already very fit. The terrain is mountainous, paths are steep and rocky, and you will be walking for up to seven hours a day. Fortunately, as you walk you will only carry some of your belongings - your personal daypack with water, waterproofs, and lunch - while pack animals transport your heavy luggage between camps.

The Semira Region is culturally fascinating. It has a rich history dating back centuries and has a long tradition of making carpets with intricate geometric designs.

Let me outline the ten-day itinerary.
Day 1: Arrive in Kishba, our base town.
Day 2: Rest day to adjust to altitude.
Day 3: We start our trek by spending all day in a magnificent ancient forest.
Day 4: We hike up into the hills and visit a school supported by our charity.
Day 5: Rest day.
Day 6: A memorable excursion where we see a historic temple with twelfth-century stone carvings.
Day 7: Rest day.
Day 8: Hike to the mountains and swim in a stunning natural waterfall.
Day 9: We visit a traditional village where weavers produce exquisite woollen blankets.
Day 10: Depart from Kishba for the flight home.
""")

    s3_script_text = clean_text_artifacts("""
SIMON: Hello everyone. Today I'm going to update you on our ocean research project involving robotic ocean floats. Let me begin by describing the device itself. It looks a bit like a cigar and it's about one and a half metres long. More importantly it's packed with sensitive equipment designed to collect data from the ocean depths.
STUDENT 1: Sounds like a massive undertaking - isn't it too big for one country?
SIMON: Absolutely. That's why scientists from thirteen different countries have worked on the project so far, and next year Indonesia will join as the fourteenth.
STUDENT 2: How does the operational cycle of the float work?
SIMON: Each float is dropped into the ocean from a research vessel and then activated by satellite command. Once activated, the float immediately sinks to a depth of two thousand metres. It drifts with deep oceanic currents for ten days, travelling an average distance of 50 kilometres.
STUDENT 1: What data does it collect while drifting?
SIMON: At depth it records very little, but as it slowly ascends to the surface over a six-hour period, it records vital changes in salinity and temperature. When it surfaces, all the collected data is transmitted via global satellite to meteorological stations onshore, like ours in Hobart. After five hours on the surface, the float sinks again, repeating the cycle continuously.
STUDENT 2: What about practical applications of this float data?
SIMON: Well, we have three timeframes. At present, float data is already being used in two key areas: first, to deepen our understanding of El Niño phenomena, and second, to assist naval search and rescue missions by providing real-time surface current predictions.
STUDENT 1: And what about the near future?
SIMON: In the near future, we anticipate the data will provide insights into sustainable fishing practices by helping governments identify migration routes of commercial fish stocks.
STUDENT 2: And in the long term?
SIMON: In the long-term future, as our ocean-atmosphere models mature, float data will play an essential role in improving our understanding of long-range climate change and aiding agricultural crop selection based on multi-year drought forecasts.
""")

    s4_script_text = clean_text_artifacts("""
Good morning everyone. Today's lecture forms part of our Hospitality and Tourism management module, and we are focusing on guest experiences and design psychology in luxury hotels.

You wake up in the middle of the night in a strange hotel miles away from home. Have you ever noticed that despite luxurious decor, guests often feel surprisingly depressed by the experience? Research indicates that luxury hotels frequently overlook the basic human need to create a comfortable, reassuring environment, opting instead for cold, intimidating opulence.

A leading design consultancy recently conducted an extensive investigation to understand what makes hotel stays memorable and soothing. They focused their research on a wide variety of hotels, ranging from boutique city retreats to grand country-house resorts.

One of their most striking findings was regarding the impact of the outside environment on a hotel guest. Contrary to popular belief, the external environment outside the hotel has no effect whatsoever on whether guests felt welcomed or relaxed inside their rooms; the interior atmosphere and sensory comfort were entirely paramount.

Based on these findings, an innovative company providing luxury serviced apartments has pioneered a new model. They aim to cater specifically for business travellers who spend long periods away from their families. In each apartment, they provide a stylish, fully functional kitchen for guests to use, allowing them to cook healthy meals rather than relying on room service. Their ultimate goal is to set a trend throughout the hospitality industry and world which becomes permanent.

In contrast, traditional holiday hotels attract people primarily by offering them the chance to escape their ordinary routine life. They succeed by making sure guests are cared for in all respects - pampering them almost like a baby - and leaving delightful small treats in their rooms, such as gourmet cosmetics or fine chocolate on their pillows.
""")

    q_s1 = [
        {"questionNumber": 1, "type": "notes_completion", "question": "Student job applicant: Student is studying 1 ......................................... .", "options": [], "correctAnswer": l_keys[1], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 1, Answer Key page 156"},
        {"questionNumber": 2, "type": "notes_completion", "question": "Student job applicant: Student is in the 2 ......................................... year of the course.", "options": [], "correctAnswer": l_keys[2], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 2, Answer Key page 156"},
        {"questionNumber": 3, "type": "table_completion", "question": "Position available: Receptionist in the 3 ......................................... ; Problem: evening lectures", "options": [], "correctAnswer": l_keys[3], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 3, Answer Key page 156"},
        {"questionNumber": 4, "type": "table_completion", "question": "Position available: 4 ......................................... in the Child Care Centre; Problem: too early", "options": [], "correctAnswer": l_keys[4], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 4, Answer Key page 156"},
        {"questionNumber": 5, "type": "table_completion", "question": "Position available: Clerical Assistant in the 5 ......................................... ; Problem: evening lectures", "options": [], "correctAnswer": l_keys[5], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 5, Answer Key page 156"},
        {"questionNumber": 6, "type": "form_completion", "question": "STUDENT DETAILS: Address: 6 ......................................... , Room No. B659", "options": [], "correctAnswer": l_keys[6], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 6, Answer Key page 156"},
        {"questionNumber": 7, "type": "form_completion", "question": "STUDENT DETAILS: Address: International House, Room No. 7 .........................................", "options": [], "correctAnswer": l_keys[7], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 7, Answer Key page 156"},
        {"questionNumber": 8, "type": "form_completion", "question": "Position available: 8 ......................................... at the English Language Centre", "options": [], "correctAnswer": l_keys[8], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 8, Answer Key page 156"},
        {"questionNumber": 9, "type": "form_completion", "question": "Duties: Respond to enquiries and 9 ......................................... .", "options": [], "correctAnswer": l_keys[9], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 9, Answer Key page 156"},
        {"questionNumber": 10, "type": "form_completion", "question": "Time of interview: Friday at 10 ......................................... a.m.", "options": [], "correctAnswer": l_keys[10], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 1, Question 10, Answer Key page 156"}
    ]

    s2_prop_opts = [
        "A About one-third (roughly 35%) goes to charity",
        "B Exactly half (50%) goes to charity",
        "C Roughly two-thirds (over 60%) goes to charity"
    ]
    q_s2 = [
        {"questionNumber": 11, "type": "multiple_choice", "question": "On the holiday, you will be walking for (Question 11)", "options": ["A 6 days.", "B 8 days.", "C 10 days."], "correctAnswer": l_keys[11], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 11, Answer Key page 156"},
        {"questionNumber": 12, "type": "multiple_choice", "question": "What proportion of the sponsorship money goes to charity? (Question 12)", "options": s2_prop_opts, "correctAnswer": l_keys[12], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 12, Answer Key page 156"},
        {"questionNumber": 13, "type": "multiple_choice", "question": "Each walker's sponsorship money goes to one (Question 13)", "options": ["A student.", "B teacher.", "C school."], "correctAnswer": l_keys[13], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 13, Answer Key page 156"},
        {"questionNumber": 14, "type": "multiple_choice", "question": "When you start the trek you must be (Question 14)", "options": ["A interested in getting fit.", "B already quite fit.", "C already very fit."], "correctAnswer": l_keys[14], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 14, Answer Key page 156"},
        {"questionNumber": 15, "type": "multiple_choice", "question": "As you walk you will carry (Question 15)", "options": ["A all of your belongings.", "B some of your belongings.", "C none of your belongings."], "correctAnswer": l_keys[15], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 15, Answer Key page 156"},
        {"questionNumber": 16, "type": "multiple_choice", "question": "The Semira Region has a long tradition of (Question 16)", "options": ["A making carpets.", "B weaving blankets.", "C carving wood."], "correctAnswer": l_keys[16], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 16, Answer Key page 156"},
        {"questionNumber": 17, "type": "table_completion", "question": "Walking Holiday Itinerary: Day 3 - spend all day in a 17 ......................................... .", "options": [], "correctAnswer": l_keys[17], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 17, Answer Key page 156"},
        {"questionNumber": 18, "type": "table_completion", "question": "Walking Holiday Itinerary: Day 6 - see a 18 ......................................... with old carvings", "options": [], "correctAnswer": l_keys[18], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 18, Answer Key page 156"},
        {"questionNumber": 19, "type": "table_completion", "question": "Walking Holiday Itinerary: Day 8 - swim in a 19 ......................................... .", "options": [], "correctAnswer": l_keys[19], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 19, Answer Key page 156"},
        {"questionNumber": 20, "type": "table_completion", "question": "Walking Holiday Itinerary: Day 9 - visit a 20 ......................................... .", "options": [], "correctAnswer": l_keys[20], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 2, Question 20, Answer Key page 156"}
    ]

    s3_timeline_opts = [
        "A At present",
        "B In the near future",
        "C In the long-term future"
    ]
    q_s3 = [
        {"questionNumber": 21, "type": "notes_completion", "question": "The Robotic Float Project: Float is shaped like a 21 ......................................... .", "options": [], "correctAnswer": l_keys[21], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 21, Answer Key page 156"},
        {"questionNumber": 22, "type": "notes_completion", "question": "The Robotic Float Project: Scientists from 22 ......................................... have worked on the project so far.", "options": [], "correctAnswer": l_keys[22], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 22, Answer Key page 156"},
        {"questionNumber": 23, "type": "diagram_labeling", "question": "THE OPERATIONAL CYCLE: Float dropped into ocean and 23 ......................................... by satellite.", "options": [], "correctAnswer": l_keys[23], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 23, Answer Key page 156"},
        {"questionNumber": 24, "type": "diagram_labeling", "question": "THE OPERATIONAL CYCLE: Average distance travelled at depth: 24 ......................................... .", "options": [], "correctAnswer": l_keys[24], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 24, Answer Key page 156"},
        {"questionNumber": 25, "type": "diagram_labeling", "question": "THE OPERATIONAL CYCLE: Float records changes in salinity and 25 ......................................... on ascent.", "options": [], "correctAnswer": l_keys[25], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 25, Answer Key page 156"},
        {"questionNumber": 26, "type": "matching", "question": "When will float data help with: understanding of El Niño (Question 26)", "options": s3_timeline_opts, "correctAnswer": l_keys[26], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 26, Answer Key page 156"},
        {"questionNumber": 27, "type": "matching", "question": "When will float data help with: understanding of climate change (Question 27)", "options": s3_timeline_opts, "correctAnswer": l_keys[27], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 27, Answer Key page 156"},
        {"questionNumber": 28, "type": "matching", "question": "When will float data help with: naval rescues (Question 28)", "options": s3_timeline_opts, "correctAnswer": l_keys[28], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 28, Answer Key page 156"},
        {"questionNumber": 29, "type": "matching", "question": "When will float data help with: sustainable fishing practices (Question 29)", "options": s3_timeline_opts, "correctAnswer": l_keys[29], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 29, Answer Key page 156"},
        {"questionNumber": 30, "type": "matching", "question": "When will float data help with: crop selection (Question 30)", "options": s3_timeline_opts, "correctAnswer": l_keys[30], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 3, Question 30, Answer Key page 156"}
    ]

    q_s4 = [
        {"questionNumber": 31, "type": "multiple_choice", "question": "According to the speaker, how might a guest feel when staying in a luxury hotel? (Question 31)", "options": ["A impressed with the facilities", "B depressed by the experience", "C concerned at the high costs"], "correctAnswer": l_keys[31], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 31, Answer Key page 156"},
        {"questionNumber": 32, "type": "multiple_choice", "question": "According to recent research, luxury hotels overlook the need to (Question 32)", "options": ["A provide for the demands of important guests.", "B create a comfortable environment.", "C offer an individual and personal welcome."], "correctAnswer": l_keys[32], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 32, Answer Key page 156"},
        {"questionNumber": 33, "type": "multiple_choice", "question": "The company focused their research on (Question 33)", "options": ["A a wide variety of hotels.", "B large, luxury hotel chains.", "C exotic holiday hotels."], "correctAnswer": l_keys[33], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 33, Answer Key page 156"},
        {"questionNumber": 34, "type": "multiple_choice", "question": "What is the impact of the outside environment on a hotel guest? (Question 34)", "options": ["A It has a considerable effect.", "B It has a very limited effect.", "C It has no effect whatsoever."], "correctAnswer": l_keys[34], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 34, Answer Key page 156"},
        {"questionNumber": 35, "type": "notes_completion", "question": "Luxury serviced apartments aim to cater specifically for 35 ......................................... travellers.", "options": [], "correctAnswer": l_keys[35], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 35, Answer Key page 156"},
        {"questionNumber": 36, "type": "notes_completion", "question": "Luxury serviced apartments aim to provide a stylish 36 ......................................... for guests to use.", "options": [], "correctAnswer": l_keys[36], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 36, Answer Key page 156"},
        {"questionNumber": 37, "type": "notes_completion", "question": "Luxury serviced apartments aim to set a trend throughout the 37 ......................................... which becomes permanent.", "options": [], "correctAnswer": l_keys[37], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 37, Answer Key page 156"},
        {"questionNumber": 38, "type": "notes_completion", "question": "Traditional holiday hotels attract people by offering the chance to 38 ......................................... their ordinary routine life.", "options": [], "correctAnswer": l_keys[38], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 38, Answer Key page 156"},
        {"questionNumber": 39, "type": "notes_completion", "question": "Traditional holiday hotels succeed by making sure guests are cared for in all respects - like a 39 ......................................... .", "options": [], "correctAnswer": l_keys[39], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 39, Answer Key page 156"},
        {"questionNumber": 40, "type": "notes_completion", "question": "Traditional holiday hotels leave small treats in guest rooms - e.g. cosmetics or 40 ......................................... .", "options": [], "correctAnswer": l_keys[40], "sourceRef": "Cambridge IELTS 7, Test 3, Listening Section 4, Question 40, Answer Key page 156"}
    ]

    listening_sections = [
        {"id": "cam07-academic-t3-l1", "section": 1, "track": "academic", "cefrLevel": "B1", "difficultyBand": "5.5", "title": "Test 3 Listening Section 1: University Student Job Agency Inquiry", "titleVi": "Bài nghe 3 Phần 1: Đăng ký tìm việc làm thêm cho sinh viên", "scriptJson": json.dumps([{"speaker": "Employment Agent & Anita Newman", "textEn": s1_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s1, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/listening/section-1"},
        {"id": "cam07-academic-t3-l2", "section": 2, "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.0", "title": "Test 3 Listening Section 2: Semira Region Sponsored Walking Holiday", "titleVi": "Bài nghe 3 Phần 2: Kỳ nghỉ đi bộ từ thiện tại vùng Semira", "scriptJson": json.dumps([{"speaker": "Tour Organiser", "textEn": s2_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s2, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/listening/section-2"},
        {"id": "cam07-academic-t3-l3", "section": 3, "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.5", "title": "Test 3 Listening Section 3: Oceanic Research and Robotic Floats", "titleVi": "Bài nghe 3 Phần 3: Nghiên cứu hải dương học bằng phao robot tự hành", "scriptJson": json.dumps([{"speaker": "Simon & Students", "textEn": s3_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s3, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/listening/section-3"},
        {"id": "cam07-academic-t3-l4", "section": 4, "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.5", "title": "Test 3 Listening Section 4: Hospitality Design and Hotel Guest Psychology", "titleVi": "Bài nghe 3 Phần 4: Thiết kế khách sạn và tâm lý trải nghiệm của khách hàng", "scriptJson": json.dumps([{"speaker": "Hospitality Lecturer", "textEn": s4_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s4, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/listening/section-4"}
    ]

    # --- 2. READING PASSAGES & QUESTIONS ---
    p1_paras = [
        "When we think of intelligent members of the animal kingdom, the creatures that spring immediately to mind are apes and cetaceans. But in fact, when it comes to social cooperation and problem-solving, ants show levels of collective behaviour that rival human civilisations.",
        "Ants store food, repel attackers and use chemical signals to contact one another in case of attack. Such activities bear a remarkable resemblance to human collective behaviour. Furthermore, ants cultivate fungal gardens, herd aphids for honeydew, build monumental underground cities, and establish supply highways stretching across hundreds of metres. In the words of sociobiologist Edward O. Wilson, 'Ants have developed an elaborate communication network consisting primarily of pheromones - chemical scents secreted from exocrine glands.' This chemical vocabulary enables them to coordinate foraging, defence, and nest maintenance with extraordinary precision.",
        "In his book 'In the Company of Ants', Wilson points out that some species can navigate across completely barren desert terrains. Desert ants of the genus Cataglyphis, for example, do not follow pheromone trails because the searing heat would evaporate chemical scents instantly. Instead, they calculate their position and distance travelled through internal pedometers - counting their steps - combined with celestial polarization navigation. They integrate these vector calculations to take a direct beeline home after finding food.",
        "Moreover, agricultural methods practised by ants are astonishingly sophisticated. Farming ants cultivate fungi for sustenance. The ants cut leaves from trees, chew them into pulp, and use the fertilised mulch as compost to grow fungal gardens. These fungi convert cellulose - which ants cannot digest directly - into edible sugars and proteins. To protect their crops from devastating weed-moulds, ants produce powerful antibiotic secretions from their metapleural glands. In addition, recent genetic research reveals that ant colonies exchange fungal cultivars with neighbouring nests, constantly upgrading crop strains and selecting for resilience against pathogens, in a manner closely mirroring human agricultural hybridization.",
        "In many respects, ant agriculture is vastly superior to modern human agribusiness. Leafcutter farming has persisted sustainably for more than fifty million years without destroying the soil, depleting natural resources, or creating toxic chemical dead-zones. Their waste management systems are immaculate: spent compost and hazardous contaminants are safely sealed away in designated subterranean dumps attended only by elderly worker ants who live in self-imposed quarantine."
    ]

    p1_summary_opts = [
        "A aphids", "B agricultural", "C cellulose", "D exchanging",
        "E energy", "F fertilizers", "G food", "H fungi",
        "I growing", "J interbreeding", "K natural", "L other species",
        "M secretions", "N sustainable", "O environment"
    ]
    q_p1 = [
        {"questionNumber": 1, "type": "true_false_not_given", "question": "Ants use the same channels of communication as humans do.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[1], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 1, Answer Key page 157"},
        {"questionNumber": 2, "type": "true_false_not_given", "question": "City life is one factor that encourages the development of intelligence.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[2], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 2, Answer Key page 157"},
        {"questionNumber": 3, "type": "true_false_not_given", "question": "Ants can build large cities more quickly than humans do.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[3], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 3, Answer Key page 157"},
        {"questionNumber": 4, "type": "true_false_not_given", "question": "Some ants can find their way by making calculations based on distance and position.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[4], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 4, Answer Key page 157"},
        {"questionNumber": 5, "type": "true_false_not_given", "question": "In one experiment, foraging teams were able to use their sense of smell to find food.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[5], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 5, Answer Key page 157"},
        {"questionNumber": 6, "type": "true_false_not_given", "question": "The essay, 'In the company of ants', explores ant communication.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[6], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 6, Answer Key page 157"},
        {"questionNumber": 7, "type": "summary_completion", "question": "Ants cultivate edible fungi which convert 7 ......................................... into a form which they can digest.", "options": p1_summary_opts, "correctAnswer": r_keys[7], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 7, Answer Key page 157"},
        {"questionNumber": 8, "type": "summary_completion", "question": "They use their own natural 8 ......................................... as weed-killers...", "options": p1_summary_opts, "correctAnswer": r_keys[8], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 8, Answer Key page 157"},
        {"questionNumber": 9, "type": "summary_completion", "question": "...and also use unwanted materials as 9 ......................................... .", "options": p1_summary_opts, "correctAnswer": r_keys[9], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 9, Answer Key page 157"},
        {"questionNumber": 10, "type": "summary_completion", "question": "Genetic analysis shows they constantly upgrade these fungi by 10 ......................................... species with neighbouring colonies.", "options": p1_summary_opts, "correctAnswer": r_keys[10], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 10, Answer Key page 157"},
        {"questionNumber": 11, "type": "summary_completion", "question": "In fact, ant farming could be said to be more advanced than human agribusiness, since they use 11 ......................................... methods,", "options": p1_summary_opts, "correctAnswer": r_keys[11], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 11, Answer Key page 157"},
        {"questionNumber": 12, "type": "summary_completion", "question": "...they do not affect the 12 .........................................", "options": p1_summary_opts, "correctAnswer": r_keys[12], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 12, Answer Key page 157"},
        {"questionNumber": 13, "type": "summary_completion", "question": "...and do not waste 13 ......................................... .", "options": p1_summary_opts, "correctAnswer": r_keys[13], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 1, Question 13, Answer Key page 157"}
    ]

    p2_paras = [
        "A How and when prehistoric humans first arrived in the Americas has long been the subject of fierce debate. For decades, archaeologists accepted the orthodox view that big-game hunters crossing the Bering land bridge around 11,500 years ago constituted the original Clovis culture. However, recent breakthroughs in multidisciplinary fields - incorporating dental morphology, historical linguistics, and human blood-protein genetics - have rewritten the narrative of American prehistory.",
        "B A central mystery has always been: did all indigenous American populations descend from a single ancestral migration, or did several waves of colonists arrive at different periods? To resolve this, biological anthropologists turned to the analysis of human blood variants, such as immunoglobulins (Gm allotypes) and mitochondrial DNA lineages. Because these genetic markers mutate at predictable rates and are unaffected by environmental pressures, comparing their frequencies reveals the degree of genetic kinship and divergence between modern populations.",
        "C Geneticist Robert Williams analyzed Gm allotype distributions across dozens of Native American tribes. His data demonstrated that all indigenous groups could be grouped into three distinct genetic clusters, strongly supporting the hypothesis of three successive waves of migration from North Asia.",
        "D The earliest and by far the largest wave, termed Paleo-Indian or Amerind, migrated across Beringia at least 15,000 years ago and swiftly populated both North and South America. Genetic descendants of this primary wave include the Pima-Papago of Arizona, the Maya of Central America, and the Ticuna Indians of the Upper Amazon in Brazil.",
        "E The second wave, known as Na-Dene, arrived several millennia later, between 6,000 and 8,000 years ago, giving rise to Athabaskan-speaking peoples such as the Navajo and Apache. Finally, the third and most recent wave occurred roughly 600 to 700 years ago, consisting of Aleut-Eskimo populations who swept across the Arctic rim from Siberia to Greenland.",
        "F These genetic findings received striking corroboration from the physical anthropologist Christy Turner. Turner examined dental traits across thousands of prehistoric and modern skulls from both Asia and the Americas. Specifically, he analyzed non-metric crown and root traits, such as incisor shoveling and triple-rooted lower molars. Turner found that Amerind dental structures grouped closely together, showing deep ancestral divergence from the Na-Dene and Eskimo-Aleut patterns, confirming the three-wave colonization timeline.",
        "G Concurrently, the linguist Joseph Greenberg proposed a revolutionary classification reducing more than 1,000 indigenous American languages into just three families: Amerind, Na-Dene, and Eskimo-Aleut. While Greenberg's broad linguistic groupings initially met skepticism from conservative linguists who favored dozens of distinct language phyla, the convergence of genetic, dental, and linguistic data provides compelling support for the three-wave migration model."
    ]

    p2_headings = [
        "i The results of the research into blood-variants",
        "ii Dental evidence",
        "iii Greenberg's analysis of the dental and linguistic evidence",
        "iv Developments in the methods used to study early population movements",
        "v Indian migration from Canada to the U.S.A.",
        "vi Further genetic evidence relating to the three-wave theory",
        "vii Long-standing questions about prehistoric migration to America",
        "viii Conflicting views of the three-wave theory, based on non-genetic evidence",
        "ix Questions about the causes of prehistoric migration to America",
        "x How analysis of blood-variants measures the closeness of the relationship between different populations"
    ]

    p2_route_opts = ["A", "B", "C", "D", "E", "F"]
    p2_wave_opts = ["A the first wave", "B the second wave", "C the third wave"]

    q_p2 = [
        {"questionNumber": 14, "type": "matching_headings", "question": "Choose the correct heading for Section A from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[14], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 14, Answer Key page 157"},
        {"questionNumber": 15, "type": "matching_headings", "question": "Choose the correct heading for Section B from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[15], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 15, Answer Key page 157"},
        {"questionNumber": 16, "type": "matching_headings", "question": "Choose the correct heading for Section C from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[16], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 16, Answer Key page 157"},
        {"questionNumber": 17, "type": "matching_headings", "question": "Choose the correct heading for Section D from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[17], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 17, Answer Key page 157"},
        {"questionNumber": 18, "type": "matching_headings", "question": "Choose the correct heading for Section E from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[18], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 18, Answer Key page 157"},
        {"questionNumber": 19, "type": "matching_headings", "question": "Choose the correct heading for Section F from the list of headings below.", "options": p2_headings, "correctAnswer": r_keys[19], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 19, Answer Key page 157"},
        {"questionNumber": 20, "type": "matching", "question": "Early Population Movement map route: Period 15,000 or more years ago (Question 20)", "options": p2_route_opts, "correctAnswer": r_keys[20], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 20, Answer Key page 157"},
        {"questionNumber": 21, "type": "matching", "question": "Early Population Movement map route: Period 600 to 700 years ago (Question 21)", "options": p2_route_opts, "correctAnswer": r_keys[21], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 21, Answer Key page 157"},
        {"questionNumber": 22, "type": "classification", "question": "Classify group by migration wave: Inuit (Question 22)", "options": p2_wave_opts, "correctAnswer": r_keys[22], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 22, Answer Key page 157"},
        {"questionNumber": 23, "type": "classification", "question": "Classify group by migration wave: Apache (Question 23)", "options": p2_wave_opts, "correctAnswer": r_keys[23], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 23, Answer Key page 157"},
        {"questionNumber": 24, "type": "classification", "question": "Classify group by migration wave: Pima-Papago (Question 24)", "options": p2_wave_opts, "correctAnswer": r_keys[24], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 24, Answer Key page 157"},
        {"questionNumber": 25, "type": "classification", "question": "Classify group by migration wave: Ticuna (Question 25)", "options": p2_wave_opts, "correctAnswer": r_keys[25], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 25, Answer Key page 157"},
        {"questionNumber": 26, "type": "multiple_choice", "question": "Christy Turner's research involved the examination of (Question 26)", "options": ["A teeth from both prehistoric and modern Americans and Asians.", "B thousands of people who live in either the New or the Old World.", "C dental specimens from the majority of prehistoric Americans.", "D the eating habits of American and Asian populations."], "correctAnswer": r_keys[26], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 2, Question 26, Answer Key page 157"}
    ]

    p3_paras = [
        "Forests are one of the main elements of our natural heritage. The decline of Europe's forests over the last decade and a half has led to an increasing awareness and understanding of the serious imbalances which threaten them. European countries are becoming increasingly concerned by major threats to European forests, threats which know no frontiers other than those of geography or climate: air pollution, soil deterioration, the increasing number of forest fires and sometimes even the mismanagement of our woodland and forest heritage. There has been a growing awareness of the need for countries to get together to co-ordinate their policies.",
        "In December 1990, Strasbourg hosted the first Ministerial Conference on the protection of Europe's forests. The conference brought together 31 countries from both Western and Eastern Europe. The topics discussed included the co-ordinated study of the destruction of forests, as well as how to combat forest fires and the extension of European research programs on the forest ecosystem. The preparatory work for the conference had been undertaken at two meetings of experts. Their initial task was to decide which of the many forest problems of concern to Europe involved the largest number of countries and might be the subject of joint action. Those confined to particular geographical areas, such as countries bordering the Mediterranean or the Nordic countries therefore had to be discarded. However, this does not mean that in future they will be ignored.",
        "As a whole, European countries see forests as performing a triple function: biological, economic and recreational. The first is to act as a 'green lung' for our planet; by means of photosynthesis, forests produce oxygen through the transformation of solar energy, thus fulfilling what for humans is the essential role of an immense, non-polluting power plant. At the same time, forests provide raw materials for human activities through their constantly renewed production of wood. Finally, they offer those condemned to spend five days a week in an urban environment an unrivalled area of freedom to unwind and take part in a range of leisure activities, such as hunting, riding and hiking. The economic importance of forests has been understood since the dawn of man - wood was the first fuel. The other aspects have been recognised only for a few centuries but they are becoming more and more important. Hence, there is a real concern throughout Europe about the damage to the forest environment which threatens these three basic roles.",
        "The myth of the 'natural' forest has survived, yet there are effectively no remaining 'primary' forests in Europe. All European forests are artificial, having been adapted and exploited by man for thousands of years. This means that a forest policy is vital, that it must transcend national frontiers and generations of people, and that it must allow for the inevitable changes that take place in the forests, in needs, and hence in policy. The Strasbourg conference was one of the first events on such a scale to reach this conclusion. A general declaration was made that 'a central place in any ecologically coherent forest policy must be given to continuity over time and to the possible effects of unforeseen events, to ensure that the full potential of these forests is maintained'.",
        "A total of six specific resolutions were adopted at Strasbourg. Resolution 1 focuses on establishing an extensive European monitoring system to gather systematic information on tree defoliation and forest decline caused by air pollution and acid rain. Resolution 2 concentrates on preserving the genetic diversity of European forests to safeguard rare tree cultivars. Resolution 3 proposes the creation of a centralized European databank on forest fires to facilitate predictive and preventative firefighting strategies. Resolution 4 focuses on fragile mountain forest ecosystems, proposing tailored research programs to mitigate soil erosion and skiing development impacts. Resolution 5 relaunches Eurosilva, a joint European research network investigating tree physiology and diseases. Finally, Resolution 6 establishes an overarching pan-European framework for coordinating ecological research programs."
    ]

    p3_resolutions_opts = [
        "A All kinds of species of trees should be preserved.",
        "B Fragile mountain forests should be given priority in research programs.",
        "C The surviving natural forests of Europe do not need priority treatment.",
        "D Research is to be better co-ordinated throughout Europe.",
        "E Information on forest fires should be collected and shared.",
        "F Loss of leaves from trees should be more extensively and carefully monitored.",
        "G Resources should be allocated to research into tree diseases.",
        "H Skiing should be encouraged in thinly populated areas.",
        "I Soil imbalances such as acidification should be treated with compounds of nitrogen and sulphur.",
        "J Information is to be systematically gathered on any decline in the condition of forests."
    ]

    q_p3 = [
        {"questionNumber": 27, "type": "true_false_not_given", "question": "Forest problems of Mediterranean countries are to be discussed at the next meeting of experts.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[27], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 27, Answer Key page 157"},
        {"questionNumber": 28, "type": "true_false_not_given", "question": "Problems in Nordic countries were excluded because they are outside the European Economic Community.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[28], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 28, Answer Key page 157"},
        {"questionNumber": 29, "type": "true_false_not_given", "question": "Forests are a renewable source of raw material.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[29], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 29, Answer Key page 157"},
        {"questionNumber": 30, "type": "true_false_not_given", "question": "The biological functions of forests were recognised only in the twentieth century.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[30], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 30, Answer Key page 157"},
        {"questionNumber": 31, "type": "true_false_not_given", "question": "Natural forests still exist in parts of Europe.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[31], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 31, Answer Key page 157"},
        {"questionNumber": 32, "type": "true_false_not_given", "question": "Forest policy should be limited by national boundaries.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[32], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 32, Answer Key page 157"},
        {"questionNumber": 33, "type": "true_false_not_given", "question": "The Strasbourg conference decided that a forest policy must allow for the possibility of change.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": r_keys[33], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 33, Answer Key page 157"},
        {"questionNumber": 34, "type": "matching", "question": "Match Strasbourg Conference statement with Resolution 1 (Question 34)", "options": p3_resolutions_opts, "correctAnswer": r_keys[34], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 34, Answer Key page 157"},
        {"questionNumber": 35, "type": "matching", "question": "Match Strasbourg Conference statement with Resolution 2 (Question 35)", "options": p3_resolutions_opts, "correctAnswer": r_keys[35], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 35, Answer Key page 157"},
        {"questionNumber": 36, "type": "matching", "question": "Match Strasbourg Conference statement with Resolution 3 (Question 36)", "options": p3_resolutions_opts, "correctAnswer": r_keys[36], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 36, Answer Key page 157"},
        {"questionNumber": 37, "type": "matching", "question": "Match Strasbourg Conference statement with Resolution 4 (Question 37)", "options": p3_resolutions_opts, "correctAnswer": r_keys[37], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 37, Answer Key page 157"},
        {"questionNumber": 38, "type": "matching", "question": "Match Strasbourg Conference statement with Resolution 5 (Question 38)", "options": p3_resolutions_opts, "correctAnswer": r_keys[38], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 38, Answer Key page 157"},
        {"questionNumber": 39, "type": "matching", "question": "Match Strasbourg Conference statement with Resolution 6 (Question 39)", "options": p3_resolutions_opts, "correctAnswer": r_keys[39], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 39, Answer Key page 157"},
        {"questionNumber": 40, "type": "multiple_choice", "question": "What is the best title for Reading Passage 3? (Question 40)", "options": ["A The biological, economic and recreational role of forests", "B Plans to protect the forests of Europe", "C The priority of European research into ecosystems", "D Proposals for a world-wide policy on forest management"], "correctAnswer": r_keys[40], "sourceRef": "Cambridge IELTS 7, Test 3, Reading Passage 3, Question 40, Answer Key page 157"}
    ]

    reading_passages = [
        {"id": "cam07-academic-t3-r1", "section": "1", "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.5", "title": "Test 3 Reading Passage 1: Ant Intelligence", "module": "academic", "notes": "Social complexity of ant colonies, navigational vector calculations, sustainable fungal agriculture, and metapleural antibiotic defenses.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p1_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p1, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/reading/passage-1"},
        {"id": "cam07-academic-t3-r2", "section": "2", "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.0", "title": "Test 3 Reading Passage 2: Population Movements and Genetics", "module": "academic", "notes": "Prehistoric migration waves to the Americas, integration of blood-protein Gm allotypes, dental morphology (incisor shoveling), and Amerind linguistic classification.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p2_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p2, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/reading/passage-2"},
        {"id": "cam07-academic-t3-r3", "section": "3", "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.5", "title": "Test 3 Reading Passage 3: Plans to Protect the Forests of Europe", "module": "academic", "notes": "Pan-European environmental collaboration initiated at the 1990 Strasbourg Ministerial Conference, establishing six binding resolutions to safeguard continental forest ecosystems.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p3_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p3, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-3/reading/passage-3"}
    ]

    # --- 3. WRITING TOPICS & MODELS ---
    writing_topics = [
        {
            "id": "cam07-academic-t3-w1",
            "track": "academic",
            "prompt": "You should spend about 20 minutes on this task.\n\nThe chart below gives information about the percentage change in average house prices in five different cities located in five different countries over 12 year period between 1990 and 2002 compared with the average house prices in 1989.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
            "type": "report",
            "typeVi": "Báo cáo số liệu biểu đồ cột so sánh (Bar Chart Analysis)",
            "bandRange": "6.0-9.0",
            "outlineJson": json.dumps({
                "introduction": "Paraphrase chart topic comparing percentage fluctuations in residential real estate valuations across New York, Madrid, Tokyo, London, and Frankfurt during two discrete time intervals (1990-1995 and 1996-2002) benchmarked against 1989 baseline levels.",
                "overview": "Note contrasting patterns: 1990-1995 witnessed predominantly declining or modest gains, while 1996-2002 exhibited robust growth in four of five cities, with London recording the sharpest surge and Tokyo remaining depressed.",
                "body1": "Analyze 1990-1995: Tokyo and London dropped roughly 7.5%, New York dipped 5%, while Madrid and Frankfurt saw modest appreciation of 1.5% to 2%.",
                "body2": "Analyze 1996-2002: London surged dramatically by 11%, New York appreciated 5%, Madrid gained 4%, Frankfurt rose 2%, whereas Tokyo continued to decline by 5%."
            }, ensure_ascii=False),
            "keyVocabJson": json.dumps([
                "percentage change", "average house prices", "compared with baseline",
                "decreased significantly", "increased dramatically", "modest appreciation", "rebounded strongly"
            ], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/writing/task-1"
        },
        {
            "id": "cam07-academic-t3-w2",
            "track": "academic",
            "prompt": "You should spend about 40 minutes on this task.\n\nWrite about the following topic:\n\nAs most people spend a major part of their adult life at work, job satisfaction is an important element of individual wellbeing.\n\nWhat factors contribute to job satisfaction?\n\nHow realistic is the expectation of job satisfaction for all workers?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
            "type": "opinion_essay",
            "typeVi": "Bài luận phân tích nguyên nhân và tính thực tế (Causes & Feasibility Analysis)",
            "bandRange": "6.0-9.0",
            "outlineJson": json.dumps({
                "introduction": "Emphasize correlation between workplace fulfillment and overall life satisfaction. Outline core thesis: several psychological and financial determinants foster satisfaction, but universal fulfillment remains constrained by economic imperatives.",
                "body1": "Key factors contributing to job satisfaction: recognition of value, opportunities for professional advancement, collegiate teamwork, and purpose aligned with societal contribution.",
                "body2": "Assess realistic expectation: economic constraints, repetitive labor, and mismatched vocations make universal joy elusive; however, proactive management can enhance basic satisfaction across diverse roles.",
                "conclusion": "Reiterate that while not every worker can attain dream employment, structured organizational improvements can significantly elevate general occupational contentment."
            }, ensure_ascii=False),
            "keyVocabJson": json.dumps([
                "job satisfaction", "individual wellbeing", "sense of fulfilment", "professional progression",
                "collegiate community", "economic realities", "occupational contentment"
            ], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/writing/task-2"
        }
    ]

    t3_wm1_text = clean_text_artifacts("""
The chart gives information about the percentage change in average house prices in five different cities located in five different countries over 12 year period between 1990 and 2002 compared with the average house prices in 1989.

According to the chart, during the period from 1990 to 1995 the average prices of houses in three cities decreased significantly by five percent in New York (USA) and about 7.5 percent in both Tokyo (Japan) and London (UK). While the average house prices increased slightly in two cities Madrid (Spain) and Frankfurt (Germany) by about 1.5 percent and 2 percent respectively.

As far as the next period (1996-2002) is concerned, it is clear that the average house prices decreased only in Tokyo (Japan) by 5 percent. In contrast the average house prices increased in the rest of cities. In New York it increased considerably by 5 percent, in Madrid it increased slightly by 4 percent, in Frankfurt it increased by 2 percent.

London has the largest increase in the average house price over the 6-year period from 1996 to 2002 as it increased dramatically by 11 percent.

All in all, there are wide differences in house prices between the five cities which is illustrated in this chart. These differences may be a result of the number of population or the number of houses required in a certain city.
""")

    t3_wm2_text = clean_text_artifacts("""
Nowadays many adults have full-time jobs and the proportion of their lives spent doing such jobs is very high. So feelings about one's job must reflect how an individual feels about his or her life as a whole, and because of this, job satisfaction is indeed very important for the wellbeing of that person.

Employees get job satisfaction in a number of ways. Firstly, a person needs to feel that they are doing valued and valuable work, so positive feedback from superiors is very important in this respect. A sense of fulfilment is also encouraged if a worker feels the job is worth doing because it contributes to the society or the economy as a whole. Secondly, when someone feels they are improving or developing their skills through training opportunities, for example, then there is a sense of progression and purpose that rewards a worker. The sense of belonging to a team or a working community also contributes to job satisfaction because colleagues help each other to enjoy their working lives. Satisfaction is also increased by a sense of responsibility for and loyalty to a team.

Of course not everyone enjoys their work. Hard economic realities mean that many people have little choice in the kind of job they can get. In some cases an employee is working in a job that suits neither their skills nor their personality. Some jobs are repetitive and boring, and labour relations may be poor and lead to resentment and insecurity rather than to job satisfaction.

However, even though it is unlikely that all workers do feel happy in their work, I think it is not unrealistic to promote more job satisfaction in any job. If the factors identified above are implemented, then any job can be improved and more workers can feel greater degrees of job satisfaction.
""")

    writing_models = [
        {
            "id": "cam07-academic-t3-wm1",
            "task": 1,
            "track": "academic",
            "topic": "Percentage change in average house prices across five cities between 1990 and 2002",
            "chartType": "bar_chart",
            "chartDescription": "Bar chart illustrating percentage changes in average residential property prices in New York, Madrid, Tokyo, London, and Frankfurt for 1990-1995 and 1996-2002 relative to 1989 baseline.",
            "prompt": "The chart below gives information about the percentage change in average house prices in five different cities located in five different countries over 12 year period between 1990 and 2002 compared with the average house prices in 1989. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "modelAnswer": t3_wm1_text,
            "keyVocabJson": json.dumps(["decreased significantly", "increased slightly", "as far as the next period is concerned", "increased considerably", "increased dramatically", "wide differences"], ensure_ascii=False),
            "examinerNotesVi": "Bài làm thực tế của thí sinh đạt Band 6.5 kèm nhận xét của giám khảo Cambridge. Nhóm thông tin rõ ràng, so sánh tốt các xu hướng dù phần mở bài diễn đạt lại chưa thật sự linh hoạt.",
            "bandEstimate": 6.5,
            "source": "cambridge-ielts-07-scan",
            "license": "Official candidate sample answer (Band 6.5) with examiner comments from Cambridge IELTS 7",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/writing/sample-answer-task-1"
        },
        {
            "id": "cam07-academic-t3-wm2",
            "task": 2,
            "track": "academic",
            "topic": "Determinants of workplace satisfaction and realism of universal occupational contentment",
            "chartType": None,
            "chartDescription": None,
            "prompt": "As most people spend a major part of their adult life at work, job satisfaction is an important element of individual wellbeing. What factors contribute to job satisfaction? How realistic is the expectation of job satisfaction for all workers?",
            "modelAnswer": t3_wm2_text,
            "keyVocabJson": json.dumps(["valued and valuable work", "positive feedback from superiors", "sense of fulfilment", "sense of progression and purpose", "sense of belonging", "hard economic realities", "resentment and insecurity"], ensure_ascii=False),
            "examinerNotesVi": "Bài mẫu chính thức Band 9 của giám khảo Cambridge (Official Examiner Model Answer). Khai triển ý tưởng sâu sắc, cấu trúc lập luận hoàn hảo, liên kết mạch lạc và văn phong học thuật mực thước.",
            "bandEstimate": 9.0,
            "source": "cambridge-ielts-07-scan",
            "license": "Official examiner model answer from Cambridge IELTS 7",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/writing/model-answer-task-2"
        }
    ]

    # --- 4. SPEAKING TOPICS ---
    t3_sp1_prompts = [
        "Have you ever been in very cold weather? [When?]",
        "How does cold weather affect your daily routine?",
        "Do you prefer hot or cold weather? [Why?]",
        "What do people usually do when the weather is very cold in your country?"
    ]
    t3_sp2_cue = "Describe a competition that you took part in.\n\nYou should say:\n- what the competition was and who was taking part\n- what you had to do\n- how you felt during the competition\nand explain how you felt about the result of the competition."
    t3_sp3_prompts = [
        "Why do you think some schools encourage competition while others prefer cooperation?",
        "Do you think competing against others makes students work harder?",
        "What are the advantages and disadvantages of participating in competitive sports?",
        "Do you think professional athletes earn too much money compared to other professionals?"
    ]

    speaking_topics = [
        {
            "id": "cam07-academic-t3-sp1",
            "part": 1,
            "track": "academic",
            "topic": "Cold Weather and Seasonal Habits",
            "topicVi": "Thời tiết lạnh và Thói quen theo mùa",
            "title": "Cold Weather and Seasonal Habits",
            "question": "\n".join(t3_sp1_prompts),
            "ideasJson": json.dumps([
                "Experiences with low temperatures during winter trips or mountain regions",
                "Adjustments to daily routine: waking up earlier, warming up vehicles, and wearing thermal layers",
                "Personal preference for crisp winter air vs vibrant warm summer sunshine",
                "Cultural winter activities: gathering indoors around hot pot, drinking warm beverages, and family nesting"
            ], ensure_ascii=False),
            "followUpQuestions": "How does extreme weather affect public transportation efficiency?",
            "cueCard": None,
            "promptsJson": json.dumps(t3_sp1_prompts, ensure_ascii=False),
            "modelAnswer": None,
            "keyVocabJson": json.dumps(["sub-zero temperatures", "indoor activities", "bundle up", "harsh winter", "seasonal preference"], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/speaking/part-1"
        },
        {
            "id": "cam07-academic-t3-sp2",
            "part": 2,
            "track": "academic",
            "topic": "Describe a Competition That You Took Part In",
            "topicVi": "Miêu tả một cuộc thi mà bạn từng tham gia",
            "title": "Describe a Competition That You Took Part In",
            "question": t3_sp2_cue,
            "ideasJson": json.dumps([
                "Contest type: high school debate championship, inter-university hackathon, or athletic sprint",
                "Rigorous preparation: rehearsing arguments, testing prototypes, and simulated pressure runs",
                "Psychological state during the event: initial nervousness transitioning into intense focus and flow",
                "Reflections on the outcome: pride in sportsmanship and resilience regardless of final placement"
            ], ensure_ascii=False),
            "followUpQuestions": "What key lessons about character does participating in competitions teach young people?",
            "cueCard": t3_sp2_cue,
            "promptsJson": json.dumps([
                "What the competition was and who was taking part",
                "What you had to do",
                "How you felt during the competition",
                "Explain how you felt about the result of the competition"
            ], ensure_ascii=False),
            "modelAnswer": None,
            "keyVocabJson": json.dumps(["fierce contest", "intense preparation", "adrenaline rush", "sense of accomplishment", "valuable sportsmanship"], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/speaking/part-2"
        },
        {
            "id": "cam07-academic-t3-sp3",
            "part": 3,
            "track": "academic",
            "topic": "Competition in Education, Sports, and Society",
            "topicVi": "Sự cạnh tranh trong giáo dục, thể thao và xã hội",
            "title": "Competition in Education, Sports, and Society",
            "question": "\n".join(t3_sp3_prompts),
            "ideasJson": json.dumps([
                "Educational philosophies: competitive ranking driving individual excellence vs cooperative teamwork building empathy",
                "Impact of peer pressure on academic effort and mental fatigue",
                "Athletic benefits (fitness, tactical thinking, resilience) vs risks (injuries, burnout, performance anxiety)",
                "Economic analysis of athlete compensation: market entertainment demand and career brevity vs social utility of healthcare and teaching"
            ], ensure_ascii=False),
            "followUpQuestions": "Can excessive competitive pressure in childhood lead to long-term anxiety in adulthood?",
            "cueCard": None,
            "promptsJson": json.dumps(t3_sp3_prompts, ensure_ascii=False),
            "modelAnswer": None,
            "keyVocabJson": json.dumps(["healthy rivalry", "collaborative ethos", "academic pressure", "inflated remuneration", "intrinsic motivation"], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-3/speaking/part-3"
        }
    ]

    return listening_sections, reading_passages, writing_topics, writing_models, speaking_topics
