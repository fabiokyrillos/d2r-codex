/**
 * The Assassin's own rules, as pure functions.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Every other gate in this repository checks that a number matches the graph.
 * The Assassin's characteristic failure is not a wrong number — it is a right
 * number described by a sentence carried over from another class. A page that
 * says Dragon Talon "scales with your claws" has every figure on it correct and
 * is telling the reader to buy the wrong item. A page that calls Phoenix Strike
 * a finisher is describing a skill that exists, in a role it does not have.
 *
 * So this file holds two things: the structural flags the game's own columns
 * carry, transcribed with provenance, and the prose rules that catch a sentence
 * contradicting them.
 *
 * PROVENANCE
 *   Repository  blizzhackers/d2data
 *   Commit      fc469993502d0498809b9fc1af140ee2a9eb8902
 *               2026-08-21 — "Updated for patch 3.3.93847"
 *   Path        json/skills.json, rows with `charclass = "ass"`
 *   Baseline    D2R Patch 3.3 / Ladder Season 15 extraction
 *   Verified    2026-09-05
 *
 * The same pinned commit the skill graph is generated from, so the two cannot
 * describe different versions of the game. Transcribed rather than fetched:
 * `npm run check` must not need the network. Only mechanical flags are taken —
 * no game prose. See docs/sources/README.md.
 */

/**
 * `progressive = 1`. These build charges and never spend them.
 *
 * The whole martial arts tree is misread by anyone who assumes the skill with
 * the biggest number is the one you press last. Tiger Strike's 100% + 20% per
 * level is a multiplier *on the finisher*; pressing Tiger Strike is a normal
 * weapon swing that happens to store a charge.
 */
export const CHARGE_UPS = [
  "tiger-strike",
  "fists-of-fire",
  "cobra-strike",
  "claws-of-thunder",
  "blades-of-ice",
  "phoenix-strike",
] as const;

/** `finishing = 1` with `prgchargesconsumed = 1`. These spend charges and build none. */
export const FINISHERS = ["dragon-talon", "dragon-claw", "dragon-tail", "dragon-flight"] as const;

/**
 * `Kick = 1` and no `SrcDam` column at all — the damage is the boots'.
 *
 * Dragon Claw is deliberately absent. It sits in the same tree, in the same row
 * as Dragon Talon, is a finisher like the other three, and carries
 * `SrcDam = 128` with no `Kick`: it is a weapon attack. The pair is the reason
 * this list is transcribed rather than inferred from "is it a finisher".
 */
export const KICKS = ["dragon-talon", "dragon-tail", "dragon-flight"] as const;

/**
 * `SrcDam = 96` out of the engine's 128, so three quarters of the weapon.
 *
 * The only skills on the class that scale off a normal weapon rather than a
 * claw, and the fraction is the reason the build holds one.
 */
export const BLADE_SKILLS = ["blade-sentinel", "blade-fury", "blade-shield"] as const;
export const BLADE_WEAPON_NUMERATOR = 96;
export const BLADE_WEAPON_DENOMINATOR = 128;
/** 0.75. Derived, so a changed numerator moves every sentence that quotes it. */
export const BLADE_WEAPON_SHARE = BLADE_WEAPON_NUMERATOR / BLADE_WEAPON_DENOMINATOR;

/** `pettype = assassintrap`, `petmax = 5` on every sentry. A total, not a per-skill cap. */
export const TRAP_SLUGS = [
  "blade-sentinel",
  "charged-bolt-sentry",
  "wake-of-fire",
  "lightning-sentry",
  "wake-of-inferno",
  "death-sentry",
] as const;
export const TRAP_LIMIT = 5;

/** `pettype = shadowwarrior`, `petmax = 1`. The two shadows replace each other. */
export const SHADOW_SLUGS = ["shadow-warrior", "shadow-master"] as const;
export const SHADOW_LIMIT = 1;

/**
 * `auralencalc = par3 = 375` on every charge-up. Fifteen seconds at 25fps.
 *
 * Worth pinning because published guides disagree with each other about it —
 * the same site states 14 seconds on one page and 15 on another. The column is
 * the same 375 on all six rows.
 */
