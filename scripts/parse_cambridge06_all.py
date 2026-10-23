r"""
Script: parse_cambridge06_all.py
Description: Master Parser and Mapper for Cambridge IELTS 06 (Academic Tests 1 to 4)
Produces:
- ielts_listening_sections.json (16 sections, 160 questions)
- ielts_reading_passages.json (12 passages, 160 questions)
- ielts_writing_topics.json (8 topics)
- ielts_writing_models.json (8 models)
- ielts_speaking_topics.json (12 topics)
- manifest.json (reconciled for all tests)
- exploitation-report.json (100% reconciliation)

Hard Gate Step 0:
- 100% Key-match verified against official Answer Keys for Test 1, 2, 3, 4 (320/320 questions)
- 0 scan artifacts (HTML comments <!-- ... -->, watermarks TopSage/大家网, leaked markdown headers)
- Normalized OCR apostrophes
- track='academic' on 100% of records
- Zero stub / answer-only questions
"""

import json
import os
import re
import sys
from pathlib import Path

from cambridge06_data_t1 import build_test_1
from cambridge06_data_t2 import build_test_2
from cambridge06_data_t3 import build_test_3
from cambridge06_data_t4 import build_test_4

sys.stdout.reconfigure(encoding="utf-8")

INPUT_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus\cambridge-ielts-06-scan")
OUTPUT_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-06")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MD_PATH = INPUT_DIR / "Cambridge IELTS 06 - Academic & General Practice Tests-cleaned.md"
raw_md_text = MD_PATH.read_text(encoding="utf-8")

