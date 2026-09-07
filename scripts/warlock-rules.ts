/**
 * Controls for the Warlock, derived from this class's mechanics and no other's.
 *
 * The class arrived seven months ago with no community corpus, which changes
 * what a control is for. On the Assassin the danger was a sentence true of
 * another class; here it is a sentence true of *no* class, written because
 * nothing existed to contradict it. Six of the ten rules below were written
 * against defects that actually shipped on these pages and were caught by a
 * reviewer rather than by a gate — the census, the two-hander superlative, the
 * three synergy superlatives — and the rest against the mechanics research
 * flagged as most likely to be got wrong.
 *
 * Nothing here re-implements a general rule. Immunity arithmetic belongs to
 * `immunity-claims.ts`, point budgets to `allocation-claims.ts`, synergy
 * *magnitudes* to `superlative-claims.ts`. What is left is the set of claims
 * only this class can make, and only this class can get wrong.
 *
 * Every constant below carries its provenance. Where a rule can read a fact
 * rather than restate it — the graph's edges, a runeword's rune count, a
 * build's own `release` field — it reads it, because a rule that compares a
 * literal to the same literal proves nothing and is deleted by the first author
 * it inconveniences.
 */
import type { Build } from "../lib/types";
import type { SkillGraphNode } from "../content/classes/skill-graph";

export const WARLOCK_RULES = [
  "dlc-gate-missing",
  "base-game-availability-claimed",
  "two-hander-exclusivity-overstated",
  "grimoire-over-two-sockets",
  "demon-cap-wrong",
  "bound-demon-inside-the-cap",
  "synergy-claimed-with-no-edge",
  "sigil-death-threshold-scales",
  "pierce-element-swapped",
  "miasma-chain-cast-rate-breakpoint",
] as const;
export type WarlockRule = (typeof WARLOCK_RULES)[number];

export interface WarlockProblem {
  rule: WarlockRule;
  where: string;
  message: string;
}

// ===========================================================================
// Pinned facts
// ===========================================================================

/** The release every Warlock page belongs to. The class is paid DLC. */
export const WARLOCK_RELEASE = "reign-of-the-warlock";

/**
 * `weapons.json` at the pinned commit carries **eighteen** rows with
 * `1or2handed = 1`, and every one of them is `type = "swor"`. No staff, mace,
 * sceptre, club or hammer carries the flag.
 *
 * This is the whole content of the Barbarian's version of the Warlock's trick,
 * and the reason the Warlock's claim has to be worded rather than shouted: the
 * Warlock pairs *any* two-hander with an off-hand, the Barbarian only these.
 * The Cleave page's own best weapon, Dreadfang, sits on a Legend Sword — which
 * is on this list — so the page that said "no other class can do this" was
 * making the claim over the one weapon where somebody else can.
 */
export const ONE_HANDABLE_TWO_HANDERS = 18;
export const ONE_HANDABLE_TYPE = "swor";

/**
 * Every Grimoire base in `armor.json` carries `gemsockets = 2`. All fifteen of
 * them, normal through elite.
 *
 * That single number is the class's off-hand rule: Spirit is four runes and
 * Ancients' Pledge is three, so neither can ever go in one, and Vigilance is
 * the two-rune word the expansion added for the slot.
 */
export const GRIMOIRE_SOCKETS = 2;

/**
 * `petmax` on all three summons, verbatim:
 *   `(skill('Demonic Mastery'.blvl)>=10)?3:((skill('Demonic Mastery'.blvl)>=5)?2:1)`
 *
 * `blvl` is hard points, so `+skills` from gear move neither threshold. The
 * three summons share `pettype = demon`, which is why the cap is a total rather
 * than one of each.
 */
export const DEMON_CAP_STEPS = [
  { hardPoints: 0, cap: 1 },
  { hardPoints: 5, cap: 2 },
  { hardPoints: 10, cap: 3 },
] as const;
export const DEMON_CAP_MAX = 3;

/** Bind Demon is `pettype = binddemon`, `petmax = 1` — a separate pool. */
export const BOUND_DEMON_CAP = 1;

