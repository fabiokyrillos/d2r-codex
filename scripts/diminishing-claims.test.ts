/**
 * Proof that the `dm`/`ln` bounds artifact says what the pinned tables say.
 *
 * WHY THIS EXISTS
 * ---------------
 * Six sentences shipped that stated a diminishing skill's **Max** parameter as a
 * figure the character has — "Weapon Block at twenty gives a 65% block chance",
 * "a 25% chance of a critical hit" — and every gate in `npm run check` stayed
 * green, because 65 and 25 *are* the numbers on those rows. What was wrong was
 * the grammar wrapped around them: `Param2 = 65` is the ceiling the curve climbs
 * toward, and the character at twenty hard points is nowhere near it.
 *
 * See `docs/proposals/assassin-8-diminishing-params-stated-as-achieved.md`.
 *
 * Two halves, and neither is worth much without the other.
 *
 * **The extraction.** The records below are hand-checked against the pinned
 * JSON, by eye, before the generator existed. If the generator ever produces
 * something else for these three rows, this file fails and the diff is the
 * conversation. Nothing here is copied out of the generated artifact.
 *
 * **The rule.** The sentences in `SHIPPED_WRONG` are the text this repository
 * actually published, in the locale it published it in. A rule that cannot
 * reject the sentence it was written for would not have caught the mistake it
 * exists to catch. Their repairs are asserted green in the same breath, because
 * a rule that rejects both the error and its fix is a rule the next author
 * deletes.
 *
 * Run with `npx tsx scripts/diminishing-claims.test.ts`.
 */
import { SKILL_PARAM_BOUNDS, SKILL_PARAM_BOUNDS_UNRESOLVED } from "../content/classes/skill-param-bounds";
import {
  DIMINISHING_RULES,
  checkDiminishingClaims,
  claimEntriesFor,
  type ClaimEntry,
} from "./diminishing-claims";

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

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// ===========================================================================
// The extraction, against rows read by hand out of the pinned tables
// ===========================================================================

/*
 * blizzhackers/d2data @ fc46999, json/skilldesc.json, row `weapon block`:
 *
 *   "desccalca1": "dm12"
 *
 * and json/skills.json, row `Weapon Block`:
 *
 *   "charclass": "ass", "maxlvl": 20,
 *   "Param1": 20, "*Param1 Description": "Block % chance Min",
 *   "Param2": 65, "*Param2 Description": "Block % chance Max"
 */
console.log("\nWeapon Block's dm12, hand-checked against json/skilldesc.json");
{
  const record = SKILL_PARAM_BOUNDS["assassin/weapon-block/skilldesc.json/desccalca1/dm12"];
  check("the record exists under its class/skill/column/token key", record !== undefined);
  if (record) {
    check("it is diminishing", record.family === "diminishing", String(record.family));
    check("it reads Param1 and Param2", same(record.parameters, [1, 2]), JSON.stringify(record.parameters));
    check(
      "its minimum is Param1 = 20",
      record.family === "diminishing" && record.minimum === 20,
      JSON.stringify(record),
    );
    check(
      "its maximum is Param2 = 65",
      record.family === "diminishing" && record.maximum === 65,
      JSON.stringify(record),
    );
    check(
      "it carries the game's own Min/Max labels",
      same(record.labels, ["Block % chance Min", "Block % chance Max"]),
      JSON.stringify(record.labels),
    );
    check("its source coordinate is the skilldesc column", record.source === "skilldesc.json" && record.column === "desccalca1");
    check("it records the twenty-point cap", record.maxLevel === 20, String(record.maxLevel));
  }
}

/*
 * json/skills.json, row `Claw Mastery` — the tokens are on the *skill* row here
 * rather than on the description row, which carries the opaque mastery calls
 * `macr`, `madm` and `math` instead:
 *
 *   "passivecalc1": "ln12", "Param1": 30 ("Attack Rating % baseline"),
 *                           "Param2": 10 ("Attack Rating % per level")
 *   "passivecalc3": "dm56", "Param5": 0  ("% chance for Critical Hit Min"),
 *                           "Param6": 25 ("% chance for Critical Hit Max")
 */
