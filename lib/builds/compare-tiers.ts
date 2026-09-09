/**
 * Adjacent-tier comparison — R-BUILD-6.
 *
 * **This is the typed stub, committed with the red tests.** The signatures and
 * the types are final; the bodies return the valid zero for each type so that
 * `scripts/compare-tiers.test.ts` fails on *behaviour* rather than on
 * compilation. `tsconfig.json` includes `**\/*.ts`, so a test importing a module
 * that does not exist would break `typecheck` instead of failing an assertion —
 * and a compile error proves nothing about the behaviour under test. The
 * implementation lands in the next commit.
 *
 * Two traps this module exists to avoid, documented here because both have
 * already been paid for once in this repository:
 *
 *   1. **Nothing may be keyed by slot name.** `blade-fury/budget` legitimately
 *      lists `weapon` twice, so a `Map<GearSlot, …>` silently loses a row and
 *      then reports a phantom removal. `lib/registry/index.ts:307-329` carries
 *      the same warning for the pt-BR overlay merge, and
 *      `components/game/gear-progression.tsx` repeats it for the preview list.
 *      The key is `${slot}#${occurrence}` walked in authored order.
 *
 *   2. **A removal is "the slot is now empty", not "this occurrence is gone".**
 *      The obvious guard — suppress a removal whose identity survives elsewhere
 *      in the tier — fires *zero* times over all 53 builds, because identity is
 *      ref-first and the case it exists for compares
 *      `label:"weapon switch: call to arms and a spirit shield"` against
 *      `runeword:call-to-arms`. The guard and the identity rule are mutually
 *      exclusive by construction. The structural rule fires exactly once, on
 *      the one build that needs it.
 *
 * `charms` and `weaponSwap` are deliberately outside the comparison: R-BUILD-6
 * says "each slot", and `lib/types/item.ts` documents both as *not* equipment
 * slots.
 */
import type { GearPick, GearSet, GearSetSlotEntry, GearSlot, ProgressionTier } from "@/lib/types";

/** `"unique:harlequin-crest"` or `"label:rare ring: 10% fcr, resistances"`. */
export type PickIdentity = string;

export type SlotMarker = "new" | "kept" | "alternative";

export interface SlotComparison {
  /** `${slot}#${occurrence}` — never the slot name alone. See trap 1. */
  key: string;
  slot: GearSlot;
  occurrence: number;
  index: number;
  /** The same object reference as `set.slots[index]`, not a copy of it. */
  entry: GearSetSlotEntry;
  /** `null` only on the first tier, which has nothing to be compared against. */
  marker: SlotMarker | null;
  previous?: PickIdentity;
  alternativeVia?: "secondary-pick" | "nested-alternative";
}

export interface RemovedSlot {
  key: string;
  slot: GearSlot;
  occurrence: number;
  identity: PickIdentity;
  pick: GearPick;
}

export interface TierComparison {
  tier: ProgressionTier;
  previousTier?: ProgressionTier;
  /** Same length and same order as `set.slots`, entry by entry. */
  slots: SlotComparison[];
  removed: RemovedSlot[];
  /** The tier's majority state, when one marker holds more than 70%. */
  majority?: { marker: SlotMarker; count: number; total: number };
}

export function identityOf(_pick: GearPick): PickIdentity {
  return "";
}

export function compareTiers(previous: GearSet | undefined, current: GearSet): TierComparison {
  return {
    tier: current.tier,
    previousTier: previous?.tier,
    slots: [],
    removed: [],
  };
}

export function compareProgression(_gearSets: GearSet[]): TierComparison[] {
  return [];
}
