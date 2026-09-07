/**
 * The difference between a number you have and a number you are heading toward.
 *
 * WHAT HAPPENED
 * -------------
 * Six sentences shipped stating a diminishing skill's **Max** parameter as a
 * figure the character has. "Weapon Block at twenty gives a 65% block chance."
 * "A 25% chance of a critical hit." Every gate in `npm run check` stayed green,
 * because 65 and 25 *are* the numbers on those rows — `Param2` on Weapon Block,
 * `Param6` on Claw Mastery. Every check in this repository asks whether a number
 * agrees with the tables, and these did.
 *
 * What was wrong was the grammar around them. The game writes those two skills
 * as `dm12` and `dm56`, its diminishing column, where the first parameter is a
 * floor and the second is a ceiling the curve climbs toward. Twenty hard points
 * is a long way below it. The block figure was the justification for a faster-
 * hit-recovery breakpoint recommendation, so it was a number a reader spends
 * gear slots on.
 *
 * See `docs/proposals/assassin-8-diminishing-params-stated-as-achieved.md`, and
 * `content/classes/skill-param-bounds.ts` for the extraction this reads.
 *
 * WHAT IS GATED
 * -------------
 * Two rules, run over every string the site publishes in both locales:
 *
 *   diminishing-bound-stated-as-achieved     a sentence that pairs a skill with
 *                                            its own diminishing ceiling and no
 *                                            word that says it is a ceiling
 *   diminishing-bound-does-not-match-the-data
 *                                            a sentence that correctly hedges a
 *                                            ceiling and then quotes a figure
 *                                            that is not on the row
 *
 * The second exists because the first can be satisfied by writing "up to" in
 * front of a wrong number, and a hedged wrong number is worse than an unhedged
 * right one: it reads as though somebody checked.
 *
 * HOW A CLAIM IS MATCHED TO A SKILL
 * ---------------------------------
 * Never by the number alone. Four of the six original sentences never name the
 * skill they are about — a skill-plan entry is `{ skill: "weapon-block", note }`
 * and a `skillNotes` map is keyed by slug, so the surrounding *shape* is the
 * only thing that says which skill a note belongs to. `claimEntriesFor` walks
 * that shape and scopes each string to the slug that owns it; the rule then adds
 * any skill the sentence names outright, using the names the site publishes.
 *
 * THREE DELIBERATE NARROWINGS
 * ---------------------------
 * **The figure must be written as a percentage.** A bare `65` in a sentence
 * about Weapon Block is far more often a level, an item roll or a range endpoint
 * than a claim about the block ceiling. Requiring the `%` is what keeps the rule
 * off the twelve thousand other numbers on this site.
 *
 * **Only bounds the game labels as percentages participate.** Twelve of the 115
 * diminishing records are radii, durations, widths and counts — Cloak of
 * Shadows' `Radius Max` is 20, and a page saying "20%" about Cloak of Shadows is
 * not talking about its radius. Those twelve are a blind spot on purpose;
 * `BLIND_SPOTS` names them.
 *
 * **Range endpoints are not claims.** "de 15% a 75%" and "20-65 damage" state a
 * span, not a ceiling, and the second number in one is not a bound being
 * asserted.
 *
 * WHAT IS NOT GATED, AND CANNOT BE
 * --------------------------------
 * A skill whose bounds live only behind an opaque engine call — `math`, `macr`,
 * `madm` — carries no record, so nothing here can see it. Claw Mastery is
 * covered only because its *skill* row spells the same three values out as
 * `ln12`, `ln34` and `dm56` where its description row uses the opaque calls. See
 * `SKILL_PARAM_BOUNDS_UNRESOLVED` for the ten tokens the extraction refuses to
 * guess at.
 */
import { allSkills } from "../content/classes";
import {
  SKILL_PARAM_BOUNDS,
  SKILL_PARAM_BOUNDS_UNRESOLVED,
  type SkillParamBound,
} from "../content/classes/skill-param-bounds";

