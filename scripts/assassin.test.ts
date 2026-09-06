/**
 * Proof that the Assassin's controls fire.
 *
 * The class arrives with thirty skills and no build pages, so there is no
 * shipped mistake to plant here the way `freeze-length.test.ts` plants six. What
 * there is instead is a set of sentences that are *true of another class* and
 * would read as perfectly ordinary on these pages — which is the failure mode
 * the whole file is written against.
 *
 * Three kinds of check.
 *
 * **Structure, against the graph.** Thirty skills, three trees, the positions
 * and prerequisites the extraction gave, and the two disjoint sets the martial
 * arts tree is built out of. These fail if a skill is dropped, mis-slugged or
 * moved.
 *
 * **Derived arithmetic.** The blade share is computed from `SrcDam` rather than
 * typed as 75%, and the charge duration in seconds from the frame count. If the
 * pinned extraction ever gives different columns these numbers move, and the
 * prose quoting them fails in `check:content`.
 *
 * **Planted mutations.** Every sentence in `WOULD_HAVE_SHIPPED` is one a writer
 * would plausibly produce from knowing another class: the weapon scaling that is
 * true of every attack except a kick, the shield block that is true of every
 * blocker except this one, the poison that ticks for seconds like every poison
 * except this one. Each is asserted rejected, and its corrected form asserted
 * silent — a rule that refuses both the error and the fix is a rule the next
 * author deletes.
 *
 * Run with `npm run test:assassin`.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { assassinSkills, assassinTrees } from "../content/classes/assassin/skills";
import {
  ASSASSIN_RULES,
  BLADE_SKILLS,
  BLADE_WEAPON_DENOMINATOR,
  BLADE_WEAPON_NUMERATOR,
  BLADE_WEAPON_SHARE,
  CHARGE_DURATION_FRAMES,
  CHARGE_UPS,
  FINISHERS,
  FRAMES_PER_SECOND,
  KICKS,
  SHADOW_LIMIT,
  SHADOW_SLUGS,
  TRAP_LIMIT,
  TRAP_SLUGS,
  VENOM_POISON_FRAMES,
  checkAssassinClaims,
  type AssassinRule,
} from "./assassin-rules";

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

const fires = (line: string, rule: AssassinRule) =>
  checkAssassinClaims([line], "control").some((p) => p.rule === rule);
const silent = (line: string) => checkAssassinClaims([line], "control").length === 0;

const nodes = Object.entries(SKILL_GRAPH).filter(([, n]) => n.classSlug === "assassin");
const bySlug = new Map(nodes);

// ===========================================================================
console.log("\nThe class is complete and where the extraction put it");
// ===========================================================================
{
  check("thirty skills in the graph", nodes.length === 30, `${nodes.length}`);
  check("thirty skills authored", assassinSkills.length === 30, `${assassinSkills.length}`);
  check("three trees authored", assassinTrees.length === 3, `${assassinTrees.length}`);

  const authored = new Set(assassinSkills.map((s) => s.slug));
  const graphed = new Set(nodes.map(([slug]) => slug));
  const missing = [...graphed].filter((s) => !authored.has(s));
  const extra = [...authored].filter((s) => !graphed.has(s));
  check("every graph node is authored", missing.length === 0, missing.join(", "));
  check("no authored skill is absent from the graph", extra.length === 0, extra.join(", "));

  // Ten per tree, which is what a 3x10 skill window means.
  for (const tree of ["martial-arts", "shadow-disciplines", "traps"]) {
    const n = assassinSkills.filter((s) => s.tree === tree).length;
    check(`${tree}: ten skills`, n === 10, `${n}`);
  }

  // The six internal identifiers must not have reached a slug.
  for (const forbidden of [
    "fire-trauma",
    "shock-field",
    "wake-of-fire-sentry",
    "inferno-sentry",
    "quickness",
    "royal-strike",
  ]) {
    check(`"${forbidden}" is not a published slug`, !graphed.has(forbidden));
  }
}

// ===========================================================================
console.log("\nCharge-ups and finishers are two disjoint sets");
// ===========================================================================
{
  check("six charge-ups", CHARGE_UPS.length === 6);
  check("four finishers", FINISHERS.length === 4);
  const overlap = CHARGE_UPS.filter((s) => (FINISHERS as readonly string[]).includes(s));
  check("no skill is both", overlap.length === 0, overlap.join(", "));

  // All ten are in the martial arts tree and nowhere else.
  for (const slug of [...CHARGE_UPS, ...FINISHERS]) {
    check(`${slug} is a martial art`, bySlug.get(slug)?.tree === "martial-arts", bySlug.get(slug)?.tree);
  }

  /*
   * Dragon Claw is the row that makes the kick list worth transcribing. It is a
   * finisher, it sits beside Dragon Talon, and it is not a kick.
   */
  check("three of the four finishers are kicks", KICKS.length === 3);
  check(
    "Dragon Claw is a finisher and not a kick",
    (FINISHERS as readonly string[]).includes("dragon-claw") &&
      !(KICKS as readonly string[]).includes("dragon-claw"),
  );
  for (const slug of KICKS) {
    const authored = assassinSkills.find((s) => s.slug === slug);
    check(`${slug} declares the kick damage model`, authored?.damageModel === "kick", authored?.damageModel);
  }
  check(
    "Dragon Claw does not declare the kick model",
    assassinSkills.find((s) => s.slug === "dragon-claw")?.damageModel === undefined,
  );

  const seconds = CHARGE_DURATION_FRAMES / FRAMES_PER_SECOND;
  check("charges stand for 15 seconds, not 14", seconds === 15, `${seconds}`);
}

