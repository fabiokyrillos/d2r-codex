/**
 * The damage arithmetic, and the four ways poison goes wrong.
 *
 * Needs no build and no network. Run with `npm run test:damage`.
 *
 * Poison is the only element whose published number is not the number in the
 * columns. `EMin`/`EMax` are damage per *frame*, in 256ths, and the duration
 * they are spread across lives in a separate column that nothing else needs. A
 * reader of the extraction who treats those columns like every other element's
 * gets zero — not a wrong number, a number that says the skill is harmless.
 *
 * So each step of the formula is pinned by a fixture, and each way of dropping
 * a step is planted and proven to change the answer.
 *
 * FORMULA, and where each part comes from
 *   frames(level)  = ELen + ELevLen x (level - 1)          skills.txt
 *   perFrame       = value x 2^(HitShift - 8)              skills.txt
 *   total(level)   = floor(perFrame(value(level)) x frames(level))
 *   seconds        = frames / 25                           D2 runs at 25 fps
 *
 * Checked against the values the game publishes: Poison Javelin at level 1 is
 * 25-37 poison over 8 seconds, and Plague Javelin at level 1 is 28-42 over 3.
 */
import { getSkills } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import {
  FRAMES_PER_SECOND,
  SKILL_GRAPH,
  damageAtLevel,
  durationAtLevel,
  effectAtLevel,
  splitEffects,
  type SkillEffect,
  type SkillGraphNode,
} from "../lib/skills";

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

/** Only the fields the arithmetic reads; the rest of a node is irrelevant here. */
const node = (damage: SkillGraphNode["damage"]) => ({ damage }) as SkillGraphNode;

/** Poison Javelin, verbatim from the pinned extraction. */
const POISON_JAVELIN = node({
  element: "pois",
  hitShift: 0,
  min: { base: 32, bands: [16, 32, 48, 64, 96] },
  max: { base: 48, bands: [16, 36, 52, 68, 100] },
  duration: { base: 200, perLevel: 50 },
  overTime: true,
});

/**
 * Plague Javelin, as the generator emits it.
 *
 * `perLevel` is zero, not the 5 the table still carries. D2R patch 2.4 fixed
 * this skill's poison duration at three seconds without editing the column --
 * `ELevLen` is identical in the pinned 3.3 extraction and in the pre-D2R Lord
 * of Destruction tables beside it -- so the generator overrides it explicitly.
 * See FIXED_DURATION in scripts/generate-skill-graph.ts.
 */
const PLAGUE_JAVELIN = node({
  element: "pois",
  hitShift: 3,
  min: { base: 12, bands: [8, 16, 26, 55, 80] },
  max: { base: 18, bands: [8, 16, 26, 55, 80] },
  duration: { base: 75, perLevel: 0 },
  overTime: true,
});

/** The same skill with the residual column restored: what must never ship. */
const PLAGUE_JAVELIN_UNFIXED = node({
  ...PLAGUE_JAVELIN.damage!,
  duration: { base: 75, perLevel: 5 },
});

/** Freezing Arrow. Cold, and its ELen is a freeze length, so it is not recorded. */
const FREEZING_ARROW = node({
  element: "cold",
  hitShift: 8,
  min: { base: 40, bands: [10, 15, 20, 22, 24] },
  max: { base: 50, bands: [10, 15, 20, 22, 24] },
});

// ===========================================================================
console.log("\nThe published values, reproduced");
// ===========================================================================

