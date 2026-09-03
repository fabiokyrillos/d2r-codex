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
import { getSkills } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import {
  damageAtLevel,
  damagePresentation,
  durationAtLevel,
  effectAtLevel,
  unclassifiedElementalAttacks,
} from "../lib/skills";
import {
  CORROBORATED,
  DIVERGENCES,
  GOLEM_SYNERGY_CONTROLS,
  NEVER_PUBLISHES_MANA,
  checkGolemSynergies,
  checkPublishedNumbers,
  publishedReader,
  type NecromancerProblem,
  type PublishedValues,
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
console.log("\nPublished numbers, against the 1.11 documentation");
// ===========================================================================

const read = publishedReader(
  SKILL_GRAPH,
  damageAtLevel as never,
  durationAtLevel as never,
  effectAtLevel as never,
);

check(
  "every corroborated value is what the site publishes",
  checkPublishedNumbers(read, CORROBORATED, DIVERGENCES, NEVER_PUBLISHES_MANA).length === 0,
  JSON.stringify(checkPublishedNumbers(read, CORROBORATED, DIVERGENCES, NEVER_PUBLISHES_MANA)),
);

check(
  "there is something to corroborate",
  CORROBORATED.length > 30 && DIVERGENCES.length > 5,
  `${CORROBORATED.length} / ${DIVERGENCES.length}`,
);

/** A reader that answers from a fixture instead of the graph. */
const fake = (values: Record<string, PublishedValues>) => (slug: string) => values[slug];

{
  /*
   * The failure the poison model exists to prevent. Poison's columns are damage
   * per frame; published without multiplying by the duration they floor to
   * nothing, and Poison Dagger's page reads "0-0" for a skill that deals 540.
   */
  const found = checkPublishedNumbers(
    fake({ "poison-dagger": { damage: { min: 0, max: 0 }, durationSeconds: 2, effects: {} } }),
    CORROBORATED.filter((c) => c.slug === "poison-dagger" && c.level === 1 && c.damage),
    [],
    [],
  );
  check(
    "poison published per frame, flooring to 0-0, is caught",
    found.length === 1 && found[0].rule === "published-value-wrong",
    JSON.stringify(found),
  );
}

{
  // The duration dropped entirely, which is what treating poison like cold
  // would do: the damage lands at once and the window disappears.
  const found = checkPublishedNumbers(
    fake({ "poison-nova": { damage: { min: 50, max: 90 }, effects: {} } }),
    CORROBORATED.filter((c) => c.slug === "poison-nova" && c.durationSeconds !== undefined),
    [],
    [],
  );
  check(
    "poison losing its duration is caught",
    found.length === 2 && found.every((p) => p.rule === "published-missing"),
    JSON.stringify(found.map((p) => p.rule)),
  );
}

{
  // Poison Nova's two seconds turned into a scaling duration, which is what
  // copying Poison Explosion's ELevLen across would produce.
  const found = checkPublishedNumbers(
    fake({ "poison-nova": { damage: { min: 50, max: 90 }, durationSeconds: 9.6, effects: {} } }),
    CORROBORATED.filter((c) => c.slug === "poison-nova" && c.level === 20 && c.durationSeconds),
    [],
    [],
  );
  check(
    "Poison Nova gaining a scaling duration is caught",
    found.length === 1 && found[0].rule === "published-value-wrong",
    JSON.stringify(found),
  );
}

{
  /*
   * The quiet one. A future author reads the 1.11 documentation, decides the
   * site's Bone Armor is wrong, and "fixes" 305 to 210. This is the rule that
   * says no.
   */
  const found = checkPublishedNumbers(
    fake({ "bone-armor": { effects: { effectAbsorbed: 210 } } }),
    [],
    DIVERGENCES.filter((d) => d.slug === "bone-armor"),
    [],
  );
  check(
    "a value moved to agree with the older source is caught",
    found.length === 1 && found[0].rule === "published-matches-stale-source",
    JSON.stringify(found),
  );
}

{
  // Drifting away from both sources at once.
  const found = checkPublishedNumbers(
    fake({ "poison-nova": { damage: { min: 999, max: 999 }, effects: {} } }),
    [],
    DIVERGENCES.filter((d) => d.slug === "poison-nova" && d.level === 1),
    [],
  );
  check(
    "a value that matches neither source is caught",
    found.length === 1 && found[0].rule === "published-value-wrong",
    JSON.stringify(found),
  );
}

{
  // Corpse Explosion's radius converted to the 1.11 yard figure.
  const found = checkPublishedNumbers(
    fake({ "corpse-explosion": { effects: { effectRadiusHalfSquares: 9 } } }),
    [],
    DIVERGENCES.filter((d) => d.slug === "corpse-explosion"),
    [],
  );
  check(
    "the radius converted to the other source's unit is caught",
    found.length === 1 && found[0].rule === "published-matches-stale-source",
    JSON.stringify(found),
  );
}

{
  // A passive priced as though it were cast.
  const found = checkPublishedNumbers(
    fake({ "summon-resist": { effects: { effectMana: 44 } } }),
    [],
    [],
    ["summon-resist"],
  );
  check(
    "a mana cost on a passive is caught",
    found.length === 1 && found[0].rule === "mana-on-passive",
    JSON.stringify(found),
  );
}

// ===========================================================================
console.log("\nDamage models");
// ===========================================================================

{
  const skills = getSkills(DEFAULT_LOCALE);
  const bySlug = new Map(skills.map((s) => [s.slug, s]));

  /*
   * Poison Dagger is a weapon attack that adds poison. Without the model its
   * page prints the poison range and says nothing about the dagger swinging
   * with it, which is the defect `unclassifiedElementalAttacks` exists to catch.
   */
  check(
    "Poison Dagger keeps its weapon component",
    damagePresentation(bySlug.get("poison-dagger")!, SKILL_GRAPH["poison-dagger"]) ===
      "weapon-plus-element",
  );
  check(
    "stripping the model leaves Poison Dagger unclassified",
    unclassifiedElementalAttacks(
      [{ slug: "poison-dagger", kind: "attack", damageModel: undefined }],
      SKILL_GRAPH,
    ).join() === "poison-dagger",
  );
  check(
    "Corpse Explosion is presented as corpse-life, not as no damage",
    damagePresentation(bySlug.get("corpse-explosion")!, SKILL_GRAPH["corpse-explosion"]) ===
      "corpse-life",
  );
  check(
    "dropping that model would announce it deals no damage",
    damagePresentation(
      { kind: "spell", damageModel: undefined },
      SKILL_GRAPH["corpse-explosion"],
    ) === "none",
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
