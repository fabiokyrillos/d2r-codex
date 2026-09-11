/**
 * Build filtering, as pure functions over plain rows.
 *
 * Four constraints shaped this file, and all four are load-bearing.
 *
 * **It must be safe to import from a Client Component.** `scripts/client-boundary.test.ts`
 * fails the build if anything under `lib/registry`, `content/`, `lib/search/index.ts`
 * or `lib/i18n/server` becomes reachable from a `"use client"` entry, because
 * one convenient barrel import once put the whole corpus into a 1.1 MB chunk on
 * every page. So nothing here imports content, and nothing here imports
 * anything but types. Rows are built server-side by `lib/builds/rows.ts` and
 * arrive as props.
 *
 * **Every option must come from the model.** There is no second list of classes,
 * damage types or builds to drift out of sync: the option sets are derived from
 * the rows the page is already rendering, and `RATING_AXES` is asserted against
 * the real `BuildRatings` keys in `scripts/build-filters.test.ts`, so an axis
 * added to the model without being added here fails.
 *
 * **Only fields the model actually populates become filters.** What that ruled
 * out is recorded in `REFUSED_FILTERS` below rather than left as an absence
 * somebody re-proposes in six months.
 *
 * **The tier preference is not a filter, and there is no code path here that
 * could make it one.** PRD §7.1: "Where you are" lives in the browser, never in
 * the URL, and never changes which rows match or what any count says. No
 * function in this file takes a tier. The one thing the preference does to a
 * listing — enable the "For my stage" sort — happens in `lib/builds/sort.ts`,
 * over rows this file has already filtered.
 *
 * There used to be a search here too. It left with R-FILT-8: the site has one
 * search, the global one, and an inline box that consulted a second index with
 * its own idea of "hdin" was two answers to one question. So `q` is gone from
 * the state and from the URL — a link that still carries it is an unknown
 * parameter, ignored like any other.
 */
import type { BuildRatings } from "@/lib/types/build";
import type { ProgressionTier, Rating } from "@/lib/types/core";

// ---------------------------------------------------------------------------
// The row a page hands to the filter
// ---------------------------------------------------------------------------

/**
 * One build, flattened to what filtering, sorting and the card need.
 *
 * Nothing here is looked up on the client. `stagePicks` in particular is a
 * locale-dependent resolution — item names through `resolveRef`, which lives
 * behind the client boundary — that the server does once per tier so the
 * "At your stage" line can switch tiers without a round trip.
 */
export interface BuildRow {
  slug: string;
  name: string;
  classSlug: string;
  damageTypes: string[];
  difficulty: string;
  budget: string;
  /** Rating axes at or above `GOOD_AT_THRESHOLD`, computed by `goodAtAxes`. */
  goodAt: string[];
  /** All eight axes, for the sort orders and the card's two highest. */
  ratings: Record<RatingAxis, number>;
  /**
   * Up to three display names per tier: the first pick of the first three
   * slots of that tier's gear set (R-FILT-2). Fewer where a pick has neither a
   * catalogued item nor a label.
   */
  stagePicks: Record<ProgressionTier, string[]>;
}

// ---------------------------------------------------------------------------
// "Good at", and where the threshold comes from
// ---------------------------------------------------------------------------

/**
 * The eight comparison axes, in the order the build pages already print them.
 *
 * Asserted against the keys of a real build's `ratings` object by the test, so
 * this cannot silently fall behind `BuildRatings`.
 */
export const RATING_AXES = [
  "clearSpeed",
  "bossing",
  "survivability",
  "magicFind",
  "terrorZones",
  "ubers",
  "soloSelfFound",
  "players8",
] as const;
export type RatingAxis = (typeof RATING_AXES)[number];

