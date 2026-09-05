/**
 * Proof that the freeze-length controls fire.
 *
 * The claim they exist to catch shipped at 3273e51 in six places — three English
 * and three Portuguese — and none of the gates in `npm run check` noticed,
 * because every one of them checks that a *number* is consistent with the graph
 * and this number was consistent with the graph. 50 frames and 3 per level are
 * exactly `Param3` and `Param4` on the Glacial Spike row. What was wrong was the
 * sentence built on top of them: "a maxed Glacial Spike holds a pack still for
 * over four seconds", which is true in Normal and four times too generous in
 * Hell, where the build quoting it is played.
 *
 * Two kinds of check, and the second is the one that matters.
 *
 * **Derived arithmetic.** Every figure below comes out of the graph row through
 * `freezeFramesAtLevel` and `freezeSecondsIn`. Nothing is transcribed. If the
 * extraction ever produces different parameters these numbers move, and the
 * prose that quotes them fails in `check:content` rather than here.
 *
 * **Planted mutations.** The sentences in `SHIPPED_WRONG` are the text this
 * repository actually published, in the locale it published it in. A rule that
 * cannot reject the sentence it was written for would not have caught the
 * mistake it exists to catch. The corrected replacements are asserted green in
 * the same breath, because a rule that rejects both the error and its fix is a
 * rule the next author deletes.
 *
 * The false positives are pinned too. An earlier draft of this rule matched
 * across whole paragraphs and flagged nine live sentences, eight of which said
 * "a second Faith" and meant the ordinal. Those sentences are in `ACCEPTED`, so
 * the narrowing cannot be quietly undone.
 *
 * Run with `npm run test:freeze`.
 */
import {
  FREEZE_RULES,
  MONSTER_FREEZE_DIVISOR,
  checkFreezeLengthClaims,
  freezeFramesAtLevel,
  freezeSecondsIn,
  glacialSpikeFreezeShape,
  type FreezeProblem,
} from "./freeze-length-claims";

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

const fires = (line: string, rule: FreezeProblem["rule"]) =>
  checkFreezeLengthClaims([line], "control").some((p) => p.rule === rule);
const silent = (line: string) => checkFreezeLengthClaims([line], "control").length === 0;

// ===========================================================================
// The parameters, read from the graph rather than restated
// ===========================================================================

console.log("\nGlacial Spike's freeze length, out of the extraction");
{
  const shape = glacialSpikeFreezeShape();
  check("the baseline is 50 frames", shape.base === 50, `${shape.base}`);
  check("it grows 3 frames per level", shape.perLevel === 3, `${shape.perLevel}`);

  check("one point is 50 frames", freezeFramesAtLevel(1) === 50, `${freezeFramesAtLevel(1)}`);
  check("twenty points is 107 frames", freezeFramesAtLevel(20) === 107, `${freezeFramesAtLevel(20)}`);

  // par7 = 3% per Blizzard hard point, and it reads `blvl`: twenty *points*.
  check(
    "twenty hard points of Blizzard lengthen a maxed spike to 171 frames",
    freezeFramesAtLevel(20, 20) === 171,
    `${freezeFramesAtLevel(20, 20)}`,
  );
  check(
    "gear is not a parameter — the synergy reads hard points only",
    freezeFramesAtLevel(20, 0) === 107,
  );
}

console.log("\nThe same length as the player experiences it");
{
  check("the divisor is 1 / 2 / 4", MONSTER_FREEZE_DIVISOR.normal === 1 && MONSTER_FREEZE_DIVISOR.nightmare === 2 && MONSTER_FREEZE_DIVISOR.hell === 4);

  const normal = freezeSecondsIn("normal", 20);
  const nightmare = freezeSecondsIn("nightmare", 20);
  const hell = freezeSecondsIn("hell", 20);

  check("Normal: 4.28s — the figure the shipped prose quoted", normal === 107 / 25, `${normal}`);
  check("Nightmare: 2.12s", nightmare === 53 / 25, `${nightmare}`);
  check("Hell: 1.04s", hell === 26 / 25, `${hell}`);

  /*
   * The corrected pages say "a little over a second" in Hell and refuse the
   * "over four seconds" the old ones claimed. Both halves are pinned, because
   * the fix would be as wrong as the error if it overshot the other way.
   */
  check("Hell is over one second", hell > 1, `${hell}`);
  check("Hell is under one and a quarter", hell < 1.25, `${hell}`);
  check("Hell is nowhere near the four seconds that shipped", hell < 4 / 4 + 0.1);

  check(
    "one point in Hell is half a second, as the Frost Nova page now says",
    freezeSecondsIn("hell", 1) === 12 / 25,
    `${freezeSecondsIn("hell", 1)}`,
  );
}

// ===========================================================================
// Planted mutations: the sentences this repository shipped
// ===========================================================================

/**
 * Verbatim from 3273e51. Locale and file recorded so a reader can go and look.
 */
