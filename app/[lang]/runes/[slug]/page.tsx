import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  Callout,
  Card,
  Container,
  DataTable,
  LinkCard,
  PageHeader,
  Section,
} from "@/components/ui";
import { RuneSequence, SocketDisplay } from "@/components/game";
import { getRune, getRunes, getRunewordsUsingRune } from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return getRunes("en-us").map((rune) => ({ slug: rune.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/runes/[slug]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const rune = getRune(lang, slug);
  if (!rune) return {};
  const t = dictionaryFor(lang);
  const title = `${rune.name} ${t.searchKinds.rune}`;
  return pageMetadata(lang, {
    path: `/runes/${slug}`,
    title,
    description: rune.summary,
  });
}

export default async function RunePage(props: PageProps<"/[lang]/runes/[slug]">) {
  const { slug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const rune = getRune(locale, slug);
  if (!rune) notFound();

  const runewords = getRunewordsUsingRune(locale, rune.slug);
  const all = getRunes(locale);
  const prev = all.find((x) => x.number === rune.number - 1);
  const next = all.find((x) => x.number === rune.number + 1);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.runes()} className="hover:text-ink-muted">
              {t.nav.runes}
            </Link>
            <span aria-hidden>/</span>
            <span>{fmt(t.runes.ofTotal, { number: rune.number })}</span>
          </>
        }
        title={`${rune.name} ${t.searchKinds.rune}`}
        description={rune.summary}
        meta={
          <>
            <Badge tone="ember">
              {rune.requiredLevel > 0
                ? fmt(t.runes.requiredLevel, { level: rune.requiredLevel })
                : t.runes.noLevelRequirement}
            </Badge>
            <Badge tone="neutral">{fmt(t.runes.runeNumber, { number: rune.number })}</Badge>
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title={t.runes.socketedModifiers}>
          <DataTable
            headers={[t.runes.colItemType, t.runes.colModifier]}
            rows={[
              [t.runes.itemWeapon, rune.weaponMod],
              [t.runes.itemBodyArmor, rune.armorMod],
              [t.runes.itemHelm, rune.helmMod],
              [t.runes.itemShield, rune.shieldMod],
            ]}
          />
        </Section>

        {rune.farmNotes && (
          <Callout variant="info" title={t.runes.whereItComesFrom}>
            {rune.farmNotes}
          </Callout>
        )}

        {rune.upgradeRecipe && (
          <Section title={t.runes.upgradeRecipe}>
            <Card>
              <p className="font-mono text-sm text-ink">{rune.upgradeRecipe}</p>
              <p className="mt-2 text-sm text-ink-muted">{t.runes.upgradeRecipeBody}</p>
            </Card>
          </Section>
        )}

        {runewords.length > 0 && (
          <Section
            title={fmt(t.runes.runewordsUsing, { rune: rune.name })}
            description={t.runes.runewordsUsingDescription}
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {runewords.map((rw) => (
                <li key={rw.slug}>
                  <LinkCard href={r.runeword(rw.slug)} className="h-full">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base text-rarity-runeword">
                        {rw.name}
                      </h3>
                      <SocketDisplay count={rw.sockets} />
                    </div>
                    <div className="mt-2">
                      <RuneSequence
                        runes={rw.runes}
                        resolveRune={(s) => getRune(locale, s)}
                      />
                    </div>
                    <p className="mt-2 text-xs text-ink-subtle">{rw.bases.display}</p>
                  </LinkCard>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <nav className="flex items-center justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              href={r.rune(prev.slug)}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={r.rune(next.slug)}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </Container>
  );
}
