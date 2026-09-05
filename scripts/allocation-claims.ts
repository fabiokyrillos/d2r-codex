/**
 * Editorial controls over a build's skill *plan*, as pure functions.
 *
 * `checkSkillGraph` already proves a plan is spendable: the skills exist, the
 * prerequisites are met, the points fit in 110. What nothing checked was what a
 * build *calls* each allocation, and whether the arithmetic its own prose
 * publishes agrees with the allocations underneath it.
 *
 * Nothing is imported from content: every function takes the builds and the
 * graph from its caller, so a test can hand it two invented builds and prove
 * the rule fires without touching the site's data.
 */
import { MAX_HARD_POINTS, type SkillGraphNode } from "../content/classes/skill-graph";
import type { AllocationRole, Build, SkillAllocation, Slug } from "../lib/types";

export type AllocationRule =
  | "synergy-role-with-no-edge"
  | "budget-exceeded"
  | "unpaid-prerequisite"
  | "duplicate-allocation"
  | "points-above-skill-maximum"
  | "primary-skill-unallocated"
  | "stated-total-disagrees";

export interface AllocationProblem {
  rule: AllocationRule;
  message: string;
}

type Graph = Readonly<Record<Slug, SkillGraphNode>>;

// ===========================================================================
// Hard-point edges
// ===========================================================================

/**
 * The skills whose *hard points* the graph says feed `slug`.
 *
 * Two sources, unioned, because the game keeps synergies in two places and a
 * reader collects both. `synergies` is what the skill's own row declares.
 * `missileSynergies` is what a sub-missile it creates declares — Fist of the
 * Heavens' magic waves read Holy Bolt at 15% a point, and nothing on the Fist
 * of the Heavens row says so. Treating only the first as real rejected a
 * correct FoHdin allocation; see the field's comment in the generated graph.
 *
 * Soft-level relationships are in neither, deliberately. The Druid's three
 * animal summons raise each other through the *effective* level, which a +3
 * Summoning pelt also raises, so they are relationships rather than edges and
 * `SOFT_LEVEL_SYNERGIES` keeps them out of the graph entirely.
 */
export function synergySourcesOf(graph: Graph, slug: Slug): Slug[] {
  const node = graph[slug];
  if (!node) return [];
  return [
    ...node.synergies.map((s) => s.from),
    ...(node.missileSynergies ?? []).map((s) => s.from),
  ];
}

/**
 * The skills a build actually *uses*, and which a synergy can therefore feed.
 *
 * Not `role: "main"` alone. That was the first version of this rule and it
 * rejected four correct allocations across two classes, because a build's
 * load-bearing skills are not all labelled `main`:
 *
 *   - The Smiter maxes Holy Shield as `utility` and Defiance feeds it. The
 *     synergy is real, collected, and named in the note.
 *   - The Tesladin's Holy Shock sits at one point with role `utility` because
 *     the aura comes from a Dream rather than from skill points — and Resist
 *     Lightning and Salvation are its two real synergies. It is the build's
 *     `primarySkill`, which is the only thing that distinguishes it from a
 *     one-point convenience.
 *
 * Nor is it "everything the build allocates", which is the failure in the other
 * direction and the one that matters more. Three shapes must stay out:
 *
 *   - **A synergy of a synergy.** The Frozen Orb Sorceress maxes Ice Bolt as
 *     the Orb's synergy, and Ice Blast feeds Ice Bolt. Nobody casts Ice Bolt,
 *     so twenty points in Ice Blast collect nothing — and under a rule that
 *     admits any allocated skill, that plan passes.
 *   - **A one-point convenience.** The Nova Sorceress keeps Lightning at one
 *     point for the rare single target, and Charged Bolt feeds Lightning. Same
 *     nothing, same pass.
 *   - **A prerequisite.** Summon Dire Wolf feeds only Raven, which the Summon
 *     Druid holds at one point on the way to something else. This is the shape
 *     the rule was written for.
 *
 * So: the build's `primarySkill`, plus anything it labels `main`, plus a
 * `utility` or `flex` allocation it has invested more than the entry point in.
 */
