# -*- coding: utf-8 -*-
"""
Builder for Cambridge IELTS 09 Test 2 Data JSON outside repo:
C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-09\cam09-academic-test-2-data.json
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

# Extract Tapescripts
t2_tape_raw = RAW_MD[193232:220997]
# Split into 4 sections
# Pos: Sec 1: 11, Sec 2: 7922, Sec 3: 11313, Sec 4: 21013
s1_raw = t2_tape_raw[11:7922]
s2_raw = t2_tape_raw[7922:11313]
s3_raw = t2_tape_raw[11313:21013]
s4_raw = t2_tape_raw[21013:]

script_t2_s1 = clean_script_table(s1_raw)
script_t2_s2 = clean_script_table(s2_raw)
script_t2_s3 = clean_script_table(s3_raw)
script_t2_s4 = clean_script_table(s4_raw)

# Official Answer Keys
OFFICIAL_KEYS_T2_L = {
    1: "Bhatt",
    2: "31 March",
    3: "nursing",
    4: "2",
    5: "meat",
    6: "bedsit",
    7: "theatre/theater",
    8: "mature/older",
    9: "town",
    10: "shared",
    11: "trees",
    12: "Friday/Sunday",
    13: "farm",
    14: "C",
    15: "B",
    16: "A",
    17: "A",
    18: "I",
    19: "F",
    20: "E",
    21: "C",
    22: "B",
    23: "B",
    24: "C",
    25: "reading",
    26: "CD",
    27: "workbooks",
    28: "timetable/schedule",
    29: "alarm",
    30: "email/emails",
    31: "central",
    32: "conversation/conversations",
    33: "effectively",
    34: "risk/risks",
    35: "levels",
    36: "description/descriptions",
    37: "technical",
    38: "change",
    39: "responsibility",
    40: "flexible"
}

OFFICIAL_KEYS_T2_R = {
    1: "H",
    2: "C",
    3: "B",
    4: "I",
    5: "D",
    6: "A",
    7: "two decades",
    8: "crowd (noise)",
    9: "invisible (disabilities/disability)",
    10: "Objective 3",
    11: "A",
    12: "C",
    13: "C",
    14: "F",
    15: "D",
    16: "G",
    17: "E",
    18: "D",
    19: "A",
    20: "B",
    21: "C",
    22: "FALSE",
    23: "FALSE",
    24: "TRUE",
    25: "NOT GIVEN",
    26: "TRUE",
    27: "C",
    28: "B",
    29: "D",
    30: "C",
    31: "B",
    32: "YES",
    33: "YES",
    34: "NOT GIVEN",
    35: "NO",
    36: "NOT GIVEN",
    37: "NO",
    38: "A",
    39: "B",
    40: "C"
}

# Questions JSON for Listening
t2_l1_questions = [
    {
        "questionNumber": 1,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Name: Anu 1 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[1],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 1, Answer Key page 154"
    },
    {
        "questionNumber": 2,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Date of birth: 2 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[2],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 2, Answer Key page 154"
    },
    {
        "questionNumber": 3,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Course of study: 3 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[3],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 3, Answer Key page 154"
    },
    {
        "questionNumber": 4,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Number of years planned in hall: 4 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[4],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 4, Answer Key page 154"
    },
    {
        "questionNumber": 5,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Special dietary requirements: no 5 .................... (red)",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[5],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 5, Answer Key page 154"
    },
    {
        "questionNumber": 6,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Preferred room type: a single 6 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[6],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 6, Answer Key page 154"
    },
    {
        "questionNumber": 7,
        "type": "form_completion",
        "question": "Accommodation Form - Student Information: Interests: the 7 ...................., badminton",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[7],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 7, Answer Key page 154"
    },
    {
        "questionNumber": 8,
        "type": "form_completion",
        "question": "Accommodation Form - Priorities in choice of hall: to be with other students who are 8 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[8],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 8, Answer Key page 154"
    },
    {
        "questionNumber": 9,
        "type": "form_completion",
        "question": "Accommodation Form - Priorities in choice of hall: to live outside the 9 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[9],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 9, Answer Key page 154"
    },
    {
        "questionNumber": 10,
        "type": "form_completion",
        "question": "Accommodation Form - Priorities in choice of hall: to have a 10 .................... area for socialising",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[10],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Question 10, Answer Key page 154"
    }
]

t2_l2_questions = [
    {
        "questionNumber": 11,
        "type": "table_completion",
        "question": "Parks and open spaces - Holt Island: Of particular interest: many different 11 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[11],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 11, Answer Key page 154"
    },
    {
        "questionNumber": 12,
        "type": "table_completion",
        "question": "Parks and open spaces - Holt Island: Open: between 12 .................... and Sunday",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[12],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 12, Answer Key page 154"
    },
    {
        "questionNumber": 13,
        "type": "table_completion",
        "question": "Parks and open spaces - Longfield Country Park: reconstruction of a 2,000-year-old 13 .................... with activities for children",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[13],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 13, Answer Key page 154"
    },
    {
        "questionNumber": 14,
        "type": "multiple_choice",
        "question": "Longfield Park: As part of Monday's activity, visitors will",
        "options": [
            "A prepare food with herbs.",
            "B meet a well-known herbalist.",
            "C dye cloth with herbs."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[14],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 14, Answer Key page 154"
    },
    {
        "questionNumber": 15,
        "type": "multiple_choice",
        "question": "For the activity on Wednesday,",
        "options": [
            "A only group bookings are accepted.",
            "B visitors should book in advance.",
            "C attendance is free."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[15],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 15, Answer Key page 154"
    },
    {
        "questionNumber": 16,
        "type": "multiple_choice",
        "question": "For the activity on Saturday, visitors should",
        "options": [
            "A come in suitable clothing.",
            "B make sure they are able to stay for the whole day.",
            "C tell the rangers before the event what they wish to do."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[16],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 16, Answer Key page 154"
    },
    {
        "questionNumber": 17,
        "type": "map_labeling",
        "question": "Hinchingbrooke Park Map - Question 17: bird hide (Write letter A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_L[17],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 17, Answer Key page 154"
    },
    {
        "questionNumber": 18,
        "type": "map_labeling",
        "question": "Hinchingbrooke Park Map - Question 18: dog-walking area (Write letter A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_L[18],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 18, Answer Key page 154"
    },
    {
        "questionNumber": 19,
        "type": "map_labeling",
        "question": "Hinchingbrooke Park Map - Question 19: flower garden (Write letter A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_L[19],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 19, Answer Key page 154"
    },
    {
        "questionNumber": 20,
        "type": "map_labeling",
        "question": "Hinchingbrooke Park Map - Question 20: wooded area (Write letter A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_L[20],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Question 20, Answer Key page 154"
    }
]

t2_l3_questions = [
    {
        "questionNumber": 21,
        "type": "multiple_choice",
        "question": "Students want to keep the Self-Access Centre because",
        "options": [
            "A they enjoy the variety of equipment.",
            "B they like being able to work on their own.",
            "C it is an important part of their studies."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[21],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 21, Answer Key page 154"
    },
    {
        "questionNumber": 22,
        "type": "multiple_choice",
        "question": "Some teachers would prefer to",
        "options": [
            "A close the Self-Access Centre.",
            "B move the Self-Access Centre elsewhere.",
            "C restrict access to the Self-Access Centre."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[22],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 22, Answer Key page 154"
    },
    {
        "questionNumber": 23,
        "type": "multiple_choice",
        "question": "The students' main concern about using the library would be",
        "options": [
            "A the size of the library.",
            "B difficulty in getting help.",
            "C the lack of materials."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[23],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 23, Answer Key page 154"
    },
    {
        "questionNumber": 24,
        "type": "multiple_choice",
        "question": "The Director of Studies is concerned about",
        "options": [
            "A the cost of upgrading the centre.",
            "B the lack of space in the centre.",
            "C the difficulty in supervising the centre."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_L[24],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 24, Answer Key page 154"
    },
    {
        "questionNumber": 25,
        "type": "notes_completion",
        "question": "Improvements to Self-Access Centre - Resources: The level of the 25 .................... materials, in particular, should be more clearly shown.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[25],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 25, Answer Key page 154"
    },
    {
        "questionNumber": 26,
        "type": "notes_completion",
        "question": "Improvements to Self-Access Centre - Resources: Update the 26 .................... collection.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[26],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 26, Answer Key page 154"
    },
    {
        "questionNumber": 27,
        "type": "notes_completion",
        "question": "Improvements to Self-Access Centre - Resources: Buy some 27 .................... and divide them up.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[27],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 27, Answer Key page 154"
    },
    {
        "questionNumber": 28,
        "type": "notes_completion",
        "question": "Improvements to Self-Access Centre - Use of the room: Speak to the teachers and organise a 28 .................... for supervising the centre.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[28],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 28, Answer Key page 154"
    },
    {
        "questionNumber": 29,
        "type": "notes_completion",
        "question": "Improvements to Self-Access Centre - Use of the room: Install an 29 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[29],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 29, Answer Key page 154"
    },
    {
        "questionNumber": 30,
        "type": "notes_completion",
        "question": "Improvements to Self-Access Centre - Use of the room: Restrict personal use of 30 .................... on computers.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[30],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Question 30, Answer Key page 154"
    }
]

t2_l4_questions = [
    {
        "questionNumber": 31,
        "type": "notes_completion",
        "question": "Business Cultures - Power culture: Advantage: 31 .................... power source, few rules and procedures",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[31],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 31, Answer Key page 154"
    },
    {
        "questionNumber": 32,
        "type": "notes_completion",
        "question": "Business Cultures - Power culture: Advantage: communication by 32 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[32],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 32, Answer Key page 154"
    },
    {
        "questionNumber": 33,
        "type": "notes_completion",
        "question": "Business Cultures - Power culture: Disadvantage: might not act 33 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[33],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 33, Answer Key page 154"
    },
    {
        "questionNumber": 34,
        "type": "notes_completion",
        "question": "Business Cultures - Power culture: Suitable employee: not afraid of 34 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[34],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 34, Answer Key page 154"
    },
    {
        "questionNumber": 35,
        "type": "notes_completion",
        "question": "Business Cultures - Role culture: Characteristics of organisation: large, many 35 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[35],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 35, Answer Key page 154"
    },
    {
        "questionNumber": 36,
        "type": "notes_completion",
        "question": "Business Cultures - Role culture: rules and procedure, e.g. job 36 .................... and rules for discipline",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[36],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 36, Answer Key page 154"
    },
    {
        "questionNumber": 37,
        "type": "notes_completion",
        "question": "Business Cultures - Role culture: Advantages: successful when 37 .................... ability is important",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[37],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 37, Answer Key page 154"
    },
    {
        "questionNumber": 38,
        "type": "notes_completion",
        "question": "Business Cultures - Role culture: Disadvantages: slow to see when 38 .................... is needed",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[38],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 38, Answer Key page 154"
    },
    {
        "questionNumber": 39,
        "type": "notes_completion",
        "question": "Business Cultures - Task culture: Suitable employee: doesn't want 39 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[39],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 39, Answer Key page 154"
    },
    {
        "questionNumber": 40,
        "type": "notes_completion",
        "question": "Business Cultures - Task culture: Advantage: 40 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_L[40],
        "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Question 40, Answer Key page 154"
    }
]

# Build Reading Passages Text
p1_text = """Hearing impairment and other auditory function deficit in young children