{
  const pj = damageAtLevel(POISON_JAVELIN, 1)!;
  check("Poison Javelin level 1 is 25-37", pj.min === 25 && pj.max === 37, `${pj.min}-${pj.max}`);
  const pjd = durationAtLevel(POISON_JAVELIN, 1)!;
  check("...over 8 seconds", pjd.frames === 200 && pjd.seconds === 8, `${pjd.seconds}s`);

  const gj = damageAtLevel(PLAGUE_JAVELIN, 1)!;
  check("Plague Javelin level 1 is 28-42", gj.min === 28 && gj.max === 42, `${gj.min}-${gj.max}`);

  /*
   * Both ends anchored to the patch note, not to the implementation. A test
   * that read level 20 off the code would pass whatever the code did, which is
   * how 6.8 seconds shipped: only the level 1 figures were externally checked,
   * and the level 20 figures were written from the output they were meant to
   * verify.
   */
  for (const level of [1, 20]) {
    const d = durationAtLevel(PLAGUE_JAVELIN, level)!;
    check(
      `Plague Javelin at level ${level} lasts 75 frames, 3.0 s (D2R 2.4, fixed)`,
      d.frames === 75 && d.seconds === 3,
      `${d.frames} frames / ${d.seconds}s`,
    );
  }
  check(
    "Plague Javelin's duration does not change between level 1 and 20",
    durationAtLevel(PLAGUE_JAVELIN, 1)!.frames === durationAtLevel(PLAGUE_JAVELIN, 20)!.frames,
  );

  // Poison Javelin has no such note and must keep its scaling duration.
  check(
    "Poison Javelin still lengthens with level",
    durationAtLevel(POISON_JAVELIN, 20)!.frames === 1150 &&
      durationAtLevel(POISON_JAVELIN, 1)!.frames === 200,
  );

  check("a frame is a twenty-fifth of a second", FRAMES_PER_SECOND === 25);

  // Cold's damage lands at once. Multiplying it by the freeze length would
  // turn 40-50 into five figures.
  const fa = damageAtLevel(FREEZING_ARROW, 1)!;
  check("Freezing Arrow level 1 is 40-50, not multiplied", fa.min === 40 && fa.max === 50, `${fa.min}-${fa.max}`);
  check(
    "a cold skill reports no damage window",
    durationAtLevel(FREEZING_ARROW, 1) === undefined,
  );
}

// ===========================================================================
console.log("\nNothing reads as zero");
// ===========================================================================

{
  // The defect this file exists for. Every level of both poison skills.
  for (const [name, n] of [
    ["Poison Javelin", POISON_JAVELIN],
    ["Plague Javelin", PLAGUE_JAVELIN],
  ] as const) {
    const zeros: number[] = [];
    for (let level = 1; level <= 20; level++) {
      const d = damageAtLevel(n, level)!;
      if (d.min <= 0 || d.max <= 0) zeros.push(level);
    }
    check(`${name} is non-zero at every level 1-20`, zeros.length === 0, `zero at ${zeros.join(", ")}`);
  }

  // Damage must rise with level, or a scaling bug could pass the zero check.
  for (const [name, n] of [
    ["Poison Javelin", POISON_JAVELIN],
    ["Plague Javelin", PLAGUE_JAVELIN],
  ] as const) {
    let monotonic = true;
    for (let level = 2; level <= 20; level++) {
      if (damageAtLevel(n, level)!.min <= damageAtLevel(n, level - 1)!.min) monotonic = false;
    }
    check(`${name} damage rises with every level`, monotonic);
  }
}

// ===========================================================================
console.log("\nPlanted mutations — each dropped step must change the answer");
// ===========================================================================

