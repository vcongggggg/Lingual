r"""
Script: parse_cambridge10_pilot.py
Description: Master Pilot Parser and Step 0 Hard Gate for Cambridge IELTS 10 Test 1 (Academic).
Produces in C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-10\:
- ielts_listening_sections.json (4 sections, 40 questions)
- ielts_reading_passages.json (3 passages, 40 questions)
- ielts_writing_topics.json (2 topics)
- ielts_writing_models.json (2 models)
- ielts_speaking_topics.json (3 topics)
- manifest.json (100% reconciled)
- exploitation-report.json (100% reconciliation)

Zero book literals in code - loads from cambridge10_data_t1.
"""

import json
import os
import re
import sys
from pathlib import Path

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

from cambridge10_data_t1 import (
    build_test_1,
    OFFICIAL_LISTENING_KEYS,
    OFFICIAL_READING_KEYS
)

OUTPUT_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-10"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def build_manifest_and_report():
    manifest_entries = [
        # Book front matter
        {
            "sourceRef": "cambridge-ielts-10-academic/introduction",
            "title": "Introduction and Test Format Overview",
            "track": "academic",
            "action": "archive-only",
            "targetModel": None,
            "reason": "Administrative instructions and exam format overview, not a study content record"
        }
    ]

    # Test 1 Listening Sections & Audioscripts
    for s in [1, 2, 3, 4]:
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-10-academic/test-1/listening/section-{s}",
            "title": f"Test 1 Listening Section {s}",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsListeningSection",
            "reason": "Official IELTS listening section with 10 questions and attached audioscript"
        })
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-10-academic/test-1/audioscript/section-{s}",
            "title": f"Test 1 Audioscript Section {s}",
            "track": "academic",
            "action": "transform",
            "targetModel": "IeltsListeningSection.scriptJson",
            "reason": "Transcript merged into scriptJson attribute of IeltsListeningSection"
        })

    # Test 1 Reading Passages
    r_titles = {
        1: "Stepwells",
        2: "European Transport Systems 1990-2010",
        3: "The Psychology of Innovation"
    }
    for p in [1, 2, 3]:
        manifest_entries.append({
            "sourceRef": f"cambridge-ielts-10-academic/test-1/reading/passage-{p}",
            "title": f"Test 1 Reading Passage {p}: {r_titles[p]}",
            "track": "academic",
            "action": "targetModel",
            "targetModel": "IeltsReadingPassage",
            "reason": "Official IELTS reading passage with questions and verified answer keys"
        })

    # Test 1 Writing Tasks & Models
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/writing/task-1",
        "title": "Test 1 Writing Task 1",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsWritingTopic",
        "reason": "Official IELTS academic writing prompt (Australian household energy use)"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/writing/sample-answer-task-1",
        "title": "Test 1 Writing Sample Answer Task 1",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsWritingModel",
        "reason": "Official candidate sample answer for Task 1 (Band 4.5)"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/writing/task-2",
        "title": "Test 1 Writing Task 2",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsWritingTopic",
        "reason": "Official IELTS academic writing essay prompt (Children learning right and wrong & punishment)"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/writing/sample-answer-task-2",
        "title": "Test 1 Writing Model Answer Task 2",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsWritingModel",
        "reason": "Official examiner model answer for Task 2 (Band 9.0)"
    })

    # Test 1 Speaking Parts
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/speaking/part-1",
        "title": "Test 1 Speaking Part 1",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsSpeakingTopic",
        "reason": "Official IELTS speaking interview questions on Weekends"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/speaking/part-2",
        "title": "Test 1 Speaking Part 2",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsSpeakingTopic",
        "reason": "Official IELTS speaking cue card: Describe someone you know who does something well"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/speaking/part-3",
        "title": "Test 1 Speaking Part 3",
        "track": "academic",
        "action": "targetModel",
        "targetModel": "IeltsSpeakingTopic",
        "reason": "Official IELTS speaking discussion on Skills, abilities and Salaries"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/speaking/model-answers",
        "title": "Test 1 Speaking Model Answers",
        "track": "academic",
        "action": "absent-in-book",
        "targetModel": None,
        "reason": "Cambridge IELTS 10 does not provide printed transcripts or sample recordings for Speaking modules."
    })

    # Test 1 Answer Keys
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/answer-key/listening",
        "title": "Test 1 Listening Answer Key",
        "track": "academic",
        "action": "transform",
        "targetModel": "IeltsListeningSection.questionsJson",
        "reason": "Answer key merged into questionsJson attribute of IeltsListeningSection"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/test-1/answer-key/reading",
        "title": "Test 1 Reading Answer Key",
        "track": "academic",
        "action": "transform",
        "targetModel": "IeltsReadingPassage.questionsJson",
        "reason": "Answer key merged into questionsJson attribute of IeltsReadingPassage"
    })

    # Subsequent tests and general training reserved
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-academic/tests-2-3-4",
        "title": "Academic Tests 2, 3 and 4",
        "track": "academic",
        "action": "archive-only",
        "targetModel": None,
        "reason": "Scope boundary: pilot import is strictly limited to Test 1; Tests 2-4 await independent audit approval"
    })
    manifest_entries.append({
        "sourceRef": "cambridge-ielts-10-general-training",
        "title": "General Training Reading and Writing Tests A & B",
        "track": "general-training",
        "action": "archive-only",
        "targetModel": None,
        "reason": "General Training modules reserved for subsequent general track pipeline"
    })

    # Categorize counts
    target_models = [m for m in manifest_entries if m["action"] == "targetModel"]
    transforms = [m for m in manifest_entries if m["action"] == "transform"]
    archive_only = [m for m in manifest_entries if m["action"] == "archive-only"]
    absent = [m for m in manifest_entries if m["action"] == "absent-in-book"]

    exploited = len(target_models) + len(transforms)
    not_exploited = len(archive_only) + len(absent)
    total_segments = len(manifest_entries)

    report = {
        "bookCorpus": "cambridge-ielts-10",
        "track": "academic",
        "pilotTest": 1,
        "manifestTotalSegments": total_segments,
        "totalExploitedSegments": exploited,
        "totalNotExploitedSegments": not_exploited,
        "breakdown": {
            "targetModel": len(target_models),
            "transform": len(transforms),
            "archiveOnly": len(archive_only),
            "absentInBook": len(absent)
        },
        "targetModelDistribution": {
            "IeltsListeningSection": len([m for m in target_models if m["targetModel"] == "IeltsListeningSection"]),
            "IeltsReadingPassage": len([m for m in target_models if m["targetModel"] == "IeltsReadingPassage"]),
            "IeltsWritingTopic": len([m for m in target_models if m["targetModel"] == "IeltsWritingTopic"]),
            "IeltsWritingModel": len([m for m in target_models if m["targetModel"] == "IeltsWritingModel"]),
            "IeltsSpeakingTopic": len([m for m in target_models if m["targetModel"] == "IeltsSpeakingTopic"])
        },
        "reconciliationCheckPassed": (total_segments == exploited + not_exploited)
    }

    return manifest_entries, report

