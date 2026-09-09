/**
 * Local preferences, and the one place that knows how to store them.
 *
 * The site has never stored anything before — `mobile-navigation.tsx` says so
 * in its own comment, and `mobile-navigation.test.ts` asserts it after a
 * navigation. This is the module that changes that, and it is deliberately
 * the only one: the key, its validation, the anchor id it maps to, and the
 * boot script that applies it all live here so none of them can drift apart.
 *
 * Five rules hold this together, each of them a defect that would otherwise
 * be easy to ship:
 *
 *   - **Reading never writes and never deletes.** `mobile-navigation.test.ts`
 *     asserts storage is still empty after `/` → `/builds`. A module that
 *     lazily seeded a default would turn that green gate red under a name
 *     that points at the wrong feature entirely.
 *   - **Nothing at module scope touches storage**, so importing this on the
 *     server is safe. `globalThis.localStorage` is `undefined` in Node.
 *   - **The `try` wraps the property access, not just the call.** With site
 *     data blocked, reading `window.localStorage` throws on the *getter*; a
 *     `try` around `localStorage.getItem(...)` alone still throws.
 *   - **An invalid stored value is ignored and kept.** R-PREF-1 says
 *     "ignored", and ignoring is not deleting. A read that destroys the
 *     reader's data is a side effect a read has no business having.
 *   - **The `gear-<tier>` id is composed here and nowhere else**, so the
 *     markup that emits it and the script that looks for it cannot disagree.
 */
import { PROGRESSION_TIERS, type ProgressionTier } from "@/lib/types";

// ---------------------------------------------------------------------------
// The closed list (R-PREF-3)
// ---------------------------------------------------------------------------

/**
 * Every preference key this site may ever write, documented in one place.
 *
 * Phase 1 implements only `d2rc.tier`. The rest are declared because R-PREF-3
 * requires the list to exist and to be checkable, not because they are wired:
 * `scripts/prefs.test.ts` sweeps `app/`, `components/` and `lib/` for `d2rc.`
 * literals and fails on any that is not here. A list nobody checks is a list
 * that rots.
 */
export const PREF_KEYS = [
  "d2rc.tier",
  "d2rc.compact",
  "d2rc.leveling.<class>",
  "d2rc.level",
] as const;

/** Prefixes for the per-class keys, which cannot be enumerated literally. */
export const PREF_KEY_PREFIXES = ["d2rc.leveling."] as const;

/** What Phase 1 actually writes. */
export const IMPLEMENTED_PREF_KEYS = ["d2rc.tier"] as const;

export const TIER_KEY = "d2rc.tier";

// ---------------------------------------------------------------------------
// Anchors
// ---------------------------------------------------------------------------

/** The prefix production has served since before this phase. */
export const TIER_ANCHOR_PREFIX = "gear-";

export function tierAnchorId(tier: ProgressionTier): string {
  return `${TIER_ANCHOR_PREFIX}${tier}`;
}

export function tierAnchorHref(tier: ProgressionTier): string {
  return `#${tierAnchorId(tier)}`;
}

/**
 * The tier a fragment names, or null.
 *
 * Matched against the canonical list rather than parsed, because two of the
 * six slugs contain a hyphen (`early-hell`) and every split-on-hyphen parser
 * gets exactly those two wrong while looking correct on the other four.
 */
