"use client";

import type { ReactNode } from "react";

import type { NodeState, SkillTreesStrings, TreeNodeData } from "@/lib/skill-tree-data-pure";

/**
 * The details of one skill, rendered from data: name, level, state, summary
 * (through `RichText`), points and editorial role on a build page,
 * prerequisites, what it unlocks, synergies received and given (including
 * the missile ones), every one of them a real link with the locale already
 * in the href, and the link to the full page (R-TREE-7). The same body serves
 * the docked region from `lg` up and the bottom sheet below it.
 *
 * Stub with the contracted props (plan §5.5 "painel — conteúdo"); Front 2's T10.
 */
export interface SkillTreePanelProps {
  /** Null shows `panelEmpty`. */
  node: TreeNodeData | null;
  treeName: string;
  state: NodeState;
  inBuild: boolean;
  /** Resolves a slug named in prerequisites/unlocks/synergies to its node (any tree of the class). */
  lookup: (slug: string) => TreeNodeData | undefined;
  strings: SkillTreesStrings;
}

export function SkillTreePanel(props: SkillTreePanelProps): ReactNode {
  void props;
  return null;
}