// ===========================================================================
console.log("\nThe blades take three quarters of the weapon");
// ===========================================================================
{
  check("three blade skills", BLADE_SKILLS.length === 3);
  check(
    `${BLADE_WEAPON_NUMERATOR}/${BLADE_WEAPON_DENOMINATOR} is exactly three quarters`,
    BLADE_WEAPON_SHARE === 0.75,
    `${BLADE_WEAPON_SHARE}`,
  );
  // Derived, so a changed numerator moves the sentence that quotes it.
  check("which is 75%", Math.round(BLADE_WEAPON_SHARE * 100) === 75);
  for (const slug of BLADE_SKILLS) {
    check(`${slug} is in the graph`, bySlug.has(slug));
  }
}

// ===========================================================================
console.log("\nCeilings: five traps in total, one shadow");
// ===========================================================================
{
  check("the trap ceiling is five", TRAP_LIMIT === 5);
  check("six skills share it", TRAP_SLUGS.length === 6, `${TRAP_SLUGS.length}`);
  check("the shadow ceiling is one", SHADOW_LIMIT === 1);
  check("two skills share it", SHADOW_SLUGS.length === 2);
  for (const slug of TRAP_SLUGS) check(`${slug} is a trap-tree skill`, bySlug.get(slug)?.tree === "traps");
  for (const slug of SHADOW_SLUGS) {
    check(`${slug} is a shadow discipline`, bySlug.get(slug)?.tree === "shadow-disciplines");
  }
}

// ===========================================================================
console.log("\nVenom's poison is not a poison duration like any other");
// ===========================================================================
{
  const venom = bySlug.get("venom");
  check("Venom carries a duration", venom?.damage?.duration !== undefined);
  check(
    `it is ${VENOM_POISON_FRAMES} frames`,
    venom?.damage?.duration?.base === VENOM_POISON_FRAMES,
    `${venom?.damage?.duration?.base}`,
  );
  check("and does not grow with level", venom?.damage?.duration?.perLevel === 0);
  check(
    "which is under half a second",
    VENOM_POISON_FRAMES / FRAMES_PER_SECOND < 0.5,
    `${VENOM_POISON_FRAMES / FRAMES_PER_SECOND}s`,
  );
  /*
   * The contrast that makes it worth a rule of its own. Poison Nova is the
   * shortest poison on the site outside this class and is still five times
   * longer.
   */
  const nova = SKILL_GRAPH["poison-nova"]?.damage?.duration?.base;
  check("Poison Nova's 50 frames is five times longer", nova === 50, `${nova}`);
}

// ===========================================================================
console.log("\nPhoenix Strike's meteor feeds Fists of Fire twice, at two rates");
// ===========================================================================
{
  const ps = bySlug.get("phoenix-strike");
  const fromFists = (ps?.missileSynergies ?? []).filter((m) => m.from === "fists-of-fire");
  check("two components, not one", fromFists.length === 2, `${fromFists.length}`);
  const rates = fromFists.map((m) => m.magnitude).sort((a, b) => a - b);
  check("6% on the ground fire and 10% on the impact", rates.join(",") === "6,10", rates.join(","));
  check(
    "the components are named so the page can tell them apart",
    new Set(fromFists.map((m) => m.missile)).size === 2,
  );
  // The other two charges feed one component each; the pair above is the case
  // that made keying by source alone unrepresentable.
  for (const from of ["claws-of-thunder", "blades-of-ice"]) {
    const n = (ps?.missileSynergies ?? []).filter((m) => m.from === from).length;
    check(`${from} feeds one component`, n === 1, `${n}`);
  }
}

