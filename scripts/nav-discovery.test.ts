/**
 * Discovery and navigation: R-NAV-1 through R-NAV-4, as the site actually
 * ships them.
 *
 * Four defects, all of which looked fine in the source:
 *
 *   - **Six cards that went nowhere.** The home described the six gear tiers in
 *     six bordered, hover-lit boxes with no `href`. The whole card is a link
 *     now, and pressing one also records which tier the reader lives at.
 *   - **"Start a character" started a Sorceress.** Two hrefs on the home page
 *     pointed at one class's leveling journey — the CTA and the Leveling
 *     feature block, which presents the *area*. Seven of eight classes got a
 *     wrong answer.
 *   - **A class page with one anchor.** Eight sections, seven headings, and
 *     `#skills` the only id on it, so nothing above the fold said the skill
 *     trees were there.
 *   - **Five reference sections nobody could find.** Runes, Items,
 *     Breakpoints, Mercenaries and Mechanics were reachable from the header
 *     disclosure and the footer, and from nowhere a reader looks.
 *
 * **Two halves, and why.** Most of this is a fact about served markup, so most
 * of it is read from `.next/server/app` — that buys every class page in both
 * languages instead of the one or two a browser gate has time for, and reading
 * the file with `<script>` stripped *is* the no-JavaScript case rather than an
 * approximation of it. Three things are not facts about markup and need a real
 * browser: what a press on a card writes to storage, what a page load writes to
 * storage on its own, and the trigger's accessible name at a given width, which
 * is a computation over laid-out boxes that no regex can stand in for.
 *
 * **What is deliberately not asserted.** Nothing counts a class page's sections
 * against its summary entries. R-NAV-3 names five and the page has eight, so
 * "entries == sections" would have been red the day it was written. The
 * predicate is the one in §10.3 of the phase plan: every entry resolves to an
 * element the document really rendered, and every section *on the declared
 * list* that rendered has exactly one entry, while none whose guard was false
 * has any.
 *
 * Requires `npm run build`. Run with `npm run test:nav-discovery`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { dictionaryFor } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { progressionTiers } from "../lib/labels";
import { TIER_KEY } from "../lib/prefs";
import { getClasses } from "../lib/registry";
import { routes } from "../lib/routes";
import { PROGRESSION_TIERS } from "../lib/types";
import type { Slug } from "../lib/types";

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

// ---------------------------------------------------------------------------
// Parsing, kept pure so the synthetic controls at the end run the same code
// ---------------------------------------------------------------------------

/**
 * Rendered markup only.
 *
 * The RSC payload rides in a `<script>` and repeats every href and every string
 * on the page, so a scan that did not strip it would find the six links whether
 * or not they were ever rendered — and "the six links are in the served HTML"
 * is precisely the claim being made. Stripping is also what makes this the
 * no-JavaScript case: what is left is what a reader without scripting gets.
 */
export function markup(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ");
}

export function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
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
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();
}

export interface TierCard {
  tier: string;
  /** Everything between `<li …>` and `</li>`. */
  body: string;
}

/**
 * The tier rows, in document order.
 *
 * Keyed on `data-tier` rather than on position in a list, so a card that lost
 * its marker disappears from this rather than shifting the others along and
 * making five wrong assertions out of one defect. `<li>` does not nest here, so
 * a lazy match is the whole element.
 */
export function tierCards(html: string): TierCard[] {
  return [...html.matchAll(/<li\b[^>]*\bdata-tier="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)].map((m) => ({
    tier: m[1],
    body: m[2],
  }));
}

/** The single `<a href>` a row wraps everything in, or null if it is not one. */
export function wholeCardLink(body: string): { href: string; text: string } | null {
  const opening = /^\s*<a\b([^>]*)>/.exec(body);
  if (!opening) return null;
  if (!/<\/a>\s*$/.test(body)) return null;
  const href = /\bhref="([^"]*)"/.exec(opening[1])?.[1];
  if (href === undefined) return null;
  // Nothing may sit outside the anchor: exactly one `<a>` opens and closes it.
  const opens = (body.match(/<a\b/g) ?? []).length;
  if (opens !== 1) return null;
  return { href, text: decode(body) };
}

/**
 * The `<ol>` the tier rows live in, from its opening tag to its close.
 *
 * Found by walking back to the nearest `<ol` before the first `data-tier`
 * rather than by slicing a fixed number of characters backwards, which is the
 * shape that works until a class list grows and then silently returns the wrong
 * list. `<ol>` does not nest here, so the first `</ol>` after it is its own.
 */
export function tierListSubtree(html: string): string | null {
  const first = html.indexOf('data-tier="');
  if (first < 0) return null;
  const open = html.lastIndexOf("<ol", first);
  if (open < 0) return null;
  const close = html.indexOf("</ol>", first);
  if (close < 0) return null;
  return html.slice(open, close + "</ol>".length);
}

/** Every `href` in a document, in order. */
export function hrefs(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
}

/** The anchors of a document, in order, with their text. */
export function anchors(html: string): { href: string; text: string }[] {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: m[1],
    text: decode(m[2]),
  }));
}

