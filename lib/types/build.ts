import type {
  BudgetLevel,
  ClassSlug,
  Confidence,
  Difficulty,
  Element,
  Entity,
  ModeScope,
  PlayDifficulty,
  ProgressionTier,
  Rating,
  Release,
  Slug,
} from "./core";
import type { GearPick, GearSet, ItemRef } from "./item";

// ---------------------------------------------------------------------------
// Skill & stat planning
// ---------------------------------------------------------------------------

export const ALLOCATION_ROLES = [
  "main",
  "synergy",
  "utility",
  "prerequisite",
  "flex",
] as const;
export type AllocationRole = (typeof ALLOCATION_ROLES)[number];

export interface SkillAllocation {
  skill: Slug;
  /** Final point investment at level 99 with all quest skills. */
  points: number;
  role: AllocationRole;
  /** Lower number = max this first. Shown as the "maxing order". */
  order?: number;
  note?: string;
}

// ---------------------------------------------------------------------------
// Optional packages
//
// A build whose core is mathematically closed — every synergy it has, already
// maxed — still has points left, and `flexPoints` could only describe them in
// prose. Prose cannot say "these two are alternatives", cannot be added up, and
// cannot be checked. Two Sorceress pages were publishing forty-one and forty
// spare points against a paragraph that named four destinations worth well over
// a hundred points between them, with nothing saying you may take one.
//
// So: the core plan stays in `skills` and is the thing every reader spends. A
// package is a *complete* second half of the plan, costed, with siblings it
// excludes. Nothing here is Sorceress-specific and nothing here knows what a
// synergy is; it is a budget with a name.
// ---------------------------------------------------------------------------

export interface SkillPackage {
  /** Stable within the build. Keys the locale overlay and the DOM. */
  id: string;
  name: string;
  /** The case for this one over its siblings. */
  when: string;
  /** What taking it costs you — the sibling you are giving up. */
  tradeoff: string;
  /**
   * Final hard points per skill, **including** any core allocation this raises.
   *
   * Final rather than additional, because that is the number a reader reads off
   * their own skill screen. The cost is the difference from the core, computed
   * in `lib/builds/packages.ts`, so a prerequisite the core already pays for
   * costs this package nothing and cannot be counted twice.
   */
  skills: SkillAllocation[];
  /** How the package changes the gear plan, if it does. */
  gearNote?: string;
  /** How it changes the attribute plan, if it does. */
  statNote?: string;
  /** How it changes what you actually press, if it does. */
  rotationNote?: string;
  /** What it is for — the content this route is chosen to run. */
  contentNote?: string;
  /** Where any genuinely free points go once the package is paid for. */
  remainderNote?: string;
}

export interface SkillPackageGroup {
  id: string;
  name: string;
  /**
   * `one` — the packages are alternatives and the reader takes exactly one.
   * `any` — they are independent and may be combined.
   *
   * The distinction is the whole reason this type exists, so it is required
   * rather than defaulted: a group that does not say which it is would render
   * as the "max everything" tree this model was written to stop.
   */
  choose: "one" | "any";
  intro: string;
  packages: SkillPackage[];
}

export interface StatPlan {
  strength: string;
  dexterity: string;
  vitality: string;
  energy: string;
  /** Explains the exceptions — this is where most stat advice goes wrong. */
  notes: string[];
}

// ---------------------------------------------------------------------------
// Breakpoint targets
// ---------------------------------------------------------------------------

export interface BreakpointTarget {
  /** Which breakpoint table applies. */
  stat: "fcr" | "fhr" | "fbr" | "ias";
  /** The percentage to reach. */
  value: number;
  /** Frames at that value, for context. */
  frames?: number;
  /** Why this is the one to aim for on this build. */
  why: string;
  priority: "required" | "recommended" | "luxury";
}

// ---------------------------------------------------------------------------
// Build ratings
// ---------------------------------------------------------------------------

