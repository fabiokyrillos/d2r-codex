"use client";

import { createContext } from "react";

import type { RatingAxis } from "@/lib/builds/filter";
import type { ProgressionTierLike } from "@/lib/prefs";

/**
 * What the listing tells its cards, and the only channel it has to them.
 *
 * The cards are Server Components: `BuildCard` resolves names through the
 * registry and reads the dictionary, none of which may cross into the client
 * bundle (`scripts/client-boundary.test.ts`). They arrive at `BuildFilters`
 * as already-rendered nodes, so the listing cannot pass them props. What it
 * can do is provide a context, and the two small client islands inside every
 * card — `CardRatings` and `StageLine` — read it.
 *
 * Two values, both views over the same rendered cards:
 *
 *   - `focusAxes`: the "Good at" axes the URL selects. When it is non-empty a
 *     card shows exactly those ratings, in `RATING_AXES` order, instead of its
 *     two highest — the reader asked about bossing, so bossing is the number
 *     they see (R-FILT-16, plan §4.7).
 *   - `tier`: the saved stage. When set, every card gains its "At your stage"
 *     line (R-FILT-2). It arrives from `localStorage` in an effect, so the
 *     first render never has one.
 *
 * **The default is the server's render.** The Suspense fallback renders the
 * same cards with no provider above them, and the static HTML is that render:
 * two highest axes, no stage line. The provider's first value is the same —
 * no preference has been read yet — so the fallback and the live listing
 * start identical, and there is nothing to mismatch.
 */
export interface ListingView {
  focusAxes: readonly RatingAxis[];
  tier: ProgressionTierLike | null;
}

export const NO_FOCUS: ListingView = { focusAxes: [], tier: null };

export const ListingContext = createContext<ListingView>(NO_FOCUS);
