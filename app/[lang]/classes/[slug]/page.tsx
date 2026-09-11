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
import { ConfidenceNote, RichText, SkillTreesSection } from "@/components/game";
import { AnchorRealign } from "@/components/game/anchor-realign";
import { SectionNav, type SectionNavEntry } from "@/components/game/section-nav";
import { BuildCard } from "@/components/builds/build-card";
import { FilterableBuildList } from "@/components/builds/filterable-build-list";
import { CLASS_PAGE_FILTER_GROUPS } from "@/lib/builds/filter";
import {
  getBreakpointsForClass,
  getBuildsForClass,
  getClass,
  getClasses,
  getJourney,
  getSkillsInTree,
  getSkillTree,
} from "@/lib/registry";
import { hasSkillPages } from "@/lib/skills";
import { fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { releaseLabels } from "@/lib/labels";
import { routes } from "@/lib/routes";

/**
 * The five ids R-NAV-3 names, written once and read twice on this page — by the
 * `<Section>` that carries one and by the summary entry that points at it, so
 * the two cannot drift into disagreeing.
 *
 * `skills` is not new. It is the only id this page has ever had, it is what
 * `lib/routes.ts` builds `classSkills()` out of, and it is a published URL: it
 * does not change. The other four are sections that had a heading and no
 * anchor.
 *
 * Three of the page's eight sections are deliberately absent — "Strengths and
 * weaknesses", "Class-specific items" and the untitled introduction — because
 * R-NAV-3 names five. That is why no gate here counts entries against sections:
 * five is not eight, and a gate that compared the two would be red on the day
 * it was written. What is asserted instead is that every entry resolves, and
 * that every section *on this list* which rendered has exactly one.
 *
 * Not in the client module for the reason `page-sections.tsx` documents at
 * length: a Server Component importing a plain value from a `"use client"`
 * module receives a client reference rather than the value, and the failure is
 * silent — eleven `href="#undefined"` with every `id` attribute gone.
 */
const S = {
  builds: "builds",
  mechanics: "mechanics",
  attributes: "attributes",
  skills: "skills",
  breakpoints: "breakpoints",
} as const;

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
  return pageMetadata(lang, {
    path: `/classes/${slug}`,
    title: cls.name,
    description: cls.summary,
  });
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

  // Only classes whose skills have pages get the tree: a tile links to the
  // full skill page, so drawing one for a class without those pages would
  // manufacture dead links.
  const showSkillTree = hasSkillPages(cls.slug);

  const releases = releaseLabels(t);

  /*
   * The summary, built from the same guards as the sections themselves.
   *
   * Every entry is conditional on exactly the condition its section is
   * conditional on — `journey || builds.length`, `cls.attributes`, `trees`,
   * `breakpoints` — because an entry pointing at a section that did not render
   * is defect D2's exact shape, and three of these five are genuinely optional:
   * the Warlock has no breakpoint tables of its own, and a class documented
   * without attributes would lose that section and its anchor together.
   *
   * The labels are the headings' own strings rather than a second set written
   * for the summary, so an entry and the heading it points at cannot come to
   * disagree in either language.
   */
  const sections: SectionNavEntry[] = [
    ...(journey || builds.length > 0 ? [{ id: S.builds, label: t.classes.startHere }] : []),
    { id: S.mechanics, label: t.classes.coreMechanics },
    ...(cls.attributes ? [{ id: S.attributes, label: t.classes.attributes }] : []),
    ...(trees.length > 0 ? [{ id: S.skills, label: t.classes.skillTrees }] : []),
    ...(breakpoints.length > 0
      ? [{ id: S.breakpoints, label: t.classes.breakpointsTitle }]
      : []),
  ];

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
        {/*
          "Where am I?", first thing after the title block, as on the build page.

          A different component from the build page's, and the reason is the
          requirement rather than the plumbing. R-NAV-3 asks for "Skill trees
          reachable in one interaction from the top", and a disclosure is two:
          open it, then choose. Five entries wrap into a single row even at
          320px, so there is nothing here to hide behind a button — and nothing
          to observe either, since a class page has no gear tiers. That leaves a
          plain server-rendered `<nav>`, which behaves the same with scripting
          on and off and does not depend on the `::details-content` support
          floor the build page's panel needs.

          The strings are `builds.sections` — generic ("Sections on this page"),
          and the entry labels are the headings themselves, so a second copy
          under a `classes.*` key would be more things to keep in step for no
          reader-visible difference.
        */}
        <SectionNav entries={sections} label={t.builds.sections.label} />
        {/*
          The other half of the summary, and the reason it is a separate
          component rather than a prop on the one above: `SectionNav` is a
          server component that behaves identically with scripting off, and
          this is only ever needed when scripting is *on*.

          `#builds` below is a `FilterableBuildList`, and its static HTML is
          the Suspense fallback — since Phase 3 the plain list under the class
          chips on the catalogue, and the plain list alone here. Hydration
          replaces it with the live listing, and what the section gains is the
          second row of controls: the stage picker, "More filters", the sort
          and the count. That growth is above every other anchor on this
          page, and a load that already carries `#skills` has been jumped
          before it happens, so the reader arrives that far below the heading
          they asked for. This puts them back once the page has stopped
          growing. It renders nothing.
        */}
        <AnchorRealign />

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
          <Section id={S.builds} title={t.classes.startHere}>
            {/*
              The class filter is deliberately absent here: every build on this
              page is this class's, so the control could only ever be ticked or
              not with the same result.
            */}
            <FilterableBuildList
              builds={builds}
              groups={CLASS_PAGE_FILTER_GROUPS}
              listClassName="grid gap-3 sm:grid-cols-2"
              leading={
                journey ? (
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
                ) : undefined
              }
              cardFor={(build, row) => <BuildCard build={build} row={row} variant="class" />}
            />
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
          id={S.mechanics}
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
          <Section
            id={S.attributes}
            title={t.classes.attributes}
            description={t.classes.attributesDescription}
          >
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
          <Section id={S.skills} title={t.classes.skillTrees}>
            {showSkillTree ? (
              /*
               * The three trees as one island rendered from data (Phase 4,
               * decision 1). The `#<tree>` ids `routes.skillTree` publishes
               * are rendered by the island on `[data-tree]`, so this page
               * keeps no wrapper of its own with the same id: two elements
               * per id is what an anchor jump silently gets wrong.
               */
              <SkillTreesSection classSlug={cls.slug} />
            ) : (
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
            )}
          </Section>
        )}

        {cls.classItems && cls.classItems.length > 0 && (
          <Section title={t.classes.classItems}>
            <BulletList items={cls.classItems} />
          </Section>
        )}

        {breakpoints.length > 0 && (
          <Section
            id={S.breakpoints}
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
