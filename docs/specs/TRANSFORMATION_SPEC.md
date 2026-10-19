# LINGUAFLOW — TRANSFORMATION SPECIFICATION (OPENSPEC)

**Spec ID**: `SPEC-TRANSFORM-2026`  
**Target Branch**: `develop`  
**Objective**: Creative UI/UX Transformation, Arcade Game Engine Architecture, and Real-World External Data Ingestion.  
**Version**: 1.0.0-PROD  

---

## 1. ARCHITECTURAL SCOPE & FOUNDATION

LinguaFlow is a production-grade pnpm/Turborepo monorepo encompassing 18 integrated learning modules:
- **Core Learning Engine**: Curriculum (A1–B1 units), SM-2 Spaced Repetition Flashcards, Bilingual Smart Dictionary.
- **Interactive Labs**: Listening Studio, Speech Lab, Writing Studio, Reading Studio, Exam Simulator (TOEIC & IELTS).
- **Gamification & Social**: Arcade Game Center, Community Hub, Leaderboard, Study Notes, Squads.
- **AI Intelligence**: Personalized AI Tutor (RAG-assisted), Learning Analytics Dashboard, 7-Day Adaptive Plan.

---

## 2. THE 3 CORE PILLARS OF TRANSFORMATION

### Pillar 1: Bespoke, Creative & Non-Generic UI/UX
Every learning lab must break away from generic single-template card layouts and embody its own signature interaction identity:
1. **Listening Studio (`/listening`)**:
   - Audio visualizer with frequency bars.
   - Interactive karaoke timeline sync (timed word highlighting as dialogue audio plays).
   - Playback speed controls (0.5x, 0.75x, 1.0x, 1.25x, 1.5x) and 5s rewind/forward buttons.
2. **Speech Lab (`/speaking`)**:
   - Live mic audio visualizer.
   - Word-by-word and phoneme accuracy color feedback (🟢 Native >85%, 🟡 Intelligible 60-85%, 🔴 Needs work <60%).
   - Waveform comparison between Native Speaker and User attempt.
3. **Smart Vocabulary Explorer (`/vocabulary`)**:
   - 3D tactile flashcard decks with interactive swipe gesture review.
   - Real IPA phonetic transcriptions, authentic audio streams, collocations, and contextual sentence networks.
4. **Writing Studio (`/writing`)**:
   - Distraction-free creative canvas.
   - Live word target meter, vocabulary richness gauge, and margin AI critique notes.
5. **Exam Simulator (`/exam-practice` & `/ielts`)**:
   - Split-pane layout (passage left, question right).
   - Question navigator palette with answer and flag indicators.
   - Official-style LinguaFlow Practice Score Report with scaled score breakdown.

---

### Pillar 2: High-Octane Reusable Arcade Game Engine
- **Zero-Dependency Procedural Web Audio Synthesizer** (`apps/web/src/lib/arcadeAudio.ts`):
  - Real-time audio generation (Coin, Laser, Combo, Buzzer, Fanfare, Game Over, Tick) without missing MP3 assets.
  - Respects global mute state and user preferences.
- **Canvas 2D Particle Engine** (`apps/web/src/components/games/ParticleCanvas.tsx`):
  - Confetti cannons on stage clear.
  - Sparkle trails on combo streaks.
  - Floating +XP score numbers.
- **Arcade Dynamics & Micro-Interactions**:
  - Live Combo Multiplier bar (`2x`, `3x`, `5x ULTRA STREAK`).
  - Pulsing Heart Containers for player lives.
  - Screen-shake physics on wrong answer.
  - Cinematic Victory & Defeat modals with LingLing mascot reactions.

---

### Pillar 3: Real-World Data Ingestion & Live Dictionary Integration
- **Live External Dictionary Provider Pipeline**:
  - Direct integration with **Free Dictionary API** (`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`) and **Datamuse API**.
  - Server-side caching, timeout protection (3500ms), and fallback to local curated knowledge.
  - Rich word payload: IPA phonetics, audio URLs (Wikimedia/FreeDict), definitions by part-of-speech, synonyms, antonyms, and authentic example sentences.
- **Curated Authentic Datasets**:
  - 100+ CEFR Graded Words (A1–C1) with real phonetics and audio.
  - Graded Reading Library with public-domain literature and contemporary articles.
  - Standardized TOEIC & IELTS simulated question pools.

---

## 3. NON-REGRESSION CONTRACT

The following subsystems are strictly preserved:
1. **Authentication & RBAC**: Session cookies, JWT tokens, `@Roles()` decorators, and Default-Deny RolesGuard.
2. **Server-Authoritative Validation**: XP scoring, streak maintenance, anti-cheat limits, and idempotency keys.
3. **Database Integrity**: Prisma PostgreSQL schema with persistent models for User, Lesson, SRS Item, Attempt, Analytics, and Social Feed.
4. **Internationalization**: Complete dual-locale `/vi` and `/en` support across all routes.
5. **Accessibility**: Full WCAG AA contrast, keyboard `Tab`/`Enter`/`Escape` navigation, visible focus rings, and `prefers-reduced-motion` compliance.

---

## 4. TASK DECOMPOSITION & EXECUTION PLAN

- **TASK 01**: Pre-Flight Audit & Baseline Verification (`docs/specs/`, `docs/audit/`) [CURRENT]
- **TASK 02**: Reusable Arcade Engine & Web Audio Synthesizer Integration (`arcadeAudio.ts`, `ParticleCanvas.tsx`)
- **TASK 03**: Games Hub Arcade Redesign (`apps/web/src/app/[locale]/games/page.tsx`)
- **TASK 04**: Real Dictionary API Service & Fallback Pipeline (`apps/api/src/services/realDictionaryService.ts`)
- **TASK 05**: Vocabulary Explorer & 3D Swipe Deck Redesign (`/vocabulary`, `/vocabulary/[wordId]`)
- **TASK 06**: Listening Audio Studio & Karaoke Transcript Redesign (`/listening`, `/listening/dictation`, `/listening/shadowing`)
- **TASK 07**: Speech Lab & Phoneme Color Feedback Redesign (`/speaking`, sub-modes)
- **TASK 08**: Writing Studio & Distraction-Free Canvas Redesign (`/writing`, `/writing/see-write`, `/writing/guided`, `/writing/free`)
- **TASK 09**: Exam Simulator & Authentic Test Split-Pane Redesign (`/exam-practice`, `/ielts`)
- **TASK 10**: Global SEO & Dynamic Metadata Pipeline (`layout.tsx`, `generateMetadata`)
- **TASK 11**: Global Screenshot Re-Capture & Multi-Viewport Visual Inspection
- **TASK 12**: Final Comprehensive Release Audit (`FINAL_TRANSFORMATION_AUDIT.md`)
