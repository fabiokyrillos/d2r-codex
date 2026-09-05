/**
 * Availability: the structural gate, and the sentence that goes round it.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * One runeword in the game currently distinguishes *making* it from *using* it,
 * and every widely-read page about it collapses the two. The failure is not a
 * wrong number — there is no number — it is a sentence:
 *
 *   "Mosaic is Non-Ladder."    A Ladder character can wear one.
 *   "Mosaic is Ladder-only."   True two years ago. Exactly backwards now.
 *
 * The `Availability` type answers per mode and names the verb, which stops the
 * *data* being ambiguous. It does nothing at all about prose, and prose is
 * where this has always gone wrong — a gear tier's `why`, a build's summary, a
 * package's `when`. So the structural checks below guard the data, and
 * `checkAvailabilityClaims` sweeps every string on every page in both locales
 * for the two collapsed sentences.
 *
 * PROVENANCE
 *   Repository  blizzhackers/d2data
 *   Commit      fc469993502d0498809b9fc1af140ee2a9eb8902
 *   Path        json/runes.json — `disallowCraftingInLadder`,
 *               `firstLadderSeason`, `lastLadderSeason`
 *   Baseline    D2R Patch 3.3 / Ladder Season 15
 *   Verified    2026-09-05
 *
 * `disallowCraftingInLadder: 1` is set on exactly one of the 181 rows, and it
 * is a statement about crafting. The file name for the other two fields is a
 * *season range*, not a current state — reading `lastLadderSeason: 12` as
 * "Non-Ladder now" is the second most common way to get this wrong.
 */
import { AVAILABILITY_MODES } from "../lib/types";
import type { Availability, AvailabilityMode, AvailabilityStatus } from "../lib/types";

export const AVAILABILITY_RULES = [
  "availability-mode-missing",
  "availability-mode-duplicated",
  "availability-notes-missing",
  "availability-provenance-missing",
  "gated-item-has-no-availability",
  "mode-claim-collapses-craft-and-use",
  "ladder-only-stated-as-current",
] as const;
export type AvailabilityRule = (typeof AVAILABILITY_RULES)[number];

export interface AvailabilityProblem {
  rule: AvailabilityRule;
  where: string;
  message: string;
}

/**
 * Names that carry an availability block, lowercased.
 *
 * A list rather than a lookup into the registry, because the prose rules run
 * over raw strings that have no idea which entity they came from — the sweep
 * hands them `["…Mosaic gives 100%…"]` and a page label. Kept here so adding a
 * second gated item is one line and the rules follow.
 */
export const GATED_ITEM_NAMES = ["mosaic"] as const;

/** The two verbs that make a mode claim complete rather than collapsed. */
const CRAFT_WORDS =
  /\b(craft(?:ed|ing|able)?|made|make|making|fabric\w*|criar?|cria\w*|fabricad\w*|fei(?:to|ta)s?)\b/i;
const USE_WORDS =
  /\b(us(?:e|ed|able|ing)|wear|worn|wield\w*|equip\w*|transferr?\w*|trade[dr]?|usar?|usad\w*|usá-la|vesti\w*|transferid\w*)\b/i;

/** A claim that the thing simply *is* one side of the ladder. */
const BARE_MODE_CLAIM =
  /\b(is|are|é|são|está|estão|only|apenas|somente|exclusiv\w*)\b[^.]{0,40}\b(ladder[- ]only|non[- ]ladder|só no ladder|apenas no ladder)\b|\b(ladder[- ]only|non[- ]ladder)\b[^.]{0,20}\b(item|runeword|build|claw|garra)\b/i;

/** "Ladder-only", asserted as the present tense. */
const LADDER_ONLY_PRESENT =
  /\b(ladder[- ]only|só (?:no |em )?ladder|exclusiv\w* (?:do|de|no) ladder)\b/i;

/** Words that put a Ladder-only statement safely in the past. */
const PAST_TENSE =
  /\b(was|were|used to|until|through|arrived|historic\w*|season \d+|foi|era|eram|até|chegou|histori\w*|temporada \d+|inverso|backwards|reverse)\b/i;

