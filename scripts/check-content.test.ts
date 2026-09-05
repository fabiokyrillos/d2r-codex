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
import { getBuilds, getFarmingAreas, getSkills } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import type { Build, Skill, Slug } from "../lib/types";
import {
  petMaxFromColumn,
  capFromMinCalc,
  checkSkillGraph,
  requiredClosure,
  MAX_HARD_POINTS,
  TIER_LEVELS,
} from "./skill-graph-rules";
import {
  ELEMENTAL_ATTACK_MODELS,
  damagePresentation,
  damageAtLevel,
  physicalAtLevel,
  unclassifiedElementalAttacks,
} from "../lib/skills";
import { MIN_PROSE_LENGTH, exitCodeFor, isUntranslatedProse } from "./content-rules";
import {
  checkChargeLines,
  checkProcLines,
  checkRuneComposition,
  checkSkillTabLines,
} from "./item-rules";
import {
  ALIAS_ONLY_NAMES,
  CHAIN_TARGETS,
  EXPECTED_IMMUNITY_CENSUS,
  checkChainClaims,
  prerequisiteClosure,
  checkAliasesAreNotPages,
  checkClassPagesComplete,
  checkImmunityCensus,
  checkNoIasBreakpoints,
} from "./amazon-rules";
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

/** How many times one rule fired, for the checks that count occurrences. */
const rulesHit = (problems: ReturnType<typeof checkSkillGraph>, rule: string) =>
  problems.filter((p) => p.rule === rule).length;

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

// ===========================================================================
console.log("\nSkill and node must correspond, once a class is extracted");
// ===========================================================================
{
  const nodeFor = (classSlug: string): SkillGraphNode =>
    ({
      classSlug,
      tree: "t",
      page: 1,
      row: 1,
      column: 1,
      requiredLevel: 1,
      maxLevel: 20,
      prerequisites: [],
      synergies: [],
    }) as unknown as SkillGraphNode;
  const skillFor = (slug: string, classSlug: string) =>
    ({ slug, classSlug, tree: "t", kind: "spell", name: slug, summary: "" }) as unknown as Skill;

  const graph = { a: nodeFor("amazon") };
  check(
    "a matched pair is clean",
    rulesHit(checkSkillGraph(graph, [skillFor("a", "amazon")], []), "orphan-skill") === 0,
  );
  check(
    "a skill of an extracted class with no node is reported",
    rulesHit(
      checkSkillGraph(graph, [skillFor("a", "amazon"), skillFor("typo", "amazon")], []),
      "orphan-skill",
    ) === 1,
  );
  check(
    "a node with no authored skill is reported",
    rulesHit(checkSkillGraph(graph, [], []), "orphan-node") === 1,
  );
  // The skip this rule closes must stay open for classes that are genuinely
  // not extracted yet, or authoring a class before its extraction would fail.
  check(
    "a skill of a class outside the graph is not reported",
    rulesHit(
      checkSkillGraph(graph, [skillFor("a", "amazon"), skillFor("b", "druid")], []),
      "orphan-skill",
    ) === 0,
  );

  // The real content, corrupted in memory.
  const realSkills = getSkills(DEFAULT_LOCALE);
  check(
    "the shipped content has no orphan on either side",
    rulesHit(checkSkillGraph(SKILL_GRAPH, realSkills, []), "orphan-skill") === 0 &&
      rulesHit(checkSkillGraph(SKILL_GRAPH, realSkills, []), "orphan-node") === 0,
  );
  const mistyped = realSkills.map((s) =>
    s.slug === "decoy" ? ({ ...s, slug: "dopplezon" } as Skill) : s,
  );
  check(
    "renaming Decoy to its game identifier is caught, not swallowed",
    rulesHit(checkSkillGraph(SKILL_GRAPH, mistyped, []), "orphan-skill") === 1 &&
      rulesHit(checkSkillGraph(SKILL_GRAPH, mistyped, []), "orphan-node") === 1,
  );
}