/**
 * The `<details data-sections>` subtree, depth-counted.
 *
 * `data-sections=` and not `data-sections`, because the panel inside it is
 * `data-sections-panel` and a word-boundary match would find whichever came
 * first and be right by luck. Depth-counted because a lazy match would close on
 * the first `</details>` in the subtree, and the header's own disclosure sits
 * earlier in every one of these documents.
 */
export function sectionsSubtree(html: string): string | null {
  const opening = /<details\b[^>]*\bdata-sections=[^>]*>/.exec(html);
  if (!opening) return null;
  const from = opening.index + opening[0].length;
  const step = /<details\b[^>]*>|<\/details>/g;
  step.lastIndex = from;
  let depth = 1;
  let hit: RegExpExecArray | null;
  while ((hit = step.exec(html)) !== null) {
    depth += hit[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(from, hit.index);
  }
  return null;
}

/**
 * The class page's `<nav data-section-nav>` subtree, depth-counted.
 *
 * A different element from the build page's, because the two summaries are
 * deliberately different components: eleven entries and an active gear tier
 * make the build page's a client disclosure, while five entries and no tiers
 * make this one a plain server-rendered nav that is always visible — which is
 * what keeps R-NAV-3's "one interaction from the top" true at every width,
 * since a disclosure is two.
 *
 * Depth-counted for the same reason as its sibling: the header ships two `<nav>`
 * elements before this one in every document.
 */
export function sectionNavSubtree(html: string): string | null {
  const opening = /<nav\b[^>]*\bdata-section-nav\b[^>]*>/.exec(html);
  if (!opening) return null;
  const from = opening.index + opening[0].length;
  const step = /<nav\b[^>]*>|<\/nav>/g;
  step.lastIndex = from;
  let depth = 1;
  let hit: RegExpExecArray | null;
  while ((hit = step.exec(html)) !== null) {
    depth += hit[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(from, hit.index);
  }
  return null;
}

/** Every `id` a document rendered — sections and anything else. */
export function renderedIds(html: string): string[] {
  return [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
}

/** The ids of the `<section id>` elements, in document order. */
export function sectionIds(html: string): string[] {
  return [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
}

// ---------------------------------------------------------------------------
// 1. The home page, from the served HTML
// ---------------------------------------------------------------------------

/** The five reference cards, in the order R-NAV-4 lists them. */
const REFERENCE = ["runes", "items", "breakpoints", "mercenaries", "mechanics"] as const;

for (const l of LOCALES) {
  const locale = l as Locale;
  const t = dictionaryFor(locale);
  const r = routes(locale);
  const tiers = progressionTiers(t);
  console.log(`\nthe home page — ${locale}`);

  const home = markup(readFileSync(join(root, `${locale}.html`), "utf8"));

  // --- R-NAV-1 -------------------------------------------------------------
  const cards = tierCards(home);
  check(`${locale}: the home draws six tier cards`, cards.length === 6, `${cards.length}`);
  check(
    `${locale}: their data-tier values are the six canonical tiers, in order`,
    cards.map((c) => c.tier).join(",") === PROGRESSION_TIERS.join(","),
    cards.map((c) => c.tier).join(","),
  );
  check(
    `${locale}: the list holding them is an <ol>`,
    /<ol\b[^>]*>\s*<li\b[^>]*\bdata-tier=/.test(home),
  );

  for (const card of cards) {
    const link = wholeCardLink(card.body);
    check(`${locale}: ${card.tier} — the whole card is one link`, link !== null);
    if (!link) continue;
    check(
      `${locale}: ${card.tier} — it goes to /builds, with no query`,
      link.href === r.builds(),
      link.href,
    );
    const meta = tiers[card.tier as (typeof PROGRESSION_TIERS)[number]];
    // Not "the link exists somewhere in the card": every part of the card the
    // reader can see has to be inside the anchor, or the target is a label.
    check(
      `${locale}: ${card.tier} — the tier's name, question and context are all inside the link`,
      link.text.includes(meta.label) &&
        link.text.includes(meta.question) &&
        link.text.includes(meta.context),
      link.text.slice(0, 80),
    );
  }

  /*
   * The half that must survive with no JavaScript, and the half that must not
   * exist without it. `home` has already had every `<script>` removed, so this
   * is a reader with scripting off: six working links, and nothing that offers
   * to remember anything — no button, no checkbox, no radio, no pressed state.
   */
  const list = tierListSubtree(home);
  check(`${locale}: the tier list was found for the no-JS scan`, list !== null);
  if (list) {
    check(
      `${locale}: with scripts stripped, the six links are still there`,
      hrefs(list).filter((h) => h === r.builds()).length === 6,
      `${hrefs(list).filter((h) => h === r.builds()).length}`,
    );
    check(
      `${locale}: …and no preference control is`,
      !/<button\b|<input\b|<select\b|aria-pressed=|role="radio"|role="switch"/.test(list),
    );
  }
  check(
    `${locale}: the home ships no d2rc.* literal and no tier boot script`,
    !/d2rc\./.test(home),
  );

  // --- R-NAV-2 -------------------------------------------------------------
  const perClassLeveling = hrefs(home).filter((h) => h.startsWith(`${r.leveling()}/`));
  check(
    `${locale}: nothing on the home points at one class's leveling journey`,
    perClassLeveling.length === 0,
    perClassLeveling.slice(0, 3).join(", "),
  );
  const cta = anchors(home).find((a) => a.text === t.home.ctaStart);
  check(`${locale}: "${t.home.ctaStart}" is on the page`, cta !== undefined);
  check(
    `${locale}: …and it goes to the leveling index`,
    cta?.href === r.leveling(),
    String(cta?.href),
  );
  const feature = anchors(home).find((a) => a.text.includes(t.home.featureLevelingTitle));
  check(`${locale}: the Leveling feature block is on the page`, feature !== undefined);
  check(
    `${locale}: …and it goes to the leveling index too`,
    feature?.href === r.leveling(),
    String(feature?.href),
  );

  // --- R-NAV-4, the home half ---------------------------------------------
  const bodies = {
    runes: t.home.refRunesBody,
    items: t.home.refItemsBody,
    breakpoints: t.home.refBreakpointsBody,
    mercenaries: t.home.refMercenariesBody,
    mechanics: t.home.refMechanicsBody,
  } as const;
  const titles = {
    runes: t.nav.runes,
    items: t.nav.items,
    breakpoints: t.nav.breakpoints,
    mercenaries: t.nav.mercenaries,
    mechanics: t.nav.mechanics,
  } as const;
  const hrefFor = {
    runes: r.runes(),
    items: r.items(),
    breakpoints: r.breakpoints(),
    mercenaries: r.mercenaries(),
    mechanics: r.mechanics(),
  } as const;

  /*
   * Matched against decoded anchor text, never against the raw HTML.
   *
   * The served bytes carry `&#x27;` where the copy has an apostrophe — "a
   * Nightwing&#x27;s Veil" — so `html.includes(body)` is false for a card that
   * is on the page, and a rule written that way reports a missing card in one
   * of the five and nowhere else. Position is the anchor's index in document
   * order for the same reason.
   */
  const all = anchors(home);
  const positions: number[] = [];
  for (const key of REFERENCE) {
    const matching = all.filter((a) => a.text.includes(bodies[key]));
    check(
      `${locale}: exactly one reference card for ${key}`,
      matching.length === 1,
      `${matching.length}`,
    );
    const card = matching[0];
    if (!card) continue;
    check(`${locale}: ${key} — it links to its own index`, card.href === hrefFor[key], card.href);
    check(
      `${locale}: ${key} — its title is the nav string`,
      card.text.includes(titles[key]),
      card.text.slice(0, 60),
    );
    positions.push(all.indexOf(card));
  }
  check(
    `${locale}: the five reference cards are in the order R-NAV-4 lists them`,
    positions.length === REFERENCE.length &&
      positions.every((p, i) => p >= 0 && (i === 0 || p > positions[i - 1])),
    positions.join(","),
  );
  // "Exactly those five", said as a count rather than as a list, so a sixth
  // card added later fails here instead of passing every rule above.
  const drawn = Object.values(bodies).filter((b) => all.some((a) => a.text.includes(b))).length;
  check(`${locale}: exactly five reference bodies are drawn`, drawn === 5, `${drawn}`);

  // --- R-NAV-2, the destination -------------------------------------------
  const leveling = markup(readFileSync(join(root, locale, "leveling.html"), "utf8"));
  const classSlugs = getClasses(locale).map((c) => c.slug);
  const listed = new Set(
    hrefs(leveling)
      .filter((h) => h.startsWith(`${r.leveling()}/`))
      .map((h) => h.slice(r.leveling().length + 1)),
  );
  check(
    `${locale}: /leveling lists all eight classes`,
    listed.size === 8 && classSlugs.every((s) => listed.has(s)),
    `${listed.size}: ${[...listed].join(", ")}`,
  );
  check(`${locale}: the catalogue really has eight classes`, classSlugs.length === 8);
}

// ---------------------------------------------------------------------------
// 2. The class page summary — every class, both languages
// ---------------------------------------------------------------------------

/**
 * The five sections R-NAV-3 names, in document order, with the heading each
 * one's entry must carry.
 *
 * The page has eight sections. "Strengths and weaknesses", "Class-specific
 * items" and the untitled introduction are not on this list and must not be in
 * the summary; the other five are conditional in the source and must be in the
 * summary exactly when they rendered.
 */
const DECLARED = ["builds", "mechanics", "attributes", "skills", "breakpoints"] as const;

for (const l of LOCALES) {
  const locale = l as Locale;
  const t = dictionaryFor(locale);
  console.log(`\nthe class page summary — ${locale}`);

  const headingFor: Record<string, string> = {
    builds: t.classes.startHere,
    mechanics: t.classes.coreMechanics,
    attributes: t.classes.attributes,
    skills: t.classes.skillTrees,
    breakpoints: t.classes.breakpointsTitle,
  };

  let withSummary = 0;
  let entriesSeen = 0;
  const dead: string[] = [];
  const miscounted: string[] = [];
  const undeclared: string[] = [];
  const mislabelled: string[] = [];
  const outOfOrder: string[] = [];
  const headings: string[] = [];
  const skillsMissing: string[] = [];

  for (const cls of getClasses(locale)) {
    const file = join(root, locale, "classes", `${cls.slug}.html`);
    const html = markup(readFileSync(file, "utf8"));
    const where = `${locale}/${cls.slug}`;

    const subtree = sectionNavSubtree(html);
    if (!subtree) continue;
    withSummary++;

    const entries = anchors(subtree).filter((a) => a.href.startsWith("#"));
    entriesSeen += entries.length;
    const ids = new Set(renderedIds(html));
    const rendered = sectionIds(html);

    for (const entry of entries) {
      const id = entry.href.slice(1);
      // (i) every entry resolves to an element present in the same document.
      if (!ids.has(id)) dead.push(`${where} → #${id}`);
      if (!(DECLARED as readonly string[]).includes(id)) undeclared.push(`${where} → #${id}`);
      if (headingFor[id] !== undefined && entry.text !== headingFor[id]) {
        mislabelled.push(`${where} → #${id} reads “${entry.text}”`);
      }
    }

    // (ii) every declared section that rendered has exactly one entry, and
    //      none whose guard was false has one.
    for (const id of DECLARED) {
      const wanted = rendered.includes(id) ? 1 : 0;
      const got = entries.filter((e) => e.href === `#${id}`).length;
      if (got !== wanted) miscounted.push(`${where} → #${id}: ${got} entries, ${wanted} section`);
    }

    // The entries follow the sections' own order, so the summary reads as the
    // page reads rather than as an arbitrary list.
    const order = entries.map((e) => e.href.slice(1)).filter((id) => rendered.includes(id));
    const inPage = rendered.filter((id) => order.includes(id));
    if (order.join(",") !== inPage.join(",")) {
      outOfOrder.push(`${where}: ${order.join(",")} vs ${inPage.join(",")}`);
    }

    // The tripwire `heading-snapshot.json` cannot see: it pins the build pages
    // only, so on a class page this is the only thing standing between the
    // summary and an `<h2>` in it.
    if (/<h[23]\b/.test(subtree)) headings.push(where);

    // `#skills` is the published anchor `routes.classSkills()` is built from.
    if (rendered.includes("skills") && !entries.some((e) => e.href === "#skills")) {
      skillsMissing.push(where);
    }
  }

  check(`${locale}: every class page carries the summary`, withSummary === 8, `${withSummary}`);
  check(`${locale}: it has entries to judge`, entriesSeen >= 8 * 3, `${entriesSeen}`);
  check(`${locale}: no summary entry lands on an id the page did not render`, dead.length === 0, dead.slice(0, 4).join("; "));
  check(`${locale}: every declared section that rendered has exactly one entry`, miscounted.length === 0, miscounted.slice(0, 4).join("; "));
  check(`${locale}: the summary lists nothing outside the five R-NAV-3 names`, undeclared.length === 0, undeclared.slice(0, 4).join("; "));
  check(`${locale}: every entry reads exactly like the heading it points at`, mislabelled.length === 0, mislabelled.slice(0, 3).join("; "));
  check(`${locale}: the entries follow the page's own order`, outOfOrder.length === 0, outOfOrder.slice(0, 3).join("; "));
  check(`${locale}: the summary contains no h2 or h3`, headings.length === 0, headings.join(", "));
  check(`${locale}: #skills is in the summary wherever the section rendered`, skillsMissing.length === 0, skillsMissing.join(", "));
}

// ---------------------------------------------------------------------------
// 3. Anti-vacuity: the parsers are shown each defect, in the style of
//    `page-structure.test.ts`
// ---------------------------------------------------------------------------

console.log("\ncontrols");
{
  const good = '<ol><li data-tier="starter"><a href="/en-us/builds">01 Starter “Q” C</a></li></ol>';
  check("control: a well-formed card parses", tierCards(good).length === 1);
  check("control: …and reads as one whole-card link", wholeCardLink(tierCards(good)[0].body)?.href === "/en-us/builds");

  const hrefless = '<ol><li data-tier="starter"><span>01 Starter</span></li></ol>';
  check("control: a card with no link is rejected", wholeCardLink(tierCards(hrefless)[0].body) === null);

  const partial =
    '<ol><li data-tier="starter"><span>01 Starter</span><a href="/en-us/builds">Browse</a></li></ol>';
  check(
    "control: a card whose link is only a label inside it is rejected",
    wholeCardLink(tierCards(partial)[0].body) === null,
  );

  const queried = '<li data-tier="bis"><a href="/en-us/builds?tier=bis">x</a></li>';
  check(
    "control: a query parameter is visible to the href assertion",
    wholeCardLink(tierCards(queried)[0].body)?.href === "/en-us/builds?tier=bis",
  );

  const scripted =
    '<li data-tier="bis"><a href="/en-us/builds">x</a></li><script>localStorage.setItem("d2rc.tier","bis")</script>';
  check("control: stripping scripts removes what a script says", !/d2rc\./.test(markup(scripted)));
  check("control: …and the scan does see a d2rc literal when it is in markup", /d2rc\./.test(markup('<p>d2rc.tier</p>')));

  const missing = tierCards('<li data-tier="starter"><a href="/x">a</a></li>');
  check("control: a list of five is not six", missing.length !== 6, `${missing.length}`);

  const twoLists =
    '<ol id="other"><li><a href="/z">z</a></li></ol>' +
    '<ol id="tiers"><li data-tier="starter"><a href="/en-us/builds">a</a></li></ol>' +
    '<ol id="after"><li><a href="/y">y</a></li></ol>';
  const picked = tierListSubtree(twoLists);
  check("control: the tier list is picked out of three lists", picked?.includes('id="tiers"') === true);
  check("control: …and neither neighbour comes with it", picked !== null && !picked.includes("/z") && !picked.includes("/y"));
  check("control: a page with no tier rows yields no list", tierListSubtree("<ol><li>x</li></ol>") === null);
  check(
    "control: a preference control inside the list is detected",
    /<button\b|<input\b|<select\b|aria-pressed=|role="radio"|role="switch"/.test(
      '<ol><li data-tier="bis"><button aria-pressed="true">Remember</button></li></ol>',
    ),
  );
  check(
    "control: …and a list of plain links is not reported",
    picked !== null &&
      !/<button\b|<input\b|<select\b|aria-pressed=|role="radio"|role="switch"/.test(picked),
  );

  const sample =
    '<details data-sections=""><nav><ol><li><a href="#mechanics">Core mechanics</a></li>' +
    '<li><a href="#ghost">Gone</a></li></ol></nav></details>' +
    '<section id="mechanics"><h2>Core mechanics</h2><p>x</p></section>';
  const sub = sectionsSubtree(sample);
  check("control: the summary subtree is found", sub !== null);
  check("control: it holds both entries", sub !== null && anchors(sub).length === 2);
  const ids = new Set(renderedIds(sample));
  check("control: a dangling entry is detected", sub !== null && anchors(sub).some((a) => !ids.has(a.href.slice(1))));
  check("control: a live entry is not reported", ids.has("mechanics"));
  check("control: the section scan finds the rendered section", sectionIds(sample).join(",") === "mechanics");

  const nested =
    '<details class="header"><summary>Menu</summary><a href="/x">y</a></details>' +
    '<details data-sections=""><a href="#skills">Skill trees</a></details>';
  check(
    "control: an earlier unrelated <details> does not become the summary",
    sectionsSubtree(nested)?.includes('href="#skills"') === true,
  );

  const heading = '<details data-sections=""><h2>Sections</h2><a href="#a">A</a></details>';
  check("control: an h2 inside the summary is detected", /<h[23]\b/.test(sectionsSubtree(heading) ?? ""));
  check("control: a summary without one is not reported", !/<h[23]\b/.test(sectionsSubtree(sample) ?? ""));

  const perClass = ['<a href="/en-us/leveling">A</a>', '<a href="/en-us/leveling/sorceress">B</a>'].join("");
  check(
    "control: a per-class leveling href is detected",
    hrefs(perClass).filter((h) => h.startsWith("/en-us/leveling/")).length === 1,
  );
  check(
    "control: the index href is not mistaken for one",
    hrefs('<a href="/en-us/leveling">A</a>').filter((h) => h.startsWith("/en-us/leveling/")).length === 0,
  );
}

// ---------------------------------------------------------------------------
// 4. The browser half: storage, and the accessible name by width
// ---------------------------------------------------------------------------

/** Where the header's label changes, and the widths on each side of it. */
const MENU_WIDTHS = [320, 390, 768] as const;
const REFERENCE_WIDTHS = [900, 1280] as const;

/**
 * The trigger's name as the browser computes it.
 *
 * `<summary>` maps to `DisclosureTriangle`, and the point of reading the tree
 * rather than the DOM is that `display: none` has already been applied: the
 * markup carries both words at every width and the tree carries exactly one.
 * A `textContent` assertion would pass on both sides of 900px and prove
 * nothing, which is the trap this rule exists to avoid.
 */
const TRIGGER_NAMES = (nodes: { role: string; name: string }[]) =>
  nodes.filter((n) => n.role === "DisclosureTriangle").map((n) => n.name);

// ---------------------------------------------------------------------------
// 5. Where a summary entry actually lands
// ---------------------------------------------------------------------------

/*
 * R-NAV-3 promises "Skill trees reachable in one interaction from the top", and
 * §4 above only proves the entry *resolves* — that `#skills` names an element
 * which exists. It does, and the reader still arrived in the wrong place.
 *
 * `#builds` is a `FilterableBuildList`, whose static HTML is the Suspense
 * fallback: the plain list, with no filter panel. Hydration replaces it with
 * the panel and the list, and that section grows — above every other anchor on
 * the page. On a load that already carries the fragment the browser has jumped
 * before any of it happens, so `#skills` slides down by exactly the amount
 * `#builds` gained. Measured on the published build, in both languages:
 *
 *     width   contract   landed   error
 *      320       104      208     +104
 *      390       104      190      +86
 *      768       144    482–528   +338…+384
 *     1280       144    482–572   +338…+428
 *
 * A press on the summary *after* hydration landed at the contract to the pixel
 * in 23 of 24 cases, so the two paths do not fail alike and comparing them
 * would have proved nothing. What is asserted here is the absolute position,
 * against the number the stylesheet itself computes.
 */
const ANCHOR_CLASSES = ["sorceress", "necromancer", "warlock"] as const;
const ANCHOR_WIDTHS = [320, 390, 768, 1280] as const;

/**
 * Landing, contract and header, in one round trip.
 *
 * The contract is `scroll-margin-top` on the section plus `scroll-padding-top`
 * on the root — read from the page, never restated here, so `<Section>`'s
 * `scroll-mt-24` and `globals.css`'s width-conditional padding stay the single
 * source of truth. Restating them would turn this into a gate that agrees with
 * a copy of the CSS rather than with the CSS.
 */
const LANDING = (id: string) => `(() => {
  const el = document.getElementById(${JSON.stringify(id)});
  if (!el) return JSON.stringify({ found: false });
  const heading = el.querySelector('h2');
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const header = document.querySelector('header');
  return JSON.stringify({
    found: true,
    top: Math.round(el.getBoundingClientRect().top),
    headingTop: heading ? Math.round(heading.getBoundingClientRect().top) : null,
    contract: Math.round(margin + padding),
    header: header ? Math.round(header.getBoundingClientRect().height) : 0,
    viewport: window.innerHeight,
  });
})()`;

interface Landing {
  found: boolean;
  top: number;
  headingTop: number | null;
  contract: number;
  header: number;
  viewport: number;
}

/**
 * Wait until the scroll offset *and* the document height have both stopped.
 *
 * Both, because on this page they stop at different times: the jump finishes
 * long before hydration has finished growing the document above it, and a
 * probe that settles on `scrollY` alone reads the position the section is
 * about to leave. `scroll-behavior: smooth` is site-wide, so this also covers
 * the animation a press starts.
 */
async function settled(page: Page, budgetMs = 5000): Promise<number> {
  const started = Date.now();
  let last = "";
  let quiet = 0;
  while (Date.now() - started < budgetMs) {
    const now = await page.evaluate<string>(
      `Math.round(window.scrollY) + ':' + document.documentElement.scrollHeight`,
    );
    quiet = now === last ? quiet + 1 : 0;
    last = now;
    if (quiet >= 4) return Date.now() - started;
    await new Promise((r) => setTimeout(r, 80));
  }
  return -1;
}

/** Press a same-page summary entry, verifying the coordinate really is it. */
async function pressEntry(page: Page, href: string): Promise<boolean> {
  const spot = await page.evaluate<{ x: number; y: number } | null>(
    `(() => {
      const a = document.querySelector('[data-section-nav] a[href="${href}"]');
      if (!a) return null;
      const r = a.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const hit = document.elementFromPoint(x, y);
      if (!hit || hit.closest('a[href]') !== a) return null;
      return { x, y };
    })()`,
  );
  if (!spot) return false;
  await page.click(spot.x, spot.y);
  return true;
}

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();

  try {
    for (const l of LOCALES) {
      const locale = l as Locale;
      const t = dictionaryFor(locale);
      const r = routes(locale);
      console.log(`\nthe header's label, by width — ${locale}`);

      for (const [widths, expected, other] of [
        [MENU_WIDTHS, t.nav.menu, t.nav.reference],
        [REFERENCE_WIDTHS, t.nav.reference, t.nav.menu],
      ] as const) {
        for (const width of widths) {
          await page.setViewport(width);
          await page.goto(site.origin + r.home());
          const names = TRIGGER_NAMES(await page.axNodes());
          check(
            `${locale} @${width}: the trigger has exactly one accessible name`,
            names.length === 1,
            JSON.stringify(names),
          );
          check(
            `${locale} @${width}: …and it is “${expected}”`,
            names[0] === expected,
            JSON.stringify(names),
          );
          check(
            `${locale} @${width}: “${other}” is not in the tree as a disclosure name`,
            !names.includes(other),
            JSON.stringify(names),
          );
          const items = await page.evaluate<number>(
            `document.querySelectorAll('header details a[href]').length`,
          );
          check(`${locale} @${width}: the ten links are untouched`, items === 10, `${items}`);
        }
      }

      // ---------------------------------------------------------------------
      console.log(`\nwhat a tier card writes — ${locale}`);
      // ---------------------------------------------------------------------
      await page.setViewport(390);

      /*
       * Load the page and touch nothing. R-PREF-4 and the mobile-navigation
       * gate both depend on this: a preference is a choice somebody made, not a
       * side effect of a page being looked at, and a write on render or on
       * hover would be invisible to every other rule here.
       */
      await page.goto(site.origin + r.home());
      await page.evaluate(`localStorage.clear(); sessionStorage.clear()`);
      await page.goto(site.origin + r.home());
      const hydrated = await page.waitFor(
        `(() => { const d = document.querySelector('header details'); return !!d && Object.keys(d).some(k => k.startsWith('__react')); })()`,
        10_000,
      );
      check(`${locale}: the home hydrated, so the probe means something`, hydrated);
      const idle = await page.evaluate<number>(
        `(() => { try { return localStorage.length + sessionStorage.length; } catch { return -1; } })()`,
      );
      check(`${locale}: loading the home writes nothing to storage`, idle === 0, `${idle}`);

      for (const [k, tier] of PROGRESSION_TIERS.entries()) {
        await page.goto(site.origin + r.home());
        await page.evaluate(`localStorage.clear()`);
        await page.waitFor(
          `(() => { const d = document.querySelector('header details'); return !!d && Object.keys(d).some(k => k.startsWith('__react')); })()`,
          10_000,
        );
        /*
         * Scrolled instantly, and the rectangle read in a *separate* round
         * trip afterwards.
         *
         * `app/globals.css` sets `scroll-behavior: smooth` for the whole site,
         * so a plain `scrollIntoView()` starts an animation and the rectangle
         * measured in the same expression is where the card *was*. The press
         * then lands on whatever has drifted under the coordinate — here, the
         * neighbouring card or the gap between two — and the failure reads as
         * "the card does not navigate", which is a lie about the code. Phase 2
         * §8.2 records the same mistake being made once already.
         */
        await page.evaluate(
          `document.querySelector('li[data-tier="${tier}"] a[href]')
             ?.scrollIntoView({ block: 'center', behavior: 'instant' })`,
        );
        const spot = await page.evaluate<{ x: number; y: number } | null>(
          `(() => {
            const a = document.querySelector('li[data-tier="${tier}"] a[href]');
            if (!a) return null;
            const r = a.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return null;
            const x = r.left + r.width / 2;
            const y = r.top + r.height / 2;
            // The coordinate has to be the card, not merely near it.
            const hit = document.elementFromPoint(x, y);
            if (!hit || hit.closest('a[href]') !== a) return null;
            return { x, y };
          })()`,
        );
        check(`${locale}: card ${k + 1} (${tier}) is hittable`, spot !== null);
        if (!spot) continue;
        await page.click(spot.x, spot.y);
        const arrived = await page.waitFor(
          `location.pathname === ${JSON.stringify(r.builds())}`,
          8000,
        );
        check(`${locale}: pressing ${tier} navigates to ${r.builds()}`, arrived);
        const stored = await page.evaluate<string | null>(
          `(() => { try { return localStorage.getItem(${JSON.stringify(TIER_KEY)}); } catch { return null; } })()`,
        );
        check(`${locale}: …and it recorded ${tier}`, stored === tier, String(stored));
        const keys = await page.evaluate<string[]>(
          `(() => { try { return Object.keys(localStorage); } catch { return ['?']; } })()`,
        );
        check(
          `${locale}: …and touched no other key`,
          keys.length === 1 && keys[0] === TIER_KEY,
          JSON.stringify(keys),
        );
      }

      // A control for the write assertions above: with storage cleared and no
      // press, the key really is absent — so "it recorded X" is not passing on
      // a value that was there all along.
      await page.goto(site.origin + r.home());
      await page.evaluate(`localStorage.clear()`);
      const empty = await page.evaluate<string | null>(
        `localStorage.getItem(${JSON.stringify(TIER_KEY)})`,
      );
      check(`${locale}: control — with nothing pressed the key is absent`, empty === null, String(empty));

      // ---------------------------------------------------------------------
      // And the class summary, once, in a browser: every entry has a live
      // target. The HTML half proved the ids are in the document; this proves
      // the browser resolves them, which is what a reader's press does.
      // ---------------------------------------------------------------------
      const cls = getClasses(locale)[0];
      await page.setViewport(1280);
      await page.goto(site.origin + routes(locale).class(cls.slug as Slug));
      const resolved = await page.evaluate<{ total: number; live: number; skills: boolean }>(
        `(() => {
          const box = document.querySelector('[data-section-nav]');
          const links = box ? [...box.querySelectorAll('a[href^="#"]')] : [];
          return {
            total: links.length,
            live: links.filter((a) => document.getElementById(a.getAttribute('href').slice(1))).length,
            skills: links.some((a) => a.getAttribute('href') === '#skills'),
          };
        })()`,
      );
      check(`${locale}: ${cls.slug} — the summary is in the document`, resolved.total > 0, JSON.stringify(resolved));
      check(
        `${locale}: ${cls.slug} — every entry resolves in the browser`,
        resolved.total > 0 && resolved.live === resolved.total,
        JSON.stringify(resolved),
      );
      check(`${locale}: ${cls.slug} — #skills is among them`, resolved.skills);
    }

    // -----------------------------------------------------------------------
    console.log(`\nwhere a summary entry lands`);
    // -----------------------------------------------------------------------
    for (const l of LOCALES) {
      const locale = l as Locale;
      const r = routes(locale);
      for (const slug of ANCHOR_CLASSES) {
        const url = site.origin + r.class(slug as Slug);
        for (const width of ANCHOR_WIDTHS) {
          await page.setViewport(width);

          for (const how of ["a load carrying #skills", "a press on the entry"] as const) {
            if (how === "a load carrying #skills") {
              /*
               * A blank document first, and it is load-bearing. The previous
               * case left the browser on this same URL, and navigating from
               * `…/sorceress` to `…/sorceress#skills` is a *same-document*
               * navigation: nothing reloads, nothing re-hydrates, and the
               * section lands correctly because the page had finished growing
               * minutes ago. Written without this, the gate failed only at the
               * first width of the sweep and passed at the other three — on a
               * build measured, at those widths, to be 86 to 428px out.
               */
              await page.goto("about:blank");
              await page.goto(`${url}#skills`);
            } else {
              await page.goto(url);
              await page.waitFor(
                `(() => { const d = document.querySelector('header details');
                   return !!d && Object.keys(d).some(k => k.startsWith('__react')); })()`,
                10_000,
              );
              const pressed = await pressEntry(page, "#skills");
              check(`${locale} ${slug} @${width}: the entry is hittable`, pressed);
              if (!pressed) continue;
            }

            const took = await settled(page);
            const where = `${locale} ${slug} @${width}, ${how}`;
            check(`${where}: the page settles`, took >= 0, `${took}ms`);
            const landing = JSON.parse(await page.evaluate<string>(LANDING("skills"))) as Landing;
            check(`${where}: #skills is on the page`, landing.found);
            if (!landing.found) continue;

            /*
             * Two assertions, and the first is the reader's sentence: the
             * heading is below the sticky header rather than behind it. The
             * second is the one that catches this defect — a section 338px
             * low is still "visible", so "somewhere on screen" would have
             * passed on every broken width.
             */
            check(
              `${where}: the heading clears the header (${landing.headingTop} ≥ ${landing.header})`,
              landing.headingTop !== null &&
                landing.headingTop >= landing.header &&
                landing.headingTop < landing.viewport,
              JSON.stringify(landing),
            );
            check(
              `${where}: it lands at the ${landing.contract}px the stylesheet promises`,
              Math.abs(landing.top - landing.contract) <= 2,
              `landed at ${landing.top}, off by ${landing.top - landing.contract} (${took}ms)`,
            );
          }
        }
      }
    }

    /*
     * And one entry that is not `#skills`, because the defect is not either:
     * everything below `#builds` moves when `#builds` grows, and a correction
     * that only knew about one id would be a coincidence rather than a fix.
     */
    for (const l of LOCALES) {
      const locale = l as Locale;
      await page.setViewport(390);
      await page.goto("about:blank");
      await page.goto(`${site.origin}${routes(locale).class("sorceress" as Slug)}#breakpoints`);
      await settled(page);
      const landing = JSON.parse(
        await page.evaluate<string>(LANDING("breakpoints")),
      ) as Landing;
      check(`${locale}: sorceress #breakpoints is on the page`, landing.found);
      if (!landing.found) continue;
      check(
        `${locale} @390: #breakpoints lands at the ${landing.contract}px the stylesheet promises`,
        Math.abs(landing.top - landing.contract) <= 2,
        `landed at ${landing.top}, off by ${landing.top - landing.contract}`,
      );
    }

    /*
     * Controls for the block above, so a green there is not green-on-nothing.
     *
     * The contract has to be a real width-conditional number — it is 104px
     * below `sm` and 144px from it up — or `Math.abs(top - contract) <= 2`
     * could be two −1s agreeing. And the measurement has to be able to move:
     * a 400px block planted above the section must show up as the section
     * being 400px lower, which is this defect's exact shape.
     */
    {
      const r = routes(LOCALES[0] as Locale);
      const url = site.origin + r.class("sorceress" as Slug);
      await page.setViewport(390);
      await page.goto(`${url}#skills`);
      await settled(page);
      const narrow = JSON.parse(await page.evaluate<string>(LANDING("skills"))) as Landing;
      await page.setViewport(1280);
      await page.goto(`${url}#skills`);
      await settled(page);
      const wide = JSON.parse(await page.evaluate<string>(LANDING("skills"))) as Landing;
      check(
        "control: the contract is width-conditional, not a constant or a −1",
        narrow.contract === 104 && wide.contract === 144,
        `${narrow.contract} / ${wide.contract}`,
      );

      const shift = JSON.parse(
        await page.evaluate<string>(
          `(() => {
            const el = document.getElementById('skills');
            const top = () => Math.round(el.getBoundingClientRect().top);
            const height = () => document.body.scrollHeight;
            const before = top();
            const grewFrom = height();
            const spacer = document.createElement('div');
            spacer.style.height = '400px';
            el.parentElement.insertBefore(spacer, el);
            const out = { moved: top() - before, grew: height() - grewFrom };
            spacer.remove();
            return JSON.stringify(out);
          })()`,
        ),
      ) as { moved: number; grew: number };
      check(
        "control: content planted above the section moves the reading by exactly what it added",
        shift.moved >= 400 && shift.moved === shift.grew,
        JSON.stringify(shift),
      );
    }
  } finally {
    page.close();
    site.stop();
  }

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length > 0) {
    for (const f of failures) console.error(`  FAIL ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`  the gate could not run: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
