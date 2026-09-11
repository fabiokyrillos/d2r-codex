import type { KeyboardEvent, MouseEvent } from "react";

import { cn } from "@/components/ui";
import type { ClassSlug } from "@/lib/types/core";
import { ClassGlyph } from "./class-glyph";

/**
 * One class chip: the primary control of the listing (R-FILT-1).
 *
 * **It is always a link, and the link is real.** Its `href` is the class page's
 * builds section — `/<locale>/classes/<slug>#builds` — because that is the one
 * listing narrowed to a class that a static site can serve: this page cannot
 * read `?class=` without JavaScript, so a served href that pointed there was a
 * link to a page that ignored it. The owner's decision D7 (R-FILT-14) made the
 * destination the class page, and it holds in every state: a reader without
 * JavaScript follows it, a crawler indexes it, and with JavaScript a Ctrl,
 * Cmd, Shift or Alt click, a middle click, "open in new tab" and "copy link"
 * all still get the class page, because none of those presses is intercepted.
 *
 * **With JavaScript the same anchor is also a toggle.** Given `onToggle` the
 * chip takes `role="button"` and `aria-pressed`, a plain left click is
 * intercepted (`preventDefault`) and toggles the class in the listing's URL
 * instead of leaving the page, Enter does the same through the anchor's own
 * activation, and Space — which a link does not answer to but a button must —
 * is handled here so the role it announces is the role it has. The two
 * renderings never coexist in one document: the plain link is the Suspense
 * fallback and the pressable one is the hydrated tree that replaces it, so
 * there is nothing to mismatch.
 *
 * **The count is always rendered, zero included.** With the other groups'
 * selections applied, a class with no build left reads `0` and is
 * `aria-disabled` and out of the tab order — the number is the information
 * ("this class has no cold build"), and the disabled state is what keeps a
 * plain click from producing an empty list (R-FILT-4). The href stays: the
 * class page still exists, and a modified click may still open it. A pressed
 * chip is never disabled whatever its count: a filter the reader cannot take
 * off would be a trap, not a control. `disabled` is therefore decided by the
 * caller, who knows both facts, not here from the count alone.
 *
 * No `"use client"`: a pure function of its props, rendered on the server in
 * the fallback and by the client in the live row.
 */
export function ClassChip({
  slug,
  label,
  count,
  href,
  pressed = false,
  disabled = false,
  onToggle,
}: {
  slug: ClassSlug;
  /** The class's localised name — the visible text and most of the accessible name. */
  label: string;
  count: number;
  /** The class page's `#builds`, in the page's locale. Always present. */
  href: string;
  pressed?: boolean;
  disabled?: boolean;
  /** Present on the live row only. Makes the link a toggle for plain presses. */
  onToggle?: () => void;
}) {
  const live = onToggle !== undefined;

  /*
   * Hierarchy by weight, not by boxes: the chip has a filled surface and a
   * transparent border, so at rest it reads as a soft tile rather than an
   * outlined box; the border only appears — in ember — when it is pressed.
   * `min-h-11` is the 44px target R-A11Y-4 asks for on a primary control, and
   * `shrink-0` keeps a chip from being squeezed inside the scrolling row.
   */
  const className = cn(
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
    pressed
      ? "border-ember bg-ember-dim/10 text-ember-bright hover:bg-ember-dim/15"
      : "border-transparent bg-surface-raised text-ink",
    !pressed && !disabled && "hover:bg-surface-overlay",
    disabled && "cursor-not-allowed opacity-50",
  );

  /*
   * Only a plain primary press is the listing's to take. Anything else — a
   * modifier, another button — is the browser's request for a tab, a window
   * or a download, and it must reach the href untouched.
   */
  const onClick = live
    ? (event: MouseEvent<HTMLAnchorElement>) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (disabled) return;
        onToggle();
      }
    : undefined;

  // Enter is the anchor's own activation and arrives as the click above.
  const onKeyDown = live
    ? (event: KeyboardEvent<HTMLAnchorElement>) => {
        if (event.key !== " ") return;
        event.preventDefault();
        if (!disabled) onToggle();
      }
    : undefined;

  return (
    <a
      data-class={slug}
      href={href}
      className={className}
      {...(live
        ? {
            role: "button",
            "aria-pressed": pressed,
            "aria-disabled": disabled || undefined,
            tabIndex: disabled ? -1 : 0,
            onClick,
            onKeyDown,
          }
        : {})}
    >
      <ClassGlyph slug={slug} className={pressed ? "text-ember-bright" : "text-ink-muted"} />
      <span>{label}</span>
      <span data-count className="font-mono text-xs text-ink-subtle">
        {count}
      </span>
    </a>
  );
}
