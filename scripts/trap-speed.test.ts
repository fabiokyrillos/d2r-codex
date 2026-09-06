/**
 * Trap-laying speed: the mechanical contract.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Cycle 2 published "Faster Cast Rate is how fast you lay traps" and defended
 * it with three arguments, none of which was evidence:
 *
 *   1. the site's own `fcr-assassin` table said so — circular;
 *   2. published guides name 65 and 102 — those are the *cast* animation's
 *      numbers, and naming them proves only that they were copied;
 *   3. nothing in the extraction contradicted it — an argument from silence,
 *      and the silence was not there: `anim` is the column, and it says `S2`.
 *
 * Every one of those failures is a failure a text-matching test would have
 * missed, because the text was self-consistent. So this file does not check
 * what the pages say. It *derives* the mechanical category from the animation
 * data and then confronts the derivation with a table this project did not
 * write, and only afterwards asks whether the prose agrees with the arithmetic.
 *
 * THE FOUR CLOCKS THIS CONTRACT KEEPS APART
 *   Faster Cast Rate      shortens `anim = SC`. Mind Blast, Cloak of Shadows,
 *                         Fade, Burst of Speed, the shadows, Teleport.
 *   Attack speed          shortens `A1`/`SQ`/`KK`/`TH` — and `S2`.
 *   Trap-laying speed     `anim = S2`, 8 frames at animation speed 128. Weapon
 *                         base speed is an input, so it has no class-wide table.
 *   Trap firing interval  what a sentry does once it is down. Fixed. No stat on
 *                         the character touches it.
 */

