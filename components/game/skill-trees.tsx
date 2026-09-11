"use client";

import type { ReactNode } from "react";

import type { SkillTreesData } from "@/lib/skill-tree-data-pure";

/**
 * The skill-tree section's one client island: the tabs below `sm`, the three
 * trees, the shared legend, "My level", the docked panel from `lg` up, the
 * bottom sheet below it, and one live region written only on a confirmed
 * selection (plan §6).
 *
 * Its first client render is byte-identical to the server's — links, no tab
 * roles, no level control, nothing `hidden` — and a layout effect then turns
 * `enhanced` on, reads `matchMedia`, `readLevel()` and `location.hash`, and
 * marks `data-trees-ready`. Everything it shows comes from `data`; it imports
 * no dictionary, no registry and no content.
 *
 * Stub; Front 2's T12, written against `scripts/skill-tree-browser.test.ts`.
 */
export function SkillTrees({ data }: { data: SkillTreesData }): ReactNode {
  void data;
  return null;
}
