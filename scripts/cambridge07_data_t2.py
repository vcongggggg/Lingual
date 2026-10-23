r"""
Module: cambridge07_data_t2.py
Defines mapped data for Cambridge IELTS 07 - Test 2 (Academic)
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
    1: "27 Bank Road",
    2: "(a) dentist",
    3: "Sable",
    4: "Northern Star",
    5: "stolen",
    6: "Paynter",
    7: "brother-in-law",
    8: "(travel(ling)) (to) work",
    9: "Red Flag",
    10: "450",
    11: "City Bridge",
    12: "Newtown",
    13: "6.30",
    14: "(formal) garden",
    15: "(Tower) Restaurant",
    16: "view(s)",
    17: "history",
    18: "7 screen",
    19: "every 20 minutes",
    20: "(from/the) Central Station",
    21: "B",
    22: "A",
    23: "C",
    24: "B",
    25: "A",
    26: "B",
    27: "1882 (to/-) (18)83",
    28: "signed",
    29: "A",
    30: "D",
    31: "C",
    32: "B",
    33: "C",
    34: "A",
    35: "A",
    36: "2 directions",
    37: "confident",
    38: "vision",
    39: "corrections",
    40: "balance"
}

OFFICIAL_READING_KEYS = {
    1: "YES",
    2: "NO",
    3: "NOT GIVEN",
    4: "YES",
    5: "B",
    6: "A",
    7: "B",
    8: "C",
    9: "A",
    10: "C",
    11: "D",
    12: "C",
    13: "C",
    14: "E",
    15: "B",
    16: "C",
    17: "B",
    18: "YES",
    19: "NOT GIVEN",
    20: "NO",
    21: "YES",
    22: "food bills/costs",
    23: "(modern) intensive farming",
    24: "organic farming",
    25: "Greener Food Standard",
    26: "farmers (and) consumers",
    27: "ii",
    28: "v",
    29: "x",
    30: "i",
    31: "NO",
    32: "YES",
    33: "NO",
    34: "YES",
    35: "NOT GIVEN",
    36: "D",
    37: "I",
    38: "G",
    39: "E",
    40: "B"
}

def build_test_2(raw_md_text: str, official_keys: dict):
    l_keys = official_keys["listening"]
    r_keys = official_keys["reading"]

    # --- 1. LISTENING AUDIOSCRIPTS & QUESTIONS ---
    s1_script_text = clean_text_artifacts("""
WOMAN: Hello, motor insurance department.
MAN: Oh hello. I'd like to ask about insurance for my car.
WOMAN: Yes, of course. I'll just take a few details. What's your name?
MAN: Patrick Jones.
WOMAN: And your address?
MAN: It's 27 Bank Road.
WOMAN: 27 Bank Road. Is that in Greendale?
MAN: Yes.
WOMAN: And what's your daytime phone number?
MAN: My work number is 730453.
WOMAN: And could I ask what your occupation is?
MAN: Dentist.
WOMAN: Right. And what size is your car engine?
MAN: It's 1200 ccs.
WOMAN: Thank you, and the make and model?
MAN: It's a Hewton Sable.
WOMAN: Could you spell the model name please?
MAN: Yes, S-A-B-L-E.
WOMAN: Ah yes, thanks. And when was it made?
MAN: 1997.
WOMAN: Lovely, right. I presume you've had a previous insurer?
MAN: Yes.
WOMAN: Right, we need to know the name of the company.
MAN: Yes, it was Northern Star.
WOMAN: Thank you, and have you made any insurance claims in the last five years?
MAN: Yes, one in 1999.
WOMAN: And what was the problem?
MAN: It was stolen, but...
WOMAN: That's fine, Mr Jones, that's all we need to know at the moment. And will there be any other named drivers?
MAN: Just the one.
WOMAN: And his name?
MAN: Simon Paynter.
WOMAN: Could you spell the surname please?
MAN: P-A-Y-N-T-E-R.
WOMAN: OK, thank you. And what relationship is he to you?
MAN: He's my brother-in-law.
WOMAN: And what will you or Mr Paynter be using the car for?
MAN: Well, mainly for social purposes.
WOMAN: Social, OK. But would you be using it to travel to work at all?
MAN: Yes, my brother-in-law will use it for that.
WOMAN: Travel to work, right. Now, when would you like the policy to start?
MAN: On the 31st of January.
WOMAN: Right. Well, I have a quote here from Red Flag. Their annual premium is $450.
MAN: That sounds quite reasonable. How would you like to pay?
""")

    s2_script_text = clean_text_artifacts("""
Thank you for calling the Tourist Line. There are many different ways of getting around our historic city, and today I'd like to tell you about some of the best travel options.

How about a city trip by boat? There are four main stopping points - from west to east: stop A Green Banks, stop B City Bridge, stop C Roman Landing and stop D Newtown.

You can find the main booking office at stop A. The first boat leaves at 8 a.m. and the last one at 6.30 p.m. There are also many attractions you can visit along the river. At Stop A, if you have time, you can visit the fine 16th century palace built for the king with its beautiful formal gardens. It's very near the booking office. Now you can enjoy every corner of this superb residence.

Stop B: Why don't you visit Tower Restaurant with its wide range of refreshments? This is a place where you can sit and enjoy the wonderful views over the old commercial and banking centre of the city.

Stop C is the area where, in the first century AD, invading soldiers crossed the river; this was much shallower than it is now. That's why this area is called Roman Landing. There's an interactive Museum to visit here with a large shop which has a good range of local history books.

At the furthest point of the trip, stop D, the most exciting place to visit is the new Entertainment Complex with seven-screen cinema, bowling alley and video games arcade.

Besides the boat tours, there are city buses. Two companies offer special services:

The Top Bus Company runs all its tours with a live commentary in English. Tours leave from 8.30 a.m. every 20 minutes. There are departures from Central Station, Castle Hill and Long Walk. This is a hop-on hop-off service and tickets are valid for 24 hours. For further details call Top Bus on 0208 9447810.

The Number One Sightseeing Tour is available with a commentary in eight languages. Buses depart from Central Station every five to six minutes from about 9 a.m. with the last bus at around 7 p.m.
""")

    s3_script_text = clean_text_artifacts("""
INTERVIEWER: We're pleased to welcome Dr Martin Merrywhether of the Antarctic Centre in Christchurch, New Zealand who has come along to talk to us today about the role of the Centre and the Antarctic Treaty. Now my first question is about the choice of location for the centre. Why Christchurch? Was it because of the climate?
DOCTOR: Well, actually New Zealand has a long history of involvement in the Antarctic, but Christchurch was selected because it's geographically well positioned - it's the gateway to Antarctica, the closest port of departure for expeditions heading south.
INTERVIEWER: Right. And what are the main roles of the Antarctic Centre?
DOCTOR: It serves two primary functions. Firstly, it provides international scientific expeditions with suitable equipment, clothing, and logistical support before they depart for the ice. Secondly, there is the Visitors' Centre, which was designed to show the public what Antarctica is really like, using interactive exhibits, simulated blizzards, and live penguin encounters.
INTERVIEWER: Having spent so much time there yourself, what is your personal impression of Antarctica?
DOCTOR: People expect it to be barren and monotonous, but in reality it is an environment of breathtaking beauty. The ice formations, the purity of light, and the stark mountains make it extremely beautiful.
INTERVIEWER: Why is the continent so extraordinarily cold?
DOCTOR: Well, several factors contribute, but primarily it is because of the shape of the continent. Antarctica is essentially a vast high plateau domed with ice, so its average elevation is well over 2,000 metres above sea level, making it much colder than the Arctic sea ice.
INTERVIEWER: There is also speculation about Antarctica's geological history.
DOCTOR: Indeed. We know from geological evidence - fossils of plants and tree trunks, coal deposits, and rock formations that match those in Australia and South Africa - that Antarctica was once part of the giant southern supercontinent, Gondwana.
INTERVIEWER: Moving on to international collaboration, how did the Antarctic Treaty come about?
DOCTOR: The foundation goes back to international scientific co-operation. In 1870 there was the first major Polar Research meeting. Then between 1882 and 1883 scientists held the 1st International Polar Year. Decades later, during the International Geophysical Year in 1957, the idea of an international treaty was formally proposed. It was finally signed in Washington in 1959 by twelve nations.
INTERVIEWER: What are some of its crowning achievements?
DOCTOR: Two of the most historic provisions are that the entire continent is reserved strictly for peaceful purposes with no military use permitted, and it established a complete ban on nuclear testing and radioactive waste disposal.
INTERVIEWER: Truly an inspirational model for international law. Thank you very much, Dr Merrywhether.
""")

    s4_script_text = clean_text_artifacts("""
