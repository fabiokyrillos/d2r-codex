/**
 * What changed between one gear tier and the one before it.
 *
 * R-BUILD-6 asks each slot of each tier to say whether the item is new, kept,
 * or an alternative to what came before, and asks the tier to list what it
 * stopped wearing. This module answers that and nothing else: it is pure, it
 * takes no `locale`, it produces no display string, and it does not reach
 * `lib/registry`. Everything it emits is either a closed vocabulary or an
 * identity taken straight from the content, so a rendered marker can never say
 * something the data does not.
 *
 * Two traps are worth writing down, because both were mistakes the plan had to
 * correct before any of this was written, and both look right until they are
 * measured.
 *
 * **1. Nothing may be keyed by slot name.** `blade-fury`'s budget tier lists
 * `weapon` twice: the Passion claws at index 0, and — as the eleventh and last
 * entry, after `amulet` — the Call to Arms weapon switch. It is the only such
 * tier in the corpus, which is exactly what makes it dangerous: a
 * `Map<GearSlot, …>` collapses those two into one, the switch stops being
 * compared, the row it exists for disappears from the comparison, and 317 other
 * tiers keep working. `lib/registry/index.ts` already carries the same scar —
 * the pt-BR overlay keys had to grow a `#1` for the same reason — and so does
 * the header of `components/game/gear-progression.tsx`. The key here is
 * therefore `${slot}#${occurrence}`, and `slots` is an array **parallel** to
 * `set.slots`: same length, same order, and `slots[i].entry` is the *same
 * object* as `set.slots[i]`. Authored order is structural load, not
 * presentation — exactly 1 of the 318 tiers happens to list its slots in
 * `GEAR_SLOTS` order, and only 9 of 53 builds keep one order across all six
 * tiers — so nothing here sorts, ever.
 *
 * **2. "Removed" is a structural fact, not an identity one.** The obvious rule
 * — publish a removal when this *occurrence* disappeared, unless its identity
 * turns up somewhere in the new tier — is the one the first version of the plan
 * carried, and it suppresses nothing at all. Measured over all 53 builds: zero.
 * The reason is not a bug in the guard, it is the identity rule below. The one
 * false removal it existed to hide is `blade-fury budget→optimized`, where the
 * budget tier's `label:"Weapon switch: Call to Arms and a Spirit shield"` is the
 * same recommendation as the optimized tier's `weaponSwap` entry
 * `runeword:call-to-arms` — and identity is `ref` first, so those two strings
 * are different *by construction*. The guard and the identity rule were
 * mutually exclusive; the guard could never fire.
 *
 * So the rule is structural instead: a removal is published when the **slot
 * name** has no occurrence left in the current tier — which is also what
 * "removed" means to a reader, *you no longer wear anything here*. If the slot
 * still has an occurrence, what changed is the item, and that occurrence's own
 * marker already says so. Measured: 48 removals over 30 (build, tier) pairs,
 * against 49 over 31 for the naive occurrence rule. It fires once, on the one
 * build that needs it, without comparing labels and without touching content —
 * and, unlike the dead guard, deleting it changes the output, so a mutation
 * that removes it turns a test red instead of passing unnoticed.
 *
 * `charms` and `weaponSwap` are deliberately outside the comparison. R-BUILD-6
 * says "each slot", and `lib/types/item.ts` documents both as *not* equipment
 * slots. Positional comparison of charms is almost all noise — 76 tiers have
 * none at all — so excluding them is right, but it has to be written down,
 * because "markers on every slot" reads like "on everything".
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
  /**
   * What this key held in the previous tier. Present whenever the previous
   * tier had this key at all — including on a `new` row, where it is the thing
   * that was replaced.
   */
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
  /**
   * The tier's majority state, when one marker holds more than
   * `MAJORITY_SHARE` of the tier's marked occurrences.
   *
   * This exists so the page can say it once instead of repeating it on every
   * row. Per tier, `nightmare` averages 6.2 of 7.1 slots new and `bis` 8.4 of
   * 9.8 kept, so a marker drawn on each of those rows is a background rather
   * than a signal — in both the visual and the screen-reader channel.
   */
  majority?: { marker: SlotMarker; count: number; total: number };
}

