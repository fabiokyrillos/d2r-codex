/**
 * The rules that validate the skill graph, as pure functions.
 *
 * Separate from `check-content.ts` because that script runs every check at
 * module scope: importing it to test one rule would execute all of them. These
 * take their inputs as arguments precisely so `check-content.test.ts` can hand
 * them a deliberately corrupted graph and prove each rule fires.
 *
 * Nothing here reads the real content. The caller supplies it.
 */
import type { Build, Skill, Slug } from "../lib/types";
import { MAX_HARD_POINTS, TIER_LEVELS, type SkillGraphNode } from "../content/classes/skill-graph";

/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */
// Re-exported so the checker and its tests share one definition with the
// generated graph rather than keeping a second copy in sync by hand.
export { MAX_HARD_POINTS, TIER_LEVELS };

/**
 * Skills whose public identity is not their identifier in the game's tables.
 *
 * The extraction uses the `skill` column as an identifier and slugifies it,
 * which has been the same as the public name for every skill so far. The Amazon
 * breaks that: her decoy is `Dopplezon` in skills.txt and **Decoy** everywhere a
 * player ever sees it -- in the game's own UI, in every database and in every
 * guide. Slugifying the identifier would publish `/classes/amazon/skills/
 * dopplezon`, a URL naming something no reader has heard of.
 *
 * So the mapping is explicit, tiny, and one-directional. The internal
 * identifier stays the join key against the raw rows -- prerequisites and
 * synergy expressions still reference `Dopplezon`, and they resolve through
 * this table like everything else -- while nothing public carries it. Adding an
 * entry is a deliberate act with a reason; the generator does not guess, and
 * `skill-page.test.ts` asserts no override's identifier reaches a page, a URL
 * or the sitemap.
 */
export const SLUG_OVERRIDES: Record<string, string> = {
  Dopplezon: "decoy",
  /*
   * The Necromancer's three named golems. `Clay Golem` is spelled with a space
   * in the tables and the other three are not, which is an artifact of how the
   * rows were typed rather than anything a player sees: the game's own UI, every
   * database and every guide call them Blood Golem, Iron Golem and Fire Golem.
   * Slugifying the identifier would publish `/classes/necromancer/skills/
   * bloodgolem`.
   *
   * The identifiers stay the join key — Clay Golem's `passivecalc4` reads
   * `skill('IronGolem'.blvl)` and resolves through this table like everything
   * else — and `skill-page.test.ts` asserts none of them reaches a page, a URL
   * or the sitemap.
   */
  BloodGolem: "blood-golem",
  IronGolem: "iron-golem",
  FireGolem: "fire-golem",
  /*
   * The Druid, where the gap between identifier and name is widest of any class
   * in the game. Eight of his thirty rows are named one thing in `skills.txt`
   * and another everywhere a player looks — the skill window, every database,
   * every guide. `Wearwolf` and `Wearbear` are misspellings that survived
   * twenty-five years in the table and were never shown to anyone; `Plague
   * Poppy`, `Cycle of Life`, `Vines`, `Summon Fenris`, `Shape Shifting` and
   * `Eruption` are working titles the shipped game replaced.
   *
   * Each is pinned by its own row rather than by resemblance, which is what
   * makes the mapping checkable instead of a guess:
   *
   *   Plague Poppy    page 1, level 1, `pettype = vine`, poison damage over
   *                   100 frames -> Poison Creeper
   *   Cycle of Life   page 1, level 12, requires Plague Poppy, life steal
   *                   4% + 1% per level -> Carrion Vine
   *   Vines           page 1, level 24, requires Cycle of Life, mana steal
   *                   4% + 1% per level -> Solar Creeper
   *   Summon Fenris   page 1, level 18, `petmax = min(lvl, par3)` with par3 = 3
   *                   -> Summon Dire Wolf
   *   Wearwolf        page 2, level 1 -> Werewolf
   *   Shape Shifting  page 2, level 1, requires Wearwolf, no mana cost, grants
   *                   form duration and life -> Lycanthropy
   *   Wearbear        page 2, level 6 -> Werebear
   *   Eruption        page 3, level 12, requires Molten Boulder -> Fissure
   *
   * The identifiers stay the join key -- Rabies reads
   * `skill('Plague Poppy'.blvl)` and Twister reads `skill('Arctic Blast'.blvl)`,
   * and both resolve through this table -- while nothing public carries them.
   * `skill-page.test.ts` asserts no override's identifier reaches a page, a URL
   * or the sitemap.
   */
  "Plague Poppy": "poison-creeper",
  "Cycle of Life": "carrion-vine",
  Vines: "solar-creeper",
  "Summon Fenris": "summon-dire-wolf",
  Wearwolf: "werewolf",
  "Shape Shifting": "lycanthropy",
  Wearbear: "werebear",
  Eruption: "fissure",
};

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The single place a game identifier becomes a published slug. */
export const slugFor = (name: string) => SLUG_OVERRIDES[name] ?? slugify(name);

/**
 * The ceiling in a `min(expression, N)` calc column.
 *
 * Multiple Shot's arrow count was published with `cap: 24` written into the
 * generator by hand, above a comment quoting the column it came from. The number
 * was right and the provenance was a comment, which is the arrangement this
 * repository does not otherwise accept: re-pinning `SOURCE_SHA` would have moved
 * every other value in the graph and left this one behind, silently, still
 * claiming to be extracted.
 *
 * So it is read. The game gives Multiple Shot `calc1 = "min(ln12,24)"` — `ln12`
 * being "Param1 plus Param2 per level", the base and slope this already reads —
 * and the cap is the literal beside it.
 *
 * **Only a literal.** Strafe's calc1 is `min(par3 + lvl - 1, par4)`, whose cap is
 * a parameter rather than a number; that skill reads `Param4` directly and does
 * not come through here. A column of that shape therefore fails rather than
 * being quietly accommodated, because the two cases want different code and
 * guessing which one a new skill meant is how a wrong cap ships.
 *
 * @param raw   the calc column, as the extraction gives it — quoted or not
 * @param where the skill and column, for the error a broken assumption raises
 */
