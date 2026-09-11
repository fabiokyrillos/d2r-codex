/**
 * Proof that build filtering does what the listings claim it does.
 *
 * The filtering itself is a pure function over plain rows, which is the whole
 * reason it can be tested here rather than only through a browser: `filter.ts`
 * imports nothing but types, so this file exercises exactly the code the
 * browser runs.
 *
 * Five things are asserted that a reader would otherwise have to take on trust:
 *
 *   1. **The semantics.** OR inside a group, AND between groups. Both mutations
 *      — AND inside, OR between — are implemented here and shown to disagree
 *      with the real function on a specific pair of builds.
 *   2. **The URL is a round trip.** Serialise, parse, and the state and its
 *      results are identical — which is what "reload a filtered link" means.
 *      Unknown keys, unknown values, empty segments, duplicates, a group the
 *      page does not offer and a sort it does not offer are all dropped rather
 *      than thrown on. The sort is a *view* carried in the same URL, and it is
 *      asserted to stay out of every count.
 *   3. **Nothing is invented.** `RATING_AXES` is checked against the real
 *      `BuildRatings` keys, the option sets are checked against the real
 *      catalogue, the rows' ratings and stage picks are recomputed from the
 *      builds they came from, and every refused filter is checked to still
 *      have no data behind it.
 *   4. **The threshold is the one the scale names.** `GOOD_AT_THRESHOLD` is 4
 *      because `ratingLabels` calls 4 "Good"; the distribution that made the
 *      alternatives unusable is asserted so a future edit has to argue with
 *      numbers.
 *   5. **No tick strands the reader on an empty list.** `toggleKeepingResults`
 *      is the one rule that reconciles "an option with zero results is
 *      disabled" with "a selected option is always removable": un-ticking the
 *      last value that still contributed empties the group instead of leaving
 *      its zero-count siblings behind. The plain toggle is kept as the control
 *      that would have stranded the reader.
 *
 * The conditional counts themselves, the sort orders and the empty-state
 * helpers have files of their own: `facet-counts.test.ts`, `build-sort.test.ts`
 * and `empty-state.test.ts`.
 *
 * Run with `npm run test:build-filters`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getBuilds, resolveRef } from "../lib/registry";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { ratingLabels } from "../lib/labels";
import {
  BUDGET_LEVELS,
  DIFFICULTY_RATINGS,
  ELEMENTS,
  PROGRESSION_TIERS,
} from "../lib/types/core";
import {
  ADVANCED_GROUPS,
  CLASS_PAGE_FILTER_GROUPS,
  DEFAULT_SORT,
  EMPTY_FILTER_STATE,
  FILTER_GROUPS,
  GOOD_AT_THRESHOLD,
  QUERY_KEYS,
  RATING_AXES,
  REFUSED_FILTERS,
  SORT_KEYS,
  activeCount,
  advancedCount,
  facetCounts,
  filterBuilds,
  filterQueryString,
  goodAtAxes,
  isDiscriminating,
  isEmptyState,
  narrowingOptionsFor,
  optionsFor,
  parseFilterState,
  serializeFilterState,
  shouldOfferFilters,
  toggleKeepingResults,
  toggleValue,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
  type SortKey,
} from "../lib/builds/filter";
import {
  applyFilterDraft,
  clearFilterDraft,
  cloneFilterState,
  sheetFilterCount,
  toggleDraftValue,
} from "../lib/builds/filter-sheet";
import { availableSorts } from "../lib/builds/sort";
import { buildRows, classOrderOf } from "../lib/builds/rows";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

const rowsFor = (locale: Locale) => buildRows(locale, getBuilds(locale));
const rows = rowsFor(DEFAULT_LOCALE);
const state = (over: Partial<BuildFilterState> = {}): BuildFilterState => ({
  ...EMPTY_FILTER_STATE,
  ...over,
});
const slugs = (rs: readonly BuildRow[]) => rs.map((r) => r.slug).sort();
const allOptions = (rs: readonly BuildRow[]) =>
  Object.fromEntries(
    FILTER_GROUPS.map((g) => [g, optionsFor(rs, g).map((o) => o.value)]),
  ) as Record<FilterGroup, string[]>;
/**
 * What the catalogue page hands the parser: every group's options, and every
 * sort — the component passes `availableSorts(hasTier)` here, and the sections
 * below that need the no-preference variant say so explicitly.
 */
const options: Record<FilterGroup, string[]> & { sort: readonly SortKey[] } = {
  ...allOptions(rows),
  sort: SORT_KEYS,
};
const results = (s: BuildFilterState, rs: readonly BuildRow[] = rows) => filterBuilds(rs, s).length;

/**
 * A class with no build of some damage type, and one of another, found in the
 * data rather than named. Necromancer + Cold is the case the plan describes,
 * but the day a cold Necromancer is published the assertion has to move with
 * the catalogue rather than fail for an unrelated reason.
 */
const zeroCase = (() => {
  for (const classSlug of classOrderOf(rows)) {
    const classRows = rows.filter((r) => r.classSlug === classSlug);
    const carried = (d: string) => classRows.filter((r) => r.damageTypes.includes(d)).length;
    const missing = options.damage.find((d) => carried(d) === 0);
    const present = options.damage.find((d) => carried(d) > 0);
    if (missing && present) return { classSlug, missing, present, classRows };
  }
  throw new Error("no class in the catalogue lacks a damage type; the fixture needs one");
})();

// ===========================================================================
// The model is the only source
// ===========================================================================

console.log("\nOptions and axes come from the model");
{
  // A real build's ratings object, so a ninth axis added to `BuildRatings`
  // without being added to `RATING_AXES` fails here rather than silently
  // missing from the filter.
  const ratingKeys = Object.keys(getBuilds(DEFAULT_LOCALE)[0].ratings).sort();
  check(
    "RATING_AXES matches the keys of BuildRatings exactly",
    JSON.stringify([...RATING_AXES].sort()) === JSON.stringify(ratingKeys),
    `${[...RATING_AXES].sort().join(",")} vs ${ratingKeys.join(",")}`,
  );

  const catalogue = getBuilds(DEFAULT_LOCALE);
  check(
    "the class options are exactly the classes the catalogue has builds for",
    JSON.stringify(options.class.sort()) ===
      JSON.stringify([...new Set(catalogue.map((b) => b.classSlug))].sort()),
    options.class.join(","),
  );
  check(
    "every damage option is a real Element",
    options.damage.every((d) => (ELEMENTS as readonly string[]).includes(d)),
    options.damage.join(","),
  );
  check(
    "every difficulty option is a real PlayDifficulty",
    options.difficulty.every((d) => (DIFFICULTY_RATINGS as readonly string[]).includes(d)),
  );
  check(
    "every budget option is a real BudgetLevel",
    options.budget.every((b) => (BUDGET_LEVELS as readonly string[]).includes(b)),
  );
  check(
    "no option is offered that no build carries",
    FILTER_GROUPS.every((g) => optionsFor(rows, g).every((o) => o.count > 0)),
  );

  // Counts are derived, never authored.
  const coldCount = optionsFor(rows, "damage").find((o) => o.value === "cold")?.count ?? -1;
  check(
    "an option's count equals the builds that carry it",
    coldCount === rows.filter((r) => r.damageTypes.includes("cold")).length,
    `${coldCount}`,
  );
}

