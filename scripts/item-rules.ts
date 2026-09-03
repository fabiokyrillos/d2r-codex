/**
 * Cast-on-X lines, checked against the Tier 1 columns they were decoded from.
 *
 * This file exists because of one shipped error. Thunderstroke published
 * "14% Chance to cast level 20 Lightning on striking" where the extraction says
 * `hit-skill par=Lightning min=20 max=14` — chance and level the wrong way
 * round. Nothing caught it, and the reason is worth writing down: the decoder
 * used for the Amazon pass was calibrated against Harlequin Crest, Raven Frost,
 * Highlord's Wrath and Demon Machine, and **not one of those four carries a
 * cast-on-striking line**. The column's argument order was never exercised.
 *
 * So the fix is not "be more careful". It is to pin the column order to
 * entities whose values are independently known, in a rule that fails when a
 * published line stops matching. `min` is the chance and `max` is the level, in
 * `hit-skill`, `gethit-skill` and `levelup-skill` alike.
 *
 * Deliberately a control set rather than a decoder. The site has no reproducible
 * item generator — `docs/sources/README.md` says so plainly — and writing one is
 * a larger job than this. What this does is make the specific class of mistake
 * that got through impossible to reintroduce quietly, on entities chosen because
 * their real values are not in dispute.
 *
 * Pure, and takes its inputs as arguments, for the same reason
 * `amazon-rules.ts` does: the tests hand it deliberately corrupted ones.
 */

export interface ProcProblem {
  rule: "proc-line-missing" | "proc-line-swapped" | "proc-line-unaccounted" | "proc-entity-missing";
  message: string;
}

/** The three triggers the extraction distinguishes, and how the site says them. */
export const PROC_TRIGGERS = {
  "hit-skill": "on striking",
  "gethit-skill": "when struck",
  "levelup-skill": "when you Level-Up",
} as const;

export type ProcColumn = keyof typeof PROC_TRIGGERS;

export interface ProcSpec {
  /** Which catalogue the entity is in. Reported, not resolved. */
  kind: "unique" | "runeword";
  slug: string;
  column: ProcColumn;
  /** The `par` column: the skill cast. */
  skill: string;
  /** The `min` column. A percentage. */
  chance: number;
  /** The `max` column. A skill level. */
  level: number;
}

/** The one true rendering of a proc line. Both the rule and its tests use it. */
export function procLine(spec: Pick<ProcSpec, "column" | "skill" | "chance" | "level">): string {
  return `${spec.chance}% Chance to cast level ${spec.level} ${spec.skill} ${PROC_TRIGGERS[spec.column]}`;
}

/** The same line with chance and level exchanged — the regression, by name. */
export function swappedProcLine(
  spec: Pick<ProcSpec, "column" | "skill" | "chance" | "level">,
): string {
  return procLine({ ...spec, chance: spec.level, level: spec.chance });
}

/** Any stat line that claims a proc, whatever its numbers. */
const CLAIMS_A_PROC = /Chance to cast level/i;

export interface ProcEntity {
  slug: string;
  name: string;
  stats: readonly { text: string }[];
}

/**
 * @param entities the catalogue to check, already narrowed to one `kind`
 * @param specs    the controls for that kind
 *
 * Three failures, kept apart because they mean different things, and arranged
 * so that one defect produces one message. A **swapped** line is the regression
 * this file is named after. A **missing** line is a control whose value moved in
 * some other way — a changed trigger, a changed skill, a deleted line. An
 * **unaccounted** line is a proc for a skill no control covers, which is how the
 * next uncalibrated column would arrive.
 *
 * The last of those is keyed on the skill rather than on the whole string. A
 * mangled line for a skill that *is* controlled has already been reported by one
 * of the first two rules; reporting it again as "unfamiliar" would bury the
 * message that says what actually went wrong.
 */
