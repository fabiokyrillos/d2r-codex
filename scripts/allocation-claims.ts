/**
 * One editorial control over a build's skill *roles*, as a pure function.
 *
 * `checkSkillGraph` already proves that a plan is spendable: the skills exist,
 * the prerequisites are met, the points fit in 110. What nothing checked was
 * what a build *calls* each allocation. `role: "synergy"` is a claim — it tells
 * the reader that hard points in this skill raise the build's main skill — and
 * on the Druid that claim is wrong more easily than on any other class.
 *
 * The Summoning tree is why. Summon Dire Wolf adds life to the spirit wolves
 * and Summon Grizzly adds damage to both, and every one of those expressions
 * reads the *effective* level rather than the hard-point level. They are listed
 * in `SOFT_LEVEL_SYNERGIES` for exactly that reason and draw no edges. A build
 * that labelled one of them a synergy would be telling a reader to spend points
 * that a +3 Summoning pelt buys more cheaply — the precise mistake the
 * generator's rule was written to prevent, arriving one layer up where that
 * rule cannot see it.
 *
 * So the label is checked against the graph the generator produced. Nothing is
 * imported from content: the caller supplies the builds and the graph.
 */
import type { Build, Slug } from "../lib/types";
import type { SkillGraphNode } from "../content/classes/skill-graph";

export interface AllocationProblem {
  rule: "synergy-role-with-no-edge";
  message: string;
}

/** The skills the graph says feed `slug` through hard points. */
export function synergySourcesOf(
  graph: Readonly<Record<Slug, SkillGraphNode>>,
  slug: Slug,
): Slug[] {
  return (graph[slug]?.synergies ?? []).map((s) => s.from);
}

/**
 * Every allocation a build calls a synergy that feeds nothing the build is
 * built around.
 *
 * The receiver is any skill the build allocates with role `main` — not the
 * `primarySkill` alone. That distinction is the difference between a rule and a
 * nuisance: the Fire Druid maxes Molten Boulder as a synergy and Fissure is its
 * primary skill, but Molten Boulder feeds **Armageddon** and **Volcano**, both
 * of which that build also maxes. Scoping to the primary skill rejected ten
 * correct allocations across four classes on its first run.
 *
 * What it still rejects is the shape it was written for. Summon Dire Wolf feeds
 * only Raven, which the Summon Druid holds at one point as a prerequisite — so
 * labelling the wolf a synergy claims a multiplier the build never collects.
 */
export function checkSynergyRoles(
  builds: readonly Build[],
  graph: Readonly<Record<Slug, SkillGraphNode>>,
  where: string,
): AllocationProblem[] {
  const found: AllocationProblem[] = [];
  for (const build of builds) {
    const mains = build.skills.filter((a) => a.role === "main").map((a) => a.skill);
    if (mains.length === 0) continue;

    for (const allocation of build.skills) {
      if (allocation.role !== "synergy") continue;
      const feeds = mains.filter((m) => synergySourcesOf(graph, m).includes(allocation.skill));
      if (feeds.length > 0) continue;

      found.push({
        rule: "synergy-role-with-no-edge",
        message:
          `${where}/${build.slug}: ${allocation.skill} is allocated ${allocation.points} points ` +
          `with role "synergy", and the graph draws no synergy edge from it to any of this ` +
          `build's main skills (${mains.join(", ")}). A soft-level bonus reads the effective ` +
          `level and is raised by +skills, which is the opposite of what this label tells a ` +
          `reader to buy.`,
      });
    }
  }
  return found;
}
