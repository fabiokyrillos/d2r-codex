/**
 * What the empty state can honestly offer, as pure functions.
 *
 * With conditional counts (`facetCounts`) no click produces an empty list, so
 * the empty state is reached by URL: a stale link, a hand-edited one, a
 * language switch carrying filters the other catalogue cannot satisfy. R-FILT-4
 * gives that state two offers, and each has a rule here because an offer that
 * does nothing — or does something other than it says — is worse than the
 * empty list it replaces.
 *
 * **"Remove last filter" is undo, and only when there is something to undo.**
 * The component records every `pushState` it writes as a `Decision`, and
 * `undoAvailable` says whether the current URL is the result of the last one.
 * After Back the top of the log no longer matches, and the offer is withdrawn
 * rather than stepping the reader out of the page. Under `toggleKeepingResults`
 * a click never lands here from a non-empty list, so the offer is reachable
 * only from one empty state to another — which is exactly where it is honest.
 *
 * **"Remove {group}" names the group whose removal brings builds back, and the
 * near builds are labelled with exactly what they ignore.** The class is never
 * the group: a reader who chose Necromancer and got nothing is shown
 * Necromancer builds ignoring Cold, not cold builds of some other class. Where
 * one group's removal suffices the first in group order is named; where none
 * does, groups come off cumulatively in group order until builds appear, and
 * every group that came off is in the label. Nothing removes an arbitrary
 * parameter, and nothing rewrites the URL: these functions describe the offer,
 * and the click that takes it writes the state they describe.
 *
 * Client-safe: this reaches nothing but `filter.ts`.
 */
import { FILTER_GROUPS, filterBuilds, type BuildFilterState, type BuildRow, type FilterGroup } from "./filter";

/** One `pushState` this component wrote: the query string before and after. */
export interface Decision {
  /** `?a=b`, or `""` for none. */
  from: string;
  to: string;
}

/**
 * Whether `history.back()` would undo the last decision — true only when the
 * current query string is the one that decision produced.
 */
export function undoAvailable(log: readonly Decision[], current: string): boolean {
  if (log.length === 0) return false;
  return log[log.length - 1].to === current;
}

const without = (state: BuildFilterState, groups: readonly FilterGroup[]): BuildFilterState => {
  const relaxed = { ...state };
  for (const group of groups) relaxed[group] = [];
  return relaxed;
};

const listsSomething = (rows: readonly BuildRow[], state: BuildFilterState) =>
  filterBuilds(rows, state).length > 0;

/**
 * The selected groups, other than the class, whose removal brings builds back.
 *
 * Empty when the state already lists something, when nothing but the class is
 * selected, or when emptying every advanced group still lists nothing — in
 * each case there is no group to name. Otherwise the smallest answer this
 * procedure finds: one group, if removing it alone suffices (the first in
 * group order); else the prefix of the selected groups, in group order, at
 * which builds first appear.
 */
export function zeroingGroups(rows: readonly BuildRow[], state: BuildFilterState): FilterGroup[] {
  if (listsSomething(rows, state)) return [];
  const candidates = FILTER_GROUPS.filter((group) => group !== "class" && state[group].length > 0);

  const single = candidates.find((group) => listsSomething(rows, without(state, [group])));
  if (single) return [single];

  const removed: FilterGroup[] = [];
  for (const group of candidates) {
    removed.push(group);
    if (listsSomething(rows, without(state, removed))) return removed;
  }
  return [];
}

/**
 * Up to three builds the reader is near: the state with the zeroing groups
 * emptied and the class kept, in the incoming (recommended) order. `null` when
 * `zeroingGroups` has nothing to name, because a suggestion with no label
 * would be a list of builds from nowhere.
 */
export function nearBuilds(
  rows: readonly BuildRow[],
  state: BuildFilterState,
): { ignoring: FilterGroup[]; rows: BuildRow[] } | null {
  const ignoring = zeroingGroups(rows, state);
  if (ignoring.length === 0) return null;
  return { ignoring, rows: filterBuilds(rows, without(state, ignoring)).slice(0, 3) };
}
