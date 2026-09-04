/**
 * Proof that the controls this audit added fire — the immunity model, and the
 * provenance rule that rides on the same sweep.
 *
 * `checkSourcedDivergence` lives in `content-rules.ts` because it is about any
 * claim on any page rather than about immunity, and it is exercised here
 * because it was written in the same pass and against the same two runeword
 * notes. Splitting it into a third test file would separate a rule from the
 * sentences that motivated it.
 *
 * Two kinds of check, and the second is the one that matters.
 *
 * **Derived arithmetic.** Lower Resist's reach is computed from the divisor
 * rather than typed, the same way `necromancer.test.ts` derives Amplify
 * Damage's 119% and Decrepify's 109%. If the band the site publishes ever moves,
 * these numbers move with it and the prose that quotes them fails elsewhere.
 *
 * **Planted mutations.** Every sentence below is the text this repository
 * actually shipped at b314b8f, in the locale it shipped in. A rule that cannot
 * reject the sentence it was written for would not have caught the mistake it
 * exists to catch — and this file's whole reason for being is that the previous
 * gate could not: `checkImmunityBreakClaims` keys on "does not break", and the
 * headline error never used that phrase. It said "nowhere near enough".
 *
 * The corrected replacements are asserted green in the same breath, because a
 * rule that rejects both the error and its fix is a rule the next author
 * deletes.
 *
 * Run with `npm run test:immunity`.
 */
import {
  AMPLIFY_DAMAGE,
  DECREPIFY,
  IMMUNITY_THRESHOLD,
  applyResistanceCurse,
  deepestBreakable,
} from "./necromancer-claims";
import {
  IMMUNITY_AGENTS,
  LOWER_RESIST_CEILING,
  LOWER_RESIST_FLOOR,
  checkImmunityAgentsDistinguished,
  checkImmunityModelClaims,
  checkInsufficiencyArithmetic,
  checkPierceAgainstImmune,
  checkPierceBreaksImmunity,
  type ImmunityProblem,
} from "./immunity-claims";
import { checkSourcedDivergence } from "./content-rules";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

const fires = (lines: string[], rule: ImmunityProblem["rule"]) =>
  checkImmunityModelClaims(lines, "control").some((p) => p.rule === rule);
const silent = (lines: string[]) => checkImmunityModelClaims(lines, "control").length === 0;

// ===========================================================================
// Lower Resist's reach, derived rather than transcribed
// ===========================================================================

/*
 * The two numbers the corrected pages now quote — 104% and 113% — come out of
 * the same function that already produces 119% and 109%. Nothing on the site
 * states a reach this file does not reproduce.
 */
console.log("\nLower Resist's reach against an immune");
{
  const floor = applyResistanceCurse(110, LOWER_RESIST_FLOOR);
  const ceiling = applyResistanceCurse(110, LOWER_RESIST_CEILING);

  check("a bare point is cut to −5 against an immune", floor.applied === 5, `${floor.applied}`);
  check("the −70% ceiling is cut to −14", ceiling.applied === 14, `${ceiling.applied}`);
  check(
    "both are worth their full value against anything not immune",
    applyResistanceCurse(99, LOWER_RESIST_FLOOR).applied === 25 &&
      applyResistanceCurse(99, LOWER_RESIST_CEILING).applied === 70,
  );

  check(
    "a bare point reaches 104% and no further",
    deepestBreakable(LOWER_RESIST_FLOOR) === 104,
    `${deepestBreakable(LOWER_RESIST_FLOOR)}`,
  );
  check(
    "the ceiling reaches 113% and no further",
    deepestBreakable(LOWER_RESIST_CEILING) === 113,
    `${deepestBreakable(LOWER_RESIST_CEILING)}`,
  );

  // The rows on each side of both ceilings, the shape `PHYSICAL_IMMUNITY_CONTROLS`
  // uses: a correction that overshoots is as wrong as the claim it replaced.
  for (const [before, breaksAtFloor, breaksAtCeiling] of [
    [100, true, true],
    [104, true, true],
    [105, false, true],
    [113, false, true],
    [114, false, false],
  ] as const) {
    check(
      `${before}%: bare point ${breaksAtFloor ? "breaks" : "does not"}, ceiling ${breaksAtCeiling ? "breaks" : "does not"}`,
      applyResistanceCurse(before, LOWER_RESIST_FLOOR).breaks === breaksAtFloor &&
        applyResistanceCurse(before, LOWER_RESIST_CEILING).breaks === breaksAtCeiling,
    );
  }

  // Lower Resist sits between the two physical curses, which is the sanity
  // check that the whole model is one model rather than three.
  check(
    "the ceiling reaches deeper than Decrepify and shallower than Amplify Damage",
    deepestBreakable(DECREPIFY) < deepestBreakable(LOWER_RESIST_CEILING) &&
      deepestBreakable(LOWER_RESIST_CEILING) < deepestBreakable(AMPLIFY_DAMAGE),
    `${deepestBreakable(DECREPIFY)} < ${deepestBreakable(LOWER_RESIST_CEILING)} < ${deepestBreakable(AMPLIFY_DAMAGE)}`,
  );

  check(
    "the two pierce categories are inert against an immune, not reduced",
    IMMUNITY_AGENTS.filter((a) => !a.breaksImmunity).every((a) => a.whileImmune === 0),
  );
  check(
    "Cold Mastery is worth a fifth after the break and item pierce is worth all of it",
    IMMUNITY_AGENTS.find((a) => a.name === "Cold Mastery")?.afterBreak === 1 / 5 &&
      IMMUNITY_AGENTS.find((a) => a.name === "-% to Enemy Resistance")?.afterBreak === 1,
  );
  check(
    "every agent that breaks an immunity is cut to a fifth while it stands",
    IMMUNITY_AGENTS.filter((a) => a.breaksImmunity).every((a) => a.whileImmune === 1 / 5),
  );
}