console.log("\nClaw Mastery's ln12 and dm56, hand-checked against json/skills.json");
{
  const linear = SKILL_PARAM_BOUNDS["assassin/claw-mastery/skills.json/passivecalc1/ln12"];
  check("the ln12 record exists", linear !== undefined);
  if (linear) {
    check("it is linear", linear.family === "linear", String(linear.family));
    check("its base is Param1 = 30", linear.family === "linear" && linear.base === 30, JSON.stringify(linear));
    check(
      "it gains Param2 = 10 per level",
      linear.family === "linear" && linear.perLevel === 10,
      JSON.stringify(linear),
    );
    check(
      "it carries no maximum, because a linear column declares none",
      !("maximum" in linear),
      JSON.stringify(linear),
    );
  }

  const diminishing = SKILL_PARAM_BOUNDS["assassin/claw-mastery/skills.json/passivecalc3/dm56"];
  check("the dm56 record exists", diminishing !== undefined);
  if (diminishing) {
    check("it is diminishing", diminishing.family === "diminishing", String(diminishing.family));
    check("it reads Param5 and Param6", same(diminishing.parameters, [5, 6]), JSON.stringify(diminishing.parameters));
    check(
      "its maximum is Param6 = 25",
      diminishing.family === "diminishing" && diminishing.maximum === 25,
      JSON.stringify(diminishing),
    );
    check(
      "its minimum is Param6's partner, Param5 = 0",
      diminishing.family === "diminishing" && diminishing.minimum === 0,
      JSON.stringify(diminishing),
    );
  }
}

// ===========================================================================
// Shape, determinism and the gaps the extraction refuses to guess at
// ===========================================================================

console.log("\nThe artifact's shape");
{
  const keys = Object.keys(SKILL_PARAM_BOUNDS);
  check("it carries records", keys.length > 0, String(keys.length));
  check(
    "its keys are emitted in sorted order, so a regeneration is a readable diff",
    same(keys, [...keys].sort()),
  );

  const wrongFamily = keys.filter((k) => {
    const r = SKILL_PARAM_BOUNDS[k];
    return r.token.startsWith("dm") !== (r.family === "diminishing");
  });
  check(
    "every record's family agrees with its token prefix",
    wrongFamily.length === 0,
    wrongFamily.slice(0, 4).join(", "),
  );

  const wrongKey = keys.filter((k) => {
    const r = SKILL_PARAM_BOUNDS[k];
    return k !== `${r.classSlug}/${r.skillSlug}/${r.source}/${r.column}/${r.token}`;
  });
  check("every key restates its own record's coordinate", wrongKey.length === 0, wrongKey.slice(0, 4).join(", "));

  const nonConsecutive = keys.filter((k) => {
    const [a, b] = SKILL_PARAM_BOUNDS[k].parameters;
    return b !== a + 1;
  });
  check(
    "no record reads a non-consecutive parameter pair",
    nonConsecutive.length === 0,
    nonConsecutive.slice(0, 4).join(", "),
  );

  check(
    "the parameter pairs the extraction refuses to resolve are listed rather than dropped in silence",
    SKILL_PARAM_BOUNDS_UNRESOLVED.length > 0,
    String(SKILL_PARAM_BOUNDS_UNRESOLVED.length),
  );
  check(
    "every unresolved entry says why it was left out",
    SKILL_PARAM_BOUNDS_UNRESOLVED.every((u) => u.reason.length > 0),
  );
}

// ===========================================================================
// The rule, against the sentences this repository actually published
// ===========================================================================

const entry = (locale: string, skills: string[], line: string): ClaimEntry => ({
  locale,
  path: `${locale}/control`,
  skills,
  lines: [line],
});
const problemsFor = (e: ClaimEntry) => checkDiminishingClaims([e], SKILL_PARAM_BOUNDS);
const firesOn = (e: ClaimEntry, rule: string) => problemsFor(e).some((p) => p.rule === rule);
const silentOn = (e: ClaimEntry) => problemsFor(e).length === 0;

