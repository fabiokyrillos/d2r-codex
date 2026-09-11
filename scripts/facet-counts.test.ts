/**
 * Proof that the conditional counts are the ones R-FILT-4 defines, and that
 * they keep every click off an empty list.
 *
 * The definition is short and every assertion here is one of its consequences:
 * the count beside an option is **the number of builds the list would show if
 * that option were the only selection in its group**, with every other group's
 * selection applied. Three things follow, and each was a defect once:
 *
 *   1. **The option's own group is left out of the calculation.** With Cold
 *      ticked, Fire must be counted as "fire builds", not "fire builds that are
 *      also cold" — inside a group the boxes widen, so the number beside an
 *      unticked box has to say what ticking it would *add to*, and the number
 *      beside a ticked one has to stay put. The variant that forgets this is the
 *      plan's mutation M1, kept below as the control.
 *   2. **The other groups are applied.** With Necromancer ticked, Cold reads 0,
 *      which is the fact the reader wanted — this class has no cold build —
 *      rather than the catalogue-wide 8 the static inventory would print. The
 *      static count is mutation M3, the second control.
 *   3. **Every count > 0 is a safe click, and every selected option comes off
 *      safely.** Asserted over a sampled set of reachable states rather than a
 *      hand-picked few: the empty state, every class, every damage type, every
 *      class × damage pair, and two hundred states from a seeded generator, so
 *      the run is the same every time and a failure can be replayed.
 *
 * The class with no build of some damage type is found in the data, not named;
 * the plan's Necromancer + Cold is the case today, and the day that changes the
 * assertion has to move with the catalogue.
 *
 * `facetCounts` is pure over plain rows — the same code the browser runs, with
 * nothing behind the client boundary — so this runs in `check`, not
 * `check:built`. Run with `npm run test:facet-counts`.
 */
