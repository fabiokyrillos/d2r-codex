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
import { getBuilds, getSkill } from "../lib/registry";
import {
  checkPackageClaims,
  checkPackageLocaleParity,
  checkPackages,
  checkPackagesDistinct,
  checkPointBudget,
  checkPrimarySynergyInvested,
  checkStatedRemainders,
  checkStatedTotals,
  checkSynergyRoles,
  pointBudgetOf,
  receiverSkillsOf,
  synergySourcesOf,
} from "./allocation-claims";
import { packageMath, worstCaseTotal } from "../lib/builds/packages";
import type {
  Build,
  SkillAllocation,
  SkillPackage,
  SkillPackageGroup,
  Slug,
} from "../lib/types";

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
      ...checkPrimarySynergyInvested(builds, SKILL_GRAPH, locale),
      ...checkPackages(builds, SKILL_GRAPH, locale),
      ...checkPackageClaims(builds, locale),
      ...checkPackagesDistinct(builds, locale),
      ...(locale === "en-us"
        ? []
        : checkPackageLocaleParity(getBuilds("en-us"), builds, locale)),
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
    classes.size === 6,
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

// ===========================================================================
// Optional packages
//
// The model exists because two Sorceress pages published forty-one and forty
// spare points against four prose suggestions worth more than the budget
// between them. Everything below is a way that can be true again.
// ===========================================================================

/** The builds that publish packages, and one of each for the mutations to bend. */
const packaged = enBuilds.filter((b) => (b.skillPackages?.length ?? 0) > 0);
const frozenOrb = by("frozen-orb-sorceress");
const nova = by("nova-sorceress");

/** One build with one package's fields replaced. */
const withPackage = (
  build: Build,
  packageId: string,
  patch: Partial<SkillPackage>,
): Build => ({
  ...build,
  skillPackages: (build.skillPackages ?? []).map((group) => ({
    ...group,
    packages: group.packages.map((p) => (p.id === packageId ? { ...p, ...patch } : p)),
  })),
});

/** One build with one package's allocation of one skill replaced. */
const withPackageSkill = (
  build: Build,
  packageId: string,
  skill: Slug,
  patch: Partial<SkillAllocation> | "drop",
): Build => {
  const pkg = (build.skillPackages ?? [])
    .flatMap((g) => g.packages)
    .find((p) => p.id === packageId);
  if (!pkg) throw new Error(`no package "${packageId}" on ${build.slug}`);
  return withPackage(build, packageId, {
    skills:
      patch === "drop"
        ? pkg.skills.filter((a) => a.skill !== skill)
        : pkg.skills.map((a) => (a.skill === skill ? { ...a, ...patch } : a)),
  });
};

/** One build with one group's fields replaced. */
const withGroup = (build: Build, patch: Partial<SkillPackageGroup>): Build => ({
  ...build,
  skillPackages: (build.skillPackages ?? []).map((g) => ({ ...g, ...patch })),
});

const packageFails = (build: Build) =>
  checkPackages([build], SKILL_GRAPH, "control").length;
/**
 * The rules a mutation trips, by name.
 *
 * Counting problems would make these assertions brittle in the wrong
 * direction: a package one point over the cap trips both the combined budget
 * and the page's worst case, and both are correct. What the mutation has to
 * prove is that the *named* rule fired.
 */
const packageRules = (build: Build) =>
  checkPackages([build], SKILL_GRAPH, "control").map((p) => p.rule);
const claimFails = (build: Build) => checkPackageClaims([build], "control").length;