/**
 * Skills the extraction knows it does not fully cover.
 *
 * Throwing Mastery's no-consume chance is `dm91`, which a one-digit index
 * cannot tell apart from a reference to `Param10` — and `Param10` is 66, which
 * is the figure the Barbarian page publishes. The extraction refuses to guess,
 * so the mismatch rule must refuse to accuse: a skill with an unresolved token
 * has bounds this file cannot enumerate, and "not among the maxima I know" is
 * not the same claim there.
 */
const unresolved = new Set(SKILL_PARAM_BOUNDS_UNRESOLVED.map((g) => g.skillSlug));

export const DIMINISHING_RULES = [
  "diminishing-bound-stated-as-achieved",
  "diminishing-bound-does-not-match-the-data",
] as const;
export type DiminishingRule = (typeof DIMINISHING_RULES)[number];

/** One scope of publishable strings: a page, or one skill's corner of a page. */
export interface ClaimEntry {
  readonly locale: string;
  /** The content path, e.g. `en-us/build/dragon-tail`. */
  readonly path: string;
  /** Skill slugs the surrounding structure scopes these strings to. */
  readonly skills: readonly string[];
  readonly lines: readonly string[];
}

export interface DiminishingProblem {
  readonly rule: DiminishingRule;
  readonly locale: string;
  readonly path: string;
  readonly where: string;
  readonly skillSlug: string;
  readonly bound: number;
  readonly family: "diminishing";
  readonly token: string;
  readonly message: string;
}

type Bounds = Record<string, SkillParamBound>;

/**
 * The artifact has to be there, and has to still mean what it says.
 *
 * A content rule that reads a generated file has a failure mode the rule itself
 * cannot see: the file goes missing, or a record is edited by hand, and the
 * sweep reports zero problems because it found nothing to check. Zero problems
 * and no data are the same output. So the shape is asserted before any prose is
 * read, and a broken artifact throws rather than passing quietly.
 */
export function assertBoundsUsable(bounds: Bounds): void {
  const keys = Object.keys(bounds);
  if (keys.length === 0) {
    throw new Error(
      "SKILL_PARAM_BOUNDS is empty. The generated artifact is missing or was emptied; " +
        "regenerate it with `npx tsx scripts/skill-param-bounds.ts`. A content sweep over no " +
        "bounds reports no problems, which is indistinguishable from a clean site.",
    );
  }
  for (const key of keys) {
    const r = bounds[key];
    if (key !== `${r.classSlug}/${r.skillSlug}/${r.source}/${r.column}/${r.token}`) {
      throw new Error(
        `${key}: the key no longer restates its own record's coordinate (${r.classSlug}/` +
          `${r.skillSlug}/${r.source}/${r.column}/${r.token}). The artifact was edited by hand.`,
      );
    }
    const expected = r.token.startsWith("dm") ? "diminishing" : "linear";
    if (r.family !== expected) {
      throw new Error(
        `${key}: the record is labelled ${r.family} and its token is \`${r.token}\`, which the ` +
          `game uses for the ${expected} family. One of the two is wrong, and the whole point of ` +
          `this rule is that the difference between them is not cosmetic.`,
      );
    }
    if (r.family === "diminishing" && (typeof r.minimum !== "number" || typeof r.maximum !== "number")) {
      throw new Error(`${key}: a diminishing record without a numeric minimum and maximum.`);
    }
    if (r.family === "linear" && (typeof r.base !== "number" || typeof r.perLevel !== "number")) {
      throw new Error(`${key}: a linear record without a numeric base and per-level value.`);
    }
  }
}

// ---------------------------------------------------------------------------
// Naming a skill
// ---------------------------------------------------------------------------

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The names the site publishes, not the identifiers in the tables.
 *
 * Ten of them differ from a title-cased slug — "Fist of the Heavens",
 * "Hex: Bane" — so the registry is the source rather than the slug.
 *
 * Matched case-sensitively, which is the point: `avoid`, `evade`, `dodge`,
 * `hunger` and `conversion` are ordinary English words and ordinary Portuguese
 * sentences are full of them. The site writes a skill as a proper noun.
 */
const nameOf = new Map<string, string>(allSkills.map((s) => [s.slug, s.name]));

