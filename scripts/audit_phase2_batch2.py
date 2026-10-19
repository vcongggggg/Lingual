import json
import os
import sys

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DATA_DIR = os.path.join("data", "phase2_batch2")

def audit():
    print("="*60)
    print("BƯỚC 2: REVIEW MẪU BẮT BUỘC (DATA PHASE 2 - ĐỢT 4A)")
    print("="*60)

    # 1. Grammar Questions (10 samples)
    with open(os.path.join(DATA_DIR, "grammar-questions-batch2.json"), "r", encoding="utf-8") as f:
        grammar = json.load(f)
    print(f"\n--- 1. GRAMMAR QUESTIONS (Total: {len(grammar)}) - 10 samples ---")
    sample_g = grammar[:10]
    for idx, q in enumerate(sample_g, 1):
        print(f"[{idx}] ID: {q.get('id')} | Level: {q.get('cefrLevel')} | Topic: {q.get('topic')}")
        print(f"    Q: {q.get('question')}")
        print(f"    Options: {q.get('options')}")
        print(f"    Correct: {q.get('correctAnswer')}")
        print(f"    Exp: {q.get('explanationVi')}")

    # 2. Shadowing Sentences (5 samples)
    with open(os.path.join(DATA_DIR, "shadowing-sentences-batch2.json"), "r", encoding="utf-8") as f:
        shadowing = json.load(f)
    print(f"\n--- 2. SHADOWING SENTENCES (Total: {len(shadowing)}) - 5 samples ---")
    sample_s = shadowing[:5]
    for idx, s in enumerate(sample_s, 1):
        print(f"[{idx}] ID: {s.get('id')} | Level: {s.get('cefrLevel')} | Topic: {s.get('topic')}")
        print(f"    EN: {s.get('textEn')}")
        print(f"    VI: {s.get('textVi')}")
        print(f"    IPA: {s.get('phonetic')}")

    # 3. Dialogues (2 samples)
    with open(os.path.join(DATA_DIR, "dialogues-batch2.json"), "r", encoding="utf-8") as f:
        dialogues = json.load(f)
    print(f"\n--- 3. DIALOGUES (Total: {len(dialogues)}) - 2 samples ---")
    sample_d = dialogues[:2]
    for idx, d in enumerate(sample_d, 1):
        print(f"[{idx}] ID: {d.get('id')} | Title: {d.get('title')} | Topic: {d.get('topic')}")
        print(f"    Context: {d.get('contextDesc')}")
        lines = d.get('lines', [])
        print(f"    Lines ({len(lines)}):")
        for line in lines[:3]:
            print(f"      - {line.get('speaker')} ({line.get('gender')}): {line.get('textEn')} -> {line.get('textVi')}")
        questions = d.get('questions', [])
        print(f"    Questions ({len(questions)}):")
        if questions:
            print(f"      - Q1: {questions[0].get('question')} | Ans: {questions[0].get('explanation')}")

    # 4. Story Templates (2 samples)
    with open(os.path.join(DATA_DIR, "story-templates-batch2.json"), "r", encoding="utf-8") as f:
        stories = json.load(f)
    print(f"\n--- 4. STORY TEMPLATES (Total: {len(stories)}) - 2 samples ---")
    sample_st = stories[:2]
    for idx, st in enumerate(sample_st, 1):
        print(f"[{idx}] ID: {st.get('id')} | Title: {st.get('title')} | Mascot: {st.get('mascotReaction')}")
        paras = st.get('templateParagraphs', []) or st.get('paragraphs', [])
        print(f"    Paragraphs: {len(paras)}")
        if paras:
            print(f"      P1: {paras[0][:120]}...")
        quiz = st.get('quizQuestions', [])
        print(f"    Quiz ({len(quiz)}):")
        if quiz:
            print(f"      Q1: {quiz[0].get('question')}")

    print("\n" + "="*60)

if __name__ == "__main__":
    audit()
