"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { SkillLevelControl, SkillLevelSkeleton } from "@/components/game/skill-level-control";
import { SkillTreeGrid } from "@/components/game/skill-tree-grid";
import { SkillTreeLegend } from "@/components/game/skill-tree-legend";
import { SkillTreePanel } from "@/components/game/skill-tree-panel";
import { SkillTreeTabs } from "@/components/game/skill-tree-tabs";
import { useNameFit } from "@/components/game/use-name-fit";
import { trapTarget } from "@/lib/focus-trap";
import { LEVEL_EVENT, LEVEL_KEY, readLevel } from "@/lib/prefs";
import { lockScroll } from "@/lib/scroll-lock";
import {
  fill,
  nodeState,
  type SkillTreesData,
  type TreeData,
  type TreeNodeData,
} from "@/lib/skill-tree-data-pure";
import { relatedEdges } from "@/lib/skill-tree-geometry";
import {
  edgeCell,
  firstCell,
  nextHorizontal,
  nextVertical,
  type Cell,
  type Grid,
} from "@/lib/skill-tree-nav";
import {
  initialState,
  reduce,
  shownSlug,
  type TreeEvent,
  type TreeUiContext,
  type TreeUiState,
} from "@/lib/skill-tree-state";

/**
 * The skill-tree section's one client island: the tabs below `sm`, the three
 * trees, the shared legend, "My level", the docked panel from `lg` up, the
 * bottom sheet below it, and one live region written only on a confirmed
 * selection (plan §6, decision 11).
 *
 * **Its first client render is byte-identical to the server's** — links, no
 * tab roles, no level control, nothing `hidden` — and a layout effect then
 * turns `enhanced` on, reads `matchMedia`, `readLevel()` and `location.hash`,
 * and marks `data-trees-ready`. The pattern of `tier-selector.tsx`: React only
 * ever compares the first render, so the enhancement is an ordinary state
 * update, and it happens before paint so the pre-hydration stylesheet
 * (decision 6) hands over to the `hidden` attribute without a frame between.
 *
 * **It decides nothing about interaction.** Every gesture becomes a
 * `TreeEvent` and goes through `reduce` (`lib/skill-tree-state.ts`), which is
 * where the PRD's semantics live and are tested: hover previews without
 * changing the selection (R-TREE-11), a second tap that never closes
 * (R-TREE-12), a live announcement only on confirmation (R-TREE-14). The grid
 * is presentational and gets the reduced state as props.
 *
 * Everything it shows comes from `data`; it imports no dictionary, no
 * registry and no content (`scripts/client-boundary.test.ts`).
 *
 * Breakpoints are the same `rem` queries as Tailwind's `sm:` and `lg:`, read
 * through `matchMedia` rather than viewport width, so text scaling moves the
 * island and the stylesheet together (Phase 2 §10.6).
 */

const NARROW = "(width < 40rem)";
const WIDE = "(width >= 64rem)";
const HOVER = "(hover: hover)";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** The tab id the tree panels are labelled by (plan §10, contract 5; `SkillTreeTabs` renders it). */
const tabId = (slug: string) => `${slug}-tab`;


interface View {
  enhanced: boolean;
  /** Below `sm`: one tree at a time, tabs live. */
  narrow: boolean;
  /** `lg` and up: the panel is docked, activating never opens a sheet. */
  wide: boolean;
  /** The level preference (`LEVEL_KEY`), or null when unset. Never changes any data. */
  level: number | null;
}

