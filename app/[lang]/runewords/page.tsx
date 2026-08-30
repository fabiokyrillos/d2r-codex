import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { RuneSequence, SocketDisplay } from "@/components/game";
import { getRune, getRunewords } from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { progressionTiers, tierOrder } from "@/lib/labels";
import { routes } from "@/lib/routes";

export async function generateMetadata(
  props: PageProps<"/[lang]/runewords">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/runewords",
    title: t.nav.runewords,
    description: t.runewords.indexDescription,
  });
}

export default async function RunewordsPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const tiers = progressionTiers(t);
  const runewords = getRunewords(locale);

  const byTier = tierOrder
    .map((tier) => ({ tier, items: runewords.filter((rw) => rw.tier === tier) }))
    .filter((group) => group.items.length > 0);

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.reference}</span>}
        title={t.runewords.indexTitle}
        description={t.runewords.indexDescription}
        meta={
          <>
            <Badge tone="neutral">
              {fmt(t.runewords.documented, { count: runewords.length })}
            </Badge>
            <Badge tone="outline">{t.runewords.verifiedStats}</Badge>
          </>
        }
      />

      <div className="mt-10 space-y-12">
        {byTier.map(({ tier, items }) => (
          <Section
            key={tier}
            id={tier}
            title={tiers[tier].label}
            description={tiers[tier].context}
          >
            <ul className="grid gap-3 lg:grid-cols-2">
              {items.map((rw) => (
                <li key={rw.slug}>
                  <LinkCard href={r.runeword(rw.slug)} className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg text-rarity-runeword">
                        {rw.name}
                      </h3>
                      <div className="flex shrink-0 items-center gap-2">
                        <SocketDisplay count={rw.sockets} />
                        <span className="font-mono text-xs text-ink-subtle">
                          {fmt(t.runewords.levelShort, { level: rw.requiredLevel })}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {rw.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <RuneSequence
                        runes={rw.runes}
                        resolveRune={(slug) => getRune(locale, slug)}
                      />
                    </div>

                    <p className="mt-3 border-t border-border pt-2.5 text-xs text-ink-subtle">
                      {rw.bases.display}
                    </p>
                  </LinkCard>
                </li>
              ))}
            </ul>
          </Section>
        ))}
      </div>
    </Container>
  );
}
