# Learner Dashboard Specification (Baseline)

**Module:** Dashboard & Learning Portal  
**Status:** Implemented & Verified  
**Package:** `apps/web/src/app/[locale]/dashboard/`, `apps/api/src/routes/curriculum.ts`  

---

## 1. Purpose & Scope

The Learner Dashboard is the central command center presenting personalized study stats, daily goals, streak trackers, SRS due counts, quick practice shortcuts, and AI recommendations.

---

## 2. Dashboard Widgets & Capabilities

1. **Daily Progress Card**: Completed tasks, minutes studied, and XP earned today vs. daily target.
2. **Streak Flame Indicator**: Current consecutive days active with motivational messaging.
3. **SRS Due Counter**: Number of vocabulary cards awaiting review today.
4. **Skill Radar Overview**: High-level competency scores across Listening, Reading, Writing, Speaking, Vocabulary, and Grammar.
5. **Quick Launch Lab Dock**: Direct access into Dictation, Free Writing, Speaking Repetition, and Practice Exams.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Dashboard Data Aggregation | `apps/api/src/routes/user.ts` | `scripts/qa_master_routes.ts` |
| Localized Dashboard Page | `apps/web/src/app/[locale]/dashboard/page.tsx` | `scripts/qa_master_routes.ts` |