console.log("\nRefused filters still have no data behind them");
{
  const catalogue = getBuilds(DEFAULT_LOCALE);
  check(
    "no build populates modes.ladder, modes.life or modes.online",
    catalogue.every(
      (b) =>
        !b.modes?.ladder?.length && !b.modes?.life?.length && !b.modes?.online?.length,
    ),
  );
  // The specific trap the refusal exists for: an empty object is not data.
  const emptyModes = catalogue.filter((b) => b.modes && Object.keys(b.modes).length === 0);
  check(
    `${emptyModes.length} build(s) carry an empty \`modes\` object, which must not be read as a mode`,
    emptyModes.every((b) => !b.modes?.ladder && !b.modes?.life && !b.modes?.online),
    emptyModes.map((b) => b.slug).join(","),
  );
  /*
   * `release` used to be set on no build at all, and the `patch` refusal said
   * so. Four builds carry one now - the Warlock's, all `reign-of-the-warlock` -
   * so the old assertion was true only until the expansion had content.
   *
   * The refusal still stands, on a different and stronger reason: **every build
   * carrying a release is a Warlock build**, so a release filter would select
   * exactly what `class=warlock` already selects. This file's own principle
   * covers it - an option with no independent power is a control that cannot
   * change anything - and it is the same argument that keeps a class filter off
   * a single-class page.
   *
   * So the assertion now guards the reason rather than the old absence. The day
   * a non-Warlock build carries a release, the refusal loses its justification
   * and this goes red, which is exactly when it should.
   */
  const released = catalogue.filter((b) => b.release !== undefined);
  check(
    "every build carrying a `release` is a Warlock build, so the filter would be the class filter",
    released.length > 0 && released.every((b) => b.classSlug === "warlock"),
    released.map((b) => `${b.slug}:${b.classSlug}`).join(", "),
  );
  check(
    "`complete` is uniform, so it cannot separate levelling from endgame",
    new Set(catalogue.map((b) => b.complete)).size === 1,
  );
  check(
    "every refusal is written down with a reason",
    REFUSED_FILTERS.length >= 7 && REFUSED_FILTERS.every((r) => r.why.length > 40),
    `${REFUSED_FILTERS.length}`,
  );
  check(
    "no refused id leaked into the filter groups",
    REFUSED_FILTERS.every((r) => !(FILTER_GROUPS as readonly string[]).includes(r.id)),
  );
}

// ===========================================================================
// The threshold
// ===========================================================================

console.log("\nThe 'Good at' threshold is the one the scale names");
{
  const t = dictionaryFor(DEFAULT_LOCALE);
  check(
    `the scale calls ${GOOD_AT_THRESHOLD} "${ratingLabels(t)[GOOD_AT_THRESHOLD]}"`,
    ratingLabels(t)[GOOD_AT_THRESHOLD] === t.ratings.good,
  );

  const catalogue = getBuilds(DEFAULT_LOCALE);
  const values = catalogue.flatMap((b) => RATING_AXES.map((a) => b.ratings[a]));
  const share = (th: number) => values.filter((v) => v >= th).length / values.length;
  const untagged = (th: number) =>
    catalogue.filter((b) => RATING_AXES.every((a) => b.ratings[a] < th)).length;

  check(
    `at >=${GOOD_AT_THRESHOLD} the group divides the catalogue rather than selecting it (${(share(4) * 100).toFixed(1)}%)`,
    share(4) > 0.3 && share(4) < 0.6,
    `${(share(4) * 100).toFixed(1)}%`,
  );
  check(
    `at >=3 it would select ${(share(3) * 100).toFixed(1)}% — too many to be a filter`,
    share(3) > 0.75,
  );
  check(
    `at 5 only, ${untagged(5)} builds would carry no tag at all`,
    untagged(5) >= 10,
    `${untagged(5)}`,
  );
  check(
    `at >=${GOOD_AT_THRESHOLD}, at most one build carries no tag`,
    untagged(4) <= 1,
    `${untagged(4)}`,
  );

  // One rule, applied identically everywhere.
  check(
    "goodAtAxes agrees with the threshold for every build and axis",
    catalogue.every((b) => {
      const got = new Set(goodAtAxes(b.ratings));
      return RATING_AXES.every((a) => got.has(a) === b.ratings[a] >= GOOD_AT_THRESHOLD);
    }),
  );
  check(
    "the rows carry the same answer the rule gives",
    catalogue.every((b, i) => JSON.stringify(rows[i].goodAt) === JSON.stringify(goodAtAxes(b.ratings))),
  );
}

// ===========================================================================
// OR within a group, AND between groups
// ===========================================================================

console.log("\nOR inside a group, AND between groups");
{
  const cold = filterBuilds(rows, state({ damage: ["cold"] }));
  const fire = filterBuilds(rows, state({ damage: ["fire"] }));
  const both = filterBuilds(rows, state({ damage: ["cold", "fire"] }));
  const union = new Set([...cold, ...fire].map((r) => r.slug));

  check("selecting one value narrows to it", cold.every((r) => r.damageTypes.includes("cold")));
  check(
    "selecting two values in one group is their union, not their intersection",
    both.length === union.size && slugs(both).join() === [...union].sort().join(),
    `${both.length} vs union ${union.size}`,
  );
  check("the union is strictly larger than either half", both.length > cold.length);

  const sorc = filterBuilds(rows, state({ class: ["sorceress"] }));
  const crossed = filterBuilds(rows, state({ class: ["sorceress"], damage: ["cold"] }));
  check(
    "a second group intersects rather than widening",
    crossed.length <= Math.min(sorc.length, cold.length) &&
      crossed.every((r) => r.classSlug === "sorceress" && r.damageTypes.includes("cold")),
    `${crossed.length}`,
  );

  /*
   * Mutations. Each is the rule written the other way round, and each has to
   * disagree with the real function on a case the site would actually hit.
   */
  const andInsideGroup = (rs: readonly BuildRow[], s: BuildFilterState) =>
    rs.filter((r) => s.damage.every((v) => r.damageTypes.includes(v)));
  check(
    "control: AND inside a group returns fewer builds than the real OR",
    andInsideGroup(rows, state({ damage: ["cold", "fire"] })).length < both.length,
  );

  const orBetweenGroups = (rs: readonly BuildRow[], s: BuildFilterState) =>
    rs.filter(
      (r) => s.class.includes(r.classSlug) || s.damage.some((v) => r.damageTypes.includes(v)),
    );
  check(
    "control: OR between groups returns more builds than the real AND",
    orBetweenGroups(rows, state({ class: ["sorceress"], damage: ["cold"] })).length >
      crossed.length,
  );

  check(
    "an empty state returns everything, in the original order",
    filterBuilds(rows, EMPTY_FILTER_STATE).map((r) => r.slug).join() ===
      rows.map((r) => r.slug).join(),
  );
  /*
   * `tinker` is not a Diablo II class, and that is the point.
   *
   * These three assertions need a value with no rows behind it, and they used
   * to spell it `barbarian` and `warlock` — real classes that happened to have
   * no builds yet. `rows` comes from the live registry, and filter options are
   * derived from it ("an option with no rows behind it is never offered"), so
   * the day either class is published the assertion stops testing what its name
   * says and starts failing for an unrelated reason. A word that can never be a
   * class keeps the claim true forever, the same way `plasma` does for damage.
   */
  check(
    "a group with no rows behind the selection returns nothing rather than everything",
    filterBuilds(rows, state({ class: ["tinker"] })).length === 0,
  );
}

// ===========================================================================
// The URL
// ===========================================================================

