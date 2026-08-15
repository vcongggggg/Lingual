# Navigation & Application Shell Specification (Baseline)

**Module:** App Navigation & Shell  
**Status:** Implemented & Verified  
**Package:** `apps/web/src/components/Navigation.tsx`, `apps/web/src/components/FloatingMascotUniverse.tsx`  

---

## 1. Purpose & Scope

The Navigation Shell provides the unified responsive layout, top navigation bar, sidebar, mobile navigation drawer, locale switcher, and floating AI mascot ("LingLing") across all pages.

---

## 2. Navigation Structure

- **Desktop Sidebar / Topbar**: Fast switching between Home, Dashboard, 6 Practice Labs, AI Tutor, Community, and Analytics.
- **Mobile Bottom Navigation**: Compact dock for quick thumb navigation on mobile screens.
- **Floating Mascot Universe**: Persistent interactive mascot offering quick assistance, study tips, and motivation.
- **Locale Switcher**: Seamless 1-click toggle between `VI` and `EN`.

---

## 3. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Responsive App Shell | `apps/web/src/app/[locale]/layout.tsx` | `pnpm --filter web build` |
| Floating Mascot Universe | `apps/web/src/components/FloatingMascotUniverse.tsx` | `scripts/qa_master_routes.ts` |