// ===========================================================================
// The sentences that shipped
// ===========================================================================

console.log("\nPlanted mutations: the immunity sentences that shipped at b314b8f");
{
  const SHIPPED: readonly { note: string; line: string; rule: ImmunityProblem["rule"] }[] = [
    {
      note: "resistances article, the callout — the headline error, both halves in one string",
      line:
        "Cold Mastery, Lightning Mastery and their equivalents reduce enemy resistance — but " +
        "against an already-immune monster, all resistance reduction is applied at one fifth " +
        "effectiveness. A level 20 Cold Mastery nominally worth −100% cold resistance is worth " +
        "only −20% against a cold-immune target, which is nowhere near enough to bring 110% " +
        "resistance below 100%.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "the same callout, measured as arithmetic rather than as a model claim",
      line:
        "A level 20 Cold Mastery nominally worth −100% cold resistance is worth only −20% " +
        "against a cold-immune target, which is nowhere near enough to bring 110% resistance " +
        "below 100%.",
      rule: "insufficiency-arithmetic-wrong",
    },
    {
      note: "resistances article, pt-BR callout",
      line:
        "Cold Mastery, Lightning Mastery e equivalentes reduzem a resistência do inimigo — mas " +
        "contra um monstro já imune, toda redução de resistência é aplicada com um quinto da " +
        "eficácia. Uma Cold Mastery nível 20, nominalmente valendo −100% de resistência a frio, " +
        "vale só −20% contra um alvo imune a frio, o que está longe de bastar para levar 110% " +
        "de resistência abaixo de 100%.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "pt-BR callout, the arithmetic half",
      line:
        "Uma Cold Mastery nível 20 vale só −20% contra um alvo imune a frio, o que está longe " +
        "de bastar para levar 110% de resistência abaixo de 100%.",
      rule: "insufficiency-arithmetic-wrong",
    },
    {
      note: "curses article — the sentence that told a reader the two rules were one",
      line:
        "For those three, and only against a target whose base value of the resistance being " +
        "lowered is already 100 or more, the game divides the curse's effect by five. It is the " +
        "same one-fifth rule the Sorceress's masteries run into, and it is applied per stat " +
        "rather than per skill.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Blizzard Sorceress immunity plan — subject in one clause, falsehood in the next",
      line:
        "Cold Mastery does not break immunity — against a cold-immune monster it operates at " +
        "one fifth effectiveness and cannot bring resistance below 100%.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Frozen Orb immunity plan — the second copy of the arithmetic",
      line:
        "It does not break true immunity, though: resistance reduction applies at one fifth " +
        "effectiveness against an already-immune monster, so a maxed Cold Mastery is worth " +
        "about −20% against something at 110% and that is nowhere near enough.",
      rule: "insufficiency-arithmetic-wrong",
    },
    {
      note: "Frost Nova immunity plan",
      line:
        "Cold Mastery reduces enemy cold resistance by 20% at level 1 plus 5% per level. " +
        "Against a true cold immune it does almost nothing, because resistance reduction " +
        "applies at one fifth effectiveness once a monster is already immune.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Frost Nova, pt-BR",
      line:
        "A Cold Mastery reduz a resistência a frio do inimigo em 20% no nível 1 mais 5% por " +
        "nível. Contra um imune a frio de verdade ela quase não faz nada, porque redução de " +
        "resistência é aplicada com um quinto da eficácia depois que um monstro já é imune.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Freezing Arrow immunity plan — item pierce, not a mastery",
      line:
        "−enemy cold resistance stacks and is applied before the immunity check: an Ice " +
        "runeword is −20%, a Nightwing's Veil is more, and cold facets add further. That will " +
        "not break a true immunity — all resistance reduction works at one fifth effectiveness " +
        "against an already-immune monster — but it keeps the burst relevant.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Ice runeword, common mistakes",
      line:
        "Expecting −20% enemy cold resistance to break a cold immune on its own. It does not; " +
        "against an already-immune monster all resistance reduction works at one fifth " +
        "effectiveness.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Death's Web item page",
      line:
        "−40-50% to Enemy Poison Resistance exists nowhere else. Against a merely resistant " +
        "monster this is the difference between a slow kill and a fast one; against a poison " +
        "immune it is cut to one fifth like every other reduction and does not break the " +
        "immunity.",
      rule: "pierce-applied-to-an-immune",
    },
    {
      note: "Poison Nova immunity plan — the joint verdict",
      line: "Against something actually immune, neither helps.",
      rule: "immunity-agents-equated",
    },
    {
      note: "Poison Nova immunity plan, pt-BR",
      line: "Contra algo de fato imune, nenhum dos dois ajuda.",
      rule: "immunity-agents-equated",
    },
    {
      note: "Poison Nova immunity plan — the paragraph that named both and distinguished neither",
      line:
        "Death's Web is −40-50% to Enemy Poison Resistance and Lower Resist is a further −25% " +
        "to −70%, and the two apply together. Reduction against a target whose base resistance " +
        "is already 100 or more works at one fifth, which does not break the immunity.",
      rule: "immunity-agents-not-distinguished",
    },
    {
      note: "Poison Nova skill note — the same claim scoped to one skill",
      line:
        "One point, and it is the only skill in the game that lowers poison resistance. It " +
        "stacks with Death's Web. Against a monster that is already poison immune, Lower Resist " +
        "is cut to one fifth and does not break the immunity — that is Corpse Explosion's job.",
      rule: "immunity-agents-not-distinguished",
    },
  ];

  for (const { note, line, rule } of SHIPPED) {
    check(`${rule} rejects: ${note}`, fires([line], rule));
  }
}

