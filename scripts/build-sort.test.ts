/**
 * Proof that the five sort orders are the ones R-FILT-5 publishes, and that the
 * tier preference reaches exactly one of them.
 *
 * The sort is a view over the filtered rows. Three properties are asserted
 * that a reader — or the owner's session validating the "For my stage"
 * hypothesis — would otherwise have to take on trust:
 *
 *   1. **"Recommended" is the incoming order, and the preference cannot move
 *      it.** The catalogue's editorial order is what the page shows by default
 *      whether or not a tier is saved, because R-FILT-5 says the default is
 *      unchanged by the preference. The variant that lets the preference reorder
 *      the default is the plan's mutation M4, kept as the control.
 *   2. **Every order is stable and total over the rows.** Ties keep the
 *      incoming order — so two beginner, low-budget builds stay in the order the
 *      editors put them — and no sort adds, drops or duplicates a row. Stability
 *      is a property of the code, not of the engine: the comparator breaks ties
 *      on the incoming index, and an unstable variant is shown to disagree.
 *   3. **"For my stage" is the published criterion, per tier.** The criterion
 *      is written out here a second time, independently of `stageRank`, so a
 *      quiet change to either has to explain itself to the other. It is a
 *      product hypothesis (PRD §17.7); the test pins what the hypothesis *is*,
 *      not whether it is right.
 *
 * `lib/builds/sort.ts` is pure over plain rows, so this runs in `check`, not
 * `check:built`. Run with `npm run test:build-sort`.
 */
import { getBuilds } from "../lib/registry";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "../lib/i18n/config";
import {
  BUDGET_LEVELS,
  DIFFICULTY_RATINGS,
  PROGRESSION_TIERS,
  type ProgressionTier,
} from "../lib/types/core";
import { DEFAULT_SORT, SORT_KEYS, type BuildRow, type SortKey } from "../lib/builds/filter";
import { availableSorts, sortBuilds, stageRank } from "../lib/builds/sort";
import { buildRows } from "../lib/builds/rows";

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
const order = (rs: readonly BuildRow[]) => rs.map((r) => r.slug).join(",");
const sorted = (rs: readonly BuildRow[]) => rs.map((r) => r.slug).sort().join(",");
const tiers: (ProgressionTier | null)[] = [null, ...PROGRESSION_TIERS];

// ---------------------------------------------------------------------------
// The criterion, written a second time
// ---------------------------------------------------------------------------

const difficultyRank = (r: BuildRow) => DIFFICULTY_RATINGS.indexOf(r.difficulty as (typeof DIFFICULTY_RATINGS)[number]);
const budgetRank = (r: BuildRow) => BUDGET_LEVELS.indexOf(r.budget as (typeof BUDGET_LEVELS)[number]);
/** R-FILT-5, per tier, as the PRD words it. */
const published = (r: BuildRow, tier: ProgressionTier): number[] => {
  switch (tier) {
    case "starter":
    case "nightmare":
    case "early-hell":
      return [difficultyRank(r), budgetRank(r)];
    case "budget":
      return [-r.ratings.soloSelfFound];
    case "optimized":
    case "bis":
      return [-r.ratings.clearSpeed];
  }
};
const lexicographic = (a: number[], b: number[]) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
};
/** The reference: decorate with the incoming index, sort, break ties on it. */
const stableBy = (rs: readonly BuildRow[], key: (r: BuildRow) => number[]) =>
  rs
    .map((r, i) => ({ r, i, k: key(r) }))
    .sort((a, b) => lexicographic(a.k, b.k) || a.i - b.i)
    .map((x) => x.r);
/** A comparator-based reference for the name sort, same tie rule. */
const stableByCompare = (rs: readonly BuildRow[], compare: (a: BuildRow, b: BuildRow) => number) =>
  rs
    .map((r, i) => ({ r, i }))
    .sort((a, b) => compare(a.r, b.r) || a.i - b.i)
    .map((x) => x.r);

// ===========================================================================
// What is on offer
// ===========================================================================

