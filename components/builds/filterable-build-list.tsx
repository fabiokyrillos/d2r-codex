import { Suspense, type ReactNode } from "react";

import { getI18n } from "@/lib/i18n/server";
import { getClass, getClasses } from "@/lib/registry";
import { budgetLabels, elementLabels, playDifficultyLabels, progressionTiers, ratingLabels, tierOrder } from "@/lib/labels";
import { fmt } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { BUDGET_LEVELS, DIFFICULTY_RATINGS, ELEMENTS, type ClassSlug } from "@/lib/types/core";
import type { Build } from "@/lib/types";
import {
  ADVANCED_GROUPS,
  FILTER_GROUPS,
  GOOD_AT_THRESHOLD,
  RATING_AXES,
  isDiscriminating,
  narrowingOptionsFor,
  shouldOfferFilters,
  type BuildRow,
  type FilterGroup,
} from "@/lib/builds/filter";
import { buildRows } from "@/lib/builds/rows";
import { ratingAxisLabels } from "./build-card";
import { BuildFilters } from "./build-filters";
import type { FilterGroupView } from "./filter-groups";
import { StaticListing, type StaticClassChip } from "./static-listing";

/**
 * One filtered listing, shared by every surface that lists build cards.
 *
 * There are two: the catalogue at `/builds` and the "start here" section of a
 * class page. Both render the same card, so both get the same controls, and
 * neither owns a copy of the filtering rules.
 *
 * **The cards are rendered here, on the server.** `cardFor` runs per build,
 * with the row the filter will work on, and its output is handed to the
 * client component as a `ReactNode`. That keeps `BuildCard` — which reads the
 * registry and the dictionary — out of the browser bundle, along with
 * everything it reaches.
 *
 * **The Suspense fallback is the static HTML.** A prerendered route that calls
 * `useSearchParams` client-renders the tree up to its nearest boundary, so the
 * fallback is what the built HTML contains and what a reader without
 * JavaScript gets: `StaticListing`, the complete list under the class chips
 * as links. Making it the whole list is what lets this page stay statically
 * generated while the filtering happens in the browser: the server component
 * never reads `searchParams`, so the route is not forced dynamic.
 *
 * **`groups` is what makes the class page different.** It omits `class`
 * there, because a control offering one option on a page about that one class
 * is a control that cannot change anything — so the class page gets no chip
 * row, static or live, and its four advanced groups are the whole disclosure.
 *
 * **The cards reach the client component through a promise, and that is
 * load-bearing.** The same card nodes are rendered once and used twice — in
 * the fallback and in `BuildFilters`' props — and React Flight serialises a
 * repeated element as a *path* to its first occurrence. When the reference
 * and the occurrence sit in the same Flight row, which the fallback and the
 * children of one `<Suspense>` do until the row grows past Flight's
 * outlining threshold, the client meets a reference into the chunk it is
 * still parsing, marks it blocked and never unblocks it: the fallback stays
 * on screen for good, with no error. Measured on every class page, while the
 * catalogue only worked because its eight-chip row happened to push the
 * fallback past the threshold first. A promise is the one value Flight
 * *always* writes as its own row, so `data` puts every reference from the
 * boundary's children into a row the client parses after the fallback's.
 * The alternative — rendering every card twice — cost 150 KB of HTML on the
 * catalogue for the same result.
 *
 * **Every string the client renders is named here.** The client component
 * takes strings as props, so the dictionary — both of them — stays out of
 * the bundle.
 */
