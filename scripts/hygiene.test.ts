/**
 * Diff hygiene: what `git diff --check` complains about, checked over the whole
 * tree rather than only over a diff.
 *
 * Nineteen whitespace errors reached `main` — eighteen build files carrying a
 * line of nothing but spaces, and a stray blank line at the end of a script.
 * `git diff --check` had found them, but nothing ran it, so nothing stopped
 * them. It is also not enough on its own: it inspects a *diff*, so a clean
 * working tree reports nothing even when committed files are full of trailing
 * whitespace. Both halves are here.
 *
 * Run with `npm run test:hygiene`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

const git = (args: string[]) =>
  execFileSync("git", args, { encoding: "utf8", cwd: process.cwd() });

// ---------------------------------------------------------------------------
console.log("\nTracked text files");
// ---------------------------------------------------------------------------
const tracked = git(["ls-files", "*.ts", "*.tsx", "*.md", "*.css", "*.mjs", "*.json"])
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

check("there are tracked files to inspect", tracked.length > 20, `${tracked.length}`);

const trailing: string[] = [];
const blankEof: string[] = [];
const noEof: string[] = [];

for (const rel of tracked) {
  let src: string;
  try {
    src = readFileSync(rel, "utf8");
  } catch {
    continue;
  }
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  lines.forEach((line, i) => {
    // The last element after a final newline is an empty string, not a line.
    if (i === lines.length - 1 && line === "") return;
    if (/[ \t]+$/.test(line)) trailing.push(`${rel}:${i + 1}`);
  });
  if (!src.endsWith("\n")) noEof.push(rel);
  if (/\n[ \t]*\n$/.test(src.replace(/\r\n/g, "\n"))) blankEof.push(rel);
}

check("no trailing whitespace", trailing.length === 0, trailing.slice(0, 6).join(", "));
check("no blank line at end of file", blankEof.length === 0, blankEof.slice(0, 6).join(", "));
check("every file ends with a newline", noEof.length === 0, noEof.slice(0, 6).join(", "));

/*
 * Anti-vacuity: the scanner must be able to see a violation. A synthetic string
 * run through the same predicates proves the regexes match what they claim to.
 */
{
  const bad = "const a = 1;   \nconst b = 2;\n\n";
  const badLines = bad.split("\n");
  const seesTrailing = badLines.some((l, i) => i < badLines.length - 1 && /[ \t]+$/.test(l));
  check("control: the scanner detects trailing whitespace in a sample", seesTrailing);
  check("control: the scanner detects a blank line at EOF in a sample", /\n[ \t]*\n$/.test(bad));
  check("control: the scanner detects a missing final newline", !"no newline".endsWith("\n"));
}

// ---------------------------------------------------------------------------
console.log("\ngit diff --check");
// ---------------------------------------------------------------------------
/*
 * Covers what the tree scan cannot: whitespace introduced in a change that has
 * not been committed yet, and conflict markers.
 */
let diffCheck = "";
let diffCheckFailed = false;
try {
  diffCheck = git(["diff", "--check"]);
} catch (e) {
  diffCheckFailed = true;
  diffCheck = (e as { stdout?: string }).stdout ?? "";
}
check("git diff --check is clean (working tree)", !diffCheckFailed, diffCheck.split("\n")[0] ?? "");

let stagedFailed = false;
let staged = "";
try {
  staged = git(["diff", "--cached", "--check"]);
} catch (e) {
  stagedFailed = true;
  staged = (e as { stdout?: string }).stdout ?? "";
}
check("git diff --cached --check is clean (staged)", !stagedFailed, staged.split("\n")[0] ?? "");

// ---------------------------------------------------------------------------
console.log("\nNo surface renders a slug as if it were a name");
// ---------------------------------------------------------------------------
/*
 * R-I18N-3. The build page printed `g.ref.slug.replace(/-/g, " ")` for the
 * mercenary's gear — lower case, unlinked, and the same string in both
 * languages — where `/mercenaries` passed the identical data through
 * `resolveRef` and got the item's real name and href. A slug is an identifier;
 * turning one into display text is always a missing lookup.
 *
 * `resolve.ts` is exempt: `titleCaseFromSlug` is the deliberate last resort
 * *inside* the resolver, for a ref whose entity is not catalogued yet.
 */