console.log("\nThe sorts on offer");
{
  check(
    "with a preference, every sort key is offered, in the canonical order",
    availableSorts(true).join() === SORT_KEYS.join(),
    availableSorts(true).join(),
  );
  check(
    "without one, 'stage' is the only key withheld",
    availableSorts(false).join() === SORT_KEYS.filter((k) => k !== "stage").join(),
    availableSorts(false).join(),
  );
  check(
    "'stage' really is one of the keys, so withholding it is not vacuous",
    (SORT_KEYS as readonly string[]).includes("stage"),
  );
  check(
    "the default is offered either way",
    availableSorts(true).includes(DEFAULT_SORT) && availableSorts(false).includes(DEFAULT_SORT),
  );
  check("the default is 'recommended'", DEFAULT_SORT === "recommended");
}

// ===========================================================================
// Recommended: the incoming order, with or without a preference
// ===========================================================================

console.log("\nRecommended is the incoming order, and the preference cannot move it");
{
  check(
    "recommended returns the rows in the order they arrived",
    order(sortBuilds(rows, "recommended", null, DEFAULT_LOCALE)) === order(rows),
  );
  check(
    "…identically for every saved tier",
    PROGRESSION_TIERS.every(
      (tier) => order(sortBuilds(rows, "recommended", tier, DEFAULT_LOCALE)) === order(rows),
    ),
  );
  check(
    "…as a new array, so a caller cannot reorder the page's rows through it",
    sortBuilds(rows, "recommended", null, DEFAULT_LOCALE) !== rows,
  );

  /*
   * M4. The preference is allowed to *enable* a sort, never to change the
   * default. A component that applied the stage criterion whenever a tier was
   * saved would pass every assertion about "stage" and fail this one.
   */
  const recommendedByTier = (rs: readonly BuildRow[], tier: ProgressionTier | null) =>
    tier === null ? [...rs] : stableBy(rs, (r) => published(r, tier));
  check(
    "control: M4 — a default that follows the preference disagrees with the real one on some tier",
    PROGRESSION_TIERS.some((tier) => order(recommendedByTier(rows, tier)) !== order(sortBuilds(rows, "recommended", tier, DEFAULT_LOCALE))),
  );
  check(
    "control: …while agreeing when there is no preference, so the disagreement is the preference's doing",
    order(recommendedByTier(rows, null)) === order(sortBuilds(rows, "recommended", null, DEFAULT_LOCALE)),
  );
}

// ===========================================================================
// For my stage
// ===========================================================================

console.log("\nFor my stage: the published criterion, per tier");
{
  check(
    "with no preference, 'stage' is the incoming order — the parser withholds it, and the sort degrades the same way",
    order(sortBuilds(rows, "stage", null, DEFAULT_LOCALE)) === order(rows),
  );
  for (const tier of PROGRESSION_TIERS) {
    const got = sortBuilds(rows, "stage", tier, DEFAULT_LOCALE);
    check(
      `${tier}: stageRank is the published criterion for every row`,
      rows.every((r) => stageRank(r, tier).join() === published(r, tier).join()),
      rows.map((r) => `${r.slug}:${stageRank(r, tier).join("/")}`).slice(0, 3).join(" "),
    );
    check(
      `${tier}: the order is non-decreasing in that rank, with ties in incoming order`,
      order(got) === order(stableBy(rows, (r) => published(r, tier))),
    );
    check(
      `${tier}: the order actually differs from the incoming one`,
      order(got) !== order(rows),
    );
  }

  // What each criterion puts first, derived from the rows rather than named.
  const early = sortBuilds(rows, "stage", "starter", DEFAULT_LOCALE);
  const easiestRank = Math.min(...rows.map(difficultyRank));
  const cheapestAmongEasiest = Math.min(...rows.filter((r) => difficultyRank(r) === easiestRank).map(budgetRank));
  check(
    "starter puts the easiest, cheapest builds first",
    difficultyRank(early[0]) === easiestRank && budgetRank(early[0]) === cheapestAmongEasiest,
    `${early[0].slug}: ${early[0].difficulty}/${early[0].budget}`,
  );
  check(
    "…and the three early tiers share one order",
    order(early) === order(sortBuilds(rows, "stage", "nightmare", DEFAULT_LOCALE)) &&
      order(early) === order(sortBuilds(rows, "stage", "early-hell", DEFAULT_LOCALE)),
  );
  const budget = sortBuilds(rows, "stage", "budget", DEFAULT_LOCALE);
  check(
    "budget puts the best solo-self-found rating first, and never a lower one before a higher",
    budget[0].ratings.soloSelfFound === Math.max(...rows.map((r) => r.ratings.soloSelfFound)) &&
      budget.every((r, i) => i === 0 || budget[i - 1].ratings.soloSelfFound >= r.ratings.soloSelfFound),
  );
  const bis = sortBuilds(rows, "stage", "bis", DEFAULT_LOCALE);
  check(
    "bis puts the fastest clear first, and never a slower one before a faster",
    bis[0].ratings.clearSpeed === Math.max(...rows.map((r) => r.ratings.clearSpeed)) &&
      bis.every((r, i) => i === 0 || bis[i - 1].ratings.clearSpeed >= r.ratings.clearSpeed),
  );
  check(
    "…and optimized shares bis's order",
    order(bis) === order(sortBuilds(rows, "stage", "optimized", DEFAULT_LOCALE)),
  );
  check(
    "the two rating criteria are different orders, so the tier really chooses",
    order(budget) !== order(bis),
  );
  check(
    "a tier is ignored by every sort but 'stage'",
    SORT_KEYS.filter((k) => k !== "stage").every((k) =>
      PROGRESSION_TIERS.every(
        (tier) => order(sortBuilds(rows, k, tier, DEFAULT_LOCALE)) === order(sortBuilds(rows, k, null, DEFAULT_LOCALE)),
      ),
    ),
  );
}