/**
 * The text that shipped, in the locale it shipped in.
 *
 * `note` names the page it was on. `skills` is the structural context the page
 * gave it: a skill-plan entry is `{ skill: "weapon-block", note: … }` and a
 * `skillNotes` map is keyed by slug, so four of these sentences never name the
 * skill they are about and only the surrounding shape says which one it is.
 */
const SHIPPED_WRONG: { note: string; locale: string; skills: string[]; line: string }[] = [
  {
    note: "kicksin, en-US — the bound with an achieved-value verb",
    locale: "en-us",
    skills: [],
    line: "Weapon Block at twenty gives a 65% block chance, and a block you recover from slowly is a block that still cost you the fight.",
  },
  {
    note: "dragon-tail skill plan, en-US — no skill named, the plan entry names it",
    locale: "en-us",
    skills: ["weapon-block"],
    line: "65% block chance with two claws and no shield. On a build that stands in the middle of what it just exploded, this is the survivability plan.",
  },
  {
    note: "dragon-tail breakpoint, en-US — the bound as the end of an allocation",
    locale: "en-us",
    skills: [],
    line: "Worth it with the speed package, which takes Weapon Block to twenty and a 65% block chance.",
  },
  {
    note: "blade-fury skill plan, en-US — Claw Mastery's Param6",
    locale: "en-us",
    skills: ["claw-mastery"],
    line: "What this buys is +220% attack rating, +111% damage and a 25% chance of a critical hit, all of which land on the weapon term.",
  },
  {
    note: "whirlwind-assassin, en-US — the bound as a plain copula",
    locale: "en-us",
    skills: [],
    line: "Weapon Block is a 65% block chance that keeps working at full effectiveness while you spin.",
  },
  {
    note: "pt-br build copy — the same sentence, translated",
    locale: "pt-br",
    skills: [],
    line: "O Weapon Block em vinte dá 65% de chance de bloqueio, e um bloqueio do qual você se recupera devagar é um bloqueio que ainda te custou a luta.",
  },
  {
    note: "pt-br skillNotes, keyed by slug — no skill named in the sentence at all",
    locale: "pt-br",
    skills: ["weapon-block"],
    line: "65% de chance de bloqueio com duas garras e nenhum escudo.",
  },
  {
    note: "pt-br blade-fury mirror — Claw Mastery's Param6",
    locale: "pt-br",
    skills: ["claw-mastery"],
    line: "O que isto compra é +220% de Attack Rating, +111% de dano e 25% de chance de acerto crítico, tudo isso caindo no termo da arma.",
  },
];

console.log("\nSentences that shipped and must be rejected");
for (const { note, locale, skills, line } of SHIPPED_WRONG) {
  const e = entry(locale, skills, line);
  check(`fires on: ${note}`, firesOn(e, "diminishing-bound-stated-as-achieved"), JSON.stringify(problemsFor(e).map((p) => p.rule)));
}

console.log("\nThe violation is actionable");
{
  const [problem] = problemsFor(entry("pt-br", ["weapon-block"], "65% de chance de bloqueio com duas garras e nenhum escudo."));
  check("it names the locale", problem?.locale === "pt-br", String(problem?.locale));
  check("it names the content path", problem?.path === "pt-br/control", String(problem?.path));
  check("it names the skill", problem?.skillSlug === "weapon-block", String(problem?.skillSlug));
  check("it names the bound", problem?.bound === 65, String(problem?.bound));
  check("it names the formula family", problem?.family === "diminishing", String(problem?.family));
  check("it names the calculation token", problem?.token === "dm12", String(problem?.token));
  check(
    "its message quotes the offending sentence",
    (problem?.message ?? "").includes("65% de chance de bloqueio"),
    problem?.message,
  );
}

/**
 * The repairs, which are the sentences the site publishes today.
 *
 * A rule that rejects both the error and its fix is a rule the next author
 * deletes, so every one of these is asserted silent.
 */
