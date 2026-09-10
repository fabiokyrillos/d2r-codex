import type { RemovedSlot, SlotComparison, TierComparison } from "@/lib/builds/compare-tiers";
import type { Dictionary } from "@/lib/i18n";
import { fmt } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { gearSlotLabels } from "@/lib/labels";
import { resolveRef } from "@/lib/registry/resolve";

/**
 * What `compare-tiers.ts` computed, drawn.
 *
 * Server Components, all three, and the only presentation this phase adds to
 * the gear tiers. The comparison itself is pure and lives in `lib/builds`; this
 * decides how much of it a reader is made to look at, which turned out to be
 * the harder half.
 *
 * **The marker is a micro-label, not a chip.** The first design said "ember,
 * 1px border, medium weight", and the measurement of what that produces killed
 * it: in `nightmare`, 6.2 of 7.1 slots are new, so 87% of the rows would have
 * carried a box. A box on 87% of rows is not a marker, it is a background. So
 * the marker is uppercase `text-xs` in the slot column, under the slot name —
 * no border, no fill, no chrome. From 640px the 8rem slot column is shorter
 * than the picks column beside it, so it costs **zero** height; below 640px the
 * grid stacks and a drawn label costs one 16px line.
 * `build-markers-html.test.ts` measures that by deleting the markers from a
 * laid-out page and re-measuring, rather than by comparing the two grid cells —
 * a grid stretches its items, so that comparison reported 0.0px of slack on
 * every row whether or not a marker existed.
 *
 * **`kept` is never drawn, and a majority state is said once.** Silencing
 * `kept` alone was measured against the wrong number — 52.6% is a page with all
 * six tiers open, and the reader is shown one. Per tier it fixes `bis` (85
 * points) and almost nothing in `nightmare` (8.5), where 91.5% of rows would
 * still carry a label. So there are two rules, not one: `kept` is `sr-only`,
 * and when any state passes 70% of a tier's occurrences the tier says it once
 * at the top of its body and the rows holding that state carry **nothing at
 * all**.
 *
 * That last part is the point, and it is why `SlotMarkerLabel` returns `null`
 * rather than an `sr-only` span for a covered row: the rule is symmetric across
 * both channels. Hiding "Kept" from the eye and leaving a screen reader to say
 * it eight times in a row is not a quieter page, it is the same noise moved
 * somewhere the author does not have to look at it.
 *
 * **Always a text node, never `aria-label`.** The slot row is a `<div>` and the
 * label cell a bare `<span>`; both compute `role=generic`, ARIA prohibits an
 * author-supplied name on those, and a name on a container does not join the
 * text of its descendants. Worse, it is a *green* trap — Chrome's accessibility
 * tree happily reports `{"role":"generic","name":"Kept"}`, so a gate over
 * `axNodes()` would confirm something no screen reader announces. The gate
 * therefore asserts a hidden text node in document order and the *absence* of
 * the attribute.
 *
 * All three take `t` (and one takes `locale`) as props instead of awaiting
 * `getI18n()` themselves, which is the house convention everywhere else in
 * `components/game`. The reason is volume: `SlotMarkerLabel` renders once per
 * slot occurrence, 2,659 times per build page, in both locales, and the caller
 * already holds both values.
 */

const MARKER_WORD: Record<
  NonNullable<SlotComparison["marker"]>,
  (t: Dictionary) => string
> = {
  new: (t) => t.builds.markerNew,
  kept: (t) => t.builds.markerKept,
  alternative: (t) => t.builds.markerAlternative,
};

const MAJORITY_SENTENCE: Record<
  NonNullable<SlotComparison["marker"]>,
  (t: Dictionary) => string
> = {
  new: (t) => t.builds.majorityNew,
  kept: (t) => t.builds.majorityKept,
  alternative: (t) => t.builds.majorityAlternative,
};

/**
 * One slot's state, in the slot column, under the slot name.
 *
 * Three outcomes, and the two that render nothing are as deliberate as the one
 * that does:
 *
 *   - `null` marker — the first tier. `starter` is not "all new", it is
 *     "nothing to compare against", and 290 occurrences shouting a word that
 *     carries no information is worse than silence.
 *   - the tier's majority state — said once at the top of the body instead.
 *   - `kept` — text for a screen reader, nothing for the eye.
 */
export function SlotMarkerLabel({
  slot,
  majority,
  t,
}: {
  slot: SlotComparison;
  majority: TierComparison["majority"];
  t: Dictionary;
}) {
  if (!slot.marker) return null;
  if (majority && majority.marker === slot.marker) return null;

  const word = MARKER_WORD[slot.marker](t);
  if (slot.marker === "kept") {
    return (
      <span data-slot-marker="kept" className="sr-only">
        {word}
      </span>
    );
  }
  return (
    <span
      data-slot-marker={slot.marker}
      className={
        "block text-xs tracking-wide uppercase " +
        (slot.marker === "alternative" ? "text-ember" : "text-ink-muted")
      }
    >
      {word}
    </span>
  );
}

/**
 * "Almost all new here: 6 of 7 slots" — the line that replaces the repetition.
 *
 * The count comes from the comparison, not from an editor: it is derived from
 * the data like every other number on the site, so it cannot drift away from
 * the rows underneath it.
 */
export function TierMajorityLine({
  majority,
  t,
}: {
  majority: TierComparison["majority"];
  t: Dictionary;
}) {
  if (!majority) return null;
  return (
    <p data-tier-majority={majority.marker} className="text-xs text-ink-muted">
      {fmt(MAJORITY_SENTENCE[majority.marker](t), {
        count: majority.count,
        total: majority.total,
      })}
    </p>
  );
}

/**
 * What this tier stopped wearing, when it stopped wearing anything.
 *
 * Conditional, and it gets no reserved height: 48 removals across 30 of the 265
 * (build, tier) pairs, so the block is absent from 235 renderings. "Removed"
 * here means the *slot name* has no occurrence left — if the slot is still worn
 * and the item changed, that occurrence's own marker already says so.
 */
export function RemovedSlots({
  tier,
  removed,
  locale,
  t,
}: {
  tier: TierComparison["tier"];
  removed: RemovedSlot[];
  locale: Locale;
  t: Dictionary;
}) {
  if (removed.length === 0) return null;
  const slots = gearSlotLabels(t);

  return (
    <div data-tier-removed={tier} className="mt-6 border-t border-border pt-4">
      <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
        {t.builds.removedTitle}
      </p>
      <ul className="mt-2 space-y-1">
        {removed.map((entry) => {
          const ref = entry.pick.ref ? resolveRef(locale, entry.pick.ref) : null;
          return (
            <li
              key={entry.key}
              data-removed-slot={entry.slot}
              className="flex gap-2 text-sm"
            >
              <span className="w-24 shrink-0 text-xs tracking-wide text-ink-subtle uppercase">
                {slots[entry.slot]}
              </span>
              {/*
                Out of flow, so it costs no gap and no height, and it is read
                between the slot name and the item — "Belt, removed, String of
                Ears" — which is the order the sentence wants.
              */}
              <span className="sr-only">{t.builds.markerRemoved}</span>
              <span className="text-ink-muted line-through">
                {ref?.name ?? entry.pick.label ?? "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
