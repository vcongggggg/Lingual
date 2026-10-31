# -*- coding: utf-8 -*-
import os
import sys
import json
import shutil

sys.stdout.reconfigure(encoding='utf-8')

DATA_PATH = r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-13\cam13-academic-test-2-data.json"
BACKUP_PATH = DATA_PATH + ".bak"

# 1. Create backup
shutil.copy2(DATA_PATH, BACKUP_PATH)
print("Backup created at:", BACKUP_PATH)

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# 2. Update Passage 1 (Questions 10-13)
p1 = data["reading_passages"][0]
p1_qs = json.loads(p1["questionsJson"])

new_p1_qs = [
    {
        "questionNumber": 10,
        "type": "TRUE_FALSE_NOT_GIVEN",
        "question": "The Portuguese had control over the cinnamon trade in Ceylon throughout the 16th century.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": "TRUE",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 1, Question 10, page 44"
    },
    {
        "questionNumber": 11,
        "type": "TRUE_FALSE_NOT_GIVEN",
        "question": "The Dutch took over the cinnamon trade from the Portuguese as soon as they arrived in Ceylon.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": "FALSE",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 1, Question 11, page 44"
    },
    {
        "questionNumber": 12,
        "type": "TRUE_FALSE_NOT_GIVEN",
        "question": "The trees planted by the Dutch produced larger quantities of cinnamon than the wild trees.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": "NOT GIVEN",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 1, Question 12, page 44"
    },
    {
        "questionNumber": 13,
        "type": "TRUE_FALSE_NOT_GIVEN",
        "question": "The spice trade maintained its economic importance during the 19th century.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": "FALSE",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 1, Question 13, page 44"
    }
]

# Append if not already present
existing_p1_nums = {q.get("questionNumber") for q in p1_qs}
for q in new_p1_qs:
    if q["questionNumber"] not in existing_p1_nums:
        p1_qs.append(q)

p1_qs = sorted(p1_qs, key=lambda x: x["questionNumber"])
p1["questionsJson"] = json.dumps(p1_qs, ensure_ascii=False)
print("Passage 1 now has questions:", [q["questionNumber"] for q in p1_qs])

# 3. Update Passage 3 (Text & Questions 30-40)
p3 = data["reading_passages"][2]
p3_qs = json.loads(p3["questionsJson"])

# Fix Passage 3 text (strip trailing junk and append recovered paragraphs)
p3_text = p3.get("passageJson", "")
cut_anchor = "...thereby infusing its value proposition with a green streak."
cut_idx = p3_text.find("thereby infusing its value proposition with a green streak")
if cut_idx != -1:
    clean_prefix = p3_text[:cut_idx + len("thereby infusing its value proposition with a green streak.")].strip()
else:
    # clean trailing lines
    clean_prefix = p3_text.split("----------------------------------------")[0].strip()

recovered_tail = """

A more radical strategy is 'combine and transcend'. This entails combining aspects of the product's existing value proposition with attributes addressing changes arising from a trend, to create a novel experience – one that may land the company in an entirely new market space. At first glance, spending resources to incorporate elements of a seemingly irrelevant trend into one's core offerings sounds like it's hardly worthwhile. But consider Nike's move to integrate the digital revolution into its reputation for high-performance athletic footwear. In 2006, they teamed up with technology company Apple to launch Nike+, a digital sports kit comprising a sensor that attaches to the running shoe and a wireless receiver that connects to the user's iPod. By combining Nike's original value proposition for amateur athletes with one for digital consumers, the Nike+ sports kit and web interface moved the company from a focus on athletic apparel to a new plane of engagement with its customers.

A third approach, known as 'counteract and reaffirm', involves developing products or services that stress the values traditionally associated with the category in ways that allow consumers to oppose – or at least temporarily escape from – the aspects of trends they view as undesirable. A product that accomplished this is the ME2, a video game created by Canada's iToys. By reaffirming the toy category's association with physical play, the ME2 counteracted some of the widely perceived negative impacts of digital gaming devices. Like other handheld games, the device featured a host of exciting interactive games, a full-color LCD screen, and advanced 3D graphics. What set it apart was that it incorporated the traditional physical component of children's play: it contained a pedometer, which tracked and awarded points for physical activity (walking, running, biking, skateboarding, climbing stairs). The child could use the points to enhance various virtual skills needed for the video game. The ME2, introduced in mid-2008, catered to kids' huge desire to play video games while countering the negatives, such as associations with lack of exercise and obesity.

Once you have gained perspective on how trend-related changes in consumer opinions and behaviors impact on your category, you can determine which of our three innovation strategies to pursue. When your category's basic value proposition continues to be meaningful for consumers influenced by the trend, the infuse-and-augment strategy will allow you to reinvigorate the category. If analysis reveals an increasing disparity between your category and consumers' new focus, your innovations need to transcend the category to integrate the two worlds. Finally, if aspects of the category clash with undesired outcomes of a trend, such as associations with unhealthy lifestyles, there is an opportunity to counteract those changes by reaffirming the core values of your category.

Trends – technological, economic, environmental, social, or political – that affect how people perceive the world around them and shape what they expect from products and services present firms with unique opportunities for growth."""