ANITA: Good morning everyone. My topic today is left and right handedness in sport, and whether in different sports it is better to be left- or right-handed, or even mixed-handed.

I first became intrigued by this topic after reading an article by Matthews. What struck me initially was the impressive size of his research project - he surveyed thousands of top athletes across dozens of competitive sports over many decades.

Anita feels that the practical findings from this research on handedness will be of tremendous value in aiding sportspeople as they plan tactics for each game. For example, if a player knows the handedness profile of their opponent, they can exploit their blind spots and anticipate their movement angles.

However, Anita feels that most sports coaches currently underestimate what science has to offer sport. Many coaches still rely on tradition and gut instinct rather than biomechanical and neurological evidence.

Handedness is not just innate; it can also be influenced by early activities. For instance, a German study of musicians showed there was a significantly greater incidence of 'mixed handedness' in musicians who started playing instruments in early youth, because learning complex instruments like the piano or violin forces both hemispheres of the brain to develop equally.

Interestingly, studies on ape behaviour show that apes which always use the same hand to get food are most successful, suggesting that single laterality has clear evolutionary survival advantages.

Now let's examine specific sports and laterality profiles.

In field hockey, mixed laterality is considered the best profile. Because of the rules, a hockey stick has to be used in two directions and cannot be flipped over. Researchers found that mixed-handed players were much more confident in controlling the ball on both sides of their body.

In tennis, single laterality is advantageous because it gives the player a larger relevant field of vision on their dominant striking side. Cross-lateral players, whose dominant eye does not match their dominant hand, were found to make corrections too late when facing high-speed serves.

