import type { Metadata } from "next";
import Link from "next/link";

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
import { getBuilds, getClass, getClasses } from "@/lib/registry";
import { budgetLabels, playDifficultyLabels } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "Diablo II: Resurrected build guides with six-tier gear progression, exact skill allocation, breakpoint targets and farming recommendations.",
};

export default function BuildsPage() {
  const builds = getBuilds();
  const classes = getClasses();
  const documented = new Set(builds.map((b) => b.classSlug));

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Builds</span>}
        title="Build guides"
        description="Every build here is documented at six gear tiers, from a fresh character to best in slot — so the page is useful whatever you currently own."
      />

      <div className="mt-8 space-y-10">
        <Section>
          <ul className="grid gap-4 lg:grid-cols-2">
            {builds.map((build) => {
              const cls = getClass(build.classSlug);
              return (
                <li key={build.slug}>
                  <LinkCard
                    href={`/builds/${build.classSlug}/${build.slug}`}
                    className="h-full"
                  >
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
                      <Badge tone="outline">{budgetLabels[build.budget]}</Badge>
                      <Badge tone="outline">
                        {playDifficultyLabels[build.difficulty]}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-x-6 border-t border-border pt-3">
                      <Rating value={build.ratings.clearSpeed} label="Clear speed" />
                      <Rating value={build.ratings.magicFind} label="Magic find" />
                      <Rating value={build.ratings.survivability} label="Survivability" />
                      <Rating value={build.ratings.soloSelfFound} label="Self-found" />
                    </div>
                  </LinkCard>
                </li>
              );
            })}
          </ul>
        </Section>

        <Callout variant="info" title="Why so few builds?">
          One deeply researched, fully verified build is worth more than twelve shallow
          ones. The Blizzard Sorceress is the reference implementation: it exercises the
          entire schema — six gear tiers with alternatives per slot, breakpoint targets with
          reasoning, immunity planning, self-found and Hardcore notes — and every number on
          it has been checked against multiple sources. Additional builds follow that
          template rather than lowering the bar.
        </Callout>

        <Section title="Classes awaiting build guides">
          <ul className="flex flex-wrap gap-2">
            {classes
              .filter((c) => !documented.has(c.slug))
              .map((cls) => (
                <li key={cls.slug}>
                  <Link
                    href={`/classes/${cls.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                  >
                    {cls.name}
                    {cls.requiresDlc && <Badge tone="ember">DLC</Badge>}
                  </Link>
                </li>
              ))}
          </ul>
        </Section>
      </div>
    </Container>
  );
}
