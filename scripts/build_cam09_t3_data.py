# -*- coding: utf-8 -*-
"""
Builder for Cambridge IELTS 09 Test 3 Data JSON outside repo:
C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-09\cam09-academic-test-3-data.json
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

# Extract Tapescripts for Test 3: [220997:262201]
t3_tape_raw = RAW_MD[220997:262201]
# Offsets: Sec 1: 0, Sec 2: 12073, Sec 3: 28293, Sec 4: 37813
s1_raw = t3_tape_raw[0:12073]
s2_raw = t3_tape_raw[12073:28293]
s3_raw = t3_tape_raw[28293:37813]
s4_raw = t3_tape_raw[37813:]

script_t3_s1 = clean_script_table(s1_raw)
script_t3_s2 = clean_script_table(s2_raw)
script_t3_s3 = clean_script_table(s3_raw)
script_t3_s4 = clean_script_table(s4_raw)

# Official Answer Keys
OFFICIAL_KEYS_T3_L = {
    1: "300",
    2: "Sunshade",
    3: "balcony",
    4: "forest/forests",
    5: "319",
    6: "10,000",
    7: "relative",
    8: "missed",
    9: "item",
    10: "Ludlow",
    11: "C",
    12: "A",
    13: "C",
    14: "E",
    15: "H",
    16: "F",
    17: "C",
    18: "G",
    19: "120",
    20: "5 to 12",
    21: "fishing industry",
    22: "statistics",
    23: "note-taking",
    24: "confidence",
    25: "ideas",
    26: "student support",
    27: "places",
    28: "general",
    29: "3 times",
    30: "25",
    31: "B",
    32: "A",
    33: "glass",
    34: "insulation",
    35: "windows",
    36: "electricity",
    37: "floor/floors",
    38: "waste",
    39: "concrete",
    40: "15 years"
}

OFFICIAL_KEYS_T3_R = {
    1: "YES",
    2: "NO",
    3: "YES",
    4: "NOT GIVEN",
    5: "YES",
    6: "YES",
    7: "NO",
    8: "YES",
    9: "H",
    10: "F",
    11: "A",
    12: "C",
    13: "B",
    14: "C",
    15: "E",
    16: "A",
    17: "C",
    18: "A",
    19: "D",
    20: "E",
    21: "F",
    22: "J",
    23: "maintenance",
    24: "slow (turning)",
    25: "low pressure",
    26: "cavitation",
    27: "D",
    28: "F",
    29: "B",
    30: "E",
    31: "A",
    32: "C",
    33: "Jupiter, Saturn",
    34: "Solar System",
    35: "sensors, circuits",
    36: "spares",
    37: "radio dish",
    38: "TRUE",
    39: "TRUE",
    40: "FALSE"
}

# Questions JSON for Listening
t3_l1_questions = [
    {
        "questionNumber": 1,
        "type": "table_completion",
        "question": "Greek Island Holidays - Rose Garden Apartments: Distance to beach: 1 .................... metres",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[1],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 1, Answer Key page 156"
    },
    {
        "questionNumber": 2,
        "type": "table_completion",
        "question": "Greek Island Holidays - 2 .................... Apartments: On a mountainside, each room has own sun terrace",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[2],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 2, Answer Key page 156"
    },
    {
        "questionNumber": 3,
        "type": "table_completion",
        "question": "Greek Island Holidays - Grand Apartments: Older style house with Greek paintings in every room, and a 3 .................... outside",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[3],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 3, Answer Key page 156"
    },
    {
        "questionNumber": 4,
        "type": "table_completion",
        "question": "Greek Island Holidays - Grand Apartments: Views: there are 4 .................... all round",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[4],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 4, Answer Key page 156"
    },
    {
        "questionNumber": 5,
        "type": "table_completion",
        "question": "Greek Island Holidays - Grand Apartments: Price: £5 .................... at that time",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[5],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 5, Answer Key page 156"
    },
    {
        "questionNumber": 6,
        "type": "table_completion",
        "question": "Greek Island Holidays Insurance - Cancellation: If holiday cancelled, you can claim up to £6 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[6],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 6, Answer Key page 156"
    },
    {
        "questionNumber": 7,
        "type": "table_completion",
        "question": "Greek Island Holidays Insurance - Hospital: £600 (additional £7 .................... expenses)",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[7],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 7, Answer Key page 156"
    },
    {
        "questionNumber": 8,
        "type": "table_completion",
        "question": "Greek Island Holidays Insurance - Missing departure: £1,000 (if transport 8 ....................)",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[8],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 8, Answer Key page 156"
    },
    {
        "questionNumber": 9,
        "type": "table_completion",
        "question": "Greek Island Holidays Insurance - Luggage: up to £3,000 (£500 for one 9 ....................)",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[9],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 9, Answer Key page 156"
    },
    {
        "questionNumber": 10,
        "type": "table_completion",
        "question": "Greek Island Holidays Insurance - Travel agent address: 10 .................... House, High Street",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[10],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Question 10, Answer Key page 156"
    }
]

t3_l2_questions = [
    {
        "questionNumber": 11,
        "type": "multiple_choice",
        "question": "Simon's idea for a theme park came from",
        "options": [
            "A his childhood hobby.",
            "B his interest in landscape design.",
            "C his visit to another park."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_L[11],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 11, Answer Key page 156"
    },
    {
        "questionNumber": 12,
        "type": "multiple_choice",
        "question": "When they started, the others thought that",
        "options": [
            "A Simon would fail.",
            "B Simon was crazy.",
            "C Simon would get bored."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_L[12],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 12, Answer Key page 156"
    },
    {
        "questionNumber": 13,
        "type": "multiple_choice",
        "question": "The skill that Simon had to learn was",
        "options": [
            "A how to paint railways.",
            "B how to market the park.",
            "C how to build mechanical engines."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_L[13],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 13, Answer Key page 156"
    },
    {
        "questionNumber": 14,
        "type": "matching_features",
        "question": "What is currently the main area of work for: Simon (the speaker)? (Write A-H)",
        "options": ["A advertising", "B animal care", "C building", "D educational links", "E engine maintenance", "F food and drink", "G sales", "H staffing"],
        "correctAnswer": OFFICIAL_KEYS_T3_L[14],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 14, Answer Key page 156"
    },
    {
        "questionNumber": 15,
        "type": "matching_features",
        "question": "What is currently the main area of work for: Liz? (Write A-H)",
        "options": ["A advertising", "B animal care", "C building", "D educational links", "E engine maintenance", "F food and drink", "G sales", "H staffing"],
        "correctAnswer": OFFICIAL_KEYS_T3_L[15],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 15, Answer Key page 156"
    },
    {
        "questionNumber": 16,
        "type": "matching_features",
        "question": "What is currently the main area of work for: Sarah? (Write A-H)",
        "options": ["A advertising", "B animal care", "C building", "D educational links", "E engine maintenance", "F food and drink", "G sales", "H staffing"],
        "correctAnswer": OFFICIAL_KEYS_T3_L[16],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 16, Answer Key page 156"
    },
    {
        "questionNumber": 17,
        "type": "matching_features",
        "question": "What is currently the main area of work for: Duncan? (Write A-H)",
        "options": ["A advertising", "B animal care", "C building", "D educational links", "E engine maintenance", "F food and drink", "G sales", "H staffing"],
        "correctAnswer": OFFICIAL_KEYS_T3_L[17],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 17, Answer Key page 156"
    },
    {
        "questionNumber": 18,
        "type": "matching_features",
        "question": "What is currently the main area of work for: Judith? (Write A-H)",
        "options": ["A advertising", "B animal care", "C building", "D educational links", "E engine maintenance", "F food and drink", "G sales", "H staffing"],
        "correctAnswer": OFFICIAL_KEYS_T3_L[18],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 18, Answer Key page 156"
    },
    {
        "questionNumber": 19,
        "type": "table_completion",
        "question": "Winridge Forest Railway Park Features - Go-Kart arena: Size: 19 .................... m2",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[19],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 19, Answer Key page 156"
    },
    {
        "questionNumber": 20,
        "type": "table_completion",
        "question": "Winridge Forest Railway Park Features - Go-Kart arena: Target age group: 20 .................... year-olds",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[20],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Question 20, Answer Key page 156"
    }
]

t3_l3_questions = [
    {
        "questionNumber": 21,
        "type": "notes_completion",
        "question": "Study Skills Tutorial (Caroline Benning) - Dissertation topic: the 21 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[21],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 21, Answer Key page 156"
    },
    {
        "questionNumber": 22,
        "type": "notes_completion",
        "question": "Study Skills Tutorial - Strengths: 22 ...................., computer modelling",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[22],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 22, Answer Key page 156"
    },
    {
        "questionNumber": 23,
        "type": "notes_completion",
        "question": "Study Skills Tutorial - Weaknesses: lack of background information, poor 23 .................... skills",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[23],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 23, Answer Key page 156"
    },
    {
        "questionNumber": 24,
        "type": "table_completion",
        "question": "Study Skills Strategies - Peer group discussion: Benefits: increases 24 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[24],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 24, Answer Key page 156"
    },
    {
        "questionNumber": 25,
        "type": "table_completion",
        "question": "Study Skills Strategies - Peer group discussion: Problems: dissertations tend to contain the same 25 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[25],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 25, Answer Key page 156"
    },
    {
        "questionNumber": 26,
        "type": "table_completion",
        "question": "Study Skills Strategies - Use the 26 .................... service: Benefits: provides structured programme",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[26],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 26, Answer Key page 156"
    },
    {
        "questionNumber": 27,
        "type": "table_completion",
        "question": "Study Skills Strategies - Use student support service: Problems: limited 27 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[27],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 27, Answer Key page 156"
    },
    {
        "questionNumber": 28,
        "type": "table_completion",
        "question": "Study Skills Strategies - Consult study skills books: Problems: can be too 28 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[28],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 28, Answer Key page 156"
    },
    {
        "questionNumber": 29,
        "type": "notes_completion",
        "question": "Study Skills Tutorial - Recommendations: use a card index, read all notes 29 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[29],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 29, Answer Key page 156"
    },
    {
        "questionNumber": 30,
        "type": "notes_completion",
        "question": "Study Skills Tutorial - Next tutorial date: 30 .................... January",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[30],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Question 30, Answer Key page 156"
    }
]

t3_l4_questions = [
    {
        "questionNumber": 31,
        "type": "multiple_choice",
        "question": "The owners of the underground house",
        "options": [
            "A had no experience of living in an environmentally friendly house.",
            "B had previously designed another energy-efficient home.",
            "C had made extensive plans before buying the land."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_L[31],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 31, Answer Key page 156"
    },
    {
        "questionNumber": 32,
        "type": "multiple_choice",
        "question": "The site of the house was chosen because",
        "options": [
            "A it was in an area of natural beauty.",
            "B it was close to their jobs.",
            "C it had easy road access."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_L[32],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 32, Answer Key page 156"
    },
    {
        "questionNumber": 33,
        "type": "notes_completion",
        "question": "The Underground House - Special features: south-facing side made of 33 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[33],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 33, Answer Key page 156"
    },
    {
        "questionNumber": 34,
        "type": "notes_completion",
        "question": "The Underground House - Special features: layer of foam around the outside for 34 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[34],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 34, Answer Key page 156"
    },
    {
        "questionNumber": 35,
        "type": "notes_completion",
        "question": "The Underground House - Special features: special light tubes in the roof instead of 35 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[35],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 35, Answer Key page 156"
    },
    {
        "questionNumber": 36,
        "type": "notes_completion",
        "question": "The Underground House - Special features: special tiles on the outside generate some of the house's 36 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[36],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 36, Answer Key page 156"
    },
    {
        "questionNumber": 37,
        "type": "notes_completion",
        "question": "The Underground House - Special features: recycled materials used, e.g. the 37 .................... are made of reclaimed wood",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[37],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 37, Answer Key page 156"
    },
    {
        "questionNumber": 38,
        "type": "notes_completion",
        "question": "The Underground House - Environmental issues: system for dealing organically with the 38 .................... produced in the house",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[38],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 38, Answer Key page 156"
    },
    {
        "questionNumber": 39,
        "type": "notes_completion",
        "question": "The Underground House - Environmental issues: construction was harmful to the environment because massive amounts of 39 .................... had to be used",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[39],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 39, Answer Key page 156"
    },
    {
        "questionNumber": 40,
        "type": "notes_completion",
        "question": "The Underground House - Environmental issues: it was calculated that the environmental debt would only take 40 .................... to clear",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_L[40],
        "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Question 40, Answer Key page 156"
    }
]

# Build Reading Passages Text
p1_text = """Attitudes to language