export const CHARGE_DURATION_FRAMES = 375;
export const FRAMES_PER_SECOND = 25;

/**
 * Venom's `ELen`, under `aurastat3 = skill_poison_override_length`.
 *
 * Ten frames. Every other poison on the site runs for seconds; this one packs
 * the whole amount into four tenths of one, and *overrides* rather than adds, so
 * it does not stack with another poison source.
 */
export const VENOM_POISON_FRAMES = 10;

// ---------------------------------------------------------------------------
// Prose rules
// ---------------------------------------------------------------------------

export const ASSASSIN_RULES = [
  "charge-up-called-finisher",
  "kick-scales-with-weapon",
  "blade-takes-whole-weapon",
  "weapon-block-needs-a-shield",
  "fade-and-burst-together",
  "venom-as-ordinary-poison",
  "trap-limit-not-five",
] as const;
export type AssassinRule = (typeof ASSASSIN_RULES)[number];

export interface AssassinProblem {
  rule: AssassinRule;
  where: string;
  message: string;
}

/** Display names, so a rule can look for the skill a sentence is about. */
const NAME: Record<string, string> = {
  "tiger-strike": "Tiger Strike",
  "fists-of-fire": "Fists of Fire",
  "cobra-strike": "Cobra Strike",
  "claws-of-thunder": "Claws of Thunder",
  "blades-of-ice": "Blades of Ice",
  "phoenix-strike": "Phoenix Strike",
  "dragon-talon": "Dragon Talon",
  "dragon-tail": "Dragon Tail",
  "dragon-flight": "Dragon Flight",
  "dragon-claw": "Dragon Claw",
  "blade-sentinel": "Blade Sentinel",
  "blade-fury": "Blade Fury",
  "blade-shield": "Blade Shield",
};

/**
 * Sentence scoping, for the reason `freeze-length-claims.ts` needed it: these
 * strings are paragraphs, and two clauses five sentences apart are not a claim
 * about each other.
 */
const sentencesIn = (line: string): string[] =>
  // `\*{0,2}` because these bullets open with bold: "**A finisher.** It spends
  // standing charges" is two sentences, and splitting only on `.\s` makes it one
  // — which put a finisher's claim and a charge-up's name in the same scope.
  line.split(/(?<=[.!?])\*{0,2}\s+|\n+/).filter((s) => s.trim().length > 0);

const mentions = (sentence: string, slug: string) =>
  new RegExp(`\\b${NAME[slug]}\\b`, "i").test(sentence);

/**
 * "is a finisher", "é um finalizador", "finishing move", "golpe finalizador".
 *
 * The Portuguese alternative opens with `(?:^|\s)` rather than `\b`. JavaScript's
 * `\b` is defined against `[A-Za-z0-9_]`, so `é` is not a word character and
 * `\bé` never matches after a space — which silently disabled the pt-BR half of
 * this rule until a planted mutation caught it. Worth remembering for every
 * other accented pattern in this file.
 */
const CALLED_A_FINISHER =
  /\b(is|as)\s+(a|the)\s+finisher\b|\bfinishing move\b|(?:^|\s)(é|como)\s+(um|o)\s+finalizador\b|\bgolpe finalizador\b/i;

/** A charge-up described as the thing that spends charges. */
const SPENDS_CHARGES =
  /\b(spends?|consumes?|releases?|unleash(?:es)?)\s+(?:the\s+|its\s+|whatever\s+|standing\s+)?charges\b|\b(gasta|consome|libera)\s+(?:as\s+)?cargas\b/i;

/** Crediting the weapon or claws for a kick's damage. */
const CREDITS_THE_WEAPON =
  /\b(?:your\s+)?(weapon|claws?)\b[^.]{0,70}\b(damage|scal\w+|power)\b|\b(scal\w+|damage)\b[^.]{0,40}\b(?:your\s+)?(weapon|claws?)\b|\b(arma|garras?)\b[^.]{0,70}\b(dano|escala)\b|\b(dano|escala)\b[^.]{0,40}\b(?:da\s+|das\s+)?(arma|garras?)\b/i;

/** An explicit statement that the boots are what matter — the correct sentence. */
const CREDITS_THE_BOOTS = /\bboots?\b|\bbotas?\b/i;