/**
 * The share one state must reach to be declared once for the whole tier.
 *
 * Inclusive, and that was measured rather than assumed. The first version of
 * this was strictly greater than, on the reasoning that at exactly 70% — seven
 * of ten — the three exceptions are numerous enough to be worth naming one by
 * one. The catalogue disagrees: **ten slots is the modal tier and 7-of-10 is
 * its most common split, so a strict comparison excludes 35 of the 265
 * comparable tiers at precisely the boundary** — among them
 * `blizzard-sorceress/bis` and `hammerdin/optimized`, which are the two builds
 * the PRD names as its baseline.
 *
 * What that cost is audible rather than visible. "Kept" is never drawn, so the
 * only place it repeats is the screen-reader text, and on those 35 tiers a
 * reader heard "Kept" seven times where a sighted reader saw one quiet row.
 * Including the boundary takes the corpus from 602 such repetitions to 454, and
 * makes the promise in the plan — that a tier's majority state is said once, in
 * *both* channels — true on the flagship pages instead of nearly true.
 *
 * The sentence carries both numbers ("7 of 10 slots"), so it cannot overstate a
 * bare 70% the way the word "almost" alone would.
 */
const MAJORITY_SHARE = 0.7;

/**
 * A pick's identity, `ref` first.
 *
 * `ref` first is what makes the comparison locale-invariant, and that is not a
 * nicety: pt-BR overlays rewrite `label` on 385 picks, and `hammerdin`'s BiS
 * gloves are `unique:magefist` in both dictionaries while carrying a pt-BR
 * `label` of "Trang-Oul's Claws". A label-first identity reads that row as
 * changed in Portuguese and unchanged in English — one build, one row, and
 * nothing else to notice it by. ADR 0003 §1 says the same thing from the other
 * end: overlays address picks by position and `label` is localised copy, so the
 * comparison must run on the invariant data.
 *
 * `kind` is part of the identity even though no slug is currently catalogued
 * under two kinds. It costs nothing and it forecloses the first collision,
 * rather than a present one.
 *
 * Normalisation of the label branch is minimal, and stops short of punctuation
 * on purpose: `"Rare ring: 10% FCR, resistances, life"` and
 * `"…, life, mana"` are different recommendations, and so are a colon and its
 * absence. Case and runs of whitespace are the only things folded away, because
 * those are the differences an editor makes by accident.
 */
export function identityOf(pick: GearPick): PickIdentity {
  if (pick.ref) return `${pick.ref.kind}:${pick.ref.slug}`;
  return `label:${(pick.label ?? "").trim().toLowerCase().replace(/\s+/g, " ")}`;
}

interface KeyedEntry {
  key: string;
  slot: GearSlot;
  occurrence: number;
  index: number;
  entry: GearSetSlotEntry;
}

/**
 * The tier's slots, in authored order, each with its occurrence number.
 *
 * The first occurrence of a slot name is `#0`, the second `#1`. This mirrors
 * the overlay keys in `lib/registry`, where the first occurrence keeps the bare
 * slot name and repeats get a suffix — same idea, same reason, and the numbers
 * line up so a reader comparing the two files is not doing arithmetic.
 */
function keyed(set: GearSet): KeyedEntry[] {
  const seen = new Map<GearSlot, number>();
  return set.slots.map((entry, index) => {
    const occurrence = seen.get(entry.slot) ?? 0;
    seen.set(entry.slot, occurrence + 1);
    return { key: `${entry.slot}#${occurrence}`, slot: entry.slot, occurrence, index, entry };
  });
}

/**
 * Every identity nested under `alternatives[]`, at any depth.
 *
 * The corpus is one level deep today — 308 nested picks, none of which has
 * alternatives of its own — but the type is recursive, so this is too. A
 * one-level read would quietly stop matching the day an editor nests one more.
 */
function nestedIdentities(picks: GearPick[]): Set<PickIdentity> {
  const found = new Set<PickIdentity>();
  const walk = (pick: GearPick) => {
    for (const alternative of pick.alternatives ?? []) {
      found.add(identityOf(alternative));
      walk(alternative);
    }
  };
  for (const pick of picks) walk(pick);
  return found;
}

