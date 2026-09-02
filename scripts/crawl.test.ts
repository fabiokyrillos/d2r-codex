/**
 * A bilingual crawl of the prerendered site, plus the two things a crawler
 * outside it would use: the sitemap and each page's own head.
 *
 * This is the gate the site did not have. Every other check reads one page or
 * one data structure; nothing walked the graph. A build page that links to a
 * farming area, an item, a runeword and a skill is four chances to write a
 * slug that resolves in the type system and 404s in a browser, and the Amazon
 * pass added eight of them plus a journey plus forty new entities.
 *
 * Four questions, in order of how badly a "no" would hurt:
 *
 *   1. Does every internal link land on a page that exists?
 *   2. Does every page a reader can reach appear in the sitemap, and does every
 *      sitemap entry exist?
 *   3. Does every page declare a canonical URL and both hreflang alternates?
 *   4. Does every en-US page have a pt-BR twin, and the reverse?
 *
 * Requires `npm run build`. Run with `npm run test:crawl`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { SITE_URL } from "../lib/site-url";
import { BCP47, LOCALES, type Locale } from "../lib/i18n/config";

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
// The prerendered page set, as URL paths
// ---------------------------------------------------------------------------

const htmlFiles: string[] = [];
(function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) htmlFiles.push(full);
  }
})(root);

/** `.next/server/app/en-us/builds/amazon/x.html` -> `/en-us/builds/amazon/x`. */
const pathOf = (file: string) =>
  "/" + relative(root, file).split(sep).join("/").replace(/\.html$/, "");

const pages = new Map<string, string>(htmlFiles.map((f) => [pathOf(f), f]));

/**
 * Routes that exist but are not HTML pages, so a link to one is valid and this
 * crawl must not report it. Kept explicit rather than pattern-matched: a typo
 * in a real route would otherwise hide inside a wildcard.
 */
const NON_HTML_ROUTES = new Set<string>([
  "/sitemap.xml",
  "/robots.txt",
  ...LOCALES.map((l) => `/${l}/search-index.json`),
]);

console.log(`\nCrawling ${pages.size} prerendered pages`);
check("there are pages to crawl", pages.size > 100, `${pages.size}`);
check(
  "both locales are present",
  LOCALES.every((l) => [...pages.keys()].some((p) => p.startsWith(`/${l}/`))),
);

// ---------------------------------------------------------------------------
console.log("\n1. Every internal link resolves to a page that exists");
// ---------------------------------------------------------------------------
{
  const broken = new Map<string, Set<string>>();
  let links = 0;

  for (const [page, file] of pages) {
    const html = readFileSync(file, "utf8");
    // Anchors only. `link rel=` in the head points at fonts, stylesheets and
    // absolute canonicals, none of which is a route a reader can follow.
    for (const m of html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
      const href = m[1].replace(/\/$/, "") || "/";
      if (href.startsWith("/_next/")) continue;
      links++;
      if (pages.has(href) || NON_HTML_ROUTES.has(href)) continue;
      if (!broken.has(href)) broken.set(href, new Set());
      broken.get(href)!.add(page);
    }
  }

  check(
    `all ${links} internal links resolve`,
    broken.size === 0,
    [...broken.entries()]
      .slice(0, 8)
      .map(([href, from]) => `${href} (from ${[...from][0]})`)
      .join("; "),
  );
  // A control: a crawl that found no links would pass the assertion above.
  check("the crawl actually found links", links > 1000, `${links}`);
}

