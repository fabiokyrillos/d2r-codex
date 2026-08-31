/**
 * Tests for the skill tree's layout and state derivation.
 *
 * These cover the things a rendering bug would quietly get wrong: a skill
 * landing in the wrong cell, two skills colliding in one cell, an optional
 * allocation reading as mandatory, or a damage figure that looks plausible and
 * is not.
 *
 * Run with `npm run test:tree`.
 */
import {
  MAX_HARD_POINTS,
  SKILL_GRAPH,
  TIER_LEVELS,
  damageAtLevel,
  dependents,
  layoutTree,
  progressionLevels,
  tileState,
  treeEdges,
} from "../lib/skills";
import { getBuild, getClass, getSkillsForClass } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import type { SkillAllocation } from "../lib/types";

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

const alloc = (
  skill: string,
  points: number,
  role: SkillAllocation["role"],
): SkillAllocation => ({ skill, points, role });

const paladin = getClass(DEFAULT_LOCALE, "paladin")!;
const skills = getSkillsForClass(DEFAULT_LOCALE, "paladin");

// ===========================================================================
console.log("\nLayout");
// ===========================================================================

check("the Paladin has three trees", paladin.trees.length === 3, paladin.trees.join(", "));

for (const tree of paladin.trees) {
  const grid = layoutTree(skills, tree);

  check(`${tree}: six rows`, grid.length === 6, `${grid.length}`);
  check(
    `${tree}: every row has three cells`,
    grid.every((r) => r.cells.length === 3),
  );
  check(
    `${tree}: row N carries tier level ${TIER_LEVELS.join("/")}`,
    grid.every((r, i) => r.level === TIER_LEVELS[i]),
  );

  const filled = grid.flatMap((r) => r.cells.filter((c) => c !== null));
  check(`${tree}: ten skills`, filled.length === 10, `${filled.length}`);
  check(
    `${tree}: every skill sits in the row matching its unlock level`,
    filled.every((c) => TIER_LEVELS[c!.node.row - 1] === c!.node.requiredLevel),
  );

  // A collision would silently drop a skill: two skills in one cell means the
  // second overwrites the first and the tree renders nine.
  const cells = new Set(filled.map((c) => `${c!.node.row}:${c!.node.column}`));
  check(`${tree}: no two skills share a cell`, cells.size === filled.length);

  const edges = treeEdges(tree);
  check(
    `${tree}: every edge stays inside the tree`,
    edges.every(
      (e) => SKILL_GRAPH[e.from.slug]?.tree === tree && SKILL_GRAPH[e.to.slug]?.tree === tree,
    ),
  );
  check(
    `${tree}: every edge runs from a lower row to a higher one`,
    edges.every((e) => e.from.row < e.to.row),
    edges.filter((e) => e.from.row >= e.to.row).map((e) => `${e.from.slug}->${e.to.slug}`).join(", "),
  );
}

// ===========================================================================
console.log("\nTile state");
// ===========================================================================

check("20 points reads as maxed", tileState(alloc("x", 20, "main"), 20) === "maxed");
check("mid investment reads as invested", tileState(alloc("x", 12, "main"), 20) === "invested");
check("one utility point reads as one-point", tileState(alloc("x", 1, "utility"), 20) === "one-point");
check("a prerequisite reads as prerequisite", tileState(alloc("x", 1, "prerequisite"), 20) === "prerequisite");
check("a synergy reads as synergy", tileState(alloc("x", 1, "synergy"), 20) === "synergy");
check("an absent allocation reads as unused", tileState(undefined, 20) === "unused");
check("zero points reads as unused", tileState(alloc("x", 0, "main"), 20) === "unused");

// The rule that matters most: an optional allocation must never look
// mandatory, whatever its size.
check("a 20-point flex allocation reads as optional, not maxed",
  tileState(alloc("x", 20, "flex"), 20) === "flex");
check("a 1-point flex allocation reads as optional",
  tileState(alloc("x", 1, "flex"), 20) === "flex");

// ===========================================================================
console.log("\nBuild integration");
// ===========================================================================

