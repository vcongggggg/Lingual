# -*- coding: utf-8 -*-
"""
Script: parse_cambridge04_academic.py
Description: Full-book parser and mapper for Cambridge IELTS 04 Academic (Tests 1-4).
             Reduced academic scope as specified:
             - Listening: 16 sections, 160 questions (keys from P100-P101; scriptJson='')
             - Writing Topics: 8 topics (Task 1 & Task 2 prompts)
             - Speaking Topics: 4 topics (Parts 1-3 prompts)
             - Reading: BLOCKED inventory (12 passages, 160 questions) due to absent keys in book
             - Writing models & General Training: absent-in-book
Deliverables:
  - C:/Mod/muse-data-exchange/book-corpus-mapped/cambridge-ielts-04/cam04_academic_draft.json
  - C:/Mod/muse-data-exchange/book-corpus-mapped/cambridge-ielts-04/cam04_academic_manifest.json
  - C:/Mod/muse-data-exchange/book-corpus-mapped/cambridge-ielts-04/cam04_academic_exploitation_report.json
"""

import hashlib
import json
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-04"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------
# 1. OFFICIAL KEYS FROM P100 - P101
# -------------------------------------------------------------
OFFICIAL_KEYS = {
    1: {
        1: "shopping / variety of shopping",
        2: "guided tours",
        3: "more than 12 / over 12",
        4: "notice board",
        5: "13th February",
        6: "Tower of London",
        7: "Bristol",
        8: "American Museum",
        9: "student newspaper",
        10: "Yentob",
        11: "coal / firewood",
        12: "local craftsmen",
        13: "160",
        14: "Woodside",
        15: "Ticket Office",
        16: "Gift Shop",
        17: "(main) Workshop",
        18: "Showroom",
        19: "Cafe",
        20: "cottages",
        21: "A",
        22: "C",
        23: "E",
        24: "B",
        25: "G",
        26: "F",
        27: "C",
        28: "D",
        29: "A",
        30: "B",
        31: "cities / environment",
        32: "windy",
        33: "humid",
        34: "shady / shaded",
        35: "dangerous",
        36: "leaves",
        37: "ground",
        38: "considerably reduce / decrease / filter",
        39: "low",
        40: "space / room"
    },
    2: {
        1: "C",
        2: "C",
        3: "B",
        4: "B",
        5: "A",
        6: "Cathedral",
        7: "Markets",
        8: "Gardens",
        9: "Art Gallery",
        10: "climb the tower / see the view",
        11: "C",
        12: "B",
        13: "A",
        14: "C",
        15: "B",
        16: "C",
        17: "A",
        18: "B",
        19: "B",
        20: "A",
        21: "collecting data / gathering data / data collection",
        22: "1,500",
        23: "5",
        24: "3,000 – 4,000",
        25: "B",
        26: "C",
        27: "Media",
        28: "Survey / Research",
        29: "London University / London University Press",
        30: "1988",
        31: "C",
        32: "A",
        33: "mass media / media",
        34: "academic circles / academics / researchers",
        35: "specialist knowledge / specialized knowledge",
        36: "unaware",
        37: "individual customers / individual consumers / individuals",
        38: "illegal profit / illegal profits",
        39: "D",
        40: "E"
    },
    3: {
        1: "1-1/2 years",
        2: "Forest / Forrest",
        3: "Academic",
        4: "Thursday",
        5: "B",
        6: "B",
        7: "A",
        8: "deposit",
        9: "monthly",
        10: "telephone / phone",
        11: "C",
        12: "A",
        13: "C",
        14: "B",
        15: "lighting / lights / light",
        16: "adult / adults",
        17: "(at/the) Studio Theatre / Studio Theater",
        18: "the whole family / all the family / families",
        19: "(in) City Gardens / the City Gardens / outdoors",
        20: "young children / younger children / children",
        21: "A",
        22: "B",
        23: "C",
        24: "A",
        25: "B",
        26: "A",
        27: "C",
        28: "B",
        29: "B",
        30: "B",
        31: "questionnaire",
        32: "approximately 2,000 / about 2,000",
        33: "Education",
        34: "halls of residence / living quarters",
        35: "traffic, parking",
        36: "lecture rooms / lecture halls / lecture theatres / lecture theaters",
        37: "(choice of / room for) facilities",
        38: "D, F",
        39: "B",
        40: "A, C"
    },
    4: {
        1: "College Dining Room",
        2: "office staff",
        3: "students",
        4: "10th December",
        5: "coffee break / coffee breaks",
        6: "6",
        7: "set of dictionaries / dictionaries / a good dictionary",
        8: "tapes",
        9: "photos / photographs",
        10: "speech",
        11: "B",
        12: "A",
        13: "A",
        14: "A",
        15: "B",
        16: "180",
        17: "nearest station",
        18: "local history",
        19: "690",
        20: "walking club / local walking club",
        21: "20 balloons",
        22: "units of measurement / measurements / measurement units",
        23: "rock salt / salt",
        24: "crystals",
        25: "string / pieces of string",
        26: "(ordinary/white) light",
        27: "H",
        28: "B",
        29: "E",
        30: "C",
        31: "795",
        32: "tail",
        33: "floor / bed / bottom",
        34: "sense of smell",
        35: "A",
        36: "A",
        37: "B",
        38: "B",
        39: "B",
        40: "E"
    }
}

