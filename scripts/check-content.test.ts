/**
 * Proof that the skill-graph rules actually fire.
 *
 * A validator nobody has ever seen fail is not evidence of anything. The
 * previous prerequisite check reported 289/289 for an entire release while
 * fourteen of eighteen builds were unspendable, because it compared each build
 * against the same authored table the errors came from. It was structurally
 * incapable of failing, and its green output was mistaken for a guarantee.
 *
 * So every rule here is exercised twice:
 *
 *   1. Against a hand-built fixture that isolates the defect.
 *   2. Against the REAL content, deliberately corrupted in memory, so the rule
 *      is proven to fire on the shapes the site actually ships.
 *
 * Then one end-to-end control test edits a real file on disk, proves
 * `npm run check:content` exits non-zero, restores the file, and verifies the
 * restore was byte-identical. `finally` runs the restore even if an assertion
 * throws, and the byte comparison is what makes "restored" a checked claim
 * rather than an assumption.
 *
 * Run with `npm run test:graph`.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

import { SKILL_GRAPH, type SkillGraphNode } from "../content/classes/skill-graph";
import { getBuilds, getSkills } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import type { Build, Skill, Slug } from "../lib/types";
import { checkSkillGraph, requiredClosure, MAX_HARD_POINTS } from "./skill-graph-rules";

type MutableGraph = Record<Slug, { -readonly [K in keyof SkillGraphNode]: SkillGraphNode[K] } & {
  prerequisites: Slug[];
}>;

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Rules that fired, as a set, so a test can assert on exactly one. */
const rulesFired = (problems: ReturnType<typeof checkSkillGraph>) =>
  new Set(problems.map((p) => p.rule));

const cloneGraph = (): MutableGraph =>
  JSON.parse(JSON.stringify(SKILL_GRAPH)) as MutableGraph;

const skill = (slug: Slug, prerequisites: Slug[] = []): Skill =>
  ({ slug, name: slug, summary: "", classSlug: "paladin", tree: "t", kind: "spell",
     requiredLevel: 1, prerequisites }) as unknown as Skill;

const build = (slug: string, skills: { skill: Slug; points: number; role: string }[]): Build =>
  ({ slug, classSlug: "paladin", skills }) as unknown as Build;

const node = (
  over: Partial<SkillGraphNode> & { prerequisites: Slug[] },
): SkillGraphNode =>
  ({ classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 1, ...over }) as SkillGraphNode;

// ===========================================================================
console.log("\nFixtures — each rule in isolation");
// ===========================================================================

{
  // Control: a well-formed graph and a spendable plan must produce nothing.
  const g: Record<Slug, SkillGraphNode> = {
    a: node({ prerequisites: [] }),
    b: node({ prerequisites: ["a"], requiredLevel: 6 }),
  };
  const problems = checkSkillGraph(g, [skill("a"), skill("b", ["a"])], [
    build("ok", [{ skill: "b", points: 20, role: "main" }, { skill: "a", points: 1, role: "prerequisite" }]),
  ]);
  check("clean graph and spendable plan produce no problems", problems.length === 0,
    problems.map((p) => p.message).join("; "));
}

{
  // 1. missing prerequisite (direct)
  const g: Record<Slug, SkillGraphNode> = {
    a: node({ prerequisites: [] }),
    b: node({ prerequisites: ["a"] }),
  };
  const problems = checkSkillGraph(g, [skill("a"), skill("b", ["a"])], [
    build("broken", [{ skill: "b", points: 20, role: "main" }]),
  ]);
  check("detects a directly missing prerequisite", rulesFired(problems).has("missing-prerequisite"));
}