export function capFromMinCalc(raw: unknown, where: string): number {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(
      `${where}: the column is missing or empty, and the cap this effect publishes is read from it. ` +
        `Either the extraction moved or this skill no longer caps its count.`,
    );
  }
  // The extraction quotes its expressions; the quotes are part of the value.
  const expression = raw
    .trim()
    .replace(/^"([\s\S]*)"$/, "$1")
    .replace(/\s+/g, "");
  const match = expression.match(/^min\(([^(),]+),(\d+)\)$/);
  if (!match) {
    throw new Error(
      `${where}: reads "${expression}", which is not the min(expression, literal) shape a cap is ` +
        `read from. A cap held in a parameter — Strafe's min(par3+lvl-1,par4) — is read from that ` +
        `parameter instead; wire it up deliberately rather than widening this.`,
    );
  }
  return Number(match[2]);
}

/**
 * Synergies, read out of the game's own formulas.
 *
 * A skill's calc columns are expressions. Where one references another skill's
 * base level, `skill('Vigor'.blvl)`, that contribution is scaled by a `parN`,
 * and the matching `*ParamN Description` says what the parameter is for. The
 * game labels the synergy parameters itself:
 *
 *   Blessed Hammer  EDmgSymPerCalc  "(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8"
 *                   *Param8 Description  "Damage synergy"
 *
 * So the rule is not a guess and not community consensus: an edge exists when
 * the referenced skill's contribution is governed by a parameter the game calls
 * a synergy.
 *
 * Exclusion is per *reference*, not per skill — a distinction worth stating,
 * because the same pair of skills can appear in two columns meaning two things:
 *
 *   Energy Shield reads Telekinesis in `calc2`, under par5, "Mana consumed per
 *   HP damage (in sixteenths)". That is a mana ratio. No edge, and Energy
 *   Shield receives no synergy anywhere else either.
 *
 *   Hydra reads Fire Bolt and Fire Ball in `sumsk2calc`/`sumsk3calc` with no
 *   parameter at all: those columns choose which missile to summon, and those
 *   two references are dropped. Hydra does still *receive* a damage synergy
 *   from both, because `EDmgSymPerCalc` references them again under par8,
 *   "Damage synergy". Both edges are in the graph. Only the summon columns are
 *   excluded.
 *
 * Concentration is a different case again, and is not excluded at all: it never
 * appears as a `skill()` reference anywhere in the extracted rows. Its boost
 * reaches Blessed Hammer through the aura state, and the only trace of it in
 * Blessed Hammer's row is `*Param1 Description`, "Damage % from Concentration
 * (in 8ths)" — a parameter description with no skill reference for it to
 * govern. There is nothing here for the rule to reject; an aura that does not
 * express itself as a formula reference is simply never a candidate.
 *
 * WHO OWNS THE PARAMETER
 * ----------------------
 * `parN` inside an expression is not always the *receiver's* parameter, and
 * reading it as though it always were is a directional bug rather than a
 * cosmetic one. Two shapes exist:
 *
 *   (skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8      receiver-owned
 *   skill('IronGolem'.blvl)*skill('IronGolem'.par8)           source-owned
 *
 * In the second shape the description *and* the value live on Iron Golem's row.
 * Clay Golem's own `*Param8 Description` reads "Clay Golem Attack Rating
 * synergy" — what Clay Golem *gives* — so a rule that reads the receiver's row
 * would have labelled the bonus Clay Golem receives from the Iron Golem as an
 * attack-rating synergy when the game calls it armour, and taken 20 as its
 * magnitude when the game says 35. It would in fact have thrown on the unknown
 * label, which is the only reason it was not published quietly.
 *
 * So each `parN` is attributed to its owner before its description is read, and
 * the owner's row supplies both the kind and the number.
 */
const SYNERGY_KINDS: Record<string, string> = {
  damage: "damage",
  armor: "armor",
  healing: "healing",
  "buff duration": "duration",
  "freeze length": "freeze",
  // The Valkyrie's life scales with hard points in Decoy. First non-damage,
  // non-duration synergy in the extraction, and the reason this table throws on
  // an unknown label rather than defaulting: silently calling it "damage" would
  // have put a life bonus in a damage sentence.
  "hp %": "hp",
  // Bone Armor, whose absorbed-damage pool is raised by Bone Wall and Bone
  // Prison. Not "armor": defence and a flat absorb pool are different stats, and
  // the game names them differently.
  "damage absorbed": "absorb",
  /*
   * The golem ring. Four source-owned parameters, each naming the skill that
   * owns it, so the label carries the golem's name as well as the stat. Left
   * spelled out rather than normalised by stripping a leading skill name: the
   * whole point of this table is that an unrecognised label stops the generator,
   * and a normaliser clever enough to fold these four is clever enough to fold
   * something it should have refused.
   */
  "clay golem attack rating": "attack-rating",
  "blood golem hp %": "hp",
  "iron golem armor": "armor",
  "fire golem damage %": "damage",
  /*
   * The Druid's elemental tree, where one source can raise two different
   * damages on the same receiver. Molten Boulder deals physical and fire at
   * once and is fed by Volcano under "Physical Damage synergy" and by Firestorm
   * under "Fire Damage synergy"; Armageddon and Volcano are the same shape.
   *
   * Kept apart from the bare "damage" above rather than folded into it. An edge
   * that says only "damage" on a skill dealing two of them tells the reader to
   * invest and does not say in what, and on this tree that is the whole
   * question: a Wind Druid's Tornado wants physical, a Fire Druid's Armageddon
   * wants both, and the two answers point at different skills.
   */
  "physical damage": "physical",
  "fire damage": "fire",
  /*
   * Hurricane and Armageddon hold their form 50 frames longer per hard point in
   * Cyclone Armor and Fissure respectively, and Twister's stun grows with
   * Arctic Blast. The game writes this one "Duration synergy" and the Paladin's
   * "Buff duration synergy" already maps to the same kind; both are a length of
   * time a thing lasts.
   */
  duration: "duration",
};

