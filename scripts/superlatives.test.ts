/**
 * Proof that the comparative controls fire — on the sentences that shipped.
 *
 * Every mutation below is text this repository actually published at `6716d1f`,
 * in the locale it published in. The audit that found them counted three; the
 * live sweep at the bottom found a fourth the moment it first ran, on the Fire
 * Druid's own page, which is the argument for having written the sweep rather
 * than three assertions. A rule that cannot reject the sentence it was
 * written for would not have caught the mistake it exists to catch, so each one
 * is asserted red, and its correction is asserted green in the same breath: a
 * rule that rejects both the error and its fix is a rule the next author
 * deletes.
 *
 * The live sweep at the bottom runs the rules over every skill and every build
 * on the site, in both locales. It is the part that keeps working after this
 * file stops being interesting.
 *
 * Run with `npm run test:superlatives`.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { LOCALES } from "../lib/i18n/config";
import { getBuilds, getClasses, getSkills } from "../lib/registry";
import {
  checkLifeSuperlatives,
  checkSynergySuperlatives,
  lifeBonuses,
  rankedValues,
  synergyCoefficients,
} from "./superlative-claims";

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

const druidSkills = getSkills("en-us").filter((s) => s.classSlug === "druid");
const druidCoefficients = synergyCoefficients(druidSkills);
const druidLife = lifeBonuses(SKILL_GRAPH, "druid");

// ---------------------------------------------------------------------------
console.log("\nThe coefficients are read from the pages, not typed here");
// ---------------------------------------------------------------------------
{
  check(
    "every Druid damage synergy was parsed out of its authored bonus string",
    druidCoefficients.length === 28,
    `parsed ${druidCoefficients.length}`,
  );
  check(
    "absorb and duration synergies are excluded — they are not percentages of damage",
    !druidCoefficients.some((c) => c.receiver === "cyclone-armor") &&
      !druidCoefficients.some((c) => c.receiver === "hurricane" && c.value === 50),
  );

  const anySingle = rankedValues(druidCoefficients, "any", "single");
  const anyPair = rankedValues(druidCoefficients, "any", "pair");
  const physical = rankedValues(druidCoefficients, "physical", "single");

  check("the largest coefficient of any kind is 23%", anySingle[0] === 23, `got ${anySingle[0]}`);
  check("the largest pair is 23%", anyPair[0] === 23, `got ${anyPair[0]}`);
  check("the second-largest pair is 22%", anyPair[1] === 22, `got ${anyPair[1]}`);
  check("the largest physical coefficient is 18%", physical[0] === 18, `got ${physical[0]}`);
  check(
    "Rabies' lone 20% is not a pair, so it does not sit between 23 and 22",
    anySingle.includes(20) && !anyPair.includes(20),
  );
  check(
    "a pair value belongs to a receiver that really holds it twice",
    druidCoefficients.filter((c) => c.receiver === "firestorm" && c.value === 23).length === 2,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutations: the three sentences that shipped at 6716d1f");
// ---------------------------------------------------------------------------
{
  const shippedVolcanoEn =
    "It is **Armageddon's physical synergy** at 18% per hard point, the largest single synergy coefficient in the class.";
  const shippedVolcanoPt =
    "Ela é a **sinergia física do Armageddon** com 18% por ponto duro, o maior coeficiente de sinergia único da classe.";
  const fixedVolcanoEn =
    "It is **Armageddon's physical synergy** at 18% per hard point, the largest physical-damage synergy in the class.";
  const fixedVolcanoPt =
    "Ela é a **sinergia física do Armageddon** com 18% por ponto duro, a maior sinergia de dano físico da classe.";

  check(
    "en-us: Volcano's unqualified 'largest single synergy coefficient' is rejected",
    checkSynergySuperlatives([shippedVolcanoEn], druidCoefficients, "control").length === 1,
  );
  check(
    "pt-br: the same sentence is rejected in Portuguese",
    checkSynergySuperlatives([shippedVolcanoPt], druidCoefficients, "control").length === 1,
  );
  check(
    "en-us: narrowing it to 'physical-damage synergy' passes, because 18% is that maximum",
    checkSynergySuperlatives([fixedVolcanoEn], druidCoefficients, "control").length === 0,
  );
  check(
    "pt-br: the Portuguese correction passes too",
    checkSynergySuperlatives([fixedVolcanoPt], druidCoefficients, "control").length === 0,
  );
  check(
    "the rejection names 23% as the number the claim was reaching for",
    checkSynergySuperlatives([shippedVolcanoEn], druidCoefficients, "control")[0]?.message.includes(
      "23%",
    ) === true,
  );

  const shippedClawsEn =
    "Its two synergies are both **22% per hard point**, the highest pair on the class, and both sit in the elemental tree.";
  const shippedClawsPt =
    "As duas sinergias dela são de **22% por ponto duro**, o par mais alto da classe, e ambas ficam na árvore elemental.";
  const fixedClawsEn =
    "Its two synergies are both **22% per hard point**, the second-highest pair on the class after Firestorm's 23%, and both sit in the elemental tree.";
  const fixedClawsPt =
    "As duas sinergias dela são de **22% por ponto duro**, o segundo par mais alto da classe, atrás dos 23% do Firestorm, e ambas ficam na árvore elemental.";

  check(
    "en-us: Fire Claws' 'highest pair on the class' is rejected",
    checkSynergySuperlatives([shippedClawsEn], druidCoefficients, "control").length === 1,
  );
  check(
    "pt-br: 'o par mais alto da classe' is rejected",
    checkSynergySuperlatives([shippedClawsPt], druidCoefficients, "control").length === 1,
  );
  check(
    "en-us: 'second-highest pair' passes, because 22% really is second",
    checkSynergySuperlatives([fixedClawsEn], druidCoefficients, "control").length === 0,
  );
  check(
    "pt-br: 'o segundo par mais alto' passes",
    checkSynergySuperlatives([fixedClawsPt], druidCoefficients, "control").length === 0,
  );

  /*
   * The overshoot, planted for the same reason `immunity-claims.ts` plants
   * one: correcting "largest" to "second-largest" everywhere would clear the
   * rule and be wrong in the other direction.
   */
  check(
    "calling Firestorm's genuine 23% pair the *second*-highest is also rejected",
    checkSynergySuperlatives(
      ["Its two synergies are both 23% per hard point, the second-highest pair on the class."],
      druidCoefficients,
      "control",
    ).length === 1,
  );

  const shippedLycEn =
    "**+20% life at level 1 and 5% more per level**, applied in whichever form you are in. At twenty points that is +115% life, which is the largest single life bonus available to any class.";
  const shippedLycPt =
    "**+20% de vida no nível 1 e mais 5% por nível**, aplicado na forma em que você estiver. Em vinte pontos são +115% de vida, o maior bônus de vida único disponível a qualquer classe.";
  const fixedLycEn =
    "At twenty points that is +115% life — only a maxed Oak Sage gives this class more, at 125%, and that one is a totem that can be killed.";

  check(
    "en-us: Lycanthropy's 'largest life bonus available to any class' is rejected",
    checkLifeSuperlatives([shippedLycEn], druidLife, "control").length === 1,
  );
  check(
    "pt-br: the Portuguese mirror is rejected",
    checkLifeSuperlatives([shippedLycPt], druidLife, "control").length === 1,
  );
  check(
    "the rejection names Oak Sage and its 125%",
    (() => {
      const m = checkLifeSuperlatives([shippedLycEn], druidLife, "control")[0]?.message ?? "";
      return m.includes("oak-sage") && m.includes("125%");
    })(),
  );
  check(
    "naming the larger source is the exemption, and the correction takes it",
    checkLifeSuperlatives([fixedLycEn], druidLife, "control").length === 0,
  );
  check(
    "Oak Sage's own 125% may still be called the largest, because it is",
    checkLifeSuperlatives(
      ["At twenty points that is +125% life, the largest life bonus on the class."],
      druidLife,
      "control",
    ).length === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nControls: the rules stay quiet where they should");
// ---------------------------------------------------------------------------
{
  check(
    "a superlative with no percentage is an editorial judgement, not an arithmetic claim",
    checkSynergySuperlatives(
      ["The Wind Druid is the safest Hell farmer the class has, and its synergies say why."],
      druidCoefficients,
      "control",
    ).length === 0,
  );
  check(
    "a percentage with no superlative is left alone",
    checkSynergySuperlatives(
      ["Fissure's only synergies are Firestorm and Volcano, at 12% each."],
      druidCoefficients,
      "control",
    ).length === 0,
  );
  check(
    "a superlative about something other than a synergy is left alone",
    checkSynergySuperlatives(
      ["Tornado's 25-35 base is the largest opening damage in the elemental tree."],
      druidCoefficients,
      "control",
    ).length === 0,
  );
  check(
    "a life sentence with no superlative is left alone",
    checkLifeSuperlatives(
      ["Werebear adds a flat +75% life before Lycanthropy."],
      druidLife,
      "control",
    ).length === 0,
  );
  check(
    "a class with no coefficients yields no verdicts rather than a crash",
    checkSynergySuperlatives([druidSkills[0]!.summary], [], "control").length === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe live sweep: every skill and every build, both locales");
// ---------------------------------------------------------------------------
{
  const problems: string[] = [];
  let sentences = 0;

  for (const locale of LOCALES) {
    const skills = getSkills(locale);
    const builds = getBuilds(locale);

    for (const cls of getClasses(locale)) {
      const classSkills = skills.filter((s) => s.classSlug === cls.slug);
      if (classSkills.length === 0) continue;
      const coefficients = synergyCoefficients(classSkills);
      const bonuses = lifeBonuses(SKILL_GRAPH, cls.slug);

      const lines: string[] = [];
      for (const skill of classSkills) lines.push(skill.summary, ...(skill.mechanics ?? []));
      for (const build of builds.filter((b) => b.classSlug === cls.slug)) {
        lines.push(
          build.summary,
          build.playstyle,
          ...build.strengths,
          ...build.weaknesses,
          ...(build.flexPoints ?? []),
          ...build.stats.notes,
          ...build.skills.map((s) => s.note ?? ""),
          build.immunityPlan ?? "",
          build.breakpointNotes ?? "",
        );
      }
      const populated = lines.filter(Boolean);
      sentences += populated.length;

      for (const p of checkSynergySuperlatives(populated, coefficients, `${locale}/${cls.slug}`)) {
        problems.push(p.message);
      }
      for (const p of checkLifeSuperlatives(populated, bonuses, `${locale}/${cls.slug}`)) {
        problems.push(p.message);
      }
    }
  }

  check(
    `no unsupported comparative claim across ${sentences} authored strings`,
    problems.length === 0,
    problems.slice(0, 4).join(" | "),
  );
  check("the sweep actually read something", sentences > 500, `read ${sentences}`);
}

// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error(`\n${failures.length} FAILED of ${passed + failures.length}:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n${passed} checks passed.`);
