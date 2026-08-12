# 🚀 LinguaFlow - Full-Stack Implementation Plan

This implementation plan outlines the step-by-step technical roadmap to build **LinguaFlow** — a personalized, gamified Vietnamese-to-English language learning platform featuring interactive lessons, an SM-2 Spaced Repetition System (SRS) review queue, a 4-game Game Center, an XP/Streak dashboard, and an Admin CMS.

---

## 🎯 Architectural Overview

We adopt a **TypeScript Monorepo** architecture using `pnpm` workspaces:

```text
c:\Study\HocKy6\
├── apps/
│   ├── web/               # Next.js 15 (App Router, Tailwind CSS, Framer Motion, GSAP, Lucide)
│   └── api/               # NestJS / Node.js API (Argon2id, JWT, REST /api/v1, Swagger)
├── packages/
│   ├── contracts/         # Zod schemas & shared TypeScript types
│   └── domain/            # Pure SRS (SM-2), XP/Streak, and game scoring algorithms
├── prisma/
│   ├── schema.prisma      # PostgreSQL Schema (User, Session, Vocabulary, Unit, Lesson, SRS, GameSession)
│   └── seed.ts            # Curriculum seed (Vietnamese -> English A1 Level: 5 Units, 25 Lessons)
└── .agents/skills/        # Integrated AI Agent Skill System for FE & Animation
```

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **Database & Backend Stack Choice**:
> 1. **Database**: We will use **PostgreSQL** with **Prisma ORM**. For local dev, a local PostgreSQL instance or Docker container (`docker-compose.yml`) will be used.
> 2. **Backend Framework**: We will build **NestJS** (or Express + TypeScript) inside `apps/api/` with Zod validation via `packages/contracts`.
> 3. **Frontend Stack**: Next.js 15 App Router + Tailwind CSS + Framer Motion + Lucide Icons, leveraging our installed **AI Agent FE Skills** (`frontend-design`, `ui-motion-animation`, `mengto-skills`).

---

## ❓ Open Questions

> [!NOTE]
> 1. **Docker Setup**: Do you have Docker Desktop installed on your Windows machine to run PostgreSQL via `docker-compose.yml`, or would you prefer SQLite / Supabase / local PostgreSQL?
> 2. **Audio/TTS for Vocabulary**: For MVP listening/pronunciation, should we use the browser's built-in **Web Speech API (SpeechSynthesis)** (free, zero API cost) as default, with fallback support for OpenAI TTS?

---

## 🛠️ Proposed Changes

---

### Component 1: Core Monorepo & Domain Layer (`packages/`)

#### [NEW] [packages/contracts](file:///c:/Study/HocKy6/packages/contracts)
- Define shared Zod request/response validation schemas and TypeScript interfaces:
  - Auth (`LoginDto`, `RegisterDto`, `AuthResponse`)
  - User & Profile (`UserProfileDto`, `UpdateGoalDto`)
  - Curriculum (`CourseDto`, `UnitDto`, `LessonDto`, `SubmitQuizDto`)
  - SRS Queue (`SRSItemDto`, `ReviewAnswerDto`, `SRSQueueSummaryDto`)
  - Games (`StartGameDto`, `SubmitGameScoreDto`, `LeaderboardDto`)

#### [NEW] [packages/domain](file:///c:/Study/HocKy6/packages/domain)
- Implement pure domain logic (zero side-effects, unit-tested):
  - **SM-2 SRS Algorithm**: `calculateNextReview(quality: 0..5, previousInterval, previousEF)`
  - **XP & Streak Calculator**: Base XP + streak multiplier + daily goal tracking logic.
  - **Game Scoring Engine**: Speed bonus, streak bonus, mistake penalty calculation.

---

### Component 2: Database Schema & Seed Data (`prisma/`)

#### [NEW] [prisma/schema.prisma](file:///c:/Study/HocKy6/prisma/schema.prisma)
- Define Prisma database models:
  - `User`, `Session`, `RefreshToken`
  - `Language`, `Course`, `Unit`, `Lesson`, `QuizExercise`
  - `Vocabulary`, `UserWordState` (SRS fields: `interval`, `repetition`, `efactor`, `dueDate`, `lastQuality`)
  - `GameSession`, `UserStreak`, `UserXPLog`, `AuditLog`

