/**
 * Editorial controls for the immunity model, as pure functions.
 *
 * `necromancer-claims.ts` already owns the arithmetic — `applyResistanceCurse`
 * and `deepestBreakable` — and deliberately scoped its prose rules to physical
 * immunity and the two curses that lower it. Its own comment says why:
 *
 *   > Whether the same arithmetic redeems a mastery or an elemental reduction
 *   > is a separate question about separate sources, and a gate that answered
 *   > it here would be asserting something this pass did not verify.
 *
 * That question is now answered, and the answer is that the arithmetic does
 * **not** transfer. The game has two rules where the site had one:
 *
 * - **Curses and auras can break an immunity.** They are cut to one fifth while
 *   it stands and they still break it when a fifth is enough. Amplify Damage
 *   reaches 119%, Decrepify 109%, Lower Resist 104% from a bare point and 113%
 *   at its published ceiling.
 * - **Masteries and `-% to Enemy Resistance` cannot break one at any value.**
 *   They are applied after the immunity check, and that step is skipped while
 *   the immunity stands. They are not reduced there; they are absent. Cold
 *   Mastery lands at one fifth *after* another source has broken it (Patch
 *   2.6); item pierce lands at full.
 *
 * The site had asserted the first rule for both categories, which produced two
 * separate falsehoods: a worked example that refuted itself (a -20% reduction
 * called "nowhere near enough to bring 110% resistance below 100%", when
 * 110 - 20 is 90), and a Poison Nova plan that put Lower Resist and Death's Web
 * under one verdict when only one of them breaks anything.
 *
 * These rules exist so neither shape comes back. Nothing is imported from
 * content: the caller supplies the strings, and `immunity.test.ts` hands these
 * functions the sentences the repository actually shipped.
 *
 * Game stat strings and skill names are identical in both locales by ADR 0003,
 * so one pattern covers both languages wherever the load-bearing token is a
 * game string. Where it is a verb or a quantifier, both languages are listed.
 */
import {
  IMMUNITY_THRESHOLD,
  IMMUNE_EFFECTIVENESS_DIVISOR,
  type ResistanceCurse,
  sentencesOf,
} from "./necromancer-claims";

export interface ImmunityProblem {
  rule:
    | "pierce-applied-to-an-immune"
    | "pierce-breaks-immunity"
    | "immunity-agents-equated"
    | "immunity-agents-not-distinguished"
    | "insufficiency-arithmetic-wrong";
  message: string;
}

// ===========================================================================
// Lower Resist, derived the same way the two physical curses are
// ===========================================================================

/*
 * The two ends of the band the site publishes for Lower Resist — "climbs from
 * 25% toward a 70% ceiling" — rather than a level table.
 *
 * Both divide by five exactly, which is the reason to pin the ends rather than
 * an intermediate level: whether the engine floors or rounds a fractional fifth
 * is not established here, and a control that depended on the answer would be
 * asserting it. -25 gives -5 and -70 gives -14 under either rule.
 */
export const LOWER_RESIST_FLOOR: ResistanceCurse = { name: "Lower Resist (one point)", nominal: 25 };
export const LOWER_RESIST_CEILING: ResistanceCurse = { name: "Lower Resist (ceiling)", nominal: 70 };

/**
 * What each category is worth against a target that is **still** immune.
 *
 * The pierce rows are the point of the table: zero, not a fifth. A reader who
 * remembers only one thing about this model should remember that a mastery and
 * a facet are not weak against an immune, they are inert.
 */
export const IMMUNITY_AGENTS: readonly {
  readonly name: string;
  readonly breaksImmunity: boolean;
  /** Multiplier applied while the target is still immune. */
  readonly whileImmune: number;
  /** Multiplier applied once some other source has broken the immunity. */
  readonly afterBreak: number;
}[] = [
  { name: "Amplify Damage", breaksImmunity: true, whileImmune: 1 / 5, afterBreak: 1 / 5 },
  { name: "Decrepify", breaksImmunity: true, whileImmune: 1 / 5, afterBreak: 1 / 5 },
  { name: "Lower Resist", breaksImmunity: true, whileImmune: 1 / 5, afterBreak: 1 / 5 },
  { name: "Conviction", breaksImmunity: true, whileImmune: 1 / 5, afterBreak: 1 / 5 },
  { name: "Cold Mastery", breaksImmunity: false, whileImmune: 0, afterBreak: 1 / 5 },
  { name: "-% to Enemy Resistance", breaksImmunity: false, whileImmune: 0, afterBreak: 1 },
];

