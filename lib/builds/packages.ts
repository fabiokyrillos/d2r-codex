import { MAX_HARD_POINTS, SKILL_GRAPH } from "@/content/classes/skill-graph";
import type {
  Build,
  SkillAllocation,
  SkillPackage,
  SkillPackageGroup,
  Slug,
} from "@/lib/types";

/**
 * The arithmetic of an optional skill package, derived and never authored.
 *
 * A package states the *final* points it wants in each skill. What it costs is
 * the difference from the core plan, which is the only figure that can be added
 * to the core without counting a shared prerequisite twice — the Frozen Orb
 * shield package raises Telekinesis from one to twenty, and nineteen is what
 * that costs, not twenty.
 *
 * Every number a package page prints comes from here, so there is no authored
 * cost for an edit to leave stale. What an author *can* still get wrong is a
 * sentence — "forty-one points" in prose beside a package that costs thirty —
 * and `checkPackageClaims` in `scripts/allocation-claims.ts` is what reads
 * those against these.
 *
 * Nothing in this file knows a class, a skill or an element.
 */

/** One skill the package moves, and by how much. */
export interface PackageDelta {
  skill: Slug;
  /** Hard points the core plan already spends here. */
  from: number;
  /** Hard points after the package. */
  to: number;
  /** `to` less `from`, and never negative — see `packageCost`. */
  delta: number;
  role: SkillAllocation["role"];
  note?: string;
  /** True where the core spends nothing and the package opens the skill. */
  isNew: boolean;
}

export interface PackageMath {
  /** Points the package adds on top of the core. */
  cost: number;
  /** Core mandatory points, before the package. */
  core: number;
  /** `core` plus `cost` — what the finished character has spent. */
  total: number;
  /** `MAX_HARD_POINTS` less `total`, floored at zero. */
  free: number;
  /** Ordered by descending delta, so the expensive move reads first. */
  deltas: PackageDelta[];
  /** True where `total` will not fit in a level 99 character. */
  overBudget: boolean;
  /**
   * Skills the package asks for *fewer* points in than the core already spends.
   *
   * Kept rather than clamped away. A package is an addition, and one that
   * lowers a core allocation is either a respec the page has not described or a
   * typo; either way the cost arithmetic above would quietly under-report it.
   */
  lowersCore: Slug[];
}

/** Hard points the core plan spends on a skill, counting flex allocations. */
export function corePointsOf(build: Build, skill: Slug): number {
  return build.skills.find((a) => a.skill === skill)?.points ?? 0;
}

/**
 * Core points the reader must spend before any package: everything in `skills`.
 *
 * Flex allocations are included. A package is the site's way of saying
 * "optional" now, and a flex allocation left in the core alongside one would be
 * a second, unpriced optional living outside the model — so a build that
 * publishes packages should not have flex allocations, and if it does they are
 * counted as spent rather than quietly dropped from the total.
 */
export function corePointsTotal(build: Build): number {
  return build.skills.reduce((sum, a) => sum + a.points, 0);
}

export function packageMath(build: Build, pkg: SkillPackage): PackageMath {
  const core = corePointsTotal(build);
  const deltas: PackageDelta[] = pkg.skills.map((allocation) => {
    const from = corePointsOf(build, allocation.skill);
    return {
      skill: allocation.skill,
      from,
      to: allocation.points,
      delta: Math.max(0, allocation.points - from),
      role: allocation.role,
      note: allocation.note,
      isNew: from === 0,
    };
  });
  deltas.sort((a, b) => b.delta - a.delta || a.skill.localeCompare(b.skill));

  const cost = deltas.reduce((sum, d) => sum + d.delta, 0);
  const total = core + cost;
  return {
    cost,
    core,
    total,
    free: Math.max(0, MAX_HARD_POINTS - total),
    deltas,
    overBudget: total > MAX_HARD_POINTS,
    lowersCore: pkg.skills
      .filter((a) => a.points < corePointsOf(build, a.skill))
      .map((a) => a.skill),
  };
}

/**
 * The whole plan a reader ends up holding: core, with the package applied.
 *
 * Used to check prerequisites and synergy claims against what the character
 * actually has, rather than against the package in isolation — a package's
 * Chain Lightning is fed by the core's Nova, and a rule that read only the
 * package would call that claim false.
 */
export function combinedAllocations(
  build: Build,
  pkg: SkillPackage,
): SkillAllocation[] {
  const merged = new Map<Slug, SkillAllocation>(
    build.skills.map((a) => [a.skill, a]),
  );
  for (const allocation of pkg.skills) merged.set(allocation.skill, allocation);
  return [...merged.values()];
}

/** Every package on a build, group by group, flattened. */
export function allPackages(
  build: Build,
): { group: SkillPackageGroup; pkg: SkillPackage }[] {
  return (build.skillPackages ?? []).flatMap((group) =>
    group.packages.map((pkg) => ({ group, pkg })),
  );
}

/**
 * The most a build can be asked to spend: core, plus the dearest package in
 * every exclusive group, plus every package in a non-exclusive one.
 *
 * This is the number that has to fit in 110. A page offering three alternatives
 * at forty-one each spends forty-one, not one hundred and twenty-three; a page
 * offering three *add-ons* at forty-one each spends all three, and cannot.
 */
export function worstCaseTotal(build: Build): number {
  let cost = 0;
  for (const group of build.skillPackages ?? []) {
    const costs = group.packages.map((pkg) => packageMath(build, pkg).cost);
    if (costs.length === 0) continue;
    cost += group.choose === "one" ? Math.max(...costs) : costs.reduce((a, b) => a + b, 0);
  }
  return corePointsTotal(build) + cost;
}

/**
 * Skills the combined plan invests in beyond a single point, plus the build's
 * own primary skill.
 *
 * The package-aware twin of `receiverSkillsOf` in `scripts/allocation-claims.ts`
 * and deliberately the same shape: a synergy claim is true when hard points in
 * the named skill raise something the character casts, and a one-point
 * convenience or an unpaid prerequisite is not something they cast.
 */
export function combinedReceivers(build: Build, pkg: SkillPackage): Slug[] {
  const receivers = new Set<Slug>([build.primarySkill]);
  for (const allocation of combinedAllocations(build, pkg)) {
    if (allocation.role === "main") receivers.add(allocation.skill);
    if ((allocation.role === "utility" || allocation.role === "flex") && allocation.points > 1) {
      receivers.add(allocation.skill);
    }
  }
  return [...receivers];
}

/** Skills the combined plan holds no point in but must, per the graph. */
export function unpaidPrerequisites(build: Build, pkg: SkillPackage): Slug[] {
  const held = new Set(combinedAllocations(build, pkg).map((a) => a.skill));
  const missing = new Set<Slug>();
  const walk = (slug: Slug) => {
    for (const prerequisite of SKILL_GRAPH[slug]?.prerequisites ?? []) {
      if (held.has(prerequisite) || missing.has(prerequisite)) continue;
      missing.add(prerequisite);
      walk(prerequisite);
    }
  };
  for (const slug of held) walk(slug);
  return [...missing];
}

export { MAX_HARD_POINTS };
