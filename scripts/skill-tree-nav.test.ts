/**
 * Keyboard navigation over the skill grid (R-TREE-13, plan decision 8).
 *
 * One Tab stop per tree is only an improvement over thirty if the arrows
 * genuinely reach everything, and reaching everything is only usable if the
 * moves are spatially predictable. These tests run every real grid the site
 * draws through the movement functions the island itself calls.
 *
 * The policy under test — the contract in `lib/skill-tree-nav.ts`:
 *   left/right walk the row; at its end they continue into the neighbouring
 *   row (right → the first skill of the next row that has one, left → the
 *   last of the previous); up/down walk the column, at any distance; only
 *   when the column has nothing further in that direction do they fall back
 *   to the nearest row that has a skill, nearest column, ties to the left.
 *
 * Reachability alone cannot guard this policy: with horizontal continuation,
 * "every skill reachable" is true by construction on the 24 real trees, so a
 * mutant that stops continuing at the edge still counts 24/24 (review, MED-1).
 * That is why the named cases are asserted by slug against the real grids, why
 * each expectation is recomputed from the graph's positions by the rule that
 * yields it, and why a synthetic grid under a strict, non-continuing policy
 * proves that `reachableByArrows` can report less than the total.
 *
 * Run with `npm run test:nav`.
 */
import { CLASSES_WITH_SKILL_PAGES, SKILL_GRAPH, TIER_LEVELS, layoutTree } from "../lib/skills";
import { getClass, getSkillsForClass } from "../lib/registry";
import { DEFAULT_LOCALE, LOCALES } from "../lib/i18n/config";
import {
  ARROW_MOVES,
  COLUMNS,
  at,
  edgeCell,
  firstCell,
  nextHorizontal,
  nextVertical,
  reachableByArrows,
  type Cell,
  type Grid as NavGrid,
  type Move,
} from "../lib/skill-tree-nav";

type Grid = (string | null)[][];

/** Typed lookup; the shared `at` is deliberately agnostic about cell contents. */
const slugAt = (g: Grid, r: number, c: number) => (at(g, r, c) as string | null) ?? null;
const key = (c: Cell | null) => (c ? `${c.row}:${c.col}` : "null");

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
check("24 trees are under test", grids.size === 24, `${grids.size}`);

const filledCells = (g: Grid): Cell[] => {
  const cells: Cell[] = [];
  g.forEach((row, r) => row.forEach((s, c) => s && cells.push({ row: r, col: c })));
  return cells;
};

// ===========================================================================
console.log("\nEvery skill is reachable by arrows alone");
// ===========================================================================

const HOME_END: readonly Move[] = [(g) => edgeCell(g, false), (g) => edgeCell(g, true)];

let fullyReachable = 0;
let fullyReachableWithHomeEnd = 0;
let reachedTotal = 0;
for (const [tree, g] of grids) {
  const { reachable, total, unreachable } = reachableByArrows(g);
  reachedTotal += reachable;
  if (reachable === total) fullyReachable++;
  check(
    `${tree}: all ${total} skills reachable from the Tab stop`,
    reachable === total && unreachable.length === 0,
    `${reachable}/${total}, unreachable ${unreachable.map((c) => slugAt(g, c.row, c.col)).join(", ")}`,
  );
  check(`${tree}: the total is the ten skills the grid holds`, total === 10 && total === filledCells(g).length);

  const withHomeEnd = reachableByArrows(g, [...ARROW_MOVES, ...HOME_END]);
  if (withHomeEnd.reachable === withHomeEnd.total) fullyReachableWithHomeEnd++;
  check(
    `${tree}: still all reachable with Home and End as moves`,
    withHomeEnd.reachable === withHomeEnd.total,
    `${withHomeEnd.reachable}/${withHomeEnd.total}`,
  );
}
// 30 skills per class, and the arrows must reach every one of them.
const expectedTotal = classes.length * 30;
check(
  `all ${expectedTotal} skills across ${classes.length} classes reachable by arrows`,
  reachedTotal === expectedTotal,
  `${reachedTotal}`,
);
console.log(`  trees fully reachable by arrows: ${fullyReachable}/${grids.size}; with Home/End: ${fullyReachableWithHomeEnd}/${grids.size}`);
check("24/24 trees reachable by arrows alone", fullyReachable === 24, `${fullyReachable}`);
check("24/24 trees reachable with Home/End", fullyReachableWithHomeEnd === 24, `${fullyReachableWithHomeEnd}`);

