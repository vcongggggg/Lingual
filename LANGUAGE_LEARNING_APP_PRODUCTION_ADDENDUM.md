# LinguaFlow - Production Engineering Addendum

> Companion to `LANGUAGE_LEARNING_APP_FULL_PLAN.md`.
>
> The original plan is a strong product plan. This addendum closes the gap
> between an attractive portfolio demo and a web product that is designed to
> be deployed, monitored, secured, and evolved responsibly.

## 11. Delivery Baseline

### 11.1 Product Boundary

The first public release is deliberately narrow:

- One learner journey: Vietnamese native speaker learning English.
- One curated course: beginner A1, five units, each with 4-6 lessons.
- Vocabulary, lessons, SM-2-style review, four games, progress, XP/streak,
  and an admin content workflow.
- Responsive web app, not a native mobile app.
- No social feed, language exchange, live multiplayer, voice scoring, or
  payment in MVP.

This is enough to demonstrate a serious full-stack product. It also leaves
room for a user to finish a complete learning loop rather than encountering a
large collection of unfinished screens.

### 11.2 Non-Functional Requirements

| Area | MVP target | Public-release target |
|---|---|---|
| Availability | Best-effort student demo. | 99.5% monthly excluding scheduled maintenance. |
| Web performance | Main learning screen usable on a mid-range mobile device. | LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 on core routes under normal network conditions. |
| API responsiveness | Most read/mutation endpoints under 500ms locally. | p95 read <= 400ms; p95 normal write <= 700ms excluding AI/STT providers. |
| Security baseline | No secrets committed; auth and access checks covered by tests. | OWASP ASVS Level 1-inspired release checklist complete. |
| Recovery | Database can be recreated from migrations and seed data. | Restore a production backup into an isolated environment at least quarterly. |
| Accessibility | Keyboard path works for lessons and games. | WCAG AA contrast, visible focus, labels, transcript/captions, reduced-motion support. |

### 11.3 Chosen Architecture

Use a TypeScript monorepo so types, validation schemas, and API contracts are
shared without copying them between frontend and backend.

```text
Browser / PWA
  |
  | HTTPS, explicit CORS origin, credentials include
  v
Next.js web application (Vercel)
  |
  | REST /api/v1 through api.linguaflow.example
  v
NestJS API (container on Render/Railway/Fly)
  |                  |                    |
  v                  v                    v
PostgreSQL        Redis + BullMQ      Object storage / CDN
  |                  |
  |                  +--> scheduled jobs: reminders, audio generation,
  |                       stale session cleanup, analytics rollups
  v
Managed backups

External services: email provider, error tracking, AI/STT/TTS, Stripe (P1)
```

Recommended repository layout:

```text
linguaflow/
  apps/
    web/                       # Next.js + TypeScript
    api/                       # NestJS + TypeScript
    worker/                    # BullMQ worker; can start inside api for MVP
  packages/
    contracts/                 # Zod request/response schemas, API types
    domain/                    # pure SRS, scoring, XP rules
    config/                    # shared lint, TypeScript, Tailwind presets
  prisma/
    schema.prisma
    migrations/
    seed/
  infra/
    docker/
    compose/
  docs/
    adr/                       # Architecture Decision Records
    runbooks/
  .github/workflows/
```

### 11.4 Required Architecture Decisions

Write a short ADR before implementing each decision. The initial ADR list:

1. `ADR-001`: monorepo with `pnpm` workspaces and Turborepo.
2. `ADR-002`: REST API, `/api/v1`, OpenAPI-generated documentation.
3. `ADR-003`: access token plus rotating refresh-session cookie.
4. `ADR-004`: PostgreSQL is the source of truth; Redis is disposable cache and
   queue infrastructure.
5. `ADR-005`: SM-2-compatible scheduler first, with an interface that allows
   FSRS later.
6. `ADR-006`: server-side audio cache and object storage; browser TTS is
   fallback only.
7. `ADR-007`: payment entitlement changes only from a verified provider
   webhook.

## 12. Security, Privacy, and Abuse-Prevention Plan

OWASP ASVS is a practical verification baseline for web application technical
security controls. This plan uses an ASVS Level 1-inspired checklist for the
public release, then raises the bar only when the product and its risk justify
it. Keep the current OWASP ASVS checklist in the project documentation and
review it before each public release.

### 12.1 Threat Model

