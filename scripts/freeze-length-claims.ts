/**
 * Freeze length, and the two ways this site got it wrong.
 *
 * WHAT HAPPENED
 * -------------
 * Three build pages published "its freeze runs 50 frames at one point and three
 * more per level" and concluded that a maxed Glacial Spike "holds a pack still
 * for over four seconds". The frames were right and the seconds were not.
 *
 * The 50 and the 3 are `Param3` and `Param4` on the Glacial Spike row, named by
 * the game itself "Freeze Length baseline" and "Freeze Length per level", read
 * through `auralencalc = ln34 * (100 + skill('Blizzard'.blvl) * par7) / 100`.
 * Those numbers are now extracted into the graph, so this module reads them
 * from there rather than restating them.
 *
 * What the pages left out is that a freeze is the one duration in this game
 * that is not the same length everywhere. `difficultylevels.txt` carries
 * `MonsterFreezeDivisor` and the engine divides by it. A level-20 Glacial Spike
 * is 107 frames, which is 4.3 seconds in Normal, 2.1 in Nightmare and **1.1 in
 * Hell** — and Hell is where every build that quoted the figure is played. The
 * published claim overstated its own crowd control by a factor of four on the
 * only difficulty that mattered.
 *
 * THE SECOND TRAP
 * ---------------
 * `blvl` in that expression is the hard-point level. Blizzard *points* lengthen
 * the freeze by 3% each; +skills from gear do not. This is the reverse of how
 * the damage columns read, which take the level gear gives you, so a page that
 * says "your Blizzard level lengthens it" is wrong in a way that reads perfectly
 * natural next to a damage sentence that says exactly that.
 *
 * WHAT IS GATED
 * -------------
 * Two rules, run over every string the site publishes in both locales:
 *
 *   freeze-length-without-difficulty   a line that states how long a freeze
 *                                      lasts, in frames or in seconds, without
 *                                      naming a difficulty
 *   freeze-length-reads-skill-level    a line that credits a *level* rather
 *                                      than *points* for lengthening a freeze
 *
 * The first is deliberately strict about frames as well as seconds. "50 frames"
 * is a true statement of the parameter, and it is also an invitation to divide
 * by 25 — which is the arithmetic that produced the error. A reader who is
 * given the frame count and not the divisor has been handed the mistake.
 *
 * Difficulty names are proper nouns in both locales here ("no Hell", "in Hell"),
 * so one word list serves both.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";

export interface FreezeProblem {
  rule: "freeze-length-without-difficulty" | "freeze-length-reads-skill-level";
  where: string;
  message: string;
}

export const FREEZE_RULES = [
  "freeze-length-without-difficulty",
  "freeze-length-reads-skill-level",
] as const;

/** D2 runs at 25 frames per second. */
const FRAMES_PER_SECOND = 25;

/**
 * `MonsterFreezeDivisor`, from `difficultylevels.txt` at the pinned extraction
 * (blizzhackers/d2data @ fc46999, "Updated for patch 3.3.93847"). The same file
 * carries `MonsterColdDivisor` with identical values, which governs chill
 * length rather than freeze length; only the freeze one is used here.
 */
export const MONSTER_FREEZE_DIVISOR = { normal: 1, nightmare: 2, hell: 4 } as const;
export type FreezeDifficulty = keyof typeof MONSTER_FREEZE_DIVISOR;

/**
 * Glacial Spike's freeze length, read out of the graph rather than transcribed.
 *
 * If the extraction ever produces different parameters, every number this module
 * derives moves with them and the prose that quotes them fails — which is the
 * whole point of reading it from here.
 */
export function glacialSpikeFreezeShape(): { base: number; perLevel: number } {
  const node = SKILL_GRAPH["glacial-spike"];
  const effect = node?.effects?.find((e) => e.labelKey === "effectFreezeLength");
  if (!effect || effect.shape.kind !== "linear") {
    throw new Error(
      "glacial-spike carries no linear effectFreezeLength effect. The freeze-length " +
        "controls derive every figure from that row; if the extraction stopped producing " +
        "it, fix the generator rather than hard-coding the numbers back in.",
    );
  }
  return { base: effect.shape.base, perLevel: effect.shape.perLevel };
}

/**
 * Freeze length in frames at a skill level, with Blizzard's hard points.
 *
 * `blizzardHardPoints` is a percentage bonus of 3 per point — `par7` on the same
 * row — and reads Blizzard's *base* level, so gear is deliberately not a
 * parameter here. The engine truncates; `Math.floor` matches it.
 */
export function freezeFramesAtLevel(level: number, blizzardHardPoints = 0): number {
  const { base, perLevel } = glacialSpikeFreezeShape();
  const own = base + perLevel * (level - 1);
  return Math.floor((own * (100 + blizzardHardPoints * 3)) / 100);
}

