"use client";

import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";

import { cn } from "@/components/ui";
import { SkillSigil } from "@/components/game/skill-sigil";
import type { Cell } from "@/lib/skill-tree-nav";
import {
  fill,
  nodeAriaLabel,
  type NodeState,
  type SkillTreesStrings,
  type TreeData,
  type TreeNodeData,
} from "@/lib/skill-tree-data-pure";
import { edgeKey, edgePieces, type Piece } from "@/lib/skill-tree-geometry";

/**
 * One tree: heading, theme, the 3×6 grid with its rail and connectors, and
 * the name bar. Presentational — it decides nothing (plan §10, contract 2):
 * every state it draws arrives as a prop, every gesture goes back through a
 * callback, and the island owns the reducer.
 *
 * **What is in the served HTML, and why.** Every node is an `<a href>` to the
 * skill page (plan decision 2): without JavaScript the tree is thirty links,
 * which is what R-TREE-16 asks for, and the script-less copy that used to
 * carry them is gone. After the island mounts, `enhanced` turns the same
 * anchor into `role="button"` with a roving `tabindex`, `aria-expanded` and
 * `aria-controls` — the pattern of `class-chip.tsx` (Phase 3, D7). The first
 * client render is identical to the server's, so there is nothing to mismatch.
 *
 * **Every cell is explicit.** The overlay that carries the rail and the
 * connectors spans the whole grid as its first child, so an auto-placed cell
 * would be pushed into an implicit seventh row; each of the eighteen cells
 * names its `grid-area`. The eight empty ones stay in the DOM, named
 * `emptyCell`, and are never `aria-hidden` — the `role=grid` was invalid for
 * as long as they were (R-TREE-1: 18 gridcells per tree, 0 hidden).
 *
 * **Connectors are grid items, not a drawing.** A piece is an empty `<span>`
 * placed by row and column with the `<svg>` absolutely positioned inside it
 * (plan §5.4): the SVG cannot be the grid item itself — without a `viewBox`
 * it brings 150 px of intrinsic height and inflated rows 2–4 to 134 px in
 * the prototype. The stylesheet (`app/globals.css`, "skill tree") owns the
 * margins that reach into the gaps; this file only names the placement.
 *
 * **The name is where the width allows.** At 100 % it is in the node, at
 * 12 px with `lang="en"` and `hyphens: auto`. When the island measures that
 * a name no longer fits (`glyph`, R-TREE-15) the stylesheet hides the names
 * and shows the name bar with the focused or shown node's name, level, state
 * and points; `title` and `aria-label` carry the name in both states.
 */
export interface SkillTreeGridProps {
  tree: TreeData;
  inBuild: boolean;
  /** True after the island mounted: roles, roving tabindex, `aria-expanded`. */
  enhanced: boolean;
  /** Glyph mode: names leave the nodes, the name bar shows the focused one. */
  glyph: boolean;
  focusCell: Cell;
  /** `shownSlug(state)`: what the panel shows and what the connectors light up for. */
  shownSlug: string | null;
  /** The confirmed selection: the only node with `aria-expanded="true"`. */
  selectedSlug: string | null;
  /** `relatedEdges(shownSlug, tree.edges)` — keys `"<from>><to>"`. */
  relatedEdges: ReadonlySet<string>;
  /** `aria-controls` of a hydrated node: the panel or sheet exposed at this width, or nothing. */
  controlsId: string | undefined;
  strings: SkillTreesStrings;
  /** `nodeState(node, level)` for one node, so the grid and the panel agree. */
  stateOf: (node: TreeData["rows"][number]["cells"][number] & object) => NodeState;
  onNodeFocus: (slug: string, cell: Cell) => void;
  onNodeBlur: () => void;
  onNodeKeyDown: (event: KeyboardEvent<HTMLAnchorElement>, slug: string, cell: Cell) => void;
  onNodeActivate: (slug: string, cell: Cell) => void;
  onNodeHoverIn: (slug: string) => void;
  onNodeHoverOut: () => void;
}

/**
 * Frame per state (plan §5.8), as plain literals: `scripts/contrast.test.ts`
 * reads this object out of the source to check the pairs it models, so each
 * value stays one double-quoted string with nothing but the frame and the
 * background. Locked dims the sigil and the name, never the whole node — an
 * `opacity-*` here would be read as dimming the text.
 *
 * `bg-surface` is the resting background; a selected node is `surface-raised`
 * through `[data-selected]` in the stylesheet, which is where a rule can beat
 * this utility (see the unlayered block in `app/globals.css`).
 */
