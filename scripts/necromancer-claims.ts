/**
 * Editorial controls for the Necromancer build pass, as pure functions.
 *
 * These check PROSE rather than data, which is a weaker kind of control and is
 * used here only where the claim itself is the deliverable. Same shape as
 * `amazon-rules.ts` and `necromancer-rules.ts`: nothing is imported from
 * content, the caller supplies the strings, and the tests hand these functions
 * deliberately corrupted ones.
 *
 * Three of these replace a gate that was written the wrong way round. The
 * foundation pass could not establish whether Corpse Explosion's fire half
 * takes fire-skill modifiers, so it forbade the page from mentioning them at
 * all. That was safe and it was also wrong: `+to Fire Skills` genuinely does
 * something here — the skill's element is fire in the game's own tables, so it
 * raises the effective level, and the effective level is what buys radius. A
 * rule that bans the words bans the correct sentence along with the incorrect
 * one, and the page ends up silent about a real interaction because a
 * neighbouring one is unresolved.
 *
 * So the ban is replaced by three requirements. The page must distinguish the
 * **skill level** from the **radius** from the **damage percentage**, must say
 * which of them `+to Fire Skills` moves, and must still not present Fire
 * Mastery or `+% Fire Skill Damage` as a direct increase. Naming the three
 * quantities is what makes the fourth rule narrow enough to be honest.
 *
 * Game stat strings and skill names are identical in both locales by ADR 0003,
 * so one pattern covers both languages wherever the load-bearing token is a
 * game string. Where the load-bearing token is a verb, both languages' verbs
 * are listed.
 */

export interface ClaimProblem {
  rule:
    | "ce-radius-not-tied-to-level"
    | "ce-percentage-not-protected"
    | "ce-fire-tag-not-explained"
    | "ce-unsupported-fire-modifier-claim"
    | "golem-expensive-item-recommended"
    | "golem-losses-not-stated"
    | "summon-difficulty-penalty-claimed"
    | "summon-penalty-not-corrected"
    | "revive-gets-summon-resist"
    | "unlock-level-wrong"
    | "decrepify-cannot-break-immunity"
    | "only-amplify-breaks-immunity"
    | "immunity-arithmetic-wrong"
    | "quest-points-banked-but-spent";
  message: string;
}

/**
 * Splits authored prose into sentence-ish units so a rule can scope itself.
 *
 * The `\*{0,2}` matters more than it looks. Site prose is markdown, and a bold
 * lead-in ends `…level 24.** Halving a boss's…` — a full stop followed by the
 * closing asterisks rather than by whitespace. Without it, that whole paragraph
 * stays one "sentence", and any rule that reasons about two terms appearing
 * together starts firing on terms a reader would never connect.
 */
