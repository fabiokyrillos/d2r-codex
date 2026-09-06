/**
 * Regenerates `content/classes/skill-graph.ts` from the game's own tables.
 *
 * Run with `npm run gen:skill-graph`. Requires network access; it is a manual
 * tool, not part of the build.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site's skill prerequisites were authored by hand and 29 of 60 were
 * wrong — see `docs/spec/0001-skills-experience.md` §0. Hand-authoring a graph
 * that the reader can *see drawn* is how that happened: a plausible-looking
 * edge is indistinguishable from a correct one until something checks it.
 *
 * So the graph is no longer authored. It is extracted, and the validator
 * checks both the authored content and every build's skill plan against this
 * file rather than against the authored table that produced the error.
 *
 * WHAT IS EXTRACTED
 * -----------------
 * Only mechanical facts, which are not copyrightable:
 *
 *   from skills.json      charclass, reqlevel, reqskill1, reqskill2, maxlvl,
 *                         EType, HitShift, EMin/EMax and their five level bands,
 *                         ELen/ELevLen (poison only), and the Param columns the
 *                         EFFECTS table names
 *   from skilldesc.json   SkillPage, SkillRow, SkillColumn
 *
 * Deliberately NOT extracted: `str name`, `str long`, `str short` (Blizzard's
 * descriptive prose) and `IconCel` (an index into Blizzard's sprite sheets).
 * No game text and no game artwork enters this repository. Skill names are
 * used only as identifiers to derive slugs, which the site already publishes.
 *
 * NORMALIZATION
 * -------------
 * 1. Filter to the `charclass` codes in `classOf`.
 * 2. Slugify the skill's identifier: lowercase, non-alphanumerics to `-`.
 *    "Fist of the Heavens" -> "fist-of-the-heavens".
 * 3. Prerequisites are `reqskill1` and `reqskill2`, slugified, empties
 *    dropped, sorted for stable output.
 * 4. `SkillPage` is joined from skilldesc.json on the `skilldesc` key.
 * 5. Tree slugs are derived by membership: every skill the site already
 *    assigns to a tree must agree on which game page that tree is. The script
 *    fails if a page maps to more than one authored tree.
 *
 * AGREEMENT CHECK
 * ---------------
 * The repository ships two independent extractions: the current D2R tables and
 * the pre-D2R Lord of Destruction tables under `json/base/`. This script
 * compares the prerequisite sets of every extracted skill across both and records the
 * result in the generated header. "Independent" here means separately
 * extracted snapshots of two different game versions — agreement across them
 * shows the values are not an artifact of one extraction pass, and that the
 * prerequisite graph did not change between LoD and D2R. It is not two
 * independent *publishers*, and the header says so.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { allSkills } from "../content/classes";
import {
  capFromMinCalc,
  manaFromRow,
  missileSynergiesFor,
  petMaxFromColumn,
  slugFor,
  synergiesFor,
  type MissileRow,
  type SkillRow,
} from "./skill-graph-rules";

const SOURCE_REPO = "blizzhackers/d2data";

/**
 * The classes in scope, keyed by the game's `charclass` code.
 *
 * This is the single gate on the whole skills experience. `lib/skills.ts`
 * derives CLASSES_WITH_SKILL_PAGES from whichever classes appear in the graph,
 * so adding a code here and regenerating lights up the individual skill pages,
 * the tree on the class page, the tree on every build page, the sitemap entries
 * and the search index at once -- there is no second list to keep in step.
 */
const classOf = { pal: "paladin", sor: "sorceress", ama: "amazon", nec: "necromancer", dru: "druid", ass: "assassin", bar: "barbarian", war: "warlock" } as const;

/**
 * The exact commit the shipped graph was extracted from.
 *
 * Pinned, not `master`. A moving ref means the generator is not a function of
 * anything recorded here: re-running it a month later can rewrite the graph
 * from a source nobody chose, and the provenance header would keep claiming a
 * baseline that no longer produced it. With a SHA, `npm run gen:skill-graph`
 * either reproduces the committed file byte for byte or fails loudly.
 *
 * Updating this is a deliberate act. Bump the SHA, re-run the generator, and
 * read the diff — a changed prerequisite or unlock level is a game change and
 * belongs in its own commit with the patch notes that justify it. Never bump it
 * to "latest" as a side effect of touching this file.
 */
const SOURCE_SHA = "fc469993502d0498809b9fc1af140ee2a9eb8902";
const SOURCE_DATE = "2026-08-21";
const SOURCE_MESSAGE = "Updated for patch 3.3.93847";
/** Verified against the pinned commit on 2026-08-31. */
const VERIFIED = "2026-08-31";
const BASELINE = "D2R Patch 3.3 / Ladder Season 15 extraction";

const RAW = `https://raw.githubusercontent.com/${SOURCE_REPO}/${SOURCE_SHA}/json`;

const PATHS = {
  current: "skills.json",
  base: "base/skills.json",
  descs: "skilldesc.json",
  missiles: "missiles.json",
} as const;

interface RawSkill {
  /*
   * Open on purpose. The calc columns this script reads are named by the data
   * rather than by us -- `passivecalc4`, `sumsk1calc`, `*Param8 Description` --
   * and enumerating them here would be a second list to keep in step with the
   * extraction. The columns that decide anything structural are typed below; the
   * rest are read by name and checked where they are read.
   */
  [column: string]: unknown;
  skill: string;
  charclass?: string;
  skilldesc?: string | number;
  reqlevel: number;
  reqskill1?: string;
  reqskill2?: string;
  maxlvl?: number;
  EType?: string;
  HitShift?: number;
  EMin?: number; EMinLev1?: number; EMinLev2?: number; EMinLev3?: number; EMinLev4?: number; EMinLev5?: number;
  EMax?: number; EMaxLev1?: number; EMaxLev2?: number; EMaxLev3?: number; EMaxLev4?: number; EMaxLev5?: number;
  ELen?: number; ELevLen1?: number; ELevLen2?: number; ELevLen3?: number;
}
interface RawDesc {
  skilldesc: string | number;
  SkillPage?: number;
  SkillRow?: number;
  SkillColumn?: number;
}

/**
 * A missile row, read only for the damage-conversion columns.
 *
 * `DmgCalc1` of `dl12` is the game's "% Damage Dealt as Elemental": the missile
 * carries the weapon's damage and turns a share of it into `EType` rather than
 * adding a separate amount. Four missiles in the entire game use it, all
 * Amazon -- magicarrow, firearrow, coldarrow and lightningjavelin.
 */
interface RawMissile {
  Missile: string;
  DmgCalc1?: string;
  dParam1?: number;
  dParam2?: number;
  EType?: string;
  /**
   * The game's own name for a synergy calc, and on a missile it is the whole
   * declaration: the coefficient is a literal rather than a `parN`, so there is
   * no parameter description for `synergiesFor`'s rule to weigh. Read by
   * `missileSynergiesFor`; see the comment on that function for the three
   * skills in scope whose synergy lives here rather than on the skill row.
   */
  EDmgSymPerCalc?: string;
  ELenSymPerCalc?: string;
}

/**
 * Skills whose elemental duration does not grow with level, whatever `ELevLen`
 * still says.
 *
 * Diablo II: Resurrected patch 2.4 fixed Plague Javelin's poison duration at
 * three seconds. The column that used to lengthen it was not edited: `ELen` is
 * 75 frames and `ELevLen` is 5 in the pinned 3.3 extraction, byte-identical to
 * the pre-D2R Lord of Destruction tables in the same repository. The change
 * lives in code, so a generator that trusts the column publishes a duration the
 * game stopped using -- which is exactly what this one did, reporting 6.8
 * seconds at level 20 against a real 3.0.
 *
 * That is also the limit of the AGREEMENT check in the generated header:
 * agreement between the two extractions shows the tables match each other, and
 * says nothing about behaviour changed in the engine.
 *
 * Deliberately a set of one. Poison Javelin has no such note and keeps its
 * scaling duration; adding an entry here means finding the patch that justifies
 * it, not noticing that a number looks large.
 */
const FIXED_DURATION = new Set<string>(["Plague Javelin"]);

