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
  PageHeader,
  ProsCons,
  Rating,
  Section,
} from "@/components/ui";
import { SkillTree } from "@/components/game";
import { ConfidenceNote, DifficultyBadge, ElementBadge, RichText } from "@/components/game";
import { GearProgression } from "@/components/game/gear-progression";
import {
  getBuild,
  getBuilds,
  getClass,
  getFarmingArea,
  getMercenary,
  getSkill,
} from "@/lib/registry";
import { dictionaryFor, fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import {
  budgetLabels,
  playDifficultyLabels,
  progressionTiers,
  ratingLabels,
} from "@/lib/labels";
import { routes } from "@/lib/routes";
import { MAX_HARD_POINTS, hasSkillPages } from "@/lib/skills";
import type { AllocationRole } from "@/lib/types";

export function generateStaticParams() {
  return getBuilds("en-us").map((b) => ({ classSlug: b.classSlug, slug: b.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/builds/[classSlug]/[slug]">,
): Promise<Metadata> {
  const { lang, classSlug, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const build = getBuild(lang, slug);
  if (!build) return {};
  return pageMetadata(lang, {
    path: `/builds/${classSlug}/${slug}`,
    title: build.name,
    description: build.summary,
  });
}

function roleLabels(t: ReturnType<typeof dictionaryFor>): Record<AllocationRole, string> {
  return {
    main: t.builds.roleMain,
    synergy: t.builds.roleSynergy,
    utility: t.builds.roleUtility,
    prerequisite: t.builds.rolePrerequisite,
    flex: t.builds.roleFlex,
  };
}

function priorityLabel(
  t: ReturnType<typeof dictionaryFor>,
  priority: "required" | "recommended" | "luxury",
) {
  return priority === "required"
    ? t.builds.priorityRequired
    : priority === "recommended"
      ? t.builds.priorityRecommended
      : t.builds.priorityLuxury;
}

export default async function BuildPage(
  props: PageProps<"/[lang]/builds/[classSlug]/[slug]">,
) {
  const { classSlug, slug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);

  const build = getBuild(locale, slug);
  if (!build || build.classSlug !== classSlug) notFound();

  const cls = getClass(locale, build.classSlug);
  const merc = build.mercenary ? getMercenary(locale, build.mercenary) : undefined;
  const tiers = progressionTiers(t);
  const ratings = ratingLabels(t);
  const roles = roleLabels(t);
  const budgets = budgetLabels(t);
  const difficulties = playDifficultyLabels(t);

  const maxed = build.skills
    .filter((s) => s.points >= 20)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const onePoints = build.skills.filter((s) => s.points < 20);

  // Flex allocations are optional by definition, so they are shown on the tree
  // but excluded from the mandatory budget the legend reports.
  const mandatoryPoints = build.skills
    .filter((a) => a.role !== "flex" && a.points > 0)
    .reduce((sum, a) => sum + a.points, 0);
  const flexPointsSpent = build.skills
    .filter((a) => a.role === "flex")
    .reduce((sum, a) => sum + a.points, 0);

  // Same gate as the class page: the tree links to skill pages, which exist
  // for the Paladin only in this slice.
  const hasSkillTree = hasSkillPages(build.classSlug);
  const trees = hasSkillTree
    ? (getClass(locale, build.classSlug)?.trees ?? [])
    : [];

  const rate = (value: number) => fmt(t.common.outOfFive, { value });

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.builds()} className="hover:text-ink-muted">
              {t.nav.builds}
            </Link>
            <span aria-hidden>/</span>
            <Link href={r.class(build.classSlug)} className="hover:text-ink-muted">
              {cls?.name ?? build.classSlug}
            </Link>
          </>
        }
        title={build.name}
        description={build.summary}
        meta={
          <>
            {build.damageTypes.map((el) => (
              <ElementBadge key={el} element={el} />
            ))}
            <Badge tone="outline">{budgets[build.budget]}</Badge>
            <Badge tone="outline">{difficulties[build.difficulty]}</Badge>
            <ConfidenceNote confidence={build.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-12">
        <Section title={t.builds.howItPlays}>
          <p className="text-lg leading-relaxed text-pretty text-ink-muted">
            {build.playstyle}
          </p>
        </Section>

        <Section title={t.builds.atAGlance}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                {t.builds.capability}
              </h3>
              <div className="divide-y divide-border">
                <Rating value={build.ratings.clearSpeed} label={t.builds.clearSpeed} valueLabel={rate(build.ratings.clearSpeed)} />
                <Rating value={build.ratings.bossing} label={t.builds.bossing} valueLabel={rate(build.ratings.bossing)} />
                <Rating value={build.ratings.survivability} label={t.builds.survivability} valueLabel={rate(build.ratings.survivability)} />
                <Rating value={build.ratings.magicFind} label={t.builds.magicFind} valueLabel={rate(build.ratings.magicFind)} />
              </div>
            </Card>
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                {t.builds.content}
              </h3>
              <div className="divide-y divide-border">
                <Rating value={build.ratings.terrorZones} label={t.builds.terrorZones} valueLabel={rate(build.ratings.terrorZones)} />
                <Rating value={build.ratings.ubers} label={t.builds.ubers} valueLabel={rate(build.ratings.ubers)} />
                <Rating value={build.ratings.soloSelfFound} label={t.builds.soloSelfFound} valueLabel={rate(build.ratings.soloSelfFound)} />
                <Rating value={build.ratings.players8} label={t.builds.players8} valueLabel={rate(build.ratings.players8)} />
              </div>
            </Card>
          </div>
          <p className="mt-3 text-xs text-ink-subtle">
            {fmt(t.builds.ratingsNote, { low: ratings[1], high: ratings[5] })}
          </p>
        </Section>

        <Section title={t.classes.strengthsWeaknesses}>
          <ProsCons
            pros={build.strengths}
            cons={build.weaknesses}
            prosLabel={t.common.strengths}
            consLabel={t.common.weaknesses}
          />
        </Section>

        {build.levelingPath && (
          <Section title={t.builds.gettingThere}>
            <Callout variant="warning" title={t.builds.doNotLevelAs}>
              <RichText>{build.levelingPath.summary}</RichText>
              {build.levelingPath.respecAt && (
                <p className="mt-2">
                  <strong>{t.builds.respecAt}</strong> {build.levelingPath.respecAt}
                </p>
              )}
              <p className="mt-2">
                <Link
                  href={r.levelingFor(build.classSlug)}
                  className="text-ember hover:text-ember-bright"
                >
                  {t.builds.fullLevelingLink}
                </Link>
              </p>
            </Callout>
          </Section>
        )}

        <Section id="skills" title={t.builds.skills} description={t.builds.skillsDescription}>
          <div className="space-y-8">
            {hasSkillTree && (
              /*
               * The same tree the class page draws, with this build's hard
               * points on it. Hard points only: no gear, no +skills, and no
               * "effective level" — that number would need a +skills total we
               * cannot source, and a number we cannot defend is worse than none.
               */
              <div className="space-y-10">
                {trees.map((tree) => (
                  <SkillTree
                    key={tree}
                    classSlug={build.classSlug}
                    treeSlug={tree}
                    allocations={build.skills}
                  />
                ))}

                <div className="rounded border border-border bg-surface-raised p-4">
                  <h3 className="text-sm font-semibold text-ink">{t.skills.legendTitle}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{t.skills.legendHardPoints}</p>
                  <p className="mt-2 font-mono text-sm text-ink">
                    {fmt(t.skills.legendMandatory, {
                      points: mandatoryPoints,
                      cap: MAX_HARD_POINTS,
                    })}
                    {flexPointsSpent > 0 && (
                      <span className="text-ink-subtle">
                        {" "}
                        {fmt(t.skills.legendFlex, { points: flexPointsSpent })}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">{t.builds.maxInOrder}</h3>
              <DataTable
                headers={[t.builds.colOrder, t.builds.colSkill, t.builds.colPoints, t.builds.colWhy]}
                rows={maxed.map((alloc, i) => {
                  const skill = getSkill(locale, alloc.skill);
                  return [
                    <span key="i" className="font-mono text-xs text-ember">
                      {alloc.order ?? i + 1}
                    </span>,
                    <span key="s" className="font-medium text-ink">
                      {skill?.name ?? alloc.skill}
                    </span>,
                    <span key="p" className="font-mono">
                      {alloc.points}
                    </span>,
                    <span key="w">
                      <RichText>{alloc.note ?? roles[alloc.role]}</RichText>
                    </span>,
                  ];
                })}
              />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">{t.builds.onePointEach}</h3>
              <DataTable
                headers={[t.builds.colSkill, t.builds.colRole, t.builds.colWhy]}
                rows={onePoints.map((alloc) => {
                  const skill = getSkill(locale, alloc.skill);
                  return [
                    <span key="s" className="font-medium text-ink">
                      {skill?.name ?? alloc.skill}
                    </span>,
                    <Badge key="r" tone="outline">
                      {roles[alloc.role]}
                    </Badge>,
                    <span key="w">
                      <RichText>{alloc.note ?? skill?.summary ?? "—"}</RichText>
                    </span>,
                  ];
                })}
              />
            </div>

            {build.flexPoints && build.flexPoints.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-ink">
                  {t.builds.remainingPoints}
                </h3>
                <BulletList
                  items={build.flexPoints.map((f, i) => (
                    <RichText key={i}>{f}</RichText>
                  ))}
                />
              </div>
            )}
          </div>
        </Section>

        <Section id="stats" title={t.builds.stats}>
          <DataTable
            headers={[t.builds.colAttribute, t.builds.colAllocation]}
            rows={[
              [t.classes.attrStrength, build.stats.strength],
              [t.classes.attrDexterity, build.stats.dexterity],
              [t.classes.attrVitality, build.stats.vitality],
              [t.classes.attrEnergy, build.stats.energy],
            ]}
          />
          <div className="mt-4">
            <BulletList
              items={build.stats.notes.map((n, i) => (
                <RichText key={i}>{n}</RichText>
              ))}
            />
          </div>
        </Section>

        <Section
          id="breakpoints"
          title={t.classes.breakpointsTitle}
          description={t.builds.breakpointsDescription}
        >
          <DataTable
            headers={[
              t.builds.colStat,
              t.builds.colTarget,
              t.builds.colFrames,
              t.builds.colPriority,
              t.builds.colWhy,
            ]}
            highlightRow={build.breakpoints.findIndex((b) => b.priority === "required")}
            rows={build.breakpoints.map((bp) => [
              <span key="s" className="font-mono uppercase">
                {bp.stat}
              </span>,
              <span key="v" className="font-mono">
                {bp.value}%
              </span>,
              <span key="f" className="font-mono">
                {bp.frames ?? "—"}
              </span>,
              <Badge
                key="p"
                tone={
                  bp.priority === "required"
                    ? "ember"
                    : bp.priority === "recommended"
                      ? "outline"
                      : "neutral"
                }
              >
                {priorityLabel(t, bp.priority)}
              </Badge>,
              <span key="w">
                <RichText>{bp.why}</RichText>
              </span>,
            ])}
          />
        </Section>

        {build.immunityPlan && (
          <Section id="immunities" title={t.builds.immunities}>
            <Callout variant="warning" title={t.builds.immunitiesCalloutTitle}>
              <RichText>{build.immunityPlan}</RichText>
            </Callout>
          </Section>
        )}

        <Section
          id="gear"
          title={t.builds.gearProgression}
          description={t.builds.gearProgressionDescription}
        >
          <GearProgression gearSets={build.gearSets} />
        </Section>

        {merc && (
          <Section id="mercenary" title={t.builds.mercenary}>
            <Card>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg text-ink">
                  <Link href={r.mercenaries()} className="hover:text-ember-bright">
                    {merc.name}
                  </Link>
                </h3>
                <Badge tone="outline">{fmt(t.mercenaries.actBadge, { act: merc.act })}</Badge>
              </div>
              {build.mercenaryNotes && (
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  <RichText>{build.mercenaryNotes}</RichText>
                </p>
              )}
              <div className="mt-4 border-t border-border pt-3">
                <h4 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                  {t.builds.mercGear}
                </h4>
                <ul className="mt-2 space-y-2">
                  {merc.gear.map((g, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="w-16 shrink-0 text-xs text-ink-subtle">
                        {g.slot === "helm"
                          ? t.gearSlots.helm
                          : g.slot === "weapon"
                            ? t.gearSlots.weapon
                            : t.gearSlots.body}
                      </span>
                      <Badge tone="outline">
                        {g.tier === "budget"
                          ? t.mercenaries.tierBudget
                          : g.tier === "mid"
                            ? t.mercenaries.tierMid
                            : t.mercenaries.tierEndgame}
                      </Badge>
                      <span className="font-medium text-ink">
                        {g.ref ? g.ref.slug.replace(/-/g, " ") : g.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">
                  <Link href={r.mercenaries()} className="text-ember hover:text-ember-bright">
                    {t.builds.fullMercLink}
                  </Link>
                </p>
              </div>
            </Card>
          </Section>
        )}

        <Section
          id="farming"
          title={t.builds.whereToFarm}
          description={t.builds.whereToFarmDescription}
        >
          <div className="space-y-3">
            {build.farming.map((entry, i) => {
              const area = getFarmingArea(locale, entry.area);
              return (
                <Card key={`${entry.area}-${entry.difficulty}-${i}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base">
                      <Link
                        href={r.farmingArea(entry.area)}
                        className="text-ink hover:text-ember-bright"
                      >
                        {area?.name ?? entry.area}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <DifficultyBadge difficulty={entry.difficulty} />
                      {area?.hellLevel85 && entry.difficulty === "hell" && (
                        <Badge tone="ember">alvl 85</Badge>
                      )}
                      <Badge tone="outline">{tiers[entry.minTier].label}+</Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                    <RichText>{entry.why}</RichText>
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>

        <div className="grid gap-4 sm:grid-cols-2">
          {build.selfFoundNotes && (
            <Card>
              <h3 className="font-display text-base text-ink">{t.builds.selfFound}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                <RichText>{build.selfFoundNotes}</RichText>
              </p>
            </Card>
          )}
          {build.hardcoreNotes && (
            <Card>
              <h3 className="font-display text-base text-ink">{t.builds.hardcore}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                <RichText>{build.hardcoreNotes}</RichText>
              </p>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
