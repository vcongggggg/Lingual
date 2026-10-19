# OpenSpec Archive Directory

This directory stores immutable historical records of completed, verified, and merged **Change Proposals** in LinguaFlow.

---

## 1. Archive Policy

Once a change proposal in `openspec/changes/<change-name>/` is fully implemented, verified, and merged into the main codebase:
1. The living baseline specifications in `openspec/specs/` are updated to reflect the new system state.
2. The change package is moved from `openspec/changes/<change-name>/` into `openspec/archive/<change-name>/`.
3. The archived change folder remains an **immutable historical record** documenting the original motivation, design decisions, implementation tasks, and test verification logs.

---

## 2. Completed Foundation Phases (Phases 1–20 Baseline)

The baseline specifications established in `openspec/specs/` capture the complete architecture of Phases 1–20:
- **Phase 1–10:** Core Platform, Authentication, SM-2 SRS, Gamification, Design System & App Shell
- **Phase 11:** Listening Lab (Dictation & Shadowing)
- **Phase 12:** Smart Vocabulary Lab & Multi-Modal SRS
- **Phase 13:** Writing Lab & Local Feedback Engine
- **Phase 14:** Reading Lab & Bilingual Graded Reader
- **Phase 15:** Standardized Exam Practice Lab (TOEIC / IELTS / VSTEP / HSK / JLPT / TOPIK / DSAT)
- **Phase 16:** Community & Social Learning Lab
- **Phase 17:** Learning Analytics & Personal Intelligence Lab
- **Phase 18:** Speaking Lab & Pronunciation Engine
- **Phase 19:** Personalized AI Tutor & Adaptive Learning Lab
- **Phase 20:** Final Production Hardening, OWASP Security Audit & Launch Readiness
