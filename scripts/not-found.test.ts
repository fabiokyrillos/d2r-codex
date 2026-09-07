/**
 * What a reader gets when a URL does not exist.
 *
 * Every other gate in this suite reads prerendered HTML off disk. This one
 * boots the built app with `next start` instead, because the two things that
 * were wrong about a 404 here are both invisible in a `.html` file: the status
 * line, and the fact that the page was served outside the root layout.
 *
 * The bug it was written for: because the root layout lives at
 * `app/[lang]/layout.tsx`, a top-level dynamic segment, an unmatched URL had no
 * layout to render in. Next synthesised a bare document and served its own
 * English "404: This page could not be found." — no `<main>`, no stylesheet, no
 * way back, and the same English to Portuguese readers.
 *
 * Two checks here are load-bearing beyond their wording:
 *
 *   - Section 4 asserts the page survives with `<script>` blocks stripped. Two
 *     of the three ways to fix this produced correct-looking markup whose body
 *     was empty, with the real content reachable only by executing the RSC
 *     payload — a blank page for a reader with JavaScript off, and invisible to
 *     any assertion that greps the whole document.
 *   - Section 6 asserts the site is still prerendered. Resolving the reader's
 *     language here with `cookies()`/`headers()` is a dynamic API inside a
 *     boundary that belongs to every route's tree, and it silently turned all
 *     1009 static pages into on-demand renders. Nothing else in the suite
 *     notices, because the HTML it produces is identical.
 *
 * Requires `npm run build`. Run with `npm run test:not-found`.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { BCP47, LOCALES } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import {
  getBuilds,
  getClasses,
  getFarmingAreas,
  getJourneys,
  getMechanics,
  getRunes,
  getRunewords,
  getSkillsForClass,
  getUniques,
} from "../lib/registry";
import { CLASSES_WITH_SKILL_PAGES } from "../lib/skills";

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

const PORT = Number(process.env.D2R_TEST_PORT ?? 3941);
const ORIGIN = `http://127.0.0.1:${PORT}`;

/*
 * A path that cannot ever be a real page. Deliberately boring — nothing a
 * router, proxy or shell treats as special — so a failure here means "missing
 * pages are handled wrong", never "that URL was malformed".
 */
const MISSING = "this-page-does-not-exist-6f2a";

/** What the reader would see with JavaScript disabled. */
const visibleBody = (html: string) =>
  html
    .slice(Math.max(0, html.indexOf("<body")))
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<template[\s\S]*?<\/template>/g, "");

// ---------------------------------------------------------------------------
// Boot the built app
// ---------------------------------------------------------------------------

const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
if (!existsSync(nextBin)) {
  console.error(`  ${nextBin} is missing — run \`npm install\` first.`);
  process.exit(1);
}

let server: ChildProcess | null = null;

