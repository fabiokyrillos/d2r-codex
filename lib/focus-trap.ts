/**
 * Where Tab should go inside a modal.
 *
 * Pure, and separated from the component for the same reason the grid
 * movement is: the part worth testing is the decision, not the DOM plumbing
 * around it. Client-safe and dependency-free — it is imported across the
 * `"use client"` boundary.
 *
 * The mobile sheet needs this because it is genuinely modal. It lays a scrim
 * over the page that swallows every pointer event, so a mouse user cannot reach
 * what is behind it; without a trap, a keyboard user still could, tabbing into
 * content they cannot see. The sheet used to declare `aria-modal="false"`,
 * which described neither behaviour honestly.
 */

/**
 * @param itemCount   focusable elements inside the modal
 * @param activeIndex index of the focused element, or -1 if focus is outside
 * @param shiftKey    true for Shift+Tab
 * @returns the index to focus, or `null` to let the browser move focus itself
 */
export function trapTarget(
  itemCount: number,
  activeIndex: number,
  shiftKey: boolean,
): number | null {
  // An empty modal cannot hold focus; trapping would strand the user.
  if (itemCount <= 0) return null;
  const last = itemCount - 1;

  // Focus escaped the modal — pull it back to the end it would have entered.
  if (activeIndex < 0 || activeIndex > last) return shiftKey ? last : 0;

  if (shiftKey && activeIndex === 0) return last;
  if (!shiftKey && activeIndex === last) return 0;

  // Interior move: the browser's own order is correct, so do not interfere.
  return null;
}
