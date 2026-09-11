/**
 * Proof that the empty state offers the reader a way out that is true.
 *
 * With conditional counts no click produces an empty list, so the empty state
 * is reached by URL — a stale link, a hand-edited one, a language switch that
 * carried filters the other catalogue cannot satisfy. R-FILT-4 gives it two
 * offers and each has a rule here, because an offer that does nothing, or
 * does something other than it says, is worse than the empty list:
 *
 *   1. **"Remove last filter" is undo, and undo is only offered when there is
 *      something to undo.** The component logs every `pushState` it writes as
 *      a `Decision`; `undoAvailable` says whether the *current* URL is the
 *      result of the last one. After Back the top of the log no longer matches,
 *      and the offer disappears rather than stepping the reader somewhere
 *      unrelated. The variant that ignores the current URL is the control.
 *   2. **"Remove {group}" names the group whose removal brings builds back, and
 *      the near builds are labelled with exactly what they ignore.** The class
 *      is never the group: a reader who chose Necromancer and got nothing is
 *      shown Necromancer builds ignoring Cold, not cold builds of some other
 *      class. Where one group's removal suffices the first in group order is
 *      named; where none does, groups are dropped cumulatively until builds
 *      appear, and every dropped group is in the label.
 *
 * The class and the values in every case are found in the data, not named, so
 * the file follows the catalogue rather than failing when it moves.
 *
 * `lib/builds/empty-state.ts` is pure over plain rows, so this runs in `check`,
 * not `check:built`. Run with `npm run test:empty-state`.
 */
import { getBuilds } from "../lib/registry";
import { DEFAULT_LOCALE, type Locale } from "../lib/i18n/config";
import {
  EMPTY_FILTER_STATE,
  FILTER_GROUPS,
  filterBuilds,
  filterQueryString,
  optionsFor,
  type BuildFilterState,
  type BuildRow,
  type FilterGroup,
} from "../lib/builds/filter";
import { nearBuilds, undoAvailable, zeroingGroups, type Decision } from "../lib/builds/empty-state";
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
const valuesOf = (r: BuildRow, g: FilterGroup): string[] => {
  switch (g) {
    case "class":
      return [r.classSlug];
    case "damage":
      return r.damageTypes;
    case "difficulty":
      return [r.difficulty];
    case "budget":
      return [r.budget];
    case "goodAt":
      return r.goodAt;
  }
};

// ---------------------------------------------------------------------------
// Fixtures found in the data
// ---------------------------------------------------------------------------

/** Per class: the values of each advanced group that none of its builds carry. */
const missingByClass = classOrderOf(rows).map((classSlug) => {
  const classRows = rows.filter((r) => r.classSlug === classSlug);
  const missing = Object.fromEntries(
    FILTER_GROUPS.filter((g) => g !== "class").map((g) => [
      g,
      options[g].filter((v) => !classRows.some((r) => valuesOf(r, g).includes(v))),
    ]),
  ) as Record<Exclude<FilterGroup, "class">, string[]>;
  return { classSlug, classRows, missing };
});

/** A class with no build of some damage type. */
const oneZero = missingByClass.find((c) => c.missing.damage.length > 0);
/**
 * A class lacking a damage type *and* a difficulty or budget, for the
 * cumulative case. "Good at" is left out of the search so it can play the
 * selected-but-not-needed group in that case.
 */
const twoZeros = missingByClass
  .map((c) => {
    const second = (["difficulty", "budget"] as const).find((g) => c.missing[g].length > 0);
    return second ? { ...c, second, secondValue: c.missing[second][0] } : null;
  })
  .find((c) => c !== null && c.missing.damage.length > 0);
/** A class with more than three builds and a missing damage type, so the cap at three shows. */
const bigZero = missingByClass.find((c) => c.classRows.length > 3 && c.missing.damage.length > 0);
/**
 * A class, a damage type and a difficulty where each pair has builds but the
 * triple has none — so either single removal would help, and the first in
 * group order has to be the one named.
 */
const pairOnly = (() => {
  for (const { classSlug, classRows } of missingByClass) {
    for (const d of options.damage) {
      for (const x of options.difficulty) {
        const withD = classRows.filter((r) => r.damageTypes.includes(d));
        const withX = classRows.filter((r) => r.difficulty === x);
        if (withD.length > 0 && withX.length > 0 && !withD.some((r) => r.difficulty === x)) {
          return { classSlug, damage: d, difficulty: x };
        }
      }
    }
  }
  return null;
})();