export function checkProcLines(
  entities: readonly ProcEntity[],
  specs: readonly ProcSpec[],
): ProcProblem[] {
  const found: ProcProblem[] = [];
  const bySlug = new Map(entities.map((e) => [e.slug, e]));

  for (const spec of specs) {
    const entity = bySlug.get(spec.slug);
    if (!entity) {
      found.push({
        rule: "proc-entity-missing",
        message: `${spec.slug}: named as a proc control but is not in the ${spec.kind} catalogue.`,
      });
      continue;
    }
    const lines = entity.stats.map((s) => s.text);
    const expected = procLine(spec);
    const swapped = swappedProcLine(spec);

    if (swapped !== expected && lines.includes(swapped)) {
      found.push({
        rule: "proc-line-swapped",
        message:
          `${entity.name}: publishes "${swapped}". The extraction gives ` +
          `${spec.column} par=${spec.skill} min=${spec.chance} max=${spec.level}, and min is the ` +
          `chance while max is the level — so the line is "${expected}".`,
      });
      continue;
    }
    if (!lines.includes(expected)) {
      found.push({
        rule: "proc-line-missing",
        message: `${entity.name}: does not publish "${expected}". Its lines are [${lines.join(" | ")}].`,
      });
    }
  }

  // A proc for a skill no control covers, on an entity that has controls.
  for (const slug of new Set(specs.map((s) => s.slug))) {
    const entity = bySlug.get(slug);
    if (!entity) continue;
    const covered = specs.filter((s) => s.slug === slug).map((s) => s.skill);
    for (const line of entity.stats.map((s) => s.text)) {
      if (!CLAIMS_A_PROC.test(line)) continue;
      if (covered.some((skill) => line.includes(skill))) continue;
      found.push({
        rule: "proc-line-unaccounted",
        message:
          `${entity.name}: publishes "${line}", and no control covers that skill. ` +
          `Add its Tier 1 columns to the control set or remove the line.`,
      });
    }
  }
  return found;
}

/**
 * The controls, read off `uniqueitems.json` and `runes.json` at the pinned
 * commit `fc46999`.
 *
 * Chosen because each one's real value is independently well known, and between
 * them they cover all three trigger columns and both catalogues. Atma's Scarab
 * and Thundergod's Vigor were already published correctly before the audit;
 * they are here to prove the rule reads the column order rather than merely
 * agreeing with whatever Thunderstroke happens to say.
 */
export const UNIQUE_PROC_CONTROLS: readonly ProcSpec[] = [
  // The one that was wrong. min=20 is the chance, max=14 is the level.
  {
    kind: "unique",
    slug: "thunderstroke",
    column: "hit-skill",
    skill: "Lightning",
    chance: 20,
    level: 14,
  },
  // Already right: a small chance of a low-level cast, so a swap is obvious.
  {
    kind: "unique",
    slug: "atmas-scarab",
    column: "hit-skill",
    skill: "Amplify Damage",
    chance: 5,
    level: 2,
  },
  // Already right, and the only `gethit-skill` in the Amazon catalogue.
  {
    kind: "unique",
    slug: "thundergods-vigor",
    column: "gethit-skill",
    skill: "Fist of the Heavens",
    chance: 5,
    level: 7,
  },
];

export const RUNEWORD_PROC_CONTROLS: readonly ProcSpec[] = [
  // Peace carries one of each of the two striking triggers, with numbers far
  // enough apart that a swap could not be mistaken for a rounding difference.
  { kind: "runeword", slug: "peace", column: "hit-skill", skill: "Valkyrie", chance: 2, level: 15 },
  {
    kind: "runeword",
    slug: "peace",
    column: "gethit-skill",
    skill: "Slow Missiles",
    chance: 4,
    level: 5,
  },
  // Ice holds the site's only `levelup-skill`, and its 100/40 is the case where
  // a swap would still look plausible to a reader.
  {
    kind: "runeword",
    slug: "ice",
    column: "hit-skill",
    skill: "Frost Nova",
    chance: 25,
    level: 22,
  },
  {
    kind: "runeword",
    slug: "ice",
    column: "levelup-skill",
    skill: "Blizzard",
    chance: 100,
    level: 40,
  },
  // Wrath's Decrepify is the inverse shape of Thunderstroke's: a high chance of
  // a level 1 cast. Swapped, it would read as a plausible 1% of level 30.
  { kind: "runeword", slug: "wrath", column: "hit-skill", skill: "Decrepify", chance: 30, level: 1 },
  { kind: "runeword", slug: "wrath", column: "hit-skill", skill: "Life Tap", chance: 5, level: 10 },
];
