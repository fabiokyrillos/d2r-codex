"use client";

import type { KeyboardEvent, ReactNode } from "react";

import type { Cell } from "@/lib/skill-tree-nav";
import type { NodeState, SkillTreesStrings, TreeData } from "@/lib/skill-tree-data-pure";

/**
 * One tree: heading, theme, the 3×6 grid with its rail and connectors, and
 * the name bar. Presentational — it decides nothing (plan §10, contract 2):
 * every state it draws arrives as a prop, every gesture goes back through a
 * callback, and the island owns the reducer.
 *
 * Stub with the contracted props (plan §5.5); the real component is Front 1's
 * T2, written against `scripts/skill-tree-a11y.test.ts` and
 * `scripts/skill-tree-browser.test.ts`.
 */
export interface SkillTreeGridProps {
  tree: TreeData;
  inBuild: boolean;
  /** `d2rc.level`, or null when unset — never changes any data. */
  level: number | null;
  /** True after the island mounted: roles, roving tabindex, `aria-expanded`. */
  enhanced: boolean;
  /** Glyph mode: names leave the nodes, the name bar shows the focused one. */
  glyph: boolean;
  focusCell: Cell;
  /** `shownSlug(state)`: what the panel shows and what the connectors light up for. */
  shownSlug: string | null;
  /** The confirmed selection: the only node with `aria-expanded="true"`. */
  selectedSlug: string | null;
  /** `relatedEdges(shownSlug, tree.edges)` — keys `"<from>><to>"`. */
  relatedEdges: ReadonlySet<string>;
  panelId: string;
  strings: SkillTreesStrings;
  /** `nodeState(node, level)` for one node, so the grid and the panel agree. */
  stateOf: (node: TreeData["rows"][number]["cells"][number] & object) => NodeState;
  onNodeFocus: (slug: string, cell: Cell) => void;
  onNodeBlur: () => void;
  onNodeKeyDown: (event: KeyboardEvent<HTMLAnchorElement>, slug: string, cell: Cell) => void;
  onNodeActivate: (slug: string, cell: Cell, via: "pointer" | "keyboard") => void;
  onNodeHoverIn: (slug: string) => void;
  onNodeHoverOut: () => void;
}

export function SkillTreeGrid(props: SkillTreeGridProps): ReactNode {
  void props;
  return null;
}
