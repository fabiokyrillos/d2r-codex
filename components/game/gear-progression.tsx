import type { GearSet } from "@/lib/types";
import { fmt } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { gearSlotLabels, progressionTiers, tierOrder } from "@/lib/labels";
import { tierAnchorId, tierAnchorHref } from "@/lib/prefs";
import { Badge, Card, cn } from "@/components/ui";
import { GearPickView, RichText } from "@/components/game";
import { TierPreferenceScript } from "@/components/game/tier-preference-script";
import { resolveRef } from "@/lib/registry/resolve";

/**
 * The gear progression view.
 *
 * Every tier renders on the page. That has always been the decision — readers
 * browser-search it, deep-link to a tier, and compare adjacent tiers to work
 * out what to fix next — and it is why this is a `<details>` per tier rather
 * than a tab: a tab hides five sixths of the page from Ctrl+F, from a reader
 * without JavaScript, and from anyone printing it.
 *
 * What changed in Phase 1 is only *how much of it is drawn at once*. Each tier
 * ships open, and JavaScript closes them, leaving a summary and one line per
 * slot. Nothing leaves the DOM in any state.
 *
 * Three structural details are load-bearing, and each one is a defect if it
 * is got wrong:
 *
 *   1. **Each tier is wrapped in its own `<section>`.** The preview list is a
 *      *sibling* of the `<details>`, hidden with `peer-open:hidden`, and
 *      Tailwind compiles `peer-*` with a general sibling combinator (`~`).
 *      Without a wrapper per tier, opening the first tier would match — and
 *      hide — the preview of every tier after it.
 *   2. **The `<details>` carries `group` as well as `peer`.** `group-open:`
 *      needs the marker class on an ancestor; without it the expand/collapse
 *      affordance silently freezes on "Expand", including over the six open
 *      tiers of the no-JavaScript page.
 *   3. **The preview renders one line per entry in `slots`, keyed by index.**
 *      `blade-fury`'s budget tier legitimately lists `weapon` twice, so
 *      anything keyed by slot name loses a row without saying so.
 *
 * The sticky tier nav is a navigation mirror only: it moves you to a tier and
 * reflects which one you are in, and it deliberately does not write the
 * preference or expand anything. Selecting from a control that is halfway
 * down the page would reflow thousands of pixels above the viewport, and the
 * browser's scroll anchoring would then move the page under the reader — the
 * one thing R-BUILD-2 says must never happen. It is also not sticky below
 * 640px, where the header is the only thing allowed to be (R-A11Y-8).
 */
