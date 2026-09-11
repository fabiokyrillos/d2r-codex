/**
 * What the *prerendered* listings contain, checked against the HTML `next build`
 * wrote.
 *
 * `build-filters.test.ts` proves the filtering rules. This proves the two
 * promises those rules are worthless without, and neither can be seen from the
 * data:
 *
 * **A reader without JavaScript still gets the whole catalogue.** `useSearchParams`
 * in a prerendered route client-renders the tree up to its Suspense boundary, so
 * the static HTML is whatever the fallback is. The fallback is the complete,
 * unfiltered list — so every build link must be in the file, exactly once, and
 * none of the interactive controls may be, because a checkbox that cannot do
 * anything is worse than no checkbox.
 *
 * **…plus the eight class chips, as links (R-FILT-14).** Since Phase 3 the
 * fallback also carries the class row, as `<a data-class href="…?class=slug">`
 * in the English slugs both languages share, so the one filter a reader without
 * scripting can reach is a link. What that link can *do* is the limit the plan
 * records (§4.4) rather than hides: a static site does not read the query, so
 * following it renders the same complete list. The browser half below drives
 * exactly that, with scripting off, and asserts the limit as it is. The
 * advanced groups, the stage picker, the sort control and the dialogs have no
 * no-JS version and must be absent from the file — there is no `<form>` and no
 * parallel GET filter (R-PREF-4 for the picker).
 *
 * **Filters did not turn the listings into indexable variants.** A faceted
 * catalogue is the classic way to accidentally publish thousands of thin pages.
 * The canonical, the three hreflang alternates and the sitemap must be exactly
 * what they were before any of this existed: one URL per listing, no query
 * strings anywhere.
 *
 * Requires `npm run build`. Run with `npm run test:build-filters-html`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds, getBuildsForClass, getClasses } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { routes } from "../lib/routes";
import { REFUSED_FILTERS } from "../lib/builds/filter";
import { SITE_URL } from "../lib/site-url";

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
const read = (rel: string): string | null => {
  const p = join(root, rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
};

/**
 * Rendered markup only.
 *
 * The RSC flight payload sits in a `<script>` and legitimately carries every
 * string the client component will need — including the checkbox legends. Left
 * in, it would make the "no controls in the static HTML" assertion pass on a
 * page that renders them and fail on one that does not, which is backwards.
 */
const markup = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, " ");

/**
 * Interactive markup only the filter component ever emits.
 *
 * Scoped narrowly on purpose. A first draft looked for `aria-expanded` and
 * failed on all four class pages — because the skill tree renders one on every
 * tile, and has since long before this. A marker that catches a neighbour's
 * markup does not prove anything about this component; it just makes the gate
 * unrunnable next to one.
 */
const CONTROL_MARKERS: readonly [string, (locale: Locale) => RegExp][] = [
  ["a checkbox", () => /<input[^>]+type="checkbox"/i],
  ["a search box", () => /<input[^>]+type="search"/i],
  /*
   * The sort control and the stage picker. Both exist only to hold state a
   * static page cannot act on — the sort has nowhere to write `?sort=`, the
   * picker has no storage to write `d2rc.tier` to — so neither is rendered
   * without scripting (R-FILT-5, R-PREF-4). A `<form>` anywhere on a listing
   * would be a parallel GET filter, which R-FILT-14 rules out.
   */
  ["a select", () => /<select\b/i],
  ["the stage picker", () => /data-stage-picker/],
  ["a form", () => /<form\b/i],
  ["the More-filters trigger", () => /data-more-filters/],
  /*
   * The dialogs.
   *
   * The sheet and the popover are mounted only while open, so a listing that
   * shipped one in its prerendered HTML would be handing a reader without
   * JavaScript a dialog with no way to close it, over a scrim nothing can
   * dismiss. `role="dialog"` is safe to look for on these two pages
   * specifically: neither the catalogue nor a class page renders any other one
   * closed, which `sheet.test.ts` asserts from the same files.
   */
  ["a dialog", () => /role="dialog"/i],
  ["the popover", () => /data-popover/],
  [
    "the sheet's close control",
    (locale) =>
      new RegExp(`aria-label="${dictionaryFor(locale).builds.filters.sheetClose}"`, "i"),
  ],
];

