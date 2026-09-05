/**
 * Editorial controls for comparative claims, as pure functions.
 *
 * The site validates its *numbers* thoroughly: `check:content` compares every
 * generated effects table against the extraction, and `check:graph-drift`
 * proves no published node moved. What nothing checked was a **ranking** — a
 * sentence that takes two correct numbers and says which is bigger.
 *
 * An adversarial audit of the Druid pass found three of these shipped, in both
 * locales, all of them refuted by data already on the site:
 *
 * - Volcano's page called its 18% contribution to Armageddon "the largest
 *   single synergy coefficient in the class". Firestorm's page, four hundred
 *   lines earlier, publishes a **23%** pair.
 * - Fire Claws called its 22% pair "the highest pair on the class". Same 23%.
 * - Lycanthropy called +115% "the largest single life bonus available to any
 *   class". Oak Sage, on the same class, reaches **125%**.
 *
 * The first two also contradicted each other: 18 cannot be the largest single
 * coefficient if 22 is a pair. Three separate authors each compared a number
 * against the ones they happened to have open.
 *
 * So the ranking is derived here rather than remembered. Nothing is hard-coded:
 * `synergyCoefficients` reads the authored `bonus` strings, and the life rule
 * reads the generated graph. Both are the same sources the prose quotes, which
 * means a future skill with a 25% synergy fails these rules on the day it lands
 * rather than the day someone notices.
 *
 * Scope is deliberately narrow. These rules judge a superlative that is
 * *about* a synergy coefficient or a life bonus and that states a percentage.
 * A superlative about anything else — "the safest Hell farmer the class has" —
 * is an editorial judgement, not an arithmetic claim, and is none of this
 * file's business.
 *
 * Game stat strings and skill names are identical in both locales by ADR 0003,
 * so the numeric half of every pattern covers both languages; where the
 * load-bearing token is a verb or a quantifier, both languages are listed.
 */
import type { Skill } from "../lib/types";
import type { SkillGraphNode } from "../content/classes/skill-graph";
import { effectAtLevel } from "../lib/skills";

export interface SuperlativeProblem {
  rule: "synergy-superlative-wrong" | "life-superlative-contradicted";
  message: string;
}

/** The hard-point level every published superlative is stated at. */
export const CLAIM_LEVEL = 20;

// ===========================================================================
// The vocabulary
// ===========================================================================

const SUPERLATIVE =
  /\b(?:largest|highest|biggest|greatest|maior(?:es)?|mais\s+alt[ao]s?)\b/gi;
const RANK_SECOND = /\bsecond\b|\bsegund[ao]\b/i;
const PAIR = /\bpair\b|\bpar\b|\bpares\b/i;
const PHYSICAL_SCOPE = /\bphysical\b|\bf[íi]sic\w*\b/i;
const FIRE_SCOPE = /\bfire\b|\bfogo\b/i;
const SYNERGY_WORD = /\bsynerg\w*\b|\bsinergi\w*\b|\bcoefficient\w*\b|\bcoeficiente\w*\b/i;
const LIFE_WORD = /\blife\b|\bvida\b/i;
const PERCENT = /(\d+(?:\.\d+)?)\s?%/g;

/**
 * Sentence splitting that survives the site's own punctuation.
 *
 * Full stops inside "18%." end a sentence; the ones inside "2.15" and "e.g."
 * do not. Em dashes do not end one either — the corrected Volcano sentence
 * uses one to hang a second clause off the first, and splitting there would
 * hide the half that carries the number.
 */
export const sentencesOf = (lines: readonly string[]): string[] =>
  lines
    .flatMap((line) => line.split(/(?<![A-Z0-9])\.(?:\s|$)|[!?](?:\s|$)/))
    .map((s) => s.trim())
    .filter(Boolean);

// ===========================================================================
// The coefficients, read from the prose that publishes them
// ===========================================================================

export type CoefficientKind = "physical" | "fire" | "unqualified";

export interface Coefficient {
  receiver: string;
  source: string;
  value: number;
  kind: CoefficientKind;
}

/**
 * Every damage-synergy coefficient a class publishes, with its element.
 *
 * Absorb and duration synergies are excluded rather than folded in: Cyclone
 * Armor's "+50 frames of duration per level" is not a percentage and Hurricane's
 * "+7% absorbed" is a different quantity from a damage percentage. A ranking
 * that mixed them would be comparing frames with fire.
 */
export function synergyCoefficients(skills: readonly Skill[]): Coefficient[] {
  const out: Coefficient[] = [];
  for (const skill of skills) {
    for (const syn of skill.synergies ?? []) {
      const m = /^\+(\d+(?:\.\d+)?)%\s+(.*?)\s*per level$/i.exec(syn.bonus.trim());
      if (!m) continue;
      const qualifier = m[2].toLowerCase();
      if (!qualifier.includes("damage")) continue;
      out.push({
        receiver: skill.slug,
        source: syn.skill,
        value: Number(m[1]),
        kind: qualifier.includes("physical")
          ? "physical"
          : qualifier.includes("fire")
            ? "fire"
            : "unqualified",
      });
    }
  }
  return out;
}

/**
 * The values a superlative of a given shape is allowed to name, largest first.
 *
 * A `pair` claim ranks values that a single receiver holds at least twice —
 * which is what "pair" means on these pages and is why Fire Claws' 22% is
 * second rather than third: 23% appears twice on Firestorm, so it outranks it,
 * and Rabies' lone 20% is not a pair at all and does not sit between them.
 */
