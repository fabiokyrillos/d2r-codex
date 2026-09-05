import Link from "next/link";

import { Badge, Callout, DataTable } from "@/components/ui";
import { RichText } from "@/components/game/rich-text";
import { SkillSigil } from "@/components/game/skill-sigil";
import { packageMath } from "@/lib/builds/packages";
import { fmt, formatPoints } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { allocationRoleLabels } from "@/lib/labels";
import { getSkill } from "@/lib/registry";
import { routes } from "@/lib/routes";
import { MAX_HARD_POINTS, hasSkillPages } from "@/lib/skills";
import type { Build, SkillPackage, SkillPackageGroup } from "@/lib/types";

/**
 * A build's optional packages: closed, costed alternatives for the points its
 * core does not spend.
 *
 * Entirely server-rendered, and deliberately not collapsible. The information
 * here *is* the plan — how much a route costs, what it leaves over, what it
 * takes away — and a page that hides half its plan behind a control is a page
 * that reads as finished while a reader with no JavaScript, no pointer or a
 * screen reader gets the summary. Everything below is present in the HTML,
 * reachable by tab, readable by voice and legible at 320px.
 *
 * Every number is derived in `lib/builds/packages.ts` from the allocations
 * beside it. Nothing here is authored arithmetic and nothing here knows a
 * class, a skill or an element.
 */

async function PackageCard({
  build,
  group,
  pkg,
  index,
}: {
  build: Build;
  group: SkillPackageGroup;
  pkg: SkillPackage;
  index: number;
}) {
  const { locale, t } = await getI18n();
  const r = routes(locale);
  const roles = allocationRoleLabels(t);
  const math = packageMath(build, pkg);
  const linkSkills = hasSkillPages(build.classSlug);
  const headingId = `package-${group.id}-${pkg.id}`;

  const rows = math.deltas.map((delta) => {
    const skill = getSkill(locale, delta.skill);
    const name = skill?.name ?? delta.skill;
    return [
      <span key="s" className="flex items-center gap-1.5 font-medium text-ink">
        {skill && <SkillSigil kind={skill.kind} element={skill.element} size={16} />}
        {linkSkills ? (
          <Link
            href={r.skill(build.classSlug, delta.skill)}
            className="hover:text-ember-bright"
          >
            {name}
          </Link>
        ) : (
          name
        )}
      </span>,
      <span key="f" className="font-mono text-xs whitespace-nowrap text-ink-muted">
        {/*
          From and to, not just the delta. A reader with a skill screen open is
          checking a final number; a reader planning is checking a cost. The
          arrow is the only place both appear together.
        */}
        {fmt(t.builds.packageFromTo, { from: delta.from, to: delta.to })}
      </span>,
      <span key="d" className="font-mono whitespace-nowrap text-ember">
        {fmt(t.builds.packageDelta, { points: delta.delta })}
      </span>,
      <Badge key="r" tone="outline">
        {roles[delta.role]}
      </Badge>,
      <span key="w">
        <RichText>{delta.note ?? skill?.summary ?? "—"}</RichText>
      </span>,
    ];
  });

  return (
    <article
      aria-labelledby={headingId}
      className="rounded-lg border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h4 id={headingId} className="font-display text-lg text-ink">
          {pkg.name}
        </h4>
        {group.choose === "one" && (
          <Badge tone="warning">
            {fmt(t.builds.packageOptionOf, { index: index + 1, total: group.packages.length })}
          </Badge>
        )}
        <Badge tone="ember">{formatPoints(t.builds.packageCost, math.cost)}</Badge>
      </div>

      {/*
        The arithmetic, on one line, in the order a reader does it: what the
        core already costs, what this adds, what that totals, what is left.
        `free` is printed even when it is zero — a package that closes exactly
        is a claim, and hiding the zero would make "no line here" mean both
        "nothing left" and "nobody worked it out".
      */}
      <p className="mt-3 rounded border border-border bg-surface-raised px-3 py-2 font-mono text-sm text-ink">
        {fmt(t.builds.packageArithmetic, {
          core: math.core,
          cost: math.cost,
          total: math.total,
          cap: MAX_HARD_POINTS,
        })}{" "}
        <span className={math.free > 0 ? "text-warning" : "text-ink-subtle"}>
          {fmt(t.builds.packageFree, { points: math.free })}
        </span>
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        <Fact term={t.builds.packageWhen} tone="ink">
          {pkg.when}
        </Fact>
        <Fact term={t.builds.packageTradeoff} tone="muted">
          {pkg.tradeoff}
        </Fact>
      </dl>

      <div className="mt-4">
        <DataTable
          caption={fmt(t.builds.packageTableCaption, { name: pkg.name })}
          headers={[
            t.builds.colSkill,
            t.builds.colPoints,
            t.builds.packageColCost,
            t.builds.colRole,
            t.builds.colWhy,
          ]}
          rows={rows}
        />
      </div>

      {pkg.remainderNote && (
        <div className="mt-4">
          <Callout variant="warning" title={t.builds.packageRemainder}>
            <RichText>{pkg.remainderNote}</RichText>
          </Callout>
        </div>
      )}

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {pkg.rotationNote && (
          <Fact term={t.builds.packageRotation} tone="muted">
            {pkg.rotationNote}
          </Fact>
        )}
        {pkg.gearNote && (
          <Fact term={t.builds.packageGear} tone="muted">
            {pkg.gearNote}
          </Fact>
        )}
        {pkg.statNote && (
          <Fact term={t.builds.packageStats} tone="muted">
            {pkg.statNote}
          </Fact>
        )}
        {pkg.contentNote && (
          <Fact term={t.builds.packageContent} tone="muted">
            {pkg.contentNote}
          </Fact>
        )}
      </dl>
    </article>
  );
}

/** A labelled fact inside a `<dl>`, so the label is read as one by a screen reader. */
function Fact({
  term,
  tone,
  children,
}: {
  term: string;
  tone: "ink" | "muted";
  children: string;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
        {term}
      </dt>
      <dd
        className={
          tone === "ink"
            ? "mt-1 leading-relaxed text-ink"
            : "mt-1 leading-relaxed text-ink-muted"
        }
      >
        <RichText>{children}</RichText>
      </dd>
    </div>
  );
}

export async function SkillPackages({ build }: { build: Build }) {
  const { t } = await getI18n();
  const groups = build.skillPackages ?? [];
  if (groups.length === 0) return null;

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`package-group-${group.id}`}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <h3 id={`package-group-${group.id}`} className="text-sm font-semibold text-ink">
              {group.name}
            </h3>
            {/*
              The exclusivity is a badge and a sentence, never only a badge: it
              is the single fact that stops this section reading as a list of
              things to buy.
            */}
            <Badge tone={group.choose === "one" ? "warning" : "info"}>
              {group.choose === "one"
                ? fmt(t.builds.packageChooseOne, { total: group.packages.length })
                : fmt(t.builds.packageChooseAny, { total: group.packages.length })}
            </Badge>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
            <RichText>{group.intro}</RichText>
          </p>
          <div className="mt-4 space-y-5">
            {group.packages.map((pkg, i) => (
              <PackageCard
                key={pkg.id}
                build={build}
                group={group}
                pkg={pkg}
                index={i}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