/**
 * Sigil: Death's execute thresholds, from `calc1` and `calc2`:
 *   `ln12` with `par1 = 13, par2 = 0`  -> 13% for a normal monster
 *   `ln34` with `par3 = 10, par4 = 0`  -> 10% for a champion, unique or superunique
 *
 * Both per-level parameters are **zero**, which is what makes one hard point
 * the whole skill. A page describing the threshold as rising is describing a
 * different skill.
 */
export const SIGIL_DEATH_THRESHOLDS = { normal: 13, champion: 10 } as const;

/**
 * The pierce inversion, and the most counter-intuitive fact about the class.
 *
 * In the **skills** there is exactly one resistance reduction and it is fire:
 * Apocalypse's `aurastat1 = fireresist`, `-min(ln12,40)`. Nothing else in any
 * tree lowers any resistance.
 *
 * In the **gear** the pierce is magic and there is a lot of it — `pierce-mag`
 * on Ars Dul'Mephistos, Gheed's Wager and Sling — and `pierce-fire` appears on
 * no Warlock item at all. So the better-supported element is the one the skills
 * do not help with, which is the reverse of what a reader expects.
 */
export const SKILL_PIERCE_ELEMENT = "fire";
export const GEAR_PIERCE_ELEMENT = "magic";

/** `UseAttackRate = 1`, and no other Chaos skill sets it. */
export const ATTACK_RATE_SKILLS = ["miasma-chain"] as const;

// ===========================================================================
// Vocabulary
// ===========================================================================

/** Published names, which is what prose uses. Note the punctuated six. */
export const WARLOCK_NAMES: Record<string, string> = {
  "summon-goatman": "Summon Goatman",
  "demonic-mastery": "Demonic Mastery",
  "death-mark": "Death Mark",
  "summon-tainted": "Summon Tainted",
  "summon-defiler": "Summon Defiler",
  "blood-oath": "Blood Oath",
  engorge: "Engorge",
  "blood-boil": "Blood Boil",
  consume: "Consume",
  "bind-demon": "Bind Demon",
  "levitation-mastery": "Levitation Mastery",
  cleave: "Cleave",
  "echoing-strike": "Echoing Strike",
  "blade-warp": "Blade Warp",
  "mirrored-blades": "Mirrored Blades",
  "hex-bane": "Hex: Bane",
  "hex-purge": "Hex: Purge",
  "hex-siphon": "Hex: Siphon",
  "psychic-ward": "Psychic Ward",
  "eldritch-blast": "Eldritch Blast",
  "miasma-bolt": "Miasma Bolt",
  "miasma-chain": "Miasma Chain",
  "sigil-lethargy": "Sigil: Lethargy",
  "sigil-rancor": "Sigil: Rancor",
  "sigil-death": "Sigil: Death",
  "ring-of-fire": "Ring of Fire",
  "flame-wave": "Flame Wave",
  "enhanced-entropy": "Enhanced Entropy",
  apocalypse: "Apocalypse",
  abyss: "Abyss",
};

/**
 * Sentence scoping. Bold opens most bullets on this site, so the lookbehind
 * allows the asterisks a full stop hides behind — "**Ten hard points.** The cap
 * is three" is two sentences and a rule that reads it as one will compare a
 * number in the first to a subject in the second.
 */
export const sentencesIn = (line: string): string[] =>
  line.split(/(?<=[.!?])\*{0,2}\s+|\n+/).filter((s) => s.trim().length > 0);

/** Both locales. `\b` fails before an accented letter, so those use `(?:^|\W)`. */
const ONLY_CLASS =
  /\b(?:no other class|only class|the one class)\b|(?:^|\W)(?:nenhuma outra classe|única classe)\b/i;
const TWO_HANDED = /\btwo[- ]hand(?:ed|er)\b|\bduas m[ãa]os\b/i;
const NAMES_THE_EXCEPTION = /\bBarbarian\b|\b1or2handed\b|\beighteen\b|\bdezoito\b|\bsword/i;

const RAISES =
  /\b(?:raises?|feeds?|is (?:a|the) synergy (?:of|for)|synergis\w+)\b|(?:^|\W)(?:sobe|alimenta|é (?:uma|a) sinergia)\b/i;

