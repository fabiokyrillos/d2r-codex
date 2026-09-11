import { LinkCard } from "@/components/ui";
import { getClass } from "@/lib/registry";
import { fmt, type Dictionary } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { budgetLabels, elementColors, elementLabels, playDifficultyLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { RATING_AXES, type BuildRow, type RatingAxis } from "@/lib/builds/filter";
import type { Build } from "@/lib/types";
import { CardRatings, type CardAxis } from "./card-ratings";
import { StageLine } from "./stage-line";

/**
 * The build card, on the catalogue and on a class page (R-FILT-16).
 *
 * One card rather than the two the pages used to carry inline, because the
 * two had already drifted — different heading sizes, different spacing, one
 * with ratings and one without — and the compact shape this phase asks for is
 * a set of decisions that has to be made once:
 *
 *   - **Two ratings, not four, and they depend on the reader.** The old card
 *     printed the same four axes on every build. `CardRatings` shows the two
 *     highest, or exactly the "Good at" axes the URL selects; the choice lives
 *     in the client island because the URL does.
 *   - **Tags are a line of text, not a row of badges.** Three bordered chips
 *     under the summary were the loudest thing on the card and said the
 *     least. The element keeps its colour, the difficulty and budget follow
 *     in muted text, and the line is one `text-xs` row (`[data-tags]`).
 *   - **The stage line exists only with a preference.** `StageLine` renders
 *     nothing until the listing has read `d2rc.tier`, so the static HTML
 *     never carries a line about a reader it cannot know (R-PREF-4).
 *   - **The summary is the whole summary.** A clamp would hide the sentence
 *     that says what the build is for; the height budget is met by removing
 *     what said less, not by cutting what says most.
 *
 * Aligned with the runeword card (`app/[lang]/runewords/page.tsx`): a Cinzel
 * name, metadata as text, and one border — the card's own. Nothing inside it
 * is boxed.
 *
 * A Server Component, because it reads the registry (the class name) and the
 * dictionary. The rows it needs are the same `BuildRow` the filter works on,
 * built once by `FilterableBuildList` and handed in, so `stagePicks` is
 * resolved exactly once per build.
 */

/** The eight axes' labels, in `RATING_AXES` order. Shared with the filter's "Good at" group. */
export function ratingAxisLabels(t: Dictionary): Record<RatingAxis, string> {
  return {
    clearSpeed: t.builds.clearSpeed,
    bossing: t.builds.bossing,
    survivability: t.builds.survivability,
    magicFind: t.builds.magicFind,
    terrorZones: t.builds.terrorZones,
    ubers: t.builds.ubers,
    soloSelfFound: t.builds.soloSelfFound,
    players8: t.builds.players8,
  };
}

export async function BuildCard({
  build,
  row,
  variant,
}: {
  build: Build;
  row: BuildRow;
  /**
   * What the eyebrow says. On the catalogue the class is the fact that
   * distinguishes one card from the next; on a class page every card is that
   * class's, so the eyebrow says what kind of guide it is instead.
   */
  variant: "catalogue" | "class";
}) {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const elements = elementLabels(t);
  const budgets = budgetLabels(t);
  const difficulties = playDifficultyLabels(t);
  const axisLabels = ratingAxisLabels(t);

  const eyebrow =
    variant === "catalogue"
      ? (getClass(locale, build.classSlug)?.name ?? build.classSlug)
      : t.classes.endgameEyebrow;

  const axes: CardAxis[] = RATING_AXES.map((axis) => ({
    axis,
    label: axisLabels[axis],
    value: build.ratings[axis],
    valueLabel: fmt(t.common.outOfFive, { value: build.ratings[axis] }),
  }));

  // The catalogue's cards are its sections (h2); the class page's sit under
  // "Start here" (h2), so they are h3 — the outline the pages already had.
  const Heading = variant === "catalogue" ? "h2" : "h3";

  /*
   * A copy of the picks for the island, array by array. The same `row`
   * object is also a prop of the listing (`items[i].row`), and React Flight
   * serialises a repeated object as a path to its first occurrence — a path
   * that, when both occurrences land in one Flight row, the client cannot
   * resolve and the listing never renders (see `filterable-build-list.tsx`).
   * Six short arrays are cheaper than that.
   */
  const picks = Object.fromEntries(
    Object.entries(row.stagePicks).map(([tier, names]) => [tier, [...names]]),
  ) as typeof row.stagePicks;

  return (
    <LinkCard href={r.build(build.classSlug, build.slug)} className="h-full" attrs={{ "data-card": "" }}>
      {/*
        The vertical rhythm is tighter than the runeword card's by a few
        pixels at each step, and every one of them was measured: at 390px the
        en-US card has to come in under 252px, 80% of what it was (R-FILT-16),
        and a three-line summary plus two rating rows leaves no slack for
        generous margins.
      */}
      <p className="text-xs leading-none font-semibold tracking-widest text-ember uppercase">{eyebrow}</p>
      <Heading className="mt-0.5 font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
        {build.name}
      </Heading>
      <p className="mt-1 text-sm leading-relaxed text-pretty text-ink-muted">{build.summary}</p>

      {/*
        One line, three facts, separated by middle dots. The element keeps the
        colour every other surface gives it; the rest is deliberately quiet.
      */}
      <p data-tags className="mt-1.5 text-xs text-ink-subtle">
        {build.damageTypes.map((element) => (
          <span key={element}>
            <span className={elementColors[element]}>{elements[element]}</span>
            {" · "}
          </span>
        ))}
        {difficulties[build.difficulty]}
        {" · "}
        {budgets[build.budget]}
      </p>

      <CardRatings axes={axes} />
      <StageLine picks={picks} label={t.builds.filters.stageLine} />
    </LinkCard>
  );
}
