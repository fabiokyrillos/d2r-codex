/**
 * The publication precondition nothing else can catch.
 *
 * `SITE_URL` falls back to `http://localhost:3000` when no environment variable
 * is set, which is right for development and silently wrong for a deploy: every
 * canonical tag, every hreflang alternate, every Open Graph URL and every entry
 * in the sitemap would point at a machine nobody can reach. The build succeeds,
 * the crawl succeeds, and the site is unindexable.
 *
 * Two modes, because the same command has to be safe locally and strict at the
 * gate:
 *
 *   default        report what resolved; a localhost fallback is expected
 *   --production   fail on anything that is not a public https URL
 *
 * `NODE_ENV=production` implies `--production`, so a production build that
 * forgets the variable is caught by the environment it already declares.
 *
 * Run with `npm run check:site-url` or `npm run check:site-url -- --production`.
 */
import { SITE_URL } from "../lib/site-url";
import { LOCALES, BCP47 } from "../lib/i18n/config";

const strict =
  process.argv.includes("--production") || process.env.NODE_ENV === "production";

const problems: string[] = [];
const note = (s: string) => console.log(`  ${s}`);

console.log(`\nResolved SITE_URL: ${SITE_URL}`);
note(
  `from ${
    process.env.NEXT_PUBLIC_SITE_URL
      ? "NEXT_PUBLIC_SITE_URL"
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? "VERCEL_PROJECT_PRODUCTION_URL"
        : process.env.VERCEL_URL
          ? "VERCEL_URL"
          : "the development fallback"
  }`,
);
note(`mode: ${strict ? "production (strict)" : "development (advisory)"}`);

let url: URL | null = null;
try {
  url = new URL(SITE_URL);
} catch {
  problems.push(`SITE_URL is not a valid URL: ${SITE_URL}`);
}

const isLocal =
  url !== null &&
  (["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(url.hostname) ||
    url.hostname.endsWith(".local"));

if (url) {
  if (SITE_URL.endsWith("/")) problems.push("SITE_URL must not end with a slash");
  if (url.pathname !== "/") problems.push(`SITE_URL must be an origin, not ${url.pathname}`);
  if (url.search || url.hash) problems.push("SITE_URL must carry no query or fragment");
}

console.log("\nWhat this URL becomes:");
note(`canonical   ${SITE_URL}/en-us/classes/paladin/skills/blessed-hammer`);
for (const l of LOCALES) note(`hreflang    ${BCP47[l]} -> ${SITE_URL}/${l}/...`);
note(`x-default   ${SITE_URL}/classes/paladin/skills/blessed-hammer`);
note(`sitemap     ${SITE_URL}/sitemap.xml`);
note(`og:url      ${SITE_URL}/en-us`);

console.log("");
if (isLocal) {
  if (strict) {
    problems.push(
      `SITE_URL resolves to ${url!.origin}. Canonical tags, hreflang alternates, ` +
        `Open Graph URLs and the sitemap would all point at localhost. ` +
        `Set NEXT_PUBLIC_SITE_URL to the public origin before deploying.`,
    );
  } else {
    note("localhost — fine for development. A production build must set NEXT_PUBLIC_SITE_URL.");
  }
} else if (url && url.protocol !== "https:" && strict) {
  problems.push(`SITE_URL is ${url.protocol}//. A published site must be https.`);
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  x ${p}`);
  process.exit(1);
}
console.log(strict ? "SITE_URL is publishable.\n" : "SITE_URL is usable for this mode.\n");