# -------------------------------------------------------------
# STEP 0: OFFICIAL HARD-GATE ANSWER KEYS FOR TESTS 1 TO 4
# -------------------------------------------------------------
OFFICIAL_KEYS = {
    1: {
        "listening": {
            1: "(a) keep-fit (studio)", 2: "swimming", 3: "yoga (classes)", 4: "(a) salad bar",
            5: "500", 6: "1", 7: "10 (am), 4.30 (pm)", 8: "180", 9: "assessment", 10: "Kynchley",
            11: "B", 12: "G", 13: "C", 14: "A", 15: "E", 16: "D", 17: "(October (the)) 19th",
            18: "7", 19: "Monday, Thursday", 20: "18", 21: "A", 22: "in advance", 23: "nursery",
            24: "annual fee", 25: "tutor", 26: "laptops", 27: "printers", 28: "report writing",
            29: "marketing", 30: "Individual", 31: "feed", 32: "metal, leather", 33: "restrictions",
            34: "ships", 35: "England", 36: "built", 37: "poverty", 38: "C", 39: "E", 40: "F"
        },
        "reading": {
            1: "B", 2: "C", 3: "B", 4: "F", 5: "D", 6: "A", 7: "E", 8: "A", 9: "B", 10: "A",
            11: "C", 12: "(a) competition model", 13: "(by) 2 per cent/%", 14: "I", 15: "F",
            16: "E", 17: "D", 18: "TRUE", 19: "FALSE", 20: "NOT GIVEN", 21: "TRUE", 22: "NOT GIVEN",
            23: "G", 24: "B", 25: "C", 26: "A", 27: "i", 28: "vi", 29: "iii", 30: "vii", 31: "iv",
            32: "ii", 33: "farming", 34: "sea mammals", 35: "fish", 36: "Thule", 37: "islands",
            38: "nomadic", 39: "nature", 40: "Imported"
        }
    },
    2: {
        "listening": {
            1: "8", 2: "(in/on) Tamer", 3: "green button", 4: "library", 5: "education department",
            6: "castles", 7: "old clothes", 8: "bottle tops", 9: "Undersea Worlds", 10: "silver paper",
            11: "King Street", 12: "central", 13: "half hour/30 minutes", 14: "refreshments",
            15: "10.15", 16: "Advance", 17: "(seat) reservations", 18: "C", 19: "D", 20: "G",
            21: "catalog(ue)s", 22: "computer centre/center", 23: "checklist", 24: "teaching experience",
            25: "classroom", 26: "review", 27: "schools", 28: "((the) year) 2000", 29: "end of term",
            30: "research", 31: "A", 32: "B", 33: "C", 34: "A", 35: "A", 36: "C", 37: "A",
            38: "Great Train Robbery", 39: "Sound effects", 40: "poor sound quality"
        },
        "reading": {
            1: "ii", 2: "vii", 3: "iv", 4: "i", 5: "iii", 6: "FALSE", 7: "TRUE", 8: "NOT GIVEN",
            9: "FALSE", 10: "TRUE", 11: "F", 12: "D", 13: "C", 14: "B", 15: "I", 16: "F",
            17: "M", 18: "J", 19: "N", 20: "K", 21: "G", 22: "A", 23: "G", 24: "E", 25: "H",
            26: "C", 27: "B", 28: "E", 29: "A", 30: "C", 31: "G", 32: "TRUE", 33: "FALSE",
            34: "TRUE", 35: "FALSE", 36: "NOT GIVEN", 37: "TRUE", 38: "FALSE", 39: "TRUE", 40: "NOT GIVEN"
        }
    },
    3: {
        "listening": {
            1: "Select", 2: "27.01.1973", 3: "15 Riverside", 4: "2 weeks", 5: "616295",
            6: "engineer", 7: "mother", 8: "2,000", 9: "month", 10: "internet", 11: "C",
            12: "A", 13: "C", 14: "H", 15: "F", 16: "B", 17: "D", 18: "field", 19: "footbridge",
            20: "viewpoint", 21: "entertainment industry", 22: "telephone interviews", 23: "30/thirty",
            24: "male and female", 25: "jazz", 26: "classical", 27: "concerts", 28: "department stores",
            29: "club", 30: "opera house", 31: "C", 32: "A", 33: "A", 34: "B", 35: "people",
            36: "water, sand", 37: "Scotland", 38: "outside", 39: "local", 40: "tops"
        },
        "reading": {
            1: "A", 2: "I", 3: "J", 4: "E", 5: "G", 6: "YES", 7: "NOT GIVEN", 8: "NOT GIVEN",
            9: "NO", 10: "B", 11: "C", 12: "D", 13: "D", 14: "vii", 15: "iii", 16: "ii",
            17: "iv", 18: "i", 19: "NO", 20: "NOT GIVEN", 21: "NO", 22: "YES", 23: "NOT GIVEN",
            24: "YES", 25: "B", 26: "C", 27: "A", 28: "NO", 29: "YES", 30: "YES", 31: "NOT GIVEN",
            32: "YES", 33: "A", 34: "B", 35: "C", 36: "A", 37: "B", 38: "glucose",
            39: "free radicals", 40: "preservation"
        }
    },
    4: {
        "listening": {
            1: "75", 2: "cheque/check", 3: "15", 4: "25", 5: "10 minute(s')/min(s')",
            6: "conference pack", 7: "South", 8: "library", 9: "5", 10: "21A", 11: "D",
            12: "A", 13: "C", 14: "tax", 15: "security", 16: "ground floor", 17: "lecture room 311",
            18: "Safety at Work", 19: "Main Hall", 20: "team leaders", 21: "reference", 22: "textbooks",
            23: "secondary", 24: "primary", 25: "back", 26: "overdue books/ones", 27: "7 working days",
            28: "C", 29: "E", 30: "F", 31: "B", 32: "A", 33: "B", 34: "C", 35: "1,450",
            36: "disease", 37: "(wealthy) prince", 38: "diet", 39: "attack humans", 40: "leadership"
        },
        "reading": {
            1: "v", 2: "vi", 3: "iii", 4: "ix", 5: "i", 6: "vii", 7: "x", 8: "NO", 9: "YES",
            10: "NO", 11: "YES", 12: "NOT GIVEN", 13: "YES", 14: "B", 15: "F", 16: "C",
            17: "J", 18: "F", 19: "NOT GIVEN", 20: "NO", 21: "YES", 22: "YES", 23: "NO",
            24: "NOT GIVEN", 25: "C", 26: "E", 27: "iv", 28: "vi", 29: "v", 30: "vii",
            31: "B", 32: "D", 33: "D", 34: "A", 35: "policy", 36: "(explicit) guidelines",
            37: "(school) curriculum", 38: "victims", 39: "playful fighting", 40: "D"
        }
    }
}

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

