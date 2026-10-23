# -*- coding: utf-8 -*-
"""
Builder for Cambridge IELTS 09 Test 4 Data JSON outside repo:
C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-09\cam09-academic-test-4-data.json
"""

import json
import os
import re
from pathlib import Path

OUTPUT_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-09")
CLEANED_MD = Path(r"C:\Mod\muse-data-exchange\book-corpus\cambridge-ielts-09-scan\Cambridge IELTS 09 - Academic & General Practice Tests-cleaned.md")

with open(CLEANED_MD, "r", encoding="utf-8") as f:
    RAW_MD = f.read()

def clean_script_table(s):
    lines = []
    for line in s.split('\n'):
        line = line.strip()
        if not line or line.startswith('<!--') or line.startswith('|---') or line.startswith('##'):
            continue
        if line.startswith('|') and line.endswith('|'):
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if len(parts) >= 2:
                spk = parts[0]
                content = parts[1]
                if spk:
                    lines.append(f"{spk} {content}")
                else:
                    lines.append(content)
                continue
        lines.append(line)
    text = '\n\n'.join(lines)
    text = re.sub(r'<!--.*?-->', '', text)
    text = re.sub(r'TopSage|大家网', '', text)
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

# Extract Tapescripts for Test 4: [262201:308656]
t4_tape_raw = RAW_MD[262201:308656]
s1_raw = t4_tape_raw[0:12647]
s2_raw = t4_tape_raw[12647:22786]
s3_raw = t4_tape_raw[22786:40006]
s4_raw = t4_tape_raw[40006:]
end_marker = s4_raw.find("## Listening and Reading Answer Keys")
if end_marker != -1:
    s4_raw = s4_raw[:end_marker]

script_t4_s1 = clean_script_table(s1_raw)
script_t4_s2 = clean_script_table(s2_raw)
script_t4_s3 = clean_script_table(s3_raw)
script_t4_s4 = clean_script_table(s4_raw)

# Official Answer Keys
OFFICIAL_KEYS_T4_L = {
    1: "babies",
    2: "Eshcol",
    3: "evening",
    4: "Gormley",
    5: "B",
    6: "E",
    7: "heart",
    8: "primary school",
    9: "4.30",
    10: "ages",
    11: "B",
    12: "C",
    13: "E",
    14: "B",
    15: "E",
    16: "D",
    17: "A",
    18: "C",
    19: "732281",
    20: "Thursday/Thursdays",
    21: "A",
    22: "C",
    23: "approach",
    24: "mature",
    25: "interest",
    26: "groups",
    27: "every 2 days",
    28: "2 weeks",
    29: "confident",
    30: "education system",
    31: "C",
    32: "A",
    33: "B",
    34: "B",
    35: "A",
    36: "C",
    37: "frog/frogs",
    38: "predators",
    39: "count",
    40: "seed/seeds"
}

OFFICIAL_KEYS_T4_R = {
    1: "FALSE",
    2: "NOT GIVEN",
    3: "TRUE",
    4: "FALSE",
    5: "TRUE",
    6: "NOT GIVEN",
    7: "thorium",
    8: "pitchblende",
    9: "radium",
    10: "soldiers",
    11: "illness",
    12: "neutron",
    13: "leukaemia/leukemia",
    14: "G",
    15: "C",
    16: "G",
    17: "D",
    18: "H",
    19: "E",
    20: "D",
    21: "B",
    22: "E",
    23: "C",
    24: "mirror",
    25: "communication",
    26: "ownership",
    27: "ii",
    28: "vi",
    29: "i",
    30: "iii",
    31: "B",
    32: "A",
    33: "D",
    34: "D",
    35: "C",
    36: "B",
    37: "FALSE",
    38: "NOT GIVEN",
    39: "FALSE",
    40: "TRUE"
}

