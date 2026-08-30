import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Badge,
  BulletList,
  Callout,
  Card,
  Container,
  PageHeader,
  Section,
} from "@/components/ui";
import {
  ConfidenceNote,
  ItemRefLink,
  RichText,
  RuneSequence,
  RunewordBaseRule,
  StatLines,
} from "@/components/game";
import {
  getBuildsUsingItem,
  getRune,
  getRuneword,
  getRunewords,
} from "@/lib/registry";
import { progressionTiers, releaseLabels } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

/**
 * Every runeword is statically generated at build time. The content is plain
 * TypeScript, so there is no data fetching and no runtime cost.
 */
export function generateStaticParams() {
  return getRunewords().map((rw) => ({ slug: rw.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rw = getRuneword(slug);
  if (!rw) return {};

  const runeNames = rw.runes.map((r) => getRune(r)?.name ?? r).join(" + ");
  return {
    title: `${rw.name} — ${runeNames}`,
    description: `${rw.summary} ${rw.sockets}-socket ${rw.bases.display}, level ${rw.requiredLevel}.`,
  };
}

export default async function RunewordPage({ params }: Props) {
  const { slug } = await params;
  const rw = getRuneword(slug);
  if (!rw) notFound();

  const usedByBuilds = getBuildsUsingItem("runeword", rw.slug);
  const runeNames = rw.runes.map((r) => getRune(r)?.name ?? r).join(" + ");

  return (
    <Container className="py-10">
      <PageHeader
        eyebrow={
          <>
            <Link href="/runewords" className="hover:text-ink-muted">
              Runewords
            </Link>
            <span aria-hidden>/</span>
            <span>{progressionTiers[rw.tier].label}</span>
          </>
        }
        title={rw.name}
        description={rw.summary}
        meta={
          <>
            <Badge tone="ember">{runeNames}</Badge>
            <Badge tone="neutral">Level {rw.requiredLevel}</Badge>
            {rw.release && rw.release !== "lod" && (
              <Badge tone="outline">{releaseLabels[rw.release]}</Badge>
            )}
            <ConfidenceNote confidence={rw.confidence} />
          </>
        }
      />

      <div className="mt-8 space-y-10">
        {/* The base rule sits above everything else on purpose — it is the
            information that prevents the expensive mistake. */}
        <RunewordBaseRule runeword={rw} />

        <Section title="Runes, in socket order">
          <div className="rounded-lg border border-border bg-surface p-5">
            <RuneSequence runes={rw.runes} resolveRune={getRune} />
            <p className="mt-3 text-sm text-ink-muted">
              Socket left to right in exactly this order. A runeword socketed out of order
              produces nothing — the runes stay in the item as ordinary socket fillers, and
              you need a Hel rune and a Scroll of Town Portal to get the base back.
            </p>
          </div>
        </Section>

        <Section title="Statistics" description="As they appear on the finished item, including the individual rune contributions.">
          <Card>
            <StatLines stats={rw.stats} />
          </Card>
        </Section>

        {rw.recommendedBases && rw.recommendedBases.length > 0 && (
          <Section title="Which base to use">
            <BulletList items={rw.recommendedBases.map((b) => <RichText key={b}>{b}</RichText>)} />
          </Section>
        )}

        {rw.commonMistakes && rw.commonMistakes.length > 0 && (
          <Section title="Common mistakes">
            <Callout variant="warning">
              <ul className="space-y-2">
                {rw.commonMistakes.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span aria-hidden className="text-warning">
                      ✕
                    </span>
                    <span>
                      <RichText>{m}</RichText>
                    </span>
                  </li>
                ))}
              </ul>
            </Callout>
          </Section>
        )}

        {rw.usedBy && (
          <Section title="Who wants this">
            <p className="text-base leading-relaxed text-pretty text-ink-muted">
              <RichText>{rw.usedBy}</RichText>
            </p>
          </Section>
        )}

        {rw.notes && (
          <Callout variant="info" title="Worth knowing">
            <RichText>{rw.notes}</RichText>
          </Callout>
        )}

        {usedByBuilds.length > 0 && (
          <Section
            title="Builds that use it"
            description="Generated from the build data, so this list can never drift out of date."
          >
            <ul className="flex flex-wrap gap-2">
              {usedByBuilds.map((build) => (
                <li key={build.slug}>
                  <Link
                    href={`/builds/${build.classSlug}/${build.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                  >
                    {build.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="The runes">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[...new Set(rw.runes)].map((runeSlug) => {
              const rune = getRune(runeSlug);
              if (!rune) return null;
              return (
                <li key={runeSlug}>
                  <Card className="h-full">
                    <div className="flex items-baseline justify-between gap-2">
                      <ItemRefLink refItem={{ kind: "rune", slug: runeSlug }} />
                      <span className="font-mono text-xs text-ink-subtle">
                        {rune.requiredLevel > 0 ? `lvl ${rune.requiredLevel}` : "no level req"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{rune.summary}</p>
                    {rune.farmNotes && (
                      <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                        {rune.farmNotes}
                      </p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      </div>
    </Container>
  );
}