const PER_LEVEL_GROWTH =
  /\b(?:per level|with .{0,20}more per level|rises? with level|scales? with level|grows? with level)\b|(?:^|\W)(?:por n[íi]vel|sobe com o n[íi]vel|cresce com o n[íi]vel)\b/i;

// ===========================================================================
// Rule 1 — the DLC gate
// ===========================================================================

/**
 * A Warlock page that does not declare the expansion.
 *
 * Read from the build's own `release`, not from a list of slugs here: a build
 * added later would silently escape a list and cannot escape this.
 */
export function checkDlcGate(
  builds: readonly Build[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  for (const build of builds) {
    if (build.classSlug !== "warlock") continue;
    if (build.release === WARLOCK_RELEASE) continue;
    found.push({
      rule: "dlc-gate-missing",
      where,
      message:
        `${where}/${build.slug}: release is ${build.release ?? "unset"}, not "${WARLOCK_RELEASE}". ` +
        `The Warlock is paid DLC, so a page without the gate tells a base-game owner they can play it.`,
    });
  }
  return found;
}

/** Prose that says the opposite — that the class needs no purchase. */
export function checkBaseGameClaims(
  lines: readonly string[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  const CLAIM =
    /\b(?:base game|no (?:purchase|expansion|dlc)|without (?:the )?(?:dlc|expansion)|free to play)\b|(?:^|\W)(?:jogo[- ]base|sem (?:comprar|a expans[ãa]o|o dlc))\b/i;
  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      if (!CLAIM.test(sentence)) continue;
      /*
       * The corrected prose affirms the requirement, and the guard has to be
       * built out of that affirmation rather than out of the words it shares
       * with the error. "needs no expansion" contains "needs"; a guard looking
       * for `needs?` silences the exact sentence this rule exists to catch,
       * which is how the first version of it passed a planted mutation.
       */
      if (
        /\brequires?\b|\bpaid (?:purchase|expansion|dlc)\b|\bmust (?:buy|own)\b|\bis paid\b/i.test(sentence) ||
        /(?:^|\W)(?:exige|é pago|compra paga|precisa comprar)\b/i.test(sentence)
      )
        continue;
      found.push({
        rule: "base-game-availability-claimed",
        where,
        message: `${where}: "${sentence.slice(0, 130)}" reads as base-game availability. Reign of the Warlock is a paid purchase.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Rule 2 — the two-hander claim, worded rather than shouted
// ===========================================================================

/**
 * The exclusivity claim, unqualified.
 *
 * This is the defect the site actually shipped: "no other class in the game can
 * do this", on a page whose own best weapon is a Legend Sword — one of the
 * eighteen a Barbarian may hold in one hand. The rule does not forbid the
 * claim, because the claim is true in its general form. It requires the
 * sentence to name what the exception is.
 */
export function checkTwoHanderExclusivity(
  lines: readonly string[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  for (const line of lines) {
    /*
     * The claim is detected per sentence and the exception is looked for across
     * the whole authored string, because a page that states the rule and then
     * qualifies it in the next breath is the corrected prose — "this is the one
     * class that keeps its off-hand. The Barbarian's exception covers eighteen
     * swords and no staff" is two sentences and one correct paragraph.
     */
    const qualified = NAMES_THE_EXCEPTION.test(line);
    for (const sentence of sentencesIn(line)) {
      if (!ONLY_CLASS.test(sentence)) continue;
      if (!TWO_HANDED.test(sentence)) continue;
      if (qualified) continue;
      found.push({
        rule: "two-hander-exclusivity-overstated",
        where,
        message:
          `${where}: "${sentence.slice(0, 130)}" claims the pairing is unique to this class without naming ` +
          `the exception. ${ONE_HANDABLE_TWO_HANDERS} two-handed ${ONE_HANDABLE_TYPE} rows carry \`1or2handed\`, ` +
          `and a Barbarian holds any of them one-handed. The Warlock's rule is broader — any two-hander — and ` +
          `saying so is both true and more interesting than the superlative.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Rule 3 — two sockets, and what that forbids
// ===========================================================================

/**
 * A runeword recommended into a Grimoire that cannot physically go in one.
 *
 * The rune count is read from the runeword, not listed here, so a new
 * three-rune word aimed at the slot fails on the day it is written.
 */
export function checkGrimoireSockets(
  builds: readonly Build[],
  runesIn: (slug: string) => number | undefined,
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  const GRIMOIRE = /\bgrimoire\b/i;
  for (const build of builds) {
    if (build.classSlug !== "warlock") continue;
    for (const set of build.gearSets) {
      for (const slot of set.slots) {
        if (slot.slot !== "offhand") continue;
        const walk = (picks: readonly { ref?: { kind: string; slug: string }; why: string; label?: string; alternatives?: readonly unknown[] }[]) => {
          for (const pick of picks) {
            const namesAGrimoire = GRIMOIRE.test(`${pick.label ?? ""} ${pick.why}`);
            if (pick.ref?.kind === "runeword" && namesAGrimoire) {
              const runes = runesIn(pick.ref.slug);
              if (runes !== undefined && runes > GRIMOIRE_SOCKETS) {
                found.push({
                  rule: "grimoire-over-two-sockets",
                  where,
                  message:
                    `${where}/${build.slug} ${set.tier}: the off-hand recommends "${pick.ref.slug}", which is ` +
                    `${runes} runes, in a Grimoire. Every Grimoire base in the game has ${GRIMOIRE_SOCKETS} sockets, ` +
                    `so it cannot be made there — this is why Spirit and Ancients' Pledge are not options for this class.`,
                });
              }
            }
            walk((pick.alternatives ?? []) as never);
          }
        };
        walk(slot.picks as never);
      }
    }
  }
  return found;
}