/**
 * The quantities a skill's page publishes, and where in the row they live.
 *
 * The numbers are extracted. The *mapping* is authored, and it has to be: the
 * game's own parameter descriptions are Blizzard's prose and are deliberately
 * never shipped (see LICENSING), and nothing in the table says which of eight
 * parameters a reader actually wants. So the label is ours, the parameter
 * indices are stated once here, and the values come from the row.
 *
 * Four shapes, because the game has four:
 *
 *   linear   base + perLevel x (level - 1), optionally capped
 *   step     base + floor(level / per)
 *   range    a value that starts at `min` and climbs toward `max`
 *   petmax   level below `threshold`, then base + floor(level / per)
 *
 * `range` covers two different things the game writes the same way: the Amazon's
 * passive chances and the Necromancer's diminishing-return values -- Clay
 * Golem's slow, Summon Resist's resistance, the Blood Golem's life steal, the
 * Fire Golem's fire absorb and Lower Resist's reduction. Every one of them is a
 * `dmNN` column, which the game evaluates on a curve that is in the engine and
 * in no column read here. Two numbers and a sentence is what the data supports.
 *
 * `range` is the honest shape for the Amazon's passives, and the reason this
 * table does not simply interpolate. Critical Strike, Dodge, Avoid, Evade and
 * Pierce carry a minimum and a maximum and **no calc expression at all** -- the
 * curve between them lives in the engine, not in any column extracted here.
 * Publishing a per-level table for them would mean inventing the curve. The
 * page prints what the data supports, which is the level-1 value and the
 * ceiling, and says the rest is not in the extraction.
 */
interface EffectSpec {
  readonly labelKey: string;
  /*
   * `frames` is rendered as seconds -- the column is in D2's 25-per-second
   * frames and a reader wants time. `units` is a bare number in a unit the game
   * does not name, and the label says which: Corpse Explosion's radius is
   * labelled "half squares" by the game and halved by the engine, while a
   * curse's is labelled "Radius" and used as it stands, so the two must not
   * share a conversion. `mana` is fractional by design.
   */
  readonly unit: "percent" | "count" | "frames" | "units" | "mana";
  readonly shape:
    | { readonly kind: "linear"; readonly base: number; readonly perLevel: number; readonly cap?: number }
    | { readonly kind: "step"; readonly base: number; readonly per: number }
    | { readonly kind: "range"; readonly min: number; readonly max: number }
    | { readonly kind: "petmax"; readonly threshold: number; readonly base: number; readonly per: number };
}

const par = (s: RawSkill, n: number): number => {
  const v = s[`Param${n}`];
  if (typeof v !== "number") {
    throw new Error(`${s.skill}: Param${n} is missing; the effect table names a parameter the row does not have`);
  }
  return v;
};

