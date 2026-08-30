import type { Metadata } from "next";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  DataTable,
  PageHeader,
  ProsCons,
  Section,
} from "@/components/ui";
import { ConfidenceNote, ItemRefLink } from "@/components/game";
import { getMercenaries } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Mercenaries",
  description:
    "Which mercenary to hire, in which difficulty, and what to give them. Auras, gear progression and survivability for all four mercenary types.",
};

export default function MercenariesPage() {
  const mercs = getMercenaries();

  return (
    <Container size="wide" className="py-10">
      <PageHeader
        eyebrow={<span>Reference</span>}
        title="Mercenaries"
        description="A well-geared mercenary is worth more than most of your own gear slots. A badly geared one dies constantly and contributes nothing."
      />

      <div className="mt-8 space-y-10">
        <Callout variant="warning" title="The difficulty you hire in is permanent">
          A mercenary&rsquo;s aura or skill is fixed by <strong>the difficulty you hired
          them in</strong>, and it never changes. They level up with you regardless, so
          hiring in Hell buys you nothing but a higher price.
          <p className="mt-2">
            <strong>Hire in Nightmare.</strong> That is where the aura selection is best for
            most builds, and the mercenary catches up to your level within an act or two.
          </p>
        </Callout>

        <Section
          title="Which one?"
          description="For the overwhelming majority of builds the answer is the Act 2 Desert Mercenary, and it is not close."
        >
          <DataTable
            headers={["Mercenary", "Gives you", "Uses", "Verdict"]}
            rows={[
              [
                "Act 2 Desert",
                "An aura that affects you too",
                "Polearms, spears",
                "The default. Insight and Infinity are why.",
              ],
              [
                "Act 1 Rogue",
                "Nothing for you",
                "Bows",
                "Safe and self-sufficient, but low damage and no aura.",
              ],
              [
                "Act 3 Iron Wolf",
                "Nothing for you",
                "Swords, shields",
                "The weakest option. Rarely correct.",
              ],
              [
                "Act 5 Barbarian",
                "Nothing for you",
                "One-handed weapons (dual-wield)",
                "The most durable, at the cost of Insight and every aura.",
              ],
            ]}
          />
        </Section>

        <Section title="The two items that matter most">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="font-display text-base text-ink">
                <ItemRefLink refItem={{ kind: "runeword", slug: "insight" }} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                A Meditation aura on your mercenary permanently solves caster mana. Four
                common runes and a 4-socket polearm. Make it the moment you can — it is the
                single highest-impact item in the whole setup.
              </p>
            </Card>
            <Card>
              <h3 className="font-display text-base text-ink">
                <ItemRefLink refItem={{ kind: "runeword", slug: "treachery" }} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                The 5% chance to cast Fade when struck is the best cheap survivability effect
                available. Fade grants a large resistance and damage-reduction buff, which
                keeps a mercenary alive in Hell far better than raw defence would.
              </p>
            </Card>
          </div>
        </Section>

        <div className="space-y-8">
          {mercs.map((merc) => (
            <section
              key={merc.slug}
              id={merc.slug}
              className="scroll-mt-24 border-t border-border pt-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl text-ink">{merc.name}</h2>
                <Badge tone="outline">Act {merc.act}</Badge>
                <ConfidenceNote confidence={merc.confidence} />
              </div>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-pretty text-ink-muted">
                {merc.summary}
              </p>

              <Card className="mt-4">
                <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                  When to hire
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {merc.hireAdvice}
                </p>
              </Card>

              <div className="mt-4">
                <ProsCons pros={merc.strengths} cons={merc.weaknesses} />
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-ink">Auras and abilities</h3>
                <DataTable
                  headers={["Ability", "Difficulty", "Effect"]}
                  rows={merc.abilities.map((a) => [
                    a.name,
                    <span key="d" className="text-xs capitalize">
                      {a.difficulty ?? "any"}
                    </span>,
                    a.description,
                  ])}
                />
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-ink">Gear</h3>
                <div className="space-y-3">
                  {merc.gear.map((g, i) => (
                    <div key={i} className="rounded-lg border border-border bg-surface p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs tracking-wide text-ink-subtle uppercase">
                          {g.slot}
                        </span>
                        <Badge tone={g.tier === "endgame" ? "ember" : "outline"}>
                          {g.tier}
                        </Badge>
                        {g.ref ? (
                          <ItemRefLink refItem={g.ref} />
                        ) : (
                          <span className="font-medium text-ink">{g.label}</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                        {g.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="mt-4">
                <h3 className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                  Keeping them alive
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-pretty text-ink-muted">
                  {merc.survivability}
                </p>
              </Card>

              {merc.notes && merc.notes.length > 0 && (
                <div className="mt-4">
                  <BulletList items={merc.notes} />
                </div>
              )}

              <p className="mt-4">
                <span className="text-sm text-ink-subtle">Best for: </span>
                <span className="text-sm text-ink-muted">{merc.bestFor}</span>
              </p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
