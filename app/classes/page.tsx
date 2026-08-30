import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Callout, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { getBuilds, getClasses, getJourneys } from "@/lib/registry";
import { GAME_VERSION } from "@/lib/game-version";
import { releaseLabels } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "All eight Diablo II: Resurrected classes, including the Warlock added by Reign of the Warlock. Strengths, weaknesses, core mechanics and attribute tables.",
};

export default function ClassesPage() {
  const classes = getClasses();
  const builds = getBuilds();
  const journeys = getJourneys();

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Classes</span>}
        title="The eight classes"
        description="Diablo II had seven playable classes for twenty-five years. It now has eight."
        meta={<Badge tone="neutral">Patch {GAME_VERSION.patch}</Badge>}
      />

      <div className="mt-8 space-y-8">
        <Callout variant="warning" title="If a guide lists seven classes, it is out of date">
          The <strong>Warlock</strong> arrived with the <em>Reign of the Warlock</em>{" "}
          expansion in February 2026 — the first new Diablo II class in a quarter of a
          century. It requires a paid purchase beyond base D2R. Any guide still listing
          seven classes predates the expansion, which means its patch information is stale
          too.
        </Callout>

        <Section>
          <ul className="grid gap-4 md:grid-cols-2">
            {classes.map((cls) => {
              const classBuilds = builds.filter((b) => b.classSlug === cls.slug);
              const hasJourney = journeys.some((j) => j.classSlug === cls.slug);

              return (
                <li key={cls.slug}>
                  <LinkCard href={`/classes/${cls.slug}`} className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
                        {cls.name}
                      </h2>
                      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                        {cls.requiresDlc && <Badge tone="ember">Requires DLC</Badge>}
                        {cls.release !== "classic" && !cls.requiresDlc && (
                          <Badge tone="outline">{releaseLabels[cls.release]}</Badge>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {cls.summary}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-pretty text-ink-subtle">
                      <span className="text-ink-muted">Best for:</span> {cls.bestFor}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs">
                      <span className="text-ink-subtle">
                        Beginner friendliness {cls.beginnerFriendliness}/5
                      </span>
                      {classBuilds.length > 0 && (
                        <>
                          <span aria-hidden className="text-ink-subtle">·</span>
                          <span className="text-ember">
                            {classBuilds.length} build{classBuilds.length === 1 ? "" : "s"}
                          </span>
                        </>
                      )}
                      {hasJourney && (
                        <>
                          <span aria-hidden className="text-ink-subtle">·</span>
                          <span className="text-ember">Leveling guide</span>
                        </>
                      )}
                    </div>
                  </LinkCard>
                </li>
              );
            })}
          </ul>
        </Section>

        <Callout variant="info" title="Coverage">
          The Sorceress is fully documented — skills, a complete leveling journey and an
          endgame build with six-tier gear progression. The other seven classes currently
          have overview pages. Depth is being added one class at a time rather than
          publishing seven shallow guides at once.{" "}
          <Link href="/classes/sorceress" className="text-ember hover:text-ember-bright">
            See the reference implementation →
          </Link>
        </Callout>
      </div>
    </Container>
  );
}