/**
 * Skills whose synergy-labelled parameter governs a *soft* level reference.
 *
 * A synergy in this game reads `blvl`, the hard-point level: gear that grants
 * +skills does not feed one. Revive is labelled like a synergy and does not
 * behave like one — Skeleton Mastery reaches it through `skill('Skeleton
 * Mastery'.lvl)`, the effective level, so +skills raise it. The game's own
 * parameter names say "Revive Synergy HP % per level"; its formula says
 * otherwise, and the formula is what runs.
 *
 * Listing it here is what keeps that a decision instead of an accident. An
 * expression carrying a synergy-labelled parameter and no `blvl` reference stops
 * the generator unless the skill is named here, so the same shape arriving with
 * the Druid — Spirit Wolf, Fenris and Grizzly all read each other's `lvl` under
 * parameters marked "(also used for synergy)" — has to be looked at rather than
 * dropped in silence.
 *
 * These relationships are real and are explained in prose on the skill pages.
 * What they are not is an edge in a graph whose whole meaning is "hard points
 * here raise that number".
 */
const SOFT_LEVEL_SYNERGIES = new Set<string>([
  "Revive",
  /*
   * The Druid's three animal summons, which is the case the paragraph above
   * anticipated. Each reads the other two through `lvl` rather than `blvl`:
   * Summon Dire Wolf raises the Spirit Wolf's life by its own *effective*
   * level, the Grizzly raises both wolves' damage the same way, and the Spirit
   * Wolf feeds attack rating and defence back. A Ravenlore that grants +3 to
   * Summoning skills therefore does raise these bonuses, which is exactly what
   * a synergy does not do.
   *
   * So they are relationships, and they are on the skill pages in prose. They
   * are not edges in a graph whose meaning is "hard points here raise that
   * number", and drawing them as such would tell a reader to spend points that
   * a +skills item would have bought more cheaply.
   */
  "Summon Spirit Wolf",
  "Summon Fenris",
  "Summon Grizzly",
]);

const SKILL_REF = /skill\('([^']+)'\.blvl\)/g;
/** `skill('X'.parN)` — a parameter belonging to another skill's row. */
const DONOR_PAR_REF = /skill\('([^']+)'\.par(\d+)\)/g;
const PAR_REF = /par(\d+)/g;

/**
 * One row of `skills.json`, as far as this rule cares.
 *
 * Structural rather than the generator's full `RawSkill`, so a test can hand
 * `synergiesFor` two hand-written rows without inventing the twenty columns it
 * never reads.
 */
export type SkillRow = { skill: string } & Record<string, unknown>;

/** One parameter the game describes as a synergy, and the row it came from. */
interface GoverningParam {
  /** The game identifier of the skill whose row carries the parameter. */
  owner: string;
  index: number;
  described: string;
  value: number;
}

export interface ExtractedSynergy {
  from: string;
  kinds: string[];
  /**
   * Present only where the game keeps the coefficient on the *source* skill's
   * row, so the number is a property of what that skill gives. A receiver-owned
   * coefficient — Blessed Hammer's `par8`, governing a sum of several sources —
   * is a property of the receiver instead and is left to the authored prose,
   * where seventeen edges already carry one. See docs/sources/README.md.
   */
  magnitude?: number;
}

