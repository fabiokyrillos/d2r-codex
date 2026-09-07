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

// ===========================================================================
// Rule C — a claim scoped to *this site* must be registered
//
// WHY THIS EXISTS
// ---------------
// Three claims about "everything else" shipped in one cycle and no gate saw any
// of them, because an absence has no row to drift against and a universal needs
// the whole corpus to refute. One of the three was written by the person
// routing that exact defect class to other agents, in the file it was false in.
//
// This rule does not decide whether such a claim is true. Roughly half the ones
// in the corpus are comparatives whose truth needs a human, and a rule that
// promised to judge those would be lying. What it does is make an unregistered
// one impossible to add quietly: "on this site" names the registries, so a
// claim scoped that way is re-derivable by construction, and every one of them
// should carry the enumeration that settles it.
//
// Same shape as `SOFT_LEVEL_SYNERGIES` in `skill-graph-rules.ts` and
// `GATED_ITEM_NAMES` in `availability-rules.ts`: the list is what keeps it a
// decision instead of an accident.
// ===========================================================================

export type SiteClaimRule = "unregistered-site-scoped-claim";

export interface SiteClaimProblem {
  rule: SiteClaimRule;
  message: string;
}

/** "on this site", "deste site" — the corpus, not the game. */
const SITE_SCOPE =
  /\b(?:on|of) (?:this|the) site\b|\bthis site'?s\b|\bde(?:ste)? site\b|\bneste site\b|\bdo site\b/i;

/** An exclusivity claim: the sentence asserts something about everything else. */
const EXCLUSIVE =
  /\bthe only\b|\bno other\b|\bnothing else\b|\bevery other\b|\bnone of\b|\bo [úu]nico\b|\ba [úu]nica\b|\bnenhum\w* outr\w*\b|\btoda outra\b|\btodo outro\b|\bnada mais\b/i;

/*
 * Comparatives, which this rule must not pretend to judge. "The deepest
 * avoidance investment on this site" is a ranking, not an existence claim, and
 * settling it needs a reader rather than a registry.
 *
 * The Portuguese half is not a translation of the English half and must not be
 * written as one. `o maior` / `a menor` are the forms Portuguese uses where
 * English writes `deepest` or `biggest difference`, and leaving them out made
 * the rule fire on two pt-BR sentences whose English counterparts it correctly
 * ignored — the exact EN/PT divergence this repository keeps finding.
 */
const COMPARATIVE =
  /\bthan any other\b|\bmore than any\b|\bqualquer outr\w+\b|\bmais que\b|\bmenos que\b|\bdeepest\b|\bbiggest difference\b|\b[ao] maior\b|\b[ao] menor\b/i;

/** Sentence-scoped, and `\*{0,2}` because these sentences routinely open bold. */
const siteSentencesIn = (line: string): string[] =>
  line.split(/(?<=[.!?])\*{0,2}\s+|\n+/).filter((s) => s.trim().length > 0);

const normaliseClaim = (s: string): string => s.replace(/\s+/g, " ").trim();

/**
 * FNV-1a over the normalised sentence.
 *
 * The key is the whole sentence rather than a prefix, and that is the point: an
 * edited absolute is an absolute that wants re-checking. A prefix key would have
 * survived the one edit this rule most needed to see — the `void` runeword's
 * correction kept its opening sixty characters and replaced the claim after
 * them, and the replacement was false too.
 */
export const fingerprint = (sentence: string): string => {
  let h = 0x811c9dc5;
  const t = normaliseClaim(sentence);
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
};

/**
 * Every site-scoped exclusivity claim the corpus publishes, with the
 * enumeration that settles it.
 *
 * `why` names what to count, never the conclusion. "true: checked" is not a
 * `why`; "true: `pierce` is allocated by exactly one build" is.
 */
