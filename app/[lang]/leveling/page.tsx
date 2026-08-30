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
import { getClass, getClasses, getJourneys } from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { routes } from "@/lib/routes";

export async function generateMetadata(
  props: PageProps<"/[lang]/leveling">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/leveling",
    title: t.nav.leveling,
    description: t.leveling.indexDescription,
  });
}

export default async function LevelingPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const journeys = getJourneys(locale);
  const classes = getClasses(locale);
  const documented = new Set(journeys.map((j) => j.classSlug));

  const [resBeforeNm, resBetween, resAfterHell] = t.leveling.resistanceBodyA.split(
    /\{nm\}|\{hell\}/,
  );
  const [resB1, resB2] = t.leveling.resistanceBodyB.split("{after}");

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.leveling}</span>}
        title={t.leveling.indexTitle}
        description={t.leveling.indexDescription}
      />

      <div className="mt-8 space-y-10">
        <Section title={t.leveling.guides}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {journeys.map((journey) => {
              const cls = getClass(locale, journey.classSlug);
              return (
                <li key={journey.classSlug}>
                  <LinkCard href={r.levelingFor(journey.classSlug)} className="h-full">
                    <h2 className="font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
                      {cls?.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {journey.summary}
                    </p>
                    <p className="mt-3 text-xs text-ink-subtle">
                      {fmt(t.leveling.stagesCount, { count: journey.stages.length })}
                    </p>
                  </LinkCard>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          title={t.leveling.transitionsTitle}
          description={t.leveling.transitionsDescription}
        >
          <DataTable
            headers={[
              t.leveling.colMilestone,
              t.leveling.colRecommendedLevel,
              t.leveling.colWhy,
            ]}
            rows={t.levelingTables.transitions.map((row) => [
              row.milestone,
              row.level,
              row.why,
            ])}
          />
        </Section>

        <Section title={t.leveling.resistancePenaltyTitle}>
          <Callout variant="warning" title={t.leveling.resistanceCalloutTitle}>
            <p>
              {resBeforeNm}
              <strong>−40%</strong>
              {resBetween}
              <strong>−100%</strong>
              {resAfterHell}
            </p>
            <p className="mt-2">
              {resB1}
              <em>{t.leveling.resistanceAfter}</em>
              {resB2}
            </p>
          </Callout>

          <div className="mt-4">
            <DataTable
              headers={[
                t.leveling.colDifficulty,
                t.leveling.colResistancePenalty,
                t.leveling.colDeathPenalty,
              ]}
              rows={t.levelingTables.penalties.map((row) => [
                row.difficulty,
                row.resistance,
                row.death,
              ])}
              caption={t.leveling.resistanceCaption}
            />
          </div>
        </Section>

        <Section title={t.leveling.questsTitle} description={t.leveling.questsDescription}>
          <DataTable
            headers={[t.leveling.colQuest, t.leveling.colAct, t.leveling.colReward]}
            rows={t.levelingTables.quests.map((row) => [row.quest, row.act, row.reward])}
            caption={t.leveling.questsCaption}
          />
          <div className="mt-4">
            <Card>
              <h3 className="font-display text-base text-ink">{t.leveling.imbueTitle}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                {t.leveling.imbueBody}
              </p>
            </Card>
          </div>
        </Section>

        {classes.filter((c) => !documented.has(c.slug)).length > 0 && (
          <Section title={t.leveling.awaitingTitle}>
            <ul className="flex flex-wrap gap-2">
              {classes
                .filter((c) => !documented.has(c.slug))
                .map((cls) => (
                  <li key={cls.slug}>
                    <Link
                      href={r.class(cls.slug)}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                    >
                      {cls.name}
                      {cls.requiresDlc && <Badge tone="ember">{t.home.dlcBadge}</Badge>}
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
