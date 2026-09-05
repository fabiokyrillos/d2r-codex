import type { ClassAttributes } from "../lib/types";

/**
 * Starting attributes, and the arithmetic that turns the game's table into ours.
 *
 * Separated from `attributes.test.ts` for the same reason `content-rules.ts` and
 * `skill-graph-rules.ts` exist: the rule has to be callable on a deliberately
 * corrupted input, so a planted mutation can prove the gate fires.
 *
 * WHY THIS FILE EXISTS AT ALL
 * ---------------------------
 * Three classes already shipped `attributes` that nobody had checked against a
 * source. Two of the Warlock's values were wrong — `hitPoints` read 60 where
 * the game's table gives 55, and `stamina` read 80 against the table's 86 —
 * and `docs/research/00-game-state.md` had already flagged Warlock starting
 * attributes as unverified. Numbers that look plausible are indistinguishable
 * from numbers that are right until something compares them to a source. This
 * is that something.
 */

/**
 * `charstats.txt`, verbatim, for every class the site publishes attributes for.
 *
 * PROVENANCE
 *   Repository  blizzhackers/d2data
 *   Commit      fc469993502d0498809b9fc1af140ee2a9eb8902
 *               2026-08-21 — "Updated for patch 3.3.93847"
 *   Path        json/charstats.json
 *   Baseline    D2R Patch 3.3 / Ladder Season 15 extraction
 *   Verified    2026-09-01
 *
 * The same pinned commit the skill graph is generated from, so the two cannot
 * describe different versions of the game. Transcribed rather than fetched:
 * `npm run check` must not need the network, and a fixture that is read back
 * from the source it is checking would prove nothing.
 *
 * Only the numeric columns are taken. These are facts about a system and are
 * not copyrightable; no game prose or artwork is reproduced. See
 * docs/sources/README.md.
 */
export interface CharStatsRow {
  readonly str: number;
  readonly dex: number;
  readonly vit: number;
  /** The game's column name for what the UI calls Energy. */
  readonly int: number;
  /** Life granted before Vitality is counted. */
  readonly hpadd: number;
  readonly stamina: number;
  /** The four `Per` columns are stored in quarter-points. */
  readonly LifePerVitality: number;
  readonly ManaPerMagic: number;
  readonly LifePerLevel: number;
  readonly ManaPerLevel: number;
  readonly StaminaPerVitality: number;
}

export const CHARSTATS: Record<string, CharStatsRow> = {
  amazon: {
    str: 20, dex: 25, vit: 20, int: 15, hpadd: 30, stamina: 84,
    LifePerVitality: 12, ManaPerMagic: 6, LifePerLevel: 8, ManaPerLevel: 6,
    StaminaPerVitality: 4,
  },
  paladin: {
    str: 25, dex: 20, vit: 25, int: 15, hpadd: 30, stamina: 89,
    LifePerVitality: 12, ManaPerMagic: 6, LifePerLevel: 8, ManaPerLevel: 6,
    StaminaPerVitality: 4,
  },
  sorceress: {
    str: 10, dex: 25, vit: 10, int: 35, hpadd: 30, stamina: 74,
    LifePerVitality: 8, ManaPerMagic: 8, LifePerLevel: 4, ManaPerLevel: 8,
    StaminaPerVitality: 4,
  },
  warlock: {
    str: 15, dex: 20, vit: 25, int: 20, hpadd: 30, stamina: 86,
    LifePerVitality: 12, ManaPerMagic: 8, LifePerLevel: 8, ManaPerLevel: 6,
    StaminaPerVitality: 4,
  },
  /*
   * The Assassin is the only class in the table whose quarter-point columns do
   * not all divide evenly. `ManaPerMagic: 7` is 1.75 mana per point of Energy
   * and `StaminaPerVitality: 5` is 1.25 stamina per point of Vitality — every
   * other class carries multiples of four in both. A conversion that rounded, or
   * a model typed as integers, would publish 2 and 1 here and be wrong about the
   * only class it could be wrong about.
   */
  assassin: {
    str: 20, dex: 20, vit: 20, int: 25, hpadd: 30, stamina: 95,
    LifePerVitality: 12, ManaPerMagic: 7, LifePerLevel: 8, ManaPerLevel: 6,
    StaminaPerVitality: 5,
  },
};

/**
 * The conversion, stated once.
 *
 * Two rules, and both are the kind that a spot-check of final values would
 * miss:
 *
 *   1. The four `Per` columns are **quarter-points**. `LifePerVitality: 12`
 *      is three life per point of Vitality, not twelve. Publishing the raw
 *      column would overstate every one of them fourfold.
 *   2. `hpadd` is life *before* Vitality. The character sheet's starting Life
 *      is `hpadd + vit`, which is why no column in the table holds it.
 *
 * Checking outputs alone cannot distinguish a right answer from a lucky one.
 * The test asserts this function against the table, so the rule is what is
 * under test and the values fall out of it.
 */
export function attributesFrom(row: CharStatsRow): ClassAttributes {
  const quarters = (value: number) => value / 4;
  return {
    strength: row.str,
    dexterity: row.dex,
    vitality: row.vit,
    energy: row.int,
    hitPoints: row.hpadd + row.vit,
    stamina: row.stamina,
    mana: row.int,
    lifePerVitality: quarters(row.LifePerVitality),
    manaPerEnergy: quarters(row.ManaPerMagic),
    lifePerLevel: quarters(row.LifePerLevel),
    manaPerLevel: quarters(row.ManaPerLevel),
    staminaPerVitality: quarters(row.StaminaPerVitality),
  };
}

/** Field-by-field comparison, so a failure names the field rather than the class. */
export function attributeDrift(
  authored: ClassAttributes,
  derived: ClassAttributes,
): string[] {
  const keys = Object.keys(derived) as (keyof ClassAttributes)[];
  return keys
    .filter((key) => authored[key] !== derived[key])
    .map((key) => `${key}: authored ${authored[key]}, game data gives ${derived[key]}`);
}