check("fixture: a class with no build of some damage type exists", oneZero !== undefined);
check("fixture: a class lacking a damage type and a later group's value exists", twoZeros !== undefined && twoZeros !== null);
check("fixture: a class with more than three builds and a missing damage type exists", bigZero !== undefined);
check("fixture: a class × damage × difficulty triple that only zeroes together exists", pairOnly !== null);
if (!oneZero || !twoZeros || !bigZero || !pairOnly) {
  console.error("\nThe catalogue no longer carries the shapes these cases need; the fixtures above say which.");
  process.exit(1);
}

// ===========================================================================
// Undo
// ===========================================================================

console.log("\n'Remove last filter' is undo, offered only when the current URL is the last decision's");
{
  const a = filterQueryString(state({ class: ["sorceress"] }));
  const b = filterQueryString(state({ class: ["sorceress"], damage: ["cold"] }));
  const log: Decision[] = [
    { from: "", to: a },
    { from: a, to: b },
  ];
  check("with nothing logged, there is nothing to undo", !undoAvailable([], "") && !undoAvailable([], a));
  check("right after a decision, its result is the current URL and undo is offered", undoAvailable(log, b));
  check("after Back, the current URL is the last decision's origin and undo is withdrawn", !undoAvailable(log, a));
  check(
    "an earlier decision's result does not count — only the top of the log",
    !undoAvailable([...log, { from: b, to: "" }], b),
  );
  check(
    "a bare URL can be a decision's result too (clearing everything)",
    undoAvailable([...log, { from: b, to: "" }], ""),
  );
  check("a URL the log never produced is not undoable", !undoAvailable(log, filterQueryString(state({ damage: ["fire"] }))));

  // Mutation: an undo that only asks whether the log is non-empty offers
  // `history.back()` after Back, which walks the reader out of the page.
  const ignoringCurrent = (l: readonly Decision[]) => l.length > 0;
  check(
    "control: an undo that ignores the current URL is still offered after Back",
    ignoringCurrent(log) && !undoAvailable(log, a),
  );
}

// ===========================================================================
// The group that zeroed
// ===========================================================================