It is not easy to be systematic and objective about language study. Popular linguistic debate regularly deteriorates into invective and polemic. Language belongs to everyone, so most people feel they have a right to hold an opinion about it. And when opinions differ, emotions can run high. Arguments can start as easily over minor points of usage as over major policies of linguistic education.

Language, moreover, is a very public behaviour, so it is easy for different usages to be noted and criticised. No part of society or social behaviour is exempt: linguistic factors influence how we judge personality, intelligence, social status, educational standards, job aptitude, and many other areas of identity and social survival. As a result, it is easy to hurt, and to be hurt, when language use is unfeelingly attacked.

In its most general sense, prescriptivism is the view that one variety of language has an inherently higher value than others, and that this ought to be imposed on the whole of the speech community. The view is propounded especially in relation to grammar and vocabulary, and frequently with reference to pronunciation. The variety which is favoured, in this account, is usually a version of the 'standard' written language, especially as encountered in literature, or in the formal spoken language which most closely reflects this style. Adherents to this variety are said to speak or write 'correctly'; deviations from it are said to be 'incorrect'.

All the main languages have been studied prescriptively at some point in their history, though the 18th century approach to the writing of grammars and dictionaries. The aims of these early grammarians were threefold: (a) they wanted to codify the principles of their languages, to show that there was a system beneath the apparent chaos of usage, (b) they wanted a means of settling disputes over usage, and (c) they wanted to point out what they felt to be common errors, in order to 'improve' the language. The authoritarian nature of the approach is best characterised by its reliance on 'rules' of grammar. Some usages are 'prescribed', to be learnt and followed accurately; others are 'proscribed', to be avoided. In this early period, there were no half-measures: usage was either right or wrong, and it was the task of the grammarian not simply to record alternatives, but to pronounce judgement upon them.

