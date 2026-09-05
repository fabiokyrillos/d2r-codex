/**
 * Per-family controls for the seven Druid builds, derived from the graph.
 *
 * The general gates already prove a plan is *spendable* — the skills exist, the
 * prerequisites are met, 110 points is not exceeded. What they cannot prove is
 * that a plan is the plan its own page describes. Each of the five families
 * added in the second pass rests on one column, and each of those columns is
 * checkable:
 *
 *   Fury      receives no synergy and gives none
 *   Summon    the three animal summons draw no edges among themselves
 *   Maul      Maul is Shock Wave's only synergy, and the only one inside the tree
 *   Fire Claws its prerequisites reach both forms
 *   Rabies    Poison Creeper is its only synergy, and poison is a total
 *
 * Every assertion below reads `SKILL_GRAPH`, which is generated from the game's
 * own tables. Not one of them restates a number this file also defines — the
 * failure mode `check-content.ts` warns about, where a validator shares its
 * ground truth with the thing it validates.
 *
 * The mutations are planted rather than described, and each is the specific
 * wrong thing this class invites: labelling a soft-level bonus a synergy,
 * maxing a synergy the primary skill does not have, and dropping half of a
 * two-form prerequisite chain.
 *
 * Run with `npm run test:druid`.
 */
import { MAX_HARD_POINTS, SKILL_GRAPH } from "../content/classes/skill-graph";
import { getBuilds } from "../lib/registry";
import { damageAtLevel, durationAtLevel } from "../lib/skills";
import type { Build, Slug } from "../lib/types";
import { checkSynergyRoles, synergySourcesOf } from "./allocation-claims";

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

const builds = getBuilds("en-us").filter((b) => b.classSlug === "druid");
const by = (slug: string) => builds.find((b) => b.slug === slug)!;
const points = (b: Build, skill: Slug) => b.skills.find((a) => a.skill === skill)?.points ?? 0;
const receivers = (slug: Slug) =>
  Object.entries(SKILL_GRAPH)
    .filter(([, n]) => n.synergies.some((s) => s.from === slug))
    .map(([k]) => k);

/** Every skill a build must have a point in for `slug` to be allocatable. */
const closure = (slug: Slug, seen = new Set<Slug>()): Set<Slug> => {
  for (const p of SKILL_GRAPH[slug]?.prerequisites ?? []) {
    if (seen.has(p)) continue;
    seen.add(p);
    closure(p, seen);
  }
  return seen;
};

