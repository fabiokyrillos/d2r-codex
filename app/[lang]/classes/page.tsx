import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Callout, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { getBuilds, getClasses, getJourneys } from "@/lib/registry";
import { GAME_VERSION } from "@/lib/game-version";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { releaseLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { hasSkillPages } from "@/lib/skills";
import { notFound } from "next/navigation";

export async function generateMetadata(
  props: PageProps<"/[lang]/classes">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/classes",
    title: t.nav.classes,
    description: t.classes.indexDescription,
  });
}

export default async function ClassesPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const releases = releaseLabels(t);

  const classes = getClasses(locale);
  const builds = getBuilds(locale);
  const journeys = getJourneys(locale);

  const [warnBefore, warnMid, warnAfter] = t.classes.warningBody.split(
    /\{warlock\}|\{expansion\}/,
  );

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.classes}</span>}
        title={t.classes.indexTitle}
        description={t.classes.indexDescription}
        meta={<Badge tone="neutral">Patch {GAME_VERSION.patch}</Badge>}
      />

      <div className="mt-8 space-y-8">
        <Callout variant="warning" title={t.classes.warningTitle}>
          {warnBefore}
          <strong>Warlock</strong>
          {warnMid}
          <em>{GAME_VERSION.expansion}</em>
          {warnAfter}
        </Callout>

        <Section>
          <ul className="grid gap-4 md:grid-cols-2">
            {classes.map((cls) => {
              const classBuilds = builds.filter((b) => b.classSlug === cls.slug);
              const hasJourney = journeys.some((j) => j.classSlug === cls.slug);

              return (
                <li key={cls.slug}>
                  <LinkCard href={r.class(cls.slug)} className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
                        {cls.name}
                      </h2>
                      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                        {cls.requiresDlc && (
                          <Badge tone="ember">{t.classes.requiresDlc}</Badge>
                        )}
                        {cls.release !== "classic" && !cls.requiresDlc && (
                          <Badge tone="outline">{releases[cls.release]}</Badge>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {cls.summary}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-pretty text-ink-subtle">
                      <span className="text-ink-muted">{t.classes.bestFor}</span>{" "}
                      {cls.bestFor}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs">
                      <span className="text-ink-subtle">
                        {fmt(t.classes.beginnerFriendliness, {
                          value: cls.beginnerFriendliness,
                        })}
                      </span>
                      {classBuilds.length > 0 && (
                        <>
                          <span aria-hidden className="text-ink-subtle">
                            ·
                          </span>
                          <span className="text-ember">
                            {fmt(
                              classBuilds.length === 1
                                ? t.classes.buildsCount
                                : t.classes.buildsCountPlural,
                              { count: classBuilds.length },
                            )}
                          </span>
                        </>
                      )}
                      {hasJourney && (
                        <>
                          <span aria-hidden className="text-ink-subtle">
                            ·
                          </span>
                          <span className="text-ember">{t.classes.levelingGuide}</span>
                        </>
                      )}
                    </div>
                  </LinkCard>
                </li>
              );
            })}
          </ul>
        </Section>

        <Callout variant="info" title={t.classes.coverageTitle}>
          {fmt(t.classes.coverageBody, {
            skills: classes.filter((c) => hasSkillPages(c.slug)).length,
            total: classes.length,
            leveling: new Set(journeys.map((j) => j.classSlug)).size,
            builds: new Set(builds.map((b) => b.classSlug)).size,
            buildCount: fmt(
              builds.length === 1 ? t.classes.buildsCount : t.classes.buildsCountPlural,
              { count: builds.length },
            ),
          })}{" "}
          <Link href={r.class("sorceress")} className="text-ember hover:text-ember-bright">
            {t.classes.coverageLink}
          </Link>
        </Callout>
      </div>
    </Container>
  );
}