These attitudes are still with us, and they motivate a widespread concern that linguistic standards should be maintained. Nevertheless, there is an alternative point of view that is concerned less with standards than with the facts of linguistic usage. This approach is summarised in the statement that it is the task of the grammarian to describe, not prescribe - to record the facts of linguistic diversity, and not to attempt the impossible tasks of evaluating language variation or halting language change. In the second half of the 18th century, we already find advocates of this view, such as Joseph Priestley, whose Rudiments of English Grammar (1761) insists that 'the custom of speaking is the original and only just standard of any language'. Linguistic issues, it is argued, cannot be solved by logic and legislation. And this view has become the tenet of the modern linguistic approach to grammatical analysis.

In our own time, the opposition between 'descriptivists' and 'prescriptivists' has often become extreme, with both sides painting unreal pictures of the other. Descriptive grammarians have been presented as people who do not care about standards, because of the way they see all forms of usage as equally valid. Prescriptive grammarians have been presented as blind adherents to a historical tradition. The opposition has even been presented in quasi-political terms - of radical liberalism vs elitist conservatism."""

t3_r1_questions = [
    {
        "questionNumber": 1,
        "type": "yes_no_not_given",
        "question": "There are understandable reasons why arguments occur about language.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[1],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 1, Answer Key page 157"
    },
    {
        "questionNumber": 2,
        "type": "yes_no_not_given",
        "question": "People feel more strongly about language education than about small differences in language usage.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[2],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 2, Answer Key page 157"
    },
    {
        "questionNumber": 3,
        "type": "yes_no_not_given",
        "question": "Our assessment of a person's intelligence is affected by the way he or she uses language.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[3],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 3, Answer Key page 157"
    },
    {
        "questionNumber": 4,
        "type": "yes_no_not_given",
        "question": "Prescriptive grammar books cost a lot of money to buy in the 18th century.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[4],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 4, Answer Key page 157"
    },
    {
        "questionNumber": 5,
        "type": "yes_no_not_given",
        "question": "Prescriptivism still exists today.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[5],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 5, Answer Key page 157"
    },
    {
        "questionNumber": 6,
        "type": "yes_no_not_given",
        "question": "According to descriptivists it is pointless to try to stop language change.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[6],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 6, Answer Key page 157"
    },
    {
        "questionNumber": 7,
        "type": "yes_no_not_given",
        "question": "Descriptivism only appeared after the 18th century.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[7],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 7, Answer Key page 157"
    },
    {
        "questionNumber": 8,
        "type": "yes_no_not_given",
        "question": "Both descriptivists and prescriptivists have been misrepresented.",
        "options": ["YES", "NO", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[8],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 8, Answer Key page 157"
    },
    {
        "questionNumber": 9,
        "type": "summary_completion",
        "question": "The language debate: According to 9 ...................., there is only one correct form of language. (Choose A-I)",
        "options": ["A descriptivists", "B language experts", "C popular speech", "D formal language", "E evaluation", "F rules", "G modern linguists", "H prescriptivists", "I change"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[9],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 9, Answer Key page 157"
    },
    {
        "questionNumber": 10,
        "type": "summary_completion",
        "question": "The language debate: Linguists who take this approach to language place great importance on grammatical 10 .................... . (Choose A-I)",
        "options": ["A descriptivists", "B language experts", "C popular speech", "D formal language", "E evaluation", "F rules", "G modern linguists", "H prescriptivists", "I change"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[10],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 10, Answer Key page 157"
    },
    {
        "questionNumber": 11,
        "type": "summary_completion",
        "question": "The language debate: Conversely, the view of 11 ...................., such as Joseph Priestley, is that grammar should be based on popular speech. (Choose A-I)",
        "options": ["A descriptivists", "B language experts", "C popular speech", "D formal language", "E evaluation", "F rules", "G modern linguists", "H prescriptivists", "I change"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[11],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 11, Answer Key page 157"
    },
    {
        "questionNumber": 12,
        "type": "summary_completion",
        "question": "The language debate: is that grammar should be based on 12 .................... . (Choose A-I)",
        "options": ["A descriptivists", "B language experts", "C popular speech", "D formal language", "E evaluation", "F rules", "G modern linguists", "H prescriptivists", "I change"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[12],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 12, Answer Key page 157"
    },
    {
        "questionNumber": 13,
        "type": "multiple_choice",
        "question": "What is the writer's purpose in Reading Passage 1?",
        "options": [
            "A to argue in favour of a particular approach to writing dictionaries and grammar books",
            "B to present a historical account of differing views of language",
            "C to describe the differences between spoken and written language",
            "D to show how a certain view of language has been discredited"
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_R[13],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Question 13, Answer Key page 157"
    }
]

p2_text = """Tidal Power

