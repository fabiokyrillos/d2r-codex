/**
 * Core primitives shared across every domain model.
 *
 * Rules for this file:
 * - Nothing here may import from another `types/*` module (keeps the graph acyclic).
 * - Prefer string-literal unions over enums so data files stay plain JSON-ish.
 * - Every union that appears in UI has a matching label map in `lib/labels.ts`.
 */

/** A URL-safe identifier. Used for routing and cross-referencing. */
export type Slug = string;

// ---------------------------------------------------------------------------
// Game structure
// ---------------------------------------------------------------------------

export const DIFFICULTIES = ["normal", "nightmare", "hell"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const ACTS = [1, 2, 3, 4, 5] as const;
export type Act = (typeof ACTS)[number];

export const CLASS_SLUGS = [
  "amazon",
  "assassin",
  "barbarian",
  "druid",
  "necromancer",
  "paladin",
  "sorceress",
  "warlock",
] as const;
export type ClassSlug = (typeof CLASS_SLUGS)[number];

/**
 * Which release a piece of content belongs to. Anything gated behind the paid
 * Reign of the Warlock DLC must be flagged so the UI can warn the player.
 */
export const RELEASES = ["classic", "lod", "d2r", "reign-of-the-warlock"] as const;
export type Release = (typeof RELEASES)[number];

// ---------------------------------------------------------------------------
// Play mode axes
// ---------------------------------------------------------------------------

/**
 * Modes only appear on content where they genuinely change the recommendation.
 * Content with `undefined` applies everywhere.
 */
export type LadderMode = "ladder" | "non-ladder";
export type OnlineMode = "online" | "offline";
export type LifeMode = "softcore" | "hardcore";

export interface ModeScope {
  ladder?: LadderMode[];
  online?: OnlineMode[];
  life?: LifeMode[];
}

// ---------------------------------------------------------------------------
// Progression tiers
// ---------------------------------------------------------------------------

/**
 * The backbone of the site's gear-progression philosophy.
 *
 * Deliberately six tiers, not eleven. Players think in terms of "where am I
 * stuck", and a tier list longer than this stops being scannable. Each tier
 * carries its own level band and difficulty context (see `lib/progression.ts`).
 */
export const PROGRESSION_TIERS = [
  "starter",
  "nightmare",
  "early-hell",
  "budget",
  "optimized",
  "bis",
] as const;
export type ProgressionTier = (typeof PROGRESSION_TIERS)[number];

// ---------------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------------

export const GEAR_SLOTS = [
  "helm",
  "amulet",
  "weapon",
  "offhand",
  "body",
  "gloves",
  "belt",
  "boots",
  "ring1",
  "ring2",
] as const;
export type GearSlot = (typeof GEAR_SLOTS)[number];

export const MERC_SLOTS = ["helm", "weapon", "body"] as const;
export type MercSlot = (typeof MERC_SLOTS)[number];

export const ITEM_QUALITIES = [
  "normal",
  "superior",
  "magic",
  "rare",
  "set",
  "unique",
  "crafted",
  "runeword",
] as const;
export type ItemQuality = (typeof ITEM_QUALITIES)[number];

/** Item tier ladder — drives base-item availability and area-level gating. */
export const ITEM_TIERS = ["normal", "exceptional", "elite"] as const;
export type ItemTier = (typeof ITEM_TIERS)[number];

// ---------------------------------------------------------------------------
// Damage & resistance
// ---------------------------------------------------------------------------

export const ELEMENTS = [
  "physical",
  "magic",
  "fire",
  "cold",
  "lightning",
  "poison",
] as const;
export type Element = (typeof ELEMENTS)[number];

/** Elements that monsters can be immune to. Physical immunity exists too. */
export type ImmunityType = Element;

// ---------------------------------------------------------------------------
// Ratings
// ---------------------------------------------------------------------------

/**
 * A 1-5 rating. Used for build comparison axes (clear speed, bossing, etc.).
 * Kept coarse on purpose: finer scales imply a precision we cannot justify.
 */
export type Rating = 1 | 2 | 3 | 4 | 5;

/** How much investment a thing needs before it works at all. */
export const BUDGET_LEVELS = ["low", "medium", "high", "extreme"] as const;
export type BudgetLevel = (typeof BUDGET_LEVELS)[number];

export const DIFFICULTY_RATINGS = ["beginner", "moderate", "advanced", "expert"] as const;
export type PlayDifficulty = (typeof DIFFICULTY_RATINGS)[number];

// ---------------------------------------------------------------------------
// Availability
//
// `ModeScope` above says which modes a thing *belongs* to. It cannot say what
// Mosaic needs said, and the difference is not pedantic — it is the difference
// between two sentences that are both currently published about the same item:
//
//   "Mosaic is Non-Ladder."   false: a Ladder character can wear one
//   "Mosaic is Ladder-only."  false, and backwards: it was, seasons ago
//
// The runeword carries `disallowCraftingInLadder: 1`, which is a statement
// about *making* it and says nothing about wearing it. A single list, or worse
// a boolean, has to pick one of those two verbs and silently drop the other.
// So availability is a status per mode, every mode answered, and the statuses
// name the verb.
// ---------------------------------------------------------------------------

/**
 * What you can do with a thing in one mode, right now, on one baseline.
 *
 * - `craftable`  can be made here, and therefore used here
 * - `usable`     can be equipped and used here, but cannot be made here
 * - `disabled`   cannot be made and cannot be used here
 * - `unknown`    not established — say so rather than guess
 */
export const AVAILABILITY_STATUSES = ["craftable", "usable", "disabled", "unknown"] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

/**
 * The mode axes availability actually varies along.
 *
 * Not `LadderMode × OnlineMode`: offline has no ladder, so three of the four
 * cells that product would produce do not exist, and a table with empty cells
 * invites the reader to fill them in.
 */
export const AVAILABILITY_MODES = ["ladder", "non-ladder-online", "offline"] as const;
export type AvailabilityMode = (typeof AVAILABILITY_MODES)[number];

export interface AvailabilityRow {
  mode: AvailabilityMode;
  status: AvailabilityStatus;
}

/**
 * The prose half — en-US colocated with the data, overlaid per locale exactly
 * as `commonMistakes` and `notes` are.
 *
 * Statuses are labelled from the dictionary; what needs writing per locale is
 * *why* each mode reads the way it does, what it means for the reader, and —
 * where the answer used to be different — what it used to be, so nobody
 * reading an older guide concludes this page is the stale one.
 */
export interface AvailabilityNotes {
  /** One line per mode, keyed by mode. Every mode, same rule as the data. */
  rows: Record<AvailabilityMode, string>;
  /** What this means for someone deciding whether to start. */
  consequence: string;
  /** What it used to be, where that differs. Omit when it never changed. */
  history?: string;
}

export interface Availability {
  /**
   * One row per mode in `AVAILABILITY_MODES`, all of them, always.
   *
   * A missing row would read as "no restriction" to every reader, which is the
   * assumption this type exists to stop. `unknown` is the answer for a mode
   * that has not been established; silence is not.
   */
  rows: AvailabilityRow[];
  notes: AvailabilityNotes;
  /** The field or announcement this is read from. Invariant, not localized. */
  source: string;
  /** ISO date the rows were last checked against that source. */
  checked: string;
  /** The game baseline they hold for. Invariant. */
  baseline: string;
}

// ---------------------------------------------------------------------------
// Confidence / verification
// ---------------------------------------------------------------------------

/**
 * How well-established a claim is. Surfaced in the UI only when it is not
 * `verified`, so readers know when we are on softer ground.
 *
 * - `verified`   cross-checked against 2+ reputable sources, or trivially known
 * - `single`     one reputable source, not contradicted
 * - `community`  community consensus, no authoritative confirmation
 * - `unverified` we believe it but have not confirmed it — must be labelled
 */
export const CONFIDENCE_LEVELS = ["verified", "single", "community", "unverified"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

// ---------------------------------------------------------------------------
// Shared entity shape
// ---------------------------------------------------------------------------

/** Every routable content entity carries these. */
export interface Entity {
  slug: Slug;
  name: string;
  /** One sentence. Used in cards, search results, and meta descriptions. */
  summary: string;
}
