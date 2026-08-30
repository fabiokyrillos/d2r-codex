import type { Metadata } from "next";
import Link from "next/link";

import {
  Badge,
  Callout,
  Card,
  Container,
  DataTable,
  LinkCard,
  PageHeader,
  Section,
} from "@/components/ui";
import { getClass, getClasses, getJourneys } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Leveling",
  description:
    "Level 1 to Hell walkthroughs: which skill takes your next point, where stats go, when to respec, which runewords to make, and when you are ready for the next difficulty.",
};

export default function LevelingPage() {
  const journeys = getJourneys();
  const classes = getClasses();
  const documented = new Set(journeys.map((j) => j.classSlug));

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Leveling</span>}
        title="Level 1 to Hell"
        description="Walkthroughs organised by stage rather than by level. Ninety-nine pages would be unreadable; the decisions that actually matter cluster around skill unlocks, quest rewards and difficulty transitions."
      />

      <div className="mt-8 space-y-10">
        <Section title="Guides">
          <ul className="grid gap-4 sm:grid-cols-2">
            {journeys.map((journey) => {
              const cls = getClass(journey.classSlug);
              return (
                <li key={journey.classSlug}>
                  <LinkCard href={`/leveling/${journey.classSlug}`} className="h-full">
                    <h2 className="font-display text-xl text-ink transition-colors group-hover:text-ember-bright">
                      {cls?.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                      {journey.summary}
                    </p>
                    <p className="mt-3 text-xs text-ink-subtle">
                      {journey.stages.length} stages · level 1 to Hell farming
                    </p>
                  </LinkCard>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section
          title="Difficulty transitions"
          description="These are recommendations, not requirements. You can enter Nightmare at level 30 — it will just be unpleasant, and slower than levelling a little first."
        >
          <DataTable
            headers={["Milestone", "Recommended level", "Why"]}
            rows={[
              [
                "Normal Act 5 / The Ancients",
                "30+",
                "The Ancients cannot be skipped or teleported past, and they hit hard for Normal.",
              ],
              [
                "Enter Nightmare",
                "38–42",
                "Earlier is possible but slow going. Nightmare experience is far better than Normal's, so lingering past 45 wastes time.",
              ],
              [
                "Nightmare Act 4–5",
                "50+",
                "Monster levels climb steeply here. If you are struggling, farm Nightmare Countess or Mephisto instead of pushing.",
              ],
              [
                "Enter Hell",
                "60–65",
                "Below 60 the monster level gap hurts both your damage and your defence. This is the transition people rush and regret.",
              ],
              [
                "Hell Act 3 / Mephisto runs",
                "70+",
                "Once you can run Mephisto reliably you can stop progressing and start farming. Clearing all of Hell is optional.",
              ],
            ]}
          />
        </Section>

        <Section title="The resistance penalty">
          <Callout variant="warning" title="Plan for it before you arrive, not after">
            <p>
              Nightmare applies <strong>−40%</strong> to all your resistances. Hell applies{" "}
              <strong>−100%</strong>. These are flat subtractions from your total, and they
              are the single most common reason a character that felt fine suddenly starts
              dying.
            </p>
            <p className="mt-2">
              A character finishing Normal at 75% fire resistance begins Nightmare at 35%,
              and would begin Hell at −25%. Aim to arrive in each difficulty already able to
              reach 75% <em>after</em> the penalty.
            </p>
          </Callout>

          <div className="mt-4">
            <DataTable
              headers={["Difficulty", "Resistance penalty", "Death XP penalty"]}
              rows={[
                ["Normal", "None", "None"],
                ["Nightmare", "−40% to all resistances", "5% of the current level's experience"],
                ["Hell", "−100% to all resistances", "10% of the current level's experience"],
              ]}
              caption="Recovering your corpse returns 75% of the experience lost. Verified against The Arreat Summit."
            />
          </div>
        </Section>

        <Section
          title="Quest rewards worth going out of your way for"
          description="Each is repeatable once per difficulty, so the totals below are per difficulty — three times over a character's life."
        >
          <DataTable
            headers={["Quest", "Act", "Reward"]}
            rows={[
              ["Den of Evil", "1", "+1 skill point, and a free full respec"],
              ["Radament's Lair", "2", "+1 skill point (Book of Skills)"],
              ["The Fallen Angel (Izual)", "4", "+2 skill points"],
              ["Lam Esen's Tome", "3", "+5 stat points"],
              ["The Golden Bird", "3", "Potion of Life — permanent +20 maximum life"],
              ["Prison of Ice (Anya)", "5", "Scroll of Resistance — permanent +10 all resistances"],
              ["Tools of the Trade", "1", "Charsi imbue — turns an item into a high-tier rare"],
              ["Hellforge", "4", "Runes and gems; the Hell version can drop a high rune"],
            ]}
            caption="4 skill points and 5 stat points per difficulty. Across three difficulties: 12 skill points, 15 stat points, +30 all resistances and +60 life."
          />
          <div className="mt-4">
            <Card>
              <h3 className="font-display text-base text-ink">Save the Charsi imbue</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                The imbue rolls a rare item with high-tier affixes based on the item&rsquo;s
                level. Spending it on a level 11 item wastes it. Most players hold all three
                until they have a good circlet, amulet or class-specific base in the 60s.
              </p>
            </Card>
          </div>
        </Section>

        {classes.filter((c) => !documented.has(c.slug)).length > 0 && (
          <Section title="Classes awaiting leveling guides">
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
        )}
      </div>
    </Container>
  );
}