// ===========================================================================
// Rule 4 — the demon cap
// ===========================================================================

/** A stated demon count the game does not produce, or one gear is said to raise. */
export function checkDemonCap(
  lines: readonly string[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  const WORDS: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    um: 1, dois: 2, tr: 3, quatro: 4, cinco: 5, seis: 6,
  };
  const COUNT = /\b(\d|one|two|three|four|five|six|um|dois|tr[êe]s|quatro|cinco|seis)\s+(?:summoned\s+|bound\s+)?demons?\b|\b(?:cap|teto)\s+(?:of|de)\s+(\d|one|two|three|four|five|six)\b/i;
  const GEAR_RAISES = /\+\s*skills?\b|\bfrom gear\b|(?:^|\W)de equipamento\b/i;
  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      if (!/\bdemons?\b|\bdem[ôo]ni/i.test(sentence)) continue;

      // (a) a count outside what petmax can produce
      const m = COUNT.exec(sentence);
      if (m) {
        const raw = (m[1] ?? m[2] ?? "").toLowerCase();
        const n = /^\d$/.test(raw) ? Number(raw) : WORDS[raw.slice(0, 2)] ?? WORDS[raw];
        if (n !== undefined && n > DEMON_CAP_MAX) {
          // Bind Demon's pet is a separate pool, so "four demons" is legal when the
          // sentence says so. That is rule 5's business, not this one's.
          if (!/\bbind demon\b|\bbound\b|\bvinculad/i.test(sentence)) {
            found.push({
              rule: "demon-cap-wrong",
              where,
              message:
                `${where}: "${sentence.slice(0, 130)}" states ${n} demons. \`petmax\` produces ` +
                `${DEMON_CAP_STEPS.map((s) => `${s.cap} at ${s.hardPoints}`).join(", ")} hard points of Demonic ` +
                `Mastery and stops at ${DEMON_CAP_MAX}; only Bind Demon's separate pool goes past it.`,
            });
          }
        }
      }

      // (b) the cap attributed to +skills
      if (GEAR_RAISES.test(sentence) && /\b(?:cap|maximum|teto|m[áa]ximo)\b/i.test(sentence)) {
        if (!/\bhard points?\b|\bdo not\b|\bnot\b|(?:^|\W)n[ãa]o\b/i.test(sentence)) {
          found.push({
            rule: "demon-cap-wrong",
            where,
            message:
              `${where}: "${sentence.slice(0, 130)}" has gear raising the demon cap. Both thresholds read ` +
              `\`blvl\` — hard points — so +skills move neither.`,
          });
        }
      }
    }
  }
  return found;
}