/** Radius and duration, shared by all ten curses. `ln12` and `ln34`. */
const curseEffects = (s: RawSkill): EffectSpec[] => [
  { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
  { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
];

const EFFECTS: Record<string, (s: RawSkill) => EffectSpec[]> = {
  // Param1 Min %, Param2 Max %. No calc column; see the note above.
  "critical-strike": (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  dodge: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  avoid: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  evade: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  pierce: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  // Param1 baseline, Param2 per level. Passes 100%, which is correct for an
  // attack-rating bonus and would be a bug to clamp.
  penetrate: (s) => [{ labelKey: "effectAttackRating", unit: "percent", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } }],
  // calc1: min(ln12, 24) — the cap is read out of that column, not restated
  // here. See `capFromMinCalc`, and why Strafe below does not use it.
  "multiple-shot": (s) => [
    {
      labelKey: "effectArrows",
      unit: "count",
      shape: {
        kind: "linear",
        base: par(s, 1),
        perLevel: par(s, 2),
        cap: capFromMinCalc(s.calc1, `${s.skill} calc1`),
      },
    },
  ],
  // calc1: min(par3 + lvl - 1, par4)
  strafe: (s) => [{ labelKey: "effectShots", unit: "count", shape: { kind: "linear", base: par(s, 3), perLevel: 1, cap: par(s, 4) } }],
  // calc1: par1 + lvl/par2 -- integer division, so a step rather than a slope.
  "charged-strike": (s) => [{ labelKey: "effectBolts", unit: "count", shape: { kind: "step", base: par(s, 1), per: par(s, 2) } }],
  // calc1: ln12
  "lightning-fury": (s) => [{ labelKey: "effectBolts", unit: "count", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } }],
  // calc2: ln34
  "lightning-strike": (s) => [{ labelKey: "effectJumps", unit: "count", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } }],

  // -- Sorceress -----------------------------------------------------------
  /*
   * One row, and it is here because prose got it wrong.
   *
   * Three build pages said Glacial Spike's freeze "runs 50 frames at one point
   * and three more per level" and concluded that a maxed one "holds a pack
   * still for over four seconds". The 50 and the 3 are right -- they are
   * `Param3` and `Param4`, named "Freeze Length baseline" and "Freeze Length
   * per level", read through `auralencalc = ln34 * (100 + Blizzard.blvl * par7)
   * / 100`. The four seconds is right only in Normal. `MonsterFreezeDivisor` in
   * difficultylevels.txt is 1, 2 and 4, so the same 107 frames at level 20 is
   * 4.3s in Normal, 2.1s in Nightmare and 1.1s in Hell -- and Hell is where
   * every build quoting the number is played.
   *
   * So the number is extracted rather than retyped, and it is *not* published
   * under `effectDuration`. Bone Wall's duration is the same length in every
   * difficulty; this one is not, and a shared heading would flatten exactly the
   * difference that produced the error. `effectFreezeLength` names the
   * difficulty in the label for the same reason `effectRadiusHalfSquares` names
   * its unit: the generic word is the one a reader gets wrong.
   *
   * The explosion radius is `aurarangecalc = ln12` with `Param2` zero, so it
   * never moves with a point. Left out, on the rule the Druid tree already
   * follows -- a row reading the same at 1 and 20 is noise.
   */
  "glacial-spike": (s) => [
    { labelKey: "effectFreezeLength", unit: "frames", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
  ],

  // -- Necromancer ---------------------------------------------------------
  /*
   * Curses share two columns, `aurarangecalc = ln12` and `auralencalc = ln34`,
   * so radius and duration are read the same way for all ten: Param1/Param2 and
   * Param3/Param4.
   *
   * The radius unit is the game's own and it does not name it. Corpse
   * Explosion's parameters *are* named -- "Explosion Radius (half squares)" --
   * and the engine halves them before use, which is why that skill gets its own
   * label and why no conversion is shared between the two.
   *
   * Dim Vision and Terror have their duration divided by the difficulty's
   * AiCurseDivisor (1, 2, 4) in the engine. The table publishes the Normal
   * figure the column gives and the skill pages say so; dividing here would
   * publish one difficulty's number as though it were every difficulty's.
   */
  ...Object.fromEntries(
    ["amplify-damage", "dim-vision", "terror", "confuse", "life-tap", "attract", "decrepify"].map(
      (slug) => [slug, (s: RawSkill) => curseEffects(s)],
    ),
  ),
  // ln56: Param5 baseline, Param6 per level. Negative, and correctly so.
  weaken: (s) => [
    ...curseEffects(s),
    { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
  ],
  "iron-maiden": (s) => [
    ...curseEffects(s),
    { labelKey: "effectDamageReturned", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
  ],
  // aurastatcalc: -dm56, a diminishing curve between Param5 and Param6.
  "lower-resist": (s) => [
    ...curseEffects(s),
    { labelKey: "effectResistReduction", unit: "percent", shape: { kind: "range", min: par(s, 5), max: par(s, 6) } },
  ],
  // calc1: min(ln12, 24) -- the same shape and the same ceiling as Multiple Shot.
  teeth: (s) => [
    {
      labelKey: "effectMissiles",
      unit: "count",
      shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2), cap: capFromMinCalc(s.calc1, `${s.skill} calc1`) },
    },
  ],
  // aurastatcalc1: (ln12 + synergy) * 256 -- a flat pool, not a percentage.
  "bone-armor": (s) => [
    { labelKey: "effectAbsorbed", unit: "units", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
  ],
  // aurarangecalc: ln34, and Param3/Param4 are the ones named "half squares".
  "corpse-explosion": (s) => [
    { labelKey: "effectRadiusHalfSquares", unit: "units", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
  ],
  /*
   * calc1: par1 * (lvl - 1) + synergy, so the wall's life bonus is zero at level
   * 1 and the base is the wall's own. calc2: ln34, the segment count, which does
   * not grow. Param2 is a flat duration in frames.
   */
  "bone-wall": (s) => [
    { labelKey: "effectWallLife", unit: "percent", shape: { kind: "linear", base: 0, perLevel: par(s, 1) } },
    { labelKey: "effectWallSegments", unit: "count", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
    { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 2), perLevel: 0 } },
  ],
  "bone-prison": (s) => [
    { labelKey: "effectWallLife", unit: "percent", shape: { kind: "linear", base: 0, perLevel: par(s, 1) } },
    { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 2), perLevel: 0 } },
  ],
  /*
   * Raise Skeleton, Raise Skeletal Mage and Revive all read Skeleton Mastery's
   * parameters through its *effective* level, so these figures are per level of
   * this skill and land on every minion it feeds.
   */
  "skeleton-mastery": (s) => [
    { labelKey: "effectMinionLife", unit: "units", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 1) } },
    { labelKey: "effectMinionDamage", unit: "units", shape: { kind: "linear", base: par(s, 2), perLevel: par(s, 2) } },
  ],
  "raise-skeleton": (s) => [
    { labelKey: "effectMinions", unit: "count", shape: petMaxFromColumn(s.petmax, `${s.skill} petmax`) },
  ],
  "raise-skeletal-mage": (s) => [
    { labelKey: "effectMinions", unit: "count", shape: petMaxFromColumn(s.petmax, `${s.skill} petmax`) },
  ],
  // aurastatcalc1: dm34, the slow, on a diminishing curve between Param3 and Param4.
  "clay-golem": (s) => [
    { labelKey: "effectSlow", unit: "percent", shape: { kind: "range", min: par(s, 3), max: par(s, 4) } },
  ],
  // ln12 life, ln56 attack rating, dm34 movement speed.
  "golem-mastery": (s) => [
    { labelKey: "effectGolemLife", unit: "percent", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectGolemAttackRating", unit: "units", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
    { labelKey: "effectGolemSpeed", unit: "percent", shape: { kind: "range", min: par(s, 3), max: par(s, 4) } },
  ],
  // calc2: dm12, the life steal.
  "blood-golem": (s) => [
    { labelKey: "effectLifeSteal", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } },
  ],
  // passivecalc1: dm12. Passive, so no mana cost is published for it.
  "summon-resist": (s) => [
    { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } },
  ],
  /*
   * aurastatcalc2: dm12, the fire absorb. sumsk1calc: min(ln56, 30), the level
   * of the Holy Fire aura the golem runs -- read through the same cap parser
   * Multiple Shot uses, because it is the same shape of column.
   */
  "fire-golem": (s) => [
    { labelKey: "effectFireAbsorb", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } },
    {
      labelKey: "effectAuraLevel",
      unit: "count",
      shape: {
        kind: "linear",
        base: par(s, 5),
        perLevel: par(s, 6),
        cap: capFromMinCalc(s.sumsk1calc, `${s.skill} sumsk1calc`),
      },
    },
  ],
  // petmax: lvl, so the count is the effective skill level. calc2: ln34, a flat
  // duration in frames -- Param4 is zero, and a revive cannot be refreshed.
  revive: (s) => [
    { labelKey: "effectMinions", unit: "count", shape: petMaxFromColumn(s.petmax, `${s.skill} petmax`) },
    { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
  ],
  // -- Druid ---------------------------------------------------------------
  /*
   * Three trees, three habits.
   *
   * The elemental tree publishes what a reader positions with: how wide the
   * effect is and how long it stands. Firestorm's wave count and Volcano's
   * missile range are left out -- both are flat parameters that never move with
   * a point, and a row reading the same at level 1 and level 20 is noise on a
   * page whose whole subject is what a point buys.
   *
   * The shapeshifting tree publishes percentages, and the two charge skills
   * publish the charge count as a `step`: `calc2` is `lvl/par7 + par8` with
   * integer division, three charges at level 1 and one more every two levels.
   * Reading that as a slope gives three and a half charges at level 2, which
   * the game never grants.
   *
   * The summoning tree publishes counts and the aura numbers. What it does not
   * publish is the mutual bonus between the wolves and the bear: those read
   * each other's *effective* level, are named in SOFT_LEVEL_SYNERGIES for that
   * reason, and are on the pages in prose.
   */
  // ln12 = Param1 plus Param2 per level, the absorbed pool. Synergised by the
  // three wind skills, which the graph carries as edges.
  "cyclone-armor": (s) => [
    { labelKey: "effectAbsorbed", unit: "units", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
  ],
  // aurarangecalc: par1 -- the explosion, not the roll.
  "molten-boulder": (s) => [
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 1), perLevel: 0 } },
  ],
  // calc1: par1
  fissure: (s) => [
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 1), perLevel: 0 } },
  ],
  /*
   * calc1: par1 missiles. calc2: par2 + par7 * Arctic Blast, so the stun has a
   * flat base and everything above it comes from the synergy the graph already
   * draws. Publishing par2 with a slope would count that synergy twice.
   */
  twister: (s) => [
    { labelKey: "effectMissiles", unit: "count", shape: { kind: "linear", base: par(s, 1), perLevel: 0 } },
    { labelKey: "effectStun", unit: "frames", shape: { kind: "linear", base: par(s, 2), perLevel: 0 } },
  ],
  // aurarangecalc: par2, the radius the funnel damages as it travels.
  tornado: (s) => [
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 2), perLevel: 0 } },
  ],
  /*
   * auralencalc: ln12 plus Fissure times par7 for Armageddon, and plus Cyclone
   * Armor times par7 for Hurricane. Param2 is zero on both: the duration does
   * not grow with the skill's own level at all, only with the synergy. That is
   * the number worth publishing -- a reader who maxes Hurricane and expects it
   * to last longer is the mistake this row prevents.
   */
  armageddon: (s) => [
    { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 3), perLevel: 0 } },
  ],
  hurricane: (s) => [
    { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 3), perLevel: 0 } },
  ],

  // aurastatcalc2: dm34, a diminishing curve from Param3 to Param4.
  // aurastatcalc4: par2 plus Lycanthropy's ln34 -- the flat share is this one's.
  werewolf: (s) => [
    { labelKey: "effectAttackSpeed", unit: "percent", shape: { kind: "range", min: par(s, 3), max: par(s, 4) } },
    { labelKey: "effectLifeBonus", unit: "percent", shape: { kind: "linear", base: par(s, 2), perLevel: 0 } },
  ],
  // auralencalc on both forms is 1000 plus this skill's ln12, and both read its
  // ln34 for life. One skill, two forms, and the only place either number grows.
  lycanthropy: (s) => [
    { labelKey: "effectDuration", unit: "frames", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectLifeBonus", unit: "percent", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
  ],
  // aurastatcalc1: ln12, aurastatcalc2: ln34, aurastatcalc3: par5 plus Lycanthropy.
  werebear: (s) => [
    { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectDefenseBonus", unit: "percent", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
    { labelKey: "effectLifeBonus", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: 0 } },
  ],
  /*
   * The two charge skills, and the line this table draws through them.
   *
   * Published: what a level buys outright. Feral Rage's own damage bonus
   * (`calc1 = ln56`, the same shape as Fury's), its velocity (`aurastatcalc1 =
   * dm34`, a diminishing curve in the level), Maul's stun (`dm56`) and both
   * charge counts (`calc2 = lvl/par7 + par8`).
   *
   * Not published: the per-charge numbers. Maul's `aurastatcalc1` is
   * `lvl * par3` under a parameter the game calls "Damage % per Charge", and
   * Feral Rage's `aurastatcalc2` is `par2 * lvl` under "Lifesteal % per Charge".
   * Both are a value *for one charge*, and how the state stacks charges is in
   * the engine and in no column read here. A row headed "Damage dealt" reading
   * 600% at level 20 would be either a sixth of the truth or six times it,
   * depending on a fact this generator does not have. The pages say what the
   * charges do in a sentence instead.
   */
  "feral-rage": (s) => [
    { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
    { labelKey: "effectMoveSpeed", unit: "percent", shape: { kind: "range", min: par(s, 3), max: par(s, 4) } },
    { labelKey: "effectCharges", unit: "count", shape: { kind: "step", base: par(s, 8), per: par(s, 7) } },
  ],
  maul: (s) => [
    { labelKey: "effectStun", unit: "percent", shape: { kind: "range", min: par(s, 5), max: par(s, 6) } },
    { labelKey: "effectCharges", unit: "count", shape: { kind: "step", base: par(s, 8), per: par(s, 7) } },
  ],
  // calc2 and calc3: dm12 and dm34. calc1: par5, and it is negative on purpose
  // -- Hunger trades three quarters of the hit for the steal.
  hunger: (s) => [
    { labelKey: "effectLifeSteal", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } },
    { labelKey: "effectManaSteal", unit: "percent", shape: { kind: "range", min: par(s, 3), max: par(s, 4) } },
    { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: 0 } },
  ],
  // calc4: ln12, the stun. calc1 is a literal five waves and does not move.
  "shock-wave": (s) => [
    { labelKey: "effectStun", unit: "frames", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
  ],
  // calc1: min(par5 + lvl - 1, par6). The cap is a parameter, so it is read from
  // the row the way Strafe's is -- not through capFromMinCalc, which takes only
  // a literal.
  fury: (s) => [
    { labelKey: "effectHits", unit: "count", shape: { kind: "linear", base: par(s, 5), perLevel: 1, cap: par(s, 6) } },
    { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
  ],

  // petmax: min(lvl, par2). calc3: ln56 -- a raven leaves after that many hits.
  raven: (s) => [
    { labelKey: "effectMinions", unit: "count", shape: petMaxFromColumn(s.petmax, `${s.skill} petmax`, (n) => par(s, n)) },
    { labelKey: "effectSummonHits", unit: "count", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
  ],
  // The two totems that buff. Param1 and Param2 must match the aura's own row,
  // and the game says so in the parameter names.
  "oak-sage": (s) => [
    { labelKey: "effectPartyLife", unit: "percent", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 7), perLevel: par(s, 8) } },
  ],
  "heart-of-wolverine": (s) => [
    { labelKey: "effectDamageDealt", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
    { labelKey: "effectAttackRating", unit: "percent", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } },
    { labelKey: "effectRadius", unit: "units", shape: { kind: "linear", base: par(s, 7), perLevel: par(s, 8) } },
  ],
  // petmax: min(lvl, par3) on both wolves -- five spirit wolves, three dire.
  // aurastatcalc1 to 4: min(par8 times lvl, 85), one entry per element.
  "summon-spirit-wolf": (s) => [
    { labelKey: "effectMinions", unit: "count", shape: petMaxFromColumn(s.petmax, `${s.skill} petmax`, (n) => par(s, n)) },
    { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "linear", base: par(s, 8), perLevel: par(s, 8), cap: 85 } },
  ],
  "summon-dire-wolf": (s) => [
    { labelKey: "effectMinions", unit: "count", shape: petMaxFromColumn(s.petmax, `${s.skill} petmax`, (n) => par(s, n)) },
    { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "linear", base: par(s, 8), perLevel: par(s, 8), cap: 85 } },
  ],
  "summon-grizzly": (s) => [
    { labelKey: "effectMinionDamageBonus", unit: "percent", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } },
    { labelKey: "effectMinionResist", unit: "percent", shape: { kind: "linear", base: par(s, 8), perLevel: par(s, 8), cap: 85 } },
  ],
  // The two harvesting vines. Param5 and Param6 must match the cycler's own row.
  "carrion-vine": (s) => [
    { labelKey: "effectLifeSteal", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
  ],
  "solar-creeper": (s) => [
    { labelKey: "effectManaSteal", unit: "percent", shape: { kind: "linear", base: par(s, 5), perLevel: par(s, 6) } },
  ],
};

