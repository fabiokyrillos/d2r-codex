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
  Rating,
  Section,
  StatGrid,
} from "@/components/ui";
import {
  ConfidenceNote,
  DifficultyBadge,
  ElementBadge,
  ItemRefLink,
} from "@/components/game";
import {
  getBuildsFarmingArea,
  getClass,
  getFarmingArea,
  getFarmingAreas,
} from "@/lib/registry";
import { fmt, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getI18n } from "@/lib/i18n/server";
import { progressionTiers } from "@/lib/labels";
import { routes } from "@/lib/routes";
import type { Dictionary } from "@/lib/i18n";
import type { FarmTarget } from "@/lib/types";

export function generateStaticParams() {
  return getFarmingAreas("en-us").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/farming/[slug]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const area = getFarmingArea(lang, slug);
  if (!area) return {};
  return pageMetadata(lang, {
    path: `/farming/${slug}`,
    title: area.name,
    description: area.summary,
  });
}

function targetLabel(t: Dictionary, target: FarmTarget): string {
  const map: Record<FarmTarget, string> = {
    runes: t.farming.targetRunes,
    uniques: t.farming.targetUniques,
    sets: t.farming.targetSets,
    bases: t.farming.targetBases,
    charms: t.farming.targetCharms,
    jewels: t.farming.targetJewels,
    gems: t.farming.targetGems,
    experience: t.farming.targetExperience,
    gold: t.farming.targetGold,
    keys: t.farming.targetKeys,
    essences: t.farming.targetEssences,
  };
  return map[target];
}

function runLengthLabel(t: Dictionary, value: string): string {
  return value === "very-short"
    ? t.farming.runLengthVeryShort
    : value === "short"
      ? t.farming.runLengthShort
      : value === "medium"
        ? t.farming.runLengthMedium
        : t.farming.runLengthLong;
}

function bossKindLabel(t: Dictionary, kind: string): string {
  return kind === "act-boss"
    ? t.farming.bossKindActBoss
    : kind === "super-unique"
      ? t.farming.bossKindSuperUnique
      : kind === "unique-pack"
        ? t.farming.bossKindUniquePack
        : t.farming.bossKindEvent;
}

