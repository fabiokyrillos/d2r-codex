/**
 * Connector geometry: where the pieces of an edge go, and which edges light
 * up for a node.
 *
 * `edgePieces` is exercised on each routing case of plan §5.4 in both
 * horizontal directions, then on every edge of the 24 real trees, where the
 * invariants are the ones the stylesheet relies on: at least one piece per
 * edge, nothing placed outside the 3×6 grid, every `jog` in the gap directly
 * above its target (mutation M17 moves it below the origin and this goes red),
 * and every `v-span` strictly between the two nodes' rows.
 *
 * `relatedEdges` is compared against an independent walk of `prerequisites`,
 * so the expected set is computed from the graph rather than typed in: the
 * closure for Blizzard is whatever the graph says it is, and a mutant that
 * returned only the adjacent edges would differ from the walk.
 *
 * The test may import the graph; the library under test must not (it is
 * compiled into the client bundle — plan §5.4, "client-safe, puro").
 *
 * Run with `npm run test:tree-geometry`.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { edgeKey, edgePieces, relatedEdges, type Piece } from "../lib/skill-tree-geometry";

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

const same = (actual: Piece[], expected: Piece[]) =>
  JSON.stringify(actual) === JSON.stringify(expected);
const show = (pieces: Piece[]) => JSON.stringify(pieces);

// ===========================================================================
console.log("edgePieces: the routing cases of plan §5.4");
// ===========================================================================

// Same column, adjacent rows: one piece, the gap below the origin.
{
  const got = edgePieces({ row: 1, column: 2 }, { row: 2, column: 2 });
  check("same column, adjacent → [v-cell]", same(got, [{ kind: "v-cell", row: 1, col: 2 }]), show(got));
}

// Same column, rows apart: a span over the rows between, into both gaps.
{
  const got = edgePieces({ row: 2, column: 1 }, { row: 5, column: 1 });
  check(
    "same column, non-adjacent → [v-span over fromRow+1…toRow−1, bottomGap]",
    same(got, [{ kind: "v-span", fromRow: 3, toRow: 4, col: 1, bottomGap: true }]),
    show(got),
  );
}

// Same row, adjacent columns — both directions, because the graph has both.
{
  const right = edgePieces({ row: 1, column: 1 }, { row: 1, column: 2 });
  check(
    "same row, adjacent, rightwards → [h-cell toRight]",
    same(right, [{ kind: "h-cell", row: 1, col: 1, toRight: true }]),
    show(right),
  );
  const left = edgePieces({ row: 1, column: 2 }, { row: 1, column: 1 });
  check(
    "same row, adjacent, leftwards → [h-cell !toRight]",
    same(left, [{ kind: "h-cell", row: 1, col: 2, toRight: false }]),
    show(left),
  );
}

// Same row with a column between: raise-skeleton (1,3) → skeleton-mastery (1,1).
{
  const got = edgePieces({ row: 1, column: 3 }, { row: 1, column: 1 });
  check(
    "same row, gap column, leftwards → [h-span over the intermediate column only]",
    same(got, [{ kind: "h-span", row: 1, fromCol: 2, toCol: 2 }]),
    show(got),
  );
  const mirrored = edgePieces({ row: 1, column: 1 }, { row: 1, column: 3 });
  check(
    "same row, gap column, rightwards → the same h-span",
    same(mirrored, [{ kind: "h-span", row: 1, fromCol: 2, toCol: 2 }]),
    show(mirrored),
  );
}

// Diagonal, adjacent rows: the jog alone joins the bottom of A to the top of B.
{
  const right = edgePieces({ row: 2, column: 2 }, { row: 3, column: 3 });
  check(
    "diagonal, adjacent, rightwards → [jog] with fromCol/toCol in that order",
    same(right, [{ kind: "jog", row: 2, fromCol: 2, toCol: 3 }]),
    show(right),
  );
  const left = edgePieces({ row: 4, column: 2 }, { row: 5, column: 1 });
  check(
    "diagonal, adjacent, leftwards → [jog] keeps the direction",
    same(left, [{ kind: "jog", row: 4, fromCol: 2, toCol: 1 }]),
    show(left),
  );
}

// Diagonal, rows apart: down the origin's column, then the jog above the target.
{
  const got = edgePieces({ row: 2, column: 1 }, { row: 4, column: 2 });
  check(
    "diagonal, non-adjacent → [v-span without bottomGap in the origin column, jog in row toRow−1]",
    same(got, [
      { kind: "v-span", fromRow: 3, toRow: 3, col: 1, bottomGap: false },
      { kind: "jog", row: 3, fromCol: 1, toCol: 2 },
    ]),
    show(got),
  );
  const left = edgePieces({ row: 4, column: 2 }, { row: 6, column: 1 });
  check(
    "diagonal, non-adjacent, leftwards → same shape, direction preserved",
    same(left, [
      { kind: "v-span", fromRow: 5, toRow: 5, col: 2, bottomGap: false },
      { kind: "jog", row: 5, fromCol: 2, toCol: 1 },
    ]),
    show(left),
  );
}

// ===========================================================================
console.log("\nedgePieces: every edge of the 24 real trees");
// ===========================================================================

type Edge = { tree: string; from: string; to: string };
const edges: Edge[] = [];
for (const [slug, node] of Object.entries(SKILL_GRAPH)) {
  for (const pre of node.prerequisites) {
    const from = SKILL_GRAPH[pre];
    if (from && from.tree === node.tree) edges.push({ tree: node.tree, from: pre, to: slug });
  }
}
const trees = new Set(edges.map((e) => e.tree));
check("the graph yields 24 trees with edges", trees.size === 24, `${trees.size}`);
check("the graph yields more than 150 edges", edges.length > 150, `${edges.length}`);

const rowsOf = (p: Piece): number[] => {
  switch (p.kind) {
    case "v-span":
      return [p.fromRow, p.toRow];
    default:
      return [p.row];
  }
};
const colsOf = (p: Piece): number[] => {
  switch (p.kind) {
    case "h-span":
      return [p.fromCol, p.toCol];
    case "jog":
      return [p.fromCol, p.toCol];
    default:
      return [p.col];
  }
};

let emptyEdges = 0;
let outside = 0;
let jogMisplaced = 0;
let spanOutside = 0;
let kinds: Record<string, number> = {};
for (const e of edges) {
  const from = SKILL_GRAPH[e.from];
  const to = SKILL_GRAPH[e.to];
  const pieces = edgePieces(from, to);
  if (pieces.length === 0) emptyEdges++;
  for (const p of pieces) {
    kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
    if (rowsOf(p).some((r) => r < 1 || r > 6) || colsOf(p).some((c) => c < 1 || c > 3)) outside++;
    if (p.kind === "jog" && p.row !== to.row - 1) jogMisplaced++;
    if (p.kind === "v-span" && !(p.fromRow > from.row && p.toRow < to.row && p.fromRow <= p.toRow)) {
      spanOutside++;
    }
  }
}
check("every edge yields at least one piece", emptyEdges === 0, `${emptyEdges} empty`);
check("no piece is placed outside rows 1..6 / columns 1..3", outside === 0, `${outside}`);
check("every jog sits in the gap directly above its target (row = to.row − 1)", jogMisplaced === 0, `${jogMisplaced}`);
check("every v-span stays strictly between the two nodes' rows", spanOutside === 0, `${spanOutside}`);
check(
  "all five kinds occur in the real graph, so each branch above is exercised",
  ["v-cell", "v-span", "h-cell", "h-span", "jog"].every((k) => (kinds[k] ?? 0) > 0),
  JSON.stringify(kinds),
);
kinds = {};

// ===========================================================================
console.log("\nrelatedEdges: the ancestor closure");
// ===========================================================================

const coldEdges = edges.filter((e) => e.tree === "cold-spells").map(({ from, to }) => ({ from, to }));
check("Cold Spells has the eight edges the prototype drew", coldEdges.length === 8, `${coldEdges.length}`);

/** An independent walk: every edge on any path from a root down to `slug`. */
const closure = (slug: string): Set<string> => {
  const keys = new Set<string>();
  const seen = new Set<string>();
  const walk = (s: string) => {
    if (seen.has(s)) return;
    seen.add(s);
    for (const pre of SKILL_GRAPH[s]?.prerequisites ?? []) {
      keys.add(`${pre}>${s}`);
      walk(pre);
    }
  };
  walk(slug);
  return keys;
};
const sameSet = (a: ReadonlySet<string>, b: ReadonlySet<string>) =>
  a.size === b.size && [...a].every((k) => b.has(k));

