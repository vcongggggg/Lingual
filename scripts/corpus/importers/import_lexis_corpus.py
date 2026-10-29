# -*- coding: utf-8 -*-
r"""
Script: import_lexis_corpus.py
Description: Full Lexis phase importer into local PostgreSQL DB (linguaflow_db).
             Imports Collins Vocabulary for IELTS, Collocations in Use Intermediate,
             Cambridge Vocabulary for IELTS Advanced, and Smart English 1.
Task ID: lingual-lexis-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates 4 part files and concatenates into lexis_full_draft.json
  + Verifies full concatenated file hash 683c25267ba597e2a6bd834d3a4126f9f3babe218548c227dbabb3bf97c56266
  + Validates manifest (ae8fcc6b11c12d02e0753a12001871b675e98c1365a6b499abeba99b6300b280)
  + Validates notes (9ea12f9259b6bddb6352c7a8f2c379fe9136198341832346cef7b7ca49693ccd)
- Gate 1 Pre-import Hard Gate:
  + Reads current counts of vocabularies, collocations, phrasal_verbs, lexis_questions
  + lexis_questions must be exactly 0 (STOP if != 0)
  + Checks existing Lexis entries in DB (must be 0)
- Pre-insert Counts Verification:
  + 131 sections across 4 sources
  + 1,602 entries (Collins 267 + Collocations 707 + Vocab Advanced 560 + Smart 68)
  + 2,961 question items (2,742 mapped + 219 gaps read from gaps[])
- Insertion:
  + 895 entries into vocabularies (Collins 267, CVA 560, Smart 68)
  + 707 entries into collocations (Collocations 707)
  + 2,961 questions into lexis_questions (2,742 mapped + 219 gaps with correctAnswer=null)
- Gate 3 Post-import Verification:
  + Target counts verified
  + Real DB spot-checks verified
"""

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
import psycopg2
from psycopg2.extras import execute_batch

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parents[3]
IMPORTERS_DIR = Path(__file__).resolve().parent

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "lexis"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE0_EXPECTED_PARTS = {
    "lexis_full_draft.json.part1": "282c795ffa6aeffb3e3899c7f29314a0227d7c5ca8dc0f4cc9f08f039d947e50",
    "lexis_full_draft.json.part2": "c48f8e85faf2c25e362400a0238b92bea3a54512a4568bda909bb526feb44cde",
    "lexis_full_draft.json.part3": "d46856c466cc117ffbfd5f1f3628ba80d4ed0dfa44c7edd76d5b37a257a8d4b6",
    "lexis_full_draft.json.part4": "ca8ec2cb39ee941c49c22916cb78e670405ea4dee3cceef1f5529d671161df5d",
    "lexis_manifest.json": "ae8fcc6b11c12d02e0753a12001871b675e98c1365a6b499abeba99b6300b280",
    "lexis_full_notes.md": "9ea12f9259b6bddb6352c7a8f2c379fe9136198341832346cef7b7ca49693ccd"
}

GATE0_EXPECTED_FULL_DRAFT_HASH = "683c25267ba597e2a6bd834d3a4126f9f3babe218548c227dbabb3bf97c56266"

DELTA_VOCABULARIES = 895
DELTA_COLLOCATIONS = 707
DELTA_QUESTIONS = 2961

SRC_SLUGS = {
    "collins-vocabulary-for-ielts": "collins",
    "collocations-in-use-intermediate": "colloc",
    "cambridge-vocab-advanced": "cva",
    "smart-english-1": "smart"
}

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def verify_gate0():
    print("=" * 80)
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN LEXIS PHASE")
    print("=" * 80)

    results = {}
    has_mismatch = False

    for fname, exp_hash in GATE0_EXPECTED_PARTS.items():
        fpath = MAPPED_DIR / fname
        if not fpath.exists():
            print(f"  {fname:46}: KHÔNG TÌM THẤY TỆP! [FILE MISSING]")
            results[fname] = {"status": "MISSING", "actual": None, "expected": exp_hash}
            has_mismatch = True
            continue

        act_hash = sha256_file(fpath)
        match = (act_hash == exp_hash.lower())
        status = "MATCH" if match else "MISMATCH"
        print(f"  {fname:46}: [{status}]")
        print(f"    Thực tế: {act_hash}")
        print(f"    Kỳ vọng: {exp_hash}")
        results[fname] = {"status": status, "actual": act_hash, "expected": exp_hash}
        if not match:
            has_mismatch = True

    if has_mismatch:
        return False, results

    # Concatenate 4 parts
    full_draft_path = MAPPED_DIR / "lexis_full_draft.json"
    print("\n--- NỐI 4 PHẦN THÀNH lexis_full_draft.json ---")
    with open(full_draft_path, "wb") as out_f:
        for p in ["lexis_full_draft.json.part1", "lexis_full_draft.json.part2", "lexis_full_draft.json.part3", "lexis_full_draft.json.part4"]:
            with open(MAPPED_DIR / p, "rb") as in_f:
                out_f.write(in_f.read())

    full_hash = sha256_file(full_draft_path)
    match_full = (full_hash == GATE0_EXPECTED_FULL_DRAFT_HASH.lower())
    status_full = "MATCH" if match_full else "MISMATCH"
    print(f"  lexis_full_draft.json                     : [{status_full}]")
    print(f"    Thực tế: {full_hash}")
    print(f"    Kỳ vọng: {GATE0_EXPECTED_FULL_DRAFT_HASH}")
    results["lexis_full_draft.json"] = {"status": status_full, "actual": full_hash, "expected": GATE0_EXPECTED_FULL_DRAFT_HASH}

    if not match_full:
        return False, results

    return True, results

