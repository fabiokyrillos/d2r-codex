"use client";

import { useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/components/ui";
import type { SkillTreesStrings } from "@/lib/skill-tree-data-pure";

/**
 * The tree control below `sm`: served as three `<a href="#<tree>">` (a jump
 * list, useful without JavaScript and hidden from `sm` up by the stylesheet),
 * enhanced into `role="tablist"` / `role="tab"` with `aria-selected`,
 * `aria-controls` and automatic activation by arrow keys once the island has
 * mounted and only while the viewport is narrow (plan decision 5). A plain
 * click is intercepted; modified clicks and new-tab gestures follow the link.
 *
 * `tab` is the one role R-A11Y-3 admits here, because below `sm` the three
 * trees are genuinely exclusive panels; from `sm` up they are stacked, the
 * control is `display: none`, and it must carry no role at all — a `tablist`
 * over three visible sections would announce a structure the page does not
 * have (mutation M20). So the roles follow `enhanced && narrow`, not
 * `enhanced` alone.
 *
 * Three equal columns with the name wrapping inside the tab, not one row
 * that wraps into two: "Poison and Bone Spells" cost 92 px as a row; as a
 * tab it wraps within its 44 px minimum (plan decision 10).
 */
export interface SkillTreeTabsProps {
  trees: { slug: string; name: string; pointsLabel: string }[];
  active: string;
  enhanced: boolean;
  /** Below `sm`: the tabs are live. From `sm` up the control is hidden and inert. */
  narrow: boolean;
  strings: Pick<SkillTreesStrings, "treesLabel" | "treePointsShort">;
  onSelect: (slug: string) => void;
}

const isPlainPress = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export function SkillTreeTabs({ trees, active, enhanced, narrow, strings, onSelect }: SkillTreeTabsProps): ReactNode {
  const live = enhanced && narrow;
  const navRef = useRef<HTMLElement | null>(null);

  /*
   * Automatic activation (WAI-ARIA APG tabs): the arrows move focus and
   * select in the same press, so a keyboard reader never lands on a tab whose
   * panel is hidden. `preventScroll`, because moving focus is not a request
   * to move the page; the fragment never changes either — `onSelect` is the
   * island's state, not `location.hash`.
   */
  const onKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (!live) return;
    if (event.key === " ") {
      event.preventDefault();
      onSelect(trees[index].slug);
      return;
    }
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? trees.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + trees.length) % trees.length;
    const slug = trees[next].slug;
    navRef.current
      ?.querySelector<HTMLAnchorElement>(`[data-tree-tab="${slug}"]`)
      ?.focus({ preventScroll: true });
    onSelect(slug);
  };

  // Enter is the anchor's own activation and arrives as the click below.
  const onClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (!live || !isPlainPress(event)) return;
    event.preventDefault();
    onSelect(slug);
  };

  return (
    <nav
      ref={navRef}
      data-tree-tabs=""
      aria-label={strings.treesLabel}
      className="mt-3 grid grid-cols-3 gap-2"
      {...(live ? { role: "tablist" } : {})}
    >
      {trees.map((tree, index) => {
        const pressed = tree.slug === active;
        return (
          <a
            key={tree.slug}
            // The id the island's `aria-labelledby` on each tabpanel points at
            // (`${slug}-tab`, plan §5.5): a tabpanel labelled by an id that
            // exists nowhere is a tabpanel with no name.
            id={`${tree.slug}-tab`}
            href={`#${tree.slug}`}
            data-tree-tab={tree.slug}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center rounded border px-1 py-1.5 text-center motion-safe:transition-colors",
              pressed
                ? "border-ember bg-ember-dim/10 text-ember-bright"
                : "border-border bg-surface text-ink hover:border-ink-subtle",
            )}
            {...(live
              ? {
                  role: "tab",
                  "aria-selected": pressed,
                  // The tree's own id: `#<slug>` is the published URL and the
                  // island renders `[data-tree id=<slug>]` (plan §10, contract 5).
                  "aria-controls": tree.slug,
                  tabIndex: pressed ? 0 : -1,
                }
              : {})}
            onClick={(event) => onClick(event, tree.slug)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {/* The widest tree word is "Summoning": 88px at 14px in the display
                font, and a tab at 320px has 80px inside its 4px padding — so
                the size follows the width, 12px at 320 (76px) up to 14px from
                373px, bounded in rem so the reader's text setting still
                scales it. Below 13.5em (320px at 150 %, any phone at 200 %) the
                stylesheet stacks the three tabs in one column instead.
                English in both locales (ADR 0003), so `lang` and hyphenation
                are honest; `wrap-anywhere` is the last resort, never reached
                at 100 % — `anywhere`, not `break-word`, because only the
                former counts as a wrap opportunity for min-content sizing,
                and this span is a centred flex item sized by min-content. */}
            <span lang="en" className="font-display text-[clamp(0.75rem,3.75vw,0.875rem)] leading-tight wrap-anywhere hyphens-auto">
              {tree.name}
            </span>
            {tree.pointsLabel && (
              <span data-tab-points="" className="font-mono text-xs text-ink-muted wrap-anywhere">
                {tree.pointsLabel}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