{
  const expected = closure("blizzard");
  const got = relatedEdges("blizzard", coldEdges);
  check(
    "blizzard: the set equals the walk over prerequisites",
    sameSet(got, expected),
    `got ${JSON.stringify([...got])}, expected ${JSON.stringify([...expected])}`,
  );
  for (const k of ["ice-bolt>ice-blast", "ice-blast>glacial-spike", "glacial-spike>blizzard", "frost-nova>blizzard"]) {
    check(`blizzard: includes ${k}`, got.has(k));
  }
  check("blizzard: the closure is deeper than the adjacent edges", got.size > 2, `${got.size}`);
  check("blizzard: excludes the unrelated ice-blast>shiver-armor", !got.has("ice-blast>shiver-armor"));
  check("blizzard: excludes its own dependent blizzard>frozen-orb", !got.has("blizzard>frozen-orb"));
}
{
  const got = relatedEdges("ice-bolt", coldEdges);
  check("ice-bolt (a root): empty", got.size === 0, `${got.size}`);
}
{
  const got = relatedEdges(null, coldEdges);
  check("null: empty", got.size === 0, `${got.size}`);
}
check("a slug not in the edge list: empty", relatedEdges("not-a-skill", coldEdges).size === 0);
check("edgeKey is the key format the closure uses", edgeKey({ from: "a", to: "b" }) === "a>b");

// Every node of every tree agrees with the walk — the closure is not a
// special case of Cold Spells.
{
  let disagreements = 0;
  let nonTrivial = 0;
  for (const tree of trees) {
    const treeEdges = edges.filter((e) => e.tree === tree).map(({ from, to }) => ({ from, to }));
    const slugs = Object.entries(SKILL_GRAPH)
      .filter(([, n]) => n.tree === tree)
      .map(([s]) => s);
    for (const slug of slugs) {
      const expected = closure(slug);
      if (expected.size > 2) nonTrivial++;
      if (!sameSet(relatedEdges(slug, treeEdges), expected)) disagreements++;
    }
  }
  check("every node of every tree: relatedEdges equals the walk", disagreements === 0, `${disagreements}`);
  check("control: many nodes have a closure larger than their adjacent edges", nonTrivial > 20, `${nonTrivial}`);
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