| Asset / flow | Likely threat | Required control | Verification |
|---|---|---|---|
| Account login | Credential stuffing, brute force, account enumeration. | Argon2id password hashing, generic login errors, login throttling by IP and account, lockout/backoff, optional email verification. | Integration tests for throttling and non-enumerating errors. |
| Session | Stolen refresh token, session fixation, CSRF. | Short access session, rotating opaque refresh token stored hashed, `HttpOnly`, `Secure`, `SameSite=Lax` cookie, CSRF/origin protection, logout-all-devices. | Browser E2E plus API tests. |
| User data | IDOR: user reads or edits another learner's progress. | Ownership check in every service query; never accept `userId` from the client for user-owned resources. | Test user A against user B IDs. |
| Admin CMS | Privilege escalation, accidental content changes. | RBAC permission guard, admin-only routes, audit log, four-eyes review for published content. | Guard and audit-log tests. |
| AI requests | Prompt injection, unsafe or costly requests, personal data leakage. | Fixed system policy, narrow task schema, provider abstraction, quotas, content moderation, no tools with write privileges, redact secrets. | Adversarial prompt tests and quota tests. |
| File/audio upload | Malware, oversize object, content-type spoofing. | Signed upload URL, allowlist MIME + magic-byte check, size cap, private storage by default, virus scan before public use. | Upload validation tests. |
| Payments | Forged callback, replay, client price manipulation. | Signed raw webhook verification, price IDs server-side, unique webhook event ID, transactional entitlement update. | Replay and invalid-signature tests. |
| Dependencies / CI | Known vulnerable package, secret leak, compromised workflow. | Lockfile, Dependabot, vulnerability scan, secret scan, pinned actions, least-privilege workflow token. | CI gate on pull request. |

### 12.2 Authentication and Session Design

Do not put long-lived JWTs in `localStorage`. Use two separate concepts:

| Token / record | Location | Lifetime | Purpose |
|---|---|---|---|
| Access token | `HttpOnly`, `Secure` cookie or in-memory response for a short session. | 10-15 minutes. | Authorize ordinary API calls. |
| Refresh session | Opaque random token in `HttpOnly`, `Secure`, `SameSite=Lax` cookie; only a hash is saved in DB. | 7-30 days, configurable. | Obtain a new access token. |
| CSRF token | Non-HttpOnly cookie or response body header. | Session lifetime; rotate on login. | Required on state-changing browser requests when using cookie auth. |
| Password reset token | One-time random token; only hash stored in DB. | 15-30 minutes. | Reset password; invalidated after use. |

Implementation rules:

- Hash passwords with Argon2id. Never log, return, or persist plaintext
  passwords.
- A `Session` table has `id`, `userId`, `tokenHash`, `createdAt`, `expiresAt`,
  `lastUsedAt`, `ipHash`, `userAgentSummary`, and `revokedAt`.
- Refresh rotates on every successful use. Reuse of an already-rotated token
  revokes the whole token family and requires login again.
- Password change, "log out all devices", disabling an account, or suspected
  token reuse revokes every active session.
- The login response is deliberately identical for unknown email and wrong
  password.
- Email verification is required before password reset and before expensive
  AI quotas, but may be optional for a short demo onboarding flow.

### 12.3 Authorization and RBAC

Roles:

| Role | Can do |
|---|---|
| `learner` | Own profile, own progress, own saved words, public course content. |
| `content_editor` | Draft and edit content but cannot publish. |
| `content_reviewer` | Review and publish approved content. |
| `moderator` | Review reports and community content after community features exist. |
| `admin` | Manage users/roles, system configuration, audit review. |

Enforce permissions through a NestJS guard and service-layer scope, not only by
hiding frontend controls. Each admin mutation writes `AuditLog`:

```text
AuditLog
- id
- actorUserId
- action
- entityType
- entityId
- beforeJson (redacted)
- afterJson (redacted)
- requestId
- createdAt
```

### 12.4 Input Validation and API Safety

- Define every request and response with Zod schemas in `packages/contracts`.
- Use Nest validation at the API boundary; reject unknown fields by default.
- Normalize text (`trim`, Unicode normalization where relevant), then apply a
  field-specific length limit before persistence.
- Use typed Prisma methods. If raw SQL is truly required, use parameterized
  queries, document why, and add a test. Never concatenate user input into SQL.
- React safely escapes plain text. Rich lesson HTML is sanitized server-side
  against a strict allowlist before storing and is rendered only from approved
  content.
- Return a consistent error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted answer is invalid.",
    "requestId": "req_..."
  }
}
```

- Use status codes deliberately: `400` invalid request, `401` unauthenticated,
  `403` authenticated but forbidden, `404` resource not found or intentionally
  hidden, `409` idempotency/conflict, `422` valid syntax but impossible state,
  and `429` rate limited.
- Paginate list routes with a bounded cursor or offset (`limit` maximum 100).
- Add `Idempotency-Key` to operations that can be duplicated by a retry:
  checkout creation, paid credit purchase, email confirmation, and bulk import.

### 12.5 Browser, Transport, and CORS Controls

NestJS can set security headers with Helmet and supports explicit CORS,
CSRF, and rate-limit configuration. Those tools are useful, but configuration
is still the application's responsibility.

Required policy:

- HTTPS only in staging and production. Redirect HTTP at the edge.
- `NODE_ENV=production` requires secure cookies and a non-empty trusted origin
  list. Startup fails if this is misconfigured.
- CORS must list exact origins, for example
  `https://app.linguaflow.example`; never `*` with credentials.
