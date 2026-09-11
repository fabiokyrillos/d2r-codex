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
    /*
     * The build page's summary joined this list in Phase 2. It renders a
     * fragment link per section directly above the tier control, so both rules
     * below are about it: a routed `<Link href="#gear-budget">` there would hand
     * the scroll to the router on the one page whose anchor landings are
     * measured, and a stage inferred from the referrer is the same defect
     * wherever it is written.
     */
    "components/game/page-sections.tsx",
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

// ---------------------------------------------------------------------------
console.log("\nOnly three surfaces may write the tier preference");
// ---------------------------------------------------------------------------
/*
 * Every writer, by name, because §8.2 rests on it.
 *
 * `d2rc.tier` has exactly one resolution rule, and the reason it can have one is
 * that only named surfaces ever set it: the tier control on a build page, the
 * six tier cards on the home, and — since Phase 3 — the "where are you" stage
 * picker on the two build listings (R-FILT-2), which writes the same key under
 * the same R-PREF-1 contract and informs the listing of nothing but the tier.
 * Everything else — the summary included — *reads* the open tier off the DOM.
 * A fourth writer would not be a bug that fails; it would be a second rule
 * about what the preference means, arriving silently.
 *
 * Nothing saw that. Measured: `components/game/page-sections.tsx` importing
 * `writeTier` from `@/lib/prefs` and calling it in the summary nav's `onClick`
 * left `npm run test:hygiene` and `npm run test:prefs` both at exit 0.
 * `prefs.test.ts` cannot see it either — its sweep is for undeclared `d2rc.*`
 * key *literals*, and `writeTier` writes the declared one.
 *
 * So the rule is a named allowlist rather than a pattern. The scan is scoped to
 * `app/`, `components/` and `lib/`, which is where the site is; `scripts/` is
 * out of it because `scripts/prefs.test.ts` imports both functions as the units
 * it tests, and a gate that forbade that would forbid testing them at all.
 */
{
  const WRITERS = /\b(?:writeTier|clearTier)\b/;
  /** The two surfaces §8.2 names, the one R-FILT-2 adds, and nothing else. */
  const ALLOWED_WRITERS = [
    "components/game/tier-selector.tsx",
    "components/home/tier-cards.tsx",
    "components/builds/stage-picker.tsx",
  ];
  /** Where the two functions are *declared*. Declaring is not importing. */
  const WRITER_HOME = "lib/prefs.ts";

  const scanned = tracked.filter((f) => /^(app|components|lib)\//.test(f));
  const writers = scanned
    .filter((f) => f !== WRITER_HOME && !ALLOWED_WRITERS.includes(f))
    .filter((f) => WRITERS.test(stripComments(readFileSync(f, "utf8"))));
  check(
    "only the tier control, the home tier cards and the stage picker touch writeTier/clearTier",
    writers.length === 0,
    writers.join(", "),
  );

  /*
   * Controls. This is an absence claim over a name, so it is worth nothing
   * unless the name exists, every allowed file really does carry it, and the
   * pattern matches the shape the mutation used.
   */
  check(
    "control: the declaring module is still where the exemption says",
    tracked.includes(WRITER_HOME) && WRITERS.test(readFileSync(WRITER_HOME, "utf8")),
    WRITER_HOME,
  );
  check(
    "control: every allowed writer really does import one, so the allowlist is not decoration",
    ALLOWED_WRITERS.every((f) => tracked.includes(f) && WRITERS.test(stripComments(readFileSync(f, "utf8")))),
    ALLOWED_WRITERS.filter((f) => !tracked.includes(f) || !WRITERS.test(stripComments(readFileSync(f, "utf8")))).join(", "),
  );
  check(
    "control: the pattern matches the import and the call the mutation added",
    WRITERS.test('import { writeTier } from "@/lib/prefs";') && WRITERS.test("onClick={() => writeTier(slug)}"),
  );
  check(
    "control: …and does not match a longer name that merely contains one",
    !WRITERS.test("const rewriteTiers = 1; const clearTiers = 2;"),
  );
  check(
    "control: the scan covers the file the mutation put it in",
    scanned.includes("components/game/page-sections.tsx"),
  );
}

// ---------------------------------------------------------------------------
console.log("\nOnly \"My level\" may write the level preference");
// ---------------------------------------------------------------------------
/*
 * Phase 4, decision 12 (R-TREE-9, R-PREF-3, C17): the level preference
 * (`LEVEL_KEY`) has one writer, the level control at the end of the
 * skill-tree section, for the same reason the tier preference has three named
 * ones — a second writer is a second rule about what the preference means. The island *reads* the level
 * (`readLevel`) and listens for the event the writer dispatches; it never
 * writes. Same allowlist shape, same scope, same controls as above.
 */
{
  const LEVEL_WRITERS = /\b(?:writeLevel|clearLevel)\b/;
  const ALLOWED_LEVEL_WRITER = "components/game/skill-level-control.tsx";
  const WRITER_HOME = "lib/prefs.ts";

  const scanned = tracked.filter((f) => /^(app|components|lib)\//.test(f));
  const writers = scanned
    .filter((f) => f !== WRITER_HOME && f !== ALLOWED_LEVEL_WRITER)
    .filter((f) => LEVEL_WRITERS.test(stripComments(readFileSync(f, "utf8"))));
  check("only the level control touches writeLevel/clearLevel", writers.length === 0, writers.join(", "));
  check(
    "control: the declaring module is still where the exemption says",
    tracked.includes(WRITER_HOME) && LEVEL_WRITERS.test(readFileSync(WRITER_HOME, "utf8")),
    WRITER_HOME,
  );
  check(
    "control: the level control really does import one, so the allowlist is not decoration",
    tracked.includes(ALLOWED_LEVEL_WRITER) && LEVEL_WRITERS.test(stripComments(readFileSync(ALLOWED_LEVEL_WRITER, "utf8"))),
    ALLOWED_LEVEL_WRITER,
  );
  check(
    "control: the pattern matches the import and the call, and not a longer name",
    LEVEL_WRITERS.test('import { writeLevel } from "@/lib/prefs";') &&
      LEVEL_WRITERS.test("onClick={() => clearLevel()}") &&
      !LEVEL_WRITERS.test("const rewriteLevels = 1; const clearLevels = 2;"),
  );
  check("control: the scan covers the island that must only read", scanned.includes("components/game/skill-trees.tsx"));
}

// ---------------------------------------------------------------------------
console.log("\nThe skill-tree island neither routes a fragment nor scrolls the page");
// ---------------------------------------------------------------------------
/*
 * Phase 4, plan §6 and C17. Two rules the browser gate can only sample:
 *
 * **No `<Link>` with a fragment** in the grid or the tab control. The node is
 * an `<a href>` whose plain click the island intercepts, and a tab is an
 * `<a href="#<tree>">` that must never reach the router: Next's `<Link>` runs
 * its own `scrollIntoView` on a fragment, which is the one thing the section
 * must not do when a reader switches trees (R-TREE-8: no navigation).
 *
 * **No `scrollIntoView` anywhere in the island.** Focus moves with
 * `preventScroll`; the page stays where the reader left it. A hidden call
 * would pass every static assertion and move the page under a thumb.
 */
{
  const NO_LINK_FRAGMENT = ["components/game/skill-tree-grid.tsx", "components/game/skill-tree-tabs.tsx"];
  const island = tracked.filter(
    (f) => /^components\/game\/skill-tree[a-z-]*\.tsx$/.test(f) || f === "components/game/skill-level-control.tsx" || f === "components/game/use-name-fit.ts",
  );
  check("the grid and the tab control are tracked", NO_LINK_FRAGMENT.every((f) => tracked.includes(f)), NO_LINK_FRAGMENT.filter((f) => !tracked.includes(f)).join(", "));
  check("the island files are tracked", island.length >= 6, island.join(", "));

  const routed = NO_LINK_FRAGMENT.filter((f) => existsSync(f) && /<Link\b[^>]*href=\{?["'`]#/.test(stripComments(readFileSync(f, "utf8"))));
  check("no node or tab is a <Link> with a fragment", routed.length === 0, routed.join(", "));
  const SCROLLS = /\bscrollIntoView\w*\s*\(/;
  const scrolling = island.filter((f) => SCROLLS.test(stripComments(readFileSync(f, "utf8"))));
  check("no island file calls scrollIntoView", scrolling.length === 0, scrolling.join(", "));

  check(
    "control: the scroll pattern matches the call and its IfNeeded variant",
    SCROLLS.test("el.scrollIntoView({ block: 'center' })") && SCROLLS.test("el.scrollIntoViewIfNeeded()") && !SCROLLS.test("preventScroll: true"),
  );
  check(
    "control: the island uses plain anchors, so the <Link> rule has something to guard",
    NO_LINK_FRAGMENT.every((f) => existsSync(f) && /<a\b/.test(readFileSync(f, "utf8"))),
  );
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
