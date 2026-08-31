/**
 * Keyboard navigation over the skill grid.
 *
 * One Tab stop per tree is only an improvement over thirty if the arrows
 * genuinely reach everything. These tests replicate the component's movement
 * rules against the real Paladin grids and prove exactly that.
 *
 * The rules live here in the same shape the component uses. That duplication
 * is deliberate and narrow: the component's copy is bound to React state and
 * DOM focus, and the part worth testing is the pure grid walk.
 *
 * Run with `npm run test:nav`.
 */
import { SKILL_GRAPH, TIER_LEVELS, layoutTree } from "../lib/skills";
import { getClass, getSkillsForClass } from "../lib/registry";
import { DEFAULT_LOCALE, LOCALES } from "../lib/i18n/config";

const COLUMNS = 3;

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

interface Cell {
  row: number;
  col: number;
}
type Grid = (string | null)[][];

// --- the movement rules, mirroring skill-tree-interactive.tsx --------------
const at = (g: Grid, r: number, c: number) => g[r]?.[c] ?? null;

const nextHorizontal = (g: Grid, from: Cell, dir: 1 | -1): Cell | null => {
  for (let c = from.col + dir; c >= 0 && c < COLUMNS; c += dir) {
    if (at(g, from.row, c)) return { row: from.row, col: c };
  }
  for (let r = from.row + dir; r >= 0 && r < g.length; r += dir) {
    for (const c of dir > 0 ? [0, 1, 2] : [2, 1, 0]) if (at(g, r, c)) return { row: r, col: c };
  }
  return null;
};

const nextVertical = (g: Grid, from: Cell, dir: 1 | -1): Cell | null => {
  for (let r = from.row + dir; r >= 0 && r < g.length; r += dir) {
    for (const c of [from.col, from.col - 1, from.col + 1, from.col - 2, from.col + 2]) {
      if (c < 0 || c >= COLUMNS) continue;
      if (at(g, r, c)) return { row: r, col: c };
    }
  }
  return null;
};

const firstCell = (g: Grid): Cell => {
  for (let r = 0; r < g.length; r++) for (let c = 0; c < COLUMNS; c++) if (at(g, r, c)) return { row: r, col: c };
  return { row: 0, col: 0 };
};

// --- build the real grids --------------------------------------------------
const paladin = getClass(DEFAULT_LOCALE, "paladin")!;
const skills = getSkillsForClass(DEFAULT_LOCALE, "paladin");
const grids = new Map<string, Grid>();
for (const tree of paladin.trees) {
  grids.set(
    tree,
    layoutTree(skills, tree).map((row) => row.cells.map((c) => c?.skill.slug ?? null)),
  );
}

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
    const slug = at(g, cur.row, cur.col);
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
check("all 30 Paladin skills reachable by arrows", reachedTotal === 30, `${reachedTotal}`);

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
for (const tree of paladin.trees) {
  const orders = LOCALES.map((locale) =>
    layoutTree(getSkillsForClass(locale, "paladin"), tree)
      .flatMap((row) => row.cells.map((c) => c?.skill.slug ?? "-"))
      .join(","),
  );
  check(`${tree}: identical cell order in ${LOCALES.join(" and ")}`, new Set(orders).size === 1);
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
check(
  "three trees means three Tab stops on the class page",
  paladin.trees.length === 3,
);

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
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
