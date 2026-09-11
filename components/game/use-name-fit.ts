"use client";

import type { RefObject } from "react";

/**
 * Whether the names drawn inside the nodes of a grid still fit — the one
 * measurement that decides glyph mode (R-TREE-15, plan decision 9).
 *
 * The contract, for the island that calls it and the grid that reacts:
 *
 *   - It measures in a probe state, not in the state it is deciding: it sets
 *     `data-measuring` on `root`, which the stylesheet uses to force the names
 *     visible, reads every word of every `.tree-name` with a `Range` — a word
 *     whose client rects sit on more than one line has been broken; a name
 *     whose `scrollWidth` exceeds its `clientWidth` has been clipped — and
 *     removes the attribute, all synchronously, before anything is painted.
 *     Measuring after the names were hidden would read zero breaks, show the
 *     names again, grow the rows, and loop (review, HIGH-4).
 *   - It re-measures after `document.fonts.ready`, whenever a `ResizeObserver`
 *     on `root` fires, and whenever `deps` change (the active tree), and it
 *     only reports a change when the answer changes, so the observer converges.
 *   - It returns `true` when at least one name does not fit.
 *
 * Stub: returns false until `scripts/skill-tree-browser.test.ts` C11 is red.
 */
export function useNameFit(root: RefObject<HTMLElement | null>, deps: readonly unknown[]): boolean {
  void root;
  void deps;
  return false;
}