async function start(): Promise<void> {
  server = spawn(process.execPath, [nextBin, "start", "--port", String(PORT)], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let log = "";
  server.stdout?.on("data", (d) => (log += d));
  server.stderr?.on("data", (d) => (log += d));

  // Poll rather than parse the banner: the banner's wording is not a contract.
  const deadline = Date.now() + 90_000;
  for (;;) {
    try {
      await fetch(`${ORIGIN}/en-us`, { redirect: "manual" });
      return;
    } catch {
      if (Date.now() > deadline) {
        console.error(`  next start did not answer on ${ORIGIN} within 90s:\n${log}`);
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
}

// ---------------------------------------------------------------------------

async function main() {
  await start();

  const get = (path: string, headers: Record<string, string> = {}) =>
    fetch(`${ORIGIN}${path}`, { redirect: "manual", headers });

  // -------------------------------------------------------------------------
  console.log("\n1. A missing page is a real 404");
  // -------------------------------------------------------------------------
  /*
   * Asserted as a status code, not as "the page says 404 somewhere". A visual
   * 404 served with a 200 is a soft 404: search engines index it, and nothing
   * in the HTML distinguishes it from a page that rendered correctly.
   */
  let html = "";
  for (const locale of LOCALES) {
    const res = await get(`/${locale}/${MISSING}`);
    check(`/${locale}/${MISSING} responds 404`, res.status === 404, `got ${res.status}`);
    html = await res.text();
  }

  // Control: a page that exists is still a 200, so the check above is not
  // simply reporting that everything 404s.
  check("and a page that exists still responds 200", (await get("/en-us/builds")).status === 200);

  // -------------------------------------------------------------------------
  console.log("\n2. It answers in both languages, each marked as its own");
  // -------------------------------------------------------------------------
  /*
   * One page serves both locales because it cannot know which one the reader
   * wants — see the comment in `app/not-found.tsx`. So the contract is that
   * *neither* language is missing, and that each block declares its own `lang`
   * so a screen reader pronounces it correctly rather than reading Portuguese
   * with an English voice.
   */
  for (const locale of LOCALES) {
    const t = dictionaryFor(locale);

    check(
      `${locale}: a block is marked lang="${BCP47[locale]}"`,
      new RegExp(`lang="${BCP47[locale]}"`).test(html),
      "no element carries that lang",
    );
    check(`${locale}: the heading is present`, html.includes(t.notFound.title));
    check(`${locale}: the description is present`, html.includes(t.notFound.description));
    check(
      `${locale}: both actions are present`,
      html.includes(t.notFound.browseBuilds) && html.includes(t.notFound.returnHome),
    );
    check(`${locale}: links home`, html.includes(`href="/${locale}"`));
    check(`${locale}: links to Builds`, html.includes(`href="/${locale}/builds"`));
  }

  // The document keeps a single top-level heading despite carrying two
  // languages: the second is an <h2>.
  check(
    "there is exactly one <h1>",
    (html.match(/<h1[\s>]/g) ?? []).length === 1,
    `${(html.match(/<h1[\s>]/g) ?? []).length}`,
  );

  // -------------------------------------------------------------------------
  console.log("\n3. It is a page of this site, not a framework fallback");
  // -------------------------------------------------------------------------
  {
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    for (const locale of LOCALES) {
      const t = dictionaryFor(locale);
      check(`the title names the ${locale} heading`, title.includes(t.notFound.title), title);
      check(
        `the description carries the ${locale} sentence`,
        description.includes(t.notFound.description),
      );
    }

    check("has a <main> landmark", /<main[\s>]/.test(html));
    check(
      "carries the site stylesheet",
      /<link[^>]+rel="stylesheet"[^>]+href="\/_next\/static\/[^"]+\.css"/.test(html),
      "no build CSS linked",
    );
    check(
      "is not Next's default 404",
      !html.includes("This page could not be found."),
      "the framework fallback is still being served",
    );
    check("is marked noindex", /<meta name="robots" content="[^"]*noindex/.test(html));
    check(
      "declares no canonical",
      !/<link rel="canonical"/.test(html),
      "a 404 that claims a canonical URL can be indexed",
    );
    check(
      "declares no hreflang",
      !/hrefLang=/.test(html),
      "hreflang would assert this URL has a translation",
    );

    // If social tags are present they must agree — a wrong `twitter:title`
    // overrides a correct `og:title` rather than falling back to it.
    const og = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1];
    const tw = html.match(/<meta name="twitter:title" content="([^"]*)"/)?.[1];
    check("og:title and twitter:title agree", og !== undefined && og === tw, `og=${og} tw=${tw}`);
  }

  // -------------------------------------------------------------------------
  console.log("\n4. The page is in the HTML, not behind JavaScript");
  // -------------------------------------------------------------------------
  {
    const body = visibleBody(html);
    for (const locale of LOCALES) {
      const t = dictionaryFor(locale);
      check(
        `${locale}: the heading survives with scripts stripped`,
        body.includes(t.notFound.title),
        `${body.length} bytes of body without scripts`,
      );
      check(`${locale}: so does the description`, body.includes(t.notFound.description));
      check(`${locale}: so do both actions`, body.includes(t.notFound.browseBuilds));
    }
    check("and the <main> landmark", /<main[\s>]/.test(body));

    // Control: the stripper really removes scripts, so the checks above are
    // reading markup rather than a payload that happens to contain the words.
    check(
      "the script stripper removes script content",
      !visibleBody('<body><script>"Page not found"</script><p>x</p></body>').includes(
        "Page not found",
      ),
    );
  }

  // -------------------------------------------------------------------------
  console.log("\n5. Missing pages reached the other ways");
  // -------------------------------------------------------------------------
  /*
   * The proxy prefixes any unprefixed path, so an unprefixed miss is a redirect
   * to a prefixed miss. Both halves are asserted: that the redirect respects the
   * reader's language, and that the destination is a 404 rather than a loop.
   */
  for (const locale of LOCALES) {
    const accept = locale === "pt-br" ? "pt-BR,pt;q=0.9" : "en-US,en;q=0.9";
    const res = await get(`/${MISSING}`, { "accept-language": accept });
    check(`/${MISSING} redirects a ${locale} reader`, res.status === 307, `got ${res.status}`);
    check(
      `  ...to /${locale}/${MISSING}`,
      (res.headers.get("location") ?? "").endsWith(`/${locale}/${MISSING}`),
      `Location: ${res.headers.get("location")}`,
    );
    check(`  ...which is a 404, not another redirect`, (await get(`/${locale}/${MISSING}`)).status === 404);
  }

  for (const path of [
    `/en-us/${MISSING}/${MISSING}`,
    `/en-us/builds/${MISSING}/${MISSING}/${MISSING}`,
    `/pt-br/${MISSING}/${MISSING}`,
    `/api/${MISSING}`,
  ]) {
    const res = await get(path);
    const body = visibleBody(await res.text());
    check(
      `${path} is a 404 with its content in the HTML`,
      res.status === 404 && body.includes(dictionaryFor("en-us").notFound.title),
      `status ${res.status}`,
    );
  }

  /*
   * The shape that used to be the exception, and no longer is.
   *
   * `proxy.ts` skips anything ending in a file extension, because that rule is
   * what lets real files under `public/` be served instead of being redirected
   * to `/en-us/logo.png`. So `/foo.php` arrives unprefixed — but it does *not*
   * miss the route tree, which is what the note here used to claim. It matches
   * `app/[lang]/page.tsx` with `lang="foo.php"`, and the layout's `isLocale`
   * guard throws `notFound()` during render. That is the same escape hatch that
   * left every bad slug blank, and it produced the same empty shell.
   *
   * `dynamicParams = false` decides it earlier: `foo.php` is not one of the two
   * enumerated locales, so it is a routing miss before any component runs, and
   * the reader gets the real page. The assertion is inverted rather than
   * deleted, because the thing worth guarding is unchanged — that this path
   * stays a truthful 404 — and the old wording is now the failure case.
   */
  for (const path of ["/foo.php", "/foo.html"]) {
    const res = await get(path);
    check(`${path} is still a real 404`, res.status === 404, `got ${res.status}`);
    check(
      `  ...and now reaches this page rather than the framework shell`,
      visibleBody(await res.text()).includes(dictionaryFor("en-us").notFound.title),
      "back to Next's empty error document",
    );
  }

  // A locale-shaped segment that is not a locale is a miss, not a crash.
  check(
    "/xx-yy/builds is redirected into a locale rather than erroring",
    (await get("/xx-yy/builds")).status === 307,
  );

  // -------------------------------------------------------------------------
  console.log("\n6. A slug that does not exist, inside a route that does");
  // -------------------------------------------------------------------------
  /*
   * The half of "page not found" that section 5 cannot reach, and that this
   * suite was blind to for long enough to ship.
   *
   * Every URL in section 5 misses the route tree outright, so Next never runs
   * a page and answers from the prerendered `_not-found.html`. A bad *slug* is
   * the opposite: `/en-us/items/bogus-item` matches `items/[slug]` exactly, the
   * layout renders, and only then does the page call `notFound()`. A throw
   * during render never reaches a not-found boundary here — it escapes to
   * Next's error payload, which emits `<html id="__next_error__">` with an
   * empty body and leaves the content to the client. The status line was right
   * and the page was blank, which is why greps over the whole document, and
   * every assertion above, passed while nine route families served nothing.
   *
   * So each family is asserted as a pair: a real slug still answers 200, and a
   * missing one answers 404 *with the page in the markup*. The 200 half is not
   * decoration — without it, a change that made every URL 404 would pass.
   *
   * The last two rows are the cross-field misses, where every segment is real
   * and only the pairing is wrong. They take a different branch in the page
   * (`build.classSlug !== classSlug`) and are the shape most likely to come
   * back if the fix is ever narrowed to "look the slug up in one table".
   *
   * Slugs come from the same getters each route's `generateStaticParams` uses,
   * so the 200 controls cannot drift out of the prerendered set.
   */
  for (const locale of LOCALES) {
    const t = dictionaryFor(locale);

    const classSlugs = getClasses(locale).map((c) => String(c.slug));
    const otherClassThan = (slug: string) => {
      const found = classSlugs.find((c) => c !== slug);
      if (!found) throw new Error(`${locale}: no second class to build a mismatch from`);
      return found;
    };

    const build = getBuilds(locale)[0];
    const skillClass = String(CLASSES_WITH_SKILL_PAGES[0]);
    const skill = getSkillsForClass(locale, CLASSES_WITH_SKILL_PAGES[0])[0];
    const otherSkillClass = CLASSES_WITH_SKILL_PAGES.map(String).find((c) => c !== skillClass);
    if (!otherSkillClass) throw new Error("no second class with skill pages");

    const families = [
      { name: "items", ok: `/${locale}/items/${getUniques(locale)[0].slug}` },
      { name: "runes", ok: `/${locale}/runes/${getRunes(locale)[0].slug}` },
      { name: "runewords", ok: `/${locale}/runewords/${getRunewords(locale)[0].slug}` },
      { name: "mechanics", ok: `/${locale}/mechanics/${getMechanics(locale)[0].slug}` },
      { name: "farming", ok: `/${locale}/farming/${getFarmingAreas(locale)[0].slug}` },
      { name: "classes", ok: `/${locale}/classes/${classSlugs[0]}` },
      { name: "leveling", ok: `/${locale}/leveling/${getJourneys(locale)[0].classSlug}` },
      { name: "skills", ok: `/${locale}/classes/${skillClass}/skills/${skill.slug}` },
      { name: "builds", ok: `/${locale}/builds/${build.classSlug}/${build.slug}` },
    ].map((f) => ({ ...f, miss: `${f.ok.slice(0, f.ok.lastIndexOf("/"))}/${MISSING}` }));

    families.push(
      {
        name: "builds (real build, wrong class)",
        ok: `/${locale}/builds/${build.classSlug}/${build.slug}`,
        miss: `/${locale}/builds/${otherClassThan(String(build.classSlug))}/${build.slug}`,
      },
      {
        name: "skills (real skill, wrong class)",
        ok: `/${locale}/classes/${skillClass}/skills/${skill.slug}`,
        miss: `/${locale}/classes/${otherSkillClass}/skills/${skill.slug}`,
      },
    );

    for (const { name, ok, miss } of families) {
      check(`${locale} ${name}: a real slug still answers 200`, (await get(ok)).status === 200, ok);

      const res = await get(miss);
      const page = await res.text();
      const body = visibleBody(page);

      check(`${locale} ${name}: a missing slug is a 404`, res.status === 404, `${miss} → ${res.status}`);
      check(
        `${locale} ${name}: the page is in the HTML, not behind JavaScript`,
        body.includes(t.notFound.title),
        `${body.length} bytes of body without scripts`,
      );
      check(`${locale} ${name}: it offers a way out`, body.includes(t.notFound.returnHome));
      check(`${locale} ${name}: it has a <main> landmark`, /<main[\s>]/.test(body));
      check(
        `${locale} ${name}: it has exactly one <h1>`,
        (body.match(/<h1[\s>]/g) ?? []).length === 1,
        `${(body.match(/<h1[\s>]/g) ?? []).length}`,
      );
      check(
        `${locale} ${name}: it is not the framework error shell`,
        !page.includes('id="__next_error__"'),
        "served Next's empty error document",
      );

      /*
       * The soft-404 half. These pages inherit their metadata from
       * `[lang]/layout.tsx`, so a dead URL was answering with the layout's
       * canonical and both hreflang alternates — telling a crawler this URL is
       * a real page with a real translation. Section 3 already forbids that,
       * and only ever asked URLs on the other code path.
       */
      check(
        `${locale} ${name}: it claims no canonical`,
        !/<link rel="canonical"/.test(page),
        "a dead URL that names a canonical can be indexed",
      );
      check(
        `${locale} ${name}: it claims no hreflang`,
        !/hreflang=/i.test(page),
        "hreflang would assert this dead URL has a translation",
      );
      check(
        `${locale} ${name}: it is marked noindex`,
        /<meta name="robots" content="[^"]*noindex/.test(page),
      );
    }
  }

  // -------------------------------------------------------------------------
  console.log("\n7. Serving this page did not cost the site its prerender");
  // -------------------------------------------------------------------------
  /*
   * The 404 lives in a boundary that belongs to every route's tree, so a dynamic
   * API in it makes every route dynamic. That happened, and it is invisible in
   * the HTML: the pages render identically, they just stop being built. The only
   * evidence is that `.next/server/app` no longer contains them.
   */
  {
    let count = 0;
    (function walk(dir: string) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.endsWith(".html")) count++;
      }
    })(root);

    check(`the build still prerenders ${count} pages`, count > 900, `${count} .html files`);
    check(
      "and this page is one of them",
      existsSync(join(root, "_not-found.html")),
      "_not-found.html was not written — the 404 route went dynamic",
    );
  }
}

main()
  .then(() => {
    server?.kill();
    console.log(`\n${passed} passed, ${failures.length} failed`);
    if (failures.length) {
      console.log("\nFailures:");
      for (const f of failures) console.log(`  - ${f}`);
      process.exit(1);
    }
  })
  .catch((err) => {
    server?.kill();
    console.error(err);
    process.exit(1);
  });
