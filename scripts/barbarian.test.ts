/**
 * Proof that the Barbarian's controls fire.
 *
 * Every rule here is run twice: once against the pages as they ship, where it
 * must be silent, and once against a copy of those same pages with one fact
 * changed, where it must fire and must name the page it fired on. A rule that
 * only ever sees a hand-written string proves nothing about the site, so the
 * mutations are applied to real content loaded from the registry rather than to
 * invented sentences — the invented sentences that do appear are the *accepted*
 * ones, which exist to prove a rule does not fire on the corrected form.
 *
 * The three shapes this file is written against, all of them observed:
 *
 * - **A number that used to be right.** The journey said the Pit and Pindleskin
 *   were both area level 85. The Pit is; Pindleskin is 83. Nothing in the repo
 *   compared the sentence to the registry that holds the answer.
 * - **A silence that reads as an absence.** Ten farming entries rated an area
 *   for a build whose only damage type that area is commonly immune to, and
 *   said nothing about it. A reader takes the rating and finds the wall.
 * - **A fact inherited from the rest of the class.** Leap Attack is the one
 *   committed Barbarian attack that can be interrupted, and every neighbouring
 *   page says the opposite about its own skill, correctly.
 *
 * Run with `npm run test:barbarian`.
 */
import { getBuilds, getFarmingArea, getFarmingAreas } from "../lib/registry";
import { barbarianSkills, barbarianTrees } from "../content/classes/barbarian/skills";
import { barbarianSkillsPtBr } from "../content/classes/barbarian/pt-br";
import { barbarianJourney } from "../content/progression/barbarian-journey";
import { barbarianJourneyPtBr } from "../content/progression/pt-br-barbarian";
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import type { Build, Difficulty, Element } from "../lib/types";
import type { Locale } from "../lib/i18n/config";
import {
  BARBARIAN_RULES,
  INTERRUPTIBLE,
  NO_WEAPON_DAMAGE,
  REQUIRES_TWO_WEAPONS,
  SHIFTED_MANA,
  UNINTERRUPTIBLE,
  type BarbarianProblem,
  type BuffPassage,
  type BuildLike,
  checkAreaLevels,
  checkBattleOrdersLife,
  checkColumnRefutedClaims,
  checkFarmingImmunities,
  checkJourneyAreaLevels,
  checkMasteryOnWeaponlessBuild,
  checkTwoWeaponBlock,
  levelClaimsIn,
  readLifeFormula,
} from "./barbarian-rules";

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

const LOCALES: Locale[] = ["en-us", "pt-br"];
const SKILL_SLUGS = new Set(barbarianSkills.map((s) => s.slug));

const barbarians = (locale: Locale): Build[] =>
  getBuilds(locale).filter((b) => b.classSlug === "barbarian");

/**
 * Every string in a content object, with the skill it is about when the data
 * knows — an allocation's `skill` field in en-US, an overlay's key in pt-BR.
 *
 * Walking rather than listing fields on purpose: a rule that reads eleven named
 * fields stops seeing the twelfth the day someone adds it, and the sentence that
 * shipped wrong last time was in `contentNote`, which no earlier sweep read.
 */
function passagesOf(
  node: unknown,
  path: string,
  subject: string | undefined,
  out: BuffPassage[],
): void {
  if (typeof node === "string") {
    out.push({ where: path, text: node, subject });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => passagesOf(v, `${path}[${i}]`, subject, out));
    return;
  }
  if (node && typeof node === "object") {
    const rec = node as Record<string, unknown>;
    const here =
      typeof rec.skill === "string" && SKILL_SLUGS.has(rec.skill)
        ? rec.skill
        : typeof rec.slug === "string" && SKILL_SLUGS.has(rec.slug)
          ? rec.slug
          : subject;
    for (const [key, value] of Object.entries(rec)) {
      passagesOf(value, `${path}.${key}`, SKILL_SLUGS.has(key) ? key : here, out);
    }
  }
}

/** Everything the class publishes in one locale, as attributed passages. */
function allPassages(locale: Locale): BuffPassage[] {
  const out: BuffPassage[] = [];
  for (const build of barbarians(locale)) passagesOf(build, `${locale}/${build.slug}`, undefined, out);
  if (locale === "en-us") {
    passagesOf(barbarianSkills, "en-us/skills", undefined, out);
    passagesOf(barbarianJourney, "en-us/journey", undefined, out);
  } else {
    for (const [slug, copy] of Object.entries(barbarianSkillsPtBr)) {
      passagesOf(copy, `pt-br/skills/${slug}`, slug, out);
    }
    passagesOf(barbarianJourneyPtBr, "pt-br/journey", undefined, out);
  }
  return out;
}