const SHIPPED_WRONG: { note: string; line: string; rule: FreezeProblem["rule"] }[] = [
  {
    note: "en-us frozen-orb-sorceress — the headline error, four times too generous in Hell",
    line:
      "**Its freeze runs 50 frames at one point and three more per level**, so a maxed " +
      "Glacial Spike holds a pack still for over four seconds. And it is not a cold spell " +
      "you are starting from scratch: **Frozen Orb and Ice Bolt both feed it**, and this " +
      "plan already has twenty in each.",
    rule: "freeze-length-without-difficulty",
  },
  {
    note: "en-us frost-nova-sorceress — the same frames offered as an emergency button",
    line:
      "The third link, and a genuine emergency freeze at one point — its freeze runs 50 " +
      "frames before any investment at all.",
    rule: "freeze-length-without-difficulty",
  },
  {
    note: "en-us frost-nova-sorceress — flexPoints",
    line:
      "**Glacial Spike, up to 20 of the 22.** Not a synergy for the ring, but its freeze " +
      "runs 50 frames at one point and three more per level, and your Blizzard points " +
      "lengthen it further. This is where more crowd control comes from once the ring is " +
      "not enough.",
    rule: "freeze-length-without-difficulty",
  },
  {
    note: "pt-br mirror of the headline error",
    line:
      "**O congelamento dele dura 50 frames com um ponto e mais três por nível**, então um " +
      "Glacial Spike maximizado segura um grupo parado por mais de quatro segundos.",
    rule: "freeze-length-without-difficulty",
  },
  {
    note: "pt-br mirror of the emergency button",
    line:
      "O terceiro elo, e um congelamento de emergência de verdade com um ponto — o " +
      "congelamento dele dura 50 frames sem investimento nenhum.",
    rule: "freeze-length-without-difficulty",
  },
  {
    note: "pt-br mirror of flexPoints",
    line:
      "**Glacial Spike, até 20 dos 22.** Não é sinergia do anel, mas o congelamento dele " +
      "dura 50 frames com um ponto e mais três por nível, e os seus pontos de Blizzard o " +
      "alongam ainda mais.",
    rule: "freeze-length-without-difficulty",
  },
  {
    note: "the second trap: crediting a level rather than points",
    line: "Every level of Blizzard makes the freeze longer, so gear that adds skills lengthens it too.",
    rule: "freeze-length-reads-skill-level",
  },
  {
    note: "pt-br form of the same trap",
    line: "Cada nível de Blizzard aumenta a duração do congelamento.",
    rule: "freeze-length-reads-skill-level",
  },
];

console.log("\nPlanted mutations — every one is text that shipped");
for (const { note, line, rule } of SHIPPED_WRONG) {
  check(`rejects: ${note}`, fires(line, rule), `expected ${rule}`);
}

// ===========================================================================
// The corrections, and the sentences that must stay silent
// ===========================================================================

const ACCEPTED: { note: string; line: string }[] = [
  {
    note: "the correction that replaced the headline error",
    line:
      "**Its freeze runs 50 frames at one point and three more per level**, so a maxed " +
      "Glacial Spike is 107 frames — and that is the Normal number. Freeze length is " +
      "divided by the difficulty, halved in Nightmare and quartered in Hell, so what you " +
      "actually get where you will use it is **a little over a second**.",
  },
  {
    note: "the correction that replaced the emergency button",
    line:
      "The third link, and a real emergency button at one point — 50 frames of freeze " +
      "before any investment at all. Read that as two seconds in Normal and half a second " +
      "in Hell.",
  },
  {
    note: "the correction that names points rather than level",
    line:
      "its freeze runs 50 frames at one point and three more per level, and each *hard* " +
      "point of Blizzard adds 3% on top. Hell quarters whatever that comes to.",
  },
  {
    note: "pt-br correction",
    line:
      "O congelamento dele dura 50 frames com um ponto e mais três por nível, e cada ponto " +
      "duro de Blizzard soma 3% em cima. O Hell divide por quatro o que der nisso.",
  },
  /*
   * The nine live sentences an earlier draft of this rule flagged. Eight are the
   * ordinal "a second Faith"; the ninth pairs a Holy Freeze mercenary with an
   * unrelated duration five sentences later. All must stay silent.
   */
  {
    note: "the ordinal, en-us — 'a second Faith' beside a Holy Freeze mercenary",
    line:
      "**The Act 2 Desert Mercenary, not the Rogue.** The Strafe page recommends a second " +
      "Faith on an Act 1 Rogue and it is right to. Holy Freeze is the aura you want here.",
  },
  {
    note: "the ordinal, pt-br",
    line:
      "**O mercenário do Ato 2, não a Rogue.** A página do Strafe recomenda um segundo " +
      "Faith numa Rogue do Ato 1 e faz bem. O Holy Freeze é a aura que você quer aqui.",
  },
  {
    note: "an aura named without any duration at all",
    line: "Holy Freeze stops the room, and that is worth more than the damage the other aura adds.",
  },
  {
    note: "a frame count that has nothing to do with a freeze",
    line: "Treat 60% Faster Hit Recovery as the floor: it is 9 frames rather than 13.",
  },
  {
    note: "a freeze length that does name its difficulty",
    line: "The freeze runs a little over a second in Hell, which is long enough to walk out of something.",
  },
];

console.log("\nSentences that must stay silent");
for (const { note, line } of ACCEPTED) {
  const problems = checkFreezeLengthClaims([line], "control");
  check(`silent on: ${note}`, silent(line), problems.map((p) => p.rule).join(", "));
}

// ===========================================================================
// The rule list is the one `check:content` runs
// ===========================================================================

console.log("\nWiring");
check("both rules are exported for the content sweep", FREEZE_RULES.length === 2);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
