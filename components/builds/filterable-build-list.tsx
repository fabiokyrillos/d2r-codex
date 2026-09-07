import { Suspense, type ReactNode } from "react";

import { getI18n } from "@/lib/i18n/server";
import { getClass } from "@/lib/registry";
import { budgetLabels, elementLabels, playDifficultyLabels, ratingLabels } from "@/lib/labels";
import { fmt } from "@/lib/i18n";
import { BUDGET_LEVELS, DIFFICULTY_RATINGS, ELEMENTS } from "@/lib/types/core";
import type { Build } from "@/lib/types";
import {
  FILTER_GROUPS,
  GOOD_AT_THRESHOLD,
  RATING_AXES,
  isDiscriminating,
  narrowingOptionsFor,
  shouldOfferFilters,
  type FilterGroup,
} from "@/lib/builds/filter";
import { buildRows, classOrderOf } from "@/lib/builds/rows";
import { BuildFilters, type FilterGroupView } from "./build-filters";

/**
 * One filtered listing, shared by every surface that lists build cards.
 *
 * There are two: the catalogue at `/builds` and the "start here" section of a
 * class page. Both render the same card, so both get the same controls, and
 * neither owns a copy of the filtering rules.
 *
 * **The cards are rendered here, on the server.** `cardFor` runs per build and
 * its output is handed to the client component as a `ReactNode`. That keeps
 * `ElementBadge` — an async Server Component that reads the locale through
 * `next/root-params` — out of the browser bundle, along with everything else it
 * reaches.
 *
 * **The Suspense fallback is the complete, unfiltered list.** A prerendered
 * route that calls `useSearchParams` client-renders the tree up to its nearest
 * boundary, so the fallback is what the static HTML contains and what a reader
 * without JavaScript gets. Making it the whole list is what lets this page stay
 * statically generated while the filtering happens in the browser: the server
 * component never reads `searchParams`, so the route is not forced dynamic.
 *
 * **`groups` is what makes the class page different.** It omits `class` there,
 * because a control offering one option on a page about that one class is a
 * control that cannot change anything.
 */
export async function FilterableBuildList({
  builds,
  cardFor,
  listClassName,
  groups = [...FILTER_GROUPS],
  leading,
}: {
  builds: readonly Build[];
  cardFor: (build: Build) => ReactNode;
  listClassName: string;
  groups?: readonly FilterGroup[];
  leading?: ReactNode;
}) {
  const { locale, t } = await getI18n();
  const rows = buildRows(locale, builds);
  const items = builds.map((build, i) => ({ row: rows[i], card: cardFor(build) }));

  const plainList = (
    <ul className={listClassName}>
      {leading && <li>{leading}</li>}
      {items.map((item) => (
        <li key={item.row.slug}>{item.card}</li>
      ))}
    </ul>
  );

  if (!shouldOfferFilters(rows, groups)) return plainList;

  const elements = elementLabels(t);
  const budgets = budgetLabels(t);
  const difficulties = playDifficultyLabels(t);
  const axisLabels: Record<(typeof RATING_AXES)[number], string> = {
    clearSpeed: t.builds.clearSpeed,
    bossing: t.builds.bossing,
    survivability: t.builds.survivability,
    magicFind: t.builds.magicFind,
    terrorZones: t.builds.terrorZones,
    ubers: t.builds.ubers,
    soloSelfFound: t.builds.soloSelfFound,
    players8: t.builds.players8,
  };

  /*
   * Canonical option order per group, all of it from the model: the class order
   * the listing itself is in, and the declared order of the three unions. The
   * "good at" axes follow the order the build pages already print their ratings
   * in. `optionsFor` drops anything with no builds behind it, so a group can
   * never offer a box that matches nothing.
   */
  const orders: Record<FilterGroup, readonly string[]> = {
    class: classOrderOf(rows),
    damage: ELEMENTS,
    difficulty: DIFFICULTY_RATINGS,
    budget: BUDGET_LEVELS,
    goodAt: RATING_AXES,
  };
  const legends: Record<FilterGroup, string> = {
    class: t.builds.filters.groupClass,
    damage: t.builds.filters.groupDamage,
    difficulty: t.builds.filters.groupDifficulty,
    budget: t.builds.filters.groupBudget,
    goodAt: t.builds.filters.groupGoodAt,
  };
  const labelFor = (group: FilterGroup, value: string): string => {
    switch (group) {
      case "class":
        return getClass(locale, value)?.name ?? value;
      case "damage":
        return elements[value as keyof typeof elements] ?? value;
      case "difficulty":
        return difficulties[value as keyof typeof difficulties] ?? value;
      case "budget":
        return budgets[value as keyof typeof budgets] ?? value;
      case "goodAt":
        return axisLabels[value as keyof typeof axisLabels] ?? value;
    }
  };

  /*
   * `narrowingOptionsFor` drops the options that cannot change anything — the
   * ones every build in *this* listing carries. That is a per-option rule, not
   * a per-group one, because the group can be perfectly useful while one of its
   * boxes is inert: seven of the Paladin page's eight "Good at" axes narrow,
   * and `Survivability (7)` did not.
   */
  const views: FilterGroupView[] = groups
    .map((group) => ({
      group,
      legend: legends[group],
      options: narrowingOptionsFor(rows, group, orders[group]).map((o) => ({
        value: o.value,
        label: labelFor(group, o.value),
        count: o.count,
      })),
    }))
    .filter((view) => isDiscriminating(rows, view.group));

  return (
    <Suspense fallback={plainList}>
      <BuildFilters
        items={items}
        groups={views}
        listClassName={listClassName}
        leading={leading}
        strings={{
          regionLabel: t.builds.filters.regionLabel,
          searchLabel: t.builds.filters.searchLabel,
          searchPlaceholder: t.builds.filters.searchPlaceholder,
          resultsOne: t.builds.filters.resultsOne,
          resultsMany: t.builds.filters.resultsMany,
          activeLabel: t.builds.filters.activeLabel,
          removeOne: t.builds.filters.removeOne,
          clearAll: t.builds.filters.clearAll,
          emptyTitle: t.builds.filters.emptyTitle,
          emptyBody: t.builds.filters.emptyBody,
          showFilters: t.builds.filters.showFilters,
          hideFilters: t.builds.filters.hideFilters,
          searchChipPrefix: t.builds.filters.searchChipPrefix,
          // The mobile sheet's own copy. Named here, like everything else the
          // client component renders, so the dictionary stays out of the bundle.
          sheetTitle: t.builds.filters.sheetTitle,
          sheetClose: t.builds.filters.sheetClose,
          sheetCancel: t.builds.filters.sheetCancel,
          sheetClear: t.builds.filters.sheetClear,
          showResultsOne: t.builds.filters.showResultsOne,
          showResultsMany: t.builds.filters.showResultsMany,
          // Interpolated here, where the dictionary and the threshold both
          // live; the client component only has to place it.
          goodAtNote: views.some((v) => v.group === "goodAt")
            ? fmt(t.builds.filters.goodAtNote, {
                threshold: GOOD_AT_THRESHOLD,
                label: ratingLabels(t)[GOOD_AT_THRESHOLD],
              })
            : undefined,
        }}
      />
    </Suspense>
  );
}
