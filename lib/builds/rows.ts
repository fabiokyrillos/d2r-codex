/**
 * Turning a `Build` into the row the filter works on. Server side only.
 *
 * The split from `filter.ts` is the client boundary, not taste. This file
 * reaches `lib/search` for the nicknames table and `lib/registry` for class
 * names, and both are on `client-boundary.test.ts`'s forbidden list — so a
 * Client Component that imported this would drag the whole content corpus into
 * the browser bundle. `filter.ts` imports nothing but `fold` and types, and is
 * the half that crosses.
 */
import { NICKNAMES } from "@/lib/search";
import { getClass } from "@/lib/registry";
import type { Locale } from "@/lib/i18n/config";
import type { Build, ClassSlug } from "@/lib/types";
import { goodAtAxes, type BuildRow } from "./filter";

/**
 * Aliases as the site already knows them.
 *
 * `NICKNAMES` is the same table the global search uses, so "fishymancer" finds
 * the Summoner here for the same reason and from the same source it does there.
 * Builds without an entry get `""` — the search simply has less to match, which
 * is the honest behaviour rather than a manufactured alias.
 */
export function aliasesFor(slug: string): string {
  return NICKNAMES[slug] ?? "";
}

export function buildRow(locale: Locale, build: Build): BuildRow {
  return {
    slug: build.slug,
    name: build.name,
    summary: build.summary,
    classSlug: build.classSlug,
    className: getClass(locale, build.classSlug)?.name ?? build.classSlug,
    damageTypes: [...build.damageTypes],
    difficulty: build.difficulty,
    budget: build.budget,
    goodAt: goodAtAxes(build.ratings),
    aliases: aliasesFor(build.slug),
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
