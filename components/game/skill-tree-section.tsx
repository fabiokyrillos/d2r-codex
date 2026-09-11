import type { ReactNode } from "react";

import type { SkillAllocation, Slug } from "@/lib/types";

/**
 * The skill-tree section, server side: builds the island's payload for the
 * class (with this build's hard points when on a build page), renders the
 * section header's total ("88 of 110 mandatory hard points", build pages
 * only) and hands the data to the `SkillTrees` island. Nothing here is a
 * React element passed as a prop — that was the 3× the spike measured.
 *
 * Replaces the three `<SkillTree>` calls on the class and build pages.
 *
 * Stub; Front 1's T5.
 */
export async function SkillTreesSection({
  classSlug,
  allocations,
}: {
  classSlug: Slug;
  /** Supply on a build page to draw that build's hard points. */
  allocations?: readonly SkillAllocation[];
}): Promise<ReactNode> {
  void classSlug;
  void allocations;
  return null;
}
