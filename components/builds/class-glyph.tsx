import type { ClassSlug } from "@/lib/types/core";

/**
 * The mark on a class chip.
 *
 * The same rule as `components/game/skill-sigil.tsx`, for the same reason:
 * Blizzard's class art is not licensable, and a traced substitute would put
 * identity back into a picture. So each mark is plain geometry authored here —
 * a shape a reader learns in a session, next to the class's **name**, which is
 * always in visible text beside it. Nothing here is a portrait, a weapon from
 * the game, or a symbol Blizzard draws; the Necromancer's mark is a ring and a
 * bar, not a skull.
 *
 * Stroke weights are heavy for the same reason the sigils' are: at 18px a
 * thin line reads as a smudge. Every path tints with `currentColor`, so a
 * pressed chip recolours its glyph with its name and nothing here knows about
 * colour at all.
 *
 * No `"use client"` — this is a pure function of its props, rendered on the
 * server inside the static chip row and by the client inside the live one.
 * Typed on `ClassSlug`, so a ninth class fails to compile here rather than
 * rendering a chip with no mark.
 */

/** One shape per class, drawn in a 24x24 box. */
function shape(slug: ClassSlug) {
  switch (slug) {
    case "amazon":
      // A chevron arrowhead on a shaft — something loosed at range.
      return (
        <path
          d="M5.5 13 L12 5 L18.5 13 M12 5.5 L12 20.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "assassin":
      // Two short diagonal claws.
      return (
        <path
          d="M6.5 4.5 L12 19.5 M13 4.5 L18.5 19.5"
          fill="none"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      );
    case "barbarian":
      // An axe-like wedge on a haft.
      return (
        <>
          <path d="M10.5 2.5 L10.5 21.5" fill="none" strokeWidth="3" strokeLinecap="round" />
          <path d="M11 3 L21 8 L11 13 Z" />
        </>
      );
    case "druid":
      // A leaf, outlined, with its vein.
      return (
        <>
          <path
            d="M4.5 19.5 C4.5 9 11 4 19.5 4.5 C20 13 15 19.5 4.5 19.5 Z"
            fill="none"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path d="M6.5 17.5 L15.5 8.5" fill="none" strokeWidth="2.4" strokeLinecap="round" />
        </>
      );
    case "necromancer":
      // A hollow ring over a bar. Generic iconography: nothing from the game.
      return (
        <>
          <circle cx="12" cy="9.5" r="6.5" fill="none" strokeWidth="2.6" />
          <path d="M7.5 20 L16.5 20" fill="none" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "paladin":
      // An equal-armed cross.
      return (
        <path
          d="M12 3.5 L12 20.5 M3.5 12 L20.5 12"
          fill="none"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      );
    case "sorceress":
      // An eight-pointed burst.
      return (
        <path d="M22 12 L16.62 13.91 L19.07 19.07 L13.91 16.62 L12 22 L10.09 16.62 L4.93 19.07 L7.38 13.91 L2 12 L7.38 10.09 L4.93 4.93 L10.09 7.38 L12 2 L13.91 7.38 L19.07 4.93 L16.62 10.09 Z" />
      );
    case "warlock":
      // A pentagon with an eye at its centre.
      return (
        <>
          <path
            d="M12 3 L21.04 9.56 L17.58 20.19 L6.42 20.19 L2.96 9.56 Z"
            fill="none"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12.5" r="2.8" />
        </>
      );
  }
}

export function ClassGlyph({
  slug,
  className,
  size = 18,
}: {
  slug: ClassSlug;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      stroke="currentColor"
      className={className ? `shrink-0 ${className}` : "shrink-0"}
    >
      {shape(slug)}
    </svg>
  );
}