console.log("\n'Remove {group}' names the group whose removal brings builds back");
{
  check("a state with results has no zeroing group", zeroingGroups(rows, EMPTY_FILTER_STATE).length === 0);
  check(
    "…nor does a narrowed state that still lists something",
    zeroingGroups(rows, state({ class: [oneZero.classSlug] })).length === 0,
  );

  // One group suffices.
  const single = state({ class: [oneZero.classSlug], damage: [oneZero.missing.damage[0]] });
  check("control: the single-group case is empty", results(single) === 0);
  check(
    `${oneZero.classSlug} + ${oneZero.missing.damage[0]}: damage is the group, not class`,
    zeroingGroups(rows, single).join() === "damage",
    zeroingGroups(rows, single).join(),
  );

  // Class is never named, even when it is the only selection.
  check(
    "a class with no builds at all names nothing — the class is never the offer",
    zeroingGroups(rows, state({ class: ["tinker"] })).length === 0,
  );
  check(
    "…and neither is anything when the class is the only thing wrong",
    zeroingGroups(rows, state({ class: ["tinker"], damage: ["cold"] })).length === 0 &&
      results(state({ damage: ["cold"] })) > 0,
  );

  // Two singles would work: the first in group order is named.
  const either = state({ class: [pairOnly.classSlug], damage: [pairOnly.damage], difficulty: [pairOnly.difficulty] });
  check("control: the either-group case is empty", results(either) === 0);
  check(
    "control: …and removing either group alone brings builds back",
    results({ ...either, damage: [] }) > 0 && results({ ...either, difficulty: [] }) > 0,
  );
  check(
    `${pairOnly.classSlug} + ${pairOnly.damage} + ${pairOnly.difficulty}: the first group in order is named, alone`,
    zeroingGroups(rows, either).join() === "damage",
    zeroingGroups(rows, either).join(),
  );

  // No single removal helps: groups come off cumulatively, in order.
  const cumulative = state({
    class: [twoZeros.classSlug],
    damage: [twoZeros.missing.damage[0]],
    [twoZeros.second]: [twoZeros.secondValue],
  });
  check("control: the cumulative case is empty", results(cumulative) === 0);
  check(
    "control: …and no single group's removal helps",
    results({ ...cumulative, damage: [] }) === 0 && results({ ...cumulative, [twoZeros.second]: [] }) === 0,
  );
  check(
    `${twoZeros.classSlug} + ${twoZeros.missing.damage[0]} + ${twoZeros.second}=${twoZeros.secondValue}: both groups are named, in order`,
    zeroingGroups(rows, cumulative).join() === `damage,${twoZeros.second}`,
    zeroingGroups(rows, cumulative).join(),
  );
  check(
    "…and removing exactly those brings builds back",
    results({ ...cumulative, damage: [], [twoZeros.second]: [] }) === twoZeros.classRows.length,
  );

  // Cumulative removal stops as soon as builds appear.
  const three = state({
    class: [twoZeros.classSlug],
    damage: [twoZeros.missing.damage[0]],
    [twoZeros.second]: [twoZeros.secondValue],
    goodAt: [...options.goodAt],
  });
  check(
    "control: with every axis ticked, 'good at' is selected but not what zeroed the list",
    three.goodAt.length > 1 && results({ ...three, damage: [], [twoZeros.second]: [] }) > 0,
  );
  check(
    "a group that was not needed is not named, even when selected",
    zeroingGroups(rows, three).join() === `damage,${twoZeros.second}`,
    zeroingGroups(rows, three).join(),
  );

  // The result never includes the class and only ever names selected groups.
  const probes = [single, either, cumulative, three, state({ class: ["tinker"] })];
  check(
    "no answer names the class or an unselected group",
    probes.every((s) => zeroingGroups(rows, s).every((g) => g !== "class" && s[g].length > 0)),
  );
  check(
    "every answer is a set of distinct groups in group order",
    probes.every((s) => {
      const got = zeroingGroups(rows, s);
      return got.join() === FILTER_GROUPS.filter((g) => got.includes(g)).join();
    }),
  );

  // Mutation: a rule that lets the class be the group answers the single case
  // with "class", because it comes first in group order.
  const classToo = (rs: readonly BuildRow[], s: BuildFilterState): FilterGroup[] => {
    const selected = FILTER_GROUPS.filter((g) => s[g].length > 0);
    const first = selected.find((g) => filterBuilds(rs, { ...s, [g]: [] }).length > 0);
    return first ? [first] : [];
  };
  check(
    "control: a rule that may name the class names it first, which is the offer the PRD refuses",
    classToo(rows, single).join() === "class" && zeroingGroups(rows, single).join() !== "class",
  );
}

// ===========================================================================
// Near builds
// ===========================================================================