Undersea turbines which produce electricity from the tides are set to become an important source of renewable energy for Britain. It is still too early to predict the extent of the impact they may have, but all the signs that we can do it are good.

A Operating on the same principle as wind turbines, the power in sea currents drives marine turbines - which are underwater. But unlike wind, tides are predictable and the power input is constant. The technology raises the prospect of Britain becoming self-sufficient in renewable energy and drastically reducing its carbon dioxide emissions. If tide, wind and wave power are all developed, Britain would be able to close gas, coal and even nuclear power stations and export renewable power to other parts of Europe.

B Unlike wind power, which Britain originally developed and then abandoned for 20 years allowing the Dutch to make it a major industry, marine turbine technology is in its infancy and Britain has the opportunity to dominate the European and world markets. Marine Current Turbines, a Bristol-based company, has established a commercial project with a prototype turbine off Lynmouth in Devon.

C The Lynmouth site was chosen because of its strong currents, which reach up to three knots at peak times. In addition, it is close to the shore and has the advantage of having the grid connection nearby. The company is already planning a larger site near Southampton. Much is already known about turbine blade design, because of wind power and ship propellers. There are a few technical difficulties, but I believe in the next five to ten years we will be installing commercial marine turbine farms. Southampton has been awarded £215,000 over three years to develop the turbines and is working with Marine Current Turbines on the Lynmouth project. EU research has now identified 106 potential sites for tidal power, 80% round the coasts of Britain. The best sites are between islands or around heavily indented coasts where there are strong tidal currents.

D A marine turbine blade needs to be only one third of the size of a wind generator to produce three times as much power. The blades will be about 20 metres in diameter, so around 30 metres of water is required. Unlike wind power, there are unlikely to be environmental objections. Fish and other creatures are thought unlikely to be at risk from the relatively slow-turning blades. Each turbine will be mounted on a tower which will connect to the national power supply grid via underwater cables. The towers will stick out of the water and be lit, to warn shipping, and also be designed to be lifted out of the water for maintenance and to clean seaweed from the blades.

E Dr Bahaj has done most work on the Alderney site, where there are powerful currents. The single undersea turbine farm would produce far more power than needed for the Channel Islands and most would be fed into the French Grid and be re-imported into Britain via the cable under the Channel.