/**
 * A build counts as "good at" an axis at 4 out of 5 or better.
 *
 * **The scale names it.** `ratingLabels` in `lib/labels.ts` maps the five values
 * to Poor / Weak / Average / Good / Excellent. Four *is* "Good" — so the
 * threshold is not a judgement layered on top of the data, it is the point
 * where the site's own vocabulary starts saying the word the filter is labelled
 * with.
 *
 * **The distribution agrees.** Across the 53 published builds and eight axes —
 * 424 ratings — 45.8% sit at 4 or above, and a build carries 3.66 of the eight
 * tags on average with exactly one build carrying none.
 *
 * The alternatives were measured rather than dismissed. At 3 or above, 81.1% of
 * ratings qualify and the average build carries 6.49 of 8 tags: selecting almost
 * everything is not filtering. At 5 only, 21 of the 53 builds carry no tag at
 * all and can never be reached through this group.
 *
 * Per axis the split is wider than the aggregate suggests — 35 of 53 builds are
 * good at survivability and 7 are good at Ubers — which is a fact about the
 * catalogue rather than about the threshold.
 *
 * One threshold, one rule, every build — no per-axis curve and no editorial
 * override.
 *
 * **None of those numbers is typed here from memory.** They are read off
 * `docs/measurements/rating-distribution.json`, which
 * `scripts/rating-distribution.ts` generates from `content/builds/` and
 * `npm run test:rating-distribution` recomputes and compares — including
 * against this comment. The previous version of this paragraph was measured
 * over a catalogue of 29 and was still here at 53, because a comment cannot
 * fail. `docs/adr/0004-good-at-threshold.md` argues the decision the numbers
 * support, and is where the threshold moves if it ever does.
 */
export const GOOD_AT_THRESHOLD: Rating = 4;

/** The axes a build is good at, under the one rule. */
export function goodAtAxes(ratings: BuildRatings): RatingAxis[] {
  return RATING_AXES.filter((axis) => ratings[axis] >= GOOD_AT_THRESHOLD);
}

// ---------------------------------------------------------------------------
// What is deliberately not a filter
// ---------------------------------------------------------------------------

/**
 * Filters that were considered and refused, with the reason.
 *
 * Written down and asserted by the test, because "why is there no Ladder
 * filter" is a question that otherwise gets answered by someone adding one.
 * Each entry names the field that would have to exist and does not.
 */
export const REFUSED_FILTERS: readonly { readonly id: string; readonly why: string }[] = [
  {
    id: "ladder",
    why: "`modes.ladder` is populated on zero builds. One build carries `modes: {}` — an empty object, which says nothing about ladder and must not be read as 'both'.",
  },
  {
    id: "hardcore",
    why: "`modes.life` is populated on zero builds. `hardcoreNotes` is prose about playing one carefully, not a claim that the build is hardcore-only.",
  },
  {
    id: "online",
    why: "`modes.online` is populated on zero builds.",
  },
  {
    id: "season",
    why: "No build carries a season. The ladder season lives in `docs/research/00-game-state.md` as a site-wide baseline, not per build.",
  },
  {
    id: "patch",
    why: "`release` is set on four builds, all of them the Warlock's and all `reign-of-the-warlock`. A filter on it would select exactly what `class=warlock` already selects, which is a control that cannot change anything a reader could not already do. It becomes a real group the day a non-Warlock build carries one.",
  },
  {
    id: "playstyle",
    why: "There is no melee/ranged/caster/summoner field. Deriving one from `damageTypes` or from the primary skill would be inventing an editorial taxonomy to fill a filter.",
  },
  {
    id: "leveling-endgame",
    why: "`levelingPath` says what to play *before* this build, and `complete` is a publication flag set on all 29. Neither classifies a build as a levelling or endgame one.",
  },
];

// ---------------------------------------------------------------------------
// Filter state
// ---------------------------------------------------------------------------

/** The five multi-select groups, in UI and URL order. */
export const FILTER_GROUPS = ["class", "damage", "difficulty", "budget", "goodAt"] as const;
export type FilterGroup = (typeof FILTER_GROUPS)[number];