{
  // 2. A plan missing a whole prerequisite CHAIN. `c` requires `b`, `b`
  //    requires `a`, and the plan allocates only `c`.
  //
  //    Note what this does and does not prove. A direct-edge check applied to
  //    every allocated skill is already sufficient to reject this plan — by
  //    induction, if each allocated skill has its own direct prerequisites
  //    allocated, the whole closure is satisfied. So closure is not "more
  //    correct" than a direct check; claiming otherwise would be overselling
  //    it, and the first version of this test did exactly that.
  //
  //    What closure buys is that it names the ENTIRE missing chain in one
  //    pass. A direct check reports `b`, you add it, re-run, and only then
  //    learn about `a`. On the real content that difference was three
  //    round-trips per fire build (fire-wall, then blaze, then inferno).
  const g: Record<Slug, SkillGraphNode> = {
    a: node({ prerequisites: [] }),
    b: node({ prerequisites: ["a"] }),
    c: node({ prerequisites: ["b"] }),
  };
  const plan = build("chain", [{ skill: "c", points: 20, role: "main" }]);
  const skills = [skill("a"), skill("b", ["a"]), skill("c", ["b"])];
  const problems = checkSkillGraph(g, skills, [plan]);
  check("detects a plan missing a prerequisite chain",
    rulesFired(problems).has("missing-prerequisite"));

  const allocated = new Set(plan.skills.map((s) => s.skill));
  const directlyMissing = new Set(
    plan.skills.flatMap((s) => (g[s.skill]?.prerequisites ?? []).filter((p) => !allocated.has(p))),
  );
  const closureMissing = new Set(
    [...requiredClosure(allocated, g)].filter((s) => !allocated.has(s)),
  );
  check("...and names the whole chain, not just the first layer",
    closureMissing.size > directlyMissing.size &&
      closureMissing.has("a") && !directlyMissing.has("a"),
    `direct=[${[...directlyMissing]}] closure=[${[...closureMissing]}]`);
}

{
  // 3. cross-tree edge
  const g: Record<Slug, SkillGraphNode> = {
    a: node({ prerequisites: [], page: 2 }),
    b: node({ prerequisites: ["a"], page: 1 }),
  };
  const problems = checkSkillGraph(g, [skill("a"), skill("b", ["a"])], []);
  check("detects a prerequisite edge crossing trees", rulesFired(problems).has("cross-tree-edge"));
}

{
  // 4. cycle
  const g: Record<Slug, SkillGraphNode> = {
    a: node({ prerequisites: ["b"] }),
    b: node({ prerequisites: ["a"] }),
  };
  const problems = checkSkillGraph(g, [skill("a", ["b"]), skill("b", ["a"])], []);
  check("detects a prerequisite cycle", rulesFired(problems).has("cycle"));
}

{
  // 5. edge to a skill that does not exist
  const g: Record<Slug, SkillGraphNode> = { a: node({ prerequisites: ["ghost"] }) };
  const problems = checkSkillGraph(g, [skill("a", ["ghost"])], []);
  check("detects an edge to a nonexistent skill", rulesFired(problems).has("unknown-skill"));
}

{
  // 5b. a build allocating a skill that is not in the graph
  const g: Record<Slug, SkillGraphNode> = { a: node({ prerequisites: [] }) };
  const problems = checkSkillGraph(g, [skill("a")], [
    build("ghost-alloc", [
      { skill: "a", points: 1, role: "main" },
      { skill: "not-a-skill", points: 20, role: "main" },
    ]),
  ]);
  check("detects a build allocating a nonexistent skill", rulesFired(problems).has("unknown-skill"));
}

{
  // 6. over the hard-point ceiling
  const g: Record<Slug, SkillGraphNode> = { a: node({ prerequisites: [] }) };
  const problems = checkSkillGraph(g, [skill("a")], [
    build("greedy", [{ skill: "a", points: MAX_HARD_POINTS + 1, role: "main" }]),
  ]);
  check(`detects a plan over ${MAX_HARD_POINTS} hard points`, rulesFired(problems).has("over-budget"));
}

{
  // 6b. flex points must NOT count toward the mandatory budget.
  const g: Record<Slug, SkillGraphNode> = { a: node({ prerequisites: [] }), b: node({ prerequisites: [] }) };
  const problems = checkSkillGraph(g, [skill("a"), skill("b")], [
    build("flexy", [
      { skill: "a", points: MAX_HARD_POINTS, role: "main" },
      { skill: "b", points: 40, role: "flex" },
    ]),
  ]);
  check("flex points are excluded from the mandatory budget", !rulesFired(problems).has("over-budget"));
}

{
  // 7. authored drift: content disagreeing with the generated graph
  const g: Record<Slug, SkillGraphNode> = { a: node({ prerequisites: [] }), b: node({ prerequisites: ["a"] }) };
  const problems = checkSkillGraph(g, [skill("a"), skill("b", [])], []);
  check("detects authored prerequisites drifting from the graph",
    rulesFired(problems).has("authored-drift"));
}

// ===========================================================================
console.log("\nPlanted mutations against the real content");
// ===========================================================================

const realSkills = getSkills(DEFAULT_LOCALE);
const realBuilds = getBuilds(DEFAULT_LOCALE);