// ===========================================================================
// Planted mutations
// ===========================================================================

const WOULD_HAVE_SHIPPED: { note: string; line: string; rule: AssassinRule }[] = [
  {
    note: "the biggest number in the tree described as the thing you press last",
    line: "Tiger Strike is the finisher every martial arts build ends its rotation with.",
    rule: "charge-up-called-finisher",
  },
  {
    note: "Phoenix Strike as a finisher, which is how every tier list describes it",
    line: "Phoenix Strike spends the charges and releases all three elements at once.",
    rule: "charge-up-called-finisher",
  },
  {
    note: "pt-br form of the same",
    line: "O Phoenix Strike é o finalizador que libera os três elementos.",
    rule: "charge-up-called-finisher",
  },
  {
    note: "the weapon sentence that is true of every attack in the game except a kick",
    line: "Dragon Talon scales with your weapon damage, so a fast claw is the priority.",
    rule: "kick-scales-with-weapon",
  },
  {
    note: "the same mistake pointed at claws, which is the natural one for this class",
    line: "Dragon Tail takes its damage from the claws you are holding.",
    rule: "kick-scales-with-weapon",
  },
  {
    note: "pt-br form",
    line: "O dano do Dragon Flight vem da arma que você está segurando.",
    rule: "kick-scales-with-weapon",
  },
  {
    note: "three quarters rounded up to all of it",
    line: "Blade Fury throws blades that carry your weapon's full damage at range.",
    rule: "blade-takes-whole-weapon",
  },
  {
    note: "pt-br form",
    line: "O Blade Sentinel leva o dano cheio da arma.",
    rule: "blade-takes-whole-weapon",
  },
  {
    note: "the block mechanic every other class has",
    line: "Weapon Block is shield block under another name, so bring a shield.",
    rule: "weapon-block-needs-a-shield",
  },
  {
    note: "two buffs that cannot both be up, presented as a pair you keep up",
    line: "Keep Fade and Burst of Speed running and refresh them between packs.",
    rule: "fade-and-burst-together",
  },

  /*
   * Phoenix Strike and Mosaic. Every line below is a sentence a real guide
   * publishes; the first two are the two halves of the same misunderstanding,
   * and they point in opposite directions.
   */
  {
    note: "one Mosaic sold as total preservation",
    line: "With Mosaic your finishing moves have a 100% chance to not consume charges.",
    rule: "charge-preservation-overstated",
  },
  {
    note: "dual Mosaic given a figure that is neither 50 nor 100",
    line: "Two Mosaics give you a 75% chance to preserve charges between them.",
    rule: "charge-preservation-overstated",
  },
  {
    note: "dual Mosaic demoted back to one claw's figure",
    line: "Two Mosaics are still only a 50% chance for finishing moves to preserve charges.",
    rule: "charge-preservation-overstated",
  },
  {
    note: "one Mosaic given the pair's certainty, in words",
    line: "With a Mosaic the Assassin never consumes her charges, so the rotation is one button.",
    rule: "charge-preservation-overstated",
  },
  {
    note: "the pt-BR form of the same certainty on one claw",
    line: "Com a Mosaic as cargas nunca são consumidas e você só aperta o finisher.",
    rule: "charge-preservation-overstated",
  },
  {
    note: "an invented cap on a stat that has no maxstat",
    line: "Charge preservation is capped at 60% however many Mosaics you hold.",
    rule: "charge-preservation-overstated",
  },
  {
    note: "the fifteen seconds restarted by the wrong event",
    line: "Each finisher refreshes the charge timer, so the charges never run out while you are attacking.",
    rule: "charge-timer-refreshed-by-a-finisher",
  },
  {
    note: "the pt-BR mirror of the same wrong event",
    line: "Um finisher que preserva as cargas renova o temporizador de quinze segundos.",
    rule: "charge-timer-refreshed-by-a-finisher",
  },

  /*
   * What a kick carries. Cycle 5's corrections, and the first two are the
   * sentences this project itself published.
   */
  {
    note: "weapsel read as switching the weapon off entirely",
    line: "Rift's magic and fire damage are weapon damage a Dragon Talon kick structurally cannot use.",
    rule: "kick-blocks-every-weapon-effect",
  },
  {
    note: "the on-striking proc denied to the kick",
    line: "A Dragon Talon kick takes nothing from the weapon, so a chance to cast on striking never fires.",
    rule: "kick-blocks-every-weapon-effect",
  },
  {
    note: "Deadly Strike sold as a kick affix",
    line: "Gore Rider gives 15% Deadly Strike, and every Dragon Talon kick rolls it separately.",
    rule: "deadly-strike-on-a-kick",
  },
  {
    note: "Deadly Strike on the amulet slot of a kicker",
    line: "Highlord's Wrath is here for its Deadly Strike, which scales with level on Dragon Talon.",
    rule: "deadly-strike-on-a-kick",
  },
  {
    note: "a per-hit proc confined to one kick with nothing establishing it",
    line: "The Tornado only fires on the first kick of a Dragon Talon activation, so the chance to cast is worth less than it looks.",
    rule: "proc-limited-to-one-kick",
  },

  /*
   * Blade Fury. The four things cycle 4 could not establish, each planted as
   * the sentence a guide would write from not knowing them.
   */
  {
    note: "attack speed sold as raising the throw rate",
    line: "Stack Increased Attack Speed on your claws — Blade Fury throws faster the more of it you have.",
    rule: "blade-cadence-on-a-speed-stat",
  },
  {
    note: "cast rate sold as the blade rate, which is the other half of the same error",
    line: "Blade Fury is a cast, so Faster Cast Rate increases the rate you throw blades.",
    rule: "blade-cadence-on-a-speed-stat",
  },
  {
    note: "the pt-BR mirror",
    line: "Priorize velocidade de ataque nas garras: o Blade Fury fica mais rápido com ela.",
    rule: "blade-cadence-on-a-speed-stat",
  },
  {
    note: "a two-handed weapon told it takes no penalty",
    line: "A two-handed thresher is just as good for Blade Fury, since there is no penalty for the base.",
    rule: "two-hander-not-halved",
  },
  {
    note: "the same claim made as a share",
    line: "Blade Sentinel gives the full 75% share on a two-handed weapon too.",
    rule: "two-hander-not-halved",
  },
  {
    note: "the blades given a spread they do not have",
    line: "Up close, Blade Fury shotguns — all the blades land at once on a single target.",
    rule: "blade-shotgun-or-pierce",
  },
  {
    note: "pierce invented for a missile that has no Pierce column",
    line: "With enough Pierce on your gear a Blade Fury blade carries on through the whole row.",
    rule: "blade-shotgun-or-pierce",
  },
  {
    note: "the synergy credited with raising the weapon share",
    line: "Maxing Blade Sentinel and Blade Shield puts +400% on the 75% weapon share as well as on the skill.",
    rule: "blade-synergy-scales-the-weapon-share",
  },
  {
    note: "the pt-BR mirror of the same arithmetic",
    line: "A sinergia do Blade Fury multiplica também a parcela da arma, então os 75% viram muito mais.",
    rule: "blade-synergy-scales-the-weapon-share",
  },
  {
    note: "the preserved swing given the guarantee it specifically loses",
    line: "A swing that preserves charges still cannot miss, so attack rating stays irrelevant.",
    rule: "preserved-swing-called-always-hit",
  },
  {
    note: "the same claim from the other direction",
    line: "Dragon Claw always hits even when Mosaic preserves the charges.",
    rule: "preserved-swing-called-always-hit",
  },
  {
    note: "the pt-BR mirror",
    line: "Um golpe que preserva cargas sempre acerta, então Attack Rating continua irrelevante.",
    rule: "preserved-swing-called-always-hit",
  },
  {
    note: "the charge order inverted — one charge is the meteor, not the ice",
    line: "With Phoenix Strike, one charge releases cold and three charges release fire.",
    rule: "charge-order-wrong",
  },
  {
    note: "the middle charge given the wrong element",
    line: "Phoenix Strike at two charges fires a meteor into the pack.",
    rule: "charge-order-wrong",
  },
  {
    note: "the pt-BR mirror of the inverted order",
    line: "No Phoenix Strike, três cargas liberam fogo e uma carga libera gelo.",
    rule: "charge-order-wrong",
  },
  {
    note: "telling a Ladder reader to go and make the one claw that cannot be made there",
    line: "Craft Mosaic as soon as you can on Ladder; it is the build's whole engine.",
    rule: "make-a-blocked-runeword-here",
  },
  {
    note: "the pt-BR form",
    line: "Fabrique a Mosaic assim que possível no Ladder, porque ela é o motor da build.",
    rule: "make-a-blocked-runeword-here",
  },
  {
    note: "the poison intuition that is right everywhere else",
    line: "Venom adds poison damage over several seconds to everything you hit.",
    rule: "venom-as-ordinary-poison",
  },
  {
    note: "pt-br form",
    line: "O Venom soma dano de veneno ao longo de vários segundos.",
    rule: "venom-as-ordinary-poison",
  },
  {
    note: "a per-skill trap ceiling, which is the natural misreading of petmax",
    line: "You can have up to three traps of each kind on the ground.",
    rule: "trap-limit-not-five",
  },
  {
    note: "pt-br form",
    line: "Dá para ter no máximo seis sentinelas no chão ao mesmo tempo.",
    rule: "trap-limit-not-five",
  },
];

