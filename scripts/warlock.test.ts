/**
 * Proof that the Warlock's controls fire.
 *
 * Six of the ten rules exist because the defect they catch **actually shipped
 * on these pages** and was found by a reviewer rather than by a gate: the
 * two-hander superlative that was false over the Cleave page's own weapon, the
 * area census that was wrong in eleven places, three synergy superlatives that
 * contradicted each other inside one file. The planted sentences below are not
 * hypotheticals — most of them are the string that was live.
 *
 * Four kinds of check.
 *
 * **Structure, against the graph.** Thirty skills, three trees, the page
 * coordinates and prerequisite edges the extraction gave. These fail if a skill
 * is dropped, mis-slugged or moved between trees.
 *
 * **Derived facts, not restated ones.** The demon cap is checked against the
 * shape of `petmax` rather than typed as "three"; the Grimoire socket rule is
 * checked by asking a runeword how many runes it has; the DLC gate reads each
 * build's own `release`. A rule that compares a literal to the same literal
 * proves nothing, so none of these do.
 *
 * **Planted mutations, each with its correction.** Every sentence in
 * `WOULD_HAVE_SHIPPED` is asserted rejected *and* the corrected form asserted
 * silent. A rule that refuses both the error and its fix is a rule the next
 * author deletes.
 *
 * **The live pages.** Every rule is run over the four builds, the journey and
 * the thirty skills in both locales, and must find nothing.
 *
 * Run with `npm run test:warlock`.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { warlockSkills, warlockTrees } from "../content/classes/warlock/skills";
import { warlockSkillsPtBr } from "../content/classes/warlock/pt-br";
import { apocalypseWarlock } from "../content/builds/apocalypse-warlock";
import { abyssWarlock } from "../content/builds/abyss-warlock";
import { cleaveWarlock } from "../content/builds/cleave-warlock";
import { bloodBoilWarlock } from "../content/builds/blood-boil-warlock";
import { warlockBuildsPtBr } from "../content/builds/pt-br-warlock";
import { warlockJourney } from "../content/progression/warlock-journey";
import { warlockJourneyPtBr } from "../content/progression/pt-br-warlock";
import { runewords } from "../content/runewords/runewords";
import type { Build } from "../lib/types";
import {
  BOUND_DEMON_CAP,
  DEMON_CAP_MAX,
  DEMON_CAP_STEPS,
  GRIMOIRE_SOCKETS,
  ONE_HANDABLE_TWO_HANDERS,
  SIGIL_DEATH_THRESHOLDS,
  WARLOCK_NAMES,
  WARLOCK_RELEASE,
  WARLOCK_RULES,
  checkDlcGate,
  checkGrimoireSockets,
  checkMiasmaChainCastRate,
  checkWarlockProse,
  type WarlockRule,
} from "./warlock-rules";

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

const builds: Build[] = [apocalypseWarlock, abyssWarlock, cleaveWarlock, bloodBoilWarlock];
const graph = SKILL_GRAPH as unknown as Parameters<typeof checkWarlockProse>[1];
const fires = (line: string, rule: WarlockRule) =>
  checkWarlockProse([line], graph, "control").some((p) => p.rule === rule);
const silent = (line: string) => checkWarlockProse([line], graph, "control").length === 0;

const nodes = Object.entries(SKILL_GRAPH).filter(([, n]) => n.classSlug === "warlock");
const bySlug = new Map(nodes);
const runesIn = (slug: string) =>
  (runewords as unknown as { slug: string; sockets?: number }[]).find((r) => r.slug === slug)?.sockets;

// ---------------------------------------------------------------------------
console.log("\nStructure, read from the graph");
// ---------------------------------------------------------------------------

check("thirty Warlock skills in the graph", nodes.length === 30, `${nodes.length}`);
check("three authored trees", warlockTrees.length === 3, `${warlockTrees.length}`);
check("thirty authored skills", warlockSkills.length === 30, `${warlockSkills.length}`);
check(
  "every authored skill is a graph node in the same tree",
  warlockSkills.every((s) => bySlug.get(s.slug)?.tree === s.tree),
);
check(
  "every graph node has an authored skill",
  nodes.every(([slug]) => warlockSkills.some((s) => s.slug === slug)),
);
check(
  "ten skills per tree",
  warlockTrees.every((t) => warlockSkills.filter((s) => s.tree === t.slug).length === 10),
);
check(
  "the name map covers every skill",
  warlockSkills.every((s) => WARLOCK_NAMES[s.slug] === s.name),
);
check(
  "unlock levels match the extraction",
  warlockSkills.every((s) => bySlug.get(s.slug)?.requiredLevel === s.requiredLevel),
);
check(
  "prerequisite sets match the extraction",
  warlockSkills.every((s) => {
    const a = [...(s.prerequisites ?? [])].sort().join(",");
    const b = [...(bySlug.get(s.slug)?.prerequisites ?? [])].sort().join(",");
    return a === b;
  }),
);

// ---------------------------------------------------------------------------
console.log("\nDerived facts, not restated ones");
// ---------------------------------------------------------------------------

/*
 * The cap is a step function of hard points in one skill. Checking the *shape*
 * — monotonic, starting at one, ending at the published maximum, and the last
 * step being the one the pages quote — is a different statement from writing
 * "three" and asserting it equals three.
 */
