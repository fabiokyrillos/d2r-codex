/**
 * `resolveRef` may not invent a URL.
 *
 * Three of the seven ref kinds — `set`, `base`, `charm` — have no page on this
 * site, and the resolver built one for them anyway: `/{locale}/items/sets/…`,
 * `/{locale}/items/bases/…`, `/{locale}/items/charms/…`. Nothing in the
 * catalogue uses those kinds today, which is exactly why it went unnoticed: the
 * first build to reference a set as a set would have shipped a link to a 404,
 * and `check:content` would not have complained, because the same resolver
 * declares those kinds "not an error".
 *
 * The rule here is stronger than "the three known kinds behave". Every href the
 * resolver produces, for every kind, has to be a URL the sitemap contains — and
 * the sitemap is generated from the registry, so it is the site's own answer to
 * "does this page exist".
 *
 * Run with `npm run test:ref-routes`.
 */
import sitemap from "../app/sitemap";
import { SITE_URL } from "../lib/site-url";
import { LOCALES } from "../lib/i18n/config";
import { getRunes, getRunewords, getUniques, resolveRef } from "../lib/registry";
import { REF_KIND_HAS_ROUTE } from "../lib/registry/resolve";
import type { RefKind, Slug } from "../lib/types";

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

/** Every page the site says it has, as locale-prefixed paths. */
const PAGES = new Set(sitemap().map((entry) => entry.url.replace(SITE_URL, "")));
check("the sitemap produced pages to compare against", PAGES.size > 900, `${PAGES.size}`);

const KINDS = Object.keys(REF_KIND_HAS_ROUTE) as RefKind[];
check("every ref kind is classified", KINDS.length === 7, KINDS.join(", "));

/**
 * A catalogued slug per routed kind, so the href points at something real.
 *
 * `set-item` shares the unique catalogue and the `/items/{slug}` route — no set
 * item is published yet, so the same slug stands in for it. That is the route
 * the kind would use, which is what this file is about.
 */
const REAL: Partial<Record<RefKind, Slug>> = {
  rune: getRunes("en-us")[0]?.slug,
  runeword: getRunewords("en-us")[0]?.slug,
  unique: getUniques("en-us")[0]?.slug,
  "set-item": getUniques("en-us")[0]?.slug,
};

// ---------------------------------------------------------------------------
console.log("\nKinds without a page get no href, and never did have one to give");
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  for (const kind of KINDS) {
    if (REF_KIND_HAS_ROUTE[kind]) continue;
    const resolved = resolveRef(locale, { kind, slug: "anything-at-all" as Slug });
    check(`${locale} ${kind}: no href`, resolved.href === undefined, resolved.href);
    check(`${locale} ${kind}: still renders a readable name`, resolved.name.length > 0, resolved.name);
    check(`${locale} ${kind}: is reported as not found`, resolved.found === false);
  }
}

// ---------------------------------------------------------------------------
console.log("\nEvery href the resolver does produce is a page the sitemap lists");
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  for (const kind of KINDS) {
    if (!REF_KIND_HAS_ROUTE[kind]) continue;
    const slug = REAL[kind];
    if (!slug) {
      check(`${locale} ${kind}: a catalogued slug exists to test with`, false, "none in the registry");
      continue;
    }
    const resolved = resolveRef(locale, { kind, slug });
    check(`${locale} ${kind}: resolves`, resolved.found, slug);
    check(
      `${locale} ${kind}: ${resolved.href} is in the sitemap`,
      resolved.href !== undefined && PAGES.has(resolved.href),
      resolved.href ?? "no href",
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nA ref to something not in the catalogue gets no href either");
// ---------------------------------------------------------------------------
/*
 * `found: false` and an href are contradictory: the href names a page that,
 * by the resolver's own admission, has nothing behind it. `ItemRefLink` already
 * refused to link an unfound ref, so this changes no rendering — it removes the
 * chance that some future caller reads `.href` without reading `.found`.
 */
for (const kind of KINDS) {
  if (!REF_KIND_HAS_ROUTE[kind]) continue;
  const resolved = resolveRef("en-us", { kind, slug: "not-a-real-slug" as Slug });
  check(`${kind}: an uncatalogued slug yields no href`, resolved.href === undefined, resolved.href);
}

// ---------------------------------------------------------------------------
console.log("\nControls");
// ---------------------------------------------------------------------------
/*
 * The sitemap comparison is the load-bearing assertion, so it has to be shown
 * capable of rejecting something. These are the three URLs the resolver used to
 * build for the routeless kinds.
 */
for (const fabricated of ["/en-us/items/sets/tal-rashas", "/en-us/items/bases/monarch", "/en-us/items/charms/gheeds"]) {
  check(`control: ${fabricated} is absent from the sitemap`, !PAGES.has(fabricated));
}
check(
  "control: a real page is present, so the set is not simply empty",
  PAGES.has(`/en-us/runes/${getRunes("en-us")[0].slug}`),
);

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed.`);
// ---------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