export default async function FarmingAreaPage(
  props: PageProps<"/[lang]/farming/[slug]">,
) {
  const { slug } = await props.params;
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const tiers = progressionTiers(t);

  const area = getFarmingArea(locale, slug);
  if (!area) notFound();

  const builds = getBuildsFarmingArea(locale, area.slug);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href={r.farming()} className="hover:text-ink-muted">
              {t.nav.farming}
            </Link>
            <span aria-hidden>/</span>
            <span>{fmt(t.farming.act, { act: area.act })}</span>
          </>
        }
        title={area.name}
        description={area.summary}
        meta={
          <>
            {area.hellLevel85 && <Badge tone="ember">{t.farming.alvl85Title}</Badge>}
            {area.recommendedDifficulties.map((d) => (
              <DifficultyBadge key={d} difficulty={d} />
            ))}
            {area.terrorZone && (
              <Badge tone="outline">{t.farming.terrorZoneRotation}</Badge>
            )}
            <ConfidenceNote confidence={area.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title={t.farming.areaLevels}>
          <StatGrid
            items={[
              { label: t.farming.normal, value: area.levels.normal },
              { label: t.farming.nightmare, value: area.levels.nightmare },
              {
                label: t.farming.hell,
                value: area.levels.hell,
                hint: area.hellLevel85 ? t.farming.topTreasureClasses : undefined,
              },
              { label: fmt(t.farming.act, { act: area.act }), value: area.act },
            ]}
          />
          <p className="mt-3 text-sm text-ink-subtle">
            {t.farming.levelsSource.split("{file}").map((part, i, all) => (
              <span key={i}>
                {part}
                {i < all.length - 1 && (
                  <code className="font-mono">levels.txt</code>
                )}
              </span>
            ))}
          </p>
        </Section>

        <Section title={t.farming.whyRunIt}>
          <p className="text-base leading-relaxed text-pretty text-ink-muted">{area.why}</p>
        </Section>

        <Section title={t.farming.gettingThere}>
          <Card>
            <p className="text-sm leading-relaxed text-ink-muted">{area.access}</p>
          </Card>
          {area.route && area.route.length > 0 && (
            <ol className="mt-4 space-y-2.5">
              {area.route.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-surface-overlay font-mono text-xs text-ember">
                    {i + 1}
                  </span>
                  <span className="text-pretty">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </Section>

        <Section title={t.farming.whatToExpect}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                {t.farming.characteristics}
              </h3>
              <div className="divide-y divide-border">
                <Rating
                  value={area.density}
                  label={t.farming.monsterDensity}
                  valueLabel={fmt(t.common.outOfFive, { value: area.density })}
                />
                <Rating
                  value={area.danger}
                  label={t.farming.danger}
                  valueLabel={fmt(t.common.outOfFive, { value: area.danger })}
                />
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                <span className="text-ink-subtle">{t.farming.runLength} </span>
                {runLengthLabel(t, area.runLength)}
              </p>
            </Card>
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                {t.farming.commonImmunitiesHell}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {area.commonImmunities.length > 0 ? (
                  area.commonImmunities.map((el) => <ElementBadge key={el} element={el} />)
                ) : (
                  <span className="text-sm text-ink-muted">{t.farming.noneNotable}</span>
                )}
              </div>
              <h3 className="mt-4 mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                {t.farming.goodFor}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {area.targets.map((target) => (
                  <Badge key={target} tone="outline">
                    {targetLabel(t, target)}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {area.bosses && area.bosses.length > 0 && (
          <Section title={t.farming.bossesTitle}>
            <DataTable
              headers={[t.farming.colName, t.farming.colType, t.farming.colNotes]}
              rows={area.bosses.map((b) => [
                <span key="n" className="font-medium text-ink">
                  {b.name}
                  {b.hellLevel && (
                    <span className="ml-2 font-mono text-xs text-ember">
                      mlvl {b.hellLevel}
                    </span>
                  )}
                </span>,
                <span key="t" className="text-xs">
                  {bossKindLabel(t, b.kind)}
                </span>,
                <span key="d">
                  {b.notes}
                  {b.immunities && b.immunities.length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {b.immunities.map((el) => (
                        <ElementBadge key={el} element={el} />
                      ))}
                    </span>
                  )}
                </span>,
              ])}
            />
          </Section>
        )}

        {area.notableDrops && area.notableDrops.length > 0 && (
          <Section title={t.farming.notableTargets}>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {area.notableDrops.map((ref, i) => (
                <li key={i}>
                  <ItemRefLink refItem={ref} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {builds.length > 0 && (
          <Section
            title={t.farming.buildsThatFarm}
            description={t.farming.buildsThatFarmDescription}
          >
            <div className="space-y-3">
              {builds.map((build) => {
                const entry = build.farming.find((f) => f.area === area.slug);
                return (
                  <Card key={build.slug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base">
                        <Link
                          href={r.build(build.classSlug, build.slug)}
                          className="text-ink hover:text-ember-bright"
                        >
                          {build.name}
                        </Link>
                      </h3>
                      {entry && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <DifficultyBadge difficulty={entry.difficulty} />
                          <Badge tone="outline">{tiers[entry.minTier].label}+</Badge>
                        </div>
                      )}
                    </div>
                    {entry && (
                      <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                        {entry.why}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {area.poorlySuitedTo && (
          <Callout variant="warning" title={t.farming.notForEveryBuild}>
            {area.poorlySuitedTo}
          </Callout>
        )}

        {area.notes && (
          <Callout variant="info" title={t.farming.worthKnowing}>
            {area.notes}
          </Callout>
        )}

        {area.suitedTo && area.suitedTo.length > 0 && (
          <Section title={t.farming.classesThatHandle}>
            <BulletList
              items={area.suitedTo.map((c) => (
                <Link key={c} href={r.class(c)} className="hover:text-ink">
                  {getClass(locale, c)?.name ?? c}
                </Link>
              ))}
            />
          </Section>
        )}
      </div>
    </Container>
  );
}
