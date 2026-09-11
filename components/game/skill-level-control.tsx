"use client";

import type { ReactNode } from "react";

import type { SkillTreesStrings } from "@/lib/skill-tree-data-pure";

/**
 * "My level" — the one control that writes `d2rc.level` (R-TREE-9, decision
 * D1). One 44 px line: label, a three-character number input (1–99), "Clear";
 * `levelHelp` reaches the input through `aria-describedby`. It exists only in
 * the hydrated tree (R-PREF-4) and is the only importer of `writeLevel` and
 * `clearLevel` — `scripts/hygiene.test.ts` keeps the allowlist. Emptying the
 * field is a clear; anything that is not a whole number from 1 to 99 writes
 * nothing and shows `levelInvalid`.
 *
 * Stub with the contracted props; Front 2's T11.
 */
export interface SkillLevelControlProps {
  level: number | null;
  /** Reports the new value (or null after a clear); the island re-derives every state. */
  onChange: (level: number | null) => void;
  strings: Pick<
    SkillTreesStrings,
    "levelLabel" | "levelHelp" | "levelClear" | "levelClearLabel" | "levelInvalid"
  >;
}

export function SkillLevelControl(props: SkillLevelControlProps): ReactNode {
  void props;
  return null;
}
