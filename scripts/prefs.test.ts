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
  LEVEL_KEY,
  LEVEL_EVENT,
  isTier,
  readTier,
  writeTier,
  clearTier,
  isLevel,
  readLevel,
  writeLevel,
  clearLevel,
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

/*
 * Phase 1 implemented `d2rc.tier` alone; Phase 4 adds `d2rc.level` by the
 * owner's decision D1 (R-TREE-9). The list is asserted whole and in order,
 * because a gate that only counted it could not tell a key added from a key
 * renamed.
 */
check(
  "d2rc.tier and d2rc.level are the two keys implemented, in that order",
  IMPLEMENTED_PREF_KEYS.length === 2 &&
    IMPLEMENTED_PREF_KEYS[0] === "d2rc.tier" &&
    IMPLEMENTED_PREF_KEYS[1] === "d2rc.level",
  IMPLEMENTED_PREF_KEYS.join(", "),
);
check("TIER_KEY agrees with the list", TIER_KEY === "d2rc.tier", TIER_KEY);
check("LEVEL_KEY agrees with the list", LEVEL_KEY === "d2rc.level", LEVEL_KEY);
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

/*
 * One invariant holds for every kind of hostile storage — nothing throws —
 * and the *reported* result is per operation, not per store.
 *
 * The first version of this asserted that any throwing store made all three
 * report failure, and it failed against a correct implementation: when only
 * `getItem` throws, `setItem` still works, so a write that reports success
 * has told the truth. R-PREF-1 asks for protected reads and writes and no
 * exception when storage is blocked; it does not ask a working write to
 * claim it failed.
 */
const HOSTILE: { mode: Throw; read: null; write: boolean; clear: boolean; why: string }[] = [
  { mode: "get", read: null, write: true, clear: true, why: "reads are broken; writing and clearing are not" },
  { mode: "set", read: null, write: false, clear: true, why: "quota or a read-only store" },
  { mode: "remove", read: null, write: true, clear: false, why: "removal refused" },
  { mode: "access", read: null, write: false, clear: false, why: "site data blocked — the getter itself throws" },
];

for (const { mode, write, clear, why } of HOSTILE) {
  installStorage(mode);
  const r = settle(() => readTier());
  const w = settle(() => writeTier("bis"));
  const c = settle(() => clearTier());
  check(`throwing on ${mode} (${why}): nothing throws`, r.ok && w.ok && c.ok, "something threw");
  check(`  …readTier returns null`, r.ok && r.value === null, String(r.value));
  check(`  …writeTier reports ${write}`, w.ok && w.value === write, String(w.value));
  check(`  …clearTier reports ${clear}`, c.ok && c.value === clear, String(c.value));
}

/*
 * And the case that matters most, stated on its own: with the store's own
 * getter throwing, a read is indistinguishable from "no preference". That is
 * the state a reader with site data blocked is actually in.
 */
{
  installStorage("access");
  const r = settle(() => readTier());
  check("a reader with site data blocked looks exactly like a reader with no preference", r.ok && r.value === null);
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
// 8. My level (R-TREE-9, decision D1; plan §5.7)
// ---------------------------------------------------------------------------

console.log("\nmy level: a whole number from 1 to 99, and nothing else");

/*
 * The rule, stated once so the table below is not the specification: a value
 * is a level when it is a number or a string, `Number(v)` is an integer from
 * 1 to 99, and `String(Number(v)) === String(v)`.
 *
 * The round-trip is the half that matters. `writeLevel` stores `String(level)`
 * and nothing else, so "18" is the only spelling storage can hand back for 18;
 * "018", "1e1", " 18" and "18.0" all *parse* to a level and were all written by
 * something other than this module. R-PREF-1 says an invalid stored value is
 * ignored, and ignoring a value that merely parses is how a hand-edited "1e1"
 * would quietly become level 10.
 */
const GOOD_LEVELS: unknown[] = [1, 18, 99, "1", "18", "99"];
const BAD_LEVELS: unknown[] = [
  0, 100, -1, 18.5, 1e2, Infinity, NaN,
  "0", "100", "18.5", " 18", "18 ", "", "018", "1e1", "18.0", "+18", "-1", "1,8", "abc", "18px",
  null, undefined, true, false, [18], { valueOf: () => 18 }, "__proto__",
];
check(
  `the six valid spellings are accepted (${GOOD_LEVELS.map((v) => JSON.stringify(v)).join(", ")})`,
  GOOD_LEVELS.every((v) => isLevel(v)),
  GOOD_LEVELS.filter((v) => !isLevel(v)).map((v) => JSON.stringify(v)).join(", "),
);
{
  const wrongly = BAD_LEVELS.filter((v) => isLevel(v));
  check(
    `nothing else is — ${BAD_LEVELS.length} spellings rejected`,
    wrongly.length === 0,
    wrongly.map((v) => (typeof v === "number" ? String(v) : JSON.stringify(v))).join(", "),
  );
}
check("control: 100 is rejected (mutation M23 flips exactly this)", !isLevel(100));
check("control: the exact decimal string storage hands back is accepted", isLevel("18"));

/*
 * A fake `window`, so the event contract can be exercised without a browser.
 * Node has no `window`; the module has to look for one rather than assume it,
 * because `readLevel` runs on the server too (never at module scope, but the
 * function is imported there).
 */
const events: string[] = [];
function installWindow(mode: "ok" | "throws" | "none"): void {
  events.length = 0;
  if (mode === "none") {
    delete (globalThis as { window?: unknown }).window;
    return;
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      dispatchEvent: (event: Event) => {
        if (mode === "throws") throw new Error("a listener threw");
        events.push(event.type);
        return true;
      },
    },
  });
}