// ===========================================================================
console.log("\nDamage models — an elemental attack must say how the weapon figures");
// ===========================================================================
{
  const table = { damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [] }, max: { base: 30, bands: [] } } };
  const noTable = {};
  const skill = (slug: string, kind: Skill["kind"], model?: Skill["damageModel"]) =>
    ({ slug, kind, damageModel: model }) as Pick<Skill, "slug" | "kind" | "damageModel">;

  // The defect: an attack the graph tabulates, with no model authored. Left
  // alone it resolves to "table" and its page prints a range while saying
  // nothing about the weapon.
  check(
    "an unclassified elemental attack is reported",
    unclassifiedElementalAttacks([skill("charged-strike", "attack")], { "charged-strike": table })
      .length === 1,
  );
  for (const model of ELEMENTAL_ATTACK_MODELS) {
    check(
      `...and is cleared by authoring "${model}"`,
      unclassifiedElementalAttacks([skill("x", "attack", model)], { x: table }).length === 0,
    );
  }
  // The rule must not widen into skills it has nothing to say about.
  check(
    "a spell with a table is not asked for a model",
    unclassifiedElementalAttacks([skill("blizzard", "spell")], { blizzard: table }).length === 0,
  );
  check(
    "a plain weapon attack is not asked for a model",
    unclassifiedElementalAttacks([skill("zeal", "attack")], { zeal: noTable }).length === 0,
  );

  /*
   * The second trigger. A skill whose missile converts physical damage into an
   * element must be classified even with no elemental table of its own —
   * Magic Arrow is exactly that, and a rule keyed on the table alone let it
   * fall into the generic `weapon` bucket while its prose claimed conversion.
   */
  const converts = { conversion: { element: "mag", base: 5, perLevel: 2 } };
  check(
    "a converting attack with no table is reported",
    unclassifiedElementalAttacks([skill("magic-arrow", "attack")], { "magic-arrow": converts })
      .length === 1,
  );
  check(
    "...and is cleared by authoring the conversion model",
    unclassifiedElementalAttacks(
      [skill("magic-arrow", "attack", "weapon-converted-to-element")],
      { "magic-arrow": converts },
    ).length === 0,
  );
  check(
    "a converting spell is still not asked for a model",
    unclassifiedElementalAttacks([skill("x", "spell")], { x: converts }).length === 0,
  );

  // The real content: strip Magic Arrow's model and the rule must fire on it.
  {
    const stripped = getSkills(DEFAULT_LOCALE).map((s) =>
      s.slug === "magic-arrow" ? ({ ...s, damageModel: undefined } as Skill) : s,
    );
    const hit = unclassifiedElementalAttacks(stripped, SKILL_GRAPH);
    check(
      "un-classifying Magic Arrow is caught in the real content",
      hit.length === 1 && hit[0] === "magic-arrow",
      hit.join(", "),
    );
  }

  // An authored model must outrank the table, or every one of them would be
  // shadowed by the `node.damage` branch that used to run first.
  for (const model of ELEMENTAL_ATTACK_MODELS) {
    check(
      `"${model}" survives a skill that also has a table`,
      damagePresentation({ kind: "attack", damageModel: model }, table) === model,
    );
  }
  check(
    "shield still outranks a table, as Smite relies on",
    damagePresentation({ kind: "attack", damageModel: "shield" }, table) === "shield",
  );
  check(
    "an attack with no model and no table is still a weapon attack",
    damagePresentation({ kind: "attack" }, noTable) === "weapon",
  );

  // The real content, corrupted in memory: strip one model and the rule fires.
  const real = getSkills(DEFAULT_LOCALE);
  const classified = real.filter(
    (s) => s.damageModel && (ELEMENTAL_ATTACK_MODELS as readonly string[]).includes(s.damageModel),
  );
  check(
    "the shipped content is fully classified",
    unclassifiedElementalAttacks(real, SKILL_GRAPH).length === 0,
  );
  if (classified.length > 0) {
    const stripped = real.map((s) =>
      s.slug === classified[0].slug ? { ...s, damageModel: undefined } : s,
    );
    check(
      `stripping ${classified[0].slug}'s model is caught in the real content`,
      unclassifiedElementalAttacks(stripped, SKILL_GRAPH).length === 1,
    );
  } else {
    console.log("  --   no elemental attack models shipped yet; in-memory mutation deferred");
  }
}

