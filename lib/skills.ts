import {
  MAX_HARD_POINTS,
  SKILL_GRAPH,
  TIER_LEVELS,
  type SkillGraphNode,
} from "@/content/classes/skill-graph";
import type { AllocationRole, Skill, SkillAllocation, Slug } from "@/lib/types";

/**
 * Presentation helpers shared by the skill tree, the class page and the
 * individual skill pages.
 *
 * Everything structural comes from the generated graph rather than authored
 * content — positions, prerequisite edges, level caps. The authored `Skill`
 * supplies prose and nothing load-bearing.
 */

export { MAX_HARD_POINTS, SKILL_GRAPH, TIER_LEVELS };
export type { SkillGraphNode };

/** How a skill is drawn in a build's tree. Derived, never authored. */
export const TILE_STATES = [
  "maxed",
  "invested",
  "one-point",
  "prerequisite",
  "synergy",
  "utility",
  "flex",
  "unused",
] as const;
export type TileState = (typeof TILE_STATES)[number];

/**
 * The five states the brief asks for, plus the three that fall out of the
 * existing `AllocationRole`. Ordered: a maxed skill reads as maxed whatever
 * its role, and an optional skill must never read as mandatory.
 */
export function tileState(allocation: SkillAllocation | undefined, maxLevel: number): TileState {
  if (!allocation || allocation.points <= 0) return "unused";
  if (allocation.role === "flex") return "flex";
  if (allocation.points >= maxLevel) return "maxed";
  if (allocation.points === 1) {
    if (allocation.role === "prerequisite") return "prerequisite";
    if (allocation.role === "synergy") return "synergy";
    return "one-point";
  }
  if (allocation.role === "synergy") return "synergy";
  if (allocation.role === "utility") return "utility";
  return "invested";
}

/** One cell of a rendered tree. */
export interface SkillTile {
  skill: Skill;
  node: SkillGraphNode;
  state: TileState;
  /** Hard points this build spends. Never includes gear. */
  points: number;
  role?: AllocationRole;
  note?: string;
}

export interface SkillTreeRow {
  /** 1-based row, which is also the unlock tier. */
  row: number;
  level: number;
  /** Always three entries; `null` is an empty cell in the 3x6 grid. */
  cells: (SkillTile | null)[];
}

/**
 * Lays a tree out as the game does: three columns, six rows, ten skills.
 * Empty cells are preserved so prerequisite lines stay vertically honest.
 */
export function layoutTree(
  skills: readonly Skill[],
  treeSlug: Slug,
  allocations?: readonly SkillAllocation[],
): SkillTreeRow[] {
  const byAllocation = new Map((allocations ?? []).map((a) => [a.skill, a]));
  const inTree = skills.filter((s) => SKILL_GRAPH[s.slug]?.tree === treeSlug);

  return TIER_LEVELS.map((level, index) => {
    const row = index + 1;
    const cells: (SkillTile | null)[] = [null, null, null];
    for (const skill of inTree) {
      const node = SKILL_GRAPH[skill.slug];
      if (node.row !== row) continue;
      const allocation = byAllocation.get(skill.slug);
      cells[node.column - 1] = {
        skill,
        node,
        state: allocations ? tileState(allocation, node.maxLevel) : "unused",
        points: allocation?.points ?? 0,
        role: allocation?.role,
        note: allocation?.note,
      };
    }
    return { row, level, cells };
  });
}

/**
 * Prerequisite edges within one tree, as grid coordinates, so the tree can
 * draw connectors without the renderer knowing anything about the graph.
 */
export interface SkillEdge {
  from: { row: number; column: number; slug: Slug };
  to: { row: number; column: number; slug: Slug };
}

export function treeEdges(treeSlug: Slug): SkillEdge[] {
  const edges: SkillEdge[] = [];
  for (const [slug, node] of Object.entries(SKILL_GRAPH)) {
    if (node.tree !== treeSlug) continue;
    for (const prerequisite of node.prerequisites) {
      const from = SKILL_GRAPH[prerequisite];
      // Cross-tree edges are impossible in D2 and rejected by check:content,
      // so this is belt-and-braces rather than a real branch.
      if (!from || from.tree !== treeSlug) continue;
      edges.push({
        from: { row: from.row, column: from.column, slug: prerequisite },
        to: { row: node.row, column: node.column, slug },
      });
    }
  }
  return edges;
}

/** Which skills gain a bonus *from* this one, read off the graph. */
export function dependents(slug: Slug): Slug[] {
  return Object.entries(SKILL_GRAPH)
    .filter(([, node]) => node.prerequisites.includes(slug))
    .map(([s]) => s);
}

/**
 * Base damage at a given hard-point level, before synergies and before any
 * +skills. D2 adds a different amount per level inside five bands.
 *
 * Validated against Blessed Hammer, whose level 20 minimum works out to 196 —
 * matching the value published for the skill without synergies.
 */
export function damageAtLevel(
  node: SkillGraphNode,
  level: number,
): { min: number; max: number } | undefined {
  if (!node.damage) return undefined;
  const scale = (base: number, bands: readonly number[]) => {
    let total = base;
    for (let l = 2; l <= level; l++) {
      const band = l <= 8 ? 0 : l <= 16 ? 1 : l <= 22 ? 2 : l <= 28 ? 3 : 4;
      total += bands[band] ?? 0;
    }
    // HitShift is a power-of-two divisor expressed as an exponent around 8.
    return Math.floor(total * Math.pow(2, node.damage!.hitShift - 8));
  };
  return {
    min: scale(node.damage.min.base, node.damage.min.bands),
    max: scale(node.damage.max.base, node.damage.max.bands),
  };
}

/**
 * The levels worth tabulating. Not every level — a 20-row table for every
 * skill is data nobody reads. The first level, the cap, and any level a build
 * actually recommends.
 */
export function progressionLevels(node: SkillGraphNode, recommended: number[]): number[] {
  const set = new Set<number>([1, node.maxLevel]);
  for (const level of recommended) {
    if (level > 1 && level < node.maxLevel) set.add(level);
  }
  return [...set].sort((a, b) => a - b);
}
