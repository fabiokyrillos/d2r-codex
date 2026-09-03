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
   * How this skill's damage is actually composed, where the extracted columns
   * cannot say on their own.
   *
   * The graph carries a skill's *own* min–max elemental damage. What it never
   * carries is the relationship between that number and the weapon, and that
   * relationship is not one thing:
   *
   *   proportional                  a fraction of the target's life, so there
   *                                 is no range to publish (Static Field)
   *   shield                        the base is the shield's Smite Damage and
   *                                 the skill does not roll Attack Rating
   *   weapon-plus-element           the weapon's full damage lands, and the
   *                                 tabulated elemental damage lands with it
   *   weapon-converted-to-element   the weapon's damage is carried, and a share
   *                                 of it is turned into this element rather
   *                                 than added alongside
   *   element-only-attack           an attack that carries no weapon damage at
   *                                 all; the table is the whole of it
   *   corpse-life                   the damage is a share of the exploded
   *                                 corpse's *type's* base life, so it belongs
   *                                 to what died rather than to the skill
   *
   * Plain weapon attacks need no entry — `kind === "attack"` with no elemental
   * table is unambiguous. Everything else is authored, never derived, and
   * `check:content` refuses an attack whose damage the graph tabulates but
   * which names no model here.
   *
   * That refusal is the point, and the javelin tree is where it earns its keep.
   * A rule of the shape "an attack with a table adds its element to the weapon"
   * would be right for Power Strike and Fire Arrow and wrong for Charged
   * Strike, whose damage is entirely lightning and carries none of the weapon's
   * physical. Lightning Strike looks identical in the tables — both leave
   * `SrcDam` empty — and behaves differently: it lands the weapon's full damage
   * on the target it strikes, plus its own lightning, and the chain is created
   * separately from there. The two are told apart by the stage each runs
   * (`SrvSt06` passes the empty column through; `SrvSt10` substitutes 0x80),
   * not by anything in the columns. So no derivation is attempted, and Jab
   * stays on every javelin bar because the tree's damage is mostly lightning
   * rather than because none of it touches a weapon.
   */
  damageModel?:
    | "proportional"
    | "shield"
    | "weapon-plus-element"
    | "weapon-converted-to-element"
    | "element-only-attack"
    | "corpse-life";
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