F One technical difficulty is cavitation, where low pressure behind a turning blade causes air bubbles. These can cause vibration and damage the blades of the turbines. Dr Bahaj said: 'We have to test a number of blade types to avoid this happening or at least make sure it does not damage the turbines or reduce performance. Another slight concern is submerged debris floating into the blades. So far we do not know how much of a problem it might be. We will have to make the turbines robust because the sea is a hostile environment, but all the signs that we can do it are good.'"""

t3_r2_questions = [
    {
        "questionNumber": 14,
        "type": "matching_information",
        "question": "Which paragraph contains the location of the first test site? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[14],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 14, Answer Key page 157"
    },
    {
        "questionNumber": 15,
        "type": "matching_information",
        "question": "Which paragraph contains a way of bringing the power produced on one site back into Britain? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[15],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 15, Answer Key page 157"
    },
    {
        "questionNumber": 16,
        "type": "matching_information",
        "question": "Which paragraph contains a reference to a previous attempt by Britain to find an alternative source of energy? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[16],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 16, Answer Key page 157"
    },
    {
        "questionNumber": 17,
        "type": "matching_information",
        "question": "Which paragraph contains mention of the possibility of applying technology from another industry? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[17],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 17, Answer Key page 157"
    },
    {
        "questionNumber": 18,
        "type": "multiple_choice",
        "question": "Which FIVE of the following claims about tidal power are made by the writer? (Claim 1)",
        "options": [
            "A It is a more reliable source of energy than wind power.",
            "B It would replace all other forms of energy in Britain.",
            "C Its introduction has come as a result of public pressure.",
            "D It would cut down on air pollution.",
            "E It could contribute to the closure of many existing power stations in Britain.",
            "F It could be a means of increasing national income.",
            "G It could face a lot of resistance from other fuel industries.",
            "H It could be sold more cheaply than any other type of fuel.",
            "I It could compensate for the shortage of inland sites for energy production.",
            "J It is best produced in the vicinity of coastlines with particular features."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_R[18],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 18, Answer Key page 157"
    },
    {
        "questionNumber": 19,
        "type": "multiple_choice",
        "question": "Which FIVE of the following claims about tidal power are made by the writer? (Claim 2)",
        "options": [
            "A It is a more reliable source of energy than wind power.",
            "B It would replace all other forms of energy in Britain.",
            "C Its introduction has come as a result of public pressure.",
            "D It would cut down on air pollution.",
            "E It could contribute to the closure of many existing power stations in Britain.",
            "F It could be a means of increasing national income.",
            "G It could face a lot of resistance from other fuel industries.",
            "H It could be sold more cheaply than any other type of fuel.",
            "I It could compensate for the shortage of inland sites for energy production.",
            "J It is best produced in the vicinity of coastlines with particular features."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_R[19],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 19, Answer Key page 157"
    },
    {
        "questionNumber": 20,
        "type": "multiple_choice",
        "question": "Which FIVE of the following claims about tidal power are made by the writer? (Claim 3)",
        "options": [
            "A It is a more reliable source of energy than wind power.",
            "B It would replace all other forms of energy in Britain.",
            "C Its introduction has come as a result of public pressure.",
            "D It would cut down on air pollution.",
            "E It could contribute to the closure of many existing power stations in Britain.",
            "F It could be a means of increasing national income.",
            "G It could face a lot of resistance from other fuel industries.",
            "H It could be sold more cheaply than any other type of fuel.",
            "I It could compensate for the shortage of inland sites for energy production.",
            "J It is best produced in the vicinity of coastlines with particular features."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_R[20],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 20, Answer Key page 157"
    },
    {
        "questionNumber": 21,
        "type": "multiple_choice",
        "question": "Which FIVE of the following claims about tidal power are made by the writer? (Claim 4)",
        "options": [
            "A It is a more reliable source of energy than wind power.",
            "B It would replace all other forms of energy in Britain.",
            "C Its introduction has come as a result of public pressure.",
            "D It would cut down on air pollution.",
            "E It could contribute to the closure of many existing power stations in Britain.",
            "F It could be a means of increasing national income.",
            "G It could face a lot of resistance from other fuel industries.",
            "H It could be sold more cheaply than any other type of fuel.",
            "I It could compensate for the shortage of inland sites for energy production.",
            "J It is best produced in the vicinity of coastlines with particular features."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_R[21],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 21, Answer Key page 157"
    },
    {
        "questionNumber": 22,
        "type": "multiple_choice",
        "question": "Which FIVE of the following claims about tidal power are made by the writer? (Claim 5)",
        "options": [
            "A It is a more reliable source of energy than wind power.",
            "B It would replace all other forms of energy in Britain.",
            "C Its introduction has come as a result of public pressure.",
            "D It would cut down on air pollution.",
            "E It could contribute to the closure of many existing power stations in Britain.",
            "F It could be a means of increasing national income.",
            "G It could face a lot of resistance from other fuel industries.",
            "H It could be sold more cheaply than any other type of fuel.",
            "I It could compensate for the shortage of inland sites for energy production.",
            "J It is best produced in the vicinity of coastlines with particular features."
        ],
        "correctAnswer": OFFICIAL_KEYS_T3_R[22],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 22, Answer Key page 157"
    },
    {
        "questionNumber": 23,
        "type": "diagram_labeling",
        "question": "An Undersea Turbine: Whole tower can be raised for 23 .................... and the extraction of seaweed from the blades",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[23],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 23, Answer Key page 157"
    },
    {
        "questionNumber": 24,
        "type": "diagram_labeling",
        "question": "An Undersea Turbine: Sea life not in danger due to the fact that blades are comparatively 24 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[24],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 24, Answer Key page 157"
    },
    {
        "questionNumber": 25,
        "type": "diagram_labeling",
        "question": "An Undersea Turbine: Air bubbles result from the 25 .................... behind blades.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[25],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 25, Answer Key page 157"
    },
    {
        "questionNumber": 26,
        "type": "diagram_labeling",
        "question": "An Undersea Turbine: This is known as 26 ....................",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[26],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Question 26, Answer Key page 157"
    }
]

p3_text = """Information theory - the big idea

Information theory lies at the heart of everything - from DVD players and the genetic code of DNA to the physics of the universe at its most fundamental. It has been central to the development of the science of communication, which enables data to be sent reliably along cables and through the ether.

A In April 2002 an event took place which demonstrated one of the many applications of information theory. The space probe, Voyager 1, launched in 1977, had sent back spectacular images of Jupiter and Saturn and then soared out of the Solar System on a one-way mission to the stars. After 25 years of exposure to the freezing temperatures of deep space, the probe was beginning to show its age. Sensors and circuits were failing one by one, and in 2002 the probe was in danger of becoming completely lost to science. The problem was that the message instructing the probe to switch to a spare radio dish had to be sent across eight billion miles of space. What is more, it had to be sent through a blizzard of interference that risked distorting the message into gibberish. Yet NASA engineers managed to pull off this apparent miracle. The transmission was successfully received, the switchover took place and the probe continues to communicate with Earth.

B The basis of this success is a fundamental principle of information theory known as 'error correction'. Error correction is the brainchild of one man, Claude Shannon, who single-handedly invented information theory in 1948. A polymath who shunned the limelight, Shannon worked at Bell Telephone Laboratories in New Jersey during the 1940s. He was an eccentric genius who rode a unicycle along the company corridors while juggling, and he became fascinated by the challenges of transmitting messages reliably along noisy channels.

C This all seems light years away from the down-to-earth uses Shannon originally had for his work, which began when he was a 22-year-old graduate engineering student at the prestigious Massachusetts Institute of Technology in 1939. He set out with an apparently simple aim: to pin down the precise meaning of the concept of 'information'. The most basic form of information, Shannon argued, is whether something is true or false - which can be captured in the binary unit, or 'bit', of the form 1 or 0. Having identified this fundamental unit, Shannon set about defining otherwise vague ideas about information and how to transmit it from place to place. In the process he discovered something surprising: it is always possible to guarantee information will get through random interference - 'noise' - intact.

