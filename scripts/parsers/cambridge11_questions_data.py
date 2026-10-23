"""
scripts/parsers/cambridge11_questions_data.py
Unified dataset provider for Cambridge IELTS 11 Academic Tests 2, 3, 4.
Total 240 questions with stems, options, types, answers, and source references.
"""

from typing import List, Dict, Any
from scripts.parsers.cambridge11_questions_t2 import T2_LISTENING_QUESTIONS, T2_READING_QUESTIONS
from scripts.parsers.cambridge11_questions_t3 import T3_LISTENING_QUESTIONS, T3_READING_QUESTIONS
from scripts.parsers.cambridge11_questions_t4 import T4_LISTENING_QUESTIONS, T4_READING_QUESTIONS

ALL_TEST_DATA = {
    2: {
        "listening": T2_LISTENING_QUESTIONS,
        "reading": T2_READING_QUESTIONS,
    },
    3: {
        "listening": T3_LISTENING_QUESTIONS,
        "reading": T3_READING_QUESTIONS,
    },
    4: {
        "listening": T4_LISTENING_QUESTIONS,
        "reading": T4_READING_QUESTIONS,
    }
}

READING_RANGES = {
    1: (1, 13),
    2: (14, 26),
    3: (27, 40)
}

LISTENING_RANGES = {
    1: (1, 10),
    2: (11, 20),
    3: (21, 30),
    4: (31, 40)
}

def get_reading_questions_for_passage(test_num: int, passage_num: int) -> List[Dict[str, Any]]:
    """Returns questions for a specific reading passage (1, 2, or 3)."""
    q_start, q_end = READING_RANGES[passage_num]
    all_q = ALL_TEST_DATA[test_num]["reading"]
    return [q for q in all_q if q_start <= q["questionNumber"] <= q_end]

def get_listening_questions_for_section(test_num: int, section_num: int) -> List[Dict[str, Any]]:
    """Returns questions for a specific listening section (1, 2, 3, or 4)."""
    q_start, q_end = LISTENING_RANGES[section_num]
    all_q = ALL_TEST_DATA[test_num]["listening"]
    return [q for q in all_q if q_start <= q["questionNumber"] <= q_end]
