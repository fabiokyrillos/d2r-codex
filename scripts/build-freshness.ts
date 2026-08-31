/**
 * Where the prerendered HTML is, and whether it is current.
 *
 * Several gates read `.next/server/app` and judge what the site says. They
 * checked only that the directory existed, and `npm run check` did not build —
 * so editing a dictionary and re-running the suite validated the *previous*
 * build and reported green. The tests were right about the HTML they read; the
 * HTML was stale.
 *
 * `assertFreshBuild` compares the build against the sources that produce it and
 * refuses to run against an older one, naming the file that moved.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Directories whose contents change what `next build` writes. */
const SOURCE_DIRS = ["app", "components", "content", "lib"];
const SOURCE_FILES = ["next.config.ts", "package.json", "proxy.ts"];
const EXTS = [".ts", ".tsx", ".css", ".json", ".mjs"];

export function buildRoot(): string {
  return process.env.D2R_BUILD_ROOT ?? join(process.cwd(), ".next", "server", "app");
}

function newestSource(): { path: string; mtimeMs: number } | null {
  let newest: { path: string; mtimeMs: number } | null = null;
  const consider = (p: string) => {
    const s = statSync(p);
    if (!newest || s.mtimeMs > newest.mtimeMs) newest = { path: p, mtimeMs: s.mtimeMs };
  };
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (EXTS.some((e) => entry.endsWith(e))) consider(full);
    }
  };
  for (const d of SOURCE_DIRS) walk(join(process.cwd(), d));
  for (const f of SOURCE_FILES) {
    const p = join(process.cwd(), f);
    if (existsSync(p)) consider(p);
  }
  return newest;
}

/**
 * Exits non-zero with an instruction if the build is missing or older than the
 * sources. Skipped when `D2R_BUILD_ROOT` points somewhere else — that override
 * exists so a planted control can run a gate against a deliberately corrupted
 * copy of the build, where staleness is the point.
 */
export function assertFreshBuild(): string {
  const root = buildRoot();
  if (!existsSync(root)) {
    console.error(`  ${root} is missing — run \`npm run build\` first.`);
    process.exit(1);
  }
  if (process.env.D2R_BUILD_ROOT) return root;

  const stamp = join(process.cwd(), ".next", "BUILD_ID");
  if (!existsSync(stamp)) {
    console.error("  .next/BUILD_ID is missing — run `npm run build` first.");
    process.exit(1);
  }
  const builtAt = statSync(stamp).mtimeMs;
  const newest = newestSource();
  if (newest && newest.mtimeMs > builtAt) {
    const drift = Math.round((newest.mtimeMs - builtAt) / 1000);
    console.error(
      `  The build is stale: ${newest.path} changed ${drift}s after it was written.\n` +
        `  These checks read prerendered HTML, so running them now would judge the previous build.\n` +
        `  Run \`npm run build\` (or \`npm run verify\`, which builds first).`,
    );
    process.exit(1);
  }
  return root;
}
