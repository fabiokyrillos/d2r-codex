import type {
  Availability,
  Confidence,
  Entity,
  GearSlot,
  ItemQuality,
  ItemTier,
  ModeScope,
  ProgressionTier,
  Release,
  Slug,
} from "./core";

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

/**
 * A pointer to a catalogued entity. This is the mechanism that stops the site
 * from restating the same item twelve different ways across twelve builds:
 * builds reference, they do not describe.
 *
 * Resolved by `lib/registry/resolve.ts`, which turns a ref into a link, a label
 * and (where available) full item data for tooltips.
 */
export type ItemRef =
  | { kind: "unique"; slug: Slug }
  | { kind: "set"; slug: Slug }
  | { kind: "set-item"; slug: Slug }
  | { kind: "runeword"; slug: Slug }
  | { kind: "base"; slug: Slug }
  | { kind: "rune"; slug: Slug }
  | { kind: "charm"; slug: Slug };

export type RefKind = ItemRef["kind"];

// ---------------------------------------------------------------------------
// Stat lines
// ---------------------------------------------------------------------------

/**
 * Item stat lines are stored as display strings rather than parsed structures.
 *
 * This is a deliberate trade-off. Parsing every affix into `{ stat, min, max }`
 * would let us compute things, but D2's affix text is wildly irregular
 * ("Adds 1-6 Cold Damage, Cold Duration 2 seconds", "+1 to Sorceress Skill
 * Levels", "Requirements -15%"), and a half-correct parser silently produces
 * wrong numbers. Wrong numbers are the one thing this project cannot ship.
 *
 * Where we genuinely need computation (breakpoints, resistances), the relevant
 * values are modelled explicitly on the entity instead.
 */
export interface StatLine {
  text: string;
  /** Set when a stat varies by roll and the range matters to the reader. */
  variable?: boolean;
  /** Highlight the stat lines that actually motivate the item. */
  notable?: boolean;
}

// ---------------------------------------------------------------------------
// Base items
// ---------------------------------------------------------------------------

export const BASE_CATEGORIES = [
  "helm",
  "body-armor",
  "shield",
  "gloves",
  "belt",
  "boots",
  "sword",
  "axe",
  "mace",
  "hammer",
  "scepter",
  "polearm",
  "spear",
  "bow",
  "crossbow",
  "javelin",
  "staff",
  "wand",
  "dagger",
  "throwing",
  "orb",
  "claw",
  "amazon-weapon",
  "paladin-shield",
  "necromancer-head",
  "druid-pelt",
  "barbarian-helm",
  "grimoire",
  "circlet",
  "ring",
  "amulet",
  "jewel",
  "charm",
] as const;
export type BaseCategory = (typeof BASE_CATEGORIES)[number];

export interface BaseItem extends Entity {
  category: BaseCategory;
  tier: ItemTier;
  /** Item level of the base when found. Drives what affixes can roll. */
  qualityLevel?: number;
  requiredLevel?: number;
  requiredStrength?: number;
  requiredDexterity?: number;
  /** Maximum sockets the base can ever have, at any ilvl. */
  maxSockets?: number;
  /** Sockets Larzuk will add — depends on quality; see `lib/mechanics/sockets`. */
  socketNotes?: string;
  /** Base speed modifier for weapons, e.g. -10 (faster) .. 20 (slower). */
  weaponSpeed?: number;
  twoHanded?: boolean;
  /** Runewords commonly targeted at this base. */
  runewordTargets?: Slug[];
  /** Why a player would keep this base when it drops. */
  keepReason?: string;
  release?: Release;
}

// ---------------------------------------------------------------------------
// Unique / set items
// ---------------------------------------------------------------------------

export interface DropInfo {
  /** Human-readable summary of where this realistically comes from. */
  summary: string;
  /** Farming area slugs where this is a realistic target. */
  areas?: Slug[];
  /** Minimum monster/area level required for the item to drop at all. */
  minMonsterLevel?: number;
  gamblable?: boolean;
  craftable?: boolean;
  shoppable?: boolean;
  /** How commonly this trades — informs "just buy it" advice. */
  tradeability?: "abundant" | "common" | "uncommon" | "rare" | "very-rare";
  confidence?: Confidence;
}