console.log("\nQuery parameters: round trip, and everything invalid dropped");
{
  const full = state({
    class: ["sorceress"],
    damage: ["cold", "fire"],
    difficulty: ["beginner"],
    budget: ["medium"],
    goodAt: ["bossing"],
    sort: "name",
  });

  const round = parseFilterState(serializeFilterState(full), options);
  check(
    "serialise then parse is the identity",
    JSON.stringify(round) === JSON.stringify(full),
    JSON.stringify(round),
  );
  check(
    "and the results are the same, which is what reloading a link means",
    slugs(filterBuilds(rows, round)).join() === slugs(filterBuilds(rows, full)).join(),
  );

  check(
    "the empty state serialises to nothing at all",
    filterQueryString(EMPTY_FILTER_STATE) === "",
    filterQueryString(EMPTY_FILTER_STATE),
  );
  check(
    "parameter names are language-independent slugs",
    Object.values(QUERY_KEYS).every((k) => /^[a-zA-Z]+$/.test(k)),
  );

  // Determinism: the same selection reached in a different order must produce
  // the same link, or two readers filtering identically share different URLs.
  const a = toggleValue(toggleValue(EMPTY_FILTER_STATE, "damage", "fire", options.damage), "damage", "cold", options.damage);
  const b = toggleValue(toggleValue(EMPTY_FILTER_STATE, "damage", "cold", options.damage), "damage", "fire", options.damage);
  check(
    "toggle order does not change the URL",
    filterQueryString(a) === filterQueryString(b),
    `${filterQueryString(a)} vs ${filterQueryString(b)}`,
  );
  check("toggling twice removes the value", toggleValue(a, "damage", "cold", options.damage).damage.join() === "fire");

  const parse = (qs: string) => parseFilterState(new URLSearchParams(qs), options);
  check("an unknown parameter is ignored", isEmptyState(parse("page=3&utm_source=x&tier=budget")));
  /*
   * `q` was a parameter of this URL until the inline search box left with
   * R-FILT-8 — one search, the global one. A link that still carries it is
   * exactly the stale-link case the parser exists for: the query is ignored,
   * and the filters beside it are kept.
   */
  check(
    "a stale `?q=` is an unknown parameter now, not a filter",
    isEmptyState(parse("q=hammerdin")) && results(parse("q=hammerdin")) === rows.length,
  );
  check(
    "…and does not take the valid filters beside it down with it",
    parse("q=hammerdin&class=sorceress").class.join() === "sorceress",
  );
  check(
    "an unknown value inside a known group is dropped",
    parse("damage=cold,plasma,,cold").damage.join() === "cold",
    parse("damage=cold,plasma,,cold").damage.join(),
  );
  check("a group with only unknown values ends up empty", parse("class=tinker").class.length === 0);
  check("a garbage query string still yields a usable state", isEmptyState(parse("=&&&%%%=")));
  check(
    "a filtered link with only invalid values shows the whole catalogue",
    filterBuilds(rows, parse("damage=plasma&class=tinker")).length === rows.length,
  );
  check(
    "a value for a group this page does not offer is dropped",
    parseFilterState(new URLSearchParams("class=sorceress&damage=cold"), {
      damage: options.damage,
    }).class.length === 0,
  );

  // Mutation: a parser that trusts the URL turns a stale link into a control
  // the page cannot render and a filter that matches nothing.
  const trusting = (qs: string) => (new URLSearchParams(qs).get("damage") ?? "").split(",");
  check(
    "control: a parser without an allow-list keeps the unknown value",
    trusting("damage=cold,plasma").includes("plasma") &&
      !parse("damage=cold,plasma").damage.includes("plasma"),
  );

  /*
   * Repeated parameters. Nothing here writes one — the serialiser joins a group
   * into a single comma-separated value — but a hand-edited link, a form, or
   * another site's idea of how to encode a multi-select will, and reading only
   * the first would silently drop half of what the link asked for.
   */
  check(
    "a repeated parameter is the union of its values",
    parse("damage=cold&damage=fire").damage.join() ===
      parse("damage=cold,fire").damage.join(),
    parse("damage=cold&damage=fire").damage.join(),
  );
  check(
    "…across the comma form too",
    parse("damage=cold,fire&damage=lightning").damage.length === 3,
    parse("damage=cold,fire&damage=lightning").damage.join(),
  );
  check(
    "a repeated parameter still drops unknown values",
    parse("damage=cold&damage=plasma").damage.join() === "cold",
    parse("damage=cold&damage=plasma").damage.join(),
  );
  check("an empty repeated parameter contributes nothing", parse("damage=&damage=").damage.length === 0);
  check(
    "a duplicate of the same value is not counted twice",
    parse("damage=cold&damage=cold").damage.length === 1,
  );
  // Mutation: reading only the first value loses the second half of the link.
  check(
    "control: a get-only parser drops the repeated value",
    parseFilterState(
      { get: (k) => new URLSearchParams("damage=cold&damage=fire").get(k) },
      options,
    ).damage.join() === "cold",
  );
}

// ===========================================================================
// The sort, which is a view carried in the same URL
// ===========================================================================

/*
 * `?sort=` rides in the filter URL because a sorted, filtered link has to mean
 * the same list to whoever opens it — but it is a *view*, not a filter, and
 * the two are kept apart at every point the model can be asked: it is not an
 * active filter, it is not counted, it never changes which rows match, and the
 * default is omitted so the unsorted, unfiltered listing keeps its bare URL.
 *
 * "For my stage" is the one sort that is not always on offer: it needs the
 * tier preference, which lives in the browser and never in the URL. So the
 * component passes `availableSorts(hasTier)` as the parser's allow-list, and a
 * `?sort=stage` opened without a preference degrades to the default the same
 * way a value for a group the page does not offer does. There is no second
 * mechanism for it.
 */
console.log("\nThe sort is a view in the URL, not a filter");
{
  const parse = (qs: string, opts: typeof options = options) =>
    parseFilterState(new URLSearchParams(qs), opts);

  check("the empty state sorts by the default", EMPTY_FILTER_STATE.sort === DEFAULT_SORT);
  check("the default sort is one of the keys", (SORT_KEYS as readonly string[]).includes(DEFAULT_SORT));
  check(
    "the default sort is omitted from the URL, so the bare listing stays bare",
    filterQueryString(state({ sort: DEFAULT_SORT })) === "" && !serializeFilterState(EMPTY_FILTER_STATE).has(QUERY_KEYS.sort),
    filterQueryString(state({ sort: DEFAULT_SORT })),
  );
  check(
    "a non-default sort is written under its English key",
    filterQueryString(state({ sort: "name" })) === `?${QUERY_KEYS.sort}=name`,
    filterQueryString(state({ sort: "name" })),
  );
  check(
    "…after the filter groups, so a link reads filters-then-view",
    [...serializeFilterState(state({ damage: ["cold"], sort: "name" })).keys()].join() ===
      `${QUERY_KEYS.damage},${QUERY_KEYS.sort}`,
  );
  for (const key of SORT_KEYS) {
    check(
      `${key}: survives the round trip`,
      parseFilterState(serializeFilterState(state({ sort: key })), options).sort === key,
    );
  }
  check("an unknown sort falls back to the default", parse("sort=bogus").sort === DEFAULT_SORT);
  check(
    "an empty sort falls back to the default",
    parse("sort=").sort === DEFAULT_SORT && parse("sort").sort === DEFAULT_SORT,
  );
  check(
    "a sort that is not a single key is unknown — it is a view, not a list",
    parse("sort=name,easiest").sort === DEFAULT_SORT,
  );
  check(
    "a repeated sort keeps the first value the page offers",
    parse("sort=bogus&sort=easiest").sort === "easiest",
  );
  check(
    "an unknown sort does not take the valid filters beside it down",
    parse("class=sorceress&sort=bogus").class.join() === "sorceress",
  );
  check(
    "unknown filter values do not take a valid sort down",
    parse("class=tinker&sort=name").sort === "name",
  );
  check(
    "with no sort allow-list, every sort degrades to the default",
    parseFilterState(new URLSearchParams("sort=name"), allOptions(rows)).sort === DEFAULT_SORT,
  );

  // "For my stage" without a stage.
  const withoutTier = { ...options, sort: availableSorts(false) };
  const withTier = { ...options, sort: availableSorts(true) };
  check(
    "`stage` is dropped when the page has no tier preference to sort by",
    parse("sort=stage", withoutTier).sort === DEFAULT_SORT,
    parse("sort=stage", withoutTier).sort,
  );
  check("…and kept when it has one", parse("sort=stage", withTier).sort === "stage");
  check(
    "…while the four other sorts are offered either way",
    SORT_KEYS.filter((k) => k !== "stage").every(
      (k) => parse(`sort=${k}`, withoutTier).sort === k && parse(`sort=${k}`, withTier).sort === k,
    ),
  );
  // Mutation: a parser that trusts the URL would sort by a stage nobody chose.
  check(
    "control: a trusting parser keeps `stage` without a preference",
    new URLSearchParams("sort=stage").get("sort") === "stage" &&
      parse("sort=stage", withoutTier).sort !== "stage",
  );

  // A view, not a filter.
  check("a sort alone is the empty state", isEmptyState(state({ sort: "name" })));
  check("a sort is not an active filter", activeCount(state({ sort: "name" })) === 0);
  check("a sort is not an advanced filter", advancedCount(state({ sort: "name" })) === 0);
  check(
    "a sort never changes which builds match",
    SORT_KEYS.every(
      (key) =>
        slugs(filterBuilds(rows, state({ damage: ["cold"], sort: key }))).join() ===
        slugs(filterBuilds(rows, state({ damage: ["cold"] }))).join(),
    ),
  );
  check(
    "toggling a filter leaves the sort alone",
    toggleValue(state({ sort: "cheapest" }), "damage", "cold", options.damage).sort === "cheapest",
  );
  check(
    "the sort key is a language-independent slug like the others",
    /^[a-zA-Z]+$/.test(QUERY_KEYS.sort) && QUERY_KEYS.sort === "sort",
  );
}

