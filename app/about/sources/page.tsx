import type { Metadata } from "next";
import Link from "next/link";

import {
  Badge,
  Callout,
  Card,
  Container,
  DataTable,
  PageHeader,
  Section,
} from "@/components/ui";
import { GAME_VERSION } from "@/lib/game-version";

export const metadata: Metadata = {
  title: "Sources & research",
  description:
    "Where the numbers on this site come from, how they are verified, and what is still unconfirmed.",
};

export default function SourcesPage() {
  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={<span>About</span>}
        title="Sources & research"
        description="Accuracy matters more than coverage here. This page explains how content gets verified, and records what has not been confirmed yet."
        meta={
          <>
            <Badge tone="ember">
              Patch {GAME_VERSION.patch} · Season {GAME_VERSION.season}
            </Badge>
            <Badge tone="outline">Verified {GAME_VERSION.verifiedOn}</Badge>
          </>
        }
      />

      <div className="mt-8 space-y-10">
        <Section title="The version this site documents">
          <DataTable
            headers={["Fact", "Value"]}
            rows={[
              ["Patch", `${GAME_VERSION.patch} (client build ${GAME_VERSION.clientBuild})`],
              ["Ladder season", `Season ${GAME_VERSION.season}`],
              ["Season start", GAME_VERSION.seasonStart],
              ["Latest expansion", GAME_VERSION.expansion],
              ["Playable classes", "8 — including the Warlock"],
            ]}
          />
        </Section>

        <Section title="Source hierarchy">
          <p className="mb-4 text-base leading-relaxed text-pretty text-ink-muted">
            Not all sources are equal. Content is verified against the highest tier
            available for the claim in question.
          </p>
          <DataTable
            headers={["Tier", "Source", "Used for"]}
            rows={[
              [
                "1",
                "The game's own data files",
                "Area levels, monster levels, item base statistics. Extracted from levels.txt and related tables — this is the game itself, not a description of it.",
              ],
              [
                "2",
                "Blizzard official material",
                "Patch notes, expansion announcements, The Arreat Summit. Authoritative for what changed and when, though The Arreat Summit predates D2R and needs cross-checking for anything patched since.",
              ],
              [
                "3",
                "Structured community databases",
                "D2Runewizard and equivalents, for item statistics and breakpoint tables. Cross-checked against each other and against tier 1 where possible.",
              ],
              [
                "4",
                "Current build guides",
                "Maxroll, Icy Veins, DiabloBytes and similar, for build consensus and playstyle. Used for judgement, never as the sole source for a number.",
              ],
            ]}
          />
        </Section>

        <Section title="Two mistakes this site is built to avoid">
          <div className="space-y-4">
            <Card>
              <h3 className="font-display text-base text-ink">
                Mixing Classic and Lord of Destruction data
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                The game&rsquo;s <code className="font-mono">levels.txt</code> holds two
                parallel sets of monster-level columns — one for Classic Diablo II, one for
                the Lord of Destruction expansion. D2R uses the Expansion columns. Reading
                the wrong ones gives Ancient Tunnels a Hell area level of 67 instead of 85,
                which completely inverts the conclusion about whether the area is worth
                farming. Every area level here comes from the Expansion columns.
              </p>
            </Card>
            <Card>
              <h3 className="font-display text-base text-ink">
                Assuming Diablo II still has seven classes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                The Warlock shipped with <em>Reign of the Warlock</em> in February 2026, the
                first new class in twenty-five years. Any source listing seven classes
                predates the expansion — which also means it predates the Terror Zone rework,
                the Colossal Ancients, Grimoires, the loot filter and the new runewords.
                Class count is a useful freshness test for any D2 guide you read.
              </p>
            </Card>
          </div>
        </Section>

        <Section title="How disagreements are handled">
          <Callout variant="info" title="Documented, not resolved silently">
            <p>
              When reputable sources conflict, the page says so and explains the conflict
              rather than picking one and sounding confident. Two current examples:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-2">
                <span aria-hidden className="text-ember">·</span>
                <span>
                  <strong>Static Field and lightning resistance.</strong> The Diablo Wiki
                  states enemy Lightning Resistance reduces its effect; some build guides
                  state it ignores resistance entirely. The Static Field entry records both
                  positions rather than asserting one.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-ember">·</span>
                <span>
                  <strong>The Colossal Ancients statue count.</strong> Blizzard&rsquo;s own
                  announcement contradicts itself, saying both &ldquo;all five other
                  statues&rdquo; and &ldquo;all five statues&rdquo;. The{" "}
                  <Link
                    href="/mechanics/terror-zones"
                    className="text-ember hover:text-ember-bright"
                  >
                    Terror Zones page
                  </Link>{" "}
                  quotes both and avoids stating a number.
                </span>
              </li>
            </ul>
          </Callout>
        </Section>

        <Section title="Confidence labels">
          <p className="mb-4 text-base leading-relaxed text-pretty text-ink-muted">
            Content carries a confidence level. Verified is the baseline and is not
            displayed — surfacing a badge on every verified claim would just train readers to
            ignore it. Anything below verified is labelled.
          </p>
          <DataTable
            headers={["Level", "Meaning", "Shown in UI"]}
            rows={[
              ["Verified", "Cross-checked against two or more reputable sources, or trivially established", "No — this is the baseline"],
              ["Single source", "One reputable source, not contradicted anywhere", "Yes"],
              ["Community consensus", "Widely agreed among players, no authoritative confirmation", "Yes"],
              ["Unverified", "Believed correct but not confirmed", "Yes, prominently"],
            ]}
          />
        </Section>

        <Section title="Known gaps">
          <p className="mb-4 text-base leading-relaxed text-pretty text-ink-muted">
            Recorded so nothing gets written on unverified ground. These are tracked in{" "}
            <code className="font-mono text-sm">docs/research/00-game-state.md</code> in the
            repository.
          </p>
          <ul className="space-y-2.5">
            {[
              "Warlock skill tables — names, unlock levels, synergies and numeric values.",
              "Madawc's two unique jewels from the Colossal Ancients.",
              "The exact statue count for the Colossal Ancients recipe.",
              "What Latent Sunder Charms do, and how they differ from the original Sunder Charms.",
              "What Worldstone Shards are used for.",
              "Stat lines for the expansion runewords: Authority, Coven, Void, Vigilence and Ritual.",
              "The complete Terror Zone rotation group list.",
              "Increased Attack Speed tables, which depend on weapon base speed and specific skill.",
            ].map((gap) => (
              <li key={gap} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-warning" />
                <span className="text-pretty">{gap}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="On original writing">
          <p className="text-base leading-relaxed text-pretty text-ink-muted">
            Sources are researched, reconciled and then written from scratch. Nothing here
            is copied from another guide. Where a specific number comes from a specific
            place — a rune modifier from The Arreat Summit, an area level from the game
            files — the page names the source so a reader can check it themselves.
          </p>
        </Section>
      </div>
    </Container>
  );
}