// ===========================================================================
// The vocabulary the rules are scoped by
// ===========================================================================

/** Either minus sign. Content uses U+2212; an author's keyboard produces U+002D. */
const MINUS = "[-−]";

/**
 * Effects the game applies *after* deciding whether the monster is immune.
 *
 * Fire and Lightning Mastery are in the list even though they do not reduce
 * enemy resistance at all, because the sentence this rule exists to reject
 * claimed that they did.
 */
const PIERCE_SOURCE = new RegExp(
  [
    "\\b(?:Cold|Fire|Lightning) Mastery\\b",
    "\\bmasteries\\b",
    "\\bmastery\\b",
    "\\bmaestria\\w*\\b",
    "Death.s Web",
    "Griffon.s Eye",
    "\\bThunderstroke\\b",
    "\\bfacets?\\b",
    `${MINUS}\\s?\\d*\\s?-?\\s?\\d*\\s?%?\\s?(?:to\\s+)?Enemy (?:\\w+ )?Resistance`,
    "Enemy (?:Poison|Fire|Cold|Lightning) Resistance",
    `${MINUS}\\s?resist\\w*`,
    "resist[êe]ncia a \\w+ do inimigo",
  ].join("|"),
  "i",
);

/** Effects that can break one. Kept apart from the list above on purpose. */
const BREAKING_SOURCE =
  /\bAmplify Damage\b|\bDecrepify\b|\bLower Resist\b|\bConviction\b|\bSunder Charm\b|\bGrim Ward\b/i;

/**
 * "Immune", and the site's own periphrasis for it.
 *
 * The curses article never used the word: it said "a target whose base value of
 * the resistance being lowered is already 100 or more", and that sentence is
 * where the two rules were conflated most explicitly. A rule that only knows
 * the word misses the paragraph that defines it.
 */
const IMMUNE =
  /\bimmune\b|\bimmunity\b|\bimmunities\b|\bimune\b|\bimunidade\w*\b|\b100%? or more\b|\b100%? or above\b|\bat least 100%?\b|\b100%? ou mais\b|\b100%? ou acima\b/i;

/** "one fifth", in every form the site writes it. */
const A_FIFTH = /\bone[- ]fifth\b|\bone fifth\b|\ba fifth\b|\bum quinto\b|\b1\/5\b|\b20%\s+effectiveness\b/i;

/**
 * A marker that the sentence is talking about *after* the break rather than
 * during it. This is what keeps the corrected prose green: "the mastery then
 * lands on the result, at one fifth of its value" is true and must pass, while
 * "against an already-immune monster it is applied at one fifth" is false and
 * must not.
 */
const POST_BREAK =
  /\bafter\b[^]{0,60}?\bbrok\w*|\bonce\b[^]{0,60}?\bbrok\w*|\bhas broken\b|\bhave broken\b|\bis broken\b|\bwas broken\b|\bbeen broken\b|\bat full value\b|\bcom valor cheio\b|\bvalor cheio\b|\bdepois\b[^]{0,60}?\bquebr\w*|\bassim que\b[^]{0,60}?\bquebr\w*|\btiver quebrado\b|\bj[áa] quebrada\b/i;

/*
 * `sunder` is deliberately **not** a post-break marker.
 *
 * It reads like one, and it is the reason a first draft of this rule found
 * nothing: every page that got the model wrong also recommended a Sunder Charm
 * two sentences later, so treating the word as an exemption made the gate
 * silent on exactly the pages it was written for. "Lands at full value" is a
 * safe marker instead — pierce is only ever worth its full value after a break,
 * so a sentence saying so is describing the right half of the model.
 */

const BREAK_VERB = /\bbreaks?\b|\bbreaking\b|\bbroken\b|\bquebra\w*\b/i;

/**
 * The sentence is contrasting the two categories rather than conflating them,
 * which is what the correction reads like: "a curse is cut to a fifth **while**
 * a mastery is not applied at all".
 */
const CONTRASTS =
  /\bunlike\b|\bwhereas\b|\bwhile\b|\bnot the rule\b|\bao contr[áa]rio\b|\benquanto\b|\bao passo que\b|\bdiferente de\b/i;