// ===========================================================================
console.log("\nControl: the count can come out below the total");
// ===========================================================================

/*
 * On the real trees the reachability count is true by construction (the
 * horizontal continuation chains the whole grid in reading order), so a green
 * count proves nothing about the counter. This grid has two skills that no
 * strict move connects: (1,1) and (4,3) share neither a row nor a column, and a
 * policy that stops at the row's end and at the column's end never leaves the
 * first one. The strict variant is written here, not in the library, because
 * the library's policy is exactly what must not stop.
 */
const strictHorizontal: Move = (g, from) => {
  for (let c = from.col + 1; c < COLUMNS; c++) if (at(g, from.row, c)) return { row: from.row, col: c };
  return null;
};
const strictHorizontalBack: Move = (g, from) => {
  for (let c = from.col - 1; c >= 0; c--) if (at(g, from.row, c)) return { row: from.row, col: c };
  return null;
};
const strictVertical: Move = (g, from) => {
  for (let r = from.row + 1; r < g.length; r++) if (at(g, r, from.col)) return { row: r, col: from.col };
  return null;
};
const strictVerticalBack: Move = (g, from) => {
  for (let r = from.row - 1; r >= 0; r--) if (at(g, r, from.col)) return { row: r, col: from.col };
  return null;
};
const STRICT_MOVES: readonly Move[] = [strictHorizontal, strictHorizontalBack, strictVertical, strictVerticalBack];

const isolated: Grid = [
  ["a", null, null],
  [null, null, null],
  [null, null, null],
  [null, null, "b"],
  [null, null, null],
  [null, null, null],
];
{
  const strict = reachableByArrows(isolated, STRICT_MOVES);
  check(
    "a strict policy leaves the isolated skill unreachable, and the count says so",
    strict.total === 2 && strict.reachable === 1 && strict.reachable < strict.total,
    `${strict.reachable}/${strict.total}`,
  );
  check(
    "and names the cell it could not reach",
    strict.unreachable.length === 1 && key(strict.unreachable[0]) === "3:2",
    strict.unreachable.map(key).join(", "),
  );
  // The shipped policy is the one that must not stop: mutation M11 (no
  // continuation at the row's end, no fallback past the column's end) turns
  // this line red while the 24 real trees still count 24/24.
  const shipped = reachableByArrows(isolated);
  check(
    "the shipped policy reaches the isolated skill through the documented fallback",
    shipped.reachable === shipped.total && shipped.total === 2,
    `${shipped.reachable}/${shipped.total}`,
  );
  const empty = reachableByArrows([[null, null, null]]);
  check("an empty grid counts zero of zero, not one", empty.reachable === 0 && empty.total === 0);
}

// ===========================================================================
console.log("\nNamed cases, by slug, on the real grids");
// ===========================================================================

/*
 * Each expectation is written by slug and recomputed from the graph's own
 * row/column by the rule that yields it, so a case can only pass when the
 * grid, the rule and the function agree. The rules:
 *
 *   same-column      the nearest skill in the same column in that direction,
 *                    at any distance (the old policy took the nearest row
 *                    first, which is what sent Ice Blast ↓ to Shiver Armor);
 *   same-row         the next skill in the row;
 *   row-continuation the row has nothing further, so the move continues to
 *                    the first (→) or last (←) skill of the neighbouring row
 *                    that has one — the documented fallback of R-TREE-13;
 *   column-fallback  the column has nothing further, so the move goes to the
 *                    nearest row that has a skill, nearest column, tie → left.
 */
type Rule = "same-column" | "same-row" | "row-continuation" | "column-fallback";
type Dir = "up" | "down" | "left" | "right";

/** Where the graph puts a skill (0-based), checked against the laid-out grid. */
const cellOf = (slug: string): Cell => {
  const node = SKILL_GRAPH[slug];
  const cell = { row: node.row - 1, col: node.column - 1 };
  const g = grids.get(node.tree)!;
  if (slugAt(g, cell.row, cell.col) !== slug) throw new Error(`${slug} is not at ${key(cell)} in ${node.tree}`);
  return cell;
};

