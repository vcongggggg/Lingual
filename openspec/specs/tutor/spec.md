# Personalized AI Tutor & Adaptive Learning Specification (Baseline)

**Module:** AI Tutor & Adaptive Learning Lab  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/services/tutor.ts`, `apps/api/src/routes/tutor.ts`, `apps/web/src/app/[locale]/tutor/`  

---

## 1. Purpose & Scope

The Personalized AI Tutor acts as a 24/7 intelligent learning companion overlaying the entire LinguaFlow ecosystem. It parses user queries into structured learning intents, generates individualized 7-day adaptive study plans, curates multi-skill mini-drills, provides immediate grammar explanations, and recommends targeted practice based on live Analytics weakness telemetry.

---

## 2. Intent Classification & Provider Architecture

### A. Provider Interface
```typescript
export interface TutorProvider {
  processChat(input: TutorChatInput): Promise<TutorChatResponse>;
  generatePlan(input: TutorPlanInput): Promise<TutorAdaptivePlan>;
  generateMiniSession(input: TutorMiniSessionInput): Promise<TutorMiniSession>;
}
```

### B. LocalTutorProvider (Deterministic Heuristic Engine)
- **Zero External API Dependency**: Operates entirely offline with rule-based regex patterns, intent classification heuristics, and dynamic grammar rule maps.
- **Recognized Intents**:
  - `grammar/explain` — Grammar rules, tense explanations, sentence correction.
  - `recommend` — Daily study priorities based on lowest scoring skills.
  - `practice` — Generation of targeted mini-drills.
  - `motivation` — Streak encouragement and milestone celebrations.
  - `exam` — Standardized exam strategy and test-taking tips.
  - `general` — General conversational assistance.

### C. Adaptive 7-Day Study Planner
- Analyzes the learner's weakest skills and automatically generates a tailored daily agenda prioritizing high-impact exercises (e.g. Dictation for listening weakness, Cloze drills for vocabulary).

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Tutor Domain Algorithms & Intent Classifier | `packages/domain/src/index.ts` | `packages/domain/test/tutor.test.ts` (25/25 PASS) |
| LocalTutorProvider & API Routes | `apps/api/src/services/tutor.ts`, `routes/tutor.ts` | `scripts/qa_tutor_test.ts` (41/41 PASS) |
| Tutor UI & Study Plan Dashboard | `apps/web/src/app/[locale]/tutor/` | `scripts/qa_master_routes.ts` |
