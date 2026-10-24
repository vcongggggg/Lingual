import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-11"

print("=== VERIFYING DEFINITION OF DONE ===")

# 1. Manifest
with open(os.path.join(OUTPUT_DIR, "manifest.json"), "r", encoding="utf-8") as f:
    manifest = json.load(f)
print(f"1. Manifest total segments: {len(manifest)}")
assert len(manifest) == 87, f"Expected 87, got {len(manifest)}"
for idx, row in enumerate(manifest):
    assert row.get("sourceRef"), f"Row {idx} missing sourceRef"
    assert row.get("action"), f"Row {idx} missing action"
    assert row.get("reason"), f"Row {idx} missing reason"

# 2. Reading
with open(os.path.join(OUTPUT_DIR, "ielts_reading_passages.json"), "r", encoding="utf-8") as f:
    reading = json.load(f)
print(f"2. Reading passages count: {len(reading)}")
assert len(reading) == 3, f"Expected 3 passages, got {len(reading)}"
total_reading_q = 0
for p in reading:
    assert p.get("sourceRef"), f"Passage {p['id']} missing sourceRef"
    assert p.get("track") == "academic", f"Passage {p['id']} track is not academic"
    passages = json.loads(p["passageJson"])
    assert len(passages) >= 7, f"Passage {p['id']} has too few paragraphs"
    questions = json.loads(p["questionsJson"])
    total_reading_q += len(questions)
    for q in questions:
        assert q.get("questionNumber"), f"Missing questionNumber in {p['id']}"
        assert q.get("type"), f"Missing type in Q{q.get('questionNumber')}"
        assert q.get("question"), f"Missing question text in Q{q.get('questionNumber')}"
        assert q.get("correctAnswer"), f"Missing correctAnswer in Q{q.get('questionNumber')}"
        assert q.get("sourceRef"), f"Missing sourceRef in Q{q.get('questionNumber')}"
print(f"   Reading total questions: {total_reading_q} (all with stem, type, correctAnswer, sourceRef)")
assert total_reading_q == 40, f"Expected 40 reading questions, got {total_reading_q}"

# 3. Listening
with open(os.path.join(OUTPUT_DIR, "ielts_listening_sections.json"), "r", encoding="utf-8") as f:
    listening = json.load(f)
print(f"3. Listening sections count: {len(listening)}")
assert len(listening) == 4, f"Expected 4 sections, got {len(listening)}"
total_listening_q = 0
for s in listening:
    assert s.get("sourceRef"), f"Section {s['id']} missing sourceRef"
    scripts = json.loads(s["scriptJson"])
    script_len = sum(len(sc.get("textEn", "")) for sc in scripts)
    print(f"   {s['id']} script characters: {script_len}")
    assert script_len > 1000, f"Section {s['id']} script too short: {script_len}"
    questions = json.loads(s["questionsJson"])
    total_listening_q += len(questions)
    for q in questions:
        assert q.get("questionNumber"), f"Missing questionNumber in {s['id']}"
        assert q.get("type"), f"Missing type in Q{q.get('questionNumber')}"
        assert q.get("question"), f"Missing question text in Q{q.get('questionNumber')}"
        assert q.get("correctAnswer"), f"Missing correctAnswer in Q{q.get('questionNumber')}"
        assert q.get("sourceRef"), f"Missing sourceRef in Q{q.get('questionNumber')}"
print(f"   Listening total questions: {total_listening_q} (all with stem, type, correctAnswer, sourceRef)")
assert total_listening_q == 40, f"Expected 40 listening questions, got {total_listening_q}"

# 4. Writing Topics
with open(os.path.join(OUTPUT_DIR, "ielts_writing_topics.json"), "r", encoding="utf-8") as f:
    writing = json.load(f)
print(f"4. Writing topics count: {len(writing)}")
assert len(writing) == 2, f"Expected 2 writing topics, got {len(writing)}"
for w in writing:
    assert w.get("sourceRef"), f"Writing topic {w['id']} missing sourceRef"
    assert w.get("track") == "academic", f"Writing topic {w['id']} track is not academic"
    assert len(w.get("prompt", "")) > 50, f"Writing topic {w['id']} prompt too short"

# 5. Writing Models
with open(os.path.join(OUTPUT_DIR, "ielts_writing_models.json"), "r", encoding="utf-8") as f:
    models = json.load(f)
print(f"5. Writing models count: {len(models)}")
assert len(models) == 2, f"Expected 2 writing models, got {len(models)}"
for m in models:
    assert m.get("sourceRef"), f"Writing model {m['id']} missing sourceRef"
    assert m.get("task") in (1, 2), f"Invalid task in {m['id']}"
    assert m.get("bandEstimate") in (4.5, 5.5), f"Invalid bandEstimate in {m['id']}"
    assert len(m.get("modelAnswer", "")) > 100, f"Model answer too short in {m['id']}"
    assert len(m.get("examinerNotesVi", "")) > 50, f"Examiner notes too short in {m['id']}"

# 6. Speaking Topics
with open(os.path.join(OUTPUT_DIR, "ielts_speaking_topics.json"), "r", encoding="utf-8") as f:
    speaking = json.load(f)
print(f"6. Speaking topics count: {len(speaking)}")
assert len(speaking) == 3, f"Expected 3 speaking topics, got {len(speaking)}"
for sp in speaking:
    assert sp.get("sourceRef"), f"Speaking topic {sp['id']} missing sourceRef"
    assert sp.get("part") in (1, 2, 3), f"Invalid part in {sp['id']}"
    assert len(sp.get("question", "")) > 30, f"Question too short in {sp['id']}"

# 7. Exploitation Report
with open(os.path.join(OUTPUT_DIR, "exploitation-report.json"), "r", encoding="utf-8") as f:
    report = json.load(f)
print("7. Exploitation report:")
print(f"   Manifest total segments: {report['manifestTotalSegments']}")
print(f"   Total exploited segments: {report['totalExploitedSegments']}")
print(f"   Total not-exploited segments: {report['totalNotExploitedSegments']}")
print(f"   Reconciliation check passed: {report['reconciliationCheckPassed']}")
assert report['reconciliationCheckPassed'] is True
assert report['manifestTotalSegments'] == report['totalExploitedSegments'] + report['totalNotExploitedSegments']

# Verify reason category of every not-exploited segment
valid_reasons = {"absent-in-book", "archive-only", "data-debt", "parse-failed"}
for ne in report['notExploited']:
    assert ne.get("reasonCategory") in valid_reasons, f"Invalid reasonCategory: {ne.get('reasonCategory')}"
    assert ne.get("detail"), f"Missing detail in {ne.get('sourceRef')}"

print("\n🎉 ALL VERIFICATION CHECKS PASSED 100%!")
