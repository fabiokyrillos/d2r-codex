/**
 * The build page's table of contents, as the *served* HTML carries it.
 *
 * R-BUILD-8 asks for one thing that is easy to say and easy to get subtly
 * wrong: every section of an 18,344px page reachable from one place, in both
 * languages, before a line of JavaScript runs. The failures that shape this
 * gate are all failures that look fine:
 *
 *   - **A dead anchor.** Three of the eleven sections are conditional in the
 *     source — `levelingPath`, `immunityPlan` and a mercenary — and all three
 *     are populated in all 53 builds today. A summary that lists eleven names
 *     would therefore agree with the site right up to the day a build arrives
 *     without an immunity plan, and then publish a link that lands nowhere.
 *     That is defect D2's exact shape, so **nothing here counts to eleven**:
 *     every assertion compares the entries against the sections that document
 *     actually rendered.
 *   - **An entry that stops matching its heading.** The label and the heading
 *     come from the same dictionary value, and both ends are checked, so a
 *     summary cannot come to call a section something the section does not.
 *   - **A heading in the summary.** `scripts/heading-snapshot.json` pins the
 *     ordered `h2`/`h3` list of all 106 build pages; one `<h2>` in here fails
 *     every page at once, and the failure would arrive as 106 red lines in an
 *     unrelated gate rather than as one line here.
 *   - **A promise the served page cannot keep.** The active tier's name exists
 *     only once JavaScript has read the six disclosures. It must not be in the
 *     HTML, and neither must any of the preference strings the tier picker
 *     draws only after a preference exists.
 *
 *   - **A height that only settles after hydration.** The summary used to ship
 *     `open` and be collapsed under 640px by a layout effect. Every rule below
 *     was green throughout, because every rule below reads markup — and the
 *     defect was 124px of movement arriving mid-flight in the browser's smooth
 *     scroll to a fragment, which put `#gear-budget` 52px behind the sticky
 *     header at 390px. So the served element must now be **closed**, and §4b
 *     pins the CSS that makes closed still mean visible from 640px.
 *
 * It reads files rather than driving a browser — the same trade
 * `build-tiers-html.test.ts` makes, and for the same reason: breadth. All 53
 * builds in both languages, rather than the one page a headless gate has time
 * for. What it therefore cannot see is whether any of it is *visible*, which is
 * a fact about laid-out boxes after CSS. That gap is why §4b reads
 * `app/globals.css` at source: no browser gate covers this control, and a
 * `display: none` on the trigger that outlived the rule revealing the panel
 * would empty the row on all 106 pages with every markup rule still green.
 *
 * Requires `npm run build`. Run with `npm run test:build-toc-html`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { dictionaryFor, type Dictionary } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getBuilds } from "../lib/registry";

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

const repo = process.cwd();
const root = assertFreshBuild();

const pageFor = (locale: Locale, classSlug: string, slug: string) =>
  join(root, locale, "builds", classSlug, `${slug}.html`);

/** Rendered markup only. The RSC payload rides in a <script> and is not the page. */
const markup = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&middot;/g, "·")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();

// ---------------------------------------------------------------------------
// Parsing, kept pure so the synthetic controls below exercise the same code
// ---------------------------------------------------------------------------

/**
 * The summary's own subtree, depth-counted rather than lazily regexed.
 *
 * `data-sections=` and not `data-sections`, because the panel inside it is
 * `data-sections-panel` and `\b` treats the hyphen as a boundary — a word-break
 * match would find whichever came first and be right by luck.
 */
export function sectionsSubtree(html: string): { open: string; body: string } | undefined {
  const opening = /<details\b[^>]*\bdata-sections=[^>]*>/.exec(html);
  if (!opening) return undefined;
  const from = opening.index + opening[0].length;
  const step = /<details\b[^>]*>|<\/details>/g;
  step.lastIndex = from;
  let depth = 1;
  let hit: RegExpExecArray | null;
  while ((hit = step.exec(html)) !== null) {
    depth += hit[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return { open: opening[0], body: html.slice(from, hit.index) };
  }
  return undefined;
}

/** The `<a href="#…">` entries of a subtree, in document order, with their text. */
export function entriesOf(subtree: string): { href: string; text: string }[] {
  return [...subtree.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: m[1],
    text: decode(m[2]),
  }));
}