{
  // 1. The duration stops participating.
  const noDuration = node({ ...POISON_JAVELIN.damage!, duration: undefined, overTime: undefined });
  const d1 = damageAtLevel(noDuration, 1)!;
  check(
    "dropping the duration collapses Poison Javelin to 0-0",
    d1.min === 0 && d1.max === 0,
    `${d1.min}-${d1.max}`,
  );
  check(
    "...which is exactly what the shipped formula must never produce",
    damageAtLevel(POISON_JAVELIN, 1)!.min > 0,
  );

  // 2. `overTime` is dropped but the duration stays: the window is present and
  //    ignored, which is the subtler version of the same bug.
  const notOverTime = node({ ...POISON_JAVELIN.damage!, overTime: undefined });
  check(
    "a duration without overTime is not multiplied in",
    damageAtLevel(notOverTime, 1)!.min === 0,
  );
  check("...and reports no window either", durationAtLevel(notOverTime, 1) === undefined);

  // 3. A low HitShift on its own is what makes the per-frame figure round away.
  const hitShift8 = node({ ...POISON_JAVELIN.damage!, hitShift: 8 });
  check(
    "HitShift is what shrinks the per-frame figure",
    damageAtLevel(hitShift8, 1)!.min === 32 * 200,
    `${damageAtLevel(hitShift8, 1)!.min}`,
  );

  // 4. Per-frame damage presented as if it were the hit.
  const perFrame = 32 * Math.pow(2, 0 - 8);
  check(
    "per-frame damage is not the published number",
    Math.floor(perFrame) === 0 && damageAtLevel(POISON_JAVELIN, 1)!.min === 25,
  );

  // 5. Duration must scale with level, not stay at its base.
  const flat = node({ ...POISON_JAVELIN.damage!, duration: { base: 200, perLevel: 0 } });
  check(
    "a duration that stops growing changes the level 20 answer",
    damageAtLevel(flat, 20)!.min !== damageAtLevel(POISON_JAVELIN, 20)!.min,
  );
  check(
    "the shipped level 20 window is 1150 frames, 46 seconds",
    durationAtLevel(POISON_JAVELIN, 20)!.frames === 1150 &&
      durationAtLevel(POISON_JAVELIN, 20)!.seconds === 46,
  );

  /*
   * 6. The regression this pass exists to prevent: the residual ELevLen finding
   *    its way back into Plague Javelin's duration.
   */
  const unfixed = durationAtLevel(PLAGUE_JAVELIN_UNFIXED, 20)!;
  check(
    "restoring ELevLen would stretch Plague Javelin to 170 frames, 6.8 s",
    unfixed.frames === 170 && Math.abs(unfixed.seconds - 6.8) < 1e-9,
    `${unfixed.frames} frames / ${unfixed.seconds}s`,
  );
  check(
    "...and would inflate its level 20 damage far past the fixed-duration figure",
    damageAtLevel(PLAGUE_JAVELIN_UNFIXED, 20)!.min > damageAtLevel(PLAGUE_JAVELIN, 20)!.min,
  );
  check(
    "the shipped skill is the fixed one, not the unfixed one",
    durationAtLevel(PLAGUE_JAVELIN, 20)!.frames !== unfixed.frames,
  );
}

// ===========================================================================
console.log("\nDerived quantities — three shapes, and the one that has no curve");
// ===========================================================================

{
  const linear = (base: number, perLevel: number, cap?: number) =>
    ({ labelKey: "x", unit: "count", shape: { kind: "linear", base, perLevel, cap } }) as SkillEffect;
  const step = (base: number, per: number) =>
    ({ labelKey: "x", unit: "count", shape: { kind: "step", base, per } }) as SkillEffect;
  const range = (min: number, max: number) =>
    ({ labelKey: "x", unit: "percent", shape: { kind: "range", min, max } }) as SkillEffect;

  // Lightning Fury: 2 bolts at level 1, one more per level.
  check("linear starts at its base", effectAtLevel(linear(2, 1), 1) === 2);
  check("linear reaches 21 at level 20", effectAtLevel(linear(2, 1), 20) === 21);
  // Multiple Shot's cap, and Strafe's.
  check("a cap holds", effectAtLevel(linear(4, 1, 10), 20) === 10);
  check("...and does not clamp below it", effectAtLevel(linear(4, 1, 10), 5) === 8);

  // Charged Strike: one more bolt every five levels, integer division.
  check("step starts at its base", effectAtLevel(step(3, 5), 1) === 3);
  check("step is 7 at level 20", effectAtLevel(step(3, 5), 20) === 7);
  check("step does not move between thresholds", effectAtLevel(step(3, 5), 9) === 4);

  /*
   * The one that matters. These five skills state a floor and a ceiling and no
   * formula between them; interpolating would draw a line the game does not.
   */
  check("a range yields no per-level value", effectAtLevel(range(5, 80), 10) === undefined);
  check("...at level 1 either", effectAtLevel(range(5, 80), 1) === undefined);

  const split = splitEffects({ effects: [linear(2, 1), range(5, 80), step(3, 5)] });
  check(
    "ranges are separated from scaling effects",
    split.scaling.length === 2 && split.ranges.length === 1,
  );
  check("a node with no effects splits to nothing", splitEffects({}).scaling.length === 0);
}

