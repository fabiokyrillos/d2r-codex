import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  Callout,
  Card,
  Container,
  DataTable,
  PageHeader,
  Section,
} from "@/components/ui";
import { ConfidenceNote, ItemRefLink, SocketDisplay, StatLines } from "@/components/game";
import {
  getAreasDroppingItem,
  getBuildsUsingItem,
  getUnique,
  getUniques,
} from "@/lib/registry";
import { qualityColors, releaseLabels } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getUniques().map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getUnique(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: `${item.summary} ${item.base}, required level ${item.requiredLevel ?? "—"}.`,
  };
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getUnique(slug);
  if (!item) notFound();

  const builds = getBuildsUsingItem("unique", item.slug);
  const areas = getAreasDroppingItem("unique", item.slug);

  const requirements = [
    item.requiredLevel && ["Required level", String(item.requiredLevel)],
    item.requiredStrength && ["Required strength", String(item.requiredStrength)],
    item.requiredDexterity && ["Required dexterity", String(item.requiredDexterity)],
    item.maxSockets && ["Max sockets", String(item.maxSockets)],
  ].filter((r): r is [string, string] => Boolean(r));

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/items" className="hover:text-ink-muted">
              Items
            </Link>
            <span aria-hidden>/</span>
            <span className="capitalize">{item.tier}</span>
          </>
        }
        title={item.name}
        description={item.summary}
        meta={
          <>
            <Badge tone="ember" className={qualityColors[item.quality]}>
              {item.base}
            </Badge>
            {item.requiredLevel && (
              <Badge tone="neutral">Level {item.requiredLevel}</Badge>
            )}
            {item.maxSockets && (
              <Badge tone="outline">
                <SocketDisplay count={item.maxSockets} filled={0} />
                max sockets
              </Badge>
            )}
            {item.release && item.release !== "lod" && (
              <Badge tone="outline">{releaseLabels[item.release]}</Badge>
            )}
            <ConfidenceNote confidence={item.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title="Statistics">
          <Card>
            <StatLines stats={item.stats} />
          </Card>
          <p className="mt-3 text-sm text-ink-subtle">
            Ranges are the roll range. Items marked with a bullet are the reason to want the
            item.
          </p>
        </Section>

        {requirements.length > 0 && (
          <Section title="Requirements">
            <DataTable headers={["Requirement", "Value"]} rows={requirements} />
          </Section>
        )}

        {item.drop && (
          <Section title="Where it drops">
            <Card>
              <p className="text-sm leading-relaxed text-pretty text-ink-muted">
                {item.drop.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {item.drop.minMonsterLevel && (
                  <Badge tone="outline">
                    Needs monster level {item.drop.minMonsterLevel}+
                  </Badge>
                )}
                {item.drop.tradeability && (
                  <Badge tone="neutral">
                    Trade availability: {item.drop.tradeability.replace("-", " ")}
                  </Badge>
                )}
                {item.drop.gamblable && <Badge tone="success">Gamblable</Badge>}
                {item.drop.shoppable && <Badge tone="success">Shoppable</Badge>}
                {item.drop.craftable && <Badge tone="success">Craftable</Badge>}
              </div>
            </Card>
          </Section>
        )}

        {areas.length > 0 && (
          <Section title="Areas to farm it">
            <ul className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/farming/${area.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                  >
                    {area.name}
                    {area.hellLevel85 && <Badge tone="ember">alvl 85</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {item.notes && (
          <Callout variant="info" title="Worth knowing">
            {item.notes}
          </Callout>
        )}

        {item.alternatives && item.alternatives.length > 0 && (
          <Section
            title="Alternatives"
            description="Items that fill a similar role at a different price or tier."
          >
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {item.alternatives.map((ref, i) => (
                <li key={i}>
                  <ItemRefLink refItem={ref} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {builds.length > 0 && (
          <Section
            title="Builds that use it"
            description="Generated from the build data, so it can never drift out of date."
          >
            <ul className="flex flex-wrap gap-2">
              {builds.map((build) => (
                <li key={build.slug}>
                  <Link
                    href={`/builds/${build.classSlug}/${build.slug}`}
                    className="inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                  >
                    {build.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Container>
  );
}