/** "unlike Dragon Talon", "diferente de Dragon Talon" — the claim is about something else. */
const CONTRASTED = /\b(unlike|except|other than)\b|(?:^|\s)(diferente de|ao contr[áa]rio de|exceto)\b/i;

/** A blade skill credited with the whole weapon rather than three quarters. */
const WHOLE_WEAPON =
  /\b(full|whole|all|entire)\s+(?:of\s+)?(?:your\s+|the\s+)?weapon(?:'s)?\s+damage\b|\bweapon(?:'s)?\s+(?:full|whole|entire)\s+damage\b|\bdano\s+(?:cheio|inteiro|total)\s+da\s+arma\b|\bo\s+dano\s+da\s+arma\s+(?:inteiro|todo)\b/i;

/** Weapon Block described as needing, or being, shield block. */
const NEEDS_A_SHIELD =
  /\b(shield block|blocks? (?:only )?with a shield|requires? a shield|needs? a shield)\b|\bbloqueio de escudo\b|\b(exige|precisa de) um escudo\b/i;
/** The correcting clause: a sentence that says it is *not* shield block stays silent. */
const DENIES_THE_SHIELD =
  /\b(not|without|no)\b[^.]{0,30}\bshield\b|\b(não|sem|nenhum)\b[^.]{0,30}\bescudo\b/i;

/** Fade and Burst of Speed presented as simultaneous. */
const BOTH_BUFFS_UP =
  /\b(Fade|Burst of Speed)\b[^.]{0,80}\b(Burst of Speed|Fade)\b/i;
const SAYS_EXCLUSIVE =
  /\b(mutually exclusive|cannot|can't|replaces?|drops? the other|instead of|either|not both|one or the other)\b|\b(mutuamente exclusiv|não pode|derruba o outro|substitui|em vez de|ou o)\w*/i;

/** Venom's poison described as running over seconds. */
const POISON_OVER_SECONDS =
  /\bover\s+(?:several\s+|a few\s+|\d+\s+)?seconds\b|\bdamage over time\b|\bticks?\s+(?:away|for|over)\b|\bao longo de (?:v[áa]rios )?segundos\b|\bdano ao longo do tempo\b/i;

/** A trap ceiling stated as some number other than five. */
const TRAP_COUNT =
  /\b(?:up to |maximum of |max(?:imum)? |at most |limit of |ceiling of |at[eé] |no m[áa]ximo |limite de )(\d+|one|two|three|four|six|seven|eight|um|dois|tr[eê]s|quatro|seis|sete|oito)\s+(?:traps?|sentr(?:y|ies)|sentinelas?|armadilhas?)\b/i;
const NUMBER_WORD: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  um: 1, dois: 2, "três": 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8,
};

