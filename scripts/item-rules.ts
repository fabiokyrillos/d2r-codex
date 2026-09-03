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
  /*
   * Bone carries both striking triggers with the SAME numbers in each — 15 and
   * 10 — which is the one shape where a swap is invisible in the output. It is
   * included precisely because the proc rule cannot catch it: what catches it
   * is the value control below, which asserts the numbers against the columns.
   */
  { kind: "runeword", slug: "bone", column: "hit-skill", skill: "Bone Spear", chance: 15, level: 10 },
  {
    kind: "runeword",
    slug: "bone",
    column: "gethit-skill",
    skill: "Bone Armor",
    chance: 15,
    level: 10,
  },
];

// ---------------------------------------------------------------------------
// Charges, skill tabs, and rune composition
// ---------------------------------------------------------------------------

/*
 * Three more columns whose argument order or semantics is easy to invert, added
 * by the Necromancer build pass because its six new entities exercise all
 * three at once.
 *
 * Each control set is calibrated the way `docs/sources/README.md` says the item
 * decoder should have been: it contains entities that were **already published
 * correctly** before this pass alongside the new ones. If a rule only ever saw
 * the entries added with it, it would be agreeing with its author rather than
 * with the game.
 */

export interface ColumnProblem {
  rule:
    | "charge-line-missing"
    | "charge-line-swapped"
    | "skilltab-line-missing"
    | "skilltab-read-as-skill"
    | "skilltab-collapsed"
    | "rune-mod-absent"
    | "column-entity-missing";
  message: string;
}

/**
 * A `charged` property: `min` is the number of charges and `max` is the skill
 * level. Exactly the reverse of what the name ordering suggests, and the same
 * inversion that produced Thunderstroke's published "14% chance of level 20".
 */
export interface ChargeSpec {
  slug: string;
  skill: string;
  charges: number;
  level: number;
}

export function chargeLine(spec: Pick<ChargeSpec, "skill" | "charges" | "level">): string {
  return `Level ${spec.level} ${spec.skill} (${spec.charges}`;
}

export function swappedChargeLine(spec: Pick<ChargeSpec, "skill" | "charges" | "level">): string {
  return chargeLine({ ...spec, charges: spec.level, level: spec.charges });
}

/**
 * Skill tabs. `par` is an index into the game's global list of skill **trees**,
 * not a skill id, and the two ranges overlap — Necromancer tabs are 6, 7 and 8,
 * and skill ids 6, 7 and 8 are three Amazon skills. Reading one as the other
 * produces a plausible line naming the wrong thing entirely.
 *
 * `min`/`max` is the level range, so a tab line can legitimately be variable.
 */
export const NECROMANCER_SKILL_TABS: Readonly<Record<number, string>> = {
  6: "Curses",
  7: "Poison and Bone Skills",
  8: "Summoning Skills",
};

export interface SkillTabSpec {
  kind: "unique" | "runeword";
  slug: string;
  /** The `par` column, as a tab index. */
  tab: number;
  tabName: string;
  min: number;
  max: number;
}

export function skillTabLine(spec: Pick<SkillTabSpec, "tabName" | "min" | "max">): string {
  const amount = spec.min === spec.max ? `+${spec.min}` : `+${spec.min}-${spec.max}`;
  return `${amount} to ${spec.tabName}`;
}

export function checkChargeLines(
  entities: readonly ProcEntity[],
  specs: readonly ChargeSpec[],
): ColumnProblem[] {
  const found: ColumnProblem[] = [];
  const bySlug = new Map(entities.map((e) => [e.slug, e]));
  for (const spec of specs) {
    const entity = bySlug.get(spec.slug);
    if (!entity) {
      found.push({
        rule: "column-entity-missing",
        message: `${spec.slug}: named as a charge control but is not in the catalogue.`,
      });
      continue;
    }
    const lines = entity.stats.map((s) => s.text);
    const expected = chargeLine(spec);
    const swapped = swappedChargeLine(spec);
    if (swapped !== expected && lines.some((l) => l.startsWith(swapped))) {
      found.push({
        rule: "charge-line-swapped",
        message:
          `${entity.name}: publishes "${swapped}…". The extraction gives charged ` +
          `par=${spec.skill} min=${spec.charges} max=${spec.level}, and min is the charge count ` +
          `while max is the skill level — so the line begins "${expected}…".`,
      });
      continue;
    }
    if (!lines.some((l) => l.startsWith(expected))) {
      found.push({
        rule: "charge-line-missing",
        message:
          `${entity.name}: publishes no line beginning "${expected}…", which the extraction gives ` +
          `as charged par=${spec.skill} min=${spec.charges} max=${spec.level}.`,
      });
    }
  }
  return found;
}

/**
 * Every skill-tab control must appear, must not have been read as a skill id,
 * and — where an entity carries more than one — must not have been merged.
 *
 * The merge case is Arm of King Leoric, which grants two different tabs from
 * two different `skilltab` properties. Collapsing them to one line is not a
 * typo a reader can spot: "+2 to Summoning Skills" alone looks complete.
 */
