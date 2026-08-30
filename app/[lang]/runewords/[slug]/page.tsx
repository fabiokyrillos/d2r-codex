import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  PageHeader,
  Section,
} from "@/components/ui";
import {
  ConfidenceNote,
  ItemRefLink,
  RichText,
  RuneSequence,
  RunewordBaseRule,
  StatLines,
} from "@/components/game";
import { getBuildsUsingItem, getRune, getRuneword, getRunewords } from "@/lib/registry";
import { alternatesFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { progressionTiers, releaseLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return getRunewords("en-us").map((rw) => ({ slug: rw.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/runewords/[slug]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const rw = getRuneword(lang, slug);
  if (!rw) return {};

  const runeNames = rw.runes.map((r) => getRune(lang, r)?.name ?? r).join(" + ");
  return {
    title: `${rw.name} — ${runeNames}`,
    description: rw.summary,
    alternates: alternatesFor(lang, `/runewords/${slug}`),
    openGraph: { title: `${rw.name} — ${runeNames}`, description: rw.summary },
  };
}

export default async function RunewordPage(
  props: PageProps<"/[lang]/runewords/[slug]">,
) {
  const { slug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const rw = getRuneword(locale, slug);
  if (!rw) notFound();

  const tiers = progressionTiers(t);
  const releases = releaseLabels(t);
  const usedByBuilds = getBuildsUsingItem(locale, "runeword", rw.slug);
  const runeNames = rw.runes.map((slug) => getRune(locale, slug)?.name ?? slug).join(" + ");

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.runewords()} className="hover:text-ink-muted">
              {t.nav.runewords}
            </Link>
            <span aria-hidden>/</span>
            <span>{tiers[rw.tier].label}</span>
          </>
        }
        title={rw.name}
        description={rw.summary}
        meta={
          <>
            <Badge tone="ember">{runeNames}</Badge>
            <Badge tone="neutral">
              {fmt(t.items.levelBadge, { level: rw.requiredLevel })}
            </Badge>
            {rw.release && rw.release !== "lod" && (
              <Badge tone="outline">{releases[rw.release]}</Badge>
            )}
            <ConfidenceNote confidence={rw.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        {/* The base rule sits above everything else on purpose — it is the
            information that prevents the expensive mistake. */}
        <RunewordBaseRule runeword={rw} />

        <Section title={t.runewords.runesInOrder}>
          <div className="rounded-lg border border-border bg-surface p-5">
            <RuneSequence runes={rw.runes} resolveRune={(s) => getRune(locale, s)} />
            <p className="mt-3 text-sm text-ink-muted">{t.runewords.orderWarning}</p>
          </div>
        </Section>

        <Section
          title={t.runewords.statistics}
          description={
            rw.confidence === "unverified"
              ? t.runewords.statisticsUnverified
              : t.runewords.statisticsDescription
          }
        >
          <Card>
            <StatLines stats={rw.stats} />
          </Card>
        </Section>

        {rw.recommendedBases && rw.recommendedBases.length > 0 && (
          <Section title={t.runewords.whichBase}>
            <BulletList
              items={rw.recommendedBases.map((b) => <RichText key={b}>{b}</RichText>)}
            />
          </Section>
        )}

        {rw.commonMistakes && rw.commonMistakes.length > 0 && (
          <Section title={t.runewords.commonMistakes}>
            <Callout variant="warning">
              <ul className="space-y-2">
                {rw.commonMistakes.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span aria-hidden className="text-warning">
                      ✕
                    </span>
                    <span>
                      <RichText>{m}</RichText>
                    </span>
                  </li>
                ))}
              </ul>
            </Callout>
          </Section>
        )}

        {rw.usedBy && (
          <Section title={t.runewords.whoWantsThis}>
            <p className="text-base leading-relaxed text-pretty text-ink-muted">
              <RichText>{rw.usedBy}</RichText>
            </p>
          </Section>
        )}

        {rw.notes && (
          <Callout variant="info" title={t.runewords.worthKnowing}>
            <RichText>{rw.notes}</RichText>
          </Callout>
        )}

        {usedByBuilds.length > 0 && (
          <Section
            title={t.runewords.buildsThatUse}
            description={t.runewords.buildsThatUseDescription}
          >
            <ul className="flex flex-wrap gap-2">
              {usedByBuilds.map((build) => (
                <li key={build.slug}>
                  <Link
                    href={r.build(build.classSlug, build.slug)}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                  >
                    {build.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title={t.runewords.theRunes}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[...new Set(rw.runes)].map((runeSlug) => {
              const rune = getRune(locale, runeSlug);
              if (!rune) return null;
              return (
                <li key={runeSlug}>
                  <Card className="h-full">
                    <div className="flex items-baseline justify-between gap-2">
                      <ItemRefLink refItem={{ kind: "rune", slug: runeSlug }} />
                      <span className="font-mono text-xs text-ink-subtle">
                        {rune.requiredLevel > 0
                          ? fmt(t.runewords.levelShort, { level: rune.requiredLevel })
                          : t.runewords.noLevelReq}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{rune.summary}</p>
                    {rune.farmNotes && (
                      <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                        {rune.farmNotes}
                      </p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      </div>
    </Container>
  );
}
