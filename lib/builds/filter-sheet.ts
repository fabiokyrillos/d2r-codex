/**
 * The mobile filter sheet's draft, as pure functions.
 *
 * Below `sm` the five filter groups move into a modal bottom sheet, and what
 * happens inside it is deliberately *not* what happens on desktop. Desktop
 * writes every tick to the URL immediately, which is right for a control the
 * reader can see the effect of. On a phone the same behaviour meant the listing
 * re-rendered under a panel that had already pushed it off the screen, and four
 * choices left four history entries between the reader and where they came
 * from. So the sheet holds a draft, and one Apply commits it.
 *
 * A draft is the same `BuildFilterState` the URL carries — not a second shape —
 * because the moment it became a different one, "apply" would mean "translate",
 * and the translation is where a filter model goes wrong. Everything here
 * therefore builds on `filter.ts`: `toggleValue` decides membership and
 * ordering, `serializeFilterState`/`parseFilterState` decide what is valid, and
 * `filterBuilds` decides what matches. Nothing is reimplemented.
 *
 * **Cloning is the load-bearing part.** `toggleValue` returns a new object, but
 * four of its five group arrays are the *same arrays* as the input's — harmless
 * while nothing mutates them, and a silent disaster the first time something
 * does, because "cancel" would keep the changes it says it discards. Rather
 * than rely on nobody ever pushing to one of those arrays, every state that
 * crosses the draft boundary is copied array by array, and
 * `scripts/build-filters.test.ts` asserts the copies are not shared.
 *
 * Client-safe and dependency-free — imported across the `"use client"`
 * boundary, like `filter.ts` itself.
 */
import {
  FILTER_GROUPS,
  parseFilterState,
  serializeFilterState,
  toggleValue,
  type BuildFilterState,
  type FilterGroup,
  type OptionSets,
} from "./filter";

/**
 * A deep-enough copy: every group array is new, so nothing the draft does can
 * reach the applied state.
 *
 * "Deep enough" is exact rather than vague — the state is one string and five
 * arrays of strings, and strings are already immutable.
 */
export function cloneFilterState(state: BuildFilterState): BuildFilterState {
  const next: BuildFilterState = { ...state, ...emptyGroups() };
  for (const group of FILTER_GROUPS) next[group] = [...state[group]];
  return next;
}

function emptyGroups(): Pick<BuildFilterState, FilterGroup> {
  return { class: [], damage: [], difficulty: [], budget: [], goodAt: [] };
}

/**
 * One tick, inside the draft.
 *
 * `toggleValue` does the deciding — membership, and the canonical order the URL
 * serialises in — and the clone afterwards is what keeps the result from
 * sharing arrays with whatever it was derived from.
 */
export function toggleDraftValue(
  draft: BuildFilterState,
  group: FilterGroup,
  value: string,
  allowed: readonly string[],
): BuildFilterState {
  return cloneFilterState(toggleValue(draft, group, value, allowed));
}

/**
 * Clear, inside the sheet.
 *
 * The query survives on purpose. The search box is outside the sheet and stays
 * visible while it is open, so clearing something the reader can see and did
 * not put in the sheet would be a surprise — and the chip row outside still
 * offers the clear-everything that removes it too.
 */
export function clearFilterDraft(draft: BuildFilterState): BuildFilterState {
  return { ...cloneFilterState(draft), ...emptyGroups() };
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
 * Not `activeCount`, which counts the query too. That was right while the query
 * and the boxes shared one panel; with the box outside the sheet it would badge
 * the trigger with a "1" the reader cannot find, opening onto nothing ticked
 * and a Clear that does nothing.
 */
export function sheetFilterCount(state: BuildFilterState): number {
  return FILTER_GROUPS.reduce((n, group) => n + state[group].length, 0);
}
