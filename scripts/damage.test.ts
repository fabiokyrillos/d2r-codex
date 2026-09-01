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
import {
  FRAMES_PER_SECOND,
  damageAtLevel,
  durationAtLevel,
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

/** Plague Javelin, verbatim. A different HitShift and a much shorter window. */
const PLAGUE_JAVELIN = node({
  element: "pois",
  hitShift: 3,
  min: { base: 12, bands: [8, 16, 26, 55, 80] },
  max: { base: 18, bands: [8, 16, 26, 55, 80] },
  duration: { base: 75, perLevel: 5 },
  overTime: true,
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
  const gjd = durationAtLevel(PLAGUE_JAVELIN, 1)!;
  check("...over 3 seconds", gjd.frames === 75 && gjd.seconds === 3, `${gjd.seconds}s`);

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
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