A Hearing impairment or other auditory function deficit in young children can have a major impact on their development of speech and communication, resulting in a detrimental effect on their ability to learn at school. This is likely to have major consequences for the individual and the population as a whole. The New Zealand Ministry of Health has found from research carried out over two decades that 6-10% of children in that country are affected by hearing loss.

B A preliminary study in New Zealand has shown that classroom noise presents a major concern for teachers and pupils. Modern teaching practices, the organisation of desks in the classroom, poor classroom acoustics, and mechanical means of ventilation such as air-conditioning units all contribute to the number of children unable to comprehend the teacher's voice. Education researchers Nelson and Soli have also suggested that recent trends in learning often involve collaborative interaction of multiple minds and tools as much as individual possession of information. This all amounts to heightened activity and noise levels, which have the potential to be particularly serious for children experiencing auditory function deficit. Noise in classrooms can only exacerbate their difficulty in comprehending and processing verbal communication with other children and instructions from the teacher.

C Children with auditory function deficit are potentially failing to learn to their maximum potential because of noise levels generated in classrooms. The effects of noise on the ability of children to learn effectively in typical classroom environments are now the subject of increasing concern. The International Institute of Noise Control Engineering (I-INCE), on the advice of the World Health Organization, has established an international working party, which includes New Zealand, to evaluate noise and reverberation control for school rooms.

