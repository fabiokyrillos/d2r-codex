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
// Animation modes, and which speed stat shortens each one
//
// Cycle 2 published "Faster Cast Rate is how fast you lay traps" and defended it
// with the claim that "there is no column in skills.txt that assigns an
// animation-speed source". There is. It is `anim`, and it is the column that
// decides which animation the character plays — which is what a speed stat
// shortens. `UseAttackRate`, the column cycle 1 reasoned from, does not decide
// whether an action can miss either — Zeal, Whirlwind, Fend, Charge and Leap
// Attack all leave it blank and all of them miss, and 263 of the 429 rows are
// blank. It marks the skills that call the standard attack-rate path; a blank
// row resolves its own hit check in its `srvdofunc`. The columns that do carry
// a skill's attack rating are `ToHit` and `LevToHit`, on 72 rows. So both
// cycles reasoned from a column that could not answer the question they asked.
//
// The Assassin has three animation families and they do not overlap:
//
//   SC  cast          Mind Blast, Cloak of Shadows, Fade, Burst of Speed,
//                     Venom, Psychic Hammer, Shadow Warrior, Shadow Master,
//                     Weapon Block, Claw Mastery, Blade Shield  -> Faster Cast Rate
//   S2  trap laying   every placeable trap, plus Fire Blast (`Fire Trauma`),
//                     Shock Web (`Shock Field`) and Blade Sentinel  -> attack speed
//   A1 / SQ->A1 / KK  the martial arts, Blade Fury and the kicks   -> attack speed
//
// Traps are in NEITHER the cast family nor the ordinary attack family. They are
// their own animation, and it is governed by weapon speed and Increased Attack
// Speed rather than by cast rate.
// ---------------------------------------------------------------------------

/** `anim = S2`. The trap-laying animation, shared by all eight. */
export const TRAP_LAYING_SKILLS = [
  "fire-blast",
  "shock-web",
  "charged-bolt-sentry",
  "wake-of-fire",
  "lightning-sentry",
  "wake-of-inferno",
  "death-sentry",
  "blade-sentinel",
] as const;

/** `anim = SC`. The cast animation, and the only Assassin family FCR shortens. */
export const CAST_ANIMATION_SKILLS = [
  "psychic-hammer",
  "mind-blast",
  "cloak-of-shadows",
  "fade",
  "burst-of-speed",
  "venom",
  "shadow-warrior",
  "shadow-master",
  "weapon-block",
  "claw-mastery",
  "blade-shield",
] as const;

/**
 * Which stat shortens which animation mode. The whole regression in one map.
 *
 * `SC` is the only mode Faster Cast Rate touches. Everything else on this class
 * — including `S2` — is on the attack-speed calculation, which takes the
 * weapon's base speed as an input and therefore cannot be tabulated as one
 * class-wide row of percentages.
 */
export const SPEED_STAT_BY_ANIM = {
  SC: "fcr",
  S2: "ias",
  A1: "ias",
  SQ: "ias",
  KK: "ias",
  TH: "ias",
} as const;

/**
 * AnimData, extracted from d2common.dll — RTB's table, published at
 * mannm.org/d2library/faqtoids/animspeed.html under the `CCAAWWW` naming
 * convention (class, animation, weapon class).
 *
 * Validated before use: `AISC*` = 17 frames at animation speed 256 reproduces
 * exactly the Assassin "Casting Base 17 / Animation Speed 256" that Maxroll and
 * the Diablo Wiki publish independently, and feeding it through `castFrames`
 * below regenerates the whole published `fcr-assassin` table. A source that
 * reproduces the known row can be trusted for the unknown one.
 */
export const ASSASSIN_CAST_ANIM = { length: 17, speed: 256 } as const;
/** `AIS2*`, identical for every weapon class: 8 frames at animation speed 128. */
export const ASSASSIN_TRAP_ANIM = { length: 8, speed: 128 } as const;

/** `Quickness` Param3/Param4, "Attack Speed % Min/Max". Burst of Speed is IAS. */
export const BURST_OF_SPEED_IAS = { min: 15, max: 60 } as const;

/** Diminishing returns, shared by cast rate and attack speed. Hard-capped at 75. */
export const effectiveSpeed = (percent: number): number =>
  Math.min(75, Math.floor((percent * 120) / (percent + 120)));

/** Frames for the `SC` animation at a given Faster Cast Rate. */
export const castFrames = (fcr: number): number => {
  const { length, speed } = ASSASSIN_CAST_ANIM;
  return Math.ceil((256 * length) / Math.floor((speed * (100 + effectiveSpeed(fcr))) / 100) - 1);
};