/**
 * What a page about one class offers: everything except the class.
 *
 * Derived rather than typed out, and exported rather than inlined at the call
 * site, so that "the class page has no class filter" is a fact about a named
 * constant a test can hold — the class page passes *this*, and the test asserts
 * both that it excludes `class` and that the page uses it. Written out as a
 * literal in the page, the rule was only enforceable by reading the page.
 */
export const CLASS_PAGE_FILTER_GROUPS: readonly FilterGroup[] = FILTER_GROUPS.filter(
  (g) => g !== "class",
);

/**
 * The groups behind "More filters": everything but the class.
 *
 * R-FILT-1 makes the class chips a primary control, always visible on both
 * layouts, and R-FILT-3 puts the rest behind a disclosure — the desktop
 * popover, the mobile sheet. This is the list both of those hold, and the list
 * their badge counts. Written as a literal so its element type names exactly
 * these four groups; `scripts/build-filters.test.ts` asserts it is
 * `FILTER_GROUPS` minus the class, in the same order, so there is still one
 * order everywhere.
 */
export const ADVANCED_GROUPS = ["damage", "difficulty", "budget", "goodAt"] as const;

// ---------------------------------------------------------------------------
// Sort keys
// ---------------------------------------------------------------------------

/**
 * The five orders R-FILT-5 offers, in menu order.
 *
 * `recommended` is the incoming order — the editorial one the catalogue is
 * authored in — and the default, so it is omitted from the URL. `stage` is the
 * one key that needs the tier preference; a page without one does not offer
 * it, which it says by leaving it out of `OptionSets.sort` (see
 * `availableSorts` in `lib/builds/sort.ts`). The orders themselves live there
 * too. This file only carries the key through the state and the URL.
 */
export const SORT_KEYS = ["recommended", "stage", "easiest", "cheapest", "name"] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = "recommended";

export interface BuildFilterState {
  class: string[];
  damage: string[];
  difficulty: string[];
  budget: string[];
  goodAt: string[];
  /** A view over the filtered rows, not a filter: never counted, never matched. */
  sort: SortKey;
}

export const EMPTY_FILTER_STATE: BuildFilterState = {
  class: [],
  damage: [],
  difficulty: [],
  budget: [],
  goodAt: [],
  sort: DEFAULT_SORT,
};

/** Filters only: a sorted, unfiltered listing is still the empty state. */
export function isEmptyState(state: BuildFilterState): boolean {
  return FILTER_GROUPS.every((g) => state[g].length === 0);
}

/** Every selected value, in every group. What the applied-chips row shows. */
export function activeCount(state: BuildFilterState): number {
  return FILTER_GROUPS.reduce((n, g) => n + state[g].length, 0);
}

/**
 * Only the values behind "More filters" — the badge on that trigger.
 *
 * Not `activeCount`: a class ticked in the always-visible chip row is not
 * something the reader has to open a popover to find, and a badge that
 * counted it would open onto nothing ticked.
 */
export function advancedCount(state: BuildFilterState): number {
  return ADVANCED_GROUPS.reduce((n, g) => n + state[g].length, 0);
}

// ---------------------------------------------------------------------------
// Options, derived from the rows themselves
// ---------------------------------------------------------------------------

export interface FilterOption {
  value: string;
  /** How many of the supplied rows carry it. Never a hand-maintained number. */
  count: number;
}

/** The value(s) a row contributes to a group. */
function valuesFor(row: BuildRow, group: FilterGroup): string[] {
  switch (group) {
    case "class":
      return [row.classSlug];
    case "damage":
      return row.damageTypes;
    case "difficulty":
      return [row.difficulty];
    case "budget":
      return [row.budget];
    case "goodAt":
      return row.goodAt;
  }
}

/**
 * Every option present in these rows, ordered by `order` where the model has a
 * canonical sequence and by first appearance otherwise.
 *
 * An option with no rows behind it is never offered: a class filter on a page
 * that lists one class's builds would be a control that cannot change anything.
 *
 * This is the *inventory*, not the offer. `narrowingOptionsFor` is what a
 * surface renders; the two differ by the options that cannot change anything.
 */