console.log("\nPlanted mutations — sentences a writer would plausibly produce");
for (const { note, line, rule } of WOULD_HAVE_SHIPPED) {
  check(`rejects: ${note}`, fires(line, rule), `expected ${rule}`);
}

const ACCEPTED: { note: string; line: string }[] = [
  {
    note: "the corrected charge-up sentence",
    line: "Tiger Strike is a charge-up: it stores charges that a finisher spends, and pressing it is a normal weapon swing.",
  },
  {
    note: "a finisher correctly called one",
    line: "Dragon Claw is a finisher. It spends standing charges and cannot miss while doing so.",
  },
  {
    note: "the corrected kick sentence",
    line: "Dragon Talon's damage comes from the boots, so the claws add their skill levels and nothing else.",
  },
  {
    note: "Dragon Claw crediting the weapon, which is correct for it",
    line: "Dragon Claw carries the weapon's full damage and no Kick flag, so it scales with the claws you hold.",
  },
  {
    note: "the corrected blade fraction",
    line: "Blade Fury carries three quarters of your weapon's damage at range.",
  },
  {
    note: "the corrected block sentence",
    line: "Weapon Block is not shield block: it is gated on holding claws and works with no shield equipped at all.",
  },
  {
    note: "the two buffs named together with the exclusion said",
    line: "Fade and Burst of Speed are mutually exclusive — casting one drops the other.",
  },
  {
    note: "pt-br form of the exclusion",
    line: "Fade e Burst of Speed são mutuamente exclusivos, e conjurar um derruba o outro.",
  },
  {
    note: "the corrected Venom sentence",
    line: "Venom overrides poison length to ten frames, so the whole amount lands in four tenths of a second.",
  },
  {
    note: "the correct trap ceiling",
    line: "Five sentries stand at once, and the ceiling is shared across every trap skill.",
  },
  {
    note: "a trap count that is not a ceiling claim at all",
    line: "Lightning Sentry fires ten shots per sentry, and the bolts pierce.",
  },
  {
    note: "an unrelated sentence about another class",
    line: "Blizzard has a hard cooldown that Faster Cast Rate cannot reduce.",
  },

  /*
   * The negative controls for the four Phoenix Strike rules. Three of these
   * are sentences the shipped page actually carries, and each was written
   * before the rule that has to leave it alone.
   */
  {
    note: "the shipped Mosaic sentence: fifty, and a percent chance rather than a guarantee",
    line: "Mosaic gives a 50% chance for finishing moves to not consume charges, and that is a percent chance, not a guarantee.",
  },
  {
    note: "the shipped second-claw sentence, which refuses the hundred",
    line: "A second Mosaic is a second 50% chance, and this page will not tell you it is 100%.",
  },
  {
    note: "the shipped Always Hit sentence, with the override said to be off",
    line: "A swing that preserves charges is not a swing that consumes them, so the Always Hit flag is off and it rolls to hit.",
  },
  {
    note: "the pt-BR mirror of it",
    line: "Um golpe que preserva cargas não é um golpe que as consome, então a marca de Always Hit fica desligada e ele rola acerto.",
  },
  {
    note: "Fists of Fire's own third charge, which is not Phoenix Strike's",
    line: "The third charge creates a wall of ground fire rather than a larger hit, so the skill's value is area denial.",
  },
  {
    note: "the three elements listed in order without a release verb between them",
    line: "Three hits with Phoenix Strike stack three charges — a meteor, then chain lightning, then a burst of sixteen ice bolts.",
  },
  {
    note: "making it in a mode where it can be made, with Non-Ladder named",
    line: "Mosaic — but only if you can make one, which means Non-Ladder or offline.",
  },
  {
    note: "the pt-BR mirror, where Non-Ladder also contains the word Ladder",
    line: "A Mosaic — mas só se você puder fabricar uma, o que significa Non-Ladder ou offline.",
  },
  {
    note: "saying plainly that it cannot be made on Ladder",
    line: "Mosaic cannot be crafted on Ladder, so nothing on that mode can make one.",
  },

  /*
   * Cycle 5's corrections have to be *publishable*. Each of these is a sentence
   * that now ships, and a rule that rejected one of them would be enforcing the
   * error it was written to remove.
   */
  {
    note: "the derived two-claw figure, which is now the correct one",
    line: "A second Mosaic takes the chance to 100%, because the stat is neither weapon-restricted nor parameter-keyed nor capped.",
  },
  {
    note: "one claw at its own figure, unchanged",
    line: "Mosaic gives a 50% chance for finishing moves to not consume charges, and that is a percent chance, not a guarantee.",
  },
  {
    note: "the pt-BR mirror of the two-claw figure",
    line: "A segunda garra leva a chance a 100%, porque o stat não é restrito a uma arma nem tem teto.",
  },
  {
    note: "totality claimed for two claws, which is what two claws buy",
    line: "With two Mosaics every finisher preserves the charges and the three-swings-then-release cadence stops existing.",
  },
  {
    note: "the one event that does restart the fifteen seconds",
    line: "Another Phoenix Strike hit re-applies the same state and therefore restarts that fifteen seconds.",
  },
  {
    note: "saying plainly that a preserved finisher does not restart the timer",
    line: "A preserved finisher does not restart the fifteen seconds; the property skips the consumption step and touches nothing else.",
  },
  {
    note: "the corrected Rift sentence, which credits the elemental half",
    line: "A Dragon Talon kick takes nothing from the weapon's physical damage, but Rift's magic and fire damage transfer and its on-striking Tornado fires.",
  },
  {
    note: "the corrected Gore Rider sentence, which denies the Deadly Strike",
    line: "Gore Rider's 15% Deadly Strike does nothing, because Deadly Strike is not applied to kick damage on any item.",
  },
  {
    note: "the pt-BR mirror of the Deadly Strike denial",
    line: "O Deadly Strike das Gore Rider não faz nada numa chutadora, porque ele não se aplica ao dano de chute.",
  },
  {
    note: "the physical-only denial, which is the true half and must stay sayable",
    line: "Dragon Talon carries no SrcDam at all, so the plain minimum and maximum physical damage on your claws is worth nothing to a kick.",
  },

  /* Blade Fury's corrected sentences, each of which now ships. */
  {
    note: "the cadence stated as fixed, naming both speed stats to say neither reaches it",
    line: "Blade Fury throws every five frames and that rate is subject to neither attack speed nor cast rate, so Increased Attack Speed is a dead affix here.",
  },
  {
    note: "Burst of Speed correctly demoted to run speed",
    line: "Burst of Speed buys this build run speed and nothing else, because its attack speed cannot reach a fixed cadence.",
  },
  {
    note: "the pt-BR mirror of the fixed cadence",
    line: "A cadência do Blade Fury é fixa: ela não é sujeita a velocidade de ataque nem a taxa de conjuração.",
  },
  {
    note: "the two-handed penalty stated correctly",
    line: "A two-handed weapon halves the transferred share to 37.5%, so one-handed is not a preference here.",
  },
  {
    note: "the absence of a shotgun stated plainly",
    line: "Blade Fury has no shotgun and no pierce: one missile per throw, and the first thing it touches is the last.",
  },
  {
    note: "the two halves described as separate, which is the corrected arithmetic",
    line: "The +400% multiplies Blade Fury's own damage and not the 75% weapon share — they are two separate addends.",
  },
  {
    note: "Blade Sentinel laid at attack speed, which is true and must not be caught by the Blade Fury rule",
    line: "Blade Sentinel plays the S2 trap animation, so it is laid at attack speed like a sentry rather than thrown.",
  },
];

console.log("\nSentences that must stay silent");
for (const { note, line } of ACCEPTED) {
  const problems = checkAssassinClaims([line], "control");
  check(`silent on: ${note}`, silent(line), problems.map((p) => p.rule).join(", "));
}

console.log("\nWiring");
check("twenty-four rules are exported for the content sweep", ASSASSIN_RULES.length === 24);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
