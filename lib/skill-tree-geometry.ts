/**
 * Where a prerequisite connector goes, in grid terms.
 *
 * A connector is not drawn in a coordinate space; it is *placed*, as pieces
 * that are items of the same CSS grid the nodes sit in (an `aria-hidden`
 * subgrid overlay). Each piece names a row, a column span and a role, and
 * the stylesheet turns that into a box that is exact at every width and for
 * every row height — measured in a throwaway prototype before this file
 * existed (plan §5.4): eight real edges kept their endpoints on the nodes
 * with one row grown to 123 px, which a single `viewBox="0 0 3 6"` SVG cannot.
 *
 * Routing (plan §5.4): same column → a straight run; same row → a straight
 * run between the facing edges; otherwise down the origin's column to the gap
 * above the target, across in that gap, then into the target (`jog`).
 *
 * Client-safe and dependency-free. Stub until `scripts/skill-tree-geometry.test.ts`
 * (T1) is red.
 */

export interface GridPos {
  row: number;
  column: number;
}

export type Piece =
  /** From the bottom of the node at (row, col) to the end of the gap below it. */
  | { kind: "v-cell"; row: number; col: number }
  /**
   * Down through rows `fromRow…toRow` in `col`; always extends up into the gap
   * above `fromRow`, and down into the gap below `toRow` only when `bottomGap`
   * (same-column edges). A diagonal's lower gap belongs to its `jog`.
   */
  | { kind: "v-span"; fromRow: number; toRow: number; col: number; bottomGap: boolean }
  /** From the facing edge of the node at (row, col) across the gap beside it. */
  | { kind: "h-cell"; row: number; col: number; toRight: boolean }
  /** Across columns `fromCol…toCol` in `row`, extended into both side gaps. */
  | { kind: "h-span"; row: number; fromCol: number; toCol: number }
  /**
   * In the gap below `row`: down from the top at `fromCol`'s centre to the
   * middle, across to `toCol`'s centre, down to the bottom.
   */
  | { kind: "jog"; row: number; fromCol: number; toCol: number };

/** The pieces that draw one edge. Stub: none. */
export function edgePieces(from: GridPos, to: GridPos): Piece[] {
  void from;
  void to;
  return [];
}

/**
 * The keys (`"<from>><to>"`) of every edge on a path from a root to `slug` —
 * the prerequisite chain the node lights up (plan decision 15). Empty for null.
 * Stub.
 */
export function relatedEdges(
  slug: string | null,
  edges: readonly { from: string; to: string }[],
): Set<string> {
  void slug;
  void edges;
  return new Set();
}

export function edgeKey(edge: { from: string; to: string }): string {
  return `${edge.from}>${edge.to}`;
}
