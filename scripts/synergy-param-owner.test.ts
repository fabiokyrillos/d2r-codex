/**
 * Proof that a synergy's kind and magnitude are read from the row that owns the
 * parameter, not from the row that reads it.
 *
 * THE DEFECT
 * ----------
 * A skill's calc column can scale a synergy two ways:
 *
 *   (skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8    the receiver's par8
 *   skill('IronGolem'.blvl)*skill('IronGolem'.par8)         Iron Golem's par8
 *
 * The extractor matched `par(\d+)` anywhere in the expression and looked the
 * index up on the receiving skill's own row. For every Paladin, Sorceress and
 * Amazon expression that is right, because every one of them is the first shape.
 * The Necromancer's golems are the second, and there the two rows disagree about
 * both facts at once: Clay Golem's `*Param8 Description` reads "Clay Golem
 * Attack Rating synergy" with a value of 20, while the bonus it *receives* from
 * the Iron Golem is armour, at 35.
 *
 * So the wrong reading does not merely mislabel a number. It publishes the
 * synergy a skill **gives** in the row describing what it **gets**, on every
 * golem page, in both directions.
 *
 * WHAT IS PROVEN HERE
 * -------------------
 * Fixtures rather than the shipped graph, for the same reason `check-content.test.ts`
 * uses them: a rule tested only against content that already passes cannot show
 * which input it rejects. Each mutation below is the wrong answer someone would
 * actually get — the receiver's parameter, a swapped donor, a parameter that is
 * not there, a description nobody has classified, and a magnitude off by the
 * other golem's number.
 *
 * Run with `npm run test:synergy-owner`.
 */
import { synergiesFor, type SkillRow } from "./skill-graph-rules";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Runs the extractor over a set of rows, keyed for donor resolution. */
const extract = (rows: SkillRow[], receiver: string) => {
  const byName = new Map(rows.map((r) => [r.skill, r]));
  const row = byName.get(receiver);
  if (!row) throw new Error(`fixture has no row for ${receiver}`);
  return synergiesFor(row, byName);
};

