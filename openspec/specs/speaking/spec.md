# Speaking Lab Specification (Baseline)

**Module:** Speaking Lab (Pronunciation & Fluency)  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/speaking.ts`, `apps/web/src/app/[locale]/speaking/`  

---

## 1. Purpose & Scope

The Speaking Lab delivers interactive oral practice across 7 distinct practice modes:
1. **Pronunciation Drills** (`pronunciation`)
2. **Repetition Practice** (`repetition`)
3. **Shadowing Fluency** (`shadowing`)
4. **Guided Speaking** (`guided`)
5. **Picture Description** (`picture`)
6. **Situational Roleplay** (`situation`)
7. **Free Speaking** (`free`)

---

## 2. Speech Analysis Engine & Privacy Invariants

### A. Privacy & Local Audio Processing
- **Audio Privacy**: Microphone streams and audio recordings are recorded and processed locally in the user's browser via the Web Audio API and Web Speech Recognition. Audio waveforms and blobs are NEVER uploaded to external cloud servers without explicit user request.
- **Transcript Evaluation**: Speech transcripts are analyzed for word accuracy, articulation rate (Words Per Minute), vocabulary richness, and grammatical consistency.

### B. Scoring Dimensions (0–100)
- **Pronunciation & Word Match**: Word-level Levenshtein similarity against target prompt.
- **Fluency & Pace**: Optimal speech rate targeting 110–160 WPM.
- **Grammar Heuristics**: Heuristic error flagging for verb tenses, articles, and sentence completion.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Speech Evaluation Heuristics | `packages/domain/src/index.ts` | `packages/domain/test/speaking.test.ts` |
| Speaking API & Anti-Cheat | `apps/api/src/routes/speaking.ts` | `scripts/qa_speaking_test.ts` (28/28 PASS) |
| Speaking Lab UI (7 Modes) | `apps/web/src/app/[locale]/speaking/` | `scripts/qa_master_routes.ts` |
