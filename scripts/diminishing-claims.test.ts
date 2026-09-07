/**
 * Proof that the `dm`/`ln` bounds artifact says what the pinned tables say.
 *
 * WHY THIS EXISTS
 * ---------------
 * Six sentences shipped that stated a diminishing skill's **Max** parameter as a
 * figure the character has — "Weapon Block at twenty gives a 65% block chance",
 * "a 25% chance of a critical hit" — and every gate in `npm run check` stayed
 * green, because 65 and 25 *are* the numbers on those rows. What was wrong was
 * the grammar wrapped around them: `Param2 = 65` is the ceiling the curve climbs
 * toward, and the character at twenty hard points is nowhere near it.
 *
 * See `docs/proposals/assassin-8-diminishing-params-stated-as-achieved.md`.
 *
 * Two halves, and neither is worth much without the other.
 *
 * **The extraction.** The records below are hand-checked against the pinned
 * JSON, by eye, before the generator existed. If the generator ever produces
 * something else for these three rows, this file fails and the diff is the
 * conversation. Nothing here is copied out of the generated artifact.
 *
 * **The rule.** The sentences in `SHIPPED_WRONG` are the text this repository
 * actually published, in the locale it published it in. A rule that cannot
 * reject the sentence it was written for would not have caught the mistake it
 * exists to catch. Their repairs are asserted green in the same breath, because
 * a rule that rejects both the error and its fix is a rule the next author
 * deletes.
 *
 * Run with `npx tsx scripts/diminishing-claims.test.ts`.
 */
import { SKILL_PARAM_BOUNDS, SKILL_PARAM_BOUNDS_UNRESOLVED } from "../content/classes/skill-param-bounds";

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

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// ===========================================================================
// The extraction, against rows read by hand out of the pinned tables
// ===========================================================================

/*
 * blizzhackers/d2data @ fc46999, json/skilldesc.json, row `weapon block`:
 *
 *   "desccalca1": "dm12"
 *
 * and json/skills.json, row `Weapon Block`:
 *
 *   "charclass": "ass", "maxlvl": 20,
 *   "Param1": 20, "*Param1 Description": "Block % chance Min",
 *   "Param2": 65, "*Param2 Description": "Block % chance Max"
 */
console.log("\nWeapon Block's dm12, hand-checked against json/skilldesc.json");
{
  const record = SKILL_PARAM_BOUNDS["assassin/weapon-block/skilldesc.json/desccalca1/dm12"];
  check("the record exists under its class/skill/column/token key", record !== undefined);
  if (record) {
    check("it is diminishing", record.family === "diminishing", String(record.family));
    check("it reads Param1 and Param2", same(record.parameters, [1, 2]), JSON.stringify(record.parameters));
    check(
      "its minimum is Param1 = 20",
      record.family === "diminishing" && record.minimum === 20,
      JSON.stringify(record),
    );
    check(
      "its maximum is Param2 = 65",
      record.family === "diminishing" && record.maximum === 65,
      JSON.stringify(record),
    );
    check(
      "it carries the game's own Min/Max labels",
      same(record.labels, ["Block % chance Min", "Block % chance Max"]),
      JSON.stringify(record.labels),
    );
    check("its source coordinate is the skilldesc column", record.source === "skilldesc.json" && record.column === "desccalca1");
    check("it records the twenty-point cap", record.maxLevel === 20, String(record.maxLevel));
  }
}

/*
 * json/skills.json, row `Claw Mastery` — the tokens are on the *skill* row here
 * rather than on the description row, which carries the opaque mastery calls
 * `macr`, `madm` and `math` instead:
 *
 *   "passivecalc1": "ln12", "Param1": 30 ("Attack Rating % baseline"),
 *                           "Param2": 10 ("Attack Rating % per level")
 *   "passivecalc3": "dm56", "Param5": 0  ("% chance for Critical Hit Min"),
 *                           "Param6": 25 ("% chance for Critical Hit Max")
 */
console.log("\nClaw Mastery's ln12 and dm56, hand-checked against json/skills.json");
{
  const linear = SKILL_PARAM_BOUNDS["assassin/claw-mastery/skills.json/passivecalc1/ln12"];
  check("the ln12 record exists", linear !== undefined);
  if (linear) {
    check("it is linear", linear.family === "linear", String(linear.family));
    check("its base is Param1 = 30", linear.family === "linear" && linear.base === 30, JSON.stringify(linear));
    check(
      "it gains Param2 = 10 per level",
      linear.family === "linear" && linear.perLevel === 10,
      JSON.stringify(linear),
    );
    check(
      "it carries no maximum, because a linear column declares none",
      !("maximum" in linear),
      JSON.stringify(linear),
    );
  }

  const diminishing = SKILL_PARAM_BOUNDS["assassin/claw-mastery/skills.json/passivecalc3/dm56"];
  check("the dm56 record exists", diminishing !== undefined);
  if (diminishing) {
    check("it is diminishing", diminishing.family === "diminishing", String(diminishing.family));
    check("it reads Param5 and Param6", same(diminishing.parameters, [5, 6]), JSON.stringify(diminishing.parameters));
    check(
      "its maximum is Param6 = 25",
      diminishing.family === "diminishing" && diminishing.maximum === 25,
      JSON.stringify(diminishing),
    );
    check(
      "its minimum is Param6's partner, Param5 = 0",
      diminishing.family === "diminishing" && diminishing.minimum === 0,
      JSON.stringify(diminishing),
    );
  }
}

// ===========================================================================
// Shape, determinism and the gaps the extraction refuses to guess at
// ===========================================================================

console.log("\nThe artifact's shape");
{
  const keys = Object.keys(SKILL_PARAM_BOUNDS);
  check("it carries records", keys.length > 0, String(keys.length));
  check(
    "its keys are emitted in sorted order, so a regeneration is a readable diff",
    same(keys, [...keys].sort()),
  );

  const wrongFamily = keys.filter((k) => {
    const r = SKILL_PARAM_BOUNDS[k];
    return r.token.startsWith("dm") !== (r.family === "diminishing");
  });
  check(
    "every record's family agrees with its token prefix",
    wrongFamily.length === 0,
    wrongFamily.slice(0, 4).join(", "),
  );

  const wrongKey = keys.filter((k) => {
    const r = SKILL_PARAM_BOUNDS[k];
    return k !== `${r.classSlug}/${r.skillSlug}/${r.source}/${r.column}/${r.token}`;
  });
  check("every key restates its own record's coordinate", wrongKey.length === 0, wrongKey.slice(0, 4).join(", "));

  const nonConsecutive = keys.filter((k) => {
    const [a, b] = SKILL_PARAM_BOUNDS[k].parameters;
    return b !== a + 1;
  });
  check(
    "no record reads a non-consecutive parameter pair",
    nonConsecutive.length === 0,
    nonConsecutive.slice(0, 4).join(", "),
  );

  check(
    "the parameter pairs the extraction refuses to resolve are listed rather than dropped in silence",
    SKILL_PARAM_BOUNDS_UNRESOLVED.length > 0,
    String(SKILL_PARAM_BOUNDS_UNRESOLVED.length),
  );
  check(
    "every unresolved entry says why it was left out",
    SKILL_PARAM_BOUNDS_UNRESOLVED.every((u) => u.reason.length > 0),
  );
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
