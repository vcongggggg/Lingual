# Localization & Bilingual Parity Specification (Baseline)

**Module:** Internationalization (i18n)  
**Status:** Implemented & Verified  
**Package:** `apps/web/src/app/[locale]/`, `apps/web/messages/`  

---

## 1. Purpose & Scope

Ensures complete bilingual parity between **Vietnamese (`/vi`)** and **English (`/en`)** across all user interfaces, learning instructions, feedback prompts, and grammar explanations.

---

## 2. Routing Architecture

All web routes are prefixed with the active locale slug:
- Vietnamese Base: `http://localhost:3000/vi/...`
- English Base: `http://localhost:3000/en/...`

When users switch languages, the UI redirects to the corresponding localized path while preserving URL query parameters and learning state.

---

## 3. Bilingual Route Inventory (88 Verified Endpoints)

Every major application module exposes identical route trees under both `/vi` and `/en`:
- Dashboard (`/[locale]/dashboard`)
- SRS Spaced Repetition (`/[locale]/srs`)
- Listening Lab (`/[locale]/listening`, `dictation`, `shadowing`)
- Vocabulary Hub (`/[locale]/vocabulary`, `practice`, `test`)
- Writing Lab (`/[locale]/writing`, `see-write`, `guided`, `free`)
- Reading Lab (`/[locale]/reading`, `history`)
- Exam Practice (`/[locale]/exam-practice`, `history`, `stats`)
- Community (`/[locale]/community`, `friends`, `groups`, `leaderboard`, `notes`, `achievements`)
- Learning Analytics (`/[locale]/analytics`)
- Speaking Lab (`/[locale]/speaking`, `pronunciation`, `repetition`, `shadowing`, `guided`, `picture`, `situation`, `free`, `history`, `stats`)
- AI Tutor (`/[locale]/tutor`, `dashboard`, `plan`, `history`)
- Admin Panel (`/[locale]/admin`, `audit-log`)

---

## 4. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Bilingual Routing Structure | `apps/web/src/app/[locale]/layout.tsx` | `scripts/qa_master_routes.ts` |
| All 88 Routes Return HTTP 200 | `apps/web/src/app/[locale]/*` | `scripts/qa_master_routes.ts` (88/88 PASS) |
| Localized AI Tutor Responses | `apps/api/src/services/tutor.ts` | `scripts/qa_tutor_test.ts` |