// ---------------------------------------------------------------------------
console.log("\nThe arithmetic a package publishes is derived, not written down");
// ---------------------------------------------------------------------------
{
  /*
   * Nothing on a package card is authored arithmetic, so the check that matters
   * is that the derivation is the one a reader would do by hand: final points
   * per skill, less what the core already spends, summed.
   *
   * Worked by hand here rather than by calling the same function twice, which
   * would prove only that it equals itself.
   */
  const deepFreeze = packageMath(frozenOrb, frozenOrb.skillPackages![0].packages[0]);
  check(
    "Deep Freeze costs Glacial Spike 1→20, Frost Nova 1→20 and Static Field 1→4",
    deepFreeze.cost === 19 + 19 + 3,
    `${deepFreeze.cost}`,
  );
  check("and its total is the core plus that", deepFreeze.total === 69 + 41, `${deepFreeze.total}`);
  check("which is the whole budget, with nothing left", deepFreeze.free === 0, `${deepFreeze.free}`);

  const shield = nova
    .skillPackages![0].packages.find((p) => p.id === "energy-shield")!;
  const shieldMath = packageMath(nova, shield);
  check(
    "the Nova shield route costs Telekinesis 1→20, Thunder Storm 1→20 and one point of the shield",
    shieldMath.cost === 19 + 19 + 1,
    `${shieldMath.cost}`,
  );
  check(
    "and is the one route on either page that genuinely leaves points over",
    shieldMath.free === 2,
    `${shieldMath.free}`,
  );

  /*
   * The property that makes the cost a *cost*: a package raising a skill the
   * core already pays for charges the difference. Model the same package with
   * `points` read as an addition and the shield route would bill 20 for a
   * Telekinesis the core already opened.
   */
  const naive = shield.skills.reduce((sum, a) => sum + a.points, 0);
  check(
    "reading the same numbers as additions instead of finals over-bills the route",
    naive === 41 && naive !== shieldMath.cost,
    `${naive} vs ${shieldMath.cost}`,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a package that does not fit in the budget");
// ---------------------------------------------------------------------------
{
  check("the real packages fit", packaged.every((b) => packageFails(b) === 0));

  check(
    "a package one point over 110 is rejected",
    packageRules(
      withPackageSkill(frozenOrb, "deep-freeze", "static-field", { points: 5 }),
    ).includes("budget-exceeded"),
  );

  /*
   * The reason `choose` is required rather than defaulted. Three alternatives
   * at forty-one cost forty-one; three add-ons at forty-one cost a hundred and
   * twenty-three, and only the field distinguishes them.
   */
  check(
    "the same three packages priced as add-ons rather than alternatives are rejected",
    packageFails(withGroup(frozenOrb, { choose: "any" })) === 1,
  );
  check(
    "and the worst case it reports is all three summed",
    worstCaseTotal(withGroup(frozenOrb, { choose: "any" })) === 69 + 41 * 3,
    `${worstCaseTotal(withGroup(frozenOrb, { choose: "any" }))}`,
  );
  check(
    "while the real page prices one choice",
    worstCaseTotal(frozenOrb) === 110,
    `${worstCaseTotal(frozenOrb)}`,
  );

  // A group that says neither, which is how a page renders as a tree the
  // reader thinks they can max all of.
  check(
    "a group that does not declare whether its packages are alternatives is rejected",
    packageFails(withGroup(frozenOrb, { choose: "both" as never })) >= 1,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a package that cannot be spent");
// ---------------------------------------------------------------------------
{
  /*
   * An incomplete package. Energy Shield needs Chain Lightning, Chain Lightning
   * needs Lightning, Lightning needs Charged Bolt — and the Frozen Orb core
   * pays for none of the three, so dropping one from the package leaves a plan
   * no character can spend.
   */
  check(
    "a package missing a link in its own prerequisite chain is rejected",
    packageRules(withPackageSkill(frozenOrb, "energy-shield", "lightning", "drop")).includes(
      "unpaid-prerequisite",
    ),
  );

  check(
    "a package allocating more points than the game allows in a skill is rejected",
    packageRules(withPackageSkill(nova, "storm", "thunder-storm", { points: 21 })).includes(
      "points-above-skill-maximum",
    ),
  );

  /*
   * A package that lowers the core. Silent under a `Math.max(0, …)` cost, which
   * is why `lowersCore` is kept rather than clamped away: the route would bill
   * nothing for taking nineteen points off the reader's Static Field.
   */
  const lowered = withPackageSkill(frozenOrb, "boss-answer", "static-field", { points: 0 });
  check(
    "a package that asks for fewer points than the core is rejected",
    packageRules(lowered).includes("package-lowers-core"),
  );
  check(
    "and the cost it would otherwise have billed is unchanged",
    packageMath(lowered, lowered.skillPackages![0].packages[1]).cost === 19 + 3,
    `${packageMath(lowered, lowered.skillPackages![0].packages[1]).cost}`,
  );

  check(
    "a package allocation with no reason given is rejected",
    packageRules(withPackageSkill(nova, "storm", "charged-bolt", { note: undefined })).includes(
      "package-note-missing",
    ),
  );

  check(
    "two packages sharing an id are rejected",
    packageRules(withPackage(frozenOrb, "deep-freeze", { id: "boss-answer" })).includes(
      "package-duplicate-id",
    ),
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a synergy claimed inside a package");
// ---------------------------------------------------------------------------
{
  /*
   * A package's synergy claim is read against the *combined* plan, and both
   * directions of that matter.
   *
   * The Storm package calls Charged Bolt a synergy, which is true only because
   * the same package maxes Chain Lightning — the core holds it at one point and
   * casts it never. Drop Chain Lightning back to the core's single point and
   * the claim becomes exactly the one `checkSynergyRoles` exists to reject.
   */
  check("the Storm's Charged Bolt claim passes as written", packageFails(nova) === 0);
  check(
    "the same claim without the Chain Lightning that makes it true is rejected",
    packageRules(withPackageSkill(nova, "storm", "chain-lightning", "drop")).includes(
      "synergy-role-with-no-edge",
    ),
  );
  /*
   * Dropping it rather than lowering it, because a `main` allocation is a
   * receiver at any size — the Tesladin holds its own primary skill at one
   * point while a Dream supplies the aura, and `receiverSkillsOf` exists to
   * keep that correct. What makes the Charged Bolt claim false is Chain
   * Lightning not being something this plan casts at all.
   */

  /*
   * Telekinesis raises what Energy Shield charges through a parameter the
   * extraction records as a ratio, not as a synergy edge — the graph's own
   * header says so. A page that promoted it to "synergy" would be telling a
   * reader that +skills gear raises it, which is the opposite of true.
   */
  check(
    "calling the shield's Telekinesis a synergy is rejected",
    packageFails(withPackageSkill(frozenOrb, "energy-shield", "telekinesis", { role: "synergy" })) ===
      1,
  );

  // And the reverse: a real receiver demoted to a role that does not receive.
  check(
    "a package's Glacial Spike synergy claim survives its Ice Blast being maxed",
    packageFails(nova) === 0 && packageFails(frozenOrb) === 0,
  );
  check(
    "and is rejected once the Ice Blast it feeds is no longer in the plan",
    packageRules(withPackageSkill(frozenOrb, "boss-answer", "ice-blast", "drop")).includes(
      "synergy-role-with-no-edge",
    ),
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a package sentence that states the wrong number");
// ---------------------------------------------------------------------------
{
  check("every package's prose agrees with its own arithmetic", packaged.every((b) => claimFails(b) === 0));

  check(
    "a package claiming a total it does not reach is rejected",
    claimFails(withPackage(frozenOrb, "deep-freeze", { when: "It finishes at 104 of 110." })) === 1,
  );
  check(
    "the total the route actually reaches passes",
    claimFails(withPackage(frozenOrb, "deep-freeze", { when: "It finishes at 110 of 110." })) === 0,
  );
  check(
    "a remainder the route does not leave is rejected",
    claimFails(
      withPackage(nova, "energy-shield", { remainderNote: "Five points are left over." }),
    ) === 1,
  );
  check(
    "the remainder it does leave passes",
    claimFails(
      withPackage(nova, "energy-shield", { remainderNote: "Two points are left over." }),
    ) === 0,
  );
  check(
    "and the rejection names the number the route actually leaves",
    checkPackageClaims(
      [withPackage(nova, "energy-shield", { remainderNote: "Nine points remain." })],
      "control",
    )[0]?.message.includes("leaves 2") === true,
  );

  /*
   * The rule reporting nothing is only meaningful if it can see the sentences
   * the site actually publishes. Move one core allocation by a point and every
   * package that names its own remainder has to contradict itself — a floor on
   * how much live prose the regular expressions are reading, in both locales,
   * rather than on how much could exist.
   *
   * One package on the site states a remainder, because one route is the only
   * one that leaves anything over. Two locales, so two.
   */
  const readable = LOCALES.reduce((total, locale) => {
    const shifted = getBuilds(locale)
      .filter((b) => (b.skillPackages?.length ?? 0) > 0)
      .map((build) => ({
        ...build,
        skills: build.skills.map((a, i) => (i === 0 ? { ...a, points: a.points - 1 } : a)),
      }));
    return total + shifted.reduce((n, b) => n + claimFails(b), 0);
  }, 0);
  check(
    "it reads the remainders the packages already publish, rather than none of them",
    readable >= LOCALES.length,
    `${readable} package sentences this rule can read`,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: alternatives that do not tell themselves apart");
// ---------------------------------------------------------------------------
{
  const distinctFails = (build: Build) => checkPackagesDistinct([build], "control").length;
  check("the real packages differ where a reader chooses", packaged.every((b) => distinctFails(b) === 0));

  /*
   * The shape this was written for: a defensive route's advice landing on the
   * route that does not take it, so a reader stacks mana for a plan that spends
   * none. `when` and `tradeoff` are the fields the choice is made on.
   */
  const shieldWhen = frozenOrb.skillPackages![0].packages.find((p) => p.id === "energy-shield")!.when;
  check(
    "two routes making the same case for themselves are rejected",
    distinctFails(withPackage(frozenOrb, "deep-freeze", { when: shieldWhen })) === 1,
  );
  const stormTradeoff = nova.skillPackages![0].packages[0].tradeoff;
  check(
    "and two routes giving up the same thing are rejected",
    distinctFails(withPackage(nova, "hydra-hybrid", { tradeoff: stormTradeoff })) === 1,
  );
  check(
    "an add-on group is not held to it, because add-ons are not a choice",
    distinctFails(withGroup(withPackage(frozenOrb, "deep-freeze", { when: shieldWhen }), { choose: "any" })) === 0,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: a build that skips its own only synergy");
// ---------------------------------------------------------------------------
{
  const synergyFails = (build: Build) =>
    checkPrimarySynergyInvested([build], SKILL_GRAPH, "control").length;

  check("both pages buy the one synergy they have", synergyFails(frozenOrb) === 0 && synergyFails(nova) === 0);

  check(
    "Frozen Orb without the Ice Bolt that is its only synergy is rejected",
    synergyFails(withAllocation(frozenOrb, "ice-bolt", { points: 1 })) === 1,
  );
  check(
    "Nova without the Static Field that is its only synergy is rejected",
    synergyFails(withAllocation(nova, "static-field", { points: 1 })) === 1,
  );
  check(
    "the rejection names the skill the graph says feeds it",
    checkPrimarySynergyInvested(
      [withAllocation(nova, "static-field", { points: 1 })],
      SKILL_GRAPH,
      "control",
    )[0]?.message.includes("static-field") === true,
  );

  /*
   * And it stays quiet where the budget is genuinely contested. The Meteorb
   * Sorceress holds Ice Bolt at one point because it also casts Meteor, whose
   * own synergies want the same points — a trade, not an oversight. Take Meteor
   * out of the plan and the same allocation becomes the defect.
   */
  const meteorb = by("meteorb-sorceress");
  check("a hybrid with a second fed skill is left alone", synergyFails(meteorb) === 0);
  check(
    "and is caught the moment that second skill is no longer what it casts",
    synergyFails({
      ...meteorb,
      skills: meteorb.skills.map((a) =>
        a.skill === "meteor" ? { ...a, points: 1, role: "utility" as const } : a,
      ),
    }) === 1,
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted mutation: packages that diverge between locales");
// ---------------------------------------------------------------------------
{
  const ptBuilds = getBuilds("pt-br");
  const parityFails = (source: Build[], other: Build[]) =>
    checkPackageLocaleParity(source, other, "control").length;

  check("both locales publish the same routes at the same prices", parityFails(enBuilds, ptBuilds) === 0);

  check(
    "a route the translation prices differently is rejected",
    parityFails(
      [frozenOrb],
      [withPackageSkill(ptBuilds.find((b) => b.slug === frozenOrb.slug)!, "deep-freeze", "frost-nova", {
        points: 10,
      })],
    ) === 1,
  );
  check(
    "a route the translation drops is rejected",
    parityFails(
      [nova],
      [
        {
          ...ptBuilds.find((b) => b.slug === nova.slug)!,
          skillPackages: [
            {
              ...nova.skillPackages![0],
              packages: nova.skillPackages![0].packages.slice(0, 2),
            },
          ],
        },
      ],
    ) === 1,
  );

  /*
   * Prose is allowed to differ — that is the point of a translation — so the
   * rule must not fire on it. If it did, every correctly translated page would
   * be a failure and the check would have to be deleted.
   */
  check(
    "but prose differing between locales is not a divergence",
    parityFails(
      [frozenOrb],
      [
        withPackage(ptBuilds.find((b) => b.slug === frozenOrb.slug)!, "deep-freeze", {
          when: "Uma frase completamente diferente.",
        }),
      ],
    ) === 0,
  );

  /*
   * The same leak `check-content` catches in gear tables, in the one field it
   * does not reach: a package note keyed by skill slug that the overlay never
   * mentions renders in English inside a Portuguese card.
   */
  const leaks: string[] = [];
  /*
   * A route named after the skill it buys keeps that name in both languages —
   * "Energy Shield" is the spell's name, not a sentence, and translating it
   * would be the defect. Anything else identical across locales is untranslated
   * prose, which is what this looks for. Same exemption ADR 0003 already makes
   * for gear reasons that are nothing but game stat names.
   */
  const skillProperNouns = new Set(
    enBuilds.flatMap((b) =>
      (b.skillPackages ?? []).flatMap((g) =>
        g.packages.flatMap((p) =>
          p.skills.map((a) => getSkill("en-us", a.skill)?.name ?? ""),
        ),
      ),
    ),
  );

  for (const build of packaged) {
    const other = ptBuilds.find((b) => b.slug === build.slug);
    if (!other) continue;
    for (const group of build.skillPackages ?? []) {
      const twinGroup = other.skillPackages?.find((g) => g.id === group.id);
      for (const pkg of group.packages) {
        const twin = twinGroup?.packages.find((p) => p.id === pkg.id);
        if (!twin) continue;
        for (const field of ["name", "when", "tradeoff", "rotationNote", "contentNote"] as const) {
          if (field === "name" && skillProperNouns.has(pkg.name)) continue;
          if (pkg[field] && twin[field] === pkg[field]) {
            leaks.push(`${build.slug}/${pkg.id}.${field}`);
          }
        }
        for (const allocation of pkg.skills) {
          if (!allocation.note) continue;
          const twinNote = twin.skills.find((a) => a.skill === allocation.skill)?.note;
          if (twinNote === allocation.note) leaks.push(`${build.slug}/${pkg.id}/${allocation.skill}`);
        }
      }
    }
  }
  for (const leak of leaks) console.log(`       ${leak}`);
  check("no package string falls back to English", leaks.length === 0, `${leaks.length} leaks`);
}

// ---------------------------------------------------------------------------
console.log("\nThe two pages this model was written for");
// ---------------------------------------------------------------------------
{
  /*
   * Page contracts rather than general rules. Each is a specific wrong thing
   * these two pages invite, and each was true of one of them before this pass.
   */
  for (const build of [frozenOrb, nova]) {
    const group = build.skillPackages?.[0];
    check(
      `${build.slug}: the spare points are a choice, not a list`,
      group?.choose === "one" && group.packages.length >= 2,
      `${group?.choose} of ${group?.packages.length}`,
    );

    const totals = (group?.packages ?? []).map((p) => packageMath(build, p).total);
    check(
      `${build.slug}: every route finishes inside a level 99 character`,
      totals.every((n) => n <= MAX_HARD_POINTS),
      totals.join(", "),
    );
    check(
      `${build.slug}: and no route leaves a third of the character unplanned`,
      (group?.packages ?? []).every((p) => packageMath(build, p).free <= 5),
      (group?.packages ?? [])
        .map((p) => `${p.id}=${packageMath(build, p).free}`)
        .join(", "),
    );

    /*
     * The defect that started this: a page promising an Energy-Shield defence
     * and never buying the thing that makes the shield affordable. Telekinesis'
     * *hard* level sets the ratio and no +skills gear moves it, so a shield
     * route without it is a page telling a reader to spend twenty points on
     * nothing.
     */
    const shield = group?.packages.find((p) => p.skills.some((a) => a.skill === "energy-shield"));
    check(
      `${build.slug}: the shield route buys the Telekinesis that pays for it`,
      (shield?.skills.find((a) => a.skill === "telekinesis")?.points ?? 0) > 1,
      shield ? `${shield.skills.find((a) => a.skill === "telekinesis")?.points ?? 0}` : "no route",
    );

    /*
     * And the mirror of it: the routes that do not take the shield must not
     * carry its gear advice, or a reader stacks mana for a plan that spends
     * none of it.
     */
    const shieldGear = shield?.gearNote;
    const others = (group?.packages ?? []).filter((p) => p.id !== shield?.id);
    check(
      `${build.slug}: and no other route repeats the shield's gear advice`,
      shieldGear === undefined || others.every((p) => p.gearNote !== shieldGear),
    );
  }

  // Both cores are the same size, and that is a fact rather than a coincidence:
  // three maxed skills and nine one-point ones, on both pages.
  check(
    "both cores spend 69 and leave 41 before a package",
    pointBudgetOf(frozenOrb).mandatory === 69 &&
      pointBudgetOf(frozenOrb).remaining === 41 &&
      pointBudgetOf(nova).mandatory === 69 &&
      pointBudgetOf(nova).remaining === 41,
    `${pointBudgetOf(frozenOrb).mandatory}/${pointBudgetOf(frozenOrb).remaining}, ` +
      `${pointBudgetOf(nova).mandatory}/${pointBudgetOf(nova).remaining}`,
  );

  // Neither page keeps a flex allocation beside its packages. One optional
  // point living outside the model is a second, unpriced route.
  check(
    "and neither keeps an unpriced optional point outside the model",
    [frozenOrb, nova].every((b) => b.skills.every((a) => a.role !== "flex")),
  );
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed.`);
if (failures.length > 0) {
  console.log(`\n${failures.length} FAILED:`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