function namePattern(slug: string): RegExp {
  const name = nameOf.get(slug);
  /*
   * The slug is an alternative only when it is hyphenated. `weapon-block` in a
   * sentence is unambiguously the skill; `pierce` is an ordinary verb, and the
   * Throwing Mastery page saying "it also grants pierce" is not a claim about
   * the Amazon's Pierce.
   */
  const alternatives = [
    ...(name ? [escape(name).replace(/\\?\s+/g, "\\s+")] : []),
    ...(slug.includes("-") ? [escape(slug)] : []),
  ];
  return new RegExp(`(?:${alternatives.join("|")})`, "g");
}

/** Skill names are English in both locales — see ADR 0003 — so one index serves both. */
const patternFor = new Map<string, RegExp>();

// ---------------------------------------------------------------------------
// The prose
// ---------------------------------------------------------------------------

/**
 * Sentence boundaries, as in `freeze-length-claims.ts`.
 *
 * The rule runs per sentence rather than per string because these strings are
 * paragraphs, and a skill named five sentences away from a number is not a claim
 * about that number.
 */
const sentencesIn = (line: string): string[] =>
  line.split(/(?<=[.!?])\s+|\n+|\s+—\s+/).filter((s) => s.trim().length > 0);

/**
 * Wording that says a figure is a ceiling rather than a holding.
 *
 * Both locales in one list. Over-broad on purpose: a hedge makes the rule
 * silent, so a word wrongly counted as one costs a missed defect, while a hedge
 * wrongly left out costs a false accusation against correct prose. The first is
 * recoverable by reading; the second teaches authors to ignore the gate.
 */
const HEDGE =
  /\b(?:up\s+to|toward|towards|climb(?:s|ing)?\s+toward|approach(?:es|ing)?|ceiling|cap(?:s|ped)?\s+at|capped|maxim(?:um|a)|max\b|at\s+most|as\s+(?:much|high|far)\s+as|no\s+higher\s+than|asymptot|never\s+reach|short\s+of|diminish(?:ing|es)|at[ée]|em\s+dire[çc][ãa]o\s+a|rumo\s+a|teto|no\s+m[áa]ximo|m[áa]xim[oa]|limite|aproxima|nunca\s+alcan[çc]a|chega\s+perto|decrescente|subindo\s+(?:em|at[ée]|para))/i;

/** A hedge immediately in front of a figure — "up to 65%", "em direção a 65%", "teto de 65%". */
const HEDGED_FIGURE =
  /(?:up\s+to|toward|towards|approaching|ceiling\s+of|capped\s+at|at\s+most|no\s+higher\s+than|at[ée]|em\s+dire[çc][ãa]o\s+a(?:o)?(?:\s+teto\s+de)?|rumo\s+a(?:o)?|teto\s+de|no\s+m[áa]ximo\s+de|m[áa]ximo\s+de)\s+(\d+(?:[.,]\d+)?)\s*%/gi;

/**
 * The number is the second end of a span rather than a bound being asserted.
 *
 * "de 15% a 75% de dano aprimorado" and "20-65 damage" both state a range, and
 * "-40 to -60%" states one with signs on both ends. The separator list stops at
 * the ones that join two numbers on their own; `and` and `e` are left out
 * because "20% e 65%" is two figures rather than one span — they come back only
 * behind an explicit `between`/`entre`, where they cannot be anything else.
 */
const RANGE_END = /\d\s*%?\s*(?:[-–—]|to|a|at[ée])\s*[-+−]?\s*$/i;
const BETWEEN_END = /\b(?:between|entre)\s+[\d.,]+\s*%?\s*(?:and|e)\s*$/i;

/**
 * An achieved-value construction: the grammar that turns a number into a holding.
 *
 * This is the proposal's own formulation — "a `dm` parameter's Max should not
 * appear next to 'at twenty' or a bare 'is'" — and it is required only where the
 * claim is attributed by *naming* the skill. A note whose structural scope is
 * the skill needs no verb: "65% block chance with two claws and no shield" is a
 * bare noun phrase, and it was one of the six.
 *
 * `grants` and `concede` are deliberately absent. They are how this site
 * introduces what an *item* gives you, and "a Fanaticism aura and 40% attack
 * speed" is Beast's own affix standing next to Beast's own aura.
 */
