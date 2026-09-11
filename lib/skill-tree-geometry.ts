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
 * The gap the pieces are sized by is `--tree-gap` in `app/globals.css`, 8 px
 * (plan §10, contract 6): this file never names the number, the stylesheet
 * owns it, and the browser gate (C2) is what keeps the two sides equal.
 *
 * Client-safe and dependency-free. Tested by `scripts/skill-tree-geometry.test.ts`.
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

/** The pieces that draw one edge, prerequisite first. */
export function edgePieces(from: GridPos, to: GridPos): Piece[] {
  const rows = to.row - from.row;
  const cols = to.column - from.column;

  if (rows === 0) {
    if (cols === 0) return [];
    // Facing edges, across the one gap or across the column between. Both
    // directions exist: raise-skeleton (1,3) → skeleton-mastery (1,1).
    if (Math.abs(cols) === 1) {
      return [{ kind: "h-cell", row: from.row, col: from.column, toRight: cols > 0 }];
    }
    const [a, b] = cols > 0 ? [from.column, to.column] : [to.column, from.column];
    return [{ kind: "h-span", row: from.row, fromCol: a + 1, toCol: b - 1 }];
  }

  // No edge in the graph points upward (measured over the 240 nodes), and a
  // piece has no arrowhead, so an upward edge would draw as its reverse
  // rather than as nothing.
  if (rows < 0) return edgePieces(to, from);

  if (cols === 0) {
    if (rows === 1) return [{ kind: "v-cell", row: from.row, col: from.column }];
    return [{ kind: "v-span", fromRow: from.row + 1, toRow: to.row - 1, col: from.column, bottomGap: true }];
  }

  // Diagonal. The jog lives in the gap above the target so that the piece
  // ends on the target's top edge; with adjacent rows that gap is the whole
  // route. Further apart, the run down the origin's column stops at the row
  // above the target and leaves the lower gap to the jog (`bottomGap: false`).
  const jog: Piece = { kind: "jog", row: to.row - 1, fromCol: from.column, toCol: to.column };
  if (rows === 1) return [jog];
  return [
    { kind: "v-span", fromRow: from.row + 1, toRow: to.row - 1, col: from.column, bottomGap: false },
    jog,
  ];
}

/**
 * The keys (`"<from>><to>"`) of every edge on a path from a root to `slug` —
 * the prerequisite chain the node lights up (plan decision 15). Empty for null.
 *
 * Walks `edges` upward from the node, recursively, and never `prerequisites`
 * directly: the island holds only the tree's edge list, and the two are the
 * same graph (`buildSkillTreesData` derives one from the other).
 */
export function relatedEdges(
  slug: string | null,
  edges: readonly { from: string; to: string }[],
): Set<string> {
  const related = new Set<string>();
  if (slug === null) return related;
  const seen = new Set<string>();
  const walk = (node: string) => {
    if (seen.has(node)) return;
    seen.add(node);
    for (const edge of edges) {
      if (edge.to !== node) continue;
      related.add(edgeKey(edge));
      walk(edge.from);
    }
  };
  walk(slug);
  return related;
}

export function edgeKey(edge: { from: string; to: string }): string {
  return `${edge.from}>${edge.to}`;
}