// ===========================================================================
// The locale switcher, which shares this URL contract
// ===========================================================================

/*
 * The parameters are language-independent so that a filtered link means the
 * same thing in both languages. The header's language switch is the one place
 * on the site that rewrites the path under a reader who may be holding such a
 * link, and it dropped the query — switching language on a filtered catalogue
 * silently reset it to all 29 builds.
 *
 * Two invariants, both structural, because the fix has a trap in it: reading
 * the query with `useSearchParams` in a header component would make *every*
 * page on the site client-render up to its nearest Suspense boundary and cost
 * the static HTML its header. The query has to come from `window.location` in
 * the click handler instead, leaving the `href` a bare, crawlable path.
 */
console.log("\nThe language switch carries the filters, without de-statifying the site");
{
  const raw = readFileSync(join(process.cwd(), "components", "layout", "locale-switcher.tsx"), "utf8");
  /*
   * Comments out before any of the three scans below, and this one is not
   * hygiene — it is the difference between a rule and a tautology.
   *
   * The presence rule under it matched `location.search` against the raw file.
   * `components/layout/locale-switcher.tsx` carries a comment warning that
   * destructuring `globalThis.location` deletes that substring from the
   * executable code, and it names this assertion while doing so. So after the
   * destructuring — the exact defect this guards — the only two matches left in
   * the file were both prose, one of them the warning itself, and the gate went
   * green over the broken component. A gate its own explanation can satisfy is
   * measuring the explanation.
   *
   * The same stripper `scripts/build-toc-html.test.ts` uses on its source scans,
   * mirrored rather than invented: block comments out, and line comments out
   * only where `//` is not preceded by a colon, so a `https://` inside an
   * expression survives.
   */
  const withoutComments = (source: string) =>
    source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  const src = withoutComments(raw);
  // The import, not the prose — the comment above the component names the hook
  // it must not use, and a bare `includes` cannot tell the two apart.
  const imports = [...src.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']next\/navigation["']/g)]
    .flatMap((m) => m[1].split(",").map((s) => s.trim()));
  check(
    "the switcher does not import useSearchParams, which would client-render every page",
    !imports.includes("useSearchParams"),
    imports.join(","),
  );
  check(
    "…and reads the query from location in the handler instead",
    /location\.search/.test(src),
  );
  check(
    "the href stays the bare locale path, so crawlers and no-JS readers get one URL per page",
    /href=\{href\}/.test(src) && /const href = localePath\(/.test(src),
  );

  /*
   * Controls. The stripper has to remove enough to matter and little enough to
   * leave the code, and the middle two are M35b itself: a component that reads
   * the query only through a destructured `location`, whose prose still says
   * `location.search`, must fail the rule above rather than pass on the prose.
   */
  const DESTRUCTURED =
    "/* deletes the substring `location.search` from this file */\n" +
    "const { search, hash } = globalThis.location;\n";
  check(
    "control: the comment stripper removes both comment forms",
    withoutComments("/* a */ const a = 1; // b\nconst b = 2;").replace(/\s+/g, " ").trim() ===
      "const a = 1; const b = 2;",
    JSON.stringify(withoutComments("/* a */ const a = 1; // b\nconst b = 2;")),
  );
  check(
    "control: M35b — a destructured `location` no longer satisfies the presence rule",
    !/location\.search/.test(withoutComments(DESTRUCTURED)),
  );
  check(
    "control: …and the raw file it was written against would have passed on the comment alone",
    /location\.search/.test(DESTRUCTURED),
  );
  check(
    "control: the shipped form still satisfies it after stripping",
    /location\.search/.test(withoutComments("const search = globalThis.location.search; // read here\n")),
  );
  check(
    "control: a URL in code survives the line-comment strip",
    withoutComments('const u = "https://example.test/x";').includes("https://example.test/x"),
  );
}

// ===========================================================================
// Counting, clearing, and the empty state
// ===========================================================================

console.log("\nCount, active filters, clear and empty");
{
  check("an empty state is empty", isEmptyState(EMPTY_FILTER_STATE) && activeCount(EMPTY_FILTER_STATE) === 0);
  check(
    "each selected value counts once",
    activeCount(state({ damage: ["cold", "fire"], budget: ["low"] })) === 3,
  );
  check(
    "a combination with no builds behind it produces the empty state, not a crash",
    results(state({ class: [zeroCase.classSlug], damage: [zeroCase.missing] })) === 0,
  );
  check(
    "clearing restores the full catalogue",
    filterBuilds(rows, EMPTY_FILTER_STATE).length === rows.length,
  );

  /*
   * Two counts, because two surfaces badge them. The applied-chips row counts
   * every selection; "More filters (N)" counts only what is behind it — the
   * class chips are always visible, so a class ticked there is not something
   * the reader has to open a popover to find.
   */
  check(
    "the advanced groups are every group but class, in group order",
    ADVANCED_GROUPS.join() === FILTER_GROUPS.filter((g) => g !== "class").join(),
    ADVANCED_GROUPS.join(),
  );
  check("nothing advanced is selected in the empty state", advancedCount(EMPTY_FILTER_STATE) === 0);
  const mixed = state({ class: ["sorceress"], damage: ["cold", "fire"], budget: ["low"] });
  check(
    "a class selection is active but not advanced",
    activeCount(mixed) === 4 && advancedCount(mixed) === 3,
    `${activeCount(mixed)} active, ${advancedCount(mixed)} advanced`,
  );
  check("a class alone leaves the advanced badge empty", advancedCount(state({ class: ["sorceress"] })) === 0);
  check(
    "every advanced value counts once, whichever group it is in",
    advancedCount(state({ damage: ["cold"], difficulty: ["beginner"], budget: ["low"], goodAt: ["bossing"] })) === 4,
  );
}

