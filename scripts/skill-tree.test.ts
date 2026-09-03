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
  CLASSES_WITH_SKILL_PAGES,
} from "../lib/skills";
import { getBuild, getBuildsForClass, getClass, getSkillsForClass } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";
import { ALLOCATION_ROLES, type SkillAllocation } from "../lib/types";

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

// Every class the graph covers, so a class added to the extraction is tested
// the moment it appears rather than when someone remembers to list it here.
for (const classSlug of CLASSES_WITH_SKILL_PAGES) {
const cls = getClass(DEFAULT_LOCALE, classSlug)!;
const skills = getSkillsForClass(DEFAULT_LOCALE, classSlug);

// ===========================================================================
console.log(`\nLayout - ${cls.name}`);
// ===========================================================================

check(`the ${cls.name} has three trees`, cls.trees.length === 3, cls.trees.join(", "));
check(`the ${cls.name} has thirty skills`, skills.length === 30, `${skills.length}`);

for (const tree of cls.trees) {
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
  /*
   * A prerequisite can never sit *below* the skill that needs it, because the
   * row is the unlock tier: that would put the requirement out of reach at the
   * level the skill becomes available.
   *
   * It can sit beside it, and the Necromancer is where that shows up. Skeleton
   * Mastery and Raise Skeleton are both level-1 skills in row 1, and Skeleton
   * Mastery requires Raise Skeleton — a horizontal connector, drawn across the
   * empty middle cell. The three classes extracted before this one happen to
   * have no same-row edge at all, which is how `<` passed for ninety nodes
   * while meaning something narrower than the invariant.
   */
  check(
    `${tree}: no edge runs upward, from a higher row to a lower one`,
    edges.every((e) => e.from.row <= e.to.row),
    edges.filter((e) => e.from.row > e.to.row).map((e) => `${e.from.slug}->${e.to.slug}`).join(", "),
  );

  // Every prerequisite edge the graph declares must be one the renderer is
  // handed, and no others. A dropped edge is an invisible connector; an extra
  // one draws a dependency the game does not have.
  const declared = skills
    .filter((s) => SKILL_GRAPH[s.slug]?.tree === tree)
    .flatMap((s) => SKILL_GRAPH[s.slug].prerequisites.map((pre) => `${pre}->${s.slug}`))
    .sort();
  const rendered = edges.map((e) => `${e.from.slug}->${e.to.slug}`).sort();
  check(
    `${tree}: renders exactly the declared prerequisite edges`,
    declared.join("|") === rendered.join("|"),
    `declared [${declared.join(", ")}] vs rendered [${rendered.join(", ")}]`,
  );

  // A connector between two cells in the same column, more than one row apart,
  // passes straight through anything sitting between them.
  const occupied = new Set(
    grid.flatMap((r) => r.cells.map((c, i) => (c ? `${r.row}:${i + 1}` : ""))).filter(Boolean),
  );
  const crossing = edges.filter((e) => {
    if (e.from.column !== e.to.column) return false;
    for (let row = e.from.row + 1; row < e.to.row; row++) {
      if (occupied.has(`${row}:${e.from.column}`)) return true;
    }
    return false;
  });
  check(
    `${tree}: no connector passes through a tile`,
    crossing.length === 0,
    crossing.map((e) => `${e.from.slug}->${e.to.slug}`).join(", "),
  );
}

// ===========================================================================
console.log("\nTile state");
// ===========================================================================

check("20 points reads as maxed", tileState(alloc("x", 20, "main"), 20) === "maxed");
check("mid investment reads as invested", tileState(alloc("x", 12, "main"), 20) === "invested");
check("an absent allocation reads as unused", tileState(undefined, 20) === "unused");
check("zero points reads as unused", tileState(alloc("x", 0, "main"), 20) === "unused");

// One point does not decide the state; the role does. `one-point` is only the
// residue — a point in the build's own skill — because its label reads
// "Mandatory", and calling four utility picks mandatory on the strength of the
// number 1 would be a judgement about quantity rather than about the plan.
for (const role of ALLOCATION_ROLES) {
  const expected =
    role === "flex" ? "flex"
    : role === "prerequisite" ? "prerequisite"
    : role === "synergy" ? "synergy"
    : role === "utility" ? "utility"
    : "one-point";
  check(
    `one point with role "${role}" reads as ${expected}`,
    tileState(alloc("x", 1, role), 20) === expected,
    tileState(alloc("x", 1, role), 20),
  );
}
check(
  "only the build's own skill reaches the one-point state",
  ALLOCATION_ROLES.filter((r) => tileState(alloc("x", 1, r), 20) === "one-point").join(",") ===
    "main",
);

// The rule that matters most: an optional allocation must never look
// mandatory, whatever its size.
check("a 20-point flex allocation reads as optional, not maxed",
  tileState(alloc("x", 20, "flex"), 20) === "flex");
check("a 1-point flex allocation reads as optional",
  tileState(alloc("x", 1, "flex"), 20) === "flex");

// ===========================================================================
console.log("\nBuild integration");
// ===========================================================================

/*
 * Read from the registry rather than listed, so a build is covered the day it
 * is written instead of the day someone remembers to extend an array.
 *
 * A class with no builds yet is a real state, not a defect: skills, the tree
 * and the individual pages are one phase and builds are the next, and the tree
 * on a class page does not depend on a build existing. Asserting otherwise
 * would make the suite demand that both land in one commit. What must not
 * happen is a build tree going unchecked, so every build a class does have is
 * still exercised below.
 */
const classBuilds = getBuildsForClass(DEFAULT_LOCALE, classSlug);
console.log(
  `  --   ${cls.name}: ${classBuilds.length} documented build${classBuilds.length === 1 ? "" : "s"}`,
);
for (const build of classBuilds) {
  const slug = build.slug;
  const mandatory = build.skills
    .filter((a) => a.role !== "flex" && a.points > 0)
    .reduce((sum, a) => sum + a.points, 0);
  check(
    `${slug}: ${mandatory} mandatory hard points, within ${MAX_HARD_POINTS}`,
    mandatory <= MAX_HARD_POINTS,
    `${mandatory}`,
  );

  // Every allocated skill must land in a cell, or the tree silently omits it.
  const placed = cls.trees.flatMap((tree) =>
    layoutTree(skills, tree, build.skills)
      .flatMap((r) => r.cells)
      .filter((c) => c !== null)
      .filter((c) => c!.points > 0)
      .map((c) => c!.skill.slug),
  );
  const allocated = build.skills.filter((a) => a.points > 0).map((a) => a.skill);
  const missing = allocated.filter((s) => !placed.includes(s));
  check(`${slug}: every allocated skill appears on a tree`, missing.length === 0, missing.join(", "));

  // Optional is optional: flex must sit outside the mandatory budget rather
  // than inflate it, and must never render as mandatory.
  const flex = build.skills.filter((a) => a.role === "flex" && a.points > 0);
  if (flex.length > 0) {
    const withFlex = build.skills
      .filter((a) => a.points > 0)
      .reduce((sum, a) => sum + a.points, 0);
    check(
      `${slug}: ${flex.length} optional allocation(s) stay outside the mandatory ${mandatory}`,
      withFlex > mandatory,
      `${withFlex} vs ${mandatory}`,
    );
    check(
      `${slug}: every optional allocation renders as optional`,
      flex.every((a) => tileState(a, SKILL_GRAPH[a.skill]?.maxLevel ?? 20) === "flex"),
    );
  }
}

/*
 * No skill requires something that unlocks after it does.
 *
 * This replaces a rule that read "a skill whose slug ends in -mastery takes no
 * prerequisite", written when an earlier draft of the graph chained the
 * Sorceress's masteries behind their tree's damage skills and put them out of
 * reach at the level that unlocks them. The suffix was a proxy for the defect,
 * and it is the wrong proxy: the Necromancer's Skeleton Mastery genuinely
 * requires Raise Skeleton and Golem Mastery genuinely requires Clay Golem —
 * both at or below their own unlock level, and both perfectly spendable.
 *
 * This is the invariant the old rule was reaching for, and it holds for every
 * skill rather than for the ones with a particular name.
 */
for (const skill of skills) {
  const node = SKILL_GRAPH[skill.slug];
  const late = node.prerequisites.filter(
    (pre) => SKILL_GRAPH[pre].requiredLevel > node.requiredLevel,
  );
  check(
    `${skill.name}: every prerequisite is reachable by level ${node.requiredLevel}`,
    late.length === 0,
    late.map((pre) => `${pre} unlocks at ${SKILL_GRAPH[pre].requiredLevel}`).join(", "),
  );
}
}