/**
 * The class chip links in a page's markup, attribute order notwithstanding.
 *
 * Read off the anchor tag rather than assumed from a fixed attribute order,
 * because `href` and `data-class` can legitimately come in either order and a
 * regex that fixed one would report eight links missing on a page that has
 * them.
 */
function classLinks(body: string): { slug: string; href: string | null }[] {
  return [...body.matchAll(/<a\b[^>]*\bdata-class="([^"]*)"[^>]*>/g)].map((m) => ({
    slug: m[1],
    href: /\bhref="([^"]*)"/.exec(m[0])?.[1] ?? null,
  }));
}

// ===========================================================================
// The listings, without JavaScript
// ===========================================================================

const LISTINGS: { label: string; file: (l: Locale) => string; slugsFor: (l: Locale) => string[]; catalogue: boolean }[] = [
  {
    label: "the catalogue",
    file: (l) => join(l, "builds.html"),
    slugsFor: (l) => getBuilds(l).map((b) => b.slug),
    catalogue: true,
  },
  ...getClasses("en-us")
    .filter((c) => getBuildsForClass("en-us", c.slug).length > 0)
    .map((c) => ({
      label: `the ${c.slug} class page`,
      file: (l: Locale) => join(l, "classes", `${c.slug}.html`),
      slugsFor: (l: Locale) => getBuildsForClass(l, c.slug).map((b) => b.slug),
      catalogue: false,
    })),
];

/** The eight classes, in the order the registry lists them. English slugs in every locale. */
const CLASS_SLUGS = getClasses("en-us").map((c) => c.slug);

console.log("\nThe static HTML carries every build and no dead controls");
for (const locale of LOCALES) {
  for (const listing of LISTINGS) {
    const rel = listing.file(locale);
    const html = read(rel);
    if (!html) {
      check(`${locale} ${listing.label}: prerendered`, false, `${rel} missing`);
      continue;
    }
    const body = markup(html);
    const expected = listing.slugsFor(locale);

    /*
     * The class row, as links (R-FILT-14): exactly eight on the catalogue, in
     * both languages, each pointing at the listing with `?class=<slug>` and
     * nothing else; none on a class page, whose every build is that class's
     * already. English slugs in both languages, because a shared link must
     * land both readers on the same list.
     */
    const links = classLinks(body);
    if (listing.catalogue) {
      const want = CLASS_SLUGS.map((slug) => `/${locale}/builds?class=${slug}`);
      const got = links.map((l) => l.href);
      check(
        `${locale} ${listing.label}: exactly eight class chip links, each to ?class=<slug>`,
        links.length === CLASS_SLUGS.length &&
          CLASS_SLUGS.every((slug) => links.some((l) => l.slug === slug && l.href === `/${locale}/builds?class=${slug}`)),
        `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`,
      );
      check(
        `${locale} ${listing.label}: …each slug exactly once`,
        new Set(links.map((l) => l.slug)).size === links.length,
        links.map((l) => l.slug).join(","),
      );
    } else {
      check(`${locale} ${listing.label}: no class chip links — every build here is this class's`, links.length === 0, `${links.length}`);
    }

    const missing = expected.filter(
      (slug) => !body.includes(`/${locale}/builds/`) || !body.includes(`/${slug}"`),
    );
    check(
      `${locale} ${listing.label}: all ${expected.length} builds are in the static HTML`,
      missing.length === 0,
      missing.join(","),
    );

    // Exactly once. If the fallback and the client render both landed in the
    // file, every card would be duplicated — invisible to a reader and a real
    // cost on the wire.
    const duplicated = expected.filter(
      (slug) => (body.match(new RegExp(`href="/${locale}/builds/[a-z-]+/${slug}"`, "g")) ?? []).length !== 1,
    );
    check(
      `${locale} ${listing.label}: each build link appears exactly once`,
      duplicated.length === 0,
      duplicated.join(","),
    );

    for (const [what, re] of CONTROL_MARKERS) {
      check(`${locale} ${listing.label}: no ${what} in the no-JS HTML`, !re(locale).test(body));
    }

    // And no filter copy rendered either — the strings are in the payload, not
    // on the page, which is what tells them apart.
    const t = dictionaryFor(locale);
    check(
      `${locale} ${listing.label}: no filter legend rendered`,
      !body.includes(t.builds.filters.groupDamage) && !body.includes(t.builds.filters.clearAll),
    );

    /*
     * Including the note that defines "Good at". It explains one of the
     * checkbox groups, so it belongs with them — it used to render outside the
     * boundary, which put it in this file, defining a control the no-JS reader
     * cannot see, and four screens below the group for everyone else.
     */
    const noteHead = t.builds.filters.goodAtNote.split("{")[0];
    check(
      `${locale} ${listing.label}: the "Good at" note is not in the no-JS HTML either`,
      !body.includes(noteHead),
      noteHead.slice(0, 40),
    );
  }
}