// ===========================================================================
// Easiest, cheapest
// ===========================================================================

console.log("\nEasiest and cheapest");
{
  const easiest = sortBuilds(rows, "easiest", null, DEFAULT_LOCALE);
  check(
    "easiest is non-decreasing in difficulty, ties in incoming order",
    order(easiest) === order(stableBy(rows, (r) => [difficultyRank(r)])),
  );
  check(
    "…and it moves something",
    order(easiest) !== order(rows),
  );
  const beginners = rows.filter((r) => difficultyRank(r) === Math.min(...rows.map(difficultyRank)));
  check(
    "…with the easiest builds first, in the order they arrived",
    order(easiest.slice(0, beginners.length)) === order(beginners) && beginners.length > 1,
    `${beginners.length} at the easiest difficulty`,
  );
  check(
    "…and the difficulty ranks used are the model's, in its order",
    DIFFICULTY_RATINGS.join() === "beginner,moderate,advanced,expert",
  );

  const cheapest = sortBuilds(rows, "cheapest", null, DEFAULT_LOCALE);
  check(
    "cheapest is non-decreasing in budget, ties in incoming order",
    order(cheapest) === order(stableBy(rows, (r) => [budgetRank(r)])),
  );
  check("…and it moves something", order(cheapest) !== order(rows));
  const lows = rows.filter((r) => budgetRank(r) === Math.min(...rows.map(budgetRank)));
  check(
    "…with the cheapest builds first, in the order they arrived",
    order(cheapest.slice(0, lows.length)) === order(lows) && lows.length > 1,
    `${lows.length} at the lowest budget`,
  );
  check(
    "…and the budget ranks used are the model's, in its order",
    BUDGET_LEVELS.join() === "low,medium,high,extreme",
  );
}

// ===========================================================================
// Name
// ===========================================================================

