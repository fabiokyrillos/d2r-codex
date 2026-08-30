import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  PageHeader,
  Section,
  cn,
} from "@/components/ui";
import { DifficultyBadge, ItemRefLink, RichText } from "@/components/game";
import { GearPickView } from "@/components/game";
import { getBuild, getClass, getJourney, getJourneys } from "@/lib/registry";
import { actionKindMeta } from "@/lib/labels";
import type { ProgressionAction, ProgressionStage } from "@/lib/types";

type Props = { params: Promise<{ classSlug: string }> };

export function generateStaticParams() {
  return getJourneys().map((j) => ({ classSlug: j.classSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classSlug } = await params;
  const journey = getJourney(classSlug);
  const cls = getClass(classSlug);
  if (!journey || !cls) return {};
  return {
    title: `${cls.name} leveling guide`,
    description: journey.summary,
  };
}

export default async function LevelingPage({ params }: Props) {
  const { classSlug } = await params;
  const journey = getJourney(classSlug);
  const cls = getClass(classSlug);
  if (!journey || !cls) notFound();

  const targetBuild = journey.targetBuild ? getBuild(journey.targetBuild) : undefined;
  const stages = [...journey.stages].sort((a, b) => a.order - b.order);

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/leveling" className="hover:text-ink-muted">
              Leveling
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/classes/${cls.slug}`} className="hover:text-ink-muted">
              {cls.name}
            </Link>
          </>
        }
        title={`${cls.name} — level 1 to Hell`}
        description={journey.summary}
        meta={
          <>
            <Badge tone="ember">{stages.length} stages</Badge>
            {targetBuild && (
              <Badge tone="outline">Leads to {targetBuild.name}</Badge>
            )}
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title="Before you start">
          <div className="space-y-4">
            {journey.overview.map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-pretty text-ink-muted">
                <RichText>{para}</RichText>
              </p>
            ))}
          </div>
        </Section>

        {/* Stage jump nav — no JS, deep-linkable, and it doubles as a
            progress overview of the whole character's life. */}
        <nav
          aria-label="Stages"
          className="sticky top-14 z-30 -mx-1 rounded-lg border border-border bg-abyss/90 px-1 py-2 backdrop-blur-md"
        >
          <ol className="flex gap-1 overflow-x-auto">
            {stages.map((stage) => (
              <li key={stage.slug} className="shrink-0">
                <a
                  href={`#${stage.slug}`}
                  className="flex flex-col rounded px-3 py-1.5 transition-colors hover:bg-surface-raised"
                >
                  <span className="font-mono text-[10px] text-ember">
                    {stage.levels[0]}–{stage.levels[1]}
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap text-ink-muted">
                    {stage.name}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {stages.map((stage, i) => (
            <StageView key={stage.slug} stage={stage} index={i} />
          ))}
        </div>

        {journey.respecPlan && journey.respecPlan.length > 0 && (
          <Section
            title="Respec planning"
            description="You get one free respec per difficulty from the Den of Evil quest — three per character. Spend them deliberately."
          >
            <div className="space-y-3">
              {journey.respecPlan.map((r) => (
                <Card key={r.at}>
                  <p className="font-display text-base text-ember">{r.at}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                    {r.why}
                  </p>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {targetBuild && (
          <Callout variant="info" title="Where this leads">
            This journey levels into the{" "}
            <Link
              href={`/builds/${targetBuild.classSlug}/${targetBuild.slug}`}
              className="text-ember hover:text-ember-bright"
            >
              {targetBuild.name}
            </Link>
            . Its gear progression picks up exactly where this guide leaves off.
          </Callout>
        )}
      </div>
    </Container>
  );
}

/**
 * One stage of the journey.
 *
 * The layout answers the four questions a player has at any moment, in the
 * order they ask them: where am I, what am I killing with, where do my points
 * go, and what should I actually do.
 */
function StageView({ stage, index }: { stage: ProgressionStage; index: number }) {
  return (
    <section id={stage.slug} className="scroll-mt-32">
      <header className="border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-xs text-ember">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="font-display text-2xl text-ink">{stage.name}</h2>
          <Badge tone="ember">
            Levels {stage.levels[0]}–{stage.levels[1]}
          </Badge>
          <DifficultyBadge difficulty={stage.difficulty} />
        </div>
        <p className="mt-2 text-sm text-ink-subtle">{stage.location}</p>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-pretty text-ink-muted">
          {stage.summary}
        </p>
      </header>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
            Goal
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">{stage.goal}</p>
        </Card>
        <Card>
          <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
            Killing with
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">{stage.killingWith}</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-el-magic">
            <span aria-hidden>◆</span> Skill points
          </h3>
          <BulletList
            items={stage.skillPoints.map((s, i) => (
              <RichText key={i}>{s}</RichText>
            ))}
            marker="muted"
          />
        </Card>
        <Card>
          <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-info">
            <span aria-hidden>▲</span> Stat points
          </h3>
          <BulletList
            items={stage.statPoints.map((s, i) => (
              <RichText key={i}>{s}</RichText>
            ))}
            marker="muted"
          />
        </Card>
      </div>

      {stage.actions.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2.5 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
            What to do
          </h3>
          <ul className="space-y-2.5">
            {stage.actions.map((action, i) => (
              <ActionRow key={i} action={action} />
            ))}
          </ul>
        </div>
      )}

      {stage.gearTargets && stage.gearTargets.length > 0 && (
        <Card className="mt-4">
          <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
            Gear to hunt during this stage
          </h3>
          <div className="mt-3 space-y-4">
            {stage.gearTargets.map((pick, i) => (
              <GearPickView key={i} pick={pick} />
            ))}
          </div>
        </Card>
      )}

      {stage.exitCriteria && (
        <div className="mt-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-success uppercase">
            Ready to move on when
          </p>
          <p className="mt-1 text-sm leading-relaxed text-pretty text-ink-muted">
            {stage.exitCriteria}
          </p>
        </div>
      )}
    </section>
  );
}

function ActionRow({ action }: { action: ProgressionAction }) {
  const meta = actionKindMeta[action.kind];
  const emphasised = action.kind === "warning" || action.kind === "transition";

  return (
    <li
      className={cn(
        "flex gap-3 rounded-lg border px-3.5 py-2.5",
        emphasised
          ? "border-danger/30 bg-danger/5"
          : "border-border bg-surface",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded font-mono text-xs",
          meta.tone,
          "bg-surface-overlay",
        )}
        title={meta.label}
      >
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-pretty text-ink-muted">
          <RichText>{action.text}</RichText>
        </p>
        {(action.refs?.length || action.atLevel || action.optional) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {action.atLevel && (
              <Badge tone="outline">Level {action.atLevel}</Badge>
            )}
            {action.optional && <Badge tone="neutral">Optional</Badge>}
            {action.refs?.map((ref, i) => (
              <ItemRefLink key={i} refItem={ref} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