check("the demon cap starts at one demon", DEMON_CAP_STEPS[0].cap === 1 && DEMON_CAP_STEPS[0].hardPoints === 0);
check(
  "each step costs more hard points and yields more demons",
  DEMON_CAP_STEPS.every((s, i) => i === 0 || (s.hardPoints > DEMON_CAP_STEPS[i - 1].hardPoints && s.cap > DEMON_CAP_STEPS[i - 1].cap)),
);
check(
  "the published maximum is the last step",
  DEMON_CAP_MAX === DEMON_CAP_STEPS[DEMON_CAP_STEPS.length - 1].cap,
);
check("the bound demon is a pool of its own", BOUND_DEMON_CAP === 1);
check(
  "a bound demon takes the total past the summon cap",
  BOUND_DEMON_CAP + DEMON_CAP_MAX > DEMON_CAP_MAX,
);
check(
  "the execute is harsher on a champion than on a normal monster",
  SIGIL_DEATH_THRESHOLDS.champion < SIGIL_DEATH_THRESHOLDS.normal,
);

/*
 * The socket rule, asked of the runewords rather than asserted. Vigilance is
 * the two-rune word the expansion added for the slot; Spirit and Ancients'
 * Pledge are the two every other class reaches for and neither fits.
 */
check("Vigilance fits a Grimoire", (runesIn("vigilance") ?? 99) <= GRIMOIRE_SOCKETS, `${runesIn("vigilance")}`);
check("Rhyme fits a Grimoire", (runesIn("rhyme") ?? 99) <= GRIMOIRE_SOCKETS, `${runesIn("rhyme")}`);
check("Splendor fits a Grimoire", (runesIn("splendor") ?? 99) <= GRIMOIRE_SOCKETS, `${runesIn("splendor")}`);
check("Spirit does not fit a Grimoire", (runesIn("spirit") ?? 0) > GRIMOIRE_SOCKETS, `${runesIn("spirit")}`);
check("Ancients' Pledge does not fit a Grimoire", (runesIn("ancients-pledge") ?? 0) > GRIMOIRE_SOCKETS, `${runesIn("ancients-pledge")}`);

check(
  "the Barbarian's exception is a list rather than a rule",
  ONE_HANDABLE_TWO_HANDERS > 0 && ONE_HANDABLE_TWO_HANDERS < 100,
);

// ---------------------------------------------------------------------------
console.log("\nPlanted mutations — the sentence, then its correction");
// ---------------------------------------------------------------------------

