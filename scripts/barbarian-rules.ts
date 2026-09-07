/**
 * The rules that validate the Barbarian's pages, as pure functions.
 *
 * Separate from `barbarian.test.ts` for the reason `skill-graph-rules.ts` is
 * separate from `check-content.ts`: these take their inputs as arguments so the
 * test can hand them deliberately corrupted content and prove each rule fires.
 * Nothing here reads the real content.
 *
 * WHY THESE EIGHT AND NOT THE OTHER CLASSES' TEN
 * ----------------------------------------------
 * Each of these pins something that was hard to get right *on this class*, and
 * each of them either already went wrong during the pass or is one column away
 * from a sentence that would read as correct.
 *
 *   area-level-misstated          Three build pages and the journey quote an
 *                                 area level in prose. The journey shipped "the
 *                                 Pit and Pindleskin, both area level 85" and
 *                                 Pindleskin is 83; nothing caught it.
 *   immunity-unnamed              Ten farming entries named no immunity on an
 *                                 area whose own list contains a damage type the
 *                                 build deals. Three instances of this shape on
 *                                 this class, the worst of them a rating 5.
 *   block-on-a-two-weapon-build   Frenzy and Double Throw carry `itypeb1`: they
 *                                 require a second weapon, so there is no shield
 *                                 at any tier and a Faster Block Rate row would
 *                                 be a stat the build cannot have.
 *   battle-orders-life-disagrees  One number, quoted on six pages in two
 *                                 locales. It is exactly the shape that drifts.
 *   berserk-damage-reduction      `aurastat1 = damageresist` reads `par5`, and
 *                                 `par5 = 0`. Berserk grants none. Older guides
 *                                 say otherwise and the sentence reads fine.
 *   leap-attack-uninterruptible   `interrupt = 1`, where Concentrate, Frenzy and
 *                                 Whirlwind leave it blank. The class's
 *                                 reputation is the opposite, so this inherits
 *                                 wrongly from every other page.
 *   war-cry-given-a-mastery       War Cry carries no `SrcDam`. A mastery raises
 *                                 weapon damage it does not have, so allocating
 *                                 one is twenty wasted points that look diligent.
 *   mana-from-the-raw-column      `manashift` is a power-of-two divisor.
 *                                 Whirlwind's column says 25 and it costs 12.5;
 *                                 War Cry's says 40 and it costs 10. Reading the
 *                                 column straight is the natural mistake.
 *
 * WHERE THE GAME FACTS COME FROM
 * ------------------------------
 * Four rules need a fact the repository does not carry as data: which skills
 * declare an off-hand item requirement, which fill `interrupt`, which carry no
 * `SrcDam`, and what the shifted mana costs are. The graph carries none of
 * those columns. They are encoded once below, each beside the column it came
 * from in `blizzhackers/d2data@fc46999`, and each is checked against *content*
 * rather than against itself — the failure mode this file is forbidden from is
 * a constant compared with a copy of itself.
 */

// ---------------------------------------------------------------------------
// The game facts, with their columns
// ---------------------------------------------------------------------------

/** Skills whose row declares `itypeb1` — an off-hand *item* requirement. */
export const REQUIRES_TWO_WEAPONS: readonly string[] = [
  // itypeb1 = mele
  "double-swing",
  "frenzy",
  // itypeb1 = thro
  "double-throw",
];

/** Barbarian attacks whose row leaves `interrupt` blank: they cannot be interrupted. */
export const UNINTERRUPTIBLE: readonly string[] = ["concentrate", "frenzy", "whirlwind"];

/** Barbarian attacks whose row fills `interrupt = 1`: they can be. */
export const INTERRUPTIBLE: readonly string[] = ["bash", "stun", "double-throw", "leap-attack", "berserk"];

/** Skills carrying no `SrcDam` at all — no weapon damage, so no mastery applies. */
export const NO_WEAPON_DAMAGE: readonly string[] = ["war-cry"];