/** The journey's prose, which names its own areas rather than carrying a field. */
function journeyPassages(locale: Locale): { where: string; text: string }[] {
  const out: BuffPassage[] = [];
  passagesOf(
    locale === "en-us" ? barbarianJourney : barbarianJourneyPtBr,
    `${locale}/journey`,
    undefined,
    out,
  );
  return out.map(({ where, text }) => ({ where, text }));
}

const asBuildLike = (b: Build): BuildLike => b as unknown as BuildLike;

/**
 * Which rules were seen to fire at least once during this run.
 *
 * A rule can be declared, exported, counted in `BARBARIAN_RULES` and never
 * reachable — the id sits in the list, the code path is dead, and the file
 * still reports eight controls. The tally at the bottom refuses that.
 */
const exercised = new Set<string>();
const rules = (problems: BarbarianProblem[]) => {
  for (const p of problems) exercised.add(p.rule);
  return [...new Set(problems.map((p) => p.rule))].join(", ");
};

// ===========================================================================
console.log("\nThe class is where the extraction put it");
// ===========================================================================
{
  const nodes = Object.entries(SKILL_GRAPH).filter(([, n]) => n.classSlug === "barbarian");
  check("thirty skills in the graph", nodes.length === 30, `${nodes.length}`);
  check("thirty skills authored", barbarianSkills.length === 30, `${barbarianSkills.length}`);
  check("three trees authored", barbarianTrees.length === 3, `${barbarianTrees.length}`);
  check("six builds published", barbarians("en-us").length === 6, `${barbarians("en-us").length}`);

  // The one skill on the class that neither feeds a synergy nor receives one.
  // Every point plan on this site is built from synergy edges, so a plan that
  // grew one for Whirlwind would be spending points on nothing.
  const wwNode = SKILL_GRAPH["whirlwind"];
  const receives = wwNode?.synergies?.length ?? 0;
  const feeds = Object.values(SKILL_GRAPH).filter((n) =>
    (n.synergies ?? []).some((s: { from: string }) => s.from === "whirlwind"),
  ).length;
  check("Whirlwind receives no synergy", receives === 0, `${receives}`);
  check("Whirlwind feeds no synergy", feeds === 0, `${feeds}`);

  // The two sets the interrupt rule is written over must not overlap, or the
  // rule would be asserting a skill is both.
  const overlap = UNINTERRUPTIBLE.filter((s) => INTERRUPTIBLE.includes(s));
  check("interruptible and uninterruptible are disjoint", overlap.length === 0, overlap.join(", "));
  const unknown = [...UNINTERRUPTIBLE, ...INTERRUPTIBLE, ...REQUIRES_TWO_WEAPONS, ...NO_WEAPON_DAMAGE]
    .filter((s) => !SKILL_SLUGS.has(s) && SKILL_GRAPH[s]?.classSlug !== "assassin");
  check("every slug the rules name is a real skill", unknown.length === 0, unknown.join(", "));
}

// ===========================================================================
console.log("\nArea levels, against the registry that holds the answer");
// ===========================================================================
for (const locale of LOCALES) {
  const areas = getFarmingAreas(locale);
  const levelOf = (slug: string, difficulty: Difficulty) =>
    getFarmingArea(locale, slug)?.levels?.[difficulty];

  const shipped = [
    ...checkAreaLevels(barbarians(locale).map(asBuildLike), areas, levelOf, locale),
    ...checkJourneyAreaLevels(journeyPassages(locale), areas, "hell"),
  ];
  check(`${locale}: no area level is misstated`, shipped.length === 0, shipped.map((p) => p.message).join(" | "));

  // The claims are found at all — a rule silent because it parses nothing is
  // indistinguishable from a rule silent because the content is right.
  const claims = barbarians(locale)
    .flatMap((b) => b.farming)
    .flatMap((f) => levelClaimsIn(f.why, areas))
    .concat(journeyPassages(locale).flatMap((p) => levelClaimsIn(p.text, areas)));
  check(`${locale}: area-level claims are parsed`, claims.length >= 3, `${claims.length} found`);
}

