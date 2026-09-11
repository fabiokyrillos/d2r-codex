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
 * Client-safe and dependency-free. Phase 4 plan §5.3. Stub until the test is
 * red: every event returns the state unchanged.
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
  void event;
  void ctx;
  return state;
}

/** What the panel shows: the preview if there is one, else the selection. */
export function shownSlug(state: TreeUiState): string | null {
  void state;
  return null;
}
