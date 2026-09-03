/**
 * The rules that validate the skill graph, as pure functions.
 *
 * Separate from `check-content.ts` because that script runs every check at
 * module scope: importing it to test one rule would execute all of them. These
 * take their inputs as arguments precisely so `check-content.test.ts` can hand
 * them a deliberately corrupted graph and prove each rule fires.
 *
 * Nothing here reads the real content. The caller supplies it.
 */
import type { Build, Skill, Slug } from "../lib/types";
import { MAX_HARD_POINTS, TIER_LEVELS, type SkillGraphNode } from "../content/classes/skill-graph";

/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */
// Re-exported so the checker and its tests share one definition with the
// generated graph rather than keeping a second copy in sync by hand.
export { MAX_HARD_POINTS, TIER_LEVELS };

/**
 * Skills whose public identity is not their identifier in the game's tables.
 *
 * The extraction uses the `skill` column as an identifier and slugifies it,
 * which has been the same as the public name for every skill so far. The Amazon
 * breaks that: her decoy is `Dopplezon` in skills.txt and **Decoy** everywhere a
 * player ever sees it -- in the game's own UI, in every database and in every
 * guide. Slugifying the identifier would publish `/classes/amazon/skills/
 * dopplezon`, a URL naming something no reader has heard of.
 *
 * So the mapping is explicit, tiny, and one-directional. The internal
 * identifier stays the join key against the raw rows -- prerequisites and
 * synergy expressions still reference `Dopplezon`, and they resolve through
 * this table like everything else -- while nothing public carries it. Adding an
 * entry is a deliberate act with a reason; the generator does not guess, and
 * `skill-page.test.ts` asserts no override's identifier reaches a page, a URL
 * or the sitemap.
 */
export const SLUG_OVERRIDES: Record<string, string> = {
  Dopplezon: "decoy",
};

/** The single place a game identifier becomes a published slug. */


/**
 * The ceiling in a `min(expression, N)` calc column.
 *
 * Multiple Shot's arrow count was published with `cap: 24` written into the
 * generator by hand, above a comment quoting the column it came from. The number
 * was right and the provenance was a comment, which is the arrangement this
 * repository does not otherwise accept: re-pinning `SOURCE_SHA` would have moved
 * every other value in the graph and left this one behind, silently, still
 * claiming to be extracted.
 *
 * So it is read. The game gives Multiple Shot `calc1 = "min(ln12,24)"` — `ln12`
 * being "Param1 plus Param2 per level", the base and slope this already reads —
 * and the cap is the literal beside it.
 *
 * **Only a literal.** Strafe's calc1 is `min(par3 + lvl - 1, par4)`, whose cap is
 * a parameter rather than a number; that skill reads `Param4` directly and does
 * not come through here. A column of that shape therefore fails rather than
 * being quietly accommodated, because the two cases want different code and
 * guessing which one a new skill meant is how a wrong cap ships.
 *
 * @param raw   the calc column, as the extraction gives it — quoted or not
 * @param where the skill and column, for the error a broken assumption raises
 */
export function capFromMinCalc(raw: unknown, where: string): number {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(
      `${where}: the column is missing or empty, and the cap this effect publishes is read from it. ` +
        `Either the extraction moved or this skill no longer caps its count.`,
    );
  }
  // The extraction quotes its expressions; the quotes are part of the value.
  const expression = raw
    .trim()
    .replace(/^"([\s\S]*)"$/, "$1")
    .replace(/\s+/g, "");
  const match = expression.match(/^min\(([^(),]+),(\d+)\)$/);
  if (!match) {
    throw new Error(
      `${where}: reads "${expression}", which is not the min(expression, literal) shape a cap is ` +
        `read from. A cap held in a parameter — Strafe's min(par3+lvl-1,par4) — is read from that ` +
        `parameter instead; wire it up deliberately rather than widening this.`,
    );
  }
  return Number(match[2]);
}

export interface GraphProblem {
  rule:
    | "authored-drift"
    | "missing-prerequisite"
    | "cross-tree-edge"
    | "cycle"
    | "unknown-skill"
    | "over-budget"
    | "row-level-mismatch"
    | "orphan-skill"
    | "orphan-node";
  message: string;
}

/** Every skill a plan implies, following prerequisites transitively. */
export function requiredClosure(
  seeds: Iterable<Slug>,
  graph: Record<Slug, SkillGraphNode>,
): Set<Slug> {
  const acc = new Set<Slug>();
  const walk = (slug: Slug) => {
    for (const pre of graph[slug]?.prerequisites ?? []) {
      if (acc.has(pre)) continue;
      acc.add(pre);
      walk(pre);
    }
  };
  for (const seed of seeds) walk(seed);
  return acc;
}

/**
 * Exported so the mutation tests can call it against a deliberately corrupted
 * graph or build list without touching the real content.
 */