/**
 * Frames for the `S2` animation — trap laying — on the attack-speed calculation.
 *
 * `wsm` is the weapon speed modifier: the claw's own base speed, and when two
 * claws are held, the average of both. `sias` is skill attack speed (Burst of
 * Speed), which is added undiminished; `ias` is the item bonus, which is not.
 * Increased Attack Speed on the off-hand claw does not count at all.
 *
 * The `wsm` argument is why this build page publishes scenarios instead of a
 * table: the same 9 frames costs 42% IAS on two Runic Talons and 174% on two
 * Hatchet Hands.
 */
export const trapLayingFrames = ({
  ias = 0,
  wsm = 0,
  sias = 0,
}: { ias?: number; wsm?: number; sias?: number }): number => {
  const { length, speed } = ASSASSIN_TRAP_ANIM;
  const rate = Math.floor((speed * (100 + sias + effectiveSpeed(ias) - wsm)) / 100);
  return Math.ceil((256 * length) / rate) - 1;
};

/**
 * Independent data, transcribed to be confronted rather than matched.
 *
 * AsgardPvP publishes "IAS needed for 9-frame trap laying speed" as a matrix
 * indexed by both claws' base weapon speed — the whole table, not a number.
 * `trapLayingFrames` above was derived from the animdata and the attack-speed
 * formula with no sight of these figures, and reproduces all fifteen cells.
 *
 * That is the control that separates the two hypotheses. If cast rate governed
 * trap laying, reaching 9 frames would cost one weapon-independent number. It
 * takes five different values on the diagonal alone.
 */
export const TRAP_NINE_FRAME_IAS: { claws: [number, number]; ias: number }[] = [
  { claws: [10, 10], ias: 174 },
  { claws: [10, 0], ias: 147 },
  { claws: [10, -10], ias: 125 },
  { claws: [10, -20], ias: 105 },
  { claws: [10, -30], ias: 89 },
  { claws: [0, 0], ias: 125 },
  { claws: [0, -10], ias: 105 },
  { claws: [0, -20], ias: 89 },
  { claws: [0, -30], ias: 75 },
  { claws: [-10, -10], ias: 89 },
  { claws: [-10, -20], ias: 75 },
  { claws: [-10, -30], ias: 63 },
  { claws: [-20, -20], ias: 63 },
  { claws: [-20, -30], ias: 52 },
  { claws: [-30, -30], ias: 42 },
];

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
  "trap-laying-on-cast-rate",
  "cast-action-on-attack-speed",
  "universal-trap-ias-number",
  "firing-interval-as-laying-speed",
  "cast-rate-for-sentry-output",
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

/**
 * Fade and Burst of Speed presented as simultaneous.
 *
 * Two branches rather than one alternation on each side. Written as
 * `(Fade|Burst of Speed) … (Burst of Speed|Fade)` the pattern also matches
 * "Fade … Fade", so it fires on any sentence naming one buff twice — and a
 * Treachery line reading "a 5% chance to cast level 15 Fade when struck, which
 * is Fade you did not have to press" is correct and has nothing to do with the
 * pairing. The rule has to see two *different* names.
 */
const BOTH_BUFFS_UP =
  /\bFade\b[^.]{0,80}\bBurst of Speed\b|\bBurst of Speed\b[^.]{0,80}\bFade\b/i;
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

/**
 * Laying, setting, dropping, placing a trap — the action, in both languages.
 *
 * The two halves have to cover the same ground. An earlier draft matched the
 * bare Portuguese "velocidade de colocação" but required the word *trap* on the
 * English side, so the identical claim was caught in one locale and waved
 * through in the other — which is the EN/PT divergence this file exists to
 * prevent, committed by the file itself. `laying speed` and `trap-setting` are
 * here to close it.
 */
const LAYING_A_TRAP =
  /\b(lay(?:ing|s)?|set(?:ting)?|drop(?:ping|s)?|plac(?:e|ing|es)?|deploy(?:ing|s)?)\b[^.]{0,40}\b(traps?|sentr(?:y|ies)|fields?)\b|\btrap[- ]laying\b|\blaying speed\b|\btrap[- ]setting\b|\b(traps?|sentr(?:y|ies))\b[^.]{0,30}\b(lay(?:ing|s)?|set(?:ting)?|deploy(?:ed|ing)?)\b|\b(colocar|colocando|coloca|montar|montando|posicionar)\b[^.]{0,40}\b(traps?|armadilhas?|sentinelas?|campo)\b|\bvelocidade de coloca[çc][ãa]o\b/i;

/** Cast rate named as a speed. `\b` is useless before an accent, hence `(?:^|\s)`. */
const CAST_RATE =
  /\bfaster cast rate\b|\bcast(?:ing)? (?:rate|speed)\b|\bFCR\b|\bvelocidade de conjura[çc][ãa]o\b|\btaxa de conjura[çc][ãa]o\b|(?:^|\s)conjura[çc][ãa]o\b/i;

