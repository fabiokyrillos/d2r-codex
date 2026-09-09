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
import { SkillPackages } from "@/components/game/skill-packages";
import {
  AvailabilityTable,
  ConfidenceNote,
  DifficultyBadge,
  ElementBadge,
  ItemRefLink,
  RichText,
  SkillLink,
} from "@/components/game";
import { GearProgression } from "@/components/game/gear-progression";
import { PageSections, type PageSectionEntry } from "@/components/game/page-sections";
import { TierSelector } from "@/components/game/tier-selector";
import {
  getBuild,
  getBuilds,
  getClass,
  getFarmingArea,
  getMercenary,
  getRuneword,
  getSkill,
} from "@/lib/registry";
import { dictionaryFor, fmt, formatPoints, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import {
  allocationRoleLabels,
  budgetLabels,
  playDifficultyLabels,
  progressionTiers,
  tierOrder,
  ratingLabels,
} from "@/lib/labels";
import { routes } from "@/lib/routes";
import { MAX_HARD_POINTS, hasSkillPages } from "@/lib/skills";

/**
 * The eleven section ids, in document order, written once.
 *
 * Read twice on this page — by the `<Section>` that carries the id and by the
 * summary entry that points at it — so the two cannot drift into disagreeing.
 * The seven that already existed are published URLs and do not change; the four
 * added with the summary are the sections that had a heading and no anchor.
 *
 * Here rather than beside the summary component, and the reason is measured: a
 * Server Component that imports a plain value from a `"use client"` module gets
 * a client reference rather than the value. With the constant exported from
 * `page-sections.tsx` this page compiled, typechecked and rendered eleven
 * entries — every one of them `href="#undefined"`, with all eleven `id`
 * attributes gone and the seven published anchors along with them.
 */
const S = {
  howItPlays: "how-it-plays",
  atAGlance: "at-a-glance",
  strengths: "strengths",
  gettingThere: "getting-there",
  skills: "skills",
  stats: "stats",
  breakpoints: "breakpoints",
  immunities: "immunities",
  gear: "gear",
  mercenary: "mercenary",
  farming: "farming",
} as const;

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

  /*
   * A gate is only a gate if the item it names actually carries availability
   * data. Filtering here rather than asserting means a runeword that later has
   * its restriction lifted — the block deleted from its entry — simply stops
   * rendering the callout, instead of crashing the build page that referenced
   * it. `check:content` is where a `gatedBy` pointing at nothing is caught.
   */
  const gates = (build.gatedBy ?? [])
    .map((rwSlug) => getRuneword(locale, rwSlug))
    .filter((rw) => rw?.availability !== undefined)
    .map((rw) => rw!);
  const tiers = progressionTiers(t);
  const ratings = ratingLabels(t);
  const roles = allocationRoleLabels(t);
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

  /*
   * The table of contents, built from the same three guards the sections
   * themselves are behind — `levelingPath`, `immunityPlan` and a mercenary.
   *
   * Nothing here counts to eleven. All three conditionals happen to be
   * populated in all 53 builds today, so a fixed list would agree with the site
   * right up to the day a build arrives without an immunity plan, and then it
   * would publish an anchor that lands nowhere. That is defect D2's exact
   * shape, and it is why `scripts/build-toc-html.test.ts` compares entries
   * against the sections a document actually rendered rather than against a
   * number.
   *
   * The labels are the headings' own strings, not a second set written for the
   * summary, so an entry and the heading it points at cannot come to disagree.
   */
  const sections: PageSectionEntry[] = [
    { id: S.howItPlays, label: t.builds.howItPlays },
    { id: S.atAGlance, label: t.builds.atAGlance },
    { id: S.strengths, label: t.classes.strengthsWeaknesses },
    ...(build.levelingPath ? [{ id: S.gettingThere, label: t.builds.gettingThere }] : []),
    { id: S.skills, label: t.builds.skills },
    { id: S.stats, label: t.builds.stats },
    { id: S.breakpoints, label: t.classes.breakpointsTitle },
    ...(build.immunityPlan ? [{ id: S.immunities, label: t.builds.immunities }] : []),
    { id: S.gear, label: t.builds.gearProgression, showsActiveTier: true },
    ...(merc ? [{ id: S.mercenary, label: t.builds.mercenary }] : []),
    { id: S.farming, label: t.builds.whereToFarm },
  ];

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

      <div className="mt-6 space-y-12">
        {/*
          "Where are you?", first thing after the title block.

          R-BUILD-1 puts it immediately after the title and before "how it
          plays", and measurement settled the ambiguity: placed here the top of
          the control is at most 554px in en-US across all 53 builds, while
          placing it after the availability gate puts phoenix-strike's at
          2,325px. The gate below still reads before a word of prose, which is
          what its own note asks for.

          `mt-6` rather than `mt-8`: two pt-BR builds end their title block at
          583px and every pixel above the control counts against R-BUILD-1's
          budget.
        */}
        <TierSelector
          tiers={tierOrder.map((slug) => {
            const set = build.gearSets.find((g) => g.tier === slug);
            return {
              slug,
              label: tiers[slug].label,
              short: tiers[slug].short,
              from: set?.levelRange?.[0] ?? 1,
              to: set?.levelRange?.[1] ?? 99,
            };
          })}
          strings={{
            legend: t.builds.tierPicker.legend,
            myTier: t.builds.tierPicker.myTier,
            announce: t.builds.tierPicker.announce,
            goToGear: t.builds.tierPicker.goToGear,
            clear: t.builds.tierPicker.clear,
            clearLabel: t.builds.tierPicker.clearLabel,
            levelsRange: t.builds.levelsRange,
          }}
        />

        {/*
          "What is on this page?", and never above the control.

          Measured at 320px: the top of the tier control is 575px on the two
          worst pt-BR builds, and the stack is `space-y-12`, so a 44px block
          inserted above it would push the control to 667px — past the 640px
          ceiling C14 holds. Below it the cost to that metric is exactly zero.

          What that placement does not buy is the first screen. The control
          measures 154px, so this trigger starts at 777px on those same two
          pages — 137px below the fold at 320×640. §3.7 of the plan expected
          ~100px of control and a ~675px trigger; the fallback it names, a row
          inside the control block, would still land around 693px, because the
          control's own top is already 575px. Reported rather than papered over.
        */}
        <PageSections
          entries={sections}
          tiers={tierOrder.map((slug) => ({ slug, label: tiers[slug].label }))}
          strings={{
            label: t.builds.sections.label,
            trigger: t.builds.sections.trigger,
            close: t.builds.sections.close,
          }}
        />

        {/*
          Above "how it plays", because a reader who cannot make the item this
          build is named after needs to know before they read a word about how
          it feels. The prose is the runeword's, not the build's, so the two
          pages cannot disagree.
        */}
        {gates.length > 0 && (
          <div className="space-y-4">
            {gates.map((rw) => (
              <AvailabilityTable
                key={rw.slug}
                availability={rw.availability!}
                title={fmt(t.availability.gateTitle, { item: rw.name })}
              />
            ))}
          </div>
        )}

        <Section id={S.howItPlays} title={t.builds.howItPlays}>
          {/*
            Through RichText like every other content string. It was not, and
            nothing noticed until an Amazon page emphasised one word in a
            sentence about Crushing Blow applying per hit — the marker printed.
            Every other prose field on this page already went through it.
          */}
          <p className="text-lg leading-relaxed text-pretty text-ink-muted">
            <RichText>{build.playstyle}</RichText>
          </p>
        </Section>

        <Section id={S.atAGlance} title={t.builds.atAGlance}>
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

        <Section id={S.strengths} title={t.classes.strengthsWeaknesses}>
          <ProsCons
            pros={build.strengths}
            cons={build.weaknesses}
            prosLabel={t.common.strengths}
            consLabel={t.common.weaknesses}
          />
        </Section>

        {build.levelingPath && (
          <Section id={S.gettingThere} title={t.builds.gettingThere}>
            <Callout variant="warning" title={t.builds.doNotLevelAs}>
              <RichText>{build.levelingPath.summary}</RichText>
              {/*
                `respecAt` is prose and is authored in markdown like every other
                prose field, so it goes through RichText. It was rendered raw
                until the Necromancer builds put emphasis in it — the Amazon and
                Sorceress values are short unformatted sentences, so the gap was
                invisible until a page needed it. `raw-markup.test.ts` is what
                found it.
              */}
              {build.levelingPath.respecAt && (
                <p className="mt-2">
                  <strong>{t.builds.respecAt}</strong>{" "}
                  <RichText>{build.levelingPath.respecAt}</RichText>
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

        <Section id={S.skills} title={t.builds.skills} description={t.builds.skillsDescription}>
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
                        {formatPoints(t.skills.legendFlex, flexPointsSpent)}
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
                    <SkillLink
                      key="s"
                      classSlug={build.classSlug}
                      skill={alloc.skill}
                      name={skill?.name ?? alloc.skill}
                    />,
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
                    <SkillLink
                      key="s"
                      classSlug={build.classSlug}
                      skill={alloc.skill}
                      name={skill?.name ?? alloc.skill}
                    />,
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

            {/*
              Packages sit between the one-point table and the remaining-points
              notes, because that is the order the decision is made in: the core
              first, then the one choice that spends everything left, then the
              things that are not a skill point at all.
            */}
            {build.skillPackages && build.skillPackages.length > 0 && (
              <div>
                <h3 className="mb-1 text-sm font-semibold text-ink">
                  {t.builds.packages}
                </h3>
                <p className="mb-4 max-w-3xl text-sm leading-relaxed text-ink-muted">
                  {t.builds.packagesDescription}
                </p>
                <SkillPackages build={build} />
              </div>
            )}

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

        <Section id={S.stats} title={t.builds.stats}>
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
          id={S.breakpoints}
          title={t.classes.breakpointsTitle}
          description={t.builds.breakpointsDescription}
        >
          {build.breakpoints.length > 0 && (
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
          )}
          {build.breakpointNotes && (
            <div className={build.breakpoints.length > 0 ? "mt-4" : undefined}>
              <RichText>{build.breakpointNotes}</RichText>
            </div>
          )}
        </Section>

        {build.immunityPlan && (
          <Section id={S.immunities} title={t.builds.immunities}>
            <Callout variant="warning" title={t.builds.immunitiesCalloutTitle}>
              <RichText>{build.immunityPlan}</RichText>
            </Callout>
          </Section>
        )}

        <Section
          id={S.gear}
          title={t.builds.gearProgression}
          description={t.builds.gearProgressionDescription}
        >
          <GearProgression gearSets={build.gearSets} />
        </Section>

        {merc && (
          <Section id={S.mercenary} title={t.builds.mercenary}>
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
                {/*
                  The same `<ItemRefLink>` the mercenaries page uses, for the
                  same data. This rendered `g.ref.slug.replace(/-/g, " ")` —
                  "vampire gaze", lower case and unlinked — and threw `g.why`
                  away, which made it the only cross-reference on the site that
                  did not resolve to the page describing the item.
                */}
                <ul className="mt-2 space-y-3">
                  {merc.gear.map((g, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex flex-wrap items-baseline gap-x-2">
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
                        {g.ref ? (
                          <ItemRefLink refItem={g.ref} />
                        ) : (
                          <span className="font-medium text-ink">{g.label}</span>
                        )}
                      </div>
                      <p className="mt-1 leading-relaxed text-pretty text-ink-muted">{g.why}</p>
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
          id={S.farming}
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