export function rankedValues(
  coefficients: readonly Coefficient[],
  scope: CoefficientKind | "any",
  shape: "single" | "pair",
): number[] {
  const inScope =
    scope === "any" ? [...coefficients] : coefficients.filter((c) => c.kind === scope);

  let values: number[];
  if (shape === "pair") {
    values = [];
    const byReceiver = new Map<string, number[]>();
    for (const c of inScope) {
      byReceiver.set(c.receiver, [...(byReceiver.get(c.receiver) ?? []), c.value]);
    }
    for (const list of byReceiver.values()) {
      for (const v of new Set(list)) {
        if (list.filter((x) => x === v).length >= 2) values.push(v);
      }
    }
  } else {
    values = inScope.map((c) => c.value);
  }
  return [...new Set(values)].sort((a, b) => b - a);
}

// ===========================================================================
// Rule 1 — a synergy superlative that names the wrong number
// ===========================================================================

/**
 * The clause a superlative governs: from the superlative word to the end of
 * its sentence.
 *
 * Clause-scoped rather than sentence-scoped, and that is the whole reason this
 * rule catches anything. The shipped Volcano sentence reads "It is
 * **Armageddon's physical synergy** at 18% per hard point, the largest single
 * synergy coefficient in the class" — the word "physical" is in the sentence
 * but not in the claim, and a sentence-scoped rule reads it as a narrowed claim
 * about physical synergies, which 18% genuinely is the largest of. The claim
 * being made is the unqualified one, and it starts at "largest".
 */
const clauseFrom = (sentence: string, at: number) => sentence.slice(at);

/** The percentage a claim is about: the last one stated before the claim. */
const statedBefore = (sentence: string, at: number): number | undefined => {
  const before = sentence.slice(0, at);
  const all = [...before.matchAll(new RegExp(PERCENT.source, "g"))];
  return all.length > 0 ? Number(all[all.length - 1][1]) : undefined;
};

export function checkSynergySuperlatives(
  lines: readonly string[],
  coefficients: readonly Coefficient[],
  where: string,
): SuperlativeProblem[] {
  const found: SuperlativeProblem[] = [];
  if (coefficients.length === 0) return found;

  for (const sentence of sentencesOf(lines)) {
    if (!SYNERGY_WORD.test(sentence)) continue;

    for (const match of sentence.matchAll(SUPERLATIVE)) {
      const at = match.index;
      const clause = clauseFrom(sentence, at);
      const stated = statedBefore(sentence, at);
      if (stated === undefined) continue;

      const scope: CoefficientKind | "any" = PHYSICAL_SCOPE.test(clause)
        ? "physical"
        : FIRE_SCOPE.test(clause)
          ? "fire"
          : "any";
      const shape = PAIR.test(clause) ? "pair" : "single";
      const rank = RANK_SECOND.test(sentence) ? 2 : 1;

      const ranked = rankedValues(coefficients, scope, shape);
      const expected = ranked[rank - 1];
      if (expected === undefined || stated === expected) continue;

      const owner = coefficients.find((c) => c.value === expected);
      found.push({
        rule: "synergy-superlative-wrong",
        message:
          `${where}: "${sentence.slice(0, 130)}" calls ${stated}% the ` +
          `${rank === 2 ? "second-" : ""}largest ${scope === "any" ? "" : `${scope} `}` +
          `synergy ${shape === "pair" ? "pair " : ""}in the class. ` +
          `The authored coefficients rank ${ranked.slice(0, 4).join("%, ")}% — ` +
          `${expected}% is the one that claim names` +
          `${owner ? `, on ${owner.receiver} from ${owner.source}` : ""}.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Rule 2 — a life superlative a skill on the same class refutes
// ===========================================================================

/** Every percentage life bonus a class publishes, at the claim level. */
export function lifeBonuses(
  nodes: Readonly<Record<string, SkillGraphNode>>,
  classSlug: string,
): { slug: string; percent: number }[] {
  const out: { slug: string; percent: number }[] = [];
  for (const [slug, node] of Object.entries(nodes)) {
    if (node.classSlug !== classSlug) continue;
    for (const effect of node.effects ?? []) {
      if (effect.unit !== "percent") continue;
      if (!/LifeBonus|PartyLife/i.test(effect.labelKey)) continue;
      const value = effectAtLevel(effect, CLAIM_LEVEL);
      if (value !== undefined) out.push({ slug, percent: value });
    }
  }
  return out.sort((a, b) => b.percent - a.percent);
}

/**
 * A superlative about a life percentage that a larger, unnamed life percentage
 * on the same class contradicts.
 *
 * Naming the larger source is the exemption, and it is not a loophole: a
 * sentence that says "only a maxed Oak Sage gives this class more" has made the
 * comparison rather than dodged it. What the rule refuses is the unqualified
 * superlative — the shape all three shipped errors had.
 */
export function checkLifeSuperlatives(
  lines: readonly string[],
  bonuses: readonly { slug: string; percent: number }[],
  where: string,
): SuperlativeProblem[] {
  const found: SuperlativeProblem[] = [];
  const nameOf = (slug: string) => slug.replace(/-/g, " ");

  for (const sentence of sentencesOf(lines)) {
    if (!LIFE_WORD.test(sentence)) continue;

    for (const match of sentence.matchAll(SUPERLATIVE)) {
      const stated = statedBefore(sentence, match.index);
      if (stated === undefined) continue;

      const bigger = bonuses.filter(
        (b) =>
          b.percent > stated &&
          !new RegExp(`\\b${nameOf(b.slug).replace(/\s+/g, "\\s+")}\\b`, "i").test(sentence),
      );
      if (bigger.length === 0) continue;

      found.push({
        rule: "life-superlative-contradicted",
        message:
          `${where}: "${sentence.slice(0, 130)}" calls ${stated}% the largest life ` +
          `bonus, and does not name ${bigger
            .map((b) => `${b.slug} (${b.percent}%)`)
            .join(", ")} — published on the same class, from the same graph.`,
      });
      break;
    }
  }
  return found;
}
