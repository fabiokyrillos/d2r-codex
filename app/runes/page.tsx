import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Container, DataTable, PageHeader, Section, Callout } from "@/components/ui";
import { getRunes, getRunewordsUsingRune } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Runes",
  description:
    "All 33 runes with their weapon, armor, helm and shield modifiers, required levels and Horadric Cube upgrade recipes.",
};

/**
 * A third of the runes behave differently in shields than in body armor, and
 * that difference decides real gearing choices — so the table splits them out
 * rather than cramming both into one cell with a slash.
 */
export default function RunesPage() {
  const runes = getRunes();

  const groups = [
    { label: "Low runes", range: [1, 11] as const, note: "El through Amn. Countess drops these freely in Normal." },
    { label: "Mid runes", range: [12, 20] as const, note: "Sol through Lem. Nightmare and Hell Countess, Lower Kurast chests." },
    { label: "Mid-high runes", range: [21, 25] as const, note: "Pul through Gul. Travincal, The Pit, area level 85 zones." },
    { label: "High runes", range: [26, 33] as const, note: "Vex through Zod. Travincal, Chaos Sanctuary, Worldstone Keep, high Terror Zones." },
  ];

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Reference</span>}
        title="Runes"
        description="All 33 runes. The socketed modifier depends on what you put the rune into, and shields frequently differ from body armor — the columns below keep them separate."
        meta={<Badge tone="outline">Verified against The Arreat Summit</Badge>}
      />

      <div className="mt-8 space-y-10">
        <Callout variant="info" title="Reading the table">
          Helms use the armor modifier. Shields are broken out separately because roughly a
          third of runes behave differently there — Shael gives 20% Faster Hit Recovery in a
          helm or body armor, but 20% Faster Block Rate in a shield.
        </Callout>

        {groups.map((group) => {
          const groupRunes = runes.filter(
            (r) => r.number >= group.range[0] && r.number <= group.range[1],
          );

          return (
            <Section key={group.label} title={group.label} description={group.note}>
              <DataTable
                headers={["Rune", "Lvl", "Weapon", "Armor / Helm", "Shield"]}
                rows={groupRunes.map((rune) => [
                  <Link
                    key={rune.slug}
                    href={`/runes/${rune.slug}`}
                    className="font-semibold text-rarity-rune hover:underline"
                  >
                    <span className="font-mono text-xs text-ink-subtle">
                      {String(rune.number).padStart(2, "0")}
                    </span>{" "}
                    {rune.name}
                  </Link>,
                  <span key="lvl" className="font-mono text-xs">
                    {rune.requiredLevel > 0 ? rune.requiredLevel : "—"}
                  </span>,
                  rune.weaponMod,
                  rune.armorMod,
                  <span
                    key="shield"
                    className={rune.shieldMod !== rune.armorMod ? "text-ink" : undefined}
                  >
                    {rune.shieldMod}
                  </span>,
                ])}
              />
            </Section>
          );
        })}

        <Section
          title="Upgrading runes"
          description="Runes El through Ort combine three-to-one with no gem. From Thul upward a gem is required, and from Pul upward the ratio improves to two-to-one."
        >
          <DataTable
            headers={["Recipe", "Result", "Runewords needing it"]}
            rows={runes
              .filter((r) => r.upgradeRecipe)
              .map((rune) => {
                const next = runes.find((r) => r.number === rune.number + 1);
                const consumers = next ? getRunewordsUsingRune(next.slug) : [];
                return [
                  <span key="r" className="font-mono text-xs">
                    {rune.upgradeRecipe}
                  </span>,
                  next ? (
                    <Link
                      key="n"
                      href={`/runes/${next.slug}`}
                      className="text-rarity-rune hover:underline"
                    >
                      {next.name}
                    </Link>
                  ) : (
                    "—"
                  ),
                  consumers.length > 0 ? (
                    <span key="c" className="text-xs">
                      {consumers.map((c) => c.name).join(", ")}
                    </span>
                  ) : (
                    <span key="c" className="text-xs text-ink-subtle">
                      —
                    </span>
                  ),
                ];
              })}
            caption="Source: The Arreat Summit Horadric Cube recipe list. Note the gem tiers — Chipped for the early steps, Flawed in the middle, then standard and Flawless gems for the high runes."
          />
        </Section>
      </div>
    </Container>
  );
}
