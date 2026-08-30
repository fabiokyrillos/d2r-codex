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
import { GAME_VERSION } from "@/lib/game-version";
import { alternatesFor, dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";

export async function generateMetadata(
  props: PageProps<"/[lang]/about/sources">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return {
    title: t.sources.title,
    description: t.sources.description,
    alternates: alternatesFor(lang, "/about/sources"),
  };
}

export default async function SourcesPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const [d1a, d1b] = t.sources.disagreement1.split("{strong}");
  const disagreement2Parts = t.sources.disagreement2.split(/\{strong\}|\{link\}/);
  const [gapsBefore, gapsAfter] = t.sources.gapsLede.split("{file}");

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={<span>{t.footer.columnAbout}</span>}
        title={t.sources.title}
        description={t.sources.description}
        meta={
          <>
            <Badge tone="ember">
              {fmt(t.home.badge, {
                patch: GAME_VERSION.patch,
                season: GAME_VERSION.season,
              })}
            </Badge>
            <Badge tone="outline">
              {fmt(t.sources.verifiedOn, { date: GAME_VERSION.verifiedOn })}
            </Badge>
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title={t.sources.versionTitle}>
          <DataTable
            headers={[t.sources.colFact, t.sources.colValue]}
            rows={[
              [
                t.sources.factPatch,
                fmt(t.sources.patchValue, {
                  patch: GAME_VERSION.patch,
                  build: GAME_VERSION.clientBuild,
                }),
              ],
              [
                t.sources.factSeason,
                fmt(t.sources.seasonValue, { season: GAME_VERSION.season }),
              ],
              [t.sources.factSeasonStart, GAME_VERSION.seasonStart],
              [t.sources.factExpansion, GAME_VERSION.expansion],
              [t.sources.factClasses, t.sources.factClassesValue],
            ]}
          />
        </Section>

        <Section title={t.sources.hierarchyTitle}>
          <p className="mb-4 text-base leading-relaxed text-pretty text-ink-muted">
            {t.sources.hierarchyLede}
          </p>
          <DataTable
            headers={[t.sources.colTier, t.sources.colSource, t.sources.colUsedFor]}
            rows={[
              ["1", t.sources.tier1Source, t.sources.tier1Used],
              ["2", t.sources.tier2Source, t.sources.tier2Used],
              ["3", t.sources.tier3Source, t.sources.tier3Used],
              ["4", t.sources.tier4Source, t.sources.tier4Used],
            ]}
          />
        </Section>

        <Section title={t.sources.mistakesTitle}>
          <div className="space-y-4">
            <Card>
              <h3 className="font-display text-base text-ink">{t.sources.mistake1Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {t.sources.mistake1Body}
              </p>
            </Card>
            <Card>
              <h3 className="font-display text-base text-ink">{t.sources.mistake2Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {t.sources.mistake2Body}
              </p>
            </Card>
          </div>
        </Section>

        <Section title={t.sources.disagreementsTitle}>
          <Callout variant="info" title={t.sources.disagreementsCalloutTitle}>
            <p>{t.sources.disagreementsLede}</p>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-2">
                <span aria-hidden className="text-ember">
                  ·
                </span>
                <span>
                  {d1a}
                  <strong>{t.sources.disagreement1Strong}</strong>
                  {d1b}
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-ember">
                  ·
                </span>
                <span>
                  {disagreement2Parts[0]}
                  <strong>{t.sources.disagreement2Strong}</strong>
                  {disagreement2Parts[1]}
                  <Link
                    href={r.mechanic("terror-zones")}
                    className="text-ember hover:text-ember-bright"
                  >
                    {t.sources.disagreement2Link}
                  </Link>
                  {disagreement2Parts[2]}
                </span>
              </li>
            </ul>
          </Callout>
        </Section>

        <Section title={t.sources.confidenceTitle}>
          <p className="mb-4 text-base leading-relaxed text-pretty text-ink-muted">
            {t.sources.confidenceLede}
          </p>
          <DataTable
            headers={[t.sources.colLevel, t.sources.colMeaning, t.sources.colShownInUi]}
            rows={[
              [t.sources.confVerified, t.sources.confVerifiedMeaning, t.sources.confVerifiedShown],
              [t.sources.confSingle, t.sources.confSingleMeaning, t.sources.shownYes],
              [t.sources.confCommunity, t.sources.confCommunityMeaning, t.sources.shownYes],
              [
                t.sources.confUnverified,
                t.sources.confUnverifiedMeaning,
                t.sources.shownYesProminently,
              ],
            ]}
          />
        </Section>

        <Section title={t.sources.gapsTitle}>
          <p className="mb-4 text-base leading-relaxed text-pretty text-ink-muted">
            {gapsBefore}
            <code className="font-mono text-sm">docs/research/00-game-state.md</code>
            {gapsAfter}
          </p>
          <ul className="space-y-2.5">
            {[
              t.sources.gap1,
              t.sources.gap2,
              t.sources.gap3,
              t.sources.gap4,
              t.sources.gap5,
              t.sources.gap6,
              t.sources.gap7,
              t.sources.gap8,
            ].map((gap) => (
              <li key={gap} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-warning" />
                <span className="text-pretty">{gap}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t.sources.originalTitle}>
          <p className="text-base leading-relaxed text-pretty text-ink-muted">
            {t.sources.originalBody}
          </p>
        </Section>

        <Section title={t.sources.languageTitle}>
          <p className="text-base leading-relaxed text-pretty text-ink-muted">
            {t.sources.languageBody}
          </p>
        </Section>
      </div>
    </Container>
  );
}