export function checkSkillGraph(
  graph: Record<Slug, SkillGraphNode>,
  skills: readonly Skill[],
  builds: readonly Build[],
): GraphProblem[] {
  const found: GraphProblem[] = [];
  const known = new Set(Object.keys(graph));

  // -- the graph itself ----------------------------------------------------
  for (const [slug, node] of Object.entries(graph)) {
    for (const pre of node.prerequisites) {
      // An edge to a skill that does not exist.
      if (!known.has(pre)) {
        found.push({ rule: "unknown-skill", message: `graph: ${slug} requires ${pre}, which is not a skill` });
        continue;
      }
      // D2 prerequisites never cross trees. `page` comes straight from the
      // game data, so this stays independent of our authored `tree` field.
      if (graph[pre].page !== node.page || graph[pre].classSlug !== node.classSlug) {
        found.push({
          rule: "cross-tree-edge",
          message: `graph: ${slug} (${node.classSlug} page ${node.page}) requires ${pre} ` +
            `(${graph[pre].classSlug} page ${graph[pre].page}) — prerequisites never cross trees`,
        });
      }
    }
  }

  // -- the row/level invariant ---------------------------------------------
  // A skill's row in the tree is not a layout choice: row N is always the
  // level-N tier. Verified true for all 60 skills at extraction time, so a
  // future regeneration that broke it would be a real change worth catching.
  for (const [slug, node] of Object.entries(graph)) {
    const expected = TIER_LEVELS[node.row - 1];
    if (expected !== node.requiredLevel) {
      found.push({
        rule: "row-level-mismatch",
        message: `graph: ${slug} sits in row ${node.row} (tier level ${expected}) but unlocks at ${node.requiredLevel}`,
      });
    }
  }

  // -- cycles --------------------------------------------------------------
  // A cycle makes a skill unreachable: nothing in it can ever be allocated
  // first. Depth-first with a colour marker; reports each cycle once.
  {
    const state = new Map<Slug, "open" | "done">();
    const reported = new Set<string>();
    const visit = (slug: Slug, stack: Slug[]) => {
      if (state.get(slug) === "done") return;
      if (state.get(slug) === "open") {
        const at = stack.indexOf(slug);
        const loop = [...stack.slice(at), slug];
        const key = [...loop].sort().join(">");
        if (!reported.has(key)) {
          reported.add(key);
          found.push({ rule: "cycle", message: `graph: prerequisite cycle ${loop.join(" -> ")}` });
        }
        return;
      }
      state.set(slug, "open");
      for (const pre of graph[slug]?.prerequisites ?? []) visit(pre, [...stack, slug]);
      state.set(slug, "done");
    };
    for (const slug of known) visit(slug, []);
  }

  /*
   * -- every skill in an extracted class is in the graph, and vice versa ----
   *
   * `authored-drift` below skips a skill with no node, because a class the
   * extraction has not reached yet legitimately has none. That skip is also a
   * hole: once a class IS extracted, a mistyped slug gives its skill no node,
   * and the skill quietly stops being drawn in the tree, stops getting a page
   * and stops being checked for anything — while every gate still reports
   * green, because the skip swallows it.
   *
   * So scope is decided per class, from the graph itself, and inside a class in
   * scope the correspondence has to be exactly one to one in both directions.
   */
  {
    // Widened deliberately: the graph's node type names only the classes
    // extracted so far, while `skill.classSlug` is every class the site has.
    // Comparing them as strings is the question being asked.
    const extracted = new Set<string>(Object.values(graph).map((n) => n.classSlug));
    const authored = new Map<string, string>();
    for (const skill of skills) {
      if (!extracted.has(skill.classSlug)) continue;
      authored.set(skill.slug, skill.classSlug);
      if (!graph[skill.slug]) {
        found.push({
          rule: "orphan-skill",
          message: `${skill.slug}: authored for ${skill.classSlug}, which is extracted, but has ` +
            `no graph node. Check the slug — it will not be drawn, will not get a page, and ` +
            `nothing else will notice.`,
        });
      }
    }
    for (const [slug, node] of Object.entries(graph)) {
      if (!authored.has(slug)) {
        found.push({
          rule: "orphan-node",
          message: `${slug}: in the graph for ${node.classSlug}, but no skill is authored for it. ` +
            `The tree has a cell nothing fills.`,
        });
      }
    }
  }

  // -- the authored table must not drift from the graph --------------------
  for (const skill of skills) {
    const node = graph[skill.slug];
    if (!node) continue; // classes outside the graph's scope
    const ours = [...(skill.prerequisites ?? [])].sort();
    const theirs = [...node.prerequisites].sort();
    if (ours.join(",") !== theirs.join(",")) {
      found.push({
        rule: "authored-drift",
        message: `${skill.slug}: authored prerequisites [${ours.join(", ")}] do not match ` +
          `the game graph [${theirs.join(", ")}]`,
      });
    }
  }

  // -- build plans ---------------------------------------------------------
  for (const build of builds) {
    const inGraph = build.skills.filter((a) => graph[a.skill]);
    if (inGraph.length === 0) continue;

    for (const allocation of build.skills) {
      if (!graph[allocation.skill]) {
        found.push({
          rule: "unknown-skill",
          message: `${build.slug}: allocates ${allocation.skill}, which is not in the skill graph`,
        });
      }
    }

    // Flex points are optional by definition, so neither they nor the
    // prerequisites they would imply belong in the mandatory budget.
    const core = inGraph.filter((a) => a.points > 0 && a.role !== "flex");
    const allocated = new Set(core.map((a) => a.skill));

    // Direct and transitive: a plan that only closes because a deeper
    // prerequisite was overlooked still cannot be spent.
    const needed = requiredClosure(allocated, graph);
    for (const slug of needed) {
      if (allocated.has(slug)) continue;
      const direct = core.some((a) => graph[a.skill]?.prerequisites.includes(slug));
      found.push({
        rule: "missing-prerequisite",
        message: `${build.slug}: the plan requires ${slug}` +
          (direct ? "" : " (reached transitively)") +
          ` but never allocates it. The plan cannot be spent as written.`,
      });
    }

    const spent = core.reduce((sum, a) => sum + a.points, 0);
    if (spent > MAX_HARD_POINTS) {
      found.push({
        rule: "over-budget",
        message: `${build.slug}: ${spent} mandatory hard points, over the ${MAX_HARD_POINTS} ` +
          `a level 99 character has (98 level-ups plus 12 from quests)`,
      });
    }
  }

  return found;
}

