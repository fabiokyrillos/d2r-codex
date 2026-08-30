import type { GearSet } from "@/lib/types";
import { fmt } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { gearSlotLabels, progressionTiers, tierOrder } from "@/lib/labels";
import { Badge, Card, cn } from "@/components/ui";
import { GearPickView, RichText } from "@/components/game";

/**
 * The gear progression view.
 *
 * A deliberate choice: every tier renders on the page rather than hiding behind
 * tabs. This is reference material — readers browser-search it, deep-link to a
 * specific tier, and compare adjacent tiers to work out what to fix next.
 * Tabs would break all three, and would need client JavaScript to do it.
 *
 * The sticky tier nav gives the fast path without hiding anything.
 */
export async function GearProgression({ gearSets }: { gearSets: GearSet[] }) {
  const { t } = await getI18n();
  const tiers = progressionTiers(t);
  const slots = gearSlotLabels(t);

  const ordered = [...gearSets].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier),
  );

  return (
    <div>
      <nav
        aria-label={t.builds.gearTiersNav}
        className="sticky top-14 z-30 -mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border bg-abyss/90 px-1 py-2 backdrop-blur-md"
      >
        {ordered.map((set) => (
          <a
            key={set.tier}
            href={`#gear-${set.tier}`}
            className="shrink-0 rounded px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            {tiers[set.tier].label}
          </a>
        ))}
      </nav>

      <div className="space-y-10">
        {ordered.map((set, index) => (
          <section
            key={set.tier}
            id={`gear-${set.tier}`}
            className="scroll-mt-32"
            aria-labelledby={`gear-${set.tier}-heading`}
          >
            <header className="border-b border-border pb-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-ember">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  id={`gear-${set.tier}-heading`}
                  className="font-display text-2xl text-ink"
                >
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
              </div>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-pretty text-ink-muted">
                <RichText>{set.goal}</RichText>
              </p>
            </header>

            <div className="mt-5 space-y-5">
              {set.slots.map((entry) => (
                <div
                  key={entry.slot}
                  className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:gap-6"
                >
                  <div className="pt-0.5">
                    <span className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                      {slots[entry.slot]}
                    </span>
                  </div>
                  <div className="space-y-4 border-l border-border pl-4 sm:border-l-0 sm:pl-0">
                    {entry.picks.map((pick, i) => (
                      <GearPickView key={i} pick={pick} />
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
          </section>
        ))}
      </div>
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
