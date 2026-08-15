# Gamification, XP & Streak Baseline Specification

**Module:** Gamification Engine  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/user.ts`  

---

## 1. Purpose & Scope

The Gamification module provides extrinsic learning motivation through server-authoritative Experience Points (XP), daily streak progression, and achievement unlocks.

---

## 2. XP & Streak Domain Formulas

### A. Experience Points (XP)
- **Base Lesson / Practice**: 10–30 XP depending on accuracy and duration.
- **Dictation / Shadowing**: 15–25 XP.
- **Writing Attempt**: 15–30 XP based on length and grammatical precision.
- **Speaking Attempt**: 10–30 XP based on pronunciation and fluency.
- **Full Standardized Exam**: 50–100 XP proportional to scaled accuracy.
- **Social Study Note Contribution**: 15 XP.

### B. Streak Invariants
- A streak is maintained if at least one learning activity is completed within the learner's local timezone calendar day ($T$).
- If the last completed activity was yesterday ($T - 1$), current streak increments by 1.
- If the last completed activity was today ($T$), streak remains unchanged (idempotent).
- If the last completed activity was before yesterday ($T - 2$ or earlier), streak resets to 1.

---

## 3. Behavioral Invariants

1. **Server Authority**: The backend recalculates and applies XP increments strictly based on verified task completion. Client requests attempting to override `xpAwarded` are disregarded.
2. **Streak Timezone Awareness**: All streak boundaries are evaluated against the learner's configured IANA timezone (e.g. `Asia/Ho_Chi_Minh`).
3. **Idempotency**: Submitting duplicate attempts within 5 minutes MUST NOT grant duplicate streak increments or duplicate XP.

---

## 4. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Streak Date Evaluation | `packages/domain/src/index.ts` | `packages/domain/test/gamification.test.ts` |
| Authoritative XP Awarding | `apps/api/src/routes/writing.ts`, `speaking.ts` | `scripts/qa_writing_test.ts`, `qa_speaking_test.ts` |
| Streak Increment on Session | `apps/api/src/routes/tutor.ts` | `scripts/qa_tutor_test.ts` (Step 11) |
