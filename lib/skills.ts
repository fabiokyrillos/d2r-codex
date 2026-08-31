import {
  MAX_HARD_POINTS,
  SKILL_GRAPH,
  TIER_LEVELS,
  type SkillGraphNode,
} from "@/content/classes/skill-graph";
import { formatPoints, type Plural } from "@/lib/i18n";
import type { AllocationRole, ClassSlug, Skill, SkillAllocation, Slug } from "@/lib/types";

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

/**
 * Classes whose skills have individual pages, and which therefore draw the
 * interactive tree on their class and build pages.
 *
 * Derived, not listed. Five call sites have to agree — the route's static
 * params, the class page, the build page, the sitemap and the search index —
 * and the thing they actually depend on is whether a skill has a graph node:
 * positions, unlock tiers and prerequisite edges are what a tree is drawn
 * from, and `SkillPage` 404s without one. A hand-maintained list can disagree
 * with the graph; this cannot. Extraction scope is the single gate, so adding
 * a class to `generate-skill-graph.ts` lights up every surface at once.
 */
export const CLASSES_WITH_SKILL_PAGES: readonly ClassSlug[] = [
  ...new Set(Object.values(SKILL_GRAPH).map((node) => node.classSlug)),
].sort();

export function hasSkillPages(classSlug: string): boolean {
  return (CLASSES_WITH_SKILL_PAGES as readonly string[]).includes(classSlug);
}

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
 *
 * `one-point` is the residue — one point in a skill whose role is the build's
 * own, not a prerequisite, a synergy, a convenience or an option. Every other
 * role keeps its own state at one point, so the label attached to `one-point`
 * describes a judgement about the role and never about the quantity.
 */
export function tileState(allocation: SkillAllocation | undefined, maxLevel: number): TileState {
  if (!allocation || allocation.points <= 0) return "unused";
  if (allocation.role === "flex") return "flex";
  if (allocation.points >= maxLevel) return "maxed";
  if (allocation.points === 1) {
    if (allocation.role === "prerequisite") return "prerequisite";
    if (allocation.role === "synergy") return "synergy";
    // Utility keeps its own state here. It used to fall through, which made a
    // single point of Teleport or Warmth indistinguishable from a point spent
    // on the build's core — and once `one-point` is labelled "Mandatory", that
    // fall-through would call four utility picks per build mandatory on the
    // strength of the number 1 alone.
    if (allocation.role === "utility") return "utility";
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

/** Which skills require this one as a prerequisite, read off the graph. */
export function dependents(slug: Slug): Slug[] {
  return Object.entries(SKILL_GRAPH)
    .filter(([, node]) => node.prerequisites.includes(slug))
    .map(([s]) => s);
}

/**
 * The reverse of `node.synergies`: which skills receive a bonus *from* this one.
 *
 * Derived, never authored. Both directions used to be written by hand, in
 * `synergies` and `synergyFor`, and ten of the thirty-four edges disagreed —
 * Might's page said it fed Blessed Aim while Blessed Aim's page listed no
 * synergies at all. Two hand-maintained lists describing one edge will drift,
 * and the reader has no way to tell which half is wrong. There is now one
 * direction in the data and one function for the other.
 */
export function synergyReceivers(slug: Slug): { slug: Slug; kinds: readonly string[] }[] {
  return Object.entries(SKILL_GRAPH)
    .flatMap(([receiver, node]) =>
      node.synergies
        .filter((s) => s.from === slug)
        .map((s) => ({ slug: receiver, kinds: s.kinds })),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Every canonical synergy edge, as `from -> to` pairs. For the validator. */
export function synergyEdges(): { from: Slug; to: Slug; kinds: readonly string[] }[] {
  return Object.entries(SKILL_GRAPH).flatMap(([to, node]) =>
    node.synergies.map((s) => ({ from: s.from, to, kinds: s.kinds })),
  );
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
 * How a skill's damage can honestly be presented.
 *
 * The graph carries elemental min/max columns. A skill with none of them is not
 * a skill that deals no damage, and saying so shipped a falsehood on fourteen
 * pages — Zeal, Smite and Vengeance are the core attacks of three documented
 * builds and every one of them told the reader it dealt no direct damage.
 *
 * Four cases, and each gets its own sentence:
 *
 *   table         the graph has a min/max range; tabulate it
 *   weapon        a weapon attack; the damage is the weapon's, scaled by the
 *                 skill's own bonus. Derived from `kind`, not authored: every
 *                 one of the six `attack` skills lacks a table and no
 *                 non-attack skill does, so the two sets coincide exactly and
 *                 `check:content` asserts that they still do.
 *   proportional  damage as a fraction of the target's life, so no range
 *                 exists to publish. Authored, because nothing in the extracted
 *                 columns distinguishes it from a skill with no damage at all.
 *   none          genuinely no direct damage — auras, buffs, passives.
 */
export type DamagePresentation = "table" | "weapon" | "proportional" | "none";

export function damagePresentation(
  skill: Pick<Skill, "kind" | "damageModel">,
  node: Pick<SkillGraphNode, "damage">,
): DamagePresentation {
  if (node.damage) return "table";
  if (skill.damageModel === "proportional") return "proportional";
  if (skill.kind === "attack") return "weapon";
  return "none";
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

/**
 * The accessible name of a tile.
 *
 * Pure and exported, because this is the one string a screen-reader user
 * actually receives and it is easier to get subtly wrong than anything else
 * here — an earlier version ended "20 points, Optional, optional", saying the
 * same thing twice because a state label and a separate duty word overlapped.
 *
 * One composition: name, unlock level, tree, then hard points and a single
 * classification phrase. On a class page, where no build context exists,
 * neither points nor obligation are mentioned at all rather than invented.
 */
export interface SkillAriaStrings {
  noBuild: string;
  build: string;
  buildUnused: string;
  /**
   * Both wordings of a point count. There used to be a second template here
   * (`buildOne`) whose only job was to say "1 point" instead of "1 points" —
   * a fix for one surface while the tile and the tables kept shipping the bug.
   * The count is worded once, by `formatPoints`, and dropped into `{points}`.
   */
  points: Plural;
  classification: Record<TileState, string>;
}

export function skillAriaLabel(
  tile: { name: string; level: number; tree: string; points: number; state: TileState },
  strings: SkillAriaStrings,
  /** False on a class page: there is no plan, so there are no points to report. */
  inBuild: boolean,
): string {
  const fill = (template: string) =>
    template
      .replace("{skill}", tile.name)
      .replace("{level}", String(tile.level))
      .replace("{tree}", tile.tree)
      .replace("{points}", formatPoints(strings.points, tile.points))
      .replace("{classification}", strings.classification[tile.state]);

  if (!inBuild) return fill(strings.noBuild);
  if (tile.points <= 0) return fill(strings.buildUnused);
  return fill(strings.build);
}
