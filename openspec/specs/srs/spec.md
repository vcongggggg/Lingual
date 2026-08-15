# Spaced Repetition System (SRS / SM-2) Baseline Specification

**Module:** Spaced Repetition System (SRS)  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/srs.ts`  

---

## 1. Purpose & Scope

The SRS module implements the mathematical **SuperMemo SM-2** spaced repetition algorithm, calculating optimal review intervals, easiness factors, and repetition counts for vocabulary items across all learning labs (Vocabulary, Writing, Reading, Speaking, and Exams).

---

## 2. Mathematical SM-2 Algorithm

For quality grade $q \in [0, 5]$:

1. **Easiness Factor Update**:
   $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
   $$EF' = \max(EF', 1.3)$$

2. **Interval Calculation**:
   - If $q < 3$ (Failure):
     $$\text{repetitions} = 0, \quad I_1 = 1 \text{ day}$$
   - If $q \ge 3$ (Success):
     - If $\text{repetitions} = 0 \implies I_1 = 1 \text{ day}$
     - If $\text{repetitions} = 1 \implies I_2 = 6 \text{ days}$
     - If $\text{repetitions} \ge 2 \implies I_{n+1} = \lceil I_n \times EF' \rceil$
     $$\text{repetitions}' = \text{repetitions} + 1$$

---

## 3. Functional Requirements

### Requirement: Quality Evaluation & Rescheduling
The domain function `calculateNextReview(state, quality, now)` SHALL accurately update SRS state.

#### Scenario: Grade 5 Perfect Recall
- **GIVEN** an initial word state with interval 1, repetitions 1, EF 2.5
- **WHEN** user scores quality 5
- **THEN** repetitions increment to 2, interval becomes 6 days, next review date advances 6 days, and EF increases.

#### Scenario: Grade 1 Complete Blank (Lapse)
- **GIVEN** an established word with repetitions 5, interval 30
- **WHEN** user scores quality 1
- **THEN** repetitions reset to 0, interval resets to 1 day, and EF decreases by 0.54.

---

## 4. Integration Invariants

1. **Cross-Module Bridge**: Writing, Reading, Speaking, and Exams can bridge new words into the user's personal SRS deck (`POST /api/v1/vocabulary/words/save`).
2. **Deterministic SM-2 Core**: Feature modules must NEVER modify SM-2 formulas directly without an approved OpenSpec RFC.
3. **User Isolation**: SRS decks and word reviews are strictly isolated per `userId`.

---

## 5. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| SM-2 Algorithm Calculation | `packages/domain/src/index.ts` | `packages/domain/test/srs.test.ts` |
| SRS Deck Sync API | `apps/api/src/routes/srs.ts` | `apps/api/test/curriculum.test.ts` |
| Vocabulary Lab SRS Integration | `apps/api/src/routes/vocabulary.ts` | `scripts/qa_vocabulary_test.ts` (Test 7) |