/** The expectation, derived from positions alone — no movement function involved. */
const derive = (g: Grid, from: Cell, dir: Dir, rule: Rule): Cell | null => {
  const step = dir === "down" || dir === "right" ? 1 : -1;
  if (rule === "same-column") {
    for (let r = from.row + step; r >= 0 && r < g.length; r += step) if (slugAt(g, r, from.col)) return { row: r, col: from.col };
    return null;
  }
  if (rule === "same-row") {
    for (let c = from.col + step; c >= 0 && c < COLUMNS; c += step) if (slugAt(g, from.row, c)) return { row: from.row, col: c };
    return null;
  }
  if (rule === "row-continuation") {
    // Only valid when the row really has nothing further in that direction.
    for (let c = from.col + step; c >= 0 && c < COLUMNS; c += step) if (slugAt(g, from.row, c)) return null;
    for (let r = from.row + step; r >= 0 && r < g.length; r += step) {
      const order = step > 0 ? [0, 1, 2] : [2, 1, 0];
      for (const c of order) if (slugAt(g, r, c)) return { row: r, col: c };
    }
    return null;
  }
  // column-fallback: only valid when the column really has nothing further.
  for (let r = from.row + step; r >= 0 && r < g.length; r += step) if (slugAt(g, r, from.col)) return null;
  for (let r = from.row + step; r >= 0 && r < g.length; r += step) {
    const here = [0, 1, 2].filter((c) => slugAt(g, r, c));
    if (here.length === 0) continue;
    const best = here.reduce((a, c) => (Math.abs(c - from.col) < Math.abs(a - from.col) ? c : a));
    return { row: r, col: best };
  }
  return null;
};

const move = (g: Grid, from: Cell, dir: Dir): Cell | null =>
  dir === "up" ? nextVertical(g, from, -1)
  : dir === "down" ? nextVertical(g, from, 1)
  : dir === "left" ? nextHorizontal(g, from, -1)
  : nextHorizontal(g, from, 1);

const named = (from: string, dir: Dir, expected: string | null, rule: Rule) => {
  const node = SKILL_GRAPH[from];
  const g = grids.get(node.tree)!;
  const start = cellOf(from);
  const byRule = derive(g, start, dir, rule);
  const derivedSlug = byRule ? slugAt(g, byRule.row, byRule.col) : null;
  check(
    `${node.tree}: ${from} ${dir} = ${expected ?? "nothing"} follows from the ${rule} rule`,
    derivedSlug === expected,
    `rule yields ${derivedSlug ?? "nothing"}`,
  );
  const got = move(g, start, dir);
  const gotSlug = got ? slugAt(g, got.row, got.col) : null;
  check(`${node.tree}: ${from} ${dir} = ${expected ?? "nothing"}`, gotSlug === expected, `got ${gotSlug ?? "nothing"}`);
};

// Sorceress, Cold Spells — the two cases R-TREE-13 names, and their neighbours.
// Ice Blast sits at (2,2); column 2 below it is empty at row 3 and holds
// Glacial Spike at row 4, so ↓ is Glacial Spike, not Shiver Armor at (3,3).
named("ice-blast", "down", "glacial-spike", "same-column");
// Row 2 has nothing right of Ice Blast; the move continues to row 3, whose
// only skill is Shiver Armor (3,3) — the documented fallback, not "nothing".
named("ice-blast", "right", "shiver-armor", "row-continuation");
// Frost Nova is the skill to the left in the same row, (2,1).
named("ice-blast", "left", "frost-nova", "same-row");
// The reverse of the first case: column 2 above Glacial Spike (4,2) is empty
// at row 3 and holds Ice Blast at row 2.
named("glacial-spike", "up", "ice-blast", "same-column");
named("frost-nova", "right", "ice-blast", "same-row");
// Frost Nova (2,1) ↑: column 1 has nothing above; the nearest row above with a
// skill is row 1, holding Ice Bolt (1,2) and Frozen Armor (1,3) — Ice Bolt is
// the nearer column.
named("frost-nova", "up", "ice-bolt", "column-fallback");
// Chilling Armor (5,3) ↓: column 3 has nothing below; row 6 holds Frozen Orb
// (6,1) and Cold Mastery (6,2) — Cold Mastery is the nearer column.
named("chilling-armor", "down", "cold-mastery", "column-fallback");
named("ice-bolt", "up", null, "same-column");
named("cold-mastery", "right", null, "row-continuation");