export interface UniqueItem extends Entity {
  quality: Extract<ItemQuality, "unique" | "set">;
  base: string;
  baseSlug?: Slug;
  category: BaseCategory;
  tier: ItemTier;
  slots: GearSlot[];
  requiredLevel?: number;
  requiredStrength?: number;
  requiredDexterity?: number;
  maxSockets?: number;
  stats: StatLine[];
  /** Which set this belongs to, for set items. */
  setSlug?: Slug;
  drop?: DropInfo;
  /** Free-text on why this item matters and who wants it. */
  notes?: string;
  /** Items that fill the same role at a lower/higher tier. */
  alternatives?: ItemRef[];
  release?: Release;
  modes?: ModeScope;
  confidence?: Confidence;
}

// ---------------------------------------------------------------------------
// Runes
// ---------------------------------------------------------------------------

export interface Rune extends Entity {
  /** 1 (El) through 33 (Zod). Determines drop rarity and sort order. */
  number: number;
  requiredLevel: number;
  weaponMod: string;
  armorMod: string;
  helmMod: string;
  shieldMod: string;
  /** Upward cube recipe, e.g. "3 x El = Eld". Null for Zod. */
  upgradeRecipe?: string;
  /**
   * Highest realistic farming source. Rune drops are heavily gated by area
   * level and treasure class, so this is genuinely useful information.
   */
  farmNotes?: string;
  /** Runewords that need this rune — computed, not authored. */
  release?: Release;
}

export type RuneTier = "low" | "mid" | "high";

// ---------------------------------------------------------------------------
// Runewords
// ---------------------------------------------------------------------------

/**
 * Base types a runeword may be made in. Kept as a structured list rather than
 * prose because the #1 runeword mistake is using the wrong base, and the UI
 * needs to render this unmissably.
 */
export interface RunewordBaseRule {
  /** Categories the runeword accepts. */
  categories: BaseCategory[];
  /** Human phrasing, e.g. "Any 4-socket Sword, Axe or Polearm". */
  display: string;
  /** Explicit exclusions people get wrong, e.g. "not Assassin Claws". */
  exclusions?: string[];
}

export interface Runeword extends Entity {
  /** Runes in socket order. Order matters and is the most common mistake. */
  runes: Slug[];
  sockets: number;
  bases: RunewordBaseRule;
  /** Character level required to use it — the max of the constituent runes. */
  requiredLevel: number;
  stats: StatLine[];
  /** Guidance on which specific base to pick and why. */
  recommendedBases?: string[];
  /** When in a character's life this becomes relevant. */
  tier: ProgressionTier;
  /** Plain-language "who should make this". */
  usedBy?: string;
  /** Mistakes to avoid — surfaced as a warning callout. */
  commonMistakes?: string[];
  modes?: ModeScope;
  /**
   * Present only where making it and using it are different questions.
   *
   * `modes` above is the ordinary case — a runeword that belongs to one ladder
   * side. This field is for the one that does not: see `Availability`.
   */
  availability?: Availability;
  release?: Release;
  confidence?: Confidence;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Gear picks (build-facing)
// ---------------------------------------------------------------------------

/**
 * One recommended item in one slot, at one progression tier, for one build.
 *
 * A pick is *either* a reference to a catalogued item, or a described item
 * (rares and crafts have no catalogue entry — "a rare ring with 10% FCR and
 * resistances" is the actual recommendation).
 */
export interface GearPick {
  ref?: ItemRef;
  /** Display label. Required when `ref` is absent. */
  label?: string;
  /** Why this, for this build, at this tier. One or two sentences. */
  why: string;
  /** Affixes to prioritise when hunting or rolling this item. */
  lookFor?: string[];
  /** Socketing advice specific to this build. */
  sockets?: string;
  /** Cheaper or more available stand-ins. */
  alternatives?: GearPick[];
  /** Flag picks that are effectively unobtainable self-found. */
  tradeOnly?: boolean;
  modes?: ModeScope;
}

export interface GearSetSlotEntry {
  slot: GearSlot;
  picks: GearPick[];
}

/** A complete recommended loadout at one progression tier. */
export interface GearSet {
  tier: ProgressionTier;
  /** Short framing: what the character can do once they have this. */
  goal: string;
  /** Rough character level band this set is aimed at. */
  levelRange?: [number, number];
  slots: GearSetSlotEntry[];
  /** Charms, torch, anni, sunder — not a normal equipment slot. */
  charms?: GearPick[];
  /** Second weapon set, e.g. CTA + Spirit. */
  weaponSwap?: GearPick[];
  /** What to fix next once this set is assembled. */
  nextUpgrade?: string;
  notes?: string;
}
