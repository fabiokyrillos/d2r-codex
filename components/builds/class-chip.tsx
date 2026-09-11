import { cn } from "@/components/ui";
import type { ClassSlug } from "@/lib/types/core";
import { ClassGlyph } from "./class-glyph";

/**
 * One class chip: the primary control of the listing (R-FILT-1).
 *
 * It is one component with two renderings, and which one it is comes from the
 * props rather than from a flag. Given an `href` it is a link, which is what
 * the static HTML carries: a reader without JavaScript follows it to the
 * `?class=` listing, and a crawler sees eight real links (R-FILT-14). Given no
 * `href` it is a toggle button with `aria-pressed`, which is what the live
 * listing renders — `aria-pressed` is invalid on a link and `role="button"` on
 * an `<a href>` breaks Space, so the two states cannot share an element (see
 * `components/game/tier-selector.tsx`, which swaps for the same reason).
 *
 * The two never coexist in one document. The link row is the Suspense
 * fallback and the button row is the hydrated tree that replaces it, so there
 * is nothing to keep in step and no hydration to mismatch.
 *
 * **The count is always rendered, zero included.** With the other groups'
 * selections applied, a class with no build left reads `0` and is `disabled`
 * — the number is the information ("this class has no cold build"), and the
 * disabled state is what keeps a click from producing an empty list
 * (R-FILT-4). A pressed chip is never disabled whatever its count: a filter
 * the reader cannot take off would be a trap, not a control. `disabled` is
 * therefore decided by the caller, who knows both facts, not here from the
 * count alone.
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
  onClick,
}: {
  slug: ClassSlug;
  /** The class's localised name — the visible text and most of the accessible name. */
  label: string;
  count: number;
  /** Present on the static row only: the `?class=<slug>` listing. */
  href?: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
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

  const body = (
    <>
      <ClassGlyph slug={slug} className={pressed ? "text-ember-bright" : "text-ink-muted"} />
      <span>{label}</span>
      <span data-count className="font-mono text-xs text-ink-subtle">
        {count}
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <a data-class={slug} href={href} className={className}>
        {body}
      </a>
    );
  }
  return (
    <button
      type="button"
      data-class={slug}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {body}
    </button>
  );
}