D While the detrimental effects of noise in classroom situations are not limited to children experiencing disability, those with a disability that affects their processing of speech and verbal communication could be extremely vulnerable. The auditory function deficits in question include hearing impairment, autistic spectrum disorders (ASD) and attention deficit disorders (ADD/ADHD).

E Autism is considered a neurological and genetic life-long disorder that causes discrepancies in the way information is processed. This disorder is characterised by interlinking problems with social imagination, social communication and social interaction. According to Janzen, this affects the ability to understand and relate in typical ways to people, understand events and objects in the environment, and understand or respond to sensory stimuli. Autism does not allow learning or thinking in the same ways as in children who are developing normally. Autistic spectrum disorders often result in major difficulties in comprehending verbal information and speech processing. Those experiencing these disorders often find sounds such as crowd noise and the noise generated by machinery painful and distressing. This is difficult to scientifically quantify as such extra-sensory stimuli vary greatly from one autistic individual to another. But a child who finds any type of noise in their classroom or learning space intrusive is likely to be adversely affected in their ability to process information.

F The attention deficit disorders are indicative of neurological and genetic disorders and are characterised by difficulties with sustaining attention, effort and persistence, organisation skills and disinhibition. Children experiencing these disorders find it difficult to screen out unimportant information, and focus on everything in the environment rather than attending to a single activity. Background noise in the classroom becomes a major distraction, which can affect their ability to concentrate.

G Children experiencing an auditory function deficit can often find speech and communication very difficult to isolate and process when set against high levels of background noise. These levels come from outside activities that penetrate the classroom structure, from teaching activities, and other noise generated inside, which can be exacerbated by room reverberation. Strategies are needed to obtain the optimum classroom construction and perhaps a change in classroom culture and methods of teaching. In particular, the effects of noisy classrooms and activities on those experiencing disabilities in the form of auditory function deficit need thorough investigation. It is probable that many undiagnosed children exist in the education system with 'invisible' disabilities. Their needs are less likely to be met than those of children with known disabilities.

H The New Zealand Government has developed a New Zealand Disability Strategy and has embarked on a wide-ranging consultation process. The strategy recognises that people experiencing disability face significant barriers in achieving a full quality of life in areas such as attitude, education, employment and access to services. Objective 3 of the New Zealand Disability Strategy is to 'Provide the Best Education for Disabled People' by improving education so that all children, youth learners and adult learners will have equal opportunities to learn and develop within their already existing local school. For a successful education, the learning environment is vitally significant, so any effort to improve this is likely to be of great benefit to all children, but especially to those with auditory function disabilities.

I A number of countries are already in the process of formulating their own standards for the control and reduction of classroom noise. New Zealand will probably follow their example. The literature to date on noise in school rooms appears to focus on the effects on schoolchildren in general, their teachers and the hearing impaired. Only limited attention appears to have been given to those students experiencing the other disabilities involving auditory function deficit. It is imperative that the needs of these children are taken into account in the setting of appropriate international standards to be promulgated in future."""

t2_r1_questions = [
    {
        "questionNumber": 1,
        "type": "matching_information",
        "question": "Which section contains an account of a national policy initiative? (Write A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[1],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 1, Answer Key page 155"
    },
    {
        "questionNumber": 2,
        "type": "matching_information",
        "question": "Which section contains a description of a global team effort? (Write A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[2],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 2, Answer Key page 155"
    },
    {
        "questionNumber": 3,
        "type": "matching_information",
        "question": "Which section contains a hypothesis as to one reason behind the growth in classroom noise? (Write A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[3],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 3, Answer Key page 155"
    },
    {
        "questionNumber": 4,
        "type": "matching_information",
        "question": "Which section contains a demand for suitable worldwide regulations? (Write A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[4],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 4, Answer Key page 155"
    },
    {
        "questionNumber": 5,
        "type": "matching_information",
        "question": "Which section contains a list of medical conditions which place some children more at risk from noise than others? (Write A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[5],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 5, Answer Key page 155"
    },
    {
        "questionNumber": 6,
        "type": "matching_information",
        "question": "Which section contains the estimated proportion of children in New Zealand with auditory problems? (Write A-I)",
        "options": ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[6],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 6, Answer Key page 155"
    },
    {
        "questionNumber": 7,
        "type": "short_answer",
        "question": "For what period of time has hearing loss in schoolchildren been studied in New Zealand?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_R[7],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 7, Answer Key page 155"
    },
    {
        "questionNumber": 8,
        "type": "short_answer",
        "question": "In addition to machinery noise, what other type of noise can upset children with autism?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_R[8],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 8, Answer Key page 155"
    },
    {
        "questionNumber": 9,
        "type": "short_answer",
        "question": "What term is used to describe the hearing problems of schoolchildren which have not been diagnosed?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_R[9],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 9, Answer Key page 155"
    },
    {
        "questionNumber": 10,
        "type": "short_answer",
        "question": "What part of the New Zealand Disability Strategy aims to give schoolchildren equal opportunity?",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T2_R[10],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 10, Answer Key page 155"
    },
    {
        "questionNumber": 11,
        "type": "multiple_choice",
        "question": "Which TWO factors contributing to classroom noise are mentioned by the writer? (Factor 1)",
        "options": [
            "A current teaching methods",
            "B echoing corridors",
            "C cooling systems",
            "D large class sizes",
            "E loud-voiced teachers",
            "F playground games"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[11],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 11, Answer Key page 155"
    },
    {
        "questionNumber": 12,
        "type": "multiple_choice",
        "question": "Which TWO factors contributing to classroom noise are mentioned by the writer? (Factor 2)",
        "options": [
            "A current teaching methods",
            "B echoing corridors",
            "C cooling systems",
            "D large class sizes",
            "E loud-voiced teachers",
            "F playground games"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[12],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 12, Answer Key page 155"
    },
    {
        "questionNumber": 13,
        "type": "multiple_choice",
        "question": "What is the writer's overall purpose in writing this article?",
        "options": [
            "A to compare different methods of dealing with auditory problems",
            "B to provide solutions for overly noisy learning environments",
            "C to increase awareness of the situation of children with auditory problems",
            "D to promote New Zealand as a model for other countries to follow"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[13],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Question 13, Answer Key page 155"
    }
]

p2_text = """Venus in transit

