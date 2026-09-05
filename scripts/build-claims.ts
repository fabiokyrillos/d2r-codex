/**
 * Editorial controls for the claims a build page makes about the rest of the
 * site, as pure functions.
 *
 * A build page is the only page on this site that talks about other pages'
 * data in prose. It says an area has no immunity of some kind; it recommends an
 * item at a character level; it quotes a damage number from a skill. Each of
 * those is checkable against the entity being talked about, and until this file
 * none of them was.
 *
 * All three rules here were written because the repository shipped the thing
 * they check.
 *
 * **Immunity denials.** Five build pages told the reader that nothing in the
 * Secret Cow Level is immune to physical damage. `content/farming/areas.ts`
 * lists `commonImmunities: ["physical"]` for that area, in the field whose own
 * comment reads "Common immunities you must plan around, in Hell". The site
 * contradicted itself in two directions at once, and a reader planning a
 * physical build around the Cow Level was being told the wrong thing by
 * whichever page they read second.
 *
 * **Gear a character cannot wear yet.** Gear sets carry a `levelRange`, and
 * catalogued items carry a `requiredLevel`. Nothing compared them, so a
 * runeword ten levels above the tier it was listed in would have shipped
 * silently — and on a six-tier progression the whole point of the tier is that
 * you can use what is in it.
 *
 * **Poison stated as a rate.** `damageAtLevel` multiplies poison's per-frame
 * damage by its duration precisely so the site publishes the number the game
 * shows: a *total* dealt across the poison's life. A page that then calls that
 * total a per-second figure has divided the site's own arithmetic by eleven
 * without saying so. Rabies is the build where this matters most and it is the
 * newest page here, which is exactly when to write the rule.
 *
 * Nothing is imported from content: callers supply the entities, and
 * `build-claims.test.ts` hands these functions the sentences the repository
 * actually shipped.
 */
import type { Build, Element, FarmingArea, ProgressionTier } from "../lib/types";

export interface BuildClaimProblem {
  rule: "immunity-denied-that-the-area-lists" | "gear-above-its-tier" | "poison-stated-as-a-rate";
  message: string;
}

// ===========================================================================
// Rule 1 — an immunity denied that the area's own data lists
// ===========================================================================

/**
 * Element names as prose, in both locales.
 *
 * `magic` has no Portuguese entry that is safe to match: "mágico" appears in
 * "magic find" translations and in item names, and this rule is about a
 * quantifier next to an element rather than about the word on its own.
 */
const ELEMENT_WORDS: Record<Element, RegExp> = {
  physical: /\b(?:physical|f[íi]sico)\b/i,
  fire: /\b(?:fire|fogo)\b/i,
  cold: /\b(?:cold|frio)\b/i,
  lightning: /\b(?:lightning|raio)\b/i,
  poison: /\b(?:poison|veneno)\b/i,
  magic: /\bmagic\b/i,
};

/**
 * A sentence denying that an immunity is present.
 *
 * Both shapes the site uses: "nothing there is immune to physical" puts the
 * quantifier first, and "no cold immunes" puts it in front of the element. The
 * Portuguese equivalents are listed rather than derived, because "nada ali é
 * imune a" and "sem imunes a" are different constructions.
 */
const DENIAL_BEFORE =
  /\b(?:nothing|no monster|not one monster|nada|nenhum monstro)\b[^.!?]{0,70}?\b(?:immune to|imune a)\b/i;
const DENIAL_INLINE = /\b(?:no|sem|zero)\s+(?:\w+\s+){0,2}?(?:immunes?|imunes?)\b/i;

/**
 * A quantifier softened on purpose, which is not the error this rule is for.
 *
 * "Area level 85 with almost nothing physically immune — its recorded
 * immunities are fire and poison" is the Strafe Amazon's Ancient Tunnels entry,
 * and it is *more* accurate than an absolute would be: unique packs roll
 * immunity modifiers the base population does not carry, and the area's own
 * notes say exactly that. A rule that rejected that sentence would push authors
 * toward vaguer prose rather than truer prose.
 *
 * This is the opposite call from the one `immunity-claims.ts` makes about
 * hedges, and deliberately so. There the hedge was false — a mastery does
 * *exactly* nothing against a target that is still immune, so "almost nothing"
 * overstated it. Here the hedge is true and the absolute is what the data
 * refutes.
 */
const HEDGE =
  /\balmost\b|\bessentially\b|\bpractically\b|\bvirtually\b|\bnearly\b|\bmostly\b|\bquase\b|\bpraticamente\b|\bvirtualmente\b/i;

/**
 * Which elements a piece of prose denies are present.
 *
 * Scoped to the clause after the denial marker, so "Nothing there is immune to
 * physical, and Hurricane's cold does the rest" does not read as a denial of
 * cold immunity as well.
 */
export function deniedElements(text: string): Element[] {
  const found = new Set<Element>();
  for (const sentence of text.split(/(?<![A-Z0-9])[.!?](?:\s|$)/)) {
    const before = DENIAL_BEFORE.exec(sentence);
    const inline = DENIAL_INLINE.exec(sentence);
    const match = before ?? inline;
    if (!match) continue;

    /*
     * From the denial marker to the end of the clause, where a clause ends at
     * a comma followed by a conjunction, at a dash, or at a semicolon — the
     * three shapes the pages actually use. The dash matters: several entries
     * hang the area's real immunity list off one, and reading past it turns a
     * correct sentence into a denial of the thing it just named.
     */
    const after = sentence
      .slice(match.index)
      .split(/,\s+(?:and|but|e|mas)\b|\s[—–-]\s|;/)[0];
    if (HEDGE.test(sentence.slice(0, match.index + after.length))) continue;
    for (const [element, pattern] of Object.entries(ELEMENT_WORDS) as [Element, RegExp][]) {
      if (pattern.test(after)) found.add(element);
    }
  }
  return [...found];
}

