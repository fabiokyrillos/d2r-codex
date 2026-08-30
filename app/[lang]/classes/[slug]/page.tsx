import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  DataTable,
  LinkCard,
  PageHeader,
  ProsCons,
  Section,
  StatGrid,
} from "@/components/ui";
import { ConfidenceNote, ElementBadge, RichText } from "@/components/game";
import {
  getBreakpointsForClass,
  getBuildsForClass,
  getClass,
  getClasses,
  getJourney,
  getSkillsInTree,
  getSkillTree,
} from "@/lib/registry";
import {
  alternatesFor,
  fmt,
  isLocale,
} from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { budgetLabels, playDifficultyLabels, releaseLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";

/**
 * Slugs are identical across locales by design, so this returns only the slug
 * segment. Next.js runs it once per root `lang` value, producing both
 * languages of every class page.
 */
export function generateStaticParams() {
  return getClasses("en-us").map((cls) => ({ slug: cls.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/classes/[slug]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const cls = getClass(lang, slug);
  if (!cls) return {};
  return {
    title: cls.name,
    description: cls.summary,
    alternates: alternatesFor(lang, `/classes/${slug}`),
    openGraph: { title: cls.name, description: cls.summary },
  };
}

export default async function ClassPage(props: PageProps<"/[lang]/classes/[slug]">) {
  const { slug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const cls = getClass(locale, slug);
  if (!cls) notFound();

  const builds = getBuildsForClass(locale, cls.slug);
  const journey = getJourney(locale, cls.slug);
  // Membership is decided on the invariant English name so it stays correct in
  // every locale; the tables returned are localized.
  const englishName = getClass("en-us", cls.slug)?.name ?? cls.name;
  const breakpoints = getBreakpointsForClass(locale, cls.slug, englishName);
  const trees = cls.trees
    .map((tree) => getSkillTree(locale, tree))
    .filter((tree) => tree !== undefined);

  const releases = releaseLabels(t);
  const budgets = budgetLabels(t);
  const difficulties = playDifficultyLabels(t);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.classes()} className="hover:text-ink-muted">
              {t.nav.classes}
            </Link>
            <span aria-hidden>/</span>
            <span>{releases[cls.release]}</span>
          </>
        }
        title={cls.name}
        description={cls.summary}
        meta={
          <>
            {cls.requiresDlc && (
              <Badge tone="ember">
                {t.classes.requiresDlc} — {cls.requiresDlc}
              </Badge>
            )}
            <Badge tone="outline">
              {fmt(t.classes.beginnerFriendliness, { value: cls.beginnerFriendliness })}
            </Badge>
            <ConfidenceNote confidence={cls.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        {cls.requiresDlc && (
          <Callout variant="warning" title={t.classes.dlcCalloutTitle}>
            {t.classes.dlcCalloutBody
              .replace("{class}", cls.name)
              .replace("{dlc}", cls.requiresDlc)}
          </Callout>
        )}

        <Section>
          <p className="text-lg leading-relaxed text-pretty text-ink-muted">
            {cls.overview}
          </p>
        </Section>

        {(journey || builds.length > 0) && (
          <Section title={t.classes.startHere}>
            <div className="grid gap-3 sm:grid-cols-2">
              {journey && (
                <LinkCard href={r.levelingFor(cls.slug)}>
                  <p className="text-xs font-semibold tracking-widest text-ember uppercase">
                    {t.classes.levelingEyebrow}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg text-ink group-hover:text-ember-bright">
                    {t.classes.levelingCardTitle}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                    {journey.summary}
                  </p>
                </LinkCard>
              )}
              {builds.map((build) => (
                <LinkCard key={build.slug} href={r.build(cls.slug, build.slug)}>
                  <p className="text-xs font-semibold tracking-widest text-ember uppercase">
                    {t.classes.endgameEyebrow}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg text-ink group-hover:text-ember-bright">
                    {build.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                    {build.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {build.damageTypes.map((el) => (
                      <ElementBadge key={el} element={el} />
                    ))}
                    <Badge tone="outline">{budgets[build.budget]}</Badge>
                    <Badge tone="outline">{difficulties[build.difficulty]}</Badge>
                  </div>
                </LinkCard>
              ))}
            </div>
          </Section>
        )}

        <Section title={t.classes.strengthsWeaknesses}>
          <ProsCons
            pros={cls.strengths}
            cons={cls.weaknesses}
            prosLabel={t.common.strengths}
            consLabel={t.common.weaknesses}
          />
        </Section>

        <Section
          title={t.classes.coreMechanics}
          description={t.classes.coreMechanicsDescription}
        >
          <div className="space-y-3">
            {cls.coreMechanics.map((m) => (
              <Card key={m.title}>
                <h3 className="font-display text-base text-ink">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                  <RichText>{m.body}</RichText>
                </p>
              </Card>
            ))}
          </div>
        </Section>

        {cls.attributes && (
          <Section title={t.classes.attributes} description={t.classes.attributesDescription}>
            <div className="space-y-4">
              <StatGrid
                items={[
                  { label: t.classes.attrStrength, value: cls.attributes.strength },
                  { label: t.classes.attrDexterity, value: cls.attributes.dexterity },
                  { label: t.classes.attrVitality, value: cls.attributes.vitality },
                  { label: t.classes.attrEnergy, value: cls.attributes.energy },
                ]}
              />
              <DataTable
                headers={[t.classes.gainHeader, t.classes.perPoint, t.classes.perLevel]}
                rows={[
                  [
                    t.classes.life,
                    fmt(t.classes.perVitality, { value: cls.attributes.lifePerVitality }),
                    `${cls.attributes.lifePerLevel}`,
                  ],
                  [
                    t.classes.mana,
                    fmt(t.classes.perEnergy, { value: cls.attributes.manaPerEnergy }),
                    `${cls.attributes.manaPerLevel}`,
                  ],
                ]}
                caption={t.classes.attributesCaption}
              />
            </div>
          </Section>
        )}

        {trees.length > 0 && (
          <Section id="skills" title={t.classes.skillTrees}>
            <div className="space-y-4">
              {trees.map((tree) => {
                const skills = getSkillsInTree(locale, tree.slug);
                return (
                  <Card key={tree.slug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg text-ink">{tree.name}</h3>
                      <span className="text-xs text-ink-subtle">
                        {skills.length > 0
                          ? fmt(t.classes.skillsCount, { count: skills.length })
                          : t.classes.treeNotDocumented}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                      {tree.theme}
                    </p>

                    {skills.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-border pt-3">
                        {skills.map((skill) => (
                          <li key={skill.slug} className="flex gap-3 text-sm">
                            <span className="w-8 shrink-0 font-mono text-xs text-ink-subtle">
                              {skill.requiredLevel}
                            </span>
                            <span className="shrink-0 font-medium text-ink">
                              {skill.name}
                            </span>
                            <span className="text-pretty text-ink-muted">
                              {skill.summary}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {cls.classItems && cls.classItems.length > 0 && (
          <Section title={t.classes.classItems}>
            <BulletList items={cls.classItems} />
          </Section>
        )}

        {breakpoints.length > 0 && (
          <Section
            title={t.classes.breakpointsTitle}
            description={t.classes.breakpointsDescription}
          >
            <div className="space-y-4">
              {breakpoints.map((table) => (
                <div key={table.slug}>
                  <h3 className="mb-2 font-display text-base text-ink">
                    {table.name}
                    {table.variant && (
                      <span className="ml-2 text-sm font-normal text-ink-subtle">
                        {table.variant}
                      </span>
                    )}
                  </h3>
                  <DataTable
                    headers={[t.breakpoints.colRequired, t.builds.colFrames]}
                    rows={table.rows.map((row) => [
                      <span key="v" className="font-mono">
                        {row.value}%
                      </span>,
                      <span key="f" className="font-mono">
                        {row.frames}
                      </span>,
                    ])}
                  />
                  {table.guidance && (
                    <div className="mt-3">
                      <BulletList
                        items={table.guidance.map((g, i) => (
                          <RichText key={i}>{g}</RichText>
                        ))}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-ink-subtle">
              <Link href={r.breakpoints()} className="text-ember hover:text-ember-bright">
                {t.classes.allBreakpointsLink}
              </Link>
            </p>
          </Section>
        )}

        {builds.length === 0 && (
          <Callout variant="info" title={t.classes.noBuildsTitle}>
            {t.classes.noBuildsBody}{" "}
            <Link href={r.builds()} className="text-ember hover:text-ember-bright">
              {t.classes.noBuildsLink}
            </Link>
          </Callout>
        )}
      </div>
    </Container>
  );
}