export interface BuildRatings {
  clearSpeed: Rating;
  bossing: Rating;
  survivability: Rating;
  magicFind: Rating;
  /** Ability to run Terror Zones at high player counts. */
  terrorZones: Rating;
  /** Uber Tristram / Pandemonium capability. */
  ubers: Rating;
  /** Solo self-found viability specifically. */
  soloSelfFound: Rating;
  /** How well it scales in 8-player games. */
  players8: Rating;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export interface Build extends Entity {
  classSlug: ClassSlug;
  /** Primary damage type — drives immunity planning. */
  damageTypes: Element[];
  /** The skill the build is named after. */
  primarySkill: Slug;
  playstyle: string;
  strengths: string[];
  weaknesses: string[];
  difficulty: PlayDifficulty;
  budget: BudgetLevel;
  ratings: BuildRatings;

  skills: SkillAllocation[];
  /**
   * Closed, costed alternatives for the points the core does not spend.
   *
   * Where a build has them, they are the plan — `flexPoints` beside them is for
   * what is genuinely not a point-spending decision.
   */
  skillPackages?: SkillPackageGroup[];
  /** What to do with points beyond the core allocation. */
  flexPoints?: string[];
  stats: StatPlan;
  breakpoints: BreakpointTarget[];
  /**
   * Why the table above says what it says — and, on the builds where it is
   * empty, why there is nothing in it.
   *
   * The shapeshifting Druids are the reason this field exists. Werewolf and
   * Werebear use their own frame tables, which is a fact this site already
   * publishes for Faster Cast Rate (`fcr-druid` names both). No wereform hit
   * recovery or attack speed table exists at a source tier this project
   * accepts, so a melee Druid build that printed the human-form numbers would
   * be repeating exactly the mistake the cast-rate table warns against. An
   * empty table with a sentence saying so is information; an empty table on
   * its own is a gap the reader has to guess at.
   */
  breakpointNotes?: string;

  /** Ordered progression, `starter` through `bis`. */
  gearSets: GearSet[];
  /** Slug of the recommended mercenary setup. */
  mercenary?: Slug;
  /** Extra mercenary commentary for this specific build. */
  mercenaryNotes?: string;

  /** Farming area slugs this build is genuinely good at, in priority order. */
  farming: BuildFarmingEntry[];

  /** How immunities are handled — the make-or-break question in Hell. */
  immunityPlan?: string;

  /** Considerations that only matter in hardcore. */
  hardcoreNotes?: string;
  /** Considerations for a fresh, untwinked character. */
  selfFoundNotes?: string;

  /** Leveling route: which build to play before this one comes online. */
  levelingPath?: {
    summary: string;
    respecAt?: string;
    /** Slug of a leveling build, if the site documents one. */
    viaBuild?: Slug;
  };

  modes?: ModeScope;
  /**
   * Runewords whose availability materially gates this build.
   *
   * Not "runewords it uses" — the gear tiers already carry those, and a build
   * that merely prefers an item is not gated by it. This is the shorter list
   * of items without which the build is a different build, and it exists so
   * the page can surface their `Availability` rather than restating it. A
   * restatement is a second copy of a fact that changes on Blizzard's
   * schedule, and the two would drift the first time one was updated.
   */
  gatedBy?: Slug[];
  release?: Release;
  confidence?: Confidence;
  /** Set false while a build page is still a stub. */
  complete?: boolean;
}

export interface BuildFarmingEntry {
  area: Slug;
  difficulty: Difficulty;
  /** Why this area suits this build. */
  why: string;
  /** Minimum gear tier before this is realistic. */
  minTier: ProgressionTier;
  rating: Rating;
}

// ---------------------------------------------------------------------------
// Leveling / progression journey
// ---------------------------------------------------------------------------

export const ACTION_KINDS = [
  "skill",
  "stat",
  "gear",
  "runeword",
  "quest",
  "shop",
  "gamble",
  "mercenary",
  "respec",
  "farm",
  "transition",
  "warning",
  "tip",
] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export interface ProgressionAction {
  kind: ActionKind;
  text: string;
  /** Items mentioned, so the UI can link them automatically. */
  refs?: ItemRef[];
  /** Level this becomes relevant, when narrower than the stage band. */
  atLevel?: number;
  optional?: boolean;
  modes?: ModeScope;
}

/**
 * One chunk of a character's life. Stages are the unit of the leveling
 * walkthrough: coarse enough to read, fine enough to act on.
 *
 * Deliberately not one page per level — 99 pages would be unusable, and the
 * decisions that actually matter cluster at skill-unlock levels (1/6/12/18/
 * 24/30), quest rewards, and difficulty transitions.
 */
export interface ProgressionStage extends Entity {
  classSlug: ClassSlug;
  /** Inclusive character level band. */
  levels: [number, number];
  difficulty: Difficulty;
  /** Where in the game you should be, e.g. "Act 1 — Blood Moor to Tristram". */
  location: string;
  /** The one-line goal of this stage. */
  goal: string;
  /** What your character is actually doing to kill things right now. */
  killingWith: string;
  skillPoints: string[];
  statPoints: string[];
  actions: ProgressionAction[];
  /** Gear worth actively hunting or buying during this stage. */
  gearTargets?: GearPick[];
  /** Concrete "you are ready to move on when…" test. */
  exitCriteria?: string;
  order: number;
}

/** The full class journey: an ordered set of stages plus framing. */
export interface ProgressionJourney {
  classSlug: ClassSlug;
  /** Which build this journey levels into. */
  targetBuild?: Slug;
  summary: string;
  /** Big-picture route description before the reader dives into stages. */
  overview: string[];
  stages: ProgressionStage[];
  /** Respec planning across the whole journey. */
  respecPlan?: { at: string; why: string }[];
  confidence?: Confidence;
}