June 2004 saw the first passage, known as a 'transit', of the planet Venus across the face of the Sun in 122 years. Transits have helped shape our view of the whole Universe, as Heather Cooper and Nigel Henbest explain

A On 8 June 2004, more than half the population of the world were treated to a rare astronomical event. For over six hours, the planet Venus steadily inched its way over the surface of the Sun. This 'transit' of Venus was the first since 6 December 1882. On that occasion, the American astronomer Professor Simon Newcomb led a party to South Africa to observe the event. They were based at a girls' school, where - it is alleged - the combined forces of three schoolmistresses outperformed the professionals with the accuracy of their observations.

B For centuries, transits of Venus have drawn explorers and astronomers alike to the four corners of the globe. And you can put it all down to the extraordinary polymath Edmond Halley. In November 1677, Halley observed a transit of the innermost planet, Mercury, from the desolate island of St Helena in the South Pacific. He realised that, from different latitudes, the passage of the planet across the Sun's disc would appear to differ. By timing the transit from two widely-separated locations, teams of astronomers could calculate the parallax angle - the apparent difference in position of an astronomical body due to a difference in the observer's position. Calculating this angle would allow astronomers to measure what was then the ultimate goal: the distance of the Earth from the Sun. This distance is known as the 'astronomical unit' or AU.

C Halley was aware that the AU was one of the most fundamental of all astronomical measurements. Johannes Kepler, in the early 17th century, had shown that the distances of the planets from the Sun governed their orbital speeds, which were easily measurable. But no-one had found a way to calculate accurate distances to the planets from the Earth. The goal was to measure the AU; then, knowing the orbital speeds of all the other planets round the Sun, the scale of the Solar System would fall into place. However, Halley realised that Mercury was so far away that its parallax angle would be very difficult to determine. As Venus was closer to the Earth, its parallax angle would be larger, and Halley worked out that by using Venus it would be possible to measure the Sun's distance to 1 part in 500. But there was a problem: transits of Venus, unlike those of Mercury, are rare, occurring in pairs roughly eight years apart every hundred or so years. Nevertheless, he accurately predicted that Venus would cross the face of the Sun in both 1761 and 1769 - though he didn't survive to see either.

D Inspired by Halley's suggestion of a way to pin down the scale of the Solar System, teams of British and French astronomers set out on expeditions to places as diverse as India and Siberia. But things weren't helped by Britain and France being at war. The person who deserves most sympathy is the French astronomer Guillaume Le Gentil. He was thwarted by the fact that the British were besieging his observation site at Pondicherry in India. Fleeing on a French warship crossing the Indian Ocean, Le Gentil saw a wonderful transit - but the ship's pitching and rolling ruled out any attempt at making accurate observations. Undaunted, he remained south of the equator, keeping himself busy by studying the islands of Mauritius and Madagascar before setting off to observe the next transit in the Philippines. Ironically after travelling nearly 50,000 kilometres, his view was clouded out at the last moment, a very dispiriting experience.

E While the early transit timings were as precise as instruments would allow, the measurements were dogged by the 'black drop' effect. When Venus begins to cross the Sun's disc, it looks smeared not circular - which makes it difficult to establish timings. This is due to diffraction of light. The second problem is that Venus exhibits a halo of light when it is seen just outside the Sun's disc. While this showed astronomers that Venus was surrounded by a thick layer of gases refracting sunlight around it, both effects made it impossible to obtain accurate timings.

F But astronomers laboured hard to analyse the results of these expeditions to observe Venus transits. Johann Franz Encke, Director of the Berlin Observatory, finally determined a value for the AU based on all these parallax measurements: 153,340,000 km. Reasonably accurate for the time, that is quite close to today's value of 149,597,870 km, determined by radar, which has now superseded transits and all other methods in accuracy. The AU is a cosmic measuring rod, and the basis of how we scale the Universe today. The parallax principle can be extended to measure the distances to the stars. If we look at a star in January - when Earth is at one point in its orbit - it will seem to be in a different position from where it appears six months later. Knowing the width of Earth's orbit, the parallax shift lets astronomers calculate the distance.

G June 2004's transit of Venus was thus more of an astronomical spectacle than a scientifically important event. But such transits have paved the way for what might prove to be one of the most vital breakthroughs in the cosmos - detecting Earth-sized planets orbiting other stars."""

