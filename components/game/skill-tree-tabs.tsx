"use client";

import type { ReactNode } from "react";

import type { SkillTreesStrings } from "@/lib/skill-tree-data-pure";

/**
 * The tree control below `sm`: served as three `<a href="#<tree>">` (a jump
 * list, useful without JavaScript and hidden from `sm` up by the stylesheet),
 * enhanced into `role="tablist"` / `role="tab"` with `aria-selected`,
 * `aria-controls` and automatic activation by arrow keys once the island has
 * mounted and only while the viewport is narrow (plan decision 5). A plain
 * click is intercepted; modified clicks and new-tab gestures follow the link.
 *
 * Stub with the contracted props (plan §5.5); Front 1's T3.
 */
export interface SkillTreeTabsProps {
  trees: { slug: string; name: string; pointsLabel: string }[];
  active: string;
  enhanced: boolean;
  /** Below `sm`: the tabs are live. From `sm` up the control is hidden and inert. */
  narrow: boolean;
  strings: Pick<SkillTreesStrings, "treesLabel" | "treePointsShort">;
  onSelect: (slug: string) => void;
}

export function SkillTreeTabs(props: SkillTreeTabsProps): ReactNode {
  void props;
  return null;
}
