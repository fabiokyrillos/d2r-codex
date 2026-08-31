/**
 * Nothing server-side may reach the browser bundle.
 *
 * `"use client"` marks a boundary, and everything a boundary file imports —
 * transitively, whether or not the symbols are used — is compiled into the
 * client bundle. The search dialog imported `searchEntries` from the
 * `@/lib/search` barrel, which also exports `buildSearchIndex`, which imports
 * `lib/registry`, which imports every content module. One convenient barrel
 * import put the entire corpus in both locales into a 1.1 MB chunk on every
 * page — 280 KB gzipped, downloaded by every visitor, while the component's own
 * comment explained that the index is fetched lazily so it would not be.
 *
 * Two halves, because either alone is escapable:
 *
 *   1. A static walk of the client module graph, which names the offending
 *      import chain rather than just the symptom.
 *   2. A scan of the chunks `next build` actually wrote, which catches a route
 *      into the bundle that the walk does not model.
 *
 * The second half needs `npm run build`. Run with `npm run test:client`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, sep } from "node:path";

import { assertFreshBuild } from "./build-freshness";

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

const repo = process.cwd();
const posix = (p: string) => relative(repo, p).split(sep).join("/");

// ---------------------------------------------------------------------------
// 1. The client module graph
// ---------------------------------------------------------------------------

const SOURCE_DIRS = ["app", "components", "lib", "content"];
const EXTS = [".ts", ".tsx", ".js", ".jsx"];

function walkFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else if (EXTS.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

const allFiles = SOURCE_DIRS.flatMap((d) => walkFiles(join(repo, d)));

/** `@/x` and relative specifiers only; bare packages are not our concern. */
function resolveImport(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(repo, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;

  for (const e of EXTS) if (existsSync(base + e)) return base + e;
  for (const e of EXTS) if (existsSync(join(base, "index" + e))) return join(base, "index" + e);
  if (existsSync(base) && statSync(base).isFile()) return base;
  return null;
}

/**
 * Import specifiers, minus the type-only ones. `import type { X }` and
 * `import { type X }` are erased before any bundler sees them, so counting them
 * would report violations that do not exist — `lib/labels.ts` legitimately
 * imports `type SearchKind` from the barrel.
 */
function importsOf(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const specs: string[] = [];
  const re = /import\s+([\s\S]*?)\s*from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g;
  for (const m of src.matchAll(re)) {
    const clause = m[1];
    const spec = m[2] ?? m[3];
    if (!spec) continue;
    if (clause !== undefined) {
      if (/^\s*type\s/.test(clause)) continue; // import type { … }
      // A clause whose every named binding is `type X` is also erased.
      const named = clause.match(/\{([\s\S]*)\}/)?.[1];
      const hasDefaultOrNamespace = /^\s*[A-Za-z_$*]/.test(clause.replace(/\{[\s\S]*\}/, "").trim());
      if (named && !hasDefaultOrNamespace) {
        const bindings = named.split(",").map((b) => b.trim()).filter(Boolean);
        if (bindings.length > 0 && bindings.every((b) => b.startsWith("type "))) continue;
      }
    }
    specs.push(spec);
  }
  return specs;
}

const clientEntries = allFiles.filter((f) => /^\s*["']use client["']/.test(readFileSync(f, "utf8")));
check("the client boundary is not empty", clientEntries.length > 0, `${clientEntries.length} entries`);
console.log(`       entries: ${clientEntries.map(posix).join(", ")}`);

/** Modules that must never be reachable from a Client Component. */
const FORBIDDEN: { label: string; test: (p: string) => boolean }[] = [
  { label: "lib/registry", test: (p) => p.startsWith("lib/registry/") || p === "lib/registry.ts" },
  { label: "content/", test: (p) => p.startsWith("content/") },
  {
    label: "the server-side search barrel",
    test: (p) => p === "lib/search/index.ts" || p === "lib/search/index.tsx",
  },
  { label: "lib/i18n/server", test: (p) => p.startsWith("lib/i18n/server") },
];

const violations: string[] = [];
for (const entry of clientEntries) {
  const seen = new Set<string>();
  const stack: { file: string; chain: string[] }[] = [{ file: entry, chain: [posix(entry)] }];
  while (stack.length) {
    const { file, chain } = stack.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const spec of importsOf(file)) {
      const target = resolveImport(file, spec);
      if (!target) continue;
      const p = posix(target);
      const hit = FORBIDDEN.find((f) => f.test(p));
      if (hit) {
        violations.push(`${hit.label} via ${[...chain, p].join(" -> ")}`);
        continue;
      }
      stack.push({ file: target, chain: [...chain, p] });
    }
  }
}
check("no Client Component reaches a server-only module", violations.length === 0,
  violations.slice(0, 4).join(" | "));

/*
 * Anti-vacuity. The walk is only meaningful if it can see through a barrel and
 * out the other side, so prove the machinery finds the chain it was built for
 * rather than trusting that an empty result means a clean graph.
 */
{
  const barrel = join(repo, "lib", "search", "index.ts");
  const reachable = new Set<string>();
  const stack = [barrel];
  while (stack.length) {
    const f = stack.pop()!;
    if (reachable.has(f)) continue;
    reachable.add(f);
    for (const spec of importsOf(f)) {
      const t = resolveImport(f, spec);
      if (t) stack.push(t);
    }
  }
  const reachesContent = [...reachable].some((f) => posix(f).startsWith("content/"));
  check("control: the search barrel really does reach content/", reachesContent);
  check(
    "control: and the barrel is therefore a module the rule would catch",
    FORBIDDEN.some((f) => f.test("lib/search/index.ts")),
  );
}

// ---------------------------------------------------------------------------
// 2. The chunks that were actually written
// ---------------------------------------------------------------------------

/*
 * Freshness, on the same contract as every other `check:built` gate.
 *
 * This half judges the chunks `next build` wrote, so a stale build makes it
 * judge the previous one — the exact failure `assertFreshBuild` was added for,
 * and the reason six of the seven gates already call it. This was the seventh.
 * Standalone, `npm run test:client` could pass against yesterday's bundle: the
 * static walk above would still catch a bad import, but the chunk scan would be
 * reporting on a build that no longer exists.
 *
 * Deliberately *after* the module-graph walk. That half reads source, needs no
 * build at all, and its verdict stands whether or not `.next` is current — so
 * it gets to print its findings before this can exit.
 *
 * Skipped when `D2R_CHUNK_DIR` points elsewhere, matching how `D2R_BUILD_ROOT`
 * is treated: an override exists so a planted control can aim a gate at a
 * deliberately corrupted copy, where staleness is the point rather than a bug.
 */
if (!process.env.D2R_CHUNK_DIR) assertFreshBuild();

const chunkDir = process.env.D2R_CHUNK_DIR ?? join(repo, ".next", "static", "chunks");
if (!existsSync(chunkDir)) {
  console.error(`  ${chunkDir} is missing — run \`npm run build\` first.`);
  process.exit(1);
}

const chunks = walkFiles(chunkDir).filter((f) => f.endsWith(".js"));
check("the build produced client chunks", chunks.length > 0, `${chunks.length}`);

/*
 * Strings that only exist in authored content or the generated graph. Each is
 * long enough that a minifier cannot invent it and a bundler cannot shorten it.
 */
const CORPUS_MARKERS: [string, string][] = [
  ["a build's prose", "The budget is tight but it closes"],
  ["an en-US skill summary", "A single freezing bolt"],
  ["a pt-BR skill summary", "projétil congelante"],
  ["a runeword's stat line", "Cannot Be Frozen"],
  ["the skill graph's banded damage", "hitShift"],
  ["the skill graph's unlock levels", "requiredLevel"],
];

const found: string[] = [];
for (const [label, needle] of CORPUS_MARKERS) {
  const hits = chunks.filter((f) => readFileSync(f, "utf8").includes(needle));
  if (hits.length) found.push(`${label} in ${hits.map((h) => posix(h)).join(", ")}`);
}
check("no corpus content appears in any client chunk", found.length === 0, found.join(" | "));

// Control: the markers must be findable somewhere, or the scan proves nothing.
const serverChunks = walkFiles(join(repo, ".next", "server")).filter((f) => f.endsWith(".js"));
const markerIsReal = CORPUS_MARKERS.some(([, needle]) =>
  serverChunks.some((f) => readFileSync(f, "utf8").includes(needle)),
);
check("control: the markers do occur in server output, so the scan is not vacuous", markerIsReal);

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
