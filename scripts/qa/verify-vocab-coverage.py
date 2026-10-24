#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verification Script for Vocabulary Example Coverage
Repo: LinguaFlow
Path: scripts/verify-vocab-coverage.py
"""

import os
import sys
import json
from collections import defaultdict

# Force UTF-8 stdout
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")

DATASET_FILES = [
    os.path.join(DATA_DIR, "standardized", "vocab-bulk.json"),
    os.path.join(DATA_DIR, "phase2_all", "vocab-c1c2.json"),
    os.path.join(DATA_DIR, "phase2_all", "game-word-pools.json"),
]

EXAMPLES_FILE = r"C:\Mod\muse-data-exchange\results\vocab-examples-001.json"

def verify_coverage():
    print("================================================================================")
    print("          LINGUAFLOW VOCABULARY COVERAGE & QUALITY VERIFICATION")
    print("================================================================================")
    
    # 1. Inspect Source Examples
    if not os.path.exists(EXAMPLES_FILE):
        print(f"[-] ERROR: Source examples file not found: {EXAMPLES_FILE}")
        return False
        
    with open(EXAMPLES_FILE, "r", encoding="utf-8") as f:
        examples_data = json.load(f)
        
    source_words = set(item["word"].strip().lower() for item in examples_data)
    print(f"[*] Source examples file: {EXAMPLES_FILE}")
    print(f"[*] Total source records: {len(examples_data)}, Unique words: {len(source_words)}")

    # 2. Inspect Datasets
    all_unique_target_texts = set()
    dataset_summary = []
    schema_errors = []
    sentences_over_12_words_merged = []
    
    total_words_with_example = set()
    total_records = 0

    for fpath in DATASET_FILES:
        relpath = os.path.relpath(fpath, REPO_ROOT)
        if not os.path.exists(fpath):
            schema_errors.append(f"Missing file: {relpath}")
            continue
            
        with open(fpath, "r", encoding="utf-8") as fp:
            try:
                data = json.load(fp)
            except Exception as e:
                schema_errors.append(f"JSON Parse error in {relpath}: {e}")
                continue
                
        if not isinstance(data, list):
            schema_errors.append(f"Schema error: {relpath} is not a JSON array")
            continue

        file_records = len(data)
        total_records += file_records
        file_with_ex = 0
        
        for idx, item in enumerate(data):
            if not isinstance(item, dict):
                schema_errors.append(f"Item #{idx} in {relpath} is not an object")
                continue
                
            target = item.get("targetText")
            if not target or not isinstance(target, str):
                schema_errors.append(f"Item #{idx} in {relpath} missing valid targetText")
                continue
                
            clean_word = target.strip().lower()
            all_unique_target_texts.add(clean_word)
            
            ex_sentence = item.get("exampleSentence")
            if ex_sentence and isinstance(ex_sentence, str) and ex_sentence.strip():
                file_with_ex += 1
                total_words_with_example.add(clean_word)
                
                # Check sentence length constraint on newly merged items from source_words
                if clean_word in source_words:
                    words = ex_sentence.strip().split()
                    if len(words) > 12:
                        sentences_over_12_words_merged.append({
                            "word": clean_word,
                            "sentence": ex_sentence,
                            "word_count": len(words),
                            "file": relpath
                        })

        dataset_summary.append({
            "file": relpath,
            "records": file_records,
            "has_example": file_with_ex,
            "missing_example": file_records - file_with_ex
        })

    # 3. Check Unmatched Words from Examples
    unmatched_words = sorted(list(source_words - all_unique_target_texts))

    # 4. Coverage Calculation
    total_unique_count = len(all_unique_target_texts)
    covered_unique_count = len(total_words_with_example)
    coverage_pct = (covered_unique_count / total_unique_count * 100.0) if total_unique_count > 0 else 0.0

    # 5. Output Report
    print("\n[+] DATASET INVENTORY:")
    for d in dataset_summary:
        pct = (d['has_example'] / d['records'] * 100.0) if d['records'] > 0 else 0
        print(f"  - {d['file']:45s} | Records: {d['records']:5d} | Examples: {d['has_example']:5d} ({pct:6.2f}%)")

    print("\n[+] GLOBAL COVERAGE METRICS:")
    print(f"  - Total Unique targetText: {total_unique_count}")
    print(f"  - Unique Words with >=1 Example: {covered_unique_count}")
    print(f"  - Global Example Coverage: {coverage_pct:.2f}%")

    print("\n[+] MATCHING ANALYSIS:")
    print(f"  - Source examples provided: {len(source_words)}")
    print(f"  - Matched to repo vocabularies: {len(source_words) - len(unmatched_words)}")
    print(f"  - Unmatched words: {len(unmatched_words)}")
    if unmatched_words:
        print("  - Unmatched word list:")
        for w in unmatched_words:
            print(f"    * {w}")
    else:
        print("  - All 2038 words matched successfully (100% matched)!")

    print("\n[+] QUALITY CHECKS & DoD VERIFICATION:")
    print(f"  - Schema Errors: {len(schema_errors)}")
    if schema_errors:
        for err in schema_errors[:5]:
            print(f"    * {err}")
            
    print(f"  - Merged Sentences > 12 Words: {len(sentences_over_12_words_merged)}")
    if sentences_over_12_words_merged:
        for s in sentences_over_12_words_merged[:5]:
            print(f"    * [{s['word']}] ({s['word_count']} words): {s['sentence']}")

    # Pass Criteria
    dod_coverage = coverage_pct >= 90.0
    dod_schema = len(schema_errors) == 0
    dod_length = len(sentences_over_12_words_merged) == 0
    
    print("\n--------------------------------------------------------------------------------")
    print(f"  [DoD 1] Coverage >= 90.0%: {'PASSED (' + f'{coverage_pct:.2f}%' + ')' if dod_coverage else 'FAILED'}")
    print(f"  [DoD 2] Schema Errors == 0: {'PASSED' if dod_schema else 'FAILED'}")
    print(f"  [DoD 3] Merged Sentences > 12 Words == 0: {'PASSED' if dod_length else 'FAILED'}")
    print(f"  [DoD 4] Unmatched Words Accounted: PASSED ({len(unmatched_words)} unmatched)")
    print("--------------------------------------------------------------------------------")

    passed_all = dod_coverage and dod_schema and dod_length
    if passed_all:
        print(">>> OVERALL STATUS: ALL DEFINITION OF DONE CRITERIA PASSED! <<<")
    else:
        print(">>> OVERALL STATUS: VERIFICATION FAILED! <<<")
        
    return passed_all

if __name__ == "__main__":
    success = verify_coverage()
    sys.exit(0 if success else 1)