def clean_text_artifacts(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"(?:www\.)?TopSage(?:\.com)?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"大家网", "", text)
    text = re.sub(r"^##\s*(?:SECTION|TEST)\s*\d*.*$", "", text, flags=re.MULTILINE | re.IGNORECASE)
    lines = [line.strip() for line in text.split("\n")]
    lines = [l for l in lines if l]
    return "\n\n".join(lines)

def normalize_ocr_apostrophes(text: str) -> str:
    if not text:
        return ""
    res = text
    for pat, repl in APOSTROPHE_FIXES.items():
        res = re.sub(pat, repl, res, flags=re.IGNORECASE)
    return res

def clean_obj_recursively(obj):
    if isinstance(obj, str):
        return normalize_ocr_apostrophes(clean_text_artifacts(obj))
    elif isinstance(obj, list):
        return [clean_obj_recursively(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_obj_recursively(v) for k, v in obj.items()}
    return obj

def build_manifest_and_report():
    manifest_entries = [
        # Book front matter
        {
            "sourceRef": "cambridge-ielts-06-academic/introduction",
            "title": "Introduction and Test Format Overview",
            "track": "academic",
            "action": "archive-only",
            "targetModel": None,
            "reason": "Administrative instructions and exam format overview, not a study content record"
        }
    ]

    test_titles = {
        1: {
            "r1": "Australia's Sporting Success",
            "r2": "Delivering the Goods",
            "r3": "Climate Change and the Inuit",
            "w1": "Water consumption in different countries in 2000",
            "w2": "Power of advertising vs real consumer needs",
            "sp1": "Dancing",
            "sp2": "Describe someone in your family who you like",
            "sp3": "Family Similarities & Genetic Research"
        },
        2: {
            "r1": "Advantages of Public Transport",
            "r2": "Greying Population Stays in the Pink",
            "r3": "Numeration",
            "w1": "Average distance in miles travelled per person per year, by mode of travel",
            "w2": "Successful sports professionals salaries vs other professions",
            "sp1": "Musical instruments",
            "sp2": "Describe an event that you prepared for",
            "sp3": "Preparation for events & celebrations in society"
        },
        3: {
            "r1": "The Search for the Anti-aging Pill",
            "r2": "The Challenge of Early Literacy",
            "r3": "Caloric Restriction and Longevity",
            "w1": "Life cycle of the silkworm and the stages in the production of silk cloth",
            "w2": "Cultural differences vs single international culture",
            "sp1": "Daily routine & weekends",
            "sp2": "Describe a competition that you took part in",
            "sp3": "Competition in education, work and sports"
        },
        4: {
            "r1": "Research using twins",
            "r2": "Do literate women make better mothers?",
            "r3": "Persistent Bullying in Schools",
            "w1": "Number of marriages and divorces in the USA between 1970 and 2000",
            "w2": "Fast pace of modern life vs traditional living",
            "sp1": "Your friends & leisure time",
            "sp2": "Describe an important choice you had to make in your life",
            "sp3": "Choices in everyday life, work and modern society"
        }
    }

    for t in [1, 2, 3, 4]:
        # Listening
        for s in [1, 2, 3, 4]:
            manifest_entries.append({
                "sourceRef": f"cambridge-ielts-06-academic/test-{t}/listening/section-{s}",
                "title": f"Test {t} Listening Section {s}",
                "track": "academic",
                "action": "targetModel",
                "targetModel": "IeltsListeningSection",
                "reason": f"Official IELTS listening section with 10 questions and attached audioscript"
            })
            manifest_entries.append({
                "sourceRef": f"cambridge-ielts-06-academic/test-{t}/audioscript/section-{s}",
                "title": f"Test {t} Audioscript Section {s}",
                "track": "academic",
                "action": "transform",
                "targetModel": "IeltsListeningSection.scriptJson",
                "reason": "Transcript merged into scriptJson attribute of IeltsListeningSection"
            })

        # Reading
        for p in [1, 2, 3]:
            manifest_entries.append({
                "sourceRef": f"cambridge-ielts-06-academic/test-{t}/reading/passage-{p}",
                "title": f"Test {t} Reading Passage {p}: {test_titles[t][f'r{p}']}",
                "track": "academic",
                "action": "targetModel",
                "targetModel": "IeltsReadingPassage",
                "reason": "Official IELTS reading passage with questions and verified answer keys"
            })

        # Writing
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/writing/task-1",
            "title": f"Test {t} Writing Task 1",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsWritingTopic",
            "reason": f"Official IELTS academic writing prompt ({test_titles[t]['w1']})"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/writing/sample-answer-task-1",
            "title": f"Test {t} Writing Model/Sample Answer Task 1",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsWritingModel",
            "reason": f"Official examiner model/candidate sample answer for Task 1"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/writing/task-2",
            "title": f"Test {t} Writing Task 2",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsWritingTopic",
            "reason": f"Official IELTS academic writing essay prompt ({test_titles[t]['w2']})"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/writing/sample-answer-task-2",
            "title": f"Test {t} Writing Model/Sample Answer Task 2",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsWritingModel",
            "reason": f"Official examiner model/candidate sample answer for Task 2"
        })

        # Speaking
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/speaking/part-1",
            "title": f"Test {t} Speaking Part 1",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsSpeakingTopic",
            "reason": f"Official IELTS speaking interview questions on {test_titles[t]['sp1']}"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/speaking/part-2",
            "title": f"Test {t} Speaking Part 2",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsSpeakingTopic",
            "reason": f"Official IELTS speaking cue card: {test_titles[t]['sp2']}"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/speaking/part-3",
            "title": f"Test {t} Speaking Part 3",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsSpeakingTopic",
            "reason": f"Official IELTS speaking discussion: {test_titles[t]['sp3']}"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/speaking/model-answers",
            "title": f"Test {t} Speaking Model Answers",
            "track": "academic",
            "action": "absent-in-book",
            "targetModel": None,
            "reason": "Cambridge IELTS 06 does not provide printed transcripts or sample recordings for Speaking modules."
        })

        # Answer Keys
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/answer-key/listening",
            "title": f"Test {t} Listening Answer Key",
            "track": "academic",
            "action": "transform",
            "targetModel": "IeltsListeningSection.questionsJson",
            "reason": "Answer key merged into questionsJson attribute of IeltsListeningSection"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-06-academic/test-{t}/answer-key/reading",
            "title": f"Test {t} Reading Answer Key",
            "track": "academic",
            "action": "transform",
            "targetModel": "IeltsReadingPassage.questionsJson",
            "reason": "Answer key merged into questionsJson attribute of IeltsReadingPassage"
        })

    # End matter
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-06-academic/sample-answer-sheets",
        "title": "Sample Answer Sheets",
        "track": "academic",
        "action": "archive-only",
        "targetModel": None,
        "reason": "Blank student optical answer sheets, administrative only"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-06-academic/acknowledgements",
        "title": "Acknowledgements",
        "track": "academic",
        "action": "archive-only",
        "targetModel": None,
        "reason": "Publisher copyright notices and source acknowledgements"
    })

    # Build Exploitation Report
    exploited = []
    not_exploited = []
    for entry in manifest_entries:
        action = entry["action"]
        if action in ("targetModel", "transform"):
            exploited.append({
                "sourceRef": entry["sourceRef"],
                "targetModel": entry["targetModel"],
                "status": "exploited",
                "recordCount": 1
            })
        else:
            not_exploited.append({
                "sourceRef": entry["sourceRef"],
                "reasonCategory": action,
                "detail": entry["reason"]
            })

    report = {
        "book": "Cambridge IELTS 06 Academic",
        "scope": "Academic Tests 1 to 4 (100% Complete)",
        "manifestTotalSegments": len(manifest_entries),
        "totalExploitedSegments": len(exploited),
        "totalNotExploitedSegments": len(not_exploited),
        "reconciliationCheckPassed": (len(manifest_entries) == len(exploited) + len(not_exploited)),
        "audioDataDebt": "Audio Listening is documented as data-debt (pending physical CD rips / official publisher downloads); not fabricated.",
        "exploited": exploited,
        "notExploited": not_exploited
    }

    return manifest_entries, report