/** Bind Demon's pet counted against the three. */
export function checkBoundDemonCap(
  lines: readonly string[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      if (!/\bbind demon\b|\bbound demon\b|\bdem[ôo]nio vinculado\b/i.test(sentence)) continue;
      if (!/\bcounts? (?:against|toward)\b|\bshares? the (?:cap|pet type)\b|(?:^|\W)conta (?:no|contra o) teto\b|(?:^|\W)divide o teto\b/i.test(sentence)) continue;
      /*
       * The negation has to sit on the sharing verb, not anywhere in the
       * sentence. "Bind Demon shares the cap, so a fourth demon is not
       * possible" is the error and contains "not" — a loose guard reads that
       * as the correction and lets the error through.
       */
      if (
        /\bdoes not (?:count|share)\b|\bdo not (?:count|share)\b|\bnot share\b|\bseparate pool\b|\bdifferent (?:pool|pet type)\b/i.test(sentence) ||
        /(?:^|\W)n[ãa]o (?:conta|divide)\b|(?:^|\W)(?:pool|reserva) separad/i.test(sentence)
      )
        continue;
      found.push({
        rule: "bound-demon-inside-the-cap",
        where,
        message:
          `${where}: "${sentence.slice(0, 130)}" puts the bound demon inside the summon cap. Its \`pettype\` is ` +
          `\`binddemon\` with \`petmax = ${BOUND_DEMON_CAP}\`, a different pool from the three summons — which is ` +
          `most of the reason to spend twenty points on the skill.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Rule 5 — a synergy the graph does not draw
// ===========================================================================

/**
 * "X raises Y" between two Warlock skills, where the graph has no edge.
 *
 * The graph is the authority and this rule reads it rather than a list. The
 * three hexes and three sigils are where this goes wrong in practice, because
 * they look like a family and only some of the pairs are wired: Sigil: Death
 * feeds Hex: Purge's explosion chance and nothing else in either group feeds
 * anything in the other.
 */
export function checkSynergyClaims(
  lines: readonly string[],
  graph: Record<string, Pick<SkillGraphNode, "classSlug" | "synergies">>,
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  const warlock = Object.entries(graph).filter(([, n]) => n.classSlug === "warlock");
  const sourcesOf = (slug: string) =>
    new Set((graph[slug]?.synergies ?? []).map((s) => s.from));
  // Longest names first so "Hex: Purge" is not matched as "Hex".
  const named = warlock
    .map(([slug]) => ({ slug, name: WARLOCK_NAMES[slug] }))
    .filter((x) => x.name)
    .sort((a, b) => b.name.length - a.name.length);

  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      if (!RAISES.test(sentence)) continue;
      /*
       * A sentence that *denies* the relationship is the corrected prose, and
       * it necessarily contains the same verb the claim does — "neither feeds
       * the other" is the fix for "X feeds Y". Without this the rule refuses
       * both the error and its correction, which is the shape an author
       * deletes rather than satisfies.
       */
      if (
        /\bneither\b|\bdoes not (?:feed|raise)\b|\bdo not (?:feed|raise)\b|\bno (?:edge|synergy)\b|\bnot a synergy\b/i.test(sentence) ||
        /(?:^|\W)(?:nenhum[ao] (?:dos|das) dois|nenhuma das duas|n[ãa]o (?:alimenta|sobe)|n[ãa]o é (?:uma )?sinergia)\b/i.test(sentence)
      )
        continue;
      /*
       * The claim is positional: source, verb, receiver, in that order.
       *
       * A set-membership test was the first version of this and it was wrong in
       * the one direction that matters — it fired on correct prose. Three of the
       * four builds carry a sentence of the shape "Blade Warp and Hex: Purge
       * each raise **it** by 50% per level", where the receiver is a pronoun
       * standing for the skill whose own entry this is. Every name in that
       * sentence is a *source*, none of them feeds another, and a rule reading
       * the set finds no edge and rejects a true sentence.
       *
       * So the receiver has to be named after the verb, or there is no claim
       * here to check. That also disposes of "Consume, Hex: Purge and Mirrored
       * Blades" lists, where the verb comes first and the names follow.
       */
      const verb = RAISES.exec(sentence);
      if (!verb) continue;
      const at = verb.index;
      const positions = named
        .map((x) => {
          const m = new RegExp(x.name.replace(/:/g, "[: ]?"), "i").exec(sentence);
          return m ? { ...x, index: m.index } : undefined;
        })
        .filter((x): x is { slug: string; name: string; index: number } => x !== undefined);
      const source = positions.filter((p) => p.index < at).sort((a, b) => b.index - a.index)[0];
      const receiver = positions.filter((p) => p.index > at).sort((a, b) => a.index - b.index)[0];
      if (!source || !receiver || source.slug === receiver.slug) continue;
      if (sourcesOf(receiver.slug).has(source.slug)) continue;
      found.push({
        rule: "synergy-claimed-with-no-edge",
        where,
        message:
          `${where}: "${sentence.slice(0, 130)}" has ${source.name} raising ${receiver.name}, and the graph ` +
          `draws no edge between them. A relationship the game does not encode as a synergy is prose, not a ` +
          `synergy, and writing it as one tells a reader to spend hard points that collect nothing.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Rule 6 — the flat execute
// ===========================================================================

export function checkSigilDeathScaling(
  lines: readonly string[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      /*
       * The skill is often not named in its own bullet — "a monster inside the
       * sigil that falls below 13% of its life" is Sigil: Death's own mechanics
       * entry, and a rule keyed on the name misses exactly the page most likely
       * to get this wrong. So the trigger is the *effect*: an execution
       * threshold expressed as a share of life. Nothing else in this class has
       * one, which is what makes the looser trigger safe here.
       */
      const namesTheSkill = /sigil[: ]?\s*death/i.test(sentence);
      const executeWord =
        /\b(?:threshold|execut\w+|dies outright|limiar|execu[çc]\w+|morre na hora)\b/i.test(sentence);
      const lifeShare = /\d{1,2}\s*%[^.]{0,40}\b(?:life|vida)\b/i.test(sentence);
      /*
       * The execution language is required in every case. Naming the skill is
       * not enough on its own: Hex: Purge’s own bullet says “Sigil: Death raises
       * that by 1% per level” about the explosion chance — a true sentence with
       * the skill name and a per-level growth in it, which a rule keyed on
       * name-plus-growth rejects.
       */
      if (!executeWord) continue;
      if (!namesTheSkill && !lifeShare) continue;
      if (!PER_LEVEL_GROWTH.test(sentence)) continue;
      // The corrected sentence says the opposite, and says it with these words.
      if (/\bflat\b|\bdoes not (?:rise|grow|scale)\b|\bneither .{0,30}rises\b|(?:^|\W)fixos?\b|(?:^|\W)n[ãa]o sobe\b/i.test(sentence)) continue;
      found.push({
        rule: "sigil-death-threshold-scales",
        where,
        message:
          `${where}: "${sentence.slice(0, 130)}" has Sigil: Death's threshold rising with level. ` +
          `Both per-level parameters are zero — ${SIGIL_DEATH_THRESHOLDS.normal}% for a normal monster and ` +
          `${SIGIL_DEATH_THRESHOLDS.champion}% for a champion, at every level — which is why one hard point is ` +
          `the whole skill and points buy radius instead.`,
      });
    }
  }
  return found;
}

// ===========================================================================
// Rule 7 — the pierce inversion
// ===========================================================================

/**
 * The class's only *skill* pierce is fire and its *gear* pierce is magic.
 *
 * Both halves are counter-intuitive on their own and the pair is the single
 * most reversible fact about the class, so the rule fires on either direction.
 */
export function checkPierceElement(
  lines: readonly string[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  const PIERCE = /\bpierce\b|\benemy (?:fire|magic) resistance\b|(?:^|\W)quebra de resist|resist[êe]ncia (?:m[áa]gica|a fogo) do inimigo/i;
  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      if (!PIERCE.test(sentence)) continue;

      /*
       * Anchored on the carriers rather than on the words "skill" and "gear".
       *
       * The first version tested for `\bskills?\b`, which every "+2 to Warlock
       * skills" in a gear reason satisfies — so it rejected three correct
       * sentences on the Abyss and Cleave pages, all of them describing the
       * magic pierce accurately. The claim this rule is about is *which thing*
       * carries the pierce, so it reads the thing: Apocalypse is the only skill
       * that pierces anything, and these three items are the only ones that do.
       */
      const saysSkill =
        /\bapocalypse\b/i.test(sentence) ||
        /\bskill(?:'s)? pierce\b|\bpierce (?:in|from) (?:any|its|the) skill/i.test(sentence) ||
        /(?:^|\W)quebra (?:de resist\w+ )?(?:d[ao]s? )?skills?\b/i.test(sentence);
      const saysGear =
        /\bars dul|\bgheed|\bsling\b/i.test(sentence) ||
        /\bgear(?:'s)? pierce\b|\bpierce on (?:its|the|any) items?\b/i.test(sentence) ||
        /(?:^|\W)quebra (?:de resist\w+ )?(?:d[ao]s? )?(?:itens|equipamento)\b/i.test(sentence);

      if (saysSkill && !saysGear && /\bmagic\b|(?:^|\W)m[áa]gic/i.test(sentence) && !/\bfire\b|(?:^|\W)fogo\b/i.test(sentence)) {
        found.push({
          rule: "pierce-element-swapped",
          where,
          message:
            `${where}: "${sentence.slice(0, 130)}" gives the class a magic pierce in its skills. The only ` +
            `resistance reduction in any Warlock skill is Apocalypse's, and it is ${SKILL_PIERCE_ELEMENT}.`,
        });
        continue;
      }
      if (saysGear && !saysSkill && /\bfire\b|(?:^|\W)fogo\b/i.test(sentence) && !/\bmagic\b|(?:^|\W)m[áa]gic/i.test(sentence)) {
        found.push({
          rule: "pierce-element-swapped",
          where,
          message:
            `${where}: "${sentence.slice(0, 130)}" gives the class a fire pierce on its items. Every Warlock ` +
            `item that pierces a resistance pierces ${GEAR_PIERCE_ELEMENT}; \`pierce-fire\` appears on none of them.`,
        });
      }
    }
  }
  return found;
}

// ===========================================================================
// Rule 8 — the skill that is not on cast rate
// ===========================================================================

/**
 * A published Faster Cast Rate breakpoint attributed to Miasma Chain.
 *
 * The row sets `UseAttackRate = 1` and no other Chaos skill does. What that
 * means for a breakpoint is not established, and this site publishes no attack
 * speed table for any class — so the honest position is silence, and a
 * breakpoint row that names the skill is the failure.
 */
export function checkMiasmaChainCastRate(
  builds: readonly Build[],
  where: string,
): WarlockProblem[] {
  const found: WarlockProblem[] = [];
  for (const build of builds) {
    if (build.classSlug !== "warlock") continue;
    for (const target of build.breakpoints) {
      if (target.stat !== "fcr") continue;
      if (!/miasma\s*chain/i.test(target.why)) continue;
      // Saying it is *not* governed is the corrected prose.
      if (/\bnot\b|\battack rate\b|(?:^|\W)n[ãa]o\b/i.test(target.why)) continue;
      found.push({
        rule: "miasma-chain-cast-rate-breakpoint",
        where,
        message:
          `${where}/${build.slug}: an fcr breakpoint at ${target.value} is justified by Miasma Chain. ` +
          `That row sets \`UseAttackRate\`, so its animation follows the attack rate; what cast rate does for ` +
          `it is not established and no attack-speed table is published for any class on this site.`,
      });
    }
  }
  return found;
}

// ===========================================================================

/** Every rule, over one page's prose. */
export function checkWarlockProse(
  lines: readonly string[],
  graph: Record<string, Pick<SkillGraphNode, "classSlug" | "synergies">>,
  where: string,
): WarlockProblem[] {
  return [
    ...checkBaseGameClaims(lines, where),
    ...checkTwoHanderExclusivity(lines, where),
    ...checkDemonCap(lines, where),
    ...checkBoundDemonCap(lines, where),
    ...checkSynergyClaims(lines, graph, where),
    ...checkSigilDeathScaling(lines, where),
    ...checkPierceElement(lines, where),
  ];
}