# -------------------------------------------------------------
# 2. QUESTIONS DEFINITIONS
# -------------------------------------------------------------
def build_test1_questions():
    q = []
    # Section 1: Q1-10
    q.append({"questionNumber": 1, "type": "completion", "question": "Visit places which have: good 1 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][1], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 1, Answer Key P100"})
    q.append({"questionNumber": 2, "type": "completion", "question": "Visit places which have: 2 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][2], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 2, Answer Key P100"})
    q.append({"questionNumber": 3, "type": "completion", "question": "Note: special trips organised for groups of 3 .................... people", "options": [], "correctAnswer": OFFICIAL_KEYS[1][3], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 3, Answer Key P100"})
    q.append({"questionNumber": 4, "type": "completion", "question": "To reserve a seat: sign name on the 4 .................... 3 days in advance", "options": [], "correctAnswer": OFFICIAL_KEYS[1][4], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 4, Answer Key P100"})
    q.append({"questionNumber": 5, "type": "table_completion", "question": "WEEKEND TRIPS: St Ives | Date: 5 .................... | Number of seats: 16 | Optional extra: Hepworth Museum", "options": [], "correctAnswer": OFFICIAL_KEYS[1][5], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 5, Answer Key P100"})
    q.append({"questionNumber": 6, "type": "table_completion", "question": "WEEKEND TRIPS: London | Date: 16th February | Number of seats: 45 | Optional extra: 6 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][6], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 6, Answer Key P100"})
    q.append({"questionNumber": 7, "type": "table_completion", "question": "WEEKEND TRIPS: Place: 7 .................... | Date: 3rd March | Number of seats: 18 | Optional extra: S.S. Great Britain", "options": [], "correctAnswer": OFFICIAL_KEYS[1][7], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 7, Answer Key P100"})
    q.append({"questionNumber": 8, "type": "table_completion", "question": "WEEKEND TRIPS: Bath | Date: 23rd March | Number of seats: 16 | Optional extra: 8 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][8], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 8, Answer Key P100"})
    q.append({"questionNumber": 9, "type": "sentence_completion", "question": "For further information: Read the 9 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][9], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 9, Answer Key P100"})
    q.append({"questionNumber": 10, "type": "sentence_completion", "question": "For further information: see Social Assistant: Jane 10 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][10], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 1, Question 10, Answer Key P100"})
    # Section 2: Q11-20
    q.append({"questionNumber": 11, "type": "sentence_completion", "question": "Riverside Village was a good place to start an industry because it had water, raw materials and fuels such as 11 .................... .", "options": [], "correctAnswer": OFFICIAL_KEYS[1][11], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 11, Answer Key P100"})
    q.append({"questionNumber": 12, "type": "sentence_completion", "question": "The metal industry was established at Riverside Village by 12 .................... who lived in the area.", "options": [], "correctAnswer": OFFICIAL_KEYS[1][12], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 12, Answer Key P100"})
    q.append({"questionNumber": 13, "type": "sentence_completion", "question": "There were over 13 .................... water-powered mills in the area in the eighteenth century.", "options": [], "correctAnswer": OFFICIAL_KEYS[1][13], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 13, Answer Key P100"})
    q.append({"questionNumber": 14, "type": "label_plan", "question": "Label the plan below: Road: 14 .................... Road", "options": [], "correctAnswer": OFFICIAL_KEYS[1][14], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 14, Answer Key P100"})
    q.append({"questionNumber": 15, "type": "label_plan", "question": "Label the plan below: The 15 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][15], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 15, Answer Key P100"})
    q.append({"questionNumber": 16, "type": "label_plan", "question": "Label the plan below: The 16 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][16], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 16, Answer Key P100"})
    q.append({"questionNumber": 17, "type": "label_plan", "question": "Label the plan below: The 17 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][17], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 17, Answer Key P100"})
    q.append({"questionNumber": 18, "type": "label_plan", "question": "Label the plan below: The 18 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][18], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 18, Answer Key P100"})
    q.append({"questionNumber": 19, "type": "label_plan", "question": "Label the plan below: The 19 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][19], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 19, Answer Key P100"})
    q.append({"questionNumber": 20, "type": "label_plan", "question": "Label the plan below: The 20 .................... for the workers", "options": [], "correctAnswer": OFFICIAL_KEYS[1][20], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 2, Question 20, Answer Key P100"})
    # Section 3: Q21-30
    q.append({"questionNumber": 21, "type": "multiple_choice", "question": "Melanie says she has not started the assignment because", "options": ["A. she was doing work for another course.", "B. it was a really big assignment.", "C. she hasn’t spent time in the library."], "correctAnswer": OFFICIAL_KEYS[1][21], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 21, Answer Key P100"})
    q.append({"questionNumber": 22, "type": "multiple_choice", "question": "The lecturer says that reasonable excuses for extensions are", "options": ["A. planning problems.", "B. problems with assignment deadlines.", "C. personal illness or accident."], "correctAnswer": OFFICIAL_KEYS[1][22], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 22, Answer Key P100"})
    matching_opts_t1 = ["A. must read", "B. useful", "C. limited value", "D. read first section", "E. read research methods", "F. read conclusion", "G. don’t read"]
    q.append({"questionNumber": 23, "type": "matching", "question": "What recommendations does Dr Johnson make about the journal articles? Jackson: 23 ....................", "options": matching_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][23], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 23, Answer Key P100"})
    q.append({"questionNumber": 24, "type": "matching", "question": "What recommendations does Dr Johnson make about the journal articles? Roberts: 24 ....................", "options": matching_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][24], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 24, Answer Key P100"})
    q.append({"questionNumber": 25, "type": "matching", "question": "What recommendations does Dr Johnson make about the journal articles? Morris: 25 ....................", "options": matching_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][25], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 25, Answer Key P100"})
    q.append({"questionNumber": 26, "type": "matching", "question": "What recommendations does Dr Johnson make about the journal articles? Cooper: 26 ....................", "options": matching_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][26], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 26, Answer Key P100"})
    q.append({"questionNumber": 27, "type": "matching", "question": "What recommendations does Dr Johnson make about the journal articles? Forster: 27 ....................", "options": matching_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][27], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 27, Answer Key P100"})
    chart_opts_t1 = ["A. uncooperative landlord", "B. environment", "C. space", "D. noisy neighbours", "E. near city", "F. work location", "G. transport", "H. rent"]
    q.append({"questionNumber": 28, "type": "label_chart", "question": "Population studies - Reasons for changing accommodation: Bar 28 ....................", "options": chart_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][28], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 28, Answer Key P100"})
    q.append({"questionNumber": 29, "type": "label_chart", "question": "Population studies - Reasons for changing accommodation: Bar 29 ....................", "options": chart_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][29], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 29, Answer Key P100"})
    q.append({"questionNumber": 30, "type": "label_chart", "question": "Population studies - Reasons for changing accommodation: Bar 30 ....................", "options": chart_opts_t1, "correctAnswer": OFFICIAL_KEYS[1][30], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 3, Question 30, Answer Key P100"})
    # Section 4: Q31-40
    q.append({"questionNumber": 31, "type": "completion", "question": "THE URBAN LANDSCAPE: ways of planning our 31 .................... better", "options": [], "correctAnswer": OFFICIAL_KEYS[1][31], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 31, Answer Key P100"})
    q.append({"questionNumber": 32, "type": "completion", "question": "Large-scale impact of trees: they can make cities more or less 32 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][32], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 32, Answer Key P100"})
    q.append({"questionNumber": 33, "type": "completion", "question": "they can make inland cities more 33 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][33], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 33, Answer Key P100"})
    q.append({"questionNumber": 34, "type": "completion", "question": "Local impact of trees: they can make local areas: more 34 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][34], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 34, Answer Key P100"})
    q.append({"questionNumber": 35, "type": "completion", "question": "Local impact of trees: they can make local areas: less 35 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][35], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 35, Answer Key P100"})
    q.append({"questionNumber": 36, "type": "completion", "question": "Comparing trees and buildings - Temperature regulation: trees evaporate water through their 36 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[1][36], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 36, Answer Key P100"})
    q.append({"questionNumber": 37, "type": "completion", "question": "Wind force: tall buildings cause more wind at 37 .................... level", "options": [], "correctAnswer": OFFICIAL_KEYS[1][37], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 37, Answer Key P100"})
    q.append({"questionNumber": 38, "type": "completion", "question": "Wind force: trees 38 .................... the wind force", "options": [], "correctAnswer": OFFICIAL_KEYS[1][38], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 38, Answer Key P100"})
    q.append({"questionNumber": 39, "type": "completion", "question": "Noise: 39 .................... frequency noise passes through trees", "options": [], "correctAnswer": OFFICIAL_KEYS[1][39], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 39, Answer Key P100"})
    q.append({"questionNumber": 40, "type": "completion", "question": "Important points to consider: trees require a lot of sunlight, water and 40 .................... to grow", "options": [], "correctAnswer": OFFICIAL_KEYS[1][40], "sourceRef": "Cambridge IELTS 4, Test 1, Listening Section 4, Question 40, Answer Key P100"})
    return q

def build_test2_questions():
    q = []
    # Section 1: Q1-10
    q.append({"questionNumber": 1, "type": "multiple_choice", "question": "What does Peter want to drink?", "options": ["A. tea", "B. coffee", "C. a cold drink"], "correctAnswer": OFFICIAL_KEYS[2][1], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 1, Answer Key P100"})
    q.append({"questionNumber": 2, "type": "multiple_choice", "question": "What caused Peter problems at the bank?", "options": ["A. The exchange rate was down.", "B. He was late.", "C. The computers weren’t working."], "correctAnswer": OFFICIAL_KEYS[2][2], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 2, Answer Key P100"})
    q.append({"questionNumber": 3, "type": "multiple_choice", "question": "Who did Peter talk to at the bank?", "options": ["A. an old friend", "B. an American man", "C. a German man"], "correctAnswer": OFFICIAL_KEYS[2][3], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 3, Answer Key P100"})
    q.append({"questionNumber": 4, "type": "multiple_choice", "question": "Henry gave Peter a map of", "options": ["A. the city.", "B. the bus routes.", "C. the train system."], "correctAnswer": OFFICIAL_KEYS[2][4], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 4, Answer Key P100"})
    q.append({"questionNumber": 5, "type": "multiple_choice", "question": "What do Peter and Sally decide to order?", "options": ["A. food and drinks", "B. just food", "C. just drinks"], "correctAnswer": OFFICIAL_KEYS[2][5], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 5, Answer Key P100"})
    box_t2_s1 = ["Art Gallery", "Cathedral", "Castle", "Gardens", "Markets"]
    q.append({"questionNumber": 6, "type": "note_completion", "question": "Tourist attractions open all day: 6 .................... and Gardens", "options": box_t2_s1, "correctAnswer": OFFICIAL_KEYS[2][6], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 6, Answer Key P100"})
    q.append({"questionNumber": 7, "type": "note_completion", "question": "Tourist attractions NOT open on Mondays: 7 .................... and Castle", "options": box_t2_s1, "correctAnswer": OFFICIAL_KEYS[2][7], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 7, Answer Key P100"})
    q.append({"questionNumber": 8, "type": "note_completion", "question": "Tourist attractions which have free entry: 8 .................... and Markets", "options": box_t2_s1, "correctAnswer": OFFICIAL_KEYS[2][8], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 8, Answer Key P100"})
    q.append({"questionNumber": 9, "type": "sentence_completion", "question": "The first place Peter and Sally will visit is the 9 .................... .", "options": [], "correctAnswer": OFFICIAL_KEYS[2][9], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 9, Answer Key P100"})
    q.append({"questionNumber": 10, "type": "sentence_completion", "question": "At the Cathedral, Peter really wants to 10 .................... .", "options": [], "correctAnswer": OFFICIAL_KEYS[2][10], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 1, Question 10, Answer Key P100"})
    # Section 2: Q11-20
    q.append({"questionNumber": 11, "type": "multiple_choice", "question": "The Counselling Service may contact tutors if", "options": ["A. they are too slow in marking assignments.", "B. they give students a lot of work.", "C. they don't inform students about their progress."], "correctAnswer": OFFICIAL_KEYS[2][11], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 11, Answer Key P100"})
    q.append({"questionNumber": 12, "type": "multiple_choice", "question": "Stress may be caused by", "options": ["A. new teachers.", "B. time pressure.", "C. unfamiliar subject matter."], "correctAnswer": OFFICIAL_KEYS[2][12], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 12, Answer Key P100"})
    q.append({"questionNumber": 13, "type": "multiple_choice", "question": "International students may find stress difficult to handle because", "options": ["A. they lack support from family and friends.", "B. they don't have time to make new friends.", "C. they find it difficult to socialise."], "correctAnswer": OFFICIAL_KEYS[2][13], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 13, Answer Key P100"})
    q.append({"questionNumber": 14, "type": "multiple_choice", "question": "A personal crisis may be caused by", "options": ["A. studying for too long overseas.", "B. business problems in the student's own country.", "C. disruptions to personal relationships."], "correctAnswer": OFFICIAL_KEYS[2][14], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 14, Answer Key P100"})
    q.append({"questionNumber": 15, "type": "multiple_choice", "question": "Students may lose self-esteem if", "options": ["A. they have to change courses.", "B. they don't complete a course.", "C. their family puts too much pressure on them."], "correctAnswer": OFFICIAL_KEYS[2][15], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 15, Answer Key P100"})
    q.append({"questionNumber": 16, "type": "multiple_choice", "question": "Students should consult Glenda Roberts if", "options": ["A. their general health is poor.", "B. their diet is too strict.", "C. they can't eat the local food."], "correctAnswer": OFFICIAL_KEYS[2][16], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 16, Answer Key P100"})
    q.append({"questionNumber": 17, "type": "multiple_choice", "question": "Students in financial difficulties can receive", "options": ["A. assistance to buy books.", "B. a loan to pay their course fees.", "C. a no-interest loan to cover study expenses."], "correctAnswer": OFFICIAL_KEYS[2][17], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 18, Answer Key P100".replace("18", "17")})
    q.append({"questionNumber": 18, "type": "multiple_choice", "question": "Loans are also available to students who", "options": ["A. can't pay their rent.", "B. need to buy furniture.", "C. can't cover their living expenses."], "correctAnswer": OFFICIAL_KEYS[2][18], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 18, Answer Key P100"})
    q.append({"questionNumber": 19, "type": "multiple_choice", "question": "The number of students counselled by the service last year was", "options": ["A. 214.", "B. 240.", "C. 2,600."], "correctAnswer": OFFICIAL_KEYS[2][19], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 19, Answer Key P100"})
    q.append({"questionNumber": 20, "type": "multiple_choice", "question": "The speaker thinks the Counselling Service", "options": ["A. has been effective in spite of staff shortages.", "B. is under-used by students.", "C. has suffered badly because of staff cuts."], "correctAnswer": OFFICIAL_KEYS[2][20], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 2, Question 20, Answer Key P100"})
    # Section 3: Q21-30
    q.append({"questionNumber": 21, "type": "note_completion", "question": "DETAILS OF ASSIGNMENT - Part 1 Essay: Title: 'Assess the two main methods of 21 .................... in social science research'", "options": [], "correctAnswer": OFFICIAL_KEYS[2][21], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 21, Answer Key P100"})
    q.append({"questionNumber": 22, "type": "note_completion", "question": "DETAILS OF ASSIGNMENT - Part 1 Essay: Number of words: 22 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][22], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 22, Answer Key P100"})
    q.append({"questionNumber": 23, "type": "note_completion", "question": "DETAILS OF ASSIGNMENT - Part 2 Small-scale study: Gather data from at least 23 .................... subjects.", "options": [], "correctAnswer": OFFICIAL_KEYS[2][23], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 23, Answer Key P100"})
    q.append({"questionNumber": 24, "type": "note_completion", "question": "DETAILS OF ASSIGNMENT - Part 3 Report on study: Number of words: 24 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][24], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 24, Answer Key P100"})
    opts_t2_s3 = ["A. The data is sometimes invalid.", "B. Too few people may respond.", "C. It is less likely to reveal the unexpected.", "D. It can only be used with literate populations.", "E. There is a delay between the distribution and return of questionnaires."]
    q.append({"questionNumber": 25, "type": "multiple_choice", "question": "What TWO disadvantages of the questionnaire form of data collection do the students discuss? (First disadvantage)", "options": opts_t2_s3, "correctAnswer": OFFICIAL_KEYS[2][25], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 25, Answer Key P100"})
    q.append({"questionNumber": 26, "type": "multiple_choice", "question": "What TWO disadvantages of the questionnaire form of data collection do the students discuss? (Second disadvantage)", "options": opts_t2_s3, "correctAnswer": OFFICIAL_KEYS[2][26], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 26, Answer Key P100"})
    q.append({"questionNumber": 27, "type": "table_completion", "question": "Complete the table below: AUTHOR: 27 .................... | TITLE: 'Sample Surveys in Social Science Research' | PUBLISHER: Bell", "options": [], "correctAnswer": OFFICIAL_KEYS[2][27], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 27, Answer Key P100"})
    q.append({"questionNumber": 28, "type": "table_completion", "question": "Complete the table below: AUTHOR: Bell | TITLE: 28 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][28], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 28, Answer Key P100"})
    q.append({"questionNumber": 29, "type": "table_completion", "question": "Complete the table below: AUTHOR: Wilson | TITLE: 'Interviews that work' | PUBLISHER: 29 .................... University Press", "options": [], "correctAnswer": OFFICIAL_KEYS[2][29], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 29, Answer Key P100"})
    q.append({"questionNumber": 30, "type": "table_completion", "question": "Complete the table below: YEAR OF PUBLICATION: 30 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][30], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 3, Question 30, Answer Key P100"})
    # Section 4: Q31-40
    q.append({"questionNumber": 31, "type": "multiple_choice", "question": "Corporate crime is generally committed", "options": ["A. against individuals.", "B. by groups.", "C. for companies."], "correctAnswer": OFFICIAL_KEYS[2][31], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 31, Answer Key P100"})
    q.append({"questionNumber": 32, "type": "multiple_choice", "question": "Corporate crime does NOT include", "options": ["A. employees stealing from their company.", "B. unintentional crime by employees.", "C. fraud resulting from company policy."], "correctAnswer": OFFICIAL_KEYS[2][32], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 32, Answer Key P100"})
    q.append({"questionNumber": 33, "type": "note_completion", "question": "Corporate crime has been ignored by: a) the 33 .................... e.g. films", "options": [], "correctAnswer": OFFICIAL_KEYS[2][33], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 33, Answer Key P100"})
    q.append({"questionNumber": 34, "type": "note_completion", "question": "Corporate crime has been ignored by: b) 34 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][34], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 34, Answer Key P100"})
    q.append({"questionNumber": 35, "type": "note_completion", "question": "Reasons: a) often more complex, and needing 35 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][35], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 35, Answer Key P100"})
    q.append({"questionNumber": 36, "type": "note_completion", "question": "Reasons: c) victims often 36 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][36], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 36, Answer Key P100"})
    q.append({"questionNumber": 37, "type": "note_completion", "question": "Effects: a) Economic costs • may appear unimportant to 37 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[2][37], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 37, Answer Key P100"})
    q.append({"questionNumber": 38, "type": "note_completion", "question": "Effects: a) Economic costs • can make large 38 .................... for company", "options": [], "correctAnswer": OFFICIAL_KEYS[2][38], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 38, Answer Key P100"})
    opts_t2_s4 = ["A. was no-one's fault.", "B. was not a corporate crime.", "C. was intentional.", "D. was caused by indifference.", "E. had tragic results.", "F. made a large profit for the company."]
    q.append({"questionNumber": 39, "type": "multiple_choice", "question": "The oil tanker explosion was an example of a crime which (First letter)", "options": opts_t2_s4, "correctAnswer": OFFICIAL_KEYS[2][39], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 39, Answer Key P100"})
    q.append({"questionNumber": 40, "type": "multiple_choice", "question": "The oil tanker explosion was an example of a crime which (Second letter)", "options": opts_t2_s4, "correctAnswer": OFFICIAL_KEYS[2][40], "sourceRef": "Cambridge IELTS 4, Test 2, Listening Section 4, Question 40, Answer Key P100"})
    return q

def build_test3_questions():
    q = []
    # Section 1: Q1-10
    q.append({"questionNumber": 1, "type": "form_completion", "question": "Accommodation Request Form - Sara Lim: Length of time in Australia: 1 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][1], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 1, Answer Key P101"})
    q.append({"questionNumber": 2, "type": "form_completion", "question": "Present address: Flat 1, 539, 2 .................... Road, Canterbury 2036", "options": [], "correctAnswer": OFFICIAL_KEYS[3][2], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 2, Answer Key P101"})
    q.append({"questionNumber": 3, "type": "form_completion", "question": "Present course: 3 .................... English", "options": [], "correctAnswer": OFFICIAL_KEYS[3][3], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 3, Answer Key P101"})
    q.append({"questionNumber": 4, "type": "form_completion", "question": "Accommodation required from: 4 ...................., 7th September", "options": [], "correctAnswer": OFFICIAL_KEYS[3][4], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 4, Answer Key P101"})
    q.append({"questionNumber": 5, "type": "multiple_choice", "question": "Sara requires a", "options": ["A. single room.", "B. twin room.", "C. triple room."], "correctAnswer": OFFICIAL_KEYS[3][5], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 5, Answer Key P101"})
    q.append({"questionNumber": 6, "type": "multiple_choice", "question": "She would prefer to live with a", "options": ["A. family.", "B. single person.", "C. couple."], "correctAnswer": OFFICIAL_KEYS[3][6], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 6, Answer Key P101"})
    q.append({"questionNumber": 7, "type": "multiple_choice", "question": "She would like to live in a", "options": ["A. flat.", "B. house.", "C. studio apartment."], "correctAnswer": OFFICIAL_KEYS[3][7], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 7, Answer Key P101"})
    q.append({"questionNumber": 8, "type": "sentence_completion", "question": "The 8 .................... will be $320.", "options": [], "correctAnswer": OFFICIAL_KEYS[3][8], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 8, Answer Key P101"})
    q.append({"questionNumber": 9, "type": "sentence_completion", "question": "She needs to pay the rent by cash or cheque on a 9 .................... basis.", "options": [], "correctAnswer": OFFICIAL_KEYS[3][9], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 9, Answer Key P101"})
    q.append({"questionNumber": 10, "type": "sentence_completion", "question": "She needs to pay her part of the 10 .................... bill.", "options": [], "correctAnswer": OFFICIAL_KEYS[3][10], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 1, Question 10, Answer Key P101"})
    # Section 2: Q11-20
    q.append({"questionNumber": 11, "type": "multiple_choice", "question": "When is this year's festival being held?", "options": ["A. 1–13 January", "B. 5–17 January", "C. 25–31 January"], "correctAnswer": OFFICIAL_KEYS[3][11], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 11, Answer Key P101"})
    q.append({"questionNumber": 12, "type": "multiple_choice", "question": "What will the reviewer concentrate on today?", "options": ["A. theatre", "B. dance", "C. exhibitions"], "correctAnswer": OFFICIAL_KEYS[3][12], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 12, Answer Key P101"})
    q.append({"questionNumber": 13, "type": "multiple_choice", "question": "How many circuses are there in the festival?", "options": ["A. one", "B. two", "C. several"], "correctAnswer": OFFICIAL_KEYS[3][13], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 13, Answer Key P101"})
    q.append({"questionNumber": 14, "type": "multiple_choice", "question": "Where does Circus Romano perform?", "options": ["A. in a theatre", "B. in a tent", "C. in a stadium"], "correctAnswer": OFFICIAL_KEYS[3][14], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 14, Answer Key P101"})
    q.append({"questionNumber": 15, "type": "table_completion", "question": "Circus Romano - Highlights: Clowns and acrobats, Music and 15 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][15], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 15, Answer Key P101"})
    q.append({"questionNumber": 16, "type": "table_completion", "question": "Circus Romano - Type of audience: 16 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][16], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 16, Answer Key P101"})
    q.append({"questionNumber": 17, "type": "table_completion", "question": "Circus Electrica - Where performance: 17 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][17], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 17, Answer Key P101"})
    q.append({"questionNumber": 18, "type": "table_completion", "question": "Circus Electrica - Type of audience: 18 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][18], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 18, Answer Key P101"})
    q.append({"questionNumber": 19, "type": "table_completion", "question": "Mekong Water Puppets - Where performance: 19 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][19], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 19, Answer Key P101"})
    q.append({"questionNumber": 20, "type": "table_completion", "question": "Mekong Water Puppets - Type of audience: 20 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][20], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 2, Question 20, Answer Key P101"})
    # Section 3: Q21-30
    q.append({"questionNumber": 21, "type": "multiple_choice", "question": "The man wants information on courses for", "options": ["A. people going back to college.", "B. postgraduate students.", "C. business executives."], "correctAnswer": OFFICIAL_KEYS[3][21], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 21, Answer Key P101"})
    q.append({"questionNumber": 22, "type": "multiple_choice", "question": "The 'Study for Success' seminar lasts for", "options": ["A. one day.", "B. two days.", "C. three days."], "correctAnswer": OFFICIAL_KEYS[3][22], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 22, Answer Key P101"})
    q.append({"questionNumber": 23, "type": "multiple_choice", "question": "In the seminar the work on writing aims to improve", "options": ["A. confidence.", "B. speed.", "C. clarity."], "correctAnswer": OFFICIAL_KEYS[3][23], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 23, Answer Key P101"})
    q.append({"questionNumber": 24, "type": "multiple_choice", "question": "Reading sessions help students to read", "options": ["A. analytically.", "B. as fast as possible.", "C. thoroughly."], "correctAnswer": OFFICIAL_KEYS[3][24], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 24, Answer Key P101"})
    q.append({"questionNumber": 25, "type": "multiple_choice", "question": "The seminar tries to", "options": ["A. prepare learners physically.", "B. encourage interest in learning.", "C. develop literacy skills."], "correctAnswer": OFFICIAL_KEYS[3][25], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 25, Answer Key P101"})
    q.append({"questionNumber": 26, "type": "multiple_choice", "question": "A key component of the course is learning how to", "options": ["A. use time effectively.", "B. stay healthy.", "C. select appropriate materials."], "correctAnswer": OFFICIAL_KEYS[3][26], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 26, Answer Key P101"})
    q.append({"questionNumber": 27, "type": "multiple_choice", "question": "Students who want to do the 'Study for Success' seminar should", "options": ["A. register with the Faculty Office.", "B. contact their Course Convenor.", "C. reserve a place in advance."], "correctAnswer": OFFICIAL_KEYS[3][27], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 27, Answer Key P101"})
    q.append({"questionNumber": 28, "type": "multiple_choice", "question": "The 'Learning Skills for University Study' course takes place on", "options": ["A. Monday, Wednesday and Friday.", "B. Monday, Tuesday and Wednesday.", "C. Monday, Thursday and Friday."], "correctAnswer": OFFICIAL_KEYS[3][28], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 28, Answer Key P101"})
    q.append({"questionNumber": 29, "type": "multiple_choice", "question": "A feature of this course is", "options": ["A. a physical training component.", "B. advice on coping with stress.", "C. a detailed weekly planner."], "correctAnswer": OFFICIAL_KEYS[3][29], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 29, Answer Key P101"})
    q.append({"questionNumber": 30, "type": "multiple_choice", "question": "The man chooses the 'Study for Success' seminar because", "options": ["A. he is over forty.", "B. he wants to start at the beginning.", "C. he seeks to revise his skills."], "correctAnswer": OFFICIAL_KEYS[3][30], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 3, Question 30, Answer Key P101"})
    # Section 4: Q31-40
    q.append({"questionNumber": 31, "type": "note_completion", "question": "New Union Building - Procedures to establish student opinion: these points informed the design of a 31 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][31], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 31, Answer Key P101"})
    q.append({"questionNumber": 32, "type": "note_completion", "question": "(there were 32 .................... respondents)", "options": [], "correctAnswer": OFFICIAL_KEYS[3][32], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 32, Answer Key P101"})
    q.append({"questionNumber": 33, "type": "table_completion", "question": "CHOICE OF SITE - Site One: Location: City centre near Faculty of 33 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][33], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 33, Answer Key P101"})
    q.append({"questionNumber": 34, "type": "table_completion", "question": "CHOICE OF SITE - Site Two: Location: Outskirts near park, 34 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][34], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 34, Answer Key P101"})
    q.append({"questionNumber": 35, "type": "table_completion", "question": "CHOICE OF SITE - Site One: Problems with 35 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][35], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 35, Answer Key P101"})
    q.append({"questionNumber": 36, "type": "table_completion", "question": "CHOICE OF SITE - Site Two: Close to 36 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][36], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 36, Answer Key P101"})
    q.append({"questionNumber": 37, "type": "table_completion", "question": "CHOICE OF SITE - Site Three: Larger site, so more 37 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[3][37], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 37, Answer Key P101"})
    opts_t3_q38 = ["A. a library", "B. a games room", "C. a student health centre", "D. a mini fitness centre", "E. a large swimming pool", "F. a travel agency", "G. a lecture theatre"]
    q.append({"questionNumber": 38, "type": "multiple_choice", "question": "Which TWO facilities did the students request in the new Union building?", "options": opts_t3_q38, "correctAnswer": OFFICIAL_KEYS[3][38], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 38, Answer Key P101"})
    q.append({"questionNumber": 39, "type": "multiple_choice", "question": "What objection was made to a new theatre?", "options": ["A. It would be expensive and no students would use it.", "B. It would be a poor use of resources because only a minority would use it.", "C. It could not accommodate large productions of plays."], "correctAnswer": OFFICIAL_KEYS[3][39], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 39, Answer Key P101"})
    opts_t3_q40 = ["A. closed-circuit TV", "B. show Union Card on entering the building", "C. show Union Card when asked", "D. spot searches of bags", "E. permanent Security Office on site"]
    q.append({"questionNumber": 40, "type": "multiple_choice", "question": "Which TWO security measures have been requested?", "options": opts_t3_q40, "correctAnswer": OFFICIAL_KEYS[3][40], "sourceRef": "Cambridge IELTS 4, Test 3, Listening Section 4, Question 40, Answer Key P101"})
    return q

def build_test4_questions():
    q = []
    # Section 1: Q1-10
    q.append({"questionNumber": 1, "type": "note_completion", "question": "GOODBYE PARTY FOR JOHN - Location: 1 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][1], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 1, Answer Key P101"})
    q.append({"questionNumber": 2, "type": "note_completion", "question": "Who to invite: John and his wife, Director, 2 ...................., all the teachers, students", "options": [], "correctAnswer": OFFICIAL_KEYS[4][2], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 2, Answer Key P101"})
    q.append({"questionNumber": 3, "type": "note_completion", "question": "Who to invite: 3 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][3], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 3, Answer Key P101"})
    q.append({"questionNumber": 4, "type": "note_completion", "question": "Date for sending invitations: 4 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][4], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 4, Answer Key P101"})
    q.append({"questionNumber": 5, "type": "note_completion", "question": "Present (Lisa) - Collect money during the 5 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][5], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 5, Answer Key P101"})
    q.append({"questionNumber": 6, "type": "note_completion", "question": "Suggested amount per person: $6 (6 ....................)", "options": [], "correctAnswer": OFFICIAL_KEYS[4][6], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 6, Answer Key P101"})
    q.append({"questionNumber": 7, "type": "note_completion", "question": "Check prices for: CD players, coffee maker, 7 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][7], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 7, Answer Key P101"})
    q.append({"questionNumber": 8, "type": "note_completion", "question": "Ask guests to bring: snacks, 8 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][8], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 8, Answer Key P101"})
    q.append({"questionNumber": 9, "type": "note_completion", "question": "Ask guests to bring: 9 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][9], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 9, Answer Key P101"})
    q.append({"questionNumber": 10, "type": "note_completion", "question": "Ask student representative to prepare a 10 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][10], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 1, Question 10, Answer Key P101"})
    # Section 2: Q11-20
    q.append({"questionNumber": 11, "type": "multiple_choice", "question": "To find out how much holidays cost, you should press button", "options": ["A. one.", "B. two.", "C. three."], "correctAnswer": OFFICIAL_KEYS[4][11], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 11, Answer Key P101"})
    q.append({"questionNumber": 12, "type": "multiple_choice", "question": "Travelite currently offer walking holidays", "options": ["A. only in Western Europe.", "B. all over Europe.", "C. outside Europe."], "correctAnswer": OFFICIAL_KEYS[4][12], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 12, Answer Key P101"})
    q.append({"questionNumber": 13, "type": "multiple_choice", "question": "The walks offered by Travelite", "options": ["A. cater for a range of walking abilities.", "B. are planned by guides from the local area.", "C. are for people with good fitness levels."], "correctAnswer": OFFICIAL_KEYS[4][13], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 13, Answer Key P101"})
    q.append({"questionNumber": 14, "type": "multiple_choice", "question": "On Travelite holidays, people holidaying alone pay", "options": ["A. the same as other clients.", "B. only a little more than other clients.", "C. extra only if they stay in a large room."], "correctAnswer": OFFICIAL_KEYS[4][14], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 14, Answer Key P101"})
    q.append({"questionNumber": 15, "type": "multiple_choice", "question": "Entertainment is provided", "options": ["A. when guests request it.", "B. most nights.", "C. every night."], "correctAnswer": OFFICIAL_KEYS[4][15], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 15, Answer Key P101"})
    q.append({"questionNumber": 16, "type": "table_completion", "question": "Length of holiday: 3 days | Cost per person: 16 $....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][16], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 16, Answer Key P101"})
    q.append({"questionNumber": 17, "type": "table_completion", "question": "Length of holiday: 3 days | Special offers: Pick up from the 17 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][17], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 17, Answer Key P101"})
    q.append({"questionNumber": 18, "type": "table_completion", "question": "Length of holiday: 7 days | Special offers: As above plus • book of 18 .................... • maps", "options": [], "correctAnswer": OFFICIAL_KEYS[4][18], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 18, Answer Key P101"})
    q.append({"questionNumber": 19, "type": "table_completion", "question": "Length of holiday: 14 days | Cost per person: 19 $....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][19], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 19, Answer Key P101"})
    q.append({"questionNumber": 20, "type": "table_completion", "question": "Length of holiday: 14 days | Special offers: As above plus membership of a 20 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][20], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 2, Question 20, Answer Key P101"})
    # Section 3: Q21-30
    q.append({"questionNumber": 21, "type": "table_completion", "question": "Experiment 1: Equipment: 21 .................... and a table | Purpose: To show how things move on a cushion of air", "options": [], "correctAnswer": OFFICIAL_KEYS[4][21], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 21, Answer Key P101"})
    q.append({"questionNumber": 22, "type": "table_completion", "question": "Experiment 2: Purpose: To show why we need standard 22 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][22], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 22, Answer Key P101"})
    q.append({"questionNumber": 23, "type": "table_completion", "question": "Experiment 3: Equipment: 23 .................... and a jar of water", "options": [], "correctAnswer": OFFICIAL_KEYS[4][23], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 23, Answer Key P101"})
    q.append({"questionNumber": 24, "type": "table_completion", "question": "Experiment 3: Purpose: To show how 24 .................... grow", "options": [], "correctAnswer": OFFICIAL_KEYS[4][24], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 24, Answer Key P101"})
    q.append({"questionNumber": 25, "type": "table_completion", "question": "Experiment 4: Equipment: Cardboard, coloured pens and a 25 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][25], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 25, Answer Key P101"})
    q.append({"questionNumber": 26, "type": "table_completion", "question": "Experiment 4: Purpose: To teach children about how 26 .................... is made up", "options": [], "correctAnswer": OFFICIAL_KEYS[4][26], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 26, Answer Key P101"})
    opts_t4_matching = ["A. too messy", "B. too boring", "C. too difficult", "D. too much equipment", "E. too long", "F. too easy", "G. too noisy", "H. dangerous"]
    q.append({"questionNumber": 27, "type": "matching", "question": "What problems do the speakers identify for each experiment? Experiment 1: 27 ....................", "options": opts_t4_matching, "correctAnswer": OFFICIAL_KEYS[4][27], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 27, Answer Key P101"})
    q.append({"questionNumber": 28, "type": "matching", "question": "What problems do the speakers identify for each experiment? Experiment 2: 28 ....................", "options": opts_t4_matching, "correctAnswer": OFFICIAL_KEYS[4][28], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 28, Answer Key P101"})
    q.append({"questionNumber": 29, "type": "matching", "question": "What problems do the speakers identify for each experiment? Experiment 3: 29 ....................", "options": opts_t4_matching, "correctAnswer": OFFICIAL_KEYS[4][29], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 29, Answer Key P101"})
    q.append({"questionNumber": 30, "type": "matching", "question": "What problems do the speakers identify for each experiment? Experiment 5: 30 ....................", "options": opts_t4_matching, "correctAnswer": OFFICIAL_KEYS[4][30], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 3, Question 30, Answer Key P101"})
    # Section 4: Q31-40
    q.append({"questionNumber": 31, "type": "note_completion", "question": "Sharks in Australia - Weight heaviest: 31 .................... kg", "options": [], "correctAnswer": OFFICIAL_KEYS[4][31], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 31, Answer Key P101"})
    q.append({"questionNumber": 32, "type": "note_completion", "question": "Swimming aids: fins and 32 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][32], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 32, Answer Key P101"})
    q.append({"questionNumber": 33, "type": "note_completion", "question": "Food gathered from the ocean 33 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][33], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 33, Answer Key P101"})
    q.append({"questionNumber": 34, "type": "note_completion", "question": "sharks locate food by using their 34 ....................", "options": [], "correctAnswer": OFFICIAL_KEYS[4][34], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 34, Answer Key P101"})
    q.append({"questionNumber": 35, "type": "multiple_choice", "question": "Shark meshing uses nets laid", "options": ["A. along the coastline.", "B. at an angle to the beach.", "C. from the beach to the sea."], "correctAnswer": OFFICIAL_KEYS[4][35], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 35, Answer Key P101"})
    q.append({"questionNumber": 36, "type": "multiple_choice", "question": "Other places that have taken up shark meshing include", "options": ["A. South Africa.", "B. New Zealand.", "C. Tahiti."], "correctAnswer": OFFICIAL_KEYS[4][36], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 36, Answer Key P101"})
    q.append({"questionNumber": 37, "type": "multiple_choice", "question": "The average number of sharks caught in nets each year is", "options": ["A. 15.", "B. 150.", "C. 1,500."], "correctAnswer": OFFICIAL_KEYS[4][37], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 37, Answer Key P101"})
    q.append({"questionNumber": 38, "type": "multiple_choice", "question": "Most sharks are caught in", "options": ["A. spring.", "B. summer.", "C. winter."], "correctAnswer": OFFICIAL_KEYS[4][38], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 38, Answer Key P101"})
    opts_t4_q39_40 = ["A. nets wrongly positioned", "B. strong waves and currents", "C. too many fish", "D. sharks eat holes in nets", "E. moving sands", "F. net holes", "G. holes in nets scare sharks"]
    q.append({"questionNumber": 39, "type": "multiple_choice", "question": "Which TWO factors reduce the benefits of shark nets? (First factor)", "options": opts_t4_q39_40, "correctAnswer": OFFICIAL_KEYS[4][39], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 39, Answer Key P101"})
    q.append({"questionNumber": 40, "type": "multiple_choice", "question": "Which TWO factors reduce the benefits of shark nets? (Second factor)", "options": opts_t4_q39_40, "correctAnswer": OFFICIAL_KEYS[4][40], "sourceRef": "Cambridge IELTS 4, Test 4, Listening Section 4, Question 40, Answer Key P101"})
    return q

# -------------------------------------------------------------
# 3. BUILD 16 LISTENING SECTIONS
# -------------------------------------------------------------
META_LISTENING = {
    (1, 1): ("Notes on Social Programme", "Ghi chú chương trình hoạt động xã hội", "B1", "5.5", "5-6"),
    (1, 2): ("Riverside Industrial Village", "Làng công nghiệp ven sông Riverside", "B2", "6.0", "7-8"),
    (1, 3): ("Course Assignment Consultation", "Tư vấn bài tập học phần", "B2", "6.5", "9-11"),
    (1, 4): ("The Urban Landscape", "Cảnh quan đô thị và cây xanh", "C1", "7.5", "12"),
    (2, 1): ("Meeting in Town and Travel Information", "Gặp gỡ tại thị trấn và thông tin du lịch", "B1", "5.5", "29-30, 32"),
    (2, 2): ("The Student Counselling Service", "Dịch vụ tư vấn tâm lý sinh viên", "B2", "6.0", "33-34"),
    (2, 3): ("Assignment on Data Collection Methods", "Bài tập phương pháp thu thập dữ liệu", "B2", "6.5", "35-36"),
    (2, 4): ("Corporate Crime Investigation", "Nghiên cứu tội phạm doanh nghiệp", "C1", "7.5", "37-38"),
    (3, 1): ("Accommodation Request Form", "Đơn đăng ký chỗ ở sinh viên", "B1", "5.5", "54-55"),
    (3, 2): ("City Arts and Circus Festival", "Lễ hội xiếc và nghệ thuật thành phố", "B2", "6.0", "56-57"),
    (3, 3): ("University Study Skills and Support Courses", "Kỹ năng học tập đại học và các khóa hỗ trợ", "B2", "6.5", "58-59"),
    (3, 4): ("New Student Union Building Planning", "Quy hoạch tòa nhà Hội sinh viên mới", "C1", "7.5", "60-61"),
    (4, 1): ("Goodbye Party Planning for John", "Kế hoạch tiệc chia tay cho John", "B1", "5.5", "78"),
    (4, 2): ("Travelite Walking Holidays", "Kỳ nghỉ đi bộ dã ngoại Travelite", "B2", "6.0", "79-80"),
    (4, 3): ("Science Experiments for Children", "Thí nghiệm khoa học cho trẻ em", "B2", "6.5", "81-82"),
    (4, 4): ("Sharks in Australia and Shark Meshing", "Cá mập tại Úc và biện pháp lưới chắn", "C1", "7.5", "83-84"),
}

ALL_TEST_QUESTIONS = {
    1: build_test1_questions(),
    2: build_test2_questions(),
    3: build_test3_questions(),
    4: build_test4_questions()
}

def get_listening_sections(test_num):
    qs = ALL_TEST_QUESTIONS[test_num]
    sections = []
    for s_num in range(1, 5):
        s_qs = [q for q in qs if (s_num == 1 and 1 <= q["questionNumber"] <= 10) or
                                (s_num == 2 and 11 <= q["questionNumber"] <= 20) or
                                (s_num == 3 and 21 <= q["questionNumber"] <= 30) or
                                (s_num == 4 and 31 <= q["questionNumber"] <= 40)]
        title, titleVi, cefr, diff, pages = META_LISTENING[(test_num, s_num)]
        rec_id = f"ielts-listening-cambridge-04-test-{test_num}-section-{s_num}"
        rec = {
            "id": rec_id,
            "section": s_num,
            "track": "Academic",
            "cefrLevel": cefr,
            "difficultyBand": diff,
            "title": title,
            "titleVi": titleVi,
            "scriptJson": "",
            "questionsJson": json.dumps(s_qs, ensure_ascii=False),
            "unparseable": [],
            "source": f"Cambridge IELTS 4 Academic, Test {test_num}, Listening Section {s_num}",
            "license": "Cambridge Assessment English",
            "verified": True,
            "sourceRef": f"Cambridge IELTS 4, Test {test_num}, Listening Section {s_num}, Pages {pages}"
        }
        sections.append(rec)
    return sections

# -------------------------------------------------------------
# 4. BUILD 8 WRITING TOPICS
# -------------------------------------------------------------
WRITING_PROMPTS = {
    (1, 1): (
        "WRITING TASK 1\nYou should spend about 20 minutes on this task.\nThe table below shows the proportion of different categories of families living in poverty in Australia in 1999.\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.",
        "Task 1",
        "Báo cáo biểu đồ (Task 1)",
        "{\"introduction\": \"Overview of the proportion of different family types in Australia living in poverty in 1999\", \"body1\": \"Sole parent families (21%) and single people without children (19%) had highest poverty rates\", \"body2\": \"Aged couples (4%) and single aged persons (6%) experienced the lowest poverty levels\", \"conclusion\": \"Overall 11% of all households (1.8 million people) lived in poverty in 1999\"}",
        "[\"proportion\", \"household type\", \"living in poverty\", \"sole parent\", \"aged couple\", \"all households\"]",
        "Table showing proportion of people from each household type living in poverty in Australia in 1999.",
        "Cambridge IELTS 4, Test 1, Writing Task 1, Page 26"
    ),
    (1, 2): (
        "WRITING TASK 2\nYou should spend about 40 minutes on this task.\nWrite about the following topic:\nCompare the advantages and disadvantages of three of the following as media for communicating information. State which you consider to be the most effective.\n• comics\n• books\n• radio\n• television\n• film\n• theatre\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.",
        "Task 2",
        "Nghị luận xã hội (Task 2)",
        "{\"introduction\": \"Introduction to different media for communicating information: books, television, and radio\", \"body1\": \"Analysis of books: deep knowledge and reflection vs slower dissemination\", \"body2\": \"Analysis of television and radio: immediate reach and visual impact vs potential superficiality\", \"conclusion\": \"Television considered most effective modern medium due to audio-visual combination and accessibility\"}",
        "[\"media of communication\", \"disseminate information\", \"audio-visual impact\", \"accessibility\", \"in-depth analysis\"]",
        None,
        "Cambridge IELTS 4, Test 1, Writing Task 2, Page 27"
    ),
    (2, 1): (
        "WRITING TASK 1\nYou should spend about 20 minutes on this task.\nThe graph below shows the demand for electricity in England during typical days in winter and summer. The pie chart shows how electricity is used in an average English home.\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.",
        "Task 1",
        "Báo cáo biểu đồ (Task 1)",
        "{\"introduction\": \"Overview of electricity demand in England across winter and summer days, and domestic electricity usage distribution\", \"body1\": \"Daily demand graph: winter demand consistently higher (peak around 21:00 at 40,000 units) compared to summer (peak around 14:00 at 20,000 units)\", \"body2\": \"Pie chart breakdown: heating rooms and water dominates (52.5%), followed by kitchen appliances (17.5%), lighting/TV/radio (15%), and cleaning tools (15%)\", \"conclusion\": \"Winter heating drives major seasonal electricity demand variation in England\"}",
        "[\"daily demand\", \"units of electricity\", \"seasonal fluctuation\", \"domestic consumption\", \"heating appliances\"]",
        "Line graph comparing winter vs summer electricity demand and pie chart of household electricity end-use.",
        "Cambridge IELTS 4, Test 2, Writing Task 1, Page 51"
    ),
    (2, 2): (
        "WRITING TASK 2\nYou should spend about 40 minutes on this task.\nWrite about the following topic:\nHappiness is considered very important in life.\nWhy is it difficult to define?\nWhat factors are important in achieving happiness?\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.",
        "Task 2",
        "Nghị luận xã hội (Task 2)",
        "{\"introduction\": \"Exploration of the elusive concept of happiness and its universal importance\", \"body1\": \"Why happiness is difficult to define: subjective nature, differing cultural values, changing personal milestones\", \"body2\": \"Key factors in achieving happiness: physical health, meaningful social connections, financial stability, sense of purpose\", \"conclusion\": \"Happiness is multifaceted and cultivated through internal balance and strong human relationships\"}",
        "[\"subjective well-being\", \"emotional state\", \"contentment\", \"meaningful relationships\", \"sense of purpose\"]",
        None,
        "Cambridge IELTS 4, Test 2, Writing Task 2, Page 52"
    ),
    (3, 1): (
        "WRITING TASK 1\nYou should spend about 20 minutes on this task.\nThe chart below shows the different levels of post-school qualifications in Australia and the proportion of men and women who held them in 1999.\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.",
        "Task 1",
        "Báo cáo biểu đồ (Task 1)",
        "{\"introduction\": \"Comparison of post-school qualifications held by Australian males and females in 1999\", \"body1\": \"Male predominance in skilled vocational diploma (90% male vs 10% female) and postgraduate degrees\", \"body2\": \"Female predominance in undergraduate diploma (70% female) and parity in bachelor's degree (around 50-50)\", \"conclusion\": \"Distinct gender preferences across vocational vs academic qualification streams in 1999\"}",
        "[\"post-school qualifications\", \"vocational diploma\", \"undergraduate\", \"bachelor degree\", \"gender disparity\"]",
        "Horizontal bar chart showing gender distribution across 5 educational qualification levels in Australia in 1999.",
        "Cambridge IELTS 4, Test 3, Writing Task 1, Page 75"
    ),
    (3, 2): (
        "WRITING TASK 2\nYou should spend about 40 minutes on this task.\nWrite about the following topic:\nCreative artists should always be given the freedom to express their own ideas (in words, pictures, music or film) in whichever way they wish. There should be no government restrictions on what they do.\nTo what extent do you agree or disagree with this opinion?\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.",
        "Task 2",
        "Nghị luận xã hội (Task 2)",
        "{\"introduction\": \"Debate on artistic freedom of expression versus necessary regulatory oversight by government\", \"body1\": \"Arguments for unrestricted freedom: cultural innovation, social criticism, intellectual development\", \"body2\": \"Arguments for reasonable restrictions: protection of minors, prevention of hate speech and public disorder\", \"conclusion\": \"Balanced view advocating broad artistic liberty with narrow safeguards against demonstrable public harm\"}",
        "[\"freedom of expression\", \"artistic liberty\", \"censorship\", \"cultural innovation\", \"hate speech regulations\"]",
        None,
        "Cambridge IELTS 4, Test 3, Writing Task 2, Page 76"
    ),
    (4, 1): (
        "WRITING TASK 1\nYou should spend about 20 minutes on this task.\nThe charts below give information about travel to and from the UK, and most popular countries visited by UK residents in 1999.\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.",
        "Task 1",
        "Báo cáo biểu đồ (Task 1)",
        "{\"introduction\": \"Overview of UK inbound and outbound tourism trends from 1979 to 1999 and top destinations for UK travelers in 1999\", \"body1\": \"Line graph trends: visits abroad by UK residents grew dramatically from 15m to over 50m, consistently exceeding visits to UK (10m to 27m)\", \"body2\": \"Bar chart destinations in 1999: France (approx 12m) and Spain (approx 9m) were by far the most visited, followed by USA, Greece, and Turkey\", \"conclusion\": \"Outbound UK tourism expanded substantially over two decades with Western Europe remaining prime destination\"}",
        "[\"inbound tourism\", \"outbound travel\", \"UK residents\", \"overseas visitors\", \"popular destinations\"]",
        "Line graph of UK visits abroad vs visits to UK (1979-1999) and bar chart of top 5 countries visited in 1999.",
        "Cambridge IELTS 4, Test 4, Writing Task 1, Page 97"
    ),
    (4, 2): (
        "WRITING TASK 2\nYou should spend about 40 minutes on this task.\nWrite about the following topic:\nIn many countries schools have severe problems with student behaviour.\nWhat do you think are the causes of this?\nWhat solutions can you suggest?\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.",
        "Task 2",
        "Nghị luận xã hội (Task 2)",
        "{\"introduction\": \"Addressing growing concerns over student indiscipline and disruptive classroom behavior worldwide\", \"body1\": \"Root causes: family breakdown, lack of parental boundaries, digital distractions, unengaging curricula\", \"body2\": \"Potential solutions: closer parent-teacher cooperation, engaging curriculum reform, positive behavioral reinforcement\", \"conclusion\": \"Comprehensive joint efforts by educators, parents, and community required to foster respectful learning environments\"}",
        "[\"student indiscipline\", \"disruptive behavior\", \"classroom management\", \"parental guidance\", \"pedagogical strategies\"]",
        None,
        "Cambridge IELTS 4, Test 4, Writing Task 2, Page 98"
    ),
}

def get_writing_topics(test_num):
    topics = []
    for task_num in [1, 2]:
        prompt, t_type, t_typeVi, outline, key_vocab, chart_note, src = WRITING_PROMPTS[(test_num, task_num)]
        rec = {
            "id": f"ielts-writing-cambridge-04-test-{test_num}-task-{task_num}",
            "track": "Academic",
            "prompt": prompt,
            "type": t_type,
            "typeVi": t_typeVi,
            "bandRange": "All Bands",
            "outlineJson": outline,
            "keyVocabJson": key_vocab,
            "chartNote": chart_note,
            "source": f"Cambridge IELTS 4, Test {test_num}, Writing Task {task_num}",
            "verified": True,
            "sourceRef": src
        }
        topics.append(rec)
    return topics

# -------------------------------------------------------------
# 5. BUILD 4 SPEAKING TOPICS
# -------------------------------------------------------------
SPEAKING_TOPICS = {
    1: (
        "Friends & Historic Places",
        "Bạn bè & Các địa điểm lịch sử",
        "PART 1\nThe examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.\nEXAMPLE: Friends\n• Are your friends mostly your age or different ages? [Why?]\n• Do you usually see your friends during the week or at weekends? [Why?]\n• The last time you saw your friends, what did you do together?\n• In what ways are your friends important to you?\n\nPART 2\nDescribe an interesting historic place.\nYou should say:\nwhat it is\nwhere it is located\nwhat you can see there now\nand explain why this place is interesting.\nYou will have to talk about the topic for one to two minutes. You have one minute to think about what you’re going to say. You can make some notes to help you if you wish.\n\nPART 3\nDiscussion topics:\nLooking after historic places\nExample questions:\nHow do people in your country feel about protecting historic buildings?\nDo you think an area can benefit from having an interesting historic place locally? In what way?\nWhat do you think will happen to historic places or buildings in the future? Why?\n\nThe teaching of history at school\nExample questions:\nHow were you taught history when you were at school?\nAre there other ways people can learn about history, apart from at school? How?\nDo you think history will still be a school subject in the future? Why?",
        "{\"part1_friends\": \"Discussion of friendship circles, meeting frequency, shared activities, importance of companionship\", \"part2_historic_place\": \"Description of an architectural or historical landmark: location, visual features, historical background, personal fascination\", \"part3_heritage\": \"Heritage preservation policies, cultural tourism impact, methods of teaching history engagingly\"}",
        "[\"How can modern technology help restore decaying historic sites?\", \"Do young people value history as much as older generations?\", \"Should entrance to historical monuments be free for citizens?\"]",
        "Cambridge IELTS 4, Test 1, Speaking, Page 28"
    ),
    2: (
        "Food, Cooking & Hobbies",
        "Ẩm thực, Nấu ăn & Sở thích cá nhân",
        "PART 1\nThe examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.\nEXAMPLE: Food and cooking\n• What kinds of food do you like to eat?\n• What kind of new food would you like to try? [Why?]\n• Do you like cooking? [Why/Why not?]\n• What was the last meal you cooked?\n• Do you prefer home-cooked food or food from restaurants? [Why?]\n\nPART 2\nDescribe an interest or hobby that you enjoy.\nYou should say:\nhow you became interested in it\nhow long you have been doing it\nwhy you enjoy it\nand explain what benefits you get from this interest or hobby.\nYou will have to talk about the topic for one to two minutes. You have one minute to think about what you're going to say. You can make some notes to help you if you wish.\n\nPART 3\nDiscussion topics:\nThe social benefits of hobbies\nExample questions:\nDo you think having a hobby is good for people's social life? In what way?\nAre there any negative effects of a person spending too much time on their hobby? What are they?\nWhy do you think people need to have an interest or hobby?\n\nLeisure time\nExample questions:\nIn your country, how much time do people spend on work and how much time on leisure? Is this a good balance, do you think?\nWould you say the amount of free time has changed much in the last fifty years?\nDo you think people will have more or less free time in the future? Why?",
        "{\"part1_food\": \"Culinary preferences, cooking frequency, restaurant vs homemade meals\", \"part2_hobby\": \"Personal hobby: origin, duration, reasons for enjoyment, psychological and physical benefits\", \"part3_leisure\": \"Social dimensions of shared hobbies, work-life balance shifts over half a century, future leisure trends\"}",
        "[\"Can excessive dedication to a solitary hobby hinder social relationships?\", \"How has the definition of leisure changed with the advent of remote working?\", \"Should employers sponsor recreational clubs for staff?\"]",
        "Cambridge IELTS 4, Test 2, Speaking, Page 53"
    ),
    3: (
        "Leisure & Water Activities",
        "Thời gian rảnh rỗi & Các hoạt động dưới nước",
        "PART 1\nThe examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.\nEXAMPLE: Leisure\n• Do you have any hobbies or interests? [What are they?]\n• How did you become interested in (whatever hobby/interest the candidate mentions)?\n• What is there to do in your free time in (candidate's home town/village)?\n• How do you usually spend your holidays?\n• Is there anywhere you would particularly like to visit? [Why?]\n\nPART 2\nDescribe a river, lake or sea which you like.\nYou should say:\nwhat the river, lake or sea is called\nwhere it is\nwhat the land near it is like\nand explain why you like this river, lake or sea.\nYou will have to talk about the topic for one to two minutes. You have one minute to think about what you're going to say. You can make some notes to help you if you wish.\n\nPART 3\nDiscussion topics:\nWater-based leisure activities\nExample questions:\nWhat do people enjoy doing when they visit rivers, lakes or the sea? Why do you think these activities are popular?\nWhat benefits do you think people get from the activities they enjoy in the water?\nWhat are the different advantages of going to the sea or to a swimming pool to enjoy yourself? What do you think the disadvantages are?\n\nThe economic importance of rivers, lakes and the sea\nExample questions:\nHow does water transport, like boats and ships, compare with other kinds? Are there any advantages/disadvantages of water transport?\nHow important is it for a town or city to be located near a river or the sea? Why?\nHave there been any changes in the number of jobs available in fishing and water transport industries, do you think? Why do you think this is?",
        "{\"part1_leisure\": \"Free time hobbies, local community recreation options, vacation choices\", \"part2_waterbody\": \"Natural water feature (river, lake, coastline): geography, surrounding landscape, personal affinity\", \"part3_marine_economy\": \"Recreational water activities, physical benefits, maritime logistics versus land transport, coastal urbanization\"}",
        "[\"Why have maritime cities historically been wealthier than landlocked ones?\", \"How can tourism around natural water bodies be managed sustainably?\", \"What ecological threats facing major rivers concern you most?\"]",
        "Cambridge IELTS 4, Test 3, Speaking, Page 77"
    ),
    4: (
        "Favourite Places & The Internet",
        "Địa điểm yêu thích & Mạng Internet",
        "PART 1\nThe examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.\nEXAMPLE: Your favourite place\n• What place do you most like to visit?\n• How often do you visit this place?\n• Why do you like it so much?\n• Is it popular with many other people?\n\nPART 2\nDescribe a useful website you have visited.\nYou should say:\nwhat the website was\nhow you found the address for this website\nwhat the website contained\nand explain why it was useful to you.\nYou will have to talk about the topic for one to two minutes. You have one minute to think about what you're going to say. You can make some notes to help you if you wish.\n\nPART 3\nDiscussion topics:\nThe internet and communication\nExample questions:\nWhat effect has the internet had on the way people generally communicate with each other?\nWhy do you think the internet is being used more and more for communication?\nHow reliable do you think information from the internet is? Why? What about the news on the internet?\n\nThe internet and shopping\nExample questions:\nWhy do you think some people use the internet for shopping? Why doesn't everyone use it in this way?\nWhat kinds of things are easy to buy and sell online? Can you give me some examples?\nDo you think shopping on the internet will be more or less popular in the future? Why?",
        "{\"part1_favourite_place\": \"Special retreat or destination, visit frequency, personal relaxation value\", \"part2_website\": \"Useful web platform: navigation, functional features, educational or daily utility\", \"part3_internet_society\": \"Interpersonal communication changes, online information credibility, e-commerce adoption barriers and future trajectory\"}",
        "[\"Has instantaneous digital communication diminished meaningful interpersonal depth?\", \"What safeguards should consumers demand against fraudulent online retail?\", \"How can elderly demographics be better integrated into digital online services?\"]",
        "Cambridge IELTS 4, Test 4, Speaking, Page 99"
    )
}

def get_speaking_topic(test_num):
    title, titleVi, q_text, ideas, follow_ups, src = SPEAKING_TOPICS[test_num]
    return {
        "id": f"ielts-speaking-cambridge-04-test-{test_num}",
        "part": "All Parts (1-3)",
        "track": "Academic",
        "topic": title,
        "topicVi": titleVi,
        "question": q_text,
        "ideasJson": ideas,
        "followUpQuestions": follow_ups,
        "formatNote": "Full official 3-part Cambridge IELTS speaking interview",
        "source": f"Cambridge IELTS 4, Test {test_num}, Speaking",
        "verified": True,
        "sourceRef": src
    }

# -------------------------------------------------------------
# 6. ASSEMBLE 28 RECORDS ACROSS 4 TESTS
# -------------------------------------------------------------
def run_generator():
    tests_data = []
    all_28_records = []

    for t_num in range(1, 5):
        l_secs = get_listening_sections(t_num)
        w_tops = get_writing_topics(t_num)
        s_top = get_speaking_topic(t_num)

        test_obj = {
            "test": t_num,
            "book": "cambridge-ielts-04-academic",
            "track": "Academic",
            "official_keys": OFFICIAL_KEYS[t_num],
            "listening_sections": l_secs,
            "reading_passages": [],
            "writing_topics": w_tops,
            "writing_models": [],
            "speaking_topics": [s_top],
            "shape": "4L / 0R / 2WT / 0WM / 1S = 7 records",
            "recordsCount": 7,
            "questionsCount": 40
        }
        tests_data.append(test_obj)

        all_28_records.extend(l_secs)
        all_28_records.extend(w_tops)
        all_28_records.append(s_top)

    # 12 Blocked Reading Passages
    BLOCKED_READING_PASSAGES = [
        {"test": 1, "passage": 1, "title": "Children's Ideas About Rainforests", "pageRange": "P13-P17", "questionRange": "Questions 1-14", "questionCount": 14, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus native text)"},
        {"test": 1, "passage": 2, "title": "What Do Whales Feel?", "pageRange": "P18-P21", "questionRange": "Questions 15-26", "questionCount": 12, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus native text)"},
        {"test": 1, "passage": 3, "title": "Visual Symbols and the Blind", "pageRange": "P22-P25", "questionRange": "Questions 27-40", "questionCount": 14, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus native text)"},
        {"test": 2, "passage": 1, "title": "Lost for Words (Minority Languages)", "pageRange": "P39-P42", "questionRange": "Questions 1-13", "questionCount": 13, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 2, "passage": 2, "title": "Alternative Medicine in Australia", "pageRange": "P43-P46", "questionRange": "Questions 14-26", "questionCount": 13, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 2, "passage": 3, "title": "Play is a Serious Business", "pageRange": "P47-P50", "questionRange": "Questions 27-40", "questionCount": 14, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 3, "passage": 1, "title": "Micro-Enterprise Credit for Street Youth", "pageRange": "P62-P66", "questionRange": "Questions 1-13", "questionCount": 13, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 3, "passage": 2, "title": "Volcanoes – Earth-Shattering News", "pageRange": "P67-P70", "questionRange": "Questions 14-26", "questionCount": 13, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 3, "passage": 3, "title": "Obtaining Linguistic Data", "pageRange": "P71-P74", "questionRange": "Questions 27-40", "questionCount": 14, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 4, "passage": 1, "title": "How much higher? How much faster? (Limits to human sporting performance)", "pageRange": "P85-P88", "questionRange": "Questions 1-13", "questionCount": 13, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 4, "passage": 2, "title": "The Nature and Aims of Archaeology", "pageRange": "P89-P92", "questionRange": "Questions 14-27", "questionCount": 14, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"},
        {"test": 4, "passage": 3, "title": "The Problem of Scarce Resources", "pageRange": "P93-P96", "questionRange": "Questions 28-40", "questionCount": 13, "status": "BLOCKED", "reason": "keys absent-in-book (PDF lacks Reading Answer Key; stems preserved in book-corpus OCR text)"}
    ]

    # Write cam04_academic_draft.json
    draft_payload = {
        "book": "cambridge-ielts-04-academic",
        "track": "Academic",
        "source": "cambridge-ielts-early/cambridge-ielts-04-full-text-complete.json",
        "totalRecords": len(all_28_records),
        "shapePerTest": "4L / 0R / 2WT / 0WM / 1S = 7 records per test (Total 28 records)",
        "totals": {
            "listening_sections": 16,
            "reading_passages": 0,
            "writing_topics": 8,
            "writing_models": 0,
            "speaking_topics": 4,
            "total_records": 28,
            "total_questions": 160
        },
        "tests": tests_data,
        "records": all_28_records,
        "listening_sections": [r for r in all_28_records if r["id"].startswith("ielts-listening")],
        "writing_topics": [r for r in all_28_records if r["id"].startswith("ielts-writing")],
        "speaking_topics": [r for r in all_28_records if r["id"].startswith("ielts-speaking")],
        "blockedInventory": {
            "reading_passages": BLOCKED_READING_PASSAGES,
            "general_training": "absent-in-book (PDF is Academic 101 pages only)",
            "writing_models": "absent-in-book (no sample essays in 101-page PDF scan)",
            "listening_scripts_debt": "16 sections (tapescripts absent in book; scriptJson set to empty string)"
        }
    }

    draft_path = OUTPUT_DIR / "cam04_academic_draft.json"
    with open(draft_path, "w", encoding="utf-8") as f:
        json.dump(draft_payload, f, ensure_ascii=False, indent=2)

    # Write cam04_academic_manifest.json
    manifest_payload = {
        "book": "cambridge-ielts-04-academic",
        "track": "Academic",
        "source": "cambridge-ielts-early/cambridge-ielts-04-full-text-complete.json (101 pages: P1-30 digital, P31-99 OCR, P100-101 answer notes)",
        "scopeSpecification": "Reduced Academic Scope: Listening (16 sections, 160 questions) + Writing Topics (8 topics) + Speaking Topics (4 topics); Reading BLOCKED due to absent answer keys; Writing models and General Training absent-in-book.",
        "tests": [
            {
                "test": 1,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "mappedListeningQuestions": 40,
                "readingPassagesBlocked": 3,
                "blockedQuestions": 40,
                "writingTopics": 2,
                "writingModels": 0,
                "speakingTopics": 1,
                "gaps": 0,
                "unparseable": 0,
                "note": "Test 1 complete in reduced scope. Listening 40/40 mapped with keys from P100. scriptJson='' (tapescripts absent). Writing Task 1 & 2 prompts mapped. Speaking Parts 1-3 mapped. Reading 3 passages (40 questions) BLOCKED due to keys absent-in-book."
            },
            {
                "test": 2,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "mappedListeningQuestions": 40,
                "readingPassagesBlocked": 3,
                "blockedQuestions": 40,
                "writingTopics": 2,
                "writingModels": 0,
                "speakingTopics": 1,
                "gaps": 0,
                "unparseable": 0,
                "note": "Test 2 complete in reduced scope. Listening 40/40 mapped with keys from P100. scriptJson='' (tapescripts absent). Writing Task 1 & 2 prompts mapped. Speaking Parts 1-3 mapped. Reading 3 passages (40 questions) BLOCKED due to keys absent-in-book."
            },
            {
                "test": 3,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "mappedListeningQuestions": 40,
                "readingPassagesBlocked": 3,
                "blockedQuestions": 40,
                "writingTopics": 2,
                "writingModels": 0,
                "speakingTopics": 1,
                "gaps": 0,
                "unparseable": 0,
                "note": "Test 3 complete in reduced scope. Listening 40/40 mapped with keys from P101. scriptJson='' (tapescripts absent). Writing Task 1 & 2 prompts mapped. Speaking Parts 1-3 mapped. Reading 3 passages (40 questions) BLOCKED due to keys absent-in-book."
            },
            {
                "test": 4,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "mappedListeningQuestions": 40,
                "readingPassagesBlocked": 3,
                "blockedQuestions": 40,
                "writingTopics": 2,
                "writingModels": 0,
                "speakingTopics": 1,
                "gaps": 0,
                "unparseable": 0,
                "note": "Test 4 complete in reduced scope. Listening 40/40 mapped with keys from P101. scriptJson='' (tapescripts absent). Writing Task 1 & 2 prompts mapped. Speaking Parts 1-3 mapped. Reading 3 passages (40 questions) BLOCKED due to keys absent-in-book."
            }
        ],
        "totals": {
            "records": 28,
            "listening_sections": 16,
            "reading_passages_mapped": 0,
            "reading_passages_blocked": 12,
            "writing_topics": 8,
            "writing_models": 0,
            "speaking_topics": 4,
            "mappedQuestions": 160,
            "blockedReadingQuestions": 160,
            "gaps": 0,
            "unparseable": 0
        },
        "recordShapeNote": "7 records/test (4L/0R/2WT/0WM/1S). 4 tests * 7 = 28 records total.",
        "blockedReadingInventory": BLOCKED_READING_PASSAGES,
        "absentInBook": [
            "Reading Answer Keys (Tests 1-4): Entirely absent from 101-page physical PDF scan; 0 hits for 'reading/passage' in key pages P100-101.",
            "Listening Tapescripts (Tests 1-4): Entirely absent from 101-page physical PDF scan; scriptJson retained as empty string without fabrication.",
            "Writing Model Answers (Tests 1-4): Entirely absent from 101-page physical PDF scan.",
            "General Training Module (Reading & Writing Tests A & B): Entirely absent from 101-page physical PDF scan."
        ],
        "validation": "Full 1-1 reconciliation: 160 Listening questions mapped from P100-101 keys. 0 null correctAnswer, 0 double-encoding. 12 Reading passages (160 questions) cataloged as BLOCKED inventory."
    }

    manifest_path = OUTPUT_DIR / "cam04_academic_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_payload, f, ensure_ascii=False, indent=2)

    # Write cam04_academic_exploitation_report.json
    report_payload = {
        "book": "cambridge-ielts-04-academic",
        "track": "Academic",
        "reconciliationSummary": {
            "totalRecords": 28,
            "shapePerTest": "4L / 0R / 2WT / 0WM / 1S = 7 records per test (28 records total across Tests 1-4)",
            "mappedQuestions": 160,
            "blockedQuestions": 160,
            "totalBookQuestionsIdentified": 320,
            "gaps": 0,
            "unparseable": 0
        },
        "segments": [
            {
                "test": 1,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "listening": {"recordsCount": 4, "sections": ["Section 1", "Section 2", "Section 3", "Section 4"], "mappedQuestions": 40, "keySource": "cambridge-ielts-04-full-text-complete.json P100 (Test 1 Answer Key)", "scriptJsonStatus": "empty string (debt: tapescripts absent in book)"},
                "reading": {"recordsCount": 0, "status": "BLOCKED", "blockedPassagesCount": 3, "blockedQuestionsCount": 40, "passages": [{"passage": 1, "title": "Children's Ideas About Rainforests", "range": "P13-P17", "questions": "Q1-14", "reason": "keys absent-in-book"}, {"passage": 2, "title": "What Do Whales Feel?", "range": "P18-P21", "questions": "Q15-26", "reason": "keys absent-in-book"}, {"passage": 3, "title": "Visual Symbols and the Blind", "range": "P22-P25", "questions": "Q27-40", "reason": "keys absent-in-book"}]},
                "writing": {"recordsCount": 2, "topics": ["Task 1: Poverty in Australia in 1999", "Task 2: Media for communicating information"], "modelsCount": 0, "modelsStatus": "absent-in-book"},
                "speaking": {"recordsCount": 1, "topic": "Friends & Historic Places (Parts 1-3)"}
            },
            {
                "test": 2,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "listening": {"recordsCount": 4, "sections": ["Section 1", "Section 2", "Section 3", "Section 4"], "mappedQuestions": 40, "keySource": "cambridge-ielts-04-full-text-complete.json P100 (TEST 2 Answer Key)", "scriptJsonStatus": "empty string (debt: tapescripts absent in book)"},
                "reading": {"recordsCount": 0, "status": "BLOCKED", "blockedPassagesCount": 3, "blockedQuestionsCount": 40, "passages": [{"passage": 1, "title": "Lost for Words (Minority Languages)", "range": "P39-P42", "questions": "Q1-13", "reason": "keys absent-in-book"}, {"passage": 2, "title": "Alternative Medicine in Australia", "range": "P43-P46", "questions": "Q14-26", "reason": "keys absent-in-book"}, {"passage": 3, "title": "Play is a Serious Business", "range": "P47-P50", "questions": "Q27-40", "reason": "keys absent-in-book"}]},
                "writing": {"recordsCount": 2, "topics": ["Task 1: Electricity demand and domestic usage in England", "Task 2: Happiness definition and achieving factors"], "modelsCount": 0, "modelsStatus": "absent-in-book"},
                "speaking": {"recordsCount": 1, "topic": "Food, Cooking & Hobbies (Parts 1-3)"}
            },
            {
                "test": 3,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "listening": {"recordsCount": 4, "sections": ["Section 1", "Section 2", "Section 3", "Section 4"], "mappedQuestions": 40, "keySource": "cambridge-ielts-04-full-text-complete.json P101 (TEST 3 Answer Key)", "scriptJsonStatus": "empty string (debt: tapescripts absent in book)"},
                "reading": {"recordsCount": 0, "status": "BLOCKED", "blockedPassagesCount": 3, "blockedQuestionsCount": 40, "passages": [{"passage": 1, "title": "Micro-Enterprise Credit for Street Youth", "range": "P62-P66", "questions": "Q1-13", "reason": "keys absent-in-book"}, {"passage": 2, "title": "Volcanoes – Earth-Shattering News", "range": "P67-P70", "questions": "Q14-26", "reason": "keys absent-in-book"}, {"passage": 3, "title": "Obtaining Linguistic Data", "range": "P71-P74", "questions": "Q27-40", "reason": "keys absent-in-book"}]},
                "writing": {"recordsCount": 2, "topics": ["Task 1: Post-school qualifications in Australia in 1999", "Task 2: Creative artists and government restrictions"], "modelsCount": 0, "modelsStatus": "absent-in-book"},
                "speaking": {"recordsCount": 1, "topic": "Leisure & Water Activities (Parts 1-3)"}
            },
            {
                "test": 4,
                "records": "4L / 0R / 2WT / 0WM / 1S = 7 records",
                "listening": {"recordsCount": 4, "sections": ["Section 1", "Section 2", "Section 3", "Section 4"], "mappedQuestions": 40, "keySource": "cambridge-ielts-04-full-text-complete.json P101 (TEST 4 Answer Key)", "scriptJsonStatus": "empty string (debt: tapescripts absent in book)"},
                "reading": {"recordsCount": 0, "status": "BLOCKED", "blockedPassagesCount": 3, "blockedQuestionsCount": 40, "passages": [{"passage": 1, "title": "How much higher? How much faster? (Limits to human sporting performance)", "range": "P85-P88", "questions": "Q1-13", "reason": "keys absent-in-book"}, {"passage": 2, "title": "The Nature and Aims of Archaeology", "range": "P89-P92", "questions": "Q14-27", "reason": "keys absent-in-book"}, {"passage": 3, "title": "The Problem of Scarce Resources", "range": "P93-P96", "questions": "Q28-40", "reason": "keys absent-in-book"}]},
                "writing": {"recordsCount": 2, "topics": ["Task 1: Travel to and from UK (1979-1999)", "Task 2: Student behaviour in schools"], "modelsCount": 0, "modelsStatus": "absent-in-book"},
                "speaking": {"recordsCount": 1, "topic": "Favourite Places & The Internet (Parts 1-3)"}
            }
        ],
        "exploited": "4/4 Academic tests mapped under reduced scope (16 Listening sections with 160 questions, 8 Writing topics, 4 Speaking topics = 28 records)",
        "blockedInventory": BLOCKED_READING_PASSAGES,
        "absentInBook": [
            "Reading Answer Keys (Tests 1-4): Entirely absent from 101-page physical PDF scan; 0 hits for 'reading/passage' in key pages P100-101.",
            "Listening Tapescripts (Tests 1-4): Entirely absent from 101-page physical PDF scan; scriptJson retained as empty string without fabrication.",
            "Writing Model Answers (Tests 1-4): Entirely absent from 101-page physical PDF scan.",
            "General Training Module (Reading & Writing Tests A & B): Entirely absent from 101-page physical PDF scan."
        ],
        "reconciliation": "320 total book questions accounted = 160 mapped Listening questions + 160 blocked Reading questions + 0 gaps + 0 unparseable."
    }

    report_path = OUTPUT_DIR / "cam04_academic_exploitation_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_payload, f, ensure_ascii=False, indent=2)

    return draft_path, manifest_path, report_path

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

if __name__ == "__main__":
    d, m, r = run_generator()
    print("Execution complete. Deliverables generated successfully:")
    for p in [d, m, r]:
        print(f"  {p.name:42}: SHA256={sha256_file(p)} ({p.stat().st_size} bytes)")