{
  // The mutation the coordinator asked for, applied in memory to the real
  // journey passage rather than to a sentence written here.
  const areas = getFarmingAreas("en-us");
  const passages = journeyPassages("en-us");
  const pindle = passages.find((p) => /Pindleskin is 83/.test(p.text));
  check("the journey states Pindleskin's area level", pindle !== undefined);
  if (pindle) {
    const mutated = [{ where: pindle.where, text: pindle.text.replace("Pindleskin is 83", "Pindleskin is 85") }];
    const fired = checkJourneyAreaLevels(mutated, areas, "hell");
    check(
      "Pindleskin 83 -> 85 fires",
      fired.some((p) => p.rule === "area-level-misstated" && /pindleskin/.test(p.message)),
      rules(fired),
    );
    // The other half of the same sentence must stay right, or the rule is
    // firing on the sentence rather than on the number.
    check(
      "the Pit's 85 in the same sentence stays silent",
      !fired.some((p) => /puts pit /.test(p.message)),
      fired.map((p) => p.message).join(" | "),
    );
    check("the unmutated passage is silent", checkJourneyAreaLevels([pindle], areas, "hell").length === 0);
  }

  // And on a build's farming entry, where the area comes from the field.
  const ww = barbarians("en-us").find((b) => b.slug === "whirlwind-barbarian");
  if (ww) {
    const bumped = {
      ...ww,
      farming: ww.farming.map((f) =>
        f.area === "worldstone-keep" ? { ...f, why: f.why.replace("area level 85", "area level 87") } : f,
      ),
    };
    const fired = checkAreaLevels(
      [asBuildLike(bumped as Build)],
      getFarmingAreas("en-us"),
      (s, d) => getFarmingArea("en-us", s)?.levels?.[d],
      "control",
    );
    check("Worldstone Keep 85 -> 87 fires", fired.some((p) => p.rule === "area-level-misstated"), rules(fired));
  }
}

// ===========================================================================
console.log("\nThe immunity a farming entry has to name");
// ===========================================================================
for (const locale of LOCALES) {
  const immunitiesOf = (slug: string) => getFarmingArea(locale, slug)?.commonImmunities;
  const shipped = checkFarmingImmunities(barbarians(locale).map(asBuildLike), immunitiesOf, locale);
  check(`${locale}: every clashing entry names the immunity`, shipped.length === 0, shipped.map((p) => p.message).join(" | "));

  // A rule that finds no clashes to check would pass on an empty site.
  const clashes = barbarians(locale)
    .flatMap((b) => b.farming.map((f) => ({ b, f })))
    .filter(({ b, f }) =>
      b.damageTypes.some((d) => (getFarmingArea(locale, f.area)?.commonImmunities ?? []).includes(d)),
    );
  check(`${locale}: there are clashing entries to check`, clashes.length >= 10, `${clashes.length}`);
}

{
  // The sentence that actually shipped: War Cry, whose only damage is physical,
  // rating Worldstone Keep a 5 with no mention of the physical immunity the
  // area's own entry records. Restored here from the real page by stripping the
  // clause that names it.
  const warCry = barbarians("en-us").find((b) => b.slug === "war-cry-barbarian");
  check("War Cry deals physical damage only", warCry?.damageTypes.join(",") === "physical", warCry?.damageTypes.join(","));
  check(
    "Worldstone Keep records physical immunity",
    (getFarmingArea("en-us", "worldstone-keep")?.commonImmunities ?? []).includes("physical" as Element),
  );
  if (warCry) {
    const silent = {
      ...warCry,
      farming: warCry.farming.map((f) =>
        f.area === "worldstone-keep"
          ? { ...f, rating: 5, why: "Three floors of dense elites and the run to Baal is the standard endgame loop." }
          : f,
      ),
    };
    const fired = checkFarmingImmunities(
      [asBuildLike(silent as Build)],
      (s) => getFarmingArea("en-us", s)?.commonImmunities,
      "control",
    );
    check(
      "a rating-5 entry silent about physical immunity fires",
      fired.some((p) => p.rule === "immunity-unnamed" && /worldstone-keep/.test(p.message)),
      rules(fired),
    );

    // Denial is a separate failure from silence, and both must be caught.
    const denying = {
      ...warCry,
      farming: warCry.farming.map((f) =>
        f.area === "worldstone-keep"
          ? { ...f, why: "Nothing in the Keep is immune to physical, so the shout lands on everything." }
          : f,
      ),
    };
    check(
      "an entry denying the immunity fires",
      checkFarmingImmunities([asBuildLike(denying as Build)], (s) => getFarmingArea("en-us", s)?.commonImmunities, "control")
        .some((p) => p.rule === "immunity-unnamed"),
    );

    // And the corrected form is silent, or the rule is one the next author deletes.
    const fixed = {
      ...warCry,
      farming: warCry.farming.map((f) =>
        f.area === "worldstone-keep"
          ? { ...f, why: "Three floors of dense elites — but physical immunes are common here and this build has no answer to one." }
          : f,
      ),
    };
    check(
      "the corrected entry is silent",
      checkFarmingImmunities([asBuildLike(fixed as Build)], (s) => getFarmingArea("en-us", s)?.commonImmunities, "control").length === 0,
    );
  }
}