// ===========================================================================
// Un-ticking never strands the reader on an empty list
// ===========================================================================

/*
 * Two rules the counts impose collide in exactly one case. Rule one: an option
 * whose conditional count is 0 is disabled, so no click produces an empty
 * list. Rule two: a selected option is always removable, even at 0 — a reader
 * who arrived by URL with `damage=cold,fire&class=necromancer` sees Cold at 0
 * and must be able to un-tick it. Un-ticking *Fire* there is the collision:
 * the plain toggle leaves `damage=cold`, and Cold contributes nothing, so the
 * list goes empty on a click — the very thing rule one exists to prevent.
 *
 * `toggleKeepingResults` is the reconciliation: when the value being removed
 * was the last one still contributing, the siblings at 0 go with it and the
 * group empties. Nothing else changes — adding never prunes, a removal that
 * leaves results never prunes, and from a list that is already empty nothing
 * is pruned, because that state was reached by URL and is being reported
 * honestly. The class and the damage types below come from the data.
 */
console.log("\nUn-ticking the last contributing value empties the group");
{
  const { classSlug, missing, present, classRows } = zeroCase;
  const arrived = state({ class: [classSlug], damage: [missing, present] });
  const counts = facetCounts(rows, arrived);
  check(
    `${classSlug} + ${missing},${present}: the state lists builds, so the reader is not on an empty page`,
    results(arrived) > 0 && results(arrived) === classRows.filter((r) => r.damageTypes.includes(present)).length,
    `${results(arrived)}`,
  );
  check(
    `…and ${missing} is shown at 0 while ${present} carries the results`,
    counts.damage[missing] === 0 && counts.damage[present] === results(arrived),
    `${counts.damage[missing]} / ${counts.damage[present]}`,
  );

  // Removing the value at 0 is an ordinary removal.
  const withoutMissing = toggleKeepingResults(arrived, "damage", missing, options.damage, rows);
  check(
    "un-ticking the value at 0 removes just it",
    withoutMissing.damage.join() === present && results(withoutMissing) === results(arrived),
    withoutMissing.damage.join(),
  );

  // Removing the last contributing value is the collision.
  const withoutPresent = toggleKeepingResults(arrived, "damage", present, options.damage, rows);
  check(
    "un-ticking the last contributing value empties the group instead of stranding the sibling at 0",
    withoutPresent.damage.length === 0,
    withoutPresent.damage.join(),
  );
  check(
    "…so the list shows the class's builds rather than nothing",
    results(withoutPresent) === classRows.length && results(withoutPresent) > 0,
    `${results(withoutPresent)}`,
  );
  check(
    "…and the other groups are untouched",
    withoutPresent.class.join() === classSlug && withoutPresent.sort === arrived.sort,
  );
  // The mutation the plan names (M8): the plain toggle is the stranding.
  const plain = toggleValue(arrived, "damage", present, options.damage);
  check(
    "control: the plain toggle leaves the sibling at 0 behind and the list empty",
    plain.damage.join() === missing && results(plain) === 0,
    `${plain.damage.join()} → ${results(plain)}`,
  );

  // Adding never prunes, whatever it adds.
  const added = toggleKeepingResults(state({ class: [classSlug] }), "damage", present, options.damage, rows);
  check(
    "adding a value with results is the plain toggle",
    JSON.stringify(added) === JSON.stringify(toggleValue(state({ class: [classSlug] }), "damage", present, options.damage)),
  );
  const addedZero = toggleKeepingResults(state({ class: [classSlug] }), "damage", missing, options.damage, rows);
  check(
    "adding a value at 0 — unreachable through a disabled option — is honoured, not pruned",
    addedZero.damage.join() === missing && results(addedZero) === 0,
    addedZero.damage.join(),
  );

  // A removal that leaves results is the plain toggle.
  const twoLive = state({ damage: [zeroCase.present, options.damage.find((d) => d !== present) ?? present] });
  check(
    "control: the second live damage type is a different one, so the removal below is not vacuous",
    twoLive.damage.length === 2 && twoLive.damage[0] !== twoLive.damage[1],
  );
  check(
    "un-ticking one of two contributing values is the plain toggle",
    JSON.stringify(toggleKeepingResults(twoLive, "damage", present, options.damage, rows)) ===
      JSON.stringify(toggleValue(twoLive, "damage", present, options.damage)),
  );

  // From an empty list, nothing is pruned.
  const empty = state({ class: [classSlug], damage: [missing], difficulty: [...options.difficulty] });
  check("control: that state is empty", results(empty) === 0);
  const stillEmpty = toggleKeepingResults(empty, "difficulty", options.difficulty[0], options.difficulty, rows);
  check(
    "from an already-empty list a removal is the plain toggle, so the state stays honest",
    JSON.stringify(stillEmpty) === JSON.stringify(toggleValue(empty, "difficulty", options.difficulty[0], options.difficulty)) &&
      stillEmpty.damage.join() === missing,
    JSON.stringify(stillEmpty),
  );

  // The canonical order the URL relies on survives the guarded toggle.
  const a = toggleKeepingResults(toggleKeepingResults(EMPTY_FILTER_STATE, "damage", "fire", options.damage, rows), "damage", "cold", options.damage, rows);
  const b = toggleKeepingResults(toggleKeepingResults(EMPTY_FILTER_STATE, "damage", "cold", options.damage, rows), "damage", "fire", options.damage, rows);
  check("toggle order does not change the URL under the guarded toggle either", filterQueryString(a) === filterQueryString(b), `${filterQueryString(a)} vs ${filterQueryString(b)}`);
}

// ===========================================================================
// Per-surface behaviour
// ===========================================================================

console.log("\nThe class page and the catalogue");
{
  /*
   * The groups the class page actually passes, not a copy of them.
   *
   * This assertion used to compare a literal declared two lines above itself,
   * which is true no matter what the page does — adding the class filter back
   * to the page would not have failed anything. The page now passes the
   * exported constant, so there is one list, and the source check below is what
   * stops the page quietly going back to a literal of its own.
   */
  const classGroups = CLASS_PAGE_FILTER_GROUPS;
  check(
    "the class page's groups exclude 'class'",
    !classGroups.includes("class"),
    classGroups.join(","),
  );
  check(
    "…and are otherwise every group the catalogue offers",
    classGroups.length === FILTER_GROUPS.length - 1 &&
      classGroups.every((g) => (FILTER_GROUPS as readonly string[]).includes(g)),
    classGroups.join(","),
  );
  {
    const page = readFileSync(
      join(process.cwd(), "app", "[lang]", "classes", "[slug]", "page.tsx"),
      "utf8",
    );
    check(
      "the class page passes that constant rather than a list of its own",
      /groups=\{CLASS_PAGE_FILTER_GROUPS\}/.test(page),
      page.match(/groups=\{[^}]*\}/)?.[0] ?? "no groups prop found",
    );
  }
  {
    const catalogue = readFileSync(join(process.cwd(), "app", "[lang]", "builds", "page.tsx"), "utf8");
    check(
      "the catalogue passes no groups prop at all, so it gets every group",
      !/groups=\{/.test(catalogue),
      catalogue.match(/groups=\{[^}]*\}/)?.[0] ?? "",
    );
  }

  for (const classSlug of classOrderOf(rows)) {
    const classRows = rows.filter((r) => r.classSlug === classSlug);
    check(
      `${classSlug}: a class filter there would offer exactly one option`,
      optionsFor(classRows, "class").length === 1,
    );
    check(
      `${classSlug}: that one option is carried by every build, so it is not offered`,
      narrowingOptionsFor(classRows, "class").length === 0,
    );
    if (classRows.length >= 2) {
      check(
        `${classSlug}: ${classRows.length} builds, filters offered`,
        shouldOfferFilters(classRows, classGroups),
      );
    }
  }
  check(
    "a one-build listing is not given filters",
    !shouldOfferFilters(rows.slice(0, 1), [...FILTER_GROUPS]),
  );
  /*
   * The case that caught the first version of this rule. Two builds identical
   * on every axis still produce eight "good at" options, so "two or more
   * options" said yes — to a panel where every box selects both builds. The
   * rule is now "some option leaves a row out", and this is why.
   */
  const clones = [rows[0], { ...rows[0], slug: "clone", name: "Clone" }];
  check(
    "a listing whose builds are identical on every axis is not given filters",
    !shouldOfferFilters(clones, [...FILTER_GROUPS]),
  );
  check(
    "control: those clones do offer two or more options, which is why counting them was not enough",
    FILTER_GROUPS.some((g) => optionsFor(clones, g).length >= 2) &&
      FILTER_GROUPS.every((g) => !isDiscriminating(clones, g)),
  );
  check(
    "every group the catalogue offers can actually narrow it",
    FILTER_GROUPS.every((g) => isDiscriminating(rows, g)),
    FILTER_GROUPS.filter((g) => !isDiscriminating(rows, g)).join(","),
  );
  check("the catalogue itself is given filters", shouldOfferFilters(rows, [...FILTER_GROUPS]));
}