const SLUG_AS_TEXT = /\.slug\s*\.replace\s*\(/;
/**
 * Comments are prose about code, not code. A block comment that quotes the
 * expression this rule forbids — the one directly above the fix, explaining
 * what was wrong — must not be read as a violation of it. Only whole-line `//`
 * comments are stripped, so a `https://` inside an expression stays intact.
 */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
const slugRendered = tracked
  .filter((f) => /^(app|components)\//.test(f))
  .filter((f) => SLUG_AS_TEXT.test(stripComments(readFileSync(f, "utf8"))));
check(
  "no page or component turns a slug into display text",
  slugRendered.length === 0,
  slugRendered.join(", "),
);
check(
  "control: the pattern matches the expression that shipped",
  SLUG_AS_TEXT.test('{g.ref ? g.ref.slug.replace(/-/g, " ") : g.label}'),
);
check(
  "control: the pattern leaves an ordinary replace alone",
  !SLUG_AS_TEXT.test('name.replace(/-/g, " ")'),
);
check(
  "control: the comment stripper does not blind the pattern to real code",
  SLUG_AS_TEXT.test(stripComments('/* was ref.slug.replace(x) */\nconst a = ref.slug.replace(/-/g, " ");')),
);

// ---------------------------------------------------------------------------
console.log("\nNothing counts the site by hand");
// ---------------------------------------------------------------------------
/*
 * Two numbers about the site were written into prose and then went stale.
 *
 * "all 1004 pages" in `app/[lang]/layout.tsx` and `mobile-navigation.tsx`, and
 * "one of only two client components" in `search-dialog.tsx` and the README —
 * six client components by the time anyone looked. Both are statements about
 * the repository, and a statement about the repository that a human types is a
 * statement that stops being true without anything failing.
 *
 * The rule is therefore not "write the right number". It is: do not write one.
 *
 * **The two exemptions are deliberate and must stay.** `app/not-found.tsx` and
 * `scripts/not-found.test.ts` say "1009 prerendered pages" as the *record of a
 * measurement* — what a build produced on the day the 404 behaviour was
 * measured — not as a claim about today. Rewriting those to 1002 would falsify
 * the record, so they are listed here by name rather than fixed.
 */
const HISTORICAL_RECORD = ["app/not-found.tsx", "scripts/not-found.test.ts"];
/** This file quotes the sentences it forbids, as the controls below. */
const COUNT_EXEMPT = [...HISTORICAL_RECORD, "scripts/hygiene.test.ts"];
const HAND_COUNTS: [name: string, pattern: RegExp][] = [
  ["a page count", /\b\d{3,5}\s+(?:\w+\s+){0,2}(?:pages|páginas)\b|\ball\s+\d{3,5}\b/i],
  [
    "a client-component count",
    /\b(?:only|apenas|just)\s+(?:\w+\s+){0,3}client\s+components?\b|\bthe\s+only\s+client\s+components?\b/i,
  ],
];
for (const [name, pattern] of HAND_COUNTS) {
  const offenders = tracked
    .filter((f) => !COUNT_EXEMPT.includes(f))
    .filter((f) => /^(app|components|lib|scripts)\/|^README\.md$/.test(f))
    .filter((f) => pattern.test(readFileSync(f, "utf8")));
  check(`nothing states ${name}`, offenders.length === 0, offenders.join(", "));
}
check(
  "control: the page-count pattern matches both sentences that went stale",
  HAND_COUNTS[0][1].test("here — all 1004 pages are built from authored content — but a future route") &&
    HAND_COUNTS[0][1].test("is served, and the header is on all 1004 of them. So the native disclosure"),
);
check(
  "control: the client-count pattern matches both sentences that went stale",
  HAND_COUNTS[1][1].test("One of only two client components on the site, so this is where") &&
    HAND_COUNTS[1][1].test("The search dialog and the language switcher are the only client components"),
);
check(
  "control: the page-count pattern leaves an ordinary number alone",
  !HAND_COUNTS[0][1].test("Levels 75-85. A complete, self-found setup."),
);
check(
  "the historical record is still there to be exempted",
  HISTORICAL_RECORD.every((f) => tracked.includes(f) && /\b1009\b/.test(readFileSync(f, "utf8"))),
  HISTORICAL_RECORD.join(", "),
);

// ---------------------------------------------------------------------------
console.log("\nNo dictionary string is declared and never rendered");
// ---------------------------------------------------------------------------
/*
 * `hideFilters` was declared in both dictionaries, typed in the filter
 * component's props and passed across the client boundary on every page of
 * /builds — and never rendered. It cost a string in two languages and a line in
 * three files to say nothing.
 */
{
  const mentions = tracked.filter((f) => /\bhideFilters\b/.test(readFileSync(f, "utf8")));
  // `docs/` records the defect on purpose; code is what has to be clean.
  const inCode = mentions.filter((f) => /^(app|components|lib)\//.test(f));
  check("hideFilters is gone from the dictionaries, the props and the call site", inCode.length === 0, inCode.join(", "));
  check("control: the scanner can see a mention when there is one", mentions.length > 0, `${mentions.length} outside code`);
}

// ---------------------------------------------------------------------------
console.log("\nEverything in public/ is actually served to someone");
// ---------------------------------------------------------------------------
/*
 * `public/` shipped `file.svg`, `globe.svg`, `next.svg`, `vercel.svg` and
 * `window.svg` — the `create-next-app` starter's icons, referenced by nothing,
 * deployed on every build. A file in `public/` is a public URL, so an orphan
 * there is not dead code: it is a page of someone else's branding on this
 * domain.
 *
 * Files Next.js or a crawler asks for by name (`favicon.ico`, `robots.txt`,
 * `sitemap.xml`, `manifest.*`) are referenced by convention rather than by an
 * import, so they are exempt.
 */
{
  const CONVENTIONAL = /^public\/(favicon\.ico|robots\.txt|sitemap\.xml|manifest\.\w+|apple-icon\.\w+|icon\.\w+|opengraph-image\.\w+)$/;
  const assets = git(["ls-files", "public"])
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((f) => !CONVENTIONAL.test(f));
  // This file names the orphans it removed, in the comment above; counting
  // itself as a reference would make the check permanently vacuous.
  const sources = tracked.filter((f) => !f.startsWith("public/") && f !== "scripts/hygiene.test.ts");
  const bodies = sources.map((f) => readFileSync(f, "utf8"));
  const orphans = assets.filter((asset) => {
    const name = asset.slice("public/".length);
    return !bodies.some((body) => body.includes(name));
  });
  check("no file in public/ is referenced by nothing", orphans.length === 0, orphans.join(", "));
  check(
    "control: the reference scan can find a name that is used",
    bodies.some((body) => body.includes("build-freshness")),
  );
}

// ---------------------------------------------------------------------------
console.log("\nNo build output or scratch files are tracked");
// ---------------------------------------------------------------------------
const all = git(["ls-files"]).split("\n").map((s) => s.trim()).filter(Boolean);
const junk = all.filter((f) =>
  /(^|\/)(\.next|node_modules)\//.test(f) || /\.(log|tmp|bak|orig|rej|swp)$/.test(f),
);
check("no generated or scratch files are tracked", junk.length === 0, junk.slice(0, 6).join(", "));

// ---------------------------------------------------------------------------
// Phase 1: nothing infers the reader's stage, and nothing hands scroll to the router
// ---------------------------------------------------------------------------

/*
 * Two rules that are cheaper and stronger as a source scan than as a browser
 * assertion.
 *
 * **Nothing is inferred.** R-BUILD-3 says no stage may be guessed from the
 * level, the referring URL or the language. A browser test can only show that
 * a particular load did not guess; a scan shows the code has no way to. That
 * is the stronger claim, and it costs milliseconds.
 *
 * **No `<Link>` with a fragment in the tier components.** Next intercepts
 * `<Link>` and runs its own `scrollIntoView`, which would hand the one thing
 * Phase 1 must control — when the page moves — to the router. Plain `<a>` is
 * not intercepted, and every tier anchor is one.
 */
{
  const TIER_FILES = [
    "components/game/tier-selector.tsx",
    "components/game/gear-progression.tsx",
    "components/game/tier-preference-script.tsx",
    "lib/prefs.ts",
  ];
  const repoRoot = process.cwd();
  const present = TIER_FILES.filter((f) => existsSync(join(repoRoot, f)));
  check("the Phase 1 components are where this expects them", present.length === TIER_FILES.length,
    TIER_FILES.filter((f) => !present.includes(f)).join(", "));

  const INFERENCE = [
    ["document.referrer", /\bdocument\s*\.\s*referrer\b/],
    ["navigator.language", /\bnavigator\s*\.\s*languages?\b/],
    ["Accept-Language", /accept-language/i],
  ] as const;

  const inferred: string[] = [];
  const routed: string[] = [];
  for (const rel of present) {
    const src = readFileSync(join(repoRoot, rel), "utf8");
    for (const [label, re] of INFERENCE) if (re.test(src)) inferred.push(`${rel} -> ${label}`);
    if (/<Link\b[^>]*href=\{?["'`]#/.test(src)) routed.push(rel);
  }
  check("no tier component can infer a stage from the reader", inferred.length === 0, inferred.join(" | "));
  check("no tier anchor is a <Link>, which would hand scroll to the router", routed.length === 0, routed.join(", "));

  /*
   * Controls. Both rules above are absence claims, and an absence claim over a
   * file set that is empty, or a pattern that matches nothing anywhere, is
   * worth nothing.
   */
  check("control: the inference patterns do match when the thing is present",
    INFERENCE.every(([, re]) => re.test("x = document.referrer; navigator.language; Accept-Language")));
  check("control: the <Link> pattern matches a fragment link",
    /<Link\b[^>]*href=\{?["'`]#/.test('<Link href="#gear-budget">x</Link>'));
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