import {
  ASSASSIN_CAST_ANIM,
  ASSASSIN_TRAP_ANIM,
  BURST_OF_SPEED_IAS,
  CAST_ANIMATION_SKILLS,
  SPEED_STAT_BY_ANIM,
  TRAP_LAYING_SKILLS,
  TRAP_NINE_FRAME_IAS,
  castFrames,
  checkAssassinClaims,
  effectiveSpeed,
  trapLayingFrames,
} from "./assassin-rules";
import { breakpointTables } from "../content/breakpoints/breakpoints";
import { lightningTrapsin } from "../content/builds/lightning-trapsin";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` (${detail})` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` (${detail})` : ""}`);
  }
};

const caught = (line: string, rule: string) =>
  checkAssassinClaims([line], "mutation").some((p) => p.rule === rule);

// ---------------------------------------------------------------------------
console.log("\nThe animation each family plays");
// ---------------------------------------------------------------------------

check("trap laying is S2, and S2 is on attack speed", SPEED_STAT_BY_ANIM.S2 === "ias");
check("the cast animation is SC, and SC is on cast rate", SPEED_STAT_BY_ANIM.SC === "fcr");
check(
  "no animation family is on both",
  new Set(Object.values(SPEED_STAT_BY_ANIM)).size === 2,
  Object.values(SPEED_STAT_BY_ANIM).join(","),
);
check("eight skills play the trap-laying animation", TRAP_LAYING_SKILLS.length === 8);
check(
  "the two families are disjoint",
  !TRAP_LAYING_SKILLS.some((s) => (CAST_ANIMATION_SKILLS as readonly string[]).includes(s)),
);
check(
  "Fire Blast and Shock Web lay like traps even though they summon nothing",
  ["fire-blast", "shock-web"].every((s) => (TRAP_LAYING_SKILLS as readonly string[]).includes(s)),
);
check(
  "Mind Blast is a cast, not a trap",
  (CAST_ANIMATION_SKILLS as readonly string[]).includes("mind-blast") &&
    !(TRAP_LAYING_SKILLS as readonly string[]).includes("mind-blast"),
);
const castAnim: { length: number; speed: number } = ASSASSIN_CAST_ANIM;
const trapAnim: { length: number; speed: number } = ASSASSIN_TRAP_ANIM;
check(
  "the two animations are not even the same length",
  castAnim.length !== trapAnim.length && castAnim.speed !== trapAnim.speed,
  `SC ${ASSASSIN_CAST_ANIM.length}@${ASSASSIN_CAST_ANIM.speed} vs S2 ${ASSASSIN_TRAP_ANIM.length}@${ASSASSIN_TRAP_ANIM.speed}`,
);

// ---------------------------------------------------------------------------
console.log("\nThe animation data reproduces the table the site already publishes");
// ---------------------------------------------------------------------------

/*
 * Before the animdata may be used for the animation nobody has tabulated, it
 * has to reproduce the one everybody has. `AISC*` = 17 frames at speed 256,
 * pushed through the cast formula, must regenerate `fcr-assassin` exactly.
 */
const fcrAssassin = breakpointTables.find((t) => t.slug === "fcr-assassin");
check("the Assassin cast-rate table is still published", fcrAssassin !== undefined);
if (fcrAssassin) {
  for (const row of fcrAssassin.rows) {
    check(
      `FCR ${row.value}% derives ${row.frames} cast frames`,
      castFrames(row.value) === row.frames,
      `derived ${castFrames(row.value)}`,
    );
  }
  for (const row of fcrAssassin.rows.slice(1)) {
    check(
      `FCR ${row.value}% is minimal — ${row.value - 1}% is a frame slower`,
      castFrames(row.value - 1) > row.frames,
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nEmpirical control: derived trap frames vs independently published data");
// ---------------------------------------------------------------------------

/*
 * The control that separates the hypotheses. `TRAP_NINE_FRAME_IAS` is an
 * outside table — IAS needed for 9-frame trap laying, indexed by both claws'
 * base speed. `trapLayingFrames` was derived from the animdata and the
 * attack-speed formula without sight of it.
 */
const iasNeeded = (frames: number, wsm: number): number | undefined => {
  for (let v = 0; v <= 400; v += 1) if (trapLayingFrames({ ias: v, wsm }) <= frames) return v;
  return undefined;
};

for (const { claws, ias } of TRAP_NINE_FRAME_IAS) {
  const wsm = (claws[0] + claws[1]) / 2;
  check(
    `claws ${claws[0]}/${claws[1]}: 9 frames needs ${ias}% IAS`,
    iasNeeded(9, wsm) === ias,
    `derived ${iasNeeded(9, wsm)}`,
  );
  check(`claws ${claws[0]}/${claws[1]}: ${ias}% actually reaches 9`, trapLayingFrames({ ias, wsm }) === 9);
  check(
    `claws ${claws[0]}/${claws[1]}: ${ias - 1}% does not`,
    trapLayingFrames({ ias: ias - 1, wsm }) > 9,
  );
}

/*
 * And the discriminator itself, stated as an assertion rather than left
 * implicit: if cast rate governed trap laying, one number would serve every
 * claw. The published data takes five different values on the diagonal alone.
 */
const diagonal = TRAP_NINE_FRAME_IAS.filter((r) => r.claws[0] === r.claws[1]).map((r) => r.ias);
check(
  "the same nine frames costs a different amount on every claw",
  new Set(diagonal).size === diagonal.length && diagonal.length === 5,
  diagonal.join(", "),
);
check(
  "which is what a weapon-independent stat could not do",
  Math.max(...diagonal) / Math.min(...diagonal) > 4,
  `${Math.min(...diagonal)}..${Math.max(...diagonal)}`,
);

// ---------------------------------------------------------------------------
console.log("\nThe inputs a universal table would have to ignore");
// ---------------------------------------------------------------------------

check(
  "the claw base alone moves bare laying speed by five frames",
  trapLayingFrames({ wsm: 10 }) === 17 && trapLayingFrames({ wsm: -30 }) === 12,
  `${trapLayingFrames({ wsm: 10 })} vs ${trapLayingFrames({ wsm: -30 })}`,
);
check(
  "Burst of Speed shortens it and Fade does not",
  trapLayingFrames({ sias: BURST_OF_SPEED_IAS.max }) < trapLayingFrames({ sias: 0 }),
);
check(
  "Burst of Speed is added undiminished, unlike item IAS",
  trapLayingFrames({ sias: 60 }) < trapLayingFrames({ ias: 60 }),
);
check("item IAS diminishes", effectiveSpeed(60) < 60 && effectiveSpeed(200) === 75);
check(
  "dual wield averages the two claws",
  trapLayingFrames({ wsm: (-30 + 0) / 2 }) === trapLayingFrames({ wsm: -15 }),
);

// ---------------------------------------------------------------------------
console.log("\nWhat the pages are allowed to say");
// ---------------------------------------------------------------------------

check(
  "the cast-rate table no longer claims to cover trap laying",
  fcrAssassin !== undefined &&
    checkAssassinClaims([fcrAssassin.summary, ...(fcrAssassin.guidance ?? [])], "fcr-assassin")
      .length === 0,
  checkAssassinClaims(
    fcrAssassin ? [fcrAssassin.summary, ...(fcrAssassin.guidance ?? [])] : [],
    "fcr-assassin",
  )
    .map((p) => p.rule)
    .join(", "),
);
check(
  "and says so explicitly rather than by omission",
  /does not govern trap laying/i.test(fcrAssassin?.summary ?? ""),
);

/*
 * A structural check, because the prose rule cannot do this one.
 *
 * `trap-laying-on-cast-rate` needs a cast-rate term *in the sentence* before it
 * will fire. A breakpoint table does not need one: its own `stat` supplies the
 * context, so "It also governs how fast you lay traps." in an `fcr` table's
 * summary is the full claim and names no stat at all. An adversarial pass
 * planted exactly that and the sweep stayed silent.
 *
 * So every cast-rate table is checked against its own `stat` field: if it
 * mentions laying traps, it must be denying it.
 */
const MENTIONS_LAYING = /\b(lay|laying|lays)\b[^.]{0,40}\btraps?\b|\btrap[- ]laying\b|\bcoloca[çc][ãa]o de armadilhas?\b|\bcolocar\b[^.]{0,40}\b(traps?|armadilhas?)\b/i;
const DENIES = /\b(not|never|cannot|can't|does not|doesn't|no longer)\b|(?:^|\s)n[ãa]o\b/i;
for (const table of breakpointTables.filter((t) => t.stat === "fcr")) {
  for (const line of [table.summary, ...(table.guidance ?? [])]) {
    for (const sentence of line.split(/(?<=[.!?])\s+/)) {
      if (!MENTIONS_LAYING.test(sentence)) continue;
      check(
        `${table.slug}: a cast-rate table mentioning trap laying denies it`,
        DENIES.test(sentence),
        sentence.slice(0, 90),
      );
    }
  }
}
check(
  "and says which animation it is",
  fcrAssassin?.variant !== undefined && /cast/i.test(fcrAssassin.variant),
);
check(
  "the Lightning Trapsin publishes no cast-rate target justified by traps",
  lightningTrapsin.breakpoints
    .filter((b) => b.stat === "fcr")
    .every((b) => !/lay|trap/i.test(b.why) || /not|rather than/i.test(b.why)),
);
check(
  "it publishes no single IAS number for laying either",
  lightningTrapsin.breakpoints.every((b) => b.stat !== "ias"),
);
check(
  "but the notes do name attack speed as what governs laying",
  /attack speed/i.test(lightningTrapsin.breakpointNotes ?? ""),
);
check(
  "and give the reader concrete claw scenarios instead of one number",
  ["Runic Talons", "Suwayyah", "42%", "125%", "174%"].every((s) =>
    (lightningTrapsin.breakpointNotes ?? "").includes(s),
  ),
);

/* Every scenario the page prints has to be one this file can re-derive. */
const PUBLISHED_SCENARIOS: { wsm: number; bare: number; nine: number }[] = [
  { wsm: -30, bare: 12, nine: 42 },
  { wsm: -20, bare: 13, nine: 63 },
  { wsm: 0, bare: 15, nine: 125 },
  { wsm: 10, bare: 17, nine: 174 },
];
for (const s of PUBLISHED_SCENARIOS) {
  check(
    `published scenario, base ${s.wsm}: ${s.bare} frames bare`,
    trapLayingFrames({ wsm: s.wsm }) === s.bare,
    `${trapLayingFrames({ wsm: s.wsm })}`,
  );
  check(`published scenario, base ${s.wsm}: 9 frames at ${s.nine}%`, iasNeeded(9, s.wsm) === s.nine);
}

// ---------------------------------------------------------------------------
console.log("\nMutation controls — each of these must be caught");
// ---------------------------------------------------------------------------

const MUTATIONS: { note: string; line: string; rule: string }[] = [
  {
    note: "the regression itself: laying on cast rate",
    line: "**Faster Cast Rate is how fast you lay traps**, not just how fast you cast Mind Blast — the Assassin's table covers both.",
    rule: "trap-laying-on-cast-rate",
  },
  {
    note: "the same claim, pt-BR",
    line: "**Faster Cast Rate é a velocidade com que você coloca traps**, e não só a de conjurar Mind Blast.",
    rule: "trap-laying-on-cast-rate",
  },
  {
    note: "the same claim wearing gear advice",
    line: "20% Faster Cast Rate, which is trap-laying speed.",
    rule: "trap-laying-on-cast-rate",
  },
  {
    note: "cast rate sold as laying speed in a journey step",
    line: "Cast rate is the Assassin's trap-laying speed as well as her spell speed, so this is a damage item.",
    rule: "trap-laying-on-cast-rate",
  },
  {
    note: "the mistake reversed: Mind Blast on attack speed",
    line: "Mind Blast is cast at Increased Attack Speed, so stack IAS to stun faster.",
    rule: "cast-action-on-attack-speed",
  },
  {
    note: "Teleport on attack speed",
    line: "Teleport from an Enigma runs on your attack speed once you are holding claws.",
    rule: "cast-action-on-attack-speed",
  },
  {
    note: "a universal IAS number, weapon unstated",
    line: "Lay traps at 9 frames by reaching 42% Increased Attack Speed.",
    rule: "universal-trap-ias-number",
  },
  {
    note: "the firing interval treated as laying speed",
    line: "More attack speed lets you lay traps that fire their ten shots faster.",
    rule: "firing-interval-as-laying-speed",
  },
  {
    note: "cast rate sold as sentry output",
    line: "Faster Cast Rate makes each Lightning Sentry deal more damage.",
    rule: "cast-rate-for-sentry-output",
  },
  {
    note: "cast rate sold as the sentries' rate of fire",
    line: "Faster Cast Rate shortens the interval between each sentry's shots.",
    rule: "cast-rate-for-sentry-output",
  },
  {
    note: "Fade and Burst of Speed recommended together",
    line: "Keep Fade up for the resistances and Burst of Speed up for the laying speed.",
    rule: "fade-and-burst-together",
  },
];

for (const { note, line, rule } of MUTATIONS) {
  check(`caught: ${note}`, caught(line, rule), checkAssassinClaims([line], "m").map((p) => p.rule).join(", ") || "silent");
}

// ---------------------------------------------------------------------------
console.log("\nSentences that must stay silent");
// ---------------------------------------------------------------------------

const ACCEPTED: { note: string; line: string }[] = [
  {
    note: "the corrected claim",
    line: "Trap-laying speed is attack speed, not Faster Cast Rate: a trap plays the `S2` animation and cast rate does not touch it.",
  },
  {
    note: "the corrected claim, pt-BR",
    line: "A velocidade de colocação é velocidade de ataque, não conjuração: a armadilha usa a animação `S2`.",
  },
  {
    note: "an IAS target that names the claw it is true of",
    line: "On two Runic Talons, base speed −30, nine frames costs 42% Increased Attack Speed.",
  },
  {
    note: "cast rate justified by the thing it governs",
    line: "65% Faster Cast Rate is for Mind Blast, which is the button that opens every pack.",
  },
  {
    note: "the two buffs named with the exclusion stated",
    line: "Fade and Burst of Speed cannot both be up; casting either one drops the other.",
  },
  {
    note: "the firing interval described as fixed",
    line: "How fast a sentry fires once it is down is fixed, and it is not the speed at which you lay it.",
  },
];

for (const { note, line } of ACCEPTED) {
  const problems = checkAssassinClaims([line], "control");
  check(`silent on: ${note}`, problems.length === 0, problems.map((p) => p.rule).join(", "));
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