/**
 * The sentence denies that the pierce source is applied at all — which is the
 * true statement, not the false one.
 *
 * Scoped to denials of *application*. A denial of *breaking* is deliberately
 * absent: "Cold Mastery does not break immunity — against a cold-immune monster
 * it operates at one fifth effectiveness" is a sentence that gets the headline
 * right and the mechanic wrong, and it is one of the five that shipped.
 */
const DENIES_APPLICATION =
  /\bnot (?:be )?applied\b|\bdoes ?n[o']t apply\b|\bcannot apply\b|\bis absent\b|\bskipped\b|\bdoes nothing\b|\bnothing at all\b|\bnot [^.]{0,20}at all\b|\bno \w+ at all\b|\bn[ãa]o (?:é|s[ãa]o|for) aplicad\w*\b|\bn[ãa]o se aplica\b|\bpulad\w*\b|\bignorad\w*\b|\bausente\b|\bde forma alguma\b|\babsolutamente nada\b|\bn[ãa]o faz nada\b|\bn[ãa]o tem \w+ nenhum\w*\b|\bsem Mastery\b/i;

/**
 * A denial that has been hedged into an approximation, which is not a denial.
 *
 * "It does almost nothing" and "ela quase não faz nada" are the sentences the
 * Frost Nova page shipped in each locale, and both are wrong in the same way:
 * against a cold immune the mastery does exactly nothing. The English hedge
 * survived the first draft of `DENIES_APPLICATION` by accident — "does nothing"
 * does not match "does almost nothing" — and the Portuguese one did not,
 * because the hedge sits before the negation there. So the hedge is named.
 */
const HEDGED_DENIAL =
  /\balmost nothing\b|\bhardly\b|\bbarely\b|\bnext to nothing\b|\bquase n[ãa]o\b|\bpraticamente n[ãa]o\b|\bquase nada\b/i;

/**
 * "All resistance reduction", the universal quantifier that made the claim
 * false. Kept as a trigger of its own because the shipped sentence sometimes
 * carried it without naming a mastery at all.
 */
const UNIVERSAL_REDUCTION =
  /\b(?:all|every|any)\s+(?:enemy\s+)?resist\w*\s+reduction\b|\breduction of (?:any|every) kind\b|\btod[ao]\s+(?:a\s+)?redu[çc][ãa]o\b|\bqualquer redu[çc][ãa]o\b/i;

/** A belief being named as a mistake, not a claim being made. */
const MISTAKE_FRAME =
  /\bexpect\w*\b|\bassum\w*\b|\bthinking\b|\bbeliev\w*\b|\bhoping\b|\bmyth\b|\besperar\b|\bachar que\b|\bsupor\b|\bacreditar\b|\bmito\b/i;

/**
 * A pierce source standing within four words of a break verb — close enough to
 * be its subject rather than merely its neighbour.
 */
const PIERCE_NEAR_BREAK = new RegExp(
  `(?:${PIERCE_SOURCE.source})[^.!?]{0,4}?(?:\\s+\\w+){0,3}\\s+(?:breaks?|breaking|broken|quebra\\w*)\\b`,
  "i",
);

/** A negation or hedge anywhere in the sentence, in either language. */
const REFUTES =
  /\bnot\b|\bnever\b|\bno\b|\bnothing\b|\bcannot\b|\bcan't\b|\bdoes ?n[o']t\b|\bwon't\b|\bwithout\b|\brather than\b|\binstead of\b|\bn[ãa]o\b|\bnem\b|\bnunca\b|\bnenhum\w*\b|\bsem\b|\bem vez de\b/i;

// ===========================================================================
// Rule 1 — pierce described as reduced-but-present against an immune
// ===========================================================================

/**
 * The sentence shape that shipped, in five places and two locales:
 *
 *   "against an already-immune monster, all resistance reduction is applied at
 *    one fifth effectiveness"
 *
 * It is scoped to sentences that name a pierce source, because the same words
 * about a **curse** are correct and the site says them deliberately. A sentence
 * carrying a post-break marker is exempt for the same reason: after the break a
 * mastery genuinely is worth a fifth.
 */