// ===========================================================================
console.log("\nThe shipped effect data");
// ===========================================================================

{
  /** slug -> [value at level 1, value at level 20] */
  const scalingExpected: Record<string, [number, number]> = {
    "lightning-fury": [2, 21],
    "lightning-strike": [2, 21],
    "charged-strike": [3, 7],
    "multiple-shot": [2, 21],
    strafe: [4, 10],
    penetrate: [35, 225],
  };
  for (const [slug, [atOne, atTwenty]] of Object.entries(scalingExpected)) {
    const scaling = splitEffects(SKILL_GRAPH[slug] ?? {}).scaling;
    check(`${slug} publishes one scaling quantity`, scaling.length === 1, `${scaling.length}`);
    if (scaling.length !== 1) continue;
    check(
      `${slug}: ${atOne} at level 1, ${atTwenty} at level 20`,
      effectAtLevel(scaling[0], 1) === atOne && effectAtLevel(scaling[0], 20) === atTwenty,
      `${effectAtLevel(scaling[0], 1)} / ${effectAtLevel(scaling[0], 20)}`,
    );
  }

  /** slug -> [minimum, ceiling] */
  const boundedExpected: Record<string, [number, number]> = {
    "critical-strike": [5, 80],
    dodge: [10, 65],
    avoid: [15, 75],
    evade: [10, 65],
    pierce: [10, 100],
  };
  for (const [slug, [min, max]] of Object.entries(boundedExpected)) {
    const ranges = splitEffects(SKILL_GRAPH[slug] ?? {}).ranges;
    check(`${slug} publishes a bounded chance`, ranges.length === 1);
    if (ranges.length !== 1) continue;
    const shape = ranges[0].shape as { kind: "range"; min: number; max: number };
    check(
      `${slug}: ${min}% to ${max}%`,
      shape.min === min && shape.max === max,
      `${shape.min}-${shape.max}`,
    );
  }

  /*
   * The Necromancer's diminishing-return values, which the game writes as `dmNN`
   * columns and evaluates on a curve that is in the engine and in no column read
   * here. They are `range` for the same reason the Amazon's passives are: two
   * numbers and a sentence is what the data supports, and interpolating between
   * them would draw a line the game does not.
   */
  const diminishingExpected: Record<string, [number, number]> = {
    "clay-golem": [0, 75],
    "blood-golem": [75, 150],
    "summon-resist": [20, 75],
    "fire-golem": [25, 100],
    "lower-resist": [25, 70],
  };
  for (const [slug, [min, max]] of Object.entries(diminishingExpected)) {
    const ranges = splitEffects(SKILL_GRAPH[slug] ?? {}).ranges;
    check(`${slug} publishes a bounded value`, ranges.length === 1, `${ranges.length}`);
    if (ranges.length !== 1) continue;
    const shape = ranges[0].shape as { kind: "range"; min: number; max: number };
    check(
      `${slug}: ${min}% to ${max}%`,
      shape.min === min && shape.max === max,
      `${shape.min}-${shape.max}`,
    );
    // The point of the shape: no per-level number is invented for it.
    check(
      `${slug} refuses to state a per-level value`,
      effectAtLevel(ranges[0], 10) === undefined,
    );
  }

  /*
   * Anti-vacuity, per class rather than as one number.
   *
   * This read "exactly the eleven mapped skills carry effects" — true when the
   * Amazon was the only class with a mapping, and a count that says nothing
   * about which class lost coverage when it changes. Every Necromancer skill
   * publishes at least one quantity; every Paladin and Sorceress skill still
   * publishes none, and that is a scope fact worth failing on rather than a
   * total worth updating.
   */
  const perClass = new Map<string, number>();
  for (const node of Object.values(SKILL_GRAPH)) {
    if ((node.effects ?? []).length === 0) continue;
    perClass.set(node.classSlug, (perClass.get(node.classSlug) ?? 0) + 1);
  }
  const expectedPerClass: Record<string, number> = {
    amazon: 11,
    necromancer: 30,
    /*
     * Twenty-nine of the Druid's thirty. The one that publishes nothing is
     * Arctic Blast, and it is a decision rather than an oversight: it is
     * channelled, so its cost is charged per frame and reads as 0.4 mana beside
     * Hurricane's 30, and the row's remaining parameters are a missile's flight
     * time. Both are in prose on the page, where a sentence can carry the unit
     * the table has no column for.
     */
    druid: 29,
  };
  for (const [classSlug, expected] of Object.entries(expectedPerClass)) {
    check(
      `${classSlug}: ${expected} skills publish an effect`,
      perClass.get(classSlug) === expected,
      `${perClass.get(classSlug) ?? 0}`,
    );
  }
  check(
    "no other class publishes one",
    [...perClass.keys()].every((c) => c in expectedPerClass),
    [...perClass.keys()].join(", "),
  );
}

