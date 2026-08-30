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

export interface SkillSynergy {
  /** Slug of the skill that provides the bonus. */
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
  synergies?: SkillSynergy[];
  /** Skills that gain a bonus *from* this one. Authored, not derived. */
  synergyFor?: Slug[];
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
