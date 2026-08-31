"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * The only interactive part of the skill tree.
 *
 * Everything it shows — tiles and panel bodies alike — is rendered on the
 * server and handed over as elements. This component owns selection and
 * nothing else, so the panel text is in the initial HTML for a reader with no
 * JavaScript and for a crawler that runs none.
 *
 * Three decisions worth knowing about:
 *
 * 1. **The panel is docked, not floating.** It is a sibling column on desktop
 *    and a bottom sheet on mobile, so it can never cover the tile you are
 *    reading — which is both the brief's requirement and WCAG 2.2 SC 2.4.11.
 *    It also makes "hoverable" (SC 1.4.13) trivial rather than a hazard.
 * 2. **Roving tabindex.** A class page has three trees of ten skills; one tab
 *    stop each instead of thirty keeps the Tab order predictable. Arrow keys
 *    move within a tree, which is the standard composite-widget pattern.
 * 3. **A tile never navigates.** It is a button that selects. The only link is
 *    the panel's explicit call to action, so the first tap on mobile cannot
 *    both open the panel and leave the page.
 */

export interface TreeTile {
  slug: string;
  /** Rendered server-side. */
  tile: ReactNode;
  ariaLabel: string;
}

export interface TreeRow {
  level: number;
  rowLabel: string;
  /** Always three entries; null is an empty cell in the 3x6 grid. */
  cells: (TreeTile | null)[];
}

export interface SkillTreeStrings {
  treeLabel: string;
  treeHint: string;
  panelHeading: string;
  panelEmpty: string;
  closePanel: string;
}

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;

