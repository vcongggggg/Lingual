# Design System & Aesthetics Specification (Baseline)

**Module:** Design System & UI Aesthetics  
**Status:** Implemented & Verified  
**Package:** `apps/web/src/app/globals.css`, `apps/web/tailwind.config.js`  

---

## 1. Design Philosophy: Deep Space Dark Glassmorphism

LinguaFlow employs a modern, immersive aesthetic designed to inspire focus, visual clarity, and high user engagement.

---

## 2. Color Palette & Tokens

- **Background Base:** Deep Space Dark (`#020617` / `slate-950`)
- **Card Background:** Glassmorphism Dark (`rgba(15, 23, 42, 0.75)` / `bg-slate-900/75` with `backdrop-blur-md`)
- **Border Accents:** Radiant Slate (`rgba(255, 255, 255, 0.1)` / `border-white/10`)
- **Brand Primaries:**
  - Electric Indigo (`#6366F1`)
  - Cosmic Violet (`#8B5CF6`)
  - Cyan Glow (`#06B6D4`)
- **Status Indicators:**
  - Success: Emerald Glow (`#10B981`)
  - Warning: Amber Glow (`#F59E0B`)
  - Danger / Error: Rose Glow (`#F43F5E`)

---

## 3. Typography & Accessibility (a11y)

- **Font Family:** Inter / Outfit with crisp legibility across high-DPI displays.
- **Contrast:** High WCAG AAA contrast ratio for white/light-gray text against dark translucent backdrops.
- **Micro-animations:** Smooth cubic-bezier transitions (`transition-all duration-200 ease-out`), hover scales (`hover:scale-[1.02]`), and subtle glowing borders.
- **Reduced Motion:** Full support for `prefers-reduced-motion: reduce`.

---

## 4. Traceability Matrix

| Requirement | Implementation File | Verification Test |
| :--- | :--- | :--- |
| Global Dark Palette | `apps/web/src/app/globals.css` | `pnpm --filter web build` |
| Glassmorphism Cards | `apps/web/src/components/*` | `scripts/qa_master_routes.ts` |
| Responsive Layout | `apps/web/src/app/[locale]/layout.tsx`| `scripts/qa_master_routes.ts` (88 routes) |