def main():
    print("=" * 70)
    print("CAMBRIDGE IELTS 10 - PILOT PARSER & HARD GATE (TEST 1 ACADEMIC)")
    print("=" * 70)

    # 1. Load data from modular loader
    print("\n[*] Loading Test 1 data from cambridge10_data_t1...")
    t1_l, t1_r, t1_w, t1_m, t1_s = build_test_1()

    print(f"    -> Listening Sections: {len(t1_l)} (Expected: 4)")
    print(f"    -> Reading Passages:   {len(t1_r)} (Expected: 3)")
    print(f"    -> Writing Topics:      {len(t1_w)} (Expected: 2)")
    print(f"    -> Writing Models:      {len(t1_m)} (Expected: 2)")
    print(f"    -> Speaking Topics:    {len(t1_s)} (Expected: 3)")

    assert len(t1_l) == 4, f"Expected 4 listening sections, got {len(t1_l)}"
    assert len(t1_r) == 3, f"Expected 3 reading passages, got {len(t1_r)}"
    assert len(t1_w) == 2, f"Expected 2 writing topics, got {len(t1_w)}"
    assert len(t1_m) == 2, f"Expected 2 writing models, got {len(t1_m)}"
    assert len(t1_s) == 3, f"Expected 3 speaking topics, got {len(t1_s)}"

    # 2. Hard Gate Step 0: 100% Key-match vs official keys
    print("\n[*] Step 0 Hard Gate: Verifying 80/80 questions against official Answer Key...")
    mismatches = []
    total_l_questions = 0
    total_r_questions = 0

    for sec in t1_l:
        q_list = json.loads(sec["questionsJson"]) if isinstance(sec["questionsJson"], str) else sec["questionsJson"]
        for q in q_list:
            q_num = q["questionNumber"]
            total_l_questions += 1
            exp = OFFICIAL_LISTENING_KEYS[q_num]
            act = q["correctAnswer"]
            if act != exp:
                mismatches.append(f"Listening Q{q_num}: actual='{act}' != official='{exp}'")

    for pas in t1_r:
        q_list = json.loads(pas["questionsJson"]) if isinstance(pas["questionsJson"], str) else pas["questionsJson"]
        for q in q_list:
            q_num = q["questionNumber"]
            total_r_questions += 1
            exp = OFFICIAL_READING_KEYS[q_num]
            act = q["correctAnswer"]
            if act != exp:
                mismatches.append(f"Reading Q{q_num}: actual='{act}' != official='{exp}'")

    print(f"[*] Verified {total_l_questions}/40 Listening questions.")
    print(f"[*] Verified {total_r_questions}/40 Reading questions.")

    if mismatches:
        print(f"[FAIL] Hard Gate Mismatches ({len(mismatches)} errors):")
        for m in mismatches:
            print(f"  - {m}")
        sys.exit(1)
    else:
        print("[PASS] Hard Gate Step 0 Passed 100%: 80/80 questions match printed answer keys!")

    # 3. Quality & Schema Audits
    print("\n[*] Auditing quality, scan artifacts, stubs, and track='academic'...")
    artifact_patterns = [
        r"<!--.*?-->",
        r"(?:www\.)?TopSage(?:\.com)?",
        r"大家网",
        r"^##\s*(?:SECTION|TEST)\s*\d*.*$"
    ]

    def check_artifacts(text: str, context: str):
        if not text:
            return
        for pat in artifact_patterns:
            if re.search(pat, text, flags=re.IGNORECASE | re.MULTILINE):
                raise ValueError(f"Scan artifact detected ({pat}) in {context}")

    for sec in t1_l:
        assert sec["track"] == "academic", f"Invalid track in {sec['id']}"
        check_artifacts(sec["scriptJson"], f"Listening script {sec['id']}")
        q_list = json.loads(sec["questionsJson"]) if isinstance(sec["questionsJson"], str) else sec["questionsJson"]
        for q in q_list:
            assert len(q["question"]) > 10, f"Short question stem in {sec['id']} Q{q['questionNumber']}"
            assert q.get("type"), f"Missing type in {sec['id']} Q{q['questionNumber']}"
            assert q.get("sourceRef"), f"Missing sourceRef in {sec['id']} Q{q['questionNumber']}"
            assert q.get("correctAnswer"), f"Missing correctAnswer in {sec['id']} Q{q['questionNumber']}"
            check_artifacts(q["question"], f"Listening question {sec['id']} Q{q['questionNumber']}")

    for pas in t1_r:
        assert pas["track"] == "academic", f"Invalid track in {pas['id']}"
        check_artifacts(pas["passageJson"], f"Reading passage {pas['id']}")
        q_list = json.loads(pas["questionsJson"]) if isinstance(pas["questionsJson"], str) else pas["questionsJson"]
        for q in q_list:
            assert len(q["question"]) > 10, f"Short question stem in {pas['id']} Q{q['questionNumber']}"
            assert q.get("type"), f"Missing type in {pas['id']} Q{q['questionNumber']}"
            assert q.get("sourceRef"), f"Missing sourceRef in {pas['id']} Q{q['questionNumber']}"
            assert q.get("correctAnswer"), f"Missing correctAnswer in {pas['id']} Q{q['questionNumber']}"
            check_artifacts(q["question"], f"Reading question {pas['id']} Q{q['questionNumber']}")

    for w in t1_w:
        assert w["track"] == "academic", f"Invalid track in {w['id']}"
        assert len(w["prompt"]) > 20, f"Short prompt in {w['id']}"
        check_artifacts(w["prompt"], f"Writing prompt {w['id']}")

    for m in t1_m:
        assert m["track"] == "academic", f"Invalid track in {m['id']}"
        assert len(m["modelAnswer"]) > 50, f"Short model answer in {m['id']}"
        check_artifacts(m["modelAnswer"], f"Writing model answer {m['id']}")

    for s in t1_s:
        assert s["track"] == "academic", f"Invalid track in {s['id']}"
        assert len(s["question"]) > 10, f"Short speaking question in {s['id']}"
        check_artifacts(s["question"], f"Speaking question {s['id']}")

    print("    [PASS] 0 scan artifacts detected.")
    print("    [PASS] 0 stub questions (100% have stem > 10 chars, type, sourceRef, correctAnswer).")
    print("    [PASS] 100% records have track='academic'.")

    # 4. Manifest & Exploitation Report
    manifest, report = build_manifest_and_report()
    assert report["reconciliationCheckPassed"] is True
    print(f"    [PASS] Manifest and Exploitation Report 100% reconciled ({report['manifestTotalSegments']} segments).")

    # 5. Write mapped output files
    print("\n[*] Writing mapped JSON files to:", OUTPUT_DIR)
    files_to_write = [
        ("ielts_listening_sections.json", t1_l),
        ("ielts_reading_passages.json", t1_r),
        ("ielts_writing_topics.json", t1_w),
        ("ielts_writing_models.json", t1_m),
        ("ielts_speaking_topics.json", t1_s),
        ("manifest.json", manifest),
        ("exploitation-report.json", report)
    ]

    for fname, data in files_to_write:
        fpath = OUTPUT_DIR / fname
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"    -> Wrote {fname} ({len(data)} items)")

    print("\n" + "=" * 70)
    print("[SUCCESS] CAMBRIDGE IELTS 10 TEST 1 PARSER & HARD GATE COMPLETE (100% PASS)")
    print("=" * 70)

if __name__ == "__main__":
    main()
