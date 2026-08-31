import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui";
import { SkillSigil } from "@/components/game/skill-sigil";
import {
  SkillTreeInteractive,
  type TreeRow,
  type TreeTile,
} from "@/components/game/skill-tree-interactive";
import { getSkillsForClass, getSkillTree } from "@/lib/registry";
import { fmt } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { elementLabels, skillKindLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";
import {
  SKILL_GRAPH,
  layoutTree,
  treeEdges,
  type SkillTile,
  type TileState,
} from "@/lib/skills";
import type { SkillAllocation, Slug } from "@/lib/types";

/**
 * One skill tree, drawn as the game lays it out: three columns, six rows,
 * grouped by the level that unlocks each row.
 *
 * A server component. It builds every tile and every panel body here and hands
 * them to a small client component that owns selection and nothing else, so
 * the interactive layer never needs the content's code — only its output.
 *
 * Without JavaScript the buttons do nothing, so a `<noscript>` block carries a
 * plain linked list of the same skills. That is the readable version, not an
 * apology for one.
 */

/** Border weight and a text label, so state never rests on colour alone. */
const stateStyle: Record<TileState, string> = {
  maxed: "border-2 border-ember",
  invested: "border border-ember-dim",
  "one-point": "border border-border-strong",
  prerequisite: "border border-border-strong border-dashed",
  synergy: "border border-info",
  utility: "border border-border-strong",
  flex: "border border-dashed border-warning",
  unused: "border border-border opacity-55",
};

export async function SkillTree({
  classSlug,
  treeSlug,
  allocations,
}: {
  classSlug: Slug;
  treeSlug: Slug;
  /** Supply on a build page to show that build's hard points. */
  allocations?: readonly SkillAllocation[];
}) {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const tree = getSkillTree(locale, treeSlug);
  const skills = getSkillsForClass(locale, classSlug);
  if (!tree) return null;

  const kinds = skillKindLabels(t);
  const elements = elementLabels(t);
  const stateLabels: Record<TileState, string> = {
    maxed: t.skills.stateMaxed,
    invested: t.skills.stateInvested,
    "one-point": t.skills.stateOnePoint,
    prerequisite: t.skills.statePrerequisite,
    synergy: t.skills.stateSynergy,
    utility: t.skills.stateUtility,
    flex: t.skills.stateFlex,
    unused: t.skills.stateUnused,
  };

  const grid = layoutTree(skills, treeSlug, allocations);
  const showPoints = allocations !== undefined;

  const tileBody = (cell: SkillTile): ReactNode => (
    <span className="flex h-full flex-col justify-between gap-1">
      <span className="flex items-start gap-1.5">
        <SkillSigil kind={cell.skill.kind} element={cell.skill.element} size={16} />
        <span className="min-w-0 text-xs leading-tight font-medium text-ink">
          {cell.skill.name}
        </span>
      </span>
      <span className="flex items-center justify-between gap-1.5 text-[0.6875rem] text-ink-subtle">
        <span>{kinds[cell.skill.kind]}</span>
        {showPoints && (
          <span
            className={cell.points > 0 ? "font-mono text-ink" : "font-mono text-ink-subtle"}
          >
            {cell.points > 0 ? fmt(t.skills.points, { points: cell.points }) : "—"}
          </span>
        )}
      </span>
      {showPoints && cell.state !== "unused" && (
        <span className="text-[0.625rem] tracking-wide text-ink-muted uppercase">
          {stateLabels[cell.state]}
        </span>
      )}
    </span>
  );

  const panelBody = (cell: SkillTile): ReactNode => {
    const node = cell.node;
    const prerequisites = node.prerequisites
      .map((slug) => skills.find((s) => s.slug === slug))
      .filter((s) => s !== undefined);
    return (
      <div className="space-y-3">
        <div>
          <div className="flex items-start gap-2">
            <SkillSigil kind={cell.skill.kind} element={cell.skill.element} size={20} />
            <h4 className="font-display text-base leading-tight text-ink">
              {cell.skill.name}
            </h4>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            {tree.name} · {fmt(t.skills.unlocksValue, { level: node.requiredLevel })} ·{" "}
            {kinds[cell.skill.kind]}
            {cell.skill.element ? ` · ${elements[cell.skill.element]}` : ""}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-pretty text-ink-muted">
          {cell.skill.summary}
        </p>

        {showPoints && (
          <p className="text-sm text-ink">
            <span className="font-mono">
              {cell.points > 0 ? fmt(t.skills.points, { points: cell.points }) : t.skills.noPoints}
            </span>
            {cell.state !== "unused" && (
              <span className="text-ink-subtle"> · {stateLabels[cell.state]}</span>
            )}
          </p>
        )}

        {showPoints && cell.note && (
          <p className="text-sm leading-relaxed text-pretty text-ink-muted">{cell.note}</p>
        )}

        <p className="text-xs text-ink-subtle">
          <span className="font-medium text-ink-muted">{t.skills.prerequisitesTitle}: </span>
          {prerequisites.length > 0
            ? prerequisites.map((s) => s.name).join(", ")
            : t.skills.prerequisitesNone}
        </p>

        <Link
          href={r.skill(classSlug, cell.skill.slug)}
          className="inline-block text-sm text-ember hover:text-ember-bright"
        >
          {t.skills.fullPage} →
        </Link>
      </div>
    );
  };

  const rows: TreeRow[] = grid.map((row) => ({
    level: row.level,
    rowLabel: fmt(t.skills.rowLabel, { level: row.level }),
    cells: row.cells.map((cell): TreeTile | null => {
      if (!cell) return null;
      const base = fmt(t.skills.tileAria, {
        skill: cell.skill.name,
        level: cell.node.requiredLevel,
        tree: tree.name,
      });
      return {
        slug: cell.skill.slug,
        ariaLabel: showPoints
          ? fmt(cell.points === 1 ? t.skills.tileAriaPointsOne : t.skills.tileAriaPoints, {
              skill: cell.skill.name,
              level: cell.node.requiredLevel,
              tree: tree.name,
              points: cell.points,
              state: stateLabels[cell.state],
            })
          : base,
        tile: (
          <span className={`block h-full rounded-sm ${stateStyle[cell.state]} p-1.5`}>
            {tileBody(cell)}
          </span>
        ),
      };
    }),
  }));

  const panels: Record<string, ReactNode> = {};
  for (const row of grid) {
    for (const cell of row.cells) {
      if (cell) panels[cell.skill.slug] = panelBody(cell);
    }
  }

  const edges = treeEdges(treeSlug).map((e) => ({
    from: [e.from.row, e.from.column] as [number, number],
    to: [e.to.row, e.to.column] as [number, number],
  }));

  const inTree = skills.filter((s) => SKILL_GRAPH[s.slug]?.tree === treeSlug);

  return (
    <section aria-label={fmt(t.skills.treeLabel, { tree: tree.name })}>
      <div className="mb-3">
        <h3 className="font-display text-lg text-ink">{tree.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-pretty text-ink-muted">{tree.theme}</p>
      </div>

      <SkillTreeInteractive
        rows={rows}
        panels={panels}
        edges={edges}
        strings={{
          treeLabel: fmt(t.skills.treeLabel, { tree: tree.name }),
          treeHint: t.skills.treeHint,
          panelHeading: t.skills.panelHeading,
          panelEmpty: t.skills.panelEmpty,
          closePanel: t.skills.closePanel,
        }}
      />

      {/* The readable version when the tiles cannot respond. */}
      <noscript>
        <ul className="mt-4 space-y-2 border-t border-border pt-3">
          {inTree.map((skill) => {
            const node = SKILL_GRAPH[skill.slug];
            return (
              <li key={skill.slug} className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <Link
                  href={r.skill(classSlug, skill.slug)}
                  className="font-medium text-ember hover:text-ember-bright"
                >
                  {skill.name}
                </Link>
                <Badge tone="outline">
                  {fmt(t.skills.unlocksValue, { level: node.requiredLevel })}
                </Badge>
                <span className="text-pretty text-ink-muted">{skill.summary}</span>
              </li>
            );
          })}
        </ul>
      </noscript>
    </section>
  );
}
