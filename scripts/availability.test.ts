/**
 * Proof that the availability controls fire.
 *
 * Three kinds of check, the same shape the Assassin's file uses.
 *
 * **Structure.** The shipped data is asserted complete, then mutated four ways
 * — a mode dropped, a mode duplicated, prose removed, provenance blanked — and
 * each mutation asserted rejected. A validator that passes a block with two
 * `ladder` rows is not validating anything.
 *
 * **Planted prose.** `WOULD_HAVE_SHIPPED` holds the sentences the rest of the
 * internet is currently publishing about this item. Each is asserted rejected,
 * and a corrected form asserted silent — a rule that refuses the fix as well as
 * the error is a rule the next author deletes.
 *
 * **Pinned correct.** Every sentence the site actually ships about Mosaic, in
 * both locales, asserted silent. This is what stops the prose rules being
 * tightened until they fire on the shipped page and quietly turned off.
 *
 * Run with `npm run test:availability`.
 */
import { AVAILABILITY_MODES, AVAILABILITY_STATUSES } from "../lib/types";
import type { Availability } from "../lib/types";
import { LOCALES } from "../lib/i18n/config";
import { getBuilds, getRuneword, getRunewords } from "../lib/registry";
import {
  AVAILABILITY_RULES,
  EXPECTED_STATUSES,
  checkAvailabilityClaims,
  checkAvailabilityShape,
  checkGates,
  type AvailabilityRule,
} from "./availability-rules";

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

const rejects = (line: string, rule: AvailabilityRule) =>
  checkAvailabilityClaims([line], "control").some((p) => p.rule === rule);
const silent = (line: string) => checkAvailabilityClaims([line], "control").length === 0;

// ---------------------------------------------------------------------------
console.log("\nThe union has not grown behind the label maps");
// ---------------------------------------------------------------------------

check(
  "four statuses, in order",
  JSON.stringify([...AVAILABILITY_STATUSES]) === JSON.stringify([...EXPECTED_STATUSES]),
  [...AVAILABILITY_STATUSES].join(","),
);
check(
  "three modes, in order",
  JSON.stringify([...AVAILABILITY_MODES]) ===
    JSON.stringify(["ladder", "non-ladder-online", "offline"]),
  [...AVAILABILITY_MODES].join(","),
);

// ---------------------------------------------------------------------------
console.log("\nShipped data is structurally complete, in both locales");
// ---------------------------------------------------------------------------

const withAvailability = LOCALES.flatMap((locale) =>
  getRunewords(locale)
    .filter((rw) => rw.availability)
    .map((rw) => ({ locale, slug: rw.slug, availability: rw.availability! })),
);

check(
  "at least one runeword carries an availability block",
  withAvailability.length >= LOCALES.length,
  `${withAvailability.length} across ${LOCALES.length} locales`,
);

for (const { locale, slug, availability } of withAvailability) {
  const problems = checkAvailabilityShape(availability, `${locale} ${slug}`);
  check(
    `${locale} ${slug} — complete`,
    problems.length === 0,
    problems.map((p) => p.message).join(" | "),
  );
}

/*
 * The overlay must actually replace the prose. A pt-BR block that still reads
 * in English passes every structural check and is exactly the failure the
 * `notes` split was introduced to make impossible.
 */
for (const slug of new Set(withAvailability.map((w) => w.slug))) {
  const en = getRuneword("en-us", slug)!.availability!;
  const pt = getRuneword("pt-br", slug)!.availability!;
  const sameRow = AVAILABILITY_MODES.filter((m) => en.notes.rows[m] === pt.notes.rows[m]);
  check(
    `${slug} — pt-BR prose differs from en-US in every mode`,
    sameRow.length === 0,
    sameRow.join(","),
  );
  check(
    `${slug} — pt-BR consequence differs`,
    en.notes.consequence !== pt.notes.consequence,
  );
  check(
    `${slug} — provenance is invariant across locales`,
    en.source === pt.source && en.checked === pt.checked && en.baseline === pt.baseline,
  );
  check(
    `${slug} — statuses are invariant across locales`,
    JSON.stringify(en.rows) === JSON.stringify(pt.rows),
  );
}

// ---------------------------------------------------------------------------
console.log("\nPlanted structural mutations");
// ---------------------------------------------------------------------------

const base = getRuneword("en-us", "mosaic")!.availability!;
const clone = (): Availability => JSON.parse(JSON.stringify(base)) as Availability;

const structural: [string, () => Availability, AvailabilityRule][] = [
  [
    "drop the offline row",
    () => {
      const a = clone();
      a.rows = a.rows.filter((r) => r.mode !== "offline");
      return a;
    },
    "availability-mode-missing",
  ],
  [
    "list ladder twice",
    () => {
      const a = clone();
      a.rows = [...a.rows, { mode: "ladder", status: "craftable" }];
      return a;
    },
    "availability-mode-duplicated",
  ],
  [
    "blank the ladder prose",
    () => {
      const a = clone();
      a.notes.rows.ladder = "";
      return a;
    },
    "availability-notes-missing",
  ],
  [
    "drop the consequence line",
    () => {
      const a = clone();
      a.notes.consequence = "  ";
      return a;
    },
    "availability-notes-missing",
  ],
  [
    "undated check",
    () => {
      const a = clone();
      a.checked = "September 2026";
      return a;
    },
    "availability-provenance-missing",
  ],
  [
    "unsourced block",
    () => {
      const a = clone();
      a.source = "";
      return a;
    },
    "availability-provenance-missing",
  ],
];

