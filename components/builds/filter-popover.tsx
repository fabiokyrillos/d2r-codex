"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

/**
 * The advanced groups from `sm` up: a popover under "More filters".
 *
 * **Why it is a dialog and not a modal one.** It is `role="dialog"` because it
 * is a panel of controls that opens over the page and takes focus; it has no
 * `aria-modal`, no scrim, no focus trap and no scroll lock, because nothing
 * behind it is inert. Every tick inside it applies live — the listing under
 * it changes and the reader is meant to see that — so the page is not
 * something to hold still, and a reader who tabs out of the panel is leaving
 * it, not escaping a trap. The sheet below `sm` is the modal one, for the
 * reasons `mobile-filter-sheet.tsx` gives; this is the other half of
 * R-FILT-13, and `scripts/filters-desktop.test.ts` checks the body is never
 * scroll-locked while it is open.
 *
 * **Three ways to close, one of them returns focus.** Escape closes and hands
 * focus back to the trigger — it is a request to go back where you were. A
 * pointer press outside closes without moving focus: the reader is pressing
 * something else, and dragging their focus back to a button they are not
 * looking at would be the surprise. Focus leaving the panel closes it too,
 * for the reader who tabbed past its last control. The trigger itself is
 * excluded from "outside", so a press on it while the panel is open reaches
 * the trigger's own toggle rather than closing and reopening in one gesture.
 *
 * **Why the open state is not the URL's business.** The panel stays open
 * across every tick, and every tick changes the URL. The parent keeps `open`
 * in its own state, this component is mounted only while it is true, and
 * nothing here reads the address. Closing is never a decision: it writes
 * nothing.
 *
 * **Why it measures.** It is anchored under its trigger with `left: 0`, and
 * the trigger can sit anywhere the second row wraps it to — at 640px, at
 * 768px, at 200% text. A fixed anchor would hang the panel off the right
 * edge in the wrong half of those cases, so on mount it reads its own box
 * and shifts left by exactly what runs past the viewport (keeping a 16px
 * margin on the left), and does it again on resize. `useLayoutEffect`, so
 * the corrected position is the first one painted.
 *
 * **Nothing here moves.** No transition, no animation — the site ships none,
 * and a panel that slid would be the one thing a `prefers-reduced-motion`
 * reader would have to opt out of.
 */
export type PopoverCloseReason = "escape" | "outside" | "focus";

export function FilterPopover({
  id,
  label,
  triggerRef,
  onClose,
  children,
}: {
  /** The trigger's `aria-controls` target. */
  id: string;
  /** The accessible name — the same title the sheet uses. */
  label: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: (reason: PopoverCloseReason) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  /*
   * The close handler through a ref, so the listeners below attach once for
   * the life of the open panel rather than re-attaching on every render — and
   * every tick is a render.
   */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  // Focus in, and keep the box on screen. Both before the first paint.
  useLayoutEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(
      'summary, a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus({ preventScroll: true });

    const place = () => {
      const margin = 16;
      // Measured with the current shift removed, so a re-measure on resize
      // starts from the anchor rather than compounding the last correction.
      const previous = panel.style.left;
      panel.style.left = "0px";
      const box = panel.getBoundingClientRect();
      panel.style.left = previous;
      const width = document.documentElement.clientWidth;
      let next = 0;
      if (box.right > width - margin) next = width - margin - box.right;
      if (box.left + next < margin) next = margin - box.left;
      setShift(Math.round(next));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeRef.current("escape");
    };
    const isOutside = (target: EventTarget | null) => {
      const node = target as Node | null;
      if (!node) return true;
      if (ref.current?.contains(node)) return false;
      if (triggerRef.current?.contains(node)) return false;
      return true;
    };
    const onPointerDown = (event: Event) => {
      if (isOutside(event.target)) closeRef.current("outside");
    };
    const onFocusOut = (event: FocusEvent) => {
      // `relatedTarget` is null when focus goes to the body, which a pointer
      // press already handles; only a real move to another control counts.
      if (event.relatedTarget && isOutside(event.relatedTarget)) closeRef.current("focus");
    };
    const panel = ref.current;
    // Capture, so nothing between here and the document can swallow the key
    // first; `pointerdown` so the panel is gone by the time a press
    // completes, `mousedown` beside it because a synthesised event from an
    // automation harness may deliver only the mouse half.
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("mousedown", onPointerDown, true);
    panel?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("mousedown", onPointerDown, true);
      panel?.removeEventListener("focusout", onFocusOut);
    };
  }, [triggerRef]);

  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      data-popover=""
      aria-label={label}
      style={{ left: shift }}
      className="absolute top-full z-40 mt-2 w-[min(42rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface-raised p-4 shadow-2xl shadow-abyss"
    >
      {children}
    </div>
  );
}
