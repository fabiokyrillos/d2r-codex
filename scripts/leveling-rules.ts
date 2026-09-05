/**
 * What a levelling walkthrough is allowed to promise.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * A journey is the one document on the site that a reader executes in order,
 * one point at a time, over forty hours. Every other page can be read out of
 * sequence and re-checked; this one cannot. A stage that tells someone to put a
 * point in Lightning Sentry at level 18 does not look wrong on the page — it
 * looks wrong ninety minutes later, in the game, with no points left over.
 *
 * So the rules here are the ones the *game* enforces and the page cannot see:
 *
 *   points      you have `level - 1` from levelling and at most 4 more per
 *               difficulty from quests. Nothing can claim more than that.
 *   unlocks     a skill named in a stage has to be reachable inside the stage's
 *               level band, and so does every runeword the stage recommends.
 *   arithmetic  a sentence that shows its working — "43 + 9 = 52" — has to be
 *               right, because that is the sentence a reader trusts most.
 *   respecs     a respec that names a total has to name one the level can hold.
 *
 * Deliberately generic. Nothing below knows which class it is reading, and all
 * six journeys go through it — the Assassin's arithmetic is not more likely to
 * be wrong than anyone else's, it is only more recent.
 *
 * PROVENANCE
 *   Skill unlock levels and prerequisites come from `content/classes/skill-graph.ts`,
 *   which is generated from the pinned extraction. Quest rewards are the game's:
 *   Den of Evil 1, Radament's Lair 1, The Fallen Angel 2, per difficulty.
 */
import { SKILL_GRAPH, MAX_HARD_POINTS } from "../content/classes/skill-graph";
import type { Difficulty, ProgressionJourney, ProgressionStage, Runeword } from "../lib/types";

export const LEVELING_RULES = [
  "points-exceed-what-the-level-holds",
  "quest-points-invented",
  "skill-named-before-its-level",
  "runeword-named-before-its-level",
  "arithmetic-does-not-add-up",
  "respec-total-impossible",
] as const;
export type LevelingRule = (typeof LEVELING_RULES)[number];

export interface LevelingProblem {
  rule: LevelingRule;
  where: string;
  message: string;
}

/**
 * Skill points from quests, cumulative by the time you are playing a
 * difficulty. Den of Evil 1 + Radament 1 + Izual 2 = 4 each.
 *
 * Cumulative rather than per-difficulty because a character in Hell still has
 * the Normal and Nightmare rewards, and the bound has to allow for that.
 */
export const QUEST_POINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  normal: 4,
  nightmare: 8,
  hell: 12,
};

/** The three quests that give skill points. Anything else named is invented. */
export const QUEST_SKILL_REWARDS = [
  "Den of Evil",
  "Radament",
  "Izual",
  "The Fallen Angel",
] as const;

/** Total quest skill points in the game, across all three difficulties. */
export const TOTAL_QUEST_POINTS = 12;

/** The most skill points a character at `level` in `difficulty` can have. */
export function pointsAvailable(level: number, difficulty: Difficulty): number {
  return level - 1 + QUEST_POINTS_BY_DIFFICULTY[difficulty];
}

// ---------------------------------------------------------------------------
// Prose extraction
// ---------------------------------------------------------------------------

/**
 * "43 + 9 = 52", "90 + 19 + 1 = 110", "52 + 27 = 79".
 *
 * Only sums, and only where every term is a bare integer. A page that writes
 * "20 + 20 skill points = 40 damage" is not making an arithmetic claim about
 * points and is not this rule's business; requiring the whole expression to be
 * numeric is what keeps it out.
 */
const SUM_CLAIM = /(\d{1,3})(\s*\+\s*\d{1,3})+\s*=\s*(\d{1,3})/g;

/**
 * A stated point total: "That is 13 points", "45 points at level 40",
 * "the skill screen reads 52 spent".
 *
 * Not "20 points in Fade" — that is an allocation, not a total, and the two
 * read almost identically. The patterns below all require a word that means
 * *the whole budget*.
 */
const TOTAL_CLAIM =
  /\b(?:that is|these are|spent in total|in total|reads)\s+(\d{1,3})\s*(?:points?|spent)|\b(\d{1,3})\s+points?\s+(?:at level\s+(\d{1,3})|spent in total|in total)|\breads\s+(\d{1,3})\s+spent/gi;

function statedSums(text: string): { expr: string; terms: number[]; stated: number }[] {
  const out: { expr: string; terms: number[]; stated: number }[] = [];
  for (const m of text.matchAll(SUM_CLAIM)) {
    const [expr] = m;
    const [lhs, rhs] = expr.split("=");
    const terms = lhs.split("+").map((t) => Number(t.trim()));
    out.push({ expr: expr.trim(), terms, stated: Number(rhs.trim()) });
  }
  return out;
}

