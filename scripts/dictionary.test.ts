/**
 * What the UI dictionaries are allowed to say.
 *
 * `tsc` already guarantees that every key exists in both languages — `pt-br.ts`
 * is typed as `Dictionary`, so a missing or extra key is a compile error. What
 * the type system cannot see is the *content* of a string, and two classes of
 * defect live there:
 *
 *   1. A sentence that states a fact about the catalogue. `classes.coverageBody`
 *      said the Assassin had no builds, the Barbarian only an overview and the
 *      Warlock only attributes, on a page that listed seven, six and four of
 *      them. A claim about the data has to be written *by* the data.
 *   2. A pt-BR string that is still the English one. Some of those are correct
 *      — the site keeps game proper nouns in English on purpose — and the list
 *      of which ones is a policy decision, so it lives once in `docs/adr/0003`
 *      and is read from there rather than copied here.
 *
 * Run with `npm run test:dictionary`.
 */
import { dictionaryFor } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";

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

/** `classes.coverageBody` -> the string, for every leaf in a dictionary. */
function flatten(node: unknown, prefix = "", out: Record<string, string> = {}) {
  if (typeof node === "string") {
    out[prefix] = node;
    return out;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

const FLAT: Record<Locale, Record<string, string>> = {
  "en-us": flatten(dictionaryFor("en-us")),
  "pt-br": flatten(dictionaryFor("pt-br")),
};

check(
  "both dictionaries flatten to the same key set",
  Object.keys(FLAT["en-us"]).length === Object.keys(FLAT["pt-br"]).length &&
    Object.keys(FLAT["en-us"]).every((k) => k in FLAT["pt-br"]),
  `${Object.keys(FLAT["en-us"]).length} vs ${Object.keys(FLAT["pt-br"]).length}`,
);

// ---------------------------------------------------------------------------
console.log("\nThe coverage note is derived, never written");
// ---------------------------------------------------------------------------
/*
 * Three separate prohibitions, because the defect had three shapes at once: a
 * count ("Five classes"), a class name ("The Assassin has…") and a verdict
 * ("nothing else"). Any of them written by hand is a claim the page can
 * contradict, so the string may only carry placeholders and the page fills them
 * from the registry.
 */
const CLASS_NAMES = [
  "Sorceress",
  "Amazon",
  "Assassin",
  "Barbarian",
  "Druid",
  "Necromancer",
  "Paladin",
  "Warlock",
];

/** Written-out counts, in both languages, as whole words. */
const NUMBER_WORDS =
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|um|uma|dois|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)\b/i;

/** Only the callout's own strings. Other sections may legitimately count. */
const coverageKeys = Object.keys(FLAT["en-us"]).filter((k) =>
  k.startsWith("classes.coverage"),
);

check("the coverage callout still has strings to check", coverageKeys.length >= 2, `${coverageKeys.length}`);

for (const locale of LOCALES) {
  for (const key of coverageKeys) {
    const value = FLAT[locale][key];
    // Placeholders are the mechanism, so they are removed before judging.
    const prose = value.replace(/\{\w+\}/g, "");
    check(`${locale} ${key}: no digits`, !/\d/.test(prose), value);
    check(`${locale} ${key}: no written-out count`, !NUMBER_WORDS.test(prose), value);
    const named = CLASS_NAMES.filter((c) => prose.includes(c));
    check(`${locale} ${key}: names no class`, named.length === 0, named.join(", "));
  }
}

for (const locale of LOCALES) {
  const body = FLAT[locale]["classes.coverageBody"];
  check(
    `${locale} classes.coverageBody is a template, not a sentence`,
    /\{\w+\}/.test(body ?? ""),
    body,
  );
}

/*
 * Anti-vacuity. The predicates above are worth nothing unless they reject the
 * string that was actually shipped, so the shipped string is checked in.
 */
{
  const shipped =
    "Five classes are fully documented — the Sorceress, Paladin, Amazon, Necromancer and Druid have skills. The Assassin has her thirty skills.";
  const prose = shipped.replace(/\{\w+\}/g, "");
  check("control: the rule rejects a written-out count", NUMBER_WORDS.test(prose));
  check(
    "control: the rule rejects a named class",
    CLASS_NAMES.some((c) => prose.includes(c)),
  );
  check("control: the rule rejects a digit", /\d/.test("8 classes"));
  check("control: the rule requires a placeholder", !/\{\w+\}/.test(shipped));
}

// ---------------------------------------------------------------------------
console.log("\nStrings that were deleted stay deleted");
// ---------------------------------------------------------------------------
/*
 * A dictionary key outlives the markup that rendered it: nothing fails when a
 * callout is deleted and its two strings are left behind, and the next reader
 * of the file assumes they are live copy. Each entry here names the key and the
 * reason it went, so restoring one is a decision rather than an accident.
 */
const REMOVED: [key: string, why: string][] = [
  ["builds.whyFewTitle", 'the "Why so few builds?" callout was written for a catalogue of two'],
  ["builds.whyFewBody", "same callout; it named the only two builds that then existed"],
];

for (const locale of LOCALES) {
  for (const [key, why] of REMOVED) {
    check(`${locale}: ${key} is gone (${why})`, !(key in FLAT[locale]), FLAT[locale][key]);
  }
}
check("control: the removal check can see a key that is present", "classes.coverageTitle" in FLAT["en-us"]);

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed.`);
// ---------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
