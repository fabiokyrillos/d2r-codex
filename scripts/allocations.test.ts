/**
 * The skill-plan contracts, for every class and both locales.
 *
 * Three things a build page can say about its own skill plan, and three things
 * that can be false about them:
 *
 *   role     `synergy` claims hard points here raise something you cast
 *   budget   the allocations have to be spendable by a level 99 character
 *   prose    a sentence that states the total has to state the real one
 *
 * All three arrived as warnings on somebody else's class. The synergy rule
 * shipped reporting eleven allocations it could not confirm and failing on none
 * of them, because the pass that wrote it owned the Druid; the gear rule the
 * same, with nine picks. A gate that reports and does not fail is a list, and a
 * list is what this file exists to stop being.
 *
 * So the sweep here fails. Not "on the classes this pass owns" — on all of
 * them, in both locales, with no per-class escape hatch and no allowlist. Four
 * of those eleven turned out to be correct allocations that the rule could not
 * see, which is why `receiverSkillsOf` and `missileSynergies` exist; the other
 * seven were defects and are fixed. Neither outcome needed an exception.
 *
 * Every rule below is proven to fire by a planted mutation, and each mutation is
 * a specific wrong thing a build page invites rather than a generic bad value.
 *
 * Run with `npm run test:allocations`.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { MAX_HARD_POINTS, SKILL_GRAPH } from "../content/classes/skill-graph";
import { getBuilds } from "../lib/registry";
import {
  checkPointBudget,
  checkStatedRemainders,
  checkStatedTotals,
  checkSynergyRoles,
  pointBudgetOf,
  receiverSkillsOf,
  synergySourcesOf,
} from "./allocation-claims";
import type { Build, SkillAllocation, Slug } from "../lib/types";

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

const LOCALES = ["en-us", "pt-br"] as const;
const enBuilds = getBuilds("en-us");
const by = (slug: string) => {
  const build = enBuilds.find((b) => b.slug === slug);
  if (!build) throw new Error(`no build "${slug}"`);
  return build;
};

/** One build with one allocation replaced, for a planted mutation. */
const withAllocation = (build: Build, skill: Slug, patch: Partial<SkillAllocation>): Build => ({
  ...build,
  skills: build.skills.map((a) => (a.skill === skill ? { ...a, ...patch } : a)),
});

/** Every authored string a build carries at runtime. */
const runtimeLines = (build: Build): string[] => [
  build.summary,
  build.playstyle,
  ...build.strengths,
  ...build.weaknesses,
  ...(build.flexPoints ?? []),
  ...build.skills.map((a) => a.note ?? ""),
  ...build.stats.notes,
  build.immunityPlan ?? "",
  build.hardcoreNotes ?? "",
  build.selfFoundNotes ?? "",
  build.levelingPath?.summary ?? "",
  ...build.gearSets.flatMap((set) => [set.goal, set.notes ?? "", set.nextUpgrade ?? ""]),
];

// ---------------------------------------------------------------------------
console.log("\nThe live sweep: every build, every class, both locales");
// ---------------------------------------------------------------------------
{
  const problems = LOCALES.flatMap((locale) => {
    const builds = getBuilds(locale);
    return [
      ...checkSynergyRoles(builds, SKILL_GRAPH, locale),
      ...checkPointBudget(builds, SKILL_GRAPH, locale),
      ...checkStatedTotals(builds, runtimeLines, locale),
      ...checkStatedRemainders(builds, locale),
    ];
  });
  for (const problem of problems) console.log(`       ${problem.message}`);
  check(
    `no build misnames a role, overspends its budget or states a total it does not have ` +
      `(${enBuilds.length} builds x ${LOCALES.length} locales)`,
    problems.length === 0,
    `${problems.length} problems, listed above`,
  );
  check("the sweep actually read something", enBuilds.length > 30, `${enBuilds.length} builds`);

  const classes = new Set(enBuilds.map((b) => b.classSlug));
  check(
    "and it covers every class the site publishes, not the one this pass owns",
    classes.size === 5,
    [...classes].join(", "),
  );
}

