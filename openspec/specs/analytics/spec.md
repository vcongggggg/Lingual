# Learning Analytics & Personal Intelligence Specification (Baseline)

**Module:** Learning Analytics & Intelligence  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/analytics.ts`, `apps/web/src/app/[locale]/analytics/`  

---

## 1. Purpose & Scope

The Analytics module translates historical study attempts across all learning labs into actionable learning intelligence: 6-dimensional skill competency breakdown, 365-day study activity heatmaps, weakness detection, CEFR level estimation, learning goals, and automated weekly summary reports.

---

## 2. Analytics Algorithms & Visualizations

1. **Overall Learning Score (0–100)**: Weighted composite of accuracy, consistency, task volume, and CEFR progress.
2. **Estimated CEFR Level**: Continuous estimation from A1 to C2 based on historical practice difficulty and success rate.
3. **Weakness & Strength Detection**: Heuristic scanning identifying specific underperforming areas (e.g. "Speaking Fluency", "Past Tense Usage", "TOEIC Part 7").
4. **Time-Series Trends**: Rolling performance aggregations for 7-day, 30-day, and 90-day intervals.
5. **365-Day Activity Heatmap**: Exact 365-day historical activity matrix mapping study intensity per calendar day.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Analytics Aggregation & Scoring | `packages/domain/src/index.ts` | `packages/domain/test/analytics.test.ts` |
| Analytics API Suite | `apps/api/src/routes/analytics.ts` | `scripts/qa_analytics_test.ts` (30/30 PASS) |
| Analytics UI & Visual Charts | `apps/web/src/app/[locale]/analytics/` | `scripts/qa_master_routes.ts` |
