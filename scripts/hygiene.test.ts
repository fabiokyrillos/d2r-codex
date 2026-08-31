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
import { readFileSync } from "node:fs";

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
console.log("\nNo build output or scratch files are tracked");
// ---------------------------------------------------------------------------
const all = git(["ls-files"]).split("\n").map((s) => s.trim()).filter(Boolean);
const junk = all.filter((f) =>
  /(^|\/)(\.next|node_modules)\//.test(f) || /\.(log|tmp|bak|orig|rej|swp)$/.test(f),
);
check("no generated or scratch files are tracked", junk.length === 0, junk.slice(0, 6).join(", "));

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
