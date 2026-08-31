"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import {
  edgeCell,
  firstCell,
  nextHorizontal,
  nextVertical,
  type Cell,
  type Grid,
} from "@/lib/skill-tree-nav";
import { trapTarget } from "@/lib/focus-trap";

/**
 * The only interactive part of the skill tree.
 *
 * Everything it shows — tiles and panel bodies alike — is rendered on the
 * server and handed over as elements, so the interactive layer never receives
 * the content's code.
 *
 * Three decisions worth knowing about:
 *
 * 1. **The panel is docked, not floating.** It is a sibling column on desktop
 *    and a bottom sheet on mobile, so it can never cover the tile you are
 *    reading — the brief's requirement and WCAG 2.2 SC 2.4.11 at once. It also
 *    makes SC 1.4.13's "hoverable" trivial rather than a hazard.
 * 2. **One Tab stop per tree, arrows within.** A class page has three trees of
 *    ten skills; thirty consecutive Tab stops would be hostile. The tree is
 *    therefore declared as a composite widget — `role="grid"` with rows and
 *    cells — so assistive technology is told that model rather than left to
 *    infer it from a pile of buttons.
 * 3. **A tile never navigates.** It is a button that selects. The only link is
 *    the panel's explicit call to action, so a first tap on mobile cannot both
 *    open the panel and leave the page.
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
  edges: {
    from: [number, number];
    to: [number, number];
    fromSlug: string;
    toSlug: string;
  }[];
  strings: SkillTreeStrings;
  legend?: ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const hintId = `${baseId}-hint`;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const suppressFocusOpen = useRef(false);

  /**
   * The occupancy grid the movement functions work on. They live in
   * `lib/skill-tree-nav` so that `test:nav` can exercise this exact code
   * instead of a copy of it.
   */
  const grid: Grid = rows.map((r) => r.cells);
  const at = (row: number, col: number): TreeTile | null => rows[row]?.cells[col] ?? null;

  const [focusCell, setFocusCell] = useState<Cell>(() => firstCell(grid));

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
      // A macrotask, not requestAnimationFrame: rAF is paused in a background
      // tab, which would leave the flag stuck and quietly disable focus-to-open
      // for the rest of the session. The focus event fires synchronously during
      // .focus(), so anything after this tick is late enough.
      setTimeout(() => {
        suppressFocusOpen.current = false;
      }, 0);
    }
  }, []);

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

  /**
   * The bottom sheet is modal; the docked desktop panel is not.
   *
   * They are different things wearing the same content. The desktop panel is a
   * sibling column that covers nothing, so the page behind it stays usable and
   * it is a `region`. The sheet is an overlay with a scrim that swallows every
   * pointer event, and it used to declare `aria-modal="false"` while doing so —
   * telling assistive technology the page behind was still available when a
   * sighted mouse user could not reach it, and leaving Tab free to wander into
   * content hidden behind the scrim.
   *
   * So it is now modal in the way it already behaved: focus moves in, Tab and
   * Shift+Tab cycle within, and focus returns to the tile on close.
   */
  const sheetRef = useRef<HTMLDivElement>(null);
  const focusablesIn = (root: HTMLElement) =>
    [
      ...root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((el) => el.offsetParent !== null || el === document.activeElement);

  useEffect(() => {
    if (!sheetOpen || !selected) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    /*
     * Above `lg` the sheet is `display: none` and the docked panel is what the
     * reader sees. `display: none` also takes the sheet out of the
     * accessibility tree, so `aria-modal` says nothing there — but the effect
     * would still run, and a trap installed over a hidden dialog would swallow
     * Tab for a desktop keyboard user.
     *
     * Checked rather than inferred. It already worked, because a hidden element
     * has no laid-out focusables and an empty trap declines to trap — but that
     * is a coincidence of two other decisions, and it would break silently if
     * either changed.
     */
    if (sheet.getClientRects().length === 0) return;

    // Initial focus inside the sheet, on its close control: the first thing a
    // screen-reader user needs is the way out, and it is a stable target
    // whatever the panel body happens to contain.
    const first = focusablesIn(sheet)[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusablesIn(sheet);
      const target = trapTarget(
        items.length,
        items.indexOf(document.activeElement as HTMLElement),
        e.shiftKey,
      );
      if (target === null) return;
      e.preventDefault();
      items[target].focus();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [sheetOpen, selected]);

  const focusOn = (cell: Cell | null) => {
    if (!cell) return;
    const tile = at(cell.row, cell.col);
    if (!tile) return;
    setFocusCell(cell);
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-slug="${tile.slug}"]`)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, cell: Cell, slug: string) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusOn(nextHorizontal(grid, cell, 1));
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusOn(nextHorizontal(grid, cell, -1));
        break;
      case "ArrowDown":
        e.preventDefault();
        focusOn(nextVertical(grid, cell, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        focusOn(nextVertical(grid, cell, -1));
        break;
      case "Home":
        e.preventDefault();
        focusOn(edgeCell(grid, false));
        break;
      case "End":
        e.preventDefault();
        focusOn(edgeCell(grid, true));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setFocusCell(cell);
        select(slug, e.currentTarget as HTMLButtonElement);
        setSheetOpen(true);
        break;
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
      {/* ---------------------------------------------------------------- */}
      <div>
        {/* Visible, not screen-reader-only: a keyboard user who can see the
            page still has to be told that arrows are how this moves. */}
        <p id={hintId} className="mb-2 text-xs text-ink-muted">
          {strings.treeHint}
        </p>

        <div className="sm:flex sm:items-stretch sm:gap-3">
          {/* A level rail, so the row grouping is visible above `sm` too — the
              mobile headers already carry it below. Aria-hidden because every
              tile's accessible name already states its level, and repeating it
              per row would say it twice. */}
          <div
            aria-hidden="true"
            className="hidden shrink-0 sm:grid sm:grid-rows-[repeat(6,5.5rem)] sm:gap-2"
          >
            {rows.map((row) => (
              <div
                key={row.level}
                className="flex w-9 items-center justify-end border-r border-border pr-2"
              >
                <span className="font-mono text-[0.6875rem] text-ink-muted">{row.level}</span>
              </div>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
          {/* Prerequisite connectors. The grid has fixed row heights, so exact
              coordinates need no measurement and no client layout pass. */}
          {edges.length > 0 && (
            /*
             * `vectorEffect="non-scaling-stroke"` means strokeWidth is read in
             * device pixels, not user units — so the original 0.02 drew a line
             * two hundredths of a pixel wide, which is why the connectors were
             * invisible.
             *
             * `border-strong` measured 1.71:1 against this background, under
             * the 3:1 WCAG 1.4.11 asks of a graphic that carries meaning.
             * `ink-subtle` is the dimmest token already in the system that
             * clears it, at 4.19:1, and stays neutral enough to sit behind the
             * tiles rather than compete with them.
             */
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
              viewBox={`0 0 3 ${rows.length}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {edges.map((e, i) => {
                // An edge touching the selected skill is drawn heavier as well
                // as brighter, so the relationship survives without colour.
                const related =
                  selected !== null && (e.fromSlug === selected || e.toSlug === selected);
                return (
                  <line
                    key={i}
                    x1={e.from[1] - 0.5}
                    y1={e.from[0] - 0.5}
                    x2={e.to[1] - 0.5}
                    y2={e.to[0] - 0.5}
                    className={
                      related
                        ? "stroke-ember motion-safe:transition-colors"
                        : "stroke-ink-subtle motion-safe:transition-colors"
                    }
                    strokeWidth={related ? 3 : 2}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
          )}

          <div
            ref={gridRef}
            role="grid"
            aria-label={strings.treeLabel}
            aria-describedby={hintId}
            className="relative grid gap-2 sm:grid-cols-3 sm:grid-rows-[repeat(6,5.5rem)]"
          >
            {rows.map((row, rowIndex) => (
              // `display: contents` lets the row carry the ARIA structure
              // without becoming a layout box inside the CSS grid.
              <div key={row.level} role="row" aria-label={row.rowLabel} className="contents">
                {/* Below `sm` the grid collapses to one column and the row
                    structure — which is the level grouping — stops being
                    visible. This puts it back, and only there: above `sm` the
                    rows read as rows on their own. */}
                <p
                  aria-hidden="true"
                  className="mt-2 border-b border-border pb-1 text-[0.6875rem] font-semibold tracking-widest text-ink-muted uppercase first:mt-0 sm:hidden"
                >
                  {row.rowLabel}
                </p>
                {row.cells.map((cell, col) => {
                  if (!cell) {
                    return (
                      <div
                        key={`${row.level}-${col}`}
                        role="gridcell"
                        aria-hidden="true"
                        className="hidden sm:block"
                      />
                    );
                  }
                  const isSelected = selected === cell.slug;
                  const isTabStop = rowIndex === focusCell.row && col === focusCell.col;
                  return (
                    <div key={cell.slug} role="gridcell" className="min-w-0">
                      <button
                        type="button"
                        data-slug={cell.slug}
                        data-row={rowIndex}
                        data-col={col}
                        aria-label={cell.ariaLabel}
                        // `aria-expanded` is the only selection signal, and it
                        // means exactly one thing: this skill's details are the
                        // ones currently in the panel. Deliberately no
                        // `aria-current` -- that is for the current page, step
                        // or date, not a detail pane -- and no `aria-selected`,
                        // which would be a second name for the same state.
                        aria-expanded={isSelected}
                        aria-controls={panelId}
                        tabIndex={isTabStop ? 0 : -1}
                        onFocus={() => {
                          setFocusCell({ row: rowIndex, col });
                          if (suppressFocusOpen.current) return;
                          select(cell.slug);
                        }}
                        onKeyDown={(e) => onKeyDown(e, { row: rowIndex, col }, cell.slug)}
                        onClick={(e) => {
                          setFocusCell({ row: rowIndex, col });
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
                          "group h-full w-full rounded border px-2.5 py-2 text-left transition-colors",
                          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ember",
                          isSelected
                            ? "border-ember bg-surface-raised"
                            : "border-border bg-surface hover:border-border-strong",
                        ].join(" ")}
                      >
                        {cell.tile}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          </div>
        </div>

        {legend && <div className="mt-4">{legend}</div>}
      </div>

      {/* ---- docked panel, desktop -------------------------------------
          `hidden lg:block` keeps this out of the accessibility tree below the
          breakpoint, and the sheet below is `lg:hidden`, so exactly one of the
          two is ever exposed. They never announce the same content twice. */}
      <aside
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
            <p className="text-sm leading-relaxed text-pretty text-ink-muted">
              {strings.panelEmpty}
            </p>
          )}
        </div>
      </aside>

      {/* ---- bottom sheet, mobile --------------------------------------
          Unmounted when closed, so a dismissed sheet leaves nothing behind for
          a screen reader to reach. */}
      {sheetOpen && selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-abyss/60 lg:hidden"
            onClick={() => close(true)}
            aria-hidden="true"
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={strings.panelHeading}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col rounded-t-xl border-t border-border bg-surface-raised lg:hidden"
          >
            {/* The close control sits in a fixed header the body scrolls
                under, so long Portuguese copy cannot push it out of reach. */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <span className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
                {strings.panelHeading}
              </span>
              <button
                type="button"
                onClick={() => close(true)}
                className="rounded border border-border px-2.5 py-1 text-xs text-ink-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                {strings.closePanel}
              </button>
            </div>
            <div className="overflow-y-auto px-4 pt-3 pb-6">{panels[selected]}</div>
          </div>
        </>
      )}
    </div>
  );
}
