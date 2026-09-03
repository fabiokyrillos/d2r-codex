/**
 * Proc lines as a reader meets them: on the rendered page, in both locales.
 *
 * `check:content` already runs `checkProcLines` over the data. This runs the
 * same controls against the HTML `next build` wrote, which is a different
 * question — a stat line can be correct in `content/` and never reach the page,
 * and the swapped Thunderstroke line was wrong in a place both locales render
 * from.
 *
 * **Why both locales, when the stat lines are English.** ADR 0003 keeps game
 * proper nouns and stat strings untranslated, so `UniqueItemCopy` carries no
 * `stats` field and one string feeds both pages. That is exactly why it is worth
 * asserting per locale rather than once: the invariant is a decision about the
 * overlay shape, and if an overlay ever gained a `stats` field the pt-BR page
 * could drift while the en-US page stayed right. A test that checked only the
 * source locale would not notice.
 *
 * Requires `npm run build`. Run with `npm run test:items`.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { LOCALES } from "../lib/i18n/config";
import { getRunewords, getUniques } from "../lib/registry";
import {
  RUNEWORD_PROC_CONTROLS,
  UNIQUE_PROC_CONTROLS,
  checkProcLines,
  procLine,
  swappedProcLine,
} from "./item-rules";

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

const root = assertFreshBuild();

/** Visible text only: the RSC payload legitimately carries source strings. */
const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x2011;/g, "-")
    .replace(/\s+/g, " ");

const ALL = [...UNIQUE_PROC_CONTROLS, ...RUNEWORD_PROC_CONTROLS];
const pageFor = (locale: string, spec: (typeof ALL)[number]) =>
  join(root, locale, spec.kind === "unique" ? "items" : "runewords", `${spec.slug}.html`);

// ---------------------------------------------------------------------------
console.log("\nThe data agrees with the Tier 1 controls");
// ---------------------------------------------------------------------------
{
  const problems = [
    ...checkProcLines(getUniques("en-us"), UNIQUE_PROC_CONTROLS),
    ...checkProcLines(getRunewords("en-us"), RUNEWORD_PROC_CONTROLS),
  ];
  check(
    `all ${ALL.length} proc controls hold`,
    problems.length === 0,
    JSON.stringify(problems.map((p) => p.message)),
  );
  // A control on the control: the specs must actually reach real entities, or
  // the assertion above would pass by checking nothing.
  check(
    "every control names an entity that exists",
    problems.every((p) => p.rule !== "proc-entity-missing"),
  );
  check(
    "the controls cover all three trigger columns",
    new Set(ALL.map((s) => s.column)).size === 3,
    [...new Set(ALL.map((s) => s.column))].join(", "),
  );
  check(
    "and both catalogues",
    new Set(ALL.map((s) => s.kind)).size === 2,
  );
}

// ---------------------------------------------------------------------------
console.log(`\nEvery controlled proc line reaches the page (${LOCALES.length} locales)`);
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  for (const spec of ALL) {
    const file = pageFor(locale, spec);
    if (!existsSync(file)) {
      check(`${locale}/${spec.slug}: page exists`, false, file);
      continue;
    }
    const text = visible(readFileSync(file, "utf8"));
    const right = procLine(spec);
    const wrong = swappedProcLine(spec);

    check(`${locale}/${spec.slug}: renders "${right}"`, text.includes(right));
    // The regression, stated as its own assertion so a failure names it.
    check(
      `${locale}/${spec.slug}: does not render the chance/level swap`,
      wrong === right || !text.includes(wrong),
      wrong,
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nNegative controls: these assertions can fail");
// ---------------------------------------------------------------------------
{
  const file = pageFor("en-us", UNIQUE_PROC_CONTROLS[0]);
  const text = visible(readFileSync(file, "utf8"));
  check(
    "the swapped Thunderstroke line is a string this test would have found",
    swappedProcLine(UNIQUE_PROC_CONTROLS[0]) === "14% Chance to cast level 20 Lightning on striking",
    swappedProcLine(UNIQUE_PROC_CONTROLS[0]),
  );
  check(
    "a line that is not on the page is reported as absent",
    !text.includes("99% Chance to cast level 99 Lightning on striking"),
  );
  check(
    "the visible-text filter removes the RSC payload but keeps rendered prose",
    readFileSync(file, "utf8").includes("<script") &&
      !text.includes("<script") &&
      text.includes("Thunderstroke"),
  );
}

// ---------------------------------------------------------------------------
console.log(
  failures.length === 0
    ? `\n${passed} checks passed over ${ALL.length} proc controls in ${LOCALES.length} locales.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