/**
 * Skills whose mana cost is published.
 *
 * Opt-in rather than "every row that has a `mana` column", because three
 * Necromancer rows carry one and cannot be cast. Summon Resist is a passive with
 * `mana=44, lvlmana=-3`; taken at face value it would publish a 44-mana cost for
 * a skill that has no activation at all, falling below its own floor by level
 * 20. Skeleton Mastery and Golem Mastery carry zeroes for the same reason.
 *
 * Scoped to the Necromancer. The other three classes publish mana in authored
 * prose where it is decision-relevant, and moving them onto extraction rewrites
 * ninety nodes — a change that deserves its own pass and its own diff rather
 * than riding along with this one.
 */
const PUBLISHES_MANA = new Set<string>([
  "amplify-damage", "dim-vision", "weaken", "iron-maiden", "terror",
  "confuse", "life-tap", "attract", "decrepify", "lower-resist",
  "teeth", "bone-armor", "poison-dagger", "corpse-explosion", "bone-wall",
  "poison-explosion", "bone-spear", "bone-prison", "poison-nova", "bone-spirit",
  "raise-skeleton", "clay-golem", "raise-skeletal-mage", "blood-golem",
  "iron-golem", "fire-golem", "revive",
  /*
   * The Druid, twenty-eight of thirty. Mana is the whole of the Wind Druid's
   * sustain question -- Tornado is cast continuously and Hurricane re-cast on a
   * timer -- so the cost belongs on the page rather than in prose.
   *
   * Two rows are left off deliberately.
   *
   * Lycanthropy costs nothing at all: `mana`, `lvlmana` and `minmana` are every
   * one of them zero, and `manaFromRow` returns undefined rather than a cost of
   * nought.
   *
   * Arctic Blast costs 0.375 mana at `manashift` 2 -- which is correct, and is
   * per *frame*, because the skill is channelled. A row reading "Mana: 0.4"
   * under the same heading as Hurricane's 30 reads as cheap when it is roughly
   * nine mana a second. The shapes here carry no per-second unit, so the number
   * stays in prose where a sentence can say what it is.
   */
  "firestorm", "molten-boulder", "fissure", "cyclone-armor", "twister",
  "volcano", "tornado", "armageddon", "hurricane",
  "werewolf", "werebear", "feral-rage", "maul", "rabies", "fire-claws",
  "hunger", "shock-wave", "fury",
  "raven", "poison-creeper", "oak-sage", "summon-spirit-wolf", "carrion-vine",
  "heart-of-wolverine", "summon-dire-wolf", "solar-creeper", "spirit-of-barbs",
  "summon-grizzly",
]);

/**
 * Skills whose `MinDam`/`MaxDam` columns are physical damage the skill itself
 * deals, and which therefore publish a physical table beside the elemental one.
 *
 * An allow-list, for the same reason `EFFECTS` is one: nothing in the columns
 * says what the number *is*. Four different meanings share this pair of columns
 * across the rows in scope, and only the first is the skill's own damage:
 *
 *   the skill's damage      Tornado's 25-35, Armageddon's 18-26 alongside its
 *                           fire. Published.
 *   a minion's damage       Raven 2-4, Summon Dire Wolf 7-12, Summon Grizzly
 *                           30-60. Real numbers, but they belong to the pet, and
 *                           every other minion figure on this site is prose read
 *                           from `monstats`. Excluded.
 *   a bonus to another      Holy Shield's 3-6, which is added to Smite. A buff
 *   skill                   that deals no damage would publish a damage range.
 *                           Excluded.
 *   something that is not   Spirit of Barbs' 32, the share of damage the totem
 *   a range at all          returns. The row has no `MaxDam` whatsoever, which
 *                           is the tell. Excluded.
 *
 *   the same damage twice   Psychic Hammer's 2-6, which the row also declares as
 *                           `EMin`/`EMax` under `EType = mag` — the identical
 *                           numbers and the identical per-level bands.
 *                           Publishing both would tabulate one damage as two.
 *                           Excluded.
 *
 * Magic Arrow is excluded by rule rather than by name: its missile declares
 * `EType = mag`, so those columns are delivered as magic damage and the site
 * already models the skill as `weapon-converted-to-element`. Calling them
 * physical would contradict the page above them.
 *
 * Mind Blast is included by the same reasoning that includes Shock Wave, and
 * the two rows are worth reading side by side. Shock Wave carries no `EType` at
 * all; Mind Blast carries `EType = stun` with an `ELen` and **no** `EMin`/`EMax`.
 * A stun is a status with a length rather than damage with a range, so neither
 * row has anything in the elemental columns and in both the physical pair is the
 * whole of the skill's damage. Psychic Hammer is the row that proves the
 * distinction is real rather than a convenience: it *does* fill `EMin`/`EMax`,
 * with the same numbers, and is excluded for exactly that reason.
 *
 * `assertPhysicalClassified` below refuses any in-scope row carrying both
 * columns that appears in neither list, so a class added later cannot publish
 * silence where a damage table belongs, or a damage table where a bonus does.
 */