- Allow only needed methods and headers; set `credentials: true` only for the
  approved web origin.
- Helmet headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, and `frame-ancestors 'none'` or an intentional CSP
  equivalent.
- CSP uses nonces/hashes where practical. It disallows untrusted script
  origins. Third-party analytics must be intentionally added to CSP.
- State-changing requests include a CSRF token header and are rejected unless
  the `Origin` is trusted.
- Disable caching for auth and personalized responses. Cache immutable static
  assets by content hash.

### 12.6 Rate Limits and Anti-Abuse Policies

Redis-backed limits are shared by all API instances. The key combines an action
with hashed IP and, when available, account ID or normalized email. Trust proxy
headers only when the deployed reverse proxy is explicitly configured.

| Endpoint class | Default policy | Additional rule |
|---|---|---|
| Public reads | 120 requests/min/IP. | Cache public content at CDN/API where safe. |
| Login | 5 attempts / 15 min per `IP + normalized email`. | Exponential delay after failures; generic message. |
| Register | 3/hour/IP and 5/day/email. | Require email verification before AI usage. |
| Password reset | 3/hour/email and 10/day/IP. | Always return a generic success response. |
| Authenticated mutation | 60/min/user. | Reject invalid CSRF/origin before costly work. |
| Game answer submit | 90/min/user. | Server recalculates score; client score is not trusted. |
| AI conversation | 10/min/user plus daily plan quota. | Token and length limits; queue expensive tasks. |
| File upload request | 10/hour/user. | Signed URL expires in 5 minutes; maximum file size. |
| Payment webhook | Provider-specific but no general public throttle. | Verify signature before parsing/persisting the event. |

Return `429` with `Retry-After`. Log only the action and hashed identifier, not
passwords, token values, or full prompts.

### 12.7 AI Safety Plan

The AI layer is P1. It must be useful without becoming a privileged control
plane.

- AI receives only the learner's selected language, level, task, and necessary
  prompt text. It never receives DB credentials, internal system prompts, or
  private data from other users.
- Feature-specific prompts are structured outputs, e.g. correction result:
  `correctedText`, `explanations[]`, `encouragement`, `cefrEstimate`.
- Validate the structured output before rendering. Treat all generated text as
  untrusted; escape/sanitize it like user input.
- No AI function may directly write lesson content, change roles, issue refunds,
  or run database queries. Admin approval is required for official content.
- Apply input length limits, per-user budgets, daily spend caps, and
  cancellation/timeout rules.
- Store only the minimum conversation history needed for user experience; give
  the learner a delete-conversation option.
- Add prompt-injection tests such as requests to reveal system instructions,
  ignore language-learning rules, or access another user's data.
- Review AI controls against the current OWASP LLM verification guidance before
  enabling paid AI features.

### 12.8 Secrets, Privacy, and Data Retention

Required environment variables:

```text
NODE_ENV
WEB_ORIGIN
API_PUBLIC_URL
DATABASE_URL
REDIS_URL
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_PEPPER
CSRF_SECRET
EMAIL_PROVIDER_API_KEY
OBJECT_STORAGE_BUCKET
OBJECT_STORAGE_ACCESS_KEY
OBJECT_STORAGE_SECRET_KEY
SENTRY_DSN
AI_PROVIDER_API_KEY
STRIPE_SECRET_KEY                 # P1
STRIPE_WEBHOOK_SECRET             # P1
```

Rules:

- `.env.example` contains names and safe placeholders only.
- Never prefix secrets with `NEXT_PUBLIC_`; any variable with that prefix is
  exposed to the browser bundle.
- Production secrets live in the deployment provider secret store, not GitHub
  repository files, screenshots, client code, or logs.
- Enable secret scanning and rotate a secret immediately if exposed.
- Collect minimal profile data. Store IP as a short-lived hash for abuse
  detection, not an indefinite raw address.
- Give users account export and deletion requests. Deletion removes personally
  identifying fields, revokes sessions, and queues object deletion; keep only
  anonymized aggregate analytics where legally permitted.
- Set documented retention: audit log 12 months, failed-login security events
  90 days, error traces 30-90 days, deleted recordings immediately or within a
  short recovery window.

## 13. Data Design, Consistency, and Migrations

### 13.1 Database Constraints and Indexes

Prisma model names can differ, but these invariants are mandatory:

