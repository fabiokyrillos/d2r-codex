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
import { budgetLabels, playDifficultyLabels, releaseLabels } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getClasses().map((cls) => ({ slug: cls.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cls = getClass(slug);
  if (!cls) return {};
  return {
    title: cls.name,
    description: cls.summary,
  };
}

export default async function ClassPage({ params }: Props) {
  const { slug } = await params;
  const cls = getClass(slug);
  if (!cls) notFound();

  const builds = getBuildsForClass(cls.slug);
  const journey = getJourney(cls.slug);
  const breakpoints = getBreakpointsForClass(cls.slug, cls.name);
  const trees = cls.trees.map((t) => getSkillTree(t)).filter((t) => t !== undefined);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/classes" className="hover:text-ink-muted">
              Classes
            </Link>
            <span aria-hidden>/</span>
            <span>{releaseLabels[cls.release]}</span>
          </>
        }
        title={cls.name}
        description={cls.summary}
        meta={
          <>
            {cls.requiresDlc && <Badge tone="ember">Requires {cls.requiresDlc}</Badge>}
            <Badge tone="outline">Beginner friendliness {cls.beginnerFriendliness}/5</Badge>
            <ConfidenceNote confidence={cls.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        {cls.requiresDlc && (
          <Callout variant="warning" title="Paid expansion required">
            The {cls.name} is only playable if you own <strong>{cls.requiresDlc}</strong>.
            It is not included with base Diablo II: Resurrected.
          </Callout>
        )}

        <Section>
          <p className="text-lg leading-relaxed text-pretty text-ink-muted">{cls.overview}</p>
        </Section>

        {(journey || builds.length > 0) && (
          <Section title="Start here">
            <div className="grid gap-3 sm:grid-cols-2">
              {journey && (
                <LinkCard href={`/leveling/${cls.slug}`}>
                  <p className="text-xs font-semibold tracking-widest text-ember uppercase">
                    Leveling
                  </p>
                  <h3 className="mt-1.5 font-display text-lg text-ink group-hover:text-ember-bright">
                    Level 1 to Hell farming
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                    {journey.summary}
                  </p>
                </LinkCard>
              )}
              {builds.map((build) => (
                <LinkCard key={build.slug} href={`/builds/${cls.slug}/${build.slug}`}>
                  <p className="text-xs font-semibold tracking-widest text-ember uppercase">
                    Endgame build
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
                    <Badge tone="outline">{budgetLabels[build.budget]}</Badge>
                    <Badge tone="outline">{playDifficultyLabels[build.difficulty]}</Badge>
                  </div>
                </LinkCard>
              ))}
            </div>
          </Section>
        )}

        <Section title="Strengths and weaknesses">
          <ProsCons pros={cls.strengths} cons={cls.weaknesses} />
        </Section>

        <Section
          title="Core mechanics"
          description="The things that are genuinely specific to this class, and that generic advice tends to get wrong."
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
            title="Attributes"
            description="Starting values, and what each point of Vitality or Energy actually buys."
          >
            <div className="space-y-4">
              <StatGrid
                items={[
                  { label: "Strength", value: cls.attributes.strength },
                  { label: "Dexterity", value: cls.attributes.dexterity },
                  { label: "Vitality", value: cls.attributes.vitality },
                  { label: "Energy", value: cls.attributes.energy },
                ]}
              />
              <DataTable
                headers={["Gain", "Per point", "Per level"]}
                rows={[
                  [
                    "Life",
                    `${cls.attributes.lifePerVitality} per Vitality`,
                    `${cls.attributes.lifePerLevel}`,
                  ],
                  [
                    "Mana",
                    `${cls.attributes.manaPerEnergy} per Energy`,
                    `${cls.attributes.manaPerLevel}`,
                  ],
                ]}
                caption="Some databases publish these in quarter-units, where 8 means 2 life per point. The values here are the player-facing numbers."
              />
            </div>
          </Section>
        )}

        {trees.length > 0 && (
          <Section title="Skill trees">
            <div className="space-y-4">
              {trees.map((tree) => {
                const skills = getSkillsInTree(tree.slug);
                return (
                  <Card key={tree.slug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg text-ink">{tree.name}</h3>
                      <span className="text-xs text-ink-subtle">
                        {skills.length > 0 ? `${skills.length} skills` : "Not yet documented"}
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
                            <span className="shrink-0 font-medium text-ink">{skill.name}</span>
                            <span className="text-pretty text-ink-muted">{skill.summary}</span>
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
          <Section title="Class-specific items">
            <BulletList items={cls.classItems} />
          </Section>
        )}

        {breakpoints.length > 0 && (
          <Section
            title="Breakpoints"
            description="Animation frame thresholds. Speed stats do nothing until they cross one."
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
                    headers={["Required", "Frames"]}
                    rows={table.rows.map((r) => [
                      <span key="v" className="font-mono">
                        {r.value}%
                      </span>,
                      <span key="f" className="font-mono">
                        {r.frames}
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
              <Link href="/breakpoints" className="text-ember hover:text-ember-bright">
                All breakpoint tables →
              </Link>
            </p>
          </Section>
        )}

        {builds.length === 0 && (
          <Callout variant="info" title="Build guides in progress">
            This class has an overview but no build guides yet. The Sorceress is the
            reference implementation — its structure is what every other class will follow.{" "}
            <Link href="/builds" className="text-ember hover:text-ember-bright">
              See documented builds →
            </Link>
          </Callout>
        )}
      </div>
    </Container>
  );
}
