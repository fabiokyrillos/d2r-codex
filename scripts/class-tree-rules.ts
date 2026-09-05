/**
 * The correspondence between a class, its trees, its skills and the graph.
 *
 * WHY THIS EXISTS
 * ---------------
 * `CharacterClass.trees` is a list of slugs, and the class page resolved them
 * with `.map(getSkillTree).filter(t => t !== undefined)`. That filter is the
 * defect: a slug naming nothing disappears, and a slug naming *another class's*
 * tree renders that tree under this class's heading.
 *
 * Both were live. The Barbarian lists `combat-skills`, which is the Paladin's
 * tree slug, so the Barbarian's class page rendered the Paladin's Combat Skills
 * card — its theme sentence, and its ten Paladin skills — with nothing anywhere
 * saying so. The Druid lists `summoning`, which was free until the Necromancer
 * authored a tree with that slug, at which point the same thing would have
 * happened again.
 *
 * Tree slugs resolve globally, exactly like skill slugs, so the same rule
 * applies: where two classes share a name in game, the class that arrives second
 * carries a prefix.
 *
 * WHAT IS AND IS NOT ENFORCED
 * ---------------------------
 * Four classes have no authored trees yet. That is scope, not a defect, and the
 * rules below draw the line where it can actually be held:
 *
 *   - A class either has all of its trees authored or none of them. A half-
 *     authored class is the shape that let the Barbarian point at the Paladin.
 *   - A tree that resolves must belong to the class that lists it.
 *   - Which classes are unauthored is a pinned list, so a fifth joining them
 *     fails rather than being absorbed into a silent count.
 *   - Once a class is in the extracted graph, every skill it authors resolves to
 *     exactly one node, and that node agrees about which tree it is in.
 *
 * Nothing here reads real content; the caller supplies it, so the mutation tests
 * can hand it a deliberately broken class.
 */
import type { CharacterClass, Skill, SkillTree, Slug } from "../lib/types";

export interface ClassTreeProblem {
  rule:
    | "tree-unresolved"
    | "tree-wrong-class"
    | "tree-duplicate"
    | "tree-not-listed"
    | "tree-scope-drift"
    | "skill-tree-not-in-class"
    | "skill-node-missing"
    | "skill-node-tree-mismatch";
  message: string;
}

/**
 * Classes whose skill trees are not authored yet.
 *
 * Pinned rather than counted. "Some classes have no trees" is a statement that
 * stays true while a class quietly loses the ones it had; this is a statement
 * about which four, and it fails the moment that set changes in either
 * direction.
 */
export const TREES_NOT_YET_AUTHORED: readonly string[] = [
  "barbarian",
  "warlock",
];

export function checkClassTrees(
  classes: readonly CharacterClass[],
  trees: readonly SkillTree[],
  skills: readonly Skill[],
  graph: Record<Slug, { classSlug: string; tree: Slug }>,
): ClassTreeProblem[] {
  const found: ClassTreeProblem[] = [];
  const add = (rule: ClassTreeProblem["rule"], message: string) =>
    found.push({ rule, message });

  // -- one tree per slug ----------------------------------------------------
  const bySlug = new Map<Slug, SkillTree>();
  for (const tree of trees) {
    if (bySlug.has(tree.slug)) {
      add(
        "tree-duplicate",
        `two skill trees share the slug "${tree.slug}" (${bySlug.get(tree.slug)!.classSlug} and ` +
          `${tree.classSlug}). Slugs resolve globally; the second class needs a prefix.`,
      );
      continue;
    }
    bySlug.set(tree.slug, tree);
  }

  // -- every listed slug, and who it belongs to -----------------------------
  const unauthored: string[] = [];
  for (const cls of classes) {
    const resolved = cls.trees.map((slug) => bySlug.get(slug));
    const missing = cls.trees.filter((slug) => !bySlug.has(slug));

    if (missing.length === cls.trees.length) {
      // Nothing authored for this class at all. Recorded, and checked against
      // the pinned list below rather than waved through.
      unauthored.push(cls.slug);
      continue;
    }
    if (missing.length > 0) {
      add(
        "tree-unresolved",
        `class "${cls.slug}" lists ${cls.trees.length} trees and ${missing.length} of them ` +
          `resolve to nothing: ${missing.join(", ")}. The class page filters those out ` +
          `silently, so the reader sees a class with fewer trees than it has.`,
      );
    }
    for (const [index, tree] of resolved.entries()) {
      if (!tree) continue;
      if (tree.classSlug !== cls.slug) {
        add(
          "tree-wrong-class",
          `class "${cls.slug}" lists "${cls.trees[index]}", which is ${tree.classSlug}'s tree. ` +
            `Its name, its theme and its skills would render on the ${cls.slug} page.`,
        );
      }
    }
  }

  const expected = [...TREES_NOT_YET_AUTHORED].sort().join(", ");
  const actual = [...unauthored].sort().join(", ");
  if (expected !== actual) {
    add(
      "tree-scope-drift",
      `classes with no authored trees are [${actual}], not the pinned [${expected}]. ` +
        `A class joining that set has lost its trees; one leaving it should be removed from ` +
        `TREES_NOT_YET_AUTHORED in the commit that authors them.`,
    );
  }

  // -- no tree exists that no class points at -------------------------------
  const listed = new Set(classes.flatMap((c) => c.trees));
  for (const tree of bySlug.values()) {
    if (!listed.has(tree.slug)) {
      add(
        "tree-not-listed",
        `tree "${tree.slug}" (${tree.classSlug}) is authored but no class lists it, so nothing ` +
          `renders it.`,
      );
    }
  }

  // -- skills point at a tree their own class owns --------------------------
  const treesOf = new Map(classes.map((c) => [c.slug, new Set(c.trees)]));
  for (const skill of skills) {
    if (!treesOf.get(skill.classSlug)?.has(skill.tree)) {
      add(
        "skill-tree-not-in-class",
        `skill "${skill.slug}" sits in tree "${skill.tree}", which ${skill.classSlug} does not list.`,
      );
    }
  }

  // -- once a class is extracted, skills and nodes correspond exactly -------
  const extracted = new Set(Object.values(graph).map((n) => n.classSlug));
  for (const skill of skills) {
    if (!extracted.has(skill.classSlug)) continue;
    const node = graph[skill.slug];
    if (!node) {
      add(
        "skill-node-missing",
        `skill "${skill.slug}" is authored for ${skill.classSlug}, which is extracted, and has ` +
          `no graph node.`,
      );
      continue;
    }
    if (node.tree !== skill.tree) {
      add(
        "skill-node-tree-mismatch",
        `skill "${skill.slug}" is authored in tree "${skill.tree}" and the graph puts it in ` +
          `"${node.tree}". The list on the class page and the tile in the drawn tree would ` +
          `disagree about where it lives.`,
      );
    }
  }

  return found;
}
