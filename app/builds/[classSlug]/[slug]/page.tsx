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
import {
  ConfidenceNote,
  DifficultyBadge,
  ElementBadge,
  RichText,
} from "@/components/game";
import { GearProgression } from "@/components/game/gear-progression";
import {
  getBuild,
  getBuilds,
  getClass,
  getFarmingArea,
  getMercenary,
  getSkill,
} from "@/lib/registry";
import {
  budgetLabels,
  playDifficultyLabels,
  progressionTiers,
  ratingLabels,
} from "@/lib/labels";
import type { AllocationRole } from "@/lib/types";

type Props = { params: Promise<{ classSlug: string; slug: string }> };

export function generateStaticParams() {
  return getBuilds().map((b) => ({ classSlug: b.classSlug, slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const build = getBuild(slug);
  if (!build) return {};
  return { title: build.name, description: build.summary };
}

const roleLabels: Record<AllocationRole, string> = {
  main: "Core",
  synergy: "Synergy",
  utility: "Utility",
  prerequisite: "Prerequisite",
  flex: "Flexible",
};

export default async function BuildPage({ params }: Props) {
  const { classSlug, slug } = await params;
  const build = getBuild(slug);
  if (!build || build.classSlug !== classSlug) notFound();

  const cls = getClass(build.classSlug);
  const merc = build.mercenary ? getMercenary(build.mercenary) : undefined;

  const maxed = build.skills
    .filter((s) => s.points >= 20)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const onePoints = build.skills.filter((s) => s.points < 20);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/builds" className="hover:text-ink-muted">
              Builds
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/classes/${build.classSlug}`} className="hover:text-ink-muted">
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
            <Badge tone="outline">{budgetLabels[build.budget]}</Badge>
            <Badge tone="outline">{playDifficultyLabels[build.difficulty]}</Badge>
            <ConfidenceNote confidence={build.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-12">
        {/* ---------------------------------------------------------------- */}
        <Section title="How it plays">
          <p className="text-lg leading-relaxed text-pretty text-ink-muted">
            {build.playstyle}
          </p>
        </Section>

        <Section title="At a glance">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                Capability
              </h3>
              <div className="divide-y divide-border">
                <Rating value={build.ratings.clearSpeed} label="Clear speed" />
                <Rating value={build.ratings.bossing} label="Bossing" />
                <Rating value={build.ratings.survivability} label="Survivability" />
                <Rating value={build.ratings.magicFind} label="Magic find" />
              </div>
            </Card>
            <Card>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                Content
              </h3>
              <div className="divide-y divide-border">
                <Rating value={build.ratings.terrorZones} label="Terror Zones" />
                <Rating value={build.ratings.ubers} label="Ubers" />
                <Rating value={build.ratings.soloSelfFound} label="Solo self-found" />
                <Rating value={build.ratings.players8} label="8-player games" />
              </div>
            </Card>
          </div>
          <p className="mt-3 text-xs text-ink-subtle">
            Ratings are coarse on purpose — 1 is {ratingLabels[1]}, 5 is {ratingLabels[5]}. A
            finer scale would imply a precision this data does not have.
          </p>
        </Section>

        <Section title="Strengths and weaknesses">
          <ProsCons pros={build.strengths} cons={build.weaknesses} />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {build.levelingPath && (
          <Section title="Getting there">
            <Callout variant="warning" title="Do not level as this build">
              <RichText>{build.levelingPath.summary}</RichText>
              {build.levelingPath.respecAt && (
                <p className="mt-2">
                  <strong>Respec at:</strong> {build.levelingPath.respecAt}
                </p>
              )}
              <p className="mt-2">
                <Link
                  href={`/leveling/${build.classSlug}`}
                  className="text-ember hover:text-ember-bright"
                >
                  Full leveling walkthrough →
                </Link>
              </p>
            </Callout>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}
        <Section
          id="skills"
          title="Skills"
          description="Maxing order matters more than the final totals — it determines how the build feels for the fifty levels before it is finished."
        >
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Max these, in this order</h3>
              <DataTable
                headers={["#", "Skill", "Points", "Why"]}
                rows={maxed.map((alloc, i) => {
                  const skill = getSkill(alloc.skill);
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
                    <span key="w">{alloc.note ?? roleLabels[alloc.role]}</span>,
                  ];
                })}
              />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">One point each</h3>
              <DataTable
                headers={["Skill", "Role", "Why"]}
                rows={onePoints.map((alloc) => {
                  const skill = getSkill(alloc.skill);
                  return [
                    <span key="s" className="font-medium text-ink">
                      {skill?.name ?? alloc.skill}
                    </span>,
                    <Badge key="r" tone="outline">
                      {roleLabels[alloc.role]}
                    </Badge>,
                    <span key="w">{alloc.note ?? skill?.summary ?? "—"}</span>,
                  ];
                })}
              />
            </div>

            {build.flexPoints && build.flexPoints.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-ink">Remaining points</h3>
                <BulletList
                  items={build.flexPoints.map((f, i) => (
                    <RichText key={i}>{f}</RichText>
                  ))}
                />
              </div>
            )}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section id="stats" title="Stats">
          <DataTable
            headers={["Attribute", "Allocation"]}
            rows={[
              ["Strength", build.stats.strength],
              ["Dexterity", build.stats.dexterity],
              ["Vitality", build.stats.vitality],
              ["Energy", build.stats.energy],
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

        {/* ---------------------------------------------------------------- */}
        <Section
          id="breakpoints"
          title="Breakpoints"
          description="Speed stats do nothing until they cross a threshold. These are the ones that matter for this build."
        >
          <DataTable
            headers={["Stat", "Target", "Frames", "Priority", "Why"]}
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
                {bp.priority}
              </Badge>,
              <span key="w">{bp.why}</span>,
            ])}
          />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {build.immunityPlan && (
          <Section id="immunities" title="Dealing with immunities">
            <Callout variant="warning" title="The build's real constraint">
              <RichText>{build.immunityPlan}</RichText>
            </Callout>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}
        <Section
          id="gear"
          title="Gear progression"
          description="Six tiers. Find the one that matches what you actually own, then read the 'what to fix next' box at the bottom of it."
        >
          <GearProgression gearSets={build.gearSets} />
        </Section>

        {/* ---------------------------------------------------------------- */}
        {merc && (
          <Section id="mercenary" title="Mercenary">
            <Card>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg text-ink">
                  <Link href="/mercenaries" className="hover:text-ember-bright">
                    {merc.name}
                  </Link>
                </h3>
                <Badge tone="outline">Act {merc.act}</Badge>
              </div>
              {build.mercenaryNotes && (
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  <RichText>{build.mercenaryNotes}</RichText>
                </p>
              )}
              <div className="mt-4 border-t border-border pt-3">
                <h4 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                  Gear
                </h4>
                <ul className="mt-2 space-y-2">
                  {merc.gear.map((g, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="w-16 shrink-0 text-xs text-ink-subtle capitalize">
                        {g.slot}
                      </span>
                      <Badge tone="outline">{g.tier}</Badge>
                      <span className="font-medium text-ink">
                        {g.ref ? g.ref.slug.replace(/-/g, " ") : g.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">
                  <Link href="/mercenaries" className="text-ember hover:text-ember-bright">
                    Full mercenary guide →
                  </Link>
                </p>
              </div>
            </Card>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}
        <Section
          id="farming"
          title="Where to farm"
          description="Ordered by how well this specific build handles the area, with the gear tier you need before it is realistic."
        >
          <div className="space-y-3">
            {build.farming.map((entry, i) => {
              const area = getFarmingArea(entry.area);
              return (
                <Card key={`${entry.area}-${entry.difficulty}-${i}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base">
                      <Link
                        href={`/farming/${entry.area}`}
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
                      <Badge tone="outline">
                        {progressionTiers[entry.minTier].label}+
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                    {entry.why}
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <div className="grid gap-4 sm:grid-cols-2">
          {build.selfFoundNotes && (
            <Card>
              <h3 className="font-display text-base text-ink">Solo self-found</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {build.selfFoundNotes}
              </p>
            </Card>
          )}
          {build.hardcoreNotes && (
            <Card>
              <h3 className="font-display text-base text-ink">Hardcore</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                {build.hardcoreNotes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
