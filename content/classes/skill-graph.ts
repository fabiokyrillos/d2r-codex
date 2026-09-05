/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with `npm run gen:skill-graph` (see scripts/generate-skill-graph.ts).
 *
 * The canonical skill graph for every class in scope: which tree a skill
 * belongs to, what character level unlocks it, and which skills the game
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
 *                               maxlvl, EType, HitShift, EMin/EMax + bands,
 *                               and the calc/Param columns that carry synergies
 *               skilldesc.json: SkillPage, SkillRow, SkillColumn
 *
 * SYNERGIES
 *   Extracted, not authored. An edge exists where a skill's calc expression
 *   references another skill's base level and that contribution is scaled by a
 *   parameter the game itself describes as a synergy — for example Blessed
 *   Hammer's `(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8` with
 *   `*Param8 Description` reading "Damage synergy".
 *
 *   Exclusion is per reference, not per skill. Energy Shield reads Telekinesis
 *   under a parameter that sets its mana ratio, and Hydra reads Fire Bolt and
 *   Fire Ball in its summon columns to choose which missile to cast; those
 *   references carry no synergy parameter and produce no edge. Hydra does still
 *   receive a damage synergy from both, declared separately in
 *   `EDmgSymPerCalc` — the exclusion covers the summon columns only.
 *
 *   Three synergies are not on a skill row at all. Fist of the Heavens, Meteor
 *   and Immolation Arrow each deal part of their damage through a sub-missile
 *   that carries its own `EDmgSymPerCalc`, and `missileSynergies` records
 *   those separately — see the field's own comment for why they are not merged
 *   into the list above.
 *
 *   Concentration is not excluded: it never appears as a `skill()` reference
 *   at all. Its boost to Blessed Hammer arrives through the aura state, leaving
 *   only a parameter description behind, so there is no reference for the rule
 *   to weigh.
 *
 *   Two Amazon cases follow the same rule to the same conclusion. Multiple Shot
 *   reads Guided Arrow under a parameter the game calls "Damage % per level"
 *   rather than a synergy, and the Valkyrie reads Dodge, Avoid, Evade and
 *   Critical Strike under no parameter at all -- those columns set the summon's
 *   own skill levels. Neither produces an edge. The Valkyrie's one real synergy
 *   is Decoy, under a parameter the game itself labels "HP % synergy".
 *   Extracted   150 skills (30 paladin, 30 sorceress, 30 amazon, 30 necromancer, 30 druid)
 *
 *   The commit is pinned, not `master`. Re-running the generator reproduces
 *   this file exactly, or fails; it never silently follows the source forward.
 *   Moving to a newer extraction means bumping SOURCE_SHA on purpose and
 *   reading the diff as a game change.
 *
 * AGREEMENT
 *   Prerequisite sets identical across the repository's two extractions —
 *   the current D2R tables and the pre-D2R Lord of Destruction tables under
 *   `json/base/` — for 150 of 150 skills.
 *
 *   These are two snapshots of different game versions from one extraction
 *   project, not two independent publishers. Their agreement shows the values
 *   are not an artifact of a single extraction pass, and that these columns did
 *   not change between LoD and D2R. It is not corroboration by an unrelated
 *   party.
 *
 *   It also does not detect a change made in the engine rather than the table,
 *   and agreement is exactly what such a change looks like from here. Patch 2.4
 *   fixed Plague Javelin's poison duration at three seconds; its `ELen` and
 *   `ELevLen` are byte-identical across both extractions, because nobody edited
 *   them. Reading a high agreement score as "these values are current" is the
 *   mistake this paragraph exists to prevent -- see FIXED_DURATION above for the
 *   override that carries the correction.
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
  readonly classSlug: Extract<ClassSlug, "amazon" | "druid" | "necromancer" | "paladin" | "sorceress">;
  /** The site's tree slug, derived from the game's 1-based skill page. */
  readonly tree: Slug;
  /** 1-based skill page, straight from the game data. Independent of `tree`. */
  readonly page: 1 | 2 | 3;
  /** 1-based row. INVARIANT: TIER_LEVELS[row - 1] === requiredLevel. */
  readonly row: 1 | 2 | 3 | 4 | 5 | 6;
  /** 1-based column, left to right. */
  readonly column: 1 | 2 | 3;
  readonly requiredLevel: number;
  /** Hard-point cap. 20 for every skill extracted so far. */
  readonly maxLevel: number;
  /** Skills needing at least one point before this can be allocated. */
  readonly prerequisites: readonly Slug[];
  /**
   * Skills this one *receives* a synergy bonus from — the only authored
   * direction. `synergyReceivers` in lib/skills.ts derives the reverse.
   *
   * `kinds` is what the bonus improves, as the game's own parameter labels
   * name it: damage, armor, healing, duration, freeze. A skill can receive two
   * kinds from one source, which is why this is a list.
   *
   * `magnitude` is present only where the game keeps the coefficient on the
   * *source* skill's row — written `skill('IronGolem'.par8)` rather than a bare
   * `par8` — so the number is a property of what that skill gives and is the
   * same for everything that reads it. A receiver-owned coefficient governs a
   * sum of several sources at once and belongs to the receiver, so it stays in
   * authored prose; see docs/sources/README.md.
   */
  readonly synergies: readonly {
    readonly from: Slug;
    readonly kinds: readonly string[];
    readonly magnitude?: number;
  }[];
  /**
   * Synergies the game keeps on a *missile* this skill creates rather than on
   * its own row, and which are therefore invisible to `synergies` above.
   *
   * Present on three skills. Fist of the Heavens deals lightning and spawns
   * `fistoftheheavensbolt`, a magic missile carrying
   * `skill('Holy Bolt'.blvl) * 15`; Meteor's ground fire reads Inferno at 3%;
   * Immolation Arrow's reads Fire Arrow at 5%. In each case hard points in the
   * named skill raise part of what the skill does and nothing on the skill row
   * says so.
   *
   * Kept separate rather than merged into `synergies` because the two are not
   * interchangeable to a reader: this bonus applies to one damage component,
   * dealt as `element`, and not to the skill's whole output. A page that prints
   * them together would over-claim.
   */
  readonly missileSynergies?: readonly {
    readonly from: Slug;
    /** The missile row the calc sits on, so a page can name the component. */
    readonly missile: string;
    /** The missile's own element. Not necessarily the skill's. */
    readonly element: string;
    /** Percent per hard point. */
    readonly magnitude: number;
  }[];
  /**
   * Base elemental damage before synergies. Absent for skills that deal none.
   * Final value = (base + banded per-level total) x 2^(hitShift - 8).
   */
  readonly damage?: {
    readonly element: string;
    readonly hitShift: number;
    readonly min: BandedScale;
    readonly max: BandedScale;
    /**
     * Poison only, and load-bearing.
     *
     * Poison's EMin/EMax are damage **per frame**, and the columns are tiny:
     * Poison Javelin's 32 at HitShift 0 is 32/256 of a point per frame. Read as
     * an instant range the way every other element is, it floors to zero and
     * the page publishes "0-0" for a skill that deals thousands.
     *
     * The real number is per-frame damage times the duration, so the duration
     * has to travel with the damage rather than be reconstructed later.
     * `frames` is in D2's 25-per-second frames.
     */
    readonly duration?: {
      readonly base: number;
      /** Zero where a patch fixed the duration; see FIXED_DURATION in the generator. */
      readonly perLevel: number;
    };
    /**
     * True when `duration` is the window the damage is spread across rather
     * than a status length. Poison spreads; cold's ELen is a freeze length and
     * its damage lands at once, so multiplying it would be a fabrication.
     */
    readonly overTime?: boolean;
  };
  /**
   * Physical damage the skill deals in its own right, alongside `damage`
   * rather than instead of it.
   *
   * The Druid's elemental tree is where this earns its keep and why it exists.
   * Tornado and Twister carry nothing but physical -- no `EType`, no `EMin` --
   * so a graph reading only the elemental columns publishes a damage table of
   * nothing for the class's flagship skill. Armageddon carries both at once,
   * 18-26 physical and 25-75 fire, and the two are separately synergised: it
   * takes its physical from Volcano and its fire from Molten Boulder and
   * Firestorm.
   *
   * Scaled by the same `hitShift` as elemental damage, which is not an
   * assumption but a check: Twister's `MinDam` of 12 at `HitShift` 7 is the
   * 6 the game shows, and Tornado's 25 at 8 is 25.
   *
   * Present only for the skills `PUBLISHES_PHYSICAL` names. These columns carry
   * a minion's damage, a bonus to a different skill, and a damage-return share
   * on other rows, and the generator refuses a row it cannot place.
   */
  readonly physical?: {
    readonly hitShift: number;
    readonly min: BandedScale;
    readonly max: BandedScale;
  };
  /**
   * Physical damage the skill turns into an element rather than adding to it.
   *
   * Declared by the missile (`DmgCalc1` of `dl12`), not the skill, which is why
   * it is separate from `damage`: Magic Arrow converts and carries no elemental
   * table at all, while Fire Arrow does both. `base` and `perLevel` are percent.
   */
  readonly conversion?: {
    readonly element: string;
    readonly base: number;
    readonly perLevel: number;
  };
  /**
   * Published quantities other than damage: a chance, a projectile count, an
   * attack-rating bonus. Empty for most skills.
   *
   * `labelKey` names a UI dictionary entry rather than carrying text, so a
   * hundred and twenty skills do not turn into a hundred and twenty
   * hand-translated strings for two dozen distinct words.
   *
   * `range` is a value whose minimum and maximum the game states and whose
   * curve between them it does not — the Amazon's five passives carry no calc
   * column at all, and the Necromancer's diminishing-return columns (`dmNN`)
   * are evaluated in the engine. Anything printed per level for those would be
   * invented.
   *
   * `unit` decides rendering, not meaning. `frames` is shown as seconds;
   * `units` is a bare number in a unit the game does not name, so the label
   * carries it — Corpse Explosion's radius is stated in half squares and halved
   * by the engine, a curse's is stated plainly and used as it stands, and the
   * two must never share a conversion.
   */
  readonly effects?: readonly {
    readonly labelKey: string;
    readonly unit: "percent" | "count" | "frames" | "units" | "mana";
    readonly shape:
      | { readonly kind: "linear"; readonly base: number; readonly perLevel: number; readonly cap?: number }
      | { readonly kind: "step"; readonly base: number; readonly per: number }
      | { readonly kind: "range"; readonly min: number; readonly max: number }
      | { readonly kind: "petmax"; readonly threshold: number; readonly base: number; readonly per: number };
  }[];
}