const REPAIRED: { note: string; locale: string; skills: string[]; line: string }[] = [
  {
    note: "en-US 'climbing toward'",
    locale: "en-us",
    skills: ["weapon-block"],
    line: "A block chance climbing toward 65% with two claws and no shield.",
  },
  {
    note: "en-US 'Up to' plus the parameter and the word ceiling",
    locale: "en-us",
    skills: [],
    line: "**Up to 65% block, and it keeps working while you spin.** `Param2 = 65` is the ceiling, and it is the skill's own rather than a shield's 75.",
  },
  {
    note: "en-US 'climbing toward' on Claw Mastery",
    locale: "en-us",
    skills: ["claw-mastery"],
    line: "What this buys is +220% attack rating, +111% damage and a critical-hit chance climbing toward 25%.",
  },
  {
    note: "pt-BR 'subindo em direção ao teto de'",
    locale: "pt-br",
    skills: [],
    line: "O Weapon Block em vinte dá uma chance de bloqueio subindo em direção ao teto de 65%, e um bloqueio do qual você se recupera devagar é um bloqueio que ainda te custou a luta.",
  },
  {
    note: "pt-BR 'em direção a'",
    locale: "pt-br",
    skills: ["weapon-block"],
    line: "Uma chance de bloqueio subindo em direção a 65% com duas garras e nenhum escudo.",
  },
  {
    note: "pt-BR 'até'",
    locale: "pt-br",
    skills: ["fade"],
    line: "Duração de maldição cortada em até 90%.",
  },
  {
    note: "pt-BR 'rumo a'",
    locale: "pt-br",
    skills: ["claw-mastery"],
    line: "Uma chance de acerto crítico rumo a 25%.",
  },
];

console.log("\nHedged wording that must stay silent");
for (const { note, locale, skills, line } of REPAIRED) {
  const e = entry(locale, skills, line);
  check(`silent on: ${note}`, silentOn(e), problemsFor(e).map((p) => `${p.rule}:${p.bound}`).join(", "));
}

/** Numbers that are not the claim, in contexts where the bound's skill is present. */
const NOT_A_CLAIM: { note: string; locale: string; skills: string[]; line: string }[] = [
  {
    note: "an unrelated item stat on a page that names no skill",
    locale: "en-us",
    skills: [],
    line: "Stormshield rolls 35% damage reduction and a 65% chance to block on a Paladin.",
  },
  {
    note: "a bare numeric range that spans the bound",
    locale: "en-us",
    skills: ["weapon-block"],
    line: "The claw rolls 20-65 damage before any mastery is applied.",
  },
  {
    note: "a percentage range that ends on the bound",
    locale: "pt-br",
    skills: ["fade"],
    line: "A armadura rola de 15% a 75% de dano aprimorado.",
  },
  {
    note: "a linear column's achieved value at twenty, which a page may state",
    locale: "en-us",
    skills: ["claw-mastery"],
    line: "Twenty points is +220% attack rating and +111% Enhanced Damage on every hit.",
  },
  {
    note: "the diminishing floor, which a character does have",
    locale: "en-us",
    skills: ["weapon-block"],
    line: "One point is a 20% block chance, which is why the core takes it.",
  },
  {
    note: "a level number that happens to equal a bound elsewhere",
    locale: "en-us",
    skills: ["weapon-block"],
    line: "It unlocks at character level 65 on no class at all, and the package takes it at 30.",
  },
];

console.log("\nNumbers that are not the claim");
for (const { note, locale, skills, line } of NOT_A_CLAIM) {
  const e = entry(locale, skills, line);
  check(`silent on: ${note}`, silentOn(e), problemsFor(e).map((p) => `${p.rule}:${p.bound}`).join(", "));
}

console.log("\nA hedged figure that is not the recorded bound");
{
  const wrong = entry(
    "en-us",
    [],
    "Weapon Block is a block chance climbing toward 58% that keeps working while you spin.",
  );
  check(
    "fires when the ceiling quoted is not the one on the row",
    firesOn(wrong, "diminishing-bound-does-not-match-the-data"),
    problemsFor(wrong).map((p) => p.rule).join(", "),
  );
  const right = entry(
    "en-us",
    [],
    "Weapon Block is a block chance climbing toward 65% that keeps working while you spin.",
  );
  check("silent when it is", silentOn(right), problemsFor(right).map((p) => p.rule).join(", "));

  const ptWrong = entry("pt-br", [], "O Weapon Block é uma chance de bloqueio subindo em direção a 58%.");
  check("and in Portuguese", firesOn(ptWrong, "diminishing-bound-does-not-match-the-data"));
}