/** Attack speed named as a speed. */
const ATTACK_SPEED =
  /\bincreased attack speed\b|\battack speed\b|\bIAS\b|\bweapon speed\b|\bvelocidade de ataque\b|\bvelocidade da arma\b/i;

/** The actions the cast animation really does govern. */
const CAST_ACTION = "(?:Mind ?Blast|Cloak of Shadows|Teleport|Psychic Hammer|Shadow (?:Master|Warrior))";
const SPEED_TERM = "(?:increased attack speed|attack speed|IAS|weapon speed|velocidade de ataque)";
/** A verb that hands one to the other, which co-occurrence alone does not. */
const ATTRIBUTION = "(?:is|are|runs? on|uses?|scales? with|governed by|comes? from|at|from|com|usa|roda)";

/**
 * Attack speed *attributed to* a cast action, in either direction.
 *
 * Naming both is not the error. The Enchant Sorceress page reads "Increased
 * Attack Speed matters, and Faster Cast Rate only matters for Teleport" — two
 * speed terms and a cast action in one correct sentence, which an earlier
 * co-occurrence draft of this rule flagged.
 */
const ATTRIBUTES_ATTACK_SPEED_TO_A_CAST = new RegExp(
  `${CAST_ACTION}[^.]{0,40}\\b${ATTRIBUTION}\\b[^.]{0,25}${SPEED_TERM}` +
    `|${SPEED_TERM}[^.]{0,30}\\b(?:governs?|shortens?|speeds? up|makes?|lets? you)\\b[^.]{0,30}${CAST_ACTION}` +
    `|\\bstack ${SPEED_TERM}[^.]{0,40}${CAST_ACTION}`,
  "i",
);

/**
 * "not just", "not only", "não só" — a widener wearing a negation's clothes.
 *
 * Stripped before the denial test below looks, because this is the exact
 * phrasing the wrong sentence used: "Faster Cast Rate is how fast you lay
 * traps, **not just** how fast you cast Mind Blast". A plain negation test
 * reads that as a denial and falls silent on the one sentence the rule exists
 * for. A planted mutation caught it.
 *
 * The Portuguese branch closes on a lookahead rather than a word boundary:
 * JavaScript defines \b against [A-Za-z0-9_], so "ó" is not a word character
 * and s[óo]\b never matches after "não só". Same accent trap already
 * documented on CALLED_A_FINISHER above, and it silenced the pt-BR half of
 * this rule until a second mutation caught that too.
 */
const INTENSIFIED_NOT =
  /\bnot\s+(?:just|only|merely|simply|solely)\b|(?:^|\s)n[ãa]o\s+(?:s[óo]|apenas|somente|meramente)(?![A-Za-zÀ-ÿ])/gi;

