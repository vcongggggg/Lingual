# Community & Social Learning Lab Specification (Baseline)

**Module:** Social Learning & Community Lab  
**Status:** Implemented & Verified  
**Package:** `packages/domain/src/index.ts`, `apps/api/src/routes/community.ts`, `apps/web/src/app/[locale]/community/`  

---

## 1. Purpose & Scope

The Community module powers collaborative peer-learning through social profiles, friends/follow relationships, shared study notes with reactions and comments, learning activity feeds, study groups, and weekly leaderboards.

---

## 2. Capabilities & Social Graph

1. **Social Profile & Privacy**: Configurable privacy controls (`PUBLIC`, `FRIENDS_ONLY`, `PRIVATE`) governing activity visibility and stats.
2. **Friends & Following**: Mutual friendship requests and asymmetric follow graph. Self-friend requests are rejected (`HTTP 400`).
3. **Study Notes**: Rich markdown note creation, tag indexing, heart reactions, and peer comment threads. Note creation awards +15 XP.
4. **Study Groups**: Thematic topic groups (e.g. "IELTS 7.5+ Achievers", "TOEIC 900+ Sprint") with group discussions.
5. **Leaderboard**: Authoritatively ranked weekly leaderboards computed by aggregated XP.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Social Graph & Feed Domain Logic | `packages/domain/src/index.ts` | `packages/domain/test/community.test.ts` |
| Community API Endpoints | `apps/api/src/routes/community.ts` | `scripts/qa_community_test.ts` (20/20 PASS) |
| Community Frontend Routes | `apps/web/src/app/[locale]/community/` | `scripts/qa_master_routes.ts` |