export async function FilterableBuildList({
  builds,
  cardFor,
  listClassName,
  groups = [...FILTER_GROUPS],
  leading,
}: {
  builds: readonly Build[];
  cardFor: (build: Build, row: BuildRow) => ReactNode;
  listClassName: string;
  groups?: readonly FilterGroup[];
  /** Rendered as the first cell and never filtered — the class page's journey card. */
  leading?: ReactNode;
}) {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const rows = buildRows(locale, builds);
  const items = builds.map((build, i) => ({ row: rows[i], card: cardFor(build, rows[i]) }));
  const staticItems = items.map((item) => ({ slug: item.row.slug, card: item.card }));
  const withClass = groups.includes("class");

  if (!shouldOfferFilters(rows, groups)) {
    return (
      <StaticListing
        chipsLabel={t.builds.filters.classesLabel}
        items={staticItems}
        listClassName={listClassName}
        leading={leading}
      />
    );
  }

  const elements = elementLabels(t);
  const budgets = budgetLabels(t);
  const difficulties = playDifficultyLabels(t);
  const axisLabels = ratingAxisLabels(t);
  const tiers = progressionTiers(t);

  /*
   * Canonical option order per group, all of it from the model: the classes in
   * the order the class index lists them — the reference class first, then
   * alphabetical, which is the order a reader scans a row of eight for their
   * own class in, and the same order `/classes` uses — and the declared order
   * of the three unions. The "good at" axes follow the order the build pages
   * already print their ratings in. `narrowingOptionsFor` drops anything with
   * no builds behind it and anything every build carries, so a group can never
   * offer a box that matches nothing — or everything.
   *
   * The old checkbox list followed the catalogue's own class order instead
   * (`classOrderOf`): right for a legend under the list it mirrored, wrong for
   * a row of chips a reader has to find one class in.
   */
  const orders: Record<FilterGroup, readonly string[]> = {
    class: getClasses(locale).map((c) => c.slug),
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
   * The class chips: the same eight, in the same order, for the static row
   * (as links, with the catalogue-wide counts) and for the live one (as
   * buttons, whose counts the client recomputes under the other groups'
   * selections). Only where the page offers the class group at all.
   */
  const classOptions = withClass ? narrowingOptionsFor(rows, "class", orders.class) : [];
  const chips: StaticClassChip[] = classOptions.map((o) => ({
    slug: o.value as ClassSlug,
    label: labelFor("class", o.value),
    count: o.count,
    href: `${r.builds()}?class=${o.value}`,
  }));

  /*
   * The advanced groups the disclosure holds — never the class, which has its
   * own row. `narrowingOptionsFor` drops the options that cannot change
   * anything: seven of the Paladin page's eight "Good at" axes narrow, and
   * `Survivability (7)` did not.
   */
  const views: FilterGroupView[] = ADVANCED_GROUPS.filter((g) => groups.includes(g))
    .map((group) => ({
      group,
      legend: legends[group],
      options: narrowingOptionsFor(rows, group, orders[group]).map((o) => ({
        value: o.value,
        label: labelFor(group, o.value),
      })),
    }))
    .filter((view) => isDiscriminating(rows, view.group));

  const f = t.builds.filters;

  return (
    <Suspense
      fallback={
        <StaticListing
          chips={withClass ? chips : undefined}
          chipsLabel={f.classesLabel}
          items={staticItems}
          listClassName={listClassName}
          leading={leading}
        />
      }
    >
      <BuildFilters
        // Already resolved; see the header for why it is a promise at all.
        data={Promise.resolve({ items, leading })}
        classOptions={withClass ? chips.map((c) => ({ value: c.slug, label: c.label })) : undefined}
        groups={views}
        tiers={tierOrder.map((slug) => ({ slug, label: tiers[slug].label, short: tiers[slug].short }))}
        listClassName={listClassName}
        locale={locale}
        strings={{
          regionLabel: f.regionLabel,
          classesLabel: f.classesLabel,
          stageLegend: f.stageLegend,
          stageMine: f.stageMine,
          stageClear: f.stageClear,
          stageClearLabel: f.stageClearLabel,
          stageHelp: f.stageHelp,
          stageAnnounce: f.stageAnnounce,
          moreFilters: f.moreFilters,
          showFilters: f.showFilters,
          sortLabel: f.sortLabel,
          sortRecommended: f.sortRecommended,
          sortStage: f.sortStage,
          sortEasiest: f.sortEasiest,
          sortCheapest: f.sortCheapest,
          sortName: f.sortName,
          sortHelpLabel: f.sortHelpLabel,
          sortHelpRecommended: f.sortHelpRecommended,
          sortHelpStage: f.sortHelpStage,
          resultsOne: f.resultsOne,
          resultsMany: f.resultsMany,
          activeLabel: f.activeLabel,
          removeOne: f.removeOne,
          clearAll: f.clearAll,
          emptyTitle: f.emptyTitle,
          emptyBody: f.emptyBody,
          removeLast: f.removeLast,
          removeGroup: f.removeGroup,
          nearTitle: f.nearTitle,
          // The mobile sheet's own copy. Named here, like everything else the
          // client component renders, so the dictionary stays out of the bundle.
          sheetTitle: f.sheetTitle,
          sheetClose: f.sheetClose,
          sheetCancel: f.sheetCancel,
          sheetClear: f.sheetClear,
          showResultsOne: f.showResultsOne,
          showResultsMany: f.showResultsMany,
          // Interpolated here, where the dictionary and the threshold both
          // live; the client component only has to place it.
          goodAtNote: views.some((v) => v.group === "goodAt")
            ? fmt(f.goodAtNote, {
                threshold: GOOD_AT_THRESHOLD,
                label: ratingLabels(t)[GOOD_AT_THRESHOLD],
              })
            : undefined,
        }}
      />
    </Suspense>
  );
}