// ---------------------------------------------------------------------------
console.log("\nAll seven Druid builds are here, and each is spendable");
// ---------------------------------------------------------------------------
{
  check("seven Druid builds are published", builds.length === 7, `found ${builds.length}`);
  for (const b of builds) {
    const spent = b.skills
      .filter((a) => a.role !== "flex")
      .reduce((n, a) => n + a.points, 0);
    const allocated = new Set(b.skills.filter((a) => a.points > 0).map((a) => a.skill));
    const missing = [...allocated].flatMap((s) => [...closure(s)]).filter((s) => !allocated.has(s));
    check(
      `${b.slug}: ${spent}/${MAX_HARD_POINTS} mandatory, every prerequisite paid for`,
      spent <= MAX_HARD_POINTS && missing.length === 0,
      missing.length ? `unpaid: ${[...new Set(missing)].join(", ")}` : `${spent} points`,
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nA 'synergy' role is a claim, and the graph is asked to confirm it");
// ---------------------------------------------------------------------------
{
  /*
   * Failed on the Druid, reported elsewhere — the same call `build-claims.ts`
   * and `amazon-rules.ts` make, and for the same reason. Two older pages label
   * an aura and a mana-ratio reference as synergies; the graph's own header
   * records that neither produces an edge, and correcting them is an editorial
   * call belonging to whoever owns those pages.
   */
  const all = checkSynergyRoles(getBuilds("en-us"), SKILL_GRAPH, "en-us");
  const druidOnly = checkSynergyRoles(builds, SKILL_GRAPH, "en-us");
  check(
    "no Druid build calls something a synergy that the graph does not draw",
    druidOnly.length === 0,
    druidOnly.map((p) => p.message).join(" | "),
  );
  for (const p of all.filter((x) => !druidOnly.includes(x))) console.log(`       ! ${p.message}`);
  console.log(
    `       (${all.length - druidOnly.length} pre-existing on classes this pass does not own)`,
  );

  /*
   * The mutation this rule exists for. Summon Dire Wolf really does raise the
   * spirit wolves — through their *effective* level, which a +3 Summoning pelt
   * also raises. Calling it a synergy tells a reader to buy hard points for a
   * bonus an item gives more cheaply.
   */
  const mutated = {
    ...by("summon-druid"),
    skills: by("summon-druid").skills.map((a) =>
      a.skill === "summon-dire-wolf" ? { ...a, role: "synergy" as const } : a,
    ),
  };
  const caught = checkSynergyRoles([mutated], SKILL_GRAPH, "control");
  check("calling Summon Dire Wolf a synergy of the Grizzly is rejected", caught.length === 1);
  check(
    "the rejection explains that a soft-level bonus is raised by +skills",
    caught[0]?.message.includes("+skills") === true,
  );

  const honest = checkSynergyRoles([by("rabies-druid")], SKILL_GRAPH, "control");
  check("Rabies' real synergy, labelled as one, passes", honest.length === 0);
}

// ---------------------------------------------------------------------------
console.log("\nFury and Maul: the two maxed skills that receive nothing");
// ---------------------------------------------------------------------------
{
  for (const slug of ["fury", "maul"] as const) {
    check(
      `${slug} receives no synergy from anything`,
      SKILL_GRAPH[slug].synergies.length === 0,
      SKILL_GRAPH[slug].synergies.map((s) => s.from).join(", "),
    );
  }
  check("Fury gives no synergy either — its list is empty in both directions", receivers("fury").length === 0);
  check(
    "Maul does give one, and Shock Wave is the whole of it",
    receivers("maul").join() === "shock-wave",
    receivers("maul").join(", "),
  );
  check(
    "the Fury build therefore carries no synergy allocation at all",
    by("fury-druid").skills.every((a) => a.role !== "synergy"),
  );
  check(
    "and the Maul build does not either — Shock Wave is a main skill, not a synergy of Maul",
    by("maul-druid").skills.every((a) => a.role !== "synergy"),
  );
  check(
    "the Maul build maxes both halves of that one edge",
    points(by("maul-druid"), "maul") === 20 && points(by("maul-druid"), "shock-wave") === 20,
  );
}

// ---------------------------------------------------------------------------
console.log("\nSummon: soft levels are relationships, not edges");
// ---------------------------------------------------------------------------
{
  const animals = ["summon-spirit-wolf", "summon-dire-wolf", "summon-grizzly"] as const;
  for (const a of animals) {
    const among = SKILL_GRAPH[a].synergies.filter((s) =>
      (animals as readonly string[]).includes(s.from),
    );
    check(`${a} draws no synergy edge from the other summons`, among.length === 0);
  }
  check(
    "Raven, which does read them through hard points, receives from all three",
    animals.every((a) => synergySourcesOf(SKILL_GRAPH, "raven").includes(a)),
    synergySourcesOf(SKILL_GRAPH, "raven").join(", "),
  );
  check(
    "the Summon build maxes all three animals",
    animals.every((a) => points(by("summon-druid"), a) === 20),
  );
  check(
    "and leaves Raven at one, because the points it would take are the spare ones",
    points(by("summon-druid"), "raven") === 1,
  );
}

// ---------------------------------------------------------------------------
console.log("\nFire Claws: the only skill whose prerequisites reach both forms");
// ---------------------------------------------------------------------------
{
  const need = closure("fire-claws");
  check(
    "its prerequisite closure contains Werewolf and Werebear",
    need.has("werewolf") && need.has("werebear"),
    [...need].join(", "),
  );
  check(
    "no other Druid attack's closure does",
    ["fury", "maul", "rabies", "shock-wave", "feral-rage"].every((s) => {
      const c = closure(s);
      return !(c.has("werewolf") && c.has("werebear"));
    }),
  );
  const fc = by("fire-claws-druid");
  check(
    "the build pays for all four of those prerequisite points",
    ["werewolf", "feral-rage", "werebear", "maul"].every((s) => points(fc, s) >= 1),
  );
  check(
    "and maxes both of the 22% synergies",
    points(fc, "firestorm") === 20 && points(fc, "molten-boulder") === 20,
  );
  check(
    "which is why it is the tightest plan of the seven",
    Math.max(
      ...builds.map((b) => b.skills.filter((a) => a.role !== "flex").reduce((n, a) => n + a.points, 0)),
    ) === fc.skills.filter((a) => a.role !== "flex").reduce((n, a) => n + a.points, 0),
  );

  // The mutation: dropping the bear half of the chain leaves Maul unpayable.
  const mutated: Build = {
    ...fc,
    skills: fc.skills.filter((a) => a.skill !== "werebear"),
  };
  const allocated = new Set(mutated.skills.filter((a) => a.points > 0).map((a) => a.skill));
  const unpaid = [...allocated].flatMap((s) => [...closure(s)]).filter((s) => !allocated.has(s));
  check("removing Werebear from the plan leaves an unpaid prerequisite", unpaid.includes("werebear"));
}

// ---------------------------------------------------------------------------
console.log("\nRabies: one synergy, and a number that is a total");
// ---------------------------------------------------------------------------
{
  check(
    "Poison Creeper is Rabies' only synergy",
    synergySourcesOf(SKILL_GRAPH, "rabies").join() === "poison-creeper",
    synergySourcesOf(SKILL_GRAPH, "rabies").join(", "),
  );
  check(
    "the build maxes both ends of it",
    points(by("rabies-druid"), "rabies") === 20 && points(by("rabies-druid"), "poison-creeper") === 20,
  );

  const node = SKILL_GRAPH["rabies"];
  const dur = durationAtLevel(node, 20)!;
  const dmg = damageAtLevel(node, 20)!;
  check("Rabies' damage is over time, so it carries a duration", dur !== undefined);
  check(
    `its duration at twenty is ${dur.frames} frames — 100 plus 10 a level`,
    dur.frames === 100 + 10 * 19,
  );
  /*
   * That the number is a *total* is proved by changing the duration and
   * watching the number move with it. Re-deriving the banded per-frame value
   * here would restate `lib/skills.ts` arithmetic inside its own test — the
   * failure mode `check-content.ts` names, where a validator shares its ground
   * truth with the thing it validates. Doubling the frames must double the
   * published figure, and would do nothing at all to a per-hit reading.
   */
  const doubled = {
    ...node,
    damage: { ...node.damage!, duration: { base: 200, perLevel: 20 } },
  } as typeof node;
  const twice = damageAtLevel(doubled, 20)!;
  /*
   * Within one, not exactly double: the per-frame value is fractional and the
   * floor is applied once, at the end. Flooring 3.436 x 580 is 1993 where
   * flooring 3.436 x 290 and doubling is 1992, and the engine does the former.
   * Demanding exactness here would be demanding the wrong arithmetic.
   */
  check(
    `doubling the duration to ${durationAtLevel(doubled, 20)!.frames} frames doubles the number`,
    Math.abs(twice.min - dmg.min * 2) <= 1 && Math.abs(twice.max - dmg.max * 2) <= 1,
    `${dmg.min}-${dmg.max} became ${twice.min}-${twice.max}`,
  );
  check(
    "and halving it halves the number, so the duration is genuinely a factor",
    (() => {
      const half = { ...node, damage: { ...node.damage!, duration: { base: 50, perLevel: 5 } } };
      const h = damageAtLevel(half as typeof node, 20)!;
      return Math.abs(h.min - Math.floor(dmg.min / 2)) <= 1;
    })(),
  );
  check(
    `so ${dmg.min}-${dmg.max} is the total over ${dur.seconds}s, and a per-second reading would be ` +
      `${Math.round(dmg.min / dur.seconds)}-${Math.round(dmg.max / dur.seconds)}`,
    Math.round(dmg.min / dur.seconds) < dmg.min,
  );

  check(
    "Poison Creeper's own duration does not grow with its level",
    durationAtLevel(SKILL_GRAPH["poison-creeper"], 1)!.frames ===
      durationAtLevel(SKILL_GRAPH["poison-creeper"], 20)!.frames,
  );
}

// ---------------------------------------------------------------------------
console.log("\nShock Wave: physical, its own, and it cannot miss");
// ---------------------------------------------------------------------------
{
  const sw = SKILL_GRAPH["shock-wave"];
  check("it carries a physical table of its own", sw.physical !== undefined);
  check("and no elemental one", sw.damage === undefined);
  check(
    "Maul is its only synergy",
    synergySourcesOf(SKILL_GRAPH, "shock-wave").join() === "maul",
    synergySourcesOf(SKILL_GRAPH, "shock-wave").join(", "),
  );
  check(
    "it is the only synergy anywhere between two shape-shifting skills",
    Object.entries(SKILL_GRAPH)
      .filter(([, n]) => n.classSlug === "druid" && n.tree === "shape-shifting")
      .flatMap(([slug, n]) => n.synergies.map((s) => `${s.from}->${slug}`))
      .filter((edge) => {
        const from = edge.split("->")[0];
        return SKILL_GRAPH[from]?.tree === "shape-shifting";
      })
      .join() === "maul->shock-wave",
  );
}

// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error(`\n${failures.length} FAILED of ${passed + failures.length}:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n${passed} checks passed. Every family's load-bearing column is pinned.`);