export function SkillTrees({ data }: { data: SkillTreesData }): ReactNode {
  const { strings } = data;
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const sheetId = `${baseId}-sheet`;

  /*
   * One state object rather than four, for the reason `tier-selector.tsx`
   * gives: the enhancement effect sets all of them at once.
   */
  const [view, setView] = useState<View>({ enhanced: false, narrow: false, wide: false, level: null });
  const { enhanced, narrow, wide, level } = view;
  const [ui, setUi] = useState<TreeUiState>(() => initialState(data.defaultTree));
  /** The roving tab stop of each tree, kept per tree so switching tabs restores it. */
  const [focus, setFocus] = useState<Record<string, Cell>>(() =>
    Object.fromEntries(data.trees.map((tree) => [tree.slug, firstCell(gridOf(tree))])),
  );
  const [announced, setAnnounced] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const suppressFocusPreview = useRef(false);

  const glyph = useNameFit(rootRef, [ui.activeTree, enhanced]);

  /** Every node of the class by slug, with its tree — what the panel's links resolve through. */
  const index = useMemo(() => {
    const map = new Map<string, { node: TreeNodeData; tree: TreeData }>();
    for (const tree of data.trees) {
      for (const row of tree.rows) for (const node of row.cells) if (node) map.set(node.slug, { node, tree });
    }
    return map;
  }, [data]);
  const lookup = useCallback((slug: string) => index.get(slug)?.node, [index]);

  const treeFromHash = useCallback(
    (hash: string) => {
      const slug = hash.startsWith("#") ? hash.slice(1) : "";
      return data.trees.some((tree) => tree.slug === slug) ? slug : null;
    },
    [data.trees],
  );

  const stateLabels = useMemo(
    () => ({
      locked: strings.stateLocked,
      available: strings.stateAvailable,
      invested: strings.stateInvested,
      maxed: strings.stateMaxed,
    }),
    [strings],
  );

  /*
   * Stable across renders on purpose: the mount effect below depends on it,
   * and a `dispatch` that changed with `wide` would re-run that effect on
   * every crossing of `lg` — re-applying the hash's tree over the tab the
   * reader had switched to. Both media facts are read at event time instead:
   * a touch laptop's mouse can arrive after mount, and the same query the
   * render uses for the sheet answers `wide` here, so the two cannot disagree.
   */
  const dispatch = useCallback(
    (event: TreeEvent) => {
      const ctx: TreeUiContext = {
        hoverCapable: typeof window !== "undefined" && window.matchMedia(HOVER).matches,
        wide: typeof window !== "undefined" && window.matchMedia(WIDE).matches,
        announceTemplate: strings.announceSelected,
        stateLabels,
      };
      setUi((prev) => reduce(prev, event, ctx));
    },
    [strings.announceSelected, stateLabels],
  );

  /*
   * The enhancement, before paint and deliberately synchronous — see
   * `tier-selector.tsx` for why a layout effect and not `useEffect`: the
   * pre-hydration stylesheet is already hiding two trees below `sm`, and the
   * hand-over to the `hidden` attribute must not paint a frame with three.
   *
   * eslint-disable, with the reason: the "cascading renders" rule is about
   * effects that set state in response to their own output. This sets it
   * once, from sources that cannot be read during render.
   */
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setView({
      enhanced: true,
      narrow: window.matchMedia(NARROW).matches,
      wide: window.matchMedia(WIDE).matches,
      level: readLevel(),
    });
    const fromHash = treeFromHash(window.location.hash);
    if (fromHash) dispatch({ type: "switch-tree", tree: fromHash });
  }, [treeFromHash, dispatch]);

  /* The four sources that can change the view after mount. */
  useEffect(() => {
    const narrowQuery = window.matchMedia(NARROW);
    const wideQuery = window.matchMedia(WIDE);
    const onNarrow = () => setView((v) => ({ ...v, narrow: narrowQuery.matches }));
    const onWide = () => setView((v) => ({ ...v, wide: wideQuery.matches }));
    const onHash = () => {
      const tree = treeFromHash(window.location.hash);
      if (tree) dispatch({ type: "switch-tree", tree });
    };
    const onLevel = () => setView((v) => ({ ...v, level: readLevel() }));
    // `key === null` is `localStorage.clear()` from another tab.
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === LEVEL_KEY) onLevel();
    };
    narrowQuery.addEventListener("change", onNarrow);
    wideQuery.addEventListener("change", onWide);
    window.addEventListener("hashchange", onHash);
    window.addEventListener(LEVEL_EVENT, onLevel);
    window.addEventListener("storage", onStorage);
    return () => {
      narrowQuery.removeEventListener("change", onNarrow);
      wideQuery.removeEventListener("change", onWide);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener(LEVEL_EVENT, onLevel);
      window.removeEventListener("storage", onStorage);
    };
  }, [treeFromHash, dispatch]);

  /*
   * The live region is written from `announce` and never cleared: emptying it
   * and refilling it with the same text makes some screen readers say it
   * twice. `announce` itself is consumed at once so a later re-render cannot
   * repeat it (§5.3).
   *
   * eslint-disable, with the reason: this is the one hand-over from the
   * reducer's output to the DOM, and it happens exactly once per announcement.
   */
  useEffect(() => {
    if (ui.announce === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setAnnounced(ui.announce);
    dispatch({ type: "announced" });
  }, [ui.announce, dispatch]);

  const sheetVisible = enhanced && !wide && ui.sheetOpen && ui.selected !== null;

  /**
   * Closing returns focus to the node the selection came from, skipping the
   * one focus event that return fires: a focus previews the node (decision 7),
   * and a preview of what Escape just dismissed would make Escape look inert.
   * A macrotask rather than rAF, which is paused in a background tab and would
   * leave the flag stuck.
   */
  const close = useCallback(
    (via: "escape" | "close") => {
      const slug = ui.selected;
      dispatch({ type: via });
      if (!slug) return;
      const node = rootRef.current?.querySelector<HTMLElement>(`[data-node="${slug}"]`);
      if (!node) return;
      suppressFocusPreview.current = true;
      node.focus({ preventScroll: true });
      setTimeout(() => {
        suppressFocusPreview.current = false;
      }, 0);
    },
    [ui.selected, dispatch],
  );

  /*
   * Escape while a selection exists (R-TREE-13). With the sheet open it is
   * modal and Escape closes it from anywhere — focus is trapped inside. With
   * the docked panel it is scoped: only while focus is in the section, and
   * only if nothing else took the key — the search dialog, the mobile
   * navigation and the sections sheet all close on Escape and return focus
   * to their triggers, and a window listener that ran after them would
   * clear the reader's selection and pull focus back to a node (review M2).
   */
  useEffect(() => {
    if (ui.selected === null) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (!sheetVisible) {
        const active = document.activeElement;
        // In the section, but not in the level field: Escape there is the
        // field's own business, not a request to drop the selection.
        if (!rootRef.current?.contains(active) || active?.closest("form[data-level]")) return;
      }
      event.preventDefault();
      close("escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui.selected, sheetVisible, close]);

  /*
   * The sheet is modal in the way it behaves: scrim, scroll held, Tab held,
   * focus in on open and back on close (R-A11Y-9). The docked panel from `lg`
   * up is a sibling region and none of this applies to it — `sheetVisible`
   * is false there, so no lock is ever taken over a hidden dialog.
   */
  useEffect(() => {
    if (!sheetVisible) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const unlock = lockScroll(document.body);
    // The way out first: a stable target whatever the panel body contains.
    closeRef.current?.focus();
    const focusables = () =>
      [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      const target = trapTarget(
        items.length,
        items.indexOf(document.activeElement as HTMLElement),
        event.shiftKey,
      );
      if (target === null) return;
      event.preventDefault();
      items[target].focus();
    };
    // Capture, so nothing between here and the document swallows it first.
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      unlock();
    };
  }, [sheetVisible, ui.selected]);

  // ---- node gestures ------------------------------------------------------

  const onNodeFocus = (tree: TreeData, slug: string, cell: Cell) => {
    setFocus((f) => ({ ...f, [tree.slug]: cell }));
    if (suppressFocusPreview.current) return;
    dispatch({ type: "focus", slug });
  };

  const onNodeBlur = () => dispatch({ type: "blur" });

  const onNodeHoverIn = (slug: string) => {
    // Gated here as well as in the reducer: a phantom preview on a touch
    // screen is the defect, and two guards are cheaper than one regression.
    if (!window.matchMedia(HOVER).matches) return;
    dispatch({ type: "hover-in", slug });
  };

  const onNodeHoverOut = () => dispatch({ type: "hover-out" });

  const activate = (tree: TreeData, slug: string, cell: Cell) => {
    const node = index.get(slug)?.node;
    if (!node) return;
    setFocus((f) => ({ ...f, [tree.slug]: cell }));
    dispatch({ type: "activate", slug, name: node.name, state: nodeState(node, level) });
  };

  const onNodeKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    tree: TreeData,
    slug: string,
    cell: Cell,
  ) => {
    const grid = gridOf(tree);
    let target: Cell | null = null;
    switch (event.key) {
      case "ArrowRight":
        target = nextHorizontal(grid, cell, 1);
        break;
      case "ArrowLeft":
        target = nextHorizontal(grid, cell, -1);
        break;
      case "ArrowDown":
        target = nextVertical(grid, cell, 1);
        break;
      case "ArrowUp":
        target = nextVertical(grid, cell, -1);
        break;
      case "Home":
        target = edgeCell(grid, false);
        break;
      case "End":
        target = edgeCell(grid, true);
        break;
      case " ":
        // Space on an `<a role="button">` would otherwise scroll the page.
        event.preventDefault();
        activate(tree, slug, cell);
        return;
      // Enter is the anchor's own activation and arrives as the click the
      // grid intercepts — once, and only when plain: Ctrl/Cmd/Shift+Enter
      // keep following the link, like the modified clicks (decision 2, the
      // `class-chip.tsx` rule; the tab control does the same).
      default:
        return;
    }
    event.preventDefault();
    if (!target) return;
    const next = tree.rows[target.row]?.cells[target.col];
    if (!next) return;
    setFocus((f) => ({ ...f, [tree.slug]: target }));
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-tree="${tree.slug}"] [data-node="${next.slug}"]`)
      ?.focus();
  };

  // ---- what the panel shows ------------------------------------------------

  const shown = shownSlug(ui);
  const shownEntry = shown ? index.get(shown) : undefined;
  const panel = (
    <SkillTreePanel
      node={shownEntry?.node ?? null}
      treeName={shownEntry?.tree.name ?? ""}
      state={shownEntry ? nodeState(shownEntry.node, level) : "available"}
      inBuild={data.inBuild}
      lookup={lookup}
      strings={strings}
    />
  );

  /*
   * The tab prints `pointsLabel` verbatim in `font-mono text-xs`, so it gets
   * the short form ("84/200"); the long one ("84 of 200 points in this
   * tree") is the tree heading's, on `[data-tree-points]`. Build pages only.
   */
  const tabs = data.trees.map((tree) => ({
    slug: tree.slug,
    name: tree.name,
    pointsLabel: data.inBuild
      ? fill(strings.treePointsShort, { points: tree.points, max: tree.maxPoints })
      : "",
  }));

  return (
    <div
      ref={rootRef}
      data-trees=""
      data-trees-ready={enhanced ? "" : undefined}
      data-glyph={glyph ? "" : undefined}
      className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6"
    >
      <div>
        <SkillTreeTabs
          trees={tabs}
          active={ui.activeTree}
          enhanced={enhanced}
          narrow={narrow}
          strings={strings}
          // The tab keeps focus; only the panels change (R-TREE-8, C3).
          onSelect={(slug) => dispatch({ type: "switch-tree", tree: slug })}
        />

        {data.trees.map((tree) => {
          const tabbed = enhanced && narrow;
          return (
            /*
             * `id={tree.slug}` is the published URL (`routes.skillTree`), and
             * this is its only element on the page. `hidden` rather than
             * `aria-hidden` (R-TREE-8): an inactive tree leaves the tab order
             * as well as the accessibility tree. A region named by its own
             * heading, as the old tree's `<section aria-label>` was (decision
             * 5) — a `div` with the role rather than a `<section id>`, which
             * the build page's table of contents would count as a section of
             * its own; below `sm` the same element is the tab's panel, named
             * by the tab.
             */
            <div
              key={tree.slug}
              id={tree.slug}
              data-tree={tree.slug}
              data-tree-default={tree.slug === data.defaultTree ? "" : undefined}
              hidden={tabbed && ui.activeTree !== tree.slug}
              role={tabbed ? "tabpanel" : "region"}
              aria-labelledby={tabbed ? tabId(tree.slug) : `${tree.slug}-title`}
              // Below `sm` only one tree is shown, so every tree gets the
              // first tree's margin — the §8.1 box is the same whichever tab
              // is active (review L11); stacked from `sm`, the others get more.
              className="mt-3 scroll-mt-24 sm:mt-6 sm:first:mt-3"
            >
              <SkillTreeGrid
                tree={tree}
                inBuild={data.inBuild}
                enhanced={enhanced}
                glyph={glyph}
                focusCell={focus[tree.slug]}
                shownSlug={shown}
                selectedSlug={ui.selected}
                relatedEdges={relatedEdges(shown, tree.edges)}
                // What the node controls is whatever is exposed at this width:
                // the docked region from `lg`, the sheet while it is open,
                // nothing otherwise — never an id that is `display: none`
                // or not in the document (review L7).
                controlsId={wide ? panelId : sheetVisible ? sheetId : undefined}
                strings={strings}
                stateOf={(node) => nodeState(node, level)}
                onNodeFocus={(slug, cell) => onNodeFocus(tree, slug, cell)}
                onNodeBlur={onNodeBlur}
                onNodeKeyDown={(event, slug, cell) => onNodeKeyDown(event, tree, slug, cell)}
                onNodeActivate={(slug, cell) => activate(tree, slug, cell)}
                onNodeHoverIn={onNodeHoverIn}
                onNodeHoverOut={onNodeHoverOut}
              />
            </div>
          );
        })}

        <SkillTreeLegend inBuild={data.inBuild} strings={strings} />

        {/* Last block of the section (decision 10). The control is client-only
            (R-PREF-4), but its box is not: the server render carries an inert
            skeleton of the same shape under `(scripting: enabled)`, so the
            section is as tall before hydration as after and nothing below it
            moves — a reader who arrived at `#gear-budget` on a build page
            landed 56px late while the control was inserted bare (2026-09-11,
            the locale-switch gate). Without scripts the slot collapses. */}
        <div data-level-slot="" className="tree-level-slot">
          {enhanced ? (
            <SkillLevelControl
              level={level}
              onChange={(next) => setView((v) => ({ ...v, level: next }))}
              strings={strings}
            />
          ) : (
            <SkillLevelSkeleton strings={strings} />
          )}
        </div>
      </div>

      {/* ---- docked panel, `lg` and up ----------------------------------
          `hidden lg:block` keeps it out of the accessibility tree below the
          breakpoint, and the sheet is `lg:hidden`, so exactly one of the two
          is ever exposed. A region, not a dialog: it covers nothing. */}
      <aside className="mt-6 hidden lg:sticky lg:top-6 lg:mt-0 lg:block lg:self-start">
        <div
          id={panelId}
          data-panel=""
          role="region"
          aria-label={strings.panelHeading}
          className="rounded border border-border bg-surface-raised p-4"
        >
          {panel}
        </div>
      </aside>

      {/* ---- bottom sheet, below `lg` ------------------------------------
          Unmounted when closed, so a dismissed sheet leaves nothing behind
          for a screen reader to reach. */}
      {sheetVisible && (
        <>
          <div
            data-scrim=""
            aria-hidden="true"
            onClick={() => close("close")}
            className="fixed inset-0 z-40 bg-abyss/60 lg:hidden"
          />
          <div
            ref={sheetRef}
            id={sheetId}
            role="dialog"
            aria-modal="true"
            aria-label={strings.panelHeading}
            data-sheet=""
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col rounded-t-xl border-t border-border bg-surface-raised lg:hidden"
          >
            {/* The close control sits in a fixed header the body scrolls
                under, so long Portuguese copy cannot push it out of reach. */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <span className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
                {strings.panelHeading}
              </span>
              <button
                ref={closeRef}
                type="button"
                data-close-sheet=""
                onClick={() => close("close")}
                className="min-h-11 rounded border border-border px-3 text-sm text-ink-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                {strings.closePanel}
              </button>
            </div>
            <div className="overflow-y-auto px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {panel}
            </div>
          </div>
        </>
      )}

      {/* Written only on a confirmed selection — never on focus, never on
          hover (R-TREE-14, C7). */}
      <p data-live="" role="status" aria-live="polite" className="sr-only">
        {announced}
      </p>
    </div>
  );
}

/** The occupancy grid the movement functions work on (`lib/skill-tree-nav`). */
function gridOf(tree: TreeData): Grid {
  return tree.rows.map((row) => row.cells);
}