# Listening Questions
t4_l1_questions = [
    {
        "questionNumber": 1,
        "type": "table_completion",
        "question": "Health Centres: The Harvey Clinic - Advantage: especially good with 1 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[1],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 1, Answer Key page 158"
    },
    {
        "questionNumber": 2,
        "type": "table_completion",
        "question": "Health Centres: The 2 .................... Health Practice - Doctor's name: Dr Fuller",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[2],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 2, Answer Key page 158"
    },
    {
        "questionNumber": 3,
        "type": "table_completion",
        "question": "Health Centres: The Eshcol Health Practice - Advantage: offers 3 .................... appointments",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[3],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 3, Answer Key page 158"
    },
    {
        "questionNumber": 4,
        "type": "table_completion",
        "question": "Health Centres: The Shore Lane Health Centre - Doctor's name: Dr 4 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[4],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 4, Answer Key page 158"
    },
    {
        "questionNumber": 5,
        "type": "multiple_choice",
        "question": "Which TWO of the following are offered free of charge at Shore Lane Health Centre? (Question 5 of 5-6)",
        "options": [
            "A acupuncture",
            "B employment medicals",
            "C sports injury therapy",
            "D travel advice",
            "E vaccinations"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[5],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 5, Answer Key page 158"
    },
    {
        "questionNumber": 6,
        "type": "multiple_choice",
        "question": "Which TWO of the following are offered free of charge at Shore Lane Health Centre? (Question 6 of 5-6)",
        "options": [
            "A acupuncture",
            "B employment medicals",
            "C sports injury therapy",
            "D travel advice",
            "E vaccinations"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[6],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 6, Answer Key page 158"
    },
    {
        "questionNumber": 7,
        "type": "table_completion",
        "question": "Talks for patients: Giving up smoking - useful for people with asthma or 7 .................... problems",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[7],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 7, Answer Key page 158"
    },
    {
        "questionNumber": 8,
        "type": "table_completion",
        "question": "Talks for patients: Healthy eating - Location: the 8 .................... (Shore Lane)",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[8],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 8, Answer Key page 158"
    },
    {
        "questionNumber": 9,
        "type": "table_completion",
        "question": "Talks for patients: Avoiding injuries during exercise - Date/Time: 9th March at 9 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[9],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 9, Answer Key page 158"
    },
    {
        "questionNumber": 10,
        "type": "table_completion",
        "question": "Talks for patients: Avoiding injuries during exercise - Notes: for all 10 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[10],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Question 10, Answer Key page 158"
    }
]

t4_l2_questions = [
    {
        "questionNumber": 11,
        "type": "diagram_labelling",
        "question": "Label the Water Heater diagram: Control 11 (central heating / hot water control switch)",
        "options": [
            "A electricity indicator",
            "B on/off switch",
            "C reset button",
            "D time control",
            "E warning indicator"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[11],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 11, Answer Key page 158"
    },
    {
        "questionNumber": 12,
        "type": "diagram_labelling",
        "question": "Label the Water Heater diagram: Control 12 (button below switch 11)",
        "options": [
            "A electricity indicator",
            "B on/off switch",
            "C reset button",
            "D time control",
            "E warning indicator"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[12],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 12, Answer Key page 158"
    },
    {
        "questionNumber": 13,
        "type": "diagram_labelling",
        "question": "Label the Water Heater diagram: Indicator 13 (light indicator on the lower right)",
        "options": [
            "A electricity indicator",
            "B on/off switch",
            "C reset button",
            "D time control",
            "E warning indicator"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[13],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 13, Answer Key page 158"
    },
    {
        "questionNumber": 14,
        "type": "matching",
        "question": "Where can each of the following items be found? 14 pillows",
        "options": [
            "A in box on washing machine",
            "B in cupboard on landing",
            "C in chest of drawers",
            "D next to window in living room",
            "E on shelf by back door",
            "F on top of television",
            "G under kitchen sink"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[14],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 14, Answer Key page 158"
    },
    {
        "questionNumber": 15,
        "type": "matching",
        "question": "Where can each of the following items be found? 15 washing powder",
        "options": [
            "A in box on washing machine",
            "B in cupboard on landing",
            "C in chest of drawers",
            "D next to window in living room",
            "E on shelf by back door",
            "F on top of television",
            "G under kitchen sink"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[15],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 15, Answer Key page 158"
    },
    {
        "questionNumber": 16,
        "type": "matching",
        "question": "Where can each of the following items be found? 16 key",
        "options": [
            "A in box on washing machine",
            "B in cupboard on landing",
            "C in chest of drawers",
            "D next to window in living room",
            "E on shelf by back door",
            "F on top of television",
            "G under kitchen sink"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[16],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 16, Answer Key page 158"
    },
    {
        "questionNumber": 17,
        "type": "matching",
        "question": "Where can each of the following items be found? 17 light bulbs",
        "options": [
            "A in box on washing machine",
            "B in cupboard on landing",
            "C in chest of drawers",
            "D next to window in living room",
            "E on shelf by back door",
            "F on top of television",
            "G under kitchen sink"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[17],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 17, Answer Key page 158"
    },
    {
        "questionNumber": 18,
        "type": "matching",
        "question": "Where can each of the following items be found? 18 map",
        "options": [
            "A in box on washing machine",
            "B in cupboard on landing",
            "C in chest of drawers",
            "D next to window in living room",
            "E on shelf by back door",
            "F on top of television",
            "G under kitchen sink"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[18],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 18, Answer Key page 158"
    },
    {
        "questionNumber": 19,
        "type": "note_completion",
        "question": "Phone number for takeaway pizzas: 19 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[19],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 19, Answer Key page 158"
    },
    {
        "questionNumber": 20,
        "type": "note_completion",
        "question": "Railway museum closed on 20 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[20],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Question 20, Answer Key page 158"
    }
]

t4_l3_questions = [
    {
        "questionNumber": 21,
        "type": "multiple_choice",
        "question": "In her home country, Kira had",
        "options": [
            "A completed a course.",
            "B done two years of a course.",
            "C found her course difficult."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[21],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 21, Answer Key page 158"
    },
    {
        "questionNumber": 22,
        "type": "multiple_choice",
        "question": "To succeed with assignments, Kira had to",
        "options": [
            "A read faster.",
            "B write faster.",
            "C change her way of thinking."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[22],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 22, Answer Key page 158"
    },
    {
        "questionNumber": 23,
        "type": "sentence_completion",
        "question": "Kira says that lecturers are easier to 23 .................... than those in her home country.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[23],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 23, Answer Key page 158"
    },
    {
        "questionNumber": 24,
        "type": "sentence_completion",
        "question": "Paul suggests that Kira may be more 24 .................... than when she was studying before.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[24],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 24, Answer Key page 158"
    },
    {
        "questionNumber": 25,
        "type": "sentence_completion",
        "question": "Kira says that students want to discuss things that worry them or that 25 .................... them very much.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[25],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 25, Answer Key page 158"
    },
    {
        "questionNumber": 26,
        "type": "short_answer",
        "question": "How did the students do their practical sessions?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[26],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 26, Answer Key page 158"
    },
    {
        "questionNumber": 27,
        "type": "short_answer",
        "question": "In the second semester how often did Kira work in a hospital?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[27],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 27, Answer Key page 158"
    },
    {
        "questionNumber": 28,
        "type": "short_answer",
        "question": "How much full-time work did Kira do during the year?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[28],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 28, Answer Key page 158"
    },
    {
        "questionNumber": 29,
        "type": "short_answer",
        "question": "Having completed the year, how does Kira feel?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[29],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 29, Answer Key page 158"
    },
    {
        "questionNumber": 30,
        "type": "short_answer",
        "question": "In addition to the language, what do overseas students need to become familiar with?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[30],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Question 30, Answer Key page 158"
    }
]

t4_l4_questions = [
    {
        "questionNumber": 31,
        "type": "multiple_choice",
        "question": "What led the group to choose their topic?",
        "options": [
            "A They were concerned about the decline of one species.",
            "B They were interested in the effects of city growth.",
            "C They wanted to investigate a recent phenomenon."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[31],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 31, Answer Key page 158"
    },
    {
        "questionNumber": 32,
        "type": "multiple_choice",
        "question": "The exact proportion of land devoted to private gardens was confirmed by",
        "options": [
            "A consulting some official documents.",
            "B taking large-scale photos.",
            "C discussions with town surveyors."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[32],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 32, Answer Key page 158"
    },
    {
        "questionNumber": 33,
        "type": "multiple_choice",
        "question": "The group asked garden owners to",
        "options": [
            "A take part in formal interviews.",
            "B keep a record of animals they saw.",
            "C get in contact when they saw a rare species."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[33],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 33, Answer Key page 158"
    },
    {
        "questionNumber": 34,
        "type": "multiple_choice",
        "question": "The group made their observations in gardens",
        "options": [
            "A which had a large number of animal species.",
            "B which they considered to be representative.",
            "C which had stable populations of rare animals."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[34],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 34, Answer Key page 158"
    },
    {
        "questionNumber": 35,
        "type": "multiple_choice",
        "question": "The group did extensive reading on",
        "options": [
            "A wildlife problems in rural areas.",
            "B urban animal populations.",
            "C current gardening practices."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[35],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 35, Answer Key page 158"
    },
    {
        "questionNumber": 36,
        "type": "multiple_choice",
        "question": "The speaker focuses on three animal species because",
        "options": [
            "A a lot of data has been obtained about them.",
            "B the group were most interested in them.",
            "C they best indicated general trends."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_L[36],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 36, Answer Key page 158"
    },
    {
        "questionNumber": 37,
        "type": "table_completion",
        "question": "Animals with population increase in gardens due to suitable stretches of water: 37 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[37],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 37, Answer Key page 158"
    },
    {
        "questionNumber": 38,
        "type": "table_completion",
        "question": "Hedgehogs: Reason for population increase in gardens: safer from 38 .................... when in cities",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[38],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 38, Answer Key page 158"
    },
    {
        "questionNumber": 39,
        "type": "table_completion",
        "question": "Hedgehogs: Comments: easy to 39 .................... them accurately",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[39],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 39, Answer Key page 158"
    },
    {
        "questionNumber": 40,
        "type": "table_completion",
        "question": "Song thrushes: Reason for increase: a variety of 40 .................... to eat and more nesting places available",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_L[40],
        "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Question 40, Answer Key page 158"
    }
]

# Clean Passage Texts
def clean_passage(text):
    text = re.sub(r'<!--.*?-->', '', text)
    text = re.sub(r'TopSage|大家网', '', text)
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

p1_raw = RAW_MD[99329:104910]
p1_text = clean_passage(p1_raw)

p2_raw = RAW_MD[106604:112076]
p2_text = clean_passage(p2_raw)

p3_raw = RAW_MD[115533:121105]
p3_text = clean_passage(p3_raw)

# Reading Questions
t4_r1_questions = [
    {
        "questionNumber": 1,
        "type": "true_false_not_given",
        "question": "Marie Curie's husband was a joint winner of both Marie's Nobel Prizes.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[1],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 1, Answer Key page 158"
    },
    {
        "questionNumber": 2,
        "type": "true_false_not_given",
        "question": "Marie became interested in science when she was a child.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[2],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 2, Answer Key page 158"
    },
    {
        "questionNumber": 3,
        "type": "true_false_not_given",
        "question": "Marie was able to attend the Sorbonne because of her sister's financial contribution.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[3],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 3, Answer Key page 158"
    },
    {
        "questionNumber": 4,
        "type": "true_false_not_given",
        "question": "Marie stopped doing research for several years when her children were born.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[4],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 4, Answer Key page 158"
    },
    {
        "questionNumber": 5,
        "type": "true_false_not_given",
        "question": "Marie took over the teaching position her husband had held.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[5],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 5, Answer Key page 158"
    },
    {
        "questionNumber": 6,
        "type": "true_false_not_given",
        "question": "Marie's sister Bronia studied the medical uses of radioactivity.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[6],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 6, Answer Key page 158"
    },
    {
        "questionNumber": 7,
        "type": "note_completion",
        "question": "When uranium was discovered to be radioactive, Marie Curie found that the element called 7 .................... had the same property.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[7],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 7, Answer Key page 158"
    },
    {
        "questionNumber": 8,
        "type": "note_completion",
        "question": "Marie and Pierre Curie's research into the radioactivity of the mineral known as 8 .................... led to the discovery of two new elements.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[8],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 8, Answer Key page 158"
    },
    {
        "questionNumber": 9,
        "type": "note_completion",
        "question": "In 1911, Marie Curie received recognition for her work on the element 9 .................... .",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[9],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 9, Answer Key page 158"
    },
    {
        "questionNumber": 10,
        "type": "note_completion",
        "question": "Marie and Irène Curie developed X-radiography which was used as a medical technique for 10 .................... .",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[10],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 10, Answer Key page 158"
    },
    {
        "questionNumber": 11,
        "type": "note_completion",
        "question": "Marie Curie saw the importance of collecting radioactive material both for research and for cases of 11 .................... .",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[11],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 11, Answer Key page 158"
    },
    {
        "questionNumber": 12,
        "type": "note_completion",
        "question": "The radioactive material stocked in Paris contributed to the discoveries in the 1930s of the 12 .................... and of what was known as artificial radioactivity.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[12],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 12, Answer Key page 158"
    },
    {
        "questionNumber": 13,
        "type": "note_completion",
        "question": "During her research, Marie Curie was exposed to radiation and as a result she suffered from 13 .................... .",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[13],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Question 13, Answer Key page 158"
    }
]

t4_r2_questions = [
    {
        "questionNumber": 14,
        "type": "matching_information",
        "question": "Which paragraph contains: an account of the method used by researchers in a particular study",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[14],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 14, Answer Key page 158"
    },
    {
        "questionNumber": 15,
        "type": "matching_information",
        "question": "Which paragraph contains: the role of imitation in developing a sense of identity",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[15],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 15, Answer Key page 158"
    },
    {
        "questionNumber": 16,
        "type": "matching_information",
        "question": "Which paragraph contains: the age at which children can usually identify a static image of themselves",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[16],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 16, Answer Key page 158"
    },
    {
        "questionNumber": 17,
        "type": "matching_information",
        "question": "Which paragraph contains: a reason for the limitations of scientific research into 'self-as-subject'",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[17],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 17, Answer Key page 158"
    },
    {
        "questionNumber": 18,
        "type": "matching_information",
        "question": "Which paragraph contains: reference to a possible link between culture and a particular form of behaviour",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[18],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 18, Answer Key page 158"
    },
    {
        "questionNumber": 19,
        "type": "matching_information",
        "question": "Which paragraph contains: examples of the wide range of features that contribute to the sense of 'self-as-object'",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[19],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 19, Answer Key page 158"
    },
    {
        "questionNumber": 20,
        "type": "matching",
        "question": "A sense of identity can never be formed without relationships with other people.",
        "options": [
            "A James",
            "B Cooley",
            "C Lewis and Brooks-Gunn",
            "D Mead",
            "E Bronson"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[20],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 20, Answer Key page 158"
    },
    {
        "questionNumber": 21,
        "type": "matching",
        "question": "A child's awareness of self is related to a sense of mastery over things and people.",
        "options": [
            "A James",
            "B Cooley",
            "C Lewis and Brooks-Gunn",
            "D Mead",
            "E Bronson"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[21],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 21, Answer Key page 158"
    },
    {
        "questionNumber": 22,
        "type": "matching",
        "question": "At a certain age, children's sense of identity leads to aggressive behaviour.",
        "options": [
            "A James",
            "B Cooley",
            "C Lewis and Brooks-Gunn",
            "D Mead",
            "E Bronson"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[22],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 22, Answer Key page 158"
    },
    {
        "questionNumber": 23,
        "type": "matching",
        "question": "Observing their own reflection contributes to children's self awareness.",
        "options": [
            "A James",
            "B Cooley",
            "C Lewis and Brooks-Gunn",
            "D Mead",
            "E Bronson"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[23],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 23, Answer Key page 158"
    },
    {
        "questionNumber": 24,
        "type": "summary_completion",
        "question": "First, children come to realise that they can have an effect on the world around them, for example by handling objects, or causing the image to move when they face a 24 .................... .",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[24],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 24, Answer Key page 158"
    },
    {
        "questionNumber": 25,
        "type": "summary_completion",
        "question": "This aspect of self-awareness is difficult to research directly, because of 25 .................... problems.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[25],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 25, Answer Key page 158"
    },
    {
        "questionNumber": 26,
        "type": "summary_completion",
        "question": "In Western societies at least, the development of self awareness is often linked to a sense of 26 .................... , and can lead to disputes.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T4_R[26],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Question 26, Answer Key page 158"
    }
]

t4_r3_questions = [
    {
        "questionNumber": 27,
        "type": "matching_headings",
        "question": "Choose the correct heading for Paragraph B",
        "options": [
            "i Commercial pressures on people in charge",
            "ii Mixed views on current changes to museums",
            "iii Interpreting the facts to meet visitor expectations",
            "iv The international dimension",
            "v Collections of factual evidence",
            "vi Fewer differences between public attractions",
            "vii Current reviews and suggestions"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[27],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 27, Answer Key page 158"
    },
    {
        "questionNumber": 28,
        "type": "matching_headings",
        "question": "Choose the correct heading for Paragraph C",
        "options": [
            "i Commercial pressures on people in charge",
            "ii Mixed views on current changes to museums",
            "iii Interpreting the facts to meet visitor expectations",
            "iv The international dimension",
            "v Collections of factual evidence",
            "vi Fewer differences between public attractions",
            "vii Current reviews and suggestions"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[28],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 28, Answer Key page 158"
    },
    {
        "questionNumber": 29,
        "type": "matching_headings",
        "question": "Choose the correct heading for Paragraph D",
        "options": [
            "i Commercial pressures on people in charge",
            "ii Mixed views on current changes to museums",
            "iii Interpreting the facts to meet visitor expectations",
            "iv The international dimension",
            "v Collections of factual evidence",
            "vi Fewer differences between public attractions",
            "vii Current reviews and suggestions"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[29],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 29, Answer Key page 158"
    },
    {
        "questionNumber": 30,
        "type": "matching_headings",
        "question": "Choose the correct heading for Paragraph E",
        "options": [
            "i Commercial pressures on people in charge",
            "ii Mixed views on current changes to museums",
            "iii Interpreting the facts to meet visitor expectations",
            "iv The international dimension",
            "v Collections of factual evidence",
            "vi Fewer differences between public attractions",
            "vii Current reviews and suggestions"
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[30],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 30, Answer Key page 158"
    },
    {
        "questionNumber": 31,
        "type": "multiple_choice",
        "question": "Compared with today's museums, those of the past",
        "options": [
            "A did not present history in a detailed way.",
            "B were not primarily intended for the public.",
            "C were more clearly organised.",
            "D preserved items with greater care."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[31],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 31, Answer Key page 158"
    },
    {
        "questionNumber": 32,
        "type": "multiple_choice",
        "question": "According to the writer, current trends in the heritage industry",
        "options": [
            "A emphasise personal involvement.",
            "B have their origins in York and London.",
            "C rely on computer images.",
            "D reflect minority tastes."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[32],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 32, Answer Key page 158"
    },
    {
        "questionNumber": 33,
        "type": "multiple_choice",
        "question": "The writer says that museums, heritage sites and theme parks",
        "options": [
            "A often work in close partnership.",
            "B try to preserve separate identities.",
            "C have similar exhibits.",
            "D are less easy to distinguish than before."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[33],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 33, Answer Key page 158"
    },
    {
        "questionNumber": 34,
        "type": "multiple_choice",
        "question": "The writer says that in preparing exhibits for museums, experts",
        "options": [
            "A should pursue a single objective.",
            "B have to do a certain amount of language translation.",
            "C should be free from commercial constraints.",
            "D have to balance conflicting priorities."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[34],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 34, Answer Key page 158"
    },
    {
        "questionNumber": 35,
        "type": "multiple_choice",
        "question": "In paragraph E, the writer suggests that some museum exhibits",
        "options": [
            "A fail to match visitor expectations.",
            "B are based on the false assumptions of professionals.",
            "C reveal more about present beliefs than about the past.",
            "D allow visitors to make more use of their imagination."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[35],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 35, Answer Key page 158"
    },
    {
        "questionNumber": 36,
        "type": "multiple_choice",
        "question": "The passage ends by noting that our view of history is biased because",
        "options": [
            "A we fail to use our imagination.",
            "B only very durable objects remain from the past.",
            "C we tend to ignore things that displease us.",
            "D museum exhibits focus too much on the local area."
        ],
        "correctAnswer": OFFICIAL_KEYS_T4_R[36],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 36, Answer Key page 158"
    },
    {
        "questionNumber": 37,
        "type": "true_false_not_given",
        "question": "Consumers prefer theme parks which avoid serious issues.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[37],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 37, Answer Key page 158"
    },
    {
        "questionNumber": 38,
        "type": "true_false_not_given",
        "question": "More people visit museums than theme parks.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[38],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 38, Answer Key page 158"
    },
    {
        "questionNumber": 39,
        "type": "true_false_not_given",
        "question": "The boundaries of Leyden have changed little since the seventeenth century.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[39],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 39, Answer Key page 158"
    },
    {
        "questionNumber": 40,
        "type": "true_false_not_given",
        "question": "Museums can give a false impression of how life used to be.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T4_R[40],
        "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Question 40, Answer Key page 158"
    }
]

# Writing Topics & Models
writing_topics_t4 = [
    {
        "id": "cam09-academic-t4-w1",
        "track": "academic",
        "prompt": "The graph below gives information from a 2008 report about consumption of energy in the USA since 1980 with projections until 2030.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
        "type": "line_graph",
        "typeVi": "Biểu đồ đường",
        "bandRange": "6.5-9.0",
        "outlineJson": json.dumps({
            "overview": "Overall, fossil fuels (petrol, oil, coal, gas) remain dominant throughout the period while nuclear and renewables stay relatively insignificant.",
            "body1": "Petrol, oil, natural gas, and coal consumption trends and projections.",
            "body2": "Nuclear, hydro, and solar/wind power levels."
        }, ensure_ascii=False),
        "keyVocabJson": json.dumps([
            {"en": "quadrillion units", "vi": "triệu tỷ đơn vị"},
            {"en": "dominant fuel sources", "vi": "nguồn nhiên liệu chủ đạo"},
            {"en": "projections", "vi": "dự báo tương lai"}
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Writing Task 1, page 101"
    },
    {
        "id": "cam09-academic-t4-w2",
        "track": "academic",
        "prompt": "Every year several languages die out. Some people think that this is not important because life will be easier if there are fewer languages in the world.\n\nTo what extent do you agree or disagree with this opinion?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
        "type": "opinion",
        "typeVi": "Bài luận quan điểm",
        "bandRange": "6.5-9.0",
        "outlineJson": json.dumps({
            "intro": "Paraphrase topic on language extinction and state position.",
            "body1": "Arguments for convenience of fewer languages (global trade, education, ease of travel).",
            "body2": "Arguments against losing languages (cultural heritage, unique worldviews, identity loss).",
            "conclusion": "Reiterate that preserving linguistic diversity is vital despite communication ease."
        }, ensure_ascii=False),
        "keyVocabJson": json.dumps([
            {"en": "language extinction", "vi": "sự biến mất của ngôn ngữ"},
            {"en": "linguistic diversity", "vi": "đa dạng ngôn ngữ"},
            {"en": "cultural heritage", "vi": "di sản văn hóa"}
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Writing Task 2, page 102"
    }
]

writing_models_t4 = [
    {
        "id": "cam09-academic-t4-wm1",
        "task": 1,
        "track": "academic",
        "topic": "US Energy Consumption by Fuel Source (1980-2030)",
        "chartType": "line_graph",
        "chartDescription": "The graph shows energy consumption in the US from 1980 to 2012, and projected consumption to 2030.",
        "prompt": writing_topics_t4[0]["prompt"],
        "modelAnswer": """The graph shows energy consumption in the US from 1980 to 2012, and projected consumption to 2030.

Petrol and oil are the dominant fuel sources throughout this period, with 35 quadrillion (35q) units used in 1980, rising to 42q in 2012. Despite some initial fluctuation, from 1995 there was a steady increase. This is expected to continue, reaching 47q in 2030.

Consumption of energy derived from natural gas and coal is similar over the period. From 20q and 15q respectively in 1980, gas showed an initial fall and coal a gradual increase, with the two fuels equal between 1985 and 1990. Consumption has fluctuated since 1990 but both now provide 24q. Coal is predicted to increase steadily to 31q in 2030, whereas after 2014, gas will remain stable at 25q.

In 1980, energy from nuclear, hydro- and solar/wind power was equal at only 4q. Nuclear has risen by 3q, and solar/wind by 2. After slight increases, hydropower has fallen back to the 1980 figure. It is expected to maintain this level until 2030, while the others should rise slightly after 2025.

Overall, the US will continue to rely on fossil fuels, with sustainable and nuclear energy sources remaining relatively insignificant.""",
        "keyVocabJson": json.dumps([
            {"en": "dominant fuel sources", "vi": "nguồn nhiên liệu chủ đạo"},
            {"en": "steady increase", "vi": "sự gia tăng đều đặn"},
            {"en": "relatively insignificant", "vi": "tương đối không đáng kể"}
        ], ensure_ascii=False),
        "examinerNotesVi": "Bài mẫu chuẩn mực của giám khảo (Band 9.0) với việc tổng quan các xu hướng chính và phân tích chi tiết dữ liệu dự báo đến năm 2030.",
        "bandEstimate": 9.0,
        "source": "cambridge-ielts-09-scan",
        "license": None,
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Writing Task 1 Model Answer, page 168"
    },
    {
        "id": "cam09-academic-t4-wm2",
        "task": 2,
        "track": "academic",
        "topic": "Language Extinction and Global Communication",
        "chartType": None,
        "chartDescription": None,
        "prompt": writing_topics_t4[1]["prompt"],
        "modelAnswer": """I agree about this opinion.

Nowadays, Several languages die out. I think this situation is right. In the world. already have to much languages minimum 100 languages include small country. But we know Just some languages, kind of English, French Japanese, Chinies.

At this moment, we live in the world, So we need frist language in the world. Therefor several languages need to die out.

Also, small country language is almost difficult to learn and not usuful. so we don't need to learn this languages. Even if we learning this languages not using in the world. Just usuful this country And we don't find small language education academy.

So I think small country languages make spend money and time also we need find first language using all of country. This is very important for all country of developing.

After when decide first language our communication will be more easier with another country people. Beside we don't need invest of another language education, and we can invest another part kind of economic and culture developing by decrease education money.

Accordng to this opinion,""",
        "keyVocabJson": json.dumps([
            {"en": "die out", "vi": "biến mất / tuyệt chủng"},
            {"en": "first language", "vi": "ngôn ngữ chung thứ nhất"}
        ], ensure_ascii=False),
        "examinerNotesVi": "Bài làm thực tế của thí sinh đạt Band 4.0 kèm nhận xét chi tiết của giám khảo về lỗi ngữ pháp, thiếu từ vựng và chưa hoàn thành câu trả lời.",
        "bandEstimate": 4.0,
        "source": "cambridge-ielts-09-scan",
        "license": None,
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Writing Task 2 Sample Answer, page 169"
    }
]

# Speaking Topics
speaking_topics_t4 = [
    {
        "id": "cam09-academic-t4-s1",
        "part": 1,
        "track": "academic",
        "topic": "Bicycles",
        "topicVi": "Xe đạp",
        "question": "How popular are bicycles in your home town? [Why?]\nHow often do you ride a bicycle? [Why/Why not?]\nDo you think that bicycles are suitable for all ages? [Why/Why not?]\nWhat are the advantages of a bicycle compared to a car? [Why?]",
        "ideasJson": json.dumps([
            "Popularity for commuting, physical exercise, and leisure in city parks",
            "Eco-friendly advantages: zero emissions, ease of parking, avoiding traffic",
            "Suitability considerations for senior citizens or young children on busy streets"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Speaking Part 1, page 103"
    },
    {
        "id": "cam09-academic-t4-s2",
        "part": 2,
        "track": "academic",
        "topic": "Describe a person who has done a lot of work to help people",
        "topicVi": "Người đã làm nhiều việc để giúp đỡ cộng đồng",
        "question": "Describe a person who has done a lot of work to help people.\n\nYou should say:\n- who this person is/was\n- where this person lives/lived\n- what he/she has done to help people\nand explain how you know about this person.",
        "ideasJson": json.dumps([
            "A dedicated doctor, charity founder, or community organizer",
            "Providing food relief, healthcare, or free education to the disadvantaged",
            "Inspiration drawn from their selflessness and positive community impact"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Speaking Part 2, page 103"
    },
    {
        "id": "cam09-academic-t4-s3",
        "part": 3,
        "track": "academic",
        "topic": "Helping other people in the community & Community Services",
        "topicVi": "Giúp đỡ cộng đồng & Dịch vụ công ích",
        "question": "Helping other people in the community:\n- What are some of the ways people can help others in the community? Which is most important?\n- Why do you think some people like to help other people?\n- Some people say that people help others in the community more now than they did in the past. Do you agree or disagree? Why?\n\nCommunity Services:\n- What types of services, such as libraries or health centres, are available to the people who live in your area? Do you think there are enough of them?\n- Which groups of people generally need most support in a community? Why?\n- Who do you think should pay for the services that are available to the people in a community? Should it be the government or individual people?",
        "ideasJson": json.dumps([
            "Ways of assisting: volunteering time, charity fundraising, neighbourly support",
            "Evolution of community spirit in modern fast-paced urban societies",
            "Funding balance between state budget / municipal taxes and private philanthropy"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 4, Speaking Part 3, page 103"
    }
]

test_4_data = {
    "test": "4",
    "track": "academic",
    "official_keys": {
        "listening": OFFICIAL_KEYS_T4_L,
        "reading": OFFICIAL_KEYS_T4_R
    },
    "listening_sections": [
        {
            "id": "cam09-academic-t4-l1",
            "section": "1",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.0,
            "title": "Health Centres",
            "titleVi": "Các trung tâm y tế",
            "scriptJson": script_t4_s1,
            "questionsJson": json.dumps(t4_l1_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 1, Answer Key page 158"
        },
        {
            "id": "cam09-academic-t4-l2",
            "section": "2",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.5,
            "title": "Holiday Accommodation & Water Heater Instructions",
            "titleVi": "Chỗ ở nghỉ dưỡng và Hướng dẫn sử dụng bình nước nóng",
            "scriptJson": script_t4_s2,
            "questionsJson": json.dumps(t4_l2_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 2, Answer Key page 158"
        },
        {
            "id": "cam09-academic-t4-l3",
            "section": "3",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.0,
            "title": "Discussion on Nursing Course Experience",
            "titleVi": "Thảo luận về Trải nghiệm khóa học Điều dưỡng",
            "scriptJson": script_t4_s3,
            "questionsJson": json.dumps(t4_l3_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 3, Answer Key page 158"
        },
        {
            "id": "cam09-academic-t4-l4",
            "section": "4",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.5,
            "title": "Wildlife in City Gardens",
            "titleVi": "Động vật hoang dã trong vườn đô thị",
            "scriptJson": script_t4_s4,
            "questionsJson": json.dumps(t4_l4_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Listening Section 4, Answer Key page 158"
        }
    ],
    "reading_passages": [
        {
            "id": "cam09-academic-t4-r1",
            "section": "1",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.5,
            "title": "The life and work of Marie Curie",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p1_text,
            "questionsJson": json.dumps(t4_r1_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 1, Answer Key page 158"
        },
        {
            "id": "cam09-academic-t4-r2",
            "section": "2",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.0,
            "title": "Young children's sense of identity",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p2_text,
            "questionsJson": json.dumps(t4_r2_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 2, Answer Key page 158"
        },
        {
            "id": "cam09-academic-t4-r3",
            "section": "3",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.5,
            "title": "The Development of Museums",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p3_text,
            "questionsJson": json.dumps(t4_r3_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 4, Reading Passage 3, Answer Key page 158"
        }
    ],
    "writing_topics": writing_topics_t4,
    "writing_models": writing_models_t4,
    "speaking_topics": speaking_topics_t4
}

output_path = OUTPUT_DIR / "cam09-academic-test-4-data.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(test_4_data, f, indent=2, ensure_ascii=False)

print(f"[SUCCESS] Wrote Test 4 data to {output_path}")
