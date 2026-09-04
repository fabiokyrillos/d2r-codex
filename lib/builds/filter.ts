/**
 * Build filtering, as pure functions over plain rows.
 *
 * Three constraints shaped this file, and all three are load-bearing.
 *
 * **It must be safe to import from a Client Component.** `scripts/client-boundary.test.ts`
 * fails the build if anything under `lib/registry`, `content/`, `lib/search/index.ts`
 * or `lib/i18n/server` becomes reachable from a `"use client"` entry, because
 * one convenient barrel import once put the whole corpus into a 1.1 MB chunk on
 * every page. So nothing here imports content. Rows are built server-side by
 * `lib/builds/rows.ts` and arrive as props.
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
 */
import { fold } from "@/lib/search/scoring";
import type { BuildRatings } from "@/lib/types/build";
import type { Rating } from "@/lib/types/core";

// ---------------------------------------------------------------------------
// The row a page hands to the filter
// ---------------------------------------------------------------------------

/**
 * One build, flattened to what filtering and searching need.
 *
 * `className` and `aliases` are here rather than derived because both are
 * locale-dependent lookups the server has already done: the class name is
 * translated, and the aliases come from the search nicknames table, which lives
 * behind the client boundary.
 */
export interface BuildRow {
  slug: string;
  name: string;
  summary: string;
  classSlug: string;
  /** The class's name in the active locale. Searchable. */
  className: string;
  damageTypes: string[];
  difficulty: string;
  budget: string;
  /** Rating axes at or above `GOOD_AT_THRESHOLD`, computed by `goodAtAxes`. */
  goodAt: string[];
  /** Space-joined search nicknames, or `""` where the build has none. */
  aliases: string;
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
 * **The distribution agrees.** Across the 29 published builds and eight axes —
 * 232 ratings — 47.4% sit at 4 or above, so each axis divides the catalogue
 * roughly in half, which is what a filter is for. A build carries 3.8 of the
 * eight tags on average and exactly one build carries none.
 *
 * The alternatives were measured rather than dismissed. At 3 or above, 80.6% of
 * ratings qualify and the average build carries 6.4 of 8 tags: selecting almost
 * everything is not filtering. At 5 only, twelve of the 29 builds carry no tag
 * at all and can never be reached through this group.
 *
 * One threshold, one rule, every build — no per-axis curve and no editorial
 * override.
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
    why: "`release` is optional on `Build` and set on none of them. Every build is written against the one baseline patch.",
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

export interface BuildFilterState {
  /** Free text. Matched against name, summary, class name and aliases. */
  q: string;
  class: string[];
  damage: string[];
  difficulty: string[];
  budget: string[];
  goodAt: string[];
}

export const EMPTY_FILTER_STATE: BuildFilterState = {
  q: "",
  class: [],
  damage: [],
  difficulty: [],
  budget: [],
  goodAt: [],
};

export function isEmptyState(state: BuildFilterState): boolean {
  return state.q.trim() === "" && FILTER_GROUPS.every((g) => state[g].length === 0);
}

export function activeCount(state: BuildFilterState): number {
  return (
    (state.q.trim() === "" ? 0 : 1) + FILTER_GROUPS.reduce((n, g) => n + state[g].length, 0)
  );
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
 * The options for one group, ordered by `order` where the model has a canonical
 * sequence and by first appearance otherwise.
 *
 * An option with no rows behind it is never offered: a class filter on a page
 * that lists one class's builds would be a control that cannot change anything.
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
 * Whether a group can actually narrow this set of rows.
 *
 * Two options is not enough. A group where every option is carried by every row
 * — eight "good at" axes on two builds with identical ratings — offers a choice
 * that changes nothing, and a control that changes nothing reads as broken. The
 * test is whether *some* option leaves at least one row out.
 */
export function isDiscriminating(rows: readonly BuildRow[], group: FilterGroup): boolean {
  const options = optionsFor(rows, group);
  return options.length >= 2 && options.some((o) => o.count < rows.length);
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
 * The searchable text of a row, folded once.
 *
 * `fold` is the site's existing search normaliser — lowercase, NFD, diacritics
 * stripped — imported rather than reimplemented so "tuneis" keeps finding
 * "Túneis" here for the same reason it does in the global search.
 */
export function searchableText(row: BuildRow): string {
  return fold([row.name, row.summary, row.className, row.aliases].join(" "));
}

/** Every whitespace-separated term must match somewhere. Same rule as search. */
export function matchesQuery(row: BuildRow, query: string): boolean {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = searchableText(row);
  return terms.every((term) => haystack.includes(term));
}

/**
 * OR inside a group, AND between groups, AND with the query.
 *
 * Selecting Cold and Fire asks for builds that are cold **or** fire, because a
 * reader ticking two boxes in one list is widening it. Selecting Cold and then
 * Beginner narrows: two different questions both have to be satisfied. This is
 * the behaviour every faceted catalogue has, and it is asserted directly rather
 * than left to the reader of `filterBuilds`.
 */
export function matchesFilters(row: BuildRow, state: BuildFilterState): boolean {
  for (const group of FILTER_GROUPS) {
    const selected = state[group];
    if (selected.length === 0) continue;
    const values = valuesFor(row, group);
    if (!selected.some((v) => values.includes(v))) return false;
  }
  return matchesQuery(row, state.q);
}

/** Filtering preserves the incoming order; nothing here re-ranks. */
export function filterBuilds(
  rows: readonly BuildRow[],
  state: BuildFilterState,
): BuildRow[] {
  return rows.filter((row) => matchesFilters(row, state));
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
export const QUERY_KEYS: Readonly<Record<"q" | FilterGroup, string>> = {
  q: "q",
  class: "class",
  damage: "damage",
  difficulty: "difficulty",
  budget: "budget",
  goodAt: "goodAt",
};

export type OptionSets = Readonly<Partial<Record<FilterGroup, readonly string[]>>>;

/**
 * Reads state out of any `URLSearchParams`-alike.
 *
 * Everything unrecognised is dropped rather than carried: an unknown key, an
 * unknown value, a value for a group this page does not offer, a repeated
 * value, an empty segment. The page renders; it never throws and never shows a
 * control for something it cannot filter by. That is what makes a hand-edited
 * or stale link safe.
 */
export function parseFilterState(
  params: { get(key: string): string | null },
  options: OptionSets,
): BuildFilterState {
  const state: BuildFilterState = { ...EMPTY_FILTER_STATE };
  state.q = (params.get(QUERY_KEYS.q) ?? "").slice(0, 120);

  for (const group of FILTER_GROUPS) {
    const allowed = options[group];
    if (!allowed || allowed.length === 0) continue;
    const raw = params.get(QUERY_KEYS[group]);
    if (!raw) continue;
    const chosen = new Set(
      raw
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0 && allowed.includes(v)),
    );
    // Canonical order, so the same selection always serialises identically.
    state[group] = allowed.filter((v) => chosen.has(v));
  }
  return state;
}

/**
 * The inverse. Empty groups and an empty query are omitted entirely, so the
 * unfiltered listing has a bare URL rather than a trail of empty parameters.
 */
export function serializeFilterState(state: BuildFilterState): URLSearchParams {
  const params = new URLSearchParams();
  const q = state.q.trim();
  if (q) params.set(QUERY_KEYS.q, q);
  for (const group of FILTER_GROUPS) {
    if (state[group].length > 0) params.set(QUERY_KEYS[group], state[group].join(","));
  }
  return params;
}

/** `?a=b` or `""`. What goes after the pathname. */
export function filterQueryString(state: BuildFilterState): string {
  const params = serializeFilterState(state);
  const s = params.toString();
  return s ? `?${s}` : "";
}

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
