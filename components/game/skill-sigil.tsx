import type { Element, SkillKind } from "@/lib/types";
import { cn } from "@/components/ui";

/**
 * The mark on a skill tile.
 *
 * Deliberately NOT an icon. Blizzard's skill art is not licensable, and
 * drawing sixty substitutes would only put identity back into a picture. So
 * the mark carries *category* — shape for what kind of skill it is, colour for
 * its element — and the skill's **name** does the identifying, in visible text
 * next to it. That also means the tree never depends on colour alone and never
 * needs a hover to be readable.
 *
 * Every path here is plain geometry authored for this project. Nothing is
 * traced from, or derived from, any game asset or third-party site.
 */

const elementClass: Record<Element, string> = {
  physical: "text-el-physical",
  magic: "text-el-magic",
  fire: "text-el-fire",
  cold: "text-el-cold",
  lightning: "text-el-lightning",
  poison: "text-el-poison",
};

/** One path per skill kind, drawn in a 24x24 box and tinted by currentColor. */
function shape(kind: SkillKind) {
  switch (kind) {
    case "attack":
      // Two crossed strokes — a strike.
      return <path d="M5 5 L19 19 M19 5 L5 19" strokeWidth="2.5" strokeLinecap="round" />;
    case "spell":
      // A four-pointed burst.
      return <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />;
    case "aura":
      // Concentric rings — something emanating.
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="7.5" fill="none" strokeWidth="1.6" />
        </>
      );
    case "passive":
      // A solid core: always on, nothing to activate.
      return <path d="M12 3 L20 7.5 L20 16.5 L12 21 L4 16.5 L4 7.5 Z" />;
    case "summon":
      // Three marks: something else fights for you.
      return (
        <>
          <circle cx="12" cy="6" r="2.6" />
          <circle cx="6.5" cy="16" r="2.6" />
          <circle cx="17.5" cy="16" r="2.6" />
        </>
      );
    case "buff":
      // Stacked chevrons pointing up.
      return (
        <path
          d="M5 13 L12 6 L19 13 M5 19 L12 12 L19 19"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "curse":
      // A hook pulling downward.
      return (
        <path
          d="M8 4 L8 14 A4 4 0 0 0 16 14 L16 10"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      );
    case "shapeshift":
      // A circle split into two halves.
      return (
        <>
          <path d="M12 3 A9 9 0 0 1 12 21 Z" />
          <circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.6" />
        </>
      );
  }
}

export function SkillSigil({
  kind,
  element,
  className,
  size = 20,
}: {
  kind: SkillKind;
  element?: Element;
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
      className={cn(
        "shrink-0",
        element ? elementClass[element] : "text-ink-subtle",
        className,
      )}
    >
      {shape(kind)}
    </svg>
  );
}