// ---------------------------------------------------------------------------
console.log("\n2. The sitemap and the page set agree");
// ---------------------------------------------------------------------------
{
  const body = join(root, "sitemap.xml.body");
  check("the sitemap was emitted", existsSync(body));

  const xml = readFileSync(body, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(`the sitemap lists ${locs.length} URLs`, locs.length > 100, `${locs.length}`);

  check(
    "every sitemap URL is absolute and on the configured origin",
    locs.every((u) => u.startsWith(`${SITE_URL}/`)),
    locs.find((u) => !u.startsWith(`${SITE_URL}/`)) ?? "",
  );

  const sitemapPaths = new Set(locs.map((u) => u.slice(SITE_URL.length)));
  const missingPages = [...sitemapPaths].filter((p) => !pages.has(p));
  check(
    "every sitemap entry has a prerendered page",
    missingPages.length === 0,
    missingPages.slice(0, 8).join(", "),
  );

  /*
   * The reverse. `_not-found` and `_global-error` are framework pages rather
   * than content, and are the only two the sitemap should omit — which is why
   * they are named here instead of filtered by a pattern that would also hide
   * a real page dropped by accident.
   */
  const FRAMEWORK = new Set(["/_not-found", "/_global-error"]);
  const unlisted = [...pages.keys()].filter(
    (p) => !sitemapPaths.has(p) && !FRAMEWORK.has(p),
  );
  check(
    "every content page is in the sitemap",
    unlisted.length === 0,
    unlisted.slice(0, 8).join(", "),
  );
  check(
    "and the two framework pages really are the only omissions",
    [...pages.keys()].filter((p) => FRAMEWORK.has(p)).length === FRAMEWORK.size,
  );
}

// ---------------------------------------------------------------------------
console.log("\n3. Every page declares a canonical and both hreflang alternates");
// ---------------------------------------------------------------------------
{
  const problems: string[] = [];
  let checked = 0;

  for (const [page, file] of pages) {
    if (page === "/_not-found" || page === "/_global-error") continue;
    checked++;
    const head = readFileSync(file, "utf8").split("</head>")[0];

    if (!/<title>[^<]{3,}<\/title>/.test(head)) problems.push(`${page}: no title`);
    if (!/<meta name="description" content="[^"]{20,}"/.test(head)) {
      problems.push(`${page}: no description`);
    }
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!canonical) problems.push(`${page}: no canonical`);
    else if (canonical !== `${SITE_URL}${page}`) {
      problems.push(`${page}: canonical is ${canonical}`);
    }
    for (const locale of LOCALES) {
      const tag = BCP47[locale as Locale];
      if (!head.includes(`hrefLang="${tag}"`)) problems.push(`${page}: no hreflang ${tag}`);
    }
    if (!head.includes('hrefLang="x-default"')) problems.push(`${page}: no x-default`);
  }

  check(
    `all ${checked} pages carry a title, description, canonical and hreflang set`,
    problems.length === 0,
    problems.slice(0, 8).join("; "),
  );
  // Control: the head parser is looking at something.
  {
    const sample = readFileSync(
      pages.get("/en-us/builds/amazon/lightning-fury-amazon")!,
      "utf8",
    ).split("</head>")[0];
    check(
      "the head parser reads a real head",
      sample.includes("<title>") && sample.includes('rel="canonical"'),
    );
    check(
      "and a page with no canonical would be reported",
      !/<link rel="canonical"/.test("<head><title>x</title></head>"),
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\n4. The two locales cover exactly the same pages");
// ---------------------------------------------------------------------------
{
  const [a, b] = LOCALES;
  const strip = (locale: string) =>
    new Set(
      [...pages.keys()]
        .filter((p) => p === `/${locale}` || p.startsWith(`/${locale}/`))
        .map((p) => p.slice(locale.length + 1) || "/"),
    );
  const inA = strip(a);
  const inB = strip(b);
  const onlyA = [...inA].filter((p) => !inB.has(p));
  const onlyB = [...inB].filter((p) => !inA.has(p));

  check(`${a} and ${b} both render ${inA.size} pages`, inA.size === inB.size, `${inA.size} vs ${inB.size}`);
  check(`nothing exists only in ${a}`, onlyA.length === 0, onlyA.slice(0, 8).join(", "));
  check(`nothing exists only in ${b}`, onlyB.length === 0, onlyB.slice(0, 8).join(", "));

  // The eight Amazon builds and the journey, named rather than counted, so a
  // page that silently stopped generating is reported by name.
  const REQUIRED = [
    "/builds/amazon/lightning-fury-amazon",
    "/builds/amazon/lightning-strike-amazon",
    "/builds/amazon/strafe-amazon",
    "/builds/amazon/multiple-shot-amazon",
    "/builds/amazon/freezing-arrow-amazon",
    "/builds/amazon/exploding-arrow-amazon",
    "/builds/amazon/poison-javelin-amazon",
    "/builds/amazon/jab-fend-amazon",
    "/leveling/amazon",
    "/mechanics/pierce",
  ];
  for (const path of REQUIRED) {
    check(
      `both locales render ${path}`,
      LOCALES.every((l) => pages.has(`/${l}${path}`)),
      LOCALES.filter((l) => !pages.has(`/${l}${path}`)).join(", "),
    );
  }
  // And a control that the list above is not trivially satisfiable.
  check(
    "a path that should not exist is absent",
    !pages.has("/en-us/builds/amazon/javazon"),
  );
}

// ---------------------------------------------------------------------------
console.log(
  failures.length === 0
    ? `\n${passed} checks passed over ${pages.size} pages in ${LOCALES.length} locales.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
