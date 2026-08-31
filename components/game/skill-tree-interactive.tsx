"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

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
const COLUMNS = 3;

interface Cell {
  row: number;
  col: number;
}

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
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const hintId = `${baseId}-hint`;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const suppressFocusOpen = useRef(false);

  const at = (row: number, col: number): TreeTile | null => rows[row]?.cells[col] ?? null;

  /** The first filled cell, so the tree always has exactly one Tab stop. */
  const firstCell = (): Cell => {
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < COLUMNS; c++) if (rows[r].cells[c]) return { row: r, col: c };
    }
    return { row: 0, col: 0 };
  };
  const [focusCell, setFocusCell] = useState<Cell>(firstCell);

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
   * Grid-aware movement.
   *
   * The first version walked a flattened list of filled cells, so ArrowDown
   * moved "three tiles onward" rather than one row down — and since rows hold
   * one, two or three skills, that landed two rows away as often as not. These
   * walk the real grid: empty cells are skipped rather than entered, and
   * horizontal movement continues into the neighbouring row at a row edge so
   * that every skill stays reachable by arrows alone.
   */
  const nextHorizontal = (from: Cell, dir: 1 | -1): Cell | null => {
    for (let c = from.col + dir; c >= 0 && c < COLUMNS; c += dir) {
      if (at(from.row, c)) return { row: from.row, col: c };
    }
    for (let r = from.row + dir; r >= 0 && r < rows.length; r += dir) {
      const scan = dir > 0 ? [0, 1, 2] : [2, 1, 0];
      for (const c of scan) if (at(r, c)) return { row: r, col: c };
    }
    return null;
  };

  const nextVertical = (from: Cell, dir: 1 | -1): Cell | null => {
    for (let r = from.row + dir; r >= 0 && r < rows.length; r += dir) {
      // Same column first, then the nearest column in that row, so vertical
      // movement stays vertical wherever the grid allows it.
      for (const c of [from.col, from.col - 1, from.col + 1, from.col - 2, from.col + 2]) {
        if (c < 0 || c >= COLUMNS) continue;
        if (at(r, c)) return { row: r, col: c };
      }
    }
    return null;
  };

  const edgeCell = (last: boolean): Cell => {
    const rowOrder = last ? [...rows.keys()].reverse() : [...rows.keys()];
    for (const r of rowOrder) {
      for (const c of last ? [2, 1, 0] : [0, 1, 2]) if (at(r, c)) return { row: r, col: c };
    }
    return focusCell;
  };

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
        focusOn(nextHorizontal(cell, 1));
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusOn(nextHorizontal(cell, -1));
        break;
      case "ArrowDown":
        e.preventDefault();
        focusOn(nextVertical(cell, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        focusOn(nextVertical(cell, -1));
        break;
      case "Home":
        e.preventDefault();
        focusOn(edgeCell(false));
        break;
      case "End":
        e.preventDefault();
        focusOn(edgeCell(true));
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
        <p id={hintId} className="mb-2 text-xs text-ink-subtle">
          {strings.treeHint}
        </p>

        <div className="relative">
          {/* Prerequisite connectors. The grid has fixed row heights, so exact
              coordinates need no measurement and no client layout pass. */}
          {edges.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
              viewBox={`0 0 3 ${rows.length}`}
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
                  className="mt-2 border-b border-border pb-1 text-[0.6875rem] font-semibold tracking-widest text-ink-subtle uppercase first:mt-0 sm:hidden"
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
            <p className="text-sm leading-relaxed text-pretty text-ink-subtle">
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
            role="dialog"
            aria-modal="false"
            aria-label={strings.panelHeading}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col rounded-t-xl border-t border-border bg-surface-raised lg:hidden"
          >
            {/* The close control sits in a fixed header the body scrolls
                under, so long Portuguese copy cannot push it out of reach. */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <span className="text-xs font-semibold tracking-widest text-ink-subtle uppercase">
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
