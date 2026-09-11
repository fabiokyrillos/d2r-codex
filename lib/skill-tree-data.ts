/**
 * Builds the island's payload for one class: three trees, ten nodes each,
 * with everything the panel needs already resolved and worded.
 *
 * Server-only by nature — it reads the registry, the generated graph and the
 * dictionary — and never imported by a `"use client"` file. The types and the
 * two pure functions the island shares live in `lib/skill-tree-data-pure.ts`
 * and are re-exported here for the server side.
 *
 * Phase 4 plan §5.1. Stub until `scripts/skill-tree.test.ts` (T9) is red.
 */
import type { Dictionary, Locale } from "@/lib/i18n";
import type { SkillAllocation, Slug } from "@/lib/types";

import {
  type SkillTreesData,
  type SkillTreesStrings,
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
 * Stub: the real builder is written against `scripts/skill-tree.test.ts` (T9).
 * Returns the typed zero — no trees, no default — so nothing downstream can
 * mistake it for data.
 */
export function buildSkillTreesData(
  locale: Locale,
  classSlug: Slug,
  t: Dictionary,
  allocations?: readonly SkillAllocation[],
): SkillTreesData {
  void allocations;
  return {
    classSlug,
    locale,
    trees: [],
    defaultTree: "",
    inBuild: false,
    strings: skillTreesStrings(t),
  };
}
