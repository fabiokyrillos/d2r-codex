/**
 * Pure rules used by `check-content.ts`, separated so they can be tested.
 *
 * Same reason `skill-graph-rules.ts` exists: the checker runs every check at
 * module scope, so importing it to exercise one rule would run all of them
 * against the real content. These take their inputs as arguments.
 */

/**
 * Below this length a match between two locales is not evidence of anything.
 * "Magic find.", "+1 all skills." and a bare stat name are identical in
 * Portuguese because that is what the game prints; only a string long enough
 * to carry a sentence can be said to have gone untranslated.
 */
export const MIN_PROSE_LENGTH = 25;

/**
 * True when a translated string is byte-identical to its source and long
 * enough to be prose — the shape of a missing overlay entry, which renders
 * English text inside a Portuguese page.
 *
 * Proper nouns, affixes and game terminology stay in English by ADR 0003, so
 * a legitimate translation of an affix list still differs from the source: it
 * carries Portuguese connective tissue ("Crushing Blow, Deadly Strike **e**
 * Open Wounds"). A string with no connective tissue at all is the one that
 * comes back identical, and that is exactly the case worth reporting.
 */
export function isUntranslatedProse(
  source: string | undefined,
  translated: string | undefined,
): boolean {
  if (!source) return false;
  return translated === source && source.length > MIN_PROSE_LENGTH;
}

/**
 * The gate's verdict.
 *
 * A warning fails the build. It used to print and exit 0, which meant a known
 * gap — an untranslated reason, a build missing gear tiers — could ship
 * indefinitely while the gate reported success. If something is not worth
 * failing on, it does not belong in `warnings`; if it is in `warnings`, it
 * fails. There is no third state.
 */
export function exitCodeFor(
  problems: readonly unknown[],
  warnings: readonly unknown[],
): 0 | 1 {
  return problems.length > 0 || warnings.length > 0 ? 1 : 0;
}

// ===========================================================================
// Divergence claims must name who diverges
// ===========================================================================

/**
 * The most expensive claim a page can make is that the rest of the world is
 * wrong, and this repository has now made it twice from nothing.
 *
 * The first was Death's Web, withdrawn at b314b8f: a note saying "every
 * community database" published a different stat block, with no database named,
 * quoted or dated, and every independent source consulted afterwards agreeing
 * with the extraction. The second and third were Kingslayer's Open Wounds and
 * Last Wish's Crushing Blow, each saying "several community databases still
 * list" a higher figure "which appears to be a stale figure" — and there the
 * check went the other way: two named databases do publish the higher figures,
 * and neither looked stale.
 *
 * Both outcomes argue for the same gate. A reader cannot check "several
 * databases", a future author cannot re-audit it, and whether the claim happens
 * to be true is decided by nobody. So a divergence claim must carry a source
 * the reader can open and a date they can weigh it by.
 *
 * This is not a rule about disagreeing with a source. The site does that
 * deliberately and says so — the extraction wins over Tier 3, and where that
 * happens the disagreement is recorded. It is a rule about disagreeing with
 * *nobody in particular*.
 */
export interface DivergenceProblem {
  rule: "unsourced-divergence-claim" | "undated-divergence-claim";
  message: string;
}

/**
 * The vague-plural shape, in both locales. "Several community databases", "most
 * guides", "algumas fontes" — a quantifier over an unnamed set of sources.
 */
const VAGUE_SOURCE_SET =
  /\b(?:several|some|many|most|other|certain|various|a few|every|all)\s+(?:other\s+|major\s+|reputable\s+|community\s+|online\s+)*(?:databases?|sources?|sites?|guides?|wikis?|references?|tables?)\b|\b(?:v[áa]ri[ao]s|algum[ao]s|muit[ao]s|outr[ao]s|certos|a maioria d[oa]s|tod[ao]s (?:os|as))\s+(?:outr[ao]s\s+|grandes\s+)*(?:bancos de dados|bases(?: da comunidade)?|fontes|sites|guias|wikis|refer[êe]ncias|tabelas)\b/i;

/**
 * A claim *about* that set: they publish, list, show or disagree.
 *
 * Required to follow the source set within fifty characters, because word
 * order carries the meaning. "Several databases still list 50%" is a divergence
 * claim; "the item most sources point a mercenary at is a Reaper's Toll" is
 * build consensus, and an unbounded search finds a verb in it eventually. The
 * bare adverbs — "still", "ainda" — were triggers in a first draft and are not
 * here: on their own they describe continuation, not disagreement.
 */
const DIVERGENCE_VERB =
  /\blists?\b|\blisted\b|\bpublish(?:es|ed)?\b|\bshows?\b|\bstates?\b|\breports?\b|\bdisagree\w*\b|\bdiverg\w*\b|\blista\w*\b|\bpublica\w*\b|\bmostra\w*\b|\bafirma\w*\b|\bdiscorda\w*\b|\bregistra\w*\b/i;

/** How far after the source set the divergence verb may sit. */
const VERB_WINDOW = 50;

/**
 * Every source this repository has registered, plus the two the runeword pass
 * added. A divergence claim must name one of them — or a domain, which is the
 * same evidence in a different shape.
 */
export const NAMED_SOURCES: readonly string[] = [
  "D2Runewizard",
  "Diablo Wiki",
  "Fandom",
  "PureDiablo",
  "Maxroll",
  "Arreat Summit",
  "Icy Veins",
  "DiabloBytes",
  "diablo2.io",
  "blizzhackers",
  "d2data",
  "Blizzard",
];

const NAMES_A_SOURCE = new RegExp(
  [...NAMED_SOURCES.map((s) => s.replace(/[.]/g, "\.")), "https?://"].join("|"),
  "i",
);

/** An ISO date, which is how this repository dates a consultation. */
const CARRIES_A_DATE = /\b\d{4}-\d{2}-\d{2}\b/;

/**
 * @param lines every authored string on the page, flattened
 * @param where reported back so the caller can say which locale failed
 */
export function checkSourcedDivergence(
  lines: readonly string[],
  where: string,
): DivergenceProblem[] {
  const found: DivergenceProblem[] = [];
  for (const line of lines) {
    if (!line) continue;
    const set = line.match(VAGUE_SOURCE_SET);
    if (!set) continue;
    const after = line.slice((set.index ?? 0) + set[0].length, (set.index ?? 0) + set[0].length + VERB_WINDOW);
    if (!DIVERGENCE_VERB.test(after)) continue;

    const snippet = line.slice(0, 120);
    if (!NAMES_A_SOURCE.test(line)) {
      found.push({
        rule: "unsourced-divergence-claim",
        message:
          `${where}: "${snippet}…" says other sources publish something different without ` +
          `naming one. Name the database and link it, or drop the claim. "Several databases" ` +
          `is not a source: nobody can check it, and this repository has already had to ` +
          `withdraw one claim of exactly this shape (Death's Web, b314b8f).`,
      });
      continue;
    }
    if (!CARRIES_A_DATE.test(line)) {
      found.push({
        rule: "undated-divergence-claim",
        message:
          `${where}: "${snippet}…" names a source for a divergence but does not date the ` +
          `reading. A database's page changes; a claim about what it "still lists" is only ` +
          `checkable against the day it was read. Add the ISO date the source was consulted.`,
      });
    }
  }
  return found;
}
