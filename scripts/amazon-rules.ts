/**
 * Rules introduced by the Amazon pass, as pure functions.
 *
 * Same reason `skill-graph-rules.ts` and `content-rules.ts` exist: the checker
 * runs everything at module scope, so importing it to exercise one rule would
 * run all of them against the real content. These take their inputs as
 * arguments, and `check-content.test.ts` hands them deliberately corrupted ones
 * to prove each rule can fail.
 *
 * Every rule here exists because the Amazon pass shipped, or nearly shipped, the
 * thing it checks. One more was written and removed; the comment below says why.
 */
import type { Build, ClassSlug, Element, ProgressionTier, Slug } from "../lib/types";

export interface AmazonProblem {
  rule:
    | "incomplete-class-page"
    | "universal-ias-breakpoint"
    | "immunity-census-drift"
    | "alias-became-a-page"
    | "incomplete-chain-claim";
  message: string;
}

/*
 * A rule that is NOT here, and why.
 *
 * The first draft of this file cross-checked each build's farming ratings
 * against the area's `commonImmunities`, on the theory that a zone resisting
 * everything a build deals cannot be a four or a five. It fired on thirty-nine
 * shipped entries across the Paladin and Sorceress pages, and it was the rule
 * that was wrong rather than the content: `commonImmunities` records the
 * immunities *present* in a zone, not universal resistance. The Chaos Sanctuary
 * lists lightning and is still one of the best Lightning Sorceress zones in the
 * game, because most of what is in it is not immune.
 *
 * The real defect that prompted the rule was prose — four Amazon pages claimed
 * an absence of immunity the area page records — and prose is not checkable
 * this way. Those four were corrected by hand. Writing a rule that would have
 * forced thirty-nine edits to already-approved content to make itself pass
 * would have been the tail wagging the dog.
 */

// ---------------------------------------------------------------------------
// A class published in one pass must be published completely
// ---------------------------------------------------------------------------

/**
 * Scoped by class on purpose. This is the completeness contract for a class
 * added in a single pass, not a retroactive standard applied to pages written
 * before it — a gate that forces edits to already-approved content in order to
 * go green is a gate that will be argued with rather than obeyed.
 *
 * Everything below is something a reader needs and an author forgets on the
 * eighth page rather than the first: the gear progression's last tier, the
 * plan for the immunity the build cannot get past, and the two mode-specific
 * sections that are the difference between a guide and a build list.
 */
