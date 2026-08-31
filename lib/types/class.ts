import type {
  ClassSlug,
  Confidence,
  Element,
  Entity,
  Release,
  Slug,
} from "./core";

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export const SKILL_KINDS = [
  "attack",
  "spell",
  "passive",
  "aura",
  "summon",
  "curse",
  "buff",
  "shapeshift",
] as const;
export type SkillKind = (typeof SKILL_KINDS)[number];

/**
 * The magnitude of one synergy, in prose.
 *
 * The *identity* of a synergy is not authored — it comes from the generated
 * graph, which reads the game's own formulas. This carries only the number a
 * reader wants next to it, and `check:content` rejects an entry whose `skill`
 * is not a synergy the graph recognises.
 */
export interface SkillSynergy {
  /** Slug of the skill that provides the bonus. Must exist in the graph. */
  skill: Slug;
  /** Human description of the bonus, e.g. "+8% damage per level". */
  bonus: string;
}

export interface Skill extends Entity {
  classSlug: ClassSlug;
  /** Slug of the tree this skill sits in. */
  tree: Slug;
  kind: SkillKind;
  /** Character level at which the skill unlocks (1, 6, 12, 18, 24, 30). */
  requiredLevel: number;
  /** Skills that must have at least 1 point before this can be taken. */
  prerequisites?: Slug[];
  element?: Element;
  /**
   * Magnitudes only. Which skills feed this one comes from the graph; the
   * reverse direction is derived by `synergyReceivers` and is never authored.
   */
  synergies?: SkillSynergy[];
  /**
   * Damage that the extracted elemental columns cannot express.
   *
   * The graph carries a skill's *own* min–max elemental damage. Three shapes
   * fall outside that and must not be reported as "no damage":
   *
   *   weapon        the damage is the weapon's, scaled by the skill's bonus
   *   shield        the damage is the shield's Smite Damage, and the skill
   *                 does not roll against Attack Rating at all
   *   proportional  the damage is a fraction of the target's life
   *
   * `weapon` is derived from `kind === "attack"` and needs no authoring. The
   * other two do: nothing in the extracted columns distinguishes them from a
   * skill with no damage, and nothing distinguishes a shield attack from a
   * weapon attack — Smite is `kind: "attack"` like the other five, and reading
   * its damage off the weapon is exactly the falsehood this field prevents.
   */
  damageModel?: "proportional" | "shield";
  /** Mana cost at base, when it is decision-relevant. */
  manaCost?: string;
  /** Cast/attack behaviour notes that affect play. */
  mechanics?: string[];
  confidence?: Confidence;
  release?: Release;
}

export interface SkillTree extends Entity {
  classSlug: ClassSlug;
  /** Display order, left to right, matching the in-game UI. */
  order: number;
  /** Theme sentence for the tree. */
  theme: string;
}

// ---------------------------------------------------------------------------
// Class
// ---------------------------------------------------------------------------

export interface ClassAttributes {
  strength: number;
  dexterity: number;
  vitality: number;
  energy: number;
  hitPoints: number;
  stamina: number;
  mana: number;
  /** Life gained per point of Vitality. */
  lifePerVitality: number;
  /** Mana gained per point of Energy. */
  manaPerEnergy: number;
  /** Life gained per character level. */
  lifePerLevel: number;
  manaPerLevel: number;
  staminaPerVitality?: number;
}

export interface CharacterClass extends Entity {
  slug: ClassSlug;
  /** One-paragraph identity. */
  overview: string;
  release: Release;
  /** Set when the class needs a paid purchase beyond base D2R. */
  requiresDlc?: string;
  strengths: string[];
  weaknesses: string[];
  /** What makes this class mechanically distinct. */
  coreMechanics: { title: string; body: string }[];
  attributes?: ClassAttributes;
  /** Slugs of this class's skill trees, in in-game order. */
  trees: Slug[];
  /** Weapon/armour classes only this class can use. */
  classItems?: string[];
  /** Blunt guidance on who should pick this class. */
  bestFor: string;
  /** Coarse newcomer-friendliness, 1 (hard) to 5 (easy). */
  beginnerFriendliness: 1 | 2 | 3 | 4 | 5;
  confidence?: Confidence;
}