D Noise usually means unwanted sounds which interfere with genuine information. Information theory generalises this idea via theorems that capture the effects of noise with mathematical precision. In particular, Shannon showed that noise sets a limit on the rate at which information can pass along communication channels while remaining error-free. This rate depends on the relative strengths of the signal and noise travelling down the communication channel, and on its capacity (its 'bandwidth'). The resulting limit, given in units of bits per second, is the absolute maximum rate of error-free communication given signal strength and noise level. The trick, Shannon showed, is to find ways of packaging up - 'coding' - information to cope with the ravages of noise, while staying within the information-carrying capacity - 'bandwidth' - of the communication system being used.

E Over the years scientists have devised many such coding methods, and they have proved crucial in many technological feats. The Voyager spacecraft transmitted data using codes which added one extra bit for every single bit of information; the result was an error rate of just one bit in 10,000 - and stunningly clear pictures of the planets. Other codes have become part of everyday life - such as the Universal Product Code, or bar code, which uses a simple error-detecting system that ensures supermarket check-out lasers can read the price even on, say, a crumpled bag of crisps. As recently as 1993, engineers made a major breakthrough by discovering so-called turbo codes - which come very close to Shannon's ultimate limit for the maximum rate that data can be transmitted reliably, and now play a key role in the mobile videophone revolution.

F Shannon also laid the foundations of more efficient ways of storing information, by stripping out superfluous ('redundant') bits from data which contributed little real information. As mobile phone text messages like 'I CN C U' show, it is often possible to leave out a lot of data without losing much meaning. As with error correction, however, there's a limit beyond which messages become too ambiguous. Shannon showed how to calculate this limit, opening the way to the design of compression methods that cram maximum information into the minimum space."""

