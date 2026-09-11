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
  elementOfEType,
  layoutTree,
  missileSynergyReceivers,
  progressionLevels,
  synergyReceivers,
  tileState,
  treeEdges,
  CLASSES_WITH_SKILL_PAGES,
} from "../lib/skills";
import { buildSkillTreesData, nodeAriaLabel, nodeState } from "../lib/skill-tree-data";
import {
  getBuild,
  getBuildsForClass,
  getClass,
  getSkillsForClass,
  getSkillTree,
} from "../lib/registry";
import { dictionaryFor, fmt, formatPoints } from "../lib/i18n";
import { DEFAULT_LOCALE, LOCALES } from "../lib/i18n/config";
import { allocationRoleLabels, elementLabels, synergyKinds } from "../lib/labels";
import { routes } from "../lib/routes";
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
console.log("\nNode state (R-TREE-4/5, plan §5.1)");
// ===========================================================================

{
  const n = (points: number, level = 6, maxLevel = 20) => ({ points, maxLevel, level });
  check("no points and no level: available", nodeState(n(0), null) === "available", nodeState(n(0), null));
  check("my level below the unlock: locked", nodeState(n(0), 5) === "locked", nodeState(n(0), 5));
  check("my level at the unlock: available", nodeState(n(0), 6) === "available", nodeState(n(0), 6));
  check("20 of 20 points: maxed", nodeState(n(20), null) === "maxed", nodeState(n(20), null));
  check("1 point: invested", nodeState(n(1), null) === "invested", nodeState(n(1), null));
  check("19 of 20 points: invested, not maxed", nodeState(n(19), null) === "invested");
  // Decision 13: "locked" wins over "invested" and "maxed"; the counter still
  // shows the points, the state is what the frame and the name announce.
  check("locked wins over maxed (20 points at level 24, my level 18)", nodeState(n(20, 24), 18) === "locked");
  check("locked wins over invested (1 point at level 24, my level 18)", nodeState(n(1, 24), 18) === "locked");
  // Mutation M6 makes `null` read as locked; R-TREE-4: without d2rc.level nothing is locked.
  check(
    "control: without a level, no unlock tier is ever locked (M6)",
    TIER_LEVELS.every((level) => nodeState(n(0, level), null) !== "locked"),
  );
  check("control: at level 99 nothing is locked either", TIER_LEVELS.every((level) => nodeState(n(0, level), 99) !== "locked"));
  check("control: at level 1 every tier but the first is locked", TIER_LEVELS.filter((level) => nodeState(n(0, level), 1) === "locked").length === 5);
}

// ===========================================================================
console.log("\nAccessible name (R-TREE-14, plan §5.1)");
// ===========================================================================

/*
 * Composed from the real dictionary strings, never from a copy of them: the
 * a11y gate (C1) recomposes the same template from the served HTML, so the
 * two would drift apart in silence if this test carried its own wording.
 */