const ACHIEVED_CUE =
  /\b(?:is|are|was|were|gives?|granting|has|have|reach(?:es|ed)?|rises?\s+to|climbs?\s+to|becomes?|sits?\s+at|runs?\s+at|ends?\s+at|spends?|maxed|at\s+(?:twenty|nineteen|eighteen|max|\d{1,2})|to\s+(?:twenty|nineteen|eighteen|\d{1,2})|\d{1,2}\s+(?:hard\s+)?points?)\b|\b(?:é|s[ãa]o|d[áa]|d[ãa]o|t[eê]m|fica|chega\s+a|sobe\s+para|vai\s+a|alcan[çc]a|em\s+(?:vinte|dezenove|dezoito|\d{1,2})|a\s+(?:vinte|\d{1,2})|\d{1,2}\s+pontos?|maximizad[oa])\b/i;

/**
 * Only bounds the game itself labels as percentages.
 *
 * Twelve of the diminishing records are radii, durations, widths and counts.
 * A page writing "20%" near Cloak of Shadows is not claiming its `Radius Max`.
 */
const isPercentBound = (r: SkillParamBound) =>
  r.family === "diminishing" && r.labels.some((l) => l.includes("%"));

/** The twelve bounds the percentage narrowing deliberately gives up on. */
export function blindSpots(bounds: Bounds = SKILL_PARAM_BOUNDS): SkillParamBound[] {
  return Object.values(bounds).filter((r) => r.family === "diminishing" && !isPercentBound(r));
}

interface Indexed {
  /** Percent-labelled diminishing records, by skill slug. */
  readonly diminishing: Map<string, SkillParamBound[]>;
  /** Every linear record, by skill slug, so an achieved value is recognisable as one. */
  readonly linear: Map<string, SkillParamBound[]>;
  readonly slugs: readonly string[];
}

function indexBounds(bounds: Bounds): Indexed {
  const diminishing = new Map<string, SkillParamBound[]>();
  const linear = new Map<string, SkillParamBound[]>();
  for (const r of Object.values(bounds)) {
    const into = r.family === "linear" ? linear : isPercentBound(r) ? diminishing : undefined;
    if (!into) continue;
    const list = into.get(r.skillSlug);
    if (list) list.push(r);
    else into.set(r.skillSlug, [r]);
  }
  return { diminishing, linear, slugs: [...diminishing.keys()].sort() };
}

/** Values a linear column genuinely reaches somewhere between one point and its cap. */
function linearValues(records: readonly SkillParamBound[]): Set<number> {
  const out = new Set<number>();
  for (const r of records) {
    if (r.family !== "linear") continue;
    const cap = r.maxLevel > 0 ? r.maxLevel : 20;
    for (let level = 1; level <= cap; level++) out.add(r.base + r.perLevel * (level - 1));
  }
  return out;
}

/** Where `value` is written as a percentage, ignoring the far end of a span. */
function percentageAt(sentence: string, value: number): number[] {
  const pattern = new RegExp(`(?<![\\d.,])${value}\\s*%`, "g");
  const at: number[] = [];
  for (const match of sentence.matchAll(pattern)) {
    const before = sentence.slice(Math.max(0, match.index - 20), match.index);
    if (RANGE_END.test(before) || BETWEEN_END.test(before)) continue;
    at.push(match.index);
  }
  return at;
}

/** Where a skill's published name appears in a sentence. */
function nameAt(sentence: string, slug: string): number[] {
  let pattern = patternFor.get(slug);
  if (!pattern) {
    pattern = namePattern(slug);
    patternFor.set(slug, pattern);
  }
  pattern.lastIndex = 0;
  return [...sentence.matchAll(pattern)].map((m) => m.index);
}

/**
 * A figure is attributed to a skill the sentence *names* only when the name
 * comes first and an achieved-value construction sits between the two.
 *
 * Both halves earn their place against text that shipped. Buriza's "100%
 * Piercing Attack for free, which lets a levelling Amazon skip Pierce entirely"
 * names Pierce after the figure, and the 100 is the crossbow's. The minions
 * page's "a Fire Golem's own 100% fire" names it before, and carries no verb
 * that makes 100 a holding — that sentence is about a minion's resistance
 * ceiling, which is also 100 and is not this column.
 */