const paladinBuilds = ["hammerdin", "smiter", "zealot", "fohdin", "avenger", "tesladin", "holy-fire-paladin"];
for (const slug of paladinBuilds) {
  const build = getBuild(DEFAULT_LOCALE, slug);
  if (!build) {
    check(`${slug} exists`, false);
    continue;
  }
  const mandatory = build.skills
    .filter((a) => a.role !== "flex" && a.points > 0)
    .reduce((sum, a) => sum + a.points, 0);
  check(
    `${slug}: ${mandatory} mandatory hard points, within ${MAX_HARD_POINTS}`,
    mandatory <= MAX_HARD_POINTS,
    `${mandatory}`,
  );

  // Every allocated skill must land in a cell, or the tree silently omits it.
  const placed = paladin.trees.flatMap((tree) =>
    layoutTree(skills, tree, build.skills)
      .flatMap((r) => r.cells)
      .filter((c) => c !== null)
      .filter((c) => c!.points > 0)
      .map((c) => c!.skill.slug),
  );
  const allocated = build.skills.filter((a) => a.points > 0).map((a) => a.skill);
  const missing = allocated.filter((s) => !placed.includes(s));
  check(`${slug}: every allocated skill appears on a tree`, missing.length === 0, missing.join(", "));
}

// The Hammerdin's Uber variant is the case the brief calls out by name.
{
  const hammerdin = getBuild(DEFAULT_LOCALE, "hammerdin")!;
  const rl = hammerdin.skills.find((a) => a.skill === "resist-lightning");
  check("hammerdin: Resist Lightning is a flex allocation", rl?.role === "flex", rl?.role);
  check("hammerdin: it carries 20 points", rl?.points === 20, `${rl?.points}`);
  check(
    "hammerdin: it renders as optional rather than maxed",
    tileState(rl, SKILL_GRAPH["resist-lightning"].maxLevel) === "flex",
  );
  const mandatory = hammerdin.skills
    .filter((a) => a.role !== "flex" && a.points > 0)
    .reduce((sum, a) => sum + a.points, 0);
  check("hammerdin: 89 mandatory hard points, with the variant excluded", mandatory === 89, `${mandatory}`);
}

// ===========================================================================
console.log("\nDamage progression");
// ===========================================================================

{
  const bh = SKILL_GRAPH["blessed-hammer"];
  check("Blessed Hammer carries damage data", bh.damage !== undefined);
  const l1 = damageAtLevel(bh, 1);
  const l20 = damageAtLevel(bh, 20);
  // Banded growth: +8/level to 8, then +10, then +12. Base 12 gives 196 at 20.
  // Modelling it linearly would give 12 + 19*8 = 164, which is the wrong answer.
  check("Blessed Hammer level 1 minimum is its base", l1?.min === 12, `${l1?.min}`);
  check("Blessed Hammer level 20 minimum is 196, not the linear 164", l20?.min === 196, `${l20?.min}`);
  check("damage rises with level", (l20?.max ?? 0) > (l1?.max ?? 0));

  const smite = SKILL_GRAPH["smite"];
  check("Smite has no elemental damage table", damageAtLevel(smite, 20) === undefined);
}

{
  const node = SKILL_GRAPH["blessed-hammer"];
  const levels = progressionLevels(node, [20, 1, 12]);
  check("progression always includes level 1 and the cap",
    levels[0] === 1 && levels[levels.length - 1] === node.maxLevel);
  check("progression includes a build's recommended level", levels.includes(12), levels.join(","));
  check("progression is sorted and unique",
    levels.every((l, i) => i === 0 || l > levels[i - 1]), levels.join(","));
}

// ===========================================================================
console.log("\nGraph traversal");
// ===========================================================================

check(
  "Holy Shield is reported as unlocked by Blessed Hammer",
  dependents("blessed-hammer").includes("holy-shield"),
);
check(
  "Smite unlocks Charge",
  dependents("smite").includes("charge"),
);
check("a leaf skill unlocks nothing", dependents("fist-of-the-heavens").length === 0);

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