def verify_gate1(conn):
    print("\n" + "=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI INSERT: BASE COUNTS & ZERO CHECK")
    print("=" * 80)

    cur = conn.cursor()

    cur.execute('SELECT count(*) FROM "vocabularies"')
    base_vocab = cur.fetchone()[0]

    cur.execute('SELECT count(*) FROM "collocations"')
    base_colloc = cur.fetchone()[0]

    cur.execute('SELECT count(*) FROM "phrasal_verbs"')
    base_phrasal = cur.fetchone()[0]

    cur.execute('SELECT count(*) FROM "lexis_questions"')
    base_lexq = cur.fetchone()[0]

    print(f"Base vocabularies:   {base_vocab}")
    print(f"Base collocations:   {base_colloc}")
    print(f"Base phrasal_verbs:  {base_phrasal}")
    print(f"Base lexis_questions:{base_lexq} (Kỳ vọng: 0)")

    if base_lexq != 0:
        cur.close()
        raise AssertionError(f"Gate 1 Error: lexis_questions is not empty ({base_lexq} rows)! Possible partial import. STOPPING.")

    # Deduplication check for Lexis entries
    cur.execute("SELECT count(*) FROM vocabularies WHERE id LIKE 'vocab-collins-%' OR id LIKE 'vocab-cva-%' OR id LIKE 'vocab-smart-%'")
    cnt_v = cur.fetchone()[0]
    if cnt_v > 0:
        cur.close()
        raise AssertionError(f"Gate 1 Error: Found {cnt_v} existing Lexis entries in vocabularies! STOPPING to prevent duplicate insertion.")

    cur.execute("SELECT count(*) FROM collocations WHERE id LIKE 'col-colloc-%'")
    cnt_c = cur.fetchone()[0]
    if cnt_c > 0:
        cur.close()
        raise AssertionError(f"Gate 1 Error: Found {cnt_c} existing Lexis entries in collocations! STOPPING to prevent duplicate insertion.")

    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return {
        "vocabularies": base_vocab,
        "collocations": base_colloc,
        "phrasal_verbs": base_phrasal,
        "lexis_questions": base_lexq
    }

def parse_int_safe(val, default=1):
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        m = re.search(r'\d+', val)
        if m:
            return int(m.group(0))
    return default

