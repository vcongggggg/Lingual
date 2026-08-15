# OpenSpec Changes Directory

This directory contains active, in-flight **Change Proposals (RFCs)** for LinguaFlow.

---

## 1. When to Create a Change Proposal

A change proposal MUST be created before:
1. Adding a new learning lab, major feature, or external service integration.
2. Modifying core algorithms (e.g. SM-2 Spaced Repetition formulas, XP formulas, Streak rules).
3. Altering authentication, RBAC authorization, or security boundaries.
4. Changing public API request/response schemas in `@linguaflow/contracts`.
5. Modifying database models or Prisma schemas.

---

## 2. Change Proposal Structure

Every change proposal must be housed in a subfolder `openspec/changes/<change-name>/` containing:

```
openspec/changes/<change-name>/
├── proposal.md         # Motivation, problem statement, and high-level RFC summary
├── requirements.md     # Testable functional requirements with GIVEN-WHEN-THEN scenarios
├── design.md           # Technical design, domain contracts, architecture, and security impact
├── tasks.md            # Actionable step-by-step implementation checklist
└── verification.md     # Verification plan, test results, QA logs, and release sign-off
```

---

## 3. Proposal Lifecycle

1. **PROPOSED**: The RFC is drafted and reviewed by maintainers/engineers.
2. **APPROVED**: Architecture and test plans are locked.
3. **IN_PROGRESS**: Code implementation and tests are executed.
4. **VERIFIED**: All unit tests, QA suites, and regressions pass with 100% success.
5. **ARCHIVED**: The change is moved to `openspec/archive/<change-name>/` and living specs in `openspec/specs/` are updated.
