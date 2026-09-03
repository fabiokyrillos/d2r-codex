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
    | "unlock-level-wrong";
  message: string;
}

/** Splits authored prose into sentence-ish units so a rule can scope itself. */
export function sentencesOf(lines: readonly string[]): string[] {
  return lines
    .flatMap((line) => line.split(/(?<=[.!?;:])\s+|\s+—\s+/))
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
 * A sentence counts as an unlock claim when it names the skill and carries an
 * unlock phrase with a number in it. Sentences that merely mention a skill next
 * to a number — "one point in Decrepify is enough" — name no level and are left
 * alone.
 */
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

const UNLOCK_PHRASE = new RegExp(
  [
    "(?:unlocks?|unlocked|available|arrives?|requires?|needs?|opens?)[^.]{0,40}?\\blevel\\s+(\\d{1,2})\\b",
    "\\bat level\\s+(\\d{1,2})\\b",
    "(?:destravad[ao]|disponível|chega|exige|precisa|abre)[^.]{0,40}?\\bnível\\s+(\\d{1,2})\\b",
    "\\b(?:no|a partir do)\\s+nível\\s+(\\d{1,2})\\b",
  ].join("|"),
  "i",
);

export function checkUnlockLevelClaims(
  lines: readonly string[],
  requiredLevelOf: (name: string) => number | undefined,
  watched: readonly string[],
  where: string,
): ClaimProblem[] {
  const found: ClaimProblem[] = [];
  for (const sentence of sentencesOf(lines)) {
    const match = sentence.match(UNLOCK_PHRASE);
    if (!match) continue;
    const claimed = Number(match.slice(1).find((g) => g !== undefined));
    if (!Number.isFinite(claimed)) continue;
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
