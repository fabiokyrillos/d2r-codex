/**
 * Builds the island's payload for one class: three trees, ten nodes each,
 * with everything the panel needs already resolved and worded.
 *
 * Server-only by nature — it reads the registry, the generated graph and the
 * dictionary — and never imported by a `"use client"` file. The types and the
 * two pure functions the island shares live in `lib/skill-tree-data-pure.ts`
 * and are re-exported here for the server side.
 *
 * Phase 4 plan §5.1; `scripts/skill-tree.test.ts` holds it to the contract.
 */
import { fmt, formatPoints, type Dictionary, type Locale } from "@/lib/i18n";
import { allocationRoleLabels, elementLabels, synergyKinds } from "@/lib/labels";
import { getClass, getSkillsForClass, getSkillTree } from "@/lib/registry";
import { routes } from "@/lib/routes";
import {
  MAX_HARD_POINTS,
  dependents,
  elementOfEType,
  layoutTree,
  missileSynergyReceivers,
  synergyReceivers,
  treeEdges,
} from "@/lib/skills";
import type { SkillAllocation, Slug } from "@/lib/types";

import {
  type SkillTreesData,
  type SkillTreesStrings,
  type TreeData,
  type TreeNodeData,
} from "@/lib/skill-tree-data-pure";

export * from "@/lib/skill-tree-data-pure";

/** Every string the island needs, read once from the dictionary. */
export function skillTreesStrings(t: Dictionary): SkillTreesStrings {
  const s = t.skills;
  return {
    treeLabel: s.treeLabel,
    treeHint: s.treeHint,
    rowLabel: s.rowLabel,
    emptyCell: s.emptyCell,
    panelHeading: s.panelHeading,
    panelEmpty: s.panelEmpty,
    closePanel: s.closePanel,
    fullPage: s.fullPage,
    ariaNode: s.ariaNode,
    ariaNodeBuild: s.ariaNodeBuild,
    stateLocked: s.stateLocked,
    stateAvailable: s.stateAvailable,
    stateInvested: s.stateInvested,
    stateMaxed: s.stateMaxed,
    announceSelected: s.announceSelected,
    treesLabel: s.treesLabel,
    treePoints: s.treePoints,
    treePointsShort: s.treePointsShort,
    treeThemeSummary: s.treeThemeSummary,
    levelLabel: s.levelLabel,
    levelHelp: s.levelHelp,
    levelClear: s.levelClear,
    levelClearLabel: s.levelClearLabel,
    levelInvalid: s.levelInvalid,
    legendTitle: s.legendTitle,
    legendLocked: s.legendLocked,
    legendAvailable: s.legendAvailable,
    legendInvested: s.legendInvested,
    legendMaxed: s.legendMaxed,
    legendOptional: s.legendOptional,
    legendConnector: s.legendConnector,
    legendKeyboard: s.legendKeyboard,
    legendHardPoints: s.legendHardPoints,
    placeholderNote: s.placeholderNote,
    prerequisitesTitle: s.prerequisitesTitle,
    prerequisitesNone: s.prerequisitesNone,
    unlocksTitle: s.unlocksTitle,
    unlocksNone: s.unlocksNone,
    unlocksValue: s.unlocksValue,
    synergiesTitle: s.synergiesTitle,
    synergiesNone: s.synergiesNone,
    feedsTitle: s.feedsTitle,
    panelPoints: s.panelPoints,
  };
}

/**
 * The island's payload for one class, with this build's hard points when
 * `allocations` is given.
 *
 * Everything the panel says is resolved and worded here, once, exactly as the
 * skill page words it — `synergyKinds` for what a synergy improves,
 * `missileSynergyLine` with the element read off the missile's own row — so
 * the panel and the page can never disagree about one edge. Both synergy
 * directions come from the graph; authored content supplies only the bonus
 * magnitude, looked up by source slug (`app/.../skills/[skillSlug]/page.tsx`).
 *
 * Points are base points and nothing else: `pointsLabel` is `formatPoints` or
 * `noPoints`, never "20 (+5)" — R-TREE-6 keeps +skills off every surface but
 * a panel of a build that declares a bonus, and no build does.
 *
 * `defaultTree` is decided here, server side (plan decision 6), because the
 * pre-hydration stylesheet needs it in the HTML: the first tree on a class
 * page, the most-invested one on a build, the first on a tie.
 */