// ===========================================================================
console.log("\nBlock, on the two builds that cannot have it");
// ===========================================================================
{
  const twoWeapon = barbarians("en-us").filter((b) => REQUIRES_TWO_WEAPONS.includes(b.primarySkill));
  check("two builds require a second weapon", twoWeapon.length === 2, twoWeapon.map((b) => b.slug).join(", "));
  check(
    "and the other four do not",
    barbarians("en-us").length - twoWeapon.length === 4,
  );

  for (const locale of LOCALES) {
    const shipped = checkTwoWeaponBlock(barbarians(locale).map(asBuildLike), locale);
    check(`${locale}: neither publishes a block target`, shipped.length === 0, shipped.map((p) => p.message).join(" | "));
  }

  // The four that can block do, which is what makes the absence meaningful
  // rather than an oversight the rule froze in place.
  const blockers = barbarians("en-us").filter((b) => b.breakpoints.some((bp) => bp.stat === "fbr"));
  check("the four shield builds publish one", blockers.length === 4, blockers.map((b) => b.slug).join(", "));

  const frenzy = barbarians("en-us").find((b) => b.slug === "frenzy-barbarian");
  if (frenzy) {
    const withBlock = {
      ...frenzy,
      breakpoints: [
        ...frenzy.breakpoints,
        { stat: "fbr" as const, value: 42, frames: 3, why: "Three frames.", priority: "recommended" as const },
      ],
    };
    const fired = checkTwoWeaponBlock([asBuildLike(withBlock as Build)], "control");
    check("a block target on Frenzy fires", fired.some((p) => p.rule === "block-on-a-two-weapon-build"), rules(fired));
    check(
      "the same target on Whirlwind stays silent",
      checkTwoWeaponBlock([asBuildLike(barbarians("en-us").find((b) => b.slug === "whirlwind-barbarian")!)], "control").length === 0,
    );
  }
}

// ===========================================================================
console.log("\nBattle Orders' life figure, as arithmetic");
// ===========================================================================
for (const locale of LOCALES) {
  const passages = allPassages(locale);
  const formulaSource = passages.find((p) => p.subject === "battle-orders" && readLifeFormula(p.text));
  check(`${locale}: the class page states the per-level rule`, formulaSource !== undefined);
  const formula = formulaSource ? readLifeFormula(formulaSource.text) : undefined;
  check(`${locale}: the rule reads as +35% and +3%`, formula?.base === 35 && formula?.perLevel === 3, JSON.stringify(formula));

  const shipped = checkBattleOrdersLife(formula, passages);
  check(`${locale}: every quoted figure follows from it`, shipped.length === 0, shipped.map((p) => p.message).join(" | "));

  // Pairs are actually being found. Six build pages quote one.
  const quoting = passages.filter(
    (p) =>
      (p.subject === "battle-orders" || /battle orders/i.test(p.text)) &&
      /(maximum life|vida m[áa]xima)/i.test(p.text) &&
      /\+\d{2,3}\s*%/.test(p.text),
  );
  check(`${locale}: figures are found to check`, quoting.length >= 5, `${quoting.length}`);
}