/*
 * Anti-vacuity. The markers must be findable at all, or "no controls in the
 * HTML" would pass on an empty file.
 */
console.log("\nControl: the markers are real");
{
  const f = dictionaryFor("en-us").builds.filters;
  const sample =
    `<section aria-label="${f.regionLabel}"><input type="checkbox" /><input type="search" />` +
    `<select data-sort><option>x</option></select><div data-stage-picker></div><form action="/en-us/builds"></form>` +
    `<button data-more-filters aria-expanded="false" aria-controls="x">More filters</button>` +
    `<div role="dialog" data-popover></div>` +
    `<div role="dialog" aria-modal="true"><button aria-label="${f.sheetClose}">✕</button></div>` +
    `</section>`;
  const unmatched = CONTROL_MARKERS.filter(([, re]) => !re("en-us").test(sample)).map(([w]) => w);
  check("every control marker matches a page that does render one", unmatched.length === 0, unmatched.join(", "));
  check(
    "…and the skill tree's own aria-expanded does not trip any marker",
    !CONTROL_MARKERS.some(([, re]) =>
      re("en-us").test('<button aria-expanded="false" aria-controls="x"><span>Ice Bolt</span></button>'),
    ),
  );
  /*
   * The link scan, both ways: it finds the eight links whatever the attribute
   * order, and it finds nothing on markup that merely mentions a class — a
   * card's class eyebrow is text, not a chip.
   */
  const chips = CLASS_SLUGS.map((slug, i) =>
    i % 2 === 0
      ? `<a data-class="${slug}" href="/en-us/builds?class=${slug}">x</a>`
      : `<a class="chip" href="/en-us/builds?class=${slug}" data-class="${slug}">x</a>`,
  ).join("");
  check(
    "control: the link scan reads all eight chips in either attribute order",
    classLinks(chips).length === 8 && classLinks(chips).every((l) => l.href === `/en-us/builds?class=${l.slug}`),
  );
  check(
    "control: …and reads nothing off a card that only names a class",
    classLinks('<a href="/en-us/builds/sorceress/blizzard-sorceress"><p>Sorceress</p></a>').length === 0,
  );
  const catalogue = read(join("en-us", "builds.html"));
  check(
    "the filter strings really are in the payload, so their absence from the markup is meaningful",
    catalogue !== null && catalogue.includes(dictionaryFor("en-us").builds.filters.clearAll),
  );
  check(
    "…and not in the rendered markup",
    catalogue !== null && !markup(catalogue).includes(dictionaryFor("en-us").builds.filters.clearAll),
  );

  /*
   * The same, for the copy the sheet is the only thing that renders. Without
   * this, "no sheet in the static HTML" would also pass on a build where the
   * sheet had been dropped from the bundle entirely.
   */
  for (const key of ["sheetTitle", "sheetClose", "sheetClear", "showResultsMany"] as const) {
    const value = dictionaryFor("en-us").builds.filters[key];
    check(
      `the sheet's ${key} is shipped to the client but not rendered`,
      catalogue !== null && catalogue.includes(value) && !markup(catalogue).includes(value),
      value,
    );
  }
}

// ===========================================================================
// What the browser is asked to download
// ===========================================================================

/*
 * `REFUSED_FILTERS` lives in `lib/builds/filter.ts`, which the Client Component
 * imports. It is documentation and test material — seven paragraphs of prose
 * about filters that do not exist — and nothing in the browser reads it, so it
 * must not be in the browser.
 *
 * That is a claim about tree-shaking, not about the source, so it is checked
 * against the chunks rather than argued from the import list. The control below
 * proves the scan can find this chunk at all, so an absence means absence
 * rather than a mistyped path.
 */
