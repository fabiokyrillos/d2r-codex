/**
 * The preference module, and the boot script it generates.
 *
 * Everything here is a fact about pure functions, so none of it needs a
 * build or a browser — this runs in `check`, not `check:built`, and it is
 * the fastest place to catch the mistakes that would otherwise only show up
 * as a mis-rendered page.
 *
 * Three of these tests exist because of a specific failure mode:
 *
 *   - **The hyphenated slug.** `early-hell` is the tier a naive
 *     `hash.split("-")[1]` gets wrong, and it is the only one, so a parser
 *     that works on the other five looks correct.
 *   - **Reading must not write.** `mobile-navigation.test.ts:383` asserts
 *     that storage is empty after navigating. A module that seeded a default
 *     on read would turn that gate red under the name "the mobile menu
 *     broke".
 *   - **The property access, not just the call.** With site data blocked,
 *     `window.localStorage` throws on the *getter*. A `try` around
 *     `localStorage.getItem(...)` alone still throws.
 *
 * Run with `npm run test:prefs`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  PREF_KEYS,
  PREF_KEY_PREFIXES,
  IMPLEMENTED_PREF_KEYS,
  TIER_KEY,
  TIER_ANCHOR_PREFIX,
  isTier,
  readTier,
  writeTier,
  clearTier,
  tierAnchorId,
  tierAnchorHref,
  tierFromHash,
  resolveActiveTier,
  tierBootScript,
  anchorOffsetPx,
} from "../lib/prefs";
import { PROGRESSION_TIERS, type ProgressionTier } from "../lib/types";

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

// ---------------------------------------------------------------------------
// A fake store, so the storage rules can be exercised without a browser
// ---------------------------------------------------------------------------

type Throw = "none" | "get" | "set" | "remove" | "access";

interface Fake {
  store: Map<string, string>;
  writes: number;
  removes: number;
}

let fake: Fake = { store: new Map(), writes: 0, removes: 0 };

function installStorage(mode: Throw): Fake {
  fake = { store: new Map(), writes: 0, removes: 0 };
  const boom = (): never => {
    throw new Error("SecurityError");
  };
  const impl = {
    getItem: (k: string) => (mode === "get" ? boom() : (fake.store.get(k) ?? null)),
    setItem: (k: string, v: string) => {
      if (mode === "set") boom();
      fake.writes++;
      fake.store.set(k, v);
    },
    removeItem: (k: string) => {
      if (mode === "remove") boom();
      fake.removes++;
      fake.store.delete(k);
    },
    get length() {
      return fake.store.size;
    },
    key: (i: number) => [...fake.store.keys()][i] ?? null,
    clear: () => fake.store.clear(),
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      if (mode === "access") boom();
      return impl as unknown as Storage;
    },
  });
  return fake;
}

function removeStorage(): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      return undefined;
    },
  });
}

const settle = (fn: () => unknown): { ok: boolean; value: unknown } => {
  try {
    return { ok: true, value: fn() };
  } catch {
    return { ok: false, value: undefined };
  }
};

// ---------------------------------------------------------------------------
// 1. The closed list
// ---------------------------------------------------------------------------

console.log("\nthe closed list of preference keys");

check(
  "d2rc.tier is the only key Phase 1 implements",
  IMPLEMENTED_PREF_KEYS.length === 1 && IMPLEMENTED_PREF_KEYS[0] === "d2rc.tier",
  IMPLEMENTED_PREF_KEYS.join(", "),
);
check("TIER_KEY agrees with the list", TIER_KEY === "d2rc.tier", TIER_KEY);
check(
  "every implemented key is on the documented list",
  IMPLEMENTED_PREF_KEYS.every((k) => (PREF_KEYS as readonly string[]).includes(k)),
);
check(
  "the documented list is the four of R-PREF-3",
  PREF_KEYS.length === 4 &&
    (PREF_KEYS as readonly string[]).includes("d2rc.compact") &&
    (PREF_KEYS as readonly string[]).includes("d2rc.level"),
  PREF_KEYS.join(", "),
);

/*
 * No `d2rc.` literal anywhere but this module.
 *
 * R-PREF-3's acceptance is "a test that fails if a new key is not on the
 * list". A test that only reads the list cannot fail that way; it has to go
 * looking in the source for keys nobody declared.
 */
{
  const repo = process.cwd();
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(entry)) files.push(full);
    }
  };
  for (const d of ["app", "components", "lib"]) walk(join(repo, d));

  const stray: string[] = [];
  for (const f of files) {
    if (f.endsWith(join("lib", "prefs.ts"))) continue;
    for (const m of readFileSync(f, "utf8").matchAll(/["'`](d2rc\.[A-Za-z0-9_.<>-]*)["'`]/g)) {
      const key = m[1];
      const known =
        (PREF_KEYS as readonly string[]).includes(key) ||
        PREF_KEY_PREFIXES.some((p) => key.startsWith(p));
      if (!known) stray.push(`${f.slice(repo.length + 1)} → ${key}`);
    }
  }
  check("no undeclared d2rc.* key anywhere in app/, components/ or lib/", stray.length === 0, stray.join(" | "));
}

// ---------------------------------------------------------------------------
// 2. Validation
// ---------------------------------------------------------------------------

console.log("\nvalidation");

check(
  "every canonical tier is accepted",
  PROGRESSION_TIERS.every((t) => isTier(t)),
  PROGRESSION_TIERS.filter((t) => !isTier(t)).join(", "),
);

const BAD: unknown[] = [
  "",
  " ",
  "budget ",
  " budget",
  "BUDGET",
  "Budget",
  "gear-budget",
  "#gear-budget",
  "bis,budget",
  '{"tier":"bis"}',
  "null",
  "undefined",
  "__proto__",
  "constructor",
  "toString",
  0,
  1,
  null,
  undefined,
  true,
  {},
  [],
  ["budget"],
  "x".repeat(10_000),
];
const wronglyAccepted = BAD.filter((v) => isTier(v));
check("nothing but a canonical slug is accepted", wronglyAccepted.length === 0, JSON.stringify(wronglyAccepted.slice(0, 4)));

// ---------------------------------------------------------------------------
// 3. Anchors and the hash
// ---------------------------------------------------------------------------

console.log("\nanchors and the hash");

check("the anchor prefix is the one already in production", TIER_ANCHOR_PREFIX === "gear-", TIER_ANCHOR_PREFIX);
check(
  "tierAnchorId composes the id production already serves",
  PROGRESSION_TIERS.every((t) => tierAnchorId(t) === `gear-${t}`),
  PROGRESSION_TIERS.map((t) => tierAnchorId(t)).join(", "),
);
check(
  "tierAnchorHref is the id with a hash",
  PROGRESSION_TIERS.every((t) => tierAnchorHref(t) === `#gear-${t}`),
);
check(
  "every anchor round-trips back to its tier",
  PROGRESSION_TIERS.every((t) => tierFromHash(tierAnchorHref(t)) === t),
);
check(
  "the hyphenated slug survives — #gear-early-hell is not #gear-early",
  tierFromHash("#gear-early-hell") === "early-hell",
  String(tierFromHash("#gear-early-hell")),
);

const BAD_HASH = [
  "",
  "#",
  "#gear-",
  "#gear",
  "gear-budget",
  "#gear-bogus",
  "#gear-early",
  "#gear-hell",
  "#skills",
  "#gear-budget-heading",
  "#GEAR-BUDGET",
  "#gear-budget ",
];
const hashAccepted = BAD_HASH.filter((h) => tierFromHash(h) !== null);
check("no malformed hash resolves to a tier", hashAccepted.length === 0, hashAccepted.join(", "));

// ---------------------------------------------------------------------------
// 4. Resolution — the 3x3 matrix
// ---------------------------------------------------------------------------

console.log("\nresolution: hash beats preference, and neither invents the other");

interface Row {
  hash: string;
  stored: string | null;
  active: ProgressionTier | null;
  source: string;
  preferred: ProgressionTier | null;
}

const MATRIX: Row[] = [
  // hash valid
  { hash: "#gear-starter", stored: null, active: "starter", source: "hash", preferred: null },
  { hash: "#gear-starter", stored: "bogus", active: "starter", source: "hash", preferred: null },
  { hash: "#gear-starter", stored: "bis", active: "starter", source: "hash", preferred: "bis" },
  { hash: "#gear-bis", stored: "bis", active: "bis", source: "hash", preferred: "bis" },
  // hash invalid
  { hash: "#gear-bogus", stored: null, active: null, source: "none", preferred: null },
  { hash: "#gear-bogus", stored: "bogus", active: null, source: "none", preferred: null },
  { hash: "#gear-bogus", stored: "budget", active: "budget", source: "preference", preferred: "budget" },
  // hash absent
  { hash: "", stored: null, active: null, source: "none", preferred: null },
  { hash: "", stored: "bogus", active: null, source: "none", preferred: null },
  { hash: "", stored: "early-hell", active: "early-hell", source: "preference", preferred: "early-hell" },
];

for (const row of MATRIX) {
  const got = resolveActiveTier({ hash: row.hash, stored: row.stored });
  const label = `hash=${row.hash || "(none)"} stored=${row.stored ?? "(none)"}`;
  check(
    `${label} → active=${row.active ?? "none"} source=${row.source} preferred=${row.preferred ?? "none"}`,
    got.active === row.active && got.source === row.source && got.preferred === row.preferred,
    `got active=${got.active ?? "none"} source=${got.source} preferred=${got.preferred ?? "none"}`,
  );
}

// ---------------------------------------------------------------------------
// 5. Storage never throws, and reading never writes
// ---------------------------------------------------------------------------

console.log("\nstorage: protected reads, and a read that leaves nothing behind");

{
  const f = installStorage("none");
  f.store.set(TIER_KEY, "budget");
  const r = settle(() => readTier());
  check("a valid stored value is read back", r.ok && r.value === "budget", String(r.value));
  check("reading wrote nothing", f.writes === 0, `${f.writes} writes`);
  check("reading removed nothing", f.removes === 0, `${f.removes} removes`);
}

for (const bad of ["", "budget ", "BUDGET", "gear-budget", '{"tier":"bis"}', "null", "bis,budget"]) {
  const f = installStorage("none");
  f.store.set(TIER_KEY, bad);
  const r = settle(() => readTier());
  check(`a corrupt value (${JSON.stringify(bad)}) reads as null`, r.ok && r.value === null, String(r.value));
  check(`  …and is kept, not deleted`, f.removes === 0 && f.store.get(TIER_KEY) === bad);
}

{
  const f = installStorage("none");
  const r = settle(() => writeTier("optimized"));
  check("writing reports success", r.ok && r.value === true, String(r.value));
  check("writing touched exactly one key", f.writes === 1 && f.store.size === 1, `${f.writes} writes, ${f.store.size} keys`);
  check("…and it is d2rc.tier with a canonical value", f.store.get(TIER_KEY) === "optimized", String(f.store.get(TIER_KEY)));
  const c = settle(() => clearTier());
  check("clearing reports success and empties the key", c.ok && c.value === true && f.store.size === 0, `${f.store.size} keys left`);
}

for (const mode of ["get", "set", "remove", "access"] as Throw[]) {
  installStorage(mode);
  const r = settle(() => readTier());
  const w = settle(() => writeTier("bis"));
  const c = settle(() => clearTier());
  check(`localStorage throwing on ${mode}: readTier does not throw`, r.ok, "it threw");
  check(`  …and returns null`, r.ok && r.value === null, String(r.value));
  check(`  …writeTier does not throw and reports failure`, w.ok && w.value === false, String(w.value));
  check(`  …clearTier does not throw and reports failure`, c.ok && c.value === false, String(c.value));
}

{
  removeStorage();
  const r = settle(() => readTier());
  const w = settle(() => writeTier("bis"));
  check("localStorage undefined (server, or a locked-down browser): readTier returns null", r.ok && r.value === null);
  check("  …and writeTier reports failure without throwing", w.ok && w.value === false);
}

// ---------------------------------------------------------------------------
// 6. The boot script
// ---------------------------------------------------------------------------

console.log("\nthe inline boot script");

{
  const src = tierBootScript();
  check("the script has a body", src.trim().length > 0, `${src.length} chars`);
  check("it cannot close its own <script> tag", !/<\/script/i.test(src));
  check("it opens no comment that would swallow the page", !src.includes("<!--"));
  check("it is wrapped in try/catch", /try\s*\{/.test(src) && /catch/.test(src));
  check("it names the one key it may touch", src.includes(TIER_KEY));
  check(
    "it enumerates exactly the six canonical tiers",
    PROGRESSION_TIERS.every((t) => src.includes(t)),
  );
  check("it does not call scrollIntoView", !src.includes("scrollIntoView"));

  /*
   * The script and the module must not drift.
   *
   * The script is a string, so nothing type-checks it against the module it
   * mirrors. Running it against a hand-rolled document and comparing the
   * result to `resolveActiveTier` is the only thing that keeps the two
   * honest, and it is the whole reason `tierBootScript()` is a function
   * rather than a literal in a component.
   */
  const fakeDoc = (open: string[]) => {
    const els = new Map<string, { id: string; attrs: Set<string> }>();
    for (const t of PROGRESSION_TIERS) {
      const el = { id: `gear-${t}`, attrs: new Set<string>() };
      if (open.includes(t)) el.attrs.add("open");
      els.set(el.id, el);
    }
    return {
      els,
      documentElement: { style: {} },
      getElementById: (id: string) => {
        const el = els.get(id);
        if (!el) return null;
        return {
          get open() {
            return el.attrs.has("open");
          },
          set open(v: boolean) {
            if (v) el.attrs.add("open");
            else el.attrs.delete("open");
          },
          setAttribute: (n: string) => el.attrs.add(n),
          removeAttribute: (n: string) => el.attrs.delete(n),
          hasAttribute: (n: string) => el.attrs.has(n),
          getBoundingClientRect: () => ({ top: 0, bottom: 0, height: 0 }),
        };
      },
    };
  };

  const drifted: string[] = [];
  for (const row of MATRIX) {
    const doc = fakeDoc([...PROGRESSION_TIERS]);
    const store = new Map<string, string>();
    if (row.stored !== null) store.set(TIER_KEY, row.stored);
    const win = {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: () => {
          throw new Error("the boot script must not write");
        },
        removeItem: () => {
          throw new Error("the boot script must not remove");
        },
      },
      location: { hash: row.hash },
      innerWidth: 390,
      scrollTo: () => {},
      matchMedia: () => ({ matches: false }),
    };
    const run = settle(() =>
      new Function("document", "window", "localStorage", "location", tierBootScript())(
        doc,
        win,
        win.localStorage,
        win.location,
      ),
    );
    if (!run.ok) {
      drifted.push(`${row.hash || "(none)"}/${row.stored ?? "(none)"}: threw`);
      continue;
    }
    const openNow = PROGRESSION_TIERS.filter((t) => doc.els.get(`gear-${t}`)!.attrs.has("open"));
    const want = row.active ? [row.active] : [];
    if (openNow.join(",") !== want.join(",")) {
      drifted.push(`${row.hash || "(none)"}/${row.stored ?? "(none)"}: open=[${openNow}] want=[${want}]`);
    }
  }
  check("the boot script agrees with resolveActiveTier on all 10 matrix rows", drifted.length === 0, drifted.slice(0, 3).join(" | "));
}

// ---------------------------------------------------------------------------
// 7. The anchor offset
// ---------------------------------------------------------------------------

console.log("\nthe anchor offset");

check("from 640px the offset leaves room for the sticky mirror", anchorOffsetPx(640) === 112, String(anchorOffsetPx(640)));
check("…and at 1280 too", anchorOffsetPx(1280) === 112, String(anchorOffsetPx(1280)));
check("below 640px there is no mirror, so the offset is smaller", anchorOffsetPx(390) === 72, String(anchorOffsetPx(390)));
check("…and at 320 too", anchorOffsetPx(320) === 72, String(anchorOffsetPx(320)));

// ---------------------------------------------------------------------------

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
