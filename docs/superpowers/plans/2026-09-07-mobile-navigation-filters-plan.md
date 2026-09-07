# Mobile Navigation, Filters, and Global Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the mobile menu after navigation, replace inline mobile build filters with an accessible apply/cancel bottom sheet, add a derived `dm`/`ln` content gate, and audit the complete bilingual site before deployment.

**Architecture:** `SiteHeader` remains server-rendered and delegates only its mobile disclosure to a controlled client island. `BuildFilters` keeps the URL as the applied state while a dedicated mobile sheet owns a temporary draft; desktop continues to write immediately. A generated calculation-family artifact feeds a global prose rule without changing the skill-graph drift baseline.

**Tech Stack:** Next.js 16.3.3 App Router, React, TypeScript, Tailwind CSS, native History API, existing CDP headless harness, repository script-based gates.

**Spec:** `docs/superpowers/specs/2026-09-07-mobile-navigation-filters-design.md`

## Global Constraints

- Preserve SSG and the complete unfiltered no-JavaScript build list.
- Preserve language-independent filter query parameters and canonical URLs without query strings.
- Keep `SiteHeader` a Server Component; only the mobile menu becomes a client island.
- All new behavior follows red-green-refactor and includes a demonstrated failing test first.
- No agent edits `package.json`, global registries, or another agent's owned files; the coordinator owns integration files.
- All browser automation is headless and uses fresh production builds.
- Final production URL is `https://d2r-codex.vercel.app`.

---

### Task 1: Controlled Mobile Navigation

**Owner:** Navigation agent

**Files:**
- Create: `components/layout/mobile-navigation.tsx`
- Create: `scripts/mobile-navigation.test.ts`
- Modify: `components/layout/site-header.tsx`
- Modify: `scripts/viewport.test.ts`

**Interfaces:**
- Consumes: localized `{ href: string; label: string }[]` arrays from `SiteHeader`.
- Produces: `MobileNavigation({ items, menuLabel, navigationLabel }: MobileNavigationProps)`.
- Behavior: close on link activation, pathname change, locale change, Escape, and outside pointer interaction; restore trigger focus on Escape; expose `aria-current="page"` for the active section.

- [ ] **Step 1: Add a failing browser test for the persistent-menu defect**

Open the native disclosure, activate a client-side navigation link, wait for the destination pathname, and assert the disclosure is no longer open. Confirm it fails against `18039f2` because the persistent layout preserves `<details open>`.

- [ ] **Step 2: Add failing interaction cases**

Cover Escape with focus restoration, outside pointer dismissal, locale switching, descendant-route active state, direct trigger close, and ordinary Tab order. Each assertion must observe rendered DOM state rather than source text.

- [ ] **Step 3: Implement the client island**

Use `usePathname`, a trigger ref, a panel ref, controlled `open`, document-level pointer detection while open, and an Escape handler. Do not add a focus trap or scroll lock because this disclosure is non-modal.

- [ ] **Step 4: Replace only the native disclosure in `SiteHeader`**

Keep logo, search, locale switcher, desktop navigation, and data preparation server-rendered. Pass the combined localized navigation items to the client island.

- [ ] **Step 5: Extend viewport coverage**

Exercise menu closed/open/after-navigation at 320, 360, 390, 768, and 1280 CSS pixels in both locales. Require document width not to exceed viewport width.

- [ ] **Step 6: Run targeted tests and commit**

Run the new browser test, `test:viewport`, `test:client`, lint, and typecheck. Commit only the navigation-owned files.

---

### Task 2: Mobile Filter Draft and Bottom Sheet

**Owner:** Filter agent

**Files:**
- Create: `lib/builds/filter-sheet.ts`
- Create: `components/builds/mobile-filter-sheet.tsx`
- Create: `scripts/mobile-filter-sheet.test.ts`
- Modify: `components/builds/build-filters.tsx`
- Modify: `lib/focus-trap.ts` only if a demonstrated behavior requires a generic correction
- Modify: `scripts/build-filters.test.ts`
- Modify: `scripts/build-filters-html.test.ts`
- Modify: `scripts/sheet.test.ts`
- Modify: `scripts/viewport.test.ts` only in a separately reported patch for coordinator conflict resolution
- Modify: `lib/i18n/dictionaries/en-us.ts`
- Modify: `lib/i18n/dictionaries/pt-br.ts`

**Interfaces:**
- Produces `cloneFilterState(state: BuildFilterState): BuildFilterState`.
- Produces `applyFilterDraft(draft: BuildFilterState, options: OptionSets): BuildFilterState`.
- Produces `MobileFilterSheet` with `applied`, `groups`, `options`, `strings`, `resultCountFor`, and `onApply` props.
- `onApply(next)` writes exactly one `pushState` entry through the parent and closes the sheet.

- [ ] **Step 1: Write failing pure-state tests**

Prove opening clones the applied URL state, toggles mutate only the draft, cancel discards the draft, reopen starts from applied state, Apply sanitizes values and produces one final state, and Clear affects the draft until Apply.

- [ ] **Step 2: Write failing browser behavior tests**

Assert the current inline mobile panel lacks modal semantics and that selections currently update the URL immediately. Add desired assertions for draft count, unchanged page/URL before Apply, one history entry on Apply, cancel via close/Escape/backdrop, focus restoration, scroll restoration, and Back/Forward.

- [ ] **Step 3: Implement the pure draft boundary**

Clone every filter array so draft mutations cannot alias applied state. Reuse `toggleValue`, `parseFilterState`, and `filterBuilds`; do not duplicate filtering rules.