// ---------------------------------------------------------------------------
console.log("\nTotals stated in a source comment, which no reader sees and no page renders");
// ---------------------------------------------------------------------------
{
  /*
   * The Frost Nova page said "108 of 110" three times: in a weakness, in a flex
   * point, and in the file's own header comment above the export. The first two
   * are reachable from the registry and the third is not — and the third is the
   * one the next author reads before touching the plan.
   */
  const dir = join(process.cwd(), "content", "builds");
  const sources = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "pt-br.ts")
    .map((f) => readFileSync(join(dir, f), "utf8"));

  const bySlug = new Map<string, string>();
  for (const source of sources) {
    const slug = /\bslug:\s*"([a-z0-9-]+)"/.exec(source)?.[1];
    if (slug) bySlug.set(slug, source);
  }

  const problems = checkStatedTotals(
    enBuilds.filter((b) => bySlug.has(b.slug)),
    (build) => [bySlug.get(build.slug) ?? ""],
    "source",
  );
  for (const problem of problems) console.log(`       ${problem.message}`);
  check("no build file states a total its own allocations disagree with", problems.length === 0);
  check(
    "every build file was found and read",
    bySlug.size === enBuilds.length,
    `${bySlug.size} of ${enBuilds.length}`,
  );
}

// ---------------------------------------------------------------------------
console.log("\nAllocation notes reach the reader in their own language");
// ---------------------------------------------------------------------------
{
  /*
   * A note is keyed by skill slug in the overlay. Add one to a build and forget
   * the translation and the tile renders English inside a Portuguese page, with
   * the build still counted as fully covered — the same defect `check-content`
   * already catches for gear-pick reasons, in the one field it does not reach.
   */
  const leaks: string[] = [];
  for (const locale of LOCALES.filter((l) => l !== "en-us")) {
    const translated = getBuilds(locale);
    for (const build of enBuilds) {
      const other = translated.find((b) => b.slug === build.slug);
      if (!other) continue;
      for (const allocation of build.skills) {
        if (!allocation.note) continue;
        const twin = other.skills.find((a) => a.skill === allocation.skill)?.note;
        if (twin === allocation.note) leaks.push(`${locale}/${build.slug}: ${allocation.skill}`);
      }
    }
  }
  for (const leak of leaks) console.log(`       ${leak}`);
  check("no allocation note falls back to English", leaks.length === 0, `${leaks.length} leaks`);
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a role that claims a synergy the game does not give");
// ---------------------------------------------------------------------------
{
  const roleFails = (build: Build) => checkSynergyRoles([build], SKILL_GRAPH, "control").length;

  // Utility renamed as a synergy. Teleport feeds nothing at all.
  check(
    "calling a pure utility a synergy is rejected",
    roleFails(withAllocation(by("blizzard-sorceress"), "teleport", { role: "synergy" })) === 1,
  );

  // A prerequisite renamed as a synergy. Telekinesis is Teleport's prerequisite
  // and the game does not mark its Energy Shield reference as a synergy.
  check(
    "calling a prerequisite a synergy is rejected",
    roleFails(withAllocation(by("frozen-orb-sorceress"), "telekinesis", { role: "synergy" })) === 1,
  );

  /*
   * The receiver of an edge, labelled as though it were the provider. Holy
   * Shock feeds Fist of the Heavens and Fist of the Heavens does not feed Holy
   * Shock, so the pair is one-directional and the reversal is unambiguous.
   *
   * The first draft of this control used Ice Bolt and Frozen Orb and proved
   * nothing: the game draws that edge in *both* directions, which is exactly
   * the reason a reversal has to be checked against the graph rather than
   * against an author's memory of which way round it goes.
   */
  check(
    "the pair the reversal is built on really is one-directional",
    synergySourcesOf(SKILL_GRAPH, "fist-of-the-heavens").includes("holy-shock") &&
      !synergySourcesOf(SKILL_GRAPH, "holy-shock").includes("fist-of-the-heavens"),
  );
  const reversed: Build = {
    ...by("fohdin"),
    primarySkill: "holy-shock",
    skills: by("fohdin").skills.map((a) =>
      a.skill === "holy-shock"
        ? { ...a, role: "main" as const, points: 20 }
        : a.skill === "fist-of-the-heavens"
          ? { ...a, role: "synergy" as const }
          : a,
    ),
  };
  check(
    "a synergy's receiver, relabelled as its provider, is rejected",
    checkSynergyRoles([reversed], SKILL_GRAPH, "control").some((p) =>
      p.message.includes("fist-of-the-heavens is allocated"),
    ),
  );
  check(
    "and the direction that is real still passes",
    roleFails(by("fohdin")) === 0,
  );

  /*
   * A soft-level bonus. The Druid's Summon Dire Wolf raises the spirit wolves
   * through their *effective* level, which a +3 Summoning pelt also raises, so
   * the graph draws no edge and buying hard points for it is the mistake.
   */
  check(
    "a soft-level summon bonus called a hard-point synergy is rejected",
    roleFails(withAllocation(by("summon-druid"), "summon-dire-wolf", { role: "synergy" })) === 1,
  );

  /*
   * A synergy of a synergy. Ice Blast really does feed Ice Bolt, and the Frozen
   * Orb Sorceress really does max Ice Bolt — as the Orb's synergy. Nobody casts
   * Ice Bolt, so the points collect nothing, and a rule that admitted any
   * allocated skill as a receiver would pass this.
   */
  const chained = withAllocation(
    withAllocation(by("frozen-orb-sorceress"), "ice-blast", { role: "synergy", points: 20 }),
    "ice-bolt",
    { role: "synergy" },
  );
  check("a synergy that only feeds another synergy is rejected", roleFails(chained) === 1);

  /*
   * A synergy feeding a one-point convenience. Charged Bolt feeds Lightning,
   * which the Nova Sorceress keeps at one point for the rare single target.
   */
  const convenience = withAllocation(by("nova-sorceress"), "charged-bolt", {
    role: "synergy",
    points: 20,
  });
  check(
    "a synergy that only feeds a one-point utility is rejected",
    roleFails(convenience) === 1,
  );

  check(
    "the rejection says what it looked at",
    checkSynergyRoles([convenience], SKILL_GRAPH, "control")[0]?.message.includes(
      "no hard-point edge",
    ) === true,
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe three shapes the receiver rule must keep admitting");
// ---------------------------------------------------------------------------
{
  /*
   * Each of these was rejected by the first version of the rule, which scoped
   * receivers to `role: "main"`. All three are correct, and a rule that fails
   * them is a rule an author learns to route around.
   */
  check(
    "a synergy into a maxed utility passes — Defiance feeds the Smiter's Holy Shield",
    checkSynergyRoles([by("smiter")], SKILL_GRAPH, "control").length === 0,
  );
  check(
    "and the graph really draws that edge",
    synergySourcesOf(SKILL_GRAPH, "holy-shield").includes("defiance"),
  );
  check(
    "Holy Shield is not this build's `main`, which is why the narrow rule failed it",
    by("smiter").skills.find((a) => a.skill === "holy-shield")?.role === "utility",
  );

  check(
    "a synergy into the primary skill passes even at one point — the Tesladin's aura is an item",
    checkSynergyRoles([by("tesladin")], SKILL_GRAPH, "control").length === 0,
  );
  check(
    "and Holy Shock really is that build's primary skill at one point",
    by("tesladin").primarySkill === "holy-shock" &&
      by("tesladin").skills.find((a) => a.skill === "holy-shock")?.points === 1,
  );

  check(
    "a missile-borne synergy passes — the FoHdin's Holy Bolt feeds the waves",
    checkSynergyRoles([by("fohdin")], SKILL_GRAPH, "control").length === 0,
  );
  check(
    "the skill row alone would not have shown it",
    SKILL_GRAPH["fist-of-the-heavens"].synergies.every((s) => s.from !== "holy-bolt") &&
      (SKILL_GRAPH["fist-of-the-heavens"].missileSynergies ?? []).some(
        (s) => s.from === "holy-bolt",
      ),
  );
  check(
    "and the missile names the component, because it is not the whole skill",
    SKILL_GRAPH["fist-of-the-heavens"].missileSynergies?.[0]?.element === "mag" &&
      SKILL_GRAPH["fist-of-the-heavens"].damage?.element === "ltng",
  );

  check(
    "a one-point utility is not a receiver, which is what keeps the rule strict",
    !receiverSkillsOf(by("nova-sorceress")).includes("lightning"),
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a plan that does not add up");
// ---------------------------------------------------------------------------
{
  const budgetFails = (build: Build, rule: string) =>
    checkPointBudget([build], SKILL_GRAPH, "control").filter((p) => p.rule === rule).length;

  const wind = by("wind-druid");

  // Mandatory points alone above the cap.
  const overspent: Build = {
    ...wind,
    skills: [...wind.skills, { skill: "hurricane" as Slug, points: 20, role: "main" as const }].map(
      (a, i) => (i === 0 ? { ...a, points: MAX_HARD_POINTS } : a),
    ),
  };
  check("a plan above 110 mandatory points is rejected", budgetFails(overspent, "budget-exceeded") >= 1);

  /*
   * The one the build page's own legend invites. It prints mandatory and
   * optional side by side — "108 of 110 mandatory hard points, plus 5 optional"
   * — and 113 is not a plan a reader can finish. Flex points come out of the
   * same budget as everything else.
   */
  const fireClaws = by("fire-claws-druid");
  const spare = MAX_HARD_POINTS - pointBudgetOf(fireClaws).mandatory;
  const overflexed: Build = {
    ...fireClaws,
    skills: [
      ...fireClaws.skills,
      { skill: "twister" as Slug, points: spare + 1, role: "flex" as const },
    ],
  };
  check(
    "optional points that push the plan past 110 are rejected",
    budgetFails(overflexed, "budget-exceeded") === 1,
    `mandatory ${pointBudgetOf(fireClaws).mandatory}, added ${spare + 1} flex`,
  );
  check(
    "and the same plan one point smaller passes",
    budgetFails(
      {
        ...fireClaws,
        skills: [
          ...fireClaws.skills,
          { skill: "twister" as Slug, points: spare, role: "flex" as const },
        ],
      },
      "budget-exceeded",
    ) === 0,
    `mandatory ${pointBudgetOf(fireClaws).mandatory}, added ${spare} flex`,
  );

  // A prerequisite counted twice by being allocated twice.
  const doubled: Build = { ...wind, skills: [...wind.skills, wind.skills[0]] };
  check(
    "a skill allocated twice is rejected",
    budgetFails(doubled, "duplicate-allocation") === 1,
  );

  // More hard points in one skill than the game allows.
  check(
    "more than the skill's own maximum is rejected",
    budgetFails(withAllocation(wind, wind.primarySkill, { points: 21 }), "points-above-skill-maximum") === 1,
  );

  // A plan that never buys the skill the build is named after.
  const unallocated: Build = {
    ...wind,
    skills: wind.skills.filter((a) => a.skill !== wind.primarySkill),
  };
  check(
    "a build that never allocates its own primary skill is rejected",
    budgetFails(unallocated, "primary-skill-unallocated") === 1,
  );

  // A prerequisite the plan forgot to pay for.
  const unpaid: Build = {
    ...fireClaws,
    skills: fireClaws.skills.filter((a) => a.skill !== "werebear"),
  };
  check(
    "a plan with an unpaid prerequisite is rejected",
    budgetFails(unpaid, "unpaid-prerequisite") >= 1,
  );

  check("and the real plans pass all five", checkPointBudget(enBuilds, SKILL_GRAPH, "control").length === 0);
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a sentence that states the wrong total");
// ---------------------------------------------------------------------------
{
  const stated = (build: Build, line: string) =>
    checkStatedTotals([build], () => [line], "control");

  const wind = by("wind-druid");
  const { mandatory, flex } = pointBudgetOf(wind);

  check(
    "the real total passes",
    stated(wind, `The finished build is ${mandatory} of 110 points.`).length === 0,
  );
  check(
    "the mandatory-plus-optional reading passes too",
    stated(wind, `That is ${mandatory + flex} of the 110 a level 99 character has.`).length === 0,
  );
  check(
    "a number that is neither is rejected",
    stated(wind, `The finished build is ${mandatory + 2} of 110 points.`).length === 1,
  );
  check(
    "pt-br: the same sentence in Portuguese is rejected",
    stated(wind, `A build pronta são ${mandatory + 2} de 110 pontos.`).length === 1,
  );
  check(
    "the slash form is read as well",
    stated(wind, `${mandatory + 2}/110 pontos duros.`).length === 1,
  );
  check(
    "the rejection names both numbers",
    (() => {
      const message = stated(wind, `${mandatory + 2} of 110`)[0]?.message ?? "";
      return message.includes(String(mandatory + 2)) && message.includes(String(mandatory));
    })(),
  );
  check(
    "a percentage that happens to end in 110 is not a total",
    stated(wind, "Conviction reaches 125 of 110% and stops there.").length === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a flex point that names the wrong remainder");
// ---------------------------------------------------------------------------
{
  const wind = by("wind-druid");
  const withBullet = (bullet: string): Build => ({ ...wind, flexPoints: [bullet] });
  const fires = (bullet: string) => checkStatedRemainders([withBullet(bullet)], "control").length;

  check("the real remainder passes, spelled out", fires("Twenty-three points are spare.") === 0);
  check("and in digits", fires("23 points are spare at level 99.") === 0);
  check("and in Portuguese", fires("Vinte e três pontos sobram no nível 99.") === 0);

  check("one off, spelled out, is rejected", fires("Twenty-two points are spare.") === 1);
  check("one off in digits is rejected", fires("22 points remain.") === 1);
  check("pt-br: one off is rejected", fires("Vinte e dois pontos sobram no nível 99.") === 1);
  check("pt-br: a different phrasing is read too", fires("Vinte pontos estão livres.") === 1);

  check(
    "a sentence about something other than spare points is not a claim",
    fires("Oak Sage caps at twenty and its points keep scaling.") === 0,
  );
  check(
    "and neither is a sentence about charges",
    fires("Feral Rage holds fifteen charges and they are free to refresh.") === 0,
  );

  check(
    "the rejection names the number the plan actually leaves",
    checkStatedRemainders([withBullet("22 points remain.")], "control")[0]?.message.includes(
      "leaves 23",
    ) === true,
  );

  /*
   * The rule reporting nothing is only meaningful if it can see the sentences.
   * Move every plan by one point and every page that states its remainder has
   * to contradict itself — which is a floor on how many the regular expression
   * is actually reading, not on how many exist.
   */
  const shifted = enBuilds.map(
    (build): Build => ({
      ...build,
      skills: build.skills.map((a, i) => (i === 0 ? { ...a, points: a.points - 1 } : a)),
    }),
  );
  const readable = checkStatedRemainders(shifted, "control").length;
  check(
    "and it reads the remainders the site already publishes, rather than none of them",
    readable >= 7,
    `${readable} pages state a remainder this rule can read`,
  );
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed.`);
if (failures.length > 0) {
  console.log(`\n${failures.length} FAILED:`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
