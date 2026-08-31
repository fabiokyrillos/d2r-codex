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