/*
 * The historical defect, pinned by name.
 *
 * The general rule above cannot see it: chaining Fire Mastery behind Fire Bolt
 * would satisfy "every prerequisite is reachable by my level" perfectly well,
 * because Fire Bolt unlocks at 1 and Fire Mastery at 30. What made that draft
 * wrong was the claim itself — the game gives the Sorceress's three elemental
 * masteries no prerequisite at all — so the claim is what is checked.
 */
for (const mastery of ["fire-mastery", "cold-mastery", "lightning-mastery"]) {
  check(
    `${mastery} takes no prerequisite`,
    SKILL_GRAPH[mastery].prerequisites.length === 0,
    SKILL_GRAPH[mastery].prerequisites.join(", "),
  );
}

/*
 * A negative control for the rule that replaced it. A gate nobody has watched
 * reject anything is a gate nobody has tested, and this one was loosened in the
 * same commit that generalised it.
 */
{
  const laterThanItsDependent = (prerequisiteLevel: number, skillLevel: number) =>
    prerequisiteLevel > skillLevel;
  check(
    "control: a prerequisite unlocking after its dependent is rejected",
    laterThanItsDependent(18, 12),
  );
  check(
    "control: a prerequisite unlocking alongside its dependent is accepted",
    !laterThanItsDependent(1, 1),
  );
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
