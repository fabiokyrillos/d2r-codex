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
   * The one shape that does not reach this page, recorded rather than hidden.
   *
   * `proxy.ts` skips anything ending in a file extension, because that rule is
   * what lets real files under `public/` be served instead of being redirected
   * to `/en-us/logo.png`. A path like `/foo.php` therefore never enters the
   * route tree and Next answers it with its own shell. It is still a correct,
   * `noindex` 404, and it is very nearly all bot traffic — worth a truthful
   * assertion, not worth weakening the rule that keeps assets working.
   */
  for (const path of ["/foo.php", "/foo.html"]) {
    const res = await get(path);
    check(`${path} is still a real 404`, res.status === 404, `got ${res.status}`);
    check(
      `  ...though served as the framework shell, not this page`,
      !visibleBody(await res.text()).includes(dictionaryFor("en-us").notFound.title),
      "it reaches the page now — tighten the assertion above",
    );
  }

  // A locale-shaped segment that is not a locale is a miss, not a crash.
  check(
    "/xx-yy/builds is redirected into a locale rather than erroring",
    (await get("/xx-yy/builds")).status === 307,
  );

  // -------------------------------------------------------------------------
  console.log("\n6. Serving this page did not cost the site its prerender");
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
