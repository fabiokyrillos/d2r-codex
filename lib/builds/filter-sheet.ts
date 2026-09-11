/**
 * The mobile filter sheet's draft, as pure functions.
 *
 * Below `sm` the advanced filter groups move into a modal bottom sheet, and
 * what happens inside it is deliberately *not* what happens on desktop.
 * Desktop writes every tick to the URL immediately, which is right for a
 * control the reader can see the effect of. On a phone the same behaviour
 * meant the listing re-rendered under a panel that had already pushed it off
 * the screen, and four choices left four history entries between the reader
 * and where they came from. So the sheet holds a draft, and one Apply commits
 * it.
 *
 * A draft is the same `BuildFilterState` the URL carries — not a second shape —
 * because the moment it became a different one, "apply" would mean "translate",
 * and the translation is where a filter model goes wrong. Everything here
 * therefore builds on `filter.ts`: `toggleKeepingResults` decides membership,
 * ordering and what an un-tick takes with it, `serializeFilterState`/
 * `parseFilterState` decide what is valid, and `filterBuilds` decides what
 * matches. Nothing is reimplemented.
 *
 * **Cloning is the load-bearing part.** The toggles return a new object, but
 * four of its five group arrays are the *same arrays* as the input's — harmless
 * while nothing mutates them, and a silent disaster the first time something
 * does, because "cancel" would keep the changes it says it discards. Rather
 * than rely on nobody ever pushing to one of those arrays, every state that
 * crosses the draft boundary is copied array by array, and
 * `scripts/build-filters.test.ts` asserts the copies are not shared.
 *
 * **The sheet holds `ADVANCED_GROUPS` and nothing else.** The class chips and
 * the sort are outside it, always visible, on both layouts (R-FILT-1, R-FILT-5).
 * So Clear empties only the advanced groups and the badge counts only them:
 * clearing a chip the reader can see and did not put in the sheet would be a
 * surprise, and a badge that counted it would open onto nothing ticked.
 *
 * Client-safe and dependency-free — imported across the `"use client"`
 * boundary, like `filter.ts` itself.
 */
import {
  ADVANCED_GROUPS,
  FILTER_GROUPS,
  advancedCount,
  parseFilterState,
  serializeFilterState,
  toggleKeepingResults,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
  type OptionSets,
} from "./filter";

/**
 * A deep-enough copy: every group array is new, so nothing the draft does can
 * reach the applied state.
 *
 * "Deep enough" is exact rather than vague — the state is five arrays of
 * strings and one sort key, and strings are already immutable.
 */
export function cloneFilterState(state: BuildFilterState): BuildFilterState {
  const next: BuildFilterState = { ...state };
  for (const group of FILTER_GROUPS) next[group] = [...state[group]];
  return next;
}

/**
 * One tick, inside the draft.
 *
 * `toggleKeepingResults` does the deciding — membership, the canonical order
 * the URL serialises in, and the one pruning rule: the sheet shows the draft's
 * conditional counts and disables the zeros, so an un-tick inside it has to
 * follow the same reconciliation the live panel does, or a draft could apply
 * as the empty list the counts exist to prevent. The clone afterwards is what
 * keeps the result from sharing arrays with whatever it was derived from.
 */
export function toggleDraftValue(
  draft: BuildFilterState,
  group: FilterGroup,
  value: string,
  allowed: readonly string[],
  rows: readonly BuildRow[],
): BuildFilterState {
  return cloneFilterState(toggleKeepingResults(draft, group, value, allowed, rows));
}

/**
 * Clear, inside the sheet: the advanced groups, and only them.
 *
 * The class chips and the sort survive on purpose — they are outside the
 * sheet and stay visible while it is open. The chip row outside still offers
 * the clear-everything that removes the class too.
 */
export function clearFilterDraft(draft: BuildFilterState): BuildFilterState {
  const next = cloneFilterState(draft);
  for (const group of ADVANCED_GROUPS) next[group] = [];
  return next;
}

/**
 * Apply: the draft, sanitised into exactly the state the URL would give back.
 *
 * Round-tripping through the URL rather than trusting the draft is what makes
 * Apply and a pasted link produce the same state — the same trim, the same
 * length cap, the same allow-list, the same canonical order. A value the page
 * does not offer, or a group it does not render, is dropped here rather than
 * written to a URL that would drop it on the next read.
 */
export function applyFilterDraft(
  draft: BuildFilterState,
  options: OptionSets,
): BuildFilterState {
  return parseFilterState(serializeFilterState(draft), options);
}

/**
 * How many filters the sheet itself is holding.
 *
 * Not `activeCount`, which counts the class chips too. Those are outside the
 * sheet, so counting them would badge the trigger with a "1" the reader cannot
 * find inside, opening onto nothing ticked and a Clear that does nothing. It
 * is `advancedCount` by name — the same number the desktop trigger shows — so
 * the two disclosures cannot count differently.
 */
export function sheetFilterCount(state: BuildFilterState): number {
  return advancedCount(state);
}