{
  const passages = allPassages("en-us");
  const formula = { base: 35, perLevel: 3 };

  // 92 is what +35% and +3% give at twenty. 80 is what they give at sixteen.
  // Swap either and the arithmetic refuses it.
  const bent = passages.map((p) => ({ ...p, text: p.text.replace("+92% maximum life at twenty", "+96% maximum life at twenty") }));
  const fired = checkBattleOrdersLife(formula, bent);
  check("+96% at twenty fires", fired.some((p) => p.rule === "battle-orders-life-disagrees"), rules(fired));
  check("and it fires on more than one page", new Set(fired.map((p) => p.where)).size >= 2, `${new Set(fired.map((p) => p.where)).size}`);

  // Changing the class page's rule instead fails the build pages, which is the
  // other direction the same drift arrives from.
  const otherWay = checkBattleOrdersLife({ base: 35, perLevel: 4 }, passages);
  check(
    "raising the per-level step fails the pages quoting the total",
    otherWay.some((p) => p.rule === "battle-orders-life-disagrees"),
    rules(otherWay),
  );

  // A missing rule is itself the failure — six pages would have nothing to
  // derive their number from.
  check(
    "losing the rule from the class page fires",
    checkBattleOrdersLife(undefined, passages).some((p) => p.rule === "battle-orders-life-disagrees"),
  );

  // Rates must not be read as totals: "10% per hard point of Battle Orders"
  // sits in the same sentence as a life figure on two pages.
  const rate = [
    {
      where: "control",
      text: "Battle Orders gives Concentrate +10% damage per hard point, and +92% maximum life at twenty.",
      subject: "battle-orders",
    },
  ];
  check("a per-hard-point rate is not read as a total", checkBattleOrdersLife(formula, rate).length === 0);
}

// ===========================================================================
console.log("\nThree claims a single column refutes");
// ===========================================================================
for (const locale of LOCALES) {
  const shipped = checkColumnRefutedClaims(allPassages(locale).map(({ where, text }) => ({ where, text })));
  check(`${locale}: no page makes one`, shipped.length === 0, shipped.map((p) => p.message).join(" | "));
}

{
  const REJECTED: { note: string; rule: string; line: string }[] = [
    {
      note: "Berserk credited with damage reduction, which par5 = 0 refutes",
      rule: "berserk-damage-reduction",
      line: "Berserk gives you damage reduction while it swings, which offsets the zero defence.",
    },
    {
      note: "the pt-BR mirror",
      rule: "berserk-damage-reduction",
      line: "O Berserk adiciona redução de dano enquanto ataca, o que compensa a defesa zero.",
    },
    {
      // The first draft of this rule was silent here. It tested the whole
      // sentence for a negator, and "defence is zero" is a negator about
      // something else entirely — so the one sentence the rule exists to catch
      // was the one it let through. Found by mutating the real page rather than
      // by reading the regex.
      note: "the claim with an unrelated 'zero' earlier in the same sentence",
      rule: "berserk-damage-reduction",
      line: "**Your defence is zero while it swings** — but Berserk grants damage reduction to make up for it",
    },
    {
      note: "the pt-BR mirror of that shape",
      rule: "berserk-damage-reduction",
      line: "**A defesa é zero enquanto ataca** — mas o Berserk concede redução de dano para compensar",
    },
    {
      note: "Leap Attack called uninterruptible, inherited from the other three",
      rule: "leap-attack-uninterruptible",
      line: "Leap Attack cannot be interrupted, so a hit mid-animation does not cost you the swing.",
    },
    {
      note: "the pt-BR mirror",
      rule: "leap-attack-uninterruptible",
      line: "O Leap Attack não pode ser interrompido, então levar um golpe no meio da animação não custa o ataque.",
    },
    {
      note: "Whirlwind's mana quoted from the raw column",
      rule: "mana-from-the-raw-column",
      line: "Whirlwind costs 25 mana per cast, which is the most expensive attack the class has.",
    },
    {
      note: "War Cry's mana quoted from the raw column",
      rule: "mana-from-the-raw-column",
      line: "War Cry costs 40 mana, so mana per kill is the constraint on the build.",
    },
    {
      note: "the pt-BR mirror",
      rule: "mana-from-the-raw-column",
      line: "O Whirlwind custa 25 de mana por giro, o mais caro da classe.",
    },
  ];

  for (const { note, rule, line } of REJECTED) {
    const fired = checkColumnRefutedClaims([{ where: "control", text: line }]);
    check(`fires on: ${note}`, fired.some((p) => p.rule === rule), rules(fired) || "nothing fired");
  }

  const ACCEPTED: { note: string; line: string }[] = [
    {
      note: "the denial, which is what the pages actually say",
      line: "Your defence is zero while it swings, and Berserk grants no damage reduction, whatever older guides say.",
    },
    {
      note: "the pt-BR denial",
      line: "A defesa é zero enquanto ataca, e o Berserk não dá redução de dano nenhuma.",
    },
    {
      note: "Leap Attack's real property, stated the right way round",
      line: "Leap Attack can be interrupted, unlike Concentrate, Frenzy and Whirlwind.",
    },
    {
      note: "the pt-BR mirror",
      line: "O Leap Attack pode ser interrompido, diferente de Concentrate, Frenzy e Whirlwind.",
    },
    {
      note: "the three that really cannot be, named without Leap Attack",
      line: "Frenzy cannot be interrupted, so the stack does not break when something hits you.",
    },
    {
      note: "the shifted mana costs",
      line: "Whirlwind costs 12.5 mana and War Cry 10, because manashift divides the column both quote.",
    },
    {
      note: "the pt-BR mirror",
      line: "O Whirlwind custa 12,5 de mana e o War Cry 10.",
    },
    {
      note: "damage reduction on an item, in a sentence that does not name the skill",
      line: "Stormshield is 35% damage reduction and the highest block rate in the game.",
    },
    {
      // The class page's own refutation, which the rule reported as the claim
      // until "with" was removed from the list of granting verbs.
      note: "the class page explaining why the claim is wrong",
      line:
        "The row has a damage-resist stat and the parameter feeding it is zero at every level, so any " +
        "guide crediting Berserk with damage reduction is reading the column and not the value.",
    },
    {
      note: "the enemy-damage stat, which is Battle Cry's and not this one",
      line: "Take the Battle Cry package: its enemy damage reduction is a defensive stat, where the Berserk package answers immunity.",
    },
    {
      note: "the raw number appearing as something other than a mana cost",
      line: "Whirlwind reaches 25% attack rating on the second hit and beyond.",
    },
  ];

  for (const { note, line } of ACCEPTED) {
    const fired = checkColumnRefutedClaims([{ where: "control", text: line }]);
    check(`silent on: ${note}`, fired.length === 0, rules(fired));
  }
}

