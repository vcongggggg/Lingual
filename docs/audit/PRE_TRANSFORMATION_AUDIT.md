# LINGUAFLOW — TRANSFORMATION PRE-FLIGHT AUDIT

**Audit Date**: 2026-08-19  
**Auditor**: Lead System & UI/UX Architect  
**Branch**: `develop`  
**Repository State**: Clean Baseline across Phases 1–21  

---

## 1. CURRENT REPOSITORY ARCHITECTURE

LinguaFlow is structured as an enterprise-scale monorepo managed via `pnpm` and `turbo`:
```
LinguaFlow/
├── apps/
│   ├── api/          # Express + Prisma + PostgreSQL Backend API (Port 4000)
│   └── web/          # Next.js 15 App Router Frontend (Port 3000)
├── packages/
│   ├── config/       # Shared Tailwind tokens, constants, mascot reactions
│   ├── contracts/    # TypeScript DTOs & API contract interfaces
│   ├── domain/       # Core business logic, SRS SM-2, grading algorithms
│   └── ui/           # Shared Glassmorphic UI component library
├── docs/             # Specs, audits, and architectural documentation
└── scripts/          # Screenshot automation and seeding utilities
```

---

## 2. EXISTING UI & COMPONENT LANDSCAPE

- **Design Tokens**: Deep Space Dark (`#090d16`), Glassmorphism (`backdrop-blur-xl`, `border-slate-800`), Outfit Display Font, Inter Body Font, Calistoga Artistic Font.
- **Mascot Universe**: LingLing mascot with 20+ emotional reaction stickers, sound effects, and ambient background integration.
- **Navigation Architecture**: 3+3 Desktop Dropdown Header (`Lộ Trình`, `AI Tutor`, `Từ Vựng` + `Kỹ Năng`, `Luyện Thi`, `Khám Phá`) and 5-Tab Mobile Bottom Bar.

---

## 3. KEY DEFICIENCIES IDENTIFIED PRIOR TO TRANSFORMATION

1. **Repetitive Layout Syndrome**:
   - Multiple learning labs (Reading, Writing, Listening, Vocabulary) previously utilized similar 2-column card layouts, diluting the unique identity of each learning modality.
2. **Basic Arcade Game Feedback**:
   - Games lacked physical arcade game feel (missing real-time synthesized audio feedback, particle confetti celebrations, combo streak multipliers, and screen-shake physics).
3. **Mock Data Dependency**:
   - Vocabulary and dictionary features relied primarily on static mock arrays rather than a resilient live pipeline connected to external open dictionary and lexical APIs (Free Dictionary API, Datamuse).
4. **Dynamic Metadata Absence**:
   - Public lab pages and dynamic article reader routes lacked tailored `generateMetadata` exports, resulting in uniform fallback browser tab titles.

---

## 4. RISK MATRIX & MITIGATION STRATEGY

| Risk Area | Severity | Potential Failure Mode | Mitigation Strategy |
| :--- | :---: | :--- | :--- |
| **External API Outage** | High | Free Dictionary API downtime blocks word lookups | Implement 3.5s timeout, LRU memory cache, and automatic fallback to local curated knowledge. |
| **Audio Playback Block** | Medium | Browser Autoplay policy blocks audio synthesis | Initialize Web Audio Context on first user interaction; provide mute toggle. |
| **Performance Overhead** | Medium | Heavy canvas particles cause frame drops on mobile | Cap maximum particle count to 40; cancel `requestAnimationFrame` on component unmount. |
| **Internationalization Drift** | Medium | Vietnamese text hardcoded in subcomponents | Strictly test both `/vi` and `/en` routes for 100% translation purity. |
| **Regressions in Core Logic** | High | UI redesign breaks server-authoritative XP/attempts | Isolate UI changes to presentation layers; preserve all API submission contracts. |

---

## 5. NON-REGRESSION CHECKLIST

- [x] All 62 routes must remain accessible and functional.
- [x] Server-authoritative anti-cheat and scoring logic must not be altered.
- [x] SRS SM-2 algorithm calculations must remain mathematically unchanged.
- [x] Existing Prisma database schema and migrations must remain intact.
- [x] Both Vietnamese (`/vi`) and English (`/en`) routes must render complete translations.
- [x] `pnpm lint`, `pnpm test`, and `pnpm build` must pass after every task.
- [x] Every completed task must be committed and pushed immediately to `develop`.

---

## 6. PRE-FLIGHT VERDICT

# 🟢 READY FOR EXECUTION

The pre-flight audit confirms that the baseline architecture is solid, all test suites pass, and the transformation plan is fully decomposed into 12 verifiable, non-destructive tasks.
