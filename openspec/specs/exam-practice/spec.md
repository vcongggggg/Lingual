# Exam Practice Lab Specification (Baseline)

**Module:** Standardized Exam Practice Lab  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/exams.ts`, `apps/web/src/app/[locale]/exam-practice/`  

---

## 1. Purpose & Scope

The Exam Practice Lab simulates full-length and modular tests for 7 international language proficiency standards:
1. **TOEIC** (Listening & Reading, 10–990 scale)
2. **IELTS** (Academic & General, 0.0–9.0 band scale)
3. **VSTEP** (Vietnamese Standardized Test of English Proficiency, Levels 3–5 / B1–C1)
4. **HSK** (Hanyu Shuiping Kaoshi, Levels 1–6)
5. **JLPT** (Japanese-Language Proficiency Test, N5–N1)
6. **TOPIK** (Test of Proficiency in Korean, TOPIK I & II)
7. **DSAT** (Digital SAT Reading and Writing, 200–800 scale)

---

## 2. Examination Lifecycle & Scaled Scoring

```
  [Start Exam] ──> [Answer Recording] ──> [Submission & Grading] ──> [Scaled Scoring] ──> [Weakness Analysis]
```

### A. Anti-Cheat Boundary
- Public exam detail endpoints strip `correctAnswer` and `explanation`.
- Active attempts have a server-enforced countdown timer window.

### B. Scaled Scoring Algorithms
- Implemented in `packages/domain/src/index.ts`:
  - `calculateToeicScaledScore(rawListening, rawReading)`
  - `calculateIeltsBandScore(rawScore, totalQuestions)`
  - `calculateVstepScore(rawScore, totalQuestions)`
  - `calculateHskScore(rawScore, totalQuestions, level)`
  - `calculateJlptScore(rawScore, totalQuestions, level)`
  - `calculateTopikScore(rawScore, totalQuestions, level)`
  - `calculateDsatScore(rawScore, totalQuestions)`

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Standardized Scaled Scoring | `packages/domain/src/index.ts` | `packages/domain/test/exam.test.ts` |
| Exam API & Anti-Cheat | `apps/api/src/routes/exams.ts` | `scripts/qa_exam_test.ts` (23/23 PASS) |
| Exam Lab Frontend Routes | `apps/web/src/app/[locale]/exam-practice/` | `scripts/qa_master_routes.ts` |
