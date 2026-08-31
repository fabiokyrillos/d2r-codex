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
 * Then an end-to-end control proves a COMPLETE PROCESS exits non-zero because
 * of a planted mutation — an in-process function call cannot show that the
 * wiring from content to exit code works. It does that without editing any
 * tracked file: the mutation is injected into the validator, and the runner
 * lives in a directory this test creates under the OS temp root. Nothing in
 * the repository is written, so there is no restore step to get wrong and no
 * window in which an interrupted run leaves a modified source behind.
 *
 * Run with `npm run test:graph`.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";

import { SKILL_GRAPH, type SkillGraphNode } from "../content/classes/skill-graph";
import { getBuilds, getSkills } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import type { Build, Skill, Slug } from "../lib/types";
import {
  checkSkillGraph,
  requiredClosure,
  MAX_HARD_POINTS,
  TIER_LEVELS,
} from "./skill-graph-rules";
import { MIN_PROSE_LENGTH, exitCodeFor, isUntranslatedProse } from "./content-rules";
import { getBuilds as getLocalisedBuilds } from "../lib/registry";
import { LOCALES } from "../lib/i18n/config";

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

/**
 * Row is derived from the required level rather than passed in, so a fixture
 * cannot accidentally violate the row/level invariant the checker enforces and
 * fail a test for a reason the test is not about.
 */
const node = (
  over: Partial<SkillGraphNode> & { prerequisites: Slug[] },
): SkillGraphNode => {
  const requiredLevel = over.requiredLevel ?? 1;
  const row = TIER_LEVELS.indexOf(requiredLevel as (typeof TIER_LEVELS)[number]) + 1;
  return {
    classSlug: "paladin",
    tree: "combat-skills",
    page: 1,
    column: 1,
    maxLevel: 20,
    ...over,
    requiredLevel,
    row: (over.row ?? row) as SkillGraphNode["row"],
  } as SkillGraphNode;
};

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
console.log("\nEnd-to-end control: a whole process, and no tracked file touched");
// ===========================================================================

/*
 * An earlier version of this test edited content/classes/paladin/skills.ts in
 * place and restored it in a `finally`. That is not good enough: a Ctrl-C, a
 * killed terminal or a crashed runner between the write and the restore leaves
 * a tracked source file modified, and the next person inherits a mutation that
 * looks like an intentional edit.
 *
 * So nothing on disk is edited. The mutation is injected into the validator
 * instead, and a runner script written into a temporary directory outside the
 * repository proves that a complete process — not just an in-process function
 * call — exits non-zero because of it. The repository is only ever read.
 */
{
  const root = resolve(__dirname, "..");
  const gitStatus = () =>
    execSync("git status --porcelain", { cwd: root, encoding: "utf8" }).trim();
  // Snapshot rather than assert-clean: the assertion is "this test changed
  // nothing", which must hold whether or not the tree was already dirty.
  const before = gitStatus();

  // realpath matters on macOS, where os.tmpdir() is a symlink into /private.
  const tmpRoot = realpathSync(tmpdir());
  const dir = mkdtempSync(join(tmpRoot, "d2r-graph-control-"));

  // The runner imports the repo by absolute path and runs with cwd at the repo
  // root, so tsconfig path aliases still resolve. PLANT=1 corrupts the authored
  // prerequisites in memory only.
  const runner = join(dir, "control.ts");
  const abs = (p: string) => JSON.stringify(join(root, p).split("\\").join("/"));
  writeFileSync(
    runner,
    [
      `import { checkSkillGraph } from ${abs("scripts/skill-graph-rules.ts")};`,
      `import { SKILL_GRAPH } from ${abs("content/classes/skill-graph.ts")};`,
      `import { getSkills, getBuilds } from ${abs("lib/registry/index.ts")};`,
      ``,
      `const plant = process.env.PLANT === "1";`,
      `// Holy Shield requires Blessed Hammer and Charge. Drop Charge.`,
      `const skills = getSkills("en-us").map((s) =>`,
      `  plant && s.slug === "holy-shield" ? { ...s, prerequisites: ["blessed-hammer"] } : s,`,
      `);`,
      `const problems = checkSkillGraph(SKILL_GRAPH, skills, getBuilds("en-us"));`,
      `for (const p of problems) console.error(p.rule + ": " + p.message);`,
      `process.exit(problems.length > 0 ? 1 : 0);`,
    ].join("\n"),
    "utf8",
  );

  const run = (plant: boolean) => {
    try {
      execSync(`npx tsx ${JSON.stringify(runner)}`, {
        cwd: root,
        stdio: "pipe",
        env: { ...process.env, PLANT: plant ? "1" : "0" },
      });
      return { code: 0, err: "" };
    } catch (e) {
      const err = e as { status?: number; stderr?: Buffer };
      return { code: err.status ?? 1, err: err.stderr?.toString() ?? "" };
    }
  };

  try {
    check("a full process over the real content exits 0", run(false).code === 0);

    // Exit code alone is not proof: a broken import would also be non-zero.
    // Require the process to name the rule it tripped.
    const planted = run(true);
    check("the same process exits non-zero with the mutation injected", planted.code !== 0);
    check(
      "...and it failed for the planted reason, not a crash",
      planted.err.includes("authored-drift") && planted.err.includes("holy-shield"),
      planted.err.split("\n")[0]?.slice(0, 120),
    );

    check("...and passes again once the mutation is removed", run(false).code === 0);
  } finally {
    // Only ever delete the directory this test created, and only after
    // confirming it still resolves inside the OS temp root.
    const resolved = realpathSync(dir);
    const inTemp = resolved.startsWith(tmpRoot + sep);
    const isOurs = basename(resolved).startsWith("d2r-graph-control-");
    if (inTemp && isOurs) rmSync(resolved, { recursive: true, force: true });
    check("the temporary directory was inside the OS temp root", inTemp, resolved);
    check("the temporary directory was one this test created", isOurs, basename(resolved));
    check("the temporary directory is gone", !existsSync(dir));
  }

  // The point of the whole refactor: the repository is untouched.
  const after = gitStatus();
  check(
    "the run changed nothing git can see",
    after === before,
    after === before ? "" : `before=${before.split("\n").length} after=${after.split("\n").length} entries`,
  );
}

