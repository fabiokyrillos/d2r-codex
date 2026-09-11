"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Whether the names drawn inside the nodes of a grid still fit — the one
 * measurement that decides glyph mode (R-TREE-15, plan decision 9).
 *
 * The contract, for the island that calls it and the grid that reacts:
 *
 *   - It measures in a probe state, not in the state it is deciding: it sets
 *     `data-measuring` on `root`, which the stylesheet uses to force the names
 *     visible, reads every word of every `.tree-name` with a `Range` — a word
 *     whose client rects sit on more than one line has been broken, and a
 *     break the browser hyphenated (`hyphens: auto`) counts, because R-TREE-15
 *     says "never split a word", not "never split one without a hyphen"; a
 *     name whose `scrollWidth` exceeds its `clientWidth` has been clipped —
 *     and removes the attribute, all synchronously, before anything is
 *     painted. Measuring after the names were hidden would read zero breaks,
 *     show the names again, grow the rows, and loop (review, HIGH-4). The
 *     browser gate's word measurer applies the same rule to what is painted.
 *   - It re-measures after `document.fonts.ready`, whenever a `ResizeObserver`
 *     on `root` fires, and whenever `deps` change (the active tree), and it
 *     only reports a change when the answer changes, so the observer converges.
 *   - It returns `true` when at least one name does not fit, and `false` on the
 *     server and before the first measurement.
 *
 * It cannot be unit-tested without a layout engine; its evidence is C11 in
 * `scripts/skill-tree-browser.test.ts` (zero broken words at 200% text, the
 * name-or-glyph invariant, and at most one `data-glyph` mutation per change).
 */
export function useNameFit(root: RefObject<HTMLElement | null>, deps: readonly unknown[]): boolean {
  const [misfit, setMisfit] = useState(false);

  /*
   * A layout effect, so the first answer lands before the first paint: a
   * post-paint switch would show broken names for a frame and then move every
   * row under the reader.
   *
   * The observer's notifications are triggered by this effect's own output
   * (hiding the names shrinks the rows), and it settles because the probe
   * measures the same names either way and `useState` bails out when the
   * answer is the one it already holds.
   */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let live = true;
    const run = () => {
      if (!live) return;
      setMisfit(measureNames(el));
    };
    run();
    // Web fonts arrive after mount and change every word's width.
    document.fonts?.ready.then(run);
    const observer = new ResizeObserver(run);
    observer.observe(el);
    return () => {
      live = false;
      observer.disconnect();
    };
    // `deps` is the caller's list on purpose (the active tree, the mount):
    // the hook re-measures when the caller says the grid changed — and on
    // its own when the box does, through the observer — and reads nothing
    // else that could go stale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return misfit;
}

/**
 * One synchronous probe: force the names visible, read, restore. `finally`
 * because a name left in the probe state would be a visible defect.
 */
function measureNames(root: HTMLElement): boolean {
  root.setAttribute("data-measuring", "");
  try {
    const range = document.createRange();
    for (const name of root.querySelectorAll<HTMLElement>(".tree-name")) {
      // A tree under `hidden` has no boxes; its names are neither broken nor
      // clipped, and a tab switch must not be judged by the tree it left.
      if (name.closest("[hidden]")) continue;
      if (name.scrollWidth > name.clientWidth + 1) return true;
      if (hasBrokenWord(name, range)) return true;
    }
    return false;
  } finally {
    root.removeAttribute("data-measuring");
  }
}

/**
 * A word is broken when its non-empty client rects sit on more than one line.
 * Tops are rounded to the pixel: fragments of one word on one line share a
 * line box and differ by sub-pixels at most, while a wrapped or hyphenated
 * tail sits a whole line lower.
 */
function hasBrokenWord(name: HTMLElement, range: Range): boolean {
  const walker = document.createTreeWalker(name, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    const words = /\S+/g;
    for (let m = words.exec(text); m; m = words.exec(text)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const tops = new Set<number>();
      for (const rect of range.getClientRects()) {
        if (rect.width > 0 && rect.height > 0) tops.add(Math.round(rect.top));
      }
      if (tops.size > 1) return true;
    }
  }
  return false;
}
