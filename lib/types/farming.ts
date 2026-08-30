import type {
  Act,
  ClassSlug,
  Confidence,
  Difficulty,
  Element,
  Entity,
  Rating,
  Release,
  Slug,
} from "./core";
import type { ItemRef } from "./item";

/**
 * Area levels differ per difficulty, and that difference is the whole reason
 * area levels matter (85 is the threshold where the best treasure classes
 * unlock). Stored as an explicit triple so nothing has to be derived.
 */
export interface AreaLevels {
  normal: number;
  nightmare: number;
  hell: number;
}

export const FARM_TARGETS = [
  "runes",
  "uniques",
  "sets",
  "bases",
  "charms",
  "jewels",
  "gems",
  "experience",
  "gold",
  "keys",
  "essences",
] as const;
export type FarmTarget = (typeof FARM_TARGETS)[number];

export interface AreaBoss {
  name: string;
  /** Super unique, act boss, or a regular unique pack. */
  kind: "act-boss" | "super-unique" | "unique-pack" | "event";
  /** Monster level at Hell, when it differs from the area level. */
  hellLevel?: number;
  notes?: string;
  /** Immunities this boss always or often carries. */
  immunities?: Element[];
}

export interface FarmingArea extends Entity {
  act: Act;
  /** Waypoint proximity is the single biggest factor in run efficiency. */
  access: string;
  levels: AreaLevels;
  /**
   * True when the Hell area level is 85+, unlocking the highest treasure
   * classes. This is the most consequential single fact about an area.
   */
  hellLevel85: boolean;
  /** Monster density, 1 (sparse) to 5 (packed). */
  density: Rating;
  /** How dangerous it is relative to a player at the appropriate level. */
  danger: Rating;
  /** Roughly how long one clear takes, for run-efficiency comparisons. */
  runLength: "very-short" | "short" | "medium" | "long";
  /** Common immunities you must plan around, in Hell. */
  commonImmunities: Element[];
  bosses?: AreaBoss[];
  /** What this area is actually good for. */
  targets: FarmTarget[];
  /** Specific notable drops worth calling out. */
  notableDrops?: ItemRef[];
  /** Why you would run this, in one or two sentences. */
  why: string;
  /** Practical route advice. */
  route?: string[];
  /** Classes/builds that handle this area particularly well or badly. */
  suitedTo?: ClassSlug[];
  poorlySuitedTo?: string;
  /** Whether the area participates in Terror Zone rotation. */
  terrorZone?: boolean;
  /** Difficulties where running this is actually sensible. */
  recommendedDifficulties: Difficulty[];
  notes?: string;
  release?: Release;
  confidence?: Confidence;
}

// ---------------------------------------------------------------------------
// Mercenaries
// ---------------------------------------------------------------------------

export interface MercenaryGearPick {
  slot: "helm" | "weapon" | "body";
  tier: "budget" | "mid" | "endgame";
  ref?: ItemRef;
  label?: string;
  why: string;
}

export interface Mercenary extends Entity {
  /** Act the mercenary is hired from. */
  act: Act;
  /** Which difficulty's version you should actually hire. */
  hireAdvice: string;
  /** Aura or primary ability offered, by difficulty where relevant. */
  abilities: { name: string; difficulty?: Difficulty; description: string }[];
  /** Weapon classes the merc can equip. */
  weaponTypes: string[];
  strengths: string[];
  weaknesses: string[];
  /** Which builds want this merc and why. */
  bestFor: string;
  gear: MercenaryGearPick[];
  survivability: string;
  /** Practical notes: reviving cost, positioning, when it dies. */
  notes?: string[];
  release?: Release;
  confidence?: Confidence;
}

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

export interface BreakpointRow {
  /** Percentage of the stat required. */
  value: number;
  /** Resulting animation length in frames (25 frames = 1 second). */
  frames: number;
}

export interface BreakpointTable extends Entity {
  stat: "fcr" | "fhr" | "fbr" | "ias";
  /** Class this table applies to; omit for tables shared by all classes. */
  classSlug?: ClassSlug;
  /**
   * Some tables are per-weapon-class or per-form rather than per-class
   * (Barbarian FHR differs by weapon, Druid differs by shapeshift form).
   */
  variant?: string;
  rows: BreakpointRow[];
  /** Which breakpoints are worth targeting and why. */
  guidance?: string[];
  confidence?: Confidence;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Mechanics articles
// ---------------------------------------------------------------------------

export const MECHANIC_CATEGORIES = [
  "loot",
  "combat",
  "defense",
  "character",
  "endgame",
  "items",
] as const;
export type MechanicCategory = (typeof MECHANIC_CATEGORIES)[number];

/**
 * Long-form mechanics explanations. Body is stored as typed content blocks
 * rather than a raw string so that item references inside prose stay linkable
 * and type-checked, and so tables keep their structure.
 */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; variant: "info" | "warning" | "success" | "danger"; title?: string; text: string }
  | { type: "formula"; expression: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "refs"; title?: string; refs: ItemRef[] };

export interface MechanicArticle extends Entity {
  category: MechanicCategory;
  /** Short answer up top, for readers who only need the number. */
  keyFacts: string[];
  body: ContentBlock[];
  related?: Slug[];
  confidence?: Confidence;
  release?: Release;
}
