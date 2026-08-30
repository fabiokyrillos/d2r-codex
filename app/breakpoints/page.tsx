import type { Metadata } from "next";

import {
  Badge,
  BulletList,
  Callout,
  Container,
  DataTable,
  PageHeader,
  Section,
} from "@/components/ui";
import { RichText } from "@/components/game";
import { getBreakpointTables } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Breakpoints",
  description:
    "Faster Cast Rate, Faster Hit Recovery and Faster Block Rate breakpoint tables for every class, including the Warlock.",
};

const STAT_SECTIONS = [
  {
    stat: "fcr" as const,
    title: "Faster Cast Rate",
    description:
      "How quickly you cast — and, for a Sorceress, how quickly you Teleport. The single most important stat on most casters.",
  },
  {
    stat: "fhr" as const,
    title: "Faster Hit Recovery",
    description:
      "How long you are stuck in the flinch animation after taking a hit. Being stun-locked kills more characters than raw damage does.",
  },
  {
    stat: "fbr" as const,
    title: "Faster Block Rate",
    description:
      "How quickly you recover from a successful block. Only relevant if you are actually building for block.",
  },
];

export default function BreakpointsPage() {
  const tables = getBreakpointTables();

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Reference</span>}
        title="Breakpoints"
        description="Diablo II animations run at 25 frames per second, and speed stats do nothing at all until they cross a threshold that removes a whole frame."
        meta={<Badge tone="outline">Includes Warlock tables</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="warning" title="104% Faster Cast Rate is worth exactly as much as 63%">
          <p>
            Speed stats are not continuous. A Sorceress at 63% Faster Cast Rate casts in 9
            frames. At 104% she still casts in 9 frames. At 105% she casts in 8. Every point
            between 63 and 104 does <strong>nothing</strong>.
          </p>
          <p className="mt-2">
            This is why gear planning works backwards from a breakpoint rather than
            maximising a stat. Once you have hit your target, further Faster Cast Rate is
            wasted budget that could have been resistances or life.
          </p>
        </Callout>

        <Callout variant="info" title="Some classes have more than one table">
          The Sorceress&rsquo;s Lightning and Chain Lightning use a slower cast animation
          with entirely different thresholds — everything else she casts, including
          Teleport, uses the standard table. The Druid has separate tables for human,
          Werewolf and Werebear form. Planning gear against the wrong table is a common and
          expensive mistake.
        </Callout>

        {STAT_SECTIONS.map((section) => {
          const sectionTables = tables.filter((t) => t.stat === section.stat);
          if (sectionTables.length === 0) return null;

          return (
            <Section
              key={section.stat}
              id={section.stat}
              title={section.title}
              description={section.description}
            >
              <div className="space-y-8">
                {sectionTables.map((table) => (
                  <div key={table.slug}>
                    <div className="mb-2 flex flex-wrap items-baseline gap-2">
                      <h3 className="font-display text-lg text-ink">{table.name}</h3>
                      {table.variant && (
                        <Badge tone="ember">{table.variant}</Badge>
                      )}
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-ink-muted">
                      {table.summary}
                    </p>

                    <DataTable
                      headers={["Required", ...table.rows.map((r) => `${r.frames}f`)]}
                      rows={[
                        [
                          <span key="l" className="text-xs text-ink-subtle">
                            {table.stat.toUpperCase()} needed
                          </span>,
                          ...table.rows.map((r, i) => (
                            <span key={i} className="font-mono text-ink">
                              {r.value}%
                            </span>
                          )),
                        ],
                      ]}
                      caption="Frames per animation across the top; the percentage needed to reach each one below."
                    />

                    {table.guidance && table.guidance.length > 0 && (
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
            </Section>
          );
        })}

        <Section title="Increased Attack Speed">
          <Callout variant="warning" title="Deliberately not tabulated here">
            <p>
              Increased Attack Speed is genuinely more complicated than the other three. The
              frames you get depend on the <strong>weapon&rsquo;s own base speed</strong>,
              the <strong>specific attack skill</strong> you are using, and in some cases the{" "}
              <strong>class</strong> — a single table cannot express it, and every site that
              publishes one is simplifying to the point of being wrong for most setups.
            </p>
            <p className="mt-2">
              Rather than publish a table that would mislead, this page will get proper
              per-weapon coverage when the underlying data has been verified. Until then, use
              an attack-speed calculator that takes your specific weapon and skill as inputs.
            </p>
          </Callout>
        </Section>
      </div>
    </Container>
  );
}