const stateStyle: Record<NodeState, string> = {
  available: "border border-ink-subtle bg-surface",
  locked: "border border-dashed border-ink-subtle bg-surface",
  invested: "border-2 border-ember bg-surface",
  maxed: "border-2 border-ember bg-surface",
};

/**
 * A plain primary press is the tree's to take; a modifier, another button or
 * a keyboard activation that already reached `onNodeKeyDown` is the browser's
 * request for a tab or a window, and it must reach the href untouched.
 */
const isPlainPress = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/** Grid placement of one connector piece; the box and margins are in CSS. */
function pieceStyle(piece: Piece): CSSProperties {
  switch (piece.kind) {
    case "v-cell":
    case "h-cell":
      return { gridArea: `${piece.row} / ${piece.col}` };
    case "v-span":
      return { gridRow: `${piece.fromRow} / ${piece.toRow + 1}`, gridColumn: String(piece.col) };
    case "h-span":
      return { gridRow: String(piece.row), gridColumn: `${piece.fromCol} / ${piece.toCol + 1}` };
    case "jog": {
      const min = Math.min(piece.fromCol, piece.toCol);
      const max = Math.max(piece.fromCol, piece.toCol);
      const n = max - min + 1;
      // From the centre of the first column spanned to the centre of the last:
      // half a column in from each edge, with the gaps between taken out.
      return {
        gridRow: String(piece.row),
        gridColumn: `${min} / ${max + 1}`,
        marginInline: `calc((100% - ${n - 1} * var(--tree-gap)) / ${2 * n})`,
      };
    }
  }
}

function pieceClass(piece: Piece): string {
  switch (piece.kind) {
    case "v-cell":
      return "tree-piece tree-piece-v-cell";
    case "v-span":
      return cn("tree-piece tree-piece-v-span", piece.bottomGap && "tree-piece-v-span-gap");
    case "h-cell":
      return cn("tree-piece tree-piece-h-cell", !piece.toRight && "tree-piece-h-cell-left");
    case "h-span":
      return "tree-piece tree-piece-h-span";
    case "jog":
      return "tree-piece tree-piece-jog";
  }
}

/**
 * `vector-effect` is read in device pixels and is not inherited from a `<g>`,
 * so every line carries the three attributes itself. The original tree drew
 * a 0.02-unit stroke and was invisible for it.
 */
const stroke = { stroke: "currentColor", strokeWidth: 2, vectorEffect: "non-scaling-stroke" } as const;

/**
 * The lines, in percentages of the piece's box. A `jog` is three lines: down
 * from the origin column's centre to the middle of the gap, across, down into
 * the target — mirrored when the target is to the left. Square caps on the
 * crossbar fill the two corners the butt-capped verticals would leave open.
 */
function pieceLines(piece: Piece): ReactNode {
  switch (piece.kind) {
    case "v-cell":
    case "v-span":
      return <line x1="50%" y1="0" x2="50%" y2="100%" {...stroke} />;
    case "h-cell":
    case "h-span":
      return <line x1="0" y1="50%" x2="100%" y2="50%" {...stroke} />;
    case "jog": {
      const [x0, x1] = piece.toCol > piece.fromCol ? ["0", "100%"] : ["100%", "0"];
      return (
        <>
          <line x1={x0} y1="0" x2={x0} y2="50%" {...stroke} />
          <line x1={x0} y1="50%" x2={x1} y2="50%" strokeLinecap="square" {...stroke} />
          <line x1={x1} y1="50%" x2={x1} y2="100%" {...stroke} />
        </>
      );
    }
  }
}