export const SITE_SCOPED_CLAIMS: { id: string; fingerprint: string; why: string }[] = [
  {
    id: "abyss-warlock/only-build-with-magic-skill-damage",
    fingerprint: "e32f9d35",
    why: "true: Void is the only registry entry carrying both `extra-mag` and `pierce-mag`, and exactly one build's gear references `{kind:'runeword', slug:'void'}`.",
  },
  {
    id: "blade-fury/only-assassin-build-with-constant-dps",
    fingerprint: "cb1b8b4c",
    why: "true: enumerate the seven Assassin builds' cadence — only Blade Fury's is fixed at five frames, with no speed stat reading it.",
  },
  {
    id: "cleave-warlock/only-melee-build-that-never-runs-out-of-mana",
    fingerprint: "f43cd6f1",
    why: "true: enumerate melee builds' primary-skill mana cost; Cleave's row is a flat 3 that does not grow and permits the swing at zero mana.",
  },
  {
    id: "dragon-tail/only-place-a-merc-aura-pays-twice",
    fingerprint: "be5565d8",
    why: "true: enumerate every build's `mercenaryNotes` for an aura whose percentage enters the damage formula twice; only Might on a fire-derived-from-physical kick does.",
  },
  {
    id: "enchant-sorceress/no-other-sorceress-wants-demon-machine",
    fingerprint: "634db01f",
    why: "true: exactly two builds reference `demon-machine`, and the other one's `classSlug` is `amazon`.",
  },
  {
    id: "exploding-arrow/only-fire-immunity-break-without-a-resistance-cost",
    fingerprint: "28965463",
    why: "true: enumerate registry entries that break fire immunity — Infinity and Flame Rift; Flame Rift costs 70-90 fire resistance, which this same page states three times.",
  },
  {
    id: "fohdin/only-paladin-never-in-melee-range",
    fingerprint: "1b474a75",
    why: "true: enumerate the Paladin builds' `primarySkill` and its range; every other one is swung or cast from inside the pack.",
  },
  {
    id: "multiple-shot/no-other-build-spends-fifteen-here",
    fingerprint: "dfc01efb",
    why: "true: enumerate `skills[].skill === 'pierce'` across `getBuilds()` — one build allocates it at all, and at fifteen.",
  },
  {
    id: "necromancer-journey/only-journey-with-no-decision",
    fingerprint: "6c4da060",
    why: "true: enumerate each journey's `stages[].skillPoints` for a fork; every other journey branches and this one is a straight line.",
  },
  {
    id: "warlock-journey/only-route-that-is-a-finished-build",
    fingerprint: "0292b1e5",
    why: "true: compare each journey's level-99 endpoint against its `targetBuild` core — only this pair matches, at 83 points.",
  },
  {
    id: "whirlwind-assassin/magic-is-a-common-immunity-in-one-area",
    fingerprint: "f89875a4",
    why: "true: count `commonImmunities` across the farming registry — magic appears in one area of twenty. Its en-US counterpart says 'the one type' and this rule does not catch it.",
  },
  {
    id: "phoenix-strike/only-area-three-elements-does-not-answer",
    fingerprint: "4f6ffed0",
    why: "true: enumerate areas whose `commonImmunities` contain fire, lightning and cold together — exactly one, the Worldstone Keep.",
  },

  // -- pt-BR mirrors. The enumeration is the one named on the en-US row. -----
  { id: "pt-br/abyss-warlock/only-build-with-magic-skill-damage", fingerprint: "964b8c2f", why: "pt-BR mirror of abyss-warlock/only-build-with-magic-skill-damage." },
  { id: "pt-br/blade-fury/only-assassin-build-with-constant-dps", fingerprint: "3f996a4d", why: "pt-BR mirror of blade-fury/only-assassin-build-with-constant-dps." },
  { id: "pt-br/cleave-warlock/only-melee-build-that-never-runs-out-of-mana", fingerprint: "2463f188", why: "pt-BR mirror of cleave-warlock/only-melee-build-that-never-runs-out-of-mana." },
  { id: "pt-br/dragon-tail/only-place-a-merc-aura-pays-twice", fingerprint: "3d24f4e1", why: "pt-BR mirror of dragon-tail/only-place-a-merc-aura-pays-twice." },
  { id: "pt-br/enchant-sorceress/no-other-sorceress-wants-demon-machine", fingerprint: "f91b5a69", why: "pt-BR mirror of enchant-sorceress/no-other-sorceress-wants-demon-machine." },
  { id: "pt-br/exploding-arrow/only-fire-immunity-break-without-a-resistance-cost", fingerprint: "71ebf9c8", why: "pt-BR mirror of exploding-arrow/only-fire-immunity-break-without-a-resistance-cost." },
  { id: "pt-br/fohdin/only-paladin-never-in-melee-range", fingerprint: "c09851e2", why: "pt-BR mirror of fohdin/only-paladin-never-in-melee-range." },
  { id: "pt-br/multiple-shot/no-other-build-spends-fifteen-here", fingerprint: "8e372c07", why: "pt-BR mirror of multiple-shot/no-other-build-spends-fifteen-here." },
  { id: "pt-br/necromancer-journey/only-journey-with-no-decision", fingerprint: "0bb04755", why: "pt-BR mirror of necromancer-journey/only-journey-with-no-decision." },
  { id: "pt-br/warlock-journey/only-route-that-is-a-finished-build", fingerprint: "8b9eec9a", why: "pt-BR mirror of warlock-journey/only-route-that-is-a-finished-build." },
];

/** Every site-scoped exclusivity claim with no row in the table above. */
export function checkSiteScopedClaims(
  lines: readonly string[],
  where: string,
): SiteClaimProblem[] {
  const known = new Set(SITE_SCOPED_CLAIMS.map((c) => c.fingerprint));
  const found: SiteClaimProblem[] = [];
  for (const line of lines) {
    for (const raw of siteSentencesIn(line)) {
      const sentence = normaliseClaim(raw);
      if (!SITE_SCOPE.test(sentence)) continue;
      if (!EXCLUSIVE.test(sentence)) continue;
      if (COMPARATIVE.test(sentence)) continue;
      const fp = fingerprint(sentence);
      if (known.has(fp)) continue;
      found.push({
        rule: "unregistered-site-scoped-claim",
        message:
          `${where}: "${sentence.slice(0, 110)}…" is scoped to this site and claims something ` +
          `about everything else on it. That is checkable by construction, so it has to carry ` +
          `the enumeration that settles it: add { id, fingerprint: "${fp}", why } to ` +
          `SITE_SCOPED_CLAIMS naming what to count, or weaken the sentence. If no enumeration ` +
          `settles it, the sentence is the defect.`,
      });
    }
  }
  return found;
}