/**
 * Synergy integrity.
 *
 * The graph owns both directions: `node.synergies` is what a skill receives,
 * and the reverse index is computed from it. Authored content may only supply a
 * magnitude for an edge the graph already has.
 *
 * Every rule here exists because its absence shipped something. Ten of the
 * thirty-four authored edges disagreed with their own reverse, and eight of the
 * twenty-five authored identities were contradicted by the game's formulas —
 * Holy Shield was said to take a synergy from Smite when the game gives it one
 * from Defiance, and Thunder Storm was said to take one from Lightning when the
 * game gives it one from Static Field.
 */
export interface SynergyProblem {
  rule:
    | "synergy-unknown-skill"
    | "synergy-cross-class"
    | "synergy-self"
    | "synergy-reverse-drift"
    | "authored-synergy-drift";
  detail: string;
}

export function checkSynergies(
  graph: Record<string, { classSlug: string; synergies: readonly { from: string; kinds: readonly string[] }[] }>,
  authored: readonly { slug: string; synergies?: readonly { skill: string; bonus: string }[] }[],
  /** The reverse index the site actually renders, as the app computes it. */
  reverseFor: (slug: string) => readonly { slug: string }[],
): SynergyProblem[] {
  const problems: SynergyProblem[] = [];
  const add = (rule: SynergyProblem["rule"], detail: string) => problems.push({ rule, detail });

  for (const [slug, node] of Object.entries(graph)) {
    for (const syn of node.synergies) {
      const target = graph[syn.from];
      if (!target) {
        add("synergy-unknown-skill", `${slug} receives a synergy from unknown skill "${syn.from}"`);
        continue;
      }
      if (syn.from === slug) {
        add("synergy-self", `${slug} lists itself as its own synergy source`);
      }
      if (target.classSlug !== node.classSlug) {
        add(
          "synergy-cross-class",
          `${slug} (${node.classSlug}) receives a synergy from ${syn.from} (${target.classSlug})`,
        );
      }
      if (syn.kinds.length === 0) {
        add("synergy-unknown-skill", `${slug} <- ${syn.from} carries no synergy kind`);
      }
    }
  }

  /*
   * The reverse index the pages render must be exactly the transpose of the
   * graph. A "Skills this feeds" entry with no matching "Synergies received" on
   * the other page is the defect this whole rule set exists to prevent.
   */
  const expected = new Map<string, Set<string>>();
  for (const [slug, node] of Object.entries(graph)) {
    for (const syn of node.synergies) {
      if (!expected.has(syn.from)) expected.set(syn.from, new Set());
      expected.get(syn.from)!.add(slug);
    }
  }
  for (const slug of Object.keys(graph)) {
    const want = expected.get(slug) ?? new Set<string>();
    const got = new Set(reverseFor(slug).map((r) => r.slug));
    for (const s of want) {
      if (!got.has(s)) {
        add("synergy-reverse-drift", `${slug} feeds ${s} in the graph, but the reverse index omits it`);
      }
    }
    for (const s of got) {
      if (!want.has(s)) {
        add(
          "synergy-reverse-drift",
          `the reverse index says ${slug} feeds ${s}, but the graph has no such edge`,
        );
      }
    }
  }

  // Authored magnitudes may only annotate an edge the graph recognises.
  for (const skill of authored) {
    for (const syn of skill.synergies ?? []) {
      const node = graph[skill.slug];
      if (!node) {
        add("authored-synergy-drift", `authored synergy on unknown skill "${skill.slug}"`);
        continue;
      }
      if (!node.synergies.some((s) => s.from === syn.skill)) {
        add(
          "authored-synergy-drift",
          `${skill.slug} authors a synergy from "${syn.skill}", which the game's formulas do not give it`,
        );
      }
    }
  }

  return problems;
}