export function checkClassPagesComplete(
  builds: readonly Build[],
  classSlug: ClassSlug,
  requiredTiers: readonly ProgressionTier[],
): AmazonProblem[] {
  const found: AmazonProblem[] = [];
  const fail = (slug: Slug, what: string) =>
    found.push({ rule: "incomplete-class-page", message: `${slug}: ${what}` });

  for (const build of builds.filter((b) => b.classSlug === classSlug)) {
    const tiers = new Set(build.gearSets.map((g) => g.tier));
    for (const tier of requiredTiers) {
      if (!tiers.has(tier)) fail(build.slug, `has no "${tier}" gear tier`);
    }
    if (!build.immunityPlan) fail(build.slug, "has no immunity plan");
    if (!build.mercenary) fail(build.slug, "names no mercenary");
    if (!build.mercenaryNotes) fail(build.slug, "has a mercenary but no notes on gearing it");
    if (!build.hardcoreNotes) fail(build.slug, "has no hardcore notes");
    if (!build.selfFoundNotes) fail(build.slug, "has no self-found notes");
    if (!build.levelingPath) fail(build.slug, "has no leveling path");
    if (!build.flexPoints || build.flexPoints.length === 0) {
      fail(build.slug, "spends fewer than 110 points and says nothing about the rest");
    }
    if (build.breakpoints.length === 0) fail(build.slug, "publishes no breakpoint targets at all");
    if (!build.skills.some((s) => s.skill === build.primarySkill)) {
      fail(build.slug, `is named after ${build.primarySkill}, which its plan never allocates`);
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// No build may publish an Increased Attack Speed breakpoint
// ---------------------------------------------------------------------------

/**
 * The breakpoints page refuses to tabulate Increased Attack Speed, because the
 * frames depend on the weapon's base speed, the attack skill and in some cases
 * the class — "a single table cannot express it, and every site that publishes
 * one is simplifying to the point of being wrong for most setups".
 *
 * A build's `breakpoints` array can carry `stat: "ias"`, and eight Amazon pages
 * that each mention attack speed several times are exactly where a number would
 * have crept in. This makes the editorial position enforceable rather than
 * merely stated: attack speed is discussed per weapon and per skill in prose,
 * and never as a target percentage in the table.
 */
export function checkNoIasBreakpoints(builds: readonly Build[]): AmazonProblem[] {
  return builds
    .flatMap((build) =>
      build.breakpoints
        .filter((bp) => bp.stat === "ias")
        .map((bp) => ({
          rule: "universal-ias-breakpoint" as const,
          message:
            `${build.slug}: publishes an Increased Attack Speed breakpoint at ${bp.value}%. ` +
            `IAS frames depend on the weapon's base speed and the skill, so no single ` +
            `percentage is correct for a class — say it per weapon in prose instead.`,
        })),
    );
}

// ---------------------------------------------------------------------------
// The immunity census the Exploding Arrow page argues from
// ---------------------------------------------------------------------------

/**
 * The Exploding Arrow page's central claim is a count: thirteen of the twenty
 * catalogued areas record fire immunity, against five for cold and eight for
 * lightning, which is why that build maxes a physical skill and why its farming
 * list is ordered the way it is. Counts drift silently when an area is added.
 *
 * The expected numbers live here rather than in the prose, so adding an area
 * fails this rule and sends whoever added it to the sentence that depends on it.
 */
export function checkImmunityCensus(
  areas: readonly { slug: Slug; commonImmunities: readonly Element[] }[],
  expected: Readonly<Partial<Record<Element, number>>>,
): AmazonProblem[] {
  const found: AmazonProblem[] = [];
  for (const [element, count] of Object.entries(expected) as [Element, number][]) {
    const actual = areas.filter((a) => a.commonImmunities.includes(element)).length;
    if (actual === count) continue;
    found.push({
      rule: "immunity-census-drift",
      message:
        `${actual} of ${areas.length} areas record ${element} immunity, not ${count}. ` +
        `The Exploding Arrow page argues from these counts in prose — update it, ` +
        `then update the expected value here.`,
    });
  }
  return found;
}

// ---------------------------------------------------------------------------
// Alias names must not become pages
// ---------------------------------------------------------------------------

/**
 * "Javazon", "Bowazon", "Spearazon" and "Strafezon" are what players call
 * families of builds, and Charged Strike, Guided Arrow and Plague Javelin are
 * components of builds rather than builds. Each is a search alias pointing at a
 * canonical page. A page per name would publish the same character several
 * times with its gear advice divided between the copies, which is the failure
 * mode this rule exists to prevent — and it is a failure mode that arrives by
 * addition, quietly, months later.
 */
export function checkAliasesAreNotPages(
  builds: readonly { slug: Slug; name: string }[],
  aliases: readonly string[],
): AmazonProblem[] {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const taken = new Map<string, string>();
  for (const b of builds) {
    taken.set(norm(b.slug), b.slug);
    taken.set(norm(b.name), b.slug);
  }
  const found: AmazonProblem[] = [];
  for (const alias of aliases) {
    const hit = taken.get(norm(alias));
    if (!hit) continue;
    found.push({
      rule: "alias-became-a-page",
      message:
        `"${alias}" is a search alias, not a build, but build "${hit}" now answers to it. ` +
        `Aliases resolve to a canonical page; they do not get one.`,
    });
  }
  return found;
}

// ---------------------------------------------------------------------------
// A sentence that walks a prerequisite chain must walk all of it
// ---------------------------------------------------------------------------

/** Every skill `slug` transitively requires, by the graph rather than by eye. */
export function prerequisiteClosure(
  graph: Readonly<Record<string, { readonly prerequisites?: readonly string[] }>>,
  slug: string,
): string[] {
  const seen = new Set<string>();
  const walk = (s: string) => {
    for (const p of graph[s]?.prerequisites ?? []) {
      if (seen.has(p)) continue;
      seen.add(p);
      walk(p);
    }
  };
  walk(slug);
  return [...seen];
}

/**
 * The leveling journey told a reader to spend Inner Sight, Slow Missiles, Dodge
 * and Avoid and said that "together they open Decoy at 24 and Valkyrie at 30".
 * They do not. Valkyrie requires Decoy *and* Evade, and Evade was not in the
 * list — so a reader who followed the sentence literally arrived at 30 with the
 * skill still locked. The stage's own summary said "seven points", which is the
 * count *with* Evade, so the page disagreed with itself.
 *
 * **What counts as a chain claim.** A sentence that names the target and at
 * least two skills from its prerequisite closure is enumerating the chain, and
 * must therefore name all of it. That threshold is what keeps the rule from
 * firing on the many sentences that mention a skill without routing to it —
 * "one point in Valkyrie is enough at this stage" names none of the closure and
 * is left alone. Two is deliberate: one could be a passing reference, two is a
 * list.
 *
 * Names rather than slugs, because prose is written in names and ADR 0003 keeps
 * them identical across locales — which is what lets one rule check both.
 */
export function checkChainClaims(
  sentences: readonly string[],
  graph: Readonly<Record<string, { readonly prerequisites?: readonly string[] }>>,
  nameOf: (slug: string) => string,
  targets: readonly string[],
  where: string,
): AmazonProblem[] {
  const found: AmazonProblem[] = [];
  const mentions = (text: string, name: string) =>
    new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);

  for (const target of targets) {
    const closure = prerequisiteClosure(graph, target);
    if (closure.length === 0) continue;
    const targetName = nameOf(target);

    for (const sentence of sentences) {
      if (!mentions(sentence, targetName)) continue;
      const named = closure.filter((s) => mentions(sentence, nameOf(s)));
      if (named.length < 2) continue; // a mention, not an enumeration
      const missing = closure.filter((s) => !named.includes(s));
      if (missing.length === 0) continue;
      found.push({
        rule: "incomplete-chain-claim",
        message:
          `${where}: a sentence routes to ${targetName} through ` +
          `${named.map(nameOf).join(", ")} but never names ` +
          `${missing.map(nameOf).join(", ")}, which ${targetName} also requires. ` +
          `A reader following it arrives with the skill still locked. Sentence: "${sentence.slice(0, 90)}…"`,
      });
    }
  }
  return found;
}

/** The chains a journey page is allowed to route to, and must route to fully. */
export const CHAIN_TARGETS: readonly string[] = ["valkyrie"];

/** The names that must stay aliases. Shared by the checker and its tests. */
export const ALIAS_ONLY_NAMES: readonly string[] = [
  "javazon",
  "bowazon",
  "spearazon",
  "strafezon",
  "fendazon",
  "poisonzon",
  "charged strike",
  "charged strike amazon",
  "guided arrow",
  "guided arrow amazon",
  "plague javelin",
  "plague javelin amazon",
  "mavinas",
  "mavinas amazon",
];

/** How many of the catalogued areas record each immunity, as the prose claims. */
export const EXPECTED_IMMUNITY_CENSUS: Readonly<Partial<Record<Element, number>>> = {
  fire: 13,
  poison: 10,
  lightning: 8,
  physical: 8,
  cold: 5,
  /*
   * Magic was added by the Necromancer pass, and it is the entry that most
   * needs the gate. The Bone Spear page's central argument is that one area in
   * twenty records magic immunity — which is why the build takes no resistance
   * reduction, no mastery and no sunder charm, none of which exist for magic.
   * Adding a magic-immune area would make that sentence wrong and nothing else
   * on the site would notice.
   */
  magic: 1,
};