console.log("\nName: collated, not compared by code point");
{
  for (const locale of LOCALES) {
    const localeRows = rowsFor(locale);
    const collator = new Intl.Collator(locale, { sensitivity: "base" });
    check(
      `${locale}: the name order is the locale's collation, ties in incoming order`,
      order(sortBuilds(localeRows, "name", null, locale)) ===
        order(stableByCompare(localeRows, (a, b) => collator.compare(a.name, b.name))),
    );
    check(`${locale}: …and it moves something`, order(sortBuilds(localeRows, "name", null, locale)) !== order(localeRows));
  }

  /*
   * The catalogue's names happen to carry no accents and no case clashes today
   * — measured, not assumed: the check below says so — so the collation rule
   * is exercised on a fixture that has both. Base sensitivity means "ápex" and
   * "Apex" tie and keep their incoming order; a code-point comparison puts
   * every accented name after every unaccented one.
   */
  const names = rows.map((r) => r.name);
  check(
    "control: the real names carry no accents, so the fixture below is not redundant",
    names.every((n) => /^[\x20-\x7e]+$/.test(n)),
  );
  const fixture: BuildRow[] = ["Zeal", "éclair", "Apex", "ápex", "Eclair"].map((name, i) => ({
    ...rows[0],
    slug: `fixture-${i}`,
    name,
  }));
  const byName = sortBuilds(fixture, "name", null, DEFAULT_LOCALE).map((r) => r.name);
  check(
    "accents and case are ignored, and equal names keep their incoming order",
    byName.join("|") === "Apex|ápex|éclair|Eclair|Zeal",
    byName.join("|"),
  );
  const byCodePoint = [...fixture].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)).map((r) => r.name);
  check(
    "control: a code-point comparison puts the accented names last",
    byCodePoint.join("|") !== byName.join("|") && byCodePoint.indexOf("ápex") > byCodePoint.indexOf("Zeal"),
    byCodePoint.join("|"),
  );
}

// ===========================================================================
// Every sort is a permutation, and every sort is stable
// ===========================================================================

console.log("\nNo sort changes the set of rows, and every sort is stable");
{
  const combos = SORT_KEYS.flatMap((sort) => tiers.map((tier) => ({ sort, tier })));
  check(
    `every sort × tier (${combos.length}) returns exactly the rows it was given`,
    combos.every(({ sort, tier }) => {
      const got = sortBuilds(rows, sort, tier, DEFAULT_LOCALE);
      return got.length === rows.length && sorted(got) === sorted(rows);
    }),
  );
  check(
    "…without mutating the input",
    combos.every(({ sort, tier }) => {
      const before = order(rows);
      sortBuilds(rows, sort, tier, DEFAULT_LOCALE);
      return order(rows) === before;
    }),
  );
  check(
    "…and never as the same array",
    combos.every(({ sort, tier }) => sortBuilds(rows, sort, tier, DEFAULT_LOCALE) !== rows),
  );

  /*
   * Stability, shown rather than assumed. The cheapest sort has the most ties
   * — four budgets over the whole catalogue — so an unstable variant that
   * reverses the order inside a tie has the most room to disagree.
   */
  const unstable = (rs: readonly BuildRow[], key: (r: BuildRow) => number[]) =>
    rs
      .map((r, i) => ({ r, i, k: key(r) }))
      .sort((a, b) => lexicographic(a.k, b.k) || b.i - a.i)
      .map((x) => x.r);
  const largestTie = Math.max(...BUDGET_LEVELS.map((b) => rows.filter((r) => r.budget === b).length));
  check(
    `control: the cheapest sort has ties to be stable over (largest block ${largestTie})`,
    largestTie > 1,
  );
  check(
    "control: an unstable variant disagrees with the real cheapest order",
    order(unstable(rows, (r) => [budgetRank(r)])) !== order(sortBuilds(rows, "cheapest", null, DEFAULT_LOCALE)),
  );
  check(
    "control: …and with the real stage order on a tie-heavy tier",
    order(unstable(rows, (r) => published(r, "budget"))) !== order(sortBuilds(rows, "stage", "budget", DEFAULT_LOCALE)),
  );
  check(
    "a sort applied twice is the same order — sorting is idempotent because it is stable",
    combos.every(({ sort, tier }) => {
      const once = sortBuilds(rows, sort, tier, DEFAULT_LOCALE);
      return order(sortBuilds(once, sort, tier, DEFAULT_LOCALE)) === order(once);
    }),
  );
}

// ===========================================================================
// Both locales
// ===========================================================================

console.log("\nBoth locales sort identically where the data is language-independent");
{
  const keys: SortKey[] = ["recommended", "stage", "easiest", "cheapest"];
  for (const locale of LOCALES) {
    const localeRows = rowsFor(locale);
    check(
      `${locale}: the four data-driven sorts give the same slug order as ${DEFAULT_LOCALE}`,
      keys.every((sort) =>
        tiers.every((tier) => order(sortBuilds(localeRows, sort, tier, locale)) === order(sortBuilds(rows, sort, tier, DEFAULT_LOCALE))),
      ),
    );
  }
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