// ===========================================================================
console.log("\nAmazon-pass rules, each planted against the real content");
// ===========================================================================
{
  const realBuilds = getBuilds(DEFAULT_LOCALE);
  const realAreas = getFarmingAreas(DEFAULT_LOCALE);
  const TIERS = ["starter", "nightmare", "early-hell", "budget", "optimized", "bis"] as const;

  // -- incomplete-class-page ----------------------------------------------
  /*
   * Every class, not the one whose pass wrote the contract. The Paladin and
   * Sorceress pages predate it and satisfy it, which is what made widening the
   * scope a check rather than a project.
   */
  const publishedClasses = [...new Set(realBuilds.map((b) => b.classSlug))];
  for (const classSlug of publishedClasses) {
    const found = checkClassPagesComplete(realBuilds, classSlug, TIERS);
    check(
      `every ${classSlug} build page is complete`,
      found.length === 0,
      JSON.stringify(found.map((p) => p.message)),
    );
  }
  check("and that is five classes, not one", publishedClasses.length === 5);
  {
    const victim = realBuilds.find((b) => b.classSlug === "amazon");
    if (!victim) throw new Error("no Amazon build to mutate");
    const drops: [string, Build][] = [
      ["the bis gear tier", { ...victim, gearSets: victim.gearSets.filter((g) => g.tier !== "bis") }],
      ["the immunity plan", { ...victim, immunityPlan: undefined }],
      ["the hardcore notes", { ...victim, hardcoreNotes: undefined }],
      ["the self-found notes", { ...victim, selfFoundNotes: undefined }],
      ["the mercenary", { ...victim, mercenary: undefined }],
      ["every breakpoint and the note that would explain it", { ...victim, breakpoints: [], breakpointNotes: undefined }],
      [
        "the skill it is named after",
        { ...victim, skills: victim.skills.filter((s) => s.skill !== victim.primarySkill) },
      ],
    ];
    for (const [what, mutated] of drops) {
      const found = checkClassPagesComplete([mutated], "amazon", TIERS);
      check(
        `dropping ${what} from ${victim.slug} is caught`,
        found.length >= 1 && found.every((p) => p.rule === "incomplete-class-page"),
        JSON.stringify(found),
      );
    }
    /*
     * An empty breakpoint table is allowed when the page says why it is empty,
     * and only then. The shape-shifting Druids are the reason: no wereform
     * frame table exists at a source tier this project accepts, so the honest
     * page publishes nothing and explains it. Dropping the explanation and
     * keeping the emptiness is the failure.
     */
    check(
      "an empty breakpoint table with a note explaining it passes",
      checkClassPagesComplete(
        [{ ...victim, breakpoints: [], breakpointNotes: "No table exists at an acceptable tier." }],
        "amazon",
        TIERS,
      ).length === 0,
    );
    check(
      "the four shape-shifting Druids are exactly that shape",
      realBuilds
        .filter((b) => b.classSlug === "druid" && b.breakpoints.length === 0)
        .every((b) => Boolean(b.breakpointNotes)),
    );

    // Negative control: the rule is scoped, so a Paladin page cannot trip it.
    check(
      "the rule is scoped by class and ignores other classes entirely",
      checkClassPagesComplete(
        realBuilds.map((b) => ({ ...b, immunityPlan: undefined })),
        "sorceress",
        TIERS,
      ).length > 0 &&
        checkClassPagesComplete(
          realBuilds.filter((b) => b.classSlug !== "amazon"),
          "amazon",
          TIERS,
        ).length === 0,
    );
  }

  // -- universal-ias-breakpoint -------------------------------------------
  check("no build publishes an IAS breakpoint", checkNoIasBreakpoints(realBuilds).length === 0);
  {
    const victim = realBuilds[0];
    const mutated: Build = {
      ...victim,
      breakpoints: [
        ...victim.breakpoints,
        { stat: "ias", value: 75, priority: "required", why: "planted" },
      ],
    };
    const found = checkNoIasBreakpoints([mutated]);
    check(
      "adding an IAS breakpoint to a real build is caught",
      found.length === 1 && found[0].rule === "universal-ias-breakpoint",
      JSON.stringify(found),
    );
  }

  // -- immunity-census-drift ----------------------------------------------
  check(
    "the immunity census matches what the prose argues from",
    checkImmunityCensus(realAreas, EXPECTED_IMMUNITY_CENSUS).length === 0,
    JSON.stringify(checkImmunityCensus(realAreas, EXPECTED_IMMUNITY_CENSUS)),
  );
  check(
    "removing one fire-immune area from the census is caught",
    checkImmunityCensus(
      realAreas.filter((a, i) => !(a.commonImmunities.includes("fire") && i === realAreas.findIndex((x) => x.commonImmunities.includes("fire")))),
      EXPECTED_IMMUNITY_CENSUS,
    ).some((p) => p.rule === "immunity-census-drift"),
  );

  // -- alias-became-a-page -------------------------------------------------
  check(
    "no alias has become a build page",
    checkAliasesAreNotPages(realBuilds, ALIAS_ONLY_NAMES).length === 0,
    JSON.stringify(checkAliasesAreNotPages(realBuilds, ALIAS_ONLY_NAMES)),
  );
  {
    const found = checkAliasesAreNotPages(
      [...realBuilds, { slug: "javazon", name: "Javazon" }],
      ALIAS_ONLY_NAMES,
    );
    check(
      "publishing a build called Javazon is caught",
      found.length === 1 && found[0].rule === "alias-became-a-page",
      JSON.stringify(found),
    );
  }
  {
    // The subtler shape: a slug that differs but a display name that does not.
    const found = checkAliasesAreNotPages(
      [...realBuilds, { slug: "charged-strike-build", name: "Charged Strike" }],
      ALIAS_ONLY_NAMES,
    );
    check(
      "a build whose NAME is Charged Strike is caught even with a different slug",
      found.length === 1,
      JSON.stringify(found),
    );
  }
}