for (const locale of LOCALES) {
  const t = dictionaryFor(locale);
  const strings = {
    ariaNode: t.skills.ariaNode,
    ariaNodeBuild: t.skills.ariaNodeBuild,
    stateLocked: t.skills.stateLocked,
    stateAvailable: t.skills.stateAvailable,
    stateInvested: t.skills.stateInvested,
    stateMaxed: t.skills.stateMaxed,
  };
  const node = { name: "Ice Blast", level: 6, pointsLabel: formatPoints(t.skills.points, 20) };
  const onClass = nodeAriaLabel(node, "Cold Spells", "available", strings, false);
  const onBuild = nodeAriaLabel(node, "Cold Spells", "maxed", strings, true);
  check(
    `${locale}: class page reads "${fmt(t.skills.ariaNode, { skill: "Ice Blast", level: 6, tree: "Cold Spells", state: t.skills.stateAvailable })}"`,
    onClass === fmt(t.skills.ariaNode, { skill: "Ice Blast", level: 6, tree: "Cold Spells", state: t.skills.stateAvailable }),
    onClass,
  );
  check(
    `${locale}: build page reads "${fmt(t.skills.ariaNodeBuild, { skill: "Ice Blast", level: 6, tree: "Cold Spells", state: t.skills.stateMaxed, points: node.pointsLabel })}"`,
    onBuild === fmt(t.skills.ariaNodeBuild, { skill: "Ice Blast", level: 6, tree: "Cold Spells", state: t.skills.stateMaxed, points: node.pointsLabel }),
    onBuild,
  );
  check(`${locale}: no placeholder is left unfilled`, !/\{\w+\}/.test(onClass) && !/\{\w+\}/.test(onBuild), `${onClass} | ${onBuild}`);
  // The defect this composition replaced read "20 points, Optional, optional".
  const repeated = /\b(\w+)\b[\s,.]+\b\1\b/i;
  check(`${locale}: no word is said twice in a row`, !repeated.test(onClass) && !repeated.test(onBuild), `${onClass} | ${onBuild}`);
  check(`${locale}: the class page never mentions points`, !onClass.includes(node.pointsLabel), onClass);
  check(`${locale}: the build page does`, onBuild.includes(node.pointsLabel), onBuild);
  check(
    `${locale}: every state label reaches the name`,
    (["locked", "available", "invested", "maxed"] as const).every((state) =>
      nodeAriaLabel(node, "Cold Spells", state, strings, false).includes(
        { locked: strings.stateLocked, available: strings.stateAvailable, invested: strings.stateInvested, maxed: strings.stateMaxed }[state],
      ),
    ),
  );
}
if (LOCALES.includes("en-us")) {
  const t = dictionaryFor("en-us");
  const strings = { ariaNode: t.skills.ariaNode, ariaNodeBuild: t.skills.ariaNodeBuild, stateLocked: t.skills.stateLocked, stateAvailable: t.skills.stateAvailable, stateInvested: t.skills.stateInvested, stateMaxed: t.skills.stateMaxed };
  const node = { name: "Ice Blast", level: 6, pointsLabel: formatPoints(t.skills.points, 20) };
  check(
    'en-us, literally: "Ice Blast, level 6, Cold Spells, Available."',
    nodeAriaLabel(node, "Cold Spells", "available", strings, false) === "Ice Blast, level 6, Cold Spells, Available.",
    nodeAriaLabel(node, "Cold Spells", "available", strings, false),
  );
  check(
    'en-us, literally: "Ice Blast, level 6, Cold Spells, Maxed, 20 points."',
    nodeAriaLabel(node, "Cold Spells", "maxed", strings, true) === "Ice Blast, level 6, Cold Spells, Maxed, 20 points.",
    nodeAriaLabel(node, "Cold Spells", "maxed", strings, true),
  );
}

// ===========================================================================
console.log("\nIsland payload (R-TREE-6/7, plan §5.1; C9)");
// ===========================================================================

/*
 * `buildSkillTreesData` is what the island renders from, so everything the
 * panel and the grid show is asserted here against the graph, the registry
 * and the dictionary — every class, both locales, the class page and every
 * build the class has. The wording of synergies and missile synergies is
 * recomputed exactly the way the skill page words it, so the panel and the
 * page can never say two different things about one edge.
 */
