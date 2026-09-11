/**
 * Turning a `Build` into the row the filter works on. Server side only.
 *
 * The split from `filter.ts` is the client boundary, not taste. This file
 * reaches `lib/registry` to resolve item references into names, and that is on
 * `client-boundary.test.ts`'s forbidden list — so a Client Component that
 * imported this would drag the whole content corpus into the browser bundle.
 * `filter.ts` imports nothing but types, and is the half that crosses.
 */
import { resolveRef } from "@/lib/registry/resolve";
import type { Locale } from "@/lib/i18n/config";
import type { Build, ClassSlug } from "@/lib/types";
import { PROGRESSION_TIERS, type ProgressionTier } from "@/lib/types/core";
import { RATING_AXES, goodAtAxes, type BuildRow, type RatingAxis } from "./filter";

/**
 * The "At your stage" line, resolved once per tier (R-FILT-2).
 *
 * The first pick of the first three slots of the tier's gear set, by name: a
 * catalogued item through `resolveRef` — the same lookup the gear tables use,
 * so the card and the build page cannot disagree about what Spirit is called
 * — and a described pick (a rare, a craft) by its label, which pt-BR builds
 * carry translated. A pick with neither is dropped rather than shown as an
 * empty separator.
 */
function stagePicksFor(locale: Locale, build: Build): Record<ProgressionTier, string[]> {
  const picks = {} as Record<ProgressionTier, string[]>;
  for (const tier of PROGRESSION_TIERS) {
    const set = build.gearSets.find((g) => g.tier === tier);
    picks[tier] = (set?.slots.slice(0, 3) ?? [])
      .map((slot) => slot.picks[0])
      .map((pick) => (pick?.ref ? resolveRef(locale, pick.ref).name : (pick?.label ?? "")))
      .filter((name) => name.length > 0);
  }
  return picks;
}

export function buildRow(locale: Locale, build: Build): BuildRow {
  const ratings = {} as Record<RatingAxis, number>;
  for (const axis of RATING_AXES) ratings[axis] = build.ratings[axis];
  return {
    slug: build.slug,
    name: build.name,
    classSlug: build.classSlug,
    damageTypes: [...build.damageTypes],
    difficulty: build.difficulty,
    budget: build.budget,
    goodAt: goodAtAxes(build.ratings),
    ratings,
    stagePicks: stagePicksFor(locale, build),
  };
}

export function buildRows(locale: Locale, builds: readonly Build[]): BuildRow[] {
  return builds.map((b) => buildRow(locale, b));
}

/**
 * The class slugs a set of rows actually covers, in the order the rows arrive.
 *
 * Used for the class group's canonical ordering so the filter list matches the
 * order the catalogue already lists builds in, rather than an alphabetical one
 * that would disagree with the page beneath it.
 */
export function classOrderOf(rows: readonly BuildRow[]): ClassSlug[] {
  const seen: string[] = [];
  for (const row of rows) if (!seen.includes(row.classSlug)) seen.push(row.classSlug);
  return seen as ClassSlug[];
}