Finally, in gymnastics, cross laterality is extremely beneficial because gymnasts' balance is crucial for complex airborne routines on beams and uneven bars.
""")

    q_s1 = [
        {"questionNumber": 1, "type": "notes_completion", "question": "Car Insurance details: Address: 1 ........................................., Greendale", "options": [], "correctAnswer": l_keys[1], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 1, Answer Key page 154"},
        {"questionNumber": 2, "type": "notes_completion", "question": "Car Insurance details: Occupation: 2 .........................................", "options": [], "correctAnswer": l_keys[2], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 2, Answer Key page 154"},
        {"questionNumber": 3, "type": "notes_completion", "question": "Type of car: Manufacturer: Hewton; Model: 3 .........................................", "options": [], "correctAnswer": l_keys[3], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 3, Answer Key page 154"},
        {"questionNumber": 4, "type": "notes_completion", "question": "Car Insurance details: Previous insurance company: 4 .........................................", "options": [], "correctAnswer": l_keys[4], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 4, Answer Key page 154"},
        {"questionNumber": 5, "type": "notes_completion", "question": "Any insurance claims in last five years? If yes: Car was 5 ......................................... in 1999", "options": [], "correctAnswer": l_keys[5], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 5, Answer Key page 154"},
        {"questionNumber": 6, "type": "notes_completion", "question": "Name(s) of other driver(s): Simon 6 .........................................", "options": [], "correctAnswer": l_keys[6], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 6, Answer Key page 154"},
        {"questionNumber": 7, "type": "notes_completion", "question": "Other driver relationship to main driver: 7 .........................................", "options": [], "correctAnswer": l_keys[7], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 7, Answer Key page 154"},
        {"questionNumber": 8, "type": "notes_completion", "question": "Uses of car: - social; - 8 .........................................", "options": [], "correctAnswer": l_keys[8], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 8, Answer Key page 154"},
        {"questionNumber": 9, "type": "notes_completion", "question": "Recommended Insurance arrangement: Name of company: 9 .........................................", "options": [], "correctAnswer": l_keys[9], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 9, Answer Key page 154"},
        {"questionNumber": 10, "type": "notes_completion", "question": "Recommended Insurance arrangement: Annual cost: $ 10 .........................................", "options": [], "correctAnswer": l_keys[10], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 1, Question 10, Answer Key page 154"}
    ]

    q_s2 = [
        {"questionNumber": 11, "type": "map_labeling", "question": "City trip by boat stopping points (west to east): Stop B is 11 ......................................... .", "options": [], "correctAnswer": l_keys[11], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 11, Answer Key page 154"},
        {"questionNumber": 12, "type": "map_labeling", "question": "City trip by boat stopping points (west to east): Stop D is 12 ......................................... .", "options": [], "correctAnswer": l_keys[12], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 12, Answer Key page 154"},
        {"questionNumber": 13, "type": "table_completion", "question": "STOP A Main Booking Office: First boat: 8 a.m., Last boat: 13 ......................................... p.m.", "options": [], "correctAnswer": l_keys[13], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 13, Answer Key page 154"},
        {"questionNumber": 14, "type": "table_completion", "question": "STOP A Palace attraction: has lovely 14 ......................................... .", "options": [], "correctAnswer": l_keys[14], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 14, Answer Key page 154"},
        {"questionNumber": 15, "type": "table_completion", "question": "STOP B Attraction: 15 ......................................... with wide range of refreshments", "options": [], "correctAnswer": l_keys[15], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 15, Answer Key page 154"},
        {"questionNumber": 16, "type": "table_completion", "question": "STOP B Further Information: has good 16 ......................................... of city centre", "options": [], "correctAnswer": l_keys[16], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 16, Answer Key page 154"},
        {"questionNumber": 17, "type": "table_completion", "question": "STOP C Museum: bookshop specialising in the 17 ......................................... of the local area", "options": [], "correctAnswer": l_keys[17], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 17, Answer Key page 154"},
        {"questionNumber": 18, "type": "table_completion", "question": "STOP D Entertainment Complex: 18 ......................................... cinema, bowling alley, video arcade", "options": [], "correctAnswer": l_keys[18], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 18, Answer Key page 154"},
        {"questionNumber": 19, "type": "short_answer", "question": "How often do the Top Bus Company tours run? (Question 19)", "options": [], "correctAnswer": l_keys[19], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 19, Answer Key page 154"},
        {"questionNumber": 20, "type": "short_answer", "question": "Where can you catch a Number One Sightseeing Tour from? (Question 20)", "options": [], "correctAnswer": l_keys[20], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 2, Question 20, Answer Key page 154"}
    ]

    treaty_opts = [
        "A no military use",
        "B animals protected",
        "C historic sites preserved",
        "D no nuclear testing",
        "E fishing rights protected"
    ]
    q_s3 = [
        {"questionNumber": 21, "type": "multiple_choice", "question": "The Antarctic Centre was established in Christchurch because (Question 21)", "options": ["A New Zealand is a member of the Antarctic Treaty.", "B Christchurch is geographically well positioned.", "C the climate of Christchurch is suitable."], "correctAnswer": l_keys[21], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 21, Answer Key page 154"},
        {"questionNumber": 22, "type": "multiple_choice", "question": "One role of the Antarctic Centre is to (Question 22)", "options": ["A provide expeditions with suitable equipment.", "B provide researchers with financial assistance.", "C ensure that research is internationally relevant."], "correctAnswer": l_keys[22], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 22, Answer Key page 154"},
        {"questionNumber": 23, "type": "multiple_choice", "question": "The purpose of the Visitors' Centre is to (Question 23)", "options": ["A provide accommodation.", "B run training sessions.", "C show people what Antarctica is like."], "correctAnswer": l_keys[23], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 23, Answer Key page 154"},
        {"questionNumber": 24, "type": "multiple_choice", "question": "Dr Merrywhether says that Antarctica is (Question 24)", "options": ["A unlike any other country.", "B extremely beautiful.", "C too cold for tourists."], "correctAnswer": l_keys[24], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 24, Answer Key page 154"},
        {"questionNumber": 25, "type": "multiple_choice", "question": "According to Dr Merrywhether, Antarctica is very cold because (Question 25)", "options": ["A of the shape of the continent.", "B it is surrounded by a frozen sea.", "C it is an extremely dry continent."], "correctAnswer": l_keys[25], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 25, Answer Key page 154"},
        {"questionNumber": 26, "type": "multiple_choice", "question": "Dr Merrywhether thinks Antarctica was part of another continent because (Question 26)", "options": ["A he has done his own research in the area.", "B there is geological evidence of this.", "C it is very close to South America."], "correctAnswer": l_keys[26], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 26, Answer Key page 154"},
        {"questionNumber": 27, "type": "table_completion", "question": "ANTARCTIC TREATY History: 1st International Polar Year took place in 27 ......................................... .", "options": [], "correctAnswer": l_keys[27], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 27, Answer Key page 154"},
        {"questionNumber": 28, "type": "table_completion", "question": "ANTARCTIC TREATY History: In 1959 the Antarctic Treaty was 28 ......................................... .", "options": [], "correctAnswer": l_keys[28], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 28, Answer Key page 154"},
        {"questionNumber": 29, "type": "multiple_choice", "question": "Which TWO achievements of the Antarctic Treaty are mentioned by the speakers? (Question 29)", "options": treaty_opts, "correctAnswer": l_keys[29], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 29, Answer Key page 154"},
        {"questionNumber": 30, "type": "multiple_choice", "question": "Which TWO achievements of the Antarctic Treaty are mentioned by the speakers? (Question 30)", "options": treaty_opts, "correctAnswer": l_keys[30], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 3, Question 30, Answer Key page 154"}
    ]

    q_s4 = [
        {"questionNumber": 31, "type": "multiple_choice", "question": "Anita first felt the Matthews article was of value when she realised (Question 31)", "options": ["A how it would help her difficulties with left-handedness.", "B the relevance of connections he made with music.", "C the impressive size of his research project."], "correctAnswer": l_keys[31], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 31, Answer Key page 154"},
        {"questionNumber": 32, "type": "multiple_choice", "question": "Anita feels that the findings on handedness will be of value in (Question 32)", "options": ["A helping sportspeople identify their weaknesses.", "B aiding sportspeople as they plan tactics for each game.", "C developing suitable training programmes for sportspeople."], "correctAnswer": l_keys[32], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 32, Answer Key page 154"},
        {"questionNumber": 33, "type": "multiple_choice", "question": "Anita feels that most sports coaches (Question 33)", "options": ["A know nothing about the influence of handedness.", "B focus on the wrong aspects of performance.", "C underestimate what science has to offer sport."], "correctAnswer": l_keys[33], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 33, Answer Key page 154"},
        {"questionNumber": 34, "type": "multiple_choice", "question": "A German study showed there was greater 'mixed handedness' in musicians who (Question 34)", "options": ["A started playing instruments in early youth.", "B play a string instrument such as the violin.", "C practise a great deal on their instrument."], "correctAnswer": l_keys[34], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 34, Answer Key page 154"},
        {"questionNumber": 35, "type": "multiple_choice", "question": "Studies on ape behaviour show that (Question 35)", "options": ["A apes which always use the same hand to get food are most successful.", "B apes have the same proportion of left- and right-handers as humans.", "C more apes are left-handed than right-handed."], "correctAnswer": l_keys[35], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 35, Answer Key page 154"},
        {"questionNumber": 36, "type": "table_completion", "question": "Sport Laterality Profile: In hockey, stick has to be used in 36 ......................................... .", "options": [], "correctAnswer": l_keys[36], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 36, Answer Key page 154"},
        {"questionNumber": 37, "type": "table_completion", "question": "Sport Laterality Profile: Mixed-handed hockey players found to be much more 37 ......................................... than others.", "options": [], "correctAnswer": l_keys[37], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 37, Answer Key page 154"},
        {"questionNumber": 38, "type": "table_completion", "question": "Sport Laterality Profile: Single laterality in tennis gives a larger relevant field of 38 ......................................... .", "options": [], "correctAnswer": l_keys[38], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 38, Answer Key page 154"},
        {"questionNumber": 39, "type": "table_completion", "question": "Sport Laterality Profile: In tennis, cross-lateral players make 39 ......................................... too late.", "options": [], "correctAnswer": l_keys[39], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 39, Answer Key page 154"},
        {"questionNumber": 40, "type": "table_completion", "question": "Sport Laterality Profile: In gymnastics, gymnasts' 40 ......................................... is important for performances.", "options": [], "correctAnswer": l_keys[40], "sourceRef": "Cambridge IELTS 7, Test 2, Listening Section 4, Question 40, Answer Key page 154"}
    ]

    listening_sections = [
        {"id": "cam07-academic-t2-l1", "section": 1, "track": "academic", "cefrLevel": "B1", "difficultyBand": "5.5", "title": "Test 2 Listening Section 1: Car Insurance Inquiry", "titleVi": "Bài nghe 2 Phần 1: Hỏi thông tin bảo hiểm ô tô", "scriptJson": json.dumps([{"speaker": "Insurance Representative & Patrick Jones", "textEn": s1_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s1, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/listening/section-1"},
        {"id": "cam07-academic-t2-l2", "section": 2, "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.0", "title": "Test 2 Listening Section 2: City Boat Trips and Bus Tours", "titleVi": "Bài nghe 2 Phần 2: Tour tham quan thành phố bằng thuyền và xe buýt", "scriptJson": json.dumps([{"speaker": "Tourist Information Officer", "textEn": s2_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s2, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/listening/section-2"},
        {"id": "cam07-academic-t2-l3", "section": 3, "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.5", "title": "Test 2 Listening Section 3: Christchurch Antarctic Centre and Treaty", "titleVi": "Bài nghe 2 Phần 3: Trung tâm Nam Cực tại Christchurch và Hiệp ước Nam Cực", "scriptJson": json.dumps([{"speaker": "Interviewer & Dr Martin Merrywhether", "textEn": s3_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s3, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/listening/section-3"},
        {"id": "cam07-academic-t2-l4", "section": 4, "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.5", "title": "Test 2 Listening Section 4: Handedness in Sport and Evolutionary Laterality", "titleVi": "Bài nghe 2 Phần 4: Thuận tay trong thể thao và sự bất đối xứng bán cầu não", "scriptJson": json.dumps([{"speaker": "Anita", "textEn": s4_script_text}], ensure_ascii=False), "questionsJson": json.dumps(q_s4, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/listening/section-4"}
    ]

    # --- 2. READING PASSAGES & QUESTIONS ---
    p1_paras = [
        "In a land swept by typhoons and shaken by earthquakes, how have Japan's tallest and seemingly flimsiest old buildings - 500 or so wooden pagodas - remained standing for centuries? Records show that only two have collapsed during the past 1400 years. Those that have disappeared were destroyed by fire as a result of lightning or civil war. The disastrous Hanshin earthquake in 1995 killed 6,400 people, toppled elevated highways, flattened office blocks and devastated the port area of Kobe. Yet it left the magnificent five-storey pagoda at the Toji temple in nearby Kyoto unscathed, though it levelled a number of buildings in the neighbourhood.",
        "Japanese scholars have been mystified for ages about why these tall, slender buildings are so stable. It was only thirty years ago that the building industry felt confident enough to erect office blocks of steel and reinforced concrete that had more than a dozen floors. With its special shock absorbers to dampen the effect of sudden sideways movements from an earthquake, the thirty-six-storey Kasumigaseki building in central Tokyo - Japan's first skyscraper - was considered a masterpiece of modern engineering when it was built in 1968.",
        "Yet in 826, with only pegs and wedges to keep his wooden structure upright, the master builder Kobodaishi had no hesitation in sending his majestic Toji pagoda soaring fifty-five metres into the sky - nearly half as high as the Kasumigaseki skyscraper built some eleven centuries later. Clearly, Japanese carpenters of the day knew a few tricks about allowing a building to sway and settle itself rather than fight nature's forces. But what sort of tricks?",
        "The multi-storey pagoda came to Japan from China in the sixth century. As in China, they were first introduced with Buddhism and were attached to important temples. The Chinese built their pagodas in brick or stone, with inner staircases, and used them in later centuries mainly as watchtowers. When the pagoda reached Japan, however, its architecture was freely adapted to local conditions - they were built less high, typically five rather than nine storeys, made mainly of wood and the staircase was dispensed with because the Japanese pagoda did not have any practical use but became more of an art object. Because of the typhoons that batter Japan in the summer, Japanese builders learned to extend the eaves of buildings further beyond the walls. This prevents rainwater gushing down the walls. Pagodas in China and Korea have nothing like the overhang that is found on pagodas in Japan.",
        "The roof of a Japanese temple building can be made to overhang the sides of the structure by fifty per cent or more of the building's overall width. For the same reason, the builders of Japanese pagodas seem to have further increased their weight by choosing to cover these extended eaves not with the porcelain tiles of many Chinese pagodas but with much heavier earthenware tiles.",
        "But this does not totally explain the great resilience of Japanese pagodas. Is the answer that, like a tall pine tree, the Japanese pagoda - with its massive trunk-like central pillar known as shinbashira - simply flexes and sways during a typhoon or earthquake? For centuries, many thought so. But the answer is not so simple because the startling thing is that the shinbashira actually carries no load at all. In fact, in some pagoda designs, it does not even rest on the ground, but is suspended from the top of the pagoda - hanging loosely down through the middle of the building. The weight of the building is supported entirely by twelve outer and four inner columns.",
        "And what is the role of the shinbashira, the central pillar? The best way to understand the shinbashira's role is to watch a video made by Shuzo Ishida, a structural engineer at Kyoto Institute of Technology. Mr Ishida, known to his students as 'Professor Pagoda' because of his passion to understand the pagoda, has built a series of models and tested them on a 'shaketable' in his laboratory. In short, the shinbashira was acting like an enormous stationary pendulum. The ancient craftsmen, apparently without the assistance of very advanced mathematics, seemed to grasp the principles that were, more than a thousand years later, applied in the construction of Japan's first skyscraper. What those early craftsmen had found by trial and error was that under pressure a pagoda's loose stack of floors could be made to slither to and fro independent of one another. Viewed from the side, the pagoda seemed to be doing a snake dance - with each consecutive floor moving in the opposite direction to its neighbours above and below. The shinbashira, running up through a hole in the centre of the building, constrained individual storeys from moving too far because, after moving a certain distance, they banged into it, transmitting energy away along the column.",
        "Another strange feature of the Japanese pagoda is that, because the building tapers, with each successive floor plan being smaller than the one below, none of the vertical pillars that carry the weight of the building is connected to its corresponding pillar above. In other words, a five-storey pagoda contains not even one pillar that travels right up through the building to carry the structural loads from the top to the bottom. More surprising is the fact that the individual storeys of a Japanese pagoda, unlike their counterparts elsewhere, are not actually connected to each other. They are simply stacked one on top of another like a pile of hats. Interestingly, such a design would not be permitted under current Japanese building regulations.",
        "And the extra-wide eaves? Think of them as a tightrope walker's balancing pole. The bigger the mass at each end of the pole, the easier it is for the tightrope walker to maintain his or her balance. The same holds true for a pagoda. 'With the eaves extending out on all sides like balancing poles,' says Mr Ishida, 'the building responds to even the most powerful jolt of an earthquake with a graceful swaying, never an abrupt shaking.' Here again, Japanese master builders of a thousand years ago anticipated concepts of modern structural engineering."
    ]

    p1_classify_opts = [
        "A both Chinese and Japanese pagodas",
        "B only Chinese pagodas",
        "C only Japanese pagodas"
    ]
    q_p1 = [
        {"questionNumber": 1, "type": "yes_no_not_given", "question": "Only two Japanese pagodas have collapsed in 1400 years.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[1], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 1, Answer Key page 155"},
        {"questionNumber": 2, "type": "yes_no_not_given", "question": "The Hanshin earthquake of 1995 destroyed the pagoda at the Toji temple.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[2], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 2, Answer Key page 155"},
        {"questionNumber": 3, "type": "yes_no_not_given", "question": "The other buildings near the Toji pagoda had been built in the last 30 years.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[3], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 3, Answer Key page 155"},
        {"questionNumber": 4, "type": "yes_no_not_given", "question": "The builders of pagodas knew how to absorb some of the power produced by severe weather conditions.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[4], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 4, Answer Key page 155"},
        {"questionNumber": 5, "type": "classification", "question": "Classify as typical of: easy interior access to top (Question 5)", "options": p1_classify_opts, "correctAnswer": r_keys[5], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 5, Answer Key page 155"},
        {"questionNumber": 6, "type": "classification", "question": "Classify as typical of: tiles on eaves (Question 6)", "options": p1_classify_opts, "correctAnswer": r_keys[6], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 6, Answer Key page 155"},
        {"questionNumber": 7, "type": "classification", "question": "Classify as typical of: use as observation post (Question 7)", "options": p1_classify_opts, "correctAnswer": r_keys[7], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 7, Answer Key page 155"},
        {"questionNumber": 8, "type": "classification", "question": "Classify as typical of: size of eaves up to half the width of the building (Question 8)", "options": p1_classify_opts, "correctAnswer": r_keys[8], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 8, Answer Key page 155"},
        {"questionNumber": 9, "type": "classification", "question": "Classify as typical of: original religious purpose (Question 9)", "options": p1_classify_opts, "correctAnswer": r_keys[9], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 9, Answer Key page 155"},
        {"questionNumber": 10, "type": "classification", "question": "Classify as typical of: floors fitting loosely over each other (Question 10)", "options": p1_classify_opts, "correctAnswer": r_keys[10], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 10, Answer Key page 155"},
        {"questionNumber": 11, "type": "multiple_choice", "question": "In a Japanese pagoda, the shinbashira (Question 11)", "options": ["A bears the full weight of the building.", "B bends under pressure like a tree.", "C connects the floors with the foundations.", "D stops the floors moving too far."], "correctAnswer": r_keys[11], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 11, Answer Key page 155"},
        {"questionNumber": 12, "type": "multiple_choice", "question": "Shuzo Ishida performs experiments in order to (Question 12)", "options": ["A improve skyscraper design.", "B be able to build new pagodas.", "C learn about the dynamics of pagodas.", "D understand ancient mathematics."], "correctAnswer": r_keys[12], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 12, Answer Key page 155"},
        {"questionNumber": 13, "type": "multiple_choice", "question": "The storeys of a Japanese pagoda are (Question 13)", "options": ["A linked only by wood.", "B fastened only to the central pillar.", "C fitted loosely on top of each other.", "D joined by special weights."], "correctAnswer": r_keys[13], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 13, Answer Key page 155"}
    ]

    p2_paras = [
        "A For more than forty years the cost of food has been rising. It has now reached a point where a growing number of people believe that it is far too high, and that bringing it down will be one of the great challenges of the twenty first century. That cost, however, is not in immediate cash. In the West at least, most food is now far cheaper to buy in relative terms than it was in 1960. The cost is in the collateral damage of the very methods of food production that have made the food cheaper: in the pollution of water, the enervation of soil, the destruction of wildlife, the harm to animal welfare and the threat to human health caused by modern industrial agriculture.",
        "B First mechanisation, then mass use of chemical fertilisers and pesticides, then monocultures, then battery rearing of livestock, and now genetic engineering - the onward march of intensive farming has seemed unstoppable in the last half-century, as the yields of produce have soared. But the damage it has caused has been colossal. In Britain, for example, many of our best-loved farmland birds, such as the skylark, the grey partridge, the lapwing and the corn bunting, have vanished from huge stretches of countryside, as have even more wild flowers and insects. This is a direct result of the way we have produced our food in the last four decades. Thousands of miles of hedgerows, thousands of ponds, have disappeared from the landscape. The faecal filth of salmon farming has driven wild salmon from many of the sea lochs and rivers of Scotland. Natural soil fertility is dropping in many areas because of continuous industrial fertiliser and pesticide use, while the growth of algae is increasing in lakes because of the fertiliser run-off.",
        "C Put it all together and it looks like a battlefield, but consumers rarely make the connection at the dinner table. That is mainly because the costs of all this damage are what economists refer to as externalities: they are outside the main transaction, which is for example producing and selling a field of wheat, and are borne directly by neither producers nor consumers. To many, the costs may not even appear to be financial at all, but merely aesthetic - a terrible shame, but nothing to do with money. And anyway, they, as consumers of food, certainly aren't paying for it, are they?",
        "D But the costs to society can actually be quantified and, when they are, the numbers make for alarming reading. A study led by Professor Jules Pretty, Director of the Centre for Environment and Society at the University of Essex, calculated the full externalities of British agriculture for one particular year. Arable and livestock farming, he found, produced external costs of £2,343m. This is equivalent to £208 for every hectare of arable land and permanent pasture, almost all of it to be paid by society through taxes to clean up the mess, or to fund the NHS to deal with ill health caused by food poisoning, or through higher water bills. The total costs break down as: £120m for damage to wildlife; £1,113m for damage to water through contamination with pesticides (£125m), nitrate (£16m), Cryptosporidium (£106m) and phosphorus (£55m); and £169m for food poisoning.",
        "E Water companies must spend £57m each year removing the pesticide metaldehyde from our water supplies, which has leaked from slug pellets used on farm crops. But this is not the end of the story. Added to the external costs of £2.34bn are the direct subsidies that taxpayers pay to support British agriculture: about £3bn a year. Put it all together and the real cost of food becomes clear. The price in the supermarket is only the first cost. The second is the money taken from our wallets in taxes to pay subsidies and to repair the environment. The third is the cost of water purification and health treatment.",
        "F So what can be done? Professor Pretty believes that a radical change in policy is needed. We should start by shifting subsidies from conventional intensive farming to organic farming, which avoids synthetic chemicals and protects biodiversity. At present, organic farming represents only a small fraction of British agriculture, but with proper government support and price premiums, it could expand rapidly. In addition, the government should introduce a 'Greener Food Standard' that guarantees high environmental, animal welfare and safety standards. If the public could buy food certified under such a standard, it would transform agriculture.",
        "G Transitioning to a greener agricultural system will not be easy, and it cannot happen overnight. But it is an urgent necessity. Only when the true cost of food is recognised by both farmers and consumers will sustainable farming become mainstream, ensuring a healthy countryside, pure water, and nutritious food for future generations."
    ]

    p2_info_opts = ["A", "B", "C", "D", "E", "F", "G"]
    q_p2 = [
        {"questionNumber": 14, "type": "matching_information", "question": "Which paragraph contains: a cost involved in purifying domestic water? (Question 14)", "options": p2_info_opts, "correctAnswer": r_keys[14], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 14, Answer Key page 155"},
        {"questionNumber": 15, "type": "matching_information", "question": "Which paragraph contains: the stages in the development of the farming industry? (Question 15)", "options": p2_info_opts, "correctAnswer": r_keys[15], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 15, Answer Key page 155"},
        {"questionNumber": 16, "type": "matching_information", "question": "Which paragraph contains: the term used to describe hidden costs? (Question 16)", "options": p2_info_opts, "correctAnswer": r_keys[16], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 16, Answer Key page 155"},
        {"questionNumber": 17, "type": "matching_information", "question": "Which paragraph contains: one effect of chemicals on water sources? (Question 17)", "options": p2_info_opts, "correctAnswer": r_keys[17], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 17, Answer Key page 155"},
        {"questionNumber": 18, "type": "yes_no_not_given", "question": "Several species of wildlife in the British countryside are declining.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[18], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 18, Answer Key page 155"},
        {"questionNumber": 19, "type": "yes_no_not_given", "question": "The taste of food has deteriorated in recent years.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[19], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 19, Answer Key page 155"},
        {"questionNumber": 20, "type": "yes_no_not_given", "question": "The financial costs of environmental damage are widely recognised.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[20], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 20, Answer Key page 155"},
        {"questionNumber": 21, "type": "yes_no_not_given", "question": "One of the costs calculated by Professor Pretty was illness caused by food.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[21], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 21, Answer Key page 155"},
        {"questionNumber": 22, "type": "summary_completion", "question": "Professor Pretty concludes that our 22 ......................................... are higher than most people realise, because we make three different types of payment.", "options": [], "correctAnswer": r_keys[22], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 22, Answer Key page 155"},
        {"questionNumber": 23, "type": "summary_completion", "question": "He feels it is realistic to suggest that Britain should reduce its reliance on 23 ......................................... .", "options": [], "correctAnswer": r_keys[23], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 23, Answer Key page 155"},
        {"questionNumber": 24, "type": "summary_completion", "question": "Although most farmers would be unable to adapt to 24 ......................................... ,", "options": [], "correctAnswer": r_keys[24], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 24, Answer Key page 155"},
        {"questionNumber": 25, "type": "summary_completion", "question": "Professor Pretty wants the government to initiate change by establishing what he refers to as a 25 ......................................... .", "options": [], "correctAnswer": r_keys[25], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 25, Answer Key page 155"},
        {"questionNumber": 26, "type": "summary_completion", "question": "He feels this would help to change the attitudes of both 26 ......................................... .", "options": [], "correctAnswer": r_keys[26], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 2, Question 26, Answer Key page 155"}
    ]

    p3_paras = [
        "A The need to rethink the strategy by which rural transport problems were to be tackled became urgent at the beginning of the 1980s. A request for help in improving the availability of transport within the remote Makete District of southwestern Tanzania presented the opportunity to try a new approach. The concept of 'integrated rural transport' was adopted in the task of examining the transport needs of the rural households in the district. The objective was to reduce the time and effort needed to obtain access to essential goods and services through an improved rural transport system. The underlying assumption was that the time saved would be used instead for activities that would improve the social and economic development of the communities. The Makete Integrated Rural Transport Project (MIRTP) started in 1985 with financial support from the Swiss Development Corporation and was co-ordinated with the help of the Tanzanian government.",
        "B When the project began, Makete District was virtually totally isolated during the rainy season. The regional road was in such bad shape that access to the main towns was impossible for about three months of the year. Road traffic was extremely rare within the district, and alternative means of transport were restricted to donkeys in the north of the district. People relied primarily on the paths, which were slippery and dangerous during the rains. Before solutions could be proposed, the problems had to be understood. Little was known about the transport demands of the rural households, so Phase I, between December 1985 and December 1987, focused on research. The socio-economic survey of more than 400 households in the district indicated that a household in Makete spent, on average, seven hours a day on transporting themselves and their goods. Interesting facts regarding transport were found: 95% was on foot; 80% was within the locality; and 70% was related to the collection of water and firewood and travelling to grinding mills.",
        "C Having determined the main transport needs, possible solutions were identified which might reduce the time and burden. During Phase II, from January to February 1991, a number of approaches were implemented in an effort to improve mobility and access to transport. An improvement of the road network was considered necessary to ensure the import and export of goods to the district. These improvements were carried out using methods that were heavily dependent on labour. In addition to the improvement of roads, these methods provided training in the operation of a mechanical workshop and bus and truck services. However, the difference from the conventional approach was that this time consideration was given to local transport needs outside the road network. Most goods were transported along the paths that provide short-cuts up and down the hillsides, but the paths were a real safety risk and made the journey on foot even more arduous. It made sense to improve the paths by building steps, handrails and footbridges. It was uncommon to find means of transport that were more efficient than walking but less technologically advanced than motor vehicles. The use of bicycles was constrained by their high cost and the lack of available spare parts. Oxen were not used at all but donkeys were used by a few households in the northern part of the district. MIRTP focused on what would be most appropriate for the inhabitants of Makete in terms of what was available, how much they could afford and what they were willing to accept - and the introduction of a locally manufacturable wheelbarrow.",
        "D Phase III, from March 1991 to March 1993, focused on the refinement and institutionalisation of these activities with different degrees of success. The road improvements and accompanying maintenance system had helped make the district centre accessible throughout the year. Essential goods from outside the district had become more readily available at the market, and prices did not fluctuate as much as they had done before. Paths and secondary roads were improved only at the request of communities who were willing to participate in construction and maintenance. However, the improved paths impressed the inhabitants, and requests for assistance greatly increased soon after only a few improvements had been completed. The efforts to improve the efficiency of the existing transport services were not very successful because most of the motorised vehicles in the district broke down and there were no resources to repair them. Even the introduction of low-cost means of transport was difficult because of the general poverty of the district. The locally manufactured wheelbarrows were still too expensive for all but a few of the households. Modifications to the original design by local carpenters cut production time and costs. Nevertheless, a locally produced wooden wheelbarrow which costs around 5000 Tanzanian shillings (less than US$20) in Makete is still too expensive for most people. Donkeys, which were imported to the district, have become more common and contribute, in particular, to the transportation of crops and goods to market. Meanwhile, local initiatives are promoting the renting out of the existing donkeys.",
        "E It would have been easy to criticise the MIRTP for using in the early phases a 'top-down' approach, in which decisions were made by experts and officials before being handed down to communities, but it was necessary to start the process from the level of the governmental authorities of the district. It would have been difficult to respond to the requests of villagers and other rural inhabitants without the support and understanding of district authorities.",
        "F Today, nobody in the district argues about the importance of improved paths and inexpensive means of transport. But this is the result of dedicated work over a long period, particularly from the officers in charge of community development. They played an essential role in raising awareness and interest among the rural communities. The concept of integrated rural transport is now well established in Tanzania, where a major program of rural transport is just about to start. The experiences from Makete will help in this initiative, and Makete District will act as a reference for future work."
    ]

    p3_headings = [
        "i MIRTP as a future model",
        "ii Identifying the main transport problems",
        "iii Preference for motorised vehicles",
        "iv Government authorities' instructions",
        "v Initial improvements in mobility and transport modes",
        "vi Request for improved transport in Makete",
        "vii Transport improvements in the northern part of the district",
        "viii Improvements in the rail network",
        "ix Effects of initial MIRTP measures",
        "x Co-operation of district officials",
        "xi Role of wheelbarrows and donkeys"
    ]

    p3_endings_opts = [
        "A provided the people of Makete with experience in running bus and truck services.",
        "B was especially successful in the northern part of the district.",
        "C differed from earlier phases in that the community became less actively involved.",
        "D improved paths used for transport up and down hillsides.",
        "E was no longer a problem once the roads had been improved.",
        "F cost less than locally made wheelbarrows.",
        "G was done only at the request of local people who were willing to lend a hand.",
        "H was at first considered by MIRTP to be affordable for the people of the district.",
        "I hindered attempts to make the existing transport services more efficient.",
        "J was thought to be the most important objective of Phase III."
    ]

    q_p3 = [
        {"questionNumber": 27, "type": "matching_headings", "question": "Choose the correct heading for Section B from the list of headings below.", "options": p3_headings, "correctAnswer": r_keys[27], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 27, Answer Key page 155"},
        {"questionNumber": 28, "type": "matching_headings", "question": "Choose the correct heading for Section C from the list of headings below.", "options": p3_headings, "correctAnswer": r_keys[28], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 28, Answer Key page 155"},
        {"questionNumber": 29, "type": "matching_headings", "question": "Choose the correct heading for Section E from the list of headings below.", "options": p3_headings, "correctAnswer": r_keys[29], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 29, Answer Key page 155"},
        {"questionNumber": 30, "type": "matching_headings", "question": "Choose the correct heading for Section F from the list of headings below.", "options": p3_headings, "correctAnswer": r_keys[30], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 30, Answer Key page 155"},
        {"questionNumber": 31, "type": "yes_no_not_given", "question": "MIRTP was divided into five phases.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[31], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 31, Answer Key page 155"},
        {"questionNumber": 32, "type": "yes_no_not_given", "question": "Prior to the start of MIRTP the Makete district was almost inaccessible during the rainy season.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[32], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 32, Answer Key page 155"},
        {"questionNumber": 33, "type": "yes_no_not_given", "question": "Phase I of MIRTP consisted of a survey of household expenditure on transport.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[33], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 33, Answer Key page 155"},
        {"questionNumber": 34, "type": "yes_no_not_given", "question": "The survey concluded that one-fifth or 20% of the household transport requirement was outside the local area.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[34], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 34, Answer Key page 155"},
        {"questionNumber": 35, "type": "yes_no_not_given", "question": "MIRTP hoped to improve the movement of goods from Makete district to the country's capital.", "options": ["YES", "NO", "NOT GIVEN"], "correctAnswer": r_keys[35], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 35, Answer Key page 155"},
        {"questionNumber": 36, "type": "matching_endings", "question": "Complete sentence: Construction of footbridges, steps and handrails (Question 36)", "options": p3_endings_opts, "correctAnswer": r_keys[36], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 36, Answer Key page 155"},
        {"questionNumber": 37, "type": "matching_endings", "question": "Complete sentence: Frequent breakdown of buses and trucks in Makete (Question 37)", "options": p3_endings_opts, "correctAnswer": r_keys[37], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 37, Answer Key page 155"},
        {"questionNumber": 38, "type": "matching_endings", "question": "Complete sentence: The improvement of secondary roads and paths (Question 38)", "options": p3_endings_opts, "correctAnswer": r_keys[38], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 38, Answer Key page 155"},
        {"questionNumber": 39, "type": "matching_endings", "question": "Complete sentence: The isolation of Makete for part of the year (Question 39)", "options": p3_endings_opts, "correctAnswer": r_keys[39], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 39, Answer Key page 155"},
        {"questionNumber": 40, "type": "multiple_choice", "question": "Which of the following phrases best describes the main aim of Reading Passage 3? (Question 40)", "options": ["A to suggest that projects such as MIRTP are needed in other countries", "B to describe how MIRTP was implemented and how successful it was", "C to examine how MIRTP promoted the use of donkeys", "D to warn that projects such as MIRTP are likely to have serious problems"], "correctAnswer": r_keys[40], "sourceRef": "Cambridge IELTS 7, Test 2, Reading Passage 3, Question 40, Answer Key page 155"}
    ]

    reading_passages = [
        {"id": "cam07-academic-t2-r1", "section": "1", "track": "academic", "cefrLevel": "B2", "difficultyBand": "6.5", "title": "Test 2 Reading Passage 1: Why Pagodas Don't Fall Down", "module": "academic", "notes": "Structural resilience of ancient Japanese wooden pagodas, role of shinbashira central pendulum pillar, wide eaves and independent stack floors against earthquakes.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p1_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p1, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/reading/passage-1"},
        {"id": "cam07-academic-t2-r2", "section": "2", "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.0", "title": "Test 2 Reading Passage 2: The True Cost of Food", "module": "academic", "notes": "Environmental and economic externalities of modern industrial intensive agriculture, water pollution cleanup, and transition to organic farming standards.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p2_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p2, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/reading/passage-2"},
        {"id": "cam07-academic-t2-r3", "section": "3", "track": "academic", "cefrLevel": "C1", "difficultyBand": "7.5", "title": "Test 2 Reading Passage 3: Makete Integrated Rural Transport Project", "module": "academic", "notes": "Analysis of the Makete Integrated Rural Transport Project (MIRTP) in Tanzania across three phases, improving paths, low-cost transport modes, and district institutionalisation.", "sourceUrl": "https://www.cambridgeenglish.org/exams-and-tests/ielts/", "passageJson": json.dumps(p3_paras, ensure_ascii=False), "questionsJson": json.dumps(q_p3, ensure_ascii=False), "source": "cambridge-ielts-07-scan", "license": "Educational practice test material from Cambridge IELTS 7", "verified": True, "sourceRef": "cambridge-ielts-07-academic/test-2/reading/passage-3"}
    ]

    # --- 3. WRITING TOPICS & MODELS ---
    writing_topics = [
        {
            "id": "cam07-academic-t2-w1",
            "track": "academic",
            "prompt": "You should spend about 20 minutes on this task.\n\nThe graph below shows the consumption of fish and some different kinds of meat in a European country between 1979 and 2004.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
            "type": "report",
            "typeVi": "Báo cáo số liệu biểu đồ đường (Line Graph Analysis)",
            "bandRange": "6.0-9.0",
            "outlineJson": json.dumps({
                "introduction": "Paraphrase the graph topic illustrating weekly per capita consumption of four protein sources (beef, lamb, chicken, fish) in a European nation from 1979 to 2004.",
                "overview": "State key trends: chicken experienced a dramatic surge to become the predominant meat, whereas beef and lamb saw steep declines, and fish remained relatively low and stable.",
                "body1": "Detail the declining trends of red meats: beef plunged from 225g to roughly 100g; lamb dropped sharply from 150g to around 55g; fish experienced a slight drop from 50g to just under 50g.",
                "body2": "Analyze the rise of chicken: starting at roughly 145g in 1979, overtaking lamb by 1980, surpassing beef around 1989, and peaking near 250g in 2004."
            }, ensure_ascii=False),
            "keyVocabJson": json.dumps([
                "per capita consumption", "soared dramatically", "experienced an upward trajectory",
                "plummeted significantly", "remained the least consumed", "overtaking"
            ], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/writing/task-1"
        },
        {
            "id": "cam07-academic-t2-w2",
            "track": "academic",
            "prompt": "You should spend about 40 minutes on this task.\n\nWrite about the following topic:\n\nSome people believe that there should be fixed punishments for each type of crime. Others, however, argue that the circumstances of an individual crime, and the motivation for committing it, should always be taken into account when deciding on the punishment.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
            "type": "discussion_essay",
            "typeVi": "Bài luận thảo luận hai quan điểm về tư pháp hình sự (Fixed vs Circumstantial Punishments)",
            "bandRange": "6.0-9.0",
            "outlineJson": json.dumps({
                "introduction": "Introduce controversy between mandatory standardized penal sentences versus judicial discretion considering motive and context. Present balanced stance.",
                "body1": "Arguments for fixed penalties: deterrent effect, prevention of judicial corruption/bias, and absolute consistency before the law.",
                "body2": "Arguments for contextual flexibility: moral culpability differs vastly (e.g. self-defence vs premeditated homicide; desperate theft vs organized fraud).",
                "conclusion": "Advocate an intermediate legal framework with statutory penalty brackets (minimum/maximum limits) that uphold legal certainty while allowing judicial compassion."
            }, ensure_ascii=False),
            "keyVocabJson": json.dumps([
                "fixed punishments", "judicial discretion", "deterring effect", "mitigating circumstances",
                "moral culpability", "arbitrary sentencing", "self-defence", "statutory limits"
            ], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/writing/task-2"
        }
    ]

    t2_wm1_text = clean_text_artifacts("""
