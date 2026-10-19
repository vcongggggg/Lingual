# Authorization & Role-Based Access Control (RBAC) Specification (Baseline)

**Module:** Authorization & Access Control  
**Status:** Implemented & Verified  
**Package:** `apps/api/src/middleware/rbac.ts`, `apps/api/src/routes/admin.ts`, `packages/domain/src/index.ts`  

---

## 1. Purpose & Scope

The Authorization module enforces least-privilege, default-deny role-based access control across all API endpoints, guaranteeing that learners cannot access content moderation or system administration capabilities.

---

## 2. Domain Roles & Hierarchy

```
    SUPER_ADMIN (Full system control, role assignment, audit logs)
        ▲
      ADMIN (User management, system diagnostics, configuration)
        ▲
 CONTENT_REVIEWER (Content moderation, prompt reviews, exam reviews)
        ▲
 LEARNER / STUDENT (Regular learner capabilities across all 6 labs)
```

---

## 3. Functional Requirements

### Requirement: Default-Deny Route Protection
The server SHALL deny access to privileged endpoints unless the request includes a valid JWT token bearing an authorized role.

#### Scenario: Learner Attempts Access to Admin Resources
- **GIVEN** an authenticated user with role `LEARNER` or `STUDENT`
- **WHEN** user sends request to `GET /api/v1/admin/dashboard` or `GET /api/v1/admin/users`
- **THEN** RBAC middleware intercepts the request
- **AND** returns HTTP `403 Forbidden` with detailed Vietnamese/English denial message.

#### Scenario: Administrator Accesses Management Endpoints
- **GIVEN** an authenticated user with role `ADMIN` or `SUPER_ADMIN`
- **WHEN** user sends request to `GET /api/v1/admin/dashboard`
- **THEN** request is authorized and returns HTTP `200 OK` with system metrics.

---

## 4. Behavioral Invariants

1. All `/api/v1/admin/*` endpoints MUST require explicit RBAC role verification.
2. Unauthenticated requests to protected endpoints MUST receive HTTP `401 Unauthorized`.
3. Authenticated requests with insufficient privileges MUST receive HTTP `403 Forbidden`.
4. Role elevation (`POST /api/v1/admin/users/:id/role`) MUST be restricted exclusively to `SUPER_ADMIN`.

---

## 5. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Default-Deny RBAC Interceptor | `apps/api/src/middleware/rbac.ts` | `scripts/pentest_simulator.ts` (Vector 3) |
| Learner Barred from Admin APIs | `apps/api/src/middleware/rbac.ts` | `scripts/pentest_simulator.ts` (Cases 6.1-6.3) |
| Admin Dashboard Route Guard | `apps/api/src/routes/admin.ts` | `scripts/qa_master_routes.ts` |