t2_r2_questions = [
    {
        "questionNumber": 14,
        "type": "matching_information",
        "question": "Which paragraph contains examples of different ways in which the parallax principle has been applied? (Write A-G)",
        "options": ["A", "B", "C", "D", "E", "F", "G"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[14],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 14, Answer Key page 155"
    },
    {
        "questionNumber": 15,
        "type": "matching_information",
        "question": "Which paragraph contains a description of an event which prevented a transit observation? (Write A-G)",
        "options": ["A", "B", "C", "D", "E", "F", "G"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[15],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 15, Answer Key page 155"
    },
    {
        "questionNumber": 16,
        "type": "matching_information",
        "question": "Which paragraph contains a statement about potential future discoveries leading on from transit observations? (Write A-G)",
        "options": ["A", "B", "C", "D", "E", "F", "G"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[16],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 16, Answer Key page 155"
    },
    {
        "questionNumber": 17,
        "type": "matching_information",
        "question": "Which paragraph contains a description of physical states connected with Venus which early astronomical instruments failed to overcome? (Write A-G)",
        "options": ["A", "B", "C", "D", "E", "F", "G"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[17],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 17, Answer Key page 155"
    },
    {
        "questionNumber": 18,
        "type": "matching_people",
        "question": "Match the person: He calculated the distance of the Sun from the Earth based on observations of Venus with a fair degree of accuracy.",
        "options": [
            "A Edmond Halley",
            "B Johannes Kepler",
            "C Guillaume Le Gentil",
            "D Johann Franz Encke"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[18],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 18, Answer Key page 155"
    },
    {
        "questionNumber": 19,
        "type": "matching_people",
        "question": "Match the person: He understood that the distance of the Sun from the Earth could be worked out by comparing observations of a transit.",
        "options": [
            "A Edmond Halley",
            "B Johannes Kepler",
            "C Guillaume Le Gentil",
            "D Johann Franz Encke"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[19],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 19, Answer Key page 155"
    },
    {
        "questionNumber": 20,
        "type": "matching_people",
        "question": "Match the person: He realised that the time taken by a planet to go round the Sun depends on its distance from the Sun.",
        "options": [
            "A Edmond Halley",
            "B Johannes Kepler",
            "C Guillaume Le Gentil",
            "D Johann Franz Encke"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[20],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 20, Answer Key page 155"
    },
    {
        "questionNumber": 21,
        "type": "matching_people",
        "question": "Match the person: He witnessed a Venus transit but was unable to make any calculations.",
        "options": [
            "A Edmond Halley",
            "B Johannes Kepler",
            "C Guillaume Le Gentil",
            "D Johann Franz Encke"
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[21],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 21, Answer Key page 155"
    },
    {
        "questionNumber": 22,
        "type": "true_false_not_given",
        "question": "Halley observed one transit of the planet Venus.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[22],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 22, Answer Key page 155"
    },
    {
        "questionNumber": 23,
        "type": "true_false_not_given",
        "question": "Le Gentil managed to observe a second Venus transit.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[23],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 23, Answer Key page 155"
    },
    {
        "questionNumber": 24,
        "type": "true_false_not_given",
        "question": "The shape of Venus appears distorted when it starts to pass in front of the Sun.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[24],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 24, Answer Key page 155"
    },
    {
        "questionNumber": 25,
        "type": "true_false_not_given",
        "question": "Early astronomers suspected that the atmosphere on Venus was toxic.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[25],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 25, Answer Key page 155"
    },
    {
        "questionNumber": 26,
        "type": "true_false_not_given",
        "question": "The parallax principle allows astronomers to work out how far away distant stars are from the Earth.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[26],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Question 26, Answer Key page 155"
    }
]

p3_text = """A neuroscientist reveals how to think differently

In the last decade a revolution has occurred in the way that scientists think about the brain. We now know that the decisions humans make can be traced to the firing patterns of neurons in specific parts of the brain. These discoveries have led to the field of neuroeconomics, which studies the brain's secrets to success in an economic environment that demands innovation and being able to do things differently from competitors. A brain that can do this is an iconoclastic one. Briefly, an iconoclast is a person who does something that others say cannot be done.

This definition implies that iconoclasts are different from other people, but more precisely, it is their brains that are different in three distinct ways: perception, fear response, and social intelligence. Each of these three functions utilizes a different circuit in the brain. Naysayers might suggest that the brain is irrelevant, that thinking in an original, even revolutionary, way is more a matter of personality than brain function. But the field of neuroeconomics was born out of the realization that the physical workings of the brain place limitations on the way we make decisions. By understanding these constraints, we begin to understand why some people march to a different drumbeat.

The first thing to realize is that the brain suffers from limited resources. It has a fixed energy budget, about the same as a 40 watt light bulb, so it has evolved to work as efficiently as possible. This is where most people are impeded from being an iconoclast. For example, when confronted with information streaming from the eyes, the brain will interpret this information in the quickest way possible. Thus it will draw on both past experience and any other source of information, such as what other people say, to make sense of what it is seeing. This happens all the time. The brain takes shortcuts that work so well we are hardly ever aware of them. We think our perceptions of the world are real, but they are only biological and electrical rumblings. Perception is not simply a product of what your eyes or ears transmit to your brain. More than the physical reality of photons or sound waves, perception is a product of the brain.

Perception is central to being an iconoclast. Iconoclasts see things differently to other people. Their brains do not fall into efficiency pitfalls as much as the average person's brain. Iconoclasts, either because they were born that way or through learning, have found ways to work around the perceptual shortcuts that plague most people. Perception is not something that is hardwired into the brain. It is a learned process, which is both a curse and an opportunity for change. The brain faces the fundamental problem of interpreting physical stimuli from the senses. Everything the brain sees, hears, or touches has multiple interpretations. The one that is ultimately chosen is simply the brain's best theory. In technical terms, these conjectures have their basis in the statistical likelihood of one interpretation over another and are heavily influenced by past experience and, importantly for potential iconoclasts, what other people say.

The best way to see things differently to other people is to bombard the brain with things it has never encountered before. Novelty releases the perceptual process from the chains of past experience and forces the brain to make new judgments. Successful iconoclasts have an extraordinary willingness to be exposed to what is fresh and different. Observation of iconoclasts shows that they embrace novelty while most people avoid things that are different.

The problem with novelty, however, is that it tends to trigger the brain's fear system. Fear is a major impediment to thinking like an iconoclast and stops the average person in his tracks. There are many types of fear, but the two that inhibit iconoclastic thinking and people generally find difficult to deal with are fear of uncertainty and fear of public ridicule. These may seem like trivial phobias. But fear of public speaking, which everyone must do from time to time, afflicts one-third of the population. This makes it too common to be considered a mental disorder. It is simply a common variant of human nature, one which iconoclasts do not let inhibit their reactions.

Finally, to be successful iconoclasts, individuals must sell their ideas to other people. This is where social intelligence comes in. Social intelligence is the ability to understand and manage people in a business setting. In the last decade there has been an explosion of knowledge about the social brain and how the brain works when groups coordinate decision making. Neuroscience has revealed which brain circuits are responsible for functions like understanding what other people think, empathy, fairness, and social identity. These brain regions play key roles in whether people convince others of their ideas. Perception is important in social cognition too. The perception of someone's enthusiasm, or reputation, can make or break a deal. Understanding how perception becomes intertwined with social decision making shows why successful iconoclasts are so rare.

Iconoclasts create new opportunities in every area from artistic expression to technology to business. They supply creativity and innovation not easily accomplished by committees. Rules aren't important to them. Iconoclasts face alienation and failure, but can also be a major asset to any organization. It is crucial for success in any field to understand how the iconoclastic mind works."""

t2_r3_questions = [
    {
        "questionNumber": 27,
        "type": "multiple_choice",
        "question": "Neuroeconomics is a field of study which seeks to",
        "options": [
            "A cause a change in how scientists understand brain chemistry.",
            "B understand how good decisions are made in the brain.",
            "C understand how the brain is linked to achievement in competitive fields.",
            "D trace the specific firing patterns of neurons in different areas of the brain."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[27],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 27, Answer Key page 155"
    },
    {
        "questionNumber": 28,
        "type": "multiple_choice",
        "question": "According to the writer, iconoclasts are distinctive because",
        "options": [
            "A they create unusual brain circuits.",
            "B their brains function differently.",
            "C their personalities are distinctive.",
            "D they make decisions easily."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[28],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 28, Answer Key page 155"
    },
    {
        "questionNumber": 29,
        "type": "multiple_choice",
        "question": "According to the writer, the brain works efficiently because",
        "options": [
            "A it uses the eyes quickly.",
            "B it interprets data logically.",
            "C it generates its own energy.",
            "D it relies on previous events."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[29],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 29, Answer Key page 155"
    },
    {
        "questionNumber": 30,
        "type": "multiple_choice",
        "question": "The writer says that perception is",
        "options": [
            "A a combination of photons and sound waves.",
            "B a reliable product of what your senses transmit.",
            "C a result of brain processes.",
            "D a process we are usually conscious of."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[30],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 30, Answer Key page 155"
    },
    {
        "questionNumber": 31,
        "type": "multiple_choice",
        "question": "According to the writer, an iconoclastic thinker",
        "options": [
            "A centralises perceptual thinking in one part of the brain.",
            "B avoids cognitive traps.",
            "C has a brain that is hardwired for learning.",
            "D has more opportunities than the average person."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[31],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 31, Answer Key page 155"
    },
    {
        "questionNumber": 32,
        "type": "yes_no_not_given",
        "question": "Exposure to different events forces the brain to think differently.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[32],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 32, Answer Key page 155"
    },
    {
        "questionNumber": 33,
        "type": "yes_no_not_given",
        "question": "Iconoclasts are unusually receptive to new experiences.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[33],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 33, Answer Key page 155"
    },
    {
        "questionNumber": 34,
        "type": "yes_no_not_given",
        "question": "Most people are too shy to try different things.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[34],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 34, Answer Key page 155"
    },
    {
        "questionNumber": 35,
        "type": "yes_no_not_given",
        "question": "If you think in an iconoclastic way, you can easily overcome fear.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[35],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 35, Answer Key page 155"
    },
    {
        "questionNumber": 36,
        "type": "yes_no_not_given",
        "question": "When concern about embarrassment matters less, other fears become irrelevant.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[36],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 36, Answer Key page 155"
    },
    {
        "questionNumber": 37,
        "type": "yes_no_not_given",
        "question": "Fear of public speaking is a psychological illness.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T2_R[37],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 37, Answer Key page 155"
    },
    {
        "questionNumber": 38,
        "type": "matching_sentence_endings",
        "question": "Thinking like a successful iconoclast is demanding because it",
        "options": [
            "A requires both perceptual and social intelligence skills.",
            "B focuses on how groups decide on an action.",
            "C works in many fields, both artistic and scientific.",
            "D leaves one open to criticism and rejection.",
            "E involves understanding how organisations manage people."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[38],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 38, Answer Key page 155"
    },
    {
        "questionNumber": 39,
        "type": "matching_sentence_endings",
        "question": "The concept of the social brain is useful to iconoclasts because it",
        "options": [
            "A requires both perceptual and social intelligence skills.",
            "B focuses on how groups decide on an action.",
            "C works in many fields, both artistic and scientific.",
            "D leaves one open to criticism and rejection.",
            "E involves understanding how organisations manage people."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[39],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 39, Answer Key page 155"
    },
    {
        "questionNumber": 40,
        "type": "matching_sentence_endings",
        "question": "Iconoclasts are generally an asset because their way of thinking",
        "options": [
            "A requires both perceptual and social intelligence skills.",
            "B focuses on how groups decide on an action.",
            "C works in many fields, both artistic and scientific.",
            "D leaves one open to criticism and rejection.",
            "E involves understanding how organisations manage people."
        ],
        "correctAnswer": OFFICIAL_KEYS_T2_R[40],
        "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Question 40, Answer Key page 155"
    }
]

# Writing Topics & Models
writing_topics_t2 = [
    {
        "id": "cam09-academic-t2-w1",
        "track": "academic",
        "prompt": "The chart below shows the total number of minutes (in billions) of telephone calls in the UK, divided into three categories, from 1995-2002.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
        "type": "bar_chart",
        "typeVi": "Biểu đồ cột",
        "bandRange": "6.0-9.0",
        "outlineJson": json.dumps({
            "introduction": "Paraphrase prompt: Bar chart comparing UK call minutes across three categories (local fixed, national/international fixed, mobile) from 1995 to 2002.",
            "overview": "Local fixed line calls remained the highest throughout, but fluctuated; mobile calls experienced dramatic continuous growth; national/international calls grew steadily.",
            "bodyParagraph1": "Detail local calls (rising from 72B in 1995 to peak at 90B in 1999, then dropping back to 72B by 2002).",
            "bodyParagraph2": "Detail national/international (growing from 38B to 61B) and mobile calls (surging from 2B to 46B, especially post-1999)."
        }, ensure_ascii=False),
        "keyVocabJson": json.dumps([
            {"en": "dramatic increase", "vi": "sự gia tăng đáng kể"},
            {"en": "peaking at", "vi": "đạt đỉnh tại"},
            {"en": "narrowed considerably", "vi": "thu hẹp đáng kể"}
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Writing Task 1, page 53"
    },
    {
        "id": "cam09-academic-t2-w2",
        "track": "academic",
        "prompt": "Some people believe that unpaid community service should be a compulsory part of high school programmes (for example working for a charity, improving the neighbourhood or teaching sports to younger children).\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
        "type": "agree_disagree",
        "typeVi": "Đồng ý hoặc không đồng ý",
        "bandRange": "6.0-9.0",
        "outlineJson": json.dumps({
            "introduction": "Introduce debate on compulsory unpaid community service in high school; state agreement due to personal and civic development.",
            "bodyParagraph1": "Benefits to students: practical skills, work ethic, employability, creative civic engagement.",
            "bodyParagraph2": "Broader societal benefits: reduction of youth crime/boredom, healthier lifestyle balance, community cohesion.",
            "conclusion": "Reiterate strong support for incorporating community work into standard high school curricula."
        }, ensure_ascii=False),
        "keyVocabJson": json.dumps([
            {"en": "compulsory work activities", "vi": "hoạt động lao động bắt buộc"},
            {"en": "employability", "vi": "khả năng tìm việc làm"},
            {"en": "community cohesion", "vi": "sự gắn kết cộng đồng"}
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Writing Task 2, page 54"
    }
]

writing_models_t2 = [
    {
        "id": "cam09-academic-t2-wm1",
        "task": "1",
        "track": "academic",
        "topic": "UK telephone calls by category (1995-2002)",
        "chartType": "bar_chart",
        "chartDescription": "The chart shows the time spent by UK residents on different types of telephone calls between 1995 and 2002.",
        "prompt": writing_topics_t2[0]["prompt"],
        "modelAnswer": """The chart shows the time spent by UK residents on different types of telephone calls between 1995 and 2002.

Local fixed line calls were the highest throughout the period, rising from 72 billion minutes in 1995 to just under 90 billion in 1998. After peaking at 90 billion the following year, these calls had fallen back to the 1995 figure by 2002.

National and international fixed line calls grew steadily from 38 billion to 61 billion at the end of the period in question, though the growth slowed over the last two years.

There was a dramatic increase in mobile calls from 2 billion to 46 billion minutes. This rise was particularly noticeable between 1999 and 2002, during which time the use of mobile phones tripled.

To sum up, although local fixed line calls were still the most popular in 2002, the gap between the three categories had narrowed considerably over the second half of the period in question.""",
        "keyVocabJson": json.dumps([
            {"en": "fixed line calls", "vi": "cuộc gọi cố định"},
            {"en": "tripled", "vi": "tăng gấp ba lần"}
        ], ensure_ascii=False),
        "examinerNotesVi": "Bài mẫu của giám khảo (Band 9.0) thể hiện cấu trúc bài báo cáo rõ ràng, mạch lạc với việc nhóm dữ liệu và so sánh xu hướng nổi bật xuất sắc.",
        "bandEstimate": "9.0",
        "source": "cambridge-ielts-09-scan",
        "license": None,
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Writing Task 1 Model Answer, page 164"
    },
    {
        "id": "cam09-academic-t2-wm2",
        "task": "2",
        "track": "academic",
        "topic": "Unpaid community service in high school programmes",
        "chartType": None,
        "chartDescription": None,
        "prompt": writing_topics_t2[1]["prompt"],
        "modelAnswer": """It has been suggested that high school students should be involved in unpaid community service as part of their school programmes. In my opinion, sending students to work in community services is a good idea as it can provide them with lots of valuable skills.

By giving them compulsory work activities with charitable or community organisations, they will be encouraged to do something more creative. Skills gained through compulsory work will not only be an asset on their CV but also increase their employability. Students will also gain more respect towards work and money as they will realise that it is not that easy to earn them and hopefully will learn to spend them in a more practical way.

Healthy life balance and exercise are strongly promoted by the NHS, and therefore any kind of spare time charity work will prevent from sitting and doing nothing. It could also possibly reduce the crime level in the high school age group. If students have activities to do, they will not be bored and come up with silly ideas which can be dangerous for them or their surroundings.

In conclusion, I think this is a very good idea, and I hope this programme will be put into action for high schools/colleges shortly.""",
        "keyVocabJson": json.dumps([
            {"en": "charitable organisations", "vi": "các tổ chức từ thiện"},
            {"en": "asset on their CV", "vi": "điểm cộng trong hồ sơ xin việc"}
        ], ensure_ascii=False),
        "examinerNotesVi": "Bài làm thực tế của thí sinh đạt Band 8.0 với các luận điểm được phân tích và liên hệ chặt chẽ với sự phát triển kỹ năng thực tế của học sinh.",
        "bandEstimate": "8.0",
        "source": "cambridge-ielts-09-scan",
        "license": None,
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Writing Task 2 Sample Answer, page 165"
    }
]

# Speaking Topics
speaking_topics_t2 = [
    {
        "id": "cam09-academic-t2-s1",
        "part": 1,
        "track": "academic",
        "topic": "Giving gifts",
        "topicVi": "Tặng quà",
        "question": "When do people give gifts or presents in your country? Do you ever take a gift when you visit someone in their home? [Why/Why not?] When did you last receive a gift? [What was it?] Do you enjoy looking for gifts for people? [Why/Why not?]",
        "ideasJson": json.dumps([
            "Traditional gift-giving occasions like birthdays, Lunar New Year, weddings",
            "Bringing housewarming gifts or fruit baskets when visiting friends",
            "Thoughtful selection process matching recipient hobbies"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([
            "Do people in your country prefer receiving practical gifts or sentimental ones?"
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Speaking Part 1, page 55"
    },
    {
        "id": "cam09-academic-t2-s2",
        "part": 2,
        "track": "academic",
        "topic": "A new or exciting activity",
        "topicVi": "Một hoạt động mới mẻ hoặc hào hứng",
        "question": "Describe something you did that was new or exciting.\n\nYou should say:\n- what you did\n- where and when you did this\n- who you shared the activity with\nand explain why this activity was new or exciting for you.",
        "ideasJson": json.dumps([
            "Participating in an adventure sport like scuba diving or white-water rafting",
            "Exploring an unfamiliar foreign city with close friends",
            "Sense of accomplishment overcoming initial nervousness"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([
            "Would you like to do this activity again in the future?"
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Speaking Part 2, page 55"
    },
    {
        "id": "cam09-academic-t2-s3",
        "part": 3,
        "track": "academic",
        "topic": "Doing new things & Learning new things",
        "topicVi": "Làm điều mới & Học hỏi điều mới",
        "question": "Doing new things:\n- Why do you think some people like doing new things?\n- What problems can people have when they try new activities for the first time?\n- Do you think it's best to do new things on your own or with other people? Why?\n\nLearning new things:\n- What kinds of things do children learn to do when they are very young? How important are these things?\n- Do you think children and adults learn to do new things in the same way? How is their learning style different?\n- Some people say that it is more important to be able to learn new things now than it was in the past. Do you agree or disagree with that? Why?",
        "ideasJson": json.dumps([
            "Novelty triggers mental stimulation versus fear of failure",
            "Children learn instinctively through play, adults use structured cognition",
            "Rapid technological innovation makes lifelong learning vital"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 2, Speaking Part 3, page 55"
    }
]

# Assemble Test 2 JSON
test_2_data = {
    "book": "cambridge-ielts-09",
    "test": 2,
    "track": "academic",
    "official_keys": {
        "listening": {str(k): v for k, v in OFFICIAL_KEYS_T2_L.items()},
        "reading": {str(k): v for k, v in OFFICIAL_KEYS_T2_R.items()}
    },
    "listening_sections": [
        {
            "id": "cam09-academic-t2-l1",
            "section": "1",
            "track": "academic",
            "cefrLevel": "A2",
            "difficultyBand": 5.5,
            "title": "Accommodation Form - Student Information",
            "titleVi": "Đơn đăng ký chỗ ở - Thông tin sinh viên",
            "scriptJson": script_t2_s1,
            "questionsJson": json.dumps(t2_l1_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 1, Answer Key page 154"
        },
        {
            "id": "cam09-academic-t2-l2",
            "section": "2",
            "track": "academic",
            "cefrLevel": "B1",
            "difficultyBand": 6.0,
            "title": "Parks and Open Spaces (Hinchingbrooke Park & Longfield Park)",
            "titleVi": "Công viên và không gian mở (Công viên Hinchingbrooke & Longfield)",
            "scriptJson": script_t2_s2,
            "questionsJson": json.dumps(t2_l2_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 2, Answer Key page 154"
        },
        {
            "id": "cam09-academic-t2-l3",
            "section": "3",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.5,
            "title": "Self-Access Centre Improvements",
            "titleVi": "Cải tiến Trung tâm Tự học (Self-Access Centre)",
            "scriptJson": script_t2_s3,
            "questionsJson": json.dumps(t2_l3_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 3, Answer Key page 154"
        },
        {
            "id": "cam09-academic-t2-l4",
            "section": "4",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.5,
            "title": "Business Cultures (Power, Role, Task, Person Culture)",
            "titleVi": "Các loại hình văn hóa doanh nghiệp",
            "scriptJson": script_t2_s4,
            "questionsJson": json.dumps(t2_l4_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Listening Section 4, Answer Key page 154"
        }
    ],
    "reading_passages": [
        {
            "id": "cam09-academic-t2-r1",
            "section": "1",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.5,
            "title": "Hearing impairment and other auditory function deficit in young children",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p1_text,
            "questionsJson": json.dumps(t2_r1_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 1, Answer Key page 155"
        },
        {
            "id": "cam09-academic-t2-r2",
            "section": "2",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.0,
            "title": "Venus in transit",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p2_text,
            "questionsJson": json.dumps(t2_r2_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 2, Answer Key page 155"
        },
        {
            "id": "cam09-academic-t2-r3",
            "section": "3",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.5,
            "title": "A neuroscientist reveals how to think differently",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p3_text,
            "questionsJson": json.dumps(t2_r3_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 2, Reading Passage 3, Answer Key page 155"
        }
    ],
    "writing_topics": writing_topics_t2,
    "writing_models": writing_models_t2,
    "speaking_topics": speaking_topics_t2
}

output_path = OUTPUT_DIR / "cam09-academic-test-2-data.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(test_2_data, f, indent=2, ensure_ascii=False)

print(f"[SUCCESS] Wrote Test 2 data to {output_path}")