/** The ids of the `<section id="…">` elements a document rendered, in order. */
export function renderedSectionIds(html: string): string[] {
  return [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
}

/**
 * The text of the first `<h2>` inside the section carrying `id`.
 *
 * Depth-counted: `#gear` contains a nested `<section>` per tier, and a lazy
 * match would close the outer one on the first inner tag.
 */
export function sectionHeading(html: string, id: string): string | undefined {
  const opening = new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>`).exec(html);
  if (!opening) return undefined;
  const from = opening.index + opening[0].length;
  const step = /<section\b[^>]*>|<\/section>/g;
  step.lastIndex = from;
  let depth = 1;
  let hit: RegExpExecArray | null;
  while ((hit = step.exec(html)) !== null) {
    depth += hit[0].startsWith("</") ? -1 : 1;
    if (depth === 0) {
      const body = html.slice(from, hit.index);
      const h2 = /<h2\b[^>]*>([\s\S]*?)<\/h2>/.exec(body);
      return h2 ? decode(h2[1]) : undefined;
    }
  }
  return undefined;
}

/**
 * Everything wrong with one document's summary.
 *
 * One function, returning a list of complaints, so the synthetic controls at
 * the bottom can hand it a page that is deliberately broken and require that it
 * says so. A checker that is only ever run over correct input is not a checker.
 */
export function problemsWith(html: string, labelFor: Record<string, string>): string[] {
  const bad: string[] = [];
  const found = sectionsSubtree(html);
  if (!found) return ["no [data-sections] summary in the document"];
  const { open, body } = found;

  /*
   * Served **closed**, which is the opposite of what this rule used to say.
   *
   * Shipping `open` and collapsing under 640px from a layout effect was a
   * height change after hydration, and hydration lands mid-flight in the
   * browser's smooth scroll to a fragment. Measured at 390px: this element went
   * 162px → 38px and `#gear-budget` landed 124px late, at −52px, behind the
   * sticky header. R-BUILD-8 is now kept without a height change at all — CSS
   * reveals `::details-content` from 640px on a disclosure that stays closed,
   * and below it the native `<summary>` opens it — so the attribute that used
   * to be required is now forbidden.
   *
   * Matched as its own attribute rather than as `\bopen\b`, which the hyphen in
   * a `group-open:` utility would satisfy from inside a class list.
   */
  if (/\sopen(=|\s|>|\/)/.test(open)) bad.push("the summary ships open");
  if ((html.match(/\bdata-sections=/g) ?? []).length !== 1) bad.push("more than one summary");

  // Landmark, list, links — the shape §11 names, and no shortcut around it.
  const nav = /<nav\b[^>]*\baria-label="([^"]+)"[^>]*>/.exec(body);
  if (!nav) bad.push("the summary is not a <nav> with an aria-label");
  if (!/<ol\b/.test(body)) bad.push("the entries are not an <ol>");

  const entries = entriesOf(body);
  const listItems = (body.match(/<li\b/g) ?? []).length;
  if (listItems !== entries.length) bad.push(`${listItems} <li> for ${entries.length} links`);

  // The three tripwires.
  if (/<h[23]\b/.test(body)) bad.push("the summary carries an <h2> or <h3>");
  if (/\baria-current=/.test(body)) bad.push("the summary carries aria-current");
  if (/\baria-expanded=/.test(body)) bad.push("the trigger hand-writes aria-expanded");
  if (!/<summary\b/.test(body + open)) bad.push("there is no native <summary>");

  // Every href is a bare fragment. `?` would mean a query parameter came back.
  for (const { href } of entries) {
    if (!/^#[a-z0-9-]+$/.test(href)) bad.push(`href is not a bare fragment: ${href}`);
  }

  const ids = entries.map((e) => e.href.replace(/^#/, ""));
  const rendered = renderedSectionIds(html);

  // Entries == sections rendered in *this* document. Never a literal count.
  const missing = rendered.filter((id) => !ids.includes(id));
  const dangling = ids.filter((id) => !rendered.includes(id));
  if (dangling.length) bad.push(`entry points at no rendered section: ${dangling.join(", ")}`);
  if (missing.length) bad.push(`rendered section with no entry: ${missing.join(", ")}`);
  if (ids.length !== rendered.length) {
    bad.push(`${ids.length} links for ${rendered.length} rendered sections`);
  }

  // …and in the order the sections appear, so the list reads as the page reads.
  const order = rendered.filter((id) => ids.includes(id));
  if (order.join(",") !== ids.filter((id) => rendered.includes(id)).join(",")) {
    bad.push(`entries are out of document order: [${ids.join(",")}] vs [${rendered.join(",")}]`);
  }

  // Each id resolves once. Two elements with one id is a fragment that is a
  // coin toss, and the browser will not say so.
  for (const id of ids) {
    const uses = (html.match(new RegExp(`\\bid="${id}"`, "g")) ?? []).length;
    if (uses !== 1) bad.push(`id="${id}" appears ${uses} times`);
  }

  // Label == the target's own heading == the dictionary value. Both ends, so
  // neither can drift into agreeing with itself.
  for (const { href, text } of entries) {
    const id = href.replace(/^#/, "");
    const expected = labelFor[id];
    if (expected === undefined) {
      bad.push(`no dictionary label is declared for #${id}`);
      continue;
    }
    if (text !== expected) bad.push(`#${id} reads “${text}”, dictionary says “${expected}”`);
    const heading = sectionHeading(html, id);
    if (heading !== undefined && heading !== expected) {
      bad.push(`#${id}'s heading reads “${heading}”, dictionary says “${expected}”`);
    }
  }

  // Nothing but the link inside each row: the active tier's name is a fact
  // about the six disclosures, which the served page has not read.
  for (const item of body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)) {
    const text = decode(item[1]);
    if (!entries.some((e) => e.text === text)) bad.push(`a row carries extra text: “${text}”`);
  }

  return bad;
}

// ---------------------------------------------------------------------------

const allBuilds = LOCALES.flatMap((locale) =>
  getBuilds(locale).map((b) => ({
    locale,
    classSlug: String(b.classSlug),
    slug: String(b.slug),
  })),
);

console.log(`\nsweeping ${allBuilds.length} build pages (${LOCALES.length} locales)\n`);

/**
 * The heading each id must carry, by dictionary value rather than by copy.
 *
 * Read through `unknown` where the key lands with the UI rather than with this
 * test: a missing key is a real failure and is asserted below, not defaulted
 * away, because an empty expected string would make every comparison vacuous.
 */
function labelsFor(locale: Locale): Record<string, string> {
  const t = dictionaryFor(locale) as Dictionary;
  return {
    "how-it-plays": t.builds.howItPlays,
    "at-a-glance": t.builds.atAGlance,
    strengths: t.classes.strengthsWeaknesses,
    "getting-there": t.builds.gettingThere,
    skills: t.builds.skills,
    stats: t.builds.stats,
    breakpoints: t.classes.breakpointsTitle,
    immunities: t.builds.immunities,
    gear: t.builds.gearProgression,
    mercenary: t.builds.mercenary,
    farming: t.builds.whereToFarm,
  };
}

for (const locale of LOCALES) {
  const labels = labelsFor(locale);
  const blank = Object.entries(labels).filter(([, v]) => typeof v !== "string" || !v);
  check(
    `${locale}: every section label is a real dictionary string`,
    blank.length === 0,
    blank.map(([k]) => k).join(", "),
  );
}

// ---------------------------------------------------------------------------
// 1. The summary, on every build page in both languages
// ---------------------------------------------------------------------------

{
  const missingPage: string[] = [];
  const complaints: string[] = [];
  let inspected = 0;
  let entriesSeen = 0;

  for (const { locale, classSlug, slug } of allBuilds) {
    const file = pageFor(locale, classSlug, slug);
    if (!existsSync(file)) {
      missingPage.push(`${locale}/${classSlug}/${slug}`);
      continue;
    }
    const html = markup(readFileSync(file, "utf8"));
    const bad = problemsWith(html, labelsFor(locale));
    inspected++;
    entriesSeen += entriesOf(sectionsSubtree(html)?.body ?? "").length;
    for (const problem of bad) complaints.push(`${locale}/${slug}: ${problem}`);
  }

  check("every build page was written", missingPage.length === 0, missingPage.slice(0, 3).join(" | "));
  check(`all ${inspected} pages carry a well-formed summary`, complaints.length === 0,
    complaints.slice(0, 5).join(" | "));
  /*
   * Anti-vacuity for the sweep itself. `problemsWith` returns an empty list for
   * a document with no links at all as easily as for a correct one, so the
   * count of entries it actually looked at is asserted rather than assumed.
   */
  check("…and the sweep did read entries, rather than nothing", entriesSeen > inspected * 8,
    `${entriesSeen} entries over ${inspected} pages`);
}

// ---------------------------------------------------------------------------
// 2. The summary is identical in both languages except for its words
// ---------------------------------------------------------------------------

/*
 * R-I18N-2: the anchors are the same URLs in every language. A translated id
 * would fork the published fragment set in half without anything else noticing.
 */
{
  const drift: string[] = [];
  const empty: string[] = [];
  for (const b of getBuilds(LOCALES[0])) {
    const perLocale = LOCALES.map((locale) => {
      const file = pageFor(locale, String(b.classSlug), String(b.slug));
      if (!existsSync(file)) return "missing";
      const body = sectionsSubtree(markup(readFileSync(file, "utf8")))?.body ?? "";
      return entriesOf(body).map((e) => e.href).join(",");
    });
    if (new Set(perLocale).size !== 1) drift.push(`${b.slug}: ${perLocale.join(" vs ")}`);
    // Two empty lists agree with each other, which is not the claim.
    if (perLocale.some((f) => f === "")) empty.push(String(b.slug));
  }
  check("the fragments are byte-identical across locales", drift.length === 0, drift.slice(0, 3).join(" | "));
  check("…over a non-empty fragment list on every build", empty.length === 0, empty.slice(0, 3).join(", "));
}

// ---------------------------------------------------------------------------
// 3. No preference, and no promise of one (R-PREF-4)
// ---------------------------------------------------------------------------

/*
 * The active tier's name arrives from a `MutationObserver` over the six
 * disclosures, so it cannot exist in a prerendered document. Neither can the
 * controls the picker draws only once a preference exists. Asserted inside the
 * summary's subtree rather than over the page, because the tier names and the
 * legend are legitimately elsewhere on it.
 */
{
  interface Picker {
    myTier: string;
    goToGear: string;
    clear: string;
    clearLabel: string;
  }
  const pickerFor = (locale: Locale): Partial<Picker> =>
    ((dictionaryFor(locale).builds as unknown as { tierPicker?: Partial<Picker> }).tierPicker ?? {});

  const promised: string[] = [];
  for (const { locale, classSlug, slug } of allBuilds) {
    const file = pageFor(locale, classSlug, slug);
    if (!existsSync(file)) continue;
    const raw = readFileSync(file, "utf8");
    const found = sectionsSubtree(markup(raw));
    if (!found) continue;
    const text = decode(found.body);
    const picker = pickerFor(locale);

    const stem = (picker.myTier ?? "").split("{")[0].trim();
    if (stem && text.includes(stem)) promised.push(`${locale}/${slug}: "${stem}"`);
    for (const attr of ["data-go-to-gear", "data-clear-tier", "data-tier="]) {
      if (found.body.includes(attr)) promised.push(`${locale}/${slug}: [${attr}]`);
    }
    for (const key of ["goToGear", "clear", "clearLabel"] as const) {
      const value = picker[key];
      if (value && text.includes(value)) promised.push(`${locale}/${slug}: "${value}"`);
    }
  }
  check("the served summary promises no preference", promised.length === 0, promised.slice(0, 3).join(" | "));

  /*
   * Anti-vacuity, on C3's pattern: "the string is absent" is a claim about the
   * subtree only if the string reaches the document at all. A renamed key would
   * otherwise make the rule above pass on a page that renders the promise.
   */
  const samplePath = pageFor("en-us", "sorceress", "blizzard-sorceress");
  const sample = existsSync(samplePath) ? readFileSync(samplePath, "utf8") : "";
  const enPicker = pickerFor("en-us");
  check(
    "control: the preference strings do reach the document, so their absence is a claim",
    !!enPicker.goToGear && sample.includes(enPicker.goToGear),
    "not found even in the RSC payload — the assertion above is vacuous",
  );
}

// ---------------------------------------------------------------------------
// 4. The anchors are the platform's, not the router's
// ---------------------------------------------------------------------------

/*
 * `next/link` on a fragment hands the scroll to the router, which is the defect
 * `hygiene.test.ts` already pins for the Phase 1 tier anchors. It cannot be seen
 * in HTML — a `<Link>` renders an ordinary `<a>` — so it is asserted at source,
 * where the difference exists.
 */
{
  /*
   * Comments out first. This file's subject documents the rules it obeys, and a
   * scan that cannot tell prose from code would read the sentence "no fragment
   * is a routed link" as a routed link — a gate that fails on its own
   * explanation teaches the next reader to delete the explanation.
   */
  const withoutComments = (src: string) =>
    src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");

  const source = join(repo, "components", "game", "page-sections.tsx");
  check("the summary component is where this expects it", existsSync(source), source);
  if (existsSync(source)) {
    const src = withoutComments(readFileSync(source, "utf8"));
    check("the summary imports no router link", !/from\s+["']next\/link["']/.test(src));
    check("no fragment is a routed link", !/<Link\b[^>]*href=\{?["'`]#/.test(src));
    check(
      "the summary imports nothing from lib/prefs, not even the reader",
      !/\bfrom\s+["'](?:@\/lib\/prefs|\.{1,2}\/[^"']*prefs)["']/.test(src),
    );
    check(
      "control: the routed-link pattern matches one",
      /<Link\b[^>]*href=\{?["'`]#/.test('<Link href="#gear">x</Link>'),
    );
    check(
      "control: comments are stripped before either scan",
      withoutComments('/* <Link href="#x"> */ const a = 1;').trim() === "const a = 1;",
      JSON.stringify(withoutComments('/* <Link href="#x"> */ const a = 1;')),
    );
  }
}

// ---------------------------------------------------------------------------
// 4b. Closed still means visible from 640px
// ---------------------------------------------------------------------------

/*
 * §1 forbids `open`, which by itself would be a control nobody can read at
 * desktop. The other half lives in `app/globals.css` and is asserted here
 * because nothing else asserts it: no browser gate drives `[data-sections]`,
 * and both halves fail *silently* in opposite directions. Lose the reveal and
 * the row is empty on 106 pages; lose the `@supports` guard and the same row
 * empties on every browser below the `::details-content` floor, which is
 * exactly the class of browser no gate here runs on.
 *
 * Read as text rather than compiled, deliberately. The claim is about which
 * rules are written and what they are nested inside — a compiled sheet answers
 * "does Chrome apply this", which is the question `page-sections.tsx` already
 * had measured, and not "is the fallback still written down".
 */
{
  /**
   * The body of the block `opener` opens, brace-counted.
   *
   * Regex-with-indentation was the first attempt and it is the same mistake the
   * `<section>` parser above documents: `[\s\S]*?\n\s{2}\}` closes on whichever
   * two-space line comes first, so reformatting the stylesheet would quietly
   * shrink what this gate is looking at. Depth counting cannot be reformatted
   * out of correctness.
   */
  const blockAfter = (css: string, opener: RegExp): string | undefined => {
    const hit = opener.exec(css);
    if (!hit) return undefined;
    const open = css.indexOf("{", hit.index + hit[0].length - 1);
    if (open === -1) return undefined;
    let depth = 0;
    for (let i = open; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
    }
    return undefined;
  };

  const cssPath = join(repo, "app", "globals.css");
  check("the stylesheet is where this expects it", existsSync(cssPath), cssPath);
  if (existsSync(cssPath)) {
    // Comments out: this file's own prose names every selector it forbids.
    const rules = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");

    const GUARD = /@supports\s+selector\(\s*::details-content\s*\)\s*\{/;
    const REVEAL = /\[data-sections\]::details-content\s*\{[^}]*content-visibility:\s*visible/;
    const WITHDRAW = /\[data-sections\]\s*>\s*summary\s*\{[^}]*display:\s*none/;

    const block = blockAfter(rules, GUARD);
    check("the reveal is gated on @supports selector(::details-content)", block !== undefined);
    check(
      "…and reveals the panel with content-visibility on ::details-content",
      REVEAL.test(block ?? ""),
    );
    check(
      "…and withdraws the trigger inside the same guard, never outside it",
      WITHDRAW.test(block ?? "") && !WITHDRAW.test(rules.replace(block ?? " ", " ")),
    );
    /*
     * `blockAfter` returns the *first* match, and this stylesheet already
     * carries two other `(width >= 40rem)` blocks — the scroll padding and the
     * chip fade. So every one of them is tried, and the claim is that at least
     * one contains the reveal.
     */
    const MEDIA = /@media\s*\(\s*width\s*>=\s*40rem\s*\)\s*\{/;
    const insideTheBreakpoint = (css: string) =>
      [...css.matchAll(new RegExp(MEDIA.source, "g"))].some((m) =>
        REVEAL.test(blockAfter(css.slice(m.index), MEDIA) ?? ""),
      );
    check(
      "…at 40rem, the same breakpoint the component calls DESKTOP",
      insideTheBreakpoint(rules),
      "the reveal is not inside a (width >= 40rem) block",
    );

    /*
     * Unlayered, and this is load-bearing rather than stylistic: Tailwind emits
     * `@layer theme, base, components, utilities`, a later layer beats an
     * earlier one whatever the specificity, and the trigger carries a `flex`
     * utility at every width. Inside `@layer components` the `display: none`
     * would simply never apply — and it would fail *silently*, because a rule
     * that loses the cascade is not a rule that errors.
     */
    const LAYER = /@layer\s+[\w, -]*\{/;
    const insideALayer = (css: string) =>
      [...css.matchAll(new RegExp(LAYER.source, "g"))].some((m) =>
        REVEAL.test(blockAfter(css.slice(m.index), LAYER) ?? ""),
      );
    check("…and unlayered, so the utilities layer cannot outrank it", !insideALayer(rules));

    // Controls: each scan above must fail the stylesheet it exists to fail.
    const buried = "@layer components{ [data-sections]::details-content{content-visibility:visible} }";
    check("control: the guard scan misses a stylesheet without it", blockAfter("a{b:c}", GUARD) === undefined);
    check("control: the layer scan sees a reveal that is buried in a layer", insideALayer(buried));
    check(
      "control: the breakpoint scan is not satisfied by an unrelated 40rem block",
      !insideTheBreakpoint("@media (width >= 40rem){ html{scroll-padding-top:3rem} }"),
    );
    check(
      "control: the brace scan does not stop at a nested close",
      blockAfter("@x{ a{b:c} d{e:f} }", /@x\s*\{/)?.includes("d{e:f}") === true,
    );
  }

  /*
   * The component's side of the same decision. `sm:hidden` on the `<summary>`
   * is the utility that would defeat the fallback: it hides the trigger at
   * ≥640px in *every* browser, including the ones where the reveal above never
   * applied, which is the one combination that leaves nothing on screen.
   */
  const source = join(repo, "components", "game", "page-sections.tsx");
  if (existsSync(source)) {
    const src = readFileSync(source, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ");
    const tag = /<summary[\s\S]*?>/.exec(src)?.[0] ?? "";
    check("the component was read and its <summary> found", tag !== "", src.slice(0, 60));
    check("the trigger is not hidden by an unguarded sm: utility", !/\bsm:hidden\b/.test(tag), tag);
    check(
      "control: the sm:hidden scan matches one",
      /\bsm:hidden\b/.test('<summary className="flex sm:hidden">'),
    );
  }
}

// ---------------------------------------------------------------------------
// 5. Synthetic controls: the checker fails the pages it exists to fail
// ---------------------------------------------------------------------------

/*
 * Each of these is a defect this gate was written for, planted in a minimal
 * document. The point is not the sample — it is that removing a rule above
 * turns one of these green, which is what makes the sweep's silence mean
 * something.
 */
{
  const LABELS = { skills: "Skills", stats: "Stats" };
  const section = (id: string, heading: string) =>
    `<section id="${id}"><div class="mb-4"><h2>${heading}</h2></div><p>body</p></section>`;
  const summary = (hrefs: [string, string][]) =>
    `<details data-sections=""><summary>Sections</summary><div data-sections-panel="">` +
    `<nav aria-label="On this page"><ol>` +
    hrefs.map(([h, text]) => `<li><a href="${h}">${text}</a></li>`).join("") +
    `</ol></nav></div></details>`;

  const good =
    summary([["#skills", "Skills"], ["#stats", "Stats"]]) +
    section("skills", "Skills") +
    section("stats", "Stats");
  check("control: a correct sample has no complaints", problemsWith(good, LABELS).length === 0,
    problemsWith(good, LABELS).join(" | "));

  const dangling =
    summary([["#skills", "Skills"], ["#nowhere", "Stats"]]) + section("skills", "Skills");
  check(
    "control: a dangling href fails",
    problemsWith(dangling, LABELS).some((p) => p.includes("no rendered section")),
    problemsWith(dangling, LABELS).join(" | "),
  );

  const short = summary([["#skills", "Skills"]]) + section("skills", "Skills") + section("stats", "Stats");
  check(
    "control: a link count that differs from the rendered section count fails",
    problemsWith(short, LABELS).some((p) => p.includes("rendered section with no entry")),
    problemsWith(short, LABELS).join(" | "),
  );

  const swapped =
    summary([["#stats", "Stats"], ["#skills", "Skills"]]) +
    section("skills", "Skills") +
    section("stats", "Stats");
  check(
    "control: two hrefs in the wrong order fail",
    problemsWith(swapped, LABELS).some((p) => p.includes("out of document order")),
    problemsWith(swapped, LABELS).join(" | "),
  );

  const heading = good.replace("<summary>Sections</summary>", "<summary><h2>Sections</h2></summary>");
  check(
    "control: a heading in the summary fails",
    problemsWith(heading, LABELS).some((p) => p.includes("<h2>")),
  );

  const current = good.replace('<a href="#skills"', '<a aria-current="location" href="#skills"');
  check(
    "control: aria-current in the summary fails",
    problemsWith(current, LABELS).some((p) => p.includes("aria-current")),
  );

  const query = good.replace('href="#skills"', 'href="/en-us/builds?tier=budget#skills"');
  check(
    "control: an href carrying a query fails",
    problemsWith(query, LABELS).some((p) => p.includes("bare fragment")),
  );

  const renamed = good.replace(">Skills</a>", ">Skill trees</a>");
  check(
    "control: a label that stops matching the dictionary fails",
    problemsWith(renamed, LABELS).some((p) => p.includes("dictionary says")),
  );

  const drifted = good.replace("<h2>Skills</h2>", "<h2>Skill trees</h2>");
  check(
    "control: a heading that stops matching the dictionary fails",
    problemsWith(drifted, LABELS).some((p) => p.includes("heading reads")),
  );

  const ajar = good.replace('<details data-sections="">', '<details data-sections="" open>');
  check(
    "control: a summary that ships open fails",
    problemsWith(ajar, LABELS).some((p) => p.includes("ships open")),
    problemsWith(ajar, LABELS).join(" | "),
  );

  /*
   * …and the substitution actually happened. `String.replace` on a string that
   * is not there returns the original silently, so without this the control
   * above would be asserting that a *correct* sample fails — which it does not,
   * and which would look like a real regression somewhere else entirely.
   */
  check("control: the open-summary sample really carries the attribute", ajar !== good);

  const tierName = good.replace(">Stats</a>", ">Stats</a><span>· Budget</span>");
  check(
    "control: a row carrying more than its link fails",
    problemsWith(tierName, LABELS).some((p) => p.includes("extra text")),
  );

  const duplicate = good + section("skills", "Skills");
  check(
    "control: an id used twice fails",
    problemsWith(duplicate, LABELS).some((p) => p.includes("appears 2 times")),
  );

  // And the subtree parser itself: nesting must not truncate it early.
  const nested = `<details data-sections="" open><summary>S</summary><details><summary>x</summary>y</details><nav aria-label="n"><ol><li><a href="#skills">Skills</a></li></ol></nav></details>`;
  check(
    "control: a nested <details> does not truncate the subtree",
    (sectionsSubtree(nested)?.body ?? "").includes('href="#skills"'),
  );
}

// ---------------------------------------------------------------------------

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
