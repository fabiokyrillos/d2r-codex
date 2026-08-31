/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with `npm run gen:skill-graph` (see scripts/generate-skill-graph.ts).
 *
 * The canonical skill graph for the Paladin and the Sorceress: which tree a
 * skill belongs to, what character level unlocks it, and which skills the game
 * requires before it can be allocated.
 *
 * PROVENANCE
 *   Repository  blizzhackers/d2data
 *   Commit      fc469993502d0498809b9fc1af140ee2a9eb8902
 *               2026-08-21 — "Updated for patch 3.3.93847"
 *   Verified    2026-08-31
 *   Paths       json/skills.json, json/skilldesc.json, json/base/skills.json
 *   Baseline    D2R Patch 3.3 / Ladder Season 15 extraction
 *   Regenerate  npm run gen:skill-graph
 *   Fields      skills.json:    charclass, reqlevel, reqskill1, reqskill2,
 *                               maxlvl, EType, HitShift, EMin/EMax + bands
 *               skilldesc.json: SkillPage, SkillRow, SkillColumn
 *   Extracted   60 skills (30 Paladin, 30 Sorceress)
 *
 *   The commit is pinned, not `master`. Re-running the generator reproduces
 *   this file exactly, or fails; it never silently follows the source forward.
 *   Moving to a newer extraction means bumping SOURCE_SHA on purpose and
 *   reading the diff as a game change.
 *
 * AGREEMENT
 *   Prerequisite sets identical across the repository's two extractions —
 *   the current D2R tables and the pre-D2R Lord of Destruction tables under
 *   `json/base/` — for 60 of 60 skills.
 *
 *   These are two snapshots of different game versions from one extraction
 *   project, not two independent publishers. Their agreement shows the values
 *   are not an artifact of a single extraction pass and that the prerequisite
 *   graph did not change between LoD and D2R. It is not corroboration by an
 *   unrelated party, and it is not evidence about patches after the baseline.
 *
 * LICENSING
 *   The repository is MIT licensed, but its contents are extracted from
 *   Blizzard's game files and Blizzard owns the underlying data. Only
 *   mechanical facts are taken here — unlock levels, prerequisite edges, tree
 *   membership — which are not copyrightable. No game text and no game
 *   artwork is extracted: `str name`/`str long` (Blizzard's prose) and
 *   `IconCel` (sprite-sheet indices) are deliberately excluded. See
 *   docs/sources/README.md.
 */

import type { ClassSlug, Slug } from "@/lib/types";

/**
 * Damage that scales in five level bands rather than linearly: a different
 * amount is added per level within levels 2-8, 9-16, 17-22, 23-28 and 29+.
 * Modelling this as linear is the easiest way to publish a wrong number.
 */
export interface BandedScale {
  readonly base: number;
  readonly bands: readonly number[];
}

export interface SkillGraphNode {
  readonly classSlug: Extract<ClassSlug, "paladin" | "sorceress">;
  /** The site's tree slug, derived from the game's 1-based skill page. */
  readonly tree: Slug;
  /** 1-based skill page, straight from the game data. Independent of `tree`. */
  readonly page: 1 | 2 | 3;
  /** 1-based row. INVARIANT: TIER_LEVELS[row - 1] === requiredLevel. */
  readonly row: 1 | 2 | 3 | 4 | 5 | 6;
  /** 1-based column, left to right. */
  readonly column: 1 | 2 | 3;
  readonly requiredLevel: number;
  /** Hard-point cap. 20 for every Paladin and Sorceress skill. */
  readonly maxLevel: number;
  /** Skills needing at least one point before this can be allocated. */
  readonly prerequisites: readonly Slug[];
  /**
   * Base elemental damage before synergies. Absent for skills that deal none.
   * Final value = (base + banded per-level total) x 2^(hitShift - 8).
   */
  readonly damage?: {
    readonly element: string;
    readonly hitShift: number;
    readonly min: BandedScale;
    readonly max: BandedScale;
  };
}

/** Keyed by skill slug. */
export const SKILL_GRAPH: Record<Slug, SkillGraphNode> = {
  "sacrifice": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "smite": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "holy-bolt": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [], damage: { element: "mag", hitShift: 8, min: { base: 8, bands: [8, 10, 13, 16, 20] }, max: { base: 16, bands: [8, 11, 15, 18, 23] } },
  },
  "zeal": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["sacrifice"],
  },
  "charge": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["smite"],
  },
  "vengeance": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["zeal"],
  },
  "blessed-hammer": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["holy-bolt"], damage: { element: "mag", hitShift: 8, min: { base: 12, bands: [8, 10, 12, 13, 14] }, max: { base: 16, bands: [8, 10, 12, 13, 14] } },
  },
  "conversion": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["vengeance"],
  },
  "holy-shield": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["blessed-hammer", "charge"],
  },
  "fist-of-the-heavens": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["blessed-hammer", "conversion"], damage: { element: "ltng", hitShift: 8, min: { base: 150, bands: [15, 30, 45, 55, 65] }, max: { base: 200, bands: [15, 30, 45, 55, 65] } },
  },
  "might": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "holy-fire": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["might"], damage: { element: "fire", hitShift: 7, min: { base: 2, bands: [1, 4, 6, 7, 8] }, max: { base: 6, bands: [2, 5, 7, 8, 9] } },
  },
  "thorns": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
  },
  "blessed-aim": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["might"],
  },
  "concentration": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["blessed-aim"],
  },
  "holy-freeze": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["holy-fire"], damage: { element: "cold", hitShift: 8, min: { base: 2, bands: [1, 2, 3, 4, 5] }, max: { base: 3, bands: [1, 2, 3, 4, 5] } },
  },
  "holy-shock": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["holy-freeze"], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 10, bands: [6, 8, 10, 12, 15] } },
  },
  "sanctuary": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["holy-freeze", "thorns"], damage: { element: "mag", hitShift: 8, min: { base: 8, bands: [4, 4, 5, 5, 6] }, max: { base: 16, bands: [4, 5, 6, 6, 7] } },
  },
  "fanaticism": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["concentration"],
  },
  "conviction": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["sanctuary"],
  },
  "prayer": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "resist-fire": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "defiance": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
  },
  "resist-cold": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
  },
  "cleansing": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["prayer"],
  },
  "resist-lightning": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: [],
  },
  "vigor": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["cleansing", "defiance"],
  },
  "meditation": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["cleansing"],
  },
  "redemption": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["vigor"],
  },
  "salvation": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
  },
  "fire-bolt": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [], damage: { element: "fire", hitShift: 7, min: { base: 6, bands: [3, 4, 8, 18, 54] }, max: { base: 12, bands: [3, 6, 10, 20, 56] } },
  },
  "warmth": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "inferno": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [], damage: { element: "fire", hitShift: 3, min: { base: 36, bands: [24, 30, 34, 38, 42] }, max: { base: 72, bands: [25, 31, 35, 39, 43] } },
  },
  "blaze": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["inferno"], damage: { element: "fire", hitShift: 4, min: { base: 4, bands: [3, 5, 7, 9, 11] }, max: { base: 8, bands: [3, 6, 8, 10, 12] } },
  },
  "fire-ball": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 3, column: 2,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["fire-bolt"], damage: { element: "fire", hitShift: 7, min: { base: 12, bands: [13, 23, 28, 33, 38] }, max: { base: 28, bands: [15, 25, 30, 35, 40] } },
  },
  "fire-wall": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["blaze"], damage: { element: "fire", hitShift: 4, min: { base: 15, bands: [9, 14, 21, 21, 21] }, max: { base: 20, bands: [9, 14, 21, 21, 21] } },
  },
  "enchant": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 4, column: 3,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["fire-ball", "warmth"], damage: { element: "fire", hitShift: 7, min: { base: 16, bands: [3, 7, 11, 15, 19] }, max: { base: 20, bands: [5, 9, 13, 17, 21] } },
  },
  "meteor": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["fire-ball", "fire-wall"], damage: { element: "fire", hitShift: 8, min: { base: 80, bands: [23, 39, 79, 81, 83] }, max: { base: 100, bands: [25, 41, 81, 83, 85] } },
  },
  "fire-mastery": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
  },
  "hydra": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["enchant"], damage: { element: "fire", hitShift: 7, min: { base: 28, bands: [11, 15, 19, 23, 27] }, max: { base: 39, bands: [13, 17, 21, 25, 29] } },
  },
  "charged-bolt": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [], damage: { element: "ltng", hitShift: 7, min: { base: 4, bands: [1, 1, 2, 3, 4] }, max: { base: 8, bands: [1, 1, 2, 3, 4] } },
  },
  "static-field": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
  },
  "telekinesis": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [1, 1, 1, 1, 1] }, max: { base: 2, bands: [1, 1, 1, 1, 1] } },
  },
  "nova": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["static-field"], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [6, 7, 8, 9, 10] }, max: { base: 20, bands: [8, 9, 10, 11, 12] } },
  },
  "lightning": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 3, column: 2,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["charged-bolt"], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 40, bands: [8, 12, 20, 28, 36] } },
  },
  "chain-lightning": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["lightning"], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 40, bands: [11, 13, 15, 15, 15] } },
  },
  "teleport": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 4, column: 3,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["telekinesis"],
  },
  "thunder-storm": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["chain-lightning", "nova"], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [10, 10, 11, 11, 11] }, max: { base: 100, bands: [10, 10, 11, 11, 11] } },
  },
  "energy-shield": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["chain-lightning", "teleport"],
  },
  "lightning-mastery": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
  },
  "ice-bolt": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [], damage: { element: "cold", hitShift: 7, min: { base: 6, bands: [2, 4, 6, 8, 10] }, max: { base: 10, bands: [3, 5, 7, 9, 11] } },
  },
  "frozen-armor": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
  },
  "frost-nova": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [], damage: { element: "cold", hitShift: 7, min: { base: 4, bands: [6, 8, 10, 12, 14] }, max: { base: 8, bands: [7, 9, 11, 13, 15] } },
  },
  "ice-blast": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["ice-bolt"], damage: { element: "cold", hitShift: 7, min: { base: 16, bands: [14, 28, 42, 56, 70] }, max: { base: 24, bands: [15, 29, 43, 57, 71] } },
  },
  "shiver-armor": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["frozen-armor", "ice-blast"], damage: { element: "cold", hitShift: 7, min: { base: 12, bands: [6, 8, 10, 12, 14] }, max: { base: 16, bands: [7, 9, 11, 13, 15] } },
  },
  "glacial-spike": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["ice-blast"], damage: { element: "cold", hitShift: 7, min: { base: 32, bands: [14, 26, 28, 30, 32] }, max: { base: 48, bands: [15, 27, 29, 31, 33] } },
  },
  "blizzard": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["frost-nova", "glacial-spike"], damage: { element: "cold", hitShift: 8, min: { base: 45, bands: [15, 30, 45, 55, 65] }, max: { base: 75, bands: [16, 31, 46, 56, 66] } },
  },
  "chilling-armor": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["shiver-armor"], damage: { element: "cold", hitShift: 7, min: { base: 16, bands: [8, 10, 12, 14, 16] }, max: { base: 20, bands: [9, 11, 13, 15, 17] } },
  },
  "frozen-orb": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["blizzard"], damage: { element: "cold", hitShift: 7, min: { base: 80, bands: [20, 24, 28, 29, 30] }, max: { base: 90, bands: [21, 25, 29, 30, 31] } },
  },
  "cold-mastery": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
  },
};

/** Character level thresholds, indexed by tree row. */
export const TIER_LEVELS = [1, 6, 12, 18, 24, 30] as const;

/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */
export const MAX_HARD_POINTS = 110;
