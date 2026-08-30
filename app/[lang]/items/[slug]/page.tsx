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
import { alternatesFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { qualityColors, releaseLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";
import type { Dictionary } from "@/lib/i18n";

export function generateStaticParams() {
  return getUniques("en-us").map((u) => ({ slug: u.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/items/[slug]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const item = getUnique(lang, slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.summary,
    alternates: alternatesFor(lang, `/items/${slug}`),
    openGraph: { title: item.name, description: item.summary },
  };
}

function tradeLabel(t: Dictionary, value: string): string {
  switch (value) {
    case "abundant":
      return t.items.tradeAbundant;
    case "common":
      return t.items.tradeCommon;
    case "uncommon":
      return t.items.tradeUncommon;
    case "rare":
      return t.items.tradeRare;
    default:
      return t.items.tradeVeryRare;
  }
}

export default async function ItemPage(props: PageProps<"/[lang]/items/[slug]">) {
  const { slug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const releases = releaseLabels(t);

  const item = getUnique(locale, slug);
  if (!item) notFound();

  const builds = getBuildsUsingItem(locale, "unique", item.slug);
  const areas = getAreasDroppingItem(locale, "unique", item.slug);

  const requirements = [
    item.requiredLevel && [t.items.requiredLevel, String(item.requiredLevel)],
    item.requiredStrength && [t.items.requiredStrength, String(item.requiredStrength)],
    item.requiredDexterity && [t.items.requiredDexterity, String(item.requiredDexterity)],
    item.maxSockets && [t.items.maxSockets, String(item.maxSockets)],
  ].filter((row): row is [string, string] => Boolean(row));

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.items()} className="hover:text-ink-muted">
              {t.nav.items}
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
              <Badge tone="neutral">
                {fmt(t.items.levelBadge, { level: item.requiredLevel })}
              </Badge>
            )}
            {item.maxSockets && (
              <Badge tone="outline">
                <SocketDisplay count={item.maxSockets} filled={0} />
                {t.items.maxSocketsLabel}
              </Badge>
            )}
            {item.release && item.release !== "lod" && (
              <Badge tone="outline">{releases[item.release]}</Badge>
            )}
            <ConfidenceNote confidence={item.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title={t.items.statistics}>
          <Card>
            <StatLines stats={item.stats} />
          </Card>
          <p className="mt-3 text-sm text-ink-subtle">{t.items.statisticsNote}</p>
        </Section>

        {requirements.length > 0 && (
          <Section title={t.items.requirements}>
            <DataTable
              headers={[t.items.colRequirement, t.items.colValue]}
              rows={requirements}
            />
          </Section>
        )}

        {item.drop && (
          <Section title={t.items.whereItDrops}>
            <Card>
              <p className="text-sm leading-relaxed text-pretty text-ink-muted">
                {item.drop.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {item.drop.minMonsterLevel && (
                  <Badge tone="outline">
                    {fmt(t.items.needsMonsterLevel, { level: item.drop.minMonsterLevel })}
                  </Badge>
                )}
                {item.drop.tradeability && (
                  <Badge tone="neutral">
                    {fmt(t.items.tradeAvailability, {
                      value: tradeLabel(t, item.drop.tradeability),
                    })}
                  </Badge>
                )}
                {item.drop.gamblable && <Badge tone="success">{t.items.gamblable}</Badge>}
                {item.drop.shoppable && <Badge tone="success">{t.items.shoppable}</Badge>}
                {item.drop.craftable && <Badge tone="success">{t.items.craftable}</Badge>}
              </div>
            </Card>
          </Section>
        )}

        {areas.length > 0 && (
          <Section title={t.items.areasToFarm}>
            <ul className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={r.farmingArea(area.slug)}
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
          <Callout variant="info" title={t.items.worthKnowing}>
            {item.notes}
          </Callout>
        )}

        {item.alternatives && item.alternatives.length > 0 && (
          <Section title={t.items.alternatives} description={t.items.alternativesDescription}>
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
            title={t.items.buildsThatUse}
            description={t.items.buildsThatUseDescription}
          >
            <ul className="flex flex-wrap gap-2">
              {builds.map((build) => (
                <li key={build.slug}>
                  <Link
                    href={r.build(build.classSlug, build.slug)}
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
