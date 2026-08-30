import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Callout, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { ConfidenceNote } from "@/components/game";
import { getMechanics } from "@/lib/registry";
import { alternatesFor, dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";
import type { MechanicCategory } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";

export async function generateMetadata(
  props: PageProps<"/[lang]/mechanics">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return {
    title: t.mechanics.indexTitle,
    description: t.mechanics.indexDescription,
    alternates: alternatesFor(lang, "/mechanics"),
  };
}

function categoryLabels(t: Dictionary): Record<MechanicCategory, string> {
  return {
    loot: t.mechanics.categoryLoot,
    combat: t.mechanics.categoryCombat,
    defense: t.mechanics.categoryDefense,
    character: t.mechanics.categoryCharacter,
    endgame: t.mechanics.categoryEndgame,
    items: t.mechanics.categoryItems,
  };
}

export default async function MechanicsPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const articles = getMechanics(locale);
  const categories = [...new Set(articles.map((a) => a.category))];
  const labels = categoryLabels(t);

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.reference}</span>}
        title={t.mechanics.indexTitle}
        description={t.mechanics.indexDescription}
        meta={
          <Badge tone="neutral">
            {fmt(t.mechanics.articlesCount, { count: articles.length })}
          </Badge>
        }
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title={t.mechanics.formulasTitle}>
          {t.mechanics.formulasBody}
        </Callout>

        {categories.map((category) => (
          <Section key={category} title={labels[category]}>
            <ul className="grid gap-3 lg:grid-cols-2">
              {articles
                .filter((a) => a.category === category)
                .map((article) => (
                  <li key={article.slug}>
                    <LinkCard href={r.mechanic(article.slug)} className="h-full">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
                          {article.name}
                        </h2>
                        <ConfidenceNote confidence={article.confidence} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                        {article.summary}
                      </p>
                      <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                        {article.keyFacts.slice(0, 2).map((fact) => (
                          <li key={fact} className="flex gap-2 text-xs text-ink-subtle">
                            <span aria-hidden className="text-ember">
                              ·
                            </span>
                            <span className="text-pretty">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </LinkCard>
                  </li>
                ))}
            </ul>
          </Section>
        ))}

        <Section title={t.mechanics.alsoReference}>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: r.breakpoints(), label: t.nav.breakpoints },
              { href: r.runes(), label: t.mechanics.referenceRunes },
              { href: r.mercenaries(), label: t.nav.mercenaries },
              { href: r.sources(), label: t.mechanics.referenceSources },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </Container>
  );
}