#### [NEW] [prisma/seed.ts](file:///c:/Study/HocKy6/prisma/seed.ts)
- Create comprehensive seed data for Vietnamese -> English A1 Level (5 Units, 25 Lessons, 150+ vocabulary words with audio links, example sentences, and translations).

---

### Component 3: Backend API Server (`apps/api/`)

#### [NEW] [apps/api/src/main.ts](file:///c:/Study/HocKy6/apps/api/src/main.ts) & Modules
- Scaffold NestJS REST API (`/api/v1`):
  - `AuthModule`: Argon2id password hashing, HTTP-only refresh cookies, JWT access tokens.
  - `UserModule`: User profile, onboarding quiz result, daily goal setting.
  - `CurriculumModule`: Lessons, unit progression, interactive quiz evaluation engine.
  - `SRSModule`: Get daily SRS review queue, submit review quality (SM-2 update).
  - `GameModule`: Fetch game vocabulary/sentences, submit game session score, update XP.
  - `AdminModule`: Basic CMS endpoints for managing lessons, words, and quizzes.

---

### Component 4: High-Impact Animated Frontend (`apps/web/`)

Leveraging our installed AI Agent Skills (`frontend-design`, `ui-motion-animation`, `modern-ui-components`, `better-ui-ux`, `mengto-skills`):

#### [MODIFY] [apps/web/src/app/page.tsx](file:///c:/Study/HocKy6/apps/web/src/app/page.tsx) & Landing/Onboarding
- **Hero & Onboarding Flow**:
  - Animated glassmorphism hero banner with Framer Motion spring entry.
  - Interactive placement quiz & goal setting modal.

#### [NEW] [apps/web/src/app/dashboard/page.tsx](file:///c:/Study/HocKy6/apps/web/src/app/dashboard/page.tsx)
- **Progress & Learning Hub**:
  - Daily Streak counter, XP progress bar, SRS Due Counter badge.
  - Unit/Lesson roadmap (Duolingo-style animated node path).

#### [NEW] [apps/web/src/app/learn/[lessonId]/page.tsx](file:///c:/Study/HocKy6/apps/web/src/app/learn/[lessonId]/page.tsx)
- **Interactive Quiz Engine**:
  - Multiple choice, Sentence Scramble (drag/drop token order), Fill-in-the-blank, Typing practice.
  - Instant sound feedback & XP celebration animation.

#### [NEW] [apps/web/src/app/srs/page.tsx](file:///c:/Study/HocKy6/apps/web/src/app/srs/page.tsx)
- **Vocabulary SRS Flashcard Deck**:
  - 3D Flip Card animation with audio TTS playback.
  - SM-2 Rating buttons: Again (0), Hard (2), Good (3), Easy (5).

#### [NEW] [apps/web/src/app/games/page.tsx](file:///c:/Study/HocKy6/apps/web/src/app/games/page.tsx) & 4 Game Modes
- **Game Center**:
  1. **Word Match / Memory Flip**: Grid card matching with flip motion.
  2. **Sentence Scramble**: Drag and drop sentence tokens under timer.
  3. **Typing Race**: Rapid typing challenge with WPM & accuracy meter.
  4. **Fill-in-the-Blank Blitz**: Speed quiz under 60-second countdown.

#### [NEW] [apps/web/src/app/admin/page.tsx](file:///c:/Study/HocKy6/apps/web/src/app/admin/page.tsx)
- **Admin CMS Dashboard**:
  - Manage courses, units, lessons, vocabulary words, and quiz questions.

---

## 🧪 Verification Plan

### Automated Tests
1. **Domain Logic Unit Tests**:
   - Verify SM-2 algorithm transitions (quality 0 resets interval to 1; quality 5 increases interval & E-Factor).
   - Verify XP & Streak calculation logic.
2. **API Integration Tests**:
   - Auth endpoints (login, register, token refresh, invalid credentials protection).
   - SRS queue generation & submission API.

### Manual Verification
1. **End-to-End User Flow**:
   - Register new user -> Complete Onboarding -> Learn Lesson 1 -> Earn XP -> Check SRS Queue -> Play Word Match Game -> Review Progress Dashboard.
2. **UI & Motion Review**:
   - Verify glassmorphism aesthetics, responsive layout on mobile/desktop, smooth 60fps animations.
