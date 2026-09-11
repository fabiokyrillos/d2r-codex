import type { ReactNode } from "react";

import { getI18n } from "@/lib/i18n/server";
import { buildSkillTreesData } from "@/lib/skill-tree-data";
import type { SkillAllocation, Slug } from "@/lib/types";

import { SkillTrees } from "./skill-trees";

/**
 * The skill-tree section, server side: builds the island's payload for the
 * class (with this build's hard points when on a build page), renders the
 * section header's total ("88 of 110 mandatory hard points", build pages
 * only) and hands the data to the `SkillTrees` island. Nothing here is a
 * React element passed as a prop — that was the 3× the spike measured: the
 * server graph serializes the props of a client component into the RSC
 * payload, so thirty pre-rendered tiles and thirty panels travelled twice
 * (plan §3.3–3.4, decision 1). Data travels once, at ≈18 KB.
 *
 * Replaces the three `<SkillTree>` calls on the class and build pages.
 */
export async function SkillTreesSection({
  classSlug,
  allocations,
}: {
  classSlug: Slug;
  /** Supply on a build page to draw that build's hard points. */
  allocations?: readonly SkillAllocation[];
}): Promise<ReactNode> {
  const { locale, t } = await getI18n();
  const data = buildSkillTreesData(locale, classSlug, t, allocations);
  if (data.trees.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* The section's total (R-TREE-6), above the trees where the build
          page's legend card used to keep it (plan decision 14). The island
          never renders it: it is server text, not island state. */}
      {data.inBuild && data.totalLabel && (
        <p data-trees-total="" className="font-mono text-sm text-ink">
          {data.totalLabel}
        </p>
      )}
      <SkillTrees data={data} />
    </div>
  );
}
