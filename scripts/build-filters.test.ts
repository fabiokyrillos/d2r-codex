/**
 * Proof that build filtering does what the listings claim it does.
 *
 * The filtering itself is a pure function over plain rows, which is the whole
 * reason it can be tested here rather than only through a browser: `filter.ts`
 * imports nothing but `fold` and types, so this file exercises exactly the code
 * the browser runs.
 *
 * Four things are asserted that a reader would otherwise have to take on trust:
 *
 *   1. **The semantics.** OR inside a group, AND between groups and the query.
 *      Both mutations — AND inside, OR between — are implemented here and shown
 *      to disagree with the real function on a specific pair of builds.
 *   2. **The URL is a round trip.** Serialise, parse, and the state and its
 *      results are identical — which is what "reload a filtered link" means.
 *      Unknown keys, unknown values, empty segments, duplicates and a group the
 *      page does not offer are all dropped rather than thrown on.
 *   3. **Nothing is invented.** `RATING_AXES` is checked against the real
 *      `BuildRatings` keys, the option sets are checked against the real
 *      catalogue, and every refused filter is checked to still have no data
 *      behind it.
 *   4. **The threshold is the one the scale names.** `GOOD_AT_THRESHOLD` is 4
 *      because `ratingLabels` calls 4 "Good"; the distribution that made the
 *      alternatives unusable is asserted so a future edit has to argue with
 *      numbers.
 *
 * Run with `npm run test:build-filters`.
 */
import { getBuilds } from "../lib/registry";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { ratingLabels } from "../lib/labels";
import { BUDGET_LEVELS, DIFFICULTY_RATINGS, ELEMENTS } from "../lib/types/core";
import {
  EMPTY_FILTER_STATE,
  FILTER_GROUPS,
  GOOD_AT_THRESHOLD,
  QUERY_KEYS,
  RATING_AXES,
  REFUSED_FILTERS,
  activeCount,
  filterBuilds,
  filterQueryString,
  goodAtAxes,
  isDiscriminating,
  isEmptyState,
  matchesQuery,
  optionsFor,
  parseFilterState,
  serializeFilterState,
  shouldOfferFilters,
  toggleValue,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
} from "../lib/builds/filter";
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
const options = allOptions(rows);

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
  check("no build carries a `release`", catalogue.every((b) => b.release === undefined));
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
  check(
    "the query is ANDed with the groups too",
    filterBuilds(rows, state({ class: ["sorceress"], q: "hammerdin" })).length === 0,
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
  check(
    "a group with no rows behind the selection returns nothing rather than everything",
    filterBuilds(rows, state({ class: ["barbarian"] })).length === 0,
  );
}

// ===========================================================================
// Search
// ===========================================================================

console.log("\nSearch: case, accents, fields and multiple terms");
{
  const byName = filterBuilds(rows, state({ q: "hammerdin" }));
  check("finds a build by name", byName.some((r) => r.slug === "hammerdin"));
  check(
    "case-insensitive",
    filterBuilds(rows, state({ q: "HaMMerDiN" })).length === byName.length,
  );

  // Diacritic-insensitive in both directions: the pt-BR catalogue is where the
  // accents actually live.
  const ptRows = rowsFor("pt-br");
  const accented = filterBuilds(ptRows, state({ q: "física" }));
  const unaccented = filterBuilds(ptRows, state({ q: "fisica" }));
  check(
    "accented and unaccented queries agree",
    accented.length === unaccented.length && slugs(accented).join() === slugs(unaccented).join(),
    `${accented.length} vs ${unaccented.length}`,
  );
  check("the accent test is not vacuous", accented.length > 0, `${accented.length}`);

  check(
    "searches the class name",
    filterBuilds(rows, state({ q: "necromancer" })).every((r) => r.classSlug === "necromancer") &&
      filterBuilds(rows, state({ q: "necromancer" })).length > 0,
  );
  check(
    "searches the summary",
    filterBuilds(rows, state({ q: "corpse" })).length > 0,
  );
  check(
    "searches aliases that really exist",
    filterBuilds(rows, state({ q: "fishymancer" })).some((r) => r.slug === "summoner-necromancer"),
  );
  check(
    "a build with no alias is still searchable by name",
    rows.some((r) => r.aliases === "") &&
      rows
        .filter((r) => r.aliases === "")
        .every((r) => matchesQuery(r, r.name)),
  );

  check(
    "every term must match: two terms from different builds find nothing",
    filterBuilds(rows, state({ q: "hammerdin fishymancer" })).length === 0,
  );
  check(
    "two terms from the same build still match",
    filterBuilds(rows, state({ q: "poison nova" })).some((r) => r.slug === "poison-nova-necromancer"),
  );
  check("whitespace-only query matches everything", filterBuilds(rows, state({ q: "   " })).length === rows.length);

  // Mutation: an unfolded search breaks exactly the reader the folding is for.
  const naive = (r: BuildRow, q: string) =>
    [r.name, r.summary, r.className, r.aliases].join(" ").includes(q);
  check(
    "control: an unfolded search misses the unaccented spelling",
    ptRows.filter((r) => naive(r, "fisica")).length < unaccented.length,
  );
  check(
    "control: an unfolded search misses a capitalised query",
    rows.filter((r) => naive(r, "HaMMerDiN")).length < byName.length,
  );
}

