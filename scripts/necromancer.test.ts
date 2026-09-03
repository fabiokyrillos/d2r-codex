/**
 * Proof that the Necromancer's own controls fire.
 *
 * The golem ring is the single place where reading a synergy parameter off the
 * wrong row produces a wrong answer that still looks like a right one: twelve
 * edges, four kinds, four magnitudes, all plausible in either direction. The
 * controls in `necromancer-rules.ts` pin what the game's rows say; these
 * mutations prove each one rejects the alternative.
 *
 * Run with `npm run test:necromancer`.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import {
  GOLEM_SYNERGY_CONTROLS,
  checkGolemSynergies,
  type NecromancerProblem,
} from "./necromancer-rules";

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

const fired = (problems: NecromancerProblem[], rule: NecromancerProblem["rule"]) =>
  problems.filter((p) => p.rule === rule).length;

type Edge = { from: string; kinds: string[]; magnitude?: number };
type Graph = Record<string, { synergies: Edge[] }>;

/** The four golem nodes as the graph ships them, deep-copied so a test can bend one. */
const golemGraph = (): Graph =>
  JSON.parse(
    JSON.stringify(
      Object.fromEntries(
        GOLEM_SYNERGY_CONTROLS.map((c) => [c.source, { synergies: SKILL_GRAPH[c.source].synergies }]),
      ),
    ),
  ) as Graph;

// ===========================================================================
console.log("\nThe golem ring, as shipped");
// ===========================================================================

check(
  "the shipped graph satisfies every golem control",
  checkGolemSynergies(golemGraph(), GOLEM_SYNERGY_CONTROLS).length === 0,
  JSON.stringify(checkGolemSynergies(golemGraph(), GOLEM_SYNERGY_CONTROLS)),
);

check(
  "each golem receives exactly three edges",
  GOLEM_SYNERGY_CONTROLS.every((c) => SKILL_GRAPH[c.source].synergies.length === 3),
  GOLEM_SYNERGY_CONTROLS.map((c) => `${c.source}=${SKILL_GRAPH[c.source].synergies.length}`).join(", "),
);

// ===========================================================================
console.log("\nPlanted mutations");
// ===========================================================================

{
  /*
   * The defect the ownership fix exists for, reconstructed: every edge takes
   * the *receiver's* kind and magnitude. Clay Golem's row says attack rating at
   * 20, so under the old reading every edge into Clay Golem said that.
   */
  const g = golemGraph();
  for (const control of GOLEM_SYNERGY_CONTROLS) {
    g[control.source].synergies = g[control.source].synergies.map((s) => ({
      ...s,
      kinds: [control.kind],
      magnitude: control.magnitude,
    }));
  }
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "reading the receiver's parameter instead of the donor's is caught",
    fired(found, "golem-kind-wrong") > 0 && fired(found, "golem-magnitude-wrong") > 0,
    JSON.stringify(found.map((p) => p.rule)),
  );
}

{
  // One magnitude swapped for another golem's — 20 where 35 belongs.
  const g = golemGraph();
  const edge = g["clay-golem"].synergies.find((s) => s.from === "iron-golem")!;
  edge.magnitude = 20;
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "a magnitude taken from the wrong golem is caught",
    fired(found, "golem-magnitude-wrong") === 1,
    JSON.stringify(found),
  );
}

{
  // The kind swapped, magnitude left correct. Armour becomes life.
  const g = golemGraph();
  g["clay-golem"].synergies.find((s) => s.from === "iron-golem")!.kinds = ["hp"];
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check("a swapped kind is caught", fired(found, "golem-kind-wrong") === 1, JSON.stringify(found));
}

{
  // The magnitude dropped entirely, which is what a regression to the
  // receiver-owned rule would produce for these edges.
  const g = golemGraph();
  delete g["fire-golem"].synergies.find((s) => s.from === "blood-golem")!.magnitude;
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "an edge losing its magnitude is caught",
    fired(found, "golem-magnitude-absent") === 1,
    JSON.stringify(found),
  );
}

{
  // An edge removed.
  const g = golemGraph();
  g["iron-golem"].synergies = g["iron-golem"].synergies.filter((s) => s.from !== "clay-golem");
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check("a missing edge is caught", fired(found, "golem-edge-missing") === 1, JSON.stringify(found));
}

{
  /*
   * The rule the brief names directly: Skeleton Mastery, Golem Mastery and
   * Summon Resist must not become synergy edges. They reach their minions
   * through the effective level, which +skills raise, and the graph models hard
   * points. An extraction that widened its idea of a synergy would add exactly
   * this edge.
   */
  const g = golemGraph();
  g["clay-golem"].synergies.push({ from: "golem-mastery", kinds: ["hp"], magnitude: 20 });
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "a Golem Mastery edge is caught as unaccounted",
    fired(found, "golem-edge-unaccounted") === 1,
    JSON.stringify(found),
  );
}

{
  // A self-edge, which `checkSynergies` also rejects but which this control
  // states in its own terms.
  const g = golemGraph();
  g["blood-golem"].synergies.push({ from: "blood-golem", kinds: ["hp"], magnitude: 5 });
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check("a golem feeding itself is caught", fired(found, "golem-self-edge") === 1, JSON.stringify(found));
}

{
  // The whole ring absent, which is what dropping the Necromancer from the
  // extraction would look like.
  const found = checkGolemSynergies({}, GOLEM_SYNERGY_CONTROLS);
  check(
    "an empty graph is caught rather than passing vacuously",
    fired(found, "golem-edge-missing") === GOLEM_SYNERGY_CONTROLS.length,
    JSON.stringify(found.map((p) => p.rule)),
  );
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed. The golem magnitudes are pinned in both directions.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
