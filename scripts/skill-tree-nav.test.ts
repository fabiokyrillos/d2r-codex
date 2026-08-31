/**
 * Keyboard navigation over the skill grid.
 *
 * One Tab stop per tree is only an improvement over thirty if the arrows
 * genuinely reach everything. These tests run every real grid the site draws
 * through the movement functions the component itself calls.
 *
 * They used to be a copy. The rules were reimplemented here "mirroring
 * skill-tree-interactive.tsx", so a green run proved the duplicate was
 * self-consistent and nothing more — the component could drift and this would
 * still pass. Home and End had no duplicate at all and were never covered.
 * The functions now live in `lib/skill-tree-nav`, imported by both.
 *
 * Run with `npm run test:nav`.
 */
import { CLASSES_WITH_SKILL_PAGES, SKILL_GRAPH, TIER_LEVELS, layoutTree } from "../lib/skills";
import { getClass, getSkillsForClass } from "../lib/registry";
import { DEFAULT_LOCALE, LOCALES } from "../lib/i18n/config";
import {
  COLUMNS,
  at,
  edgeCell,
  firstCell,
  nextHorizontal,
  nextVertical,
  type Cell,
} from "../lib/skill-tree-nav";

type Grid = (string | null)[][];

/** Typed lookup; the shared `at` is deliberately agnostic about cell contents. */
const slugAt = (g: Grid, r: number, c: number) => (at(g, r, c) as string | null) ?? null;

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

// --- build the real grids --------------------------------------------------
const classes = CLASSES_WITH_SKILL_PAGES.map((slug) => ({
  slug,
  cls: getClass(DEFAULT_LOCALE, slug)!,
  skills: getSkillsForClass(DEFAULT_LOCALE, slug),
}));

// Keyed by tree slug alone, which is safe only while tree slugs are unique
// across classes. Asserted rather than assumed: a collision would silently
// drop a whole tree from every check below and still report green.
const grids = new Map<string, Grid>();
for (const { cls, skills } of classes) {
  for (const tree of cls.trees) {
    grids.set(
      tree,
      layoutTree(skills, tree).map((row) => row.cells.map((c) => c?.skill.slug ?? null)),
    );
  }
}
check(
  `every tree slug is distinct, so all ${classes.length} classes are covered`,
  grids.size === classes.reduce((n, c) => n + c.cls.trees.length, 0),
  `${grids.size} grids`,
);

// ===========================================================================
console.log("\nEvery skill is reachable by arrows alone");
// ===========================================================================

let reachedTotal = 0;
for (const [tree, g] of grids) {
  const filled = g.flat().filter((s): s is string => s !== null);

  // Breadth-first over the four arrow moves from the single Tab stop. If any
  // skill is missing from the closure, a keyboard user simply cannot get to it.
  const start = firstCell(g);
  const seen = new Set<string>();
  const queue: Cell[] = [start];
  const key = (c: Cell) => `${c.row}:${c.col}`;
  const visited = new Set<string>([key(start)]);
  while (queue.length) {
    const cur = queue.shift()!;
    const slug = slugAt(g, cur.row, cur.col);
    if (slug) seen.add(slug);
    for (const next of [
      nextHorizontal(g, cur, 1),
      nextHorizontal(g, cur, -1),
      nextVertical(g, cur, 1),
      nextVertical(g, cur, -1),
    ]) {
      if (next && !visited.has(key(next))) {
        visited.add(key(next));
        queue.push(next);
      }
    }
  }
  reachedTotal += seen.size;
  const missing = filled.filter((s) => !seen.has(s));
  check(`${tree}: all ${filled.length} skills reachable from the Tab stop`, missing.length === 0, missing.join(", "));
}
// 30 skills per class, and the arrows must reach every one of them.
const expectedTotal = classes.length * 30;
check(
  `all ${expectedTotal} skills across ${classes.map((c) => c.cls.name).join(" and ")} reachable by arrows`,
  reachedTotal === expectedTotal,
  `${reachedTotal}`,
);

// ===========================================================================
console.log("\nArrows respect the grid");
// ===========================================================================

