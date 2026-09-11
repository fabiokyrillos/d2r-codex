import type { ReactNode } from "react";

import type { ClassSlug } from "@/lib/types/core";
import { ClassChip } from "./class-chip";

/**
 * The listing as the static HTML carries it: the Suspense fallback.
 *
 * `BuildFilters` reads the URL with `useSearchParams`, and on a prerendered
 * route that client-renders everything up to the nearest Suspense boundary —
 * so whatever the boundary's fallback is, is what the built HTML contains,
 * what a crawler indexes, and what a reader without JavaScript keeps. This is
 * that fallback, and it is deliberately more than a spinner:
 *
 *   - **The complete list**, every card, in catalogue order. That is what lets
 *     the route stay statically generated while the filtering happens in the
 *     browser, and it is R-FILT-14's "the full listing renders on the server".
 *   - **The eight class chips as links** — `?class=<slug>` on the listing's own
 *     path — on the catalogue only. Without JavaScript a static site cannot
 *     read a query string, so the link does not narrow this page; it is the
 *     entry the PRD asks for, and the gate records that limitation rather than
 *     hiding it (plan §4.4). With JavaScript the row is replaced by toggle
 *     buttons before the reader can press anything.
 *   - **Nothing else.** No stage picker, no sort, no "More filters", no
 *     checkbox, no dialog: every one of those needs a script to do anything,
 *     and a control that does nothing is worse than none (R-PREF-4,
 *     R-FILT-14). `scripts/build-filters-html.test.ts` reads the built HTML
 *     and fails on any of them.
 *
 * The chip row carries the edge fade statically. Whether it overflows is not
 * a measurement the server can make, but eight chips never fit below 640px —
 * at 200% text they are wider still — and above it the stylesheet removes the
 * mask anyway, so the class is honest at every width this row can be seen at.
 *
 * With no filters in the URL the hydrated render lists the same cards in the
 * same order, so the swap adds the second row of controls and moves nothing
 * else; the class page's `AnchorRealign` absorbs that growth on a hash load.
 */
export interface StaticClassChip {
  slug: ClassSlug;
  label: string;
  count: number;
  href: string;
}

export function StaticListing({
  chips,
  chipsLabel,
  items,
  listClassName,
  leading,
}: {
  /** The catalogue's eight classes; absent on a class page. */
  chips?: StaticClassChip[];
  /** Accessible name of the chip row. */
  chipsLabel: string;
  items: { slug: string; card: ReactNode }[];
  listClassName: string;
  leading?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {chips && chips.length > 0 && (
        <nav
          aria-label={chipsLabel}
          data-class-chips
          className="chip-row chip-row-fade -mx-5 -my-1 flex gap-2 overflow-x-auto px-5 py-1 sm:-mx-1 sm:flex-wrap sm:px-1"
        >
          {chips.map((chip) => (
            <ClassChip key={chip.slug} slug={chip.slug} label={chip.label} count={chip.count} href={chip.href} />
          ))}
        </nav>
      )}
      <ul className={listClassName}>
        {leading && <li>{leading}</li>}
        {items.map((item) => (
          <li key={item.slug}>{item.card}</li>
        ))}
      </ul>
    </div>
  );
}