// ===========================================================================
console.log("\nCaps are read out of the calc column, not remembered");
// ===========================================================================
{
  // The real column, exactly as the extraction gives it: quoted, no spaces.
  check('the shipped column yields 24', capFromMinCalc('"min(ln12,24)"', "fixture") === 24);

  /*
   * The mutation that matters. If the cap were still hardcoded, changing the
   * fixture would change nothing — this is the assertion that proves the number
   * travels from the column rather than from memory.
   */
  check("a fixture with a different cap yields that cap", capFromMinCalc('"min(ln12,30)"', "f") === 30);
  check("and another one, so 24 and 30 are not both special-cased",
    capFromMinCalc('"min(ln12,7)"', "f") === 7);

  // Shapes the extraction could legitimately hand over.
  check("unquoted is accepted", capFromMinCalc("min(ln12,24)", "f") === 24);
  check("whitespace is accepted", capFromMinCalc('" min( ln12 , 24 ) "', "f") === 24);

  const throws = (raw: unknown) => {
    try {
      capFromMinCalc(raw, "fixture");
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  };
  check("a missing column fails", throws(undefined) !== null);
  check("an empty column fails", throws("") !== null);
  check("a whitespace-only column fails", throws('"   "') !== null);
  check("a non-numeric column fails", throws(24) !== null);
  check("an expression with no min() fails", throws('"ln12"') !== null);
  check("a min() with no cap fails", throws('"min(ln12)"') !== null);
  // Strafe's shape: a cap held in a parameter. It must fail rather than be
  // guessed at, and the message must say where that case is handled instead.
  {
    const message = throws('"min(par3 + lvl - 1, par4)"');
    check("Strafe's parameter-held cap is refused", message !== null);
    check("and the refusal names the parameter case", message?.includes("par4") === true, message ?? "");
  }
  check("a nested min() is refused rather than half-parsed", throws('"min(min(a,2),24)"') !== null);

  // The committed graph is what all of that is for.
  {
    const node = SKILL_GRAPH["multiple-shot"];
    const shape = node?.effects?.[0]?.shape as { kind: string; cap?: number } | undefined;
    check("the shipped Multiple Shot node still caps at 24", shape?.cap === 24, JSON.stringify(shape));
    // And Strafe is untouched by this change: its cap is Param4, still 10.
    const strafe = SKILL_GRAPH["strafe"]?.effects?.[0]?.shape as { cap?: number } | undefined;
    check("Strafe still caps at 10, read from its own parameter", strafe?.cap === 10, JSON.stringify(strafe));
  }
}

// ===========================================================================
console.log("\nChain claims — a sentence that routes to a skill must route all of it");
// ===========================================================================
{
  const nameOf = (slug: string) =>
    getSkills(DEFAULT_LOCALE).find((s) => s.slug === slug)?.name ?? slug;

  // The closure is read from the graph, so this asserts the fixture rather than
  // assuming it: Valkyrie needs both branches, six skills in all.
  const closure = prerequisiteClosure(SKILL_GRAPH, "valkyrie").sort();
  check(
    "Valkyrie's prerequisite closure is the six skills of both branches",
    JSON.stringify(closure) ===
      JSON.stringify(["avoid", "decoy", "dodge", "evade", "inner-sight", "slow-missiles"]),
    JSON.stringify(closure),
  );

  const full =
    "Start the Valkyrie chain now. Inner Sight, Slow Missiles, Decoy, and Dodge, Avoid, Evade.";
  check(
    "a sentence naming the whole chain passes",
    checkChainClaims([full], SKILL_GRAPH, nameOf, CHAIN_TARGETS, "fixture").length === 0,
  );

  // Planted: the exact sentence that shipped, with Evade missing.
  const shipped =
    "Start the Valkyrie chain now: Inner Sight, Slow Missiles, Dodge, Avoid. " +
    "Every one of them is useful on its own, and together they open Decoy at 24 and Valkyrie at 30.";
  {
    const found = checkChainClaims([shipped], SKILL_GRAPH, nameOf, CHAIN_TARGETS, "fixture");
    check(
      "the sentence that shipped without Evade is caught",
      found.length === 1 && found[0].rule === "incomplete-chain-claim",
      JSON.stringify(found),
    );
    check(
      "and the message names the skill that is missing",
      found[0]?.message.includes("Evade") === true,
      found[0]?.message,
    );
  }

  // Dropping any single link from the full sentence must fire. This is what
  // stops the rule passing because it only ever looked for one name.
  for (const link of closure) {
    const name = nameOf(link);
    const mutated = full.replace(new RegExp(`\\b${name}\\b,? ?`), "");
    const found = checkChainClaims([mutated], SKILL_GRAPH, nameOf, CHAIN_TARGETS, "fixture");
    check(
      `dropping ${name} from the chain sentence is caught`,
      found.length === 1 && found[0].message.includes(name),
      JSON.stringify(found),
    );
  }

  // Negative controls. A rule that fired on these would be unusable, because
  // the journey mentions Valkyrie in five other places without routing to her.
  check(
    "a passing mention of Valkyrie is not a chain claim",
    checkChainClaims(
      ["One point in Valkyrie is enough at this stage; the +skills from gear raise her."],
      SKILL_GRAPH,
      nameOf,
      CHAIN_TARGETS,
      "fixture",
    ).length === 0,
  );
  check(
    "naming one closure skill beside her is still not an enumeration",
    checkChainClaims(
      ["Hard points in Decoy raise the Valkyrie's life."],
      SKILL_GRAPH,
      nameOf,
      CHAIN_TARGETS,
      "fixture",
    ).length === 0,
  );
  check(
    "a sentence that never names the target is ignored",
    checkChainClaims(
      ["Inner Sight, Slow Missiles, Dodge and Avoid are all useful on their own."],
      SKILL_GRAPH,
      nameOf,
      CHAIN_TARGETS,
      "fixture",
    ).length === 0,
  );
}

// ===========================================================================
console.log("\nProc lines — chance and level, in the order Tier 1 gives them");
// ===========================================================================
{
  const entity = (stats: string[]) => [
    { slug: "control", name: "Control", stats: stats.map((text) => ({ text })) },
  ];
  const spec = [
    {
      kind: "unique" as const,
      slug: "control",
      column: "hit-skill" as const,
      skill: "Lightning",
      chance: 20,
      level: 14,
    },
  ];

  check(
    "the correct line passes",
    checkProcLines(entity(["20% Chance to cast level 14 Lightning on striking"]), spec).length === 0,
  );
  // Planted: the regression this rule is named after.
  {
    const found = checkProcLines(
      entity(["14% Chance to cast level 20 Lightning on striking"]),
      spec,
    );
    check(
      "chance and level swapped is caught, and reported as a swap",
      found.length === 1 && found[0].rule === "proc-line-swapped",
      JSON.stringify(found),
    );
  }
  {
    const found = checkProcLines(entity(["+15% Increased Attack Speed"]), spec);
    check(
      "a missing proc line is caught",
      found.length === 1 && found[0].rule === "proc-line-missing",
      JSON.stringify(found),
    );
  }
  {
    const found = checkProcLines(
      entity([
        "20% Chance to cast level 14 Lightning on striking",
        "10% Chance to cast level 3 Nova on striking",
      ]),
      spec,
    );
    check(
      "a proc line no control accounts for is caught",
      found.length === 1 && found[0].rule === "proc-line-unaccounted",
      JSON.stringify(found),
    );
  }
  check(
    "a control naming an entity that does not exist is caught",
    checkProcLines([], spec)[0]?.rule === "proc-entity-missing",
  );
  // The trigger phrase is part of the line, so a `gethit-skill` value written
  // as `on striking` is a different claim and must not pass.
  check(
    "the wrong trigger phrase is caught",
    checkProcLines(entity(["20% Chance to cast level 14 Lightning when struck"]), spec).length === 1,
  );
}

// ===========================================================================
console.log("\nCharges, skill tabs and rune composition");
// ===========================================================================

/*
 * Three column semantics that invert as quietly as the proc columns did.
 *
 * `charged` is the same defect shape as `hit-skill`: min is the charge count
 * and max is the skill level, so a swap turns "Level 3 Venom (20 Charges)" into
 * "Level 20 Venom (3 Charges)" — both of which look like item lines.
 *
 * `skilltab` is worse, because its `par` is an index into the list of skill
 * *trees* and those indices overlap the skill ids. Read as a skill id, tab 7
 * would name an Amazon skill on a Necromancer wand, and the line would still
 * read as a plausible item.
 *
 * And a runeword whose rune mods were dropped publishes a shorter stat block
 * that is wrong only by omission, which is the hardest kind to see.
 */
{
  const entity = (slug: string, lines: string[]) => [{ slug, name: slug, stats: lines.map((text) => ({ text })) }];

  // -- charges -------------------------------------------------------------
  const chargeSpec = [{ slug: "x", skill: "Venom", charges: 20, level: 3 }];
  check(
    "the correct charge line passes",
    checkChargeLines(entity("x", ["Level 3 Venom (20 Charges)"]), chargeSpec).length === 0,
  );
  check(
    "charges and level exchanged is caught, and named as a swap",
    (() => {
      const found = checkChargeLines(entity("x", ["Level 20 Venom (3 Charges)"]), chargeSpec);
      return found.length === 1 && found[0].rule === "charge-line-swapped";
    })(),
  );
  check(
    "a missing charge line is caught",
    checkChargeLines(entity("x", ["+2 to All Skills"]), chargeSpec)[0]?.rule ===
      "charge-line-missing",
  );

  // -- skill tabs ----------------------------------------------------------
  const tabs = { 6: "Curses", 7: "Poison and Bone Skills", 8: "Summoning Skills" };
  const oneTab = [
    { kind: "runeword" as const, slug: "y", tab: 7, tabName: "Poison and Bone Skills", min: 3, max: 3 },
  ];
  check(
    "the correct skill-tab line passes",
    checkSkillTabLines(entity("y", ["+3 to Poison and Bone Skills (Necromancer Only)"]), oneTab, tabs)
      .length === 0,
  );
  check(
    "a tab index read as a skill id is caught",
    checkSkillTabLines(
      entity("y", ["+3 to Poison and Bone Skills"]),
      [{ ...oneTab[0], tabName: "Bone Armor" }],
      tabs,
    )[0]?.rule === "skilltab-read-as-skill",
  );
  check(
    "a missing tab line is caught",
    checkSkillTabLines(entity("y", ["+3 to All Skills"]), oneTab, tabs)[0]?.rule ===
      "skilltab-line-missing",
  );

  /*
   * The collapse case, which is the reason this rule exists at all. Arm of
   * King Leoric carries two `skilltab` properties naming two different trees,
   * and publishing only one of them leaves a line that reads as complete.
   */
  const twoTabs = [
    { kind: "unique" as const, slug: "z", tab: 8, tabName: "Summoning Skills", min: 2, max: 2 },
    { kind: "unique" as const, slug: "z", tab: 7, tabName: "Poison and Bone Skills", min: 2, max: 2 },
  ];
  check(
    "two tabs on two lines pass",
    checkSkillTabLines(
      entity("z", ["+2 to Summoning Skills (Necromancer Only)", "+2 to Poison and Bone Skills (Necromancer Only)"]),
      twoTabs,
      tabs,
    ).length === 0,
  );
  check(
    "dropping the second tab is caught",
    checkSkillTabLines(entity("z", ["+2 to Summoning Skills"]), twoTabs, tabs).some(
      (p) => p.rule === "skilltab-line-missing",
    ),
  );
  check(
    "two tabs merged into one line is caught as a collapse",
    checkSkillTabLines(
      entity("z", ["+2 to Summoning Skills and +2 to Poison and Bone Skills"]),
      twoTabs,
      tabs,
    ).some((p) => p.rule === "skilltab-collapsed"),
  );

  // -- rune composition ----------------------------------------------------
  const runeSpec = [{ slug: "w", rune: "Io", contributes: "+10 to Vitality" }];
  check(
    "a runeword carrying its rune's mod passes",
    checkRuneComposition(entity("w", ["+20% Faster Cast Rate", "+10 to Vitality"]), runeSpec)
      .length === 0,
  );
  check(
    "a runeword transcribed without its rune mods is caught",
    checkRuneComposition(entity("w", ["+20% Faster Cast Rate"]), runeSpec)[0]?.rule ===
      "rune-mod-absent",
  );
  check(
    "a control naming an entity that does not exist is caught",
    checkRuneComposition(entity("w", []), [{ ...runeSpec[0], slug: "absent" }])[0]?.rule ===
      "column-entity-missing",
  );
}

// ===========================================================================
console.log("\nPhysical damage — the Druid's half of the elemental tree");
// ===========================================================================
{
  /*
   * Tornado's real row: 25-35 at HitShift 8, growing 8 a level through the
   * first band. Written out rather than imported so a change to the graph moves
   * the assertion and is seen, instead of the assertion following it.
   */
  const tornado = {
    physical: {
      hitShift: 8,
      min: { base: 25, bands: [8, 14, 20, 24, 28] },
      max: { base: 35, bands: [8, 15, 21, 25, 29] },
    },
  } as const;

  check("a physical-only node has no elemental damage to read", damageAtLevel(
    { ...tornado, requiredLevel: 24, maxLevel: 20 } as unknown as SkillGraphNode,
    1,
  ) === undefined);

  check("physical damage at level 1 is the base", (() => {
    const d = physicalAtLevel(tornado, 1);
    return d?.min === 25 && d?.max === 35;
  })());

  /*
   * Level 9 is the first level of the second band, so it is the level a
   * boundary error moves. Eight levels of the first band (2-8 inclusive, seven
   * of them) plus one of the second: 25 + 7*8 + 14 = 95.
   */
  check("physical damage crosses the first band boundary at level 9", (() => {
    const d = physicalAtLevel(tornado, 9);
    return d?.min === 95 && d?.max === 106;
  })());

  // The mutation: a table whose bands are all zero must not still climb.
  check("a mutated node with no bands stops growing", (() => {
    const flat = { physical: { ...tornado.physical, min: { base: 25, bands: [0, 0, 0, 0, 0] }, max: { base: 35, bands: [0, 0, 0, 0, 0] } } };
    return physicalAtLevel(flat, 20)?.min === 25;
  })());

  /*
   * HitShift is not decoration. Twister's 12 at HitShift 7 is the 6 the game
   * shows; reading the column raw doubles the class's stun skill.
   */
  check("HitShift halves a physical table below 8", (() => {
    const twister = { physical: { hitShift: 7, min: { base: 12, bands: [7, 11, 15, 18, 21] }, max: { base: 16, bands: [7, 11, 15, 18, 21] } } };
    const d = physicalAtLevel(twister, 1);
    return d?.min === 6 && d?.max === 8;
  })());

  check("a node with no physical table returns nothing", physicalAtLevel({}, 12) === undefined);

  /*
   * The presentation bug this slice fixes. Before `physical` was read,
   * `damagePresentation` saw no elemental table on Tornado, found it was not an
   * attack either, and answered "none" -- a page telling the reader the class's
   * best skill deals no damage.
   */
  check(
    "a spell with only a physical table presents a table",
    damagePresentation({ kind: "spell" }, tornado) === "table",
  );
  check(
    "a spell with neither table still presents none",
    damagePresentation({ kind: "spell" }, {}) === "none",
  );
  check(
    "an authored model still outranks both tables",
    damagePresentation({ kind: "attack", damageModel: "weapon-plus-element" }, tornado) ===
      "weapon-plus-element",
  );
}

// ===========================================================================
console.log("\nMinion counts — the shape the Druid's wolves and ravens use");
// ===========================================================================
{
  // Raven: min(lvl, par2) with par2 = 5. One per level to a ceiling of five.
  const raven = petMaxFromColumn("min(lvl,par2)", "Raven petmax", (n) => (n === 2 ? 5 : 0));
  check(
    "min(lvl, parN) reads its ceiling from the row",
    raven.kind === "linear" && raven.base === 1 && raven.perLevel === 1 && raven.cap === 5,
  );

  // The ceiling is a parameter, so a different row gives a different ceiling.
  const direWolf = petMaxFromColumn("min(lvl,par3)", "Summon Dire Wolf petmax", (n) =>
    n === 3 ? 3 : 0,
  );
  check(
    "...and a different parameter gives a different ceiling",
    direWolf.kind === "linear" && direWolf.cap === 3,
  );

  // The mutation: without a reader the ceiling would have to be invented.
  check("the shape refuses when no parameter reader is supplied", (() => {
    try {
      petMaxFromColumn("min(lvl,par2)", "Raven petmax");
      return false;
    } catch {
      return true;
    }
  })());

  // The shapes already in use must keep working unchanged.
  check("the plain `lvl` shape is untouched", (() => {
    const revive = petMaxFromColumn("lvl", "Revive petmax");
    return revive.kind === "linear" && revive.base === 1 && revive.perLevel === 1 && revive.cap === undefined;
  })());
  check("an unknown shape still refuses", (() => {
    try {
      petMaxFromColumn("min(lvl,7)", "made up");
      return false;
    } catch {
      return true;
    }
  })());
}

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
