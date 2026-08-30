import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Callout, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { getUniques } from "@/lib/registry";
import { alternatesFor, dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { qualityColors } from "@/lib/labels";
import { routes } from "@/lib/routes";
import type { BaseCategory } from "@/lib/types";

export async function generateMetadata(
  props: PageProps<"/[lang]/items">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return {
    title: t.nav.items,
    description: t.items.indexDescription,
    alternates: alternatesFor(lang, "/items"),
  };
}

export default async function ItemsPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const uniques = getUniques(locale);

  const groups: { label: string; categories: BaseCategory[] }[] = [
    {
      label: t.items.groupHelms,
      categories: ["helm", "circlet", "barbarian-helm", "druid-pelt"],
    },
    { label: t.items.groupBodyArmor, categories: ["body-armor"] },
    {
      label: t.items.groupWeapons,
      categories: ["orb", "dagger", "sword", "staff", "wand", "mace"],
    },
    {
      label: t.items.groupShields,
      categories: ["shield", "paladin-shield", "necromancer-head"],
    },
    { label: t.items.groupGlovesBeltsBoots, categories: ["gloves", "belt", "boots"] },
    { label: t.items.groupJewellery, categories: ["ring", "amulet"] },
  ];

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.reference}</span>}
        title={t.items.indexTitle}
        description={t.items.indexDescription}
        meta={<Badge tone="neutral">{fmt(t.items.count, { count: uniques.length })}</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title={t.items.whyShortTitle}>
          {t.items.whyShortBody}
        </Callout>

        {groups.map((group) => {
          const items = uniques.filter((u) => group.categories.includes(u.category));
          if (items.length === 0) return null;

          return (
            <Section key={group.label} title={group.label}>
              <ul className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                  <li key={item.slug}>
                    <LinkCard href={r.item(item.slug)} className="h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3
                            className={`font-display text-lg ${qualityColors[item.quality]}`}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs text-ink-subtle">{item.base}</p>
                        </div>
                        {item.requiredLevel && (
                          <span className="shrink-0 font-mono text-xs text-ink-subtle">
                            {fmt(t.runewords.levelShort, { level: item.requiredLevel })}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                        {item.summary}
                      </p>
                    </LinkCard>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })}

        <Section title={t.items.related}>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: r.runewords(), label: t.nav.runewords },
              { href: r.runes(), label: t.nav.runes },
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
