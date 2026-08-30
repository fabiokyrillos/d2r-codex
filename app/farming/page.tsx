import type { Metadata } from "next";

import {
  Badge,
  Callout,
  Container,
  LinkCard,
  PageHeader,
  Section,
} from "@/components/ui";
import { AreaLevelBadge, ElementBadge } from "@/components/game";
import { getFarmingAreas } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Farming",
  description:
    "Where to farm in Diablo II: Resurrected, with area levels taken from the game's own data files, common immunities, run routes and which builds suit each area.",
};

export default function FarmingPage() {
  const areas = getFarmingAreas();
  const alvl85 = areas.filter((a) => a.hellLevel85);
  const rest = areas.filter((a) => !a.hellLevel85);

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Farming</span>}
        title="Where to farm"
        description="Area levels here come from the game's own levels.txt, using the Expansion columns. That distinction matters — the Classic columns in the same table give very different numbers."
        meta={
          <>
            <Badge tone="ember">{alvl85.length} area level 85 zones</Badge>
            <Badge tone="outline">{areas.length} areas documented</Badge>
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title="Why area level 85 matters">
          Treasure classes are gated by monster level. At area level 85 the highest treasure
          classes unlock, which means <strong>every item in the game becomes possible</strong>{" "}
          from an ordinary monster. Below 85, entire item tiers simply cannot drop no matter
          how long you farm or how much magic find you carry.
          <p className="mt-2">
            The exception is act bosses and some super uniques, whose own monster level is
            higher than the zone they stand in. Hell Mephisto is monster level 87 in an area
            level 83 zone, which is exactly why he is worth running.
          </p>
        </Callout>

        <Section
          title="Area level 85 zones"
          description="The top tier. Anything in the game can drop here."
        >
          <ul className="grid gap-3 lg:grid-cols-2">
            {alvl85.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </ul>
        </Section>

        <Section
          title="Boss and target runs"
          description="Lower area levels, but a boss whose own monster level, drop table or sheer speed makes the run worth it."
        >
          <ul className="grid gap-3 lg:grid-cols-2">
            {rest.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </ul>
        </Section>
      </div>
    </Container>
  );
}

function AreaCard({ area }: { area: ReturnType<typeof getFarmingAreas>[number] }) {
  return (
    <li>
      <LinkCard href={`/farming/${area.slug}`} className="h-full">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
            {area.name}
          </h3>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <Badge tone="outline">Act {area.act}</Badge>
            <AreaLevelBadge level={area.levels.hell} isEighty5={area.hellLevel85} />
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
          {area.summary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <span className="text-xs text-ink-subtle">Immunities:</span>
          {area.commonImmunities.length > 0 ? (
            area.commonImmunities.map((el) => <ElementBadge key={el} element={el} />)
          ) : (
            <span className="text-xs text-ink-muted">None notable</span>
          )}
        </div>
      </LinkCard>
    </li>
  );
}
