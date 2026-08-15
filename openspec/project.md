# LinguaFlow Project Architecture & System Context

**Document Version:** 1.0.0 (Baseline across Phases 1–20)  
**System Status:** Production Ready  
**Last Verified:** August 15, 2026  

---

## 1. Project Purpose & System Overview

**LinguaFlow** is a modern, full-stack, multi-skill language learning platform designed for comprehensive fluency development across six core disciplines:
- **Listening** (Dictation & Shadowing)
- **Vocabulary** (Smart Multi-modal SRS Hub & Personal Dictionaries)
- **Writing** (See & Write, Guided Writing, Free Writing with Real-time Heuristic Feedback)
- **Reading** (Bilingual Graded Reader & Comprehension Anti-Cheat)
- **Speaking** (Browser Speech Recognition, Pronunciation, Fluency & Intonation Scoring)
- **Exam Practice** (International standardized simulations for TOEIC, IELTS, VSTEP, HSK, JLPT, TOPIK, DSAT)
- **Personalized AI Tutor & Adaptive Learning** (Local rule-based heuristic intelligence & 7-day adaptive scheduling)
- **Community & Social Learning** (Learning activity feeds, study notes, groups, friendships, leaderboards)
- **Learning Analytics & Personal Intelligence** (365-day study heatmap, multi-skill radar, weakness detection, CEFR progression)

---

## 2. Monorepo Architecture & Workspaces

LinguaFlow is structured as a high-performance monorepo managed via `pnpm` workspaces:

```
LinguaFlow/
├── apps/
│   ├── api/                   # Backend Express.js REST API service (Port: 4000)
│   └── web/                   # Frontend Next.js 14 App Router application (Port: 3000)
├── packages/
│   ├── contracts/             # Shared Zod validation schemas and TypeScript DTOs
│   └── domain/                # Pure TypeScript domain models, SM-2 SRS, scoring algorithms
├── openspec/                  # Specification baseline and change-management system
├── prisma/                    # PostgreSQL Prisma schema and migrations
└── scripts/                   # Automated live QA suites, route auditors, pentest simulators
```

### Workspace Package Manifest

| Workspace Package | Type | Primary Role & Technologies |
| :--- | :--- | :--- |
| `@linguaflow/domain` | Shared Library | Zero-dependency pure TypeScript package housing business logic, SM-2 SRS formulas, CEFR mappings, speech scoring heuristics, adaptive planner algorithms, and exam scaled scoring. |
| `@linguaflow/contracts`| Shared Library | Zod schemas and TypeScript request/response contracts ensuring end-to-end type safety. |
| `@linguaflow/api` | Application | Express.js 4 server with Helmet security headers, Argon2id hashing, JWT authentication, RBAC middleware, and rate limiters. |
| `web` (Next.js) | Application | Next.js 14 App Router, React 18, Tailwind CSS, Lucide Icons, Canvas 3D visuals, next-intl bilingual routing. |

---

## 3. Technology Stack & Frameworks

### Backend Technology
- **Runtime:** Node.js (v20+ / v24+) with ESM module resolution.
- **Framework:** Express.js (`express`, `cors`, `cookie-parser`, `dotenv`).
- **Security & Hardening:** `helmet`, `express-rate-limit`, `argon2`, `jsonwebtoken`, DOMPurify-compliant sanitizers.
- **Execution & Testing:** `tsx` TypeScript executor, Node.js native test runner (`node:test`, `node:assert`).

### Frontend Technology
- **Framework:** Next.js 14 (App Router, Server & Client Components).
- **Styling & Aesthetics:** Tailwind CSS with custom Deep Space Dark palette (`#020617`), glassmorphism backdrop blurs, glowing gradients.
- **Audio & Speech:** Web Speech Recognition API (`webkitSpeechRecognition`), Web Audio API (`AudioContext`, `MediaStreamRecorder`, `OfflineAudioContext`).
- **Localization:** `next-intl` providing bilingual parity (`/vi` and `/en`).
- **State Management:** React Hooks, local cache bridges, optimistic UI updates, and server synchronization.

---

## 4. Current Implementation vs. Future Capabilities

### Current Implemented Capabilities (Verified in Phase 20)
1. **Server-Authoritative Anti-Cheat**: All XP calculation, streak incrementing, SM-2 scheduling, and exam grading occur strictly on the backend.
2. **Local AI Tutor Engine**: Full deterministic rule-based intent parsing, recommendation ranking, and dynamic study plan generation requiring zero external API keys.
3. **Local Audio Processing**: Speaking lab audio recording and transcription run locally inside the client browser, preserving user data privacy.
4. **Bilingual App Parity**: 88 verified route endpoints accessible in both Vietnamese (`/vi`) and English (`/en`).
5. **OWASP Top 10 Protections**: Verified defenses for RBAC access control, CORS whitelisting, account lockouts, API rate limits, payload size caps, and anti-XSS.

### Future / Planned Capabilities (Roadmap Extension Points)
1. **External LLM Provider Plug-in**: Seamless swap from `LocalTutorProvider` to OpenAI/Anthropic/Gemini via the existing `TutorProvider` interface.
2. **True Phoneme-level Forced Alignment**: Native wav2vec2/whisper acoustic model integration for millisecond phoneme scoring.
3. **PostgreSQL Persistent Connection**: Migration from high-fidelity in-memory runtime caches to production Prisma/PostgreSQL container clusters.
4. **Multiplayer Real-time Duels**: WebSocket integration for live synchronized vocabulary and listening battles.