export function synergiesFor(
  row: SkillRow,
  rowByName: ReadonlyMap<string, SkillRow>,
): ExtractedSynergy[] {
  const me = row.skill;
  const found = new Map<string, { kinds: Set<string>; magnitude?: number }>();

  // Every string field, not a chosen list: synergies are expressed in
  // EDmgSymPerCalc, ELenSymPerCalc, auralencalc and the numbered calcN columns,
  // and it is the parameter's description — not the column's name — that says
  // whether a reference is a synergy.
  for (const value of Object.values(row)) {
    if (typeof value !== "string" || !value.includes("skill(")) continue;

    const allRefs = [...value.matchAll(SKILL_REF)].map((m) => m[1]);
    const refs = allRefs.filter((n) => n !== me);

    /*
     * Every parameter this expression uses, attributed to its owner. Donor
     * references are consumed first and removed, so what remains for the bare
     * `parN` scan is exactly the receiver's own parameters — otherwise
     * `skill('IronGolem'.par8)` would be counted twice, once correctly and once
     * as though the receiver had written `par8` itself.
     */
    const governing: GoverningParam[] = [];
    const readParam = (owner: string, index: number) => {
      const ownerRow = owner === me ? row : rowByName.get(owner);
      if (!ownerRow) {
        throw new Error(
          `${me}: reads Param${index} of "${owner}", which is not a skill in the extraction. ` +
            `Either the identifier changed upstream or the reference is to a row this ` +
            `generator does not load.`,
        );
      }
      const described = ownerRow[`*Param${index} Description`];
      if (typeof described !== "string" || !/synerg/i.test(described)) {
        // Not a synergy parameter. A donor reference to a parameter that does
        // not exist at all is a broken reference and must not pass as one.
        if (owner !== me && described === undefined && ownerRow[`Param${index}`] === undefined) {
          throw new Error(
            `${me}: reads Param${index} of "${owner}", which that row does not have. ` +
              `The columns moved, or the reference is to a parameter that was removed.`,
          );
        }
        return;
      }
      const raw = ownerRow[`Param${index}`];
      if (typeof raw !== "number") {
        throw new Error(
          `${owner}: Param${index} is described as a synergy ("${described}") but carries no ` +
            `numeric value, so the magnitude of every edge it governs is unknown.`,
        );
      }
      governing.push({ owner, index, described, value: raw });
    };

    const withoutDonors = value.replace(DONOR_PAR_REF, (_match, owner: string, n: string) => {
      readParam(owner, Number(n));
      return "";
    });
    for (const m of withoutDonors.matchAll(PAR_REF)) readParam(me, Number(m[1]));

    if (governing.length === 0) continue;

    /*
     * An edge needs a source, and these two shapes have none.
     *
     * A skill scaling itself: Blessed Aim's `skill('Blessed Aim'.blvl) * par8`,
     * governed by "Attack Rating % passive synergy". The parameter describes how
     * the skill's own passive grows with its own hard points, and
     * `checkSynergies` rejects a self-edge outright — so it is dropped here
     * rather than emitted and rejected downstream.
     *
     * A skill applying its own coefficient to its own level with no `skill()`
     * reference at all: Clay Golem's `skill('Golem Mastery'.ln56) + (lvl*par8)`,
     * where `par8` is Clay Golem's own "Clay Golem Attack Rating synergy" — the
     * same 20 that Blood, Iron and Fire Golem read off its row. The golem gives
     * that bonus to itself as well as to the others. Same non-edge, written
     * without the self-reference.
     */
    if (refs.length === 0 && governing.every((g) => g.owner === me)) continue;

    /*
     * A *donor's* synergy parameter with no base level to scale. The expression
     * names another skill and reads its soft level, which +skills raise — Revive
     * and Skeleton Mastery, and the Druid's three summons after it. This is the
     * one shape that wants a human decision rather than a rule.
     */
    if (refs.length === 0) {
      if (SOFT_LEVEL_SYNERGIES.has(me)) continue;
      throw new Error(
        `${me}: "${value}" is governed by a parameter the game calls a synergy ` +
          `(${governing.map((g) => `${g.owner}.par${g.index} "${g.described}"`).join(", ")}) ` +
          `but references no skill's base level. A synergy reads \`blvl\`; a reference to ` +
          `\`lvl\` is raised by +skills and is not one. Decide deliberately — add the skill to ` +
          `SOFT_LEVEL_SYNERGIES with the reason, or teach this rule the new shape.`,
      );
    }

    for (const ref of refs) {
      const slug = slugFor(ref);
      let entry = found.get(slug);
      if (!entry) found.set(slug, (entry = { kinds: new Set() }));
      for (const param of governing) {
        entry.kinds.add(
          SYNERGY_KINDS[param.described.replace(/\s*synergy\s*/i, "").trim().toLowerCase()] ??
            (() => {
              throw new Error(
                `${param.owner}: unknown synergy kind "${param.described}". Add it to ` +
                  `SYNERGY_KINDS deliberately — an unrecognised kind must not be silently ` +
                  `dropped or mislabelled as damage.`,
              );
            })(),
        );
        // The magnitude travels only when the game stores it on the source's
        // own row, which is what makes it that skill's contribution rather than
        // this one's rate for all of its sources at once.
        if (slugFor(param.owner) !== slug) continue;
        if (entry.magnitude !== undefined && entry.magnitude !== param.value) {
          throw new Error(
            `${me} <- ${slug}: two different magnitudes (${entry.magnitude}, ${param.value}) ` +
              `for one edge. Pick the governing parameter deliberately.`,
          );
        }
        entry.magnitude = param.value;
      }
    }
  }

  return [...found]
    .map(([from, entry]) => ({
      from,
      kinds: [...entry.kinds].sort(),
      ...(entry.magnitude === undefined ? {} : { magnitude: entry.magnitude }),
    }))
    .sort((x, y) => x.from.localeCompare(y.from));
}

/**
 * How many minions a summon holds at once, read from the `petmax` column.
 *
 * Two shapes exist among the skills in scope and they mean different things, so
 * neither is inferred from the other:
 *
 *   lvl                        Revive. The cap *is* the effective skill level.
 *   (lvl < 4) ?lvl:(2+lvl/3)   Raise Skeleton and Raise Skeletal Mage. One per
 *                              level for the first three, then two plus one for
 *                              every three levels — integer division, so a step
 *                              rather than a slope.
 *   min(lvl,parN)              Raven and the Druid's two wolves. One per level
 *                              until the row's own ceiling — five ravens, five
 *                              spirit wolves, three dire wolves. The ceiling is
 *                              a parameter rather than a literal, so it is read
 *                              off the row instead of being written here.
 *
 * The piecewise branch is the reason this is parsed rather than approximated.
 * `2 + floor(lvl/3)` alone gives two skeletons at level 1 and two at level 2,
 * where the game gives one and two; the site would have published a wrong
 * number at exactly the levels a reader is looking at it.
 *
 * A golem's `petmax` is the literal `1`, which is prose ("one golem at a time")
 * rather than a table, and is not read through here.
 *
 * @param raw   the column, as the extraction gives it
 * @param where the skill, for the error a broken assumption raises
 */