import { getBuilds } from "../lib/registry";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "../lib/i18n/config";
import {
  EMPTY_FILTER_STATE,
  FILTER_GROUPS,
  SORT_KEYS,
  facetCounts,
  filterBuilds,
  optionsFor,
  toggleKeepingResults,
  toggleValue,
  type BuildFilterState,
  type BuildRow,
  type FacetCounts,
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
const results = (s: BuildFilterState, rs: readonly BuildRow[] = rows) => filterBuilds(rs, s).length;
const options = Object.fromEntries(
  FILTER_GROUPS.map((g) => [g, optionsFor(rows, g).map((o) => o.value)]),
) as Record<FilterGroup, string[]>;
/** The rows a value would select on its own, within the other groups' context. */
const alone = (s: BuildFilterState, group: FilterGroup, value: string) =>
  results({ ...s, [group]: [value] });
const describe = (s: BuildFilterState) =>
  FILTER_GROUPS.filter((g) => s[g].length > 0)
    .map((g) => `${g}=${s[g].join(",")}`)
    .join("&") || "(empty)";
/** Counts as a comparable string, independent of key order. */
const canonical = (counts: Record<string, number>) =>
  Object.entries(counts)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}:${v}`)
    .join(" ");
const canonicalAll = (counts: FacetCounts) => FILTER_GROUPS.map((g) => `${g}[${canonical(counts[g])}]`).join(" ");

/**
 * A class with no build of one damage type and at least one of another, found
 * rather than named — see the header.
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
// The definition, directly
// ===========================================================================

console.log("\nA count is what the option would select on its own, in the other groups' context");
{
  const counts = facetCounts(rows, EMPTY_FILTER_STATE);
  check(
    "every group is present in the result",
    FILTER_GROUPS.every((g) => counts[g] !== undefined),
  );
  check(
    "with nothing selected, every value present in the rows gets a key",
    FILTER_GROUPS.every(
      (g) => Object.keys(counts[g]).sort().join() === [...options[g]].sort().join(),
    ),
  );
  check(
    "with nothing selected, the counts are the inventory's",
    FILTER_GROUPS.every((g) => optionsFor(rows, g).every((o) => counts[g][o.value] === o.count)),
  );
  check(
    "with nothing selected, a single-valued group's counts sum to the whole catalogue",
    (["class", "difficulty", "budget"] as const).every(
      (g) => Object.values(counts[g]).reduce((n, c) => n + c, 0) === rows.length,
    ),
  );

  const narrowed = state({ class: [zeroCase.classSlug], budget: [...options.budget] });
  const inContext = facetCounts(rows, narrowed);
  check(
    "with a class selected, every damage value still gets a key, zeros included",
    Object.keys(inContext.damage).sort().join() === [...options.damage].sort().join(),
    Object.keys(inContext.damage).join(","),
  );
  check(
    "…and a single-valued group's counts sum to the rows the other groups leave",
    (["difficulty", "budget"] as const).every(
      (g) =>
        Object.values(inContext[g]).reduce((n, c) => n + c, 0) ===
        results({ ...narrowed, [g]: [] }),
    ),
  );
  check(
    "…and no count exceeds those rows",
    FILTER_GROUPS.every((g) =>
      Object.values(inContext[g]).every((c) => c <= results({ ...narrowed, [g]: [] })),
    ),
  );
  check(
    "the definition holds for every group and value: the count is what that value alone would select",
    FILTER_GROUPS.every((g) =>
      options[g].every((v) => inContext[g][v] === alone(narrowed, g, v)),
    ),
  );
}

// ===========================================================================
// Own-group exclusion
// ===========================================================================

console.log("\nA group's own selection does not narrow its own counts");
{
  const cold = state({ damage: ["cold"] });
  const withCold = facetCounts(rows, cold);
  const withoutAny = facetCounts(rows, EMPTY_FILTER_STATE);
  check(
    "with Cold ticked, the damage counts are the unselected ones",
    canonical(withCold.damage) === canonical(withoutAny.damage),
    canonical(withCold.damage),
  );
  const fireAlone = rows.filter((r) => r.damageTypes.includes("fire")).length;
  const coldAndFire = rows.filter((r) => r.damageTypes.includes("fire") && r.damageTypes.includes("cold")).length;
  check(
    "…so Fire reads as the fire builds, not the builds that are cold and fire",
    withCold.damage.fire === fireAlone && fireAlone > coldAndFire,
    `${withCold.damage.fire} vs ${fireAlone} (cold∧fire ${coldAndFire})`,
  );
  check(
    "…which is what ticking Fire would widen the list to",
    results(state({ damage: ["cold", "fire"] })) ===
      rows.filter((r) => r.damageTypes.includes("cold") || r.damageTypes.includes("fire")).length,
  );
  check(
    "…while the other groups' counts do narrow to the cold builds",
    FILTER_GROUPS.filter((g) => g !== "damage").every((g) =>
      options[g].every((v) => withCold[g][v] === alone(cold, g, v) && withCold[g][v] <= withoutAny[g][v]),
    ),
  );
  check(
    "a ticked value's own count stays put when its siblings are ticked",
    facetCounts(rows, state({ damage: ["cold", "fire"] })).damage.cold === withCold.damage.cold,
  );

  /*
   * M1. The variant counts the rows the state already selects — every group
   * applied, its own included — which is the number a naive implementation
   * produces first. It agrees with the real function on the empty state and
   * disagrees the moment a group has a selection.
   */
  const withoutOwnGroupExclusion = (rs: readonly BuildRow[], s: BuildFilterState): FacetCounts => {
    const selected = filterBuilds(rs, s);
    return Object.fromEntries(
      FILTER_GROUPS.map((g) => [
        g,
        Object.fromEntries(optionsFor(rs, g).map((o) => [o.value, optionsFor(selected, g).find((x) => x.value === o.value)?.count ?? 0])),
      ]),
    ) as FacetCounts;
  };
  check(
    "control: the variant agrees on the empty state, so the disagreement below is about exclusion",
    canonicalAll(withoutOwnGroupExclusion(rows, EMPTY_FILTER_STATE)) === canonicalAll(withoutAny),
  );
  check(
    "control: M1 — without own-group exclusion, Fire under Cold reads as the cold-and-fire builds",
    withoutOwnGroupExclusion(rows, cold).damage.fire === coldAndFire &&
      withoutOwnGroupExclusion(rows, cold).damage.fire !== withCold.damage.fire,
    `${withoutOwnGroupExclusion(rows, cold).damage.fire} vs ${withCold.damage.fire}`,
  );
}

// ===========================================================================
// AND across groups, OR inside one
// ===========================================================================

console.log("\nAND across groups, OR inside a group");
{
  const { classSlug, missing, present, classRows } = zeroCase;
  const byClass = facetCounts(rows, state({ class: [classSlug] }));
  check(
    `${classSlug} has no ${missing} build, and the count says so`,
    byClass.damage[missing] === 0,
    `${byClass.damage[missing]}`,
  );
  check(
    `…and its ${present} count is its ${present} builds`,
    byClass.damage[present] === classRows.filter((r) => r.damageTypes.includes(present)).length &&
      byClass.damage[present] > 0,
  );
  check(
    "every damage count under a class is that class's builds carrying it",
    options.damage.every(
      (d) => byClass.damage[d] === classRows.filter((r) => r.damageTypes.includes(d)).length,
    ),
  );
  check(
    "the zero is real: selecting both lists nothing",
    results(state({ class: [classSlug], damage: [missing] })) === 0,
  );
  check(
    "the other class counts stay at the catalogue's, because class is their own group",
    options.class.every((c) => byClass.class[c] === rows.filter((r) => r.classSlug === c).length),
  );

  // OR inside a group: a second value's count is unaffected by the first.
  const one = facetCounts(rows, state({ class: [classSlug], damage: [present] }));
  check(
    `with ${present} ticked under ${classSlug}, ${missing} still reads 0 and ${present} still reads its own builds`,
    one.damage[missing] === 0 && one.damage[present] === byClass.damage[present],
  );
  check(
    "every damage count under the class is unchanged by ticking one of them",
    canonical(one.damage) === canonical(byClass.damage),
  );

  /*
   * M3. `optionsFor` counts the whole inventory — right for the empty state,
   * and the number that was printed beside every box before this phase. Under
   * any active filter it says a click will find builds it will not.
   */
  const staticCount = optionsFor(rows, "damage").find((o) => o.value === missing)?.count ?? -1;
  check(
    `control: M3 — the static count offers ${staticCount} ${missing} builds under ${classSlug}, the conditional count 0`,
    staticCount > 0 && byClass.damage[missing] === 0,
    `${staticCount} vs ${byClass.damage[missing]}`,
  );
  const inventory = canonical(Object.fromEntries(optionsFor(rows, "damage").map((o) => [o.value, o.count])));
  check(
    "control: the static count agrees with the conditional one only while nothing is selected",
    canonical(facetCounts(rows, EMPTY_FILTER_STATE).damage) === inventory &&
      canonical(byClass.damage) !== inventory,
  );
}

// ===========================================================================
// A selected option at 0 stays, and comes off safely
// ===========================================================================

console.log("\nA selected option at 0 stays selected and stays removable");
{
  const { classSlug, missing, present, classRows } = zeroCase;
  const arrived = state({ class: [classSlug], damage: [missing, present] });
  const counts = facetCounts(rows, arrived);
  check(
    "the option at 0 is still in the state — the count does not edit the URL",
    arrived.damage.includes(missing) && counts.damage[missing] === 0,
  );
  check("…and the list is not empty, because its sibling contributes", results(arrived) > 0);
  const off = toggleKeepingResults(arrived, "damage", missing, options.damage, rows);
  check(
    "un-ticking the option at 0 removes it and keeps the results",
    !off.damage.includes(missing) && results(off) === results(arrived),
  );
  const last = toggleKeepingResults(arrived, "damage", present, options.damage, rows);
  check(
    "un-ticking its contributing sibling empties the group rather than leaving the list empty",
    last.damage.length === 0 && results(last) === classRows.length,
    `${last.damage.join(",")} → ${results(last)}`,
  );
  check(
    "control: the plain toggle would have stranded the reader on an empty list",
    results(toggleValue(arrived, "damage", present, options.damage)) === 0,
  );
}

// ===========================================================================
// The invariant, over a sampled set of reachable states
// ===========================================================================

/*
 * Reachable means what the UI can produce: any subset of each group's offered
 * values, in any combination, whether or not the combination has results —
 * because a URL can carry one that does not, and the invariant has a clause
 * for it. The generator is seeded so the two hundred random states are the
 * same on every run; a failure names the state, and rerunning reproduces it.
 */
console.log("\nEvery count > 0 is a safe click; every selected option comes off safely");
{
  /** mulberry32: small, seeded, and good enough to pick subsets with. */
  const seeded = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const random = seeded(0x2f3);
  const randomState = (): BuildFilterState => {
    const s = state();
    for (const g of FILTER_GROUPS) {
      // Most groups empty most of the time, so the sample looks like real use.
      if (random() < 0.45) continue;
      s[g] = options[g].filter(() => random() < 0.35);
    }
    return s;
  };

  const sample: BuildFilterState[] = [
    EMPTY_FILTER_STATE,
    ...options.class.map((c) => state({ class: [c] })),
    ...options.damage.map((d) => state({ damage: [d] })),
    ...options.class.flatMap((c) => options.damage.map((d) => state({ class: [c], damage: [d] }))),
    ...Array.from({ length: 200 }, randomState),
  ];
  const withResults = sample.filter((s) => results(s) > 0).length;
  const emptyOnes = sample.length - withResults;
  check(
    `the sample has ${sample.length} states, ${withResults} with results and ${emptyOnes} without`,
    sample.length > 200 && withResults > 100 && emptyOnes > 0,
  );
  check(
    "control: the random states are not all empty, so the invariant is not tested on nothing",
    sample.slice(-200).filter((s) => FILTER_GROUPS.some((g) => s[g].length > 0)).length > 100,
  );

  const unsafeOn: string[] = [];
  const unsafeOff: string[] = [];
  const definition: string[] = [];
  const zerosThatStrand: string[] = [];
  let clicksOn = 0;
  let clicksOff = 0;
  let zeros = 0;
  for (const s of sample) {
    const counts = facetCounts(rows, s);
    const before = results(s);
    for (const g of FILTER_GROUPS) {
      for (const v of options[g]) {
        if (counts[g][v] !== alone(s, g, v)) definition.push(`${describe(s)} ${g}:${v}`);
        if (s[g].includes(v)) {
          clicksOff++;
          const after = results(toggleKeepingResults(s, g, v, options[g], rows));
          if (before > 0 && after === 0) unsafeOff.push(`${describe(s)} −${g}:${v}`);
        } else if (counts[g][v] > 0) {
          clicksOn++;
          if (results(toggleKeepingResults(s, g, v, options[g], rows)) === 0) unsafeOn.push(`${describe(s)} +${g}:${v}`);
        } else {
          zeros++;
          // A 0 is the reason the option is disabled: ticking it cannot add a
          // build — the list stays as it is, or empties if the group was empty.
          const plain = results(toggleValue(s, g, v, options[g]));
          if (plain !== (s[g].length === 0 ? 0 : before)) zerosThatStrand.push(`${describe(s)} +${g}:${v}`);
        }
      }
    }
  }
  check(
    `the definition holds on every state and option in the sample`,
    definition.length === 0,
    definition.slice(0, 3).join(" | "),
  );
  check(
    `ticking any option with a count > 0 lists something (${clicksOn} clicks)`,
    unsafeOn.length === 0 && clicksOn > 1000,
    unsafeOn.slice(0, 3).join(" | "),
  );
  check(
    `un-ticking any selected option lists something, unless the list was already empty (${clicksOff} clicks)`,
    unsafeOff.length === 0 && clicksOff > 100,
    unsafeOff.slice(0, 3).join(" | "),
  );
  check(
    `ticking an option at 0 never adds a build, which is why it is disabled (${zeros} zeros)`,
    zerosThatStrand.length === 0 && zeros > 0,
    zerosThatStrand.slice(0, 3).join(" | "),
  );
  check(
    "the sort never changes a count",
    sample.slice(0, 40).every((s) =>
      SORT_KEYS.every((sort) => canonicalAll(facetCounts(rows, { ...s, sort })) === canonicalAll(facetCounts(rows, s))),
    ),
  );
}

// ===========================================================================
// Both locales
// ===========================================================================

console.log("\nBoth locales count identically");
{
  const probes = [
    EMPTY_FILTER_STATE,
    state({ class: [zeroCase.classSlug] }),
    state({ damage: ["cold"], budget: ["low"] }),
    state({ class: [zeroCase.classSlug], damage: [zeroCase.missing, zeroCase.present] }),
  ];
  for (const locale of LOCALES) {
    const localeRows = rowsFor(locale);
    check(
      `${locale}: the counts are the same numbers under the same slugs`,
      probes.every((s) => canonicalAll(facetCounts(localeRows, s)) === canonicalAll(facetCounts(rows, s))),
    );
  }
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