for (const [name, mutate, rule] of structural) {
  const problems = checkAvailabilityShape(mutate(), "planted");
  check(`rejects: ${name}`, problems.some((p) => p.rule === rule), problems.map((p) => p.rule).join(","));
}

check(
  "and the unmutated block is silent",
  checkAvailabilityShape(clone(), "control").length === 0,
);

// ---------------------------------------------------------------------------
console.log("\nPlanted prose — the sentences the rest of the internet publishes");
// ---------------------------------------------------------------------------

const WOULD_HAVE_SHIPPED: [string, AvailabilityRule, string][] = [
  [
    "Mosaic is Ladder-only, so plan around a Non-Ladder character.",
    "ladder-only-stated-as-current",
    "Mosaic was Ladder-only from Season 3 through Season 12; on the current baseline it cannot be made on Ladder at all.",
  ],
  [
    "Mosaic is a Non-Ladder runeword.",
    "mode-claim-collapses-craft-and-use",
    "Mosaic cannot be made on Ladder, but a claw made elsewhere can be worn there.",
  ],
  [
    "The Mosaic claw is Non-Ladder only.",
    "mode-claim-collapses-craft-and-use",
    "The Mosaic claw can only be made outside Ladder; wearing one on Ladder is fine.",
  ],
  [
    "Mosaic é exclusiva do Ladder.",
    "ladder-only-stated-as-current",
    "Mosaic não pode ser fabricada no Ladder, mas pode ser usada lá por um personagem transferido.",
  ],
];

for (const [bad, rule, good] of WOULD_HAVE_SHIPPED) {
  check(`rejects: ${bad.slice(0, 64)}`, rejects(bad, rule), checkAvailabilityClaims([bad], "c").map((p) => p.rule).join(","));
  check(
    `accepts the fix: ${good.slice(0, 56)}`,
    silent(good),
    checkAvailabilityClaims([good], "c").map((p) => p.message).join(" | "),
  );
}

/*
 * The eight runewords Patch 3.3 genuinely moved are Non-Ladder in both verbs.
 * A rule that could not tell them from Mosaic would be turned off within a
 * week, so the negative control is as load-bearing as the positives.
 */
check(
  "leaves an ordinary Non-Ladder claim alone",
  silent("Hustle became a Non-Ladder runeword in Patch 3.3."),
);
check(
  "leaves an ordinary Ladder claim alone",
  silent("Bulwark is Ladder-only for this season."),
);

// ---------------------------------------------------------------------------
console.log("\nEvery shipped sentence about the gated item is silent");
// ---------------------------------------------------------------------------

const allStrings = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) allStrings(v, out);
  else if (value && typeof value === "object")
    for (const v of Object.values(value)) allStrings(v, out);
  return out;
};

let sweptPages = 0;
const shippedProblems: string[] = [];
for (const locale of LOCALES) {
  for (const rw of getRunewords(locale)) {
    sweptPages++;
    for (const p of checkAvailabilityClaims(allStrings(rw), `${locale} runeword ${rw.slug}`))
      shippedProblems.push(p.message);
  }
  for (const build of getBuilds(locale)) {
    sweptPages++;
    for (const p of checkAvailabilityClaims(allStrings(build), `${locale} build ${build.slug}`))
      shippedProblems.push(p.message);
  }
}
check(
  `${sweptPages} shipped pages swept, none trips a rule`,
  shippedProblems.length === 0,
  shippedProblems.join(" | "),
);

// ---------------------------------------------------------------------------
console.log("\nBuild gates resolve to something that carries availability");
// ---------------------------------------------------------------------------

for (const locale of LOCALES) {
  const gated = getBuilds(locale).filter((b) => (b.gatedBy ?? []).length > 0);
  for (const build of gated) {
    const problems = checkGates(
      build.gatedBy,
      (slug) => getRuneword(locale, slug)?.availability !== undefined,
      `${locale} ${build.slug}`,
    );
    check(
      `${locale} ${build.slug} — every gate resolves`,
      problems.length === 0,
      problems.map((p) => p.message).join(" | "),
    );
  }
  console.log(`  .. ${gated.length} gated builds in ${locale}`);
}

check(
  "rejects: a gate pointing at a runeword with no availability block",
  checkGates(["spirit"], (slug) => getRuneword("en-us", slug)?.availability !== undefined, "planted")
    .length === 1,
);

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed across ${AVAILABILITY_RULES.length} rules`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("Availability controls all fire.\n");