export function checkPierceAgainstImmune(
  lines: readonly string[],
  where: string,
): ImmunityProblem[] {
  const found: ImmunityProblem[] = [];
  /*
   * Whole authored strings rather than split sentences, because the claim
   * routinely straddles a full stop: "Cold Mastery does not break immunity —
   * against a cold-immune monster it operates at one fifth effectiveness"
   * puts the subject in one clause and the falsehood in the next, and a
   * sentence-scoped rule sees a pronoun.
   *
   * The cost of the wider scope is paid by the three guards below rather than
   * by accepting false positives: a paragraph that contrasts the two
   * categories, or denies the pierce source is applied at all, or is talking
   * about the situation after a break, is the corrected prose and passes.
   */
  for (const line of lines) {
    if (!IMMUNE.test(line)) continue;
    if (!A_FIFTH.test(line)) continue;
    if (!PIERCE_SOURCE.test(line) && !UNIVERSAL_REDUCTION.test(line)) continue;
    if (POST_BREAK.test(line)) continue;
    if (CONTRASTS.test(line)) continue;
    if (DENIES_APPLICATION.test(line) && !HEDGED_DENIAL.test(line)) continue;

    found.push({
      rule: "pierce-applied-to-an-immune",
      message:
        `${where}: "${line.slice(0, 120)}…" puts a mastery or a −% to Enemy Resistance line ` +
        `at one fifth against a target that is still immune. Those are applied after the ` +
        `immunity check and skipped while it stands — they are worth nothing there, not a ` +
        `fifth. The fifth is what a curse or an aura is cut to, and what Cold Mastery is worth ` +
        `after some other source has broken the immunity.`,
    });
  }
  return found;
}

// ===========================================================================
// Rule 2 — pierce credited with breaking one
// ===========================================================================

/**
 * The mirror error, and the reason rule 1 is not enough on its own.
 *
 * Correcting "a mastery is cut to a fifth" by writing "a mastery breaks it
 * after all" would clear rule 1 and be worse than what it replaced, so the
 * overshoot is planted as a mutation and rejected here.
 */
export function checkPierceBreaksImmunity(
  lines: readonly string[],
  where: string,
): ImmunityProblem[] {
  const found: ImmunityProblem[] = [];
  for (const sentence of sentencesOf(lines)) {
    /*
     * Sentence-scoped and adjacency-scoped, the opposite of rule 1, because
     * this rule asks who the *subject* of the break verb is. "It stacks with
     * Death's Web, and it is the half of that pair that can break an immunity"
     * is a true sentence about Lower Resist that names a pierce source ten
     * words earlier, and a looser rule rejects it.
     */
    if (!PIERCE_NEAR_BREAK.test(sentence)) continue;
    if (!IMMUNE.test(sentence)) continue;
    if (REFUTES.test(sentence)) continue;
    if (CONTRASTS.test(sentence)) continue;
    // A `commonMistakes` entry names the belief in order to reject it, and the
    // rejection is usually the next sentence.
    if (MISTAKE_FRAME.test(sentence)) continue;
    // "Sunder Charms break it and the facet then applies" — the breaking source
    // is the subject, and the pierce source is the thing that follows.
    if (BREAKING_SOURCE.test(sentence)) continue;

    found.push({
      rule: "pierce-breaks-immunity",
      message:
        `${where}: "${sentence.slice(0, 120)}…" credits a mastery or a −% to Enemy Resistance ` +
        `line with breaking an immunity. Neither does, at any level and at any total. Only the ` +
        `curses that lower a resistance, Conviction and a Sunder Charm do.`,
    });
  }
  return found;
}

// ===========================================================================
// Rule 3 — Lower Resist and Death's Web given one verdict
// ===========================================================================

/** "neither helps" and its Portuguese twin, which is the sentence that shipped. */
const JOINT_NEGATION =
  /\bneither\b|\bnor\b|\bnenhum dos dois\b|\bnenhuma das duas\b|\bnem um nem outro\b|\bnem uma nem outra\b/i;

/** A verdict verb: the joint negation only matters when it governs one. */
const VERDICT_VERB =
  /\bhelps?\b|\bworks?\b|\bbreaks?\b|\bdoes\b|\bmatters?\b|\breach(?:es)?\b|\bajuda\w*\b|\bfunciona\w*\b|\bquebra\w*\b|\balcan[çc]a\w*\b|\bserve\w*\b/i;

/** The item half of the pair, named so the positive rule can look for it. */
const ITEM_PIERCE = new RegExp(
  `Death.s Web|${MINUS}\\s?\\d*\\s?-?\\s?\\d*\\s?%?\\s?(?:to\\s+)?Enemy (?:\\w+ )?Resistance`,
  "i",
);
const LOWER_RESIST = /\bLower Resist\b/i;