// ===========================================================================
// No option that cannot change anything
// ===========================================================================

/*
 * The audit that produced this section found `Survivability (7)` offered on the
 * Paladin class page, which lists seven builds — a checkbox whose only possible
 * effect is to re-select every build already on the page.
 *
 * The old rule asked whether the *group* could narrow, and the Paladin "Good
 * at" group could: seven of its eight axes narrow. A group-level rule cannot
 * see one inert box inside a useful group, so the rule is now per option.
 */
console.log("\nNo offered option selects the whole listing");
{
  const surfaces: { label: string; rows: BuildRow[]; groups: FilterGroup[] }[] = [
    { label: "the catalogue", rows, groups: [...FILTER_GROUPS] },
    ...classOrderOf(rows).map((classSlug) => ({
      label: `the ${classSlug} page`,
      rows: rows.filter((r) => r.classSlug === classSlug),
      groups: ["damage", "difficulty", "budget", "goodAt"] as FilterGroup[],
    })),
  ];

  for (const surface of surfaces) {
    const offered = surface.groups
      .filter((g) => isDiscriminating(surface.rows, g))
      .flatMap((g) => narrowingOptionsFor(surface.rows, g).map((o) => ({ g, ...o })));
    const inert = offered.filter((o) => o.count >= surface.rows.length);
    check(
      `${surface.label}: no offered option is carried by every build`,
      inert.length === 0,
      inert.map((o) => `${o.g}:${o.value}(${o.count}/${surface.rows.length})`).join(","),
    );
    check(
      `${surface.label}: every offered option still matches at least one build`,
      offered.every((o) => o.count > 0),
    );
  }

  /*
   * The specific regression, named. Anti-vacuity comes free: the same option is
   * asserted to be *present* in the raw inventory, so this fails if the Paladin
   * ratings ever change rather than passing on an empty set.
   */
  const paladin = rows.filter((r) => r.classSlug === "paladin");
  const inventory = optionsFor(paladin, "goodAt").map((o) => `${o.value}(${o.count})`);
  const offeredGoodAt = narrowingOptionsFor(paladin, "goodAt").map((o) => o.value);
  check(
    `control: every one of the ${paladin.length} paladin builds is good at survivability, so the raw inventory offers it`,
    inventory.includes(`survivability(${paladin.length})`),
    inventory.join(" "),
  );
  check(
    "…and the offered set does not",
    !offeredGoodAt.includes("survivability"),
    offeredGoodAt.join(","),
  );
  check(
    "…while the seven axes that do narrow are still offered",
    offeredGoodAt.length === optionsFor(paladin, "goodAt").length - 1,
    `${offeredGoodAt.length}`,
  );
  check(
    "…and the group itself is still worth offering",
    isDiscriminating(paladin, "goodAt"),
  );

  // Mutation: the old group-level rule passes on exactly the case that was wrong.
  const groupLevelRule = (rs: readonly BuildRow[], g: FilterGroup) => {
    const o = optionsFor(rs, g);
    return o.length >= 2 && o.some((x) => x.count < rs.length);
  };
  check(
    "control: a group-level rule calls that group fine, which is how the inert box shipped",
    groupLevelRule(paladin, "goodAt") &&
      optionsFor(paladin, "goodAt").some((o) => o.count === paladin.length),
  );

  // Dropping an option must also drop it from what a URL may select.
  const paladinOptions = Object.fromEntries(
    (["damage", "difficulty", "budget", "goodAt"] as FilterGroup[]).map((g) => [
      g,
      narrowingOptionsFor(paladin, g).map((o) => o.value),
    ]),
  ) as Record<FilterGroup, string[]>;
  const stale = parseFilterState(new URLSearchParams("goodAt=survivability"), paladinOptions);
  check(
    "a stale link naming a dropped option is ignored rather than honoured",
    stale.goodAt.length === 0,
    stale.goodAt.join(","),
  );
  check(
    "…and lists the same builds either way, because the option matched all of them",
    filterBuilds(paladin, stale).length === paladin.length,
  );

  const clones = [rows[0], { ...rows[0], slug: "clone", name: "Clone" }];
  check(
    "identical builds produce no narrowing option in any group",
    FILTER_GROUPS.every((g) => narrowingOptionsFor(clones, g).length === 0),
  );
}

// ===========================================================================
// The row carries what the card and the sort need, copied from the build
// ===========================================================================

/*
 * Two fields joined the row with Phase 3, and neither is filtered on. The
 * ratings feed the sort orders and the card's two highest axes; the stage
 * picks feed the "At your stage" line, which R-FILT-2 defines as the first
 * pick of the first three slots of the saved tier's gear set. Both are
 * recomputed here from the build the row came from, through the same
 * `resolveRef` the gear tables use, so the row cannot quietly carry a summary
 * of its own.
 */
