"use client";

import { useContext } from "react";

import { Rating } from "@/components/ui";
import { RATING_AXES, type RatingAxis } from "@/lib/builds/filter";
import { ListingContext } from "./listing-context";

/**
 * The ratings a card shows: two by default, or the ones the reader asked for.
 *
 * The card used to print four fixed axes — clear speed, magic find,
 * survivability, solo self-found — whatever the build was for. R-FILT-16
 * replaces that with the build's **two highest**, so a bosser shows bossing
 * and a farmer shows magic find, and with the "Good at" filter active, with
 * exactly the **chosen axes**, all of them, because a reader who ticked Ubers
 * is comparing Ubers ratings and nothing else.
 *
 * All eight axes arrive as props, already labelled and with their "N out of
 * 5" strings, because the choice is made here on the client while the
 * dictionary stays on the server. The choice is pure and deterministic — the
 * two highest, ties broken by `RATING_AXES` order, itself the order the build
 * page prints them in — so the server's render of this island and the
 * client's first render agree without either one knowing about the other.
 *
 * Both selections are displayed in `RATING_AXES` order rather than by value,
 * so the same axis sits in the same place on every card that shows it, which
 * is what makes a column of cards scannable.
 */
export interface CardAxis {
  axis: RatingAxis;
  label: string;
  value: number;
  /** "N out of 5", already localised — `Rating`'s accessible value. */
  valueLabel: string;
}

/** The two highest, ties in `RATING_AXES` order, returned in that order. */
export function defaultAxes(axes: readonly CardAxis[]): CardAxis[] {
  const ranked = axes
    .map((a, index) => ({ a, index }))
    .sort((x, y) => y.a.value - x.a.value || x.index - y.index)
    .slice(0, 2)
    .map((entry) => entry.a);
  return RATING_AXES.map((axis) => ranked.find((a) => a.axis === axis)).filter(
    (a): a is CardAxis => a !== undefined,
  );
}

export function CardRatings({ axes }: { axes: CardAxis[] }) {
  const { focusAxes } = useContext(ListingContext);
  const shown =
    focusAxes.length > 0 ? axes.filter((a) => focusAxes.includes(a.axis)) : defaultAxes(axes);
  if (shown.length === 0) return null;

  /*
   * `pt-0.5` rather than `pt-2`, and `-mb-1.5`: each `Rating` row already
   * carries `py-1.5`, so the visible gap under the hairline is 8px either
   * way, and the last row's own padding would only add to the card's — so
   * it is taken back. Twelve pixels at 390px, which is the difference
   * between meeting the 80% height ceiling (R-FILT-16) and missing it.
   */
  return (
    <div className="mt-2.5 -mb-1.5 grid gap-x-6 border-t border-border pt-0.5 sm:grid-cols-2">
      {shown.map((a) => (
        <div key={a.axis} data-rating-axis={a.axis}>
          <Rating value={a.value} label={a.label} valueLabel={a.valueLabel} />
        </div>
      ))}
    </div>
  );
}