/**
 * Hedged figures on live pages that belong to something other than the skill
 * beside them.
 *
 * Every one of these fired against an earlier draft of the mismatch rule, which
 * accepted a skill anywhere in the sentence as the owner of any hedged
 * percentage in it. Pages hedge the player's 75% resistance cap, an 85%
 * maximum-resistance line and a 65% faster-cast breakpoint constantly, and each
 * of those shares a sentence with a skill sooner or later. Pinned here so the
 * clause-attachment narrowing cannot be quietly undone.
 */
const HEDGED_BUT_NOT_THE_SKILL: { note: string; locale: string; skills: string[]; line: string }[] = [
  {
    note: "smiter — the player's resistance cap, two skills earlier in the sentence",
    locale: "en-us",
    skills: [],
    line: "Fanaticism online, Holy Shield running, resistances heading toward 75%.",
  },
  {
    note: "dragon-tail — the Shadow Master's 90%, in a sentence that goes on to name Mind Blast",
    locale: "en-us",
    skills: [],
    line: "A twenty-point shadow has up to 90% resistances and uses your skills, which is what Mind Blast cannot do.",
  },
  {
    note: "berserk-barbarian — Find Item's curve, in a sentence that goes on to name Find Potion",
    locale: "en-us",
    skills: [],
    line: "Find Item's own contribution is a diminishing curve toward 60%, so its last points are worth a fraction of its first; Find Potion adds a flat roll.",
  },
  {
    note: "hammerdin — the maximum-resistance line, not Holy Shield's block ceiling",
    locale: "pt-br",
    skills: [],
    line: "Fora do Uber Tristram nada pune ter teto de 85% em vez de 75%, e esses pontos rendem mais no Holy Shield ou como auras de um ponto.",
  },
  {
    note: "lightning-trapsin — a 65% faster-cast breakpoint, not Mind Blast's conversion ceiling",
    locale: "pt-br",
    skills: [],
    line: "De onde vêm os últimos pontos de conjuração no caminho até 65% pelo Mind Blast.",
  },
  {
    note: "double-throw-barbarian — Throwing Mastery's no-consume ceiling lives in an unresolved token",
    locale: "en-us",
    skills: ["throwing-mastery"],
    line: "It has the two every mastery has, and then three rows no other mastery has: pierce climbing from 0% toward 55%, a no-consume chance climbing from 0% toward 66%, and quantity replenished on a critical.",
  },
];

console.log("\nHedged figures that belong to something other than the skill beside them");
for (const { note, locale, skills, line } of HEDGED_BUT_NOT_THE_SKILL) {
  const e = entry(locale, skills, line);
  check(`silent on: ${note}`, silentOn(e), problemsFor(e).map((p) => `${p.rule}:${p.bound}`).join(", "));
}

/**
 * Achieved figures on live pages that are not the skill's bound either.
 *
 * These are the item stats and the coincidences. Each fired against an earlier
 * draft that accepted any mention of a skill in a sentence as attribution.
 */