/**
 * Two rules over one subject, because the failure has two shapes.
 *
 * The **negative** rule rejects a joint verdict: one sentence that decides for
 * both agents at once about immunity. That is the sentence the audit found —
 * "Against something actually immune, neither helps" — and it is false in one
 * direction for one agent and true for the other.
 *
 * The **positive** rule is the house pattern from `checkCorpseExplosionClaims`:
 * a page that names both agents *and* makes a claim about breaking an immunity
 * owes the reader the distinction, in both halves. Banning the wrong sentence
 * without requiring the right one is how the page ended up silent last time.
 *
 * Scoped by the break claim on purpose. A page that mentions Lower Resist and
 * Death's Web while discussing damage owes nothing here, and a gate that made
 * it recite the model anyway would be argued with rather than obeyed.
 */
export function checkImmunityAgentsDistinguished(
  lines: readonly string[],
  where: string,
): ImmunityProblem[] {
  const found: ImmunityProblem[] = [];
  const sentences = sentencesOf(lines);

  for (const sentence of sentences) {
    if (!JOINT_NEGATION.test(sentence)) continue;
    if (!IMMUNE.test(sentence)) continue;
    if (!VERDICT_VERB.test(sentence)) continue;
    found.push({
      rule: "immunity-agents-equated",
      message:
        `${where}: "${sentence.slice(0, 120)}…" gives one verdict to both reductions against an ` +
        `immune. Lower Resist is a curse and breaks one when its fifth is enough — 104% from a ` +
        `bare point, 113% at the skill's ceiling. Death's Web breaks none of them at any roll, ` +
        `and lands at full value on whatever the curse opens. They are not a pair here.`,
    });
  }

  /*
   * The positive half reads the page as one text rather than as sentences.
   * Both halves of the distinction are routinely written across a clause
   * boundary — "Lower Resist is a curse, so it is cut to one fifth … and it
   * still breaks the immunity if that fifth is enough" puts the name and the
   * verb in different sentences — so proximity over the joined text is the
   * honest test of whether a reader would connect them.
   */
  const text = lines.join("\n");
  /*
   * The trigger is one authored string carrying **both** agents, not the page
   * carrying each of them somewhere.
   *
   * The looser test fired on the Lower Resist skill entry, whose `name` field
   * is one of the two names and whose mechanics bullet mentions the other while
   * calling the skill "it". That page is not conflating anything — a page about
   * Lower Resist may say "it" — and the conflation this rule exists to catch
   * always happens inside one paragraph, because that is where a reader forms
   * the impression that the two behave alike.
   */
  const namesBoth = lines.some((l) => LOWER_RESIST.test(l) && ITEM_PIERCE.test(l));
  const claimsABreak = sentences.some((s) => BREAK_VERB.test(s) && IMMUNE.test(s));
  if (namesBoth && claimsABreak) {
    /*
     * Tempered rather than greedy: the span between the skill's name and the
     * break verb must contain no negation. Without that, "Lower Resist is a
     * further −25% to −70% … which does **not** break the immunity" reads as a
     * credit, and the paragraph the rule exists to reject passes it.
     */
    const creditsCurse = new RegExp(
      `Lower Resist(?:(?!\\bnot\\b|\\bnever\\b|\\bcannot\\b|\\bcan't\\b|\\bn[ãa]o\\b|\\bnunca\\b|\\bnenhum)[^]){0,200}?\\b(?:breaks?|quebra\\w*)\\b`,
      "i",
    ).test(text);
    const deniesItem = new RegExp(
      `(?:${ITEM_PIERCE.source})[^]{0,200}?(?:\\bbreaks? nothing\\b|\\bnever breaks?\\b|\\bcannot break\\b|\\bdoes ?n[o']t break\\b|\\bnot applied\\b|\\bskipped\\b|\\bnothing at all\\b|\\bn[ãa]o quebra\\w*\\b|\\bn[ãa]o (?:é|s[ãa]o) aplicad\\w*\\b|\\bpulad\\w*\\b|\\bn[ãa]o faz nada\\b|\\bn[ãa]o alcan[çc]a\\b)`,
      "i",
    ).test(text);
    if (!creditsCurse || !deniesItem) {
      found.push({
        rule: "immunity-agents-not-distinguished",
        message:
          `${where}: names Lower Resist and an item's −% to Enemy Resistance, and makes a claim ` +
          `about breaking an immunity, without saying which of the two does it. ` +
          `${creditsCurse ? "" : "Missing: Lower Resist credited with breaking one. "}` +
          `${deniesItem ? "" : "Missing: the item denied it. "}` +
          `Both halves are required — the page that lost this distinction lost it by stating ` +
          `neither.`,
      });
    }
  }

  return found;
}