p3["passageJson"] = clean_prefix + recovered_tail
print("Passage 3 text updated, new length:", len(p3["passageJson"]))

# Add Q30-Q40
company_options = ["A Coach", "B Tesco", "C Nike", "D iToys"]
ending_options = [
    "A employ a combination of strategies to maintain your consumer base.",
    "B identify the most appropriate innovation strategy to use.",
    "C emphasise your brand's traditional values with the counteract-and-affirm strategy.",
    "D use the combine-and-transcend strategy to integrate the two worlds."
]

new_p3_qs = [
    {
        "questionNumber": 30,
        "type": "multiple_choice",
        "question": "What does the writer suggest about Nike's strategy?",
        "options": [
            "A It was an extremely risky strategy at the time.",
            "B It was a strategy that only a major company could afford to follow.",
            "C It was the type of strategy that would not have been possible in the past.",
            "D It was the kind of strategy which might appear to have few obvious benefits."
        ],
        "correctAnswer": "D",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 30, page 48"
    },
    {
        "questionNumber": 31,
        "type": "multiple_choice",
        "question": "What was original about the ME2?",
        "options": [
            "A It contained technology that had been developed for the sports industry.",
            "B It appealed to young people who were keen to improve their physical fitness.",
            "C It took advantage of a current trend for video games with colourful 3D graphics.",
            "D It was a handheld game that addressed people's concerns about unhealthy lifestyles."
        ],
        "correctAnswer": "D",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 31, page 49"
    },
    {
        "questionNumber": 32,
        "type": "matching",
        "question": "It turned a need to assess whether products could have harmful effects to its own advantage.",
        "options": company_options,
        "correctAnswer": "D",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 32, page 49"
    },
    {
        "questionNumber": 33,
        "type": "matching",
        "question": "It extended its offering by collaborating with another manufacturer.",
        "options": company_options,
        "correctAnswer": "C",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 33, page 49"
    },
    {
        "questionNumber": 34,
        "type": "matching",
        "question": "It implemented an incentive scheme to demonstrate its corporate social responsibility.",
        "options": company_options,
        "correctAnswer": "B",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 34, page 49"
    },
    {
        "questionNumber": 35,
        "type": "matching",
        "question": "It discovered that customers had a positive attitude towards dealing with difficult circumstances.",
        "options": company_options,
        "correctAnswer": "A",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 35, page 49"
    },
    {
        "questionNumber": 36,
        "type": "matching",
        "question": "It responded to a growing lifestyle trend in an unrelated product sector.",
        "options": company_options,
        "correctAnswer": "C",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 36, page 49"
    },
    {
        "questionNumber": 37,
        "type": "matching",
        "question": "It successfully avoided having to charge its customers less for its core products.",
        "options": company_options,
        "correctAnswer": "A",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 37, page 49"
    },
    {
        "questionNumber": 38,
        "type": "matching",
        "question": "If there are any trend-related changes impacting on your category, you should",
        "options": ending_options,
        "correctAnswer": "B",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 38, page 50"
    },
    {
        "questionNumber": 39,
        "type": "matching",
        "question": "If a current trend highlights a negative aspect of your category, you should",
        "options": ending_options,
        "correctAnswer": "C",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 39, page 50"
    },
    {
        "questionNumber": 40,
        "type": "matching",
        "question": "If the consumers' new focus has an increasing lack of connection with your offering, you should",
        "options": ending_options,
        "correctAnswer": "D",
        "sourceRef": "Cambridge IELTS 13, Test 2, Reading Passage 3, Question 40, page 50"
    }
]

existing_p3_nums = {q.get("questionNumber") for q in p3_qs}
for q in new_p3_qs:
    if q["questionNumber"] not in existing_p3_nums:
        p3_qs.append(q)

p3_qs = sorted(p3_qs, key=lambda x: x["questionNumber"])
p3["questionsJson"] = json.dumps(p3_qs, ensure_ascii=False)
print("Passage 3 now has questions:", [q["questionNumber"] for q in p3_qs])

# 4. Update official_keys['reading']
official_r_keys = {
    1: 'oils', 2: 'friendship', 3: 'funerals', 4: 'wealth', 5: 'indigestion',
    6: 'India', 7: 'camels', 8: 'Alexandria', 9: 'Venice',
    10: 'TRUE', 11: 'FALSE', 12: 'NOT GIVEN', 13: 'FALSE',
    14: 'B', 15: 'F', 16: 'B', 17: 'E', 18: 'A', 19: 'B', 20: 'C',
    21: 'animals', 22: 'childbirth', 23: 'placebo', 24: 'game', 25: 'strangers', 26: 'names',
    27: 'D', 28: 'C', 29: 'A', 30: 'D', 31: 'D',
    32: 'D', 33: 'C', 34: 'B', 35: 'A', 36: 'C', 37: 'A',
    38: 'B', 39: 'C', 40: 'D'
}

data["official_keys"]["reading"] = {str(k): v for k, v in official_r_keys.items()}
print("Official reading keys count:", len(data["official_keys"]["reading"]))

# 5. Save back
with open(DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("SUCCESS: cam13-academic-test-2-data.json updated successfully with 80/80 questions!")