export function sentencesOf(lines: readonly string[]): string[] {
  return lines
    .flatMap((line) => line.split(/(?<=[.!?;:])\*{0,2}\s+|\s+—\s+|\n+/))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * A negation or hedge anywhere in the sentence, in either language.
 *
 * Every rule below is scoped by a sentence containing both halves of a claim.
 * This is what lets a page carry "never feed it a Pride" and "summons do not
 * take the penalty" while the same rules still reject the assertions.
 */
const REFUTES =
  /\bnot\b|\bnever\b|\bno\b|\bnothing\b|\bcannot\b|\bwithout\b|\brather than\b|\binstead of\b|\bnão\b|\bnem\b|\bnunca\b|\bnenhum\b|\bnenhuma\b|\bsem\b|\bem vez de\b/i;

/**
 * The two modifiers whose effect on the fire half is still unestablished, and
 * the words that would turn a mention of one into a claim about it.
 */
const UNSUPPORTED_FIRE_MODIFIERS = /Fire Mastery|\+\s?%\s?(?:to\s+)?Fire Skill Damage/i;
const INCREASE_VERBS =
  /\braises?\b|\braising\b|\bincreases?\b|\bboosts?\b|\bmultiplies\b|\badds to\b|\bscales\b|\baumenta\b|\baumentam\b|\beleva\b|\bmultiplica\b/i;

/**
 * Corpse Explosion's three quantities, and the one modifier that moves one of
 * them.
 *
 * @param lines every authored string on the page, flattened
 * @param where reported back so the caller can say which locale failed
 */
export function checkCorpseExplosionClaims(
  lines: readonly string[],
  where: string,
): ClaimProblem[] {
  const found: ClaimProblem[] = [];
  const sentences = sentencesOf(lines);
  const any = (pattern: RegExp) => sentences.some((s) => pattern.test(s));

  // 1. The level buys radius, and the page says so.
  if (
    !any(/(?:skill level|per level|points?|\+skills|nível da skill|por nível|pontos)[^]{0,140}(?:radius|raio)/i) &&
    !any(/(?:radius|raio)[^]{0,140}(?:skill level|per level|por nível|nível da skill)/i)
  ) {
    found.push({
      rule: "ce-radius-not-tied-to-level",
      message: `${where}: never says that the skill's level is what buys radius.`,
    });
  }

  // 2. The percentage band does not move, and the page says that too.
  if (
    !any(/70[–-]120\s?%[^]{0,180}(?:does not|do not|never|não)/i) &&
    !any(/(?:does not|do not|never|não)[^]{0,180}70[–-]120\s?%/i) &&
    !any(/(?:band|faixa)[^]{0,90}(?:does not move|não se mexe|does not change|não muda)/i)
  ) {
    found.push({
      rule: "ce-percentage-not-protected",
      message:
        `${where}: never states that the 70–120% band is fixed. Without that sentence a reader ` +
        `assumes levelling the skill raises the damage, which is the whole error.`,
    });
  }

  // 3. The fire tag is explained rather than dodged.
  if (!any(/\+\s?to Fire Skills/i)) {
    found.push({
      rule: "ce-fire-tag-not-explained",
      message:
        `${where}: never mentions +to Fire Skills. The skill's element is fire in the game's own ` +
        `tables, so items adding fire skill levels raise its effective level and therefore its ` +
        `radius — a real interaction, and staying silent about it is the failure this rule replaced.`,
    });
  }

  // 4. And the page still does not claim what is not established.
  for (const sentence of sentences) {
    if (!UNSUPPORTED_FIRE_MODIFIERS.test(sentence)) continue;
    if (!INCREASE_VERBS.test(sentence)) continue;
    if (REFUTES.test(sentence)) continue;
    found.push({
      rule: "ce-unsupported-fire-modifier-claim",
      message:
        `${where}: "${sentence.slice(0, 110)}…" presents Fire Mastery or +% Fire Skill Damage as ` +
        `a direct increase. Neither is established for the fire half, and a Necromancer cannot ` +
        `have a Fire Mastery at all.`,
    });
  }

  return found;
}

/**
 * Items no page may feed to an Iron Golem.
 *
 * Four of the five ways to lose one destroy the item permanently and one of
 * them is dying, so the recommendation this site makes is "cheap and
 * replaceable". These are the runewords guides reach for instead, and naming
 * them is what makes the rule checkable — "expensive" is not a pattern.
 */
export const NEVER_FEED_TO_A_GOLEM: readonly string[] = [
  "Pride",
  "Infinity",
  "Beast",
  "Insight",
  "Fortitude",
  "Doom",
  "Faith",
  "Grief",
  "Enigma",
  "Chains of Honor",
];

/**
 * Does this page tell a reader to make one, or merely mention the skill?
 *
 * The distinction decides whether the full loss list is owed. A page that says
 * "a respec destroys your Iron Golem" is warning about it, not recommending it,
 * and demanding it also enumerate dying and golem-replacement would push the
 * same four sentences onto every page that mentions the skill in passing.
 */
export function recommendsBuildingAGolem(lines: readonly string[]): boolean {
  return sentencesOf(lines).some(
    (s) =>
      /Iron Golem/i.test(s) &&
      // Past tense included deliberately: the first draft listed "build" but not
      // "built", so the English page escaped a rule its Portuguese twin tripped
      // on "construiu". A detector that behaves differently per locale is worse
      // than no detector.
      /\b(?:build|building|built|make|making|made|summon|summoning|summoned|cast|casting|feed|feeding|fed)\b|constru|invoc|conjur|criar|fazer|feito/i.test(
        s,
      ),
  );
}

/**
 * An Iron Golem section is allowed — it is a real option, and the persistence
 * question that blocked it is answered now. What it may not do is point at an
 * expensive item, and what it must do is say how the golem is lost.
 *
 * @param requireLosses set for pages that actually discuss building one, so a
 *   passing mention elsewhere is not forced to restate the whole rule set
 */
export function checkIronGolemAdvice(
  lines: readonly string[],
  forbidden: readonly string[],
  where: string,
  requireLosses: boolean,
): ClaimProblem[] {
  const found: ClaimProblem[] = [];
  const sentences = sentencesOf(lines);
  const escaped = forbidden.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const named = new RegExp(`\\b(${escaped})\\b`);

  for (const sentence of sentences) {
    if (!/Iron Golem/i.test(sentence)) continue;
    const hit = sentence.match(named);
    if (!hit) continue;
    if (REFUTES.test(sentence)) continue;
    found.push({
      rule: "golem-expensive-item-recommended",
      message:
        `${where}: "${sentence.slice(0, 110)}…" puts ${hit[1]} and the Iron Golem in the same ` +
        `recommendation. The golem is destroyed by dying, by any other golem and by a respec, and ` +
        `the item goes with it. Cheap and replaceable, or nothing.`,
    });
  }

  if (requireLosses) {
    const any = (p: RegExp) => sentences.some((s) => p.test(s));
    const losses = [
      { what: "a respec", pattern: /respec/i },
      { what: "dying", pattern: /\b(?:dies?|died|death|killed|morre|morrer|morte|morrem)\b/i },
      {
        what: "another golem replacing it",
        pattern: /(?:other golem|another golem|outro golem|qualquer outro golem)/i,
      },
    ].filter((l) => !any(l.pattern));
    for (const missing of losses) {
      found.push({
        rule: "golem-losses-not-stated",
        message:
          `${where}: discusses building an Iron Golem without naming ${missing.what} as a way to ` +
          `lose it and the item inside it.`,
      });
    }
  }

  return found;
}

/**
 * The claim the summons research retired.
 *
 * A player loses 40 and 100 points of resistance in Nightmare and Hell. The
 * monster table gives every Necromancer minion the same resistance values in
 * all three difficulties, so a summon loses nothing — and the mercenary, who is
 * not a summon, loses all of it. Both halves are worth policing: the wrong
 * claim reshapes the point plan around Summon Resist, and dropping the
 * mercenary half leaves the one party member who does take the penalty
 * ungeared for it.
 */
const SUMMON_WORDS =
  /\bsummons?\b|\bminions?\b|\bpets?\b|\bskeletons?\b|\bgolems?\b|\binvoca(?:ção|ções)\b|\blacaios?\b|\besqueletos?\b|\bgolens?\b/i;
const PENALTY_WORDS =
  /−40|−100|\B-40\b|\B-100\b|difficulty resistance penalty|resistance penalty|penalidade de resistência|penalidade por dificuldade/i;
const SUFFERS =
  /\btakes?\b|\bsuffers?\b|\bloses?\b|\bapplies to\b|\bapplied to\b|\bsofre[m]?\b|\bperde[m]?\b|\bse aplica\b|\bvale para\b/i;

export function checkSummonPenaltyClaims(
  lines: readonly string[],
  where: string,
  requireCorrection: boolean,
): ClaimProblem[] {
  const found: ClaimProblem[] = [];
  const sentences = sentencesOf(lines);

  for (const sentence of sentences) {
    if (!SUMMON_WORDS.test(sentence)) continue;
    if (!PENALTY_WORDS.test(sentence)) continue;
    if (!SUFFERS.test(sentence)) continue;
    if (REFUTES.test(sentence)) continue;
    // A sentence about the mercenary taking it is the correct claim, not this one.
    if (/mercenar|hireling|contratado/i.test(sentence)) continue;
    found.push({
      rule: "summon-difficulty-penalty-claimed",
      message:
        `${where}: "${sentence.slice(0, 110)}…" says a summon takes the difficulty resistance ` +
        `penalty. Every minion's resistance columns carry the same value in Normal, Nightmare and ` +
        `Hell. The mercenary takes it; the army does not.`,
    });
  }

  if (requireCorrection) {
    const states = sentences.some(
      (s) => SUMMON_WORDS.test(s) && PENALTY_WORDS.test(s) && REFUTES.test(s),
    );
    if (!states) {
      found.push({
        rule: "summon-penalty-not-corrected",
        message:
          `${where}: never states that summons do NOT take the −40 / −100 penalty. Silence leaves ` +
          `the reader with the community claim, which is the one being corrected.`,
      });
    }
  }

  return found;
}

/**
 * Summon Resist reaches skeletons, mages and golems. It does not reach revives.
 *
 * Scoped to sentences that connect the two **in that order, through a verb**.
 * The first draft merely required both nouns and a verb of application
 * somewhere, and fired on the article's own provenance list — "the revive's
 * re-rolled life, its character-level penalty and Summon Resist's reach are
 * read from the reference implementation" — where "reach" is a noun and the
 * sentence asserts nothing about their relationship.
 */
const CLAIMS_REVIVE_IS_COVERED: readonly RegExp[] = [
  /Summon Resist\b[^]{0,90}?\b(?:reaches|covers|applies to|is applied to|includes|extends to|alcança|cobre|se aplica a|é aplicado a|inclui|abrange)\b[^]{0,60}?\brevives?\b/i,
  /\brevives?\b[^]{0,90}?\b(?:receives?|gets?|benefit(?:s)? from|are covered by|is covered by|recebem?|ganham?|s[ãa]o cobertos por)\b[^]{0,60}?Summon Resist/i,
];

export function checkReviveSummonResist(lines: readonly string[], where: string): ClaimProblem[] {
  return sentencesOf(lines)
    .filter((s) => CLAIMS_REVIVE_IS_COVERED.some((p) => p.test(s)) && !REFUTES.test(s))
    .map((s) => ({
      rule: "revive-gets-summon-resist" as const,
      message:
        `${where}: "${s.slice(0, 110)}…" extends Summon Resist to revives. On the path this site ` +
        `could verify it reaches skeletons, mages and golems only.`,
    }));
}

/**
 * Unlock levels, checked against the graph rather than against the author's
 * memory.
 *
 * The research that preceded this pass said Decrepify unlocks at 30. It unlocks
 * at **24** — `reqlevel` says so — and the whole shape of a levelling route
 * turns on it, because 24 is where Summon Resist arrives too and 30 is where
 * the reader would otherwise be told to wait. Lower Resist is the skill that
 * genuinely unlocks at 30, which is exactly how the two get swapped.
 *
 * A sentence counts as an unlock claim when it names the skill, carries an
 * unlock verb, and states exactly one "level N". All three are needed:
 *
 * - Without the verb, "Corpse Explosion at level 20" — a perfectly ordinary
 *   sentence about hard points — reads as a claim that it unlocks at 20.
 * - Without the single-number condition, "Lower Resist unlocks at level 30,
 *   six levels after Decrepify at level 24" is one sentence making two claims,
 *   and the rule would attribute the first number to both skills.
 *
 * So an enumeration of several levels is skipped rather than guessed at, and
 * prose that wants to be checked says one unlock per sentence.
 */
/*
 * Portuguese verbs are matched by stem rather than by whole word. The first
 * draft listed `\bdestrava\b`, which does not match "destravado" — the participle
 * every one of these sentences actually uses — so the Portuguese half of the
 * rule was silently inert while the English half worked.
 */
const UNLOCK_VERB =
  /\bunlocks?\b|\bunlocked\b|\bavailable\b|\barrives?\b|\bopens?\b|\bbecomes?\b|\bdestrav\w*|\bdispon[íi]ve[li]s?\b|\bchega\w*|\bexige\b|\babre\b|\bliberad[ao]s?\b|\bsurge\b/i;
const LEVEL_NUMBER = /\blevel\s+(\d{1,2})\b|\bnível\s+(\d{1,2})\b/gi;
export const UNLOCK_CLAIM_SKILLS: readonly string[] = [
  "Decrepify",
  "Lower Resist",
  "Summon Resist",
  "Corpse Explosion",
  "Golem Mastery",
  "Revive",
  "Bone Spear",
  "Bone Spirit",
  "Poison Nova",
  "Iron Golem",
  "Raise Skeletal Mage",
  "Clay Golem",
  "Blood Golem",
  "Bone Prison",
];

export function checkUnlockLevelClaims(
  lines: readonly string[],
  requiredLevelOf: (name: string) => number | undefined,
  watched: readonly string[],
  where: string,
): ClaimProblem[] {
  const found: ClaimProblem[] = [];
  for (const sentence of sentencesOf(lines)) {
    if (!UNLOCK_VERB.test(sentence)) continue;
    const levels = new Set(
      [...sentence.matchAll(LEVEL_NUMBER)].map((m) => Number(m[1] ?? m[2])),
    );
    if (levels.size !== 1) continue;
    const claimed = [...levels][0];
    for (const name of watched) {
      if (!new RegExp(`\\b${name}\\b`, "i").test(sentence)) continue;
      const actual = requiredLevelOf(name);
      if (actual === undefined || claimed === actual) continue;
      found.push({
        rule: "unlock-level-wrong",
        message:
          `${where}: "${sentence.slice(0, 110)}…" puts ${name} at level ${claimed}; the game ` +
          `unlocks it at ${actual}.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Physical immunity, as arithmetic rather than as a remembered example
// ===========================================================================

/**
 * The one-fifth rule, applied instead of described.
 *
 * The site had four pages saying Decrepify cannot break a physical immunity,
 * and the site's own model says otherwise. Immunity is resistance at 100 or
 * more; a resistance-lowering curse against an immune target works at one
 * fifth; Decrepify's −50 therefore becomes −10, and 100 − 10 is 90. **That
 * breaks it.** The error survived four pages and two locales because every one
 * of them repeated the same worked example rather than doing the subtraction.
 *
 * So the subtraction lives here, and the prose is checked against it. The two
 * curses reach different depths and that is the honest claim:
 *
 *   Amplify Damage  −100 → −20 against an immune → breaks 100 through 119
 *   Decrepify        −50 → −10 against an immune → breaks 100 through 109
 *
 * Both numbers matter. "Decrepify never breaks one" is the error being
 * corrected; "Decrepify breaks physical immunity" with no ceiling is the same
 * error mirrored, and a page that says it would send a reader at a 115% monster
 * to the wrong curse. `PHYSICAL_IMMUNITY_CONTROLS` pins one row on each side of
 * both ceilings for exactly that reason.
 *
 * Scoped to physical immunity and to these two curses on purpose. Whether the
 * same arithmetic redeems a mastery or an elemental reduction is a separate
 * question about separate sources, and a gate that answered it here would be
 * asserting something this pass did not verify.
 */
export const IMMUNITY_THRESHOLD = 100;
export const IMMUNE_EFFECTIVENESS_DIVISOR = 5;

export interface ResistanceCurse {
  readonly name: string;
  /** Points of physical damage resistance removed at full effect. */
  readonly nominal: number;
}

export const AMPLIFY_DAMAGE: ResistanceCurse = { name: "Amplify Damage", nominal: 100 };
export const DECREPIFY: ResistanceCurse = { name: "Decrepify", nominal: 50 };

export interface ReductionOutcome {
  readonly before: number;
  /** What the curse was actually worth here — the one-fifth rule's output. */
  readonly applied: number;
  readonly after: number;
  readonly wasImmune: boolean;
  readonly stillImmune: boolean;
  /** Immune before and not immune after. The only thing "breaks" can mean. */
  readonly breaks: boolean;
}

export function applyResistanceCurse(before: number, curse: ResistanceCurse): ReductionOutcome {
  const wasImmune = before >= IMMUNITY_THRESHOLD;
  const applied = wasImmune ? curse.nominal / IMMUNE_EFFECTIVENESS_DIVISOR : curse.nominal;
  const after = before - applied;
  const stillImmune = after >= IMMUNITY_THRESHOLD;
  return { before, applied, after, wasImmune, stillImmune, breaks: wasImmune && !stillImmune };
}

/** The deepest resistance each curse still breaks, derived rather than typed. */
export function deepestBreakable(curse: ResistanceCurse, ceiling = 200): number {
  let deepest = IMMUNITY_THRESHOLD - 1;
  for (let r = IMMUNITY_THRESHOLD; r <= ceiling; r++) {
    if (applyResistanceCurse(r, curse).breaks) deepest = r;
  }
  return deepest;
}

/**
 * The four rows the correction turns on, each with both curses' outcome.
 *
 * 100 and 109 are where Decrepify works and the old prose said it did not.
 * 110 is the first row that separates the two curses, and 120 is where both
 * stop — the row that keeps the correction from becoming "Decrepify breaks
 * physical immunity" full stop.
 */
export const PHYSICAL_IMMUNITY_CONTROLS: readonly {
  readonly before: number;
  readonly decrepify: { readonly after: number; readonly breaks: boolean };
  readonly amplify: { readonly after: number; readonly breaks: boolean };
}[] = [
  { before: 100, decrepify: { after: 90, breaks: true }, amplify: { after: 80, breaks: true } },
  { before: 109, decrepify: { after: 99, breaks: true }, amplify: { after: 89, breaks: true } },
  { before: 110, decrepify: { after: 100, breaks: false }, amplify: { after: 90, breaks: true } },
  { before: 120, decrepify: { after: 110, breaks: false }, amplify: { after: 100, breaks: false } },
];

/**
 * "Decrepify cannot break it", in the four shapes the site actually wrote.
 *
 * Anchored on a negation that governs a break verb, in that order, because the
 * corrected prose says "Decrepify **does** break one sitting at 100% to 109%
 * and nothing beyond that" — a sentence with a break verb, a negative word and
 * both curses in it, which a looser rule would reject.
 */
const DECREPIFY_CANNOT_BREAK: readonly RegExp[] = [
  // "Decrepify does not break physical immunity" / "o Decrepify não quebra…"
  /\bDecrepify\b[^]{0,40}?\b(?:does not|doesn't|cannot|can't|will not|won't|never)\s+(?:\w+\s+){0,2}breaks?\b/i,
  /\bDecrepify\b[^]{0,40}?\b(?:não|nunca)\s+(?:\w+\s+){0,2}quebra\w*/i,
  // "…breaks it, and Decrepify does not" / "…que ainda quebra. O Decrepify não —"
  /\bbreaks?\b[^]{0,140}?\bDecrepify\b[^]{0,60}?\b(?:does not|doesn't|cannot|can't)\b/i,
  /\bquebra\w*\b[^]{0,140}?\bDecrepify\b[^]{0,60}?\b(?:não|nunca)\b(?!\s+(?:só|apenas))/i,
  // "no amount of Decrepify substitutes" — inability said without the verb.
  /\bno amount of\s+Decrepify\b|\bnenhuma quantidade de\s+Decrepify\b/i,
];

/** "Amplify Damage, and only Amplify Damage." */
const ONLY_AMPLIFY_BREAKS: readonly RegExp[] = [
  /\bonly\s+Amplify Damage\b/i,
  /\bAmplify Damage\b\s*,?\s*(?:and|e)\s+only\s+(?:Amplify Damage|it)\b/i,
  /\b(?:só|apenas|somente)\s+(?:o\s+)?Amplify Damage\b/i,
  /\bAmplify Damage\b\s*,?\s*e\s+(?:só|apenas|somente)\s+ele\b/i,
];

/** A "does not break" claim carrying the resistance figure it is wrong about. */
const NO_BREAK_WITH_FIGURE =
  /\b(?:does not|doesn't|cannot|can't|will not|won't|never)\s+break\w*\b|\b(?:não|nunca)\s+quebra\w*/i;
const RESISTANCE_FIGURE = /(\d{2,3})\s*%/g;

/**
 * Three ways the same mistake was written, checked in both locales.
 *
 * The third rule is the arithmetic one: any sentence that denies a break and
 * names the resistance it is denying it for is measured against
 * `applyResistanceCurse`, using the *weaker* curse. If even Decrepify breaks
 * that figure, the sentence is false whichever curse it meant.
 */
export function checkImmunityBreakClaims(
  lines: readonly string[],
  where: string,
): ClaimProblem[] {
  const found: ClaimProblem[] = [];
  for (const sentence of sentencesOf(lines)) {
    const snippet = sentence.slice(0, 110);

    if (DECREPIFY_CANNOT_BREAK.some((p) => p.test(sentence))) {
      found.push({
        rule: "decrepify-cannot-break-immunity",
        message:
          `${where}: "${snippet}…" says Decrepify cannot break a physical immunity. Against an ` +
          `immune its −50 becomes −10, which takes 100% to 90% — it breaks 100% through 109% and ` +
          `stops there. Amplify Damage reaches 119%.`,
      });
    }

    if (ONLY_AMPLIFY_BREAKS.some((p) => p.test(sentence))) {
      found.push({
        rule: "only-amplify-breaks-immunity",
        message:
          `${where}: "${snippet}…" makes Amplify Damage the only curse that breaks a physical ` +
          `immunity. It is the one that reaches deepest — 119% against Decrepify's 109% — which ` +
          `is a difference of depth rather than of kind.`,
      });
    }

    if (!NO_BREAK_WITH_FIGURE.test(sentence)) continue;
    for (const match of sentence.matchAll(RESISTANCE_FIGURE)) {
      const figure = Number(match[1]);
      const weakest = applyResistanceCurse(figure, DECREPIFY);
      if (!weakest.breaks) continue;
      found.push({
        rule: "immunity-arithmetic-wrong",
        message:
          `${where}: "${snippet}…" denies a break at ${figure}%. Even Decrepify, the weaker of ` +
          `the two, is worth −${weakest.applied} there and leaves ${weakest.after}% — which is ` +
          `not immune.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Quest skill points, counted rather than mentioned
// ===========================================================================

/**
 * A route may not promise points it has already spent.
 *
 * The bug this replaces was not a wrong number in isolation. Level 24 told the
 * reader they would arrive with four quest skill points banked, and the same
 * page had already directed all four elsewhere — Den of Evil into Teeth,
 * Radament into Corpse Explosion, Izual twice into Skeleton Mastery. Each
 * sentence was true on its own and the page was false as a whole, which is the
 * failure a rule that greps for numbers cannot see.
 *
 * So this counts. Both sides come off the page rather than out of this file:
 *
 * - **Granted** is read from the `kind: "quest"` actions, whose "+1 skill
 *   point" is a game string and appears in that shape in both locales.
 * - **Allocated** is a grant whose own action also names a skill. Skill names
 *   are untranslated proper nouns by ADR 0003, so the caller's list of class
 *   skills works unchanged in either language — no verb list to keep in sync.
 *
 * A page that stops directing its quest points stops being counted as spending
 * them, and the claim it is then allowed to make grows to match. That is the
 * property worth having: the ledger follows the route rather than pinning it.
 */
const QUEST_GRANT = /\+\s?(\d+)\s+(?:skill points?|pontos? de skill)/gi;

const QUEST_POINT_PHRASE =
  /\bquest\s+(?:skill\s+)?points?\b|\bpontos?\s+de\s+(?:skill\s+de\s+)?quest\b/i;

/** Words that turn "quest points" into a claim of having some in hand. */
const BANKED_VERB =
  /\bbanked\b|\bsaved\b|\bhoarded\b|\bin reserve\b|\bspare\b|\bwill have\b|\byou have\b|\bguardad[oa]s?\b|\bpoupad[oa]s?\b|\breservad[oa]s?\b|\bde reserva\b|\bvoc[êe] tem\b|\bvoc[êe] vai ter\b/i;

/** The count must sit against the phrase; a nearby level number is not one. */
const BANKED_COUNT =
  /\b(\d{1,2}|one|two|three|four|five|um|uma|dois|duas|tr[êe]s|quatro|cinco)\s+(?:quest\s+(?:skill\s+)?points?|pontos?\s+de\s+(?:skill\s+de\s+)?quest)\b/i;

/**
 * Denial of the banking claim — and deliberately **not** the shared `REFUTES`.
 *
 * `REFUTES` lists `\bno\b`, which in Portuguese is the contraction of *em o*.
 * The sentence this rule exists to reject reads "Quando você chegar **no** 24
 * vai ter quatro pontos de skill de quest guardados", so `REFUTES` read the
 * article as a negation and waved the claim through — the Portuguese half of
 * the rule inert while the English half worked, which is the same failure the
 * unlock rule's `destrava` / `destravado` note records.
 *
 * So English `no` is required to govern the noun it negates, and the
 * Portuguese negations are the ones that only ever negate.
 */
const DENIES_BANKING =
  /\bno\s+quest\b|\bdo(?:es)?\s+not\b|\bnothing\b|\bnever\b|\bwithout\b|\bnenhum[ao]?s?\b|\bnão\b|\bnada\b|\bsem\b/i;

const COUNT_WORDS: Readonly<Record<string, number>> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5,
};

export interface QuestPointLedger {
  readonly granted: number;
  readonly allocated: number;
  readonly free: number;
  readonly entries: readonly {
    readonly text: string;
    readonly granted: number;
    readonly directedTo: readonly string[];
  }[];
}

export function questPointLedger(
  questActions: readonly string[],
  skillNames: readonly string[],
): QuestPointLedger {
  const entries = questActions
    .map((text) => {
      const granted = [...text.matchAll(QUEST_GRANT)].reduce((sum, m) => sum + Number(m[1]), 0);
      const directedTo = skillNames.filter((n) => new RegExp(`\\b${n}\\b`, "i").test(text));
      return { text, granted, directedTo };
    })
    .filter((e) => e.granted > 0);

  const granted = entries.reduce((sum, e) => sum + e.granted, 0);
  const allocated = entries
    .filter((e) => e.directedTo.length > 0)
    .reduce((sum, e) => sum + e.granted, 0);
  return { granted, allocated, free: granted - allocated, entries };
}

export function checkQuestPointBudget(
  lines: readonly string[],
  questActions: readonly string[],
  skillNames: readonly string[],
  where: string,
): ClaimProblem[] {
  const ledger = questPointLedger(questActions, skillNames);
  const found: ClaimProblem[] = [];

  for (const sentence of sentencesOf(lines)) {
    if (!QUEST_POINT_PHRASE.test(sentence)) continue;
    if (!BANKED_VERB.test(sentence)) continue;
    // "No quest point needs to be saved for either" is the corrected sentence,
    // and it is built from the same words as the claim it replaced.
    if (DENIES_BANKING.test(sentence)) continue;

    const match = BANKED_COUNT.exec(sentence);
    const token = match?.[1]?.toLowerCase();
    const claimed = token ? (COUNT_WORDS[token] ?? Number(token)) : 1;
    if (claimed <= ledger.free) continue;

    found.push({
      rule: "quest-points-banked-but-spent",
      message:
        `${where}: "${sentence.slice(0, 110)}…" has ${claimed} quest skill point` +
        `${claimed === 1 ? "" : "s"} in hand. The route grants ${ledger.granted} and directs ` +
        `${ledger.allocated} of them into skills before this point, leaving ${ledger.free}.`,
    });
  }
  return found;
}