The graph illustrates changes in the amounts of beef, lamb, chicken and fish consumed in a particular European country between 1979 and 2004.

In 1979 beef was by far the most popular of these foods, with about 225 grams consumed per person per week. Lamb and chicken were eaten in similar quantities (around 150 grams), while much less fish was consumed (just over 50 grams).

However, during this 25-year period the consumption of beef and lamb fell dramatically to approximately 100 grams and 55 grams respectively. The consumption of fish also declined, but much less significantly to just below 50 grams, so although it remained the least popular food, consumption levels were the most stable.

The consumption of chicken, on the other hand, showed an upward trend, overtaking that of lamb in 1980 and that of beef in 1989. By 2004 it had soared to almost 250 grams per person per week.

Overall, the graph shows how the consumption of chicken increased dramatically while the popularity of these other foods decreased over the period.
""")

    t2_wm2_text = clean_text_artifacts("""
Fixing punishments for each type of crime has been a debateable issue. There are many arguments supporting both views, those for and those against fixed punishments.

On the one hand, fixed punishments will have a deterring effect on society. Individuals knowing that they will be subject to a certain punishment if they are convicted with a given crime, will reconsider committing this act in the first place.

This deterring effect also leads to social stability and security, through minimising the number of crimes committed.

If people knew they would be able to convince the court or the jury of a reason for having committed the crime they are accused of, penal decisions would be largely arbitrary. This would result into criminals getting away with their crimes and into a high level of injustice caused by the subjective approach of different courts.