export function petMaxFromColumn(
  raw: unknown,
  where: string,
  /**
   * Reads `ParamN` off the same row. Required only by the `min(lvl,parN)`
   * shape, whose ceiling the game keeps in a parameter; passing it is how that
   * ceiling stays extracted rather than transcribed.
   */
  param?: (index: number) => number,
):
  | { kind: "linear"; base: number; perLevel: number; cap?: number }
  | { kind: "petmax"; threshold: number; base: number; per: number } {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(`${where}: petmax is missing or empty, and the count published comes from it`);
  }
  const expression = raw.trim().replace(/^"([\s\S]*)"$/, "$1").replace(/\s+/g, "");
  if (expression === "lvl") return { kind: "linear", base: 1, perLevel: 1 };
  const piecewise = expression.match(/^\(lvl<(\d+)\)\?lvl:\((\d+)\+lvl\/(\d+)\)$/);
  if (piecewise) {
    return {
      kind: "petmax",
      threshold: Number(piecewise[1]),
      base: Number(piecewise[2]),
      per: Number(piecewise[3]),
    };
  }
  const capped = expression.match(/^min\(lvl,par(\d+)\)$/);
  if (capped) {
    if (!param) {
      throw new Error(
        `${where}: petmax reads "${expression}", whose ceiling is a parameter, but no reader ` +
          `for the row's parameters was supplied.`,
      );
    }
    return { kind: "linear", base: 1, perLevel: 1, cap: param(Number(capped[1])) };
  }
  throw new Error(
    `${where}: petmax reads "${expression}", which is none of \`lvl\`, the piecewise ` +
      `\`(lvl < N) ? lvl : (B + lvl / P)\` shape, or \`min(lvl, parN)\`. A new shape means a ` +
      `new count formula; wire it up deliberately rather than approximating it.`,
  );
}

/**
 * A skill's mana cost, as base and per-level in player-facing units.
 *
 * `manashift` is a power-of-two divisor expressed as an exponent around 8, the
 * same convention `HitShift` uses for damage: Bone Spear's `mana=28` at
 * `manashift=6` is 28/4 = 7 mana at level 1, not 28. Reading the raw column
 * would publish a cost four times the real one.
 *
 * The result is deliberately fractional. Teeth costs 3 at level 1 and gains half
 * a point per level; rounding it to whole numbers would flatten the growth the
 * table exists to show.
 *
 * @returns undefined where the row carries no cast cost at all
 */
export function manaFromRow(
  row: SkillRow,
  where: string,
): { base: number; perLevel: number } | undefined {
  const read = (column: string): number => {
    const value = row[column];
    if (value === undefined) return 0;
    if (typeof value !== "number") {
      throw new Error(`${where}: ${column} is ${typeof value}, not a number`);
    }
    return value;
  };
  const mana = read("mana");
  const perLevel = read("lvlmana");
  if (mana === 0 && perLevel === 0) return undefined;
  const scale = Math.pow(2, read("manashift") - 8);
  const base = mana * scale;
  const slope = perLevel * scale;
  /*
   * `minmana` is a floor the engine applies after the arithmetic, and the shapes
   * this graph emits cannot express one. Every skill in scope stays above its
   * floor across the whole level range, so rather than model a floor that never
   * binds, the generator refuses when it would.
   */
  const floor = read("minmana");
  for (const level of [1, 20]) {
    if (base + slope * (level - 1) < floor) {
      throw new Error(
        `${where}: mana at level ${level} falls below minmana (${floor}), and the published ` +
          `shapes carry no floor. Model it deliberately before publishing this skill's cost.`,
      );
    }
  }
  return { base, perLevel: slope };
}

export interface GraphProblem {
  rule:
    | "authored-drift"
    | "missing-prerequisite"
    | "cross-tree-edge"
    | "cycle"
    | "unknown-skill"
    | "over-budget"
    | "row-level-mismatch"
    | "orphan-skill"
    | "orphan-node";
  message: string;
}

/** Every skill a plan implies, following prerequisites transitively. */
export function requiredClosure(
  seeds: Iterable<Slug>,
  graph: Record<Slug, SkillGraphNode>,
): Set<Slug> {
  const acc = new Set<Slug>();
  const walk = (slug: Slug) => {
    for (const pre of graph[slug]?.prerequisites ?? []) {
      if (acc.has(pre)) continue;
      acc.add(pre);
      walk(pre);
    }
  };
  for (const seed of seeds) walk(seed);
  return acc;
}

/**
 * Exported so the mutation tests can call it against a deliberately corrupted
 * graph or build list without touching the real content.
 */
