# Writing Lab Specification (Baseline)

**Module:** Writing Lab & Local Feedback Engine  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/writing.ts`, `apps/web/src/app/[locale]/writing/`  

---

## 1. Purpose & Scope

The Writing Lab trains written fluency through three structured modes (**See & Write**, **Guided Writing**, and **Free Writing**), evaluating text in real-time via local heuristic rules for grammar, syntax, vocabulary diversity, and sentence structure.

---

## 2. Writing Modes & Evaluation Heuristics

### A. Writing Modes
- **See & Write**: Image-prompted sentence construction.
- **Guided Writing**: Structured paragraph writing based on scaffolding bullet points.
- **Free Writing**: Essay and open-topic expression with live word and character counters.

### B. Scoring Dimensions (Total: 0–100)
- **Grammar & Mechanics (40%)**: Heuristic detection of subject-verb agreement, capitalization, punctuation, article usage, and common spelling typos.
- **Vocabulary Diversity (30%)**: Unique word ratio (Type-Token Ratio) and academic word list usage.
- **Length & Task Completion (30%)**: Word count vs. prompt minimum target.

---

## 3. Behavioral Invariants

1. **Authoritative Scoring**: `POST /api/v1/writing/attempts` evaluates scores and XP server-side.
2. **Anti-Cheat XP Boundary**: Client-provided XP values are stripped. Maximum awarded XP is capped at 30 XP per attempt.
3. **Idempotency**: Rapid duplicate submissions return the original attempt result without duplicate XP.

---

## 4. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Writing Heuristics & Scoring | `packages/domain/src/index.ts` | `packages/domain/test/writing.test.ts` |
| Writing API & Anti-Cheat | `apps/api/src/routes/writing.ts` | `scripts/qa_writing_test.ts` (24/24 PASS) |
| Writing Lab Frontend Routes | `apps/web/src/app/[locale]/writing/` | `scripts/qa_master_routes.ts` |