/**
 * A build's Hell farming entries, checked against each area's own list.
 *
 * Hell only, and deliberately: `commonImmunities` is documented as the Hell
 * population, so a claim about a Nightmare run is not something this data can
 * refute.
 */
export function checkFarmingImmunityDenials(
  builds: readonly Build[],
  areaOf: (slug: string) => FarmingArea | undefined,
  where: string,
): BuildClaimProblem[] {
  const found: BuildClaimProblem[] = [];
  for (const build of builds) {
    for (const entry of build.farming) {
      if (entry.difficulty !== "hell") continue;
      const area = areaOf(entry.area);
      if (!area) continue;
      for (const element of deniedElements(entry.why)) {
        if (!area.commonImmunities.includes(element)) continue;
        found.push({
          rule: "immunity-denied-that-the-area-lists",
          message:
            `${where}/${build.slug}: the ${entry.area} entry says nothing there is immune to ` +
            `${element}, and that area's own commonImmunities lists ${area.commonImmunities.join(", ")}. ` +
            `One of the two pages is wrong, and the area's data is the one a reader plans around.`,
        });
      }
    }
  }
  return found;
}

// ===========================================================================
// Rule 2 — gear listed in a tier the character cannot use it in
// ===========================================================================

export interface LevelledRef {
  label: string;
  requiredLevel?: number;
}

/**
 * Every gear pick in a tier whose item outranks the tier's own level band.
 *
 * The upper bound is used rather than the lower: a tier spanning 65–75 is
 * advice for a character somewhere in that band, and an item requiring 70 is
 * reachable inside it. An item requiring 80 is not, and that is the error.
 *
 * Tiers with no `levelRange` are skipped rather than guessed at.
 */
export function checkGearLevelFeasibility(
  builds: readonly Build[],
  resolve: (ref: unknown) => LevelledRef | undefined,
  where: string,
): BuildClaimProblem[] {
  const found: BuildClaimProblem[] = [];

  const walk = (
    picks: readonly { ref?: unknown; label?: string; alternatives?: readonly unknown[] }[] | undefined,
    build: Build,
    tier: ProgressionTier,
    cap: number,
  ) => {
    for (const pick of picks ?? []) {
      if (pick.ref) {
        const entity = resolve(pick.ref);
        if (entity?.requiredLevel !== undefined && entity.requiredLevel > cap) {
          found.push({
            rule: "gear-above-its-tier",
            message:
              `${where}/${build.slug} ${tier}: ${entity.label} requires level ` +
              `${entity.requiredLevel}, and the tier's level range ends at ${cap}. ` +
              `A reader following this tier cannot equip it yet.`,
          });
        }
      }
      walk(
        pick.alternatives as typeof picks,
        build,
        tier,
        cap,
      );
    }
  };

  for (const build of builds) {
    for (const set of build.gearSets) {
      const cap = set.levelRange?.[1];
      if (cap === undefined) continue;
      for (const entry of set.slots) walk(entry.picks, build, set.tier, cap);
      walk(set.charms, build, set.tier, cap);
      walk(set.weaponSwap, build, set.tier, cap);
    }
  }
  return found;
}

// ===========================================================================
// Rule 3 — poison damage stated as a rate
// ===========================================================================

/** A number large enough to be a published poison total rather than a percentage. */
const DAMAGE_NUMBER = /\b\d{2,}\s*[-–—]\s*\d{2,}\b|\b\d{3,}\b/;
const POISON_WORD = /\b(?:poison|veneno|venenoso\w*)\b/i;
const PER_SECOND =
  /\bper second\b|\ba second\b|\bdps\b|\bdamage per second\b|\bpor segundo\b|\bpor segundos\b|\bdano por segundo\b/i;

/**
 * Poison damage described as a rate rather than as the total it is.
 *
 * The site's own `damageAtLevel` multiplies poison's per-frame value by the
 * duration, so every poison number it publishes is the whole amount dealt over
 * the poison's life. Rabies at twenty hard points is 924–996 across 290 frames;
 * calling that "924–996 damage per second" overstates it by a factor of
 * eleven and a half.
 *
 * A sentence that states the duration alongside the number is exempt, because
 * that is the sentence a reader can convert for themselves — which is the
 * distinction between reporting a total and quietly converting one.
 */
const STATES_DURATION =
  /\bover\b[^.!?]{0,40}?\b(?:seconds?|frames?|s\b)|\bdurante\b|\bao longo de\b|\bsegundos de dura[çc][ãa]o\b|\bframes?\b|\bquadros?\b/i;

export function checkPoisonRateClaims(
  lines: readonly string[],
  where: string,
): BuildClaimProblem[] {
  const found: BuildClaimProblem[] = [];
  for (const line of lines) {
    for (const sentence of line.split(/(?<![A-Z0-9])[.!?](?:\s|$)/)) {
      if (!POISON_WORD.test(sentence)) continue;
      if (!DAMAGE_NUMBER.test(sentence)) continue;
      if (!PER_SECOND.test(sentence)) continue;
      if (STATES_DURATION.test(sentence)) continue;
      found.push({
        rule: "poison-stated-as-a-rate",
        message:
          `${where}: "${sentence.trim().slice(0, 120)}" states a poison number as a rate. ` +
          `Every poison figure this site publishes is the total dealt across the duration — ` +
          `damageAtLevel multiplies the per-frame value by the frames — so a per-second ` +
          `reading of it is wrong by the length of the poison.`,
      });
    }
  }
  return found;
}
