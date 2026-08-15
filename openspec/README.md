# OpenSpec — LinguaFlow Specification & Change-Management Baseline

Welcome to the **OpenSpec** repository for **LinguaFlow**.

OpenSpec serves as the single source of truth for all architectural contracts, domain behaviors, security invariants, API specifications, and frontend capabilities in LinguaFlow across Phases 1–20.

---

## 1. What is OpenSpec in LinguaFlow?

OpenSpec is an executable-grade, structured specification and change-management framework. It ensures that:
1. **Implementation never silently diverges from specification.**
2. **All learning logic, scoring algorithms, and gamification rules remain server-authoritative.**
3. **Every architectural capability has full traceability** from `Requirement` → `Implementation File` → `Automated Test / QA Script`.
4. **Future feature work follows an explicit, audited lifecycle** preventing accidental regressions or breakages.

---

## 2. Directory Structure

```
openspec/
├── README.md                  # This handbook and system overview
├── project.md                 # LinguaFlow monorepo architecture & technology stack
├── specs/                     # Living baseline specifications (Single Source of Truth)
│   ├── authentication/        # User authentication, JWT, Argon2, session security
│   ├── authorization/         # RBAC roles, default-deny access control
│   ├── security/              # OWASP Top 10 defenses, rate limiting, anti-cheat, sanitization
│   ├── srs/                   # SuperMemo SM-2 algorithm, quality grading, deck integration
│   ├── gamification/          # XP awarding, streak calculation, anti-cheat invariants
│   ├── design-system/         # Deep Space Dark palette, glassmorphism, typography, a11y
│   ├── localization/          # Bilingual routing (/vi, /en), dictionary translation parity
│   ├── navigation/            # App shell, sidebar, mobile navigation, route guards
│   ├── dashboard/             # Learner portal, skill radar, study recommendations
│   ├── listening/             # Dictation Lab & Shadowing Lab
│   ├── vocabulary/            # Smart Vocabulary Hub, custom folders, multi-modal SRS
│   ├── writing/               # See & Write, Guided Writing, Free Writing, Heuristics
│   ├── reading/               # Graded bilingual reader, comprehension anti-cheat
│   ├── exam-practice/         # TOEIC/IELTS/VSTEP/HSK/JLPT/TOPIK/DSAT simulation & scaled scoring
│   ├── community/             # Social profiles, friendships, activity feed, study notes, groups
│   ├── analytics/             # Multi-skill scoring, trend series, heatmap, weakness radar
│   ├── speaking/              # Speech recognition, fluency/pronunciation scoring, audio privacy
│   └── tutor/                 # Rule-based AI Tutor, adaptive study plans, mini sessions
├── changes/                   # Active change proposals under review or implementation
│   └── README.md              # Proposal template and RFC guidelines
└── archive/                   # Immutable historical log of completed & verified changes
    └── README.md              # Archive protocol and change history
```

---

## 3. Specification Anatomy

Every baseline specification in `openspec/specs/<module>/spec.md` follows a rigorous standard:

1. **Purpose & Scope**: What the module achieves and its system boundaries.
2. **Domain Concepts**: Core entities, data structures, and mathematical formulas.
3. **Functional Requirements**: Explicit, testable GIVEN-WHEN-THEN scenarios.
4. **Behavioral Invariants**: Immutable rules that must never be violated.
5. **Inputs & Outputs**: API request/response shapes and domain contracts.
6. **Error & Edge Cases**: Malformed payload handling, rate limits, 404/400/403/429 behaviors.
7. **Security & Anti-Cheat Constraints**: User isolation, server authority, sanitization.
8. **Integration Contracts**: How the module interacts with SRS, XP, Streaks, Analytics, and Tutor.
9. **Traceability Matrix**: Mapping each requirement directly to implementation files and unit/QA tests.

---

## 4. Change Management Workflow

All future modifications, refactorings, or new capabilities MUST proceed through the standard OpenSpec lifecycle:

```
    Read relevant specs (openspec/specs/)
                 ↓
    Create change proposal (openspec/changes/<change-name>/proposal.md)
                 ↓
    Define requirements & test scenarios (requirements.md)
                 ↓
    Define technical design & affected files (design.md)
                 ↓
    Define implementation checklist (tasks.md)
                 ↓
    Execute implementation (code & tests)
                 ↓
    Execute full regression & QA verification (verification.md)
                 ↓
    Update living specs in openspec/specs/
                 ↓
    Archive change package (openspec/archive/<change-name>/)
```

---

## 5. Golden Rules for Developers & AI Agents

> [!IMPORTANT]
> 1. **Server Authority**: Client-provided `xpAwarded`, `streak`, `score`, or `quality` must ALWAYS be rejected or recalculated server-side.
> 2. **Zero Regressions**: No change may break existing tests or alter SM-2 algorithms without explicit change authorization.
> 3. **Privacy by Default**: Audio recordings and sensitive learning telemetry must remain on-device or strictly user-isolated.
> 4. **No LLM Hard Dependencies**: Core functionality must remain operable via local deterministic heuristics (`LocalTutorProvider`).
> 5. **Bilingual Parity**: All UI pages and feedback messages must support both Vietnamese (`/vi`) and English (`/en`).