const PUBLISHES_PHYSICAL = new Set<string>([
  "molten-boulder", "twister", "shock-wave", "volcano", "tornado", "armageddon",
  /*
   * The Assassin's four. Three of them are the blade skills, and their physical
   * table is only half the story: each carries `SrcDam = 96`, so three quarters
   * of the weapon's damage lands on top of the range published here. That share
   * is why the build holds a large normal weapon, and the pages say so.
   *
   * Mind Blast carries no weapon share at all — the range is the whole of it.
   */
  "blade-sentinel", "blade-fury", "blade-shield", "mind-blast",
  /*
   * The Barbarian's two, and each is a shape already on this list.
   *
   * Leap Attack is Blade Fury's: `SrcDam = 128` **and** a physical range of its
   * own, 10-20 at level 1. The weapon's full damage lands and this lands with
   * it, which is why the skill also carries `damageModel: "weapon-plus-element"`
   * — without a model the partition in `check-content.ts` drops it into `table`
   * and it stops being an attack.
   *
   * War Cry is Shock Wave's: no `SrcDam` and no `EType`, so the range is the
   * whole of the skill's damage, 30-40 at level 1. It is the only Barbarian
   * skill that kills without a weapon.
   *
   * A discriminator was tried here and rejected, and is written up in
   * `docs/research/08-barbarian.md` §2.3 so the next class does not retry it:
   * every row already on this list prints a physical range in the game's own
   * tooltip (`desccalca = pnma`/`pxma`) — and so do Holy Shield, Raven and
   * Spirit of Barbs, which are all excluded. `descdam` comes closer, empty on
   * five of the six excluded rows, and Psychic Hammer breaks it. The list stays
   * a list.
   */
  "leap-attack", "war-cry",
  /*
   * The Warlock's two, and the second is the hardest call this list has had to
   * make, because the two precedents already on either side of it disagree.
   *
   * Echoing Strike is easy and is Blade Fury's shape: `SrcDam = 116` plus a
   * physical range of its own, so 91% of the weapon lands on top of the table.
   *
   * Blood Boil's physical and fire tables are **byte-identical**, base and all
   * five bands — `10-20` rising to `20-30`. That is exactly Psychic Hammer's
   * shape, and Psychic Hammer is excluded below as one damage written twice. It
   * is also Molten Boulder's shape, and Molten Boulder is published.
   *
   * What separates them is the donor, not the table. Psychic Hammer carries
   * **no** `DmgSymPerCalc` and no `EDmgSymPerCalc` — nothing feeds either
   * number, which is what one damage written twice looks like. Blood Boil
   * carries both, and they name different skills:
   *
   *     DmgSymPerCalc    (skill('Engorge'.blvl))*par8      -> the physical
   *     EDmgSymPerCalc   (skill('Blood Oath'.blvl))*par8   -> the fire
   *
   * Two components fed by two different skills are two components. Molten
   * Boulder and Volcano are the same argument with a louder label — theirs
   * carry two separately named params, "Physical Damage synergy" and "Fire
   * Damage synergy", where Blood Boil has one `par8` read by both expressions.
   * The labels are what made those two easy; the donors are what decide this
   * one.
   */
  "echoing-strike", "blood-boil",
]);

/** Rows whose `MinDam`/`MaxDam` is deliberately not published, and why. */
const PHYSICAL_IS_NOT_THE_SKILLS_OWN: Record<string, string> = {
  "holy-shield": "a damage bonus written onto Smite, not damage the buff deals",
  raven: "the raven's damage per hit, which belongs to the pet",
  "summon-dire-wolf": "the wolf's damage per hit, which belongs to the pet",
  "summon-grizzly": "the bear's damage per hit, which belongs to the pet",
  "spirit-of-barbs": "the share of damage the totem returns; the row has no MaxDam at all",
  "psychic-hammer":
    "the same 2-6 the row already declares as magic in EMin/EMax, with the same " +
    "per-level bands; publishing both would tabulate one damage as two",
};

/**
 * Stops the generator on a row whose physical columns nobody has classified.
 *
 * The two lists above are decisions. This is what keeps them decisions: a new
 * class, or a re-pinned extraction that adds these columns to a row that did
 * not have them, fails here rather than quietly picking one of the four
 * meanings and being wrong three times out of four.
 */
function assertPhysicalClassified(slug: string, s: RawSkill, missileEType: string | undefined): void {
  const has = (c: string) => typeof s[c] === "number" && s[c] !== 0;
  if (!has("MinDam") && !has("MaxDam")) return;
  if (missileEType) return; // delivered as that element; see Magic Arrow above.
  if (PUBLISHES_PHYSICAL.has(slug)) return;
  if (slug in PHYSICAL_IS_NOT_THE_SKILLS_OWN) return;
  throw new Error(
    `${s.skill}: carries MinDam/MaxDam and is in neither PUBLISHES_PHYSICAL nor ` +
      `PHYSICAL_IS_NOT_THE_SKILLS_OWN. Those columns mean four different things across the ` +
      `rows in scope; decide which one this is rather than letting it default.`,
  );
}

const asArray = <T,>(j: unknown): T[] => (Array.isArray(j) ? j : Object.values(j as object)) as T[];

/**
 * Fetches one pinned file and refuses anything that is not the shape we parse.
 *
 * A pin is only worth having if its disappearance is loud. A deleted repo, a
 * rewritten history or a restructured file must stop the generator with a
 * message that says which assumption broke — not yield an empty array that
 * quietly regenerates a graph with sixty skills missing.
 */
async function getJson<T>(path: string, requiredFields: readonly string[]): Promise<T[]> {
  let res: Response;
  try {
    res = await fetch(`${RAW}/${path}`);
  } catch (cause) {
    throw new Error(
      `${path}: could not be fetched from ${SOURCE_REPO}@${SOURCE_SHA.slice(0, 12)}. ` +
        `The pinned commit may be gone, or the network is unavailable.`,
      { cause },
    );
  }
  if (!res.ok) {
    throw new Error(
      `${path}: HTTP ${res.status} from ${SOURCE_REPO}@${SOURCE_SHA.slice(0, 12)}. ` +
        `If this is a 404, the pinned commit or the file layout has changed; ` +
        `re-pin SOURCE_SHA deliberately and review the resulting diff.`,
    );
  }

  let parsed: unknown;
  try {
    parsed = await res.json();
  } catch (cause) {
    throw new Error(`${path}: not valid JSON at the pinned commit`, { cause });
  }

  const rows = asArray<T>(parsed);
  if (rows.length === 0) {
    throw new Error(`${path}: parsed to zero rows at the pinned commit`);
  }
  // The columns this script reads, checked against the union of keys across
  // every row rather than against the first one. The export omits empty cells,
  // so row 0 ("Attack", a skill belonging to no class) legitimately has no
  // `charclass` — absence there is sparseness, not a schema change. A column
  // that appears on *no* row is the real signal that the format moved.
  const present = new Set<string>();
  for (const row of rows) for (const key of Object.keys(row as object)) present.add(key);
  const missing = requiredFields.filter((f) => !present.has(f));
  if (missing.length > 0) {
    throw new Error(
      `${path}: the pinned source no longer carries [${missing.join(", ")}]. ` +
        `The upstream format changed; update the parser before re-pinning.`,
    );
  }
  return rows;
}

