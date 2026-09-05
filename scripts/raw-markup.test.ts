/**
 * No editorial markup may reach the page as literal text.
 *
 * Content in `content/` is plain TypeScript that carries a tiny amount of
 * inline emphasis. Every place that renders such a string has to pass it
 * through `RichText`; a plain `{value}` prints the asterisks. That is not a
 * theoretical risk — the skill tree's contextual panel shipped rendering
 * "**A variante para Uber Tristram...**" verbatim, and it was found by looking
 * at the page, not by any check.
 *
 * So this reads the HTML `next build` wrote and asserts two things at once:
 * no marker survives as text, and the corresponding semantic element is
 * actually present. Only asserting the first would pass a page that simply
 * stripped the emphasis.
 *
 * Requires `npm run build`. Run with `npm run test:markup`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";

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

const htmlFiles: string[] = [];
(function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) htmlFiles.push(full);
  }
})(root);

/**
 * Visible text only. The RSC payload rides along inside <script> tags and
 * legitimately contains the unrendered source strings, so scripts, styles and
 * attributes all have to go before anything is judged.
 */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

/**
 * `+skills`, `2*3` and a lone asterisk are not markup. Only paired markers
 * count, matched the same way RichText matches them.
 */
const MARKERS: [string, RegExp][] = [
  ["bold", /\*\*[^*]+\*\*/],
  ["italic", /(?<!\*)\*[^*\s][^*]*\*(?!\*)/],
  ["code", /`[^`]+`/],
  ["markdown link", /\[[^\]]+\]\([^)]+\)/],
];

console.log(`\nScanning ${htmlFiles.length} prerendered pages`);

const offenders: Record<string, string[]> = {};
for (const file of htmlFiles) {
  const text = visibleText(readFileSync(file, "utf8"));
  for (const [name, re] of MARKERS) {
    const hit = text.match(re);
    if (hit) {
      (offenders[name] ??= []).push(
        `${file.slice(root.length + 1)}: ${hit[0].slice(0, 60)}`,
      );
    }
  }
}

for (const [name] of MARKERS) {
  const found = offenders[name] ?? [];
  check(
    `no raw ${name} marker on any page`,
    found.length === 0,
    `${found.length} pages, e.g. ${found.slice(0, 2).join(" | ")}`,
  );
}

// ===========================================================================
console.log("\nPoint counts are pluralised on every page");
// ===========================================================================

/*
 * "1 pts" was a shared-component defect: one template, three call sites, every
 * class and both locales. The wording is centralised now, so the check is a
 * sweep of the whole prerendered site rather than a spot check of the pages
 * that happened to be looked at.
 *
 * "1 pontos" is the pt-BR half of the same bug, and would be what a naive
 * `{points} pontos` template produces.
 */
const BAD_PLURALS = ["1 pts", "1 points", "1 pontos", "1 ponto s"];
{
  /*
   * Anchored on a word boundary, because a substring match calls "41 points"
   * the defect. Nothing rendered a count ending in 1 until a build page printed
   * the cost of a forty-one point package, and then this failed on correct
   * English — the failure a check has to be trusted not to produce.
   *
   * `\b` before the digit is what does it: it matches at the start of "1" only
   * when what precedes is not a digit or letter.
   */
  const patterns = BAD_PLURALS.map(
    (bad) => [bad, new RegExp(String.raw`\b${bad.replace(/ /g, String.raw`\s`)}`)] as const,
  );
  const hits: Record<string, string[]> = {};
  for (const file of htmlFiles) {
    const text = visibleText(readFileSync(file, "utf8"));
    for (const [bad, pattern] of patterns) {
      if (pattern.test(text)) (hits[bad] ??= []).push(file.slice(root.length + 1));
    }
  }
  for (const bad of BAD_PLURALS) {
    const found = hits[bad] ?? [];
    check(
      `no "${bad}" on any of the ${htmlFiles.length} pages`,
      found.length === 0,
      `${found.length} pages, e.g. ${found.slice(0, 3).join(" | ")}`,
    );
  }

  // The state label used to restate the count it sits beside, so a one-point
  // tile read "One point / 1 point" and its fallback "1 point . One point".
  // Swept site-wide because the tile, the panel and the fallback each compose
  // the pair differently.
  const REDUNDANT = [
    "One point 1 point",
    "1 point \u00b7 One point",
    "Um ponto 1 ponto",
    "1 ponto \u00b7 Um ponto",
  ];
  for (const bad of REDUNDANT) {
    const found = htmlFiles.filter((f) => visibleText(readFileSync(f, "utf8")).includes(bad));
    check(
      `no "${bad}" on any of the ${htmlFiles.length} pages`,
      found.length === 0,
      `${found.length} pages, e.g. ${found.slice(0, 3).join(" | ")}`,
    );
  }

  // The positive half: the singular has to actually appear, or the checks
  // above would pass on a site that stopped rendering point counts at all.
  const singular = { "en-us": "1 point", "pt-br": "1 ponto" } as const;
  for (const [locale, want] of Object.entries(singular)) {
    const pages = htmlFiles.filter(
      (f) =>
        f.startsWith(join(root, locale)) &&
        visibleText(readFileSync(f, "utf8")).includes(want),
    );
    check(`"${want}" is rendered somewhere in ${locale}`, pages.length > 0, `${pages.length} pages`);
  }

  /*
   * The word boundary is a loosening, and a loosening has to prove it did not
   * loosen past the defect. Two planted strings: the bug the sweep exists for,
   * and the correct sentence it used to fail on.
   */
  for (const [bad, pattern] of patterns) {
    check(`the "${bad}" sweep still catches "${bad}" in a sentence`, pattern.test(`spends ${bad}.`));
    check(
      `and no longer calls "4${bad}" a defect`,
      !pattern.test(`spends 4${bad}.`),
    );
  }
}

// ===========================================================================
console.log("\nEmphasis survives as semantic elements");
// ===========================================================================

/*
 * The other half of the contract. Stripping the markers would satisfy the
 * checks above and quietly destroy the author's emphasis, so these pages must
 * still carry the elements the markers stand for.
 */
const semantic: [string, string, RegExp][] = [
  ["build page", "en-us/builds/paladin/hammerdin.html", /<strong[^>]*>/],
  ["build page pt-BR", "pt-br/builds/paladin/hammerdin.html", /<strong[^>]*>/],
  ["class page", "en-us/classes/paladin.html", /<strong[^>]*>/],
  ["sorceress build page", "en-us/builds/sorceress/blizzard-sorceress.html", /<strong[^>]*>/],
  ["sorceress build page pt-BR", "pt-br/builds/sorceress/blizzard-sorceress.html", /<strong[^>]*>/],
  ["sorceress class page", "en-us/classes/sorceress.html", /<strong[^>]*>/],
  /*
   * Class pages only for the Amazon. This half asserts that a page whose source
   * uses emphasis still renders it, so it is meaningful only where the source
   * has some — and the Amazon's skill prose happens to use none. Adding markers
   * to content in order to satisfy a test would invert what the test is for.
   * Her sixty skill pages are covered by the sweep above, which reads every
   * prerendered page for markers that leaked as literal text.
   */
  ["amazon class page", "en-us/classes/amazon.html", /<strong[^>]*>/],
  ["amazon class page pt-BR", "pt-br/classes/amazon.html", /<strong[^>]*>/],
  ["runeword with inline code", "en-us/runewords/beast.html", /<code[^>]*>/],
  ["runeword with inline code pt-BR", "pt-br/runewords/beast.html", /<code[^>]*>/],
];
for (const [label, file, re] of semantic) {
  const path = join(root, file);
  if (!existsSync(path)) {
    check(`${label}: page exists`, false, file);
    continue;
  }
  check(`${label}: renders ${re.source.slice(1, 8)} elements`, re.test(readFileSync(path, "utf8")));
}

// Emphasis inside a skill tree panel specifically: the defect's origin.
{
  const html = readFileSync(join(root, "pt-br/builds/paladin/hammerdin.html"), "utf8");
  // Panel bodies are serialized into the RSC payload rather than the initial
  // HTML, and the payload is JSON escaped inside a <script>, so an element
  // reads as \"strong\" there. Asserting on the sentence that shipped broken
  // keeps this specific rather than a shape check that could drift.
  const payload = (html.match(/<script[\s\S]*?<\/script>/g) ?? []).join(" ");
  const sentence = "A variante para Uber Tristram";
  const i = payload.indexOf(sentence);
  check("the panel sentence that shipped broken is in the payload", i > -1);
  check(
    "and it is inside a strong element, not surrounded by asterisks",
    i > -1 &&
      /\\"strong\\"/.test(payload.slice(Math.max(0, i - 200), i)) &&
      !payload.slice(Math.max(0, i - 40), i).includes("**"),
    payload.slice(Math.max(0, i - 90), i + 40),
  );
}

// A literal that must never be mistaken for markup.
{
  const files = ["en-us/builds/paladin/hammerdin.html", "pt-br/builds/paladin/hammerdin.html"];
  for (const f of files) {
    const text = visibleText(readFileSync(join(root, f), "utf8"));
    check(`${f}: "+skills" survives intact`, text.includes("+skills"));
  }
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