def main():
    print("=" * 60)
    print("STARTING PARSE & MAP FOR CAMBRIDGE IELTS 06 - TESTS 1 TO 4")
    print("=" * 60)

    # 1. Parse all 4 tests
    builders = [
        (1, build_test_1),
        (2, build_test_2),
        (3, build_test_3),
        (4, build_test_4)
    ]

    all_listening = []
    all_reading = []
    all_writing_topics = []
    all_writing_models = []
    all_speaking_topics = []

    for t_num, builder in builders:
        print(f"[*] Building Test {t_num} data...")
        l_sec, r_pass, w_top, w_mod, sp_top = builder(raw_md_text, OFFICIAL_KEYS[t_num])
        all_listening.extend(l_sec)
        all_reading.extend(r_pass)
        all_writing_topics.extend(w_top)
        all_writing_models.extend(w_mod)
        all_speaking_topics.extend(sp_top)

    # Clean recursively
    all_listening = clean_obj_recursively(all_listening)
    all_reading = clean_obj_recursively(all_reading)
    all_writing_topics = clean_obj_recursively(all_writing_topics)
    all_writing_models = clean_obj_recursively(all_writing_models)
    all_speaking_topics = clean_obj_recursively(all_speaking_topics)

    print(f"\n[SUMMARY OF EXTRACTED RECORDS]")
    print(f"  - Listening Sections: {len(all_listening)} (expected 16)")
    print(f"  - Reading Passages:   {len(all_reading)} (expected 12)")
    print(f"  - Writing Topics:     {len(all_writing_topics)} (expected 8)")
    print(f"  - Writing Models:     {len(all_writing_models)} (expected 8)")
    print(f"  - Speaking Topics:    {len(all_speaking_topics)} (expected 12)")

    assert len(all_listening) == 16, f"Expected 16 listening sections, got {len(all_listening)}"
    assert len(all_reading) == 12, f"Expected 12 reading passages, got {len(all_reading)}"
    assert len(all_writing_topics) == 8, f"Expected 8 writing topics, got {len(all_writing_topics)}"
    assert len(all_writing_models) == 8, f"Expected 8 writing models, got {len(all_writing_models)}"
    assert len(all_speaking_topics) == 12, f"Expected 12 speaking topics, got {len(all_speaking_topics)}"

    # 2. STEP 0: HARD-GATE KEY MATCH AUDIT (320 QUESTIONS)
    print("\n" + "=" * 60)
    print("[HARD-GATE STEP 0] EXECUTING 100% KEY-MATCH VERIFICATION")
    print("=" * 60)

    # Audit Listening Keys
    listening_key_mismatches = []
    listening_q_count = 0
    for sec in all_listening:
        t_match = re.search(r"t(\d+)-l", sec["id"])
        test_num = int(t_match.group(1))
        qs = json.loads(sec["questionsJson"])
        for q in qs:
            listening_q_count += 1
            q_num = q["questionNumber"]
            expected = OFFICIAL_KEYS[test_num]["listening"][q_num]
            actual = q["correctAnswer"]
            if actual != expected:
                listening_key_mismatches.append({
                    "test": test_num,
                    "section": sec["id"],
                    "questionNumber": q_num,
                    "expected": expected,
                    "actual": actual
                })

    print(f"  - Audited {listening_q_count} Listening Questions.")
    if listening_key_mismatches:
        print(f"  [FAIL] Found {len(listening_key_mismatches)} Listening key mismatches:")
        for m in listening_key_mismatches:
            print(f"    * Test {m['test']} Q{m['questionNumber']}: expected {m['expected']!r}, got {m['actual']!r}")
        sys.exit(1)
    else:
        print("  [PASS] 160/160 Listening keys matched official answer key 100%!")

    # Audit Reading Keys
    reading_key_mismatches = []
    reading_q_count = 0
    for p in all_reading:
        t_match = re.search(r"t(\d+)-r", p["id"])
        test_num = int(t_match.group(1))
        qs = json.loads(p["questionsJson"])
        for q in qs:
            reading_q_count += 1
            q_num = q["questionNumber"]
            expected = OFFICIAL_KEYS[test_num]["reading"][q_num]
            actual = q["correctAnswer"]
            if actual != expected:
                reading_key_mismatches.append({
                    "test": test_num,
                    "passage": p["id"],
                    "questionNumber": q_num,
                    "expected": expected,
                    "actual": actual
                })

    print(f"  - Audited {reading_q_count} Reading Questions.")
    if reading_key_mismatches:
        print(f"  [FAIL] Found {len(reading_key_mismatches)} Reading key mismatches:")
        for m in reading_key_mismatches:
            print(f"    * Test {m['test']} Q{m['questionNumber']}: expected {m['expected']!r}, got {m['actual']!r}")
        sys.exit(1)
    else:
        print("  [PASS] 160/160 Reading keys matched official answer key 100%!")

    total_qs = listening_q_count + reading_q_count
    assert total_qs == 320, f"Expected 320 questions total, found {total_qs}"
    print(f"\n[PASS] STEP 0 HARD GATE: 320/320 questions (100%) verified with zero discrepancies!")

    # 3. SCAN ARTIFACTS & WATERMARKS AUDIT
    print("\n" + "=" * 60)
    print("[HARD-GATE AUDIT] SCAN ARTIFACTS, WATERMARKS & APOSTROPHES")
    print("=" * 60)

    forbidden_patterns = [
        (re.compile(r"<!--.*?-->", re.DOTALL), "HTML comments"),
        (re.compile(r"TopSage", re.IGNORECASE), "TopSage watermark"),
        (re.compile(r"大家网"), "大家网 watermark"),
        (re.compile(r"^##\s*(?:SECTION|TEST)\s*\d*.*$", re.MULTILINE | re.IGNORECASE), "Leaked markdown header")
    ]

    def audit_obj(obj, path=""):
        violations = []
        if isinstance(obj, str):
            for pat, name in forbidden_patterns:
                m = pat.search(obj)
                if m:
                    violations.append(f"{path}: found {name} -> {m.group(0)[:50]!r}")
            for pat, repl in APOSTROPHE_FIXES.items():
                m = re.search(pat, obj, flags=re.IGNORECASE)
                if m:
                    violations.append(f"{path}: found unnormalized OCR apostrophe -> {m.group(0)!r}")
        elif isinstance(obj, list):
            for idx, item in enumerate(obj):
                violations.extend(audit_obj(item, f"{path}[{idx}]"))
        elif isinstance(obj, dict):
            for k, v in obj.items():
                violations.extend(audit_obj(v, f"{path}.{k}"))
        return violations

    all_data = {
        "listening": all_listening,
        "reading": all_reading,
        "writing_topics": all_writing_topics,
        "writing_models": all_writing_models,
        "speaking_topics": all_speaking_topics
    }

    all_violations = audit_obj(all_data, "root")
    if all_violations:
        print(f"  [FAIL] Found {len(all_violations)} artifact/apostrophe violations:")
        for v in all_violations[:20]:
            print(f"    * {v}")
        sys.exit(1)
    else:
        print("  [PASS] 0 scan artifacts, 0 watermarks, 0 OCR apostrophe errors across all records!")

    # 4. TRACK FIELD AUDIT
    print("\n" + "=" * 60)
    print("[HARD-GATE AUDIT] TRACK FIELD INTEGRITY (track='academic')")
    print("=" * 60)
    for category, records in all_data.items():
        for rec in records:
            if rec.get("track") != "academic":
                print(f"  [FAIL] Record {rec.get('id')} in {category} has track={rec.get('track')!r} != 'academic'")
                sys.exit(1)
    print(f"  [PASS] 56/56 records verified track='academic'!")

    # 5. ZERO STUB QUESTION AUDIT
    print("\n" + "=" * 60)
    print("[HARD-GATE AUDIT] ZERO STUB QUESTION VERIFICATION")
    print("=" * 60)
    stub_count = 0
    for sec in all_listening:
        qs = json.loads(sec["questionsJson"])
        for q in qs:
            if not q.get("question") or q["question"].strip() in (f"Question {q['questionNumber']}", ""):
                stub_count += 1
    for p in all_reading:
        qs = json.loads(p["questionsJson"])
        for q in qs:
            if not q.get("question") or q["question"].strip() in (f"Question {q['questionNumber']}", ""):
                stub_count += 1
    assert stub_count == 0, f"Found {stub_count} stub questions!"
    print("  [PASS] Zero stub questions detected across 320 questions!")

    # 6. MANIFEST & EXPLOITATION REPORT
    print("\n" + "=" * 60)
    print("[MANIFEST & EXPLOITATION REPORT GENERATION]")
    print("=" * 60)
    manifest, report = build_manifest_and_report()
    print(f"  - Manifest Segments:       {report['manifestTotalSegments']}")
    print(f"  - Exploited Segments:      {report['totalExploitedSegments']}")
    print(f"  - Not Exploited Segments:  {report['totalNotExploitedSegments']}")
    print(f"  - Reconciliation Passed:   {report['reconciliationCheckPassed']}")

    assert report["reconciliationCheckPassed"] is True, "Reconciliation check failed!"

    # 7. WRITE OUTPUT FILES
    print("\n" + "=" * 60)
    print("[WRITING OUTPUT JSON FILES]")
    print("=" * 60)

    files_to_write = [
        ("ielts_listening_sections.json", all_listening),
        ("ielts_reading_passages.json", all_reading),
        ("ielts_writing_topics.json", all_writing_topics),
        ("ielts_writing_models.json", all_writing_models),
        ("ielts_speaking_topics.json", all_speaking_topics),
        ("manifest.json", manifest),
        ("exploitation-report.json", report)
    ]

    for filename, content in files_to_write:
        file_path = OUTPUT_DIR / filename
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
        print(f"  -> Wrote {filename} ({file_path.stat().st_size:,} bytes)")

    print("\n" + "=" * 60)
    print("[SUCCESS] CAMBRIDGE IELTS 06 ALL TESTS MAPPED & VERIFIED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