export function buildSkillTreesData(
  locale: Locale,
  classSlug: Slug,
  t: Dictionary,
  allocations?: readonly SkillAllocation[],
): SkillTreesData {
  const cls = getClass(locale, classSlug);
  const skills = getSkillsForClass(locale, classSlug);
  const r = routes(locale);
  const inBuild = allocations !== undefined;
  const roles = allocationRoleLabels(t);
  const elements = elementLabels(t);
  const bySlug = new Map(skills.map((s) => [s.slug, s]));
  const known = (slug: string) => bySlug.has(slug);

  const missileLine = (etype: string, magnitude: number) => {
    const element = elementOfEType(etype);
    return fmt(t.skills.missileSynergyLine, {
      magnitude,
      element: element ? elements[element] : etype,
    });
  };

  const trees: TreeData[] = [];
  for (const treeSlug of cls?.trees ?? []) {
    const tree = getSkillTree(locale, treeSlug);
    if (!tree) continue;
    const grid = layoutTree(skills, treeSlug, allocations);
    const rows = grid.map((row) => ({
      level: row.level,
      cells: row.cells.map((cell): TreeNodeData | null => {
        if (!cell) return null;
        const { skill, node: g } = cell;
        const bonusFor = new Map((skill.synergies ?? []).map((s) => [s.skill, s.bonus]));
        const data: TreeNodeData = {
          slug: skill.slug,
          name: skill.name,
          href: r.skill(classSlug, skill.slug),
          row: g.row,
          column: g.column,
          level: g.requiredLevel,
          kind: skill.kind,
          summary: skill.summary,
          points: cell.points,
          maxLevel: g.maxLevel,
          pointsLabel: cell.points > 0 ? formatPoints(t.skills.points, cell.points) : t.skills.noPoints,
          prerequisites: [...g.prerequisites],
          unlocks: dependents(skill.slug),
          synergiesIn: g.synergies
            .filter((s) => known(s.from))
            .map((s) => {
              const bonus = bonusFor.get(s.from);
              return bonus === undefined
                ? { slug: s.from, kinds: synergyKinds(s.kinds, t) }
                : { slug: s.from, kinds: synergyKinds(s.kinds, t), bonus };
            }),
          synergiesOut: synergyReceivers(skill.slug)
            .filter((s) => known(s.slug))
            .map((s) => ({ slug: s.slug, kinds: synergyKinds(s.kinds, t) })),
          missileIn: (g.missileSynergies ?? [])
            .filter((s) => known(s.from))
            .map((s) => ({ slug: s.from, label: missileLine(s.element, s.magnitude) })),
          missileOut: missileSynergyReceivers(skill.slug)
            .filter((s) => known(s.slug))
            .map((s) => ({ slug: s.slug, label: missileLine(s.element, s.magnitude) })),
        };
        // Optional fields are omitted rather than set to `undefined`: the
        // record crosses to the client as serialised props, and thirty
        // `"$undefined"` entries per tree are bytes the HTML budget pays for.
        if (skill.element) data.element = skill.element;
        if (cell.role) {
          data.role = cell.role;
          data.roleLabel = roles[cell.role];
        }
        if (cell.note) data.note = cell.note;
        return data;
      }),
    }));
    const nodes = rows.flatMap((row) => row.cells.filter((c) => c !== null));
    const points = nodes.reduce((sum, n) => sum + n.points, 0);
    const maxPoints = nodes.reduce((sum, n) => sum + n.maxLevel, 0);
    trees.push({
      slug: tree.slug,
      name: tree.name,
      theme: tree.theme,
      points,
      maxPoints,
      pointsLabel: inBuild ? fmt(t.skills.treePoints, { points, max: maxPoints }) : "",
      rows,
      edges: treeEdges(treeSlug).map((e) => ({ from: e.from.slug, to: e.to.slug })),
    });
  }

  let defaultTree = trees[0]?.slug ?? "";
  if (inBuild) {
    let best = -1;
    for (const tree of trees) {
      // Strictly greater: a tie keeps the earlier tree, which is the order of `cls.trees`.
      if (tree.points > best) {
        best = tree.points;
        defaultTree = tree.slug;
      }
    }
  }

  const data: SkillTreesData = {
    classSlug,
    locale,
    trees,
    defaultTree,
    inBuild,
    strings: skillTreesStrings(t),
  };

  if (allocations) {
    // Flex allocations are optional by definition: shown on the tree, excluded
    // from the mandatory budget the section header reports (R-TREE-6). Worded
    // exactly as the build page's legend card did, which is the text
    // `scripts/build-page.test.ts` looks for.
    const mandatory = allocations
      .filter((a) => a.role !== "flex" && a.points > 0)
      .reduce((sum, a) => sum + a.points, 0);
    const flex = allocations
      .filter((a) => a.role === "flex")
      .reduce((sum, a) => sum + a.points, 0);
    data.totalLabel =
      fmt(t.skills.legendMandatory, { points: mandatory, cap: MAX_HARD_POINTS }) +
      (flex > 0 ? ` ${formatPoints(t.skills.legendFlex, flex)}` : "");
  }

  return data;
}