export function checkSkillGraph(
  graph: Record<Slug, SkillGraphNode>,
  skills: readonly Skill[],
  builds: readonly Build[],
): GraphProblem[] {
  const found: GraphProblem[] = [];
  const known = new Set(Object.keys(graph));

  // -- the graph itself ----------------------------------------------------
  for (const [slug, node] of Object.entries(graph)) {
    for (const pre of node.prerequisites) {
      // An edge to a skill that does not exist.
      if (!known.has(pre)) {
        found.push({ rule: "unknown-skill", message: `graph: ${slug} requires ${pre}, which is not a skill` });
        continue;
      }
      // D2 prerequisites never cross trees. `page` comes straight from the
      // game data, so this stays independent of our authored `tree` field.
      if (graph[pre].page !== node.page || graph[pre].classSlug !== node.classSlug) {
        found.push({
          rule: "cross-tree-edge",
          message: `graph: ${slug} (${node.classSlug} page ${node.page}) requires ${pre} ` +
            `(${graph[pre].classSlug} page ${graph[pre].page}) — prerequisites never cross trees`,
        });
      }
    }
  }

  // -- the row/level invariant ---------------------------------------------
  // A skill's row in the tree is not a layout choice: row N is always the
  // level-N tier. Verified true for all 60 skills at extraction time, so a
  // future regeneration that broke it would be a real change worth catching.
  for (const [slug, node] of Object.entries(graph)) {
    const expected = TIER_LEVELS[node.row - 1];
    if (expected !== node.requiredLevel) {
      found.push({
        rule: "row-level-mismatch",
        message: `graph: ${slug} sits in row ${node.row} (tier level ${expected}) but unlocks at ${node.requiredLevel}`,
      });
    }
  }

  // -- cycles --------------------------------------------------------------
  // A cycle makes a skill unreachable: nothing in it can ever be allocated
  // first. Depth-first with a colour marker; reports each cycle once.
  {
    const state = new Map<Slug, "open" | "done">();
    const reported = new Set<string>();
    const visit = (slug: Slug, stack: Slug[]) => {
      if (state.get(slug) === "done") return;
      if (state.get(slug) === "open") {
        const at = stack.indexOf(slug);
        const loop = [...stack.slice(at), slug];
        const key = [...loop].sort().join(">");
        if (!reported.has(key)) {
          reported.add(key);
          found.push({ rule: "cycle", message: `graph: prerequisite cycle ${loop.join(" -> ")}` });
        }
        return;
      }
      state.set(slug, "open");
      for (const pre of graph[slug]?.prerequisites ?? []) visit(pre, [...stack, slug]);
      state.set(slug, "done");
    };
    for (const slug of known) visit(slug, []);
  }

  /*
   * -- every skill in an extracted class is in the graph, and vice versa ----
   *
   * `authored-drift` below skips a skill with no node, because a class the
   * extraction has not reached yet legitimately has none. That skip is also a
   * hole: once a class IS extracted, a mistyped slug gives its skill no node,
   * and the skill quietly stops being drawn in the tree, stops getting a page
   * and stops being checked for anything — while every gate still reports
   * green, because the skip swallows it.
   *
   * So scope is decided per class, from the graph itself, and inside a class in
   * scope the correspondence has to be exactly one to one in both directions.
   */
  {
    // Widened deliberately: the graph's node type names only the classes
    // extracted so far, while `skill.classSlug` is every class the site has.
    // Comparing them as strings is the question being asked.
    const extracted = new Set<string>(Object.values(graph).map((n) => n.classSlug));
    const authored = new Map<string, string>();
    for (const skill of skills) {
      if (!extracted.has(skill.classSlug)) continue;
      authored.set(skill.slug, skill.classSlug);
      if (!graph[skill.slug]) {
        found.push({
          rule: "orphan-skill",
          message: `${skill.slug}: authored for ${skill.classSlug}, which is extracted, but has ` +
            `no graph node. Check the slug — it will not be drawn, will not get a page, and ` +
            `nothing else will notice.`,
        });
      }
    }
    for (const [slug, node] of Object.entries(graph)) {
      if (!authored.has(slug)) {
        found.push({
          rule: "orphan-node",
          message: `${slug}: in the graph for ${node.classSlug}, but no skill is authored for it. ` +
            `The tree has a cell nothing fills.`,
        });
      }
    }
  }

  // -- the authored table must not drift from the graph --------------------
  for (const skill of skills) {
    const node = graph[skill.slug];
    if (!node) continue; // classes outside the graph's scope
    const ours = [...(skill.prerequisites ?? [])].sort();
    const theirs = [...node.prerequisites].sort();
    if (ours.join(",") !== theirs.join(",")) {
      found.push({
        rule: "authored-drift",
        message: `${skill.slug}: authored prerequisites [${ours.join(", ")}] do not match ` +
          `the game graph [${theirs.join(", ")}]`,
      });
    }
  }

  // -- build plans ---------------------------------------------------------
  for (const build of builds) {
    const inGraph = build.skills.filter((a) => graph[a.skill]);
    if (inGraph.length === 0) continue;

    for (const allocation of build.skills) {
      if (!graph[allocation.skill]) {
        found.push({
          rule: "unknown-skill",
          message: `${build.slug}: allocates ${allocation.skill}, which is not in the skill graph`,
        });
      }
    }

    // Flex points are optional by definition, so neither they nor the
    // prerequisites they would imply belong in the mandatory budget.
    const core = inGraph.filter((a) => a.points > 0 && a.role !== "flex");
    const allocated = new Set(core.map((a) => a.skill));

    // Direct and transitive: a plan that only closes because a deeper
    // prerequisite was overlooked still cannot be spent.
    const needed = requiredClosure(allocated, graph);
    for (const slug of needed) {
      if (allocated.has(slug)) continue;
      const direct = core.some((a) => graph[a.skill]?.prerequisites.includes(slug));
      found.push({
        rule: "missing-prerequisite",
        message: `${build.slug}: the plan requires ${slug}` +
          (direct ? "" : " (reached transitively)") +
          ` but never allocates it. The plan cannot be spent as written.`,
      });
    }

    const spent = core.reduce((sum, a) => sum + a.points, 0);
    if (spent > MAX_HARD_POINTS) {
      found.push({
        rule: "over-budget",
        message: `${build.slug}: ${spent} mandatory hard points, over the ${MAX_HARD_POINTS} ` +
          `a level 99 character has (98 level-ups plus 12 from quests)`,
      });
    }
  }

  return found;
}

/**
 * Synergy integrity.
 *
 * The graph owns both directions: `node.synergies` is what a skill receives,
 * and the reverse index is computed from it. Authored content may only supply a
 * magnitude for an edge the graph already has.
 *
 * Every rule here exists because its absence shipped something. Ten of the
 * thirty-four authored edges disagreed with their own reverse, and eight of the
 * twenty-five authored identities were contradicted by the game's formulas —
 * Holy Shield was said to take a synergy from Smite when the game gives it one
 * from Defiance, and Thunder Storm was said to take one from Lightning when the
 * game gives it one from Static Field.
 */
export interface SynergyProblem {
  rule:
    | "synergy-unknown-skill"
    | "synergy-cross-class"
    | "synergy-self"
    | "synergy-reverse-drift"
    | "authored-synergy-drift";
  detail: string;
}

/**
 * Every synergy kind the graph carries must have a word in every locale.
 *
 * `synergyKinds` in lib/labels.ts prints the raw kind when it has no label for
 * it. That keeps a page rendering, and it is the wrong failure for a
 * translation: the Necromancer's twelve golem edges arrived carrying
 * `attack-rating` and `absorb`, neither of which had a word in either language,
 * and every one of them would have rendered the slug in Portuguese with nothing
 * complaining. Coverage of *content* slugs is checked; the kinds travel inside
 * the graph and were not.
 *
 * @param resolve returns the label for a kind in one locale, or undefined
 */
