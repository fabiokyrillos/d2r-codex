/**
 * What a skill page *says* — checked against the HTML `next build` wrote.
 *
 * The damage section is here because one sentence covering every skill without
 * an elemental table shipped a falsehood: Zeal, Smite, Charge, Sacrifice,
 * Vengeance, Conversion and Static Field all told the reader they dealt no
 * direct damage. Zeal, Smite and Vengeance are the core attacks of three
 * documented builds, so the claim was wrong exactly where it mattered most.
 *
 * The dictionary alone cannot prove this. A correct set of strings wired to the
 * wrong branch reads perfectly in the dictionary and still ships the old
 * sentence, so every assertion below reads the rendered page.
 *
 * Requires `npm run build`. Run with `npm run test:page`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { dictionaryFor } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getSkills } from "../lib/registry";
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { damagePresentation, type DamagePresentation } from "../lib/skills";

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

/*
 * `D2R_BUILD_ROOT` points the test at a different tree of prerendered HTML.
 * It exists so a planted control can copy the build, corrupt one page and prove
 * this test fails — without editing a tracked file and without a second
 * `next build`. Unset, it is the build in the working directory.
 */
const root = process.env.D2R_BUILD_ROOT ?? join(process.cwd(), ".next", "server", "app");
if (!existsSync(root)) {
  console.error(`  ${root} is missing — run \`npm run build\` first.`);
  process.exit(1);
}

/** Visible text only: the RSC payload legitimately carries every source string. */
const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x2014;/g, "—")
    .replace(/\s+/g, " ");

const pageFor = (locale: Locale, classSlug: string, skillSlug: string) =>
  join(root, locale, "classes", classSlug, "skills", `${skillSlug}.html`);

/**
 * A short, distinctive fragment of each message, taken from the dictionary so
 * the test cannot drift from the copy — but long enough that it cannot match by
 * accident. Interpolation placeholders are stripped first.
 */
function marker(template: string): string {
  const plain = template.replace(/\{[a-z]+\}/gi, "").replace(/\s+/g, " ").trim();
  return plain.slice(0, 60);
}

const skills = getSkills("en-us");

// ===========================================================================
console.log("\nEvery skill falls into exactly one damage presentation");
// ===========================================================================
const buckets: Record<DamagePresentation, string[]> = {
  table: [],
  weapon: [],
  proportional: [],
  none: [],
};
for (const s of skills) {
  const node = SKILL_GRAPH[s.slug];
  if (node) buckets[damagePresentation(s, node)].push(s.slug);
}
for (const kind of Object.keys(buckets) as DamagePresentation[]) {
  check(
    `the "${kind}" bucket is not empty`,
    buckets[kind].length > 0,
    `${buckets[kind].length} skills`,
  );
}
check(
  "the six weapon attacks are exactly the attack-kind skills",
  buckets.weapon.length === 6 &&
    ["sacrifice", "smite", "zeal", "charge", "vengeance", "conversion"].every((s) =>
      buckets.weapon.includes(s),
    ),
  buckets.weapon.join(", "),
);
check(
  "Static Field is the proportional skill",
  buckets.proportional.length === 1 && buckets.proportional[0] === "static-field",
  buckets.proportional.join(", "),
);

