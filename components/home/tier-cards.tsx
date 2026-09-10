"use client";

import type { ReactNode } from "react";

import { isTier, writeTier } from "@/lib/prefs";

/**
 * The home page's six tier cards, and the only reason they need a client at
 * all: the card is a link either way, and choosing one also says which tier the
 * reader lives at.
 *
 * **What is an island and what is not.** Everything visible here is passed in
 * as `children` — the six `<li>`, each holding a server-rendered `LinkCard`.
 * This module contributes one element and one handler. That keeps `LinkCard`,
 * the dictionary and the route helpers on the server, which is the same
 * arrangement `SiteHeader` uses for its own island.
 *
 * **One listener, on the list.** Six cards do not need six closures, and a
 * handler per card would mean the preference lives in six places instead of
 * one. The press is caught on the `<ol>` in the capture phase, so the write
 * happens before `next/link` starts the navigation rather than racing it —
 * `localStorage.setItem` is synchronous, so by the time the router moves the
 * value is already stored.
 *
 * **Why `data-tier` is on the `<li>` and not on the anchor.** `LinkCard` takes
 * `href`, `children` and `className`, and widening a shared UI primitive's API
 * so one page can hang an attribute off it is a worse trade than reading the
 * attribute from the row. The handler still insists the press landed inside an
 * `<a href>` within that row, so the marker cannot be claimed by a stray click
 * on the list's own box.
 *
 * **What this must never do.** No new storage key, and no key literal at all —
 * everything goes through `lib/prefs`, whose `PREF_KEYS` is the closed list and
 * whose gate sweeps `app/`, `components/` and `lib/` for any quoted key that is
 * not on it. That sweep is quite literal about "quoted", which is why this
 * sentence does not spell one out: naming the prefix inside backticks in a
 * comment is enough to fail it, and it did.
 * No inline `<script>`: `scripts/client-boundary.test.ts` pins the one this site
 * has and asserts it ships on build pages and nowhere else. And nothing is
 * written on render, on hover, or on `visibilitychange` —
 * `scripts/mobile-navigation.test.ts` asserts that navigating the site leaves
 * storage empty, and it is right to. A preference is a choice somebody made,
 * not a side effect of a page being looked at.
 *
 * Deferred, and declared: nothing on `/builds` reads `d2rc.tier` yet. The href
 * is `/builds` bare, with no query parameter — R-FILT-10 and R-BUILD-10 forbid
 * one, and the 2026-09-07 audit's `?tier=` suggestion is superseded.
 */
export function TierCards({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <ol
      className={className}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement | null;
        const link = target?.closest?.("a[href]");
        if (!link) return;
        const row = link.closest("[data-tier]");
        const tier = row?.getAttribute("data-tier");
        if (isTier(tier)) writeTier(tier);
      }}
    >
      {children}
    </ol>
  );
}