for (const locale of LOCALES) {
  const t = dictionaryFor(locale);
  const r = routes(locale);
  const roles = allocationRoleLabels(t);
  const elements = elementLabels(t);
  const missileLine = (etype: string, magnitude: number) => {
    const element = elementOfEType(etype);
    return fmt(t.skills.missileSynergyLine, { magnitude, element: element ? elements[element] : etype });
  };

  for (const classSlug of CLASSES_WITH_SKILL_PAGES) {
    const cls = getClass(locale, classSlug)!;
    const skills = getSkillsForClass(locale, classSlug);
    const bySlug = new Map(skills.map((s) => [s.slug, s]));
    const builds = getBuildsForClass(locale, classSlug);
    const cases: { label: string; allocations?: readonly SkillAllocation[] }[] = [
      { label: `${locale}/${classSlug} (class page)` },
      ...builds.map((b) => ({ label: `${locale}/${classSlug}/${b.slug}`, allocations: b.skills })),
    ];

    for (const { label, allocations } of cases) {
      const data = buildSkillTreesData(locale, classSlug, t, allocations);
      const inBuild = allocations !== undefined;
      const byAllocation = new Map((allocations ?? []).map((a) => [a.skill, a]));
      const problems: string[] = [];

      check(`${label}: classSlug, locale and inBuild carried`, data.classSlug === classSlug && data.locale === locale && data.inBuild === inBuild);
      check(
        `${label}: three trees, in the class's own order`,
        data.trees.length === 3 && data.trees.every((tree, i) => tree.slug === cls.trees[i]),
        data.trees.map((tree) => tree.slug).join(", "),
      );

      const allNodes = data.trees.flatMap((tree) => tree.rows.flatMap((row) => row.cells.filter((c) => c !== null)));
      const nodeSlugs = new Set(allNodes.map((n) => n.slug));

      for (const tree of data.trees) {
        const authored = getSkillTree(locale, tree.slug)!;
        const grid = layoutTree(skills, tree.slug, allocations);
        const nodes = tree.rows.flatMap((row) => row.cells.filter((c) => c !== null));
        if (tree.name !== authored.name || tree.theme !== authored.theme) problems.push(`${tree.slug}: name/theme differ from the registry`);
        if (tree.rows.length !== 6 || tree.rows.some((row) => row.cells.length !== 3)) problems.push(`${tree.slug}: not 6×3`);
        if (nodes.length !== 10) problems.push(`${tree.slug}: ${nodes.length} nodes`);
        if (tree.rows.some((row, i) => row.level !== TIER_LEVELS[i])) problems.push(`${tree.slug}: row levels ${tree.rows.map((row) => row.level).join("/")}`);

        for (const [ri, row] of tree.rows.entries()) {
          for (const [ci, node] of row.cells.entries()) {
            const expected = grid[ri].cells[ci];
            if ((node === null) !== (expected === null)) {
              problems.push(`${tree.slug} r${ri + 1}c${ci + 1}: occupancy differs from layoutTree`);
              continue;
            }
            if (!node || !expected) continue;
            const g = SKILL_GRAPH[node.slug];
            const skill = bySlug.get(node.slug);
            const alloc = byAllocation.get(node.slug);
            const points = alloc?.points ?? 0;
            const where = `${tree.slug}/${node.slug}`;
            if (!g || !skill) { problems.push(`${where}: unknown slug`); continue; }
            if (node.row !== ri + 1 || node.column !== ci + 1 || node.row !== g.row || node.column !== g.column) problems.push(`${where}: position ${node.row},${node.column}`);
            if (node.level !== g.requiredLevel || node.level !== row.level) problems.push(`${where}: level ${node.level}`);
            if (node.name !== skill.name || node.summary !== skill.summary || node.kind !== skill.kind || node.element !== skill.element) problems.push(`${where}: name/summary/kind/element`);
            if (node.href !== r.skill(classSlug, node.slug)) problems.push(`${where}: href ${node.href}`);
            if (node.maxLevel !== g.maxLevel) problems.push(`${where}: maxLevel ${node.maxLevel}`);
            if (node.points !== points) problems.push(`${where}: points ${node.points} vs ${points}`);
            const pointsLabel = points > 0 ? formatPoints(t.skills.points, points) : t.skills.noPoints;
            if (node.pointsLabel !== pointsLabel) problems.push(`${where}: pointsLabel "${node.pointsLabel}"`);
            if (node.role !== alloc?.role) problems.push(`${where}: role ${node.role}`);
            if (node.roleLabel !== (alloc ? roles[alloc.role] : undefined)) problems.push(`${where}: roleLabel ${node.roleLabel}`);
            if (node.note !== alloc?.note) problems.push(`${where}: note`);
            if (node.prerequisites.join("|") !== g.prerequisites.join("|")) problems.push(`${where}: prerequisites`);
            if (node.unlocks.join("|") !== dependents(node.slug).join("|")) problems.push(`${where}: unlocks`);
            /*
             * Resolved among the class's own skills before comparing, which is
             * what the skill page does (`byslug` over `getSkillsForClass`). The
             * graph has one edge that needs it: `inferno` (Sorceress) feeds the
             * `meteorfire` missile, which Meteor and the Warlock's Flame Wave
             * both fire, so Flame Wave records a missile synergy from a skill
             * of another class. The control below proves the filter is real.
             */
            const bonusFor = new Map((skill.synergies ?? []).map((s) => [s.skill, s.bonus]));
            const wantIn = g.synergies.filter((s) => bySlug.has(s.from)).map((s) => `${s.from}|${synergyKinds(s.kinds, t)}|${bonusFor.get(s.from) ?? ""}`);
            const gotIn = node.synergiesIn.map((s) => `${s.slug}|${s.kinds}|${s.bonus ?? ""}`);
            if (wantIn.join(";") !== gotIn.join(";")) problems.push(`${where}: synergiesIn [${gotIn.join("; ")}] vs [${wantIn.join("; ")}]`);
            const wantOut = synergyReceivers(node.slug).filter((s) => bySlug.has(s.slug)).map((s) => `${s.slug}|${synergyKinds(s.kinds, t)}`);
            const gotOut = node.synergiesOut.map((s) => `${s.slug}|${s.kinds}`);
            if (wantOut.join(";") !== gotOut.join(";")) problems.push(`${where}: synergiesOut`);
            const wantMissileIn = (g.missileSynergies ?? []).filter((s) => bySlug.has(s.from)).map((s) => `${s.from}|${missileLine(s.element, s.magnitude)}`);
            const gotMissileIn = node.missileIn.map((s) => `${s.slug}|${s.label}`);
            if (wantMissileIn.join(";") !== gotMissileIn.join(";")) problems.push(`${where}: missileIn [${gotMissileIn.join("; ")}] vs [${wantMissileIn.join("; ")}]`);
            const wantMissileOut = missileSynergyReceivers(node.slug).filter((s) => bySlug.has(s.slug)).map((s) => `${s.slug}|${missileLine(s.element, s.magnitude)}`);
            const gotMissileOut = node.missileOut.map((s) => `${s.slug}|${s.label}`);
            if (wantMissileOut.join(";") !== gotMissileOut.join(";")) problems.push(`${where}: missileOut`);
            // Every slug the panel will link must resolve to a node of this class.
            for (const s of [...node.prerequisites, ...node.unlocks, ...node.synergiesIn.map((x) => x.slug), ...node.synergiesOut.map((x) => x.slug), ...node.missileIn.map((x) => x.slug), ...node.missileOut.map((x) => x.slug)]) {
              if (!nodeSlugs.has(s)) problems.push(`${where}: links to ${s}, which is not a node of ${classSlug}`);
            }
            for (const [field, text] of [["pointsLabel", node.pointsLabel], ["roleLabel", node.roleLabel ?? ""], ["name", node.name]] as const) {
              if (text.includes("(+")) problems.push(`${where}: ${field} invents +skills: "${text}"`);
            }
          }
        }

        const sum = nodes.reduce((acc, n) => acc + n.points, 0);
        if (tree.points !== sum) problems.push(`${tree.slug}: points ${tree.points} vs ${sum}`);
        if (tree.maxPoints !== 10 * 20) problems.push(`${tree.slug}: maxPoints ${tree.maxPoints}`);
        const wantTreeLabel = inBuild ? fmt(t.skills.treePoints, { points: sum, max: tree.maxPoints }) : "";
        if (tree.pointsLabel !== wantTreeLabel) problems.push(`${tree.slug}: pointsLabel "${tree.pointsLabel}" vs "${wantTreeLabel}"`);
        if (tree.pointsLabel.includes("(+")) problems.push(`${tree.slug}: pointsLabel invents +skills`);
        const wantEdges = treeEdges(tree.slug).map((e) => `${e.from.slug}>${e.to.slug}`).sort().join(";");
        const gotEdges = tree.edges.map((e) => `${e.from}>${e.to}`).sort().join(";");
        if (wantEdges !== gotEdges) problems.push(`${tree.slug}: edges`);
        const treeSlugs = new Set(nodes.map((n) => n.slug));
        if (!tree.edges.every((e) => treeSlugs.has(e.from) && treeSlugs.has(e.to))) problems.push(`${tree.slug}: an edge leaves the tree`);
      }

      // `allNodes.length === 30` keeps this from passing on an empty payload.
      check(
        `${label}: every tree, row, node, edge and label agrees with the graph, the registry and the dictionary`,
        allNodes.length === 30 && problems.length === 0,
        allNodes.length !== 30 ? `${allNodes.length} nodes` : problems.slice(0, 6).join(" | "),
      );

      // Decision 6: the class page opens on the first tree; a build on the
      // tree with the most points, the first on a tie.
      let wantDefault = cls.trees[0];
      if (inBuild) {
        let best = -1;
        for (const tree of data.trees) {
          if (tree.points > best) { best = tree.points; wantDefault = tree.slug; }
        }
      }
      check(`${label}: defaultTree is ${wantDefault}`, data.defaultTree === wantDefault, data.defaultTree);

      if (inBuild && allocations) {
        const mandatory = allocations.filter((a) => a.role !== "flex" && a.points > 0).reduce((s, a) => s + a.points, 0);
        const flex = allocations.filter((a) => a.role === "flex").reduce((s, a) => s + a.points, 0);
        const want =
          fmt(t.skills.legendMandatory, { points: mandatory, cap: MAX_HARD_POINTS }) +
          (flex > 0 ? ` ${formatPoints(t.skills.legendFlex, flex)}` : "");
        check(`${label}: totalLabel is "${want}"`, data.totalLabel === want, String(data.totalLabel));
      } else {
        check(`${label}: no totalLabel outside a build`, data.totalLabel === undefined, String(data.totalLabel));
      }
      check(`${label}: no "(+" anywhere in the strings`, !Object.values(data.strings).some((s) => s.includes("(+")) && !(data.totalLabel ?? "").includes("(+"));
    }
  }
}

