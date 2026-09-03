/**
 * Holding the page still while a modal is open.
 *
 * Pure, and separated from the component for the same reason `trapTarget` is:
 * the part worth testing is the bookkeeping, not the DOM plumbing around it.
 * Client-safe and dependency-free — it is imported across the `"use client"`
 * boundary. It touches only the `style.overflow` of whatever it is handed, so a
 * test can pass a plain object.
 *
 * The mobile sheet needed this because it was already modal in every other
 * respect. It declares `aria-modal="true"`, traps Tab, and lays a scrim that
 * swallows pointer events — and the document behind it scrolled anyway. On a
 * touch screen that is not a cosmetic problem: a drag that begins on the sheet's
 * own body and runs past its end keeps going into the page underneath, so the
 * content the reader opened slides away while they are reading it.
 *
 * **Why a count rather than a boolean.** A class page mounts three of these
 * trees, each with its own sheet. Only one can be open today — the scrim blocks
 * the pointer and the trap holds Tab — but "only one" is a property of two other
 * decisions rather than of this file. If two locks were ever taken, the naive
 * version saves `hidden` as the second lock's "previous" and restores it on the
 * way out, leaving the page permanently unscrollable. The depth counter costs
 * nothing and removes that whole class of bug.
 *
 * **Why release is idempotent.** React can run an effect's cleanup more than
 * once across a remount, and a double release would decrement a count another
 * component still holds.
 */

/** The shape this needs from `document.body`, and all it needs. */
export interface ScrollLockTarget {
  style: { overflow: string };
}

/**
 * Keyed on the element, so the count is shared by every caller locking the same
 * one without any module-level singleton for a test to reset. A `WeakMap` also
 * means a detached element carries no state forward.
 */
const held = new WeakMap<ScrollLockTarget, { depth: number; previous: string }>();

/**
 * Locks scrolling on `target` and returns the release.
 *
 * The value that was there before is restored exactly — including the empty
 * string, which is what an element with no inline overflow has and what must go
 * back so the stylesheet keeps deciding.
 */
export function lockScroll(target: ScrollLockTarget): () => void {
  const existing = held.get(target);
  if (existing) {
    existing.depth += 1;
  } else {
    held.set(target, { depth: 1, previous: target.style.overflow });
  }
  target.style.overflow = "hidden";

  let released = false;
  return function release() {
    if (released) return;
    released = true;
    const state = held.get(target);
    if (!state) return;
    state.depth -= 1;
    if (state.depth > 0) return;
    target.style.overflow = state.previous;
    held.delete(target);
  };
}

/** Whether anything currently holds a lock on `target`. For tests and asserts. */
export function isScrollLocked(target: ScrollLockTarget): boolean {
  return held.has(target);
}
