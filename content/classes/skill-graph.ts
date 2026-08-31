/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with `npm run gen:skill-graph` (see scripts/generate-skill-graph.ts).
 *
 * The canonical skill graph for the Paladin and the Sorceress: which tree a
 * skill belongs to, what character level unlocks it, and which skills the game
 * requires before it can be allocated.
 *
 * PROVENANCE
 *   Source      blizzhackers/d2data, `json/skills.json` and `json/skilldesc.json`
 *   Baseline    D2R Patch 3.3 / Ladder Season 15 extraction
 *   Fields      skills.json:    charclass, reqlevel, reqskill1, reqskill2
 *               skilldesc.json: SkillPage
 *   Extracted   60 skills (30 Paladin, 30 Sorceress)
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

export interface SkillGraphNode {
  readonly classSlug: Extract<ClassSlug, "paladin" | "sorceress">;
  /** The site's tree slug, derived from the game's 1-based skill page. */
  readonly tree: Slug;
  /** 1-based skill page, straight from the game data. Independent of `tree`. */
  readonly page: 1 | 2 | 3;
  readonly requiredLevel: number;
  /** Skills needing at least one point before this can be allocated. */
  readonly prerequisites: readonly Slug[];
}

/** Keyed by skill slug. */
export const SKILL_GRAPH: Record<Slug, SkillGraphNode> = {
  "sacrifice": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 1, prerequisites: [] },
  "smite": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 1, prerequisites: [] },
  "holy-bolt": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 6, prerequisites: [] },
  "charge": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 12, prerequisites: ["smite"] },
  "zeal": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 12, prerequisites: ["sacrifice"] },
  "blessed-hammer": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 18, prerequisites: ["holy-bolt"] },
  "vengeance": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 18, prerequisites: ["zeal"] },
  "conversion": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 24, prerequisites: ["vengeance"] },
  "holy-shield": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 24, prerequisites: ["blessed-hammer", "charge"] },
  "fist-of-the-heavens": { classSlug: "paladin", tree: "combat-skills", page: 1, requiredLevel: 30, prerequisites: ["blessed-hammer", "conversion"] },
  "might": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 1, prerequisites: [] },
  "holy-fire": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 6, prerequisites: ["might"] },
  "thorns": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 6, prerequisites: [] },
  "blessed-aim": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 12, prerequisites: ["might"] },
  "concentration": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 18, prerequisites: ["blessed-aim"] },
  "holy-freeze": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 18, prerequisites: ["holy-fire"] },
  "holy-shock": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 24, prerequisites: ["holy-freeze"] },
  "sanctuary": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 24, prerequisites: ["holy-freeze", "thorns"] },
  "conviction": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 30, prerequisites: ["sanctuary"] },
  "fanaticism": { classSlug: "paladin", tree: "offensive-auras", page: 2, requiredLevel: 30, prerequisites: ["concentration"] },
  "prayer": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 1, prerequisites: [] },
  "resist-fire": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 1, prerequisites: [] },
  "defiance": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 6, prerequisites: [] },
  "resist-cold": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 6, prerequisites: [] },
  "cleansing": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 12, prerequisites: ["prayer"] },
  "resist-lightning": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 12, prerequisites: [] },
  "vigor": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 18, prerequisites: ["cleansing", "defiance"] },
  "meditation": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 24, prerequisites: ["cleansing"] },
  "redemption": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 30, prerequisites: ["vigor"] },
  "salvation": { classSlug: "paladin", tree: "defensive-auras", page: 3, requiredLevel: 30, prerequisites: [] },
  "fire-bolt": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 1, prerequisites: [] },
  "warmth": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 1, prerequisites: [] },
  "inferno": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 6, prerequisites: [] },
  "blaze": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 12, prerequisites: ["inferno"] },
  "fire-ball": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 12, prerequisites: ["fire-bolt"] },
  "enchant": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 18, prerequisites: ["fire-ball", "warmth"] },
  "fire-wall": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 18, prerequisites: ["blaze"] },
  "meteor": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 24, prerequisites: ["fire-ball", "fire-wall"] },
  "fire-mastery": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 30, prerequisites: [] },
  "hydra": { classSlug: "sorceress", tree: "fire-spells", page: 1, requiredLevel: 30, prerequisites: ["enchant"] },
  "charged-bolt": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 1, prerequisites: [] },
  "static-field": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 6, prerequisites: [] },
  "telekinesis": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 6, prerequisites: [] },
  "lightning": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 12, prerequisites: ["charged-bolt"] },
  "nova": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 12, prerequisites: ["static-field"] },
  "chain-lightning": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 18, prerequisites: ["lightning"] },
  "teleport": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 18, prerequisites: ["telekinesis"] },
  "energy-shield": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 24, prerequisites: ["chain-lightning", "teleport"] },
  "thunder-storm": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 24, prerequisites: ["chain-lightning", "nova"] },
  "lightning-mastery": { classSlug: "sorceress", tree: "lightning-spells", page: 2, requiredLevel: 30, prerequisites: [] },
  "frozen-armor": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 1, prerequisites: [] },
  "ice-bolt": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 1, prerequisites: [] },
  "frost-nova": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 6, prerequisites: [] },
  "ice-blast": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 6, prerequisites: ["ice-bolt"] },
  "shiver-armor": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 12, prerequisites: ["frozen-armor", "ice-blast"] },
  "glacial-spike": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 18, prerequisites: ["ice-blast"] },
  "blizzard": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 24, prerequisites: ["frost-nova", "glacial-spike"] },
  "chilling-armor": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 24, prerequisites: ["shiver-armor"] },
  "cold-mastery": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 30, prerequisites: [] },
  "frozen-orb": { classSlug: "sorceress", tree: "cold-spells", page: 3, requiredLevel: 30, prerequisites: ["blizzard"] },
};

/** Character level thresholds, indexed by tree row. */
export const TIER_LEVELS = [1, 6, 12, 18, 24, 30] as const;

/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */
export const MAX_HARD_POINTS = 110;