for (const locale of LOCALES) {
  const t = dictionaryFor(locale).skills;
  const WEAPON = marker(t.noProgressionWeapon);
  const PROPORTIONAL = marker(t.noProgressionProportional);
  const NONE = marker(t.noProgressionNone);

  // =========================================================================
  console.log(`\n${locale}: the damage section says the right thing`);
  // =========================================================================

  check(
    `${locale}: the three messages are distinct`,
    new Set([WEAPON, PROPORTIONAL, NONE]).size === 3,
  );

  const read = (slug: string): string | null => {
    const skill = skills.find((s) => s.slug === slug)!;
    const path = pageFor(locale, skill.classSlug, slug);
    return existsSync(path) ? visible(readFileSync(path, "utf8")) : null;
  };

  // --- weapon attacks ------------------------------------------------------
  let weaponOk = 0;
  let weaponClaimsNoDamage = 0;
  for (const slug of buckets.weapon) {
    const text = read(slug);
    if (text === null) {
      check(`${locale}: ${slug} page exists`, false);
      continue;
    }
    if (text.includes(WEAPON)) weaponOk++;
    if (text.includes(NONE) || text.includes(PROPORTIONAL)) weaponClaimsNoDamage++;
  }
  check(
    `${locale}: all ${buckets.weapon.length} weapon attacks carry the weapon message`,
    weaponOk === buckets.weapon.length,
    `${weaponOk}/${buckets.weapon.length}`,
  );
  check(
    `${locale}: no weapon attack carries the no-damage or proportional message`,
    weaponClaimsNoDamage === 0,
    `${weaponClaimsNoDamage} pages`,
  );

  // --- the claim that must never appear on an attack page ------------------
  // Independent of which branch rendered: an `attack` skill may not tell the
  // reader it deals no damage, however that sentence is worded.
  // Both the sentence that shipped ("deals no direct damage") and the one that
  // replaced it ("has no direct damage table"). Either is wrong on an attack
  // page, and matching both means the guard survives a rewording of the copy.
  const forbidden: Record<Locale, RegExp> = {
    "en-us": /deals no direct damage|no direct damage table/i,
    "pt-br": /não causa dano direto|não tem tabela de dano direto/i,
  };
  const offenders: string[] = [];
  for (const slug of buckets.weapon) {
    const text = read(slug);
    if (text && forbidden[locale].test(text)) offenders.push(slug);
  }
  check(
    `${locale}: no kind:"attack" page claims the skill deals no damage`,
    offenders.length === 0,
    offenders.join(", "),
  );

  // Anti-vacuity: the forbidden pattern must be capable of matching something,
  // or the check above passes for the wrong reason.
  const noneSample = read(buckets.none[0]);
  check(
    `${locale}: the forbidden pattern does match a genuine no-damage page`,
    Boolean(noneSample && forbidden[locale].test(noneSample)),
    buckets.none[0],
  );

  // --- Static Field --------------------------------------------------------
  const staticField = read("static-field");
  check(`${locale}: Static Field page exists`, staticField !== null);
  check(
    `${locale}: Static Field carries the proportional message`,
    Boolean(staticField && staticField.includes(PROPORTIONAL)),
  );
  check(
    `${locale}: Static Field carries neither of the other two messages`,
    Boolean(staticField && !staticField.includes(WEAPON) && !staticField.includes(NONE)),
  );
  check(
    `${locale}: Static Field still points at its verified mechanics`,
    Boolean(staticField && staticField.includes(dictionaryFor(locale).skills.mechanicsTitle)),
  );

  // --- auras, buffs, passives ---------------------------------------------
  let noneOk = 0;
  for (const slug of buckets.none) {
    const text = read(slug);
    if (text && text.includes(NONE)) noneOk++;
  }
  check(
    `${locale}: all ${buckets.none.length} no-damage skills carry the no-damage message`,
    noneOk === buckets.none.length,
    `${noneOk}/${buckets.none.length}`,
  );
  check(
    `${locale}: at least one aura or passive carries it`,
    buckets.none.some((slug) => {
      const s = skills.find((x) => x.slug === slug)!;
      return s.kind === "aura" || s.kind === "passive";
    }) && noneOk > 0,
  );

  // --- skills that do have a table ----------------------------------------
  let tableOk = 0;
  for (const slug of buckets.table) {
    const text = read(slug);
    if (text && !text.includes(WEAPON) && !text.includes(PROPORTIONAL) && !text.includes(NONE))
      tableOk++;
  }
  check(
    `${locale}: no skill with a real damage table carries any absence message`,
    tableOk === buckets.table.length,
    `${tableOk}/${buckets.table.length}`,
  );
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