/** The tier's majority state, or `undefined` when no state passes the share. */
function majorityOf(slots: SlotComparison[]): TierComparison["majority"] {
  const counts = new Map<SlotMarker, number>();
  let total = 0;
  for (const slot of slots) {
    if (!slot.marker) continue;
    counts.set(slot.marker, (counts.get(slot.marker) ?? 0) + 1);
    total++;
  }
  if (total === 0) return undefined;
  for (const [marker, count] of counts) {
    if (count / total >= MAJORITY_SHARE) return { marker, count, total };
  }
  return undefined;
}

/**
 * One tier against the one before it.
 *
 * `previous` is `undefined` for the first tier of a progression, and that is
 * the only case where a marker is `null`: `starter` is not "all new", it is
 * "nothing to compare against", and 290 occurrences would otherwise be shouting
 * a word that carries no information.
 */
export function compareTiers(previous: GearSet | undefined, current: GearSet): TierComparison {
  const now = keyed(current);

  if (!previous) {
    return {
      tier: current.tier,
      previousTier: undefined,
      slots: now.map((k): SlotComparison => ({ ...k, marker: null })),
      removed: [],
    };
  }

  const before = keyed(previous);
  const byKey = new Map(before.map((k) => [k.key, k]));

  const slots = now.map((k): SlotComparison => {
    const was = byKey.get(k.key);
    // The slot name is new, or this occurrence of it is. `blade-fury`'s
    // `weapon#1` is the whole of the second case, and it is why this is a
    // lookup by key and not by slot.
    if (!was) return { ...k, marker: "new" };

    // `picks[0]` is the recommendation; the rest are ranked stand-ins. The
    // preview already assumes this (`gear-progression.tsx`), and 2555 of the
    // 2659 entries have exactly one pick anyway.
    const previousIdentity = identityOf(was.entry.picks[0]);
    const currentIdentity = identityOf(k.entry.picks[0]);

    if (previousIdentity === currentIdentity) {
      return { ...k, marker: "kept", previous: previousIdentity };
    }
    // Secondary pick before nested alternative: appearing in the ranked list is
    // the stronger statement of the two, and a pick can be in both.
    if (k.entry.picks.slice(1).some((pick) => identityOf(pick) === previousIdentity)) {
      return {
        ...k,
        marker: "alternative",
        previous: previousIdentity,
        alternativeVia: "secondary-pick",
      };
    }
    if (nestedIdentities(k.entry.picks).has(previousIdentity)) {
      return {
        ...k,
        marker: "alternative",
        previous: previousIdentity,
        alternativeVia: "nested-alternative",
      };
    }
    return { ...k, marker: "new", previous: previousIdentity };
  });

  // Trap 2. The test is the slot *name*, not the key: an occurrence that
  // vanished while its slot name survives is a change of item, which the
  // surviving occurrence's own marker already reports.
  const slotsNow = new Set<GearSlot>(current.slots.map((entry) => entry.slot));
  const removed = before
    .filter((k) => !slotsNow.has(k.slot))
    .map(
      (k): RemovedSlot => ({
        key: k.key,
        slot: k.slot,
        occurrence: k.occurrence,
        identity: identityOf(k.entry.picks[0]),
        pick: k.entry.picks[0],
      }),
    );

  return { tier: current.tier, previousTier: previous.tier, slots, removed, majority: majorityOf(slots) };
}

/**
 * A whole progression, each tier against its predecessor.
 *
 * The sets are compared **in the order they arrive**. This does not sort by
 * `tierOrder`, and the omission is deliberate: sorting here would silently
 * repair a build whose tiers were authored out of order, and "the comparison
 * quietly disagreed with the order the page renders" is a worse failure than a
 * content defect that shows up as a wrong marker. All 53 builds ship the six
 * tiers in canonical order today, and `scripts/compare-tiers.test.ts` asserts
 * it, which is where that fact belongs.
 */
export function compareProgression(gearSets: GearSet[]): TierComparison[] {
  return gearSets.map((set, i) => compareTiers(i === 0 ? undefined : gearSets[i - 1], set));
}