export function receiverSkillsOf(build: Build): Slug[] {
  const receivers = new Set<Slug>([build.primarySkill]);
  for (const allocation of build.skills) {
    if (allocation.role === "main") receivers.add(allocation.skill);
    if ((allocation.role === "utility" || allocation.role === "flex") && allocation.points > 1) {
      receivers.add(allocation.skill);
    }
  }
  return [...receivers];
}

/**
 * Every allocation a build calls a synergy that feeds nothing the build uses.
 *
 * `role: "synergy"` is a claim — it tells the reader that hard points here
 * raise something they cast — and the graph is the thing that can confirm or
 * refute it.
 */
export function checkSynergyRoles(
  builds: readonly Build[],
  graph: Graph,
  where: string,
): AllocationProblem[] {
  const found: AllocationProblem[] = [];
  for (const build of builds) {
    const receivers = receiverSkillsOf(build);

    for (const allocation of build.skills) {
      if (allocation.role !== "synergy") continue;
      if (receivers.some((r) => synergySourcesOf(graph, r).includes(allocation.skill))) continue;

      found.push({
        rule: "synergy-role-with-no-edge",
        message:
          `${where}/${build.slug}: ${allocation.skill} is allocated ${allocation.points} points ` +
          `with role "synergy", and the graph draws no hard-point edge from it to anything this ` +
          `build uses (${receivers.join(", ")}). Feeding another synergy, a one-point utility or ` +
          `a prerequisite is not feeding the build, and a bonus that reads the effective level is ` +
          `raised by +skills — which is the opposite of what this label tells a reader to buy.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// The point budget
// ===========================================================================

/** Every skill a build must hold a point in before `slug` is allocatable. */
function prerequisiteClosure(graph: Graph, slug: Slug, seen = new Set<Slug>()): Set<Slug> {
  for (const prerequisite of graph[slug]?.prerequisites ?? []) {
    if (seen.has(prerequisite)) continue;
    seen.add(prerequisite);
    prerequisiteClosure(graph, prerequisite, seen);
  }
  return seen;
}

export interface PointBudget {
  /** Points the plan calls for outright. */
  mandatory: number;
  /** Points in allocations the plan marks optional. */
  flex: number;
  /** `MAX_HARD_POINTS` less both, and never below zero. */
  remaining: number;
}

/**
 * What a build's plan costs, split the way the build page's legend splits it.
 *
 * `flex` is excluded from `mandatory` because a flex allocation is optional by
 * definition and the legend reports it separately — "69 of 110 mandatory hard
 * points, plus 1 optional". The two still have to fit in the same 110 together,
 * which is the arithmetic `checkPointBudget` holds them to.
 */
export function pointBudgetOf(build: Build): PointBudget {
  const sum = (keep: (a: SkillAllocation) => boolean) =>
    build.skills.filter(keep).reduce((n, a) => n + a.points, 0);
  const mandatory = sum((a) => a.role !== "flex");
  const flex = sum((a) => a.role === "flex");
  return { mandatory, flex, remaining: Math.max(0, MAX_HARD_POINTS - mandatory - flex) };
}

/**
 * The arithmetic every published plan has to survive.
 *
 * Deliberately five separate rules rather than one "is it valid": each names a
 * different way a plan lies to a reader, and the message has to say which.
 *
 * The budget rule counts flex points. A plan of 108 mandatory and 5 optional is
 * 113, and the honest reading of that is not "108 of 110 plus a suggestion" —
 * it is a plan the reader cannot finish. The build page's legend prints the two
 * numbers side by side, so this is exactly the arithmetic a reader does.
 */
export function checkPointBudget(
  builds: readonly Build[],
  graph: Graph,
  where: string,
): AllocationProblem[] {
  const found: AllocationProblem[] = [];
  const add = (rule: AllocationRule, message: string) => found.push({ rule, message });

  for (const build of builds) {
    const { mandatory, flex } = pointBudgetOf(build);

    if (mandatory + flex > MAX_HARD_POINTS) {
      add(
        "budget-exceeded",
        `${where}/${build.slug}: the plan spends ${mandatory} mandatory points and ${flex} ` +
          `optional ones, which is ${mandatory + flex} — and a level 99 character has ` +
          `${MAX_HARD_POINTS}. Optional points come out of the same budget as the rest.`,
      );
    }

    const seen = new Set<Slug>();
    for (const allocation of build.skills) {
      if (seen.has(allocation.skill)) {
        add(
          "duplicate-allocation",
          `${where}/${build.slug}: ${allocation.skill} is allocated twice, so its points are ` +
            `counted twice and the plan costs more than it says.`,
        );
      }
      seen.add(allocation.skill);

      const maximum = graph[allocation.skill]?.maxLevel;
      if (maximum !== undefined && allocation.points > maximum) {
        add(
          "points-above-skill-maximum",
          `${where}/${build.slug}: ${allocation.skill} is allocated ${allocation.points} hard ` +
            `points and the game caps it at ${maximum}.`,
        );
      }
    }

    if (!seen.has(build.primarySkill)) {
      add(
        "primary-skill-unallocated",
        `${where}/${build.slug}: the build is named after ${build.primarySkill} and the plan ` +
          `puts no points in it.`,
      );
    }

    const unpaid = [...seen]
      .flatMap((slug) => [...prerequisiteClosure(graph, slug)])
      .filter((slug) => !seen.has(slug));
    if (unpaid.length > 0) {
      add(
        "unpaid-prerequisite",
        `${where}/${build.slug}: the plan allocates skills it has not paid the prerequisites ` +
          `for — ${[...new Set(unpaid)].sort().join(", ")}. A character cannot spend this plan.`,
      );
    }
  }
  return found;
}

// ===========================================================================
// Totals a page states in prose
// ===========================================================================

/**
 * `N of 110`, `N/110`, `N de 110` — the shape a page uses to state its own cost.
 *
 * Anchored on the cap rather than on a verb, so it reads the same sentence in
 * both locales without either language's grammar being encoded here. The cap is
 * interpolated from `MAX_HARD_POINTS`, so raising the constant does not leave a
 * literal 110 behind in a regular expression.
 */
const STATED_TOTAL = new RegExp(
  String.raw`\b(\d{2,3})\s*(?:of|\/|de)\s*(?:the\s+|os\s+|seus\s+|your\s+)?${MAX_HARD_POINTS}\b(?!\s*%)`,
  "gi",
);

/**
 * Every place a page states its own point total and gets it wrong.
 *
 * The Frost Nova Sorceress is why this exists. Its file header, a weakness and
 * a flex point all said the finished plan was "108 of 110"; the allocations
 * summed to 107, and the plan they summed was wrong in a much larger way. Two
 * mistakes, and the arithmetic one is the cheap one to catch automatically.
 *
 * A stated total is read against `mandatory`, and against `mandatory + flex`,
 * and either may be what the sentence means — a page that says "88 of 110" with
 * two optional points on top is not lying by either reading. What it may not do
 * is name a number that is neither.
 */
export function checkStatedTotals(
  builds: readonly Build[],
  linesOf: (build: Build) => readonly string[],
  where: string,
): AllocationProblem[] {
  const found: AllocationProblem[] = [];
  for (const build of builds) {
    const { mandatory, flex } = pointBudgetOf(build);
    for (const line of linesOf(build)) {
      for (const match of line.matchAll(STATED_TOTAL)) {
        const stated = Number(match[1]);
        if (stated === mandatory || stated === mandatory + flex) continue;
        found.push({
          rule: "stated-total-disagrees",
          message:
            `${where}/${build.slug}: a sentence says "${match[0]}", and the plan allocates ` +
            `${mandatory} mandatory points` +
            (flex > 0 ? ` plus ${flex} optional (${mandatory + flex} together)` : "") +
            `. One of the two is wrong, and the allocations are the ones a reader spends.`,
        });
      }
    }
  }
  return found;
}

/** Roles that exist, for a test that wants to mutate one into another. */
export const ROLES_FOR_MUTATION: readonly AllocationRole[] = [
  "main",
  "synergy",
  "utility",
  "prerequisite",
  "flex",
];