def verify_pre_insert_data(data):
    print("\n" + "=" * 80)
    print("[PRE-INSERT VERIFICATION] XÁC THỰC HÌNH DẠNG & SỐ LƯỢNG TỪNG NGUỒN")
    print("=" * 80)

    sections = data.get("sections", [])
    assert len(sections) == 131, f"Expected 131 sections, got {len(sections)}"

    total_entries = 0
    total_mapped = 0
    total_gaps = 0

    per_source = {}
    for s in sections:
        src = s.get("source") or s.get("book")
        if src not in per_source:
            per_source[src] = {"sections": 0, "entries": 0, "mapped": 0, "gaps": 0}
        per_source[src]["sections"] += 1
        per_source[src]["entries"] += len(s.get("entries", []))
        per_source[src]["mapped"] += len(s.get("questions", []))
        per_source[src]["gaps"] += len(s.get("gaps", []))

        total_entries += len(s.get("entries", []))
        total_mapped += len(s.get("questions", []))
        total_gaps += len(s.get("gaps", []))

    for src, cnts in per_source.items():
        print(f"  {src:35}: sections={cnts['sections']:2}, entries={cnts['entries']:3}, mapped={cnts['mapped']:4}, gaps={cnts['gaps']:3}")

    print(f"\nTổng số sections:       {len(sections)} (Kỳ vọng: 131)")
    print(f"Tổng số entries:        {total_entries} (Kỳ vọng: 1602)")
    print(f"Tổng số mapped q:       {total_mapped} (Kỳ vọng: 2742)")
    print(f"Tổng số gaps q:         {total_gaps} (Kỳ vọng: 219)")
    print(f"Tổng số question items: {total_mapped + total_gaps} (Kỳ vọng: 2961)")

    assert total_entries == 1602, f"Expected 1602 entries, got {total_entries}"
    assert total_mapped == 2742, f"Expected 2742 mapped questions, got {total_mapped}"
    assert total_gaps == 219, f"Expected 219 gaps, got {total_gaps}"
    assert total_mapped + total_gaps == 2961, f"Expected 2961 question items, got {total_mapped + total_gaps}"

    print("[PASS] PRE-INSERT VERIFICATION ĐÃ VƯỢT QUA 100%!")
    return True

