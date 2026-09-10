"use client";

import { useEffect } from "react";

/**
 * Puts an in-page fragment back where the stylesheet says it belongs, once the
 * page has stopped moving.
 *
 * **The defect.** `#builds` on a class page is a `FilterableBuildList`, and its
 * static HTML is the Suspense fallback: the plain list, no filter panel. The
 * panel arrives with hydration, and that section grows — above every other
 * anchor on the page. Measured on the published build, on a load that carries
 * the fragment:
 *
 *     width   contract   landed   error
 *      320       104      208     +104
 *      390       104      190      +86
 *      768       144    482–528   +338…+384
 *     1280       144    482–572   +338…+428
 *
 * A press on the summary *after* hydration landed at the contract to the pixel,
 * in 23 of 24 cases. So the anchors are right and one path is early.
 *
 * **Why "once it stops moving" and not "when it grows".** The first version of
 * this watched for the growth and corrected it, and it did nothing at all,
 * because the growth is not what the reader is losing to. The timeline of one
 * load at 390px, recorded frame by frame:
 *
 *     311ms   the browser starts its jump — a *smooth* animation, because
 *             `scroll-behavior: smooth` is site-wide, and its destination is
 *             computed once, here, from the layout as it stands
 *     332ms   hydration replaces the fallback; `#builds` gains 86px and every
 *             anchor below it moves down by 86
 *    1658ms   the animation arrives at the destination it decided on at 311ms,
 *             which is now 86px above the heading
 *
 * At 332ms the section is 6,066px below the fold: a correction then is either a
 * no-op or a jump to somewhere the reader is not looking. The only moment at
 * which the right thing can be done is after the scroll has finished — which is
 * also the only moment at which "is this in the wrong place?" has an answer.
 *
 * **Why here and not in the list.** The list is not this phase's to change, and
 * its fallback is what a reader without JavaScript keeps forever — reserving
 * the panel's height there would hand that reader a permanent empty box to pay
 * for a panel they never receive. So the correction lives where the summary and
 * the anchor meet, which is what R-NAV-3 actually promises.
 *
 * **Why this is not automatic movement.** R-BUILD-2 allows "the browser's own
 * jump to the anchor", and `tier-selector.tsx` re-aligns on the same grounds
 * after a collapse. Nothing here moves a page the reader did not send
 * somewhere: there must be a fragment, it must name an element, that element
 * must have come to rest *below* the mark the stylesheet gives it while still
 * being on screen, and any wheel, touch, key or press ends the watch before it
 * can. It moves the page at most once per fragment, and never with an
 * animation.
 */

/** Below this the difference is sub-pixel rounding, not a drift worth moving. */
const TOLERANCE_PX = 2;

/** How long the scroll and the document must both hold still to count as done. */
const QUIET_MS = 250;

/** And an outer bound, after which the page is simply left as it is. */
const MAX_MS = 8000;

/** What counts as the reader taking over. `pointerdown` is a scrollbar drag. */
const GESTURES = ["wheel", "touchstart", "keydown", "pointerdown", "mousedown"] as const;

export function AnchorRealign() {
  useEffect(() => {
    let stopCurrent: (() => void) | null = null;

    /** The element the address bar is pointing at, if it is on this page. */
    const target = (): HTMLElement | null => {
      const raw = window.location.hash.slice(1);
      if (!raw) return null;
      let decoded = raw;
      try {
        decoded = decodeURIComponent(raw);
      } catch {
        // A malformed escape is not a fragment this site mints; use it as-is.
      }
      return document.getElementById(decoded) ?? document.getElementById(raw);
    };

    /**
     * Where the anchor should sit: the element's own `scroll-margin-top` plus
     * the root's `scroll-padding-top`, both read from the page.
     *
     * Read rather than restated. `<Section>` carries `scroll-mt-24` and
     * `globals.css` sets a width-conditional `scroll-padding-top`; a copy of
     * either number here would be a second source of truth that drifts, and the
     * one thing this must never do is put the anchor somewhere the browser
     * would not have put it itself.
     */
    const mark = (el: HTMLElement): number =>
      (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) +
      (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);

    const watch = () => {
      stopCurrent?.();
      const el = target();
      if (!el) return;

      const started = performance.now();
      let frame = 0;
      let lastY = Number.NaN;
      let lastHeight = Number.NaN;
      let quietSince = started;

      const stop = () => {
        cancelAnimationFrame(frame);
        for (const type of GESTURES) window.removeEventListener(type, stop);
        stopCurrent = null;
      };

      const align = () => {
        const top = el.getBoundingClientRect().top;
        const want = mark(el);
        // Only downward, and only while the section is still on screen. Above
        // the mark means the reader is already past it; off the bottom means
        // they are somewhere else entirely. Neither is ours to correct.
        if (top - want <= TOLERANCE_PX || top >= window.innerHeight) return;
        window.scrollTo({ top: Math.max(0, top + window.pageYOffset - want), behavior: "auto" });
      };

      /*
       * A frame loop rather than a `scroll` listener or a `ResizeObserver`,
       * because the thing being waited for is the *absence* of both. Chrome
       * fires no event when a smooth scroll finishes, and the document stops
       * growing without announcing that either.
       */
      const tick = () => {
        const y = Math.round(window.scrollY);
        const height = Math.round(document.body.getBoundingClientRect().height);
        const now = performance.now();
        if (y !== lastY || height !== lastHeight) {
          lastY = y;
          lastHeight = height;
          quietSince = now;
        } else if (now - quietSince >= QUIET_MS) {
          align();
          stop();
          return;
        }
        // Past the bound the page is left alone rather than moved late: a tab
        // that was in the background has no frames, so "elapsed" there can be
        // minutes, and a scroll minutes after the fact is not a correction.
        if (now - started >= MAX_MS) {
          stop();
          return;
        }
        frame = requestAnimationFrame(tick);
      };

      for (const type of GESTURES) window.addEventListener(type, stop, { passive: true });
      frame = requestAnimationFrame(tick);
      stopCurrent = stop;
    };

    watch();
    window.addEventListener("hashchange", watch);
    return () => {
      window.removeEventListener("hashchange", watch);
      stopCurrent?.();
    };
  }, []);

  return null;
}
