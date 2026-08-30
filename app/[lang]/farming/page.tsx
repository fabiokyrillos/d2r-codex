import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge, Callout, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { AreaLevelBadge, ElementBadge } from "@/components/game";
import { getFarmingAreas } from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";
import type { FarmingArea } from "@/lib/types";

export async function generateMetadata(
  props: PageProps<"/[lang]/farming">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/farming",
    title: t.nav.farming,
    description: t.farming.indexDescription,
  });
}

export default async function FarmingPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const areas = getFarmingAreas(locale);
  const alvl85 = areas.filter((a) => a.hellLevel85);
  const rest = areas.filter((a) => !a.hellLevel85);

  const [whyBefore, whyAfter] = t.farming.whyBodyA.split("{strong}");

  const card = (area: FarmingArea) => (
    <li key={area.slug}>
      <LinkCard href={r.farmingArea(area.slug)} className="h-full">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
            {area.name}
          </h3>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <Badge tone="outline">{fmt(t.farming.act, { act: area.act })}</Badge>
            <AreaLevelBadge level={area.levels.hell} isEighty5={area.hellLevel85} />
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
          {area.summary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <span className="text-xs text-ink-subtle">{t.farming.immunitiesLabel}</span>
          {area.commonImmunities.length > 0 ? (
            area.commonImmunities.map((el) => <ElementBadge key={el} element={el} />)
          ) : (
            <span className="text-xs text-ink-muted">{t.farming.noneNotable}</span>
          )}
        </div>
      </LinkCard>
    </li>
  );

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.farming}</span>}
        title={t.farming.indexTitle}
        description={t.farming.indexDescription}
        meta={
          <>
            <Badge tone="ember">
              {fmt(t.farming.alvl85Badge, { count: alvl85.length })}
            </Badge>
            <Badge tone="outline">
              {fmt(t.farming.areasDocumented, { count: areas.length })}
            </Badge>
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title={t.farming.whyTitle}>
          {whyBefore}
          <strong>{t.farming.whyStrong}</strong>
          {whyAfter}
          <p className="mt-2">{t.farming.whyBodyB}</p>
        </Callout>

        <Section title={t.farming.alvl85Title} description={t.farming.alvl85Description}>
          <ul className="grid gap-3 lg:grid-cols-2">{alvl85.map(card)}</ul>
        </Section>

        <Section title={t.farming.bossRunsTitle} description={t.farming.bossRunsDescription}>
          <ul className="grid gap-3 lg:grid-cols-2">{rest.map(card)}</ul>
        </Section>
      </div>
    </Container>
  );
}