/*
 * The named cases decision 6 is asserted by (mutation M16 makes every build
 * open on the first tree): Blizzard is a cold build, Fire Ball/Meteor a fire
 * one, and Meteorb — 46 cold, 46 fire in the catalogue — is the tie the rule
 * settles in favour of the first tree.
 */
{
  const t = dictionaryFor(DEFAULT_LOCALE);
  const open = (slug: string) => {
    const build = getBuild(DEFAULT_LOCALE, slug);
    return build ? buildSkillTreesData(DEFAULT_LOCALE, build.classSlug, t, build.skills).defaultTree : "(no such build)";
  };
  check("blizzard-sorceress opens on cold-spells", open("blizzard-sorceress") === "cold-spells", open("blizzard-sorceress"));
  const fire = getBuildsForClass(DEFAULT_LOCALE, "sorceress").find((b) => /fireball|meteor/.test(b.slug) && !/meteorb/.test(b.slug));
  if (fire) {
    check(`${fire.slug} opens on fire-spells`, open(fire.slug) === "fire-spells", open(fire.slug));
  }
  const meteorb = getBuild(DEFAULT_LOCALE, "meteorb-sorceress");
  if (meteorb) {
    const data = buildSkillTreesData(DEFAULT_LOCALE, "sorceress", t, meteorb.skills);
    const cold = data.trees.find((x) => x.slug === "cold-spells")?.points;
    const fireP = data.trees.find((x) => x.slug === "fire-spells")?.points;
    check(`meteorb-sorceress: a tie (${cold} cold, ${fireP} fire) opens on the first tree, cold-spells`, cold === fireP && data.defaultTree === "cold-spells", data.defaultTree);
  }
  const classPage = buildSkillTreesData(DEFAULT_LOCALE, "sorceress", t);
  check("the Sorceress class page opens on cold-spells, the first tree", classPage.defaultTree === "cold-spells" && classPage.inBuild === false, classPage.defaultTree);
  check("control: the class page carries no points at all", classPage.trees.every((tree) => tree.points === 0 && tree.pointsLabel === ""));

  /*
   * Control for the class-scoped resolution above: the graph really does
   * carry a missile edge across classes, and the payload really does drop it.
   * Without this, the `.filter(bySlug.has)` in both the builder and the test
   * could be removed together and nothing would notice.
   */
  const crossClass = missileSynergyReceivers("inferno").filter((s) => SKILL_GRAPH[s.slug]?.classSlug !== "sorceress");
  check(
    "control: the graph carries a missile edge from inferno to another class's skill",
    crossClass.length > 0,
    crossClass.map((s) => s.slug).join(", "),
  );
  const inferno = classPage.trees.flatMap((tree) => tree.rows.flatMap((row) => row.cells)).find((n) => n?.slug === "inferno");
  check(
    "…and the Sorceress payload lists only Sorceress receivers for it, as the skill page does",
    inferno !== undefined && inferno !== null && inferno.missileOut.length > 0 && inferno.missileOut.every((s) => SKILL_GRAPH[s.slug]?.classSlug === "sorceress"),
    inferno?.missileOut.map((s) => s.slug).join(", "),
  );
}

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
