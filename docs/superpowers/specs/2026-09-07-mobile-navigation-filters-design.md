# Mobile navigation and build-filter experience

## Goal

Improve mobile navigation and build discovery without changing the site's visual identity, static rendering contract, canonical URLs, or desktop filtering behavior.

The release also closes the deferred `dm`/`ln` validation gap and performs a global regression audit before publication.

## Current problems

1. The mobile navigation uses an uncontrolled native `<details>` inside the persistent root layout. Client-side route changes preserve that DOM node and its `open` state, so the menu remains open after following a link.
2. Mobile build filters expand inline above the results. Five filter groups create a long page interruption, the result list moves while options are selected, and several selections create separate history entries before the reader has finished choosing.
3. Diminishing-return (`dm`) values can be described as achieved values even when their parameters represent an asymptotic bound. Existing content was repaired manually, but no derived global control prevents recurrence.

## Navigation design

Keep `SiteHeader` as a Server Component and extract only the mobile disclosure into a small Client Component.

The component owns a controlled `open` state and closes when:

- a navigation link is activated;
- `usePathname()` reports a completed route change;
- Escape is pressed;
- a pointer interaction occurs outside the menu.

Escape returns focus to the trigger. Pointer dismissal does not steal focus. The menu is a non-modal disclosure, so focus remains in the normal document order and no focus trap or scroll lock is used.

The active top-level section receives a visible and accessible current-page state. Exact paths and descendant paths both activate their owning section. Locale changes must also close the menu.

No navigation state is persisted in storage. A new page always starts with the menu closed.

## Mobile filter design

The search field and compact results summary remain visible in the page. A mobile-only Filters button displays the number of active filters.

Activating it opens a modal bottom sheet containing the existing filter groups. The sheet uses the established surface, border, ink, and ember tokens rather than introducing a new visual language.

The sheet contains:

- a title and close button;
- the available filter groups and counts;
- a clear action;
- a primary `Show N builds` / `Mostrar N builds` action.

Selections inside the sheet are drafts. The result count in the primary action updates immediately, but the page list and URL do not change until Apply. Apply writes one history entry and closes the sheet. Escape, the close button, or the backdrop discards unapplied changes. Reopening starts from the currently applied URL state.

Desktop retains the existing inline, immediate filters. Search remains immediate with the existing trailing-edge URL synchronization on both layouts.

Applied filter chips remain visible outside the sheet and can be removed directly. Clearing or removing an applied filter updates the URL and results immediately.

The sheet is modal:

- a scrim blocks pointer interaction behind it;
- focus moves to the close control on open;
- Tab and Shift+Tab remain within it;
- Escape cancels drafts and restores focus to the Filters button;
- closing restores background scrolling;
- reduced-motion preferences disable nonessential sheet movement.

The existing filter query schema and language-independent slugs remain unchanged. Unknown parameters stay non-fatal. Static HTML and no-JavaScript fallback continue to contain the complete unfiltered list.

## Responsive behavior

- Mobile sheet behavior applies below the existing `sm` breakpoint.
- Desktop inline filters remain visible from `sm` upward.
- Resizing from mobile to desktop closes the modal, restores scrolling, and uses the applied URL state.
- The interface must not overflow at 320, 360, 375, 390, 768, 1280, or 1440 CSS pixels, including 200% zoom checks.

## `dm`/`ln` derived validation

Generate a deterministic artifact from the pinned executable data that records calculation family and parameter bounds without modifying the skill graph drift baseline.

The content rule must distinguish:

- linear `ln` values that can be calculated as achieved values at a level;
- diminishing `dm` values that approach a bound;
- prose that correctly says `up to`, `toward`, or equivalent localized wording;
- unrelated item stats and numeric ranges.

The gate runs globally over EN-US and PT-BR. It must be mutation-proved against a real incorrect achieved-value claim and include negative controls for valid hedged wording.

## Testing strategy

Implementation follows test-driven development.

Navigation tests must first reproduce the current defect: open the menu, follow a client-side link, and observe that it remains open. The final tests cover route changes, direct link activation, Escape, outside pointer interaction, focus restoration, locale switching, active-section state, keyboard operation, and no-JavaScript navigation.

Filter tests cover draft versus applied state, one history entry per Apply, cancellation, clearing, chip removal, Back/Forward, reload, locale switching, focus trapping, focus restoration, scroll locking, responsive transitions, unknown query values, SSG, hydration, and the full-list fallback.

Mutation controls cover applying drafts immediately, preserving drafts after cancel, failing to close the menu after a route change, broken focus containment, query parameters entering canonical metadata, and `dm` bounds described as achieved figures.

The final audit runs all repository gates, a fresh production build, bilingual crawl, client-bundle checks, and headless screenshots of navigation and filters across desktop/mobile states.

## Delivery and safety

Changes are committed in small slices: navigation behavior, filter state/model, sheet UI, `dm`/`ln` gate, audit fixes, and final integration.

Push and deployment occur only after the last clean predeploy run with `NEXT_PUBLIC_SITE_URL=https://d2r-codex.vercel.app`. Production verification must target the exact deployed SHA and include public navigation/filter smoke tests.

Unrelated content changes are out of scope unless the new global audit proves a defect. Proven defects receive their own tests and focused commits.