// ===========================================================================
console.log("\nHow the javelin strikes compose their damage");
// ===========================================================================

/*
 * REFERENCE IMPLEMENTATION, and what it is not.
 *
 * The classifications below were settled against D2MOO
 * (github.com/ThePhrozenKeep/D2MOO, source/D2Game/src/SKILLS/SkillAma.cpp), a
 * community reimplementation of *legacy* Diablo II -- its comments carry
 * D2Game.dll addresses like 0x6FCF3280. It is **not** Blizzard's D2R 3.3
 * source, and nothing here presents it as such. It is used the way the source
 * registry uses any reverse-engineering reference: to explain a data column
 * whose meaning the tables do not state, then reconciled against the pinned
 * D2R 3.3 extraction.
 *
 * What it settles, in one line of code each:
 *
 *   SKILLS_SrvSt06_PowerStrike_ChargedStrike  (both skills share this stage)
 *     hit check via SUNITDMG_GetResultFlags, then on a hit the skill's
 *     elemental damage is rolled, and SUNITDMG_AllocCombat is called with
 *     `pSkillsTxtRecord->nSrcDam` passed straight through. Power Strike's is
 *     128; Charged Strike's is empty. No fallback.
 *
 *   SKILLS_SrvSt10_LightningStrike
 *     the same hit check, the same elemental roll, and then:
 *         uint8_t nSrcDam = pSkillsTxtRecord->nSrcDam;
 *         if (!nSrcDam) nSrcDam = 0x80u;
 *     0x80 is 128, so an empty column becomes 100% of the weapon's damage.
 *
 * That single conditional is the whole difference, and it is why Lightning
 * Strike carries the weapon and Charged Strike does not. An earlier pass here
 * read the two as identical because both have an empty SrcDam column, and
 * published that Lightning Strike deals no weapon damage. It does.
 *
 *   SKILLS_SrvDo011_ChargedStrike / SKILLS_SrvDo014_LightningStrike
 *     both drain durability and both create their secondary component --
 *     Charged Bolts and the chain -- separately from the strike stage.
 */
{
  const model = (slug: string) => getSkills(DEFAULT_LOCALE).find((s) => s.slug === slug)?.damageModel;

  check(
    "Lightning Strike carries the weapon: SrvSt10 substitutes 0x80 for an empty SrcDam",
    model("lightning-strike") === "weapon-plus-element",
    `${model("lightning-strike")}`,
  );
  check(
    "Lightning Strike is no longer classified element-only",
    model("lightning-strike") !== "element-only-attack",
  );
  check(
    "Charged Strike does not: SrvSt06 passes SrcDam through unchanged",
    model("charged-strike") === "element-only-attack",
    `${model("charged-strike")}`,
  );
  check(
    "Power Strike shares SrvSt06 but carries SrcDam 128, so it keeps the weapon",
    model("power-strike") === "weapon-plus-element",
    `${model("power-strike")}`,
  );

  /*
   * The two stages differ only in the fallback, so the two skills must not be
   * allowed to drift back into agreeing. This fails if either is edited to
   * match the other.
   */
  check(
    "the two strikes are classified differently, as their stages are written",
    model("charged-strike") !== model("lightning-strike"),
  );

  // Every javelin strike rolls against attack rating, whatever it carries --
  // so "no weapon damage" must never be read as "no attack".
  for (const slug of ["charged-strike", "lightning-strike", "power-strike"]) {
    const skill = getSkills(DEFAULT_LOCALE).find((s) => s.slug === slug)!;
    check(`${slug} is an attack, not a spell`, skill.kind === "attack");
  }

  // The secondary component is a count, created separately from the strike.
  for (const [slug, atOne, atTwenty] of [
    ["charged-strike", 3, 7],
    ["lightning-strike", 2, 21],
  ] as const) {
    const scaling = splitEffects(SKILL_GRAPH[slug] ?? {}).scaling;
    check(
      `${slug} publishes its secondary count (${atOne} -> ${atTwenty})`,
      scaling.length === 1 &&
        effectAtLevel(scaling[0], 1) === atOne &&
        effectAtLevel(scaling[0], 20) === atTwenty,
    );
  }
}

