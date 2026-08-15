# Listening Lab Specification (Baseline)

**Module:** Listening Lab (Dictation & Shadowing)  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/web/src/app/[locale]/listening/`  

---

## 1. Purpose & Scope

The Listening Lab provides auditory comprehension training through **Dictation** (listening to audio segments and transcribing exact text) and **Shadowing** (listening and repeating speech in real time with waveform synchronization).

---

## 2. Domain Scoring & Text Normalization

- **Levenshtein Distance & Word Error Rate (WER)**:
  $$\text{Accuracy} = \max\left(0, 100 \times \left(1 - \frac{\text{Levenshtein}(A, B)}{\max(|A|, |B|)}\right)\right)$$
- **Normalization**: Text is stripped of punctuation, lowercased, and whitespace-collapsed prior to comparison.
- **Diff Breakdown**: Visual red/green diff highlighting missing words, extra words, and misspellings.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Audio Text Normalization & Scoring | `packages/domain/src/index.ts` | `packages/domain/test/listening.test.ts` |
| Dictation & Shadowing UI | `apps/web/src/app/[locale]/listening/` | `scripts/qa_master_routes.ts` |
