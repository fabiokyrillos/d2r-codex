/**
 * Proof that the class/tree/skill/node correspondence rules fire.
 *
 * The rules exist because two of these were live and neither was visible. The
 * Barbarian listed `combat-skills`, the Paladin's tree slug, and the class page
 * rendered the Paladin's card under the Barbarian's heading; the Druid listed
 * `summoning`, which became the Necromancer's the moment that tree was
 * authored. Both were resolved by `.map(getSkillTree).filter(Boolean)` — a
 * filter that turns a wrong answer into a plausible one.
 *
 * So each rule is exercised twice, in the pattern `check-content.test.ts`
 * established: once against a fixture that isolates the defect, and once
 * against the real content deliberately corrupted in memory, so the rule is
 * proven to fire on the shapes the site actually ships.
 *
 * Run with `npm run test:class-trees`.
 */
import { getClasses, getSkillTrees, getSkills } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import type { CharacterClass, Skill, SkillTree } from "../lib/types";
import {
  TREES_NOT_YET_AUTHORED,
  checkClassTrees,
  type ClassTreeProblem,
} from "./class-tree-rules";

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

const fired = (problems: ClassTreeProblem[], rule: ClassTreeProblem["rule"]) =>
  problems.filter((p) => p.rule === rule).length;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const cls = (slug: string, trees: string[]): CharacterClass =>
  ({ slug, name: slug, trees }) as unknown as CharacterClass;

const tree = (slug: string, classSlug: string): SkillTree =>
  ({ slug, classSlug, name: slug, order: 1 }) as unknown as SkillTree;

const skill = (slug: string, classSlug: string, treeSlug: string): Skill =>
  ({ slug, classSlug, tree: treeSlug, name: slug }) as unknown as Skill;

/**
 * A minimal world: one extracted class with one tree and one skill, plus the
 * four unauthored classes the pinned list expects, so the scope rule is
 * satisfied and every other rule can be tested in isolation.
 */
const world = (over: {
  classes?: CharacterClass[];
  trees?: SkillTree[];
  skills?: Skill[];
  graph?: Record<string, { classSlug: string; tree: string }>;
} = {}) => {
  const classes = over.classes ?? [cls("paladin", ["combat-skills"])];
  const unauthored = TREES_NOT_YET_AUTHORED.map((slug) => cls(slug, [`${slug}-tree`]));
  return checkClassTrees(
    [...classes, ...unauthored],
    over.trees ?? [tree("combat-skills", "paladin")],
    over.skills ?? [skill("smite", "paladin", "combat-skills")],
    over.graph ?? { smite: { classSlug: "paladin", tree: "combat-skills" } },
  );
};

// ===========================================================================
console.log("\nFixtures");
// ===========================================================================

check("a consistent world produces no problems", world().length === 0, JSON.stringify(world()));

{
  // Planted: one of three slugs names nothing. The class page would render two
  // trees and say nothing about the third.
  const found = world({
    classes: [cls("paladin", ["combat-skills", "offensive-auras"])],
  });
  check("a half-resolving class is caught", fired(found, "tree-unresolved") === 1, JSON.stringify(found));
}

{
  // Planted: the Barbarian regression, exactly as it shipped.
  const found = world({
    classes: [cls("paladin", ["combat-skills"]), cls("barbarian", ["combat-skills"])],
  });
  check(
    "a class listing another class's tree is caught",
    fired(found, "tree-wrong-class") === 1,
    JSON.stringify(found),
  );
}

{
  // Planted: two classes author the same slug. The registry throws on this at
  // load, so the rule exists for the case where it does not get that far.
  const found = world({
    classes: [cls("paladin", ["combat-skills"])],
    trees: [tree("combat-skills", "paladin"), tree("combat-skills", "barbarian")],
  });
  check("a duplicate tree slug is caught", fired(found, "tree-duplicate") === 1, JSON.stringify(found));
}

{
  // Planted: an authored tree nothing points at. It exists, it is translated,
  // and no page renders it.
  const found = world({
    trees: [tree("combat-skills", "paladin"), tree("orphan-tree", "paladin")],
  });
  check("an authored tree no class lists is caught", fired(found, "tree-not-listed") === 1);
}