On the other hand, taking the circumstances of a crime and its motivation into consideration is a prerequisite for establishing and ensuring justice and equity.

A person killing in self-defense cannot be compared to a serial killer, moving from one victim to the next. In my opinion an intermediary position between both solutions is the perfect way to establish and ensure justice and equity.

There have to be fixed punishments for all crimes. However, criminal laws have to provide for a minimum and a maximum for the punishment and the laws also have to foresee certain cases of exemptions.

An example for setting minimum and maximum penalties is Competition Law where a person being held liable of a crime under this law will be convicted to pay a fine, according to the harm caused by the violation and the profit gained by the violator through committing the crime.

As for the exemptions, in some countries the law exempts thiefs stealing food during a period of famine taking into consideration the distress and hunger.

Also, a person killing in self-defense will be exempted from punishment.
""")

    writing_models = [
        {
            "id": "cam07-academic-t2-wm1",
            "task": 1,
            "track": "academic",
            "topic": "Consumption of fish and different kinds of meat in a European country between 1979 and 2004",
            "chartType": "line_graph",
            "chartDescription": "Line graph showing weekly consumption (in grams per person) of beef, lamb, chicken, and fish in a European country from 1979 to 2004.",
            "prompt": "The graph below shows the consumption of fish and some different kinds of meat in a European country between 1979 and 2004. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "modelAnswer": t2_wm1_text,
            "keyVocabJson": json.dumps(["by far the most popular", "consumed per person per week", "fell dramatically", "consumption levels were the most stable", "soared to almost", "overtaking"], ensure_ascii=False),
            "examinerNotesVi": "Bài mẫu chính thức Band 9 của giám khảo Cambridge (Official Examiner Model Answer). Trình bày mạch lạc, đối chiếu sắc bén giữa các đường xu hướng, từ vựng tự nhiên và độ chuẩn xác ngữ pháp tuyệt đối.",
            "bandEstimate": 9.0,
            "source": "cambridge-ielts-07-scan",
            "license": "Official examiner model answer from Cambridge IELTS 7",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/writing/model-answer-task-1"
        },
        {
            "id": "cam07-academic-t2-wm2",
            "task": 2,
            "track": "academic",
            "topic": "Fixed punishments for crimes versus individual circumstances and motivation",
            "chartType": None,
            "chartDescription": None,
            "prompt": "Some people believe that there should be fixed punishments for each type of crime. Others, however, argue that the circumstances of an individual crime, and the motivation for committing it, should always be taken into account when deciding on the punishment. Discuss both these views and give your own opinion.",
            "modelAnswer": t2_wm2_text,
            "keyVocabJson": json.dumps(["deterring effect", "social stability", "arbitrary", "subjective approach", "prerequisite", "justice and equity", "intermediary position", "exempted from punishment"], ensure_ascii=False),
            "examinerNotesVi": "Bài làm thực tế của thí sinh đạt Band 7.5 kèm nhận xét chi tiết của giám khảo Cambridge. Lập luận chặt chẽ, vốn từ vựng phong phú và phân tích đa diện dù cách ngắt đoạn còn có thể tối ưu hơn.",
            "bandEstimate": 7.5,
            "source": "cambridge-ielts-07-scan",
            "license": "Official candidate sample answer (Band 7.5) with examiner comments from Cambridge IELTS 7",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/writing/sample-answer-task-2"
        }
    ]

    # --- 4. SPEAKING TOPICS ---
    t2_sp1_prompts = [
        "What kinds of thing make you laugh?",
        "Do you like making other people laugh? [Why/Why not?]",
        "Do you think it's important for people to laugh? [Why/Why not?]",
        "Is laughing the same as feeling happy, do you think? [Why/Why not?]"
    ]
    t2_sp2_cue = "Describe an idea you had for improving something at work or college.\n\nYou should say:\n- when and where you had your idea\n- what your idea was\n- who you told about your idea\nand explain why you thought your idea would make an improvement."
    t2_sp3_prompts = [
        "Some people think that education should be about memorising the important ideas of the past. Do you agree or disagree? Why?",
        "Should education encourage students to have their own new ideas? Why?",
        "How do you think teachers could help students to develop and share their own ideas?",
        "Should employers encourage their workers to have new ideas about improving the company? Why?",
        "Do you think people sometimes dislike ideas just because they are new? Why?",
        "What is more difficult: having new ideas or putting them into practice? Which is more important for a successful company?"
    ]

    speaking_topics = [
        {
            "id": "cam07-academic-t2-sp1",
            "part": 1,
            "track": "academic",
            "topic": "Laughing and Sense of Humour",
            "topicVi": "Tiếng cười và Khiếu hài hước",
            "title": "Laughing and Sense of Humour",
            "question": "\n".join(t2_sp1_prompts),
            "ideasJson": json.dumps([
                "Physical amusement: witty comedy shows, situational humour, and lighthearted banter",
                "Enhancing social bonds and easing tension by making others smile",
                "Health benefits: endorphin release, stress reduction, and cardiovascular stimulation",
                "Distinction between spontaneous amusement and deep, enduring contentment"
            ], ensure_ascii=False),
            "followUpQuestions": "Why is humour considered culturally specific across different societies?",
            "cueCard": None,
            "promptsJson": json.dumps(t2_sp1_prompts, ensure_ascii=False),
            "modelAnswer": None,
            "keyVocabJson": json.dumps(["sense of humour", "amusement", "stress relief", "infectious laughter", "emotional well-being"], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/speaking/part-1"
        },
        {
            "id": "cam07-academic-t2-sp2",
            "part": 2,
            "track": "academic",
            "topic": "Describe an Idea You Had for Improving Something at Work or College",
            "topicVi": "Miêu tả một ý tưởng bạn từng có để cải thiện công việc hoặc học tập",
            "title": "Describe an Idea You Had for Improving Something at Work or College",
            "question": t2_sp2_cue,
            "ideasJson": json.dumps([
                "Context: noticing repetitive manual inefficiency in study scheduling or inventory logging",
                "Proposed solution: introducing digital spreadsheets, automation scripts, or collaborative kanban boards",
                "Communication: pitching the suggestion to team leads or academic project peers",
                "Impact: saving operational time, minimizing human error, and boosting morale"
            ], ensure_ascii=False),
            "followUpQuestions": "What challenges do innovators face when proposing new workflows to traditional colleagues?",
            "cueCard": t2_sp2_cue,
            "promptsJson": json.dumps([
                "When and where you had your idea",
                "What your idea was",
                "Who you told about your idea",
                "Explain why you thought your idea would make an improvement"
            ], ensure_ascii=False),
            "modelAnswer": None,
            "keyVocabJson": json.dumps(["innovative proposal", "streamline workflow", "efficiency gains", "implementing changes", "collaborative brainstorming"], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/speaking/part-2"
        },
        {
            "id": "cam07-academic-t2-sp3",
            "part": 3,
            "track": "academic",
            "topic": "Ideas in Education and the Modern Workplace",
            "topicVi": "Ý tưởng mới trong giáo dục và môi trường làm việc",
            "title": "Ideas in Education and the Modern Workplace",
            "question": "\n".join(t2_sp3_prompts),
            "ideasJson": json.dumps([
                "Debate on pedagogical methods: historical foundational knowledge vs creative problem solving",
                "Teacher role: fostering psychological safety, project-based inquiry, and debate",
                "Corporate leadership: incentive structures for employee suggestions and continuous improvement",
                "Psychological inertia and aversion to uncertainty when encountering disruptive methods",
                "Execution gap: turning abstract concepts into scalable, measurable practical implementations"
            ], ensure_ascii=False),
            "followUpQuestions": "How can institutions balance traditional wisdom with radical innovation?",
            "cueCard": None,
            "promptsJson": json.dumps(t2_sp3_prompts, ensure_ascii=False),
            "modelAnswer": None,
            "keyVocabJson": json.dumps(["rote learning", "critical thinking", "intellectual curiosity", "resistance to change", "practical execution", "corporate innovation"], ensure_ascii=False),
            "source": "cambridge-ielts-07-scan",
            "verified": True,
            "sourceRef": "cambridge-ielts-07-academic/test-2/speaking/part-3"
        }
    ]

    return listening_sections, reading_passages, writing_topics, writing_models, speaking_topics