function sentencesIn(line: string): string[] {
  return line
    .replace(/\*\*/g, "")
    .split(/(?<=[.!?;:])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const mentionsGatedItem = (sentence: string) =>
  GATED_ITEM_NAMES.some((n) => sentence.toLowerCase().includes(n));

/**
 * The prose sweep.
 *
 * Both rules only fire on a sentence that names a gated item, which is what
 * keeps them off the ninety-nine pages that legitimately say "Non-Ladder" about
 * the eight runewords Patch 3.3 moved. Those genuinely *are* Non-Ladder, in
 * both verbs at once, and a rule that could not tell the difference would be
 * turned off within a week.
 */
export function checkAvailabilityClaims(
  lines: string[],
  where: string,
): AvailabilityProblem[] {
  const problems: AvailabilityProblem[] = [];
  const add = (rule: AvailabilityRule, sentence: string, why: string) =>
    problems.push({
      rule,
      where,
      message: `${where}: ${why} — "${sentence.slice(0, 140)}"`,
    });

  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      if (!mentionsGatedItem(sentence)) continue;

      /*
       * A mode claim has to say which verb it is about. "Cannot be made on
       * Ladder" passes; "cannot be worn on Ladder" would be false but is at
       * least falsifiable, and the structural rows are what catch that. What
       * cannot stand is the bare form, because it reads as both verbs and one
       * of them is always wrong.
       */
      if (BARE_MODE_CLAIM.test(sentence)) {
        const namesAVerb = CRAFT_WORDS.test(sentence) || USE_WORDS.test(sentence);
        if (!namesAVerb) {
          add(
            "mode-claim-collapses-craft-and-use",
            sentence,
            "states a ladder side for a gated item without saying whether it is about making it or using it",
          );
        }
      }

      /*
       * "Ladder-only" is the historical answer and it is still what most search
       * results say. It may appear on this site, but only in the past tense —
       * the history field exists for exactly that, and the runeword's own entry
       * uses it.
       */
      if (LADDER_ONLY_PRESENT.test(sentence) && !PAST_TENSE.test(sentence)) {
        add(
          "ladder-only-stated-as-current",
          sentence,
          "calls a gated item Ladder-only in the present tense; that was true through Season 12 and is now the reverse",
        );
      }
    }
  }

  return problems;
}

/**
 * The structural half: the rows and the provenance.
 *
 * Every mode answered, no mode twice, prose for each, and a source, baseline
 * and date that are actually filled in. The last three matter more than they
 * look: an availability block whose `checked` is blank is a claim about a
 * moving target with no way to tell whether it has moved.
 */
export function checkAvailabilityShape(
  availability: Availability,
  where: string,
): AvailabilityProblem[] {
  const problems: AvailabilityProblem[] = [];
  const add = (rule: AvailabilityRule, message: string) =>
    problems.push({ rule, where, message: `${where}: ${message}` });

  const seen = new Map<AvailabilityMode, number>();
  for (const row of availability.rows) {
    seen.set(row.mode, (seen.get(row.mode) ?? 0) + 1);
  }
  for (const mode of AVAILABILITY_MODES) {
    const count = seen.get(mode) ?? 0;
    if (count === 0) add("availability-mode-missing", `no row for mode "${mode}"`);
    if (count > 1)
      add("availability-mode-duplicated", `mode "${mode}" appears ${count} times`);
  }
  for (const mode of seen.keys()) {
    if (!(AVAILABILITY_MODES as readonly string[]).includes(mode))
      add("availability-mode-missing", `unknown mode "${mode}"`);
  }

  for (const mode of AVAILABILITY_MODES) {
    const text = availability.notes?.rows?.[mode];
    if (!text || !text.trim())
      add("availability-notes-missing", `no prose for mode "${mode}"`);
  }
  if (!availability.notes?.consequence?.trim())
    add("availability-notes-missing", "no consequence line");

  if (!availability.source?.trim())
    add("availability-provenance-missing", "no source");
  if (!availability.baseline?.trim())
    add("availability-provenance-missing", "no baseline");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(availability.checked ?? ""))
    add(
      "availability-provenance-missing",
      `checked date is not an ISO date: "${availability.checked}"`,
    );

  return problems;
}

/**
 * A build's `gatedBy` must point at something that carries availability.
 *
 * The build page filters silently so a lifted restriction cannot crash it —
 * which is right at render time and wrong at check time, because a `gatedBy`
 * that resolves to nothing renders no warning at all and looks exactly like a
 * build that never had one.
 */
export function checkGates(
  gatedBy: readonly string[] | undefined,
  hasAvailability: (slug: string) => boolean,
  where: string,
): AvailabilityProblem[] {
  return (gatedBy ?? [])
    .filter((slug) => !hasAvailability(slug))
    .map((slug) => ({
      rule: "gated-item-has-no-availability" as const,
      where,
      message: `${where}: gatedBy names "${slug}", which carries no availability block`,
    }));
}

/** Statuses, exported so a test can assert the union has not silently grown. */
export const EXPECTED_STATUSES: readonly AvailabilityStatus[] = [
  "craftable",
  "usable",
  "disabled",
  "unknown",
];