- [ ] **Step 4: Implement the modal bottom sheet**

Render a fixed scrim and bottom-aligned surface below `sm`. Move focus to the close button, trap Tab/Shift+Tab with `trapTarget`, close on Escape/backdrop, restore the Filters trigger, lock body scroll while open, and clean every side effect on close/unmount.

- [ ] **Step 5: Preserve desktop behavior**

Desktop fieldsets stay inline and write filter changes immediately. Search retains its existing 250 ms replace-state synchronization. Applied chips outside the sheet continue to update immediately.

- [ ] **Step 6: Add localized copy**

Add sheet title, Cancel, Clear, and singular/plural `Show N builds` strings in EN-US and PT-BR with matching dictionary keys.

- [ ] **Step 7: Protect static rendering**

Keep `useSearchParams` under the existing Suspense boundary. Assert static HTML contains every build exactly once and no modal controls, while hydrated mobile renders the sheet trigger.

- [ ] **Step 8: Run targeted tests and commit**

Run filter, search-draft, sheet, static HTML, accessibility, viewport, lint, and typecheck gates. Commit only filter-owned files and report the `viewport.test.ts` patch separately if the navigation agent also touched it.

---

### Task 3: Derived `dm`/`ln` Bounds and Content Rule

**Owner:** Content-integrity agent

**Files:**
- Create: `content/classes/skill-param-bounds.ts`
- Create: `scripts/skill-param-bounds.ts`
- Create: `scripts/diminishing-claims.test.ts`
- Modify: `scripts/generate-skill-graph.ts`
- Modify: `scripts/content-rules.ts`
- Modify: `scripts/check-content.ts`
- Modify: `docs/sources/README.md`

**Interfaces:**
- Produces `SKILL_PARAM_BOUNDS`, a deterministic generated record keyed by class, skill, source column, and calculation token.
- Each record identifies `family: "linear" | "diminishing"`, parameter indices, minimum, maximum or linear base/per-level values, and the source data coordinate.
- Produces `checkDiminishingClaims(entries, bounds)` returning structured rule violations with locale and content path.

- [ ] **Step 1: Write a failing generator fixture test**

Use hand-checked `ln12` and `dm12` rows to assert exact generated records. Demonstrate that the current repository has no generated artifact and the test fails for that reason.

- [ ] **Step 2: Implement deterministic extraction**

Parse calculation tokens from the pinned executable rows. Write stable key order and LF output. Do not add fields to `content/classes/skill-graph.ts` and do not advance graph-drift for the new artifact.

- [ ] **Step 3: Add failing prose-rule tests**

Use a real diminishing example where the maximum is falsely stated as achieved, plus valid `toward`, `up to`, and PT-BR `em direção a`/`até` controls. Include unrelated item stats and numeric ranges as negative controls.

- [ ] **Step 4: Implement the global rule**

Match claims to the generated skill/field context rather than scanning arbitrary coincidental numbers. Emit actionable violations naming the skill, bound, formula family, locale, and content path.

- [ ] **Step 5: Run the rule across all content**

Classify every hit. Fix only proven content defects in focused commits; do not weaken the rule to silence valid findings.

- [ ] **Step 6: Mutation-prove and commit**

Reintroduce a repaired achieved-bound sentence, confirm the gate exits nonzero, restore it, and confirm green. Run content, graph, graph-drift, damage, all class controls, lint, and typecheck before committing.

---

### Task 4: Coordinator Integration and Global Audit

**Owner:** Coordinator

**Files:**
- Modify: `package.json`
- Resolve: `scripts/viewport.test.ts`
- Modify other files only for proven integration defects with their own failing tests.

**Interfaces:**
- Adds `test:mobile-navigation`, `test:mobile-filter-sheet`, and `test:diminishing-claims` scripts.
- Wires pure/source tests into `check` and built/browser tests into `check:built` according to their runtime requirements.

- [ ] **Step 1: Review each agent diff independently**

Reject overlapping ownership, source-only assertions, vacuous mutations, committed screenshots, temporary launch files, stale build artifacts, and changes outside the approved spec.

- [ ] **Step 2: Integrate navigation and filters**

Resolve `viewport.test.ts` semantically so it covers both menu route closure and sheet modal behavior. Run the combined targeted suite before accepting either change.

- [ ] **Step 3: Wire scripts once**

Edit `package.json` only after all three test entry points exist. Verify every command returns its own real exit code.

- [ ] **Step 4: Run an adversarial product audit**

Audit all eight classes, 53 builds, eight journeys, filters, search, navigation, mobile layouts, canonical metadata, and the full sitemap. Any discovered defect gets a failing regression test before a focused fix.

- [ ] **Step 5: Perform real visual verification**

Capture headless PNGs for menu open/closed/after navigation, filter sheet open/draft/applied/cancelled/empty state, desktop filters, both locales, 320 px, 390 px, 1280 px, and 200% zoom. Inspect the images and keep them unversioned.

- [ ] **Step 6: Run the full clean publication gate**

Delete only the known build output, create a fresh build, and run `NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app npm run predeploy`. Read the command's actual exit marker from its log, then run `git diff --check` and confirm a clean worktree.

- [ ] **Step 7: Publish and verify the exact SHA**

Push normally without force, wait for the production deployment matching HEAD, and run public bilingual smoke tests for navigation, filter history/apply/cancel, no horizontal overflow, metadata, sitemap, and absence of localhost.

- [ ] **Step 8: Report evidence**

Report root causes, UX behavior, tests observed red then green, mutations, audit findings, screenshots, commits, exact deployment ID/SHA/status, public smoke, and remaining risks.