// ===========================================================================
// The overshoot, which is the other way to get this wrong
// ===========================================================================

/*
 * Correcting "a mastery is cut to a fifth" into "a mastery breaks it after all"
 * clears every rule above and is worse than what it replaced. These are the
 * sentences an author reaching for the fix would plausibly write.
 */
console.log("\nPlanted mutations: the correction overshooting");
{
  const OVERSHOOTS: readonly { note: string; line: string }[] = [
    { note: "the mastery credited outright", line: "A maxed Cold Mastery breaks a cold immunity on its own." },
    { note: "pt-BR", line: "Uma Cold Mastery maximizada quebra a imunidade a frio sozinha." },
    {
      note: "the item credited",
      line: "Death's Web breaks a poison immunity once both rolls are high enough.",
    },
    {
      note: "a facet stack credited",
      line: "Enough cold facets break a cold immunity outright.",
    },
    {
      note: "pt-BR, the item",
      line: "O Death's Web quebra a imunidade a veneno quando a rolagem é alta o bastante.",
    },
  ];
  for (const { note, line } of OVERSHOOTS) {
    check(`pierce-breaks-immunity rejects: ${note}`, fires([line], "pierce-breaks-immunity"));
  }
}

// ===========================================================================
// The corrected prose must pass
// ===========================================================================

/*
 * A gate that rejects the fix along with the error gets deleted by the next
 * author, so the replacements are asserted green here rather than only in
 * `check:content`. These are the strings the site now publishes.
 */
