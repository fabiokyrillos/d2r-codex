import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  DataTable,
  PageHeader,
  Rating,
  Section,
  StatGrid,
} from "@/components/ui";
import {
  ConfidenceNote,
  DifficultyBadge,
  ElementBadge,
  ItemRefLink,
} from "@/components/game";
import {
  getBuildsFarmingArea,
  getFarmingArea,
  getFarmingAreas,
} from "@/lib/registry";
import { progressionTiers } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getFarmingAreas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getFarmingArea(slug);
  if (!area) return {};
  return {
    title: area.name,
    description: `${area.summary} Area level ${area.levels.hell} in Hell.`,
  };
}

export default async function FarmingAreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getFarmingArea(slug);
  if (!area) notFound();

  const builds = getBuildsFarmingArea(area.slug);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/farming" className="hover:text-ink-muted">
              Farming
            </Link>
            <span aria-hidden>/</span>
            <span>Act {area.act}</span>
          </>
        }
        title={area.name}
        description={area.summary}
        meta={
          <>
            {area.hellLevel85 && <Badge tone="ember">Area level 85</Badge>}
            {area.recommendedDifficulties.map((d) => (
              <DifficultyBadge key={d} difficulty={d} />
            ))}
            {area.terrorZone && <Badge tone="outline">Terror Zone rotation</Badge>}
            <ConfidenceNote confidence={area.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title="Area levels">
          <StatGrid
            items={[
              { label: "Normal", value: area.levels.normal },
              { label: "Nightmare", value: area.levels.nightmare },
              {
                label: "Hell",
                value: area.levels.hell,
                hint: area.hellLevel85 ? "Top treasure classes" : undefined,
              },
              { label: "Act", value: area.act },
            ]}
          />
          <p className="mt-3 text-sm text-ink-subtle">
            From the game&rsquo;s <code className="font-mono">levels.txt</code>, Expansion
            columns.
          </p>
        </Section>

        <Section title="Why run it">
          <p className="text-base leading-relaxed text-pretty text-ink-muted">{area.why}</p>
        </Section>

        <Section title="Getting there">
          <Card>
            <p className="text-sm leading-relaxed text-ink-muted">{area.access}</p>
          </Card>
          {area.route && area.route.length > 0 && (
            <ol className="mt-4 space-y-2.5">
              {area.route.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-surface-overlay font-mono text-xs text-ember">
                    {i + 1}
                  </span>
                  <span className="text-pretty">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </Section>

        <Section title="What to expect">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                Characteristics
              </h3>
              <div className="divide-y divide-border">
                <Rating value={area.density} label="Monster density" />
                <Rating value={area.danger} label="Danger" />
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                <span className="text-ink-subtle">Run length: </span>
                {area.runLength.replace("-", " ")}
              </p>
            </Card>
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                Common immunities in Hell
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {area.commonImmunities.length > 0 ? (
                  area.commonImmunities.map((el) => <ElementBadge key={el} element={el} />)
                ) : (
                  <span className="text-sm text-ink-muted">None notable</span>
                )}
              </div>
              <h3 className="mt-4 mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                Good for
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {area.targets.map((t) => (
                  <Badge key={t} tone="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {area.bosses && area.bosses.length > 0 && (
          <Section title="Bosses and super uniques">
            <DataTable
              headers={["Name", "Type", "Notes"]}
              rows={area.bosses.map((b) => [
                <span key="n" className="font-medium text-ink">
                  {b.name}
                  {b.hellLevel && (
                    <span className="ml-2 font-mono text-xs text-ember">
                      mlvl {b.hellLevel}
                    </span>
                  )}
                </span>,
                <span key="t" className="text-xs capitalize">
                  {b.kind.replace(/-/g, " ")}
                </span>,
                <span key="d">
                  {b.notes}
                  {b.immunities && b.immunities.length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {b.immunities.map((el) => (
                        <ElementBadge key={el} element={el} />
                      ))}
                    </span>
                  )}
                </span>,
              ])}
            />
          </Section>
        )}

        {area.notableDrops && area.notableDrops.length > 0 && (
          <Section title="Notable targets">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {area.notableDrops.map((ref, i) => (
                <li key={i}>
                  <ItemRefLink refItem={ref} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {builds.length > 0 && (
          <Section
            title="Builds that farm here"
            description="Derived from the build data — a build recommending this area appears automatically."
          >
            <div className="space-y-3">
              {builds.map((build) => {
                const entry = build.farming.find((f) => f.area === area.slug);
                return (
                  <Card key={build.slug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base">
                        <Link
                          href={`/builds/${build.classSlug}/${build.slug}`}
                          className="text-ink hover:text-ember-bright"
                        >
                          {build.name}
                        </Link>
                      </h3>
                      {entry && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <DifficultyBadge difficulty={entry.difficulty} />
                          <Badge tone="outline">
                            {progressionTiers[entry.minTier].label}+
                          </Badge>
                        </div>
                      )}
                    </div>
                    {entry && (
                      <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                        {entry.why}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {area.poorlySuitedTo && (
          <Callout variant="warning" title="Not for every build">
            {area.poorlySuitedTo}
          </Callout>
        )}

        {area.notes && (
          <Callout variant="info" title="Worth knowing">
            {area.notes}
          </Callout>
        )}

        {area.suitedTo && area.suitedTo.length > 0 && (
          <Section title="Classes that handle it well">
            <BulletList
              items={area.suitedTo.map((c) => (
                <Link key={c} href={`/classes/${c}`} className="capitalize hover:text-ink">
                  {c}
                </Link>
              ))}
            />
          </Section>
        )}
      </div>
    </Container>
  );
}
