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
 *
 * Stroke weights are deliberately heavy for the size: at 16-18px the first
 * version read as a grey smudge rather than a shape. They stop short of
 * filling the box, because the mark is meant to be scanned alongside the
 * skill's name, not to become the thing you look at first.
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
      return <path d="M4.5 4.5 L19.5 19.5 M19.5 4.5 L4.5 19.5" strokeWidth="3.4" strokeLinecap="round" />;
    case "spell":
      // A four-pointed burst.
      return <path d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z" />;
    case "aura":
      // Concentric rings — something emanating.
      return (
        <>
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="12" cy="12" r="8.4" fill="none" strokeWidth="2.4" />
        </>
      );
    case "passive":
      // A solid core: always on, nothing to activate.
      return <path d="M12 2 L20.6 7 L20.6 17 L12 22 L3.4 17 L3.4 7 Z" />;
    case "summon":
      // Three marks: something else fights for you.
      return (
        <>
          <circle cx="12" cy="5.6" r="3.2" />
          <circle cx="6" cy="16.4" r="3.2" />
          <circle cx="18" cy="16.4" r="3.2" />
        </>
      );
    case "buff":
      // Stacked chevrons pointing up.
      return (
        <path
          d="M4 13.5 L12 5.5 L20 13.5 M4 20 L12 12 L20 20"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "curse":
      // A hook pulling downward.
      return (
        <path
          d="M7.5 3.5 L7.5 14 A4.5 4.5 0 0 0 16.5 14 L16.5 9.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case "shapeshift":
      // A circle split into two halves.
      return (
        <>
          <path d="M12 2.5 A9.5 9.5 0 0 1 12 21.5 Z" />
          <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="2.4" />
        </>
      );
  }
}

export function SkillSigil({
  kind,
  element,
  className,
  size = 22,
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