export function tierFromHash(hash: string): ProgressionTier | null {
  if (typeof hash !== "string" || hash.charCodeAt(0) !== 35 /* # */) return null;
  const id = hash.slice(1);
  if (!id.startsWith(TIER_ANCHOR_PREFIX)) return null;
  const slug = id.slice(TIER_ANCHOR_PREFIX.length);
  return isTier(slug) ? slug : null;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Exactly one of the six canonical slugs, and nothing else.
 *
 * Case-sensitive, no trimming, no coercion. "Budget " is not a tier; neither
 * is `"__proto__"`, which is why this is an `includes` over a frozen list
 * rather than a lookup in an object.
 */
export function isTier(value: unknown): value is ProgressionTier {
  return typeof value === "string" && (PROGRESSION_TIERS as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

function store(): Storage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/** The stored tier, or null when absent, invalid, or unreachable. */
export function readTier(): ProgressionTier | null {
  try {
    const raw = store()?.getItem(TIER_KEY) ?? null;
    return isTier(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Returns false when storage refused, rather than throwing at the caller. */
export function writeTier(tier: ProgressionTier): boolean {
  if (!isTier(tier)) return false;
  try {
    const s = store();
    if (!s) return false;
    s.setItem(TIER_KEY, tier);
    return true;
  } catch {
    return false;
  }
}

/** The "clear" R-PREF-3 requires next to every preference the site writes. */
export function clearTier(): boolean {
  try {
    const s = store();
    if (!s) return false;
    s.removeItem(TIER_KEY);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

export type TierSource = "hash" | "preference" | "none";

export interface ResolvedTier {
  /** The tier to expand. */
  active: ProgressionTier | null;
  source: TierSource;
  /** The stored preference, which the hash never overwrites. */
  preferred: ProgressionTier | null;
}

/**
 * Which tier a page opens with, given its URL and what is stored.
 *
 * The hash wins the *expansion* and never touches the *preference*: arriving
 * on someone's link should show you what the link points at without silently
 * rewriting what you chose. That split is why `preferred` is returned
 * separately — `aria-pressed` follows the preference and `aria-current`
 * follows what is on screen, which is the only assignment that keeps
 * R-BUILD-3 and R-BUILD-11 true at the same time.
 */
export function resolveActiveTier(input: { hash: string; stored: string | null }): ResolvedTier {
  const fromHash = tierFromHash(input.hash);
  const preferred = isTier(input.stored) ? input.stored : null;
  if (fromHash) return { active: fromHash, source: "hash", preferred };
  if (preferred) return { active: preferred, source: "preference", preferred };
  return { active: null, source: "none", preferred: null };
}

// ---------------------------------------------------------------------------
// Anchor offset
// ---------------------------------------------------------------------------

/** Below this width there is no sticky element but the header. */
const MIRROR_BREAKPOINT = 640;

/**
 * How far below the top of the viewport an anchored tier should land.
 *
 * Width-conditional on purpose. From 640px the in-Gear mirror is sticky and
 * the offset has to clear header + mirror; below it there is nothing but the
 * header, and reserving room for a bar that is not there would leave a strip
 * of dead space above every anchor — which is the symptom this number exists
 * to remove, not to reproduce.
 */
export function anchorOffsetPx(viewportWidth: number): number {
  return viewportWidth >= MIRROR_BREAKPOINT ? 112 : 72;
}

// ---------------------------------------------------------------------------
// Applying the state to a document
// ---------------------------------------------------------------------------

/**
 * Opens the active tier and closes the rest. Idempotent.
 *
 * Writes `open` on the elements directly rather than through React. The repo
 * has been here before: `components/layout/mobile-navigation.tsx` documents a
 * controlled `<details open>` that had to be reverted because `toggle` is
 * queued rather than dispatched during the press, leaving any React copy of
 * the state one task stale. The element is the source of truth.
 */
export function applyTierState(doc: Document): { active: ProgressionTier | null; source: TierSource } {
  const hash = typeof doc.defaultView?.location?.hash === "string" ? doc.defaultView.location.hash : "";
  let stored: string | null = null;
  try {
    stored = doc.defaultView?.localStorage?.getItem(TIER_KEY) ?? null;
  } catch {
    stored = null;
  }
  const { active, source } = resolveActiveTier({ hash, stored });
  for (const tier of PROGRESSION_TIERS) {
    const el = doc.getElementById(tierAnchorId(tier));
    if (el instanceof Object && "open" in el) {
      (el as HTMLDetailsElement).open = tier === active;
    }
  }
  return { active, source };
}

// ---------------------------------------------------------------------------
// The inline boot script
// ---------------------------------------------------------------------------

/**
 * The exact source the Server Component injects, as a string.
 *
 * It runs during HTML parsing, before the first paint and before React
 * exists, which is the only place the collapse can happen without either a
 * flash or — on a hash load — dropping thirteen thousand pixels out from
 * above the reader after the browser has already jumped to the anchor.
 *
 * Returning it from a function rather than writing it inline in a component
 * is what makes it testable: `scripts/prefs.test.ts` runs this against a
 * hand-rolled document and compares the result to `resolveActiveTier` on all
 * ten rows of the state matrix. Without that, the script and the module it
 * mirrors would be free to drift, and nothing would notice.
 *
 * It reads storage and never writes it — the same rule the module keeps.
 */
export function tierBootScript(): string {
  const tiers = JSON.stringify(PROGRESSION_TIERS);
  const prefix = JSON.stringify(TIER_ANCHOR_PREFIX);
  const key = JSON.stringify(TIER_KEY);
  // Kept terse on purpose: this ships inline in 106 documents.
  return `try{var T=${tiers},P=${prefix},K=${key};
var h=(location.hash||""),s=null;
try{s=(window.localStorage||{}).getItem(K)}catch(e){}
var f=null;if(h.charAt(0)==="#"){var i=h.slice(1);if(i.indexOf(P)===0){var g=i.slice(P.length);if(T.indexOf(g)>=0)f=g}}
var p=(T.indexOf(s)>=0)?s:null,a=f||p;
for(var n=0;n<T.length;n++){var el=document.getElementById(P+T[n]);if(el){if(T[n]===a){el.setAttribute("open","")}else{el.removeAttribute("open")}}}
if(f){var t=document.getElementById(P+f);if(t){var o=(window.innerWidth>=640)?112:72;var y=t.getBoundingClientRect().top+window.pageYOffset-o;window.scrollTo(0,y<0?0:y)}}
}catch(e){}`;
}