{
  const problems = checkSkillGraph(SKILL_GRAPH, realSkills, realBuilds);
  check("the real content passes every rule", problems.length === 0,
    problems.slice(0, 5).map((p) => p.message).join(" | "));
}

{
  // Take a real build and delete one of its prerequisite allocations.
  const target = realBuilds.find((b) =>
    b.skills.some((a) => a.role === "prerequisite" && SKILL_GRAPH[a.skill]),
  )!;
  const removed = target.skills.find((a) => a.role === "prerequisite" && SKILL_GRAPH[a.skill])!;
  const mutated = { ...target, skills: target.skills.filter((a) => a !== removed) } as Build;
  const problems = checkSkillGraph(SKILL_GRAPH, realSkills, [mutated]);
  check(`removing ${removed.skill} from ${target.slug} is detected`,
    rulesFired(problems).has("missing-prerequisite"));
}

{
  // Flip a real edge across trees.
  const g = cloneGraph();
  const victim = Object.keys(g).find((s) => g[s].prerequisites.length > 0)!;
  g[victim].page = (g[victim].page === 1 ? 2 : 1) as 1 | 2 | 3;
  const problems = checkSkillGraph(g as unknown as Record<Slug, SkillGraphNode>, [], []);
  check(`moving ${victim} to another tree is detected as a cross-tree edge`,
    rulesFired(problems).has("cross-tree-edge"));
}

{
  // Introduce a cycle into the real graph.
  const g = cloneGraph();
  const child = Object.keys(g).find((s) => g[s].prerequisites.length > 0)!;
  const parent = g[child].prerequisites[0];
  g[parent].prerequisites = [...g[parent].prerequisites, child];
  const problems = checkSkillGraph(g as unknown as Record<Slug, SkillGraphNode>, [], []);
  check(`a ${parent} <-> ${child} cycle in the real graph is detected`,
    rulesFired(problems).has("cycle"));
}

{
  // Push a real build over the ceiling by one point.
  const target = realBuilds.find((b) => b.skills.some((a) => SKILL_GRAPH[a.skill]))!;
  const core = target.skills.filter((a) => a.points > 0 && a.role !== "flex" && SKILL_GRAPH[a.skill]);
  const spent = core.reduce((sum, a) => sum + a.points, 0);
  const mutated = {
    ...target,
    skills: target.skills.map((a) =>
      a === core[0] ? { ...a, points: a.points + (MAX_HARD_POINTS - spent) + 1 } : a,
    ),
  } as Build;
  const problems = checkSkillGraph(SKILL_GRAPH, realSkills, [mutated]);
  check(`pushing ${target.slug} one point over ${MAX_HARD_POINTS} is detected`,
    rulesFired(problems).has("over-budget"));
}

{
  // requiredClosure must follow chains, not just direct edges.
  const deep = Object.entries(SKILL_GRAPH).find(([, n]) =>
    n.prerequisites.some((p) => (SKILL_GRAPH[p]?.prerequisites.length ?? 0) > 0),
  );
  if (deep) {
    const closure = requiredClosure([deep[0]], SKILL_GRAPH);
    const direct = new Set(deep[1].prerequisites);
    check(`requiredClosure(${deep[0]}) reaches past its direct prerequisites`,
      closure.size > direct.size);
  }
}

// ===========================================================================
console.log("\nEnd-to-end control: mutate a real file on disk, then restore");
// ===========================================================================

{
  const file = "content/classes/paladin/skills.ts";
  const original = readFileSync(file, "utf8");
  // Holy Shield requires Blessed Hammer and Charge. Drop Charge.
  const from = `    prerequisites: ["blessed-hammer", "charge"],`;
  const to = `    prerequisites: ["blessed-hammer"],`;

  const runCheck = () => {
    try {
      execSync("npm run check:content", { stdio: "pipe" });
      return 0;
    } catch (err) {
      return (err as { status?: number }).status ?? 1;
    }
  };

  try {
    check("the mutation anchor exists in the real file", original.includes(from));
    check("check:content passes before the mutation", runCheck() === 0);

    writeFileSync(file, original.replace(from, to), "utf8");
    check("check:content FAILS with the planted mutation", runCheck() !== 0);
  } finally {
    writeFileSync(file, original, "utf8");
  }

  check("the file was restored byte-for-byte", readFileSync(file, "utf8") === original);
  check("check:content passes again after the restore", runCheck() === 0);
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed. Every rule is proven to fire.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
