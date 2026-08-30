import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Callout, Container, DataTable, PageHeader, Section } from "@/components/ui";
import { getRunes, getRunewordsUsingRune } from "@/lib/registry";
import { alternatesFor, dictionaryFor, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";

export async function generateMetadata(
  props: PageProps<"/[lang]/runes">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return {
    title: t.nav.runes,
    description: t.runes.indexDescription,
    alternates: alternatesFor(lang, "/runes"),
  };
}

/**
 * A third of the runes behave differently in shields than in body armor, and
 * that difference decides real gearing choices — so the table splits them out
 * rather than cramming both into one cell with a slash.
 */
export default async function RunesPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const runes = getRunes(locale);

  const groups = [
    { label: t.runes.groupLow, range: [1, 11] as const, note: t.runes.groupLowNote },
    { label: t.runes.groupMid, range: [12, 20] as const, note: t.runes.groupMidNote },
    {
      label: t.runes.groupMidHigh,
      range: [21, 25] as const,
      note: t.runes.groupMidHighNote,
    },
    { label: t.runes.groupHigh, range: [26, 33] as const, note: t.runes.groupHighNote },
  ];

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.reference}</span>}
        title={t.runes.indexTitle}
        description={t.runes.indexDescription}
        meta={<Badge tone="outline">{t.runes.verifiedAgainst}</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title={t.runes.readingTitle}>
          {t.runes.readingBody}
        </Callout>

        {groups.map((group) => {
          const groupRunes = runes.filter(
            (rune) => rune.number >= group.range[0] && rune.number <= group.range[1],
          );

          return (
            <Section key={group.label} title={group.label} description={group.note}>
              <DataTable
                headers={[
                  t.runes.colRune,
                  t.runes.colLvl,
                  t.runes.colWeapon,
                  t.runes.colArmorHelm,
                  t.runes.colShield,
                ]}
                rows={groupRunes.map((rune) => [
                  <Link
                    key={rune.slug}
                    href={r.rune(rune.slug)}
                    className="font-semibold text-rarity-rune hover:underline"
                  >
                    <span className="font-mono text-xs text-ink-subtle">
                      {String(rune.number).padStart(2, "0")}
                    </span>{" "}
                    {rune.name}
                  </Link>,
                  <span key="lvl" className="font-mono text-xs">
                    {rune.requiredLevel > 0 ? rune.requiredLevel : "—"}
                  </span>,
                  rune.weaponMod,
                  rune.armorMod,
                  <span
                    key="shield"
                    className={rune.shieldMod !== rune.armorMod ? "text-ink" : undefined}
                  >
                    {rune.shieldMod}
                  </span>,
                ])}
              />
            </Section>
          );
        })}

        <Section title={t.runes.upgradingTitle} description={t.runes.upgradingDescription}>
          <DataTable
            headers={[t.runes.colRecipe, t.runes.colResult, t.runes.colRunewordsNeeding]}
            rows={runes
              .filter((rune) => rune.upgradeRecipe)
              .map((rune) => {
                const next = runes.find((x) => x.number === rune.number + 1);
                const consumers = next ? getRunewordsUsingRune(locale, next.slug) : [];
                return [
                  <span key="r" className="font-mono text-xs">
                    {rune.upgradeRecipe}
                  </span>,
                  next ? (
                    <Link
                      key="n"
                      href={r.rune(next.slug)}
                      className="text-rarity-rune hover:underline"
                    >
                      {next.name}
                    </Link>
                  ) : (
                    "—"
                  ),
                  consumers.length > 0 ? (
                    <span key="c" className="text-xs">
                      {consumers.map((c) => c.name).join(", ")}
                    </span>
                  ) : (
                    <span key="c" className="text-xs text-ink-subtle">
                      —
                    </span>
                  ),
                ];
              })}
            caption={t.runes.upgradingCaption}
          />
        </Section>
      </div>
    </Container>
  );
}