/** Plain geometry, `currentColor`; ~10 px, top right of a locked node. */
function Padlock(): ReactNode {
  return (
    <svg
      data-lock=""
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 10 10"
      width="10"
      height="10"
      className="shrink-0 text-ink-muted"
    >
      <path d="M3 4.6V3.2a2 2 0 0 1 4 0v1.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.6" y="4.5" width="6.8" height="4.7" rx="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * The points counter, build pages only. Its shape follows the points, not
 * the state, because a locked node keeps showing what the build spends
 * there (plan decision 13): round when invested, chamfered with a star when
 * the base points reach the cap, dashed when the allocation is optional —
 * the one distinction that must survive without colour (review, MED-6).
 */
function Counter({ node }: { node: TreeNodeData }): ReactNode {
  if (node.points <= 0) {
    return (
      <span data-points="" className="font-mono text-[0.6875rem] text-ink-muted">
        —
      </span>
    );
  }
  const full = node.points >= node.maxLevel;
  return (
    <span
      data-points=""
      className={cn(
        "tree-pill bg-ember text-abyss font-mono text-[0.6875rem]",
        full && "tree-pill-max",
        node.role === "flex" && "border border-dashed border-abyss/60",
      )}
    >
      {full && <span aria-hidden="true">✦</span>}
      {node.points}
    </span>
  );
}

export function SkillTreeGrid(props: SkillTreeGridProps): ReactNode {
  const {
    tree,
    inBuild,
    enhanced,
    glyph,
    focusCell,
    shownSlug,
    selectedSlug,
    relatedEdges,
    controlsId,
    strings,
    stateOf,
    onNodeFocus,
    onNodeBlur,
    onNodeKeyDown,
    onNodeActivate,
    onNodeHoverIn,
    onNodeHoverOut,
  } = props;

  const hintId = `${tree.slug}-hint`;

  const bySlug = new Map<string, TreeNodeData>();
  for (const row of tree.rows) for (const node of row.cells) if (node) bySlug.set(node.slug, node);

  const stateLabel: Record<NodeState, string> = {
    locked: strings.stateLocked,
    available: strings.stateAvailable,
    invested: strings.stateInvested,
    maxed: strings.stateMaxed,
  };

  /*
   * The name bar names the node the reader is on: the shown one when it is
   * in this tree, otherwise the roving focus cell — which always points at a
   * skill, so the bar never has to guess. Text only, and `aria-hidden`: the
   * node's own accessible name already says all of it, and writing a live
   * region on every arrow press is what R-TREE-14 forbids.
   */
  const focusNode = tree.rows[focusCell.row]?.cells[focusCell.col] ?? null;
  const barNode = (shownSlug !== null ? bySlug.get(shownSlug) : undefined) ?? focusNode;
  const barText = barNode
    ? [
        barNode.name,
        fill(strings.rowLabel, { level: barNode.level }),
        stateLabel[stateOf(barNode)],
        inBuild ? barNode.pointsLabel : "",
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <>
      {/* The island wraps this block in `[data-tree]`; the heading stays its
          first child so `[data-tree] > h3` — what `heading-snapshot.json`
          pins — holds at every width, including under `hidden`. */}
      <h3 id={`${tree.slug}-title`} className="font-display text-lg text-ink">
        {tree.name}
      </h3>
      {inBuild && tree.pointsLabel && (
        <p data-tree-points="" className="mt-0.5 font-mono text-xs text-ink-muted">
          {tree.pointsLabel}
        </p>
      )}

      <div data-glyph={glyph ? "" : undefined}>
        {/*
          The theme, twice, one exposed per width (plan decision 10): the
          paragraph from `sm` up, and below it a disclosure served closed —
          the Summoning theme runs to 257 characters, ≈137 px at 320, which
          the 900 px budget of R-TREE-8 cannot carry open.
        */}
        <p className="mt-1 hidden text-sm leading-relaxed text-pretty text-ink-muted sm:block">
          {tree.theme}
        </p>
        <details data-tree-theme="" className="mt-2 sm:hidden">
          <summary className="cursor-pointer py-1.5 text-sm text-ink-muted">
            {strings.treeThemeSummary}
          </summary>
          <p className="pb-1 text-sm leading-relaxed text-pretty text-ink-muted">{tree.theme}</p>
        </details>

        {/* Screen-reader only (decision 10): the legend carries the visible
            version, on demand, in `legendKeyboard`. */}
        <p id={hintId} className="sr-only">
          {strings.treeHint}
        </p>

        <p data-namebar="" aria-hidden="true" className="tree-namebar mt-2 min-h-7 text-xs text-ink-muted">
          {barText}
        </p>

        <div
          role="grid"
          aria-label={fill(strings.treeLabel, { tree: tree.name })}
          aria-describedby={hintId}
          className="tree-grid mt-3"
        >
          {/*
            Rail and connectors, first so that they paint under the nodes and
            inert (`pointer-events: none`, review MED-2). The rail cells are
            items of the rows they label, which is what keeps them level with
            an elastic row without any script (plan decision 4).
          */}
          <div data-tree-overlay="" aria-hidden="true" className="tree-overlay">
            {tree.rows.map((row, i) => (
              <span
                key={row.level}
                data-rail-level={row.level}
                className="tree-rail font-mono text-[0.6875rem] text-ink-muted"
                style={{ gridRow: String(i + 1), gridColumn: "1" }}
              >
                {row.level}
              </span>
            ))}
            {tree.edges.flatMap((edge) => {
              const from = bySlug.get(edge.from);
              const to = bySlug.get(edge.to);
              if (!from || !to) return [];
              const key = edgeKey(edge);
              const related = relatedEdges.has(key);
              return edgePieces(from, to).map((piece, i) => (
                <span
                  key={`${key}-${i}`}
                  data-edge={key}
                  data-related={related ? "" : undefined}
                  className={pieceClass(piece)}
                  style={pieceStyle(piece)}
                >
                  <svg aria-hidden="true" focusable="false">
                    {pieceLines(piece)}
                  </svg>
                </span>
              ));
            })}
          </div>

          {tree.rows.map((row, r) => (
            // `display: contents` lets the row carry the ARIA structure
            // without becoming a layout box inside the CSS grid.
            <div
              key={row.level}
              role="row"
              aria-label={fill(strings.rowLabel, { level: row.level })}
              className="contents"
            >
              {row.cells.map((node, c) => {
                const area = `${r + 1} / ${c + 1}`;
                if (!node) {
                  return (
                    <div
                      key={c}
                      role="gridcell"
                      aria-label={strings.emptyCell}
                      className="tree-cell"
                      style={{ gridArea: area }}
                    />
                  );
                }
                const cell: Cell = { row: r, col: c };
                const state = stateOf(node);
                const locked = state === "locked";
                const selected = selectedSlug === node.slug;
                const isFocus = focusCell.row === r && focusCell.col === c;
                return (
                  <div key={node.slug} role="gridcell" className="tree-cell min-w-0" style={{ gridArea: area }}>
                    <a
                      href={node.href}
                      data-node={node.slug}
                      data-state={state}
                      data-locked={locked ? "" : undefined}
                      data-selected={selected ? "" : undefined}
                      data-role={node.role}
                      title={node.name}
                      aria-label={nodeAriaLabel(node, tree.name, state, strings, inBuild)}
                      className={cn("tree-node motion-safe:transition-colors", stateStyle[state])}
                      {...(enhanced
                        ? {
                            role: "button",
                            // Follows the confirmed selection, never the
                            // preview (decision 16): "the details in the panel
                            // are this skill's, by the reader's choice".
                            "aria-expanded": selected,
                            ...(controlsId ? { "aria-controls": controlsId } : {}),
                            tabIndex: isFocus ? 0 : -1,
                          }
                        : {})}
                      onFocus={() => onNodeFocus(node.slug, cell)}
                      onBlur={() => onNodeBlur()}
                      onKeyDown={(event) => {
                        // Space on an anchor scrolls the page; a button must
                        // answer to it instead. The island decides what it does.
                        if (enhanced && event.key === " ") event.preventDefault();
                        onNodeKeyDown(event, node.slug, cell);
                      }}
                      onClick={(event) => {
                        if (!enhanced || !isPlainPress(event)) return;
                        event.preventDefault();
                        onNodeActivate(node.slug, cell);
                      }}
                      // Never a touch (decision 7): a finger does not hover,
                      // a mouse or a hovering pen does. The island additionally
                      // gates on `(hover: hover)`.
                      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
                        if (event.pointerType !== "touch") onNodeHoverIn(node.slug);
                      }}
                      onPointerLeave={(event: PointerEvent<HTMLAnchorElement>) => {
                        if (event.pointerType !== "touch") onNodeHoverOut();
                      }}
                    >
                      {/* `flex-wrap`: at 150 % text and up the counter no longer fits
                          beside the sigil in 78px; it drops under it and the row
                          grows (a floor, R-TREE-3) instead of overflowing the node
                          — and, in the third column, the section. */}
                      <span className="flex flex-wrap items-center justify-between gap-1">
                        {/* R-TREE-18: the sigil is a declared placeholder by
                            type and element until the icon set arrives. */}
                        <span
                          data-placeholder="type-element"
                          className={cn("tree-sigil", locked && "opacity-45")}
                        >
                          <SkillSigil kind={node.kind} element={node.element} size={20} />
                        </span>
                        <span className="ml-auto flex items-center gap-1">
                          {locked && <Padlock />}
                          {inBuild && <Counter node={node} />}
                        </span>
                      </span>
                      <span className={cn("tree-name", locked ? "text-ink-muted" : "text-ink")} lang="en">
                        {node.name}
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