function statedTotals(text: string): { value: number; atLevel?: number }[] {
  const out: { value: number; atLevel?: number }[] = [];
  for (const m of text.matchAll(TOTAL_CLAIM)) {
    const value = Number(m[1] ?? m[2] ?? m[4]);
    if (!Number.isFinite(value)) continue;
    const atLevel = m[3] ? Number(m[3]) : undefined;
    out.push({ value, atLevel });
  }
  return out;
}

/** Skill display names in the graph, longest first so "Fire Blast" wins over "Fire". */
function skillNamesFor(classSlug: string): { name: string; slug: string; level: number }[] {
  return Object.entries(SKILL_GRAPH)
    .filter(([, node]) => node.classSlug === classSlug)
    .map(([slug, node]) => ({
      slug,
      level: node.requiredLevel,
      name: slug
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
    }))
    .sort((a, b) => b.name.length - a.name.length);
}

// ---------------------------------------------------------------------------
// The rules
// ---------------------------------------------------------------------------

export function checkJourney(
  journey: ProgressionJourney,
  runewordFor: (slug: string) => Runeword | undefined,
  where: string,
): LevelingProblem[] {
  const problems: LevelingProblem[] = [];
  const add = (rule: LevelingRule, message: string) =>
    problems.push({ rule, where, message: `${where}: ${message}` });

  const names = skillNamesFor(journey.classSlug);

  for (const [index, stage] of journey.stages.entries()) {
    const [, top] = stage.levels;
    const ceiling = Math.min(pointsAvailable(top, stage.difficulty), MAX_HARD_POINTS);
    const stageText = [
      ...stage.skillPoints,
      ...stage.statPoints,
      ...stage.actions.map((a) => a.text),
      stage.exitCriteria ?? "",
    ].join("\n");

    // --- points, and the quest points that pad them ------------------------
    for (const { value, atLevel } of statedTotals(stageText)) {
      if (value > MAX_HARD_POINTS) {
        add(
          "points-exceed-what-the-level-holds",
          `claims ${value} points, above the ${MAX_HARD_POINTS} a level-99 character can ever have`,
        );
        continue;
      }
      const bound = atLevel
        ? Math.min(pointsAvailable(atLevel, stage.difficulty), MAX_HARD_POINTS)
        : ceiling;
      if (value > bound) {
        add(
          "points-exceed-what-the-level-holds",
          `claims ${value} points ${atLevel ? `at level ${atLevel}` : `by level ${top}`} in ` +
            `${stage.difficulty}, where the most available is ${bound}`,
        );
      }
      /*
       * Only over-claiming is an error. A later stage restating an earlier,
       * smaller total — "the 13 points you had in Act 1" — is ordinary prose,
       * and a monotonic rule cannot tell it from a ledger that has gone
       * backwards. The arithmetic rule below is where a broken ledger is
       * actually caught, because a ledger that does not close shows its
       * working and the working is checkable.
       */
    }

    /*
     * A quest that does not exist is the quiet way a ledger gains a point. The
     * rule is narrow on purpose: it fires only where a sentence attributes a
     * *skill point* to a named quest, because plenty of quests are worth
     * mentioning for other reasons.
     */
    for (const sentence of stageText.split(/(?<=[.!?])\s+|\n+/)) {
      if (!/\bskill point/i.test(sentence)) continue;
      /*
       * A sentence that says what a quest gives *instead* of a skill point is
       * the page doing this rule's job for it — "Lam Esen's Tome gives +5 stat
       * points, not a skill point" names both and is correct.
       */
      if (/\bstat points?\b|\bpontos? de atributo\b|\bnot a skill point\b/i.test(sentence))
        continue;
      const named = sentence.match(
        /\b(Den of Evil|Radament|Izual|The Fallen Angel|Lam Esen|Golden Bird|Tree of Inifuss|Horadric|Blood Raven|Countess|Cube)\b/gi,
      );
      for (const q of named ?? []) {
        const ok = QUEST_SKILL_REWARDS.some((r) => r.toLowerCase() === q.toLowerCase());
        if (!ok)
          add(
            "quest-points-invented",
            `attributes a skill point to "${q}", which gives none — the three that do are ` +
              `Den of Evil, Radament's Lair and The Fallen Angel`,
          );
      }
    }

    // --- unlocks -----------------------------------------------------------
    /*
     * Naming a skill is not allocating into it. A skill-point line legitimately
     * says "Might, and it is a Blessed Aim prerequisite later" in a stage that
     * ends before Blessed Aim exists, and "Decrepify unlocks at 24, not 30" is
     * the page correcting a widespread error. Both would trip a rule that fired
     * on the name alone, and the author would then delete the rule.
     *
     * So the rule fires on allocation *phrasing*: the skill's name followed by
     * a point count. That is how every line in every journey on this site
     * writes an actual allocation — "Fire Blast to 11", "Fissure 2",
     * "Death Sentry 9 → 20", "Telekinesis, one point". A line naming the
     * unlock level is exempt as well, because saying when a skill arrives is
     * the opposite of the mistake.
     */
    for (const line of stage.skillPoints) {
      const numbers = [...line.matchAll(/\d{1,3}/g)].map((m) => Number(m[0]));
      for (const { name, slug, level } of names) {
        if (level <= top) continue;
        const allocates = new RegExp(
          `\\b${name}\\b(?:\\*\\*)?[,:]?\\s*(?:to\\s+)?(?:\\d{1,2}\\b|(?:one|1)\\s+point)`,
          "i",
        );
        if (!allocates.test(line)) continue;
        if (numbers.some((n) => n >= level)) continue;
        add(
          "skill-named-before-its-level",
          `allocates ${name} in a stage ending at level ${top}, but "${slug}" unlocks at ${level} ` +
            `and the line does not say so`,
        );
      }
    }

    /*
     * `gearTargets` is explicitly "gear worth actively hunting during this
     * stage", so a level-19 Leaf listed at level 13 is the field working as
     * designed — you collect the runes now. Actions are the instruction to
     * make and equip, and those are checked.
     *
     * `atLevel` is the only promise here, and it is rendered as a level badge
     * beside the step — "Lv 12 · make Leaf" is a reader at level 12 being told
     * to equip a level-19 item. An action with no `atLevel` is a stage-wide
     * suggestion and the gear list carries its timing, so it is left alone.
     *
     * The escape is the text naming the level, because one action can carry
     * two runewords: "At 25, make Spirit. At 27, make Lore" is right, and its
     * `atLevel` can only hold one of the two numbers.
     */
    for (const action of stage.actions) {
      if (action.atLevel === undefined) continue;
      /*
       * Only numbers written as a level. A Treachery step reading "45% attack
       * speed" contains 45, which is above the runeword's requirement and
       * would silence the rule for a reason that has nothing to do with levels.
       */
      const namesALevel = [
        ...action.text.matchAll(
          /\b(?:at|level|lvl|n[íi]vel|n[íi]veis|no|aos?)\s+(\d{1,3})\b/gi,
        ),
      ].map((m) => Number(m[1]));
      for (const ref of action.refs ?? []) {
        if (ref.kind !== "runeword") continue;
        const rw = runewordFor(ref.slug);
        if (!rw) continue; // resolution is check-content's job, not this file's
        if (rw.requiredLevel <= action.atLevel) continue;
        if (namesALevel.some((n) => n >= rw.requiredLevel)) continue;
        add(
          "runeword-named-before-its-level",
          `steps the reader to ${rw.name} at level ${action.atLevel}, but it requires ` +
            `${rw.requiredLevel} and the step does not say so`,
        );
      }
    }
  }

  // --- arithmetic, over the whole journey including the overview -----------
  const everything = [
    journey.summary,
    ...journey.overview,
    ...(journey.respecPlan ?? []).flatMap((r) => [r.at, r.why]),
    ...journey.stages.flatMap((s) => [
      s.summary,
      s.goal,
      s.killingWith,
      ...s.skillPoints,
      ...s.statPoints,
      ...s.actions.map((a) => a.text),
      s.exitCriteria ?? "",
    ]),
  ].join("\n");

  for (const { expr, terms, stated } of statedSums(everything)) {
    const sum = terms.reduce((a, b) => a + b, 0);
    if (sum !== stated)
      add("arithmetic-does-not-add-up", `"${expr}" — the terms add to ${sum}`);
  }

  // --- respecs -------------------------------------------------------------
  for (const respec of journey.respecPlan ?? []) {
    const text = `${respec.at} ${respec.why}`;
    const level = text.match(/\blevel\s+(\d{1,3})\b/i);
    if (!level) continue;
    const difficulty: Difficulty = /nightmare/i.test(text)
      ? "nightmare"
      : /\bhell\b/i.test(text)
        ? "hell"
        : "normal";
    const bound = Math.min(pointsAvailable(Number(level[1]), difficulty), MAX_HARD_POINTS);
    for (const { value } of statedTotals(text)) {
      if (value > bound)
        add(
          "respec-total-impossible",
          `a respec at level ${level[1]} in ${difficulty} claims ${value} points; the most ` +
            `available there is ${bound}`,
        );
    }
    for (const n of text.matchAll(/\b(\d{1,3})\s+points?\s+come\s+back\b/gi)) {
      if (Number(n[1]) > bound)
        add(
          "respec-total-impossible",
          `a respec at level ${level[1]} returns ${n[1]} points; the most available is ${bound}`,
        );
    }
  }

  return problems;
}

/** Exported so a test can plant a mutation against a real stage. */
export type { ProgressionStage };
