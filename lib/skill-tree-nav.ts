/**
 * Arrow-key movement over a skill grid.
 *
 * Extracted from `skill-tree-interactive.tsx` so that the component and the
 * test run the *same* code. They used to run two copies: the test carried its
 * own `nextHorizontal` and `nextVertical` "mirroring the component", which
 * meant a green suite proved only that the duplicate was self-consistent.
 * Nothing detected drift, and Home/End had no second copy at all, so they were
 * never covered.
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
 * Left/right within the row, continuing into the neighbouring row at an edge so
 * that every skill stays reachable by arrows alone.
 */
export function nextHorizontal(grid: Grid, from: Cell, dir: 1 | -1): Cell | null {
  for (let c = from.col + dir; c >= 0 && c < COLUMNS; c += dir) {
    if (at(grid, from.row, c)) return { row: from.row, col: c };
  }
  for (let r = from.row + dir; r >= 0 && r < grid.length; r += dir) {
    const scan = dir > 0 ? [0, 1, 2] : [2, 1, 0];
    for (const c of scan) if (at(grid, r, c)) return { row: r, col: c };
  }
  return null;
}

/**
 * Up/down by one row, preferring the same column and then the nearest one, so
 * vertical movement stays vertical wherever the grid allows it. Empty cells are
 * skipped rather than entered.
 */
export function nextVertical(grid: Grid, from: Cell, dir: 1 | -1): Cell | null {
  for (let r = from.row + dir; r >= 0 && r < grid.length; r += dir) {
    for (const c of [from.col, from.col - 1, from.col + 1, from.col - 2, from.col + 2]) {
      if (c < 0 || c >= COLUMNS) continue;
      if (at(grid, r, c)) return { row: r, col: c };
    }
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
