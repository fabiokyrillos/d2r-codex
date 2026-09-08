/**
 * The threshold's evidence has to still be the evidence.
 *
 * `GOOD_AT_THRESHOLD = 4` was justified by a distribution measured over 29
 * builds. The catalogue reached 53 without anything noticing, because the
 * justification lived in a comment and a comment cannot fail. R-FILT-4 and
 * R-FILT-5 both read that threshold, so its evidence going stale is not a
 * documentation problem — it is the input to two requirements.
 *
 * Three things are checked, and the first is the one that matters:
 *
 *   1. The published measurement is what the builds actually say *now*. Add a
 *      build, change a rating, and the committed artefact stops matching the
 *      recomputation, which is the drift this gate exists to catch.
 *   2. The threshold in the code is the threshold ADR 0004 records, so the two
 *      cannot part company.
 *   3. The prose justification in `filter.ts` quotes the measured numbers, not
 *      remembered ones.
 *
 * Run with `npm run test:rating-distribution`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { measureDistribution, serialise, ARTEFACT, CANDIDATES } from "./rating-distribution";
import { GOOD_AT_THRESHOLD, RATING_AXES } from "../lib/builds/filter";

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

const ADR = join("docs", "adr", "0004-good-at-threshold.md");
const FILTER = join("lib", "builds", "filter.ts");

const measured = measureDistribution();
const expected = serialise(measured);

// ---------------------------------------------------------------------------
console.log("\nThe published measurement matches the builds as they are today");
// ---------------------------------------------------------------------------
{
  const path = join(process.cwd(), ARTEFACT);
  if (!existsSync(path)) {
    check(
      `${ARTEFACT} exists`,
      false,
      "run `npm run gen:rating-distribution`, then re-read ADR 0004 before committing",
    );
  } else {
    const onDisk = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
    check(
      `${ARTEFACT} is the current distribution`,
      onDisk === expected,
      onDisk === expected
        ? ""
        : `the catalogue moved. Run \`npm run gen:rating-distribution\`, read the new numbers, ` +
            `and decide the threshold again in ${ADR} — do not regenerate and commit without reading.`,
    );
    const parsed = JSON.parse(onDisk) as typeof measured;
    check(
      "the artefact's build count is the catalogue's",
      parsed.builds === measured.builds,
      `${parsed.builds} published vs ${measured.builds} now`,
    );
    check(
      "the artefact covers every rating axis",
      parsed.axes.join(",") === [...RATING_AXES].join(","),
      parsed.axes.join(","),
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nThe code, the artefact and the decision agree on one number");
// ---------------------------------------------------------------------------
{
  check(
    "the threshold is one of the measured candidates",
    (CANDIDATES as readonly number[]).includes(GOOD_AT_THRESHOLD),
    `${GOOD_AT_THRESHOLD} vs ${CANDIDATES.join(", ")}`,
  );
  const adrPath = join(process.cwd(), ADR);
  if (!existsSync(adrPath)) {
    check(`${ADR} exists`, false, "the decision has to be written down somewhere durable");
  } else {
    const adr = readFileSync(adrPath, "utf8");
    const recorded = /<!-- THRESHOLD: (\d+) -->/.exec(adr);
    check(`${ADR} records the threshold in a machine-readable line`, recorded !== null);
    check(
      "the recorded threshold is the one the code uses",
      Number(recorded?.[1]) === GOOD_AT_THRESHOLD,
      `${recorded?.[1]} recorded, ${GOOD_AT_THRESHOLD} in code`,
    );
    check(`${ADR} points at the generated artefact`, adr.includes(ARTEFACT.replace(/\\/g, "/")));
  }
}

// ---------------------------------------------------------------------------
console.log("\nThe justification in the code quotes the measurement");
// ---------------------------------------------------------------------------
/*
 * The defect was not a wrong number, it was a *stale* one that still read as
 * current. So the comment has to name the size of the catalogue it was measured
 * over, and that size has to be the size the catalogue is.
 */
{
  const source = readFileSync(join(process.cwd(), FILTER), "utf8");
  const chosen = measured.thresholds[String(GOOD_AT_THRESHOLD)];
  const share = `${(chosen.shareOfRatings * 100).toFixed(1)}%`;
  const claims: [what: string, present: boolean][] = [
    [`the build count (${measured.builds})`, new RegExp(`\\b${measured.builds}\\b`).test(source)],
    [`the rating count (${measured.ratings})`, new RegExp(`\\b${measured.ratings}\\b`).test(source)],
    [`the share at the threshold (${share})`, source.includes(share)],
    [`the artefact's path`, source.includes(ARTEFACT.replace(/\\/g, "/"))],
  ];
  for (const [what, present] of claims) {
    check(`filter.ts states ${what}`, present);
  }
  const stale = ["29 published builds", "232 ratings"].filter((s) => source.includes(s));
  check("filter.ts no longer carries the 29-build measurement", stale.length === 0, stale.join(", "));
}

// ---------------------------------------------------------------------------
console.log("\nControls");
// ---------------------------------------------------------------------------
{
  // The comparison is only worth something if a changed number breaks it.
  const tampered = JSON.parse(expected) as typeof measured;
  tampered.builds += 1;
  check("control: one changed field breaks the byte comparison", serialise(tampered) !== expected);

  // And only if the measurement is not trivially empty.
  check("control: the measurement covers the whole catalogue", measured.builds > 40, `${measured.builds}`);
  check(
    "control: every rating was counted",
    Object.values(measured.histogram).reduce((a, b) => a + b, 0) === measured.ratings,
  );
  check("control: the measurement is stable across runs", serialise(measureDistribution()) === expected);
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed.`);
// ---------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