/** Prerequisite sets keyed by slug, for one extraction. */
function prereqSets(skills: RawSkill[]): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const s of skills) {
    if (!(s.charclass !== undefined && s.charclass in classOf)) continue;
    out.set(
      slugFor(s.skill),
      [s.reqskill1, s.reqskill2].filter((x): x is string => Boolean(x)).map(slugFor).sort(),
    );
  }
  return out;
}

async function main() {
  const [current, base, descs, missiles] = await Promise.all([
    getJson<RawSkill>(PATHS.current, ["skill", "charclass", "reqlevel", "maxlvl", "skilldesc"]),
    getJson<RawSkill>(PATHS.base, ["skill", "charclass", "reqlevel"]),
    getJson<RawDesc>(PATHS.descs, ["skilldesc", "SkillPage", "SkillRow", "SkillColumn"]),
    getJson<RawMissile>(PATHS.missiles, ["Missile", "DmgCalc1", "EDmgSymPerCalc", "HitSubMissile1"]),
  ]);

  /*
   * Conversion, keyed by missile name.
   *
   * A skill converts when the missile it creates declares `dl12`. That is
   * independent of whether the skill row carries EMin/EMax: Magic Arrow
   * converts and has no elemental table at all, while Fire Arrow does both.
   * Reading it off the missile is what keeps those two facts separate.
   */
  const conversionByMissile = new Map<string, { element: string; base: number; perLevel: number }>();
  for (const m of missiles) {
    if (!String(m.DmgCalc1 ?? "").includes("dl12")) continue;
    if (!m.EType) {
      throw new Error(`missile ${m.Missile} declares a conversion with no element to convert into`);
    }
    conversionByMissile.set(String(m.Missile).toLowerCase(), {
      element: m.EType,
      base: m.dParam1 ?? 0,
      perLevel: m.dParam2 ?? 0,
    });
  }
  if (conversionByMissile.size === 0) {
    throw new Error("no missile declares a dl12 conversion; the damage columns must have moved");
  }

  /** The missiles a skill can create, in the order the game would pick them. */
  const missilesOf = (s: RawSkill & Record<string, unknown>) =>
    ["srvmissile", "srvmissilea", "srvmissileb", "srvmissilec"]
      .map((k) => s[k])
      .filter((v): v is string => typeof v === "string" && v.length > 0);

  /**
   * The element a skill's missile delivers, where it declares one.
   *
   * Read for one purpose: deciding whether `MinDam`/`MaxDam` is physical. A
   * missile with an `EType` carries the skill's flat damage as that element
   * instead — Magic Arrow's 1-1 is magic, not physical — and the physical table
   * must not be published beside it.
   */
  const eTypeByMissile = new Map<string, string>();
  for (const m of missiles) {
    if (m.EType) eTypeByMissile.set(String(m.Missile).toLowerCase(), m.EType);
  }

  /**
   * Every missile row by lowercased name, for the sub-missile walk.
   *
   * Keyed the same way as the two maps above and for the same reason: the
   * skill columns and the `SubMissile` columns do not agree on case.
   */
  const missileByName = new Map<string, MissileRow>();
  for (const m of missiles) {
    missileByName.set(String(m.Missile).toLowerCase(), m as unknown as MissileRow);
  }
  const missileETypeFor = (s: RawSkill & Record<string, unknown>) =>
    missilesOf(s)
      .map((name) => eTypeByMissile.get(name.toLowerCase()))
      .find((e) => e !== undefined);

  const conversionFor = (s: RawSkill & Record<string, unknown>) => {
    const found = missilesOf(s)
      .map((name) => conversionByMissile.get(name.toLowerCase()))
      .filter((c) => c !== undefined);
    if (found.length === 0) return undefined;
    const first = JSON.stringify(found[0]);
    if (found.some((c) => JSON.stringify(c) !== first)) {
      throw new Error(`${s.skill}: its missiles declare different conversions; pick one deliberately`);
    }
    return found[0];
  };

  const mine = current.filter((s) => s.charclass !== undefined && s.charclass in classOf);
  const expected = Object.keys(classOf).length * 30;
  if (mine.length !== expected) {
    throw new Error(`expected ${expected} skills across ${Object.keys(classOf).length} classes, got ${mine.length}`);
  }

  // --- agreement check across the two extractions --------------------------
  const a = prereqSets(current);
  const b = prereqSets(base);
  let agree = 0;
  const disagree: string[] = [];
  for (const [slug, pre] of a) {
    const other = b.get(slug);
    if (other && JSON.stringify(pre) === JSON.stringify(other)) agree++;
    else disagree.push(slug);
  }

  // --- page join -----------------------------------------------------------
  const cellByDesc = new Map<string, { page: number; row: number; column: number }>();
  for (const d of descs) {
    if (d.SkillPage === undefined || d.SkillRow === undefined || d.SkillColumn === undefined) continue;
    cellByDesc.set(String(d.skilldesc), { page: d.SkillPage, row: d.SkillRow, column: d.SkillColumn });
  }

  // --- tree slugs, derived from the site's own membership ------------------
  const authoredTree = new Map(allSkills.map((s) => [s.slug, s.tree]));
  const treeByClassPage = new Map<string, string>();
  for (const s of mine) {
    const slug = slugFor(s.skill);
    const cell = cellByDesc.get(String(s.skilldesc));
    const page = cell?.page;
    const tree = authoredTree.get(slug);
    if (page === undefined) throw new Error(`no SkillPage/Row/Column for ${slug}`);
    if (!tree) throw new Error(`${slug} is in the game data but not in content/classes`);
    const key = `${classOf[s.charclass as keyof typeof classOf]}:${page}`;
    const seen = treeByClassPage.get(key);
    if (seen && seen !== tree) {
      throw new Error(`page ${key} maps to two authored trees: ${seen} and ${tree}`);
    }
    treeByClassPage.set(key, tree);
  }

  // --- emit ----------------------------------------------------------------
  /** D2 adds a different amount per level inside five bands. */
  const bands = (s: RawSkill, k: "EMin" | "EMax") =>
    [1, 2, 3, 4, 5].map((i) => (s[`${k}Lev${i}` as keyof RawSkill] as number | undefined) ?? 0);

  /**
   * The same five bands for physical damage, whose columns are spelled
   * differently: `MinDam` grows through `MinLevDam1..5`, not `MinDamLev1..5`.
   * Two helpers rather than one clever one, so neither can silently read the
   * wrong family of columns and return five zeroes.
   */
  const physBands = (s: RawSkill, k: "MinLevDam" | "MaxLevDam") =>
    [1, 2, 3, 4, 5].map((i) => (s[`${k}${i}`] as number | undefined) ?? 0);

  const num = (s: RawSkill, column: "MinDam" | "MaxDam") => {
    const v = s[column];
    if (typeof v !== "number") {
      throw new Error(`${s.skill}: ${column} is missing, and the physical table is read from it`);
    }
    return v;
  };

  /*
   * Elemental duration, taken only where it decides the damage.
   *
   * `ELen` means two different things depending on the element. For poison it
   * is the window the damage is spread across, and the published number is
   * meaningless without it -- Poison Javelin's columns are damage per frame and
   * floor to zero on their own. For cold it is a freeze or chill length, and the
   * damage lands at once; multiplying by it would invent a number the game
   * never produces. So poison gets a duration and nothing else does.
   *
   * `ELevLen1..3` are three per-level bands whose boundaries this script has
   * not verified. Every poison skill in the game happens to repeat one value
   * across all three, which makes the duration plainly linear and the
   * boundaries irrelevant. That is luck, not a guarantee, so a poison skill
   * with non-uniform bands stops the generator rather than being flattened into
   * a linear scale that would be wrong from level 9 on.
   */
  const duration = (s: RawSkill) => {
    if (s.EType !== "pois") return undefined;
    const base = s.ELen ?? 0;
    if (base === 0) {
      throw new Error(
        `${s.skill}: poison damage with no ELen. Poison columns are per-frame, so ` +
          `without a duration the published damage would be zero.`,
      );
    }
    if (FIXED_DURATION.has(s.skill)) {
      return { base, perLevel: 0 };
    }
    const perLevel = [s.ELevLen1 ?? 0, s.ELevLen2 ?? 0, s.ELevLen3 ?? 0];
    if (new Set(perLevel).size > 1) {
      throw new Error(
        `${s.skill}: poison duration grows in uneven bands [${perLevel.join(", ")}]. ` +
          `The band boundaries are unverified, so this cannot be emitted as a linear ` +
          `scale. Establish them deliberately before re-pinning.`,
      );
    }
    return { base, perLevel: perLevel[0] };
  };

  /*
   * Every extracted row, keyed by the game's identifier, so a `skill('X'.parN)`
   * reference can be resolved to the row that owns the parameter. Built from the
   * whole table rather than from the classes in scope: the owner is always a
   * skill of the same class today, and a rule that silently returned nothing for
   * an out-of-scope owner would be a quiet wrong answer rather than a loud one.
   */
  const rowByName = new Map<string, SkillRow>(
    current.map((s) => [s.skill, s]),
  );

  /**
   * The mana cost, refused rather than guessed when the row has none.
   *
   * `PUBLISHES_MANA` is the decision that a skill is cast at all; this is the
   * arithmetic. A slug on that list whose row carries no cost is a contradiction
   * worth stopping for -- it means either the list is wrong or the columns moved.
   */
  const manaShape = (s: RawSkill, slug: string) => {
    const mana = manaFromRow(s, `${s.skill} mana`);
    if (!mana) {
      throw new Error(
        `${slug} is listed in PUBLISHES_MANA and its row carries no mana cost at all. ` +
          `Either it is not a cast skill or the mana columns have moved.`,
      );
    }
    return mana;
  };

  const rows = mine
    .map((s) => {
      const slug = slugFor(s.skill);
      const cell = cellByDesc.get(String(s.skilldesc))!;
      const classSlug = classOf[s.charclass as keyof typeof classOf];
      const hasDamage = s.EType !== undefined && s.EType !== "" && s.EMin !== undefined;
      assertPhysicalClassified(slug, s, missileETypeFor(s));
      return {
        slug,
        classSlug,
        tree: treeByClassPage.get(`${classSlug}:${cell.page}`)!,
        page: cell.page,
        row: cell.row,
        column: cell.column,
        requiredLevel: s.reqlevel,
        maxLevel: s.maxlvl ?? 20,
        prerequisites: a.get(slug)!,
        synergies: synergiesFor(s, rowByName),
        missileSynergies: missileSynergiesFor(missilesOf(s), missileByName, slug, rowByName),
        effects: [
          ...(EFFECTS[slug]?.(s) ?? []),
          ...(PUBLISHES_MANA.has(slug)
            ? [{ labelKey: "effectMana", unit: "mana" as const, shape: { kind: "linear" as const, ...manaShape(s, slug) } }]
            : []),
        ],
        conversion: conversionFor(s),
        damage: hasDamage
          ? {
              element: s.EType!,
              hitShift: s.HitShift ?? 8,
              min: { base: s.EMin ?? 0, bands: bands(s, "EMin") },
              max: { base: s.EMax ?? s.EMin ?? 0, bands: bands(s, s.EMax === undefined ? "EMin" : "EMax") },
              duration: duration(s),
            }
          : undefined,
        physical: PUBLISHES_PHYSICAL.has(slug)
          ? {
              hitShift: s.HitShift ?? 8,
              min: { base: num(s, "MinDam"), bands: physBands(s, "MinLevDam") },
              max: { base: num(s, "MaxDam"), bands: physBands(s, "MaxLevDam") },
            }
          : undefined,
      };
    })
    .sort((x, y) =>
      x.classSlug.localeCompare(y.classSlug) || x.page - y.page ||
      x.row - y.row || x.column - y.column,
    );

  /*
   * Every extracted synergy must point at a skill of the same class that we
   * actually publish. A cross-class or unknown target means the slugifier and
   * the game's naming have diverged, and shipping it would render a dead name.
   */
  {
    const byslug = new Map(rows.map((r) => [r.slug, r]));
    for (const r of rows) {
      for (const syn of r.synergies) {
        const target = byslug.get(syn.from);
        if (!target) {
          throw new Error(`${r.slug}: synergy source "${syn.from}" is not an extracted skill`);
        }
        if (target.classSlug !== r.classSlug) {
          throw new Error(
            `${r.slug} (${r.classSlug}) takes a synergy from ${syn.from} (${target.classSlug})`,
          );
        }
      }
    }
    if (rows.every((r) => r.synergies.length === 0)) {
      throw new Error("no synergies were extracted at all; the calc columns must have moved");
    }
  }

  const eff = (list: (typeof rows)[number]["effects"]) =>
    list.length === 0
      ? ""
      : `
    effects: [` +
        list
          .map((e) => {
            const sh = e.shape;
            const body =
              sh.kind === "linear"
                ? `kind: "linear", base: ${sh.base}, perLevel: ${sh.perLevel}${sh.cap === undefined ? "" : `, cap: ${sh.cap}`}`
                : sh.kind === "step"
                  ? `kind: "step", base: ${sh.base}, per: ${sh.per}`
                  : sh.kind === "petmax"
                    ? `kind: "petmax", threshold: ${sh.threshold}, base: ${sh.base}, per: ${sh.per}`
                    : `kind: "range", min: ${sh.min}, max: ${sh.max}`;
            return `{ labelKey: "${e.labelKey}", unit: "${e.unit}", shape: { ${body} } }`;
          })
          .join(", ") +
        `],`;

  const missileSyn = (ms: (typeof rows)[number]["missileSynergies"]) =>
    ms.length === 0
      ? ""
      : `, missileSynergies: [${ms
          .map(
            (m) =>
              `{ from: "${m.from}", missile: "${m.missile}", ` +
              `element: "${m.element}", magnitude: ${m.magnitude} }`,
          )
          .join(", ")}]`;

  const conv = (c: (typeof rows)[number]["conversion"]) =>
    c
      ? `, conversion: { element: "${c.element}", base: ${c.base}, perLevel: ${c.perLevel} }`
      : "";

  const dmg = (d: (typeof rows)[number]["damage"]) =>
    d
      ? `, damage: { element: "${d.element}", hitShift: ${d.hitShift}, ` +
        `min: { base: ${d.min.base}, bands: [${d.min.bands.join(", ")}] }, ` +
        `max: { base: ${d.max.base}, bands: [${d.max.bands.join(", ")}] }` +
        (d.duration
          ? `, duration: { base: ${d.duration.base}, perLevel: ${d.duration.perLevel} }, overTime: true`
          : "") +
        ` }`
      : "";

  const phys = (ph: (typeof rows)[number]["physical"]) =>
    ph
      ? `, physical: { hitShift: ${ph.hitShift}, ` +
        `min: { base: ${ph.min.base}, bands: [${ph.min.bands.join(", ")}] }, ` +
        `max: { base: ${ph.max.base}, bands: [${ph.max.bands.join(", ")}] } }`
      : "";

  const body = rows
    .map(
      (r) =>
        `  "${r.slug}": {\n` +
        `    classSlug: "${r.classSlug}", tree: "${r.tree}", page: ${r.page}, row: ${r.row}, column: ${r.column},\n` +
        `    requiredLevel: ${r.requiredLevel}, maxLevel: ${r.maxLevel},\n` +
        `    prerequisites: [${r.prerequisites.map((p) => `"${p}"`).join(", ")}],\n` +
        `    synergies: [${r.synergies
          .map(
            (s) =>
              `{ from: "${s.from}", kinds: [${s.kinds.map((k) => `"${k}"`).join(", ")}]` +
              `${s.magnitude === undefined ? "" : `, magnitude: ${s.magnitude}`} }`,
          )
          .join(", ")}]${missileSyn(r.missileSynergies)}${dmg(r.damage)}${phys(r.physical)}${conv(r.conversion)},${eff(r.effects)}\n` +
        `  },`,
    )
    .join("\n");

  const disagreeNote = disagree.length ? ` (differs: ${disagree.join(", ")})` : "";

  const header = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with \`npm run gen:skill-graph\` (see scripts/generate-skill-graph.ts).
 *
 * The canonical skill graph for every class in scope: which tree a skill
 * belongs to, what character level unlocks it, and which skills the game
 * requires before it can be allocated.
 *
 * PROVENANCE
 *   Repository  ${SOURCE_REPO}
 *   Commit      ${SOURCE_SHA}
 *               ${SOURCE_DATE} — "${SOURCE_MESSAGE}"
 *   Verified    ${VERIFIED}
 *   Paths       json/${PATHS.current}, json/${PATHS.descs}, json/${PATHS.base}
 *   Baseline    ${BASELINE}
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
 *   Hammer's \`(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8\` with
 *   \`*Param8 Description\` reading "Damage synergy".
 *
 *   Exclusion is per reference, not per skill. Energy Shield reads Telekinesis
 *   under a parameter that sets its mana ratio, and Hydra reads Fire Bolt and
 *   Fire Ball in its summon columns to choose which missile to cast; those
 *   references carry no synergy parameter and produce no edge. Hydra does still
 *   receive a damage synergy from both, declared separately in
 *   \`EDmgSymPerCalc\` — the exclusion covers the summon columns only.
 *
 *   Three synergies are not on a skill row at all. Fist of the Heavens, Meteor
 *   and Immolation Arrow each deal part of their damage through a sub-missile
 *   that carries its own \`EDmgSymPerCalc\`, and \`missileSynergies\` records
 *   those separately — see the field's own comment for why they are not merged
 *   into the list above.
 *
 *   Concentration is not excluded: it never appears as a \`skill()\` reference
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
 *   Extracted   ${rows.length} skills (${Object.values(classOf)
    .map((c) => `${rows.filter((r) => r.classSlug === c).length} ${c}`)
    .join(", ")})
 *
 *   The commit is pinned, not \`master\`. Re-running the generator reproduces
 *   this file exactly, or fails; it never silently follows the source forward.
 *   Moving to a newer extraction means bumping SOURCE_SHA on purpose and
 *   reading the diff as a game change.
 *
 * AGREEMENT
 *   Prerequisite sets identical across the repository's two extractions —
 *   the current D2R tables and the pre-D2R Lord of Destruction tables under
 *   \`json/base/\` — for ${agree} of ${a.size} skills${disagreeNote}.
 *
 *   These are two snapshots of different game versions from one extraction
 *   project, not two independent publishers. Their agreement shows the values
 *   are not an artifact of a single extraction pass, and that these columns did
 *   not change between LoD and D2R. It is not corroboration by an unrelated
 *   party.
 *
 *   It also does not detect a change made in the engine rather than the table,
 *   and agreement is exactly what such a change looks like from here. Patch 2.4
 *   fixed Plague Javelin's poison duration at three seconds; its \`ELen\` and
 *   \`ELevLen\` are byte-identical across both extractions, because nobody edited
 *   them. Reading a high agreement score as "these values are current" is the
 *   mistake this paragraph exists to prevent -- see FIXED_DURATION above for the
 *   override that carries the correction.
 *
 * LICENSING
 *   The repository is MIT licensed, but its contents are extracted from
 *   Blizzard's game files and Blizzard owns the underlying data. Only
 *   mechanical facts are taken here — unlock levels, prerequisite edges, tree
 *   membership — which are not copyrightable. No game text and no game
 *   artwork is extracted: \`str name\`/\`str long\` (Blizzard's prose) and
 *   \`IconCel\` (sprite-sheet indices) are deliberately excluded. See
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
  readonly classSlug: Extract<ClassSlug, ${[...new Set(Object.values(classOf))].sort().map((c) => `"${c}"`).join(" | ")}>;
  /** The site's tree slug, derived from the game's 1-based skill page. */
  readonly tree: Slug;
  /** 1-based skill page, straight from the game data. Independent of \`tree\`. */
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
   * direction. \`synergyReceivers\` in lib/skills.ts derives the reverse.
   *
   * \`kinds\` is what the bonus improves, as the game's own parameter labels
   * name it: damage, armor, healing, duration, freeze. A skill can receive two
   * kinds from one source, which is why this is a list.
   *
   * \`magnitude\` is present only where the game keeps the coefficient on the
   * *source* skill's row — written \`skill('IronGolem'.par8)\` rather than a bare
   * \`par8\` — so the number is a property of what that skill gives and is the
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
   * its own row, and which are therefore invisible to \`synergies\` above.
   *
   * Present on three skills. Fist of the Heavens deals lightning and spawns
   * \`fistoftheheavensbolt\`, a magic missile carrying
   * \`skill('Holy Bolt'.blvl) * 15\`; Meteor's ground fire reads Inferno at 3%;
   * Immolation Arrow's reads Fire Arrow at 5%. In each case hard points in the
   * named skill raise part of what the skill does and nothing on the skill row
   * says so.
   *
   * Kept separate rather than merged into \`synergies\` because the two are not
   * interchangeable to a reader: this bonus applies to one damage component,
   * dealt as \`element\`, and not to the skill's whole output. A page that prints
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
     * \`frames\` is in D2's 25-per-second frames.
     */
    readonly duration?: {
      readonly base: number;
      /** Zero where a patch fixed the duration; see FIXED_DURATION in the generator. */
      readonly perLevel: number;
    };
    /**
     * True when \`duration\` is the window the damage is spread across rather
     * than a status length. Poison spreads; cold's ELen is a freeze length and
     * its damage lands at once, so multiplying it would be a fabrication.
     */
    readonly overTime?: boolean;
  };
  /**
   * Physical damage the skill deals in its own right, alongside \`damage\`
   * rather than instead of it.
   *
   * The Druid's elemental tree is where this earns its keep and why it exists.
   * Tornado and Twister carry nothing but physical -- no \`EType\`, no \`EMin\` --
   * so a graph reading only the elemental columns publishes a damage table of
   * nothing for the class's flagship skill. Armageddon carries both at once,
   * 18-26 physical and 25-75 fire, and the two are separately synergised: it
   * takes its physical from Volcano and its fire from Molten Boulder and
   * Firestorm.
   *
   * Scaled by the same \`hitShift\` as elemental damage, which is not an
   * assumption but a check: Twister's \`MinDam\` of 12 at \`HitShift\` 7 is the
   * 6 the game shows, and Tornado's 25 at 8 is 25.
   *
   * Present only for the skills \`PUBLISHES_PHYSICAL\` names. These columns carry
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
   * Declared by the missile (\`DmgCalc1\` of \`dl12\`), not the skill, which is why
   * it is separate from \`damage\`: Magic Arrow converts and carries no elemental
   * table at all, while Fire Arrow does both. \`base\` and \`perLevel\` are percent.
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
   * \`labelKey\` names a UI dictionary entry rather than carrying text, so a
   * hundred and twenty skills do not turn into a hundred and twenty
   * hand-translated strings for two dozen distinct words.
   *
   * \`range\` is a value whose minimum and maximum the game states and whose
   * curve between them it does not — the Amazon's five passives carry no calc
   * column at all, and the Necromancer's diminishing-return columns (\`dmNN\`)
   * are evaluated in the engine. Anything printed per level for those would be
   * invented.
   *
   * \`unit\` decides rendering, not meaning. \`frames\` is shown as seconds;
   * \`units\` is a bare number in a unit the game does not name, so the label
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
`;

  const out = `${header}${body}\n};\n\n/** Character level thresholds, indexed by tree row. */\nexport const TIER_LEVELS = [1, 6, 12, 18, 24, 30] as const;\n\n/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */\nexport const MAX_HARD_POINTS = 110;\n`;

  const target = join(process.cwd(), "content", "classes", "skill-graph.ts");
  writeFileSync(target, out, "utf8");

  console.log(`wrote ${target}`);
  console.log(`  skills:    ${rows.length}`);
  console.log(`  agreement: ${agree}/${a.size} across the two extractions`);
  console.log(`  damage:    ${rows.filter((r) => r.damage).length} skills carry base damage`);
  const edges = rows.reduce((n, r) => n + r.synergies.length, 0);
  console.log(
    `  synergies: ${edges} edges across ${rows.filter((r) => r.synergies.length).length} receivers`,
  );
  console.log(`  trees:     ${[...treeByClassPage.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
