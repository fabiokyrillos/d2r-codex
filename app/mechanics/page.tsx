import type { Metadata } from "next";
import Link from "next/link";

import {
  Badge,
  Callout,
  Container,
  LinkCard,
  PageHeader,
  Section,
} from "@/components/ui";
import { ConfidenceNote } from "@/components/game";
import { getMechanics } from "@/lib/registry";
import type { MechanicCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Game mechanics",
  description:
    "Verified explanations of Diablo II: Resurrected systems — magic find diminishing returns, area levels and treasure classes, resistance penalties, immunities, sockets and Terror Zones.",
};

const CATEGORY_LABELS: Record<MechanicCategory, string> = {
  loot: "Loot & drops",
  combat: "Combat",
  defense: "Defence",
  character: "Character",
  endgame: "Endgame",
  items: "Items",
};

export default function MechanicsPage() {
  const articles = getMechanics();
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Reference</span>}
        title="Game mechanics"
        description="The systems underneath the guides. Where sources disagree or a value is unconfirmed, these pages say so rather than picking a number and sounding certain."
        meta={<Badge tone="neutral">{articles.length} articles</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title="Formulas, not vibes">
          Where a mechanic has a formula that changes how you gear, it is written out. Magic
          Find&rsquo;s diminishing returns curve is the clearest example — knowing that
          uniques use a factor of 250 tells you immediately why stacking past 300% is a
          losing trade.
        </Callout>

        {categories.map((category) => (
          <Section key={category} title={CATEGORY_LABELS[category]}>
            <ul className="grid gap-3 lg:grid-cols-2">
              {articles
                .filter((a) => a.category === category)
                .map((article) => (
                  <li key={article.slug}>
                    <LinkCard href={`/mechanics/${article.slug}`} className="h-full">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-display text-lg text-ink transition-colors group-hover:text-ember-bright">
                          {article.name}
                        </h2>
                        <ConfidenceNote confidence={article.confidence} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                        {article.summary}
                      </p>
                      <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                        {article.keyFacts.slice(0, 2).map((fact) => (
                          <li key={fact} className="flex gap-2 text-xs text-ink-subtle">
                            <span aria-hidden className="text-ember">
                              ·
                            </span>
                            <span className="text-pretty">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </LinkCard>
                  </li>
                ))}
            </ul>
          </Section>
        ))}

        <Section title="Also reference">
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/breakpoints", label: "Breakpoints" },
              { href: "/runes", label: "Runes & cube recipes" },
              { href: "/mercenaries", label: "Mercenaries" },
              { href: "/about/sources", label: "How we research this" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </Container>
  );
}