export function optionsFor(
  rows: readonly BuildRow[],
  group: FilterGroup,
  order?: readonly string[],
): FilterOption[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const value of valuesFor(row, group)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  const present = [...counts.keys()];
  const sorted = order
    ? [
        ...order.filter((v) => counts.has(v)),
        ...present.filter((v) => !order.includes(v)).sort(),
      ]
    : present.sort();
  return sorted.map((value) => ({ value, count: counts.get(value) ?? 0 }));
}

/**
 * The options a surface actually offers: the ones that leave at least one row
 * out.
 *
 * An option every row carries cannot change anything. Ticking "Survivability"
 * on a Paladin page where all seven builds are good at it re-selects all seven
 * — a control whose only possible effect is to say "yes, all of them", which
 * reads as broken the first time a reader tries it.
 *
 * The rule is per *option*, not per group, and that is the whole point. Judging
 * only the group let a constant option ride along inside a group that was
 * otherwise fine: the Paladin "Good at" group offers eight axes, seven of which
 * narrow, so the group passed and `Survivability (7)` was rendered anyway.
 *
 * Dropping an option also drops it from the parse allow-list, so a stale
 * `?goodAt=survivability` link is ignored rather than honoured — which is the
 * same listing either way, because the option matched everything.
 */
export function narrowingOptionsFor(
  rows: readonly BuildRow[],
  group: FilterGroup,
  order?: readonly string[],
): FilterOption[] {
  return optionsFor(rows, group, order).filter((o) => o.count < rows.length);
}

/**
 * Whether a group can actually narrow this set of rows.
 *
 * One option that narrows is enough — it still removes a row when ticked. What
 * is never enough is a group whose every option is carried by every row: eight
 * "good at" axes on two builds with identical ratings offer a choice that
 * changes nothing.
 */
export function isDiscriminating(rows: readonly BuildRow[], group: FilterGroup): boolean {
  return narrowingOptionsFor(rows, group).length > 0;
}

/**
 * Whether a listing is worth offering filters for at all.
 *
 * A class page with one build would otherwise get a panel of controls with
 * nothing to do. Two builds and at least one group that can genuinely narrow
 * them is the bar, and it is the same bar on every surface rather than a
 * per-page judgement.
 */
