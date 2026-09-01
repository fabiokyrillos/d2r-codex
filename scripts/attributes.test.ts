/**
 * Starting attributes, checked against the game's own table.
 *
 * Needs no build and no network. Run with `npm run test:attributes`.
 *
 * The rule is under test, not just the answers. Asserting the twelve published
 * numbers against twelve hard-coded numbers would pass with the conversion
 * inverted, dropped or applied to the wrong columns — the quarter-point columns
 * are exactly the kind of thing that looks reasonable at any scale. So the test
 * derives every class from `CHARSTATS` through `attributesFrom` and compares
 * the result, then plants mutations to prove the comparison can fail.
 */
import { CHARSTATS, attributeDrift, attributesFrom } from "./attributes-rules";

import { getClasses } from "../lib/registry";
import { DEFAULT_LOCALE } from "../lib/i18n/config";

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

// ===========================================================================
console.log("\nThe conversion rule, in isolation");
// ===========================================================================

{
  const sorceress = attributesFrom(CHARSTATS.sorceress);

  // The quarter-point columns. `LifePerVitality: 8` must read as 2, not 8.
  check(
    "the four Per columns are read as quarter-points",
    sorceress.lifePerVitality === 2 &&
      sorceress.manaPerEnergy === 2 &&
      sorceress.lifePerLevel === 1 &&
      sorceress.manaPerLevel === 2,
    JSON.stringify({
      lifePerVitality: sorceress.lifePerVitality,
      manaPerEnergy: sorceress.manaPerEnergy,
      lifePerLevel: sorceress.lifePerLevel,
      manaPerLevel: sorceress.manaPerLevel,
    }),
  );

  // Starting Life is not a column: it is hpadd plus Vitality.
  check(
    "hitPoints is hpadd + vitality, not hpadd",
    sorceress.hitPoints === 40 && CHARSTATS.sorceress.hpadd === 30,
    `${sorceress.hitPoints}`,
  );

  // The game calls Energy "int"; mana starts equal to it.
  check(
    "energy and starting mana both come from the int column",
    sorceress.energy === 35 && sorceress.mana === 35,
    `${sorceress.energy}/${sorceress.mana}`,
  );
}

// ===========================================================================
console.log("\nPlanted mutations — the comparison must be able to fail");
// ===========================================================================

{
  const good = attributesFrom(CHARSTATS.amazon);

  check(
    "an unchanged derivation reports no drift",
    attributeDrift(good, good).length === 0,
  );

  // Every field, one at a time. A comparison that skips a field would pass
  // this suite while letting that field ship wrong.
  const fields = Object.keys(good) as (keyof typeof good)[];
  const undetected = fields.filter((field) => {
    const mutated = { ...good, [field]: (good[field] as number) + 1 };
    return attributeDrift(mutated, good).length === 0;
  });
  check(
    "every field is compared",
    undetected.length === 0,
    undetected.length ? `not compared: ${undetected.join(", ")}` : `${fields.length} fields`,
  );

  // The specific mistake this file was written for: forgetting the quarters.
  const rawQuarters = {
    ...good,
    lifePerVitality: CHARSTATS.amazon.LifePerVitality,
  };
  check(
    "publishing a Per column raw is caught",
    attributeDrift(rawQuarters, good).length === 1,
  );

  // The other one: reading hpadd as starting Life.
  const forgotVitality = { ...good, hitPoints: CHARSTATS.amazon.hpadd };
  check(
    "publishing hpadd as starting Life is caught",
    attributeDrift(forgotVitality, good).length === 1,
  );
}

// ===========================================================================
console.log("\nThe published content, against the game table");
// ===========================================================================

{
  const classes = getClasses(DEFAULT_LOCALE);
  const withAttributes = classes.filter((cls) => cls.attributes);

  check(
    "every class that publishes attributes has a game-data row",
    withAttributes.every((cls) => CHARSTATS[cls.slug] !== undefined),
    withAttributes
      .filter((cls) => !CHARSTATS[cls.slug])
      .map((cls) => cls.slug)
      .join(", "),
  );

  // The Amazon is the reason this pass exists; assert her presence explicitly
  // rather than letting an empty set pass the loop below.
  check(
    "the Amazon publishes attributes",
    classes.some((cls) => cls.slug === "amazon" && cls.attributes !== undefined),
  );

  for (const cls of withAttributes) {
    const row = CHARSTATS[cls.slug];
    if (!row) continue;
    const drift = attributeDrift(cls.attributes!, attributesFrom(row));
    check(`${cls.slug}: attributes match charstats.txt`, drift.length === 0, drift.join("; "));
  }
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