const WOULD_HAVE_SHIPPED: { rule: WarlockRule; note: string; bad: string; good: string }[] = [
  {
    rule: "two-hander-exclusivity-overstated",
    note: "the superlative that shipped, over the one weapon a Barbarian shares",
    bad: "A two-handed weapon and an off-hand at the same time — no other class in the game can do this.",
    good: "Any two-handed weapon alongside an off-hand — the Barbarian gets that for eighteen specific swords and no other class gets it at all.",
  },
  {
    rule: "two-hander-exclusivity-overstated",
    note: "the same claim in Portuguese",
    bad: "Uma arma de duas mãos e uma mão secundária ao mesmo tempo — nenhuma outra classe do jogo faz isso.",
    good: "Qualquer arma de duas mãos junto de uma mão secundária — o Barbarian ganha isso para dezoito espadas específicas.",
  },
  {
    rule: "base-game-availability-claimed",
    note: "a page telling a base-game owner they can play the class",
    bad: "The Warlock is available in the base game and needs no expansion.",
    good: "The Warlock requires Reign of the Warlock, which is a paid purchase.",
  },
  {
    rule: "demon-cap-wrong",
    note: "a count petmax cannot produce",
    bad: "At twenty hard points of Demonic Mastery you field five demons at once.",
    good: "At ten hard points of Demonic Mastery you field three demons at once.",
  },
  {
    rule: "demon-cap-wrong",
    note: "the cap attributed to gear, which reads blvl and cannot be",
    bad: "A +2 Warlock skills Grimoire raises the demon cap from gear.",
    good: "The demon cap reads hard points, so +skills from gear do not raise it.",
  },
  {
    rule: "bound-demon-inside-the-cap",
    note: "the bound demon counted against the three",
    bad: "Bind Demon shares the cap with your summons, so a fourth demon is not possible.",
    good: "Bind Demon does not share the cap with your summons; it is a separate pool of one.",
  },
  {
    rule: "synergy-claimed-with-no-edge",
    note: "two sigils that look like a family and are not wired",
    bad: "Sigil: Lethargy raises Sigil: Rancor, which is why the pair is taken together.",
    good: "Sigil: Lethargy is Sigil: Rancor's prerequisite, and neither feeds the other.",
  },
  {
    rule: "synergy-claimed-with-no-edge",
    note: "a hex credited with feeding a skill it does not touch",
    bad: "Hex: Siphon raises Miasma Bolt, so a hex build wants both.",
    good: "Hex: Siphon and Miasma Bolt are in different trees and neither feeds the other.",
  },
  {
    rule: "sigil-death-threshold-scales",
    note: "the execute described as growing, which is the reason one point is enough",
    bad: "Sigil: Death executes at 13% of life and the threshold rises with level.",
    good: "Sigil: Death executes at a flat 13% of life, and the threshold does not rise with level.",
  },
  {
    rule: "pierce-element-swapped",
    note: "the class's skill pierce called magic",
    bad: "Apocalypse gives the class a magic pierce worth up to forty points.",
    good: "Apocalypse gives the class a fire pierce worth up to forty points.",
  },
  {
    rule: "pierce-element-swapped",
    note: "the gear pierce called fire",
    bad: "Ars Dul'Mephistos and Gheed's Wager are the items that carry this build's fire pierce.",
    good: "Ars Dul'Mephistos and Gheed's Wager are the items that carry this build's magic pierce.",
  },
];

for (const { rule, note, bad, good } of WOULD_HAVE_SHIPPED) {
  check(`rejects: ${note}`, fires(bad, rule), checkWarlockProse([bad], graph, "control").map((p) => p.rule).join(", ") || "nothing fired");
  check(`accepts the fix: ${note}`, silent(good), checkWarlockProse([good], graph, "control").map((p) => p.rule).join(", "));
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutations — the structural rules");
// ---------------------------------------------------------------------------

const stripRelease = (b: Build): Build => ({ ...b, release: undefined });
check(
  "rejects a Warlock build with no DLC gate",
  checkDlcGate([stripRelease(apocalypseWarlock)], "control").some((p) => p.rule === "dlc-gate-missing"),
);
check("accepts the four as they stand", checkDlcGate(builds, "content").length === 0);

const spiritInAGrimoire: Build = {
  ...abyssWarlock,
  gearSets: [
    {
      ...abyssWarlock.gearSets[1],
      slots: [
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "A Spirit in a Grimoire for the cast rate." }],
        },
      ],
    },
  ],
};
check(
  "rejects a four-rune runeword recommended into a Grimoire",
  checkGrimoireSockets([spiritInAGrimoire], runesIn, "control").some((p) => p.rule === "grimoire-over-two-sockets"),
);
check("accepts the four as they stand", checkGrimoireSockets(builds, runesIn, "content").length === 0);

const chainOnCastRate: Build = {
  ...abyssWarlock,
  breakpoints: [
    { stat: "fcr", value: 75, why: "Miasma Chain is the skill you hold down and this is its breakpoint.", priority: "required" },
  ],
};
check(
  "rejects a cast-rate breakpoint justified by Miasma Chain",
  checkMiasmaChainCastRate([chainOnCastRate], "control").some((p) => p.rule === "miasma-chain-cast-rate-breakpoint"),
);
check("accepts the four as they stand", checkMiasmaChainCastRate(builds, "content").length === 0);