export function checkSynergyKindLabels(
  graph: Record<string, { synergies: readonly { kinds: readonly string[] }[] }>,
  labelled: readonly string[],
  resolve: (locale: string, kind: string) => string | undefined,
  locales: readonly string[],
): string[] {
  const problems: string[] = [];
  const used = new Set<string>();
  for (const node of Object.values(graph)) {
    for (const syn of node.synergies) for (const kind of syn.kinds) used.add(kind);
  }
  for (const kind of used) {
    if (!labelled.includes(kind)) {
      problems.push(
        `synergy kind "${kind}" is in the graph but not in SYNERGY_KINDS_LABELLED, so it ` +
          `renders as its own slug rather than as a word`,
      );
    }
  }
  for (const kind of labelled) {
    if (!used.has(kind)) {
      problems.push(
        `synergy kind "${kind}" is labelled but no edge in the graph carries it — a label ` +
          `for a kind that does not exist is a claim about the game nothing checks`,
      );
    }
    for (const locale of locales) {
      // Existence only. Several kinds are legitimately the same word in both
      // locales -- "damage" and "healing" are English words the map returns
      // unchanged -- so treating label === kind as missing would fail the
      // source language for being the source language.
      if (!resolve(locale, kind)) {
        problems.push(`synergy kind "${kind}" has no ${locale} label`);
      }
    }
  }
  return problems;
}

/**
 * Every effect the graph publishes must have a word in every locale.
 *
 * Same failure as the synergy kinds, one layer along: `effectLabels` falls back
 * to printing the raw `labelKey`, so a Necromancer table would have shown
 * "effectRadiusHalfSquares" as a column heading in both languages rather than
 * failing. Twenty-two label keys arrived in one commit; one typo among them is
 * indistinguishable from a deliberate key until something reads the page.
 *
 * @param resolve returns the label for a key in one locale, or undefined
 */
export function checkEffectLabels(
  graph: Record<string, { effects?: readonly { labelKey: string }[] }>,
  resolve: (locale: string, labelKey: string) => string | undefined,
  locales: readonly string[],
): string[] {
  const problems: string[] = [];
  const used = new Set<string>();
  for (const node of Object.values(graph)) {
    for (const effect of node.effects ?? []) used.add(effect.labelKey);
  }
  if (used.size === 0) {
    problems.push("no skill publishes an effect at all; the extraction must have moved");
  }
  for (const key of [...used].sort()) {
    for (const locale of locales) {
      if (!resolve(locale, key)) {
        problems.push(`effect label "${key}" has no ${locale} word, so the column heading is the key`);
      }
    }
  }
  return problems;
}

export function checkSynergies(
  graph: Record<string, { classSlug: string; synergies: readonly { from: string; kinds: readonly string[] }[] }>,
  authored: readonly { slug: string; synergies?: readonly { skill: string; bonus: string }[] }[],
  /** The reverse index the site actually renders, as the app computes it. */
  reverseFor: (slug: string) => readonly { slug: string }[],
): SynergyProblem[] {
  const problems: SynergyProblem[] = [];
  const add = (rule: SynergyProblem["rule"], detail: string) => problems.push({ rule, detail });

  for (const [slug, node] of Object.entries(graph)) {
    for (const syn of node.synergies) {
      const target = graph[syn.from];
      if (!target) {
        add("synergy-unknown-skill", `${slug} receives a synergy from unknown skill "${syn.from}"`);
        continue;
      }
      if (syn.from === slug) {
        add("synergy-self", `${slug} lists itself as its own synergy source`);
      }
      if (target.classSlug !== node.classSlug) {
        add(
          "synergy-cross-class",
          `${slug} (${node.classSlug}) receives a synergy from ${syn.from} (${target.classSlug})`,
        );
      }
      if (syn.kinds.length === 0) {
        add("synergy-unknown-skill", `${slug} <- ${syn.from} carries no synergy kind`);
      }
    }
  }

  /*
   * The reverse index the pages render must be exactly the transpose of the
   * graph. A "Skills this feeds" entry with no matching "Synergies received" on
   * the other page is the defect this whole rule set exists to prevent.
   */
  const expected = new Map<string, Set<string>>();
  for (const [slug, node] of Object.entries(graph)) {
    for (const syn of node.synergies) {
      if (!expected.has(syn.from)) expected.set(syn.from, new Set());
      expected.get(syn.from)!.add(slug);
    }
  }
  for (const slug of Object.keys(graph)) {
    const want = expected.get(slug) ?? new Set<string>();
    const got = new Set(reverseFor(slug).map((r) => r.slug));
    for (const s of want) {
      if (!got.has(s)) {
        add("synergy-reverse-drift", `${slug} feeds ${s} in the graph, but the reverse index omits it`);
      }
    }
    for (const s of got) {
      if (!want.has(s)) {
        add(
          "synergy-reverse-drift",
          `the reverse index says ${slug} feeds ${s}, but the graph has no such edge`,
        );
      }
    }
  }

  // Authored magnitudes may only annotate an edge the graph recognises.
  for (const skill of authored) {
    for (const syn of skill.synergies ?? []) {
      const node = graph[skill.slug];
      if (!node) {
        add("authored-synergy-drift", `authored synergy on unknown skill "${skill.slug}"`);
        continue;
      }
      if (!node.synergies.some((s) => s.from === syn.skill)) {
        add(
          "authored-synergy-drift",
          `${skill.slug} authors a synergy from "${syn.skill}", which the game's formulas do not give it`,
        );
      }
    }
  }

  return problems;
}

// ===========================================================================
// Missile-borne synergies
// ===========================================================================

