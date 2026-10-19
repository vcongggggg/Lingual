# Security & Anti-Cheat Baseline Specification

**Module:** System Hardening & Defensive Architecture  
**Status:** Implemented & Verified  
**Package:** `apps/api/src/server.ts`, `apps/api/src/middleware/rateLimiter.ts`, `packages/domain/src/index.ts`  

---

## 1. Purpose & Scope

Defines the defensive posture, input sanitization, rate limiting, anti-cheat boundaries, and OWASP Top 10 compliance mechanisms enforced across LinguaFlow.

---

## 2. Security Controls & Defenses

### A. HTTP Headers (OWASP A05)
- `Helmet`: Active across Express router (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`).
- `X-Powered-By`: Explicitly stripped to prevent stack disclosure.

### B. CORS Restriction (OWASP A01)
- Whitelist origin enforcement permitting only trusted development and production client origins (`http://localhost:3000`, `http://127.0.0.1:3000`). Untrusted origins receive CORS rejections.

### C. Rate Limiting & DoS Mitigation (OWASP A04)
- `authLimiter`: 5 requests per 15-minute window for `/auth/login` and `/auth/register`.
- `globalApiLimiter`: 1000 requests per minute per IP for `/api/*`.
- `chatbotLimiter`: 10 requests per minute per user/IP.
- `Payload Limit`: 10KB body limit (`express.json({ limit: '10kb' })`) returning HTTP `413 Payload Too Large`.

### D. Anti-XSS Input Sanitization (OWASP A03)
- `sanitizeHtmlContent`: Neutralizes `<script>`, `onerror`, `onload`, `javascript:`, and malformed DOM payloads before storage or rendering.

### E. Server-Authoritative Anti-Cheat
- **XP Calculation**: All XP awarding is computed by server domain logic. Client-injected XP properties (e.g. `xpAwarded: 999999`) are discarded.
- **Streak Calculation**: Server tracks timezone-aware activity dates and updates streaks strictly on validated attempts.
- **Exam Key Privacy**: Answer keys and explanations are omitted from client payloads during active exam attempts.
- **Submission Idempotency**: Duplicate attempt submissions within a deduplication window return cached responses without double-granting XP.

---

## 3. Traceability Matrix

| Security Control | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Security Headers Audit | `apps/api/src/server.ts` | `scripts/pentest_simulator.ts` (Vector 1) |
| CORS Whitelist Enforcement | `apps/api/src/server.ts` | `scripts/pentest_simulator.ts` (Vector 2) |
| Payload Size Limiting (10KB) | `apps/api/src/server.ts` | `scripts/pentest_simulator.ts` (Vector 4) |
| Anti-XSS Sanitizer | `packages/domain/src/index.ts` | `scripts/pentest_simulator.ts` (Vector 7) |
| Auth Rate Limiter | `apps/api/src/middleware/rateLimiter.ts` | `scripts/pentest_simulator.ts` (Vector 6) |
| Authoritative XP & Anti-Cheat | `apps/api/src/routes/writing.ts`, `speaking.ts` | `scripts/qa_writing_test.ts`, `qa_speaking_test.ts` |