// Necromancer, Summoning — the longest names and a column that skips rows.
// Clay Golem (2,2) ↓: column 2 is empty at row 3 and holds Blood Golem at row 4.
named("clay-golem", "down", "blood-golem", "same-column");
// Skeleton Mastery (1,1) →: row 1 is empty at column 2 and holds Raise Skeleton at (1,3).
named("skeleton-mastery", "right", "raise-skeleton", "same-row");
// Golem Mastery (3,1) ↓: column 1 is empty at row 4 and holds Summon Resist at (5,1).
named("golem-mastery", "down", "summon-resist", "same-column");
// Raise Skeletal Mage (3,3) ↓: column 3 is empty at rows 4 and 5 and holds Revive at (6,3).
named("raise-skeletal-mage", "down", "revive", "same-column");
// Raise Skeleton (1,3) ↓: column 3 is empty at row 2 and holds Raise Skeletal Mage at (3,3).
named("raise-skeleton", "down", "raise-skeletal-mage", "same-column");

// Warlock, Chaos.
// Sigil Lethargy (2,2) ↓: Sigil Rancor is directly below at (3,2).
named("sigil-lethargy", "down", "sigil-rancor", "same-column");
// Miasma Bolt (1,3) ↓: column 3 is empty at row 2 and holds Miasma Chain at (3,3).
named("miasma-bolt", "down", "miasma-chain", "same-column");
// Ring of Fire (2,1) →: Sigil Lethargy is next in the row at (2,2).
named("ring-of-fire", "right", "sigil-lethargy", "same-row");
// Flame Wave (4,1) ↓: column 1 is empty at row 5 and holds Apocalypse at (6,1).
named("flame-wave", "down", "apocalypse", "same-column");
// Miasma Bolt (1,3) ←: row 1 has nothing to the left, and there is no row
// above — the grid's end, so nothing.
named("miasma-bolt", "left", null, "row-continuation");

// ===========================================================================
console.log("\nInvariants over the 24 trees");
// ===========================================================================

const columnHasAhead = (g: Grid, from: Cell, dir: 1 | -1) => {
  for (let r = from.row + dir; r >= 0 && r < g.length; r += dir) if (slugAt(g, r, from.col)) return true;
  return false;
};
const rowHasAhead = (g: Grid, from: Cell, dir: 1 | -1) => {
  for (let c = from.col + dir; c >= 0 && c < COLUMNS; c += dir) if (slugAt(g, from.row, c)) return true;
  return false;
};

