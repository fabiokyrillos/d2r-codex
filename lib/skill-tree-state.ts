/**
 * The interaction state of the skill-tree section, as a pure reducer.
 *
 * Extracted so the semantics the PRD names — hover previews without changing
 * the confirmed selection (R-TREE-11), a second tap that never closes
 * (R-TREE-12), a live announcement only on confirmation (R-TREE-14) — are
 * tested as decisions in `scripts/skill-tree-state.test.ts`, not inferred from
 * a browser session. The island wires events to `reduce` and renders the
 * result; it decides nothing itself.
 *
 * Client-safe and dependency-free. Phase 4 plan §5.3.
 *
 * The rules, each one a check in the test:
 *   hover-in     preview only, and only when `ctx.hoverCapable` — the same
 *                event on a touch device changes nothing (R-TREE-11);
 *   hover-out    preview cleared, so the panel falls back to the selection;
 *   focus        preview; never an announcement (R-TREE-14: the live region
 *                is written on confirmation, not on arrow moves);
 *   blur         preview cleared;
 *   activate     selection confirmed, preview dropped, the sheet opened when
 *                the panel is not docked, the announcement worded; on the
 *                node already selected the result is the same and the
 *                announcement is written again — never a toggle (R-TREE-12);
 *   escape/close selection, preview, sheet and announcement cleared; the
 *                active tree stays;
 *   switch-tree  the active tree only;
 *   announced    the island has spoken the announcement.
 */
import type { NodeState } from "@/lib/skill-tree-data-pure";

export { nodeState, type NodeState } from "@/lib/skill-tree-data-pure";

export interface TreeUiState {
  activeTree: string;
  /** Confirmed by Enter, Space, click or tap. Drives `aria-expanded`. */
  selected: string | null;
  /** Hover with `(hover: hover)`, or arrow focus. Never announced. */
  preview: string | null;
  sheetOpen: boolean;
  /** Written on `activate`, consumed by the island's live region, then cleared. */
  announce: string | null;
}

export type TreeEvent =
  | { type: "hover-in"; slug: string }
  | { type: "hover-out" }
  | { type: "focus"; slug: string }
  | { type: "blur" }
  | { type: "activate"; slug: string; name: string; state: NodeState }
  | { type: "escape" }
  | { type: "close" }
  | { type: "switch-tree"; tree: string }
  | { type: "announced" };

export interface TreeUiContext {
  /** `matchMedia("(hover: hover)").matches` at event time. */
  hoverCapable: boolean;
  /** `lg` and up: the panel is docked, so activating never opens a sheet. */
  wide: boolean;
  /** "{skill} selected. {state}." — the template the announcement is worded from. */
  announceTemplate: string;
  /** The four state labels, for the announcement. */
  stateLabels: Record<NodeState, string>;
}

export function initialState(activeTree: string): TreeUiState {
  return { activeTree, selected: null, preview: null, sheetOpen: false, announce: null };
}

export function reduce(state: TreeUiState, event: TreeEvent, ctx: TreeUiContext): TreeUiState {
  switch (event.type) {
    case "hover-in":
      return ctx.hoverCapable ? { ...state, preview: event.slug } : state;
    case "hover-out":
    case "blur":
      return { ...state, preview: null };
    case "focus":
      return { ...state, preview: event.slug };
    case "activate":
      return {
        ...state,
        selected: event.slug,
        preview: null,
        sheetOpen: !ctx.wide,
        announce: wordAnnouncement(ctx, event.name, event.state),
      };
    case "escape":
    case "close":
      return { ...state, selected: null, preview: null, sheetOpen: false, announce: null };
    case "switch-tree":
      return { ...state, activeTree: event.tree };
    case "announced":
      return { ...state, announce: null };
  }
}

/**
 * Function replacers, not replacement strings: a `$` in a name would otherwise
 * be read as a replacement pattern.
 */
function wordAnnouncement(ctx: TreeUiContext, name: string, state: NodeState): string {
  return ctx.announceTemplate
    .replace("{skill}", () => name)
    .replace("{state}", () => ctx.stateLabels[state]);
}

/** What the panel shows: the preview if there is one, else the selection. */
export function shownSlug(state: TreeUiState): string | null {
  return state.preview ?? state.selected;
}
