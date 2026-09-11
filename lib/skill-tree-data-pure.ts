/**
 * The shape of what the skill-tree island receives, and the two pure
 * functions every surface composes from it.
 *
 * Client-safe on purpose: no imports beyond types. This module is what the
 * `"use client"` tree imports, and `scripts/client-boundary.test.ts` scans the
 * built chunks for corpus strings — the registry, the graph and the content
 * never cross here. The server-side builder that fills these records lives in
 * `lib/skill-tree-data.ts` and re-exports this file; the island imports only
 * this one.
 *
 * Phase 4 plan §5.1. Field names are part of the contract: `level` is the
 * unlock level (never `requiredLevel`, which is one of the corpus markers the
 * boundary test looks for).
 */
import type { AllocationRole, Element, SkillKind } from "@/lib/types";

/** The four visual states of R-TREE-5. Editorial roles live in `role`. */
export type NodeState = "locked" | "available" | "invested" | "maxed";
export const NODE_STATES = ["locked", "available", "invested", "maxed"] as const;

export interface TreeNodeData {
  slug: string;
  name: string;
  /** Already carries the locale: `routes(locale).skill(classSlug, slug)`. */
  href: string;
  row: 1 | 2 | 3 | 4 | 5 | 6;
  column: 1 | 2 | 3;
  /** The unlock level (1, 6, 12, 18, 24 or 30). */
  level: number;
  kind: SkillKind;
  element?: Element;
  /** `skill.summary`; the panel renders it through `RichText`. */
  summary: string;
  /** Hard points this build spends here; 0 outside a build. */
  points: number;
  maxLevel: number;
  /** "20 points" / "not used" — worded once, server-side, by `formatPoints`. */
  pointsLabel: string;
  role?: AllocationRole;
  roleLabel?: string;
  note?: string;
  /** Slugs, in graph order. */
  prerequisites: string[];
  unlocks: string[];
  /** Received; `kinds` already labelled by `synergyKinds`. */
  synergiesIn: { slug: string; kinds: string; bonus?: string }[];
  synergiesOut: { slug: string; kinds: string }[];
  /** Missile synergies, already worded by `missileSynergyLine`. */
  missileIn: { slug: string; label: string }[];
  missileOut: { slug: string; label: string }[];
}

export interface TreeData {
  slug: string;
  name: string;
  theme: string;
  /** Sum of the base points in this tree; 10 × `maxLevel` is the ceiling. */
  points: number;
  maxPoints: number;
  /** "47 of 200 points in this tree" — "" outside a build. */
  pointsLabel: string;
  /** Always six rows of three cells; `null` is an empty cell. */
  rows: { level: number; cells: (TreeNodeData | null)[] }[];
  /** Prerequisite → dependent, both in this tree. */
  edges: { from: string; to: string }[];
}

export interface SkillTreesStrings {
  treeLabel: string;
  treeHint: string;
  rowLabel: string;
  emptyCell: string;
  panelHeading: string;
  panelEmpty: string;
  closePanel: string;
  fullPage: string;
  ariaNode: string;
  ariaNodeBuild: string;
  stateLocked: string;
  stateAvailable: string;
  stateInvested: string;
  stateMaxed: string;
  announceSelected: string;
  treesLabel: string;
  treePoints: string;
  treePointsShort: string;
  treeThemeSummary: string;
  levelLabel: string;
  levelHelp: string;
  levelClear: string;
  levelClearLabel: string;
  levelInvalid: string;
  legendTitle: string;
  legendLocked: string;
  legendAvailable: string;
  legendInvested: string;
  legendMaxed: string;
  legendOptional: string;
  legendConnector: string;
  legendKeyboard: string;
  legendHardPoints: string;
  placeholderNote: string;
  prerequisitesTitle: string;
  prerequisitesNone: string;
  unlocksTitle: string;
  unlocksNone: string;
  unlocksValue: string;
  synergiesTitle: string;
  synergiesNone: string;
  feedsTitle: string;
  panelPoints: string;
}

export interface SkillTreesData {
  classSlug: string;
  locale: string;
  /** In the order of `cls.trees`. */
  trees: TreeData[];
  /** Plan decision 6: the first tree on a class page, the most-invested one on a build. */
  defaultTree: string;
  inBuild: boolean;
  /** "88 of 110 mandatory hard points" (+ optional), build pages only. */
  totalLabel?: string;
  strings: SkillTreesStrings;
}

/**
 * The visual state of a node for a given "my level" (null when unset).
 *
 * Locked wins (plan decision 13): a build's 20 points in a level-30 skill are
 * still 20 points on the counter, but for a level-18 character the frame and
 * the accessible name say "locked" — that is the one thing `d2rc.level` is
 * for (R-TREE-4). With no level set nothing is ever locked (R-TREE-9), which
 * is why the comparison is guarded on `null` rather than on `0`.
 */
export function nodeState(
  node: Pick<TreeNodeData, "points" | "maxLevel" | "level">,
  level: number | null,
): NodeState {
  if (level !== null && node.level > level) return "locked";
  if (node.points >= node.maxLevel) return "maxed";
  if (node.points > 0) return "invested";
  return "available";
}

/**
 * Fills `{name}` placeholders, leaving unknown ones intact — the same
 * contract as `lib/i18n`'s `fmt`, re-stated here because this module may
 * import nothing (it is the one the client bundle carries).
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * The accessible name of a node: "name, level N, tree, state[, points]"
 * (R-TREE-14). One composition for both surfaces: the class page's template
 * has no `{points}` slot, so no plan is invented where there is none; the
 * build's template gets `pointsLabel`, already worded once by `formatPoints`.
 * The state is one of the four of R-TREE-5, never an editorial role — the
 * defect this replaced read "20 points, Optional, optional".
 */
export function nodeAriaLabel(
  node: Pick<TreeNodeData, "name" | "level" | "pointsLabel">,
  tree: string,
  state: NodeState,
  strings: Pick<
    SkillTreesStrings,
    "ariaNode" | "ariaNodeBuild" | "stateLocked" | "stateAvailable" | "stateInvested" | "stateMaxed"
  >,
  inBuild: boolean,
): string {
  const stateLabel = {
    locked: strings.stateLocked,
    available: strings.stateAvailable,
    invested: strings.stateInvested,
    maxed: strings.stateMaxed,
  }[state];
  return fill(inBuild ? strings.ariaNodeBuild : strings.ariaNode, {
    skill: node.name,
    level: node.level,
    tree,
    state: stateLabel,
    points: node.pointsLabel,
  });
}