/** Keyed by skill slug. */
export const SKILL_GRAPH: Record<Slug, SkillGraphNode> = {
  "magic-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [], conversion: { element: "mag", base: 5, perLevel: 2 },
  },
  "fire-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "exploding-arrow", kinds: ["damage"] }], damage: { element: "fire", hitShift: 8, min: { base: 1, bands: [2, 3, 6, 12, 24] }, max: { base: 4, bands: [2, 3, 7, 14, 27] } }, conversion: { element: "fire", base: 3, perLevel: 2 },
  },
  "cold-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "ice-arrow", kinds: ["damage"] }], damage: { element: "cold", hitShift: 7, min: { base: 6, bands: [4, 5, 8, 16, 42] }, max: { base: 8, bands: [4, 5, 9, 17, 44] } }, conversion: { element: "cold", base: 3, perLevel: 2 },
  },
  "multiple-shot": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["magic-arrow"],
    synergies: [],
    effects: [{ labelKey: "effectArrows", unit: "count", shape: { kind: "linear", base: 2, perLevel: 1, cap: 24 } }],
  },
  "exploding-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["fire-arrow", "multiple-shot"],
    synergies: [{ from: "fire-arrow", kinds: ["damage"] }], damage: { element: "fire", hitShift: 8, min: { base: 5, bands: [6, 12, 14, 16, 20] }, max: { base: 13, bands: [7, 13, 15, 18, 23] } },
  },
  "ice-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["cold-arrow"],
    synergies: [{ from: "cold-arrow", kinds: ["damage"] }, { from: "freezing-arrow", kinds: ["freeze"] }], damage: { element: "cold", hitShift: 8, min: { base: 6, bands: [6, 12, 18, 26, 36] }, max: { base: 10, bands: [6, 13, 19, 27, 38] } },
  },
  "guided-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["cold-arrow", "multiple-shot"],
    synergies: [{ from: "multiple-shot", kinds: ["damage"] }],
  },
  "strafe": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["guided-arrow"],
    synergies: [{ from: "guided-arrow", kinds: ["damage"] }, { from: "multiple-shot", kinds: ["damage"] }],
    effects: [{ labelKey: "effectShots", unit: "count", shape: { kind: "linear", base: 4, perLevel: 1, cap: 10 } }],
  },
  "immolation-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["exploding-arrow"],
    synergies: [{ from: "exploding-arrow", kinds: ["damage"] }], missileSynergies: [{ from: "fire-arrow", missile: "immolationfire", element: "fire", magnitude: 5 }], damage: { element: "fire", hitShift: 8, min: { base: 12, bands: [12, 23, 34, 36, 38] }, max: { base: 23, bands: [12, 23, 34, 36, 38] } },
  },
  "freezing-arrow": {
    classSlug: "amazon", tree: "bow-and-crossbow", page: 1, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["ice-arrow"],
    synergies: [{ from: "cold-arrow", kinds: ["damage"] }, { from: "ice-arrow", kinds: ["freeze"] }], damage: { element: "cold", hitShift: 8, min: { base: 40, bands: [10, 15, 20, 22, 24] }, max: { base: 50, bands: [10, 15, 20, 22, 24] } },
  },
  "inner-sight": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "critical-strike": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: 5, max: 80 } }],
  },
  "dodge": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: 10, max: 65 } }],
  },
  "slow-missiles": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["inner-sight"],
    synergies: [],
  },
  "avoid": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 3, column: 2,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["dodge"],
    synergies: [],
    effects: [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: 15, max: 75 } }],
  },
  "penetrate": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 4, column: 3,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["critical-strike"],
    synergies: [],
    effects: [{ labelKey: "effectAttackRating", unit: "percent", shape: { kind: "linear", base: 35, perLevel: 10 } }],
  },
  "decoy": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["slow-missiles"],
    synergies: [],
  },
  "evade": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["avoid"],
    synergies: [],
    effects: [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: 10, max: 65 } }],
  },
  "valkyrie": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["decoy", "evade"],
    synergies: [{ from: "decoy", kinds: ["hp"] }],
  },
  "pierce": {
    classSlug: "amazon", tree: "passive-and-magic", page: 2, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["penetrate"],
    synergies: [],
    effects: [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: 10, max: 100 } }],
  },
  "jab": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "power-strike": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["jab"],
    synergies: [{ from: "charged-strike", kinds: ["damage"] }, { from: "lightning-bolt", kinds: ["damage"] }, { from: "lightning-strike", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 16, bands: [18, 36, 54, 72, 90] } },
  },
  "poison-javelin": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "plague-javelin", kinds: ["damage"] }], damage: { element: "pois", hitShift: 0, min: { base: 32, bands: [16, 32, 48, 64, 96] }, max: { base: 48, bands: [16, 36, 52, 68, 100] }, duration: { base: 200, perLevel: 50 }, overTime: true },
  },
  "impale": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["jab"],
    synergies: [],
  },
  "lightning-bolt": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["poison-javelin"],
    synergies: [{ from: "charged-strike", kinds: ["damage"] }, { from: "lightning-fury", kinds: ["damage"] }, { from: "lightning-strike", kinds: ["damage"] }, { from: "power-strike", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 40, bands: [12, 18, 28, 48, 88] } }, conversion: { element: "ltng", base: 100, perLevel: 0 },
  },
  "charged-strike": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["lightning-bolt", "power-strike"],
    synergies: [{ from: "lightning-bolt", kinds: ["damage"] }, { from: "lightning-strike", kinds: ["damage"] }, { from: "power-strike", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 30, bands: [12, 16, 20, 24, 28] } },
    effects: [{ labelKey: "effectBolts", unit: "count", shape: { kind: "step", base: 3, per: 5 } }],
  },
  "plague-javelin": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 4, column: 3,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["lightning-bolt"],
    synergies: [{ from: "poison-javelin", kinds: ["damage"] }], damage: { element: "pois", hitShift: 3, min: { base: 12, bands: [8, 16, 26, 55, 80] }, max: { base: 18, bands: [8, 16, 26, 55, 80] }, duration: { base: 75, perLevel: 0 }, overTime: true },
  },
  "fend": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["impale"],
    synergies: [],
  },
  "lightning-strike": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["charged-strike"],
    synergies: [{ from: "charged-strike", kinds: ["damage"] }, { from: "lightning-bolt", kinds: ["damage"] }, { from: "power-strike", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 25, bands: [10, 15, 20, 25, 30] } },
    effects: [{ labelKey: "effectJumps", unit: "count", shape: { kind: "linear", base: 2, perLevel: 1 } }],
  },
  "lightning-fury": {
    classSlug: "amazon", tree: "javelin-and-spear", page: 3, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["plague-javelin"],
    synergies: [{ from: "charged-strike", kinds: ["damage"] }, { from: "lightning-bolt", kinds: ["damage"] }, { from: "lightning-strike", kinds: ["damage"] }, { from: "power-strike", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 40, bands: [20, 30, 40, 50, 50] } },
    effects: [{ labelKey: "effectBolts", unit: "count", shape: { kind: "linear", base: 2, perLevel: 1 } }],
  },
  "raven": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "summon-dire-wolf", kinds: ["damage"] }, { from: "summon-grizzly", kinds: ["damage"] }, { from: "summon-spirit-wolf", kinds: ["damage"] }],
    effects: [{ labelKey: "effectMinions", unit: "count", shape: { kind: "linear", base: 1, perLevel: 1, cap: 5 } }, { labelKey: "effectSummonHits", unit: "count", shape: { kind: "linear", base: 12, perLevel: 1 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 6, perLevel: 0 } }],
  },
  "poison-creeper": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "rabies", kinds: ["damage"] }], damage: { element: "pois", hitShift: 1, min: { base: 16, bands: [16, 16, 32, 64, 80] }, max: { base: 24, bands: [16, 18, 36, 68, 84] }, duration: { base: 100, perLevel: 0 }, overTime: true },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 8, perLevel: 0 } }],
  },
  "oak-sage": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectPartyLife", unit: "percent", shape: { kind: "linear", base: 30, perLevel: 5 } }, { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 30, perLevel: 2 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 1 } }],
  },
  "summon-spirit-wolf": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["raven"],
    synergies: [], damage: { element: "cold", hitShift: 8, min: { base: 2, bands: [1, 3, 4, 5, 8] }, max: { base: 6, bands: [1, 3, 4, 5, 8] } },
    effects: [{ labelKey: "effectMinions", unit: "count", shape: { kind: "linear", base: 1, perLevel: 1, cap: 5 } }, { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "linear", base: 5, perLevel: 5, cap: 85 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 0 } }],
  },
  "carrion-vine": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["poison-creeper"],
    synergies: [],
    effects: [{ labelKey: "effectLifeSteal", unit: "percent", shape: { kind: "linear", base: 4, perLevel: 1 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 10, perLevel: 0 } }],
  },
  "heart-of-wolverine": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["oak-sage"],
    synergies: [],
    effects: [{ labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: 20, perLevel: 7 } }, { labelKey: "effectAttackRating", unit: "percent", shape: { kind: "linear", base: 25, perLevel: 7 } }, { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 30, perLevel: 2 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 20, perLevel: 1 } }],
  },
  "summon-dire-wolf": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["oak-sage", "summon-spirit-wolf"],
    synergies: [],
    effects: [{ labelKey: "effectMinions", unit: "count", shape: { kind: "linear", base: 1, perLevel: 1, cap: 3 } }, { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "linear", base: 5, perLevel: 5, cap: 85 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 20, perLevel: 0 } }],
  },
  "solar-creeper": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["carrion-vine"],
    synergies: [],
    effects: [{ labelKey: "effectManaSteal", unit: "percent", shape: { kind: "linear", base: 4, perLevel: 1 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 14, perLevel: 1 } }],
  },
  "spirit-of-barbs": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["heart-of-wolverine"],
    synergies: [],
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 25, perLevel: 1 } }],
  },
  "summon-grizzly": {
    classSlug: "druid", tree: "druid-summoning", page: 1, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["summon-dire-wolf"],
    synergies: [],
    effects: [{ labelKey: "effectMinionDamageBonus", unit: "percent", shape: { kind: "linear", base: 25, perLevel: 10 } }, { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "linear", base: 5, perLevel: 5, cap: 85 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 40, perLevel: 0 } }],
  },
  "werewolf": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectAttackSpeed", unit: "percent", shape: { kind: "range", min: 10, max: 80 } }, { labelKey: "effectLifeBonus", unit: "percent", shape: { kind: "linear", base: 25, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 0 } }],
  },
  "lycanthropy": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: ["werewolf"],
    synergies: [],
    effects: [{ labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 1000, perLevel: 500 } }, { labelKey: "effectLifeBonus", unit: "percent", shape: { kind: "linear", base: 20, perLevel: 5 } }],
  },
  "werebear": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: 55, perLevel: 15 } }, { labelKey: "effectDefenseBonus", unit: "percent", shape: { kind: "linear", base: 40, perLevel: 10 } }, { labelKey: "effectLifeBonus", unit: "percent", shape: { kind: "linear", base: 75, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 0 } }],
  },
  "feral-rage": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["werewolf"],
    synergies: [],
    effects: [{ labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: 50, perLevel: 5 } }, { labelKey: "effectMoveSpeed", unit: "percent", shape: { kind: "range", min: 10, max: 70 } }, { labelKey: "effectCharges", unit: "count", shape: { kind: "step", base: 3, per: 2 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 3, perLevel: 0 } }],
  },
  "maul": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["werebear"],
    synergies: [],
    effects: [{ labelKey: "effectStun", unit: "percent", shape: { kind: "range", min: 10, max: 100 } }, { labelKey: "effectCharges", unit: "count", shape: { kind: "step", base: 3, per: 2 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 3, perLevel: 0 } }],
  },
  "rabies": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["feral-rage"],
    synergies: [{ from: "poison-creeper", kinds: ["damage"] }], damage: { element: "pois", hitShift: 3, min: { base: 6, bands: [4, 5, 7, 11, 16] }, max: { base: 14, bands: [4, 5, 7, 11, 16] }, duration: { base: 100, perLevel: 10 }, overTime: true },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 10, perLevel: 0 } }],
  },
  "fire-claws": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["feral-rage", "maul"],
    synergies: [{ from: "firestorm", kinds: ["damage"] }, { from: "molten-boulder", kinds: ["damage"] }], damage: { element: "fire", hitShift: 8, min: { base: 32, bands: [16, 24, 32, 40, 48] }, max: { base: 48, bands: [17, 25, 33, 41, 49] } },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 4, perLevel: 0 } }],
  },
  "hunger": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["fire-claws"],
    synergies: [],
    effects: [{ labelKey: "effectLifeSteal", unit: "percent", shape: { kind: "range", min: 50, max: 200 } }, { labelKey: "effectManaSteal", unit: "percent", shape: { kind: "range", min: 50, max: 200 } }, { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: -75, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 3, perLevel: 0 } }],
  },
  "shock-wave": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["maul"],
    synergies: [{ from: "maul", kinds: ["damage"] }], physical: { hitShift: 8, min: { base: 10, bands: [3, 5, 7, 7, 7] }, max: { base: 20, bands: [3, 5, 7, 7, 7] } },
    effects: [{ labelKey: "effectStun", unit: "frames", shape: { kind: "linear", base: 40, perLevel: 15 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 7, perLevel: 0 } }],
  },
  "fury": {
    classSlug: "druid", tree: "shape-shifting", page: 2, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["rabies"],
    synergies: [],
    effects: [{ labelKey: "effectHits", unit: "count", shape: { kind: "linear", base: 2, perLevel: 1, cap: 5 } }, { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: 100, perLevel: 17 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 4, perLevel: 0 } }],
  },
  "firestorm": {
    classSlug: "druid", tree: "elemental", page: 3, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "fissure", kinds: ["damage"] }, { from: "molten-boulder", kinds: ["damage"] }], damage: { element: "fire", hitShift: 2, min: { base: 3, bands: [3, 5, 7, 14, 21] }, max: { base: 6, bands: [3, 6, 8, 15, 23] } },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 4, perLevel: 0 } }],
  },
  "molten-boulder": {
    classSlug: "druid", tree: "elemental", page: 3, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["firestorm"],
    synergies: [{ from: "firestorm", kinds: ["fire"] }, { from: "volcano", kinds: ["physical"] }], missileSynergies: [{ from: "firestorm", missile: "moltenboulderfirepath", element: "fire", magnitude: 8 }], damage: { element: "fire", hitShift: 8, min: { base: 6, bands: [4, 7, 10, 13, 16] }, max: { base: 12, bands: [5, 8, 11, 14, 17] } }, physical: { hitShift: 8, min: { base: 6, bands: [4, 7, 10, 13, 16] }, max: { base: 12, bands: [5, 8, 11, 14, 17] } },
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 7, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 10, perLevel: 0.5 } }],
  },
  "arctic-blast": {
    classSlug: "druid", tree: "elemental", page: 3, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "cyclone-armor", kinds: ["damage"] }], damage: { element: "cold", hitShift: 3, min: { base: 32, bands: [20, 26, 28, 32, 36] }, max: { base: 64, bands: [21, 27, 29, 33, 37] } },
  },
  "fissure": {
    classSlug: "druid", tree: "elemental", page: 3, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["molten-boulder"],
    synergies: [{ from: "firestorm", kinds: ["damage"] }, { from: "volcano", kinds: ["damage"] }], damage: { element: "fire", hitShift: 8, min: { base: 15, bands: [6, 12, 16, 18, 22] }, max: { base: 25, bands: [6, 12, 16, 19, 23] } },
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 7, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 0 } }],
  },
  "cyclone-armor": {
    classSlug: "druid", tree: "elemental", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["arctic-blast"],
    synergies: [{ from: "hurricane", kinds: ["absorb"] }, { from: "tornado", kinds: ["absorb"] }, { from: "twister", kinds: ["absorb"] }],
    effects: [{ labelKey: "effectAbsorbed", unit: "units", shape: { kind: "linear", base: 40, perLevel: 12 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 5, perLevel: 1 } }],
  },
  "twister": {
    classSlug: "druid", tree: "elemental", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["cyclone-armor"],
    synergies: [{ from: "arctic-blast", kinds: ["duration"] }, { from: "hurricane", kinds: ["damage"] }, { from: "tornado", kinds: ["damage"] }], physical: { hitShift: 7, min: { base: 12, bands: [7, 11, 15, 18, 21] }, max: { base: 16, bands: [7, 11, 15, 18, 21] } },
    effects: [{ labelKey: "effectMissiles", unit: "count", shape: { kind: "linear", base: 3, perLevel: 0 } }, { labelKey: "effectStun", unit: "frames", shape: { kind: "linear", base: 10, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 7, perLevel: 0 } }],
  },
  "volcano": {
    classSlug: "druid", tree: "elemental", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["fissure"],
    synergies: [{ from: "armageddon", kinds: ["fire"] }, { from: "fissure", kinds: ["fire"] }, { from: "molten-boulder", kinds: ["physical"] }], damage: { element: "fire", hitShift: 8, min: { base: 8, bands: [2, 4, 6, 8, 11] }, max: { base: 10, bands: [2, 4, 6, 8, 13] } }, physical: { hitShift: 8, min: { base: 8, bands: [2, 4, 6, 8, 10] }, max: { base: 10, bands: [2, 4, 6, 8, 10] } },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 25, perLevel: 0 } }],
  },
  "tornado": {
    classSlug: "druid", tree: "elemental", page: 3, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["twister"],
    synergies: [{ from: "cyclone-armor", kinds: ["damage"] }, { from: "hurricane", kinds: ["damage"] }, { from: "twister", kinds: ["damage"] }], physical: { hitShift: 8, min: { base: 25, bands: [8, 14, 20, 24, 28] }, max: { base: 35, bands: [8, 15, 21, 25, 29] } },
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 3, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 10, perLevel: 0 } }],
  },
  "armageddon": {
    classSlug: "druid", tree: "elemental", page: 3, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["volcano"],
    synergies: [{ from: "firestorm", kinds: ["fire"] }, { from: "fissure", kinds: ["duration"] }, { from: "molten-boulder", kinds: ["fire"] }, { from: "volcano", kinds: ["physical"] }], missileSynergies: [{ from: "firestorm", missile: "armageddonfire", element: "fire", magnitude: 7 }, { from: "molten-boulder", missile: "armageddonfire", element: "fire", magnitude: 7 }], damage: { element: "fire", hitShift: 8, min: { base: 25, bands: [15, 20, 25, 31, 38] }, max: { base: 75, bands: [16, 22, 27, 34, 40] } }, physical: { hitShift: 8, min: { base: 18, bands: [10, 12, 15, 18, 22] }, max: { base: 26, bands: [11, 13, 16, 19, 23] } },
    effects: [{ labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 250, perLevel: 0 } }, { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 8, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 35, perLevel: 0 } }],
  },
  "hurricane": {
    classSlug: "druid", tree: "elemental", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["tornado"],
    synergies: [{ from: "cyclone-armor", kinds: ["duration"] }, { from: "tornado", kinds: ["damage"] }, { from: "twister", kinds: ["damage"] }], damage: { element: "cold", hitShift: 8, min: { base: 25, bands: [7, 10, 12, 14, 16] }, max: { base: 50, bands: [7, 10, 12, 14, 16] } },
    effects: [{ labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 250, perLevel: 0 } }, { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 9, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 30, perLevel: 0 } }],
  },
  "amplify-damage": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 3, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 200, perLevel: 75 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 4, perLevel: 0 } }],
  },
  "dim-vision": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 4, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 175, perLevel: 50 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 9, perLevel: 0 } }],
  },
  "weaken": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["amplify-damage"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 9, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 350, perLevel: 60 } }, { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: -33, perLevel: -1 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 4, perLevel: 0 } }],
  },
  "iron-maiden": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 3, column: 2,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["amplify-damage"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 7, perLevel: 0 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 300, perLevel: 60 } }, { labelKey: "effectDamageReturned", unit: "percent", shape: { kind: "linear", base: 200, perLevel: 25 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 5, perLevel: 0 } }],
  },
  "terror": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["weaken"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 4, perLevel: 0 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 200, perLevel: 25 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 7, perLevel: 0 } }],
  },
  "confuse": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["dim-vision"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 6, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 250, perLevel: 50 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 13, perLevel: 0 } }],
  },
  "life-tap": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["iron-maiden"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 4, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 400, perLevel: 60 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 9, perLevel: 0 } }],
  },
  "attract": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["confuse"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 9, perLevel: 0 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 300, perLevel: 90 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 17, perLevel: 0 } }],
  },
  "decrepify": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["terror"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 6, perLevel: 0 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 100, perLevel: 15 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 11, perLevel: 0 } }],
  },
  "lower-resist": {
    classSlug: "necromancer", tree: "curses", page: 1, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["decrepify", "life-tap"],
    synergies: [],
    effects: [{ labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: 7, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 500, perLevel: 50 } }, { labelKey: "effectResistReduction", unit: "percent", shape: { kind: "range", min: 25, max: 70 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 22, perLevel: 0 } }],
  },
  "teeth": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "bone-prison", kinds: ["damage"] }, { from: "bone-spear", kinds: ["damage"] }, { from: "bone-spirit", kinds: ["damage"] }, { from: "bone-wall", kinds: ["damage"] }], damage: { element: "mag", hitShift: 7, min: { base: 4, bands: [2, 2, 3, 4, 5] }, max: { base: 8, bands: [2, 3, 4, 5, 6] } },
    effects: [{ labelKey: "effectMissiles", unit: "count", shape: { kind: "linear", base: 2, perLevel: 1, cap: 24 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 3, perLevel: 0.5 } }],
  },
  "bone-armor": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "bone-prison", kinds: ["absorb"] }, { from: "bone-wall", kinds: ["absorb"] }],
    effects: [{ labelKey: "effectAbsorbed", unit: "units", shape: { kind: "linear", base: 20, perLevel: 15 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 11, perLevel: 1 } }],
  },
  "poison-dagger": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "poison-explosion", kinds: ["damage"] }, { from: "poison-nova", kinds: ["damage"] }], damage: { element: "pois", hitShift: 1, min: { base: 18, bands: [10, 15, 20, 23, 26] }, max: { base: 40, bands: [10, 15, 20, 23, 26] }, duration: { base: 50, perLevel: 10 }, overTime: true },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 3, perLevel: 0.25 } }],
  },
  "corpse-explosion": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["teeth"],
    synergies: [],
    effects: [{ labelKey: "effectRadiusHalfSquares", unit: "units", shape: { kind: "linear", base: 8, perLevel: 1 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 1 } }],
  },
  "bone-wall": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["bone-armor"],
    synergies: [{ from: "bone-armor", kinds: ["hp"] }, { from: "bone-prison", kinds: ["hp"] }],
    effects: [{ labelKey: "effectWallLife", unit: "percent", shape: { kind: "linear", base: 0, perLevel: 25 } }, { labelKey: "effectWallSegments", unit: "count", shape: { kind: "linear", base: 8, perLevel: 0 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 600, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 17, perLevel: 0 } }],
  },
  "poison-explosion": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["corpse-explosion", "poison-dagger"],
    synergies: [{ from: "poison-dagger", kinds: ["damage"] }, { from: "poison-nova", kinds: ["damage"] }], damage: { element: "pois", hitShift: 4, min: { base: 8, bands: [2, 4, 6, 8, 10] }, max: { base: 24, bands: [2, 4, 6, 8, 10] }, duration: { base: 50, perLevel: 10 }, overTime: true },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 8, perLevel: 0 } }],
  },
  "bone-spear": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["corpse-explosion"],
    synergies: [{ from: "bone-prison", kinds: ["damage"] }, { from: "bone-spirit", kinds: ["damage"] }, { from: "bone-wall", kinds: ["damage"] }, { from: "teeth", kinds: ["damage"] }], damage: { element: "mag", hitShift: 8, min: { base: 16, bands: [8, 9, 12, 18, 24] }, max: { base: 24, bands: [8, 9, 13, 19, 25] } },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 7, perLevel: 0.25 } }],
  },
  "bone-prison": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["bone-spear", "bone-wall"],
    synergies: [{ from: "bone-armor", kinds: ["hp"] }, { from: "bone-wall", kinds: ["hp"] }],
    effects: [{ labelKey: "effectWallLife", unit: "percent", shape: { kind: "linear", base: 0, perLevel: 25 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 600, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 27, perLevel: -1 } }],
  },
  "poison-nova": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["poison-explosion"],
    synergies: [{ from: "poison-dagger", kinds: ["damage"] }, { from: "poison-explosion", kinds: ["damage"] }], damage: { element: "pois", hitShift: 4, min: { base: 16, bands: [4, 6, 9, 14, 16] }, max: { base: 29, bands: [4, 6, 9, 14, 16] }, duration: { base: 50, perLevel: 0 }, overTime: true },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 20, perLevel: 0 } }],
  },
  "bone-spirit": {
    classSlug: "necromancer", tree: "poison-and-bone", page: 2, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["bone-spear"],
    synergies: [{ from: "bone-prison", kinds: ["damage"] }, { from: "bone-spear", kinds: ["damage"] }, { from: "bone-wall", kinds: ["damage"] }, { from: "teeth", kinds: ["damage"] }], damage: { element: "mag", hitShift: 8, min: { base: 20, bands: [16, 17, 18, 19, 20] }, max: { base: 30, bands: [17, 18, 19, 20, 21] } },
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 12, perLevel: 0.5 } }],
  },
  "skeleton-mastery": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: ["raise-skeleton"],
    synergies: [],
    effects: [{ labelKey: "effectMinionLife", unit: "units", shape: { kind: "linear", base: 8, perLevel: 8 } }, { labelKey: "effectMinionDamage", unit: "units", shape: { kind: "linear", base: 2, perLevel: 2 } }],
  },
  "raise-skeleton": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
    effects: [{ labelKey: "effectMinions", unit: "count", shape: { kind: "petmax", threshold: 4, base: 2, per: 3 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 6, perLevel: 1 } }],
  },
  "clay-golem": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "blood-golem", kinds: ["hp"], magnitude: 5 }, { from: "fire-golem", kinds: ["damage"], magnitude: 6 }, { from: "iron-golem", kinds: ["armor"], magnitude: 35 }],
    effects: [{ labelKey: "effectSlow", unit: "percent", shape: { kind: "range", min: 0, max: 75 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 15, perLevel: 3 } }],
  },
  "golem-mastery": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["clay-golem"],
    synergies: [],
    effects: [{ labelKey: "effectGolemLife", unit: "percent", shape: { kind: "linear", base: 20, perLevel: 20 } }, { labelKey: "effectGolemAttackRating", unit: "units", shape: { kind: "linear", base: 25, perLevel: 25 } }, { labelKey: "effectGolemSpeed", unit: "percent", shape: { kind: "range", min: 0, max: 40 } }],
  },
  "raise-skeletal-mage": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["raise-skeleton"],
    synergies: [],
    effects: [{ labelKey: "effectMinions", unit: "count", shape: { kind: "petmax", threshold: 4, base: 2, per: 3 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 8, perLevel: 1 } }],
  },
  "blood-golem": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["clay-golem"],
    synergies: [{ from: "clay-golem", kinds: ["attack-rating"], magnitude: 20 }, { from: "fire-golem", kinds: ["damage"], magnitude: 6 }, { from: "iron-golem", kinds: ["armor"], magnitude: 35 }],
    effects: [{ labelKey: "effectLifeSteal", unit: "percent", shape: { kind: "range", min: 75, max: 150 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 25, perLevel: 3 } }],
  },
  "summon-resist": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["golem-mastery"],
    synergies: [],
    effects: [{ labelKey: "effectMinionResist", unit: "percent", shape: { kind: "range", min: 20, max: 75 } }],
  },
  "iron-golem": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["blood-golem"],
    synergies: [{ from: "blood-golem", kinds: ["hp"], magnitude: 5 }, { from: "clay-golem", kinds: ["attack-rating"], magnitude: 20 }, { from: "fire-golem", kinds: ["damage"], magnitude: 6 }],
    effects: [{ labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 35, perLevel: 0 } }],
  },
  "fire-golem": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["iron-golem"],
    synergies: [{ from: "blood-golem", kinds: ["hp"], magnitude: 5 }, { from: "clay-golem", kinds: ["attack-rating"], magnitude: 20 }, { from: "iron-golem", kinds: ["armor"], magnitude: 35 }], damage: { element: "fire", hitShift: 8, min: { base: 10, bands: [9, 10, 11, 12, 13] }, max: { base: 27, bands: [10, 11, 12, 13, 14] } },
    effects: [{ labelKey: "effectFireAbsorb", unit: "percent", shape: { kind: "range", min: 25, max: 100 } }, { labelKey: "effectAuraLevel", unit: "count", shape: { kind: "linear", base: 7, perLevel: 1, cap: 30 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 50, perLevel: 8 } }],
  },
  "revive": {
    classSlug: "necromancer", tree: "summoning", page: 3, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["iron-golem", "raise-skeletal-mage"],
    synergies: [],
    effects: [{ labelKey: "effectMinions", unit: "count", shape: { kind: "linear", base: 1, perLevel: 1 } }, { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: 4500, perLevel: 0 } }, { labelKey: "effectMana", unit: "mana", shape: { kind: "linear", base: 45, perLevel: 0 } }],
  },
  "sacrifice": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "fanaticism", kinds: ["damage"] }, { from: "redemption", kinds: ["damage"] }],
  },
  "smite": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "holy-bolt": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "fist-of-the-heavens", kinds: ["damage"] }, { from: "prayer", kinds: ["healing"] }], damage: { element: "mag", hitShift: 8, min: { base: 8, bands: [8, 10, 13, 16, 20] }, max: { base: 16, bands: [8, 11, 15, 18, 23] } },
  },
  "zeal": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["sacrifice"],
    synergies: [{ from: "sacrifice", kinds: ["damage"] }],
  },
  "charge": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["smite"],
    synergies: [{ from: "might", kinds: ["damage"] }, { from: "vigor", kinds: ["damage"] }],
  },
  "vengeance": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["zeal"],
    synergies: [{ from: "resist-cold", kinds: ["damage"] }, { from: "resist-fire", kinds: ["damage"] }, { from: "resist-lightning", kinds: ["damage"] }, { from: "salvation", kinds: ["damage"] }],
  },
  "blessed-hammer": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["holy-bolt"],
    synergies: [{ from: "blessed-aim", kinds: ["damage"] }, { from: "vigor", kinds: ["damage"] }], damage: { element: "mag", hitShift: 8, min: { base: 12, bands: [8, 10, 12, 13, 14] }, max: { base: 16, bands: [8, 10, 12, 13, 14] } },
  },
  "conversion": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["vengeance"],
    synergies: [],
  },
  "holy-shield": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["blessed-hammer", "charge"],
    synergies: [{ from: "defiance", kinds: ["armor"] }],
  },
  "fist-of-the-heavens": {
    classSlug: "paladin", tree: "combat-skills", page: 1, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["blessed-hammer", "conversion"],
    synergies: [{ from: "holy-shock", kinds: ["damage"] }], missileSynergies: [{ from: "holy-bolt", missile: "fistoftheheavensbolt", element: "mag", magnitude: 15 }], damage: { element: "ltng", hitShift: 8, min: { base: 150, bands: [15, 30, 45, 55, 65] }, max: { base: 200, bands: [15, 30, 45, 55, 65] } },
  },
  "might": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "holy-fire": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["might"],
    synergies: [{ from: "resist-fire", kinds: ["damage"] }, { from: "salvation", kinds: ["damage"] }], damage: { element: "fire", hitShift: 7, min: { base: 2, bands: [1, 4, 6, 7, 8] }, max: { base: 6, bands: [2, 5, 7, 8, 9] } },
  },
  "thorns": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "blessed-aim": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["might"],
    synergies: [],
  },
  "concentration": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["blessed-aim"],
    synergies: [],
  },
  "holy-freeze": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["holy-fire"],
    synergies: [{ from: "resist-cold", kinds: ["damage"] }, { from: "salvation", kinds: ["damage"] }], damage: { element: "cold", hitShift: 8, min: { base: 2, bands: [1, 2, 3, 4, 5] }, max: { base: 3, bands: [1, 2, 3, 4, 5] } },
  },
  "holy-shock": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["holy-freeze"],
    synergies: [{ from: "resist-lightning", kinds: ["damage"] }, { from: "salvation", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 10, bands: [6, 8, 10, 12, 15] } },
  },
  "sanctuary": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["holy-freeze", "thorns"],
    synergies: [{ from: "cleansing", kinds: ["damage"] }], damage: { element: "mag", hitShift: 8, min: { base: 8, bands: [4, 4, 5, 5, 6] }, max: { base: 16, bands: [4, 5, 6, 6, 7] } },
  },
  "fanaticism": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["concentration"],
    synergies: [],
  },
  "conviction": {
    classSlug: "paladin", tree: "offensive-auras", page: 2, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["sanctuary"],
    synergies: [],
  },
  "prayer": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 1, column: 1,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "resist-fire": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "defiance": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "resist-cold": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "cleansing": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["prayer"],
    synergies: [],
  },
  "resist-lightning": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "vigor": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["cleansing", "defiance"],
    synergies: [],
  },
  "meditation": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["cleansing"],
    synergies: [],
  },
  "redemption": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["vigor"],
    synergies: [],
  },
  "salvation": {
    classSlug: "paladin", tree: "defensive-auras", page: 3, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "fire-bolt": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "fire-ball", kinds: ["damage"] }, { from: "meteor", kinds: ["damage"] }], damage: { element: "fire", hitShift: 7, min: { base: 6, bands: [3, 4, 8, 18, 54] }, max: { base: 12, bands: [3, 6, 10, 20, 56] } },
  },
  "warmth": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "inferno": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "warmth", kinds: ["damage"] }], damage: { element: "fire", hitShift: 3, min: { base: 36, bands: [24, 30, 34, 38, 42] }, max: { base: 72, bands: [25, 31, 35, 39, 43] } },
  },
  "blaze": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["inferno"],
    synergies: [{ from: "warmth", kinds: ["damage"] }], damage: { element: "fire", hitShift: 4, min: { base: 4, bands: [3, 5, 7, 9, 11] }, max: { base: 8, bands: [3, 6, 8, 10, 12] } },
  },
  "fire-ball": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 3, column: 2,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["fire-bolt"],
    synergies: [{ from: "fire-bolt", kinds: ["damage"] }, { from: "meteor", kinds: ["damage"] }], damage: { element: "fire", hitShift: 7, min: { base: 12, bands: [13, 23, 28, 33, 38] }, max: { base: 28, bands: [15, 25, 30, 35, 40] } },
  },
  "fire-wall": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 4, column: 1,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["blaze"],
    synergies: [{ from: "inferno", kinds: ["damage"] }, { from: "warmth", kinds: ["damage"] }], damage: { element: "fire", hitShift: 4, min: { base: 15, bands: [9, 14, 21, 21, 21] }, max: { base: 20, bands: [9, 14, 21, 21, 21] } },
  },
  "enchant": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 4, column: 3,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["fire-ball", "warmth"],
    synergies: [{ from: "warmth", kinds: ["damage"] }], damage: { element: "fire", hitShift: 7, min: { base: 16, bands: [3, 7, 11, 15, 19] }, max: { base: 20, bands: [5, 9, 13, 17, 21] } },
  },
  "meteor": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 5, column: 2,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["fire-ball", "fire-wall"],
    synergies: [{ from: "fire-ball", kinds: ["damage"] }, { from: "fire-bolt", kinds: ["damage"] }], missileSynergies: [{ from: "inferno", missile: "meteorfire", element: "fire", magnitude: 3 }], damage: { element: "fire", hitShift: 8, min: { base: 80, bands: [23, 39, 79, 81, 83] }, max: { base: 100, bands: [25, 41, 81, 83, 85] } },
  },
  "fire-mastery": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "hydra": {
    classSlug: "sorceress", tree: "fire-spells", page: 1, row: 6, column: 3,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["enchant"],
    synergies: [{ from: "fire-ball", kinds: ["damage"] }, { from: "fire-bolt", kinds: ["damage"] }], damage: { element: "fire", hitShift: 7, min: { base: 28, bands: [11, 15, 19, 23, 27] }, max: { base: 39, bands: [13, 17, 21, 25, 29] } },
  },
  "charged-bolt": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "lightning", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 7, min: { base: 4, bands: [1, 1, 2, 3, 4] }, max: { base: 8, bands: [1, 1, 2, 3, 4] } },
  },
  "static-field": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "telekinesis": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 2, column: 3,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [1, 1, 1, 1, 1] }, max: { base: 2, bands: [1, 1, 1, 1, 1] } },
  },
  "nova": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 3, column: 1,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["static-field"],
    synergies: [{ from: "static-field", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [6, 7, 8, 9, 10] }, max: { base: 20, bands: [8, 9, 10, 11, 12] } },
  },
  "lightning": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 3, column: 2,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["charged-bolt"],
    synergies: [{ from: "chain-lightning", kinds: ["damage"] }, { from: "charged-bolt", kinds: ["damage"] }, { from: "nova", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 40, bands: [8, 12, 20, 28, 36] } },
  },
  "chain-lightning": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["lightning"],
    synergies: [{ from: "charged-bolt", kinds: ["damage"] }, { from: "lightning", kinds: ["damage"] }, { from: "nova", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [0, 0, 0, 0, 0] }, max: { base: 40, bands: [11, 13, 15, 15, 15] } },
  },
  "teleport": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 4, column: 3,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["telekinesis"],
    synergies: [],
  },
  "thunder-storm": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["chain-lightning", "nova"],
    synergies: [{ from: "static-field", kinds: ["damage"] }], damage: { element: "ltng", hitShift: 8, min: { base: 1, bands: [10, 10, 11, 11, 11] }, max: { base: 100, bands: [10, 10, 11, 11, 11] } },
  },
  "energy-shield": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["chain-lightning", "teleport"],
    synergies: [],
  },
  "lightning-mastery": {
    classSlug: "sorceress", tree: "lightning-spells", page: 2, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
  "ice-bolt": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 1, column: 2,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "blizzard", kinds: ["damage"] }, { from: "frost-nova", kinds: ["damage"] }, { from: "frozen-orb", kinds: ["damage"] }, { from: "glacial-spike", kinds: ["damage"] }, { from: "ice-blast", kinds: ["damage"] }], damage: { element: "cold", hitShift: 7, min: { base: 6, bands: [2, 4, 6, 8, 10] }, max: { base: 10, bands: [3, 5, 7, 9, 11] } },
  },
  "frozen-armor": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 1, column: 3,
    requiredLevel: 1, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "chilling-armor", kinds: ["duration", "freeze"] }, { from: "shiver-armor", kinds: ["duration", "freeze"] }],
  },
  "frost-nova": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 2, column: 1,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: [],
    synergies: [{ from: "blizzard", kinds: ["damage"] }, { from: "frozen-orb", kinds: ["damage"] }], damage: { element: "cold", hitShift: 7, min: { base: 4, bands: [6, 8, 10, 12, 14] }, max: { base: 8, bands: [7, 9, 11, 13, 15] } },
  },
  "ice-blast": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 2, column: 2,
    requiredLevel: 6, maxLevel: 20,
    prerequisites: ["ice-bolt"],
    synergies: [{ from: "blizzard", kinds: ["damage"] }, { from: "frozen-orb", kinds: ["damage"] }, { from: "glacial-spike", kinds: ["freeze"] }, { from: "ice-bolt", kinds: ["damage"] }], damage: { element: "cold", hitShift: 7, min: { base: 16, bands: [14, 28, 42, 56, 70] }, max: { base: 24, bands: [15, 29, 43, 57, 71] } },
  },
  "shiver-armor": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 3, column: 3,
    requiredLevel: 12, maxLevel: 20,
    prerequisites: ["frozen-armor", "ice-blast"],
    synergies: [{ from: "chilling-armor", kinds: ["damage", "duration"] }, { from: "frozen-armor", kinds: ["damage", "duration"] }], damage: { element: "cold", hitShift: 7, min: { base: 12, bands: [6, 8, 10, 12, 14] }, max: { base: 16, bands: [7, 9, 11, 13, 15] } },
  },
  "glacial-spike": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 4, column: 2,
    requiredLevel: 18, maxLevel: 20,
    prerequisites: ["ice-blast"],
    synergies: [{ from: "blizzard", kinds: ["freeze"] }, { from: "frozen-orb", kinds: ["damage"] }, { from: "ice-blast", kinds: ["damage"] }, { from: "ice-bolt", kinds: ["damage"] }], damage: { element: "cold", hitShift: 7, min: { base: 32, bands: [14, 26, 28, 30, 32] }, max: { base: 48, bands: [15, 27, 29, 31, 33] } },
    effects: [{ labelKey: "effectFreezeLength", unit: "frames", shape: { kind: "linear", base: 50, perLevel: 3 } }],
  },
  "blizzard": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 5, column: 1,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["frost-nova", "glacial-spike"],
    synergies: [{ from: "glacial-spike", kinds: ["damage"] }, { from: "ice-blast", kinds: ["damage"] }, { from: "ice-bolt", kinds: ["damage"] }], damage: { element: "cold", hitShift: 8, min: { base: 45, bands: [15, 30, 45, 55, 65] }, max: { base: 75, bands: [16, 31, 46, 56, 66] } },
  },
  "chilling-armor": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 5, column: 3,
    requiredLevel: 24, maxLevel: 20,
    prerequisites: ["shiver-armor"],
    synergies: [{ from: "frozen-armor", kinds: ["damage", "duration"] }, { from: "shiver-armor", kinds: ["damage", "duration"] }], damage: { element: "cold", hitShift: 7, min: { base: 16, bands: [8, 10, 12, 14, 16] }, max: { base: 20, bands: [9, 11, 13, 15, 17] } },
  },
  "frozen-orb": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 6, column: 1,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: ["blizzard"],
    synergies: [{ from: "ice-bolt", kinds: ["damage"] }], damage: { element: "cold", hitShift: 7, min: { base: 80, bands: [20, 24, 28, 29, 30] }, max: { base: 90, bands: [21, 25, 29, 30, 31] } },
  },
  "cold-mastery": {
    classSlug: "sorceress", tree: "cold-spells", page: 3, row: 6, column: 2,
    requiredLevel: 30, maxLevel: 20,
    prerequisites: [],
    synergies: [],
  },
};

/** Character level thresholds, indexed by tree row. */
export const TIER_LEVELS = [1, 6, 12, 18, 24, 30] as const;

/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */
export const MAX_HARD_POINTS = 110;
