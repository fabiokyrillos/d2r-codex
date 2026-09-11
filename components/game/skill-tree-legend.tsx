"use client";

import type { ReactNode } from "react";

import type { SkillTreesStrings } from "@/lib/skill-tree-data-pure";

/**
 * The one legend a section has (R-TREE-8): a `<details data-legend>` served
 * closed, whose `<summary>` already shows the four state swatches and whose
 * `<h3>` reads exactly `legendTitle` — the heading `scripts/heading-snapshot.json`
 * pins on the build pages. The body explains every symbol: the four states,
 * the optional pill, the connector, the keyboard, the hard-points rule and the
 * placeholder note.
 *
 * Stub with the contracted props; Front 1's T4.
 */
export interface SkillTreeLegendProps {
  inBuild: boolean;
  strings: Pick<
    SkillTreesStrings,
    | "legendTitle"
    | "legendLocked"
    | "legendAvailable"
    | "legendInvested"
    | "legendMaxed"
    | "legendOptional"
    | "legendConnector"
    | "legendKeyboard"
    | "legendHardPoints"
    | "placeholderNote"
  >;
}

export function SkillTreeLegend(props: SkillTreeLegendProps): ReactNode {
  void props;
  return null;
}