// ===========================================================================
console.log("\nA mastery on the build with no weapon damage");
// ===========================================================================
{
  const warCry = barbarians("en-us").find((b) => b.slug === "war-cry-barbarian");
  check("War Cry is the class's one weaponless primary", NO_WEAPON_DAMAGE.length === 1 && NO_WEAPON_DAMAGE[0] === "war-cry");

  for (const locale of LOCALES) {
    const shipped = checkMasteryOnWeaponlessBuild(barbarians(locale).map(asBuildLike), locale);
    check(`${locale}: it allocates no mastery`, shipped.length === 0, shipped.map((p) => p.message).join(" | "));
  }

  // Every other build does allocate one, so the absence is a decision.
  const withMastery = barbarians("en-us").filter((b) =>
    b.skills.some((s) => s.skill.endsWith("-mastery") && s.points > 0),
  );
  check("the other five allocate a mastery", withMastery.length === 5, withMastery.map((b) => b.slug).join(", "));

  if (warCry) {
    const given = {
      ...warCry,
      skills: [...warCry.skills, { skill: "mace-mastery", points: 20, role: "main" as const, note: "More damage." }],
    };
    const fired = checkMasteryOnWeaponlessBuild([asBuildLike(given as Build)], "control");
    check("a mastery on War Cry fires", fired.some((p) => p.rule === "war-cry-given-a-mastery"), rules(fired));

    const zeroed = {
      ...warCry,
      skills: [...warCry.skills, { skill: "mace-mastery", points: 0, role: "flex" as const, note: "Not taken." }],
    };
    check("a zero-point entry stays silent", checkMasteryOnWeaponlessBuild([asBuildLike(zeroed as Build)], "control").length === 0);
  }
}

console.log("\nWiring");
check("eight rules are exported", BARBARIAN_RULES.length === 8, `${BARBARIAN_RULES.length}`);
check("two skills carry a shifted mana cost", SHIFTED_MANA.length === 2);

const never = BARBARIAN_RULES.filter((r) => !exercised.has(r));
check("every exported rule was seen to fire", never.length === 0, `never fired: ${never.join(", ")}`);
const ghosts = [...exercised].filter((r) => !BARBARIAN_RULES.includes(r as (typeof BARBARIAN_RULES)[number]));
check("no rule fires under an id the list does not declare", ghosts.length === 0, ghosts.join(", "));

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