const threw = (run: () => unknown): string | undefined => {
  try {
    run();
    return undefined;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

// ===========================================================================
console.log("\nReceiver-owned parameters — the shape three classes already ship");
// ===========================================================================

/*
 * Blessed Hammer, reduced to the columns the rule reads. Blessed Aim carries a
 * synergy-labelled par8 of its own, with a different kind and a different value,
 * and it must not reach this edge: the parameter governing the expression is the
 * receiver's.
 */
const HAMMER: SkillRow[] = [
  {
    skill: "Blessed Hammer",
    EDmgSymPerCalc: "(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8",
    Param8: 14,
    "*Param8 Description": "Damage synergy",
  },
  { skill: "Vigor" },
  { skill: "Blessed Aim", Param8: 5, "*Param8 Description": "Attack Rating % passive synergy" },
];

{
  const found = extract(HAMMER, "Blessed Hammer");
  check(
    "both sources are found, both as damage",
    found.length === 2 && found.every((s) => s.kinds.join() === "damage"),
    JSON.stringify(found),
  );
  check(
    "sorted by source slug",
    found.map((s) => s.from).join() === "blessed-aim,vigor",
    JSON.stringify(found.map((s) => s.from)),
  );
  /*
   * The negative control for the whole change. A receiver-owned parameter is the
   * receiver's, so no magnitude travels — and emitting one here would have
   * rewritten every one of the ninety nodes this fix was required not to touch.
   */
  check(
    "a receiver-owned parameter carries no magnitude into the edge",
    found.every((s) => s.magnitude === undefined),
    JSON.stringify(found),
  );
  // Planted: the source's own par8 is a different kind. Reading it would have
  // called Blessed Hammer's Blessed Aim synergy an attack-rating bonus.
  check(
    "the source's own parameter is not consulted for a receiver-owned edge",
    !found.some((s) => s.kinds.includes("attack-rating")),
    JSON.stringify(found),
  );
}

// ===========================================================================
console.log("\nSource-owned parameters — the golem ring");
// ===========================================================================

/*
 * Clay Golem reading the Iron Golem, exactly as the pinned tables write it. The
 * two rows disagree on kind and on value, which is what makes this the case the
 * old rule got wrong in both fields at once.
 */
const golems = (over: Partial<Record<string, SkillRow>> = {}): SkillRow[] => [
  over["Clay Golem"] ?? {
    skill: "Clay Golem",
    passivecalc4: "skill('IronGolem'.blvl)*skill('IronGolem'.par8)",
    Param8: 20,
    "*Param8 Description": "Clay Golem Attack Rating synergy",
  },
  over["IronGolem"] ?? {
    skill: "IronGolem",
    Param8: 35,
    "*Param8 Description": "Iron Golem Armor synergy",
  },
  over["BloodGolem"] ?? {
    skill: "BloodGolem",
    Param8: 5,
    "*Param8 Description": "Blood Golem HP % synergy",
  },
];

{
  const found = extract(golems(), "Clay Golem");
  check(
    "the edge is armour at 35 — the donor's kind and the donor's value",
    found.length === 1 &&
      found[0].from === "iron-golem" &&
      found[0].kinds.join() === "armor" &&
      found[0].magnitude === 35,
    JSON.stringify(found),
  );
  // Planted mutation 1: read the receiver's parameter instead.
  check(
    "the receiver's own kind never reaches the edge",
    !found[0].kinds.includes("attack-rating"),
    JSON.stringify(found),
  );
  // Planted mutation 2: take the receiver's magnitude instead.
  check(
    "the receiver's own magnitude never reaches the edge",
    found[0].magnitude !== 20,
    JSON.stringify(found),
  );
}

{
  // Planted mutation 3: the donor is swapped — Iron Golem's level is still what
  // scales, but the coefficient now belongs to the Blood Golem. The kind follows
  // the parameter, and the magnitude stops travelling because it is no longer a
  // property of the edge's source.
  const swapped = golems({
    "Clay Golem": {
      skill: "Clay Golem",
      passivecalc4: "skill('IronGolem'.blvl)*skill('BloodGolem'.par8)",
      Param8: 20,
      "*Param8 Description": "Clay Golem Attack Rating synergy",
    },
  });
  const found = extract(swapped, "Clay Golem");
  check(
    "swapping the donor changes the kind and drops the magnitude",
    found.length === 1 &&
      found[0].from === "iron-golem" &&
      found[0].kinds.join() === "hp" &&
      found[0].magnitude === undefined,
    JSON.stringify(found),
  );
}

{
  // Planted mutation 4: the referenced parameter does not exist on the donor.
  const missing = golems({
    "Clay Golem": {
      skill: "Clay Golem",
      passivecalc4: "skill('IronGolem'.blvl)*skill('IronGolem'.par7)",
      Param8: 20,
      "*Param8 Description": "Clay Golem Attack Rating synergy",
    },
  });
  const message = threw(() => extract(missing, "Clay Golem"));
  check(
    "a parameter the donor does not have fails loudly",
    message !== undefined && message.includes("Param7") && message.includes("IronGolem"),
    message ?? "no error thrown",
  );
}

{
  // A donor that is not in the extraction at all.
  const message = threw(() =>
    extract(
      [
        {
          skill: "Clay Golem",
          passivecalc4: "skill('Nonexistent Golem'.blvl)*skill('Nonexistent Golem'.par8)",
        },
      ],
      "Clay Golem",
    ),
  );
  check(
    "a donor skill that does not resolve fails loudly",
    message !== undefined && message.includes("Nonexistent Golem"),
    message ?? "no error thrown",
  );
}

{
  // Planted mutation 5: a description nobody has classified. Silently dropping
  // it would lose the edge; defaulting to "damage" would mislabel it.
  const unknown = golems({
    IronGolem: {
      skill: "IronGolem",
      Param8: 35,
      "*Param8 Description": "Iron Golem Sparkle synergy",
    },
  });
  const message = threw(() => extract(unknown, "Clay Golem"));
  check(
    "an unclassified synergy description fails loudly",
    message !== undefined && message.includes("unknown synergy kind"),
    message ?? "no error thrown",
  );
}

{
  // A synergy-labelled parameter with no numeric value: the kind is known and
  // the magnitude is not, which must not silently become an edge without one.
  const valueless = golems({
    IronGolem: { skill: "IronGolem", "*Param8 Description": "Iron Golem Armor synergy" },
  });
  const message = threw(() => extract(valueless, "Clay Golem"));
  check(
    "a synergy parameter with no value fails loudly",
    message !== undefined && message.includes("carries no"),
    message ?? "no error thrown",
  );
}

// ===========================================================================
console.log("\nShapes that are deliberately not edges");
// ===========================================================================

{
  // Blessed Aim scaling its own passive. `checkSynergies` rejects a self-edge,
  // so it must never be produced in the first place.
  const found = extract(
    [
      {
        skill: "Blessed Aim",
        passivecalc1: "skill('Blessed Aim'.blvl) * par8",
        Param8: 5,
        "*Param8 Description": "Attack Rating % passive synergy",
      },
    ],
    "Blessed Aim",
  );
  check("a skill scaling itself produces no edge", found.length === 0, JSON.stringify(found));
}

{
  /*
   * Revive. Skeleton Mastery's parameters are named "Revive Synergy ..." and are
   * read through `.lvl`, the effective level — so gear +skills raise them, which
   * no real synergy does. Listed in SOFT_LEVEL_SYNERGIES, and therefore not an
   * edge.
   */
  const rows: SkillRow[] = [
    {
      skill: "Revive",
      calc1: "par1+skill('Skeleton Mastery'.lvl) * skill('Skeleton Mastery'.par3)",
      Param1: 200,
      "*Param1 Description": "HP %",
    },
    {
      skill: "Skeleton Mastery",
      Param3: 5,
      "*Param3 Description": "Revive Synergy HP % per level",
    },
  ];
  const found = extract(rows, "Revive");
  check(
    "a soft-level reference on a listed skill produces no edge",
    found.length === 0,
    JSON.stringify(found),
  );

  /*
   * The same shape on a skill nobody has ruled on must stop the generator
   * rather than disappear.
   *
   * The stand-in is deliberately not a real skill, and that is the correction
   * this line carries. It used to be "Summon Grizzly", written when the Druid
   * was out of scope and named because this is the shape his summons were
   * expected to arrive in. They did arrive in it, they were ruled on, and the
   * moment the Grizzly joined SOFT_LEVEL_SYNERGIES this control started
   * asserting that a listed skill is unlisted — passing right up to the commit
   * that disarmed it, then failing for a reason that had nothing to do with the
   * rule.
   *
   * A name no skill can ever have cannot be listed, so the control cannot be
   * turned off by a decision made somewhere else.
   */
  const unlisted = rows.map((r) =>
    r.skill === "Revive" ? { ...r, skill: "No Skill By This Name" } : r,
  );
  const message = threw(() => extract(unlisted, "No Skill By This Name"));
  check(
    "the same shape on an unlisted skill fails loudly",
    message !== undefined && message.includes("SOFT_LEVEL_SYNERGIES"),
    message ?? "no error thrown",
  );
}

{
  // A parameter that is not described as a synergy governs nothing, whoever
  // owns it. Hydra's summon columns are the shipped example.
  const found = extract(
    [
      {
        skill: "Hydra",
        sumsk2calc: "skill('Fire Bolt'.blvl)",
        Param2: 3,
        "*Param2 Description": "Missiles created per level",
      },
      { skill: "Fire Bolt" },
    ],
    "Hydra",
  );
  check("a non-synergy parameter produces no edge", found.length === 0, JSON.stringify(found));
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed. Parameter ownership is proven in both directions.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