const NAMED_BUT_NOT_THE_CLAIM: { note: string; locale: string; skills: string[]; line: string }[] = [
  {
    note: "Beast's own +40% attack speed, standing next to the Fanaticism aura it grants",
    locale: "en-us",
    skills: [],
    line: "**The Werebear variant.** Grants Werebear as an Oskill plus a Fanaticism aura and 40% attack speed.",
  },
  {
    note: "the same line in Portuguese, where `e` joins the two grants",
    locale: "pt-br",
    skills: [],
    line: "**A variante Werebear.** Concede Werebear como Oskill mais uma aura de Fanaticism e 40% de velocidade de ataque.",
  },
  {
    note: "Buriza's own 100% Piercing Attack, in a clause that goes on to name Pierce",
    locale: "en-us",
    skills: [],
    line: "What you are buying is **100% Piercing Attack for free**, which lets a levelling Amazon skip Pierce entirely and spend those points elsewhere.",
  },
  {
    note: "a minion's resistance ceiling of 100, which is not Fire Golem's Fire Absorb Max",
    locale: "en-us",
    skills: [],
    line: "Summon Resist stacking onto a Fire Golem's own 100% fire cannot push it past that, and it cannot push anything past it either.",
  },
  {
    note: "Pierce's curve stated as a span, and stated as diminishing while it is at it",
    locale: "en-us",
    skills: [],
    line: "A Razortail is 33% for a belt slot, and the skill's own curve is a diminishing one between 10% and 100%.",
  },
  {
    note: "Doom's cold-resistance range, whose far end is Holy Freeze's Slow % Max",
    locale: "en-us",
    skills: [],
    line: "A Holy Freeze aura plus -40 to -60% enemy cold resistance.",
  },
  {
    note: "Fade's curse-length reduction, hedged with 'as much as'",
    locale: "en-us",
    skills: [],
    line: "Fade's curse-length reduction is the mitigation, and eighteen points of it cuts the duration by as much as 90%.",
  },
];

console.log("\nNamed skills whose neighbouring figure is not their bound");
for (const { note, locale, skills, line } of NAMED_BUT_NOT_THE_CLAIM) {
  const e = entry(locale, skills, line);
  check(`silent on: ${note}`, silentOn(e), problemsFor(e).map((p) => `${p.rule}:${p.bound}`).join(", "));
}

// ===========================================================================
// The structural context, which four of the eight sentences depend on
// ===========================================================================

console.log("\nSkill context is read from the shape of the content, not only from the prose");
{
  const plan = {
    skills: [
      { skill: "weapon-block", points: 20, note: "65% block chance with two claws and no shield." },
      { skill: "venom", points: 20, note: "Poison damage that a physical immune cannot stop." },
    ],
  };
  const entries = claimEntriesFor(plan, "en-us", "en-us/build/dragon-tail", SKILL_PARAM_BOUNDS);
  const scoped = entries.find((e) => e.skills.includes("weapon-block"));
  check("a skill-plan entry scopes its own strings", scoped !== undefined);
  check(
    "and does not leak that scope onto a sibling entry",
    !entries.some((e) => e.skills.includes("weapon-block") && e.lines.some((l) => l.includes("Poison damage"))),
  );
  check(
    "the plan's own note is caught through that scope",
    checkDiminishingClaims(entries, SKILL_PARAM_BOUNDS).some((p) => p.skillSlug === "weapon-block"),
  );

  const notes = { skillNotes: { "weapon-block": "65% de chance de bloqueio com duas garras." } };
  const keyed = claimEntriesFor(notes, "pt-br", "pt-br/build/kicksin", SKILL_PARAM_BOUNDS);
  check(
    "a map keyed by slug scopes its value",
    checkDiminishingClaims(keyed, SKILL_PARAM_BOUNDS).some((p) => p.skillSlug === "weapon-block"),
  );
}

// ===========================================================================
// The gate refuses a missing or mutated artifact rather than passing quietly
// ===========================================================================

console.log("\nA missing or mutated artifact fails loudly");
{
  const anySentence = [entry("en-us", ["weapon-block"], "Weapon Block at twenty gives a 65% block chance.")];

  let threwOnEmpty = false;
  try {
    checkDiminishingClaims(anySentence, {});
  } catch {
    threwOnEmpty = true;
  }
  check("an empty bounds record throws rather than reporting zero problems", threwOnEmpty);

  const flipped = structuredClone(SKILL_PARAM_BOUNDS) as Record<string, { family: string }>;
  flipped["assassin/weapon-block/skilldesc.json/desccalca1/dm12"].family = "linear";
  let threwOnFlip = false;
  try {
    checkDiminishingClaims(anySentence, flipped as typeof SKILL_PARAM_BOUNDS);
  } catch {
    threwOnFlip = true;
  }
  check("a dm record relabelled linear throws rather than going quiet", threwOnFlip);
}

console.log("\nWiring");
check("both rules are exported for the content sweep", DIMINISHING_RULES.length === 2, DIMINISHING_RULES.join(", "));

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