// ===========================================================================
console.log("\nConversion is read off the missile, not off the damage table");
// ===========================================================================

{
  /*
   * `DmgCalc1` of `dl12` is the game's "% Damage Dealt as Elemental". Four
   * missiles in the game declare it, all Amazon. Magic Arrow is the reason this
   * is separate from `damage`: it converts and has no elemental range at all,
   * so a rule keyed on the damage table let it fall into the generic `weapon`
   * bucket while its own prose said it converted.
   */
  const expected: Record<string, [string, number, number]> = {
    "magic-arrow": ["mag", 5, 2],
    "fire-arrow": ["fire", 3, 2],
    "cold-arrow": ["cold", 3, 2],
    "lightning-bolt": ["ltng", 100, 0],
  };
  const converting = Object.entries(SKILL_GRAPH).filter(([, n]) => n.conversion);
  check(
    "exactly four skills declare a conversion",
    converting.length === 4,
    converting.map(([s]) => s).join(", "),
  );
  for (const [slug, [element, base, perLevel]] of Object.entries(expected)) {
    const c = SKILL_GRAPH[slug]?.conversion;
    check(
      `${slug} converts ${base}% +${perLevel}%/level to ${element}`,
      c?.element === element && c?.base === base && c?.perLevel === perLevel,
      JSON.stringify(c),
    );
  }

  // Magic Arrow has no elemental table, and must still be classified.
  check("Magic Arrow has no elemental table", SKILL_GRAPH["magic-arrow"]?.damage === undefined);
  check(
    "...and is still classified as converting, not as a plain weapon attack",
    getSkills(DEFAULT_LOCALE).find((s) => s.slug === "magic-arrow")?.damageModel ===
      "weapon-converted-to-element",
  );

  // The converted share is derived and tabulated, not written into prose.
  const ma = splitEffects(SKILL_GRAPH["magic-arrow"] ?? {}).scaling;
  check("Magic Arrow tabulates its converted share", ma.length === 1);
  check(
    "...5% at level 1, 43% at level 20",
    effectAtLevel(ma[0], 1) === 5 && effectAtLevel(ma[0], 20) === 43,
    `${effectAtLevel(ma[0], 1)} / ${effectAtLevel(ma[0], 20)}`,
  );

  // Fire and Cold Arrow convert AND add elemental damage; both facts survive.
  for (const slug of ["fire-arrow", "cold-arrow"]) {
    check(
      `${slug} keeps its own elemental range alongside the conversion`,
      Boolean(SKILL_GRAPH[slug]?.damage) && Boolean(SKILL_GRAPH[slug]?.conversion),
    );
  }
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