t3_r3_questions = [
    {
        "questionNumber": 27,
        "type": "matching_information",
        "question": "Which paragraph contains an explanation of the factors affecting the transmission of information? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[27],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 27, Answer Key page 157"
    },
    {
        "questionNumber": 28,
        "type": "matching_information",
        "question": "Which paragraph contains an example of how unnecessary information can be omitted? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[28],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 28, Answer Key page 157"
    },
    {
        "questionNumber": 29,
        "type": "matching_information",
        "question": "Which paragraph contains a reference to Shannon's attitude to fame? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[29],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 29, Answer Key page 157"
    },
    {
        "questionNumber": 30,
        "type": "matching_information",
        "question": "Which paragraph contains details of a machine capable of interpreting incomplete information? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[30],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 30, Answer Key page 157"
    },
    {
        "questionNumber": 31,
        "type": "matching_information",
        "question": "Which paragraph contains a detailed account of an incident involving information theory? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[31],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 31, Answer Key page 157"
    },
    {
        "questionNumber": 32,
        "type": "matching_information",
        "question": "Which paragraph contains a reference to what Shannon initially intended to achieve in his research? (Write A-F)",
        "options": ["A", "B", "C", "D", "E", "F"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[32],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 32, Answer Key page 157"
    },
    {
        "questionNumber": 33,
        "type": "notes_completion",
        "question": "The Voyager 1 Space Probe: The probe transmitted pictures of both 33 .................... and Saturn, then left the Solar System.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[33],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 33, Answer Key page 157"
    },
    {
        "questionNumber": 34,
        "type": "notes_completion",
        "question": "The Voyager 1 Space Probe: then left the 34 .................... .",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[34],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 34, Answer Key page 157"
    },
    {
        "questionNumber": 35,
        "type": "notes_completion",
        "question": "The Voyager 1 Space Probe: Scientists feared that both the 35 .................... and circuits were about to stop working.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[35],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 35, Answer Key page 157"
    },
    {
        "questionNumber": 36,
        "type": "notes_completion",
        "question": "The Voyager 1 Space Probe: The only hope was to tell the probe to replace them with 36 .................... - but distance made communication with the probe difficult.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[36],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 36, Answer Key page 157"
    },
    {
        "questionNumber": 37,
        "type": "notes_completion",
        "question": "The Voyager 1 Space Probe: A 37 .................... was used to transmit the message at the speed of light.",
        "options": [],
        "correctAnswer": OFFICIAL_KEYS_T3_R[37],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 37, Answer Key page 157"
    },
    {
        "questionNumber": 38,
        "type": "true_false_not_given",
        "question": "The concept of describing something as true or false was the starting point for Shannon in his attempts to send messages over distances.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[38],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 38, Answer Key page 157"
    },
    {
        "questionNumber": 39,
        "type": "true_false_not_given",
        "question": "The amount of information that can be sent in a given time period is determined with reference to the signal strength and noise level.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[39],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 39, Answer Key page 157"
    },
    {
        "questionNumber": 40,
        "type": "true_false_not_given",
        "question": "Products have now been developed which can convey more information than Shannon had anticipated as possible.",
        "options": ["TRUE", "FALSE", "NOT GIVEN"],
        "correctAnswer": OFFICIAL_KEYS_T3_R[40],
        "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Question 40, Answer Key page 157"
    }
]

# Writing Topics & Models
writing_topics_t3 = [
    {
        "id": "cam09-academic-t3-w1",
        "track": "academic",
        "prompt": "The charts below give information on the ages of the populations of Yemen and Italy in 2000 and projections for 2050.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
        "type": "pie_chart",
        "typeVi": "Biểu đồ tròn",
        "bandRange": "6.0-9.0",
        "outlineJson": json.dumps({
            "introduction": "Paraphrase prompt: Demographic distribution by age group (0-14, 15-59, 60+) in Yemen and Italy in 2000 and projections for 2050.",
            "overview": "Yemen's population shifts from youthful to working-age majority; Italy experiences an acute aging trend with 60+ age group growing substantially.",
            "bodyParagraph1": "Detailed statistics for Yemen in 2000 vs 2050 (0-14 dropping from 50.1% to 37.0%; 15-59 increasing to 57.3%).",
            "bodyParagraph2": "Detailed statistics for Italy in 2000 vs 2050 (60+ group surging from 24.1% to 42.3%; 0-14 shrinking to 11.5%)."
        }, ensure_ascii=False),
        "keyVocabJson": json.dumps([
            {"en": "demographic distribution", "vi": "phân bố nhân khẩu học"},
            {"en": "projected increase", "vi": "mức tăng dự kiến"},
            {"en": "aging population", "vi": "dân số già hóa"}
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Writing Task 1, page 76"
    },
    {
        "id": "cam09-academic-t3-w2",
        "track": "academic",
        "prompt": "Some people say that the best way to improve public health is by increasing the number of sports facilities. Others, however, say that this would have little effect on public health and that other measures are required.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
        "type": "discuss_both_views",
        "typeVi": "Thảo luận hai quan điểm và đưa ra ý kiến",
        "bandRange": "6.0-9.0",
        "outlineJson": json.dumps({
            "introduction": "Introduce debate on enhancing public health via sports facilities versus holistic public policies; state personal stance that broader measures are needed.",
            "bodyParagraph1": "Arguments for sports facilities: sedentary lifestyles, local accessibility, catering to varied fitness interests.",
            "bodyParagraph2": "Arguments for broader measures: fiscal penalties on unhealthy food/tobacco/alcohol, accessible park exercise equipment, active public transit.",
            "conclusion": "Sports facilities are too narrow alone; public health requires integrated lifestyle interventions."
        }, ensure_ascii=False),
        "keyVocabJson": json.dumps([
            {"en": "sedentary lifestyle", "vi": "lối sống ít vận động"},
            {"en": "tax penalties", "vi": "chính sách thuế phạt"},
            {"en": "holistic approach", "vi": "cách tiếp cận toàn diện"}
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Writing Task 2, page 77"
    }
]

writing_models_t3 = [
    {
        "id": "cam09-academic-t3-wm1",
        "task": "1",
        "track": "academic",
        "topic": "Age demographics of Yemen and Italy (2000 vs 2050)",
        "chartType": "pie_chart",
        "chartDescription": "The diagrams show statistical information regarding the ages of the inhabitants of Yemen and Italy in 2000 and projections for 2050.",
        "prompt": writing_topics_t3[0]["prompt"],
        "modelAnswer": """The diagrams show statistical information regarding the ages of the inhabitants of Yemen and Italy in 2000 and projections for 2050.

We can see that in 2000 the majority of people in Yemen was between 0 and 14 years old, with 50.1%, whereas in Italy most of the population was between 15 and 59 years old, with 61.6%. In contrast, the elderly in the former country was 60 years old or more in 2000, while in the latter country this figure is represented with 24.1%.

By 2050, the proportion of people between 15-59 years and 60 years or more will increase in Yemen, reaching 57.3% and 5.7% respectively. In contrast, in Italy, the population with 15-59 years will decrease to 46.2%, while people with 60 years or more will grow to 42.3%.

Overall, both countries are expected to see an increase in the proportion of elderly citizens by 2050, although Yemen will remain substantially younger than Italy.""",
        "keyVocabJson": json.dumps([
            {"en": "demographic shift", "vi": "sự chuyển dịch nhân khẩu"},
            {"en": "inhabitants", "vi": "cư dân"}
        ], ensure_ascii=False),
        "examinerNotesVi": "Bài làm của thí sinh đạt Band 6.0 với bố cục rõ ràng, báo cáo đầy đủ thông tin chi tiết và dùng tốt các từ nối chỉ sự đối lập.",
        "bandEstimate": "6.0",
        "source": "cambridge-ielts-09-scan",
        "license": None,
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Writing Task 1 Sample Answer, page 166"
    },
    {
        "id": "cam09-academic-t3-wm2",
        "task": "2",
        "track": "academic",
        "topic": "Improving public health: sports facilities vs other measures",
        "chartType": None,
        "chartDescription": None,
        "prompt": writing_topics_t3[1]["prompt"],
        "modelAnswer": """A problem of modern societies is the declining level of health in the general population, with conflicting views on how to tackle this worrying trend. One possible solution is to provide more sports facilities to encourage a more active lifestyle.

Advocates of this believe that today's sedentary lifestyle and stressful working conditions mean that physical activity is no longer part of either our work or our leisure time. If there were easy-to-reach local sports centres, we would be more likely to make exercise a regular part of our lives, rather than just collapsing in front of a screen every evening. The variety of sports that could be offered would cater for all ages, levels of fitness and interests: those with painful memories of PE at school might be happier in the swimming pool than on the football pitch.

However, there may be better ways of tackling this problem. Interest in sport is not universal, and additional facilities might simply attract the already fit, not those who most need them. Physical activity could be encouraged relatively cheaply, for example by installing exercise equipment in parks, as my local council has done. This has the added benefit that parents and children often use them together just for fun, which develops a positive attitude to exercise at an early age.

As well as physical activity, high tax penalties could be imposed on high-fat food products, tobacco and alcohol, as excessive consumption of any of these contributes to poor health. Even improving public transport would help: it takes longer to walk to the bus stop than to the car.

In my opinion, focusing on sports facilities is too narrow an approach and would not have the desired results. People should be encouraged not only to be more physically active but also to adopt a healthier lifestyle in general.""",
        "keyVocabJson": json.dumps([
            {"en": "sedentary lifestyle", "vi": "lối sống ít vận động"},
            {"en": "tax penalties", "vi": "thuế tiêu thụ đặc biệt"},
            {"en": "cater for all ages", "vi": "phục vụ mọi độ tuổi"}
        ], ensure_ascii=False),
        "examinerNotesVi": "Bài mẫu chuẩn mực của giám khảo (Band 9.0) với văn phong học thuật, lập luận sắc bén và cấu trúc thảo luận cân đối tuyệt đối.",
        "bandEstimate": "9.0",
        "source": "cambridge-ielts-09-scan",
        "license": None,
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Writing Task 2 Model Answer, page 167"
    }
]

# Speaking Topics
speaking_topics_t3 = [
    {
        "id": "cam09-academic-t3-s1",
        "part": 1,
        "track": "academic",
        "topic": "Telephoning",
        "topicVi": "Gọi điện thoại",
        "question": "How often do you make telephone calls? [Why/Why not?] Who do you spend most time talking to on the telephone? [Why?] When do you think you'll next make a telephone call? [Why?] Do you sometimes prefer to send a text message instead of telephoning? [Why/Why not?]",
        "ideasJson": json.dumps([
            "Daily communication with family and colleagues",
            "Texting for brief updates vs calls for urgent or nuanced discussions",
            "Preference for messaging to avoid interrupting others"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([
            "Has the way you use phones changed over the past few years?"
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Speaking Part 1, page 78"
    },
    {
        "id": "cam09-academic-t3-s2",
        "part": 2,
        "track": "academic",
        "topic": "A memorable journey",
        "topicVi": "Một chuyến đi đáng nhớ",
        "question": "Describe a journey [e.g. by car, plane, boat] that you remember well.\n\nYou should say:\n- where you went\n- how you travelled\n- why you went on the journey\nand explain why you remember this journey well.",
        "ideasJson": json.dumps([
            "A scenic train journey through mountain passes or coastal rail",
            "Travelling with companions for a special celebration or reunion",
            "Unexpected incidents or breathtaking vistas making it unforgettable"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([
            "Do you prefer travelling alone or with friends?"
        ], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Speaking Part 2, page 78"
    },
    {
        "id": "cam09-academic-t3-s3",
        "part": 3,
        "track": "academic",
        "topic": "Reasons for daily travel & Benefits of international travel",
        "topicVi": "Lý do di chuyển hàng ngày & Lợi ích du lịch quốc tế",
        "question": "Reasons for daily travel:\n- Why do people need to travel every day?\n- What problems can people have when they are on their daily journey, for example to work or school? Why is this?\n- Some people say that daily journeys like these will not be so common in the future. Do you agree or disagree? Why?\n\nBenefits of international travel:\n- What do you think people can learn from travelling to other countries? Why?\n- Can travel make a positive difference to the economy of a country? How?\n- Do you think a society can benefit if its members have experience of travelling to other countries? In what ways?",
        "ideasJson": json.dumps([
            "Commuting challenges: traffic congestion, delays, carbon footprint",
            "Remote working potentially reducing daily physical transit",
            "Cultural tolerance, economic stimulation from tourism and international exposure"
        ], ensure_ascii=False),
        "followUpQuestions": json.dumps([], ensure_ascii=False),
        "source": "cambridge-ielts-09-scan",
        "verified": True,
        "sourceRef": "Cambridge IELTS 9, Test 3, Speaking Part 3, page 78"
    }
]

# Assemble Test 3 JSON
test_3_data = {
    "book": "cambridge-ielts-09",
    "test": 3,
    "track": "academic",
    "official_keys": {
        "listening": {str(k): v for k, v in OFFICIAL_KEYS_T3_L.items()},
        "reading": {str(k): v for k, v in OFFICIAL_KEYS_T3_R.items()}
    },
    "listening_sections": [
        {
            "id": "cam09-academic-t3-l1",
            "section": "1",
            "track": "academic",
            "cefrLevel": "A2",
            "difficultyBand": 5.5,
            "title": "Greek Island Holidays (Accommodation & Insurance)",
            "titleVi": "Kỳ nghỉ đảo Hy Lạp (Chỗ ở và Bảo hiểm)",
            "scriptJson": script_t3_s1,
            "questionsJson": json.dumps(t3_l1_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 1, Answer Key page 156"
        },
        {
            "id": "cam09-academic-t3-l2",
            "section": "2",
            "track": "academic",
            "cefrLevel": "B1",
            "difficultyBand": 6.0,
            "title": "Winridge Forest Railway Park",
            "titleVi": "Công viên Đường sắt Rừng Winridge",
            "scriptJson": script_t3_s2,
            "questionsJson": json.dumps(t3_l2_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 2, Answer Key page 156"
        },
        {
            "id": "cam09-academic-t3-l3",
            "section": "3",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.5,
            "title": "Study Skills Tutorial - Caroline Benning",
            "titleVi": "Hướng dẫn kỹ năng học tập - Caroline Benning",
            "scriptJson": script_t3_s3,
            "questionsJson": json.dumps(t3_l3_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 3, Answer Key page 156"
        },
        {
            "id": "cam09-academic-t3-l4",
            "section": "4",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.5,
            "title": "The Underground House (Design & Environmental Features)",
            "titleVi": "Ngôi nhà dưới lòng đất (Thiết kế và Đặc tính môi trường)",
            "scriptJson": script_t3_s4,
            "questionsJson": json.dumps(t3_l4_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Listening Section 4, Answer Key page 156"
        }
    ],
    "reading_passages": [
        {
            "id": "cam09-academic-t3-r1",
            "section": "1",
            "track": "academic",
            "cefrLevel": "B2",
            "difficultyBand": 6.5,
            "title": "Attitudes to language",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p1_text,
            "questionsJson": json.dumps(t3_r1_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 1, Answer Key page 157"
        },
        {
            "id": "cam09-academic-t3-r2",
            "section": "2",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.0,
            "title": "Tidal Power",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p2_text,
            "questionsJson": json.dumps(t3_r2_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 2, Answer Key page 157"
        },
        {
            "id": "cam09-academic-t3-r3",
            "section": "3",
            "track": "academic",
            "cefrLevel": "C1",
            "difficultyBand": 7.5,
            "title": "Information theory - the big idea",
            "module": "academic",
            "notes": None,
            "sourceUrl": None,
            "passageJson": p3_text,
            "questionsJson": json.dumps(t3_r3_questions, ensure_ascii=False),
            "source": "cambridge-ielts-09-scan",
            "license": None,
            "verified": True,
            "sourceRef": "Cambridge IELTS 9, Test 3, Reading Passage 3, Answer Key page 157"
        }
    ],
    "writing_topics": writing_topics_t3,
    "writing_models": writing_models_t3,
    "speaking_topics": speaking_topics_t3
}

output_path = OUTPUT_DIR / "cam09-academic-test-3-data.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(test_3_data, f, indent=2, ensure_ascii=False)

print(f"[SUCCESS] Wrote Test 3 data to {output_path}")