/** The same length as the player experiences it, after the difficulty divisor. */
export function freezeSecondsIn(
  difficulty: FreezeDifficulty,
  level: number,
  blizzardHardPoints = 0,
): number {
  const frames = Math.floor(
    freezeFramesAtLevel(level, blizzardHardPoints) / MONSTER_FREEZE_DIVISOR[difficulty],
  );
  return frames / FRAMES_PER_SECOND;
}

// ---------------------------------------------------------------------------
// Prose rules
// ---------------------------------------------------------------------------

/** A freeze is being discussed. Both locales; `congela` covers the verb forms. */
const FREEZE_SUBJECT = /\b(freeze|freezes|frozen solid|congelamento|congela|congelad)/i;

/**
 * A length is being stated: a number of frames or seconds, or one of the worded
 * quantities the pages use.
 *
 * The worded branch requires a qualifier — "half a second", "a little over a
 * second", "pouco mais de um segundo". A bare "a second" and a bare "um segundo"
 * are deliberately not matched, because both are far more often the *ordinal*:
 * "a second Faith on an Act 1 Rogue", "um segundo Faith". Nine sentences on the
 * live site read that way and every one of them was a false positive before this
 * branch was narrowed.
 */
const STATES_A_LENGTH =
  /\b\d+(?:[.,]\d+)?\s*(?:frames?|seconds?|segundos?)\b|\b(?:half|over|under|about|a little over|pouco mais de|cerca de|quase|meio)\s+(?:a\s+|um\s+)?(?:second|segundo)s?\b/i;

/**
 * Sentence boundaries.
 *
 * The rule runs per sentence rather than per string, because these strings are
 * paragraphs. "Holy Freeze stops the room" and "a second Faith" sat five
 * sentences apart in the same `why` field and matched each other; scoping to the
 * sentence is what makes the pair mean something.
 */
const sentencesIn = (line: string): string[] =>
  line.split(/(?<=[.!?])\s+|\n+|\s+—\s+/).filter((s) => s.trim().length > 0);

/** Any difficulty named. Proper nouns in both locales. */
const NAMES_A_DIFFICULTY = /\b(normal|nightmare|hell|pesadelo|inferno)\b/i;

/**
 * The divisor described without naming a difficulty — "quartered", "divided by
 * four", "dividida por quatro". Accepted, because a sentence that says the
 * length is quartered has told the reader the thing the rule exists to protect.
 */
const DESCRIBES_THE_DIVISOR =
  /\b(quarter(?:ed|s)?|halve[ds]?|divided by (?:two|four|2|4)|dividid[ao] por (?:dois|quatro|2|4)|pela metade|por quatro)\b/i;

/**
 * Crediting a skill *level* for a longer freeze, where the game reads points.
 *
 * Narrow on purpose: it fires only where a freeze length and a level are in the
 * same sentence. "Blizzard level" on a damage line is correct and must stay
 * silent.
 */
const CREDITS_A_LEVEL =
  /\b(?:n[ií]vel|level|levels|n[ií]veis)\b[^.]{0,60}\b(?:lengthen|longer|alonga|aumenta a dura|prolonga)/i;
const CREDITS_POINTS = /\b(hard points?|pontos? duros?|\bpoints?\b|\bpontos?\b)/i;

export function checkFreezeLengthClaims(lines: string[], where: string): FreezeProblem[] {
  const problems: FreezeProblem[] = [];
  for (const line of lines) {
    if (!FREEZE_SUBJECT.test(line)) continue;

    for (const sentence of sentencesIn(line)) {
      if (!FREEZE_SUBJECT.test(sentence)) continue;

      /*
       * The difficulty may be named in a neighbouring sentence — "a maxed one is
       * 107 frames. Hell quarters it." — so the qualification is looked for in
       * the whole string while the pairing is judged in the sentence.
       */
      if (
        STATES_A_LENGTH.test(sentence) &&
        !NAMES_A_DIFFICULTY.test(line) &&
        !DESCRIBES_THE_DIVISOR.test(line)
      ) {
        problems.push({
          rule: "freeze-length-without-difficulty",
          where,
          message:
            `${where}: states a freeze length without naming a difficulty — ` +
            `"${sentence.slice(0, 120)}". Freeze length is divided by MonsterFreezeDivisor ` +
            `(1 / 2 / 4), so an unqualified figure publishes the Normal number as though ` +
            `it were Hell's. Name the difficulty, or say the length is halved or quartered.`,
        });
      }

      if (CREDITS_A_LEVEL.test(sentence) && !CREDITS_POINTS.test(sentence)) {
        problems.push({
          rule: "freeze-length-reads-skill-level",
          where,
          message:
            `${where}: credits a skill *level* with lengthening a freeze — ` +
            `"${sentence.slice(0, 120)}". The length reads \`blvl\`, the hard-point level: ` +
            `points lengthen it and +skills from gear do not. Say "points".`,
        });
      }
    }
  }
  return problems;
}
