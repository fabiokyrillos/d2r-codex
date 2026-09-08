import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  Callout,
  Container,
  LinkCard,
  PageHeader,
  Rating,
  Section,
} from "@/components/ui";
import { ElementBadge } from "@/components/game";
import { FilterableBuildList } from "@/components/builds/filterable-build-list";
import { getBuilds, getClass, getClasses } from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { budgetLabels, playDifficultyLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";

export async function generateMetadata(
  props: PageProps<"/[lang]/builds">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  const t = dictionaryFor(lang);
  return pageMetadata(lang, {
    path: "/builds",
    title: t.nav.builds,
    description: t.builds.indexDescription,
  });
}

export default async function BuildsPage() {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const budgets = budgetLabels(t);
  const difficulties = playDifficultyLabels(t);

  const builds = getBuilds(locale);
  const classes = getClasses(locale);
  const documented = new Set(builds.map((b) => b.classSlug));
  const undocumented = classes.filter((c) => !documented.has(c.slug));

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>{t.nav.builds}</span>}
        title={t.builds.indexTitle}
        description={t.builds.indexDescription}
      />

      <div className="mt-8 space-y-10">
        <Section>
          <FilterableBuildList
            builds={builds}
            listClassName="grid gap-4 lg:grid-cols-2"
            cardFor={(build) => {
              const cls = getClass(locale, build.classSlug);
              return (
                  <LinkCard href={r.build(build.classSlug, build.slug)} className="h-full">
                    <p className="text-xs font-semibold tracking-widest text-ember uppercase">
                      {cls?.name}
                    </p>
                    <h2 className="mt-1.5 font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
                      {build.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {build.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {build.damageTypes.map((el) => (
                        <ElementBadge key={el} element={el} />
                      ))}
                      <Badge tone="outline">{budgets[build.budget]}</Badge>
                      <Badge tone="outline">{difficulties[build.difficulty]}</Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-x-6 border-t border-border pt-3">
                      <Rating
                        value={build.ratings.clearSpeed}
                        label={t.builds.clearSpeed}
                        valueLabel={fmt(t.common.outOfFive, {
                          value: build.ratings.clearSpeed,
                        })}
                      />
                      <Rating
                        value={build.ratings.magicFind}
                        label={t.builds.magicFind}
                        valueLabel={fmt(t.common.outOfFive, {
                          value: build.ratings.magicFind,
                        })}
                      />
                      <Rating
                        value={build.ratings.survivability}
                        label={t.builds.survivability}
                        valueLabel={fmt(t.common.outOfFive, {
                          value: build.ratings.survivability,
                        })}
                      />
                      <Rating
                        value={build.ratings.soloSelfFound}
                        label={t.builds.soloSelfFound}
                        valueLabel={fmt(t.common.outOfFive, {
                          value: build.ratings.soloSelfFound,
                        })}
                      />
                    </div>
                  </LinkCard>
              );
            }}
          />
        </Section>

        <Callout variant="info" title={t.builds.whyFewTitle}>
          {t.builds.whyFewBody}
        </Callout>

        {/*
          Guarded, as `leveling/page.tsx` guards its twin. Without it the
          heading rendered over an empty list on every visit in both
          languages — every class has a build now, so the filter has been
          returning nothing for as long as that has been true.
        */}
        {undocumented.length > 0 && (
          <Section title={t.builds.awaitingTitle}>
            <ul className="flex flex-wrap gap-2">
              {undocumented.map((cls) => (
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
