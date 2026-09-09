/**
 * Local preferences, and the one place that knows how to store them.
 *
 * STUB. The signatures are final; the bodies are type-valid zeros so that
 * `tsc --noEmit` passes while `scripts/prefs.test.ts` fails on behaviour.
 * A test that fails to compile proves nothing about behaviour, and the
 * `check` chain runs `typecheck` last, where isolation from the chain does
 * not help. Implemented in the next commit.
 *
 * Design rules this module exists to hold in one place, and which the tests
 * pin before the implementation lands:
 *
 *   - Reading never writes and never deletes. `mobile-navigation.test.ts:383`
 *     asserts storage is still empty after a navigation, and a module that
 *     lazily seeded a default would turn that green gate red under a name
 *     that points at the wrong feature.
 *   - Nothing at module scope touches storage, so importing this on the
 *     server is safe.
 *   - The `try` wraps the property access, not just the call: reading
 *     `window.localStorage` itself throws `SecurityError` when site data is
 *     blocked.
 *   - An invalid stored value is ignored and *kept*. "Ignored" is not
 *     "deleted", and a read that destroys user data is a side effect.
 *   - The `gear-<tier>` id is produced here and nowhere else, so the markup
 *     that emits it and the script that finds it cannot drift.
 */
import { PROGRESSION_TIERS, type ProgressionTier } from "@/lib/types";

// ---------------------------------------------------------------------------
// The closed list (R-PREF-3)
// ---------------------------------------------------------------------------

/**
 * Every preference key this site may ever write, documented in one place.
 *
 * Phase 1 implements only `d2rc.tier`. The rest are declared because
 * R-PREF-3 requires the list to exist and to be checkable, not because they
 * are wired: `scripts/prefs.test.ts` fails if a `d2rc.` literal appears
 * anywhere in `app/`, `components/` or `lib/` that is not on this list.
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

export const TIER_ANCHOR_PREFIX = "gear-";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function isTier(value: unknown): value is ProgressionTier {
  void value;
  void PROGRESSION_TIERS;
  return false;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

export function readTier(): ProgressionTier | null {
  return null;
}

export function writeTier(tier: ProgressionTier): boolean {
  void tier;
  return false;
}

export function clearTier(): boolean {
  return false;
}

// ---------------------------------------------------------------------------
// Anchors and the hash
// ---------------------------------------------------------------------------

export function tierAnchorId(tier: ProgressionTier): string {
  void tier;
  return "";
}

export function tierAnchorHref(tier: ProgressionTier): string {
  void tier;
  return "";
}

export function tierFromHash(hash: string): ProgressionTier | null {
  void hash;
  return null;
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

export type TierSource = "hash" | "preference" | "none";

export interface ResolvedTier {
  active: ProgressionTier | null;
  source: TierSource;
  preferred: ProgressionTier | null;
}

export function resolveActiveTier(input: {
  hash: string;
  stored: string | null;
}): ResolvedTier {
  void input;
  return { active: null, source: "none", preferred: null };
}

// ---------------------------------------------------------------------------
// Applying state to the DOM
// ---------------------------------------------------------------------------

export function applyTierState(doc: Document): {
  active: ProgressionTier | null;
  source: TierSource;
} {
  void doc;
  return { active: null, source: "none" };
}

// ---------------------------------------------------------------------------
// The inline boot script's source
// ---------------------------------------------------------------------------

/**
 * The exact string the Server Component injects.
 *
 * Returning it from here rather than writing it inline is what makes the
 * script unit-testable without a build, and what gives R-BUILD-10's watched
 * list a machine-readable definition.
 */
export function tierBootScript(): string {
  return "";
}

// ---------------------------------------------------------------------------
// Anchor offset
// ---------------------------------------------------------------------------

/**
 * How far below the top of the viewport an anchored tier should land.
 *
 * Width-conditional on purpose: from 640px the in-Gear mirror is sticky and
 * the offset is header 57 + mirror ~40 + margin; below it there is no sticky
 * element other than the header, and a 112px offset would leave dead space
 * above the anchor — the symptom this number exists to remove.
 */
export function anchorOffsetPx(viewportWidth: number): number {
  void viewportWidth;
  return 0;
}