export function checkSkillTabLines(
  entities: readonly ProcEntity[],
  specs: readonly SkillTabSpec[],
  tabNames: Readonly<Record<number, string>>,
): ColumnProblem[] {
  const found: ColumnProblem[] = [];
  const bySlug = new Map(entities.map((e) => [e.slug, e]));
  const perEntity = new Map<string, SkillTabSpec[]>();
  for (const spec of specs) {
    perEntity.set(spec.slug, [...(perEntity.get(spec.slug) ?? []), spec]);
  }

  for (const [slug, group] of perEntity) {
    const entity = bySlug.get(slug);
    if (!entity) {
      found.push({
        rule: "column-entity-missing",
        message: `${slug}: named as a skill-tab control but is not in the catalogue.`,
      });
      continue;
    }
    const lines = entity.stats.map((s) => s.text);
    for (const spec of group) {
      if (spec.tabName !== tabNames[spec.tab]) {
        found.push({
          rule: "skilltab-read-as-skill",
          message:
            `${entity.name}: control names tab ${spec.tab} "${spec.tabName}", and the tab index ` +
            `maps to "${tabNames[spec.tab]}". \`par\` is a tree index, not a skill id.`,
        });
        continue;
      }
      if (!lines.some((l) => l.includes(skillTabLine(spec)))) {
        found.push({
          rule: "skilltab-line-missing",
          message:
            `${entity.name}: publishes no "${skillTabLine(spec)}" line. The extraction gives ` +
            `skilltab par=${spec.tab} min=${spec.min} max=${spec.max}.`,
        });
      }
    }
    if (group.length > 1) {
      const distinct = new Set(
        group.map((spec) => lines.findIndex((l) => l.includes(skillTabLine(spec)))),
      );
      distinct.delete(-1);
      if (distinct.size < group.length) {
        found.push({
          rule: "skilltab-collapsed",
          message:
            `${entity.name}: carries ${group.length} skill-tab properties and publishes fewer ` +
            `than ${group.length} distinct lines for them. Two tabs are two lines; merging them ` +
            `hides one whole tree.`,
        });
      }
    }
  }
  return found;
}

/**
 * The composition rule, made checkable.
 *
 * `docs/sources/README.md`: "A runeword's displayed stat block is the
 * runeword's own properties **plus** each constituent rune's mod for that item
 * type." Faith is the recorded case — the table gives +280% Enhanced Damage and
 * this site publishes +330%, because Ohm's weapon mod supplies the other fifty.
 *
 * Rune mods are rarely the headline, which is exactly why they are the part a
 * later author transcribing a database listing drops. Each control names one
 * runeword, one rune and the line that rune contributes.
 */
export interface RuneModSpec {
  slug: string;
  rune: string;
  /** The published line, or a distinctive fragment of it. */
  contributes: string;
}

export function checkRuneComposition(
  entities: readonly ProcEntity[],
  specs: readonly RuneModSpec[],
): ColumnProblem[] {
  const found: ColumnProblem[] = [];
  const bySlug = new Map(entities.map((e) => [e.slug, e]));
  for (const spec of specs) {
    const entity = bySlug.get(spec.slug);
    if (!entity) {
      found.push({
        rule: "column-entity-missing",
        message: `${spec.slug}: named as a rune-composition control but is not in the catalogue.`,
      });
      continue;
    }
    if (entity.stats.some((s) => s.text.includes(spec.contributes))) continue;
    found.push({
      rule: "rune-mod-absent",
      message:
        `${entity.name}: publishes no "${spec.contributes}" line, which ${spec.rune} contributes ` +
        `for this item type. A runeword's stat block is its own properties plus each rune's mod, ` +
        `and a database listing that omits the rune half is the usual source of this.`,
    });
  }
  return found;
}

/** Charge lines, half of them published before this pass and half added by it. */
export const CHARGE_CONTROLS: readonly ChargeSpec[] = [
  // Already published, and the reason the rule is not merely agreeing with itself.
  { slug: "andariels-visage", skill: "Venom", charges: 20, level: 3 },
  { slug: "arachnid-mesh", skill: "Venom", charges: 11, level: 3 },
];

/**
 * Skill tabs. Thunderstroke is the calibration entry — already published, and a
 * variable range rather than a flat value, so the rule has to read `min`/`max`
 * as levels rather than as anything else.
 */
export const SKILL_TAB_CONTROLS: readonly SkillTabSpec[] = [
  {
    kind: "unique",
    slug: "thunderstroke",
    tab: 2,
    tabName: "Javelin and Spear Skills",
    min: 2,
    max: 4,
  },
  { kind: "runeword", slug: "white", tab: 7, tabName: "Poison and Bone Skills", min: 3, max: 3 },
];

/** Tab indices for every class whose items are controlled here. */
export const SKILL_TABS: Readonly<Record<number, string>> = {
  2: "Javelin and Spear Skills",
  ...NECROMANCER_SKILL_TABS,
};

export const RUNE_MOD_CONTROLS: readonly RuneModSpec[] = [
  // The recorded case, from the Amazon pass: Ohm's weapon mod is 50 of Faith's 330.
  { slug: "faith", rune: "Ohm", contributes: "+330% Enhanced Damage" },
  // The three added by this pass, one per item type the rune table distinguishes.
  { slug: "white", rune: "Dol", contributes: "Hit Causes Monster to Flee 25%" },
  { slug: "white", rune: "Io", contributes: "+10 to Vitality" },
  { slug: "splendor", rune: "Eth", contributes: "Regenerate Mana 15%" },
  { slug: "splendor", rune: "Lum", contributes: "+10 to Energy" },
  { slug: "bone", rune: "Sol", contributes: "Damage Reduced by 7" },
  // Two Um armor mods at +15 each, published as one +30 line rather than twice.
  { slug: "bone", rune: "Um (x2)", contributes: "All Resistances +30" },
];