```text
User.email                                      unique
UserWordState(userId, wordId)                   unique
UserLessonProgress(userId, lessonId)            unique
DailyProgress(userId, date)                     unique
ReviewLog(userId, idempotencyKey)               unique when key is present
GameSession.idempotencyKey                      unique when key is present
PaymentWebhookEvent.providerEventId             unique
Session.tokenHash                               unique

UserWordState(userId, dueAt)                    index
ReviewLog(userId, createdAt DESC)               index
GameSession(userId, endedAt DESC)               index
UserLessonProgress(userId, updatedAt DESC)      index
AuditLog(entityType, entityId, createdAt DESC)  index
Subscription(userId, status)                    index
```

The review query must use the `UserWordState(userId, dueAt)` index because it
is the core daily read path:

```text
WHERE user_id = :currentUser
  AND due_at <= now()
  AND status IN ('learning', 'review')
ORDER BY due_at ASC
LIMIT :boundedLimit
```

### 13.2 Transaction Boundaries

Use a PostgreSQL transaction when an operation changes multiple facts that must
agree.

| Flow | Transactional work | Idempotency / concurrency rule |
|---|---|---|
| Submit SRS rating | Write `ReviewLog`, update `UserWordState`, increment daily progress and XP ledger. | Request key or unique review attempt prevents a retry from awarding XP twice. |
| Complete lesson | Upsert progress, write XP ledger, unlock next lesson if conditions met. | Completion is monotonic; never downgrade completed state from a retry. |
| Finish game | Persist server-calculated score, update XP, update weak-word signals. | Score is derived from attempts and server clock, not accepted from browser. |
| Publish content | Change content version, write audit log, enqueue cache invalidation. | Optimistic version check rejects two editors overwriting each other. |
| Payment webhook | Store event, update subscription and entitlement. | Unique provider event ID blocks replay. |

Keep transactions short. Fetch external AI, email, payment, and object-storage
work outside the transaction, then enqueue it after a successful commit. If a
deadlock occurs, retry the small, idempotent transaction a limited number of
times with jitter; do not blindly retry the entire HTTP request.

### 13.3 Migration and Seed Policy

| Environment | Command / action | Rule |
|---|---|---|
| Local development | `prisma migrate dev` | Developer creates reviewed migration files; no manual production schema edits. |
| CI | `prisma validate`, regenerate client, apply migrations to disposable Postgres. | A PR fails if schema and migration history disagree. |
| Staging | `prisma migrate deploy` once in release step. | Test new schema with staged application build. |
| Production | `prisma migrate deploy` once, before or as a controlled release job. | Never use `migrate dev`, `db push`, or destructive reset. |

For any large or risky migration use expand-contract:

1. Add a nullable column/table/index in a backward-compatible release.
2. Deploy code that writes both old and new representation if needed.
3. Backfill in bounded background batches with progress metrics.
4. Switch reads after validation.
5. Remove obsolete column only in a later release and only after backup.

Seeds are not migrations. Keep:

- `seed:demo`: idempotent, small public demo content.
- `seed:local`: richer local content not required for production.
- `seed:staging`: controlled data fixture for acceptance tests.

Never run a local dump automatically against production. Importing personal user
data requires explicit consent, a pre-import backup, schema compatibility check,
and a documented rollback plan.

### 13.4 Backup and Restore

- Use a managed PostgreSQL plan with automated backups before storing real user
  data. Free-tier expiry is acceptable only for a disposable portfolio demo.
- Define RPO/RTO for a paid product: initial target RPO 24 hours and RTO 4
  hours; improve as usage grows.
- Store database backup ownership and retention in the infrastructure account.
- Run a restore drill quarterly into an isolated database, then run a smoke
  query and delete the temporary restore.
- Redis is treated as rebuildable. Do not keep the only copy of learner state,
  payment state, or course content in Redis.

## 14. Testing and Quality Strategy

### 14.1 Test Pyramid

| Layer | Tooling | What it proves | Required examples |
|---|---|---|---|
| Pure unit tests | Vitest for `packages/domain`. | Deterministic business rules. | SM-2 scheduling, XP calculations, score normalization, input normalization. |
| API/service integration | Vitest/Jest + Supertest + disposable PostgreSQL/Redis. | Guards, Prisma queries, transactions, rate-limit wiring. | Login, IDOR, SRS submit, payment webhook replay, publish audit log. |
| Frontend component tests | Vitest + Testing Library. | Interaction and accessibility of isolated components. | Flashcard rating, timer pause, error state, keyboard game controls. |
| End-to-end | Playwright against a seeded test environment. | Real user flows across web/API. | Onboarding -> lesson -> review -> game -> dashboard; admin publish; logout. |
| Non-functional | Lighthouse CI, axe, k6/Artillery smoke. | Accessibility, bundle/regression, basic load behavior. | Core route WCAG scan, 50 concurrent read requests, page budget. |