// ===========================================================================
// Rule 4 — "not enough" checked against subtraction
// ===========================================================================

/** A claim that a reduction falls short. */
const INSUFFICIENT =
  /\bnowhere near enough\b|\bnot (?:nearly )?enough\b|\bnever enough\b|\bfar from enough\b|\bfalls? short\b|\bdoes ?n[o']t break\b|\bcannot break\b|\bcan't break\b|\bwill not break\b|\bwon't break\b|\bnot enough to\b|\blonge de bastar\b|\bn[ãa]o bast\w*\b|\bnunca bast\w*\b|\bn[ãa]o quebra\w*\b|\bnunca quebra\w*\b|\bn[ãa]o chega\w*\b|\bn[ãa]o consegue\b/i;

/**
 * A figure the sentence is describing as a floor rather than a value.
 *
 * "Above 113% neither reaches" is a true sentence containing a resistance and
 * no claim about 113 itself, and without this guard the arithmetic rule would
 * read it as one.
 */
const OPEN_ENDED_BEFORE = /(?:above|beyond|over|past|acima de|al[ée]m de|mais de|maior que)\s*$/i;

const PERCENT_FIGURE = /(\d{2,3})\s*%/g;

/**
 * Any sentence that denies a reduction is sufficient is measured against the
 * subtraction it is denying.
 *
 * This is the rule that catches the audit's headline error. The shipped
 * sentence said a −20% reduction was "nowhere near enough to bring 110%
 * resistance below 100%", and 110 − 20 = 90. It fired nothing at the time
 * because the existing `immunity-arithmetic-wrong` rule keys on the phrase
 * "does not break" and this sentence never used it.
 *
 * Deliberately blind to *which* effect the sentence is about. An arithmetic
 * claim is wrong or right on its own terms, and the model question — whether
 * that effect reaches the target at all — is rules 1 and 2's job.
 */
export function checkInsufficiencyArithmetic(
  lines: readonly string[],
  where: string,
): ImmunityProblem[] {
  const found: ImmunityProblem[] = [];
  for (const sentence of sentencesOf(lines)) {
    if (!INSUFFICIENT.test(sentence)) continue;

    const figures: number[] = [];
    for (const match of sentence.matchAll(PERCENT_FIGURE)) {
      const before = sentence.slice(0, match.index ?? 0);
      if (OPEN_ENDED_BEFORE.test(before)) continue;
      figures.push(Number(match[1]));
    }

    for (const start of figures.filter((f) => f >= IMMUNITY_THRESHOLD)) {
      for (const reduction of figures.filter((f) => f < start)) {
        if (start - reduction >= IMMUNITY_THRESHOLD) continue;
        found.push({
          rule: "insufficiency-arithmetic-wrong",
          message:
            `${where}: "${sentence.slice(0, 120)}…" calls a reduction insufficient while naming ` +
            `${start}% and ${reduction}% in the same breath. ${start} − ${reduction} is ` +
            `${start - reduction}, which is below ${IMMUNITY_THRESHOLD} and therefore not ` +
            `immune. If the point is that the effect never reaches the target, say that instead ` +
            `— the subtraction argues the opposite.`,
        });
      }
    }
  }
  return found;
}

/** Every immunity rule, in the order the checker prints them. */
export const IMMUNITY_RULES = [
  "pierce-applied-to-an-immune",
  "pierce-breaks-immunity",
  "immunity-agents-equated",
  "immunity-agents-not-distinguished",
  "insufficiency-arithmetic-wrong",
] as const;

export function checkImmunityModelClaims(
  lines: readonly string[],
  where: string,
): ImmunityProblem[] {
  return [
    ...checkPierceAgainstImmune(lines, where),
    ...checkPierceBreaksImmunity(lines, where),
    ...checkImmunityAgentsDistinguished(lines, where),
    ...checkInsufficiencyArithmetic(lines, where),
  ];
}

export { IMMUNITY_THRESHOLD, IMMUNE_EFFECTIVENESS_DIVISOR };