console.log("\nThe corrected sentences pass");
{
  const CORRECTED: readonly { note: string; lines: string[] }[] = [
    {
      note: "resistances article callout",
      lines: [
        "Cold Mastery is the only mastery that touches enemy resistance at all — Fire Mastery " +
          "and Lightning Mastery raise your own damage instead. And Cold Mastery cannot break a " +
          "cold immunity, at any level. It is applied at the last stage of the resistance " +
          "calculation, after the game has already decided whether the monster is immune, and " +
          "that stage is skipped while the immunity stands: against a cold immune the mastery " +
          "is not cut down, it is absent. The mastery then lands on the result — at one fifth " +
          "of its value, since Patch 2.6. Every −% to Enemy Resistance on your gear works the " +
          "same way, except that it lands at full value.",
      ],
    },
    {
      note: "curses article, the two rules held apart",
      lines: [
        "It is not the rule a Sorceress's Cold Mastery runs into, and the two are worth keeping " +
          "apart: a curse is cut to a fifth and can still break the immunity, while a mastery " +
          "is not applied to an immune target at all and cannot break one at any value.",
      ],
    },
    {
      note: "Cold Mastery skill, the post-break bullet",
      lines: [
        "Once something else has broken the immunity — a Cold Rupture, a mercenary's " +
          "Conviction, a Necromancer's Lower Resist — it applies to what is left, at one fifth " +
          "of its value since Patch 2.6.",
      ],
    },
    {
      note: "Lower Resist skill, credited and bounded",
      lines: [
        "Against a monster that is *immune* to the element it works at one fifth strength — " +
          "and, unlike a mastery or a −% to Enemy Resistance, it still breaks the immunity if a " +
          "fifth is enough. At the skill's −70% ceiling that fifth is −14, which reaches 113%; " +
          "from a bare point it is −5, which reaches 104%.",
      ],
    },
    {
      note: "Poison Nova immunity plan, the distinction restored",
      lines: [
        "Lower Resist is a curse, so it is cut to one fifth against a target already at 100% or " +
          "more — and it still breaks the immunity if that fifth is enough. From a bare point " +
          "it is −5 and reaches 104%; at the skill's −70% ceiling it is −14 and reaches 113%. " +
          "Death's Web breaks nothing, at any roll: a −% to Enemy Poison Resistance line is " +
          "applied after the immunity check and skipped entirely while the immunity stands. " +
          "What it does is land at full value the moment Lower Resist has opened the door.",
      ],
    },
    {
      note: "pt-BR, the same",
      lines: [
        "O Lower Resist é uma maldição, então é cortado a um quinto contra um alvo que já está " +
          "em 100% ou mais — e ainda assim quebra a imunidade se esse quinto bastar. O Death's " +
          "Web não quebra nada, em rolagem nenhuma: uma linha de −% to Enemy Poison Resistance " +
          "é aplicada depois da checagem de imunidade e pulada por completo enquanto a " +
          "imunidade estiver de pé.",
      ],
    },
    {
      note: "a true 'does not break' claim with a figure the arithmetic agrees with",
      lines: ["Decrepify's −10 does not break a 120% immunity."],
    },
    {
      note: "a Sunder Charm's post-break split",
      lines: [
        "Sunder Charms set an immune monster's resistance to 95%. Against a sundered monster " +
          "your gear's −% to Enemy Resistance lands at full value, while Cold Mastery, " +
          "Conviction and Lower Resist land at a fifth.",
      ],
    },
    {
      note: "the Ice runeword's corrected mistake entry",
      lines: [
        "Expecting −20% enemy cold resistance to break a cold immune on its own. It does not, " +
          "and no total of it ever will: a −% to Enemy Resistance line is not applied to an " +
          "immune monster at all. It lands at full value once something else has broken the " +
          "immunity.",
      ],
    },
  ];
  for (const { note, lines } of CORRECTED) {
    const problems = checkImmunityModelClaims(lines, "control");
    check(
      `silent on: ${note}`,
      silent(lines),
      problems.map((p) => p.rule).join(", "),
    );
  }
}

// ===========================================================================
// The rules are narrow enough to be obeyed
// ===========================================================================

/*
 * Each rule is handed a sentence about its own subject that is *not* the error,
 * because a rule that fires on any mention of a mastery is a rule that gets
 * worked around rather than satisfied.
 */