function attributedByName(sentence: string, slug: string, figureAt: number): boolean {
  const names = nameAt(sentence, slug).filter((i) => i < figureAt);
  if (names.length === 0) return false;
  const between = sentence.slice(Math.max(...names), figureAt);
  return ACHIEVED_CUE.test(between);
}

export function checkDiminishingClaims(
  entries: readonly ClaimEntry[],
  bounds: Bounds = SKILL_PARAM_BOUNDS,
): DiminishingProblem[] {
  assertBoundsUsable(bounds);
  const index = indexBounds(bounds);
  const problems: DiminishingProblem[] = [];

  for (const entry of entries) {
    const scoped = entry.skills.filter((s) => index.diminishing.has(s));
    for (const line of entry.lines) {
      for (const sentence of sentencesIn(line)) {
        const named = index.slugs.filter((slug) => nameAt(sentence, slug).length > 0);
        const candidates = [...new Set([...scoped, ...named])];
        if (candidates.length === 0) continue;
        const hedged = HEDGE.test(sentence);

        // Rule 1 — the ceiling stated as a holding.
        if (!hedged) {
          for (const slug of candidates) {
            const achieved = linearValues(index.linear.get(slug) ?? []);
            for (const record of index.diminishing.get(slug) ?? []) {
              if (record.family !== "diminishing") continue;
              /*
               * A figure a linear column on the same skill genuinely reaches is
               * a figure the page may state flatly. Claw Mastery's `ln34`
               * reaches 111 and its `dm56` ceiling is 25; only the second is a
               * claim about a bound.
               */
              if (achieved.has(record.maximum)) continue;
              const where = percentageAt(sentence, record.maximum);
              const claimed = where.some(
                (at) => scoped.includes(slug) || attributedByName(sentence, slug, at),
              );
              if (!claimed) continue;
              problems.push(violation("diminishing-bound-stated-as-achieved", entry, record, sentence));
            }
          }
        }

        // Rule 2 — a hedged figure attributed to a skill whose row does not carry it.
        HEDGED_FIGURE.lastIndex = 0;
        for (const match of sentence.matchAll(HEDGED_FIGURE)) {
          const figure = Number(match[1].replace(",", "."));
          for (const slug of named) {
            if (unresolved.has(slug)) continue;
            const records = (index.diminishing.get(slug) ?? []).filter(
              (r): r is SkillParamBound & { family: "diminishing" } => r.family === "diminishing",
            );
            if (records.length === 0) continue;
            if (records.some((r) => r.maximum === figure)) continue;
            if (!attachedToName(sentence, slug, match.index)) continue;
            problems.push(
              violation("diminishing-bound-does-not-match-the-data", entry, records[0], sentence, figure),
            );
          }
        }
      }
    }
  }
  return problems;
}

/**
 * How close a hedged figure has to sit to a skill's name to be its ceiling.
 *
 * Pages hedge a great many percentages that are nobody's `dm` bound — the
 * player's 75% resistance cap, an 85% maximum-resistance line, a 65% faster
 * cast breakpoint — and every one of those shares a sentence with some skill
 * sooner or later. So the figure must follow the name inside the same clause:
 * no comma, semicolon or colon between them, and not far enough away to have
 * changed subject.
 *
 * "Weapon Block climbing toward 58%" is a claim about Weapon Block. "Fanaticism
 * online, Holy Shield running, resistances heading toward 75%" is not a claim
 * about either of them.
 */
const CLAUSE_BREAK = /[,;:—]/;
const ATTACHMENT_WINDOW = 40;

function attachedToName(sentence: string, slug: string, figureAt: number): boolean {
  const names = nameAt(sentence, slug).filter((i) => i < figureAt);
  if (names.length === 0) return false;
  const name = nameOf.get(slug) ?? slug;
  const from = Math.max(...names) + name.length;
  if (figureAt - from > ATTACHMENT_WINDOW) return false;
  return !CLAUSE_BREAK.test(sentence.slice(from, figureAt));
}