/**
 * A synergy the game keeps on a *missile* rather than on a skill's own row.
 *
 * `synergiesFor` reads `skills.json` and nothing else, which is correct for
 * every edge the game declares on the skill. It is not the whole game. Three
 * skills in the five classes in scope deal part of their damage through a
 * sub-missile that carries its own `EDmgSymPerCalc`, and those references are
 * invisible from the skill row:
 *
 *   fistoftheheavensbolt   `skill('Holy Bolt'.blvl) * 15`   EType mag
 *   meteorfire             `skill('Inferno'.blvl)*3`        EType fire
 *   immolationfire         `skill('Fire Arrow'.blvl) * 5`   EType fire
 *
 * The FoHdin is why this exists. Its plan puts twenty hard points in Holy Bolt
 * and calls them a synergy; the skill row says Fist of the Heavens' only
 * synergy is Holy Shock, so a rule reading skill rows alone rejects a correct
 * allocation. The points are collected on the missile — the magic waves — at
 * fifteen percent each, and a graph that cannot see that cannot arbitrate the
 * claim.
 *
 * Two more missiles carry a synergy calc whose source the skill row already
 * declares — `moltenboulderfirepath` and `armageddonfire`, both from Firestorm.
 * They are extracted all the same and de-duplicated by the consumer rather than
 * here, because "the missile says so too" is a fact about the game and dropping
 * it would make this function's output depend on the other one's.
 *
 * The coefficient is a literal here, not a `parN`, so the parameter-description
 * test that governs `synergiesFor` has nothing to read. The column name is the
 * declaration instead: `EDmgSymPerCalc` and `ELenSymPerCalc` are the game's own
 * names for a synergy calc, and a reference in any *other* column is not one.
 */
export interface MissileSynergy {
  /** Slug of the skill whose hard points feed this. */
  from: string;
  /** The missile row the calc sits on, so a page can name the component. */
  missile: string;
  /** The missile's own `EType`. Its damage is this element, not the skill's. */
  element: string;
  /** Percent per hard point. */
  magnitude: number;
}

/** One row of `missiles.json`, as far as this rule cares. */
export type MissileRow = { Missile: string } & Record<string, unknown>;

/** The columns a missile spawns further missiles through. */
export const MISSILE_CHILD_COLUMNS = [
  "SubMissile1",
  "SubMissile2",
  "SubMissile3",
  "HitSubMissile1",
  "HitSubMissile2",
  "HitSubMissile3",
  "HitSubMissile4",
] as const;

/** `skill('X'.blvl) * 15` or `(skill('X'.blvl)+skill('Y'.blvl))*7`. */
const MISSILE_SYNERGY_COLUMNS = ["EDmgSymPerCalc", "ELenSymPerCalc"] as const;
const MISSILE_LITERAL_COEFFICIENT = /\*\s*(\d+)\s*$/;

/**
 * Every missile-borne synergy reachable from one skill, following sub-missiles.
 *
 * `spawns` gives the missiles the *skill* creates; the walk from there is over
 * `MISSILE_CHILD_COLUMNS`, because the calc sits on the grandchild in all three
 * cases that matter — Fist of the Heavens creates `fistoftheheavensdelay`,
 * which creates the bolt that carries the reference.
 *
 * A shape this cannot read stops the generator rather than being skipped. The
 * point of the function is that a synergy the game declares is not silently
 * absent from a graph whose whole meaning is "hard points here raise that
 * number", and a parser that shrugged at an unfamiliar expression would
 * reintroduce exactly that.
 */
export function missileSynergiesFor(
  spawns: readonly string[],
  missileByName: ReadonlyMap<string, MissileRow>,
  where: string,
): MissileSynergy[] {
  const found = new Map<string, MissileSynergy>();
  const seen = new Set<string>();

  const walk = (name: string) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const row = missileByName.get(key);
    if (!row) return;

    for (const column of MISSILE_SYNERGY_COLUMNS) {
      const value = row[column];
      if (typeof value !== "string" || !value.includes("skill(")) continue;

      const refs = [...value.matchAll(SKILL_REF)].map((m) => m[1]);
      if (refs.length === 0) {
        throw new Error(
          `${where}: missile "${row.Missile}" declares ${column} as "${value}", which ` +
            `references no skill's base level. A synergy reads \`blvl\`; teach this rule ` +
            `the new shape rather than dropping the edge.`,
        );
      }

      const coefficient = MISSILE_LITERAL_COEFFICIENT.exec(value.trim());
      if (!coefficient) {
        throw new Error(
          `${where}: missile "${row.Missile}" declares ${column} as "${value}", whose ` +
            `coefficient is not a trailing literal. Every missile synergy in the pinned ` +
            `extraction ends in \`* N\`; read the new shape deliberately.`,
        );
      }
      const magnitude = Number(coefficient[1]);

      const element = row.EType;
      if (typeof element !== "string" || element.length === 0) {
        throw new Error(
          `${where}: missile "${row.Missile}" carries a synergy calc and no EType, so the ` +
            `element its damage is dealt as is unknown.`,
        );
      }

      for (const ref of refs) {
        const slug = slugFor(ref);
        const existing = found.get(slug);
        if (existing && existing.magnitude !== magnitude) {
          throw new Error(
            `${where} <- ${slug}: two missile magnitudes (${existing.magnitude}, ${magnitude}). ` +
              `Pick the governing missile deliberately.`,
          );
        }
        if (!existing) {
          found.set(slug, { from: slug, missile: String(row.Missile), element, magnitude });
        }
      }
    }

    for (const column of MISSILE_CHILD_COLUMNS) {
      const child = row[column];
      if (typeof child === "string" && child.length > 0) walk(child);
    }
  };

  for (const name of spawns) walk(name);

  return [...found.values()].sort((x, y) => x.from.localeCompare(y.from));
}
