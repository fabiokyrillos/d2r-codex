"use client";

import type { ReactNode } from "react";

import { RichText } from "@/components/game/rich-text";
import { SkillSigil } from "@/components/game/skill-sigil";
import { fill, type NodeState, type SkillTreesStrings, type TreeNodeData } from "@/lib/skill-tree-data-pure";

/**
 * The details of one skill, rendered from data: name, level, state, summary
 * (through `RichText`), points and editorial role on a build page,
 * prerequisites, what it unlocks, synergies received and given (including
 * the missile ones), every one of them a real link with the locale already
 * in the href, and the link to the full page (R-TREE-7). The same body serves
 * the docked region from `lg` up and the bottom sheet below it.
 *
 * Every name is a plain `<a href>`, never a `<span>` and never a `<Link>`: a
 * skill named in a panel is a page the reader can go to (R-TREE-7 "todos os
 * nomes são links"; C10 asserts `a[href]` in all four lists), and the router
 * has no business intercepting a link out of a sheet it does not know about.
 *
 * The four state labels are the only state vocabulary here (decision 13); the
 * editorial role is its own line, on build pages only, so "Optional" is still
 * said — in the panel, where it belongs, not in the accessible name.
 *
 * No `h2`/`h3` (§5.5: the heading snapshot pins the section's `h3`s, and a
 * panel heading would join them); the name is an `h4`, the list titles are
 * paragraphs.
 */
export interface SkillTreePanelProps {
  /** Null shows `panelEmpty`. */
  node: TreeNodeData | null;
  treeName: string;
  state: NodeState;
  inBuild: boolean;
  /** Resolves a slug named in prerequisites/unlocks/synergies to its node (any tree of the class). */
  lookup: (slug: string) => TreeNodeData | undefined;
  strings: SkillTreesStrings;
}


const LINK = "font-medium text-ember hover:text-ember-bright";
const TITLE = "text-xs font-semibold tracking-widest text-ink-muted uppercase";
const NONE = "mt-1 text-sm text-ink-muted";

export function SkillTreePanel({
  node,
  treeName,
  state,
  inBuild,
  lookup,
  strings,
}: SkillTreePanelProps): ReactNode {
  if (!node) {
    return <p className="text-sm leading-relaxed text-pretty text-ink-muted">{strings.panelEmpty}</p>;
  }

  const stateLabel = {
    locked: strings.stateLocked,
    available: strings.stateAvailable,
    invested: strings.stateInvested,
    maxed: strings.stateMaxed,
  }[state];

  /**
   * A skill named by slug, as a link. A slug that does not resolve is left
   * out rather than printed bare: `scripts/skill-tree.test.ts` asserts every
   * slug the payload names is a node of the class, so the branch is
   * belt-and-braces, and a bare name would be exactly the `<span>` the gate
   * forbids (mutation M13).
   */
  const named = (slug: string, key: string, after?: ReactNode) => {
    const target = lookup(slug);
    if (!target) return null;
    return (
      <li key={key} className="flex flex-wrap items-baseline gap-x-2">
        <a href={target.href} className={LINK}>
          {target.name}
        </a>
        {after}
      </li>
    );
  };

  const synergiesIn = [
    ...node.synergiesIn.map((s, i) =>
      named(
        s.slug,
        `s-${i}`,
        <>
          <span className="text-ink-muted">{s.kinds}</span>
          {s.bonus && <span className="text-pretty text-ink-muted">{s.bonus}</span>}
        </>,
      ),
    ),
    // Missile synergies keep their own wording ("+15% Magic per hard point"):
    // the element is the missile's, not the skill's, and the difference is
    // the whole point of naming it (skill page, same lists).
    ...node.missileIn.map((s, i) =>
      named(s.slug, `m-${i}`, <span className="text-ink-muted">{s.label}</span>),
    ),
  ].filter((li) => li !== null);

  const synergiesOut = [
    ...node.synergiesOut.map((s, i) =>
      named(s.slug, `s-${i}`, <span className="text-ink-muted">{s.kinds}</span>),
    ),
    ...node.missileOut.map((s, i) =>
      named(s.slug, `m-${i}`, <span className="text-ink-muted">{s.label}</span>),
    ),
  ].filter((li) => li !== null);

  const prerequisites = node.prerequisites
    .map((slug) => named(slug, slug))
    .filter((li) => li !== null);
  const unlocks = node.unlocks.map((slug) => named(slug, slug)).filter((li) => li !== null);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-start gap-2">
          {/* The mark is a placeholder by type and element until the icon set
              arrives (R-TREE-18); `data-placeholder` is how C20 finds it. */}
          <span data-placeholder="" className="mt-0.5 inline-flex shrink-0">
            <SkillSigil kind={node.kind} element={node.element} size={20} />
          </span>
          <h4 data-panel-name="" className="font-display text-base leading-tight text-ink">
            {node.name}
          </h4>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          <span data-panel-level="">
            {fill(strings.unlocksValue, { level: node.level })} · {treeName}
          </span>
          {" · "}
          <span data-panel-state="" className="text-ink">
            {stateLabel}
          </span>
        </p>
      </div>

      <p className="text-sm leading-relaxed text-pretty text-ink-muted">
        <RichText>{node.summary}</RichText>
      </p>

      {inBuild && (
        <p className="text-sm text-ink">
          <span data-panel-points="" className="font-mono">
            {fill(strings.panelPoints, { points: node.pointsLabel })}
          </span>
          {node.roleLabel && (
            <span data-panel-role="" className="text-ink-muted">
              {" · "}
              {node.roleLabel}
            </span>
          )}
        </p>
      )}

      {inBuild && node.note && (
        <p data-panel-note="" className="text-sm leading-relaxed text-pretty text-ink-muted">
          <RichText>{node.note}</RichText>
        </p>
      )}

      <div>
        <p className={TITLE}>{strings.prerequisitesTitle}</p>
        {prerequisites.length > 0 ? (
          <ul data-panel-prereqs="" className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {prerequisites}
          </ul>
        ) : (
          <p className={NONE}>{strings.prerequisitesNone}</p>
        )}
      </div>

      <div>
        <p className={TITLE}>{strings.unlocksTitle}</p>
        {unlocks.length > 0 ? (
          <ul data-panel-unlocks="" className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {unlocks}
          </ul>
        ) : (
          <p className={NONE}>{strings.unlocksNone}</p>
        )}
      </div>

      <div>
        <p className={TITLE}>{strings.synergiesTitle}</p>
        {synergiesIn.length > 0 ? (
          <ul data-panel-synergies-in="" className="mt-1 space-y-1 text-sm">
            {synergiesIn}
          </ul>
        ) : (
          <p className={NONE}>{strings.synergiesNone}</p>
        )}
      </div>

      <div>
        <p className={TITLE}>{strings.feedsTitle}</p>
        {synergiesOut.length > 0 ? (
          <ul data-panel-synergies-out="" className="mt-1 space-y-1 text-sm">
            {synergiesOut}
          </ul>
        ) : (
          <p className={NONE}>{strings.synergiesNone}</p>
        )}
      </div>

      <a data-panel-full="" href={node.href} className="inline-block text-sm text-ember hover:text-ember-bright">
        {strings.fullPage} →
      </a>
    </div>
  );
}