def run_import(force_bypass_gate0=False, dry_run=False):
    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 0: Gate 0 SHA Check
        gate0_passed, gate0_results = verify_gate0()
        if not gate0_passed and not force_bypass_gate0:
            print("\n[STOP TRIGGERED] GATE 0 SHA MISMATCH! DỪNG LẠI THEO QUY TẮC AN TOÀN.")
            return False, gate0_results, None

        # Step 1: Gate 1 Base Counts Check
        base_counts = verify_gate1(conn)

        # Step 2: Load Lexis Data
        draft_path = MAPPED_DIR / "lexis_full_draft.json"
        with open(draft_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(data)

        # Step 3: Prepare Rows for Insertion
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT LEXIS PHASE VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()

        vocab_rows = []
        colloc_rows = []
        question_rows = []

        sections = data.get("sections", [])
        for s in sections:
            src = s.get("source") or s.get("book")
            slug = SRC_SLUGS.get(src, src)
            unit_val = s.get("unitNumber", 0)
            unit_str = f"u{unit_val:02d}" if isinstance(unit_val, int) else f"u{unit_val}"
            topic_title = s.get("title", f"Unit {unit_val}")

            # Determine CEFR level
            if slug == "collins":
                cefr_level = "B2"
                content_type = "vocabulary"
            elif slug == "colloc":
                cefr_level = "B1"
                content_type = "collocation"
            elif slug == "cva":
                cefr_level = "C1"
                content_type = "vocabulary"
            elif slug == "smart":
                cefr_level = "A1"
                content_type = "vocabulary"
            else:
                cefr_level = "B1"
                content_type = "vocabulary"

            # 3.1 Process Entries
            for idx, e in enumerate(s.get("entries", [])):
                word = e.get("word", "").strip()
                pos = e.get("partOfSpeech")
                definition = e.get("definition")
                example = e.get("example")
                source_ref = e.get("sourceRef")
                phonetic = e.get("phonetic")

                if slug == "colloc":
                    cid = f"col-{slug}-{unit_str}-{idx+1:03d}"
                    colloc_type = e.get("type", "verb+noun")
                    colloc_rows.append((
                        cid, word, colloc_type, "", definition,
                        example, None, cefr_level, src, source_ref,
                        True, now
                    ))
                else:
                    vid = f"vocab-{slug}-{unit_str}-{idx+1:03d}"
                    vocab_rows.append((
                        vid, None, None, cefr_level, word,
                        "", phonetic, None, None, pos,
                        None, example, None, "[]", "[]", "[]",
                        None, "general", "published", None, None,
                        definition, None, src, source_ref, None,
                        "[]", None
                    ))

            # 3.2 Process Mapped Questions
            for q in s.get("questions", []):
                sub = str(q.get("subsection", "main")).replace(" ", "-").replace("/", "-")
                it_val = q.get("itemNumber", 1)
                it_str = str(it_val)
                it_int = parse_int_safe(it_val, 1)

                qid = f"lexq-{slug}-{unit_str}-{sub}-q{it_str}"
                prompt_text = q.get("question", "").strip()
                options_val = q.get("options")
                options_json = json.dumps(options_val, ensure_ascii=False) if options_val is not None else None
                correct_ans = q.get("correctAnswer")
                if correct_ans is not None:
                    correct_ans = str(correct_ans).strip()

                q_type = q.get("type")
                source_ref = q.get("sourceRef")
                script_val = q.get("scriptJson")
                if isinstance(script_val, (list, dict)):
                    script_json = json.dumps(script_val, ensure_ascii=False)
                else:
                    script_json = script_val
                note_text = q.get("note")

                question_rows.append((
                    qid, content_type, topic_title, None, prompt_text,
                    options_json, correct_ans, None, None, cefr_level,
                    source_ref, it_int, q_type, None, script_json, note_text, now
                ))

            # 3.3 Process Gaps (from gaps[])
            for g in s.get("gaps", []):
                sub = str(g.get("subsection", "gap")).replace(" ", "-").replace("/", "-")
                it_val = g.get("itemNumber", 1)
                it_str = str(it_val)
                it_int = parse_int_safe(it_val, 1)

                qid = f"lexq-{slug}-{unit_str}-{sub}-gap-q{it_str}"
                prompt_text = g.get("question", "").strip()
                gap_reason = g.get("gapReason") or g.get("reason")
                source_ref = g.get("sourceRef")
                q_type = g.get("type")

                question_rows.append((
                    qid, content_type, topic_title, None, prompt_text,
                    None, None, None, None, cefr_level,
                    source_ref, it_int, q_type, gap_reason, None, None, now
                ))

        # Clean existing records for safety / idempotency
        cur.execute("DELETE FROM vocabularies WHERE id LIKE 'vocab-collins-%' OR id LIKE 'vocab-cva-%' OR id LIKE 'vocab-smart-%'")
        cur.execute("DELETE FROM collocations WHERE id LIKE 'col-colloc-%'")
        cur.execute("DELETE FROM lexis_questions WHERE id LIKE 'lexq-%'")

        # 3.4 Execute Inserts
        # Vocabularies
        vocab_sql = """
            INSERT INTO vocabularies (
                id, "lessonId", "subTopicId", "cefrLevel", "targetText",
                translation, phonetic, "phoneticUs", "phoneticUk", "partOfSpeech",
                "audioUrl", "exampleSentence", "exampleTranslation", "collocationsJson", "synonymsJson", "antonymsJson",
                "frequencyRank", category, status, "createdBy", "exampleAudioUrl",
                meaning_en, meaning_vi_source, source, "sourceRef", license,
                word_family_json, "wordFormsJson"
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s
            )
        """
        execute_batch(cur, vocab_sql, vocab_rows, page_size=1000)
        print(f"Đã insert vào vocabularies: {len(vocab_rows)} (Kỳ vọng: 895)")
        assert len(vocab_rows) == DELTA_VOCABULARIES, f"Expected {DELTA_VOCABULARIES} vocab rows, got {len(vocab_rows)}"

        # Collocations
        colloc_sql = """
            INSERT INTO collocations (
                id, collocation, type, "meaningVi", "meaningEn",
                "exampleEn", "exampleVi", "cefrLevel", source, "sourceRef",
                verified, "createdAt"
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s
            )
        """
        execute_batch(cur, colloc_sql, colloc_rows, page_size=1000)
        print(f"Đã insert vào collocations: {len(colloc_rows)} (Kỳ vọng: 707)")
        assert len(colloc_rows) == DELTA_COLLOCATIONS, f"Expected {DELTA_COLLOCATIONS} colloc rows, got {len(colloc_rows)}"

        # Lexis Questions
        lexq_sql = """
            INSERT INTO lexis_questions (
                id, "contentType", topic, "topicVi", prompt,
                "optionsJson", "correctAnswer", "explanationEn", "explanationVi", "cefrLevel",
                "sourceRef", "questionNumber", type, "gapReason", "scriptJson", note, "createdAt"
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s
            )
        """
        execute_batch(cur, lexq_sql, question_rows, page_size=1000)
        print(f"Đã insert vào lexis_questions: {len(question_rows)} (Kỳ vọng: 2961)")
        assert len(question_rows) == DELTA_QUESTIONS, f"Expected {DELTA_QUESTIONS} questions, got {len(question_rows)}"

        target_counts = {
            "vocabularies": base_counts["vocabularies"] + DELTA_VOCABULARIES,
            "collocations": base_counts["collocations"] + DELTA_COLLOCATIONS,
            "phrasal_verbs": base_counts["phrasal_verbs"],
            "lexis_questions": base_counts["lexis_questions"] + DELTA_QUESTIONS
        }

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur, target_counts)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results, base_counts

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công 1602 entries và 2961 câu hỏi Lexis vào database!")

        # Step 4: Gate 3 Post-import Verification
        verify_gate3(cur, target_counts)
        return True, gate0_results, base_counts

    except Exception as e:
        conn.rollback()
        print(f"\n[FATAL ERROR] Rollback transaction do lỗi: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def verify_gate3(cur, target_counts):
    print("\n" + "=" * 80)
    print("[GATE 3] KIỂM TRA ĐÍCH SỐ LƯỢNG SAU INSERT & SPOT-CHECKS")
    print("=" * 80)

    # 1. Target Counts
    for tbl, exp_cnt in target_counts.items():
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        act_cnt = cur.fetchone()[0]
        match = (act_cnt == exp_cnt)
        print(f"  {tbl:18}: {act_cnt:6} [MATCH {exp_cnt}: {match}]")
        assert match, f"Gate 3 Target mismatch for {tbl}: actual={act_cnt}, expected={exp_cnt}"

    # 2. Spot-checks
    print("\n--- SPOT-CHECKS NỘI DUNG THỰC TẾ TỪ DATABASE ---")

    # (a) 1 cau Collins U3 present voi dap an mapped
    cur.execute("SELECT id, prompt, \"correctAnswer\" FROM lexis_questions WHERE id = 'lexq-collins-u03-ex1-q1'")
    q_c3 = cur.fetchone()
    assert q_c3 is not None, "Question lexq-collins-u03-ex1-q1 not found in DB"
    print(f"  (a) Collins U3 Q1: id='{q_c3[0]}', answer='{q_c3[2]}' [MATCH: b]")
    assert q_c3[2] == "b", f"Expected answer 'b', got '{q_c3[2]}'"

    # (b) 1 entry Vocab Advanced co definition=null (meaning_en IS NULL, khong bia)
    cur.execute("SELECT id, \"targetText\", meaning_en, source FROM vocabularies WHERE id = 'vocab-cva-u01-001'")
    v_cva = cur.fetchone()
    assert v_cva is not None, "Entry vocab-cva-u01-001 not found in DB"
    print(f"  (b) CVA U1 adolescent: targetText='{v_cva[1]}', meaning_en={v_cva[2]} [MATCH: None / null]")
    assert v_cva[2] is None, f"Expected meaning_en to be None, got '{v_cva[2]}'"

    # (c) 1 gap item Collocations lay tu gaps[] present voi correctAnswer=null
    cur.execute("""
        SELECT id, prompt, "correctAnswer", "gapReason"
        FROM lexis_questions
        WHERE "contentType" = 'collocation' AND "correctAnswer" IS NULL
        LIMIT 1
    """)
    g_col = cur.fetchone()
    assert g_col is not None, "Collocation gap question not found in DB"
    print(f"  (c) Collocations gap: id='{g_col[0]}', correctAnswer={g_col[2]}, gapReason='{g_col[3][:50]}...' [MATCH]")
    assert g_col[2] is None, "Expected correctAnswer to be None"
    assert g_col[3] is not None and len(g_col[3]) > 0, "Expected non-empty gapReason"

    # (d) Smart English 1: 68 tu rieng biet, 0 LexisQuestion tu Smart
    cur.execute("SELECT count(*) FROM vocabularies WHERE source = 'smart-english-1'")
    cnt_smart_v = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM lexis_questions WHERE id LIKE 'lexq-smart-%'")
    cnt_smart_q = cur.fetchone()[0]
    print(f"  (d) Smart English 1: {cnt_smart_v}/68 vocabularies, {cnt_smart_q}/0 lexis_questions [MATCH]")
    assert cnt_smart_v == 68, f"Expected 68 Smart English vocabularies, got {cnt_smart_v}"
    assert cnt_smart_q == 0, f"Expected 0 Smart English questions, got {cnt_smart_q}"

    # (e) Total mapped vs gap in lexis_questions
    cur.execute('SELECT count(*) FROM lexis_questions WHERE "correctAnswer" IS NOT NULL')
    mapped_q_cnt = cur.fetchone()[0]
    cur.execute('SELECT count(*) FROM lexis_questions WHERE "correctAnswer" IS NULL')
    gap_q_cnt = cur.fetchone()[0]
    print(f"  (e) lexis_questions breakdown: mapped={mapped_q_cnt}/2742, gaps={gap_q_cnt}/219 [MATCH]")
    assert mapped_q_cnt == 2742, f"Expected 2742 mapped questions, got {mapped_q_cnt}"
    assert gap_q_cnt == 219, f"Expected 219 gap questions, got {gap_q_cnt}"

    print("\n[PASS] GATE 3 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Lexis Phase Corpus into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