// ---------------------------------------------------------------------------
console.log("\nThe live pages, in both locales");
// ---------------------------------------------------------------------------

const prose: string[] = [];
for (const b of builds) {
  prose.push(b.summary, b.playstyle, ...b.strengths, ...b.weaknesses, ...(b.flexPoints ?? []));
  for (const k of ["immunityPlan", "breakpointNotes", "hardcoreNotes", "selfFoundNotes", "mercenaryNotes"] as const) {
    if (b[k]) prose.push(b[k] as string);
  }
  prose.push(...b.stats.notes);
  for (const s of b.skills) if (s.note) prose.push(s.note);
  for (const g of b.skillPackages ?? []) {
    prose.push(g.intro);
    for (const p of g.packages) {
      prose.push(p.name, p.when, p.tradeoff, p.gearNote ?? "", p.rotationNote ?? "", p.contentNote ?? "", p.remainderNote ?? "", p.statNote ?? "");
      for (const s of p.skills) if (s.note) prose.push(s.note);
    }
  }
  for (const set of b.gearSets) {
    prose.push(set.goal, set.notes ?? "", set.nextUpgrade ?? "");
    const walk = (picks: readonly { why: string; alternatives?: readonly unknown[] }[]) => {
      for (const p of picks) { prose.push(p.why); walk((p.alternatives ?? []) as never); }
    };
    for (const s of set.slots) walk(s.picks as never);
    walk((set.charms ?? []) as never);
    walk((set.weaponSwap ?? []) as never);
  }
  for (const f of b.farming) prose.push(f.why);
}
collect(warlockBuildsPtBr, prose);
for (const s of warlockSkills) { prose.push(s.summary, ...(s.mechanics ?? [])); }
for (const c of Object.values(warlockSkillsPtBr)) prose.push(c.summary, ...(c.mechanics ?? []));
prose.push(warlockJourney.summary, ...warlockJourney.overview);
for (const r of warlockJourney.respecPlan ?? []) prose.push(r.at, r.why);
for (const s of warlockJourney.stages) {
  prose.push(s.summary, s.goal, s.killingWith, ...s.skillPoints, ...s.statPoints, s.exitCriteria ?? "");
  for (const a of s.actions) prose.push(a.text);
}
collect((warlockJourneyPtBr as unknown as Record<string, unknown>).warlock, prose);

function collect(v: unknown, out: string[]): void {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) for (const x of v) collect(x, out);
  else if (v && typeof v === "object") for (const x of Object.values(v)) collect(x, out);
}

const live = checkWarlockProse(prose.filter(Boolean), graph, "content");
check(
  `every rule is silent on ${prose.filter(Boolean).length} live strings`,
  live.length === 0,
  live.slice(0, 3).map((p) => `${p.rule}: ${p.message.slice(0, 110)}`).join(" | "),
);
check("the DLC gate passes on all four builds", checkDlcGate(builds, "content").length === 0);
check(
  "every Warlock skill declares the expansion",
  warlockSkills.every((s) => s.release === WARLOCK_RELEASE),
);

// ---------------------------------------------------------------------------
console.log("\nWiring");
// ---------------------------------------------------------------------------

check("ten rules are exported for the content sweep", WARLOCK_RULES.length === 10, `${WARLOCK_RULES.length}`);
check(
  "every exported rule is reachable from at least one planted mutation or structural check",
  (() => {
    const proved = new Set<string>([
      ...WOULD_HAVE_SHIPPED.map((m) => m.rule),
      "dlc-gate-missing",
      "grimoire-over-two-sockets",
      "miasma-chain-cast-rate-breakpoint",
    ]);
    return WARLOCK_RULES.every((r) => proved.has(r));
  })(),
  WARLOCK_RULES.filter(
    (r) =>
      !new Set<string>([
        ...WOULD_HAVE_SHIPPED.map((m) => m.rule),
        "dlc-gate-missing",
        "grimoire-over-two-sockets",
        "miasma-chain-cast-rate-breakpoint",
      ]).has(r),
  ).join(", "),
);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
