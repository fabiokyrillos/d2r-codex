import type { ContentBlock, Slug, StatLine } from "@/lib/types";

/**
 * Localized editorial copy.
 *
 * The split this file encodes:
 *
 * - **Invariant** — slugs, proper nouns (item, rune, skill and area names),
 *   numbers, enums, references and relations. Written once, in the domain's
 *   data file. Also game stat strings such as "+2 to All Skills", which stay in
 *   English in both locales by editorial policy (see ADR 0003).
 * - **Localized** — summaries, explanations, observations, route steps and any
 *   phrase that is prose rather than data. Lives here.
 *
 * en-US copy is colocated with the invariant data, because en-US is the
 * editorial source. Other locales supply an overlay keyed by slug, and
 * `npm run check:content` fails if any slug is missing an overlay entry — that
 * is the "zero missing translation keys" guarantee for content, the same way
 * the `Dictionary` type is the guarantee for UI strings.
 */
export type Overlay<T> = Record<Slug, T>;

// ---------------------------------------------------------------------------

export interface RuneCopy {
  summary: string;
  farmNotes?: string;
}

export interface RunewordCopy {
  summary: string;
  basesDisplay: string;
  basesExclusions?: string[];
  recommendedBases?: string[];
  usedBy?: string;
  commonMistakes?: string[];
  notes?: string;
  /**
   * Present only where a stat line is genuinely editorial rather than a game
   * string — the "Stat lines not yet verified" placeholders on the Reign of
   * the Warlock runewords are the only current case.
   */
  stats?: StatLine[];
}

export interface UniqueItemCopy {
  summary: string;
  notes?: string;
  dropSummary?: string;
}

export interface ClassCopy {
  summary: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  coreMechanics: { title: string; body: string }[];
  bestFor: string;
  classItems?: string[];
  requiresDlc?: string;
}

export interface SkillCopy {
  summary: string;
  mechanics?: string[];
  manaCost?: string;
  synergyBonuses?: string[];
}

export interface SkillTreeCopy {
  name: string;
  summary: string;
  theme: string;
}

export interface FarmingAreaCopy {
  summary: string;
  access: string;
  why: string;
  route?: string[];
  notes?: string;
  poorlySuitedTo?: string;
  bosses?: { name: string; notes?: string }[];
}

export interface MercenaryCopy {
  summary: string;
  hireAdvice: string;
  abilities: { name: string; description: string }[];
  weaponTypes: string[];
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  survivability: string;
  notes?: string[];
  gear: { why: string; label?: string }[];
}

export interface BreakpointTableCopy {
  name: string;
  summary: string;
  variant?: string;
  guidance?: string[];
}

export interface MechanicCopy {
  name: string;
  summary: string;
  keyFacts: string[];
  body: ContentBlock[];
}

// ---------------------------------------------------------------------------
// Builds and journeys
//
// These two are the deepest structures on the site. Rather than mirroring every
// nested array positionally — which would silently misalign the moment a gear
// pick is inserted — their copy is addressed by stable keys.
// ---------------------------------------------------------------------------

export interface GearPickCopy {
  why: string;
  label?: string;
  lookFor?: string[];
  sockets?: string;
}

export interface BuildCopy {
  summary: string;
  playstyle: string;
  strengths: string[];
  weaknesses: string[];
  flexPoints?: string[];
  /**
   * Keyed by group id, then by package id. Skill notes inside a package are
   * keyed by skill slug, exactly as `skillNotes` is for the core.
   *
   * Keys rather than positions, for the same reason gear picks are: a package
   * inserted in the middle would otherwise silently re-label its neighbours.
   */
  skillPackages?: Record<
    string,
    {
      name?: string;
      intro?: string;
      packages: Record<
        string,
        {
          name: string;
          when: string;
          tradeoff: string;
          skillNotes?: Record<string, string>;
          gearNote?: string;
          statNote?: string;
          rotationNote?: string;
          contentNote?: string;
          remainderNote?: string;
        }
      >;
    }
  >;
  statPlan: {
    strength: string;
    dexterity: string;
    vitality: string;
    energy: string;
    notes: string[];
  };
  /** Keyed by `${stat}-${value}`, e.g. "fcr-105". */
  breakpointWhy: Record<string, string>;
  /** Prose under the breakpoint table. Required wherever the build carries it. */
  breakpointNotes?: string;
  /** Keyed by skill slug. */
  skillNotes: Record<string, string>;
  immunityPlan?: string;
  mercenaryNotes?: string;
  /** Keyed by `${area}-${difficulty}`. */
  farmingWhy: Record<string, string>;
  levelingPath?: { summary: string; respecAt?: string };
  selfFoundNotes?: string;
  hardcoreNotes?: string;
  /** Keyed by tier. */
  gearSets: Record<
    string,
    {
      goal: string;
      nextUpgrade?: string;
      notes?: string;
      /** Keyed by `${slot}-${index}`, then nested alternatives by `-alt${n}`. */
      picks: Record<string, GearPickCopy>;
      charms?: GearPickCopy[];
      weaponSwap?: GearPickCopy[];
    }
  >;
}

export interface StageCopy {
  name: string;
  summary: string;
  location: string;
  goal: string;
  killingWith: string;
  skillPoints: string[];
  statPoints: string[];
  /** Positional: actions are a fixed authored list, not user-editable data. */
  actions: string[];
  gearTargets?: GearPickCopy[];
  exitCriteria?: string;
}

export interface JourneyCopy {
  summary: string;
  overview: string[];
  respecPlan?: { at: string; why: string }[];
  /** Keyed by stage slug. */
  stages: Record<Slug, StageCopy>;
}
