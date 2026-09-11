"use client";

import { useContext } from "react";

import type { ProgressionTierLike } from "@/lib/prefs";
import { ListingContext } from "./listing-context";

/**
 * "At your stage: Spirit · Oculus · Vipermagi" — the card's one line that
 * depends on the reader (R-FILT-2).
 *
 * The names for all six tiers arrive as props, resolved on the server by
 * `lib/builds/rows.ts` through the same `resolveRef` the gear tables use, so
 * the card and the build page cannot disagree about what an item is called
 * and a change of stage needs no round trip. The tier itself comes from the
 * listing's context, which is `null` until an effect has read the preference
 * — so this renders nothing on the server, nothing on the first client
 * render, and the line only ever appears after hydration. That is R-PREF-4's
 * contract and the reason there is no mismatch to guard against.
 *
 * A tier with no names (a gear set whose first three picks have neither a
 * catalogued item nor a label) renders nothing rather than a label with
 * nothing after it.
 */
export function StageLine({
  picks,
  label,
}: {
  picks: Record<ProgressionTierLike, string[]>;
  /** "At your stage:", localised on the server. */
  label: string;
}) {
  const { tier } = useContext(ListingContext);
  if (tier === null) return null;
  const names = picks[tier] ?? [];
  if (names.length === 0) return null;
  return (
    <p data-stage-line className="mt-2 text-xs text-ink-muted">
      <span className="text-ember">{label}</span> {names.join(" · ")}
    </p>
  );
}
