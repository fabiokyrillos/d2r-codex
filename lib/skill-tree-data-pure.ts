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
 * Stub: the real rule is written against `scripts/skill-tree.test.ts` first
 * (plan §11, T9). Plan §5.1: locked when `level !== null && node.level > level`;
 * else maxed when `points >= maxLevel`; else invested when `points > 0`; else
 * available.
 */
export function nodeState(
  node: Pick<TreeNodeData, "points" | "maxLevel" | "level">,
  level: number | null,
): NodeState {
  void node;
  void level;
  return "available";
}

/**
 * The accessible name of a node: "name, level N, tree, state[, points]".
 *
 * Stub: composed against `scripts/skill-tree.test.ts` first (plan §5.1).
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
  void node;
  void tree;
  void state;
  void strings;
  void inBuild;
  return "";
}