### 14.2 Minimum Test Cases

Authentication and access:

- Registration validates email/password and does not leak whether an email
  exists.
- Login supports valid credentials, rejects invalid credentials generically,
  applies the limit, rotates session token, and sets correct cookie flags.
- A request without session receives `401`; learner access to admin receives
  `403`; learner A cannot read learner B's resources.
- Logout current device and logout-all-devices revoke the expected sessions.
- CSRF/origin rejection works for cookie-authenticated mutations.

Learning domain:

- SM-2 ratings have fixed, versioned test vectors for new, learning, mature,
  lapse, and timezone boundary cases.
- A repeated `Idempotency-Key` does not create another review log, game score,
  XP award, or completion.
- Lesson completion is idempotent and keeps the best score.
- Daily XP uses the learner timezone and behaves correctly around midnight.
- Games cannot submit impossible score, negative time, foreign content ID, or
  more attempts than the session allows.

Payments and AI:

- Invalid payment signature, wrong amount, duplicate event, and out-of-order
  event do not grant premium.
- AI request is quota-limited, validates structured output, and does not render
  raw HTML.
- Prompt injection attempts do not disclose configuration or mutate data.

### 14.3 Test Data Isolation

- Every test suite gets an isolated test database schema/database and test
  Redis prefix.
- Never run tests against local development or production URLs.
- Playwright seeds a deterministic user, course, words, and content version
  through a test-only setup command that cannot execute in production.
- Upload test files go to a test bucket/prefix and are removed after each run.

### 14.4 Quality Gates

Pull requests cannot merge unless:

- formatter, lint, type check, unit tests, and API integration tests pass;
- `prisma validate` and a disposable migration apply pass;
- web and API production builds pass;
- Playwright smoke suite passes for changed core flows;
- dependency/secret/security scans have no unapproved high or critical finding;
- code review approves the change;
- coverage on `packages/domain` is >= 85% and overall changed lines have
  meaningful tests. Coverage is a warning signal, not a substitute for cases.

## 15. CI/CD, Environments, and Release Management

GitHub Actions runs the CI/CD workflows. Use dependency caching for reusable
package data and workflow artifacts for outputs such as Playwright reports and
logs.

### 15.1 Environment Strategy

| Environment | Purpose | Data | Deployment trigger |
|---|---|---|---|
| Local | Development and fast feedback. | Local Docker Postgres/Redis and local seeds. | Developer command. |
| Preview | Review a pull request UI/API integration. | Isolated or mocked external services; no production user data. | Every pull request. |
| Staging | Final integration and manual QA. | Seeded non-sensitive content, test accounts only. | Merge to `develop` or explicit staging promotion. |
| Production | Real public users. | Managed database, real secrets, backups. | Protected manual approval from a tagged release or `main`. |

Use separate databases, Redis namespaces, storage buckets/prefixes, AI keys,
payment webhook endpoints, and OAuth callback URLs per environment.

### 15.2 Canonical CI Workflow

`ci.yml` triggers on pull requests and pushes:

1. Checkout exact commit.
2. Install pinned Node LTS and `pnpm`; restore package cache.
3. `pnpm install --frozen-lockfile`.
4. Format check, ESLint, TypeScript check.
5. Run pure unit and component tests with coverage.
6. Start disposable PostgreSQL and Redis services.
7. Apply Prisma migrations, run API integration tests.
8. Build web, API, and worker production artifacts.
9. Run dependency audit, secret scan, SAST, and container scan.
10. Start the composed app, run Playwright smoke and axe checks.
11. Upload Playwright report, screenshots, coverage, and logs on failure.

Recommended security tooling:

- Dependabot for dependency update pull requests.
- `npm audit`/pnpm audit as one signal, not the only signal.
- Gitleaks for repository secrets.
- Semgrep or equivalent for static analysis.
- Trivy for image and filesystem vulnerability scans.
- CycloneDX SBOM generated for release artifacts.

### 15.3 Deployment Pipeline

`deploy-staging.yml` and `deploy-production.yml` use the built artifact/image
that already passed CI; do not rebuild arbitrary code differently at deploy
time.

1. Confirm target environment and protected approval.
2. Verify backup status for production.
3. Run `prisma migrate deploy` exactly once as a release job.
4. Deploy API/worker image.
5. Wait for `/health/live` and `/health/ready`.
6. Deploy Next.js web with the matching API URL.
7. Run authenticated smoke checks with a seeded/test account.
8. Record release commit, migration version, and result in deployment log.
9. Notify the team only after checks pass.

Rollback rules:

- Roll back application image/deployment when health or smoke checks fail.
- Never automatically roll back a destructive database migration.
- Use backward-compatible migrations and feature flags so application rollback
  remains safe.
- If a data migration has started, stop the worker, restore only after a
  reviewed runbook decision, and communicate user impact.

### 15.4 Docker Requirements

Development `compose.yaml` runs `web`, `api`, `worker`, `postgres`, `redis`,
and optional mail catcher.

Production container rules:

- Multi-stage build with locked dependencies.
- Non-root user.
- Read-only filesystem where provider permits.
- `NODE_ENV=production`.
- Health endpoint available without authentication.
- Bind to `0.0.0.0:$PORT`.
- No development server, debugger, seed command, or database reset in the
  regular web start command.
- API migration is a release step, not an unconditional command chained to
  every web instance start.

## 16. Production Operations, Observability, and Performance

### 16.1 Health Endpoints

| Route | Meaning | Checks |
|---|---|---|
| `/health/live` | Process is running. | No DB/Redis/network dependency. |
| `/health/ready` | Instance can serve requests. | Database connection, Redis connection if required for core requests, configuration readiness. |
| `/health/version` | Deployment visibility. | Commit SHA, build timestamp, non-secret environment name. |

### 16.2 Logs, Errors, Metrics, and Alerts

Use structured JSON logs via Pino or equivalent:

```text
timestamp, level, requestId, route, method, statusCode, durationMs,
userIdHash, errorCode, deploymentVersion
```

Do not log passwords, cookies, bearer tokens, CSRF values, payment signatures,
full email addresses, full user prompts, or complete uploaded content.

Required operational signals:

- Error tracking: Sentry or equivalent for web and API exceptions.
- Uptime monitor: external request to public `/health/ready`.
- API metrics: request rate, p50/p95/p99 latency, 4xx/5xx rate, rate-limit
  events, DB pool saturation, queue lag, worker failures.
- Business metrics: new registrations, lesson completion, reviews due/completed,
  game completion, AI quota exhaustion, payment conversion once enabled.
- Alerts: readiness failing, 5xx spike, elevated auth failures, queue age,
  migration failure, backup failure, payment webhook failures.

### 16.3 Performance Plan

Frontend:

- Use server-rendered/static course catalog where possible; protect
  personalized views with authenticated fetches.
- Split game code with dynamic imports so a learner dashboard does not load all
  animation/game libraries.
- Use optimized image component, responsive sizes, WebP/AVIF where supported,
  and static asset content hashes.
- Preload only the next likely lesson/audio, not the whole course.
- Record Web Vitals and set a performance budget in CI.

Backend/database:

- Select only required Prisma fields; avoid `include` trees that cause N+1
  query patterns.
- Add indexes before data volume makes slow queries visible.
- Paginate all history/leaderboard records.
- Cache public course metadata and short-lived dashboard aggregates; never
  cache authorization decisions or mutable entitlements without an invalidation
  plan.
- Run aggregate analytics and notification tasks through BullMQ worker, not
  request-response path.

### 16.4 Capacity Growth Path

| Stage | Expected setup | Upgrade signal |
|---|---|---|
| Portfolio demo | One web deployment, one API instance, managed free/small Postgres and Redis, no guarantees. | A recruiter can use the core flow. |
| Early beta | Paid managed DB backup, object storage, error tracking, one worker, staging environment. | Real recurring users and uploaded/audio content. |
| Growing product | Multiple API replicas, dedicated worker replicas, CDN/WAF, managed observability, queue monitoring. | p95 latency, queue lag, or database CPU/connection limit persists. |
| Mature product | Multi-region strategy only if evidence requires it. | Geographic latency and contractual availability needs. |

Do not claim "production-scale" on a free plan. In a portfolio README, say
"public demo deployment" until backups, monitoring, and a supported service
level are actually enabled.

## 17. Detailed Delivery Roadmap

### 17.1 Sprint 0 - Engineering Setup (3-5 days)

Goal: make future work safe and repeatable before feature development.

Tasks:

- Create monorepo, `pnpm` workspace, shared TypeScript config, ESLint,
  Prettier, commit conventions, `.editorconfig`, and path aliases.
- Bootstrap Next.js, NestJS, Prisma, PostgreSQL, Redis, and Docker Compose.
- Add `/health/live`, `/health/ready`, and `/health/version`.
- Create `env.example`, configuration validation, and startup failure for
  missing production-required values.
- Create GitHub repository protections, CI skeleton, Dependabot, and secret
  scanning.
- Document ADR-001 to ADR-007 and local startup command.

Done when:

- A new developer can clone, copy `.env.example`, run one documented command,
  and use the web/API locally.
- CI runs lint/type/build/unit smoke and Docker Compose config validation.