function violation(
  rule: DiminishingRule,
  entry: ClaimEntry,
  record: SkillParamBound & { family: "diminishing" },
  sentence: string,
  quoted?: number,
): DiminishingProblem {
  const name = nameOf.get(record.skillSlug) ?? record.skillSlug;
  const [a, b] = record.parameters;
  const quote = sentence.trim().slice(0, 140);
  const coordinate = `\`${record.token}\` in ${record.source}'s \`${record.column}\``;
  const message =
    rule === "diminishing-bound-stated-as-achieved"
      ? `${entry.path}: states ${name}'s Param${b} = ${record.maximum} as a figure the character ` +
        `has — "${quote}". ${coordinate} is the game's diminishing column: Param${a} = ` +
        `${record.minimum} ("${record.labels[0]}") is the floor and Param${b} = ${record.maximum} ` +
        `("${record.labels[1]}") is the ceiling the curve climbs toward, not a value ${record.maxLevel} ` +
        `hard points reach. Say it is a ceiling — "up to ${record.maximum}%", "climbing toward ` +
        `${record.maximum}%", "em direção a ${record.maximum}%", "até ${record.maximum}%".`
      : `${entry.path}: quotes ${quoted}% as ${name}'s ceiling — "${quote}". The row does not ` +
        `carry that number: ${coordinate} gives Param${b} = ${record.maximum} ` +
        `("${record.labels[1]}"). Quote the figure the column states, or name the skill the ` +
        `figure actually belongs to.`;
  return {
    rule,
    locale: entry.locale,
    path: entry.path,
    where: entry.path,
    skillSlug: record.skillSlug,
    bound: record.maximum,
    family: "diminishing",
    token: record.token,
    message,
  };
}

// ---------------------------------------------------------------------------
// Reading the skill context out of the shape of the content
// ---------------------------------------------------------------------------

/**
 * Splits one entity into scopes, so a note knows which skill it is about.
 *
 * Two shapes carry that, and both are structural rather than textual:
 *
 *   `{ skill: "weapon-block", points: 20, note: "…" }`   a skill-plan entry
 *   `{ skillNotes: { "weapon-block": "…" } }`            a map keyed by slug
 *
 * Everything else lands in the page-level scope, where a claim has to name its
 * own skill to be judged. Written generically rather than against the `Build`
 * type on purpose: the six sentences that shipped were spread over a skill plan,
 * a package, a breakpoint's `why` and a summary, and a walker that knows only
 * the shapes it was told about is a walker that misses the next one.
 */
export function claimEntriesFor(
  entity: unknown,
  locale: string,
  path: string,
  bounds: Bounds = SKILL_PARAM_BOUNDS,
): ClaimEntry[] {
  const known = new Set(Object.values(bounds).map((r) => r.skillSlug));
  const buckets = new Map<string, { skills: string[]; lines: string[] }>();

  const push = (scope: readonly string[], value: string) => {
    const key = [...scope].sort().join(",");
    const bucket = buckets.get(key) ?? { skills: [...scope].sort(), lines: [] };
    bucket.lines.push(value);
    buckets.set(key, bucket);
  };

  const walk = (value: unknown, scope: readonly string[]) => {
    if (typeof value === "string") {
      push(scope, value);
      return;
    }
    if (Array.isArray(value)) {
      for (const v of value) walk(v, scope);
      return;
    }
    if (!value || typeof value !== "object") return;

    const record = value as Record<string, unknown>;
    /*
     * `skill` is a skill-plan entry's reference; `slug` is a skill entity's own
     * identity, which is what puts a skill page's whole body in its own scope.
     * The Golem Mastery page states its `Param4 = 40` velocity ceiling
     * correctly and named no skill at all while doing it.
     */
    const here = [
      record.skill,
      // `slug` alone is not enough: the Pierce *mechanics article* is
      // `slug: "pierce"` and its tables are full of percentages that belong to
      // items and to breakpoints. Only a skill entity declares the tree it
      // sits in, and only a skill entity's body is about that skill.
      typeof record.tree === "string" ? record.slug : undefined,
    ].filter((v): v is string => typeof v === "string" && known.has(v));
    const own = here.length > 0 ? here : scope;
    for (const [key, child] of Object.entries(record)) {
      walk(child, known.has(key) ? [key] : own);
    }
  };

  walk(entity, []);
  return [...buckets.values()].map(({ skills, lines }) => ({ locale, path, skills, lines }));
}
