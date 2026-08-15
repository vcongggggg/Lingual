# Authentication Specification (Baseline)

**Module:** Authentication & Identity  
**Status:** Implemented & Verified  
**Package:** `apps/api/src/routes/auth.ts`, `packages/contracts/src/index.ts`  

---

## 1. Purpose & Scope

The Authentication module manages user registration, credential verification, session token issuance, account lockout protection, and secure profile bootstrapping for LinguaFlow learners and administrative staff.

---

## 2. Domain Concepts

- **User**: The identity entity containing `id`, `email`, `displayName`, `passwordHash`, `role`, `interfaceLocale`, `timezone`, `streak`, `totalXP`, and `failedAttempts`.
- **Argon2id Hashing**: Cryptographic password hashing protecting against GPU/ASIC brute-force attacks.
- **JWT (JSON Web Token)**: Signed bearer tokens holding user claims (`userId`, `role`, `sub`) with 15-minute expiration windows.
- **Account Lockout**: Anti-brute-force defense locking an account upon 5 consecutive failed login attempts.

---

## 3. Functional Requirements

### Requirement: User Registration
The server SHALL register new users with validated email, display name, and password.

#### Scenario: Successful Registration
- **GIVEN** a new unique email `learner@linguaflow.com` and password `SecurePassword@123`
- **WHEN** client posts to `POST /api/v1/auth/register`
- **THEN** server hashes the password with Argon2id
- **AND** creates the user record with default role `LEARNER`
- **AND** returns HTTP `201 Created` with a signed JWT `accessToken` and public user profile.

#### Scenario: Duplicate Email Registration
- **GIVEN** an existing registered email
- **WHEN** client attempts to register with that email
- **THEN** server rejects the request with HTTP `400 Bad Request` or `409 Conflict`.

### Requirement: Secure Authentication & Lockout
The server SHALL verify credentials and enforce account lockout.

#### Scenario: Successful Login
- **GIVEN** valid registered credentials
- **WHEN** client posts to `POST /api/v1/auth/login`
- **THEN** server resets failed login counters to 0
- **AND** returns HTTP `200 OK` with signed JWT `accessToken`.

#### Scenario: Exceeding Maximum Failed Attempts
- **GIVEN** an existing account
- **WHEN** 5 consecutive login attempts fail with wrong passwords
- **THEN** server triggers account lockout / rate-limit response (HTTP `423` or `429`)
- **AND** subsequent requests are blocked until the lockout duration expires.

---

## 4. Behavioral Invariants

1. Passwords MUST NEVER be stored in plaintext.
2. Passwords MUST be hashed with Argon2id prior to persistence.
3. JWT tokens MUST be signed with server environment `JWT_SECRET` and NEVER guessable fallback keys in production.
4. Passwords and password hashes MUST NEVER be returned in any API response.

---

## 5. API Endpoints

- `POST /api/v1/auth/register` — Register a new learner account.
- `POST /api/v1/auth/login` — Authenticate and retrieve JWT token.
- `GET /api/v1/auth/me` — Retrieve current authenticated session profile.
- `POST /api/v1/auth/logout` — Terminate session.

---

## 6. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Registration Validation | `apps/api/src/routes/auth.ts` | `scripts/pentest_simulator.ts` |
| Argon2 Password Hashing | `apps/api/src/routes/auth.ts` | `scripts/pentest_simulator.ts` |
| Account Lockout (5 attempts) | `apps/api/src/routes/auth.ts` | `scripts/pentest_simulator.ts` (Vector 5) |
| Non-guessable JWT Verification | `apps/api/src/middleware/rbac.ts` | `scripts/pentest_simulator.ts` (Vector 3.4) |