const DISTINCTION =
  /\b(not|never|rather than|instead of|unlike|no longer|does not|doesn't|does nothing|no effect|nothing to do with)\b|(?:^|\s)(n[ãa]o|em vez de|ao inv[ée]s de|diferente de|nada a ver com|nenhum efeito)\b/i;

/**
 * A sentence saying the two are different, which is the correcting sentence.
 *
 * "not just", "not only", "não só" are wideners wearing a negation's clothes, and
 * they are stripped before looking. This is not hypothetical: the sentence this
 * rule exists to catch was "Faster Cast Rate is how fast you lay traps, **not
 * just** how fast you cast Mind Blast", and a plain negation test reads that as
 * a denial and falls silent on the one sentence that matters. A planted mutation
 * caught it.
 */
const DRAWS_THE_DISTINCTION = (text: string): boolean =>
  DISTINCTION.test(text.replace(INTENSIFIED_NOT, " "));

/** A bare percentage offered as the trap-laying target. */
const A_PERCENTAGE = /\b\d{1,3}\s*%/;

/** Naming the thing the number actually depends on rescues the sentence. */
const NAMES_THE_WEAPON =
  /\bclaws?\b|\bweapon(?:'s)? (?:own )?(?:base )?speed\b|\bbase speed\b|\bwsm\b|\bRunic Talons\b|\bGreater Talons\b|\bHatchet Hands\b|\bSuwayyah\b|\bgarras?\b|\bvelocidade base\b|\bda arma\b/i;

/** The sentry firing on its own, which is a fixed interval no stat touches. */
const SENTRY_FIRES =
  /\b(fir(?:e|es|ing)|shoot(?:s|ing)?|shots?|volley|interval|rate of fire)\b|\b(dispara|disparo|disparos|intervalo|cadência)\b/i;

/** Sentry damage or output, as distinct from how fast you put one down. */
const SENTRY_OUTPUT =
  /\b(damage|dps|output|harder|stronger)\b|\b(dano|sa[íi]da|mais forte)\b/i;

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

      /*
       * The regression this file was extended for. Trap laying plays `anim = S2`
       * and `S2` is on the attack-speed calculation; the cast animation the
       * Assassin's Faster Cast Rate table describes is `SC`, a different
       * animation of a different length. A sentence putting trap laying on cast
       * rate is wrong twice over — wrong stat, and wrong table even if the stat
       * were right, because `SC` is 17 frames at speed 256 and `S2` is 8 at 128.
       */
      const aboutLaying = LAYING_A_TRAP.test(sentence);
      if (aboutLaying && CAST_RATE.test(sentence) && !DRAWS_THE_DISTINCTION(sentence)) {
        add(
          "trap-laying-on-cast-rate",
          sentence,
          `laying a trap plays \`anim = ${"S2"}\`, which is on the attack-speed calculation. ` +
            `Faster Cast Rate shortens \`SC\` — Mind Blast, Cloak of Shadows, Fade — and the ` +
            `two animations are not even the same length`,
        );
      }

      /*
       * The same error pointed the other way: Mind Blast is a cast, not a swing.
       *
       * Co-occurrence is not the claim, and an earlier draft of this rule proved
       * it by firing on the Enchant Sorceress, whose page correctly says
       * "Increased Attack Speed matters, and Faster Cast Rate only matters for
       * Teleport". Both terms, one sentence, nothing wrong with it. So the
       * pattern has to see the attack-speed term *attributed* to the cast
       * action, in one direction or the other.
       */
      if (
        ATTRIBUTES_ATTACK_SPEED_TO_A_CAST.test(sentence) &&
        !aboutLaying &&
        !DRAWS_THE_DISTINCTION(sentence)
      ) {
        add(
          "cast-action-on-attack-speed",
          sentence,
          "Mind Blast, Cloak of Shadows, Psychic Hammer, the shadows and Teleport all play " +
            "`anim = SC`, which Faster Cast Rate shortens and Increased Attack Speed does not",
        );
      }

      /*
       * A trap-laying target stated as one percentage, with nothing said about
       * the claw. The number is real but it is only true of one weapon: 9 frames
       * costs 42% on two Runic Talons and 174% on two Hatchet Hands.
       */
      if (
        aboutLaying &&
        ATTACK_SPEED.test(sentence) &&
        A_PERCENTAGE.test(sentence) &&
        !NAMES_THE_WEAPON.test(sentence)
      ) {
        add(
          "universal-trap-ias-number",
          sentence,
          "an Increased Attack Speed target for trap laying is only true of a stated claw — " +
            "the weapon's base speed is an input to the same formula, so a bare percentage " +
            "is wrong for most setups",
        );
      }

      /*
       * How fast you put a sentry down and how fast it then fires are two
       * different clocks. The second is fixed; no speed stat on the character
       * touches it.
       */
      /*
       * A speed stat has to be in the sentence. "Charged Bolt Sentry is a trap
       * that fires by itself while you are laying Lightning Sentries" names both
       * clocks and confuses neither, and the levelling page needs to say it.
       */
      /*
       * The denial is looked for in the sentence, not the line. Scoping it to
       * the line meant any paragraph containing the word "not" anywhere became
       * immune — which an adversarial pass proved by planting "more Increased
       * Attack Speed also lets the traps you lay fire their shots faster" into
       * a note whose first clause happened to say "not a sentry", and watching
       * the rule stay silent.
       */
      if (
        aboutLaying &&
        SENTRY_FIRES.test(sentence) &&
        (CAST_RATE.test(sentence) || ATTACK_SPEED.test(sentence)) &&
        !DRAWS_THE_DISTINCTION(sentence)
      ) {
        add(
          "firing-interval-as-laying-speed",
          sentence,
          "how fast a sentry fires once it is down is fixed and is not the speed at which " +
            "you lay it; treating the two as one clock tells the reader to buy speed for " +
            "something no stat changes",
        );
      }

      /* Cast rate sold as sentry damage or rate of fire. It is neither. */
      if (
        CAST_RATE.test(sentence) &&
        (SENTRY_FIRES.test(sentence) || SENTRY_OUTPUT.test(sentence)) &&
        /\bsentr(?:y|ies)\b|\bsentinelas?\b|\btraps?\b|\barmadilhas?\b/i.test(sentence) &&
        !DRAWS_THE_DISTINCTION(sentence)
      ) {
        add(
          "cast-rate-for-sentry-output",
          sentence,
          "Faster Cast Rate does not raise a sentry's damage and does not shorten the " +
            "interval between its shots; it shortens the `SC` animation and nothing else",
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
