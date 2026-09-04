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
 * **Filters did not turn the listings into indexable variants.** A faceted
 * catalogue is the classic way to accidentally publish thousands of thin pages.
 * The canonical, the three hreflang alternates and the sitemap must be exactly
 * what they were before any of this existed: one URL per listing, no query
 * strings anywhere.
 *
 * Requires `npm run build`. Run with `npm run test:build-filters-html`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { getBuilds, getBuildsForClass, getClasses } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
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
  [
    "the filter region",
    (locale) => new RegExp(`aria-label="${dictionaryFor(locale).builds.filters.regionLabel}"`, "i"),
  ],
  [
    "the filter disclosure",
    (locale) =>
      new RegExp(`aria-expanded="[^"]*"[^>]*>\\s*${dictionaryFor(locale).builds.filters.showFilters}`, "i"),
  ],
];

// ===========================================================================
// The listings, without JavaScript
// ===========================================================================

const LISTINGS: { label: string; file: (l: Locale) => string; slugsFor: (l: Locale) => string[] }[] = [
  {
    label: "the catalogue",
    file: (l) => join(l, "builds.html"),
    slugsFor: (l) => getBuilds(l).map((b) => b.slug),
  },
  ...getClasses("en-us")
    .filter((c) => getBuildsForClass("en-us", c.slug).length > 0)
    .map((c) => ({
      label: `the ${c.slug} class page`,
      file: (l: Locale) => join(l, "classes", `${c.slug}.html`),
      slugsFor: (l: Locale) => getBuildsForClass(l, c.slug).map((b) => b.slug),
    })),
];

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
    `<button aria-expanded="false">${f.showFilters}</button></section>`;
  check(
    "every control marker matches a page that does render one",
    CONTROL_MARKERS.every(([, re]) => re("en-us").test(sample)),
  );
  check(
    "…and the skill tree's own aria-expanded does not trip the filter marker",
    !CONTROL_MARKERS.find(([w]) => w === "the filter disclosure")![1]("en-us").test(
      '<button aria-expanded="false" aria-controls="x"><span>Ice Bolt</span></button>',
    ),
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

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