export function SkillTreeInteractive({
  rows,
  panels,
  edges,
  strings,
  legend,
}: {
  rows: TreeRow[];
  /** Panel body per slug, rendered on the server. */
  panels: Record<string, ReactNode>;
  /** Prerequisite connectors, in grid coordinates. */
  edges: { from: [number, number]; to: [number, number] }[];
  strings: SkillTreeStrings;
  legend?: ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const panelId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const suppressFocusOpen = useRef(false);

  const flat = rows.flatMap((r) => r.cells.filter((c): c is TreeTile => c !== null));

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => clearTimer, []);

  // Hover only where hovering exists. Gating on a media query rather than on
  // viewport width keeps a touch laptop from getting phantom previews.
  const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const select = useCallback((slug: string, el?: HTMLButtonElement) => {
    clearTimer();
    if (el) lastTrigger.current = el;
    setSelected(slug);
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    clearTimer();
    setSelected(null);
    setSheetOpen(false);
    if (returnFocus && lastTrigger.current) {
      // Returning focus to the tile fires its own focus handler, which would
      // reopen the panel Escape just closed — so Escape would look inert. Skip
      // exactly one focus event, then let ordinary focus open the panel again.
      suppressFocusOpen.current = true;
      lastTrigger.current.focus();
      requestAnimationFrame(() => {
        suppressFocusOpen.current = false;
      });
    }
  }, []);

  // Esc closes and hands focus back to the tile that opened the panel.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close]);

  // `from` is the index of the tile that received the key, not the stored
  // focus index. They agree in normal use, but reading state here would make
  // movement depend on whatever was focused last rather than on the event.
  const move = (delta: number, from: number) => {
    const next = Math.max(0, Math.min(flat.length - 1, from + delta));
    setFocusIndex(next);
    const slug = flat[next]?.slug;
    if (!slug) return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-slug="${slug}"]`);
    el?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, slug: string, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        move(1, index);
        break;
      case "ArrowLeft":
        e.preventDefault();
        move(-1, index);
        break;
      case "ArrowDown":
        e.preventDefault();
        move(3, index);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-3, index);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setFocusIndex(index);
        select(slug, e.currentTarget as HTMLButtonElement);
        setSheetOpen(true);
        break;
    }
  };

  const rowCount = rows.length;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
      {/* ---------------------------------------------------------------- */}
      <div>
        <p className="sr-only" id={`${panelId}-hint`}>
          {strings.treeHint}
        </p>

        <div ref={gridRef} className="relative">
          {/* Prerequisite connectors. The grid has fixed row heights, so exact
              coordinates need no measurement and no client layout pass. */}
          {edges.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
              viewBox={`0 0 3 ${rowCount}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {edges.map((e, i) => (
                <line
                  key={i}
                  x1={e.from[1] - 0.5}
                  y1={e.from[0] - 0.5}
                  x2={e.to[1] - 0.5}
                  y2={e.to[0] - 0.5}
                  className="stroke-border-strong"
                  strokeWidth="0.02"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          )}

          <div className="relative grid gap-2 sm:grid-cols-3 sm:grid-rows-[repeat(6,5.5rem)]">
            {rows.map((row) =>
              row.cells.map((cell, column) => {
                if (!cell) {
                  return (
                    <div
                      key={`${row.level}-${column}`}
                      aria-hidden="true"
                      className="hidden sm:block"
                    />
                  );
                }
                const index = flat.findIndex((f) => f.slug === cell.slug);
                const isSelected = selected === cell.slug;
                return (
                  <button
                    key={cell.slug}
                    type="button"
                    data-slug={cell.slug}
                    aria-label={cell.ariaLabel}
                    aria-expanded={isSelected}
                    aria-controls={panelId}
                    tabIndex={index === focusIndex ? 0 : -1}
                    onFocus={() => {
                      setFocusIndex(index);
                      if (suppressFocusOpen.current) return;
                      select(cell.slug);
                    }}
                    onKeyDown={(e) => onKeyDown(e, cell.slug, index)}
                    onClick={(e) => {
                      setFocusIndex(index);
                      select(cell.slug, e.currentTarget);
                      setSheetOpen(true);
                    }}
                    onPointerEnter={(e) => {
                      if (!canHover()) return;
                      clearTimer();
                      const el = e.currentTarget;
                      timer.current = setTimeout(() => select(cell.slug, el), OPEN_DELAY);
                    }}
                    onPointerLeave={() => {
                      if (!canHover()) return;
                      clearTimer();
                      timer.current = setTimeout(() => setSelected(null), CLOSE_DELAY);
                    }}
                    className={[
                      "group w-full rounded border px-2.5 py-2 text-left transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                      isSelected
                        ? "border-ember bg-surface-raised"
                        : "border-border bg-surface hover:border-border-strong",
                    ].join(" ")}
                  >
                    {cell.tile}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        {legend && <div className="mt-4">{legend}</div>}
      </div>

      {/* ---- docked panel, desktop ------------------------------------- */}
      <aside
        // Moving the pointer into the panel must not dismiss it.
        onPointerEnter={clearTimer}
        onPointerLeave={() => {
          if (!canHover()) return;
          timer.current = setTimeout(() => setSelected(null), CLOSE_DELAY);
        }}
        className="mt-6 hidden lg:sticky lg:top-6 lg:mt-0 lg:block lg:self-start"
      >
        <div
          id={panelId}
          role="region"
          aria-label={strings.panelHeading}
          className="rounded border border-border bg-surface-raised p-4"
        >
          {selected ? (
            panels[selected]
          ) : (
            <p className="text-sm leading-relaxed text-pretty text-ink-subtle">
              {strings.panelEmpty}
            </p>
          )}
        </div>
      </aside>

      {/* ---- bottom sheet, mobile -------------------------------------- */}
      {sheetOpen && selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-abyss/60 lg:hidden"
            onClick={() => close(true)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="false"
            aria-label={strings.panelHeading}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-xl border-t border-border bg-surface-raised p-4 pb-6 lg:hidden"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold tracking-widest text-ink-subtle uppercase">
                {strings.panelHeading}
              </span>
              <button
                type="button"
                onClick={() => close(true)}
                className="rounded border border-border px-2.5 py-1 text-xs text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                {strings.closePanel}
              </button>
            </div>
            {panels[selected]}
          </div>
        </>
      )}
    </div>
  );
}