// ===========================================================================
console.log("\nUntranslated prose detection");
// ===========================================================================

{
  const long = "Crushing Blow, Deadly Strike and Open Wounds, all on one boot.";
  check("identical prose is reported", isUntranslatedProse(long, long));
  check(
    "translated prose is not",
    !isUntranslatedProse(long, "Crushing Blow, Deadly Strike e Open Wounds numa bota."),
  );
  // Affix names and stat lines are identical in both locales by ADR 0003.
  check("a short identical string is not reported", !isUntranslatedProse("Magic find.", "Magic find."));
  check(
    "the boundary is exclusive",
    !isUntranslatedProse("x".repeat(MIN_PROSE_LENGTH), "x".repeat(MIN_PROSE_LENGTH)) &&
      isUntranslatedProse("x".repeat(MIN_PROSE_LENGTH + 1), "x".repeat(MIN_PROSE_LENGTH + 1)),
  );
  check("a missing source is not reported", !isUntranslatedProse(undefined, "algo"));
  check("a missing translation is not reported", !isUntranslatedProse(long, undefined));
}

// The rule against the real content, so this fails here as well as in the
// checker if a gear pick ever falls back to English again.
for (const locale of LOCALES.filter((l) => l !== DEFAULT_LOCALE)) {
  const source = getLocalisedBuilds(DEFAULT_LOCALE);
  const translated = getLocalisedBuilds(locale);
  const offenders: string[] = [];
  for (const build of source) {
    const twin = translated.find((b) => b.slug === build.slug);
    build.gearSets.forEach((set) => {
      const other = twin?.gearSets.find((g) => g.tier === set.tier);
      set.slots.forEach((slot) => {
        const otherSlot = other?.slots.find((x) => x.slot === slot.slot);
        slot.picks.forEach((pick, i) => {
          if (isUntranslatedProse(pick.why, otherSlot?.picks?.[i]?.why)) {
            offenders.push(`${build.slug} ${set.tier} ${slot.slot}#${i}`);
          }
          (pick.alternatives ?? []).forEach((alt, ai) => {
            const twinAlt = otherSlot?.picks?.[i]?.alternatives?.[ai]?.why;
            if (isUntranslatedProse(alt.why, twinAlt)) {
              offenders.push(`${build.slug} ${set.tier} ${slot.slot}#${i} alt${ai}`);
            }
          });
        });
      });
    });
  }
  check(
    `${locale}: no gear pick reason falls back to ${DEFAULT_LOCALE}`,
    offenders.length === 0,
    offenders.slice(0, 4).join(", "),
  );
}

// ===========================================================================
console.log("\nThe gate's verdict");
// ===========================================================================

check("a clean run exits 0", exitCodeFor([], []) === 0);
check("problems fail", exitCodeFor(["x"], []) === 1);
// The rule this slice exists to add: a known warning is not a silent success.
check("warnings alone fail", exitCodeFor([], ["w"]) === 1);
check("both fail", exitCodeFor(["x"], ["w"]) === 1);

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