/**
 * `mana` and `manashift` per skill, and the cost they actually produce.
 *
 * cost = mana * 2^(manashift - 8). The raw `mana` column is the number a reader
 * transcribing the extraction would publish, and for these two it is wrong by a
 * factor of two and four respectively.
 */
export const SHIFTED_MANA: readonly { slug: string; raw: number; actual: number }[] = [
  { slug: "whirlwind", raw: 25, actual: 12.5 }, // manashift 7
  { slug: "war-cry", raw: 40, actual: 10 }, // manashift 6
];

export const BARBARIAN_RULES = [
  "area-level-misstated",
  "immunity-unnamed",
  "block-on-a-two-weapon-build",
  "battle-orders-life-disagrees",
  "berserk-damage-reduction",
  "leap-attack-uninterruptible",
  "war-cry-given-a-mastery",
  "mana-from-the-raw-column",
] as const;
export type BarbarianRule = (typeof BARBARIAN_RULES)[number];

export interface BarbarianProblem {
  rule: BarbarianRule;
  where: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Minimal structural shapes, so a test can build a corrupt one by hand
// ---------------------------------------------------------------------------

/** The three difficulties, spelled here so this file imports nothing from the app. */
export type DifficultyLike = "normal" | "nightmare" | "hell";

export interface FarmingEntryLike {
  area: string;
  difficulty: DifficultyLike;
  why: string;
  rating: number;
}
export interface AllocationLike {
  skill: string;
  points: number;
  role?: string;
  note?: string;
}
export interface BreakpointLike {
  stat: string;
  value: number;
  why: string;
}
export interface BuildLike {
  slug: string;
  primarySkill: string;
  damageTypes: readonly string[];
  farming: readonly FarmingEntryLike[];
  skills: readonly AllocationLike[];
  skillPackages?: readonly {
    packages: readonly { id: string; skills: readonly AllocationLike[] }[];
  }[];
  breakpoints: readonly BreakpointLike[];
  breakpointNotes?: string;
}
export interface AreaLike {
  slug: string;
  levels: Readonly<Record<DifficultyLike, number>>;
  commonImmunities?: readonly string[];
}

/**
 * Sentence scoping. Two clauses in the same paragraph are a claim about each
 * other; two paragraphs apart are not. Bold opens a bullet on these pages, so
 * `\*{0,2}` is stripped the way `assassin-rules.ts` strips it.
 */
export const sentencesIn = (text: string): string[] =>
  text.split(/(?<=[.!?])\*{0,2}\s+|\n+/).filter((s) => s.trim().length > 0);

// ---------------------------------------------------------------------------
// 1. Area levels quoted in prose must match the farming registry
// ---------------------------------------------------------------------------

/**
 * "area level 85", "área de nível 85", and the two-area form the journey uses:
 * "The Pit is area level 85 in Hell and Pindleskin is 83".
 *
 * Every number is checked against the registry entry for the area the sentence
 * is *about* — which for a build's farming entry is the entry's own area, and
 * for a journey action is whichever catalogued area the sentence names.
 */
/**
 * The explicit form, in both locales: "area level 85", "area-level-85",
 * "área de nível 85".
 */
const AREA_LEVEL_PHRASE = /(?:area[-\s]?level|[áa]rea de n[íi]vel)[-\s]*(\d{2,3})/gi;

/**
 * The elliptical second half of a comparison: "…and Pindleskin is 83".
 *
 * Only read as a level claim in a sentence that already contains the explicit
 * form, which is what makes the sentence *about* area levels. Without that
 * guard "the run is 30 seconds" would be read as a level.
 */
const ELLIPTICAL_LEVEL = /(?:^|[\s(])(?:is|are|é|são)\s+(\d{2,3})\b/gi;

export interface LevelClaim {
  /** The area the number is attached to, or null when nothing precedes it. */
  area: string | null;
  value: number;
  sentence: string;
}

const displayNames = (areas: readonly AreaLike[]): { slug: string; pattern: RegExp }[] =>
  areas.map((a) => ({
    slug: a.slug,
    // Slugs are lowercase-hyphenated; the prose writes them spaced and capitalised.
    pattern: new RegExp(`\\b${a.slug.split("-").join("[-\\s]")}\\b`, "gi"),
  }));

/**
 * Every area-level claim in a passage, each attributed to the area whose name
 * most recently preceded it.
 *
 * The attribution is the whole point. "The Pit is area level 85 in Hell and
 * Pindleskin is 83" carries two claims about two areas, and a rule that
 * gathered `{85, 83}` and asked whether each appears *somewhere* in
 * `{85, 83}` would pass the sentence unchanged if the 83 were changed to 85 —
 * both numbers would still be members of the set. Reading right-to-left from
 * each number to its owner is what makes that mutation fail.
 */
export function levelClaimsIn(text: string, areas: readonly AreaLike[]): LevelClaim[] {
  const names = displayNames(areas);
  const claims: LevelClaim[] = [];

  for (const sentence of sentencesIn(text)) {
    const explicit = [...sentence.matchAll(AREA_LEVEL_PHRASE)];
    if (explicit.length === 0) continue;

    const anchors: { slug: string; at: number }[] = [];
    for (const { slug, pattern } of names) {
      pattern.lastIndex = 0;
      for (const m of sentence.matchAll(pattern)) anchors.push({ slug, at: m.index ?? 0 });
    }
    anchors.sort((a, b) => a.at - b.at);

    const raw: { at: number; value: number }[] = explicit.map((m) => ({
      at: m.index ?? 0,
      value: Number(m[1]),
    }));
    for (const m of sentence.matchAll(ELLIPTICAL_LEVEL)) {
      const value = Number(m[1]);
      if (value < 20 || value > 99) continue;
      raw.push({ at: m.index ?? 0, value });
    }

    for (const { at, value } of raw) {
      const owner = [...anchors].reverse().find((a) => a.at < at);
      claims.push({ area: owner?.slug ?? null, value, sentence });
    }
  }
  return claims;
}

/**
 * A build's farming entry already knows which area it is about, so an
 * unattributed number belongs to that area. An attributed one belongs to
 * whichever area the prose names — a `why` may legitimately compare two.
 */
export function checkAreaLevels(
  builds: readonly BuildLike[],
  areas: readonly AreaLike[],
  levelOf: (slug: string, difficulty: DifficultyLike) => number | undefined,
  where: string,
): BarbarianProblem[] {
  const found: BarbarianProblem[] = [];
  for (const build of builds) {
    for (const entry of build.farming) {
      for (const claim of levelClaimsIn(entry.why, areas)) {
        const about = claim.area ?? entry.area;
        const truth = levelOf(about, entry.difficulty);
        if (truth === undefined || truth === claim.value) continue;
        found.push({
          rule: "area-level-misstated",
          where,
          message:
            `${where}/${build.slug}: the ${entry.area} entry puts ${about} at area level ${claim.value}, ` +
            `and the farming registry has ${truth} in ${entry.difficulty}. The registry is what a reader ` +
            `plans around — "${claim.sentence.slice(0, 100)}"`,
        });
      }
    }
  }
  return found;
}

/**
 * The same rule for journey prose, where the sentence names the area itself
 * rather than carrying it in a field. An unattributed number is skipped here:
 * there is no ambient subject to charge it to.
 */
export function checkJourneyAreaLevels(
  passages: readonly { where: string; text: string }[],
  areas: readonly AreaLike[],
  difficulty: DifficultyLike,
): BarbarianProblem[] {
  const found: BarbarianProblem[] = [];
  const byslug = new Map(areas.map((a) => [a.slug, a]));
  for (const passage of passages) {
    for (const claim of levelClaimsIn(passage.text, areas)) {
      if (claim.area === null) continue;
      const truth = byslug.get(claim.area)?.levels[difficulty];
      if (truth === undefined || truth === claim.value) continue;
      found.push({
        rule: "area-level-misstated",
        where: passage.where,
        message:
          `${passage.where}: puts ${claim.area} at area level ${claim.value} in ${difficulty}, and the ` +
          `farming registry has ${truth} — "${claim.sentence.slice(0, 110)}"`,
      });
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// 2. A farming entry must name the immunity that stops the build there
// ---------------------------------------------------------------------------

const NAMES_IMMUNITY = /\bimmun|\bimune|\bimunidade/i;
const DENIES_IMMUNITY =
  /\b(no|nothing|none|not|never|without)\b[^.]{0,70}\bimmun|\b(nada|nenhum\w*|sem)\b[^.]{0,70}\bimun/i;

/**
 * The shape that shipped three times on this class: a build whose damage is
 * physical rating an area highly, in prose that never mentions the physical
 * immunity the area's own entry records.
 *
 * Written to fire on War Cry rating Worldstone Keep a 5 — the specific sentence
 * that got through — which means it fires on silence, not only on denial. A
 * reader planning around a rating does not learn about a wall from its absence.
 */
export function checkFarmingImmunities(
  builds: readonly BuildLike[],
  immunitiesOf: (slug: string) => readonly string[] | undefined,
  where: string,
): BarbarianProblem[] {
  const found: BarbarianProblem[] = [];
  for (const build of builds) {
    for (const entry of build.farming) {
      const immune = immunitiesOf(entry.area) ?? [];
      const clash = build.damageTypes.filter((d) => immune.includes(d));
      if (clash.length === 0) continue;
      if (DENIES_IMMUNITY.test(entry.why)) {
        found.push({
          rule: "immunity-unnamed",
          where,
          message:
            `${where}/${build.slug}: the ${entry.area} entry denies an immunity the area's own list ` +
            `records (${immune.join(", ")}), against a build dealing ${build.damageTypes.join(" and ")}.`,
        });
        continue;
      }
      if (!NAMES_IMMUNITY.test(entry.why)) {
        found.push({
          rule: "immunity-unnamed",
          where,
          message:
            `${where}/${build.slug}: the ${entry.area} entry is rated ${entry.rating} and never mentions ` +
            `immunity, but the area records ${clash.join(", ")} and this build deals ` +
            `${build.damageTypes.join(" and ")}. Silence about the wall reads as its absence.`,
        });
      }
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// 3. A build requiring two weapons cannot publish a block breakpoint
// ---------------------------------------------------------------------------

export function checkTwoWeaponBlock(builds: readonly BuildLike[], where: string): BarbarianProblem[] {
  const found: BarbarianProblem[] = [];
  for (const build of builds) {
    if (!REQUIRES_TWO_WEAPONS.includes(build.primarySkill)) continue;
    for (const bp of build.breakpoints) {
      if (bp.stat !== "fbr") continue;
      found.push({
        rule: "block-on-a-two-weapon-build",
        where,
        message:
          `${where}/${build.slug}: publishes a Faster Block Rate target of ${bp.value}%, but ` +
          `${build.primarySkill} declares an off-hand item requirement — there is no shield at any ` +
          `tier of this build, so block is not a stat it can have.`,
      });
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// 4. One Battle Orders life figure, quoted on six pages in two locales
// ---------------------------------------------------------------------------

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20,
  um: 1, dois: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9,
  dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14, quinze: 15, dezesseis: 16,
  dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20,
};

const NUMBER_WORD = Object.keys(WORD_NUMBERS).join("|");

/**
 * "at twenty hard points", "com vinte pontos duros", "at one point", "16 points",
 * and the elliptical "+92% at twenty" the build pages use once the unit is
 * established earlier in the sentence.
 *
 * The elliptical form is restricted to spelled-out numbers. House style writes
 * point counts as words and everything else as digits, so `at 24` is a level and
 * `at twenty` is a point count — reading digits here would turn "at level 24"
 * and "at 5 seconds" into allocations.
 */
const POINT_QUANTITY = new RegExp(
  `\\b(?:(\\d{1,2})|(${NUMBER_WORD}))\\s+(?:hard\\s+|duros?\\s+)?(?:points?|pontos?)(?:\\s+duros?)?\\b` +
    `|\\b(?:at|com)\\s+(${NUMBER_WORD})\\b`,
  "gi",
);

const PERCENT = /\+?(\d{1,3})\s*%/g;

/** A per-unit rate is not a total, and must not be paired with a point count. */
const RATE_TAIL = /^[^.]{0,30}?(?:(?:more\s+)?per\s+(?:level|hard\s+point|point)|por\s+(?:n[íi]vel|ponto)|\beach\b|\bcada\b)/i;

const MENTIONS_LIFE = /maximum life|max life|vida m[áa]xima/i;
const NAMES_BATTLE_ORDERS = /battle orders/i;

export interface BuffPassage {
  where: string;
  text: string;
  /** Set when the surrounding data already knows the skill — an allocation, an overlay key. */
  subject?: string;
}

/**
 * The published per-level rule, read out of the class page rather than typed here.
 *
 * "+35% maximum life at one point and 3% more per level" in en-US;
 * "+35% de vida máxima com um ponto e mais 3% por nível" in pt-BR.
 */
export function readLifeFormula(text: string): { base: number; perLevel: number } | undefined {
  const m = text.match(
    /\+(\d{1,3})\s*%[^.]{0,45}?(?:at one point|com um ponto)[^.]{0,25}?(\d{1,2})\s*%\s*(?:more per level|por n[íi]vel)/i,
  );
  if (!m) return undefined;
  return { base: Number(m[1]), perLevel: Number(m[2]) };
}

/**
 * Battle Orders' life figure, checked as arithmetic rather than as a constant.
 *
 * Six build pages, the class page and the journey all quote this number, and
 * they legitimately quote *different* numbers — +35% at one point, +80% at
 * sixteen, +92% at twenty. A rule demanding they agree would fire on correct
 * content; a rule holding one of them as the answer would be comparing a
 * literal with a copy of itself.
 *
 * So the base and the per-level step are read off the class page, every
 * `(percent, point count)` pair is read off the pages that quote one, and each
 * pair is required to satisfy `base + perLevel * (points - 1)`. Neither side is
 * written here. Changing the class page's rule fails the build pages; changing
 * a build page fails against the class page.
 */
export function checkBattleOrdersLife(
  formula: { base: number; perLevel: number } | undefined,
  passages: readonly BuffPassage[],
): BarbarianProblem[] {
  if (!formula) {
    return [
      {
        rule: "battle-orders-life-disagrees",
        where: "battle-orders",
        message:
          `The class page no longer states Battle Orders' life rule in the form "+N% maximum life at one ` +
          `point and M% more per level". Six build pages and the journey quote figures derived from it, ` +
          `and with the rule gone there is nothing left to derive them from.`,
      },
    ];
  }

  const found: BarbarianProblem[] = [];
  for (const passage of passages) {
    const about = passage.subject === "battle-orders" || NAMES_BATTLE_ORDERS.test(passage.text);
    if (!about || !MENTIONS_LIFE.test(passage.text)) continue;

    for (const sentence of sentencesIn(passage.text)) {
      if (!MENTIONS_LIFE.test(sentence)) continue;

      const quantities: { at: number; points: number }[] = [];
      for (const q of sentence.matchAll(POINT_QUANTITY)) {
        const word = q[2] ?? q[3];
        const points = q[1] ? Number(q[1]) : word ? WORD_NUMBERS[word.toLowerCase()] : 0;
        if (points) quantities.push({ at: q.index ?? 0, points });
      }
      if (quantities.length === 0) continue;

      for (const p of sentence.matchAll(PERCENT)) {
        const at = p.index ?? 0;
        if (RATE_TAIL.test(sentence.slice(at + p[0].length))) continue;
        const percent = Number(p[1]);

        const nearest = quantities.reduce((best, q) =>
          Math.abs(q.at - at) < Math.abs(best.at - at) ? q : best,
        );
        if (Math.abs(nearest.at - at) > 90) continue;

        const expected = formula.base + formula.perLevel * (nearest.points - 1);
        if (percent === expected) continue;
        found.push({
          rule: "battle-orders-life-disagrees",
          where: passage.where,
          message:
            `${passage.where}: states +${percent}% maximum life at ${nearest.points} points. The class ` +
            `page's rule is +${formula.base}% at one point and ${formula.perLevel}% more per level, which ` +
            `gives +${expected}% there — "${sentence.slice(0, 110)}"`,
        });
      }
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// 5-8. Claims a single column refutes
// ---------------------------------------------------------------------------

const REDUCTION_PHRASE = /\b(?:damage reduction|damage reduced|redu[çc][ãa]o de dano)\b/gi;

/**
 * The three tests are all run against the text *immediately before* the phrase,
 * not against the sentence.
 *
 * A sentence-wide negation check reads "Your defence is zero while it swings,
 * but Berserk grants damage reduction" as a denial, because "zero" is in it —
 * which is how the first draft of this rule stayed silent on the exact
 * falsehood it exists to catch. The negator has to be governing the phrase, so
 * only the words right in front of it count.
 */
/**
 * Real granting verbs only. "with" and "and" were in the first draft and they
 * are not verbs: they matched "any guide crediting Berserk with damage
 * reduction is reading the column and not the value" — the class page sentence
 * that exists to refute the claim — and reported it as the claim.
 */
const GRANTING_VERB =
  /\b(?:grants?|gives?|provides?|adds?|carries|brings?|d[áa]|d[ãa]o|adiciona|concede|oferece|garante)\b[^.]{0,40}$/i;
const NEGATED =
  /\b(?:no|not|never|none|without|nothing|zero|n[ãa]o|nenhum\w*|sem)\b[^.]{0,25}$/i;

/** Battle Cry lowers the *enemy's* damage. A different stat, on a different page. */
const ENEMY_DAMAGE = /\b(?:enemy|monster)\s+damage\b|\bdano\s+inimigo\b|\bdano\s+dos?\s+inimigos?\b/i;

const CANNOT_BE_INTERRUPTED =
  /\b(?:cannot|can't|never)\b[^.]{0,40}?\b(?:be )?interrupt|\bn[ãa]o (?:pode|podem)\b[^.]{0,40}?\binterromp/gi;

const NAMES_BERSERK = /\bberserk\b/gi;
const NAMES_LEAP_ATTACK = /\bleap attack\b/gi;

/**
 * Does the skill's name introduce this claim, rather than trail it?
 *
 * Three sentences on the shipped pages put the name *after* the phrase, in a
 * contrast clause that says the opposite of what a naive scan reads:
 *
 *   "…it doubles your defence and cannot be interrupted, which Leap Attack
 *    itself cannot say."
 *   "Damage reduction and block, the two mitigations that Berserk leaves intact."
 *
 * Both are correct English about a *different* skill. Requiring the name to
 * precede the claim, and to be close enough to govern it, is what separates the
 * subject of a sentence from a skill it merely mentions.
 */
const introduces = (sentence: string, name: RegExp, claimAt: number, window = 60): boolean => {
  name.lastIndex = 0;
  for (const m of sentence.matchAll(name)) {
    const at = m.index ?? 0;
    if (at < claimAt && claimAt - at <= window) return true;
  }
  return false;
};

/**
 * Three lexical rules over the same scoped sentences.
 *
 * Each fires only on a sentence whose subject *is* the skill, for the reason
 * `assassin-rules.ts` scopes by sentence and then some: two clauses five
 * sentences apart are not a claim about each other, and two clauses in the same
 * sentence are not either when one of them is a contrast.
 */
export function checkColumnRefutedClaims(
  sources: readonly { where: string; text: string }[],
): BarbarianProblem[] {
  const found: BarbarianProblem[] = [];
  for (const source of sources) {
    for (const sentence of sentencesIn(source.text)) {
      // 5. Berserk grants no damage reduction: aurastat1 reads par5, and par5 = 0.
      if (!ENEMY_DAMAGE.test(sentence)) {
        for (const m of sentence.matchAll(REDUCTION_PHRASE)) {
          const at = m.index ?? 0;
          const before = sentence.slice(0, at);
          if (!GRANTING_VERB.test(before) || NEGATED.test(before)) continue;
          if (!introduces(sentence, NAMES_BERSERK, at)) continue;
          found.push({
            rule: "berserk-damage-reduction",
            where: source.where,
            message:
              `${source.where}: "${sentence.slice(0, 120)}" credits Berserk with damage reduction. Its ` +
              `\`aurastat1 = damageresist\` reads \`par5\`, and \`par5 = 0\` at every level — it grants none.`,
          });
          break;
        }
      }
      // 6. Leap Attack fills `interrupt = 1`; the other three committed attacks do not.
      for (const m of sentence.matchAll(CANNOT_BE_INTERRUPTED)) {
        if (!introduces(sentence, NAMES_LEAP_ATTACK, m.index ?? 0)) continue;
        found.push({
          rule: "leap-attack-uninterruptible",
          where: source.where,
          message:
            `${source.where}: "${sentence.slice(0, 120)}" says Leap Attack cannot be interrupted. Its row ` +
            `carries \`interrupt = 1\`, where Concentrate, Frenzy and Whirlwind leave that column blank. ` +
            `It is the one committed Barbarian attack that can be.`,
        });
        break;
      }
      // 8. The shifted mana costs, quoted from the raw column.
      for (const { slug, raw, actual } of SHIFTED_MANA) {
        const name = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
        if (!new RegExp(`\\b${name}\\b`, "i").test(sentence)) continue;
        if (!new RegExp(`\\b${raw}\\s*(?:mana|de mana)\\b`, "i").test(sentence)) continue;
        if (new RegExp(`\\b${String(actual).replace(".", "[.,]")}\\b`).test(sentence)) continue;
        found.push({
          rule: "mana-from-the-raw-column",
          where: source.where,
          message:
            `${source.where}: "${sentence.slice(0, 120)}" states ${name}'s cost as ${raw} mana. That is the ` +
            `raw column; \`manashift\` divides it, and the cost is ${actual}.`,
        });
      }
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// 7. A skill with no weapon damage cannot use a weapon mastery
// ---------------------------------------------------------------------------

export function checkMasteryOnWeaponlessBuild(
  builds: readonly BuildLike[],
  where: string,
): BarbarianProblem[] {
  const found: BarbarianProblem[] = [];
  for (const build of builds) {
    if (!NO_WEAPON_DAMAGE.includes(build.primarySkill)) continue;

    // Packages count. A package is a costed plan a reader actually takes, and
    // sixteen points of mastery inside one is the same sixteen wasted points as
    // sixteen in the core — `checkSynergyRoles` reads packages for exactly this
    // reason.
    const scopes: { label: string; allocations: readonly AllocationLike[] }[] = [
      { label: "core", allocations: build.skills },
      ...(build.skillPackages ?? []).flatMap((group) =>
        group.packages.map((pkg) => ({ label: `package ${pkg.id}`, allocations: pkg.skills })),
      ),
    ];

    for (const scope of scopes) {
      for (const allocation of scope.allocations) {
        if (!allocation.skill.endsWith("-mastery")) continue;
        if (allocation.points <= 0) continue;
        found.push({
          rule: "war-cry-given-a-mastery",
          where,
          message:
            `${where}/${build.slug} (${scope.label}): allocates ${allocation.points} points to ` +
            `${allocation.skill}, but ${build.primarySkill} carries no \`SrcDam\` — it deals no weapon ` +
            `damage, so a weapon mastery raises nothing. Those points look diligent and buy zero.`,
        });
      }
    }
  }
  return found;
}