export async function GearProgression({ gearSets }: { gearSets: GearSet[] }) {
  const { t, locale } = await getI18n();
  const tiers = progressionTiers(t);
  const slots = gearSlotLabels(t);
  const picker = t.builds.tierPicker;

  const ordered = [...gearSets].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
  );

  return (
    <div>
      <nav
        aria-label={t.builds.gearTiersNav}
        className="z-30 -mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border bg-abyss/90 px-1 py-2 backdrop-blur-md sm:sticky sm:top-14"
      >
        {ordered.map((set) => (
          <a
            key={set.tier}
            href={tierAnchorHref(set.tier)}
            data-tier-mirror={set.tier}
            className="shrink-0 rounded px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            {tiers[set.tier].label}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {ordered.map((set, index) => {
          const headingId = `${tierAnchorId(set.tier)}-heading`;
          return (
            <section
              key={set.tier}
              className="rounded border border-border p-3"
              aria-labelledby={headingId}
            >
              <details
                id={tierAnchorId(set.tier)}
                data-tier-section={set.tier}
                open
                suppressHydrationWarning
                className="group peer scroll-mt-16"
              >
                <summary className="cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-ember">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 id={headingId} className="font-display text-lg text-ink">
                      {tiers[set.tier].label}
                    </h3>
                    {set.levelRange && (
                      <Badge tone="outline">
                        {fmt(t.builds.levelsRange, {
                          from: set.levelRange[0],
                          to: set.levelRange[1],
                        })}
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-ink-subtle">
                      <span data-affordance-expand className="group-open:hidden">
                        {picker.expand}
                      </span>
                      <span data-affordance-collapse className="hidden group-open:inline">
                        {picker.collapse}
                      </span>
                    </span>
                  </span>
                  <span className="mt-1.5 block max-w-3xl text-sm leading-snug text-pretty text-ink-muted">
                    <RichText>{set.goal}</RichText>
                  </span>
                </summary>

                <div className="mt-5 space-y-5 border-t border-border pt-5">
                  {set.slots.map((entry, i) => (
                    <div
                      key={`${entry.slot}-${i}`}
                      data-gear-slot={entry.slot}
                      className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
                    >
                      <div className="pt-0.5">
                        <span className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                          {slots[entry.slot]}
                        </span>
                      </div>
                      {/*
                        min-w-0 stops a wide child from stretching the grid track.
                        Without it, one over-long `lookFor` badge — which is
                        whitespace-nowrap by design — widens the whole page rather
                        than overflowing its own row.
                      */}
                      <div className="min-w-0 space-y-4 border-l border-border pl-4 sm:border-l-0 sm:pl-0">
                        {entry.picks.map((pick, j) => (
                          <GearPickView key={j} pick={pick} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {set.charms && set.charms.length > 0 && (
                  <SupplementaryBlock title={t.builds.charmsInventory} picks={set.charms} />
                )}

                {set.weaponSwap && set.weaponSwap.length > 0 && (
                  <SupplementaryBlock title={t.builds.weaponSwap} picks={set.weaponSwap} />
                )}

                {set.nextUpgrade && (
                  <div className="mt-6 rounded-lg border border-ember-dim/40 bg-ember-dim/10 px-4 py-3">
                    <p className="text-xs font-semibold tracking-wide text-ember uppercase">
                      {t.builds.whatToFixNext}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                      <RichText>{set.nextUpgrade}</RichText>
                    </p>
                  </div>
                )}

                {set.notes && (
                  <p className="mt-4 text-sm leading-relaxed text-pretty text-ink-subtle">
                    <RichText>{set.notes}</RichText>
                  </p>
                )}
              </details>

              {/*
                The compact preview: one line per slot, visible exactly when the
                tier is closed.

                It sits outside the `<details>` rather than inside `<summary>`
                on purpose. Ten slot lines inside the summary would become the
                disclosure's accessible name — fifty words read out on every
                focus and every pass of the rotor — and a name that is a list is
                not a name. Out here it costs nothing to a screen reader,
                because when it is visible the tier body is not, and the two
                never both describe the same thing.
              */}
              <ul data-tier-preview={set.tier} className="mt-3 peer-open:hidden">
                {set.slots.map((entry, i) => {
                  const pick = entry.picks[0];
                  const ref = pick?.ref ? resolveRef(locale, pick.ref) : null;
                  return (
                    <li key={`${entry.slot}-${i}`} data-preview-slot={entry.slot} className="flex gap-2 text-sm">
                      <span className="w-24 shrink-0 text-xs tracking-wide text-ink-subtle uppercase">
                        {slots[entry.slot]}
                      </span>
                      <span className="truncate text-ink-muted">{ref?.name ?? pick?.label ?? "—"}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/*
        Last, and it has to be last: this reads the six `<details>` by id, so a
        script placed above them finds nothing at all.
      */}
      <TierPreferenceScript />
    </div>
  );
}

function SupplementaryBlock({
  title,
  picks,
}: {
  title: string;
  picks: GearSet["charms"];
}) {
  if (!picks || picks.length === 0) return null;
  return (
    <Card className={cn("mt-6")}>
      <h4 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
        {title}
      </h4>
      <div className="mt-3 space-y-4">
        {picks.map((pick, i) => (
          <GearPickView key={i} pick={pick} />
        ))}
      </div>
    </Card>
  );
}