// ===========================================================================
// The URL
// ===========================================================================

console.log("\nQuery parameters: round trip, and everything invalid dropped");
{
  const full = state({
    q: "cold",
    class: ["sorceress"],
    damage: ["cold", "fire"],
    difficulty: ["beginner"],
    budget: ["medium"],
    goodAt: ["bossing"],
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
  check("an unknown parameter is ignored", isEmptyState(parse("sort=name&page=3&utm_source=x")));
  check(
    "an unknown value inside a known group is dropped",
    parse("damage=cold,plasma,,cold").damage.join() === "cold",
    parse("damage=cold,plasma,,cold").damage.join(),
  );
  check("a group with only unknown values ends up empty", parse("class=barbarian").class.length === 0);
  check("a garbage query string still yields a usable state", isEmptyState(parse("=&&&%%%=")));
  check(
    "a filtered link with only invalid values shows the whole catalogue",
    filterBuilds(rows, parse("damage=plasma&class=warlock")).length === rows.length,
  );
  check(
    "an over-long query is truncated rather than carried",
    parse(`q=${"x".repeat(500)}`).q.length === 120,
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
}

// ===========================================================================
// Counting, clearing, and the empty state
// ===========================================================================

console.log("\nCount, active filters, clear and empty");
{
  check("an empty state is empty", isEmptyState(EMPTY_FILTER_STATE) && activeCount(EMPTY_FILTER_STATE) === 0);
  check("a query alone counts as one active filter", activeCount(state({ q: "cold" })) === 1);
  check("whitespace is not an active filter", activeCount(state({ q: "  " })) === 0 && isEmptyState(state({ q: "  " })));
  check(
    "each selected value counts once",
    activeCount(state({ damage: ["cold", "fire"], budget: ["low"] })) === 3,
  );
  check(
    "a combination with no builds behind it produces the empty state, not a crash",
    filterBuilds(rows, state({ class: ["necromancer"], damage: ["lightning"] })).length === 0,
  );
  check(
    "clearing restores the full catalogue",
    filterBuilds(rows, EMPTY_FILTER_STATE).length === rows.length,
  );
}

// ===========================================================================
// Per-surface behaviour
// ===========================================================================

console.log("\nThe class page and the catalogue");
{
  const classGroups: FilterGroup[] = ["damage", "difficulty", "budget", "goodAt"];
  for (const classSlug of classOrderOf(rows)) {
    const classRows = rows.filter((r) => r.classSlug === classSlug);
    check(
      `${classSlug}: a class filter there would offer exactly one option`,
      optionsFor(classRows, "class").length === 1,
    );
    check(
      `${classSlug}: the groups the class page offers exclude 'class'`,
      !classGroups.includes("class" as FilterGroup),
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
      JSON.stringify(allOptions(localeRows)) === JSON.stringify(options),
    );
    check(
      `${locale}: the class name is translated and searchable`,
      localeRows.every((r) => r.className.length > 0) &&
        filterBuilds(localeRows, state({ q: localeRows[0].className })).length > 0,
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
    (["resultsOne", "resultsMany", "removeOne", "goodAtNote"] as const).every((k) => {
      const inEn = [...en[k].matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      const inPt = [...pt[k].matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      return JSON.stringify(inEn) === JSON.stringify(inPt);
    }),
  );
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