for (const [tree, g] of grids) {
  const cells: Cell[] = [];
  g.forEach((row, r) => row.forEach((s, c) => s && cells.push({ row: r, col: c })));

  check(
    `${tree}: left/right stay in the row until the row runs out`,
    cells.every((c) => {
      const right = nextHorizontal(g, c, 1);
      if (!right) return true;
      // Same row means a strictly greater column; a different row means there
      // was no further filled cell in this one.
      if (right.row === c.row) return right.col > c.col;
      return ![0, 1, 2].some((x) => x > c.col && at(g, c.row, x));
    }),
  );

  check(
    `${tree}: up/down always change row`,
    cells.every((c) => {
      const down = nextVertical(g, c, 1);
      const up = nextVertical(g, c, -1);
      return (!down || down.row > c.row) && (!up || up.row < c.row);
    }),
  );

  check(
    `${tree}: down moves exactly one row when that row has any skill`,
    cells.every((c) => {
      const down = nextVertical(g, c, 1);
      if (!down) return true;
      const nextRowHasAny = [0, 1, 2].some((x) => at(g, c.row + 1, x));
      return nextRowHasAny ? down.row === c.row + 1 : true;
    }),
  );

  check(
    `${tree}: down prefers the same column when that column is filled`,
    cells.every((c) => {
      const down = nextVertical(g, c, 1);
      if (!down) return true;
      return at(g, down.row, c.col) ? down.col === c.col : true;
    }),
  );

  // An empty cell must never become a focus target.
  const landings = cells.flatMap((c) =>
    [
      nextHorizontal(g, c, 1),
      nextHorizontal(g, c, -1),
      nextVertical(g, c, 1),
      nextVertical(g, c, -1),
    ].filter((x): x is Cell => x !== null),
  );
  check(
    `${tree}: no move ever lands on an empty cell`,
    landings.every((c) => at(g, c.row, c.col) !== null),
  );

  // The extremes must terminate rather than wrap around forever.
  const top = firstCell(g);
  check(`${tree}: up from the first cell goes nowhere`, nextVertical(g, top, -1) === null);
  check(`${tree}: left from the first cell goes nowhere`, nextHorizontal(g, top, -1) === null);
}

// ===========================================================================
console.log("\nThe order is the same in both languages");
// ===========================================================================

/*
 * Position comes from the generated graph, not from content, so the reading
 * order cannot drift between locales. Checked rather than assumed, because a
 * localized page that reorders its grid would be a genuinely confusing bug.
 */
for (const { slug: classSlug, cls } of classes) {
  for (const tree of cls.trees) {
    const orders = LOCALES.map((locale) =>
      layoutTree(getSkillsForClass(locale, classSlug), tree)
        .flatMap((row) => row.cells.map((c) => c?.skill.slug ?? "-"))
        .join(","),
    );
    check(`${tree}: identical cell order in ${LOCALES.join(" and ")}`, new Set(orders).size === 1);
  }
}

// ===========================================================================
console.log("\nOne Tab stop per tree");
// ===========================================================================

for (const [tree, g] of grids) {
  const start = firstCell(g);
  check(`${tree}: the Tab stop is a real skill, not an empty cell`, at(g, start.row, start.col) !== null);
  check(
    `${tree}: the Tab stop starts at the earliest skill in reading order`,
    start.row === 0 || !g[0].some((s) => s !== null),
  );
}
for (const { cls } of classes) {
  check(
    `${cls.name}: three trees means three Tab stops on the class page`,
    cls.trees.length === 3,
    cls.trees.join(", "),
  );
}

// ===========================================================================
console.log("\nRows carry their tier level");
// ===========================================================================

for (const [tree, g] of grids) {
  check(
    `${tree}: every filled cell's row matches its unlock tier`,
    g.every((row, r) =>
      row.every((slug) => !slug || SKILL_GRAPH[slug].requiredLevel === TIER_LEVELS[r]),
    ),
  );
}

// ===========================================================================
console.log("\nHome and End");
// ===========================================================================
/*
 * Never covered before, because the duplicated rules in this file had no copy
 * of `edgeCell` to test. Both keys are bound in the component's `onKeyDown`, so
 * they were shipped untested.
 */
for (const [tree, g] of grids) {
  const filled: Cell[] = [];
  g.forEach((row, r) => row.forEach((s, c) => s && filled.push({ row: r, col: c })));
  const home = edgeCell(g, false);
  const end = edgeCell(g, true);

  check(`${tree}: Home lands on a real skill`, Boolean(home && slugAt(g, home.row, home.col)));
  check(`${tree}: End lands on a real skill`, Boolean(end && slugAt(g, end.row, end.col)));
  check(
    `${tree}: Home is the first cell in reading order`,
    JSON.stringify(home) === JSON.stringify(filled[0]),
    JSON.stringify(home),
  );
  check(
    `${tree}: End is the last cell in reading order`,
    JSON.stringify(end) === JSON.stringify(filled[filled.length - 1]),
    JSON.stringify(end),
  );
  check(
    `${tree}: Home agrees with the Tab stop`,
    JSON.stringify(home) === JSON.stringify(firstCell(g)),
  );
  check(`${tree}: Home and End differ`, JSON.stringify(home) !== JSON.stringify(end));
  // From anywhere in the grid, both keys reach the same two cells.
  const fromEverywhere = filled.every(
    () =>
      JSON.stringify(edgeCell(g, false)) === JSON.stringify(home) &&
      JSON.stringify(edgeCell(g, true)) === JSON.stringify(end),
  );
  check(`${tree}: both are absolute, not relative to the current cell`, fromEverywhere);
}

// An empty grid must not pretend to have an edge.
check(
  "Home and End return nothing on an empty grid",
  edgeCell([[null, null, null]], false) === null && edgeCell([[null, null, null]], true) === null,
);
check(
  "COLUMNS is the width the grids are actually built at",
  [...grids.values()].every((g) => g.every((row) => row.length === COLUMNS)),
);

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
