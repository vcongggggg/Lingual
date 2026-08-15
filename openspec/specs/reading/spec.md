# Reading Lab Specification (Baseline)

**Module:** Reading Lab & Bilingual Reader  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/reading.ts`, `apps/web/src/app/[locale]/reading/`  

---

## 1. Purpose & Scope

The Reading Lab delivers graded reading comprehension across CEFR levels (A1 to C2) with bilingual paragraph-level translations, inline word lookups, reading speed analytics (Words Per Minute), and comprehension quizzes.

---

## 2. Anti-Cheat & Comprehension Assessment

1. **Answer Key Protection**: Public article endpoints (`GET /api/v1/reading/articles/:id`) omit question answer keys and explanations from client payloads.
2. **Authoritative Evaluation**: `POST /api/v1/reading/attempts` receives user answer indices and computes accuracy and reading speed ($WPM = \frac{\text{wordCount}}{\text{durationSeconds} / 60}$) server-side.
3. **SRS Vocabulary Bridge**: Users can select unknown words within articles and save them directly to their personal SRS deck (`POST /api/v1/reading/vocabulary/save`).

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Reading Speed & Score Logic | `packages/domain/src/index.ts` | `packages/domain/test/reading.test.ts` |
| Reading Lab API & Anti-Cheat | `apps/api/src/routes/reading.ts` | `scripts/qa_reading_test.ts` (21/21 PASS) |
| Reading Lab UI & History | `apps/web/src/app/[locale]/reading/` | `scripts/qa_master_routes.ts` |