### 17.2 Sprint 1 - Identity, Authorization, and Content Foundation (2 weeks)

Goal: establish the secure user and content core.

Tasks:

- Prisma schema for users, roles, sessions, language, course, unit, lesson,
  content version, and audit log.
- Registration, login, refresh, logout, logout-all, password reset, and email
  verification flows.
- Argon2id passwords, session rotation, exact CORS/CSRF policy, rate limits,
  security headers, request IDs, and structured logs.
- Admin role guard and draft/review/publish state for lesson content.
- Seed one small Vietnamese -> English introductory course.
- API OpenAPI document and standardized error envelope.

Done when:

- Learner and admin permissions have integration tests.
- An unauthenticated user cannot call protected routes; a learner cannot read
  or mutate another learner's data; all admin changes create an audit record.

### 17.3 Sprint 2 - Onboarding, Lessons, and Vocabulary (2 weeks)

Goal: allow a new learner to complete a meaningful first lesson.

Tasks:

- Onboarding flow: native language, target language, level, goal, timezone,
  and first daily plan.
- Course/unit/lesson API, learner progress, vocabulary detail, saved words,
  and approved audio asset records.
- Activity renderer for multiple choice, typing, cloze, and basic sentence
  scramble.
- Server-side XP ledger instead of only a mutable XP counter.
- Responsive, keyboard-accessible lesson UI with clear feedback and saved
  resume state.
- Unit/component/E2E test for onboarding -> first lesson -> dashboard update.

Done when:

- A Vietnamese learner can register, choose English, complete "My name is...",
  and see vocabulary/progress persisted after refresh.

### 17.4 Sprint 3 - SRS and Learning Consistency (2 weeks)

Goal: make the daily review loop correct, explainable, and idempotent.

Tasks:

- Implement pure scheduler module with versioned SM-2-compatible test vectors.
- Add `UserWordState`, `ReviewLog`, due query index, review queue, rating UI,
  and weak-word selection.
- Submit review transaction with idempotency key and XP ledger update.
- Timezone-aware daily progress and streak calculation.
- Worker job that sends one configurable due-review reminder; email only in
  staging until consent/preferences exist.
- Add dashboard: due count, recent accuracy, daily goal, current streak.

Done when:

- A duplicate review request cannot award XP twice.
- Scheduler tests cover Again/Hard/Good/Easy, lapse, midnight, and retry cases.

### 17.5 Sprint 4 - Game Center Core (2 weeks)

Goal: make games reinforce real learning data instead of using hard-coded demo
words.

Tasks:

- Create shared game session engine: prompt selector, timer, attempt record,
  scoring calculator, timeout validation, and result persistence.
- Implement Word Match, Typing Race, Sentence Scramble, and Fill-in-the-Blank
  Blitz.
- Select prompts from due, weak, current-lesson, and previously learned words
  with a documented weighting rule.
- Calculate final score and XP server-side; add cooldown/anti-abuse policy.
- Add keyboard controls, reduced motion, pause/focus handling, and mobile tap
  targets.
- Capture Playwright screenshots/video-ready demo route for each game.

Done when:

- Four games work on desktop/mobile, use real learner data, and reject
  impossible/replayed score submissions.

### 17.6 Sprint 5 - Product Insight, Content Operations, and PWA (2 weeks)

Goal: turn a feature collection into a usable study product.

Tasks:

- Progress dashboard with weekly XP, accuracy, mastered/weak words, and next
  recommended action.
- Streak, rank, first 15 badges, notification preferences, and accessibility
  audit/fixes.
- Admin CMS list/filter/draft/review/publish workflow and audit log screen.
- PWA manifest, offline shell only, explicit offline state; do not promise
  offline review until conflict behavior is designed.
- CDN/object storage audio integration and fallback/error UI.
- Add performance budget, Lighthouse/axe CI check, error tracking, and uptime
  monitor configuration documentation.

Done when:

- An editor can create a draft, reviewer can publish it, learner sees the new
  version, and an audit record identifies who changed it.

### 17.7 Sprint 6 - Staging, Public Demo, and Release Gate (2 weeks)

Goal: deploy a reliable public demo with evidence that it works.

Tasks:

- Set up Vercel web preview/production, container API, managed Postgres,
  Redis, storage, and separate staging environment.
- Configure explicit CORS origins, cookie domains, health probes, secrets,
  backups, error tracking, uptime monitor, and release workflow.
- Run database migration via controlled deployment job; run idempotent
  production demo seed only if the database is empty.
- Build CI workflow, deployment runbook, incident notes, data retention
  document, and architecture diagram.
- Run full Playwright E2E suite, manual device QA, keyboard QA, and browser
  cache/login/CSRF verification.