console.log("\nThe refusals are documentation, not payload");
{
  const chunkDir = join(process.cwd(), ".next", "static", "chunks");
  const chunks: string[] = [];
  (function walk(dir: string) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".js")) chunks.push(full);
    }
  })(chunkDir);
  check("the build produced client chunks to look at", chunks.length > 0, `${chunks.length}`);

  const text = chunks.map((c) => readFileSync(c, "utf8"));
  const leaked = REFUSED_FILTERS.filter((r) =>
    text.some((t) => t.includes(r.why.slice(0, 40))),
  );
  check(
    "no refusal prose reaches any client chunk",
    leaked.length === 0,
    leaked.map((r) => r.id).join(","),
  );
  check(
    "no refused filter id is shipped either",
    !text.some((t) => t.includes("REFUSED_FILTERS")),
  );

  // Control: the filter component itself *is* in these chunks, so the scan is
  // looking in the right place and an empty result means something.
  check(
    "control: the filter component's own strings are in the chunks the scan read",
    text.some((t) => t.includes("goodAt") && t.includes("difficulty")),
  );
}

// ===========================================================================
// Filters did not become pages
// ===========================================================================

console.log("\nCanonical, hreflang and the sitemap are untouched by filtering");
{
  const base = SITE_URL;
  const pick = (html: string, re: RegExp) => html.match(re)?.[1] ?? null;

  for (const locale of LOCALES) {
    for (const path of ["builds", join("classes", "sorceress")]) {
      const rel = join(locale, `${path}.html`);
      const html = read(rel);
      if (!html) {
        check(`${locale} /${path}: prerendered`, false, `${rel} missing`);
        continue;
      }
      const route = `/${path.split(/[\\/]/).join("/")}`;
      const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/i);
      check(
        `${locale} ${route}: canonical is the bare listing`,
        canonical === `${base}/${locale}${route}`,
        String(canonical),
      );
      for (const [tag, expected] of [
        ["en-US", `${base}/en-us${route}`],
        ["pt-BR", `${base}/pt-br${route}`],
        ["x-default", `${base}${route}`],
      ] as const) {
        const got = pick(html, new RegExp(`hreflang="${tag}" href="([^"]+)"`, "i"));
        check(`${locale} ${route}: hreflang ${tag}`, got === expected, String(got));
      }
      check(
        `${locale} ${route}: no query string in any canonical or alternate`,
        ![...html.matchAll(/<link rel="(?:canonical|alternate)"[^>]*href="([^"]+)"/gi)].some((m) =>
          m[1].includes("?"),
        ),
      );
    }
  }

  // The sitemap is generated from routes, so a filter combination can only get
  // in by someone deciding to put it there. This is the assertion that keeps
  // that decision from being made by accident.
  const sitemap = read(join("..", "sitemap.xml", "route.js"));
  const listed = sitemap ?? "";
  check(
    "the sitemap module carries no query strings",
    !/loc>[^<]*\?/.test(listed) && !listed.includes("?class=") && !listed.includes("?damage="),
  );
  check(
    "no filter parameter name appears in any prerendered canonical",
    LOCALES.every((locale) => {
      const html = read(join(locale, "builds.html")) ?? "";
      const links = [...html.matchAll(/<link rel="(?:canonical|alternate)"[^>]*href="([^"]+)"/gi)];
      return links.length > 0 && links.every((m) => !/[?&](q|class|damage|difficulty|budget|goodAt)=/.test(m[1]));
    }),
  );
}

// ===========================================================================
// The same page, in a browser, with scripting off
// ===========================================================================

/*
 * Reading the file with `<script>` stripped proves what is *served*. Driving
 * a real browser with scripting disabled proves what a reader without a
 * bundle can *do* with it, which is the R-FILT-14 question: the eight links
 * are there, following one lands on the listing — and, because a static site
 * does not read the query, on the *whole* listing. That last part is the
 * limit the plan records (§4.4): a reader without JavaScript can reach the
 * class row but cannot narrow by it, and the per-class listing for them is
 * `/classes/<slug>#builds`. It is asserted as the limit it is rather than
 * dressed up as filtering.
 *
 * Scripts are turned off *before* the navigation and stay off through the
 * probe: re-enabling them between `goto` and `evaluate` would let the bundle
 * hydrate under the probe and report the enhanced page as the plain one.
 */