console.log("\nRows carry the ratings and the stage picks the card and the sort need");
{
  for (const locale of LOCALES) {
    const localeRows = rowsFor(locale);
    const catalogue = getBuilds(locale);
    check(
      `${locale}: every row carries all ${RATING_AXES.length} rating axes, equal to the build's`,
      catalogue.every((b, i) =>
        RATING_AXES.every((axis) => localeRows[i].ratings[axis] === b.ratings[axis]),
      ),
    );
    check(
      `${locale}: the ratings object carries nothing but the axes`,
      localeRows.every((r) => Object.keys(r.ratings).sort().join() === [...RATING_AXES].sort().join()),
    );
    const expectedPicks = (b: (typeof catalogue)[number], tier: (typeof PROGRESSION_TIERS)[number]) =>
      (b.gearSets.find((g) => g.tier === tier)?.slots.slice(0, 3) ?? [])
        .map((s) => s.picks[0])
        .map((p) => (p?.ref ? resolveRef(locale, p.ref).name : (p?.label ?? "")))
        .filter((name) => name.length > 0);
    check(
      `${locale}: every row carries a stage-picks entry for each of the ${PROGRESSION_TIERS.length} tiers`,
      localeRows.every((r) => PROGRESSION_TIERS.every((tier) => Array.isArray(r.stagePicks[tier]))),
    );
    check(
      `${locale}: the stage picks are the first pick of the first three slots, resolved by name`,
      catalogue.every((b, i) =>
        PROGRESSION_TIERS.every(
          (tier) => localeRows[i].stagePicks[tier].join("|") === expectedPicks(b, tier).join("|"),
        ),
      ),
    );
    check(
      `${locale}: no stage pick is empty, and none runs past three`,
      localeRows.every((r) =>
        PROGRESSION_TIERS.every(
          (tier) => r.stagePicks[tier].length <= 3 && r.stagePicks[tier].every((n) => n.trim().length > 0),
        ),
      ),
    );
    check(
      `${locale}: the stage line is not vacuous — every tier has three picks on some build`,
      PROGRESSION_TIERS.every((tier) => localeRows.some((r) => r.stagePicks[tier].length === 3)),
    );
  }

  /*
   * Catalogue names are invariant across locales (`resolveRef` says so), but a
   * described pick — a rare, a craft — is prose, and pt-BR builds carry it
   * translated. So the two locales' stage lines must agree wherever the pick is
   * a catalogued item and differ somewhere where it is not; equal everywhere
   * would mean the locale was ignored.
   */
  const en = rowsFor("en-us");
  const pt = rowsFor("pt-br");
  const enBuilds = getBuilds("en-us");
  const refOnly = (i: number, tier: (typeof PROGRESSION_TIERS)[number]) =>
    (enBuilds[i].gearSets.find((g) => g.tier === tier)?.slots.slice(0, 3) ?? []).every((s) => s.picks[0]?.ref);
  check(
    "where every pick is a catalogued item, both locales carry the same names",
    en.every((r, i) =>
      PROGRESSION_TIERS.every(
        (tier) => !refOnly(i, tier) || r.stagePicks[tier].join("|") === pt[i].stagePicks[tier].join("|"),
      ),
    ),
  );
  check(
    "…and a described pick reads differently in pt-BR, so the locale reached the row",
    en.some((r, i) => PROGRESSION_TIERS.some((tier) => r.stagePicks[tier].join("|") !== pt[i].stagePicks[tier].join("|"))),
  );
  /*
   * A slug is an identifier, not display text (R-I18N-3, which `hygiene` guards
   * in components). A row that copied `ref.slug` instead of resolving it would
   * pass every "not empty" check above; this is the one that sees it.
   */
  const SLUG_SHAPED = /^[a-z0-9]+(-[a-z0-9]+)+$/;
  check(
    "no stage pick is slug-shaped",
    en.every((r) => PROGRESSION_TIERS.every((tier) => r.stagePicks[tier].every((n) => !SLUG_SHAPED.test(n)))),
  );
  const slugged = enBuilds.flatMap((b) =>
    (b.gearSets.find((g) => g.tier === "bis")?.slots.slice(0, 3) ?? []).map((s) => s.picks[0]?.ref?.slug ?? ""),
  );
  check(
    "control: a row built from the refs' slugs would be caught by that rule",
    slugged.some((s) => SLUG_SHAPED.test(s)),
    slugged.filter((s) => SLUG_SHAPED.test(s)).slice(0, 3).join(","),
  );
}

// ===========================================================================
// Both locales
// ===========================================================================