{
  // Planted: a fifth class quietly loses its trees.
  const found = checkClassTrees(
    [cls("paladin", ["combat-skills"]), ...TREES_NOT_YET_AUTHORED.map((s) => cls(s, [`${s}-tree`])), cls("amazon", ["nothing-here"])],
    [tree("combat-skills", "paladin")],
    [skill("smite", "paladin", "combat-skills")],
    { smite: { classSlug: "paladin", tree: "combat-skills" } },
  );
  check("a class joining the unauthored set is caught", fired(found, "tree-scope-drift") === 1);
}

{
  // Planted: a skill in a tree its own class does not list.
  const found = world({ skills: [skill("smite", "paladin", "defensive-auras")] });
  check(
    "a skill pointing at a tree its class does not list is caught",
    fired(found, "skill-tree-not-in-class") === 1,
  );
}

{
  // Planted: an extracted class with a skill the graph has no node for. This is
  // the mistyped-slug case, which used to render as nothing at all.
  const found = world({
    skills: [skill("smite", "paladin", "combat-skills"), skill("smyte", "paladin", "combat-skills")],
  });
  check(
    "a skill with no graph node in an extracted class is caught",
    fired(found, "skill-node-missing") === 1,
  );
}

{
  // Planted: the authored tree and the graph's tree disagree. The class page's
  // list and the drawn tile would put the skill in different places.
  const found = world({
    graph: { smite: { classSlug: "paladin", tree: "offensive-auras" } },
  });
  check(
    "a skill whose node names a different tree is caught",
    fired(found, "skill-node-tree-mismatch") === 1,
  );
}

// ===========================================================================
console.log("\nAgainst the real content");
// ===========================================================================

const classes = getClasses(DEFAULT_LOCALE);
const trees = getSkillTrees(DEFAULT_LOCALE);
const skills = getSkills(DEFAULT_LOCALE);
const graph = SKILL_GRAPH as unknown as Record<string, { classSlug: string; tree: string }>;

check(
  "the shipped content is clean",
  checkClassTrees(classes, trees, skills, graph).length === 0,
  JSON.stringify(checkClassTrees(classes, trees, skills, graph)),
);

{
  // The exact mutation the Barbarian shipped: point it back at the Paladin's
  // tree and confirm the rule catches it in the real world, not just a fixture.
  const mutated = classes.map((c) =>
    c.slug === "barbarian"
      ? ({ ...c, trees: ["warcries", "combat-masteries", "combat-skills"] } as CharacterClass)
      : c,
  );
  const found = checkClassTrees(mutated, trees, skills, graph);
  check(
    "restoring the Barbarian's old tree list is caught",
    fired(found, "tree-wrong-class") === 1,
    JSON.stringify(found),
  );
}

{
  // The mutation the Necromancer would have caused: give the Druid back the
  // unprefixed `summoning` slug now that a Necromancer tree owns it.
  const mutated = classes.map((c) =>
    c.slug === "druid"
      ? ({ ...c, trees: ["elemental", "shape-shifting", "summoning"] } as CharacterClass)
      : c,
  );
  const found = checkClassTrees(mutated, trees, skills, graph);
  check(
    "giving the Druid back the unprefixed summoning slug is caught",
    fired(found, "tree-wrong-class") === 1,
    JSON.stringify(found),
  );
}

{
  // A Necromancer skill loses its node, the way a mistyped slug would.
  const mutated = skills.map((s) =>
    s.slug === "corpse-explosion" ? ({ ...s, slug: "corpse-explosian" } as Skill) : s,
  );
  const found = checkClassTrees(classes, trees, mutated, graph);
  check(
    "a mistyped Necromancer skill slug is caught",
    fired(found, "skill-node-missing") === 1,
    JSON.stringify(found),
  );
}

{
  // A Necromancer tree slug dropped from the class list.
  const mutated = classes.map((c) =>
    c.slug === "necromancer" ? ({ ...c, trees: ["summoning", "poison-and-bone"] } as CharacterClass) : c,
  );
  const found = checkClassTrees(mutated, trees, skills, graph);
  check(
    "dropping a tree from the Necromancer's list is caught",
    fired(found, "tree-not-listed") === 1 && fired(found, "skill-tree-not-in-class") === 10,
    JSON.stringify(found.map((p) => p.rule)),
  );
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed. Every class-tree rule is proven to fire.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