async function withoutScripts(): Promise<void> {
  console.log("\nWithout JavaScript, the class row is eight links and the list is the whole list");
  const site = await startSite();
  const page = await Page.launch();
  try {
    await page.setScriptsEnabled(false);
    for (const locale of LOCALES) {
      const r = routes(locale as Locale);
      const total = getBuilds(locale as Locale).length;
      const probe = `(() => {
        const links = [...document.querySelectorAll('[data-class-chips] a[data-class][href]')].map((a) => ({ slug: a.dataset.class, href: a.getAttribute('href') }));
        const builds = new Set([...document.querySelectorAll('a[href]')]
          .map((a) => a.getAttribute('href'))
          .filter((h) => new RegExp('^/${locale}/builds/[a-z0-9-]+/[a-z0-9-]+$').test(h)));
        return {
          links,
          builds: builds.size,
          cards: document.querySelectorAll('a[data-card]').length,
          boxes: document.querySelectorAll('input[type="checkbox"]').length,
          dialogs: document.querySelectorAll('[role="dialog"]').length,
          pickers: document.querySelectorAll('[data-stage-picker]').length,
          selects: document.querySelectorAll('select').length,
          forms: document.querySelectorAll('form').length,
          buttons: document.querySelectorAll('[data-class-chips] button').length,
        };
      })()`;
      interface Plain {
        links: { slug: string; href: string }[];
        builds: number;
        cards: number;
        boxes: number;
        dialogs: number;
        pickers: number;
        selects: number;
        forms: number;
        buttons: number;
      }

      await page.setViewport(390);
      await page.goto(site.origin + r.builds());
      const plain = await page.evaluate<Plain>(probe);
      check(`${locale}: the browser shows the eight class links, and no chip is a button`, plain.links.length === 8 && plain.buttons === 0, `${plain.links.length} links, ${plain.buttons} buttons`);
      check(
        `${locale}: …each pointing at the listing with ?class=<slug>`,
        CLASS_SLUGS.every((slug) => plain.links.some((l) => l.slug === slug && l.href === `${r.builds()}?class=${slug}`)),
        JSON.stringify(plain.links),
      );
      check(`${locale}: …over the complete catalogue as cards`, plain.builds === total && plain.cards === total, `${plain.builds} builds, ${plain.cards} cards, want ${total}`);
      check(`${locale}: …with nothing a static page cannot act on`, plain.boxes === 0 && plain.dialogs === 0 && plain.pickers === 0 && plain.selects === 0 && plain.forms === 0, JSON.stringify(plain));

      // Following a link: the same complete list, the same eight links. The limit, stated.
      const first = CLASS_SLUGS[0];
      await page.goto(`${site.origin}${r.builds()}?class=${first}`);
      const followed = await page.evaluate<Plain>(probe);
      check(
        `${locale}: following ?class=${first} without scripting renders the whole catalogue — a static site cannot narrow it (plan §4.4)`,
        followed.builds === total && followed.cards === total,
        `${followed.builds} builds, ${followed.cards} cards, want ${total}`,
      );
      check(`${locale}: …and the eight links are still there to follow`, followed.links.length === 8, `${followed.links.length}`);
      check(`${locale}: …and still nothing interactive appeared`, followed.boxes === 0 && followed.dialogs === 0 && followed.selects === 0, JSON.stringify(followed));
    }
    // Control: with scripting on, the same page turns the links into buttons —
    // so "no chip is a button" above is a claim about the no-JS page, not about
    // a page that never enhances.
    await page.setScriptsEnabled(true);
    await page.goto(site.origin + routes("en-us").builds());
    const enhanced = await page.waitFor(`document.querySelectorAll('[data-class-chips] button[data-class]').length === 8`, 10_000);
    check("control: with scripting on, the same row hydrates into eight buttons", enhanced);
  } finally {
    page.close();
    site.stop();
  }
}

withoutScripts()
  .catch((err) => {
    check("the no-JS browser drive could run", false, err instanceof Error ? err.message : String(err));
  })
  .then(() => {
    console.log(`\n${passed} passed, ${failures.length} failed`);
    if (failures.length > 0) {
      console.error("\nFailures:");
      for (const f of failures) console.error(`  - ${f}`);
      process.exit(1);
    }
  });