console.log("\nBoth locales filter identically");
{
  for (const locale of LOCALES) {
    const localeRows = rowsFor(locale);
    check(
      `${locale}: the same slugs, in the same order`,
      localeRows.map((r) => r.slug).join() === rows.map((r) => r.slug).join(),
    );
    check(
      `${locale}: a language-independent link selects the same builds`,
      slugs(filterBuilds(localeRows, state({ damage: ["cold"], budget: ["low"] }))).join() ===
        slugs(filterBuilds(rows, state({ damage: ["cold"], budget: ["low"] }))).join(),
    );
    check(
      `${locale}: option values are the same slugs in both languages`,
      JSON.stringify(allOptions(localeRows)) === JSON.stringify(allOptions(rows)),
    );
    const t = dictionaryFor(locale);
    check(
      `${locale}: every filter string is translated, none hardcoded`,
      Object.values(t.builds.filters).every((s) => typeof s === "string" && s.length > 0),
    );
  }

  const en = dictionaryFor("en-us").builds.filters;
  const pt = dictionaryFor("pt-br").builds.filters;
  check(
    "the two dictionaries carry the same filter keys",
    JSON.stringify(Object.keys(en).sort()) === JSON.stringify(Object.keys(pt).sort()),
  );
  check(
    "the pt-BR strings are actually translated, not copied",
    Object.keys(en).filter((k) => en[k as keyof typeof en] !== pt[k as keyof typeof pt]).length >=
      Object.keys(en).length - 2,
  );
  check(
    "every placeholder survives translation",
    ([
      "resultsOne",
      "resultsMany",
      "removeOne",
      "goodAtNote",
      "showResultsOne",
      "showResultsMany",
    ] as const).every((k) => {
      const inEn = [...en[k].matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      const inPt = [...pt[k].matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      return JSON.stringify(inEn) === JSON.stringify(inPt);
    }),
  );
}

// ===========================================================================
// The mobile sheet's draft
// ===========================================================================

/*
 * Below `sm` the advanced groups move into a modal sheet, and the selections
 * made inside it are a *draft*: the count in the primary action follows every
 * tick, but the listing and the URL do not move until Apply, which writes one
 * history entry. That is a state machine with four transitions — open, toggle,
 * clear, apply — and one property that decides whether any of it works: the
 * draft must not share a single array with the applied state, or "cancel"
 * silently keeps the changes it claims to discard.
 *
 * All four live in `lib/builds/filter-sheet.ts` as pure functions over the same
 * `BuildFilterState` the URL carries, so the rules are exercised here rather
 * than only through a browser. `scripts/mobile-filter-sheet.test.ts` drives the
 * modal itself.
 *
 * The class chips and the sort live outside the sheet — always visible, on
 * both layouts — so the sheet's Clear and its badge leave them alone. A Clear
 * that emptied a chip the reader can see, and did not put there, would be the
 * same surprise the old Clear avoided for the search box.
 */
console.log("\nThe mobile sheet drafts, and only Apply commits");
{
  const applied = state({ damage: ["cold"], budget: ["low"] });

  // -- opening clones ------------------------------------------------------
  const draft = cloneFilterState(applied);
  check(
    "opening the sheet starts from the applied state",
    JSON.stringify(draft) === JSON.stringify(applied),
  );
  check(
    "…as a copy, not the same object",
    draft !== applied && FILTER_GROUPS.every((g) => draft[g] !== applied[g]),
  );
  check(
    "…including the groups that are empty, which is where aliasing hides",
    draft.class !== applied.class && draft.goodAt !== applied.goodAt,
  );

  // -- toggling touches the draft only -------------------------------------
  const ticked = toggleDraftValue(draft, "damage", "fire", options.damage, rows);
  check(
    "ticking a box adds it to the draft",
    ticked.damage.includes("fire") && ticked.damage.includes("cold"),
    ticked.damage.join(","),
  );
  check("…and the applied state is untouched", applied.damage.join(",") === "cold");
  check("…and the draft it came from is untouched", draft.damage.join(",") === "cold");
  check(
    "…and no array is shared with what it was derived from",
    FILTER_GROUPS.every((g) => ticked[g] !== draft[g] && ticked[g] !== applied[g]),
  );
  check(
    "ticking the same box again removes it",
    toggleDraftValue(ticked, "damage", "fire", options.damage, rows).damage.join(",") === "cold",
  );
  check(
    "the draft keeps the canonical option order however it is built",
    toggleDraftValue(state({ damage: ["fire"] }), "damage", "cold", options.damage, rows).damage.join(
      ",",
    ) === options.damage.filter((v) => v === "cold" || v === "fire").join(","),
  );
  /*
   * The sheet shows the draft's conditional counts and disables the zeros, so
   * the tick inside it has to follow the same reconciliation the live panel
   * does — a draft that stranded a zero-count sibling would apply as an empty
   * list, which is the click the counts exist to prevent.
   */
  {
    const arrived = state({ class: [zeroCase.classSlug], damage: [zeroCase.missing, zeroCase.present] });
    const unticked = toggleDraftValue(arrived, "damage", zeroCase.present, options.damage, rows);
    check(
      "un-ticking the last contributing value inside the sheet empties the group, as the live panel does",
      unticked.damage.length === 0 && results(unticked) > 0,
      unticked.damage.join(","),
    );
    check(
      "…and the draft it came from is still a copy",
      arrived.damage.length === 2 && FILTER_GROUPS.every((g) => unticked[g] !== arrived[g]),
    );
  }

  // -- cancel, and reopening -----------------------------------------------
  /*
   * Cancel is the absence of a write, so what it has to be proved against is
   * the applied state itself: after any amount of drafting, the thing the page
   * renders from must be the state it was rendering from before. Reopening then
   * starts from *that*, not from the abandoned draft.
   */
  const abandoned = toggleDraftValue(
    toggleDraftValue(draft, "damage", "fire", options.damage, rows),
    "budget",
    "high",
    options.budget,
    rows,
  );
  check(
    "an abandoned draft never reached the applied state",
    JSON.stringify(applied) === JSON.stringify(state({ damage: ["cold"], budget: ["low"] })),
  );
  check(
    "…and the results the page shows are still the applied ones",
    slugs(filterBuilds(rows, applied)).join() !==
      slugs(filterBuilds(rows, abandoned)).join() &&
      slugs(filterBuilds(rows, applied)).join() ===
        slugs(filterBuilds(rows, state({ damage: ["cold"], budget: ["low"] }))).join(),
  );
  check(
    "reopening starts from the applied state again, not from the abandoned draft",
    JSON.stringify(cloneFilterState(applied)) === JSON.stringify(applied),
  );

  // -- clear ---------------------------------------------------------------
  const cleared = clearFilterDraft(abandoned);
  check(
    "Clear empties every advanced group in the draft",
    ADVANCED_GROUPS.every((g) => cleared[g].length === 0),
  );
  {
    const outside = clearFilterDraft(state({ class: ["sorceress"], damage: ["fire"], sort: "name" }));
    check(
      "…and leaves the class chips alone, because they are outside the sheet",
      outside.class.join(",") === "sorceress" && outside.damage.length === 0,
      JSON.stringify(outside),
    );
    check("…and the sort, which is a view and not a filter", outside.sort === "name");
    check(
      "…without sharing an array with the draft it cleared",
      FILTER_GROUPS.every((g) => outside[g] !== abandoned[g]),
    );
  }
  check("…and does not touch the applied state", applied.damage.join(",") === "cold");
  check(
    "…so the page is only unfiltered once Clear is applied",
    filterBuilds(rows, applied).length < rows.length &&
      filterBuilds(rows, applyFilterDraft(cleared, options)).length === rows.length,
  );

  // -- apply ---------------------------------------------------------------
  const committed = applyFilterDraft(abandoned, options);
  check(
    "Apply produces exactly the state the draft described",
    committed.damage.join(",") === options.damage.filter((v) => ["cold", "fire"].includes(v)).join(",") &&
      committed.budget.join(",") ===
        options.budget.filter((v) => ["low", "high"].includes(v)).join(","),
    `${committed.damage.join(",")} | ${committed.budget.join(",")}`,
  );
  check(
    "…and it is what the URL would carry, so Apply and a pasted link agree",
    JSON.stringify(committed) ===
      JSON.stringify(
        parseFilterState(new URLSearchParams(filterQueryString(committed).slice(1)), options),
      ),
  );
  check(
    "Apply sanitises: a value this page does not offer is dropped",
    applyFilterDraft(state({ damage: ["cold", "not-an-element"] }), options).damage.join(",") ===
      "cold",
  );
  check(
    "Apply sanitises: a group the page does not offer is dropped",
    applyFilterDraft(state({ class: ["sorceress"], damage: ["cold"] }), {
      damage: options.damage,
    }).class.length === 0,
  );
  check(
    "Apply sanitises: a sort the page does not offer falls back to the default",
    applyFilterDraft(state({ damage: ["cold"], sort: "stage" }), { ...options, sort: availableSorts(false) }).sort ===
      DEFAULT_SORT,
  );
  check(
    "Apply keeps a sort the page does offer",
    applyFilterDraft(state({ damage: ["cold"], sort: "name" }), options).sort === "name",
  );
  check(
    "Apply is idempotent — applying its own output changes nothing",
    JSON.stringify(applyFilterDraft(committed, options)) === JSON.stringify(committed),
  );
  check(
    "Apply reuses the filtering rules rather than a second copy of them",
    slugs(filterBuilds(rows, committed)).join() ===
      slugs(filterBuilds(rows, state({ damage: ["cold", "fire"], budget: ["low", "high"] }))).join(),
  );

  // -- the trigger's badge --------------------------------------------------
  /*
   * The badge counts what the sheet can change. `activeCount` counts the class
   * chips too, and they are outside: a reader who has only tapped a class would
   * see "More filters (1)", open the sheet, and find nothing ticked and a Clear
   * that does nothing. So the badge is `advancedCount`, the same number the
   * desktop popover's trigger shows.
   */
  check(
    "the trigger's badge counts the groups the sheet holds",
    sheetFilterCount(state({ damage: ["cold", "fire"], budget: ["low"] })) === 3,
  );
  check(
    "…and not the class chips, which are outside it",
    sheetFilterCount(state({ class: ["sorceress"] })) === 0 && activeCount(state({ class: ["sorceress"] })) === 1,
  );
  check(
    "…and it is the same count the desktop trigger shows",
    sheetFilterCount(state({ class: ["sorceress"], damage: ["cold"], goodAt: ["bossing"] })) ===
      advancedCount(state({ class: ["sorceress"], damage: ["cold"], goodAt: ["bossing"] })),
  );

  // -- controls -------------------------------------------------------------
  /*
   * Anti-vacuity. A `cloneFilterState` that returned its argument would pass
   * every equality above, and a `toggleDraftValue` that mutated in place would
   * pass the ones that only read the result.
   */
  const identityClone = (s: BuildFilterState) => s;
  check(
    "control: an identity clone fails the aliasing assertion, so it means something",
    !FILTER_GROUPS.every((g) => identityClone(applied)[g] !== applied[g]),
  );
  const mutatingToggle = (s: BuildFilterState, g: FilterGroup, v: string) => {
    s[g].push(v);
    return s;
  };
  {
    const victim = cloneFilterState(applied);
    mutatingToggle(victim, "damage", "fire");
    check(
      "control: an in-place toggle changes the state it was handed",
      victim.damage.join(",") === "cold,fire",
    );
    check(
      "…while the real one does not, which is the whole difference",
      toggleDraftValue(cloneFilterState(applied), "damage", "fire", options.damage, rows) !== applied &&
        applied.damage.join(",") === "cold",
    );
  }
  check(
    "control: an Apply that skipped sanitising would keep the unknown value",
    state({ damage: ["cold", "not-an-element"] }).damage.length === 2,
  );
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