console.log("\nThe rules do not fire on neighbouring subjects");
{
  check(
    "a curse cut to a fifth is the correct claim and passes",
    checkPierceAgainstImmune(
      ["Against a physical immune, Amplify Damage's −100 becomes −20 and Decrepify's −50 becomes −10."],
      "c",
    ).length === 0,
  );
  check(
    "Cold Mastery against something merely resistant is untouched",
    checkPierceAgainstImmune(
      ["Cold Mastery subtracts directly from a resistant monster's cold resistance and can push it negative."],
      "c",
    ).length === 0,
  );
  check(
    "a Sunder Charm breaking one is not a pierce claim",
    checkPierceBreaksImmunity(
      ["A Cold Rupture breaks a cold immunity by setting the monster to 95%, and the facet then applies."],
      "c",
    ).length === 0,
  );
  check(
    "naming both agents without a break claim owes nothing",
    checkImmunityAgentsDistinguished(
      ["Death's Web and Lower Resist stack, and together they are −65% to −120% against a resistant monster."],
      "c",
    ).length === 0,
  );
  check(
    "'above 113%' is a floor, not a subtraction the rule should attempt",
    checkInsufficiencyArithmetic(["Above 113% neither reaches, and nothing here does not break it."], "c")
      .length === 0,
  );
  check(
    `the threshold the rules use is ${IMMUNITY_THRESHOLD}`,
    IMMUNITY_THRESHOLD === 100,
  );
}

// ===========================================================================
// Divergence claims must name and date a source
// ===========================================================================

console.log("\nPlanted mutations: the runeword divergence notes that shipped");
{
  const divergence = (line: string, rule: "unsourced-divergence-claim" | "undated-divergence-claim") =>
    checkSourcedDivergence([line], "control").some((p) => p.rule === rule);

  const UNSOURCED: readonly { note: string; line: string }[] = [
    {
      note: "Kingslayer, as it shipped",
      line:
        "Open Wounds reads 25% in the game's own data. Several community databases still list " +
        "50%, which appears to be a stale figure.",
    },
    {
      note: "Last Wish, as it shipped",
      line:
        "Crushing Blow reads 40-50% in the game's own data. Several community databases still " +
        "list 60-70%, which appears to be a stale figure.",
    },
    {
      note: "Kingslayer's pt-BR twin",
      line:
        "Open Wounds aparece como 25% nos dados do próprio jogo. Várias bases da comunidade " +
        "ainda listam 50%, o que parece ser um número desatualizado.",
    },
    {
      note: "the Death's Web shape this repository already withdrew",
      line:
        "Every community database publishes +1-2 to All Skills as a range, and the site is " +
        "choosing the extraction over them.",
    },
    { note: "the same claim hedged", line: "Some other sources list a higher figure." },
    { note: "pt-BR, hedged", line: "Algumas fontes publicam um valor mais alto do que este." },
  ];
  for (const { note, line } of UNSOURCED) {
    check(`unsourced-divergence-claim rejects: ${note}`, divergence(line, "unsourced-divergence-claim"));
  }

  check(
    "undated-divergence-claim rejects a named source with no reading date",
    divergence(
      "Several community databases still list 50% — D2Runewizard and the Diablo Wiki both do.",
      "undated-divergence-claim",
    ),
  );

  const ACCEPTED: readonly { note: string; line: string }[] = [
    {
      note: "Kingslayer as it now reads: named, dated, and the extraction still published",
      line:
        "Open Wounds reads 25% in the pinned game-data extraction, and two named databases " +
        "disagree. D2Runewizard's Kingslayer page and the Diablo Wiki's rune word entry both " +
        "publish 50%; both were consulted on 2026-09-04.",
    },
    {
      note: "pt-BR, the same",
      line:
        "Open Wounds aparece como 25% na extração fixada, e duas bases nomeadas discordam. A " +
        "página do D2Runewizard e o verbete da Diablo Wiki publicam 50%, consultados em " +
        "2026-09-04.",
    },
    {
      note: "build consensus is not a divergence claim",
      line:
        "O item que a maioria das fontes aponta para ele é um Reaper's Toll pelo proc de " +
        "Decrepify, que baixa a resistência física e desacelera o alvo.",
    },
    {
      note: "a source named without any divergence at all",
      line: "Verified against The Arreat Summit.",
    },
  ];
  for (const { note, line } of ACCEPTED) {
    const problems = checkSourcedDivergence([line], "control");
    check(`silent on: ${note}`, problems.length === 0, problems.map((p) => p.rule).join(", "));
  }
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