- Prepare README, screenshots, demo credentials with restricted scope, and a
  2-4 minute portfolio walkthrough.

Done when:

- Production health checks pass, a fresh user completes the learning loop, logs
  have request IDs but no secrets, rollback procedure has been rehearsed in
  staging, and the repository is clean/documented.

### 17.8 Post-MVP Order

Only start the next item after the preceding release is stable:

1. AI writing correction with quota, structured output validation, and privacy
   control.
2. Listening content plus reviewed audio pipeline.
3. AI conversation partner and conversation deletion.
4. Stripe subscription with verified webhook lifecycle.
5. Speaking/shadowing beta with consent and recording retention policy.
6. Community content, moderation, reporting, and social features.
7. Japanese/Korean/Chinese language pairs after content/audio review capacity
   exists.

## 18. Deployment Runbook

### 18.1 Pre-Deploy Checklist

- [ ] All CI gates pass for the exact commit to be released.
- [ ] Production environment variables are present in provider secret stores.
- [ ] `WEB_ORIGIN`, `API_PUBLIC_URL`, cookie domain, CORS origin, OAuth
      redirect URI, and payment webhook URL point to production values.
- [ ] Managed PostgreSQL backup status is healthy.
- [ ] Migration is reviewed, backward compatible, and has a rollback note.
- [ ] No critical/high dependency, secret-scan, or SAST finding is unapproved.
- [ ] Error tracking release version is configured.
- [ ] A demo account is separate from admin and uses only demo data.

### 18.2 First Public Deployment

1. Create managed PostgreSQL and Redis in the same region as API.
2. Create object-storage bucket with private write access and CDN read policy
   only for approved public assets.
3. Deploy API and worker containers with readiness/liveness endpoints.
4. Configure the API custom domain/subdomain and exact web CORS origin.
5. Run `prisma migrate deploy` as the release job.
6. Run safe, idempotent `seed:demo` only if required public course data is
   absent; never load a developer's local DB dump.
7. Deploy Next.js with the public API base URL.
8. Run automated smoke route checks, then manually test login, lesson, review,
   game, logout/login, and admin access with separate accounts.
9. Enable uptime monitor and inspect logs/metrics for the first hour.
10. Record the deployed commit SHA, migration version, release owner, and any
    follow-up work.

### 18.3 Incident First Response

| Symptom | First action | Do not do |
|---|---|---|
| API 5xx spike | Check readiness, recent deploy, error tracker, DB/Redis connectivity; roll back app if needed. | Do not reset production DB or clear Redis before understanding impact. |
| Login CSRF/cookie failure | Check deployed HTTPS, proxy headers, exact origin, cookie flags, stale service worker/cache. | Do not disable CSRF globally. |
| Migration failure | Stop promotion, inspect migration and backup, retain old app if compatible. | Do not run `prisma db push`, reset, or edit migration history in production. |
| Suspected secret leak | Revoke/rotate secret immediately, audit access/logs, redeploy with replacement. | Do not simply delete the visible commit and assume the secret is gone. |
| Payment entitlement mismatch | Pause automatic entitlement changes, inspect verified webhook event IDs and audit logs. | Do not grant/refund based only on screenshot or browser redirect. |

## 19. Final Release Acceptance Checklist

The project can be called a polished public portfolio product when all are true:

- [ ] Core learning loop works end-to-end on desktop and mobile.
- [ ] Auth, CSRF, CORS, secure cookies, RBAC, validation, rate limits, security
      headers, and ownership tests are implemented and documented.
- [ ] Database constraints/indexes protect duplicate and high-frequency flows.
- [ ] Migrations, seed policy, backup policy, and restore procedure are written.
- [ ] Unit, integration, E2E, accessibility, and smoke performance tests run in
      CI.
- [ ] CI uploads useful failure artifacts and deployment uses protected
      environments.
- [ ] Health checks, structured logs, error tracking, uptime monitoring, and
      release version reporting are live.
- [ ] AI and payment features remain disabled until their specific safety and
      lifecycle checks are complete.
- [ ] README accurately states what is a public demo versus a fully managed
      production guarantee.
- [ ] Screenshots, demo video, seeded demo account, and a concise CV bullet
      make the project easy for a recruiter to inspect.

## 20. What Not To Build Yet

Do not dilute the first release with:

- Native mobile apps.
- Real-time language exchange or direct messaging.
- Open community uploads.
- Live multiplayer.
- Multiple language pairs.
- Voice pronunciation "scores" presented as factual assessment.
- Subscription billing before the free core loop has real use.
- A microservice split. The API and worker are enough; split services only
  after an actual bottleneck or ownership boundary appears.

The result is a plan from blank repository to a safe public release, while
still staying realistic for one student developer building a CV-quality
full-stack project.