for (const [tree, g] of grids) {
  const cells = filledCells(g);
  const dirs = [1, -1] as const;

  check(
    `${tree}: up/down never change column while the column has a skill in that direction`,
    cells.every((c) =>
      dirs.every((d) => {
        const next = nextVertical(g, c, d);
        return !columnHasAhead(g, c, d) || (next !== null && next.col === c.col);
      }),
    ),
  );

  check(
    `${tree}: left/right never change row while the row has a skill in that direction`,
    cells.every((c) =>
      dirs.every((d) => {
        const next = nextHorizontal(g, c, d);
        return !rowHasAhead(g, c, d) || (next !== null && next.row === c.row);
      }),
    ),
  );

  // The vertical fallback, recomputed from positions.
  check(
    `${tree}: past the column's end, up/down land on the nearest row's nearest column`,
    cells.every((c) =>
      dirs.every((d) => {
        if (columnHasAhead(g, c, d)) return true;
        const want = derive(g, c, d > 0 ? "down" : "up", "column-fallback");
        return key(nextVertical(g, c, d)) === key(want);
      }),
    ),
  );

  // The horizontal continuation, recomputed from positions.
  check(
    `${tree}: past the row's end, left/right continue into the neighbouring row`,
    cells.every((c) =>
      dirs.every((d) => {
        if (rowHasAhead(g, c, d)) return true;
        const want = derive(g, c, d > 0 ? "right" : "left", "row-continuation");
        return key(nextHorizontal(g, c, d)) === key(want);
      }),
    ),
  );

  check(
    `${tree}: up/down always change row; left/right in the same row always change column in that direction`,
    cells.every((c) => {
      const down = nextVertical(g, c, 1);
      const up = nextVertical(g, c, -1);
      const right = nextHorizontal(g, c, 1);
      const left = nextHorizontal(g, c, -1);
      return (
        (!down || down.row > c.row) &&
        (!up || up.row < c.row) &&
        (!right || right.row !== c.row || right.col > c.col) &&
        (!left || left.row !== c.row || left.col < c.col)
      );
    }),
  );

  // An empty cell must never become a focus target.
  const landings = cells.flatMap((c) =>
    [nextHorizontal(g, c, 1), nextHorizontal(g, c, -1), nextVertical(g, c, 1), nextVertical(g, c, -1)].filter(
      (x): x is Cell => x !== null,
    ),
  );
  check(`${tree}: no move ever lands on an empty cell`, landings.every((c) => slugAt(g, c.row, c.col) !== null));

  // The extremes must terminate rather than wrap around.
  const top = firstCell(g);
  const bottom = edgeCell(g, true)!;
  check(`${tree}: up and left from the first cell go nowhere`, nextVertical(g, top, -1) === null && nextHorizontal(g, top, -1) === null);
  check(`${tree}: down and right from the last cell go nowhere`, nextVertical(g, bottom, 1) === null && nextHorizontal(g, bottom, 1) === null);
}

// ===========================================================================
console.log("\nWhat changed from the nearest-neighbour policy");
// ===========================================================================

/*
 * The policy this replaces: one row at a time, nearest column first. Kept here
 * verbatim so the number of vertical moves that land somewhere else is a
 * measured fact in the report (the plan review computed 218), not a claim. If
 * the count were zero the rewrite would have changed nothing.
 */
function legacyNextVertical(grid: NavGrid, from: Cell, dir: 1 | -1): Cell | null {
  for (let r = from.row + dir; r >= 0 && r < grid.length; r += dir) {
    for (const c of [from.col, from.col - 1, from.col + 1, from.col - 2, from.col + 2]) {
      if (c < 0 || c >= COLUMNS) continue;
      if (at(grid, r, c)) return { row: r, col: c };
    }
  }
  return null;
}

let verticalMoves = 0;
let changed = 0;
const changedByTree = new Map<string, number>();
for (const [tree, g] of grids) {
  for (const c of filledCells(g)) {
    for (const d of [1, -1] as const) {
      verticalMoves++;
      if (key(legacyNextVertical(g, c, d)) !== key(nextVertical(g, c, d))) {
        changed++;
        changedByTree.set(tree, (changedByTree.get(tree) ?? 0) + 1);
      }
    }
  }
}
console.log(`  vertical moves whose destination changed: ${changed} of ${verticalMoves} (${[...changedByTree].map(([t, n]) => `${t} ${n}`).join(", ")})`);
check("the new vertical policy changes at least one destination", changed > 0, `${changed}`);
check(
  "Ice Blast ↓ is one of the moves that changed",
  key(legacyNextVertical(grids.get("cold-spells")!, cellOf("ice-blast"), 1)) !== key(nextVertical(grids.get("cold-spells")!, cellOf("ice-blast"), 1)),
);

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

for (const [tree, g] of grids) {
  const filled = filledCells(g);
  const home = edgeCell(g, false);
  const end = edgeCell(g, true);

  check(`${tree}: Home lands on a real skill`, Boolean(home && slugAt(g, home.row, home.col)));
  check(`${tree}: End lands on a real skill`, Boolean(end && slugAt(g, end.row, end.col)));
  check(`${tree}: Home is the first cell in reading order`, key(home) === key(filled[0]), key(home));
  check(`${tree}: End is the last cell in reading order`, key(end) === key(filled[filled.length - 1]), key(end));
  check(`${tree}: Home agrees with the Tab stop`, key(home) === key(firstCell(g)));
  check(`${tree}: Home and End differ`, key(home) !== key(end));
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
check("the four arrow moves are the moves reachability is counted over", ARROW_MOVES.length === 4);

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
