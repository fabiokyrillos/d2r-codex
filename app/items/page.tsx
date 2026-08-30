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
import { getUniques } from "@/lib/registry";
import { qualityColors } from "@/lib/labels";
import type { BaseCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Items",
  description:
    "Unique and set items with verified statistics, roll ranges, drop information and the builds that use them.",
};

const GROUPS: { label: string; categories: BaseCategory[] }[] = [
  { label: "Helms", categories: ["helm", "circlet", "barbarian-helm", "druid-pelt"] },
  { label: "Body armor", categories: ["body-armor"] },
  { label: "Weapons & orbs", categories: ["orb", "dagger", "sword", "staff", "wand", "mace"] },
  { label: "Shields", categories: ["shield", "paladin-shield", "necromancer-head"] },
  { label: "Gloves, belts & boots", categories: ["gloves", "belt", "boots"] },
  { label: "Jewellery", categories: ["ring", "amulet"] },
];

export default function ItemsPage() {
  const uniques = getUniques();

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Reference</span>}
        title="Items"
        description="Statistics are written as the game rolls them, with ranges intact — knowing a Nightwing's Veil rolls 8-15% cold damage tells you far more than an average would."
        meta={<Badge tone="neutral">{uniques.length} items</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title="Why this list is short">
          Items get catalogued when a guide needs them, and every entry has been verified
          against an item database. Transcribing several hundred uniques from memory would
          fill the page faster and get numbers wrong, which is the one thing this project
          cannot afford.
        </Callout>

        {GROUPS.map((group) => {
          const items = uniques.filter((u) => group.categories.includes(u.category));
          if (items.length === 0) return null;

          return (
            <Section key={group.label} title={group.label}>
              <ul className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                  <li key={item.slug}>
                    <LinkCard href={`/items/${item.slug}`} className="h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3
                            className={`font-display text-lg ${qualityColors[item.quality]}`}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs text-ink-subtle">{item.base}</p>
                        </div>
                        {item.requiredLevel && (
                          <span className="shrink-0 font-mono text-xs text-ink-subtle">
                            lvl {item.requiredLevel}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                        {item.summary}
                      </p>
                    </LinkCard>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })}

        <Section title="Related">
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/runewords", label: "Runewords" },
              { href: "/runes", label: "Runes" },
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
