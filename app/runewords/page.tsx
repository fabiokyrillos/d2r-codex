import type { Metadata } from "next";

import { Badge, Container, LinkCard, PageHeader, Section } from "@/components/ui";
import { RuneSequence, SocketDisplay } from "@/components/game";
import { getRune, getRunewords } from "@/lib/registry";
import { progressionTiers, tierOrder } from "@/lib/labels";
import type { ProgressionTier } from "@/lib/types";

export const metadata: Metadata = {
  title: "Runewords",
  description:
    "Every runeword with its exact rune order, required socket count, valid base types and explicit exclusions — so you never ruin a base again.",
};

export default function RunewordsPage() {
  const runewords = getRunewords();

  const byTier = tierOrder
    .map((tier) => ({
      tier,
      items: runewords.filter((rw) => rw.tier === tier),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Reference</span>}
        title="Runewords"
        description="Grouped by when they actually become relevant to a character, not alphabetically. Every entry states its exact socket count, rune order and which base types it will and will not work in."
        meta={
          <>
            <Badge tone="neutral">{runewords.length} documented</Badge>
            <Badge tone="outline">Verified stat lines</Badge>
          </>
        }
      />

      <div className="mt-10 space-y-12">
        {byTier.map(({ tier, items }) => (
          <Section
            key={tier}
            id={tier}
            title={progressionTiers[tier as ProgressionTier].label}
            description={progressionTiers[tier as ProgressionTier].context}
          >
            <ul className="grid gap-3 lg:grid-cols-2">
              {items.map((rw) => (
                <li key={rw.slug}>
                  <LinkCard href={`/runewords/${rw.slug}`} className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg text-rarity-runeword">{rw.name}</h3>
                      <div className="flex shrink-0 items-center gap-2">
                        <SocketDisplay count={rw.sockets} />
                        <span className="font-mono text-xs text-ink-subtle">
                          lvl {rw.requiredLevel}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {rw.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <RuneSequence runes={rw.runes} resolveRune={getRune} />
                    </div>

                    <p className="mt-3 border-t border-border pt-2.5 text-xs text-ink-subtle">
                      {rw.bases.display}
                    </p>
                  </LinkCard>
                </li>
              ))}
            </ul>
          </Section>
        ))}
      </div>
    </Container>
  );
}
