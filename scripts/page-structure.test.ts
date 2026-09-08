/**
 * Structural promises the prerendered HTML has to keep, on every page.
 *
 * Two of them, and both were broken by the same kind of mistake: markup that
 * renders whether or not it has anything to say.
 *
 *   1. **No heading over nothing.** `/builds` shipped the heading "Classes
 *      awaiting build guides" above an empty list on every visit, in both
 *      languages, because the section had no `.length > 0` guard — the one
 *      `leveling/page.tsx` has. A reader is told a list exists and finds none.
 *   2. **The coverage note is the catalogue's own arithmetic.** `/classes`
 *      claimed three classes had no builds while the page listed seventeen of
 *      them. The dictionary gate keeps counts out of the string; this one
 *      checks that the numbers the page actually prints are the numbers the
 *      registry holds.
 *
 * Requires `npm run build`. Run with `npm run test:structure`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { dictionaryFor, fmt } from "../lib/i18n";
import { LOCALES } from "../lib/i18n/config";
import { getBuilds, getClasses, getJourneys } from "../lib/registry";
import { hasSkillPages } from "../lib/skills";

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

const pathOf = (file: string) =>
  "/" + relative(root, file).split(sep).join("/").replace(/\.html$/, "");

/** The RSC payload rides inside <script>; it is source, not rendered output. */
const withoutScripts = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");

const visible = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&middot;/g, "·")
    .replace(/&#x2011;/g, "-")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Every `<section>` in a document, as its inner HTML.
 *
 * A regex cannot do this: sections nest, and `[\s\S]*?` would close the outer
 * one on the inner one's tag. Counting depth over the tag stream can.
 */
export function sectionBodies(html: string): string[] {
  const bodies: string[] = [];
  const tag = /<section\b[^>]*>|<\/section>/g;
  const opens: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = tag.exec(html)) !== null) {
    if (match[0].startsWith("</")) {
      const start = opens.pop();
      if (start !== undefined) bodies.push(html.slice(start, match.index));
    } else {
      opens.push(match.index + match[0].length);
    }
  }
  return bodies;
}

/**
 * What is left of a section once its own heading block is removed.
 *
 * `Section` renders the title and description inside a single `<div class="mb-4">`
 * with no nested div, so the first non-greedy close is that block's.
 */
export function sectionRemainder(body: string): string {
  const heading = /^\s*<div class="mb-4">[\s\S]*?<\/div>/;
  return body.replace(heading, "");
}

// ---------------------------------------------------------------------------
console.log(`\nNo section is a heading over nothing (${htmlFiles.length} pages)`);
// ---------------------------------------------------------------------------
{
  let sections = 0;
  const empty: string[] = [];
  const emptyLists: string[] = [];
  for (const file of htmlFiles) {
    const body = withoutScripts(readFileSync(file, "utf8"));
    for (const section of sectionBodies(body)) {
      sections++;
      const rest = sectionRemainder(section);
      if (visible(rest) === "" && !/<(img|svg|input|hr|table)\b/.test(rest)) {
        const title = visible(section).slice(0, 60);
        empty.push(`${pathOf(file)} → “${title}”`);
      }
    }
    // The shape the orphan heading actually took: a list element with no items.
    for (const m of body.matchAll(/<(ul|ol|dl|tbody)\b[^>]*>\s*<\/\1>/g)) {
      emptyLists.push(`${pathOf(file)} → <${m[1]}>`);
    }
  }
  check("there are sections to inspect", sections > 500, `${sections}`);
  check("no section renders a heading with no content", empty.length === 0, empty.slice(0, 5).join("; "));
  check("no empty list, table body or definition list", emptyLists.length === 0, emptyLists.slice(0, 5).join("; "));
}

/*
 * Anti-vacuity: the scanners are run over synthetic markup that carries each
 * defect, so a change that makes them blind fails here rather than silently.
 */
{
  const orphan =
    '<section class="scroll-mt-24"><div class="mb-4"><h2>Classes awaiting build guides</h2></div><ul class="flex"></ul></section>';
  const bodies = sectionBodies(orphan);
  check("control: the parser finds one section in the sample", bodies.length === 1, `${bodies.length}`);
  check("control: the sample's section reads as empty", visible(sectionRemainder(bodies[0] ?? "")) === "");
  check("control: the sample's empty list is detected", /<(ul|ol|dl|tbody)\b[^>]*>\s*<\/\1>/.test(orphan));

  const nested =
    '<section><div class="mb-4"><h2>Outer</h2></div><section><div class="mb-4"><h2>Inner</h2></div>text</section>more</section>';
  check("control: nesting does not truncate the outer section", sectionBodies(nested).length === 2);
  const full = '<section><div class="mb-4"><h2>T</h2></div><p>Something</p></section>';
  check(
    "control: a section with content is not reported",
    visible(sectionRemainder(sectionBodies(full)[0] ?? "")) === "Something",
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe coverage note prints the catalogue's own numbers");
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  const t = dictionaryFor(locale);
  const classes = getClasses(locale);
  const builds = getBuilds(locale);
  const journeys = getJourneys(locale);
  const expected = fmt(t.classes.coverageBody, {
    skills: classes.filter((c) => hasSkillPages(c.slug)).length,
    total: classes.length,
    leveling: new Set(journeys.map((j) => j.classSlug)).size,
    builds: new Set(builds.map((b) => b.classSlug)).size,
    buildCount: fmt(
      builds.length === 1 ? t.classes.buildsCount : t.classes.buildsCountPlural,
      { count: builds.length },
    ),
  });
  const html = readFileSync(join(root, locale, "classes.html"), "utf8");
  const text = visible(withoutScripts(html));
  check(`${locale}: /classes renders the derived coverage sentence`, text.includes(expected), expected.slice(0, 80));
  check(
    `${locale}: the sentence carries no unfilled placeholder`,
    !/\{(skills|total|leveling|builds|buildCount|count)\}/.test(expected),
    expected,
  );
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed.`);
// ---------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
