# Smart Vocabulary Lab Specification (Baseline)

**Module:** Vocabulary Hub & Multi-Modal Practice  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/vocabulary.ts`, `apps/web/src/app/[locale]/vocabulary/`  

---

## 1. Purpose & Scope

The Smart Vocabulary Lab is a centralized lexicon hub enabling dictionary lookups, custom thematic folder management, multi-modal practice drills (4 distinct exercise modes), and direct SM-2 spaced repetition deck integration.

---

## 2. Practice Modes

1. **Meaning Choice (`meaning_choice`)**: 4-option multiple choice matching word to definition.
2. **Cloze Fill-in (`cloze`)**: Sentence completion with context clues.
3. **Listening Spelling (`listening_spelling`)**: Audio prompt requiring exact keyboard spelling.
4. **Visual Recognition (`recognition`)**: Rapid word recognition drill.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Vocabulary Search & CEFR Filtering | `packages/domain/src/index.ts` | `packages/domain/test/vocabulary.test.ts` |
| Folder CRUD & Personal Words | `apps/api/src/routes/vocabulary.ts` | `scripts/qa_vocabulary_test.ts` (Tests 2–5) |
| Practice Drill Generation & SRS Updates | `apps/api/src/routes/vocabulary.ts` | `scripts/qa_vocabulary_test.ts` (Tests 6–7) |