export function checkAssassinClaims(lines: string[], where: string): AssassinProblem[] {
  const problems: AssassinProblem[] = [];
  const add = (rule: AssassinRule, sentence: string, why: string) =>
    problems.push({ rule, where, message: `${where}: ${why} — "${sentence.slice(0, 130)}"` });

  for (const line of lines) {
    for (const sentence of sentencesIn(line)) {
      /*
       * A sentence that names a finisher is about the finisher. Dragon Flight's
       * own page says "it spends standing charges, which makes it a way to
       * deliver a full Tiger Strike stack across the room" — correct, and it
       * names a charge-up beside the words "spends charges" for the ordinary
       * reason that the charge-up is where the charges came from.
       */
      const aboutAFinisher = FINISHERS.some((f) => mentions(sentence, f));

      for (const slug of CHARGE_UPS) {
        if (aboutAFinisher || !mentions(sentence, slug)) continue;
        /*
         * The charge-up has to be the *subject* of the claim rather than a noun
         * the claim mentions. Dragon Flight's page says "It spends standing
         * charges, which makes it a way to deliver a full Tiger Strike stack
         * across the room": the spending belongs to Dragon Flight, and Tiger
         * Strike is named because it is where the charges came from. Requiring
         * the name to precede the claim separates that from "Tiger Strike is the
         * finisher", which is the sentence this rule exists for.
         */
        const claim = CALLED_A_FINISHER.exec(sentence) ?? SPENDS_CHARGES.exec(sentence);
        const named = sentence.toLowerCase().indexOf(NAME[slug].toLowerCase());
        if (claim && named >= 0 && named < claim.index) {
          add(
            "charge-up-called-finisher",
            sentence,
            `${NAME[slug]} carries \`progressive = 1\`: it builds charges and spends none. ` +
              `Calling it a finisher describes a role it does not have`,
          );
        }
      }

      /*
       * Dragon Claw is the contrast every correct sentence about the kicks
       * draws: "unlike Dragon Talon, Tail and Flight, it scales with the claws
       * you are holding". The weapon credit in such a sentence belongs to Dragon
       * Claw, which is the one finisher it is true of.
       */
      const aboutDragonClaw = mentions(sentence, "dragon-claw");

      for (const slug of KICKS) {
        if (aboutDragonClaw || !mentions(sentence, slug)) continue;
        /*
         * A contrast marker *before* the kick's name means the weapon credit is
         * being drawn away from it. Dragon Claw's page reads "unlike Dragon
         * Talon, Tail and Flight it scales with the claws you are holding" —
         * the correct sentence, which has to name three kicks in order to say so.
         */
        const named = sentence.toLowerCase().indexOf(NAME[slug].toLowerCase());
        const contrast = CONTRASTED.exec(sentence);
        if (contrast && contrast.index < named) continue;
        if (CREDITS_THE_WEAPON.test(sentence) && !CREDITS_THE_BOOTS.test(sentence)) {
          add(
            "kick-scales-with-weapon",
            sentence,
            `${NAME[slug]} carries \`Kick = 1\` and no weapon-damage share. Its damage is the ` +
              `boots', so crediting the weapon or the claws sends the reader after the wrong item`,
          );
        }
      }

      for (const slug of BLADE_SKILLS) {
        if (!mentions(sentence, slug)) continue;
        if (WHOLE_WEAPON.test(sentence)) {
          add(
            "blade-takes-whole-weapon",
            sentence,
            `${NAME[slug]} carries \`SrcDam = ${BLADE_WEAPON_NUMERATOR}\` of ` +
              `${BLADE_WEAPON_DENOMINATOR}, which is three quarters of the weapon and not all of it`,
          );
        }
      }

      if (/\bWeapon Block\b/i.test(sentence) && NEEDS_A_SHIELD.test(sentence) && !DENIES_THE_SHIELD.test(sentence)) {
        add(
          "weapon-block-needs-a-shield",
          sentence,
          "Weapon Block is its own passive gated on holding claws and works with no shield " +
            "equipped; describing it as shield block is a different mechanic",
        );
      }

      // The exclusion may be stated in a neighbouring sentence — "Fade and Burst
      // of Speed are mutually exclusive. Fade is what a trapper runs; Burst of
      // Speed is what a kicker runs." — so the pairing is judged in the sentence
      // and the qualification looked for across the whole string.
      if (BOTH_BUFFS_UP.test(sentence) && !SAYS_EXCLUSIVE.test(line)) {
        add(
          "fade-and-burst-together",
          sentence,
          "Fade and Burst of Speed write the same kind of self-state and casting one drops " +
            "the other; a sentence naming both without saying so implies they stack",
        );
      }

      if (/\bVenom\b/.test(sentence) && POISON_OVER_SECONDS.test(sentence)) {
        add(
          "venom-as-ordinary-poison",
          sentence,
          `Venom overrides poison length to ${VENOM_POISON_FRAMES} frames — four tenths of a ` +
            `second — so describing it as damage over seconds is the one thing it is not`,
        );
      }

      const count = TRAP_COUNT.exec(sentence);
      if (count) {
        const stated = NUMBER_WORD[count[1].toLowerCase()] ?? Number(count[1]);
        if (Number.isFinite(stated) && stated !== TRAP_LIMIT) {
          add(
            "trap-limit-not-five",
            sentence,
            `every trap carries \`petmax = ${TRAP_LIMIT}\`, and the ceiling is shared across ` +
              `all of them; this states ${stated}`,
          );
        }
      }
    }
  }
  return problems;
}
