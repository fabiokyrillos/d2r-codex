/**
 * The five sort orders of R-FILT-5, as pure functions over the rows the filter
 * returns.
 *
 * Sorting is a view. It runs after `filterBuilds`, never changes which rows
 * are present, and is carried in the URL as `?sort=` so a sorted, filtered
 * link means the same list to whoever opens it. Three rules hold it together:
 *
 * **"Recommended" is the incoming order, and the tier preference cannot move
 * it.** The rows arrive in the catalogue's editorial order and the default
 * hands them back as they came, whether or not a tier is saved — the PRD's
 * acceptance for R-FILT-5 is "default order unchanged with a preference set",
 * and the plan's mutation M4 (a default that follows the preference) is what
 * `scripts/build-sort.test.ts` keeps as its control.
 *
 * **Every order is stable, by construction rather than by engine.** Ties keep
 * the incoming order — two beginner, low-budget builds stay in the order the
 * editors put them — and the comparator says so itself by breaking ties on the
 * incoming index. `Array.prototype.sort` has been stable since ES2019, but a
 * property the code states is one a test can see removed.
 *
 * **The preference reaches exactly one order.** "For my stage" is the only sort
 * that takes the tier, and it is the only one the parser withholds when there
 * is none (`availableSorts`). Asked for it anyway with no tier, it returns the
 * incoming order rather than guessing a tier, so the two ways of arriving
 * without a preference — a withheld key, a direct call — agree.
 *
 * The stage criterion is a product hypothesis (R-FILT-5, PRD §17.7), fixed
 * here so it can be validated as one thing rather than argued about as
 * several. Early tiers — Starter, Nightmare, Early Hell — rank by difficulty
 * and then by budget, because a reader there wants what is easy to play and
 * cheap to assemble. Budget ranks by the solo-self-found rating, because that
 * tier is what a self-found character can reach. Optimized and BiS rank by
 * clear speed, because a reader with the gear wants the build that uses it.
 *
 * Client-safe: nothing here reaches `lib/registry`, `content/`, the search
 * barrel or the server dictionaries. The two rank lists come from
 * `lib/types/core`, which is a leaf.
 */
import { BUDGET_LEVELS, DIFFICULTY_RATINGS, type ProgressionTier } from "@/lib/types/core";
import { SORT_KEYS, type BuildRow, type SortKey } from "./filter";

/**
 * Which sorts a page may offer, and therefore what its URL may carry.
 *
 * The component passes this as `OptionSets.sort`, so a `?sort=stage` opened
 * with no preference is an unknown value and degrades to the default — the
 * same rule that drops a value for a group the page does not render.
 */
export function availableSorts(hasTier: boolean): readonly SortKey[] {
  return hasTier ? SORT_KEYS : SORT_KEYS.filter((key) => key !== "stage");
}

/**
 * Where a value sits in a canonical list, with anything unlisted last.
 *
 * Rows carry `difficulty` and `budget` as strings — the row is a plain object
 * the server serialises — so the rank is looked up rather than typed. Every
 * build carries a listed value; the fallback exists so a stray one could never
 * sort *first*, which is where `indexOf`'s `-1` would put it.
 */
function rankIn(list: readonly string[], value: string): number {
  const index = list.indexOf(value);
  return index === -1 ? list.length : index;
}

const difficultyRank = (row: BuildRow) => rankIn(DIFFICULTY_RATINGS, row.difficulty);
const budgetRank = (row: BuildRow) => rankIn(BUDGET_LEVELS, row.budget);

/**
 * The "For my stage" key for one row at one tier: lower sorts first, compared
 * element by element. Exposed so the test can hold the criterion against the
 * PRD's wording without going through the sort.
 */
export function stageRank(row: BuildRow, tier: ProgressionTier): number[] {
  switch (tier) {
    case "starter":
    case "nightmare":
    case "early-hell":
      return [difficultyRank(row), budgetRank(row)];
    case "budget":
      return [-row.ratings.soloSelfFound];
    case "optimized":
    case "bis":
      return [-row.ratings.clearSpeed];
  }
}

function compareKeys(a: readonly number[], b: readonly number[]): number {
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** Decorate with the incoming index, sort, break every tie on it. */
function stableSort(rows: readonly BuildRow[], compare: (a: BuildRow, b: BuildRow) => number): BuildRow[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => compare(a.row, b.row) || a.index - b.index)
    .map((entry) => entry.row);
}

/**
 * The rows in the requested order. Always a new array; never mutates `rows`.
 *
 * `locale` is only consulted by the name sort, where `Intl.Collator` with base
 * sensitivity folds case and accents — "Ápex" and "apex" tie, and tie in the
 * incoming order — so the pt-BR list sorts by Portuguese rules and the
 * English one by English rules, from the same key in the URL.
 */
export function sortBuilds(
  rows: readonly BuildRow[],
  sort: SortKey,
  tier: ProgressionTier | null,
  locale: string,
): BuildRow[] {
  switch (sort) {
    case "recommended":
      return [...rows];
    case "stage":
      if (tier === null) return [...rows];
      return stableSort(rows, (a, b) => compareKeys(stageRank(a, tier), stageRank(b, tier)));
    case "easiest":
      return stableSort(rows, (a, b) => difficultyRank(a) - difficultyRank(b));
    case "cheapest":
      return stableSort(rows, (a, b) => budgetRank(a) - budgetRank(b));
    case "name": {
      const collator = new Intl.Collator(locale, { sensitivity: "base" });
      return stableSort(rows, (a, b) => collator.compare(a.name, b.name));
    }
  }
}
