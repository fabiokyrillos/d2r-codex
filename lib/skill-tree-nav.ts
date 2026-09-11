/**
 * Arrow-key movement over a skill grid — the contract (R-TREE-13, plan
 * decision 8). The legend's `legendKeyboard` line tells readers the same rules
 * in prose; `scripts/skill-tree-nav.test.ts` holds them to the 24 real grids.
 *
 *   Left / Right   The next skill in the same row. When the row has nothing
 *                  further in that direction, the move continues into the
 *                  neighbouring row: Right lands on the first skill of the
 *                  next row that has one, Left on the last skill of the
 *                  previous row that has one. Nothing at the grid's end.
 *   Up / Down      The next skill in the same column, at any distance — empty
 *                  cells are passed over, never entered. Only when the column
 *                  has nothing further in that direction does the move fall
 *                  back: to the nearest row in that direction that has any
 *                  skill, and there to the skill whose column is closest
 *                  (a tie goes to the lower column index). Nothing when no
 *                  row in that direction has a skill.
 *   Home / End     The first and last skill in reading order.
 *
 * Why strict-first: the previous policy took the nearest row first and the
 * nearest column second, so Down from Ice Blast (2,2) landed on Shiver Armor
 * (3,3) rather than on Glacial Spike (4,2) directly below it — 218 vertical
 * moves across the 24 trees ended somewhere other than where the column led
 * (the count is printed by the test). Why the fallback exists at all: without
 * the horizontal continuation a row's last skill would be a dead end for
 * Right, and without the column fallback a column's last skill for Down; the
 * owner asked for the documented fallback rather than "nothing", and it is
 * what keeps every skill reachable by arrows alone.
 *
 * Deliberately client-safe and dependency-free — no registry, no content, no
 * React. It is imported by a Client Component, so anything it imports would be
 * compiled into the browser bundle.
 *
 * The grid is addressed rather than flattened. An earlier version walked a flat
 * list of filled cells, so ArrowDown moved "three tiles onward" instead of one
 * row down; because rows hold one, two or three skills, that landed two rows
 * away as often as not.
 */

export const COLUMNS = 3;

export interface Cell {
  row: number;
  col: number;
}

/** Only occupancy matters here: a truthy entry is a skill, `null` is a gap. */
export type Grid = readonly (readonly unknown[])[];

export function at(grid: Grid, row: number, col: number): unknown {
  return grid[row]?.[col] ?? null;
}

/** The first filled cell in reading order — the tree's single Tab stop. */
export function firstCell(grid: Grid): Cell {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < COLUMNS; c++) if (at(grid, r, c)) return { row: r, col: c };
  }
  return { row: 0, col: 0 };
}

/**
 * Left/right within the row; at its end, into the neighbouring row — the first
 * skill of the next row for Right, the last of the previous row for Left.
 */
export function nextHorizontal(grid: Grid, from: Cell, dir: 1 | -1): Cell | null {
  for (let c = from.col + dir; c >= 0 && c < COLUMNS; c += dir) {
    if (at(grid, from.row, c)) return { row: from.row, col: c };
  }
  for (let r = from.row + dir; r >= 0 && r < grid.length; r += dir) {
    for (let c = dir > 0 ? 0 : COLUMNS - 1; c >= 0 && c < COLUMNS; c += dir) {
      if (at(grid, r, c)) return { row: r, col: c };
    }
  }
  return null;
}

/**
 * Up/down along the column at any distance; only past the column's end, the
 * nearest row with a skill and there the nearest column, ties to the left.
 */
export function nextVertical(grid: Grid, from: Cell, dir: 1 | -1): Cell | null {
  for (let r = from.row + dir; r >= 0 && r < grid.length; r += dir) {
    if (at(grid, r, from.col)) return { row: r, col: from.col };
  }
  for (let r = from.row + dir; r >= 0 && r < grid.length; r += dir) {
    let best: Cell | null = null;
    // Ascending scan with a strict comparison: an equal distance keeps the
    // lower column, which is the tie rule the test recomputes from positions.
    for (let c = 0; c < COLUMNS; c++) {
      if (!at(grid, r, c)) continue;
      if (!best || Math.abs(c - from.col) < Math.abs(best.col - from.col)) best = { row: r, col: c };
    }
    if (best) return best;
  }
  return null;
}

/** Home and End: the first and last filled cell in reading order. */
export function edgeCell(grid: Grid, last: boolean): Cell | null {
  const rows = [...grid.keys()];
  for (const r of last ? rows.reverse() : rows) {
    for (const c of last ? [2, 1, 0] : [0, 1, 2]) if (at(grid, r, c)) return { row: r, col: c };
  }
  return null;
}

/** One keyboard move: where a key takes the focus from `from`, or nowhere. */
export type Move = (grid: Grid, from: Cell) => Cell | null;

/** The four arrows, in the order the island binds them. */
export const ARROW_MOVES: readonly Move[] = [
  (g, from) => nextHorizontal(g, from, 1),
  (g, from) => nextHorizontal(g, from, -1),
  (g, from) => nextVertical(g, from, 1),
  (g, from) => nextVertical(g, from, -1),
];

/**
 * How much of the grid the keyboard can reach from the Tab stop, by breadth-
 * first search over `moves` — the four arrows unless a caller says otherwise.
 *
 * `moves` is a parameter for one reason: on the 24 real trees the arrows reach
 * everything by construction (the horizontal continuation chains the grid in
 * reading order), so a count of 24/24 cannot tell a working counter from a
 * broken one. The test runs the same counter under a strict policy that stops
 * at the edges and asserts it reports fewer (plan §9 C4, review MED-1).
 */
export function reachableByArrows(
  grid: Grid,
  moves: readonly Move[] = ARROW_MOVES,
): { reachable: number; total: number; unreachable: Cell[] } {
  const filled: Cell[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < COLUMNS; c++) if (at(grid, r, c)) filled.push({ row: r, col: c });
  }
  if (filled.length === 0) return { reachable: 0, total: 0, unreachable: [] };

  const key = (c: Cell) => `${c.row}:${c.col}`;
  const start = firstCell(grid);
  const visited = new Set<string>([key(start)]);
  const queue: Cell[] = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const move of moves) {
      const next = move(grid, cur);
      if (next && !visited.has(key(next))) {
        visited.add(key(next));
        queue.push(next);
      }
    }
  }
  const unreachable = filled.filter((c) => !visited.has(key(c)));
  return { reachable: filled.length - unreachable.length, total: filled.length, unreachable };
}