console.log("\nNear builds: at most three, same class, labelled with what they ignore");
{
  check("with results there is nothing near to show", nearBuilds(rows, EMPTY_FILTER_STATE) === null);
  check(
    "when nothing helps there is nothing near to show either",
    nearBuilds(rows, state({ class: ["tinker"] })) === null,
  );

  const single = state({ class: [bigZero.classSlug], damage: [bigZero.missing.damage[0]] });
  const near = nearBuilds(rows, single);
  check("the single-group case has near builds", near !== null);
  if (near) {
    check("the label is exactly the group removed", near.ignoring.join() === "damage", near.ignoring.join());
    check("at most three", near.rows.length === 3, `${near.rows.length}`);
    check(
      `all of the reader's class (${bigZero.classSlug}), so the offer keeps the one choice the reader made`,
      near.rows.every((r) => r.classSlug === bigZero.classSlug),
    );
    const expected = filterBuilds(rows, { ...single, damage: [] }).slice(0, 3);
    check(
      "in the incoming (recommended) order, first three",
      near.rows.map((r) => r.slug).join() === expected.map((r) => r.slug).join(),
      near.rows.map((r) => r.slug).join(),
    );
    check(
      "control: the class has more than three builds, so the cap did something",
      bigZero.classRows.length > 3,
    );
  }

  // The cumulative case: the label carries every group removed.
  const cumulative = state({
    class: [twoZeros.classSlug],
    damage: [twoZeros.missing.damage[0]],
    [twoZeros.second]: [twoZeros.secondValue],
  });
  const nearTwo = nearBuilds(rows, cumulative);
  check("the cumulative case has near builds", nearTwo !== null);
  if (nearTwo) {
    check(
      "…labelled with both groups, in order",
      nearTwo.ignoring.join() === `damage,${twoZeros.second}`,
      nearTwo.ignoring.join(),
    );
    check(
      "…and they are the class's builds with exactly those groups ignored",
      nearTwo.rows.map((r) => r.slug).join() ===
        filterBuilds(rows, { ...cumulative, damage: [], [twoZeros.second]: [] })
          .slice(0, 3)
          .map((r) => r.slug)
          .join(),
    );
    check(
      "…each of the reader's class",
      nearTwo.rows.every((r) => r.classSlug === twoZeros.classSlug) && nearTwo.rows.length > 0,
    );
  }

  // A class with fewer than three builds shows what it has.
  const smallest = missingByClass
    .filter((c) => c.missing.damage.length > 0)
    .sort((a, b) => a.classRows.length - b.classRows.length)[0];
  const nearSmall = nearBuilds(rows, state({ class: [smallest.classSlug], damage: [smallest.missing.damage[0]] }));
  check(
    `a class with ${smallest.classRows.length} builds shows min(3, that many)`,
    nearSmall !== null && nearSmall.rows.length === Math.min(3, smallest.classRows.length),
    `${nearSmall?.rows.length}`,
  );

  // A class no build carries cannot be kept, so nothing is offered — never
  // another class's builds under the reader's class.
  const noSuchClass = state({ damage: [twoZeros.missing.damage[0]], [twoZeros.second]: [twoZeros.secondValue], class: ["tinker"] });
  check(
    "a class no build carries yields no offer rather than another class's builds",
    nearBuilds(rows, noSuchClass) === null,
  );

  /*
   * With no class selected the near builds come from the whole catalogue —
   * "class kept" means an empty class selection stays empty. The case needs a
   * pair of advanced values no build in the catalogue carries together; it is
   * searched for, and the checks are only emitted when it exists, because a
   * check over a fixture that is not there would pass on nothing.
   */
  const catalogueZero = (() => {
    for (const g of ["difficulty", "budget"] as const) {
      for (const d of options.damage) {
        for (const v of options[g]) {
          if (!rows.some((r) => r.damageTypes.includes(d) && valuesOf(r, g).includes(v))) return { damage: d, group: g, value: v };
        }
      }
    }
    return null;
  })();
  if (catalogueZero) {
    const noClass = state({ damage: [catalogueZero.damage], [catalogueZero.group]: [catalogueZero.value] });
    const nearNoClass = nearBuilds(rows, noClass);
    check(
      `${catalogueZero.damage} + ${catalogueZero.group}=${catalogueZero.value}: with no class selected, the near builds are the catalogue's, ignoring damage`,
      results(noClass) === 0 &&
        nearNoClass !== null &&
        nearNoClass.ignoring.join() === "damage" &&
        nearNoClass.rows.map((r) => r.slug).join() ===
          filterBuilds(rows, { ...noClass, damage: [] }).slice(0, 3).map((r) => r.slug).join(),
      nearNoClass?.rows.map((r) => r.slug).join(),
    );
  } else {
    console.log("       (no damage × difficulty/budget pair is empty catalogue-wide; the no-class case has no fixture today)");
  }

  // Mutation: near builds that drop the class too show the reader a different
  // class — exactly the "nearby" that is not near.
  const anyClass = (rs: readonly BuildRow[], s: BuildFilterState) => {
    const ignoring = zeroingGroups(rs, s);
    if (ignoring.length === 0) return null;
    const relaxed = { ...s, class: [] as string[] };
    for (const g of ignoring) relaxed[g] = [];
    return filterBuilds(rs, relaxed).slice(0, 3);
  };
  const fromAnywhere = anyClass(rows, single);
  check(
    "control: near builds that ignore the class too come from other classes",
    fromAnywhere !== null &&
      fromAnywhere.some((r) => r.classSlug !== bigZero.classSlug) &&
      near !== null &&
      near.rows.every((r) => r.classSlug === bigZero.classSlug),
    fromAnywhere?.map((r) => `${r.slug}:${r.classSlug}`).join(","),
  );
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