export function shouldOfferFilters(
  rows: readonly BuildRow[],
  groups: readonly FilterGroup[],
): boolean {
  if (rows.length < 2) return false;
  return groups.some((g) => isDiscriminating(rows, g));
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

/**
 * OR inside a group, AND between groups.
 *
 * Selecting Cold and Fire asks for builds that are cold **or** fire, because a
 * reader ticking two boxes in one list is widening it. Selecting Cold and then
 * Beginner narrows: two different questions both have to be satisfied. This is
 * the behaviour every faceted catalogue has, and it is asserted directly rather
 * than left to the reader of `filterBuilds`.
 *
 * `state.sort` is not consulted. It is a view, and the sort is applied by
 * `lib/builds/sort.ts` to whatever this returns.
 */
export function matchesFilters(row: BuildRow, state: BuildFilterState): boolean {
  for (const group of FILTER_GROUPS) {
    const selected = state[group];
    if (selected.length === 0) continue;
    const values = valuesFor(row, group);
    if (!selected.some((v) => values.includes(v))) return false;
  }
  return true;
}

/** Filtering preserves the incoming order; nothing here re-ranks. */
export function filterBuilds(
  rows: readonly BuildRow[],
  state: BuildFilterState,
): BuildRow[] {
  return rows.filter((row) => matchesFilters(row, state));
}

// ---------------------------------------------------------------------------
// Conditional counts
// ---------------------------------------------------------------------------

/** Per group, per value present in the rows: how many builds a click would list. */
export type FacetCounts = Record<FilterGroup, Record<string, number>>;

/**
 * The number beside each option, under the current selection (R-FILT-4).
 *
 * The definition is the one every consequence is tested against: the count of
 * a value is **how many rows would match if that value were the only selection
 * in its group**, with every other group's selection applied as it is. Two
 * things follow, and both were defects once.
 *
 * The option's own group is left out. Inside a group the boxes widen, so the
 * number beside an unticked Fire has to say what ticking it would add to — the
 * fire builds — not the fire builds that are also cold. And the number beside
 * a ticked value stays put as its siblings are ticked, because it is still the
 * same answer to the same question.
 *
 * The other groups are applied. With Necromancer ticked, Cold reads `0`, which
 * is the fact the reader wanted — this class has no cold build — and the reason
 * the surface disables the box: a `0` is exactly an option whose tick could
 * not add a build. The static inventory (`optionsFor`) would print the
 * catalogue-wide number there, and that was what every box said before.
 *
 * Every value present in the rows gets a key, zeros included. A key that went
 * missing at `0` would make the surface guess, and the surface has to render
 * the `0` — "no cold Necromancer" is information, not an absence.
 */
export function facetCounts(rows: readonly BuildRow[], state: BuildFilterState): FacetCounts {
  const counts = {} as FacetCounts;
  for (const group of FILTER_GROUPS) {
    const context = filterBuilds(rows, { ...state, [group]: [] });
    const perValue: Record<string, number> = {};
    for (const row of rows) for (const value of valuesFor(row, group)) perValue[value] ??= 0;
    for (const row of context) for (const value of valuesFor(row, group)) perValue[value] += 1;
    counts[group] = perValue;
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Toggling
// ---------------------------------------------------------------------------

/** Adds or removes one value, keeping the group in canonical order. */
export function toggleValue(
  state: BuildFilterState,
  group: FilterGroup,
  value: string,
  allowed: readonly string[],
): BuildFilterState {
  const current = new Set(state[group]);
  if (current.has(value)) current.delete(value);
  else current.add(value);
  return { ...state, [group]: allowed.filter((v) => current.has(v)) };
}

/**
 * The toggle every surface uses, because the plain one can strand the reader.
 *
 * Two rules the counts impose collide in one case. An option at `0` is
 * disabled, so no click produces an empty list; and a selected option is
 * always removable, even at `0`, because a reader who arrived by URL with
 * `class=necromancer&damage=cold,fire` sees Cold at `0` and must be able to
 * un-tick it. Un-ticking *Fire* there is the collision: `toggleValue` leaves
 * `damage=cold`, Cold contributes nothing, and the list goes empty on a click.
 *
 * The rule (plan §4, decision 2): when a removal takes the list from something
 * to nothing, the value removed was the last one in its group still
 * contributing, and its remaining siblings — all at `0`, all already shown as
 * such — go with it, so the group empties and the list widens to what the
 * other groups allow. That is the only pruning there is:
 *
 *   - Adding never prunes. The surface only enables options with a count, so
 *     an add cannot empty the list; and an add of a `0` through a stale
 *     control is honoured as asked rather than second-guessed.
 *   - A removal that leaves results is the plain toggle.
 *   - From a list that is already empty nothing is pruned. That state was
 *     reached by URL, the empty state is reporting it honestly, and a toggle
 *     that quietly rewrote the other values would make "Remove {group}" and
 *     the near builds describe a state the reader never saw.
 */
export function toggleKeepingResults(
  state: BuildFilterState,
  group: FilterGroup,
  value: string,
  allowed: readonly string[],
  rows: readonly BuildRow[],
): BuildFilterState {
  const next = toggleValue(state, group, value, allowed);
  const removing = state[group].includes(value);
  if (!removing || next[group].length === 0) return next;
  const hadResults = rows.some((row) => matchesFilters(row, state));
  if (!hadResults) return next;
  const hasResults = rows.some((row) => matchesFilters(row, next));
  return hasResults ? next : { ...next, [group]: [] };
}

// ---------------------------------------------------------------------------
// The URL
// ---------------------------------------------------------------------------

/**
 * Parameter names are English slugs in every locale, and so are the values.
 *
 * A pt-BR reader who copies a filtered link and sends it to an en-US reader
 * must land them on the same filtered list. Translating either half would make
 * the link locale-bound, and translating them later would break every link
 * already shared.
 */
export const QUERY_KEYS: Readonly<Record<FilterGroup | "sort", string>> = {
  class: "class",
  damage: "damage",
  difficulty: "difficulty",
  budget: "budget",
  goodAt: "goodAt",
  sort: "sort",
};

/**
 * What a page offers, and therefore what its URL may select.
 *
 * `sort` is on the same footing as a group: the component passes
 * `availableSorts(hasTier)`, so a `?sort=stage` opened without a tier
 * preference degrades to the default the same way a value for a group the
 * page does not render does. There is no second mechanism for it.
 */
export type OptionSets = Readonly<
  Partial<Record<FilterGroup, readonly string[]>> & { sort?: readonly SortKey[] }
>;

/**
 * Reads state out of any `URLSearchParams`-alike.
 *
 * Everything unrecognised is dropped rather than carried: an unknown key, an
 * unknown value, a value for a group this page does not offer, a sort it does
 * not offer, a repeated value, an empty segment. The page renders; it never
 * throws and never shows a control for something it cannot filter by. That is
 * what makes a hand-edited or stale link safe — and what makes an old `?q=`
 * link, from when there was a search box here, open the unfiltered listing.
 *
 * A repeated parameter — `?damage=cold&damage=fire`, which no control here
 * writes but a hand-edited or third-party link may — is read as the union of
 * its values rather than as its first one. `get()` would silently discard
 * "fire"; there is no reading of that link on which the reader wanted it
 * dropped. `getAll` is optional on the interface so a plain `{get}` still
 * works. A repeated `sort` is a view, not a list, so it takes the first value
 * the page offers.
 */
export function parseFilterState(
  params: { get(key: string): string | null; getAll?(key: string): string[] },
  options: OptionSets,
): BuildFilterState {
  const state: BuildFilterState = { ...EMPTY_FILTER_STATE };

  const raws = (key: string): string[] =>
    params.getAll ? params.getAll(key) : [params.get(key) ?? ""];

  for (const group of FILTER_GROUPS) {
    const allowed = options[group];
    if (!allowed || allowed.length === 0) continue;
    const chosen = new Set(
      raws(QUERY_KEYS[group])
        .flatMap((raw) => raw.split(","))
        .map((v) => v.trim())
        .filter((v) => v.length > 0 && allowed.includes(v)),
    );
    // Canonical order, so the same selection always serialises identically.
    state[group] = allowed.filter((v) => chosen.has(v));
  }

  const sorts = options.sort ?? [];
  const sort = raws(QUERY_KEYS.sort)
    .map((v) => v.trim())
    .find((v): v is SortKey => (sorts as readonly string[]).includes(v));
  if (sort) state.sort = sort;
  return state;
}

/**
 * The inverse. Empty groups and the default sort are omitted entirely, so the
 * unfiltered listing has a bare URL rather than a trail of empty parameters,
 * and the sort comes after the groups so a link reads filters-then-view.
 */
export function serializeFilterState(state: BuildFilterState): URLSearchParams {
  const params = new URLSearchParams();
  for (const group of FILTER_GROUPS) {
    if (state[group].length > 0) params.set(QUERY_KEYS[group], state[group].join(","));
  }
  if (state.sort !== DEFAULT_SORT) params.set(QUERY_KEYS.sort, state.sort);
  return params;
}

/** `?a=b` or `""`. What goes after the pathname. */
export function filterQueryString(state: BuildFilterState): string {
  const params = serializeFilterState(state);
  const s = params.toString();
  return s ? `?${s}` : "";
}