{
  const f = installStorage("none");
  f.store.set(LEVEL_KEY, "18");
  const r = settle(() => readLevel());
  check("a stored \"18\" reads back as the number 18", r.ok && r.value === 18, String(r.value));
  check("reading wrote nothing", f.writes === 0, `${f.writes} writes`);
  check("reading removed nothing", f.removes === 0, `${f.removes} removes`);
}

for (const bad of ["abc", "100", "0", "18.5", " 18", "018", "1e1", ""]) {
  const f = installStorage("none");
  f.store.set(LEVEL_KEY, bad);
  const r = settle(() => readLevel());
  check(`a corrupt level (${JSON.stringify(bad)}) reads as null`, r.ok && r.value === null, String(r.value));
  check(`  …and is kept, not deleted`, f.removes === 0 && f.writes === 0 && f.store.get(LEVEL_KEY) === bad);
}

{
  installStorage("none");
  const r = settle(() => readLevel());
  check("no stored level reads as null", r.ok && r.value === null, String(r.value));
}

for (const mode of ["get", "access"] as const) {
  const f = installStorage(mode);
  const r = settle(() => readLevel());
  check(`throwing on ${mode}: readLevel returns null without throwing`, r.ok && r.value === null, r.ok ? String(r.value) : "threw");
  check(`  …and touched nothing`, f.writes === 0 && f.removes === 0);
}

{
  removeStorage();
  const r = settle(() => readLevel());
  check("localStorage undefined: readLevel returns null", r.ok && r.value === null);
}

{
  const f = installStorage("none");
  installWindow("ok");
  f.store.set(TIER_KEY, "budget");
  const w = settle(() => writeLevel(18));
  check("writeLevel(18) reports success", w.ok && w.value === true, String(w.value));
  check("…and stores exactly \"18\" under d2rc.level", f.store.get(LEVEL_KEY) === "18", String(f.store.get(LEVEL_KEY)));
  check("…touching no other key", f.store.size === 2 && f.store.get(TIER_KEY) === "budget", [...f.store.keys()].join(", "));
  check(`…and dispatches ${LEVEL_EVENT} on window exactly once`, events.length === 1 && events[0] === LEVEL_EVENT, events.join(", "));

  events.length = 0;
  const bad = settle(() => writeLevel(100));
  check("writeLevel(100) reports failure", bad.ok && bad.value === false, String(bad.value));
  check("…stores nothing", f.store.get(LEVEL_KEY) === "18" && f.writes === 1, `${f.writes} writes`);
  check("…and dispatches nothing", events.length === 0, events.join(", "));
  const frac = settle(() => writeLevel(18.5));
  check("writeLevel(18.5) reports failure and stores nothing", frac.ok && frac.value === false && f.store.get(LEVEL_KEY) === "18");

  events.length = 0;
  const c = settle(() => clearLevel());
  check("clearLevel() reports success and removes the key", c.ok && c.value === true && !f.store.has(LEVEL_KEY), String(c.value));
  check("…leaving the tier alone", f.store.get(TIER_KEY) === "budget");
  check(`…and dispatches ${LEVEL_EVENT} once`, events.length === 1 && events[0] === LEVEL_EVENT, events.join(", "));
}

{
  const f = installStorage("none");
  installWindow("none");
  const w = settle(() => writeLevel(30));
  check("without a window the write still succeeds — the event is a courtesy, not the write", w.ok && w.value === true && f.store.get(LEVEL_KEY) === "30");
}

{
  const f = installStorage("none");
  installWindow("throws");
  const w = settle(() => writeLevel(30));
  check("a listener that throws does not turn a successful write into a failure", w.ok && w.value === true && f.store.get(LEVEL_KEY) === "30");
}

for (const { mode, write, clear } of HOSTILE) {
  installStorage(mode);
  installWindow("ok");
  const w = settle(() => writeLevel(18));
  const c = settle(() => clearLevel());
  check(`throwing on ${mode}: writeLevel reports ${write}, clearLevel reports ${clear}, nothing throws`, w.ok && c.ok && w.value === write && c.value === clear, `${String(w.value)}/${String(c.value)}`);
  const expected = (write ? 1 : 0) + (clear ? 1 : 0);
  check(`  …and the event fires only after an operation that succeeded (${expected})`, events.length === expected, `${events.length} events`);
}

installWindow("none");
removeStorage();

// ---------------------------------------------------------------------------

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
