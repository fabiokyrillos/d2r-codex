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
import type { SkillGraphNode } from "../content/classes/skill-graph";

/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */
export const MAX_HARD_POINTS = 110;

export interface GraphProblem {
  rule:
    | "authored-drift"
    | "missing-prerequisite"
    | "cross-tree-edge"
    | "cycle"
    | "unknown-skill"
    | "over-budget";
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

