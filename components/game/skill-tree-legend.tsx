"use client";

import type { ReactNode } from "react";

import type { NodeState, SkillTreesStrings } from "@/lib/skill-tree-data-pure";

/**
 * The one legend a section has (R-TREE-8): a `<details data-legend>` served
 * closed, whose `<summary>` already shows the four state swatches and whose
 * `<h3>` reads exactly `legendTitle` — the heading `scripts/heading-snapshot.json`
 * pins on the build pages. The body explains every symbol: the four states,
 * the optional pill, the connector, the keyboard, the hard-points rule and the
 * placeholder note.
 *
 * Closed, not open: the prototype measured the open legend at 116 px per
 * tree against 34 px closed, and the 900 px budget of R-TREE-8 is met with
 * it closed (mutation M21 serves it open). It never closes itself either —
 * the prototype's "close on first selection" was a heuristic, not a pattern.
 *
 * Only the title is inside the `<h3>`; the swatches sit beside it in the
 * summary so the heading text stays byte-equal to the snapshot.
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

const STATES: readonly NodeState[] = ["locked", "available", "invested", "maxed"];

/** A 12 × 12 box drawn with the same frame the node of that state wears. */
function Swatch({ state }: { state: NodeState }): ReactNode {
  return <span data-swatch={state} aria-hidden="true" className={`tree-swatch tree-swatch-${state}`} />;
}

export function SkillTreeLegend({ inBuild, strings }: SkillTreeLegendProps): ReactNode {
  const lines: { key: string; text: string; swatch?: NodeState }[] = [
    { key: "locked", text: strings.legendLocked, swatch: "locked" },
    { key: "available", text: strings.legendAvailable, swatch: "available" },
    { key: "invested", text: strings.legendInvested, swatch: "invested" },
    { key: "maxed", text: strings.legendMaxed, swatch: "maxed" },
    ...(inBuild ? [{ key: "optional", text: strings.legendOptional }] : []),
    { key: "connector", text: strings.legendConnector },
    { key: "keyboard", text: strings.legendKeyboard },
    ...(inBuild ? [{ key: "hard-points", text: strings.legendHardPoints }] : []),
    { key: "placeholder", text: strings.placeholderNote },
  ];

  return (
    <details data-legend="" className="mt-3 rounded border border-border bg-surface-raised">
      {/* `display: flex` on a summary drops the browser's marker, so the
          chevron is drawn back by the stylesheet (`.tree-disclosure`). */}
      <summary className="flex min-h-11 cursor-pointer flex-wrap items-center gap-3 px-3 py-2">
        <span aria-hidden="true" className="tree-disclosure text-ink-muted" />
        <h3 className="font-display text-base text-ink">{strings.legendTitle}</h3>
        <span aria-hidden="true" className="flex items-center gap-1.5">
          {STATES.map((state) => (
            <Swatch key={state} state={state} />
          ))}
        </span>
      </summary>
      <ul className="space-y-1.5 px-3 pb-3 text-sm text-ink-muted">
        {lines.map((line) => (
          <li key={line.key} className="flex items-start gap-2">
            {line.swatch && (
              <span className="flex h-5 shrink-0 items-center">
                <Swatch state={line.swatch} />
              </span>
            )}
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
